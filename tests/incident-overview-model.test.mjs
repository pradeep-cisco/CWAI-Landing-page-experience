import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot } from '../src/features/agent-centric/agent-scale-model.js';
import { buildIncidentSnapshot, getIncidentJobs } from '../src/features/agent-centric/incident-thread-model.js';
import { getIncidentOverview, getIncidentDetail } from '../src/features/agent-centric/incident-overview-model.js';

const snapshot = (state = 'review', variant = 'main') => buildIncidentSnapshot(buildScaleSnapshot(getAgentCentricSnapshot(2, variant)), state);
const detail = (state = 'review', variant = 'main', filters) => getIncidentDetail(snapshot(state, variant), 'INC-317', filters);

test('monitoring, review and verification display only actual stage membership', () => {
  const monitoring = detail('monitoring');
  assert.equal(monitoring.stateLabel, 'Investigating');
  assert.deepEqual(monitoring.progress.map(stage => [stage.id, stage.state, stage.jobIds.length]), [['investigate', 'running', 3], ['remediate', 'next', 0], ['verify', 'next', 0]]);
  assert.equal(monitoring.metric, null);
  assert.equal(monitoring.reviewJob, null);
  assert.equal(monitoring.jobCount, 3);
  const review = detail();
  assert.equal(review.state, 'review');
  assert.equal(review.stateLabel, 'Needs your review');
  assert.equal(review.reviewJob.id, 'R-41');
  assert.equal(review.actionRequired, true);
  assert.deepEqual(review.progress.map(stage => stage.state), ['completed', 'review', 'next']);
  const verification = detail('verification');
  assert.equal(verification.stateLabel, 'Verifying recovery');
  assert.deepEqual(verification.progress.map(stage => stage.state), ['completed', 'completed', 'running']);
  assert.equal(verification.metric.jobId, 'V-51');
  assert.equal(verification.metric.after, 68);
  assert.equal(verification.jobCount, 6);
  assert.match(verification.outcome.title, /within limits/);
  assert.match(verification.now, /stability|boundary/);
  assert.equal(verification.actionRequired, false);
});

test('the list contains separate explicitly recorded incidents with stable ordering', () => {
  const model = snapshot(), before = JSON.stringify(model);
  const overview = getIncidentOverview(model);
  assert.ok(overview.length > 3);
  assert.equal(overview[0].id, 'INC-317');
  assert.equal(overview[0].state, 'review');
  assert.equal(new Set(overview.map(incident => incident.id)).size, overview.length);
  assert.deepEqual(getIncidentOverview(model), overview);
  const generic = overview.find(incident => incident.id !== 'INC-317');
  assert.equal(generic.stateLabel, 'Monitoring incident');
  assert.equal(generic.jobCount, getIncidentJobs(model, generic.id).length);
  assert.equal(JSON.stringify(model), before);
});

test('filters scope list membership and actions without changing global incident membership', () => {
  const model = snapshot('verification');
  const scoped = getIncidentDetail(model, 'INC-317', { domainId: 'core' });
  assert.equal(scoped.jobCount, 6);
  assert.deepEqual(scoped.scopedJobIds, ['C-23', 'V-52']);
  assert.equal(scoped.inScopeJobCount, 2);
  assert.equal(scoped.metric, null);
  assert.doesNotMatch(scoped.outcome.title, /within limits/);
  assert.equal(getIncidentDetail(model, 'INC-317', { agentId: 'cdd' }), null);
  assert.equal(getIncidentOverview(model, { agentId: 'cdd' }).some(row => row.id === 'INC-317'), false);
  assert.equal(getIncidentOverview(model, { domainId: 'unavailable' }).length, 0);
  assert.equal(getIncidentDetail(model, 'INC-317', { agentId: 'unavailable' }), null);
  const capacityOnly = detail('review', 'main', { agentId: 'capacity' });
  assert.equal(capacityOnly.state, 'review');
  assert.equal(capacityOnly.reviewJob, null);
  assert.equal(capacityOnly.actionRequired, false);
  assert.match(capacityOnly.actionNote, /outside/);
});

test('source interruption qualifies proof and prevents active decisions', () => {
  const offline = detail('verification', 'offline');
  assert.equal(offline.current, false);
  assert.equal(offline.state, 'unknown');
  assert.equal(offline.stateLabel, 'Updates interrupted');
  assert.equal(offline.metric.current, false);
  assert.equal(offline.actionRequired, false);
  assert.ok(offline.progress.every(stage => !stage.jobIds.length || stage.state === 'unknown'));
  assert.doesNotMatch(offline.outcome.title, /within limits/);
  assert.equal(detail('review', 'offline').reviewJob, null);
  const denied = detail('review', 'no-authority');
  assert.equal(denied.stateLabel, 'Awaiting review');
  assert.equal(denied.reviewJob, null);
  assert.equal(denied.actionRequired, false);
});

test('submitted, held and confirmed approvals never imply a completed controller operation', () => {
  for (const [status, label] of [['Decision submitted', 'Confirming approval'], ['Held', 'Change held'], ['Checking', 'Checking prerequisites']]) {
    const model = snapshot();
    Object.assign(model.jobs.find(job => job.id === 'R-41'), { status, canReview: false });
    const incident = getIncidentDetail(model, 'INC-317');
    assert.equal(incident.stateLabel, label);
    assert.notEqual(incident.progress[1].state, 'completed');
    assert.equal(incident.progress[2].state, 'next');
    assert.equal(incident.metric, null);
    assert.equal(incident.reviewJob, null);
  }
  const model = snapshot();
  Object.assign(model.jobs.find(job => job.id === 'R-41'), { status: 'Complete', canReview: false });
  const unproven = getIncidentDetail(model, 'INC-317');
  assert.equal(unproven.stateLabel, 'Execution unconfirmed');
  assert.equal(unproven.progress[1].state, 'waiting');
});

test('metric evidence and incident closure each require their own records', () => {
  const model = snapshot('verification');
  model.jobs.find(job => job.id === 'V-51').resultMetrics.current = false;
  const lastKnown = getIncidentDetail(model, 'INC-317');
  assert.equal(lastKnown.metric.current, false);
  assert.doesNotMatch(lastKnown.outcome.title, /within limits/);
  delete model.jobs.find(job => job.id === 'V-51').resultMetrics.source;
  const noSource = getIncidentDetail(model, 'INC-317');
  assert.equal(noSource.metric, null);
  assert.doesNotMatch(noSource.outcome.title, /within limits/);
  Object.assign(model.jobs.find(job => job.id === 'V-52'), { status: 'Verified' });
  const completedJobs = getIncidentDetail(model, 'INC-317');
  assert.equal(completedJobs.stateLabel, 'Awaiting closure');
  assert.notEqual(completedJobs.state, 'completed');
  Object.assign(model.incidents.find(incident => incident.id === 'INC-317'), { state: 'resolved', resolution: { id: 'RES-317', summary: 'Exit criteria were confirmed.' } });
  assert.equal(getIncidentDetail(model, 'INC-317').state, 'completed');
});

test('similar scope alone never creates incident membership or a new incident row', () => {
  const model = snapshot(), before = getIncidentOverview(model);
  model.jobs.push({ ...model.jobs.find(job => job.id === 'C-21'), id: 'SAME-SCOPE-UNLINKED', incidentId: null });
  assert.deepEqual(getIncidentOverview(model), before);
  assert.equal(getIncidentDetail(model, 'INC-317').jobCount, 4);
  assert.equal(getIncidentDetail(model, 'MISSING'), null);
  assert.deepEqual(getIncidentOverview(snapshot('review', 'quiet')), []);
});

test('incident findings explain recorded observations separately from the response state', () => {
  const review = detail('review');
  assert.equal(review.finding.jobId, 'C-21');
  assert.match(review.finding.text, /92%.*observed window/);
  assert.match(review.finding.source, /08:00–08:05 UTC/);
  assert.equal(review.finding.kind, 'observation');
  assert.equal(review.finding.current, true);
  assert.equal(review.outcome.title, 'Path adjustment ready');
  const verification = detail('verification');
  assert.equal(verification.finding.jobId, 'V-51');
  assert.equal(verification.finding.kind, 'verification');
  assert.match(verification.finding.text, /92% → 68%/);
  assert.equal(verification.stateLabel, 'Verifying recovery');
  const overview = getIncidentOverview(snapshot());
  assert.equal(overview.find(row => row.id === 'INC-317').finding.jobId, 'C-21');
  assert.equal(overview.filter(row => row.featured).length, 1);
});

test('landing findings cannot expose measurements outside the selected scope or without provenance', () => {
  const model = snapshot('verification');
  const core = getIncidentDetail(model, 'INC-317', { domainId: 'core' });
  assert.equal(core.finding.jobId, 'C-23');
  assert.doesNotMatch(core.finding.text, /92%|68%/);
  assert.equal(detail('review', 'main', { agentId: 'remediation' }).finding, null, 'a proposal alone is not an observed network finding');
  const review = snapshot('review');
  delete review.jobs.find(job => job.id === 'C-21').source;
  const sourced = getIncidentDetail(review, 'INC-317');
  assert.notEqual(sourced.finding?.jobId, 'C-21');
  assert.doesNotMatch(sourced.finding?.text || '', /92%/);
  assert.equal(detail('review', 'offline').finding.current, false);
});

test('a verification finding requires an actual sourced verified result and retains its freshness qualification', () => {
  const model = snapshot('verification'), result = model.jobs.find(job => job.id === 'V-51');
  result.status = 'Verifying';
  assert.doesNotMatch(getIncidentDetail(model, 'INC-317').finding?.text || '', /68%/);
  result.status = 'Verified';
  result.resultMetrics.current = false;
  assert.equal(getIncidentDetail(model, 'INC-317').finding.current, false);
  delete result.resultMetrics.source;
  assert.doesNotMatch(getIncidentDetail(model, 'INC-317').finding?.text || '', /68%/);
});
