# Agentic operations dashboard

## Scope and fallback

The latest user instruction authorizes seven new operational sections **below** the existing landing-page workspace. The existing **WAN overview** and right-side **Network watch / Updates** panel are protected: this iteration does not redesign their components, geometry, source presentation, or interactions.

The pre-iteration baseline is commit `9a15706` (`Fix Protohost preview routing for versioned assets`). It includes the accepted Crosswork AI shell, WAN overview, live attention panel, existing response workspace, and Protohost route fix. Restore that commit in a separate checkout to review the complete earlier experience without overwriting ongoing work. Earlier milestones remain documented in [Live network watch](live-network-watch.md) and [Magnetic migration](cw-ai-magnetic-migration.md).

The new sections extend `/network-monitoring`; existing Home/Admin/Incidents navigation, the floating external preview controller, and the autonomous response workspace remain available. This is an implementation of the agreed visual story, not a dashboard-builder workflow or a new assistant-component implementation.

## Operator outcome

Priya can locate a condition in the preserved schematic, inspect its current evidence, follow permitted autonomous work, recognize a decision boundary, and distinguish controller completion from proven recovery. Lower-page content presents operational findings and outcomes rather than a backend agent roster.

The section order is **Incidents → Watchlist → Changes → Recovery → Monitoring → Resolved → Repeat issues**. A local section navigation row provides direct access. Each section has enough vertical space for its main visual, associated evidence, and attached inspection; the page is not constrained to one screen.

## Implemented sections

| Section | Visual structure and interaction | Priya’s outcome |
| --- | --- | --- |
| **Incidents** | Current-condition choices lead into one expanded investigation. A domain → device group → router → interface/source diagram sits beside current evidence strips. Selecting a resource or finding opens attached inspection. Response state, actual controller record, decision exceptions, and chronological activity remain separate. Existing response inspection and pause/resume actions are connected. Quiet and verified states have an observation-led watch treatment. | Establish affected scope, understand the finding, and supervise the response without reconstructing an alarm sequence. |
| **Watchlist** | A large elapsed-time utilization plot shows recorded samples and the 80% limit. A selected-observation area and recent-sample selectors expose values and source times. The developing trend remains linked to CNC-1042 after incident creation. Collection loss retains the last trustworthy samples. | Notice a developing condition and inspect the observations that led to the incident. |
| **Changes** | Intended and observed router views use matching geometry and aligned configuration fields. The changed field is highlighted; exact differences expand below. A separate Change context view retains declared maintenance and pending checks. Router inspection opens the existing resource evidence. | Distinguish baseline alignment, a configuration difference, and declared change context without assuming causality or approval. |
| **Recovery** | A large measurement plot and aligned lanes show alarm state, received observations, confirmed controller result, and the recorded stability window. Sample inspection leaves the current response intact. Recovery checks expand to show each criterion and the controller-completion requirement. | Understand precisely why recovery is pending, unsupported, or verified. |
| **Monitoring** | Stable domain rows show received/delayed observation ribbons for telemetry, independent reachability, and topology. A selected-source area names its exact scope, last trustworthy time, and implications for dependent checks. Collection response links retain the existing workstream. | Identify uncertainty without treating a collection gap as a physical fault or borrowing evidence from another source. |
| **Resolved** | Verified incidents expose before/after measurements using the same utilization scale. Record selection and Inspect proof reveal controller evidence, the verification interval, and criteria. Earlier-shift evidence stays explicitly archived; only current results link to the current response. | Review a supported recovery and retain its proof. |
| **Repeat issues** | Episode plots share a utilization scale and a relative axis measured from detection. Selecting an episode retains its own outcome. Compare episodes exposes peak/final observations, controller result, and recovery status. | Recognize a repeated condition on the same interface while keeping common cause unconfirmed. |

## Source story: 07:55–08:35

All new current-condition visuals use the same deterministic source frame and autonomous response state as the preserved landing workspace.

| Source time | Recorded condition and response | Lower-page behavior |
| --- | --- | --- |
| **07:55** | Outbound utilization 46%; no current threshold incident. | Incidents presents the quiet watch. Watchlist has the recorded observation. Recovery is ready for a future condition. Archived proof and scheduled maintenance remain inspectable. |
| **07:58** | Utilization 73%, below the configured 80% threshold. | Watchlist shows the observed rise. No Major incident is invented. |
| **08:00** | CNC-1042 reports a Major interface utilization condition at 87%; CW AI ownership and acknowledgement are confirmed. | Incidents opens the condition/evidence account. Watchlist retains its earlier samples and links to that incident. |
| **08:01–08:07** | Existing source frames show investigation, correlation, response validation, and preparation. | Findings and recorded activity update. A decision boundary or collection gap blocks unsupported work. A separate configuration source at 08:03 can introduce the description difference documented below. |
| **08:10–08:20** | RUN-017 has a confirmed start and source-reported execution state when authority and current evidence permit it. | Incidents and Recovery show actual execution. Source severity remains independent. |
| **08:25** | Confirmed completion on the main path; utilization is still 86% and the source alarm remains active. | Recovery remains pending. A completed job alone produces no current Resolved result. |
| **08:35** | Current sample 54%; source clearance at 08:30 and a separately recorded 08:30–08:35 stability check are available. | Verified recovery appears only if controller completion and every required source criterion are supported. The source supplies no 08:30 utilization sample; none is generated for the chart. |

The floating preview controller retains manual Prev/Next and the existing 6.2-second Play cadence. Its source-review dialog can exercise unavailable telemetry, independent Critical reachability, related alarms, authority exceptions, and failed/unconfirmed controller results. These controls remain outside the product’s root content.

## Separate fixture records and provenance

Everything in this prototype is simulated. No real WAN controller, AI service, configuration source, maintenance system, or engineering recipient is contacted. The new read model is `src/features/wan/operations/operations-model.js`; it does not modify the existing controller or autonomous response models.

- **Configuration:** intended reference `XR-BASE-23` is recorded at 07:45. `CONFIG-0755` reports matching fields on XR-P5. From the 08:03 source frame, `CONFIG-0803` reports only a Loopback0 description difference: `CONTROL-LOOPBACK` versus `CONTROL-LOOPBACK-OLD`. The router address and other compared fields match. A forwarding effect or causal relationship to CNC-1042 is **not established**. This record does not authorize restoration or remediation.
- **Declared maintenance:** `CHG-0900` names XR-P4 and a 09:00–09:15 window. It remains **Scheduled** throughout this story; every execution/post-change check remains pending. It is independent of XR-P5’s observed difference. Observed configuration never manufactures maintenance approval or execution.
- **Earlier-shift recovery:** archived CNC-0991 concerns the same illustrated interface. Recorded utilization peaks at 92%, then reaches 56% at 06:35 and 52% at 06:40. `RUN-016` has recorded completion at 06:34. `VERIFY-0640` retains source clearance and a gap-free 06:35–06:40 stability check. This separately verified 06:40 recovery is available in Resolved and Repeat issues from the quiet state. It does not establish recovery of CNC-1042.
- **WAN identity:** domain labels, device groups, and router membership resolve from the selected National Backbone, Metro Transport, or Regional WAN inventory. New sections do not hardcode West/Core/East into alternate setups.
- **Toxic-factor detection:** its semantics remain undefined. No invented toxic-factor conclusion or workflow has been introduced.

## Evidence and autonomy rules

1. Current landing sections project the current watch, even while an evidence dialog inspects an older source frame. Reading or selecting a sample cannot mutate the live state or establish a new outcome.
2. Samples come only from available source frames, bounded by the source’s last observed time. A West collection gap stops the metric at 07:58 (or the recorded 07:50 last-known value in the initial frame). No intervening or future samples are fabricated.
3. West collection loss affects XR-P1/XR-P2 interface streams. The independent East gap affects that domain’s device telemetry. Reachability and topology retain their separately sourced conditions and times. A fresh reachability check can truthfully report an unreachable router.
4. Source severity, job result, and verified recovery are separate. Failed, unknown, never-started, authority-blocked, or paused-before-execution responses cannot become successful because a later metric is below threshold.
5. A source-cleared condition can still require response follow-up. Resolved includes the current incident only when `response.resolved` is true; the earlier archived result remains independently identifiable.
6. Pause prevents further autonomous changes while monitoring continues. It does not claim cancellation or reversal of an already confirmed controller job. Resume revalidates the existing permitted scope.
7. Recurrence means an evidenced repeat of condition/interface. It does not establish a common cause or automatically reuse an earlier response.

## Motion and accessibility

The new sections use Magnetic midnight semantic colours, short state/value arrival transitions, resource-selection emphasis, attached-evidence reveals, and confirmation transitions on evidence intervals. Section homes and selected incident identities remain stable. Time-driven visuals represent source snapshots; there are no generated traffic particles, artificial recovery countdowns, or agent-avatar choreography.

Charts support pointer inspection and keyboard sample navigation using Left/Right, Home, and End. Buttons and section links expose visible focus. Responsive layouts stack investigation/comparison areas; the page keeps vertical document flow. Reduced-motion styling disables the new animation and transition effects while preserving source updates. Existing overview/update motion is unchanged by this iteration.

## Verification status

- Pre-iteration baseline: `9a15706`.
- Automated suite at handoff: **98 passing tests**, including nine new operations-model tests covering lifecycle separation, stale samples, independent source scopes, configuration isolation, archived/current evidence, purity, and all three WAN setups.
- Final verification completed: **98 tests pass**. Both the normal production build and a build using Protohost's `/preview-assets/<version>/` asset path succeed. The existing bundle-size advisory remains informational.
- Browser review completed at **1440 × 900** and **390 × 844**. The mobile content has no horizontal overflow. New charts remain present during pointer selection, keyboard navigation, source progression, scrolling, and resizing. Reviewed browser logs contain no warnings or errors.
- Walked the main source story from quiet monitoring through confirmed execution, pending verification, and independently verified recovery. Tested pause/resume during a running job; no cancellation or rollback is claimed. Tested a collection gap, exact XR-P2 peer-source inspection, and a failed controller result after source clearance; neither produces a current resolved record.
- Switched National Backbone → Metro Transport → Regional WAN → National Backbone. Lower-section resource labels follow the selected inventory, and the saved national incident is restored.
- Confirmed that selecting evidence pins the incident being inspected when a new Critical router incident arrives. The new condition is available in the prioritized condition list; selecting it uses independent device evidence and cannot borrow RUN-017.
- The production-path browser loads all seven new sections and Harbor components. Every section anchor resolves, and page routing remains separate from the versioned asset location.
- Protected-file comparison against `9a15706` is clean for `WanOverview.jsx`, `wan-overview.css`, `NetworkWatch.jsx`, `network-watch.css`, and `watch-model.js`. The integration file adds only the new import and the lower-page component after the existing workspace.

Screenshots: [Incidents](screenshots/operations/incidents-desktop.jpg), [Watchlist](screenshots/operations/watchlist-desktop.jpg), [Changes](screenshots/operations/changes-desktop.jpg), [verification pending](screenshots/operations/recovery-pending-desktop.jpg), [monitoring gap](screenshots/operations/monitoring-gap-desktop.jpg), [Resolved](screenshots/operations/resolved-desktop.jpg), [mobile Incidents](screenshots/operations/incidents-mobile.jpg), and [mobile Watchlist](screenshots/operations/watchlist-mobile.jpg).

## Implementation map

- `OperationsDashboard.jsx`: section order, local navigation, shared read model.
- `SituationSections.jsx`: Incidents and Watchlist.
- `EvidenceSections.jsx`: Changes, Monitoring, Resolved, and Repeat issues.
- `RecoverySection.jsx`: current response/recovery evidence.
- `OperationsPrimitives.jsx` and scoped styles: headers, status tags, resource marks, source notes, and recorded-sample charts.
- `operations-model.js`: read-only source projection and separately identified illustrative records.
- `tests/wan-operations-model.test.mjs`: evidence/authority regression checks.
- `src/pages/network-monitoring/network-monitoring.jsx`: adds the lower operations experience beneath the preserved workspace.
