import React, { useEffect } from 'react';

export default function Toast({ toasts = [], onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: 9999, maxWidth: '340px',
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const t = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
      return () => clearTimeout(t);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const colors = {
    info:      { border: 'var(--accent-border)',     icon: '◉', iconColor: 'var(--accent)' },
    success:   { border: 'var(--success-border)',    icon: '✓',  iconColor: 'var(--success)' },
    warning:   { border: 'var(--warning-border)',    icon: '⚠',  iconColor: 'var(--warning)' },
    emergency: { border: 'var(--emergency-border)',  icon: '🚨', iconColor: 'var(--emergency)', animation: 'emergencyFlash 1s infinite' },
    default:   { border: 'var(--border-mid)',        icon: '◉', iconColor: 'var(--text-muted)' },
  };
  const c = colors[toast.type] || colors.default;

  return (
    <div className="fade-in" style={{
      background: 'var(--bg-elevated)',
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-lg)',
      padding: '12px 14px',
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      animation: c.animation,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <span style={{ fontSize: '14px', color: c.iconColor, marginTop: '1px', flexShrink: 0 }}>{c.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{toast.title}</div>}
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{toast.message}</div>
      </div>
      <button onClick={() => onDismiss(toast.id)} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)',
        cursor: 'pointer', fontSize: '14px', padding: '0', flexShrink: 0,
      }}>×</button>
    </div>
  );
}