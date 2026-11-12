import { useState } from 'react';
import { activeAlarms, observations, frameAt, MAIN_ALARM, TARGET, THRESHOLD } from './model/model.js';
import {
  ACTIVE_WAN, BUNDLES, GROUP_BUNDLES, findDevice, findInterface, findLink,
  domainLabel, groupLabel, deviceInterfaces, deviceLinks, bundleLinks,
  groupBundleLinks, alarmDevice, telemetryCurrent, deviceReachable, linkUtilization, paged,
} from './model/scale.js';
import './evidence-modal.css';

const INTERFACE_ALARM_ROUTERS = new Map([[MAIN_ALARM, 'XR-P1'], ['CNC-1043', 'XR-P1'], ['CNC-1044', 'XR-P2']]);
const number = (value) => value.toLocaleString('en-US');

function sourceSnapshot(state) {
  const historical = state.history !== null && state.history !== undefined;
  const frame = frameAt(historical ? state.history : state.frame);
  const acknowledgements = historical
    ? Object.fromEntries(Object.entries(state.acknowledgements || {}).filter(([, record]) => record.time <= frame.time))
    : state.acknowledgements;
  // The current Critical flag describes the live router. Historical source
  // evidence can include it only once its recorded detection time has arrived.
  const critical = state.critical && state.criticalDetected <= frame.time;
  return { historical, frame, sourceState: historical ? { ...state, frame: frame.index, critical, acknowledgements } : state };
}

function interfaceEvidence(state, port) {
  const snapshot = sourceSnapshot(state);
  const device = findDevice(port.device);
  const link = findLink(port.linkId);
  const observation = port.linkId === TARGET ? observations(state, snapshot.historical) : null;
  const fresh = !!device && (snapshot.historical || (observation ? observation.fresh : telemetryCurrent(state, device)));
  return {
    ...snapshot, device, link, fresh,
    observedAt: observation?.observedAt || (fresh ? snapshot.frame.time : state.gap === 'west' ? observations(state).observedAt : '07:50'),
    utilization: observation ? observation.utilization : link ? linkUtilization(snapshot.sourceState, link) : null,
    alarms: port.linkId === TARGET ? activeAlarms(snapshot.sourceState).filter((alarm) => alarm.object === TARGET && INTERFACE_ALARM_ROUTERS.get(alarm.id) === port.device) : [],
    reachable: device ? deviceReachable(snapshot.sourceState, device.id) : null,
  };
}

function linkEvidence(state, link) {
  const snapshot = sourceSnapshot(state);
  const observation = link.id === TARGET ? observations(state, snapshot.historical) : null;
  const fresh = snapshot.historical || (observation ? observation.fresh : [link.from, link.to].every((id) => {
    const device = findDevice(id);
    return device && telemetryCurrent(state, device);
  }));
  return {
    ...snapshot, fresh,
    utilization: observation ? observation.utilization : linkUtilization(snapshot.sourceState, link),
    observedAt: observation?.observedAt || (fresh ? snapshot.frame.time : state.gap === 'west' ? observations(state).observedAt : '07:50'),
  };
}

const quality = (evidence) => evidence.historical ? 'Historical' : evidence.fresh ? 'Current' : 'Last known';
const metric = (value) => value === null ? 'Unavailable' : `${value}%`;

function Heading({ children }) {
  return <hbr-text variant="sub-section-title">{children}</hbr-text>;
}

function Record({ entries }) {
  return (
    <hbr-key-value-pairs direction="column" size="sm">
      <dl>{entries.flatMap(([label, value]) => [<dt key={`${label}-key`}>{label}</dt>, <dd key={`${label}-value`}>{value}</dd>])}</dl>
    </hbr-key-value-pairs>
  );
}

function SourceTag({ evidence }) {
  return <hbr-tag size="small" sentiment={evidence.historical || !evidence.fresh ? 'inactive' : 'info'}>{quality(evidence)} · {evidence.observedAt}</hbr-tag>;
}

function AlarmList({ alarms, empty = 'No active source alarm is associated with this selection in this snapshot.' }) {
  return alarms.length ? (
    <div className="wan-evidence-list">
      {alarms.map((alarm) => (
        <article className="wan-evidence-item" key={alarm.id}>
          <div className="wan-evidence-row">
            <hbr-text weight="semibold">{alarm.id} · {alarm.title}</hbr-text>
            <hbr-tag size="small" sentiment={alarm.severity === 'Critical' ? 'negative' : alarm.severity === 'Major' ? 'warning' : 'low-warning'}>{alarm.severity} · Active</hbr-tag>
          </div>
          <hbr-text type="secondary" size="xs">Detected {alarm.detected} · {alarm.acknowledged ? `Acknowledged by ${alarm.ack?.actor || 'operator'} at ${alarm.ack?.time || 'unavailable time'}` : 'Unacknowledged'}</hbr-text>
        </article>
      ))}
    </div>
  ) : <hbr-text type="secondary">{empty}</hbr-text>;
}

function Pager({ result, noun, onPage }) {
  return (
    <div className="wan-evidence-pagination">
      <hbr-text type="secondary" size="xs">{number(result.start)}–{number(result.end)} of {number(result.total)} {noun}</hbr-text>
      {result.pages > 1 && <div className="wan-evidence-row">
        <hbr-button variant="text" size="small" disabled={result.page === 0} onClick={() => onPage(result.page - 1)} aria={{ label: `Previous ${noun}` }}>Previous</hbr-button>
        <hbr-text size="xs">{result.page + 1} / {result.pages}</hbr-text>
        <hbr-button variant="text" size="small" disabled={result.page === result.pages - 1} onClick={() => onPage(result.page + 1)} aria={{ label: `Next ${noun}` }}>Next</hbr-button>
      </div>}
    </div>
  );
}

function DeviceEvidence({ state, id, onInspect }) {
  const [page, setPage] = useState(0);
  const device = findDevice(id);
  if (!device) return <Unavailable kind="router" />;
  const snapshot = sourceSnapshot(state);
  const fresh = snapshot.historical || telemetryCurrent(state, device);
  const reachable = deviceReachable(snapshot.sourceState, id);
  const alarms = activeAlarms(snapshot.sourceState).filter((alarm) => alarmDevice(alarm)?.id === id);
  const interfaces = paged(deviceInterfaces(id), page, 6);
  return (
    <hbr-layout direction="column" gap="xl">
      <div className="wan-evidence-row">
        <hbr-tag size="small" sentiment={reachable ? 'positive' : 'negative'}>{reachable ? 'Reachable' : 'Unreachable'}</hbr-tag>
        <hbr-tag size="small" sentiment={fresh && !snapshot.historical ? 'info' : 'inactive'}>{snapshot.historical ? 'Historical sources' : fresh ? 'Telemetry current' : 'Telemetry unavailable'}</hbr-tag>
      </div>
      <Record entries={[
        ['Router', device.id], ['Management address', device.address], ['Platform', `${device.kind} · ${device.os}`],
        ['Domain', domainLabel(device.domain)], ['Device group', groupLabel(device.groupId)],
        ['Reachability source', `Independent reachability checks · ${snapshot.frame.time}`],
        ['Logical topology', `BGP-LS topology snapshot · ${snapshot.frame.time}`],
      ]} />
      {!reachable && <hbr-text>A device reachability alarm does not establish an interface fault or a physical link-down condition.</hbr-text>}
      <hbr-layout direction="column" gap="md">
        <Heading>Router source alarms</Heading>
        <AlarmList alarms={alarms} />
      </hbr-layout>
      <hbr-layout direction="column" gap="md">
        <Heading>Interfaces</Heading>
        <hbr-text type="secondary" size="xs">Inspect each interface's exact peer, source observation, and associated alarms.</hbr-text>
        <div className="wan-evidence-list">
          {interfaces.items.map((port) => {
            const evidence = interfaceEvidence(state, port);
            return <article className="wan-evidence-item" key={port.id}>
              <div className="wan-evidence-row">
                <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'interface', id: port.id })} aria={{ label: `Inspect ${port.device} interface ${port.name}` }}>{port.name}</hbr-button>
                <hbr-text weight="semibold">{metric(evidence.utilization)}{!evidence.fresh ? ' last known' : ''}</hbr-text>
              </div>
              <hbr-text type="secondary" size="xs">Peer {port.peer} · {port.peerInterface}</hbr-text>
              <div className="wan-evidence-row">
                <hbr-text size="xs">{evidence.alarms.length ? `${evidence.alarms.length} active interface alarm${evidence.alarms.length === 1 ? '' : 's'}` : evidence.fresh ? 'Reported up' : 'Current state unknown'}</hbr-text>
                <SourceTag evidence={evidence} />
              </div>
            </article>;
          })}
        </div>
        <Pager result={interfaces} noun="interfaces" onPage={setPage} />
        <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'connections', level: 'device', id })}>Inspect {deviceLinks(id).length} physical connections</hbr-button>
      </hbr-layout>
    </hbr-layout>
  );
}

function InterfaceEvidence({ state, id, onInspect }) {
  const port = findInterface(id);
  if (!port) return <Unavailable kind="interface" />;
  const evidence = interfaceEvidence(state, port);
  const target = port.linkId === TARGET;
  const local = target && port.device === 'XR-P1';
  return (
    <hbr-layout direction="column" gap="xl">
      <div className="wan-evidence-row">
        <hbr-tag size="small" sentiment={evidence.fresh ? 'positive' : 'inactive'}>{evidence.fresh ? 'Reported up' : 'Current state unknown'}</hbr-tag>
        <SourceTag evidence={evidence} />
      </div>
      <hbr-layout direction="column" gap="sm">
        <hbr-text type="number" size="lg" weight="bold">{metric(evidence.utilization)}</hbr-text>
        <hbr-text>{!evidence.fresh ? 'Last-known ' : ''}{local ? 'outbound utilization' : target ? 'link utilization · reported at XR-P1' : 'link utilization'}</hbr-text>
        {local && <hbr-text type="secondary" size="xs">100 Gbps · Configured alarm threshold: {THRESHOLD}%</hbr-text>}
        {!evidence.fresh && <hbr-text>Current interface observations are unavailable. The last observation at {evidence.observedAt} does not establish the current condition.</hbr-text>}
      </hbr-layout>
      <Record entries={[
        ['Router', port.device], ['Interface', port.name], ['Peer router', port.peer], ['Peer interface', port.peerInterface],
        ['Domain', domainLabel(port.domain)], ['Device group', groupLabel(port.groupId)], ['Physical link', port.linkId],
        ['Interface source', `${evidence.historical ? 'Historical interface telemetry snapshot' : 'Interface telemetry snapshot'} · ${evidence.observedAt}`],
        ['Logical topology', `Adjacency present · ${evidence.frame.time}`],
        ['Router reachability', `${evidence.reachable ? 'Reachable' : 'Unreachable'} · Independent checks · ${evidence.frame.time}`],
      ]} />
      {target && !local && <hbr-text type="secondary">The utilization reading is reported at XR-P1. It does not establish a local XR-P2 outbound counter.</hbr-text>}
      {evidence.reachable === false && <hbr-text>The independent router reachability alarm does not establish a physical interface fault or link-down condition.</hbr-text>}
      <hbr-layout direction="column" gap="md">
        <Heading>Associated interface alarms</Heading>
        <AlarmList alarms={evidence.alarms} empty="No active source alarm is associated with this router and interface in this snapshot." />
        <hbr-text type="secondary" size="xs">Alarm association uses the emitting router and this exact interface. Device alarms and peer interface alarms remain separate.</hbr-text>
      </hbr-layout>
      <div className="wan-evidence-row">
        <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'device', id: port.device })}>Inspect router</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'link', id: port.linkId })}>Inspect physical link</hbr-button>
        <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'interface', id: `${port.peer}:${port.peerInterface}` })}>Inspect peer interface</hbr-button>
      </div>
    </hbr-layout>
  );
}

function LinkEvidence({ state, id, onInspect }) {
  const link = findLink(id);
  if (!link) return <Unavailable kind="physical link" />;
  const evidence = linkEvidence(state, link);
  const alarms = activeAlarms(evidence.sourceState).filter((alarm) => alarm.object === id);
  return (
    <hbr-layout direction="column" gap="xl">
      <div className="wan-evidence-row"><hbr-text weight="semibold">{metric(evidence.utilization)} utilization{!evidence.fresh ? ' · Last known' : ''}</hbr-text><SourceTag evidence={evidence} /></div>
      <hbr-text type="secondary">{link.id === TARGET ? 'The utilization source is the XR-P1 outbound interface observation.' : 'Illustrative link telemetry snapshot.'} Logical adjacency, interface telemetry, and router reachability remain separate sources.</hbr-text>
      {!evidence.fresh && <hbr-text>Current observations are unavailable. Last-known utilization cannot establish current network recovery or physical link state.</hbr-text>}
      <Record entries={[
        ['Physical link', link.id], ['Endpoint A', `${link.from} · ${link.fromInterface}`], ['Endpoint B', `${link.to} · ${link.toInterface}`],
        ['Logical topology', `Adjacency present · ${evidence.frame.time}`], ['Observation', `${quality(evidence)} · ${evidence.observedAt}`],
      ]} />
      <hbr-layout direction="column" gap="md">
        <Heading>Endpoint evidence</Heading>
        {[['A', link.from, link.fromInterface], ['B', link.to, link.toInterface]].map(([label, device, name]) => <hbr-button key={label} variant="text" size="small" onClick={() => onInspect?.({ kind: 'interface', id: `${device}:${name}` })}>Inspect {device} · {name}</hbr-button>)}
      </hbr-layout>
      <hbr-layout direction="column" gap="md"><Heading>Source alarms on this link</Heading><AlarmList alarms={alarms} /></hbr-layout>
    </hbr-layout>
  );
}

function ConnectionsEvidence({ state, selection, onInspect }) {
  const [page, setPage] = useState(0);
  const links = selection.level === 'device' ? deviceLinks(selection.id) : selection.level === 'group' ? groupBundleLinks(selection.id) : bundleLinks(selection.id);
  const bundle = (selection.level === 'group' ? GROUP_BUNDLES : BUNDLES).find((item) => item.id === selection.id);
  const label = selection.level === 'device' ? selection.id : bundle ? `${selection.level === 'group' ? groupLabel(bundle.from) : domainLabel(bundle.from)} ↔ ${selection.level === 'group' ? groupLabel(bundle.to) : domainLabel(bundle.to)}` : selection.id;
  const result = paged(links, page, 10);
  return (
    <hbr-layout direction="column" gap="md">
      <hbr-text weight="semibold">{label}</hbr-text>
      <hbr-text type="secondary">{number(links.length)} actual physical member links. Each entry retains both router interface endpoints.</hbr-text>
      <div className="wan-evidence-list">
        {result.items.map((link) => {
          const evidence = linkEvidence(state, link);
          return <article className="wan-evidence-item" key={link.id}>
            <div className="wan-evidence-row">
              <hbr-button variant="text" size="small" onClick={() => onInspect?.({ kind: 'link', id: link.id })}>{link.id}</hbr-button>
              <hbr-text size="xs">{metric(evidence.utilization)}{!evidence.fresh ? ' last known' : ''}</hbr-text>
            </div>
            <hbr-text size="xs">{link.from} · {link.fromInterface} ↔ {link.to} · {link.toInterface}</hbr-text>
            <SourceTag evidence={evidence} />
          </article>;
        })}
      </div>
      {!links.length && <hbr-text>No physical members are present for this selection in the active WAN inventory.</hbr-text>}
      <Pager result={result} noun="links" onPage={setPage} />
    </hbr-layout>
  );
}

function Unavailable({ kind }) {
  return <hbr-text>This {kind} is unavailable in the selected WAN inventory.</hbr-text>;
}

export default function EvidenceModal({ state, selection, onClose, onInspect }) {
  if (!selection) return null;
  const labels = { device: 'Router evidence', interface: 'Interface evidence', link: 'Physical link evidence', connections: 'Connection members' };
  const key = `${ACTIVE_WAN.id}:${selection.kind}:${selection.level || ''}:${selection.id}`;
  return (
    <hbr-modal
      className="wan-evidence-modal"
      label={`${labels[selection.kind] || 'Source evidence'} · ${selection.id}`}
      size="medium"
      open={true}
      scrollAware={true}
      enablePopover={true}
      onhbr-after-hide={(event) => { if (event.target === event.currentTarget) onClose?.(); }}
    >
      <hbr-layout direction="column" gap="xl" className="wan-evidence-content">
        <hbr-text type="secondary" size="xs">{ACTIVE_WAN.label} · {sourceSnapshot(state).historical ? 'Historical source snapshot' : 'Read-only source evidence'}</hbr-text>
        {selection.kind === 'device' && <DeviceEvidence key={key} state={state} id={selection.id} onInspect={onInspect} />}
        {selection.kind === 'interface' && <InterfaceEvidence key={key} state={state} id={selection.id} onInspect={onInspect} />}
        {selection.kind === 'link' && <LinkEvidence key={key} state={state} id={selection.id} onInspect={onInspect} />}
        {selection.kind === 'connections' && <ConnectionsEvidence key={key} state={state} selection={selection} onInspect={onInspect} />}
      </hbr-layout>
      <div slot="footer" className="wan-evidence-footer"><hbr-button variant="outline" onClick={onClose}>Close</hbr-button></div>
    </hbr-modal>
  );
}
