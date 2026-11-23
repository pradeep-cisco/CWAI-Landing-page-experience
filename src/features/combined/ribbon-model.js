/**
 * Standalone illustrative network observations for the Combined exploration.
 * This topology is logical, not geographic, and is independent of job state.
 * It intentionally does not import or mutate the Operations WAN fixtures.
 */

export const NETWORK_SCOPE_DESTINATIONS = Object.freeze([
  Object.freeze({ id: 'cross-domain', kind: 'cross-domain', label: 'Cross-domain' }),
  Object.freeze({ id: 'platform', kind: 'platform', label: 'Platform' }),
]);

const DOMAIN_FIXTURES = [
  { id: 'West', x: 12, y: 50, groupId: 'DG-WEST-01', groupLabel: 'West aggregation', router: 'XR-R12', port: 'HundredGigE0/0/0/0' },
  { id: 'Core', x: 40, y: 50, groupId: 'DG-CORE-01', groupLabel: 'Core exchange', router: 'XR-R07', port: 'HundredGigE0/0/0/1' },
  { id: 'East', x: 78, y: 50, groupId: 'DG-EAST-01', groupLabel: 'Metro East', router: 'XR-R19', port: 'HundredGigE0/0/0/0' },
  { id: 'North', x: 54, y: 16, groupId: 'DG-NORTH-01', groupLabel: 'North aggregation', router: 'XR-R21', port: 'HundredGigE0/0/0/0' },
  { id: 'South', x: 30, y: 84, groupId: 'DG-SOUTH-01', groupLabel: 'South aggregation', router: 'XR-R23', port: 'HundredGigE0/0/0/0' },
  { id: 'Metro', x: 84, y: 84, groupId: 'DG-METRO-01', groupLabel: 'Metro transport', router: 'XR-R31', port: 'HundredGigE0/0/0/0' },
];

// Edges describe declared logical connectivity, not measured link condition.
const CONNECTION_FIXTURES = [
  { id: 'West-Core', from: 'West', to: 'Core', label: 'West–Core logical connection' },
  { id: 'Core-East', from: 'Core', to: 'East', label: 'Core–East logical connection' },
  { id: 'Core-North', from: 'Core', to: 'North', label: 'Core–North logical connection' },
  { id: 'Core-South', from: 'Core', to: 'South', label: 'Core–South logical connection' },
  { id: 'East-Metro', from: 'East', to: 'Metro', label: 'East–Metro logical connection' },
  { id: 'South-Metro', from: 'South', to: 'Metro', label: 'South–Metro logical connection' },
];

const WORK_SCOPE_FIXTURES = {
  'ROUTE-104': { kind: 'domain', domainIds: ['Core'], groupIds: ['DG-CORE-01'], deviceIds: ['XR-R07'], label: 'Core · XR-R07' },
  'CHECK-208': { kind: 'domain', domainIds: ['West'], groupIds: ['DG-WEST-01'], deviceIds: ['XR-R12'], label: 'West · XR-R12' },
  'REACH-319': { kind: 'domain', domainIds: ['East'], groupIds: ['DG-EAST-01'], deviceIds: ['XR-R19'], label: 'East · Metro East · XR-R19' },
};

/**
 * Separate network-source fixture records at the story checkpoints. Their
 * observations stay the same even as a proposal, agent, or operation changes.
 * Advancing a job is not, by itself, a new network observation in a real system.
 */
const OBSERVATION_TIMES = [
  '07:54:45 UTC', '07:57:15 UTC', '08:00:15 UTC', '08:01:15 UTC',
  '08:02:15 UTC', '08:03:15 UTC', '08:05:20 UTC', '08:07:15 UTC',
];

function observationTime(scene) {
  const value = Number(scene);
  const index = Number.isFinite(value) ? Math.max(0, Math.min(7, Math.trunc(value))) : 0;
  return OBSERVATION_TIMES[index];
}

function reachabilityObservation(domain) {
  return `${domain.router} responded to the sampled reachability check. This observation covers the representative router, not every device or service in ${domain.id}.`;
}

/**
 * A network domain's observed condition never comes from job tone, approval,
 * configuration classification, execution status, or agent health. All current
 * fixture samples show a reachable representative router; this is not a global
 * all-clear. Interrupted visibility retains that sample as last-known only.
 */
export function getRibbonNetwork(combinedSnapshot) {
  const sourceState = combinedSnapshot?.sourceState === 'current' ? 'current' : 'interrupted';
  const current = sourceState === 'current';
  const lastConfirmed = observationTime(combinedSnapshot?.scene);
  return {
    domains: DOMAIN_FIXTURES.map(domain => {
      const observed = reachabilityObservation(domain);
      return {
        id: domain.id, label: domain.id, x: domain.x, y: domain.y,
        condition: current ? 'normal' : 'unavailable',
        conditionLabel: current ? 'Observed reachable' : 'Current observations unavailable',
        observation: current ? observed : `Last confirmed at ${lastConfirmed}: ${observed} Current reachability cannot be established while updates are interrupted.`,
        groups: [{
          id: domain.groupId, label: domain.groupLabel,
          routers: [{
            id: domain.router, label: domain.router,
            interfaces: [{
              id: `${domain.router}:${domain.port}`, label: domain.port,
              detail: `Representative WAN-facing interface on ${domain.router}. Interface condition is not established by the sampled router-reachability observation or by the logical domain connections.`,
            }],
          }],
        }],
      };
    }),
    connections: CONNECTION_FIXTURES.map(connection => ({ ...connection })),
    incidents: (combinedSnapshot?.incidents || []).map(incident => ({ ...incident })),
    sourceLabel: 'Router reachability',
    lastConfirmed,
    sourceState,
  };
}

/** Unknown work is safely unplaced; never guess geography from its title. */
export function getWorkNetworkScope(jobId) {
  const scope = typeof jobId === 'string' && Object.hasOwn(WORK_SCOPE_FIXTURES, jobId) ? WORK_SCOPE_FIXTURES[jobId] : null;
  return scope ? { ...scope, domainIds: [...scope.domainIds], groupIds: [...scope.groupIds], deviceIds: [...scope.deviceIds] } : {
    kind: 'platform', domainIds: [], groupIds: [], deviceIds: [], label: 'Platform',
  };
}

/**
 * Return exact related-work IDs for an explicit scope lens, preserving order.
 * No selection means no matches; this helper never means "all work". The
 * current three jobs are each domain-scoped, so Cross-domain is honestly empty.
 */
export function relatedWorkIds(jobs, scope) {
  if (!Array.isArray(jobs) || !scope || typeof scope !== 'object') return [];
  const domain = scope.kind === 'domain' && DOMAIN_FIXTURES.some(item => item.id === scope.id);
  const destination = NETWORK_SCOPE_DESTINATIONS.find(item => item.kind === scope.kind && (scope.id === undefined || item.id === scope.id));
  if (!domain && !destination) return [];
  return [...new Set(jobs.filter(job => {
    if (typeof job?.id !== 'string' || !job.id) return false;
    const workScope = getWorkNetworkScope(job.id);
    return domain ? workScope.domainIds.includes(scope.id) : workScope.kind === destination.kind;
  }).map(job => job.id))];
}
