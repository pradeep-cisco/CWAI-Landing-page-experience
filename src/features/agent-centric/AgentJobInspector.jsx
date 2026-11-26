import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './agent-job-inspector.css';

const ROUTE = 'ROUTE-104';
const CHECK = 'CHECK-208';
const REACH = 'REACH-319';
const TONES = new Set(['positive', 'negative', 'warning', 'info', 'inactive']);
const tone = value => TONES.has(value) ? value : 'info';
const terminal = job => ['Verified', 'Assessment complete', 'Complete', 'Concluded'].includes(job.status);
const textOf = value => typeof value === 'string' ? value : Array.isArray(value) ? value.map(textOf).filter(Boolean).join(' ') : value?.text || value?.detail || value?.title || '';

function Fields({ entries }) {
  return <dl className="agent-job-inspector-fields">{entries.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Criteria({ criteria = [] }) {
  return <ul className="agent-job-inspector-criteria">{criteria.map(item => <li key={item.id} data-state={item.state}>
    <hbr-icon name={item.state === 'met' ? 'check-circle' : item.state === 'failed' ? 'status-warning' : 'clock'} size="17px" aria-hidden="true"/>
    <div><strong>{item.title}</strong><p>{item.detail}</p><span>{item.source}{item.time ? ` · ${item.time}` : ''}</span></div>
    <span className="agent-job-inspector-criterion-state">{({ met: 'Confirmed', pending: 'Pending', unavailable: 'Unavailable', failed: 'Failed' })[item.state] || item.state}</span>
  </li>)}</ul>;
}

function Context({ job }) {
  const route = job.id === ROUTE, assessment = job.id === CHECK;
  const entities = route ? [
    ['Router', 'XR-R07', 'The device assessed by this job.', 'nav-network-wide'],
    ['Configuration', 'WAN-IMPORT', 'The route policy compared with approved intent.', 'nav-configuration'],
    ['Interface', 'HundredGigE0/0/0/1', 'A related interface; its own observations establish its state.', 'nav-connect'],
    ['Service', 'Enterprise VPN', 'A related service; this relationship does not establish service impact.', 'nav-service-switcher'],
  ] : assessment ? [['Router', 'XR-R12', 'This assessment and its result apply to the declared scope on this router.', 'nav-network-wide']]
    : [['Network scope', job.scope, 'This investigation retains its own sources, constraints and result.', 'nav-network-wide']];
  return <div className="agent-job-inspector-context">
    <ul>{entities.map(([type, name, detail, icon]) => <li key={type} data-type={type}><span><hbr-icon name={icon} size="17px"/></span><div><small>{type}</small><strong>{name}</strong><p>{detail}</p></div></li>)}</ul>
    <p className="agent-job-inspector-context-note">Relationships provide scope and dependency context. They do not establish cause or operational impact.</p>
    <Link to="/network-monitoring/admin">Open knowledge graph<hbr-icon name="arrow-right" size="14px"/></Link>
  </div>;
}

/** Bounded explanations of the selected record; no generated or cross-job facts. */
export function getJobContextAnswer(job, model, question) {
  if (!job) return '';
  const prefix = model.sourceState !== 'current' ? 'Current visibility is interrupted. Based on the last-confirmed work record: ' : '';
  if (question === 'waiting') {
    if (terminal(job)) return `${prefix}This job has no reported waiting state. ${job.checkpoint} This result applies only to its declared scope.`;
    if (job.id === REACH) return `${prefix}${job.checkpoint} ${job.health === 'Healthy' ? 'The agent remains healthy; the missing source prerequisite constrains this job. ' : ''}Crosswork AI retains the investigation and its follow-up.`;
    if (job.id === ROUTE && ['Review required', 'Plan changed'].includes(job.status)) return `${prefix}The proposed correction requires a delegated production-configuration review for version ${model.proposal.version} and its exact scope. No controller operation is issued by opening this review.`;
    if (job.id === ROUTE && job.status === 'Decision submitted') return `${prefix}Authority-service confirmation is pending. A submitted decision is not yet an effective grant, and no controller operation has been issued.`;
    return `${prefix}The current record shows ${job.status.toLowerCase()}. ${job.waitReason || job.checkpoint} ${job.detail || ''}`;
  }
  if (job.id === REACH && !terminal(job)) return `${prefix}The required source access must be established and rechecked before this investigation can continue. Crosswork AI retains the job and follows up with the integration owner. Another job’s success does not provide this evidence.`;
  if (job.id === CHECK) return `${prefix}${job.checkpoint} ${job.detail || ''}`;
  if (job.nextStep && job.id !== ROUTE) {
    const limit = (job.evidence || []).map(textOf).find(text => /does not|not establish|before confirming|uncertain/i.test(text));
    return `${prefix}${[...new Set([textOf(job.nextStep), job.detail, limit].filter(Boolean))].join(' ')}`;
  }
  if (job.id === ROUTE && model.scene >= 6) {
    const outstanding = (model.criteria || []).filter(item => item.state !== 'met');
    if (job.status === 'Verified' && !outstanding.length && model.criteria?.length) return `${prefix}The recorded configuration, required routing conditions and reviewed change boundary satisfy this proposal’s criteria. The verified result applies to ${job.scope}; independent jobs keep their own conditions.`;
    return `${prefix}${job.checkpoint} ${outstanding.length ? `Still unconfirmed: ${outstanding.map(item => item.title.toLowerCase()).join('; ')}.` : job.detail || ''}`;
  }
  return `${prefix}${job.checkpoint} ${job.detail || ''}`;
}

function RecordedContext({ job, model, agentName }) {
  const [question, setQuestion] = useState(null);
  useEffect(() => setQuestion(null), [job.id]);
  return <details className="agent-job-inspector-questions"><summary>Ask about job</summary>
    <p className="agent-job-inspector-muted">Explore the context recorded for this job.</p>
    <div className="agent-job-inspector-question-controls"><hbr-button variant="outline" size="small" aria={{ pressed: String(question === 'next') }} onClick={() => setQuestion('next')}>What happens next?</hbr-button><hbr-button variant="outline" size="small" aria={{ pressed: String(question === 'waiting') }} onClick={() => setQuestion('waiting')}>Why is this waiting?</hbr-button></div>
    {question && <hbr-chat-message class="agent-job-inspector-message" variant="assistant"><div className="agent-job-inspector-message-content" role="status"><strong>{agentName}</strong><p>{getJobContextAnswer(job, model, question)}</p><small>Recorded job context · {job.id}</small></div></hbr-chat-message>}
  </details>;
}

export default function AgentJobInspector({ job, model, agents = model?.agents || {}, onReview, onOpenCapability, onOpenIncident }) {
  if (!job) return <div className="agent-job-inspector"><hbr-text>No work record selected.</hbr-text></div>;
  const agent = agents[job.agentId];
  const current = model.sourceState === 'current';
  const route = job.id === ROUTE;
  const records = (model.actions || []).filter(record => record.job === job.id);
  const finding = (model.incidents || []).find(record => record.job === job.id || record.jobId === job.id || record.jobIds?.includes(job.id) || job.incidentId && record.id === job.incidentId);
  const proposal = route ? model.proposal : job.proposal;
  const validation = proposal?.validation || [];
  const owner = agent?.name || job.agent || 'Crosswork AI';
  const showReview = job.canReview && typeof onReview === 'function';
  const reviewDisabled = !current || model.permissions?.reviewChange === false || !proposal?.available;
  const reachWaiting = (job.id === REACH || job.dependencyId === 'event-archive') && !terminal(job);
  const hasNewFinding = ![ROUTE, CHECK, REACH].includes(job.id);
  const jobFinding = hasNewFinding ? textOf(job.finding) : '';
  const evidence = hasNewFinding && Array.isArray(job.evidence) ? job.evidence : [];
  const showVerify = route && typeof onOpenCapability === 'function' && records.some(record => record.id === 'operation-completed') && !terminal(job);

  return <div className="agent-job-inspector" data-source={current ? 'current' : 'last-known'}>
    <div className="agent-job-inspector-owner"><span className="agent-job-inspector-avatar" aria-hidden="true"><hbr-icon name={agent?.icon || job.icon || 'nav-workflows'} size="23px"/></span><div><hbr-text size="sm" weight="semibold">{owner}</hbr-text><hbr-text size="xs" type="secondary">Version {job.agentVersion || agent?.version || 'not supplied'} · {job.id}</hbr-text></div><hbr-tag sentiment={tone(job.tone)} size="small" status>{current ? job.status : `Last known · ${job.status}`}</hbr-tag></div>
    <hbr-text variant="sub-section-title"><h3>{job.title}</h3></hbr-text>
    {!current && <p className="agent-job-inspector-source-note"><hbr-icon name="clock" size="16px"/>Current visibility is interrupted. This inspection retains the last-confirmed record.</p>}
    {(!jobFinding || jobFinding !== job.checkpoint) && <p className="agent-job-inspector-checkpoint">{job.checkpoint}</p>}
    {job.detail && (!hasNewFinding || job.detail !== textOf(job.nextStep)) && <p className="agent-job-inspector-muted">{job.detail}</p>}
    <Fields entries={[["Scope", job.scope], ["Authority", job.authority || 'Not supplied for this work record'], [current ? "Agent capability" : "Last-known capability", job.health || agent?.health], ["Source", job.source || 'Source reference not supplied']]}/>

    {(jobFinding || evidence.length > 0 || hasNewFinding && job.nextStep) && <section className="agent-job-inspector-block agent-job-inspector-finding" aria-label="Job findings"><h4>{current ? 'Finding' : 'Last-known finding'}</h4>
      {jobFinding && <p className="agent-job-inspector-checkpoint">{jobFinding}</p>}
      {evidence.length > 0 && <ul className="agent-job-inspector-validation">{evidence.map((item, index) => <li key={item.id || index}><hbr-icon name="nav-investigate" size="14px"/><span>{textOf(item)}{item.source && <small>{item.source}{item.time ? ` · ${item.time}` : ''}</small>}</span></li>)}</ul>}
      {job.nextStep && <div className="agent-job-inspector-next-step"><span>Next step</span><p>{textOf(job.nextStep)}</p></div>}
    </section>}

    {reachWaiting && <section className="agent-job-inspector-block" aria-label="Investigation constraint"><h4>Source needed</h4><div className="agent-job-inspector-callout"><hbr-icon name="clock" size="18px"/><div><strong>Archived event-source access</strong><p>The required access has not been established for this investigation. {job.health === 'Healthy' ? 'The agent remains healthy.' : `The recorded capability state is ${job.health || 'not supplied'}.`}</p></div></div>{job.id === REACH && onOpenCapability && <hbr-button size="small" variant="text" onClick={event => onOpenCapability('investigate', event)}>Review source requirements<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button>}</section>}

    {Array.isArray(job.resultEvidence) && job.resultEvidence.length > 0 && <section className="agent-job-inspector-block"><h4>Result evidence</h4><ul className="agent-job-inspector-validation">{job.resultEvidence.map((text, index) => <li key={index}><hbr-icon name="check" size="14px"/><span>{text}</span></li>)}</ul></section>}

    {finding && <details className="agent-job-inspector-disclosure"><summary>{finding.id} · {finding.title}</summary><Fields entries={[["Incident state", !current || finding.current === false ? `Last known · ${finding.stage || finding.state}` : finding.stage || finding.state], ["Classification", textOf(finding.classification)], ["Supporting evidence", textOf(finding.evidence)], ["Source", textOf(finding.source)], ["Resolution", textOf(finding.resolution)]]}/>{onOpenIncident && <hbr-button variant="text" size="small" onClick={event => onOpenIncident(finding.id, event)}>Follow incident<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button>}</details>}

    {proposal && validation.length > 0 && <section className="agent-job-inspector-block"><h4>{proposal.available ? `Proposal basis · Version ${proposal.version}` : 'Assessment evidence'}</h4><ul className="agent-job-inspector-validation">{validation.map((item, index) => <li key={index}><hbr-icon name={model.variant === 'evidence' ? 'clock' : 'nav-configuration'} size="15px"/><span>{typeof item === 'string' ? item : item.detail || item.title}</span></li>)}</ul>
      {proposal.available && <p className="agent-job-inspector-muted">{proposal.boundary}</p>}
      {showReview && <hbr-button size="small" variant="outline" disabled={reviewDisabled} onClick={event => { if (!reviewDisabled) onReview(event); }}>Review change<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button>}
    </section>}

    {route && proposal.available && model.criteria?.length > 0 && <section className="agent-job-inspector-block"><h4>{model.scene >= 6 ? 'Outcome evidence' : 'Required outcome criteria'}</h4><Criteria criteria={model.criteria}/>{showVerify && <hbr-button variant="text" size="small" onClick={event => onOpenCapability('verify', event)}>Review verification<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button>}</section>}

    <details className="agent-job-inspector-disclosure"><summary>Network context</summary><Context job={job}/></details>
    <details className="agent-job-inspector-disclosure"><summary>Action history{records.length ? ` (${records.length})` : ''}</summary>{records.length ? <ol className="agent-job-inspector-records">{records.map(record => <li key={record.id}><span className="agent-job-inspector-record-mark" aria-hidden="true"><hbr-icon name={record.icon || 'nav-workflows'} size="16px"/></span><div><div className="agent-job-inspector-record-title"><strong>{record.title}</strong>{record.time && <time>{record.time}</time>}</div><p>{record.detail || record.label}</p><Fields entries={[["Agent", `${record.agent || 'Not supplied'}${record.agentVersion ? ` · v${record.agentVersion}` : ''}`], ["Actor", record.actor || 'Not supplied'], ["Scope", record.scope || 'Not supplied'], ["Authority", record.authority || 'Not supplied in this record'], ["Record", record.record || 'Source reference not supplied'], ["Establishes", record.label]]}/></div></li>)}</ol> : <p className="agent-job-inspector-muted">No consequential confirmed action record is supplied for this job yet. Its current checkpoint and source constraint remain available above.</p>}</details>
    <RecordedContext key={job.id} job={job} model={model} agentName={owner}/>
  </div>;
}
