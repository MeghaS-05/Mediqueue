import React from 'react';
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontFamily: 'var(--font)', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--radius-md)', transition: 'all var(--transition)',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { fontSize: '12px', padding: '6px 12px' },
    md: { fontSize: '13px', padding: '9px 16px' },
    lg: { fontSize: '14px', padding: '11px 22px' },
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-mid)' },
    danger: { background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)' },
    success: { background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid var(--success-border)' },
    warning: { background: 'var(--warning-dim)', color: 'var(--warning)', border: '1px solid var(--warning-border)' },
    emergency: { background: 'var(--emergency-dim)', color: 'var(--emergency)', border: '1px solid var(--emergency-border)' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

