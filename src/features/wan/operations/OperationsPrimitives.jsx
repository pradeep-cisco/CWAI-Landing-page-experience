import { Children, useEffect, useId, useRef, useState } from 'react';

/** The first child is the section heading; remaining children form its body. */
export function OperationsSection({ id, className = '', children, ...attributes }) {
  const [header, ...body] = Children.toArray(children);
  return <section {...attributes} id={id} className={`ops-section ${className}`} tabIndex={-1}>
    <hbr-layout variant="dashboard:widgets:container" class="ops-card-layout">
      <hbr-card container col="full" class="ops-container" sentiment={attributes['data-verified'] ? 'positive' : undefined}>
        {header && <div slot="header" className="ops-container-heading">{header}</div>}
        <hbr-layout direction="column" gap="xl" class="ops-section-body">{body}</hbr-layout>
      </hbr-card>
    </hbr-layout>
  </section>;
}

export function StatusIcon({ status = 'pending', size = '16px' }) {
  const icons = {
    complete: ['status-positive', 'positive'], active: ['status-in-progress', 'in-progress'],
    pending: ['status-dormant', 'dormant'], blocked: ['status-warning', 'warning'],
    error: ['status-negative', 'negative'],
  };
  const [name, sentiment] = icons[status] || icons.pending;
  return <hbr-icon name={name} sentiment={sentiment} size={size} aria-hidden="true"/>;
}

export function SectionHeader({ id, kicker, title, description, children }) {
  return <header className="ops-section-header">
    <div className="ops-section-heading">
      {kicker && <span className="ops-eyebrow">{kicker}</span>}
      <hbr-text variant="section-title" id={id}>{title}</hbr-text>
      {description && <hbr-text type="secondary" size="sm" class="ops-description">{description}</hbr-text>}
    </div>
    {children && <div className="ops-header-actions">{children}</div>}
  </header>;
}

export function StatusTag({ tone = 'info', children }) {
  const sentiment = { progress: 'in-progress', unknown: 'inactive', critical: 'negative', major: 'warning', success: 'positive' }[tone] || tone;
  return <hbr-tag size="small" sentiment={sentiment} status>{children}</hbr-tag>;
}

export function EvidenceNote({ children }) {
  return <div className="ops-evidence-note"><span className="ops-source-mark" aria-hidden="true" /><hbr-text type="secondary" size="xs">{children}</hbr-text></div>;
}

export function RouterGlyph({ className = '' }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="m6 14 14-7 14 7-14 7-14-7Zm0 6 14 7 14-7M6 26l14 7 14-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M15 14h10m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

const minute = time => {
  const [hours, minutes] = String(time || '00:00').split(':').map(Number);
  return Number.isFinite(hours + minutes) ? hours * 60 + minutes : 0;
};

/** Recorded observations only: interaction never changes the live source state. */
export function MetricChart({ samples = [], threshold = 80, selectedTime, onSelect, actionTime, endTime, label = 'Outbound utilization', height = 220 }) {
  const wrapper = useRef(null), titleId = useId(), fillId = useId().replaceAll(':', '');
  const [width, setWidth] = useState(760), [hover, setHover] = useState(null);
  const points = samples.filter(sample => Number.isFinite(sample.value) && sample.time);
  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new ResizeObserver(entries => {
      const measured = Math.round(entries[0]?.contentRect.width || 760);
      setWidth(Math.max(260, measured));
    });
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);
  const selected = points.find(point => point.time === (hover || selectedTime)) || points.at(-1);
  const left = 40, right = 20, top = 24, bottom = height - 34;
  const start = points.length ? minute(points[0].time) : 475;
  const end = Math.max(start + 1, minute(endTime), ...points.map(point => minute(point.time)));
  const x = time => left + (minute(time) - start) / (end - start) * (width - left - right);
  const y = value => bottom - Math.max(0, Math.min(100, value)) / 100 * (bottom - top);
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${x(point.time)},${y(point.value)}`).join(' ');
  const area = points.length > 1 ? `${path} L${x(points.at(-1).time)},${bottom} L${x(points[0].time)},${bottom}Z` : '';
  const choose = point => { if (point) { setHover(point.time); onSelect?.(point.time); } };
  const keyboard = event => {
    if (!points.length || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = points.findIndex(point => point.time === selected?.time);
    choose(points[event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : Math.max(0, Math.min(points.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)))]);
  };
  const move = event => {
    if (!points.length) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width * width;
    const nearest = points.reduce((best, point) => Math.abs(x(point.time) - px) < Math.abs(x(best.time) - px) ? point : best, points[0]);
    setHover(nearest.time);
    onSelect?.(nearest.time);
  };
  const ticks = points.filter((point, index) => index === 0 || index === points.length - 1 || (width > 550 && index === Math.floor(points.length / 2)));
  return <figure className="ops-chart" ref={wrapper}>
    <figcaption className="ops-chart-caption"><span>{label}</span><span className="ops-chart-reading">{selected ? <><strong>{selected.value}%</strong><time>{selected.time}</time><span>{selected.fresh === false ? 'Last known' : 'Recorded observation'}</span></> : 'No recorded observations'}</span></figcaption>
    <svg viewBox={`0 0 ${width} ${height}`} className="ops-chart-svg" role="group" aria-labelledby={titleId} tabIndex={0} onKeyDown={keyboard} onPointerMove={move} onPointerLeave={() => setHover(null)} onClick={() => selected && onSelect?.(selected.time)}>
      <title id={titleId}>{`${label}. ${points.length} recorded observations. Use the left and right arrow keys to inspect samples.`}</title>
      <defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".18"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
      {[20, 40, 60, 80, 100].map(value => <g key={value}><line className="ops-chart-grid" x1={left} x2={width - right} y1={y(value)} y2={y(value)}/><text className="ops-chart-axis" x={left - 12} y={y(value) + 4} textAnchor="end">{value}</text></g>)}
      <line className="ops-chart-limit" x1={left} x2={width - right} y1={y(threshold)} y2={y(threshold)}/>
      <text className="ops-chart-limit-label" x={left + 4} y={y(threshold) - 8} textAnchor="start">{threshold}% limit</text>
      {area && <path d={area} fill={`url(#${fillId})`}/>}
      {actionTime && minute(actionTime) >= start && minute(actionTime) <= end && <g><line className="ops-chart-action" x1={x(actionTime)} x2={x(actionTime)} y1={top} y2={bottom}/><text className="ops-chart-axis" x={Math.min(width - 118, x(actionTime) + 7)} y={top - 8}>Response started</text></g>}
      <path className="ops-chart-line" d={path}/>
      {points.map(point => <circle key={point.time} className="ops-chart-point" cx={x(point.time)} cy={y(point.value)} r={point.time === selected?.time ? 4 : 2.5}/>)}
      {points.at(-1) && <circle className="ops-chart-arrival" key={`arrival-${points.at(-1).time}`} cx={x(points.at(-1).time)} cy={y(points.at(-1).value)} r="5"/>}
      {selected && <g className="ops-chart-crosshair"><line x1={x(selected.time)} x2={x(selected.time)} y1={top} y2={bottom}/><circle cx={x(selected.time)} cy={y(selected.value)} r="7"/></g>}
      {ticks.map(point => <text className="ops-chart-axis" key={point.time} x={x(point.time)} y={height - 8} textAnchor={point === points[0] ? 'start' : point === points.at(-1) ? 'end' : 'middle'}>{point.time}</text>)}
      {endTime && endTime !== points.at(-1)?.time && <text className="ops-chart-axis" x={width - right} y={height - 8} textAnchor="end">{`Now ${endTime}`}</text>}
    </svg>
  </figure>;
}
