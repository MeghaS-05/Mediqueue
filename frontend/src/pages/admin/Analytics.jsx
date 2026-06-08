import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card, Badge, Button } from '../../components/ui/index';
import { useNavigate } from 'react-router-dom';

const DEPT_WAIT = [
  { dept: 'Cardiology', min: 28, max: 30 },
  { dept: 'General OPD', min: 14, max: 30 },
  { dept: 'Dermatology', min: 11, max: 30 },
  { dept: 'Orthopaedics', min: 6, max: 30 },
];

const EFFICIENCY = [
  { name: 'Dr. Rao', patients: 18, avgMin: 7.1, score: 94 },
  { name: 'Dr. Mehra', patients: 14, avgMin: 8.2, score: 81 },
  { name: 'Dr. Patel', patients: 12, avgMin: 9.1, score: 74 },
  { name: 'Dr. Sharma', patients: 10, avgMin: 11.4, score: 62 },
  { name: 'Dr. Gupta', patients: 8, avgMin: 13.0, score: 48 },
];

const TREND = [
  { day: 'Mon', wait: 22 },
  { day: 'Tue', wait: 18 },
  { day: 'Wed', wait: 25 },
  { day: 'Thu', wait: 14 },
  { day: 'Fri', wait: 19 },
  { day: 'Sat', wait: 10 },
  { day: 'Sun', wait: 8 },
];

const HEATMAP = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  hours: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'],
  data: [
    [18, 34, 41, 39, 12, 6, 22, 31, 16, 5],
    [8, 24, 38, 42, 14, 7, 19, 27, 13, 4],
    [9, 17, 33, 36, 11, 5, 15, 23, 12, 3],
    [14, 28, 40, 35, 13, 8, 20, 29, 14, 6],
    [12, 22, 37, 33, 10, 4, 18, 25, 11, 4],
  ],
};

const NO_SHOW = [
  { dept: 'Cardiology', rate: 12 },
  { dept: 'General OPD', rate: 8 },
  { dept: 'Dermatology', rate: 15 },
  { dept: 'Orthopaedics', rate: 5 },
];

export default function Analytics() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin"}');
  const navigate = useNavigate();
  const [range, setRange] = useState('week');

  const maxVal = Math.max(...HEATMAP.data.flat());
  const heatColor = (v) => {
    const pct = v / maxVal;
    if (pct < 0.2) return 'rgba(59,130,246,0.08)';
    if (pct < 0.4) return 'rgba(59,130,246,0.2)';
    if (pct < 0.6) return 'rgba(59,130,246,0.38)';
    if (pct < 0.8) return 'rgba(59,130,246,0.58)';
    return 'rgba(59,130,246,0.82)';
  };
  const heatText = (v) => v / maxVal > 0.5 ? '#fff' : 'var(--text-muted)';

  const maxTrend = Math.max(...TREND.map(t => t.wait));

  const scoreColor = (s) => s >= 80 ? 'var(--success)' : s >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <PageWrapper role="admin" user={user}
      title="Analytics"
      subtitle="Operational performance overview"
      actions={
        <div style={{ display: 'flex', gap: '4px' }}>
          {['Today', 'Week', 'Month'].map(r => (
            <button key={r} onClick={() => setRange(r.toLowerCase())} style={{
              padding: '6px 14px', fontSize: '12px', fontWeight: 500,
              background: range === r.toLowerCase() ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              color: range === r.toLowerCase() ? 'var(--accent)' : 'var(--text-secondary)',
              border: `1px solid ${range === r.toLowerCase() ? 'var(--accent-border)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition)',
            }}>{r}</button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total patients', value: '143', sub: '+12% vs yesterday' },
          { label: 'Avg wait time', value: '18 min', sub: '-3 min vs last week' },
          { label: 'Busiest dept', value: 'Cardiology', sub: '42 patients today' },
          { label: 'Top efficiency', value: 'Dr. Rao', sub: 'Score 94 / 100' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>{m.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Avg wait time by department</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEPT_WAIT.map(d => {
              const pct = (d.min / d.max) * 100;
              const color = d.min >= 25 ? 'var(--danger)' : d.min >= 15 ? 'var(--warning)' : 'var(--accent)';
              return (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{d.dept}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color }}>{d.min} min</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Doctor efficiency leaderboard</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EFFICIENCY.map((d, i) => (
              <div key={d.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-hint)', width: '16px', fontWeight: 600 }}>#{i + 1}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.patients} pts · {d.avgMin} min avg</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: scoreColor(d.score), minWidth: '30px', textAlign: 'right' }}>{d.score}</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 3, marginLeft: '24px' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, background: scoreColor(d.score), borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Peak hour heatmap — patients per hour</div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '500px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(10, 1fr)', gap: '3px', alignItems: 'center', marginBottom: '4px' }}>
              <div />
              {HEATMAP.hours.map(h => (
                <div key={h} style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</div>
              ))}
            </div>
            {HEATMAP.days.map((day, di) => (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '40px repeat(10, 1fr)', gap: '3px', marginBottom: '3px', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{day}</div>
                {HEATMAP.data[di].map((val, hi) => (
                  <div key={hi} style={{
                    height: '28px', borderRadius: '4px',
                    background: heatColor(val),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 500, color: heatText(val),
                    transition: 'background 0.3s',
                  }}>{val}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low</span>
          {[0.08, 0.2, 0.38, 0.58, 0.82].map((o, i) => (
            <div key={i} style={{ width: 20, height: 12, borderRadius: '3px', background: `rgba(59,130,246,${o})` }} />
          ))}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High</span>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Wait time trend — 7 days</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', marginBottom: '8px' }}>
            {TREND.map(t => {
              const h = (t.wait / maxTrend) * 70;
              const color = t.wait >= 22 ? 'var(--danger)' : t.wait >= 15 ? 'var(--warning)' : 'var(--accent)';
              return (
                <div key={t.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.wait}</span>
                  <div style={{ width: '100%', height: `${h}px`, background: color, borderRadius: '3px 3px 0 0', transition: 'height 0.6s ease', opacity: 0.85 }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>No-show rate by department</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {NO_SHOW.map(d => (
              <div key={d.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{d.dept}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: d.rate > 12 ? 'var(--danger)' : d.rate > 8 ? 'var(--warning)' : 'var(--success)' }}>{d.rate}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${d.rate * 4}%`, background: d.rate > 12 ? 'var(--danger)' : d.rate > 8 ? 'var(--warning)' : 'var(--success)', borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}