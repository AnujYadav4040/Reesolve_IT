import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getUsers, createUser, deleteUser, toggleUser } from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', contactNumber: '' });

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((r) => { setUsers(r.data); setErrorMsg(''); })
      .catch((e) => setErrorMsg('Failed to load users: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createUser(form);
      setForm({ name: '', email: '', password: '', department: '', contactNumber: '' });
      setShowAdd(false);
      fetchUsers();
    } catch (err) {
      setErrorMsg('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setErrorMsg('');
    try {
      await deleteUser(userToDelete);
      fetchUsers();
    } catch (err) {
      setErrorMsg('Failed to delete user: ' + (err.response?.data?.message || err.message));
    } finally {
      setUserToDelete(null);
    }
  };

  const handleToggle = async (id) => {
    setErrorMsg('');
    try {
      await toggleUser(id);
      fetchUsers();
    } catch (err) {
      setErrorMsg('Failed to update user status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Users Management</div>
            <div className="page-subtitle">{users.length} registered end-users</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '＋ Add User'}
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        {showAdd && (
          <div className="card mb-4" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Create New User</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label>Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label>Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              <div className="form-group"><label>Password *</label><input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
              <div className="form-group"><label>Department *</label><input required value={form.department} onChange={e=>setForm({...form,department:e.target.value})} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td className="text-muted text-sm">{u.email}</td>
                      <td>{u.department || '—'}</td>
                      <td>
                        <span className={`badge badge-${u.isActive !== false ? 'open' : 'closed'}`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => handleToggle(u._id)} className="btn btn-outline btn-sm">
                            {u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => setUserToDelete(u._id)} className="btn btn-sm" style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-muted" style={{ padding: 16, textAlign: 'center' }}>No users found.</p>}
            </div>
          )}
        </div>

        {userToDelete && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div className="card" style={{ width: 400, padding: 24 }}>
              <h3 style={{ marginTop: 0 }}>Confirm Removal</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Are you sure you want to permanently delete this user? This action cannot be undone.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setUserToDelete(null)}>Cancel</button>
                <button className="btn" style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }} onClick={confirmDelete}>Yes, Remove User</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
