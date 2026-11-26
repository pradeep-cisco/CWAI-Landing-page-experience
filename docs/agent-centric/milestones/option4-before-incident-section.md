# Option 4 · Cleaner landing and incident thread

Implemented November 25, 2026. This iteration applies only to Option 4. Options 1–3 and archived explorations retain their existing behavior and visuals.

## Operator outcomes

- Identify decisions requiring the operator's delegated authority.
- Scan every nonempty task category without reading repeated agent, scope or explanatory labels.
- Follow several jobs contributing to one incident without confusing incident membership with category totals.
- Inspect a scoped finding, review a bounded proposal and distinguish approval from execution and verified recovery.

## Landing hierarchy

The utility bar retains device-group and agent filters, inventory context, observation coverage and one Start job entry. Your decisions remains above Jobs in every state. It displays a concise review row when a decision exists and a qualified empty state otherwise. An empty decision queue does not imply network health or completed agent work.

Jobs retains eight task categories: Investigations, Configuration checks, Event correlation, Risk assessments, Capacity checks, Service checks, Remediation and Verification. Every nonempty category remains visible, including completed-only categories. Cards contain a task title, quiet total, nonzero status counts and one source-qualified finding. Longer evidence and ownership details remain in the job inspector. One native category link opens Jobs manager; a separate incident button opens context, with no nested interactive targets.

The incident panel is contextual and does not replace Your decisions. Category totals continue to count all jobs in the selected view. Incident references count only explicitly linked jobs in that category and view.

## Three presentation states

Use the floating Preview controller to choose Monitoring, Review or Verification. The initial presentation is Review, preserving an active incident and a consequential decision on arrival. The controls remain outside the operator's product content. State selection is deliberate; background job updates do not automatically open an incident panel.

| Snapshot | All jobs | Running | Waiting | Review | Completed | Actual INC-317 jobs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Monitoring | 167 | 121 | 24 | 0 | 22 | 3 |
| Review | 168 | 119 | 24 | 1 | 24 | 4 |
| Verification | 170 | 120 | 24 | 0 | 26 | 6 |

The sample inventory contains 13,523 registered devices. These deterministic records support concept review; they are not a production-capacity benchmark.

## Incident story

INC-317 concerns a measured high-utilization condition on the West backbone link. C-21 measures the affected link, C-22 checks alternate-path headroom and C-23 checks Core-ingress conditions. These are parallel assessments, not three stages of one job.

R-41 consumes those three explicit findings and proposes one bounded SR-policy preferred-path adjustment. A delegated NOC operator can inspect the proposal version, target, evidence, authority and verification criteria before authorizing or holding it. Submission waits for authority confirmation. Confirmed approval enters prerequisite checking; it does not fabricate controller execution or verification results.

The Verification snapshot contains a separate authorization record and OP-317 controller-completion record. Only then do V-51 and V-52 exist. V-51 verifies the affected-link utilization criterion using comparable five-minute means, 92% before and 68% after. V-52 retains unconfirmed routing-stability and change-boundary checks. The incident remains open.

Connectors appear only for explicit inputJobIds or changeJobId relationships: three assessments converge into R-41, then its completed change branches into two checks. Future work is a short Next statement until actual job records exist. Other correlated incidents use their own explicit membership; shared devices or task categories do not infer a shared cause.

## Interactions and scope

- A category link opens its exact scoped Jobs manager view. The presentation state survives native links, reloads and the Home return path.
- An incident reference opens a nonmodal side panel and focuses its heading. Closing returns focus to its originating control.
- Selecting a job opens its evidence inspector; a reviewable R-41 opens the bounded review. Follow incident returns from Jobs manager to the shared incident context.
- Incident-wide context names jobs outside current device-group or agent filters. Those nodes remain disabled until the view includes them. Unknown filters never expose unrelated work.
- Interrupted sources retain last-confirmed records and qualify outcomes. New starts, current approvals and running presentation treatment remain unavailable.

## Visual treatment and motion

Native Magnetic cards, controls, typography and drawer behavior remain in the One CD dark shell. Smaller task totals, compact decision rows, one border and restrained blue–purple atmosphere establish hierarchy. Actual findings use concise landing copy rather than rotating full evidence paragraphs. Full sources remain inspectable.

Running work retains a restrained moving edge. Reading, focus, explicit pause, offscreen visibility and reduced-motion preferences stop presentation motion. Motion never advances a job or confirms an outcome. Incident-node emphasis is brief and does not reorder work while the operator reads.

## Previous milestone

The pre-iteration Option 4 source and documentation are retained in [option4-before-clean-design.tgz](milestones/option4-before-clean-design.tgz). Earlier rationale and use cases remain in the other documents in this directory.
