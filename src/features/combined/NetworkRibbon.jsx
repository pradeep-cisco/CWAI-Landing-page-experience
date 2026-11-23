import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import CombinedNetworkView, { CombinedNetworkSwitcher } from './CombinedNetworkView.jsx';
import pauseIcon from '../../../vendor/harbor-elements/dist/harbor-elements/icons/cohesion/svg/pause-circle.svg?raw';
import playIcon from '../../../vendor/harbor-elements/dist/harbor-elements/icons/cohesion/svg/play-circle.svg?raw';
import './network-ribbon.css';

const MOTION_ICONS = { pause: pauseIcon.replaceAll('#545454', 'currentColor'), play: playIcon.replaceAll('#545454', 'currentColor') };
const DESTINATIONS = [{ kind: 'cross-domain', label: 'Cross-domain' }, { kind: 'platform', label: 'Platform' }];
const focusNative = element => {
  if (typeof element?.setFocus === 'function') element.setFocus();
  else (element?.shadowRoot?.querySelector('button') || element)?.focus?.({ preventScroll: true });
};
const selectedDomainId = scope => scope?.kind === 'domain' ? scope.id : null;

function DomainDetails({ domain, connections, domains }) {
  const [groupId, setGroupId] = useState(null);
  const [routerId, setRouterId] = useState(null);
  const [interfaceId, setInterfaceId] = useState(null);
  const groupBreadcrumbRef = useRef(null), routerBreadcrumbRef = useRef(null), interfaceHeadingRef = useRef(null);
  const pendingHierarchyFocus = useRef(null);
  useEffect(() => { pendingHierarchyFocus.current = null; setGroupId(null); setRouterId(null); setInterfaceId(null); }, [domain.id]);
  useEffect(() => {
    const target = pendingHierarchyFocus.current;
    if (!target) return;
    pendingHierarchyFocus.current = null;
    const frame = requestAnimationFrame(() => {
      if (target === 'interface') interfaceHeadingRef.current?.focus({ preventScroll: true });
      else focusNative(target === 'router' ? routerBreadcrumbRef.current : groupBreadcrumbRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [groupId, routerId, interfaceId, domain.id]);
  const groups = domain.groups || [];
  const group = groups.find(item => item.id === groupId);
  const router = group?.routers?.find(item => item.id === routerId);
  const port = router?.interfaces?.find(item => item.id === interfaceId);
  const clearRouter = () => { setRouterId(null); setInterfaceId(null); };
  const connected = connections.filter(item => item.from === domain.id || item.to === domain.id);
  return <div className="combined-ribbon-detail">
    <nav className="combined-ribbon-breadcrumb" aria-label="Read-only network hierarchy">
      <hbr-button variant="text" size="small" onClick={() => { setGroupId(null); clearRouter(); }}>{domain.label}</hbr-button>
      {group && <><span aria-hidden="true">/</span><hbr-button ref={groupBreadcrumbRef} variant="text" size="small" onClick={clearRouter}>{group.label}</hbr-button></>}
      {router && <><span aria-hidden="true">/</span><hbr-button ref={routerBreadcrumbRef} variant="text" size="small" onClick={() => setInterfaceId(null)}>{router.label}</hbr-button></>}
      {port && <><span aria-hidden="true">/</span><span aria-current="page">{port.label}</span></>}
    </nav>
    <p className="combined-ribbon-detail-note">{domain.observation || 'No additional network observation supplied.'}</p>
    {port ? <><h4 ref={interfaceHeadingRef} tabIndex={-1}>Interface · {port.label}</h4><dl className="combined-ribbon-fields"><div><dt>Interface</dt><dd>{port.label}</dd></div><div><dt>Observation</dt><dd>{port.detail || 'No interface observation supplied.'}</dd></div></dl></> : <>
      <h4>{router ? 'Interfaces' : group ? 'Routers' : 'Device groups'}</h4>
      <div className="combined-ribbon-members">
        {(router?.interfaces || group?.routers || groups).map(item => <hbr-button key={item.id} size="small" variant="outline" onClick={() => {
          if (router) { pendingHierarchyFocus.current = 'interface'; setInterfaceId(item.id); }
          else if (group) { pendingHierarchyFocus.current = 'router'; setRouterId(item.id); setInterfaceId(null); }
          else { pendingHierarchyFocus.current = 'group'; setGroupId(item.id); clearRouter(); }
        }}><hbr-icon slot="prefix" name={router ? 'nav-connect' : group ? 'nav-network-wide' : 'folder'}/>{item.label}</hbr-button>)}
        {!(router?.interfaces || group?.routers || groups).length && <p>No resources supplied at this level.</p>}
      </div>
    </>}
    {!group && connected.length > 0 && <div className="combined-ribbon-relationships"><h4>Logical connections</h4><ul>{connected.map(connection => {
      const other = domains.find(item => item.id === (connection.from === domain.id ? connection.to : connection.from));
      return <li key={connection.id}>{other?.label || connection.from} <span>· {connection.label}</span></li>;
    })}</ul></div>}
    <p className="combined-ribbon-detail-note">Read-only context. This selection does not change a reviewed plan or its authorized scope.</p>
  </div>;
}

const NetworkRibbon = forwardRef(function NetworkRibbon({ network, expanded = false, alwaysExpanded = false, onExpandedChange, selectedScope, workScope, onSelectScope, onFilterScope, onClearSelection, onInspectIncident }, forwardedRef) {
  const detailed = alwaysExpanded || expanded;
  const [mode, setMode] = useState('world');
  const [connectionId, setConnectionId] = useState(null);
  const [showIncidentList, setShowIncidentList] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [motionVisible, setMotionVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const expandRef = useRef(null), headingRef = useRef(null), relatedWorkRef = useRef(null), incidentCueRef = useRef(null), endpointFocusPending = useRef(false);
  const titleId = `combined-network-${useId().replaceAll(':', '')}-title`;
  const domains = network?.domains || [];
  const connections = network?.connections || [];
  const activeIncidents = (network?.incidents || []).filter(incident => incident.state === 'active');
  const selectedDomain = domains.find(domain => domain.id === selectedDomainId(selectedScope));
  const selectedConnection = connections.find(connection => connection.id === connectionId);
  const scopeLabel = selectedDomain?.label || DESTINATIONS.find(destination => destination.kind === selectedScope?.kind)?.label;
  const sourceInterrupted = network?.sourceState !== 'current';
  const incidentsLastKnown = sourceInterrupted || activeIncidents.some(incident => incident.current === false);
  const selectScope = scope => { setConnectionId(null); onSelectScope?.(scope); };
  const selectEndpoint = id => { endpointFocusPending.current = true; selectScope({ kind: 'domain', id }); };
  useEffect(() => {
    if (!endpointFocusPending.current || connectionId || !selectedScope) return;
    endpointFocusPending.current = false;
    const frame = requestAnimationFrame(() => focusNative(relatedWorkRef.current));
    return () => cancelAnimationFrame(frame);
  }, [connectionId, selectedScope]);
  const toggleExpanded = () => { onExpandedChange?.(!expanded); focusNative(expandRef.current); };
  const focusContext = () => focusNative(alwaysExpanded ? headingRef.current : expandRef.current || headingRef.current);
  const clearHighlight = () => { onClearSelection?.(); focusContext(); };

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    update();
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return <section ref={forwardedRef} className="combined-ribbon" aria-labelledby={titleId} data-expanded={detailed} data-always-expanded={alwaysExpanded} data-source={sourceInterrupted ? 'last-known' : 'current'} data-network-presentation="operations"
    data-motion={motionEnabled ? 'enabled' : 'paused'} data-motion-visible={motionVisible && pageVisible}>
    <hbr-layout variant="dashboard:widgets:container"><hbr-card container col="full" class="wan-overview-surface">
      <div slot="header" className="combined-ribbon-heading">
        <div className="combined-ribbon-title"><hbr-text variant="section-title"><h2 ref={headingRef} className="combined-ribbon-focus" tabIndex={-1} id={titleId}>Network</h2></hbr-text>
          {activeIncidents.length > 0 && <hbr-button ref={incidentCueRef} size="small" variant="text" class="combined-ribbon-incident-cue"
            aria-label={`${activeIncidents.length} ${incidentsLastKnown ? 'last-known' : 'active'} incident${activeIncidents.length === 1 ? '' : 's'}. ${activeIncidents.length === 1 ? `Inspect ${activeIncidents[0].title || activeIncidents[0].id}` : 'Choose an incident to inspect'}.`}
            aria-expanded={activeIncidents.length > 1 || showIncidentList ? showIncidentList : undefined} aria-controls={activeIncidents.length > 1 || showIncidentList ? `${titleId}-incidents` : undefined}
            onClick={event => {
              if (activeIncidents.length === 1 && onInspectIncident) onInspectIncident(activeIncidents[0], event);
              else setShowIncidentList(value => !value);
            }}><hbr-icon slot="prefix" name="status-warning" sentiment="warning" size="14px"/>{activeIncidents.length} incident{activeIncidents.length === 1 ? '' : 's'}{incidentsLastKnown ? ' · Last known' : ''}</hbr-button>}
        </div>
        <div className="combined-ribbon-heading-controls">
          <CombinedNetworkSwitcher mode={mode} onModeChange={setMode}/>
          <hbr-tooltip content={motionEnabled ? 'Pause map motion' : 'Resume map motion'} placement="top" hoist>
            <hbr-button size="small" variant="text" arialabel={motionEnabled ? 'Pause map motion' : 'Resume map motion'} onClick={() => setMotionEnabled(value => !value)}>
              <hbr-icon asset={MOTION_ICONS[motionEnabled ? 'pause' : 'play']} size="14px" aria-hidden="true"/>
            </hbr-button>
          </hbr-tooltip>
          {!alwaysExpanded && <hbr-button ref={expandRef} class="combined-ribbon-expand" size="small" variant="text" aria-expanded={expanded} onClick={toggleExpanded}>{expanded ? 'Collapse network' : 'Expand network'}<hbr-icon slot="suffix" name={expanded ? 'caret-up' : 'caret-down'}/></hbr-button>}
        </div>
      </div>
      {showIncidentList && <section id={`${titleId}-incidents`} className="combined-ribbon-incidents" aria-label="Network incidents">
        <div className="combined-ribbon-incidents-heading"><h4>{activeIncidents.length ? incidentsLastKnown ? 'Last-known incidents' : 'Active incidents' : 'No active incidents'}</h4><hbr-button size="small" variant="text" aria-label="Close incident list" onClick={() => { setShowIncidentList(false); if (activeIncidents.length) focusNative(incidentCueRef.current); else focusContext(); }}><hbr-icon name="x"/></hbr-button></div>
        {activeIncidents.map(incident => <div key={incident.id} className="combined-ribbon-incident-row"><div><strong>{incident.title || incident.id}</strong><p>{[domains.find(domain => domain.id === incident.domainId)?.label || incident.domainId, incident.deviceId, incident.stage, incident.current === false ? 'Last-known state' : null].filter(Boolean).join(' · ')}</p></div><hbr-button size="small" variant="outline" onClick={event => onInspectIncident?.(incident, event)}>Inspect<hbr-icon slot="suffix" name="arrow-right"/></hbr-button></div>)}
      </section>}
      <CombinedNetworkView network={network} mode={mode} expanded={detailed} alwaysExpanded={alwaysExpanded} motionEnabled={motionEnabled} onViewportVisibilityChange={setMotionVisible} selectedScope={selectedScope} workScope={workScope} onSelectScope={selectScope} onSelectConnection={connection => setConnectionId(connection.id)}/>
      <div className="combined-ribbon-footer">
        <p className="combined-ribbon-source">{sourceInterrupted ? 'Last-known network · current observations unavailable' : network?.sourceLabel || 'Network observations'}{network?.lastConfirmed ? ` · ${network.lastConfirmed}` : ''}</p>
        <div className="combined-ribbon-destinations" role="group" aria-label="Other work scopes">{DESTINATIONS.map(destination => <hbr-button key={destination.kind} size="small" variant="text" aria-pressed={selectedScope?.kind === destination.kind} onClick={() => selectScope({ kind: destination.kind })}>{destination.label}{workScope?.kind === destination.kind && <span slot="suffix" className="combined-ribbon-work-dot" aria-label="Inspected work scope"/>}</hbr-button>)}</div>
      </div>
      {selectedConnection && <div className="combined-ribbon-connection" role="region" aria-label="Selected logical connection">
        <div><h4>{selectedConnection.label}</h4><p>Logical connectivity between the selected domains.</p></div>
        <div className="combined-ribbon-selection-actions"><hbr-button size="small" variant="text" onClick={() => selectEndpoint(selectedConnection.from)}>Select {domains.find(domain => domain.id === selectedConnection.from)?.label || selectedConnection.from}</hbr-button><hbr-button size="small" variant="text" onClick={() => selectEndpoint(selectedConnection.to)}>Select {domains.find(domain => domain.id === selectedConnection.to)?.label || selectedConnection.to}</hbr-button><hbr-button size="small" variant="text" aria-label="Close connection context" onClick={() => { setConnectionId(null); focusContext(); }}><hbr-icon name="x"/></hbr-button></div>
      </div>}
      {selectedScope && <div className="combined-ribbon-selection"><strong>{scopeLabel || 'Selected scope'}</strong><div className="combined-ribbon-selection-actions"><hbr-button ref={relatedWorkRef} variant="outline" size="small" onClick={() => onFilterScope?.(selectedScope)}>View related work</hbr-button><hbr-button variant="text" size="small" onClick={clearHighlight}>Clear highlight</hbr-button></div></div>}
      {detailed && selectedDomain && <DomainDetails domain={selectedDomain} connections={connections} domains={domains}/>}
      {detailed && selectedScope?.kind === 'cross-domain' && <p className="combined-ribbon-detail-note">Cross-domain work spans more than one domain.</p>}
      {detailed && selectedScope?.kind === 'platform' && <p className="combined-ribbon-detail-note">Platform work concerns shared capabilities and sources.</p>}
    </hbr-card></hbr-layout>
  </section>;
});

export default NetworkRibbon;
