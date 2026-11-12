// Illustrative controller observations. No action reaches a network or another person.
export const NODES = [
  ['XR-PE-W1', 'West', 9, 25, 'PE'], ['XR-PE-W2', 'West', 9, 74, 'PE'],
  ['XR-P1', 'West', 27, 34, 'P'], ['XR-P4', 'West', 27, 67, 'P'],
  ['XR-P2', 'Core', 48, 34, 'P'], ['XR-P3', 'Core', 49, 67, 'P'],
  ['XR-P5', 'Core', 50, 10, 'P'], ['XR-PE-S1', 'Core', 50, 84, 'PE'],
  ['XR-P6', 'East', 73, 34, 'P'], ['XR-P7', 'East', 73, 67, 'P'],
  ['XR-PE-E1', 'East', 91, 25, 'PE'], ['XR-PE-E2', 'East', 91, 74, 'PE'],
].map(([id, domain, x, y, role]) => ({id, domain, x, y, role}));
export const LINKS = [
  ['w1-p1', 'XR-PE-W1', 'XR-P1'], ['w1-p4', 'XR-PE-W1', 'XR-P4'],
  ['w2-p4', 'XR-PE-W2', 'XR-P4'], ['w2-p1', 'XR-PE-W2', 'XR-P1'],
  ['p1-p2', 'XR-P1', 'XR-P2'], ['p4-p3', 'XR-P4', 'XR-P3'],
  ['p1-p4', 'XR-P1', 'XR-P4'], ['p2-p3', 'XR-P2', 'XR-P3'],
  ['p2-p5', 'XR-P2', 'XR-P5'], ['p3-p5', 'XR-P3', 'XR-P5'],
  ['p2-p6', 'XR-P2', 'XR-P6'], ['p3-p7', 'XR-P3', 'XR-P7'],
  ['p6-p7', 'XR-P6', 'XR-P7'], ['p6-e1', 'XR-P6', 'XR-PE-E1'],
  ['p7-e2', 'XR-P7', 'XR-PE-E2'], ['p3-s1', 'XR-P3', 'XR-PE-S1'],
].map(([id, from, to]) => ({id, from, to}));
export const TARGET = 'p1-p2';
export const INTERFACE = 'HundredGigE0/0/0/0';
export const MAIN_ALARM = 'CNC-1042';
export const CRITICAL_ALARM = 'CNC-2086';
export const THRESHOLD = 80;
export const FRAMES = [
  ['07:55', 'Take the watch', 'Establish the network state and the freshness of its observations.', 46, 'The network is within configured limits. Known maintenance remains visible.'],
  ['07:58', 'A trend worth watching', 'Recognize a rising metric before a configured alarm is raised.', 73, 'West link utilization is increasing. No threshold alarm has been reported.'],
  ['08:00', 'A new interface alarm', 'Locate the new alarm and the affected XR interface.', 87, 'A Major utilization alarm identifies XR-P1 and its link to XR-P2.'],
  ['08:01', 'Inspect the evidence', 'Identify the target, threshold, source time, and related SR policy.', 89, 'The selected link and alarm share one context. Service impact is additional evidence.'],
  ['08:03', 'Acknowledge the alarm', 'Record acknowledgement while retaining the unresolved condition.', 90, 'Priya has acknowledged the alarm. The interface condition remains active.'],
  ['08:05', 'Determine the response', 'Establish whether an approved response applies and is permitted.', 91, 'No applicable approved playbook is available. Engineering review is required.'],
  ['08:07', 'Escalate with context', 'Send the reviewed investigation and track delivery separately from acceptance.', 93, 'The handover is delivered to Traffic Engineering and awaits acceptance.'],
  ['08:10', 'Engineering accepts', 'Confirm the responsible engineer and the accepted handover.', 93, 'Arun has accepted the escalation. The active alarm remains in the watch.'],
  ['08:12', 'Continue the wider watch', 'Resume monitoring while the condition remains assigned.', 92, 'The panel recedes. The alarm retains its owner, severity, and latest observation.'],
  ['08:20', 'Follow the engineering job', 'Observe the engineering response within NOC permissions.', 90, 'Arun is applying the reviewed SR policy change. Priya monitors the affected scope.'],
  ['08:25', 'Job complete; verify', 'Separate execution success from the observed network outcome.', 86, 'The job completed. Utilization is still above threshold and the alarm is active.'],
  ['08:35', 'Observe and verify recovery', 'Record the supported recovery and preserve outstanding engineering work.', 54, 'The source cleared the alarm. Five minutes of observations meet the verification criteria.'],
].map(([time, title, outcome, utilization, description], index) => ({index, time, title, outcome, utilization, description}));

export const MATCHES = {
  'no-match': {title:'No applicable approved playbook', detail:'This condition requires Traffic Engineering review. CW AI can assemble the observed evidence for escalation.'},
  available: {title:'Approved playbook available', detail:'PB-NOC-17 · Interface congestion response · version 3.2. Applicable to this target and permitted for the NOC role.'},
  restricted: {title:'Execution permission required', detail:'A matching playbook exists. The NOC role is not permitted to execute its engineering changes.'},
  precheck: {title:'Prerequisite not satisfied', detail:'A parallel configuration job holds the target lock. Execution is blocked until the lock is released and checks are repeated.'},
  unavailable: {title:'Playbook assessment unavailable', detail:'The catalogue could not be reached. Applicability has not been established. Retry the lookup or escalate with this gap.'},
};
export function createState() {
  return {
    frame:0, selection:null, panel:'evidence', domain:'All domains', alarmFilter:'all',
    view:'network', popId:null, scopePage:0, returnView:null,
    gap:'none', critical:false, related:false, match:'no-match', runOutcome:'completed',
    acknowledgements:{}, ackPending:null, escalation:{status:'none'}, notes:'',
    playbook:{status:'none', step:0}, verified:false, history:null, replay:false,
    events:[], expandedGroup:true, highlightPolicy:false,
  };
}
export function frameAt(value) { return FRAMES[Math.max(0, Math.min(FRAMES.length - 1, Number(value) || 0))]; }
export function currentFrame(state) { return frameAt(state.frame); }
export function viewedFrame(state) { return frameAt(state.history ?? state.frame); }
export function westFresh(state) { return state.gap !== 'west'; }
export function observations(state, historical = false) {
  const frame = historical ? viewedFrame(state) : currentFrame(state);
  return {
    ...frame, threshold:THRESHOLD, interface:INTERFACE,
    observedAt:!historical && !westFresh(state) ? (frame.index >= 1 ? '07:58' : '07:50') : frame.time,
    utilization:!historical && !westFresh(state) ? (frame.index >= 1 ? 73 : 40) : frame.utilization,
    fresh:historical || westFresh(state),
    stableMinutes:frame.index === 11 ? 5 : 0,
    sourceCleared:frame.index === 11,
    path:frame.index >= 10 ? ['w1-p4','p4-p3','p3-p7','p6-p7','p6-e1'] : ['w1-p1','p1-p2','p2-p6','p6-e1'],
  };
}
export function allAlarms(state) {
  const result = [];
  if (state.frame >= 2) result.push({id:MAIN_ALARM, severity:'Major', title:'Interface utilization above threshold', target:'XR-P1 → XR-P2', object:TARGET, domain:state.networkContext?.mainDomain||'West', detected:'08:00', active:state.frame < 11, group:'West interface'});
  if (state.related && state.frame >= 2) {
    result.push({id:'CNC-1043', severity:'Minor', title:'Output queue drops detected', target:`XR-P1 · ${INTERFACE}`, object:TARGET, domain:state.networkContext?.mainDomain||'West', detected:'08:00', active:state.frame < 11, group:'West interface'});
    result.push({id:'CNC-1044', severity:'Minor', title:'Interface discard rate above threshold', target:'XR-P2 · HundredGigE0/0/0/1', object:TARGET, domain:state.networkContext?.transitDomain||'Core', detected:'08:00', active:state.frame < 11, group:'West interface'});
  }
  if (state.critical) result.push({id:CRITICAL_ALARM, severity:'Critical', title:'Device unreachable', target:'XR-PE-E2', object:'XR-PE-E2', domain:state.networkContext?.criticalDomain||'East', detected:state.criticalDetected || currentFrame(state).time, active:true});
  return result.map(a => ({...a, acknowledged:!!state.acknowledgements[a.id], ack:state.acknowledgements[a.id] || null}));
}
export function activeAlarms(state) { return allAlarms(state).filter(a => a.active); }
export function visibleAlarms(state) {
  return activeAlarms(state).filter(a => (state.domain === 'All domains' || a.domain === state.domain) && (state.alarmFilter !== 'new' || !a.acknowledged));
}
export function alarmCounts(state) {
  const alarms = activeAlarms(state);
  return {total:alarms.length, critical:alarms.filter(a => a.severity === 'Critical').length, major:alarms.filter(a => a.severity === 'Major').length, minor:alarms.filter(a => a.severity === 'Minor').length, unacknowledged:alarms.filter(a => !a.acknowledged).length};
}
export function networkStatus(state) {
  const counts = alarmCounts(state);
  if (counts.critical) return {tone:'critical', title:state.acknowledgements[CRITICAL_ALARM] ? 'Active Critical alarm · Response recorded' : 'Critical alarm requires attention', text:`${counts.total} active ${counts.total === 1 ? 'alarm' : 'alarms'} · ${state.acknowledgements[CRITICAL_ALARM] ? 'Device alarm remains active' : 'New device alarm'} in ${state.networkContext?.criticalDomainLabel||'East'}`};
  if (counts.total) return {tone:'major', title:state.escalation.status === 'accepted' ? 'Active condition · Engineering engaged' : 'Active condition requires response', text:`${counts.total} active ${counts.total === 1 ? 'alarm' : 'alarms'} · ${state.networkContext?.mainDomainLabel||'West'} interface alarm${state.gap !== 'none' ? ' · Monitoring gap remains' : ' · Utilization above threshold'}`};
  if (state.gap !== 'none') return {tone:'unknown', title:'Monitoring coverage degraded', text:`${state.gap === 'west' ? (state.networkContext?.mainDomainLabel||'West')+' interface metrics' : (state.networkContext?.criticalDomainLabel||'East')+' device telemetry'} unavailable · Last-known observations retained`};
  if (state.frame === 11) return {tone:'positive', title:'Observed network recovery', text:'Utilization within limits · Source alarm cleared · Engineering follow-up remains open'};
  if (state.frame === 1) return {tone:'positive', title:'Network within configured limits', text:'A rising utilization trend is being watched · No active alarms'};
  return {tone:'positive', title:'Network operating as expected', text:'All monitored devices reachable · Interface observations within configured limits'};
}
export function verificationCriteria(state) {
  const o = observations(state);
  return [
    {id:'fresh', label:'Current interface observations', detail:o.fresh ? `Observed ${o.observedAt} · Interface telemetry` : `Unavailable · Last observed ${o.observedAt}`, met:o.fresh},
    {id:'metric', label:'Utilization below 80%', detail:`${o.utilization}%${o.fresh ? '' : ' · Last known; current reading unavailable'} · ${INTERFACE}`, met:o.fresh && o.utilization < THRESHOLD},
    {id:'window', label:'Within limits for 5 minutes', detail:!o.fresh ? 'Observation window cannot be established while collection is unavailable' : o.stableMinutes ? 'Observed 08:30–08:35 · No collection gaps' : 'Required observation window not yet satisfied', met:o.fresh && o.stableMinutes >= 5},
    {id:'alarm', label:'Alarm cleared by source', detail:o.sourceCleared ? `${MAIN_ALARM} · Cleared 08:30` : `${MAIN_ALARM} · Active`, met:o.sourceCleared},
  ];
}
export function canVerify(state) { return state.history === null && state.frame >= 2 && verificationCriteria(state).every(c => c.met); }
export function canAcknowledge(state, id) { return state.history === null && !state.ackPending && allAlarms(state).some(a => a.id === id && a.active && !a.acknowledged); }
export function canExecute(state) { return state.history === null && state.selection === TARGET && state.match === 'available' && westFresh(state) && state.frame >= 2 && state.frame < 11 && state.playbook.status === 'none'; }
const appendEvent = (state, title, detail = '') => [...state.events, {time:currentFrame(state).time, title, detail}];
function escalationSnapshot(state) {
  return {notes:state.notes, utilization:observations(state).utilization, observedAt:observations(state).observedAt, fresh:observations(state).fresh, ack:state.acknowledgements[MAIN_ALARM], match:state.match, runStatus:state.playbook.status, active:state.frame < 11};
}

// Story controls advance explicit simulated source snapshots, including recorded actor events.
export function gotoFrame(state, index) {
  const frame = frameAt(index);
  const next = {...state, frame:frame.index, history:null, verified:false, ackPending:null, events:[], playbook:{status:'none', step:0}, acknowledgements:{}, escalation:{status:'none'}};
  if (frame.index >= 4) next.acknowledgements[MAIN_ALARM] = {actor:'Priya', time:'08:03'};
  if (frame.index >= 6) next.escalation = {status:frame.index >= 7 ? 'accepted' : 'sent', sent:'08:07', accepted:frame.index >= 7 ? '08:10' : null, owner:frame.index >= 7 ? 'Arun' : null, snapshot:{...escalationSnapshot(next), utilization:93, observedAt:'08:07', active:true}};
  next.verified = frame.index === 11 && state.gap !== 'west';
  next.selection = [0,1,2,8].includes(frame.index) ? null : TARGET;
  next.view = next.selection ? 'investigation' : 'network';
  next.domain = 'All domains'; next.popId = null; next.scopePage = 0;
  next.returnView = {view:'network', domain:'All domains', popId:null, scopePage:0};
  next.panel = frame.index === 5 ? 'response' : frame.index >= 9 ? 'verify' : 'evidence';
  if (next.critical) next.criticalDetected = next.criticalDetected && next.criticalDetected < frame.time ? next.criticalDetected : frame.time;
  return next;
}
export function reduce(state, action) {
  switch(action.type) {
    case 'GOTO': return gotoFrame(state, action.frame);
    case 'SELECT': return {...state, selection:action.id, panel:action.panel || 'evidence', replay:false};
    case 'CLOSE': {
      if (state.history !== null) return reduce({...state, ...(state.liveContext || {}), history:null, liveContext:null}, {type:'CLOSE'});
      return {...state, ...(state.view === 'investigation' ? state.returnView || {view:'network', domain:'All domains', popId:null, scopePage:0} : {}), selection:null, highlightPolicy:false, returnView:null};
    }
    case 'PANEL': return {...state, panel:action.panel, replay:false};
    case 'NOTES': return {...state, notes:action.value};
    case 'GAP': return {...state, gap:action.value, verified:action.value === 'west' ? false : state.verified};
    case 'CRITICAL': return {...state, critical:action.value, criticalDetected:action.value && !state.critical ? currentFrame(state).time : state.criticalDetected};
    case 'RELATED': return {...state, related:action.value};
    case 'MATCH': return {...state, match:action.value};
    case 'ACK_REQUEST': return canAcknowledge(state, action.id) ? {...state, ackPending:action.id} : state;
    case 'ACK_CONFIRM': return state.ackPending === action.id && canStillAck(state, action.id) ? {...state, ackPending:null, acknowledgements:{...state.acknowledgements, [action.id]:{actor:'Priya', time:currentFrame(state).time}}, events:appendEvent(state, 'Alarm acknowledged', `${action.id} · Priya`)} : {...state, ackPending:null};
    case 'SEND_REQUEST': return state.history === null && state.frame >= 2 && ['none','failed'].includes(state.escalation.status) ? {...state, escalation:{status:'sending', snapshot:escalationSnapshot(state)}} : state;
    case 'SEND_CONFIRM': return state.escalation.status === 'sending' ? {...state, escalation:{...state.escalation, status:'sent', sent:currentFrame(state).time}, events:appendEvent(state, 'Escalation delivered', 'Traffic Engineering · Awaiting acceptance')} : state;
    case 'SEND_FAIL': return state.escalation.status === 'sending' ? {...state, escalation:{...state.escalation, status:'failed'}, events:appendEvent(state, 'Delivery not confirmed', 'Draft retained for retry')} : state;
    case 'ACCEPT': return state.history === null && state.escalation.status === 'sent' ? {...state, escalation:{...state.escalation, status:'accepted', accepted:currentFrame(state).time, owner:'Arun'}, events:appendEvent(state, 'Escalation accepted', 'Arun · Network Traffic Engineer')} : state;
    case 'RUN_START': return canExecute(state) ? {...state, playbook:{status:'running', step:0}, events:appendEvent(state, 'Approved playbook started', 'PB-NOC-17 · Reviewed scope')} : state;
    case 'RUN_STEP': return state.playbook.status === 'running' ? {...state, playbook:{...state.playbook, step:action.step}} : state;
    case 'RUN_RESULT': return state.playbook.status === 'running' ? {...state, playbook:{...state.playbook, status:action.result, step:action.result === 'completed' ? 3 : state.playbook.step}, events:appendEvent(state, `Playbook ${action.result}`, 'RUN-017 · Step output retained')} : state;
    case 'VERIFY': return canVerify(state) ? {...state, verified:true, events:appendEvent(state, 'Recovery verified', 'Current observations, stability window, and source clear confirmed')} : state;
    case 'HISTORY': return {...state, liveContext:state.history === null ? {selection:state.selection, panel:state.panel, highlightPolicy:state.highlightPolicy, view:state.view, domain:state.domain, popId:state.popId, scopePage:state.scopePage, returnView:state.returnView} : state.liveContext, history:action.frame, selection:TARGET, panel:'evidence', view:'investigation', domain:'All domains', popId:null, scopePage:0, replay:false};
    case 'CURRENT': return {...state, ...(state.liveContext || {}), history:null, liveContext:null};
    default: return state;
  }
}
function canStillAck(state, id) { return state.history === null && allAlarms(state).some(a => a.id === id && a.active && !a.acknowledged); }
export function timeline(state) {
  const events = [{time:'07:55', title:'Watch started', detail:'Current observations · Priya'}];
  if (state.frame >= 1) events.push({time:'07:58', title:'Utilization trend observed', detail:'73% · Below configured alarm threshold'});
  if (state.frame >= 2) events.push({time:'08:00', title:'Major alarm reported', detail:`${MAIN_ALARM} · XR-P1 interface utilization`});
  if (state.frame >= 4) events.push({time:'08:03', title:'Alarm acknowledged', detail:'Priya · Condition remains active'});
  if (state.frame >= 6) events.push({time:'08:07', title:'Escalation delivered', detail:'Traffic Engineering · Acceptance pending'});
  if (state.frame >= 7) events.push({time:'08:10', title:'Escalation accepted', detail:'Arun · Network Traffic Engineer'});
  if (state.frame >= 9) events.push({time:'08:20', title:'Engineering job started', detail:'JOB-0318 · SR policy update · Arun'});
  if (state.frame >= 10) events.push({time:'08:25', title:'Engineering job completed', detail:'Alarm active · Network verification pending'});
  if (state.frame >= 11) events.push({time:'08:30', title:'Alarm cleared by source', detail:`${MAIN_ALARM} · Utilization within limits`});
  if (state.verified && canVerify(state)) events.push({time:'08:35', title:'Recovery verified', detail:'5-minute observation window satisfied'});
  return [...events, ...state.events].sort((a,b) => a.time.localeCompare(b.time));
}
export function handover(state) {
  const o = observations(state), counts = alarmCounts(state);
  return `NOC watch handover · ${currentFrame(state).time} (simulated)\n\nNetwork: ${networkStatus(state).title}.\nActive alarms: ${counts.total} (${counts.critical} Critical, ${counts.major} Major, ${counts.minor} Minor).\n${state.networkContext?.mainDomainLabel||'West'} link: XR-P1 → XR-P2 · ${INTERFACE} · ${o.utilization}% observed ${o.observedAt}${o.fresh ? '' : ' (last known; stale)'}.\nAlarm ${MAIN_ALARM}: ${state.frame < 2 ? 'not reported' : state.frame < 11 ? 'active' : 'source-cleared'}; ${state.acknowledgements[MAIN_ALARM] ? 'acknowledged by Priya' : 'not acknowledged'}.\nEscalation: ${state.escalation.status === 'accepted' ? 'accepted by Arun; engineering follow-up remains open' : state.escalation.status === 'sent' ? 'delivered; awaiting acceptance' : state.escalation.status}.\nVerification: ${state.verified && canVerify(state) ? 'criteria satisfied; recovery recorded' : 'not recorded; inspect current criteria'}.\nMonitoring gaps: ${state.gap === 'none' ? 'none in this snapshot' : state.gap === 'west' ? (state.networkContext?.mainDomainLabel||'West')+' interface telemetry unavailable; last observed '+o.observedAt : (state.networkContext?.criticalDomainLabel||'East')+' device telemetry unavailable; last observed 07:50'}.\nCause: not confirmed.\nFollow-up: ${state.escalation.status === 'accepted' ? 'Arun to complete traffic-engineering review and close ENG-318.' : 'Maintain the network watch and confirm response ownership.'}\n\nOperator notes: ${state.notes || 'No additional notes.'}`;
}
