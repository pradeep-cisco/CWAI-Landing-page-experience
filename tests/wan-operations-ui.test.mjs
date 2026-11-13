import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// Render the actual UI: model-only tests cannot catch an empty incident queue
// crashing the page, or unrelated cases inheriting another case's evidence.
let server, Dashboard, IncidentSection, DataHealthSummary, RecentSection, AgentWorkspace, buildOperations, createAgentState, enterAgentFrame;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom', logLevel: 'error',
  });
  ({ default: Dashboard } = await server.ssrLoadModule('/src/features/wan/operations/OperationsDashboard.jsx'));
  ({ IncidentSection } = await server.ssrLoadModule('/src/features/wan/operations/SituationSections.jsx'));
  ({ AgentWorkspace } = await server.ssrLoadModule('/src/features/wan/AgentWorkspace.jsx'));
  ({ DataHealthSummary, RecentSection } = await server.ssrLoadModule('/src/features/wan/operations/EvidenceSections.jsx'));
  ({ buildOperations } = await server.ssrLoadModule('/src/features/wan/operations/operations-model.js'));
  ({ createAgentState, enterAgentFrame } = await server.ssrLoadModule('/src/features/wan/model/agentic-model.js'));
});
after(async () => { await server?.close(); });

const at = (frame, overrides = {}) => enterAgentFrame(createAgentState(overrides), frame);
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test('quiet and verified dashboards render four section homes without an active case', () => {
  for (const frame of [0, 11]) {
    const html = render(Dashboard, { state: at(frame) });
    assert.deepEqual([...html.matchAll(/<section[^>]* id="(ops-[^"]+)"/g)].map(match => match[1]), [
      'ops-incidents', 'ops-watchlist', 'ops-changes', 'ops-recent',
    ]);
    assert.match(html, /No active incidents/);
    assert.doesNotMatch(html, /class="sit-case-tabs"/);
  }
});

test('a promoted trend has one incident workspace and a compact Watchlist reference', () => {
  const developing = render(Dashboard, { state: at(1) });
  assert.match(developing, /class="sit-trend-workspace"/);
  const active = render(Dashboard, { state: at(7) });
  assert.doesNotMatch(active, /class="sit-trend-workspace"/);
  assert.match(active, /The trend is now tracked in CNC-1042/);
  for (const name of ['overview', 'recovery', 'history']) assert.match(active, new RegExp(`<hbr-tab-panel name="${name}"`));
});

test('a Critical router case cannot display the interface job or recovery tabs', () => {
  const state = at(7, { critical: true });
  const html = render(IncidentSection, { state, model: buildOperations(state) });
  assert.match(html, /XR-PE-E2/);
  assert.doesNotMatch(html, /RUN-017|class="sit-case-tabs"|Related occurrences/);
});

test('collapsed Data health reports incomplete coverage and independent unreachable evidence', () => {
  const html = render(DataHealthSummary, { model: buildOperations(at(7, { gap: 'east', critical: true })) });
  const label = html.split('class="evidence-health-details"')[0];
  assert.match(label, /Collection delayed/);
  assert.match(label, /XR-PE-E2 unreachable; independently checked/);
  assert.doesNotMatch(html.split('<div slot="label"')[0], / open(?:=|>)/);
});

test('failed and unconfirmed execution never create a current verified outcome', () => {
  for (const runOutcome of ['failed', 'unknown']) {
    const state = at(11, { runOutcome });
    const model = buildOperations(state);
    const incident = render(IncidentSection, { state, model });
    assert.match(incident, /Source-cleared/);
    assert.match(incident, runOutcome === 'failed' ? /Execution failed/ : /Controller result unconfirmed/);
    const recent = render(RecentSection, { model });
    assert.match(recent, /CNC-0991/);
    assert.doesNotMatch(recent, /data-outcome-id="CNC-1042"/);
  }
  const verified = render(RecentSection, { model: buildOperations(at(11)) });
  assert.match(verified, /data-outcome-id="CNC-1042"/);
  assert.match(verified, /Recovery verified · 08:35/);
});

test('the assistant uses truthful shared progress and keeps failure owned by CW AI', () => {
  for (const runOutcome of ['failed', 'unknown']) {
    const state = at(11, {runOutcome, agentic:{open:true}});
    const html = render(AgentWorkspace,{state});
    assert.match(html, /Owned by CW AI/);
    assert.match(html, /Reconciling/);
    assert.doesNotMatch(html, /label="Remediate" subtext="Complete"/);
    assert.doesNotMatch(html, /Engineering handoff|Route to engineering|Accepted by|Arun/);
    assert.match(html, /Controller result needs reconciliation|execution/i);
  }
});

test('a generated response exposes projected alternatives and respects an authority hold', () => {
  const generated = at(5,{match:'no-match'});
  const plan = render(IncidentSection,{state:generated,model:buildOperations(generated)});
  assert.match(plan,/Constructed from network evidence/);
  assert.match(plan,/81% projected utilization/);
  assert.match(plan,/60% projected utilization/);
  assert.match(plan,/Projected bottleneck utilization/);
  const blocked = at(5,{match:'restricted'});
  const held = render(IncidentSection,{state:blocked,model:buildOperations(blocked)});
  assert.match(held,/>Held<\/hbr-tag>/);
  assert.doesNotMatch(held,/>Selected<\/hbr-tag>/);
});

test('unclassified and expected events remain inspectable without a second alarm panel', () => {
  const state = at(0,{unclassifiedEvent:true,sourceEvents:[{id:'EXPECTED-1',title:'Scheduled event',disposition:'expected',dispositionReason:'Recorded maintenance scope',source:'Maintenance source'}]});
  const html = render(Dashboard,{state});
  assert.match(html,/CNC-3110/);
  assert.match(html,/Minor · Under correlation/);
  assert.match(html,/Expected events · 1/);
  assert.match(html,/Recorded maintenance scope/);
  assert.doesNotMatch(html,/class="wan-alarm-card"/);
});

test('a revised response retains the failed attempt and source reconciliation proof', () => {
  const state = at(11,{runOutcome:'failed',reconciliation:'verified-retry',agentic:{open:true}});
  const html = render(AgentWorkspace,{state});
  assert.match(html,/RUN-018/);
  assert.match(html,/RUN-017/);
  assert.match(html,/Failed/);
  assert.match(html,/08:26/);
  assert.match(html,/08:29/);
  assert.doesNotMatch(html,/Engineering handoff|Route to engineering/);
});
