import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getTickets, getAvailableTechnicians, assignTicket, autoAssignTicket, updateTicketPriority } from '../api';

export default function AdminTickets() {
  const [data, setData] = useState({ tickets: [], total: 0, pages: 1 });
  const [technicians, setTechnicians] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const [ticketsRes, techRes] = await Promise.all([
        getTickets({ ...params, limit: 15 }),
        getAvailableTechnicians(),
      ]);
      setData(ticketsRes.data);
      setTechnicians(techRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleAssign = async (ticketId, technicianId) => {
    try {
      await assignTicket(ticketId, { technicianId });
      fetchData();
    } catch (err) {
      alert('Assignment failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAutoAssign = async (ticketId) => {
    try {
      await autoAssignTicket(ticketId);
      fetchData();
    } catch (err) {
      alert('Auto-assign failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePriorityChange = async (ticketId, priority) => {
    try {
      await updateTicketPriority(ticketId, { priority });
      setData((prev) => ({
        ...prev,
        tickets: prev.tickets.map((t) => t._id === ticketId ? { ...t, priority } : t),
      }));
    } catch (err) {
      alert('Priority update failed.');
    }
  };

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">All Tickets</div>
            <div className="page-subtitle">{data.total} total tickets</div>
          </div>
        </div>

        <div className="filter-bar">
          <select name="status" value={filters.status} onChange={handleFilter}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select name="category" value={filters.category} onChange={handleFilter}>
            <option value="">All Categories</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="network">Network</option>
            <option value="access">Access</option>
            <option value="other">Other</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilter}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assign</th>
                    <th>Auto</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tickets.map((t) => (
                    <tr key={t._id}>
                      <td className="text-muted text-sm">#{t._id.slice(-6).toUpperCase()}</td>
                      <td
                        style={{ fontWeight: 500, cursor: 'pointer', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        onClick={() => navigate(`/tickets/${t._id}`)}
                      >
                        {t.title}
                      </td>
                      <td className="text-muted text-sm">{t.user?.name}<br /><span style={{ fontSize: '0.72rem' }}>{t.user?.department}</span></td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{t.category}</td>
                      <td>
                        <select
                          value={t.priority}
                          onChange={(e) => handlePriorityChange(t._id, e.target.value)}
                          style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                        >
                          {['low', 'medium', 'high', 'critical'].map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      <td>
                        {t.status === 'open' ? (
                          <select
                            defaultValue=""
                            onChange={(e) => e.target.value && handleAssign(t._id, e.target.value)}
                            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                          >
                            <option value="">Select</option>
                            {technicians.map((tech) => (
                              <option key={tech._id} value={tech._id}>
                                {tech.user?.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-muted text-sm">
                            {t.technician?.user?.name || '—'}
                          </span>
                        )}
                      </td>
                      <td>
                        {t.status === 'open' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleAutoAssign(t._id)}>
                            Auto
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.pages > 1 && (
            <div className="flex gap-2 items-center mt-4" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-outline btn-sm" disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>← Prev</button>
              <span className="text-muted text-sm">Page {filters.page} of {data.pages}</span>
              <button className="btn btn-outline btn-sm" disabled={filters.page === data.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
