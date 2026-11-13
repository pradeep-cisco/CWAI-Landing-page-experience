import { useMemo, useState } from 'react';
import { buildOperations } from './operations-model.js';
import { IncidentSection, WatchlistSection } from './SituationSections.jsx';
import { ChangesSection, DataHealthSummary, RecentSection } from './EvidenceSections.jsx';
import './operations.css';

const sections = [
  ['incidents', 'Incidents'], ['watchlist', 'Watchlist'], ['changes', 'Changes'],
  ['recent', 'Recent'],
];

export default function OperationsDashboard({ state, onOpen, onInspect, onAction }) {
  const model = useMemo(() => buildOperations(state), [state]);
  const [requestedIncident, setRequestedIncident] = useState(null);
  const contextKey = `${model.scope.domainId}:${model.scope.groupId}`;
  const focusSection = id => {
    const destination = document.getElementById(`ops-${id}`);
    if (!destination) return;
    destination.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    destination.focus({ preventScroll: true });
  };
  const goTo = (event, id) => { event.preventDefault(); focusSection(id); };
  const reviewIncident = (view = 'overview') => {
    setRequestedIncident(previous => ({ id: 'interface', view, contextKey, token: (previous?.token || 0) + 1 }));
    focusSection('incidents');
  };
  return <div className="ops-dashboard" aria-label="Network operations">
    <nav className="ops-section-nav" aria-label="Network operations sections">
      {sections.map(([id, label]) => <a key={id} href={`#ops-${id}`} onClick={event => goTo(event, id)}>{label}</a>)}
    </nav>
    <DataHealthSummary key={`health:${contextKey}`} model={model} onInspect={onInspect} onOpen={onOpen}/>
    <IncidentSection key={`incidents:${contextKey}`} model={model} state={state} requestedIncident={requestedIncident} onOpen={onOpen} onInspect={onInspect} onAction={onAction}/>
    <WatchlistSection key={`watchlist:${contextKey}`} model={model} onInspect={onInspect} onOpen={onOpen} onReviewIncident={reviewIncident}/>
    <ChangesSection model={model} onInspect={onInspect}/>
    <RecentSection key={`recent:${contextKey}`} model={model} onOpen={onOpen}/>
  </div>;
}
