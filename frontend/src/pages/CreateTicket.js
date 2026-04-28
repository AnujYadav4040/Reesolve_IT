import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useToast } from '../context/ToastContext';
import { createTicket, predictPriority, getSuggestions } from '../api';

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '', category: 'hardware' });
  const [loading, setLoading] = useState(false);
  const [aiPriority, setAiPriority] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleBlur = async () => {
    if (form.description.length > 10) {
      try {
        const { data } = await predictPriority({ description: form.description });
        setAiPriority(data.priority);
      } catch (err) {
        console.error('Failed to fetch AI priority prediction', err);
      }
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (form.title.length > 3) {
        try {
          const { data } = await getSuggestions(form.title);
          setSuggestions(data);
        } catch (err) {
          console.error('Failed to fetch suggestions', err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimeout);
  }, [form.title]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createTicket(form);
      addToast(`Ticket created! Priority: ${data.aiPredictedPriority} | Est. Fix: ${data.estimatedResolutionTime}`, 'success');
      setTimeout(() => navigate('/tickets'), 2000);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create ticket.', 'error');
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

              {/* Smart FAQ / Suggestions */}
              {suggestions.length > 0 && (
                <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>💡 Quick Solutions (Based on similar resolved tickets)</div>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: '0.9rem' }}>
                    {suggestions.map((s) => (
                      <li key={s._id} style={{ marginBottom: 8 }}>
                        <strong>{s.title}:</strong> {s.resolutionNote}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', fontStyle: 'italic' }}>
                    If this solves your issue, you can close this page!
                  </div>
                </div>
              )}

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
                  onBlur={handleBlur}
                  required
                  style={{ minHeight: 140 }}
                />
              </div>

              {/* AI Priority Preview */}
              {aiPriority && (
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  🤖 <strong>AI Priority Prediction:</strong>{' '}
                  <span className={`badge badge-${aiPriority}`}>{aiPriority}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    Powered by Natural Language Processing ML Model
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
