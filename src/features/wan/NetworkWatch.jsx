import { useEffect, useState } from 'react';
import { domainLabel } from './model/scale.js';
import { domainObservation } from './watch-model.js';
import './network-watch.css';

const iconFor = tone => tone === 'negative' ? 'status-negative' : tone === 'warning' ? 'status-warning' : tone === 'positive' ? 'status-positive' : 'status-info-square';

function Status({ tone = 'info', children }) {
  return <hbr-tag size="small" sentiment={tone} status>{children}</hbr-tag>;
}

export function WatchPulse({ watch, onOpen }) {
  const primary = watch.incidents[0];
  return <div className="wan-watch-pulse" data-tone={watch.tone} role="status">
    <hbr-icon name={iconFor(watch.tone)} sentiment={watch.tone === 'inactive' ? 'info' : watch.tone} size="18px" />
    <div><strong>{watch.title}</strong><span>{primary ? `Owned by ${primary.owner} · ${primary.stage}` : watch.mode === 'correlation' ? 'CW AI gathering evidence' : watch.mode === 'trend' ? 'CW AI checking trend' : watch.fresh ? 'Current source observations' : 'Source coverage incomplete'}</span></div>
    {primary && <hbr-button variant="text" size="small" onClick={() => onOpen(primary.id)}>View response</hbr-button>}
  </div>;
}

function Trend({ points, stale = false }) {
  if (!points?.length) return null;
  const minute = time => { const [hour, value] = time.split(':').map(Number); return hour * 60 + value; };
  const start = minute(points[0].time), duration = Math.max(1, minute(points.at(-1).time) - start);
  const coords = points.map(point => [8 + (minute(point.time) - start) / duration * 240, 75 - point.value * .62]);
  const path = coords.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const last = coords.at(-1);
  return <svg className="wan-watch-trend" viewBox="0 0 256 92" role="img" aria-label={`XR-P1 outbound utilization: ${points.map(p => `${p.value}% at ${p.time}`).join(', ')}${stale ? '. Current samples unavailable.' : ''}`}>
    <path className="wan-watch-trend-grid" d="M8 13H248 M8 44H248 M8 75H248" />
    <path className="wan-watch-threshold" d="M8 25.4H248" />
    <path className="wan-watch-trend-area" d={`${path} L${last[0]} 75 L8 75 Z`} />
    <path className="wan-watch-trend-line" d={path} />
    <circle cx={last[0]} cy={last[1]} r="3" />
    <text x="8" y="90">{points[0].time}</text><text x="248" y="90" textAnchor="end">{points.at(-1).time}</text>
  </svg>;
}

function Incident({ incident, state, onOpen, onLocate, spotlight, primary = false }) {
  const tone = incident.severity === 'Critical' ? 'negative' : incident.severity === 'Coverage gap' ? 'inactive' : 'warning';
  const observation = domainObservation(state, incident.domainId);
  return <article className={`wan-watch-incident ${primary ? 'primary' : 'secondary'}`} data-tone={tone} data-incident={incident.id}>
    <div className="wan-watch-row"><Status tone={tone}>{incident.sourceState}</Status><span className="wan-watch-time">{incident.time}</span></div>
    <hbr-text variant={primary ? 'sub-section-title' : 'smallest-title'}>{incident.title}</hbr-text>
    <div className="wan-watch-target">{incident.target}</div>
    {primary && incident.metric && <div className="wan-watch-measure" data-stale={!incident.metric.fresh}>
      <div><strong key={`${incident.metric.value}:${incident.metric.fresh}`}>{incident.metric.value}<small>{incident.metric.unit}</small></strong><span>{incident.metric.fresh ? 'Outbound utilization' : 'Last-known utilization'}</span></div>
      <span>Threshold {incident.metric.threshold}%<br />Observed {incident.metric.time}</span>
      <Trend points={observation.trend} stale={!incident.metric.fresh} />
    </div>}
    <div className="wan-watch-owner"><span className="wan-watch-owner-dot" data-stage={incident.stage}/><strong>CW AI</strong><Status tone={incident.attentionRequired ? 'warning' : 'in-progress'}>{incident.stage}</Status></div>
    {primary && <p className="wan-watch-work">{incident.currentWork}</p>}
    <div className="wan-watch-actions">
      <hbr-button size="small" variant={primary ? 'fill' : 'text'} onClick={() => onOpen(incident.id)}>Follow response<hbr-icon slot="suffix" name="arrow-right" /></hbr-button>
      <hbr-button size="small" variant="text" aria={{ pressed: spotlight === incident.domainId }} onClick={() => onLocate(incident.domainId)}>{domainLabel(incident.domainId)}</hbr-button>
    </div>
  </article>;
}

export default function NetworkWatch({ state, watch, spotlight, onLocate, onOpen, onInspect }) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1180px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1180px)');
    const update = () => setNarrow(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const primary = watch.incidents[0];
  const developing = !primary && watch.mode === 'trend' ? watch.updates.find(update => update.kind === 'trend') : null;
  return <aside className="wan-network-watch" aria-label="Live network watch" data-mode={watch.mode}>
    <div className="wan-watch-heading"><hbr-text variant="section-title">{primary ? 'Incident attention' : 'Network watch'}</hbr-text><span className="wan-watch-heading-mark">{primary ? `${watch.incidents.length} open` : 'CW AI'}</span></div>
    {primary ? <div className="wan-watch-queue">{watch.incidents.map((incident, index) => <Incident key={incident.id} incident={incident} state={state} primary={index === 0} onOpen={onOpen} onLocate={onLocate} spotlight={spotlight} />)}</div> : <div className="wan-watch-calm" data-tone={watch.mode}>
      <div className="wan-watch-calm-mark"><hbr-icon name={watch.mode === 'recovery' ? 'status-positive' : developing || watch.mode === 'correlation' ? 'status-in-progress' : 'status-positive'} sentiment={developing || watch.mode === 'correlation' ? 'in-progress' : 'positive'} size="24px"/></div>
      <hbr-text variant="sub-section-title">{watch.mode === 'recovery' ? 'Recovery verified' : developing ? 'Watching a developing trend' : watch.mode === 'correlation' ? 'Correlating network events' : 'No active source alarms'}</hbr-text>
      <p>{watch.detail}</p>
      {developing && <><Trend points={developing.trend}/><hbr-button variant="text" size="small" onClick={() => onLocate(developing.domainId)}>Locate {domainLabel(developing.domainId)}<hbr-icon slot="suffix" name="arrow-right" /></hbr-button></>}
      {watch.mode === 'recovery' && <hbr-button variant="text" size="small" onClick={() => onOpen('interface')}>Review outcome<hbr-icon slot="suffix" name="arrow-right" /></hbr-button>}
    </div>}
    <hbr-accordion className="wan-watch-feed" summary={primary || watch.mode === 'recovery' ? 'Latest updates' : 'Current observations'} variant="borderless" open={!narrow || !primary} aria-label="Network observations and response updates">
      <div className="wan-watch-feed-heading"><span>Source &amp; response</span></div>
      <div className="wan-watch-feed-items">{watch.updates.map(update => <article className="wan-watch-update" key={update.id} data-tone={update.tone} data-selected={Boolean(update.domainId && spotlight === update.domainId)}>
        <div className="wan-watch-feed-pin"><hbr-icon name={iconFor(update.tone)} sentiment={update.tone === 'inactive' ? 'info' : update.tone === 'in-progress' ? 'info' : update.tone} size="14px" /></div>
        <div className="wan-watch-update-copy">
          <div className="wan-watch-update-heading">{update.domainId ? <hbr-button variant="text" size="small" aria={{pressed:spotlight === update.domainId}} onClick={() => onLocate(update.domainId)}>{update.title}</hbr-button> : <strong>{update.title}</strong>}<time>{update.time}</time></div>
          <p>{update.detail}</p>
          <span className="wan-watch-source">{update.source}{!update.fresh ? ' · Last known' : ''}</span>
          {update.target && <hbr-button variant="text" size="small" onClick={() => onInspect(update.target)}>Inspect evidence<hbr-icon slot="suffix" name="arrow-right" size="12px" /></hbr-button>}
        </div>
      </article>)}</div>
    </hbr-accordion>
  </aside>;
}
