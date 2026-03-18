const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/admin/dashboard
// @desc    Admin dashboard summary stats
// @access  Private (admin)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      totalUsers,
      totalTechnicians,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in-progress' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.countDocuments({ status: 'closed' }),
      User.countDocuments({ role: 'user' }),
      Technician.countDocuments(),
    ]);

    const criticalTickets = await Ticket.find({ priority: 'critical', status: { $ne: 'closed' } })
      .populate('user', 'name department')
      .limit(5);

    const recentTickets = await Ticket.find()
      .populate('user', 'name department')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: { totalTickets, openTickets, inProgressTickets, resolvedTickets, closedTickets, totalUsers, totalTechnicians },
      criticalTickets,
      recentTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/auto-assign/:ticketId
// @desc    Auto-assign ticket to least-busy available technician
// @access  Private (admin)
router.post('/auto-assign/:ticketId', protect, authorize('admin'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Find technician with least assigned tickets and matching skill
    const technicians = await Technician.find({ availabilityStatus: 'available' });

    if (technicians.length === 0) {
      return res.status(400).json({ message: 'No available technicians at the moment' });
    }

    // Sort by assigned tickets count (ascending)
    technicians.sort((a, b) => a.assignedTickets.length - b.assignedTickets.length);

    // Prefer skill match
    const matchedTech = technicians.find((t) => t.skillSet.includes(ticket.category)) || technicians[0];

    ticket.technician = matchedTech._id;
    ticket.status = 'in-progress';
    await ticket.save();

    matchedTech.assignedTickets.push(ticket._id);
    await matchedTech.save();

    const io = req.app.get('io');
    io.emit('ticket_assigned', { ticketId: ticket._id, technicianId: matchedTech._id });

    res.json({ message: 'Ticket auto-assigned successfully', ticket, technician: matchedTech });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
