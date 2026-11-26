/**
 * Deterministic, illustrative story snapshots. Selecting a snapshot never sends
 * a decision, changes authority, or issues a network operation.
 */
export const COMBINED_SCENES = Object.freeze([
  { id: 0, title: 'Continuing work', shortTitle: 'Arrival' },
  { id: 1, title: 'Configuration finding confirmed', shortTitle: 'Finding' },
  { id: 2, title: 'A bounded plan needs review', shortTitle: 'Review' },
  { id: 3, title: 'Decision submitted; confirmation pending', shortTitle: 'Submitted' },
  { id: 4, title: 'Authorization effective; checking prerequisites', shortTitle: 'Checking' },
  { id: 5, title: 'Controller acknowledges execution', shortTitle: 'Executing' },
  { id: 6, title: 'Operation complete; verifying the outcome', shortTitle: 'Verifying' },
  { id: 7, title: 'Routing intent restored and verified', shortTitle: 'Verified' },
].map(Object.freeze));

/** Alternate branches start at their own meaningful checkpoint, not a timer. */
export const COMBINED_VARIANTS = Object.freeze([
  { id: 'main', label: 'Main story', scene: 2 },
  { id: 'expected', label: 'Expected change', scene: 1 },
  { id: 'evidence', label: 'Missing evidence', scene: 1 },
  { id: 'held', label: 'Plan held', scene: 2 },
  { id: 'revision', label: 'Revision requested', scene: 2 },
  { id: 'changed', label: 'Plan changed', scene: 2 },
  { id: 'unknown', label: 'Execution unknown', scene: 5 },
  { id: 'partial', label: 'Partial result', scene: 6 },
  { id: 'capability', label: 'Verification unavailable', scene: 6 },
  { id: 'offline', label: 'Data interrupted', scene: 6 },
].map(Object.freeze));

const ROUTE = 'ROUTE-104';
const CHECK = 'CHECK-208';
const REACH = 'REACH-319';
const ROUTE_SCOPE = 'XR-R07 · route-policy WAN-IMPORT';
const CHECK_SCOPE = 'XR-R12 · configuration assessment';
const REACH_SCOPE = 'Metro East · reachability investigation';
const OPERATION = 'OP-ROUTE-104';
const POLICY = 'GOV-CFG-04';
const AGENT_POLICY = 'GOV-AGT-02';
const STAGES = ['Assess', 'Review', 'Execute', 'Verify'];
const AGENTS = Object.freeze({ route: 'Remediation agent R1 · v2.3', check: 'Config Drift agent D1 · v1.8', reach: 'Network Troubleshooter T1 · v3.1' });
const T1_CAPABILITY = 'Network Troubleshooter T1 · collection · v3.1';
// Illustrative source times per main-story scene; governance records take the time of the scene they were confirmed in.
const SCENE_TIMES = ['07:56', '07:57', '08:00', '08:01', '08:02', '08:03', '08:05', '08:07'];
export const AGENT_DECISION_STATES = Object.freeze(['pending', 'submitted', 'restricted', 'retained']);

const routeStates = [
  ['Assess routing configuration', 'Assessing', 'info', 'Checking against approved routing intent.', 'Crosswork AI is establishing current intent, baseline currency, matching authorized changes, and relevant observations. A configuration difference alone does not establish an incident, impact, or cause.', 0],
  ['Assess routing configuration', 'Drift confirmed', 'info', 'Unexpected drift confirmed against approved routing intent.', 'Current intended configuration and the observed configuration differ. No matching authorized change explains this difference. Incident classification and any operational impact require their own evidence.', 0],
  ['Restore approved routing intent', 'Review required', 'warning', 'Corrective plan prepared; no network write issued.', 'The configured policy requires a delegated production-configuration reviewer to decide on the exact proposal. Crosswork AI retains the technical work.', 1],
  ['Restore approved routing intent', 'Decision submitted', 'info', 'Awaiting confirmation from the authority service.', 'The decision request is pending. It is not an effective grant, and no controller operation has been issued.', 1],
  ['Restore approved routing intent', 'Checking', 'info', 'Effective authority recorded; current prerequisites are being rechecked.', 'The grant applies only to the reviewed proposal and scope. Crosswork AI is checking authority, resource state, current intent, and required evidence before any governed write.', 1],
  ['Restore approved routing intent', 'Executing', 'info', 'Controller acknowledged the scoped operation.', 'The controller has acknowledged execution under the effective grant. This establishes neither completion nor a verified outcome. Further unissued writes remain subject to their own applicable checks.', 2],
  ['Restore approved routing intent', 'Verifying', 'info', 'Operation completed; required outcome observations are being checked.', 'Command completion is recorded separately from proof. Crosswork AI is checking fresh post-action observations against this proposal’s configuration, routing, and scope criteria.', 3],
  ['Restore approved routing intent', 'Verified', 'positive', 'Approved routing intent restored within the reviewed scope.', 'This proposal’s current post-action observations satisfy its required criteria. The independent assessment and unresolved reachability investigation keep their own results and constraints.', 4],
];

export function normalizeCombinedScene(value = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(7, Math.trunc(number))) : 2;
}

function normalizeVersion(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(1, Math.trunc(number)) : 1;
}

function routeJob(scene, version) {
  const [title, status, tone, checkpoint, detail, step] = routeStates[scene];
  return {
    id: ROUTE, title, scope: ROUTE_SCOPE, status, tone,
    icon: scene === 7 ? 'status-positive' : 'nav-configuration',
    checkpoint, detail, agent: AGENTS.route,
    health: 'Healthy',
    source: scene < 2 ? 'INTENT-XR07-12 · configuration observations · change records' : scene < 5 ? `PLAN-ROUTE-104 v${version} · authority service` : `PLAN-ROUTE-104 v${version} · ${OPERATION} · outcome observations`,
    steps: [...STAGES], step, canReview: scene === 2,
  };
}

function assessmentJob(scene) {
  const completed = scene >= 1;
  return {
    id: CHECK, title: 'Check recent configuration changes', scope: CHECK_SCOPE,
    status: completed ? 'Assessment complete' : 'Assessing', tone: completed ? 'positive' : 'info',
    icon: completed ? 'check-circle' : 'nav-configuration',
    checkpoint: completed ? 'Changes match their current authorized records.' : 'Comparing recent changes with their authorized records.',
    detail: completed ? 'The read-only assessment found expected changes within XR-R12’s assessed scope. It neither authorizes ROUTE-104 nor establishes another job’s outcome.' : 'This independent read-only assessment continues under its existing authority. Its sources, finding, and result belong to XR-R12.',
    agent: AGENTS.check, health: 'Healthy',
    source: 'CHECK-208 · XR-R12 observations · authorized change CHG-208', canReview: false,
  };
}

function reachabilityJob() {
  return {
    id: REACH, title: 'Investigate intermittent reachability', scope: REACH_SCOPE,
    status: 'Waiting for source access', tone: 'inactive', icon: 'nav-investigate',
    checkpoint: 'Archived event-source access is required for this investigation.',
    detail: 'Crosswork AI retains the investigation and follows up with the integration owner. Access to the archived event source must be established and rechecked before this job can resume. Another job’s success does not supply this evidence.',
    agent: AGENTS.reach, health: 'Healthy',
    source: 'Archived event integration · missing source-access prerequisite', canReview: false,
  };
}

/**
 * The main story's governance thread: T1's collection capability degrades at
 * the finding, is escalated with the plan review, and changes only when the
 * person's governance decision is confirmed. It never alters REACH-319's
 * source prerequisite, ownership, or another job's state.
 */
function applyAgentThread(snapshot, scene, agentDecision) {
  const reach = snapshot.jobs.find(job => job.id === REACH);
  const state = AGENT_DECISION_STATES.includes(agentDecision?.state) ? agentDecision.state : 'pending';
  if (scene === 1) {
    reach.health = 'Degraded collection · recovery in progress';
    snapshot.handled.push('Crosswork AI is recovering T1 collection. No decision is needed yet.');
    return;
  }
  if (scene < 2) return;
  const decidedAt = `${SCENE_TIMES[Math.max(2, Math.min(7, Math.trunc(Number(agentDecision?.scene) || 2)))]}:30 UTC`;
  Object.assign(reach, { status: 'Constrained', tone: 'inactive' });
  if (state === 'restricted') {
    Object.assign(reach, {
      health: 'Restricted · no new collection assignments',
      checkpoint: 'Source access is missing, and T1 is restricted from new collection assignments.',
      detail: 'The confirmed restriction stops new production assignments that need T1 collection. REACH-319 stays with T1 and remains constrained; the restriction does not cancel, repair, or reassign it. Crosswork AI retains follow-up on source access and capability recovery.',
    });
    snapshot.handled.push('T1 remains restricted from new collection assignments. Crosswork AI retains REACH-319.');
    snapshot.actions.push(action('restriction-effective', REACH, 'Assignment restriction effective', 'New collection assignments stopped', decidedAt, 'info', 'status-dormant', 'The governor confirms that Network Troubleshooter T1 v3.1 receives no new production assignments needing collection. Existing work stays with T1 and is not cancelled, repaired, or reassigned.', `RESTRICT-T1-COLLECT-v3.1 · ${AGENT_POLICY}`, 'You · governance authority · confirmed by the Crosswork AI governor', T1_CAPABILITY, `Governance · ${AGENT_POLICY}`));
    return;
  }
  if (state === 'retained') {
    Object.assign(reach, {
      health: 'Degraded collection · eligibility retained',
      checkpoint: 'Source access is missing, and T1 collection remains degraded under current eligibility.',
      detail: 'Current eligibility is retained by your confirmed decision. Crosswork AI continues bounded recovery and withholds assignments whose prerequisites are unsupported. REACH-319 stays with T1 and remains constrained.',
    });
    snapshot.handled.push('T1 collection remains degraded. Crosswork AI continues recovery under current eligibility.');
    snapshot.actions.push(action('eligibility-retained', REACH, 'Current eligibility retained', 'No restriction in effect', decidedAt, 'inactive', 'nav-configuration', 'The governor confirms that T1 v3.1 keeps its current production eligibility. Recovery continues; no restriction is in effect.', `ELIGIBILITY-T1-COLLECT-v3.1 · ${AGENT_POLICY}`, 'You · governance authority · confirmed by the Crosswork AI governor', T1_CAPABILITY, `Governance · ${AGENT_POLICY}`));
    return;
  }
  Object.assign(reach, {
    health: 'Degraded collection · recovery exhausted',
    checkpoint: 'Source access is missing, and T1 collection is escalated for your decision.',
    detail: 'T1 keeps timing out on required collection. Bounded recovery has not restored it, and no eligible authorized replacement exists. Crosswork AI retains REACH-319 and already withholds assignments whose prerequisites are unsupported.',
  });
  snapshot.decisions.push({
    id: 'agent-escalation', kind: 'escalation', authority: 'Governance', job: REACH,
    title: 'Review agent escalation',
    reason: state === 'submitted' ? 'Decision submitted; awaiting confirmation from the governor.' : 'T1 collection recovery is exhausted; no eligible replacement.',
    scope: T1_CAPABILITY, action: 'Review escalation', state: state === 'submitted' ? 'submitted' : 'open',
  });
}

/** Escalation content for review; the controls are simulated and never change real eligibility. */
export function getAgentEscalation() {
  return {
    agent: AGENTS.reach,
    capability: 'Event and telemetry collection',
    affectedWork: `${REACH} · ${REACH_SCOPE}`,
    authority: `Governance · ${AGENT_POLICY} reserves production-eligibility decisions for governance authority.`,
    intro: 'Network Troubleshooter T1 v3.1 keeps timing out on required collection. Bounded recovery has not restored it, and no eligible authorized replacement is available.',
    attempts: [
      { time: '07:58 UTC', text: 'Collector session restarted · timed out again' },
      { time: '07:59 UTC', text: 'Alternate collector path · timed out' },
      { time: '08:00 UTC', text: 'Replacement search · no eligible authorized agent' },
    ],
    restrict: 'T1 receives no new production assignments that need collection. REACH-319 stays with T1 and remains constrained; the restriction does not cancel, repair, or reassign it.',
    retain: 'T1 can still receive collection work. Crosswork AI continues recovery and withholds assignments whose prerequisites are unsupported.',
    reassign: 'Reassign is unavailable: no eligible, authorized replacement exists.',
    ownership: 'Crosswork AI retains REACH-319, source-access follow-up, and capability recovery.',
  };
}

function buildProposal(scene, version) {
  const observedPreference = version >= 2 ? 150 : 120;
  const available = scene >= 2;
  return {
    id: 'PLAN-ROUTE-104', version, available,
    title: available ? 'Restore approved routing intent' : 'Corrective response not yet prepared',
    scope: ROUTE_SCOPE,
    intent: 'Restore approved local preference 100 in WAN-IMPORT on XR-R07.',
    changeFrom: available ? `route-policy WAN-IMPORT\n  set local-preference ${observedPreference}\nend-policy` : '',
    changeTo: available ? 'route-policy WAN-IMPORT\n  set local-preference 100\nend-policy' : '',
    authority: scene >= 4 ? `${POLICY} · effective delegated grant AUTH-ROUTE-104-v${version}, limited to this proposal and scope.` : `${POLICY} requires a delegated production-configuration reviewer. A governance role alone does not grant this authority.`,
    boundary: 'Only this local-preference statement on XR-R07 is covered.',
    holdConsequence: 'Holding keeps this correction unissued. Crosswork AI retains ownership; independently permitted work continues.',
    validity: 'Authorization is valid only for the reviewed proposal version, unchanged scope, current resource state, and required evidence. Recheck applicable authority and prerequisites before each governed write.',
    validation: available ? [
      'Current intended configuration INTENT-XR07-12 requires local preference 100.',
      `Current XR-R07 observation shows local preference ${observedPreference}; the baseline is current.`,
      'No matching authorized change explains this difference.',
      'The bounded response and required post-action observations are defined; verification is still outstanding.',
    ] : ['Current intent, baseline currency, change records, and observations are still being assessed.'],
    recovery: 'Crosswork AI must establish the resulting state before supported recovery. A new decision may be required.',
    reviewable: scene === 2,
    previousVersion: version > 1 ? version - 1 : null,
    changeSummary: version === 2 ? 'A newer XR-R07 observation shows local preference 150 instead of 120. Proposal v1 no longer matches the current resource state; v2 requires fresh review.' : version > 2 ? `Revised proposal v${version} has been revalidated against current observations. Review its exact change; authorization of v${version - 1} does not carry over.` : null,
  };
}

function buildCriteria(scene) {
  return [
    {
      id: 'configuration', title: 'Approved route policy matches', state: scene >= 6 ? 'met' : 'pending',
      detail: scene >= 6 ? 'A fresh configuration readback shows local preference 100 in WAN-IMPORT on XR-R07.' : 'Await a post-action configuration readback against INTENT-XR07-12; a write response alone is not proof.',
      source: 'XR-R07 post-action configuration readback · INTENT-XR07-12', time: scene >= 6 ? '08:05:20 UTC' : null,
    },
    {
      id: 'routing', title: 'Required routing conditions hold', state: scene === 7 ? 'met' : 'pending',
      detail: scene === 7 ? 'The current routing observations satisfy the neighbor-session and selected-route conditions defined in the reviewed plan.' : 'Required post-action neighbor-session and selected-route observations are outstanding. No service-wide health conclusion is implied.',
      source: 'XR-R07 post-action routing observations · reviewed outcome criteria', time: scene === 7 ? '08:07:00 UTC' : null,
    },
    {
      id: 'boundary', title: 'Reviewed change boundary preserved', state: scene === 7 ? 'met' : 'pending',
      detail: scene === 7 ? 'The operation trace and current configuration comparison show only the correction covered by the reviewed proposal.' : 'Confirm the resulting configuration difference and operation trace stay within the reviewed scope.',
      source: `${OPERATION} trace · post-action configuration comparison`, time: scene === 7 ? '08:07:00 UTC' : null,
    },
  ];
}

function action(id, job, title, label, time, tone, icon, detail, record, actor, scope, authority) {
  return { id, job, title, label, time, tone, icon, detail, record, actor, scope, authority };
}

function buildActions(scene, version) {
  const actions = [];
  const grant = `AUTH-ROUTE-104-v${version} · ${POLICY}`;
  if (scene >= 1) actions.push(action('assessment-completed', CHECK, 'Independent assessment completed', 'Scoped assessment', '07:57:00 UTC', 'positive', 'check-circle', 'XR-R12’s observed changes match CHG-208. This is CHECK-208’s read-only result; it provides no authority or outcome evidence for the other jobs.', 'CHECK-208 result · CHG-208', 'Crosswork AI · configuration assessment', CHECK_SCOPE, 'Existing read-only assessment authority'));
  if (scene >= 4) actions.push(action('plan-authorized', ROUTE, 'Plan authorized', `Proposal v${version}`, '08:02:00 UTC', 'info', 'check-circle', `The authority service confirms AUTH-ROUTE-104-v${version} for PLAN-ROUTE-104 v${version} and its exact scope. This effective grant does not establish that a controller operation was issued.`, `AUTH-ROUTE-104-v${version} · ${POLICY}`, 'Delegated configuration reviewer · authority service confirmation', ROUTE_SCOPE, `Change · ${grant}`));
  if (scene >= 5) actions.push(action('execution-acknowledged', ROUTE, 'Controller execution acknowledged', OPERATION, '08:03:00 UTC', 'info', 'status-in-progress', `${OPERATION} has an acknowledged execution start for proposal v${version}, following effective authority and prerequisite checks. Acknowledgement does not establish completion or a verified result.`, `${OPERATION} start · AUTH-ROUTE-104-v${version}`, 'Network controller · execution acknowledgement', ROUTE_SCOPE, `Change · ${grant}`));
  if (scene >= 6) actions.push(action('operation-completed', ROUTE, 'Configuration operation completed', 'Outcome not yet established', '08:05:00 UTC', 'info', 'check-circle', `${OPERATION} reports completion for proposal v${version}. This execution result remains separate from the required current post-action observations and verified outcome.`, `${OPERATION} completion record`, 'Network controller · execution result', ROUTE_SCOPE, `Change · ${grant}`));
  if (scene >= 7) actions.push(action('outcome-verified', ROUTE, 'Routing intent restored', 'Scoped outcome verified', '08:07:00 UTC', 'positive', 'status-positive', `Current post-action observations satisfy proposal v${version}’s configuration, routing, and scope criteria. Authority, acknowledged execution, operation completion, and proof remain distinct linked records. Other jobs retain their own conditions.`, 'ROUTE-104 outcome proof · configuration and routing observations', 'Crosswork AI · outcome verification', ROUTE_SCOPE, `Change · ${grant}`));
  return actions;
}

// Enforcement worked: a boundary record, not a violation or an execution failure.
function preventedRequest(version) {
  return action('request-prevented', ROUTE, 'Prevented request', 'Out-of-scope change not issued', '08:03:40 UTC', 'inactive', 'status-dormant', `${AGENTS.route} requested an additional statement on XR-R07 outside PLAN-ROUTE-104 v${version}. ${POLICY} enforcement blocked it before issue; no operation was issued. The authorized operation continues unaffected.`, `ENF-ROUTE-104-01 · ${POLICY}`, 'Crosswork AI governor · policy enforcement', ROUTE_SCOPE, `Change · AUTH-ROUTE-104-v${version} covers only the reviewed local-preference statement`);
}

function reviewDecision() {
  return { id: 'review-plan', kind: 'plan', authority: 'Change', job: ROUTE, title: 'Review configuration response', reason: 'Production correction requires your delegated review.', scope: ROUTE_SCOPE, action: 'Review plan', state: 'open' };
}

// An explicit correlation record, separate from a drift finding or job tone.
function incidentRecords(scene, variant, version) {
  if (scene < 2 || ['expected', 'evidence'].includes(variant)) return [];
  return [{
    id: 'INC-104', job: ROUTE, domainId: 'Core', deviceId: 'XR-R07',
    title: 'Routing intent mismatch',
    state: scene === 7 ? 'resolved' : 'active',
    stage: ({ held: 'Response held', revision: 'Revising response', changed: 'Review required', unknown: 'Reconciling execution', partial: 'Reconciling result', capability: 'Verification unavailable', offline: 'Verifying' })[variant] || ['Assessing', 'Assessing', 'Review required', 'Awaiting authority', 'Checking', 'Remediating', 'Verifying', 'Resolved'][scene],
    classification: 'CFG-INTENT-01 · current routing policy differs from approved intent without a matching authorized change.',
    evidence: `At classification, XR-R07 WAN-IMPORT local preference was ${version >= 2 ? 150 : 120}; approved intent INTENT-XR07-12 requires 100. No matching authorized change.`,
    source: 'Event correlation · configuration observations · authorized change records',
    resolution: scene === 7 ? 'Current configuration, routing, and change-boundary evidence satisfy the scoped resolution criteria.' : null,
    current: variant !== 'offline',
  }];
}

function exception(id, title, reason, actionLabel = 'Inspect constraint') {
  return { id, kind: 'exception', job: ROUTE, title, reason, scope: ROUTE_SCOPE, action: actionLabel, state: 'open' };
}

function unavailableCriteria(criteria, detail) {
  return criteria.map(criterion => ({ ...criterion, state: 'unavailable', detail, time: null }));
}

/**
 * All non-main variants are coherent alternate checkpoints. The optional v2
 * carries a deliberately refreshed proposal through later main-story stages.
 * Offline is the fixed last-known verifying checkpoint, never new proof.
 */
export function getCombinedSnapshot(value = 2, variantValue = 'main', { proposalVersion = 1, agentDecision = null } = {}) {
  const variant = COMBINED_VARIANTS.some(item => item.id === variantValue) ? variantValue : 'main';
  const branch = COMBINED_VARIANTS.find(item => item.id === variant);
  const scene = variant === 'main' ? normalizeCombinedScene(value) : branch.scene;
  const version = variant === 'changed' ? Math.max(2, normalizeVersion(proposalVersion)) : normalizeVersion(proposalVersion);
  const route = routeJob(scene, version);
  const snapshot = {
    scene, variant, jobs: [route, assessmentJob(scene), reachabilityJob()],
    decisions: scene === 2 ? [reviewDecision()] : [],
    actions: buildActions(scene, version), proposal: buildProposal(scene, version),
    criteria: buildCriteria(scene), sourceState: 'current', summary: '', handled: [],
    incidents: incidentRecords(scene, variant, version),
  };

  if (variant === 'main') {
    // A submitted decision stays readable until its outcome is confirmed.
    if (scene === 3) snapshot.decisions.push({ ...reviewDecision(), reason: 'Decision submitted; awaiting confirmation from the authority service.', action: 'Inspect decision', state: 'submitted' });
    if (scene >= 5) snapshot.actions.push(preventedRequest(version));
    applyAgentThread(snapshot, scene, agentDecision);
    snapshot.actions.sort((a, b) => a.time.localeCompare(b.time));
  }

  if (variant === 'expected') {
    Object.assign(route, { status: 'Assessment complete', tone: 'positive', icon: 'check-circle', checkpoint: 'The difference matches an authorized change.', detail: 'CHG-104 and current approved intent explain the observed local preference of 120. This scoped assessment does not require restoration, establish an incident, or prove another job’s outcome.', source: 'CHG-104 · current approved intent · XR-R07 observation', steps: undefined, step: undefined });
    snapshot.proposal.available = false;
    snapshot.proposal.intent = 'The current authorized change and intended configuration explain the observation. No corrective response is proposed.';
    snapshot.proposal.validation = ['CHG-104 matches the observed scope and current intended local preference of 120.'];
    snapshot.actions.push(action('expected-change-confirmed', ROUTE, 'Expected configuration change confirmed', 'Assessment result', '07:58:00 UTC', 'positive', 'check-circle', 'The observation matches CHG-104 and current intended configuration. No corrective operation or incident is inferred.', 'ROUTE-104 assessment · CHG-104', 'Crosswork AI · configuration assessment', ROUTE_SCOPE));
  }

  if (variant === 'evidence') {
    Object.assign(route, { status: 'Waiting for evidence', tone: 'inactive', checkpoint: 'Current authoritative intent must be established.', detail: 'The available baseline is outdated and cannot establish the approved target. Crosswork AI retains the assessment while the intent-source owner resolves the missing current record. No corrective write is proposed.', source: 'Intent registry · current baseline unavailable' });
    snapshot.proposal.available = false;
    snapshot.proposal.intent = 'The approved target is unresolved. Restoration is not offered against an uncertain baseline.';
    snapshot.proposal.validation = ['Current authoritative intent is missing; baseline currency is not established.'];
    snapshot.criteria = unavailableCriteria(snapshot.criteria, 'No corrective proposal is active. Current authoritative intent must be established before defining a justified correction.');
  }

  if (variant === 'held') {
    Object.assign(route, { status: 'Held', tone: 'inactive', checkpoint: 'Hold confirmed; this correction has not been issued.', detail: 'The delegated reviewer’s hold is confirmed for this proposal. Crosswork AI retains ownership and may continue independently permitted read-only work. Holding is not cancellation or rollback.', canReview: false });
    snapshot.decisions = [];
    snapshot.proposal.reviewable = false;
    snapshot.actions.push(action('plan-held', ROUTE, 'Plan held', `Proposal v${version}`, '08:01:00 UTC', 'inactive', 'nav-configuration', `The confirmed hold prevents issuance of the governed correction in proposal v${version}. No operation was issued; technical ownership remains with Crosswork AI.`, `HOLD-ROUTE-104-v${version}`, 'Delegated configuration reviewer · confirmed hold', ROUTE_SCOPE));
  }

  if (variant === 'revision') {
    Object.assign(route, { status: 'Revision requested', tone: 'info', checkpoint: 'Awaiting a revised, revalidated proposal.', detail: 'The request for revision is confirmed. Crosswork AI retains the work and must produce a revised validated proposal before another authorization decision. The previous proposal is not open for live approval.', canReview: false });
    snapshot.decisions = [];
    snapshot.proposal.reviewable = false;
    snapshot.proposal.validity = 'Revision is requested. No revised proposal is yet validated or authorized; the prior version is not available for live approval.';
    snapshot.actions.push(action('revision-requested', ROUTE, 'Plan revision requested', `Proposal v${version}`, '08:01:00 UTC', 'info', 'nav-configuration', `The reviewer requested a revised response to proposal v${version}. This confirmed request is not a grant or network operation. Any revised proposal needs applicable validation and fresh review.`, `REVISION-ROUTE-104-v${version}`, 'Delegated configuration reviewer · confirmed revision request', ROUTE_SCOPE));
  }

  if (variant === 'changed') {
    Object.assign(route, { status: 'Plan changed', tone: 'warning', checkpoint: `Proposal v${version} needs a deliberate refreshed review.`, detail: 'The current proposal must be reviewed against the current resource state. No governed operation has been issued, and earlier authority cannot silently carry over.', canReview: true });
    snapshot.proposal.reviewable = false;
    snapshot.proposal.validity = `Proposal v${version - 1} is superseded. Refresh and inspect v${version} before authorizing its exact current change; no operation is issued by refreshing.`;
    snapshot.decisions = [{ ...reviewDecision(), id: 'review-updated-plan', title: 'Review updated response', reason: `Proposal v${version - 1} is superseded; the current version needs review.`, action: 'Review updated plan' }];
  }

  if (variant === 'unknown') {
    Object.assign(route, { status: 'Execution status unknown', tone: 'warning', icon: 'status-warning', checkpoint: 'Reconciling the acknowledged operation before any duplicate write.', detail: 'The operation was acknowledged, but its current status cannot be established. Crosswork AI is reconciling that existing operation. Do not infer completion, retry the write, or claim an automatic cancellation or rollback.' });
    snapshot.decisions = [exception('execution-unknown', 'Execution status unknown', 'Crosswork AI is reconciling the existing operation; a duplicate write is blocked.', 'Inspect operation')];
    snapshot.criteria = unavailableCriteria(snapshot.criteria, 'The acknowledged operation’s actual status and post-action state must be reconciled before the outcome can be established.');
    snapshot.actions.push(action('status-unavailable', ROUTE, 'Operation status unavailable', OPERATION, '08:04:00 UTC', 'warning', 'status-warning', 'The controller status observation cannot establish the acknowledged operation’s current result. The issued record remains; no completion or second write is inferred.', `${OPERATION} status observation`, 'Network controller · status source', ROUTE_SCOPE));
  }

  if (variant === 'partial') {
    Object.assign(route, { status: 'Partial result reported', tone: 'warning', icon: 'status-warning', checkpoint: 'Reconciling the resulting configuration before recovery.', detail: 'The controller reports a partial result for the acknowledged operation. That report does not establish which configuration effects occurred. Crosswork AI must establish the actual resulting state before any supported recovery, with fresh authority where required.' });
    snapshot.actions = buildActions(5, version);
    snapshot.actions.push(action('partial-result', ROUTE, 'Partial operation result reported', OPERATION, '08:05:00 UTC', 'warning', 'status-warning', `The controller reports a partial result for proposal v${version}. Exact effects remain to be established by current observations. Do not interpret failure as no change, silently retry, or assume rollback is supported.`, `${OPERATION} partial-result record`, 'Network controller · execution result', ROUTE_SCOPE));
    snapshot.decisions = [exception('partial-result', 'Partial result needs reconciliation', 'Crosswork AI is establishing what changed before selecting a supported recovery.', 'Inspect outcome')];
    snapshot.criteria = unavailableCriteria(snapshot.criteria, 'The partial execution report does not establish the resulting configuration or satisfy this outcome criterion. Fresh reconciliation evidence is required.');
  }

  if (variant === 'capability') {
    Object.assign(route, { status: 'Verification unavailable', tone: 'warning', icon: 'status-warning', checkpoint: 'Required post-action routing observations cannot be collected.', detail: 'The verification capability is unreliable for this work. Operation completion remains recorded, but missing outcome evidence prevents verification. Crosswork AI retains follow-up ownership; no automatic failover or repair is assumed.', agent: 'Outcome verification', health: 'Verification capability unavailable', source: `${OPERATION} completion · affected routing-observation capability` });
    snapshot.decisions = [exception('verification-unavailable', 'Verification unavailable', 'The affected capability prevents ROUTE-104 from establishing its routing outcome.')];
    snapshot.criteria[1] = { ...snapshot.criteria[1], state: 'unavailable', detail: 'The affected verification capability cannot collect required current routing observations. The operation remains completed, but the outcome is unverified.', time: null };
    snapshot.criteria[2] = { ...snapshot.criteria[2], state: 'pending', detail: 'Scope verification remains outstanding; a configuration match alone does not prove the full reviewed outcome.' };
  }

  if (variant === 'offline') {
    snapshot.sourceState = 'interrupted';
    snapshot.proposal.reviewable = false;
    route.canReview = false;
    route.checkpoint = 'Last confirmed: operation completed; outcome verification outstanding.';
    route.detail = 'Live updates are interrupted. The displayed operation records are last confirmed at 08:05:20 UTC. Current execution, readiness, and decision validity cannot be inferred from this snapshot.';
    snapshot.decisions = [exception('data-interrupted', 'Live updates interrupted', 'Last confirmed 08:05:20 UTC. Current validity and outcome cannot be established.', 'Inspect visibility')];
    snapshot.criteria = snapshot.criteria.map(criterion => criterion.state === 'met' ? criterion : { ...criterion, state: 'unavailable', detail: 'The data connection is interrupted; this criterion has no confirmed current post-action result.', time: null });
    snapshot.summary = 'Last confirmed 08:05:20 UTC. Historical records remain available; live visibility is interrupted.';
  }

  return snapshot;
}
