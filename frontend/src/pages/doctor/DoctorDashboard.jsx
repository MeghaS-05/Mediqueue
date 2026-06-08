import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card, Badge, Button, Avatar, Divider } from '../../components/ui/index';
import NotificationToast from '../../components/shared/NotificationToast';

const INIT_QUEUE = [
  { id: 1, name: 'Priya Nair', token: 'A-041', age: 72, reason: 'Chest pain', waitMin: 32, priority: 'emergency', position: 1 },
  { id: 2, name: 'Anjali Singh', token: 'A-045', age: 45, reason: 'Follow-up ECG', waitMin: 23, priority: 'normal', position: 2 },
  { id: 3, name: 'Vijay Reddy', token: 'A-046', age: 38, reason: 'Routine checkup', waitMin: 8, priority: 'normal', position: 3 },
  { id: 4, name: 'Mohit Kapoor', token: 'A-048', age: 55, reason: 'Hypertension review', waitMin: 14, priority: 'urgent', position: 4 },
];

const CONSULTING = { id: 99, name: 'Ramesh Kumar', token: 'A-044', age: 58, reason: 'Chest pain, breathlessness', startTime: Date.now() - 7 * 60 * 1000 };

export default function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Dr. Mehra"}');
  const [queue, setQueue] = useState(INIT_QUEUE);
  const [consulting, setConsulting] = useState(CONSULTING);
  const [available, setAvailable] = useState(true);
  const [note, setNote] = useState('');
  const [noShowTimers, setNoShowTimers] = useState({});
  const [calledPatient, setCalledPatient] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [elapsed, setElapsed] = useState(0);

  const addToast = useCallback((t) => {
    setToasts(prev => [...prev, { ...t, id: Date.now() + Math.random() }]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (consulting?.startTime || Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [consulting]);

  useEffect(() => {
    if (!calledPatient) return;
    const id = calledPatient.id;
    const timeout = setTimeout(() => {
      setNoShowTimers(t => ({ ...t, [id]: true }));
    }, 5000);
    return () => clearTimeout(timeout);
  }, [calledPatient]);

  function callNext() {
    if (queue.length === 0) return;
    const sorted = [...queue].sort((a, b) => {
      const score = p => ({ emergency: -1000, urgent: -300, normal: 0 })[p.priority] + p.position;
      return score(a) - score(b);
    });
    const next = sorted[0];
    setCalledPatient(next);
    setQueue(prev => prev.filter(p => p.id !== next.id).map((p, i) => ({ ...p, position: i + 1 })));
    addToast({ type: 'info', title: 'Patient called', message: `${next.name} · ${next.token} — please proceed to consultation room` });
  }

  function markDone() {
    addToast({ type: 'success', title: 'Consultation complete', message: `${consulting.name} — session logged to analytics` });
    if (calledPatient) {
      setConsulting({ ...calledPatient, startTime: Date.now() });
      setCalledPatient(null);
      setNoShowTimers({});
    } else {
      setConsulting(null);
    }
    setNote('');
  }

  function flagEmergency(patient) {
    setQueue(prev => prev.map(p => p.id === patient.id ? { ...p, priority: 'emergency', position: 0 } : p)
      .sort((a, b) => {
        const score = p => ({ emergency: -1000, urgent: -300, normal: 0 })[p.priority] + p.position;
        return score(a) - score(b);
      }).map((p, i) => ({ ...p, position: i + 1 })));
    addToast({ type: 'emergency', title: 'Emergency override', message: `${patient.name} escalated to front of queue`, duration: 0 });
  }

  function markNoShow(patientId) {
    const p = calledPatient?.id === patientId ? calledPatient : queue.find(q => q.id === patientId);
    setCalledPatient(null);
    setNoShowTimers({});
    addToast({ type: 'warning', title: 'No-show recorded', message: `${p?.name || 'Patient'} marked as no-show` });
  }

  function fmtElapsed(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const priorityBadge = (p) => ({
    emergency: <Badge variant="emergency">Emergency</Badge>,
    urgent: <Badge variant="amber">Urgent</Badge>,
    normal: <Badge variant="default">Normal</Badge>,
  })[p];

  const waitColor = (m) => m <= 10 ? 'var(--success)' : m <= 20 ? 'var(--warning)' : 'var(--danger)';

  const sortedQueue = [...queue].sort((a, b) => {
    const score = p => ({ emergency: -1000, urgent: -300, normal: 0 })[p.priority] + p.position;
    return score(a) - score(b);
  });

  return (
    <PageWrapper role="doctor" user={user}
      title="Queue management"
      subtitle="Cardiology · 10:00–11:00 slot"
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: available ? 'var(--success)' : 'var(--danger)', boxShadow: available ? '0 0 6px var(--success)' : 'none', transition: 'all 0.3s' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{available ? 'Available' : 'On break'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAvailable(a => !a)}>
            {available ? 'Take break' : 'Go available'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Seen today', value: '14', color: 'var(--accent)' },
            { label: 'Avg consult', value: '8.2 min', color: 'var(--text-primary)' },
            { label: 'Waiting now', value: String(queue.length), color: queue.length > 6 ? 'var(--warning)' : 'var(--text-primary)' },
            { label: 'No-shows', value: '2', color: 'var(--danger)' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {consulting && (
            <Card style={{ border: '1px solid var(--success-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <Badge variant="green">In consultation</Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>{fmtElapsed(elapsed)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Avatar name={consulting.name} size={42} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{consulting.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{consulting.token} · Age {consulting.age} · {consulting.reason}</div>
                </div>
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add consultation note..." rows={3}
                style={{ width: '100%', resize: 'none', marginBottom: '12px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="success" style={{ flex: 1, justifyContent: 'center' }} onClick={markDone}>Mark done</Button>
                <Button variant="ghost" size="sm">Save note</Button>
              </div>
            </Card>
          )}

          {calledPatient && (
            <div style={{
              background: 'var(--warning-dim)', border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius-xl)', padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Badge variant="amber">Called — awaiting patient</Badge>
                {noShowTimers[calledPatient.id] && <Badge variant="red">5 min exceeded</Badge>}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{calledPatient.name} · {calledPatient.token}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Patient has been called and has not yet arrived.</div>
              {noShowTimers[calledPatient.id] && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="danger" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => markNoShow(calledPatient.id)}>Skip — no show</Button>
                  <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Wait longer</Button>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Waiting queue</div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{queue.length} patients</span>
          </div>

          {sortedQueue.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Queue is empty
            </div>
          ) : sortedQueue.map((patient, i) => {
            const isEmergency = patient.priority === 'emergency';
            return (
              <div key={patient.id} className="slide-in" style={{
                background: isEmergency ? 'var(--emergency-dim)' : 'var(--bg-card)',
                border: `1px solid ${isEmergency ? 'var(--emergency-border)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl)', padding: '14px 16px',
                animation: isEmergency ? 'emergencyFlash 1.5s infinite' : 'none',
                transition: 'all var(--transition)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Avatar name={patient.name} size={36}
                    color={isEmergency ? 'var(--emergency-dim)' : 'var(--accent-dim)'}
                    textColor={isEmergency ? 'var(--emergency)' : 'var(--accent)'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{patient.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{patient.token} · Age {patient.age}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: waitColor(patient.waitMin) }}>{patient.waitMin} min</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>waiting</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{patient.reason}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {priorityBadge(patient.priority)}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '2px' }}>#{patient.position}</span>
                  {!isEmergency && (
                    <Button variant="emergency" size="sm" style={{ marginLeft: 'auto' }} onClick={() => flagEmergency(patient)}>
                      Flag emergency
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }} onClick={callNext} disabled={queue.length === 0}>
            Call next patient
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Wait time guide</div>
            {[
              { color: 'var(--success)', label: 'Under 10 minutes', range: '0–10 min' },
              { color: 'var(--warning)', label: 'Moderate wait', range: '10–20 min' },
              { color: 'var(--danger)', label: 'Long wait', range: '20+ min' },
              { color: 'var(--emergency)', label: 'Emergency', range: 'Priority override' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.range}</span>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>No-show policy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              When a patient is called and does not arrive within <strong style={{ color: 'var(--text-secondary)' }}>5 minutes</strong>, the skip button activates. An additional <strong style={{ color: 'var(--text-secondary)' }}>2-minute auto-skip</strong> fires if no action is taken.
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Priority algorithm</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', lineHeight: 2 }}>
              <span style={{ color: 'var(--accent)' }}>score</span> = tokenNum<br />
              + {'{emergency: -1000}'}<br />
              + {'{urgent: -300}'}<br />
              - (waitMins / 10) × 5
            </div>
          </Card>
        </div>
      </div>

      <NotificationToast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </PageWrapper>
  );
}