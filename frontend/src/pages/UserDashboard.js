import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getTickets } from '../api';
import { useAuth } from '../context/AuthContext';

const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;
const priorityBadge = (p) => <span className={`badge badge-${p}`}>{p}</span>;

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ tickets: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTickets({ limit: 5 })
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: data.total,
    open: data.tickets.filter((t) => t.status === 'open').length,
    inProgress: data.tickets.filter((t) => t.status === 'in-progress').length,
    resolved: data.tickets.filter((t) => ['resolved', 'closed'].includes(t.status)).length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Welcome, {user?.name} 👋</div>
            <div className="page-subtitle">{user?.department} Department</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
            + New Ticket
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-num">{data.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-num">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-num">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card green">
            <div className="stat-num">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1rem' }}>Recent Tickets</h3>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/tickets')}>View All</button>
            </div>

            {loading ? <div className="spinner" /> : (
              data.tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No tickets yet. <button className="btn btn-primary btn-sm" onClick={() => navigate('/tickets/new')}>Create one</button>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tickets.map((t) => (
                        <tr key={t._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>
                          <td style={{ fontWeight: 500 }}>{t.title}</td>
                          <td style={{ textTransform: 'capitalize' }}>{t.category}</td>
                          <td>{priorityBadge(t.priority)}</td>
                          <td>{statusBadge(t.status)}</td>
                          <td className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>⚡ Quick Actions</h3>
              <div className="grid-2" style={{ gap: '10px' }}>
                <button className="btn btn-outline" onClick={() => navigate('/tickets/new')} style={{ width: '100%', justifyContent: 'center' }}>+ New Ticket</button>
                <button className="btn btn-outline" onClick={() => navigate('/features')} style={{ width: '100%', justifyContent: 'center' }}>KB Articles</button>
              </div>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>📢 Announcements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>System Maintenance</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Scheduled for this Sunday at 2 AM EST. Expect 30 mins downtime.</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>New IT Policy</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Please review the updated password guidelines in the features page.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
