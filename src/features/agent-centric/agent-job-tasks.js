/** A job has one primary task. Status and shared prerequisites do not change that task. */
export const JOB_TASKS = Object.freeze([
  { id: 'investigations', title: 'Investigations', summary: 'Investigating network symptoms using scoped evidence.' },
  { id: 'configuration-checks', title: 'Configuration checks', summary: 'Comparing observed configuration with learned patterns and authorized changes.' },
  { id: 'event-correlation', title: 'Event correlation', summary: 'Comparing related events against incident-classification criteria.' },
  { id: 'risk-assessments', title: 'Risk assessments', summary: 'Assessing recurring event patterns and advisory applicability.' },
  { id: 'capacity-checks', title: 'Capacity checks', summary: 'Checking observed utilization and remaining headroom.' },
  { id: 'service-checks', title: 'Service checks', summary: 'Comparing service observations with recorded criteria.' },
  { id: 'remediation', title: 'Remediation', summary: 'Preparing and carrying out bounded corrections under the required authority.' },
  { id: 'verification', title: 'Verification', summary: 'Checking completed changes against recorded verification criteria.' },
].map(task => Object.freeze(task)));

const taskIds = new Set(JOB_TASKS.map(task => task.id));
export const TASK_BY_CAPABILITY = Object.freeze({
  investigate: 'investigations', assess: 'configuration-checks', correlate: 'event-correlation',
  toxic: 'risk-assessments', vulnerabilities: 'risk-assessments', capacity: 'capacity-checks',
  services: 'service-checks', verify: 'verification',
});
const legacyTasks = Object.freeze({
  'event-archive': 'investigations', 'reachability-checks': 'investigations', 'routing-checks': 'investigations',
  'incident-correlation': 'event-correlation', 'toxic-factors': 'risk-assessments',
  'vulnerability-checks': 'risk-assessments', 'capacity-analysis': 'capacity-checks',
  'service-assurance': 'service-checks', 'outcome-checks': 'verification',
});
const tasksByAgent = Object.freeze({
  troubleshooter: 'investigations', cdd: 'configuration-checks', correlation: 'event-correlation',
  toxic: 'risk-assessments', vulnerability: 'risk-assessments', capacity: 'capacity-checks',
  assurance: 'service-checks', remediation: 'remediation',
});

export function getTaskId(job = {}) {
  if (taskIds.has(job.taskId)) return job.taskId;
  // The original correction retains its task as its assessment, review and execution evolve.
  if (job.id === 'ROUTE-104' || ['routing-correction', 'change-reviews'].includes(job.groupId)) return 'remediation';
  if (job.id === 'REACH-319') return 'investigations';
  if (job.id === 'CHECK-208') return 'configuration-checks';
  if (job.capabilityId === 'verify' || job.groupId === 'outcome-checks') return 'verification';
  if (job.agentId === 'remediation') return 'remediation';
  if (taskIds.has(job.groupId)) return job.groupId;
  return TASK_BY_CAPABILITY[job.capabilityId] || legacyTasks[job.groupId] || tasksByAgent[job.agentId] || 'investigations';
}
