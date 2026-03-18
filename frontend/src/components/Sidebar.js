import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: '⊞',
  ticket: '🎫',
  new: '＋',
  analytics: '📊',
  technicians: '🔧',
  logout: '⏻',
  profile: '👤',
};

const userLinks = [
  { label: 'Dashboard', icon: icons.dashboard, path: '/dashboard' },
  { label: 'My Tickets', icon: icons.ticket, path: '/tickets' },
  { label: 'New Ticket', icon: icons.new, path: '/tickets/new' },
];

const techLinks = [
  { label: 'Dashboard', icon: icons.dashboard, path: '/technician/dashboard' },
];

const adminLinks = [
  { label: 'Dashboard', icon: icons.dashboard, path: '/admin/dashboard' },
  { label: 'All Tickets', icon: icons.ticket, path: '/admin/tickets' },
  { label: 'Analytics', icon: icons.analytics, path: '/admin/analytics' },
  { label: 'Technicians', icon: icons.technicians, path: '/admin/technicians' },
  { label: 'Users', icon: '👥', path: '/admin/users' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'technician' ? techLinks
    : userLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>
          <span className="dot" />
          Resolve IT
        </h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
          {user?.name} &bull; <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </div>
      </div>

      <nav>
        {links.map((link) => (
          <button
            key={link.path}
            className={`nav-link${location.pathname === link.path ? ' active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            <span>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link" onClick={logout}>
          <span>{icons.logout}</span>
          Logout
        </button>
      </div>
    </div>
  );
}
