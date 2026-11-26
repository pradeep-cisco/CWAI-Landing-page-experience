import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot } from '../src/features/agent-centric/agent-scale-model.js';
import { buildIncidentSnapshot } from '../src/features/agent-centric/incident-thread-model.js';
import { getIncidentOverview } from '../src/features/agent-centric/incident-overview-model.js';

let server, cacheDirectory, IncidentDrawer;
before(async () => {
  cacheDirectory = await mkdtemp(join(tmpdir(), 'cwai-incident-drawer-ui-'));
  server = await createServer({ cacheDir: cacheDirectory, server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  ({ default: IncidentDrawer } = await server.ssrLoadModule('/src/features/agent-centric/IncidentDrawer.jsx'));
});
after(async () => { try { await server?.close(); } finally { if (cacheDirectory) await rm(cacheDirectory, { recursive: true, force: true }); } });

const snapshot = (state = 'review', variant = 'main') => buildIncidentSnapshot(buildScaleSnapshot(getAgentCentricSnapshot(2, variant)), state);
const render = (model, props = {}) => renderToStaticMarkup(React.createElement(IncidentDrawer, {
  model, incidentIds: getIncidentOverview(model).map(incident => incident.id), selectedIncidentId: 'INC-317',
  onSelectIncident() {}, onClose() {}, onWidthCommit() {}, onDecision() {}, changeDecisions: {}, ...props,
}));
const buttonFor = (html, label) => [...html.matchAll(/<hbr-button\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes(`arialabel="${label}"`) || tag.includes(`aria-label="${label}"`));
const inspectionPanels = html => [...html.matchAll(/<section\b[^>]*id="agent-incident-drawer"/g)].length;

test('incident inspection is a right-docked nonmodal region with native controls and an accessible resize handle', () => {
  const html = render(snapshot());
  assert.equal(inspectionPanels(html), 1);
  assert.match(html, /class="agent-incident-drawer"/);
  assert.match(html, /role="region"/);
  assert.match(html, /data-placement="right"/);
  assert.match(html, /data-docked="true"/);
  assert.match(html, /--incident-panel-width:480px/);
  assert.match(html, /aria-labelledby="agent-incident-inspection-label"/);
  assert.doesNotMatch(html, /<hbr-drawer|aria-modal|\boverlay=/, 'the incident queue must remain interactive outside inspection');
  assert.match(html, /role="separator"/);
  assert.match(html, /aria-orientation="vertical"/);
  assert.match(html, /aria-label="Resize incident drawer"/);
  assert.match(html, /id="agent-incident-INC-317-title"/);
  assert.match(html, /Supporting jobs/);
  assert.ok(buttonFor(html, 'Close incident details'));
});

test('Previous and Next span the captured queue order, including incidents beyond the first queue page', () => {
  const model = snapshot(), ids = getIncidentOverview(model).map(incident => incident.id);
  assert.ok(ids.length > 6, 'the scenario has a second page');
  const first = render(model, { incidentIds: ids, selectedIncidentId: ids[0] });
  const middle = render(model, { incidentIds: ids, selectedIncidentId: ids[6] });
  const last = render(model, { incidentIds: ids, selectedIncidentId: ids.at(-1) });
  assert.match(buttonFor(first, 'Previous incident') || '', /\bdisabled/);
  assert.doesNotMatch(buttonFor(first, 'Next incident') || '', /\bdisabled/);
  assert.doesNotMatch(buttonFor(middle, 'Previous incident') || '', /\bdisabled/);
  assert.doesNotMatch(buttonFor(middle, 'Next incident') || '', /\bdisabled/);
  assert.match(buttonFor(last, 'Next incident') || '', /\bdisabled/);
  assert.doesNotMatch(buttonFor(last, 'Previous incident') || '', /\bdisabled/);
  for (const html of [first, middle, last]) {
    assert.ok(buttonFor(html, 'Previous incident'));
    assert.ok(buttonFor(html, 'Next incident'));
    assert.equal(inspectionPanels(html), 1);
  }
});

test('drawer navigation cannot expose incidents outside the current filter or invent a missing selection', () => {
  const model = snapshot(), ids = getIncidentOverview(model).map(incident => incident.id);
  const west = render(model, { domainFilter: 'west', incidentIds: [...ids, ids[0], 'INC-MISSING'] });
  assert.match(buttonFor(west, 'Previous incident') || '', /\bdisabled/);
  assert.match(buttonFor(west, 'Next incident') || '', /\bdisabled/);
  assert.equal(render(model, { selectedIncidentId: 'INC-MISSING' }), '');
  assert.equal(render(model, { selectedIncidentId: ids[1], domainFilter: 'west' }), '');
  assert.equal(render(model, { selectedIncidentId: null }), '');
  assert.equal(render(model, { agentFilter: 'unavailable' }), '');
  const standalone = render(model, { incidentIds: ids.slice(1) });
  assert.match(buttonFor(standalone, 'Previous incident') || '', /\bdisabled/);
  assert.match(buttonFor(standalone, 'Next incident') || '', /\bdisabled/, 'opening outside a captured queue must not fabricate a position');
});

test('a scoped change review stays inside the incident drawer and retains versioned authority', () => {
  const model = snapshot(), proposal = model.jobs.find(job => job.id === 'R-41').proposal;
  const request = { jobId: 'R-41', reviewedVersion: proposal.version, token: 1 };
  const html = render(model, { reviewRequest: request });
  assert.equal(inspectionPanels(html), 1, 'review must not stack another panel');
  assert.match(html, /Back to incident/);
  assert.match(html, /Current configuration/);
  assert.match(html, /Proposed configuration/);
  assert.match(html, /Approval covers this version and these targets/);
  const authorize = [...html.matchAll(/<hbr-button\b[^>]*>Authorize change/g)].map(match => match[0]);
  assert.equal(authorize.length, 1);
  assert.doesNotMatch(authorize[0], /\bdisabled/);
  const outdated = render(model, { reviewRequest: { ...request, reviewedVersion: proposal.version - 1 } });
  assert.doesNotMatch(outdated, /<hbr-button\b(?![^>]*\bdisabled)[^>]*>Authorize change/, 'an old proposal version never grants authority');
  const restricted = snapshot();
  restricted.permissions.reviewChange = false;
  assert.doesNotMatch(render(restricted, { reviewRequest: request }), /<hbr-button\b(?![^>]*\bdisabled)[^>]*>Authorize change/);
  assert.doesNotMatch(render(snapshot('review', 'offline'), { reviewRequest: request }), /<hbr-button\b(?![^>]*\bdisabled)[^>]*>Authorize change/);
});

test('a review request cannot pull an unrelated incident into the open drawer', () => {
  const model = snapshot(), ids = getIncidentOverview(model).map(incident => incident.id);
  const html = render(model, { selectedIncidentId: ids[1], reviewRequest: { jobId: 'R-41', reviewedVersion: 1, token: 1 } });
  assert.equal(inspectionPanels(html), 1);
  assert.match(html, new RegExp(`id="agent-incident-${ids[1]}-title"`));
  assert.doesNotMatch(html, /Authorize change|Current configuration|PLAN-INC-317-R41/);
});
