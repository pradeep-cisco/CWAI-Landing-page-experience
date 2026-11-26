/** Incident presentation is independent of the Jobs overview; selection never changes job totals. */
import { filterJobs, jobCategory } from './agent-scale-model.js';
import { getTaskId } from './agent-job-tasks.js';
import { getIncidentThread } from './incident-thread-model.js';

const toneByState = { running: 'info', review: 'warning', waiting: 'warning', completed: 'positive', unknown: 'neutral', next: 'neutral' };
const stageIds = ['investigate', 'remediate', 'verify'];
const stageTitles = ['Investigate', 'Remediate', 'Verify'];
const stageFor = job => getTaskId(job) === 'verification' ? 'verify' : getTaskId(job) === 'remediation' ? 'remediate' : 'investigate';
const displayStateLabels = { 'Needs your review': 'Needs review', 'Monitoring incident': 'Monitoring', 'Verifying recovery': 'Verifying', 'Confirming approval': 'Confirming approval', 'Checking prerequisites': 'Checking prerequisites' };

function displayContext(thread, jobs, model) {
  const groups = [...new Set(jobs.map(job => job.domainName || model.network?.domains?.find(group => group.id === job.domainId)?.name).filter(Boolean))];
  return {
    displayTitle: thread.title === 'Correlated interface and BGP events' ? 'Interface and BGP events' : thread.title,
    displayScope: thread.id === 'INC-317' ? 'West–Core' : groups.length ? groups.join(' · ') : thread.scope?.split(' · ')[0] || '',
  };
}

function filtersAreValid(model, { domainId, agentId }) {
  return (domainId === 'all' || model.network?.domains?.some(group => group.id === domainId)) &&
    (agentId === 'all' || Boolean(model.agents?.[agentId]));
}

function hasOperationCompletion(job, model) {
  return (job.operation?.state === 'completed' && job.operation.id && job.operation.source && job.operation.current !== false) || (model.actions || []).some(record =>
    (record.jobId || record.job) === job.id && record.operationId && (record.source || record.record) && record.current !== false &&
    (record.id === 'operation-completed' || record.state === 'completed' || record.operationState === 'completed'));
}

function progressStage(id, jobs, model, current) {
  const title = stageTitles[stageIds.indexOf(id)];
  const base = { id, title, jobIds: jobs.map(job => job.id) };
  if (!jobs.length) return { ...base, state: 'next', label: 'Not started' };
  if (!current) return { ...base, state: 'unknown', label: 'Last known' };
  if (jobs.some(job => jobCategory(job) === 'review')) return { ...base, state: 'review', label: 'Review' };
  if (jobs.some(job => /decision submitted/i.test(job.status))) return { ...base, state: 'waiting', label: 'Confirming approval' };
  if (jobs.some(job => /held/i.test(job.status))) return { ...base, state: 'waiting', label: 'Held' };
  if (jobs.some(job => jobCategory(job) === 'waiting')) return { ...base, state: 'waiting', label: 'Waiting' };
  if (jobs.every(job => jobCategory(job) === 'completed')) {
    if (id === 'remediate' && !jobs.every(job => hasOperationCompletion(job, model))) return { ...base, state: 'waiting', label: 'Execution unconfirmed' };
    return { ...base, state: 'completed', label: 'Complete' };
  }
  return { ...base, state: 'running', label: id === 'remediate' && jobs.some(job => /checking/i.test(job.status)) ? 'Checking' : 'Running' };
}

function verifiedMetric(jobs, scopedIds, current) {
  const job = jobs.find(item => item.status === 'Verified' && scopedIds.has(item.id) &&
    item.resultMetrics?.source && Number.isFinite(item.resultMetrics.before) && Number.isFinite(item.resultMetrics.after));
  return job ? { ...job.resultMetrics, jobId: job.id, current: current && job.resultMetrics.current !== false } : null;
}

function criterionMet(metric) {
  if (!metric || metric.current === false || !Number.isFinite(metric.criterion)) return false;
  if (metric.comparison === 'at-or-below') return metric.after <= metric.criterion;
  if (metric.comparison === 'at-or-above') return metric.after >= metric.criterion;
  return false;
}

const plainText = value => typeof value === 'string' ? value.trim() : '';

/** A landing finding is an observed member record, never an inferred cause. */
function observedFinding(scopedJobs, metric, current) {
  if (metric && plainText(metric.source)) {
    return {
      text: `${metric.label || 'Measured result'}: ${metric.before}${metric.unit || '%'} → ${metric.after}${metric.unit || '%'}`,
      source: metric.source, jobId: metric.jobId, current: current && metric.current !== false, kind: 'verification',
    };
  }
  const job = scopedJobs.find(item => stageFor(item) === 'investigate' && plainText(item.source) &&
    (plainText(item.landingFinding) || plainText(item.finding)));
  return job ? {
    text: plainText(job.landingFinding) || plainText(job.finding), source: job.source,
    jobId: job.id, current: current && job.current !== false, kind: 'observation',
  } : null;
}

/** A declared incident and at least one explicit in-scope member are required. */
export function getIncidentDetail(model, incidentId, { domainId = 'all', agentId = 'all' } = {}) {
  if (!model || !filtersAreValid(model, { domainId, agentId })) return null;
  const incident = model.incidents?.find(item => item.id === incidentId);
  const thread = incident && getIncidentThread(model, incidentId);
  if (!thread?.jobs?.length) return null;
  const jobs = thread.jobs;
  const scopedJobs = filterJobs(jobs, { domainId, agentId });
  if (!scopedJobs.length) return null;
  const scopedIds = new Set(scopedJobs.map(job => job.id));
  const current = model.sourceState === 'current' && incident.current !== false && jobs.every(job => job.current !== false);
  const progress = stageIds.map(id => progressStage(id, jobs.filter(job => stageFor(job) === id), model, current));
  const [investigate, remediate, verify] = progress;
  const reviewJobs = jobs.filter(job => jobCategory(job) === 'review');
  const reviewJob = current && model.permissions?.reviewChange ? scopedJobs.find(job =>
    jobCategory(job) === 'review' && job.canReview && job.proposal?.available && job.proposal.reviewable !== false) || null : null;
  const metric = verifiedMetric(jobs, scopedIds, current);
  const finding = observedFinding(scopedJobs, metric, current);
  const change = jobs.find(job => stageFor(job) === 'remediate');
  const waiting = jobs.find(job => jobCategory(job) === 'waiting');
  const checking = change && /checking/i.test(change.status);
  const submitted = change && /decision submitted/i.test(change.status);
  const held = change && /held/i.test(change.status);
  // Completed jobs alone do not resolve an incident. Resolution needs its own record.
  const resolved = Boolean(incident.resolution) && /resolved|closed/i.test(incident.state || '');
  let state = 'running', stateLabel = 'Investigating';
  let outcome = { title: incidentId === 'INC-317' ? 'Checking alternate-path capacity' : 'Assessing the incident', state: 'running', detail: '' };
  let now = incidentId === 'INC-317' ? 'Agents are checking headroom and Core ingress.' : 'The agent is checking the incident evidence.';
  let actionNote = 'No action needed';

  if (!current) {
    state = 'unknown'; stateLabel = 'Updates interrupted';
    outcome = { title: 'Current state unavailable', state: 'unknown', detail: 'Showing last-confirmed records.' };
    now = 'Fresh data is required before another decision.';
    actionNote = 'Decisions unavailable';
  } else if (resolved) {
    state = 'completed'; stateLabel = 'Resolved';
    outcome = { title: 'Resolution recorded', state: 'completed', detail: typeof incident.resolution === 'string' ? incident.resolution : incident.resolution.summary || '' };
    now = 'Resolution and supporting evidence are recorded.';
  } else if (reviewJobs.length) {
    state = 'review'; stateLabel = reviewJob ? 'Needs your review' : 'Awaiting review';
    outcome = { title: incidentId === 'INC-317' ? 'Path adjustment ready' : 'Change ready for review', state: 'review', detail: '' };
    now = reviewJob ? 'Review the scope, impact and rollback.' : 'The change is waiting for an eligible reviewer.';
    actionNote = scopedJobs.some(job => reviewJobs.includes(job)) ? 'Delegated review required' : 'Review is outside this view';
  } else if (submitted) {
    state = 'waiting'; stateLabel = 'Confirming approval';
    outcome = { title: 'Decision submitted', state: 'waiting', detail: 'Waiting for authority confirmation.' };
    now = 'The agent is waiting for approval confirmation.';
  } else if (held) {
    state = 'waiting'; stateLabel = 'Change held';
    outcome = { title: 'Change on hold', state: 'waiting', detail: 'Not issued.' };
    now = 'The agent is keeping this change unissued.';
  } else if (checking) {
    stateLabel = 'Checking prerequisites';
    outcome = { title: 'Checking execution prerequisites', state: 'running', detail: 'Execution remains unconfirmed.' };
    now = 'Agents are rechecking the approved scope and prerequisites.';
  } else if (waiting) {
    state = 'waiting'; stateLabel = /telemetry|source/i.test(`${waiting.status} ${waiting.checkpoint}`) ? 'Waiting for data' : 'Waiting';
    outcome = { title: stateLabel === 'Waiting for data' ? 'Fresh data needed' : 'Prerequisite pending', state: 'waiting', detail: '' };
    now = stateLabel === 'Waiting for data' ? 'The agent is waiting for current data.' : 'The agent is waiting for the recorded prerequisite.';
  } else if (verify.jobIds.length) {
    stateLabel = 'Verifying recovery';
    outcome = criterionMet(metric)
      ? { title: metric.label === 'Affected-link utilization' ? 'Link utilization within limits' : 'Recovery criterion met', state: 'completed', detail: 'Other recovery checks remain open.' }
      : { title: 'Checking recovery', state: 'running', detail: '' };
    const unfinished = jobs.find(job => stageFor(job) === 'verify' && jobCategory(job) !== 'completed');
    now = unfinished ? incidentId === 'INC-317'
      ? 'Agents are checking routing stability and change limits.'
      : 'The agent is completing the remaining recovery checks.'
      : 'Checks are complete; incident closure is pending.';
    if (verify.state === 'completed') { state = 'waiting'; stateLabel = 'Awaiting closure'; }
  } else if (remediate.jobIds.length) {
    if (remediate.state === 'completed') {
      stateLabel = 'Awaiting verification';
      outcome = { title: 'Controller operation complete', state: 'completed', detail: 'Recovery is not yet verified.' };
      now = 'The agent is waiting for post-change observations.';
    } else if (remediate.label === 'Execution unconfirmed') {
      state = 'waiting'; stateLabel = 'Execution unconfirmed';
      outcome = { title: 'Controller result unconfirmed', state: 'waiting', detail: '' };
      now = 'The agent needs a controller completion record.';
    } else {
      stateLabel = 'Remediating';
      outcome = { title: 'Response in progress', state: 'running', detail: '' };
      now = 'The agent is working on the recorded response.';
    }
  } else if (investigate.state === 'completed') {
    state = 'waiting'; stateLabel = 'Awaiting next step';
    outcome = { title: 'Assessment complete', state: 'completed', detail: 'Incident closure is pending.' };
    now = 'The agent is determining the next step.';
  } else if (jobs.every(job => getTaskId(job) === 'event-correlation')) {
    stateLabel = 'Monitoring incident';
    outcome = { title: 'Incident criteria met', state: 'running', detail: 'Cause not yet established.' };
    now = 'The agent is monitoring the correlated events.';
  }

  return {
    ...thread, ...displayContext(thread, jobs, model), current, state, stateLabel,
    displayStateLabel: displayStateLabels[stateLabel] || stateLabel, tone: toneByState[state], outcome, progress, now,
    metric, finding, reviewJob, jobs, scopedJobIds: [...scopedIds], jobCount: jobs.length,
    inScopeJobCount: scopedJobs.length, actionRequired: Boolean(reviewJob), actionNote,
    observedAt: model.observedAt || model.lastConfirmedAt || thread.observedAt || null,
  };
}

/** Stable relevance order supports pagination without changing jobs or creating associations. */
export function getIncidentOverview(model, filters = {}) {
  const seen = new Set();
  const priority = { review: 0, waiting: 1, running: 2, unknown: 3, completed: 4 };
  return (model?.incidents || []).flatMap((incident, index) => {
    if (seen.has(incident.id)) return [];
    seen.add(incident.id);
    const detail = getIncidentDetail(model, incident.id, filters);
    if (!detail) return [];
    return [{ id: detail.id, title: detail.title, scope: detail.scope, displayTitle: detail.displayTitle, displayScope: detail.displayScope,
      state: detail.state, stateLabel: detail.stateLabel, displayStateLabel: detail.displayStateLabel,
      tone: detail.tone, jobCount: detail.jobCount, inScopeJobCount: detail.inScopeJobCount, current: detail.current,
      finding: detail.finding, featured: detail.id === model.featuredIncidentId,
      actionRequired: detail.actionRequired, index }];
  }).sort((a, b) => priority[a.state] - priority[b.state] || Number(b.id === model.featuredIncidentId) - Number(a.id === model.featuredIncidentId) || a.index - b.index)
    .map(({ index, ...incident }) => incident);
}
