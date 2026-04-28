import React from 'react';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Smart Ticketing System',
      desc: 'Users can easily create tickets, categorize them by Department and Priority, and attach relevant information. Technicians get an organized view of their queue.',
      icon: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    },
    {
      title: 'Role-Based Access Control',
      desc: 'Seamlessly switch between User, Technician, and Admin views. Each role has specialized tools and dashboards tailored to their specific needs.',
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>
    },
    {
      title: 'Real-Time Updates',
      desc: 'Watch your tickets change status instantly. Automated workflows notify users and technicians exactly when an action is taken or a ticket is resolved.',
      icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    },
    {
      title: 'Advanced Analytics',
      desc: 'Admins get a birds-eye view of organizational efficiency. Track ticket volume, resolution times, technician performance, and system bottlenecks.',
      icon: <><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>
    }
  ];

  return (
    <div className="app-layout" style={{ display: 'block', padding: '100px 32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 className="page-title" style={{ fontSize: '3rem' }}>Powerful Features</h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need to deliver world-class IT support, beautifully packaged into a single platform.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '40px', alignItems: 'stretch' }}>
        {features.map((feature, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.3s ease' }}>
            <div style={{ padding: '12px', background: 'rgba(79, 110, 247, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {feature.icon}
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem' }}>{feature.title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6" style={{ textAlign: 'center', padding: '48px 32px', background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(10,12,16,0.9) 100%)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>Ready to streamline your IT?</h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link to="/register" className="btn btn-primary">Start Using Resolve IT</Link>
        </div>
      </div>
    </div>
  );
}
