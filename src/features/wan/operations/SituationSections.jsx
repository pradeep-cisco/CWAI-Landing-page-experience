import { useId, useState } from 'react';
import { agentResponse } from '../model/agentic-model.js';
import { domainLabel, findDevice, groupLabel } from '../model/scale.js';
import { OperationsSection, SectionHeader, StatusTag, StatusIcon, MetricChart, EvidenceNote } from './OperationsPrimitives.jsx';
import './situation-sections.css';

const jobLabel = { 'not-started': 'No change started', running: 'Executing', completed: 'Execution completed', failed: 'Execution failed', unknown: 'Result unconfirmed' };
const stepLabel = { complete: 'Confirmed', active: 'In progress', blocked: 'Waiting', pending: 'Not started', error: 'Failed', unknown: 'Result unconfirmed' };
const stepVariant = { complete: 'complete', active: 'progress', blocked: 'inactive', pending: 'inactive', error: 'error', unknown: 'inactive' };
const activityVariant = event => /failed|error/i.test(event.title) ? 'error' : /unavailable|unconfirmed|unknown/i.test(event.title) ? 'default' : 'complete';

// Present the actual controller result, rather than inferring execution from
// the source story's phase. Observation continues while further changes pause.
function responseProgress(response, observation) {
  if (response.id !== 'interface') return response.steps || [];
  const execution = { running: 'active', completed: 'complete', failed: 'error', unknown: 'unknown' }[response.job?.status]
    || (response.needsDecision || response.paused ? 'blocked' : 'pending');
  return (response.steps || []).map(step => {
    if (step.id === 'remediate') return { ...step, status: execution };
    if (step.id === 'verify') return { ...step, status: response.resolved ? 'complete' : response.job?.status !== 'completed' ? 'pending' : !observation.fresh || response.needsDecision ? 'blocked' : 'active' };
    return !observation.fresh && !response.resolved ? { ...step, status: 'blocked' } : step;
  });
}

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

function QuietWatch({ model, onInspect, onOpen }) {
  const developing = model.frame === 1;
  const verified = model.response.resolved;
  return <div className="sit-quiet-watch">
    <div className="sit-watch-orbit" key={`${model.time}-${verified}`} aria-hidden="true">
      <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="75"/><circle cx="100" cy="100" r="54"/><path d="M42 100h31l12-14 22 28 14-20h37"/><circle className="sit-orbit-point" cx="100" cy="25" r="4"/><circle className="sit-orbit-point secondary" cx="165" cy="138" r="3"/></svg>
      <span className="sit-orbit-core"><StatusIcon status={developing ? 'active' : 'complete'} size="28px"/></span>
    </div>
    <div className="sit-quiet-copy">
      <StatusTag tone={developing ? 'info' : 'positive'}>{verified ? 'Verified outcome' : developing ? 'Watching a trend' : 'Current sources'}</StatusTag>
      <h3>{verified ? 'Recovery is supported by current evidence' : developing ? 'A developing condition is being followed' : 'No active incidents'}</h3>
      <p>{verified ? 'The response record and independent recovery observations remain available.' : developing ? `${model.scope.domain} outbound utilization is rising. The configured threshold has not been crossed.` : 'Reachability, topology, and interface observations support the current network watch.'}</p>
      <div className="sit-quiet-observation"><span className="sit-observation-dot"/><span>{model.scope.router} outbound</span><strong>{model.observation.utilization}%</strong><span>at {model.observation.observedAt}</span></div>
      <div className="sit-quiet-actions"><hbr-button variant="outline" size="small" onClick={() => onInspect?.({kind:'interface',id:model.scope.interfaceId})}>Inspect current evidence</hbr-button>{verified && <hbr-button variant="text" size="small" onClick={() => onOpen?.('interface')}>Review response</hbr-button>}</div>
    </div>
  </div>;
}

export function IncidentSection({ model, state, onOpen, onInspect, onAction }) {
  const [selectedId, setSelectedId] = useState(null);
  const [scopeRecord, setScopeRecord] = useState(null);
  const [evidenceRecord, setEvidenceRecord] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const heading = useId();
  const incidents = model.watch.incidents;
  const incident = incidents.find(item => item.id === selectedId) || incidents[0];
  const contextKey = `${model.scope.domainId}:${model.scope.groupId}`;
  const scopeSelection = scopeRecord?.incidentId === incident?.id && scopeRecord?.contextKey === contextKey ? scopeRecord : null;
  const evidenceIndex = evidenceRecord && evidenceRecord.incidentId === incident?.id && evidenceRecord.contextKey === contextKey ? evidenceRecord.index : null;
  const setScopeSelection = item => setScopeRecord(item ? {...item, incidentId:incident?.id,contextKey} : null);
  const setEvidenceIndex = index => setEvidenceRecord(index === null ? null : {index,incidentId:incident?.id,contextKey});
  const response = incident?.id === 'interface' || !incident ? model.response : agentResponse(state, incident.id);
  const tone = incident?.severity === 'Critical' ? 'negative' : incident?.id === 'monitoring' ? 'inactive' : 'warning';
  const target = incident?.id === 'device' || (incident?.id === 'monitoring' && !response.target.includes('XR-P1')) ? {kind:'device',id:'XR-PE-E2'} : {kind:'interface',id:model.scope.interfaceId};
  const evidence = response.evidence || [];
  const selectedEvidence = evidenceIndex === null ? null : evidence[evidenceIndex];
  const activity = response.activity || [];
  const visibleActivity = showAllActivity ? activity : activity.slice(-3);
  const progress = responseProgress(response, model.observation);
  const selectIncident = id => { setSelectedId(id); setScopeSelection(null); setEvidenceIndex(null); setShowAllActivity(false); };

  return <OperationsSection className="sit-incidents" id="ops-incidents" aria-labelledby={heading} data-state={incident ? 'active' : 'quiet'}>
    <SectionHeader id={heading} kicker="Current conditions" title="Incidents" description="The condition, the evidence, and the response underway.">
      <StatusTag tone={incidents.length ? tone : 'positive'}>{incidents.length ? `${incidents.length} active ${incidents.length === 1 ? 'condition' : 'conditions'}` : 'No active incidents'}</StatusTag>
    </SectionHeader>
    {!incident ? <QuietWatch model={model} onInspect={onInspect} onOpen={onOpen}/> : <>
      {incidents.length > 1 && <div className="sit-incident-choices" aria-label="Choose an active condition">{incidents.map(item => <button type="button" key={item.id} data-selected={item.id === incident.id} data-tone={item.severity === 'Critical' ? 'negative' : item.id === 'monitoring' ? 'inactive' : 'warning'} aria-pressed={item.id === incident.id} onClick={() => selectIncident(item.id)}><span className="sit-choice-mark"/><span><strong>{item.title}</strong><small>{domainLabel(item.domainId)} · {item.sourceState}</small></span><span className="sit-choice-state">{item.stage}</span></button>)}</div>}
      <div className="sit-incident-canvas" data-tone={tone}>
        <div className="sit-incident-banner">
          <div className="sit-incident-title"><StatusTag tone={tone}>{incident.sourceState}</StatusTag><h3>{incident.title}</h3><span>{response.target}</span></div>
          <div className="sit-response-state"><span className="sit-live-dot" key={model.time}/><span>CW AI</span><strong>{response.stage}</strong><time>{model.time}</time></div>
        </div>
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
          <div className="sit-response-copy"><span className="sit-overline">Response underway</span><p>{response.summary}</p><span className="sit-next"><span aria-hidden="true">→</span> {response.next}</span></div>
          <div className="sit-confirmed-job"><span>Controller record</span><strong>{response.job?.id || 'No controller job'}</strong><StatusTag tone={response.job?.status === 'failed' ? 'negative' : response.job?.status === 'completed' ? 'positive' : 'info'}>{jobLabel[response.job?.status] || 'Not started'}</StatusTag>{response.job?.startedAt && <small>Started {response.job.startedAt}</small>}</div>
        </div>
        {response.needsDecision && response.decision && <div className="sit-decision"><StatusTag tone="warning">Attention required</StatusTag><h4>{response.decision.title}</h4><p>{response.decision.detail}</p>{response.handoff && <small>{response.handoff.route} · Delivered {response.handoff.sent} · {response.handoff.status === 'accepted' ? 'Acceptance confirmed' : 'Acceptance pending'}</small>}</div>}
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
        <footer className="sit-incident-footer"><EvidenceNote>Source severity, controller execution, and recovery remain separate records.</EvidenceNote><div className="sit-footer-actions"><hbr-button variant="outline" size="small" onClick={() => onOpen?.(incident.id)}>{response.needsDecision ? 'Review decision' : 'Inspect response'}</hbr-button>{incident.id === 'interface' && !response.resolved && <hbr-button variant="text" size="small" onClick={() => onAction?.({type:response.paused ? 'AGENT_RESUME' : 'AGENT_PAUSE',incident:'interface'})}>{response.paused ? 'Resume with revalidation' : 'Pause further changes'}</hbr-button>}</div></footer>
      </div>
    </>}
  </OperationsSection>;
}

export function WatchlistSection({ model, onInspect, onOpen }) {
  const heading = useId();
  const [selectedTime,setSelectedTime] = useState(null);
  const { observation:reading,response,frame } = model;
  const points = model.samples || [];
  const inspected = points.find(point => point.time === selectedTime) || points.at(-1);
  const incidentOpened = frame >= 2;
  const title = !reading.fresh ? 'Current trend awaits fresh observations' : response.resolved ? 'The condition has stabilized' : frame === 11 ? 'The source has cleared; follow-up remains' : incidentOpened ? 'The developing condition became an incident' : frame === 1 ? 'Outbound utilization is rising' : 'Interface observations are within limits';
  const tone = !reading.fresh ? 'inactive' : response.resolved ? 'positive' : incidentOpened && frame < 11 ? 'warning' : 'info';
  const selectSample = value => setSelectedTime(typeof value === 'string' ? value : value?.time ?? null);

  return <OperationsSection className="sit-watchlist" id="ops-watchlist" aria-labelledby={heading}>
    <SectionHeader id={heading} kicker="Developing conditions" title="Watchlist" description="Observed trends that deserve a closer watch."><StatusTag tone={tone}>{!reading.fresh ? 'Last-known observations' : response.resolved ? 'Verified recovery' : incidentOpened ? 'Linked incident' : frame === 1 ? 'Following a trend' : 'Within limits'}</StatusTag></SectionHeader>
    <div className="sit-watch-heading"><div><span className="sit-overline">{model.scope.domain} · {model.scope.router} outbound</span><h3>{title}</h3><p>{model.scope.interface} → {model.scope.peer}</p></div><div className="sit-watch-value" data-tone={tone}><strong key={`${reading.utilization}-${reading.fresh}`}>{reading.utilization}<small>%</small></strong><span>{reading.fresh ? 'Observed' : 'Last observed'} {reading.observedAt}</span></div></div>
    <div className="sit-trend-workspace"><div className="sit-large-trend"><MetricChart samples={points} threshold={model.threshold} selectedTime={inspected?.time} onSelect={selectSample} actionTime={response.job?.startedAt} endTime={model.time} label={`${model.scope.router} outbound interface utilization`} height={250}/><div className="sit-plot-legend"><span><i/>Outbound utilization</span><span><i className="threshold"/>Configured limit {model.threshold}%</span></div></div><aside className="sit-trend-inspection"><span className="sit-overline">Selected observation</span><strong>{inspected?.value ?? reading.utilization}<small>%</small></strong><time>{inspected?.time || reading.observedAt}</time><p>Interface telemetry<br/>{model.scope.router} outbound</p><StatusTag tone={(inspected?.value ?? reading.utilization) >= model.threshold ? 'warning' : 'positive'}>{(inspected?.value ?? reading.utilization) >= model.threshold ? 'Above limit at observation' : 'Below limit at observation'}</StatusTag></aside></div>
    <div className="sit-observation-selector" aria-label="Inspect an observed sample">{points.slice(-6).map(point => <button type="button" key={point.time} aria-pressed={inspected?.time === point.time} data-selected={inspected?.time === point.time} onClick={() => setSelectedTime(point.time)}><time>{point.time}</time><strong>{point.value}%</strong><span className="sit-sample-dot" data-above={point.value >= model.threshold}/></button>)}</div>
    <div className="sit-watch-conclusion" data-tone={tone}><div className="sit-conclusion-mark" aria-hidden="true"><StatusIcon status={!reading.fresh || (incidentOpened && frame === 11 && !response.resolved) ? 'blocked' : response.resolved ? 'complete' : incidentOpened || frame === 1 ? 'active' : 'pending'} size="20px"/></div><div><strong>{!reading.fresh ? 'Collection gap interrupts the current trend' : response.resolved ? 'Recovery confirmed at 08:35' : incidentOpened ? 'CNC-1042 opened at 08:00' : frame === 1 ? 'Read-only checks are following the rising metric' : 'A qualifying condition will start an autonomous response'} </strong><p>{!reading.fresh ? `The last trustworthy sample is retained at ${reading.observedAt}. Current utilization is unknown.` : response.resolved ? 'Current observations, source clearance, and the required stability window support the outcome.' : incidentOpened ? 'The earlier trend and source evidence remain attached to the same incident.' : 'Each new source observation extends this view. No forecast is implied.'}</p></div><hbr-button variant="text" size="small" onClick={() => incidentOpened ? onOpen?.('interface') : onInspect?.({kind:'interface',id:model.scope.interfaceId})}>{incidentOpened ? 'Follow incident' : 'Inspect current source'}</hbr-button></div>
  </OperationsSection>;
}
