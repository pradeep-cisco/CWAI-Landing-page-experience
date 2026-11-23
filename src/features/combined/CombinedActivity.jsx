import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import './combined-activity.css';

const EMPTY_SET = new Set();
const ROUTE = 'ROUTE-104';
const CHECK = 'CHECK-208';
const REACH = 'REACH-319';
const sentiments = new Set(['info', 'positive', 'warning', 'negative', 'inactive']);
const sentiment = tone => sentiments.has(tone) ? tone : 'info';
const isComplete = job => ['Verified', 'Assessment complete'].includes(job.status);
const bucketSentiments = { Running: 'info', Review: 'warning', Waiting: 'info', 'Needs attention': 'negative', Complete: 'positive' };
const bucketIcons = { Running: 'nav-workflows', Review: 'status-warning', Waiting: 'clock', 'Needs attention': 'status-warning', Complete: 'check-circle' };

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useDocumentVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver !== 'function') { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function workBucket(job) {
  if (isComplete(job)) return 'Complete';
  if (['Review required', 'Plan changed'].includes(job.status)) return 'Review';
  if (/unknown|Partial result|Verification unavailable/i.test(job.status)) return 'Needs attention';
  if (/^Waiting|^Held$|^Revision requested$|^Decision submitted$/i.test(job.status)) return 'Waiting';
  return 'Running';
}

/** Confirmed checkpoints, never elapsed time or a synthetic completion estimate. */
function checkpoints(job, model) {
  if (job.id === CHECK || job.id === ROUTE && model.variant === 'expected') {
    const done = isComplete(job);
    return [{ label: 'Assess', state: done ? 'complete' : 'current' }, { label: 'Complete', state: done ? 'complete' : 'future' }];
  }
  if (job.id === REACH) return [
    { label: 'Source', state: 'waiting' },
    { label: 'Investigate', state: 'future' },
    { label: 'Conclude', state: 'future' },
  ];
  const records = (model.actions || []).filter(record => record.job === job.id);
  const has = id => records.some(record => record.id === id);
  const verified = job.status === 'Verified' && (model.criteria || []).length > 0 && model.criteria.every(criterion => criterion.state === 'met');
  const assessed = model.scene >= 1 && model.variant !== 'evidence';
  const authorized = has('plan-authorized');
  const acknowledged = has('execution-acknowledged');
  const completed = has('operation-completed');
  const assessmentWaiting = model.variant === 'evidence';
  const reviewWaiting = ['Held', 'Revision requested', 'Plan changed'].includes(job.status);
  const executionWaiting = ['Execution status unknown', 'Partial result reported'].includes(job.status);
  return [
    { label: 'Assess', state: assessed ? 'complete' : assessmentWaiting ? 'waiting' : 'current' },
    { label: 'Review', state: authorized ? 'complete' : assessed && model.scene >= 2 ? reviewWaiting ? 'waiting' : 'current' : 'future' },
    { label: 'Execute', state: completed ? 'complete' : acknowledged ? executionWaiting ? 'waiting' : 'current' : 'future' },
    { label: 'Verify', state: verified ? 'complete' : completed ? job.status === 'Verification unavailable' || model.sourceState !== 'current' ? 'waiting' : 'current' : 'future' },
  ];
}

function recordObservation(record) {
  return { id: `record:${record.id}`, label: record.title, text: record.label, time: record.time || null, source: record.record || 'Confirmed work record' };
}

function criterionObservation(criterion) {
  return { id: `criterion:${criterion.id}:${criterion.state}`, label: criterion.state === 'met' ? 'Outcome observation' : criterion.state === 'unavailable' ? 'Evidence unavailable' : 'Verification checkpoint', text: criterion.detail, time: criterion.time || null, source: criterion.source };
}

/** Read-only supporting records. Revealing these never changes the anchor job. */
function supportingObservations(job, model) {
  const records = (model.actions || []).filter(record => record.job === job.id);
  if (job.id === REACH) return [
    { id: 'reach-source', label: 'Source prerequisite', text: 'Archived event-source access is required for this investigation.', source: job.source },
    { id: 'reach-access', label: 'Access', text: 'Source access has not been established for this job.', source: job.source },
    { id: 'reach-ownership', label: 'Ownership', text: 'Crosswork AI retains follow-up with the integration owner.', source: 'Investigation ownership' },
  ];
  if (job.id === CHECK) {
    if (records.length) return [
      ...records.map(recordObservation),
      { id: 'check-scope', label: 'Assessment scope', text: 'The read-only result applies to XR-R12 and its assessed changes.', time: records.at(-1).time, source: job.source },
      { id: 'check-authority', label: 'Read-only result', text: 'This assessment does not authorize a corrective operation on another router.', time: records.at(-1).time, source: records.at(-1).record },
    ];
    return [
      { id: 'check-compare', label: 'Assessment', text: 'Recent configuration changes are being compared with their authorized records.', source: job.source },
      { id: 'check-source', label: 'Sources', text: job.source, source: 'Assessment source context' },
    ];
  }
  if (model.variant === 'expected') return [
    ...records.map(recordObservation),
    { id: 'expected-intent', label: 'Approved intent', text: model.proposal.intent, source: job.source },
  ];
  if (model.variant === 'evidence') return [
    { id: 'intent-unavailable', label: 'Intent source', text: 'The available baseline is outdated; the approved target is unresolved.', source: job.source },
    { id: 'intent-boundary', label: 'Change boundary', text: 'No restoration is proposed against an uncertain target.', source: 'Assessment constraint' },
  ];
  if (model.scene >= 6 || ['unknown', 'partial', 'capability', 'offline'].includes(model.variant)) {
    const latest = records.at(-1);
    const criteria = model.criteria || [];
    return [
      ...(latest ? [recordObservation(latest)] : []),
      ...criteria.filter(criterion => criterion.state === 'met' || criterion.state === 'unavailable').map(criterionObservation),
      ...(criteria.some(criterion => criterion.state === 'pending') ? [{ id: 'proof-pending', label: 'Outcome evidence', text: `${criteria.filter(criterion => criterion.state !== 'met').length} required criteria remain unconfirmed.`, source: 'Reviewed verification criteria' }] : []),
    ];
  }
  if (records.length) return [
    recordObservation(records.at(-1)),
    { id: `scope:v${model.proposal.version}`, label: 'Reviewed scope', text: model.proposal.boundary, source: `PLAN-ROUTE-104 v${model.proposal.version}` },
    { id: `checkpoint:${job.status}`, label: 'Current checkpoint', text: job.checkpoint, source: job.source },
  ];
  if (model.scene === 3) return [
    { id: 'decision-pending', label: 'Authority', text: 'Decision submission is pending confirmation from the authority service.', source: `PLAN-ROUTE-104 v${model.proposal.version}` },
    { id: 'decision-scope', label: 'Proposal', text: `The submitted request refers to proposal v${model.proposal.version} and its exact scope.`, source: model.proposal.scope },
    { id: 'decision-no-write', label: 'Execution boundary', text: 'No controller operation has been issued.', source: 'Current work state' },
  ];
  if (model.proposal?.available) return (model.proposal.validation || []).slice(0, 3).map((text, index) => ({
    id: `validation:v${model.proposal.version}:${index}`, label: ['Approved intent', 'Configuration observation', 'Change comparison'][index], text, source: `PLAN-ROUTE-104 v${model.proposal.version} · validation`,
  }));
  return [
    { id: `assessment:${model.scene}`, label: 'Assessment context', text: job.checkpoint, source: job.source },
    { id: 'assessment-sources', label: 'Sources', text: job.source, source: 'Current assessment context' },
  ];
}

function JobCard({ job, model, index, selected, changed, related, outsideFilter, inspectedKind, manualPaused, reduced, documentVisible, onInspect, registerJobControl, renderInspection }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef);
  const [hovered, setHovered] = useState(false), [focused, setFocused] = useState(false);
  const [observationIndex, setObservationIndex] = useState(0);
  const observations = supportingObservations(job, model);
  const signature = JSON.stringify(observations);
  const stableObservations = useMemo(() => JSON.parse(signature), [signature]);
  const sourceCurrent = model.sourceState === 'current';
  const paused = manualPaused || reduced || !documentVisible || !inView || hovered || focused || !sourceCurrent;
  const stages = checkpoints(job, model);
  const done = stages.filter(stage => stage.state === 'complete').length;
  const observation = stableObservations[Math.min(observationIndex, stableObservations.length - 1)];
  const incident = (model.incidents || []).find(item => item.job === job.id && item.state === 'active');
  const feedStatus = !sourceCurrent ? 'Last confirmed' : manualPaused ? 'Feed paused' : hovered || focused ? 'Paused while reading' : 'Agent updates';
  const inspection = renderInspection?.(job.id);

  useEffect(() => { setObservationIndex(0); }, [signature]);
  useEffect(() => {
    if (paused || observationIndex >= stableObservations.length - 1) return undefined;
    const timer = setTimeout(() => setObservationIndex(current => Math.min(current + 1, stableObservations.length - 1)), 6200 + index * 850);
    return () => clearTimeout(timer);
  }, [paused, observationIndex, stableObservations, index]);

  return <article className="combined-activity-item" aria-label={job.title} data-inspected={Boolean(inspection)}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <hbr-card ref={cardRef} class="combined-activity-job" data-job-id={job.id} data-tone={job.tone} data-selected={selected} data-changed={changed} data-network-match={related}>
      <div className="combined-activity-job-heading">
        <span className="combined-activity-job-icon" aria-hidden="true"><hbr-icon name={job.icon} size="20px"/></span>
        <div className="combined-activity-job-copy"><hbr-text size="sm" weight="semibold"><h3>{job.title}</h3></hbr-text><hbr-text size="xs" type="secondary">{job.scope}</hbr-text></div>
        <hbr-tag size="small" sentiment={sentiment(job.tone)} status>{job.status}</hbr-tag>
      </div>
      {(incident || outsideFilter || related) && <div className="combined-activity-associations">
        {incident && <hbr-text size="xs" type="secondary">{incident.id} · {incident.title}</hbr-text>}
        {outsideFilter && <span>Inspected work outside this filter</span>}
        {related && <span>Related to selected scope</span>}
      </div>}
      <p className="combined-activity-checkpoint">{job.checkpoint}</p>
      <div className="combined-activity-progress">
        <ol className="combined-activity-stages" style={{ '--activity-stages': stages.length }} aria-label={`${job.title} checkpoints`}>
          {stages.map(stage => <li key={stage.label} data-state={stage.state} aria-current={stage.state === 'current' || stage.state === 'waiting' ? 'step' : undefined}>
            {stage.state === 'complete' && <hbr-icon name="check" size="11px" aria-hidden="true"/>}{stage.label}<span className="combined-activity-sr"> · {stage.state === 'future' ? 'not reached' : stage.state}</span>
          </li>)}
        </ol>
        <hbr-progress-bar size="small" alignment="no-label" percentage={Math.round(done / stages.length * 100)} no-suffix="" indicator={false} noncancelable={true}
          inanimate={paused} aria={{ label: `${job.title}. ${done} of ${stages.length} checkpoints confirmed. ${job.status}. This is a checkpoint count, not a duration estimate.` }}/>
      </div>
      {observation && <div className="combined-activity-feed" data-paused={paused}>
        <div className="combined-activity-feed-heading"><span>{feedStatus}</span>{observation.time && <span title="Time supplied by this work record">{observation.time}</span>}</div>
        <div key={observation.id} className="combined-activity-observation">
          <span className="combined-activity-observation-mark" aria-hidden="true"/>
          <div><strong title={observation.source}>{observation.label}</strong><p>{observation.text}</p></div>
        </div>
      </div>}
      <div className="combined-activity-job-footer">
        <hbr-text type="secondary" size="xs">{job.id}</hbr-text>
        <hbr-button ref={node => registerJobControl?.(job.id, node)} variant="text" size="small" arialabel={`Inspect ${job.title}`}
          aria-expanded={selected && inspectedKind === 'job'} onClick={event => onInspect?.(job, event)}>Inspect job<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button>
      </div>
    </hbr-card>
    {inspection}
  </article>;
}

export default function CombinedActivity({ model, jobs = model?.jobs || [], selectedJobId, changedJobIds = [], matchingJobIds = EMPTY_SET, filteredJobIds = null, inspectedKind, onInspect, registerJobControl, renderInspection }) {
  const reduced = useReducedMotion(), documentVisible = useDocumentVisible();
  const [manualPaused, setManualPaused] = useState(false);
  const counts = jobs.reduce((summary, job) => { const bucket = workBucket(job); summary[bucket] = (summary[bucket] || 0) + 1; return summary; }, {});
  const sourceCurrent = model?.sourceState === 'current';
  const controlDisabled = reduced || !sourceCurrent;
  const controlLabel = !sourceCurrent ? 'Updates unavailable' : reduced ? 'Feed paused' : manualPaused ? 'Resume feed' : 'Pause feed';
  const tooltip = !sourceCurrent ? 'Current source visibility is interrupted. Last-confirmed records remain available.' : reduced ? 'Reduced motion keeps automatic feed updates paused. Job inspection remains available.' : 'Pause or resume supporting observations. Jobs continue independently.';
  const headingId = 'combined-activity-title';
  const feedId = `combined-activity-feed-${useId().replaceAll(':', '')}`;

  return <section className="combined-activity" aria-labelledby={headingId} data-reduced-motion={reduced} data-source={sourceCurrent ? 'current' : 'last-known'}>
      <div className="combined-activity-heading">
        <hbr-text variant="section-title"><h2 id={headingId}>Activity</h2></hbr-text>
        <hbr-tooltip content={tooltip} hoist><hbr-button size="small" variant="text" disabled={controlDisabled} aria-controls={feedId} arialabel={controlLabel} onClick={() => setManualPaused(value => !value)}>{controlLabel}</hbr-button></hbr-tooltip>
      </div>
      <div className="combined-activity-counts" aria-label={`${jobs.length} displayed jobs`}>
        {!sourceCurrent && <span>Last confirmed</span>}
        {['Running', 'Review', 'Waiting', 'Needs attention', 'Complete'].filter(label => counts[label]).map(label => <hbr-tag key={label} class="combined-activity-count" size="large" sentiment={bucketSentiments[label]} status>
          <hbr-icon slot="prefix" name={bucketIcons[label]} size="14px" aria-hidden="true"/>
          <strong key={counts[label]}>{counts[label]}</strong>{' '}<span>{label}</span>
        </hbr-tag>)}
      </div>
      <div id={feedId} className="combined-activity-jobs">
        {jobs.map((job, index) => <Fragment key={job.id}><JobCard job={job} model={model} index={index} selected={selectedJobId === job.id} changed={changedJobIds.includes(job.id)} related={matchingJobIds.has(job.id)}
          outsideFilter={filteredJobIds instanceof Set && !filteredJobIds.has(job.id)} inspectedKind={inspectedKind} manualPaused={manualPaused} reduced={reduced} documentVisible={documentVisible}
          onInspect={onInspect} registerJobControl={registerJobControl} renderInspection={renderInspection}/></Fragment>)}
        {!jobs.length && <div className="combined-activity-empty"><hbr-icon name="nav-workflows" size="20px"/><div><strong>No jobs in this scope</strong><p>Clear the scope filter to view other permitted work.</p></div></div>}
      </div>
  </section>;
}
