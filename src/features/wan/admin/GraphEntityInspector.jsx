import { Fragment, useEffect, useMemo, useState } from 'react';
import { summarizeConnections } from './explorer-model.js';
import './graph-inspector.css';

const typeLabels = { NetworkDevice: 'Device', Interface: 'Interface', Service: 'Service', Config: 'Config' };
const directionLabels = { incoming: 'Incoming', outgoing: 'Outgoing', connected: 'Connected' };
const directionSymbols = { incoming: '↙', outgoing: '↗', connected: '↔' };
const readable = value => value === undefined || value === null ? 'Not recorded' : typeof value === 'object' ? JSON.stringify(value) : String(value);
const list = value => Array.isArray(value) ? value : [];
const fieldName = value => value.replaceAll('_', ' ');
const inputValue = event => event.currentTarget?.value ?? event.target?.value ?? '';
const targetLabel = node => node?.type === 'Interface' ? String(node.attributes?.name || node.label).replace('HundredGigE', 'Hu').replace('GigabitEthernet', 'Gi') : node?.label || 'Entity unavailable';

function CopyValue({ value, label }) {
  const text = readable(value);
  return <span className="kgi-copy-value"><span title={text}>{text}</span><hbr-copyclipboard iconOnly size="small" value={text} aria={{ label: `Copy ${label}` }}/></span>;
}

function DataPairs({ items, copy = false }) {
  return <hbr-key-value-pairs direction="column" size="sm"><dl>{items.map(([key, value]) => <Fragment key={key}><dt>{fieldName(key)}</dt><dd>{copy ? <CopyValue value={value} label={fieldName(key)}/> : <span title={readable(value)}>{readable(value)}</span>}</dd></Fragment>)}</dl></hbr-key-value-pairs>;
}

export default function GraphEntityInspector({ node, graph, visibleIds, onNavigate, onSchema, onClose, rootId }) {
  const [attributeFilter, setAttributeFilter] = useState('');
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { setAttributeFilter(''); setShowAll(false); }, [node?.id]);
  const summary = useMemo(() => summarizeConnections(graph, node?.id, visibleIds), [graph, node?.id, visibleIds]);
  const nodeById = useMemo(() => graph?.nodeById || new Map((graph?.nodes || []).map(entity => [entity.id, entity])), [graph]);

  if (!node) return <div className="kgi-empty"><hbr-text type="secondary">Select an entity on the canvas to inspect its source, attributes, and relationships.</hbr-text></div>;

  const allAttributes = Object.entries(node.attributes || {});
  const query = attributeFilter.trim().toLowerCase();
  const matches = allAttributes.filter(([key, value]) => `${key} ${readable(value)}`.toLowerCase().includes(query));
  const attributes = query || showAll ? matches : matches.slice(0, 6);
  const defined = list(node.schemaCoverage?.defined), missing = list(node.schemaCoverage?.missing), extra = list(node.schemaCoverage?.extra);
  const navigate = id => { if (id && nodeById.has(id)) onNavigate?.(id); };

  return <div className="kgi-shell">
    <header className="kgi-header" data-type={node.type}>
      <span className="kg-type-dot"/>
      <div className="kgi-header-text"><hbr-text variant="smallest-title">{node.label}</hbr-text><hbr-text size="xs" type="secondary">{node.type} · {summary.total} {summary.total === 1 ? 'connection' : 'connections'}</hbr-text></div>
      <hbr-button variant="text" size="small" arialabel="Close entity inspection" onClick={onClose}><hbr-icon name="x" aria-hidden="true"/></hbr-button>
    </header>
    <div className="kgi-body">
      <div>
        <hbr-accordion label="Identity" variant="borderless" size="small" open>
          <div className="kgi-content"><DataPairs copy items={[
            ['Node ID', node.id], ['Type', node.type], ['Label', node.label],
          ]}/>{node.id === rootId && <hbr-text size="xs" type="secondary">Focus entity</hbr-text>}</div>
        </hbr-accordion>
        <hbr-accordion label="Source" variant="borderless" size="small">
          <div className="kgi-content"><DataPairs items={[
            ['Source system', node.source], ['Observation', node.sourceTime],
            ['Source state', node.fresh === false ? 'Last known' : 'Current snapshot'],
          ]}/>{node.fresh === false && <hbr-text size="xs" type="secondary">Collection is unavailable. These values retain their original source time.</hbr-text>}</div>
        </hbr-accordion>
        <hbr-accordion label={`Attributes (${allAttributes.length})`} variant="borderless" size="small" open>
          <div className="kgi-content">
            <hbr-input size="small" label="Find an attribute" placeholder="Name or value" value={attributeFilter} onhbr-input={event => setAttributeFilter(inputValue(event))}/>
            {attributes.length ? <DataPairs copy items={attributes}/> : <hbr-text size="sm" type="secondary">No matching attributes.</hbr-text>}
            {!query && allAttributes.length > 6 && <hbr-button size="small" variant="text" onClick={() => setShowAll(current => !current)}>{showAll ? 'Show less' : `Show all (${allAttributes.length})`}</hbr-button>}
            {query && <hbr-text size="xs" type="secondary">{matches.length} of {allAttributes.length} attributes</hbr-text>}
          </div>
        </hbr-accordion>
        <hbr-accordion label="Schema coverage" variant="borderless" size="small">
          <div className="kgi-content">
            <hbr-text size="sm">{defined.length} defined · {missing.length} missing · {extra.length} additional</hbr-text>
            <DataPairs items={[
              ['Defined attributes', defined.length ? defined.join(', ') : 'None recorded'],
              ['Missing required attributes', missing.length ? missing.join(', ') : 'None'],
              ['Additional source attributes', extra.length ? extra.join(', ') : 'None'],
            ]}/>
            <hbr-button variant="text" size="small" onClick={() => onSchema?.(node.type)}>View {node.type} schema definition<hbr-icon name="arrow-right" slot="suffix" aria-hidden="true"/></hbr-button>
          </div>
        </hbr-accordion>
        <hbr-accordion label={`Relationships (${summary.total})`} variant="borderless" size="small" open>
          <div className="kgi-content">
            <div className="kgi-direction-summary" aria-label="Relationship directions">
              <span><span aria-hidden="true">↗</span> {summary.outgoing} out</span><span><span aria-hidden="true">↙</span> {summary.incoming} in</span><span><span aria-hidden="true">↔</span> {summary.connected} connected</span>
            </div>
            <hbr-text size="xs" type="secondary">{summary.visibleNeighborIds.length} related entities on canvas · {summary.hiddenNeighbors} outside this view</hbr-text>
            {summary.groups.map(group => <div key={`${group.direction}:${group.type}`} className="kgi-relationship-group" data-relation={group.type}>
              <div className="kgi-relationship-heading"><span className="kgi-relation-direction" title={directionLabels[group.direction]} aria-label={directionLabels[group.direction]}>{directionSymbols[group.direction]}</span><span className="kgi-relation-label">{group.type}</span><span className="kgi-relation-count">{group.edges.length}</span></div>
              <div className="kgi-relationship-list">{group.edges.map(edge => {
                const targetId = edge.from === node.id ? edge.to : edge.from;
                const target = nodeById.get(targetId);
                return <div className="kgi-relationship-entry" data-type={target?.type} key={edge.id} title={`${directionLabels[group.direction]} · ${edge.type} · ${edge.source || 'Recorded relationship'} · ${edge.sourceTime || node.sourceTime}`}>
                  <hbr-button variant="text" size="small" disabled={!target} onClick={() => navigate(targetId)} title={target?.label || targetId}><span className="kg-type-dot" slot="prefix"/>{targetLabel(target)}<hbr-icon name="arrow-right" slot="suffix" aria-hidden="true"/></hbr-button>
                  <span className="kgi-relationship-meta">{typeLabels[target?.type] || target?.type || 'Unknown type'}{target?.type === 'Interface' && target.attributes?.device_id ? ` · ${target.attributes.device_id}` : ''}{!visibleIds?.has(targetId) ? ' · Outside canvas' : ''}</span>
                </div>;
              })}</div>
            </div>)}
            {!summary.total && <hbr-text size="sm" type="secondary">No recorded relationships in this source view.</hbr-text>}
          </div>
        </hbr-accordion>
      </div>
      <div className="kgi-footer"><hbr-button variant="outline" size="small" onClick={() => navigate(node.id)}>Explore from this entity<hbr-icon name="arrow-right" slot="suffix" aria-hidden="true"/></hbr-button></div>
    </div>
  </div>;
}
