import useCustomElementDefined from "../../hooks/useCustomElementDefined";

function Table() {
  // Wait for the custom element to be defined (ergonomic helper)
  const defined = useCustomElementDefined('hbr-dom-table');

  const columns = [
    { id: "name", name: "Name", width: "100px" },
    { id: "age", name: "Age" },
    // An empty column makes the table take up the full width. This follows guideline of the design system. 
    { id: "empty", width: "100%" },
  ];
  const data = [
    { id: "x7B3pQ", name: "John Doe", age: 30 },
    { id: "mZ9r1T", name: "Jane Smith", age: 25 },
  ];

  function renderCells() {
    return data.map(row =>
      columns.map(col => {
        const cellId = `row-${row.id}-column-${col.id}`;
        // The cell slot = cellId.
        // The format of the cellId and setting the slot with cellId value is important for the table to render correctly.
        return <div key={cellId} slot={cellId}>
          {row[col.id]}
        </div>
      })
    )
  }

  if (!defined) return null;
  return <div className="hbr-css__page-title-container hbr-css__layout-col-lg">
    <div className="hbr-css__layout-row-sm">
      <div className="hbr-css__text-heading-xl-bold">Table page</div>
    </div>
    <hbr-card container>
      <hbr-dom-table columns={columns} data={data} aria={{ label: "Basic table" }}>
        {renderCells()}
      </hbr-dom-table>
    </hbr-card>
  </div>
}

export default Table;