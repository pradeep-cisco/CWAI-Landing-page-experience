/** Deterministic presentation data for Option 4. Counts describe records, not live CNC capacity. */
import { CAPABILITIES, getCapabilityReadiness } from './agent-centric-model.js';
import { NETWORK_AGENTS } from './network-agents.js';
import { getTaskId, TASK_BY_CAPABILITY } from './agent-job-tasks.js';

export const NETWORK_DOMAINS = Object.freeze([
  { id: 'core', name: 'Core', deviceCount: 2864 },
  { id: 'metro-east', name: 'Metro East', deviceCount: 1742 },
  { id: 'west', name: 'West', deviceCount: 2136 },
  { id: 'north', name: 'North', deviceCount: 1587 },
  { id: 'south', name: 'South', deviceCount: 1438 },
  { id: 'central', name: 'Central', deviceCount: 1274 },
  { id: 'europe', name: 'Europe', deviceCount: 1296 },
  { id: 'asia-pacific', name: 'Asia Pacific', deviceCount: 1186 },
].map(domain => Object.freeze({ ...domain, currentDeviceCount: domain.deviceCount - 16 })));

const ARCHIVE = 'event-archive';
const originalDomain = { 'ROUTE-104': 'core', 'CHECK-208': 'west', 'REACH-319': 'metro-east' };
const finished = new Set(['Verified', 'Assessment complete', 'Complete', 'Concluded']);
const domainById = id => NETWORK_DOMAINS.find(domain => domain.id === id);
const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

/** Scope identity is context only. Readiness separately checks exact permitted scope strings. */
export function scopeDomainId(scope) {
  const text = normalize(scope);
  const domain = NETWORK_DOMAINS.find(item => text === normalize(`${item.name} · all devices`) || text.startsWith(`${normalize(item.name)} ·`) || text.includes(`xr-${item.id}-`));
  if (domain) return domain.id;
  if (/\bxr-r07\b/.test(text)) return 'core';
  if (/\bxr-r12\b/.test(text)) return 'west';
  if (/\bxr-r21\b/.test(text) || text.startsWith('north ·')) return 'north';
  return null;
}

/** Discovery may offer a domain assessment without pretending each router has a prepared result. */
export function getScaleCapabilities() {
  const domainScopes = NETWORK_DOMAINS.map(domain => `${domain.name} · all devices`);
  const copy = {
    investigate: { title: 'Investigate issue', description: 'Investigate reachability and review supporting evidence.', landingPriority: 0, startLabel: 'Start investigation' },
    assess: { title: 'Check configuration', description: 'Review configuration anomalies against learned patterns and change context.', landingPriority: 3, startLabel: 'Start assessment' },
    verify: { title: 'Verify change', description: 'Check a completed change against its verification criteria.', landingPriority: 7, startLabel: 'Start verification' },
  };
  const existing = CAPABILITIES.map(capability => ({
    ...capability, ...copy[capability.id], taskDescription: copy[capability.id].description,
    requestCheckpoint: 'The agent acknowledged this read-only request and is gathering scoped observations.', requestStatus: capability.id === 'investigate' ? 'Investigating' : capability.id === 'verify' ? 'Verifying' : 'Assessing', groupId: TASK_BY_CAPABILITY[capability.id],
    scopeOptions: capability.id === 'verify' ? [...capability.scopeOptions] : [...capability.scopeOptions, ...domainScopes],
  }));
  const additions = [
    { id: 'correlate', agentId: 'correlation', title: 'Correlate events', description: 'Group related events and review incident classification.', domain: 'metro-east', landingPriority: 5, startLabel: 'Start correlation', prerequisites: ['Current event records', 'Resource identities and classification criteria'], taskDescription: 'Compare event resources, timing and classification criteria. Create or update an incident only when those criteria are met.' },
    { id: 'toxic', agentId: 'toxic', title: 'Find toxic factors', description: 'Explore patterns associated with recurring network events.', domain: 'europe', landingPriority: 1, startLabel: 'Start analysis', prerequisites: ['Selected link-down or BGP-session-down events', 'Matching device and inventory attributes'], taskDescription: 'Analyze statistical associations between selected events and inventory attributes. A pattern does not establish root cause or authorize a fix.' },
    { id: 'vulnerabilities', agentId: 'vulnerability', title: 'Assess vulnerabilities', description: 'Check advisory applicability using device evidence.', domain: 'north', landingPriority: 4, startLabel: 'Start assessment', prerequisites: ['Advisory applicability criteria', 'Current platform, software and enabled-feature observations'], taskDescription: 'Compare an advisory with observed platform, software and enabled features. Potential applicability does not establish exploitability or compromise.' },
    { id: 'capacity', agentId: 'capacity', title: 'Check capacity', description: 'Assess utilization and remaining headroom.', domain: 'west', landingPriority: 2, startLabel: 'Start analysis', prerequisites: ['Current link capacity', 'Comparable utilization samples and observation window'], taskDescription: 'Assess utilization and remaining headroom over the selected observation window. A trend does not guarantee future congestion.' },
    { id: 'services', agentId: 'assurance', title: 'Check service', description: 'Compare observed service conditions with agreed criteria.', domain: 'metro-east', landingPriority: 6, startLabel: 'Start service check', prerequisites: ['Named service and agreed criteria', 'Current service reachability and performance observations'], taskDescription: 'Compare service measurements with recorded criteria. Topology relationships alone do not establish service impact.' },
  ].map(capability => {
    const defaultScope = `${domainById(capability.domain).name} · all devices`;
    return { ...capability, groupId: TASK_BY_CAPABILITY[capability.id], requestStatus: ({ correlate: 'Correlating', toxic: 'Analyzing patterns', vulnerabilities: 'Assessing exposure', capacity: 'Analyzing capacity', services: 'Checking service' })[capability.id], icon: NETWORK_AGENTS[capability.agentId].icon, goal: capability.title, issueId: null, scope: defaultScope, defaultScope, scopeOptions: [...domainScopes], authority: 'Read-only assessment', requestCheckpoint: 'The agent acknowledged the request and is collecting the required evidence.' };
  });
  return [...existing, ...additions];
}

/** A domain launch permits evidence gathering only; it never grants a correction or reports health. */
export function getScaleCapabilityReadiness(capabilityId, snapshot, scope) {
  const capability = getScaleCapabilities().find(item => item.id === capabilityId);
  if (!capability) return { state: 'unavailable', label: 'Unavailable', reason: 'This capability is not available in this concept.', canStart: false };
  const target = scope || capability.defaultScope;
  if (!capability.scopeOptions.some(option => normalize(option) === normalize(target))) return { state: 'scope-required', label: 'Choose scope', reason: 'Choose a declared scope before starting this read-only job.', canStart: false };
  if (snapshot.sourceState !== 'current') return { state: 'unavailable', label: 'Updates interrupted', reason: 'Current source visibility is needed before starting work.', canStart: false };
  if (!snapshot.permissions?.startReadOnly) return { state: 'unavailable', label: 'Permission required', reason: 'Read-only assignment permission is required for this scope.', canStart: false };
  const agent = snapshot.agents?.[capability.agentId];
  if (!agent || agent.health !== 'Healthy') return { state: 'degraded', label: 'Capability unavailable', reason: 'The agent cannot currently establish readiness for a new assignment.', canStart: false };
  if (agent.eligibility !== 'eligible') return { state: 'restricted', label: 'New jobs stopped', reason: 'This agent is restricted from new assignments. Existing jobs retain their state.', canStart: false };
  const original = CAPABILITIES.find(item => item.id === capabilityId);
  if (original?.scopeOptions.some(option => normalize(option) === normalize(target))) return getCapabilityReadiness(capabilityId, snapshot, target);
  return { state: 'ready', label: 'Available', reason: 'The agent can gather evidence across this device group. Findings require current evidence for their exact targets; starting this read-only job does not establish device group health or authorize changes.', canStart: true };
}

/** Categories are mutually exclusive; waiting includes uncertainty, never assumed progress. */
export function jobCategory(job) {
  if (finished.has(job.status)) return 'completed';
  if (/review required|plan changed|awaiting review/i.test(job.status)) return 'review';
  if (/waiting|held|revision|unknown|unavailable|partial|needs|blocked|decision submitted|request submitted/i.test(job.status)) return 'waiting';
  return 'running';
}

export function summarizeJobs(jobs = []) {
  return jobs.reduce((summary, job) => {
    summary.total++;
    summary[jobCategory(job)]++;
    return summary;
  }, { total: 0, running: 0, waiting: 0, review: 0, completed: 0 });
}

export function filterJobs(jobs = [], { domainId = 'all', agentId = 'all', status = 'all', query = '' } = {}) {
  const term = normalize(query);
  return jobs.filter(job =>
    (domainId === 'all' || job.domainId === domainId) &&
    (agentId === 'all' || job.agentId === agentId) &&
    (status === 'all' || jobCategory(job) === status || normalize(job.status) === normalize(status)) &&
    (!term || normalize([job.id, job.issueId, job.incidentId, job.title, job.scope, job.agent, job.domainName, job.status, job.checkpoint, job.finding].join(' ')).includes(term)));
}

function withScope(job, snapshot) {
  const domainId = job.domainId || originalDomain[job.id] || 'core';
  const domain = domainById(domainId);
  return {
    ...job, taskId: getTaskId(job), domainId, domainName: domain.name,
    groupId: job.groupId || (job.id === 'ROUTE-104' ? 'routing-correction' : job.id === 'REACH-319' && !finished.has(job.status) ? ARCHIVE : 'configuration-checks'),
    dependencyId: job.dependencyId || (job.id === 'REACH-319' && !finished.has(job.status) ? ARCHIVE : null),
    priority: job.priority ?? (job.id === 'ROUTE-104' ? 0 : 2),
    current: snapshot.sourceState === 'current',
  };
}

const types = [
  { key: 'reachability', groupId: 'reachability-checks', title: 'Investigate intermittent reachability', agentId: 'troubleshooter', capabilityId: 'investigate', status: 'Investigating', source: 'CNC reachability observations · interface counters · routing state' },
  { key: 'configuration', groupId: 'configuration-checks', title: 'Review configuration anomaly', agentId: 'cdd', capabilityId: 'assess', status: 'Assessing', source: 'Learned logical-group patterns · CNC configuration observation · authorized change records' },
  { key: 'toxic', groupId: 'toxic-factors', title: 'Analyze recurring BGP session drops', agentId: 'toxic', capabilityId: 'toxic', status: 'Analyzing patterns', source: 'BGP-session-down event cohort · matching inventory attributes · analysis report' },
  { key: 'correlation', groupId: 'incident-correlation', title: 'Correlate interface and BGP events', agentId: 'correlation', capabilityId: 'correlate', status: 'Correlating', source: 'CNC interface and BGP events · entity identities · classification rule CORR-LINK-01' },
  { key: 'vulnerability', groupId: 'vulnerability-checks', title: 'Assess advisory applicability', agentId: 'vulnerability', capabilityId: 'vulnerabilities', status: 'Assessing exposure', source: 'Selected vendor advisory · platform and software inventory · enabled-feature observations' },
  { key: 'capacity', groupId: 'capacity-analysis', title: 'Assess link headroom', agentId: 'capacity', capabilityId: 'capacity', status: 'Analyzing capacity', source: 'Interface capacity · comparable five-minute utilization samples · thirty-minute observation window' },
  { key: 'assurance', groupId: 'service-assurance', title: 'Check enterprise VPN performance', agentId: 'assurance', capabilityId: 'services', status: 'Checking service', source: 'Service probe observations · recorded reachability and latency criteria' },
  { key: 'verification', groupId: 'outcome-checks', title: 'Verify completed routing change', agentId: 'remediation', capabilityId: 'verify', status: 'Verifying', source: 'Recorded approved change and controller completion · configuration readback · routing observations' },
];

function scopedFinding(type, completed, index, device) {
  switch (type.key) {
    case 'configuration': return completed
      ? { finding: 'The configuration difference matches an authorized change record.', evidence: ['The learned-pattern comparison identified a difference.', 'The matching approved change record explains that difference.'], nextStep: 'Retain the assessment result; no correction is proposed.' }
      : { finding: 'The logical-group comparison found an unusual route-policy setting.', evidence: ['The setting differs from the learned configuration pattern for this logical group.', 'Authorized change records are being checked before classifying the difference.'], nextStep: 'Validate the anomaly against current intent and authorized changes. An anomaly alone does not establish unauthorized drift.' };
    case 'toxic': return completed
      ? { finding: 'No elevated factor association was reported in the assessed event cohort.', evidence: ['The selected link-down and BGP-session-down events were analyzed with matching inventory attributes.', 'This result is limited to the selected cohort and observation window.'], nextStep: 'Retain this scoped analysis. It does not establish that the network has no risks.' }
      : { finding: 'A software and interface combination is associated with repeated BGP session-down events.', evidence: ['The factor combination occurs more often in the selected problem-event cohort than in its comparison inventory.', 'Statistical association does not establish root cause or prescribe remediation.'], nextStep: 'Validate the factor with troubleshooting evidence before considering a correction.' };
    case 'correlation': return completed
      ? { finding: 'Assessed events did not meet the incident-classification criteria.', evidence: ['Resource identities and event timing were checked against CORR-LINK-01.', 'No incident was created for this scoped assessment.'], nextStep: 'Retain this correlation result. New events require their own assessment.' }
      : index % 16 === 3
      ? { finding: 'Related interface and BGP events met the resource and time-window criteria for one incident.', evidence: ['The events share the recorded device and interface dependency within the classification window.', 'Classification rule CORR-LINK-01 was met. Classification does not establish root cause.'], nextStep: 'Retain the incident and continue matching events; root cause is not confirmed.' }
      : { finding: 'Related event candidates are being compared; incident classification is pending.', evidence: ['Resource identities and event timing are available for comparison.', 'The supplied record does not yet meet every incident-classification criterion.'], nextStep: 'Continue correlation. Do not create an incident until the classification criteria are met.' };
    case 'vulnerability': return completed
      ? { finding: 'The advisory does not apply to the observed feature configuration.', evidence: ['Platform and software observations were compared with the selected advisory.', 'The affected feature is absent from the current recorded configuration.'], nextStep: 'Retain applicability evidence. This assessment does not rule out other vulnerabilities.' }
      : { finding: 'Platform and software match the advisory criteria; feature applicability is still being checked.', evidence: ['Current platform and software inventory match the advisory applicability conditions.', 'An enabled-feature observation is required before confirming applicability.'], nextStep: 'Collect feature evidence. Potential applicability does not establish exploitability or compromise.' };
    case 'capacity': return completed
      ? { finding: 'Measured headroom remained above the recorded threshold in this window.', evidence: ['Observed peak utilization was 61% of recorded link capacity.', 'The scoped threshold comparison used the declared thirty-minute observation window.'], nextStep: 'Retain this measurement result. Future demand remains uncertain.' }
      : { finding: 'Observed peak utilization rose from 61% to 82% across comparable windows.', evidence: ['The recorded thirty-minute window contains comparable five-minute utilization samples.', 'Measured remaining headroom is 18%; this is not a forecast of future demand.'], nextStep: 'Compare available paths and upcoming changes before proposing a capacity response.' };
    case 'assurance': return completed
      ? { finding: 'Service reachability and latency met the recorded criteria in the checked window.', evidence: ['The service probes recorded reachability.', 'Observed latency was 34 ms against a 40 ms criterion.'], nextStep: 'Retain the service-specific result; other services keep their own conditions.' }
      : { finding: 'Service reachability is present; sampled latency exceeds the recorded criterion.', evidence: ['The service probes recorded reachability for the declared service.', 'Observed latency was 48 ms against a 40 ms criterion in the selected window.'], nextStep: 'Investigate measured service latency with interface and routing evidence; topology alone is insufficient.' };
    case 'verification': return completed
      ? { finding: 'Configuration readback, required routes and change limits meet the recorded verification criteria.', evidence: [`The change on ${device} has an independent controller-completion record.`, 'Configuration readback, routing conditions and the recorded change boundary were checked successfully.'], nextStep: 'Retain the scoped verified result and its approved change record.' }
      : { finding: 'The approved change completed; its operational result is being verified.', evidence: [`The change on ${device} has an independent controller-completion record.`, 'Current configuration and routing observations are being compared with the recorded verification criteria.'], nextStep: 'Keep the result unverified until every required outcome observation is confirmed.' };
    default: return completed
      ? { finding: 'The scoped reachability assessment met its recorded exit criteria.', evidence: ['Reachability and routing observations were collected for the declared target.', 'The recorded assessment criteria were checked within this scope.'], nextStep: 'Retain the scoped assessment result.' }
      : { finding: 'Interface counters and routing observations are being compared with the reported symptoms.', evidence: ['Recent interface counters and reachability probes are available.', 'The current evidence has not established a root cause.'], nextStep: 'Test the remaining hypotheses using scoped interface and routing observations.' };
  }
}

function landingFinding(type, { completed, archiveWait, classified, waiting }) {
  if (archiveWait) return 'Historical analysis awaits archived-event access.';
  if (type.key === 'configuration') return completed ? 'Configuration difference matches an authorized change.' : 'Learned-pattern comparison found an unusual route-policy setting.';
  if (type.key === 'toxic') return completed ? 'No elevated factor association in the assessed cohort.' : 'Software/interface combination associated with repeated BGP drops.';
  if (type.key === 'correlation') return completed ? 'Checked events did not meet incident-classification criteria.' : classified ? 'Related events met incident-classification criteria.' : 'Comparing related interface and BGP events.';
  if (type.key === 'vulnerability') return completed ? 'Advisory does not apply to the observed feature configuration.' : waiting ? 'Advisory assessment awaits enabled-feature evidence.' : 'Checking advisory applicability against enabled-feature evidence.';
  if (type.key === 'capacity') return completed ? 'Measured headroom met the criterion in this window.' : 'Observed peak utilization rose from 61% to 82%.';
  if (type.key === 'assurance') return completed ? 'Service measurements met the recorded criteria.' : 'Sampled service latency exceeds the recorded criterion.';
  if (type.key === 'verification') return completed ? 'Scoped routing-change verification criteria passed.' : 'Checking the operational result of a completed change.';
  return completed ? 'Scoped reachability assessment completed.' : 'Comparing interface and routing observations.';
}

function fleetJob(index, snapshot, secondary = false) {
  const archiveWait = !secondary && index < 17;
  const type = secondary ? types[1] : types[index % types.length];
  const classified = !secondary && !archiveWait && type.key === 'correlation' && index % 16 === 3;
  const domainId = index < 17 ? ['metro-east', 'west', 'north'][index % 3] : NETWORK_DOMAINS[(index * 3 + Math.floor(index / 8)) % NETWORK_DOMAINS.length].id;
  const domain = domainById(domainId);
  const device = `XR-${domain.id.toUpperCase()}-${String(100 + index).padStart(4, '0')}`;
  const completed = !archiveWait && !classified && index % 7 === 0;
  const id = `JOB-${String(1000 + index).padStart(4, '0')}${secondary ? '-C' : ''}`;
  const agentId = archiveWait ? 'troubleshooter' : type.agentId;
  const agent = snapshot.agents[agentId];
  const scope = `${domain.name} · ${device}${archiveWait ? '' : secondary || type.key === 'configuration' ? ' · configuration' : type.key === 'assurance' ? ` · enterprise VPN-${index}` : type.key === 'capacity' ? ' · HundredGigE0/0/0/1' : ''}`;
  const facts = archiveWait
    ? { finding: 'Historical analysis is waiting for event archive access.', evidence: ['The archive prerequisite is shared by these investigations.', 'A shared source constraint does not establish a shared cause for their network symptoms.'], nextStep: 'Retain the investigation and follow up on archived-event access.' }
    : scopedFinding(type, completed, index, device);
  const waiting = !completed && !archiveWait && type.key === 'vulnerability' && index % 16 === 4;
  const status = archiveWait ? 'Waiting for source access' : completed ? type.key === 'verification' ? 'Verified' : 'Assessment complete' : classified ? 'Monitoring incident' : waiting ? 'Waiting for feature evidence' : type.status;
  const incidentId = classified ? `INC-CORR-${1000 + index}` : null;
  return withScope({
    id, issueId: `ISSUE-${1000 + index}`, title: archiveWait ? 'Investigate intermittent reachability' : type.title,
    domainId, deviceId: device, deviceIds: [device], scope, agentId, agent: agent.name, agentVersion: agent.version,
    capabilityId: archiveWait ? 'investigate' : type.capabilityId,
    groupId: archiveWait ? ARCHIVE : type.groupId, dependencyId: archiveWait ? ARCHIVE : null,
    status, tone: archiveWait || waiting ? 'inactive' : completed ? 'positive' : 'info', icon: agent.icon,
    checkpoint: facts.finding, ...facts, landingFinding: landingFinding(type, { completed, archiveWait, classified, waiting }), detail: facts.nextStep, source: archiveWait ? 'CNC event observations · event archive access prerequisite' : type.source,
    authority: type.key === 'verification' && !archiveWait ? 'Recorded approved change · read-only verification' : 'Read-only assessment authority', health: agent.health, canReview: false, priority: archiveWait ? 1 : classified || type.key === 'toxic' || type.key === 'vulnerability' || type.key === 'capacity' ? 2 : 3,
    incidentId,
    ...(classified ? { classification: 'CORR-LINK-01 · shared resource identity and recorded time-window criteria met.' } : {}),
    ...(type.key === 'verification' && !archiveWait ? { operation: { id: `OP-${id}`, state: 'completed', source: `Approved controller-completion record OP-${id}` } } : {}),
    observations: facts.evidence.map((text, observationIndex) => ({ id: `${id}-observation-${observationIndex}`, label: observationIndex === 0 ? 'Observed evidence' : 'Assessment limit', text, source: archiveWait ? 'Event archive dependency record' : type.source, time: '08:10 UTC' })),
    ...(completed ? { resultEvidence: facts.evidence } : {}),
  }, snapshot);
}

function reviewJob(index, snapshot) {
  const domain = NETWORK_DOMAINS[index + 1];
  const device = `XR-${domain.id.toUpperCase()}-${String(501 + index).padStart(4, '0')}`;
  const scope = `${domain.name} · ${device} · route-policy WAN-IMPORT`;
  const id = `REVIEW-${501 + index}`;
  const agent = snapshot.agents.remediation;
  const proposal = {
    id: `PLAN-${id}`, version: 1, available: true, reviewable: snapshot.permissions.reviewChange,
    scope, targets: [device], authority: 'Delegated production-configuration review',
    intent: `Restore approved local preference on ${device} for route-policy WAN-IMPORT.`,
    changeFrom: 'set local-preference 120', changeTo: 'set local-preference 100',
    boundary: `Only the WAN-IMPORT local-preference setting on ${device}. No interfaces or other policies.`,
    validation: [`The configuration readback on ${device} is 120.`, 'The current approved intent requires 100.', 'No authorized change record explains this difference.'],
    verification: ['Read back local preference 100.', 'Compare required routes with approved routing intent.', 'Confirm the change stayed inside the reviewed boundary.'],
    validity: 'Authorization applies only to this proposal version and named target. Revalidate prerequisites before execution.',
    holdConsequence: 'Holding leaves the correction unissued. The agent retains the assessment.',
  };
  const job = withScope({
    id, issueId: `ISSUE-${id}`, domainId: domain.id, deviceId: device, deviceIds: [device],
    title: 'Restore routing policy', scope, agentId: 'remediation', agent: agent.name, agentVersion: agent.version,
    capabilityId: 'assess', groupId: 'change-reviews', status: 'Review required', tone: 'warning', priority: 1,
    checkpoint: 'A bounded correction is ready. Production approval is required.', finding: 'A bounded correction is ready. Production approval is required.', evidence: [...proposal.validation], nextStep: 'Review this proposal version, exact target and verification plan before deciding.',
    detail: 'The agent compared current configuration with approved intent and authorized change records. No controller change has been issued.',
    source: `${id} configuration observation · approved intent · authorized change records`,
    authority: proposal.authority, health: agent.health, canReview: snapshot.permissions.reviewChange, proposal,
  }, snapshot);
  const decision = {
    id: `decision-${id}`, kind: 'job-review', job: id, jobId: id, issueId: job.issueId, agentId: job.agentId,
    domainId: domain.id, title: 'Review routing change', reason: 'Restore approved policy on one router. Production approval required.',
    scope, authority: 'Change', state: 'open', priority: index + 1, proposalId: proposal.id,
  };
  return { job, decision };
}

function issueFor(job, members) {
  return {
    id: job.issueId, jobId: job.id, jobIds: members.map(member => member.id), agentId: job.agentId,
    title: job.title, scope: job.scope, domainId: job.domainId, domainName: job.domainName,
    state: 'open', summary: job.checkpoint, current: job.current,
    deviceIds: [...new Set(members.flatMap(member => member.deviceIds || []))],
  };
}

/** Adds the same deterministic fleet behind the original three independent story records. */
export function buildScaleSnapshot(source, { agentEligibility = {} } = {}) {
  const snapshot = structuredClone(source);
  snapshot.agents = Object.fromEntries(Object.entries(NETWORK_AGENTS).map(([id, agent]) => {
    const original = snapshot.agents?.[id] || {};
    const requested = agentEligibility[id];
    const restricted = requested === 'restricted' || requested === false || requested?.state === 'restricted';
    return [id, { ...agent, ...original, shortName: agent.shortName, description: agent.description, eligibility: requested === undefined ? original.eligibility || agent.eligibility : restricted ? 'restricted' : 'eligible' }];
  }));
  const deviceCount = NETWORK_DOMAINS.reduce((sum, domain) => sum + domain.deviceCount, 0);
  const observedDeviceCount = NETWORK_DOMAINS.reduce((sum, domain) => sum + domain.currentDeviceCount, 0);
  snapshot.network = {
    deviceCount,
    domains: NETWORK_DOMAINS.map(domain => ({ ...domain })),
    currentDeviceCount: snapshot.sourceState === 'current' ? observedDeviceCount : null,
    lastKnownDeviceCount: observedDeviceCount,
    scope: snapshot.variant === 'quiet' ? 'Assessed scopes' : 'All permitted device groups',
    coverageNote: snapshot.sourceState === 'current' ? `Current device observations cover ${observedDeviceCount.toLocaleString('en-US')} of ${deviceCount.toLocaleString('en-US')} registered devices. Coverage does not establish health.` : 'Current coverage is unavailable. Retained records describe the last confirmed observations.',
  };
  snapshot.jobs = snapshot.jobs.map(job => withScope({ ...job, finding: job.checkpoint, evidence: [...(job.resultEvidence || [])], nextStep: job.detail || job.checkpoint }, snapshot));
  snapshot.decisions = snapshot.decisions.map(decision => ({ ...decision, jobId: decision.job || 'ROUTE-104', domainId: 'core', priority: 0, title: 'Review routing change', reason: 'Restore approved policy on XR-R07. Production approval required.' }));
  snapshot.assignedDecisions = (snapshot.assignedDecisions || []).map(decision => ({ ...decision, jobId: decision.job || 'ROUTE-104', domainId: 'core' }));
  if (snapshot.variant !== 'quiet') {
    for (let index = 0; index < 120; index++) {
      snapshot.jobs.push(fleetJob(index, snapshot));
      if (index % 3 === 0) snapshot.jobs.push(fleetJob(index, snapshot, true));
    }
    for (let index = 0; index < 5; index++) {
      const { job, decision } = reviewJob(index, snapshot);
      snapshot.jobs.push(job);
      if (snapshot.permissions.reviewChange) snapshot.decisions.push(decision);
      else snapshot.assignedDecisions.push({ ...decision, state: 'assigned', assignedTo: snapshot.sourceState === 'current' ? 'Delegated production reviewer' : 'Current review authority unavailable' });
    }
  }
  const correlated = snapshot.jobs.filter(job => job.incidentId).map(job => ({
    id: job.incidentId, job: job.id, jobIds: [job.id], issueId: job.issueId, domainId: job.domainId, deviceId: job.deviceId,
    title: 'Correlated interface and BGP events', state: 'active', stage: job.status,
    classification: job.classification, evidence: job.evidence.join(' '), source: job.source, current: snapshot.sourceState === 'current', resolution: null,
  }));
  snapshot.incidents = [...snapshot.incidents, ...correlated];
  const allIssues = new Map(snapshot.issues.map(issue => [issue.id, { ...issue, domainId: originalDomain[issue.jobId], domainName: domainById(originalDomain[issue.jobId])?.name }]));
  const openJobs = snapshot.jobs.filter(job => jobCategory(job) !== 'completed');
  for (const job of openJobs) {
    const members = openJobs.filter(member => member.issueId === job.issueId);
    allIssues.set(job.issueId, { ...issueFor(job, members), ...(allIssues.get(job.issueId) || {}), jobIds: members.map(member => member.id) });
  }
  snapshot.issues = [...allIssues.values()].filter(issue => openJobs.some(job => job.issueId === issue.id));
  snapshot.history = snapshot.jobs.filter(job => jobCategory(job) === 'completed');
  const affected = snapshot.jobs.filter(job => job.dependencyId === ARCHIVE && jobCategory(job) !== 'completed');
  snapshot.dependencies = affected.length ? [{ id: ARCHIVE, title: 'Event archive access', jobIds: affected.map(job => job.id), domainIds: [...new Set(affected.map(job => job.domainId))], detail: 'A shared historical-source prerequisite. Network root causes remain independent until established by evidence.' }] : [];
  snapshot.suggestions = [];
  if (snapshot.sourceState === 'current' && snapshot.variant !== 'quiet') {
    if (affected.length) snapshot.suggestions.push({ id: 'inspect-source-access', dependencyId: ARCHIVE, title: 'Check event archive', reason: `${affected.length} investigations need archived events for historical analysis.`, issueId: 'reachability', jobId: 'REACH-319', agentId: 'troubleshooter', domainId: 'metro-east', capabilityId: 'investigate', optional: true });
    const risk = snapshot.jobs.find(job => job.agentId === 'toxic' && jobCategory(job) === 'running');
    if (risk) snapshot.suggestions.push({ id: 'inspect-toxic-pattern', title: 'Investigate recurring BGP drops', reason: 'A factor association needs troubleshooting evidence before a correction is considered.', issueId: risk.issueId, jobId: risk.id, agentId: risk.agentId, domainId: risk.domainId, capabilityId: 'toxic', optional: true });
  }
  snapshot.scaleSummary = { ...summarizeJobs(snapshot.jobs), issues: snapshot.issues.length, decisions: snapshot.decisions.length };
  return snapshot;
}

/** Shared constraints follow the selected work, including its actual inspection target. */
export function getScopedSuggestions(snapshot, { domainId = 'all', agentId = 'all', dismissed = [] } = {}) {
  const jobs = filterJobs(snapshot.jobs, { domainId, agentId });
  return (snapshot.suggestions || []).flatMap(item => {
    if (dismissed.includes(item.id) || agentId !== 'all' && item.agentId !== agentId) return [];
    if (item.dependencyId) {
      const affected = jobs.filter(job => job.dependencyId === item.dependencyId && jobCategory(job) !== 'completed');
      if (!affected.length) return [];
      return [{ ...item, issueId: affected[0].issueId, jobId: affected[0].id, domainId: affected[0].domainId, reason: `${affected.length} ${affected.length === 1 ? 'investigation needs' : 'investigations need'} archived events for historical analysis.` }];
    }
    return domainId === 'all' || item.domainId === domainId ? [item] : [];
  });
}

const groupNames = {
  'routing-correction': ['Routing policy correction', 'issue'],
  [ARCHIVE]: ['Event archive access', 'dependency'],
  'change-reviews': ['Routing changes', 'work-type'],
  'reachability-checks': ['Reachability investigations', 'work-type'],
  'configuration-checks': ['Configuration checks', 'work-type'],
  'routing-checks': ['Routing investigations', 'work-type'],
  'incident-correlation': ['Incident correlation', 'work-type'],
  'toxic-factors': ['Toxic factor analysis', 'work-type'],
  'vulnerability-checks': ['Advisory assessments', 'work-type'],
  'capacity-analysis': ['Capacity analysis', 'work-type'],
  'service-assurance': ['Service checks', 'work-type'],
  'outcome-checks': ['Change verification', 'work-type'],
};

/** Legacy group membership is retained for saved links; current UI grouping uses primary tasks. */
export function groupJobs(jobs = [], issues = []) {
  const groups = new Map();
  for (const job of jobs) {
    const id = job.groupId || `issue-${job.issueId || job.id}`;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(job);
  }
  return [...groups.entries()].map(([id, members]) => {
    const counts = summarizeJobs(members);
    const domainIds = [...new Set(members.map(job => job.domainId).filter(Boolean))];
    const issueIds = [...new Set(members.map(job => job.issueId).filter(Boolean))];
    const title = groupNames[id]?.[0] || issues.find(issue => issue.id === members[0].issueId)?.title || members[0].title;
    const basis = groupNames[id]?.[1] || 'issue';
    const status = counts.review ? 'Review required' : counts.waiting && counts.running ? 'Partly waiting' : counts.waiting ? 'Waiting' : counts.running ? 'In progress' : 'Complete';
    const summary = basis === 'dependency' ? `${counts.waiting} investigations need event archive access for historical analysis.`
      : basis === 'issue' ? members[0].checkpoint
      : `${issueIds.length} scoped ${issueIds.length === 1 ? 'issue' : 'issues'} · ${counts.running ? `${counts.running} running` : counts.review ? `${counts.review} awaiting review` : counts.completed === counts.total ? `${counts.completed} complete` : `${counts.waiting} waiting`}.`;
    const representative = members.find(job => jobCategory(job) !== 'completed' && job.finding) || members[0];
    const latestFinding = { jobId: representative.id, deviceId: representative.deviceId, scope: representative.scope, agentId: representative.agentId, text: representative.finding || representative.checkpoint, evidence: representative.evidence || [], nextStep: representative.nextStep || representative.detail };
    return { id, title, summary, status, latestFinding, tone: counts.review ? 'warning' : counts.waiting ? 'inactive' : counts.running ? 'info' : 'positive', basis,
      scope: `${domainIds.length} ${domainIds.length === 1 ? 'device group' : 'device groups'}`, agentId: [...new Set(members.map(job => job.agentId))].length === 1 ? members[0].agentId : null,
      jobs: members, jobIds: members.map(job => job.id), count: members.length, counts, domainIds, issueIds,
      priority: Math.min(...members.map(job => job.priority ?? 2)),
    };
  }).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

export function getScopeStats(snapshot, domainId = 'all') {
  const domains = domainId === 'all' ? snapshot.network.domains : snapshot.network.domains.filter(domain => domain.id === domainId);
  const jobs = filterJobs(snapshot.jobs, { domainId });
  const jobIds = new Set(jobs.map(job => job.id));
  const issues = snapshot.issues.filter(issue => (issue.jobIds || [issue.jobId]).some(id => jobIds.has(id)));
  const decisions = snapshot.decisions.filter(decision => domainId === 'all' || decision.domainId === domainId);
  return {
    deviceCount: domains.reduce((sum, domain) => sum + domain.deviceCount, 0),
    currentDeviceCount: snapshot.sourceState === 'current' ? domains.reduce((sum, domain) => sum + domain.currentDeviceCount, 0) : null,
    domainCount: domains.length, issueCount: issues.length, decisionCount: decisions.length, reviewCount: decisions.length, jobCount: jobs.length,
    devices: domains.reduce((sum, domain) => sum + domain.deviceCount, 0), domains: domains.length, issues: issues.length, reviews: decisions.length,
    ...summarizeJobs(jobs),
  };
}
