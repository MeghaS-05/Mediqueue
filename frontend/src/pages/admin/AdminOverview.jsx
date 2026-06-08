import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card, Badge, Button, Avatar, ProgressBar } from '../../components/ui/index';
import NotificationToast from '../../components/shared/NotificationToast';
import { useNavigate } from 'react-router-dom';

const DEPTS = [
  { id: 1, name: 'Cardiology', queue: 12, avgWait: 28, doctors: 3, active: 3 },
  { id: 2, name: 'General OPD', queue: 6, avgWait: 14, doctors: 4, active: 3 },
  { id: 3, name: 'Orthopaedics', queue: 2, avgWait: 6, doctors: 2, active: 2 },
  { id: 4, name: 'Dermatology', queue: 4, avgWait: 11, doctors: 2, active: 1 },
];

const DOCTORS = [
  { id: 1, name: 'Dr. Sharma', dept: 'Cardiology', patients: 10, status: 'available' },
  { id: 2, name: 'Dr. Mehra', dept: 'Cardiology', patients: 7, status: 'available' },
  { id: 3, name: 'Dr. Rao', dept: 'Cardiology', patients: 3, status: 'available' },
  { id: 4, name: 'Dr. Joshi', dept: 'General OPD', patients: 0, status: 'break' },
  { id: 5, name: 'Dr. Patel', dept: 'General OPD', patients: 5, status: 'available' },
  { id: 6, name: 'Dr. Gupta', dept: 'Orthopaedics', patients: 2, status: 'available' },
];

const SLOTS = [
  { dept: 'Cardiology', time: '10:00–11:00', capacity: 12, booked: 12 },
  { dept: 'General OPD', time: '10:00–11:00', capacity: 15, booked: 9 },
  { dept: 'Cardiology', time: '11:00–12:00', capacity: 12, booked: 4 },
  { dept: 'Orthopaedics', time: '10:00–11:00', capacity: 8, booked: 2 },
  { dept: 'Dermatology', time: '11:00–12:00', capacity: 10, booked: 7 },
];

export default function AdminOverview() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin"}');
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', dept: '', avgConsult: '' });

  function addToast(t) { setToasts(prev => [...prev, { ...t, id: Date.now() + Math.random() }]); }
  function dismissToast(id) { setToasts(t => t.filter(x => x.id !== id)); }

  const loadColor = (n) => n >= 9 ? 'var(--danger)' : n >= 5 ? 'var(--warning)' : 'var(--success)';
  const loadLabel = (n, s) => s === 'break' ? <Badge variant="default">On break</Badge>
    : n >= 9 ? <Badge variant="red">Overloaded</Badge>
    : n >= 5 ? <Badge variant="amber">Busy</Badge>
    : <Badge variant="green">Ready</Badge>;

  const nextAssign = DOCTORS.filter(d => d.status === 'available').sort((a, b) => a.patients - b.patients)[0];

  const waitColor = (m) => m >= 25 ? 'var(--danger)' : m >= 15 ? 'var(--warning)' : 'var(--success)';

  return (
    <PageWrapper role="admin" user={user}
      title="Admin overview"
      subtitle="Hospital-wide real-time view"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/analytics')}>View analytics</Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddDoctor(true)}>Add doctor</Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Patients today', value: '143', accent: 'var(--text-primary)' },
          { label: 'Avg wait time', value: '18 min', accent: 'var(--warning)' },
          { label: 'Active doctors', value: '9', accent: 'var(--success)' },
          { label: 'No-shows today', value: '7', accent: 'var(--danger)' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>{m.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: m.accent }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Department queues</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEPTS.map(d => (
              <div key={d.id} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: waitColor(d.avgWait) }}>{d.avgWait} min</span>
                    <Badge variant={d.queue > 10 ? 'red' : d.queue > 5 ? 'amber' : 'green'}>{d.queue} waiting</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.active}/{d.doctors} doctors active</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor load balancing</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live</span>
            </div>
          </div>
          {nextAssign && (
            <div style={{ background: 'var(--success-dim)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: '14px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Next assignment → </span>
              <strong style={{ color: 'var(--success)' }}>{nextAssign.name}</strong>
              <span style={{ color: 'var(--text-muted)' }}> ({nextAssign.patients} patients, lowest in {nextAssign.dept})</span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DOCTORS.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <Avatar name={d.name} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.dept}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {d.status !== 'break' && (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: loadColor(d.patients) }}>{d.patients} pts</span>
                  )}
                  {loadLabel(d.patients, d.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time slot utilisation — today</div>
          <Button variant="ghost" size="sm">Manage slots</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Time slot', 'Department', 'Capacity', 'Booked', 'Utilisation'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((s, i) => {
                const pct = Math.round((s.booked / s.capacity) * 100);
                const full = s.booked >= s.capacity;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{s.time}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{s.dept}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{s.capacity}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: full ? 'var(--danger)' : 'var(--text-primary)' }}>{s.booked}</td>
                    <td style={{ padding: '12px', minWidth: '120px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <ProgressBar value={s.booked} max={s.capacity} color={full ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)'} height={5} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddDoctor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={e => e.target === e.currentTarget && setShowAddDoctor(false)}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 'var(--radius-2xl)', padding: '28px', width: '100%', maxWidth: '400px' }} className="fade-in">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>Add doctor</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input placeholder="Dr. Full Name" value={newDoc.name} onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <select value={newDoc.dept} onChange={e => setNewDoc(d => ({ ...d, dept: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Avg consultation time (min)</label>
                <input type="number" placeholder="8" value={newDoc.avgConsult} onChange={e => setNewDoc(d => ({ ...d, avgConsult: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setShowAddDoctor(false); addToast({ type: 'success', title: 'Doctor added', message: `${newDoc.name} added to ${newDoc.dept}` }); }}>Add doctor</Button>
              <Button variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddDoctor(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </PageWrapper>
  );
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' };