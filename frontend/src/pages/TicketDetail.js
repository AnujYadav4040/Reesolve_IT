import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import { getTicketById, submitFeedback } from '../api';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000');

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  useEffect(() => {
    getTicketById(id)
      .then(({ data }) => { setTicket(data.ticket); setLogs(data.logs); })
      .catch(console.error)
      .finally(() => setLoading(false));

    socket.emit('join_room', id);

    socket.on('ticket_updated', (data) => {
      if (data.ticketId === id) {
        setNotification(data.message);
        setTicket((prev) => ({ ...prev, status: data.status }));
        setTimeout(() => setNotification(''), 5000);
      }
    });

    return () => { socket.off('ticket_updated'); };
  }, [id]);

  const handleFeedback = async (e) => {
    e.preventDefault();
    setFbLoading(true);
    try {
      await submitFeedback({ ticketId: id, ...feedback });
      setFeedbackSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit feedback.');
    } finally {
      setFbLoading(false);
    }
  };

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content"><div className="spinner" /></main>
    </div>
  );

  if (!ticket) return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content"><div className="alert alert-error">Ticket not found.</div></main>
    </div>
  );

  const canFeedback = user?.role === 'user' && ['resolved', 'closed'].includes(ticket.status) && !feedbackSent;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {notification && <div className="alert alert-info mb-4">🔔 {notification}</div>}

        <div className="page-header">
          <div>
            <div className="page-title" style={{ fontSize: '1.3rem' }}>{ticket.title}</div>
            <div className="page-subtitle">#{ticket._id.slice(-6).toUpperCase()} &bull; {ticket.category}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="ticket-detail-grid">
          {/* Main */}
          <div>
            <div className="card mb-4">
              <h4 style={{ marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
              <p style={{ lineHeight: 1.8 }}>{ticket.description}</p>
            </div>

            {ticket.resolutionNote && (
              <div className="card mb-4" style={{ borderColor: 'var(--success)' }}>
                <h4 style={{ marginBottom: 8, fontSize: '0.85rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✅ Resolution Note</h4>
                <p style={{ lineHeight: 1.8 }}>{ticket.resolutionNote}</p>
              </div>
            )}

            {/* Activity Timeline */}
            <div className="card">
              <h4 style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Log</h4>
              {logs.length === 0 ? (
                <p className="text-muted">No activity yet.</p>
              ) : (
                <ul className="timeline">
                  {logs.map((log) => (
                    <li key={log._id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-action">{log.actionPerformed}</div>
                        <div className="timeline-meta">
                          by {log.performedBy?.name} &bull; {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Feedback */}
            {canFeedback && (
              <div className="card mt-4">
                <h4 style={{ marginBottom: 12 }}>Rate this Resolution</h4>
                <form onSubmit={handleFeedback}>
                  <div className="form-group">
                    <label>Rating (1-5)</label>
                    <select value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comments (optional)</label>
                    <textarea placeholder="How was the support experience?" value={feedback.comments}
                      onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })} style={{ minHeight: 80 }} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={fbLoading}>
                    {fbLoading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            )}

            {feedbackSent && (
              <div className="alert alert-success mt-4">✅ Thank you for your feedback!</div>
            )}
          </div>

          {/* Sidebar info */}
          <div>
            <div className="card mb-4">
              <h4 style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <InfoRow label="Status"><span className={`badge badge-${ticket.status}`}>{ticket.status}</span></InfoRow>
                <InfoRow label="Priority"><span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span></InfoRow>
                {ticket.aiPredictedPriority && (
                  <InfoRow label="AI Priority">
                    <span className={`badge badge-${ticket.aiPredictedPriority}`}>{ticket.aiPredictedPriority}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 4 }}>🤖</span>
                  </InfoRow>
                )}
                <InfoRow label="Category" value={ticket.category} />
                <InfoRow label="Raised By" value={ticket.user?.name} />
                <InfoRow label="Department" value={ticket.user?.department} />
                {ticket.technician && (
                  <InfoRow label="Assigned To" value={ticket.technician?.user?.name || 'Technician'} />
                )}
                <InfoRow label="Created" value={new Date(ticket.createdAt).toLocaleDateString()} />
                {ticket.resolvedDate && (
                  <InfoRow label="Resolved" value={new Date(ticket.resolvedDate).toLocaleDateString()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const InfoRow = ({ label, value, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
    <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}>
      {children || value || '—'}
    </span>
  </div>
);
