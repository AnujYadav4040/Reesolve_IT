const natural = require('natural');

class MLService {
  constructor() {
    this.priorityClassifier = new natural.BayesClassifier();
    this.categoryClassifier = new natural.BayesClassifier();
    
    // Initialize Sentiment Analyzer
    this.analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
    this.tokenizer = new natural.WordTokenizer();

    this.trainClassifiers();
  }

  trainClassifiers() {
    // ---- Train PRIORITY ----
    // High
    this.priorityClassifier.addDocument('server is down and offline completely', 'High');
    this.priorityClassifier.addDocument('database corrupt panic', 'High');
    this.priorityClassifier.addDocument('network infrastructure failing', 'High');
    this.priorityClassifier.addDocument('critical error unable to work', 'High');
    this.priorityClassifier.addDocument('production environment crashed', 'High');
    
    // Medium
    this.priorityClassifier.addDocument('slow performance on dashboard', 'Medium');
    this.priorityClassifier.addDocument('cannot access email account', 'Medium');
    this.priorityClassifier.addDocument('printer is not working', 'Medium');
    this.priorityClassifier.addDocument('application freezing occasionally', 'Medium');
    
    // Low
    this.priorityClassifier.addDocument('need new mouse', 'Low');
    this.priorityClassifier.addDocument('change password reset', 'Low');
    this.priorityClassifier.addDocument('how do I use this feature', 'Low');

    this.priorityClassifier.train();

    // ---- Train CATEGORY (Mapped to Technician Skills) ----
    // Hardware
    this.categoryClassifier.addDocument('need new mouse keyboard monitor broken screen', 'hardware');
    this.categoryClassifier.addDocument('printer is jammed paper not working', 'hardware');
    this.categoryClassifier.addDocument('laptop won\'t turn on motherboard battery dead', 'hardware');
    
    // Network
    this.categoryClassifier.addDocument('wifi is down internet connection dropped', 'network');
    this.categoryClassifier.addDocument('cannot connect to vpn server firewall blocks', 'network');
    this.categoryClassifier.addDocument('router blinking red dns resolution failure', 'network');
    
    // Software
    this.categoryClassifier.addDocument('application keeps crashing freezing blue screen', 'software');
    this.categoryClassifier.addDocument('need to install adobe license key software update', 'software');
    this.categoryClassifier.addDocument('excel formula is broken save file format error', 'software');
    
    // Access
    this.categoryClassifier.addDocument('forgot password need reset locked out', 'access');
    this.categoryClassifier.addDocument('requesting admin privileges new employee account', 'access');

    this.categoryClassifier.train();
  }

  predictPriority(description) {
    if (!description || description.trim().length === 0) return 'Low';
    return this.priorityClassifier.classify(description.toLowerCase());
  }

  predictCategory(description) {
    if (!description || description.trim().length === 0) return 'other';
    return this.categoryClassifier.classify(description.toLowerCase());
  }

  analyzeSentiment(text) {
    if (!text || text.trim().length === 0) return { score: 0, sentiment: 'neutral' };
    
    const tokenized = this.tokenizer.tokenize(text);
    const score = this.analyzer.getSentiment(tokenized);
    
    let sentiment = 'neutral';
    // AFINN scores usually range from -5 to +5 per word. 
    // For a sentence, an aggregate score < -0.5 is fairly negative
    if (score <= -0.5) {
      sentiment = 'negative';
    } else if (score >= 0.5) {
      sentiment = 'positive';
    }
    
    return { score, sentiment };
  }

  predictResolutionTime(priority, category) {
    // A simple heuristic based SLA prediction.
    // In a real-world scenario, this would use a regression model on historical data.
    const p = priority.toLowerCase();
    
    if (p === 'critical') return '1-2 Hours';
    if (p === 'high') return '4-6 Hours';
    if (p === 'medium') return '24-48 Hours';
    
    return '3-5 Days'; // low
  }

  findDuplicate(newTitle, recentTickets) {
    if (!newTitle || !recentTickets || recentTickets.length === 0) return null;
    
    let bestMatch = null;
    let highestScore = 0;

    for (const ticket of recentTickets) {
      // Use Jaro-Winkler to calculate distance (1 is exact match)
      const score = natural.JaroWinklerDistance(newTitle.toLowerCase(), ticket.title.toLowerCase(), false);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = ticket;
      }
    }

    // If similarity > 80% (0.8), consider it a duplicate
    if (highestScore > 0.8) {
      return bestMatch._id;
    }
    
    return null;
  }
}

module.exports = new MLService();
