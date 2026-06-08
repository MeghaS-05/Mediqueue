import React from 'react';

export function Card({ children, className = '', style = {}, onClick, hoverable }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        background: hovered && hoverable ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        transition: 'all var(--transition)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}
