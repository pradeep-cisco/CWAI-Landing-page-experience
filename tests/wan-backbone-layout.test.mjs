import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutBackbone} from '../src/features/wan/model/backbone-layout.js';

const hints = [[0, 1], [1, 1], [2, 1], [1, 0], [1, 2], [2, 2]];
const domains = ['West', 'Core', 'East', 'North', 'South', 'Metro'].map((id, i) =>
  ({id, label: id, pops: i + 2, devices: (i + 2) * 40, layout: hints[i]}));
const bundles = [
  ['West', 'Core', 128], ['Core', 'East', 96], ['West', 'North', 64], ['North', 'Core', 80],
  ['Core', 'South', 112], ['South', 'Metro', 64], ['East', 'Metro', 96], ['North', 'East', 48], ['West', 'South', 48],
].map(([from, to, count], i) => ({id: `connection-${i}`, from, to, count}));
const EPSILON = 1e-6;
const close = (a, b) => Math.abs(a - b) < EPSILON;
const bounds = node => ({left: node.x - node.width / 2, right: node.x + node.width / 2,
  top: node.y - node.height / 2, bottom: node.y + node.height / 2});

function isBoundaryPoint(point, node) {
  const r = bounds(node), [x, y] = point;
  return x >= r.left - EPSILON && x <= r.right + EPSILON && y >= r.top - EPSILON && y <= r.bottom + EPSILON &&
    (close(x, r.left) || close(x, r.right) || close(y, r.top) || close(y, r.bottom));
}

function crossesInterior(a, b, node) {
  const r = bounds(node);
  if (close(a[0], b[0])) return a[0] > r.left + EPSILON && a[0] < r.right - EPSILON &&
    Math.max(a[1], b[1]) > r.top + EPSILON && Math.min(a[1], b[1]) < r.bottom - EPSILON;
  assert.ok(close(a[1], b[1]), 'routes use orthogonal segments');
  return a[1] > r.top + EPSILON && a[1] < r.bottom - EPSILON &&
    Math.max(a[0], b[0]) > r.left + EPSILON && Math.min(a[0], b[0]) < r.right - EPSILON;
}

function assertSoundGeometry(layout) {
  assert.ok(Number.isFinite(layout.height) && layout.height > 0);
  const ids = new Set(layout.nodes.map(node => node.id));
  assert.equal(ids.size, layout.nodes.length);
  for (const node of layout.nodes) {
    const r = bounds(node);
    assert.ok(r.left >= -EPSILON && r.right <= layout.width + EPSILON, `${node.id} fits width ${layout.width}`);
    assert.ok(r.top >= -EPSILON && r.bottom <= layout.height + EPSILON, `${node.id} fits height ${layout.height}`);
    for (const other of layout.nodes) {
      if (other === node) continue;
      const s = bounds(other);
      assert.ok(r.right <= s.left || r.left >= s.right || r.bottom <= s.top || r.top >= s.bottom,
        `${node.id} and ${other.id} cannot overlap`);
    }
  }
  const endpoints = new Map();
  for (const corridor of layout.corridors) {
    assert.ok(ids.has(corridor.from) && ids.has(corridor.to));
    assert.ok(corridor.points.length >= 2);
    for (const [x, y] of [...corridor.points, corridor.label]) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      assert.ok(x >= -EPSILON && x <= layout.width + EPSILON);
      assert.ok(y >= -EPSILON && y <= layout.height + EPSILON);
    }
    for (const [id, point] of [[corridor.from, corridor.points[0]], [corridor.to, corridor.points.at(-1)]]) {
      assert.ok(isBoundaryPoint(point, layout.nodes.find(node => node.id === id)), `${corridor.id} terminates on ${id}`);
      if (!endpoints.has(id)) endpoints.set(id, []);
      assert.ok(!endpoints.get(id).some(other => close(point[0], other[0]) && close(point[1], other[1])),
        `${id} has distinct connection ports`);
      endpoints.get(id).push(point);
    }
    corridor.points.slice(1).forEach((point, i) => {
      for (const node of layout.nodes) assert.equal(crossesInterior(corridor.points[i], point, node), false,
        `${corridor.id} cannot cross ${node.id}`);
    });
  }
}

function geometry(layout) {
  return {width: layout.width, height: layout.height, cardWidth: layout.cardWidth, cardHeight: layout.cardHeight,
    nodes: layout.nodes.map(({x, y, width, height}) => ({x, y, width, height})),
    corridors: layout.corridors.map(({points, label}) => ({points, label}))};
}

test('the ordered six-group fixture uses readable cards, clear corridors, and exact real connection membership', () => {
  for (const width of [640, 736, 1000, 1600]) {
    const result = layoutBackbone({domains, bundles, width});
    assertSoundGeometry(result);
    assert.equal(result.columns, 3);
    assert.equal(result.height, 396);
    assert.equal(result.cardHeight, 92);
    assert.ok(result.cardWidth >= 140 && result.cardWidth <= 180);
    assert.deepEqual(result.nodes.map(node => node.id), domains.map(domain => domain.id));
    assert.deepEqual(result.corridors.map(({id, from, to, count}) => ({id, from, to, count})), bundles);
    assert.equal(result.offPageBundleCount, 0);
    const west = result.nodes.find(node => node.id === 'West'), core = result.nodes.find(node => node.id === 'Core');
    assert.ok(bounds(core).left - bounds(west).right >= 72 - EPSILON, 'the connection metric fits between cards');
    for (const corridor of result.corridors) {
      const badge = {left: corridor.label[0] - 26, right: corridor.label[0] + 26,
        top: corridor.label[1] - 13, bottom: corridor.label[1] + 13};
      for (const node of result.nodes) {
        const r = bounds(node);
        assert.ok(badge.right <= r.left || badge.left >= r.right || badge.bottom <= r.top || badge.top >= r.bottom,
          `${corridor.id} has space for its metric badge`);
      }
    }
  }
});

test('renaming every domain and connection leaves geometry identical', () => {
  const renamed = new Map(domains.map((domain, i) => [domain.id, `Administrative group ${i + 1}`]));
  const renamedDomains = domains.map(domain => ({...domain, id: renamed.get(domain.id), label: `Different label ${domain.devices}`}));
  const renamedBundles = bundles.map((bundle, i) => ({...bundle, id: `Renamed edge ${i}`, from: renamed.get(bundle.from), to: renamed.get(bundle.to)}));
  for (const width of [260, 280, 360, 579, 580, 1000]) {
    assert.deepEqual(geometry(layoutBackbone({domains: renamedDomains, bundles: renamedBundles, width})),
      geometry(layoutBackbone({domains, bundles, width})));
  }
});

test('focus preserves every anchor, port, route topology, label, and card dimension', () => {
  for (const width of [260, 280, 420, 580, 1000]) {
    const expanded = layoutBackbone({domains, bundles, width});
    const compact = layoutBackbone({domains, bundles, width, compact: true});
    assert.equal(compact.compact, true);
    assert.deepEqual(geometry(compact), geometry(expanded));
  }
});

test('a Core group is optional and removing it never invents replacement links', () => {
  const withoutCore = domains.filter(domain => domain.id !== 'Core');
  const actualBundles = bundles.filter(bundle => ![bundle.from, bundle.to].includes('Core'));
  const result = layoutBackbone({domains: withoutCore, bundles: actualBundles, width: 900});
  assertSoundGeometry(result);
  assert.deepEqual(result.nodes.map(node => node.id), withoutCore.map(domain => domain.id));
  assert.deepEqual(result.corridors.map(corridor => corridor.id), actualBundles.map(bundle => bundle.id));
  assert.equal(result.invalidBundles.length, 0);
  const dangling = layoutBackbone({domains: withoutCore, bundles, width: 900});
  assert.equal(dangling.invalidBundles.length, bundles.length - actualBundles.length);
  assert.ok(dangling.invalidBundles.every(bundle => bundle.missing.includes('Core')));
  assert.equal(dangling.corridors.length + dangling.invalidBundles.length, bundles.length);
});

test('responsive layouts keep cards in bounds and all actual connections inspectable', () => {
  for (const width of [96, 180, 260, 279, 280, 320, 420, 579, 580, 639, 640, 1600]) {
    const result = layoutBackbone({domains, bundles, width});
    assertSoundGeometry(result);
    assert.equal(result.columns, width < 280 ? 1 : width < 640 ? 2 : 3);
    assert.equal(result.cardHeight, width < 640 ? 104 : 92);
    if (width >= 280 && width < 640) assert.equal(result.height, 416);
    if (width >= 280) assert.ok(result.cardWidth >= 126);
    assert.equal(result.corridors.length, bundles.length);
    assert.equal(result.nodes.length, domains.length);
  }
});

test('arbitrary disconnected graphs use a stable grid without implied adjacency links', () => {
  const groups = Array.from({length: 11}, (_, i) => ({id: `Tenant ${i}`, label: `Custom grouping ${i}`, pops: i, devices: i * 20}));
  const connections = [
    {id: 'first-to-last', from: groups[0].id, to: groups[10].id, count: 5},
    {id: 'reverse-long', from: groups[8].id, to: groups[1].id, count: 3},
    {id: 'within-row', from: groups[3].id, to: groups[5].id, count: 8},
    {id: 'parallel-one', from: groups[0].id, to: groups[2].id, count: 12},
    {id: 'parallel-two', from: groups[0].id, to: groups[2].id, count: 9},
    {id: 'self-connection', from: groups[7].id, to: groups[7].id, count: 1},
  ];
  for (const width of [260, 280, 420, 580, 1200]) {
    const result = layoutBackbone({domains: groups, bundles: connections, width});
    assertSoundGeometry(result);
    assert.deepEqual(result.corridors.map(({id, from, to, count}) => ({id, from, to, count})), connections);
    assert.deepEqual(result.nodes.map(node => node.id), groups.map(group => group.id));
    assert.deepEqual(geometry(result), geometry(layoutBackbone({domains: groups, bundles: connections, width})));
  }
  const isolated = layoutBackbone({domains: groups, bundles: [], width: 1000});
  assert.equal(isolated.nodes.length, groups.length);
  assert.deepEqual(isolated.corridors, []);
});

test('many domains remain bounded while off-page connection identities and counts reconcile', () => {
  const groups = Array.from({length: 103}, (_, i) => ({id: `Group ${i}`, pops: 2, devices: 20}));
  const connections = groups.slice(1).map((group, i) => ({id: `edge-${i}`, from: groups[i].id, to: group.id, count: i + 1}));
  const allCounts = connections.reduce((sum, connection) => sum + connection.count, 0);
  for (const page of [0, 1, 8, 999]) {
    const result = layoutBackbone({domains: groups, bundles: connections, width: 900, page});
    assertSoundGeometry(result);
    assert.ok(result.nodes.length <= 12);
    assert.ok(result.height <= 528);
    assert.equal(result.pages, 9);
    assert.equal(result.page, Math.min(page, 8));
    assert.equal(result.total, groups.length);
    assert.equal(result.omitted + result.nodes.length, groups.length);
    assert.equal(result.start, result.page * 12 + 1);
    assert.equal(result.end, Math.min(groups.length, (result.page + 1) * 12));
    assert.deepEqual(result.nodes.map(node => node.id), groups.slice(result.start - 1, result.end).map(group => group.id));
    assert.equal(result.corridors.length + result.offPageBundles.length, connections.length);
    assert.equal(result.offPageBundleCount, result.offPageBundles.length);
    assert.equal(result.corridors.reduce((sum, connection) => sum + connection.count, 0) + result.offPageLinkCount, allCounts);
    const accounted = [...result.corridors, ...result.offPageBundles].map(({id, from, to, count}) => ({id, from, to, count}));
    assert.deepEqual(accounted.sort((a, b) => a.id.localeCompare(b.id)), [...connections].sort((a, b) => a.id.localeCompare(b.id)));
    for (const connection of result.offPageBundles) {
      assert.ok(connection.offPage.length >= 1);
      assert.deepEqual([...connection.visible, ...connection.offPage].sort(), [connection.from, connection.to].sort());
      assert.ok(connection.visible.every(id => result.visibleDomainIds.includes(id)));
      assert.ok(connection.offPage.every(id => !result.visibleDomainIds.includes(id)));
    }
  }
  assert.equal(layoutBackbone({domains: groups, bundles: connections, width: 900, pageSize: 1000}).nodes.length, 12);
});

test('partial or conflicting layout hints are bounded and never lose domain membership', () => {
  const groups = Array.from({length: 12}, (_, i) => ({id: `Custom ${i}`, layout: i < 3 ? [1, 1] : [1000, i * 1000]}));
  const result = layoutBackbone({domains: groups, bundles: [], width: 1000});
  assertSoundGeometry(result);
  assert.equal(result.nodes.length, groups.length);
  assert.ok(result.height <= 528);
});

test('layout is pure and empty input has truthful paging and no synthetic connection', () => {
  const inputs = JSON.stringify({domains, bundles});
  domains.forEach(Object.freeze); bundles.forEach(Object.freeze);
  layoutBackbone({domains: Object.freeze([...domains]), bundles: Object.freeze([...bundles]), width: 900});
  assert.equal(JSON.stringify({domains, bundles}), inputs);
  const empty = layoutBackbone({domains: [], bundles: [], width: 400, page: 200});
  assert.equal(empty.page, 0); assert.equal(empty.pages, 1); assert.equal(empty.total, 0);
  assert.equal(empty.start, 0); assert.equal(empty.end, 0); assert.equal(empty.omitted, 0);
  assert.deepEqual(empty.nodes, []); assert.deepEqual(empty.corridors, []); assert.deepEqual(empty.offPageBundles, []);
  assert.equal(empty.invalidBundles.length, 0);
});
