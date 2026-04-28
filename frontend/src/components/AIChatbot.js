import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am the Resolve IT Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await sendChatMessage({ message: userMessage });
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'var(--font-family)' }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '320px',
          height: '450px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <strong style={{ fontSize: '0.95rem' }}>IT Assistant</strong>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--background)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface)',
                color: msg.sender === 'user' ? 'white' : 'var(--text)',
                padding: '10px 14px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                fontSize: '0.85rem',
                lineHeight: 1.4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Assistant is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your issue..."
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '20px', outline: 'none', fontSize: '0.85rem' }}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              style={{ 
                background: 'var(--primary)', color: 'white', border: 'none', 
                borderRadius: '50%', width: '36px', height: '36px', 
                marginLeft: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.8rem',
          marginLeft: 'auto' // push to right
        }}
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
}
