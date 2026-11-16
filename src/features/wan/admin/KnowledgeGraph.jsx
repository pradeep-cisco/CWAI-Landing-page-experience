import { useMemo, useRef, useState } from 'react';
import { buildKnowledgeGraph, searchNodes, NODE_TYPES, RELATIONSHIP_TYPES } from './knowledge-graph-model.js';
import { buildExplorerView, getGraphDistances } from './explorer-model.js';
import { KnowledgeQuery, KnowledgeSchema } from './KnowledgeTools.jsx';
import RadialGraphCanvas from './RadialGraphCanvas.jsx';
import GraphEntityInspector from './GraphEntityInspector.jsx';
import './knowledge-graph.css';

const labels = { NetworkDevice: 'Devices', Interface: 'Interfaces', Service: 'Services', Config: 'Configurations' };
const singular = { NetworkDevice: 'Device', Interface: 'Interface', Service: 'Service', Config: 'Configuration' };
const value = event => event.currentTarget?.value ?? event.target?.value ?? '';
const number = count => Number(count || 0).toLocaleString('en-US');
const shortName = node => node.type === 'Interface' ? `${node.attributes.device_id} · ${String(node.attributes.name || node.label).replace('HundredGigE', 'Hu').replace('GigabitEthernet', 'Gi')}` : node.label;

function indexSnapshot(snapshot) {
  const nodeById = new Map(snapshot.nodes.map(node => [node.id, node]));
  const adjacency = new Map(snapshot.nodes.map(node => [node.id, []]));
  for (const edge of snapshot.edges) {
    adjacency.get(edge.from)?.push(edge);
    adjacency.get(edge.to)?.push(edge);
  }
  return { ...snapshot, nodeById, adjacency };
}

export default function KnowledgeGraph({ state }) {
  const graph = useMemo(() => buildKnowledgeGraph(state), [state]);
  const serviceId = graph.nodes.find(node => node.type === 'Service')?.id;
  const initialRoot = serviceId || graph.defaultRootId;
  const [view, setView] = useState('explore');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [rootId, setRootId] = useState(initialRoot);
  const [selectedId, setSelectedId] = useState(initialRoot);
  const [depth, setDepth] = useState(2);
  const [relations, setRelations] = useState(() => [...RELATIONSHIP_TYPES]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [trail, setTrail] = useState([initialRoot]);
  const [recent, setRecent] = useState([initialRoot, graph.defaultRootId].filter((id, index, items) => items.indexOf(id) === index));
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [queryResult, setQueryResult] = useState(null);
  const [requestedType, setRequestedType] = useState('NetworkDevice');
  const [schemaRequest, setSchemaRequest] = useState(0);
  const tabs = useRef(null);
  const searchArea = useRef(null);
  const results = useMemo(() => searchNodes(graph, search, type, 20), [graph, search, type]);
  const snapshot = queryResult?.wanId === graph.wanId ? queryResult : null;
  const sourceGraph = useMemo(() => snapshot ? indexSnapshot(snapshot) : graph, [snapshot, graph]);
  // Edge filters preserve the radial positions and hop rings, as in the reference.
  const neighborhood = useMemo(() => buildExplorerView(sourceGraph, rootId, { depth, expandedIds, selectedId, limit: 64 }), [sourceGraph, rootId, depth, expandedIds, selectedId]);
  const graphView = useMemo(() => {
    if (!snapshot) return { ...neighborhood, edges: neighborhood.edges.filter(edge => relations.includes(edge.type)) };
    const expandedNeighbors = expandedIds.flatMap(id => (sourceGraph.adjacency.get(id) || []).map(edge => sourceGraph.nodeById.get(edge.from === id ? edge.to : edge.from)));
    const prioritized = [sourceGraph.nodeById.get(rootId), sourceGraph.nodeById.get(selectedId), ...expandedNeighbors, ...NODE_TYPES.map(nodeType => snapshot.nodes.find(node => node.type === nodeType)), ...snapshot.nodes].filter(Boolean);
    const nodes = [...new Map(prioritized.map(node => [node.id, node])).values()].slice(0, 64);
    const ids = new Set(nodes.map(node => node.id));
    return { ...neighborhood, snapshot: true, nodes, distances: getGraphDistances(sourceGraph, rootId), total: snapshot.nodes.length, omitted: snapshot.nodes.length - nodes.length, edges: snapshot.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to) && relations.includes(edge.type)) };
  }, [snapshot, sourceGraph, neighborhood, rootId, selectedId, relations, expandedIds]);
  const visibleIds = useMemo(() => new Set(graphView.nodes.map(node => node.id)), [graphView.nodes]);
  const selected = sourceGraph.nodeById.get(selectedId);
  const activate = name => { setView(name); tabs.current?.show(name); };
  const remember = id => setRecent(current => [id, ...current.filter(item => item !== id)].slice(0, 8));
  const focus = (id, currentModel = false) => {
    const source = currentModel ? graph : sourceGraph;
    if (!source.nodeById.has(id)) return;
    if (currentModel) setQueryResult(null);
    setTrail(current => currentModel && snapshot ? [id] : current.at(-1) === id ? current : [...current, id]);
    setRootId(id); setSelectedId(id); setExpandedIds([]); setInspectorOpen(true);
    setSearchOpen(false); setRecentOpen(false); remember(id); activate('explore');
  };
  const inspect = id => { if (sourceGraph.nodeById.has(id)) { setSelectedId(id); setInspectorOpen(true); } };
  const inspectSchema = nodeType => { setRequestedType(nodeType); setSchemaRequest(current => current + 1); activate('schema'); };
  const revisit = index => {
    const id = trail[index];
    if (!sourceGraph.nodeById.has(id)) return;
    setTrail(current => current.slice(0, index + 1)); setRootId(id); setSelectedId(id); setExpandedIds([]); setInspectorOpen(true);
  };
  const visualize = result => {
    const id = result.focusNodeId || result.nodes?.[0]?.id;
    if (!id) return;
    setQueryResult({ ...result, nodes: result.nodes, edges: result.edges || [], wanId: result.wanId || graph.wanId, sourceTime: result.sourceTime || graph.sourceTime });
    setRootId(id); setSelectedId(id); setExpandedIds([]); setTrail([id]); setInspectorOpen(true); activate('explore');
  };
  const closeSearch = () => { setSearchOpen(false); setRecentOpen(false); };
  const options = recentOpen ? recent.map(id => graph.nodeById.get(id)).filter(Boolean) : results.items;
  return <div className="kg-workspace" onPointerDownCapture={event => { if (searchArea.current && !searchArea.current.contains(event.target)) closeSearch(); }}>
    <div className="kg-heading"><div><hbr-text variant="section-title">Knowledge graph</hbr-text><hbr-text size="sm" type="secondary">Explore the relationships behind the network.</hbr-text></div><hbr-tag size="small">Illustrative network model · {graph.wanLabel}</hbr-tag></div>
    <hbr-tab-group ref={tabs} class="kg-view-tabs" aria-label="Knowledge graph views" onhbr-tab-show={event => { if (event.target === event.currentTarget && ['explore', 'schema', 'query'].includes(event.detail?.name)) setView(event.detail.name); }}>
      <hbr-tab slot="nav" panel="explore" active={view === 'explore'}>Explore</hbr-tab>
      <hbr-tab slot="nav" panel="schema" active={view === 'schema'}>Schema</hbr-tab>
      <hbr-tab slot="nav" panel="query" active={view === 'query'}>Query</hbr-tab>
      <hbr-tab-panel name="explore" active={view === 'explore'}>
        <div className="kg-explore">
          <div className="kg-explorer-toolbar">
            <div ref={searchArea} className="kg-find-area" onKeyDown={event => { if (event.key === 'Escape') closeSearch(); }}>
              <hbr-input label="Search entities" placeholder="Device, interface, service, or config" size="small" value={search} onhbr-focus={() => { setSearchOpen(true); setRecentOpen(false); }} onhbr-input={event => { setSearch(value(event)); setSearchOpen(true); setRecentOpen(false); }}><hbr-icon slot="prefix" name="magnifying-glass"/></hbr-input>
              <hbr-select label="Entity type" size="small" value={type} onhbr-change={event => { setType(value(event)); setSearchOpen(true); setRecentOpen(false); }}><hbr-option value="all">All types · {number(graph.nodes.length)}</hbr-option>{NODE_TYPES.map(nodeType => <hbr-option key={nodeType} value={nodeType}>{labels[nodeType]} · {number(graph.counts[nodeType])}</hbr-option>)}</hbr-select>
              <hbr-button variant="text" size="small" onClick={() => { setRecentOpen(current => !current); setSearchOpen(false); }} ariaexpanded={String(recentOpen)}><hbr-icon name="clock" slot="prefix"/>Recent</hbr-button>
              {(searchOpen || recentOpen) && <div className="kg-search-popup" role="region" aria-label={recentOpen ? 'Recently explored entities' : 'Entity search results'}>
                <div className="kg-search-popup-heading"><hbr-text size="xs" type="secondary">{recentOpen ? 'Recently explored' : `${number(results.total)} matches`}</hbr-text><hbr-button variant="text" size="small" arialabel="Close entity search" onClick={closeSearch}><hbr-icon name="x"/></hbr-button></div>
                <div className="kg-search-results">{options.map(node => <div className="kg-search-entry" key={node.id} data-type={node.type}><hbr-button variant="text" size="small" onClick={() => focus(node.id, true)} title={node.label}><span slot="prefix" className="kg-type-dot"/>{shortName(node)}</hbr-button><span className="kg-search-meta" title={node.source}>{singular[node.type]} · {node.source}</span></div>)}{!options.length && <hbr-text size="sm" type="secondary">No matching entities. Try another name or type.</hbr-text>}</div>
                {!recentOpen && results.omitted > 0 && <hbr-text size="xs" type="secondary">Showing {results.items.length}. Refine your search for another entity.</hbr-text>}
              </div>}
            </div>
            <div className="kg-context-shortcuts" aria-label="Explore a network context">{serviceId && <hbr-button variant="text" size="small" onClick={() => { setDepth(2); focus(serviceId, true); }}>Service context</hbr-button>}<hbr-button variant="text" size="small" onClick={() => { setDepth(1); focus(graph.defaultRootId, true); }}>XR-P1</hbr-button></div>
          </div>
          <div className="kg-trail-row"><nav className="kg-exploration-trail" aria-label="Exploration trail"><hbr-button variant="text" size="small" disabled={trail.length < 2} arialabel="Back to previous focus" onClick={() => revisit(trail.length - 2)}><hbr-icon name="arrow-left" slot="prefix"/>Back</hbr-button>{trail.slice(-5).map((id, index, visible) => <span key={`${id}:${trail.length - visible.length + index}`}><hbr-icon name="caret-right" aria-hidden="true"/>{index === visible.length - 1 ? <span className="kg-current-focus" data-type={sourceGraph.nodeById.get(id)?.type}><span className="kg-type-dot"/>{sourceGraph.nodeById.get(id)?.label || id}</span> : <hbr-button variant="text" size="small" onClick={() => revisit(trail.length - visible.length + index)}>{sourceGraph.nodeById.get(id)?.label || id}</hbr-button>}</span>)}</nav>
            <div className="kg-snapshot-label"><hbr-text size="xs" type="secondary">{snapshot ? 'Query snapshot' : 'Observed'} {snapshot?.sourceTime || graph.sourceTime}{snapshot && snapshot.sourceTime !== graph.sourceTime ? ` · Current model ${graph.sourceTime}` : ''}</hbr-text>{snapshot && <hbr-button size="small" variant="text" onClick={() => focus(graph.nodeById.has(rootId) ? rootId : initialRoot, true)}>Return to traversal</hbr-button>}{!inspectorOpen && <hbr-button size="small" variant="text" onClick={() => setInspectorOpen(true)}>Inspect selected</hbr-button>}</div>
          </div>
          <div className="kg-explorer-surface" data-inspector={inspectorOpen}>
            <RadialGraphCanvas graph={sourceGraph} graphView={graphView} rootId={rootId} selectedId={selectedId} depth={depth} onDepthChange={hops => { setDepth(hops); setExpandedIds([]); }} relations={relations} onRelationsChange={setRelations} expandedIds={expandedIds} onExpand={id => setExpandedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])} onSelect={inspect} onRecenter={id => focus(id)} snapshot={Boolean(snapshot)}/>
            {inspectorOpen && <aside className="kg-inspector" aria-label="Entity inspection"><GraphEntityInspector key={`${sourceGraph.wanId}:${selectedId}`} node={selected} graph={sourceGraph} visibleIds={visibleIds} rootId={rootId} onSelect={inspect} onNavigate={id => focus(id)} onSchema={inspectSchema} onClose={() => setInspectorOpen(false)}/></aside>}
          </div>
        </div>
      </hbr-tab-panel>
      <hbr-tab-panel name="schema" active={view === 'schema'}><KnowledgeSchema graph={graph} requestedType={requestedType} requestToken={schemaRequest} onExploreType={nodeType => { setType(nodeType); setSearch(''); setSearchOpen(true); setRecentOpen(false); activate('explore'); }}/></hbr-tab-panel>
      <hbr-tab-panel name="query" active={view === 'query'}><KnowledgeQuery graph={graph} onVisualize={visualize}/></hbr-tab-panel>
    </hbr-tab-group>
  </div>;
}
