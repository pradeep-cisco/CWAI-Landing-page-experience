import test, { before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// Exercise the actual overview, rather than a second projection of the map
// model: geography must preserve the existing operational facts and controls.
let server, WanOverview, inventory, agent;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom', logLevel: 'error',
  });
  ({ default: WanOverview } = await server.ssrLoadModule('/src/features/wan/WanOverview.jsx'));
  inventory = await server.ssrLoadModule('/src/features/wan/model/scale.js');
  agent = await server.ssrLoadModule('/src/features/wan/model/agentic-model.js');
});
afterEach(() => inventory?.setActiveWanSetup('national'));
after(async () => { await server?.close(); });

const at = (frame, overrides = {}) => agent.enterAgentFrame(agent.createAgentState({
  networkContext: {
    ...inventory.MONITORING_CONTEXT,
    mainDomainLabel: inventory.domainLabel(inventory.MONITORING_CONTEXT.mainDomain),
    mainGroupLabel: inventory.groupLabel(inventory.MONITORING_CONTEXT.mainGroup),
    criticalDomainLabel: inventory.domainLabel(inventory.MONITORING_CONTEXT.criticalDomain),
  },
  ...overrides,
}), frame);
const render = state => renderToStaticMarkup(React.createElement(WanOverview, { state }));
const blocks = (html, pattern) => {
  const matches = [...html.matchAll(pattern)];
  return matches.map((match, index) => ({ id: match[1], html: html.slice(match.index, matches[index + 1]?.index ?? html.length) }));
};
const cards = html => blocks(html, /<div class="wan-map-node"[^>]*data-region="([^"]+)"/g);
const routes = html => blocks(html, /<g class="wan-world-route"[^>]*data-corridor="([^"]+)"/g);
const card = (html, id) => {
  const found = cards(html).find(item => item.id === id);
  assert.ok(found, `Missing domain card: ${id}`);
  return found.html;
};

for (const setupId of ['national', 'metro', 'regional']) {
  test(`${setupId}: world view retains every domain and inventory bundle with inspectable member counts`, () => {
    inventory.setActiveWanSetup(setupId);
    const html = render(at(0));
    assert.deepEqual(cards(html).map(item => item.id).sort(), inventory.DOMAINS.map(item => item.id).sort());
    assert.deepEqual(routes(html).map(item => item.id).sort(), inventory.BUNDLES.map(item => item.id).sort());
    for (const domain of inventory.DOMAINS) {
      const routers = inventory.domainDevices(domain.id).length.toLocaleString('en-US');
      assert.ok(card(html, domain.id).includes(`${routers} routers reachable`));
    }
    for (const bundle of inventory.BUNDLES) {
      const route = routes(html).find(item => item.id === bundle.id).html;
      assert.ok(route.includes(`${bundle.count.toLocaleString('en-US')} member link`));
      assert.match(route, /role="button" tabindex="0" aria-label="Inspect /);
      assert.match(route, /Lines show logical connectivity, not physical cable paths/);
    }
    assert.match(html, /Real world geography · Illustrative domain locations/);
    assert.match(html, /<hbr-view-switcher[^>]*value="world"/);
    assert.match(html, /<hbr-radio-button[^>]*value="schematic">Schematic/);
  });
}

test('a developing interface trend stays scoped to its observed router without inventing an incident', () => {
  const html = render(at(1));
  const main = inventory.MONITORING_CONTEXT.mainDomain;
  assert.match(card(html, main), /XR-P1 · 73%/);
  assert.match(card(html, main), /aria-label="XR-P1 outbound utilization: 73% at 07:58"/);
  assert.doesNotMatch(card(html, main), />1 incident<\/hbr-tag>/);
  for (const domain of inventory.DOMAINS.filter(item => item.id !== main)) {
    assert.doesNotMatch(card(html, domain.id).split('</hbr-card>')[0], /outbound utilization:/);
  }
});

test('running remediation preserves the active incident and source alarm on its actual connection', () => {
  const state = at(7), html = render(state);
  assert.match(card(html, inventory.MONITORING_CONTEXT.mainDomain), />1 incident<\/hbr-tag>/);
  assert.match(card(html, inventory.MONITORING_CONTEXT.mainDomain), /Above 80% limit/);
  const active = inventory.BUNDLES.filter(bundle => inventory.bundleSummary(state, bundle.id).active);
  assert.ok(active.length > 0);
  for (const bundle of active) {
    const route = routes(html).find(item => item.id === bundle.id).html;
    assert.match(route, /data-condition="major"/);
    assert.match(route, /[1-9][0-9]* active alarms?/);
  }
});

test('a source-cleared failed response remains an incident until recovery is independently verified', () => {
  for (const runOutcome of ['failed', 'unknown']) {
    const html = render(at(11, { runOutcome }));
    const main = card(html, inventory.MONITORING_CONTEXT.mainDomain).split('</hbr-card>')[0];
    assert.match(main, />1 incident<\/hbr-tag>/);
    assert.match(main, /Recovery unverified/);
    assert.doesNotMatch(main, /Recovery verified/);
  }
  const verified = card(render(at(11)), inventory.MONITORING_CONTEXT.mainDomain).split('</hbr-card>')[0];
  assert.match(verified, /Recovery verified/);
  assert.doesNotMatch(verified, />1 incident<\/hbr-tag>/);
});

test('collection loss keeps last-known facts and removes live travel from affected connections', () => {
  const state = at(7, { gap: 'west' }), html = render(state);
  const main = card(html, inventory.MONITORING_CONTEXT.mainDomain).split('</hbr-card>')[0];
  assert.match(main, /data-stale="true"/);
  assert.match(main, /Telemetry gap · Last known/);
  assert.doesNotMatch(main, /class="wan-domain-trend/);
  for (const bundle of inventory.BUNDLES) {
    const summary = inventory.bundleSummary(state, bundle.id);
    const route = routes(html).find(item => item.id === bundle.id).html.split('</g>')[0];
    if (summary.unavailable) {
      assert.match(route, /data-stale="true"/);
      assert.match(route, /members? without current observations/);
      assert.doesNotMatch(route, /class="wan-world-route-travel"/);
    }
    if (summary.active) assert.match(route, /data-condition="major"/);
  }
});

test('independent unreachable evidence survives a concurrent telemetry gap in cards and map pins', () => {
  const html = render(at(7, { critical: true, gap: 'east' }));
  const domain = inventory.MONITORING_CONTEXT.criticalDomain;
  const critical = card(html, domain).split('</hbr-card>')[0];
  assert.match(critical, /data-condition="critical"/);
  assert.match(critical, /1 router unreachable/);
  assert.match(critical, /Unreachable · Telemetry gap/);
  const pins = html.match(/<g class="wan-world-pin"[^>]+>/g) || [];
  assert.ok(pins.some(pin => pin.includes('data-condition="critical"') && pin.includes(`Open ${inventory.domainLabel(domain)} device groups`)));
});

test('opening a domain keeps the existing device-group topology instead of fabricating geographic group locations', () => {
  const domain = inventory.MONITORING_CONTEXT.mainDomain;
  const state = inventory.navigateScope(at(0), 'domain', domain);
  const html = render(state);
  const expected = inventory.DEVICE_GROUPS.filter(group => group.domain === domain).slice(0, inventory.PAGE_SIZES.groups).map(group => group.id);
  assert.deepEqual([...html.matchAll(/data-group-status="([^"]+)"/g)].map(match => match[1]), expected);
  assert.doesNotMatch(html, /class="wan-world-view"|<hbr-view-switcher/);
  assert.match(html, /All domains/);
  assert.match(html, /Cross-domain group connections/);
});
