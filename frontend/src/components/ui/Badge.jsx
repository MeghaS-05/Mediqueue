import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontFamily: 'var(--font)', fontWeight: 500, borderRadius: '20px',
    fontSize: size === 'sm' ? '11px' : '12px',
    padding: size === 'sm' ? '2px 8px' : '3px 10px',
  };
  const variants = {
    default: { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    blue: { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' },
    green: { background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid var(--success-border)' },
    amber: { background: 'var(--warning-dim)', color: 'var(--warning)', border: '1px solid var(--warning-border)' },
    red: { background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)' },
    emergency: { background: 'var(--emergency-dim)', color: 'var(--emergency)', border: '1px solid var(--emergency-border)', animation: 'pulse 1.5s infinite' },
  };
  return <span style={{ ...base, ...variants[variant] }}>{children}</span>;
}
