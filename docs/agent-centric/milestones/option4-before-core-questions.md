# Option 4 · Jobs and independent incidents

Implemented November 25, 2026. This iteration applies only to Option 4. Options 1–3 and archived explorations retain their existing behavior and visuals.

## Operator outcomes

- Identify decisions requiring the operator's delegated authority.
- Scan every nonempty task category without reading repeated agent, scope or explanatory labels.
- Follow several jobs contributing to one incident without confusing incident membership with category totals.
- Inspect a scoped finding, review a bounded proposal and distinguish approval from execution and verified recovery.

## Landing hierarchy

The utility bar retains device-group and agent filters, inventory context, observation coverage and one Start job entry. Your decisions remains above Jobs in every state. It displays a concise review row when a decision exists and a qualified empty state otherwise. An empty decision queue does not imply network health or completed agent work.

Jobs retains eight task categories: Investigations, Configuration checks, Event correlation, Risk assessments, Capacity checks, Service checks, Remediation and Verification. Every nonempty category remains visible, including completed-only categories. Jobs occupies 70% of the available row, with its cards in two columns and four rows. Incidents occupies the remaining 30%, separated by a 24px gap. Each Jobs card contains its category glyph and task title, a clear numeric total, nonzero status counts and an overlapping stack of the actual agents owning its jobs. Agent marks are deduplicated, limited to three plus a unique-agent overflow count, and named through an accessible label and tooltip. The entire card remains one native Jobs manager link.

Sample-job findings, router names, timestamps, device-group labels, incident references and explanatory paragraphs are removed from Jobs cards. These details remain available in the scoped Jobs manager and incident evidence. Grouping stays implicit. Incident selection cannot change the task cards, their counts or their destinations.

Incidents is its own compact container beside Jobs, with Suggested below the shared row. On arrival it shows incident identity and current state, with six incidents per page. No incident details open automatically, including when the presentation state changes. Selecting an incident opens a contained, nonmodal inspection panel over Jobs. Its right edge stops at the Incidents boundary, leaving the queue visible and interactive. There is no global veil or focus trap. The page does not reflow when the panel opens. Your decisions remains full width above the row and retains its existing component, styling and content.

The first incident view answers three questions: what condition is established, how far the response has progressed, and what happens next or requires the operator. A short Investigate → Remediate → Verify sequence summarizes actual progress. Summaries and next steps use short operator-facing copy; canonical records, source qualifications and review authority are retained. Incident rows use concise titles and device-group context, adding target detail when names would otherwise collide. Supporting jobs is closed by default; expanding it reveals the incident's explicitly associated job records and full inline evidence. The incident view does not navigate to Jobs manager.

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
- A row in Incidents opens the left inspection panel and focuses its heading. Closing returns focus to the selected incident row, retaining its queue page. A review opened from Your decisions returns to that trigger when it remains available.
- Select another incident directly from the queue to replace the panel contents. Previous/Next also follows the current filtered queue across list pages. The queue maintains its reading order, and the panel keeps its width while switching incidents. Closing after navigation reveals the page containing the selected incident.
- The panel initially fills the Jobs column. Drag its left edge to resize it, or focus the separator and use Left/Right to adjust by 32px, Home for the minimum and End for the maximum. Width is bounded between 480px and the Jobs column width where space permits, and remembered until the dashboard is remounted. Escape within the panel or Close dismisses it. The panel cannot expand over Incidents.
- Supporting jobs opens one progressive disclosure. A selected job reveals evidence inline, scrolling within the panel. Review change switches the same panel to the bounded, versioned review; Back to incident restores the incident view. No second overlay is stacked. Follow incident from Jobs manager returns to this panel on Home.
- Jobs stays underneath at its original position. It is dimmed, excluded from keyboard navigation and presentation-paused only while a valid, in-scope incident panel is present. The rest of the page remains interactive. An out-of-scope selection cannot leave Jobs disabled after browser navigation.
- Incident-wide context identifies jobs outside current device-group or agent filters. Those records do not become actionable through the incident detail. Unknown filters never expose unrelated work.
- Interrupted sources retain last-confirmed records and qualify outcomes. New starts, current approvals and running presentation treatment remain unavailable.

## Visual treatment and motion

Native Magnetic cards, controls and typography remain in the One CD dark shell. The custom nonmodal panel is a deliberate composition for retaining the queue. Jobs uses larger readable titles and totals, restrained category glyphs, quiet borders and clearly differentiated status colors. A review accent identifies an actual decision state. Incidents uses a continuous charcoal queue with a narrow selected edge matching the panel boundary. Actual findings use concise landing copy; full sources remain inspectable.

Incident detail emphasizes the condition headline, a spacious three-stage response track and one next action. The Verification snapshot adds two labeled comparison bars for the actual 92% before and 68% verified measurements. Their common percentage scale and five-minute comparison window are retained; last-known comparisons are qualified and muted. No decorative trend or unmeasured intermediate points are generated.

Running Jobs uses a faint blue–purple moving line at the bottom of each active card. Actual status-count changes receive one brief brightness transition. Reading, focus, explicit pause, offscreen visibility, incident inspection and reduced-motion preferences stop presentation motion. The panel enters once when opened; switching incidents uses only the brief content transition. Motion never advances a job, confirms an outcome or reorders incidents while the operator reads.

## Previous milestone

The version before left inspection and visual refinement is retained in [option4-before-left-inspection.tgz](milestones/option4-before-left-inspection.tgz), with its rationale in [option4-before-left-inspection.md](milestones/option4-before-left-inspection.md). The version before the 70/30 layout and resizable drawer is retained in [option4-before-70-30-drawer.tgz](milestones/option4-before-70-30-drawer.tgz), with its rationale in [option4-before-70-30-drawer.md](milestones/option4-before-70-30-drawer.md). The version before compact Jobs is retained in [option4-before-compact-jobs.tgz](milestones/option4-before-compact-jobs.tgz), with its rationale in [option4-before-compact-jobs.md](milestones/option4-before-compact-jobs.md). The earlier incident-thread source is retained in [option4-before-incident-section.tgz](milestones/option4-before-incident-section.tgz), with its rationale in [option4-before-incident-section.md](milestones/option4-before-incident-section.md). The earlier visual milestone remains in [option4-before-clean-design.tgz](milestones/option4-before-clean-design.tgz). Earlier rationale and use cases remain in the other documents in this directory.

## Validation

All 358 tests pass with `node --test --test-concurrency=1 tests/*.test.mjs`, and the production build passes. Desktop browser review at 1440 × 900 covered the 70/30 proportions, the refined cards and queue, pointer and keyboard resizing bounded to Jobs, direct queue selection while details remain open, width persistence, incident navigation across queue pages, scoped Escape and dismissal, focus return, internal evidence scrolling, same-panel change review and the sourced verification comparison. An additional taller desktop capture shows all eight Jobs cards together. Earlier review covered category navigation and the Home return. Mobile review remains outside the requested scope.

Incident selection remains independent of Jobs totals and Your decisions. At the desktop review width, the Jobs and Incidents columns measure 854px and 366px, with two 421px Jobs cards per row. The inspection panel is at most 854px wide and its right edge remains at x=1014; the queue begins at x=1038. Opening and resizing it leaves both columns unchanged. The underlying job records and totals are unchanged. Source checksums preserve Your decisions and all source files outside Option 4. Current screenshots are `docs/screenshots/agent-centric/jobs-incidents-refined-desktop.jpg`, `incident-left-workspace-desktop.jpg` and `incident-left-verification-desktop.jpg`; earlier milestone screenshots remain alongside them.
