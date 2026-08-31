# Figma Layout Fidelity

Use this reference only for Figma-to-code generation. It defines how to preserve frame geometry while using Harbor Elements components.

## Fidelity Boundary

Match spacing between component roots and layout containers exactly.

Let the documented Harbor component variant and size control spacing inside a component. Do not override Shadow DOM or component-part spacing to force a visual match. Report a component parity gap when the mapped Harbor component cannot reproduce the Figma instance geometry.

## Required Evidence

Use structured Figma design context as the primary source. Use screenshots for visual validation only.

When the host provides Figma tools, read the target node with its design-context tool before writing code. Inspect a smaller sublayer when a large frame response omits layout data. Do not estimate spacing from a screenshot when structured layout data is available.

Record these values for each relevant frame or container:

- node ID and hierarchy path
- width and height at the requested viewport
- `layoutMode` and `layoutWrap`
- `itemSpacing` and `counterAxisSpacing`
- `paddingTop`, `paddingRight`, `paddingBottom`, and `paddingLeft`
- `primaryAxisAlignItems` and `counterAxisAlignItems`
- `counterAxisAlignContent` and `strokesIncludedInLayout`
- `primaryAxisSizingMode` and `counterAxisSizingMode`
- grid row and column counts, gaps, and track sizes when `layoutMode` is `GRID`
- each direct child's width, height, `layoutSizingHorizontal`, `layoutSizingVertical`, and `layoutPositioning`

Treat a Figma pixel as one CSS pixel at 100% browser zoom. Do not claim exact spacing when the required structured values are missing. State which values need Figma inspection.

If the Magnetic AI plugin already supplies this structured selection context, use it directly. If fields are missing and the host provides a Figma Plugin API read tool, load the host's required Plugin API instructions first. Then use a read-only query that returns only the target layout nodes and the fields above. Do not edit the Figma file during this inspection.

Use the following query shape as a guide. Replace `NODE_ID` with the selected frame ID.

```js
const target = await figma.getNodeByIdAsync('NODE_ID');
if (!target) throw new Error('Figma node not found');

const candidates = [
  target,
  ...('findAll' in target
    ? target.findAll(node => 'layoutMode' in node && node.layoutMode !== 'NONE')
    : []),
];

return candidates.slice(0, 500).map(node => ({
  id: node.id,
  name: node.name,
  width: node.width,
  height: node.height,
  layoutMode: node.layoutMode,
  layoutWrap: node.layoutWrap,
  itemSpacing: node.itemSpacing,
  counterAxisSpacing: node.counterAxisSpacing,
  padding: {
    top: node.paddingTop,
    right: node.paddingRight,
    bottom: node.paddingBottom,
    left: node.paddingLeft,
  },
  primaryAxisAlignItems: node.primaryAxisAlignItems,
  counterAxisAlignItems: node.counterAxisAlignItems,
  counterAxisAlignContent: node.counterAxisAlignContent,
  primaryAxisSizingMode: node.primaryAxisSizingMode,
  counterAxisSizingMode: node.counterAxisSizingMode,
  strokesIncludedInLayout: node.strokesIncludedInLayout,
  grid: node.layoutMode === 'GRID' ? {
    rows: node.gridRowCount,
    columns: node.gridColumnCount,
    rowGap: node.gridRowGap,
    columnGap: node.gridColumnGap,
    rowSizes: node.gridRowSizes,
    columnSizes: node.gridColumnSizes,
  } : undefined,
  children: 'children' in node ? node.children.map(child => ({
    id: child.id,
    name: child.name,
    x: child.x,
    y: child.y,
    width: child.width,
    height: child.height,
    layoutSizingHorizontal: child.layoutSizingHorizontal,
    layoutSizingVertical: child.layoutSizingVertical,
    layoutPositioning: child.layoutPositioning,
  })) : [],
}));
```

## Source Precedence

Apply spacing sources in this order:

1. Use the Harbor component document for internal component anatomy.
2. Use the mapped Figma instance variant and size for component selection.
3. Use the Figma parent Auto Layout values for external padding, gaps, alignment, wrapping, and sizing.
4. Use Magnetic spacing tokens for layout values that the Figma source does not define.
5. Use the skill's generic spacing defaults only when no source value exists.

Never replace an explicit Figma value with a generic `12px`, `16px`, or `24px` default.

## Auto Layout Translation

Translate Figma Auto Layout to web layout as follows:

| Figma value | Web layout |
|---|---|
| `HORIZONTAL` | `display: flex` with `flex-direction: row` |
| `VERTICAL` | `display: flex` with `flex-direction: column` |
| `GRID` | CSS Grid with the matching tracks, row gap, and column gap |
| `itemSpacing` | `gap` on a non-wrapping container |
| four padding values | matching `padding-top`, `padding-right`, `padding-bottom`, and `padding-left` |
| `WRAP` | `flex-wrap: wrap` |
| horizontal wrap `itemSpacing` | `column-gap` |
| horizontal wrap `counterAxisSpacing` | `row-gap` |
| `MIN`, `CENTER`, `MAX` | `start`, `center`, or `end` on the matching axis |
| `SPACE_BETWEEN` | `justify-content: space-between` |
| `BASELINE` | `align-items: baseline` |
| child `FILL` | fill the available parent axis |
| child or frame `HUG` | use intrinsic or content size |
| `FIXED` | keep the measured size at the requested viewport |
| child `ABSOLUTE` | use absolute positioning only for the same overlay or decorative case |

Do not calculate a normal gap from the visible distance in a `SPACE_BETWEEN` frame. The browser must distribute the remaining space.

Use parent-relative coordinates for an absolute child. Do not copy page-level `absoluteBoundingBox` coordinates into a nested web container.

For a frame with `layoutMode: NONE`, use direct-child positions in the same parent coordinate system. Preserve a regular row or column with flex or grid when the coordinates show a stable structure. Use absolute positioning only when the source intentionally overlaps or freely positions children.

## Harbor Layout Selection

Use documented `hbr-layout` variants when their complete geometry matches the source.

Use an `hbr-layout` primitive when its properties match the source. Map exact gaps to these properties:

| Figma or CSS gap | `hbr-layout` gap |
|---:|---|
| `0px` | `none` |
| `4px` | `2xs` |
| `8px` | `xs` |
| `12px` | `sm` |
| `16px` | `md` |
| `24px` | `lg` |
| `32px` | `xl` |
| `48px` | `2xl` |

Do not use a semantic `hbr-layout` variant only because its name is similar. A variant can add padding, gaps, wrapping, or sizing that does not exist in the source frame.

Use a small scoped layout rule when Harbor properties cannot express an explicit Figma value. Limit this CSS to page-level or container-level `display`, `direction`, `gap`, padding, alignment, wrapping, sizing, and positioning. Use the exact pixel value from Figma. Do not use this exception to restyle a Harbor component.

Remove browser default margins from scoped text elements when those margins create spacing that does not exist in Figma. Do not apply a broad global reset.

## Common Errors

- Do not add both Figma parent padding and Harbor variant padding.
- Do not add a margin between children when the parent already supplies `gap`.
- Do not convert `HUG` to a fixed height.
- Do not convert `FILL` to an intrinsic width.
- Do not use absolute positioning for a normal Auto Layout stack.
- Do not measure transparent image or shadow bounds as layout spacing.
- Do not change component internal spacing through Shadow DOM selectors or CSS parts.

## Verification

Render the requested viewport width. Keep the full vertical content available through scrolling.

Check computed styles for every recorded layout container. The computed padding and gap values must equal the recorded Figma values.

Compare a browser screenshot with the Figma frame at the same CSS viewport. Accept at most one CSS pixel of positional difference from browser rounding. Record larger differences as one of these causes:

- missing Figma layout data
- wrong Auto Layout translation
- duplicate padding or gap
- font metric difference
- Harbor component parity gap

Do not call the result pixel-exact when a known difference remains.
