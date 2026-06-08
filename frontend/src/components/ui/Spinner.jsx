import React from 'react';

export function Spinner({ size = 18, color = 'var(--accent)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color}22`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}