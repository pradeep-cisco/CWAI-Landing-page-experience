import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, summarizeJobs, jobCategory } from '../src/features/agent-centric/agent-scale-model.js';
import { JOB_TASKS, getTaskId } from '../src/features/agent-centric/agent-job-tasks.js';
import { EXPERIENCE_STATES, buildIncidentSnapshot, getIncidentJobs, getIncidentThread } from '../src/features/agent-centric/incident-thread-model.js';

const source = (variant = 'main') => buildScaleSnapshot(getAgentCentricSnapshot(2, variant));
const snapshot = (state = 'review', variant = 'main') => buildIncidentSnapshot(source(variant), state);
const members = ['C-21', 'C-22', 'C-23', 'R-41', 'V-51', 'V-52'];
const replaced = new Set(['ROUTE-104', 'JOB-1029', 'JOB-1037', 'JOB-1045']);

test('the three presentation states count only their actual incident jobs', () => {
  assert.deepEqual(EXPERIENCE_STATES.map(state => state.id), ['monitoring', 'review', 'verification']);
  for (const [state, count] of [['monitoring', 3], ['review', 4], ['verification', 6]]) {
    const model = snapshot(state), thread = getIncidentThread(model);
    assert.equal(model.featuredIncidentId, 'INC-317');
    assert.deepEqual(getIncidentJobs(model).map(job => job.id), members.slice(0, count));
    assert.deepEqual(thread.jobIds, members.slice(0, count));
    assert.equal(thread.state, state);
    assert.ok(thread.headline.split(/\s+/).length <= 3);
    assert.equal(thread.title, 'Capacity pressure');
    assert.equal(thread.scope, 'West–Core');
    assert.equal(thread.stages.flatMap(stage => stage.jobIds).length, count);
    assert.deepEqual(thread.stages.flatMap(stage => stage.jobIds), members.slice(0, count));
    assert.equal(model.jobs.some(job => replaced.has(job.id)), false);
    assert.equal(new Set(model.jobs.map(job => job.id)).size, model.jobs.length);
  }
});

test('task and global counts preserve the complete fleet across incident progression', () => {
  const expected = {
    monitoring: { total: 167, running: 121, waiting: 24, review: 0, completed: 22 },
    review: { total: 168, running: 119, waiting: 24, review: 1, completed: 24 },
    verification: { total: 170, running: 120, waiting: 24, review: 0, completed: 26 },
  };
  for (const state of EXPERIENCE_STATES.map(item => item.id)) {
    const model = snapshot(state);
    assert.deepEqual(summarizeJobs(model.jobs), expected[state]);
    assert.deepEqual(Object.fromEntries(Object.keys(expected[state]).map(key => [key, model.scaleSummary[key]])), expected[state]);
    const capacity = summarizeJobs(model.jobs.filter(job => getTaskId(job) === 'capacity-checks'));
    assert.deepEqual(capacity, { total: 13, running: state === 'monitoring' ? 10 : 8, waiting: 0, review: 0, completed: state === 'monitoring' ? 3 : 5 });
    assert.deepEqual(summarizeJobs(model.jobs.filter(job => getTaskId(job) === 'remediation')), { total: state === 'monitoring' ? 5 : 6, running: 5, waiting: 0, review: state === 'review' ? 1 : 0, completed: state === 'verification' ? 1 : 0 });
    assert.deepEqual(summarizeJobs(model.jobs.filter(job => getTaskId(job) === 'verification')), { total: state === 'verification' ? 15 : 13, running: state === 'verification' ? 12 : 11, waiting: 0, review: 0, completed: state === 'verification' ? 3 : 2 });
    const categories = new Map(JOB_TASKS.map(task => [task.id, model.jobs.filter(job => getTaskId(job) === task.id)]));
    assert.equal(categories.size, 8);
    assert.ok([...categories.values()].every(jobs => jobs.length));
    assert.equal([...categories.values()].flat().length, model.jobs.length);
  }
});

test('background jobs remain independent and supplemental approvals are explicit earlier records', () => {
  const before = source(), model = buildIncidentSnapshot(before, 'review');
  for (const original of before.jobs.filter(job => !replaced.has(job.id))) {
    const after = model.jobs.find(job => job.id === original.id);
    assert.ok(after, original.id);
    if (!original.id.startsWith('REVIEW-')) { assert.deepEqual(after, original); continue; }
    assert.equal(after.status, 'Checking');
    assert.equal(after.canReview, false);
    assert.equal(after.proposal.reviewable, false);
    assert.equal(after.approval.state, 'effective');
    assert.ok(model.actions.some(record => record.id === after.approval.id && /recorded earlier approval/.test(record.actor)));
    assert.match(after.detail, /approved before the featured incident snapshot/);
    assert.equal(after.operation, undefined);
  }
  assert.deepEqual(model.decisions.map(decision => decision.jobId), ['R-41']);
});

test('capacity-to-change-to-verification edges join explicit jobs in their actual scope', () => {
  const model = snapshot('verification'), jobs = getIncidentJobs(model);
  const byId = new Map(jobs.map(job => [job.id, job]));
  assert.equal(byId.get('C-21').deviceId, 'XR-WEST-0129');
  assert.equal(byId.get('C-22').domainId, 'west');
  assert.equal(byId.get('C-23').domainId, 'core');
  assert.deepEqual(byId.get('R-41').inputJobIds, ['C-21', 'C-22', 'C-23']);
  assert.deepEqual(byId.get('V-51').inputJobIds, ['R-41']);
  assert.deepEqual(byId.get('V-52').inputJobIds, ['R-41', 'V-51']);
  for (const job of jobs) {
    assert.equal(job.incidentId, 'INC-317');
    assert.equal(job.issueId, 'ISSUE-INC-317');
    assert.ok(job.landingFinding.split(/\s+/).length <= 12, job.id);
    assert.ok(job.landingScope && job.source);
    for (const input of job.inputJobIds) assert.ok(byId.has(input), `${job.id} missing input ${input}`);
  }
  assert.equal(byId.get('V-51').changeJobId, 'R-41');
  assert.equal(byId.get('V-52').changeJobId, 'R-41');
  assert.ok(byId.get('V-52').deviceIds.includes('XR-CORE-0201'));
});

test('review is one versioned bounded change and no operation exists before its completion snapshot', () => {
  const review = snapshot('review'), job = review.jobs.find(item => item.id === 'R-41');
  assert.equal(job.canReview, true);
  assert.equal(job.proposal.version, 1);
  assert.deepEqual(job.proposal.targets, ['XR-WEST-0129']);
  for (const key of ['id', 'scope', 'authority', 'intent', 'changeFrom', 'changeTo', 'boundary', 'validity', 'holdConsequence']) assert.ok(job.proposal[key], key);
  assert.ok(job.proposal.validation.length && job.proposal.verification.length);
  assert.match(job.proposal.boundary, /No interface, Core-router or unrelated policy changes/);
  assert.equal(job.operation, undefined);
  assert.equal(review.actions.some(record => record.operationId === 'OP-317'), false);
  const verifying = snapshot('verification'), changed = verifying.jobs.find(item => item.id === 'R-41');
  assert.equal(changed.status, 'Complete');
  assert.equal(changed.canReview, false);
  assert.equal(changed.operation.id, 'OP-317');
  assert.equal(changed.operation.state, 'completed');
  assert.deepEqual(changed.operation.targets, ['XR-WEST-0129']);
  assert.ok(verifying.actions.some(record => record.id === 'operation-completed' && record.job === 'R-41' && record.operationId === 'OP-317'));
  assert.deepEqual(verifying.decisions, []);
});

test('utilization proof belongs only to the completed V-51 criterion and does not close V-52', () => {
  const model = snapshot('verification'), jobs = getIncidentJobs(model);
  const v51 = jobs.find(job => job.id === 'V-51'), v52 = jobs.find(job => job.id === 'V-52');
  assert.equal(v51.status, 'Verified');
  assert.equal(v51.resultMetrics.before, 92);
  assert.equal(v51.resultMetrics.after, 68);
  assert.equal(v51.resultMetrics.criterion, 75);
  assert.ok(v51.resultMetrics.source);
  assert.match(v51.resultMetrics.beforeWindow, /08:00–08:05/);
  assert.match(v51.resultMetrics.afterWindow, /08:15–08:20/);
  assert.equal(jobs.filter(job => job.resultMetrics).length, 1);
  assert.equal(v52.status, 'Verifying');
  assert.equal(v52.resultMetrics, undefined);
  assert.equal(model.incidents.find(incident => incident.id === 'INC-317').state, 'active');
  assert.equal(model.incidents.find(incident => incident.id === 'INC-317').resolution, null);
  assert.ok(model.criteria.some(criterion => criterion.state !== 'met'));
  delete v51.resultMetrics;
  assert.doesNotMatch(getIncidentThread(model).headline, /Utilization reduced/);
});

test('the thread follows current decision state rather than continuing to demand review', () => {
  for (const [status, expected, summary] of [['Decision submitted', /Decision submitted/, 'Authority confirmation is pending.'], ['Checking', /Checking prerequisites/, 'Execution has not been established.'], ['Held', /held/, 'This change remains unissued.']]) {
    const model = snapshot('review'), job = model.jobs.find(item => item.id === 'R-41');
    Object.assign(job, { status, canReview: false, checkpoint: `${status}: current job record` });
    model.decisions = [];
    const thread = getIncidentThread(model);
    assert.match(thread.headline, expected);
    assert.doesNotMatch(thread.headline, /needs your review/);
    assert.equal(thread.summary, summary);
    assert.equal(thread.jobs.find(item => item.id === 'R-41').status, status);
  }
});

test('no-authority and interrupted snapshots never enable the incident change', () => {
  for (const variant of ['no-authority', 'offline']) {
    const model = snapshot('review', variant), job = model.jobs.find(item => item.id === 'R-41');
    assert.equal(job.canReview, false);
    assert.equal(job.proposal.reviewable, false);
    assert.deepEqual(model.decisions, []);
    assert.equal(model.assignedDecisions[0].jobId, 'R-41');
    assert.doesNotMatch(getIncidentThread(model).headline, /needs your review/);
    assert.equal(model.permissions.reviewChange, false);
  }
  const interrupted = snapshot('verification', 'offline');
  assert.equal(interrupted.stateCurrent, false);
  assert.equal(getIncidentThread(interrupted).stateCurrent, false);
  assert.equal(getIncidentThread(interrupted).headline, 'Updates interrupted');
  assert.match(getIncidentThread(interrupted).summary, /^Last confirmed:/);
  assert.equal(interrupted.jobs.find(job => job.id === 'V-51').resultMetrics.current, false);
  assert.equal(interrupted.incidents.find(incident => incident.id === 'INC-317').current, false);
});

test('verification snapshot and confirmation records follow the complete measurement window', () => {
  const model = snapshot('verification');
  assert.equal(model.observedAt, '08:25:00 UTC');
  assert.equal(model.lastConfirmedAt, model.observedAt);
  assert.equal(model.actions.find(record => record.id === 'plan-authorized').time, '08:12:00 UTC');
  assert.equal(model.actions.find(record => record.id === 'operation-completed').time, '08:14:00 UTC');
  assert.equal(model.actions.find(record => record.id === 'V-51-result').time, '08:20:00 UTC');
  assert.equal(model.jobs.find(job => job.id === 'V-51').resultMetrics.afterWindow, '08:15–08:20 UTC');
});

test('recomputed references never point to removed jobs or planned future steps', () => {
  for (const state of EXPERIENCE_STATES.map(item => item.id)) {
    const model = snapshot(state), ids = new Set(model.jobs.map(job => job.id));
    for (const issue of model.issues) {
      assert.ok(ids.has(issue.jobId));
      assert.ok(issue.jobIds.every(id => ids.has(id)));
    }
    for (const incident of model.incidents) assert.ok(incident.jobIds.every(id => ids.has(id)));
    for (const decision of [...model.decisions, ...model.assignedDecisions]) assert.ok(ids.has(decision.jobId || decision.job));
    for (const action of model.actions) assert.ok(ids.has(action.jobId || action.job));
    for (const dependency of model.dependencies) assert.ok(dependency.jobIds.every(id => ids.has(id)));
    assert.deepEqual(model.history.map(job => job.id).sort(), model.jobs.filter(job => jobCategory(job) === 'completed').map(job => job.id).sort());
  }
});

test('generic correlated incidents retain only explicit recorded membership', () => {
  const model = snapshot();
  const original = model.incidents.find(incident => incident.id.startsWith('INC-CORR-'));
  const thread = getIncidentThread(model, original.id);
  assert.ok(thread);
  assert.deepEqual(thread.jobIds, original.jobIds);
  const member = thread.jobs[0];
  model.jobs.push({ ...member, id: 'UNRELATED-SAME-TARGET', incidentId: null });
  assert.deepEqual(getIncidentJobs(model, original.id).map(job => job.id), original.jobIds);
  assert.equal(getIncidentThread(model, 'INC-MISSING'), null);
  assert.ok(thread.stages.every(stage => stage.jobIds.every(id => original.jobIds.includes(id))));
});

test('quiet keeps the original assessed three jobs and injects no fictional incident', () => {
  const quietSource = source('quiet');
  for (const state of EXPERIENCE_STATES.map(item => item.id)) {
    const model = buildIncidentSnapshot(quietSource, state);
    assert.equal(model.featuredIncidentId, null);
    assert.equal(model.jobs.length, 3);
    assert.deepEqual(model.jobs, quietSource.jobs);
    assert.deepEqual(model.actions, quietSource.actions);
    assert.deepEqual(model.incidents, quietSource.incidents);
    assert.equal(getIncidentThread(model), null);
    assert.deepEqual(getIncidentJobs(model), []);
    assert.match(model.summary, /do not establish health across the network/);
  }
});

test('transformation does not mutate its source and repeated state changes do not erase more fleet jobs', () => {
  const original = source(), json = JSON.stringify(original);
  const review = buildIncidentSnapshot(original, 'review');
  assert.equal(JSON.stringify(original), json);
  const verifying = buildIncidentSnapshot(review, 'verification');
  const monitoring = buildIncidentSnapshot(verifying, 'monitoring');
  assert.deepEqual(summarizeJobs(verifying.jobs), { total: 170, running: 120, waiting: 24, review: 0, completed: 26 });
  assert.deepEqual(summarizeJobs(monitoring.jobs), { total: 167, running: 121, waiting: 24, review: 0, completed: 22 });
  assert.equal(getIncidentJobs(monitoring).length, 3);
  assert.equal(monitoring.actions.some(record => record.operationId === 'OP-317'), false);
});
