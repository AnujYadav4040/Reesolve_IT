import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getTickets } from '../api';

export default function MyTickets() {
  const [data, setData] = useState({ tickets: [], total: 0, pages: 1 });
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data: res } = await getTickets({ ...params, limit: 10 });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filters]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">My Tickets</div>
            <div className="page-subtitle">{data.total} total tickets</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
            + New Ticket
          </button>
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
            data.tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                No tickets found matching your filters.
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tickets.map((t) => (
                      <tr key={t._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>
                        <td className="text-muted text-sm">#{t._id.slice(-6).toUpperCase()}</td>
                        <td style={{ fontWeight: 500, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
                        <td style={{ textTransform: 'capitalize' }}>{t.category}</td>
                        <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                        <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                        <td className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Pagination */}
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
