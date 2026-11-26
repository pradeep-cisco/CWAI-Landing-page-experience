import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, NETWORK_DOMAINS, summarizeJobs, filterJobs, groupJobs, getScopeStats, jobCategory, getScaleCapabilities, getScaleCapabilityReadiness, scopeDomainId, getScopedSuggestions } from '../src/features/agent-centric/agent-scale-model.js';

const scale = (scene = 2, variant = 'main', options) => buildScaleSnapshot(getAgentCentricSnapshot(scene, variant, options));

test('the inventory contains exactly 13,523 devices in eight distinct device groups with explicit observation coverage', () => {
  const model = scale();
  assert.equal(NETWORK_DOMAINS.length, 8);
  assert.equal(new Set(NETWORK_DOMAINS.map(domain => domain.id)).size, 8);
  assert.equal(NETWORK_DOMAINS.reduce((sum, domain) => sum + domain.deviceCount, 0), 13523);
  assert.equal(model.network.deviceCount, 13523);
  assert.equal(model.network.currentDeviceCount, 13395);
  assert.match(model.network.coverageNote, /Coverage does not establish health/);
});

test('scale adds independent work without modifying the original snapshot or its route proposal', () => {
  const original = getAgentCentricSnapshot(2);
  const retained = structuredClone(original);
  const model = buildScaleSnapshot(original);
  assert.deepEqual(original, retained);
  assert.deepEqual(model.proposal, retained.proposal);
  assert.equal(model.jobs.length, 168);
  assert.ok(model.issues.length > 100);
  assert.ok(model.jobs.length > model.issues.length);
  assert.equal(new Set(model.jobs.map(job => job.id)).size, model.jobs.length);
  for (const job of model.jobs) {
    assert.ok(model.agents[job.agentId]);
    assert.ok(NETWORK_DOMAINS.some(domain => domain.id === job.domainId));
    assert.ok(job.scope && job.checkpoint && job.source && job.authority && job.health);
  }
});

test('multiple jobs on one issue retain the same device and domain rather than invent a shared cause', () => {
  const model = scale();
  const multi = model.issues.filter(issue => issue.jobIds.length > 1);
  assert.ok(multi.length > 20);
  for (const issue of multi) {
    const jobs = model.jobs.filter(job => job.issueId === issue.id);
    assert.equal(new Set(jobs.map(job => job.domainId)).size, 1);
    assert.equal(new Set(jobs.map(job => job.deviceId)).size, 1);
  }
});

test('exactly 18 investigations share a historical-source dependency across three domains', () => {
  const model = scale();
  const dependency = model.dependencies.find(item => item.id === 'event-archive');
  assert.equal(dependency.jobIds.length, 18);
  assert.deepEqual(new Set(dependency.domainIds), new Set(['metro-east', 'west', 'north']));
  const jobs = model.jobs.filter(job => dependency.jobIds.includes(job.id));
  assert.equal(jobs.length, 18);
  assert.ok(jobs.every(job => job.agentId === 'troubleshooter' && jobCategory(job) === 'waiting'));
  assert.match(dependency.detail, /root causes remain independent/);
  assert.ok(model.jobs.some(job => job.agentId === 'troubleshooter' && jobCategory(job) === 'running'));
});

test('job state counts partition the actual data and are recomputed after a decision changes', () => {
  const model = scale();
  const counts = summarizeJobs(model.jobs);
  assert.deepEqual(counts, { total: 168, running: 117, waiting: 24, review: 6, completed: 21 });
  assert.equal(counts.running + counts.waiting + counts.review + counts.completed, counts.total);
  const jobs = model.jobs.map(job => job.id === 'REVIEW-501' ? { ...job, status: 'Decision submitted' } : job);
  const updated = summarizeJobs(jobs);
  assert.equal(updated.review, counts.review - 1);
  assert.equal(updated.waiting, counts.waiting + 1);
  assert.equal(updated.completed, counts.completed);
});

test('six review decisions each point to one job and supplemental proposals have exact targets and versioned bounds', () => {
  const model = scale();
  assert.equal(model.decisions.length, 6);
  for (const decision of model.decisions) {
    const job = model.jobs.find(item => item.id === decision.jobId);
    assert.ok(job);
    assert.equal(job.issueId, decision.issueId);
    assert.equal(job.domainId, decision.domainId);
    assert.equal(job.scope, decision.scope);
    if (decision.kind === 'job-review') {
      assert.deepEqual(job.proposal.targets, [job.deviceId]);
      assert.equal(job.proposal.version, 1);
      assert.ok(job.proposal.boundary.includes(job.deviceId));
      assert.ok(job.proposal.verification.length > 0);
      assert.equal(job.proposal.scope, job.scope);
      assert.equal(job.canReview, true);
    }
  }
});

test('grouping preserves every job exactly once and identifies dependency versus work-type grouping', () => {
  const model = scale();
  const groups = groupJobs(model.jobs, model.issues);
  assert.ok(groups.length < model.jobs.length);
  assert.equal(groups[0].id, 'routing-correction');
  const ids = groups.flatMap(group => group.jobIds);
  assert.equal(ids.length, model.jobs.length);
  assert.equal(new Set(ids).size, model.jobs.length);
  assert.deepEqual(new Set(ids), new Set(model.jobs.map(job => job.id)));
  assert.equal(groups.find(group => group.id === 'event-archive').basis, 'dependency');
  assert.equal(groups.find(group => group.id === 'configuration-checks').basis, 'work-type');
  assert.ok(groups.every(group => group.count === group.jobs.length && group.counts.total === group.count));
});

test('domain, agent, state and text filters combine without changing the underlying records', () => {
  const model = scale();
  const filtered = filterJobs(model.jobs, { domainId: 'west', agentId: 'troubleshooter', status: 'waiting', query: 'archive' });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every(job => job.domainId === 'west' && job.agentId === 'troubleshooter' && jobCategory(job) === 'waiting' && /archive/i.test(job.source)));
  assert.equal(filterJobs(model.jobs, { query: 'ROUTE-104' })[0].id, 'ROUTE-104');
  assert.equal(filterJobs(model.jobs, { domainId: 'missing' }).length, 0);
  assert.equal(model.jobs.length, 168);
});

test('scope statistics follow actual jobs, open issues and outstanding decisions', () => {
  const model = scale();
  const all = getScopeStats(model);
  assert.equal(all.jobCount, model.jobs.length);
  assert.equal(all.issueCount, model.issues.length);
  assert.equal(all.reviewCount, model.decisions.length);
  const domainTotals = NETWORK_DOMAINS.map(domain => getScopeStats(model, domain.id));
  for (const key of ['deviceCount', 'jobCount', 'issueCount', 'reviewCount', 'currentDeviceCount']) {
    assert.equal(domainTotals.reduce((sum, domain) => sum + domain[key], 0), all[key]);
  }
  const updated = { ...model, decisions: model.decisions.filter(decision => decision.jobId !== 'REVIEW-501') };
  assert.equal(getScopeStats(updated).reviewCount, all.reviewCount - 1);
});

test('quiet is confined to assessed scopes and introduces no fleet work or pending approvals', () => {
  const model = scale(7, 'quiet');
  assert.equal(model.jobs.length, 3);
  assert.equal(model.issues.length, 0);
  assert.equal(model.decisions.length, 0);
  assert.equal(model.dependencies.length, 0);
  assert.equal(summarizeJobs(model.jobs).completed, 3);
  assert.equal(model.network.scope, 'Assessed scopes');
  assert.match(model.summary, /do not establish health across the network/);
});

test('source interruption retains fleet records but never exposes current coverage or grants approval/start permission', () => {
  const model = scale(2, 'offline');
  assert.equal(model.jobs.length, 168);
  assert.ok(model.jobs.every(job => job.current === false));
  assert.equal(model.network.currentDeviceCount, null);
  assert.equal(getScopeStats(model).currentDeviceCount, null);
  assert.equal(model.permissions.reviewChange, false);
  assert.equal(model.permissions.startReadOnly, false);
  assert.equal(model.decisions.length, 0);
  assert.ok(model.assignedDecisions.length > 0);
  assert.ok(model.jobs.filter(job => job.proposal).every(job => !job.canReview));
});

test('a reviewer without authority sees assigned review work without gaining decision permissions', () => {
  const model = scale(2, 'no-authority');
  assert.equal(model.decisions.length, 0);
  assert.equal(model.assignedDecisions.length, 6);
  assert.equal(model.permissions.reviewChange, false);
  assert.ok(model.jobs.filter(job => job.proposal).every(job => !job.canReview));
});

test('route scene progression never advances the independent fleet or heals the archive dependency', () => {
  const first = scale(2), last = scale(7);
  assert.equal(last.jobs.find(job => job.id === 'ROUTE-104').status, 'Verified');
  assert.deepEqual(last.jobs.filter(job => job.id.startsWith('JOB-')), first.jobs.filter(job => job.id.startsWith('JOB-')));
  assert.deepEqual(last.dependencies, first.dependencies);
  assert.equal(last.decisions.length, 5);
});

test('investigation and assessment expose each exact domain scope, while verification stays tied to completed change evidence', () => {
  const model = scale();
  const capabilities = getScaleCapabilities(model);
  for (const id of ['investigate', 'assess']) {
    const capability = capabilities.find(item => item.id === id);
    for (const domain of NETWORK_DOMAINS) {
      const scope = `${domain.name} · all devices`;
      assert.ok(capability.scopeOptions.includes(scope));
      const ready = getScaleCapabilityReadiness(id, model, scope);
      assert.equal(ready.canStart, true);
      assert.match(ready.reason, /does not establish device group health or authorize changes/);
      assert.equal(scopeDomainId(scope), domain.id);
    }
  }
  const verify = capabilities.find(item => item.id === 'verify');
  assert.equal(verify.scopeOptions.length, 1);
  assert.equal(getScaleCapabilityReadiness('verify', model, 'Core · all devices').canStart, false);
  assert.equal(getScaleCapabilityReadiness('verify', model, verify.defaultScope).canStart, false);
  assert.equal(getScaleCapabilityReadiness('verify', scale(6), verify.defaultScope).canStart, true);
});

test('domain assignments require exact declared scope and current read-only authority, capability and eligibility', () => {
  assert.equal(getScaleCapabilityReadiness('investigate', scale(), 'North · all devices except XR-R21').canStart, false);
  assert.equal(getScaleCapabilityReadiness('investigate', scale(), 'North').canStart, false);
  assert.equal(getScaleCapabilityReadiness('investigate', scale(2, 'offline'), 'North · all devices').canStart, false);
  assert.equal(getScaleCapabilityReadiness('investigate', scale(2, 'main', { agentEligibility: { troubleshooter: 'restricted' } }), 'North · all devices').canStart, false);
  const noPermission = scale();
  noPermission.permissions.startReadOnly = false;
  assert.equal(getScaleCapabilityReadiness('assess', noPermission, 'West · all devices').canStart, false);
  const unhealthy = scale();
  unhealthy.agents.cdd.health = 'Analysis unavailable';
  assert.equal(getScaleCapabilityReadiness('assess', unhealthy, 'West · all devices').canStart, false);
});

test('scope identities cover original router and fleet records without treating an unknown scope as a default domain', () => {
  assert.equal(scopeDomainId('XR-R07 · route-policy WAN-IMPORT'), 'core');
  assert.equal(scopeDomainId('XR-R12 · configuration assessment'), 'west');
  assert.equal(scopeDomainId('XR-R21 · configuration assessment'), 'north');
  assert.equal(scopeDomainId('Metro East · reachability investigation'), 'metro-east');
  assert.equal(scopeDomainId('XR-ASIA-PACIFIC-0109 · route-policy WAN-IMPORT'), 'asia-pacific');
  assert.equal(scopeDomainId('Unknown tenant · all devices'), null);
});
test('submitted requests wait for acknowledgement and issue search retains jobs owned by different agents', () => {
  assert.equal(jobCategory({ status: 'Request submitted' }), 'waiting');
  assert.equal(jobCategory({ status: 'Assessing' }), 'running');
  const model = buildScaleSnapshot(getAgentCentricSnapshot(2));
  const related = filterJobs(model.jobs, { query: 'ISSUE-1003' });
  assert.equal(related.length, 2);
  assert.equal(new Set(related.map(job => job.agentId)).size, 2);
  assert.equal(new Set(related.map(job => job.deviceId)).size, 1);
});

test('all eight agent types own distinct, inspectable jobs in the large-network scenario', () => {
  const model = scale();
  assert.deepEqual(new Set(Object.keys(model.agents)), new Set(['cdd', 'toxic', 'troubleshooter', 'remediation', 'correlation', 'vulnerability', 'capacity', 'assurance']));
  for (const agent of Object.values(model.agents)) {
    const jobs = model.jobs.filter(job => job.agentId === agent.id);
    assert.ok(jobs.length > 0, `${agent.id} has current or recorded work`);
    assert.ok(jobs.some(job => jobCategory(job) !== 'completed'), `${agent.id} has open work`);
    assert.ok(jobs.every(job => job.agent === agent.name && job.finding && Array.isArray(job.evidence) && job.nextStep));
  }
  assert.equal(getScaleCapabilities().length, 8);
  assert.equal(new Set(getScaleCapabilities().map(capability => capability.agentId)).size, 8);
});

test('correlation creates only explicitly classified incidents with exact job, issue, target and evidence links', () => {
  const model = scale();
  const jobs = model.jobs.filter(job => job.agentId === 'correlation');
  const classified = jobs.filter(job => job.incidentId);
  assert.ok(classified.length > 0 && classified.length < jobs.length);
  for (const job of jobs) {
    const incident = model.incidents.find(item => item.job === job.id);
    if (!job.incidentId) { assert.equal(incident, undefined); continue; }
    assert.ok(incident);
    assert.equal(incident.id, job.incidentId);
    assert.equal(incident.issueId, job.issueId);
    assert.equal(incident.deviceId, job.deviceId);
    assert.equal(incident.state, 'active');
    assert.equal(incident.current, true);
    assert.match(incident.classification, /CORR-LINK-01/);
    assert.match(incident.evidence, /does not establish root cause/);
  }
  assert.equal(filterJobs(model.jobs, { query: classified[0].incidentId })[0].id, classified[0].id);
  const offline = scale(2, 'offline');
  assert.ok(offline.incidents.filter(item => item.id.startsWith('INC-CORR-')).every(item => item.current === false));
});

test('risk and service findings retain evidence limits instead of inventing causes, compromise or network-wide health', () => {
  const model = scale();
  const active = id => model.jobs.find(job => job.agentId === id && jobCategory(job) !== 'completed');
  const toxic = active('toxic');
  assert.match(toxic.finding, /associated/);
  assert.match(toxic.evidence.join(' '), /does not establish root cause/);
  assert.match(toxic.nextStep, /troubleshooting evidence/);
  const vulnerability = active('vulnerability');
  assert.match(vulnerability.evidence.join(' '), /enabled-feature observation/);
  assert.match(vulnerability.nextStep, /does not establish exploitability or compromise/);
  assert.equal(vulnerability.canReview, false);
  const capacity = active('capacity');
  assert.match(capacity.finding, /61% to 82%/);
  assert.match(capacity.evidence.join(' '), /not a forecast/);
  const assurance = active('assurance');
  assert.match(assurance.evidence.join(' '), /48 ms against a 40 ms/);
  assert.match(assurance.nextStep, /topology alone is insufficient/);
  const verification = model.jobs.find(job => job.agentId === 'remediation' && job.id.startsWith('JOB-'));
  assert.equal(verification.operation.state, 'completed');
  assert.match(verification.authority, /read-only verification/);
  assert.ok(model.suggestions.length <= 2);
  assert.ok(model.suggestions.every(item => model.jobs.some(job => job.id === item.jobId && job.agentId === item.agentId)));
});

test('new agent restrictions gate only new assignments while retaining job ownership, health and findings', () => {
  const before = scale();
  const after = buildScaleSnapshot(getAgentCentricSnapshot(2), { agentEligibility: { toxic: 'restricted', vulnerability: 'restricted', capacity: 'restricted', assurance: 'restricted', correlation: 'restricted' } });
  for (const id of ['toxic', 'vulnerabilities', 'capacity', 'services', 'correlate']) {
    const capability = getScaleCapabilities().find(item => item.id === id);
    const readiness = getScaleCapabilityReadiness(id, after, capability.defaultScope);
    assert.equal(readiness.canStart, false);
    assert.equal(readiness.state, 'restricted');
    assert.equal(after.agents[capability.agentId].health, 'Healthy');
    assert.deepEqual(after.jobs.filter(job => job.agentId === capability.agentId), before.jobs.filter(job => job.agentId === capability.agentId));
  }
});

test('every new capability needs a declared scope and live read-only authority without creating premature findings', () => {
  for (const id of ['correlate', 'toxic', 'vulnerabilities', 'capacity', 'services']) {
    const capability = getScaleCapabilities().find(item => item.id === id);
    assert.ok(capability.startLabel && capability.taskDescription && capability.requestCheckpoint && capability.requestStatus && capability.groupId);
    assert.equal(getScaleCapabilityReadiness(id, scale(), capability.defaultScope).canStart, true);
    assert.equal(getScaleCapabilityReadiness(id, scale(), 'Unknown tenant · all devices').canStart, false);
    assert.equal(getScaleCapabilityReadiness(id, scale(2, 'offline'), capability.defaultScope).canStart, false);
    const noPermission = scale();
    noPermission.permissions.startReadOnly = false;
    assert.equal(getScaleCapabilityReadiness(id, noPermission, capability.defaultScope).canStart, false);
  }
});


test('a specialist with both progressing and constrained jobs is shown as partly waiting', () => {
  const model = buildScaleSnapshot(getAgentCentricSnapshot(2));
  const jobs = filterJobs(model.jobs, { agentId: 'vulnerability' });
  const group = groupJobs(jobs, model.issues)[0];
  assert.ok(group.counts.running > 0 && group.counts.waiting > 0);
  assert.equal(group.status, 'Partly waiting');
});

test('a completed correlation assessment records a conclusion without inventing an incident', () => {
  const model = buildScaleSnapshot(getAgentCentricSnapshot(2));
  const completed = model.jobs.filter(job => job.agentId === 'correlation' && jobCategory(job) === 'completed');
  assert.ok(completed.length > 0);
  for (const job of completed) {
    assert.match(job.finding, /did not meet/);
    assert.doesNotMatch(job.finding, /pending|being compared/);
    assert.equal(job.incidentId, null);
    assert.ok(!model.incidents.some(incident => incident.job === job.id));
  }
});


test('a shared-source suggestion follows scoped investigations and opens a target in that domain', () => {
  const model = buildScaleSnapshot(getAgentCentricSnapshot(2));
  const suggestions = getScopedSuggestions(model, { domainId: 'west', agentId: 'troubleshooter' });
  const archive = suggestions.find(item => item.dependencyId === 'event-archive');
  const affected = model.jobs.filter(job => job.domainId === 'west' && job.dependencyId === 'event-archive');
  assert.ok(archive && affected.length > 0);
  assert.ok(archive.reason.startsWith(String(affected.length)));
  assert.equal(model.jobs.find(job => job.id === archive.jobId).domainId, 'west');
  assert.deepEqual(getScopedSuggestions(model, { domainId: 'west', agentId: 'capacity' }), []);
  assert.deepEqual(getScopedSuggestions(model, { domainId: 'west', dismissed: [archive.id] }), []);
});
