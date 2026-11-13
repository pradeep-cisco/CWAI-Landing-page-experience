# Consolidated operations dashboard

## Direction and scope — 2026-11-13

Priya follows a condition through its response and verification in one incident workspace. The page presents four lower section homes: **Incidents → Watchlist → Changes → Recent**. A compact **Data health** disclosure sits beside this navigation boundary, below the existing landing workspace.

The WAN overview, right-side Updates panel, application shell, One CD dark preset, source model, and response model are unchanged. The existing response workspace remains available for detailed agent interaction. All data and actions remain simulated; this iteration connects no external controller or agent service.

Fallback: `milestone/13-magnetic-alignment` at `7257661` preserves the previous seven-section version, including its stories, evidence, screenshots, and interactions. `milestone/14-consolidated-operations` records this consolidation. The earlier rationale remains in [Agentic operations dashboard](agentic-operations-dashboard.md).

## Operator outcomes and presentation

| Surface | Priya's question | Presentation and behavior |
| --- | --- | --- |
| **Incidents** | What is affected, what is being done, and is my attention needed? | One current case owns native Magnetic Overview, Recovery, and History tabs. Overview contains resource scope, findings, controller record, response progress, and confirmed activity. Decision exceptions and a recovery status summary remain visible above the tabs. Device and collection cases retain their own evidence and cannot inherit interface recovery or history. |
| **Watchlist** | What is developing before an incident opens? | A fresh below-threshold rise shows the recorded-sample trend. Once promoted to CNC-1042, a compact linked item replaces the duplicate full chart. Its action opens the same incident's Recovery tab. Quiet and collection-gap states are compact; unavailable current utilization is explicitly unknown. |
| **Changes** | Is configuration aligned, and what changes are declared? | Existing intended/observed comparison and declared maintenance context are retained. A description difference never implies a forwarding impact, common cause, or authority to restore configuration. |
| **Recent** | What has a verified outcome, and where is its proof? | Compact record rows show identity, current/earlier shift, peak-to-verified utilization, and verification time. Native disclosures reveal detailed charts and recovery proof. An archived record remains keyed and open when a new result arrives. |
| **Data health** | Can I trust the observations behind this picture? | The closed native disclosure shows source freshness and any collection exception with affected domains and consequences. It never auto-expands or moves focus. Opening it reveals the domain/source matrix, exact last-trustworthy times, and source inspection. Independently current reachability can still report an unreachable router. |

## Visual journey — 07:55 to 08:35

1. **07:55 — Current picture.** The preserved WAN overview and Updates lead the page. Incidents and Watchlist use short quiet summaries. Data health is compact, with optional diagnostics. Earlier verified evidence stays available in Recent.
2. **07:58 — Developing trend.** Watchlist presents the 73% outbound sample against the configured 80% limit. Pointer and keyboard inspection expose recorded samples; no threshold incident is invented.
3. **08:00 — Incident opened.** CNC-1042 owns the response workspace and its evidence. Watchlist becomes a compact reference. Opening Follow incident focuses Incidents and selects Recovery; it does not launch a second workstream.
4. **08:01–08:20 — Autonomous response.** Overview records the investigation and actual controller progress. Recovery shows the recorded trend and aligned evidence lanes. History holds episode comparison. An authority exception remains visible above the selected tab. A new Critical condition is available in the active-condition choices; inspecting one case cannot replace its evidence with another's.
5. **08:25 — Execution complete.** Confirmed RUN-017 completion is retained while utilization remains 86% and the source alarm is active. The persistent summary says verification is pending. Recent has no new verified outcome.
6. **08:35 — Verified outcome.** Confirmed execution, source clearance, current observations, and the recorded stability check allow CNC-1042 into Recent. A deliberately inspected incident remains open as a completed review, with Close review available. The default unselected watch becomes a compact summary linking to its outcome. No 08:30 utilization sample is synthesized.
7. **Exceptions at any point.** Collection loss stays visible in the closed Data health summary and beside affected evidence. Failed or unconfirmed execution keeps the source-cleared case open for follow-up and creates no verified outcome. An East collection gap never overrides independent current reachability reporting XR-PE-E2 unreachable.

## Interaction and motion

- Native Magnetic tabs retain manual keyboard activation. Tab selection, scope/evidence inspection, and explicit incident selection pin the case being reviewed across verified resolution. Replay before incident creation resets obsolete case selection; WAN changes reset the lower views to the selected inventory context.
- Follow incident selects the same case and Recovery view, scrolls to the stable section anchor, and focuses its labelled region. The action does not mutate controller state or response authority.
- Detailed source and outcome evidence use native disclosures. New data does not auto-open them, change the selected case tab, or steal focus. Archived proof stays attached to its record.
- Existing sample arrivals, source-value updates, local tab reveals, selection emphasis, and disclosure transitions remain. Reduced-motion rules suppress the custom motion, native disclosure duration, and tab-indicator transitions.
- Section spacing, native card padding, and explicit content gaps remain consistent with the previous Magnetic pass. Specialized charts and source ribbons remain custom, with semantic theme tokens.

## Implementation and validation

- `OperationsDashboard.jsx`: four section anchors, compact Data health, and scoped incident-review requests.
- `SituationSections.jsx`: single case workspace and pre-incident Watchlist treatment.
- `RecoverySection.jsx`: embedded RecoveryDetails without a second card or section anchor.
- `EvidenceSections.jsx`: compact Data health, Recent outcomes, and embedded RepeatIssuesDetails.
- `tests/wan-operations-ui.test.mjs`: rendered-UI regressions for empty incident queues, promotion, Critical-case isolation, collapsed coverage exceptions, and execution-versus-recovery distinctions.

Automated validation: 103 tests pass, including five new rendered-UI regressions. Additional source rendering covered 126 WAN/frame/exception combinations for Incidents/Watchlist and 90 evidence-component combinations. The production build passes. Protected files compare unchanged with milestone 13. The existing localhost route responds successfully.

**At milestone 14, visual review was pending.** The in-app browser connection was unavailable during that iteration. The follow-up appearance review below records the restored browser checks; earlier milestone screenshots document their own versions only.

## One CD atmosphere and native messages — 2026-11-13

The subsequent appearance pass keeps One CD dark and the four-section layout. It reuses the boilerplate's native `--onecd-glow-top-default-code` and `--onecd-glow-bottom-default-code` assets at restrained opacity, over a gradient built from the existing dark background tokens. The glow stays behind content, ignores pointer input, and has no continuous animation. The response panel receives a faint token-based blue tint; source severity and recovery colours are unchanged. WAN overview and Updates components remain unchanged.

Conversation entries now use the installed `hbr-chat-message` user and assistant variants. Harbor owns their padding, theme surface, and assistant gradient accent. Author, timestamp, incident scope, accessible conversation log, and question actions are preserved. The cached Harbor 2.19.7 component is beta. The installed starter does not provide a separately named, fully documented Unified Assistance package; this pass does not claim to implement that complete shell. The full `hbr-chat` layout was not forced into the narrow response panel.

The restored browser connection allowed screenshot review at 1440×900 and 390×844. Native messages loaded and rendered after asking a scoped question, with no conversation or page horizontal overflow. The incident Recovery and History views were also inspected. A fresh load and source progression produced no new console warnings or errors after correcting duplicate sibling section keys from the consolidation pass. Automated validation remains 103 passing tests and a successful production build.

Visual records: [Dashboard desktop](screenshots/onecd-atmosphere/dashboard-desktop.png), [dashboard mobile](screenshots/onecd-atmosphere/dashboard-mobile.png), [native assistant desktop](screenshots/onecd-atmosphere/assistant-desktop.png), [native assistant mobile](screenshots/onecd-atmosphere/assistant-mobile.png), [recovery desktop](screenshots/onecd-atmosphere/recovery-desktop.png), and [history mobile](screenshots/onecd-atmosphere/history-mobile.png).

Fallback: `milestone/14-consolidated-operations` at `274753f` preserves the consolidated layout before this appearance pass. `milestone/15-onecd-atmosphere` records the theme and native-message update.
