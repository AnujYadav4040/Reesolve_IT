import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would send to an API
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="app-layout" style={{ display: 'block', padding: '100px 32px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 className="page-title" style={{ fontSize: '3rem' }}>Contact Us</h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about Resolve IT? Our team is here to help you build a better support experience.
        </p>
      </div>

      <div className="card mt-6">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ padding: '20px', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '50%', width: 'fit-content', margin: '0 auto 24px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--success)' }}>Message Sent!</h2>
            <p style={{ color: 'var(--text-muted)' }}>We have received your message and will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Your Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Subject</label>
              <input 
                type="text" 
                required 
                placeholder="How can we help?"
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Message</label>
              <textarea 
                required 
                placeholder="Tell us more about your inquiry..."
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                style={{ minHeight: '150px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 32px' }}>
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="grid-2" style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Us</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>support@resolveit.com</p>
        </div>
        <div style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Call Us</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>+1 (800) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
