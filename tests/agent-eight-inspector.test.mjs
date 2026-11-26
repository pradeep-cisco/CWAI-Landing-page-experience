import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot } from '../src/features/agent-centric/agent-scale-model.js';

let server, Inspector, getAnswer;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  ({ default: Inspector, getJobContextAnswer: getAnswer } = await server.ssrLoadModule('/src/features/agent-centric/AgentJobInspector.jsx'));
});
after(async () => { await server?.close(); });

const snapshot = (scene = 2, variant = 'main') => buildScaleSnapshot(getAgentCentricSnapshot(scene, variant));
const render = (job, model) => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Inspector, { job, model })));
const encoded = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');

test('specialist inspection shows only the selected job finding, evidence and next step', () => {
  const model = snapshot();
  for (const agentId of ['toxic', 'vulnerability', 'correlation', 'capacity', 'assurance']) {
    const job = model.jobs.find(item => item.agentId === agentId && item.finding);
    assert.ok(job, `${agentId}: a concrete job must exist`);
    const html = render(job, model);
    assert.ok(html.includes(encoded(job.finding)), `${agentId}: the finding belongs to this record`);
    assert.ok(html.includes(encoded(job.nextStep)), `${agentId}: the next step belongs to this record`);
    for (const evidence of job.evidence) assert.ok(html.includes(encoded(evidence)), `${agentId}: supplied evidence remains available`);
    assert.doesNotMatch(html, /PLAN-ROUTE-104|INTENT-XR07-12|set local-preference|XR-R07/);
    assert.doesNotMatch(html, />Review change</, `${agentId}: a read-only assessment must not acquire the unrelated route approval`);
  }
});

test('toxic factor explanations retain association limits and never borrow a corrective plan', () => {
  const model = snapshot();
  const job = model.jobs.find(item => item.agentId === 'toxic' && item.status !== 'Assessment complete');
  const html = render(job, model);
  assert.match(html, /Statistical association does not establish root cause or prescribe remediation/);
  const answer = getAnswer(job, model, 'next');
  assert.ok(answer.includes(job.nextStep));
  assert.match(answer, /Statistical association does not establish root cause/);
  assert.doesNotMatch(answer, /Authorize version|set local-preference|PLAN-ROUTE-104/);
});

test('vulnerability inspection distinguishes missing feature evidence from an established compromise', () => {
  const model = snapshot();
  const job = model.jobs.find(item => item.agentId === 'vulnerability' && /Waiting/.test(item.status));
  assert.ok(job);
  const html = render(job, model);
  assert.match(html, /enabled-feature observation is required before confirming applicability/);
  assert.match(html, /Potential applicability does not establish exploitability or compromise/);
  const answer = getAnswer(job, model, 'next');
  assert.match(answer, /does not establish exploitability or compromise/);
});

test('only an explicit incident relationship appears in a selected correlation job', () => {
  const model = snapshot();
  const classified = model.jobs.find(item => item.agentId === 'correlation' && item.incidentId);
  const pending = model.jobs.find(item => item.agentId === 'correlation' && !item.incidentId);
  assert.ok(classified && pending);
  const html = render(classified, model);
  assert.ok(html.includes(classified.incidentId));
  const unrelated = model.incidents.filter(item => item.id !== classified.incidentId);
  for (const incident of unrelated) assert.ok(!html.includes(incident.id), `unrelated incident ${incident.id} stays outside this inspection`);
  const pendingHtml = render(pending, model);
  for (const incident of model.incidents) assert.ok(!pendingHtml.includes(incident.id), 'events still being classified must not inherit an incident');
  assert.match(getAnswer(classified, model, 'next'), /root cause is not confirmed/);
});

test('interrupted visibility qualifies specialist findings and retained explanations', () => {
  const model = snapshot(2, 'offline');
  const job = model.jobs.find(item => item.agentId === 'toxic');
  const html = render(job, model);
  assert.match(html, /data-source="last-known"/);
  assert.match(html, /Last-known finding/);
  assert.match(html, /last-confirmed record/);
  assert.match(getAnswer(job, model, 'next'), /^Current visibility is interrupted\. Based on the last-confirmed work record:/);
  assert.doesNotMatch(html, />Review change</);
});

test('specialist next steps do not replace original route verification evidence', () => {
  const pending = snapshot(6), confirmed = snapshot(7);
  const routePending = pending.jobs.find(job => job.id === 'ROUTE-104');
  const routeConfirmed = confirmed.jobs.find(job => job.id === 'ROUTE-104');
  assert.match(getAnswer(routePending, pending, 'next'), /Still unconfirmed/);
  assert.match(getAnswer(routeConfirmed, confirmed, 'next'), /recorded configuration.*satisfy this proposal.s criteria/);
});
