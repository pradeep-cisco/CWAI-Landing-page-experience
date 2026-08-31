# Table

Table is implemented using the web component: <hbr-dom-table>.

## Description
Tabular display of structured data with rows and columns.

## Generation Guidance
- Capability node  `table-filtering-sorting-search-paging` node has a complex example with a variety of table features. Look there for inspiration.
- Only if more context needed, use capability nodes (table-basic, table-sorting, table-selection, etc.) to narrow context and reduce token size.
- Compose multiple capabilities only if user intent clearly combines them (e.g. editable + pagination).
- Tables use <hbr-dom-table> with slot-based cell rendering.

## Mandatory Patterns

### 1. Column Definition
- Always include empty column at end: `{ id: "empty", width: "100%" }`
- Each column needs: `id`, `name`, optional `width`, `sortable`

### 2. Slot Naming (CRITICAL)
- Body cells: `slot="row-{row.id}-column-{column.id}"`
- Header slots: `slot="column-{column.id}"`

## Data Assignment
- For projects using the wrapped version of harbor elements (by importing them from a framework specific elements package like @harbor/elements-react), `data` and `columns` props should be set as DIRECT PROPS on the hbr-dom-table component. In all other cases, `data` and `columns` props should be set via jsx or tsx.

## When to Use Each Pattern

### Small Datasets (≤10 rows)
Use table-basic pattern: simple columns + data, no pagination.

### Large Datasets (>10 rows)
Use table-filtering-sorting-search-paging-selection pattern:
- Add `<hbr-pagination>` sibling
- Add `<hbr-filter-bar>` with search input
- Enable `sortable: true` on columns
- Add `pin: "left"` to columns that should be pinned to the left.

### Tables in cards

- When a filter bar, table, and pagination component share a card, wrap them in `<hbr-layout direction="column" gap="md">`.
- Keep the filter-to-table and table-to-pagination gaps explicit. Do not rely on card internals or browser defaults.
- Do not add spacing inside table cells to change the table header or row geometry. Adjust documented column widths or labels when wrapping is unintended.

## Cell Rendering
Pay attention to the cell rendering examples in the code examples.
- Status tags with icons
- Links and monospace text
- Progress bars
- Action buttons

### Selected Row Styling
- When using row selection, bind selected row ids through the table's `selected` API and let `hbr-dom-table` own the selected-row visual state.
- Keep slotted cell content transparent. Avoid opaque backgrounds, margins, borders, card-like wrappers, or full-height custom cell surfaces inside row cell slots because they can mask or fragment the selected-row highlight.
- Do not recreate selected-row styling with custom CSS or per-cell selected backgrounds.
- Visually verify selected rows show one continuous highlight across all columns, including custom cells, pinned columns, and action columns.

### Tables in Modals and Dense Overlays
- Use standard Harbor table typography. Do not reduce row or cell font sizes unless the design explicitly requires a compact table.
- Prefer wrapping long text in modal table cells before introducing horizontal scrolling. Horizontal scroll should be reserved for genuinely wide datasets that cannot be represented by wrapping or adjusted columns.

Refer to code examples for complete implementations.

## Capabilities
- table-basic: Baseline simple table: columns + data rendering only.
- table-filtering-sorting-search-paging-selection: Combines filtering, sorting, search, pagination, and multi-row selection. Refer this node for ideal implementation of table features, always pick this node when implementing multiple table features together.
- table-tree: Displays hierarchical expandable rows (tree data).

## API Reference

### Props
`aria`: Aria label for the table. ({ label: string; })
`autoLayout`: Default layout is left aligned, setting autoLayout to true will make the table auto span. (boolean)
`columns`: Column configurations. (ColumnType[])
`data`: Data to be displayed in the table. (any[])
`density`: Table density. ("comfy" | "compact" | "condensed" | "spacious")
`expanded`: Expanded rows, used for expandable rows. (string[])
`opened`: Opened tree nodes, used for tree structure. (string[])
`rowLevel`: Enable row level hover state. (boolean)
`selected`: Selected rows, used for row selection. (string[])
`stickyHeader`: Enable sticky header that remains visible when scrolling. (boolean)
`tree`: If true, the table will be rendered as a tree structure. (boolean)

### Events
`hbr-column-reorder`: Emitted when the user starts drop a column.
`hbr-column-resize`: Emitted after the user resized a column.
`hbr-row-click`: Emitted when the user click row.
`hbr-row-reorder`: Emitted when the user starts drop a row.
`hbr-sort`: Emitted when the user click the header sort button.

### Parts
`base`: The component's base wrapper.
`left-border`: The component's left-border.
`resizer`: The column resizer element.
`right-border`: The component's right-border.
`sort-button`: The sorting button element.
`table`: The table tag.
`tbody`: The tbody tag.
`thead`: The thead tag.
