# Drawer

Drawer is implemented using the web component: <hbr-drawer>.

## Description
Panel that slides in from an edge to reveal supplemental content.

## Generation Guidance
These rules govern generation of drawers using <hbr-drawer>.
- Drawer is a web component that slides out from the edge of the viewport or its containing element.

## Slots

The drawer component supports three slots:

1. **Default slot (unnamed)**: The drawer's main content.
   - Usage: Place content directly between the opening and closing tags
   - Example: <hbr-drawer>Main content here</hbr-drawer>

2. **label slot**: The drawer's label/title displayed in the header.
   - Usage: <span slot="label">Drawer Title</span>
   - Alternative: Can use the 'label' prop instead
   - Note: Always include a relevant label for accessibility, even when using 'no-header'

3. **footer slot**: The drawer's footer area, typically for action buttons.
   - Usage: <div slot="footer">Footer content or buttons</div>
   - Common use case: Button groups representing various options

## Tooltips and Overlays Inside Drawers

- Use one Harbor tooltip or popover trigger per icon/control. Do not combine a custom tooltip with `hbr-tooltip` for the same warning, info, or help icon.
- When a tooltip/popover trigger lives inside a drawer, use the documented overlay-safe pattern such as `hoist` when available so the floating content is not clipped by the drawer or rendered behind it.
- Verify the tooltip/popover is anchored to the intended trigger and appears above the drawer surface and overlay.

Use exact casing when referencing these examples.

## Usage
```jsx
import {
	HbrCheckbox,
	HbrDomTable,
	HbrDropdown,
	HbrIcon,
} from "@harbor/elements-react";
import {
	alertsNegativeLarge,
	alertsPositiveLarge,
	alertsWarningCircleFilled,
	caretRight,
	gearSix,
	moreHorizontal,
} from "@harbor/elements/icons";
import { useState } from "react";

function DrawerSection({ title, subtitle, children }) {
	return (
		<hbr-card container>
			<hbr-layout variant="form:section">
				<hbr-layout variant="form:section:header">
					<hbr-text variant="section-title">{title}</hbr-text>
					{subtitle ? (
						<hbr-text type="secondary" size="sm">
							{subtitle}
						</hbr-text>
					) : null}
				</hbr-layout>
				<hbr-layout variant="form:section:body">{children}</hbr-layout>
			</hbr-layout>
		</hbr-card>
	);
}

export default function Drawer() {
	const [open, setOpen] = useState(true);
	const drawerID = "base-sample-drawer";
	function handleCloseClick(event) {
		// check to avoid syncing state close of non drawer elements that bubble up
		if (event.target.id === drawerID) setOpen(false);
	}
	return (
		<div>
			<hbr-drawer
				scrollAware={true}
				open={open}
				id={drawerID}
				onhbr-hide={handleCloseClick}
				size="large"
				data-theme="onecd"
			>
				<Table />
				{/* Title */}
				<hbr-layout slot="label" direction="column" gap="2xs">
					<hbr-text variant="drawer-title">Drawer title</hbr-text>
					<hbr-text type="secondary" size="sm">
						Optional descriptor goes here.
					</hbr-text>
				</hbr-layout>

				{/* Content */}
				<div className="hbr-css__layout-col-md">
					<hbr-text type="secondary" size="sm">
						This drawer example includes enough form content to activate
						scrolling, so you can inspect the scroll-aware header and footer
						treatment while the body is moving.
					</hbr-text>

					<DrawerSection
						title="Overview"
						subtitle="Use longer, realistic content so the drawer body overflows."
					>
						<hbr-input label="Project Name" value="One Design rollout" />
						<hbr-input label="Owner" value="Casey Morgan" />
						<hbr-input
							label="Summary"
							value="Review the drawer surface, separators, and footer treatment while scrolling through a denser layout."
						/>
					</DrawerSection>

					<DrawerSection
						title="Configuration"
						subtitle="Mix controls to make the scroll state more representative."
					>
						<hbr-select label="Workstream" value="design">
							<hbr-option value="design">Design</hbr-option>
							<hbr-option value="engineering">Engineering</hbr-option>
							<hbr-option value="product">Product</hbr-option>
						</hbr-select>
						<hbr-radio-group label="Review Mode" direction="column">
							<hbr-radio value="async" checked>
								Async review
							</hbr-radio>
							<hbr-radio value="live">Live review</hbr-radio>
							<hbr-radio value="handoff">Handoff</hbr-radio>
						</hbr-radio-group>
						<hbr-checkbox checked>Notify stakeholders when saved</hbr-checkbox>
					</DrawerSection>

					<DrawerSection
						title="Validation Notes"
						subtitle="Extra content keeps the footer in view while the body scrolls."
					>
						<hbr-text type="secondary" size="sm">
							Check the drawer near the top, mid-scroll, and bottom of the body.
							That makes it easier to catch any unwanted seams, border shifts,
							or background mismatches between the content area and the sticky
							footer.
						</hbr-text>
						<hbr-text type="secondary" size="sm">
							The One Design panel surface should remain continuous while the
							body content moves beneath it, and the action area should still
							read like part of the same drawer panel rather than a detached
							bar.
						</hbr-text>
						<hbr-text type="secondary" size="sm">
							This section is intentionally verbose so the body height exceeds
							the viewport and guarantees that scrolling is activated during
							review.
						</hbr-text>
					</DrawerSection>
				</div>

				{/* Footer */}
				<hbr-sticky-action-bar slot="footer" variant="drawer">
					<hbr-button variant="text" onClick={() => setOpen(false)}>
						Cancel
					</hbr-button>
					<hbr-button variant="fill">Save</hbr-button>
				</hbr-sticky-action-bar>
			</hbr-drawer>

			<hbr-button onClick={() => setOpen(true)}>Open drawer</hbr-button>
			<br />
			<br />
			<div
				style={{
					width: "100%",
					minHeight: "240px",
					background: "var(--hbr-color-neutral-bg-weak)",
					padding: "var(--hbr-spacing-md)",
				}}
			>
				Page Content
			</div>
		</div>
	);
}

const _data = [
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
	},
	{
		id: "las-vegas",
		location: "Las Vegas",
		vlanId: "2223",
		children: [],
		connectivity: 100,
		localIP: "10.20.50.64",
		macAddress: "B4:B3:50:E0:31:2C",
		number: 1,
		policy: "Archiving",
		serialNumber: "Q3DE-TBW2-6Z18",
		status: "success",
	},
	{
		id: "san-francisco",
		location: "San Francisco",
		vlanId: "2224",
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
	{
		id: "83e2b0e4-a2c0-4f76-9fd6-4252e6ea4da1_2",
		number: 2,
		status: "success",
		location: "Meraki London - Data Center",
		macAddress: "05:81:78:FC:F3:CC",
		connectivity: 100,
		serialNumber: "Q3-QC7Y-4IGS",
		localIP: "10.20.50.61",
		updated: "2024-03-27T00:10:14.925Z",
		policy: "Archiving",
		action: "",
	},
	{
		id: "c3764348-bf37-42c2-8227-0d1c141e8763_3",
		number: 3,
		status: "error",
		location: "Meraki London - Data Center",
		macAddress: "07:32:AE:C5:2A:C8",
		connectivity: 100,
		serialNumber: "Q2CX-OKY1-QUJT",
		localIP: "10.20.50.50",
		updated: "2024-03-27T00:10:14.925Z",
		policy: "Archiving",
		action: "",
	},
	{
		id: "d28a905a-d43a-454f-8c8b-91159f55e1f7_4",
		number: 4,
		status: "error",
		location: "Meraki Sydney - Finsbury",
		macAddress: "26:1E:4A:32:58:A3",
		connectivity: 100,
		serialNumber: "Q2FW-21UI-7TEL",
		localIP: "10.20.50.56",
		updated: "2024-03-27T00:10:14.925Z",
		policy: "Archiving",
		action: "",
	},
	{
		id: "7e6b6ec8-4f2c-483a-9eb8-da9de9b6e044_5",
		number: 5,
		status: "success",
		location: "Meraki London - Christopher",
		macAddress: "24:07:59:A7:1C:8E",
		connectivity: 100,
		serialNumber: "Q2-CUDW-WS4N",
		localIP: "10.20.50.63",
		updated: "2024-03-27T00:10:14.925Z",
		policy: "Disaster Recovery",
		action: "",
	},
];

const _columns = [
	{
		id: "selectable",
		width: 36,
		renderHeader: ({ data, column, selected, setSelected }) => {
			return (
				<HbrCheckbox
					key={`column-${column.id}`}
					slot={`column-${column.id}`}
					aria={{
						label: "Select All",
					}}
					indeterminate={selected.length > 0 && selected.length < data.length}
					checked={selected.length === data.length}
					onClick={(e) => {
						setSelected(
							selected.length === data.length ? [] : data.map((i) => i.id),
						);
					}}
				/>
			);
		},
		renderCell: ({ data, selected, setSelected }) => {
			return (
				<HbrCheckbox
					key={`checkbox-${data.id}`}
					aria={{
						label: "Select row",
					}}
					checked={selected.includes(data.id)}
					onHbr-click={() => {
						setSelected(
							selected.includes(data.id)
								? selected.filter((id) => id !== data.id)
								: [...selected, data.id],
						);
					}}
				/>
			);
		},
	},
	{
		id: "location",
		name: "Location",
		sortable: true,
		type: "string",
		minWidth: 100,
		width: 220,
		maxWidth: 400,
		order: "asc",
		pin: "start",
	},
	{
		id: "number",
		name: "#",
		sortable: true,
		type: "number",
		width: 50,
		align: "right",
		renderCell: ({ data, column }) => {
			return (
				<div
					slot={`column-${column.id}`}
					style={{
						textAlign: "right",
					}}
				>
					{data.number}
				</div>
			);
		},
	},
	{
		id: "status",
		name: "Status",
		sortable: true,
		type: "string",
		width: 86,
		reorderable: true,
		align: "center",
		renderHeader: function () {
			return (
				<div
					slot={`column-${this.id}`}
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					{this.name}
				</div>
			);
		},
		renderCell: ({ data }) => {
			const iconForStatus = {
				success: alertsPositiveLarge,
				error: alertsNegativeLarge,
				warning: alertsWarningCircleFilled,
			};
			const colorForStatus = {
				success: "success",
				error: "danger",
				warning: "warning",
			};
			if (!data.status) return null;
			return (
				<div
					key={`status-${data.id}`}
					style={{
						height: "100%",
						justifyContent: "center",
						display: "flex",
					}}
				>
					<HbrIcon
						size="16px"
						sentiment={colorForStatus[data.status]}
						asset={iconForStatus[data.status]()}
					/>
				</div>
			);
		},
	},
	{
		id: "macAddress",
		name: "MAC address",
		renderCell: ({ data }) => {
			return (
				<div style={{ fontFamily: "var(--hbr-font-family-mono, Roboto Mono)" }}>
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
		width: 140,
	},
	{
		id: "localIP",
		name: "Local IP",
		renderCell: ({ data }) => {
			return (
				<div style={{ fontFamily: "var(--hbr-font-family-mono, Roboto Mono)" }}>
					{data.localIP ? data.localIP : "N/A"}
				</div>
			);
		},
	},
	{
		id: "empty",
		width: "100%",
	},
	{
		id: "actions",
		pin: "right",
		renderHeader: ({ column }) => {
			return (
				<div slot={`column-${column.id}`}>
					<hbr-visually-hidden>Actions</hbr-visually-hidden>
					<hbr-button size="xsmall" variant="text" slot="trigger">
						<HbrIcon asset={gearSix} />
					</hbr-button>
				</div>
			);
		},
		renderCell: () => {
			return (
				<HbrDropdown enablePopover hoist menu closeOnScroll flipPadding={10}>
					<hbr-button size="xsmall" variant="text" slot="trigger">
						<HbrIcon asset={moreHorizontal} />
					</hbr-button>
					<hbr-menu>
						<hbr-menu-item value="edit">Edit</hbr-menu-item>
						<hbr-menu-item value="delete">Delete</hbr-menu-item>
					</hbr-menu>
				</HbrDropdown>
			);
		},
	},
];

function Table() {
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(_data);
	const [columns, setColumns] = useState(_columns);

	const renderBody = () => {
		return data.flatMap((row) => {
			return columns.map((column) => (
				<div
					slot={`row-${row.id}-column-${column.id}`}
					className={column.className}
					key={`row-${row.id}-column-${column.id}`}
				>
					{column.renderCell
						? column.renderCell({
								data: row,
								column,
								selected,
								setSelected,
						  })
						: row[column.id]}
				</div>
			));
		});
	};

	return (
		<div
			className="hbr-css__table-container"
			style={{ width: "90%", margin: "20px auto" }}
		>
			<HbrDomTable
				selected={selected}
				columns={columns}
				data={data}
				onHbr-sort={(e) => {
					// update column order direction by setting the columns state
					e.detail.column && setColumns([...columns]);

					// Apply sorted data if available
					if (e.detail.order && e.detail.data) {
						setData(e.detail.data);
					} else {
						// Apply original data if no order is set
						setData([..._data]);
					}
				}}
			>
				{columns.map((column) =>
					column.renderHeader?.({
						column,
						data,
						selected,
						setSelected,
					}),
				)}
				{renderBody()}
			</HbrDomTable>
		</div>
	);
}

```

## API Reference

### Props
`label`: The drawer's label as displayed in the header. You should always include a relevant label even when using
`no-header`, as it is required for proper accessibility. (string)
`open`: Indicates whether or not the drawer is open. You can use this in lieu of the show/hide methods. (boolean)
`size`: The drawer's width. Use the css prop --size for custom sizes. ("large" | "medium" | "small" | "xlarge")