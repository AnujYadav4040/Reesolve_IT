import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { createTicket } from '../api';

// Client-side AI priority preview (mirrors backend logic)
const CRITICAL_KW = ['server down', 'system crash', 'data loss', 'breach', 'hacked', 'ransomware', 'production down', 'emergency', 'database corrupted'];
const HIGH_KW = ['not working', 'broken', 'error', 'failed', 'urgent', 'cannot access', 'network down', 'software crash'];
const MEDIUM_KW = ['slow', 'issue', 'problem', 'delay', 'configure', 'setup'];
const LOW_KW = ['question', 'inquiry', 'how to', 'information', 'update', 'minor'];

const previewPriority = (title, desc) => {
  const text = `${title} ${desc}`.toLowerCase();
  let scores = { critical: 0, high: 0, medium: 0, low: 0 };
  CRITICAL_KW.forEach((k) => { if (text.includes(k)) scores.critical += 3; });
  HIGH_KW.forEach((k) => { if (text.includes(k)) scores.high += 2; });
  MEDIUM_KW.forEach((k) => { if (text.includes(k)) scores.medium += 1; });
  LOW_KW.forEach((k) => { if (text.includes(k)) scores.low += 1; });
  const max = Math.max(...Object.values(scores));
  if (max === 0) return 'medium';
  return Object.entries(scores).find(([, v]) => v === max)[0];
};

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '', category: 'hardware' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const aiPriority = previewPriority(form.title, form.description);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await createTicket(form);
      setSuccess(`Ticket #${data._id.slice(-6).toUpperCase()} created! AI assigned priority: ${data.aiPredictedPriority}`);
      setTimeout(() => navigate('/tickets'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">New Support Ticket</div>
            <div className="page-subtitle">Describe your IT issue and our team will assist you</div>
          </div>
        </div>

        <div style={{ maxWidth: 680 }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Issue Title</label>
                <input
                  name="title"
                  placeholder="Brief summary of the problem..."
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="access">System Access</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Provide detailed information about the issue — steps to reproduce, error messages, affected systems..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  style={{ minHeight: 140 }}
                />
              </div>

              {/* AI Priority Preview */}
              {(form.title || form.description) && (
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  🤖 <strong>AI Priority Prediction:</strong>{' '}
                  <span className={`badge badge-${aiPriority}`}>{aiPriority}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    Based on your description keywords
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : '🎫 Submit Ticket'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/tickets')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="card mt-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>💡 Tips for faster resolution:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 2 }}>
              <li>Include error codes or screenshots if available</li>
              <li>Mention when the issue started</li>
              <li>List affected users or systems</li>
              <li>Describe what you've already tried</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
