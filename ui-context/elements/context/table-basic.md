# Table Basic 

## Description
Baseline simple table: columns + data rendering only.

## Generation Guidance
- Use when user requests a simple table without sorting, filtering or selection.
- Prefer as starting point before layering additional behaviors.

**Parent:** table

## Usage
```jsx
// BASIC TABLE EXAMPLE
// Use for small datasets (≤10 rows) without pagination/filtering

function BasicTable() {
	const columns = [
		{ id: "name", name: "Name", width: "150px" },
		{ id: "status", name: "Status", width: "100px" },
		{ id: "ip", name: "IP Address", width: "130px" },
		{ id: "location", name: "Location", width: "150px" },
		// MANDATORY: Empty column for full-width table
		{ id: "empty", width: "100%" },
	];

	const data = [
		{
			id: "sw-01",
			name: "Core-SW1",
			status: "online",
			ip: "10.10.30.5",
			location: "San Jose",
		},
		{
			id: "sw-02",
			name: "Agg-SW2",
			status: "offline",
			ip: "10.10.30.9",
			location: "Austin",
		},
		{
			id: "sw-03",
			name: "DMZ-SW3",
			status: "online",
			ip: "172.16.1.10",
			location: "SF Branch",
		},
	];

	// Status rendering helper
	const statusConfig = {
		online: { sentiment: "positive", icon: "status-positive", label: "Online" },
		offline: {
			sentiment: "negative",
			icon: "status-negative",
			label: "Offline",
		},
	};

	// Generate cell slots
	// SLOT PATTERN: slot="row-{row.id}-column-{column.id}"
	function renderCells() {
		return data.map((row) =>
			columns.map((col) => {
				const cellId = `row-${row.id}-column-${col.id}`;
				let content = row[col.id] || "";

				// Render status as tag
				if (col.id === "status" && statusConfig[row.status]) {
					const cfg = statusConfig[row.status];
					content = (
						<hbr-tag sentiment={cfg.sentiment} size="small">
							<hbr-icon
								name={cfg.icon}
								sentiment={cfg.sentiment}
								size="12px"
								slot="prefix"
							/>
							{cfg.label}
						</hbr-tag>
					);
				}

				// Render IP as monospace
				if (col.id === "ip") {
					content = (
						<span style={{ fontFamily: "var(--hbr-font-family-mono)" }}>
							{row.ip}
						</span>
					);
				}

				return (
					<div key={cellId} slot={cellId}>
						{content}
					</div>
				);
			}),
		);
	}

	return (
		<hbr-layout variant="dashboard">
			<hbr-layout variant="dashboard:section">
				<hbr-layout variant="dashboard:widgets:content">
					<hbr-card col="full" container>
						<hbr-layout slot="header">
							<hbr-text variant="section-title">Network Switches</hbr-text>
						</hbr-layout>
						<hbr-dom-table
							columns={columns}
							data={data}
							aria={{ label: "Network switches" }}
						>
							{renderCells()}
						</hbr-dom-table>
					</hbr-card>
				</hbr-layout>
			</hbr-layout>
		</hbr-layout>
	);
}

export default BasicTable;

```