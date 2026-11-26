import { groupJobs, summarizeJobs } from './agent-scale-model.js';
import { JOB_TASKS, getTaskId } from './agent-job-tasks.js';

const LEGACY_GROUP_IDS = ['routing-correction', 'event-archive', 'network-checks', 'incident-correlation', 'toxic-factors', 'vulnerability-checks', 'capacity-analysis', 'service-assurance', 'reachability-checks', 'outcome-checks', 'routing-checks', 'change-reviews'];
/** Saved links remain accepted; only the canonical task categories appear on Home. */
export const WORK_GROUP_IDS = Object.freeze([...JOB_TASKS.map(task => task.id), ...LEGACY_GROUP_IDS]);

function taskGroup(definition, jobs) {
  const counts = summarizeJobs(jobs);
  const domainIds = [...new Set(jobs.map(job => job.domainId).filter(Boolean))];
  const ownerIds = [...new Set(jobs.map(job => job.agentId).filter(Boolean))];
  const representative = jobs.find(job => job.canReview) || jobs.find(job => job.finding) || jobs[0];
  return {
    ...definition, basis: 'task', jobs, jobIds: jobs.map(job => job.id), count: jobs.length, counts,
    domainIds, issueIds: [...new Set(jobs.map(job => job.issueId).filter(Boolean))],
    scope: `${domainIds.length} ${domainIds.length === 1 ? 'device group' : 'device groups'}`,
    agentId: ownerIds.length === 1 ? ownerIds[0] : null,
    tone: counts.review ? 'warning' : counts.running ? 'info' : counts.waiting ? 'inactive' : 'positive',
    status: counts.review ? 'Review required' : counts.running ? 'In progress' : counts.waiting ? 'Waiting' : 'Complete',
    priority: Math.min(...jobs.map(job => job.priority ?? 2)),
    latestFinding: { jobId: representative.id, scope: representative.scope, agentId: representative.agentId, text: representative.finding || representative.checkpoint },
  };
}

/** Partition the scoped jobs once; every non-empty task remains visible in every lifecycle state. */
export function getWorkGroups(jobs = [], issues = []) {
  const members = new Map(JOB_TASKS.map(task => [task.id, []]));
  for (const job of jobs) members.get(getTaskId(job)).push(job);
  const allGroups = JOB_TASKS.flatMap(task => members.get(task.id).length ? [taskGroup(task, members.get(task.id))] : []);
  return { rawGroups: groupJobs(jobs, issues), collections: [], allGroups, orderedGroups: allGroups, visibleGroups: allGroups };
}

/** Preserve the exact membership of old issue/dependency links without adding duplicate task cards. */
export function resolveWorkGroup(jobs = [], issues = [], id) {
  const groups = getWorkGroups(jobs, issues);
  const task = groups.allGroups.find(group => group.id === id);
  if (task) return task;
  if (id === 'network-checks') {
    const members = jobs.filter(job => ['incident-correlation', 'configuration-checks', 'service-assurance'].includes(job.groupId));
    return members.length ? taskGroup({ id, title: 'Network checks', summary: 'Saved configuration, correlation and service checks.' }, members) : null;
  }
  return groups.rawGroups.find(group => group.id === id) || null;
}
