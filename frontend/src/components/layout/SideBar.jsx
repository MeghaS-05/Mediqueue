import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = {
  patient: [
    { label: 'Dashboard', icon: '⬡', path: '/patient' },
    { label: 'History', icon: '◷', path: '/history' },
  ],
  doctor: [
    { label: 'Queue', icon: '⬡', path: '/doctor' },
    { label: 'Patients', icon: '◉', path: '/doctor/patients' },
  ],
  admin: [
    { label: 'Overview', icon: '⬡', path: '/admin' },
    { label: 'Analytics', icon: '◈', path: '/admin/analytics' },
    { label: 'Doctors', icon: '◉', path: '/admin/doctors' },
    { label: 'Slots', icon: '◷', path: '/admin/slots' },
  ],
};

export default function Sidebar({ role = 'patient', user = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = NAV[role] || [];

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '0', minHeight: '100vh',
    }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff',
          }}>M</div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>MediQueue</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: 'var(--radius-md)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                marginBottom: '2px', cursor: 'pointer',
                transition: 'all var(--transition)', textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, color: 'var(--accent)',
          }}>
            {(user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{user.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role}</div>
          </div>
        </div>
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          style={{
            width: '100%', padding: '8px', background: 'var(--bg-elevated)',
            color: 'var(--text-muted)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', fontSize: '12px', cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >Sign out</button>
      </div>
    </aside>
  );
}