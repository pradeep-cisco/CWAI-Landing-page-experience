/** Isolated Option 4 fixtures. No operation, permission or source is live. */
import { COMBINED_SCENES, COMBINED_VARIANTS, getCombinedSnapshot } from './story-model.js';

const ROUTE = 'ROUTE-104';
const CHECK = 'CHECK-208';
const REACH = 'REACH-319';
const ROUTE_SCOPE = 'XR-R07 · route-policy WAN-IMPORT';
const REACH_SCOPE = 'Metro East · reachability investigation';

export const AGENT_SCENES = Object.freeze(COMBINED_SCENES.map(scene => Object.freeze({ ...scene })));
export const AGENT_VARIANTS = Object.freeze([
  ...COMBINED_VARIANTS.map(variant => Object.freeze({ ...variant })),
  Object.freeze({ id: 'quiet', label: 'No open issues in assessed scopes', scene: 7 }),
  Object.freeze({ id: 'no-authority', label: 'Assigned to another reviewer', scene: 2 }),
]);

export const AGENTS = Object.freeze({
  cdd: Object.freeze({ id: 'cdd', name: 'Configuration Drift Detection', shortName: 'Configuration drift', icon: 'nav-configuration', initials: 'CD', version: '1.0', health: 'Healthy', description: 'Assesses observed configuration against current intent and authorized changes.' }),
  remediation: Object.freeze({ id: 'remediation', name: 'Remediation agent', shortName: 'Remediation', icon: 'nav-workflows', initials: 'RA', version: '1.0', health: 'Healthy', description: 'Prepares bounded corrections and follows permitted execution through outcome verification.' }),
  troubleshooter: Object.freeze({ id: 'troubleshooter', name: 'Network Troubleshooter', shortName: 'Troubleshooter', icon: 'nav-investigate', initials: 'NT', version: '1.0', health: 'Healthy', description: 'Investigates reachability using the sources available for the selected scope.' }),
});

export const CAPABILITIES = Object.freeze([
  Object.freeze({ id: 'investigate', title: 'Investigate an issue', goal: 'Investigate', agentId: 'troubleshooter', description: 'Understand a reachability condition and inspect the supporting evidence.', scope: REACH_SCOPE, defaultScope: REACH_SCOPE, issueId: 'reachability', authority: 'Read-only investigation', prerequisites: ['Selected network scope', 'Access to the required event sources'], icon: 'nav-investigate', scopeOptions: [REACH_SCOPE, 'North · XR-R21 reachability'] }),
  Object.freeze({ id: 'assess', title: 'Assess configuration changes', goal: 'Assess', agentId: 'cdd', description: 'Compare observed configuration with current intent and authorized change records.', scope: ROUTE_SCOPE, defaultScope: ROUTE_SCOPE, issueId: 'config-route', authority: 'Read-only assessment', prerequisites: ['Current configuration observation', 'Current approved intent', 'Authorized change records'], icon: 'nav-configuration', scopeOptions: [ROUTE_SCOPE, 'XR-R12 · configuration assessment', 'XR-R21 · configuration assessment'] }),
  Object.freeze({ id: 'verify', title: 'Verify an outcome', goal: 'Verify', agentId: 'remediation', description: 'Check a completed correction against its agreed configuration, routing and scope criteria.', scope: ROUTE_SCOPE, defaultScope: ROUTE_SCOPE, issueId: 'config-route', authority: 'Read-only verification', prerequisites: ['Recorded operation completion', 'Current outcome observations', 'Reviewed verification criteria'], icon: 'check-circle', scopeOptions: [ROUTE_SCOPE] }),
]);

const terminal = job => ['Verified', 'Assessment complete', 'Concluded'].includes(job.status);
const issueIdFor = id => ({ [ROUTE]: 'config-route', [CHECK]: 'config-assessment', [REACH]: 'reachability' })[id];
const agentIdFor = (id, scene) => id === REACH ? 'troubleshooter' : id === CHECK || scene < 2 ? 'cdd' : 'remediation';
const scopeKey = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[·/]/g, ' ').replace(/\s+/g, ' ').trim();
const restricted = value => value === 'restricted' || value === false || value?.state === 'restricted';

function incident(snapshot) {
  if (snapshot.scene < 2 || ['expected', 'evidence', 'quiet'].includes(snapshot.variant)) return [];
  return [{
    id: 'INC-104', job: ROUTE, issueId: 'config-route', domainId: 'Core', deviceId: 'XR-R07', title: 'Routing intent mismatch',
    state: snapshot.scene === 7 ? 'resolved' : 'active', stage: snapshot.jobs[0].status,
    classification: 'CFG-INTENT-01 · current routing policy differs from approved intent without a matching authorized change.',
    evidence: `At classification, XR-R07 WAN-IMPORT local preference was ${snapshot.proposal.version >= 2 ? 150 : 120}; approved intent INTENT-XR07-12 required 100. No matching authorized change explained the difference.`,
    source: 'Configuration observations · current intent INTENT-XR07-12 · authorized change records',
    resolution: snapshot.scene === 7 ? 'Current configuration, routing and change-boundary observations satisfy the reviewed criteria.' : null,
    current: snapshot.sourceState === 'current',
  }];
}

function issueFor(job, snapshot) {
  return {
    id: job.issueId, jobId: job.id, agentId: job.agentId, scope: job.scope, state: job.status,
    title: job.id === REACH ? 'Intermittent reachability in Metro East' : job.id === CHECK ? 'Recent configuration changes on XR-R12' : snapshot.scene < 1 ? 'Routing configuration under assessment' : 'Unexpected routing configuration on XR-R07',
    summary: job.checkpoint, current: snapshot.sourceState === 'current',
  };
}

function applyQuietScope(snapshot) {
  const reach = snapshot.jobs.find(job => job.id === REACH);
  Object.assign(reach, {
    status: 'Concluded', tone: 'positive', icon: 'check-circle',
    checkpoint: 'The scoped read-only reachability investigation has concluded.',
    detail: 'This alternate snapshot includes independent archived-source access confirmation and completed observations for REACH-319. It does not derive this result from the routing correction, or establish health outside the assessed scope.',
    source: 'REACH-319 result · archived-source access confirmation · scoped reachability observations',
    resultEvidence: ['Archived-source access confirmed for REACH-319.', 'The read-only investigation met its declared exit criteria within the assessed scope.'],
    observations: [
      { id: 'reach-access-confirmed', label: 'Source access confirmed', text: 'Archived-source access was independently established for REACH-319.', source: 'REACH-319 archived-source access confirmation', time: '08:12:00 UTC' },
      { id: 'reach-result-confirmed', label: 'Scoped result retained', text: 'The read-only investigation met its declared exit criteria. This result does not establish health outside its assessed scope.', source: 'REACH-319 independent result', time: '08:12:00 UTC' },
    ],
  });
  snapshot.actions.push({ id: 'reachability-concluded', job: REACH, title: 'Scoped reachability investigation concluded', label: 'Read-only result', time: '08:12:00 UTC', tone: 'positive', icon: 'check-circle', detail: reach.detail, record: 'REACH-319 independent result', actor: 'Network Troubleshooter · read-only investigation', scope: reach.scope });
  snapshot.decisions = [];
  snapshot.proposal.reviewable = false;
  snapshot.summary = 'No open issues in these assessed scopes. These results do not establish health across the network.';
}

export function getAgentCentricSnapshot(value = 2, variantValue = 'main', { proposalVersion = 1, agentEligibility = {} } = {}) {
  const selected = AGENT_VARIANTS.find(item => item.id === variantValue) || AGENT_VARIANTS[0];
  const special = ['quiet', 'no-authority'].includes(selected.id);
  const snapshot = getCombinedSnapshot(special ? selected.scene : value, special ? 'main' : selected.id, { proposalVersion });
  snapshot.variant = selected.id;
  if (selected.id === 'quiet') applyQuietScope(snapshot);

  snapshot.agents = Object.fromEntries(Object.entries(AGENTS).map(([id, agent]) => [id, { ...agent, eligibility: restricted(agentEligibility[id]) ? 'restricted' : 'eligible' }]));
  if (selected.id === 'capability') snapshot.agents.remediation.health = 'Verification capability unavailable';
  snapshot.permissions = { startReadOnly: snapshot.sourceState === 'current', reviewChange: selected.id !== 'no-authority' && snapshot.sourceState === 'current', governAgents: snapshot.sourceState === 'current' };
  snapshot.scopeLabel = selected.id === 'quiet' ? 'Assessed scopes' : 'Permitted network scopes';
  snapshot.jobs = snapshot.jobs.map(job => {
    const agentId = agentIdFor(job.id, snapshot.scene);
    const agent = snapshot.agents[agentId];
    return { ...job, agentId, agent: agent.name, agentVersion: agent.version, issueId: issueIdFor(job.id), health: agent.health, authority: job.id === ROUTE && snapshot.scene >= 2 ? snapshot.proposal.authority : 'Existing read-only assessment authority', current: snapshot.sourceState === 'current' };
  });
  snapshot.jobs[2].authority = 'Existing read-only investigation authority';

  // An agent-owned constraint is not silently converted into an approval task.
  snapshot.handled = snapshot.decisions.filter(decision => !['review-plan', 'review-updated-plan'].includes(decision.id)).map(decision => ({ ...decision, issueId: 'config-route', agentId: snapshot.jobs[0].agentId, state: 'being-handled' }));
  snapshot.decisions = snapshot.decisions.filter(decision => ['review-plan', 'review-updated-plan'].includes(decision.id)).map(decision => ({ ...decision, kind: 'plan', authority: 'Change', issueId: 'config-route', agentId: 'remediation', state: 'open' }));
  snapshot.assignedDecisions = [];
  if (selected.id === 'no-authority') {
    snapshot.assignedDecisions = snapshot.decisions.map(decision => ({ ...decision, state: 'assigned', assignedTo: 'Delegated production-configuration reviewer' }));
    snapshot.decisions = [];
    snapshot.jobs[0].canReview = false;
    snapshot.jobs[0].checkpoint = 'The bounded proposal is assigned to a delegated production-configuration reviewer.';
    snapshot.proposal.reviewable = false;
  }
  if (snapshot.scene === 3 && selected.id === 'main') snapshot.submittedDecision = { id: 'review-plan', job: ROUTE, issueId: 'config-route', state: 'submitted', title: 'Decision submitted', reason: 'Authority-service confirmation is pending. No controller operation has been issued.' };

  snapshot.incidents = incident(snapshot);
  snapshot.issues = snapshot.jobs.filter(job => !terminal(job)).map(job => issueFor(job, snapshot));
  snapshot.history = snapshot.jobs.filter(terminal).map(job => ({ ...job }));
  snapshot.actions = snapshot.actions.map(record => {
    const agentId = agentIdFor(record.job, record.id === 'assessment-completed' || record.id === 'expected-change-confirmed' ? 1 : snapshot.scene);
    return { ...record, issueId: issueIdFor(record.job), agentId, agent: AGENTS[agentId].name, agentVersion: AGENTS[agentId].version, authority: record.job === ROUTE && !['expected-change-confirmed'].includes(record.id) ? snapshot.proposal.authority : 'Existing read-only authority' };
  });
  snapshot.suggestions = snapshot.sourceState === 'current' && selected.id !== 'quiet' ? [{
    id: 'inspect-source-access', title: 'Review source access', reason: 'Archived events are blocking the Metro East investigation. Review its source context.', issueId: 'reachability', agentId: 'troubleshooter', capabilityId: 'investigate', scope: REACH_SCOPE, optional: true,
  }] : [];
  return snapshot;
}

/** Readiness describes a scoped new request. It never grants write authority. */
export function getCapabilityReadiness(capabilityId, snapshot, scope) {
  const capability = CAPABILITIES.find(item => item.id === capabilityId);
  if (!capability) return { state: 'unavailable', label: 'Unavailable', reason: 'This capability is not part of this concept.', canStart: false };
  const agent = snapshot.agents?.[capability.agentId] || AGENTS[capability.agentId];
  const target = scope || capability.defaultScope;
  if (snapshot.sourceState !== 'current') return { state: 'unavailable', label: 'Visibility interrupted', reason: 'Current source visibility and readiness cannot be established. Last-known work remains inspectable.', canStart: false };
  if (agent.eligibility === 'restricted') return { state: 'restricted', label: 'Restricted', reason: 'This agent is not eligible for new assignments. Existing work keeps its own state and ownership.', canStart: false };
  if (agent.health !== 'Healthy') return { state: 'degraded', label: 'Capability unavailable', reason: 'The required verification capability cannot currently collect reliable outcome observations.', canStart: false };
  if (!capability.scopeOptions.some(option => scopeKey(option) === scopeKey(target))) return { state: 'scope-required', label: 'Select a permitted scope', reason: 'This concept does not establish readiness or authority for that scope.', canStart: false };
  if (capabilityId === 'investigate' && scopeKey(target) === scopeKey(REACH_SCOPE) && snapshot.variant !== 'quiet') return { state: 'needs-access', label: 'Needs source access', reason: 'The existing Metro East investigation is waiting for archived-event access. The agent remains healthy; this does not establish a new source path.', canStart: false };
  if (capabilityId === 'assess' && snapshot.variant === 'evidence' && scopeKey(target) === scopeKey(ROUTE_SCOPE)) return { state: 'needs-evidence', label: 'Needs current intent', reason: 'Current authoritative intent must be established before this scoped assessment can reach a justified finding.', canStart: false };
  if (capabilityId === 'verify' && !snapshot.actions.some(record => record.id === 'operation-completed' && scopeKey(record.scope) === scopeKey(target))) return { state: 'not-ready', label: 'Awaiting completion', reason: 'This scoped correction has no confirmed operation-completion record. Verification cannot start from a submitted decision or execution acknowledgement.', canStart: false };
  return { state: 'ready', label: 'Ready', reason: 'A scoped read-only request is permitted. It does not issue a network change or authorize a later correction.', canStart: true };
}

/** Exact scope matching prevents a device assessment from covering a domain. */
export function findExistingWork(capabilityId, scope, snapshot) {
  const target = scopeKey(scope);
  if (!target) return null;
  const eligible = capabilityId === 'investigate' ? [REACH] : capabilityId === 'assess' ? [ROUTE, CHECK] : capabilityId === 'verify' && snapshot.actions.some(record => record.id === 'operation-completed') ? [ROUTE] : [];
  return snapshot.jobs.find(job => eligible.includes(job.id) && scopeKey(job.scope) === target) || null;
}
