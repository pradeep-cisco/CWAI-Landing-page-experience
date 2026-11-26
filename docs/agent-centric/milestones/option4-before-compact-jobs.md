# Option 4 · Jobs and independent incidents

Implemented November 25, 2026. This iteration applies only to Option 4. Options 1–3 and archived explorations retain their existing behavior and visuals.

## Operator outcomes

- Identify decisions requiring the operator's delegated authority.
- Scan every nonempty task category without reading repeated agent, scope or explanatory labels.
- Follow several jobs contributing to one incident without confusing incident membership with category totals.
- Inspect a scoped finding, review a bounded proposal and distinguish approval from execution and verified recovery.

## Landing hierarchy

The utility bar retains device-group and agent filters, inventory context, observation coverage and one Start job entry. Your decisions remains above Jobs in every state. It displays a concise review row when a decision exists and a qualified empty state otherwise. An empty decision queue does not imply network health or completed agent work.

Jobs retains eight task categories: Investigations, Configuration checks, Event correlation, Risk assessments, Capacity checks, Service checks, Remediation and Verification. Every nonempty category remains visible, including completed-only categories. Cards retain their task title, total, nonzero status counts, source-qualified finding and native Jobs manager destination. Incident selection does not filter, resize, highlight or add linked-job counts to these cards.

Incidents is its own container below Jobs and above Suggested. On arrival it shows a compact list with incident identity and current state. No incident details open automatically, including when the presentation state changes. Selecting an incident opens its details beside the list within this section. Your decisions and Jobs retain their existing position and presentation.

The first incident view answers three questions: what condition is established, how far the response has progressed, and what happens next or requires the operator. A short Investigate → Remediate → Verify sequence summarizes actual progress. Supporting jobs is closed by default; expanding it reveals the incident's explicitly associated job records and inline evidence. The incident view does not navigate to Jobs manager.

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

The first incident view summarizes this progression without a job dependency graph. Its six actual supporting jobs remain available on demand. Future phases are marked not started until their job and operation records exist. Other correlated incidents retain their own explicit membership; shared devices or task categories do not infer an incident or a shared cause.

## Interactions and scope

- A category link opens its exact scoped Jobs manager view. The presentation state survives native links, reloads and the Home return path.
- A row in Incidents opens details inside that section and focuses its heading. Closing returns focus to the incident row. Pagination keeps the full incident collection reachable without moving the Jobs cards.
- Supporting jobs opens one progressive disclosure. A selected job reveals evidence inline. A reviewable change opens the existing bounded review drawer. Follow incident from Jobs manager returns to this same incident section.
- Incident-wide context identifies jobs outside current device-group or agent filters. Those records do not become actionable through the incident detail. Unknown filters never expose unrelated work.
- Interrupted sources retain last-confirmed records and qualify outcomes. New starts, current approvals and running presentation treatment remain unavailable.

## Visual treatment and motion

Native Magnetic cards, controls, typography and drawer behavior remain in the One CD dark shell. Smaller task totals, compact decision rows, one border and restrained blue–purple atmosphere establish hierarchy. Actual findings use concise landing copy rather than rotating full evidence paragraphs. Full sources remain inspectable.

Running Jobs retains its existing restrained moving edge. Reading, focus, explicit pause, offscreen visibility and reduced-motion preferences stop presentation motion. Incident selection uses a brief transition inside its own section. Motion never advances a job, confirms an outcome or reorders incidents while the operator reads.

## Previous milestone

The earlier incident-thread source is retained in [option4-before-incident-section.tgz](milestones/option4-before-incident-section.tgz), with its rationale in [option4-before-incident-section.md](milestones/option4-before-incident-section.md). The earlier visual milestone remains in [option4-before-clean-design.tgz](milestones/option4-before-clean-design.tgz). Earlier rationale and use cases remain in the other documents in this directory.

## Validation

The full 348-test suite and production build pass. Desktop browser review at 1440 × 900 covered the closed incident list, in-section selection, pagination and focus, inline supporting evidence, the existing bounded review drawer, closing back to the incident row, and the Verification snapshot. Mobile review was outside this iteration's requested scope.

Before-and-after browser measurements confirm that selecting an incident preserves Jobs width, category totals and Your decisions content. Source checksums confirm that Jobs, its styles and Your decisions are byte-identical, and all source files outside Option 4 match the baseline captured before this iteration. Screenshots are stored under `docs/screenshots/agent-centric/incident-section-*-desktop.jpg`.
