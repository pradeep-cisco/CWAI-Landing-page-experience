import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server, Suggested, Picker, Controls, select, filterTasks;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  const module = await server.ssrLoadModule('/src/features/agent-centric/AgentCapabilities.jsx');
  Suggested = module.default;
  Picker = module.StartJobPicker;
  Controls = module.AgentControls;
  select = module.selectCapabilityActions;
  filterTasks = module.filterStartJobCapabilities;
});
after(async () => { await server?.close(); });

const ids = ['assess', 'toxic', 'vulnerabilities', 'investigate', 'correlate', 'capacity', 'services', 'verify'];
const capabilities = ids.map((id, index) => ({ id, title: `Action ${id}`, description: `Purpose ${id}`, agentId: `agent-${id}`, landingPriority: index, scope: `Declared scope ${index}`, readiness: { state: 'ready', label: 'Ready', canStart: true } }));
const agents = Object.fromEntries(capabilities.map(item => [item.agentId, { id: item.agentId, name: `Full ${item.agentId}`, shortName: item.id, health: 'Healthy' }]));

test('eight actions remain discoverable while the landing contains at most three', () => {
  const landing = select({ capabilities });
  assert.equal(landing.available.length, 8);
  assert.equal(landing.visible.length, 3);
  const expanded = select({ capabilities, expanded: true });
  assert.deepEqual(new Set(expanded.visible.map(item => item.id)), new Set(ids));
  assert.deepEqual(capabilities.map(item => item.id), ids, 'ranking must not mutate source data');
});

test('an explicitly selected issue takes precedence and an agent filter never exposes other agents', () => {
  const source = capabilities.map(item => item.id === 'services' ? { ...item, issueId: 'service-issue' } : item);
  const landing = select({ capabilities: source, issues: [{ id: 'service-issue', state: 'open' }], selectedIssueId: 'service-issue' });
  assert.equal(landing.visible[0].id, 'services');
  const filtered = select({ capabilities: source, agentFilter: 'agent-capacity', selectedIssueId: 'service-issue', expanded: true });
  assert.deepEqual(filtered.visible.map(item => item.id), ['capacity']);
  assert.deepEqual(select({ capabilities: source, agentFilter: 'not-permitted' }).visible, []);
});

test('Suggested stays bounded and does not duplicate launch controls or governance on Home', () => {
  const suggestions = [0, 1, 2].map(index => ({ id: `suggestion-${index}`, title: `Finding ${index}`, reason: `Scoped reason ${index}`, agentId: capabilities[index].agentId }));
  const html = renderToStaticMarkup(React.createElement(Suggested, { model: { sourceState: 'current' }, suggestions, capabilities, agents, onDismissSuggestion: () => {} }));
  assert.match(html, />Suggested<\/h2>/);
  assert.equal((html.match(/class="agent-suggested-main"/g) || []).length, 2);
  assert.equal((html.match(/Suggestion options:/g) || []).length, 2);
  assert.doesNotMatch(html, /Choose scope|Review suggestion|View all actions|agent-capabilities-controls|data-capability-id=/);
  assert.doesNotMatch(html, /Finding 2/);
});

test('the task picker exposes all eight tasks without presenting default-scope readiness as global', () => {
  const html = renderToStaticMarkup(React.createElement(Picker, { capabilities, agents }));
  assert.equal((html.match(/data-capability-id=/g) || []).length, 8);
  assert.match(html, /Action assess/);
  assert.match(html, /Purpose assess/);
  assert.doesNotMatch(html, />Ready<|Declared scope/);
  assert.equal((html.match(/aria-label="Choose task:/g) || []).length, 8);
  assert.match(html, /review its scope and requirements/);
});

test('task search and agent context intersect without changing the available source capabilities', () => {
  assert.equal(filterTasks(capabilities, agents, 'all', 'FULL AGENT-CAPACITY').length, 1);
  assert.deepEqual(filterTasks(capabilities, agents, 'agent-capacity', 'Purpose capacity').map(item => item.id), ['capacity']);
  assert.deepEqual(filterTasks(capabilities, agents, 'agent-capacity', 'assess'), []);
  assert.equal(filterTasks(capabilities, agents).length, 8);
  const html = renderToStaticMarkup(React.createElement(Picker, { capabilities, agents, agentFilter: 'agent-capacity' }));
  assert.equal((html.match(/data-capability-id=/g) || []).length, 1);
  assert.match(html, /Action capacity/);
  assert.doesNotMatch(html, /Action assess/);
});

test('interrupted observations qualify manager governance while controls remain collapsed and unavailable', () => {
  const html = renderToStaticMarkup(React.createElement(Controls, { model: { sourceState: 'interrupted', permissions: { governAgents: false } }, agents }));
  assert.match(html, /<details class="agent-capabilities-controls">/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  assert.equal((html.match(/agent-capabilities-agent-row/g) || []).length, 8);
  assert.match(html, /Last observed: Healthy/);
  assert.match(html, /Restore updates before changing assignments/);
  assert.match(html, /across permitted device groups/);
});

test('an empty Suggested region adds no idle panel or false all-clear', () => {
  assert.equal(renderToStaticMarkup(React.createElement(Suggested, { model: { sourceState: 'current' }, agents })), '');
  assert.equal(renderToStaticMarkup(React.createElement(Suggested, { model: { sourceState: 'interrupted' }, agents })), '');
});
