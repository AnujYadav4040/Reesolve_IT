const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const ActivityLog = require('../models/ActivityLog');
const Technician = require('../models/Technician');
const { protect, authorize } = require('../middleware/authMiddleware');
const { predictPriority } = require('../controllers/aiPriorityController');

// Helper: log activity
const logActivity = async (ticketId, userId, action) => {
  await ActivityLog.create({ ticket: ticketId, performedBy: userId, actionPerformed: action });
};

// @route   POST /api/tickets
// @desc    Create a new ticket (User)
// @access  Private (user)
router.post('/', protect, authorize('user', 'admin'), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // AI Priority Prediction
    const aiPredictedPriority = predictPriority(title, description);

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: aiPredictedPriority,
      aiPredictedPriority,
      user: req.user._id,
    });

    await logActivity(ticket._id, req.user._id, 'Ticket created');

    // Real-time notification to admin room
    const io = req.app.get('io');
    io.emit('new_ticket', { ticket, message: `New ticket: ${title}` });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tickets
// @desc    Get tickets (role-based)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'user') {
      query.user = req.user._id;
    } else if (req.user.role === 'technician') {
      const tech = await Technician.findOne({ user: req.user._id });
      if (tech) query.technician = tech._id;
    }
    // admin sees all

    const { status, category, priority, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query)
      .populate('user', 'name email department')
      .populate({ path: 'technician', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Ticket.countDocuments(query);

    res.json({ tickets, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email department contactNumber')
      .populate({ path: 'technician', populate: { path: 'user', select: 'name email' } });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Access control
    if (req.user.role === 'user' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const logs = await ActivityLog.find({ ticket: ticket._id })
      .populate('performedBy', 'name role')
      .sort({ timestamp: -1 });

    res.json({ ticket, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status (technician/admin)
// @access  Private (technician, admin)
router.put('/:id/status', protect, authorize('technician', 'admin'), async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const oldStatus = ticket.status;
    ticket.status = status;
    if (resolutionNote) ticket.resolutionNote = resolutionNote;
    if (status === 'resolved') ticket.resolvedDate = new Date();
    if (status === 'closed') ticket.closedDate = new Date();

    await ticket.save();
    await logActivity(ticket._id, req.user._id, `Status changed from '${oldStatus}' to '${status}'`);

    // Notify user in real-time
    const io = req.app.get('io');
    io.to(ticket._id.toString()).emit('ticket_updated', {
      ticketId: ticket._id,
      status,
      message: `Your ticket "${ticket.title}" status updated to ${status}`,
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tickets/:id/assign
// @desc    Assign ticket to technician (admin)
// @access  Private (admin)
router.put('/:id/assign', protect, authorize('admin'), async (req, res) => {
  try {
    const { technicianId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const technician = await Technician.findById(technicianId);
    if (!technician) return res.status(404).json({ message: 'Technician not found' });

    ticket.technician = technicianId;
    ticket.status = 'in-progress';
    await ticket.save();

    // Update technician assigned list
    if (!technician.assignedTickets.includes(ticket._id)) {
      technician.assignedTickets.push(ticket._id);
      await technician.save();
    }

    await logActivity(ticket._id, req.user._id, `Ticket assigned to technician`);

    const io = req.app.get('io');
    io.emit('ticket_assigned', { ticketId: ticket._id, technicianId });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tickets/:id/priority
// @desc    Override ticket priority (admin)
// @access  Private (admin)
router.put('/:id/priority', protect, authorize('admin'), async (req, res) => {
  try {
    const { priority } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    await logActivity(ticket._id, req.user._id, `Priority updated to '${priority}'`);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
