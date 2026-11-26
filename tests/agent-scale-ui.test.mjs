import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAgentCentricSnapshot } from '../src/features/agent-centric/agent-centric-model.js';
import { buildScaleSnapshot, filterJobs, summarizeJobs, getScaleCapabilities, getScaleCapabilityReadiness, getScopedSuggestions } from '../src/features/agent-centric/agent-scale-model.js';
import { getTaskId } from '../src/features/agent-centric/agent-job-tasks.js';
import { buildIncidentSnapshot } from '../src/features/agent-centric/incident-thread-model.js';

let server, cacheDirectory, Dashboard, Jobs, Suggested, StartJobPicker;
before(async () => {
  cacheDirectory = await mkdtemp(join(tmpdir(), 'cwai-scale-ui-'));
  server = await createServer({ cacheDir: cacheDirectory, server: { middlewareMode: true, hmr: false, ws: false, watch: null, open: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
  ({ default: Dashboard } = await server.ssrLoadModule('/src/features/agent-centric/AgentCentricDashboard.jsx'));
  ({ default: Jobs } = await server.ssrLoadModule('/src/features/agent-centric/AgentWorkFeed.jsx'));
  ({ default: Suggested, StartJobPicker } = await server.ssrLoadModule('/src/features/agent-centric/AgentCapabilities.jsx'));
});
after(async () => { try { await server?.close(); } finally { if (cacheDirectory) await rm(cacheDirectory, { recursive: true, force: true }); } });

const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/network-monitoring?exploration=agent-centric'] }, React.createElement(Component, props)));
const snapshot = (variant = 'main') => buildScaleSnapshot(getAgentCentricSnapshot(2, variant));
const renderJobs = (model, props = {}) => render(Jobs, { model, agents: model.agents, ...props });
const capabilitiesFor = model => getScaleCapabilities().map(capability => ({ ...capability, scope: capability.defaultScope, readiness: getScaleCapabilityReadiness(capability.id, model, capability.defaultScope) }));
const countsLabel = counts => `${counts.running} running, ${counts.waiting} waiting, ${counts.review} awaiting review, ${counts.completed} completed`;
const managerDestinations = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)]
  .map(match => new URL(match[1].replaceAll('&amp;', '&'), 'http://localhost'))
  .filter(url => url.pathname === '/network-monitoring/jobs');
const jobCard = (html, groupId) => html.match(new RegExp(`<hbr-card\\b[^>]*data-group-id="${groupId}"[^>]*>[\\s\\S]*?<\\/hbr-card>`))?.[0];
const visibleStateCounts = html => Object.fromEntries([...html.matchAll(/<span\b[^>]*data-state="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)]
  .map(([, state, content]) => [state, Number(content.match(/<strong>([\d,]+)<\/strong>/)?.[1].replaceAll(',', ''))]));
const taskIds = ['investigations', 'configuration-checks', 'event-correlation', 'risk-assessments', 'capacity-checks', 'service-checks', 'remediation', 'verification'];
const renderedTaskIds = html => [...html.matchAll(/data-group-id="([^"]+)"/g)].map(match => match[1]);
const cardTotal = html => Number(html.match(/class="agent-work-card-total"[^>]*><strong>([\d,]+)<\/strong>/)?.[1].replaceAll(',', ''));

test('all 168 jobs are represented once by task while review and job destinations remain clear', () => {
  const model = buildIncidentSnapshot(snapshot(), 'review');
  assert.equal(model.jobs.length, 168);
  assert.equal(model.decisions.length, 1);
  const html = render(Dashboard);
  const groups = renderedTaskIds(html);
  assert.deepEqual(groups, taskIds);
  assert.equal(groups.reduce((total, id) => total + cardTotal(jobCard(html, id)), 0), model.jobs.length, 'task cards partition the complete scoped collection rather than hiding jobs behind a card limit');
  assert.equal([...html.matchAll(/class="agent-clean-decision-row"/g)].length, 1, 'only the bounded incident correction requires a decision');
  assert.match(html, /aria-label="1 pending decision"/);
  assert.match(html, /id="agent-home-next-title"[^>]*>Your decisions<\/h2>/);
  assert.equal([...html.matchAll(/>Review decisions</g)].length, 0, 'one direct review entry avoids a duplicate queue action');
  assert.equal([...html.matchAll(/>Start job</g)].length, 1, 'Home has one task-launch entry');
  assert.match(html, />Jobs manager</);
  assert.match(html, />Suggested<\/h2>/);
  assert.ok([...html.matchAll(/class="agent-suggested-row"/g)].length <= 2);
  assert.doesNotMatch(html, /data-capability-id=|>Choose scope<|>View all actions<|>Review suggestion<|>Agent controls</);
  assert.ok(html.includes(countsLabel(summarizeJobs(model.jobs))), 'the displayed status counts describe the entire scoped job set');
  assert.doesNotMatch(html, />By task</, 'the task names establish grouping without an extra explanatory label');
  assert.match(html, /class="agent-work-feed-total"[^>]*>168 jobs</);
  assert.doesNotMatch(html, /Highlights from/);
  assert.doesNotMatch(html, /\d+ of \d+ work groups/);
  const destinations = managerDestinations(html);
  assert.equal(destinations.length, taskIds.length + 1, 'every task and the Jobs manager entry retain native navigation');
  assert.deepEqual(destinations.map(url => url.searchParams.get('group')).filter(Boolean), groups);
  assert.ok(destinations.every(url => url.searchParams.get('exploration') === 'agent-centric'));
});

test('every presentation state keeps decisions and all Jobs while Incidents starts as its own closed list', () => {
  for (const [state, total, linked, reviews] of [['monitoring', 167, 3, 0], ['review', 168, 4, 1], ['verification', 170, 6, 0]]) {
    const model = buildIncidentSnapshot(snapshot(), state);
    const html = render(Dashboard, { routeSearch: `?exploration=agent-centric&experience=${state}` });
    assert.match(html, new RegExp(`data-experience-state="${state}"`));
    assert.deepEqual(renderedTaskIds(html), taskIds);
    assert.match(html, /id="agent-home-next-title"[^>]*>Your decisions<\/h2>/);
    assert.equal(taskIds.reduce((sum, id) => sum + cardTotal(jobCard(html, id)), 0), total);
    assert.ok(html.includes(countsLabel(summarizeJobs(model.jobs))));
    assert.equal([...html.matchAll(/class="agent-clean-decision-row"/g)].length, reviews);
    assert.equal(model.jobs.filter(job => job.incidentId === 'INC-317').length, linked);
    assert.match(html, />Incidents<\/h2>/);
    assert.ok(html.indexOf('>Your decisions</h2>') < html.indexOf('>Jobs</h2>'), 'decisions retain their existing priority');
    assert.ok(html.indexOf('>Jobs</h2>') < html.indexOf('>Incidents</h2>'), 'the independent incident list follows the complete Jobs section');
    assert.doesNotMatch(html, /class="agent-incident-thread"/, `${state}: an incident must open only after deliberate selection`);
    assert.doesNotMatch(html, /agent-work-incident-footer|data-incident-related="true"/, 'landing incidents do not add linked counters or select task cards');
  }
});

test('work cards expose each nonzero state instead of collapsing mixed work into one status', () => {
  const model = snapshot(), html = renderJobs(model);
  for (const groupId of taskIds) {
    const counts = summarizeJobs(model.jobs.filter(job => getTaskId(job) === groupId));
    const expected = Object.fromEntries(Object.entries(counts).filter(([state, count]) => state !== 'total' && count > 0));
    const running = counts.running > 0;
    const card = jobCard(html, groupId);
    assert.ok(card, `${groupId}: the highlight must remain inspectable`);
    assert.deepEqual(visibleStateCounts(card), expected, `${groupId}: visible counts must expose the actual state mix and omit zero states`);
    assert.match(card, new RegExp(`data-running="${running}"`), `${groupId}: only current running work is eligible for live treatment`);
    assert.match(card, /data-animated="false"/, `${groupId}: rendering alone does not establish that motion is visible or eligible`);
    assert.ok(card.includes(`aria-label="${countsLabel({ running: 0, waiting: 0, review: 0, completed: 0, ...expected })}"`));
    assert.doesNotMatch(card, /<hbr-tag\b[^>]*>[\s\S]*?Assessing<\/hbr-tag>/, 'mixed jobs cannot be presented as wholly assessing');
  }
  assert.doesNotMatch(html, /role="progressbar"|class="agent-work-mix(?:\s|")/, 'text counts replace the distribution bars rather than implying elapsed progress');
});

test('compact task cards show only task totals, state counts and their actual agents', () => {
  const model = snapshot(), html = renderJobs(model);
  assert.match(html, new RegExp(`class="agent-work-feed-total"[^>]*>${model.jobs.length} jobs<`));
  assert.doesNotMatch(html, /agent-work-card-observation|agent-work-card-meta|agent-work-incident-footer|jobs in this view|Highlights from|\d+ device groups/);
  assert.doesNotMatch(html, /Archived event-source access|XR-|<time\b/, 'individual findings, router scopes and observation timestamps belong in detail');
  for (const groupId of renderedTaskIds(html)) {
    const card = jobCard(html, groupId);
    const jobs = model.jobs.filter(job => getTaskId(job) === groupId);
    assert.equal(cardTotal(card), jobs.length, `${groupId}: the quiet inline total retains every job`);
    assert.match(card, new RegExp(`aria-describedby="agent-work-${groupId}-status`), `${groupId}: its manager link retains the accessible state summary`);
    assert.doesNotMatch(card, /-finding"|<p\b|<time\b/, `${groupId}: the summary must not become a sample-job report`);
    assert.match(card, /class="agent-work-agent-stack"/);
    const expectedOwners = new Set(jobs.map(job => job.agentId));
    const shownOwners = [...card.matchAll(/data-agent-id="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(shownOwners).size, shownOwners.length, `${groupId}: an agent appears once even when it owns many jobs`);
    assert.deepEqual(new Set(shownOwners), expectedOwners, `${groupId}: glyphs identify the actual scoped owners`);
    const links = [...card.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 1, `${groupId}: the entire card has one native manager destination`);
    assert.match(links[0][1], /agent-work-agent-stack/, `${groupId}: agent marks belong to the same card destination`);
    assert.doesNotMatch(links[0][1], /<button\b|<hbr-button\b|<a\b/, `${groupId}: agent glyphs do not introduce nested actions`);
  }
});

test('incident selection cannot change task summaries or add incident actions to Jobs', () => {
  for (const state of ['monitoring', 'review', 'verification']) {
    const model = buildIncidentSnapshot(snapshot(), state);
    for (const domainFilter of ['all', 'west', 'core']) {
      const baseline = renderJobs(model, { domainFilter });
      const selected = renderJobs(model, { domainFilter, selectedIncidentId: 'INC-317', onOpenIncident: () => {} });
      assert.equal(selected, baseline, `${state}/${domainFilter}: incident detail belongs to Incidents, not the workload cards`);
      assert.doesNotMatch(selected, /agent-work-incident-footer|data-incident-id=|data-incident-count=|linked jobs/);
    }
  }
});

test('agent stacks remain bounded when several agents contribute to one task', () => {
  const model = snapshot();
  const seed = model.jobs.find(job => getTaskId(job) === 'risk-assessments');
  const owners = Object.values(model.agents);
  const jobs = owners.flatMap((agent, index) => [
    { ...seed, id: `STACK-${index}-A`, taskId: 'risk-assessments', agentId: agent.id, agent: agent.name },
    { ...seed, id: `STACK-${index}-B`, taskId: 'risk-assessments', agentId: agent.id, agent: agent.name },
  ]);
  const html = renderJobs(model, { jobs });
  const card = jobCard(html, 'risk-assessments');
  assert.equal(cardTotal(card), jobs.length);
  const shown = [...card.matchAll(/data-agent-id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(shown.length, 3, 'three agent marks leave the task summary compact');
  assert.equal(new Set(shown).size, 3, 'repeated jobs must not repeat an agent mark');
  assert.ok(shown.every(id => owners.some(agent => agent.id === id)));
  assert.match(card, /data-agent-overflow="5"/, 'overflow counts unique additional agents, not additional jobs');
  assert.equal(managerDestinations(html).filter(url => url.searchParams.get('group') === 'risk-assessments').length, 1);
});

test('device-group scoping partitions the underlying jobs before task summaries and counts are rendered', () => {
  const model = snapshot();
  for (const domainId of ['core', 'metro-east', 'europe']) {
    const ownJobs = filterJobs(model.jobs, { domainId });
    const ownCounts = summarizeJobs(ownJobs);
    const html = renderJobs(model, { domainFilter: domainId });
    assert.ok(html.includes(countsLabel(ownCounts)), `${domainId}: counts must be derived from jobs in this domain`);
    assert.ok(!html.includes(countsLabel(summarizeJobs(model.jobs))), `${domainId}: global counts must not masquerade as scoped counts`);
    const ids = renderedTaskIds(html);
    assert.deepEqual(new Set(ids), new Set(ownJobs.map(getTaskId)), `${domainId}: every nonempty scoped task remains visible`);
    assert.equal(ids.reduce((total, id) => total + cardTotal(jobCard(html, id)), 0), ownJobs.length, `${domainId}: task totals partition this device group`);
    assert.ok(managerDestinations(html).every(url => url.searchParams.get('domain') === domainId), `${domainId}: every manager destination must preserve the selected domain`);
    const otherDomains = model.jobs.filter(job => job.domainId !== domainId);
    for (const job of otherDomains) {
      if (!job.deviceId) continue;
      assert.ok(!html.includes(job.deviceId), `${domainId}: out-of-scope target ${job.deviceId} must not leak through a group observation`);
    }
  }
});

test('archive-dependent investigations remain inside their stable task rather than becoming a separate task', () => {
  const model = snapshot();
  const html = renderJobs(model);
  assert.doesNotMatch(html, /data-group-id="event-archive"/);
  const investigations = jobCard(html, 'investigations');
  assert.ok(investigations, 'the investigations task remains one destination across progressing, constrained and completed work');
  assert.equal(cardTotal(investigations), 30);
  assert.equal(visibleStateCounts(investigations).waiting, 18);
  assert.match(investigations, /group=investigations/);
  assert.doesNotMatch(investigations, /Archived event-source|archive[^<]*access|access[^<]*archive/i, 'the category stays scannable; waiting reasons are inspected in Jobs manager');
  assert.doesNotMatch(html, /shared root cause|all affected routers are down/i);
});

test('quiet results remain limited to assessed scopes and interrupted work stays last-known', () => {
  const quiet = snapshot('quiet');
  const quietHtml = renderJobs(quiet);
  assert.deepEqual(renderedTaskIds(quietHtml), ['investigations', 'configuration-checks', 'remediation']);
  for (const id of renderedTaskIds(quietHtml)) {
    const card = jobCard(quietHtml, id);
    assert.equal(cardTotal(card), 1);
    assert.deepEqual(visibleStateCounts(card), { completed: 1 }, `${id}: a completed-only task stays visible without becoming active work`);
    assert.match(card, /data-running="false"/);
  }
  for (const job of quiet.jobs) assert.ok(!quietHtml.includes(job.scope), `${job.id}: assessed-target detail stays in the manager, while the task retains its count`);
  assert.match(quietHtml, />Jobs manager</);
  assert.doesNotMatch(quietHtml, /all clear|network healthy|all devices healthy/i);

  const offline = snapshot('offline');
  const offlineHtml = renderJobs(offline);
  assert.match(offlineHtml, /data-source="last-known"/);
  assert.match(offlineHtml, /Updates interrupted/);
  assert.ok(offlineHtml.includes(`Last known: ${countsLabel(summarizeJobs(offline.jobs))}`));
  assert.doesNotMatch(offlineHtml, /data-running="true"|data-animated="true"/, 'retained running statuses do not qualify interrupted work for live treatment');
  for (const groupId of taskIds) {
    const card = jobCard(offlineHtml, groupId);
    assert.ok(card, `${groupId}: interrupted work stays inspectable`);
    const counts = { running: 0, waiting: 0, review: 0, completed: 0, ...visibleStateCounts(card) };
    assert.ok(card.includes(`aria-label="Last known: ${countsLabel(counts)}"`), `${groupId}: its own state counts retain the freshness qualifier`);
  }
  assert.doesNotMatch(offlineHtml, /all clear|network healthy|all devices healthy/i);
});

test('Suggested stays contextual while the separate task chooser requires a later scope review', () => {
  const model = snapshot();
  const capabilities = capabilitiesFor(model);
  const suggestions = getScopedSuggestions(model);
  const html = render(Suggested, { model, agents: model.agents, suggestions, onDismissSuggestion: () => {} });
  assert.match(html, />Suggested<\/h2>/);
  assert.equal([...html.matchAll(/aria-label="Open suggestion:/g)].length, Math.min(2, suggestions.length));
  assert.equal([...html.matchAll(/arialabel="Suggestion options:/g)].length, Math.min(2, suggestions.length), 'dismissal is a visible overflow action rather than another repeated blue action');
  assert.doesNotMatch(html, /data-capability-id=|>Start job<|>Choose scope<|>Review suggestion<|>Agent controls</);

  const picker = render(StartJobPicker, { capabilities, agents: model.agents });
  assert.equal([...picker.matchAll(/data-capability-id=/g)].length, 8, 'the single entry exposes all eight agent tasks in its chooser');
  assert.match(picker, /Delegate an investigation, configuration check or verification/);
  assert.match(picker, /Choose a task, then review its scope/);
  assert.match(picker, /Network changes require separate authority/);
  assert.doesNotMatch(picker, /XR-R07|XR-R12|Metro East · reachability investigation|>Ready<|>Available</);
  assert.doesNotMatch(picker, /<hbr-select\b|>Start investigation<|>Start assessment</, 'choosing a task does not submit a default scope');

  const interrupted = render(StartJobPicker, { agents: model.agents, capabilities: capabilitiesFor(snapshot('offline')) });
  assert.doesNotMatch(interrupted, />Ready<|>Available</, 'the chooser must not imply global readiness when observations are interrupted');
});

test('an inactive Option 4 contributes no product UI to the preserved explorations', () => {
  assert.equal(render(Dashboard, { active: false }), '');
});


test('every agent family is available in the filter and its jobs stay within that ownership view', () => {
  const model = snapshot();
  const html = render(Dashboard);
  const filterIds = [...html.matchAll(/<hbr-menu-item\b[^>]*data-agent-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(new Set(filterIds), new Set(Object.keys(model.agents)));
  assert.equal(filterIds.length, 8);
  for (const agent of Object.values(model.agents)) {
    const ownJobs = filterJobs(model.jobs, { agentId: agent.id });
    assert.ok(ownJobs.length > 0, `${agent.id} needs realistic owned jobs`);
    const ownHtml = renderJobs(model, { agentFilter: agent.id });
    assert.ok(ownHtml.includes(countsLabel(summarizeJobs(ownJobs))));
    const ids = renderedTaskIds(ownHtml);
    assert.deepEqual(new Set(ids), new Set(ownJobs.map(getTaskId)));
    assert.equal(ids.reduce((total, id) => total + cardTotal(jobCard(ownHtml, id)), 0), ownJobs.length, `${agent.id}: all owned jobs remain visible once across task cards`);
    assert.ok(managerDestinations(ownHtml).every(url => url.searchParams.get('agent') === agent.id), `${agent.id}: manager links preserve the selected owner`);
    const glyphOwners = [...ownHtml.matchAll(/data-agent-id="([^"]+)"/g)].map(match => match[1]);
    assert.equal(glyphOwners.length, ids.length, `${agent.id}: each scoped task shows its single distinct owner once`);
    assert.ok(glyphOwners.every(id => id === agent.id), `${agent.id}: glyphs cannot imply collaboration by filtered-out agents`);
    for (const other of Object.values(model.agents).filter(item => item.id !== agent.id)) {
      assert.ok(!ownHtml.includes(other.name), `${agent.id} must not present ${other.id} as the owner of its work`);
    }
    const actions = render(StartJobPicker, { agents: model.agents, capabilities: capabilitiesFor(model), agentFilter: agent.id });
    const chosen = [...actions.matchAll(/data-capability-id="([^"]+)"/g)].map(match => match[1]);
    assert.ok(chosen.length > 0, `${agent.id} needs an available scoped capability`);
    assert.ok(chosen.every(id => capabilitiesFor(model).find(item => item.id === id)?.agentId === agent.id));
  }
});
