import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="landing-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      background: 'linear-gradient(135deg, var(--bg-main) 0%, var(--card-bg) 100%)',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '20px', background: '-webkit-linear-gradient(45deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Resolve IT Support
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
        Streamlined technical support ticketing with AI-powered prioritization. Fix issues faster and keep your team productive.
      </p>
      
      <div className="landing-actions" style={{ display: 'flex', gap: '20px' }}>
        {user ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem', borderRadius: 'var(--radius)' }}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ padding: '12px 32px', fontSize: '1.1rem', borderRadius: 'var(--radius)' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem', borderRadius: 'var(--radius)' }}>
              Get Started
            </Link>
          </>
        )}
      </div>

      <div style={{ marginTop: '60px', display: 'flex', gap: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span> Lightning Fast
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span> AI Prioritized
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🛡️</span> Secure & Reliable
        </div>
      </div>
    </div>
  );
}
