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
### custom-dashboard.html
```html
<!-- file: custom-dashboard.html -->
<div id="custom-dashboard-root"></div>

<style>
	.json-code-snippet::part(content) {
		display: block;
		max-height: 52vh;
		overflow: auto;
	}
</style>

<script type="module">
	import { initCustomDashboard } from "/pages/templates/custom-dashboard.js";

	initCustomDashboard(document.getElementById("custom-dashboard-root"));
</script>

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