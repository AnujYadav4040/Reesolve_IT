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

// @route   POST /api/tickets/predict-priority
// @desc    Predict ticket priority using Machine Learning (natural NLP)
// @access  Private (user, admin)
router.post('/predict-priority', protect, (req, res) => {
  const { description } = req.body;
  const aiPredictedPriority = predictPriority('mock', description); // We will update aiPriorityController to use mlService
  res.json({ priority: aiPredictedPriority });
});

const MLService = require('../services/mlService');

// @route   GET /api/tickets/suggestions
// @desc    Get ticket resolution suggestions based on text search
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 3) {
      return res.json([]);
    }

    const suggestions = await Ticket.find(
      { 
        $text: { $search: query }, 
        status: { $in: ['resolved', 'closed'] },
        resolutionNote: { $exists: true, $ne: '' }
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(3)
    .select('title resolutionNote category');

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tickets
// @desc    Create a new ticket (User)
// @access  Private (user)
router.post('/', protect, authorize('user', 'admin'), async (req, res) => {
  try {
    const { title, description } = req.body; // Category is now auto-determined

    // Advanced AI Machine Learning 
    const textContext = `${title} ${description}`;
    let aiPredictedPriority = MLService.predictPriority(textContext).toLowerCase();
    const aiPredictedCategory = MLService.predictCategory(textContext).toLowerCase();
    
    // Sentiment Analysis
    const sentimentResult = MLService.analyzeSentiment(textContext);
    
    // Auto-escalate if user is highly frustrated/negative
    if (sentimentResult.sentiment === 'negative' && (aiPredictedPriority === 'low' || aiPredictedPriority === 'medium')) {
      aiPredictedPriority = 'high';
    }

    // Time Predictor
    const estimatedResolutionTime = MLService.predictResolutionTime(aiPredictedPriority, aiPredictedCategory);

    // Auto-Assignment Logic: Find an available tech with matching skills, least loaded first
    let assignedTechnicianId = null;
    let initialStatus = 'open';

    const techs = await Technician.find({ availabilityStatus: 'available' });
    if (techs.length > 0) {
      // Find techs with matching skill (or 'other' / fallback)
      const matchingTechs = techs.filter(t => t.skillSet && t.skillSet.map(s => s.toLowerCase()).includes(aiPredictedCategory));
      
      let bestTech = null;
      if (matchingTechs.length > 0) {
        // Find the one with fewest assigned tickets
        bestTech = matchingTechs.reduce((prev, curr) => (prev.assignedTickets.length < curr.assignedTickets.length ? prev : curr));
      } else {
        // Fallback: strictly assign to ANY available tech if load balancing is extreme (or choose not to)
        // Let's just assign to the least loaded available tech if no skill match
        bestTech = techs.reduce((prev, curr) => (prev.assignedTickets.length < curr.assignedTickets.length ? prev : curr));
      }

      if (bestTech) {
        assignedTechnicianId = bestTech._id;
        initialStatus = 'in-progress';
      }
    }

    // Duplicate Detection Logic
    // Fetch tickets created in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const recentTickets = await Ticket.find({
      createdAt: { $gte: twoHoursAgo },
      category: aiPredictedCategory,
      status: { $in: ['open', 'in-progress'] }
    });

    const duplicateParentId = MLService.findDuplicate(title, recentTickets);
    let isDuplicate = false;
    let parentTicket = null;

    if (duplicateParentId) {
      isDuplicate = true;
      parentTicket = duplicateParentId;
      // If it's a duplicate, we don't necessarily need to assign it to a tech right away, 
      // but we will keep the auto-assignment for simplicity.
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: aiPredictedCategory,
      priority: aiPredictedPriority,
      aiPredictedPriority,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.score,
      estimatedResolutionTime,
      isDuplicate,
      parentTicket,
      status: initialStatus,
      technician: assignedTechnicianId,
      user: req.user._id,
    });

    if (assignedTechnicianId) {
      // Update chosen technician
      await Technician.findByIdAndUpdate(assignedTechnicianId, { $push: { assignedTickets: ticket._id } });
      await logActivity(ticket._id, req.user._id, `AI Auto-Assigned ticket to Technician`);
    }

    await logActivity(ticket._id, req.user._id, 'Ticket created');

    // Real-time notifications
    const io = req.app.get('io');
    io.emit('new_ticket', { ticket, message: `New ticket: ${title}` });
    
    if (assignedTechnicianId) {
      io.emit('ticket_assigned', { ticketId: ticket._id, technicianId: assignedTechnicianId });
    }

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
