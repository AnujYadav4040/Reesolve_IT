const express = require('express');
const router = express.Router();
const ChatbotService = require('../services/chatbotService');

// @route   POST /api/chatbot
// @desc    Get AI chatbot response
// @access  Public (or Private depending on needs, leaving public for easy access)
router.post('/', (req, res) => {
  try {
    const { message } = req.body;
    const reply = ChatbotService.getResponse(message);
    
    // Simulate slight delay to feel more natural
    setTimeout(() => {
      res.json({ reply });
    }, 600);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
