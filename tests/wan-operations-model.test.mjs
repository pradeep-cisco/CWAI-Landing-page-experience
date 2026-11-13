import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOperations } from '../src/features/wan/operations/operations-model.js';
import { createAgentState, enterAgentFrame, reduceAgent, syncAgentResponse } from '../src/features/wan/model/agentic-model.js';
import { reduce } from '../src/features/wan/model/model.js';
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

test('configuration differences receive an owned assessment without being called repaired', () => {
  const assessing = buildOperations(at(4));
  assert.equal(assessing.changes.assessment.owner, 'CW AI');
  assert.equal(assessing.changes.assessment.status, 'Assessing difference');
  assert.equal(assessing.outcomes.some(item => item.kind === 'configuration'), false);
  const reviewed = buildOperations(at(5));
  assert.equal(reviewed.changes.hasDrift, true);
  assert.equal(reviewed.changes.assessment.status, 'Difference retained');
  assert.equal(reviewed.changes.assessment.complete, true);
  assert.equal(reviewed.changes.observed.find(item => item.key === 'description').value, 'CONTROL-LOOPBACK-OLD');
  const outcome = reviewed.outcomes.find(item => item.kind === 'configuration');
  assert.equal(outcome.completed, true);
  assert.equal(outcome.verified, false);
  assert.equal(outcome.job, null);
  assert.equal(outcome.outcomeLabel, 'Difference retained');
  assert.match(outcome.proofSummary, /forwarding effect.*not established/);
  assert.equal(reviewed.resolved.some(item => item.kind === 'configuration'), false);
  assert.equal(buildOperations(at(7, { operations: { drift: false } })).outcomes.some(item => item.kind === 'configuration'), false);
});

test('restored router and collection work retain source-specific outcomes without interface recovery proof', () => {
  let state = at(7, { critical: true, gap: 'west' });
  assert.equal(buildOperations(state).outcomes.some(item => ['device', 'monitoring'].includes(item.kind)), false);
  state = enterAgentFrame(state, 8);
  state = syncAgentResponse({ ...state, critical: false, gap: 'none' });
  const model = buildOperations(state);
  const device = model.outcomes.find(item => item.kind === 'device');
  const collection = model.outcomes.find(item => item.kind === 'monitoring');
  assert.equal(device.outcomeLabel, 'Reachability restored');
  assert.equal(collection.outcomeLabel, 'Collection restored');
  for (const result of [device, collection]) {
    assert.equal(result.recovered, '08:12');
    assert.equal(result.job, null);
    assert.equal(result.verificationWindow, undefined);
    assert.equal(result.peak, undefined);
    assert.equal(result.after, undefined);
    assert.ok(result.criteria.every(item => item.met));
    assert.doesNotMatch(JSON.stringify(result.criteria), /below 80|08:30|08:35|RUN-017/);
  }
  assert.match(device.proofSummary, /repair operation.*not inferred/);
  assert.match(collection.proofSummary, /does not establish interface or service recovery/);
  assert.equal(model.resolved.some(item => item.current), false);
});

test('reachability restoration does not require or imply restored device telemetry', () => {
  let state = at(7, { critical: true, gap: 'east' });
  state = syncAgentResponse({ ...state, critical: false });
  const model = buildOperations(state);
  assert.ok(model.outcomes.some(item => item.kind === 'device'));
  assert.equal(model.outcomes.some(item => item.kind === 'monitoring'), false);
  const telemetry = model.monitoring.find(row => row.id === MONITORING_CONTEXT.criticalDomain).sources.find(source => source.id === 'telemetry');
  assert.equal(telemetry.status, 'delayed');
  assert.equal(telemetry.time, '07:50');
});

test('a new router occurrence preserves completed proof and its stable Recent identity', () => {
  let state = at(3, { critical: true });
  state = syncAgentResponse(reduce(state, { type: 'CRITICAL', value: false }));
  const first = buildOperations(state).outcomes.find(item => item.kind === 'device');
  assert.ok(first);
  assert.equal(first.workstream, 'device');
  state = enterAgentFrame(state, 4);
  state = syncAgentResponse(reduce(state, { type: 'CRITICAL', value: true }));
  const retained = buildOperations(state).outcomes.find(item => item.id === first.id);
  assert.ok(retained, 'the old Recent row stays present while the router has another incident');
  assert.equal(retained.workstream, undefined, 'old proof must not open a new occurrence as its response');
  for (const key of ['scope', 'detected', 'recovered', 'proofSummary']) assert.equal(retained[key], first[key]);
  assert.deepEqual(retained.criteria, first.criteria);
  state = syncAgentResponse(reduce(state, { type: 'CRITICAL', value: false }));
  const restored = buildOperations(state).outcomes.filter(item => item.kind === 'device');
  assert.equal(restored.length, 2, 'history and the latest-source fallback must not duplicate an outcome');
  assert.equal(new Set(restored.map(item => item.id)).size, 2);
  assert.ok(restored.some(item => item.id === first.id));
  assert.equal(restored.filter(item => item.workstream === 'device').length, 1);
  const sourceCopy = structuredClone(state);
  const projection = buildOperations(state);
  projection.outcomes.find(item => item.id === first.id).criteria[0].label = 'Changed projection';
  assert.deepEqual(state, sourceCopy);
  assert.notEqual(buildOperations(state).outcomes.find(item => item.id === first.id).criteria[0].label, 'Changed projection');
});

test('a different collection gap retains the previous stream proof without borrowing its current scope', () => {
  let state = at(3, { gap: 'west' });
  state = syncAgentResponse(reduce(state, { type: 'GAP', value: 'none' }));
  const first = buildOperations(state).outcomes.find(item => item.kind === 'monitoring');
  assert.match(first.scope, /XR-P1 and XR-P2/);
  state = enterAgentFrame(state, 4);
  state = syncAgentResponse(reduce(state, { type: 'GAP', value: 'east' }));
  const retained = buildOperations(state).outcomes.find(item => item.id === first.id);
  assert.ok(retained);
  assert.equal(retained.workstream, undefined);
  assert.equal(retained.scope, first.scope);
  assert.deepEqual(retained.criteria, first.criteria);
  assert.ok(retained.criteria.some(item => /07:58/.test(item.label)));
  state = syncAgentResponse(reduce(state, { type: 'GAP', value: 'none' }));
  const completed = buildOperations(state).outcomes.filter(item => item.kind === 'monitoring');
  assert.equal(completed.length, 2);
  assert.ok(completed.some(item => item.id === first.id));
  const latest = completed.find(item => item.id !== first.id);
  assert.equal(latest.domain, domainLabel(MONITORING_CONTEXT.criticalDomain));
  assert.ok(latest.criteria.some(item => /07:50/.test(item.label)));
  assert.equal(latest.workstream, 'monitoring');
  const replay = buildOperations(enterAgentFrame(state, 0));
  assert.equal(replay.outcomes.some(item => item.kind === 'monitoring'), false, 'future restoration proof is absent in earlier source frames');
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
      let restored = at(7, { critical: true, gap: 'west' });
      restored = syncAgentResponse({ ...restored, critical: false, gap: 'none' });
      const outcomes = buildOperations(restored).outcomes;
      assert.equal(outcomes.find(item => item.kind === 'device').domain, domainLabel(findDevice('XR-PE-E2').domain));
      assert.equal(outcomes.find(item => item.kind === 'monitoring').domain, model.scope.domain);
    } finally { setActiveWanSetup('national'); }
  });
}
