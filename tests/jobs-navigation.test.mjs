import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, filterJobs, jobCategory } from '../src/features/agent-centric/agent-scale-model.js';
import { buildAgentHomePath, buildJobsPath, getJobsPage, normalizeJobsQuery, PAGE_SIZE, parseJobsQuery, selectManagerJobs, UNAVAILABLE_FILTER } from '../src/features/agent-centric/jobs-navigation.js';

const model = () => buildScaleSnapshot(getAgentCentricSnapshot(2));

test('Jobs manager links round-trip scope, state, task, search and exact job selection', () => {
  const query = { domainId: 'west', agentId: 'capacity', status: 'running', groupId: 'capacity-checks', query: 'headroom & link', page: 2, jobId: 'JOB-1029' };
  const url = new URL(buildJobsPath(query), 'https://example.invalid');
  assert.equal(url.pathname, '/network-monitoring/jobs');
  assert.equal(url.searchParams.get('exploration'), 'agent-centric');
  assert.equal(url.searchParams.get('page'), '3');
  assert.deepEqual(parseJobsQuery(url.searchParams), normalizeJobsQuery(query));
});

test('presentation snapshots survive native task links and the return Home link', () => {
  for (const experienceState of ['monitoring', 'review', 'verification']) {
    const query = normalizeJobsQuery({ experienceState, domainId: 'west', agentId: 'remediation', groupId: 'verification', jobId: 'V-51' });
    const destination = new URL(buildJobsPath(query), 'https://example.invalid');
    assert.equal(destination.searchParams.get('experience'), experienceState);
    assert.deepEqual(parseJobsQuery(destination.searchParams), query);
    const home = new URL(buildAgentHomePath(query), 'https://example.invalid');
    assert.equal(home.searchParams.get('experience'), experienceState);
    assert.equal(home.searchParams.has('job'), false);
  }
  assert.equal(Object.hasOwn(normalizeJobsQuery({ experienceState: 'missing' }), 'experienceState'), false);
});

test('Home links retain domain and agent without carrying detailed manager filters', () => {
  const url = new URL(buildAgentHomePath({ domainId: 'north', agentId: 'assurance', status: 'waiting', groupId: 'service-assurance', query: 'VPN', page: 4, jobId: 'JOB-42' }), 'https://example.invalid');
  assert.equal(url.pathname, '/network-monitoring');
  assert.equal(url.searchParams.get('exploration'), 'agent-centric');
  assert.equal(url.searchParams.get('domain'), 'north');
  assert.equal(url.searchParams.get('agent'), 'assurance');
  for (const key of ['status', 'group', 'q', 'page', 'job']) assert.equal(url.searchParams.has(key), false);
});

test('unknown saved scopes and group values cannot broaden the manager to all jobs', () => {
  const snapshot = model();
  for (const key of ['domainId', 'agentId', 'status', 'groupId']) {
    const query = normalizeJobsQuery({ [key]: 'missing-scope' });
    assert.equal(query[key], UNAVAILABLE_FILTER);
    assert.deepEqual(selectManagerJobs(snapshot, query), []);
  }
  const quiet = buildScaleSnapshot(getAgentCentricSnapshot(7, 'quiet'));
  assert.deepEqual(selectManagerJobs(quiet, { groupId: 'event-archive' }), []);
});

test('a task remains exact after narrowing to one agent and one device group', () => {
  const snapshot = model();
  const expected = filterJobs(snapshot.jobs, { domainId: 'west', agentId: 'capacity' });
  assert.ok(expected.length > 0);
  const jobs = selectManagerJobs(snapshot, { groupId: 'capacity-checks', domainId: 'west', agentId: 'capacity' });
  assert.deepEqual(jobs.map(job => job.id), expected.map(job => job.id));
  assert.equal(new Set(jobs.map(job => job.id)).size, jobs.length);
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'capacity-checks', agentId: 'correlation' }), []);
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'capacity-checks', domainId: 'west', agentId: 'capacity', status: 'review' }), []);
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'capacity-checks', domainId: 'west', agentId: 'capacity', query: 'JOB-1029' }).map(job => job.id), ['JOB-1029']);
});

test('the eight canonical tasks cover all job states once without mixing capacity into risk', () => {
  const snapshot = model();
  const tasks = ['investigations', 'configuration-checks', 'event-correlation', 'risk-assessments', 'capacity-checks', 'service-checks', 'remediation', 'verification'];
  const categorized = tasks.flatMap(groupId => selectManagerJobs(snapshot, { groupId }));
  assert.equal(categorized.length, snapshot.jobs.length);
  assert.equal(new Set(categorized.map(job => job.id)).size, snapshot.jobs.length);
  assert.deepEqual(new Set(categorized.map(job => job.id)), new Set(snapshot.jobs.map(job => job.id)));
  const risk = selectManagerJobs(snapshot, { groupId: 'risk-assessments' });
  assert.ok(risk.length > 0);
  assert.deepEqual(new Set(risk.map(job => job.agentId)), new Set(['toxic', 'vulnerability']));
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'risk-assessments', agentId: 'capacity' }), []);
  assert.ok(selectManagerJobs(snapshot, { groupId: 'configuration-checks', status: 'completed' }).some(job => job.id === 'CHECK-208'));
  assert.ok(selectManagerJobs(snapshot, { groupId: 'verification' }).some(job => job.id === 'JOB-1023'));
  assert.ok(selectManagerJobs(snapshot, { groupId: 'remediation' }).some(job => job.id === 'ROUTE-104'));
  assert.ok(!selectManagerJobs(snapshot, { groupId: 'remediation' }).some(job => job.id === 'JOB-1023'));
});

test('legacy saved links retain their original membership and intersect current filters', () => {
  const snapshot = model();
  for (const groupId of ['routing-correction', 'event-archive', 'incident-correlation', 'toxic-factors', 'vulnerability-checks', 'capacity-analysis', 'service-assurance', 'reachability-checks', 'outcome-checks', 'change-reviews']) {
    assert.equal(parseJobsQuery(new URL(buildJobsPath({ groupId }), 'https://example.invalid').search).groupId, groupId);
    const expected = snapshot.jobs.filter(job => job.groupId === groupId);
    assert.deepEqual(selectManagerJobs(snapshot, { groupId }).map(job => job.id), expected.map(job => job.id), groupId);
  }
  const legacyNetwork = snapshot.jobs.filter(job => ['incident-correlation', 'configuration-checks', 'service-assurance'].includes(job.groupId));
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'network-checks' }).map(job => job.id), legacyNetwork.map(job => job.id));
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'network-checks', domainId: 'west', agentId: 'cdd' }).map(job => job.id), legacyNetwork.filter(job => job.domainId === 'west' && job.agentId === 'cdd').map(job => job.id));
  assert.deepEqual(selectManagerJobs(snapshot, { groupId: 'network-checks', agentId: 'capacity' }), []);
});

test('completed investigations keep their primary task when historical raw groups differ', () => {
  const quiet = buildScaleSnapshot(getAgentCentricSnapshot(7, 'quiet'));
  const completed = selectManagerJobs(quiet, { groupId: 'investigations', agentId: 'troubleshooter', status: 'completed' });
  assert.ok(completed.some(job => job.id === 'REACH-319'));
  assert.ok(!selectManagerJobs(quiet, { groupId: 'configuration-checks' }).some(job => job.id === 'REACH-319'));
});

test('review and issue filters use real job records without changing their ownership or authority', () => {
  const snapshot = model(), retained = structuredClone(snapshot);
  const review = selectManagerJobs(snapshot, { status: 'review' });
  assert.equal(review.length, 6);
  assert.ok(review.every(job => jobCategory(job) === 'review'));
  const related = selectManagerJobs(snapshot, { query: 'ISSUE-1003' });
  assert.equal(related.length, 2);
  assert.equal(new Set(related.map(job => job.agentId)).size, 2);
  assert.deepEqual(snapshot, retained);
});

test('query text stays literal and cannot replace the exploration or network scope', () => {
  const query = 'x&exploration=combined&domain=all#outside';
  const url = new URL(buildJobsPath({ query, domainId: 'west' }), 'https://example.invalid');
  assert.equal(url.searchParams.get('q'), query);
  assert.equal(url.searchParams.get('domain'), 'west');
  assert.equal(url.searchParams.get('exploration'), 'agent-centric');
  assert.equal(url.hash, '');
  assert.equal(normalizeJobsQuery({ query: 'a'.repeat(500) }).query.length, 200);
  assert.equal(parseJobsQuery('?job=https://other.example').jobId, 'unavailable-job');
});

test('pagination covers every job once and remains bounded when result sets shrink', () => {
  const jobs = model().jobs;
  const first = getJobsPage(jobs);
  assert.equal(first.jobs.length, PAGE_SIZE);
  const all = Array.from({ length: first.pageCount }, (_, page) => getJobsPage(jobs, { page }).jobs).flat();
  assert.deepEqual(all.map(job => job.id), jobs.map(job => job.id));
  const shrunk = getJobsPage(jobs.slice(0, 3), { page: 999999 });
  assert.equal(shrunk.page, 0);
  assert.equal(shrunk.jobs.length, 3);
  assert.deepEqual(getJobsPage([], { page: 12 }), { jobs: [], total: 0, page: 0, pageCount: 1, start: 0, end: 0 });
  assert.equal(parseJobsQuery('?page=-4').page, 0);
  assert.equal(parseJobsQuery('?page=not-a-number').page, 0);
});

test('the manager page renders bounded deep links, review routing and qualified interrupted data', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  try {
    const { default: JobsManager } = await server.ssrLoadModule('/src/features/agent-centric/JobsManager.jsx');
    const render = props => renderToStaticMarkup(React.createElement(MemoryRouter, { basename: '/preview', initialEntries: ['/preview/network-monitoring/jobs'] }, React.createElement(JobsManager, props)));
    const snapshot = model();
    const html = render({ model: snapshot, onInspect() {}, onStartJob() {} });
    assert.match(html, /<h1[^>]*>Jobs manager<\/h1>/);
    assert.equal([...html.matchAll(/class="agent-jobs-table-row"/g)].length, PAGE_SIZE);
    assert.match(html, /href="\/preview\/network-monitoring\?exploration=agent-centric"/);
    assert.match(html, /href="\/preview\/network-monitoring\/jobs\?exploration=agent-centric&amp;job=ROUTE-104"/);
    const reviews = render({ model: snapshot, query: { status: 'review' }, onReview() {} });
    assert.equal([...reviews.matchAll(/aria-label="Review change:/g)].length, 6);
    const offline = buildScaleSnapshot(getAgentCentricSnapshot(2, 'offline'));
    const interrupted = render({ model: offline, query: { status: 'review' }, onReview() {}, onStartJob() {} });
    assert.match(interrupted, /Updates interrupted/);
    assert.match(interrupted, /Last known ·/);
    assert.doesNotMatch(interrupted, /aria-label="Review change:/);
    const missing = render({ model: snapshot, query: { groupId: 'unsupported' } });
    assert.match(missing, /No jobs match this view/);
    assert.equal([...missing.matchAll(/class="agent-jobs-table-row"/g)].length, 0);
  } finally {
    await server.close();
  }
});
