/**
 * AI Priority Predictor
 * Uses keyword analysis on ticket title + description
 * to predict priority level. Can be replaced with
 * an actual ML model (e.g., TensorFlow.js or external API).
 */

const CRITICAL_KEYWORDS = [
  'server down', 'system crash', 'data loss', 'breach', 'hacked',
  'ransomware', 'virus', 'malware', 'production down', 'complete failure',
  'emergency', 'cannot login', 'all users', 'database corrupted',
];

const HIGH_KEYWORDS = [
  'not working', 'broken', 'error', 'failed', 'urgent', 'important',
  'cannot access', 'network down', 'printer offline', 'email not working',
  'slow performance', 'system freezing', 'software crash',
];

const MEDIUM_KEYWORDS = [
  'slow', 'issue', 'problem', 'delay', 'intermittent', 'sometimes',
  'request', 'need help', 'assistance', 'configure', 'setup',
];

const LOW_KEYWORDS = [
  'question', 'inquiry', 'how to', 'information', 'update',
  'upgrade', 'change password', 'minor', 'cosmetic', 'suggestion',
];

/**
 * Predict ticket priority based on content analysis
 * @param {string} title - Ticket title
 * @param {string} description - Ticket description
 * @returns {string} - 'low' | 'medium' | 'high' | 'critical'
 */
const predictPriority = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // Score-based approach
  let scores = { critical: 0, high: 0, medium: 0, low: 0 };

  CRITICAL_KEYWORDS.forEach((kw) => { if (text.includes(kw)) scores.critical += 3; });
  HIGH_KEYWORDS.forEach((kw) => { if (text.includes(kw)) scores.high += 2; });
  MEDIUM_KEYWORDS.forEach((kw) => { if (text.includes(kw)) scores.medium += 1; });
  LOW_KEYWORDS.forEach((kw) => { if (text.includes(kw)) scores.low += 1; });

  // Find max score
  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) return 'medium'; // default

  const predicted = Object.entries(scores).find(([, v]) => v === maxScore)[0];
  return predicted;
};

module.exports = { predictPriority };
