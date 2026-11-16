import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ACTIVE_WAN, DOMAINS, DEVICE_GROUPS, DEVICES, BUNDLES, GROUP_BUNDLES,
  PAGE_SIZES, domainDevices, groupDevices, domainLabel, groupLabel, findGroup,
  summarize, paged, bundleSummary, groupBundleSummary, deviceReachable,
  telemetryCurrent, deviceInterfaces, deviceLinks,
} from './model/scale.js';
import { layoutBackbone } from './model/backbone-layout.js';
import { buildWorldLayout, LAND, WIDTH as WORLD_WIDTH, HEIGHT as WORLD_HEIGHT } from './model/world-map.js';
import { THRESHOLD } from './model/model.js';
import { domainObservation, networkWatch } from './watch-model.js';
import './wan-overview.css';
import './world-map.css';

const number = value => Number(value || 0).toLocaleString('en-US');
const plural = (value, noun) => `${number(value)} ${noun}${value === 1 ? '' : 's'}`;
const cardSizing = { '--min-width': '0px', '--width': '100%', '--height': '100%' };
const alarmText = summary => ['Critical', 'Major', 'Minor']
  .filter(severity => summary[severity.toLowerCase()])
  .map(severity => `${number(summary[severity.toLowerCase()])} ${severity}`).join(' · ');

function fitRouteLabel(points, nodes, preferred) {
  const candidates = [preferred];
  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    for (const fraction of [0.5, 0.25, 0.75]) candidates.push([
      previous[0] + (point[0] - previous[0]) * fraction,
      previous[1] + (point[1] - previous[1]) * fraction,
    ]);
  });
  return candidates.find(([x, y]) => nodes.every(node =>
    x + 34 <= node.x - node.width / 2 || x - 34 >= node.x + node.width / 2 ||
    y + 16 <= node.y - node.height / 2 || y - 16 >= node.y + node.height / 2)) || preferred;
}

function useArrival(signature) {
  const ref = useRef(null);
  const previous = useRef(signature);
  useEffect(() => {
    if (previous.current !== signature && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current?.animate?.([{ opacity: 0.45 }, { opacity: 1 }], { duration: 650, easing: 'ease-out' });
    }
    previous.current = signature;
  }, [signature]);
  return ref;
}

function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(960);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const update = () => {
      const next = Math.round(element.getBoundingClientRect().width);
      if (next > 0) setWidth(previous => previous === next ? previous : next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

// The routes come from the fixture's actual links. Scaling reserves room for
// Harbor cards without letting source severity or freshness move an anchor.
function scaledLayout(nodes, bundles, width, page, pageSize, kind) {
  const scaleX = 1.2;
  const base = layoutBackbone({ domains: nodes, bundles, width: width / scaleX, page, pageSize });
  const scaleY = kind === 'domain' ? 80 / base.cardHeight : 1.35;
  const rows = [...new Set(base.nodes.map(node => node.y))].sort((a, b) => a - b)
    .map(y => ({ top: y - base.cardHeight / 2, bottom: y + base.cardHeight / 2 }));
  const padding = 4, gap = kind === 'domain' ? 56 : 32;
  // Compress only the empty routing lanes. The monotonic axis transform keeps
  // every route outside the same card boundaries and retains full card height.
  const vertical = y => {
    if (!rows.length) return y * scaleY;
    if (y <= rows[0].top) return y / rows[0].top * padding;
    let target = padding;
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index], next = rows[index + 1];
      if (y <= row.bottom) return target + (y - row.top) * scaleY;
      target += base.cardHeight * scaleY;
      if (next) {
        if (y <= next.top) return target + (y - row.bottom) / (next.top - row.bottom) * gap;
        target += gap;
      } else return target + (y - row.bottom) / (base.height - row.bottom) * padding;
    }
    return y * scaleY;
  };
  const height = rows.length ? padding * 2 + rows.length * base.cardHeight * scaleY + (rows.length - 1) * gap : base.height * scaleY;
  const scaledNodes = base.nodes.map(node => ({ ...node, x: node.x * scaleX, y: vertical(node.y),
    width: node.width * scaleX, height: node.height * scaleY }));
  const corridors = base.corridors.map(route => {
    const points = route.points.map(([x, y]) => [x * scaleX, vertical(y)]);
    return { ...route, points,
      label: fitRouteLabel(points, scaledNodes, [route.label[0] * scaleX, vertical(route.label[1])]) };
  });
  return { ...base, width, height, nodes: scaledNodes, corridors };
}

function routePath(points) {
  if (!points.length) return '';
  let path = `M ${points[0].join(' ')}`;
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index], previous = points[index - 1], next = points[index + 1];
    if (!next) { path += ` L ${point.join(' ')}`; continue; }
    const incoming = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    const outgoing = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const radius = Math.min(12, incoming / 2, outgoing / 2);
    const before = [point[0] - (point[0] - previous[0]) / incoming * radius,
      point[1] - (point[1] - previous[1]) / incoming * radius];
    const after = [point[0] + (next[0] - point[0]) / outgoing * radius,
      point[1] + (next[1] - point[1]) / outgoing * radius];
    path += ` L ${before.join(' ')} Q ${point.join(' ')} ${after.join(' ')}`;
  }
  return path;
}

function AlarmSignal({ summary, compact = false }) {
  if (!summary.alarms) return <span className="wan-alarm-clear">No active alarms</span>;
  const highest = summary.highest;
  const count = summary[highest.toLowerCase()];
  const remaining = summary.alarms - count;
  return <hbr-tag size="small" sentiment={highest === 'Critical' ? 'negative' : 'warning'} title={alarmText(summary)}>
    <hbr-icon slot="prefix" name={highest === 'Critical' ? 'status-negative' : 'status-warning'}
      sentiment={highest === 'Critical' ? 'negative' : 'warning'} size="14px" />
    {compact ? `${number(count)} ${highest}${remaining ? ` +${number(remaining)}` : ''}` : alarmText(summary)}
  </hbr-tag>;
}

function QualitySignal({ count }) {
  return <span className="wan-quality" data-stale={count > 0}>
    <hbr-icon name={count ? 'clock' : 'check'} size="12px" aria-hidden="true" />
    <span>{count ? plural(count, 'telemetry gap') : 'Current telemetry'}</span>
  </span>;
}

function ObservationTrend({ points, fresh, label, compact = false }) {
  if (!Array.isArray(points) || points.length < 2) return null;
  const valid = points.filter(point => Number.isFinite(point.value));
  if (valid.length < 2) return null;
  const minutes = valid.map(point => {
    const [hours, minute] = String(point.time).split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minute) ? hours * 60 + minute : null;
  });
  const elapsed = minutes.at(-1) - minutes[0];
  const timed = minutes.every(value => value !== null) && elapsed > 0;
  const coordinates = valid.map((point, index) => {
    const progress = timed ? (minutes[index] - minutes[0]) / elapsed : index / (valid.length - 1);
    return `${3 + progress * 68},${23 - Math.max(0, Math.min(100, point.value)) / 100 * 20}`;
  }).join(' ');
  const last = coordinates.split(' ').at(-1).split(',');
  return <svg className={`wan-domain-trend${compact ? ' wan-domain-trend-mini' : ''}`} viewBox="0 0 74 28" role="img" aria-label={label} data-fresh={fresh}>
    <path className="wan-domain-threshold" d="M3 7 H71" />
    <polyline points={coordinates} />
    <circle cx={last[0]} cy={last[1]} r="2.5" />
  </svg>;
}

function NetworkAtmosphere() {
  return <svg className="wan-map-atmosphere" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <g className="wan-contour-lines">
      <path d="M-80 455C80 315 150 345 238 230S350 97 475 140 648 258 765 185 1044-20 1260 95" />
      <path d="M-90 480C89 340 162 370 249 252S365 119 483 163 657 281 777 207 1050 3 1265 119" />
      <path d="M-102 505C92 365 174 396 260 275S381 141 492 186 666 304 789 230 1055 26 1270 143" />
      <path d="M-113 530C96 390 186 421 271 298S396 163 500 209 675 327 801 252 1060 49 1275 168" />
      <path d="M-125 555C100 415 198 446 282 320S412 185 509 232 684 350 813 275 1066 72 1280 192" />
      <path d="M-136 580C104 440 210 471 293 343S427 207 517 255 693 373 825 297 1071 95 1285 216" />
      <path d="M-148 605C108 465 222 497 304 366S443 229 526 278 702 396 837 320 1076 118 1290 240" />
      <path d="M-160 630C112 490 234 522 315 388S458 251 534 301 711 419 849 342 1082 141 1295 264" />
    </g>
    <g className="wan-contour-detail">
      <ellipse cx="945" cy="490" rx="220" ry="112" transform="rotate(-22 945 490)" />
      <ellipse cx="945" cy="490" rx="188" ry="88" transform="rotate(-22 945 490)" />
      <ellipse cx="945" cy="490" rx="156" ry="64" transform="rotate(-22 945 490)" />
    </g>
  </svg>;
}

function domainSummary(observation, summary, population) {
  if (summary.reachable < summary.devices) return summary.stale ? 'Unreachable · Telemetry gap' : `${observation.value} unreachable`;
  if (!observation.fresh || summary.stale) return 'Telemetry gap · Last known';
  if (observation.kind === 'recovery') return observation.tone === 'positive' ? 'Recovery verified' : 'Recovery unverified';
  if (observation.kind === 'major' || observation.kind === 'trend') {
    if (!observation.value?.includes('%')) return 'Interface discards';
    return `${observation.target.id.split(':')[0]} · ${observation.value} outbound${observation.kind === 'trend' ? ' ↑' : ''}`;
  }
  return population;
}

function HierarchyCard({ node, state, kind, incidents = [], onNavigate, onHighlight, focused, muted }) {
  const devices = kind === 'domain' ? domainDevices(node.id) : groupDevices(node.id);
  const summary = summarize(state, devices);
  const observation = kind === 'domain' ? domainObservation(state, node.id) : null;
  const domainIncidents = incidents.filter(incident => incident.domainId === node.id);
  const reachability = `${plural(summary.reachable, 'router')} reachable${summary.reachable < summary.devices ? `, ${plural(summary.devices - summary.reachable, 'router')} unreachable` : ''}`;
  const signature = `${summary.critical}:${summary.major}:${summary.minor}:${summary.stale}:${summary.reachable}:${observation?.kind}:${observation?.value}`;
  const ref = useArrival(signature);
  const population = kind === 'domain'
    ? `${number(DEVICE_GROUPS.filter(group => group.domain === node.id).length)} groups · ${plural(devices.length, 'router')}`
    : `${node.type || 'Device group'} · ${plural(devices.length, 'router')}`;
  const showTrend = observation?.fresh && observation.trend?.length >= 2 && ['major', 'trend', 'recovery'].includes(observation.kind);
  const latest = showTrend ? observation.trend.at(-1) : null;
  const rising = showTrend && latest.value > observation.trend.at(-2).value;
  const elevated = showTrend && latest.value > THRESHOLD;
  const trendScope = observation?.target?.id?.split(':')[0];
  const indicator = elevated ? `Above ${THRESHOLD}% limit` : rising ? 'Outbound utilization rising' : null;
  return <div className="wan-map-node" style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
    data-region={kind === 'domain' ? node.id : undefined} data-group-status={kind === 'group' ? node.id : undefined}
    data-condition={summary.tone} data-stale={summary.stale > 0} data-observation={observation?.kind} data-observation-tone={observation?.tone}
    data-focused={focused} data-muted={muted}
    onPointerEnter={() => onHighlight(node.id)} onPointerLeave={() => onHighlight(null)}
    onFocus={() => onHighlight(node.id)} onBlur={() => onHighlight(null)}>
    <hbr-card ref={ref} selectable role="button" style={cardSizing}
      sentiment={summary.critical ? 'negative' : summary.alarms ? 'warning' : undefined}
      aria-label={[`Open ${node.label || node.id}`, population, reachability, kind === 'domain' ? domainIncidents.length ? plural(domainIncidents.length, 'incident') : null : alarmText(summary), summary.stale ? plural(summary.stale, 'telemetry gap') : 'current telemetry'].filter(Boolean).join(', ')}
      onClick={() => onNavigate(kind, node.id)}>
      {observation ? <hbr-layout direction="column" gap="2xs" class="wan-domain-copy">
        <div className="wan-domain-header">
          <hbr-text type="primary" size="sm" weight="bold" truncate="end" title={node.label || node.id}>{node.label || node.id}</hbr-text>
          <hbr-tooltip content={reachability} hoist>
            <span className="wan-domain-reachability" role="img" aria-label={reachability}>
              <hbr-icon name={summary.reachable === summary.devices ? 'status-positive' : 'status-negative'} sentiment={summary.reachable === summary.devices ? 'positive' : 'negative'} size="14px" aria-hidden="true" />
            </span>
          </hbr-tooltip>
          {domainIncidents.length > 0 && <hbr-tag size="small" sentiment={domainIncidents.some(incident => incident.severity === 'Critical') ? 'negative' : 'warning'}>{plural(domainIncidents.length, 'incident')}</hbr-tag>}
        </div>
        <div className="wan-domain-summary-row">
          <hbr-text class="wan-domain-summary" type="secondary" size="xs" truncate="end" title={`${observation.detail} · ${observation.source} · ${observation.time}`}>{showTrend && observation.kind !== 'recovery' ? `${trendScope} · ${observation.value}` : domainSummary(observation, summary, population)}</hbr-text>
          {indicator && <hbr-tooltip content={indicator} hoist><span className="wan-domain-indicator" role="img" aria-label={indicator}><hbr-icon name={elevated ? 'status-warning' : 'trend-up'} sentiment={elevated ? 'warning' : undefined} size="14px" aria-hidden="true"/></span></hbr-tooltip>}
          {showTrend && <ObservationTrend points={observation.trend} fresh={true} compact label={`${trendScope} outbound utilization: ${observation.value} at ${observation.time}${elevated ? `, above ${THRESHOLD}% limit` : ''}`}/>}
        </div>
      </hbr-layout> : <hbr-layout direction="column" gap="none">
        <hbr-layout direction="row" gap="xs" align="center" justify="space-between">
          <hbr-icon name="device-uplink" size="16px" aria-hidden="true" />
          <hbr-text type="primary" size="sm" weight="bold" truncate="end">{node.label || node.id}</hbr-text>
          <hbr-icon name="caret-right" size="12px" aria-hidden="true" />
        </hbr-layout>
        <hbr-text type="secondary" size="xs">{population}</hbr-text>
        <div className="wan-node-alarm"><AlarmSignal summary={summary} compact /></div>
        <QualitySignal count={summary.stale} />
      </hbr-layout>}
    </hbr-card>
  </div>;
}

function RouteControl({ route, state, kind, onConnection, onHighlight }) {
  const summary = kind === 'domain' ? bundleSummary(state, route.id) : groupBundleSummary(state, route.id);
  const ref = useArrival(`${summary.active}:${summary.unavailable}`);
  const label = kind === 'domain' ? domainLabel : groupLabel;
  return <div ref={ref} className="wan-route-control" style={{ left: route.label[0], top: route.label[1] }}
    data-condition={summary.active ? 'major' : summary.unavailable ? 'unknown' : 'normal'}
    onPointerEnter={() => onHighlight(route.id)} onPointerLeave={() => onHighlight(null)}
    onFocus={() => onHighlight(route.id)} onBlur={() => onHighlight(null)}>
    <hbr-button size="small" variant="outline" onClick={() => onConnection({ kind, id: route.id })}
      aria-label={`Inspect ${label(route.from)} to ${label(route.to)}, ${plural(summary.total, 'member link')}, ${plural(summary.active, 'active alarm')}${summary.unavailable ? `, ${plural(summary.unavailable, 'member')} without current observations` : ''}`}>
      {summary.active > 0 && <hbr-icon slot="prefix" name="status-warning" sentiment="warning" size="14px" />}
      {number(summary.total)}
      {summary.unavailable > 0 && <hbr-icon slot="suffix" name="clock" size="12px" />}
    </hbr-button>
  </div>;
}

function LogicalMap({ nodes, bundles, state, kind, page = 0, pageSize = 12, onNavigate, onConnection, spotlight }) {
  const [ref, width] = useContainerWidth();
  const [hovered, setHighlight] = useState(null);
  const highlight = hovered || (kind === 'domain' ? spotlight : null);
  const setupId = ACTIVE_WAN.id;
  const layout = useMemo(() => scaledLayout(nodes, bundles, width, page, pageSize, kind),
    [nodes, bundles, width, page, pageSize, setupId, kind]);
  const incidents = useMemo(() => kind === 'domain' ? networkWatch(state).incidents : [], [state, kind]);
  const narrow = width <= 640;
  const related = route => !highlight || route.id === highlight || route.from === highlight || route.to === highlight;
  const highlightedRoute = bundles.find(bundle => bundle.id === highlight);
  const relatedNode = id => id === highlight || highlightedRoute?.from === id || highlightedRoute?.to === id;
  return <hbr-layout direction="column" gap="md">
    <div ref={ref} className="wan-map" data-narrow={narrow} data-kind={kind} data-source-frame={state.frame}
      data-view={state.view} style={{ height: narrow ? undefined : layout.height }} role="group"
      aria-label={`${kind === 'domain' ? 'Operational domains' : 'Device groups'} and their actual logical connections`}>
      <NetworkAtmosphere />
      {!narrow && <svg className="wan-map-routes" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
        <title>Logical connections derived from actual inventory links. Positions do not represent geography.</title>
        {layout.corridors.map(route => {
          const summary = kind === 'domain' ? bundleSummary(state, route.id) : groupBundleSummary(state, route.id);
          return <g key={route.id} data-corridor={route.id}
            data-condition={summary.active ? 'major' : summary.unavailable ? 'unknown' : 'normal'}
            data-stale={summary.unavailable > 0} data-emphasized={Boolean(highlight && related(route))}
            data-muted={Boolean(highlight && !related(route) && !summary.active)}>
            <path className="wan-route-bed" d={routePath(route.points)} />
            <path className="wan-route-line" d={routePath(route.points)} />
            {summary.active > 0 && <path key={`${route.id}:condition`} className="wan-route-arrival" d={routePath(route.points)} pathLength="1" />}
            {[route.points[0], route.points.at(-1)].map((point, index) =>
              <circle key={index} className="wan-route-port" cx={point[0]} cy={point[1]} r="3" />)}
          </g>;
        })}
      </svg>}
      <div className="wan-map-nodes">
        {layout.nodes.map(node => <HierarchyCard key={`${setupId}:${node.id}`} node={node} state={state}
          kind={kind} incidents={incidents} onNavigate={onNavigate} onHighlight={setHighlight} focused={Boolean(highlight && relatedNode(node.id))}
          muted={Boolean(highlight && !relatedNode(node.id) && !summarize(state, kind === 'domain' ? domainDevices(node.id) : groupDevices(node.id)).alarms)} />)}
      </div>
      {!narrow && layout.corridors.map(route => <RouteControl key={`${setupId}:${route.id}`} route={route}
        state={state} kind={kind} onConnection={onConnection} onHighlight={setHighlight} />)}
    </div>
    <hbr-text type="secondary" size="xs">
      {narrow ? 'View connections below for actual links. ' : `${plural(layout.corridors.length, 'actual connection')} shown. `}
      Positions are logical.{layout.offPageBundleCount > 0 ? ` ${plural(layout.offPageBundleCount, 'connection')} continue outside this page.` : ''}
    </hbr-text>
  </hbr-layout>;
}

function WorldMap({ nodes, bundles, state, onNavigate, onConnection, spotlight }) {
  const [ref, width] = useContainerWidth();
  const [hovered, setHighlight] = useState(null);
  const setupId = ACTIVE_WAN.id;
  const layout = useMemo(() => buildWorldLayout(nodes, bundles, setupId), [nodes, bundles, setupId]);
  const incidents = useMemo(() => networkWatch(state).incidents, [state]);
  const gradientId = `world-land-${useId().replaceAll(':', '')}`;
  // Keep native cards readable; move them below the map before they overlap.
  const narrow = width <= 760;
  const height = narrow ? Math.max(180, width * .425) : width * WORLD_HEIGHT / WORLD_WIDTH;
  const highlight = hovered || spotlight;
  const selectedRoute = bundles.find(bundle => bundle.id === highlight);
  const relatedNode = id => id === highlight || selectedRoute?.from === id || selectedRoute?.to === id;
  const relatedRoute = route => !highlight || route.id === highlight || route.from === highlight || route.to === highlight;
  const cardWidth = Math.min(206, Math.max(176, width * .22));
  const positioned = layout.nodes.map(node => ({ ...node,
    x: Math.max(cardWidth / 2 + 8, Math.min(width - cardWidth / 2 - 8, node.x / WORLD_WIDTH * width)),
    y: node.y / WORLD_HEIGHT * height, width: cardWidth, height: 80,
  }));
  const byId = new Map(positioned.map(node => [node.id, node]));
  const condition = id => {
    const summary = summarize(state, domainDevices(id));
    return summary.critical ? 'critical' : summary.alarms || incidents.some(incident => incident.domainId === id) ? 'major' : summary.stale ? 'unknown' : 'normal';
  };
  const activate = (event, action) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); } };
  const card = node => <HierarchyCard key={`${setupId}:${node.id}`} node={node} kind="domain" state={state} incidents={incidents}
    onNavigate={onNavigate} onHighlight={setHighlight} focused={Boolean(highlight && relatedNode(node.id))}
    muted={Boolean(highlight && !relatedNode(node.id) && !summarize(state, domainDevices(node.id)).alarms)}/>;

  return <hbr-layout direction="column" gap="lg" class="wan-world-view">
    <div ref={ref} className="wan-world-viewport" data-narrow={narrow} data-wan-setup={setupId} data-source-frame={state.frame} style={{ height }} role="group" aria-label="World view of operational domains. Domain locations are illustrative; connections come from network inventory.">
      <svg className="wan-world-svg" viewBox={narrow ? '0 140 1000 425' : `0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Geographic anchors and logical network connections">
        <defs><linearGradient id={gradientId} x1="30" x2="970" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" className="wan-world-gradient-west"/><stop offset=".6" className="wan-world-gradient-center"/><stop offset="1" className="wan-world-gradient-east"/></linearGradient></defs>
        <g className="wan-world-land" aria-hidden="true">{LAND.map((path, index) => <path key={index} d={path} fill={`url(#${gradientId})`}/>)}</g>
        {!narrow && <g className="wan-world-leaders" aria-hidden="true">{layout.nodes.flatMap(node => {
          const placed = byId.get(node.id);
          const cardX = placed.x / width * WORLD_WIDTH, cardY = placed.y / height * WORLD_HEIGHT;
          const edgeY = cardY + (node.anchor.y > cardY ? 1 : -1) * 40 / height * WORLD_HEIGHT;
          return node.anchors.map((anchor, index) => <path key={`${node.id}:${index}`} data-muted={Boolean(highlight && !relatedNode(node.id))} data-multi={node.multiRegion} d={`M ${cardX} ${edgeY} Q ${cardX + (anchor.x - cardX) * .3} ${(edgeY + anchor.y) / 2} ${anchor.x} ${anchor.y}`}/>);
        })}</g>}
        <g className="wan-world-routes">{layout.routes.map(route => {
          const summary = bundleSummary(state, route.id);
          const label = `Inspect ${domainLabel(route.from)} to ${domainLabel(route.to)}, ${plural(summary.total, 'member link')}, ${plural(summary.active, 'active alarm')}${summary.unavailable ? `, ${plural(summary.unavailable, 'member')} without current observations` : ''}`;
          return <g key={route.id} className="wan-world-route" role="button" tabIndex={0} aria-label={label}
            data-corridor={route.id} data-condition={summary.active ? 'major' : 'normal'} data-stale={summary.unavailable > 0}
            data-emphasized={Boolean(highlight && relatedRoute(route))} data-muted={Boolean(highlight && !relatedRoute(route) && !summary.active)}
            onPointerEnter={() => setHighlight(route.id)} onPointerLeave={() => setHighlight(null)} onFocus={() => setHighlight(route.id)} onBlur={() => setHighlight(null)}
            onClick={() => onConnection({ kind: 'domain', id: route.id })} onKeyDown={event => activate(event, () => onConnection({ kind: 'domain', id: route.id }))}>
            <title>{`${label}. Lines show logical connectivity, not physical cable paths.`}</title>
            <path className="wan-world-route-hit" d={route.d}/><path className="wan-world-route-line" d={route.d}/>
            {!summary.unavailable && <path className="wan-world-route-travel" d={route.d} pathLength="100" style={{ animationDelay: `${-layout.routes.indexOf(route) * 1.3}s` }}/>}
          </g>;
        })}</g>
        <g className="wan-world-pins">{layout.nodes.flatMap(node => node.anchors.map((anchor, index) => <g key={`${node.id}:${index}`} className="wan-world-pin" data-condition={condition(node.id)} data-selected={Boolean(highlight && relatedNode(node.id))} data-multi={node.multiRegion}
          role="button" tabIndex={0} aria-label={`Open ${domainLabel(node.id)} device groups. Illustrative ${node.multiRegion ? 'multi-location domain' : 'location'}: ${anchor.label}.`}
          onPointerEnter={() => setHighlight(node.id)} onPointerLeave={() => setHighlight(null)} onFocus={() => setHighlight(node.id)} onBlur={() => setHighlight(null)}
          onClick={() => onNavigate('domain', node.id)} onKeyDown={event => activate(event, () => onNavigate('domain', node.id))}>
          <title>{`${domainLabel(node.id)} · ${anchor.label} · Illustrative placement`}</title>
          <circle className="wan-world-pin-target" cx={anchor.x} cy={anchor.y} r="19"/>
          <circle className="wan-world-pin-halo" cx={anchor.x} cy={anchor.y} r={node.multiRegion ? 10 : 15}/>
          <circle className="wan-world-pin-core" cx={anchor.x} cy={anchor.y} r={node.multiRegion ? 4 : 7}/>
          {narrow && index === 0 && <text className="wan-world-pin-label" style={{ fontSize: Math.max(18, 12000 / width) }} x={anchor.x} y={anchor.y + 38} textAnchor="middle">{node.label}</text>}
        </g>))}</g>
      </svg>
      {!narrow && <div className="wan-world-cards">{positioned.map(card)}</div>}
    </div>
    <div className="wan-world-caption"><hbr-text size="xs" type="secondary">Real world geography · Illustrative domain locations</hbr-text><hbr-text size="xs" type="secondary">{plural(layout.routes.length, 'logical connection')}</hbr-text></div>
    {(narrow || layout.unplaced.length > 0) && <div className="wan-world-domain-list" role="group" aria-label="Domains in the world view">{(narrow ? [...layout.nodes, ...layout.unplaced] : layout.unplaced).map(card)}</div>}
    {layout.unplaced.length > 0 && <hbr-text size="xs" type="secondary">{plural(layout.unplaced.length, 'domain')} without a geographic placement. All connections remain available below.</hbr-text>}
  </hbr-layout>;
}

function Pager({ result, pageSize, noun, onChange }) {
  return <div className="wan-pager">
    <hbr-text type="secondary" size="xs">{result.start}–{result.end} of {plural(result.total, noun)}
      {result.total > result.items.length ? ` · ${number(result.total - result.items.length)} outside this page` : ''}</hbr-text>
    {result.pages > 1 && <hbr-pagination size="small" page={result.page} page-size={pageSize} item-count={result.total}
      aria={{ label: { pagination: `${noun} pages`, firstPage: 'First page', lastPage: 'Last page',
        nextPage: 'Next page', previousPage: 'Previous page', pageNumber: 'Page', goTo: 'Go to' }, role: 'navigation' }}
      onhbr-page-changed={event => onChange(Number(event.detail))} />}
  </div>;
}

function ConnectionList({ connections, state, kind, title, page, onPage, onConnection }) {
  const result = paged(connections, page, 6);
  const label = kind === 'domain' ? domainLabel : groupLabel;
  return <section className="wan-connections" aria-label={title}>
    <hbr-layout direction="column" gap="md">
      <hbr-layout direction="row" gap="sm" align="center" justify="space-between">
        <hbr-text variant="sub-section-title"><h3>{title}</h3></hbr-text>
        <hbr-tag size="small">{number(result.total)}</hbr-tag>
      </hbr-layout>
      {result.items.length ? <div className="wan-connection-list">
        {result.items.map(connection => {
          const summary = kind === 'domain' ? bundleSummary(state, connection.id) : groupBundleSummary(state, connection.id);
          return <div className="wan-connection-row" key={connection.id}
            data-condition={summary.active ? 'major' : summary.unavailable ? 'unknown' : 'normal'}>
            <hbr-layout direction="column" gap="2xs">
              <hbr-button variant="text" size="small" onClick={() => onConnection({ kind, id: connection.id })}>
                {label(connection.from)} ↔ {label(connection.to)}
                <hbr-icon slot="suffix" name="caret-right" size="12px" />
              </hbr-button>
              {kind === 'group' && <hbr-text type="secondary" size="xs">
                {domainLabel(connection.fromDomain)} ↔ {domainLabel(connection.toDomain)}
              </hbr-text>}
              <span className="wan-connection-count">{plural(summary.total, 'member link')}
                {summary.active > 0 && <hbr-tag size="small" sentiment="warning">{plural(summary.active, 'active alarm')}</hbr-tag>}
              </span>
              <hbr-text type="secondary" size="xs">{summary.unavailable
                ? `${plural(summary.unavailable, 'member')} without current observations` : 'Current observations'}</hbr-text>
            </hbr-layout>
          </div>;
        })}
      </div> : <hbr-text type="secondary" size="sm">No connections are included for this scope.</hbr-text>}
      {result.total > 0 && <Pager result={result} pageSize={6} noun="connection" onChange={onPage} />}
    </hbr-layout>
  </section>;
}

function RouterInventory({ state, onPatch, onInspect, onConnection }) {
  const group = findGroup(state.popId);
  const devices = groupDevices(state.popId);
  const result = paged(devices, state.scopePage, PAGE_SIZES.devices);
  return <hbr-layout direction="column" gap="lg">
    <hbr-layout variant="dashboard:widgets:content">
      {result.items.map(device => {
        const summary = summarize(state, [device]);
        const fresh = telemetryCurrent(state, device);
        const reachable = deviceReachable(state, device.id);
        return <hbr-card col="1/3" key={device.id} style={{ '--min-width': '0px' }}
          data-device={device.id} data-condition={summary.tone}>
          <hbr-layout direction="column" gap="sm">
            <hbr-layout direction="row" gap="sm" align="center" justify="space-between">
              <hbr-icon name="device-uplink" size="20px" aria-hidden="true" />
              <hbr-tag size="small" sentiment={reachable ? 'positive' : 'negative'}>
                {reachable ? 'Reachable' : 'Unreachable'}
              </hbr-tag>
            </hbr-layout>
            <hbr-text type="primary" size="sm" weight="bold">{device.id}</hbr-text>
            <hbr-text type="mono" size="xs">{device.address}</hbr-text>
            <hbr-text type="secondary" size="xs">{device.role} router · {device.os || 'IOS XR'} · {group?.type || 'Device group'}</hbr-text>
            <AlarmSignal summary={summary} />
            <QualitySignal count={fresh ? 0 : 1} />
            <hbr-layout direction="row" gap="xs">
              <hbr-button size="small" variant="outline" onClick={() => onInspect({ kind: 'device', id: device.id })}>Inspect</hbr-button>
              <hbr-button size="small" variant="text" onClick={() => onConnection({ kind: 'device', id: device.id })}>
                {number(deviceLinks(device.id).length)} links
              </hbr-button>
            </hbr-layout>
            <hbr-button size="small" variant="text" onClick={() => onInspect({ kind: 'device', id: device.id })}>
              View {number(deviceInterfaces(device.id).length)} interfaces
            </hbr-button>
          </hbr-layout>
        </hbr-card>;
      })}
    </hbr-layout>
    <Pager result={result} pageSize={PAGE_SIZES.devices} noun="router" onChange={page => onPatch({ scopePage: page })} />
  </hbr-layout>;
}

export default function WanOverview({ state, onNavigate, onInspect, onConnection, onPatch, onOpenResponse, spotlight = null }) {
  const [networkPages, setNetworkPages] = useState({});
  const [connectionPages, setConnectionPages] = useState({});
  const [localConnectionPages, setLocalConnectionPages] = useState({});
  const [mapViews, setMapViews] = useState({});
  const setupId = ACTIVE_WAN.id;
  const mapView = mapViews[setupId] || 'world';
  const networkPage = networkPages[setupId] || 0;
  const connectionsPage = connectionPages[setupId] || 0;
  const isGroup = (state.view === 'pop' || state.view === 'group') && Boolean(findGroup(state.popId));
  const isDomain = state.view === 'domain' && DOMAINS.some(domain => domain.id === state.domain);
  const scopeDevices = isGroup ? groupDevices(state.popId) : isDomain ? domainDevices(state.domain) : DEVICES;
  const summary = summarize(state, scopeDevices);
  const incidents = networkWatch(state).incidents;
  const inspection = isDomain ? domainObservation(state, state.domain) : null;
  const scopeAttention = summary.stale > 0 || summary.reachable < summary.devices || (isDomain || isGroup ? summary.alarms > 0 : incidents.length > 0);
  const localGroups = useMemo(() => DEVICE_GROUPS.filter(group => group.domain === state.domain), [setupId, state.domain]);
  const localBundles = useMemo(() => GROUP_BUNDLES.filter(bundle => bundle.fromDomain === state.domain && bundle.toDomain === state.domain), [setupId, state.domain]);
  const crossDomainBundles = useMemo(() => GROUP_BUNDLES.filter(bundle => bundle.fromDomain !== bundle.toDomain && [bundle.fromDomain, bundle.toDomain].includes(state.domain)), [setupId, state.domain]);
  const domainPage = paged(DOMAINS, networkPage, 12);
  const groupPage = paged(localGroups, state.scopePage, PAGE_SIZES.groups);
  const title = isGroup ? groupLabel(state.popId) : isDomain ? `${domainLabel(state.domain)} device groups` : 'WAN overview';
  const subtitle = isGroup
    ? `${domainLabel(state.domain)} · ${plural(scopeDevices.length, 'router')} in this ${findGroup(state.popId)?.type || 'device group'}`
    : isDomain ? `${plural(scopeDevices.length, 'router')} · ${plural(localGroups.length, 'device group')}`
      : `${plural(DOMAINS.length, 'operational domain')} · ${plural(DEVICE_GROUPS.length, 'device group')} · ${plural(DEVICES.length, 'router')}`;
  return <hbr-layout class="wan-overview" variant="dashboard" data-wan-setup={setupId}
    data-source-frame={state.frame} data-gap={state.gap} data-critical={state.critical}>
    <hbr-layout variant="dashboard:section" gap="lg">
      {(isDomain || isGroup) && <hbr-breadcrumb label="WAN scope">
        <hbr-breadcrumb-item onClick={() => onNavigate('network')}>{ACTIVE_WAN.label}</hbr-breadcrumb-item>
        {(isDomain || isGroup) && <hbr-breadcrumb-item onClick={() => onNavigate('domain', state.domain)}>{domainLabel(state.domain)}</hbr-breadcrumb-item>}
        {isGroup && <hbr-breadcrumb-item>{groupLabel(state.popId)}</hbr-breadcrumb-item>}
      </hbr-breadcrumb>}
      <hbr-layout variant="dashboard:widgets:container">
        <hbr-card container col="full" class="wan-overview-surface">
          <hbr-layout slot="header" direction="row" gap="lg" align="start" justify="space-between" class="wan-overview-heading">
            <hbr-layout direction="column" gap="2xs">
              <hbr-text variant="section-title"><h2>{title}</h2></hbr-text>
              <hbr-text type="secondary" size="sm">{subtitle}</hbr-text>
            </hbr-layout>
            {!isDomain && !isGroup && <hbr-view-switcher label="WAN overview view" no-fieldset="" size="small" value={mapView} class="wan-overview-view-switcher"
              onhbr-change={event => { const next = event.currentTarget.value; if (event.target === event.currentTarget && ['world', 'schematic'].includes(next)) setMapViews(previous => ({ ...previous, [setupId]: next })); }}>
              <hbr-radio-button size="small" value="world">World</hbr-radio-button><hbr-radio-button size="small" value="schematic">Schematic</hbr-radio-button>
            </hbr-view-switcher>}
            {(isDomain || isGroup) && <hbr-button size="small" variant="text" onClick={() => onNavigate(isGroup ? 'domain' : 'network', isGroup ? state.domain : undefined)}>
              <hbr-icon slot="prefix" name="arrow-left" size="14px" />{isGroup ? 'Domain' : 'All domains'}
            </hbr-button>}
          </hbr-layout>
          <hbr-layout direction="column" gap="lg">
            {scopeAttention && <div className="wan-scope-health">
              <hbr-layout direction="row" gap="sm" align="center" class="wan-scope-status">
                {isDomain || isGroup ? summary.alarms > 0 && <AlarmSignal summary={summary} /> : incidents.length > 0 && <hbr-tag size="small" sentiment={incidents.some(incident => incident.severity === 'Critical') ? 'negative' : 'warning'}>{plural(incidents.length, 'incident')}</hbr-tag>}
                {summary.reachable < summary.devices && <hbr-text type="secondary" size="xs">{plural(summary.devices - summary.reachable, 'unreachable router')}</hbr-text>}
                {summary.stale > 0 && <QualitySignal count={summary.stale} />}
              </hbr-layout>
              {(summary.alarms > 0 || summary.stale > 0 || (!isDomain && !isGroup && incidents.length > 0)) && <hbr-button variant="text" size="small"
                onClick={() => onOpenResponse(!isDomain && !isGroup && incidents.length ? incidents[0].id : summary.critical ? 'device' : summary.alarms ? 'interface' : 'monitoring')}>
                {summary.alarms || (!isDomain && !isGroup && incidents.length) ? 'Review response' : 'Review monitoring'}
                <hbr-icon slot="suffix" name="caret-right" size="12px" />
              </hbr-button>}
            </div>}
            {inspection && inspection.value !== 'Reachable' && <div className="wan-domain-inspection">
              <hbr-layout direction="column" gap="2xs">
                <hbr-text size="sm" weight="bold">{inspection.title} · {inspection.value}</hbr-text>
                <hbr-text type="secondary" size="xs">{inspection.detail} · {inspection.source} · {inspection.fresh ? inspection.time : `Last known ${inspection.time}`}</hbr-text>
              </hbr-layout>
              <ObservationTrend points={inspection.trend} fresh={inspection.fresh} label={`${domainLabel(state.domain)} interface utilization${inspection.fresh ? '' : ', last known'} through ${inspection.time}`}/>
            </div>}
            {isGroup ? <RouterInventory state={state} onPatch={onPatch} onInspect={onInspect} onConnection={onConnection} /> : <>
              {!isDomain && mapView === 'world' ? <WorldMap nodes={DOMAINS} bundles={BUNDLES} state={state} onNavigate={onNavigate} onConnection={onConnection} spotlight={spotlight}/> : <LogicalMap nodes={isDomain ? localGroups : DOMAINS} bundles={isDomain ? localBundles : BUNDLES}
                state={state} kind={isDomain ? 'group' : 'domain'} page={isDomain ? groupPage.page : domainPage.page}
                pageSize={isDomain ? PAGE_SIZES.groups : 12} onNavigate={onNavigate} onConnection={onConnection} spotlight={spotlight} />}
              <Pager result={isDomain ? groupPage : domainPage} pageSize={isDomain ? PAGE_SIZES.groups : 12}
                noun={isDomain ? 'device group' : 'domain'}
                onChange={page => isDomain ? onPatch({ scopePage: page }) : setNetworkPages(previous => ({ ...previous, [setupId]: page }))} />
              <details className="wan-connections-disclosure" key={`${setupId}:${state.view}:${state.domain}`}>
              <summary>View connections</summary>
              {isDomain && <ConnectionList connections={localBundles} state={state} kind="group" title="Within-domain group connections"
                page={localConnectionPages[`${setupId}:${state.domain}`] || 0}
                onPage={page => setLocalConnectionPages(previous => ({ ...previous, [`${setupId}:${state.domain}`]: page }))}
                onConnection={onConnection} />}
              <ConnectionList connections={isDomain ? crossDomainBundles : BUNDLES} state={state} kind={isDomain ? 'group' : 'domain'}
                title={isDomain ? 'Cross-domain group connections' : 'Domain connections'}
                page={isDomain ? state.groupConnectionsPage || 0 : connectionsPage}
                onPage={page => isDomain ? onPatch({ groupConnectionsPage: page }) : setConnectionPages(previous => ({ ...previous, [setupId]: page }))}
                onConnection={onConnection} />
              </details>
            </>}
          </hbr-layout>
        </hbr-card>
      </hbr-layout>
    </hbr-layout>
  </hbr-layout>;
}
