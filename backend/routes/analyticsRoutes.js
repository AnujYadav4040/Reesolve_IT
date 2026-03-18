const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Technician = require('../models/Technician');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/analytics/tickets-by-status
// @access  Private (admin)
router.get('/tickets-by-status', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/tickets-by-category
// @access  Private (admin)
router.get('/tickets-by-category', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/tickets-by-priority
// @access  Private (admin)
router.get('/tickets-by-priority', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/tickets-trend
// @desc    Monthly ticket creation trend (last 6 months)
// @access  Private (admin)
router.get('/tickets-trend', protect, authorize('admin'), async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Ticket.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/technician-performance
// @access  Private (admin)
router.get('/technician-performance', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      { $match: { technician: { $ne: null } } },
      {
        $group: {
          _id: '$technician',
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        },
      },
    ]);

    const populated = await Technician.populate(data, {
      path: '_id',
      populate: { path: 'user', select: 'name' },
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/avg-rating
// @access  Private (admin)
router.get('/avg-rating', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]);
    res.json(result[0] || { avgRating: 0, total: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
