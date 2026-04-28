import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="app-layout" style={{ display: 'block', padding: '100px 32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 className="page-title" style={{ fontSize: '3rem' }}>About Resolve IT</h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Your trusted, next-generation IT Ticketing & Support System designed for speed, efficiency, and clarity.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '40px', alignItems: 'stretch' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(79, 110, 247, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            We bridge the gap between technical complexity and everyday operations. Resolve IT exists to empower businesses by providing an intuitive platform where issues are resolved quickly, technicians are equipped with the right tools, and end-users experience zero downtime.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Why Choose Us?</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Traditional helpdesks are slow and fragmented. We reimagined the support experience with a premium, glassmorphism-inspired UI and lightning-fast workflows. From granular role-based access control to automated ticket assignment, Resolve IT is simply built better.
          </p>
        </div>
      </div>

      <div className="card mt-6" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>Ready to Experience Better IT Support?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Join thousands of professionals streamlining their technical operations every single day.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="btn btn-primary">Get Started Now</Link>
          <Link to="/login" className="btn btn-outline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
