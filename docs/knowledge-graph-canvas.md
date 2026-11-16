# Radial knowledge graph explorer

Iteration: 2026-11-14. Source experience: [Knowledge Graph Exploration Tool](https://glad-stony-91874899.figma.site/).

This supersedes the ordered-column canvas described in [the first Admin implementation](knowledge-graph-admin.md). The source's graph composition and exploration mechanics are the reference; Crosswork AI keeps its existing Magnetic fonts, native controls, application shell, and One CD dark tokens.

## Reference inspection

The reference was inspected in the signed-in browser, including initial device context, depth 1 and 2, node selection, inspector relationship navigation, Back, hidden-neighbor badges, connection-summary cards, relationship filters, simplified mode, label control, and viewport fit. The canvas contains:

- A dotted background, a central focus entity, circular node glyphs, subtle entity-type sector fans, and concentric hop rings.
- Four stable colors: cyan device, purple interface, lime service, and orange configuration. Entity labels and type chips make their identity independent of color.
- Relationship-colored arrows: HAS_INTERFACE cyan, RUNS_SERVICE lime, CONFIGURED_BY orange, CONNECTS_TO periwinkle, DEPENDS_ON pink. Directed upstream relationships use dashes relative to the current focus.
- Per-node total-degree and outside-view badges. Connection summaries distinguish direction, visible endpoints, hidden endpoints, and relationship types.
- Depth controls and ring counts in the upper left; zoom, fit, label, and simplified-view controls on the right; relationship and entity legends below; a relationship filter popover.
- A right inspector with Identity, Source, Attributes, Schema coverage, and grouped Relationships. Canvas selection inspects a node without recentering. Following an inspector relationship changes focus and creates a breadcrumb/Back trail.

Reference screenshots: [radial](screenshots/knowledge-canvas/reference-radial.jpg), [multi-hop](screenshots/knowledge-canvas/reference-multihop.jpg).

## Adapted interaction journey

| Use case | Canvas and inspector behavior | User outcome |
| --- | --- | --- |
| Understand the mapping | Open the service context at depth 2: the supplied SR policy, its intended configuration, its interface dependency, owning router, and peer interface appear together. | Understand how all four entity types relate without inferred hosting records. |
| Find an entity | Search by ID, name, address, or source attributes; narrow by entity type. Results carry type and provenance. Recent entries retain visited entities. | Reach the intended object without browsing thousands of routers. |
| Inspect in place | Single-click or keyboard-select a circular node. Its neighborhood/path is emphasized while the focus and camera remain stable. | Inspect evidence without losing the surrounding network context. |
| Follow context | Follow a grouped inspector relationship, double-click a node, or press R to refocus. Breadcrumbs and Back retain the exploration trail. | Move through device, interface, service, and configuration context and return reliably. |
| Reveal neighbors | Read a node's total-connection summary; expand hidden neighbors locally with its + badge. Collapse recomputes branch ownership rather than deleting shared entities. | Investigate a local branch without repeatedly increasing the entire graph depth. |
| Narrow relationships | Toggle individual edge types in the native filter popover. Nodes and hop geometry remain stable; the relationship legend reflects the drawn edges. | Separate physical connectivity from ownership, service dependency, and configuration links. |
| Navigate a dense graph | Drag to pan, scroll or use buttons to zoom, and fit the graph. Arrow keys pan; +/- zoom; Home/0 fits. Simplify mode removes labels, badges, sectors, and legends for a topology-only view. | Control visual density without changing the source model. |
| Validate evidence | Open Identity/Source, filter all attributes, show more than the first six, copy values, inspect schema coverage, or open the matching schema definition. | Verify the origin and structure of an entity rather than treating the graph as decoration. |
| Inspect a query snapshot | Visualize a read-only query result. The graph and inspector remain on the original returned records/time, including local navigation. Disconnected returned entities occupy a separate result ring. | Keep a repeatable investigation result as current observations advance. |

Native disclosures, tab indicators, graph position transitions, and interaction emphasis supply restrained motion. Pan responds directly to pointer movement; unrelated source updates do not steal focus. Reduced-motion preferences suppress the custom transitions. At compact zoom, type initials and the selected entity's label replace overlapping names and badges; zooming in restores detail. All nodes remain selectable and keyboard accessible.

## Current data and limits

This remains an illustrative model derived from the selected WAN's inventory and supplied evidence. It is not a live knowledge graph integration. The initial service-centered view has five entities across all four types in the national WAN. Expanding XR-P1 locally reveals 16 entities without changing the focus. The XR-P1 shortcut opens the recorded router at one hop; search and recentering support any supplied entity.

The model deliberately does not fabricate RUNS_SERVICE hosting relationships to match the reference's sample data. The observed service depends on the recorded interface and is configured by the supplied intent record. Physical CONNECTS_TO edges remain bidirectional. Upstream direction and last-known source data have separate dash treatments and legends. Query results never borrow newer current-model attributes.

The canvas displays at most 64 entities and discloses additional scope. Search returns a bounded set with refinement guidance. The query engine retains its read-only subset, 100-root-record limit, and 500-projected-entity limit. Disconnected query entities are not assigned invented hop distances. Expanded/selected entities are prioritized within the canvas bound.

Graph indexing is cached by immutable source object and relation subset; connection summaries use indexed adjacency. Expansion, collapse, path finding, direction counts, source replacement, and disconnected result handling have focused tests.

## Verification and visual records

Verification is complete: all 160 automated tests and the production build pass. The build retains the existing large-bundle advisory. Twelve new explorer tests cover shared-branch collapse, expansion under a display cap, direction/visibility summaries, true paths, disconnected results, deterministic geometry, independent relation filters, and immutable source replacements.

Browser checks covered pointer and keyboard selection, stable camera after inspection, local expansion/collapse, relationship evidence, unchanged node positions under edge filtering, connection cards, pointer/keyboard pan, wheel/button zoom, fit, simplified mode, label visibility, attribute search beyond the first six fields, Show all, clipboard copy, relationship navigation/Back, entity search, schema links, and query snapshot navigation after source advancement. All three WAN examples were checked. Desktop 1440×900 and mobile 390×844 screenshots were reviewed; the mobile page has no horizontal overflow. No new browser warnings or errors appeared after the final fixes.

The current One CD theme's computed colors were verified in the browser. Device/HAS_INTERFACE uses `--accent-c-default`, interface uses `--data-viz-categorical-4-gradient-default-start`, service/RUNS_SERVICE uses `--data-viz-categorical-8-gradient-default-start`, configuration/CONFIGURED_BY uses `--data-viz-categorical-5-gradient-default-start`, CONNECTS_TO uses `--accent-a-default`, and DEPENDS_ON uses `--accent-b-default`.

- [Service context desktop](screenshots/knowledge-canvas/service-context-desktop.jpg)
- [Expanded context desktop](screenshots/knowledge-canvas/local-expansion-desktop.jpg)
- [Connection summary](screenshots/knowledge-canvas/connection-summary-desktop.jpg)
- [Relationship evidence](screenshots/knowledge-canvas/relationship-evidence-desktop.jpg)
- [Historical query snapshot](screenshots/knowledge-canvas/query-snapshot-desktop.jpg)
- [Full Admin page](screenshots/knowledge-canvas/admin-full-desktop.jpg)
- [Explorer mobile](screenshots/knowledge-canvas/explorer-mobile.jpg)
- [Filters mobile](screenshots/knowledge-canvas/filters-mobile.jpg)
- [Inspector mobile](screenshots/knowledge-canvas/inspector-mobile.jpg)

## Preserved work

Data health remains under Admin, and Automation retains the existing Admin content. Home's WAN schematic, Updates panel, operational tabs, and agentic incident response flow are unchanged. Previous Admin screenshots and journey remain in [knowledge-graph-admin.md](knowledge-graph-admin.md). The earlier committed application is preserved at `milestone/17-refined-operations-overview` (`310b6e4`). No push or deployment is part of this iteration.
