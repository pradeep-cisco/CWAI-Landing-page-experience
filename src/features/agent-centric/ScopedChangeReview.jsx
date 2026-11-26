import { useEffect, useRef } from 'react';

/** A decision applies to one recorded proposal and its explicit targets. */
export default function ScopedChangeReview({ job, model, decision, reviewedVersion, onDecision }) {
  const statusRef = useRef(null), requestedFocus = useRef(false);
  const proposal = job?.proposal;
  useEffect(() => {
    if (requestedFocus.current && statusRef.current) {
      requestedFocus.current = false;
      statusRef.current.focus();
    }
  }, [decision?.state]);
  if (!proposal) return <p>No change proposal is available for this job.</p>;
  const permitted = model.sourceState === 'current' && model.permissions.reviewChange && job.canReview && reviewedVersion === proposal.version && !decision;
  const act = state => { if (permitted) { requestedFocus.current = true; onDecision(job.id, state, proposal.version); } };
  return <div className="agent-home-review">
    <div className="agent-home-owner"><span className="agent-home-mark"><hbr-icon name="nav-workflows" size="22px"/></span><div><strong>{job.agent}</strong><span>{proposal.id} · Version {proposal.version}</span></div><hbr-tag size="small" sentiment="info">Change</hbr-tag></div>
    <p className="agent-home-panel-intro">{proposal.intent || job.checkpoint}</p>
    <dl className="agent-home-fields">
      <div><dt>Scope</dt><dd>{proposal.scope}</dd></div>
      <div><dt>Targets</dt><dd>{(proposal.targets || job.targets || []).join(', ') || proposal.scope}</dd></div>
      <div><dt>Authority</dt><dd>{proposal.authority}</dd></div>
      <div><dt>Change limit</dt><dd>{proposal.boundary}</dd></div>
    </dl>
    <div className="agent-home-diff"><div><span>Current configuration</span><pre>{proposal.changeFrom}</pre></div><div><span>Proposed configuration</span><pre>{proposal.changeTo}</pre></div></div>
    <div className="agent-home-evidence"><h3>Evidence</h3><ul>{(proposal.validation || []).map((item, index) => <li key={index}><hbr-icon name="check" size="14px"/><span>{typeof item === 'string' ? item : item.detail || item.title}</span></li>)}</ul></div>
    <div className="agent-home-notice"><hbr-icon name="nav-investigate"/><div><strong>Verification</strong><p>{Array.isArray(proposal.verification) ? proposal.verification.join(' ') : proposal.verification}</p><p>Approval covers this version and these targets. Other jobs require their own authority.</p></div></div>
    {decision && <div className="agent-home-notice" role="status" ref={statusRef} tabIndex={-1}><hbr-icon name="clock"/><div><strong>{decision.state === 'submitted' ? 'Decision submitted' : decision.state === 'held' ? 'Change held' : 'Approval confirmed'}</strong><p>{decision.state === 'submitted' ? 'Waiting for confirmation. No change has been issued.' : decision.state === 'held' ? 'The agent retains the job. This change has not been issued.' : 'The agent is checking prerequisites. Execution and verification remain unconfirmed.'}</p></div></div>}
    {!decision && <div className="agent-home-review-actions"><hbr-button disabled={!permitted} onClick={() => act('submitted')}>Authorize change</hbr-button><hbr-button variant="outline" disabled={!permitted} onClick={() => act('held')}>Hold change</hbr-button></div>}
  </div>;
}
