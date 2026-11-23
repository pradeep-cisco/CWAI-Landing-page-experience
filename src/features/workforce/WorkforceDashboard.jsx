import { useEffect, useRef, useState } from 'react';
import { getWorkforceSnapshot } from './workforce-model.js';
import './workforce-dashboard.css';

const statusIcon = tone => tone === 'warning' ? 'status-warning' : tone === 'positive' ? 'status-positive' : tone === 'inactive' ? 'status-dormant' : 'status-info-square';
function Tag({ tone = 'info', children }) { return <hbr-tag size="small" sentiment={tone} status>{children}</hbr-tag>; }

function Checkpoints({ job }) {
  return <span className="workforce-checkpoints" role="list" aria-label={`${job.id} checkpoints`}>
    {job.steps.map((label, index) => <span role="listitem" key={label} className="workforce-checkpoint" data-state={index < job.step ? 'complete' : index === job.step ? 'current' : 'future'} aria-label={`${label}: ${index < job.step ? 'completed' : index === job.step ? 'current checkpoint' : 'not reached'}`}>
      <span className="workforce-checkpoint-mark" aria-hidden="true">{index < job.step && <hbr-icon name="check" size="10px"/>}</span><span>{label}</span>
    </span>)}
  </span>;
}

function Inspection({ selection, model, onSelect, onClose, detailRef }) {
  const job = model.jobs.find(item => item.id === selection.job) || model.jobs[0];
  const event = selection.type === 'action' ? model.knownActions.find(item => item.id === selection.id) : null;
  let title = job.title, subtitle = `${job.id} · ${job.agent} ${job.version}`;
  let fields = [['Current state', job.status], ['Observed condition', job.headline], ['Next checkpoint', job.next], ['Agent health', `${job.availability} · ${job.health}`]];
  if (job.eligibility) fields.push(['Assignment eligibility', job.eligibility]);
  let detail = job.detail;
  if (selection.type === 'approval') {
    title = model.scene < 3 ? 'Remediation approval' : 'Authorization record';
    detail = 'Review is read-only in this concept. No approval or controller operation is submitted by opening this record.';
    fields = [['Proposal', 'PLAN-J21 · Remediation R1'], ['Policy basis', 'Outside the configured unattended-action set.'], ['Declared scope', 'Only the reviewed corrective proposal and its declared resources.'], ['Decision status', model.scene < 3 ? 'Awaiting a policy-required approval.' : 'Submission recorded; AUTH-J21 confirms effective authorization.'], ['Execution', model.scene < 4 ? model.scene === 3 ? 'Prerequisites rechecking. No operation has been issued.' : 'No operation has been issued.' : model.scene === 4 ? 'RUN-021 acknowledged and executing.' : 'RUN-021 completed.'], ['Outcome', model.scene === 6 ? 'J21 criteria met; proof retained.' : 'A verified outcome is not yet established.'], ['Validity', 'Changed or expired proposals require applicable revalidation and authority. An expiry value is not supplied in this snapshot.']];
  } else if (selection.type === 'restriction') {
    title = 'Collection eligibility';
    detail = 'This eligibility control does not repair T1, cancel J17, or roll back an operation.';
    fields = [['Decision status', model.scene < 2 ? 'No restriction requested in this snapshot.' : model.scene === 2 ? 'Requested; not applied.' : 'New-assignment restriction confirmed.'], ['Affected capability', 'Network Troubleshooter T1 · Collection'], ['Observed health', job.health], ['Scope', 'New production assignments to the affected capability/version.'], ['Existing work', 'J17 retains its actual state and accountable owner.'], ['Governor response', model.handling], ['Policy basis', 'The configured policy reserves this eligibility control for the AI Admin.']];
  } else if (selection.type === 'source') {
    title = 'Baseline source'; subtitle = 'J23 · Integration context'; detail = 'D1 is healthy. Waiting for a prerequisite does not establish an agent failure.';
    fields = [['Required source', 'Baseline integration for the declared assessment scope.'], ['Current constraint', 'Permitted source access is not configured.'], ['Supported next step', 'The authorized integration owner establishes access; Crosswork AI confirms it and rechecks the job prerequisite.'], ['Available control', 'Inspection only. This concept does not change integration settings.']];
  } else if (selection.type === 'observability') {
    title = 'Collection evidence'; subtitle = 'J17 · Network Troubleshooter T1'; detail = 'Availability, capability health, and assignment eligibility remain distinct.';
    fields = [['Tool evidence', model.scene === 0 ? 'Required collection responses are delayed.' : 'Repeated collection timeouts; no suitable new evidence.'], ['Recovery', model.scene < 2 ? 'Dependency and permitted recovery checks are underway.' : 'Bounded recovery did not restore the capability; no eligible authorized replacement is available.'], ['Current job', job.status], ['Eligibility', job.eligibility || 'No eligibility change is recorded.'], ['Next checkpoint', job.next]];
  } else if (selection.type === 'trust') {
    title = 'Authority and evidence'; subtitle = 'Scoped records · J21'; detail = 'These records describe this work. They do not establish workforce-wide compliance.';
    fields = [['Authorization', model.scene < 3 ? 'Policy-required approval pending.' : 'Separate decision-submission and effective grant records.'], ['Execution', model.scene < 4 ? 'No controller operation issued.' : model.scene === 4 ? 'RUN-021 acknowledged after authority and prerequisite checks.' : 'RUN-021 completion retained.'], ['Verification', model.scene < 5 ? 'No verified result yet.' : model.scene === 5 ? 'J21-specific criteria still being checked.' : 'J21-specific criteria met; proof retained.'], ['Other work', 'J17 and J23 retain their own constraints and records.']];
  } else if (event) {
    title = event.title; subtitle = `${event.job} · ${event.record}`; detail = event.detail;
    fields = [['Record', event.label], ['Actor', event.actor], ['Current job state', job.status]];
  }
  return <hbr-card ref={detailRef} class="workforce-inspection" role="region" aria-label="Selected work details">
    <hbr-layout slot="header" direction="row" gap="md" align="start" justify="space-between" class="workforce-inspection-heading"><hbr-layout direction="column" gap="2xs"><hbr-text type="secondary" size="sm">{subtitle}</hbr-text><hbr-text variant="sub-section-title"><h3>{title}</h3></hbr-text></hbr-layout><hbr-button size="small" variant="text" onClick={onClose} aria-label="Close work details"><hbr-icon name="x"/></hbr-button></hbr-layout>
    <p className="workforce-inspection-intro">{detail}</p>
    <dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <hbr-layout slot="footer" direction="row" gap="sm" class="workforce-inspection-tools">
      {job.id === 'J17' && <><hbr-button size="small" variant="text" onClick={() => onSelect({ type: 'observability', job: 'J17' })}>Collection evidence<hbr-icon name="arrow-right" slot="suffix"/></hbr-button>{model.scene >= 2 && <hbr-button size="small" variant="text" onClick={() => onSelect({ type: 'restriction', job: 'J17' })}>Eligibility record</hbr-button>}</>}
      {job.id === 'J21' && <><hbr-button size="small" variant="text" onClick={() => onSelect({ type: 'approval', job: 'J21' })}>{model.scene < 3 ? 'Approval context' : 'Authorization record'}</hbr-button><hbr-button size="small" variant="text" onClick={() => onSelect({ type: 'trust', job: 'J21' })}>Authority trace<hbr-icon name="arrow-right" slot="suffix"/></hbr-button></>}
      {job.id === 'J23' && <hbr-button size="small" variant="text" onClick={() => onSelect({ type: 'source', job: 'J23' })}>Integration context<hbr-icon name="arrow-right" slot="suffix"/></hbr-button>}
    </hbr-layout>
  </hbr-card>;
}

export default function WorkforceDashboard({ scene = 0 }) {
  const model = getWorkforceSnapshot(scene);
  const [selection, setSelection] = useState(null), [changed, setChanged] = useState([]);
  const previous = useRef(model), jobsRef = useRef(new Map()), detailRef = useRef(null);
  useEffect(() => {
    if (previous.current.scene === model.scene) return;
    setChanged(model.jobs.filter(job => JSON.stringify(job) !== JSON.stringify(previous.current.jobs.find(item => item.id === job.id))).map(job => job.id));
    previous.current = model;
    const timer = setTimeout(() => setChanged([]), 700);
    return () => clearTimeout(timer);
  }, [model.scene]);
  const safeSelection = selection?.type === 'action' && !model.knownActions.some(item => item.id === selection.id) ? { type: 'job', job: selection.job } : selection;
  const inspect = next => {
    setSelection(next);
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  };
  const close = () => { const job = safeSelection?.job; setSelection(null); requestAnimationFrame(() => jobsRef.current.get(job)?.focus()); };
  return <hbr-layout direction="column" gap="lg" class="workforce-dashboard" data-workforce-scene={model.scene}>
    <hbr-card class="workforce-summary" role="region" aria-label="Current workforce situation">
    <hbr-layout direction="row" gap="lg" align="center" class="workforce-posture" data-phase={model.phase}>
      <div className="workforce-posture-mark" aria-hidden="true"><hbr-icon name={model.scene === 6 ? 'check-circle' : 'nav-agents'} size="28px"/></div>
      <hbr-layout direction="column" gap="xs" class="workforce-posture-copy"><hbr-text type="secondary" size="sm">AI workforce</hbr-text><hbr-text variant="page-title"><h1>{model.title}</h1></hbr-text><hbr-text type="secondary" size="sm">{model.subtitle}</hbr-text></hbr-layout>
      <div className="workforce-posture-trace" aria-hidden="true"><span/><i/><span/><i/><span/></div>
    </hbr-layout>
    </hbr-card>
    <hbr-layout display="grid" gap="lg" class="workforce-main">
      <section className="workforce-activity" aria-label="Workforce activity">
        <hbr-layout variant="dashboard:widgets:container">
        <hbr-card container col="full" class="workforce-container">
        <hbr-layout slot="header" direction="row" gap="md" align="center" justify="space-between" class="workforce-section-heading"><hbr-text variant="section-title"><h2>Activity</h2></hbr-text><hbr-text type="secondary" size="sm">Current work</hbr-text></hbr-layout>
        <hbr-layout direction="column" gap="md">
        <div className="workforce-lanes">
          {model.jobs.map(job => <button type="button" key={job.id} ref={node => { if (node) jobsRef.current.set(job.id, node); else jobsRef.current.delete(job.id); }} className={`workforce-lane ${changed.includes(job.id) ? 'workforce-lane-changed' : ''}`} data-tone={job.tone} data-verified={job.status === 'Verified'} aria-pressed={safeSelection?.job === job.id} onClick={() => inspect({ type: 'job', job: job.id })} aria-label={`${job.id}. ${job.title}. ${job.status}. ${job.health}. Inspect work.`}>
            <span className="workforce-job-mark" aria-hidden="true"><hbr-icon name={job.icon} size="20px"/></span>
            <span className="workforce-lane-copy"><span className="workforce-lane-heading"><strong>{job.title}</strong><Tag tone={job.tone}>{job.status}</Tag></span>{job.id !== 'J23' && <span className="workforce-lane-headline">{job.headline}</span>}<span className="workforce-agent-line"><span>{job.agent} <span className="workforce-version">{job.version}</span></span><span className="workforce-health" data-tone={job.healthTone}><hbr-icon name={statusIcon(job.healthTone)} size="12px"/>{job.health}</span></span>{job.id === 'J21' && <Checkpoints job={job}/>} {job.eligibility && <span className="workforce-eligibility"><hbr-icon name="status-warning" size="12px"/>{job.eligibility}</span>}</span>
            <hbr-icon class="workforce-lane-arrow" name="arrow-right" size="16px" aria-hidden="true"/>
          </button>)}
        </div>
        {safeSelection && <Inspection selection={safeSelection} model={model} onSelect={inspect} onClose={close} detailRef={detailRef}/>}
        </hbr-layout>
        </hbr-card>
        </hbr-layout>
      </section>
      <aside className="workforce-attention" data-has-decisions={model.decisions.length > 0} aria-label="Supervisory attention">
        <hbr-layout variant="dashboard:widgets:container">
        <hbr-card container col="full" class="workforce-container">
        <hbr-text slot="header" variant="section-title"><h2>Attention</h2></hbr-text>
        <hbr-layout direction="column" gap="lg">
        {model.decisions.length ? <><hbr-text type="secondary" size="sm">Your decision</hbr-text><hbr-layout direction="column" gap="md" class="workforce-decisions">{model.decisions.map(decision => <hbr-card key={decision.id} class="workforce-decision">
          <hbr-layout slot="header" direction="row" gap="sm" align="start" class="workforce-decision-heading"><hbr-icon name="status-warning" sentiment="warning" size="18px"/><hbr-text variant="sub-section-title"><h3>{decision.title}</h3></hbr-text></hbr-layout>
          <hbr-text type="secondary" size="sm">{decision.reason}</hbr-text>
          <hbr-button slot="footer" size="small" variant="text" onClick={() => inspect({ type: decision.id, job: decision.job })}>{decision.action}<hbr-icon slot="suffix" name="arrow-right"/></hbr-button>
        </hbr-card>)}</hbr-layout></> : <hbr-layout direction="row" gap="sm" align="center" class="workforce-decisions-current"><hbr-icon name="check-circle" size="18px"/><hbr-text size="sm">No decision waiting</hbr-text></hbr-layout>}
        {model.decisions.length > 0 && <hbr-layout direction="column" gap="xs" class="workforce-governor-note"><hbr-text type="secondary" size="sm">Being handled</hbr-text><hbr-text type="secondary" size="sm">{model.handling}</hbr-text></hbr-layout>}
        </hbr-layout>
        </hbr-card>
        </hbr-layout>
      </aside>
    </hbr-layout>
    <section className="workforce-actions" aria-label="Consequential actions" data-updated={changed.length > 0}>
      <hbr-layout variant="dashboard:widgets:container">
      <hbr-card container col="full" class="workforce-container">
      <hbr-layout slot="header" direction="row" gap="md" align="center" justify="space-between" class="workforce-section-heading"><hbr-text variant="section-title"><h2>Actions</h2></hbr-text><hbr-text type="secondary" size="sm">Consequential changes</hbr-text></hbr-layout>
      {model.actions.length ? <hbr-layout key="action-records" display="grid" gap="md" class="workforce-action-grid">{model.actions.map(action => <hbr-card key={action.id} class="workforce-action" selectable role="button" selected={safeSelection?.type === 'action' && safeSelection.id === action.id} aria-pressed={safeSelection?.type === 'action' && safeSelection.id === action.id} aria-label={`${action.job}. ${action.title}. Inspect record.`} data-tone={action.tone} onClick={() => inspect({ type: 'action', id: action.id, job: action.job })}>
        <hbr-layout direction="row" gap="md" align="start" class="workforce-action-content"><span className="workforce-action-symbol"><hbr-icon name={action.icon} size="20px"/></span><hbr-layout direction="column" gap="sm" class="workforce-action-copy"><hbr-text type="secondary" size="sm">{action.job} · {action.label}</hbr-text><hbr-text size="sm" weight="semibold">{action.title}</hbr-text><span className="workforce-action-link">Inspect record<hbr-icon name="arrow-right" size="12px"/></span></hbr-layout></hbr-layout>
      </hbr-card>)}</hbr-layout> : <hbr-layout key="no-action-records" direction="row" gap="md" align="center" class="workforce-actions-empty"><hbr-icon name="nav-workflows" size="22px"/><hbr-layout direction="column" gap="xs"><hbr-text size="sm">No controller change issued</hbr-text><hbr-text type="secondary" size="sm">Confirmed execution, effective controls, and verified results appear here.</hbr-text></hbr-layout></hbr-layout>}
      </hbr-card>
      </hbr-layout>
    </section>
    <div className="workforce-trust"><hbr-icon name="check-circle" size="16px"/><p>{model.trust}</p><hbr-button variant="text" size="small" onClick={() => inspect({ type: 'trust', job: 'J21' })}>Inspect trace<hbr-icon name="arrow-right" slot="suffix"/></hbr-button></div>
    <span className="workforce-sr" role="status" aria-live="polite">{model.title} {model.subtitle}{safeSelection ? ` Selected ${safeSelection.job}.` : ''}</span>
  </hbr-layout>;
}
