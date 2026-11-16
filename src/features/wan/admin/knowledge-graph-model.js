// Read-only graph projection of the same illustrative source snapshots used by
// the dashboard. This is not a connection to an external knowledge-graph API.
import {
  ACTIVE_WAN, DEVICES, INTERFACES, NETWORK_LINKS, domainLabel, groupLabel,
  deviceReachable, telemetryCurrent,
} from '../model/scale.js';
import { currentFrame, observations, INTERFACE, THRESHOLD } from '../model/model.js';
import { agentResponse, createAgentState } from '../model/agentic-model.js';
import { buildOperations } from '../operations/operations-model.js';

export const NODE_TYPES = ['NetworkDevice', 'Interface', 'Service', 'Config'];
export const RELATIONSHIP_TYPES = ['HAS_INTERFACE', 'RUNS_SERVICE', 'CONFIGURED_BY', 'CONNECTS_TO', 'DEPENDS_ON'];
const attribute = (name, type, required, description) => ({ name, type, required, description });
const relationship = (type, target, cardinality, description) => ({ type, target, cardinality, description });

export const SCHEMA = [
  {
    type: 'NetworkDevice', label: 'Devices', description: 'An IOS XR router in the selected WAN inventory. Reachability and telemetry quality are independent source facts.',
    attributes: [
      attribute('hostname', 'String', true, 'Router identifier supplied by the WAN inventory.'),
      attribute('mgmt_ip', 'IPAddress', true, 'Management address in the selected inventory.'),
      attribute('operating_system', 'String', true, 'Recorded operating system; no software version is inferred.'),
      attribute('role', 'Enum', true, 'Recorded PE or P role.'),
      attribute('domain', 'String', true, 'Operational domain in the selected WAN.'),
      attribute('device_group', 'String', true, 'Actual device-group membership.'),
      attribute('reachable', 'Boolean', true, 'Independent reachability observation.'),
      attribute('reachability_observed_at', 'Time', true, 'Time of the independent reachability observation.'),
      attribute('telemetry_state', 'Enum', true, 'Current or unavailable telemetry collection.'),
    ],
    relationships: [
      relationship('HAS_INTERFACE', 'Interface', '1:N', 'Router owns a physical interface from the inventory.'),
      relationship('RUNS_SERVICE', 'Service', '1:N', 'Hosting relationship; emitted only when a source explicitly establishes it.'),
      relationship('CONFIGURED_BY', 'Config', '1:N', 'Router has a supplied observed configuration snapshot.'),
      relationship('CONNECTS_TO', 'NetworkDevice', 'N:N', 'Actual physical connection; endpoints are reciprocal.'),
    ],
  },
  {
    type: 'Interface', label: 'Interfaces', description: 'A physical endpoint from the current WAN links. Only the supplied XR-P1 outbound observation has a utilization value.',
    attributes: [
      attribute('name', 'String', true, 'Actual interface name.'),
      attribute('device_id', 'String', true, 'Owning router ID.'),
      attribute('peer_device', 'String', true, 'Remote router ID.'),
      attribute('peer_interface', 'String', true, 'Remote endpoint name.'),
      attribute('link_id', 'String', true, 'Physical circuit identifier.'),
      attribute('outbound_utilization', 'Number', false, 'Supplied interface reading, not a domain aggregate.'),
      attribute('observation_state', 'Enum', false, 'Current or last known; absent where no metric source is supplied.'),
      attribute('observed_at', 'Time', false, 'Metric source time, when supplied.'),
      attribute('configured_limit', 'Number', false, 'Configured utilization threshold, when supplied.'),
    ],
    relationships: [relationship('CONNECTS_TO', 'Interface', '1:1', 'Reciprocal physical interface endpoint.')],
  },
  {
    type: 'Service', label: 'Services', description: 'A supplied SR-policy observation. Its observed interface scope does not establish a service outage or a traffic-engineering cause.',
    attributes: [
      attribute('name', 'String', true, 'Policy identifier from the supplied source.'),
      attribute('service_type', 'Enum', true, 'Recorded service or policy category.'),
      attribute('color', 'Number', true, 'Recorded SR-policy color.'),
      attribute('scope', 'String', true, 'Observed interface relationship, retained as last known when collection is unavailable.'),
      attribute('observation_state', 'Enum', true, 'Current or last-known policy observation.'),
    ],
    relationships: [
      relationship('DEPENDS_ON', 'Interface', 'N:N', 'Observed policy/interface scope; no causal impact or outage is inferred.'),
      relationship('CONFIGURED_BY', 'Config', '1:N', 'Supplied policy-intent constraint.'),
    ],
  },
  {
    type: 'Config', label: 'Configurations', description: 'An explicitly supplied intended baseline, observed configuration, or policy-intent record. A difference is not a confirmed forwarding fault.',
    attributes: [
      attribute('config_type', 'Enum', true, 'Intended baseline, observed configuration, or policy intent.'),
      attribute('record_id', 'String', true, 'Identity of the supplied source record.'),
      attribute('device_id', 'String', false, 'Related router, where recorded.'),
      attribute('hostname', 'String', false, 'Compared hostname field.'),
      attribute('interface', 'String', false, 'Compared interface field; no physical interface node is invented.'),
      attribute('description', 'String', false, 'Compared configuration description.'),
      attribute('ipv4_address', 'IPAddress', false, 'Compared IPv4 address.'),
      attribute('difference_detected', 'Boolean', false, 'Whether supplied compared fields differ.'),
      attribute('forwarding_effect', 'String', false, 'Explicitly records when forwarding impact has not been established.'),
      attribute('utilization_limit', 'Number', false, 'Supplied policy-intent constraint.'),
    ],
    relationships: [],
  },
];
const schemaByType = new Map(SCHEMA.map(schema => [schema.type, schema]));

function node(id, type, label, source, sourceTime, attributes, fresh = true) {
  const definitions = schemaByType.get(type).attributes;
  const known = new Set(definitions.map(item => item.name));
  return {
    id, type, label, source, sourceTime, fresh, attributes,
    schemaCoverage: {
      defined: Object.keys(attributes).filter(name => known.has(name)),
      missing: definitions.filter(item => item.required && (attributes[item.name] === undefined || attributes[item.name] === null)).map(item => item.name),
      extra: Object.keys(attributes).filter(name => !known.has(name)),
    },
  };
}

export function buildKnowledgeGraph(input) {
  const state = { ...(input || createAgentState()), history: null };
  const time = currentFrame(state).time, reading = observations(state);
  const nodes = [], edges = [];
  const counts = Object.fromEntries(NODE_TYPES.map(type => [type, 0]));
  for (const device of DEVICES) {
    const telemetry = telemetryCurrent(state, device);
    nodes.push(node(device.id, 'NetworkDevice', device.id, 'WAN inventory · Independent reachability', time, {
      hostname: device.id, mgmt_ip: device.address, operating_system: device.os, role: device.role,
      domain: domainLabel(device.domain), device_group: groupLabel(device.groupId),
      reachable: deviceReachable(state, device.id), reachability_observed_at: time,
      telemetry_state: telemetry ? 'Current' : 'Unavailable',
    }));
  }
  const targetPort = `XR-P1:${INTERFACE}`;
  for (const port of INTERFACES) {
    const hasReading = port.id === targetPort;
    const attributes = {
      name: port.name, device_id: port.device, peer_device: port.peer,
      peer_interface: port.peerInterface, link_id: port.linkId,
    };
    if (hasReading) Object.assign(attributes, {
      outbound_utilization: reading.utilization, observation_state: reading.fresh ? 'Current' : 'Last known',
      observed_at: reading.observedAt, configured_limit: THRESHOLD,
    });
    nodes.push(node(port.id, 'Interface', `${port.device} / ${port.name}`, hasReading ? 'WAN interface inventory · Interface telemetry' : 'WAN interface inventory', hasReading ? reading.observedAt : time, attributes, hasReading ? reading.fresh : true));
    edges.push({ id: `owns:${port.id}`, from: port.device, to: port.id, type: 'HAS_INTERFACE', source: 'WAN interface inventory', sourceTime: time, fresh: true, directed: true });
  }
  for (const link of NETWORK_LINKS) {
    edges.push({ id: `devices:${link.id}`, from: link.from, to: link.to, type: 'CONNECTS_TO', source: 'BGP-LS topology · WAN inventory', sourceTime: time, fresh: true, directed: false });
    edges.push({ id: `interfaces:${link.id}`, from: `${link.from}:${link.fromInterface}`, to: `${link.to}:${link.toInterface}`, type: 'CONNECTS_TO', source: 'WAN interface inventory', sourceTime: time, fresh: true, directed: false });
  }
  const response = agentResponse(state);
  const policySource = response.plan.sources.find(source => source.id.startsWith('POLICY-'));
  if (policySource && INTERFACES.some(port => port.id === targetPort)) {
    const serviceId = 'SR-PE-W1-PE-E1';
    nodes.push(node(serviceId, 'Service', 'SR-PE-W1-PE-E1 · Color 100', 'SR policy state', policySource.time, {
      name: serviceId, service_type: 'SR policy', color: 100, scope: 'XR-P1 → XR-P2',
      observation_state: policySource.fresh ? 'Current' : 'Last known',
    }, policySource.fresh));
    edges.push({ id: 'policy-scope:100', from: serviceId, to: targetPort, type: 'DEPENDS_ON', source: 'Observed SR-policy interface relationship', sourceTime: policySource.time, fresh: policySource.fresh, directed: true, detail: 'Observed interface scope only; no service outage, hosting relationship, or original cause is inferred.' });
    const intent = response.plan.sources.find(source => source.id === 'INTENT-100');
    if (intent) {
      nodes.push(node(intent.id, 'Config', 'SR policy intent · Color 100', intent.label, intent.time, { config_type: 'Policy intent', record_id: intent.id, utilization_limit: THRESHOLD }));
      edges.push({ id: 'policy-intent:100', from: serviceId, to: intent.id, type: 'CONFIGURED_BY', source: intent.label, sourceTime: intent.time, fresh: true, directed: true, detail: 'Intended constraint, not a confirmed controller operation.' });
    }
  }
  const config = buildOperations(state).changes;
  const values = fields => Object.fromEntries(fields.map(field => [field.key.replaceAll(' ', '_'), field.value]));
  nodes.push(node(config.baseline, 'Config', `${config.router} intended baseline`, 'Intended configuration', config.baselineTime, {
    config_type: 'Intended baseline', record_id: config.baseline, device_id: config.router, ...values(config.intended),
  }));
  nodes.push(node(config.sourceRecord, 'Config', `${config.router} observed configuration`, config.source, config.time, {
    config_type: 'Observed configuration', record_id: config.sourceRecord, device_id: config.router, ...values(config.observed),
    difference_detected: config.hasDrift, forwarding_effect: config.hasDrift ? 'Not established' : 'No difference in compared fields',
  }));
  edges.push({ id: `configuration:${config.sourceRecord}`, from: config.router, to: config.sourceRecord, type: 'CONFIGURED_BY', source: config.source, sourceTime: config.time, fresh: true, directed: true, detail: 'Observed source snapshot; no configuration restoration or execution is implied.' });
  const nodeById = new Map(nodes.map(item => [item.id, item]));
  const adjacency = new Map(nodes.map(item => [item.id, []]));
  for (const item of nodes) counts[item.type]++;
  for (const edge of edges) {
    if (!nodeById.has(edge.from) || !nodeById.has(edge.to)) throw new Error(`Knowledge graph relationship has an unknown endpoint: ${edge.id}`);
    adjacency.get(edge.from).push(edge);
    adjacency.get(edge.to).push(edge);
  }
  const searchIndex = new Map(nodes.map(item => [item.id, `${item.id} ${item.label} ${item.type} ${Object.values(item.attributes).join(' ')}`.toLowerCase()]));
  return { nodes, edges, nodeById, adjacency, searchIndex, counts, sourceTime: time, wanId: ACTIVE_WAN.id, wanLabel: ACTIVE_WAN.label, prototype: true, source: 'Illustrative controller snapshots', defaultRootId: 'XR-P1' };
}

const bounded = (value, fallback, max = 100) => Math.max(1, Math.min(max, Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback));
export function searchNodes(graph, text = '', type = 'all', limit = 30) {
  const q = String(text || '').trim().toLowerCase();
  const matches = graph.nodes.filter(item => (type === 'all' || item.type === type) && (!q || graph.searchIndex.get(item.id).includes(q)));
  const exact = matches.find(item => item.id.toLowerCase() === q || item.label.toLowerCase() === q);
  if (exact) matches.splice(matches.indexOf(exact), 1), matches.unshift(exact);
  const items = matches.slice(0, bounded(limit, 30));
  return { items, total: matches.length, omitted: matches.length - items.length };
}

export function graphNeighborhood(graph, rootId, depth = 1, relationshipTypes = RELATIONSHIP_TYPES, limit = 36) {
  const hops = bounded(depth, 1, 4), capacity = bounded(limit, 36);
  const allowed = new Set(relationshipTypes || RELATIONSHIP_TYPES);
  if (!graph.nodeById.has(rootId)) return { nodes: [], edges: [], total: 0, omitted: 0, totalEdges: 0, omittedEdges: 0, depth: hops, distances: new Map(), rootId, truncated: false };
  const distances = new Map([[rootId, 0]]), queue = [rootId];
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const id = queue[cursor], distance = distances.get(id);
    if (distance >= hops) continue;
    for (const edge of graph.adjacency.get(id) || []) {
      if (!allowed.has(edge.type)) continue;
      const next = edge.from === id ? edge.to : edge.from;
      if (distances.has(next)) continue;
      distances.set(next, distance + 1); queue.push(next);
    }
  }
  const ids = new Set(queue.slice(0, capacity));
  const allEdges = graph.edges.filter(edge => allowed.has(edge.type) && distances.has(edge.from) && distances.has(edge.to));
  const edges = allEdges.filter(edge => ids.has(edge.from) && ids.has(edge.to));
  return { nodes: [...ids].map(id => graph.nodeById.get(id)), edges, total: queue.length, omitted: queue.length - ids.size, totalEdges: allEdges.length, omittedEdges: allEdges.length - edges.length, depth: hops, distances, rootId, truncated: queue.length > ids.size };
}

export const QUERY_EXAMPLES = [
  { id: 'edge-routers', label: 'Edge routers', description: 'Find recorded PE routers in the selected WAN.', query: '{\n  networkDevices(role: "PE", limit: 12) {\n    id\n    hostname\n    mgmt_ip\n    role\n    domain\n  }\n}' },
  { id: 'device-context', label: 'Device context', description: 'Inspect a router, its physical interfaces, and the policy related to its interface scope.', query: '{\n  networkDevice(id: "XR-P1") {\n    id\n    hostname\n    interfaces {\n      id\n      name\n      peer_device\n      outbound_utilization\n      observation_state\n      observed_at\n    }\n    services {\n      id\n      name\n      service_type\n      color\n    }\n  }\n}' },
  { id: 'interface-dependencies', label: 'Interface dependencies', description: 'Follow actual physical endpoints and their owning routers.', query: '{\n  interfaces(deviceId: "XR-P1", limit: 12) {\n    id\n    name\n    device { id hostname domain }\n    peer { id name device_id }\n  }\n}' },
  { id: 'configuration-context', label: 'Configuration context', description: 'Compare supplied intended and observed XR-P5 configuration records.', query: '{\n  configs(deviceId: "XR-P5") {\n    id\n    config_type\n    description\n    difference_detected\n    forwarding_effect\n    sourceTime\n  }\n}' },
];

// Deliberately bounded GraphQL read subset. No evaluation, network calls,
// mutations, subscriptions, variables, fragments, aliases, or directives.
function parseQuery(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Enter a read query or choose an example.');
  if (input.length > 12000) throw new Error('Query exceeds the 12,000-character prototype limit.');
  const tokens = [];
  const pattern = /\s+|#[^\n]*|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[{}():,]/gy;
  let offset = 0;
  while (offset < input.length) {
    pattern.lastIndex = offset; const match = pattern.exec(input);
    if (!match) throw new Error(`Unsupported query syntax near character ${offset + 1}. Use the documented read-query examples.`);
    offset = pattern.lastIndex;
    if (!/^\s|^#/.test(match[0])) tokens.push(match[0]);
  }
  let position = 0, fieldCount = 0;
  const peek = () => tokens[position];
  const take = expected => { const token = tokens[position++]; if (expected && token !== expected) throw new Error(`Expected ${expected} in the query.`); return token; };
  const name = () => { const token = take(); if (!/^[A-Za-z_][A-Za-z_0-9]*$/.test(token || '')) throw new Error('Expected a field or argument name.'); return token; };
  if (['mutation', 'subscription'].includes(peek())) throw new Error('Only read queries are supported. This console never changes the network.');
  if (peek() === 'query') { take(); if (peek() !== '{') name(); }
  const selections = depth => {
    if (depth > 6) throw new Error('Query nesting exceeds the six-level prototype limit.');
    take('{'); const result = [];
    while (peek() !== '}') {
      if (!peek()) throw new Error('The query is missing a closing brace.');
      if (peek() === ',') { take(); continue; }
      if (++fieldCount > 100) throw new Error('Query exceeds the 100-field prototype limit.');
      const field = { name: name(), args: {}, fields: null };
      if (peek() === '(') {
        take();
        while (peek() !== ')') {
          if (!peek()) throw new Error('The query is missing a closing parenthesis.');
          if (peek() === ',') { take(); continue; }
          const key = name(); take(':'); const token = take();
          if (Object.hasOwn(field.args, key)) throw new Error(`Argument ${key} is repeated.`);
          if (token?.startsWith('"')) { try { field.args[key] = JSON.parse(token); } catch { throw new Error('Invalid string argument.'); } }
          else if (/^-?\d+(?:\.\d+)?$/.test(token || '')) field.args[key] = Number(token);
          else if (token === 'true' || token === 'false') field.args[key] = token === 'true';
          else if (token === 'null') field.args[key] = null;
          else if (/^[A-Za-z_][A-Za-z_0-9]*$/.test(token || '')) field.args[key] = token;
          else throw new Error('Only scalar query arguments are supported.');
        }
        take(')');
      }
      if (peek() === '{') field.fields = selections(depth + 1);
      result.push(field);
    }
    take('}'); if (!result.length) throw new Error('Select at least one field.'); return result;
  };
  const fields = selections(0);
  if (position !== tokens.length) throw new Error('Only one read operation is supported per execution.');
  return fields;
}

function validateArgs(field, allowed) {
  for (const key of Object.keys(field.args)) if (!allowed.includes(key)) throw new Error(`Unsupported argument ${key} on ${field.name}.`);
  if (field.args.limit !== undefined && (!Number.isInteger(field.args.limit) || field.args.limit < 1)) throw new Error('limit must be a positive integer.');
}

export function executeKnowledgeQuery(graph, query) {
  try {
    const fields = parseQuery(query), selected = new Set(), stats = { total: 0, truncated: false, visits: 0 };
    const outgoing = (id, type) => (graph.adjacency.get(id) || []).filter(edge => edge.from === id && edge.type === type).map(edge => graph.nodeById.get(edge.to));
    const incoming = (id, type) => (graph.adjacency.get(id) || []).filter(edge => edge.to === id && edge.type === type).map(edge => graph.nodeById.get(edge.from));
    const unique = items => [...new Map(items.filter(Boolean).map(item => [item.id, item])).values()];
    const limitItems = (items, field, root = false) => {
      const limit = bounded(field.args.limit, 30);
      if (root) stats.total += items.length;
      if (items.length > limit) stats.truncated = true;
      return items.slice(0, limit);
    };
    const nodeFields = new Map(SCHEMA.map(schema => [schema.type, new Set([...schema.attributes.map(item => item.name), 'id', 'type', 'label', 'source', 'sourceTime', 'fresh', 'attributes', 'schemaCoverage'])]));
    const relatedTypes = {
      NetworkDevice: { interfaces: ['Interface'], services: ['Service'], configs: ['Config'] },
      Interface: { services: ['Service'], device: ['NetworkDevice'], peer: ['Interface'] },
      Service: { interfaces: ['Interface'], configs: ['Config'], devices: ['NetworkDevice'], dependencies: ['Interface'] },
      Config: { device: ['NetworkDevice'] },
    };
    const edgeKeys = new Set(['id', 'from', 'to', 'type', 'source', 'sourceTime', 'fresh', 'directed', 'detail']);
    const validateSelection = (type, selection) => {
      for (const field of selection) {
        if (field.name === 'relationships') {
          validateArgs(field, ['limit']);
          if (!field.fields) throw new Error('relationships requires a field selection.');
          for (const child of field.fields) if (!edgeKeys.has(child.name) || child.fields || Object.keys(child.args).length) throw new Error(`Unsupported relationship field ${child.name}.`);
        } else if (nodeFields.get(type).has(field.name)) {
          validateArgs(field, []);
          if (field.fields) throw new Error(`${field.name} is a scalar field in this read subset.`);
        } else {
          const targets = field.name === 'neighbors' ? NODE_TYPES : relatedTypes[type][field.name];
          if (!targets) throw new Error(`Unsupported field ${field.name} on ${type}. Choose an example or a defined schema field.`);
          validateArgs(field, ['device', 'peer'].includes(field.name) ? [] : ['limit']);
          if (!field.fields) throw new Error(`${field.name} requires a field selection.`);
          for (const target of targets) validateSelection(target, field.fields);
        }
      }
    };
    const related = (item, key) => {
      if (key === 'neighbors') return unique((graph.adjacency.get(item.id) || []).map(edge => graph.nodeById.get(edge.from === item.id ? edge.to : edge.from)));
      if (key === 'interfaces' && item.type === 'NetworkDevice') return outgoing(item.id, 'HAS_INTERFACE');
      if (key === 'interfaces' && item.type === 'Service') return outgoing(item.id, 'DEPENDS_ON').filter(value => value.type === 'Interface');
      if (key === 'configs' && (item.type === 'NetworkDevice' || item.type === 'Service')) return outgoing(item.id, 'CONFIGURED_BY');
      if (key === 'services' && item.type === 'NetworkDevice') return unique([...outgoing(item.id, 'RUNS_SERVICE'), ...outgoing(item.id, 'HAS_INTERFACE').flatMap(port => incoming(port.id, 'DEPENDS_ON'))]);
      if (key === 'services' && item.type === 'Interface') return incoming(item.id, 'DEPENDS_ON').filter(value => value.type === 'Service');
      if (key === 'devices' && item.type === 'Service') return unique(outgoing(item.id, 'DEPENDS_ON').flatMap(port => incoming(port.id, 'HAS_INTERFACE')));
      if (key === 'dependencies' && item.type === 'Service') return outgoing(item.id, 'DEPENDS_ON');
      if (key === 'device' && ['Interface', 'Config'].includes(item.type)) return graph.nodeById.get(item.attributes.device_id) || null;
      if (key === 'peer' && item.type === 'Interface') return graph.nodeById.get(`${item.attributes.peer_device}:${item.attributes.peer_interface}`) || null;
      return undefined;
    };
    const projectEdge = (edge, selection) => {
      const result = {};
      for (const field of selection) {
        if (!edgeKeys.has(field.name) || field.fields || Object.keys(field.args).length) throw new Error(`Unsupported relationship field ${field.name}.`);
        result[field.name] = edge[field.name] ?? null;
      }
      return result;
    };
    const project = (item, selection) => {
      if (++stats.visits > 500) throw new Error('Query result exceeds the 500-node-visit prototype limit. Reduce list limits or nesting.');
      selected.add(item.id); const result = {};
      for (const field of selection) {
        if (field.name === 'relationships') {
          validateArgs(field, ['limit']); if (!field.fields) throw new Error('relationships requires a field selection.');
          result.relationships = limitItems(graph.adjacency.get(item.id) || [], field).map(edge => projectEdge(edge, field.fields)); continue;
        }
        if (nodeFields.get(item.type).has(field.name)) {
          validateArgs(field, []); if (field.fields) throw new Error(`${field.name} is a scalar field in this read subset.`);
          result[field.name] = Object.hasOwn(item.attributes, field.name) ? item.attributes[field.name] : item[field.name] ?? null; continue;
        }
        const values = related(item, field.name);
        if (values === undefined) throw new Error(`Unsupported field ${field.name} on ${item.type}. Choose an example or a defined schema field.`);
        validateArgs(field, Array.isArray(values) ? ['limit'] : []);
        if (!field.fields) throw new Error(`${field.name} requires a field selection.`);
        result[field.name] = Array.isArray(values) ? limitItems(values, field).map(value => project(value, field.fields)) : values ? project(values, field.fields) : null;
      }
      return result;
    };
    const data = {};
    for (const field of fields) {
      if (Object.hasOwn(data, field.name)) throw new Error(`Root field ${field.name} is repeated; aliases are not supported by this read subset.`);
      if (!field.fields) throw new Error(`${field.name} requires a field selection.`);
      const type = { networkDevice: 'NetworkDevice', networkDevices: 'NetworkDevice', interfaces: 'Interface', services: 'Service', configs: 'Config' }[field.name];
      if (!type) throw new Error(`Unsupported root field ${field.name}. Available reads: networkDevices, networkDevice, interfaces, services, configs.`);
      validateSelection(type, field.fields);
      let matches;
      if (field.name === 'networkDevice') {
        validateArgs(field, ['id']); if (typeof field.args.id !== 'string') throw new Error('networkDevice requires a string id.');
        const item = graph.nodeById.get(field.args.id);
        if (item && item.type === 'NetworkDevice') stats.total++;
        data[field.name] = item?.type === 'NetworkDevice' ? project(item, field.fields) : null; continue;
      }
      if (field.name === 'networkDevices') {
        validateArgs(field, ['role', 'name', 'limit']);
        for (const key of ['role', 'name']) if (field.args[key] !== undefined && typeof field.args[key] !== 'string') throw new Error(`${key} must be a string.`);
        matches = graph.nodes.filter(item => item.type === 'NetworkDevice' && (!field.args.role || item.attributes.role === field.args.role) && (!field.args.name || item.label.toLowerCase().includes(String(field.args.name).toLowerCase())));
      } else if (['interfaces', 'services', 'configs'].includes(field.name)) {
        validateArgs(field, ['deviceId', 'limit']);
        const type = { interfaces: 'Interface', services: 'Service', configs: 'Config' }[field.name];
        if (field.args.deviceId !== undefined && typeof field.args.deviceId !== 'string') throw new Error('deviceId must be a string.');
        if (field.name === 'services' && field.args.deviceId) {
          const device = graph.nodeById.get(field.args.deviceId); matches = device?.type === 'NetworkDevice' ? related(device, 'services') : [];
        } else matches = graph.nodes.filter(item => item.type === type && (!field.args.deviceId || item.attributes.device_id === field.args.deviceId));
      } else throw new Error(`Unsupported root field ${field.name}. Available reads: networkDevices, networkDevice, interfaces, services, configs.`);
      data[field.name] = limitItems(matches, field, true).map(item => project(item, field.fields));
    }
    const nodes = [...selected].map(id => graph.nodeById.get(id));
    const edges = graph.edges.filter(edge => selected.has(edge.from) && selected.has(edge.to));
    return { data, nodes, edges, total: stats.total, returned: nodes.length, truncated: stats.truncated };
  } catch (error) { return { error: error.message }; }
}
