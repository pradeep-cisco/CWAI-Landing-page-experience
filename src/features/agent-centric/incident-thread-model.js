/**
 * Three explicit presentation snapshots of one incident, not a job generator.
 * Jobs exist only when their records exist. Future stages remain uncounted.
 */
import { getTaskId, JOB_TASKS } from './agent-job-tasks.js';
import { jobCategory, summarizeJobs } from './agent-scale-model.js';

export const EXPERIENCE_STATES = Object.freeze([
  { id: 'monitoring', label: 'Monitoring', observedAt: '08:10:00 UTC' },
  { id: 'review', label: 'Review', observedAt: '08:11:00 UTC' },
  { id: 'verification', label: 'Verification', observedAt: '08:25:00 UTC' },
].map(Object.freeze));

const INCIDENT = 'INC-317';
const ISSUE = 'ISSUE-INC-317';
const CHANGE = 'R-41';
const CASE_IDS = ['C-21', 'C-22', 'C-23', CHANGE, 'V-51', 'V-52'];
const REPLACED = ['JOB-1029', 'JOB-1037', 'JOB-1045'];
const REMOVED = ['ROUTE-104', ...REPLACED];
const WEST_ROUTER = 'XR-WEST-0129';
const CORE_ROUTER = 'XR-CORE-0201';
const WEST_SCOPE = `West · ${WEST_ROUTER} · HundredGigE0/0/0/1`;
const CHANGE_SCOPE = `West · ${WEST_ROUTER} · SR policy WAN-WEST-PRIMARY`;
const TITLE = 'Capacity pressure';
const DESCRIPTION = 'High utilization on the West backbone link; alternate-path and Core-ingress conditions are assessed for a bounded response.';
const TASK_TITLES = Object.fromEntries(JOB_TASKS.map(task => [task.id, task.title]));

function record(id, job, title, detail, time, extra = {}) {
  return { id, job: job.id, jobId: job.id, incidentId: INCIDENT, issueId: ISSUE, title, label: title, detail, time, scope: job.scope, agentId: job.agentId, agent: job.agent, agentVersion: job.agentVersion, authority: job.authority, actor: job.agent, record: `${id} · scoped source record`, source: job.source, current: job.current, ...extra };
}

function caseJob(snapshot, fields) {
  const agent = snapshot.agents[fields.agentId];
  return {
    incidentId: INCIDENT, issueId: ISSUE, current: snapshot.sourceState === 'current',
    taskId: fields.taskId, groupId: fields.taskId, agent: agent.name, agentVersion: agent.version,
    icon: agent.icon, health: agent.health, priority: 0, dependencyId: null,
    canReview: false, authority: 'Existing read-only assessment authority', inputJobIds: [],
    ...fields,
    evidence: [...(fields.evidence || [])], observations: [...(fields.observations || [])],
  };
}

function capacityJobs(snapshot, state) {
  const checked = state !== 'monitoring';
  const c21 = caseJob(snapshot, {
    id: 'C-21', threadLabel: 'C-21', stageId: 'capacity', taskId: 'capacity-checks', capabilityId: 'capacity', agentId: 'capacity',
    title: 'Measure West link utilization', domainId: 'west', domainName: 'West', deviceId: WEST_ROUTER, deviceIds: [WEST_ROUTER], scope: WEST_SCOPE,
    status: 'Assessment complete', tone: 'positive',
    checkpoint: 'Five-minute mean utilization was 92% of recorded link capacity; the 90% incident criterion was met.',
    finding: 'Five-minute mean utilization reached 92% on the affected West link.',
    landingFinding: 'Affected-link utilization reached 92% in the observed window.', landingScope: WEST_SCOPE,
    detail: 'C-21 established the high-utilization condition using current interface capacity and comparable utilization samples. It does not establish future demand or a service outage.',
    source: 'CNC interface capacity and five-minute mean utilization · 08:00–08:05 UTC',
    evidence: ['HundredGigE0/0/0/1 on XR-WEST-0129 has recorded capacity 100 Gbit/s.', 'Five-minute mean utilization was 92% in 08:00–08:05 UTC, above the declared 90% classification criterion.'],
    resultEvidence: ['Comparable utilization samples establish a five-minute mean of 92% for this link and window.'],
    nextStep: checked ? 'Retain the measurement as input to the bounded response.' : 'Complete alternate-path headroom and Core-ingress checks before proposing a response.',
  });
  const c22 = caseJob(snapshot, {
    id: 'C-22', threadLabel: 'C-22', stageId: 'capacity', taskId: 'capacity-checks', capabilityId: 'capacity', agentId: 'capacity',
    title: 'Check alternate-path headroom', domainId: 'west', domainName: 'West', deviceId: 'XR-WEST-0130', deviceIds: ['XR-WEST-0130'], scope: 'West · XR-WEST-0130 · alternate path WEST-ALT-02',
    inputJobIds: ['C-21'], status: checked ? 'Assessment complete' : 'Analyzing capacity', tone: checked ? 'positive' : 'info',
    checkpoint: checked ? 'Alternate-path observations and the bounded traffic estimate satisfy the declared planning limits.' : 'Comparing alternate-path capacity with the traffic identified by C-21.',
    finding: checked ? 'WEST-ALT-02 has measured headroom for the bounded response.' : 'Alternate-path headroom is still being assessed.',
    landingFinding: checked ? 'Alternate path has sufficient measured headroom.' : 'Alternate-path headroom checks are still running.', landingScope: 'West · XR-WEST-0130 · WEST-ALT-02',
    detail: checked ? 'WEST-ALT-02 measured 54% five-minute mean utilization in the comparison window. The bounded planning estimate remains within its declared limit; the estimate is not a verified post-change result.' : 'C-22 is checking comparable capacity observations and the amount of traffic in the proposed response scope. No change is ready from this partial assessment.',
    source: 'WEST-ALT-02 interface capacity and utilization observations · bounded traffic estimate',
    evidence: checked ? ['The comparison-window mean utilization on WEST-ALT-02 was 54%.', 'The proposed traffic subset fits the declared alternate-path planning limit. Actual effects require post-change measurement.'] : ['C-21 identifies the affected link and observation window.', 'Current alternate-path capacity observations are being compared.'],
    nextStep: checked ? 'Use this scoped capacity assessment as input to R-41.' : 'Finish the alternate-path headroom comparison.',
  });
  const c23 = caseJob(snapshot, {
    id: 'C-23', threadLabel: 'C-23', stageId: 'capacity', taskId: 'capacity-checks', capabilityId: 'capacity', agentId: 'capacity',
    title: 'Check Core-ingress path conditions', domainId: 'core', domainName: 'Core', deviceId: CORE_ROUTER, deviceIds: [CORE_ROUTER], scope: `Core · ${CORE_ROUTER} · West ingress`,
    inputJobIds: ['C-21'], status: checked ? 'Assessment complete' : 'Analyzing capacity', tone: checked ? 'positive' : 'info',
    checkpoint: checked ? 'Recorded Core-ingress capacity and required routing conditions support the bounded alternate path.' : 'Checking Core-ingress capacity and required routing conditions for the alternate path.',
    finding: checked ? 'Core-ingress observations support the proposed West path.' : 'Core-ingress compatibility checks remain open.',
    landingFinding: checked ? 'Core ingress supports the proposed alternate path.' : 'Core-ingress routing checks are still running.', landingScope: `Core · ${CORE_ROUTER} · West ingress`,
    detail: 'This is a read-only check of Core-ingress conditions. It neither changes the Core router nor establishes service-wide health.',
    source: `${CORE_ROUTER} ingress capacity · required adjacency and route observations`,
    evidence: checked ? ['Recorded ingress capacity satisfies the declared planning constraint.', 'Required adjacency and selected-route conditions for WEST-ALT-02 are present.'] : ['The affected path has a declared Core-ingress dependency.', 'Required capacity and routing observations are being collected.'],
    nextStep: checked ? 'Retain these observations as prerequisite evidence for R-41.' : 'Complete the scoped Core-ingress checks.',
  });
  return [c21, c22, c23].map(job => ({ ...job, observations: job.evidence.map((text, index) => ({ id: `${job.id}-evidence-${index}`, label: index ? 'Assessment boundary' : 'Observed evidence', text, source: job.source, time: job.status === 'Assessment complete' ? job.id === 'C-21' ? '08:05:00 UTC' : '08:10:30 UTC' : null })) }));
}

function proposal(snapshot) {
  const permitted = snapshot.sourceState === 'current' && snapshot.permissions.reviewChange;
  return {
    id: 'PLAN-INC-317-R41', version: 1, available: true, reviewable: permitted,
    scope: CHANGE_SCOPE, targets: [WEST_ROUTER],
    authority: 'GOV-TE-317 · Delegated production change approval for this proposal version and target.',
    intent: 'Move only the declared WAN-WEST-PRIMARY traffic subset to WEST-ALT-02, then measure the resulting utilization and routing conditions.',
    changeFrom: 'SR policy WAN-WEST-PRIMARY\n  preferred path: WEST-PRIMARY-01',
    changeTo: 'SR policy WAN-WEST-PRIMARY\n  preferred path: WEST-ALT-02',
    boundary: `Only the preferred path of SR policy WAN-WEST-PRIMARY on ${WEST_ROUTER}. No interface, Core-router or unrelated policy changes.`,
    validation: ['C-21 confirms 92% five-minute mean utilization on the affected West link.', 'C-22 confirms the alternate-path capacity observations and bounded planning limit.', 'C-23 confirms the required Core-ingress conditions.', 'Current policy readback and change records identify this exact target and bounded difference.'],
    verification: ['V-51 must compare like-for-like five-minute mean utilization and confirm it is at or below 75%.', 'V-52 must confirm required routes, adjacency stability and the declared change boundary.'],
    validity: 'This approval covers only proposal version 1 and the named target. Recheck current capacity, routing, resource state and authority before issue. A changed proposal needs fresh review.',
    holdConsequence: 'Holding leaves R-41 unissued. The read-only capacity evidence and all independent jobs retain their own state.',
  };
}

function remediationJob(snapshot, state) {
  const completed = state === 'verification';
  const plan = proposal(snapshot);
  const job = caseJob(snapshot, {
    id: CHANGE, threadLabel: CHANGE, stageId: 'remediation', taskId: 'remediation', capabilityId: 'remediate', agentId: 'remediation',
    title: 'Move bounded traffic to the alternate path', domainId: 'west', domainName: 'West', deviceId: WEST_ROUTER, deviceIds: [WEST_ROUTER], targets: [WEST_ROUTER], scope: CHANGE_SCOPE,
    inputJobIds: ['C-21', 'C-22', 'C-23'], status: completed ? 'Complete' : 'Review required', tone: completed ? 'info' : 'warning',
    checkpoint: completed ? 'OP-317 completed the approved preferred-path change. Outcome checks remain separate.' : 'The bounded path change is ready; delegated production approval is required.',
    finding: completed ? 'The controller reports completion of the approved path change.' : 'Completed capacity checks support a bounded preferred-path correction.',
    landingFinding: completed ? 'Controller completed the approved path change.' : 'Scoped path change needs delegated approval.', landingScope: `West · ${WEST_ROUTER} · WAN-WEST-PRIMARY`,
    detail: completed ? 'The controller completion record applies to this proposal and target. It does not establish that every outcome criterion passed; V-51 and V-52 retain their own observations.' : 'The change consumes the three declared capacity-check results. No network operation has been issued in the Review snapshot.',
    authority: completed ? 'AUTH-INC-317-R41-v1 · effective recorded delegated grant' : plan.authority,
    source: completed ? 'OP-317 controller completion · AUTH-INC-317-R41-v1 · exact policy readback' : 'PLAN-INC-317-R41 v1 · C-21/C-22/C-23 prerequisite records',
    evidence: [...plan.validation], proposal: { ...plan, reviewable: completed ? false : plan.reviewable },
    canReview: !completed && plan.reviewable,
    nextStep: completed ? 'Confirm the outcome with V-51 and V-52 before resolving INC-317.' : 'Review the exact proposal, target, limits and verification criteria.',
    ...(completed ? { operation: { id: 'OP-317', state: 'completed', source: 'OP-317 controller completion · 08:14:00 UTC', proposalId: plan.id, proposalVersion: plan.version, authorityId: 'AUTH-INC-317-R41-v1', targets: [WEST_ROUTER], current: snapshot.sourceState === 'current' } } : {}),
  });
  return job;
}

function verificationJobs(snapshot) {
  const v51 = caseJob(snapshot, {
    id: 'V-51', threadLabel: 'V-51', stageId: 'verification', taskId: 'verification', capabilityId: 'verify', agentId: 'remediation',
    title: 'Verify affected-link utilization', domainId: 'west', domainName: 'West', deviceId: WEST_ROUTER, deviceIds: [WEST_ROUTER], scope: WEST_SCOPE,
    changeJobId: CHANGE, inputJobIds: [CHANGE], status: 'Verified', tone: 'positive',
    checkpoint: 'Comparable five-minute mean utilization reduced from 92% to 68%, satisfying this check’s at-or-below-75% criterion.',
    finding: 'The affected-link utilization criterion passed; overall incident verification remains open.',
    landingFinding: 'Affected-link utilization reduced from 92% to 68%.', landingScope: WEST_SCOPE,
    detail: 'V-51 verifies only the affected-link utilization criterion using comparable windows and the same recorded link capacity. V-52 is still checking routing stability and the change boundary.',
    authority: 'Recorded approved change AUTH-INC-317-R41-v1 · read-only outcome verification',
    source: 'CNC five-minute mean interface observations · C-21 comparison window · OP-317 completion',
    evidence: ['Before: 92% five-minute mean utilization in 08:00–08:05 UTC.', 'After: 68% five-minute mean utilization in 08:15–08:20 UTC, using the same link-capacity basis.', '68% satisfies the declared at-or-below-75% utilization criterion.'],
    resultEvidence: ['The same affected link and comparable five-minute measurement establish 92% before and 68% after.', 'This passed criterion does not establish the still-pending V-52 result.'],
    resultMetrics: { label: 'Affected-link utilization', before: 92, after: 68, unit: '%', criterion: 75, comparison: 'at-or-below', beforeWindow: '08:00–08:05 UTC', afterWindow: '08:15–08:20 UTC', source: 'CNC comparable five-minute mean interface observations · XR-WEST-0129 HundredGigE0/0/0/1', current: snapshot.sourceState === 'current' },
    nextStep: 'Retain this criterion’s evidence while V-52 completes the remaining outcome checks.',
  });
  const v52 = caseJob(snapshot, {
    id: 'V-52', threadLabel: 'V-52', stageId: 'verification', taskId: 'verification', capabilityId: 'verify', agentId: 'remediation',
    title: 'Verify routing stability and change limits', domainId: 'core', domainName: 'Core', deviceId: CORE_ROUTER, deviceIds: [CORE_ROUTER, WEST_ROUTER], scope: `Core · ${CORE_ROUTER} · West ingress and reviewed West policy`,
    changeJobId: CHANGE, inputJobIds: [CHANGE, 'V-51'], status: 'Verifying', tone: 'info',
    checkpoint: 'The required routing-stability observation window and declared change-boundary checks remain open.',
    finding: 'The utilization check passed; routing stability and change limits remain unverified.',
    landingFinding: 'Routing stability and downstream checks remain open.', landingScope: `Core · ${CORE_ROUTER} · West ingress`,
    detail: 'V-52 inspects the declared Core-ingress dependency and the changed West policy. It does not change either router. A passed utilization check is insufficient to close the incident.',
    authority: 'Recorded approved change AUTH-INC-317-R41-v1 · read-only outcome verification',
    source: 'Post-change Core-ingress routes and adjacencies · West policy readback · OP-317 trace',
    evidence: ['OP-317 completed the exact reviewed preferred-path change.', 'The full routing-stability window and final policy-difference comparison have not yet established every exit criterion.'],
    nextStep: 'Complete the declared stability window and change-boundary comparison before resolving INC-317.',
  });
  return [v51, v52].map(job => ({ ...job, operation: { id: 'OP-317', state: 'completed', source: 'OP-317 controller completion · 08:14:00 UTC', changeJobId: CHANGE }, observations: job.evidence.map((text, index) => ({ id: `${job.id}-evidence-${index}`, label: index ? 'Verification scope' : 'Outcome observation', text, source: job.source, time: job.id === 'V-51' ? '08:20:00 UTC' : null })) }));
}

function approveBackground(job, snapshot) {
  if (!/^REVIEW-50[1-5]$/.test(job.id)) return job;
  const authorityId = `AUTH-${job.id}-v1`;
  return {
    ...job, status: 'Checking', tone: 'info', canReview: false,
    checkpoint: 'A previously recorded approval is effective. Current execution prerequisites are being checked.',
    finding: 'This independent change already has a recorded delegated approval.',
    detail: 'This background fixture represents a proposal approved before the featured incident snapshot. No approval is inferred from this transformation or the current user’s role. Execution remains unconfirmed.',
    nextStep: 'Recheck current prerequisites before issuing any governed operation.',
    authority: `${authorityId} · previously recorded delegated approval for this proposal and target`,
    proposal: { ...job.proposal, reviewable: false, authority: `${authorityId} · recorded delegated grant, limited to this version and target` },
    approval: { id: authorityId, state: 'effective', proposalId: job.proposal.id, proposalVersion: job.proposal.version, targets: [...job.proposal.targets], source: `${authorityId} · recorded approval before the featured incident`, current: snapshot.sourceState === 'current' },
  };
}

function issuesFromJobs(jobs, previousIssues) {
  const old = new Map(previousIssues.map(issue => [issue.id, issue]));
  const grouped = new Map();
  for (const job of jobs.filter(item => jobCategory(item) !== 'completed')) {
    if (!job.issueId) continue;
    if (!grouped.has(job.issueId)) grouped.set(job.issueId, []);
    grouped.get(job.issueId).push(job);
  }
  return [...grouped].map(([id, members]) => {
    const prior = old.get(id);
    const representative = members.find(job => job.id === prior?.jobId) || members[0];
    const domains = [...new Set(members.map(job => job.domainId).filter(Boolean))];
    const agents = [...new Set(members.map(job => job.agentId).filter(Boolean))];
    return { id, jobId: representative.id, jobIds: members.map(job => job.id), agentId: agents.length === 1 ? agents[0] : null, domainId: domains.length === 1 ? domains[0] : null, domainIds: domains, domainName: domains.length === 1 ? representative.domainName : `${domains.length} device groups`, title: id === ISSUE ? TITLE : prior?.jobId === representative.id ? prior.title : representative.title, scope: id === ISSUE ? 'West and Core · declared incident targets' : representative.scope, state: 'open', summary: representative.checkpoint, current: representative.current, deviceIds: [...new Set(members.flatMap(job => job.deviceIds || []))] };
  });
}

/** Input is the full scale snapshot. Background task membership is retained. */
export function buildIncidentSnapshot(sourceScaleSnapshot, state = 'review') {
  const snapshot = structuredClone(sourceScaleSnapshot);
  const experienceState = EXPERIENCE_STATES.some(item => item.id === state) ? state : 'review';
  snapshot.experienceState = experienceState;
  snapshot.stateCurrent = snapshot.sourceState === 'current';
  if (snapshot.variant === 'quiet') {
    snapshot.featuredIncidentId = null;
    return snapshot;
  }
  snapshot.observedAt = EXPERIENCE_STATES.find(item => item.id === experienceState).observedAt;
  snapshot.lastConfirmedAt = snapshot.observedAt;
  const removedIds = new Set([...REMOVED, ...CASE_IDS]);
  snapshot.jobs = snapshot.jobs.filter(job => !removedIds.has(job.id)).map(job => approveBackground(job, snapshot));
  const caseJobs = capacityJobs(snapshot, experienceState);
  if (experienceState !== 'monitoring') caseJobs.push(remediationJob(snapshot, experienceState));
  if (experienceState === 'verification') caseJobs.push(...verificationJobs(snapshot));
  snapshot.jobs.push(...caseJobs);
  snapshot.featuredIncidentId = INCIDENT;

  snapshot.actions = (snapshot.actions || []).filter(item => !removedIds.has(item.jobId || item.job) && item.incidentId !== INCIDENT && !/^AUTH-REVIEW-50[1-5]-v1$/.test(item.id));
  for (const job of snapshot.jobs.filter(item => /^REVIEW-50[1-5]$/.test(item.id))) snapshot.actions.push({ id: job.approval.id, job: job.id, jobId: job.id, issueId: job.issueId, title: 'Previously approved background change', label: 'Recorded delegated approval', detail: job.detail, record: job.approval.source, time: '07:55:00 UTC', scope: job.scope, agentId: job.agentId, agent: job.agent, agentVersion: job.agentVersion, authority: job.authority, actor: 'Delegated NOC operator · recorded earlier approval', current: snapshot.stateCurrent });
  for (const job of caseJobs.filter(item => item.id !== CHANGE && jobCategory(item) === 'completed')) snapshot.actions.push(record(`${job.id}-result`, job, job.id === 'V-51' ? 'Affected-link utilization criterion verified' : `${job.threadLabel} assessment completed`, job.checkpoint, job.id === 'V-51' ? '08:20:00 UTC' : job.id === 'C-21' ? '08:05:00 UTC' : '08:10:30 UTC'));
  const change = caseJobs.find(job => job.id === CHANGE);
  if (experienceState === 'verification') {
    snapshot.actions.push(record('plan-authorized', change, 'Bounded path change authorized', 'AUTH-INC-317-R41-v1 is the recorded effective grant for proposal version 1 and its single named target.', '08:12:00 UTC', { record: 'AUTH-INC-317-R41-v1 · GOV-TE-317', actor: 'Delegated NOC operator' }));
    snapshot.actions.push(record('operation-completed', change, 'Controller operation completed', 'OP-317 completed the approved preferred-path change. Incident verification remains open.', '08:14:00 UTC', { record: 'OP-317 controller completion', operationId: 'OP-317', actor: 'Network controller · OP-317 completion record' }));
  }
  snapshot.actions.sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
  const removedReviews = new Set([...REMOVED, ...CASE_IDS, ...snapshot.jobs.filter(job => /^REVIEW-50[1-5]$/.test(job.id)).map(job => job.id)]);
  snapshot.decisions = (snapshot.decisions || []).filter(item => !removedReviews.has(item.jobId || item.job));
  snapshot.assignedDecisions = (snapshot.assignedDecisions || []).filter(item => !removedReviews.has(item.jobId || item.job));
  if (experienceState === 'review') {
    const decision = { id: 'decision-INC-317-R41', kind: 'job-review', job: CHANGE, jobId: CHANGE, issueId: ISSUE, incidentId: INCIDENT, agentId: 'remediation', domainId: 'west', title: 'Review West traffic change', reason: 'Completed capacity checks support one bounded preferred-path change. Delegated production approval is required.', scope: CHANGE_SCOPE, authority: 'Change', state: 'open', priority: 0, proposalId: change.proposal.id };
    if (change.canReview) snapshot.decisions.push(decision);
    else snapshot.assignedDecisions.push({ ...decision, state: 'assigned', assignedTo: snapshot.stateCurrent ? 'Delegated NOC operator' : 'Current review authority unavailable' });
  }
  snapshot.proposal = change?.proposal || { version: 1, available: false, reviewable: false, validation: [], verification: [] };
  snapshot.criteria = experienceState === 'verification' ? [
    { id: 'utilization', title: 'Affected-link utilization at or below 75%', state: 'met', detail: 'V-51 confirms 68% in the comparable post-change five-minute window.', source: 'V-51 interface observations', time: '08:20:00 UTC' },
    { id: 'routing-stability', title: 'Required routing stability and change limits', state: snapshot.stateCurrent ? 'pending' : 'unavailable', detail: 'V-52 has not yet established every required stability and change-boundary criterion.', source: 'V-52 routing and configuration observations', time: null },
  ] : [];
  if (snapshot.submittedDecision && removedReviews.has(snapshot.submittedDecision.job)) delete snapshot.submittedDecision;
  snapshot.handled = (snapshot.handled || []).filter(item => !removedIds.has(item.jobId || item.job));
  const jobIds = new Set(snapshot.jobs.map(job => job.id));
  snapshot.dependencies = (snapshot.dependencies || []).map(item => ({ ...item, jobIds: item.jobIds.filter(id => jobIds.has(id)) })).filter(item => item.jobIds.length);
  snapshot.suggestions = (snapshot.suggestions || []).filter(item => !item.jobId || jobIds.has(item.jobId));
  snapshot.incidents = (snapshot.incidents || []).filter(item => !['INC-104', INCIDENT].includes(item.id)).map(item => {
    const memberIds = new Set([...(item.jobIds || []), item.jobId, item.job].filter(Boolean));
    const members = snapshot.jobs.filter(job => memberIds.has(job.id) || job.incidentId === item.id);
    return members.length ? { ...item, job: members[0].id, jobIds: members.map(job => job.id), current: snapshot.stateCurrent } : null;
  }).filter(Boolean);
  snapshot.incidents.push({ id: INCIDENT, issueId: ISSUE, job: 'C-21', jobIds: caseJobs.map(job => job.id), title: TITLE, description: DESCRIPTION, scope: 'West and Core · declared incident targets', domainId: 'west', domainIds: ['west', 'core'], deviceId: WEST_ROUTER, state: 'active', stage: experienceState === 'monitoring' ? 'Checking capacity' : experienceState === 'review' ? 'Ready for review' : 'Verifying recovery', classification: 'CAP-HEADROOM-01 · observed five-minute mean utilization exceeded the recorded 90% criterion.', evidence: 'At classification, C-21 observed 92% five-minute mean utilization on XR-WEST-0129 HundredGigE0/0/0/1 in 08:00–08:05 UTC. This establishes the scoped utilization condition, not a service outage or future-demand forecast.', source: 'CAP-HEADROOM-01 classification record · C-21 capacity observations', current: snapshot.stateCurrent, resolution: null });
  snapshot.issues = issuesFromJobs(snapshot.jobs, snapshot.issues || []);
  snapshot.history = snapshot.jobs.filter(job => jobCategory(job) === 'completed');
  snapshot.scaleSummary = { ...summarizeJobs(snapshot.jobs), issues: snapshot.issues.length, decisions: snapshot.decisions.length };
  if (!snapshot.stateCurrent) snapshot.summary = 'Current updates are interrupted. Retained incident and fleet records are last-confirmed; current readiness and decision validity cannot be inferred.';
  return snapshot;
}

/** Explicit incident membership only; scope similarity never creates an edge. */
export function getIncidentJobs(model, incidentId = INCIDENT) {
  const incident = model.incidents?.find(item => item.id === incidentId);
  const ids = new Set([...(incident?.jobIds || []), incident?.jobId, incident?.job].filter(Boolean));
  return (model.jobs || []).filter(job => job.incidentId === incidentId || ids.has(job.id)).sort((a, b) => {
    const ai = CASE_IDS.indexOf(a.id), bi = CASE_IDS.indexOf(b.id);
    return (ai < 0 ? Number.MAX_SAFE_INTEGER : ai) - (bi < 0 ? Number.MAX_SAFE_INTEGER : bi);
  });
}

export function getIncidentThread(model, incidentId = INCIDENT) {
  const incident = model.incidents?.find(item => item.id === incidentId);
  const jobs = getIncidentJobs(model, incidentId);
  if (!incident || !jobs.length) return null;
  const current = model.sourceState === 'current';
  if (incidentId !== INCIDENT) {
    const groups = new Map();
    for (const job of jobs) { const id = getTaskId(job); if (!groups.has(id)) groups.set(id, []); groups.get(id).push(job.id); }
    return { id: incidentId, title: incident.title, scope: incident.scope || (jobs.length === 1 ? jobs[0].scope : `${new Set(jobs.map(job => job.scope)).size} declared scopes`), jobIds: jobs.map(job => job.id), jobs, stages: [...groups].map(([id, jobIds]) => ({ id, title: TASK_TITLES[id] || id, jobIds })), state: incident.state || 'active', stateCurrent: current, headline: `${current ? '' : 'Last known: '}${incident.stage || incident.title}`, summary: jobs.length === 1 ? jobs[0].checkpoint : `${jobs.length} explicitly linked jobs retain their own state and scope.`, next: jobs.length === 1 ? jobs[0].nextStep || jobs[0].detail : 'Inspect each linked job’s evidence and current checkpoint.', sourceState: model.sourceState };
  }
  const change = jobs.find(job => job.id === CHANGE);
  const verifying = jobs.some(job => job.stageId === 'verification');
  const utilization = jobs.find(job => job.id === 'V-51');
  const metric = utilization?.resultMetrics;
  const utilizationVerified = utilization?.status === 'Verified' && Number.isFinite(metric?.before) && Number.isFinite(metric?.after) && Boolean(metric?.source);
  const state = verifying ? 'verification' : change ? 'review' : 'monitoring';
  const stages = [
    { id: 'capacity', title: 'Capacity checks', jobIds: jobs.filter(job => job.taskId === 'capacity-checks').map(job => job.id) },
    { id: 'remediation', title: 'Remediation', jobIds: jobs.filter(job => job.taskId === 'remediation').map(job => job.id) },
    { id: 'verification', title: 'Verification', jobIds: jobs.filter(job => job.taskId === 'verification').map(job => job.id) },
  ].filter(stage => stage.jobIds.length);
  let headline = 'Checking capacity';
  let summary = '2 capacity checks remain.';
  let next = 'Next: prepare a bounded response after the assessments finish.';
  if (change) {
    if (change.status === 'Decision submitted') { headline = 'Decision submitted'; summary = 'Authority confirmation is pending.'; next = 'Wait for confirmed authority before checking execution prerequisites.'; }
    else if (change.status === 'Held') { headline = 'Change held'; summary = 'This change remains unissued.'; next = 'Keep this change unissued. Independent agent work retains its own state.'; }
    else if (change.status === 'Checking') { headline = 'Checking prerequisites'; summary = 'Execution has not been established.'; next = 'The agent is rechecking capacity, routing and authority.'; }
    else if (verifying) { headline = utilizationVerified ? 'Verifying recovery' : 'Verifying outcome'; summary = utilizationVerified ? '1 check remains · Incident open.' : 'Outcome evidence remains incomplete.'; next = 'Routing stability and change limits remain under verification.'; }
    else { headline = current && model.permissions.reviewChange ? 'Ready for review' : 'Awaiting delegated review'; summary = current && model.permissions.reviewChange ? 'A bounded correction needs approval.' : 'Assigned to the delegated reviewer.'; next = current && model.permissions.reviewChange ? 'Next: verification after confirmed execution completion.' : 'The proposal requires delegated production-change authority.'; }
  }
  if (!current) { headline = 'Updates interrupted'; summary = `Last confirmed: ${summary}`; next = 'Current source visibility is required before new decisions or starts.'; }
  return { id: INCIDENT, title: incident.title, description: incident.description, scope: 'West–Core', scopeDetail: incident.scope, jobIds: jobs.map(job => job.id), jobs, stages, state, stateCurrent: current, observedAt: model.observedAt, headline, summary, next, sourceState: model.sourceState };
}
