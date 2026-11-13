// A current-watch event ledger. Hiding the duplicate landing alarm list must
// never silently discard an event that has no supported incident association.
// All records remain illustrative local sources; no collection service is used.
import { allAlarms, currentFrame, MAIN_ALARM, CRITICAL_ALARM, INTERFACE } from './model.js';
import { findDevice, domainLabel, groupLabel } from './scale.js';

const supportedCases = new Set(['interface', 'device', 'monitoring']);
const interfaceEvents = new Set([MAIN_ALARM, 'CNC-1043', 'CNC-1044']);
const text = value => typeof value === 'string' ? value.trim() : '';

function knownCase(id) {
  return interfaceEvents.has(id) ? 'interface' : id === CRITICAL_ALARM ? 'device' : null;
}

function eventTarget(event, id) {
  if (event.target && typeof event.target === 'object' && text(event.target.kind) && text(event.target.id)) {
    return { kind: event.target.kind, id: event.target.id };
  }
  if (id === 'CNC-1044') return { kind: 'interface', id: 'XR-P2:HundredGigE0/0/0/1' };
  if (interfaceEvents.has(id)) return { kind: 'interface', id: `XR-P1:${INTERFACE}` };
  if (id === CRITICAL_ALARM) return { kind: 'device', id: 'XR-PE-E2' };
  const device = text(event.deviceId) || text(event.router) || text(event.object) || text(event.target);
  if (device && findDevice(device)) return { kind: 'device', id: device };
  // Unknown source identity is retained, without fabricating a router target.
  return { kind: 'event', id };
}

function eventScope(event, target) {
  if (text(event.scope)) return event.scope;
  const deviceId = target.kind === 'interface' ? target.id.split(':')[0] : target.kind === 'device' ? target.id : null;
  const device = deviceId && findDevice(deviceId);
  return device ? `${domainLabel(device.domain)} / ${groupLabel(device.groupId)} / ${device.id}` : 'Scope not yet established';
}

function normalizeEvent(event, id, time) {
  const reason = text(event.dispositionReason) || text(event.suppressionReason) || text(event.reason);
  const expectedRequested = event.disposition === 'expected' || event.disposition === 'suppressed' || event.expected === true || event.suppressed === true;
  const explicitCase = text(event.caseId);
  // A supplied unsupported association must be investigated, not silently
  // converted into a supported case from a similarly named target.
  const caseId = explicitCase ? supportedCases.has(explicitCase) ? explicitCase : null : knownCase(id);
  let disposition, dispositionReason;
  if (expectedRequested && reason) {
    disposition = 'expected';
    dispositionReason = reason;
  } else if (expectedRequested) {
    disposition = 'investigating';
    dispositionReason = 'An expected-event reason is not recorded. CW AI is checking the event disposition.';
  } else if (caseId) {
    disposition = 'linked';
    dispositionReason = reason || (interfaceEvents.has(id)
      ? 'The recorded source associates this event with the CNC-1042 interface investigation.'
      : id === CRITICAL_ALARM
        ? 'Independent reachability evidence belongs to the router investigation.'
        : `The source explicitly associates this event with the ${caseId} investigation.`);
  } else {
    disposition = 'investigating';
    dispositionReason = reason || 'CW AI is correlating this source event with network evidence. No incident association or cause is established.';
  }
  const target = eventTarget(event, id);
  const active = event.active !== false;
  const detectedAt = text(event.detectedAt) || text(event.detected) || text(event.time) || time;
  const clearedAt = active ? null : text(event.clearedAt) || null;
  return {
    id,
    title: text(event.title) || 'Source event',
    severity: text(event.severity) || 'Unclassified',
    active,
    time: text(event.time) || clearedAt || detectedAt,
    detectedAt,
    clearedAt,
    source: text(event.source) || 'Controller alarm source',
    sourceState: active ? `${text(event.severity) || 'Unclassified'} · Active` : clearedAt ? 'Source-cleared' : 'Source-reported inactive',
    caseId: disposition === 'linked' ? caseId : null,
    target,
    scope: eventScope(event, target),
    disposition,
    dispositionReason,
    owner: 'CW AI',
    detail: text(event.detail),
  };
}

export function eventCoverage(state) {
  // Opening older evidence does not replace the landing page's current watch.
  const currentState = { ...state, history: null };
  const frame = currentFrame(currentState), time = frame.time;
  const sources = allAlarms(currentState).map(event => !event.active && interfaceEvents.has(event.id) && frame.index === 11
    ? { ...event, clearedAt: '08:30' } : event);
  const restoredDevice = currentState.agentic?.deviceRecord;
  if (!sources.some(event => event.id === CRITICAL_ALARM) && restoredDevice?.clearedAt) {
    sources.push({
      id: CRITICAL_ALARM, title: 'Device unreachable', severity: 'Critical', active: false,
      detectedAt: restoredDevice.startedAt, clearedAt: restoredDevice.clearedAt,
      source: 'Independent reachability checks', target: { kind: 'device', id: 'XR-PE-E2' },
    });
  }
  if (currentState.unclassifiedEvent) {
    sources.push({
      id: 'CNC-3110', title: 'Router event under correlation', severity: 'Minor', active: true,
      time, source: 'Syslog', target: { kind: 'device', id: 'XR-P3' },
      detail: 'A router event was received. CW AI is gathering its context; no cause or service impact has been established.',
    });
  }
  // The sourceEvents collection is already received evidence. Repeated IDs
  // update that event's record; they do not produce duplicate UI identities.
  const received = Array.isArray(currentState.sourceEvents) ? currentState.sourceEvents : [];
  const input = [...sources, ...received];
  const reservedIds = new Set(input.map(event => event && typeof event === 'object' ? text(event.id) : '').filter(Boolean));
  const indexed = new Map();
  input.forEach((event, index) => {
    if (!event || typeof event !== 'object') return;
    let id = text(event.id);
    if (!id) {
      id = `source-event-${index + 1}`;
      while (reservedIds.has(id) || indexed.has(id)) id += '-received';
    }
    indexed.set(id, { ...indexed.get(id), ...event });
  });
  const events = [...indexed].map(([id, event]) => normalizeEvent(event, id, time));
  return {
    events,
    linked: events.filter(event => event.disposition === 'linked'),
    pending: events.filter(event => event.disposition === 'investigating'),
    expected: events.filter(event => event.disposition === 'expected'),
    total: events.length,
    activeTotal: events.filter(event => event.active).length,
  };
}
