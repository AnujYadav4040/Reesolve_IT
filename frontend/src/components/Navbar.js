import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="top-navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.png" alt="Resolve IT Logo" className="navbar-logo" />
        <h2>Resolve IT</h2>
      </Link>

      <nav className="navbar-links" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Link to="/features" className="nav-top-link">Features</Link>
        <Link to="/pricing" className="nav-top-link">Pricing</Link>
        <Link to="/about" className="nav-top-link">About Us</Link>
        <Link to="/contact" className="nav-top-link">Contact</Link>
      </nav>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">
                <span className="dot" /> {user.role}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                marginLeft: '12px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/login" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text)'}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: 'var(--radius)' }}>Get Started</Link>
          </div>
        )}
      </div>
    </div>
  );
}
