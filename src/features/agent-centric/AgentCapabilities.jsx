import { useState } from 'react';
import './agent-capabilities.css';

const LANDING_ACTION_LIMIT = 3;
const nameFor = (agents, id) => agents?.[id]?.name || 'Crosswork AI agent';
const shortNameFor = (agents, id) => agents?.[id]?.shortName || nameFor(agents, id);
const inputValue = event => String(event.currentTarget?.value ?? event.target?.value ?? event.detail?.value ?? '');

/** Retained for contextual ranking in the task chooser, rather than adding launch cards to Home. */
export function selectCapabilityActions({ capabilities = [], issues = [], agentFilter = 'all', selectedIssueId, expanded = false }) {
  const currentIssues = new Set(issues.filter(issue => !['resolved', 'verified'].includes(String(issue.state).toLowerCase())).map(issue => issue.id));
  const filtered = capabilities.filter(capability => agentFilter === 'all' || capability.agentId === agentFilter);
  const ordered = [...filtered].sort((a, b) => {
    const related = Number(Boolean(selectedIssueId && b.issueId === selectedIssueId)) - Number(Boolean(selectedIssueId && a.issueId === selectedIssueId));
    if (related) return related;
    const applicable = Number(!b.issueId || currentIssues.has(b.issueId)) - Number(!a.issueId || currentIssues.has(a.issueId));
    return applicable || (a.landingPriority ?? a.priority ?? 100) - (b.landingPriority ?? b.priority ?? 100);
  });
  return { available: ordered, visible: expanded ? ordered : ordered.slice(0, LANDING_ACTION_LIMIT) };
}

export function filterStartJobCapabilities(capabilities = [], agents = {}, agentFilter = 'all', query = '') {
  const term = query.normalize('NFKC').trim().toLocaleLowerCase();
  return capabilities.filter(capability => (agentFilter === 'all' || capability.agentId === agentFilter) && (!term || [capability.title, capability.description, nameFor(agents, capability.agentId), shortNameFor(agents, capability.agentId)].join(' ').toLocaleLowerCase().includes(term)));
}

/** Task selection only. The parent reviews the exact scope before submitting a request. */
export function StartJobPicker({ capabilities = [], agents = {}, agentFilter = 'all', onPick, onClearAgent }) {
  const [query, setQuery] = useState('');
  const visible = filterStartJobCapabilities(capabilities, agents, agentFilter, query);
  return <div className="agent-task-picker">
    <div className="agent-task-picker-intro"><p>Delegate an investigation, configuration check or verification.</p><span>Choose a task, then review its scope and requirements. Network changes require separate authority.</span></div>
    <hbr-input class="agent-task-picker-search" label="Find task" placeholder="Task or agent" value={query} clearable onhbr-input={event => setQuery(inputValue(event))}><hbr-icon name="magnifying-glass" slot="prefix" size="17px"/></hbr-input>
    {agentFilter !== 'all' && <div className="agent-task-picker-filter"><span>{nameFor(agents, agentFilter)}</span>{onClearAgent && <hbr-button variant="text" size="small" onClick={onClearAgent}>Show all agents</hbr-button>}</div>}
    <div className="agent-task-picker-list">
      {visible.map(capability => {
        const state = capability.readiness?.state;
        const constraint = ['restricted', 'unavailable', 'degraded'].includes(state) ? capability.readiness.label : null;
        return <button type="button" className="agent-task-picker-row" key={capability.id} data-capability-id={capability.id} onClick={event => onPick?.(capability, event)} aria-label={`Choose task: ${capability.title}`}>
          <span className="agent-task-picker-symbol" aria-hidden="true"><hbr-icon name={capability.icon || agents[capability.agentId]?.icon || 'nav-workflows'} size="21px"/></span>
          <span className="agent-task-picker-copy"><strong>{capability.title}</strong><span>{capability.description}</span><small>{nameFor(agents, capability.agentId)}{constraint && <span className="agent-task-picker-constraint"> · {constraint}</span>}</small></span>
          <hbr-icon class="agent-task-picker-chevron" name="caret-line-right" size="16px" aria-hidden="true"/>
        </button>;
      })}
    </div>
    {!visible.length && <div className="agent-task-picker-empty"><hbr-icon name="magnifying-glass" size="24px"/><strong>No matching tasks</strong><p>Try another task or agent name.</p>{query && <hbr-button size="small" variant="text" onClick={() => setQuery('')}>Clear search</hbr-button>}</div>}
  </div>;
}

function Suggestion({ item, agents, selected, onOpen, onDismiss }) {
  return <article className="agent-suggested-row" data-related={selected} data-agent={item.agentId}>
    <button type="button" className="agent-suggested-main" onClick={event => onOpen?.(item, event)} aria-label={`Open suggestion: ${item.title}`}>
      <span className="agent-suggested-symbol" aria-hidden="true"><hbr-icon name={item.icon || agents[item.agentId]?.icon || 'nav-investigate'} size="21px"/></span>
      <span className="agent-suggested-copy"><strong>{item.title}</strong><span>{item.reason}</span><small>{shortNameFor(agents, item.agentId)}</small></span>
      <hbr-icon class="agent-suggested-chevron" name="caret-line-right" size="16px" aria-hidden="true"/>
    </button>
    {onDismiss && <hbr-dropdown class="agent-suggested-overflow" hoist menu placement="bottom-end"><hbr-button slot="trigger" variant="text" size="small" arialabel={`Suggestion options: ${item.title}`}><hbr-icon name="dots-three" size="18px"/></hbr-button><hbr-menu onhbr-select={event => { if (event.detail?.item?.value === 'dismiss') onDismiss(item.id); }}><hbr-menu-item value="dismiss">Dismiss suggestion</hbr-menu-item></hbr-menu></hbr-dropdown>}
  </article>;
}

/** Assignment governance is available in the manager, separate from the landing suggestions. */
export function AgentControls({ agents = {}, eligibility = {}, controlState = {}, model, agentFilter = 'all', onAgentControl }) {
  const sourceCurrent = model?.sourceState === 'current';
  const entries = Object.entries(agents).filter(([id]) => agentFilter === 'all' || agentFilter === id);
  return <details className="agent-capabilities-controls">
    <summary>Agent controls</summary>
    <p className="agent-capabilities-controls-intro">Control new assignments across permitted device groups. Running jobs keep their owner and current state.</p>
    <div className="agent-capabilities-agent-list">
      {entries.map(([id, agent]) => {
        const state = controlState?.[id] || (controlState?.agentId === id ? controlState : null);
        const pending = state?.pending === true || state?.state === 'submitted' || state?.state === 'pending';
        const restricted = eligibility?.[id] === 'restricted' || agent.eligibility === 'restricted';
        const health = agent.health || model?.jobs?.find(job => job.agentId === id)?.health;
        const label = restricted ? 'Allow new assignments' : 'Stop new assignments';
        return <div key={id} className="agent-capabilities-agent-row" data-pending={pending}>
          <div className="agent-capabilities-agent-copy"><strong>{agent.name}</strong><span>{agent.version && `Version ${agent.version} · `}{health ? `${sourceCurrent ? '' : 'Last observed: '}${health}` : 'Health unavailable'}</span></div>
          <hbr-tag size="small" sentiment={pending ? 'info' : 'inactive'} status>{pending ? 'Submitted' : `${sourceCurrent ? '' : 'Last known · '}${restricted ? 'Restricted' : 'Allowed'}`}</hbr-tag>
          <hbr-button class="agent-capabilities-control-action" size="small" variant="outline" disabled={!sourceCurrent || pending || model?.permissions?.governAgents === false} arialabel={`${label}: ${agent.name}`} onClick={event => onAgentControl?.(id, restricted ? 'eligible' : 'restricted', event)}>{label}</hbr-button>
          {pending && <p className="agent-capabilities-control-note">Waiting for confirmation. Assignments have not changed.</p>}
        </div>;
      })}
    </div>
    {!sourceCurrent && <p className="agent-capabilities-control-note">Restore updates before changing assignments.</p>}
  </details>;
}

/** Optional next steps are quiet navigation; required decisions remain in Needs review. */
export default function Suggested({ model, agents = {}, selectedIssueId, agentFilter = 'all', suggestions = [], onDismissSuggestion, onSuggestion }) {
  const visible = suggestions.filter(item => agentFilter === 'all' || item.agentId === agentFilter).slice(0, 2);
  if (!visible.length) return null;
  return <section className="agent-capabilities agent-suggested" aria-labelledby="agent-capabilities-title" aria-describedby="agent-suggested-optional" data-source={model?.sourceState === 'current' ? 'current' : 'last-known'}>
    <div className="agent-capabilities-heading"><hbr-text variant="section-title"><h2 id="agent-capabilities-title">Suggested</h2></hbr-text><span id="agent-suggested-optional" className="agent-suggested-optional">Optional</span></div>
    <hbr-card class="agent-suggested-surface">{visible.map(item => <Suggestion key={item.id} item={item} agents={agents} selected={item.issueId === selectedIssueId} onOpen={onSuggestion} onDismiss={onDismissSuggestion}/>)}</hbr-card>
  </section>;
}
