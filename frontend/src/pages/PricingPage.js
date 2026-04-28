import React from 'react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for small teams getting started with IT support.',
      features: ['Up to 5 Users', 'Basic Ticketing', 'Community Support', 'Standard Analytics'],
      btn: 'Get Started',
      link: '/register',
      highlight: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      desc: 'Advanced tools for growing businesses and dedicated IT teams.',
      features: ['Unlimited Users', 'Advanced Routing', 'Priority 24/7 Support', 'Custom Dashboards', 'API Access'],
      btn: 'Start Free Trial',
      link: '/register',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'annual billing',
      desc: 'Maximum flexibility and security for large organizations.',
      features: ['Single Sign-On (SSO)', 'White Labeling', 'Dedicated Account Manager', 'On-Premise Deployment'],
      btn: 'Contact Sales',
      link: '/contact',
      highlight: false
    }
  ];

  return (
    <div className="app-layout" style={{ display: 'block', padding: '100px 32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '16px' }}>
        <h1 className="page-title" style={{ fontSize: '3rem' }}>Simple, Transparent Pricing</h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose the plan that fits your organization's needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
        {plans.map((plan, i) => (
          <div key={i} className="card" style={{ 
            display: 'flex', flexDirection: 'column', 
            border: plan.highlight ? '1px solid var(--primary)' : 'var(--glass-border)',
            boxShadow: plan.highlight ? '0 0 20px rgba(79, 110, 247, 0.2)' : 'var(--shadow)',
            transform: plan.highlight ? 'scale(1.02)' : 'none'
          }}>
            {plan.highlight && (
              <div style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '20px', alignSelf: 'flex-start', marginBottom: '16px' }}>
                Most Popular
              </div>
            )}
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{plan.name}</h2>
            <p style={{ color: 'var(--text-muted)', minHeight: '48px', marginBottom: '24px' }}>{plan.desc}</p>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '32px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{plan.price}</span>
              <span style={{ color: 'var(--text-muted)', paddingBottom: '6px' }}>/{plan.period}</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {plan.features.map((feat, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <Link to={plan.link} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>
              {plan.btn}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
