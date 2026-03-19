# Transfer

Transfer is implemented using the web component: <hbr-transfer>.

## Description
For transferring items between two lists, with transfer specific styling, behavior like searching, and multi-selection.

## Usage
```jsx
import { useRef, useState } from "react";

const flatListData = {
	children: [
		{ label: "Anchovies", id: "anchovies" },
		{ label: "Bacon", id: "bacon" },
		{ label: "Gorgonzola", id: "gorgonzola" },
		{ label: "Mozzarella", id: "mozzarella" },
		{ label: "Mushrooms", id: "mushrooms" },
		{ label: "Olives", id: "olives" },
		{ label: "Onions", id: "onions" },
		{ label: "Parmesan", id: "parmesan" },
		{ label: "Pepperoni", id: "pepperoni" },
		{ label: "Peppers", id: "peppers" },
		{ label: "Pineapple", id: "pineapple" },
		{ label: "Sausage", id: "sausage" },
	],
};

const treeSearch = (data, query) => {
	const lowerCaseQuery = query.trim().toLowerCase();

	if (!lowerCaseQuery) {
		return data;
	}

	if (!data || !data.children) {
		return { children: [] };
	}

	const filterNodes = (nodes) => {
		return nodes.reduce((acc, node) => {
			const selfMatches = node.label.toLowerCase().includes(lowerCaseQuery);

			const filteredChildren = node.children ? filterNodes(node.children) : [];

			if (selfMatches || filteredChildren.length > 0) {
				acc.push({ ...node, children: filteredChildren });
			}

			return acc;
		}, []);
	};

	return { children: filterNodes(data.children) };
};

export default function TransferTree() {
	const [data, setData] = useState([flatListData, { children: [] }]);
	const [selected, setSelected] = useState([[], []]);
	const [partial, setPartial] = useState([[], []]);
	const [search, setSearch] = useState(["", ""]);
	const transferTreeRef = useRef(null);

	const sortChildren = (data) => {
		if (data.children) {
			data.children.sort((a, b) => a.label.localeCompare(b.label));
			data.children.forEach((child) => sortChildren(child));
		}
		return data;
	};

	const renderTreeItems = (data, selected, partial, query, treeType) => {
		if (!data.children) return [];
		return data.children.map((item) => {
			return (
				<hbr-tree-item
					key={item.id}
					dataId={item.id}
					selectable={true}
					selected={selected ? selected.includes(item.id) : null}
					indeterminate={partial ? partial.includes(item.id) : null}
					triggerPosition="end"
				>
					<hbr-icon name="caret-down" slot="expand-icon" size="16px" />
					<hbr-icon name="caret-up" slot="collapse-icon" size="16px" />
					<hbr-highlight
						text={item.label}
						queryText={query}
						caseSensitive={false}
						continuous={true}
						style={{ color: "var(--hbr-color-neutral-text, #23282E)" }}
					/>
					{item.children &&
						renderTreeItems(item, selected, partial, query, treeType)}
				</hbr-tree-item>
			);
		});
	};

	const getLeftTreeItems = () => {
		if (transferTreeRef.current) {
			console.log(transferTreeRef.current);
			return transferTreeRef.current
				.querySelector(".left__tree")
				.querySelectorAll("hbr-tree-item");
		}
		return null;
	};

	const getRightTreeItems = () => {
		if (transferTreeRef.current) {
			return transferTreeRef.current
				.querySelector(".right__tree")
				.querySelectorAll("hbr-tree-item");
		}
	};

	function getDataCount(data) {
		if (!data.children) return { parentCount: 0, childCount: 0 };
		let parentCount = 0;
		let childCount = 0;
		data.children.forEach((item) => {
			if (item.children) {
				parentCount++;
				childCount += item.children.length;
			} else {
				childCount++;
			}
		});
		return { parentCount, childCount };
	}

	const leftCount = getDataCount(treeSearch(data[0], search[0]));
	const rightCount = getDataCount(treeSearch(data[1], search[1]));

	return (
		<div style={{ margin: "10px" }}>
			<hbr-transfer
				ref={transferTreeRef}
				data={data}
				selected={selected}
				search={search}
				onhbr-transfer={(event) => {
					// if(event.detail.direction === "right") {
					// 	setCollapsed(prevCollapsed => [
					// 		prevCollapsed[0].filter(item => !selected[0].includes(item)),
					// 		prevCollapsed[1]
					// 	]);
					// } else {
					// 	setCollapsed(prevCollapsed => [
					// 		prevCollapsed[0],
					// 		prevCollapsed[1].filter(item => !selected[1].includes(item))
					// 	]);
					// }
					// setSelected([[], []]);
					// setPartial([[], []]);
					// event.detail.direction === "right"
					// 	? setData([event.detail.data[0], event.detail.data[1]])
					// 	: setData([event.detail.data[1], event.detail.data[0]]);
					const { direction, data } = event.detail;
					console.log("onTransfer", direction, data, selected);
					setSelected([[], []]);
					setPartial([[], []]);
					setData(
						direction === "right" ? [data[0], data[1]] : [data[1], data[0]],
					);
				}}
			>
				<div slot="left-check-all">
					<hbr-checkbox
						onhbr-click={(event) => {
							const sids = [];
							const treeItems = getLeftTreeItems();
							const checked = event.target.checked;
							treeItems
								? treeItems.forEach((item) => {
										item.selected = checked;
										item.indeterminate = false;
										item.selected ? sids.push(item.dataId) : null;
								  })
								: null;
							setSelected([sids, selected[1]]);
							setPartial([[], partial[1]]);
						}}
						checked={
							selected[0].length > 0 &&
							selected[0].length ===
								leftCount.childCount + leftCount.parentCount
						}
						indeterminate={
							selected[0].length > 0 &&
							selected[0].length < leftCount.childCount + leftCount.parentCount
						}
						disabled={data[0].children.length === 0}
					>
						<hbr-text type="primary" size="sm" weight="bold">
							{leftCount.childCount} available
						</hbr-text>
					</hbr-checkbox>
				</div>
				{data[0].children.length > 0 && (
					<div slot="left-search-input" style={{}}>
						<hbr-input
							type="search"
							placeholder="Search"
							onhbr-input={(event) =>
								setSearch([event.target.value, search[1]])
							}
							clearable={true}
							style={{ padding: "12px 16px 8px 16px" }}
						>
							<hbr-layout slot="prefix" direction="column" align="center">
								<hbr-icon
									name="magnifying-glass"
									className="search-sample-icon"
									width="20px"
									height="20px"
									sentiment="neutral"
								/>
							</hbr-layout>
						</hbr-input>
					</div>
				)}
				{treeSearch(data[0], search[0]).children.length > 0 ? (
					<hbr-tree
						slot="left-list"
						selection="multiple"
						className="left__tree"
						onhbr-selection-change={() => {
							const sids = [];
							const pids = [];
							const treeItems = getLeftTreeItems();
							treeItems
								? treeItems.forEach((item) => {
										item.selected ? sids.push(item.dataId) : null;
										item.indeterminate ? pids.push(item.dataId) : null;
								  })
								: null;
							setSelected([sids, selected[1]]);
							setPartial([pids, partial[1]]);
						}}
					>
						{/* <HbrIcon name="caret-down" slot="expand-icon" size="16px" />
						<HbrIcon name="caret-up" slot="collapse-icon" size="16px" /> */}
						{renderTreeItems(
							data && treeSearch(sortChildren(data[0]), search[0]),
							selected[0],
							partial[0],
							search[0],
							"left",
						)}
					</hbr-tree>
				) : (
					<div
						slot="left-list"
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							paddingTop: "12px",
						}}
					>
						<hbr-illustration size="medium">
							<div slot="body">
								{search[0] === "" ? "No data available" : "No matches found"}
							</div>
						</hbr-illustration>
					</div>
				)}
				{/* ********* left ends, right starts ********* */}
				<div slot="right-check-all">
					<hbr-checkbox
						onhbr-click={(event) => {
							const sids = [];
							const treeItems = getRightTreeItems();
							const checked = event.target.checked;
							treeItems
								? treeItems.forEach((item) => {
										item.selected = checked;
										item.indeterminate = false;
										item.selected ? sids.push(item.dataId) : null;
								  })
								: null;
							setSelected([selected[0], sids]);
							setPartial([partial[0], []]);
						}}
						checked={
							selected[1].length > 0 &&
							selected[1].length ===
								rightCount.childCount + rightCount.parentCount
						}
						indeterminate={
							selected[1].length > 0 &&
							selected[1].length <
								rightCount.childCount + rightCount.parentCount
						}
						disabled={data[1].children.length === 0}
					>
						<hbr-text type="primary" size="sm" weight="bold">
							{rightCount.childCount} selected
						</hbr-text>
					</hbr-checkbox>
				</div>
				{data[1].children.length > 0 && (
					<div slot="right-search-input">
						<hbr-input
							type="search"
							placeholder="Search"
							onhbr-input={(event) =>
								setSearch([search[0], event.target.value])
							}
							clearable={true}
							style={{ padding: "12px 16px 8px 16px" }}
						>
							<hbr-layout slot="prefix" direction="column" align="center">
								<hbr-icon
									name="magnifying-glass"
									className="search-sample-icon"
									width="20px"
									height="20px"
									sentiment="neutral"
								/>
							</hbr-layout>
						</hbr-input>
					</div>
				)}
				{treeSearch(data[1], search[1]).children.length > 0 ? (
					<hbr-tree
						slot="right-list"
						selection="multiple"
						className="right__tree"
						onhbr-selection-change={() => {
							const sids = [];
							const pids = [];
							const treeItems = getRightTreeItems();
							treeItems
								? treeItems.forEach((item) => {
										item.selected ? sids.push(item.dataId) : null;
										item.indeterminate ? pids.push(item.dataId) : null;
								  })
								: null;
							setSelected([selected[0], sids]);
							setPartial([partial[0], pids]);
						}}
					>
						{/* <HbrIcon name="caret-down" slot="expand-icon" size="16px" />
						<HbrIcon name="caret-up" slot="collapse-icon" size="16px" /> */}
						{renderTreeItems(
							data && treeSearch(sortChildren(data[1]), search[1]),
							selected[1],
							partial[1],
							search[1],
							"right",
						)}
					</hbr-tree>
				) : (
					<div
						slot="right-list"
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							alignSelf: "stretch",
							paddingTop: "12px",
						}}
					>
						<hbr-illustration size="medium">
							<div slot="body">
								{search[1] === "" ? "No data selected" : "No matches found"}
							</div>
						</hbr-illustration>
					</div>
				)}
			</hbr-transfer>
		</div>
	);
}

```