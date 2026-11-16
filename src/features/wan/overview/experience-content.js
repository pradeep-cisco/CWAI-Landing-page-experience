// Outcome-led presentation copy. Illustrations explain the prototype's
// capabilities without claiming a live controller or agent connection.
export const EXPERIENCE_SLIDES = [
  {
    id: 'watch',
    label: 'Network clarity',
    title: 'Understand the network at a glance',
    description: 'Bring thousands of routers into a clear view of domains, connections and the conditions that matter.',
    caption: 'National Backbone example · 3,200 routers · 6 domains',
  },
  {
    id: 'layout',
    label: 'A clear layout',
    title: 'Know where to look',
    description: 'Move naturally between the network picture, meaningful updates and the work behind each condition.',
    caption: 'Select an area to understand its role.',
  },
  {
    id: 'trend',
    label: 'Focused attention',
    title: 'Notice what needs attention',
    description: 'Developing signals stay visible, while active incidents draw attention to the affected scope.',
    caption: 'Clear priorities, with the wider network still in view.',
  },
  {
    id: 'response',
    label: 'Autonomous action',
    title: 'Let intelligence move work forward',
    description: 'Agents connect the evidence, validate a permitted response and follow it through to verification.',
    caption: 'Select a stage to see how the work progresses.',
  },
  {
    id: 'recovery',
    label: 'Measured confidence',
    title: 'Confirm recovery with evidence',
    description: 'A completed change stays distinct from recovery, which requires fresh observations and satisfied verification checks.',
    caption: 'Completion records the action; verification confirms the result.',
  },
  {
    id: 'context',
    label: 'Connected context',
    title: 'Understand the supporting context',
    description: 'Explore how devices, interfaces, services and configurations relate to the condition and its supporting evidence.',
    caption: 'Select an entity type to reveal its connection.',
  },
];

export const LAYOUT_FOCUS = {
  overview: {
    title: 'WAN overview',
    description: 'Locate conditions across domains, then explore device groups, routers and interfaces.',
  },
  updates: {
    title: 'Network watch',
    description: 'Follow meaningful findings, response progress and measured effects without tracking every backend task.',
  },
  work: {
    title: 'Operational tabs',
    description: 'Inspect active incidents, developing conditions, configuration changes and retained outcomes.',
  },
};

export const RESPONSE_STEPS = [
  { id: 'investigate', label: 'Investigate', detail: 'Connect the condition to its network scope and supporting evidence.' },
  { id: 'validate', label: 'Validate', detail: 'Check intent, capacity, data freshness and permitted scope before acting.' },
  { id: 'remediate', label: 'Remediate', detail: 'Follow the permitted controller operation and retain its actual execution result.' },
  { id: 'verify', label: 'Verify', detail: 'Confirm source clearance and stable observations before declaring recovery.' },
];

export const ENTITY_CONTEXT = {
  Device: {
    title: 'Device',
    description: 'Locate the router within its device group and domain.',
    relation: 'A device owns its interfaces.',
  },
  Interface: {
    title: 'Interface',
    description: 'Connect the observed condition to its router and physical peer.',
    relation: 'An interface belongs to a device and connects to a peer interface.',
  },
  Service: {
    title: 'Service',
    description: 'Understand the observed policy dependency associated with an interface.',
    relation: 'The observed SR policy depends on an interface and is configured by policy intent.',
  },
  Configuration: {
    title: 'Configuration',
    description: 'Inspect the observed configuration or intended constraints supporting an assessment.',
    relation: 'Source records distinguish observed configuration from intended policy constraints.',
  },
};
