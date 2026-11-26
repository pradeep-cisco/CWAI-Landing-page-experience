import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, CAPABILITIES, AGENT_VARIANTS, getAgentCentricSnapshot, getCapabilityReadiness, findExistingWork } from '../src/features/agent-centric/agent-centric-model.js';

test('Option 4 preserves three independent jobs and names their responsible agents', () => {
  for (let scene = 0; scene <= 7; scene++) {
    const model = getAgentCentricSnapshot(scene);
    assert.equal(model.jobs.length, 3);
    for (const job of model.jobs) {
      assert.ok(AGENTS[job.agentId]);
      assert.equal(job.agent, AGENTS[job.agentId].name);
      assert.ok(job.agentVersion && job.issueId && job.authority);
    }
    const sourceWait = model.jobs.find(job => job.id === 'REACH-319');
    assert.equal(sourceWait.status, 'Waiting for source access');
    assert.equal(sourceWait.health, 'Healthy');
    assert.ok(model.issues.some(issue => issue.jobId === sourceWait.id));
  }
});

test('a finding is separate from incident classification and from explained or missing-evidence assessments', () => {
  assert.equal(getAgentCentricSnapshot(1).incidents.length, 0);
  assert.equal(getAgentCentricSnapshot(2).incidents[0].id, 'INC-104');
  for (const variant of ['expected', 'evidence']) {
    const model = getAgentCentricSnapshot(2, variant);
    assert.deepEqual(model.incidents, []);
    assert.deepEqual(model.decisions, []);
    assert.equal(model.proposal.available, false);
  }
});

test('decision submission, authority, acknowledged execution, completion and verification have separate proof', () => {
  const has = (scene, id) => getAgentCentricSnapshot(scene).actions.some(record => record.id === id);
  assert.equal(getAgentCentricSnapshot(2).decisions[0].authority, 'Change');
  assert.equal(getAgentCentricSnapshot(3).submittedDecision.state, 'submitted');
  assert.equal(has(3, 'plan-authorized'), false);
  assert.equal(has(4, 'plan-authorized'), true);
  assert.equal(has(4, 'execution-acknowledged'), false);
  assert.equal(has(5, 'execution-acknowledged'), true);
  assert.equal(has(5, 'operation-completed'), false);
  assert.equal(has(6, 'operation-completed'), true);
  assert.equal(has(6, 'outcome-verified'), false);
  assert.equal(getAgentCentricSnapshot(6).criteria.every(item => item.state === 'met'), false);
  assert.equal(has(7, 'outcome-verified'), true);
  assert.equal(getAgentCentricSnapshot(7).criteria.every(item => item.state === 'met'), true);
  assert.match(getAgentCentricSnapshot(7).incidents[0].evidence, /At classification.*was 120/);
  assert.match(getAgentCentricSnapshot(7).criteria[0].detail, /local preference 100/);
});

test('an issued execution exception retains its actual records without creating invented approval work', () => {
  for (const variant of ['unknown', 'partial', 'capability', 'offline']) {
    const model = getAgentCentricSnapshot(2, variant);
    assert.deepEqual(model.decisions, []);
    assert.equal(model.handled.length, 1);
    assert.ok(model.actions.some(record => record.id === 'execution-acknowledged'));
    assert.equal(model.actions.some(record => record.id === 'outcome-verified'), false);
    assert.notEqual(model.jobs[0].status, 'Verified');
  }
});

test('source interruption prevents new starts and current authorization while retaining last-known records', () => {
  const model = getAgentCentricSnapshot(2, 'offline');
  assert.equal(model.permissions.reviewChange, false);
  assert.equal(model.permissions.startReadOnly, false);
  assert.ok(model.actions.length > 0);
  assert.equal(model.incidents[0].current, false);
  assert.match(model.summary, /Last confirmed/);
  for (const capability of CAPABILITIES) assert.equal(getCapabilityReadiness(capability.id, model).canStart, false);
});

test('agent restriction affects new assignments without healing, cancelling or transferring existing work', () => {
  const before = getAgentCentricSnapshot(2);
  const after = getAgentCentricSnapshot(2, 'main', { agentEligibility: { troubleshooter: 'restricted', cdd: { state: 'restricted' } } });
  assert.equal(getCapabilityReadiness('investigate', after).state, 'restricted');
  assert.equal(getCapabilityReadiness('assess', after).canStart, false);
  for (const id of ['REACH-319', 'CHECK-208']) {
    const prior = before.jobs.find(job => job.id === id), current = after.jobs.find(job => job.id === id);
    assert.equal(current.agentId, prior.agentId);
    assert.equal(current.status, prior.status);
    assert.equal(current.checkpoint, prior.checkpoint);
  }
  assert.equal(after.agents.troubleshooter.health, 'Healthy');
  assert.equal(getCapabilityReadiness('investigate', before).state, 'needs-access');
});

test('verification requires actual completion in the exact scope, not authorization or a partial result', () => {
  for (let scene = 0; scene <= 5; scene++) assert.equal(getCapabilityReadiness('verify', getAgentCentricSnapshot(scene)).canStart, false);
  assert.equal(getCapabilityReadiness('verify', getAgentCentricSnapshot(6)).canStart, true);
  assert.equal(getCapabilityReadiness('verify', getAgentCentricSnapshot(2, 'partial')).canStart, false);
  assert.equal(getCapabilityReadiness('verify', getAgentCentricSnapshot(2, 'capability')).canStart, false);
  assert.equal(getCapabilityReadiness('verify', getAgentCentricSnapshot(6), 'XR-R21 · configuration assessment').canStart, false);
});

test('exact-scope resume avoids treating an individual job as domain-wide coverage', () => {
  const model = getAgentCentricSnapshot(2);
  assert.equal(findExistingWork('assess', 'XR-R07 · route-policy WAN-IMPORT', model)?.id, 'ROUTE-104');
  assert.equal(findExistingWork('assess', 'xr-r07 / route-policy  WAN-IMPORT', model)?.id, 'ROUTE-104');
  assert.equal(findExistingWork('assess', 'Core', model), null);
  assert.equal(findExistingWork('assess', 'XR-R21 · configuration assessment', model), null);
  assert.equal(getCapabilityReadiness('assess', model, 'Core').canStart, false);
  assert.equal(getCapabilityReadiness('assess', model, 'XR-R21 · configuration assessment').canStart, true);
  assert.equal(findExistingWork('investigate', 'Metro East · reachability investigation', model)?.id, 'REACH-319');
});

test('a governance persona without delegated change authority is not given a production approval', () => {
  const model = getAgentCentricSnapshot(2, 'no-authority');
  assert.deepEqual(model.decisions, []);
  assert.equal(model.assignedDecisions[0].state, 'assigned');
  assert.equal(model.permissions.reviewChange, false);
  assert.equal(model.proposal.reviewable, false);
  assert.equal(model.permissions.startReadOnly, true);
  assert.equal(getCapabilityReadiness('assess', model).canStart, true);
});

test('only confirmed terminal results leave active issues; their evidence remains reachable', () => {
  const verifying = getAgentCentricSnapshot(6), verified = getAgentCentricSnapshot(7);
  assert.ok(verifying.issues.some(issue => issue.id === 'config-route'));
  assert.equal(verified.issues.some(issue => issue.id === 'config-route'), false);
  assert.ok(verified.history.some(job => job.id === 'ROUTE-104'));
  assert.ok(verified.actions.some(record => record.id === 'outcome-verified'));
  assert.ok(verified.issues.some(issue => issue.id === 'reachability'));
});

test('quiet assessed-scope snapshot has independent reachability proof and no global all-clear', () => {
  const quiet = getAgentCentricSnapshot(2, 'quiet');
  assert.deepEqual(quiet.issues, []);
  assert.deepEqual(quiet.decisions, []);
  assert.match(quiet.summary, /do not establish health across the network/);
  assert.ok(quiet.actions.some(record => record.job === 'REACH-319' && record.id === 'reachability-concluded'));
  assert.ok(quiet.jobs.find(job => job.id === 'REACH-319').resultEvidence.length);
  assert.match(quiet.jobs.find(job => job.id === 'REACH-319').observations[0].text, /independently established/);
  assert.equal(getAgentCentricSnapshot(7).jobs.find(job => job.id === 'REACH-319').status, 'Waiting for source access');
});

test('snapshots do not share mutable agent eligibility, issues or work evidence', () => {
  const first = getAgentCentricSnapshot(2);
  first.agents.cdd.eligibility = 'restricted';
  first.issues[0].title = 'modified';
  first.proposal.validation.push('modified');
  first.jobs[0].steps.push('modified');
  const next = getAgentCentricSnapshot(2);
  assert.equal(next.agents.cdd.eligibility, 'eligible');
  assert.notEqual(next.issues[0].title, 'modified');
  assert.equal(next.proposal.validation.includes('modified'), false);
  assert.equal(next.jobs[0].steps.includes('modified'), false);
});

test('all declared branches expose coherent agent-linked records and retain explicit required scope', () => {
  for (const variant of AGENT_VARIANTS) {
    const model = getAgentCentricSnapshot(2, variant.id, { proposalVersion: variant.id === 'changed' ? 2 : 1 });
    for (const record of model.actions) {
      assert.ok(AGENTS[record.agentId]);
      assert.ok(record.scope && record.authority && record.record);
    }
    for (const issue of model.issues) assert.ok(model.jobs.some(job => job.id === issue.jobId && job.issueId === issue.id));
  }
});
