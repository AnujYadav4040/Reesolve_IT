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

        <div className="card">
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
      </main>
    </div>
  );
}
