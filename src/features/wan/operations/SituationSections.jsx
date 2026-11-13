import { useEffect, useId, useState } from 'react';
import { agentResponse } from '../model/agentic-model.js';
import { domainLabel, findDevice, groupLabel } from '../model/scale.js';
import { OperationsSection, SectionHeader, StatusTag, StatusIcon, MetricChart, EvidenceNote } from './OperationsPrimitives.jsx';
import ResponsePlan from '../ResponsePlan.jsx';
import { SourceEvents, PendingEvents, ExpectedEvents } from '../SourceEvents.jsx';
import { eventCoverage } from '../model/event-accounting.js';
import { RecoveryDetails } from './RecoverySection.jsx';
import { RepeatIssuesDetails } from './EvidenceSections.jsx';
import './situation-sections.css';

const jobLabel = { 'not-started': 'No change started', running: 'Executing', completed: 'Execution completed', failed: 'Execution failed', unknown: 'Result unconfirmed' };
const stepLabel = { complete: 'Confirmed', active: 'In progress', blocked: 'Waiting', pending: 'Not started', error: 'Failed', unknown: 'Result unconfirmed' };
const stepVariant = { complete: 'complete', active: 'progress', blocked: 'inactive', pending: 'inactive', error: 'error', unknown: 'inactive' };
const activityVariant = event => /failed|error/i.test(event.title) ? 'error' : /unavailable|unconfirmed|unknown/i.test(event.title) ? 'default' : 'complete';

function ResourceMark({ type }) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="sit-resource-icon">
    {type === 'domain' ? <><path d="m16 4 11 6-11 6-11-6 11-6Zm-11 12 11 6 11-6M5 22l11 6 11-6" /></>
      : type === 'group' ? <><rect x="3" y="5" width="10" height="8" rx="2"/><rect x="19" y="5" width="10" height="8" rx="2"/><rect x="11" y="21" width="10" height="8" rx="2"/><path d="M8 13v4h16v-4M16 17v4"/></>
        : type === 'device' ? <><rect x="3" y="8" width="26" height="16" rx="4"/><path d="M8 13h8m-8 6h4m8-6h4m-4 6h4"/></>
          : <><rect x="5" y="5" width="22" height="22" rx="5"/><path d="M11 12h10v8H11zM13 9v3m6-3v3m-6 8v3m6-3v3"/></>}
  </svg>;
}

function ScopeDiagram({ model, incident, response, selected, onSelect }) {
  const interfaceScope = !incident || incident.id === 'interface' || (incident.id === 'monitoring' && response.target.includes('XR-P1'));
  const deviceId = interfaceScope ? model.scope.router : 'XR-PE-E2';
  const device = findDevice(deviceId);
  const domain = incident ? domainLabel(incident.domainId) : model.scope.domain;
  const items = [
    { id: 'domain', type: 'domain', label: 'Domain', value: domain, detail: 'Operational domain from the selected WAN inventory.' },
    { id: 'group', type: 'group', label: 'Device group', value: device ? groupLabel(device.groupId) : model.scope.group, detail: 'The router’s actual device group within this domain.' },
    { id: 'device', type: 'device', label: 'Router', value: deviceId, detail: interfaceScope ? 'IOS XR router · Current interface evidence is associated with this device.' : 'IOS XR router · Independent reachability and telemetry sources remain separate.' },
    { id: 'interface', type: 'interface', label: interfaceScope ? 'Interface' : incident?.id === 'monitoring' ? 'Telemetry' : 'Reachability', value: interfaceScope ? 'HundredGigE0/0/0/0' : incident?.id === 'monitoring' ? 'Device collection' : 'Independent checks', detail: interfaceScope ? `Outbound toward ${model.scope.peer}. Collection status is retained with the interface evidence.` : response.evidence?.[0]?.value || response.target },
  ];
  return <div className="sit-scope-diagram" aria-label="Affected resource hierarchy">
    <div className="sit-scope-line" aria-hidden="true" />
    {items.map(item => <button type="button" className="sit-scope-node" data-selected={selected?.id === item.id} key={item.id} onClick={() => onSelect(item)} aria-pressed={selected?.id === item.id}>
      <span className="sit-resource-symbol"><ResourceMark type={item.type}/></span>
      <span className="sit-node-label">{item.label}</span>
      <strong>{item.value}</strong>
      <span className="sit-node-inspect">Inspect scope <span aria-hidden="true">↗</span></span>
    </button>)}
  </div>;
}

function QuietWatch({ model, onInspect }) {
  const developing = model.frame === 1;
  const verified = model.response.resolved;
  return <div className="sit-quiet-summary" data-verified={verified}>
    <span className="sit-quiet-symbol"><StatusIcon status={developing ? 'active' : 'complete'} size="24px"/></span>
    <div><h3>{verified ? 'CNC-1042 recovery verified' : 'No active incidents'}</h3><p>{verified ? 'The completed response and recovery proof are retained in Recent.' : developing ? 'A rising utilization trend is being followed in Watchlist.' : 'Current observations support the network watch.'}</p></div>
    {verified ? <a className="sit-inline-link" href="#ops-recent">View outcome <span aria-hidden="true">↗</span></a> : <hbr-button variant="text" size="small" onClick={() => onInspect?.({kind:'interface',id:model.scope.interfaceId})}>Inspect evidence</hbr-button>}
  </div>;
}

export function IncidentSection({ model, state, onOpen, onInspect, onAction, requestedIncident }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [view, setView] = useState('overview');
  const [scopeRecord, setScopeRecord] = useState(null);
  const [evidenceRecord, setEvidenceRecord] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const heading = useId();
  const incidents = model.watch.incidents;
  const contextKey = `${model.scope.domainId}:${model.scope.groupId}`;
  const selectedId = selectedRecord?.contextKey === contextKey ? selectedRecord.id : null;
  const setSelectedId = id => setSelectedRecord(id ? {id,contextKey} : null);
  // A deliberately inspected case stays in place when verification completes.
  // The active count continues to come exclusively from current conditions.
  const completedCase = selectedId === 'interface' && model.response.resolved ? {
    id: 'interface', title: model.response.title, domainId: model.scope.domainId,
    severity: 'Resolved', sourceState: 'Source-cleared', stage: model.response.stage,
  } : null;
  const incident = incidents.find(item => item.id === selectedId) || completedCase || incidents[0];
  const choices = completedCase ? [...incidents, completedCase] : incidents;
  useEffect(() => {
    if (!requestedIncident || requestedIncident.contextKey !== contextKey) return;
    setSelectedRecord({id:requestedIncident.id || 'interface',contextKey});
    setView(['overview','recovery','history'].includes(requestedIncident.view) ? requestedIncident.view : 'overview');
    setScopeRecord(null);
    setEvidenceRecord(null);
    setShowAllActivity(false);
  }, [requestedIncident, contextKey]);
  useEffect(() => {
    if (model.frame >= 2) return;
    setSelectedRecord(null);
    setView('overview');
    setScopeRecord(null);
    setEvidenceRecord(null);
    setShowAllActivity(false);
  }, [model.frame]);
  const scopeSelection = scopeRecord?.incidentId === incident?.id && scopeRecord?.contextKey === contextKey ? scopeRecord : null;
  const evidenceIndex = evidenceRecord && evidenceRecord.incidentId === incident?.id && evidenceRecord.contextKey === contextKey ? evidenceRecord.index : null;
  const setScopeSelection = item => setScopeRecord(item ? {...item, incidentId:incident?.id,contextKey} : null);
  const setEvidenceIndex = index => setEvidenceRecord(index === null ? null : {index,incidentId:incident?.id,contextKey});
  const response = incident?.id === 'interface' || !incident ? model.response : agentResponse(state, incident.id);
  const tone = response.resolved && incident?.id === 'interface' ? 'positive' : incident?.severity === 'Critical' ? 'negative' : incident?.id === 'monitoring' ? 'inactive' : 'warning';
  const countTone = incidents.some(item => item.severity === 'Critical') ? 'negative' : incidents.length ? 'warning' : 'positive';
  const target = incident?.id === 'device' || (incident?.id === 'monitoring' && !response.target.includes('XR-P1')) ? {kind:'device',id:'XR-PE-E2'} : {kind:'interface',id:model.scope.interfaceId};
  const evidence = response.evidence || [];
  const selectedEvidence = evidenceIndex === null ? null : evidence[evidenceIndex];
  const activity = response.activity || [];
  const visibleActivity = showAllActivity ? activity : activity.slice(-3);
  const progress = response.steps || [];
  const selectIncident = id => { setSelectedId(id); setView('overview'); setScopeSelection(null); setEvidenceIndex(null); setShowAllActivity(false); };
  const changeView = event => {
    if (event.target !== event.currentTarget || !['overview','recovery','history'].includes(event.detail?.name)) return;
    if (event.detail.name !== view) setSelectedId(incident.id);
    setView(event.detail.name);
  };
  const recoveryLabel = response.resolved ? 'Recovery verified' : !model.observation.fresh ? 'Verification waiting for data' : response.job.status === 'failed' ? 'Execution failed · Recovery unverified' : response.job.status === 'unknown' ? 'Controller result unconfirmed' : response.job.status === 'completed' ? 'Execution complete · Verification pending' : response.job.status === 'running' ? 'Execution running · Recovery not yet verified' : 'Recovery not yet verified';

  const overview = incident ? <>
        <ResponsePlan response={response}/>
        <div className="sit-investigation-grid">
          <div className="sit-resource-surface">
            <div className="sit-surface-heading"><span>Affected scope</span><span>Resource hierarchy</span></div>
            <ScopeDiagram model={model} incident={incident} response={response} selected={scopeSelection} onSelect={item => {setSelectedId(incident.id);setScopeSelection(item);setEvidenceIndex(null);}}/>
            <div className="sit-scope-caption"><span className="sit-scope-caption-line"/><span>{incident.id === 'interface' ? `${model.scope.router} → ${model.scope.peer} · Actual interface connection` : response.scope}</span></div>
          </div>
          <div className="sit-finding-surface">
            <div className="sit-surface-heading"><span>Current finding</span><time>{model.time}</time></div>
            <p className="sit-finding-summary" key={`${incident.id}-${response.currentWork}`}>{response.currentWork}</p>
            <div className="sit-evidence-strips">{evidence.slice(0,3).map((item,index) => <button type="button" className="sit-evidence-strip" key={item.label} data-selected={evidenceIndex === index} data-fresh={item.fresh} onClick={() => {setSelectedId(incident.id);setEvidenceIndex(index);setScopeSelection(null);}} aria-pressed={evidenceIndex === index}><span>{item.label}<small>{item.fresh ? item.time : `Last known ${item.time}`}</small></span><strong key={item.value}>{item.value}</strong></button>)}</div>
          </div>
        </div>
        {(selectedEvidence || scopeSelection) && <div className="sit-attached-evidence" aria-live="polite">
          <div><span className="sit-overline">{selectedEvidence ? 'Selected evidence' : 'Selected scope'}</span><h4>{selectedEvidence?.label || scopeSelection.label}</h4><strong>{selectedEvidence?.value || scopeSelection.value}</strong><p>{selectedEvidence ? `${selectedEvidence.source} · ${selectedEvidence.fresh ? 'Observed' : 'Last observed'} ${selectedEvidence.time}` : scopeSelection.detail}</p></div>
          <hbr-button variant="outline" size="small" onClick={() => onInspect?.(scopeSelection?.id === 'device' ? {kind:'device',id:target.kind === 'device' ? target.id : model.scope.router} : target)}>Inspect source</hbr-button>
        </div>}
        <div className="sit-response-band">
          <div className="sit-response-copy"><span className="sit-overline">{response.resolved ? 'Response completed' : 'Response underway'}</span><p>{response.summary}</p><span className="sit-next"><span aria-hidden="true">→</span> {response.next}</span></div>
          <div className="sit-confirmed-job"><span>Controller record</span><strong>{response.job?.id || 'No controller job'}</strong><StatusTag tone={response.job?.status === 'failed' ? 'negative' : response.job?.status === 'completed' ? 'positive' : 'info'}>{jobLabel[response.job?.status] || 'Not started'}</StatusTag>{response.job?.startedAt && <small>Started {response.job.startedAt}</small>}</div>
        </div>
        <SourceEvents state={state} caseId={incident.id} onInspect={onInspect}/>

        <div className="sit-response-trace">
          <div className="sit-lifecycle">
            <div className="sit-activity-heading"><hbr-text variant="smallest-title">Response progress</hbr-text></div>
            <hbr-timeline aria-label="Autonomous response progress">
              {progress.map(step => <hbr-timeline-panel key={`${step.id}-${step.status}`} label={step.label} subtext={stepLabel[step.status] || step.status} variant={stepVariant[step.status] || 'default'} aria={{level:4}}/>)}
            </hbr-timeline>
          </div>
          <div className="sit-confirmed-activity">
            <div className="sit-activity-heading"><hbr-text variant="smallest-title">Confirmed activity</hbr-text>{activity.length > 3 && <hbr-button variant="text" size="small" onClick={() => setShowAllActivity(value => !value)}>{showAllActivity ? 'Show latest activity' : `Show earlier activity (${activity.length - 3})`}</hbr-button>}</div>
            <hbr-timeline aria-label="Confirmed response activity">{visibleActivity.map((event,index) => <hbr-timeline-panel key={`${event.time}-${event.title}-${index}`} label={event.title} subtext={event.time} variant={activityVariant(event)} open={true} aria={{level:4}}><hbr-text size="xs" type="secondary">{event.detail}</hbr-text></hbr-timeline-panel>)}</hbr-timeline>
          </div>
        </div>
  </> : null;

  return <OperationsSection className="sit-incidents" id="ops-incidents" aria-labelledby={heading} data-state={incident ? 'active' : 'quiet'}>
    <SectionHeader id={heading} kicker="Current conditions" title="Incidents" description="The condition, the evidence, and the response underway.">
      <StatusTag tone={countTone}>{incidents.length ? `${incidents.length} active ${incidents.length === 1 ? 'condition' : 'conditions'}` : 'No active incidents'}</StatusTag>
      {completedCase && <hbr-button variant="text" size="small" onClick={() => {setSelectedRecord(null);setView('overview');setScopeRecord(null);setEvidenceRecord(null);}}>Close review</hbr-button>}
    </SectionHeader>
    {!incident ? <QuietWatch model={model} onInspect={onInspect} onOpen={onOpen}/> : <>
      {choices.length > 1 && <div className="sit-incident-choices" aria-label="Choose a condition">{choices.map(item => <button type="button" key={item.id} data-selected={item.id === incident.id} data-tone={item.severity === 'Resolved' ? 'positive' : item.severity === 'Critical' ? 'negative' : item.id === 'monitoring' ? 'inactive' : 'warning'} aria-pressed={item.id === incident.id} onClick={() => selectIncident(item.id)}><span className="sit-choice-mark"/><span><strong>{item.title}</strong><small>{domainLabel(item.domainId)} · {item.sourceState}</small></span><span className="sit-choice-state">{item.severity === 'Resolved' ? 'Completed review' : item.stage}</span></button>)}</div>}
      <div className="sit-incident-canvas" data-tone={tone}>
        <div className="sit-incident-banner">
          <div className="sit-incident-title"><StatusTag tone={tone}>{incident.sourceState}</StatusTag><h3>{incident.title}</h3><span>{response.target}</span></div>
          <div className="sit-response-state"><span className="sit-live-dot" key={model.time}/><span>CW AI</span><strong>{response.stage}</strong><time>{model.time}</time></div>
        </div>
        {incident.id === 'interface' && <div className="sit-recovery-brief" data-verified={response.resolved}>
          <StatusIcon status={response.resolved ? 'complete' : ['failed','unknown'].includes(response.job.status) || !model.observation.fresh ? 'blocked' : 'active'}/>
          <span>{recoveryLabel}</span>
          {response.resolved && <span className="sit-review-label">Completed case · Kept open for review</span>}
        </div>}
        {response.blocker && <div className="sit-decision"><StatusTag tone="warning">Owned by CW AI</StatusTag><h4>{response.blocker.title}</h4><p>{response.blocker.detail}</p><small>{response.blocker.next}</small></div>}
        {incident.id === 'interface' ? <hbr-tab-group class="sit-case-tabs" onhbr-tab-show={changeView}>
          <hbr-tab slot="nav" panel="overview" active={view === 'overview'} onClick={() => setSelectedId(incident.id)}>Overview</hbr-tab>
          <hbr-tab slot="nav" panel="recovery" active={view === 'recovery'} onClick={() => setSelectedId(incident.id)}>Recovery</hbr-tab>
          <hbr-tab slot="nav" panel="history" active={view === 'history'} onClick={() => setSelectedId(incident.id)}>History</hbr-tab>
          <hbr-tab-panel name="overview" active={view === 'overview'}><div className="sit-case-panel" data-active={view === 'overview'}>
            {overview}
          </div></hbr-tab-panel>
          <hbr-tab-panel name="recovery" active={view === 'recovery'}><div className="sit-case-detail" data-active={view === 'recovery'}><RecoveryDetails model={model} onInspect={onInspect} onOpen={onOpen}/></div></hbr-tab-panel>
          <hbr-tab-panel name="history" active={view === 'history'}><div className="sit-case-detail evidence-section" data-active={view === 'history'}><RepeatIssuesDetails model={model} onOpen={onOpen}/></div></hbr-tab-panel>
        </hbr-tab-group> : <div className="sit-case-panel">
            {overview}
        </div>}
        <footer className="sit-incident-footer"><EvidenceNote>Source severity, controller execution, and recovery remain separate records.</EvidenceNote><div className="sit-footer-actions"><hbr-button variant="outline" size="small" onClick={() => onOpen?.(incident.id)}>Inspect response</hbr-button>{incident.id === 'interface' && !response.resolved && <hbr-button variant="text" size="small" onClick={() => onAction?.({type:response.paused ? 'AGENT_RESUME' : 'AGENT_PAUSE',incident:'interface'})}>{response.paused ? 'Resume with revalidation' : 'Pause further changes'}</hbr-button>}</div></footer>
      </div>
    </>}
  </OperationsSection>;
}

export function WatchlistSection({ model, state, onInspect, onOpen, onReviewIncident }) {
  const heading = useId();
  const [selectedTime,setSelectedTime] = useState(null);
  const { observation:reading,response,frame } = model;
  const points = model.samples || [];
  const inspected = points.find(point => point.time === selectedTime) || points.at(-1);
  const incidentOpened = frame >= 2;
  const developing = frame === 1 && reading.fresh;
  const pending = state ? eventCoverage(state).pending : [];
  const tone = !reading.fresh ? 'warning' : developing ? 'info' : 'positive';
  const followCase = () => onReviewIncident ? onReviewIncident('recovery') : onOpen?.('interface');
  const selectSample = value => setSelectedTime(typeof value === 'string' ? value : value?.time ?? null);

  return <OperationsSection className="sit-watchlist" id="ops-watchlist" aria-labelledby={heading}>
    <SectionHeader id={heading} title="Watchlist" description="Developing conditions and new events under investigation."><StatusTag tone={pending.length ? 'info' : tone}>{pending.length ? `${pending.length} under correlation` : !reading.fresh ? 'Visibility limited' : developing ? 'Following a trend' : 'No developing conditions'}</StatusTag></SectionHeader>
    {pending.length > 0 && <PendingEvents state={state} onInspect={onInspect}/>}
    {state && <ExpectedEvents state={state}/>}
    {developing ? <>
      <div className="sit-watch-heading"><div><span className="sit-overline">{model.scope.domain} · {model.scope.router} outbound</span><h3>Outbound utilization is rising</h3><p>{model.scope.interface} → {model.scope.peer}</p></div><div className="sit-watch-value" data-tone="info"><strong key={reading.utilization}>{reading.utilization}<small>%</small></strong><span>Observed {reading.observedAt}</span></div></div>
      <div className="sit-trend-workspace"><div className="sit-large-trend"><MetricChart samples={points} threshold={model.threshold} selectedTime={inspected?.time} onSelect={selectSample} endTime={model.time} label={`${model.scope.router} outbound interface utilization`} height={250}/><div className="sit-plot-legend"><span><i/>Outbound utilization</span><span><i className="threshold"/>Configured limit {model.threshold}%</span></div></div><aside className="sit-trend-inspection"><span className="sit-overline">Selected observation</span><strong>{inspected?.value ?? reading.utilization}<small>%</small></strong><time>{inspected?.time || reading.observedAt}</time><p>Interface telemetry<br/>{model.scope.router} outbound</p><StatusTag tone="info">Below limit at observation</StatusTag></aside></div>
      <div className="sit-observation-selector" aria-label="Inspect an observed sample">{points.slice(-6).map(point => <button type="button" key={point.time} aria-pressed={inspected?.time === point.time} data-selected={inspected?.time === point.time} onClick={() => setSelectedTime(point.time)}><time>{point.time}</time><strong>{point.value}%</strong><span className="sit-sample-dot"/></button>)}</div>
      <div className="sit-watch-conclusion" data-tone="info"><div className="sit-conclusion-mark" aria-hidden="true"><StatusIcon status="active" size="20px"/></div><div><strong>Read-only checks are following the rising metric</strong><p>The configured threshold has not been crossed. Each recorded observation extends the trend.</p></div><hbr-button variant="text" size="small" onClick={() => onInspect?.({kind:'interface',id:model.scope.interfaceId})}>Inspect source</hbr-button></div>
    </> : <div className="sit-watch-summary" data-gap={!reading.fresh}>
      <span className="sit-quiet-symbol"><StatusIcon status={!reading.fresh ? 'blocked' : incidentOpened && !response.resolved ? 'active' : 'complete'} size="24px"/></span>
      <div><h3>{!reading.fresh ? 'A collection gap limits the current watch' : incidentOpened ? response.resolved ? 'The watched condition has a verified outcome' : 'The trend is now tracked in CNC-1042' : 'No developing condition in the current observations'}</h3><p>{!reading.fresh ? `Current utilization is unknown. Last trustworthy sample: ${reading.utilization}% at ${reading.observedAt}.` : incidentOpened ? response.resolved ? 'Recovery evidence is retained with the completed incident.' : 'Its observations and response stay together in the incident workspace.' : `${model.scope.router} outbound is below the configured ${model.threshold}% limit at ${reading.observedAt}.`}</p></div>
      {incidentOpened ? <hbr-button variant="text" size="small" onClick={followCase}>{response.resolved ? 'Review outcome' : 'Follow incident'}</hbr-button> : <hbr-button variant="text" size="small" onClick={() => !reading.fresh ? onOpen?.('monitoring') : onInspect?.({kind:'interface',id:model.scope.interfaceId})}>{!reading.fresh ? 'Follow collection response' : 'Inspect source'}</hbr-button>}
    </div>}
  </OperationsSection>;
}
