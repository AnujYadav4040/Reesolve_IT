import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      
      if (data.role !== form.role) {
        throw new Error(`Account type mismatch. You are registered as ${data.role}.`);
      }
      
      login(data);
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'technician') navigate('/technician/dashboard');
      else navigate('/dashboard');
      addToast(`Welcome back!`, 'success');
    } catch (err) {
      addToast(err.message || err.response?.data?.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Resolve IT Logo" className="auth-logo-img" />
          <h1>Resolve IT</h1>
          <p>IT Ticketing &amp; Support System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="role-tabs">
            <div 
              className={`role-tab ${form.role === 'admin' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'admin' })}
            >
              Admin
            </div>
            <div 
              className={`role-tab ${form.role === 'technician' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'technician' })}
            >
              Technician
            </div>
            <div 
              className={`role-tab ${form.role === 'user' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'user' })}
            >
              User
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
