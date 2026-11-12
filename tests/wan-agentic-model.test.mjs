import test from 'node:test';
import assert from 'node:assert/strict';
import {MAIN_ALARM, CRITICAL_ALARM, activeAlarms, reduce} from '../src/features/wan/model/model.js';
import {createAgentState,enterAgentFrame,syncAgentResponse,agentResponse,agentQueue,reduceAgent,agentFrameTitle,agentHandover} from '../src/features/wan/model/agentic-model.js';

const at=(index,overrides={})=>enterAgentFrame(createAgentState(overrides),index);

test('a qualifying alarm is acknowledged by CW AI without removing its source severity',()=>{
  const state=at(2),alarm=activeAlarms(state).find(item=>item.id===MAIN_ALARM);
  assert.equal(alarm.severity,'Major');assert.equal(alarm.active,true);assert.equal(alarm.ack.actor,'CW AI');assert.equal(alarm.ack.time,'08:00');
  assert.equal(agentResponse(state).stage,'Investigating');assert.equal(state.escalation.status,'none');assert.equal(state.playbook.status,'none');
  assert.equal(agentQueue(at(0)).length,0);assert.equal(agentResponse(at(1)).stage,'Checking trend');
});

test('the autonomous main path reaches a confirmed job and independently verified recovery',()=>{
  let state=createAgentState();
  for(let i=2;i<=7;i++)state=enterAgentFrame(state,i);
  const running=agentResponse(state);assert.equal(running.stage,'Remediating');assert.equal(running.job.id,'RUN-017');assert.equal(running.job.status,'running');assert.equal(running.job.startedAt,'08:10');assert.equal(running.owner,'CW AI');
  state=enterAgentFrame(state,10);assert.equal(agentResponse(state).stage,'Verifying');assert.equal(agentResponse(state).resolved,false);assert.equal(state.playbook.status,'completed');assert.equal(activeAlarms(state).find(a=>a.id===MAIN_ALARM).active,true);
  state=enterAgentFrame(state,11);assert.equal(agentResponse(state).resolved,true);assert.equal(state.verified,true);assert.equal(agentResponse(state).stage,'Resolved');assert.equal(agentResponse(state).criteria.every(c=>c.met),true);assert.equal(activeAlarms(state).length,0);
  assert.match(agentHandover(state),/Acknowledgement: confirmed by CW AI/);assert.doesNotMatch(agentHandover(state),/acknowledged by Priya|Arun.*follow-up/);
});

test('all response-source exception branches prevent invented execution or recovery',()=>{
  for(const match of ['no-match','restricted','precheck','unavailable']){
    const state=at(11,{match}),response=agentResponse(state);
    assert.equal(response.needsDecision,true,match);assert.equal(response.stage,'Needs decision',match);assert.equal(response.job.status,'not-started',match);assert.equal(response.resolved,false,match);assert.equal(state.verified,false,match);assert.equal(response.decision.route,'Traffic Engineering',match);
  }
});

test('failed and unknown confirmed job results remain unresolved even when source conditions improve',()=>{
  for(const runOutcome of ['failed','unknown']){
    const state=at(11,{runOutcome}),response=agentResponse(state);
    assert.equal(response.job.status,runOutcome);assert.equal(response.resolved,false);assert.equal(response.needsDecision,true);assert.equal(state.verified,false);
    assert.match(response.next,/Review|Reconcile/);
  }
});

test('a collection gap preserves the source alarm and blocks execution and verification',()=>{
  const state=at(10,{gap:'west'}),response=agentResponse(state);
  assert.equal(response.job.status,'not-started');assert.equal(response.resolved,false);assert.equal(response.needsDecision,false);assert.equal(response.currentAgent,'Collection agent');assert.equal(response.steps.some(step=>step.status==='blocked'),true);assert.equal(response.evidence[0].fresh,false);assert.match(response.evidence[0].value,/Last known/);
  assert.equal(activeAlarms(state).find(a=>a.id===MAIN_ALARM).severity,'Major');
  assert.equal(agentQueue(state).some(item=>item.id==='monitoring'),true);
});

test('a gap arriving after a confirmed job does not erase the controller result or establish recovery',()=>{
  let state=at(7);state=syncAgentResponse(reduce(state,{type:'GAP',value:'west'}));state=enterAgentFrame(state,11);
  const response=agentResponse(state);assert.equal(response.job.status,'completed');assert.equal(response.resolved,false);assert.equal(state.verified,false);assert.equal(response.criteria.find(c=>c.id==='fresh').met,false);
});

test('historical context cannot record current verified recovery or start a new job',()=>{
  const historical={...createAgentState(),frame:11,history:0};
  const state=syncAgentResponse(historical),response=agentResponse(state);
  assert.equal(response.resolved,false);assert.equal(state.verified,false);assert.equal(response.job.status,'not-started');assert.equal(response.criteria.find(c=>c.id==='fresh').met,false);assert.equal(response.historical,true);
});

test('automatic source snapshots preserve scope, target, draft, panel and conversation',()=>{
  let state=at(3,{view:'pop',domain:'Coastal',popId:'COASTAL-01',selection:'XR-P1',scopePage:2,panel:'evidence',notes:'Watch note',networkContext:{mainDomain:'Coastal',mainDomainLabel:'Coastal',mainGroup:'COASTAL-01'}});
  state=reduceAgent(state,{type:'AGENT_NOTE',id:'interface',value:'Retain source context'});
  state=reduceAgent(state,{type:'AGENT_ASK',question:'Why this response?'});
  state=enterAgentFrame(state,7);
  assert.equal(state.view,'pop');assert.equal(state.domain,'Coastal');assert.equal(state.popId,'COASTAL-01');assert.equal(state.selection,'XR-P1');assert.equal(state.scopePage,2);assert.equal(state.panel,'evidence');assert.equal(state.notes,'Watch note');assert.equal(state.agentic.notes.interface,'Retain source context');assert.equal(state.agentic.messages.length,2);assert.match(agentResponse(state).scope,/Coastal \/ COASTAL-01/);
});

test('intervention pauses further changes without pretending a running controller job was cancelled',()=>{
  let state=at(7);state=reduceAgent(state,{type:'AGENT_PAUSE'});
  const paused=agentResponse(state);assert.equal(paused.stage,'Paused');assert.equal(paused.job.status,'running');assert.match(paused.currentWork,/running job remains under observation/);
  state=reduceAgent(state,{type:'AGENT_RESUME'});assert.equal(agentResponse(state).stage,'Remediating');assert.equal(agentResponse(state).job.id,'RUN-017');
});

test('pausing before execution cannot invent an earlier completed job when resumed later',()=>{
  let state=reduceAgent(at(6),{type:'AGENT_PAUSE'});state=enterAgentFrame(state,11);
  assert.equal(agentResponse(state).job.status,'not-started');assert.equal(agentResponse(state).resolved,false);
  state=reduceAgent(state,{type:'AGENT_RESUME'});assert.equal(agentResponse(state).job.status,'not-started');assert.equal(agentResponse(state).resolved,false);assert.match(agentResponse(state).currentWork,/new controller job confirmation/);
});

test('handoff delivery and receiving-engineer acceptance remain separate confirmations',()=>{
  let state=at(5,{match:'restricted'});state=reduceAgent(state,{type:'AGENT_HANDOFF',id:'interface'});
  assert.equal(state.agentic.handoffs.interface.status,'sent');assert.equal(state.agentic.handoffs.interface.accepted,null);assert.equal(state.agentic.handoffs.interface.actor,'CW AI');assert.equal(agentResponse(state).handoff.status,'sent');assert.equal(agentResponse(state).resolved,false);
  state=reduceAgent(state,{type:'AGENT_ACCEPT',id:'interface'});assert.equal(agentResponse(state).handoff.status,'accepted');assert.equal(agentResponse(state).handoff.acceptedBy,'Arun');assert.equal(agentResponse(state).resolved,false);
});

test('multiple workstreams retain distinct source identities and acknowledgements',()=>{
  let state=at(3,{critical:true,criticalDetected:'08:00',gap:'east',networkContext:{criticalDomain:'Enterprise',criticalDomainLabel:'Enterprise'}});
  const queue=agentQueue(state);assert.deepEqual(queue.map(r=>r.id),['device','interface','monitoring']);assert.equal(state.acknowledgements[CRITICAL_ALARM].actor,'CW AI');assert.equal(queue.find(r=>r.id==='device').acknowledgement.time,'08:00');assert.match(queue.find(r=>r.id==='device').scope,/Enterprise/);assert.equal(queue.find(r=>r.id==='monitoring').resolved,false);assert.equal(activeAlarms(state).length,2);
});

test('incident questions append scoped answers without changing job, source, pause, or ownership',()=>{
  let state=at(7);const before=agentResponse(state);
  state=reduceAgent(state,{type:'AGENT_ASK',id:'interface',question:'Why this response?'});
  assert.equal(state.agentic.messages.length,2);assert.equal(state.agentic.messages[1].incident,'interface');assert.match(state.agentic.messages[1].text,/PB-NOC-17/);assert.equal(agentResponse(state).job.status,before.job.status);assert.equal(state.agentic.paused,false);assert.equal(state.frame,7);assert.equal(agentResponse(state).owner,'CW AI');
  state=reduceAgent(state,{type:'AGENT_ASK',question:'Cancel this change now'});assert.match(state.agentic.messages.at(-1).text,/does not pause, cancel/);assert.equal(state.agentic.paused,false);assert.equal(agentResponse(state).job.status,'running');
});

test('returning to an earlier source snapshot clears future job and resolution facts',()=>{
  let state=at(11);state=enterAgentFrame(state,2);assert.equal(agentResponse(state).job.status,'not-started');assert.equal(state.verified,false);assert.equal(agentResponse(state).stage,'Investigating');assert.equal(state.escalation.status,'none');assert.equal(state.acknowledgements[MAIN_ALARM].actor,'CW AI');
  assert.equal(agentFrameTitle(4),'Correlate the evidence');assert.equal(agentFrameTitle(99),'Recovery verified');
});


test('questions about changed observations receive source facts rather than being treated as commands',()=>{
  let state=at(7);state=reduceAgent(state,{type:'AGENT_ASK',question:'What changed since the previous observation?'});
  assert.match(state.agentic.messages.at(-1).text,/93% at 08:10/);assert.match(state.agentic.messages.at(-1).text,/preceding recorded snapshot/);assert.equal(state.agentic.paused,false);
});

test('CW AI routes a scope exception automatically when established and retains its exact reason',()=>{
  let state=at(4,{match:'restricted',networkContext:{mainDomainLabel:'Coastal',mainGroup:'COASTAL-01'}});
  assert.equal(state.agentic.handoffs.interface,undefined);
  state=enterAgentFrame(state,5);
  const response=agentResponse(state),handoff=response.handoff;
  assert.equal(handoff.status,'sent');assert.equal(handoff.actor,'CW AI');assert.equal(handoff.sent,'08:05');assert.equal(handoff.accepted,null);assert.equal(handoff.route,'Traffic Engineering');
  assert.match(response.decision.title,/exceeds delegated scope/);assert.equal(handoff.reason.title,response.decision.title);assert.equal(handoff.snapshot.reason.title,response.decision.title);assert.match(handoff.snapshot.scope,/Coastal \/ COASTAL-01/);assert.equal(handoff.snapshot.utilization,91);
  const retained=structuredClone(handoff);state=enterAgentFrame(state,9);state=reduceAgent(state,{type:'AGENT_HANDOFF',id:'interface'});
  assert.deepEqual(state.agentic.handoffs.interface,retained);assert.match(agentResponse(state).decision.title,/exceeds delegated scope/);assert.equal(agentResponse(state).needsDecision,true);
  state=reduceAgent(state,{type:'AGENT_ACCEPT',id:'interface'});assert.equal(agentResponse(state).needsDecision,false);assert.equal(agentResponse(state).handoff.acceptedBy,'Arun');assert.equal(agentResponse(state).resolved,false);
});

test('a failed or unknown result routes automatically only after its controller result is confirmed',()=>{
  for(const runOutcome of ['failed','unknown']){
    let state=at(7,{runOutcome});assert.equal(agentResponse(state).job.status,'running');assert.equal(state.agentic.handoffs.interface,undefined);
    state=enterAgentFrame(state,9);assert.equal(agentResponse(state).job.status,'running');assert.equal(state.agentic.handoffs.interface,undefined);
    state=enterAgentFrame(state,10);const response=agentResponse(state);assert.equal(response.job.status,runOutcome);assert.equal(response.handoff.status,'sent');assert.equal(response.handoff.actor,'CW AI');assert.equal(response.handoff.sent,'08:25');assert.equal(response.handoff.snapshot.jobStatus,runOutcome);assert.equal(response.handoff.accepted,null);assert.equal(response.needsDecision,true);assert.equal(response.resolved,false);
    assert.match(response.decision.title,runOutcome==='failed'?/did not complete/:/reconciliation/);
  }
});

test('an independent critical router exception is acknowledged and routed without an operator action',()=>{
  const state=createAgentState({critical:true,criticalDetected:'07:55',networkContext:{criticalDomainLabel:'Enterprise'}}),response=agentResponse(state,'device');
  assert.equal(response.acknowledgement.actor,'CW AI');assert.equal(response.handoff.actor,'CW AI');assert.equal(response.handoff.status,'sent');assert.equal(response.handoff.route,'Network Engineering');assert.equal(response.handoff.accepted,null);assert.match(response.handoff.snapshot.scope,/Enterprise/);assert.equal(response.needsDecision,true);assert.equal(response.resolved,false);
  const collection=createAgentState({gap:'east'});assert.equal(collection.agentic.handoffs.monitoring,undefined);assert.equal(agentResponse(collection,'monitoring').needsDecision,false);
});


test('conversation drafts remain attached to their selected incident',()=>{
  let state=at(3,{critical:true});state=reduceAgent(state,{type:'AGENT_DRAFT',id:'interface',value:'Why this interface response?'});
  state=reduceAgent(state,{type:'AGENT_SELECT',incident:'device'});assert.equal(state.agentic.draft,'');
  state=reduceAgent(state,{type:'AGENT_DRAFT',id:'device',value:'What do the reachability checks say?'});
  state=reduceAgent(state,{type:'AGENT_SELECT',incident:'interface'});assert.equal(state.agentic.draft,'Why this interface response?');
  state=reduceAgent(state,{type:'AGENT_ASK',id:'interface',question:state.agentic.draft});assert.equal(state.agentic.draft,'');
  state=reduceAgent(state,{type:'AGENT_SELECT',incident:'device'});assert.equal(state.agentic.draft,'What do the reachability checks say?');
});


test('opening a quiet secondary workstream never fabricates a device fault or source gap',()=>{
  const state=createAgentState(),device=agentResponse(state,'device'),collection=agentResponse(state,'monitoring');
  assert.equal(device.stage,'Monitoring');assert.equal(device.needsDecision,false);assert.equal(device.acknowledgement,null);assert.equal(device.handoff,null);assert.equal(device.evidence.find(e=>e.label==='Reachability').value,'Reachable');assert.doesNotMatch(JSON.stringify(device.evidence),/Critical|Unreachable/);
  assert.equal(collection.stage,'Monitoring');assert.equal(collection.resolved,false);assert.equal(collection.needsDecision,false);assert.equal(collection.evidence.every(e=>e.fresh),true);assert.equal(collection.activity.length,0);assert.equal(agentQueue(state).length,0);
});

test('restored collection and reachability retain their work record with current source truth',()=>{
  let state=at(3,{critical:true,criticalDetected:'08:00',gap:'east'});const deviceHandoff=structuredClone(state.agentic.handoffs.device);
  state=syncAgentResponse(reduce(state,{type:'GAP',value:'none'}));const collection=agentResponse(state,'monitoring');
  assert.equal(collection.stage,'Resolved');assert.equal(collection.resolved,true);assert.equal(collection.currentWork,'Current telemetry collection restored');assert.equal(collection.evidence.every(e=>e.fresh),true);assert.equal(collection.activity.some(a=>a.title==='Collection investigation opened'),true);assert.equal(collection.activity.some(a=>a.title==='Collection restored'),true);
  state=syncAgentResponse(reduce(state,{type:'CRITICAL',value:false}));const device=agentResponse(state,'device');
  assert.equal(device.stage,'Monitoring');assert.equal(device.needsDecision,false);assert.equal(device.evidence.find(e=>e.label==='Reachability').value,'Reachable');assert.equal(device.activity.some(a=>a.title==='Reachability source restored'),true);assert.deepEqual(device.handoff,deviceHandoff);assert.equal(activeAlarms(state).some(a=>a.id===CRITICAL_ALARM),false);
});

test('a target lock or catalogue change after confirmed execution gates further work without erasing the job',()=>{
  for(const match of ['precheck','no-match','restricted','unavailable']){
    let state=at(7);state=syncAgentResponse(reduce(state,{type:'MATCH',value:match}));const response=agentResponse(state);
    assert.equal(response.job.status,'running',match);assert.equal(response.job.startedAt,'08:10',match);assert.equal(response.handoff.status,'sent',match);assert.equal(response.handoff.snapshot.jobStatus,'running',match);assert.equal(response.needsDecision,true,match);
    assert.match(response.decision.detail,/RUN-017 was confirmed started at 08:10/);assert.doesNotMatch(response.decision.detail,/No autonomous change has started|No response change has started/);
    assert.equal(response.activity.some(item=>item.title==='Controller job started'),true);assert.equal(response.activity.some(item=>item.title==='Response assessed'),true);assert.equal(response.activity.some(item=>item.title==='Permitted response prepared'),true);
  }
});

test('a device handoff cannot inherit a simultaneous interface controller job or utilization',()=>{
  let state=at(7);
  assert.equal(agentResponse(state).job.id,'RUN-017');
  assert.equal(agentResponse(state).job.status,'running');
  state=reduceAgent(state,{type:'AGENT_NOTE',id:'device',value:'Independent router reachability investigation'});
  state=syncAgentResponse(reduce(state,{type:'CRITICAL',value:true}));
  const device=agentResponse(state,'device'),handoff=device.handoff;
  assert.equal(handoff.snapshot.alarm,CRITICAL_ALARM);
  assert.equal(handoff.snapshot.observedAt,'08:10');
  assert.equal(handoff.snapshot.observedAt,device.evidence.find(item=>item.source==='Independent reachability checks').time);
  assert.equal(handoff.snapshot.jobStatus,'not-started');
  assert.equal(Object.hasOwn(handoff.snapshot,'utilization'),false);
  assert.equal(handoff.snapshot.notes,'Independent router reachability investigation');
  assert.equal(device.job.status,'not-started');
  assert.equal(agentResponse(state).job.status,'running');
  const captured=structuredClone(handoff);
  state=enterAgentFrame(state,11);
  assert.deepEqual(agentResponse(state,'device').handoff,captured,'later interface completion cannot rewrite delivered device evidence');
  assert.equal(agentResponse(state).job.status,'completed');
});

test('a device handoff uses current reachability time while West interface telemetry is stale',()=>{
  let state=at(7);
  state=enterAgentFrame(state,8);
  state=syncAgentResponse(reduce(state,{type:'GAP',value:'west'}));
  state=syncAgentResponse(reduce(state,{type:'CRITICAL',value:true}));
  const device=agentResponse(state,'device'),handoff=device.handoff,main=agentResponse(state);
  assert.equal(main.evidence.find(item=>item.source==='Interface telemetry').time,'07:58');
  assert.match(main.evidence.find(item=>item.source==='Interface telemetry').value,/73%.*Last known/);
  assert.equal(main.job.status,'running');
  assert.equal(handoff.sent,'08:12');
  assert.equal(handoff.snapshot.observedAt,'08:12');
  assert.equal(handoff.snapshot.observedAt,device.evidence.find(item=>item.source==='Independent reachability checks').time);
  assert.equal(handoff.snapshot.jobStatus,device.job.status);
  assert.equal(handoff.snapshot.jobStatus,'not-started');
  assert.equal(Object.hasOwn(handoff.snapshot,'utilization'),false);
  assert.equal(handoff.snapshot.alarm,CRITICAL_ALARM);
});

test('a collection handoff captures its affected stream without borrowing interface execution or metrics',()=>{
  let state=at(7);
  state=syncAgentResponse(reduce(state,{type:'GAP',value:'east'}));
  state=reduceAgent(state,{type:'AGENT_HANDOFF',id:'monitoring'});
  const collection=agentResponse(state,'monitoring'),handoff=collection.handoff;
  assert.equal(agentResponse(state).job.status,'running');
  assert.equal(handoff.snapshot.scope,collection.scope);
  assert.equal(handoff.snapshot.observedAt,'07:50');
  assert.equal(handoff.snapshot.observedAt,collection.evidence.find(item=>item.label==='Affected source').time);
  assert.equal(handoff.snapshot.jobStatus,'not-started');
  assert.equal(handoff.snapshot.alarm,null);
  assert.equal(Object.hasOwn(handoff.snapshot,'utilization'),false);
});
