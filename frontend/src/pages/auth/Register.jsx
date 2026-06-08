import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', age: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!form.age || form.age < 1 || form.age > 120) {
      setError('Please enter a valid age.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const existing = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existing.find(u => u.email === form.email)) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    existing.push({ ...form, role: 'PATIENT' });
    localStorage.setItem('registeredUsers', JSON.stringify(existing));

    setSuccess('Account created! Redirecting to login...');
    setLoading(false);

    await new Promise(r => setTimeout(r, 1200));
    navigate('/login');
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }} className="fade-in">
          <div style={{
            width: 44, height: 44, borderRadius: '10px', background: 'var(--accent)',
            margin: '0 auto 14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff',
          }}>M</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Create patient account
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Join MediQueue for smart appointment booking
          </p>
        </div>

        {/* card */}
        <div className="fade-in" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)', padding: '28px',
        }}>
          <form onSubmit={handleSubmit}>

            {/* name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Full name</label>
              <input
                type="text" placeholder="Rahul Sharma" required
                value={form.name} onChange={set('name')}
              />
            </div>

            {/* email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" placeholder="you@email.com" required
                value={form.email} onChange={set('email')}
              />
            </div>

            {/* phone */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Phone number</label>
              <input
                type="tel" placeholder="+91 98765 43210" required
                value={form.phone} onChange={set('phone')}
              />
            </div>

            {/* age + password side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Age</label>
                <input
                  type="number" min="1" max="120" placeholder="34" required
                  value={form.age} onChange={set('age')}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password" placeholder="••••••••" required
                  value={form.password} onChange={set('password')}
                />
              </div>
            </div>

            {/* age info hint */}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              padding: '10px 12px', marginBottom: '16px',
              display: 'flex', gap: '8px', alignItems: 'flex-start',
            }}>
              <span style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>ℹ</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Age is used for priority scoring — patients 60+ receive an urgency boost in the queue.
              </span>
            </div>

            {/* error */}
            {error && (
              <div style={{
                background: 'var(--danger-dim)', border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px',
                fontSize: '13px', color: 'var(--danger)', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            {/* success */}
            {success && (
              <div style={{
                background: 'var(--success-dim)', border: '1px solid var(--success-border)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px',
                fontSize: '13px', color: 'var(--success)', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>✓</span> {success}
              </div>
            )}

            {/* submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px',
              background: loading ? 'var(--accent-hover)' : 'var(--accent)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              border: 'none', borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all var(--transition)',
            }}>
              {loading && (
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid #fff4', borderTop: '2px solid #fff',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
              )}
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <a href="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</a>
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