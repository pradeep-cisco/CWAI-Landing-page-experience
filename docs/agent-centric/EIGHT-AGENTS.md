# Option 4 — eight network agents

Updated: 2026-11-24. Implemented in Option 4 only. This extends the [scale and copy iteration](SCALE-AND-COPY.md); earlier explorations remain unchanged.

## Operator outcome

Understand meaningful work across a large WAN, inspect evidence from the responsible agent and make only the decisions requiring delegated authority. The additional agents enrich Jobs and Attention; they do not create eight new landing sections.

## Eight roles

| Agent | Purpose | Example work |
| --- | --- | --- |
| Configuration Drift Detection | Identify anomalies against learned logical-group patterns and review change context | Review an unusual route-policy setting; conclude an explained change without proposing a correction |
| Toxic Factor Identification | Find statistical associations between event cohorts and inventory attributes | Analyze a software/interface combination associated with recurring BGP session drops; validate before attributing cause |
| Network Troubleshooter | Investigate symptoms using scoped observations | Investigate reachability; retain ownership while archived-event access is unavailable |
| Remediation | Prepare bounded corrections and follow authorized execution through verification | Review one routing correction; distinguish completion from a verified result |
| Event Correlation | Classify related events using resource and time-window criteria | Create or monitor a linked incident when criteria are met; finish other assessments without creating an incident |
| Vulnerability Assessment | Assess advisory applicability using platform, software and feature evidence | Wait for enabled-feature evidence before confirming applicability; avoid implying an exploit or compromise |
| Capacity Analysis | Assess utilization and remaining headroom over explicit windows | Compare 61% and 82% observed peak utilization; distinguish measured headroom from a demand forecast |
| Service Assurance | Compare observed service conditions with recorded criteria | Show reachable service probes with latency above the service criterion; preserve independent service results |

Agent versions, workloads and network observations are simulated. The role set combines documented Crosswork capabilities with the proposed roles discussed for this concept. It is not a list of eight agents asserted to ship in a particular release.

## Current scenario

The arrival fixture contains 10,000 registered devices across eight domains, 168 jobs, 113 open issues and six scoped change reviews. Current observations cover 9,872 devices. The status counts are computed from records: 117 progressing, 24 waiting, six awaiting review and 21 completed.

Seven correlation jobs explicitly satisfy their recorded classification criteria and link to seven incidents. These accompany the original routing-intent incident. Other event assessments retain their own pending or concluded classification result. An observation, anomaly, statistical association or shared source constraint is not automatically an incident or a root cause.

Eighteen investigations across three domains retain the shared archive prerequisite. Restricting new assignments for any agent preserves existing jobs and does not repair missing data.

## Landing and interaction

The visible sections remain **Needs review**, **Jobs** and **Attention**.

- **All agents** lists the eight types. It filters job ownership and relevant capabilities alongside the existing domain filter. Reviews outside the current view retain a clear cue.
- **Jobs** defaults to four compact groups: routing correction, archive access, risk assessments and network checks. The latter two collect related work types, not shared root causes. Individual agent views use their specific job groups. All jobs remain searchable and paginated at 12 per page.
- **Attention** shows three relevant actions by default. View all actions reveals all eight. Every launch uses an explicit permitted scope; evidence, source, capability and assignment restrictions still apply. Verification remains tied to the exact completed correction.
- **Inspection** shows the selected job's finding, evidence, next step and explicit incident relationship. It never borrows the original router's proposal or verification evidence for an unrelated job.

Starting a request shows submission before acknowledgement. Acknowledgement uses the selected agent's activity, such as Correlating, Analyzing patterns, Assessing exposure or Checking service. It does not invent a finding, incident, corrective write or verified result.

## Motion

Active specialist findings transition through a finite set of supplied facts. Their scope remains visible. Reading, hidden tabs, offscreen state and reduced-motion preferences pause supporting transitions. Only progressing work has a subtle live pulse; waiting, review and completed states remain steady. Main checkpoints and reading order stay stable.

## Evidence and conceptual boundaries

- [Crosswork AI Getting Started](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/crosswork-ai/2-0/articles/crosswork-ai-using-cnc-getting-started.html) documents the built-in configuration drift, toxic-factor and troubleshooting capabilities.
- [Configuration Drift Detection](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/crosswork-ai/2-0/articles/config-drift-for-cnc.html) compares configurations with learned patterns. An anomaly requires context before it is classified as unauthorized drift.
- [Toxic Factor Identification](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/crosswork-ai/2-0/articles/toxic-factor.html) identifies statistical associations with link-down and BGP-session-down events; these results do not automatically confirm root cause or prescribe remediation.

The orchestrator that chooses agents stays behind the scenes. Knowledge-graph relationships provide context, while observations establish state and impact. Production network changes retain separate authority and verification requirements.
