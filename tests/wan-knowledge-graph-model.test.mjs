import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as scale from '../src/features/wan/model/scale.js';
import { createAgentState, enterAgentFrame } from '../src/features/wan/model/agentic-model.js';
import {
  buildKnowledgeGraph, searchNodes, graphNeighborhood, executeKnowledgeQuery,
  QUERY_EXAMPLES, NODE_TYPES, RELATIONSHIP_TYPES,
} from '../src/features/wan/admin/knowledge-graph-model.js';

afterEach(() => scale.setActiveWanSetup('national'));
const at = (frame = 5, overrides = {}) => enterAgentFrame(createAgentState({
  networkContext: { ...scale.MONITORING_CONTEXT }, ...overrides,
}), frame);

test('graph inventories reconcile with each WAN and every relationship has supplied endpoints', () => {
  for (const { id } of scale.WAN_SETUPS) {
    scale.setActiveWanSetup(id);
    const graph = buildKnowledgeGraph(at());
    assert.equal(graph.wanId, id);
    assert.equal(graph.prototype, true);
    assert.equal(graph.counts.NetworkDevice, scale.DEVICES.length);
    assert.equal(graph.counts.Interface, scale.INTERFACES.length);
    assert.equal(graph.counts.Service, 1, 'do not fabricate service records for every router');
    assert.equal(graph.counts.Config, 3, 'only the intended, observed and policy-intent records are supplied');
    assert.equal(graph.nodeById.size, graph.nodes.length);
    assert.equal(new Set(graph.edges.map(edge => edge.id)).size, graph.edges.length);
    assert.equal(graph.edges.filter(edge => edge.type === 'RUNS_SERVICE').length, 0, 'interface scope is not proof of service hosting');
    for (const edge of graph.edges) {
      assert.ok(graph.nodeById.has(edge.from), edge.id);
      assert.ok(graph.nodeById.has(edge.to), edge.id);
      assert.ok(RELATIONSHIP_TYPES.includes(edge.type));
    }
    for (const node of graph.nodes) {
      assert.ok(NODE_TYPES.includes(node.type));
      assert.deepEqual(node.schemaCoverage.missing, [], node.id);
      assert.deepEqual(node.schemaCoverage.extra, [], node.id);
    }
  }
});

test('source loss retains last-known data without copying metrics to its peer', () => {
  const graph = buildKnowledgeGraph(at(5, { gap: 'west' }));
  const port = graph.nodeById.get('XR-P1:HundredGigE0/0/0/0');
  assert.equal(port.fresh, false);
  assert.equal(port.sourceTime, '07:58');
  assert.equal(port.attributes.observation_state, 'Last known');
  assert.equal(port.attributes.outbound_utilization, 73);
  const peer = graph.nodeById.get('XR-P2:HundredGigE0/0/0/1');
  assert.equal(peer.attributes.outbound_utilization, undefined);
  assert.equal(graph.nodeById.get('SR-PE-W1-PE-E1').fresh, false);
  assert.equal(graph.nodeById.get('XR-P1').attributes.reachable, true);
  assert.equal(graph.nodeById.get('XR-P1').attributes.telemetry_state, 'Unavailable');
  const critical = buildKnowledgeGraph(at(5, { gap: 'east', critical: true }));
  assert.equal(critical.nodeById.get('XR-PE-E2').attributes.reachable, false);
  assert.equal(critical.nodeById.get('XR-PE-E2').attributes.reachability_observed_at, '08:05');
});

test('search is exact-first, bounded and tied to the current inventory', () => {
  const graph = buildKnowledgeGraph(at());
  const all = searchNodes(graph, '', 'NetworkDevice', 12);
  assert.equal(all.items.length, 12);
  assert.equal(all.total, scale.DEVICES.length);
  assert.equal(all.omitted, all.total - 12);
  assert.equal(searchNodes(graph, 'XR-P1').items[0].id, 'XR-P1');
  assert.equal(searchNodes(graph, 'not-a-real-entity').total, 0);
  assert.equal(searchNodes(graph, '', 'Config', 1000).items.length, 3);
  assert.equal(searchNodes(graph, '', 'Interface', 1000).items.length, 100);
});

test('neighborhood traversal is bounded, bidirectional and relationship-filtered', () => {
  const graph = buildKnowledgeGraph(at());
  const one = graphNeighborhood(graph, 'XR-P1', 1, ['HAS_INTERFACE']);
  assert.equal(one.nodes.length, scale.deviceInterfaces('XR-P1').length + 1);
  assert.ok(one.edges.every(edge => edge.type === 'HAS_INTERFACE' && edge.from === 'XR-P1'));
  const reverse = graphNeighborhood(graph, 'XR-P1:HundredGigE0/0/0/0', 1, ['HAS_INTERFACE']);
  assert.ok(reverse.nodes.some(node => node.id === 'XR-P1'));
  const two = graphNeighborhood(graph, 'XR-P1', 2, RELATIONSHIP_TYPES, 3);
  assert.equal(two.nodes.length, 3);
  assert.equal(two.nodes[0].id, 'XR-P1');
  assert.ok(two.total > two.nodes.length);
  assert.equal(two.omitted, two.total - 3);
  assert.equal(two.distances.get('SR-PE-W1-PE-E1'), 2);
  const ids = new Set(two.nodes.map(node => node.id));
  assert.ok(two.edges.every(edge => ids.has(edge.from) && ids.has(edge.to)));
  assert.equal(graphNeighborhood(graph, 'XR-P1', 4, [], 36).nodes.length, 1);
  assert.equal(graphNeighborhood(graph, 'missing', 1).nodes.length, 0);
});

test('query examples return selected source fields and only real result nodes', () => {
  const graph = buildKnowledgeGraph(at());
  for (const example of QUERY_EXAMPLES) {
    const result = executeKnowledgeQuery(graph, example.query);
    assert.equal(result.error, undefined, `${example.id}: ${result.error}`);
    assert.ok(Array.isArray(result.nodes));
    assert.ok(Array.isArray(result.edges));
    assert.ok(result.nodes.length > 0);
    const ids = new Set(result.nodes.map(node => node.id));
    assert.ok(result.edges.every(edge => ids.has(edge.from) && ids.has(edge.to)));
  }
  const scoped = executeKnowledgeQuery(graph, '{ networkDevice(id: "XR-P1") { id interfaces { name } services { name } } }');
  assert.deepEqual(Object.keys(scoped.data.networkDevice), ['id', 'interfaces', 'services']);
  assert.equal(scoped.data.networkDevice.interfaces.length, scale.deviceInterfaces('XR-P1').length);
  assert.equal(scoped.data.networkDevice.services[0].name, 'SR-PE-W1-PE-E1');
  assert.deepEqual(executeKnowledgeQuery(graph, '{ networkDevice(id: "missing") { id } }').data, { networkDevice: null });
});

test('queries reject mutation, unsupported fields and arguments even when no records match', () => {
  const graph = buildKnowledgeGraph(at());
  for (const query of [
    'mutation { networkDevices { id } }',
    '{ devices { id } }',
    '{ networkDevices(role: "missing") { unsupported } }',
    '{ networkDevice(id: "missing") { unsupported } }',
    '{ networkDevices(ignoreThis: true) { id } }',
    '{ networkDevices(limit: 0) { id } }',
    '{ networkDevices(name: 12) { id } }',
    'query Read($id: String) { networkDevice(id: $id) { id } }',
    '{ networkDevices { id hostname',
  ]) assert.equal(typeof executeKnowledgeQuery(graph, query).error, 'string', query);
});

test('query limits and a total projection budget prevent an unbounded result graph', () => {
  const graph = buildKnowledgeGraph(at());
  const bounded = executeKnowledgeQuery(graph, '{ networkDevices(limit: 999999) { id } }');
  assert.equal(bounded.nodes.length, 100);
  assert.equal(bounded.total, scale.DEVICES.length);
  assert.equal(bounded.truncated, true);
  const expansive = executeKnowledgeQuery(graph, '{ networkDevices(limit: 100) { neighbors(limit: 100) { neighbors(limit: 100) { id } } } }');
  assert.match(expansive.error, /500-node-visit/);
});

test('configuration difference and policy scope never assert a forwarding cause or remediation', () => {
  const graph = buildKnowledgeGraph(at());
  const observed = graph.nodes.find(node => node.type === 'Config' && node.attributes.config_type === 'Observed configuration');
  assert.equal(observed.attributes.description, 'CONTROL-LOOPBACK-OLD');
  assert.equal(observed.attributes.difference_detected, true);
  assert.equal(observed.attributes.forwarding_effect, 'Not established');
  const dependencies = graph.edges.filter(edge => edge.type === 'DEPENDS_ON');
  assert.equal(dependencies.length, 1);
  assert.equal(dependencies[0].to, 'XR-P1:HundredGigE0/0/0/0');
  assert.match(dependencies[0].detail, /no service outage/);
  assert.equal(graph.edges.some(edge => edge.type === 'DEPENDS_ON' && edge.to === observed.id), false);
});
