# Knowledge graph and Data health in Admin

Updated 2026-11-14. This iteration adapts the workflows in the [knowledge graph reference prototype](https://glad-stony-91874899.figma.site/) into Crosswork AI's existing Magnetic One CD dark application.

The subsequent [radial canvas iteration](knowledge-graph-canvas.md) supersedes this document's original entity-lane visualization, 36-entity canvas limit, and screenshot treatment. This document preserves the first Admin journey and underlying model/query boundaries.

## Operator outcome

Home remains focused on the WAN overview, operational incidents, Watchlist, Changes, Recent outcomes, and the existing Updates panel. Data health moves into Admin; source gaps and independently confirmed reachability exceptions remain visible in their operational context. The WAN schematic and Updates presentation are unchanged.

Admin now has three native Magnetic tabs: Knowledge graph, Data health, and Automation. Data health opens directly to the existing source-diagnostics matrix and retains its evidence-inspection actions. Automation retains the previous Admin content.

## Reference and adaptation

The reference was inspected after the user completed Cisco sign-in. Its useful workflows are entity search, graph traversal, entity attributes and provenance, relationship inspection, schema browsing, and a GraphQL query console with examples, history, saved queries, JSON results, and graph visualization.

The implementation carries those workflows into the application's existing fonts, One CD tokens, native buttons, tabs, inputs, selectors, checkboxes, disclosures, tags, and key-value pairs. It does not embed the reference site or copy its font/color treatment. The graph itself is a specialized SVG visualization, with ordered entity-type lanes and native controls around it.

## Visual journey and interactions

1. **Explore context.** Admin opens to Knowledge graph → Explore. Type shortcuts show the selected WAN's entity counts. Search presents a bounded result list with entity type and source. The canvas initially focuses on XR-P1, while the right inspector supplies identity, source time, attributes, schema coverage, and relationships.
2. **Follow a relationship.** Selecting a graph node updates the inspector without recentering the canvas. Relationship links inspect their target. “Explore from this entity” makes that target the new traversal root. The graph is capped at 36 visible entities; the operator can choose one to four hops, narrow relationship types, show labels, zoom, or fit the canvas. Omitted entities are disclosed explicitly.
3. **Understand the model.** “View schema” opens the selected entity type, even after repeated cross-tab requests. Schema search finds types or attributes. Required/optional fields, data types, allowed targets, and cardinality explain how the source maps into the model. “Browse entities” returns to filtered exploration.
4. **Investigate with a query.** Four examples cover edge routers, device context, interface dependencies, and configuration context. Run or Ctrl/Cmd+Enter executes the supported read-only subset against the selected illustrative model. Results include actual projected JSON fields, returned-entity shortcuts, errors or empty states, and “Visualize result.” Queries can be saved per WAN in local browser storage; history lasts for the mounted workspace.
5. **Keep evidence stable.** A visualized query retains the nodes, relationships, and source timestamp from execution. If current source observations advance, the graph identifies the older snapshot and the current model time. Its inspector continues to show that snapshot's attributes. Returning to traversal explicitly resumes the current model.
6. **Inspect collection quality.** Data health is a separate Admin tab, expanded initially. Its source matrix and source-evidence actions remain available without occupying Home. All Admin and knowledge-graph tabs preserve their own state while switching views.

Native tab/disclosure transitions and graph selection emphasis provide restrained feedback. The existing application's reduced-motion treatment is retained. On smaller screens the browser, canvas, and inspector stack; the canvas scrolls internally without widening the page.

## Data and semantic boundaries

- This is an interactive prototype using the selected WAN's deterministic inventory and supplied observation/evidence fixtures. It is not connected to a live knowledge graph, controller, agent service, or external query endpoint.
- Entity types are NetworkDevice, Interface, Service, and Config. The national fixture contains 3,200 routers, 9,878 physical interface endpoints, one observed SR policy, and three supplied configuration records. Counts derive from this model rather than the reference site's sample counts.
- Relationships support HAS_INTERFACE, CONNECTS_TO, DEPENDS_ON, CONFIGURED_BY, and schema-defined RUNS_SERVICE. No device-hosted service instances are invented to populate RUNS_SERVICE. The observed SR policy instead retains its supplied interface dependency scope.
- Physical CONNECTS_TO edges are bidirectional and have no arrow. Directed dependencies and ownership edges have arrows. Delayed observations keep their last-known values/time and dashed source treatment. A telemetry gap does not imply a router is unreachable.
- Interface utilization is available only where an observation was supplied; it is not copied onto peer devices. The XR-P5 configuration difference remains evidence, without an invented cause or repair result.
- The query console supports a bounded, read-only GraphQL subset with field projection. It rejects mutations, variables, aliases, fragments, introspection, unsupported fields, and multiple operations. Root results are capped at 100 and projected entities at 500. “Matching root records” and visible graph entities are distinct counts.
- Saved queries stay local to this browser and WAN. They are not shared or synchronized with a backend.

## Verification and visual records

The 148 automated tests pass after correcting the new rendered-UI test's multi-class selector. The production build passes, with the existing bundle-size advisory. Meaningful model tests cover all three WAN fixtures, bounded traversal, source gaps, observed-only attributes, read-only query behavior, projection, and retained snapshots. The rendered integration check verifies Data health is absent from Home and available in Admin with independent reachability evidence.

Browser review covered search, attribute filtering, node keyboard selection, relationship filters, hop depth, labels, fit/zoom, inspector-to-schema links, schema empty states, examples, save/history, query errors/empty results, visualization, source-time advancement, source evidence, and Home/Admin navigation. Desktop 1440×900 and mobile 390×844 layouts were reviewed. The mobile page stays 390px wide; graph overflow is internal. No new warnings or errors were recorded after the final fixes.

- [Graph desktop](screenshots/knowledge-admin/graph-desktop.jpg)
- [Graph mobile](screenshots/knowledge-admin/graph-mobile.jpg)
- [Schema desktop](screenshots/knowledge-admin/schema-desktop.jpg)
- [Schema mobile](screenshots/knowledge-admin/schema-mobile.jpg)
- [Query desktop](screenshots/knowledge-admin/query-desktop.jpg)
- [Data health desktop](screenshots/knowledge-admin/data-health-desktop.jpg)
- [Data health mobile](screenshots/knowledge-admin/data-health-mobile.jpg)

## Fallback

The previous application is preserved at `milestone/17-refined-operations-overview`, commit `310b6e4984db6d2b0f1586933d6b0251a9ff7745`. This task has not pushed or redeployed the new Admin experience.
