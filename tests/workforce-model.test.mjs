import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorkforceSnapshot, WORKFORCE_SCENES } from '../src/features/workforce/workforce-model.js';

const job = (snapshot, id) => snapshot.jobs.find(item => item.id === id);

test('the source-access wait stays independent of capability failure and remediation outcome', () => {
  for (const { id } of WORKFORCE_SCENES) {
    const model = getWorkforceSnapshot(id), assessment = job(model, 'J23');
    assert.equal(assessment.health, 'Healthy');
    assert.equal(assessment.status, 'Waiting for access');
    assert.equal(assessment.eligibility, null);
    if (id >= 2) assert.equal(job(model, 'J17').status, 'Constrained');
    if (id >= 3) {
      assert.equal(job(model, 'J17').health, 'Degraded collection');
      assert.equal(job(model, 'J17').eligibility, 'New assignments restricted');
    }
  }
});

test('approval and prechecks never claim an issued operation', () => {
  for (const scene of [0, 1, 2, 3]) {
    const model = getWorkforceSnapshot(scene), remediation = job(model, 'J21');
    assert.doesNotMatch(remediation.source, /RUN-021/);
    assert.match(remediation.next, /No controller operation has been issued/);
    assert.ok(!model.knownActions.some(action => ['started', 'completed', 'verified'].includes(action.id)));
  }
  const authorized = getWorkforceSnapshot(3), remediation = job(authorized, 'J21');
  assert.equal(remediation.status, 'Authorized');
  assert.equal(remediation.steps[remediation.step], 'Prechecks');
  assert.equal(authorized.decisions.length, 0);
});

test('the remediation rail distinguishes actual execution, verification, and established proof', () => {
  for (const [scene, status, checkpoint] of [[4, 'Executing', 'Execute'], [5, 'Verifying', 'Verify']]) {
    const remediation = job(getWorkforceSnapshot(scene), 'J21');
    assert.equal(remediation.status, status);
    assert.equal(remediation.steps[remediation.step], checkpoint);
  }
  const verified = job(getWorkforceSnapshot(6), 'J21');
  assert.equal(verified.status, 'Verified');
  assert.equal(verified.step, verified.steps.length);
  assert.equal(job(getWorkforceSnapshot(6), 'J17').status, 'Constrained');
});

test('Actions contains confirmed consequential records rather than pending proposals and unchanged waits', () => {
  for (const scene of [0, 1, 2]) assert.deepEqual(getWorkforceSnapshot(scene).actions, []);
  for (const scene of [3, 4, 5, 6]) {
    const model = getWorkforceSnapshot(scene);
    assert.ok(model.actions.length <= 3);
    assert.ok(model.actions.every(action => ['restriction', 'authorization', 'started', 'completed', 'verified'].includes(action.id)));
    assert.ok(model.actions.every(action => action.job !== 'J23'));
  }
});

test('bounded landing Actions retains prior source records for an open inspection', () => {
  assert.ok(!getWorkforceSnapshot(3).knownActions.some(action => action.id === 'started'));
  assert.ok(getWorkforceSnapshot(4).knownActions.some(action => action.id === 'started'));
  const final = getWorkforceSnapshot(6);
  assert.ok(!final.actions.some(action => action.id === 'started'));
  assert.ok(final.knownActions.some(action => action.id === 'started'));
  assert.ok(!getWorkforceSnapshot(5).knownActions.some(action => action.id === 'verified'));
});
