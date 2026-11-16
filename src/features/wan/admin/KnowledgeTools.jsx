import { useEffect, useMemo, useState } from 'react';
import { SCHEMA, QUERY_EXAMPLES, executeKnowledgeQuery } from './knowledge-graph-model.js';
import './knowledge-tools.css';

const number = value => Number(value || 0).toLocaleString('en-US');
const entityCount = (value, qualifier = '') => `${number(value)} ${qualifier ? `${qualifier} ` : ''}${Number(value) === 1 ? 'entity' : 'entities'}`;
const valueOf = event => event.currentTarget?.value ?? event.target?.value ?? '';
const readableRelationship = value => String(value || '').replaceAll('_', ' ').toLowerCase();

function ToolCard({ title, subtitle, children, className = '', actions }) {
  return <hbr-layout variant="dashboard:widgets:container" class={`kg-tool-card-layout ${className}`}>
    <hbr-card container col="full">
      <hbr-layout slot="header" direction="row" gap="md" align="start" justify="space-between" class="kg-tool-heading">
        <hbr-layout direction="column" gap="2xs">
          <hbr-text variant="section-title">{title}</hbr-text>
          {subtitle && <hbr-text size="sm" type="secondary">{subtitle}</hbr-text>}
        </hbr-layout>
        {actions}
      </hbr-layout>
      {children}
    </hbr-card>
  </hbr-layout>;
}

export function KnowledgeSchema({ graph, onExploreType, requestedType, requestToken }) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('NetworkDevice');
  useEffect(() => {
    if (SCHEMA.some(item => item.type === requestedType)) { setSelectedType(requestedType); setSearch(''); }
  }, [requestedType, requestToken]);
  const definitions = useMemo(() => SCHEMA.filter(definition =>
    `${definition.type} ${definition.label} ${definition.description} ${definition.attributes.map(item => item.name).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const active = definitions.find(item => item.type === selectedType) || definitions[0];
  return <div className="kg-tool-grid kg-schema-view">
    <ToolCard title="Entity types" subtitle="The structure of the network model.">
      <hbr-layout direction="column" gap="lg">
        <hbr-input label="Find a type or attribute" type="search" clearable value={search} onhbr-input={event => setSearch(valueOf(event))} onhbr-clear={() => setSearch('')}/>
        <div className="kg-schema-types" aria-label="Schema entity types">
          {definitions.map(definition => <div className="kg-schema-type" key={definition.type} data-selected={active?.type === definition.type}>
            <hbr-button variant={active?.type === definition.type ? 'outline' : 'text'} size="small" aria={{ pressed: active?.type === definition.type }} onClick={() => setSelectedType(definition.type)}>{definition.label || definition.type}</hbr-button>
            <hbr-text type="secondary" size="xs">{entityCount(graph.counts?.[definition.type])}</hbr-text>
          </div>)}
          {!definitions.length && <hbr-text size="sm" type="secondary">No matching types or attributes. Clear the search to browse the schema.</hbr-text>}
        </div>
      </hbr-layout>
    </ToolCard>
    {active ? <ToolCard title={active.label || active.type} subtitle={active.description}
      actions={<hbr-button variant="outline" size="small" onClick={() => onExploreType?.(active.type)}>Browse entities</hbr-button>}>
      <hbr-layout direction="column" gap="xl">
        <hbr-layout direction="row" gap="sm" align="center"><hbr-text size="xs" type="secondary">Type name</hbr-text><hbr-tag size="small" mono>{active.type}</hbr-tag></hbr-layout>
        <div className="kg-schema-section">
          <hbr-text variant="sub-section-title">Attributes</hbr-text>
          <dl className="kg-schema-attributes">{active.attributes.map(attribute => <div key={attribute.name}>
            <dt><code>{attribute.name}</code><span className="kg-schema-attribute-meta"><hbr-tag size="small">{attribute.type}</hbr-tag><hbr-text size="xs" type="secondary">{attribute.required ? 'Required' : 'Optional'}</hbr-text></span></dt>
            <dd>{attribute.description || 'Defined by the source model.'}</dd>
          </div>)}</dl>
        </div>
        <div className="kg-schema-section">
          <hbr-text variant="sub-section-title">Relationships</hbr-text>
          {active.relationships.length ? <ul className="kg-schema-relationships">{active.relationships.map(relationship => <li key={`${relationship.type}:${relationship.target}`}>
            <div><code>{relationship.type}</code><span aria-hidden="true"> → </span><strong>{relationship.target}</strong><hbr-tag size="small">{relationship.cardinality}</hbr-tag></div>
            <hbr-text size="sm" type="secondary">{relationship.description || `${active.type} ${readableRelationship(relationship.type)} ${relationship.target}.`}</hbr-text>
          </li>)}</ul> : <hbr-text size="sm" type="secondary">No outgoing relationships are defined for this type. Incoming relationships remain visible in exploration.</hbr-text>}
        </div>
      </hbr-layout>
    </ToolCard> : <ToolCard title="Schema definition"><hbr-text type="secondary">Choose a matching entity type to inspect its attributes and relationships.</hbr-text></ToolCard>}
  </div>;
}

function readSaved(wanId) {
  if (typeof window === 'undefined') return [];
  try {
    const records = JSON.parse(window.localStorage.getItem(`crosswork-kg-queries:${wanId}`) || '[]');
    return Array.isArray(records) ? records.filter(item => typeof item?.label === 'string' && typeof item?.query === 'string').slice(0, 12) : [];
  } catch { return []; }
}

function QueryItems({ items, onLoad, onRemove, empty }) {
  return items.length ? <div className="kg-query-items">{items.map((item, index) => <div className="kg-query-item" key={item.id || `${item.label}:${index}`}>
    <hbr-button variant="text" size="small" onClick={() => onLoad(item)}>{item.label}</hbr-button>
    {(item.description || item.summary) && <hbr-text type="secondary" size="xs">{item.description || item.summary}</hbr-text>}
    {onRemove && <hbr-button size="small" variant="text" onClick={() => onRemove(item)}>Remove</hbr-button>}
  </div>)}</div> : <hbr-text type="secondary" size="sm">{empty}</hbr-text>;
}

export function KnowledgeQuery({ graph, onVisualize }) {
  const [query, setQuery] = useState(() => QUERY_EXAMPLES[0]?.query || '');
  const [result, setResult] = useState(null);
  const [resultQuery, setResultQuery] = useState('');
  const [resultSourceTime, setResultSourceTime] = useState(null);
  const [libraryView, setLibraryView] = useState('examples');
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(() => readSaved(graph.wanId));
  const [saveName, setSaveName] = useState('');
  const [notice, setNotice] = useState('');
  const [savedWan, setSavedWan] = useState(graph.wanId);
  useEffect(() => {
    if (savedWan === graph.wanId) return;
    setSavedWan(graph.wanId);
    setSaved(readSaved(graph.wanId));
    setHistory([]); setResult(null); setResultQuery(''); setResultSourceTime(null); setNotice('');
  }, [graph.wanId, savedWan]);
  useEffect(() => {
    if (typeof window === 'undefined' || savedWan !== graph.wanId) return;
    try { window.localStorage.setItem(`crosswork-kg-queries:${graph.wanId}`, JSON.stringify(saved)); }
    catch { /* A private browsing session can still use in-memory queries. */ }
  }, [saved, savedWan, graph.wanId]);

  const loadQuery = item => { setQuery(item.query); setNotice(`Loaded ${item.label}. Run the query to update the result.`); };
  const runQuery = () => {
    if (!query.trim()) return;
    let next;
    try { next = executeKnowledgeQuery(graph, query); }
    catch { next = { error: 'The query could not be evaluated. Check its fields and try a supported example.' }; }
    setResult(next);
    setResultQuery(query);
    setResultSourceTime(graph.sourceTime);
    setNotice('');
    const label = QUERY_EXAMPLES.find(item => item.query.trim() === query.trim())?.label || saveName.trim() || `Query ${history.length + 1}`;
    setHistory(previous => [{ id: `query-${Date.now()}`, label, query, summary: next.error ? 'Query error' : `${entityCount(next.nodes?.length, 'returned')} · source ${graph.sourceTime}` }, ...previous].slice(0, 20));
  };
  const saveQuery = () => {
    if (!query.trim()) return;
    const label = saveName.trim() || QUERY_EXAMPLES.find(item => item.query.trim() === query.trim())?.label || `Saved query ${saved.length + 1}`;
    const item = { id: `saved-${Date.now()}`, label, query };
    setSaved(previous => [item, ...previous.filter(record => record.label !== label)].slice(0, 12));
    setSaveName(''); setNotice(`Saved ${label} in this browser for ${graph.wanLabel}.`);
  };
  const changeLibrary = event => {
    if (event.target !== event.currentTarget || !['examples', 'history', 'saved'].includes(event.detail?.name)) return;
    setLibraryView(event.detail.name);
  };
  const runShortcut = event => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); runQuery(); }
  };
  const returnedNodes = result?.nodes || [];
  const changedSinceResult = result && query !== resultQuery;
  const visualize = focusNodeId => onVisualize?.({ ...result, focusNodeId, sourceTime: resultSourceTime, wanId: graph.wanId });
  return <div className="kg-tool-grid kg-query-view">
    <ToolCard title="Queries" subtitle="Examples and saved investigations.">
      <hbr-tab-group class="kg-query-library" onhbr-tab-show={changeLibrary}>
        <hbr-tab slot="nav" panel="examples" active={libraryView === 'examples'}>Examples</hbr-tab>
        <hbr-tab slot="nav" panel="history" active={libraryView === 'history'}>History</hbr-tab>
        <hbr-tab slot="nav" panel="saved" active={libraryView === 'saved'}>Saved</hbr-tab>
        <hbr-tab-panel name="examples" active={libraryView === 'examples'}><QueryItems items={QUERY_EXAMPLES} onLoad={loadQuery} empty="No examples available."/></hbr-tab-panel>
        <hbr-tab-panel name="history" active={libraryView === 'history'}><QueryItems items={history} onLoad={loadQuery} empty="Executed queries will appear here during this review."/></hbr-tab-panel>
        <hbr-tab-panel name="saved" active={libraryView === 'saved'}><QueryItems items={saved} onLoad={loadQuery} onRemove={item => { setSaved(previous => previous.filter(record => record.id !== item.id)); setNotice(`Removed ${item.label} from saved queries.`); }} empty="Save a query to return to it in this browser."/></hbr-tab-panel>
      </hbr-tab-group>
    </ToolCard>
    <div className="kg-query-workspace">
      <ToolCard title="Query console" subtitle="Read-only queries against the selected network model.">
        <hbr-layout direction="column" gap="lg">
          <hbr-textarea class="kg-query-editor" label="GraphQL query" rows={12} resize="vertical" spellcheck={false} autocapitalize="off" value={query} error={Boolean(result?.error && !changedSinceResult)} onhbr-input={event => setQuery(valueOf(event))} onKeyDown={runShortcut}/>
          <hbr-text size="xs" type="secondary">Supported read-only fields: networkDevices, networkDevice, interfaces, services, and configs. Use an example for the supported query shape. Ctrl/Cmd + Enter runs the query.</hbr-text>
          <div className="kg-query-actions">
            <hbr-button disabled={!query.trim()} onClick={runQuery}>Run query</hbr-button>
            <hbr-button variant="text" onClick={() => { setQuery(''); setNotice(''); }}>Clear editor</hbr-button>
          </div>
          <div className="kg-query-save">
            <hbr-input label="Save query as" placeholder="Query name" size="small" value={saveName} maxlength={80} onhbr-input={event => setSaveName(valueOf(event))}/>
            <hbr-button variant="outline" size="small" disabled={!query.trim()} onClick={saveQuery}>Save query</hbr-button>
          </div>
          <div className="kg-tool-notice" role="status" aria-live="polite">{notice}</div>
        </hbr-layout>
      </ToolCard>
      <ToolCard title="Result" subtitle={resultSourceTime ? `Source snapshot ${resultSourceTime} · ${graph.wanLabel}` : 'Run a query to inspect its entities and relationships.'}
        actions={returnedNodes.length > 0 && !result?.error ? <hbr-button size="small" variant="outline" onClick={() => visualize()}>Visualize result</hbr-button> : null}>
        <hbr-layout direction="column" gap="lg">
          {changedSinceResult && <hbr-text type="secondary" size="sm">The editor has changed. This is the result of the previous query.</hbr-text>}
          {result?.error ? <div className="kg-query-error" role="alert"><hbr-text size="sm">{String(result.error)}</hbr-text></div>
            : result ? <>
              <div className="kg-query-result-summary"><hbr-tag size="small">{entityCount(returnedNodes.length, 'returned')}</hbr-tag>{result.truncated && <hbr-text type="secondary" size="xs">Bounded result · {number(result.total)} matching root {result.total === 1 ? 'record' : 'records'}</hbr-text>}</div>
              {returnedNodes.length ? <div className="kg-query-entities" aria-label="Returned entities">{returnedNodes.slice(0, 8).map(node => <hbr-button key={node.id} size="small" variant="text" onClick={() => visualize(node.id)}>{node.label} · {node.type}</hbr-button>)}</div> : <hbr-text size="sm" type="secondary">No entities match this query.</hbr-text>}
              {returnedNodes.length > 8 && <hbr-text size="xs" type="secondary">Showing 8 entity shortcuts. Visualize the result to inspect the returned graph.</hbr-text>}
              <pre className="kg-query-json" tabIndex={0} aria-label="GraphQL response">{JSON.stringify(result.data ?? {}, null, 2)}</pre>
            </> : <hbr-text size="sm" type="secondary">Choose an example or write a supported query. Results will be shown here.</hbr-text>}
        </hbr-layout>
      </ToolCard>
    </div>
  </div>;
}
