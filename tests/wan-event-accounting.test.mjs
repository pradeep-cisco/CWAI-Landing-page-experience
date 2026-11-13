import test from 'node:test';
import assert from 'node:assert/strict';
import { createState } from '../src/features/wan/model/model.js';
import { eventCoverage } from '../src/features/wan/model/event-accounting.js';
import { WAN_SETUPS, MONITORING_CONTEXT, setActiveWanSetup, findDevice, domainLabel } from '../src/features/wan/model/scale.js';

const at = (frame, overrides = {}) => ({ ...createState(), frame, networkContext: { ...MONITORING_CONTEXT }, ...overrides });

test('every related source alarm remains accounted for under its supported interface case', () => {
  const coverage = eventCoverage(at(7, { related: true }));
  assert.deepEqual(coverage.events.map(event => event.id), ['CNC-1042', 'CNC-1043', 'CNC-1044']);
  assert.equal(coverage.total, 3);
  assert.equal(coverage.activeTotal, 3);
  assert.equal(coverage.linked.length, 3);
  assert.deepEqual([...new Set(coverage.linked.map(event => event.caseId))], ['interface']);
  assert.equal(coverage.pending.length, 0);
  assert.equal(coverage.linked.find(event => event.id === 'CNC-1044').target.id, 'XR-P2:HundredGigE0/0/0/1');
});

test('independent Critical reachability stays attached to its own device case', () => {
  const coverage = eventCoverage(at(7, { critical: true, related: true, criticalDetected: '08:01' }));
  const device = coverage.events.find(event => event.id === 'CNC-2086');
  assert.equal(coverage.total, 4);
  assert.equal(device.caseId, 'device');
  assert.deepEqual(device.target, { kind: 'device', id: 'XR-PE-E2' });
  assert.equal(device.time, '08:01');
  assert.equal(device.owner, 'CW AI');
  assert.equal(device.active, true);
});

test('source clearance preserves event evidence without presenting a cleared event as active', () => {
  const coverage = eventCoverage(at(11, { related: true }));
  assert.equal(coverage.total, 3);
  assert.equal(coverage.activeTotal, 0);
  assert.equal(coverage.linked.length, 3);
  for (const event of coverage.events) {
    assert.equal(event.active, false);
    assert.equal(event.detectedAt, '08:00');
    assert.equal(event.clearedAt, '08:30');
    assert.equal(event.time, '08:30');
    assert.equal(event.sourceState, 'Source-cleared');
  }
});

test('unclassified events stay agent-owned and visible without an invented cause or case', () => {
  const coverage = eventCoverage(at(4, { unclassifiedEvent: true }));
  const event = coverage.pending.find(item => item.id === 'CNC-3110');
  assert.equal(coverage.total, 2);
  assert.equal(event.caseId, null);
  assert.equal(event.owner, 'CW AI');
  assert.equal(event.source, 'Syslog');
  assert.equal(event.time, '08:03');
  assert.deepEqual(event.target, { kind: 'device', id: 'XR-P3' });
  assert.match(event.dispositionReason, /No incident association or cause is established/);
});

test('arbitrary received source events are retained and only supported explicit associations are linked', () => {
  const coverage = eventCoverage(at(7, { sourceEvents: [
    { id: 'NEW-1', title: 'New event', source: 'Router log', time: '08:09' },
    { id: 'NEW-2', title: 'Explicit collection association', caseId: 'monitoring', target: { kind: 'device', id: 'XR-P3' } },
    { id: 'NEW-3', title: 'Unrecognized association', caseId: 'unavailable-case' },
  ] }));
  assert.equal(coverage.total, 4);
  assert.deepEqual(coverage.pending.map(event => event.id), ['NEW-1', 'NEW-3']);
  assert.equal(coverage.linked.find(event => event.id === 'NEW-2').caseId, 'monitoring');
  assert.deepEqual(coverage.pending[0].target, { kind: 'event', id: 'NEW-1' });
  assert.equal(coverage.pending[0].scope, 'Scope not yet established');
  assert.equal(coverage.pending[0].time, '08:09');
});

test('expected or suppressed events require an explicit reason and remain in the ledger', () => {
  const coverage = eventCoverage(at(0, { sourceEvents: [
    { id: 'MAINT-1', disposition: 'expected', dispositionReason: 'Declared maintenance CHG-9 includes this test signal.' },
    { id: 'MAINT-2', suppressed: true, suppressionReason: 'Duplicate syslog replay confirmed by source sequence.' },
    { id: 'UNEXPLAINED', disposition: 'expected' },
    { id: 'UNEXPLAINED-2', suppressed: true, reason: '  ' },
  ] }));
  assert.equal(coverage.total, 4);
  assert.deepEqual(coverage.expected.map(event => event.id), ['MAINT-1', 'MAINT-2']);
  assert.deepEqual(coverage.pending.map(event => event.id), ['UNEXPLAINED', 'UNEXPLAINED-2']);
  assert.match(coverage.pending[0].dispositionReason, /reason is not recorded/);
});

test('restored device source evidence remains discoverable independently of the interface result', () => {
  const coverage = eventCoverage(at(10, { agentic: { deviceRecord: { startedAt: '08:01', clearedAt: '08:20' } } }));
  const device = coverage.events.find(event => event.id === 'CNC-2086');
  assert.equal(device.active, false);
  assert.equal(device.caseId, 'device');
  assert.equal(device.detectedAt, '08:01');
  assert.equal(device.time, '08:20');
  assert.equal(device.source, 'Independent reachability checks');
});

test('coverage is pure, keeps current-watch scope during historical inspection and owns returned targets', () => {
  const state = at(11, { history: 1, sourceEvents: [{ id: 'NEW', target: { kind: 'device', id: 'XR-P3' }, active: false }] });
  const copy = structuredClone(state);
  const coverage = eventCoverage(state);
  assert.deepEqual(state, copy);
  assert.deepEqual(coverage, eventCoverage({ ...state, history: null }));
  coverage.events.find(event => event.id === 'NEW').target.id = 'changed';
  assert.equal(state.sourceEvents[0].target.id, 'XR-P3');
  assert.equal(eventCoverage(state).events.find(event => event.id === 'NEW').target.id, 'XR-P3');
});

test('repeated source identities update one event and do not duplicate UI identities', () => {
  const coverage = eventCoverage(at(7, { sourceEvents: [
    { id: 'LOG-1', title: 'Initial observation', time: '08:07' },
    { id: 'LOG-1', title: 'Updated observation', time: '08:09' },
  ] }));
  assert.equal(coverage.events.filter(event => event.id === 'LOG-1').length, 1);
  assert.equal(coverage.events.find(event => event.id === 'LOG-1').title, 'Updated observation');
  assert.equal(coverage.events.find(event => event.id === 'LOG-1').time, '08:09');
});

test('received events without IDs are retained even when a supplied ID resembles an assigned identity', () => {
  const coverage = eventCoverage(at(0, { sourceEvents: [
    { title: 'Unidentified source record' },
    { id: 'source-event-1', title: 'Explicit source record' },
    { title: 'Another unidentified record' },
  ] }));
  assert.equal(coverage.total, 3);
  assert.equal(new Set(coverage.events.map(event => event.id)).size, 3);
  assert.equal(coverage.pending.length, 3);
});

test('an inactive supplied event never borrows a future known-interface clearance time', () => {
  const coverage = eventCoverage(at(7, { sourceEvents: [
    { id: 'CNC-1042', active: false, time: '08:09' },
  ] }));
  const event = coverage.events.find(item => item.id === 'CNC-1042');
  assert.equal(event.time, '08:09');
  assert.equal(event.clearedAt, null);
  assert.equal(event.sourceState, 'Source-reported inactive');
});

for (const setup of WAN_SETUPS) {
  test(`${setup.label}: event targets and scope resolve from the selected WAN inventory`, () => {
    try {
      setActiveWanSetup(setup.id);
      const coverage = eventCoverage(at(7, { related: true, critical: true, unclassifiedEvent: true }));
      for (const event of coverage.events) {
        const router = event.target.kind === 'interface' ? event.target.id.split(':')[0] : event.target.id;
        const device = findDevice(router);
        assert.ok(device, event.id);
        assert.match(event.scope, new RegExp(domainLabel(device.domain)));
      }
    } finally { setActiveWanSetup('national'); }
  });
}
