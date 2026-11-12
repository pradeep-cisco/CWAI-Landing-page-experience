// Conceptual autonomous response over deterministic controller snapshots.
// These records simulate sources and agent roles; no operation reaches a WAN.
import {createState, gotoFrame, observations, currentFrame, MAIN_ALARM, CRITICAL_ALARM, INTERFACE, TARGET, verificationCriteria, alarmCounts} from './model.js';

const TITLES = ['Take the autonomous watch','Check a developing trend','CW AI takes ownership','Investigate the interface','Correlate the evidence','Validate the response','Prepare autonomous remediation','Execute the response','Continue the wider watch','Follow actual execution','Verify the network outcome','Recovery verified'];
const OWNERS = {interface:'CW AI',device:'CW AI',monitoring:'CW AI'};
const initialAgentic = () => ({enabled:true,open:false,pinned:false,selected:'interface',paused:false,override:'',notes:{},messages:[],draft:'',drafts:{},handoffs:{},seen:{},deviceRecord:null,monitoringRecord:null,runtime:{jobStarted:false,jobStartedAt:null,deferredAt:null},events:[]});
const metadata = state => ({main:state.networkContext?.mainDomainLabel || state.networkContext?.mainDomain || 'West',critical:state.networkContext?.criticalDomainLabel || state.networkContext?.criticalDomain || 'East',mainGroup:state.networkContext?.mainGroupLabel || state.networkContext?.mainGroup || 'WEST-01'});
const normalize = state => ({...initialAgentic(),...state.agentic,notes:{...state.agentic?.notes},drafts:{...state.agentic?.drafts},seen:{...state.agentic?.seen},deviceRecord:state.agentic?.deviceRecord?{...state.agentic.deviceRecord}:null,monitoringRecord:state.agentic?.monitoringRecord?{...state.agentic.monitoringRecord}:null,messages:[...(state.agentic?.messages || [])],handoffs:{...state.agentic?.handoffs},runtime:{jobStarted:false,jobStartedAt:null,deferredAt:null,...state.agentic?.runtime},events:[...(state.agentic?.events || [])]});
const context = state => ({...state,agentic:normalize(state)});
const current = state => state.history === null || state.history === undefined;
const now = state => currentFrame(state).time;
const procedureAvailable = state => state.match === 'available';
const executionAllowed = state => state.frame >= 7 && procedureAvailable(state) && observations(state).fresh && !state.agentic.paused && !state.agentic.handoffs.interface && (state.agentic.runtime.deferredAt===null || (state.frame===state.agentic.runtime.deferredAt && state.frame<10));
const event = (time,agent,title,detail) => ({time,agent,title,detail});

export function agentFrameTitle(index) {return TITLES[Math.max(0,Math.min(TITLES.length-1,Number(index)||0))];}
export function createAgentState(overrides={}) {
  return syncAgentResponse({...createState(),match:'available',runOutcome:'completed',...overrides,agentic:{...initialAgentic(),...overrides.agentic}});
}

// Review snapshots retain scope and drafts; selecting an earlier recorded source
// deliberately clears future execution/handoff facts rather than importing them.
export function enterAgentFrame(state,index) {
  const source=gotoFrame(state,index),backwards=source.frame<state.frame;
  const keep=['selection','panel','view','domain','popId','groupId','scopePage','groupConnectionsPage','returnView','interfacePage','notes','networkContext','highlightPolicy'];
  const next={...source,agentic:normalize(state),escalation:{status:'none'},acknowledgements:{},ackPending:null,playbook:{status:'none',step:0},verified:false,events:[]};
  for(const key of keep)if(key in state)next[key]=state[key];
  if(backwards){next.agentic.runtime={jobStarted:false,jobStartedAt:null};next.agentic.handoffs={};next.agentic.events=[];next.agentic.seen={};next.agentic.deviceRecord=null;next.agentic.monitoringRecord=null;}
  return syncAgentResponse(next);
}

export function syncAgentResponse(input) {
  const state=context(input),a=state.agentic;
  if(current(state)){
    if(state.critical){const sameCondition=a.deviceRecord&&!a.deviceRecord.clearedAt;a.seen.device=true;a.deviceRecord={startedAt:sameCondition?a.deviceRecord.startedAt:state.criticalDetected||now(state),clearedAt:null};}
    else if(a.deviceRecord&&!a.deviceRecord.clearedAt)a.deviceRecord={...a.deviceRecord,clearedAt:now(state)};
    if(state.gap!=='none'){
      const labels=metadata(state),main=state.gap==='west';a.seen.monitoring=true;
      const sameGap=a.monitoringRecord?.gap===state.gap&&!a.monitoringRecord?.restoredAt;
      a.monitoringRecord={startedAt:sameGap?a.monitoringRecord.startedAt:now(state),restoredAt:null,gap:state.gap,target:main?'XR-P1 / XR-P2':labels.critical,scope:main?`${labels.main} / XR-P1 and XR-P2 interface metrics`:`${labels.critical} device telemetry`,lastObservedAt:main?observations(state).observedAt:'07:50'};
    }else if(a.monitoringRecord&&!a.monitoringRecord.restoredAt)a.monitoringRecord={...a.monitoringRecord,restoredAt:now(state)};
  }
  const acknowledgements={...state.acknowledgements};
  if(state.frame<2){delete acknowledgements[MAIN_ALARM];delete acknowledgements['CNC-1043'];delete acknowledgements['CNC-1044'];}
  else if(a.enabled){
    acknowledgements[MAIN_ALARM]={actor:'CW AI',time:'08:00',source:'Alarm acknowledgement confirmation'};
    for(const id of ['CNC-1043','CNC-1044'])if(state.related)acknowledgements[id]={actor:'CW AI',time:'08:00',source:'Alarm acknowledgement confirmation'};else delete acknowledgements[id];
  }
  if(state.critical&&a.enabled)acknowledgements[CRITICAL_ALARM]={actor:'CW AI',time:state.criticalDetected||now(state),source:'Alarm acknowledgement confirmation'};
  if(!state.critical)delete acknowledgements[CRITICAL_ALARM];
  if(a.enabled&&current(state)&&state.frame>=7&&!a.runtime.jobStarted){
    if(executionAllowed(state))a.runtime={...a.runtime,jobStarted:true,jobStartedAt:a.runtime.deferredAt===null?'08:10':now(state),deferredAt:null};
    else if(a.runtime.deferredAt===null)a.runtime={...a.runtime,deferredAt:state.frame};
  }
  const job=jobRecord(state);
  if(a.enabled&&current(state)){
    if(state.frame>=5&&!procedureAvailable(state)&&!a.handoffs.interface){
      const reason=mainDecision(state,job);
      if(reason)a.handoffs.interface=handoffRecord(state,'interface',reason.route,{key:state.match,...reason});
    }
    if(state.frame>=10&&['failed','unknown'].includes(job.status)&&!a.handoffs.interface){
      const reason=mainDecision(state,job);
      if(reason)a.handoffs.interface=handoffRecord(state,'interface',reason.route,{key:job.status,...reason});
    }
    if(state.critical&&!a.handoffs.device)a.handoffs.device=handoffRecord(state,'device','Network Engineering',{key:'device-procedure-unavailable',title:'Device engineering decision required',detail:'CW AI gathered the reachability and topology evidence. An applicable autonomous device-recovery procedure is unavailable.'});
  }
  // This is a response record, never an inference that an alarm has cleared.
  const verified=current(state)&&state.frame===11&&job.status==='completed'&&verificationCriteria(state).every(item=>item.met)&&!a.handoffs.interface;
  const handoff=a.handoffs.interface;
  return {...state,agentic:a,acknowledgements,ackPending:null,playbook:{status:job.status==='not-started'?'none':job.status,step:job.step,owner:'CW AI',id:job.id},verified,escalation:handoff?{...handoff,owner:handoff.status==='accepted'?'Arun':null}:{status:'none'}};
}

function jobRecord(state) {
  const started=!!state.agentic.runtime.jobStarted&&state.frame>=7;
  let status='not-started',step=0;
  if(started){
    status=state.frame<10?'running':state.runOutcome==='failed'?'failed':state.runOutcome==='unknown'?'unknown':'completed';
    step=status==='completed'?3:state.frame>=9?2:state.frame>=8?1:0;
  }
  const labels=['Revalidate permitted scope','Apply validated SR policy response','Confirm controller result'];
  return {id:started?'RUN-017':null,status,step,startedAt:started?state.agentic.runtime.jobStartedAt:null,completedAt:status==='completed'?'08:25':null,steps:labels.map((label,index)=>({label,status:index<step?'complete':index===step&&status==='running'?'active':status==='failed'&&index===step?'blocked':'pending'}))};
}

function mainDecision(state,job) {

  if(job.status==='failed')return {title:'The response did not complete',detail:'Controller output reports a failed scope check. No successful response change is confirmed. CW AI retained the actual output and assembled an engineering handoff.',recommendation:'Review the failed controller result and engineering handoff.',route:'Traffic Engineering'};
  if(job.status==='unknown')return {title:'Execution result needs reconciliation',detail:'The controller job connection was lost. Completion and reversal are unconfirmed. CW AI continues observing the network and has prepared the job evidence.',recommendation:'Reconcile RUN-017 with engineering before another change.',route:'Traffic Engineering'};
  if(state.frame>=5&&!procedureAvailable(state)){
    const cases={
      'no-match':['No applicable autonomous response','Investigation is complete. The catalogue has no approved response for this scope. CW AI assembled the findings for a traffic-engineering decision.','Review the engineering handoff.'],
      restricted:['Proposed change exceeds delegated scope','The matching response requires engineering authority. CW AI retains the evidence and continues monitoring.','Review the proposed change and engineering handoff.'],
      precheck:['Target lock prevents execution','A separate configuration job holds the target lock. No autonomous change has started. CW AI continues monitoring the target.','Review the competing job and coordinate the target lock.'],
      unavailable:['Response catalogue unavailable','CW AI cannot establish current applicability. No response change has started; source monitoring remains active.','Restore catalogue access or use the engineering handoff.'],
    };
    const [title,detail,recommendation]=cases[state.match]||cases['no-match'];
    if(job.id){
      const currentResult=`${job.id} was confirmed started at ${job.startedAt}; its current controller status is ${job.status}.`;
      if(state.match==='precheck')return {title:'Further changes require target-lock revalidation',detail:`${currentResult} A separate configuration job now holds the target lock. CW AI continues following the confirmed job; the lock gates further changes.`,recommendation:'Review the competing job and coordinate the target lock while source monitoring continues.',route:'Traffic Engineering'};
      return {title,detail:`${currentResult} Current response applicability needs revalidation before any further change. CW AI retains the confirmed execution record and continues monitoring.`,recommendation,route:'Traffic Engineering'};
    }
    return {title,detail,recommendation,route:'Traffic Engineering'};
  }

  if(state.agentic.handoffs.interface){const h=state.agentic.handoffs.interface;return h.reason||{title:'Engineering decision requested',detail:'CW AI routed the reviewed context to Traffic Engineering and continues source monitoring.',recommendation:'Follow delivery and engineering acceptance independently.',route:'Traffic Engineering'};}
  return null;
}

function handoffRecord(state,id,route,reason){
  const labels=metadata(state),collection=state.agentic.monitoringRecord;
  const scope=id==='interface'?`${labels.main} / ${labels.mainGroup} / XR-P1 / ${INTERFACE}`:id==='device'?`${labels.critical} / XR-PE-E2`:collection?.scope||'WAN telemetry collection';
  // Only the interface workstream owns its metric and RUN-017. Device evidence
  // comes from current independent reachability; collection retains its stream.
  const source=id==='interface'?{observedAt:observations(state).observedAt,utilization:observations(state).utilization}:{observedAt:id==='device'?now(state):collection?.lastObservedAt||now(state)};
  return {status:'sent',sent:now(state),accepted:null,acceptedBy:null,route,actor:'CW AI',reason:{...reason},snapshot:{scope,notes:state.agentic.notes[id]||'',...source,alarm:id==='device'?CRITICAL_ALARM:id==='interface'?MAIN_ALARM:null,jobStatus:id==='interface'?jobRecord(state).status:'not-started',reason:{...reason}}};
}

function mainActivity(state,job,resolved) {
  const f=state.frame,a=[],currentEvidence=observations(state).fresh||!!job.id;
  if(f>=1)a.push(event('07:58','Investigation agent','Developing trend checked','73% was below the 80% source threshold; read-only checks began.'));
  if(f>=2)a.push(event('08:00','Coordination agent','Incident accepted','CNC-1042 acknowledged by CW AI; the Major condition remained active.'));
  if(f>=3)a.push(event('08:01','Investigation agent','Current sources gathered','Interface telemetry, related alarms, observed SR policy state, and recent changes were requested.'));
  if(f>=4&&currentEvidence)a.push(event('08:03','Investigation agent','Probable congestion identified','Available observations support congestion on the observed SR policy path. Cause remains probable.'));
  if(f>=5&&(procedureAvailable(state)||job.id)&&currentEvidence)a.push(event('08:05','Traffic-engineering agent','Response assessed','The illustrative capacity and dependency checks passed for the approved candidate scope.'));
  if(f>=6&&(procedureAvailable(state)||job.id)&&currentEvidence)a.push(event('08:07','Remediation agent','Permitted response prepared','PB-NOC-17 v3.2 and its fixed parameters were checked against the delegated scope.'));
  if(job.id)a.push(event(job.startedAt,'Execution agent','Controller job started','RUN-017 confirmed started; CW AI follows source-reported steps.'));
  if(job.status==='completed')a.push(event('08:25','Execution agent','Controller job completed','The result is confirmed. The interface alarm and recovery criteria are assessed independently.'));
  if(job.status==='failed')a.push(event(now(state),'Execution agent','Controller job failed','The scope check failed. No successful response change is confirmed.'));
  if(job.status==='unknown')a.push(event(now(state),'Execution agent','Job result unavailable','Completion and reversal remain unconfirmed.'));
  if(f>=11)a.push(event('08:30','Verification agent','Alarm cleared by source','CNC-1042 was cleared by its source. Required observation stability is checked separately.'));
  if(resolved)a.push(event('08:35','Verification agent','Recovery verified','Current below-limit observations, the five-minute stability window, and source clearance satisfy the configured criteria.'));
  for(const [id,h] of Object.entries(state.agentic.handoffs))if(id==='interface')a.push(event(h.sent,'Coordination agent','Engineering handoff delivered',`${h.reason?.title||'Engineering decision requested'} · Evidence delivered to ${h.route}; acceptance is a separate confirmation.`));
  a.push(...state.agentic.events.filter(item=>!item.incident||item.incident==='interface'));
  return a.sort((x,y)=>x.time.localeCompare(y.time));
}

export function agentResponse(input,id='interface') {
  const state=context(input);
  if(id==='device')return deviceResponse(state);
  if(id==='monitoring')return monitoringResponse(state);
  const labels=metadata(state),o=observations(state),f=state.frame,job=jobRecord(state);
  const criteria=verificationCriteria(state).map(item=>!current(state)&&item.id==='fresh'?{...item,met:false,detail:'Return to current monitoring before recording a verified outcome.'}:item);
  const resolved=f===11&&current(state)&&job.status==='completed'&&criteria.every(item=>item.met)&&!state.agentic.handoffs.interface;
  const decision=mainDecision(state,job);
  let stage=f===0?'Monitoring':f===1?'Checking trend':f<=4?'Investigating':f===5?'Validating response':f<=9?'Remediating':'Verifying';
  let currentAgent=f<=2?'Coordination agent':f<=4?'Investigation agent':f===5?'Traffic-engineering agent':f===6?'Remediation agent':f<=9?'Execution agent':'Verification agent';
  let currentWork=f===0?'Monitoring the configured WAN and source coverage':f===1?'Checking the rising trend against contributing observations':f<=3?'Gathering interface telemetry, related alarms, SR policy state, and recent changes':f===4?'Reconciling the supported finding and affected scope':f===5?'Checking alternate-path capacity and response applicability':f===6?'Revalidating permitted scope and preparing the response':f<=9?'Applying the validated SR policy response':'Checking source clearance and the required stability window';
  let next=f<2?'A qualifying alarm starts the autonomous response.':f<=4?'Validate an applicable response and its permitted effects.':f<=6?'Submit the permitted operation and follow the confirmed controller job.':f<=9?'Independently check network recovery.':'Continue observation until every recovery criterion is satisfied.';
  let summary=f<2?'CW AI is watching current sources.':f<4?'CW AI accepted the incident and owns its investigation.':f<=6?'Probable congestion on the observed SR policy path; the original cause remains unconfirmed.':f<=9?'The permitted response is being followed against the actual controller result.':'Execution is complete; observed recovery is assessed independently.';
  if(f>=2&&!o.fresh&&!decision){stage=job.status==='completed'?'Verifying':'Investigating';currentAgent='Collection agent';currentWork='Waiting for current interface observations';next='Follow collection recovery; current evidence is required before another change or verified outcome.';summary=`The last reading is from ${o.observedAt}. CW AI opened a collection investigation while independent topology and reachability monitoring continue.`;}
  if(decision){stage='Needs decision';currentAgent='Coordination agent';currentWork=decision.title;next=decision.recommendation;summary=decision.detail;}
  const acceptedHandoff=state.agentic.handoffs.interface?.status==='accepted';
  if(acceptedHandoff&&!resolved){stage='Investigating';currentAgent='Coordination agent';currentWork='Arun accepted the engineering investigation';next='Follow the accepted investigation and current network observations.';summary=`${decision?.title||'Engineering decision required'}. CW AI retained the reviewed evidence and continues source monitoring.`;}
  if(state.agentic.runtime.deferredAt!==null&&!state.agentic.paused&&!decision&&job.status==='not-started'&&f>=7){stage='Remediating';currentWork='Response revalidation requires a new controller job confirmation';next='Follow a newly confirmed execution result before evaluating recovery.';summary='The earlier execution window was blocked. Current healthy observations do not establish that the deferred response ran.';}
  if(state.agentic.paused&&!resolved&&!decision){stage='Paused';currentWork=job.status==='running'?'Further automated changes paused; the running job remains under observation':'Further automated changes paused by Priya';next='Resume to revalidate the current scope, or review an engineering handoff.';summary='Observation and evidence collection continue. Pausing does not cancel or reverse a confirmed controller job.';}
  if(resolved){stage='Resolved';currentAgent='Verification agent';currentWork='Recovery verified and the incident outcome recorded';next='Continue the wider network watch.';summary='Current observations meet the configured recovery criteria; source evidence and the response record are retained.';}
  if(!current(state)){stage='Verifying';currentWork='Historical evidence is open; current outcome recording is unavailable';next='Return to current monitoring to inspect the active response.';summary='Historical observations cannot authorize a new operation or establish current recovery.';}
  const activeStep=f<=4?0:f<=9?1:2;
  const steps=['Investigate','Remediate','Verify'].map((label,index)=>({id:label.toLowerCase(),label,status:f===0?'pending':resolved?'complete':index<activeStep?'complete':index===activeStep?decision||state.agentic.paused||!o.fresh?'blocked':'active':'pending'}));
  return {id:'interface',title:f===0?'Network watch':f===1?'Rising utilization trend':'Interface congestion',target:'XR-P1 → XR-P2',scope:`${labels.main} / ${labels.mainGroup} / XR-P1 / ${INTERFACE}`,stage,keytone:resolved?'positive':decision?'warning':state.agentic.paused?'unknown':'progress',owner:OWNERS.interface,currentAgent,summary,currentWork,next,job,acknowledgement:f>=2?{actor:'CW AI',time:'08:00',confirmed:true}:null,steps,activity:mainActivity(state,job,resolved),evidence:[{label:'Outbound utilization',value:`${o.utilization}%${o.fresh?'':' · Last known'}`,source:'Interface telemetry',time:o.observedAt,fresh:o.fresh},{label:'Source alarm',value:f<2?'Not reported':f>=11?'Source-cleared':'Major · Active',source:MAIN_ALARM,time:f>=11?'08:30':f>=2?'08:00':now(state),fresh:true},{label:'Observed SR policy',value:'SR-PE-W1-PE-E1 · Color 100',source:'SR policy state',time:now(state),fresh:o.fresh},{label:'Response basis',value:'PB-NOC-17 v3.2 · Fixed candidate scope',source:'Illustrative approved catalogue',time:f>=5?'08:05':now(state),fresh:state.match!=='unavailable'}],criteria,needsDecision:!!decision&&!acceptedHandoff,decision:acceptedHandoff?null:decision,resolved,startedAt:f>=2?'08:00':null,historical:!current(state),handoff:state.agentic.handoffs.interface||null,paused:state.agentic.paused};
}

function deviceResponse(state) {
  const labels=metadata(state),time=state.agentic.deviceRecord?.startedAt||state.criticalDetected||now(state),handoff=state.agentic.handoffs.device;
  if(!state.critical)return inactiveDeviceResponse(state,labels,time,handoff);
  const accepted=handoff?.status==='accepted';
  return {id:'device',title:'Router unreachable',target:'XR-PE-E2',scope:`${labels.critical} / XR-PE-E2`,stage:accepted?'Investigating':'Needs decision',keytone:'warning',owner:'CW AI',currentAgent:'Coordination agent',summary:'Independent reachability checks report the router unreachable. A physical cause has not been established.',currentWork:accepted?'Engineering investigation accepted; CW AI continues monitoring':'Device recovery exceeds the available autonomous procedure',next:accepted?'Follow the accepted investigation and current source observations.':'Review the engineering handoff and required recovery decision.',job:{id:null,status:'not-started',step:0,steps:[],startedAt:null,completedAt:null},acknowledgement:{actor:'CW AI',time,confirmed:true},steps:[{id:'investigate',label:'Investigate',status:'active'},{id:'remediate',label:'Remediate',status:'blocked'},{id:'verify',label:'Verify',status:'pending'}],activity:[event(time,'Coordination agent','Device incident accepted',`${CRITICAL_ALARM} acknowledged by CW AI; independent reachability evidence retained.`),...(handoff?[event(handoff.sent,'Coordination agent','Device handoff delivered','Network Engineering received the device evidence. Acceptance remains a distinct confirmation.')]:[])],evidence:[{label:'Reachability',value:'Unreachable',source:'Independent reachability checks',time:now(state),fresh:true},{label:'Source alarm',value:'Critical · Active',source:CRITICAL_ALARM,time,fresh:true},{label:'Device telemetry',value:state.gap==='east'?'Last known':'Current',source:'Device telemetry',time:state.gap==='east'?'07:50':now(state),fresh:state.gap!=='east'}],criteria:[],needsDecision:!accepted,decision:accepted?null:{title:'Device engineering decision required',detail:'CW AI gathered the reachability and topology evidence. An applicable autonomous device-recovery procedure is unavailable.',recommendation:handoff?'Follow delivery and engineering acceptance.':'Review the prepared Network Engineering handoff.',route:'Network Engineering'},resolved:false,startedAt:time,handoff:handoff||null};
}
function monitoringResponse(state) {
  if(state.gap==='none')return inactiveMonitoringResponse(state);
  const labels=metadata(state),main=state.gap==='west',scope=main?`${labels.main} / XR-P1 and XR-P2 interface metrics`:`${labels.critical} device telemetry`;
  const handoff=state.agentic.handoffs.monitoring;
  return {id:'monitoring',title:'Telemetry collection gap',target:main?'XR-P1 / XR-P2':labels.critical,scope,stage:'Investigating',keytone:'unknown',owner:'CW AI',currentAgent:'Collection agent',summary:'Current telemetry is unavailable. Logical topology and independent reachability remain separately monitored.',currentWork:'Checking collection connectivity and affected streams',next:'Restore current source coverage before confirming affected metrics or recovery.',job:{id:null,status:'not-started',step:0,steps:[],startedAt:null,completedAt:null},acknowledgement:null,steps:[{id:'investigate',label:'Investigate',status:'active'},{id:'restore',label:'Restore source',status:'pending'},{id:'verify',label:'Verify',status:'pending'}],activity:[event(now(state),'Collection agent','Collection investigation opened',`${scope}; the observation gap is not treated as a physical failure.`)],evidence:[{label:'Affected source',value:scope,source:'Telemetry collection status',time:main?observations(state).observedAt:'07:50',fresh:false},{label:'Logical topology',value:'Current snapshot available',source:'BGP-LS topology',time:now(state),fresh:true},{label:'Reachability checks',value:'Independent source available',source:'Device reachability',time:now(state),fresh:true}],criteria:[],needsDecision:false,decision:null,resolved:false,startedAt:now(state),handoff:handoff||null};
}
function inactiveDeviceResponse(state,labels,time,handoff){
  const seen=!!state.agentic.seen.device,clearedAt=state.agentic.deviceRecord?.clearedAt;
  return {id:'device',title:seen?'Device reachability restored':'Device reachability',target:'XR-PE-E2',scope:`${labels.critical} / XR-PE-E2`,stage:'Monitoring',keytone:'positive',owner:'CW AI',currentAgent:'Coordination agent',summary:seen?'The current reachability source no longer reports this device alarm. Its earlier response and engineering handoff remain recorded.':'No active device reachability condition is reported for this router.',currentWork:'No active device reachability condition',next:'Continue independent reachability and source monitoring.',job:{id:null,status:'not-started',step:0,steps:[],startedAt:null,completedAt:null},acknowledgement:seen?{actor:'CW AI',time,confirmed:true}:null,steps:[],activity:seen?[event(time,'Coordination agent','Device incident accepted',`${CRITICAL_ALARM} acknowledged by CW AI.`),...(handoff?[event(handoff.sent,'Coordination agent','Device handoff delivered',`Evidence delivered to ${handoff.route}; delivery and acceptance remain separate.`)]:[]),...(clearedAt?[event(clearedAt,'Coordination agent','Reachability source restored','The current source no longer reports the device alarm. The original cause is not inferred.')]:[])]:[],evidence:[{label:'Reachability',value:'Reachable',source:'Independent reachability checks',time:now(state),fresh:true},{label:'Source alarm',value:'No active device alarm',source:CRITICAL_ALARM,time:clearedAt||now(state),fresh:true}],criteria:[],needsDecision:false,decision:null,resolved:false,startedAt:seen?time:null,handoff:handoff||null,inactive:true};
}
function inactiveMonitoringResponse(state){
  const record=state.agentic.monitoringRecord,seen=!!record,restored=!!record?.restoredAt&&current(state),handoff=state.agentic.handoffs.monitoring;
  const scope=record?.scope||'WAN telemetry collection',target=record?.target||'Telemetry sources';
  return {id:'monitoring',title:restored?'Telemetry collection restored':'Telemetry collection',target,scope,stage:restored?'Resolved':'Monitoring',keytone:'positive',owner:'CW AI',currentAgent:'Collection agent',summary:restored?'Current source status confirms that the affected telemetry collection is restored. The collection investigation and its original gap remain recorded.':'No telemetry collection gap is reported in the current source snapshot.',currentWork:restored?'Current telemetry collection restored':'All monitored telemetry streams are current',next:'Continue source coverage monitoring.',job:{id:null,status:'not-started',step:0,steps:[],startedAt:null,completedAt:null},acknowledgement:null,steps:restored?[{id:'investigate',label:'Investigate',status:'complete'},{id:'restore',label:'Restore source',status:'complete'},{id:'verify',label:'Verify',status:'complete'}]:[],activity:seen?[event(record.startedAt,'Collection agent','Collection investigation opened',`${record.scope}; the gap was kept separate from physical network failure.`),...(restored?[event(record.restoredAt,'Collection agent','Collection restored','Current source status confirms the affected streams are available again.')]:[])]:[],evidence:[{label:'Collection status',value:'Current',source:'Telemetry collection status',time:record?.restoredAt||now(state),fresh:true},{label:'Logical topology',value:'Current snapshot available',source:'BGP-LS topology',time:now(state),fresh:true}],criteria:[],needsDecision:false,decision:null,resolved:restored,startedAt:record?.startedAt||null,handoff:handoff||null,inactive:!restored};
}

export function agentQueue(state) {
  const queue=[];
  if(state.critical)queue.push(agentResponse(state,'device'));
  if(state.frame>=1)queue.push(agentResponse(state,'interface'));
  if(state.gap!=='none')queue.push(agentResponse(state,'monitoring'));
  return queue;
}

function replyFor(state,id,text) {
  const r=agentResponse(state,id),q=text.toLowerCase();
  if(/^(?:please\s+)?(?:pause|stop|cancel|resume|change|reroute|execute|approve)\b|^(?:can|could|would)\s+you\s+(?:pause|stop|cancel|resume|change|reroute|execute|approve)\b/.test(q))return 'This conversation explains the local concept and records context. Use Intervene for a supported workflow instruction; sending a message does not pause, cancel, approve, or change a controller operation.';
  if(/changed|since|previous|latest/.test(q)){const o=observations(state),previous=currentFrame({...state,frame:Math.max(0,state.frame-1)});return o.fresh?`The current interface reading is ${o.utilization}% at ${o.observedAt}; the preceding recorded snapshot was ${previous.utilization}% at ${previous.time}. Current response stage: ${r.stage}. The source alarm and controller result remain independently inspectable.`:`Current interface observations are unavailable. The last-known reading is ${o.utilization}% from ${o.observedAt}; it cannot establish a current change. The Collection agent is investigating the missing stream.`;}
  if(/why|response|choose|plan/.test(q))return id==='interface'?`The supported finding is probable congestion on the observed SR policy path. The concept matches PB-NOC-17 v3.2 to a fixed candidate scope, then checks applicability, capacity, dependencies, and source freshness. Current stage: ${r.stage}. The original cause remains unconfirmed.`:r.summary;
  if(/service|impact|affected|scope/.test(q))return `The response is scoped to ${r.scope}. The associated SR policy is SR-PE-W1-PE-E1. Available service context is supporting evidence; this concept does not infer a service outage from the interface alarm or missing telemetry.`;
  if(/recover|resolve|done|complete|verify/.test(q))return r.resolved?'Recovery is verified: the source alarm cleared and current observations stayed below 80% throughout 08:30–08:35. The execution record and each criterion remain available.':`Recovery is not yet verified. ${r.currentWork}. A completed controller job alone cannot establish recovery; current observations, the stable window, and source clearance are evaluated independently.`;
  if(/agent|owner|who|handoff|engineering/.test(q))return `CW AI owns this workstream. ${r.currentAgent} is the current contributor. ${r.handoff?`The human handoff is ${r.handoff.status}; delivery and acceptance are separate records.`:'Specialist agents coordinate within the delegated response scope.'}`;
  return `For this local concept, the current source-backed update is: ${r.currentWork}. ${r.next} You can inspect Findings and evidence or Agent activity. This conversation does not change the running response.`;
}
export function reduceAgent(input,action) {
  const state=context(input),a=state.agentic,id=action.id||action.incident||a.selected||'interface';
  switch(action.type){
    case 'AGENT_SELECT':
    case 'AGENT_OPEN':return {...state,agentic:{...a,open:true,selected:id,drafts:{...a.drafts,[a.selected]:a.draft},draft:id===a.selected?a.draft:a.drafts[id]||''}};
    case 'AGENT_CLOSE':return {...state,agentic:{...a,open:false}};
    case 'AGENT_PIN':return {...state,agentic:{...a,pinned:typeof action.value==='boolean'?action.value:!a.pinned}};
    case 'AGENT_NOTE':return {...state,agentic:{...a,notes:{...a.notes,[id]:String(action.value||'')}}};
    case 'AGENT_DRAFT':return {...state,agentic:{...a,draft:id===a.selected?String(action.value||''):a.draft,drafts:{...a.drafts,[id]:String(action.value||'')}}};
    case 'AGENT_PAUSE':return syncAgentResponse({...state,agentic:{...a,paused:true,events:[...a.events,{...event(now(state),'Priya','Further automated changes paused','Observation continues; a confirmed controller job is not cancelled or reversed.'),incident:id}]}});
    case 'AGENT_RESUME':return syncAgentResponse({...state,agentic:{...a,paused:false,events:[...a.events,{...event(now(state),'Coordination agent','Response revalidation requested','Current evidence, delegated scope, and target prerequisites are checked before further changes.'),incident:id}]}});
    case 'AGENT_HANDOFF':{
      if(a.handoffs[id])return state;
      const route=id==='device'?'Network Engineering':id==='monitoring'?'Platform Operations':'Traffic Engineering';
      const reason=agentResponse(state,id).decision||{key:'operator-routing',title:'Operator requested engineering review',detail:'Priya requested a scoped engineering review; CW AI routed the retained evidence.'};
      return syncAgentResponse({...state,agentic:{...a,handoffs:{...a.handoffs,[id]:handoffRecord(state,id,route,reason)}}});
    }
    case 'AGENT_ACCEPT':{
      const handoff=a.handoffs[id];if(!handoff||handoff.status!=='sent')return state;
      return syncAgentResponse({...state,agentic:{...a,handoffs:{...a.handoffs,[id]:{...handoff,status:'accepted',accepted:now(state),acceptedBy:id==='monitoring'?'Platform Operations':'Arun'}},events:[...a.events,{...event(now(state),id==='monitoring'?'Platform Operations':'Arun','Engineering acceptance confirmed','The receiving owner confirmed acceptance; source monitoring continues.'),incident:id}]}});
    }
    case 'AGENT_ASK':{
      const value=String(action.value??action.question??action.text??'').trim();if(!value)return state;
      const count=a.messages.length,time=now(state);
      return {...state,agentic:{...a,draft:id===a.selected?'':a.draft,drafts:{...a.drafts,[id]:''},messages:[...a.messages,{id:`message-${count+1}`,incident:id,role:'operator',text:value,time},{id:`message-${count+2}`,incident:id,role:'agent',text:replyFor(state,id,value),time}]}};
    }
    default:return state;
  }
}

export function agentHandover(state) {
  const queue=agentQueue(state),counts=alarmCounts(state);
  return `NOC watch handover · ${now(state)} (simulated)\n\nAutonomous response: enabled for the configured WAN scope.\nActive source alarms: ${counts.total} (${counts.critical} Critical, ${counts.major} Major, ${counts.minor} Minor).\n\n${queue.map(r=>`${r.title} · ${r.target}\nOwner: ${r.owner}. Stage: ${r.stage}.\nCurrent contributor: ${r.currentAgent}.\n${r.currentWork}.\nAcknowledgement: ${r.acknowledgement?`confirmed by ${r.acknowledgement.actor} at ${r.acknowledgement.time}`:'not applicable'}.\nController job: ${r.job.id||'not started'} · ${r.job.status}.\nRecovery: ${r.resolved?'verified from current source criteria':'not verified'}.\nHandoff: ${r.handoff?`${r.handoff.status} to ${r.handoff.route}${r.handoff.accepted?`; accepted ${r.handoff.accepted}`:''}`:'none'}.\nOperator context: ${state.agentic?.notes?.[r.id]||'No additional context.'}`).join('\n\n')}\n\nWatch notes: ${state.notes||'No additional notes.'}`;
}
