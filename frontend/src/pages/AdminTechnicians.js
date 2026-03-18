import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getTechnicians, createTechnician, deleteTechnician } from '../api';

const availColor = { available: 'var(--success)', busy: 'var(--warning)', offline: 'var(--danger)' };
const availDot = { available: '🟢', busy: '🟡', offline: '🔴' };

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', skillSet: '' });

  const fetchTechs = () => {
    setLoading(true);
    getTechnicians()
      .then((r) => setTechnicians(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTechs(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skillSet: form.skillSet.split(',').map(s => s.trim()).filter(Boolean) };
      await createTechnician(payload);
      setForm({ name: '', email: '', password: '', department: '', skillSet: '' });
      setShowAdd(false);
      fetchTechs();
    } catch (err) {
      alert('Failed to create technician: ' + (err.response?.data?.message || err.message));
    }
  };

  const confirmDelete = async () => {
    if (!techToDelete) return;
    try {
      await deleteTechnician(techToDelete);
      fetchTechs();
    } catch (err) {
      alert('Failed to delete technician.');
    } finally {
      setTechToDelete(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Technicians</div>
            <div className="page-subtitle">{technicians.length} technician{technicians.length !== 1 ? 's' : ''} registered</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '＋ Add Technician'}
          </button>
        </div>

        {showAdd && (
          <div className="card mb-4" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Create New Technician</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label>Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              <div className="form-group"><label>Password</label><input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
              <div className="form-group"><label>Department</label><input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Skills (comma separated)</label><input placeholder="hardware, network, software" value={form.skillSet} onChange={e=>setForm({...form,skillSet:e.target.value})} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary">Save Technician</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="spinner" /> : (
          technicians.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 0' }}>
              <p className="text-muted">No technicians registered yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {technicians.map((tech) => (
                <div key={tech._id} className="card">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{tech.user?.name || 'Deleted User'}</div>
                      <div className="text-muted text-sm">{tech.user?.email || '—'}</div>
                    </div>
                    <span style={{ color: availColor[tech.availabilityStatus], fontSize: '0.8rem', fontWeight: 600 }}>
                      {availDot[tech.availabilityStatus]} {tech.availabilityStatus}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <InfoRow label="Department" value={tech.user?.department} />
                    <InfoRow label="Contact" value={tech.contactNumber || tech.user?.contactNumber || '—'} />
                    <InfoRow label="Active Tickets" value={tech.assignedTickets?.length || 0} />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>SKILLS</span>
                      <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                        {tech.skillSet?.length > 0
                          ? tech.skillSet.map((s) => (
                              <span key={s} className="badge badge-open" style={{ textTransform: 'capitalize' }}>{s}</span>
                            ))
                          : <span className="text-muted text-sm">Not specified</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <button onClick={() => setTechToDelete(tech._id)} className="btn btn-sm" style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                      Remove Technician
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {techToDelete && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div className="card" style={{ width: 400, padding: 24 }}>
              <h3 style={{ marginTop: 0 }}>Confirm Removal</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Are you sure you want to permanently delete this technician? This action cannot be undone.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setTechToDelete(null)}>Cancel</button>
                <button className="btn" style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }} onClick={confirmDelete}>Yes, Remove Technician</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{value ?? '—'}</span>
  </div>
);
