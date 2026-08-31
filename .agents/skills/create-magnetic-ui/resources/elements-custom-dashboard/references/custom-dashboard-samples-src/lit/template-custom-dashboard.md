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
### custom-dashboard.js
```js
// file: custom-dashboard.js
import { dashboardConfigs as initialDashboardConfigs } from "/pages/templates/custom-dashboard/config.js";

const addWidgetOptions = [
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

const cloneWidgets = (widgets) =>
	widgets.map((widget) => ({
		...widget,
		metrics: widget.metrics?.map((metric) => ({ ...metric })),
	}));

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

const escapeHtml = (value) =>
	`${value ?? ""}`
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const getSectionByType = (sections, widgetType) =>
	sections.find((section) => section.widgetType === widgetType) || null;

const getWidgets = (section) =>
	Array.isArray(section?.widgets) ? section.widgets : [];

const getWidgetSpan = (widget) => {
	if (
		!widget ||
		(widget.dataColSpan == null &&
			widget.dataSmColSpan == null &&
			widget.dataXsColSpan == null)
	) {
		return undefined;
	}

	return {
		base: widget.dataColSpan,
		sm: widget.dataSmColSpan,
		xs: widget.dataXsColSpan,
	};
};

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

const applyContainerWidgetSpans = (root, widgets) => {
	const widgetsById = new Map(widgets.map((widget) => [widget.id, widget]));
	root.querySelectorAll("hbr-card[data-drag-id]").forEach((card) => {
		card.span = getWidgetSpan(widgetsById.get(card.dataset.dragId));
	});
};

const getSharedDashboardJson = (state) => ({
	dashboardName: state.dashboardName,
	sections: cloneSections(state.sectionData),
});

const renderStatisticsCard = (widget) => `
	<hbr-card>
		<hbr-layout direction="column" gap="2xs">
			<hbr-text type="secondary" size="sm">${escapeHtml(widget.title)}</hbr-text>
			<hbr-text type="primary" size="md" weight="bold">${escapeHtml(
				widget.value,
			)}</hbr-text>
		</hbr-layout>
	</hbr-card>
`;

const renderHealthCard = (widget) => `
	<hbr-card>
		<hbr-layout slot="header" direction="row" gap="sm">
			<hbr-layout direction="row" gap="2xs" style="margin-right: auto;">
				<hbr-text variant="sub-section-title">${escapeHtml(widget.title)}</hbr-text>
			</hbr-layout>
			<hbr-icon name="${escapeHtml(widget.icon || "wifi-high")}" sentiment="neutral"></hbr-icon>
		</hbr-layout>
		<hbr-layout direction="row" gap="md">
			${(widget.metrics || [])
				.map(
					(metric) => `
						<hbr-layout variant="dashboard:widgets:basic-health:status">
							<hbr-layout
								direction="row"
								gap="2xs"
								align="center"
								style="background-color: var(--base-bg-medium-default); padding: 4px 8px; min-height: 48px;"
							>
								<hbr-text type="primary" size="lg" weight="bold">${escapeHtml(
									metric.value,
								)}</hbr-text>
								<hbr-layout direction="row" gap="2xs" align="center">
									<hbr-text type="primary" size="xs" weight="semibold">${escapeHtml(
										metric.label,
									)}</hbr-text>
									${
										metric.icon
											? `<hbr-icon name="${escapeHtml(
													metric.icon,
											  )}" sentiment="${escapeHtml(
													metric.sentiment,
											  )}" size="16px"></hbr-icon>`
											: ""
									}
								</hbr-layout>
							</hbr-layout>
						</hbr-layout>
					`,
				)
				.join("")}
		</hbr-layout>
	</hbr-card>
`;

const renderBasicCard = (widget) => `
	<hbr-card>
		<hbr-layout direction="column" gap="sm">
			<hbr-layout direction="row" gap="2xs">
				<hbr-text variant="sub-section-title">${escapeHtml(widget.title)}</hbr-text>
				<hbr-tag sentiment="positive" size="small">
					<hbr-icon slot="prefix" name="status-positive" size="16px"></hbr-icon>
					${escapeHtml(widget.status || "Positive")}
				</hbr-tag>
			</hbr-layout>
			<div style="min-height: 80px; background-color: var(--base-bg-medium-default); border-radius: 4px;"></div>
		</hbr-layout>
	</hbr-card>
`;

const renderContainerWidgetCard = (widget) => `
	<hbr-card
		container
		data-drag-id="${escapeHtml(widget.id)}"
		${widget.dataColSpan ? `data-col-span="${widget.dataColSpan}"` : ""}
		${widget.dataSmColSpan ? `data-sm-col-span="${widget.dataSmColSpan}"` : ""}
		${widget.dataXsColSpan ? `data-xs-col-span="${widget.dataXsColSpan}"` : ""}
	>
		<hbr-layout direction="column" gap="md">
			<hbr-layout direction="row" gap="xs" align="center">
				<hbr-text variant="sub-section-title">${escapeHtml(widget.title)}</hbr-text>
			</hbr-layout>
			<div style="min-height: 180px; background-color: var(--base-bg-medium-default); flex: 1;"></div>
		</hbr-layout>
	</hbr-card>
`;

const renderContainerWidget = (widget, state) => {
	const card = renderContainerWidgetCard(widget);

	if (!state.isEditingDashboard || !state.isContainerSectionEditable) {
		return card;
	}

	return `
		<hbr-draggable delete drag-id="${escapeHtml(widget.id)}">
			${card}
		</hbr-draggable>
	`;
};

const renderAddWidgetDrawer = (state) => {
	const previewWidgetId =
		state.selectedAddWidgetIds[state.selectedAddWidgetIds.length - 1];
	const previewWidget =
		addWidgetOptions.find((widget) => widget.id === previewWidgetId) ||
		addWidgetOptions[0];

	return `
		<hbr-drawer
			id="add-widget-drawer"
			${state.isAddWidgetDrawerOpen ? "open" : ""}
			scroll-aware
			size="large"
		>
			<hbr-text variant="drawer-title" slot="label">Add widget</hbr-text>
			<hbr-layout align="stretch">
				<hbr-layout direction="column">
					${addWidgetOptions
						.map(
							(widget) => `
								<hbr-card container>
									<hbr-layout direction="column" gap="2xs">
										<hbr-checkbox
											class="js-toggle-add-widget"
											data-widget-id="${escapeHtml(widget.id)}"
											${
												state.selectedAddWidgetIds.includes(widget.id)
													? "checked"
													: ""
											}
										>
											${escapeHtml(widget.title)}
										</hbr-checkbox>
										<hbr-text size="sm" type="secondary">Simple container widget sample.</hbr-text>
									</hbr-layout>
								</hbr-card>
							`,
						)
						.join("")}
				</hbr-layout>

				<hbr-layout direction="column" gap="sm" style="flex: 1;">
					<hbr-text size="sm" type="secondary">Preview</hbr-text>
					<hbr-card container>
						<hbr-layout direction="column">
							<hbr-layout direction="row" gap="xs" align="center">
								<hbr-text variant="sub-section-title">${escapeHtml(
									previewWidget.title,
								)}</hbr-text>
							</hbr-layout>
							<div style="min-height: 180px; background-color: var(--base-bg-medium-default); flex: 1;"></div>
						</hbr-layout>
					</hbr-card>
				</hbr-layout>
			</hbr-layout>

			<hbr-sticky-action-bar slot="footer" variant="drawer">
				<hbr-button id="cancel-add-widget" variant="text">Cancel</hbr-button>
				<hbr-button id="save-add-widget">Save</hbr-button>
			</hbr-sticky-action-bar>
		</hbr-drawer>
	`;
};

const renderDashboard = (root, state) => {
	const cardSection = getSectionByType(state.sectionData, "card");
	const containerSection = getSectionByType(state.sectionData, "container");
	const cardWidgets = getWidgets(cardSection);
	const statisticsWidgets = cardWidgets.filter(
		(widget) => widget.cardType === "statistics",
	);
	const healthWidgets = cardWidgets.filter(
		(widget) => widget.cardType === "health",
	);
	const basicWidgets = cardWidgets.filter(
		(widget) => widget.cardType === "basic",
	);
	const flowWidgets = getWidgets(containerSection);
	const shareJson = JSON.stringify(getSharedDashboardJson(state), null, 2);

	root.innerHTML = `
		<hbr-layout variant="page">
			<hbr-layout variant="page:header">
				<hbr-layout direction="row" gap="sm">
					<hbr-text variant="page-title">Overview</hbr-text>
					<hbr-button id="create-dashboard" variant="outline" style="margin-left: auto;">
						<hbr-icon slot="prefix" name="plus"></hbr-icon>
						New Dashboard
					</hbr-button>
				</hbr-layout>
				<hbr-tab-group id="tab-group" primary style="margin-top: 4px;">
					${state.dashboardConfigs
						.map(
							(config, index) => `
								<hbr-tab
									slot="nav"
									data-dashboard-index="${index}"
									${index === state.activeDashboardIndex ? "active" : ""}
								>
									${escapeHtml(
										index === state.activeDashboardIndex
											? state.dashboardName
											: config.dashboardName,
									)}
								</hbr-tab>
							`,
						)
						.join("")}
				</hbr-tab-group>
			</hbr-layout>

			<hbr-layout variant="dashboard">
				<hbr-layout gap="xs" direction="column">
					<hbr-layout direction="row" gap="md">
						<hbr-layout direction="row" gap="xs">
							<hbr-select value="12h" sync="height" style="width: 158px;">
								<hbr-icon slot="prefix" name="clock"></hbr-icon>
								<hbr-option value="12h">Last 12 hours</hbr-option>
								<hbr-option value="24h">Last 24 hours</hbr-option>
								<hbr-option value="48h">Last 48 hours</hbr-option>
							</hbr-select>
							<hbr-select sync="width" style="width: 80px;" placeholder="SSID">
								<hbr-option value="ss12">SS12</hbr-option>
								<hbr-option value="ss13">SS13</hbr-option>
							</hbr-select>
						</hbr-layout>
						<hbr-layout direction="row" gap="xs" style="margin-left: auto;">
							<hbr-button id="share-dashboard" variant="outline">
								<hbr-icon slot="prefix" name="share"></hbr-icon>
								Share
							</hbr-button>
							<hbr-button id="edit-dashboard" variant="outline" ${
								state.isEditingDashboard ? "disabled" : ""
							}>
								<hbr-icon slot="prefix" name="pencil-simple"></hbr-icon>
								Edit dashboard
							</hbr-button>
						</hbr-layout>
					</hbr-layout>
					${
						state.isEditingDashboard
							? `<hbr-layout style="padding: 4px 6px; background-color: var(--control-bg-weak-active);">
									<hbr-layout direction="row" gap="xs">
										<label for="dashboard-name" class="hbr-css__text-label">Name:</label>
										<hbr-input id="dashboard-name" value="${escapeHtml(
											state.dashboardName,
										)}"></hbr-input>
										<hbr-button id="delete-dashboard" variant="text" sentiment="negative" style="padding-inline: 4px;">
											<hbr-icon slot="prefix" name="trash"></hbr-icon>
											Delete
										</hbr-button>
									</hbr-layout>
									<hbr-button id="cancel-edit" variant="text" style="margin-left: auto;">Cancel</hbr-button>
									<hbr-button id="add-widget" variant="outline" ${
										state.isContainerSectionEditable ? "" : "disabled"
									}>
										<hbr-icon slot="prefix" name="plus"></hbr-icon>
										Add widget
									</hbr-button>
									<hbr-button id="save-edit">Save</hbr-button>
								</hbr-layout>`
							: ""
					}
				</hbr-layout>

				${
					cardSection
						? `<hbr-layout variant="dashboard:section">
								<hbr-text variant="section-title">${escapeHtml(
									cardSection.sectionTitle,
								)}</hbr-text>
								<hbr-layout variant="dashboard:widgets:basic-statistics">
									${statisticsWidgets.map(renderStatisticsCard).join("")}
								</hbr-layout>
								<hbr-layout variant="dashboard:widgets:basic-health" align="start">
									${healthWidgets.map(renderHealthCard).join("")}
									${basicWidgets.map(renderBasicCard).join("")}
								</hbr-layout>
							</hbr-layout>`
						: ""
				}

				${
					containerSection
						? `<hbr-layout variant="dashboard:section">
								<hbr-text variant="section-title">${escapeHtml(
									containerSection.sectionTitle,
								)}</hbr-text>
								<hbr-dashboard-flow id="dashboard-flow">
									${
										state.isEditingDashboard && state.isContainerSectionEditable
											? `<hbr-drop-zone direction="horizontal">
													<hbr-drag-ghost slot="ghost"></hbr-drag-ghost>
													<hbr-layout variant="dashboard:widgets:container">
														${flowWidgets
															.map((widget) =>
																renderContainerWidget(widget, state),
															)
															.join("")}
													</hbr-layout>
												</hbr-drop-zone>`
											: `<hbr-layout variant="dashboard:widgets:container">
													${flowWidgets
														.map((widget) =>
															renderContainerWidget(widget, state),
														)
														.join("")}
												</hbr-layout>`
									}
								</hbr-dashboard-flow>
							</hbr-layout>`
						: ""
				}
			</hbr-layout>

			<hbr-modal id="share-modal" label="Share dashboard template" size="xsmall" ${
				state.shareModalOpen ? "open" : ""
			}>
				<hbr-layout direction="column" gap="md">
					<hbr-text>By exporting and sharing this dashboard, users can import and replicate it on another page or account.</hbr-text>
					<hbr-layout direction="column" gap="xs">
						<hbr-text>Export as JSON</hbr-text>
						<hbr-button id="export-dashboard" variant="outline">
							<hbr-icon name="download-simple" slot="prefix"></hbr-icon>
							Export
						</hbr-button>
					</hbr-layout>
				</hbr-layout>
				<hbr-layout slot="footer" direction="row" gap="md" style="justify-content: flex-end;">
					<hbr-button id="close-share" variant="text">Cancel</hbr-button>
					<hbr-button id="done-share" ${
						state.shareExportComplete ? "" : "disabled"
					}>Done</hbr-button>
				</hbr-layout>
			</hbr-modal>

			<hbr-modal id="share-cancel-modal" size="xsmall" ${
				state.shareCancelConfirmOpen ? "open" : ""
			}>
				<hbr-layout slot="label" gap="sm">
					<hbr-icon name="alerts-warning-large" sentiment="warning"></hbr-icon>
					<span>Leave page?</span>
				</hbr-layout>
				<div>Changes you made to this dashboard page may not be saved.</div>
				<hbr-layout slot="footer" direction="row" gap="md" style="justify-content: flex-end;">
					<hbr-button id="cancel-share-leave" variant="text">Cancel</hbr-button>
					<hbr-button id="confirm-share-leave" sentiment="danger">Leave</hbr-button>
				</hbr-layout>
			</hbr-modal>

			${renderAddWidgetDrawer(state)}

			<hbr-modal id="json-modal" label="Dashboard Configuration (JSON)" size="large" scroll-aware style="--height: 70vh;" ${
				state.jsonPreviewOpen ? "open" : ""
			}>
				<hbr-code-snippet id="json-code-snippet" class="json-code-snippet"></hbr-code-snippet>
				<hbr-layout slot="footer" direction="row" gap="md" style="justify-content: flex-end;">
					<hbr-button id="close-json" variant="text">Close</hbr-button>
					<hbr-copyclipboard id="copy-json" value="${escapeHtml(shareJson)}" icon-only size="large"></hbr-copyclipboard>
					<hbr-button id="download-json">
						<hbr-icon slot="prefix" name="download-simple"></hbr-icon>
						Download JSON
					</hbr-button>
				</hbr-layout>
			</hbr-modal>
		</hbr-layout>
	`;

	const jsonCodeSnippet = root.querySelector("#json-code-snippet");
	if (jsonCodeSnippet) {
		jsonCodeSnippet.code = shareJson;
	}

	applyContainerWidgetSpans(root, flowWidgets);

	const dashboardFlow = root.querySelector("#dashboard-flow");
	if (dashboardFlow) {
		dashboardFlow.widgets = [...flowWidgets];
	}
};

const createDashboardState = () => {
	const dashboardConfigs = initialDashboardConfigs.map(cloneDashboardConfig);
	const activeDashboard = dashboardConfigs[0];
	const state = {
		activeDashboardIndex: 0,
		dashboardConfigs,
		dashboardName: activeDashboard.dashboardName,
		isAddWidgetDrawerOpen: false,
		isEditingDashboard: false,
		jsonPreviewOpen: false,
		savedDashboardName: activeDashboard.dashboardName,
		savedSectionData: cloneSections(activeDashboard.sections),
		sectionData: cloneSections(activeDashboard.sections),
		selectedAddWidgetIds: [],
		shareCancelConfirmOpen: false,
		shareExportComplete: false,
		shareModalOpen: false,
	};

	Object.defineProperty(state, "isContainerSectionEditable", {
		get() {
			return (
				getSectionByType(state.sectionData, "container")?.editable === true
			);
		},
	});

	return state;
};

const loadActiveDashboard = (state) => {
	const activeDashboard = state.dashboardConfigs[state.activeDashboardIndex];
	if (!activeDashboard) return;
	state.dashboardName = activeDashboard.dashboardName;
	state.sectionData = cloneSections(activeDashboard.sections);
	state.savedDashboardName = state.dashboardName;
	state.savedSectionData = cloneSections(state.sectionData);
	state.isEditingDashboard = false;
	state.isAddWidgetDrawerOpen = false;
	state.selectedAddWidgetIds = [];
	state.shareCancelConfirmOpen = false;
	state.shareExportComplete = false;
	state.shareModalOpen = false;
	state.jsonPreviewOpen = false;
};

const downloadJson = (json) => {
	const blob = new Blob([JSON.stringify(json, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `dashboard-config-${Date.now()}.json`;
	link.click();
	URL.revokeObjectURL(url);
};

export const initCustomDashboard = (root) => {
	if (!root) return;

	const state = createDashboardState();
	const rerender = () => {
		renderDashboard(root, state);
		bindDashboardEvents(root, state, rerender);
	};

	rerender();
};

const bindDashboardEvents = (root, state, rerender) => {
	root.querySelectorAll("[data-dashboard-index]").forEach((tab) => {
		tab.addEventListener("click", () => {
			state.activeDashboardIndex = Number(tab.dataset.dashboardIndex);
			loadActiveDashboard(state);
			rerender();
		});
	});

	root.querySelector("#create-dashboard")?.addEventListener("click", () => {
		const timestamp = Date.now();
		state.dashboardConfigs = [
			...state.dashboardConfigs,
			{
				dashboardName: `Dashboard ${state.dashboardConfigs.length + 1}`,
				sections: [
					{
						id: `dashboard-${timestamp}-cards`,
						sectionTitle: "Section title",
						widgetType: "card",
						editable: false,
						widgets: [
							{
								id: `dashboard-${timestamp}-statistic-card-1`,
								cardType: "statistics",
								title: "Title 1",
								value: "Value 1",
							},
						],
					},
					{
						id: `dashboard-${timestamp}-widgets`,
						sectionTitle: "Widgets",
						widgetType: "container",
						editable: true,
						widgets: [
							{
								id: `dashboard-${timestamp}-container-widget-1`,
								title: "Container Widget 1",
							},
						],
					},
				],
			},
		];
		state.activeDashboardIndex = state.dashboardConfigs.length - 1;
		loadActiveDashboard(state);
		rerender();
	});

	root.querySelector("#share-dashboard")?.addEventListener("click", () => {
		state.shareCancelConfirmOpen = false;
		state.shareExportComplete = false;
		state.shareModalOpen = true;
		rerender();
	});

	root.querySelector("#edit-dashboard")?.addEventListener("click", () => {
		state.savedDashboardName = state.dashboardName;
		state.savedSectionData = cloneSections(state.sectionData);
		state.isEditingDashboard = true;
		rerender();
	});

	root.querySelector("#dashboard-name")?.addEventListener("input", (event) => {
		state.dashboardName = event.target.value;
	});

	root.querySelector("#delete-dashboard")?.addEventListener("click", () => {
		state.dashboardConfigs = state.dashboardConfigs.filter(
			(_, index) => index !== state.activeDashboardIndex,
		);
		state.activeDashboardIndex = state.dashboardConfigs.length
			? Math.min(state.activeDashboardIndex, state.dashboardConfigs.length - 1)
			: 0;
		if (state.dashboardConfigs.length) {
			loadActiveDashboard(state);
		}
		rerender();
	});

	root.querySelector("#cancel-edit")?.addEventListener("click", () => {
		state.dashboardName = state.savedDashboardName;
		state.sectionData = cloneSections(state.savedSectionData);
		state.isEditingDashboard = false;
		state.isAddWidgetDrawerOpen = false;
		state.selectedAddWidgetIds = [];
		rerender();
	});

	root.querySelector("#save-edit")?.addEventListener("click", () => {
		state.isAddWidgetDrawerOpen = false;
		state.selectedAddWidgetIds = [];
		state.dashboardConfigs = state.dashboardConfigs.map((config, index) =>
			index === state.activeDashboardIndex
				? {
						...config,
						dashboardName: state.dashboardName,
						sections: cloneSections(state.sectionData),
				  }
				: config,
		);
		state.isEditingDashboard = false;
		rerender();
	});

	root.querySelector("#add-widget")?.addEventListener("click", () => {
		if (!state.isContainerSectionEditable) return;
		state.isAddWidgetDrawerOpen = true;
		rerender();
	});

	const closeAddWidgetDrawer = () => {
		state.isAddWidgetDrawerOpen = false;
		state.selectedAddWidgetIds = [];
		rerender();
	};

	root.querySelector("#add-widget-drawer")?.addEventListener("hbr-hide", () => {
		state.isAddWidgetDrawerOpen = false;
		state.selectedAddWidgetIds = [];
		rerender();
	});
	root
		.querySelector("#cancel-add-widget")
		?.addEventListener("click", closeAddWidgetDrawer);

	root.querySelectorAll(".js-toggle-add-widget").forEach((checkbox) => {
		checkbox.addEventListener("hbr-change", () => {
			const widgetId = checkbox.dataset.widgetId;
			state.selectedAddWidgetIds = state.selectedAddWidgetIds.includes(widgetId)
				? state.selectedAddWidgetIds.filter((id) => id !== widgetId)
				: [...state.selectedAddWidgetIds, widgetId];
			rerender();
		});
	});

	root.querySelector("#save-add-widget")?.addEventListener("click", () => {
		if (
			!state.isContainerSectionEditable ||
			!state.selectedAddWidgetIds.length
		) {
			closeAddWidgetDrawer();
			return;
		}

		const timestamp = Date.now();
		const nextWidgets = addWidgetOptions
			.filter((widget) => state.selectedAddWidgetIds.includes(widget.id))
			.map((widget, index) => ({
				...widget,
				id: `container-widget-${timestamp}-${index}`,
			}));

		state.sectionData = state.sectionData.map((section) =>
			section.widgetType === "container" && section.editable
				? {
						...section,
						widgets: [...section.widgets, ...nextWidgets],
				  }
				: section,
		);
		closeAddWidgetDrawer();
	});

	root.querySelectorAll("hbr-draggable").forEach((draggable) => {
		draggable.addEventListener("hbr-draggable-remove", () => {
			const widgetId = draggable.getAttribute("drag-id");
			if (!widgetId || !state.isContainerSectionEditable) return;
			state.sectionData = state.sectionData.map((section) =>
				section.widgetType === "container" && section.editable
					? {
							...section,
							widgets: section.widgets.filter(
								(widget) => widget.id !== widgetId,
							),
					  }
					: section,
			);
			rerender();
		});
	});

	root
		.querySelector("#dashboard-flow")
		?.addEventListener("hbr-flow-layout-change", (event) => {
			const { order = [], spanById = {} } = event.detail || {};
			if (!order.length || !state.isContainerSectionEditable) return;

			const orderSet = new Set(order);
			let didChange = false;
			state.sectionData = state.sectionData.map((section) => {
				if (section.widgetType !== "container" || !section.editable) {
					return section;
				}

				const widgets = getWidgets(section);
				const widgetsById = new Map(
					widgets.map((widget) => [widget.id, widget]),
				);
				const nextWidgets = [
					...order
						.map((id) => widgetsById.get(id))
						.filter(Boolean)
						.map((widget) => applySpanPatch(widget, spanById[widget.id])),
					...widgets
						.filter((widget) => !orderSet.has(widget.id))
						.map((widget) => applySpanPatch(widget, spanById[widget.id])),
				];

				const sectionChanged =
					nextWidgets.length !== widgets.length ||
					nextWidgets.some((widget, index) => widget !== widgets[index]);

				if (!sectionChanged) return section;

				didChange = true;
				return { ...section, widgets: nextWidgets };
			});

			if (didChange) rerender();
		});

	root.querySelectorAll(".js-remove-widget").forEach((button) => {
		button.addEventListener("click", () => {
			const widgetId = button.dataset.widgetId;
			state.sectionData = state.sectionData.map((section) =>
				section.widgetType === "container" && section.editable
					? {
							...section,
							widgets: section.widgets.filter(
								(widget) => widget.id !== widgetId,
							),
					  }
					: section,
			);
			rerender();
		});
	});

	const closeShare = () => {
		state.shareModalOpen = false;
		state.shareExportComplete = false;
		rerender();
	};
	const cancelShare = () => {
		state.shareModalOpen = false;
		state.shareCancelConfirmOpen = true;
		rerender();
	};
	const hideShare = () => {
		state.shareModalOpen = false;
		rerender();
	};
	const cancelShareLeave = () => {
		state.shareCancelConfirmOpen = false;
		state.shareModalOpen = true;
		rerender();
	};
	const leaveShare = () => {
		state.shareCancelConfirmOpen = false;
		state.shareModalOpen = false;
		state.shareExportComplete = false;
		rerender();
	};
	const hideShareLeave = () => {
		state.shareCancelConfirmOpen = false;
		rerender();
	};
	root.querySelector("#close-share")?.addEventListener("click", cancelShare);
	root.querySelector("#done-share")?.addEventListener("click", closeShare);
	root.querySelector("#share-modal")?.addEventListener("hbr-hide", hideShare);
	root
		.querySelector("#cancel-share-leave")
		?.addEventListener("click", cancelShareLeave);
	root
		.querySelector("#confirm-share-leave")
		?.addEventListener("click", leaveShare);
	root
		.querySelector("#share-cancel-modal")
		?.addEventListener("hbr-hide", hideShareLeave);

	root.querySelector("#export-dashboard")?.addEventListener("click", () => {
		state.shareModalOpen = false;
		state.jsonPreviewOpen = true;
		rerender();
	});

	let isClosingJsonPreview = false;
	const closeJsonPreview = ({ skipHide = false } = {}) => {
		if (isClosingJsonPreview) return;
		isClosingJsonPreview = true;
		state.jsonPreviewOpen = false;
		state.shareExportComplete = true;
		state.shareModalOpen = true;
		const jsonModal = root.querySelector("#json-modal");
		if (jsonModal && !skipHide) {
			jsonModal.hide?.();
			jsonModal.open = false;
			jsonModal.removeAttribute("open");
		}
		rerender();
	};

	const jsonModal = root.querySelector("#json-modal");
	jsonModal?.addEventListener("hbr-hide", (event) => {
		if (event.target !== jsonModal) return;
		closeJsonPreview({ skipHide: true });
	});

	root.querySelector("#close-json")?.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		closeJsonPreview();
	});

	root.querySelector("#copy-json")?.addEventListener("click", async () => {
		await navigator.clipboard?.writeText(
			JSON.stringify(getSharedDashboardJson(state), null, 2),
		);
	});

	root.querySelector("#download-json")?.addEventListener("click", () => {
		downloadJson(getSharedDashboardJson(state));
	});
};

```

### custom-dashboard/config.js
```js
// file: custom-dashboard/config.js
export const dashboardConfigs = [
	{
		dashboardName: "Dashboard 1",
		sections: [
			{
				id: "overview-cards",
				sectionTitle: "Section title",
				widgetType: "card",
				editable: false,
				widgets: [
					{
						id: "section-one-statistic-card-1",
						cardType: "statistics",
						title: "Title 1",
						value: "Value 1",
					},
					{
						id: "section-one-statistic-card-2",
						cardType: "statistics",
						title: "Title 2",
						value: "Value 2",
					},
					{
						id: "section-one-health-card-1",
						cardType: "health",
						title: "Health Card 1",
						icon: "wifi-high",
						metrics: [
							{
								id: "online",
								value: "62",
								label: "Online",
								sentiment: "positive",
								icon: "status-positive",
							},
							{
								id: "alerting",
								value: "21",
								label: "Alerting",
								sentiment: "warning",
								icon: "status-warning",
							},
						],
					},
					{
						id: "section-one-health-card-2",
						cardType: "health",
						title: "Health Card 2",
						icon: "wifi-high",
						metrics: [
							{
								id: "online",
								value: "74",
								label: "Online",
								sentiment: "positive",
								icon: "status-positive",
							},
							{
								id: "alerting",
								value: "9",
								label: "Alerting",
								sentiment: "warning",
								icon: "status-warning",
							},
						],
					},
					{
						id: "section-one-basic-card-1",
						cardType: "basic",
						title: "Basic Widget",
						status: "Positive",
					},
				],
			},
			{
				id: "container-widgets",
				sectionTitle: "Section title",
				widgetType: "container",
				editable: true,
				widgets: [
					{
						id: "section-two-flow-widget-1",
						title: "Container Widget 1",
					},
					{
						id: "section-two-flow-widget-2",
						title: "Container Widget 2",
					},
					{
						id: "section-two-flow-widget-3",
						title: "Container Widget 3",
					},
				],
			},
		],
	},
	{
		dashboardName: "Dashboard 2",
		sections: [
			{
				id: "dashboard-two-overview-cards",
				sectionTitle: "Dashboard 2 overview",
				widgetType: "card",
				editable: false,
				widgets: [
					{
						id: "dashboard-two-statistic-card-1",
						cardType: "statistics",
						title: "Title 1",
						value: "Value 1",
					},
					{
						id: "dashboard-two-health-card-1",
						cardType: "health",
						title: "Health Card 1",
						icon: "wifi-high",
						metrics: [
							{
								id: "online",
								value: "58",
								label: "Online",
								sentiment: "positive",
								icon: "status-positive",
							},
							{
								id: "alerting",
								value: "17",
								label: "Alerting",
								sentiment: "warning",
								icon: "status-warning",
							},
						],
					},
					{
						id: "dashboard-two-health-card-2",
						cardType: "health",
						title: "Health Card 2",
						icon: "wifi-high",
						metrics: [
							{
								id: "online",
								value: "81",
								label: "Online",
								sentiment: "positive",
								icon: "status-positive",
							},
							{
								id: "alerting",
								value: "6",
								label: "Alerting",
								sentiment: "warning",
								icon: "status-warning",
							},
						],
					},
				],
			},
			{
				id: "dashboard-two-container-widgets",
				sectionTitle: "Dashboard 2 widgets",
				widgetType: "container",
				editable: true,
				widgets: [
					{
						id: "dashboard-two-flow-widget-1",
						title: "Container Widget 1",
					},
					{
						id: "dashboard-two-flow-widget-2",
						title: "Container Widget 2",
					},
				],
			},
		],
	},
];

```
