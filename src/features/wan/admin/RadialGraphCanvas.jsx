import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { NODE_TYPES, RELATIONSHIP_TYPES } from './knowledge-graph-model.js';
import { radialGraphLayout, shortestGraphPath, summarizeConnections } from './explorer-model.js';
import './radial-graph.css';

const typeLabel = { NetworkDevice: 'Device', Interface: 'Interface', Service: 'Service', Config: 'Config' };
const relationLabel = type => String(type || '').replaceAll('_', ' ').toLowerCase();
const boundedScale = value => Math.max(.24, Math.min(2.4, value));
const shortLabel = node => {
  const label = node.type === 'Interface' ? String(node.attributes?.name || node.label).replace('HundredGigE', 'Hu').replace('GigabitEthernet', 'Gi') : node.type === 'Config' ? node.attributes?.record_id || node.label : node.type === 'Service' ? node.attributes?.name || node.label : node.label;
  return label.length > 22 ? `${label.slice(0, 13)}…${label.slice(-7)}` : label;
};
const activate = (event, action) => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); action(); }
};
const indexView = view => {
  const adjacency = new Map(view.nodes.map(node => [node.id, []]));
  for (const edge of view.edges) {
    adjacency.get(edge.from)?.push(edge);
    adjacency.get(edge.to)?.push(edge);
  }
  return { ...view, adjacency, nodeById: new Map(view.nodes.map(node => [node.id, node])) };
};
const point = (angle, radius) => ({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
function sectorPath(start, end, inner, outer) {
  const a = point(start, outer), b = point(end, outer), c = point(end, inner), d = point(start, inner);
  const large = end - start > Math.PI ? 1 : 0;
  return `M${a.x},${a.y} A${outer},${outer} 0 ${large} 1 ${b.x},${b.y} L${c.x},${c.y} A${inner},${inner} 0 ${large} 0 ${d.x},${d.y}Z`;
}
const symbolRadius = (isRoot, scale) => Math.max(isRoot ? 28 : 22, (isRoot ? 22 : 14) / scale);
function edgeGeometry(edge, positions, rootId, scale) {
  const from = positions.get(edge.from), to = positions.get(edge.to);
  if (!from || !to) return null;
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
  if (length < 1) return null;
  const sourceRadius = symbolRadius(edge.from === rootId, scale) + 2, targetRadius = symbolRadius(edge.to === rootId, scale) + 2;
  const start = { x: from.x + dx / length * sourceRadius, y: from.y + dy / length * sourceRadius };
  const end = { x: to.x - dx / length * (targetRadius + (edge.directed === false ? 0 : 4)), y: to.y - dy / length * (targetRadius + (edge.directed === false ? 0 : 4)) };
  const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const curve = edge.from === rootId || edge.to === rootId ? .98 : from.depth === to.depth ? .64 : .84;
  const control = { x: middle.x * curve, y: middle.y * curve };
  return { path: `M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}`, label: { x: (start.x + 2 * control.x + end.x) / 4, y: (start.y + 2 * control.y + end.y) / 4 } };
}

export default function RadialGraphCanvas({ graph, graphView, rootId, selectedId, depth = 1, onDepthChange, relations = RELATIONSHIP_TYPES, onRelationsChange, expandedIds = [], onExpand, onSelect, onRecenter, snapshot = false }) {
  const canvas = useRef(null), svg = useRef(null), drag = useRef(null);
  const uid = useId().replaceAll(':', '');
  const [size, setSize] = useState({ width: 900, height: 720 });
  const [viewport, setViewport] = useState({ x: 450, y: 340, scale: .8 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredRelation, setHoveredRelation] = useState(null);
  const [card, setCard] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [pinnedEdge, setPinnedEdge] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [simplified, setSimplified] = useState(false);
  const layout = useMemo(() => radialGraphLayout(graphView, rootId), [graphView, rootId]);
  const visibleIds = useMemo(() => new Set(graphView.nodes.map(node => node.id)), [graphView.nodes]);
  const visibleGraph = useMemo(() => indexView(graphView), [graphView]);
  const expanded = useMemo(() => new Set(expandedIds), [expandedIds]);
  const summaries = useMemo(() => new Map(graphView.nodes.map(node => [node.id, summarizeConnections(graph, node.id, visibleIds)])), [graph, graphView.nodes, visibleIds]);
  const activeId = hoveredId || (selectedId !== rootId && visibleIds.has(selectedId) ? selectedId : null);
  const edgeCard = hoveredEdge || pinnedEdge;
  const activeEdge = edgeCard ? graphView.edges.find(edge => edge.id === edgeCard.edgeId) : null;
  const focusPath = useMemo(() => activeId ? shortestGraphPath(visibleGraph, rootId, activeId) : { nodeIds: [], edgeIds: [] }, [visibleGraph, rootId, activeId]);
  const neighbors = useMemo(() => {
    const ids = new Set(focusPath.nodeIds);
    if (activeId) {
      ids.add(activeId);
      for (const edge of visibleGraph.adjacency.get(activeId) || []) { ids.add(edge.from); ids.add(edge.to); }
    }
    return ids;
  }, [activeId, visibleGraph, focusPath]);
  const edgeCounts = useMemo(() => new Map(RELATIONSHIP_TYPES.map(type => [type, graphView.edges.filter(edge => edge.type === type).length])), [graphView.edges]);
  const relationNodes = useMemo(() => new Set(hoveredRelation ? graphView.edges.filter(edge => edge.type === hoveredRelation).flatMap(edge => [edge.from, edge.to]) : []), [hoveredRelation, graphView.edges]);
  const pathEdges = useMemo(() => new Set(focusPath.edgeIds), [focusPath]);
  const shapeKey = `${rootId}|${depth}|${graphView.nodes.map(node => node.id).sort().join('|')}`;
  const fit = useCallback(() => {
    const extent = Math.max(190, layout.extent || 190);
    const scale = boundedScale(Math.min((size.width - 112) / (extent * 2), (size.height - 152) / (extent * 2), 1.15));
    setViewport({ x: size.width / 2, y: size.height / 2 - 12, scale });
  }, [layout.extent, size]);
  const zoom = useCallback((factor, anchor) => {
    const x = anchor?.x ?? size.width / 2, y = anchor?.y ?? size.height / 2;
    setViewport(current => {
      const scale = boundedScale(current.scale * factor), ratio = scale / current.scale;
      return { x: x - (x - current.x) * ratio, y: y - (y - current.y) * ratio, scale };
    });
  }, [size]);

  useEffect(() => {
    if (!canvas.current || typeof ResizeObserver === 'undefined') return undefined;
    const resize = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect?.width && rect?.height) setSize(current => current.width === rect.width && current.height === rect.height ? current : { width: rect.width, height: rect.height });
    });
    resize.observe(canvas.current);
    return () => resize.disconnect();
  }, []);
  useEffect(() => { fit(); setHoveredId(null); setHoveredRelation(null); setCard(null); setHoveredEdge(null); setPinnedEdge(null); }, [shapeKey, fit]);
  useEffect(() => {
    const element = svg.current;
    if (!element) return undefined;
    const wheel = event => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      zoom(Math.exp(-Math.max(-120, Math.min(120, event.deltaY)) * .0025), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [zoom]);

  const panStart = event => {
    if (event.button !== 0 || event.target.closest?.('[data-kg-node],[data-kg-edge]')) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, viewport };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true); setCard(null); setPinnedEdge(null); setHoveredEdge(null);
  };
  const panMove = event => {
    const current = drag.current;
    if (current?.pointerId !== event.pointerId) return;
    setViewport({ ...current.viewport, x: current.viewport.x + event.clientX - current.x, y: current.viewport.y + event.clientY - current.y });
  };
  const panEnd = event => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null; setIsDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const keyboard = event => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.2); }
    else if (event.key === '-') { event.preventDefault(); zoom(1 / 1.2); }
    else if (event.key === 'Home' || event.key === '0') { event.preventDefault(); fit(); }
    else if (event.key === 'Escape') { setHoveredId(null); setHoveredRelation(null); setCard(null); setFilterOpen(false); setHoveredEdge(null); setPinnedEdge(null); }
    else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      setViewport(current => ({ ...current, x: current.x + (event.key === 'ArrowLeft' ? 40 : event.key === 'ArrowRight' ? -40 : 0), y: current.y + (event.key === 'ArrowUp' ? 40 : event.key === 'ArrowDown' ? -40 : 0) }));
    }
  };
  const toggleRelation = (type, checked) => onRelationsChange?.(checked ? [...new Set([...relations, type])] : relations.filter(item => item !== type));
  const openCard = (event, nodeId) => { setHoveredEdge(null); setPinnedEdge(null); setCard({ nodeId, anchor: event.currentTarget }); };
  const tooltipNode = card ? graph.nodeById.get(card.nodeId) : null;
  const tooltipSummary = card ? summaries.get(card.nodeId) : null;
  const tooltipGroups = useMemo(() => {
    const counts = new Map();
    for (const group of tooltipSummary?.groups || []) counts.set(group.type, (counts.get(group.type) || 0) + group.edges.length);
    return [...counts];
  }, [tooltipSummary]);
  const ringOuter = Math.max(200, ...(layout.rings || []).map(ring => ring.radius)) + 78;
  const labelSize = 11 / viewport.scale;
  const compact = viewport.scale < .45;

  return <div className="kg-radial" data-compact={compact} onKeyDown={event => { if (event.key === 'Escape') { setCard(null); setFilterOpen(false); setHoveredEdge(null); setPinnedEdge(null); } }}>
    <div className="kg-radial-surface" ref={canvas} data-dragging={isDragging}>
      <svg ref={svg} className="kg-radial-svg" width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`} role="group" tabIndex={0} aria-label="Knowledge graph canvas. Drag to pan, scroll to zoom. Arrow keys pan; plus and minus zoom; Home fits. Select a node to inspect; press R to focus it."
        onPointerDown={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd} onKeyDown={keyboard} onMouseLeave={() => { if (!drag.current) { setHoveredId(null); setHoveredRelation(null); setCard(null); setHoveredEdge(null); } }} onClick={event => { if (!event.target.closest?.('[data-kg-node],[data-kg-edge]')) { setCard(null); setHoveredId(null); setPinnedEdge(null); setHoveredEdge(null); } }}>
        <defs>
          <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform={`translate(${viewport.x % 20},${viewport.y % 20})`}><circle cx="1" cy="1" r=".7" className="kg-radial-grid-dot"/></pattern>
          {RELATIONSHIP_TYPES.map(type => <marker key={type} id={`${uid}-${type}`} viewBox="0 0 10 10" refX="8.8" refY="5" markerWidth={7 / viewport.scale} markerHeight={7 / viewport.scale} orient="auto" markerUnits="userSpaceOnUse" data-relation-type={type}><path d="M1 1 8.5 5 1 9" className="kg-radial-arrow"/></marker>)}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${uid}-grid)`}/>
        <g className="kg-radial-world" style={{ transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.scale})` }} data-panning={isDragging}>
          {!simplified && <g className="kg-radial-sectors" aria-hidden="true">{layout.sectors.map(sector => <path key={sector.type} data-entity-type={sector.type} d={sectorPath(sector.startAngle, sector.endAngle, 85, ringOuter)}/>)}<circle r="85" className="kg-radial-center-boundary"/></g>}
          <g className="kg-radial-rings" aria-hidden="true">{layout.rings.filter(ring => ring.depth > 0 || ring.depth === null).map(ring => <g key={ring.depth ?? 'result'}><circle r={ring.radius}/>{!simplified && <text x={ring.radius - 32} y="-10" style={{ fontSize: 10 / viewport.scale }}>{ring.depth === null ? 'Other results' : `Hop ${ring.depth}`}</text>}</g>)}</g>
          <g className="kg-radial-edges">{graphView.edges.map(edge => {
            const geometry = edgeGeometry(edge, layout.positions, rootId, viewport.scale);
            if (!geometry) return null;
            const upstream = edge.directed !== false && (graphView.distances?.get(edge.from) ?? 0) > (graphView.distances?.get(edge.to) ?? 0);
            const highlighted = hoveredRelation ? edge.type === hoveredRelation : activeEdge ? activeEdge.id === edge.id : activeId ? edge.from === activeId || edge.to === activeId || pathEdges.has(edge.id) : false;
            const dim = hoveredRelation ? edge.type !== hoveredRelation : activeEdge ? activeEdge.id !== edge.id : activeId ? !highlighted : false;
            const label = relationLabel(edge.type), labelWidth = (label.length * 5.1 + 12) / viewport.scale;
            return <g key={edge.id} data-relation-type={edge.type} className="kg-radial-edge" data-highlighted={highlighted} data-upstream={upstream} data-fresh={edge.fresh !== false} style={{ opacity: dim ? .16 : highlighted ? 1 : .66 }} data-kg-edge="true" role="button" tabIndex={0} aria-label={`${label}: ${graph.nodeById.get(edge.from)?.label || edge.from} to ${graph.nodeById.get(edge.to)?.label || edge.to}. Show relationship evidence.`}
              onMouseEnter={event => { setHoveredId(null); setCard(null); setHoveredEdge({ edgeId: edge.id, anchor: event.currentTarget }); }} onMouseLeave={() => setHoveredEdge(null)} onFocus={event => setHoveredEdge({ edgeId: edge.id, anchor: event.currentTarget })} onBlur={() => setHoveredEdge(null)}
              onClick={event => { event.stopPropagation(); setPinnedEdge({ edgeId: edge.id, anchor: event.currentTarget }); }} onKeyDown={event => activate(event, () => setPinnedEdge({ edgeId: edge.id, anchor: event.currentTarget }))}>
              <title>{`${graph.nodeById.get(edge.from)?.label || edge.from} ${label} ${graph.nodeById.get(edge.to)?.label || edge.to}. ${edge.directed === false ? 'Bidirectional connection. ' : ''}${edge.source} · ${edge.sourceTime}${edge.fresh === false ? ' · Last known' : ''}`}</title>
              <path className="kg-radial-edge-line" d={geometry.path} markerEnd={edge.directed === false ? undefined : `url(#${uid}-${edge.type})`}/>
              <path className="kg-radial-edge-hit" d={geometry.path}/>
              <circle className="kg-radial-edge-bounds" cx={geometry.label.x} cy={geometry.label.y} r={8 / viewport.scale} aria-hidden="true"/>
              {!simplified && showLabels && (!compact || activeEdge?.id === edge.id) && <g transform={`translate(${geometry.label.x},${geometry.label.y})`} className="kg-radial-edge-label"><rect x={-labelWidth / 2} y={-7 / viewport.scale} width={labelWidth} height={14 / viewport.scale} rx={3 / viewport.scale}/><text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 8.5 / viewport.scale }}>{label}</text></g>}
            </g>;
          })}</g>
          <g className="kg-radial-nodes">{graphView.nodes.map(node => {
            const position = layout.positions.get(node.id);
            if (!position) return null;
            const root = node.id === rootId, selected = node.id === selectedId, radius = symbolRadius(root, viewport.scale);
            const details = !compact || selected || hoveredId === node.id;
            const summary = summaries.get(node.id) || { total: 0, hidden: 0 };
            const localExpanded = expanded.has(node.id);
            const hiddenNeighbors = summary.hiddenNeighbors ?? summary.hiddenNeighborIds?.length ?? summary.hidden;
            const dim = hoveredRelation ? !relationNodes.has(node.id) : activeEdge ? activeEdge.from !== node.id && activeEdge.to !== node.id : activeId ? !neighbors.has(node.id) : false;
            return <g key={node.id} className="kg-radial-node" data-entity-type={node.type} data-root={root} data-selected={selected} data-fresh={node.fresh !== false} style={{ transform: `translate(${position.x}px,${position.y}px)`, opacity: dim ? .22 : 1 }} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => { setHoveredId(null); setCard(current => current?.nodeId === node.id ? null : current); }}>
              <g className="kg-radial-node-body" data-kg-node="true" role="button" tabIndex={0} aria-label={`Inspect ${node.label}, ${typeLabel[node.type]}${node.fresh === false ? ', last-known source' : ''}`} aria-pressed={selected}
                onClick={event => { event.stopPropagation(); onSelect?.(node.id); }} onDoubleClick={event => { event.stopPropagation(); onRecenter?.(node.id); }} onFocus={() => setHoveredId(node.id)} onBlur={() => setHoveredId(null)} onKeyDown={event => { activate(event, () => onSelect?.(node.id)); if (event.key.toLowerCase() === 'r') { event.preventDefault(); event.stopPropagation(); onRecenter?.(node.id); } }}>
                <title>{`${node.label} · ${typeLabel[node.type]} · ${node.source}. Double-click or press R to focus.`}</title>
                <rect className="kg-radial-node-hit" x={details && !simplified ? -Math.max(radius + 6, shortLabel(node).length * 3.5 / viewport.scale, 38 / viewport.scale) : -radius - 6} y={-radius - 6} width={details && !simplified ? Math.max((radius + 6) * 2, shortLabel(node).length * 7 / viewport.scale, 76 / viewport.scale) : (radius + 6) * 2} height={simplified || !details ? (radius + 6) * 2 : radius * 2 + 48 / viewport.scale}/>
                {(selected || root) && <circle r={radius + 6} className="kg-radial-node-halo"/>}
                <circle r={radius} className="kg-radial-node-disc"/>{compact ? <text className="kg-radial-monogram" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 10 / viewport.scale }} aria-hidden="true">{typeLabel[node.type][0]}</text> : <circle r={root ? 5 : 4} className="kg-radial-node-dot"/>}
                {!simplified && details && <><text y={radius + 18 / viewport.scale} textAnchor="middle" className="kg-radial-node-name" style={{ fontSize: root ? 12 / viewport.scale : labelSize }}>{shortLabel(node)}</text><g transform={`translate(0,${radius + 33 / viewport.scale})`} className="kg-radial-node-chip"><rect x={-(typeLabel[node.type].length * 2.9 + 8) / viewport.scale} y={-6 / viewport.scale} width={(typeLabel[node.type].length * 5.8 + 16) / viewport.scale} height={14 / viewport.scale} rx={3 / viewport.scale}/><text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 9 / viewport.scale }}>{typeLabel[node.type]}{node.fresh === false ? '*' : ''}</text></g></>}
              </g>
              {!simplified && details && <g className="kg-radial-degree" data-kg-node="true" transform={`translate(${-radius + 1},${-radius + 1})`} role="button" tabIndex={0} aria-label={`${node.label}: ${summary.total} connections. Show connection summary.`}
                onMouseEnter={event => openCard(event, node.id)} onMouseLeave={() => setCard(null)} onFocus={event => openCard(event, node.id)} onBlur={() => setCard(null)} onClick={event => { event.stopPropagation(); openCard(event, node.id); }} onKeyDown={event => activate(event, () => openCard(event, node.id))}>
                <circle r={12 / viewport.scale} className="kg-radial-badge-hit"/><circle r={8 / viewport.scale}/><text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 8 / viewport.scale }}>{summary.total}</text>
              </g>}
              {!simplified && details && (hiddenNeighbors > 0 || localExpanded) && <g className="kg-radial-expand" data-kg-node="true" transform={`translate(${radius - 1},${-radius + 1})`} role="button" tabIndex={0} aria-label={localExpanded ? `Collapse expansion from ${node.label}` : `Expand ${hiddenNeighbors} hidden connections from ${node.label}`} aria-expanded={localExpanded}
                onClick={event => { event.stopPropagation(); onExpand?.(node.id); }} onKeyDown={event => activate(event, () => onExpand?.(node.id))}>
                <title>{localExpanded ? 'Collapse this local expansion' : `${hiddenNeighbors} connected entities outside this canvas. Expand locally.`}</title><circle r={13 / viewport.scale} className="kg-radial-badge-hit"/><circle r={10 / viewport.scale}/><text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 8 / viewport.scale }}>{localExpanded ? '−' : `+${hiddenNeighbors}`}</text>
              </g>}
            </g>;
          })}</g>
        </g>
      </svg>

      <div className="kg-radial-depth kg-radial-overlay" aria-label="Graph depth">
        <div className="kg-radial-depth-controls">{snapshot ? <strong>Query result</strong> : <><span>Depth</span>{[1, 2, 3, 4].map(hops => <hbr-button key={hops} size="small" variant={depth === hops ? 'fill' : 'text'} ariapressed={String(depth === hops)} onClick={() => onDepthChange?.(hops)}>{hops}</hbr-button>)}<span>{depth === 1 ? 'hop' : 'hops'}</span></>}</div>
        <div className="kg-radial-ring-counts"><strong>{graphView.nodes.length} nodes</strong>{visibleIds.has(rootId) && <span>R0: 1</span>}{layout.rings.map(ring => <span key={ring.depth ?? 'result'}>{ring.depth === null ? 'Other results' : `R${ring.depth}`}: {ring.count}</span>)}</div>
      </div>
      <div className="kg-radial-tools kg-radial-overlay" aria-label="Canvas tools">
        <hbr-tooltip placement="left" hoist dismissOnClick content="Zoom in"><hbr-button size="small" variant="outline" arialabel="Zoom in" disabled={viewport.scale >= 2.4} onClick={() => zoom(1.2)}><hbr-icon name="plus" aria-hidden="true"/></hbr-button></hbr-tooltip>
        <hbr-tooltip placement="left" hoist dismissOnClick content="Zoom out"><hbr-button size="small" variant="outline" arialabel="Zoom out" disabled={viewport.scale <= .24} onClick={() => zoom(1 / 1.2)}><hbr-icon name="minus" aria-hidden="true"/></hbr-button></hbr-tooltip>
        <hbr-tooltip placement="left" hoist dismissOnClick content="Fit graph"><hbr-button size="small" variant="outline" arialabel="Fit graph" onClick={fit}><hbr-icon name="crosshair" aria-hidden="true"/></hbr-button></hbr-tooltip>
        <hbr-tooltip placement="left" hoist dismissOnClick content={showLabels ? 'Hide relationship labels' : 'Show relationship labels'}><hbr-button size="small" variant={showLabels ? 'fill' : 'outline'} aria={{ label: showLabels ? 'Hide relationship labels' : 'Show relationship labels' }} ariapressed={String(showLabels)} onClick={() => setShowLabels(current => !current)}><hbr-icon name={showLabels ? 'eye' : 'eye-slash'} aria-hidden="true"/></hbr-button></hbr-tooltip>
        <hbr-tooltip placement="left" hoist dismissOnClick content={simplified ? 'Show details' : 'Simplify view'}><hbr-button size="small" variant={simplified ? 'fill' : 'outline'} aria={{ label: simplified ? 'Show details' : 'Simplify view' }} ariapressed={String(simplified)} onClick={() => setSimplified(current => !current)}><hbr-icon name="stack" aria-hidden="true"/></hbr-button></hbr-tooltip>
        <span className="kg-radial-zoom">{Math.round(viewport.scale * 100)}%</span>
      </div>

      {!simplified && <>
        <div className="kg-radial-relations kg-radial-overlay" aria-label="Relationship legend"><span className="kg-radial-legend-heading">Relationships</span>{RELATIONSHIP_TYPES.map(type => <div key={type} className="kg-radial-legend-row" data-relation-type={type} data-enabled={relations.includes(type)} onMouseEnter={() => setHoveredRelation(type)} onMouseLeave={() => setHoveredRelation(null)}><span className="kg-radial-line" aria-hidden="true"/><span>{relationLabel(type)}</span><span>{edgeCounts.get(type) || 0}</span></div>)}<div className="kg-radial-dash-key"><span aria-hidden="true"/>Upstream direction</div><div className="kg-radial-stale-key"><span aria-hidden="true"/>Last-known source</div></div>
        <div className="kg-radial-types kg-radial-overlay" aria-label="Entity type legend"><span className="kg-radial-legend-heading">Entity types</span>{NODE_TYPES.map(type => <div key={type} data-entity-type={type}><span aria-hidden="true"/>{typeLabel[type]}</div>)}</div>
      </>}

      <div className="kg-radial-filter kg-radial-overlay">
        <hbr-popover open={filterOpen} trigger="manual" placement="top-start" size="small" hoist onhbr-hide={event => { if (event.target === event.currentTarget) setFilterOpen(false); }} onhbr-dismiss={() => setFilterOpen(false)}>
          <hbr-button size="small" variant="outline" ariaexpanded={String(filterOpen)} onClick={() => setFilterOpen(current => !current)}><hbr-icon slot="prefix" name="funnel-simple" aria-hidden="true"/>Filter</hbr-button>
          <div slot="content" className="kg-radial-filter-content" role="region" aria-label="Filter relationships"><div className="kg-radial-filter-heading"><strong>Relationships</strong><hbr-button size="small" variant="text" arialabel="Close relationship filters" onClick={() => setFilterOpen(false)}><hbr-icon name="x" aria-hidden="true"/></hbr-button></div>{RELATIONSHIP_TYPES.map(type => <hbr-checkbox key={type} size="small" checked={relations.includes(type)} onhbr-change={event => toggleRelation(type, Boolean(event.currentTarget.checked))}><span data-relation-type={type} className="kg-radial-filter-label"><i aria-hidden="true"/>{relationLabel(type)}</span></hbr-checkbox>)}<hbr-button size="small" variant="text" onClick={() => onRelationsChange?.([...RELATIONSHIP_TYPES])}>Show all relationships</hbr-button></div>
        </hbr-popover>
      </div>
      <span className="kg-radial-gesture-hint kg-radial-overlay">{compact ? 'Zoom for labels · Drag to pan' : 'Drag to pan · Scroll to zoom'}</span>
      {!graphView.nodes.length && <div className="kg-radial-empty">No entities in this graph view.</div>}
    </div>
    <div className="kg-radial-status"><span>{graphView.nodes.length} nodes · {graphView.edges.length} relationships{graphView.omitted > 0 ? ` · ${graphView.omitted.toLocaleString('en-US')} more outside this canvas` : ''}</span><span>Physical links are bidirectional</span></div>
    {card && tooltipNode && tooltipSummary && <hbr-popover open trigger="manual" anchor={card.anchor} placement="bottom-start" size="small" variant="chart" hoist>
      {tooltipNode && tooltipSummary && <div slot="content" className="kg-radial-connection-card"><strong>{tooltipSummary.total} connections</strong><div><span>{tooltipSummary.incoming} in</span><span>{tooltipSummary.outgoing} out</span>{tooltipSummary.connected > 0 && <span>{tooltipSummary.connected} linked</span>}</div><div className="kg-radial-connection-visibility">{tooltipSummary.visible} visible · {tooltipSummary.hidden} outside canvas</div><ul>{tooltipGroups.map(([type, count]) => <li key={type} data-relation-type={type}><span>{relationLabel(type)}</span><strong>{count}</strong></li>)}</ul></div>}
    </hbr-popover>}
    {edgeCard && activeEdge && <hbr-popover open trigger="manual" anchor={edgeCard.anchor} placement="top" size="small" variant="chart" hoist>
      {activeEdge && <div slot="content" className="kg-radial-edge-card" data-relation-type={activeEdge.type}><strong>{relationLabel(activeEdge.type)}</strong><span>{graph.nodeById.get(activeEdge.from)?.label || activeEdge.from} {activeEdge.directed === false ? '↔' : '→'} {graph.nodeById.get(activeEdge.to)?.label || activeEdge.to}</span><span>{activeEdge.source} · {activeEdge.sourceTime}{activeEdge.fresh === false ? ' · Last known' : ''}</span>{pinnedEdge && <hbr-button size="small" variant="text" onClick={() => { setPinnedEdge(null); setHoveredEdge(null); }}>Close relationship detail</hbr-button>}</div>}
    </hbr-popover>}
  </div>;
}
