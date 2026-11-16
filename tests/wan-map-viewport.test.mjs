import test from 'node:test';
import assert from 'node:assert/strict';
import { MIN_MAP_SCALE, MAX_MAP_SCALE, clampViewport, zoomAt, panBy, fitMapViewport } from '../src/features/wan/model/map-viewport.js';

const size = { width: 800, height: 520 };
const fit = { x: 0, y: 0, scale: 1 };
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≈ ${expected}`);
const sourcePoint = (point, view) => ({ x: (point.x - view.x) / view.scale, y: (point.y - view.y) / view.scale });

test('zoom preserves the world point under the cursor, including off-center anchors', () => {
  const anchor = { x: 215, y: 170 };
  const view = { x: -90, y: -60, scale: 1.4 };
  const before = sourcePoint(anchor, view);
  const zoomed = zoomAt(view, 1.35, anchor, size);
  const after = sourcePoint(anchor, zoomed);
  near(after.x, before.x);
  near(after.y, before.y);
  near(zoomed.scale, 1.89);
  const restored = zoomAt(zoomed, 1 / 1.35, anchor, size);
  near(restored.x, view.x);
  near(restored.y, view.y);
  near(restored.scale, view.scale);
});

test('button zoom defaults to the center and has bounded scale at both limits', () => {
  assert.deepEqual(zoomAt(fit, 2, null, size), { x: -400, y: -260, scale: 2 });
  const maximum = zoomAt(fit, 100, null, size);
  assert.equal(maximum.scale, MAX_MAP_SCALE);
  assert.deepEqual(zoomAt(maximum, 100, null, size), maximum);
  assert.deepEqual(zoomAt(maximum, .001, null, size), fit);
  assert.equal(MIN_MAP_SCALE, 1);
});

test('panning cannot expose empty space outside the fitted canvas', () => {
  const zoomed = zoomAt(fit, 2, null, size);
  assert.deepEqual(panBy(zoomed, 1000, 1000, size), { x: 0, y: 0, scale: 2 });
  assert.deepEqual(panBy(zoomed, -1000, -1000, size), { x: -800, y: -520, scale: 2 });
  assert.deepEqual(panBy(fit, 100, -100, size), fit);
  assert.deepEqual(panBy(zoomed, 24, -36, size), { x: -376, y: -296, scale: 2 });
});

test('resizing constrains the old view to the new canvas and fit always resets pan', () => {
  assert.deepEqual(clampViewport({ x: -1400, y: -800, scale: 3 }, { width: 390, height: 180 }), { x: -780, y: -360, scale: 3 });
  assert.deepEqual(clampViewport({ x: -1400, y: -800, scale: 1 }, size), fit);
  const resized = clampViewport({ x: -600, y: -300, scale: 2 }, { width: 1600, height: 900 });
  assert.deepEqual(resized, { x: -600, y: -300, scale: 2 });
});

test('invalid input never produces nonfinite viewports or phantom movement', () => {
  for (const value of [undefined, null, {}, { x: NaN, y: Infinity, scale: NaN }, { x: '100', y: null, scale: '2' }]) {
    assert.deepEqual(clampViewport(value, size), fit);
  }
  for (const factor of [NaN, Infinity, 0, -3, '2', null]) assert.deepEqual(zoomAt(fit, factor, null, size), fit);
  assert.deepEqual(panBy({ x: -400, y: -260, scale: 2 }, NaN, Infinity, size), { x: -400, y: -260, scale: 2 });
  assert.deepEqual(clampViewport({ x: -100, y: 100, scale: 2 }, { width: NaN, height: -1 }), { x: 0, y: 0, scale: 2 });
  assert.deepEqual(zoomAt(fit, 2, { x: NaN, y: Infinity }, size), { x: -400, y: -260, scale: 2 });
});

test('the desktop geographic fit uses the same scale on both axes', () => {
  assert.deepEqual(fitMapViewport(800, 520, { x: 0, y: 0, width: 1000, height: 650 }), { x: 0, y: 0, scale: .8 });
  const square = fitMapViewport(600, 600, { x: 0, y: 0, width: 1000, height: 650 });
  assert.deepEqual(square, { x: 0, y: 105, scale: .6 });
});

test('the compact geographic fit includes its source origin and centers letterboxing', () => {
  const bounds = { x: 0, y: 140, width: 1000, height: 425 };
  const fitted = fitMapViewport(310, 180, bounds);
  near(fitted.scale, .31);
  near(bounds.y * fitted.scale + fitted.y, (180 - 425 * .31) / 2);
  near((bounds.x + bounds.width / 2) * fitted.scale + fitted.x, 155);
  for (const invalid of [[0, 100, bounds], [100, NaN, bounds], [100, 100, {}], [100, 100, { width: -1, height: 30 }]]) {
    assert.deepEqual(fitMapViewport(...invalid), { x: 0, y: 0, scale: 1 });
  }
  assert.deepEqual(fitMapViewport(100, 100, { width: Number.MIN_VALUE, height: Number.MIN_VALUE }), { x: 0, y: 0, scale: 1 });
});
