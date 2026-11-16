import { NODE_TYPES, RELATIONSHIP_TYPES } from './knowledge-graph-model.js';

const clamp = (value, fallback, max) => Number.isFinite(Number(value)) ? Math.max(1, Math.min(max, Math.trunc(Number(value)))) : fallback;
const compare = (a, b) => String(a).localeCompare(String(b), 'en');
const indexCache = new WeakMap();

// Build from the supplied source only. A query snapshot needs no current-model
// indexes, and must never acquire newer records while being explored.
function sourceIndex(graph, relations = RELATIONSHIP_TYPES) {
  const relationTypes = [...new Set(relations ?? RELATIONSHIP_TYPES)].sort(compare);
  const cacheKey = JSON.stringify(relationTypes);
  const cacheable = graph !== null && typeof graph === 'object';
  let cached = cacheable ? indexCache.get(graph) : null;
  if (cached?.has(cacheKey)) return cached.get(cacheKey);
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const allowed = new Set(relationTypes);
  const edges = (graph?.edges || []).filter(edge => allowed.has(edge.type) && nodeById.has(edge.from) && nodeById.has(edge.to));
  const adjacency = new Map(nodes.map(node => [node.id, []]));
  for (const edge of edges) {
    adjacency.get(edge.from).push({ id: edge.to, edge });
    if (edge.to !== edge.from) adjacency.get(edge.to).push({ id: edge.from, edge });
  }
  for (const entries of adjacency.values()) entries.sort((a, b) => compare(a.id, b.id) || compare(a.edge.type, b.edge.type) || compare(a.edge.id, b.edge.id));
  const index = { nodeById, adjacency, edges };
  if (cacheable) {
    if (!cached) { cached = new Map(); indexCache.set(graph, cached); }
    // Five supported relationships produce at most 32 filter subsets. Bound
    // arbitrary caller-supplied keys as well, without retaining graph objects.
    if (cached.size >= 32) cached.delete(cached.keys().next().value);
    cached.set(cacheKey, index);
  }
  return index;
}

function breadthFirst(index, rootId, allowedIds) {
  if (!index.nodeById.has(rootId) || (allowedIds && !allowedIds.has(rootId))) return { order: [], distances: new Map(), parents: new Map() };
  const order = [rootId], distances = new Map([[rootId, 0]]), parents = new Map();
  for (let cursor = 0; cursor < order.length; cursor++) {
    const id = order[cursor];
    for (const next of index.adjacency.get(id) || []) {
      if (distances.has(next.id) || (allowedIds && !allowedIds.has(next.id))) continue;
      distances.set(next.id, distances.get(id) + 1);
      parents.set(next.id, { id, edgeId: next.edge.id });
      order.push(next.id);
    }
  }
  return { order, distances, parents };
}

/** Full-source shortest distances, including entities beyond the canvas depth. */
export function getGraphDistances(graph, rootId, relations = RELATIONSHIP_TYPES) {
  return breadthFirst(sourceIndex(graph, relations), rootId).distances;
}

/** A bounded display projection; expansion ownership is recomputed on collapse. */
export function buildExplorerView(graph, rootId, {
  depth = 1, relations = RELATIONSHIP_TYPES, expandedIds = [], limit = 64, selectedId,
} = {}) {
  const hops = clamp(depth, 1, 4), capacity = clamp(limit, 64, 256);
  const index = sourceIndex(graph, relations), traversal = breadthFirst(index, rootId);
  const candidates = new Set(traversal.order.filter(id => traversal.distances.get(id) <= hops));
  const expanded = new Set(expandedIds || []), queue = [...candidates];
  // Only visible/reachable expansion points may introduce another hop. Thus a
  // collapsed branch cannot leave an orphan solely because its child is expanded.
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const id = queue[cursor];
    if (!expanded.has(id)) continue;
    for (const next of index.adjacency.get(id) || []) {
      if (candidates.has(next.id)) continue;
      candidates.add(next.id); queue.push(next.id);
    }
  }
  const order = traversal.order.filter(id => candidates.has(id));
  const prioritized = [], prioritizedIds = new Set();
  const add = id => { if (id && candidates.has(id) && !prioritizedIds.has(id)) { prioritized.push(id); prioritizedIds.add(id); } };
  add(rootId); add(selectedId);
  const activeExpansions = [...expanded].filter(id => candidates.has(id));
  if (activeExpansions.length) {
    const candidatePaths = breadthFirst(index, rootId, candidates).parents;
    // Explicit expansion should reveal its local context even when a broad
    // initial traversal has filled the display budget. Retain its route first.
    for (const id of activeExpansions) {
      const path = [id];
      for (let cursor = id; cursor !== rootId;) {
        const parent = candidatePaths.get(cursor);
        if (!parent) break;
        path.push(parent.id); cursor = parent.id;
      }
      path.reverse().forEach(add);
    }
    for (const id of activeExpansions) {
      for (const next of index.adjacency.get(id) || []) add(next.id);
    }
  }
  for (const type of NODE_TYPES) add(order.find(id => index.nodeById.get(id).type === type));
  for (const id of order) add(id);
  const visible = new Set(prioritized.slice(0, capacity));
  const total = candidates.size, omitted = total - visible.size;
  return {
    nodes: [...visible].map(id => index.nodeById.get(id)),
    edges: index.edges.filter(edge => visible.has(edge.from) && visible.has(edge.to)),
    distances: new Map(order.map(id => [id, traversal.distances.get(id)])),
    rootId, depth: hops, total, omitted, truncated: omitted > 0,
  };
}

/** Visibility counts refer to the opposite endpoint, not relationship filters. */
export function summarizeConnections(graph, nodeId, visibleIds, relations = RELATIONSHIP_TYPES) {
  const index = sourceIndex(graph, relations), visible = visibleIds == null ? null : new Set(visibleIds);
  const summary = { total: 0, incoming: 0, outgoing: 0, connected: 0, visible: 0, hidden: 0, neighborIds: [], visibleNeighborIds: [], hiddenNeighborIds: [], hiddenNeighbors: 0, groups: [] };
  const groups = new Map(), neighbors = new Set(), visibleNeighbors = new Set(), hiddenNeighbors = new Set();
  if (!index.nodeById.has(nodeId)) return summary;
  for (const { edge } of index.adjacency.get(nodeId) || []) {
    const direction = edge.directed === false ? 'connected' : edge.from === nodeId ? 'outgoing' : 'incoming';
    const otherId = edge.from === nodeId ? edge.to : edge.from;
    summary.total++; summary[direction]++;
    summary[visible === null || visible.has(otherId) ? 'visible' : 'hidden']++;
    neighbors.add(otherId);
    (visible === null || visible.has(otherId) ? visibleNeighbors : hiddenNeighbors).add(otherId);
    const key = `${edge.type}:${direction}`;
    if (!groups.has(key)) groups.set(key, { type: edge.type, direction, edges: [] });
    groups.get(key).edges.push(edge);
  }
  const directionOrder = { incoming: 0, outgoing: 1, connected: 2 };
  summary.groups = [...groups.values()].sort((a, b) => compare(a.type, b.type) || directionOrder[a.direction] - directionOrder[b.direction]);
  for (const group of summary.groups) group.edges.sort((a, b) => compare(a.id, b.id));
  summary.neighborIds = [...neighbors].sort(compare);
  summary.visibleNeighborIds = [...visibleNeighbors].sort(compare);
  summary.hiddenNeighborIds = [...hiddenNeighbors].sort(compare);
  summary.hiddenNeighbors = hiddenNeighbors.size;
  return summary;
}

/** Traverse both ways for upstream inspection, retaining original edge identity. */
export function shortestGraphPath(graph, rootId, targetId, relations = RELATIONSHIP_TYPES) {
  const index = sourceIndex(graph, relations), traversal = breadthFirst(index, rootId);
  if (!traversal.distances.has(targetId)) return { nodeIds: [], edgeIds: [] };
  const nodeIds = [targetId], edgeIds = [];
  for (let id = targetId; id !== rootId;) {
    const parent = traversal.parents.get(id);
    edgeIds.push(parent.edgeId); nodeIds.push(parent.id); id = parent.id;
  }
  return { nodeIds: nodeIds.reverse(), edgeIds: edgeIds.reverse() };
}

/** Stable type sectors around a focus entity; all angles are in radians. */
export function radialGraphLayout(view, rootId) {
  const nodes = view?.nodes || [], distances = view?.distances || new Map();
  const counts = new Map(NODE_TYPES.map(type => [type, nodes.filter(node => node.id !== rootId && node.type === type).length]));
  const count = [...counts.values()].reduce((sum, value) => sum + value, 0);
  const minimum = Math.PI / 3, remaining = Math.PI * 2 - minimum * NODE_TYPES.length;
  const widths = NODE_TYPES.map(type => minimum + remaining * (count ? counts.get(type) / count : 1 / NODE_TYPES.length));
  let angle = -Math.PI / 2 - widths[0] / 2;
  const sectors = NODE_TYPES.map((type, index) => {
    const sector = { type, startAngle: angle, endAngle: angle + widths[index] };
    angle = sector.endAngle; return sector;
  });
  const positions = new Map(), ringCounts = new Map(), groups = new Map();
  if (nodes.some(node => node.id === rootId)) positions.set(rootId, { x: 0, y: 0, r: 0, depth: 0 });
  for (const node of nodes) {
    if (node.id === rootId) continue;
    const raw = distances.get(node.id);
    const depth = Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : null;
    const key = `${node.type}:${depth}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(node);
    ringCounts.set(depth, (ringCounts.get(depth) || 0) + 1);
  }
  const depths = [...ringCounts.keys()].filter(depth => depth !== null).sort((a, b) => a - b);
  const disconnectedRadius = (depths.length ? 200 + (depths.at(-1) - 1) * 150 : 0) + 150;
  if (ringCounts.has(null)) depths.push(null);
  const ringRadius = depth => depth === null ? disconnectedRadius : 200 + (depth - 1) * 150;
  for (const sector of sectors) {
    for (const depth of depths) {
      const entries = (groups.get(`${sector.type}:${depth}`) || []).sort((a, b) => compare(a.id, b.id));
      const radius = ringRadius(depth);
      const padding = Math.min(.18, (sector.endAngle - sector.startAngle) / 8);
      entries.forEach((node, index) => {
        const proportion = entries.length === 1 ? .5 : index / (entries.length - 1);
        const theta = sector.startAngle + padding + proportion * (sector.endAngle - sector.startAngle - padding * 2);
        positions.set(node.id, { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius, r: radius, depth });
      });
    }
  }
  const rings = depths.map(depth => ({ depth, radius: ringRadius(depth), count: ringCounts.get(depth) }));
  return { positions, rings, sectors, extent: (rings.at(-1)?.radius || 0) + 80 };
}
