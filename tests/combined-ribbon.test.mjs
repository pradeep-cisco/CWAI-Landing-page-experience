import test from 'node:test';
import assert from 'node:assert/strict';
import { COMBINED_SCENES, COMBINED_VARIANTS, getCombinedSnapshot } from '../src/features/combined/combined-model.js';
import { NETWORK_SCOPE_DESTINATIONS, getRibbonNetwork, getWorkNetworkScope, relatedWorkIds } from '../src/features/combined/ribbon-model.js';

const currentNetwork = () => getRibbonNetwork(getCombinedSnapshot(2));

test('incident context is carried independently of router reachability and is never inferred from a job title', () => {
  const network = currentNetwork();
  assert.equal(network.incidents[0].id, 'INC-104');
  assert.equal(network.incidents[0].domainId, 'Core');
  assert.equal(network.domains.find(domain => domain.id === 'Core').condition, 'normal');
  assert.deepEqual(getRibbonNetwork({ scene: 2, sourceState: 'current', jobs: [{ id: 'ROUTE-104', title: 'Incident' }] }).incidents, []);
});

test('the standalone logical topology has six stable, normalized, separated anchors', () => {
  const network = currentNetwork();
  assert.deepEqual(network.domains.map(domain => domain.id), ['West', 'Core', 'East', 'North', 'South', 'Metro']);
  assert.deepEqual(network.domains.map(({ id, x, y }) => [id, x, y]), [
    ['West', 12, 50], ['Core', 40, 50], ['East', 78, 50], ['North', 54, 16], ['South', 30, 84], ['Metro', 84, 84],
  ]);
  for (const domain of network.domains) {
    assert.ok(Number.isFinite(domain.x) && domain.x >= 0 && domain.x <= 100);
    assert.ok(Number.isFinite(domain.y) && domain.y >= 0 && domain.y <= 100);
    assert.equal(domain.label, domain.id);
  }
  assert.equal(new Set(network.domains.map(domain => `${domain.x},${domain.y}`)).size, 6);
});

test('logical connections have unique identities, existing endpoints, and no condition inferred from work', () => {
  const network = currentNetwork();
  const domains = new Set(network.domains.map(item => item.id));
  assert.equal(new Set(network.connections.map(item => item.id)).size, network.connections.length);
  const pairs = new Set();
  for (const connection of network.connections) {
    assert.ok(domains.has(connection.from));
    assert.ok(domains.has(connection.to));
    assert.notEqual(connection.from, connection.to);
    const pair = [connection.from, connection.to].sort().join(':');
    assert.ok(!pairs.has(pair));
    pairs.add(pair);
    assert.match(connection.label, /logical connection/);
    assert.equal(connection.condition, undefined);
  }
  const reached = new Set([network.domains[0].id]);
  for (let pass = 0; pass < network.domains.length; pass += 1) {
    for (const { from, to } of network.connections) {
      if (reached.has(from)) reached.add(to);
      if (reached.has(to)) reached.add(from);
    }
  }
  assert.equal(reached.size, domains.size);
});

test('the representative hierarchy is unique and reaches interface inspection without implying interface health', () => {
  const network = currentNetwork();
  const identities = new Set();
  for (const domain of network.domains) {
    assert.ok(domain.groups.length > 0);
    for (const group of domain.groups) {
      assert.ok(!identities.has(group.id));
      identities.add(group.id);
      assert.ok(group.routers.length > 0);
      for (const router of group.routers) {
        assert.ok(!identities.has(router.id));
        identities.add(router.id);
        assert.ok(router.interfaces.length > 0);
        for (const port of router.interfaces) {
          assert.ok(!identities.has(port.id));
          identities.add(port.id);
          assert.ok(port.id.startsWith(`${router.id}:`));
          assert.match(port.detail, /Interface condition is not established/);
        }
      }
    }
  }
});

test('known work has exact declared domain, group, and device scope', () => {
  const network = currentNetwork();
  for (const [id, domainId, groupId, deviceId] of [
    ['ROUTE-104', 'Core', 'DG-CORE-01', 'XR-R07'],
    ['CHECK-208', 'West', 'DG-WEST-01', 'XR-R12'],
    ['REACH-319', 'East', 'DG-EAST-01', 'XR-R19'],
  ]) {
    const scope = getWorkNetworkScope(id);
    assert.equal(scope.kind, 'domain');
    assert.deepEqual(scope.domainIds, [domainId]);
    assert.deepEqual(scope.groupIds, [groupId]);
    assert.deepEqual(scope.deviceIds, [deviceId]);
    const domain = network.domains.find(item => item.id === domainId);
    const group = domain.groups.find(item => item.id === groupId);
    assert.ok(group.routers.some(item => item.id === deviceId));
  }
  assert.equal(network.domains.find(item => item.id === 'East').groups[0].label, 'Metro East');
});

test('approval, drift, source waits, execution uncertainty, partial results, and capability loss do not recolor domains', () => {
  const anchors = currentNetwork().domains.map(({ id, x, y }) => ({ id, x, y }));
  for (const variant of COMBINED_VARIANTS.filter(item => item.id !== 'offline')) {
    for (const scene of COMBINED_SCENES) {
      const snapshot = getCombinedSnapshot(scene.id, variant.id);
      const network = getRibbonNetwork(snapshot);
      assert.equal(network.sourceState, 'current');
      assert.ok(network.domains.every(domain => domain.condition === 'normal'));
      assert.ok(network.domains.every(domain => domain.conditionLabel === 'Observed reachable'));
      assert.deepEqual(network.domains.map(({ id, x, y }) => ({ id, x, y })), anchors);
      assert.match(network.domains.find(domain => domain.id === 'East').observation, /representative router/);
    }
  }
});

test('network condition ignores mutable job tones, failed outcome criteria, and authority labels', () => {
  const snapshot = getCombinedSnapshot(6);
  const expected = getRibbonNetwork(snapshot);
  snapshot.jobs.forEach(job => { job.status = 'Failed'; job.tone = 'negative'; job.health = 'Unhealthy'; });
  snapshot.criteria.forEach(criterion => { criterion.state = 'failed'; });
  snapshot.proposal.authority = 'Revoked';
  snapshot.decisions.push({ job: 'ROUTE-104', title: 'Urgent approval', tone: 'negative' });
  assert.deepEqual(getRibbonNetwork(snapshot), expected);
});

test('a verified job does not produce a network-wide all-clear or stronger network observation', () => {
  const before = getRibbonNetwork(getCombinedSnapshot(6));
  const after = getRibbonNetwork(getCombinedSnapshot(7));
  assert.deepEqual(after.domains, before.domains);
  assert.deepEqual(after.connections, before.connections);
  for (const domain of after.domains) {
    assert.match(domain.observation, /not every device or service/);
    assert.doesNotMatch(domain.conditionLabel, /healthy|all.clear|verified|restored/i);
  }
});

test('offline marks current observations unavailable while retaining the last confirmed sample and topology', () => {
  const lastKnown = getRibbonNetwork(getCombinedSnapshot(6));
  const interrupted = getRibbonNetwork(getCombinedSnapshot(2, 'offline'));
  assert.equal(interrupted.sourceState, 'interrupted');
  assert.equal(interrupted.lastConfirmed, '08:05:20 UTC');
  assert.equal(interrupted.lastConfirmed, lastKnown.lastConfirmed);
  assert.equal(interrupted.sourceLabel, lastKnown.sourceLabel);
  assert.deepEqual(interrupted.connections, lastKnown.connections);
  for (const domain of interrupted.domains) {
    const prior = lastKnown.domains.find(item => item.id === domain.id);
    assert.equal(domain.condition, 'unavailable');
    assert.equal(domain.conditionLabel, 'Current observations unavailable');
    assert.ok(domain.observation.includes(prior.observation));
    assert.match(domain.observation, /Last confirmed at 08:05:20 UTC/);
    assert.match(domain.observation, /Current reachability cannot be established/);
    assert.deepEqual(domain.groups, prior.groups);
  }
});

test('missing or unrecognized source state does not establish current network visibility', () => {
  for (const snapshot of [undefined, null, {}, { scene: 2 }, { sourceState: 'unknown' }]) {
    const network = getRibbonNetwork(snapshot);
    assert.equal(network.sourceState, 'interrupted');
    assert.ok(network.domains.every(domain => domain.condition === 'unavailable'));
  }
});

test('scope lenses match only declared scope, independent of titles and display labels', () => {
  const jobs = getCombinedSnapshot(2).jobs;
  jobs[0].scope = 'East';
  jobs[1].title = 'Core network incident';
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'domain', id: 'Core' }), ['ROUTE-104']);
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'domain', id: 'West' }), ['CHECK-208']);
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'domain', id: 'East' }), ['REACH-319']);
  for (const id of ['North', 'South', 'Metro']) assert.deepEqual(relatedWorkIds(jobs, { kind: 'domain', id }), []);
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'cross-domain' }), []);
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'platform' }), []);
});

test('unknown or nongeographic work is safely placed in Platform without guessed geography', () => {
  for (const id of ['UNKNOWN', 'ROUTE-104-extra', 'Core', 'toString', '__proto__', '', undefined, null]) {
    assert.deepEqual(getWorkNetworkScope(id), { kind: 'platform', domainIds: [], groupIds: [], deviceIds: [], label: 'Platform' });
  }
  const jobs = [...getCombinedSnapshot(2).jobs, { id: 'INTEGRATION-1', title: 'Core integration issue' }, { id: 'ROUTE-104-extra' }];
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'platform' }), ['INTEGRATION-1', 'ROUTE-104-extra']);
  assert.deepEqual(relatedWorkIds(jobs, { kind: 'domain', id: 'Core' }), ['ROUTE-104']);
});

test('invalid scope selections do not silently match all work', () => {
  const jobs = getCombinedSnapshot(2).jobs;
  for (const scope of [undefined, null, {}, 'Core', { kind: 'domain' }, { kind: 'domain', id: 'core' }, { kind: 'domain', id: 'Unknown' }, { kind: 'group', id: 'DG-CORE-01' }, { kind: 'platform', id: 'Unknown' }, { kind: 'cross-domain', id: 'Unknown' }]) {
    assert.deepEqual(relatedWorkIds(jobs, scope), []);
  }
  assert.deepEqual(relatedWorkIds(null, { kind: 'domain', id: 'Core' }), []);
  assert.deepEqual(relatedWorkIds([...jobs, jobs[0], null, {}], { kind: 'domain', id: 'Core' }), ['ROUTE-104']);
});

test('nongeographic destinations are explicit, stable, and independent of domain inventory', () => {
  assert.deepEqual(NETWORK_SCOPE_DESTINATIONS, [
    { id: 'cross-domain', kind: 'cross-domain', label: 'Cross-domain' },
    { id: 'platform', kind: 'platform', label: 'Platform' },
  ]);
  assert.ok(Object.isFrozen(NETWORK_SCOPE_DESTINATIONS));
  assert.ok(NETWORK_SCOPE_DESTINATIONS.every(Object.isFrozen));
  for (const destination of NETWORK_SCOPE_DESTINATIONS) assert.deepEqual(relatedWorkIds(getCombinedSnapshot(2).jobs, destination), []);
});

test('model results are deterministic, isolated, and do not mutate the Combined snapshot', () => {
  const snapshot = getCombinedSnapshot(2);
  const initialSnapshot = structuredClone(snapshot);
  const expected = currentNetwork();
  const mutated = getRibbonNetwork(snapshot);
  mutated.domains[0].label = 'Changed';
  mutated.domains[0].groups[0].routers[0].interfaces[0].detail = 'Changed';
  mutated.connections[0].from = 'Changed';
  mutated.sourceLabel = 'Changed';
  const scope = getWorkNetworkScope('ROUTE-104');
  scope.domainIds[0] = 'Changed';
  scope.groupIds[0] = 'Changed';
  scope.deviceIds[0] = 'Changed';
  relatedWorkIds(snapshot.jobs, { kind: 'domain', id: 'Core' });
  assert.deepEqual(getRibbonNetwork(snapshot), expected);
  assert.deepEqual(snapshot, initialSnapshot);
  assert.deepEqual(getWorkNetworkScope('ROUTE-104').domainIds, ['Core']);
  assert.deepEqual(getWorkNetworkScope('ROUTE-104').groupIds, ['DG-CORE-01']);
  assert.deepEqual(getWorkNetworkScope('ROUTE-104').deviceIds, ['XR-R07']);
});
