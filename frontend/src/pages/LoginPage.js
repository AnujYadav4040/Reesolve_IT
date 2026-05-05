import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../api';
import { motion } from 'framer-motion';

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
    <div className="auth-page auth-page-split" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient background orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }} />

      <motion.div 
        className="auth-card auth-card-split"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 10 }}
      >
        
        {/* Left Panel */}
        <motion.div 
          className="auth-split-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
        >
          <div className="auth-logo-left">
            <img src="/logo.png" alt="Resolve IT Logo" className="auth-logo-left-img" />
            <span>Resolve IT</span>
          </div>
          <motion.div 
            className="auth-illustration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.img 
              src="/login_illustration.png" 
              alt="Support Illustration" 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          className="auth-split-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
        >
          <div className="auth-right-header">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue</p>
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
            
            <motion.div className="form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </motion.div>
            
            <motion.div className="form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '12px', fontSize: '1rem' }} 
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
            
            <motion.div style={{ textAlign: 'right', marginTop: 12 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }} onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </motion.div>
          </form>

          <motion.p 
            style={{ textAlign: 'center', marginTop: 32, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8 }}
          >
            Don't have an account? <Link to="/register" style={{ fontWeight: '700', color: 'var(--text)' }}>Register</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
