// Outcome-led illustrations of the Combined concept, independent of product
// state. Exploring these slides never changes a job, authority or network.
export const COMBINED_EXPERIENCE_SLIDES = [
  {
    id: 'picture', label: 'Continuing work',
    title: 'Start with what matters',
    description: 'See the network and the work already underway, with an active incident, a completed assessment and an investigation awaiting access.',
    caption: 'One shared picture. Each job keeps its own state.',
  },
  {
    id: 'layout', label: 'Clear priorities',
    title: 'Know where to look',
    description: 'Orient in the network, find the decisions that need you, and follow agent work without losing the wider picture.',
    caption: 'Select an area to understand its role.',
  },
  {
    id: 'finding', label: 'Evidence first',
    title: 'Understand what changed',
    description: 'Agents compare observed configuration with current intent and authorized changes before classifying a finding and preparing a response.',
    caption: 'In this example, WAN-IMPORT has local preference 120; approved intent requires 100. No matching authorized change explains the difference.',
  },
  {
    id: 'review', label: 'Human control',
    title: 'Make an informed decision',
    description: 'Review the exact change, evidence and limits. Authorize, hold or request a revision while agents retain the technical work.',
    caption: 'A submitted decision becomes authority only after confirmation. A revised proposal needs fresh review.',
  },
  {
    id: 'activity', label: 'Agents at work',
    title: 'Follow every job',
    description: 'See meaningful checkpoints and supporting updates for independent jobs, including work that is complete or waiting for a prerequisite.',
    caption: 'Progress reflects each job’s confirmed checkpoints. Waiting for a source does not mean the agent has failed.',
  },
  {
    id: 'result', label: 'Verified outcomes',
    title: 'Confirm the result',
    description: 'Keep operation completion separate from proof that the intended correction worked. Retain the evidence and confirmed action records.',
    caption: 'Verify configuration, required routing conditions and the reviewed scope. Other jobs keep their own outcomes and constraints.',
  },
];

export const COMBINED_LAYOUT_FOCUS = {
  overview: { title: 'Network', description: 'Locate observed conditions and related work across domains. Explore device groups, routers and interfaces in context.' },
  attention: { title: 'Attention', description: 'Find decisions and consequential exceptions that need you. Attention remains visible across all permitted domains.' },
  actions: { title: 'Actions', description: 'Inspect confirmed decisions, issued operations and verified results, each with its scope and supporting record.' },
  activity: { title: 'Activity', description: 'Follow each job’s purpose, current checkpoint and constraint. Inspect supporting evidence without operating every technical step.' },
};

export const REVIEW_CHOICES = {
  allow: { title: 'Authorize plan', detail: 'Submit a decision for the reviewed version and exact scope. Agents act only after authorization is confirmed and prerequisites pass.' },
  hold: { title: 'Hold plan', detail: 'Keep this correction unissued. Crosswork AI retains ownership, and independently permitted work can continue.' },
  revise: { title: 'Request revision', detail: 'Describe the required change. Agents reassess the proposal; the revised version needs validation and fresh review.' },
};

export const ACTIVITY_JOBS = [
  {
    id: 'ROUTE-104', title: 'Restore approved routing intent',
    scope: 'XR-R07 · route-policy WAN-IMPORT', status: 'Review required', tone: 'warning',
    checkpoint: 'Corrective plan prepared; no network write issued.',
    checkpoints: [{ label: 'Assess', state: 'complete' }, { label: 'Review', state: 'current' }, { label: 'Execute', state: 'future' }, { label: 'Verify', state: 'future' }],
  },
  {
    id: 'CHECK-208', title: 'Check recent configuration changes',
    scope: 'XR-R12 · configuration assessment', status: 'Assessment complete', tone: 'positive',
    checkpoint: 'Changes match their current authorized records.',
    checkpoints: [{ label: 'Assess', state: 'complete' }, { label: 'Complete', state: 'complete' }],
  },
  {
    id: 'REACH-319', title: 'Investigate intermittent reachability',
    scope: 'Metro East · reachability investigation', status: 'Waiting for source access', tone: 'inactive',
    checkpoint: 'Archived event-source access is required for this investigation.',
    checkpoints: [{ label: 'Source', state: 'waiting' }, { label: 'Investigate', state: 'future' }, { label: 'Conclude', state: 'future' }],
  },
];
