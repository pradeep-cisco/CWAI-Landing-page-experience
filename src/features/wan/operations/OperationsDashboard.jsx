import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { eventCoverage } from '../model/event-accounting.js';
import { buildOperations } from './operations-model.js';
import { IncidentSection, WatchlistSection } from './SituationSections.jsx';
import { ChangesSection, DataHealthSummary, RecentSection } from './EvidenceSections.jsx';
import './operations.css';

const sections = [
  ['incidents', 'Incidents'], ['watchlist', 'Watchlist'], ['changes', 'Changes'],
  ['recent', 'Recent'],
];
const sectionFromHash = hash => sections.find(([id]) => hash === `#ops-${id}`)?.[0];

export default function OperationsDashboard({ state, onOpen, onInspect, onAction }) {
  const model = useMemo(() => buildOperations(state), [state]);
  const tabs = useRef(null);
  const [activeSection, setActiveSection] = useState(() => typeof window !== 'undefined' ? sectionFromHash(window.location.hash) || 'incidents' : 'incidents');
  const [requestedIncident, setRequestedIncident] = useState(null);
  const contextKey = `${model.scope.domainId}:${model.scope.groupId}`;
  const counts = {
    incidents: model.watch.incidents.length,
    watchlist: eventCoverage(state).pending.length + Number(model.frame === 1 && model.observation.fresh),
    changes: Number(model.changes.hasDrift),
    recent: model.outcomes.filter(item => item.verified || item.completed).length,
  };
  const countLabels = { incidents: 'active incidents', watchlist: 'developing conditions or events under correlation', changes: 'configuration differences', recent: 'retained outcomes' };
  const focusSection = useCallback(async id => {
    setActiveSection(id);
    // Use the native API as well as React state so keyboard and programmatic
    // navigation keep the component's internal selected tab in sync.
    await tabs.current?.show(id);
    const destination = document.getElementById(`ops-${id}`);
    if (!destination) return;
    destination.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    destination.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const followHash = () => {
      const section = sectionFromHash(window.location.hash);
      if (section) focusSection(section);
    };
    window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, [focusSection]);
  const followSectionLink = event => {
    const anchor = event.target.closest?.('a[href^="#ops-"]');
    const section = sectionFromHash(anchor?.getAttribute('href'));
    if (!section || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    focusSection(section);
  };
  const changeSection = event => {
    // Incident and Changes contain their own secondary tab groups.
    if (event.target !== event.currentTarget || !sections.some(([id]) => id === event.detail?.name)) return;
    setActiveSection(event.detail.name);
  };
  const reviewIncident = (view = 'overview') => {
    setRequestedIncident(previous => ({ id: 'interface', view, contextKey, token: (previous?.token || 0) + 1 }));
    focusSection('incidents');
  };
  return <div className="ops-dashboard" aria-label="Network operations" onClickCapture={followSectionLink}>
    <DataHealthSummary key={`health:${contextKey}`} model={model} onInspect={onInspect} onOpen={onOpen}/>
    <hbr-tab-group ref={tabs} primary class="ops-tabs" aria-label="Network operations views" onhbr-tab-show={changeSection}>
      {sections.map(([id, label]) => <hbr-tab key={id} slot="nav" panel={id} active={activeSection === id}>
        {label}{counts[id] > 0 && <hbr-badge slot="suffix" pill size="small" sentiment={id === 'incidents' ? model.watch.incidents.some(item => item.severity === 'Critical') ? 'danger' : 'warning' : 'neutral'} aria-label={`${counts[id]} ${countLabels[id]}`}>{counts[id]}</hbr-badge>}
      </hbr-tab>)}
      <hbr-tab-panel name="incidents" active={activeSection === 'incidents'}>
        <IncidentSection key={`incidents:${contextKey}`} model={model} state={state} requestedIncident={requestedIncident} onOpen={onOpen} onInspect={onInspect} onAction={onAction}/>
      </hbr-tab-panel>
      <hbr-tab-panel name="watchlist" active={activeSection === 'watchlist'}>
        <WatchlistSection key={`watchlist:${contextKey}`} state={state} model={model} onInspect={onInspect} onOpen={onOpen} onReviewIncident={reviewIncident}/>
      </hbr-tab-panel>
      <hbr-tab-panel name="changes" active={activeSection === 'changes'}>
        <ChangesSection model={model} onInspect={onInspect}/>
      </hbr-tab-panel>
      <hbr-tab-panel name="recent" active={activeSection === 'recent'}>
        <RecentSection key={`recent:${contextKey}`} model={model} onOpen={onOpen}/>
      </hbr-tab-panel>
    </hbr-tab-group>
  </div>;
}
