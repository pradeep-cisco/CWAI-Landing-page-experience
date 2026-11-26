import test from 'node:test';
import assert from 'node:assert/strict';
import { getIncidentDrawerBounds, clampIncidentDrawerWidth, incidentDrawerWidthForKey } from '../src/features/agent-centric/incident-drawer-size.js';

test('the right dock starts at a readable width while reserving page space', () => {
  const bounds = getIncidentDrawerBounds(1200, 1440);
  assert.deepEqual(bounds, { min: 320, max: 640, defaultWidth: 480 });
  assert.equal(clampIncidentDrawerWidth(540, bounds), 540);
  assert.equal(clampIncidentDrawerWidth(20, bounds), 320);
  assert.equal(clampIncidentDrawerWidth(4000, bounds), 640);
});

test('stored and dragged widths are clamped to the current content and viewport', () => {
  for (const [content, viewport] of [[800, 1024], [500, 500], [2000, 1000]]) {
    const bounds = getIncidentDrawerBounds(content, viewport);
    assert.ok(bounds.min > 0);
    assert.ok(bounds.min <= bounds.defaultWidth && bounds.defaultWidth <= bounds.max);
    assert.ok(bounds.max <= content, 'the panel cannot exceed the usable application width');
    assert.ok(bounds.max <= viewport, 'the panel cannot exceed the viewport');
    assert.ok(Math.min(content, viewport) - bounds.max >= 440, 'the remaining page keeps at least its reserved workspace width');
    assert.equal(clampIncidentDrawerWidth(1, bounds), bounds.min);
    assert.equal(clampIncidentDrawerWidth(-1, bounds), bounds.defaultWidth);
    assert.equal(clampIncidentDrawerWidth(20000, bounds), bounds.max);
    assert.equal(clampIncidentDrawerWidth(Number.NaN, bounds), bounds.defaultWidth);
    assert.equal(clampIncidentDrawerWidth(undefined, bounds), bounds.defaultWidth);
  }
});

test('keyboard resizing matches the dock’s physical left-edge handle and stops at bounds', () => {
  const bounds = getIncidentDrawerBounds(1200, 1440);
  assert.equal(incidentDrawerWidthForKey('ArrowLeft', 480, bounds), 512);
  assert.equal(incidentDrawerWidthForKey('ArrowRight', 480, bounds), 448);
  assert.equal(incidentDrawerWidthForKey('Home', 480, bounds), bounds.min);
  assert.equal(incidentDrawerWidthForKey('End', 480, bounds), bounds.max);
  assert.equal(incidentDrawerWidthForKey('ArrowLeft', bounds.max, bounds), bounds.max);
  assert.equal(incidentDrawerWidthForKey('ArrowRight', bounds.min, bounds), bounds.min);
  assert.equal(incidentDrawerWidthForKey('Escape', 480, bounds), null, 'Escape is handled by the inspection region rather than resizing');
});

test('viewport bounds account for navigation without depending on the shrinking page', () => {
  const desktop = getIncidentDrawerBounds(1440 - 136, 1440);
  assert.equal(desktop.defaultWidth, 480);
  assert.equal(desktop.max, 640);
  const compactDesktop = getIncidentDrawerBounds(907 - 136, 907);
  assert.deepEqual(compactDesktop, { min: 320, max: 331, defaultWidth: 331 });
  assert.equal(907 - 136 - compactDesktop.defaultWidth, 440);
});
