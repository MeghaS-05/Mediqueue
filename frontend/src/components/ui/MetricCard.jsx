import React from 'react';

export function MetricCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', padding: '18px 20px',
      transition: 'border-color var(--transition)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        {icon && <span style={{ fontSize: '16px', color: accent || 'var(--text-muted)' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 600, color: accent || 'var(--text-primary)', lineHeight: 1.1, marginBottom: sub ? '4px' : 0 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}
