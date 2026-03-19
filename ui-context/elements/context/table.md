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

## Cell Rendering
Pay attention to the cell rendering examples in the code examples.
- Status tags with icons
- Links and monospace text
- Progress bars
- Action buttons

Refer to code examples for complete implementations.

## Capabilities
- table-basic: Baseline simple table: columns + data rendering only.
- table-filtering-sorting-search-paging-selection: Combines filtering, sorting, search, pagination, and multi-row selection. Refer this node for ideal implementation of table features, always pick this node when implementing multiple table features together.