import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getTickets, updateTicketStatus, updateAvailability } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ tickets: [], total: 0 });
  const [availability, setAvailability] = useState('available');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getTickets({ limit: 50 })
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (ticketId, status, resolutionNote = '') => {
    setUpdatingId(ticketId);
    try {
      await updateTicketStatus(ticketId, { status, resolutionNote });
      setData((prev) => ({
        ...prev,
        tickets: prev.tickets.map((t) => t._id === ticketId ? { ...t, status } : t),
      }));
    } catch (err) {
      alert('Failed to update ticket status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAvailabilityChange = async (e) => {
    const val = e.target.value;
    setAvailability(val);
    try {
      await updateAvailability({ availabilityStatus: val });
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    assigned: data.tickets.filter((t) => t.status === 'in-progress').length,
    resolved: data.tickets.filter((t) => t.status === 'resolved').length,
    onHold: data.tickets.filter((t) => t.status === 'on-hold').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Technician Panel</div>
            <div className="page-subtitle">Welcome, {user?.name}</div>
          </div>
          <div className="flex gap-2 items-center">
            <label style={{ marginBottom: 0 }}>Availability:</label>
            <select value={availability} onChange={handleAvailabilityChange} style={{ width: 'auto' }}>
              <option value="available">🟢 Available</option>
              <option value="busy">🟡 Busy</option>
              <option value="offline">🔴 Offline</option>
            </select>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card yellow">
            <div className="stat-num">{stats.assigned}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card green">
            <div className="stat-num">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card red">
            <div className="stat-num">{stats.onHold}</div>
            <div className="stat-label">On Hold</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-num">{data.total}</div>
            <div className="stat-label">Total Assigned</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Assigned Tickets</h3>
          {loading ? <div className="spinner" /> : (
            data.tickets.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>No tickets assigned yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>User</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tickets.map((t) => (
                      <tr key={t._id}>
                        <td className="text-muted text-sm">#{t._id.slice(-6).toUpperCase()}</td>
                        <td style={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>{t.title}</td>
                        <td className="text-muted">{t.user?.name}</td>
                        <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                        <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                        <td>
                          <div className="flex gap-2">
                            {t.status !== 'resolved' && t.status !== 'closed' && (
                              <button
                                className="btn btn-success btn-sm"
                                disabled={updatingId === t._id}
                                onClick={() => {
                                  const note = prompt('Enter resolution note (optional):') || '';
                                  handleStatusUpdate(t._id, 'resolved', note);
                                }}
                              >
                                Resolve
                              </button>
                            )}
                            {t.status === 'in-progress' && (
                              <button
                                className="btn btn-outline btn-sm"
                                disabled={updatingId === t._id}
                                onClick={() => handleStatusUpdate(t._id, 'on-hold')}
                              >
                                Hold
                              </button>
                            )}
                            {t.status === 'on-hold' && (
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={updatingId === t._id}
                                onClick={() => handleStatusUpdate(t._id, 'in-progress')}
                              >
                                Resume
                              </button>
                            )}
                          </div>
                        </td>
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
