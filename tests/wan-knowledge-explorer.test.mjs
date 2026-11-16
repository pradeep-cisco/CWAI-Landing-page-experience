import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExplorerView, summarizeConnections, shortestGraphPath, radialGraphLayout, getGraphDistances } from '../src/features/wan/admin/explorer-model.js';

const node = (id, type = 'NetworkDevice') => ({ id, type, label: id });
const edge = (id, from, to, type = 'HAS_INTERFACE', directed = true) => ({ id, from, to, type, directed });
const graph = {
  nodes: [node('root'), node('a', 'Interface'), node('b', 'Interface'), node('shared', 'Service'), node('config', 'Config'), node('orphan', 'Interface')],
  edges: [edge('root-a', 'root', 'a'), edge('root-b', 'root', 'b'), edge('a-shared', 'shared', 'a', 'DEPENDS_ON'), edge('b-shared', 'shared', 'b', 'DEPENDS_ON'), edge('shared-config', 'shared', 'config', 'CONFIGURED_BY'), edge('physical', 'a', 'b', 'CONNECTS_TO', false)],
};
const ids = view => view.nodes.map(node => node.id);

test('collapse retains shared descendants through remaining expansions but drops orphan branches', () => {
  const both = buildExplorerView(graph, 'root', { expandedIds: ['a', 'b', 'shared'] });
  assert.deepEqual(new Set(ids(both)), new Set(['root', 'a', 'b', 'shared', 'config']));
  const oneCollapsed = buildExplorerView(graph, 'root', { expandedIds: ['b', 'shared'] });
  assert.ok(ids(oneCollapsed).includes('shared'));
  assert.ok(ids(oneCollapsed).includes('config'));
  const allCollapsed = buildExplorerView(graph, 'root', { expandedIds: ['shared'] });
  assert.deepEqual(new Set(ids(allCollapsed)), new Set(['root', 'a', 'b']));
  assert.equal(allCollapsed.distances.has('config'), false);
  assert.equal(both.distances.get('config'), 3);
});

test('bounded views retain root, selected entity and reachable type representatives', () => {
  const many = { nodes: [node('root'), ...Array.from({ length: 80 }, (_, i) => node(`i-${String(i).padStart(2, '0')}`, 'Interface')), node('service', 'Service'), node('config', 'Config')], edges: [] };
  many.edges = many.nodes.slice(1).map(item => edge(`r-${item.id}`, 'root', item.id));
  const view = buildExplorerView(many, 'root', { limit: 5, selectedId: 'i-79' });
  assert.equal(view.nodes.length, 5);
  assert.equal(view.nodes[0].id, 'root');
  assert.ok(ids(view).includes('i-79'));
  assert.ok(ids(view).includes('service'));
  assert.ok(ids(view).includes('config'));
  assert.equal(view.total, 83);
  assert.equal(view.omitted, 78);
  assert.equal(view.truncated, true);
  assert.deepEqual(ids(buildExplorerView(many, 'root', { limit: 5, selectedId: 'i-79' })), ids(view));
  assert.ok(view.edges.every(item => ids(view).includes(item.from) && ids(view).includes(item.to)));
  assert.deepEqual(ids(buildExplorerView(graph, 'missing')), []);
});

test('local expansion replaces general fill at capacity and collapse restores the baseline', () => {
  const crowded = {
    nodes: [node('root'), node('a', 'Interface'), node('b', 'Interface'), node('c', 'Interface'), node('z-local', 'Interface')],
    edges: [edge('root-a', 'root', 'a'), edge('root-b', 'root', 'b'), edge('root-c', 'root', 'c'), edge('a-local', 'a', 'z-local')],
  };
  const baseline = buildExplorerView(crowded, 'root', { limit: 3 });
  assert.deepEqual(ids(baseline), ['root', 'a', 'b']);
  const expanded = buildExplorerView(crowded, 'root', { limit: 3, expandedIds: ['a'] });
  assert.deepEqual(ids(expanded), ['root', 'a', 'z-local']);
  assert.ok(expanded.edges.some(item => item.id === 'a-local'));
  assert.equal(expanded.distances.get('z-local'), 2);
  assert.deepEqual(ids(buildExplorerView(crowded, 'root', { limit: 3, expandedIds: [] })), ids(baseline));
});

test('bounded expansion prefers the connected route to a deeper expansion point', () => {
  const branch = {
    nodes: ['root', 'a', 'b', 'c', 'd', 'e', 'z'].map(id => node(id)),
    edges: [edge('r-a', 'root', 'a'), edge('r-b', 'root', 'b'), edge('r-c', 'root', 'c'), edge('a-d', 'a', 'd'), edge('d-e', 'd', 'e'), edge('e-z', 'e', 'z')],
  };
  const view = buildExplorerView(branch, 'root', { depth: 2, limit: 5, expandedIds: ['d', 'e'] });
  assert.deepEqual(ids(view), ['root', 'a', 'd', 'e', 'z']);
  assert.deepEqual(shortestGraphPath({ nodes: view.nodes, edges: view.edges }, 'root', 'z').nodeIds, ['root', 'a', 'd', 'e', 'z']);
});

test('relation filters constrain expansion and distances rather than only hiding rendered edges', () => {
  const view = buildExplorerView(graph, 'root', { depth: 4, relations: ['HAS_INTERFACE'], expandedIds: ['a', 'shared'] });
  assert.deepEqual(new Set(ids(view)), new Set(['root', 'a', 'b']));
  assert.ok(view.edges.every(item => item.type === 'HAS_INTERFACE'));
  assert.deepEqual(ids(buildExplorerView(graph, 'root', { relations: [] })), ['root']);
});

test('connection summaries preserve incoming, outgoing, bidirectional and hidden meanings', () => {
  const summary = summarizeConnections(graph, 'a', ['root', 'a', 'b']);
  assert.equal(summary.total, 3);
  assert.equal(summary.incoming, 2);
  assert.equal(summary.outgoing, 0);
  assert.equal(summary.connected, 1);
  assert.equal(summary.visible, 2);
  assert.equal(summary.hidden, 1);
  assert.deepEqual(summary.hiddenNeighborIds, ['shared']);
  assert.deepEqual(summary.visibleNeighborIds, ['b', 'root']);
  assert.equal(summary.hiddenNeighbors, 1);
  assert.equal(summary.groups.find(item => item.type === 'CONNECTS_TO').direction, 'connected');
  assert.equal(summarizeConnections(graph, 'shared').outgoing, 3);
  assert.equal(summarizeConnections(graph, 'a', [], ['CONNECTS_TO']).hidden, 1);
  assert.equal(summarizeConnections(graph, 'missing').total, 0);
});

test('shortest paths can inspect upstream while retaining original edge IDs and filters', () => {
  assert.deepEqual(shortestGraphPath(graph, 'config', 'root'), { nodeIds: ['config', 'shared', 'a', 'root'], edgeIds: ['shared-config', 'a-shared', 'root-a'] });
  assert.deepEqual(shortestGraphPath(graph, 'a', 'b', ['CONNECTS_TO']), { nodeIds: ['a', 'b'], edgeIds: ['physical'] });
  assert.deepEqual(shortestGraphPath(graph, 'root', 'config', ['HAS_INTERFACE']), { nodeIds: [], edgeIds: [] });
  assert.deepEqual(shortestGraphPath(graph, 'root', 'root'), { nodeIds: ['root'], edgeIds: [] });
  assert.deepEqual(shortestGraphPath(graph, 'root', 'missing'), { nodeIds: [], edgeIds: [] });
});

test('radial layout is finite and deterministic with true hop rings and stable type sectors', () => {
  const view = buildExplorerView(graph, 'root', { depth: 3 });
  const layout = radialGraphLayout(view, 'root');
  assert.deepEqual(layout.positions.get('root'), { x: 0, y: 0, r: 0, depth: 0 });
  assert.deepEqual(layout.rings.map(ring => [ring.depth, ring.radius]), [[1, 200], [2, 350], [3, 500]]);
  assert.equal(layout.positions.get('config').r, 500);
  assert.equal(layout.positions.size, view.nodes.length);
  for (const position of layout.positions.values()) assert.ok(Object.values(position).every(Number.isFinite));
  for (const sector of layout.sectors) assert.ok(sector.endAngle - sector.startAngle >= Math.PI / 3 - 1e-10);
  const device = layout.sectors[0];
  assert.ok(Math.abs((device.startAngle + device.endAngle) / 2 + Math.PI / 2) < 1e-10);
  assert.deepEqual(radialGraphLayout(view, 'root'), layout);
  assert.equal(radialGraphLayout({ nodes: [], distances: new Map() }, 'missing').positions.size, 0);
  const disconnected = radialGraphLayout({ nodes: [...view.nodes, node('outside', 'Config')], distances: view.distances }, 'root');
  assert.deepEqual(disconnected.rings.at(-1), { depth: null, radius: 650, count: 1 });
  assert.equal(disconnected.positions.get('outside').depth, null);
  assert.equal(disconnected.positions.get('outside').r, 650);
});

test('hidden neighbor badges count entities once across multiple relationships', () => {
  const parallel = { nodes: [node('root'), node('other')], edges: [edge('owns', 'root', 'other'), edge('physical', 'root', 'other', 'CONNECTS_TO', false)] };
  const summary = summarizeConnections(parallel, 'root', ['root']);
  assert.equal(summary.hidden, 2);
  assert.equal(summary.hiddenNeighbors, 1);
  assert.deepEqual(summary.neighborIds, ['other']);
});

test('snapshot-only exploration does not borrow records or mutate source positions', () => {
  const snapshot = { nodes: graph.nodes.filter(item => ['root', 'a'].includes(item.id)), edges: graph.edges.filter(item => item.id === 'root-a') };
  const before = JSON.stringify(snapshot);
  const view = buildExplorerView(snapshot, 'root', { depth: 4, expandedIds: ['a', 'shared'] });
  assert.deepEqual(ids(view), ['root', 'a']);
  assert.equal(shortestGraphPath(snapshot, 'root', 'shared').nodeIds.length, 0);
  radialGraphLayout(view, 'root');
  assert.equal(JSON.stringify(snapshot), before);
});

test('full graph distances distinguish distant query entities from disconnected records', () => {
  const chain = { nodes: Array.from({ length: 7 }, (_, i) => node(`n${i}`)), edges: Array.from({ length: 5 }, (_, i) => edge(`e${i}`, `n${i}`, `n${i + 1}`)) };
  const distances = getGraphDistances(chain, 'n0');
  assert.equal(distances.get('n5'), 5);
  assert.equal(distances.has('n6'), false);
  assert.equal(buildExplorerView(chain, 'n0', { depth: 4 }).distances.has('n5'), false);
  assert.equal(getGraphDistances(chain, 'n0', []).size, 1);
  assert.equal(getGraphDistances(chain, 'missing').size, 0);
});

test('immutable source replacements and relation subsets retain independent indexed evidence', () => {
  const older = { nodes: [node('a'), node('b', 'Interface')], edges: [edge('owns', 'a', 'b')] };
  assert.equal(summarizeConnections(older, 'a').total, 1);
  assert.equal(summarizeConnections(older, 'a', undefined, ['CONNECTS_TO']).total, 0);
  const newer = { nodes: [node('a'), node('c', 'Config')], edges: [edge('config', 'a', 'c', 'CONFIGURED_BY')] };
  assert.deepEqual(buildExplorerView(newer, 'a').nodes.map(item => item.id), ['a', 'c']);
  assert.deepEqual(buildExplorerView(older, 'a').nodes.map(item => item.id), ['a', 'b']);
  assert.equal(summarizeConnections(older, 'a').outgoing, 1);
  assert.equal(summarizeConnections(newer, 'a', undefined, ['HAS_INTERFACE']).total, 0);
  assert.equal(summarizeConnections(newer, 'a', undefined, ['CONFIGURED_BY']).total, 1);
});
