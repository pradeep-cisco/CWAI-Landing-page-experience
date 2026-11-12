# Live network watch

## Operator outcome

Priya can establish what changed in the WAN, where the condition is located, which agent owns the response, and whether engineering attention is needed. The default landing page is a network watch rather than a collection of inventory totals. Incidents gain prominence without changing the schematic’s anchors or inventing physical adjacency.

## Preserved milestone

The previous Magnetic dashboard is preserved at Git tag `milestone/08-magnetic-dashboard`, commit `368fbea`. Its route is `/network-monitoring`; checking out the tag in a separate checkout restores the previous implementation. The original vanilla dashboard remains untouched at `../cw-ai-dashboard`, commit `36bae06`, served at http://127.0.0.1:4173/.

The existing autonomous response workspace is retained. **A later assistant upgrade must use the documented Magnetic AI Assistant components**, as explicitly requested by the user. This iteration changes the landing watch, attention/feed presentation, and schematic. It does not represent the existing composed Harbor workspace as a finished implementation of that specialized assistant component.

## Story, use cases, and outcomes

| Source state | Visible experience | Priya’s outcome |
| --- | --- | --- |
| 07:55 quiet watch | Every operational domain has a current source observation; the right column shows actual reachability, topology, and interface evidence. | Establish why no active condition currently requires response. |
| 07:58 developing trend | The main domain shows 73% utilization, an elapsed-time trend, and its source time. The watch identifies this as below the configured 80% threshold. | Notice emerging exposure without interpreting it as an alarm. |
| 08:00 Major interface condition | Incident attention takes precedence. The affected domain and actual connection retain Major severity while the response shows CW AI ownership. | Locate the condition and understand autonomous investigation. |
| 08:10 confirmed execution | The source condition remains visible while the agent follows RUN-017. Related observations update one correlated feed item. | Follow work without equating ownership with recovery. |
| 08:25 job complete | The feed records controller completion at 08:25; 86% utilization and the active Major source alarm remain visible. | Recognize that execution success has not established network recovery. |
| 08:35 verified recovery | Only satisfied independent recovery criteria remove the interface response from incident attention. Verification becomes a recent outcome. | Resume the wider watch while retaining evidence. |
| Collection gap | Last-known values and their original times remain explicit; the mini trend stops at the last actual sample. The Major source alarm remains separate. | Understand uncertainty without inferring a physical fault or current metric. |
| Independent Critical router condition | Critical reachability is first in the attention queue, ahead of the Major interface condition and collection gap. Its engineering handoff has separate delivery and acceptance states. | Identify the most urgent scope and required engineering decision. |
| Source clears but response fails or is unconfirmed | The source-cleared domain retains a warning for unverified response; incident follow-up remains open. | Avoid accepting an unsupported successful outcome. |
| Historical inspection | Only the network canvas/evidence become historical. Global watch, response updates, and source attention remain current. | Compare history without fabricating a new current incident or recovery. |

## Visual treatment and interaction

- Midnight gradients and static abstract contours establish depth beneath clean domain surfaces. The background does not imply geographic location.
- Domain names remain HTML labels. Domains stay aggregated; the three WAN fixtures retain their own actual group membership, interfaces, and link counts.
- Domain observations show one relevant source fact, a metric where supported, its trend, and observation time. Other domains do not borrow XR-P1 utilization.
- Mini trends and the detailed attention trend use elapsed observation time on the horizontal axis. They do not interpolate or generate samples.
- A changed domain briefly fades to its new state; an incident connection receives one 900ms arrival trace. Custom reduced-motion rules disable these effects. No continuous packet motion is used.
- Hover/focus emphasizes only actual connections. Selecting a feed observation locates its domain in the network overview without moving anchors. Active alarms remain visible during focus.
- The attention column holds a bounded current condition queue and at most four correlated source/response updates. Critical reachability takes precedence, then the interface condition, then collection coverage. Acknowledgement does not change source severity.
- Following a response replaces the attention column with the existing response workspace. It does not create a third competing column. Minimizing returns to the live watch.
- Connections and raw source alarms remain available through Magnetic disclosures, with existing bounded paging, member-link inspection, and exact router/interface evidence.
- Narrow screens promote active incident attention above the domain overview. Quiet views keep the network first. There is no horizontal document scrolling at 390px.
- Source clock, scope, messages, draft, and source conditions remain independent per WAN. Feed navigation, evidence inspection, and response questions do not reset the source cadence.

## Data boundaries

This remains a working conceptual application over deterministic controller fixtures. Play advances the source story every 6.2 seconds. Manual Prev/Next remain paused. The concept label and source timestamps distinguish this from a production telemetry connection. There are no WAN operations, remote AI calls, or messages sent to engineers.

Static router/domain/response metric tiles are removed. Inventory counts remain subordinate scope information and are available in drill-downs. The new read model does not mutate source or autonomous response state.

## Verification

Verified on 2026-11-12:

- `pnpm test`: **84 passed**, including 12 new watch-model checks for all three WANs, source/response separation, collection gaps, current versus historical records, real event timestamps, and incident priority.
- `pnpm build`: successful. The existing Vite bundle-size advisory remains.
- Browser review at **1440×900** and **390×844**, covering quiet, developing trend, active Major, simultaneous Critical/Major/collection gap, completed-but-unverified execution, independently verified recovery, and unconfirmed execution after source clearance.
- The six-domain National overview fits on the first 1440×900 screen with collapsed navigation. All three WAN examples retain their own actual layouts and source context.
- Feed-to-domain focus, device-group and router drill-downs, Connections disclosure, source-review controls, response opening/minimizing, current-watch preservation during historical inspection, and mobile update disclosure were exercised in the browser.
- At 390px the document width remains 390px. Browser error/warning logs were empty. Abstract SVG contours extend inside a clipped decorative surface and do not cause document overflow.
- On narrow screens active-incident updates default to a collapsed, accessible Magnetic disclosure; they remain available without displacing the primary incident. Desktop updates remain expanded.

Screenshots:

- [Quiet desktop](screenshots/live-watch-quiet-desktop.png)
- [Major incident desktop](screenshots/live-watch-major-desktop.png)
- [Verified recovery desktop](screenshots/live-watch-recovery-desktop.png)
- [Quiet mobile](screenshots/live-watch-quiet-mobile.png)
- [Critical attention mobile](screenshots/live-watch-critical-mobile.png)
- [Expanded updates mobile](screenshots/live-watch-updates-mobile.png)

The original dashboard remains clean at `36bae06`. The prior Magnetic implementation remains recoverable from `milestone/08-magnetic-dashboard`.
