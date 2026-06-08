import React from 'react';

export function ProgressBar({ value = 0, max = 100, color = 'var(--accent)', height = 4 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: '100%', height, background: 'var(--bg-elevated)', borderRadius: height }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: height, transition: 'width 0.4s ease' }} />
    </div>
  );
}
