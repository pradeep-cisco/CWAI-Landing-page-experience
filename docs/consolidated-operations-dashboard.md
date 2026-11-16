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

## Magnetic operations tabs — 2026-11-13

Incidents, Watchlist, Changes, and Recent now use the boilerplate's native primary `hbr-tab-group`, `hbr-tab`, and `hbr-tab-panel` components instead of section jump links. One panel is visible at a time; all four remain mounted so selected cases, secondary tabs, samples, and expanded evidence survive switching. Data health remains outside the tabs. The WAN overview, Updates, response model, and existing One CD atmosphere are unchanged.

Native count badges appear only when there are items: active incidents, developing trends plus events under correlation, configuration differences, and retained outcomes. Zero-count badges are omitted, leaving just the tab title. A promoted trend is not counted again as a developing condition. A configuration difference retained after assessment is still a difference, not an outstanding operator task. New source observations update the counts without switching the operator's selected tab.

Follow incident selects Incidents and the case's Recovery view. Existing View outcome and Recent links activate the matching panel before scrolling to its labelled region. Nested Incident and Changes tab events cannot change the outer selection. Native manual keyboard activation and overflow arrows remain available. Panel reveals use a brief transition, suppressed with reduced motion.

Verification is complete: 139 existing tests pass; the production build passes. Browser checks covered all four tabs, secondary tab retention, Watchlist → incident Recovery, completed incident → Recent, keyboard arrow focus and Enter activation, and mobile overflow controls. Desktop 1440×900 and mobile 390×844 screenshots were reviewed; no page horizontal overflow or browser warnings/errors were observed.

Visual records: [Active incident desktop](screenshots/operations-tabs/incidents-desktop.png), [active incident mobile](screenshots/operations-tabs/incidents-mobile.png), [Recent desktop](screenshots/operations-tabs/recent-desktop.png), and [Recent mobile](screenshots/operations-tabs/recent-mobile.png). Fallback: `milestone/16-noc-agentic-response` at `1df5c71` preserves the previous stacked-section layout and complete agentic story.

## Compact WAN domains — 2026-11-13

Domain cards now use a stable 104px height with the existing schematic order and actual connections. Healthy domains show their name, inventory scope, and a native Magnetic reachability icon with an accessible label and hover detail. Routine Observed timestamps, Reachable text, and empty source-alarm labels are removed from these cards. Current outbound readings and their small trends remain where supplied; telemetry loss instead shows the last-known value and source time.

Incidents appear only when the domain has an actual case in the shared incident queue. Correlated source alarms do not inflate that number. Source-cleared but unresolved cases retain their incident label and unverified state. Unreachable and Telemetry gap labels stay explicit; reachability is checked independently of telemetry. The overview summary uses the same actual incident queue, and its response action remains available for unresolved cases after source clearance. Device-group and router source-alarm details retain their existing meaning.

Verification is complete: all 139 tests and the production build pass. Additional source-rendering checks covered quiet, correlated source alarms, failed and unconfirmed execution after source clearance, a Critical router with a collection gap, and a cross-domain telemetry gap. Desktop 1440×900 and mobile 390×844 review found no page overflow or card-content overflow. A crowded exception footer was moved beside its reading before final verification. Browser warnings/errors were empty.

Visual records: [Overview desktop](screenshots/compact-domains/overview-desktop.png), [exceptions desktop](screenshots/compact-domains/exceptions-desktop.png), [exceptions mobile](screenshots/compact-domains/exceptions-mobile.png), and [last-known readings](screenshots/compact-domains/last-known-desktop.png).

## Two-row domain rectangles — 2026-11-13

The next refinement replaces the 104px domain cards above with stable 80px rectangles, approximately 210px wide at the primary desktop layout. The first row contains the domain name, independent reachability icon, and actual incident count only when nonzero. The second row contains inventory scope for healthy domains, a router-scoped outbound reading for a developing or active condition, or an explicit exception such as Telemetry gap, Unreachable, or Recovery unverified. Decorative domain stack icons, chevrons, and always-visible sparklines are removed.

Opening a domain retains its group topology and now presents its source detail, exact observation time, and available trend above the group map. Last-known data stays marked as last known. The overview never shows a stale percentage as a current reading. Correlated source records still cannot become additional incident cases. Source-cleared failed or unconfirmed responses remain visible as unverified recovery.

The custom map-node pseudo-element ring and surrounding glow are removed entirely. Native One CD card hover and keyboard focus remain; related-connection emphasis and data-arrival animation are preserved. All domain cards keep the same height across conditions so the logical ordering and routing remain stable.

Verification is complete: 139 tests and the production build pass. Nine rendered source scenarios covered quiet, rising trend, active congestion, related alarms, verified recovery, failed/unconfirmed execution after source clearance, combined unreachable/telemetry-gap, and last-known data. Desktop 1440×900 and mobile 390×844 checks found no card-content or page horizontal overflow. Native keyboard Tab navigation and Enter activation opened the correct domain; inspection retained the trend and source metadata. Computed styles confirm the custom outer ring is absent.

Visual records: [Overview desktop](screenshots/two-row-domains/overview-desktop.png), [overview mobile](screenshots/two-row-domains/overview-mobile.png), [domain inspection](screenshots/two-row-domains/domain-inspection-desktop.png), and [native keyboard focus](screenshots/two-row-domains/keyboard-focus-desktop.png).

## Schematic spacing and targeted trends — 2026-11-13

Routine Reachability current and Current telemetry labels are removed from the overview's status strip. When there are no incidents or source exceptions, the entire strip is omitted. Actual incident attention, unreachable-router counts, and telemetry gaps remain available. Domain-row routing lanes increase from 32px to 56px on desktop, with 24px row gaps on the narrow layout. Cards remain 80px tall and their connection routes still derive from the same inventory.

Fresh router-scoped interface trends return as 48px mini graphs in the second card row. The row retains the router and observed percentage; graph and source labels identify outbound utilization. A native warning icon indicates a reading above the configured 80% limit, independently of whether its latest slope is rising or falling. A below-limit rise uses the native trend-up icon. Recovery keeps its verified/unverified text, and stale data keeps Telemetry gap / Last known without a live mini graph or elevation indicator. Detailed trends and source times remain in domain inspection.

Verification is complete: all 139 tests and the production build pass. Seven additional source-rendered states checked quiet, below-limit rise, elevated rise, elevated fall, verified recovery, unverified recovery, and stale data. Desktop 1440×900 and mobile 390×844 screenshots were reviewed; card content fits and there is no page horizontal overflow. Quiet-state inspection confirms the empty status strip is absent.

Visual records: [Elevated overview desktop](screenshots/schematic-spacing-trends/overview-desktop.png), [overview mobile](screenshots/schematic-spacing-trends/overview-mobile.png), [developing trend](screenshots/schematic-spacing-trends/developing-trend-desktop.png), and [quiet overview](screenshots/schematic-spacing-trends/quiet-desktop.png).

## Knowledge graph and Admin diagnostics — 2026-11-14

Data health now lives in Admin, alongside the new Knowledge graph workspace and the existing Automation content. Earlier descriptions of Data health outside the Home operations tabs document previous milestones. The WAN overview and Updates remain unchanged; operational source exceptions retain their existing context. See the [knowledge graph Admin journey, model boundaries, validation, and visual records](knowledge-graph-admin.md).

The [radial explorer canvas](knowledge-graph-canvas.md) now follows the reference prototype's hop rings, entity sectors, colored relationships, badges, expansion, viewport controls, and grouped inspector. It replaces the first Admin version's column layout while retaining the existing Magnetic theme and model provenance.

## Initial experience overview presentation — 2026-11-16

The floating Preview panel now launches **Experience overview**, a six-chapter presentation in a native Magnetic modal. It uses National Backbone as an independent example; it does not switch the operator's selected WAN, change the source observation, or navigate away from the current workspace. Source-story playback pauses during the presentation and resumes only if it was already playing. The existing WAN overview and Network watch are unchanged.

| Chapter | Visual and interaction | Priya's outcome |
| --- | --- | --- |
| Take the watch | Six-domain schematic derived from the National Backbone fixture and the existing logical layout. The hierarchy connects domain, device group, router and interface. | Understand the network at a useful scale. |
| Find your focus | Select WAN overview, Network watch or the operational tabs. The selected region and its explanation change together. | Know where to find the picture, updates and ongoing work. |
| See changes early | Two recorded samples, 46% at 07:55 and 73% at 07:58, are plotted against the 80% configured limit. | Notice developing exposure without mistaking a trend for an outage. |
| Follow the response | Select Investigate, Remediate or Verify inside the same CW AI-owned CNC-1042 case. | Follow autonomous work without starting each task or coordinating specialists. |
| Trust the outcome | Compare the completed 08:25 job at 86% with verified 08:35 recovery at 54%. Source clearance and the stability check are separate proof. | Distinguish completed execution from measured recovery and retain operator control. |
| Explore the context | Four entity colors and typed relationships explain Admin's Knowledge graph. Select Device, Interface, Service or Config to inspect an example source and relationship. | Understand the supporting network context and evidence. |

Previous/Next, direct chapter selection, arrow keys and Escape are supported. The footer stays reachable while longer content scrolls on mobile. The native modal renders outside the app's stacking contexts so it clears mobile navigation. On dismissal, keyboard focus returns to the launcher. Motion uses restrained diagram arrivals, a source-status pulse and chart drawing, with reduced-motion alternatives; essential content stays visible if animation is suspended. The prototype label remains explicit and no live controller, agent or knowledge-graph connection is claimed.

Verification: all 160 existing tests and the production build pass. Desktop 1440×900 and mobile 390×844 review covered all six chapters, layout-area selection, response stages, recovery comparison, entity inspection, repeated arrow navigation, modal scrolling and dismissal. A scrolled mobile slide returns to the top on Next. Opening the National example from Metro Transport at 07:58 preserves Metro Transport and 07:58 after closing. The launcher also opens from Admin. No horizontal overflow was found in the reviewed views.

Visual records: [Overview desktop](screenshots/experience-overview/overview-desktop.jpg), [layout explanation](screenshots/experience-overview/layout-desktop.jpg), [recovery comparison](screenshots/experience-overview/recovery-desktop.jpg), [knowledge context](screenshots/experience-overview/context-desktop.jpg), [overview mobile](screenshots/experience-overview/overview-mobile.jpg), and [trend mobile](screenshots/experience-overview/trend-mobile.jpg). The editable chapter copy lives in `src/features/wan/overview/experience-content.js`.

## Minimal outcome presentation — 2026-11-16

The overview now has its own presentation language: warm off-white canvas, large Inter headlines, restrained blue/violet accents, a single explanatory diagram, short supporting copy, and discreet navigation dots. It uses native HTML controls and a native modal dialog, independently of Magnetic. The launch action, product theme, WAN schematic, Network watch, operational tabs and Admin workspace retain their existing treatment.

Persona names, narrative times, incident/job IDs, side commentary cards and repeated outcome labels are removed. The six outcome headlines are: **Understand the network at a glance**, **Know where to look**, **Notice what needs attention**, **Let intelligence move work forward**, **Confirm recovery with evidence**, and **Understand the supporting context**. Only the layout slide resembles the product, using a simplified selectable outline.

The visuals demonstrate aggregation into six domains, layout-area selection, distinct developing-signal and active-incident emphasis, four selectable autonomous-work stages, execution versus evidence-backed recovery, and selectable entity relationships. The National Backbone illustration retains the fixture's actual domain relationships without creating or changing a WAN model. Recovery comparison is an explanatory interaction and never initiates a controller action.

Motion includes a bounded particle-gathering entrance, scene transitions, a restrained attention ripple, and confirmation transitions. A motion control pauses the animations. Reduced-motion preferences show the settled composition. Native dialog behavior contains focus, blocks background interaction and supports Escape; close and Done restore the launcher and previous scroll setting. Arrow keys, Home/End, Previous/Next and direct slide selection are available.

Verification: 160 existing tests and the production build pass. Browser review at 1440×900 and 390×844 covered the slide visuals, all local controls, repeated arrow navigation, motion pause/resume, dismissal, retained WAN/source state, and responsive overflow. Previous visual records above are retained. Current visual records are in `docs/screenshots/experience-overview-minimal/`.

## Geographic WAN overview — 2026-11-16

The WAN overview now offers World and Schematic modes through the native Magnetic view switcher. World uses real Natural Earth coastlines, explicit illustrative domain locations, inventory-derived logical connections, and the existing native domain cards. Core can span several geographic markers while remaining one logical domain. Source conditions and incident counts retain their existing meaning. Pin/card drill-down and connection-member inspection reuse the existing operator flows.

The new canvas adds restrained theme-based land shading, connection activity, and related-route emphasis. Missing observations stop ambient route activity and retain dashed last-known connections. Narrow layouts place readable cards below a compact map, with no inferred geography for lower hierarchy levels. Network watch, the agentic response, operational tabs, Admin, and the minimal experience presentation remain unchanged.

See the [map experience, source provenance, validation, limitations, and visual records](world-map-data.md). The pre-map milestone remains available at `b1ca97c7e8800cfd187e7a20981d32fb63969e09`, and the current Schematic option preserves its overview presentation.
