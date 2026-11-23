/** Representative governance snapshots. Selecting one never executes a control. */
export const WORKFORCE_SCENES = [
  { id: 0, title: 'Work continues', shortTitle: 'Overview' },
  { id: 1, title: 'Collection capability degrades', shortTitle: 'Recovery' },
  { id: 2, title: 'A supervisory exception needs review', shortTitle: 'Escalation' },
  { id: 3, title: 'Authorization confirmed; prerequisites rechecking', shortTitle: 'Authorized' },
  { id: 4, title: 'Remediation execution acknowledged', shortTitle: 'Executing' },
  { id: 5, title: 'Execution completed; outcome verifying', shortTitle: 'Verifying' },
  { id: 6, title: 'One result verified; other work remains', shortTitle: 'Verified' },
];

const investigation = [
  ['Gathering', 'Collection is delayed', 'Crosswork AI is checking the required tool response.', 'Reachable', 'Collection delayed', 'Collect'],
  ['Recovering', 'Collection capability degraded', 'Bounded recovery and eligible alternatives are being checked.', 'Reachable', 'Degraded collection', 'Collect'],
  ['Constrained', 'Recovery paths exhausted', 'Unsupported collection is held; review the assignment restriction.', 'Reachable', 'Degraded collection', 'Collect'],
  ['Constrained', 'Collection remains unavailable', 'Crosswork AI retains the job and checks for restored capability.', 'Reachable', 'Degraded collection', 'Collect'],
  ['Constrained', 'Collection remains unavailable', 'Crosswork AI retains the job and checks for restored capability.', 'Reachable', 'Degraded collection', 'Collect'],
  ['Constrained', 'Collection remains unavailable', 'Crosswork AI retains the job and checks for restored capability.', 'Reachable', 'Degraded collection', 'Collect'],
  ['Constrained', 'Collection remains unavailable', 'Crosswork AI retains the job and checks for restored capability.', 'Reachable', 'Degraded collection', 'Collect'],
];
const remediation = [
  ['Awaiting approval', 'Ready for a bounded decision', 'No controller operation has been issued.', 1],
  ['Awaiting approval', 'Ready for a bounded decision', 'No controller operation has been issued.', 1],
  ['Awaiting approval', 'Ready for a bounded decision', 'No controller operation has been issued.', 1],
  ['Authorized', 'Prerequisites are rechecking', 'The grant is effective. No controller operation has been issued.', 2],
  ['Executing', 'RUN-021 has started', 'Crosswork AI is following the acknowledged controller operation.', 3],
  ['Verifying', 'Execution completed; effect unproven', 'J21’s own observations are being checked against its outcome criteria.', 4],
  ['Verified', 'Remediation outcome confirmed', 'J21’s criteria are met. Its authority, action, and proof are retained.', 5],
];
const posture = [
  ['Work is underway.', 'A remediation decision is waiting.', 'decision'],
  ['Recovery is underway.', 'A degraded capability is being handled; the approval is still waiting.', 'recovery'],
  ['Your decision is needed.', 'Collection recovery is exhausted. Other permitted work continues.', 'decision'],
  ['Authorization is confirmed.', 'Remediation prerequisites are being rechecked before execution.', 'progress'],
  ['Remediation is executing.', 'Crosswork AI is following RUN-021. Other jobs retain their constraints.', 'progress'],
  ['The result needs proof.', 'The operation completed; J21’s outcome is still being verified.', 'verification'],
  ['One result is verified.', 'The collection constraint and source-access wait remain open.', 'verified'],
];

const ACTIONS = {
  restriction: { id: 'restriction', job: 'J17', title: 'New assignments restricted', label: 'Effective control', icon: 'status-warning', tone: 'warning', actor: 'AI Admin decision · Crosswork AI enforcement', record: 'T1 eligibility record', detail: 'The confirmed control covers new production assignments to T1’s affected collection capability/version. J17 remains constrained and owned; the restriction does not repair, cancel, or roll back work.' },
  authorization: { id: 'authorization', job: 'J21', title: 'Bounded authorization recorded', label: 'AUTH-J21', icon: 'check-circle', tone: 'info', actor: 'Crosswork AI authorization record', record: 'AUTH-J21', detail: 'Decision submission and effective authorization are separate records. The effective grant covers only the unchanged reviewed proposal and its declared scope. At this checkpoint, execution prerequisites are rechecking and no controller operation has been issued.' },
  started: { id: 'started', job: 'J21', title: 'Remediation execution started', label: 'RUN-021', icon: 'status-in-progress', tone: 'info', actor: 'Remediation R1 · Controller acknowledgement', record: 'RUN-021 start record', detail: 'The controller operation has an acknowledged start after effective authorization and renewed prerequisite checks. Starting the operation does not establish a completed or verified result.' },
  completed: { id: 'completed', job: 'J21', title: 'Controller operation completed', label: 'Verification follows', icon: 'check-circle', tone: 'info', actor: 'Controller execution source', record: 'RUN-021 result record', detail: 'RUN-021 reports execution completion. The remediation remains Verifying until its own current observations establish the expected outcome.' },
  verified: { id: 'verified', job: 'J21', title: 'Remediation outcome verified', label: 'Proof retained', icon: 'status-positive', tone: 'positive', actor: 'Crosswork AI · J21 outcome evidence', record: 'J21 verified result', detail: 'J21’s own observations meet its defined criteria. Authorization, operation result, and verification evidence remain separately traceable. J17 and J23 retain their independent unresolved constraints.' },
};
const actionIds = [[], [], [], ['authorization', 'restriction'], ['started', 'restriction'], ['completed', 'restriction'], ['verified', 'completed', 'restriction']];
const actionFirstScene = { restriction: 3, authorization: 3, started: 4, completed: 5, verified: 6 };

export function getWorkforceSnapshot(value = 0) {
  const scene = Math.max(0, Math.min(6, Math.trunc(Number(value) || 0)));
  const t = investigation[scene], r = remediation[scene];
  const jobs = [
    { id: 'J17', title: 'Collect investigation evidence', agent: 'Network Troubleshooter', version: 'T1', icon: 'nav-investigate', status: t[0], headline: t[1], next: t[2], availability: t[3], health: t[4], healthTone: scene ? 'warning' : 'info', eligibility: scene >= 3 ? 'New assignments restricted' : scene === 2 ? 'Restriction requested' : null, tone: scene ? 'warning' : 'info', steps: ['Collect', 'Assess', 'Conclude'], step: 0, priority: scene >= 2 ? 'Recovery exhausted' : scene === 1 ? 'Reliability risk' : 'Collection dependency', kind: 'Read-only investigation', source: 'Required collection tool', detail: 'The required tool has not produced suitable new evidence. No production write is in progress for J17. A reachable agent can still have a degraded collection capability.' },
    { id: 'J21', title: 'Apply the corrective response', agent: 'Remediation', version: 'R1', icon: 'nav-workflows', status: r[0], headline: r[1], next: r[2], availability: 'Reachable', health: 'Healthy', healthTone: 'positive', eligibility: null, tone: scene < 3 ? 'warning' : scene === 6 ? 'positive' : 'info', steps: ['Plan', 'Authorize', 'Prechecks', 'Execute', 'Verify'], step: r[3], priority: scene < 3 ? 'Policy-required decision' : scene === 3 ? 'Pre-execution checks' : scene === 6 ? 'Verified result' : 'Active corrective work', kind: 'Remediation', source: scene < 4 ? 'PLAN-J21' : 'PLAN-J21 · RUN-021', detail: 'The applicable policy requires a bounded approval for the reviewed proposal. Submission, effective authorization, acknowledged execution, operation completion, and verified outcome are distinct records.' },
    { id: 'J23', title: 'Compare the configuration baseline', agent: 'Config Drift', version: 'D1', icon: 'nav-configuration', status: 'Waiting for access', headline: 'Baseline source is required', next: 'The assessment can continue after permitted source access is confirmed.', availability: 'Reachable', health: 'Healthy', healthTone: 'positive', eligibility: null, tone: 'inactive', steps: ['Source', 'Compare', 'Report'], step: 0, priority: 'Source prerequisite', kind: 'Baseline assessment', source: 'Baseline integration · Access prerequisite', detail: 'Baseline-source access for this assessment scope is not configured. D1 remains healthy. The authorized integration owner must establish access before Crosswork AI rechecks the prerequisite; another job’s outcome does not unblock this job.' },
  ];
  const decisions = [];
  if (scene === 2) decisions.push({ id: 'restriction', job: 'J17', title: 'Restrict new assignments', reason: 'Recovery is exhausted. Policy reserves T1’s eligibility decision for you.', action: 'Review exception' });
  if (scene < 3) decisions.push({ id: 'approval', job: 'J21', title: 'Review remediation approval', reason: 'The proposal exceeds the configured unattended-action set.', action: 'Review proposal' });
  return {
    scene, title: posture[scene][0], subtitle: posture[scene][1], phase: posture[scene][2], jobs, decisions,
    actions: actionIds[scene].map(id => ACTIONS[id]),
    knownActions: Object.values(ACTIONS).filter(action => actionFirstScene[action.id] <= scene),
    handling: scene === 1 ? 'Crosswork AI is checking the collection dependency and permitted recovery paths.' : scene === 2 ? 'Unsupported collection is already held while the eligibility decision is reviewed.' : scene >= 3 ? 'J17 remains owned and constrained. J23 still waits for its own source prerequisite.' : 'Crosswork AI is checking the delayed collection response.',
    trust: scene < 3 ? 'J21 remains behind its required approval boundary.' : scene === 3 ? 'Effective authority is recorded; execution has not started.' : scene === 4 ? 'RUN-021 is linked to its effective authorization.' : scene === 5 ? 'Execution is recorded. Verification is still outstanding.' : 'J21’s authority, execution, and outcome evidence are linked.',
  };
}
