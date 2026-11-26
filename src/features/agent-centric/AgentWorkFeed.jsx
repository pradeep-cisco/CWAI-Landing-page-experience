import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { filterJobs, summarizeJobs } from './agent-scale-model.js';
import { getWorkGroups } from './agent-job-groups.js';
import { buildJobsPath } from './jobs-navigation.js';
import './agent-work-feed.css';

const STATES = [['running', 'Running'], ['waiting', 'Waiting'], ['review', 'Review'], ['completed', 'Complete']];
const format = value => Number(value || 0).toLocaleString('en-US');
const AGENT_ICONS = { cdd: 'file-dotted', troubleshooter: 'magnifying-glass', remediation: 'gear-six', correlation: 'stack', toxic: 'crosshair', vulnerability: 'lock', capacity: 'trend-up', assurance: 'wifi-high' };
const TASK_ICONS = { investigations: 'magnifying-glass', 'configuration-checks': 'file-dotted', 'event-correlation': 'stack', 'risk-assessments': 'crosshair', 'capacity-checks': 'trend-up', 'service-checks': 'wifi-high', remediation: 'gear-six', verification: 'check-circle' };

function useReadingConditions(ref) {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => setReduced(preference.matches);
    const visibilityChanged = () => setVisible(!document.hidden);
    preference.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => { preference.removeEventListener('change', motionChanged); document.removeEventListener('visibilitychange', visibilityChanged); };
  }, []);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver !== 'function') { setInView(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return { reduced, visible, inView };
}

function StatusCounts({ counts, className = '', current = true, prioritize = false, id, animate = false }) {
  const states = prioritize ? [STATES[2], STATES[1], STATES[0], STATES[3]] : STATES;
  const label = `${current ? '' : 'Last known: '}${counts.running} running, ${counts.waiting} waiting, ${counts.review} awaiting review, ${counts.completed} completed`;
  const ref = useRef(null), previous = useRef(label);
  useEffect(() => {
    const changed = previous.current !== label;
    previous.current = label;
    if (!changed || !animate || typeof ref.current?.animate !== 'function') return undefined;
    const transition = ref.current.animate([{ filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], { duration: 360, easing: 'ease-out' });
    return () => transition.cancel();
  }, [label, animate]);
  return <div ref={ref} id={id} className={className} role="group" aria-label={label}>
    {states.map(([state, title]) => counts[state] > 0 && <span key={state} data-state={state}><i aria-hidden="true"/><strong>{format(counts[state])}</strong>{' '}{title}</span>)}
  </div>;
}

function ManagerLink({ children, groupId, scope, onOpenManager, ...props }) {
  const query = { ...scope, ...(groupId ? { groupId } : {}) };
  return <Link to={buildJobsPath(query)} {...props} onClick={event => {
    if (!onOpenManager || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpenManager(query, event);
  }}>{children}</Link>;
}

/** An agent appears once per task, regardless of how many jobs it owns. */
function AgentStack({ jobs, agents = {}, id }) {
  const owners = [...new Set(jobs.map(job => job.agentId).filter(Boolean))].sort().map(agentId => ({
    id: agentId, name: agents[agentId]?.name || jobs.find(job => job.agentId === agentId)?.agent || agentId,
  }));
  const label = owners.length ? `Agents: ${owners.map(owner => owner.name).join(', ')}` : 'Agent not recorded';
  return <hbr-tooltip content={label} hoist>
    <span id={id} className="agent-work-agent-stack" role="img" aria-label={label}>
      {owners.slice(0, 3).map(owner => <span className="agent-work-agent-mark" data-agent-id={owner.id} key={owner.id}><hbr-icon name={AGENT_ICONS[owner.id] || 'gear-six'} size="14px" aria-hidden="true"/></span>)}
      {owners.length > 3 && <span className="agent-work-agent-more" data-agent-overflow={owners.length - 3}>+{owners.length - 3}</span>}
      {!owners.length && <span className="agent-work-agent-mark"><hbr-icon name="question" size="14px" aria-hidden="true"/></span>}
    </span>
  </hbr-tooltip>;
}

function JobGroup({ group, model, selected, paused, scope, onOpenManager }) {
  const ref = useRef(null);
  const { reduced, visible, inView } = useReadingConditions(ref);
  const [reading, setReading] = useState(false);
  const members = group.jobs || [], counts = group.counts || summarizeJobs(members);
  const current = model.sourceState === 'current';
  const stopped = paused || reduced || !visible || !inView || reading || !current;
  const statusId = `agent-work-${group.id}-status`;
  const agentsId = `agent-work-${group.id}-agents`;
  const surface = group.id === 'risk-assessments' ? 'risk' : group.id === 'remediation' ? 'remediation' : 'network';

  return <article className="agent-work-feed-item" onMouseEnter={() => setReading(true)} onMouseLeave={() => setReading(false)} onFocusCapture={() => setReading(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setReading(false); }}>
    <hbr-card ref={ref} class="agent-work-feed-card" data-selected={selected} data-tone={group.tone} data-group-id={group.id} data-surface={surface} data-review={String(current && counts.review > 0)} data-running={String(current && counts.running > 0)} data-animated={String(!stopped && counts.running > 0)}>
      <div className="agent-work-card-content">
        {current && counts.running > 0 && <span className="agent-work-running-edge" aria-hidden="true"/>}
        <ManagerLink id={`agent-work-${group.id}`} className="agent-work-card-link" groupId={group.id} scope={scope} onOpenManager={onOpenManager} aria-label={`Open ${group.title} in Jobs manager`} aria-describedby={`${statusId} ${agentsId}`}>
          <div className="agent-work-card-top"><div className="agent-work-card-identity"><span className="agent-work-task-glyph" aria-hidden="true"><hbr-icon name={TASK_ICONS[group.id] || 'gear-six'} size="20px"/></span><h3>{group.title}</h3></div><span className="agent-work-card-total" data-job-count={members.length}><strong>{format(members.length)}</strong><span>{members.length === 1 ? 'job' : 'jobs'}</span></span></div>
          <StatusCounts id={statusId} className="agent-work-status-counts" counts={counts} current={current} prioritize animate={!stopped}/>
          <div className="agent-work-card-bottom"><AgentStack jobs={members} agents={model.agents} id={agentsId}/><hbr-icon name="arrow-right" size="14px" aria-hidden="true"/></div>
        </ManagerLink>
      </div>
    </hbr-card>
  </article>;
}

function PauseIcon({ paused }) {
  return <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true" fill="none">{paused ? <path d="M7 4.5 15 10l-8 5.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/> : <path d="M7 4.5v11M13 4.5v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>}</svg>;
}

export default function AgentWorkFeed({ model, jobs = model?.jobs || [], selectedIssueId, additionalJobs = [], domainFilter = 'all', agentFilter = 'all', presentationPaused = false, onOpenManager }) {
  const sectionRef = useRef(null);
  const [manualPaused, setManualPaused] = useState(false);
  const { reduced } = useReadingConditions(sectionRef);
  const mergedJobs = [...new Map([...jobs, ...additionalJobs].map(job => [job.id, job])).values()];
  const scopedJobs = filterJobs(mergedJobs, { domainId: domainFilter, agentId: agentFilter });
  const counts = summarizeJobs(scopedJobs), scope = { domainId: domainFilter, agentId: agentFilter, experienceState: model?.experienceState };
  const { visibleGroups } = getWorkGroups(scopedJobs, model?.issues || [], selectedIssueId);
  const current = model?.sourceState === 'current';
  const pauseLabel = manualPaused ? 'Resume updates' : 'Pause updates';
  const hasTransitions = current && visibleGroups.some(group => group.counts.running > 0);

  return <section ref={sectionRef} className="agent-work-feed" aria-labelledby="agent-work-feed-title" data-source={current ? 'current' : 'last-known'}>
    <div className="agent-work-feed-section-heading">
      <hbr-text variant="section-title"><h2 id="agent-work-feed-title">Jobs</h2></hbr-text>
      <div className="agent-work-feed-tools">
        <span className="agent-work-feed-total" data-job-count={scopedJobs.length}>{format(scopedJobs.length)} {scopedJobs.length === 1 ? 'job' : 'jobs'}</span>
        {hasTransitions && <hbr-tooltip content="Pause visual updates. Jobs continue independently." hoist><hbr-button class="agent-work-pause" variant="text" size="small" arialabel={pauseLabel} aria={{ pressed: String(manualPaused) }} disabled={reduced} onClick={() => setManualPaused(value => !value)}><PauseIcon paused={manualPaused || reduced}/></hbr-button></hbr-tooltip>}
        <ManagerLink className="agent-work-manager-link" scope={scope} onOpenManager={onOpenManager}>Jobs manager<hbr-icon name="arrow-right" size="14px" aria-hidden="true"/></ManagerLink>
      </div>
    </div>
    <div className="agent-work-feed-status-line"><StatusCounts className="agent-work-feed-counts" counts={counts} current={current}/></div>
    {!current && <p className="agent-work-feed-source"><hbr-icon name="clock" size="15px"/>Updates interrupted. Showing last-confirmed jobs.</p>}
    <div className="agent-work-feed-list">{visibleGroups.map(group => <JobGroup key={group.id} group={group} model={model} selected={Boolean(selectedIssueId && group.jobs.some(job => job.issueId === selectedIssueId))} paused={manualPaused || presentationPaused} scope={scope} onOpenManager={onOpenManager}/>)}{!visibleGroups.length && <div className="agent-work-feed-empty"><hbr-icon name="clock" size="24px"/><div><strong>{current ? model.variant === 'quiet' ? 'No jobs in assessed scopes' : 'No jobs in this scope' : 'No retained jobs in this scope'}</strong><p>{current ? 'Choose another scope or start a job.' : 'Current conditions are unavailable.'}</p></div></div>}</div>
  </section>;
}
