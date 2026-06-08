import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_USERS = [
  { email: 'patient@test.com',  password: '123456', role: 'PATIENT', name: 'Rahul Sharma' },
  { email: 'doctor@test.com',   password: '123456', role: 'DOCTOR',  name: 'Dr. Mehra' },
  { email: 'admin@test.com',    password: '123456', role: 'ADMIN',   name: 'Admin' },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // simulate network

    const user = MOCK_USERS.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError('Invalid email or password. Try patient@test.com / 123456');
      setLoading(false);
      return;
    }

    // store mock JWT-like session
    localStorage.setItem('token', 'mock-jwt-token-' + user.role);
    localStorage.setItem('role', user.role);
    localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));

    const routes = { PATIENT: '/patient', DOCTOR: '/doctor', ADMIN: '/admin' };
    navigate(routes[user.role]);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }} className="fade-in">
          <div style={{
            width: 48, height: 48, borderRadius: '12px', background: 'var(--accent)',
            margin: '0 auto 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#fff',
          }}>M</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Welcome to MediQueue
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Smart hospital queue management platform
          </p>
        </div>

        {/* card */}
        <div className="fade-in" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', padding: '28px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" placeholder="you@hospital.com" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password" placeholder="••••••••" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-dim)', border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px',
                fontSize: '13px', color: 'var(--danger)', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px',
              background: loading ? 'var(--accent-hover)' : 'var(--accent)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              border: 'none', borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading && (
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid #fff4', borderTop: '2px solid #fff',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

          {/* quick login hints */}
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
            padding: '12px 14px', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Quick test logins
            </div>
            {MOCK_USERS.map(u => (
              <div
                key={u.role}
                onClick={() => setForm({ email: u.email, password: u.password })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 8px', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', transition: 'background var(--transition)',
                  marginBottom: '2px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</span>
                <span style={{
                  fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                  borderRadius: '10px',
                  background: u.role === 'PATIENT' ? 'var(--accent-dim)' : u.role === 'DOCTOR' ? 'var(--success-dim)' : 'var(--warning-dim)',
                  color: u.role === 'PATIENT' ? 'var(--accent)' : u.role === 'DOCTOR' ? 'var(--success)' : 'var(--warning)',
                }}>{u.role}</span>
              </div>
            ))}
            <div style={{ fontSize: '11px', color: 'var(--text-hint)', marginTop: '6px' }}>
              Click any row to autofill · password is 123456
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            New patient?{' '}
            <a href="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create account</a>
          </p>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-hint)', marginTop: '8px' }}>
            Doctor and admin accounts are created by hospital admin
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};