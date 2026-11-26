import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, filterJobs } from '../src/features/agent-centric/agent-scale-model.js';
import { buildIncidentSnapshot, getIncidentJobs } from '../src/features/agent-centric/incident-thread-model.js';
import { getIncidentOverview } from '../src/features/agent-centric/incident-overview-model.js';

let server, cacheDirectory, IncidentThread, IncidentSection;
before(async () => {
  cacheDirectory = await mkdtemp(join(tmpdir(), 'cwai-incident-ui-'));
  server = await createServer({ cacheDir: cacheDirectory, server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  ({ default: IncidentThread } = await server.ssrLoadModule('/src/features/agent-centric/IncidentThread.jsx'));
  ({ default: IncidentSection } = await server.ssrLoadModule('/src/features/agent-centric/IncidentSection.jsx'));
});
after(async () => { try { await server?.close(); } finally { if (cacheDirectory) await rm(cacheDirectory, { recursive: true, force: true }); } });

const snapshot = (state = 'review', variant = 'main') => buildIncidentSnapshot(buildScaleSnapshot(getAgentCentricSnapshot(2, variant)), state);
const render = (model, props = {}) => renderToStaticMarkup(React.createElement(IncidentThread, { model, onInspect() {}, onReview() {}, onClose() {}, ...props }));
const renderSection = (model, props = {}) => renderToStaticMarkup(React.createElement(IncidentSection, { model, onOpenIncident() {}, onCloseIncident() {}, onReview() {}, ...props }));
const rows = html => [...html.matchAll(/<[^>]+\bdata-job-id="([^"]+)"[^>]*>/g)].map(match => ({ id: match[1], markup: match[0], index: match.index }));
const supportTag = html => [...html.matchAll(/<hbr-accordion\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('Supporting jobs'));

test('Incidents starts as an independent list with no automatically opened detail', () => {
  for (const state of ['monitoring', 'review', 'verification']) {
    const model = snapshot(state), html = renderSection(model);
    assert.match(html, />Incidents<\/h2>/);
    assert.match(html, /INC-317/);
    assert.doesNotMatch(html, /class="agent-incident-thread"/);
    assert.doesNotMatch(html, /Supporting jobs|data-job-id=/, `${state}: jobs belong to an explicitly opened incident`);
    assert.doesNotMatch(html, /agent-work-feed|Jobs manager|group=capacity-checks/, 'opening an incident is not navigation to a task group');
  }
});

test('an opened incident retains its queue selection without inserting detail or changing the list', () => {
  const model = snapshot('verification');
  const closed = renderSection(model), selected = renderSection(model, { selectedIncidentId: 'INC-317' });
  assert.doesNotMatch(selected, /class="agent-incident-thread"|Supporting jobs|data-job-id=/, 'detail belongs to the Jobs inspection region, not the queue layout');
  const selectedRow = [...selected.matchAll(/<button\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('data-incident-id="INC-317"'));
  assert.ok(selectedRow);
  assert.match(selectedRow, /aria-expanded="true"/);
  assert.doesNotMatch(selectedRow, /aria-haspopup="dialog"/, 'the inspection region is nonmodal');
  for (const incident of getIncidentOverview(model).slice(0, 6)) {
    assert.ok(closed.includes(incident.id), `${incident.id} is initially discoverable`);
    assert.ok(selected.includes(incident.id), `${incident.id} remains available while another incident is open`);
  }
  assert.doesNotMatch(selected, /agent-work-incident-footer|data-incident-related|data-connection=/);
  assert.doesNotMatch(renderSection(model, { selectedIncidentId: 'INC-MISSING' }), /class="agent-incident-thread"/, 'an unavailable selection does not choose an unrelated incident');
});

test('the compact incident queue keeps native pagination independent from drawer navigation', () => {
  const model = snapshot('review'), html = renderSection(model);
  assert.equal([...html.matchAll(/data-incident-id="/g)].length, 6, 'the queue keeps a bounded first page');
  assert.match(html, /1–6 of 8/);
  const controls = [...html.matchAll(/<hbr-button\b[^>]*>/g)].map(match => match[0]);
  assert.match(controls.find(tag => tag.includes('arialabel="Previous incidents"')) || '', /\bdisabled/);
  assert.doesNotMatch(controls.find(tag => tag.includes('arialabel="Next incidents"')) || '', /\bdisabled/);
  assert.ok(controls.some(tag => tag.includes('arialabel="Next incidents"')), 'queue pagination has its own plural accessible name');
  assert.doesNotMatch(renderSection(model, { domainFilter: 'west' }), /arialabel="Next incidents"/, 'a single filtered record has no unnecessary pagination');
});

test('incident progress stays concise while actual supporting jobs remain behind one closed disclosure', () => {
  const expected = { monitoring: ['C-21', 'C-22', 'C-23'], review: ['C-21', 'C-22', 'C-23', 'R-41'], verification: ['C-21', 'C-22', 'C-23', 'R-41', 'V-51', 'V-52'] };
  for (const [state, ids] of Object.entries(expected)) {
    const html = render(snapshot(state));
    assert.deepEqual([...new Set(rows(html).map(row => row.id))], ids, `${state}: future jobs must not become actual supporting work`);
    const disclosure = supportTag(html);
    assert.ok(disclosure, 'supporting jobs use Magnetic progressive disclosure');
    assert.doesNotMatch(disclosure, /\bopen(?:=|\s|>)/, 'supporting jobs are closed on first paint');
    assert.match(html, /Investigate/);
    assert.match(html, /Remediate/);
    assert.match(html, /Verify/);
    assert.match(html, />Now</);
    assert.doesNotMatch(html, /data-connection=|agent-incident-nodes|agent-incident-connector|aria-valuenow|ROUTE-104|REVIEW-501/, 'the first incident view does not become a dependency graph or imply percentage completion');
  }
});

test('embedded incident content uses the containing drawer close control', () => {
  const html = render(snapshot('review'), { embedded: true });
  assert.match(html, /id="agent-incident-INC-317-title"/);
  assert.match(html, /Supporting jobs/);
  assert.doesNotMatch(html, /aria-label="Close incident"|arialabel="Close incident"/, 'the native drawer supplies the only incident close control');
});

test('only a current in-scope review with delegated authority exposes the review action', () => {
  const current = render(snapshot('review'));
  assert.match(current, />Review change</);
  assert.doesNotMatch(current, />Authorize|>Approve|>Execute/, 'the incident entry opens a scoped review rather than authorizing a change');
  const restricted = snapshot('review');
  restricted.permissions.reviewChange = false;
  assert.doesNotMatch(render(restricted), />Review change</);
  assert.doesNotMatch(render(snapshot('review', 'offline')), />Review change</);
  assert.doesNotMatch(render(snapshot('review'), { domainFilter: 'core' }), />Review change</, 'the West remediation cannot be reviewed from the Core-only view');
});

test('a successful recovery result requires a completed verification with sourced comparable measurements', () => {
  const model = snapshot('verification');
  const job = model.jobs.find(item => item.id === 'V-51');
  let html = render(model);
  assert.match(html, /Link utilization within limits/);
  assert.match(html, /92%/);
  assert.match(html, /68%/);
  assert.match(html, /75%/);
  assert.match(html, /routing stability|stability window/i, 'the remaining check is still visible');
  assert.doesNotMatch(html, />Resolved</, 'a passed utilization criterion does not resolve the incident');
  delete job.resultMetrics.source;
  assert.doesNotMatch(render(model), /Link utilization within limits/, 'unsupported measurements cannot become recovery proof');
  job.resultMetrics.source = 'Retained observed result';
  for (const status of ['Assessment complete', 'Verifying']) {
    job.status = status;
    assert.doesNotMatch(render(model), /Link utilization within limits/, `${status} is not a verified utilization result`);
  }
});

test('filtered incident details qualify incident-wide context and keep out-of-scope evidence unavailable', () => {
  const model = snapshot('verification');
  const linked = getIncidentJobs(model, 'INC-317');
  const scoped = filterJobs(linked, { domainId: 'west', agentId: 'all' });
  assert.ok(scoped.length > 0 && scoped.length < linked.length);
  const html = render(model, { domainFilter: 'west' });
  assert.ok(html.includes(`${scoped.length} of ${linked.length}`), 'the panel distinguishes the current filter from the full incident');
  const scopedIds = new Set(scoped.map(job => job.id));
  const allRows = rows(html), outOfScopeJobs = allRows.filter(row => !scopedIds.has(row.id));
  assert.ok(outOfScopeJobs.length > 0);
  for (const row of outOfScopeJobs) {
    const next = allRows.find(candidate => candidate.index > row.index);
    const block = html.slice(row.index, next?.index || html.length);
    assert.match(block, /<button[^>]*\bdisabled/, `${row.id}: out-of-view evidence cannot be opened`);
    assert.match(block, /Outside current filters/, `${row.id}: its scope boundary is explicit`);
  }
  for (const props of [{ domainFilter: 'unavailable' }, { agentFilter: 'unavailable' }, { agentFilter: 'cdd' }]) assert.equal(render(model, props), '');
});

test('interrupted incident records remain qualified and never imply current recovery or review readiness', () => {
  for (const state of ['review', 'verification']) {
    const html = render(snapshot(state, 'offline'));
    assert.match(html, /data-source="last-known"/);
    assert.match(html, /Updates interrupted/);
    assert.match(html, /last.confirmed|Last known/i);
    assert.doesNotMatch(html, /Link utilization within limits|>Review change<|data-moving="true"/);
  }
  assert.equal(render(snapshot('review', 'quiet')), '');
});

test('the first incident view explains its observed finding without exposing unrelated filtered measurements', () => {
  const model = snapshot('review');
  const html = render(model);
  const finding = html.match(/<p\b[^>]*class="agent-incident-finding"[^>]*>[\s\S]*?<\/p>/)?.[0];
  assert.ok(finding);
  assert.match(finding, /data-finding-job="C-21"/);
  assert.match(finding, /92%/);
  assert.match(finding, /Source: CNC interface capacity/);
  assert.match(html, /<hbr-tooltip\b[^>]*\bhoist/, 'finding provenance remains available inside the scrollable incident panel');
  const scoped = render(model, { domainFilter: 'core' });
  const scopedFinding = scoped.match(/<p\b[^>]*class="agent-incident-finding"[^>]*>[\s\S]*?<\/p>/)?.[0];
  assert.match(scopedFinding, /data-finding-job="C-23"/);
  assert.doesNotMatch(scopedFinding, /92%|68%/);
  const offline = render(snapshot('review', 'offline'));
  assert.match(offline, /class="agent-incident-finding"[^>]*data-source="last-known"/);
  assert.match(offline, /Last confirmed finding/);
  const queue = renderSection(model);
  assert.equal([...queue.matchAll(/class="agent-incidents-row-finding"/g)].length, 1, 'only the featured incident gets an extra landing finding line');
  assert.match(queue, /Affected-link utilization reached 92%/);
});
