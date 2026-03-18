const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/technicians
// @desc    Get all technicians
// @access  Private (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const technicians = await Technician.find()
      .populate('user', 'name email department contactNumber')
      .populate('assignedTickets', 'title status priority');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/technicians/available
// @desc    Get available technicians
// @access  Private (admin)
router.get('/available', protect, authorize('admin'), async (req, res) => {
  try {
    const technicians = await Technician.find({ availabilityStatus: 'available' })
      .populate('user', 'name email');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/technicians/me
// @desc    Get own technician profile
// @access  Private (technician)
router.get('/me', protect, authorize('technician'), async (req, res) => {
  try {
    const tech = await Technician.findOne({ user: req.user._id })
      .populate('user', 'name email department')
      .populate('assignedTickets');
    if (!tech) return res.status(404).json({ message: 'Technician profile not found' });
    res.json(tech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/technicians/availability
// @desc    Update availability status
// @access  Private (technician)
router.put('/availability', protect, authorize('technician'), async (req, res) => {
  try {
    const { availabilityStatus } = req.body;
    const tech = await Technician.findOneAndUpdate(
      { user: req.user._id },
      { availabilityStatus },
      { new: true }
    );
    if (!tech) return res.status(404).json({ message: 'Technician not found' });
    res.json(tech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/technicians
// @desc    Add a new technician and user profile
// @access  Private (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, department, contactNumber, skillSet } = req.body;
    const User = require('../models/User'); // Required dynamically to avoid circular issues
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password, department, contactNumber, role: 'technician' });
    const tech = await Technician.create({ user: user._id, skillSet: skillSet || [], contactNumber });
    res.status(201).json(await tech.populate('user', 'name email'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/technicians/:id
// @desc    Delete a technician and their user profile
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const tech = await Technician.findById(req.params.id);
    if (!tech) return res.status(404).json({ message: 'Technician not found' });
    
    const User = require('../models/User');
    await User.findByIdAndDelete(tech.user);
    await Technician.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Technician removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
