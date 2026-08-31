# Table Filtering Sorting Search Paging Selection

## Description
Combines filtering, sorting, search, pagination, and multi-row selection. Refer this node for ideal implementation of table features, always pick this node when implementing multiple table features together.

## Generation Guidance
- Use when prompt requests multiple table features together.
- Ensure clear UI affordances for each feature (search box, filter inputs, sortable headers, pagination controls, selection checkboxes).
- IMPORTANT (common bug): When implementing sorting, always apply the sort comparator to the full filtered dataset BEFORE pagination (not just the current page slice). Update the stored filtered array (e.g. `store.response`) with a new sorted copy so web component re-renders. On clearing sort, regenerate the filtered dataset (re-run query) to restore natural order. Do NOT attempt to sort only the paged slice or issue a no-op state update; that will make sorting appear broken.
- Put the filter bar, table, and pagination in one `<hbr-layout direction="column" gap="md">` when they share a card. This gap is required structure.

**Parent:** table

## Usage
```jsx
// TABLE WITH FILTERING, SORTING, SEARCH & PAGINATION
// Use for large datasets (>10 rows)

import { useCallback, useEffect, useState } from "react";

// Sample data (15 rows to test pagination)
const initialData = [
	{
		id: "sw-01",
		name: "Core-SW1",
		status: "online",
		ip: "10.10.30.5",
		location: "San Jose",
		vlan: "100",
	},
	{
		id: "sw-02",
		name: "Agg-SW2",
		status: "offline",
		ip: "10.10.30.9",
		location: "Austin",
		vlan: "200",
	},
	{
		id: "sw-03",
		name: "DMZ-SW3",
		status: "warning",
		ip: "172.16.1.10",
		location: "SF Branch",
		vlan: "300",
	},
	{
		id: "sw-04",
		name: "Edge-SW4",
		status: "online",
		ip: "10.20.1.15",
		location: "Denver",
		vlan: "100",
	},
	{
		id: "sw-05",
		name: "Lab-SW5",
		status: "offline",
		ip: "10.20.1.85",
		location: "Seattle",
		vlan: "400",
	},
	{
		id: "sw-06",
		name: "Prod-SW6",
		status: "online",
		ip: "10.30.2.10",
		location: "Portland",
		vlan: "100",
	},
	{
		id: "sw-07",
		name: "Dev-SW7",
		status: "warning",
		ip: "10.30.2.20",
		location: "Phoenix",
		vlan: "200",
	},
	{
		id: "sw-08",
		name: "QA-SW8",
		status: "online",
		ip: "10.40.3.5",
		location: "Dallas",
		vlan: "300",
	},
	{
		id: "sw-09",
		name: "Stage-SW9",
		status: "online",
		ip: "10.40.3.15",
		location: "Houston",
		vlan: "100",
	},
	{
		id: "sw-10",
		name: "Backup-SW10",
		status: "offline",
		ip: "10.50.4.10",
		location: "Chicago",
		vlan: "400",
	},
	{
		id: "sw-11",
		name: "DR-SW11",
		status: "online",
		ip: "10.50.4.20",
		location: "NYC",
		vlan: "100",
	},
	{
		id: "sw-12",
		name: "Test-SW12",
		status: "warning",
		ip: "10.60.5.5",
		location: "Boston",
		vlan: "200",
	},
	{
		id: "sw-13",
		name: "Infra-SW13",
		status: "online",
		ip: "10.60.5.15",
		location: "Miami",
		vlan: "300",
	},
	{
		id: "sw-14",
		name: "Net-SW14",
		status: "online",
		ip: "10.70.6.10",
		location: "Atlanta",
		vlan: "100",
	},
	{
		id: "sw-15",
		name: "Access-SW15",
		status: "offline",
		ip: "10.70.6.20",
		location: "Detroit",
		vlan: "400",
	},
];

const columns = [
	{ id: "name", name: "Name", sortable: true, width: "150px", pin: "left" },
	{ id: "status", name: "Status", sortable: true, width: "100px" },
	{ id: "ip", name: "IP Address", width: "130px" },
	{ id: "location", name: "Location", sortable: true, width: "120px" },
	{ id: "vlan", name: "VLAN", width: "80px" },
	{ id: "empty", width: "100%" },
];

const statusConfig = {
	online: { sentiment: "positive", icon: "status-positive", label: "Online" },
	offline: { sentiment: "negative", icon: "status-negative", label: "Offline" },
	warning: { sentiment: "warning", icon: "status-warning", label: "Warning" },
};

function TableFilteringSortingSearchPaging() {
	const [query, setQuery] = useState({
		search: "",
		status: "",
		page: 0,
		pageSize: 5,
	});
	const [store, setStore] = useState({ data: [], count: 0 });

	// Filter data based on search and status
	const filterData = useCallback(() => {
		const filtered = initialData.filter((row) => {
			// Global search
			if (query.search) {
				const term = query.search.toLowerCase();
				const searchable = [row.name, row.ip, row.location, row.vlan]
					.join(" ")
					.toLowerCase();
				if (!searchable.includes(term)) return false;
			}
			// Status filter
			if (query.status && row.status !== query.status) return false;
			return true;
		});
		return { data: filtered, count: filtered.length };
	}, [query.search, query.status]);

	// Update store when filters change
	useEffect(() => {
		setStore(filterData());
	}, [filterData]);

	// Get paginated slice
	const getPagedData = () => {
		const start = query.page * query.pageSize;
		return store.data.slice(start, start + query.pageSize);
	};

	// Render status tag
	const renderStatus = (status) => {
		const cfg = statusConfig[status] || statusConfig.offline;
		return (
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
	};

	// Render cell content
	const renderCell = (row, col) => {
		if (col.id === "status") return renderStatus(row.status);
		if (col.id === "ip") {
			return (
				<span style={{ fontFamily: "var(--hbr-font-family-mono)" }}>
					{row.ip}
				</span>
			);
		}
		return row[col.id] || "";
	};

	// Generate cell slots for current page
	const renderCells = () => {
		return getPagedData().map((row) =>
			columns.map((col) => {
				const cellId = `row-${row.id}-column-${col.id}`;
				return (
					<div key={cellId} slot={cellId}>
						{renderCell(row, col)}
					</div>
				);
			}),
		);
	};

	// Handle search input
	const handleSearch = (e) => {
		setQuery((prev) => ({ ...prev, search: e.target.value, page: 0 }));
	};

	// Handle status filter (clearable returns empty string when cleared)
	const handleStatusChange = (e) => {
		setQuery((prev) => ({ ...prev, status: e.target.value || "", page: 0 }));
	};

	// Handle page change
	const handlePageChange = (e) => {
		setQuery((prev) => ({ ...prev, page: e.detail }));
	};

	// Handle page size change
	const handleSizeChange = (e) => {
		setQuery((prev) => ({ ...prev, pageSize: e.detail.pageSize, page: 0 }));
	};

	// Handle sorting
	const handleSort = (e) => {
		const { order, data: sortedData } = e.detail;
		if (order && sortedData) {
			setStore((prev) => ({ ...prev, data: sortedData }));
		}
		if (!order) {
			// Reset to filtered (unsorted) data
			setStore(filterData());
		}
	};

	return (
		<hbr-layout variant="dashboard">
			<hbr-layout variant="dashboard:section">
				<hbr-layout variant="dashboard:widgets:content">
					<hbr-card col="full" container>
						<hbr-layout slot="header">
							<hbr-text variant="section-title">Network Switches</hbr-text>
						</hbr-layout>

						<hbr-layout direction="column" gap="md">
							{/* Filter Bar */}
							<hbr-filter-bar>
								<hbr-input
									slot="start"
									placeholder="Search"
									type="search"
									value={query.search}
									onhbr-input={handleSearch}
								>
									<hbr-icon slot="prefix" name="magnifying-glass" size="16px" />
								</hbr-input>
								<hbr-select
									value={query.status || undefined}
									placeholder="Status"
									clearable
									style={{ width: "140px" }}
									onhbr-change={handleStatusChange}
								>
									<hbr-option value="online">Online</hbr-option>
									<hbr-option value="offline">Offline</hbr-option>
									<hbr-option value="warning">Warning</hbr-option>
								</hbr-select>
								<hbr-text type="secondary" size="sm" slot="fixed-suffix">
									{store.count} results
								</hbr-text>
							</hbr-filter-bar>

							{/* Table */}
							<hbr-dom-table
								columns={columns}
								data={getPagedData()}
								aria={{ label: "Network switches" }}
								onhbr-sort={handleSort}
							>
								{renderCells()}
							</hbr-dom-table>

							{/* Pagination */}
							<hbr-pagination
								size="small"
								pageSize={query.pageSize}
								itemCount={store.count}
								page={query.page}
								pageOptions={[5, 10, 20]}
								sizeChanger
								onhbr-page-changed={handlePageChange}
								onhbr-size-changed={handleSizeChange}
							/>
						</hbr-layout>
					</hbr-card>
				</hbr-layout>
			</hbr-layout>
		</hbr-layout>
	);
}

export default TableFilteringSortingSearchPaging;

```
