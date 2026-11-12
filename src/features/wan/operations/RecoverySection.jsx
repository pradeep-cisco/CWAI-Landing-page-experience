import { useState } from 'react';
import { SectionHeader, StatusTag, MetricChart, EvidenceNote } from './OperationsPrimitives.jsx';
import './recovery-section.css';

const minutes = value => String(value).split(':').reduce((sum, value, index) => sum + Number(value) * (index ? 1 : 60), 0);
const jobLabels = { 'not-started': 'Not started', running: 'Running', completed: 'Confirmed complete', failed: 'Failed', unknown: 'Unconfirmed' };

function EvidenceLane({ label, status, tone = 'info', from, to, start, end, selectedTime, detail, marks = [] }) {
  const position = value => Math.max(0, Math.min(100, (minutes(value) - start) / Math.max(1, end - start) * 100));
  const left = from ? position(from) : 0;
  return <div className="rec-evidence-lane" data-tone={tone}>
    <div className="rec-lane-heading"><span>{label}</span><span className="rec-lane-status">{status}</span></div>
    <div className="rec-lane-track">
      {from && to && <div className="rec-lane-interval" style={{ left: `${left}%`, width: `${Math.max(.5, position(to) - left)}%` }} />}
      {marks.map(mark => <span className="rec-lane-sample" key={mark.time} style={{ left: `${position(mark.time)}%` }} />)}
      {selectedTime && <span className="rec-lane-cursor" style={{ left: `${position(selectedTime)}%` }} />}
    </div>
    <span className="rec-lane-detail">{detail}</span>
  </div>;
}

export default function RecoverySection({ model, onInspect, onOpen }) {
  const [selectedTime, setSelectedTime] = useState(null), [showCriteria, setShowCriteria] = useState(false);
  const { response, observation, recovery, samples, scope, time } = model;
  const active = model.frame >= 2;
  const start = minutes(samples[0]?.time || time), end = Math.max(start + 1, minutes(time));
  const cursor = samples.some(sample => sample.time === selectedTime) ? selectedTime : samples.at(-1)?.time;
  const complete = response.job.status === 'completed';
  const badResult = ['failed', 'unknown'].includes(response.job.status);
  const tone = response.resolved ? 'positive' : badResult || !observation.fresh ? 'warning' : 'info';
  const status = response.resolved ? 'Verified' : badResult ? 'Outcome unconfirmed' : !active ? 'Ready to verify' : !observation.fresh ? 'Waiting for data' : complete ? 'Verification pending' : response.job.id ? 'Following execution' : 'Awaiting response';

  return <section tabIndex={-1} className="ops-section rec-section" id="ops-recovery" aria-labelledby="ops-recovery-title" data-verified={response.resolved}>
    <SectionHeader id="ops-recovery-title" title="Recovery" description="Controller completion and network recovery are checked independently.">
      <StatusTag tone={tone}>{status}</StatusTag>
    </SectionHeader>
    {!active ? <div className="rec-ready">
      <div className="rec-ready-visual" aria-hidden="true"><svg viewBox="0 0 520 100"><path d="M10 50h100m0 0 10-20 20 40 20-40 20 40 20-20h70m0 0 10-12 20 24 20-24 20 12h150"/><circle cx="112" cy="50" r="5"/><circle cx="270" cy="50" r="5"/><circle cx="495" cy="50" r="5"/></svg></div>
      <div className="rec-ready-steps"><span>Confirmed execution</span><span>Current observations</span><span>Sustained recovery</span></div>
      <p>Recovery evidence will appear here when a condition requires a response. Earlier verified results remain in <a href="#ops-resolved">Resolved</a>.</p>
    </div> : <>
      <div className="rec-summary">
        <div><span className="ops-eyebrow">{scope.domain} · {scope.router}</span><hbr-text variant="sub-section-title">{response.resolved ? 'Recovery independently verified' : complete ? 'Execution complete. Recovery still needs proof.' : badResult ? 'A successful response has not been established.' : 'Following the condition through recovery'}</hbr-text><p>{response.resolved ? 'Current observations, source clearance, and the stability window support this result.' : badResult ? 'Source improvement cannot establish a successful controller result.' : !observation.fresh ? `Current telemetry is unavailable. The last trustworthy observation is ${observation.observedAt}.` : response.currentWork}</p></div>
        <div className="rec-current-reading" key={`${observation.observedAt}-${observation.utilization}`}><strong>{observation.utilization}<small>%</small></strong><span>{observation.fresh ? 'Outbound utilization' : 'Last-known utilization'}</span><time>{observation.observedAt}</time></div>
      </div>
      <div className="rec-proof-surface" data-stale={!observation.fresh}>
        <MetricChart samples={samples} threshold={model.threshold} selectedTime={cursor} onSelect={setSelectedTime} actionTime={response.job.startedAt} endTime={time} height={240} label="Interface utilization · recorded samples"/>
        <div className="rec-evidence-lanes">
          <EvidenceLane label="Source alarm" status={model.frame === 11 ? 'Source-cleared · 08:30' : 'Major · Active'} tone={model.frame === 11 ? 'positive' : 'warning'} from="08:00" to={model.frame === 11 ? '08:30' : time} start={start} end={end} selectedTime={cursor} detail="CNC-1042 · Independent source state"/>
          <EvidenceLane label="Interface observations" status={observation.fresh ? 'Current' : 'Collection unavailable'} tone={observation.fresh ? 'info' : 'warning'} start={start} end={end} selectedTime={cursor} marks={samples} detail={observation.fresh ? `Latest recorded sample ${observation.observedAt}` : `Last known ${observation.observedAt}; the line stops at that observation`}/>
          <EvidenceLane label="Controller result" status={jobLabels[response.job.status]} tone={badResult ? 'warning' : complete ? 'positive' : 'info'} from={response.job.startedAt} to={response.job.completedAt || time} start={start} end={end} selectedTime={cursor} detail={response.job.id ? `${response.job.id} · ${response.job.completedAt ? `Confirmed completed ${response.job.completedAt}` : response.job.status === 'running' ? 'Confirmed execution under observation' : 'Retained controller result'}` : 'No controller change has been confirmed'}/>
          <EvidenceLane label="Stable observations" status={recovery.observationWindow ? '5 minutes within limits' : 'Window not established'} tone={response.resolved ? 'positive' : 'info'} from={recovery.observationWindow?.from} to={recovery.observationWindow?.to} start={start} end={end} selectedTime={cursor} detail={recovery.observationWindow ? '08:30–08:35 · Source stability check' : 'Requires current below-limit observations and source clearance'}/>
        </div>
      </div>
      <div className="rec-footer"><EvidenceNote>Sample inspection preserves the current response. All verification checks below describe the current source snapshot.</EvidenceNote><hbr-button size="small" variant="text" onClick={() => setShowCriteria(value => !value)}>{showCriteria ? 'Hide recovery checks' : 'Inspect recovery checks'}</hbr-button></div>
      {showCriteria && <div className="rec-checks" data-new="true">
        <div className="rec-check" data-met={complete}><span>{complete ? '✓' : '○'}</span><div><strong>Confirmed controller completion</strong><p>{response.job.id || 'No job confirmed'} · {jobLabels[response.job.status]}</p></div></div>
        {model.criteria.map(criterion => <div className="rec-check" key={criterion.id} data-met={criterion.met}><span>{criterion.met ? '✓' : '○'}</span><div><strong>{criterion.label}</strong><p>{criterion.detail}</p></div></div>)}
      </div>}
      <div className="rec-actions"><hbr-button size="small" variant="outline" onClick={() => onInspect?.({ kind: 'interface', id: scope.interfaceId })}>Inspect interface</hbr-button><hbr-button size="small" variant="text" onClick={() => onOpen?.('interface')}>Review response</hbr-button></div>
    </>}
  </section>;
}
