import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCombinedSnapshot } from './combined-model.js';
import './combined-dashboard.css';

const ROUTE_JOB = 'ROUTE-104';
const valueOf = event => event.currentTarget?.value ?? event.target?.value ?? '';
const toneOf = tone => ['positive', 'warning', 'negative', 'inactive', 'info'].includes(tone) ? tone : 'info';
const focusControl = node => {
  if (!node?.isConnected) return false;
  if (typeof node.setFocus === 'function') node.setFocus();
  else (node.shadowRoot?.querySelector('.card[part="base"]') || node).focus({ preventScroll: true });
  return true;
};

function Tag({ tone = 'info', children }) {
  return <hbr-tag size="small" sentiment={toneOf(tone)} status>{children}</hbr-tag>;
}

function Region({ id, title, subtitle, children }) {
  return <section aria-labelledby={`${id}-title`}>
    <hbr-layout variant="dashboard:widgets:container">
      <hbr-card container col="full">
        <hbr-layout slot="header" direction="row" gap="md" justify="space-between" align="center" class="combined-section-heading">
          <hbr-text variant="section-title"><h2 id={`${id}-title`}>{title}</h2></hbr-text>
          {subtitle && <hbr-text type="secondary" size="sm">{subtitle}</hbr-text>}
        </hbr-layout>
        {children}
      </hbr-card>
    </hbr-layout>
  </section>;
}

function Fields({ entries }) {
  return <dl className="combined-key-values">{entries.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Rail({ job }) {
  if (!job.steps?.length) return null;
  return <ol className="combined-rail" aria-label="Response checkpoints">{job.steps.map((label, index) => {
    const state = index < job.step ? 'complete' : index === job.step ? 'current' : 'future';
    return <li className="combined-stage" data-state={state} key={label} aria-current={state === 'current' ? 'step' : undefined}>
      <span aria-hidden="true">{state === 'complete' ? <hbr-icon name="check" size="10px"/> : null}</span>
      <span>{label}</span><span className="combined-sr">{state === 'complete' ? 'completed' : state === 'future' ? 'not reached' : 'current stage'}</span>
    </li>;
  })}</ol>;
}

function Comparison({ proposal }) {
  return <div className="combined-diff" aria-label="Configuration comparison">
    <div><hbr-text type="secondary" size="xs">Reviewed observation · v{proposal.version}</hbr-text><pre>{proposal.changeFrom}</pre></div>
    <div><hbr-text type="secondary" size="xs">Approved intent</hbr-text><pre>{proposal.changeTo}</pre></div>
  </div>;
}

function Criteria({ criteria }) {
  return <ul className="combined-criteria">{criteria.map(criterion => <li key={criterion.id} className="combined-criterion" data-state={criterion.state}>
    <span className="combined-criterion-mark" aria-hidden="true"><hbr-icon size="16px" name={criterion.state === 'met' ? 'check-circle' : criterion.state === 'failed' ? 'status-warning' : 'phosphor-circle'}/></span>
    <div><strong>{criterion.title}</strong><p>{criterion.detail}</p><hbr-text type="secondary" size="xs">{criterion.source}{criterion.time ? ` · ${criterion.time}` : ''}</hbr-text></div>
    <span className="combined-criterion-state">{({ met: 'Met', pending: 'Pending', unavailable: 'Unavailable', failed: 'Failed' })[criterion.state] || criterion.state}</span>
  </li>)}</ul>;
}

function Context() {
  const [selected, setSelected] = useState('device');
  const entities = [
    { id: 'config', title: 'WAN-IMPORT', type: 'Configuration', relation: 'XR-R07 → CONFIGURED_BY → WAN-IMPORT', detail: 'The routing policy assessed against the current approved intent.', icon: 'nav-configuration' },
    { id: 'device', title: 'XR-R07', type: 'Router', relation: 'Selected network device', detail: 'The router being assessed, with its related configuration, interface, and service.', icon: 'nav-network-wide' },
    { id: 'interface', title: 'HundredGigE0/0/0/1', type: 'Interface', relation: 'XR-R07 → HAS_INTERFACE → HundredGigE0/0/0/1', detail: 'A related interface. This relationship alone does not establish operational impact.', icon: 'nav-connect' },
    { id: 'service', title: 'Enterprise VPN', type: 'Service', relation: 'XR-R07 → RUNS_SERVICE → Enterprise VPN', detail: 'A related service. Service impact must be established by its own observations.', icon: 'nav-service-switcher' },
  ];
  const entity = entities.find(item => item.id === selected);
  return <div>
    <div className="combined-context" role="group" aria-label="Related network entities">
      {entities.map(item => <div className="combined-context-node" data-kind={item.id} key={item.id} data-selected={selected === item.id}>
        <hbr-button variant="outline" size="small" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><hbr-icon name={item.icon} slot="prefix"/>{item.type}</hbr-button>
        <span>{item.title}</span>
      </div>)}
    </div>
    <Fields entries={[[entity.relation, entity.detail]]}/>
    <hbr-text type="secondary" size="xs">Relationships provide context; they do not establish impact or cause.</hbr-text>
    <p className="combined-context-link"><Link to="/network-monitoring/admin">Open Knowledge graph in Admin →</Link></p>
  </div>;
}

function Inspection({ selection, model, onClose, onReview, onAuthorize, onHold, onRevision, reviewedVersion, onRefresh, detailRef, revisionNote }) {
  const job = model.jobs.find(item => item.id === selection.job);
  const action = selection.kind === 'action' ? model.actions.find(item => item.id === selection.id) : null;
  const [revising, setRevising] = useState(false), [draft, setDraft] = useState('');
  const decisionFocus = useRef(false), resultRef = useRef(null), reviewHeading = useRef(null), recheckFocus = useRef(false), revisionInput = useRef(null), revisionTrigger = useRef(null);
  const proposal = model.proposal;
  const isPlan = selection.kind === 'plan';
  const needsRefresh = model.variant === 'changed' && reviewedVersion !== proposal.version;
  const canDecide = model.sourceState === 'current' && model.scene === 2 && (proposal.reviewable || model.variant === 'changed' && !needsRefresh);
  const title = action?.title || (isPlan ? 'Configuration response' : job.title);
  const intro = action?.detail || (isPlan ? proposal.intent : job.detail);
  const decisionSubmitted = model.variant === 'main' && model.scene >= 3;
  useEffect(() => {
    if (decisionFocus.current && resultRef.current) { decisionFocus.current = false; resultRef.current.focus({ preventScroll: true }); }
    if (recheckFocus.current && model.variant === 'main') { recheckFocus.current = false; reviewHeading.current?.focus({ preventScroll: true }); }
  }, [model.scene, model.variant, reviewedVersion]);
  const decide = action => { decisionFocus.current = true; action(); };
  return <div ref={detailRef} className="combined-inspection" data-enter="true" role="region" aria-label={title}>
    <div className="combined-inspection-heading">
      <div><hbr-text type="secondary" size="xs">{action ? `${action.record} · ${action.time}` : isPlan ? `${proposal.id} · Version ${proposal.version}` : job.scope}</hbr-text><hbr-text variant="sub-section-title"><h3 ref={reviewHeading} tabIndex={-1}>{title}</h3></hbr-text></div>
      <hbr-button variant="text" size="small" onClick={onClose} aria-label="Close inspection"><hbr-icon name="x"/></hbr-button>
    </div>
    <p className="combined-inspection-intro">{intro}</p>
    {action ? <Fields entries={[["Actor", action.actor], ["Scope", action.scope], ["Record establishes", action.label], ["Work", job.title]]}/> : isPlan ? <>
      {['changed', 'held', 'revision'].includes(model.variant) && <div className="combined-notice" role="status"><hbr-icon name={model.variant === 'held' ? 'status-dormant' : model.variant === 'revision' ? 'nav-workflows' : 'status-warning'}/><div>
        <strong ref={resultRef} tabIndex={-1}>{model.variant === 'held' ? 'Plan held' : model.variant === 'revision' ? 'Revision requested' : needsRefresh ? 'Plan changed' : `Version ${proposal.version} reviewed`}</strong>
        <p>{model.variant === 'held' ? 'No corrective write has been issued. Crosswork AI retains the job.' : model.variant === 'revision' ? revisionNote || 'Crosswork AI is reassessing the proposal. A revised plan needs validation and review.' : proposal.changeSummary}</p>
        {model.variant === 'changed' && <hbr-button variant="text" size="small" disabled={!needsRefresh} onClick={() => { decisionFocus.current = true; onRefresh(); }}>Review updated plan</hbr-button>}
      </div></div>}
      <Fields entries={[["Exact scope", proposal.scope], ["Authority", proposal.authority], ["Validity", proposal.validity]]}/>
      {revisionNote && model.variant !== 'revision' && <Fields entries={[["Requested revision", revisionNote]]}/>}
      <Comparison proposal={proposal}/>
      <div className="combined-detail-grid">
        <div className="combined-detail-block"><h4>Validation</h4><ul className="combined-evidence-list">{proposal.validation.map((item, index) => <li key={index}><hbr-icon name="check" size="14px"/><span>{typeof item === 'string' ? item : item.detail || item.title}</span></li>)}</ul></div>
        <div className="combined-detail-block"><h4>Boundaries</h4><p>{proposal.boundary}</p><p>{proposal.recovery}</p><p>{proposal.holdConsequence}</p></div>
      </div>
      <div className="combined-detail-block"><h4>Success criteria</h4><Criteria criteria={model.criteria}/></div>
      {decisionSubmitted && <div className="combined-notice" role="status"><hbr-icon name={model.scene === 3 ? 'nav-workflows' : 'check-circle'}/><div><strong ref={resultRef} tabIndex={-1}>{model.scene === 3 ? 'Decision submitted' : `Version ${proposal.version} authorized`}</strong><p>{model.scene === 3 ? 'Waiting for effective authority. No operation has been issued.' : model.scene === 4 ? 'Current conditions are being rechecked before execution.' : 'Authority, execution, and outcome remain separately recorded.'}</p></div></div>}
      {revising ? <form className="combined-revision-form" onSubmit={event => { event.preventDefault(); if (canDecide && draft.trim()) { decide(() => onRevision(draft.trim())); setRevising(false); } }}>
        {!canDecide && <p role="status">This plan is no longer available for a decision. The revision draft is retained.</p>}
        <hbr-textarea ref={revisionInput} label="Requested revision" rows={3} resize="vertical" value={draft} onhbr-input={event => setDraft(valueOf(event))}/>
        <div className="combined-controls"><hbr-button size="small" type="submit" disabled={!canDecide || !draft.trim()}>Request revision</hbr-button><hbr-button size="small" variant="text" onClick={() => { setRevising(false); requestAnimationFrame(() => focusControl(revisionTrigger.current)); }}>Cancel</hbr-button></div>
      </form> : <div className="combined-controls">
        <hbr-button size="small" disabled={!canDecide} onClick={() => { if (canDecide) decide(onAuthorize); }}>{decisionSubmitted ? model.scene === 3 ? 'Decision submitted' : 'Plan authorized' : 'Authorize plan'}</hbr-button>
        <hbr-button ref={revisionTrigger} size="small" variant="outline" disabled={!canDecide} onClick={() => { if (canDecide) { setRevising(true); requestAnimationFrame(() => focusControl(revisionInput.current)); } }}>Request revision</hbr-button>
        <hbr-button size="small" variant="text" disabled={!canDecide} onClick={() => { if (canDecide) decide(onHold); }}>Hold plan</hbr-button>
        {model.variant === 'held' && <hbr-button size="small" variant="text" onClick={() => { recheckFocus.current = true; onReview(); }}>Recheck plan</hbr-button>}
      </div>}
    </> : <>
      <Fields entries={[["Current state", job.status], ["Scope", job.scope], ["Current checkpoint", job.checkpoint]]}/>
      {job.id === ROUTE_JOB && proposal.available && !['expected', 'evidence'].includes(model.variant) && <>
        {model.scene < 5 && <Comparison proposal={proposal}/>}
        {(model.scene >= 6 || model.variant === 'unknown') && <div className="combined-detail-block"><h4>Outcome evidence</h4><Criteria criteria={model.criteria}/></div>}
        {model.scene >= 2 && <div className="combined-controls"><hbr-button size="small" variant="outline" onClick={onReview}>{model.scene < 3 ? 'Review plan' : 'Inspect authorization'}</hbr-button></div>}
      </>}
      {job.id === ROUTE_JOB && model.scene >= 1 && <hbr-accordion label="Related entities" size="small"><Context/></hbr-accordion>}
      <hbr-accordion label="Agent and sources" size="small"><Fields entries={[["Accountable agent", job.agent], ["Capability health", job.health], ["Required source", job.source], ["Ownership", 'Crosswork AI retains this job and its follow-up.']]}/></hbr-accordion>
    </>}
  </div>;
}

export default function CombinedDashboard({ scene = 2, variant = 'main', proposalVersion = 1, revisionNote = '', onAuthorize, onHold, onRevision, onRecheck }) {
  const model = useMemo(() => getCombinedSnapshot(scene, variant, { proposalVersion }), [scene, variant, proposalVersion]);
  const [selection, setSelection] = useState(null), [changed, setChanged] = useState([]), [announcement, setAnnouncement] = useState('');
  const [reviewedVersion, setReviewedVersion] = useState(null), [visibleActionIds, setVisibleActionIds] = useState(() => model.actions.map(item => item.id));
  const previous = useRef(model), trigger = useRef(null), detailRef = useRef(null), jobControls = useRef(new Map());
  const lastSelection = useRef(selection);
  lastSelection.current = selection;

  useEffect(() => {
    const before = previous.current;
    previous.current = model;
    const updates = model.jobs.filter(job => {
      const old = before.jobs.find(item => item.id === job.id);
      return !old || old.status !== job.status || old.checkpoint !== job.checkpoint || old.title !== job.title;
    }).map(job => job.id);
    const recordsChanged = before.actions.map(item => item.id).join() !== model.actions.map(item => item.id).join();
    if (!updates.length && !recordsChanged && before.variant === model.variant && before.proposal.version === model.proposal.version) return;
    setChanged(updates);
    const selected = lastSelection.current;
    const currentJob = selected && model.jobs.find(job => job.id === selected.job);
    if (currentJob && updates.includes(currentJob.id)) setAnnouncement(`${currentJob.title}. ${currentJob.status}. ${currentJob.checkpoint}`);
    else if (model.decisions.some(decision => !before.decisions.some(old => old.id === decision.id && old.reason === decision.reason))) setAnnouncement('New attention is available.');
    if (!selected || selected.kind !== 'action') setVisibleActionIds(model.actions.map(item => item.id));
    else setVisibleActionIds(ids => ids.filter(id => model.actions.some(item => item.id === id)));
    const timer = setTimeout(() => setChanged([]), 260);
    return () => clearTimeout(timer);
  }, [model]);

  const safeSelection = selection?.kind === 'action' && !model.actions.some(item => item.id === selection.id) ? { kind: 'job', job: selection.job, region: 'activity' } : selection;
  const inspect = (next, event) => {
    if (event?.currentTarget) trigger.current = event.currentTarget;
    setSelection(next);
    if (next.kind === 'plan' && variant !== 'changed') setReviewedVersion(model.proposal.version);
    requestAnimationFrame(() => {
      if (next.kind === 'plan') detailRef.current?.querySelector('h3')?.focus({ preventScroll: true });
      detailRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  };
  const close = () => {
    setSelection(null);
    setVisibleActionIds(model.actions.map(item => item.id));
    requestAnimationFrame(() => { if (!focusControl(trigger.current)) focusControl(jobControls.current.get(safeSelection?.job)); });
  };
  const openPlan = event => inspect({ kind: 'plan', job: ROUTE_JOB, region: 'attention' }, event);
  const inspection = location => safeSelection && safeSelection.region === location ? <Inspection key={`${safeSelection.kind}-${safeSelection.id || safeSelection.job}`} selection={safeSelection} model={model} detailRef={detailRef} onClose={close} onReview={event => variant === 'held' ? onRecheck() : openPlan(event)} onAuthorize={onAuthorize} onHold={onHold} onRevision={onRevision} reviewedVersion={reviewedVersion} onRefresh={() => setReviewedVersion(model.proposal.version)} revisionNote={revisionNote}/> : null;
  const pendingActions = model.actions.filter(item => !visibleActionIds.includes(item.id));
  const activeActions = model.actions.filter(item => visibleActionIds.includes(item.id));
  const hasOpenPlan = safeSelection?.kind === 'plan';
  const retainDecision = hasOpenPlan && !model.decisions.some(item => item.job === ROUTE_JOB);

  return <hbr-layout direction="column" gap="lg" class="combined-dashboard" data-combined-scene={model.scene} data-combined-variant={model.variant}>
    <header className="combined-heading"><div className="combined-heading-copy"><hbr-text variant="page-title"><h1>Home</h1></hbr-text><hbr-text class="combined-heading-scope" type="secondary" size="sm">Production · All permitted domains</hbr-text></div><hbr-text type="secondary" size="xs">Times in UTC</hbr-text></header>
    <Region id="combined-attention" title="Attention">
      {model.decisions.length || retainDecision ? <div className="combined-attention-grid">
        {model.decisions.map(decision => <hbr-card key={decision.id} class="combined-decision">
          <div className="combined-decision-heading"><hbr-icon name="status-warning" size="20px"/><div className="combined-decision-copy"><hbr-text variant="sub-section-title"><h3>{decision.title}</h3></hbr-text><p>{decision.reason}</p><hbr-text type="secondary" size="xs">{decision.scope}</hbr-text></div><hbr-button size="small" variant="outline" onClick={event => decision.id.startsWith('review-') ? openPlan(event) : inspect({ kind: 'job', job: decision.job, region: 'attention' }, event)} aria-expanded={safeSelection?.region === 'attention' && safeSelection.job === decision.job}>{decision.action || 'Review plan'}<hbr-icon slot="suffix" name="arrow-right"/></hbr-button></div>
        </hbr-card>)}
        {retainDecision && <div className="combined-quiet"><hbr-icon name="check-circle" size="18px"/><span>{model.scene === 3 ? 'Decision submitted' : model.scene >= 4 ? `Version ${model.proposal.version} authorized` : model.variant === 'held' ? 'Plan held' : 'Response retained for review'}</span></div>}
      </div> : <div className="combined-quiet"><hbr-icon name="check-circle" size="18px"/><span>No decisions require your review.</span></div>}
      {inspection('attention')}
    </Region>
    <Region id="combined-activity" title="Activity" subtitle="Current work">
      <div className="combined-lanes">{model.jobs.map(job => <Fragment key={job.id}>
        <div className="combined-lane" data-tone={job.tone} data-selected={safeSelection?.job === job.id} data-changed={changed.includes(job.id)}>
          <span className="combined-job-symbol" aria-hidden="true"><hbr-icon name={job.icon} size="20px"/></span>
          <div className="combined-lane-main"><hbr-text size="sm" weight="semibold" class="combined-job-heading">{job.title}</hbr-text><span className="combined-job-scope">{job.scope}</span><p className="combined-checkpoint">{job.checkpoint}</p>{model.scene >= 2 && <Rail job={job}/>}</div>
          <div className="combined-lane-end"><Tag tone={job.tone}>{job.status}</Tag><hbr-button ref={node => { if (node) jobControls.current.set(job.id, node); else jobControls.current.delete(job.id); }} variant="text" size="small" aria-expanded={safeSelection?.kind === 'job' && safeSelection.job === job.id} onClick={event => inspect({ kind: 'job', job: job.id, region: 'activity' }, event)}>Inspect job<hbr-icon slot="suffix" name="arrow-right"/></hbr-button></div>
        </div>
        {safeSelection?.region === 'activity' && safeSelection.job === job.id && inspection('activity')}
      </Fragment>)}</div>
    </Region>
    <Region id="combined-actions" title="Actions" subtitle="Confirmed records">
      {pendingActions.length > 0 && <div className="combined-controls"><hbr-button size="small" variant="text" onClick={() => setVisibleActionIds(model.actions.map(item => item.id))}>New updates · {pendingActions.length}</hbr-button></div>}
      {activeActions.length ? <div key="confirmed-records" className="combined-actions-list">{activeActions.map(action => <Fragment key={action.id}>
        <hbr-card class="combined-action" selectable role="button" selected={safeSelection?.kind === 'action' && safeSelection.id === action.id} aria-pressed={safeSelection?.kind === 'action' && safeSelection.id === action.id} aria-label={`${action.title}. Inspect record.`} data-tone={action.tone} onClick={event => inspect({ kind: 'action', id: action.id, job: action.job, region: 'actions' }, event)}>
          <div className="combined-action-content"><span className="combined-action-symbol"><hbr-icon name={action.icon} size="18px"/></span><div className="combined-action-copy"><hbr-text size="sm" weight="semibold">{action.title}</hbr-text><hbr-text type="secondary" size="xs">{action.label} · {action.scope}</hbr-text></div><span className="combined-action-time">{action.time}</span><hbr-icon name="arrow-right" size="14px"/></div>
        </hbr-card>
        {safeSelection?.kind === 'action' && safeSelection.id === action.id && inspection('actions')}
      </Fragment>)}</div> : <div key="no-records" className="combined-empty"><hbr-icon name="nav-workflows" size="22px"/><div><strong>No consequential actions recorded</strong><p>Confirmed decisions, execution, and evidenced results appear here.</p></div></div>}
    </Region>
    <span className="combined-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </hbr-layout>;
}
