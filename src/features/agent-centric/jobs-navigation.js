import { NETWORK_DOMAINS, filterJobs } from './agent-scale-model.js';
import { NETWORK_AGENTS } from './network-agents.js';
import { WORK_GROUP_IDS, resolveWorkGroup } from './agent-job-groups.js';

export const PAGE_SIZE = 12;
export const UNAVAILABLE_FILTER = 'unavailable';
const statuses = new Set(['all', 'running', 'waiting', 'review', 'completed']);
const domains = new Set(['all', ...NETWORK_DOMAINS.map(domain => domain.id)]);
const agents = new Set(['all', ...Object.keys(NETWORK_AGENTS)]);
const groups = new Set(['all', ...WORK_GROUP_IDS]);
const experienceStates = new Set(['monitoring', 'review', 'verification']);
const choice = (value, allowed) => value === undefined || value === null || value === '' ? 'all' : allowed.has(String(value)) ? String(value) : UNAVAILABLE_FILTER;
const text = (value, max) => String(value ?? '').slice(0, max);

/** Unknown filters remain unavailable; a bad URL never broadens the network scope. */
export function normalizeJobsQuery(input = {}) {
  const requestedPage = Number(input.page);
  const job = text(input.jobId, 80);
  return {
    ...(experienceStates.has(input.experienceState) ? { experienceState: input.experienceState } : {}),
    domainId: choice(input.domainId, domains),
    agentId: choice(input.agentId, agents),
    status: choice(input.status, statuses),
    groupId: choice(input.groupId, groups),
    query: text(input.query, 200),
    page: Number.isFinite(requestedPage) ? Math.min(100000, Math.max(0, Math.floor(requestedPage))) : 0,
    jobId: !job || /^[a-zA-Z0-9_-]+$/.test(job) ? job : 'unavailable-job',
  };
}

export function parseJobsQuery(search = '') {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search).replace(/^\?/, ''));
  return normalizeJobsQuery({
    domainId: params.get('domain'), agentId: params.get('agent'), status: params.get('status'),
    groupId: params.get('group'), query: params.get('q'), page: Number(params.get('page') || 1) - 1,
    jobId: params.get('job'),
    experienceState: params.get('experience'),
  });
}

function scopeParams(query) {
  const params = new URLSearchParams({ exploration: 'agent-centric' });
  if (query.domainId !== 'all') params.set('domain', query.domainId);
  if (query.agentId !== 'all') params.set('agent', query.agentId);
  if (query.experienceState) params.set('experience', query.experienceState);
  return params;
}

export function buildJobsPath(input = {}) {
  const query = normalizeJobsQuery(input), params = scopeParams(query);
  if (query.status !== 'all') params.set('status', query.status);
  if (query.groupId !== 'all') params.set('group', query.groupId);
  if (query.query) params.set('q', query.query);
  if (query.page) params.set('page', String(query.page + 1));
  if (query.jobId) params.set('job', query.jobId);
  return `/network-monitoring/jobs?${params.toString()}`;
}

export function buildAgentHomePath(input = {}) {
  return `/network-monitoring?${scopeParams(normalizeJobsQuery(input)).toString()}`;
}

/** Task or saved-group membership comes from known work, then intersects every filter. */
export function selectManagerJobs(model, input = {}) {
  const query = normalizeJobsQuery(input);
  let jobs = filterJobs(model.jobs || [], { domainId: query.domainId, agentId: query.agentId });
  if (query.groupId !== 'all') {
    const group = resolveWorkGroup(model.jobs || [], model.issues || [], query.groupId);
    if (!group) return [];
    const members = new Set(group.jobIds || group.jobs.map(job => job.id));
    jobs = jobs.filter(job => members.has(job.id));
  }
  return filterJobs(jobs, { status: query.status, query: query.query });
}

export function getJobsPage(jobs = [], input = {}) {
  const query = normalizeJobsQuery(input);
  const pageCount = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const page = Math.min(query.page, pageCount - 1), start = page * PAGE_SIZE;
  const records = jobs.slice(start, start + PAGE_SIZE);
  return { jobs: records, total: jobs.length, page, pageCount, start: records.length ? start + 1 : 0, end: start + records.length };
}
