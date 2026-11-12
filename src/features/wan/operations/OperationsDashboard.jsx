import { useMemo } from 'react';
import { buildOperations } from './operations-model.js';
import { IncidentSection, WatchlistSection } from './SituationSections.jsx';
import { ChangesSection, MonitoringSection, ResolvedSection, RepeatIssuesSection } from './EvidenceSections.jsx';
import RecoverySection from './RecoverySection.jsx';
import './operations.css';

const sections = [
  ['incidents', 'Incidents'], ['watchlist', 'Watchlist'], ['changes', 'Changes'],
  ['recovery', 'Recovery'], ['monitoring', 'Monitoring'], ['resolved', 'Resolved'], ['repeat-issues', 'Repeat issues'],
];

export default function OperationsDashboard({ state, onOpen, onInspect, onAction }) {
  const model = useMemo(() => buildOperations(state), [state]);
  const goTo = (event, id) => {
    const destination = document.getElementById(`ops-${id}`);
    if (!destination) return;
    event.preventDefault();
    destination.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    destination.focus({ preventScroll: true });
  };
  return <div className="ops-dashboard" aria-label="Network operations">
    <nav className="ops-section-nav" aria-label="Network operations sections">
      {sections.map(([id, label]) => <a key={id} href={`#ops-${id}`} onClick={event => goTo(event, id)}>{label}</a>)}
    </nav>
    <IncidentSection model={model} state={state} onOpen={onOpen} onInspect={onInspect} onAction={onAction}/>
    <WatchlistSection model={model} onInspect={onInspect} onOpen={onOpen}/>
    <ChangesSection model={model} onInspect={onInspect}/>
    <RecoverySection model={model} onInspect={onInspect} onOpen={onOpen}/>
    <MonitoringSection model={model} onInspect={onInspect} onOpen={onOpen}/>
    <ResolvedSection model={model} onInspect={onInspect} onOpen={onOpen}/>
    <RepeatIssuesSection model={model} onInspect={onInspect} onOpen={onOpen}/>
  </div>;
}
