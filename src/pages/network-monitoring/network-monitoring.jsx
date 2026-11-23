import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IncidentList } from '../../features/wan/ProductSections.jsx';
import AdminWorkspace from '../../features/wan/admin/AdminWorkspace.jsx';
import { useAppearance } from '../../theme/appearance-context.jsx';
import WanOverview from '../../features/wan/WanOverview.jsx';
import AgentWorkspace from '../../features/wan/AgentWorkspace.jsx';
import NetworkWatch, { WatchPulse } from '../../features/wan/NetworkWatch.jsx';
import { networkWatch } from '../../features/wan/watch-model.js';
import OperationsDashboard from '../../features/wan/operations/OperationsDashboard.jsx';
import EvidenceModal from '../../features/wan/EvidenceModal.jsx';
import ExperienceOverview from '../../features/wan/overview/ExperienceOverview.jsx';
import WorkforceDashboard from '../../features/workforce/WorkforceDashboard.jsx';
import { WORKFORCE_SCENES } from '../../features/workforce/workforce-model.js';
import PreviousWorkforce from '../../features/workforce-history/PreviousWorkforce.jsx';
import CombinedDashboard from '../../features/combined/CombinedDashboard.jsx';
import CombinedBaseline from '../../features/combined-baseline/CombinedDashboard.jsx';
import CombinedExperienceOverview from '../../features/combined/overview/CombinedExperienceOverview.jsx';
import { COMBINED_SCENES, COMBINED_VARIANTS, getCombinedSnapshot } from '../../features/combined/combined-model.js';
import { EXPLORATION_OPTIONS, explorationLabel, getExplorationOption } from '../../features/explorations/options.js';
import { FRAMES, currentFrame, reduce } from '../../features/wan/model/model.js';
import { createAgentState, enterAgentFrame, syncAgentResponse, reduceAgent, agentFrameTitle } from '../../features/wan/model/agentic-model.js';
import { WAN_SETUPS, ACTIVE_WAN, MONITORING_CONTEXT, setActiveWanSetup, domainLabel, groupLabel, navigateScope } from '../../features/wan/model/scale.js';
import './network-monitoring.css';

const inputValue = e => e.currentTarget?.value ?? e.target?.value ?? '';
const context = () => ({ ...MONITORING_CONTEXT, mainDomainLabel: domainLabel(MONITORING_CONTEXT.mainDomain), mainGroupLabel: groupLabel(MONITORING_CONTEXT.mainGroup), criticalDomainLabel: domainLabel(MONITORING_CONTEXT.criticalDomain), transitDomainLabel: domainLabel(MONITORING_CONTEXT.transitDomain) });
const initial = () => createAgentState({networkContext:context(), match:'no-match', interfacePage:0, groupConnectionsPage:0});

function ReviewModal({state, onClose, onFrame, onSource, onPlay}) {
  return <hbr-modal open label="Review autonomous response" size="medium" onhbr-after-hide={e=>{if(e.target===e.currentTarget)onClose();}}>
    <hbr-layout direction="column" gap="lg">
      <hbr-text type="secondary" size="sm">Concept review · Simulated sources and agent responses. Review choices pause the source story.</hbr-text>
      <hbr-select label="Source observation" value={String(state.frame)} onhbr-change={e=>onFrame(Number(inputValue(e)),false)}>{FRAMES.map(f=><hbr-option key={f.index} value={String(f.index)}>{f.time} · {agentFrameTitle(f.index)}</hbr-option>)}</hbr-select>
      <hbr-select label="Response context" value={state.match} onhbr-change={e=>onSource({type:'MATCH',value:inputValue(e)})}>
        <hbr-option value="available">Validated procedure available</hbr-option><hbr-option value="no-match">No playbook · Construct a response</hbr-option><hbr-option value="unavailable">Catalogue unavailable · Use network evidence</hbr-option><hbr-option value="restricted">Change outside permitted scope</hbr-option><hbr-option value="precheck">Target held by another job</hbr-option>
      </hbr-select>
      <hbr-select label="Telemetry collection" value={state.gap} onhbr-change={e=>onSource({type:'GAP',value:inputValue(e)})}>
        <hbr-option value="none">All sources current</hbr-option><hbr-option value="west">{domainLabel(MONITORING_CONTEXT.mainDomain)} interface metrics unavailable</hbr-option><hbr-option value="east">{domainLabel(MONITORING_CONTEXT.criticalDomain)} device telemetry unavailable</hbr-option>
      </hbr-select>
      <hbr-select label="Controller job result" value={state.runOutcome} onhbr-change={e=>onSource({type:'JOB_OUTCOME',value:inputValue(e)})}><hbr-option value="completed">Confirmed completion</hbr-option><hbr-option value="failed">Failed execution</hbr-option><hbr-option value="unknown">Result unconfirmed</hbr-option></hbr-select>
      <hbr-select label="Agent recovery evidence" value={state.reconciliation || 'pending'} onhbr-change={e=>onSource({type:'RECONCILIATION',value:inputValue(e)})}><hbr-option value="pending">Reconciliation still pending</hbr-option><hbr-option value="verified-retry">Recorded reconciliation and successful revised response</hbr-option></hbr-select>
      <hbr-switch checked={state.critical} onhbr-change={e=>onSource({type:'CRITICAL',value:e.target.checked})}>Independent Critical router alarm</hbr-switch>
      <hbr-switch checked={state.related} onhbr-change={e=>onSource({type:'RELATED',value:e.target.checked})}>Two related Minor interface alarms</hbr-switch>
      <hbr-switch checked={Boolean(state.unclassifiedEvent)} onhbr-change={e=>onSource({type:'UNCLASSIFIED',value:e.target.checked})}>Additional event under correlation</hbr-switch>
    </hbr-layout>
    <hbr-layout slot="footer" direction="row" gap="md"><hbr-button variant="text" onClick={onClose}>Close</hbr-button><hbr-button onClick={onPlay} disabled={state.frame===11}>Play from here</hbr-button></hbr-layout>
  </hbr-modal>;
}

export default function NetworkMonitoring() {
  const { setMode, setPreset } = useAppearance();
  const { section } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = section === 'admin' || section === 'incidents' ? section : 'home';
  const requestedExploration = searchParams.get('exploration') === 'combined' && searchParams.get('layout') === 'baseline' ? 'combined-baseline' : searchParams.get('exploration');
  const exploration = view === 'home' && EXPLORATION_OPTIONS.some(option => option.id === requestedExploration) ? requestedExploration : 'network';
  const activeOption = getExplorationOption(exploration);
  const isAlternative = exploration !== 'network';
  const isCombined = exploration === 'combined' || exploration === 'combined-baseline';
  const [workforceScene, setWorkforceScene] = useState(2);
  const [workforcePlaying, setWorkforcePlaying] = useState(false);
  const [combinedScene, setCombinedScene] = useState(2);
  const [combinedVariant, setCombinedVariant] = useState('main');
  const [combinedPlaying, setCombinedPlaying] = useState(false);
  const [combinedProposalVersion, setCombinedProposalVersion] = useState(1);
  const [combinedRevisionNote, setCombinedRevisionNote] = useState('');
  const combinedSnapshot = getCombinedSnapshot(combinedScene, combinedVariant, { proposalVersion: combinedProposalVersion });
  const [setup, setSetup] = useState(ACTIVE_WAN.id);
  const [state, setState] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [spotlight, setSpotlight] = useState(null);
  const sessions = useRef(new Map()), workspaceRef = useRef(null);
  const overviewTriggerRef = useRef(null), resumePreviewRef = useRef(false), previousDialogRef = useRef(null);

  useEffect(() => {
    if (['overview', 'combined-overview'].includes(previousDialogRef.current) && dialog !== previousDialogRef.current) overviewTriggerRef.current?.setFocus();
    previousDialogRef.current = dialog;
  }, [dialog]);

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
  useEffect(() => {
    if (!workforcePlaying || exploration !== 'workforce' || workforceScene >= WORKFORCE_SCENES.length - 1) return;
    const timer = setTimeout(() => setWorkforceScene(scene => scene + 1), 6200);
    return () => clearTimeout(timer);
  }, [workforcePlaying, workforceScene, exploration]);
  useEffect(() => { if (workforceScene === WORKFORCE_SCENES.length - 1) setWorkforcePlaying(false); }, [workforceScene]);
  // Preview playback supplies deterministic source snapshots; it never calls a controller.
  useEffect(() => {
    if (!combinedPlaying || !isCombined || combinedVariant !== 'main' || combinedScene >= COMBINED_SCENES.length - 1) return;
    const delay = combinedScene === 3 ? 1800 : combinedScene === 4 ? 2800 : combinedScene >= 5 ? 4200 : 6200;
    const timer = setTimeout(() => setCombinedScene(scene => scene + 1), delay);
    return () => clearTimeout(timer);
  }, [combinedPlaying, combinedScene, combinedVariant, isCombined]);
  useEffect(() => { if (combinedScene === COMBINED_SCENES.length - 1) setCombinedPlaying(false); }, [combinedScene]);
  useEffect(() => {
    if (combinedVariant !== 'revision' || !isCombined) return;
    const timer = setTimeout(() => { setCombinedProposalVersion(version => version + 1); setCombinedVariant('changed'); }, 2800);
    return () => clearTimeout(timer);
  }, [combinedVariant, isCombined]);

  const switchExploration = next => {
    if (!EXPLORATION_OPTIONS.some(option => option.id === next)) return;
    setPlaying(false); setWorkforcePlaying(false); setCombinedPlaying(false); setDialog(null); setEvidence(null);
    navigate(getExplorationOption(next).path);
  };
  const changeWorkforceScene = next => { setWorkforcePlaying(false); setWorkforceScene(Math.max(0, Math.min(WORKFORCE_SCENES.length - 1, next))); };
  const changeCombinedScene = next => { setCombinedPlaying(false); setCombinedVariant('main'); setCombinedScene(Math.max(0, Math.min(COMBINED_SCENES.length - 1, next))); };
  const changeCombinedVariant = id => {
    const variant = COMBINED_VARIANTS.find(item => item.id === id);
    if (!variant) return;
    setCombinedPlaying(false); setCombinedVariant(id); setCombinedProposalVersion(id === 'changed' ? 2 : 1); setCombinedRevisionNote('');
    if (variant.scene !== undefined) setCombinedScene(variant.scene);
  };

  const sourceAction = action => setState(s => syncAgentResponse(action.type === 'JOB_OUTCOME' ? { ...s, runOutcome: action.value } : action.type === 'RECONCILIATION' ? { ...s, reconciliation: action.value } : action.type === 'UNCLASSIFIED' ? { ...s, unclassifiedEvent: action.value } : reduce(s, action)));
  const openResponse = id => {
    if (view === 'admin') navigate('/network-monitoring/incidents');
    setState(s => reduceAgent({ ...s, history: null, liveContext: null }, { type: 'AGENT_OPEN', incident: id }));
  };
  const agentAction = action => {
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
  const CombinedView = exploration === 'combined-baseline' ? CombinedBaseline : CombinedDashboard;

  return <div className="wan-page" data-exploration={exploration} data-iteration-cue={activeOption.cue}>
    {isAlternative ? <>
      <div hidden={exploration !== 'workforce'}><WorkforceDashboard scene={workforceScene}/></div>
      <div hidden={exploration !== 'workforce-original'}><PreviousWorkforce/></div>
      {isCombined && <CombinedView key={exploration} scene={combinedScene} variant={combinedVariant} proposalVersion={combinedProposalVersion} revisionNote={combinedRevisionNote}
        onAuthorize={() => { setCombinedVariant('main'); setCombinedScene(3); setCombinedPlaying(true); }}
        onHold={() => { setCombinedPlaying(false); setCombinedVariant('held'); setCombinedScene(2); }}
        onRevision={note => { setCombinedPlaying(false); setCombinedRevisionNote(note); setCombinedVariant('revision'); setCombinedScene(2); }}
        onRecheck={() => { setCombinedPlaying(false); setCombinedVariant('main'); setCombinedScene(2); }}/>}
    </> : <>
    <header className="wan-page-heading">
      <hbr-text variant="page-title">{view === 'home' ? 'Crosswork AI' : view === 'admin' ? 'Admin' : 'Incidents'}</hbr-text>
    </header>
    {view !== 'admin' && <WatchPulse watch={watch} onOpen={openResponse}/>}
    <div ref={workspaceRef} className={`wan-workspace-grid ${showAgent ? 'response-open' : view !== 'home' ? 'section-only' : ''} ${watch.incidents.length ? 'has-attention' : ''}`}>
      <div className="wan-monitoring-main">
        {view === 'home' ? <>
          <WanOverview state={state} spotlight={spotlight} onNavigate={(kind, value) => setState(s => navigateScope(s, kind, value))} onInspect={setEvidence} onConnection={selection => setEvidence({ kind: 'connections', level: selection.kind, id: selection.id })} onPatch={patch => setState(s => ({ ...s, ...patch }))} onOpenResponse={openResponse}/>
        </> : view === 'admin' ? <AdminWorkspace state={state} onInspect={setEvidence} onOpen={openResponse}/> : <IncidentList watch={watch} onOpen={openResponse} onInspect={setEvidence}/>}
      </div>
      {showAgent ? <AgentWorkspace state={state} onAction={agentAction} onInspect={setEvidence} onClose={() => agentAction({ type: 'AGENT_CLOSE' })}/> : view === 'home' ? <NetworkWatch state={{ ...state, history: null }} watch={watch} spotlight={spotlight} onLocate={id => { setSpotlight(previous => previous === id ? null : id); setState(s => navigateScope(s, 'network')); }} onOpen={openResponse} onInspect={setEvidence}/> : null}
    </div>
    {view === 'home' && <OperationsDashboard key={setup} state={state} onOpen={openResponse} onInspect={setEvidence} onAction={agentAction}/>}
    </>}
    {createPortal(reviewVisible ? <div className="wan-review-controller" aria-label={`Preview controls. Viewing ${explorationLabel(activeOption)}`} data-preview-controls="true" data-iteration-cue={activeOption.cue} aria-hidden={dialog === 'overview' || dialog === 'combined-overview' ? 'true' : undefined}>
      <hbr-dropdown hoist menu placement="top-start" distance="12" className="wan-exploration-switch">
        <hbr-button slot="trigger" size="small" variant="outline" caret aria-label="Switch exploration">{explorationLabel(activeOption)}</hbr-button>
        <hbr-menu onhbr-select={event => switchExploration(event.detail?.item?.value)}>
          {EXPLORATION_OPTIONS.filter(option => !option.archived).map(option => <hbr-menu-item key={option.id} value={option.id}>{explorationLabel(option)}</hbr-menu-item>)}
          <hbr-menu-divider/>{EXPLORATION_OPTIONS.filter(option => option.archived).map(option => <hbr-menu-item key={option.id} value={option.id}>{explorationLabel(option)}</hbr-menu-item>)}
        </hbr-menu>
      </hbr-dropdown>
      {isAlternative ? <>
        {exploration === 'combined' && <hbr-button ref={overviewTriggerRef} className="wan-overview-launch" size="small" variant="outline" onClick={() => { resumePreviewRef.current = combinedPlaying; setCombinedPlaying(false); setDialog('combined-overview'); }}><hbr-icon name="eye" slot="prefix"/>Experience overview</hbr-button>}
        {isCombined && <>
          <span className="wan-review-label">Simulated</span>
          <hbr-dropdown hoist menu placement="top-start" distance="12"><hbr-button slot="trigger" size="small" variant="text" caret aria-label="Choose combined story state">{COMBINED_SCENES[combinedSnapshot.scene]?.shortTitle}</hbr-button><hbr-menu onhbr-select={event => changeCombinedScene(Number(event.detail?.item?.value))}>{COMBINED_SCENES.map(scene => <hbr-menu-item key={scene.id} value={String(scene.id)}>{scene.shortTitle}</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
          <hbr-dropdown hoist menu placement="top-start" distance="12"><hbr-button slot="trigger" size="small" variant="text" caret aria-label="Choose combined scenario">{COMBINED_VARIANTS.find(item => item.id === combinedVariant)?.label}</hbr-button><hbr-menu onhbr-select={event => changeCombinedVariant(event.detail?.item?.value)}>{COMBINED_VARIANTS.map(variant => <hbr-menu-item key={variant.id} value={variant.id}>{variant.label}</hbr-menu-item>)}</hbr-menu></hbr-dropdown>
        </>}
        {exploration === 'workforce' && <hbr-dropdown hoist menu placement="top-start" distance="12">
          <hbr-button slot="trigger" size="small" variant="text" caret aria-label="Choose workforce story state">{WORKFORCE_SCENES[workforceScene]?.shortTitle || WORKFORCE_SCENES[workforceScene]?.title}</hbr-button>
          <hbr-menu onhbr-select={event => changeWorkforceScene(Number(event.detail?.item?.value))}>{WORKFORCE_SCENES.map((scene, index) => <hbr-menu-item key={scene.id ?? index} value={String(index)}>{scene.shortTitle}</hbr-menu-item>)}</hbr-menu>
        </hbr-dropdown>}
        <div className="wan-review-transport workforce-preview-transport">
          {isCombined && <>
            <hbr-button variant="text" size="small" disabled={combinedSnapshot.scene === 0} onClick={() => changeCombinedScene(combinedSnapshot.scene - 1)} aria-label="Previous combined state">Prev</hbr-button>
            <hbr-button variant="text" size="small" disabled={combinedSnapshot.scene === COMBINED_SCENES.length - 1 || combinedVariant !== 'main'} onClick={() => setCombinedPlaying(value => !value)}>{combinedPlaying ? 'Pause' : 'Play'}</hbr-button>
            <hbr-button variant="text" size="small" disabled={combinedSnapshot.scene === COMBINED_SCENES.length - 1} onClick={() => changeCombinedScene(combinedSnapshot.scene + 1)} aria-label="Next combined state">Next</hbr-button>
          </>}
          {exploration === 'workforce' && <>
            <hbr-button variant="text" size="small" disabled={workforceScene === 0} onClick={() => changeWorkforceScene(workforceScene - 1)} aria-label="Previous workforce state">Prev</hbr-button>
            <hbr-button variant="text" size="small" disabled={workforceScene === WORKFORCE_SCENES.length - 1} onClick={() => setWorkforcePlaying(value => !value)}>{workforcePlaying ? 'Pause' : 'Play'}</hbr-button>
            <hbr-button variant="text" size="small" disabled={workforceScene === WORKFORCE_SCENES.length - 1} onClick={() => changeWorkforceScene(workforceScene + 1)} aria-label="Next workforce state">Next</hbr-button>
          </>}
          <hbr-button variant="text" size="small" onClick={() => setReviewVisible(false)}>Hide</hbr-button>
        </div>
      </> : <>
      <div className="wan-preview-selector"><span className="wan-review-label">Preview</span><hbr-select label="WAN setup" size="small" value={setup} onhbr-change={e => switchSetup(inputValue(e))}>{WAN_SETUPS.map(wan => <hbr-option key={wan.id} value={wan.id}>{wan.label}</hbr-option>)}</hbr-select></div>
      <hbr-button ref={overviewTriggerRef} className="wan-overview-launch" size="small" variant="outline" onClick={() => { resumePreviewRef.current = playing; setPlaying(false); setDialog('overview'); }}><hbr-icon name="eye" slot="prefix"/>Experience overview</hbr-button>
      <div className="wan-review-transport">
        <hbr-button variant="text" size="small" disabled={state.frame === 0} onClick={() => frameChange(state.frame - 1)} aria-label="Previous observation">Prev</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => { setPlaying(false); setDialog('review'); }}>{frame.time}</hbr-button>
        <hbr-button variant="text" size="small" disabled={state.frame === 11} onClick={() => setPlaying(p => !p)}>{playing ? 'Pause' : 'Play'}</hbr-button>
        <hbr-button variant="text" size="small" disabled={state.frame === 11} onClick={() => frameChange(state.frame + 1)}>Next</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => setReviewVisible(false)}>Hide</hbr-button>
      </div>
      </>}
    </div> : <hbr-button className="wan-review-reopen" size="small" variant="outline" aria-label={`Open preview controls. Viewing ${explorationLabel(activeOption)}`} onClick={() => setReviewVisible(true)}>Preview · {activeOption.shortLabel || explorationLabel(activeOption)}</hbr-button>, document.body)}
    <EvidenceModal state={state} selection={evidence} onClose={() => setEvidence(null)} onInspect={setEvidence}/>
    {dialog === 'overview' && <ExperienceOverview onClose={() => { setDialog(null); setPlaying(resumePreviewRef.current); }}/>}
    {dialog === 'combined-overview' && <CombinedExperienceOverview onClose={() => { setDialog(null); setCombinedPlaying(resumePreviewRef.current); }}/>}
    {dialog === 'review' && <ReviewModal state={state} onClose={() => setDialog(null)} onFrame={frameChange} onSource={sourceAction} onPlay={() => { setState(s => ({ ...s, history: null })); setPlaying(true); setDialog(null); }}/>}
  </div>;
}
