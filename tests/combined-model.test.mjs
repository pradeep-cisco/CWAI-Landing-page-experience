import test from 'node:test';
import assert from 'node:assert/strict';
import { COMBINED_SCENES, COMBINED_VARIANTS, getCombinedSnapshot, normalizeCombinedScene } from '../src/features/combined/combined-model.js';

const job = (snapshot, id = 'ROUTE-104') => snapshot.jobs.find(item => item.id === id);
const ids = snapshot => snapshot.actions.map(item => item.id);
const issuedIds = ['execution-acknowledged', 'operation-completed', 'outcome-verified', 'partial-result'];

test('the presentation opens with an explicit scoped incident, separately from a configuration finding', () => {
  const snapshot = getCombinedSnapshot();
  assert.equal(snapshot.scene, 2);
  const incident = snapshot.incidents[0];
  assert.equal(incident.id, 'INC-104');
  assert.equal(incident.job, 'ROUTE-104');
  assert.equal(incident.domainId, 'Core');
  assert.equal(incident.deviceId, 'XR-R07');
  assert.equal(incident.state, 'active');
  assert.match(incident.classification, /CFG-INTENT-01/);
  assert.match(incident.evidence, /120.*100/);
  for (const scene of [0, 1]) assert.deepEqual(getCombinedSnapshot(scene).incidents, []);
  for (const variant of ['expected', 'evidence']) assert.deepEqual(getCombinedSnapshot(2, variant).incidents, []);
});

test('incident resolution requires scoped verification and an interrupted incident remains last-known', () => {
  assert.equal(getCombinedSnapshot(6).incidents[0].state, 'active');
  const verified = getCombinedSnapshot(7);
  assert.ok(verified.criteria.every(item => item.state === 'met'));
  assert.equal(verified.incidents[0].state, 'resolved');
  assert.ok(verified.incidents[0].resolution);
  for (const variant of ['unknown', 'partial', 'capability', 'held', 'revision', 'offline']) {
    assert.equal(getCombinedSnapshot(7, variant).incidents[0].state, 'active');
  }
  assert.equal(getCombinedSnapshot(2, 'offline').incidents[0].current, false);
});

test('scene and variant controls expose coherent stable checkpoints', () => {
  assert.deepEqual(COMBINED_SCENES.map(item => item.id), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.equal(new Set(COMBINED_VARIANTS.map(item => item.id)).size, 10);
  for (const variant of COMBINED_VARIANTS.filter(item => item.id !== 'main')) {
    for (const requested of [0, 2, 7]) assert.equal(getCombinedSnapshot(requested, variant.id).scene, variant.scene);
  }
  assert.equal(getCombinedSnapshot().scene, 2);
  assert.equal(getCombinedSnapshot(4, 'not-a-variant').variant, 'main');
  assert.equal(normalizeCombinedScene('5.8'), 5);
  assert.equal(normalizeCombinedScene(-3), 0);
  assert.equal(normalizeCombinedScene(99), 7);
  assert.equal(normalizeCombinedScene(Number.NaN), 2);
  assert.equal(normalizeCombinedScene(Infinity), 2);
});

test('all branch snapshots retain the three independent jobs and a healthy source-waiting investigator', () => {
  for (const variant of COMBINED_VARIANTS) {
    for (const { id: scene } of COMBINED_SCENES) {
      const snapshot = getCombinedSnapshot(scene, variant.id);
      assert.deepEqual(snapshot.jobs.map(item => item.id), ['ROUTE-104', 'CHECK-208', 'REACH-319']);
      assert.equal(job(snapshot, 'REACH-319').status, 'Waiting for source access');
      assert.equal(job(snapshot, 'REACH-319').health, 'Healthy');
      assert.equal(job(snapshot, 'REACH-319').tone, 'inactive');
      assert.match(job(snapshot, 'REACH-319').detail, /Another job’s success does not supply this evidence/);
      assert.ok(snapshot.actions.every(item => item.job !== 'REACH-319'));
    }
  }
});

test('a difference is assessed before drift, a proposal, or any incident claim', () => {
  const arrival = getCombinedSnapshot(0);
  assert.equal(job(arrival).status, 'Assessing');
  assert.equal(arrival.proposal.available, false);
  assert.equal(arrival.decisions.length, 0);
  assert.equal(arrival.actions.length, 0);
  assert.match(job(arrival).detail, /does not establish an incident, impact, or cause/);
  const finding = getCombinedSnapshot(1);
  assert.equal(job(finding).status, 'Drift confirmed');
  assert.equal(finding.proposal.available, false);
  assert.equal(finding.decisions.length, 0);
  assert.match(job(finding).detail, /Incident classification.*require their own evidence/);
});

test('the independent read-only result has its own scope and does not create corrective authority', () => {
  const snapshot = getCombinedSnapshot(1);
  assert.equal(job(snapshot, 'CHECK-208').status, 'Assessment complete');
  const result = snapshot.actions.find(item => item.id === 'assessment-completed');
  assert.equal(result.job, 'CHECK-208');
  assert.match(result.scope, /XR-R12/);
  assert.match(result.detail, /no authority or outcome evidence/);
  assert.ok(!ids(snapshot).includes('plan-authorized'));
});

test('review, submission, and effective authority never stand in for an issued operation', () => {
  const review = getCombinedSnapshot(2);
  assert.equal(review.proposal.reviewable, true);
  assert.equal(job(review).canReview, true);
  assert.deepEqual(review.decisions.map(item => item.action), ['Review plan']);
  assert.match(review.proposal.authority, /governance role alone does not grant/);
  assert.match(review.proposal.holdConsequence, /keeps this correction unissued/);
  for (const scene of [0, 1, 2, 3, 4]) {
    const snapshot = getCombinedSnapshot(scene);
    assert.ok(!ids(snapshot).some(id => issuedIds.includes(id)));
    assert.ok(snapshot.criteria.every(item => item.state !== 'met'));
  }
  assert.equal(job(getCombinedSnapshot(3)).status, 'Decision submitted');
  assert.equal(getCombinedSnapshot(3).decisions.length, 0);
  assert.ok(!ids(getCombinedSnapshot(3)).includes('plan-authorized'));
  assert.equal(job(getCombinedSnapshot(4)).status, 'Checking');
  assert.ok(ids(getCombinedSnapshot(4)).includes('plan-authorized'));
});

test('acknowledgement, completion, and verified outcome are distinct and preserve prior confirmed records', () => {
  const executing = getCombinedSnapshot(5);
  assert.equal(job(executing).status, 'Executing');
  assert.ok(ids(executing).includes('execution-acknowledged'));
  assert.ok(!ids(executing).includes('operation-completed'));
  assert.equal(job(executing).steps[job(executing).step], 'Execute');
  const verifying = getCombinedSnapshot(6);
  assert.equal(job(verifying).status, 'Verifying');
  assert.ok(ids(verifying).includes('operation-completed'));
  assert.ok(!ids(verifying).includes('outcome-verified'));
  assert.ok(verifying.criteria.some(item => item.state !== 'met'));
  const verified = getCombinedSnapshot(7);
  assert.equal(job(verified).status, 'Verified');
  assert.equal(job(verified).step, job(verified).steps.length);
  assert.ok(verified.criteria.every(item => item.state === 'met'));
  assert.deepEqual(ids(verified), ['assessment-completed', 'plan-authorized', 'execution-acknowledged', 'operation-completed', 'outcome-verified']);
  assert.ok(verified.criteria.every(item => item.source && item.time));
  for (const scene of [5, 6, 7]) {
    const actions = getCombinedSnapshot(scene).actions;
    assert.deepEqual(actions.map(item => item.time), [...actions].map(item => item.time).sort());
  }
});

test('expected authorized change and insufficient current intent end in different truthful states', () => {
  const expected = getCombinedSnapshot(7, 'expected');
  assert.equal(job(expected).status, 'Assessment complete');
  assert.match(job(expected).checkpoint, /matches an authorized change/);
  assert.equal(expected.proposal.available, false);
  assert.equal(expected.proposal.reviewable, false);
  assert.equal(expected.decisions.length, 0);
  assert.ok(ids(expected).includes('expected-change-confirmed'));
  const evidence = getCombinedSnapshot(7, 'evidence');
  assert.equal(job(evidence).status, 'Waiting for evidence');
  assert.equal(job(evidence).health, 'Healthy');
  assert.equal(evidence.proposal.available, false);
  assert.equal(evidence.decisions.length, 0);
  assert.ok(evidence.criteria.every(item => item.state === 'unavailable'));
  for (const snapshot of [expected, evidence]) assert.ok(!ids(snapshot).some(id => issuedIds.includes(id)));
});

test('confirmed hold and revision retain ownership without a live approval or write', () => {
  for (const variant of ['held', 'revision']) {
    const snapshot = getCombinedSnapshot(7, variant);
    assert.equal(snapshot.proposal.reviewable, false);
    assert.equal(job(snapshot).canReview, false);
    assert.equal(snapshot.decisions.length, 0);
    assert.ok(!ids(snapshot).includes('plan-authorized'));
    assert.ok(!ids(snapshot).some(id => issuedIds.includes(id)));
    assert.match(job(snapshot).detail, /Crosswork AI retains/);
  }
  assert.ok(ids(getCombinedSnapshot(2, 'held')).includes('plan-held'));
  assert.ok(ids(getCombinedSnapshot(2, 'revision')).includes('revision-requested'));
  assert.match(getCombinedSnapshot(2, 'revision').proposal.validity, /No revised proposal is yet validated or authorized/);
});

test('a changed resource blocks old proposal approval and v2 can continue without reverting', () => {
  const changed = getCombinedSnapshot(7, 'changed');
  assert.equal(changed.scene, 2);
  assert.equal(changed.proposal.version, 2);
  assert.equal(changed.proposal.previousVersion, 1);
  assert.equal(changed.proposal.reviewable, false);
  assert.match(changed.proposal.changeFrom, /150/);
  assert.match(changed.proposal.changeTo, /100/);
  assert.match(changed.proposal.changeSummary, /v1 no longer matches/);
  assert.ok(!ids(changed).some(id => issuedIds.includes(id)));
  for (const scene of [2, 3, 4, 5, 6, 7]) {
    const snapshot = getCombinedSnapshot(scene, 'main', { proposalVersion: 2 });
    assert.equal(snapshot.proposal.version, 2);
    assert.match(snapshot.proposal.changeFrom, /150/);
    for (const record of snapshot.actions.filter(item => item.job === 'ROUTE-104')) assert.match(record.detail, /v2/);
  }
  assert.equal(getCombinedSnapshot(2, 'main', { proposalVersion: 2 }).proposal.reviewable, true);
});

test('unknown execution retains acknowledged work and requires reconciliation without completion or duplicate writes', () => {
  const snapshot = getCombinedSnapshot(7, 'unknown');
  assert.equal(job(snapshot).status, 'Execution status unknown');
  assert.ok(ids(snapshot).includes('plan-authorized'));
  assert.ok(ids(snapshot).includes('execution-acknowledged'));
  assert.ok(!ids(snapshot).includes('operation-completed'));
  assert.ok(!ids(snapshot).includes('outcome-verified'));
  assert.ok(snapshot.criteria.every(item => item.state === 'unavailable'));
  assert.equal(snapshot.proposal.reviewable, false);
  assert.match(snapshot.decisions[0].reason, /duplicate write is blocked/);
});

test('a reported partial result does not erase issuance or invent a successful operation or rollback', () => {
  const snapshot = getCombinedSnapshot(0, 'partial');
  assert.equal(job(snapshot).status, 'Partial result reported');
  assert.ok(ids(snapshot).includes('execution-acknowledged'));
  assert.ok(ids(snapshot).includes('partial-result'));
  assert.ok(!ids(snapshot).includes('operation-completed'));
  assert.ok(!ids(snapshot).includes('outcome-verified'));
  assert.ok(snapshot.criteria.every(item => item.state === 'unavailable'));
  assert.match(job(snapshot).detail, /does not establish which configuration effects occurred/);
  assert.match(snapshot.actions.at(-1).detail, /Do not interpret failure as no change/);
});

test('material verification capability loss blocks proof but does not make the independent waiting agent unhealthy', () => {
  const snapshot = getCombinedSnapshot(7, 'capability');
  assert.equal(job(snapshot).status, 'Verification unavailable');
  assert.equal(job(snapshot).health, 'Verification capability unavailable');
  assert.equal(job(snapshot, 'REACH-319').health, 'Healthy');
  assert.ok(ids(snapshot).includes('operation-completed'));
  assert.ok(!ids(snapshot).includes('outcome-verified'));
  assert.equal(snapshot.criteria.find(item => item.id === 'routing').state, 'unavailable');
  assert.match(snapshot.decisions[0].reason, /prevents ROUTE-104/);
});

test('interrupted visibility preserves confirmed records and evidence without authorizing or inventing new proof', () => {
  const snapshot = getCombinedSnapshot(7, 'offline');
  assert.equal(snapshot.sourceState, 'interrupted');
  assert.equal(snapshot.scene, 6);
  assert.equal(snapshot.proposal.reviewable, false);
  assert.equal(job(snapshot).canReview, false);
  assert.ok(ids(snapshot).includes('operation-completed'));
  assert.ok(!ids(snapshot).includes('outcome-verified'));
  assert.equal(snapshot.criteria.find(item => item.id === 'configuration').state, 'met');
  assert.equal(snapshot.criteria.find(item => item.id === 'routing').state, 'unavailable');
  assert.match(snapshot.summary, /Last confirmed 08:05:20 UTC/);
  assert.match(job(snapshot).detail, /cannot be inferred/);
});

test('all-met correction criteria occur only at the main verified checkpoint', () => {
  for (const variant of COMBINED_VARIANTS) {
    for (const { id: scene } of COMBINED_SCENES) {
      const snapshot = getCombinedSnapshot(scene, variant.id);
      assert.equal(snapshot.criteria.every(item => item.state === 'met'), variant.id === 'main' && scene === 7);
    }
  }
});

test('snapshots do not share mutable jobs, proposals, actions, or criteria', () => {
  const original = getCombinedSnapshot(7);
  const expected = structuredClone(original);
  original.jobs[0].title = 'Changed by a caller';
  original.jobs[0].steps[0] = 'Changed';
  original.proposal.validation[0] = 'Changed';
  original.actions[0].detail = 'Changed';
  original.criteria[0].state = 'failed';
  assert.deepEqual(getCombinedSnapshot(7), expected);
  assert.deepEqual(getCombinedSnapshot(7), getCombinedSnapshot(7));
});

test('successive revisions preserve the exact current version through authority and execution', () => {
  const changed = getCombinedSnapshot(2, 'changed', { proposalVersion: 3 });
  assert.equal(changed.proposal.version, 3);
  assert.equal(changed.proposal.previousVersion, 2);
  assert.equal(changed.proposal.reviewable, false);
  assert.match(changed.proposal.validity, /v2 is superseded/);
  const authorized = getCombinedSnapshot(4, 'main', { proposalVersion: 3 });
  assert.equal(authorized.proposal.version, 3);
  assert.match(authorized.actions.find(item => item.id === 'plan-authorized').record, /AUTH-ROUTE-104-v3/);
  const executing = getCombinedSnapshot(5, 'main', { proposalVersion: 3 });
  assert.match(executing.actions.find(item => item.id === 'execution-acknowledged').detail, /proposal v3/);
  assert.ok(executing.criteria.every(item => item.state !== 'met'));
});
