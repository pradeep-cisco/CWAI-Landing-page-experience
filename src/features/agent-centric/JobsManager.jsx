import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getWorkGroups, resolveWorkGroup } from './agent-job-groups.js';
import { buildAgentHomePath, buildJobsPath, getJobsPage, normalizeJobsQuery, selectManagerJobs, UNAVAILABLE_FILTER } from './jobs-navigation.js';
import './jobs-manager.css';

const format = value => Number(value || 0).toLocaleString('en-US');
const valueFrom = event => String(event.currentTarget?.value ?? event.target?.value ?? event.detail?.value ?? '');
const tones = new Set(['info', 'warning', 'positive', 'negative', 'inactive']);
const tone = value => tones.has(value) ? value : 'info';
const plainClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
const statusOptions = [['all', 'All statuses'], ['running', 'Running'], ['waiting', 'Waiting'], ['review', 'Needs review'], ['completed', 'Completed']];

/** A dedicated work surface. The owning dashboard retains requests, decisions and authority. */
export default function JobsManager({ model, query: requestedQuery = {}, onQueryChange, onInspect, onReview, onHome, homePath, onStartJob, agentControls, selectedJobId }) {
  const query = normalizeJobsQuery(requestedQuery);
  const titleRef = useRef(null);
  const signature = JSON.stringify(query);
  const jobs = useMemo(() => selectManagerJobs(model, JSON.parse(signature)), [model, signature]);
  const page = getJobsPage(jobs, query);
  const groups = getWorkGroups(model.jobs || [], model.issues || []).allGroups;
  const uniqueGroups = [...new Map(groups.map(group => [group.id, group])).values()];
  const selectedSavedGroup = query.groupId !== 'all' && !uniqueGroups.some(group => group.id === query.groupId)
    ? resolveWorkGroup(model.jobs || [], model.issues || [], query.groupId) : null;
  const current = model.sourceState === 'current';
  const filtered = query.domainId !== 'all' || query.agentId !== 'all' || query.status !== 'all' || query.groupId !== 'all' || query.query;
  const unavailable = [query.domainId, query.agentId, query.status, query.groupId].includes(UNAVAILABLE_FILTER);
  const selectedOutside = query.jobId && selectedJobId !== query.jobId && !jobs.some(job => job.id === query.jobId);
  const setQuery = (patch, keepPage = false) => onQueryChange?.(normalizeJobsQuery({ ...query, ...patch, page: keepPage ? patch.page ?? query.page : 0, jobId: '' }));
  const openJob = (job, event) => {
    if (!plainClick(event)) return;
    const review = query.status === 'review' && current && model.permissions?.reviewChange && job.canReview && onReview;
    if (review || onInspect) { event.preventDefault(); (review ? onReview : onInspect)(job, event); }
  };
  const home = homePath || buildAgentHomePath(query);

  return <section className="agent-jobs-manager" data-source={current ? 'current' : 'last-known'} aria-labelledby="agent-jobs-manager-title">
    <div className="agent-jobs-breadcrumb"><Link to={home} onClick={event => { if (onHome && plainClick(event)) { event.preventDefault(); onHome(event); } }}><hbr-icon name="arrow-left" size="14px"/>Home</Link><span aria-hidden="true">/</span><span>Jobs</span></div>
    <header className="agent-jobs-page-heading">
      <div className="agent-jobs-page-title"><span className="agent-jobs-page-glyph" aria-hidden="true"><hbr-icon name="nav-workflows" size="27px"/></span><div><h1 id="agent-jobs-manager-title" ref={titleRef} tabIndex={-1}>Jobs manager</h1><p>{query.status === 'review' ? 'Review scoped changes before agents continue.' : 'Follow investigations, findings and verified outcomes.'}</p></div></div>
      <div className="agent-jobs-page-actions"><span className="agent-jobs-freshness" data-current={current}><i aria-hidden="true"/>{current ? 'Live work' : 'Last known'}</span>{onStartJob && <hbr-button size="small" variant="outline" disabled={!model.permissions?.startReadOnly || !current} onClick={onStartJob}><hbr-icon name="plus" slot="prefix" size="14px"/>Start job</hbr-button>}</div>
    </header>

    {!current && <div className="agent-jobs-manager-notice" role="status"><hbr-icon name="clock" size="16px"/><p>Updates interrupted. These are last-confirmed records; new starts and approvals are unavailable.</p></div>}
    {unavailable && <div className="agent-jobs-manager-notice" role="status"><hbr-icon name="status-warning" size="16px"/><p>A saved filter is unavailable. Choose a valid scope or reset filters.</p></div>}
    {selectedOutside && <div className="agent-jobs-manager-notice" role="status"><hbr-icon name="nav-investigate" size="16px"/><p>The selected job is unavailable in this view.</p><hbr-button variant="text" size="small" onClick={() => onQueryChange?.({ ...query, jobId: '' })}>Clear selection</hbr-button></div>}

    <div className="agent-jobs-manager-surface">
      <div className="agent-jobs-manager-filters">
        <hbr-input class="agent-jobs-search" label="Search jobs" placeholder="Find a job, device, issue or agent" value={query.query} clearable onhbr-input={event => setQuery({ query: valueFrom(event) })}/>
        <hbr-select label="Device group" size="small" value={query.domainId} onhbr-change={event => setQuery({ domainId: valueFrom(event) })}>
          <hbr-option value="all">All device groups</hbr-option>{query.domainId === UNAVAILABLE_FILTER && <hbr-option value={UNAVAILABLE_FILTER}>Unavailable device group</hbr-option>}{model.network.domains.map(domain => <hbr-option key={domain.id} value={domain.id}>{domain.name}</hbr-option>)}
        </hbr-select>
        <hbr-select label="Agent" size="small" value={query.agentId} onhbr-change={event => setQuery({ agentId: valueFrom(event) })}>
          <hbr-option value="all">All agents</hbr-option>{query.agentId === UNAVAILABLE_FILTER && <hbr-option value={UNAVAILABLE_FILTER}>Unavailable agent</hbr-option>}{Object.values(model.agents).map(agent => <hbr-option key={agent.id} value={agent.id}>{agent.shortName || agent.name}</hbr-option>)}
        </hbr-select>
        <hbr-select label="Status" size="small" value={query.status} onhbr-change={event => setQuery({ status: valueFrom(event) })}>
          {query.status === UNAVAILABLE_FILTER && <hbr-option value={UNAVAILABLE_FILTER}>Unavailable status</hbr-option>}{statusOptions.map(([value, label]) => <hbr-option key={value} value={value}>{label}</hbr-option>)}
        </hbr-select>
      </div>
      <div className="agent-jobs-manager-subfilters"><hbr-select label="Task" size="small" value={query.groupId} onhbr-change={event => setQuery({ groupId: valueFrom(event) })}><hbr-option value="all">All tasks</hbr-option>{query.groupId !== 'all' && !uniqueGroups.some(group => group.id === query.groupId) && <hbr-option value={query.groupId}>{selectedSavedGroup ? `${selectedSavedGroup.title} (saved filter)` : 'Unavailable task'}</hbr-option>}{uniqueGroups.map(group => <hbr-option key={group.id} value={group.id}>{group.title}</hbr-option>)}</hbr-select><div className="agent-jobs-manager-range" role="status">{jobs.length ? <><strong>{format(page.start)}–{format(page.end)}</strong> of {format(page.total)} {page.total === 1 ? 'job' : 'jobs'}</> : 'No matching jobs'}</div>{filtered && <hbr-button class="agent-jobs-reset" variant="text" size="small" onClick={() => onQueryChange?.(normalizeJobsQuery())}>Reset filters</hbr-button>}</div>
      <div className="agent-jobs-table" role="table" aria-label="Agent jobs" aria-rowcount={jobs.length + 1}>
        <div className="agent-jobs-table-header" role="row"><span role="columnheader">Job</span><span role="columnheader">Agent</span><span role="columnheader">Scope</span><span role="columnheader">Status</span><span role="columnheader" className="agent-jobs-sr">Open job</span></div>
        <div role="rowgroup">{page.jobs.map(job => {
          const agent = model.agents[job.agentId];
          const review = query.status === 'review' && current && model.permissions?.reviewChange && job.canReview && onReview;
          return <div className="agent-jobs-table-row" role="row" key={job.id} data-selected={job.id === (selectedJobId || query.jobId)}>
            <div className="agent-jobs-table-purpose" role="cell"><span className="agent-jobs-type-icon" aria-hidden="true"><hbr-icon name={agent?.icon || 'nav-workflows'} size="18px"/></span><div><Link className="agent-jobs-table-link" to={buildJobsPath({ ...query, jobId: job.id })} onClick={event => openJob(job, event)} aria-label={`${review ? 'Review change' : 'Open job'}: ${job.title} · ${job.scope}`}><strong>{job.title}</strong></Link><p>{job.finding || job.checkpoint}</p>{job.incidentId && <span className="agent-jobs-incident"><hbr-icon name="nav-alerts" size="11px"/>{job.incidentId}</span>}</div></div>
            <div className="agent-jobs-table-owner" role="cell"><span className="agent-jobs-mobile-label">Agent</span><span title={agent?.name || job.agent}>{agent?.shortName || job.agent}</span></div>
            <div className="agent-jobs-table-scope" role="cell"><span className="agent-jobs-mobile-label">Scope</span><span>{job.scope}</span></div>
            <div className="agent-jobs-table-status" role="cell"><hbr-tag size="small" sentiment={tone(job.tone)} status>{current ? job.status : `Last known · ${job.status}`}</hbr-tag></div>
            <div className="agent-jobs-table-open" role="cell" aria-hidden="true"><hbr-icon name="arrow-right" size="15px"/></div>
          </div>;
        })}</div>
      </div>
      {!jobs.length && <div className="agent-jobs-manager-empty"><span><hbr-icon name={current ? 'nav-workflows' : 'clock'} size="28px"/></span><h2>{current ? 'No jobs match this view' : 'No retained jobs match this view'}</h2><p>{current ? 'Change the filters or start a scoped assessment.' : 'Current conditions cannot be inferred from an empty view.'}</p></div>}
      {page.total > 12 && <div className="agent-jobs-manager-pagination"><span>Page {page.page + 1} of {page.pageCount}</span><div><hbr-button size="small" variant="outline" disabled={page.page === 0} onClick={() => setQuery({ page: page.page - 1 }, true)}><hbr-icon name="arrow-left" slot="prefix" size="13px"/>Previous</hbr-button><hbr-button size="small" variant="outline" disabled={page.page >= page.pageCount - 1} onClick={() => setQuery({ page: page.page + 1 }, true)}>Next<hbr-icon name="arrow-right" slot="suffix" size="13px"/></hbr-button></div></div>}
    </div>
    {agentControls && <div className="agent-jobs-manager-agent-controls">{agentControls}</div>}
  </section>;
}
