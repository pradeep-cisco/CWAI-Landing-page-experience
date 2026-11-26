import { useEffect, useMemo, useRef, useState } from 'react';
import { getIncidentOverview } from './incident-overview-model.js';
import './incident-section.css';

const PAGE_SIZE = 6;
const format = value => Number(value || 0).toLocaleString('en-US');

/** Incidents retain their own selection and reading order, independent of Jobs. */
export default function IncidentSection({ model, domainFilter = 'all', agentFilter = 'all', selectedIncidentId = null, onOpenIncident }) {
  const [page, setPage] = useState(0);
  const orderRef = useRef({ scope: '', ids: [] });
  const listRef = useRef(null), pageFocusRef = useRef(false);
  const scope = `${domainFilter}:${agentFilter}`;
  const incidents = useMemo(() => {
    const overview = getIncidentOverview(model, { domainId: domainFilter, agentId: agentFilter });
    const labelKey = incident => `${incident.displayTitle || incident.title}:${incident.displayScope || ''}`;
    const labelCounts = new Map();
    for (const incident of overview) labelCounts.set(labelKey(incident), (labelCounts.get(labelKey(incident)) || 0) + 1);
    const records = overview.map(incident => labelCounts.get(labelKey(incident)) > 1 ? { ...incident, displayScope: incident.scope } : incident);
    if (orderRef.current.scope !== scope) orderRef.current = { scope, ids: [] };
    const ids = new Set(records.map(record => record.id));
    orderRef.current.ids = [...orderRef.current.ids.filter(id => ids.has(id)), ...records.map(record => record.id).filter(id => !orderRef.current.ids.includes(id))];
    const byId = new Map(records.map(record => [record.id, record]));
    return orderRef.current.ids.map(id => byId.get(id));
  }, [model, domainFilter, agentFilter, scope]);
  const selected = incidents.find(incident => incident.id === selectedIncidentId);
  const pages = Math.max(1, Math.ceil(incidents.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  const visible = incidents.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const current = model?.sourceState === 'current';
  const activeCount = incidents.filter(incident => incident.state !== 'completed').length;

  useEffect(() => { setPage(0); }, [scope]);
  useEffect(() => {
    if (!pageFocusRef.current) return;
    pageFocusRef.current = false;
    listRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, [page]);
  const changePage = next => { pageFocusRef.current = true; setPage(next); };
  useEffect(() => {
    if (!selectedIncidentId) return;
    const index = incidents.findIndex(incident => incident.id === selectedIncidentId);
    if (index >= 0) setPage(Math.floor(index / PAGE_SIZE));
  }, [selectedIncidentId, scope]);

  return <section className="agent-incidents-section" aria-labelledby="agent-incidents-title" data-source={current ? 'current' : 'last-known'} data-incident-open={String(Boolean(selected))}>
    <hbr-card container class="agent-incidents-container">
      <div className="agent-incidents-heading" slot="header"><h2 id="agent-incidents-title" tabIndex={-1}>Incidents</h2><span>{current ? '' : 'Last known · '}{format(current ? activeCount : incidents.length)} {current ? 'active' : 'retained'}</span></div>
      <div className="agent-incidents-layout">
        <div className="agent-incidents-list-area">
          {!current && <p className="agent-incidents-source"><hbr-icon name="clock" size="14px" aria-hidden="true"/>Updates interrupted. Incident states are last confirmed.</p>}
          <ul ref={listRef} className="agent-incidents-list" aria-label="Incidents in this view">
            {visible.map(incident => <li key={incident.id}>
              <button type="button" id={`agent-incident-row-${incident.id}`} className="agent-incidents-row" data-incident-id={incident.id} data-state={incident.state} aria-label={`${incident.id} · ${incident.title}${incident.scope ? ` · ${incident.scope}` : ''} · ${incident.stateLabel}${incident.featured && incident.finding ? ` · ${incident.finding.current ? '' : 'Last confirmed: '}${incident.finding.text}` : ''}`} title={`${incident.id}${incident.scope ? ` · ${incident.scope}` : ''}${incident.featured && incident.finding ? ` · Source: ${incident.finding.source}` : ''}`} aria-expanded={selectedIncidentId === incident.id} aria-controls={selectedIncidentId === incident.id ? 'agent-incident-drawer' : undefined} onClick={event => onOpenIncident?.(incident.id, event, incidents.map(item => item.id))}>
                <span className="agent-incidents-row-copy"><strong>{incident.displayTitle || incident.title}</strong>{incident.displayScope && <span>{incident.displayScope}</span>}{incident.featured && incident.finding && <span className="agent-incidents-row-finding" data-source={incident.finding.current ? 'current' : 'last-known'}>{incident.finding.current ? '' : 'Last confirmed · '}{incident.finding.text}</span>}</span>
                <span className="agent-incidents-row-state"><i aria-hidden="true"/>{incident.displayStateLabel || incident.stateLabel}</span>
                <hbr-icon name="caret-left" size="14px" aria-hidden="true"/>
              </button>
            </li>)}
          </ul>
          {!incidents.length && <div className="agent-incidents-empty"><hbr-icon name="check-circle" size="20px" aria-hidden="true"/><p>{current ? 'No active incidents in this view' : 'No retained incidents in this view'}</p><span>{current ? 'Agents continue monitoring the selected scope.' : 'Current conditions are unavailable.'}</span></div>}
          {incidents.length > PAGE_SIZE && <div className="agent-incidents-pagination"><span>{format(currentPage * PAGE_SIZE + 1)}–{format(Math.min((currentPage + 1) * PAGE_SIZE, incidents.length))} of {format(incidents.length)}</span><div><hbr-button variant="text" size="small" disabled={currentPage === 0} arialabel="Previous incidents" onClick={() => changePage(Math.max(0, currentPage - 1))}>Previous</hbr-button><hbr-button variant="text" size="small" disabled={currentPage >= pages - 1} arialabel="Next incidents" onClick={() => changePage(Math.min(pages - 1, currentPage + 1))}>Next</hbr-button></div></div>}
        </div>
      </div>
    </hbr-card>
  </section>;
}
