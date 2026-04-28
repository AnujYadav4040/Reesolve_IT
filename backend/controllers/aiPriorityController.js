/**
 * AI Priority Predictor
 * Uses keyword analysis on ticket title + description
 * to predict priority level. Can be replaced with
 * an actual ML model (e.g., TensorFlow.js or external API).
 */

const MLService = require('../services/mlService');

/**
 * Predict ticket priority based on content analysis
 * Uses the advanced Machine Learning NLP Natural module.
 * @param {string} title - Ticket title
 * @param {string} description - Ticket description
 * @returns {string} - 'low' | 'medium' | 'high' | 'critical'
 */
const predictPriority = (title, description) => {
  const text = `${title} ${description}`;
  // Use ML Service trained classifier
  const predicted = MLService.predictPriority(text);
  
  // Format to standard enums based on capitalization
  return predicted.toLowerCase();
};

module.exports = { predictPriority };
