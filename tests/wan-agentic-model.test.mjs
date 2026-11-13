import test from 'node:test';
import assert from 'node:assert/strict';
import {MAIN_ALARM,CRITICAL_ALARM,activeAlarms,reduce} from '../src/features/wan/model/model.js';
import {createAgentState,enterAgentFrame,syncAgentResponse,agentResponse,agentQueue,reduceAgent,agentFrameTitle,agentHandover} from '../src/features/wan/model/agentic-model.js';
const at=(index,overrides={})=>enterAgentFrame(createAgentState(overrides),index);
const ask=(s,id,question)=>reduceAgent(s,{type:'AGENT_ASK',id,question}).agentic.messages.at(-1).text;

test('qualifying source alarms are owned automatically without changing their severity',()=>{
 const s=at(2),alarm=activeAlarms(s).find(a=>a.id===MAIN_ALARM);
 assert.equal(alarm.severity,'Major');assert.equal(alarm.active,true);assert.equal(alarm.ack.actor,'CW AI');assert.equal(alarm.ack.time,'08:00');
 assert.equal(agentResponse(s).stage,'Investigating');assert.equal(s.escalation.status,'none');assert.equal(s.playbook.status,'none');assert.equal(agentQueue(at(0)).length,0);assert.equal(agentResponse(at(1)).stage,'Checking trend');
});

test('the autonomous response reaches actual execution then independent network recovery',()=>{
 let s=createAgentState();for(let i=2;i<=7;i++)s=enterAgentFrame(s,i);
 let r=agentResponse(s);assert.equal(r.stage,'Remediating');assert.equal(r.job.id,'RUN-017');assert.equal(r.job.status,'running');assert.equal(r.job.startedAt,'08:10');assert.equal(r.owner,'CW AI');
 s=enterAgentFrame(s,10);r=agentResponse(s);assert.equal(r.stage,'Verifying');assert.equal(r.resolved,false);assert.equal(s.playbook.status,'completed');assert.equal(activeAlarms(s).find(a=>a.id===MAIN_ALARM).active,true);
 s=enterAgentFrame(s,11);r=agentResponse(s);assert.equal(r.resolved,true);assert.equal(s.verified,true);assert.equal(r.stage,'Resolved');assert.equal(r.criteria.every(c=>c.met),true);assert.equal(activeAlarms(s).length,0);assert.match(agentHandover(s),/Acknowledgement: confirmed by CW AI/);assert.doesNotMatch(agentHandover(s),/Arun|Traffic Engineering|accepted by Priya/);
});

test('missing or unavailable catalogue builds a graph-derived plan without a human handoff',()=>{
 for(const match of ['no-match','unavailable']){
  let s=at(5,{match}),r=agentResponse(s);assert.equal(r.plan.origin,'graph-derived');assert.equal(r.plan.status,'validating');assert.equal(r.needsDecision,false);assert.equal(r.handoff,null);assert.deepEqual(s.agentic.handoffs,{});assert.equal(r.job.status,'not-started');
  s=enterAgentFrame(s,6);assert.equal(agentResponse(s).plan.status,'ready');s=enterAgentFrame(s,7);assert.equal(agentResponse(s).job.status,'running');s=enterAgentFrame(s,11);assert.equal(agentResponse(s).resolved,true);assert.equal(s.escalation.status,'none');
 }
});

test('authority and target-lock restrictions retain agent ownership and block unsupported execution',()=>{
 for(const match of ['restricted','precheck']){
  const s=at(11,{match}),r=agentResponse(s);assert.equal(r.needsDecision,false);assert.equal(r.decision,null);assert.equal(r.handoff,null);assert.equal(r.blocker.owner,'CW AI');assert.equal(r.blocker.status,'blocked');assert.equal(r.plan.status,'blocked');assert.equal(r.plan.selectedId,null);assert.equal(r.plan.alternatives[1].status,'blocked');assert.equal(r.job.status,'not-started');assert.equal(r.resolved,false);assert.equal(s.verified,false);assert.equal(r.steps.find(x=>x.id==='remediate').status,'blocked');
 }
});

test('failed and unknown results remain unresolved and cannot show completed remediation',()=>{
 for(const runOutcome of ['failed','unknown']){
  const s=at(11,{runOutcome}),r=agentResponse(s);assert.equal(r.job.status,runOutcome);assert.equal(r.resolved,false);assert.equal(r.needsDecision,false);assert.equal(r.stage,'Reconciling');assert.equal(r.blocker.owner,'CW AI');assert.equal(r.handoff,null);assert.equal(s.verified,false);assert.match(r.next,/Reconcile/);assert.equal(r.plan.selectedId,null);assert.equal(r.plan.alternatives[1].status,'blocked');assert.doesNotMatch(ask(s,'interface','Why this response?'),/selects a 60%/);assert.equal(r.job.steps.some(x=>x.label==='Apply validated SR policy response'&&x.status==='complete'),false);
  assert.equal(r.steps.find(x=>x.id==='remediate').status,runOutcome==='failed'?'error':'unknown');assert.equal(r.steps.find(x=>x.id==='verify').status,'pending');assert.equal(r.activity.find(x=>x.title===(runOutcome==='failed'?'Controller job failed':'Controller result unavailable')).status,runOutcome==='failed'?'error':'unknown');
 }
});

test('recorded reconciliation creates a separate confirmed retry and retains the original result',()=>{
 for(const runOutcome of ['failed','unknown']){
  let s=at(10,{runOutcome,reconciliation:'verified-retry'}),r=agentResponse(s);
  assert.equal(r.job.id,'RUN-017');assert.equal(r.job.status,runOutcome);assert.equal(r.reconciliation.status,'collecting');assert.equal(r.reconciliation.sources.length,0);assert.doesNotMatch(JSON.stringify(r),/08:26|08:27|08:29|RUN-018/);
  s=enterAgentFrame(s,11);r=agentResponse(s);assert.equal(r.job.id,'RUN-018');assert.equal(r.job.status,'completed');assert.equal(r.job.startedAt,'08:27');assert.equal(r.job.completedAt,'08:29');assert.equal(r.priorJobs[0].id,'RUN-017');assert.equal(r.priorJobs[0].status,runOutcome);assert.equal(r.reconciliation.time,'08:26');assert.equal(r.reconciliation.sources.length,2);assert.equal(r.resolved,true);assert.equal(r.activity.some(e=>e.title==='Original execution reconciled'),true);assert.equal(r.activity.some(e=>e.title==='Revalidated response completed'),true);assert.match(r.recoveryProof,/RUN-018/);
 }
});

test('a retry source cannot override stale observations, pause state or current authority',()=>{
 for(const overrides of [{gap:'west'},{match:'restricted'},{match:'precheck'}]){
  let s=at(7,{runOutcome:'failed',reconciliation:'verified-retry'});s=syncAgentResponse({...s,...overrides});s=enterAgentFrame(s,11);const r=agentResponse(s);
  assert.equal(r.job.id,'RUN-017');assert.equal(r.job.status,'failed');assert.equal(r.resolved,false);assert.equal(r.reconciliation.retryConfirmed,false);
 }
 let paused=reduceAgent(at(7,{runOutcome:'unknown',reconciliation:'verified-retry'}),{type:'AGENT_PAUSE'});paused=enterAgentFrame(paused,11);assert.equal(agentResponse(paused).job.id,'RUN-017');assert.equal(agentResponse(paused).resolved,false);
});

test('a collection gap preserves source severity and blocks new changes and verification',()=>{
 const s=at(10,{gap:'west'}),r=agentResponse(s);assert.equal(r.job.status,'not-started');assert.equal(r.resolved,false);assert.equal(r.needsDecision,false);assert.equal(r.currentAgent,'Collection agent');assert.equal(r.steps.some(x=>x.status==='blocked'),true);assert.equal(r.evidence[0].fresh,false);assert.match(r.evidence[0].value,/Last known/);assert.equal(activeAlarms(s).find(a=>a.id===MAIN_ALARM).severity,'Major');assert.equal(agentQueue(s).some(x=>x.id==='monitoring'),true);
});

test('a gap after job start cannot erase the actual result or establish recovery',()=>{
 let s=at(7);s=syncAgentResponse(reduce(s,{type:'GAP',value:'west'}));s=enterAgentFrame(s,11);const r=agentResponse(s);
 assert.equal(r.job.status,'completed');assert.equal(r.resolved,false);assert.equal(s.verified,false);assert.equal(r.criteria.find(x=>x.id==='fresh').met,false);
});

test('historical inspection cannot start execution, retry or record a current recovery',()=>{
 const s=syncAgentResponse({...createAgentState(),frame:11,history:0,reconciliation:'verified-retry'}),r=agentResponse(s);
 assert.equal(r.resolved,false);assert.equal(s.verified,false);assert.equal(r.job.status,'not-started');assert.equal(r.criteria.find(x=>x.id==='fresh').met,false);assert.equal(r.historical,true);
});

test('source progression preserves selected scope, operator context, draft and conversation',()=>{
 let s=at(3,{view:'pop',domain:'Coastal',popId:'COASTAL-01',selection:'XR-P1',scopePage:2,panel:'evidence',notes:'Watch note',networkContext:{mainDomain:'Coastal',mainDomainLabel:'Coastal',mainGroup:'COASTAL-01'}});
 s=reduceAgent(s,{type:'AGENT_NOTE',id:'interface',value:'Retain source context'});s=reduceAgent(s,{type:'AGENT_ASK',question:'Why this response?'});s=enterAgentFrame(s,7);
 assert.equal(s.view,'pop');assert.equal(s.domain,'Coastal');assert.equal(s.popId,'COASTAL-01');assert.equal(s.selection,'XR-P1');assert.equal(s.scopePage,2);assert.equal(s.panel,'evidence');assert.equal(s.notes,'Watch note');assert.equal(s.agentic.notes.interface,'Retain source context');assert.equal(s.agentic.messages.length,2);assert.match(agentResponse(s).scope,/Coastal \/ COASTAL-01/);
});

test('pause holds further changes while retaining the running job and observation',()=>{
 let s=reduceAgent(at(7),{type:'AGENT_PAUSE'}),r=agentResponse(s);assert.equal(r.stage,'Paused');assert.equal(r.job.status,'running');assert.match(r.currentWork,/running job remains under observation/);
 s=reduceAgent(s,{type:'AGENT_RESUME'});assert.equal(agentResponse(s).stage,'Remediating');assert.equal(agentResponse(s).job.id,'RUN-017');
});

test('late resume does not invent execution while current readings improve',()=>{
 let s=reduceAgent(at(6),{type:'AGENT_PAUSE'});s=enterAgentFrame(s,11);assert.equal(agentResponse(s).job.status,'not-started');assert.equal(agentResponse(s).resolved,false);
 s=reduceAgent(s,{type:'AGENT_RESUME'});assert.equal(agentResponse(s).job.status,'not-started');assert.equal(agentResponse(s).resolved,false);assert.match(agentResponse(s).currentWork,/new controller job confirmation/);
});

test('legacy handoff and acceptance actions cannot transfer ownership or authorize a change',()=>{
 for(const id of ['interface','device','monitoring']){
  let s=at(7,{match:'restricted',critical:true,gap:'east'});s=reduceAgent(s,{type:'AGENT_HANDOFF',id});s=reduceAgent(s,{type:'AGENT_ACCEPT',id});
  assert.deepEqual(s.agentic.handoffs,{});assert.equal(s.escalation.status,'none');assert.equal(agentResponse(s,id).owner,'CW AI');assert.equal(agentResponse(s,id).handoff,null);assert.equal(agentResponse(s).job.status,'not-started');
 }
});

test('simultaneous cases retain independent source identities and acknowledgement times',()=>{
 const s=at(3,{critical:true,criticalDetected:'08:00',gap:'east',networkContext:{criticalDomain:'Enterprise',criticalDomainLabel:'Enterprise'}}),q=agentQueue(s);
 assert.deepEqual(q.map(r=>r.id),['device','interface','monitoring']);assert.equal(s.acknowledgements[CRITICAL_ALARM].actor,'CW AI');assert.equal(q.find(r=>r.id==='device').acknowledgement.time,'08:00');assert.match(q.find(r=>r.id==='device').scope,/Enterprise/);assert.equal(q.find(r=>r.id==='monitoring').resolved,false);assert.equal(activeAlarms(s).length,2);
});

test('questions explain a case without silently issuing workflow commands',()=>{
 let s=at(7),before=agentResponse(s);s=reduceAgent(s,{type:'AGENT_ASK',id:'interface',question:'Why this response?'});
 assert.equal(s.agentic.messages.length,2);assert.equal(s.agentic.messages[1].incident,'interface');assert.match(s.agentic.messages[1].text,/PB-NOC-17/);assert.equal(agentResponse(s).job.status,before.job.status);assert.equal(s.agentic.paused,false);assert.equal(s.frame,7);
 s=reduceAgent(s,{type:'AGENT_ASK',question:'Cancel this change now'});assert.match(s.agentic.messages.at(-1).text,/does not pause, cancel/);assert.equal(s.agentic.paused,false);assert.equal(agentResponse(s).job.status,'running');
});

test('replay clears future execution and resolution facts',()=>{
 let s=at(11,{runOutcome:'failed',reconciliation:'verified-retry'});s=enterAgentFrame(s,2);assert.equal(agentResponse(s).job.status,'not-started');assert.equal(s.verified,false);assert.equal(agentResponse(s).stage,'Investigating');assert.equal(s.escalation.status,'none');assert.equal(s.acknowledgements[MAIN_ALARM].actor,'CW AI');assert.equal(agentFrameTitle(4),'Correlate the evidence');assert.equal(agentFrameTitle(99),'Recovery verified');
});

test('interface change questions receive recorded source values',()=>{
 const s=at(7),answer=ask(s,'interface','What changed since the previous observation?');assert.match(answer,/93% at 08:10/);assert.match(answer,/preceding recorded snapshot/);assert.equal(s.agentic.paused,false);
});

test('device questions cannot borrow interface utilization, policy or recovery proof',()=>{
 const s=at(8,{critical:true,gap:'east'});
 const change=ask(s,'device','What changed?');assert.match(change,/Unreachable/);assert.match(change,/08:12/);assert.doesNotMatch(change,/92%|93%|SR-PE-W1-PE-E1/);
 const impact=ask(s,'device','What else is affected?');assert.match(impact,/XR-PE-E2/);assert.doesNotMatch(impact,/SR-PE-W1-PE-E1|Color 100/);assert.doesNotMatch(ask(s,'device','Is recovery complete?'),/below 80|08:30|08:35/);
});

test('collection restoration answers use its stream and source time, not future interface proof',()=>{
 let s=at(8,{gap:'west'});s=syncAgentResponse(reduce(s,{type:'GAP',value:'none'}));const r=agentResponse(s,'monitoring'),answer=ask(s,'monitoring','Is recovery complete?');
 assert.equal(r.resolved,true);assert.match(answer,/telemetry|Telemetry/);assert.match(answer,/08:12/);assert.doesNotMatch(answer,/below 80|08:30|08:35|RUN-017|SR-PE-W1-PE-E1/);assert.match(ask(s,'monitoring','Has the collection response completed?'),/confirmed current at 08:12/);assert.match(ask(s,'monitoring','What changed?'),/Collection status is Current/);
});

test('a scope restriction remains owned and can recover only after explicit current authority changes',()=>{
 let s=at(5,{match:'restricted'});assert.equal(agentResponse(s).blocker.owner,'CW AI');assert.equal(agentResponse(s).needsDecision,false);s=syncAgentResponse(reduce(s,{type:'MATCH',value:'available'}));s=enterAgentFrame(s,7);assert.equal(agentResponse(s).job.status,'running');
});

test('no-match plans retain inspectable relationships and numerical projections separately from observations',()=>{
 const early=agentResponse(at(4,{match:'no-match'}));assert.deepEqual(early.plan.alternatives,[]);assert.equal(early.plan.sources.some(x=>x.id==='CAPACITY-0805'),false);
 const r=agentResponse(at(5,{match:'no-match'}));assert.equal(r.plan.origin,'graph-derived');assert.equal(r.plan.relationships.some(x=>x.from===MAIN_ALARM),true);assert.equal(r.plan.alternatives[0].projectedUtilization,81);assert.equal(r.plan.alternatives[0].status,'rejected');assert.equal(r.plan.alternatives[1].projectedUtilization,60);assert.equal(r.plan.selectedId,'candidate-b');assert.match(r.plan.sources.find(x=>x.id==='CAPACITY-0805').detail,/Projections are separate/);assert.equal(r.evidence[0].value,'91%');
});

test('target lock and current authority changes cannot erase a confirmed execution',()=>{
 for(const match of ['precheck','restricted']){
  let s=at(7);s=syncAgentResponse(reduce(s,{type:'MATCH',value:match}));const r=agentResponse(s);assert.equal(r.job.status,'running');assert.equal(r.job.startedAt,'08:10');assert.equal(r.blocker.owner,'CW AI');assert.match(r.blocker.detail,/RUN-017 remains running/);assert.equal(r.resolved,false);assert.equal(r.activity.some(x=>x.title==='Controller job started'),true);
 }
 for(const match of ['no-match','unavailable']){let s=at(7);s=syncAgentResponse(reduce(s,{type:'MATCH',value:match}));assert.equal(agentResponse(s).job.status,'running');assert.equal(agentResponse(s).plan.origin,'graph-derived');assert.equal(agentResponse(s).handoff,null);}
});

test('independent router fault starts agent-owned investigation without an operator action',()=>{
 const s=createAgentState({critical:true,criticalDetected:'07:55',networkContext:{criticalDomainLabel:'Enterprise'}}),r=agentResponse(s,'device');
 assert.equal(r.acknowledgement.actor,'CW AI');assert.equal(r.handoff,null);assert.equal(r.needsDecision,false);assert.equal(r.owner,'CW AI');assert.match(r.scope,/Enterprise/);assert.equal(r.plan.status,'investigating');assert.equal(r.resolved,false);assert.equal(r.job.id,null);
});

test('drafts remain attached to their selected incident',()=>{
 let s=at(3,{critical:true});s=reduceAgent(s,{type:'AGENT_DRAFT',id:'interface',value:'Why this interface response?'});s=reduceAgent(s,{type:'AGENT_SELECT',incident:'device'});assert.equal(s.agentic.draft,'');s=reduceAgent(s,{type:'AGENT_DRAFT',id:'device',value:'What do the reachability checks say?'});s=reduceAgent(s,{type:'AGENT_SELECT',incident:'interface'});assert.equal(s.agentic.draft,'Why this interface response?');s=reduceAgent(s,{type:'AGENT_ASK',id:'interface',question:s.agentic.draft});assert.equal(s.agentic.draft,'');s=reduceAgent(s,{type:'AGENT_SELECT',incident:'device'});assert.equal(s.agentic.draft,'What do the reachability checks say?');
});

test('quiet secondary cases never fabricate a fault or source gap',()=>{
 const s=createAgentState(),d=agentResponse(s,'device'),c=agentResponse(s,'monitoring');assert.equal(d.stage,'Monitoring');assert.equal(d.needsDecision,false);assert.equal(d.acknowledgement,null);assert.equal(d.handoff,null);assert.equal(d.evidence.find(x=>x.label==='Reachability').value,'Reachable');assert.doesNotMatch(JSON.stringify(d.evidence),/Critical|Unreachable/);assert.equal(c.stage,'Monitoring');assert.equal(c.resolved,false);assert.equal(c.evidence.every(x=>x.fresh),true);assert.equal(c.activity.length,0);assert.equal(agentQueue(s).length,0);
});

test('router and collection restoration retain their own recorded source outcome without a repair job',()=>{
 let s=at(3,{critical:true,criticalDetected:'08:00',gap:'east'});s=syncAgentResponse(reduce(s,{type:'GAP',value:'none'}));const c=agentResponse(s,'monitoring');assert.equal(c.stage,'Resolved');assert.equal(c.resolved,true);assert.equal(c.criteria.every(x=>x.met),true);assert.equal(c.job.id,null);assert.equal(c.activity.some(x=>x.title==='Collection restored'),true);assert.equal(s.agentic.monitoringRecord.restoredAt,'08:01');
 s=syncAgentResponse(reduce(s,{type:'CRITICAL',value:false}));const d=agentResponse(s,'device');assert.equal(d.stage,'Resolved');assert.equal(d.resolved,true);assert.equal(d.evidence[0].value,'Reachable');assert.equal(d.criteria.every(x=>x.met),true);assert.equal(d.job.id,null);assert.equal(d.activity.some(x=>x.title==='Reachability source restored'),true);assert.equal(s.agentic.deviceRecord.clearedAt,'08:01');assert.equal(activeAlarms(s).some(x=>x.id===CRITICAL_ALARM),false);
});

test('a device case cannot inherit a simultaneous interface job or stale interface timestamp',()=>{
 let s=at(7);s=enterAgentFrame(s,8);s=syncAgentResponse(reduce(s,{type:'GAP',value:'west'}));s=syncAgentResponse(reduce(s,{type:'CRITICAL',value:true}));const d=agentResponse(s,'device'),r=agentResponse(s);
 assert.equal(r.job.status,'running');assert.match(r.evidence[0].value,/73%.*Last known/);assert.equal(r.evidence[0].time,'07:58');assert.equal(d.job.status,'not-started');assert.equal(d.evidence.find(x=>x.source==='Independent reachability checks').time,'08:12');assert.equal(d.plan.sources.some(x=>/RUN-017|73%|07:58/.test(JSON.stringify(x))),false);
});

test('plans are pure projections with independently owned record arrays',()=>{
 const s=at(7),copy=structuredClone(s),r=agentResponse(s);r.plan.alternatives[0].projectedUtilization=0;r.plan.sources[0].detail='changed';assert.deepEqual(s,copy);assert.equal(agentResponse(s).plan.alternatives[0].projectedUtilization,81);assert.notEqual(agentResponse(s).plan.sources[0].detail,'changed');
});

test('confirmed revised execution survives later authority, collection and pause changes',()=>{
 for(const runOutcome of ['failed','unknown']){
  const confirmed=at(11,{runOutcome,reconciliation:'verified-retry'});
  const variants=[syncAgentResponse(reduce(confirmed,{type:'MATCH',value:'restricted'})),syncAgentResponse(reduce(confirmed,{type:'GAP',value:'west'})),reduceAgent(confirmed,{type:'AGENT_PAUSE'})];
  for(const s of variants){const r=agentResponse(s);assert.equal(r.job.id,'RUN-018');assert.equal(r.job.status,'completed');assert.equal(r.job.completedAt,'08:29');assert.equal(r.priorJobs.length,1);assert.equal(r.priorJobs[0].id,'RUN-017');assert.equal(r.priorJobs[0].status,runOutcome);assert.equal(r.reconciliation.retryConfirmed,true);assert.equal(r.activity.some(e=>e.title==='Revalidated response completed'),true);}
  assert.equal(agentResponse(variants[0]).resolved,false);assert.equal(agentResponse(variants[1]).resolved,false);
  const changedFixture=syncAgentResponse({...confirmed,reconciliation:'pending',runOutcome:'completed'});assert.equal(agentResponse(changedFixture).job.id,'RUN-018');assert.equal(agentResponse(changedFixture).priorJobs[0].status,runOutcome);
 }
});

test('replay removes future revised execution while a blocked retry does not claim execution',()=>{
 const confirmed=at(11,{runOutcome:'failed',reconciliation:'verified-retry'}),rewound=enterAgentFrame(confirmed,10),r=agentResponse(rewound);
 assert.equal(rewound.agentic.runtime.retryConfirmed,false);assert.equal(rewound.agentic.runtime.retryOriginalStatus,null);assert.equal(r.job.id,'RUN-017');assert.equal(r.job.status,'failed');assert.deepEqual(r.priorJobs,[]);assert.equal(r.reconciliation.retryConfirmed,false);assert.doesNotMatch(JSON.stringify(r),/RUN-018|08:26|08:27|08:29/);
 let blocked=at(7,{runOutcome:'unknown',reconciliation:'verified-retry'});blocked=syncAgentResponse(reduce(blocked,{type:'GAP',value:'west'}));blocked=enterAgentFrame(blocked,11);assert.match(agentResponse(blocked).reconciliation.detail,/retry awaits/);assert.doesNotMatch(agentResponse(blocked).reconciliation.detail,/revised execution record is retained/);
});

test('a new router fault cannot overwrite the retained source-restoration outcome',()=>{
 let s=at(2,{critical:true,criticalDetected:'08:00'});s=enterAgentFrame(s,3);s=syncAgentResponse(reduce(s,{type:'CRITICAL',value:false}));const retained=structuredClone(s.agentic.sourceOutcomes);
 assert.equal(retained.length,1);assert.equal(retained[0].kind,'device');assert.equal(retained[0].startedAt,'08:00');assert.equal(retained[0].clearedAt,'08:01');assert.equal(retained[0].target,'XR-PE-E2');assert.equal(Object.hasOwn(retained[0],'job'),false);
 s=syncAgentResponse(s);assert.deepEqual(s.agentic.sourceOutcomes,retained);s=enterAgentFrame(s,4);s=syncAgentResponse(reduce(s,{type:'CRITICAL',value:true}));assert.deepEqual(s.agentic.sourceOutcomes,retained);assert.equal(s.agentic.deviceRecord.startedAt,'08:03');assert.equal(s.agentic.deviceRecord.clearedAt,null);assert.equal(agentResponse(s,'device').resolved,false);
});

test('a different collection gap preserves completed stream evidence and replay removes future outcomes',()=>{
 let s=at(3,{gap:'west'});s=enterAgentFrame(s,4);s=syncAgentResponse(reduce(s,{type:'GAP',value:'none'}));const retained=structuredClone(s.agentic.sourceOutcomes);
 assert.equal(retained.length,1);assert.equal(retained[0].kind,'monitoring');assert.equal(retained[0].gap,'west');assert.equal(retained[0].restoredAt,'08:03');assert.equal(retained[0].lastObservedAt,'07:58');assert.match(retained[0].scope,/XR-P1 and XR-P2/);
 s=enterAgentFrame(s,5);s=syncAgentResponse(reduce(s,{type:'GAP',value:'east'}));assert.deepEqual(s.agentic.sourceOutcomes,retained);assert.equal(s.agentic.monitoringRecord.gap,'east');assert.equal(s.agentic.monitoringRecord.lastObservedAt,'07:50');assert.equal(s.agentic.monitoringRecord.restoredAt,null);
 const copy=structuredClone(s);const projected=syncAgentResponse(s);projected.agentic.sourceOutcomes[0].scope='changed';assert.deepEqual(s,copy);
 s=enterAgentFrame(s,4);assert.equal(s.agentic.sourceOutcomes.length,1);s=enterAgentFrame(s,2);assert.deepEqual(s.agentic.sourceOutcomes,[]);
});
