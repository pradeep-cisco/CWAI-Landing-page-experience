import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot } from '../src/features/agent-centric/agent-scale-model.js';

let server;
let JobsManager;
let AgentCentricDashboard;
const snapshot = variant => buildScaleSnapshot(getAgentCentricSnapshot(2, variant));
const noop = () => {};

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
    logLevel: 'error',
  });
  ({ default: JobsManager } = await server.ssrLoadModule('/src/features/agent-centric/JobsManager.jsx'));
  ({ default: AgentCentricDashboard } = await server.ssrLoadModule('/src/features/agent-centric/AgentCentricDashboard.jsx'));
});

after(async () => { await server?.close(); });

const render = (Component, props, path = '/network-monitoring/jobs') => renderToStaticMarkup(
  React.createElement(MemoryRouter, { basename: '/preview/cwai', initialEntries: [`/preview/cwai${path}`] },
    React.createElement(Component, props)),
);
const renderManager = props => render(JobsManager, { model: snapshot(), onInspect: noop, onReview: noop, onStartJob: noop, ...props });
const rows = html => [...html.matchAll(/class="agent-jobs-table-row"/g)].length;
const rowLinks = html => [...html.matchAll(/<a class="agent-jobs-table-link"[^>]*>/g)].map(match => match[0]);
const button = (html, label) => [...html.matchAll(/<hbr-button\b[^>]*>[\s\S]*?<\/hbr-button>/g)].map(match => match[0]).find(markup => markup.includes(label));
const taskFilter = html => html.match(/<hbr-select label="Task"[^>]*>[\s\S]*?<\/hbr-select>/)?.[0] || '';

test('the integrated manager has one Start job entry and replaces the Home work surface', () => {
  const html = render(AgentCentricDashboard, {
    page: 'jobs',
    routeSearch: '?exploration=agent-centric&status=review',
    onNavigate: noop,
  });
  assert.match(html, /<h1[^>]*>Jobs manager<\/h1>/);
  assert.equal([...html.matchAll(/>Start job<\/hbr-button>/g)].length, 1);
  assert.equal(rows(html), 1, 'the Review snapshot contains one current governed correction');
  assert.match(html, /job=R-41/);
  assert.doesNotMatch(html, /class="agent-home-context"/);
  assert.doesNotMatch(html, /id="agent-home-next-title"/);
  assert.match(html, /href="\/preview\/cwai\/network-monitoring\?exploration=agent-centric&amp;experience=review"/);
});

test('a shared verification snapshot restores its actual job evidence and phase in native links', () => {
  const html = render(AgentCentricDashboard, {
    page: 'jobs',
    routeSearch: '?exploration=agent-centric&experience=verification&group=verification&q=V-51',
    onNavigate: noop,
  });
  assert.equal(rows(html), 1);
  assert.match(html, /job=V-51/);
  assert.match(html, /experience=verification/);
  assert.match(html, />Verified<\/hbr-tag>/);
  assert.doesNotMatch(html, /No jobs match this view/);
});

test('scoped row links retain all selected filters and identify the exact job under the deployment base path', () => {
  const html = renderManager({
    query: { domainId: 'west', agentId: 'capacity', groupId: 'capacity-checks', status: 'running', query: 'headroom', page: 0 },
  });
  assert.equal(rows(html), 2);
  const links = rowLinks(html);
  assert.equal(links.length, 2);
  for (const jobId of ['JOB-1029', 'JOB-1093']) {
    assert.ok(links.some(link => link.includes(`href="/preview/cwai/network-monitoring/jobs?exploration=agent-centric&amp;domain=west&amp;agent=capacity&amp;status=running&amp;group=capacity-checks&amp;q=headroom&amp;job=${jobId}"`)));
  }
  assert.match(html, /href="\/preview\/cwai\/network-monitoring\?exploration=agent-centric&amp;domain=west&amp;agent=capacity"/);
  assert.doesNotMatch(links.join(''), /ROUTE-104/);
});

test('Task options expose canonical categories while a selected legacy filter keeps its exact scope', () => {
  const html = renderManager();
  const options = [...taskFilter(html).matchAll(/<hbr-option value="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(new Set(options), new Set(['all', 'investigations', 'configuration-checks', 'event-correlation', 'risk-assessments', 'capacity-checks', 'service-checks', 'remediation', 'verification']));
  assert.match(taskFilter(html), />All tasks<\/hbr-option>/);
  assert.doesNotMatch(taskFilter(html), /saved filter|network-checks|event-archive|routing-correction/);

  const model = snapshot();
  const expected = model.jobs.filter(job => ['incident-correlation', 'configuration-checks', 'service-assurance'].includes(job.groupId) && job.domainId === 'west' && job.agentId === 'cdd');
  const saved = renderManager({ model, query: { domainId: 'west', agentId: 'cdd', groupId: 'network-checks' } });
  assert.equal(rows(saved), expected.length);
  assert.match(taskFilter(saved), /<hbr-option value="network-checks">Network checks \(saved filter\)<\/hbr-option>/);
  assert.doesNotMatch(taskFilter(saved), /Unavailable task/);
  for (const job of expected) assert.ok(rowLinks(saved).some(link => link.includes(`domain=west&amp;agent=cdd&amp;group=network-checks&amp;job=${job.id}`)));
  const noRiskCapacity = renderManager({ query: { groupId: 'risk-assessments', agentId: 'capacity' } });
  assert.equal(rows(noRiskCapacity), 0);
  assert.match(noRiskCapacity, /No jobs match this view/);
  assert.doesNotMatch(noRiskCapacity, /saved filter/);
});

test('review links are scoped to reviewable jobs and become inspection links without delegated authority', () => {
  const model = snapshot();
  const review = renderManager({ model, query: { status: 'review', domainId: 'west', agentId: 'remediation' } });
  assert.equal(rows(review), 1);
  assert.match(rowLinks(review)[0], /aria-label="Review change: Restore routing policy · West/);
  assert.match(rowLinks(review)[0], /job=REVIEW-502/);
  assert.doesNotMatch(review, /job=ROUTE-104/);
  assert.equal([...review.matchAll(/aria-label="Review change:/g)].length, 1);
  const noAuthority = renderManager({ model: { ...model, permissions: { ...model.permissions, reviewChange: false } }, query: { status: 'review', domainId: 'west' } });
  assert.equal(rows(noAuthority), 1);
  assert.match(rowLinks(noAuthority)[0], /aria-label="Open job:/);
  assert.doesNotMatch(noAuthority, /aria-label="Review change:/);
  const inspection = renderManager({ model, query: { groupId: 'routing-correction' } });
  assert.match(rowLinks(inspection)[0], /aria-label="Open job: Restore approved routing intent/);
  assert.doesNotMatch(inspection, /aria-label="Review change:/);
});

test('invalid saved filters and out-of-scope job selections cannot expose unrelated work', () => {
  for (const field of ['domainId', 'agentId', 'status', 'groupId']) {
    const html = renderManager({ query: { [field]: 'not-a-real-scope', jobId: 'ROUTE-104' } });
    assert.equal(rows(html), 0, `${field} should have no matching rows`);
    assert.match(html, /A saved filter is unavailable/);
    assert.match(html, /The selected job is unavailable in this view/);
    assert.match(html, /No jobs match this view/);
    assert.equal(rowLinks(html).length, 0);
  }
  const scoped = renderManager({ query: { domainId: 'west', agentId: 'capacity', groupId: 'capacity-checks', jobId: 'ROUTE-104' } });
  assert.equal(rows(scoped), 2);
  assert.match(scoped, /The selected job is unavailable in this view/);
  assert.ok(rowLinks(scoped).every(link => !link.includes('ROUTE-104')));
});

test('pagination bounds the visible work and keeps page context in exact-job links', () => {
  const model = snapshot();
  const first = renderManager({ model });
  assert.equal(rows(first), 12);
  assert.match(first, /Page 1 of 14/);
  assert.match(button(first, 'Previous'), /disabled=""/);
  assert.doesNotMatch(button(first, 'Next'), /disabled/);

  const second = renderManager({ model, query: { page: 1 } });
  assert.equal(rows(second), 12);
  assert.match(second, /Page 2 of 14/);
  assert.ok(rowLinks(second).every(link => link.includes('&amp;page=2&amp;job=')));
  const firstJobIds = rowLinks(first).map(link => link.match(/job=([^"&]+)/)?.[1]);
  const secondJobIds = rowLinks(second).map(link => link.match(/job=([^"&]+)/)?.[1]);
  assert.ok(secondJobIds.every(id => !firstJobIds.includes(id)));

  const last = renderManager({ model, query: { page: 99999 } });
  assert.equal(rows(last), 12);
  assert.match(last, /Page 14 of 14/);
  assert.match(last, /<strong>157–168<\/strong> of 168 jobs/);
  assert.match(button(last, 'Next'), /disabled=""/);
  assert.doesNotMatch(button(last, 'Previous'), /disabled/);
});

test('interrupted sources retain inspectable records without implying live state or allowing new work', () => {
  const html = renderManager({ model: snapshot('offline'), query: { status: 'review' } });
  assert.equal(rows(html), 5);
  assert.match(html, /data-source="last-known"/);
  assert.match(html, /Updates interrupted/);
  assert.equal([...html.matchAll(/Last known · Review required/g)].length, 5);
  assert.doesNotMatch(html, />Live work</);
  assert.doesNotMatch(html, /aria-label="Review change:/);
  assert.equal([...html.matchAll(/aria-label="Open job:/g)].length, 5);
  assert.match(button(html, 'Start job'), /disabled=""/);
  assert.ok(rowLinks(html).every(link => link.includes('&amp;status=review&amp;job=')));
});
