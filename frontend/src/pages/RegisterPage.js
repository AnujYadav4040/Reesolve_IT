import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: '', role: 'user', contactNumber: '', skillSet: '',
  });
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
      const payload = {
        ...form,
        skillSet: form.skillSet ? form.skillSet.split(',').map((s) => s.trim()) : [],
      };
      const { data } = await registerUser(payload);
      login(data);
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'technician') navigate('/technician/dashboard');
      else navigate('/dashboard');
      addToast(`Account created successfully!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error');
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
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="role-tabs">
            <div 
              className={`role-tab ${form.role === 'user' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'user' })}
            >
              User
            </div>
            <div 
              className={`role-tab ${form.role === 'technician' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'technician' })}
            >
              Technician
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="Aman Kumar" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input name="department" placeholder="IT, HR, Finance..." value={form.department} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input name="contactNumber" placeholder="+91 9876543210" value={form.contactNumber} onChange={handleChange} />
          </div>
          {form.role === 'technician' && (
            <div className="form-group">
              <label>Skill Set (comma-separated)</label>
              <input name="skillSet" placeholder="hardware, network, software" value={form.skillSet} onChange={handleChange} />
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
