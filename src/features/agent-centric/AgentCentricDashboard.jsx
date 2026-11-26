import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AGENT_VARIANTS, getAgentCentricSnapshot, findExistingWork } from './agent-centric-model.js';
import { EXPLORATION_OPTIONS, explorationLabel } from '../explorations/options.js';
import Suggested, { StartJobPicker, AgentControls } from './AgentCapabilities.jsx';
import AgentWorkFeed from './AgentWorkFeed.jsx';
import AgentJobInspector from './AgentJobInspector.jsx';
import ScopedChangeReview from './ScopedChangeReview.jsx';
import JobsManager from './JobsManager.jsx';
import AgentDecisions from './AgentDecisions.jsx';
import IncidentSection from './IncidentSection.jsx';
import IncidentDrawer from './IncidentDrawer.jsx';
import useIncidentDock from './use-incident-dock.js';
import AgentExperienceOverview from './overview/AgentExperienceOverview.jsx';
import { getIncidentOverview } from './incident-overview-model.js';
import { EXPERIENCE_STATES, buildIncidentSnapshot, getIncidentThread } from './incident-thread-model.js';
import { parseJobsQuery, buildJobsPath, buildAgentHomePath, selectManagerJobs } from './jobs-navigation.js';
import { getTaskId } from './agent-job-tasks.js';
import { buildScaleSnapshot, getScopeStats, getScaleCapabilities, getScaleCapabilityReadiness as getCapabilityReadiness, scopeDomainId, summarizeJobs, getScopedSuggestions } from './agent-scale-model.js';
import './agent-centric-dashboard.css';
import './agent-clean-layout.css';

const ROUTE = 'ROUTE-104';
const CAPABILITIES = getScaleCapabilities();
const inputValue = event => String(event.currentTarget?.value ?? event.target?.value ?? event.detail?.value ?? '');
const focus = node => {
  if (!node?.isConnected) return;
  if (typeof node.setFocus === 'function') node.setFocus();
  else (node.shadowRoot?.querySelector('button') || node).focus({ preventScroll: true });
};
const normalizeScope = value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

function AgentMark({ agent, small = false }) {
  return <span className="agent-home-mark" data-small={small} aria-hidden="true"><hbr-icon name={agent?.icon || 'nav-workflows'} size={small ? '16px' : '22px'}/></span>;
}

function Preview({ visible, onVisible, experienceState, variant, onExperienceState, onVariant, onSwitch, dockWidth = 0 }) {
  const [overviewOpen, setOverviewOpen] = useState(false);
  const overviewTriggerRef = useRef(null);
  if (typeof document === 'undefined') return null;
  const option = EXPLORATION_OPTIONS.find(item => item.id === 'agent-centric');
  const index = EXPERIENCE_STATES.findIndex(item => item.id === experienceState);
  const scenarios = AGENT_VARIANTS.filter(item => ['main', 'offline', 'no-authority', 'quiet'].includes(item.id));
  const dockStyle = dockWidth > 0 ? { right: `${24 + dockWidth}px`, left: 'auto', transform: 'none', maxWidth: `calc(100vw - ${dockWidth + 184}px)` } : undefined;
  return <>{createPortal(visible ? <div className="wan-review-controller agent-home-preview" style={dockStyle} data-iteration-cue="04" data-preview-controls="true" aria-label="Preview controls. Viewing 04 · Agent-centric">
    <hbr-dropdown hoist menu placement="top-start" distance="12"><hbr-button slot="trigger" variant="outline" size="small" caret arialabel="Switch exploration">{option ? explorationLabel(option) : '04 · Agent-centric'}</hbr-button><hbr-menu onhbr-select={event => onSwitch?.(event.detail?.item?.value)}>
      {EXPLORATION_OPTIONS.filter(item => !item.archived).map(item => <hbr-menu-item key={item.id} value={item.id}>{explorationLabel(item)}</hbr-menu-item>)}
      <hbr-menu-divider/>{EXPLORATION_OPTIONS.filter(item => item.archived).map(item => <hbr-menu-item key={item.id} value={item.id}>{explorationLabel(item)}</hbr-menu-item>)}
    </hbr-menu></hbr-dropdown>
    <span className="wan-review-label">Simulated</span>
    <hbr-dropdown hoist menu placement="top-start" distance="12"><hbr-button slot="trigger" variant="text" size="small" caret arialabel="Choose dashboard state">{EXPERIENCE_STATES[index]?.label}</hbr-button><hbr-menu onhbr-select={event => onExperienceState(event.detail?.item?.value)}>{EXPERIENCE_STATES.map(item => <hbr-menu-item key={item.id} value={item.id}>{item.label}</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
    <hbr-dropdown hoist menu placement="top-start" distance="12"><hbr-button slot="trigger" variant="text" size="small" caret arialabel="Choose agent scenario">{AGENT_VARIANTS.find(item => item.id === variant)?.label}</hbr-button><hbr-menu onhbr-select={event => onVariant(event.detail?.item?.value)}>{scenarios.map(item => <hbr-menu-item key={item.id} value={item.id}>{item.label}</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
    <hbr-button ref={overviewTriggerRef} class="wan-overview-launch" size="small" variant="outline" onClick={() => setOverviewOpen(true)}>Experience overview</hbr-button>
    <div className="wan-review-transport workforce-preview-transport"><hbr-button variant="text" size="small" disabled={index <= 0} onClick={() => onExperienceState(EXPERIENCE_STATES[index - 1]?.id)} arialabel="Previous dashboard state">Prev</hbr-button><hbr-button variant="text" size="small" disabled={index === EXPERIENCE_STATES.length - 1} onClick={() => onExperienceState(EXPERIENCE_STATES[index + 1]?.id)} arialabel="Next dashboard state">Next</hbr-button><hbr-button variant="text" size="small" onClick={() => onVisible(false)}>Hide</hbr-button></div>
  </div> : <hbr-button className="wan-review-reopen agent-home-preview-reopen" style={dockStyle} size="small" variant="outline" onClick={() => onVisible(true)} arialabel="Open preview controls. Viewing 04 · Agent-centric">Preview · 04<span className="agent-preview-name"> · Agent-centric</span></hbr-button>, document.body)}
    {overviewOpen && <AgentExperienceOverview onClose={() => { setOverviewOpen(false); requestAnimationFrame(() => focus(overviewTriggerRef.current)); }}/>}</>;
}

function ProposalReview({ model, reviewedVersion, onRefresh, onAuthorize, onHold, onRevision, revisionNote }) {
  const [revising, setRevising] = useState(false), [note, setNote] = useState('');
  const resultRef = useRef(null), introRef = useRef(null), actionFocus = useRef(false), revisionInputRef = useRef(null), revisionTriggerRef = useRef(null);
  useEffect(() => { if (actionFocus.current) { actionFocus.current = false; (resultRef.current || introRef.current)?.focus(); } }, [model.scene, model.variant, reviewedVersion]);
  useEffect(() => { if (revising) revisionInputRef.current?.setFocus(); }, [revising]);
  const act = callback => { actionFocus.current = true; callback(); };
  const proposal = model.proposal;
  const changed = reviewedVersion !== proposal.version;
  const canDecide = model.sourceState === 'current' && model.permissions.reviewChange && model.scene === 2 && !['held', 'revision'].includes(model.variant) && (!changed) && proposal.available;
  const submitted = model.scene === 3 && model.variant === 'main';
  const result = submitted ? ['Decision submitted', 'Authority-service confirmation is pending. No controller operation has been issued.']
    : model.variant === 'held' ? ['Plan held', 'This correction has not been issued. Agents retain the technical work.']
    : model.variant === 'revision' ? ['Revision requested', `${revisionNote} A revised, revalidated proposal will require fresh review.`]
    : model.variant === 'changed' ? [changed ? 'Revised proposal ready' : `Version ${proposal.version} reviewed`, changed ? 'Review the new evidence and exact scope before deciding.' : 'This review applies to the current proposal version and scope.']
    : ['unknown', 'partial', 'capability', 'offline'].includes(model.variant) ? [model.sourceState === 'current' ? model.jobs.find(job => job.id === ROUTE)?.status : 'Current visibility interrupted', model.jobs.find(job => job.id === ROUTE)?.checkpoint]
    : model.scene >= 4 ? [model.scene === 7 ? 'Scoped outcome verified' : model.scene === 6 ? 'Operation completed; verification pending' : model.scene === 5 ? 'Controller acknowledged execution' : 'Authorization effective', model.jobs.find(job => job.id === ROUTE)?.checkpoint]
    : null;
  return <div className="agent-home-review">
    <div className="agent-home-owner"><AgentMark agent={model.agents.remediation}/><div><strong>Remediation agent</strong><span>{proposal.id} · Version {proposal.version}</span></div><hbr-tag sentiment="info" size="small">Change</hbr-tag></div>
    <p className="agent-home-panel-intro" ref={introRef} tabIndex={-1}>{proposal.intent}</p>
    {model.sourceState !== 'current' && <div className="agent-home-notice" role="status"><hbr-icon name="status-warning"/><span>Last-confirmed proposal. Current authority and source visibility must be established before a decision.</span></div>}
    {changed && model.scene === 2 && <div className="agent-home-notice"><hbr-icon name="status-warning"/><div><strong>Proposal changed</strong><p>{proposal.changeSummary || 'Review the current version and its evidence before deciding.'}</p><hbr-button variant="text" size="small" onClick={() => act(onRefresh)}>Review updated change</hbr-button></div></div>}
    <dl className="agent-home-fields"><div><dt>Scope</dt><dd>{proposal.scope}</dd></div><div><dt>Authority</dt><dd>{proposal.authority}</dd></div><div><dt>Change limit</dt><dd>{proposal.boundary}</dd></div></dl>
    {proposal.available && <div className="agent-home-diff" aria-label={`Proposal version ${proposal.version} configuration comparison`}><div><span>Reviewed observation</span><pre>{proposal.changeFrom}</pre></div><div><span>Approved intent</span><pre>{proposal.changeTo}</pre></div></div>}
    <div className="agent-home-evidence"><h3>Validation</h3><ul>{proposal.validation.map((text, index) => <li key={index}><hbr-icon name={model.variant === 'evidence' ? 'clock' : 'check'} size="14px"/><span>{text}</span></li>)}</ul></div>
    <details className="agent-home-details"><summary>Verification and decision limits</summary><p>{proposal.validity}</p><ul>{model.criteria.map(item => <li key={item.id}>{item.title} · {item.state === 'met' ? 'Confirmed' : item.state === 'unavailable' ? 'Unavailable' : 'Pending'}</li>)}</ul><p>{proposal.holdConsequence}</p></details>
    {result && <div className="agent-home-notice" role="status" ref={resultRef} tabIndex={-1}><hbr-icon name={submitted ? 'clock' : 'nav-workflows'}/><div><strong>{result[0]}</strong><p>{result[1]}</p></div></div>}
    {revising && canDecide && <div className="agent-home-revision"><hbr-textarea ref={revisionInputRef} label="What should change?" rows="3" value={note} onhbr-input={event => setNote(inputValue(event))}/><div><hbr-button size="small" disabled={!note.trim()} onClick={() => { act(() => onRevision(note.trim())); setRevising(false); }}>Send revision request</hbr-button><hbr-button variant="text" size="small" onClick={() => { setRevising(false); requestAnimationFrame(() => focus(revisionTriggerRef.current)); }}>Cancel revision</hbr-button></div></div>}
    {model.scene === 2 && !['held', 'revision', 'no-authority'].includes(model.variant) && <div className="agent-home-review-actions"><hbr-button disabled={!canDecide} onClick={() => act(onAuthorize)}>Authorize version {proposal.version}</hbr-button><hbr-button variant="outline" disabled={!canDecide} onClick={() => act(onHold)}>Hold change</hbr-button><hbr-button ref={revisionTriggerRef} variant="text" disabled={!canDecide} onClick={() => setRevising(value => !value)}>Request revision</hbr-button></div>}
  </div>;
}

export default function AgentCentricDashboard({ onSwitchExploration, active = true, page = 'home', routeSearch = '', onNavigate }) {
  const managerQuery = useMemo(() => parseJobsQuery(routeSearch), [routeSearch]);
  const [scene, setScene] = useState(2), [variant, setVariant] = useState('main'), [version, setVersion] = useState(1), [playing, setPlaying] = useState(false);
  const [experienceState, setExperienceState] = useState(() => {
    const requested = new URLSearchParams(routeSearch).get('experience');
    return EXPERIENCE_STATES.some(item => item.id === requested) ? requested : 'review';
  });
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [incidentQueueIds, setIncidentQueueIds] = useState([]);
  const [incidentDrawerWidth, setIncidentDrawerWidth] = useState(null);
  const [incidentDockWidth, setIncidentDockWidth] = useState(480);
  const dashboardRef = useRef(null);
  const [incidentReviewRequest, setIncidentReviewRequest] = useState(null);
  const incidentTriggerRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false), [agentFilter, setAgentFilter] = useState(() => managerQuery.agentId), [domainFilter, setDomainFilter] = useState(() => managerQuery.domainId), [selectedIssue, setSelectedIssue] = useState(null);
  const [selection, setSelection] = useState(null), [scope, setScope] = useState(''), [reviewedVersion, setReviewedVersion] = useState(null), [revisionNote, setRevisionNote] = useState('');
  const [eligibility, setEligibility] = useState({}), [controlState, setControlState] = useState({}), [extraJobs, setExtraJobs] = useState([]), [dismissed, setDismissed] = useState([]);
  const [changeDecisions, setChangeDecisions] = useState({});
  const [pickerAllAgents, setPickerAllAgents] = useState(false);
  const triggerRef = useRef(null), questionRef = useRef(null), requestId = useRef(0), drawerRef = useRef(null), controlStatusRef = useRef(null), controlFocusRef = useRef(false);
  const startRef = useRef(null), previousPageRef = useRef(page), openedRouteJobRef = useRef(null);
  const homeContextRef = useRef({ domainId: managerQuery.domainId, agentId: managerQuery.agentId, scrollTop: 0, focusId: 'agent-home-next-title' });
  const currentDomain = page === 'jobs' ? managerQuery.domainId : domainFilter;
  const currentAgent = page === 'jobs' ? managerQuery.agentId : agentFilter;
  const model = useMemo(() => {
    const snapshot = buildIncidentSnapshot(buildScaleSnapshot(getAgentCentricSnapshot(scene, variant, { proposalVersion: version, agentEligibility: eligibility }), { agentEligibility: eligibility }), experienceState);
    snapshot.jobs = snapshot.jobs.map(job => {
      const decision = changeDecisions[job.id];
      if (!decision) return job;
      const checkpoint = decision.state === 'submitted' ? 'Approval submitted; confirmation is pending.' : decision.state === 'held' ? 'Change held. The agent retains this job.' : 'Approval confirmed. The agent is checking prerequisites before execution.';
      return { ...job, canReview: false, status: decision.state === 'submitted' ? 'Decision submitted' : decision.state === 'held' ? 'Held' : 'Checking', tone: decision.state === 'held' ? 'inactive' : 'info', checkpoint, finding: checkpoint, landingFinding: checkpoint, nextStep: decision.state === 'submitted' ? 'Wait for the decision confirmation before checking execution prerequisites.' : decision.state === 'held' ? 'Keep the change unissued until a new decision is recorded.' : 'Revalidate the reviewed scope and prerequisites. Execution and verification remain unconfirmed.' };
    });
    snapshot.decisions = snapshot.decisions.filter(item => !changeDecisions[item.jobId || item.job]);
    snapshot.assignedDecisions = snapshot.assignedDecisions.filter(item => !changeDecisions[item.jobId || item.job]);
    for (const [jobId, decision] of Object.entries(changeDecisions)) {
      const job = snapshot.jobs.find(item => item.id === jobId);
      if (!job || decision.state === 'submitted') continue;
      snapshot.actions.push({ id: `${jobId}-${decision.state}-v${decision.version}`, job: jobId, issueId: job.issueId, agentId: job.agentId, agent: job.agent, agentVersion: job.agentVersion, actor: 'Delegated operator', scope: job.scope, authority: job.proposal.authority, title: decision.state === 'held' ? 'Change held' : 'Approval confirmed', detail: decision.state === 'held' ? 'The change remains unissued. The agent retains this job.' : 'Approval confirmed for this proposal version and target. Execution and verification remain unconfirmed.', record: `${job.proposal.id} · Version ${decision.version} decision record` });
    }
    snapshot.issues = snapshot.issues.map(issue => {
      const members = snapshot.jobs.filter(item => item.issueId === issue.id);
      const job = members.find(item => summarizeJobs([item]).completed === 0) || members[0];
      return job ? { ...issue, state: job.status, summary: job.checkpoint } : issue;
    });
    const requests = extraJobs.filter(job => (job.fixtureId || 'fleet') === (variant === 'quiet' ? 'quiet' : 'fleet')).map(job => {
      const state = getCapabilityReadiness(job.capabilityId, snapshot, job.scope);
      return job.status === 'Request submitted' && !state.canStart ? { ...job, checkpoint: `Request remains unacknowledged. ${state.reason}` } : job;
    });
    const jobs = [...snapshot.jobs, ...requests];
    return { ...snapshot, jobs, scaleSummary: { ...summarizeJobs(jobs), decisions: snapshot.decisions.length, issues: snapshot.issues.length + requests.length }, issues: [...snapshot.issues, ...requests.map(job => ({ id: job.issueId, jobId: job.id, domainId: job.domainId, agentId: job.agentId, title: job.title, scope: job.scope, state: job.status, summary: job.checkpoint }))] };
  }, [scene, variant, version, eligibility, extraJobs, changeDecisions, experienceState]);
  const selectedWork = model.jobs.find(job => job.issueId === selectedIssue);
  const capabilities = CAPABILITIES.filter(item => currentDomain === 'all' || item.id !== 'verify' || scopeDomainId(item.defaultScope) === currentDomain).map(item => {
    const contextual = selectedWork?.capabilityId === item.id && item.scopeOptions.includes(selectedWork.scope);
    const domain = model.network.domains.find(value => value.id === currentDomain);
    const targetScope = contextual && (currentDomain === 'all' || selectedWork.domainId === currentDomain) ? selectedWork.scope : domain && item.id !== 'verify' ? `${domain.name} · all devices` : item.defaultScope;
    const relatedIssueId = contextual && selectedWork.scope === targetScope ? selectedIssue : targetScope === item.defaultScope ? item.issueId : null;
    return { ...item, scope: targetScope, defaultScope: targetScope, issueId: relatedIssueId, readiness: getCapabilityReadiness(item.id, model, targetScope), existingJobId: findExistingWork(item.id, targetScope, model)?.id || model.jobs.find(job => job.capabilityId === item.id && normalizeScope(job.scope) === normalizeScope(targetScope))?.id };
  });
  const selectedJob = selection?.jobId ? model.jobs.find(job => job.id === selection.jobId) : null;
  const capability = CAPABILITIES.find(item => item.id === selection?.capabilityId);
  const readiness = capability ? getCapabilityReadiness(capability.id, model, scope) : null;
  const existingJob = capability && (findExistingWork(capability.id, scope, model) || model.jobs.find(job => job.capabilityId === capability.id && normalizeScope(job.scope) === normalizeScope(scope)));
  const filteredJobs = model.jobs.filter(job => (agentFilter === 'all' || job.agentId === agentFilter) && (domainFilter === 'all' || job.domainId === domainFilter));
  const incidentIdsInScope = getIncidentOverview(model, { domainId: domainFilter, agentId: agentFilter }).map(incident => incident.id);
  const incidentIds = [...incidentQueueIds.filter(id => incidentIdsInScope.includes(id)), ...incidentIdsInScope.filter(id => !incidentQueueIds.includes(id))];
  const inspectingIncident = Boolean(selectedIncidentId && incidentIdsInScope.includes(selectedIncidentId));
  useIncidentDock(dashboardRef, { active, open: page === 'home' && inspectingIncident, width: incidentDockWidth });
  const decisions = model.decisions.filter(item => (agentFilter === 'all' || item.agentId === agentFilter) && (domainFilter === 'all' || (item.domainId || model.jobs.find(job => job.id === (item.jobId || item.job))?.domainId) === domainFilter));
  const hiddenDecisions = model.decisions.length - decisions.length;
  const suggestions = getScopedSuggestions(model, { domainId: domainFilter, agentId: agentFilter, dismissed });
  const scopeStats = getScopeStats(model, domainFilter);
  const navigate = (path, options) => onNavigate?.(path, options);
  const scroller = () => typeof document === 'undefined' ? null : document.querySelector('.n-content') || document.scrollingElement;
  const changeHomeFilters = (domainId, agentId) => {
    setDomainFilter(domainId); setAgentFilter(agentId); setSelectedIssue(null); setSelectedIncidentId(null); setIncidentReviewRequest(null); setIncidentQueueIds([]);
    homeContextRef.current = { ...homeContextRef.current, domainId, agentId };
    navigate(buildAgentHomePath({ domainId, agentId, experienceState }), { replace: true });
  };
  const clearFilters = () => changeHomeFilters('all', 'all');
  const goManager = (patch = {}, event) => {
    if (page === 'home') homeContextRef.current = { domainId: domainFilter, agentId: agentFilter, scrollTop: scroller()?.scrollTop || 0, focusId: patch.groupId ? `agent-work-${patch.groupId}` : selection?.kind === 'capability' ? 'agent-start-job' : event?.currentTarget?.id || 'agent-home-next-title' };
    setSelection(null); openedRouteJobRef.current = null;
    navigate(buildJobsPath({ ...(page === 'jobs' ? managerQuery : { domainId: domainFilter, agentId: agentFilter }), experienceState, status: 'all', groupId: 'all', query: '', page: 0, jobId: '', ...patch }));
  };
  const changeManagerQuery = query => { setSelection(null); openedRouteJobRef.current = null; navigate(buildJobsPath(query), { replace: true }); };
  const goHome = () => { setSelection(null); navigate(buildAgentHomePath({ ...homeContextRef.current, experienceState })); };

  useEffect(() => {
    if (!active) return;
    const params = new URLSearchParams(routeSearch);
    if (params.has('experience')) return;
    params.set('exploration', 'agent-centric'); params.set('experience', experienceState);
    onNavigate?.(`${page === 'jobs' ? '/network-monitoring/jobs' : '/network-monitoring'}?${params.toString()}`, { replace: true });
  }, [active, page, routeSearch, experienceState, onNavigate]);

  useEffect(() => {
    if (!active || page !== 'home') return;
    setDomainFilter(managerQuery.domainId); setAgentFilter(managerQuery.agentId);
  }, [active, page, routeSearch]);
  useEffect(() => {
    if (!active || page !== 'home') return;
    const node = scroller();
    const save = () => { homeContextRef.current = { ...homeContextRef.current, domainId: domainFilter, agentId: agentFilter, scrollTop: node?.scrollTop || 0 }; };
    node?.addEventListener('scroll', save, { passive: true });
    return () => node?.removeEventListener('scroll', save);
  }, [active, page, domainFilter, agentFilter]);
  useEffect(() => {
    if (!active || previousPageRef.current === page) return;
    previousPageRef.current = page; setSelection(null); openedRouteJobRef.current = null;
    let second;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      if (page === 'home') {
        if (scroller()) scroller().scrollTop = homeContextRef.current.scrollTop;
        const target = document.getElementById(homeContextRef.current.focusId) || questionRef.current;
        if (inspectingIncident) return; // The incident workspace owns focus when returning from a job.
        if (homeContextRef.current.focusId.startsWith('agent-incident-')) document.getElementById('agent-incidents-title')?.closest('section')?.scrollIntoView({ block: 'start' });
        focus(target);
      }
      else { if (scroller()) scroller().scrollTop = 0; if (!managerQuery.jobId) focus(document.getElementById('agent-jobs-manager-title')); }
    }); });
    return () => { cancelAnimationFrame(first); if (second) cancelAnimationFrame(second); };
  }, [active, page]);

  useEffect(() => {
    if (!active || !selection) return;
    const frame = requestAnimationFrame(() => drawerRef.current?.shadowRoot?.querySelector('[part="panel"]')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [active, selection]);
  useEffect(() => { if (controlFocusRef.current && controlStatusRef.current) { controlFocusRef.current = false; controlStatusRef.current.focus(); } }, [controlState]);

  useEffect(() => {
    if (!active || !playing || variant !== 'main' || scene === 2 || scene >= 7) return;
    const timer = setTimeout(() => setScene(value => value + 1), scene >= 3 ? 2600 : 5500);
    return () => clearTimeout(timer);
  }, [active, playing, scene, variant]);
  useEffect(() => { if (!active) setPlaying(false); }, [active]);
  useEffect(() => { if (scene === 2 || scene === 7) setPlaying(false); }, [scene]);
  useEffect(() => {
    if (!active || variant !== 'revision') return;
    const timer = setTimeout(() => { setVersion(value => value + 1); setVariant('changed'); }, 3000);
    return () => clearTimeout(timer);
  }, [active, variant]);
  useEffect(() => {
    const pending = Object.entries(controlState).find(([, record]) => record.state === 'submitted');
    if (!active || !pending || model.sourceState !== 'current') return;
    const [agentId, record] = pending;
    const timer = setTimeout(() => { setEligibility(value => ({ ...value, [agentId]: record.desired })); setControlState(value => ({ ...value, [agentId]: { ...record, state: 'confirmed' } })); }, 1800);
    return () => clearTimeout(timer);
  }, [active, controlState, model.sourceState]);
  useEffect(() => {
    const pending = model.jobs.find(job => job.id.startsWith('REQUEST-') && job.status === 'Request submitted' && getCapabilityReadiness(job.capabilityId, model, job.scope).canStart);
    if (!active || !pending) return;
    const definition = CAPABILITIES.find(item => item.id === pending.capabilityId);
    const timer = setTimeout(() => setExtraJobs(jobs => jobs.map(job => job.id === pending.id ? { ...job, status: definition?.requestStatus || 'Assessing', checkpoint: definition?.requestCheckpoint || 'The agent acknowledged the request and is gathering evidence.', detail: 'Analysis is in progress. Acknowledgement does not establish a finding, incident, or network change.', step: 1 } : job)), 1800);
    return () => clearTimeout(timer);
  }, [active, extraJobs, model.sourceState, eligibility, scene, variant, version]);
  useEffect(() => {
    const pending = Object.entries(changeDecisions).find(([, record]) => record.state === 'submitted');
    if (!active || !pending || model.sourceState !== 'current') return;
    const [jobId] = pending;
    const timer = setTimeout(() => setChangeDecisions(value => ({ ...value, [jobId]: { ...value[jobId], state: 'approved' } })), 1800);
    return () => clearTimeout(timer);
  }, [active, changeDecisions, model.sourceState]);

  const close = () => { if (selectedJob && ['Verified', 'Assessment complete', 'Complete', 'Concluded'].includes(selectedJob.status)) setSelectedIssue(null); setSelection(null); openedRouteJobRef.current = null; if (page === 'jobs' && managerQuery.jobId) navigate(buildJobsPath({ ...managerQuery, experienceState, jobId: '' }), { replace: true }); requestAnimationFrame(() => focus(triggerRef.current?.isConnected ? triggerRef.current : page === 'jobs' ? document.getElementById('agent-jobs-manager-title') : questionRef.current)); };
  const open = (next, event) => { if (event?.currentTarget && !event.currentTarget.closest('hbr-drawer')) triggerRef.current = event.currentTarget; setSelectedIncidentId(null); setIncidentReviewRequest(null); setSelection(next); if (Object.hasOwn(next, 'issueId')) setSelectedIssue(next.issueId || null); };
  const openJob = (job, event) => open({ kind: 'job', jobId: job.id, issueId: job.issueId }, event);
  const openPlan = event => { setReviewedVersion(variant === 'changed' ? null : model.proposal.version); open({ kind: 'plan', jobId: ROUTE, issueId: 'config-route' }, event); };
  const openReview = (decision, event) => {
    if (decision.kind === 'plan' || (decision.jobId || decision.job) === ROUTE) { openPlan(event); return; }
    const job = model.jobs.find(item => item.id === (decision.jobId || decision.job));
    if (job?.proposal) {
      if (page === 'home' && job.incidentId && incidentIdsInScope.includes(job.incidentId)) {
        if (event?.currentTarget) incidentTriggerRef.current = event.currentTarget;
        setSelection(null); setSelectedIncidentId(job.incidentId);
        setIncidentReviewRequest({ jobId: job.id, reviewedVersion: job.proposal.version, token: ++requestId.current });
        return;
      }
      open({ kind: 'job-review', jobId: job.id, issueId: job.issueId, reviewedVersion: job.proposal.version }, event);
    }
  };
  const openIncident = (incidentId, event, queueIds) => {
    const next = getIncidentThread(model, incidentId);
    if (!next || !filteredJobs.some(job => next.jobIds.includes(job.id))) return;
    if (event?.currentTarget) incidentTriggerRef.current = event.currentTarget;
    if (queueIds) setIncidentQueueIds(queueIds);
    setSelection(null); setIncidentReviewRequest(null); setSelectedIncidentId(incidentId);
  };
  const closeIncident = () => {
    const incidentId = selectedIncidentId;
    setSelectedIncidentId(null); setIncidentReviewRequest(null);
    requestAnimationFrame(() => focus(incidentTriggerRef.current?.isConnected && !incidentTriggerRef.current.id?.startsWith('agent-incident-row-') ? incidentTriggerRef.current : document.getElementById(`agent-incident-row-${incidentId}`) || document.getElementById('agent-incidents-title')));
  };
  const followJobIncident = incidentId => {
    if (!getIncidentThread(model, incidentId)) return;
    setSelection(null); setIncidentReviewRequest(null); setSelectedIncidentId(incidentId); openedRouteJobRef.current = null;
    if (page === 'jobs') {
      const context = { domainId: managerQuery.domainId, agentId: managerQuery.agentId, scrollTop: 0, focusId: `agent-incident-row-${incidentId}` };
      homeContextRef.current = context; setDomainFilter(context.domainId); setAgentFilter(context.agentId); navigate(buildAgentHomePath({ ...context, experienceState }));
    }
  };
  const inspectManagerJob = (job, event, review = false) => {
    openedRouteJobRef.current = job.id;
    navigate(buildJobsPath({ ...managerQuery, experienceState, jobId: job.id }), { replace: true });
    if (review) openReview({ kind: job.id === ROUTE ? 'plan' : 'job-review', jobId: job.id }, event);
    else openJob(job, event);
  };
  const openStart = event => { setPickerAllAgents(false); open({ kind: 'start' }, event); };
  const openCapability = (item, event) => { const target = typeof item === 'string' ? CAPABILITIES.find(value => value.id === item) : item; if (!target) return; setScope(target.defaultScope); open({ kind: 'capability', capabilityId: target.id, issueId: target.issueId }, event); };
  const changeExperienceState = id => {
    if (!EXPERIENCE_STATES.some(item => item.id === id)) return;
    setExperienceState(id); setSelection(null); setPlaying(false); setVariant('main'); setScene(2); setVersion(1); setReviewedVersion(null); setChangeDecisions({}); setSelectedIssue(null);
    setSelectedIncidentId(null); setIncidentReviewRequest(null); setIncidentQueueIds([]);
    const params = new URLSearchParams(routeSearch); params.set('exploration', 'agent-centric'); params.set('experience', id);
    navigate(`${page === 'jobs' ? '/network-monitoring/jobs' : '/network-monitoring'}?${params.toString()}`, { replace: true });
  };
  const changeVariant = id => { const branch = AGENT_VARIANTS.find(item => item.id === id); if (!branch) return; setSelection(null); setPlaying(false); setVariant(id); setScene(branch.scene ?? 2); setVersion(id === 'changed' ? 2 : 1); setReviewedVersion(null); setSelectedIncidentId(null); setIncidentReviewRequest(null); };
  const canReview = model.sourceState === 'current' && model.permissions.reviewChange && model.scene === 2 && !['held', 'revision'].includes(variant) && reviewedVersion === model.proposal.version;
  const authorize = () => { if (!canReview) return; setVariant('main'); setScene(3); setPlaying(true); };
  const hold = () => { if (!canReview) return; setPlaying(false); setVariant('held'); };
  const revise = note => { if (!canReview) return; setPlaying(false); setRevisionNote(note); setVariant('revision'); };
  const startRequest = () => {
    if (!capability || !readiness?.canStart || existingJob) return;
    const id = `REQUEST-${String(++requestId.current).padStart(2, '0')}`;
    const domainId = scopeDomainId(scope);
    if (!domainId) return;
    const job = { id, fixtureId: variant === 'quiet' ? 'quiet' : 'fleet', capabilityId: capability.id, issueId: `request-${id}`, groupId: capability.groupId, domainId, domainName: model.network.domains.find(item => item.id === domainId)?.name, agentId: capability.agentId, agentVersion: model.agents[capability.agentId].version, agent: model.agents[capability.agentId].name, title: capability.title, scope, status: 'Request submitted', tone: 'info', priority: 2, checkpoint: 'Request submitted; agent acknowledgement is pending.', detail: 'Network access is read-only. Any network change needs separate authority.', source: `${id} · scoped agent request`, authority: capability.authority, health: model.agents[capability.agentId].health, steps: ['Request', 'Assess'], step: 0 };
    setExtraJobs(value => [...value, job]); setSelectedIssue(job.issueId); goManager({ domainId, agentId: job.agentId, groupId: capability.groupId || 'all', status: 'all', jobId: id });
  };
  const pendingControl = selection?.kind === 'agent' ? controlState[selection.agentId] : null;
  const recordChangeDecision = (jobId, state, proposalVersion) => {
    const job = model.jobs.find(item => item.id === jobId);
    if (model.sourceState !== 'current' || !model.permissions.reviewChange || !job?.canReview || job.proposal?.version !== proposalVersion || changeDecisions[jobId]) return;
    setChangeDecisions(value => ({ ...value, [jobId]: { state, version: proposalVersion } }));
  };
  const title = selection?.kind === 'start' ? 'Start job' : selection?.kind === 'job-review' && selectedJob?.id === 'R-41' ? 'Review path adjustment' : selection?.kind === 'plan' || selection?.kind === 'job-review' ? 'Review routing change' : selection?.kind === 'capability' ? capability?.title : selection?.kind === 'agent' ? 'Manage assignments' : selectedJob?.title || 'Job details';
  useEffect(() => {
    if (!active || page !== 'jobs') return;
    if (!managerQuery.jobId) { if (openedRouteJobRef.current) { setSelection(null); openedRouteJobRef.current = null; } return; }
    if (openedRouteJobRef.current === managerQuery.jobId) return;
    const job = selectManagerJobs(model, managerQuery).find(item => item.id === managerQuery.jobId);
    if (!job) return;
    openedRouteJobRef.current = job.id;
    if (managerQuery.status === 'review' && model.sourceState === 'current' && model.permissions.reviewChange && job.canReview) openReview({ kind: job.id === ROUTE ? 'plan' : 'job-review', jobId: job.id });
    else openJob(job);
  }, [active, page, routeSearch, model.jobs]);

  if (!active) return null;
  return <div ref={dashboardRef} className="agent-centric-dashboard" data-option="04" data-source={model.sourceState} data-experience-state={experienceState}>
    {page === 'jobs' ? <JobsManager model={model} query={{ ...managerQuery, experienceState }} onQueryChange={changeManagerQuery} onInspect={inspectManagerJob} onReview={(job, event) => inspectManagerJob(job, event, true)} onHome={goHome} homePath={buildAgentHomePath({ ...homeContextRef.current, experienceState })} onStartJob={openStart} selectedJobId={selectedJob?.id} agentControls={<AgentControls model={model} agents={model.agents} agentFilter={currentAgent} eligibility={eligibility} controlState={controlState} onAgentControl={(agentId, desired, event) => open({ kind: 'agent', agentId, desired }, event)}/>}/> : <>
    <h1 className="agent-home-sr">Crosswork AI agent workspace</h1>
    <div className="agent-home-context" data-assessed-only={variant === 'quiet'}>
      <div className="agent-home-context-filters">
        <hbr-dropdown hoist menu><hbr-button slot="trigger" variant="text" size="small" caret arialabel="Choose device group"><hbr-icon name="nav-network-wide" slot="prefix" size="16px"/>{domainFilter === 'all' ? variant === 'quiet' ? 'Assessed scopes' : 'All device groups' : model.network.domains.find(item => item.id === domainFilter)?.name || 'Unavailable device group'}</hbr-button><hbr-menu onhbr-select={event => changeHomeFilters(event.detail?.item?.value || 'all', agentFilter)}><hbr-menu-item value="all">All device groups</hbr-menu-item>{model.network.domains.map(domain => <hbr-menu-item key={domain.id} value={domain.id}>{domain.name} · {domain.deviceCount.toLocaleString()} devices</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
        <span className="agent-home-context-divider" aria-hidden="true"/>
        <hbr-dropdown hoist menu placement="bottom-end"><hbr-button slot="trigger" variant="text" size="small" caret arialabel="Filter by agent"><hbr-icon name="funnel-simple" slot="prefix" size="14px"/>{agentFilter === 'all' ? 'All agents' : model.agents[agentFilter]?.shortName || 'Unavailable agent'}</hbr-button><hbr-menu onhbr-select={event => changeHomeFilters(domainFilter, event.detail?.item?.value || 'all')}><hbr-menu-item value="all">All agents</hbr-menu-item>{Object.values(model.agents).map(agent => <hbr-menu-item key={agent.id} value={agent.id} data-agent-id={agent.id}>{agent.name}</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
      </div>
      <div className="agent-home-context-coverage"><span>{scopeStats.deviceCount.toLocaleString()} devices · {scopeStats.domainCount} {scopeStats.domainCount === 1 ? 'device group' : 'device groups'}</span><hbr-tooltip hoist content={model.sourceState === 'current' ? `${scopeStats.currentDeviceCount?.toLocaleString()} devices have current observations. Inventory does not establish network health.` : 'Current observation coverage is unavailable.'}><span className="agent-home-coverage"><hbr-icon name="clock" size="13px"/>{model.sourceState === 'current' ? `${(scopeStats.deviceCount - scopeStats.currentDeviceCount).toLocaleString()} awaiting data` : 'Updates interrupted'}</span></hbr-tooltip></div>
      <div className="agent-home-start-entry"><span id="agent-job-entry-hint">Investigate, check or verify</span><hbr-button ref={startRef} id="agent-start-job" class="agent-home-start" variant="outline" size="small" aria-describedby="agent-job-entry-hint" disabled={model.sourceState !== 'current' || !model.permissions.startReadOnly} onClick={openStart}><hbr-icon name="plus" slot="prefix" size="14px"/>Start job</hbr-button></div>
    </div>
    {model.sourceState !== 'current' && <div className="agent-home-source" role="status"><hbr-icon name="status-warning" size="16px"/>Updates interrupted. Showing last-confirmed jobs; new decisions and starts are unavailable.</div>}
    {(domainFilter === 'unavailable' || agentFilter === 'unavailable') && <div className="agent-home-source" role="status"><hbr-icon name="status-warning" size="16px"/>A saved filter is unavailable.<hbr-button size="small" variant="text" onClick={clearFilters}>Reset filters</hbr-button></div>}
    {variant === 'quiet' && <p className="agent-home-scope-note">Results cover assessed scopes only.</p>}
    <AgentDecisions model={model} decisions={decisions} hiddenDecisions={hiddenDecisions} selectedIssueId={selectedIssue} titleRef={questionRef} onReview={openReview} onOpenManager={goManager} onClearFilters={clearFilters}/>
    <div className="agent-operations-layout" data-inspecting={inspectingIncident}>
      <div className="agent-jobs-workspace" data-incident-workspace>
        <div className="agent-jobs-surface">
          <AgentWorkFeed model={model} jobs={filteredJobs} agents={model.agents} domainFilter={domainFilter} agentFilter={agentFilter} selectedIssueId={selectedIssue} onOpenManager={goManager}/>
        </div>
      </div>
      <IncidentSection model={model} domainFilter={domainFilter} agentFilter={agentFilter} selectedIncidentId={selectedIncidentId} onOpenIncident={openIncident}/>
    </div>
    <Suggested model={model} agents={model.agents} selectedIssueId={selectedIssue} agentFilter={agentFilter} suggestions={suggestions} onDismissSuggestion={id => { setDismissed(value => [...value, id]); requestAnimationFrame(() => focus(startRef.current)); }} onSuggestion={(item, event) => { const job = model.jobs.find(value => value.id === item.jobId) || model.jobs.find(value => value.issueId === item.issueId); if (job) goManager({ groupId: getTaskId(job), jobId: job.id }, event); }}/>
    </>}
    <Preview visible={previewVisible} onVisible={setPreviewVisible} experienceState={experienceState} variant={variant} onExperienceState={changeExperienceState} onVariant={changeVariant} onSwitch={onSwitchExploration} dockWidth={page === 'home' && inspectingIncident ? incidentDockWidth : 0}/>
    {page === 'home' && inspectingIncident && typeof document !== 'undefined' && createPortal(<IncidentDrawer model={model} incidentIds={incidentIds} selectedIncidentId={selectedIncidentId} domainFilter={domainFilter} agentFilter={agentFilter} onSelectIncident={id => openIncident(id)} onClose={closeIncident} initialWidth={incidentDrawerWidth} onWidthChange={setIncidentDockWidth} onWidthCommit={setIncidentDrawerWidth} reviewRequest={incidentReviewRequest} changeDecisions={changeDecisions} onDecision={recordChangeDecision}/>, document.body)}
    {selection && typeof document !== 'undefined' && createPortal(<hbr-drawer ref={drawerRef} class="agent-home-drawer" open overlay label={title} placement="right" size="large" onhbr-after-show={event => { if (event.target === event.currentTarget) event.currentTarget.shadowRoot?.querySelector('[part="panel"]')?.focus({ preventScroll: true }); }} onhbr-after-hide={event => { if (event.target === event.currentTarget) close(); }}>
      {selection.kind === 'start' && <StartJobPicker capabilities={capabilities} agents={model.agents} agentFilter={pickerAllAgents ? 'all' : currentAgent} onPick={openCapability} onClearAgent={() => setPickerAllAgents(true)}/>}
      {selection.kind === 'plan' && <ProposalReview key={`plan-${selection.jobId}`} model={model} reviewedVersion={reviewedVersion} onRefresh={() => setReviewedVersion(model.proposal.version)} onAuthorize={authorize} onHold={hold} onRevision={revise} revisionNote={revisionNote}/>}
      {selection.kind === 'job-review' && selectedJob && <ScopedChangeReview job={selectedJob} model={model} decision={changeDecisions[selectedJob.id]} reviewedVersion={selection.reviewedVersion} onDecision={recordChangeDecision}/>}
      {selection.kind === 'job' && selectedJob && <AgentJobInspector job={selectedJob} model={model} agents={model.agents} onReview={model.permissions.reviewChange && selectedJob.canReview ? event => openReview({ kind: selectedJob.id === ROUTE ? 'plan' : 'job-review', jobId: selectedJob.id }, event) : undefined} onOpenCapability={openCapability} onOpenIncident={selectedJob.incidentId ? followJobIncident : undefined}/>}
      {selection.kind === 'capability' && capability && <div className="agent-home-launch"><div className="agent-home-owner"><AgentMark agent={model.agents[capability.agentId]}/><div><strong>{model.agents[capability.agentId].name}</strong><span>Version {model.agents[capability.agentId].version} · {capability.authority}</span></div></div><p className="agent-home-panel-intro">{capability.description}</p><hbr-select label="Scope" value={scope} onhbr-change={event => setScope(inputValue(event))}>{capability.scopeOptions.map(value => <hbr-option key={value} value={value}>{value}</hbr-option>)}</hbr-select><div className="agent-home-notice"><hbr-icon name={readiness.canStart ? 'check-circle' : 'clock'}/><div><strong>{readiness.label}</strong><p>{readiness.reason}</p></div></div><dl className="agent-home-fields"><div><dt>Agent task</dt><dd>{capability.taskDescription || capability.description}</dd></div><div><dt>Change limit</dt><dd>Network access is read-only. Findings may produce incident records or proposed plans. Network changes require separate authority.</dd></div></dl>{existingJob && <div className="agent-home-existing"><span className="agent-home-eyebrow">Existing work</span><strong>{existingJob.title}</strong><p>{existingJob.scope}</p><hbr-tag size="small" sentiment={existingJob.tone}>{existingJob.status}</hbr-tag><hbr-button onClick={event => goManager({ domainId: existingJob.domainId, agentId: existingJob.agentId, groupId: getTaskId(existingJob), jobId: existingJob.id }, event)}>Open job<hbr-icon name="arrow-right" slot="suffix"/></hbr-button></div>}{!existingJob && <hbr-button disabled={!readiness.canStart || !model.permissions.startReadOnly} onClick={startRequest}>{capability.startLabel || ({ investigate: 'Start investigation', assess: 'Start assessment', verify: 'Start verification' })[capability.id] || 'Start analysis'}<hbr-icon name="arrow-right" slot="suffix"/></hbr-button>}</div>}
      {selection.kind === 'agent' && <div className="agent-home-control"><div className="agent-home-owner"><AgentMark agent={model.agents[selection.agentId]}/><div><strong>{model.agents[selection.agentId].name}</strong><span>Governance authority · New assignments</span></div></div><hbr-text variant="sub-section-title"><h3>{selection.desired === 'restricted' ? 'Stop new assignments' : 'Allow new assignments'}</h3></hbr-text><p>{selection.desired === 'restricted' ? 'This agent will not receive new assignments after the governor confirms the restriction.' : 'This agent can receive eligible new assignments after confirmation and current prerequisite checks.'}</p><div className="agent-home-notice"><hbr-icon name="nav-workflows"/><span>Existing work retains its owner and state. This does not cancel, repair or reassign a running job, or restore missing source access.</span></div>{pendingControl && <div role="status" ref={controlStatusRef} tabIndex={-1} className="agent-home-control-result"><strong>{pendingControl.state === 'submitted' ? 'Decision submitted' : pendingControl.desired === 'restricted' ? 'Restriction effective' : 'Eligibility restored'}</strong><p>{pendingControl.state === 'submitted' ? 'Waiting for governor confirmation. Eligibility has not changed.' : 'Confirmed for new assignments. Existing work is unchanged.'}</p></div>}<hbr-button disabled={model.sourceState !== 'current' || !model.permissions.governAgents || pendingControl?.state === 'submitted' || model.agents[selection.agentId].eligibility === selection.desired} onClick={() => { controlFocusRef.current = true; setControlState(value => ({ ...value, [selection.agentId]: { state: 'submitted', desired: selection.desired } })); }}>{selection.desired === 'restricted' ? 'Confirm restriction' : 'Confirm resume'}</hbr-button></div>}
      <hbr-button slot="footer" variant="text" onClick={close}>Close</hbr-button>
    </hbr-drawer>, document.body)}
  </div>;
}
