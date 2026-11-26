import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgentEscalation, getCombinedSnapshot } from './combined-model.js';
import NetworkRibbon from './NetworkRibbon.jsx';
import CombinedActivity from './CombinedActivity.jsx';
import { getRibbonNetwork, getWorkNetworkScope, relatedWorkIds } from './ribbon-model.js';
import './combined-dashboard.css';
import './combined-ribbon-work.css';
import './combined-workspace.css';

const ROUTE_JOB = 'ROUTE-104';
const valueOf = event => event.currentTarget?.value ?? event.target?.value ?? '';
const focusControl = node => {
  if (!node?.isConnected) return false;
  if (typeof node.setFocus === 'function') node.setFocus();
  else (node.shadowRoot?.querySelector('.card[part="base"], button, input, textarea') || node).focus({ preventScroll: true });
  return true;
};

function Region({ id, title, subtitle, children, regionRef }) {
  return <section ref={regionRef} className="combined-work-section" aria-labelledby={`${id}-title`}>
    <div className="combined-section-heading">
      <hbr-text variant="section-title"><h2 id={`${id}-title`} tabIndex={-1}>{title}</h2></hbr-text>
      {subtitle && <hbr-text type="secondary" size="sm">{subtitle}</hbr-text>}
    </div>
    {children}
  </section>;
}

function Fields({ entries }) {
  return <dl className="combined-key-values">{entries.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
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

function Inspection({ selection, model, onClose, onReview, onAuthorize, onHold, onRevision, reviewedVersion, onRefresh, detailRef, revisionNote, onLocate, agentDecision, onAgentDecision }) {
  if (selection.kind === 'escalation') return <EscalationInspection model={model} detailRef={detailRef} onClose={onClose} agentDecision={agentDecision} onAgentDecision={onAgentDecision}/>;
  return <WorkInspection selection={selection} model={model} onClose={onClose} onReview={onReview} onAuthorize={onAuthorize} onHold={onHold} onRevision={onRevision} reviewedVersion={reviewedVersion} onRefresh={onRefresh} detailRef={detailRef} revisionNote={revisionNote} onLocate={onLocate}/>;
}

/** Simulated governance review. Its controls never change a real agent's eligibility. */
function EscalationInspection({ model, detailRef, onClose, agentDecision, onAgentDecision }) {
  const escalation = getAgentEscalation();
  const resultRef = useRef(null), pendingFocus = useRef(false);
  const state = agentDecision.state;
  const canDecide = model.sourceState === 'current' && state === 'pending';
  useEffect(() => {
    if (pendingFocus.current && resultRef.current) { pendingFocus.current = false; resultRef.current.focus({ preventScroll: true }); }
  }, [state]);
  const decide = choice => { if (!canDecide) return; pendingFocus.current = true; onAgentDecision(choice); };
  const result = state === 'submitted' ? ['Decision submitted', 'Waiting for the governor to confirm. No change to T1 eligibility is in effect yet.']
    : state === 'restricted' ? ['Restriction effective', 'T1 receives no new collection assignments. REACH-319 stays with T1 and is not cancelled or reassigned.']
    : state === 'retained' ? ['Current eligibility retained', 'No restriction is in effect. Crosswork AI continues recovery.'] : null;
  return <div ref={detailRef} className="combined-inspection" data-enter="true" role="region" aria-label="Agent escalation">
    <div className="combined-inspection-heading">
      <div><hbr-text type="secondary" size="xs">{escalation.agent} · Governance decision</hbr-text><hbr-text variant="sub-section-title"><h3 tabIndex={-1}>T1 collection escalation</h3></hbr-text></div>
      <hbr-button variant="text" size="small" onClick={onClose} arialabel="Close inspection"><hbr-icon name="x"/></hbr-button>
    </div>
    <p className="combined-inspection-intro">{escalation.intro}</p>
    <Fields entries={[["Agent", escalation.agent], ["Capability", escalation.capability], ["Affected work", escalation.affectedWork], ["Authority", escalation.authority]]}/>
    <div className="combined-detail-block"><h4>Recovery already attempted</h4><ul className="combined-evidence-list combined-attempts">{escalation.attempts.map(item => <li key={item.time}><hbr-icon name="status-warning" size="14px"/><span>{item.text} · {item.time}</span></li>)}</ul></div>
    <div className="combined-detail-grid">
      <div className="combined-detail-block"><h4>If you restrict new assignments</h4><p>{escalation.restrict}</p></div>
      <div className="combined-detail-block"><h4>If you keep current eligibility</h4><p>{escalation.retain}</p></div>
    </div>
    <p className="combined-inspection-intro">{escalation.reassign} {escalation.ownership}</p>
    {result && <div className="combined-notice" role="status"><hbr-icon name={state === 'submitted' ? 'nav-workflows' : 'check-circle'}/><div><strong ref={resultRef} tabIndex={-1}>{result[0]}</strong><p>{result[1]}</p></div></div>}
    <div className="combined-controls">
      <hbr-button size="small" disabled={!canDecide} onClick={() => decide('restricted')}>{state === 'restricted' ? 'Restriction effective' : 'Restrict new assignments'}</hbr-button>
      <hbr-button size="small" variant="text" disabled={!canDecide} onClick={() => decide('retained')}>Keep current eligibility</hbr-button>
    </div>
  </div>;
}

function WorkInspection({ selection, model, onClose, onReview, onAuthorize, onHold, onRevision, reviewedVersion, onRefresh, detailRef, revisionNote, onLocate }) {
  const job = model.jobs.find(item => item.id === selection.job);
  const incident = model.incidents?.find(item => item.job === selection.job);
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
      <hbr-button variant="text" size="small" onClick={onClose} arialabel="Close inspection"><hbr-icon name="x"/></hbr-button>
    </div>
    <p className="combined-inspection-intro">{intro}</p>
    {onLocate && <div className="combined-locate"><hbr-button variant="text" size="small" onClick={onLocate}><hbr-icon name="nav-network-wide" slot="prefix"/>Locate scope</hbr-button></div>}
    {action ? <Fields entries={[["Actor", action.actor], ["Agent", job.agent], ["Authority", action.authority], ["Scope", action.scope], ["Record establishes", action.label], ["Work", job.title]]}/> : isPlan ? <>
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
      {incident && <div className="combined-detail-block"><h4>{incident.id} · {incident.title}</h4><Fields entries={[["Incident state", incident.current ? incident.stage : `Last known · ${incident.stage}`], ["Classification", incident.classification], ["Classification evidence", incident.evidence], ["Source", incident.source], ["Resolution", incident.resolution]]}/></div>}
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
  const [agentDecision, setAgentDecision] = useState({ state: 'pending', scene: null });
  const model = useMemo(() => getCombinedSnapshot(scene, variant, { proposalVersion, agentDecision }), [scene, variant, proposalVersion, agentDecision]);
  const network = useMemo(() => getRibbonNetwork(model), [model]);
  const [selection, setSelection] = useState(null), [changed, setChanged] = useState([]), [announcement, setAnnouncement] = useState('');
  const [networkSelection, setNetworkSelection] = useState(null), [workFilter, setWorkFilter] = useState(null), [newAttention, setNewAttention] = useState(false);
  const [reviewedVersion, setReviewedVersion] = useState(null), [visibleActionIds, setVisibleActionIds] = useState(() => model.actions.map(item => item.id));
  const previous = useRef(model), trigger = useRef(null), detailRef = useRef(null), jobControls = useRef(new Map());
  const ribbonRef = useRef(null), attentionRef = useRef(null), attentionVisible = useRef(true);
  const lastSelection = useRef(selection);
  lastSelection.current = selection;

  // The governance thread belongs to the main story; leaving it or returning before the escalation resets it.
  useEffect(() => {
    if (variant !== 'main' || model.scene < 2) setAgentDecision(current => current.state === 'pending' ? current : { state: 'pending', scene: null });
  }, [variant, model.scene]);
  useEffect(() => {
    if (agentDecision.state !== 'submitted') return undefined;
    const timer = setTimeout(() => setAgentDecision(current => current.state === 'submitted' ? { ...current, state: current.choice } : current), 1400);
    return () => clearTimeout(timer);
  }, [agentDecision]);
  const decideAgent = choice => setAgentDecision({ state: 'submitted', choice, scene: model.scene });

  useEffect(() => {
    if (!attentionRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      attentionVisible.current = entry.isIntersecting;
      if (entry.isIntersecting) setNewAttention(false);
    }, { threshold: 0.05 });
    observer.observe(attentionRef.current.querySelector('h2') || attentionRef.current);
    return () => observer.disconnect();
  }, []);

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
    const attentionArrived = model.decisions.some(decision => decision.state !== 'submitted' && !before.decisions.some(old => old.id === decision.id && (old.reason === decision.reason || old.state === 'submitted')));
    if (currentJob && updates.includes(currentJob.id)) setAnnouncement(`${currentJob.title}. ${currentJob.status}. ${currentJob.checkpoint}`);
    else if (attentionArrived) setAnnouncement('New attention is available.');
    if (attentionArrived && !attentionVisible.current) setNewAttention(true);
    if (!model.decisions.length) setNewAttention(false);
    if (!selected || selected.kind !== 'action') setVisibleActionIds(model.actions.map(item => item.id));
    else setVisibleActionIds(ids => ids.filter(id => model.actions.some(item => item.id === id)));
    const timer = setTimeout(() => setChanged([]), 260);
    return () => clearTimeout(timer);
  }, [model]);

  const safeSelection = selection?.kind === 'action' && !model.actions.some(item => item.id === selection.id) ? { kind: 'job', job: selection.job, region: 'activity' } : selection;
  const inspect = (next, event) => {
    if (event?.currentTarget) trigger.current = event.currentTarget;
    setSelection(next);
    setNetworkSelection(null);
    if (next.kind === 'plan' && variant !== 'changed') setReviewedVersion(model.proposal.version);
    requestAnimationFrame(() => {
      if (next.kind === 'plan') detailRef.current?.querySelector('h3')?.focus({ preventScroll: true });
      detailRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  };
  const locateScope = () => {
    const scope = getWorkNetworkScope(safeSelection?.job);
    if (scope.domainIds.length) setNetworkSelection({ kind: 'domain', id: scope.domainIds[0] });
    ribbonRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    focusControl(ribbonRef.current?.querySelector('.combined-ribbon-focus'));
  };
  const close = () => {
    setSelection(null);
    setVisibleActionIds(model.actions.map(item => item.id));
    requestAnimationFrame(() => { if (!focusControl(trigger.current) && !focusControl(jobControls.current.get(safeSelection?.job))) attentionRef.current?.querySelector('h2')?.focus({ preventScroll: true }); });
  };
  const openPlan = event => inspect({ kind: 'plan', job: ROUTE_JOB, region: 'attention' }, event);
  const inspection = location => safeSelection && safeSelection.region === location ? <Inspection key={`${safeSelection.kind}-${safeSelection.id || safeSelection.job}`} selection={safeSelection} model={model} detailRef={detailRef} onClose={close} onReview={event => variant === 'held' ? onRecheck() : openPlan(event)} onAuthorize={onAuthorize} onHold={onHold} onRevision={onRevision} reviewedVersion={reviewedVersion} onRefresh={() => setReviewedVersion(model.proposal.version)} revisionNote={revisionNote} agentDecision={agentDecision} onAgentDecision={decideAgent} onLocate={getWorkNetworkScope(safeSelection.job).domainIds.length ? locateScope : null}/> : null;
  const matchingJobs = new Set(relatedWorkIds(model.jobs, networkSelection));
  const filteredJobIds = new Set(workFilter ? relatedWorkIds(model.jobs, workFilter) : model.jobs.map(job => job.id));
  const pendingActions = model.actions.filter(item => !visibleActionIds.includes(item.id) && filteredJobIds.has(item.job));
  const visibleJobs = model.jobs.filter(job => filteredJobIds.has(job.id) || safeSelection?.region === 'activity' && safeSelection.job === job.id);
  const activeActions = model.actions.filter(item => visibleActionIds.includes(item.id) && (filteredJobIds.has(item.job) || safeSelection?.kind === 'action' && safeSelection.id === item.id));
  const hasOpenPlan = safeSelection?.kind === 'plan';
  const retainDecision = hasOpenPlan && !model.decisions.some(item => item.job === ROUTE_JOB);
  const retainEscalation = safeSelection?.kind === 'escalation' && !model.decisions.some(item => item.kind === 'escalation');
  const openDecision = (decision, event) => decision.kind === 'escalation' ? inspect({ kind: 'escalation', job: decision.job, region: 'attention' }, event)
    : decision.id.startsWith('review-') ? openPlan(event) : inspect({ kind: 'job', job: decision.job, region: 'attention' }, event);
  const decisionExpanded = decision => safeSelection?.region === 'attention' && (decision.kind === 'escalation' ? safeSelection.kind === 'escalation' : safeSelection.kind !== 'escalation' && safeSelection.job === decision.job);
  const filterLabel = workFilter?.kind === 'domain' ? network.domains.find(domain => domain.id === workFilter.id)?.label || workFilter.id : workFilter?.kind === 'platform' ? 'Platform' : 'Cross-domain';
  const filterScope = scope => { setWorkFilter(scope); setAnnouncement(`Activity and Actions filtered to ${scope.kind === 'domain' ? scope.id : scope.kind}. Attention remains global.`); };
  const clearFilter = () => { setWorkFilter(null); setAnnouncement('All permitted work is shown.'); requestAnimationFrame(() => focusControl(ribbonRef.current?.querySelector('.combined-ribbon-focus'))); };
  const showAttention = () => { attentionRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); attentionRef.current?.querySelector('h2')?.focus({ preventScroll: true }); setNewAttention(false); };

  return <hbr-layout direction="column" gap="lg" class="combined-dashboard" data-combined-layout="ribbon" data-combined-arrangement="rows" data-combined-scene={model.scene} data-combined-variant={model.variant}>
    <h1 className="combined-sr">Crosswork AI operations</h1>
    {newAttention && <hbr-button class="combined-attention-nudge" size="small" variant="outline" onClick={showAttention}><hbr-icon name="status-warning" slot="prefix"/>New attention</hbr-button>}
    <div className="combined-workspace">
      <NetworkRibbon ref={ribbonRef} network={network} expanded alwaysExpanded selectedScope={networkSelection} workScope={safeSelection ? getWorkNetworkScope(safeSelection.job) : null} onSelectScope={setNetworkSelection} onFilterScope={filterScope} onClearSelection={() => setNetworkSelection(null)} onInspectIncident={(incident, event) => inspect({ kind: 'job', job: incident.job, region: 'activity' }, event)}/>
    {workFilter && <div className="combined-filter-scope"><div><strong>{filterLabel}</strong><span>Activity and Actions · Attention remains global</span></div><hbr-button size="small" variant="text" onClick={clearFilter}>Clear filter<hbr-icon name="x" slot="suffix"/></hbr-button></div>}
      <div className="combined-decision-row">
    <Region id="combined-attention" regionRef={attentionRef} title="Attention" subtitle={workFilter ? 'All permitted domains' : model.decisions.length > 1 ? 'Ordered by consequence' : null}>
      {model.decisions.length || retainDecision || retainEscalation ? <div className="combined-attention-grid">
        {model.decisions.map(decision => <hbr-card key={decision.id} class="combined-decision" data-decision-state={decision.state} data-network-match={networkSelection && matchingJobs.has(decision.job)}>
          <div className="combined-decision-heading"><hbr-icon name={decision.state === 'submitted' ? 'nav-workflows' : 'status-warning'} size="20px"/><div className="combined-decision-copy"><div className="combined-decision-title"><hbr-text variant="sub-section-title"><h3>{decision.title}</h3></hbr-text>{decision.authority && <hbr-tag size="small" sentiment={decision.authority === 'Governance' ? 'info' : 'warning'} class="combined-decision-authority">{decision.authority}</hbr-tag>}</div><p>{decision.reason}</p><hbr-text type="secondary" size="xs">{decision.scope}</hbr-text>{networkSelection && matchingJobs.has(decision.job) && <span className="combined-linked-label">Related to selected scope</span>}</div><hbr-button size="small" variant="outline" onClick={event => openDecision(decision, event)} aria-expanded={decisionExpanded(decision)}>{decision.action || 'Review plan'}<hbr-icon slot="suffix" name="arrow-right"/></hbr-button></div>
        </hbr-card>)}
        {retainDecision && <div className="combined-quiet"><hbr-icon name="check-circle" size="18px"/><span>{model.scene === 3 ? 'Decision submitted' : model.scene >= 4 ? `Version ${model.proposal.version} authorized` : model.variant === 'held' ? 'Plan held' : 'Response retained for review'}</span></div>}
        {retainEscalation && <div className="combined-quiet"><hbr-icon name="check-circle" size="18px"/><span>{agentDecision.state === 'retained' ? 'Current eligibility retained' : 'Restriction effective'}</span></div>}
      </div> : <div className="combined-quiet"><hbr-icon name="check-circle" size="18px"/><span>No decisions require your review.</span></div>}
      {model.handled.map(note => <p key={note} className="combined-handled"><hbr-icon name="nav-workflows" size="14px" aria-hidden="true"/><span><strong>Being handled</strong> · {note}</span></p>)}
      {inspection('attention')}
    </Region>
    <Region id="combined-actions" title="Actions">
      {pendingActions.length > 0 && <div className="combined-controls"><hbr-button size="small" variant="text" onClick={() => setVisibleActionIds(model.actions.map(item => item.id))}>New updates · {pendingActions.length}</hbr-button></div>}
      {activeActions.length ? <div key="confirmed-records" className="combined-actions-list">{activeActions.map(action => <Fragment key={action.id}>
        <hbr-card class="combined-action" selectable role="button" selected={safeSelection?.kind === 'action' && safeSelection.id === action.id} aria-pressed={safeSelection?.kind === 'action' && safeSelection.id === action.id} aria-label={`${action.title}. Inspect record.`} data-tone={action.tone} data-network-match={networkSelection && matchingJobs.has(action.job)} onClick={event => inspect({ kind: 'action', id: action.id, job: action.job, region: 'actions' }, event)}>
          <div className="combined-action-content"><span className="combined-action-symbol"><hbr-icon name={action.icon} size="18px"/></span><div className="combined-action-copy"><hbr-text size="sm" weight="semibold">{action.title}</hbr-text><hbr-text type="secondary" size="xs">{action.label} · {action.scope}</hbr-text>{networkSelection && matchingJobs.has(action.job) && <span className="combined-linked-label">Related to selected scope</span>}{!filteredJobIds.has(action.job) && <span className="combined-pinned-scope">Inspected record outside this filter</span>}</div><span className="combined-action-time">{action.time}</span><hbr-icon name="arrow-right" size="14px"/></div>
        </hbr-card>
        {safeSelection?.kind === 'action' && safeSelection.id === action.id && inspection('actions')}
      </Fragment>)}</div> : <div key="no-records" className="combined-empty"><hbr-icon name="nav-workflows" size="22px"/><div><strong>{workFilter ? `No confirmed records in ${filterLabel}` : 'No consequential actions recorded'}</strong><p>{workFilter ? 'Clear the filter to view other permitted records.' : 'Confirmed decisions, execution, and evidenced results appear here.'}</p></div></div>}
    </Region>
      </div>
      <CombinedActivity model={model} jobs={visibleJobs} selectedJobId={safeSelection?.job} inspectedKind={safeSelection?.kind}
        changedJobIds={changed} matchingJobIds={matchingJobs} filteredJobIds={filteredJobIds}
        onInspect={(job, event) => inspect({ kind: 'job', job: job.id, region: 'activity' }, event)}
        registerJobControl={(id, node) => { if (node) jobControls.current.set(id, node); else jobControls.current.delete(id); }}
        renderInspection={id => safeSelection?.region === 'activity' && safeSelection.job === id ? inspection('activity') : null}/>
    </div>
    <span className="combined-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </hbr-layout>;
}
