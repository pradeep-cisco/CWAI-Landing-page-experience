import { useCallback, useEffect, useMemo, useRef } from 'react';
import { WorldMap, LogicalMap } from '../wan/WanOverview.jsx';
import '../wan/wan-overview.css';
import '../wan/world-map.css';
import './combined-network-view.css';

const CARD_SIZING = { '--min-width': '0px', '--width': '100%', '--height': '100%', '--hover-outline': 'none', '--selected-outline': 'none' };
const canonicalMode = mode => mode === 'schematic' ? 'schematic' : 'world';
const incidentCount = incidents => `${incidents.length} ${incidents.some(incident => incident.current === false) ? 'last-known' : 'active'} incident${incidents.length === 1 ? '' : 's'}`;
const incidentDescription = incidents => incidents.length ? `${incidentCount(incidents)}: ${incidents.map(incident => [incident.title || incident.id, incident.stage, incident.current === false ? 'last confirmed' : null].filter(Boolean).join(' · ')).join('; ')}` : null;

/** The same native representation switch used by the Operations overview. */
export function CombinedNetworkSwitcher({ mode = 'world', onModeChange }) {
  return <hbr-view-switcher label="Network overview view" no-fieldset="" size="small" value={canonicalMode(mode)} class="wan-overview-view-switcher"
    onhbr-change={event => {
      const next = event.currentTarget.value;
      if (event.target === event.currentTarget && ['world', 'schematic'].includes(next)) onModeChange?.(next);
    }}>
    <hbr-radio-button size="small" value="world">World</hbr-radio-button>
    <hbr-radio-button size="small" value="schematic">Schematic</hbr-radio-button>
  </hbr-view-switcher>;
}

function representativeScope(domain) {
  const group = domain?.groups?.[0];
  const router = group?.routers?.[0];
  return [group?.label, router?.label].filter(Boolean).join(' · ') || 'No representative resource supplied';
}

function DomainCard({ node, domain, incidents = [], focused, muted, selected, inspected, onReveal, onHighlight, onSelect }) {
  const condition = domain?.condition || 'unavailable';
  const unavailable = condition === 'unavailable';
  const degraded = condition === 'degraded';
  const conditionLabel = domain?.conditionLabel || 'Current observations unavailable';
  const observation = domain?.observation || 'No network observation supplied.';
  const summary = representativeScope(domain);
  const icon = unavailable ? 'clock' : degraded ? 'status-warning' : 'status-positive';
  const sentiment = unavailable ? undefined : degraded ? 'warning' : 'positive';
  return <div className="wan-map-node" style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
    data-region={node.id} data-condition={unavailable ? 'unknown' : degraded ? 'major' : 'normal'} data-stale={unavailable}
    data-focused={focused} data-muted={muted} data-work-scope={inspected}
    onPointerEnter={() => onHighlight?.(node.id)} onPointerLeave={() => onHighlight?.(null)}
    onFocus={() => { onHighlight?.(node.id); onReveal?.(); }} onBlur={() => onHighlight?.(null)}>
    <hbr-card selectable role="button" selected={selected} aria-pressed={selected} style={CARD_SIZING}
      sentiment={degraded ? 'warning' : undefined}
      aria-label={[`Highlight ${domain?.label || node.id} related work`, summary, conditionLabel, observation, incidentDescription(incidents), inspected ? 'Inspected work scope' : null].filter(Boolean).join('. ')}
      onClick={() => onSelect?.({ kind: 'domain', id: node.id })}>
      <hbr-layout direction="column" gap="2xs" class="wan-domain-copy">
        <div className="wan-domain-header">
          <hbr-text type="primary" size="sm" weight="bold" truncate="end" title={domain?.label || node.id}>{domain?.label || node.id}</hbr-text>
          {inspected && <span className="combined-network-work-mark" role="img" aria-label="Inspected work scope"/>}
          {incidents.length > 0 && <hbr-tooltip class="combined-network-incident-hint" content={incidentDescription(incidents)} hoist><hbr-tag class="combined-network-incident-badge" sentiment="warning" size="small" aria-label={incidentDescription(incidents)}><hbr-icon slot="prefix" name="status-warning" size="12px" sentiment="warning"/>{incidents.length}</hbr-tag></hbr-tooltip>}
          <hbr-tooltip content={observation} hoist>
            <span className="wan-domain-reachability" role="img" aria-label={conditionLabel}>
              <hbr-icon name={icon} sentiment={sentiment} size="14px" aria-hidden="true"/>
            </span>
          </hbr-tooltip>
          {unavailable && <hbr-text type="secondary" size="xs">Last-known</hbr-text>}
        </div>
        <div className="wan-domain-summary-row">
          <hbr-text class="wan-domain-summary" type="secondary" size="xs" truncate="end" title={`${summary}. ${observation}`}>{summary}</hbr-text>
        </div>
      </hbr-layout>
    </hbr-card>
  </div>;
}

function ConnectionControl({ route, connection, onHighlight, onSelect }) {
  const label = connection?.label || `${route.from}–${route.to} logical connection`;
  const description = `Inspect ${label}. This is a logical relationship, not a physical link count or a measured cable route.`;
  return <div className="wan-route-control" style={{ left: route.label[0], top: route.label[1] }}
    onPointerEnter={() => onHighlight?.(route.id)} onPointerLeave={() => onHighlight?.(null)}
    onFocus={() => onHighlight?.(route.id)} onBlur={() => onHighlight?.(null)}>
    <hbr-tooltip content={description} hoist>
      <hbr-button size="small" variant="outline" aria-label={description} onClick={() => onSelect?.(connection || route)}>
        <hbr-icon name="nav-connect" size="14px" aria-hidden="true"/>
      </hbr-button>
    </hbr-tooltip>
  </div>;
}

/**
 * Operations' real presentation components own all map geometry and interaction.
 * This adapter supplies only the Combined exploration's independent observations,
 * native-card contents, and highlight-only scope callbacks.
 */
export default function CombinedNetworkView({ network, mode = 'world', expanded = false, alwaysExpanded = false, motionEnabled = true, onViewportVisibilityChange, selectedScope, workScope, onSelectScope, onSelectConnection }) {
  const viewRef = useRef(null);
  const worldViewport = useRef({ x: 0, y: 0, scale: 1 });
  const rememberWorldViewport = useCallback(viewport => { worldViewport.current = { ...viewport }; }, []);
  const viewMode = canonicalMode(mode);
  useEffect(() => {
    const canvas = viewRef.current?.querySelector('.wan-world-viewport, .wan-map');
    if (!canvas || typeof IntersectionObserver !== 'function') { onViewportVisibilityChange?.(true); return; }
    const observer = new IntersectionObserver(([entry]) => onViewportVisibilityChange?.(entry.isIntersecting), { threshold: 0 });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [viewMode, onViewportVisibilityChange]);
  useEffect(() => {
    if (motionEnabled) return;
    // Settle finite reveals once; resuming only continues ambient animation.
    for (const animation of viewRef.current?.getAnimations?.({ subtree: true }) || []) {
      if (animation.animationName?.startsWith('combined-network-') && animation.effect?.getTiming().iterations !== Infinity) animation.finish();
    }
  }, [motionEnabled, viewMode, expanded, network?.domains]);
  // Source-time updates keep the same inventory references and canvas bounds.
  const domainJSON = JSON.stringify(network?.domains || []);
  const connectionJSON = JSON.stringify(network?.connections || []);
  const workJSON = JSON.stringify(workScope?.domainIds || []);
  const incidentJSON = JSON.stringify(network?.incidents || []);
  const nodes = useMemo(() => JSON.parse(domainJSON), [domainJSON]);
  const bundles = useMemo(() => JSON.parse(connectionJSON), [connectionJSON]);
  const workDomains = useMemo(() => new Set(JSON.parse(workJSON)), [workJSON]);
  const activeIncidents = useMemo(() => JSON.parse(incidentJSON).filter(incident => incident.state === 'active'), [incidentJSON]);
  const selectedDomain = selectedScope?.kind === 'domain' ? selectedScope.id : null;
  const spotlight = selectedDomain || workScope?.domainIds?.[0] || null;
  const sourceFrame = network?.lastConfirmed || 'No confirmed observation';
  const sourceInterrupted = network?.sourceState !== 'current';

  const presentation = useMemo(() => {
    const domainsById = new Map(nodes.map(domain => [domain.id, domain]));
    const connectionsById = new Map(bundles.map(connection => [connection.id, connection]));
    const incidentsFor = id => activeIncidents.filter(incident => incident.domainId === id);
    const connectionFor = route => connectionsById.get(route.id) || route;
    return {
      setupId: 'national', sourceFrame,
      showCaption: false,
      canvasLabel: viewMode === 'world' ? 'Network map. Plus and minus zoom; arrow keys pan; Home fits all domains. Control or Command plus scroll zooms at the pointer.' : 'Operational domains and their logical connections.',
      getDomainCondition: id => {
        const condition = domainsById.get(id)?.condition;
        return condition === 'normal' ? 'normal' : condition === 'degraded' ? 'major' : 'unknown';
      },
      getDomainActionLabel: node => {
        const domain = domainsById.get(node.id);
        return [`Highlight ${node.label || node.id} related work`, domain?.conditionLabel || 'Current observations unavailable', domain?.observation || 'No network observation supplied.', incidentDescription(incidentsFor(node.id)), workDomains.has(node.id) ? 'Inspected work scope' : null].filter(Boolean).join('. ');
      },
      getDomainTitle: node => [node.label || node.id, domainsById.get(node.id)?.conditionLabel || 'Current observations unavailable', incidentDescription(incidentsFor(node.id))].filter(Boolean).join(' · '),
      getDomainPressed: id => selectedDomain === id,
      // This guard only keeps consequential incident scopes from being muted;
      // incident lifecycle never changes the separate reachability condition.
      getNodeAlert: id => domainsById.get(id)?.condition === 'degraded' || incidentsFor(id).length > 0,
      // Shared route rendering uses unavailable only as a stale-visibility flag;
      // this adapter never displays a physical member count or alarm total.
      getRouteSummary: () => ({ total: 0, active: 0, unavailable: sourceInterrupted ? 1 : 0 }),
      getRouteLabel: route => `Inspect ${connectionFor(route).label || `${route.from}–${route.to} logical connection`}. Logical connectivity; no physical-link observation is supplied.`,
      renderNode: (node, { focused, muted, onReveal, onHighlight }) => <DomainCard key={`combined:${node.id}`} node={node} domain={domainsById.get(node.id)} incidents={incidentsFor(node.id)}
        focused={focused} muted={muted} selected={selectedDomain === node.id} inspected={workDomains.has(node.id)}
        onReveal={onReveal} onHighlight={onHighlight} onSelect={onSelectScope}/>,
      renderRouteControl: (route, { onHighlight }) => <ConnectionControl key={`combined:${route.id}`} route={route} connection={connectionsById.get(route.id)} onHighlight={onHighlight} onSelect={onSelectConnection}/>,
      renderDomainAdornment: (node, anchor, { index, scale, fitScale }) => {
        const incidents = incidentsFor(node.id);
        if (index !== 0 || !incidents.length) return null;
        const unit = Math.max(.01, scale * fitScale);
        const x = anchor.x + 19 / unit, y = anchor.y - 15 / unit;
        return <g className="combined-network-pin-incidents" data-domain={node.id} data-incident-count={incidents.length} data-current={incidents.every(incident => incident.current !== false)} aria-hidden="true">
          <circle cx={x} cy={y} r={10 / unit}/><text x={x} y={y} dy=".35em" textAnchor="middle" style={{ fontSize: `${(incidents.length > 99 ? 9 : 11) / unit}px` }}>{incidents.length > 99 ? '99+' : incidents.length}</text>
        </g>;
      },
      animateTraffic: false,
      animatePresentation: true,
      compact: !expanded,
      showDomainCards: true,
      preserveViewportOnResize: true,
      canvasHeight: alwaysExpanded ? 560 : undefined,
      viewportPolicy: alwaysExpanded ? { minScale: .5, maxScale: 3, overscan: .22 } : undefined,
      initialViewport: alwaysExpanded ? worldViewport.current : undefined,
      onViewportChange: alwaysExpanded ? rememberWorldViewport : undefined,
    };
  }, [nodes, bundles, sourceFrame, sourceInterrupted, selectedDomain, workDomains, activeIncidents, onSelectScope, onSelectConnection, expanded, alwaysExpanded, rememberWorldViewport, viewMode]);

  const navigate = (kind, id) => { if (kind === 'domain') onSelectScope?.({ kind: 'domain', id }); };
  const inspectConnection = selection => {
    const connection = bundles.find(item => item.id === selection?.id);
    if (connection) onSelectConnection?.(connection);
  };
  return <div ref={viewRef} className="combined-network-view" data-mode={canonicalMode(mode)} data-expanded={expanded} data-always-expanded={alwaysExpanded} data-source={sourceInterrupted ? 'last-known' : 'current'}>
    {canonicalMode(mode) === 'world'
      ? <WorldMap nodes={nodes} bundles={bundles} presentation={presentation} onNavigate={navigate} onConnection={inspectConnection} spotlight={spotlight}/>
      : <LogicalMap nodes={nodes} bundles={bundles} presentation={presentation} kind="domain" pageSize={12} onNavigate={navigate} onConnection={inspectConnection} spotlight={spotlight}/>}
    {canonicalMode(mode) === 'schematic' && <details className="wan-connections-disclosure combined-network-connections">
      <summary>View connections</summary>
      <div className="combined-network-connections-list">
        {bundles.map(connection => <hbr-button key={connection.id} size="small" variant="text" onClick={() => onSelectConnection?.(connection)}
          aria-label={`Inspect ${connection.label || `${connection.from}–${connection.to} logical connection`}`}>
          <hbr-icon slot="prefix" name="nav-connect" size="14px" aria-hidden="true"/>{connection.label || `${connection.from}–${connection.to} logical connection`}
        </hbr-button>)}
        {!bundles.length && <hbr-text type="secondary" size="xs">No declared logical connections.</hbr-text>}
      </div>
    </details>}
  </div>;
}
