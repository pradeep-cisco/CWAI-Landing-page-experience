/** Stable review cues. Existing links remain valid when the visible labels change. */
export const DEFAULT_EXPLORATION = 'agent-centric';

export const EXPLORATION_OPTIONS = [
  { id: 'network', cue: '01', label: 'Operations', path: '/network-monitoring?exploration=network' },
  { id: 'workforce', cue: '02', label: 'Governance', path: '/network-monitoring?exploration=workforce' },
  { id: 'combined', cue: '03', label: 'Combined · Live activity', shortLabel: '03 · Combined · Live', path: '/network-monitoring?exploration=combined' },
  { id: 'agent-centric', cue: '04', label: 'Agent-centric', shortLabel: '04 · Agent-centric', path: '/network-monitoring?exploration=agent-centric' },
  { id: 'combined-baseline', cue: '03', label: 'Combined · Baseline', shortLabel: '03 · Combined · Baseline', path: '/network-monitoring?exploration=combined&layout=baseline', archived: true },
  { id: 'workforce-original', cue: 'Archive', label: 'Governance original', path: '/network-monitoring?exploration=workforce-original', archived: true },
];

export const explorationLabel = option => `${option.cue} · ${option.label}`;
export const getExplorationOption = id => EXPLORATION_OPTIONS.find(option => option.id === id) || EXPLORATION_OPTIONS.find(option => option.id === DEFAULT_EXPLORATION);

/** Bare landing links use Option 4; explicit and archived choices remain addressable. */
export function resolveExploration(search = '') {
  const params = new URLSearchParams(search);
  const requested = params.get('exploration') === 'combined' && params.get('layout') === 'baseline' ? 'combined-baseline' : params.get('exploration');
  return getExplorationOption(requested).id;
}
