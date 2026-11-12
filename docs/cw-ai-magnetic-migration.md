# CW AI Magnetic migration

This migration carries the autonomous WAN monitoring concept into the React and Harbor Elements (Magnetic) starter at [Network monitoring](http://127.0.0.1:5173/network-monitoring). The intended outcome is the same operator journey: Priya supervises a WAN while CW AI owns eligible incidents, explains its evidence, and routes decisions outside its delegated scope. Source truth, response progress, and human ownership remain separately inspectable.

## Preserved source and fallback

The sibling `cw-ai-dashboard` repository remains the working source fallback at commit `36bae062e1b77e8e5fe4d20aa0f4179ec453a57e` (`36bae06`), served at [the original preview](http://127.0.0.1:4173). Its files, Git history, existing milestones, and synced project references are unchanged by the migration. The new implementation lives in `boilerplate-web`; it does not replace the old checkout or write into a home-directory clone.

Milestone 07 remains available at [the preserved three-WAN preview](http://127.0.0.1:4173/milestones/07-wan-examples/index.html), with its existing record, screenshots, and manifest in `cw-ai-dashboard/milestones/07-wan-examples`. Its source tag is `milestone/07-wan-examples`, commit `28ce4c81ff87cd48d8a376536e073b719cd5c1d5`. This historical operator-driven version precedes the autonomous response and remains a fallback rather than the specification for routine manual approval steps.

Five pure modules were initially copied byte for byte from `cw-ai-dashboard/public/` into `src/features/wan/model/`: `model.js`, `agentic-model.js`, `wan-setups.js`, `scale.js`, and `backbone-layout.js`. Their relative imports and deterministic source fixtures are preserved. After that preservation check, the new `agentic-model.js` copy received one intentional source-specific correction: device and collection handoffs capture their own observation time and not-started controller status, without borrowing interface utilization or RUN-017. Interface handoff fields are unchanged, and the other four copied modules remain exact source copies. The base operational model remains available for compatibility; the live journey uses the autonomous response layer rather than exposing the base model's manual operator workflow.

## Journey and facts to retain

- **Explore three complete WANs.** National Backbone has 3,200 routers, 80 device groups, and 4,939 links; Metro Transport has 640, 20, and 931; Regional WAN has 960, 30, and 1,363. Navigation follows domain → device group → router → interface. Counts, actual connection members, reciprocal endpoints, bounded paging, and return scope come from the selected fixture.
- **Supervise autonomous work.** A qualifying source alarm triggers CW AI acknowledgement, investigation, specialist coordination, applicable delegated response, and independent verification. The acknowledgement actor remains CW AI with its confirmation time; acknowledgement does not remove source severity or clear an active alarm.
- **Inspect separate evidence.** Utilization, source time, freshness, source alarm state, job result, current contributor, and incident ownership retain their own meanings. A collection gap preserves last-known evidence and blocks unsupported execution or recovery; it does not fabricate a physical fault. An independent Critical router condition retains its own source identity and workstream.
- **Verify the outcome independently.** A completed job at 08:25 with 86% utilization remains Verifying. Recovery at 08:35 requires current observations, utilization below 80%, five stable minutes, and source clearance. Failed or unknown execution cannot become successful merely because a later sample is healthy.
- **Route genuine exceptions.** Unavailable or inapplicable responses, permission restrictions, target locks, and unsuccessful or unconfirmed results retain the exact reason. Handoff delivery and receiving-engineer acceptance are separate confirmations. Reviewing delivered evidence is read-only; a captured handover remains a reviewed snapshot until explicitly updated.
- **Keep context while work continues.** Scope navigation, minimized workspaces, questions, notes, and incident-specific drafts do not restart or advance execution. Each WAN retains its own investigation and conversation while the session stays open. Evidence can be inspected without replacing the selected or pinned response. Historical inspection is explicitly historical and cannot create current execution or verified recovery.
- **Make intervention explicit.** Pausing further automated changes preserves monitoring and an already confirmed job; it does not claim cancellation or rollback. Resume revalidates current evidence and scope. Ordinary chat questions explain fixture facts and do not issue workflow instructions.

## Components and custom visualization

The application uses the starter’s Magnetic 2.0 theme in dark mode and genuine Harbor Elements for the shell, navigation, buttons, selections, fields, switches, semantic status, cards, breadcrumbs, pagination, modal evidence views, disclosures, timelines, and loading indicators. The WAN schematic remains a custom visualization: stable logical anchors, real member connections, bounded detail, and readable endpoint labels communicate the network relationships. It is schematic rather than geographic and must not invent adjacency or imply live traffic.

| Experience | Implementation |
| --- | --- |
| Monitoring structure | `hbr-layout`, `hbr-text`, `hbr-card`, `hbr-tag`, `hbr-icon` |
| WAN selection and review | `hbr-select`, `hbr-option`, `hbr-switch`, `hbr-button` |
| Scope and bounded navigation | `hbr-breadcrumb`, `hbr-breadcrumb-item`, `hbr-pagination` |
| Agent progress and chronology | `hbr-timeline`, `hbr-timeline-panel`, `hbr-spinner` |
| Findings, records, context and intervention | `hbr-accordion`, `hbr-input`, `hbr-textarea`, `hbr-button` |
| Source evidence and reviewed handoffs | `hbr-modal`, `hbr-key-value-pairs`, semantic read-only rows |

There is no documented specialized AI-response component in this installed Harbor snapshot. The response workspace composes its actual timeline, disclosure, status, loading, and input components. No invented AI custom elements are used. Custom SVG routes and HTML placement retain stable schematic relationships. Custom CSS handles outer page/grid layouts, responsive inventory, focus/arrival transitions, source presence and alarm emphasis; it does not simulate traffic packets. Reduced-motion preferences disable the custom motion. The route also removes the starter header’s fixed minimum width on narrow screens to prevent clipping.

The existing starter home and default redirect remain unchanged. Review controls are a dismissible concept aid rather than an operator task stage. Manual Prev/Next remain paused; Play advances the deterministic source clock every 6.2 seconds. Agent questions, notes, evidence inspection, scope navigation, and pause-further-changes do not reset that clock. Opening a response brings it into view; on narrow screens it is placed before the topology. WAN sessions retain their own scope, sources, response, search, messages and drafts until page reload.

## Verification and limits

The four migrated pure model suites pass **54 checks**, including three focused regressions for handoff evidence across concurrent workstreams. The evidence projection suite adds **12 integration checks** for historical source timing and collection gaps. Run them with `node --test tests/wan-*.test.mjs`. They cover fixture membership and determinism, interfaces and actual link accounting, active-WAN indexes and scoped summaries, bounded geometry and paging, autonomous ownership, exception and collection branches, execution and verification, handoff confirmations, historical restrictions, and conversation continuity. The initial five copies were compared byte for byte with the source modules before the documented handoff correction; the original repository is unchanged. These checks execute local models without contacting a controller or another person.

Final integration verification completed on 2026-11-12:

- `pnpm test`: **72 passed** (6 starter checks, 54 pure WAN/agent checks, 12 source-evidence projection integration checks).
- `pnpm build`: successful. Vite reports its existing advisory about a bundle larger than 500 kB.
- Browser review at **1440×900** and **390×844**, including the expanded response and evidence/review modals. No horizontal document overflow at 390px; captured browser error/warning log was empty.
- Click-through checks: all three setup inventories, domain → device group → bounded router inventory, exact interface evidence, scoped router search, autonomous acknowledgement, source-qualified agent explanations, live source progression to verified 08:35 recovery, independent Critical router routing, telemetry gaps, frozen delivered evidence, and per-WAN investigation/draft continuity.
- Fixed issues found during review: lazy-upgrade pagination defaults, narrow card/shell clipping, stale queue labels after source-title changes, missing interface inspection IDs, modal dismissal from bubbled select events, intervention during historical review, future Critical alarms leaking into older observations, mutable handoff review, and cross-workstream job/source contamination in handoff records.
- Original `cw-ai-dashboard` remains clean at `36bae06`.

Screenshots: [desktop response](screenshots/magnetic-response-desktop.png) and [narrow response](screenshots/magnetic-response-mobile.png). The live review is at [Network Monitoring](http://127.0.0.1:5173/network-monitoring).

All inventories, agents, observations, conversations, procedures, job outputs, handoffs, and acceptance records are deterministic simulations. This prototype connects to no WAN, controller, live AI runtime, or communication service. Session continuity demonstrates interaction behavior; it is not durable production audit storage or authorization enforcement.
