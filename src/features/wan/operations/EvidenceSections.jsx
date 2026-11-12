import { useEffect, useId, useRef, useState } from 'react';
import { SectionHeader, StatusTag, MetricChart, EvidenceNote } from './OperationsPrimitives.jsx';
import { MONITORING_CONTEXT } from '../model/scale.js';
import './evidence-sections.css';

const rows = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : value?.label || value?.title || '';
const minute = time => { const [h, m] = String(time || '00:00').split(':').map(Number); return h * 60 + m; };

function RouterMark({ changed = false }) {
  return <svg viewBox="0 0 64 48" aria-hidden="true" className="evidence-router-mark" data-changed={changed}>
    <rect x="3" y="7" width="58" height="34" rx="7" />
    <path d="M13 17h25M13 24h18M13 31h24" />
    <circle cx="49" cy="19" r="2" /><circle cx="49" cy="29" r="2" />
  </svg>;
}

function ConfigurationPane({ title, values, change, observed }) {
  const intended = rows(change.intended);
  return <div className="evidence-config-pane" data-observed={observed}>
    <div className="evidence-pane-label"><span>{title}</span><StatusTag tone={observed && change.hasDrift ? 'warning' : 'info'}>{observed ? `Observed ${change.time}` : change.baseline}</StatusTag></div>
    <div className="evidence-router-scene">
      <span className="evidence-scene-domain">{change.domain}</span><span className="evidence-scene-connector" />
      <div className="evidence-router-object"><RouterMark changed={observed && change.hasDrift}/><strong>{change.router}</strong><span>{change.group}</span></div>
    </div>
    <dl className="evidence-config-values">{rows(values).map((field, index) => {
      const different = observed && intended.find(base => base.key === field.key)?.value !== field.value;
      return <div key={field.key || index} data-different={different}>
        <dt>{field.key}</dt><dd key={`${field.key}-${field.value}`}>{field.value}{different && <span className="evidence-diff-marker">Changed</span>}</dd>
      </div>;
    })}</dl>
  </div>;
}

export function ChangesSection({ model, onInspect }) {
  const [view, setView] = useState('comparison');
  const [expanded, setExpanded] = useState(false);
  const change = model.changes || {}, maintenance = change.maintenance || {};
  const intended = rows(change.intended), observed = rows(change.observed);
  return <section tabIndex={-1} className="ops-section evidence-section evidence-changes" id="ops-changes" aria-labelledby="ops-changes-heading">
    <SectionHeader id="ops-changes-heading" kicker="Intended and observed" title="Changes" description="Configuration differences in their network context.">
      <StatusTag tone={change.hasDrift ? 'warning' : 'positive'}>{change.hasDrift ? 'Difference detected' : 'Baseline aligned'}</StatusTag>
    </SectionHeader>
    <div className="evidence-toolbar"><div className="evidence-finding"><span className={`evidence-signal ${change.hasDrift ? 'warning' : ''}`} /><strong>{change.finding || 'Observed configuration matches the intended baseline.'}</strong></div><div className="evidence-view-options" aria-label="Change detail view"><hbr-button size="small" variant={view === 'comparison' ? 'outline' : 'text'} aria={{ pressed: view === 'comparison' }} onClick={() => setView('comparison')}>Compare</hbr-button><hbr-button size="small" variant={view === 'context' ? 'outline' : 'text'} aria={{ pressed: view === 'context' }} onClick={() => setView('context')}>Change context</hbr-button></div></div>
    {view === 'comparison' ? <>
      <div className="evidence-config-comparison"><ConfigurationPane title="Intended" values={intended} change={change}/><div className="evidence-compare-axis" aria-hidden="true"><span>↔</span></div><ConfigurationPane title="Observed" values={observed} change={change} observed/></div>
      <div className="evidence-section-footer"><EvidenceNote>{change.sourceRecord || change.provenance || 'Configuration observations'} · {change.time} · Comparison with {change.baseline}</EvidenceNote><div className="evidence-actions"><hbr-button size="small" variant="text" onClick={() => setExpanded(value => !value)} aria={{ expanded }}> {expanded ? 'Close comparison' : 'Inspect difference'}</hbr-button><hbr-button size="small" variant="text" onClick={() => onInspect?.({ kind: 'device', id: change.router })}>Inspect router</hbr-button></div></div>
      {expanded && <div className="evidence-attached evidence-config-inspection"><div><hbr-text variant="sub-section-title">Configuration comparison</hbr-text><p>The observed values are compared with the declared baseline. A difference alone does not establish the cause of another incident.</p></div><div className="evidence-code-diff">{intended.map((field, index) => { const current = observed.find(item => item.key === field.key); const different = field.value !== current?.value; return <div key={field.key || index} data-different={different}><span>{String(index + 1).padStart(2, '0')}</span><code>{field.key}</code><code>{field.value}</code><code>{current?.value ?? 'Not observed'}</code></div>; })}</div></div>}
    </> : <div className="evidence-maintenance"><div className="evidence-maintenance-heading"><div className="evidence-maintenance-clock" aria-hidden="true"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30"/><path d="M40 21v20l13 8"/><circle cx="40" cy="40" r="3"/></svg></div><div><span className="evidence-eyebrow">Declared maintenance</span><h3>{maintenance.scope || 'No declared maintenance in this scope'}</h3><p>{maintenance.id} · {maintenance.window}</p></div><StatusTag tone="info">{maintenance.status || 'No record'}</StatusTag></div><div className="evidence-maintenance-grid"><div><h4>Expected</h4>{rows(maintenance.expected).map((item, i) => <p key={i}><span className="evidence-small-dot"/>{text(item)}</p>)}</div><div><h4>Checks remaining</h4>{rows(maintenance.checks).map((item, i) => <p key={i}><span className="evidence-check-pending"/>{text(item)}<small>{item.status || 'Pending'}</small></p>)}</div></div><EvidenceNote>The scheduled change is retained as context. The current configuration difference is not attributed to this maintenance.</EvidenceNote></div>}
  </section>;
}

export function MonitoringSection({ model, onInspect, onOpen }) {
  const [selected, setSelected] = useState(null);
  const domains = rows(model.monitoring);
  const sources = domains.flatMap(domain => rows(domain.sources).map(source => ({ ...source, domain: domain.domain, domainId: domain.id, key: `${domain.id}:${source.id}` })));
  const active = sources.find(source => source.key === selected) || sources.find(source => source.status === 'delayed') || sources[0];
  const delayed = sources.some(source => source.status === 'delayed');
  let target = null;
  if (active?.id === 'telemetry') {
    if (active.domainId === model.scope?.domainId) target = { kind: 'interface', id: model.scope.interfaceId };
    else if (active.domainId === MONITORING_CONTEXT.transitDomain && active.scope?.includes('XR-P2')) target = { kind: 'interface', id: 'XR-P2:HundredGigE0/0/0/1' };
    else if (active.domainId === MONITORING_CONTEXT.criticalDomain && active.status === 'delayed') target = { kind: 'device', id: 'XR-PE-E2' };
  } else if (active?.id === 'reachability' && active.domainId === model.scope?.domainId) target = { kind: 'device', id: model.scope.router };
  return <section tabIndex={-1} className="ops-section evidence-section evidence-monitoring" id="ops-monitoring" aria-labelledby="ops-monitoring-heading">
    <SectionHeader id="ops-monitoring-heading" kicker="Confidence in the current picture" title="Monitoring" description="Freshness of the observations behind the network watch."><StatusTag tone={delayed ? 'warning' : 'positive'}>{delayed ? 'Collection gap' : 'Sources current'}</StatusTag></SectionHeader>
    <div className="evidence-monitor-legend"><span><i/>Received observation</span><span><i className="gap"/>Collection delayed</span><span className="evidence-observation-time">Source snapshots through {model.time}</span></div>
    <div className="evidence-source-grid"><div className="evidence-source-head"><span>Domain</span><span>Telemetry</span><span>Reachability</span><span>Topology</span></div>{domains.map(domain => <div className="evidence-source-domain" key={domain.id}><div className="evidence-source-domain-name"><span className="evidence-domain-shape"/>{domain.domain}</div>{rows(domain.sources).map(source => {
      const key = `${domain.id}:${source.id}`, stale = source.status === 'delayed';
      return <button className="evidence-source-cell" type="button" key={source.id} data-stale={stale} data-selected={active?.key === key} onClick={() => setSelected(key)} aria-pressed={active?.key === key} aria-label={`${domain.domain}, ${source.label}, ${stale ? 'collection delayed' : 'current'}, last observation ${source.time}`}>
        <span className="evidence-source-mobile-label">{source.label}</span><span className="evidence-observation-ribbon">{rows(source.observations).map((point, index) => <span key={`${point.time}-${index}`} title={`${point.time} · ${point.status}`} data-missing={point.status === 'delayed'} className="evidence-observation-mark"/>)}{stale && <span className="evidence-observation-gap"/>}</span><span className="evidence-source-readout" key={`${source.time}-${source.status}`}><span>{stale ? source.partial ? 'Partial gap' : 'Delayed' : 'Current'}</span><time>{source.time}</time></span>
      </button>;
    })}</div>)}</div>
    {active && <div className="evidence-source-inspection" data-stale={active.status === 'delayed'}><div className="evidence-source-inspection-main"><span className="evidence-eyebrow">Selected source</span><h3>{active.domain} · {active.label}</h3><p>{active.scope}</p><EvidenceNote>Last trustworthy observation {active.time} · {active.value || (active.status === 'delayed' ? 'Current reading unavailable' : 'Current source snapshot')}</EvidenceNote></div><div className="evidence-source-consequence"><strong>{active.status === 'delayed' ? 'Source-dependent checks need fresh evidence' : 'Current evidence available'}</strong><p>{active.status === 'delayed' ? 'The affected current reading is unavailable. Checks that depend on this source need fresh observations. Independent sources remain separately available.' : 'This source supports the current watch. Its collection state does not replace the network condition reported by the source.'}</p><div className="evidence-actions">{active.status === 'delayed' && <hbr-button size="small" variant="text" onClick={() => onOpen?.('monitoring')}>Follow collection response</hbr-button>}{target && <hbr-button size="small" variant="text" onClick={() => onInspect?.(target)}>Inspect source evidence</hbr-button>}</div></div></div>}
  </section>;
}

function EpisodeProof({ episode }) {
  const window = episode.verificationWindow;
  const windowLabel = typeof window === 'string' ? window : window?.from && window?.to ? `${window.from}–${window.to} · ${window.minutes || 5} minutes` : `${episode.detected}–${episode.recovered}`;
  return <div className="evidence-attached evidence-proof"><div className="evidence-proof-meta"><div><span>Source record</span><strong>{episode.id}</strong></div><div><span>Controller result</span><strong>{episode.job?.id || 'Recorded response'} · {episode.job?.status || 'Confirmed'}</strong></div><div><span>Verification window</span><strong>{windowLabel}</strong></div></div><div className="evidence-proof-criteria">{rows(episode.criteria).map((criterion, i) => <div key={i}><span data-met={criterion.met}>{criterion.met ? '✓' : '—'}</span><span>{criterion.label}</span></div>)}</div><EvidenceNote>{episode.source} · {episode.current ? 'Current incident verification record' : 'Archived incident evidence; independent of the current watch'}</EvidenceNote></div>;
}

export function ResolvedSection({ model, onOpen }) {
  const [selected, setSelected] = useState(null);
  const [proofOpen, setProofOpen] = useState(false);
  const results = rows(model.resolved).filter(episode => episode.verified);
  const episode = results.find(item => item.id === selected) || results.at(-1);
  return <section tabIndex={-1} className="ops-section evidence-section evidence-resolved" id="ops-resolved" aria-labelledby="ops-resolved-heading">
    <SectionHeader id="ops-resolved-heading" kicker="Observed outcomes" title="Resolved" description="Verified recovery with the supporting observations retained."><StatusTag tone="positive">Evidence retained</StatusTag></SectionHeader>
    {episode ? <>
      {results.length > 1 && <div className="evidence-result-options" aria-label="Verified incident records">{results.map(result => <hbr-button size="small" key={result.id} variant={episode.id === result.id ? 'outline' : 'text'} aria={{ pressed: episode.id === result.id }} onClick={() => { setSelected(result.id); setProofOpen(false); }}>{result.id} · {result.recovered}</hbr-button>)}</div>}
      <div className="evidence-resolved-heading"><div><span className="evidence-eyebrow">{episode.domain} · {episode.router} · {episode.id}</span><h3>{episode.title}</h3></div><div className="evidence-recovered-stamp" key={`${episode.id}:${episode.recovered}`}><span className="evidence-recovered-check">✓</span><div><strong>Recovery verified</strong><time>{episode.recovered}</time></div></div></div>
      <div className="evidence-outcome-comparison"><div className="evidence-outcome-before"><div className="evidence-outcome-label"><span>Before</span><span>{episode.detected}</span></div><div className="evidence-outcome-value"><strong>{episode.peak}<small>%</small></strong><span>Peak recorded utilization</span></div><MetricChart samples={rows(episode.beforePoints).length ? episode.beforePoints : rows(episode.points).filter(point => point.value >= model.threshold)} threshold={model.threshold} height={150} label={`${episode.id}, recorded condition before recovery`}/></div><div className="evidence-outcome-bridge" aria-hidden="true"><span>→</span></div><div className="evidence-outcome-after"><div className="evidence-outcome-label"><span>Verified</span><span>{episode.recovered}</span></div><div className="evidence-outcome-value"><strong>{episode.after}<small>%</small></strong><span>After the stability window</span></div><MetricChart samples={rows(episode.afterPoints).length ? episode.afterPoints : rows(episode.points).filter(point => point.value < model.threshold)} threshold={model.threshold} height={150} label={`${episode.id}, qualifying recovery observations`}/></div></div>
      <div className="evidence-section-footer"><EvidenceNote>{episode.source} · {episode.current ? 'Current incident' : 'Earlier shift'}</EvidenceNote><div className="evidence-actions"><hbr-button variant="text" size="small" onClick={() => { setSelected(episode.id); setProofOpen(value => !value); }} aria={{ expanded: proofOpen }}>{proofOpen ? 'Close proof' : 'Inspect proof'}</hbr-button>{episode.current && <hbr-button size="small" variant="text" onClick={() => onOpen?.('interface')}>Review response</hbr-button>}</div></div>{proofOpen && <EpisodeProof episode={episode}/>}
    </> : <div className="evidence-no-result"><RouterMark/><h3>No verified recovery yet</h3><p>A completed controller job enters Recovery. A result appears here after the independent recovery criteria are met.</p></div>}
  </section>;
}

function EpisodePlot({ episode, min, max }) {
  const id = useId().replace(/:/g, '');
  const wrapper = useRef(null), [width, setWidth] = useState(680);
  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(200, Math.round(entries[0]?.contentRect.width || 680))));
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);
  const points = rows(episode.points).filter(point => Number.isFinite(point.value));
  const relative = point => minute(point.time) - minute(episode.detected);
  const plotWidth = width - 44;
  const x = point => 18 + (relative(point) - min) / Math.max(1, max - min) * plotWidth;
  const y = value => 110 - value * .84;
  const line = points.map(point => `${x(point)},${y(point.value)}`).join(' ');
  return <span className="evidence-episode-visual" ref={wrapper}><svg className="evidence-episode-plot" viewBox={`0 0 ${width} 138`} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{`${episode.id}, utilization observations from ${points[0]?.time} through ${points.at(-1)?.time}. ${episode.verified ? 'Recovery verified.' : 'Recovery not established.'}`}</title>
    {[20, 50, 80].map(value => <g key={value}><line x1="18" x2={width - 26} y1={y(value)} y2={y(value)} className={value === 80 ? 'evidence-episode-threshold' : 'evidence-episode-grid'}/>{value === 80 && <text x={width - 24} y={y(value) + 3}>80%</text>}</g>)}
    {points.length > 1 && <polygon className="evidence-episode-area" points={`${x(points[0])},110 ${line} ${x(points.at(-1))},110`}/>}
    <polyline points={line} className="evidence-episode-line"/>{points.map((point, index) => <circle key={`${point.time}-${index}`} cx={x(point)} cy={y(point.value)} r={index === points.length - 1 ? 3.5 : 2}><title>{`${point.time} · ${point.value}%`}</title></circle>)}
    {[min, Math.round((min + max) / 2), max].map((value, index) => <text key={index} x={18 + (value - min) / Math.max(1, max - min) * plotWidth} y="132" textAnchor={index === 0 ? 'start' : index === 2 ? 'end' : 'middle'}>{value > 0 ? '+' : ''}{value} min</text>)}
  </svg></span>;
}

export function RepeatIssuesSection({ model, onOpen }) {
  const [selected, setSelected] = useState(null);
  const [comparing, setComparing] = useState(false);
  const episodes = rows(model.episodes);
  const active = episodes.find(episode => episode.id === selected) || episodes.at(-1);
  const relatives = episodes.flatMap(episode => rows(episode.points).map(point => minute(point.time) - minute(episode.detected)));
  const min = Math.min(0, ...relatives), max = Math.max(5, ...relatives);
  return <section tabIndex={-1} className="ops-section evidence-section evidence-repeat" id="ops-repeat-issues" aria-labelledby="ops-repeat-heading">
    <SectionHeader id="ops-repeat-heading" kicker="A longer view of the condition" title="Repeat issues" description="Related occurrences on the same interface, with each outcome kept separate."><StatusTag tone={episodes.length > 1 ? 'warning' : 'info'}>{episodes.length > 1 ? 'Condition repeated' : 'Earlier episode retained'}</StatusTag></SectionHeader>
    <div className="evidence-repeat-scope"><div><strong>{model.scope?.router} · {model.scope?.interface}</strong><span>{model.scope?.domain} · Outbound utilization</span></div><span>Shared scale · Minutes from detection</span></div>
    <div className="evidence-episodes">{episodes.map(episode => <button type="button" className="evidence-episode" data-current={episode.current} data-verified={episode.verified} data-selected={active?.id === episode.id} key={episode.id} onClick={() => setSelected(episode.id)} aria-pressed={active?.id === episode.id}><div className="evidence-episode-identity"><span className="evidence-episode-node"/><span>{episode.current ? 'Current occurrence' : 'Earlier shift'}</span><strong>{episode.id}</strong><time>{episode.detected}–{episode.recovered || model.time}</time><span className="evidence-episode-status">{episode.verified ? 'Verified recovery' : episode.status || 'Under observation'}</span></div><EpisodePlot episode={episode} min={min} max={max}/></button>)}</div>
    {active && <div className="evidence-episode-detail"><div><span className="evidence-eyebrow">Selected occurrence · {active.id}</span><h3>{active.current ? 'Current evidence remains independent' : 'Earlier recovery is retained'}</h3><p>{episodes.length > 1 ? 'The condition and interface match an earlier occurrence. A common cause has not been established.' : 'One earlier occurrence is available. A recurring condition has not been established in the current watch.'}</p><EvidenceNote>{active.source}</EvidenceNote></div><div className="evidence-actions"><hbr-button size="small" variant="text" onClick={() => setComparing(value => !value)} aria={{ expanded: comparing }}>{comparing ? 'Close comparison' : 'Compare episodes'}</hbr-button>{active.current && <hbr-button size="small" variant="text" onClick={() => onOpen?.('interface')}>Inspect current incident</hbr-button>}</div></div>}
    {comparing && <div className="evidence-attached evidence-episode-comparison"><div className="evidence-episode-comparison-labels"><strong>Recorded evidence</strong><span>Peak utilization</span><span>Final observation</span><span>Controller result</span><span>Recovery</span></div>{episodes.map(episode => <div key={episode.id}><strong>{episode.id}</strong><span>{episode.peak}%</span><span>{episode.verified ? `${episode.after}%` : episode.points?.at(-1) ? `${episode.points.at(-1).value}% · ${episode.points.at(-1).time}` : 'Unavailable'}</span><span>{episode.job?.status || 'Not started'}</span><span>{episode.verified ? `Verified ${episode.recovered}` : 'Not established'}</span></div>)}</div>}
  </section>;
}
