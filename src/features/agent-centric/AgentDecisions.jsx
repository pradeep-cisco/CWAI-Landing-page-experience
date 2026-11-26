/** Decisions stay separate from incident context and category-wide job counts. */
export default function AgentDecisions({ model, decisions = [], hiddenDecisions = 0, selectedIssueId, titleRef, onReview, onOpenManager, onClearFilters }) {
  const current = model.sourceState === 'current';
  const pendingConfirmation = model.jobs.some(job => /decision submitted/i.test(job.status));
  const assigned = model.assignedDecisions?.length || 0;
  const visible = decisions.slice(0, 3);
  const emptyLabel = !current ? 'Current decision status unavailable'
    : pendingConfirmation ? 'Decision submitted. Confirmation pending.'
    : hiddenDecisions ? 'No pending decisions in this view'
    : assigned ? 'Production review requires delegated authority'
    : 'No pending decisions';

  return <section className="agent-home-next agent-clean-decisions" aria-labelledby="agent-home-next-title">
    <div className="agent-clean-decisions-heading"><hbr-text variant="section-title"><h2 id="agent-home-next-title" ref={titleRef} tabIndex={-1}>Your decisions</h2></hbr-text>{decisions.length > 0 && <span className="agent-clean-decisions-count" aria-label={`${decisions.length} ${current ? 'pending' : 'last-confirmed'} ${decisions.length === 1 ? 'decision' : 'decisions'}`}>{decisions.length}</span>}</div>
    {visible.length > 0 ? <div className="agent-clean-decision-list">{visible.map(decision => <hbr-card key={decision.id} class="agent-clean-decision-card" data-related={String(selectedIssueId === decision.issueId)}>
      <div className="agent-clean-decision-row"><div><h3>{decision.jobId === 'R-41' || decision.job === 'R-41' ? 'Review path adjustment' : decision.title || 'Review change'}</h3><p>{decision.scope}<span> · Production change approval</span></p></div><hbr-button size="small" disabled={!current} arialabel={`Review change: ${decision.scope}`} onClick={event => onReview?.(decision, event)}>Review</hbr-button></div>
    </hbr-card>)}</div> : <p className="agent-clean-decisions-empty"><hbr-icon name={current && !pendingConfirmation && !assigned ? 'check-circle' : 'clock'} size="16px"/>{emptyLabel}</p>}
    {decisions.length > visible.length && <div className="agent-clean-decision-more"><span>{decisions.length - visible.length} more pending</span><hbr-button variant="text" size="small" onClick={event => onOpenManager?.({ status: 'review' }, event)}>Review decisions<hbr-icon name="arrow-right" slot="suffix" size="14px"/></hbr-button></div>}
    {hiddenDecisions > 0 && <div className="agent-home-filter"><span>{hiddenDecisions} {hiddenDecisions === 1 ? 'review outside' : 'reviews outside'} this view</span><hbr-button variant="text" size="small" onClick={onClearFilters}>Clear filters</hbr-button></div>}
  </section>;
}
