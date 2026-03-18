const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Ticket = require('../models/Ticket');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/feedback
// @desc    Submit feedback for a resolved ticket
// @access  Private (user)
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { ticketId, rating, comments } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['resolved', 'closed'].includes(ticket.status)) {
      return res.status(400).json({ message: 'Feedback can only be submitted for resolved or closed tickets' });
    }

    const existing = await Feedback.findOne({ ticket: ticketId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted for this ticket' });

    const feedback = await Feedback.create({ ticket: ticketId, user: req.user._id, rating, comments });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (admin)
// @access  Private (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .populate('ticket', 'title category')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
