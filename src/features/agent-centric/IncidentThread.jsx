import { useState } from 'react';
import { jobCategory } from './agent-scale-model.js';
import { getIncidentDetail } from './incident-overview-model.js';
import './incident-thread.css';

const statuses = { running: 'Running', waiting: 'Waiting', review: 'Needs review', completed: 'Complete', unknown: 'Unavailable', next: 'Not started' };
const stateIcons = { running: ['status-in-progress', 'in-progress'], waiting: ['status-warning', 'warning'], review: ['status-info-square', 'info'], completed: ['status-positive', 'positive'], unknown: ['status-dormant', 'dormant'], next: ['status-dormant', 'dormant'] };
const text = value => typeof value === 'string' ? value : value?.text || value?.detail || value?.label || value?.title || '';

function StatusIcon({ state, size = '16px' }) {
  const [name, sentiment] = stateIcons[state] || stateIcons.unknown;
  return <hbr-icon name={name} sentiment={sentiment} size={size} aria-hidden="true"/>;
}

function SupportingJob({ job, current, inScope, expanded, onToggle }) {
  const category = jobCategory(job), state = current ? category : 'unknown';
  const evidence = [...(job.resultEvidence || []), ...(job.evidence || [])].map(text).filter(Boolean).filter((value, index, all) => all.indexOf(value) === index);
  const id = `incident-job-evidence-${job.id}`;
  return <div className="agent-incident-support-job" data-job-id={job.id} data-status={state}>
    <button type="button" className="agent-incident-job-toggle" aria-expanded={expanded} aria-controls={id} disabled={!inScope} onClick={onToggle} aria-label={`${inScope ? 'View evidence for' : 'Outside current filters:'} ${job.id} · ${job.title}`}>
      <StatusIcon state={state} size="14px"/>
      <span className="agent-incident-job-copy"><strong>{job.title}</strong><span>{job.id} · {job.agent || job.agentId}{!inScope ? ' · Outside current filters' : ''}</span></span>
      <span className="agent-incident-job-state">{current ? '' : 'Last known · '}{statuses[category]}</span>
      <hbr-icon name={expanded ? 'caret-down' : 'caret-right'} size="13px" aria-hidden="true"/>
    </button>
    <div className="agent-incident-job-evidence" id={id} hidden={!expanded}>
      <p>{job.detail || job.checkpoint}</p>
      {evidence.length > 0 && <ul>{evidence.map((value, index) => <li key={index}>{value}</li>)}</ul>}
      {job.source && <p className="agent-incident-job-source">{text(job.source)}</p>}
      {job.scope && <p className="agent-incident-job-source">{job.scope}</p>}
    </div>
  </div>;
}

/** Incident recovery is the first layer. Job evidence stays inside this context. */
export default function IncidentThread({ model, incidentId = 'INC-317', domainFilter = 'all', agentFilter = 'all', onClose, onReview, embedded = false }) {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const detail = getIncidentDetail(model, incidentId, { domainId: domainFilter, agentId: agentFilter });
  if (!detail) return null;
  const { current, outcome, progress, metric, reviewJob } = detail;
  const scopedIds = new Set(detail.scopedJobIds);
  const id = `agent-incident-${detail.id}`;
  const metricLabel = metric?.label || 'Affected-link utilization';
  const metricCurrent = current && metric?.current !== false;
  const threshold = Number.isFinite(metric?.criterion) ? `${metric.comparison === 'at-or-below' ? 'At or below ' : metric.comparison === 'at-or-above' ? 'At or above ' : ''}${metric.criterion}${metric.unit || '%'}` : null;
  const compactThreshold = Number.isFinite(metric?.criterion) ? `${metric.comparison === 'at-or-below' ? '≤' : metric.comparison === 'at-or-above' ? '≥' : ''}${metric.criterion}${metric.unit || '%'}` : null;
  const percentageComparison = metric && (!metric.unit || metric.unit === '%') && [metric.before, metric.after].every(value => Number.isFinite(value) && value >= 0 && value <= 100);
  const actionNoteState = current && !detail.actionRequired && detail.actionNote === 'No action needed' ? 'completed' : detail.state;
  return <aside className="agent-incident-thread" id={`${id}-detail`} aria-labelledby={`${id}-title`} data-embedded={embedded} data-incident-id={detail.id} data-source={current ? 'current' : 'last-known'}>
    <header className="agent-incident-header">
      <div className="agent-incident-reference"><span>{detail.id}{detail.displayScope ? ` · ${detail.displayScope}` : ''}</span>{!embedded && <hbr-button class="agent-incident-close" variant="text" size="small" arialabel="Close incident details" onClick={onClose}>Close<hbr-icon name="x" slot="suffix" size="14px" aria-hidden="true"/></hbr-button>}</div>
      <h2 id={`${id}-title`} tabIndex={-1}>{detail.displayTitle || detail.title}</h2>
      <div className="agent-incident-state" data-state={detail.state}><StatusIcon state={detail.state} size="14px"/><span>{detail.displayStateLabel || detail.stateLabel}</span></div>
      {detail.finding && !metric && <hbr-tooltip hoist content={`Source: ${detail.finding.source}`}><p className="agent-incident-finding" tabIndex={0} data-finding-job={detail.finding.jobId} data-source={detail.finding.current ? 'current' : 'last-known'} aria-label={`${detail.finding.current ? 'Observed finding' : 'Last confirmed finding'}: ${detail.finding.text} Source: ${detail.finding.source}`}>{!detail.finding.current && <span>Last confirmed · </span>}{detail.finding.text}</p></hbr-tooltip>}
    </header>
    <section className="agent-incident-outcome" data-state={outcome.state} aria-label="Current incident condition">
      <div className="agent-incident-outcome-title"><StatusIcon state={outcome.state}/><h3>{outcome.title}</h3></div>
      {metric ? <><div className="agent-incident-result" data-source={metricCurrent ? 'current' : 'last-known'} role="group" aria-label={`${metricCurrent ? '' : 'Last confirmed: '}${metricLabel}, ${metric.before}${metric.unit || '%'} before, ${metric.after}${metric.unit || '%'} verified. ${threshold ? `Criterion ${threshold}.` : ''} Source: ${metric.source}`}><span>{metricCurrent ? '' : 'Last confirmed · '}{metricLabel}</span><strong>{metric.before}{metric.unit || '%'} <span aria-hidden="true">→</span> <em>{metric.after}{metric.unit || '%'}</em></strong></div>{percentageComparison && <div className="agent-incident-comparison" data-source={metricCurrent ? 'current' : 'last-known'} aria-hidden="true"><span data-measurement="before"><b>Before</b><span><i style={{ width: `${metric.before}%` }}/></span></span><span data-measurement="verified"><b>Verified</b><span><i style={{ width: `${metric.after}%` }}/></span></span></div>}<p className="agent-incident-result-note">5-min mean{compactThreshold ? ` · target ${compactThreshold}` : ''}</p></> : outcome.detail && <p className="agent-incident-outcome-detail">{outcome.detail}</p>}
    </section>
    <ol className="agent-incident-progress" aria-label="Incident progress">{progress.map(stage => <li key={stage.id} data-stage={stage.id} data-state={stage.state}><span className="agent-incident-progress-mark"><StatusIcon state={stage.state} size="14px"/></span><span className="agent-incident-progress-title">{stage.title}</span><span className="agent-incident-progress-state">{stage.label}</span></li>)}</ol>
    <section className="agent-incident-now" aria-label="Next step"><span>Now</span><p>{detail.now}</p>{reviewJob ? <hbr-button size="small" class="agent-incident-review" disabled={typeof onReview !== 'function'} onClick={event => onReview?.(reviewJob, event)}>Review change</hbr-button> : <div className="agent-incident-action-note"><StatusIcon state={actionNoteState} size="13px"/><span>{detail.actionNote}</span></div>}</section>
    <hbr-accordion class="agent-incident-support" label={`Supporting jobs · ${detail.jobCount}`} size="small" triggerposition="left" variant="borderless" onhbr-hide={event => { if (event.target === event.currentTarget) setExpandedJobId(null); }}>
      {detail.inScopeJobCount !== detail.jobCount && <p className="agent-incident-filter-note">Incident-wide context · {detail.inScopeJobCount} of {detail.jobCount} jobs in this view</p>}
      <div className="agent-incident-support-list">{detail.jobs.map(job => <SupportingJob key={job.id} job={job} current={current} inScope={scopedIds.has(job.id)} expanded={expandedJobId === job.id} onToggle={() => setExpandedJobId(value => value === job.id ? null : job.id)}/>)}</div>
    </hbr-accordion>
  </aside>;
}
