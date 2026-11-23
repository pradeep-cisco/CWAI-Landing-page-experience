import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { COMBINED_VARIANTS } from '../src/features/combined/combined-model.js';
import { getRibbonNetwork } from '../src/features/combined/ribbon-model.js';

let server, Dashboard, Baseline, NetworkView, inventory;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  ({ default: Dashboard } = await server.ssrLoadModule('/src/features/combined/CombinedDashboard.jsx'));
  ({ default: Baseline } = await server.ssrLoadModule('/src/features/combined-baseline/CombinedDashboard.jsx'));
  ({ default: NetworkView } = await server.ssrLoadModule('/src/features/combined/CombinedNetworkView.jsx'));
  inventory = await server.ssrLoadModule('/src/features/wan/model/scale.js');
});
after(async () => { await server?.close(); });
const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));

test('every Combined branch retains the global work surface and independent source-waiting job alongside the ribbon', () => {
  for (const { id } of COMBINED_VARIANTS) {
    const html = render(Dashboard, { scene: 2, variant: id });
    for (const section of ['Network', 'Attention', 'Activity', 'Actions']) assert.match(html, new RegExp(`>${section}</h2>`), `${id}: ${section}`);
    assert.match(html, /Investigate intermittent reachability/);
    assert.match(html, /Waiting for source access/);
    assert.match(html, /Network overview view/);
  }
});

test('Combined opens on an incident with overview, paired decisions, then full-width Activity', () => {
  const html = render(Dashboard);
  const decisions = html.indexOf('class="combined-decision-row"');
  assert.ok(decisions > html.indexOf('>Network</h2>'));
  const attention = html.indexOf('id="combined-attention-title"', decisions);
  const actions = html.indexOf('id="combined-actions-title"', decisions);
  const activity = html.indexOf('id="combined-activity-title"', decisions);
  assert.ok(attention > decisions && actions > attention && activity > actions);
  assert.ok(html.includes('data-combined-arrangement="rows"'));
  assert.match(html, /INC-104|Routing intent mismatch|1 active incident/);
  assert.match(html, /hbr-progress-bar/);
  assert.ok(!/Expand network|Collapse network|combined-scope-bar|Production · All permitted domains|Illustrative domain locations|Illustrative reachability observations/.test(html), 'removed chrome must stay out of Option 3');
  for (const title of ['Restore approved routing intent', 'Check recent configuration changes', 'Investigate intermittent reachability']) {
    assert.ok(html.indexOf(title, activity) > activity, title);
  }
  assert.match(render(Baseline), />Home<\/h1>/);
});

test('execution exceptions do not render an established correction or erase their actual issued state', () => {
  for (const variant of ['unknown', 'partial', 'capability']) {
    const html = render(Dashboard, { variant });
    assert.match(html, /Controller execution acknowledged/);
    assert.doesNotMatch(html, />Routing intent restored</);
    assert.match(html, /Review configuration response|Execution status unknown|Partial result needs reconciliation|Verification unavailable/);
  }
});

test('interrupted observations stay last-known while the preserved baseline has no network ribbon', () => {
  const interrupted = render(Dashboard, { variant: 'offline' });
  assert.match(interrupted, /Last-known network/);
  assert.match(interrupted, /08:05:20 UTC/);
  assert.match(interrupted, /Live updates interrupted/);
  const baseline = render(Baseline, { scene: 2 });
  assert.doesNotMatch(baseline, /Expand network|Logical domain overview/);
  assert.match(baseline, /Review configuration response/);
  assert.match(baseline, /Waiting for source access/);
});

test('Combined uses the Operations world and routed-card renderers without inheriting its active WAN inventory', () => {
  const network = getRibbonNetwork({ scene: 2, sourceState: 'current' });
  inventory.setActiveWanSetup('metro');
  try {
    const world = render(NetworkView, { network, mode: 'world', selectedScope: { kind: 'domain', id: 'Core' } });
    assert.match(world, /class="wan-world-svg"/);
    assert.match(world, /class="wan-world-pin-halo"/);
    assert.match(world, /class="wan-world-pin-label"/);
    assert.match(world, /Highlight Core related work/);
    assert.match(world, /aria-pressed="true"/);
    assert.ok(world.includes('Observed reachable. XR-R07 responded'), 'Core pin retains its representative observation');
    assert.doesNotMatch(world, /wan-world-route-travel/);
    assert.doesNotMatch(world, />Transport</);
    const schematic = render(NetworkView, { network, mode: 'schematic' });
    assert.match(schematic, /class="wan-map-routes"/);
    assert.equal([...schematic.matchAll(/class="wan-map-node"/g)].length, 6);
    assert.match(schematic, /Core exchange/);
    assert.match(schematic, /XR-R07/);
    assert.match(schematic, /View connections/);
  } finally { inventory.setActiveWanSetup('national'); }
});

test('compact World keeps a domain without geographic placement inspectable rather than inventing its location', () => {
  const network = getRibbonNetwork({ scene: 2, sourceState: 'current' });
  network.domains.push({ ...network.domains[0], id: 'Unplaced', label: 'Unplaced', groups: [] });
  network.connections.push({ id: 'Core-Unplaced', from: 'Core', to: 'Unplaced', label: 'Core–Unplaced logical connection' });
  const html = render(NetworkView, { network, mode: 'world', expanded: false });
  assert.match(html, /data-region="Unplaced"/);
  assert.match(html, /without a geographic placement/);
  assert.match(html, /No location is inferred/);
  assert.doesNotMatch(html, /Highlight Unplaced related work\. Illustrative location/);
});
