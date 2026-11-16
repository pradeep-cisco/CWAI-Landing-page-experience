# World-map geography and illustrative domain locations

The WAN world view uses real land geometry from [Natural Earth 1:110m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson). Natural Earth states that its raster and vector map data are [in the public domain](https://www.naturalearthdata.com/about/terms-of-use/). No country or disputed-boundary layer is included.

`src/features/wan/model/world-land.json` contains projected SVG path strings generated from that source on 2026-11-16. It retains 119 land polygons and 4,479 source coordinates after omitting eight Antarctic polygons entirely south of 60°S. The original source's SHA-256 is `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`. The source URL, license URL, extent, point count and source hash are also stored in the asset.

The map uses an equirectangular projection with equal angular scale on x/y, central meridian 0°, longitude extent −180° to 180°, and displayed latitude extent 84°N to 60°S. Its land canvas begins at x=30, y=160 in a 1000×650 coordinate system. Projection equations are `x = 30 + (longitude + 180) × 940 / 360` and `y = 160 + (84 − latitude) × 940 / 360`. SVG coordinates are rounded to two decimals. The projection has the usual high-latitude area distortion and is an operational orientation aid, not a distance-measurement tool. The 1:110m coastline is generalized; small islands and exact city coastlines are not resolved.

## Domain placements

Domain anchor coordinates and card positions are explicit **illustrative presets**, separate from the inventory. They do not assert received site locations or customer geography. Names are never geocoded or used to invent coordinates. National Backbone's West, North, East, South and Metro examples span western North America, northern Europe, eastern Asia, southern Africa and Southeast Asia. Core has multiple location markers across North America, Europe and India; it is represented as a logical multi-region domain, not a single physical site. The Metro Transport and Regional WAN examples also use explicitly declared illustrative placements.

Changing a domain name, inventory order or alarm condition cannot move its anchor. A domain without a declared placement remains in `unplaced`; its actual connection remains in `unmappedRoutes` rather than acquiring a fabricated location. Inventory bundles preserve their original IDs, endpoints, physical member IDs and member counts. Curved routes are display geometry for aggregate logical relationships and do not claim actual cable routes or geographical circuit paths. No map action changes the active WAN, its inventory, service evidence or controller operations.

The pure model and asset live in `src/features/wan/model/world-map.js` and `world-land.json`. Tests check recognizable land positions, ocean exclusions, projection ordering, finite coastline coordinates, source membership, nonoverlapping cards, stable positions, multi-region Core and unknown-location handling.

## Operator experience

World is the initial overview mode. The native Magnetic World / Schematic view switcher retains the existing schematic as an alternative, with a separate selection for each WAN example. Entering a domain opens the existing logical device-group topology; returning to all domains restores the selected overview mode. No geographic placement is inferred for routers or interfaces.

Native 80px domain cards retain the shared incident queue, independent reachability, current router-scoped outbound trend, and explicit stale or unverified state. Selecting a pin or card opens its domain. Hovering or focusing a domain emphasizes its connected routes; active source conditions remain visible when unrelated connections are subdued. Selecting a connection, including with Enter or Space, opens the existing member-link evidence inspector.

Blue/violet land shading and a restrained eastward pink tint use the current One CD theme tokens. A small moving dash on each current connection supplies ambient activity; it does not encode packet rate or measured traffic direction. Routes without current observations are dashed and have no moving dash. Reduced-motion preferences suppress the ambient animation. The right Network watch panel, operational tabs, agent response, and Admin experiences are unchanged.

Desktop uses the full 1000:650 aspect ratio so coastlines do not stretch. At canvas widths of 760px or less, the map uses a compact geographic viewport with preserved proportions and readable labels, followed by the same native domain cards in a grid/list. Geographic marker positions and logical relationships do not change with incident severity. Unknown placements remain listed separately.

## Validation and visual records

All 178 tests and the production build pass. The build retains the existing advisory about the main bundle size; there are no build errors. Browser warning/error logs were empty during the final review.

The model and rendered UI suites cover all three WAN examples, exact inventory bundle membership and member counts, developing utilization, ongoing source alarms during remediation, failed or unconfirmed execution after source clearance, verified recovery, collection gaps, Critical reachability precedence, and existing logical drill-down.

Browser review covered National Backbone, Metro Transport, and Regional WAN; the native view switcher; domain drill-down and return; keyboard connection inspection; active incident emphasis and independently verified recovery. Screens were reviewed at 1440×1000, 1280×900, and 390×844. Mobile retained all six National cards at 80px height with no horizontal page overflow. The preview remains fixture driven; this work does not connect a live controller or a geographic inventory service.

Visual records: [National incident desktop](screenshots/world-map/national-incident-desktop.jpg), [National incident mobile](screenshots/world-map/national-incident-mobile.jpg), and [National quiet desktop](screenshots/world-map/national-quiet-desktop.jpg).

Fallback: the pre-map implementation is preserved in commit `b1ca97c7e8800cfd187e7a20981d32fb63969e09`. Schematic mode also remains available in the current product.

## Flat map appearance refinement — 2026-11-16

The World overview now has an opaque, uniform theme surface. The map viewport's radial backgrounds are removed so the gradient appears only within the actual land paths. The page's surrounding One CD atmosphere stays outside the WAN container. The flat SVG projection retains equal rendering scale and `xMidYMid meet`, without a perspective transform or tilted plane.

The production build passes. Desktop 1440×900 and mobile 390×844 screenshots were reviewed. Computed styles confirm no background image on the viewport, a solid opaque container, and no map transform; the mobile page has no horizontal overflow. Updated visual records: [flat map desktop](screenshots/world-map/flat-treatment/desktop.jpg) and [flat map mobile](screenshots/world-map/flat-treatment/mobile.jpg).
