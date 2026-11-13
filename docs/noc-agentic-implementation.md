# NOC agent-owned response experience

Implemented: 2026-11-13. Current direction: [NOC and agentic direction](noc-agentic-direction.md). Route: `/network-monitoring`.

## Outcome and scope

The NOC operator follows one CW AI-owned case through evidence, response planning, actual execution and case-specific verification. Routine human engineering handoff, acceptance and routing controls are removed. The operator can inspect the work, ask scoped questions, add context or optionally pause further interface changes without coordinating specialists.

One CD dark, the restrained gradient/glow, native Harbor assistant messages, the WAN schematic geometry and four lower section homes are preserved. Updates now describes the work rather than leading with backend contributor names.

This is an interactive conceptual application over explicitly recorded local sources. It does not connect to a real knowledge graph, AI runtime or WAN controller. The new plan records demonstrate how knowledge-graph relationships and detailed source evidence could support the intended experience; they are not evidence of production reasoning or controller integration.

## Updated story — 07:55 to 08:35

| Time | Agent-owned work | Operator-visible outcome |
| --- | --- | --- |
| 07:55 | Monitor current sources and their coverage | Quiet watch supported by scoped observations. |
| 07:58 | Investigate the below-threshold utilization rise | Watchlist shows the recorded trend without declaring an alarm or inventing a forecast. |
| 08:00 | Accept the qualifying incident and retain its original source events | CW AI owns CNC-1042; related Minor source events can belong to the same investigation. |
| 08:01–08:03 | Connect interface, topology, inventory, observed policy and intended constraints | Response plan shows inspectable relationships and separately timestamped sources. A separate configuration difference has its own assessment. |
| 08:05 | Evaluate candidate responses | Candidate A projects to 81% against an 80% limit and is rejected. Candidate B projects to 60%. The comparison states why the response is chosen or held. |
| 08:07 | Validate permitted effects and current dependencies | A generated response can proceed without a catalogue match. Authority or target-lock limitations remain owned dependencies; they cannot become execution permission. |
| 08:10–08:20 | Follow a confirmed controller operation and measured effects | RUN-017 remains distinct from the source condition. The interface alarm and utilization remain independently visible. |
| 08:25 | Evaluate the actual result | Completion with utilization still 86% leaves recovery pending. Failed or unknown output enters agent-led reconciliation with truthful progress. |
| 08:35 | Verify supported recovery or retain unresolved work | Only supported criteria create a current interface recovery. Pending reconciliation does not become success because the source improved. Recorded revised execution can independently complete the case, with the original attempt retained. |

The fresh page defaults to the no-playbook scenario so constructed planning is part of the primary demonstration. The floating Preview controller remains outside the product and can exercise a validated procedure, unavailable catalogue, blocked scope, target lock, missing telemetry, failed/unknown job, recorded retry and an extra source event.

## Evidence-backed planning

`response.plan` supplies status, origin, goal, updated time, relationships, source records, alternatives, selected option, expected effect and post-checks. Both the incident and assistant consume it; no separate assistant success model is used.

The capacity record `CAPACITY-0805` is a declared illustrative assessment of two 100 Gbps candidate bottlenecks and an 18 Gbps proposed shift:

- A: 63 + 18 = 81 Gbps / 100 Gbps; exceeds the configured 80% limit.
- B: 42 + 18 = 60 Gbps / 100 Gbps; within the candidate capacity limit.

These are projections, labelled as such. They are not received utilization samples and are never added to the telemetry chart. Candidates are identified A/B rather than asserting an unrecorded physical route in any WAN setup. Authority, freshness, lock and reconciliation checks separately determine whether a candidate is executable. A blocked option is labelled Held, has no selected plan ID and states the actual dependency.

Network relationships connect the received condition, resource, observed policy and actual WAN membership. Independent topology and observed policy are separately sourced. Missing interface telemetry does not imply missing topology or permit a stale policy observation to be labelled current.

## Failure, reconciliation and retained execution

The shared response progress now reflects actual job state. Failed execution produces a failed remediation step; unknown execution remains unconfirmed. The assistant activity timeline also distinguishes failed/unavailable events from completed work. The lower incident no longer repairs an inconsistent shared model locally.

Default failed/unknown results remain unresolved and owned by CW AI. No retry or reversal is inferred.

An optional **recorded source scenario**, `reconciliation: 'verified-retry'`, supplies additional evidence only at the final source frame:

1. At 08:26 controller output and target-configuration readback establish that RUN-017 did not apply the proposed change.
2. A separate revalidated RUN-018 is confirmed started at 08:27 and completed at 08:29.
3. Source clearance and the recorded 08:30–08:35 stability check can then independently establish recovery.

The actual RUN-017 failure or unknown result remains in `priorJobs`; it is not overwritten with a successful result. RUN-018 and its proof persist through later permission, telemetry or pause changes. Current gates affect further work and recovery verification; they do not erase confirmed execution. Without permission and fresh evidence before a new retry, that retry is not created.

This scenario demonstrates a safe separate response after an unapplied change. It does not claim to implement rollback of a harmful applied change. Historical replay clears future execution facts and filters retained source outcomes to the selected source time.

## Case-scoped explanations and outcomes

Assistant replies use the selected workstream's evidence. Router questions no longer receive interface utilization or an unproven SR-policy association. Collection restoration no longer receives the interface's 80% threshold or later stability interval. Source restoration can be retained without inventing a controller job.

Recent now retains:

- Independently verified interface recovery.
- Recorded router reachability restoration.
- Recorded telemetry collection restoration.
- A completed configuration assessment with a reasoned disposition.

These outcomes are explicitly distinguished. A retained configuration difference is not labelled repaired or recovery verified. Source restoration does not establish a physical cause or repair operation. Completed source snapshots persist separately from the latest active occurrence, so a new router fault or collection gap cannot erase earlier proof. Older occurrence proof does not open the new workstream as if it were the old response.

## Configuration assessment

Changes retains the existing intended/observed comparison. At 08:03 CW AI assesses the Loopback0 description difference on XR-P5. At 08:05 it records a description-only difference retained under observation. No forwarding effect or causal relationship to CNC-1042 is established, and no configuration operation is invented. The source comparison and assessment reasoning remain inspectable.

## Source events and connection access

The duplicate Source alarms landing accordion is removed. Original records remain accessible inside the incident and assistant source evidence.

The event ledger accounts for linked, investigating and explicitly expected events. Expected/suppressed disposition requires a recorded reason; otherwise the event remains under investigation. An unmatched event appears in Watchlist and Updates, owned by CW AI, without an invented incident or cause. A bounded four-item feed does not discard the underlying event ledger. A recovered interface cannot produce a global all-clear while an unrelated event remains under correlation. Inactive source status is preserved rather than always being called source-cleared.

Connections is now a lightweight native text disclosure. It preserves member inspection, pagination, cross-domain and off-page access, including the narrow-screen fallback where schematic connection routes are not drawn. Its layout is not another prominent bordered accordion.

## Verification

- 139 automated tests pass, including source/result/verification separation, generated plans, blocked candidates, case-scoped answers, explicit retry proof, confirmed-execution retention, event accounting, source-restoration recurrence and rendered UI regressions.
- Production build passes; the existing bundle-size advisory remains informational.
- Browser review at 1440×900 and 390×844 confirmed plan comparisons, native assistant rendering, case-scoped router answers, failed-to-recorded-retry continuation, independent router outcome proof, pending correlation, and removal of the landing alarm panel.
- Mobile page, content and assistant showed no horizontal overflow. The Connections text disclosure was opened by pointer and closed with Enter.
- Motion remains local to native disclosures, source/value arrivals and candidate meter transitions. Existing reduced-motion rules and a scoped plan rule disable these effects.
- Inventory, physical links, layout algorithm, theme preset and route structure are unchanged. All three WAN labels/scopes remain covered by the model and rendering checks.

Visual records: [Response plan desktop](screenshots/noc-agentic/response-plan-desktop.png), [response plan mobile](screenshots/noc-agentic/response-plan-mobile.png), [recorded revised execution](screenshots/noc-agentic/revised-execution-desktop.png), [pending correlation](screenshots/noc-agentic/watchlist-correlation-desktop.png), [scoped router assistant](screenshots/noc-agentic/router-assistant-mobile.png), and [router restoration proof](screenshots/noc-agentic/router-outcome-desktop.png).

## Fallback and limits

`milestone/15-onecd-atmosphere` at `5b42ffd` preserves the previous UI; subsequent commits before this implementation only update direction and pressure-test documentation. `milestone/16-noc-agentic-response` records this iteration.

Full production event ingestion, real knowledge-graph queries, adaptive routing algorithms, all control-plane fault types, harmful-change rollback, and toxic-factor semantics are not implemented by this concept. Toxic-factor meaning remains undefined and no conclusion is fabricated. Operational workload at thousands of simultaneous incidents has not been established by the three WAN inventory examples.
