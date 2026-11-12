import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSummary, IncidentList } from '../../features/wan/ProductSections.jsx';
import { useAppearance } from '../../theme/appearance-context.jsx';
import WanOverview from '../../features/wan/WanOverview.jsx';
import AgentWorkspace from '../../features/wan/AgentWorkspace.jsx';
import NetworkWatch, { WatchPulse } from '../../features/wan/NetworkWatch.jsx';
import { networkWatch } from '../../features/wan/watch-model.js';
import OperationsDashboard from '../../features/wan/operations/OperationsDashboard.jsx';
import EvidenceModal from '../../features/wan/EvidenceModal.jsx';
import { FRAMES, MATCHES, INTERFACE, currentFrame, activeAlarms, reduce } from '../../features/wan/model/model.js';
import { createAgentState, enterAgentFrame, syncAgentResponse, reduceAgent, agentResponse, agentFrameTitle } from '../../features/wan/model/agentic-model.js';
import { WAN_SETUPS, ACTIVE_WAN, MONITORING_CONTEXT, setActiveWanSetup, domainLabel, groupLabel, navigateScope } from '../../features/wan/model/scale.js';
import './network-monitoring.css';

const inputValue = e => e.currentTarget?.value ?? e.target?.value ?? '';
const context = () => ({ ...MONITORING_CONTEXT, mainDomainLabel: domainLabel(MONITORING_CONTEXT.mainDomain), mainGroupLabel: groupLabel(MONITORING_CONTEXT.mainGroup), criticalDomainLabel: domainLabel(MONITORING_CONTEXT.criticalDomain), transitDomainLabel: domainLabel(MONITORING_CONTEXT.transitDomain) });
const initial = () => createAgentState({networkContext:context(), interfacePage:0, groupConnectionsPage:0});

function StatusTag({ sentiment='info', children }) {
  return <hbr-tag status size="small" sentiment={sentiment}>{children}</hbr-tag>;
}
function SourceAlarms({state, onInspect, onOpen}) {
  const alarms=activeAlarms(state);
  return <hbr-accordion summary={`Source alarms · ${alarms.length} active`} className="wan-alarm-card">
    {alarms.length ? <div className="wan-alarm-list">{alarms.map(alarm=><div className="wan-alarm-row" key={alarm.id}>
      <StatusTag sentiment={alarm.severity==='Critical'?'negative':alarm.severity==='Major'?'warning':'low-warning'}>{alarm.severity}</StatusTag>
      <div className="wan-alarm-description"><hbr-button variant="text" size="small" onClick={()=>onInspect(alarm.id==='CNC-2086'?{kind:'device',id:alarm.object}:{kind:'interface',id:alarm.id==='CNC-1044'?'XR-P2:HundredGigE0/0/0/1':`XR-P1:${INTERFACE}`})}>{alarm.title}</hbr-button><hbr-text type="secondary" size="xs">{alarm.target} · {alarm.id} · {alarm.detected}</hbr-text></div>
      <hbr-text type="secondary" size="xs">CW AI · Acknowledged {alarm.ack?.time}</hbr-text>
      <hbr-button variant="text" size="small" onClick={()=>onOpen(alarm.id==='CNC-2086'?'device':'interface')}>Response</hbr-button>
    </div>)}</div> : <div className="wan-alarm-empty"><hbr-icon name="status-positive" sentiment="positive" /><hbr-text type="secondary" size="sm">{state.frame===11?'The source cleared CNC-1042 at 08:30. The response record is retained.':'No active alarms in the current source snapshot.'}</hbr-text></div>}
  </hbr-accordion>;
}

function ReviewModal({state, onClose, onFrame, onSource, onAgent, onPlay}) {
  const r=agentResponse(state,state.agentic.selected);
  return <hbr-modal open label="Review autonomous response" size="medium" onhbr-after-hide={e=>{if(e.target===e.currentTarget)onClose();}}>
    <hbr-layout direction="column" gap="lg">
      <hbr-text type="secondary" size="sm">Concept review · Simulated sources and agent responses. Review choices pause the source story.</hbr-text>
      <hbr-select label="Source observation" value={String(state.frame)} onhbr-change={e=>onFrame(Number(inputValue(e)),false)}>{FRAMES.map(f=><hbr-option key={f.index} value={String(f.index)}>{f.time} · {agentFrameTitle(f.index)}</hbr-option>)}</hbr-select>
      <hbr-select label="Response authority" value={state.match} onhbr-change={e=>onSource({type:'MATCH',value:inputValue(e)})}>{Object.entries(MATCHES).map(([key,m])=><hbr-option key={key} value={key}>{key==='available'?'Autonomous response permitted':m.title}</hbr-option>)}</hbr-select>
      <hbr-select label="Telemetry collection" value={state.gap} onhbr-change={e=>onSource({type:'GAP',value:inputValue(e)})}>
        <hbr-option value="none">All sources current</hbr-option><hbr-option value="west">{domainLabel(MONITORING_CONTEXT.mainDomain)} interface metrics unavailable</hbr-option><hbr-option value="east">{domainLabel(MONITORING_CONTEXT.criticalDomain)} device telemetry unavailable</hbr-option>
      </hbr-select>
      <hbr-select label="Controller job result" value={state.runOutcome} onhbr-change={e=>onSource({type:'JOB_OUTCOME',value:inputValue(e)})}><hbr-option value="completed">Confirmed completion</hbr-option><hbr-option value="failed">Failed execution</hbr-option><hbr-option value="unknown">Result unconfirmed</hbr-option></hbr-select>
      <hbr-switch checked={state.critical} onhbr-change={e=>onSource({type:'CRITICAL',value:e.target.checked})}>Independent Critical router alarm</hbr-switch>
      <hbr-switch checked={state.related} onhbr-change={e=>onSource({type:'RELATED',value:e.target.checked})}>Two related Minor interface alarms</hbr-switch>
      <hbr-button variant="text" disabled={r.handoff?.status!=='sent'} onClick={()=>onAgent({type:'AGENT_ACCEPT'})}>Simulate engineering acceptance</hbr-button>
    </hbr-layout>
    <hbr-layout slot="footer" direction="row" gap="md"><hbr-button variant="text" onClick={onClose}>Close</hbr-button><hbr-button onClick={onPlay} disabled={state.frame===11}>Play from here</hbr-button></hbr-layout>
  </hbr-modal>;
}

export default function NetworkMonitoring() {
  const { setMode, setPreset } = useAppearance();
  const { section } = useParams();
  const navigate = useNavigate();
  const view = section === 'admin' || section === 'incidents' ? section : 'home';
  const [setup, setSetup] = useState(ACTIVE_WAN.id);
  const [state, setState] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [spotlight, setSpotlight] = useState(null);
  const sessions = useRef(new Map()), workspaceRef = useRef(null);

  useEffect(() => { const previous = document.title; document.title = 'Crosswork AI'; return () => { document.title = previous; }; }, []);
  useEffect(() => {
    if (state.agentic.open) workspaceRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [state.agentic.open]);
  useEffect(() => { setPreset('onecd'); }, [setPreset]);
  useEffect(() => { setMode('dark'); document.body.classList.add('wan-monitoring-route'); return () => document.body.classList.remove('wan-monitoring-route'); }, [setMode]);
  useEffect(() => {
    if (!playing || state.history !== null || state.frame >= 11) return;
    const timer = setTimeout(() => setState(previous => enterAgentFrame(previous, previous.frame + 1)), 6200);
    return () => clearTimeout(timer);
  }, [playing, state.frame, state.history, setup]);
  useEffect(() => { if (state.frame === 11) setPlaying(false); }, [state.frame]);

  const sourceAction = action => setState(s => syncAgentResponse(action.type === 'JOB_OUTCOME' ? { ...s, runOutcome: action.value } : reduce(s, action)));
  const openResponse = id => {
    if (view === 'admin') navigate('/network-monitoring/incidents');
    setState(s => reduceAgent({ ...s, history: null, liveContext: null }, { type: 'AGENT_OPEN', incident: id }));
  };
  const agentAction = action => {
    if (action.type === 'SHOW_HANDOFF') { setDelivered(agentResponse(state, action.incident || state.agentic.selected).handoff); setDialog('delivered'); return; }
    if (action.type === 'AGENT_OPEN' || action.type === 'AGENT_SELECT') { openResponse(action.incident || action.id || state.agentic.selected); return; }
    setState(s => reduceAgent(s, action));
  };
  const frameChange = (frame, auto = false) => { setState(s => enterAgentFrame(s, frame)); setPlaying(auto && frame >= 2 && frame < 11); };
  const switchSetup = id => {
    if (id === setup) return;
    sessions.current.set(setup, { state, playing });
    setActiveWanSetup(id);
    const saved = sessions.current.get(id);
    setSetup(ACTIVE_WAN.id); setState(saved ? { ...saved.state, networkContext: context() } : initial());
    setPlaying(saved?.playing || false); setEvidence(null); setDialog(null); setSpotlight(null);
  };
  const frame = currentFrame(state), watch = networkWatch(state);
  const showAgent = view !== 'admin' && state.agentic.open;

  return <div className="wan-page">
    <header className="wan-page-heading">
      <hbr-text variant="page-title">{view === 'home' ? 'Crosswork AI' : view === 'admin' ? 'Admin' : 'Incidents'}</hbr-text>
    </header>
    <WatchPulse watch={watch} onOpen={openResponse}/>
    <div ref={workspaceRef} className={`wan-workspace-grid ${showAgent ? 'response-open' : view !== 'home' ? 'section-only' : ''} ${watch.incidents.length ? 'has-attention' : ''}`}>
      <div className="wan-monitoring-main">
        {view === 'home' ? <>
          <WanOverview state={state} spotlight={spotlight} onNavigate={(kind, value) => setState(s => navigateScope(s, kind, value))} onInspect={setEvidence} onConnection={selection => setEvidence({ kind: 'connections', level: selection.kind, id: selection.id })} onPatch={patch => setState(s => ({ ...s, ...patch }))} onOpenResponse={openResponse}/>
          <SourceAlarms state={state} onInspect={setEvidence} onOpen={openResponse}/>
        </> : view === 'admin' ? <AdminSummary state={state}/> : <IncidentList watch={watch} onOpen={openResponse} onInspect={setEvidence}/>}
      </div>
      {showAgent ? <AgentWorkspace state={state} onAction={agentAction} onInspect={setEvidence} onClose={() => agentAction({ type: 'AGENT_CLOSE' })}/> : view === 'home' ? <NetworkWatch state={{ ...state, history: null }} watch={watch} spotlight={spotlight} onLocate={id => { setSpotlight(previous => previous === id ? null : id); setState(s => navigateScope(s, 'network')); }} onOpen={openResponse} onInspect={setEvidence}/> : null}
    </div>
    {view === 'home' && <OperationsDashboard key={setup} state={state} onOpen={openResponse} onInspect={setEvidence} onAction={agentAction}/>}
    {createPortal(reviewVisible ? <div className="wan-review-controller" aria-label="Preview controls" data-preview-controls="true">
      <div className="wan-preview-selector"><span className="wan-review-label">Preview</span><hbr-select label="WAN setup" size="small" value={setup} onhbr-change={e => switchSetup(inputValue(e))}>{WAN_SETUPS.map(wan => <hbr-option key={wan.id} value={wan.id}>{wan.label}</hbr-option>)}</hbr-select></div>
      <div className="wan-review-transport">
        <hbr-button variant="text" size="small" disabled={state.frame === 0} onClick={() => frameChange(state.frame - 1)} aria-label="Previous observation">Prev</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => { setPlaying(false); setDialog('review'); }}>{frame.time}</hbr-button>
        <hbr-button variant="text" size="small" disabled={state.frame === 11} onClick={() => setPlaying(p => !p)}>{playing ? 'Pause' : 'Play'}</hbr-button>
        <hbr-button variant="text" size="small" disabled={state.frame === 11} onClick={() => frameChange(state.frame + 1)}>Next</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => setReviewVisible(false)}>Hide</hbr-button>
      </div>
    </div> : <hbr-button className="wan-review-reopen" size="small" variant="outline" onClick={() => setReviewVisible(true)}>Preview</hbr-button>, document.body)}
    <EvidenceModal state={state} selection={evidence} onClose={() => setEvidence(null)} onInspect={setEvidence}/>
    {dialog === 'review' && <ReviewModal state={state} onClose={() => setDialog(null)} onFrame={frameChange} onSource={sourceAction} onAgent={agentAction} onPlay={() => { setState(s => ({ ...s, history: null })); setPlaying(true); setDialog(null); }}/>}
    {dialog==='delivered'&&delivered&&<hbr-modal open label="Delivered engineering handoff" size="medium" onhbr-after-hide={e=>{if(e.target===e.currentTarget)setDialog(null);}}><hbr-layout direction="column" gap="lg"><StatusTag sentiment="info">Delivered by {delivered.actor} · {delivered.sent}</StatusTag><hbr-text>{delivered.route} · {delivered.status==='accepted'?`Accepted by ${delivered.acceptedBy} at ${delivered.accepted}`:'Acceptance pending'}</hbr-text><hbr-key-value-pairs><dl><dt>Delivered scope</dt><dd>{delivered.snapshot.scope}</dd><dt>Reason</dt><dd>{delivered.snapshot.reason.title}</dd><dt>Source observation</dt><dd>{delivered.snapshot.observedAt}</dd><dt>Source alarm</dt><dd>{delivered.snapshot.alarm||'Not applicable'}</dd><dt>Controller result at delivery</dt><dd>{delivered.snapshot.jobStatus}</dd><dt>Operator context at delivery</dt><dd>{delivered.snapshot.notes||'No additional context.'}</dd></dl></hbr-key-value-pairs><hbr-text type="secondary" size="sm">This is the context captured at delivery. Subsequent observations are retained in the current response.</hbr-text></hbr-layout><hbr-button slot="footer" variant="outline" onClick={()=>setDialog(null)}>Close</hbr-button></hbr-modal>}
  </div>;
}
