import React from 'react';

export function Divider({ style = {} }) {
  return <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0', ...style }} />;
}