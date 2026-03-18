const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/activity/:ticketId
// @desc    Get activity logs for a ticket
// @access  Private
router.get('/:ticketId', protect, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ ticket: req.params.ticketId })
      .populate('performedBy', 'name role')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
