# Table Tree

## Description
Displays hierarchical expandable rows (tree data).

## Generation Guidance
- Use when prompt mentions hierarchy, nested rows, or parent/child relationships.
- Limit nesting depth in examples (≤ 3 levels) for clarity.

**Parent:** table

## Usage
```jsx
/**
 * TreeTable
 * A table component that displays hierarchical data in a tree structure.
 * use `query` util to search and filter the tree data.
 * use `DomTree` to initialize the tree instance, it has the utilities for search and filtering and multi selection.
 */

import { DomTree, query } from "@harbor/elements/utils";
import { useEffect, useMemo, useState } from "react";

const treeTableData = [
	{
		id: "san-jose", // unique id
		location: "San Jose",
		vlanId: "2224",
		connectivity: 100,
		localIP: "10.20.50.64",
		macAddress: "B4:B3:50:E0:31:2C",
		number: 1,
		policy: "Archiving",
		serialNumber: "Q3DE-TBW2-6Z18",
		status: "success",
		expandable: true,
		children: [
			// use children property to set the children data
			{
				id: "san-jose-building-16", // unique id
				location: "Building 16",
				vlanId: "2228",
				connectivity: 100,
				localIP: "10.20.50.64",
				macAddress: "B4:B3:50:E0:31:2C",
				number: 1,
				policy: "Archiving",
				serialNumber: "Q3DE-TBW2-6Z18",
				status: "success",
				children: [
					{
						id: "floor-1",
						location: "Floor 1",
						vlanId: "2240",

						connectivity: 100,
						localIP: "10.20.50.64",
						macAddress: "B4:B3:50:E0:31:2C",
						number: 1,
						policy: "Archiving",
						serialNumber: "Q3DE-TBW2-6Z18",
						status: "success",
					},
					{
						id: "floor-2",
						location: "Floor 2",
						vlanId: "2240",

						connectivity: 100,
						localIP: "10.20.50.64",
						macAddress: "B4:B3:50:E0:31:2C",
						number: 1,
						policy: "Archiving",
						serialNumber: "Q3DE-TBW2-6Z18",
						status: "success",
						children: [
							{
								id: "floor-2-room-1",
								location: "Room 1",
								vlanId: "2240",

								connectivity: 100,
								localIP: "10.20.50.64",
								macAddress: "B4:B3:50:E0:31:2C",
								number: 1,
								policy: "Archiving",
								serialNumber: "Q3DE-TBW2-6Z18",
								status: "warning",
								children: [
									{
										id: "floor-2-room-1-section-1",
										location: "Section 1",
										vlanId: "2240",

										connectivity: 100,
										localIP: "10.20.50.64",
										macAddress: "B4:B3:50:E0:31:2C",
										number: 1,
										policy: "Archiving",
										serialNumber: "Q3DE-TBW2-6Z18",
										status: "success",
									},
									{
										id: "floor-2-room-1-section-2",
										location: "Section 2",
										vlanId: "2240",

										connectivity: 100,
										localIP: "10.20.50.64",
										macAddress: "B4:B3:50:E0:31:2C",
										number: 1,
										policy: "Archiving",
										serialNumber: "Q3DE-TBW2-6Z18",
										status: "success",
									},
								],
							},
							{
								id: "floor-2-room-2",
								location: "Room 2",
								vlanId: "2240",

								connectivity: 100,
								localIP: "10.20.50.64",
								macAddress: "B4:B3:50:E0:31:2C",
								number: 1,
								policy: "Archiving",
								serialNumber: "Q3DE-TBW2-6Z18",
								status: "success",
							},
						],
					},
					{
						id: "floor-3",
						location: "Floor 3",
						vlanId: "2241",

						connectivity: 100,
						localIP: "10.20.50.64",
						macAddress: "B4:B3:50:E0:31:2C",
						number: 1,
						policy: "Archiving",
						serialNumber: "Q3DE-TBW2-6Z18",
						status: "success",
					},
				],
			},
			{
				id: "san-jose-building-17", // unique id
				location: "Building 17",
				vlanId: "2228",

				connectivity: 100,
				localIP: "10.20.50.64",
				macAddress: "B4:B3:50:E0:31:2C",
				number: 1,
				policy: "Archiving",
				serialNumber: "Q3DE-TBW2-6Z18",
				status: "success",
			},
			{
				id: "san-jose-building-18", // unique id
				location: "Building 18",
				vlanId: "2229",

				connectivity: 100,
				localIP: "10.20.50.64",
				macAddress: "B4:B3:50:E0:31:2C",
				number: 1,
				policy: "Archiving",
				serialNumber: "Q3DE-TBW2-6Z18",
				status: "success",
			},
		],
	},
	{
		id: "san-francisco",
		location: "San Francisco",
		vlanId: "2224",
		children: [
			{
				id: "san-francisco-building-22", // unique id
				checkbox: false,
				location: "Furry 1",
				vlanId: "2228",
				localIP: "10.20.50.64",
				policy: "Archiving",
				serialNumber: "Q3DE-TBW2-6Z18",
			},
			{
				id: "san-francisco-building-23", // unique id
				checkbox: false,
				location: "Furry 2",
				vlanId: "2229",
				localIP: "10.20.50.64",
				policy: "Archiving",
				serialNumber: "Q3DE-TBW2-6Z18",
			},
		],
		connectivity: 100,
		localIP: "11.22.51.64",
		macAddress: "B1:B1:50:E0:31:2C",
		number: 1,
		policy: "Archiving",
		serialNumber: "Q3DE-TBW2-6Z18",
		status: "success",
	},
	{
		id: "db65ccbd-e327-42a0-bd33-cb4f7492953e_1",
		number: 1,
		status: "error",
		location: "Meraki AWS - US West Oregon - Finsbury",
		macAddress: "0D:0D:F5:6A:C8:79",
		connectivity: 100,
		serialNumber: "Q2FW-OX09-7P36",
		localIP: "10.20.50.51",
		updated: "2024-03-27T00:10:14.925Z",
		policy: "Archiving",
		action: "",
	},
];
const treeTableDataColumns = [
	{
		id: "selectable",
		width: 36,
		pin: "left",
		renderHeader: ({ column, tree }) => {
			return (
				<hbr-checkbox
					slot={`column-${column.id}`}
					aria={{
						label: "Select All",
					}}
					checked={tree.getChecked()}
					indeterminate={tree.getIndeterminate()}
					onhbr-click={(e) => {
						const checked = e.target.checked;
						tree.selectAll(checked);
					}}
				/>
			);
		},
		renderCell: ({ data, column }) => {
			return (
				<hbr-checkbox
					slot={`row-${data.id}-column-${column.id}`}
					key={`row-${data.id}-column-${column.id}`}
					aria={{
						label: "Select row",
					}}
					indeterminate={data.children && tree.getIndeterminate(data.children)}
					checked={tree.getChecked(data.id)}
					onhbr-click={(e) => {
						tree.setSelected(data.id, e.target.checked);
					}}
				/>
			);
		},
	},
	{
		id: "location",
		name: "Location",
		sortable: true,
		minWidth: 100,
		width: 220,
		maxWidth: 400,
		order: "asc",
		pin: "left",
		renderCell: ({
			data,
			column,
			level,
			treeOpen,
			setTreeOpen,
			expanded,
			setExpanded,
			queryOption,
		}) => {
			if (!data.children) {
				return (
					<div
						slot={`row-${data.id}-column-${column.id}`}
						key={`row-${data.id}-column-${column.id}`}
						style={{ paddingLeft: `${level * 24 + 24}px` }}
					>
						<hbr-highlight
							variant={"underline"}
							text={data.location}
							queryText={queryOption.search}
						/>
					</div>
				);
			}
			return (
				<div
					slot={`row-${data.id}-column-${column.id}`}
					key={`row-${data.id}-column-${column.id}`}
					style={{
						display: "flex",
						gap: "4px",
						paddingLeft: `${level * 24}px`,
					}}
				>
					<hbr-button
						key={`expandable-btn-${data.id}`}
						variant="text"
						size="xsmall"
						aria={{
							label: "expandable row",
						}}
						onClick={(e) => {
							if (data.expandable) {
								setExpanded([...expanded, data.id]);
								setTimeout(() => {
									setExpanded(expanded.filter((i) => i !== data.id));
									setTreeOpen(
										treeOpen.includes(data.id)
											? treeOpen.filter((i) => i !== data.id)
											: [...treeOpen, data.id],
									);
									data.expandable = false;
								}, 2000);
							} else {
								setTreeOpen(
									treeOpen.includes(data.id)
										? treeOpen.filter((i) => i !== data.id)
										: [...treeOpen, data.id],
								);
							}
						}}
					>
						<hbr-icon
							style={{
								transform: treeOpen.includes(data.id)
									? "rotate(90deg)"
									: "rotate(0deg)",
								transition: "transform 0.2s ease",
							}}
							name="caret-right"
						/>
					</hbr-button>
					<hbr-highlight
						variant={"underline"}
						text={data.location}
						queryText={queryOption.search}
					/>
				</div>
			);
		},
	},
	{
		id: "number",
		name: "#",
		sortable: true,
		width: 50,
		align: "right",
	},
	{
		id: "status",
		name: "Status",
		sortable: true,
		width: 86,
		reorderable: true,
		align: "center",
	},
	{
		id: "macAddress",
		name: "MAC address",
		renderCell: ({ data, column }) => {
			return (
				<div
					slot={`row-${data.id}-column-${column.id}`}
					key={`row-${data.id}-column-${column.id}`}
					style={{ fontFamily: "var(--hbr-font-family-mono, Roboto Mono)" }}
				>
					{data.macAddress ? data.macAddress : "N/A"}
				</div>
			);
		},
	},
	{
		id: "connectivity",
		name: "Connectivity",
	},
	{
		id: "serialNumber",
		name: "Serial number",
		minWidth: 140,
	},
	{
		id: "localIP",
		name: "Local IP",
		renderCell: ({ data, column }) => {
			return (
				<div
					slot={`row-${data.id}-column-${column.id}`}
					key={`row-${data.id}-column-${column.id}`}
					style={{ fontFamily: "var(--hbr-font-family-mono, Roboto Mono)" }}
				>
					{data.localIP ? data.localIP : "N/A"}
				</div>
			);
		},
	},
	{
		id: "empty",
		width: "100%",
	},
];
let lastSearch = "";
function FilterBar({
	count,
	source,
	tree,
	setTreeOpen,
	queryOption,
	setQueryOption,
}) {
	const { filter, search } = queryOption;

	function handleSearch(e) {
		if (lastSearch !== e.target.value) {
			setQueryOption({
				...queryOption,
				search: e.target.value,
				page: 0,
				customFilter: tree.customFilter,
				customSearch: tree.customSearch,
			});
			lastSearch = e.target.value;
			if (e.target.value) {
				const open = tree.getSearchAllOpen(source, e.target.value);
				setTreeOpen(open);
			}
		}
	}

	function handleStatusChange(e) {
		const { filter } = queryOption;
		const newQueryPartial = {
			filter: {
				...filter,
				status: [e.target.value],
			},
		};
		if (e.target.value === "all") newQueryPartial.filter.status = undefined;
		setQueryOption({
			...queryOption,
			filter: newQueryPartial.filter,
			customFilter: tree.customFilter,
		});

		if (e.target.value === "all") return;
		const open = tree.getFilterOpen(source, newQueryPartial.filter);
		setTreeOpen(open);
	}

	return (
		<hbr-filter-bar>
			<hbr-input
				slot="start"
				placeholder="Search"
				data-testid="search"
				onhbr-input={(e) => {
					handleSearch(e);
				}}
				value={search}
			>
				<hbr-icon
					slot="prefix"
					name="magnifying-glass"
					sentiment="neutral"
					style={{ fontSize: "16px" }}
				/>
			</hbr-input>
			<hbr-select
				value={filter.status}
				placeholder="Status"
				style={{ width: "140px" }}
				onhbr-change={handleStatusChange}
			>
				<hbr-option value="all">All</hbr-option>
				<hbr-option value="success">Success</hbr-option>
				<hbr-option value="warning">Warning</hbr-option>
				<hbr-option value="error">Error</hbr-option>
			</hbr-select>
			<hbr-text type="secondary" size="sm" slot="fixed-suffix">
				{count} results
			</hbr-text>
		</hbr-filter-bar>
	);
}
let tree;

export default function TreeTable() {
	const [expanded, setExpanded] = useState([]);
	const [treeOpen, setTreeOpen] = useState([]);
	const [selection, setSelection] = useState([]);
	const [columns, setColumns] = useState(treeTableDataColumns);
	const [queryOption, setQueryOption] = useState({
		filter: {
			status: "",
		},
		search: "",
		pageLength: 30,
		page: 0,
	});
	const { count, response: source } = useMemo(
		() => query(treeTableData, queryOption),
		[queryOption],
	);

	if (!tree) {
		// need to initialize the tree only once
		tree = new DomTree({
			setSelection: (list) => {
				const newList = [...list];
				setSelection(newList);
				return newList;
			},
		});
	}

	useEffect(() => {
		// update the source state when the source changes
		tree.setSource(source);
	}, [source]);

	const renderTree = ({
		columns,
		level,
		data,
		source,
		expanded,
		setExpanded,
		queryOption,
	}) => {
		return data.map((row) => {
			let rows = [];
			rows = columns.map((column) => {
				return column.renderCell?.({
					data: row,
					column,
					level,
					tree,
					treeOpen,
					setTreeOpen,
					source,
					expanded,
					setExpanded,
					queryOption,
				});
			});
			if (row.expandable && expanded.includes(row.id)) {
				rows.push(
					<hbr-layout
						key={`row-${row.id}-expandable`}
						slot={`row-${row.id}-expandable`}
						direction="column"
						align="center"
						style={{ padding: "var(--hbr-spacing-md)" }}
					>
						<hbr-spinner direction="column" size="small">
							<div slot="label">Loading</div>
						</hbr-spinner>
					</hbr-layout>,
				);
			}
			if (treeOpen.includes(row.id)) {
				if (row.children?.length) {
					const children = renderTree({
						columns,
						tree,
						level: level + 1,
						data: row.children,
						queryOption,
					});
					rows = rows.concat(children);
				}
			}
			return rows;
		});
	};

	return (
		<hbr-card container={true}>
			<hbr-layout direction="column" gap="md">
				<FilterBar
					count={count}
					queryOption={queryOption}
					setQueryOption={setQueryOption}
					tree={tree}
					source={source}
					setTreeOpen={setTreeOpen}
				/>
				<hbr-dom-table
					tree={true}
					expanded={expanded}
					opened={treeOpen}
					selection={selection}
					columns={columns}
					data={source}
					onhbr-sort={(e) => {
						const { order, column } = e.detail;
						if (column) {
							setQueryOption({
								...queryOption,
								order: [[column.id, order]],
								customSort: tree.treeSort([[column.id, order]]),
							});
							setColumns([...columns]);
						}
					}}
				>
					{columns.map((column) => column.renderHeader?.({ column, tree }))}
					{renderTree({
						columns,
						data: source,
						level: 0,
						selected: selection,
						tree,
						treeOpen,
						setTreeOpen,
						source,
						expanded,
						setExpanded,
						queryOption,
					})}
				</hbr-dom-table>
			</hbr-layout>
		</hbr-card>
	);
}

```