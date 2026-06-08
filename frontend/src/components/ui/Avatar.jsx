import React from 'react';

export function Avatar({ name = '', size = 36, color = 'var(--accent-dim)', textColor = 'var(--accent)' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

