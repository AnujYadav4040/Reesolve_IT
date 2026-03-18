import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getAdminDashboard } from '../api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminDashboard()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner" /></main></div>
  );

  const s = data?.stats || {};

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-subtitle">System overview & management</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/analytics')}>📊 Analytics</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/tickets')}>All Tickets</button>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { label: 'Total Tickets', value: s.totalTickets, color: 'blue' },
            { label: 'Open', value: s.openTickets, color: 'yellow' },
            { label: 'In Progress', value: s.inProgressTickets, color: 'teal' },
            { label: 'Resolved', value: s.resolvedTickets, color: 'green' },
            { label: 'Closed', value: s.closedTickets, color: 'blue' },
            { label: 'Users', value: s.totalUsers, color: 'blue' },
            { label: 'Technicians', value: s.totalTechnicians, color: 'green' },
          ].map((item) => (
            <div key={item.label} className={`stat-card ${item.color}`}>
              <div className="stat-num">{item.value ?? 0}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>

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
      </main>
    </div>
  );
}
