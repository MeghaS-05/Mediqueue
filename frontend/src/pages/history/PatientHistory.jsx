import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card, Badge, Button, Avatar } from '../../components/ui/index';

const VISITS = [
  { id:1, date:'12 Apr 2025', doctor:'Dr. Mehra',  dept:'Cardiology',   token:'A-044', slot:'10:00-11:00', estWait:20, actualWait:18, consultMin:9,  priority:'normal',  status:'completed', note:'BP slightly elevated at 142/88. Advised lifestyle changes and follow-up in 4 weeks. ECG normal. Prescribed Amlodipine 5mg once daily.' },
  { id:2, date:'28 Mar 2025', doctor:'Dr. Rao',    dept:'General OPD',  token:'A-031', slot:'11:00-12:00', estWait:14, actualWait:11, consultMin:7,  priority:'normal',  status:'completed', note:'Routine checkup. All vitals normal. CBC within range. Advised vitamin D supplementation.' },
  { id:3, date:'10 Feb 2025', doctor:'Dr. Sharma', dept:'Orthopaedics', token:'A-018', slot:'10:00-11:00', estWait:null, actualWait:null, consultMin:null, priority:'normal', status:'noshow',    note:null },
  { id:4, date:'02 Jan 2025', doctor:'Dr. Mehra',  dept:'Cardiology',   token:'A-009', slot:'14:00-15:00', estWait:24, actualWait:22, consultMin:11, priority:'urgent',  status:'completed', note:'Palpitations reported. Holter monitor prescribed for 24 hrs. No arrhythmia on ECG. Follow-up scheduled.' },
  { id:5, date:'15 Nov 2024', doctor:'Dr. Patel',  dept:'General OPD',  token:'A-052', slot:'10:00-11:00', estWait:18, actualWait:16, consultMin:8,  priority:'normal',  status:'completed', note:'Seasonal flu. Prescribed antihistamine and rest. Advised hydration.' },
  { id:6, date:'03 Oct 2024', doctor:'Dr. Gupta',  dept:'Orthopaedics', token:'A-033', slot:'11:00-12:00', estWait:12, actualWait:null, consultMin:null, priority:'normal', status:'cancelled', note:null },
];

const MONTHLY = [
  {month:'Nov',count:1},{month:'Dec',count:2},{month:'Jan',count:1},
  {month:'Feb',count:2},{month:'Mar',count:3},{month:'Apr',count:3},
];

export default function PatientHistory() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Rahul Sharma"}');
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]     = useState('all');

  const completed = VISITS.filter(v => v.status === 'completed').length;
  const noShows   = VISITS.filter(v => v.status === 'noshow').length;
  const maxCount  = Math.max(...MONTHLY.map(m => m.count));
  const filtered  = filter === 'all' ? VISITS : VISITS.filter(v => v.status === filter);

  const statusBadge = s => ({
    completed: <Badge variant="green">Completed</Badge>,
    noshow:    <Badge variant="red">No-show</Badge>,
    cancelled: <Badge variant="amber">Cancelled</Badge>,
  })[s] || <Badge>Unknown</Badge>;

  const priorityBadge = p => ({
    emergency: <Badge variant="emergency">Emergency</Badge>,
    urgent:    <Badge variant="amber">Urgent</Badge>,
    normal:    <Badge variant="default">Normal</Badge>,
  })[p];

  const DetailRow = ({ label, val }) => (
    <div style={{ display:'flex', gap:'12px', marginBottom:'7px' }}>
      <span style={{ fontSize:'12px', color:'var(--text-muted)', minWidth:'130px' }}>{label}</span>
      <span style={{ fontSize:'12px', color:'var(--text-primary)', fontWeight:500, textTransform:'capitalize' }}>{val}</span>
    </div>
  );

  return (
    <PageWrapper role="patient" user={user}
      title="Patient history"
      subtitle="Complete visit and medical record"
      actions={<Button variant="ghost" size="sm" onClick={() => window.print()}>Download PDF</Button>}
    >
      {/* ── summary header ── */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'20px', alignItems:'center', marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <Avatar name={user.name} size={52} />
          <div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'2px' }}>Age 34 · Member since Jan 2024</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
          {[
            { label:'Total visits', value:String(VISITS.length), color:'var(--text-primary)' },
            { label:'Completed',    value:String(completed),     color:'var(--success)' },
            { label:'Most visited', value:'Cardiology',          color:'var(--accent)' },
            { label:'No-shows',     value:String(noShows),       color: noShows > 0 ? 'var(--danger)' : 'var(--text-muted)' },
          ].map(m => (
            <div key={m.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'14px 16px' }}>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom:'6px' }}>{m.label}</div>
              <div style={{ fontSize:'18px', fontWeight:700, color:m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── monthly chart ── */}
      <Card style={{ marginBottom:'20px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'16px' }}>Visits per month</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'72px' }}>
          {MONTHLY.map(m => {
            const h = Math.max(8, (m.count / maxCount) * 60);
            return (
              <div key={m.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>{m.count}</span>
                <div style={{ width:'100%', height:`${h}px`, background:'var(--accent)', opacity:.75, borderRadius:'4px 4px 0 0', transition:'height .6s ease' }} />
                <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>{m.month}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── visit table ── */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em' }}>Visit history</div>
          <div style={{ display:'flex', gap:'4px' }}>
            {['all','completed','noshow','cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:'5px 12px', fontSize:'11px', fontWeight:500, cursor:'pointer',
                background: filter===f ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                color:      filter===f ? 'var(--accent)'     : 'var(--text-muted)',
                border:`1px solid ${filter===f ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius:'var(--radius-md)', textTransform:'capitalize', transition:'all var(--transition)',
              }}>
                {f === 'noshow' ? 'No-show' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr>
                {['Date','Doctor','Department','Wait','Consult','Priority','Status',''].map(h => (
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.05em', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <React.Fragment key={v.id}>
                  <tr
                    style={{ borderBottom: expanded===v.id ? 'none' : '1px solid var(--border)', cursor:'pointer', background: expanded===v.id ? 'var(--bg-elevated)' : 'transparent', transition:'background var(--transition)' }}
                    onClick={() => setExpanded(expanded===v.id ? null : v.id)}
                    onMouseEnter={e => { if (expanded!==v.id) e.currentTarget.style.background='var(--bg-elevated)'; }}
                    onMouseLeave={e => { if (expanded!==v.id) e.currentTarget.style.background='transparent'; }}
                  >
                    <td style={{ padding:'12px', color:'var(--text-primary)', fontWeight:500, whiteSpace:'nowrap' }}>{v.date}</td>
                    <td style={{ padding:'12px', color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{v.doctor}</td>
                    <td style={{ padding:'12px', color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{v.dept}</td>
                    <td style={{ padding:'12px', color: v.actualWait ? 'var(--text-muted)' : 'var(--text-hint)', whiteSpace:'nowrap' }}>{v.actualWait ? `${v.actualWait} min` : '—'}</td>
                    <td style={{ padding:'12px', color: v.consultMin ? 'var(--text-muted)' : 'var(--text-hint)', whiteSpace:'nowrap' }}>{v.consultMin ? `${v.consultMin} min` : '—'}</td>
                    <td style={{ padding:'12px' }}>{priorityBadge(v.priority)}</td>
                    <td style={{ padding:'12px' }}>{statusBadge(v.status)}</td>
                    <td style={{ padding:'12px', color:'var(--text-muted)', fontSize:'14px', userSelect:'none' }}>{expanded===v.id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded===v.id && (
                    <tr style={{ borderBottom:'1px solid var(--border)' }}>
                      <td colSpan={8} style={{ padding:0 }}>
                        <div className="fade-in" style={{ background:'var(--bg-elevated)', borderTop:'1px solid var(--border)', padding:'18px 20px' }}>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
                            <div>
                              <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'10px' }}>Visit details</div>
                              <DetailRow label="Token"            val={v.token} />
                              <DetailRow label="Time slot"        val={v.slot} />
                              <DetailRow label="Estimated wait"   val={v.estWait ? `${v.estWait} min` : '—'} />
                              <DetailRow label="Actual wait"      val={v.actualWait ? `${v.actualWait} min` : '—'} />
                              <DetailRow label="Consult duration" val={v.consultMin ? `${v.consultMin} min` : '—'} />
                              <DetailRow label="Priority"         val={v.priority} />
                              {v.actualWait && v.estWait && (
                                <div style={{ marginTop:'14px' }}>
                                  <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:500, marginBottom:'8px' }}>Wait accuracy</div>
                                  {[
                                    { label:'Estimated', val:v.estWait,    color:'var(--text-muted)' },
                                    { label:'Actual',    val:v.actualWait, color:'var(--accent)' },
                                  ].map(b => (
                                    <div key={b.label} style={{ marginBottom:'8px' }}>
                                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--text-muted)', marginBottom:'3px' }}>
                                        <span>{b.label}</span><span style={{ color:b.color }}>{b.val} min</span>
                                      </div>
                                      <div style={{ height:5, background:'var(--bg-card)', borderRadius:3 }}>
                                        <div style={{ height:'100%', width:`${(b.val/30)*100}%`, background:b.color, borderRadius:3 }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'10px' }}>Doctor's note</div>
                              {v.note
                                ? <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px', fontSize:'13px', color:'var(--text-secondary)', lineHeight:1.7 }}>{v.note}</div>
                                : <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px', fontSize:'12px', color:'var(--text-hint)', fontStyle:'italic' }}>No doctor note recorded for this visit.</div>
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>
              No visits found for the selected filter.
            </div>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}