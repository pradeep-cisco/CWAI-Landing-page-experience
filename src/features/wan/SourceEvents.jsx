import { eventCoverage } from './model/event-accounting.js';
import './source-events.css';

export function SourceEvents({state,caseId,onInspect,disclosure=true}) {
  const events = eventCoverage(state).linked.filter(event => event.caseId === caseId);
  if (!events.length) return null;
  const content = <div className="wan-case-sources">{events.map(event => <div className="wan-case-source" key={event.id}>
    <div className="wan-source-state"><hbr-tag status size="small" sentiment={!event.active ? 'inactive' : event.severity === 'Critical' ? 'negative' : event.severity === 'Major' ? 'warning' : 'info'}>{event.sourceState || (event.active ? event.severity : 'Source-reported inactive')}</hbr-tag><time>{event.time}</time></div>
    <hbr-text size="sm" weight="semibold">{event.title}</hbr-text><hbr-text type="secondary" size="xs">{event.id} · {event.source} · {event.scope || event.target?.id}</hbr-text><hbr-text type="secondary" size="xs">{event.dispositionReason}</hbr-text>
    {event.target && ['device','interface'].includes(event.target.kind) && <hbr-button size="small" variant="text" onClick={()=>onInspect?.(event.target)}>Inspect source</hbr-button>}
  </div>)}</div>;
  return disclosure ? <div className="wan-case-source-disclosure"><hbr-accordion label={`Source events · ${events.length}`} size="small">{content}</hbr-accordion></div> : content;
}

export function PendingEvents({state,onInspect}) {
  const {pending} = eventCoverage(state);
  if (!pending.length) return null;
  return <div className="wan-pending-events" aria-label="Events under correlation">{pending.map(event=><article key={event.id} className="wan-pending-event">
    <div className="wan-source-state"><hbr-tag status size="small" sentiment={event.severity === 'Critical' ? 'negative' : 'info'}>{event.severity} · Under correlation</hbr-tag><time>{event.time}</time></div>
    <hbr-text variant="smallest-title">{event.title}</hbr-text><hbr-text size="sm">CW AI is gathering related observations. A cause or incident association is not yet established.</hbr-text><hbr-text type="secondary" size="xs">{event.id} · {event.source} · {event.scope || event.target?.id}</hbr-text>
    {event.target && ['device','interface'].includes(event.target.kind) && <hbr-button variant="text" size="small" onClick={()=>onInspect?.(event.target)}>Inspect source</hbr-button>}
  </article>)}</div>;
}

export function ExpectedEvents({state}) {
  const {expected} = eventCoverage(state);
  if (!expected.length) return null;
  return <details className="wan-expected-events"><summary>Expected events · {expected.length}</summary><div className="wan-case-sources">{expected.map(event=><div className="wan-case-source" key={event.id}><hbr-text size="sm" weight="semibold">{event.title}</hbr-text><hbr-text size="xs" type="secondary">{event.id} · {event.source} · {event.time}</hbr-text><hbr-text size="sm">{event.dispositionReason}</hbr-text></div>)}</div></details>;
}
