# Combined — Network and live work

Updated: 2026-11-23. Status: **Interactive concept for review.** Iteration cue: **03 · Combined — Live activity**.

Local entry: `/network-monitoring?exploration=combined`.

## Current visual reference

The network presentation now reuses **01 · Operations** directly. World is the default, with the same native World/Schematic switcher in the header. `CombinedNetworkView.jsx` supplies Combined observations and selection callbacks to the shared `WorldMap` and `LogicalMap` renderers exported by `WanOverview.jsx`. Their existing land gradient, pins, white geographic labels, zoom controls, native domain cards, orthogonal schematic routing, and styles replace the earlier custom text-and-line ribbon.

The World view always uses the detailed geographic presentation, with native domain/status cards on the canvas where space allows. Narrow screens and views below 100% zoom use direct pin labels and readable native cards below the map to prevent overlap; this does not move the camera or fit the network automatically. Schematic uses the Operations card layout and actual declared topology; a simple View connections disclosure preserves access on narrow layouts. Domains without a declared location remain accessible without inferred geography. Repeated illustrative captions are removed from the product canvas; the external Simulated control identifies this concept.

## Current layout

The page flows in three rows: **full-width network overview → Attention and Actions in two equal columns → full-width Activity**. Attention precedes Actions when the second row stacks on a small screen. The Home title and the entire Production / All permitted domains / UTC row are removed.

The network stays detailed, with no Expand/Collapse action. Its camera persists through source and layout updates rather than repeatedly fitting the whole world. Dragging at the current scale and explicit zoom-out provide access to domains outside the view; Fit all remains a deliberate control. Selecting scope or reviewing a job preserves the camera and does not confer authority. A transient new-attention cue can still surface a consequential change while the user reads elsewhere.

Activity is the entire job panel, not a second chronological ticker. Each native job card retains its title, scope, actual checkpoint/status, and inspection. Supporting snapshot facts appear automatically in place with a short transition. Hover/focus, reduced motion, source interruption, offscreen state, and a pause control prevent movement from displacing reading. No staged update authorizes a plan or advances execution. Supplied source times remain source times; missing event times are not replaced by a fictional live clock.

Horizontal native Magnetic progress bars represent confirmed checkpoints with stage labels appropriate to each job. They do not estimate time remaining. A compact row of derived status counts describes the rendered jobs; completed assessment, awaiting review, and source-dependent waiting remain distinct. Wide Activity layouts show the three persistent jobs side by side. An opened inspection spans the Activity row with its associated job, preserving readability.

## Page principles

Attention, Activity, and Actions remain the three operating jobs. The ribbon supplies network orientation and relevant observed scope. Minimalism means showing consequential summaries clearly, retaining important work, and revealing supporting detail in context. The page can grow vertically; it does not impose a first-fold content limit.

The stable reading order is overview → Attention and Actions → Activity. Native Magnetic Container cards, typography, progress bars, buttons, tags, and focus treatments retain the One CD midnight language. The network graphic and work associations are custom content inside those surfaces.

## Implemented interactions

- World and Schematic represent six stable domains and their declared connections. The shared responsive presentation keeps names readable and moves native domain cards below the map when needed.
- Selecting a domain highlights related work. It does not filter the dashboard, navigate away, or alter the target/version of an open review.
- **View related work** explicitly filters Activity and Actions. Attention remains global. The filter is labelled and can be cleared. An inspected job or action outside that filter remains pinned and identified.
- Selecting work identifies its associated network scope. **Locate scope** deliberately returns to the ribbon while retaining the inspection. Inspected scope and manual map selection have separate visual treatments.
- The always-detailed World canvas supplies zoom, explicit Fit all, keyboard panning, pointer panning, and Control/Command-scroll zoom. Combined permits zoom-out below 100% and bounded dragging at the baseline scale. Source and layout updates retain its camera within current bounds. Switching representations deliberately opens that representation's own view.
- Domain selection provides read-only Domain → device group → router → interface inspection. Explicit drilldown keeps keyboard focus at the new level. This navigation does not change job authority or initiate a network operation.
- Cross-domain and Platform are explicit work destinations, rather than invented physical nodes. An empty scope stays honestly empty.
- New consequential Attention can be reached through a compact cue when its heading is outside the viewport. It does not replace the currently inspected work. New Actions remain staged while an existing record is being inspected.

## Observation and evidence boundaries

The standalone Combined network fixture lives in `src/features/combined/ribbon-model.js`; it does not mutate the existing Operations WAN fixtures. Known work is explicitly associated with Core/XR-R07, West/XR-R12, and East/Metro East/XR-R19.

The default scene includes explicit incident **INC-104 · Routing intent mismatch** on Core/XR-R07, classified under CFG-INTENT-01 with current-intent and authorized-change evidence. This record is distinct from the earlier drift finding and from job tone. Expected-change and missing-evidence branches do not manufacture it. It stays active through response and verification, becomes resolved only at the verified scoped outcome, and stays last-known during source interruption. Incident badges do not recolor representative router reachability.

The network observations cover representative routers. They do not prove every device, interface, or service in a domain is healthy. Logical connections establish topology, not measured traffic or physical cable routes. Job progress, approval, configuration drift, execution uncertainty, verification capability loss, and a verified correction do not automatically recolor a whole domain.

Interrupted updates retain last-confirmed observations and mark current visibility unavailable. The world view reuses the existing land geometry and declared geographic sample placements. Those concept placements remain documented fixture data and are not claims of real router locations.

The eight main Combined snapshots and ten scenario branches remain the simulated source runner. Hold, revision, authorization, execution, and outcome semantics retain their existing boundaries. The ribbon adds no live backend or production controls.

## Motion

Combined adds a scoped motion layer to the shared Operations presentation: a 480 ms view reveal, an 800 ms connection entrance, staggered 420 ms domain-card reveals, and a quiet 5.6 second halo rhythm. All anchors belonging to a domain share one phase. Domain hover/focus gently enlarges the fixed pin centre; native cards lift by 2 px; selected connections receive a short stationary emphasis. Labels, hit targets, and the pan/zoom transform remain stable.

The rhythm is decorative presentation, not measured traffic or a fresh health sample. Continuous traffic travel remains disabled. Last-known sources and unknown pins do not breathe. Ambient halos pause during close-up map inspection, when the map is outside the viewport, and when the browser is hidden. The native **Pause map motion** control stops the custom layer; **Resume map motion** restores it. Reduced-motion preferences show the final state immediately. All meaning and controls remain available without animation.

Context inspection receives a short reveal. Selection highlights relationships without automatic tours or repeated viewport fitting. Source clock changes do not remount the canvas or replay the entrance.

## Preserved baseline

Use **03 · Combined · Baseline** in the floating switcher, or `/network-monitoring?exploration=combined&layout=baseline`. The baseline is a byte-identical copy of the previous three-section implementation in `src/features/combined-baseline/`. Its original source hashes are:

| File | SHA-256 |
| --- | --- |
| CombinedDashboard.jsx | `053a5656b757811d0033ec89e3fd945d751e12364fbd08d6ecfc0cedd8da658c` |
| combined-dashboard.css | `9338ab5f12d15a21e75e7ea3afa9e386131e9b04613f7db037b27423dff94ae3` |
| combined-model.js | `4f7a3353339f05411c2750bf403ef16183a3f2551e52cb4bac8e28667c8d3429` |

Operations, Governance, and the archived original workforce exploration remain available. The [combined use cases](USE-CASES-AND-INTERACTIONS.md) and [iteration cues](../exploration-options.md) continue to define the broader direction and version scope.
