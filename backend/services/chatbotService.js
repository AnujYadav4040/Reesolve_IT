const natural = require('natural');

class ChatbotService {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.trainClassifier();
  }

  trainClassifier() {
    // Greeting
    this.classifier.addDocument('hello hi hey there greetings good morning good afternoon', 'greeting');
    
    // Password Reset
    this.classifier.addDocument('forgot my password reset password locked out of account cannot login', 'password_reset');
    
    // Printer
    this.classifier.addDocument('printer is not working jammed paper out of ink scanner broken', 'printer_issue');
    
    // Ticket Creation
    this.classifier.addDocument('i want to create a new ticket report a problem need help with an issue', 'create_ticket');
    
    // Ticket Status
    this.classifier.addDocument('what is the status of my ticket is my issue resolved yet track my ticket', 'ticket_status');
    
    // Farewell
    this.classifier.addDocument('thank you bye goodbye thanks appreciate it', 'farewell');

    this.classifier.train();
  }

  getResponse(message) {
    if (!message || message.trim() === '') return "I didn't quite catch that. How can I help you today?";
    
    const intent = this.classifier.classify(message.toLowerCase());
    
    switch (intent) {
      case 'greeting':
        return "Hello there! 👋 I'm the Resolve IT Virtual Assistant. How can I help you today?";
      case 'password_reset':
        return "To reset your password, please go to your account settings or click 'Forgot Password' on the login page. If you are completely locked out, please create a System Access ticket.";
      case 'printer_issue':
        return "For printer issues, please make sure the printer is turned on, has paper, and is connected to the network. If it's jammed, carefully remove the paper. If the issue persists, please create a Hardware ticket.";
      case 'create_ticket':
        return "You can create a new ticket by clicking the '+ New Ticket' button on your dashboard. Please provide as much detail as possible!";
      case 'ticket_status':
        return "You can check the status of all your open and past tickets by visiting the 'My Tickets' page from the sidebar menu.";
      case 'farewell':
        return "You're welcome! Have a great day! If you need anything else, I'm right here.";
      default:
        return "I'm not sure I understand. Could you rephrase that? Or, you can always create a support ticket for our technicians to look into.";
    }
  }
}

module.exports = new ChatbotService();
