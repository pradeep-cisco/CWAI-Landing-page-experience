/** Stable review cues. Existing links remain valid when the visible labels change. */
export const EXPLORATION_OPTIONS = [
  { id: 'network', cue: '01', label: 'Operations', path: '/network-monitoring' },
  { id: 'workforce', cue: '02', label: 'Governance', path: '/network-monitoring?exploration=workforce' },
  { id: 'combined', cue: '03', label: 'Combined · Live activity', shortLabel: '03 · Combined · Live', path: '/network-monitoring?exploration=combined' },
  { id: 'combined-baseline', cue: '03', label: 'Combined · Baseline', shortLabel: '03 · Combined · Baseline', path: '/network-monitoring?exploration=combined&layout=baseline', archived: true },
  { id: 'workforce-original', cue: 'Archive', label: 'Governance original', path: '/network-monitoring?exploration=workforce-original', archived: true },
];

export const explorationLabel = option => `${option.cue} · ${option.label}`;
export const getExplorationOption = id => EXPLORATION_OPTIONS.find(option => option.id === id) || EXPLORATION_OPTIONS[0];
