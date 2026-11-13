import './response-plan.css';

const rows = value => Array.isArray(value) ? value : [];
const statusLabels = { watching:'Watching', investigating:'Investigating', validating:'Validating', ready:'Validated', executing:'Executing', verifying:'Verifying', verified:'Verified', blocked:'Owned dependency', reconciling:'Reconciling' };

/** A source-backed plan is shared by the incident and its assistant. */
export default function ResponsePlan({ response, details = true }) {
  const plan = response.plan;
  if (!plan) return null;
  const alternatives = rows(plan.alternatives);
  return <div className={`wan-response-plan ${details ? '' : 'compact'}`} data-status={plan.status}>
    <div className="wan-plan-heading"><hbr-text variant="sub-section-title">{details ? 'Response plan' : plan.title}</hbr-text><hbr-tag status size="small" sentiment={plan.status === 'verified' ? 'positive' : plan.status === 'blocked' || plan.status === 'reconciling' ? 'warning' : 'info'}>{statusLabels[plan.status] || 'In progress'}</hbr-tag></div>
    <hbr-text size="sm">{plan.summary}</hbr-text>
    {details && <>
      <div className="wan-plan-basis"><hbr-text type="secondary" size="xs">{plan.origin === 'graph-derived' ? 'Constructed from network evidence' : 'Validated against network evidence'} · {plan.updatedAt}</hbr-text><hbr-text size="sm" weight="semibold">{plan.goal}</hbr-text></div>
      {alternatives.length > 0 && <div className="wan-plan-alternatives">{alternatives.map(option => {
        const projected = Number.isFinite(option.projectedUtilization) ? option.projectedUtilization : null;
        return <hbr-card class="wan-plan-option" key={option.id} sentiment={option.status === 'selected' ? 'info' : option.status === 'rejected' ? 'warning' : undefined}>
          <hbr-layout direction="column" gap="lg">
            <div className="wan-plan-option-heading"><hbr-text weight="semibold">{option.label}</hbr-text><hbr-tag size="small" sentiment={option.status === 'selected' ? 'info' : ['rejected','held','blocked'].includes(option.status) ? 'warning' : 'inactive'}>{option.status === 'selected' ? 'Selected' : option.status === 'rejected' ? 'Not used' : ['held','blocked'].includes(option.status) ? 'Held' : 'Assessing'}</hbr-tag></div>
            {projected !== null && <div className="wan-plan-projection"><strong>{projected}<small>%</small></strong><span>Projected bottleneck utilization</span><div className="wan-plan-meter" role="img" aria-label={`${projected}% projected utilization; ${option.threshold || 80}% limit`}><span data-rejected={option.status === 'rejected'} style={{width:`${Math.max(0,Math.min(100,projected))}%`}}/><i style={{left:`${option.threshold || 80}%`}}/></div></div>}
            <hbr-text size="sm">{option.reason}</hbr-text>
            {rows(option.checks).length > 0 && <dl className="wan-plan-checks">{option.checks.map((check,index) => <div key={`${check.label}-${index}`}><dt>{check.label}</dt><dd>{String(check.value ?? '')}{check.limit ? ` · Limit ${check.limit}` : ''}</dd></div>)}</dl>}
          </hbr-layout>
        </hbr-card>;
      })}</div>}
      {plan.expectedEffect && <div className="wan-plan-effect"><hbr-text type="secondary" size="xs">Expected effect</hbr-text><hbr-text size="sm">{plan.expectedEffect}</hbr-text></div>}
      {rows(plan.relationships).length > 0 && <div className="wan-plan-relationships" aria-label="Connected network evidence">{plan.relationships.map((link,index) => <div className="wan-plan-relationship" key={`${link.from}-${link.to}-${index}`}><span>{link.from}</span><span className="wan-plan-relation"><span aria-hidden="true">→</span>{link.relation}</span><span>{link.to}</span>{link.source && <small>{link.source}</small>}</div>)}</div>}
      {rows(plan.sources).length > 0 && <div className="wan-plan-sources" aria-label="Response plan sources">{plan.sources.map(source => <div key={`${source.id}-${source.label}`} data-fresh={source.fresh}><span className="wan-plan-source-dot"/><div><hbr-text size="xs" weight="semibold">{source.label}</hbr-text><hbr-text type="secondary" size="xs">{source.id} · {source.time}{source.fresh === false ? ' · Last known' : ''}</hbr-text>{source.detail && <hbr-text type="secondary" size="xs">{source.detail}</hbr-text>}</div></div>)}</div>}
    </>}
  </div>;
}
