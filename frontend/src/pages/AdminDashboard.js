import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getAdminDashboard } from '../api';
import { io } from 'socket.io-client';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchData = () => {
    getAdminDashboard()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();

    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001');

    socket.on('new_ticket', ({ ticket, message }) => {
      addToast(message, 'info');
      fetchData(); // Live refresh dashboard
    });

    socket.on('ticket_updated', () => fetchData());

    return () => socket.disconnect();
  }, []);

  if (loading) return (
    <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner" /></main></div>
  );

  const s = data?.stats || {};

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-subtitle">System overview & management</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/analytics')}>📊 Analytics</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/tickets')}>All Tickets</button>
          </div>
        </motion.div>

        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: 'Total Tickets', value: s.totalTickets, color: 'blue' },
            { label: 'Open', value: s.openTickets, color: 'yellow' },
            { label: 'In Progress', value: s.inProgressTickets, color: 'teal' },
            { label: 'Resolved', value: s.resolvedTickets, color: 'green' },
            { label: 'Closed', value: s.closedTickets, color: 'blue' },
            { label: 'Users', value: s.totalUsers, color: 'blue' },
            { label: 'Technicians', value: s.totalTechnicians, color: 'green' },
          ].map((item, index) => (
            <motion.div 
              key={item.label} 
              className={`stat-card ${item.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="stat-num">{item.value ?? 0}</div>
              <div className="stat-label">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid-2">
          {/* Critical Tickets */}
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--danger)' }}>🚨 Critical Tickets</h3>
            {data?.criticalTickets?.length === 0 ? (
              <p className="text-muted">No critical tickets. All clear!</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Title</th><th>User</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data?.criticalTickets?.map((t) => (
                      <tr key={t._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>
                        <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.title}</td>
                        <td className="text-muted text-sm">{t.user?.name}</td>
                        <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Tickets */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1rem' }}>Recent Tickets</h3>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/tickets')}>View All</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Title</th><th>Priority</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data?.recentTickets?.map((t) => (
                    <tr key={t._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>
                      <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.title}</td>
                      <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>⚡ Quick Admin Actions</h3>
            <div className="grid-2" style={{ gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => navigate('/admin/users')} style={{ width: '100%', justifyContent: 'center' }}>Manage Users</button>
              <button className="btn btn-outline" onClick={() => navigate('/admin/technicians')} style={{ width: '100%', justifyContent: 'center' }}>Manage Techs</button>
              <button className="btn btn-primary" onClick={() => navigate('/admin/analytics')} style={{ width: '100%', justifyContent: 'center', gridColumn: 'span 2' }}>Generate Reports</button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>📋 Recent System Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>User Creation</div>
                <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Admin generated new credentials for user: <span style={{ fontFamily: 'monospace' }}>john.doe@company.com</span>.</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Failed Login Attempt</div>
                <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Multiple failed attempts for user: <span style={{ fontFamily: 'monospace' }}>admin@resolveit.com</span>. Action blocked.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
