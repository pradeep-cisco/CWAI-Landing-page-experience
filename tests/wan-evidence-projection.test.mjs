import test, { before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server, EvidenceModal, inventory, agent;

before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null }, appType: 'custom', logLevel: 'silent' });
  ({ default: EvidenceModal } = await server.ssrLoadModule('/src/features/wan/EvidenceModal.jsx'));
  inventory = await server.ssrLoadModule('/src/features/wan/model/scale.js');
  agent = await server.ssrLoadModule('/src/features/wan/model/agentic-model.js');
});

after(async () => { await server?.close(); });
afterEach(() => inventory?.setActiveWanSetup('national'));

const render = (state, selection) => renderToStaticMarkup(React.createElement(EvidenceModal, {
  state, selection, onClose() {}, onInspect() {},
}));
const text = (markup) => markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const definition = (markup, label) => markup.match(new RegExp(`<dt>${label}</dt><dd>(.*?)</dd>`))?.[1];
const sourceState = (overrides = {}) => agent.enterAgentFrame(agent.createAgentState({ critical: true, criticalDetected: '08:20', related: true, ...overrides }), 10);

for (const setup of ['national', 'metro', 'regional']) {
  test(`${setup}: historical router evidence shows a Critical condition only from its detected source time`, () => {
    inventory.setActiveWanSetup(setup);
    const state = sourceState();
    const selection = { kind: 'device', id: 'XR-PE-E2' };
    const beforeArrival = render({ ...state, history: 3 }, selection);
    assert.doesNotMatch(beforeArrival, /CNC-2086|Unreachable|Detected 08:20/);
    assert.match(beforeArrival, /Reachable/);
    assert.match(definition(beforeArrival, 'Reachability source'), /08:01$/);

    const atArrival = render({ ...state, history: 9 }, selection);
    assert.match(atArrival, /CNC-2086/);
    assert.match(atArrival, /Unreachable/);

    const afterArrival = render({ ...state, history: 10 }, selection);
    assert.match(afterArrival, /CNC-2086/);
    assert.match(afterArrival, /Unreachable/);
    assert.match(text(afterArrival), /Detected 08:20 · Acknowledged by CW AI at 08:20/);

    const live = render(state, selection);
    assert.match(live, /CNC-2086/);
    assert.match(live, /Unreachable/);
    assert.match(live, /Read-only source evidence/);
  });

  test(`${setup}: historical interface evidence separates router reachability from its physical condition`, () => {
    inventory.setActiveWanSetup(setup);
    const state = sourceState();
    const port = inventory.deviceInterfaces('XR-PE-E2')[0];
    const selection = { kind: 'interface', id: port.id };
    const beforeArrival = render({ ...state, history: 3 }, selection);
    assert.match(definition(beforeArrival, 'Router reachability'), /^Reachable/);
    assert.match(beforeArrival, /Reported up/);
    assert.doesNotMatch(beforeArrival, /CNC-2086|Unreachable|physical interface fault/);

    const afterArrival = render({ ...state, history: 10 }, selection);
    assert.match(definition(afterArrival, 'Router reachability'), /^Unreachable/);
    assert.match(afterArrival, /Reported up/);
    assert.doesNotMatch(afterArrival, /CNC-2086/);
    assert.match(afterArrival, /does not establish a physical interface fault or link-down condition/);
  });

  test(`${setup}: historical device-group telemetry does not inherit a live collection gap`, () => {
    inventory.setActiveWanSetup(setup);
    const state = sourceState({ gap: 'east' });
    const preserved = structuredClone(state);
    const port = inventory.deviceInterfaces('XR-PE-E2')[0];
    const selection = { kind: 'interface', id: port.id };
    const live = render(state, selection);
    assert.match(live, /Current state unknown/);
    assert.match(live, /Last known/);
    assert.match(live, /07:50/);
    assert.match(definition(live, 'Router reachability'), /^Unreachable/);

    const historical = render({ ...state, history: 3 }, selection);
    assert.match(historical, /Historical · 08:01/);
    assert.match(historical, /Reported up/);
    assert.match(definition(historical, 'Router reachability'), /^Reachable/);
    assert.doesNotMatch(historical, /Current state unknown|[Ll]ast[ -]known|07:50/);
    assert.deepEqual(state, preserved, 'read-only evidence leaves the current source and response record intact');
  });

  test(`${setup}: live collection loss cannot replace an earlier interface or physical-link observation`, () => {
    inventory.setActiveWanSetup(setup);
    const state = sourceState({ gap: 'west' });
    const port = inventory.deviceInterfaces('XR-P1').find((item) => item.linkId === 'p1-p2');
    for (const selection of [{ kind: 'interface', id: port.id }, { kind: 'link', id: port.linkId }]) {
      const current = render(state, selection);
      assert.match(current, /73%/);
      assert.match(current, /07:58/);
      assert.match(text(current), /[Ll]ast[ -]known/);

      const historical = render({ ...state, history: 0 }, selection);
      assert.match(historical, /46%/);
      assert.match(historical, /Historical/);
      assert.match(historical, /07:55/);
      assert.doesNotMatch(historical, /73%|CNC-1042|CNC-1043|CNC-1044|[Ll]ast[ -]known|Current state unknown/);
    }
  });
}
