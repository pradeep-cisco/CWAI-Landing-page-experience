# Magnetic and Harbor Elements Component Map

Use `component-map.json` as the machine-readable source for application code generation, code-to-Figma conversion, and Figma-to-code conversion.

## Resolution Order

1. Identify the outer source component and its behavior.
2. Read its entry in `component-map.json`.
3. Select the Magnetic Figma target or Harbor context node.
4. Read the selected Harbor context usage documents before you generate code.
5. Preserve source metadata when you must use a primitive.

## Application Code From Scratch

Use the map before selecting Harbor components.

Infer the required Magnetic component job from the user's goal, interaction, content, and data shape. Select the matching `mappings` entry. Treat its `magneticNode`, `figmaTargets`, and `selection` as design intent.

Resolve `harborContextNodes` from that entry. Read each selected Harbor usage document before generating code. The Harbor documents own component APIs and syntax.

Use blocks and component families as flexible starting points. Let the user's design request control the final composition.

## Link and Button Rule

`hbr-link` navigates to a destination or starts a download.

`hbr-button` performs an action.

A text or link-styled `hbr-button` remains a button. Map it to Magnetic `button`.

Do not map `hbr-link` to Magnetic `button`. Use an attached link member when the parent component provides one. Otherwise, render a Magnetic-style text-link primitive and add the metadata defined by `figmaMetadata`.

## Harbor-only Primitives

The JSON map defines Harbor-only and attached components under `harborOnlyAndAttached`.

When Figma metadata identifies one of these primitives, resolve its `harborContextNodes`. Read the shared document and the document for the active framework profile. Then generate the documented Harbor component syntax.

Do not generate code from visual similarity alone when the metadata is present.

## Card Selection

- Use `container-card` only for `<hbr-card container>`.
- Use `status-card` for one status or KPI.
- Use `statistics-card` for a value with a trend or delta.
- Use `health-card` for related health measures.
- Use `basic-card` for every other non-container card.

## Notifications

Map a standalone notification indicator to Magnetic `badge`.

Use an attached status icon inside notification banners.

Do not emit the attached status icon as a separate sibling component.

## Viewport Capture

Use the requested viewport width.

Extend the Figma frame to the full vertical scroll height.

Load content that appears during scrolling.

Render each fixed or sticky element once.

Do not create other viewport sizes unless the user requests them.

## Known Context Gaps

The current map records a context gap for Map, Sankey, and standalone Tree View code generation.

Do not invent Harbor APIs for these entries. Add or update the related Harbor context document before code generation.

Detailed table and long-collection generation guidance is deferred.
