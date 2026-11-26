import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, filterJobs, summarizeJobs } from '../src/features/agent-centric/agent-scale-model.js';
import { getTaskId } from '../src/features/agent-centric/agent-job-tasks.js';
import { getWorkGroups } from '../src/features/agent-centric/agent-job-groups.js';

const snapshot = (variant = 'main') => buildScaleSnapshot(getAgentCentricSnapshot(2, variant));
const canonicalIds = ['investigations', 'configuration-checks', 'event-correlation', 'risk-assessments', 'capacity-checks', 'service-checks', 'remediation', 'verification'];
const sortedIds = jobs => jobs.map(job => job.id).sort();

function assertPartition(jobs, issues = []) {
  const { allGroups, visibleGroups } = getWorkGroups(jobs, issues);
  assert.deepEqual(visibleGroups.map(group => group.id), allGroups.map(group => group.id), 'no nonempty task is hidden by a landing cap');
  assert.deepEqual(sortedIds(allGroups.flatMap(group => group.jobs)), sortedIds(jobs), 'each scoped job appears exactly once');
  assert.ok(allGroups.every(group => group.jobs.length > 0));
  for (const group of allGroups) {
    assert.ok(canonicalIds.includes(group.id));
    assert.deepEqual(group.counts, summarizeJobs(group.jobs));
    assert.ok(group.jobs.every(job => getTaskId(job) === group.id));
  }
  return allGroups;
}

test('eight canonical tasks partition all 168 jobs without overlapping thematic collections', () => {
  const model = snapshot();
  const before = JSON.stringify(model);
  const groups = assertPartition(model.jobs, model.issues);
  assert.deepEqual(groups.map(group => group.id), canonicalIds);
  assert.deepEqual(groups.map(group => group.jobs.length), [30, 54, 13, 26, 13, 13, 6, 13]);
  assert.deepEqual(new Set(groups.find(group => group.id === 'risk-assessments').jobs.map(job => job.agentId)), new Set(['toxic', 'vulnerability']));
  assert.ok(groups.find(group => group.id === 'capacity-checks').jobs.every(job => job.agentId === 'capacity'));
  assert.equal(JSON.stringify(model), before, 'organizing the landing must not mutate source records');
});

test('task membership follows the work rather than changing with its lifecycle state', () => {
  const model = snapshot();
  for (const job of model.jobs) {
    const { taskId: declaredTask, ...unclassified } = job;
    const expected = getTaskId(unclassified);
    assert.equal(declaredTask, expected, `${job.id}: stored and derived task identities agree`);
    for (const status of ['Investigating', 'Waiting for source access', 'Review required', 'Request submitted', 'Verified', 'Failed']) {
      assert.equal(getTaskId({ ...unclassified, status }), expected, `${job.id}: ${status} must not change the task when classification is required`);
    }
  }
  assert.equal(getTaskId({ id: 'ROUTE-104', agentId: 'remediation', capabilityId: 'verify', status: 'Verified' }), 'remediation', 'the routing correction retains its own lifecycle');
  assert.equal(getTaskId({ id: 'SEPARATE-VERIFY', agentId: 'remediation', capabilityId: 'verify', status: 'Verified' }), 'verification', 'an independent verification task has a separate identity');
  assert.equal(getTaskId({ id: 'SCOPED-CORRECTION', agentId: 'remediation', capabilityId: 'assess', status: 'Review required' }), 'remediation', 'a correction remains remediation even if its request metadata names assessment');
});

test('filters and interrupted or quiet sources preserve a complete partition of the available records', () => {
  for (const variant of ['main', 'offline', 'quiet']) {
    const model = snapshot(variant);
    for (const filters of [{}, { domainId: 'west' }, { agentId: 'remediation' }, { domainId: 'west', agentId: 'capacity' }, { domainId: 'missing' }]) {
      assertPartition(filterJobs(model.jobs, filters), model.issues);
    }
  }
  const quiet = snapshot('quiet');
  const groups = assertPartition(quiet.jobs, quiet.issues);
  assert.deepEqual(groups.map(group => group.id), ['investigations', 'configuration-checks', 'remediation']);
  assert.ok(groups.every(group => group.counts.completed === group.jobs.length), 'completed-only tasks remain represented without being promoted to running work');
});

test('task order and inclusion remain stable when a completed issue is selected or input order changes', () => {
  const model = snapshot();
  const terminal = model.jobs.find(job => summarizeJobs([job]).completed > 0);
  const baseline = getWorkGroups(model.jobs, model.issues);
  const selected = getWorkGroups([...model.jobs].reverse(), model.issues, terminal.issueId);
  assert.deepEqual(selected.visibleGroups.map(group => group.id), canonicalIds);
  for (const group of selected.allGroups) {
    assert.deepEqual(sortedIds(group.jobs), sortedIds(baseline.allGroups.find(item => item.id === group.id).jobs));
  }
});

test('an unrecognized valid job is retained in Investigations rather than omitted', () => {
  const job = { id: 'JOB-UNRECOGNIZED', issueId: 'ISSUE-UNRECOGNIZED', agentId: 'external-specialist', capabilityId: 'new-analysis', status: 'Assessing', scope: 'West · XR-EXT-001', domainId: 'west' };
  assert.equal(getTaskId(job), 'investigations');
  const groups = assertPartition([job]);
  assert.deepEqual(groups.map(group => group.id), ['investigations']);
});
