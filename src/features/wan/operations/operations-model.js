// Read-only projection for the lower operational dashboard. The live incident
// uses the existing controller story. Configuration, maintenance and archived
// evidence below are separate, explicitly recorded illustrative sources; they
// never authorize a controller change or establish recovery of CNC-1042.
import {
  FRAMES, INTERFACE, MAIN_ALARM, THRESHOLD, currentFrame, observations,
} from '../model/model.js';
import { agentResponse } from '../model/agentic-model.js';
import { networkWatch } from '../watch-model.js';
import {
  DOMAINS, MONITORING_CONTEXT, domainLabel, groupLabel, findDevice,
} from '../model/scale.js';

const historyPoints = [
  { time: '06:10', value: 88 }, { time: '06:20', value: 92 },
  { time: '06:30', value: 86 }, { time: '06:35', value: 56 },
  { time: '06:40', value: 52 },
];

function currentSamples(state, observation) {
  const samples = FRAMES.slice(0, state.frame + 1)
    .filter(frame => frame.time <= observation.observedAt)
    .map(frame => ({ time: frame.time, value: frame.utilization, fresh: observation.fresh }));
  // The 07:50 last-known sample is an existing source observation, not a value
  // interpolated from the later story. In particular, do not invent 08:30 data.
  return samples.length ? samples : [{
    time: observation.observedAt, value: observation.utilization, fresh: observation.fresh,
  }];
}

function configurationSource(state, time) {
  const router = findDevice('XR-P5');
  const domainId = router?.domain || MONITORING_CONTEXT.transitDomain;
  const hasDrift = state.operations?.drift ?? state.frame >= 4;
  const intended = [
    { key: 'hostname', value: 'XR-P5' },
    { key: 'interface', value: 'Loopback0' },
    { key: 'description', value: 'CONTROL-LOOPBACK' },
    { key: 'ipv4 address', value: router?.address || 'Not available' },
  ];
  const observed = intended.map(field => ({
    ...field,
    value: field.key === 'description' && hasDrift ? 'CONTROL-LOOPBACK-OLD' : field.value,
  }));
  const overridden = typeof state.operations?.drift === 'boolean';
  const observedAt = overridden ? time : hasDrift ? '08:03' : '07:55';
  return {
    baseline: 'XR-BASE-23', baselineTime: '07:45', time: observedAt, hasDrift,
    router: 'XR-P5', domainId, domain: domainLabel(domainId),
    group: groupLabel(router?.groupId), groupId: router?.groupId,
    intended, observed,
    finding: hasDrift ? 'Loopback description differs from intended state'
      : 'Observed configuration matches the intended baseline',
    impact: hasDrift ? 'Description-only difference. A forwarding effect has not been established.'
      : 'The compared fields match XR-BASE-23.',
    relatedIncident: null,
    source: 'Configuration observations',
    sourceRecord: hasDrift ? 'CONFIG-0803' : 'CONFIG-0755',
    provenance: 'Separate illustrative configuration source; no causal relationship to CNC-1042 is established.',
    maintenance: {
      id: 'CHG-0900', window: '09:00–09:15', scope: 'XR-P4', status: 'Scheduled',
      source: 'Declared maintenance record · CHG-0900',
      expected: ['Only XR-P4 is included in the declared scope.', 'Unexpected conditions outside that scope remain actionable.'],
      checks: [
        { label: 'Confirm declared scope before execution', status: 'pending' },
        { label: 'Confirm post-change reachability', status: 'pending' },
        { label: 'Confirm current telemetry after the change', status: 'pending' },
      ],
    },
  };
}

function monitoringSources(state, time, observation) {
  return DOMAINS.map(domain => {
    const westGap = state.gap === 'west'
      && [MONITORING_CONTEXT.mainDomain, MONITORING_CONTEXT.transitDomain].includes(domain.id);
    const eastGap = state.gap === 'east' && domain.id === MONITORING_CONTEXT.criticalDomain;
    const delayed = westGap || eastGap;
    const lastObserved = westGap ? observation.observedAt : eastGap ? '07:50' : time;
    const scope = westGap ? domain.id === MONITORING_CONTEXT.mainDomain
      ? 'XR-P1 interface metrics' : 'XR-P2 interface metrics'
      : eastGap ? `${domain.label} device telemetry` : `${domain.label} telemetry`;
    const sourceHistory = (lastTime, gap) => {
      const points = FRAMES.slice(0, state.frame + 1)
        .map(frame => ({ time: frame.time, status: gap && frame.time > lastTime ? 'delayed' : 'current' }));
      if (lastTime < FRAMES[0].time) points.unshift({ time: lastTime, status: 'current' });
      return points;
    };
    return {
      id: domain.id, domain: domain.label,
      sources: [
        {
          id: 'telemetry', label: 'Telemetry', status: delayed ? 'delayed' : 'current',
          time: lastObserved, scope,
          value: delayed ? 'Current collection unavailable' : 'Current source observations',
          partial: Boolean(westGap),
          observations: sourceHistory(lastObserved, delayed),
        },
        {
          id: 'reachability', label: 'Reachability', status: 'current', time,
          scope: `${domain.label} independent reachability checks`,
          value: state.critical && domain.id === MONITORING_CONTEXT.criticalDomain
            ? 'XR-PE-E2 unreachable' : 'Routers reachable',
          observations: sourceHistory(time, false),
        },
        {
          id: 'topology', label: 'Topology', status: 'current', time,
          scope: `${domain.label} BGP-LS topology`, value: 'Current topology snapshot',
          observations: sourceHistory(time, false),
        },
      ],
    };
  });
}

function episodeRecords(state, scope, samples, observation, response) {
  const archived = {
    id: 'CNC-0991', title: 'Interface congestion', domainId: scope.domainId,
    domain: scope.domain, router: scope.router, interface: scope.interface,
    detected: '06:10', recovered: '06:40', peak: 92, after: 52, verified: true,
    source: 'Archived observations · VERIFY-0640', sourceRecord: 'VERIFY-0640',
    current: false, status: 'Verified',
    points: historyPoints.map(point => ({ ...point })),
    beforePoints: historyPoints.slice(0, 3).map(point => ({ ...point })),
    afterPoints: historyPoints.slice(3).map(point => ({ ...point })),
    verificationWindow: { from: '06:35', to: '06:40', minutes: 5 },
    job: { id: 'RUN-016', status: 'completed', completedAt: '06:34' },
    criteria: [
      { label: 'Archived interface observations current', met: true },
      { label: 'Utilization below 80%', met: true },
      { label: 'Stable 06:35–06:40 without collection gaps', met: true },
      { label: 'Source alarm cleared at 06:35', met: true },
    ],
    provenance: 'Recorded illustrative earlier-shift verification, independent of the current response.',
  };
  if (state.frame < 2) return [archived];
  const current = {
    id: MAIN_ALARM, title: 'Interface congestion', domainId: scope.domainId,
    domain: scope.domain, router: scope.router, interface: scope.interface,
    detected: '08:00', recovered: response.resolved ? '08:35' : null,
    peak: Math.max(...samples.map(point => point.value)),
    after: response.resolved ? observation.utilization : null,
    verified: response.resolved, source: 'Current interface observations · CNC-1042',
    sourceRecord: MAIN_ALARM, current: true,
    status: response.resolved ? 'Verified' : response.stage,
    points: samples.map(point => ({ time: point.time, value: point.value })),
    beforePoints: samples.filter(point => point.time < '08:30').map(point => ({ time: point.time, value: point.value })),
    afterPoints: response.resolved ? samples.filter(point => point.time >= '08:30').map(point => ({ time: point.time, value: point.value })) : [],
    verificationWindow: response.resolved ? { from: '08:30', to: '08:35', minutes: 5 } : null,
    job: { ...response.job, steps: response.job.steps.map(step => ({ ...step })) },
    criteria: response.criteria.map(criterion => ({ ...criterion })),
    provenance: 'Existing controller snapshots and independently evaluated response criteria.',
  };
  return [archived, current];
}

export function buildOperations(input) {
  // This is the current landing watch, even while an evidence dialog is
  // inspecting an older observation. Reading this model cannot change input.
  const state = { ...input, history: null };
  const frame = currentFrame(state), observation = observations(state);
  const router = findDevice('XR-P1');
  const domainId = router?.domain || MONITORING_CONTEXT.mainDomain;
  const groupId = router?.groupId || MONITORING_CONTEXT.mainGroup;
  const scope = {
    domainId, domain: domainLabel(domainId), groupId, group: groupLabel(groupId),
    router: 'XR-P1', peer: 'XR-P2', interface: INTERFACE, interfaceId: `XR-P1:${INTERFACE}`,
  };
  const response = agentResponse(state, 'interface');
  const samples = currentSamples(state, observation);
  const episodes = episodeRecords(state, scope, samples, observation, response);
  return {
    time: frame.time, frame: frame.index, scope, observation, threshold: THRESHOLD,
    response, watch: networkWatch(state), samples, criteria: response.criteria,
    changes: configurationSource(state, frame.time),
    monitoring: monitoringSources(state, frame.time, observation),
    episodes, resolved: episodes.filter(episode => episode.verified),
    recovery: {
      verified: response.resolved,
      status: response.resolved ? 'verified'
        : ['failed', 'unknown'].includes(response.job.status) ? 'unconfirmed'
          : !observation.fresh ? 'waiting-for-data'
            : response.job.status === 'completed' ? 'verifying'
              : response.job.id ? 'executing' : 'not-started',
      job: response.job.status,
      stableMinutes: observation.fresh ? observation.stableMinutes : 0,
      observationWindow: state.frame === 11 && observation.fresh
        ? { from: '08:30', to: '08:35', source: 'Recorded stability verification' } : null,
    },
  };
}
