import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card, Badge, Button, MetricCard, ProgressBar } from '../../components/ui/index';
import NotificationToast from '../../components/shared/NotificationToast';

const MOCK_DEPTS = [
  { id: 1, name: 'Cardiology', doctors: 3 },
  { id: 2, name: 'General OPD', doctors: 4 },
  { id: 3, name: 'Orthopaedics', doctors: 2 },
  { id: 4, name: 'Dermatology', doctors: 2 },
];
const MOCK_SLOTS = [
  { id: 1, time: '10:00 – 11:00', total: 12, booked: 12 },
  { id: 2, time: '11:00 – 12:00', total: 12, booked: 4 },
  { id: 3, time: '14:00 – 15:00', total: 12, booked: 9 },
  { id: 4, time: '15:00 – 16:00', total: 12, booked: 2 },
];
const MOCK_HISTORY = [
  { date: '12 Apr 2025', doctor: 'Dr. Mehra', dept: 'Cardiology', wait: '18 min', status: 'completed' },
  { date: '28 Mar 2025', doctor: 'Dr. Rao', dept: 'General OPD', wait: '11 min', status: 'completed' },
  { date: '10 Feb 2025', doctor: 'Dr. Sharma', dept: 'Orthopaedics', wait: '—', status: 'noshow' },
];

export default function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Rahul Sharma"}');
  const [depts] = useState(MOCK_DEPTS);
  const [slots] = useState(MOCK_SLOTS);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [queuePos, setQueuePos] = useState(3);
  const [waitMin, setWaitMin] = useState(23);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...t, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (!appointment) return;
    const interval = setInterval(() => {
      setQueuePos(p => {
        if (p <= 1) { clearInterval(interval); return 1; }
        const np = p - 1;
        if (np === 1) addToast({ type: 'success', title: 'You are next!', message: 'Dr. Mehra will call you shortly. Please be ready.' });
        setWaitMin(m => Math.max(0, m - 8));
        return np;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [appointment, addToast]);

  async function handleBook() {
    if (!selectedDept || !selectedSlot) return;
    const sl = slots.find(s => s.id === selectedSlot);
    if (sl?.booked >= sl?.total) return;
    setBooking(true);
    await new Promise(r => setTimeout(r, 1000));
    setAppointment({ token: 'A-047', doctor: 'Dr. Mehra', dept: selectedDept.name, slot: sl.time });
    setBooking(false);
    addToast({ type: 'info', title: 'Appointment confirmed', message: `Token A-047 · Assigned to Dr. Mehra · ${sl.time}` });
  }

  const statusBadge = (s) => ({
    completed: <Badge variant="green">Completed</Badge>,
    noshow: <Badge variant="red">No-show</Badge>,
    cancelled: <Badge variant="amber">Cancelled</Badge>,
  })[s] || <Badge>Unknown</Badge>;

  const waitColor = waitMin <= 10 ? 'var(--success)' : waitMin <= 20 ? 'var(--warning)' : 'var(--danger)';

  return (
    <PageWrapper role="patient" user={user} title="Patient dashboard" subtitle={`Good morning, ${user.name.split(' ')[0]}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Book appointment</div>

          <label style={labelStyle}>Select department</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {depts.map(d => (
              <button key={d.id} onClick={() => setSelectedDept(d)} style={{
                padding: '10px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                background: selectedDept?.id === d.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${selectedDept?.id === d.id ? 'var(--accent-border)' : 'var(--border)'}`,
                color: selectedDept?.id === d.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '12px', fontWeight: 500, textAlign: 'left',
                transition: 'all var(--transition)',
              }}>
                <div style={{ fontWeight: 600, marginBottom: '2px' }}>{d.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{d.doctors} doctors</div>
              </button>
            ))}
          </div>

          {selectedDept && (
            <>
              <label style={labelStyle}>Choose time slot</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {slots.map(s => {
                  const full = s.booked >= s.total;
                  const left = s.total - s.booked;
                  const sel = selectedSlot === s.id;
                  return (
                    <button key={s.id} onClick={() => !full && setSelectedSlot(s.id)} disabled={full} style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-md)', cursor: full ? 'not-allowed' : 'pointer',
                      background: sel ? 'var(--accent-dim)' : full ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
                      border: `1px solid ${sel ? 'var(--accent-border)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', gap: '10px',
                      opacity: full ? 0.5 : 1, transition: 'all var(--transition)',
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: sel ? 'var(--accent)' : 'var(--text-primary)', flex: 1 }}>{s.time}</span>
                      <span style={{ fontSize: '11px', color: full ? 'var(--danger)' : 'var(--text-muted)' }}>{full ? 'Full' : `${left} left`}</span>
                      {sel && <Badge variant="blue">Selected</Badge>}
                    </button>
                  );
                })}
              </div>

              <button onClick={handleBook} disabled={!selectedSlot || booking} style={{
                width: '100%', padding: '11px', background: 'var(--accent)',
                color: '#fff', fontSize: '14px', fontWeight: 600,
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: (!selectedSlot || booking) ? 'not-allowed' : 'pointer',
                opacity: (!selectedSlot || booking) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {booking && <span style={{ width: 14, height: 14, border: '2px solid #fff4', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                {booking ? 'Booking...' : 'Confirm appointment'}
              </button>
            </>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointment ? (
            <Card style={{ border: '1px solid var(--accent-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your token</div>
                <Badge variant="blue">Live</Badge>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-1px' }}>{appointment.token}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>{appointment.doctor} · {appointment.dept}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-hint)', marginTop: '2px' }}>Slot: {appointment.slot}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Queue position</div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>{queuePos}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>th</span></div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Est. wait time</div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: waitColor }}>~{waitMin}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}> min</span></div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Queue progress</span>
                  <span>{queuePos} ahead</span>
                </div>
                <ProgressBar value={12 - queuePos} max={12} color={waitColor} height={6} />
              </div>

              <Button variant="ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                onClick={() => { setAppointment(null); addToast({ type: 'warning', title: 'Appointment cancelled', message: 'Your slot has been released.' }); }}>
                Cancel appointment
              </Button>
            </Card>
          ) : (
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>◷</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>No active appointment</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Book an appointment on the left to start tracking your queue position.</div>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent visits</div>
          <a href="/history" style={{ fontSize: '12px', color: 'var(--accent)' }}>View all history →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Date', 'Doctor', 'Department', 'Wait', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 10px', color: 'var(--text-primary)' }}>{r.date}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-secondary)' }}>{r.doctor}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-secondary)' }}>{r.dept}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{r.wait}</td>
                  <td style={{ padding: '10px 10px' }}>{statusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </PageWrapper>
  );
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' };