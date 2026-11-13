import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgentState, enterAgentFrame, syncAgentResponse, agentResponse } from '../src/features/wan/model/agentic-model.js';
import { reduce } from '../src/features/wan/model/model.js';
import { WAN_SETUPS, MONITORING_CONTEXT, DOMAINS, setActiveWanSetup, domainLabel, groupLabel } from '../src/features/wan/model/scale.js';
import { domainObservation, networkWatch } from '../src/features/wan/watch-model.js';

const context = () => ({ ...MONITORING_CONTEXT,
  mainDomainLabel: domainLabel(MONITORING_CONTEXT.mainDomain),
  mainGroupLabel: groupLabel(MONITORING_CONTEXT.mainGroup),
  criticalDomainLabel: domainLabel(MONITORING_CONTEXT.criticalDomain),
});
const at = (frame, overrides = {}) => enterAgentFrame(createAgentState({ networkContext: context(), ...overrides }), frame);

for (const fixture of WAN_SETUPS) {
  test(`${fixture.label}: living domain observations stay attached to the actual selected inventory`, () => {
    try {
      setActiveWanSetup(fixture.id);
      const quiet = at(0), watch = networkWatch(quiet);
      assert.equal(watch.mode, 'quiet');
      assert.equal(watch.incidents.length, 0);
      assert.equal(watch.fresh, true);
      assert.ok(watch.updates.length <= 4);
      assert.equal(new Set(watch.updates.map(item => item.id)).size, watch.updates.length);
      const main = domainObservation(quiet, MONITORING_CONTEXT.mainDomain);
      assert.equal(main.value, '46%');
      assert.equal(main.time, '07:55');
      assert.deepEqual(main.trend, [{ time: '07:55', value: 46 }]);
      for (const domain of DOMAINS.filter(item => item.id !== MONITORING_CONTEXT.mainDomain)) {
        const observation = domainObservation(quiet, domain.id);
        assert.equal(observation.title, 'No active source alarms');
        assert.equal(observation.value, 'Reachable');
        assert.equal(observation.trend, undefined);
      }
      const incident = networkWatch(at(2)).incidents[0];
      assert.equal(incident.domainId, MONITORING_CONTEXT.mainDomain);
      assert.equal(incident.severity, 'Major');
      assert.equal(incident.owner, 'CW AI');
      assert.equal(domainObservation(quiet, 'missing-domain').fresh, false);
    } finally { setActiveWanSetup('national'); }
  });
}

test('a below-threshold developing trend is a current observation without an active incident', () => {
  const watch = networkWatch(at(1)), observation = domainObservation(at(1), MONITORING_CONTEXT.mainDomain);
  assert.equal(watch.mode, 'trend');
  assert.deepEqual(watch.incidents, []);
  assert.equal(observation.kind, 'trend');
  assert.equal(observation.value, '73%');
  assert.deepEqual(observation.trend, [{ time: '07:55', value: 46 }, { time: '07:58', value: 73 }]);
  assert.match(observation.detail, /Threshold 80%/);
});

test('source severity remains active while CW AI follows a running or completed job', () => {
  let state = at(7), watch = networkWatch(state);
  assert.equal(watch.mode, 'incident');
  assert.equal(watch.incidents[0].sourceState, 'Major · Active');
  assert.equal(watch.incidents[0].stage, 'Remediating');
  assert.match(watch.updates.find(item => item.id === 'interface-response').title, /job running/);
  state = enterAgentFrame(state, 10); watch = networkWatch(state);
  assert.equal(watch.incidents[0].sourceState, 'Major · Active');
  assert.equal(watch.incidents[0].stage, 'Verifying');
  assert.equal(watch.incidents[0].resolved, false);
  assert.equal(domainObservation(state, MONITORING_CONTEXT.mainDomain).value, '86%');
  assert.match(watch.updates.find(item => item.id === 'interface-response').detail, /separate from execution/);
});

test('only independently verified recovery leaves incident attention; healthy source alone does not', () => {
  const recovered = networkWatch(at(11));
  assert.equal(recovered.mode, 'recovery');
  assert.equal(recovered.incidents.length, 0);
  assert.ok(recovered.updates.some(item => item.id === 'interface-outcome'));
  for (const overrides of [{ match: 'restricted' }, { match: 'precheck' }, { runOutcome: 'failed' }, { runOutcome: 'unknown' }]) {
    const state = at(11, overrides), watch = networkWatch(state);
    assert.equal(watch.mode, 'incident');
    assert.equal(watch.incidents[0].sourceState, 'Source-cleared');
    assert.equal(watch.incidents[0].resolved, false);
    assert.equal(watch.incidents[0].needsDecision, false);
    assert.equal(watch.incidents[0].owner, 'CW AI');
    assert.equal(watch.incidents[0].attentionRequired, true);
    assert.equal(watch.incidents[0].blocker.owner, 'CW AI');
    assert.equal(watch.incidents[0].blocker.status, overrides.runOutcome ? 'reconciling' : 'blocked');
    assert.deepEqual(state.agentic.handoffs, {});
    assert.match(domainObservation(state, MONITORING_CONTEXT.mainDomain).detail, /unverified/);
    assert.equal(watch.updates.some(item => item.id === 'interface-outcome'), false);
  }
});

test('collection loss stops the observed trend and never turns stale readings into peer-router metrics', () => {
  const state = at(8, { gap: 'west' }), watch = networkWatch(state);
  const main = domainObservation(state, MONITORING_CONTEXT.mainDomain);
  const transit = domainObservation(state, MONITORING_CONTEXT.transitDomain);
  assert.equal(watch.fresh, false);
  assert.equal(watch.incidents[0].sourceState, 'Major · Active');
  assert.equal(main.kind, 'major');
  assert.equal(main.fresh, false);
  assert.equal(main.value, '73% last known');
  assert.equal(main.time, '07:58');
  assert.deepEqual(main.trend, [{ time: '07:55', value: 46 }, { time: '07:58', value: 73 }]);
  assert.equal(transit.kind, 'gap');
  assert.equal(transit.time, '07:58');
  assert.equal(transit.value, 'Last known');
  assert.equal(transit.trend, undefined);
  assert.equal(transit.target.id, 'XR-P2:HundredGigE0/0/0/1');
  assert.ok(watch.updates.some(item => item.id === 'collection-source' && item.fresh === false));
});

test('Critical reachability has precedence over a simultaneous Major and collection loss', () => {
  const state = at(7, { critical: true, criticalDetected: '08:00', gap: 'east' });
  const before = structuredClone(state), watch = networkWatch(state);
  assert.deepEqual(watch.incidents.map(item => item.id), ['device', 'interface', 'monitoring']);
  assert.equal(watch.incidents[0].severity, 'Critical');
  assert.equal(watch.incidents[0].time, '08:00');
  assert.equal(watch.tone, 'negative');
  assert.equal(watch.fresh, false);
  const reachability = domainObservation(state, MONITORING_CONTEXT.criticalDomain);
  assert.equal(reachability.kind, 'critical');
  assert.equal(reachability.fresh, true);
  assert.equal(reachability.time, '08:10');
  assert.match(reachability.detail, /last observed 07:50/);
  assert.equal(watch.updates.find(item => item.id === 'collection-source').time, '07:50');
  assert.equal(watch.updates.length, 4);
  assert.deepEqual(state, before);
});

test('a restored device leaves the active queue while preserving its owned source record and evidence', () => {
  let state = at(3, { critical: true, criticalDetected: '08:00' });
  const original = structuredClone(state.agentic.deviceRecord);
  state = syncAgentResponse(reduce(state, { type: 'CRITICAL', value: false }));
  const watch = networkWatch(state);
  assert.equal(watch.incidents.some(item => item.id === 'device'), false);
  assert.equal(domainObservation(state, MONITORING_CONTEXT.criticalDomain).value, 'Reachable');
  assert.equal(state.agentic.deviceRecord.startedAt, original.startedAt);
  assert.equal(state.agentic.deviceRecord.clearedAt, '08:01');
  assert.equal(agentResponse(state, 'device').owner, 'CW AI');
  assert.equal(agentResponse(state, 'device').resolved, true);
  const source = watch.eventCoverage.events.find(item => item.id === 'CNC-2086');
  assert.equal(source.active, false);
  assert.equal(source.caseId, 'device');
  assert.equal(source.detectedAt, '08:00');
  assert.equal(source.clearedAt, '08:01');
  assert.deepEqual(state.agentic.handoffs, {});
});

test('quiet coverage gaps get attention without inventing a threshold alarm', () => {
  const state = at(0, { gap: 'east' }), watch = networkWatch(state);
  assert.equal(watch.mode, 'gap');
  assert.deepEqual(watch.incidents.map(item => item.id), ['monitoring']);
  assert.equal(watch.incidents[0].sourceState, 'Collection unavailable');
  assert.equal(domainObservation(state, MONITORING_CONTEXT.criticalDomain).time, '07:50');
  assert.equal(watch.updates.some(item => /Major|Critical/.test(item.title)), false);
});

test('an agent-owned scope dependency preserves the confirmed job and current controller-source times', () => {
  for (const runOutcome of ['completed', 'failed', 'unknown']) {
    let state = at(7, { runOutcome });
    state = syncAgentResponse(reduce(state, { type: 'MATCH', value: 'restricted' }));
    const original = agentResponse(state);
    assert.equal(original.job.id, 'RUN-017');
    assert.equal(original.job.startedAt, '08:10');
    assert.equal(original.job.status, 'running');
    assert.equal(original.blocker.owner, 'CW AI');
    assert.equal(original.needsDecision, false);
    assert.deepEqual(state.agentic.handoffs, {});
    state = enterAgentFrame(state, 9);
    let watch = networkWatch(state);
    let update = watch.updates.find(item => item.id === 'interface-response');
    assert.equal(update.title, 'Controller job running');
    assert.equal(update.time, '08:20');
    assert.equal(watch.incidents[0].blocker.owner, 'CW AI');
    assert.equal(watch.incidents[0].owner, 'CW AI');
    state = enterAgentFrame(state, 10);
    watch = networkWatch(state);
    update = watch.updates.find(item => item.id === 'interface-response');
    assert.equal(update.time, '08:25');
    assert.equal(update.source, 'RUN-017');
    assert.equal(update.title, runOutcome === 'completed' ? 'Controller job completed'
      : runOutcome === 'failed' ? 'Controller job failed' : 'Controller result unconfirmed');
    assert.equal(agentResponse(state).job.startedAt, '08:10');
    assert.equal(watch.incidents[0].resolved, false);
    assert.equal(watch.incidents[0].needsDecision, false);
    assert.equal(watch.incidents[0].blocker.owner, 'CW AI');
    assert.deepEqual(state.agentic.handoffs, {});
  }
});

test('missing or unavailable catalogue matches retain agent ownership through a validated graph-derived response', () => {
  for (const match of ['no-match', 'unavailable']) {
    let state = at(5, { match });
    let response = agentResponse(state);
    assert.equal(response.job.status, 'not-started');
    assert.equal(response.plan.origin, 'graph-derived');
    assert.equal(response.owner, 'CW AI');
    assert.equal(response.needsDecision, false);
    assert.equal(response.handoff, null);
    state = enterAgentFrame(state, 7);
    let watch = networkWatch(state);
    assert.equal(watch.incidents[0].sourceState, 'Major · Active');
    assert.equal(watch.updates.find(item => item.id === 'interface-response').source, 'RUN-017');
    assert.equal(agentResponse(state).job.status, 'running');
    state = enterAgentFrame(state, 11);
    watch = networkWatch(state);
    response = agentResponse(state);
    assert.equal(response.resolved, true);
    assert.equal(watch.mode, 'recovery');
    assert.equal(watch.incidents.length, 0);
    assert.ok(watch.updates.some(item => item.id === 'interface-outcome'));
    assert.deepEqual(state.agentic.handoffs, {});
  }
});

test('a recorded reconciled retry reaches recovery without rewriting the original failed or unknown result', () => {
  for (const runOutcome of ['failed', 'unknown']) {
    const pending = at(11, { runOutcome });
    assert.equal(networkWatch(pending).mode, 'incident');
    assert.equal(agentResponse(pending).job.status, runOutcome);
    const confirmed = at(11, { runOutcome, reconciliation: 'verified-retry' });
    const response = agentResponse(confirmed), watch = networkWatch(confirmed);
    assert.equal(response.resolved, true);
    assert.equal(response.job.id, 'RUN-018');
    assert.equal(response.priorJobs[0].id, 'RUN-017');
    assert.equal(response.priorJobs[0].status, runOutcome);
    assert.equal(watch.mode, 'recovery');
    assert.equal(watch.updates.find(item => item.id === 'interface-response').source, 'RUN-018');
    assert.ok(watch.updates.some(item => item.id === 'interface-outcome'));
  }
});

test('an unclassified event keeps a quiet watch informative instead of implying an all-clear state', () => {
  const state = at(0, { unclassifiedEvent: true }), watch = networkWatch(state);
  assert.equal(watch.mode, 'correlation');
  assert.equal(watch.tone, 'info');
  assert.match(watch.title, /under investigation/);
  assert.match(watch.detail, /CW AI retains ownership/);
  assert.equal(watch.incidents.length, 0);
  assert.equal(watch.eventCoverage.pending.length, 1);
  assert.equal(watch.eventCoverage.pending[0].id, 'CNC-3110');
  assert.equal(watch.eventCoverage.pending[0].owner, 'CW AI');
  assert.equal(watch.eventCoverage.pending[0].caseId, null);
  const update = watch.updates.find(item => item.id === 'event-correlation');
  assert.match(update.title, /1 event under correlation/);
  assert.equal(update.source, 'Syslog');
  assert.deepEqual(update.target, { kind: 'device', id: 'XR-P3' });
  assert.equal(update.time, '07:55');
});

test('a bounded update feed retains every linked and unmatched source event in its coverage ledger', () => {
  const sourceEvents = Array.from({ length: 12 }, (_, index) => ({ id: `PENDING-${index + 1}`, title: `Received source event ${index + 1}`, time: '08:09', source: 'Router log', target: { kind: 'device', id: 'XR-P3' } }));
  const state = at(7, { critical: true, gap: 'east', related: true, sourceEvents });
  const copy = structuredClone(state), watch = networkWatch(state);
  assert.equal(watch.updates.length, 4);
  assert.equal(watch.eventCoverage.total, 16);
  assert.equal(watch.eventCoverage.linked.length, 4);
  assert.equal(watch.eventCoverage.pending.length, 12);
  assert.deepEqual(watch.eventCoverage.pending.map(event => event.id), sourceEvents.map(event => event.id));
  assert.ok(watch.eventCoverage.events.some(event => event.id === 'CNC-2086' && event.caseId === 'device'));
  assert.ok(watch.eventCoverage.events.some(event => event.id === 'CNC-1044' && event.caseId === 'interface'));
  assert.match(watch.updates.find(item => item.id === 'event-correlation').title, /12 events under correlation/);
  assert.equal(watch.tone, 'negative');
  assert.deepEqual(state, copy);
});

test('historical source inspection cannot replace the current landing response with a historical record', () => {
  const current = at(11), historical = { ...current, history: 0 };
  const before = structuredClone(historical);
  assert.deepEqual(networkWatch(historical), networkWatch(current));
  assert.equal(networkWatch(historical).mode, 'recovery');
  assert.equal(networkWatch(historical).updates.find(item => item.id === 'interface-response').time, '08:35');
  assert.deepEqual(historical, before);
});

test('a verified interface outcome cannot hide a separate event under correlation', () => {
  const watch = networkWatch(at(11,{unclassifiedEvent:true}));
  assert.equal(watch.mode,'correlation');
  assert.equal(watch.tone,'info');
  assert.match(watch.title,/under investigation/);
  assert.equal(watch.eventCoverage.pending.length,1);
  assert.ok(watch.updates.some(item=>item.id==='interface-outcome'));
  assert.ok(watch.updates.some(item=>item.id==='event-correlation'));
});
