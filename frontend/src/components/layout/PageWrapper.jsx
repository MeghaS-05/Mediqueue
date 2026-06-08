import React from 'react';
import Sidebar from './Sidebar';

export default function PageWrapper({ role, user, children, title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar role={role} user={user} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {(title || actions) && (
          <header style={{
            padding: '20px 28px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              {title && <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</h1>}
              {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
          </header>
        )}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}