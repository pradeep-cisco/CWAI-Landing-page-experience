import test from 'node:test';
import assert from 'node:assert/strict';
import { createWanSetup, WAN_SETUPS } from '../src/features/wan/model/wan-setups.js';
import { WIDTH, HEIGHT, LAND, LAND_META, projectLonLat, buildWorldLayout } from '../src/features/wan/model/world-map.js';

const rings = LAND.flatMap(path => path.split('M').filter(Boolean).map(ring => ring.replace(/Z$/, '').split('L').map(pair => pair.split(',').map(Number))));
function insideLand(coordinates) {
  const point = projectLonLat(coordinates);
  return rings.some(ring => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[i], [bx, by] = ring[j];
      if ((ay > point.y) !== (by > point.y) && point.x < (bx - ax) * (point.y - ay) / (by - ay) + ax) inside = !inside;
    }
    return inside;
  });
}

test('world geography comes from the public-domain Natural Earth source and retains all inhabited continents', () => {
  assert.equal(LAND_META.source, 'Natural Earth 1:110m land');
  assert.equal(LAND_META.license, 'Public domain');
  assert.match(LAND_META.sourceUrl, /nvkelso\/natural-earth-vector/);
  assert.equal(LAND_META.sourceSha256, '9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9');
  assert.ok(LAND.length > 100);
  assert.ok(LAND_META.coordinateCount > 4000);
  for (const [continent, coordinates] of [
    ['North America', [-100, 40]], ['South America', [-60, -10]],
    ['Africa', [20, 0]], ['Europe', [15, 50]], ['Asia', [100, 40]],
    ['Australia', [134, -25]], ['Greenland', [-42, 72]],
  ]) assert.ok(insideLand(coordinates), `${continent} remains in its actual geographic location`);
  assert.equal(insideLand([-140, 0]), false, 'central Pacific is not invented land');
  assert.equal(insideLand([0, -40]), false, 'South Atlantic is not invented land');
});

test('equirectangular projection preserves geographic order, equal angular scale and valid map extent', () => {
  const west = projectLonLat([-118, 34]), europe = projectLonLat([4, 49]), east = projectLonLat([139, 36]);
  assert.ok(west.x < europe.x && europe.x < east.x);
  assert.ok(projectLonLat([10, 59]).y < europe.y);
  assert.ok(projectLonLat([25, -29]).y > europe.y);
  assert.equal(projectLonLat([-180, 84]).x, 30);
  assert.equal(projectLonLat([180, 84]).x, 970);
  const deltaX = projectLonLat([1, 0]).x - projectLonLat([0, 0]).x;
  const deltaY = projectLonLat([0, 0]).y - projectLonLat([0, 1]).y;
  assert.ok(Math.abs(deltaX - deltaY) < 1e-10);
  for (const invalid of [null, [], [0], ['0', 0], [NaN, 0], [Infinity, 0], [181, 0], [0, 85], [0, -61]]) assert.equal(projectLonLat(invalid), null);
});

test('the coastline contains finite projected coordinates and omits Antarctic polygons', () => {
  assert.equal(LAND_META.omittedAntarcticPolygons, 8);
  assert.ok(LAND_META.includedLatitudeExtent[0] > -60);
  for (const ring of rings) {
    assert.ok(ring.length >= 4);
    for (const [x, y] of ring) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      assert.ok(x >= 29.99 && x <= 970.01 && y >= 159.99 && y < 537);
    }
    for (let i = 1; i < ring.length; i++) assert.ok(Math.abs(ring[i][0] - ring[i - 1][0]) < WIDTH / 2, 'no spurious coastline closes across the world');
  }
});

for (const setup of WAN_SETUPS) {
  test(`${setup.label}: geography keeps actual bundle membership and stable, separated domain cards`, () => {
    const fixture = createWanSetup(setup.id);
    const before = JSON.stringify({ domains: fixture.domains, bundles: fixture.bundles });
    const layout = buildWorldLayout(fixture.domains, fixture.bundles, setup.id);
    assert.equal(layout.width, WIDTH);
    assert.equal(layout.height, HEIGHT);
    assert.equal(layout.illustrative, true);
    assert.equal(layout.nodes.length, fixture.domains.length);
    assert.equal(layout.unplaced.length, 0);
    assert.equal(layout.unmappedRoutes.length, 0);
    assert.deepEqual(layout.routes.map(route => route.id), fixture.bundles.map(bundle => bundle.id));
    for (const route of layout.routes) {
      const original = fixture.bundles.find(bundle => bundle.id === route.id);
      assert.equal(route.count, original.count);
      assert.deepEqual(route.linkIds, original.linkIds);
      assert.equal(route.from, original.from);
      assert.equal(route.to, original.to);
      assert.match(route.d, /^M [-\d.]+ [-\d.]+ C /);
      assert.doesNotMatch(route.d, /NaN|Infinity/);
      assert.ok(Number.isFinite(route.midpoint.x) && Number.isFinite(route.midpoint.y));
    }
    for (let i = 0; i < layout.nodes.length; i++) {
      const a = layout.nodes[i];
      assert.equal(a.locationSource, 'illustrative');
      assert.ok(a.x - a.width / 2 >= 0 && a.x + a.width / 2 <= WIDTH);
      assert.ok(a.y - a.height / 2 >= 0 && a.y + a.height / 2 <= HEIGHT);
      assert.deepEqual(a.anchor, projectLonLat(a.coordinates));
      for (let j = i + 1; j < layout.nodes.length; j++) {
        const b = layout.nodes[j];
        assert.ok(Math.abs(a.x - b.x) >= (a.width + b.width) / 2 || Math.abs(a.y - b.y) >= (a.height + b.height) / 2, `${a.id}/${b.id} cards do not overlap`);
      }
    }
    const reordered = buildWorldLayout([...fixture.domains].reverse(), [...fixture.bundles].reverse(), setup.id);
    assert.deepEqual(new Map(layout.nodes.map(({ id, x, y }) => [id, [x, y]])), new Map(reordered.nodes.map(({ id, x, y }) => [id, [x, y]])));
    assert.deepEqual(new Map(layout.routes.map(({ id, d }) => [id, d])), new Map(reordered.routes.map(({ id, d }) => [id, d])));
    assert.equal(JSON.stringify({ domains: fixture.domains, bundles: fixture.bundles }), before, 'source inventory is not mutated');
  });
}

test('Core is a logical multi-location domain rather than an invented single site', () => {
  const fixture = createWanSetup('national');
  const core = buildWorldLayout(fixture.domains, fixture.bundles, 'national').nodes.find(node => node.id === 'Core');
  assert.equal(core.multiRegion, true);
  assert.equal(core.anchors.length, 3);
  assert.ok(core.anchors[0].x < core.anchors[1].x && core.anchors[1].x < core.anchors[2].x);
  assert.match(core.locationLabel, /several locations/);
  assert.equal(new Set(core.anchors.map(point => `${point.x},${point.y}`)).size, 3);
});

test('unmapped domains and their actual connections remain explicit without inferred geography', () => {
  const domains = [{ id: 'West', label: 'A known fixture domain' }, { id: 'Custom', label: 'Tokyo by name is not a location source' }];
  const edges = [{ id: 'real-source-edge', from: 'West', to: 'Custom', count: 7, linkIds: ['one'] }];
  const layout = buildWorldLayout(domains, edges, 'national');
  assert.deepEqual(layout.nodes.map(node => node.id), ['West']);
  assert.deepEqual(layout.unplaced.map(node => node.id), ['Custom']);
  assert.equal(layout.unplaced[0].coordinates, undefined);
  assert.equal(layout.routes.length, 0);
  assert.equal(layout.unmappedRoutes[0].count, 7);
  assert.equal(layout.unmappedRoutes[0].id, 'real-source-edge');
  const unknown = buildWorldLayout(domains, edges, 'new-setup');
  assert.equal(unknown.nodes.length, 0);
  assert.equal(unknown.unplaced.length, 2);
  assert.equal(unknown.unmappedRoutes.length, 1);
});

test('duplicate inventory identities are rejected instead of overlapping silently', () => {
  assert.throws(() => buildWorldLayout([{ id: 'West' }, { id: 'West' }]), /domain IDs must be unique/);
  assert.throws(() => buildWorldLayout([], [{ id: 'same' }, { id: 'same' }]), /bundle IDs must be unique/);
  assert.deepEqual(buildWorldLayout().nodes, []);
});
