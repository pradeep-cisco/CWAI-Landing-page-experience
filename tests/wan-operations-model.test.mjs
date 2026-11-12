import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOperations } from '../src/features/wan/operations/operations-model.js';
import { createAgentState, enterAgentFrame, reduceAgent } from '../src/features/wan/model/agentic-model.js';
import { MONITORING_CONTEXT, DOMAINS, WAN_SETUPS, setActiveWanSetup, domainLabel, groupLabel, findDevice } from '../src/features/wan/model/scale.js';

const context = () => ({ ...MONITORING_CONTEXT,
  mainDomainLabel: domainLabel(MONITORING_CONTEXT.mainDomain),
  mainGroupLabel: groupLabel(MONITORING_CONTEXT.mainGroup),
  criticalDomainLabel: domainLabel(MONITORING_CONTEXT.criticalDomain),
});
const at = (frame, overrides = {}) => enterAgentFrame(createAgentState({ networkContext: context(), ...overrides }), frame);

test('lower dashboard keeps the incident, controller result and verified outcome independent', () => {
  const quiet = buildOperations(at(0));
  assert.equal(quiet.watch.incidents.length, 0);
  assert.equal(quiet.recovery.status, 'not-started');
  assert.deepEqual(quiet.resolved.map(item => item.id), ['CNC-0991']);
  assert.equal(quiet.episodes.some(item => item.current), false);
  const running = buildOperations(at(7));
  assert.equal(running.response.job.status, 'running');
  assert.equal(running.recovery.status, 'executing');
  assert.equal(running.episodes.find(item => item.current).verified, false);
  const completed = buildOperations(at(10));
  assert.equal(completed.observation.utilization, 86);
  assert.equal(completed.recovery.status, 'verifying');
  assert.equal(completed.recovery.observationWindow, null);
  assert.equal(completed.resolved.some(item => item.current), false);
  const verified = buildOperations(at(11));
  assert.equal(verified.recovery.verified, true);
  assert.equal(verified.resolved.find(item => item.current).recovered, '08:35');
  assert.equal(verified.samples.some(point => point.time === '08:30'), false);
  assert.deepEqual(verified.recovery.observationWindow, { from: '08:30', to: '08:35', source: 'Recorded stability verification' });
});

test('source clearance cannot fabricate successful execution or resolution', () => {
  for (const overrides of [{ runOutcome: 'failed' }, { runOutcome: 'unknown' }, { match: 'restricted' }, { gap: 'west' }]) {
    const model = buildOperations(at(11, overrides));
    assert.equal(model.response.resolved, false, JSON.stringify(overrides));
    assert.equal(model.resolved.some(item => item.current), false);
    assert.equal(model.episodes.find(item => item.current).after, null);
    assert.equal(model.episodes.find(item => item.current).recovered, null);
  }
  let paused = reduceAgent(at(6), { type: 'AGENT_PAUSE', incident: 'interface' });
  paused = enterAgentFrame(paused, 11);
  assert.equal(buildOperations(paused).response.job.status, 'not-started');
  assert.equal(buildOperations(paused).resolved.some(item => item.current), false);
});

test('collection gaps bound the plotted samples and affect only the appropriate telemetry scope', () => {
  const model = buildOperations(at(10, { gap: 'west' }));
  assert.equal(model.observation.fresh, false);
  assert.equal(model.samples.at(-1).time, '07:58');
  assert.equal(model.samples.at(-1).value, 73);
  assert.ok(model.samples.every(point => point.time <= model.observation.observedAt));
  const delayed = model.monitoring.filter(row => row.sources[0].status === 'delayed');
  assert.deepEqual(delayed.map(row => row.id).sort(), [MONITORING_CONTEXT.mainDomain, MONITORING_CONTEXT.transitDomain].sort());
  assert.equal(delayed.find(row => row.id === MONITORING_CONTEXT.mainDomain).sources[0].scope, 'XR-P1 interface metrics');
  assert.equal(delayed.find(row => row.id === MONITORING_CONTEXT.transitDomain).sources[0].scope, 'XR-P2 interface metrics');
  assert.ok(model.monitoring.every(row => row.sources.slice(1).every(source => source.status === 'current')));
  assert.equal(model.recovery.observationWindow, null);
  const early = buildOperations(at(0, { gap: 'west' }));
  assert.deepEqual(early.samples, [{ time: '07:50', value: 40, fresh: false }]);
});

test('a reachability fault remains an independent current observation through a telemetry gap', () => {
  const model = buildOperations(at(7, { critical: true, gap: 'east' }));
  const row = model.monitoring.find(item => item.id === MONITORING_CONTEXT.criticalDomain);
  assert.equal(row.sources.find(source => source.id === 'telemetry').status, 'delayed');
  assert.equal(row.sources.find(source => source.id === 'telemetry').time, '07:50');
  assert.equal(row.sources.find(source => source.id === 'reachability').status, 'current');
  assert.equal(row.sources.find(source => source.id === 'reachability').value, 'XR-PE-E2 unreachable');
  assert.equal(row.sources.find(source => source.id === 'topology').status, 'current');
  assert.equal(model.observation.fresh, true);
});

test('configuration evidence is separately sourced and never changes response authority or implies a cause', () => {
  const before = buildOperations(at(3)), after = buildOperations(at(4));
  assert.equal(before.changes.hasDrift, false);
  assert.equal(before.changes.sourceRecord, 'CONFIG-0755');
  assert.equal(after.changes.hasDrift, true);
  assert.equal(after.changes.sourceRecord, 'CONFIG-0803');
  assert.equal(after.changes.relatedIncident, null);
  assert.equal(after.changes.router, 'XR-P5');
  assert.equal(after.changes.intended.filter((field, index) => field.value !== after.changes.observed[index].value).length, 1);
  assert.equal(after.changes.maintenance.status, 'Scheduled');
  assert.ok(after.changes.maintenance.checks.every(check => check.status === 'pending'));
  const suppressed = buildOperations(at(7, { operations: { drift: false } }));
  assert.equal(suppressed.changes.hasDrift, false);
  assert.equal(suppressed.response.job.status, 'running');
});

test('historical inspection leaves the current operational projection unchanged and the model is pure', () => {
  const state = at(11), historical = { ...state, history: 0 };
  const copy = structuredClone(historical);
  assert.deepEqual(buildOperations(historical), buildOperations(state));
  assert.deepEqual(historical, copy);
  const first = buildOperations(state);
  first.episodes[0].points[0].value = 0;
  first.changes.intended[0].value = 'changed';
  first.changes.maintenance.checks[0].status = 'complete';
  const next = buildOperations(state);
  assert.equal(next.episodes[0].points[0].value, 88);
  assert.equal(next.changes.intended[0].value, 'XR-P5');
  assert.equal(next.changes.maintenance.checks[0].status, 'pending');
});

for (const setup of WAN_SETUPS) {
  test(`${setup.label}: lower sections resolve labels and groups from the selected WAN`, () => {
    try {
      setActiveWanSetup(setup.id);
      const model = buildOperations(at(4));
      assert.equal(model.scope.domainId, findDevice('XR-P1').domain);
      assert.equal(model.scope.groupId, findDevice('XR-P1').groupId);
      assert.equal(model.scope.domain, domainLabel(model.scope.domainId));
      assert.equal(model.scope.group, groupLabel(model.scope.groupId));
      assert.deepEqual(model.monitoring.map(row => row.id), DOMAINS.map(domain => domain.id));
      assert.equal(model.changes.domainId, findDevice('XR-P5').domain);
      assert.equal(model.episodes[0].domain, model.scope.domain);
    } finally { setActiveWanSetup('national'); }
  });
}
