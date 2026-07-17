# Custom Dashboard (Template)

## Generation Guidance
### Custom Dashboard Structure (REQUIRED)

Build custom dashboards from dashboard config objects. Load dashboard configs from the app's persistence layer into component state, then render the active config.

Each dashboard config must use this shape:
```json
{
  "dashboardName": "Dashboard 1",
  "sections": [
    {
      "id": "overview-cards",
      "sectionTitle": "Section title",
      "widgetType": "card",
      "editable": false,
      "widgets": []
    },
    {
      "id": "container-widgets",
      "sectionTitle": "Section title",
      "widgetType": "container",
      "editable": true,
      "widgets": []
    }
  ]
}
```

### Widget Data Contract

Card widgets use `cardType`; do not store layout `variant` or `statusVariant` in config.

```json
{
  "id": "statistic-card-1",
  "cardType": "statistics",
  "title": "Title 1",
  "value": "Value 1"
}
```

```json
{
  "id": "health-card-1",
  "cardType": "health",
  "title": "Health Card 1",
  "icon": "wifi-high",
  "metrics": [
    {
      "id": "online",
      "value": "62",
      "label": "Online",
      "sentiment": "positive",
      "icon": "status-positive"
    },
    {
      "id": "alerting",
      "value": "21",
      "label": "Alerting",
      "sentiment": "warning",
      "icon": "status-warning"
    }
  ]
}
```

```json
{
  "id": "basic-card-1",
  "cardType": "basic",
  "title": "Basic Widget",
  "status": "Positive"
}
```

Container widgets belong in a `widgetType: "container"` section. Seed container widgets with serializable content only; do not seed custom dashboard config with height or span fields:
```json
{
  "id": "container-widget-1",
  "title": "Container Widget 1"
}
```

### Layout Variants

Use hbr-layout semantic variants and derive widget grid variants from the config:
```
<hbr-layout variant="page">
  <hbr-layout variant="page:header">...</hbr-layout>
  <hbr-layout variant="dashboard">
    <hbr-layout variant="dashboard:section">
      <hbr-text variant="section-title">...</hbr-text>
      <hbr-layout variant="dashboard:widgets:basic-statistics">
        <hbr-card>...</hbr-card>
      </hbr-layout>
      <hbr-layout variant="dashboard:widgets:basic-health">
        <hbr-card>...</hbr-card>
      </hbr-layout>
    </hbr-layout>
    <hbr-layout variant="dashboard:section">
      <hbr-text variant="section-title">...</hbr-text>
      <hbr-dashboard-flow>
        <hbr-layout variant="dashboard:widgets:container">
          <hbr-card container>...</hbr-card>
        </hbr-layout>
      </hbr-dashboard-flow>
    </hbr-layout>
  </hbr-layout>
</hbr-layout>
```

Derivation rules:
- Section grids use `dashboard:widgets:<widgetType>`; for containers this becomes `dashboard:widgets:container`.
- Card grids use `dashboard:widgets:basic-<cardType>`; statistics cards become `dashboard:widgets:basic-statistics`.
- Health metric status cells combine status with card type: `dashboard:widgets:basic-health:status`.
- Basic cards in this template render alongside health cards in the health grid. Do not derive unsupported `dashboard:widgets:basic-basic`.

### Rendering Rules

- Find sections by `widgetType`, then render card and container sections independently.
- Split card widgets by `cardType`: `statistics`, `health`, and `basic`.
- Render statistics widgets in a statistics grid.
- Render all health widgets and basic widgets in the health grid; seed examples with three health card widgets.
- Render container widgets in `hbr-dashboard-flow` so drag order and spans can be persisted.
- Only sections with `editable: true` should expose edit-mode widget add, remove, drag, or resize behavior.
- Use `hbr-text variant="page-title"` for the page title, `variant="section-title"` for section titles, `variant="sub-section-title"` for card titles, and `variant="drawer-title"` for drawer labels.

### Editing Behavior

The custom dashboard keeps an editable draft in component state while the user is editing. Persistence is app-specific: demos can use localStorage, while production apps should load and save through their API or database-backed data layer.
- Dashboard tabs are rendered from the loaded dashboard config array.
- The active dashboard name is editable in the toolbar.
- Save commits the current `dashboardName` and cloned `sections` through the app's persistence handler, then refreshes or updates the loaded dashboard config array.
- Cancel restores the saved dashboard name and saved section data.
- Delete removes the active dashboard through the same persistence path and selects the next available dashboard.
- Section-level widget editing is driven by `section.editable === true`; the sample dashboard marks only the container widget section editable.

For editable container widgets in edit mode:
- Wrap the container grid in `hbr-drop-zone direction="horizontal"`.
- Include `hbr-drag-ghost slot="ghost"`.
- Wrap each editable container card in `hbr-draggable delete={true}`.
- Handle `onhbr-draggable-remove` to remove a widget from the container section.
- Handle `onhbr-flow-layout-change` from `hbr-dashboard-flow` and persist both order and span changes.

### Add Widget Drawer

Use an `hbr-drawer` with:
- A checkbox list of available widgets.
- A preview area that renders the selected widget with the same preview component used by the dashboard.
- `hbr-sticky-action-bar slot="footer" variant="drawer"` with Cancel and Save actions.
- `onhbr-hide` to close the drawer and reset selection.

### Create Dashboard

Keep dashboard creation behavior in a separate module under the custom dashboard directory, for example `custom-dashboard/DashboardCreate.jsx`. Do not inline create-dashboard form state or draft widget serialization logic in the main dashboard template.

The create module should own:
- `useDashboardCreate({ onCreateDashboard })`, which manages drawer state and the dashboard draft.
- `DashboardCreateDrawer`, which renders a drawer for collecting page title, one or more section titles, each section's `widgetType`, and explicit widgets for each section.
- Draft section/widget helpers that return the same serializable dashboard config shape used by the dashboard renderer.
- An Add section action so users can compose multiple card or container sections before creating the dashboard.
- An Add widget action inside each section, so users can add widgets to the section they are editing.

Use the create hook from the dashboard page:
```jsx
const dashboardCreate = useDashboardCreate({
  onCreateDashboard: handleCreateDashboard,
});

<PageHeader
  onCreateDashboard={dashboardCreate.handleOpenCreateDashboard}
  ...
/>
<DashboardCreateDrawer {...dashboardCreate.drawerProps} />
```

Create UI requirements:
- New Dashboard > Create new opens the create drawer.
- The drawer uses `hbr-drawer` with label `Create dashboard`.
- The form collects a page title, section title, widget type (`card` or `container`), and widget data for each widget in the section.
- Each section has its own Add widget button.
- For card sections, each widget has a `cardType` selector.
- For `cardType: "statistics"`, collect `title` and `value`, then serialize the widget as:
```json
{
  "cardType": "statistics",
  "title": "Title 2",
  "value": "Value 2"
}
```
- For `cardType: "health"`, collect `title`, `icon`, and editable `metrics` rows. Each metric should collect `value`, `label`, `sentiment`, and optional `icon`.
- For `cardType: "basic"`, collect `title` and `status`.
- For container sections, each widget should collect only `title`; do not collect `height` or span fields in the create drawer.
- When a section's `widgetType` changes, reset that section's draft widgets to a valid default for the selected type.
- New dashboard sections should include an `editable` boolean. Use `editable: true` for container sections and `editable: false` for card sections unless the app explicitly supports editing that card section.
- On create, append the new dashboard config to the dashboard config array and select the new tab.

### Share Dashboard

Keep dashboard share/export behavior in a separate module under the custom dashboard directory, for example `custom-dashboard/DashboardShare.jsx`. Do not inline share modal, copy, or download logic in the main dashboard template.

The share module should own:
- `exportDashboardDataAsJson(dashboardName, sections)`, returning serializable JSON with `dashboardName` and cloned `sections`.
- `useDashboardShare({ dashboardName, sections, disabled, resetKey })`, which manages share modal state, share-cancel confirmation state, JSON preview state, export-complete state, copy, download, and export actions.
- `DashboardShareModals`, which renders the share modal, the `Leave page?` confirmation modal, and the JSON preview modal.
- Browser actions for `navigator.clipboard.writeText` with a textarea fallback, and JSON download through a Blob object URL.

Use the share hook from the dashboard page:
```jsx
const dashboardShare = useDashboardShare({
  dashboardName,
  disabled: !activeDashboard,
  resetKey: activeDashboardIndex,
  sections: sectionData,
});

<DashboardToolbar
  onShareDashboard={dashboardShare.handleShareDashboard}
  ...
/>
<DashboardShareModals {...dashboardShare.modalProps} />
```

Share UI requirements:
- Toolbar Share button calls `onShareDashboard`.
- Opening Share resets the export-complete state so the Share modal starts with `Done` disabled.
- Share modal uses `hbr-modal` with label `Share dashboard template`, size `xsmall`, an Export button, Cancel, and Done.
- Share modal Cancel closes Share and opens a `Leave page?` confirmation modal.
- `Leave page?` confirmation Cancel closes the confirmation modal and reopens Share, preserving whether `Done` is enabled.
- `Leave page?` confirmation Leave closes the flow and resets the export-complete state.
- Export builds the current dashboard JSON from the active `dashboardName` and `sectionData`, then opens the JSON preview modal.
- JSON preview modal uses `hbr-modal` with label `Dashboard Configuration (JSON)`, shows formatted JSON in a scrollable `pre`, and provides Copy to Clipboard and Download JSON actions.
- Closing the JSON preview sets export-complete true and reopens Share with `Done` enabled.
- Share modal Done closes the flow and resets the export-complete state.
- Reset share modal, share-cancel confirmation, JSON preview, and export-complete state when the active dashboard changes.

### Container Card Sizing

Dashboard-flow can emit span fields after a user resizes dashboard widgets:
- `dataColSpan` for base width.
- `dataSmColSpan` for small breakpoint width.
- `dataXsColSpan` for extra-small breakpoint width.

Semantic `col` is still supported for static container cards:
- `col="1/3"` - third width.
- `col="1/2"` - half width.
- `col="2/3"` - two-thirds width.
- `col="full"` - full width.

### Rules

- Keep config data serializable JSON.
- Clone configs, sections, and widgets before editing state.
- Do not mix basic cards and container cards in the same grid.
- Keep add-widget options aligned with the target `widgetType`.
- Keep create-dashboard behavior in a small companion file and pass only the completed dashboard config back to the page.
- Keep share/export behavior in a small companion file and pass only dashboard name, sections, and state handlers from the page.
- Use Harbor events such as `onhbr-hide`, `onhbr-change`, `onhbr-draggable-remove`, and `onhbr-flow-layout-change`.

## Usage
### custom-dashboard.jsx
```jsx
// file: custom-dashboard.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AddWidgetDrawer, {
	addWidgetOptions,
} from "./custom-dashboard/AddWidgetDrawer";
import {
	DashboardCreateDrawer,
	useDashboardCreate,
} from "./custom-dashboard/DashboardCreate";
import {
	DashboardShareModals,
	useDashboardShare,
} from "./custom-dashboard/DashboardShare";
import dashboardConfig from "./custom-dashboard/config.json";
import dashboardConfig2 from "./custom-dashboard/config2.json";
import {
	booleanAttr,
	useCustomElementEvent,
} from "./custom-dashboard/customElementProps";

/**
 * Customizable Dashboard Template
 *
 * Uses hbr-layout variants to structure the dashboard:
 * - page: Page-level container (flex column, gap: none)
 * - dashboard: Root dashboard container (flex column, gap: lg)
 * - dashboard:section: Section wrapper (flex column, gap: md)
 * - dashboard:widgets:basic-statistics: Grid for statistics cards (gap: sm)
 * - dashboard:widgets:basic-health: Grid for health indicator cards (gap: md)
 * - dashboard:widgets:basic-status: Grid for status cards (gap: md)
 * - dashboard:widgets:container: 12-column grid for container widgets (gap: md)
 *
 * Uses hbr-text for semantic text styling:
 * - variant="page-title": Page title (24px, bold)
 * - variant="section-title": Section headers (18px, bold)
 * - variant="sub-section-title": Sub-section headers (16px, bold)
 * - type="primary|secondary|heading|mono" with size and weight props
 */

const applySpanPatch = (widget, span) => {
	if (!span) return widget;

	const nextBase = span.base;
	const nextSm = span.sm;
	const nextXs = span.xs;

	if (
		widget.dataColSpan === nextBase &&
		widget.dataSmColSpan === nextSm &&
		widget.dataXsColSpan === nextXs
	) {
		return widget;
	}

	return {
		...widget,
		dataColSpan: nextBase,
		dataSmColSpan: nextSm,
		dataXsColSpan: nextXs,
	};
};

const getWidgetSpan = ({ col, dataColSpan, dataSmColSpan, dataXsColSpan }) => {
	if (
		col ||
		(dataColSpan === "" && dataSmColSpan === "" && dataXsColSpan === "")
	) {
		return undefined;
	}

	return {
		base: dataColSpan,
		sm: dataSmColSpan,
		xs: dataXsColSpan,
	};
};

const cloneWidgets = (widgets) => widgets.map((widget) => ({ ...widget }));
const cloneSections = (sections) =>
	sections.map((section) => ({
		...section,
		widgets: cloneWidgets(
			Array.isArray(section.widgets) ? section.widgets : [],
		),
	}));
const cloneDashboardConfig = (config) => ({
	...config,
	sections: cloneSections(
		Array.isArray(config.sections) ? config.sections : [],
	),
});
const cloneDashboardConfigs = (configs) => configs.map(cloneDashboardConfig);
const findSectionByWidgetType = (sections, widgetType) =>
	sections.find((section) => section.widgetType === widgetType) || null;
const getSectionWidgets = (section) =>
	Array.isArray(section?.widgets) ? section.widgets : [];
const isSectionEditable = (section) => section?.editable === true;
const getDashboardWidgetsVariant = (widgetType) =>
	`dashboard:widgets:${widgetType}`;
const getDashboardCardWidgetsVariant = (cardType) =>
	getDashboardWidgetsVariant(`basic-${cardType}`);
const getDashboardCardStatusVariant = (cardType) =>
	`${getDashboardCardWidgetsVariant(cardType)}:status`;
const getFirstCardTypeVariant = (widgets, fallbackCardType) =>
	getDashboardCardWidgetsVariant(
		widgets.find((widget) => widget.cardType)?.cardType || fallbackCardType,
	);
const getDashboardName = (config) =>
	config?.dashboardName || "Untitled Dashboard";
const initialDashboardConfigs = [dashboardConfig, dashboardConfig2];

// ─────────────────────────────────────────────────────────────────────────────
// STATISTICS CARD - Small metric card showing a single KPI
// ─────────────────────────────────────────────────────────────────────────────
const StatisticsCard = ({ title = "Title", value = "Value" }) => (
	<hbr-card>
		<hbr-layout direction="column" gap="2xs">
			<hbr-text type="secondary" size="sm">
				{title}
			</hbr-text>
			<hbr-layout direction="row" gap="2xs">
				<hbr-text type="primary" size="lg" weight="bold">
					{value}
				</hbr-text>
			</hbr-layout>
		</hbr-layout>
	</hbr-card>
);

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH WIDGET CARD - Shows health metrics with multiple data points
// ─────────────────────────────────────────────────────────────────────────────
const HealthWidgetCard = ({
	title = "Health Widget",
	icon = "wifi-high",
	metrics = [],
	cardType = "health",
}) => {
	const metricItems = metrics.length
		? metrics
		: [
				{
					id: "primary",
					value: "62",
					label: "Online",
					sentiment: "positive",
					icon: "status-positive",
				},
				{
					id: "secondary",
					value: "21",
					label: "Alerting",
					sentiment: "warning",
					icon: "status-warning",
				},
				{
					id: "tertiary",
					value: "7",
					label: "Offline",
					sentiment: "negative",
					icon: "status-negative",
				},
		  ];

	return (
		<hbr-card>
			<hbr-layout slot="header" direction="row" gap="sm">
				<hbr-layout direction="row" gap="2xs" style={{ marginRight: "auto" }}>
					<hbr-text variant="sub-section-title">{title}</hbr-text>
				</hbr-layout>
				<hbr-icon name={icon} sentiment="neutral" />
			</hbr-layout>
			<hbr-layout direction="row" gap="md">
				{metricItems.map((metric) => (
					<hbr-layout
						key={metric.id || metric.label}
						variant={getDashboardCardStatusVariant(cardType)}
					>
						<hbr-layout
							direction="row"
							gap="2xs"
							align="center"
							style={{
								backgroundColor: "var(--base-bg-medium-default)",
								padding: "4px 8px",
								minHeight: "48px",
							}}
						>
							<hbr-text type="primary" size="lg" weight="bold">
								{metric.value}
							</hbr-text>
							<hbr-layout direction="row" gap="2xs" align="center">
								<hbr-text type="primary" size="xs" weight="semibold">
									{metric.label}
								</hbr-text>
								{metric.icon ? (
									<hbr-icon
										name={metric.icon}
										sentiment={metric.sentiment}
										size="16px"
									/>
								) : null}
							</hbr-layout>
						</hbr-layout>
					</hbr-layout>
				))}
			</hbr-layout>
		</hbr-card>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// BASIC WIDGET CARD - Card with title, status tag, and content area
// ─────────────────────────────────────────────────────────────────────────────
const BasicWidgetCard = ({ title = "Basic Widget", status = "Positive" }) => (
	<hbr-card>
		<hbr-layout direction="column" gap="sm">
			<hbr-layout direction="row" gap="2xs">
				<hbr-text variant="sub-section-title">{title}</hbr-text>
				<hbr-tag sentiment="positive" size="small">
					<hbr-icon slot="prefix" name="status-positive" size="16px" />
					{status}
				</hbr-tag>
			</hbr-layout>
			<div
				style={{
					minHeight: "80px",
					backgroundColor: "var(--base-bg-medium-default)",
					borderRadius: "4px",
				}}
			/>
		</hbr-layout>
	</hbr-card>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER WIDGET - Large card for charts/tables with optional filters
// ─────────────────────────────────────────────────────────────────────────────
const ContainerWidget = ({
	id,
	title = "Container Widget",
	height = "180px",
	col = "",
	dataColSpan = "",
	dataSmColSpan = "",
	dataXsColSpan = "",
	editMode = false,
	onRemove,
}) => {
	const span = getWidgetSpan({
		col,
		dataColSpan,
		dataSmColSpan,
		dataXsColSpan,
	});
	const spanBase = span?.base;
	const spanSm = span?.sm;
	const spanXs = span?.xs;
	const cardRef = useRef(null);
	const draggableRef = useRef(null);

	useLayoutEffect(() => {
		if (!cardRef.current) return;
		cardRef.current.span =
			spanBase == null && spanSm == null && spanXs == null
				? undefined
				: {
						base: spanBase,
						sm: spanSm,
						xs: spanXs,
				  };
	}, [spanBase, spanSm, spanXs]);
	useCustomElementEvent(draggableRef, "hbr-draggable-remove", () =>
		onRemove?.(id),
	);

	const card = (
		<hbr-card ref={cardRef} container col={col || undefined} data-drag-id={id}>
			<hbr-layout direction="column" gap="md">
				<hbr-layout direction="column" gap="sm">
					<hbr-text variant="sub-section-title">{title}</hbr-text>
				</hbr-layout>
				<div
					style={{
						minHeight: height,
						backgroundColor: "var(--base-bg-medium-default)",
						flex: 1,
					}}
				/>
			</hbr-layout>
		</hbr-card>
	);

	if (!editMode) {
		return card;
	}

	return (
		<hbr-draggable ref={draggableRef} delete={true} dragId={id}>
			{card}
		</hbr-draggable>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CARD - Compact card showing status with icon
// ─────────────────────────────────────────────────────────────────────────────
const StatusCard = ({
	count = 8,
	label = "Positive",
	sentiment = "positive",
}) => {
	const iconMap = {
		positive: "status-positive-bg",
		warning: "status-warning-bg",
		negative: "status-negative-bg",
	};
	return (
		<hbr-card>
			<hbr-layout
				direction="row"
				gap="sm"
				style={{ justifyContent: "space-between" }}
			>
				<hbr-layout direction="row" gap="2xs" align="baseline">
					<hbr-text type="primary" size="lg" weight="bold">
						{count}
					</hbr-text>
					<hbr-text type="primary" size="xs" weight="semibold">
						{label}
					</hbr-text>
				</hbr-layout>
				<hbr-icon name={iconMap[sentiment]} sentiment={sentiment} size="28px" />
			</hbr-layout>
		</hbr-card>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION TITLE - Uses sub-section-title variant (adds role="heading" aria-level automatically)
// ─────────────────────────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
	<hbr-text variant="section-title">{children}</hbr-text>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TOOLBAR
// ─────────────────────────────────────────────────────────────────────────────
const DashboardToolbar = ({
	canAddWidget,
	dashboardName,
	editMode,
	onStartEdit,
	onCancelEdit,
	onAddWidget,
	onDashboardNameChange,
	onDashboardRemove,
	onShareDashboard,
	onSaveEdit,
}) => (
	<hbr-layout gap="xs" direction="column">
		<hbr-layout direction="row" gap="md">
			<hbr-layout direction="row" gap="xs">
				<hbr-select value="12h" sync="height" style={{ width: "158px" }}>
					<hbr-icon slot="prefix" name="clock" />
					<hbr-option value="12h">Last 12 hours</hbr-option>
					<hbr-option value="24h">Last 24 hours</hbr-option>
					<hbr-option value="48h">Last 48 hours</hbr-option>
					<hbr-option value="72h">Last 72 hours</hbr-option>
				</hbr-select>
				<hbr-select sync="width" style={{ width: "80px" }} placeholder="SSID">
					<hbr-option value="ss12">SS12</hbr-option>
					<hbr-option value="ss13">SS13</hbr-option>
				</hbr-select>
			</hbr-layout>

			<hbr-layout direction="row" gap="xs" style={{ marginLeft: "auto" }}>
				<hbr-button variant="outline" onClick={onShareDashboard}>
					<hbr-icon slot="prefix" name="share" />
					Share
				</hbr-button>
				<hbr-button
					onClick={onStartEdit}
					variant="outline"
					disabled={booleanAttr(editMode)}
				>
					<hbr-icon slot="prefix" name="pencil-simple" />
					Edit dashboard
				</hbr-button>
			</hbr-layout>
		</hbr-layout>
		{editMode ? (
			<hbr-layout
				style={{
					padding: "4px 6px",
					backgroundColor: "var(--control-bg-weak-active)",
				}}
			>
				<hbr-layout direction="row" gap="xs">
					<label htmlFor="dashboard-name" className="hbr-css__text-label">
						Name:
					</label>
					<hbr-input
						id="dashboard-name"
						value={dashboardName}
						onInput={(event) => onDashboardNameChange(event.target.value)}
					/>
					<hbr-button
						variant="text"
						onClick={() => onDashboardRemove?.()}
						style={{ paddingInline: "4px" }}
						sentiment="negative"
					>
						<hbr-icon slot="prefix" name="trash" />
						Delete
					</hbr-button>
				</hbr-layout>
				<hbr-button
					onClick={onCancelEdit}
					variant="text"
					style={{ marginLeft: "auto" }}
				>
					Cancel
				</hbr-button>
				<hbr-button
					onClick={onAddWidget}
					variant="outline"
					disabled={booleanAttr(!canAddWidget)}
				>
					<hbr-icon slot="prefix" name="plus" />
					Add widget
				</hbr-button>
				<hbr-button onClick={onSaveEdit}>Save</hbr-button>
			</hbr-layout>
		) : null}
	</hbr-layout>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
const PageHeader = ({
	activeDashboardIndex,
	activeDashboardName,
	dashboardConfigs,
	onCreateDashboard,
	onDashboardSelect,
}) => {
	return (
		<hbr-layout variant="page:header">
			{/* Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Overview</hbr-text>

				<hbr-dropdown menu-fit-trigger style={{ marginLeft: "auto" }}>
					<hbr-button variant="outline" slot="trigger" caret>
						<hbr-icon name="plus" slot="prefix" />
						New Dashboard
					</hbr-button>
					<hbr-menu>
						<hbr-menu-item value="create-new" onClick={onCreateDashboard}>
							Create new
						</hbr-menu-item>
						<hbr-menu-item value="select-template" disabled>
							Select template
						</hbr-menu-item>
					</hbr-menu>
				</hbr-dropdown>
			</hbr-layout>

			{/* Tabs */}
			<hbr-tab-group id="tab-group" primary style={{ marginTop: "4px" }}>
				{dashboardConfigs.map((config, index) => (
					<hbr-tab
						key={`${config.dashboardName}-${index}`}
						slot="nav"
						active={booleanAttr(index === activeDashboardIndex)}
						onClick={() => onDashboardSelect(index)}
					>
						{index === activeDashboardIndex
							? activeDashboardName
							: getDashboardName(config)}
					</hbr-tab>
				))}
			</hbr-tab-group>
		</hbr-layout>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function CustomizableDashboard() {
	const dashboardFlowRef = useRef(null);
	const [dashboardConfigs, setDashboardConfigs] = useState(() =>
		cloneDashboardConfigs(initialDashboardConfigs),
	);
	const [activeDashboardIndex, setActiveDashboardIndex] = useState(0);
	const [dashboardName, setDashboardName] = useState(() =>
		getDashboardName(initialDashboardConfigs[0]),
	);
	const [sectionData, setSectionData] = useState(() =>
		cloneSections(initialDashboardConfigs[0]?.sections || []),
	);
	const [isEditingDashboard, setIsEditingDashboard] = useState(false);
	const [isAddWidgetDrawerOpen, setIsAddWidgetDrawerOpen] = useState(false);
	const [selectedAddWidgetIds, setSelectedAddWidgetIds] = useState([]);
	const [savedDashboardName, setSavedDashboardName] = useState(() =>
		getDashboardName(initialDashboardConfigs[0]),
	);
	const [savedSectionData, setSavedSectionData] = useState(() =>
		cloneSections(initialDashboardConfigs[0]?.sections || []),
	);
	const cardSection = findSectionByWidgetType(sectionData, "card");
	const containerSection = findSectionByWidgetType(sectionData, "container");
	const isContainerSectionEditable = isSectionEditable(containerSection);
	const addWidgetType = containerSection?.widgetType || "container";
	const containerWidgetsVariant = getDashboardWidgetsVariant(addWidgetType);
	const cardWidgetData = getSectionWidgets(cardSection);
	const flowWidgetData = getSectionWidgets(containerSection);
	const statisticsCardData = cardWidgetData.filter(
		(widget) => widget.cardType === "statistics",
	);
	const healthCardData = cardWidgetData.filter(
		(widget) => widget.cardType === "health",
	);
	const basicCardData = cardWidgetData.filter(
		(widget) => widget.cardType === "basic",
	);
	const statisticsWidgetsVariant = getFirstCardTypeVariant(
		statisticsCardData,
		"statistics",
	);
	const healthWidgetsVariant = getFirstCardTypeVariant(
		healthCardData,
		"health",
	);
	const activeDashboard = dashboardConfigs[activeDashboardIndex];
	const handleCreateDashboard = (nextDashboardConfig) => {
		const nextDashboardIndex = dashboardConfigs.length;

		setDashboardConfigs((prev) => [
			...prev,
			cloneDashboardConfig(nextDashboardConfig),
		]);
		setActiveDashboardIndex(nextDashboardIndex);
	};
	const dashboardCreate = useDashboardCreate({
		onCreateDashboard: handleCreateDashboard,
	});
	const dashboardShare = useDashboardShare({
		dashboardName,
		disabled: !activeDashboard,
		resetKey: activeDashboardIndex,
		sections: sectionData,
	});

	useEffect(() => {
		if (!activeDashboard) {
			setDashboardName("");
			setSectionData([]);
			setSavedDashboardName("");
			setSavedSectionData([]);
			setIsEditingDashboard(false);
			setIsAddWidgetDrawerOpen(false);
			setSelectedAddWidgetIds([]);
			return;
		}

		const nextDashboardName = getDashboardName(activeDashboard);
		const nextSections = cloneSections(activeDashboard.sections || []);

		setDashboardName(nextDashboardName);
		setSectionData(nextSections);
		setSavedDashboardName(nextDashboardName);
		setSavedSectionData(cloneSections(nextSections));
		setIsEditingDashboard(false);
		setIsAddWidgetDrawerOpen(false);
		setSelectedAddWidgetIds([]);
	}, [activeDashboard]);

	useLayoutEffect(() => {
		if (!dashboardFlowRef.current) return;
		dashboardFlowRef.current.widgets = flowWidgetData;
	}, [flowWidgetData]);

	// Handles drag-and-drop reordering + span (resize) updates from <hbr-dashboard-flow>.
	// Event detail shape: { order: string[] (widget ids in new order), spanById: { [id]: { base, sm, xs } } }
	const handleFlowLayoutChange = (event) => {
		const { order = [], spanById = {} } = event?.detail ?? {};
		if (!order.length) return;
		if (!isContainerSectionEditable) return;

		setSectionData((prev) =>
			prev.map((section) => {
				if (section.widgetType !== "container" || !isSectionEditable(section)) {
					return section;
				}

				const widgets = getSectionWidgets(section);
				const flowById = new Map(widgets.map((widget) => [widget.id, widget]));
				if (!flowById.size) return section;

				const nextWidgets = [
					...order
						.map((id) => flowById.get(id))
						.filter(Boolean)
						.map((widget) => applySpanPatch(widget, spanById[widget.id])),
					...widgets
						.filter((widget) => !order.includes(widget.id))
						.map((widget) => applySpanPatch(widget, spanById[widget.id])),
				];

				return nextWidgets.some((widget, index) => widget !== widgets[index])
					? { ...section, widgets: nextWidgets }
					: section;
			}),
		);
	};
	useCustomElementEvent(
		dashboardFlowRef,
		"hbr-flow-layout-change",
		handleFlowLayoutChange,
	);

	const handleRemoveWidget = (widgetId) => {
		if (!isContainerSectionEditable) return;

		setSectionData((prev) =>
			prev.map((section) => {
				if (section.widgetType !== "container" || !isSectionEditable(section)) {
					return section;
				}

				const widgets = getSectionWidgets(section);
				const nextWidgets = widgets.filter((widget) => widget.id !== widgetId);
				return nextWidgets.length === widgets.length
					? section
					: { ...section, widgets: nextWidgets };
			}),
		);
	};

	const handleCloseAddWidgetDrawer = () => {
		setIsAddWidgetDrawerOpen(false);
		setSelectedAddWidgetIds([]);
	};

	const handleToggleAddWidget = (widgetId) => {
		setSelectedAddWidgetIds((prev) =>
			prev.includes(widgetId)
				? prev.filter((id) => id !== widgetId)
				: [...prev, widgetId],
		);
	};

	const handleSaveAddWidgetDrawer = () => {
		if (!isContainerSectionEditable || !selectedAddWidgetIds.length) {
			handleCloseAddWidgetDrawer();
			return;
		}

		const nextWidgets = addWidgetOptions
			.filter((widget) => selectedAddWidgetIds.includes(widget.id))
			.map((widget, index) => ({
				...widget,
				id: `section-two-flow-widget-${Date.now()}-${index}`,
			}));

		setSectionData((prev) =>
			prev.map((section) =>
				section.widgetType === addWidgetType && isSectionEditable(section)
					? {
							...section,
							widgets: [...getSectionWidgets(section), ...nextWidgets],
					  }
					: section,
			),
		);
		handleCloseAddWidgetDrawer();
	};

	const handleStartEdit = () => {
		setSavedDashboardName(dashboardName);
		setSavedSectionData(cloneSections(sectionData));
		setIsEditingDashboard(true);
	};

	const handleCancelEdit = () => {
		handleCloseAddWidgetDrawer();
		setDashboardName(savedDashboardName);
		setSectionData(cloneSections(savedSectionData));
		setIsEditingDashboard(false);
	};

	const handleSaveEdit = () => {
		handleCloseAddWidgetDrawer();
		setDashboardConfigs((prev) =>
			prev.map((config, index) =>
				index === activeDashboardIndex
					? {
							...config,
							dashboardName,
							sections: cloneSections(sectionData),
					  }
					: config,
			),
		);
		setSavedDashboardName(dashboardName);
		setSavedSectionData(cloneSections(sectionData));
		setIsEditingDashboard(false);
	};

	const handleAddWidget = () => {
		if (!isContainerSectionEditable) return;
		setIsAddWidgetDrawerOpen(true);
	};

	const handleDashboardSelect = (index) => {
		if (index === activeDashboardIndex) return;
		if (index < 0 || index >= dashboardConfigs.length) return;

		setActiveDashboardIndex(index);
	};

	const handleDashboardRemove = () => {
		if (!dashboardConfigs.length) return;

		const nextDashboardConfigs = dashboardConfigs.filter(
			(_, index) => index !== activeDashboardIndex,
		);
		const nextActiveDashboardIndex = nextDashboardConfigs.length
			? Math.min(activeDashboardIndex, nextDashboardConfigs.length - 1)
			: 0;

		setDashboardConfigs(nextDashboardConfigs);
		setActiveDashboardIndex(nextActiveDashboardIndex);
		handleCloseAddWidgetDrawer();
		setIsEditingDashboard(false);
	};

	return (
		<hbr-layout variant="page">
			<PageHeader
				activeDashboardIndex={activeDashboardIndex}
				activeDashboardName={dashboardName}
				dashboardConfigs={dashboardConfigs}
				onCreateDashboard={dashboardCreate.handleOpenCreateDashboard}
				onDashboardSelect={handleDashboardSelect}
			/>
			<hbr-layout variant="dashboard">
				{/* Dashboard Toolbar */}
				<DashboardToolbar
					dashboardName={dashboardName}
					editMode={isEditingDashboard}
					canAddWidget={isContainerSectionEditable}
					onStartEdit={handleStartEdit}
					onCancelEdit={handleCancelEdit}
					onAddWidget={handleAddWidget}
					onDashboardNameChange={setDashboardName}
					onDashboardRemove={handleDashboardRemove}
					onShareDashboard={dashboardShare.handleShareDashboard}
					onSaveEdit={handleSaveEdit}
				/>
				<AddWidgetDrawer
					onClose={handleCloseAddWidgetDrawer}
					onSave={handleSaveAddWidgetDrawer}
					onToggleWidget={handleToggleAddWidget}
					open={isAddWidgetDrawerOpen && isContainerSectionEditable}
					PreviewComponent={ContainerWidget}
					selectedWidgetIds={selectedAddWidgetIds}
					widgetType={addWidgetType}
				/>
				<DashboardShareModals {...dashboardShare.modalProps} />
				<DashboardCreateDrawer {...dashboardCreate.drawerProps} />

				{cardSection ? (
					<hbr-layout variant="dashboard:section">
						<SectionTitle>{cardSection.sectionTitle}</SectionTitle>

						<hbr-layout variant={statisticsWidgetsVariant}>
							{statisticsCardData.map(({ id, cardType, ...card }) => (
								<StatisticsCard key={id} {...card} />
							))}
						</hbr-layout>

						<hbr-layout variant={healthWidgetsVariant} align="start">
							{healthCardData.map(({ id, ...card }) => (
								<HealthWidgetCard key={id} {...card} />
							))}
							{basicCardData.map(({ id, cardType, ...card }) => (
								<BasicWidgetCard key={id} {...card} />
							))}
						</hbr-layout>
					</hbr-layout>
				) : null}

				{containerSection ? (
					<hbr-layout variant="dashboard:section">
						<SectionTitle>{containerSection.sectionTitle}</SectionTitle>
						<hbr-dashboard-flow
							key={`dashboard-flow-${activeDashboardIndex}`}
							ref={dashboardFlowRef}
						>
							{isEditingDashboard && isContainerSectionEditable ? (
								<hbr-drop-zone direction="horizontal">
									<hbr-drag-ghost slot="ghost" />
									<hbr-layout variant={containerWidgetsVariant}>
										{flowWidgetData.map((widget) => (
											<ContainerWidget
												key={widget.id}
												{...widget}
												editMode={true}
												onRemove={handleRemoveWidget}
											/>
										))}
									</hbr-layout>
								</hbr-drop-zone>
							) : (
								<hbr-layout variant={containerWidgetsVariant}>
									{flowWidgetData.map((widget) => (
										<ContainerWidget key={widget.id} {...widget} />
									))}
								</hbr-layout>
							)}
						</hbr-dashboard-flow>
					</hbr-layout>
				) : null}
			</hbr-layout>
		</hbr-layout>
	);
}

```

### custom-dashboard/AddWidgetDrawer.jsx
```jsx
// file: custom-dashboard/AddWidgetDrawer.jsx
import { useRef } from "react";
import {
	useCustomElementEvent,
	useCustomElementProperty,
} from "./customElementProps";

export const addWidgetOptions = [
	{
		id: "new-widget-1",
		title: "New Widget 1",
	},
	{
		id: "new-widget-2",
		title: "New Widget 2",
	},
	{
		id: "new-widget-3",
		title: "New Widget 3",
	},
];

function AddWidgetOption({ selected, onToggleWidget, widget, widgetType }) {
	const checkboxRef = useRef(null);

	useCustomElementProperty(checkboxRef, "checked", selected);
	useCustomElementEvent(checkboxRef, "hbr-change", () =>
		onToggleWidget(widget.id),
	);

	return (
		<hbr-card container>
			<hbr-layout direction="column" gap="2xs">
				<hbr-checkbox ref={checkboxRef} name={widget.id}>
					{widget.title}
				</hbr-checkbox>
				<hbr-text size="sm" type="secondary">
					Simple {widgetType} widget sample.
				</hbr-text>
			</hbr-layout>
		</hbr-card>
	);
}

export default function AddWidgetDrawer({
	open,
	selectedWidgetIds,
	onClose,
	onSave,
	onToggleWidget,
	PreviewComponent,
	widgetType = "container",
}) {
	const drawerRef = useRef(null);
	const previewWidgetId =
		selectedWidgetIds[selectedWidgetIds.length - 1] || null;
	const previewWidget =
		addWidgetOptions.find((widget) => widget.id === previewWidgetId) ||
		addWidgetOptions[0];

	useCustomElementProperty(drawerRef, "open", open);
	useCustomElementProperty(drawerRef, "scrollAware", true);
	useCustomElementEvent(drawerRef, "hbr-hide", onClose);

	return (
		<hbr-drawer ref={drawerRef} id="add-widget-drawer" size="large">
			<hbr-text variant="drawer-title" slot="label">
				Add widget
			</hbr-text>
			<hbr-layout direction="row" gap="md" align="stretch">
				<hbr-layout direction="column">
					{addWidgetOptions.map((widget) => (
						<AddWidgetOption
							key={widget.id}
							onToggleWidget={onToggleWidget}
							selected={selectedWidgetIds.includes(widget.id)}
							widget={widget}
							widgetType={widgetType}
						/>
					))}
				</hbr-layout>

				<hbr-layout direction="column" style={{ flex: 1 }}>
					<hbr-text size="sm" type="secondary">
						Preview
					</hbr-text>
					<PreviewComponent
						{...previewWidget}
						id={`preview-${previewWidget.id}`}
					/>
				</hbr-layout>
			</hbr-layout>

			<hbr-sticky-action-bar slot="footer" variant="drawer">
				<hbr-button onClick={onClose} variant="text">
					Cancel
				</hbr-button>
				<hbr-button onClick={onSave}>Save</hbr-button>
			</hbr-sticky-action-bar>
		</hbr-drawer>
	);
}

```

### custom-dashboard/DashboardCreate.jsx
```jsx
// file: custom-dashboard/DashboardCreate.jsx
import { useRef, useState } from "react";
import {
	booleanAttr,
	useCustomElementEvent,
	useCustomElementProperty,
} from "./customElementProps";

const CARD_TYPES = [
	{ label: "Statistics", value: "statistics" },
	{ label: "Health", value: "health" },
	{ label: "Basic", value: "basic" },
];

const SENTIMENTS = [
	{ label: "Positive", value: "positive" },
	{ label: "Warning", value: "warning" },
	{ label: "Negative", value: "negative" },
];

const fieldGridStyle = {
	flexWrap: "wrap",
};

const fieldStyle = {
	flex: "1 1 180px",
	minWidth: "0",
};

const wideFieldStyle = {
	flex: "1 1 280px",
	minWidth: "0",
};

const widgetEditorStyle = {
	backgroundColor: "var(--base-bg-medium-default)",
	border: "1px solid var(--base-border-medium-default)",
	borderRadius: "4px",
	padding: "12px",
};

const getDraftId = (prefix) =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getDraftWidgets = (section) =>
	Array.isArray(section.widgets) ? section.widgets : [];

const getDraftMetrics = (widget) =>
	Array.isArray(widget.metrics) ? widget.metrics : [];

const DEFAULT_METRIC_DRAFTS = [
	{
		value: "62",
		label: "Online",
		sentiment: "positive",
		icon: "status-positive",
	},
	{
		value: "21",
		label: "Alerting",
		sentiment: "warning",
		icon: "status-warning",
	},
	{
		value: "7",
		label: "Offline",
		sentiment: "negative",
		icon: "status-negative",
	},
];

const createMetricDraft = (index = 0) => ({
	id: getDraftId("metric-draft"),
	...(DEFAULT_METRIC_DRAFTS[index] || {
		value: "0",
		label: `Metric ${index + 1}`,
		sentiment: "positive",
		icon: "status-positive",
	}),
});

const createStatisticsWidgetDraft = (index = 0) => ({
	id: getDraftId("card-widget-draft"),
	cardType: "statistics",
	title: `Title ${index + 1}`,
	value: `Value ${index + 1}`,
});

const createHealthWidgetDraft = (index = 0) => ({
	id: getDraftId("card-widget-draft"),
	cardType: "health",
	title: `Health Card ${index + 1}`,
	icon: "wifi-high",
	metrics: [createMetricDraft(0), createMetricDraft(1), createMetricDraft(2)],
});

const createBasicWidgetDraft = (index = 0) => ({
	id: getDraftId("card-widget-draft"),
	cardType: "basic",
	title: `Basic Widget ${index + 1}`,
	status: "Positive",
});

const createCardWidgetDraft = (index = 0, cardType = "statistics") => {
	if (cardType === "health") return createHealthWidgetDraft(index);
	if (cardType === "basic") return createBasicWidgetDraft(index);
	return createStatisticsWidgetDraft(index);
};

const createContainerWidgetDraft = (index = 0) => ({
	id: getDraftId("container-widget-draft"),
	title: `Container Widget ${index + 1}`,
});

const createWidgetDraft = (widgetType = "container", index = 0) =>
	widgetType === "card"
		? createCardWidgetDraft(index)
		: createContainerWidgetDraft(index);

const createSectionDraft = (index = 0) => {
	const widgetType = index === 0 ? "card" : "container";

	return {
		id: getDraftId("section-draft"),
		sectionTitle: `Section ${index + 1}`,
		widgetType,
		editable: widgetType === "container",
		widgets: [createWidgetDraft(widgetType, 0)],
	};
};

const createInitialDraft = () => ({
	dashboardName: "New Dashboard",
	sections: [createSectionDraft(0)],
});

const toTextValue = (value, fallback) => {
	const trimmedValue = `${value ?? ""}`.trim();
	return trimmedValue || fallback;
};

const toMetricId = (metric, index) => {
	const rawId = toTextValue(metric.id || metric.label, `metric-${index + 1}`);
	const metricId = rawId
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return metricId || `metric-${index + 1}`;
};

const serializeStatisticsWidget = (widget, sectionIndex, widgetIndex) => ({
	id: `section-${sectionIndex + 1}-statistics-card-${widgetIndex + 1}`,
	cardType: "statistics",
	title: toTextValue(widget.title, `Title ${widgetIndex + 1}`),
	value: toTextValue(widget.value, `Value ${widgetIndex + 1}`),
});

const serializeHealthWidget = (widget, sectionIndex, widgetIndex) => ({
	id: `section-${sectionIndex + 1}-health-card-${widgetIndex + 1}`,
	cardType: "health",
	title: toTextValue(widget.title, `Health Card ${widgetIndex + 1}`),
	icon: toTextValue(widget.icon, "wifi-high"),
	metrics: getDraftMetrics(widget).map((metric, metricIndex) => {
		const metricConfig = {
			id: toMetricId(metric, metricIndex),
			value: toTextValue(metric.value, "0"),
			label: toTextValue(metric.label, `Metric ${metricIndex + 1}`),
			sentiment: metric.sentiment || "positive",
		};
		const metricIcon = `${metric.icon ?? ""}`.trim();

		if (metricIcon) {
			metricConfig.icon = metricIcon;
		}

		return metricConfig;
	}),
});

const serializeBasicWidget = (widget, sectionIndex, widgetIndex) => ({
	id: `section-${sectionIndex + 1}-basic-card-${widgetIndex + 1}`,
	cardType: "basic",
	title: toTextValue(widget.title, `Basic Widget ${widgetIndex + 1}`),
	status: toTextValue(widget.status, "Positive"),
});

const serializeCardWidget = (widget, sectionIndex, widgetIndex) => {
	if (widget.cardType === "health") {
		return serializeHealthWidget(widget, sectionIndex, widgetIndex);
	}

	if (widget.cardType === "basic") {
		return serializeBasicWidget(widget, sectionIndex, widgetIndex);
	}

	return serializeStatisticsWidget(widget, sectionIndex, widgetIndex);
};

const serializeContainerWidget = (widget, sectionIndex, widgetIndex) => ({
	id: `section-${sectionIndex + 1}-container-widget-${widgetIndex + 1}`,
	title: toTextValue(widget.title, `Container Widget ${widgetIndex + 1}`),
});

const createDashboardConfig = (draft) => ({
	dashboardName: toTextValue(draft.dashboardName, "Untitled Dashboard"),
	sections: draft.sections.map((section, sectionIndex) => {
		const widgetType = section.widgetType || "container";
		const widgets = getDraftWidgets(section);

		return {
			id: `section-${sectionIndex + 1}-${widgetType}`,
			sectionTitle: toTextValue(
				section.sectionTitle,
				`Section ${sectionIndex + 1}`,
			),
			widgetType,
			editable: section.editable === true,
			widgets:
				widgetType === "card"
					? widgets.map((widget, widgetIndex) =>
							serializeCardWidget(widget, sectionIndex, widgetIndex),
					  )
					: widgets.map((widget, widgetIndex) =>
							serializeContainerWidget(widget, sectionIndex, widgetIndex),
					  ),
		};
	}),
});

function StatisticsWidgetFields({ onUpdateWidget, sectionId, widget }) {
	return (
		<hbr-input
			label="Value"
			value={widget.value}
			onInput={(event) =>
				onUpdateWidget(sectionId, widget.id, {
					value: event.target.value,
				})
			}
			style={fieldStyle}
		/>
	);
}

function HealthMetricFields({
	metric,
	metricIndex,
	onRemoveMetric,
	onUpdateMetric,
	sectionId,
	widget,
}) {
	return (
		<hbr-layout
			key={metric.id}
			direction="row"
			gap="sm"
			align="end"
			style={fieldGridStyle}
		>
			<hbr-input
				label={`Metric ${metricIndex + 1} value`}
				value={metric.value}
				onInput={(event) =>
					onUpdateMetric(sectionId, widget.id, metric.id, {
						value: event.target.value,
					})
				}
				style={fieldStyle}
			/>
			<hbr-input
				label="Label"
				value={metric.label}
				onInput={(event) =>
					onUpdateMetric(sectionId, widget.id, metric.id, {
						label: event.target.value,
					})
				}
				style={fieldStyle}
			/>
			<hbr-select
				label="Sentiment"
				value={metric.sentiment}
				onhbr-change={(event) =>
					onUpdateMetric(sectionId, widget.id, metric.id, {
						sentiment: event.target.value,
					})
				}
				style={fieldStyle}
			>
				{SENTIMENTS.map((sentiment) => (
					<hbr-option key={sentiment.value} value={sentiment.value}>
						{sentiment.label}
					</hbr-option>
				))}
			</hbr-select>
			<hbr-input
				label="Icon"
				value={metric.icon}
				onInput={(event) =>
					onUpdateMetric(sectionId, widget.id, metric.id, {
						icon: event.target.value,
					})
				}
				style={fieldStyle}
			/>
			<hbr-button
				variant="text"
				sentiment="negative"
				disabled={booleanAttr(getDraftMetrics(widget).length <= 1)}
				onClick={() => onRemoveMetric(sectionId, widget.id, metric.id)}
			>
				<hbr-icon slot="prefix" name="trash" />
				Remove
			</hbr-button>
		</hbr-layout>
	);
}

function HealthWidgetFields({
	onAddMetric,
	onRemoveMetric,
	onUpdateMetric,
	onUpdateWidget,
	sectionId,
	widget,
}) {
	const metrics = getDraftMetrics(widget);

	return (
		<>
			<hbr-input
				label="Icon"
				value={widget.icon}
				onInput={(event) =>
					onUpdateWidget(sectionId, widget.id, {
						icon: event.target.value,
					})
				}
				style={fieldStyle}
			/>
			<hbr-layout direction="column" gap="xs">
				<hbr-layout direction="row" gap="xs" align="center">
					<hbr-text type="secondary" size="sm" weight="semibold">
						Metrics
					</hbr-text>
					<hbr-button
						variant="outline"
						size="small"
						onClick={() => onAddMetric(sectionId, widget.id)}
						style={{ marginLeft: "auto" }}
					>
						<hbr-icon slot="prefix" name="plus" />
						Add metric
					</hbr-button>
				</hbr-layout>
				{metrics.map((metric, metricIndex) => (
					<HealthMetricFields
						key={metric.id}
						metric={metric}
						metricIndex={metricIndex}
						onRemoveMetric={onRemoveMetric}
						onUpdateMetric={onUpdateMetric}
						sectionId={sectionId}
						widget={widget}
					/>
				))}
			</hbr-layout>
		</>
	);
}

function BasicWidgetFields({ onUpdateWidget, sectionId, widget }) {
	return (
		<hbr-input
			label="Status"
			value={widget.status}
			onInput={(event) =>
				onUpdateWidget(sectionId, widget.id, {
					status: event.target.value,
				})
			}
			style={fieldStyle}
		/>
	);
}

function CardWidgetFields({
	onAddMetric,
	onRemoveMetric,
	onUpdateMetric,
	onUpdateWidget,
	sectionId,
	widget,
}) {
	return (
		<>
			<hbr-layout direction="row" gap="sm" align="start" style={fieldGridStyle}>
				<hbr-select
					label="Card type"
					value={widget.cardType}
					onhbr-change={(event) =>
						onUpdateWidget(sectionId, widget.id, {
							cardType: event.target.value,
						})
					}
					style={fieldStyle}
				>
					{CARD_TYPES.map((cardType) => (
						<hbr-option key={cardType.value} value={cardType.value}>
							{cardType.label}
						</hbr-option>
					))}
				</hbr-select>
				<hbr-input
					label="Title"
					value={widget.title}
					onInput={(event) =>
						onUpdateWidget(sectionId, widget.id, {
							title: event.target.value,
						})
					}
					style={wideFieldStyle}
				/>
				{widget.cardType === "statistics" ? (
					<StatisticsWidgetFields
						onUpdateWidget={onUpdateWidget}
						sectionId={sectionId}
						widget={widget}
					/>
				) : null}
				{widget.cardType === "basic" ? (
					<BasicWidgetFields
						onUpdateWidget={onUpdateWidget}
						sectionId={sectionId}
						widget={widget}
					/>
				) : null}
			</hbr-layout>
			{widget.cardType === "health" ? (
				<HealthWidgetFields
					onAddMetric={onAddMetric}
					onRemoveMetric={onRemoveMetric}
					onUpdateMetric={onUpdateMetric}
					onUpdateWidget={onUpdateWidget}
					sectionId={sectionId}
					widget={widget}
				/>
			) : null}
		</>
	);
}

function ContainerWidgetFields({ onUpdateWidget, sectionId, widget }) {
	return (
		<hbr-layout direction="row" gap="sm" align="start" style={fieldGridStyle}>
			<hbr-input
				label="Title"
				value={widget.title}
				onInput={(event) =>
					onUpdateWidget(sectionId, widget.id, {
						title: event.target.value,
					})
				}
				style={wideFieldStyle}
			/>
		</hbr-layout>
	);
}

function WidgetEditor({
	onAddMetric,
	onRemoveMetric,
	onRemoveWidget,
	onUpdateMetric,
	onUpdateWidget,
	section,
	widget,
	widgetIndex,
}) {
	const widgets = getDraftWidgets(section);

	return (
		<hbr-layout direction="column" gap="sm" style={widgetEditorStyle}>
			<hbr-layout direction="row" gap="xs" align="center">
				<hbr-text type="secondary" size="sm" weight="semibold">
					Widget {widgetIndex + 1}
				</hbr-text>
				<hbr-button
					variant="text"
					sentiment="negative"
					disabled={booleanAttr(widgets.length <= 1)}
					onClick={() => onRemoveWidget(section.id, widget.id)}
					style={{ marginLeft: "auto" }}
				>
					<hbr-icon slot="prefix" name="trash" />
					Remove
				</hbr-button>
			</hbr-layout>
			{section.widgetType === "card" ? (
				<CardWidgetFields
					onAddMetric={onAddMetric}
					onRemoveMetric={onRemoveMetric}
					onUpdateMetric={onUpdateMetric}
					onUpdateWidget={onUpdateWidget}
					sectionId={section.id}
					widget={widget}
				/>
			) : (
				<ContainerWidgetFields
					onUpdateWidget={onUpdateWidget}
					sectionId={section.id}
					widget={widget}
				/>
			)}
		</hbr-layout>
	);
}

export function DashboardCreateDrawer({
	draft,
	onAddMetric,
	onAddSection,
	onAddWidget,
	onCancel,
	onCreate,
	onRemoveMetric,
	onRemoveSection,
	onRemoveWidget,
	onUpdateDashboardName,
	onUpdateMetric,
	onUpdateSection,
	onUpdateWidget,
	open,
}) {
	const drawerRef = useRef(null);

	useCustomElementProperty(drawerRef, "open", open);
	useCustomElementProperty(drawerRef, "scrollAware", true);
	useCustomElementEvent(drawerRef, "hbr-hide", onCancel);

	return (
		<hbr-drawer
			ref={drawerRef}
			id="create-dashboard-drawer"
			style={{ "--size": "640px" }}
		>
			<hbr-layout direction="column" gap="2xs" slot="label">
				<hbr-text variant="drawer-title">
					Create dashboard (Sample only)
				</hbr-text>
				<hbr-text size="sm" type="secondary">
					Compose a dashboard from sections and widgets.
				</hbr-text>
			</hbr-layout>

			<hbr-layout direction="column" gap="md">
				<hbr-input
					label="Page title"
					value={draft.dashboardName}
					onInput={(event) => onUpdateDashboardName(event.target.value)}
				/>

				{draft.sections.map((section, index) => (
					<hbr-card container key={section.id}>
						<hbr-layout direction="column" gap="sm">
							<hbr-layout direction="row" gap="xs" align="center">
								<hbr-text variant="sub-section-title">
									Section {index + 1}
								</hbr-text>
								{draft.sections.length > 1 ? (
									<hbr-button
										variant="text"
										sentiment="negative"
										onClick={() => onRemoveSection(section.id)}
										style={{ marginLeft: "auto" }}
									>
										<hbr-icon slot="prefix" name="trash" />
										Remove
									</hbr-button>
								) : null}
							</hbr-layout>

							<hbr-layout
								direction="row"
								gap="sm"
								align="start"
								style={fieldGridStyle}
							>
								<hbr-input
									label="Section title"
									value={section.sectionTitle}
									onInput={(event) =>
										onUpdateSection(section.id, {
											sectionTitle: event.target.value,
										})
									}
									style={wideFieldStyle}
								/>

								<hbr-select
									label="Widget type"
									value={section.widgetType}
									onhbr-change={(event) =>
										onUpdateSection(section.id, {
											widgetType: event.target.value,
										})
									}
									style={fieldStyle}
								>
									<hbr-option value="card">Card</hbr-option>
									<hbr-option value="container">Container</hbr-option>
								</hbr-select>
							</hbr-layout>

							<hbr-layout direction="column" gap="xs">
								<hbr-layout direction="row" gap="xs" align="center">
									<hbr-text type="secondary" size="sm" weight="semibold">
										Widgets
									</hbr-text>
									<hbr-button
										variant="outline"
										size="small"
										onClick={() => onAddWidget(section.id)}
										style={{ marginLeft: "auto" }}
									>
										<hbr-icon slot="prefix" name="plus" />
										Add widget
									</hbr-button>
								</hbr-layout>
								{getDraftWidgets(section).map((widget, widgetIndex) => (
									<WidgetEditor
										key={widget.id}
										onAddMetric={onAddMetric}
										onRemoveMetric={onRemoveMetric}
										onRemoveWidget={onRemoveWidget}
										onUpdateMetric={onUpdateMetric}
										onUpdateWidget={onUpdateWidget}
										section={section}
										widget={widget}
										widgetIndex={widgetIndex}
									/>
								))}
							</hbr-layout>
						</hbr-layout>
					</hbr-card>
				))}

				<hbr-button variant="outline" onClick={onAddSection}>
					<hbr-icon slot="prefix" name="plus" />
					Add section
				</hbr-button>
			</hbr-layout>

			<hbr-sticky-action-bar slot="footer" variant="drawer">
				<hbr-button onClick={onCancel} variant="text">
					Cancel
				</hbr-button>
				<hbr-button onClick={onCreate}>Create</hbr-button>
			</hbr-sticky-action-bar>
		</hbr-drawer>
	);
}

export function useDashboardCreate({ onCreateDashboard }) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(() => createInitialDraft());

	const resetDraft = () => {
		setDraft(createInitialDraft());
	};

	const handleOpenCreateDashboard = () => {
		resetDraft();
		setOpen(true);
	};

	const handleCloseCreateDashboard = () => {
		setOpen(false);
		resetDraft();
	};

	const handleUpdateDashboardName = (dashboardName) => {
		setDraft((current) => ({
			...current,
			dashboardName,
		}));
	};

	const handleUpdateSection = (sectionId, patch) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				if (patch.widgetType && patch.widgetType !== section.widgetType) {
					return {
						...section,
						...patch,
						editable: patch.widgetType === "container",
						widgets: [createWidgetDraft(patch.widgetType, 0)],
					};
				}

				return { ...section, ...patch };
			}),
		}));
	};

	const handleAddSection = () => {
		setDraft((current) => ({
			...current,
			sections: [
				...current.sections,
				createSectionDraft(current.sections.length),
			],
		}));
	};

	const handleRemoveSection = (sectionId) => {
		setDraft((current) => {
			const nextSections = current.sections.filter(
				(section) => section.id !== sectionId,
			);

			return {
				...current,
				sections: nextSections.length ? nextSections : current.sections,
			};
		});
	};

	const handleAddWidget = (sectionId) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				const widgets = getDraftWidgets(section);

				return {
					...section,
					widgets: [
						...widgets,
						createWidgetDraft(section.widgetType, widgets.length),
					],
				};
			}),
		}));
	};

	const handleRemoveWidget = (sectionId, widgetId) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				const widgets = getDraftWidgets(section);
				const nextWidgets = widgets.filter((widget) => widget.id !== widgetId);

				return {
					...section,
					widgets: nextWidgets.length ? nextWidgets : widgets,
				};
			}),
		}));
	};

	const handleUpdateWidget = (sectionId, widgetId, patch) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				return {
					...section,
					widgets: getDraftWidgets(section).map((widget, widgetIndex) => {
						if (widget.id !== widgetId) return widget;

						if (patch.cardType && patch.cardType !== widget.cardType) {
							const nextWidget = createCardWidgetDraft(
								widgetIndex,
								patch.cardType,
							);

							return {
								...nextWidget,
								id: widget.id,
								title: widget.title || nextWidget.title,
							};
						}

						return { ...widget, ...patch };
					}),
				};
			}),
		}));
	};

	const handleAddMetric = (sectionId, widgetId) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				return {
					...section,
					widgets: getDraftWidgets(section).map((widget) => {
						if (widget.id !== widgetId) return widget;

						const metrics = getDraftMetrics(widget);

						return {
							...widget,
							metrics: [...metrics, createMetricDraft(metrics.length)],
						};
					}),
				};
			}),
		}));
	};

	const handleRemoveMetric = (sectionId, widgetId, metricId) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				return {
					...section,
					widgets: getDraftWidgets(section).map((widget) => {
						if (widget.id !== widgetId) return widget;

						const metrics = getDraftMetrics(widget);
						const nextMetrics = metrics.filter(
							(metric) => metric.id !== metricId,
						);

						return {
							...widget,
							metrics: nextMetrics.length ? nextMetrics : metrics,
						};
					}),
				};
			}),
		}));
	};

	const handleUpdateMetric = (sectionId, widgetId, metricId, patch) => {
		setDraft((current) => ({
			...current,
			sections: current.sections.map((section) => {
				if (section.id !== sectionId) return section;

				return {
					...section,
					widgets: getDraftWidgets(section).map((widget) => {
						if (widget.id !== widgetId) return widget;

						return {
							...widget,
							metrics: getDraftMetrics(widget).map((metric) =>
								metric.id === metricId ? { ...metric, ...patch } : metric,
							),
						};
					}),
				};
			}),
		}));
	};

	const handleCreateDashboard = () => {
		onCreateDashboard?.(createDashboardConfig(draft));
		handleCloseCreateDashboard();
	};

	return {
		drawerProps: {
			draft,
			onAddMetric: handleAddMetric,
			onAddSection: handleAddSection,
			onAddWidget: handleAddWidget,
			onCancel: handleCloseCreateDashboard,
			onCreate: handleCreateDashboard,
			onRemoveMetric: handleRemoveMetric,
			onRemoveSection: handleRemoveSection,
			onRemoveWidget: handleRemoveWidget,
			onUpdateDashboardName: handleUpdateDashboardName,
			onUpdateMetric: handleUpdateMetric,
			onUpdateSection: handleUpdateSection,
			onUpdateWidget: handleUpdateWidget,
			open,
		},
		handleOpenCreateDashboard,
	};
}

```

### custom-dashboard/DashboardShare.jsx
```jsx
// file: custom-dashboard/DashboardShare.jsx
import { useEffect, useRef, useState } from "react";
import {
	useCustomElementEvent,
	useCustomElementProperty,
} from "./customElementProps";

const cloneWidgets = (widgets) => widgets.map((widget) => ({ ...widget }));
const cloneSections = (sections) =>
	sections.map((section) => ({
		...section,
		widgets: cloneWidgets(
			Array.isArray(section.widgets) ? section.widgets : [],
		),
	}));

export const exportDashboardDataAsJson = (dashboardName, sections) => ({
	dashboardName,
	sections: cloneSections(Array.isArray(sections) ? sections : []),
});

const copyJsonToClipboard = async (json) => {
	const jsonText = JSON.stringify(json, null, 2);

	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(jsonText);
		return;
	}

	if (typeof document === "undefined") return;

	const textArea = document.createElement("textarea");
	textArea.value = jsonText;
	textArea.style.position = "fixed";
	textArea.style.opacity = "0";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand("copy");
	document.body.removeChild(textArea);
};

const downloadJson = (json) => {
	if (typeof document === "undefined" || typeof URL === "undefined") return;

	const blob = new Blob([JSON.stringify(json, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `dashboard-config-${Date.now()}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

const JsonPreviewModal = ({ open, json, onClose, onCopy, onDownload }) => {
	const modalRef = useRef(null);

	useCustomElementProperty(modalRef, "open", open);
	useCustomElementProperty(modalRef, "scrollAware", true);
	useCustomElementEvent(modalRef, "hbr-hide", (event) => {
		if (event.target !== modalRef.current) return;
		onClose?.(event);
	});

	if (!open || !json) return null;

	const jsonText = JSON.stringify(json, null, 2);

	return (
		<hbr-modal
			ref={modalRef}
			label="Dashboard Configuration (JSON)"
			size="large"
		>
			<hbr-code-snippet code={jsonText} />
			<hbr-layout slot="footer" style={{ justifyContent: "flex-end" }}>
				<hbr-button variant="text" onClick={onClose}>
					Close
				</hbr-button>
				<hbr-copyclipboard iconOnly={true} value={jsonText} size="large" />
				<hbr-button onClick={onDownload}>
					<hbr-icon slot="prefix" name="download-simple" />
					Download JSON
				</hbr-button>
			</hbr-layout>
		</hbr-modal>
	);
};

export function DashboardShareModals({
	jsonPreviewOpen,
	shareCancelConfirmOpen,
	shareDashboardOpen,
	shareExportComplete,
	sharedJson,
	onCancelLeaveShare,
	onCancelShareDashboard,
	onCloseJsonPreview,
	onCloseShareDashboard,
	onConfirmLeaveShare,
	onCopy,
	onDownload,
	onExport,
	onHideLeaveShare,
	onHideShareDashboard,
}) {
	const leaveModalRef = useRef(null);
	const shareModalRef = useRef(null);

	useCustomElementProperty(leaveModalRef, "open", shareCancelConfirmOpen);
	useCustomElementProperty(shareModalRef, "open", shareDashboardOpen);
	useCustomElementEvent(leaveModalRef, "hbr-hide", (event) => {
		if (event.target !== leaveModalRef.current) return;
		onHideLeaveShare?.(event);
	});
	useCustomElementEvent(shareModalRef, "hbr-hide", (event) => {
		if (event.target !== shareModalRef.current) return;
		onHideShareDashboard?.(event);
	});

	return (
		<>
			<JsonPreviewModal
				open={jsonPreviewOpen}
				json={sharedJson}
				onClose={onCloseJsonPreview}
				onCopy={onCopy}
				onDownload={onDownload}
			/>
			<hbr-modal
				ref={shareModalRef}
				label="Share dashboard template"
				size="xsmall"
			>
				<hbr-layout direction="column" gap="md">
					<hbr-text>
						By exporting and sharing this dashboard, users can import and
						replicate it on another page or account.
					</hbr-text>
					<hbr-layout direction="column" gap="xs">
						<hbr-text>Export as JSON</hbr-text>
						<hbr-button onClick={onExport} variant="outline">
							<hbr-icon name="download-simple" slot="prefix" />
							Export
						</hbr-button>
					</hbr-layout>
				</hbr-layout>
				<hbr-layout
					slot="footer"
					direction="row"
					gap="md"
					style={{ justifyContent: "flex-end" }}
				>
					<hbr-button variant="text" onClick={onCancelShareDashboard}>
						Cancel
					</hbr-button>
					<hbr-button
						key={
							shareExportComplete ? "share-done-enabled" : "share-done-disabled"
						}
						disabled={!shareExportComplete}
						onClick={onCloseShareDashboard}
					>
						Done
					</hbr-button>
				</hbr-layout>
			</hbr-modal>
			<hbr-modal ref={leaveModalRef} size="xsmall">
				<hbr-layout slot="label" gap="sm">
					<hbr-icon name="alerts-warning-large" sentiment="warning" />
					<span>Leave page?</span>
				</hbr-layout>
				<div>Changes you made to this dashboard page may not be saved.</div>
				<hbr-layout
					slot="footer"
					direction="row"
					gap="md"
					style={{ justifyContent: "flex-end" }}
				>
					<hbr-button variant="text" onClick={onCancelLeaveShare}>
						Cancel
					</hbr-button>
					<hbr-button sentiment="danger" onClick={onConfirmLeaveShare}>
						Leave
					</hbr-button>
				</hbr-layout>
			</hbr-modal>
		</>
	);
}

export function useDashboardShare({
	dashboardName,
	disabled = false,
	resetKey,
	sections,
}) {
	const [shareDashboardOpen, setShareDashboardOpen] = useState(false);
	const [shareCancelConfirmOpen, setShareCancelConfirmOpen] = useState(false);
	const [shareExportComplete, setShareExportComplete] = useState(false);
	const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
	const [sharedJson, setSharedJson] = useState(null);

	useEffect(() => {
		if (resetKey === undefined) return;

		setShareDashboardOpen(false);
		setShareCancelConfirmOpen(false);
		setShareExportComplete(false);
		setJsonPreviewOpen(false);
		setSharedJson(null);
	}, [resetKey]);

	const getSharedDashboardJson = () =>
		exportDashboardDataAsJson(dashboardName, sections);

	const handleShareDashboard = () => {
		if (disabled) return;
		setShareCancelConfirmOpen(false);
		setShareExportComplete(false);
		setShareDashboardOpen(true);
	};

	const handleCancelShareDashboard = () => {
		setShareDashboardOpen(false);
		setShareCancelConfirmOpen(true);
	};

	const handleCloseShareDashboard = () => {
		setShareDashboardOpen(false);
		setShareExportComplete(false);
	};

	const handleExportDashboard = () => {
		setSharedJson(getSharedDashboardJson());
		setShareDashboardOpen(false);
		setJsonPreviewOpen(true);
	};

	const handleCopySharedJson = async () => {
		try {
			await copyJsonToClipboard(sharedJson || getSharedDashboardJson());
		} catch (error) {
			console.error("Failed to copy dashboard JSON", error);
		}
	};

	const handleDownloadSharedJson = () => {
		downloadJson(sharedJson || getSharedDashboardJson());
	};

	const handleCloseJsonPreview = () => {
		setJsonPreviewOpen(false);
		setShareExportComplete(true);
		setShareDashboardOpen(true);
	};

	const handleCancelLeaveShare = () => {
		setShareCancelConfirmOpen(false);
		setShareDashboardOpen(true);
	};

	const handleConfirmLeaveShare = () => {
		setShareCancelConfirmOpen(false);
		setShareDashboardOpen(false);
		setShareExportComplete(false);
	};

	return {
		handleShareDashboard,
		modalProps: {
			jsonPreviewOpen,
			shareCancelConfirmOpen,
			shareDashboardOpen,
			shareExportComplete,
			sharedJson,
			onCancelLeaveShare: handleCancelLeaveShare,
			onCancelShareDashboard: handleCancelShareDashboard,
			onCloseJsonPreview: handleCloseJsonPreview,
			onCloseShareDashboard: handleCloseShareDashboard,
			onConfirmLeaveShare: handleConfirmLeaveShare,
			onCopy: handleCopySharedJson,
			onDownload: handleDownloadSharedJson,
			onExport: handleExportDashboard,
			onHideLeaveShare: () => setShareCancelConfirmOpen(false),
			onHideShareDashboard: () => setShareDashboardOpen(false),
		},
	};
}

```

### custom-dashboard/config.json
```json
// file: custom-dashboard/config.json
{
	"dashboardName": "Dashboard 1",
	"sections": [
		{
			"id": "overview-cards",
			"sectionTitle": "Section title",
			"widgetType": "card",
			"editable": false,
			"widgets": [
				{
					"id": "section-one-statistic-card-1",
					"cardType": "statistics",
					"title": "Title 1",
					"value": "Value 1"
				},
				{
					"id": "section-one-statistic-card-2",
					"cardType": "statistics",
					"title": "Title 2",
					"value": "Value 2"
				},
				{
					"id": "section-one-statistic-card-3",
					"cardType": "statistics",
					"title": "Title 3",
					"value": "Value 3"
				},
				{
					"id": "section-one-health-card-1",
					"cardType": "health",
					"title": "Health Card 1",
					"icon": "wifi-high",
					"metrics": [
						{
							"id": "online",
							"value": "62",
							"label": "Online",
							"sentiment": "positive",
							"icon": "status-positive"
						},
						{
							"id": "alerting",
							"value": "21",
							"label": "Alerting",
							"sentiment": "warning",
							"icon": "status-warning"
						}
					]
				},
				{
					"id": "section-one-health-card-2",
					"cardType": "health",
					"title": "Health Card 2",
					"icon": "wifi-high",
					"metrics": [
						{
							"id": "online",
							"value": "74",
							"label": "Online",
							"sentiment": "positive",
							"icon": "status-positive"
						},
						{
							"id": "alerting",
							"value": "9",
							"label": "Alerting",
							"sentiment": "warning",
							"icon": "status-warning"
						}
					]
				},
				{
					"id": "section-one-basic-card-1",
					"cardType": "basic",
					"title": "Basic Widget",
					"status": "Positive"
				}
			]
		},
		{
			"id": "container-widgets",
			"sectionTitle": "Section title",
			"widgetType": "container",
			"editable": true,
			"widgets": [
				{
					"id": "section-two-flow-widget-1",
					"title": "Container Widget 1"
				},
				{
					"id": "section-two-flow-widget-2",
					"title": "Container Widget 2"
				},
				{
					"id": "section-two-flow-widget-3",
					"title": "Container Widget 3"
				},
				{
					"id": "section-two-widget-4",
					"title": "Container Widget 4"
				},
				{
					"id": "section-two-widget-5",
					"title": "Container Widget 5"
				}
			]
		}
	]
}

```

### custom-dashboard/config2.json
```json
// file: custom-dashboard/config2.json
{
	"dashboardName": "Dashboard 2",
	"sections": [
		{
			"id": "dashboard-two-overview-cards",
			"sectionTitle": "Dashboard 2 overview",
			"widgetType": "card",
			"editable": false,
			"widgets": [
				{
					"id": "dashboard-two-statistic-card-1",
					"cardType": "statistics",
					"title": "Title 1",
					"value": "Value 1"
				},
				{
					"id": "dashboard-two-statistic-card-2",
					"cardType": "statistics",
					"title": "Title 2",
					"value": "Value 2"
				},
				{
					"id": "dashboard-two-statistic-card-3",
					"cardType": "statistics",
					"title": "Title 3",
					"value": "Value 3"
				},
				{
					"id": "dashboard-two-health-card-1",
					"cardType": "health",
					"title": "Health Card 1",
					"icon": "wifi-high",
					"metrics": [
						{
							"id": "online",
							"value": "58",
							"label": "Online",
							"sentiment": "positive",
							"icon": "status-positive"
						},
						{
							"id": "alerting",
							"value": "17",
							"label": "Alerting",
							"sentiment": "warning",
							"icon": "status-warning"
						}
					]
				},
				{
					"id": "dashboard-two-health-card-2",
					"cardType": "health",
					"title": "Health Card 2",
					"icon": "wifi-high",
					"metrics": [
						{
							"id": "online",
							"value": "81",
							"label": "Online",
							"sentiment": "positive",
							"icon": "status-positive"
						},
						{
							"id": "alerting",
							"value": "6",
							"label": "Alerting",
							"sentiment": "warning",
							"icon": "status-warning"
						}
					]
				},
				{
					"id": "dashboard-two-basic-card-1",
					"cardType": "basic",
					"title": "Basic Widget",
					"status": "Positive"
				}
			]
		},
		{
			"id": "dashboard-two-container-widgets",
			"sectionTitle": "Dashboard 2 widgets",
			"widgetType": "container",
			"editable": true,
			"widgets": [
				{
					"id": "dashboard-two-flow-widget-1",
					"title": "Container Widget 1"
				},
				{
					"id": "dashboard-two-flow-widget-2",
					"title": "Container Widget 2"
				},
				{
					"id": "dashboard-two-flow-widget-3",
					"title": "Container Widget 3"
				},
				{
					"id": "dashboard-two-widget-4",
					"title": "Container Widget 4"
				},
				{
					"id": "dashboard-two-widget-5",
					"title": "Container Widget 5"
				}
			]
		}
	]
}

```