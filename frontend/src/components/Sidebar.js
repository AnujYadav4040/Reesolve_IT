import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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

      <nav>
        {links.map((link, i) => (
          <motion.button
            key={link.path}
            className={`nav-link${location.pathname === link.path ? ' active' : ''}`}
            onClick={() => navigate(link.path)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{link.icon}</span>
            {link.label}
          </motion.button>
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
