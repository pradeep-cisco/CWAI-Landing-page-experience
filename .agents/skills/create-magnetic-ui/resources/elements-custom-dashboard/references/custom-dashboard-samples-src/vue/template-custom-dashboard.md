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
### custom-dashboard.vue
```vue
<!-- file: custom-dashboard.vue -->
<template>
  <hbr-layout variant="page">
    <hbr-layout variant="page:header">
      <hbr-layout direction="row" gap="sm">
        <hbr-text variant="page-title">Overview</hbr-text>
        <hbr-dropdown menu-fit-trigger style="margin-left: auto">
          <hbr-button variant="outline" slot="trigger" caret>
            <hbr-icon name="plus" slot="prefix" />
            New Dashboard
          </hbr-button>
          <hbr-menu>
            <hbr-menu-item value="create-new" @click="createDashboard">
              Create new
            </hbr-menu-item>
            <hbr-menu-item value="select-template" disabled>
              Select template
            </hbr-menu-item>
          </hbr-menu>
        </hbr-dropdown>
      </hbr-layout>

      <hbr-tab-group id="tab-group" primary style="margin-top: 4px">
        <hbr-tab
          v-for="(config, index) in dashboardConfigs"
          :key="`${config.dashboardName}-${index}`"
          slot="nav"
          :active="index === activeDashboardIndex"
          @click="selectDashboard(index)"
        >
          {{
            index === activeDashboardIndex
              ? dashboardName
              : config.dashboardName
          }}
        </hbr-tab>
      </hbr-tab-group>
    </hbr-layout>

    <hbr-layout variant="dashboard">
      <hbr-layout gap="xs" direction="column">
        <hbr-layout direction="row" gap="md">
          <hbr-layout direction="row" gap="xs">
            <hbr-select value="12h" sync="height" style="width: 158px">
              <hbr-icon slot="prefix" name="clock" />
              <hbr-option value="12h">Last 12 hours</hbr-option>
              <hbr-option value="24h">Last 24 hours</hbr-option>
              <hbr-option value="48h">Last 48 hours</hbr-option>
            </hbr-select>
            <hbr-select sync="width" style="width: 80px" placeholder="SSID">
              <hbr-option value="ss12">SS12</hbr-option>
              <hbr-option value="ss13">SS13</hbr-option>
            </hbr-select>
          </hbr-layout>
          <hbr-layout direction="row" gap="xs" style="margin-left: auto">
            <hbr-button variant="outline" @click="openShareModal">
              <hbr-icon slot="prefix" name="share" />
              Share
            </hbr-button>
            <hbr-button
              variant="outline"
              :disabled="isEditingDashboard"
              @click="startEdit"
            >
              <hbr-icon slot="prefix" name="pencil-simple" />
              Edit dashboard
            </hbr-button>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout
          v-if="isEditingDashboard"
          style="
            padding: 4px 6px;
            background-color: var(--control-bg-weak-active);
          "
        >
          <hbr-layout direction="row" gap="xs">
            <label for="dashboard-name" class="hbr-css__text-label">
              Name:
            </label>
            <hbr-input
              id="dashboard-name"
              :value="dashboardName"
              @input="onDashboardNameInput"
            />
            <hbr-button
              variant="text"
              sentiment="negative"
              style="padding-inline: 4px"
              @click="removeDashboard"
            >
              <hbr-icon slot="prefix" name="trash" />
              Delete
            </hbr-button>
          </hbr-layout>
          <hbr-button
            variant="text"
            style="margin-left: auto"
            @click="cancelEdit"
          >
            Cancel
          </hbr-button>
          <hbr-button
            variant="outline"
            :disabled="!isContainerSectionEditable"
            @click="addWidget"
          >
            <hbr-icon slot="prefix" name="plus" />
            Add widget
          </hbr-button>
          <hbr-button @click="saveEdit">Save</hbr-button>
        </hbr-layout>
      </hbr-layout>

      <hbr-layout v-if="cardSection" variant="dashboard:section">
        <hbr-text variant="section-title">{{
          cardSection.sectionTitle
        }}</hbr-text>

        <hbr-layout variant="dashboard:widgets:basic-statistics">
          <hbr-card v-for="widget in statisticsWidgets" :key="widget.id">
            <hbr-layout direction="column" gap="2xs">
              <hbr-text type="secondary" size="sm">{{ widget.title }}</hbr-text>
              <hbr-text type="primary" size="md" weight="bold">
                {{ widget.value }}
              </hbr-text>
            </hbr-layout>
          </hbr-card>
        </hbr-layout>

        <hbr-layout variant="dashboard:widgets:basic-health" align="start">
          <hbr-card v-for="widget in healthWidgets" :key="widget.id">
            <hbr-layout slot="header" direction="row" gap="sm">
              <hbr-layout direction="row" gap="2xs" style="margin-right: auto">
                <hbr-text variant="sub-section-title">
                  {{ widget.title }}
                </hbr-text>
              </hbr-layout>
              <hbr-icon
                :name="widget.icon || 'wifi-high'"
                sentiment="neutral"
              />
            </hbr-layout>
            <hbr-layout direction="row" gap="md">
              <hbr-layout
                v-for="metric in widget.metrics || []"
                :key="metric.id"
                variant="dashboard:widgets:basic-health:status"
              >
                <hbr-layout
                  direction="row"
                  gap="2xs"
                  align="center"
                  style="
                    background-color: var(--base-bg-medium-default);
                    padding: 4px 8px;
                    min-height: 48px;
                  "
                >
                  <hbr-text type="primary" size="lg" weight="bold">
                    {{ metric.value }}
                  </hbr-text>
                  <hbr-layout direction="row" gap="2xs" align="center">
                    <hbr-text type="primary" size="xs" weight="semibold">
                      {{ metric.label }}
                    </hbr-text>
                    <hbr-icon
                      v-if="metric.icon"
                      :name="metric.icon"
                      :sentiment="metric.sentiment"
                      size="16px"
                    />
                  </hbr-layout>
                </hbr-layout>
              </hbr-layout>
            </hbr-layout>
          </hbr-card>

          <hbr-card v-for="widget in basicWidgets" :key="widget.id">
            <hbr-layout direction="column" gap="sm">
              <hbr-layout direction="row" gap="2xs">
                <hbr-text variant="sub-section-title">{{
                  widget.title
                }}</hbr-text>
                <hbr-tag sentiment="positive" size="small">
                  <hbr-icon slot="prefix" name="status-positive" size="16px" />
                  {{ widget.status || "Positive" }}
                </hbr-tag>
              </hbr-layout>
              <div
                style="
                  min-height: 80px;
                  background-color: var(--base-bg-medium-default);
                  border-radius: 4px;
                "
              />
            </hbr-layout>
          </hbr-card>
        </hbr-layout>
      </hbr-layout>

      <hbr-layout v-if="containerSection" variant="dashboard:section">
        <hbr-text variant="section-title">
          {{ containerSection.sectionTitle }}
        </hbr-text>
        <hbr-dashboard-flow
          :widgets.prop="flowWidgets"
          @hbr-flow-layout-change="handleFlowLayoutChange"
        >
          <hbr-drop-zone
            v-if="isEditingDashboard && isContainerSectionEditable"
            direction="horizontal"
          >
            <hbr-drag-ghost slot="ghost" />
            <hbr-layout variant="dashboard:widgets:container">
              <hbr-draggable
                v-for="widget in flowWidgets"
                :key="widget.id"
                :delete="true"
                :drag-id="widget.id"
                @hbr-draggable-remove="removeWidget(widget.id)"
              >
                <hbr-card
                  container
                  :data-drag-id="widget.id"
                  :span.prop="getWidgetSpan(widget)"
                >
                  <hbr-layout direction="column" gap="md">
                    <hbr-layout direction="row" gap="xs" align="center">
                      <hbr-text variant="sub-section-title">
                        {{ widget.title }}
                      </hbr-text>
                    </hbr-layout>
                    <div
                      style="
                        min-height: 180px;
                        background-color: var(--base-bg-medium-default);
                        flex: 1;
                      "
                    />
                  </hbr-layout>
                </hbr-card>
              </hbr-draggable>
            </hbr-layout>
          </hbr-drop-zone>
          <hbr-layout v-else variant="dashboard:widgets:container">
            <hbr-card
              v-for="widget in flowWidgets"
              :key="widget.id"
              container
              :data-drag-id="widget.id"
              :span.prop="getWidgetSpan(widget)"
            >
              <hbr-layout direction="column" gap="md">
                <hbr-layout direction="row" gap="xs" align="center">
                  <hbr-text variant="sub-section-title">
                    {{ widget.title }}
                  </hbr-text>
                </hbr-layout>
                <div
                  style="
                    min-height: 180px;
                    background-color: var(--base-bg-medium-default);
                    flex: 1;
                  "
                />
              </hbr-layout>
            </hbr-card>
          </hbr-layout>
        </hbr-dashboard-flow>
      </hbr-layout>
    </hbr-layout>

    <hbr-modal
      label="Share dashboard template"
      :open="shareModalOpen"
      size="xsmall"
      @hbr-hide="shareModalOpen = false"
    >
      <hbr-layout direction="column" gap="md">
        <hbr-text>
          By exporting and sharing this dashboard, users can import and
          replicate it on another page or account.
        </hbr-text>
        <hbr-layout direction="column" gap="xs">
          <hbr-text>Export as JSON</hbr-text>
          <hbr-button variant="outline" @click="exportDashboard">
            <hbr-icon name="download-simple" slot="prefix" />
            Export
          </hbr-button>
        </hbr-layout>
      </hbr-layout>
      <hbr-layout
        slot="footer"
        direction="row"
        gap="md"
        style="justify-content: flex-end"
      >
        <hbr-button variant="text" @click="cancelShareModal">
          Cancel
        </hbr-button>
        <hbr-button
          :key="
            shareExportComplete ? 'share-done-enabled' : 'share-done-disabled'
          "
          :disabled="!shareExportComplete"
          @click="closeShareModal"
        >
          Done
        </hbr-button>
      </hbr-layout>
    </hbr-modal>

    <hbr-modal
      :open="shareCancelConfirmOpen"
      size="xsmall"
      @hbr-hide="hideShareCancelConfirm"
    >
      <hbr-layout slot="label" gap="sm">
        <hbr-icon name="alerts-warning-large" sentiment="warning" />
        <span>Leave page?</span>
      </hbr-layout>
      <div>Changes you made to this dashboard page may not be saved.</div>
      <hbr-layout
        slot="footer"
        direction="row"
        gap="md"
        style="justify-content: flex-end"
      >
        <hbr-button variant="text" @click="cancelShareCancelConfirm">
          Cancel
        </hbr-button>
        <hbr-button sentiment="danger" @click="confirmLeaveShareModal">
          Leave
        </hbr-button>
      </hbr-layout>
    </hbr-modal>

    <hbr-drawer
      id="add-widget-drawer"
      :open="isAddWidgetDrawerOpen"
      scroll-aware
      size="large"
      @hbr-hide="closeAddWidgetDrawer"
    >
      <hbr-text variant="drawer-title" slot="label">Add widget</hbr-text>

      <hbr-layout direction="row" gap="md" align="stretch">
        <hbr-layout direction="column" gap="sm">
          <hbr-card
            v-for="widget in addWidgetOptions"
            :key="widget.id"
            container
          >
            <hbr-layout direction="column" gap="2xs">
              <hbr-checkbox
                :checked="isAddWidgetSelected(widget.id)"
                @hbr-change="toggleAddWidget(widget.id)"
              >
                {{ widget.title }}
              </hbr-checkbox>
              <hbr-text size="sm" type="secondary">
                Simple container widget sample.
              </hbr-text>
            </hbr-layout>
          </hbr-card>
        </hbr-layout>

        <hbr-layout direction="column" gap="sm" style="flex: 1;">
          <hbr-text size="sm" type="secondary">Preview</hbr-text>
          <hbr-card container>
            <hbr-layout direction="column" gap="md">
              <hbr-layout direction="row" gap="xs" align="center">
                <hbr-text variant="sub-section-title">
                  {{ previewAddWidget.title }}
                </hbr-text>
              </hbr-layout>
              <div
                style="
                  min-height: 180px;
                  background-color: var(--base-bg-medium-default);
                "
              />
            </hbr-layout>
          </hbr-card>
        </hbr-layout>
      </hbr-layout>

      <hbr-sticky-action-bar slot="footer" variant="drawer">
        <hbr-button variant="text" @click="closeAddWidgetDrawer">
          Cancel
        </hbr-button>
        <hbr-button @click="saveAddWidgets">Save</hbr-button>
      </hbr-sticky-action-bar>
    </hbr-drawer>

    <hbr-modal
      label="Dashboard Configuration (JSON)"
      :open="jsonPreviewOpen"
      size="large"
      scroll-aware
      style="--height: 70vh"
      @hbr-hide="closeJsonPreview"
    >
      <hbr-code-snippet
        class="json-code-snippet"
        :code="sharedJson"
      ></hbr-code-snippet>
      <hbr-layout
        slot="footer"
        style="justify-content: flex-end"
      >
        <hbr-button variant="text" @click="closeJsonPreview">
          Close
        </hbr-button>
        <hbr-copyclipboard :value="sharedJson" icon-only size="large" />
        <hbr-button @click="downloadSharedJson">
          <hbr-icon slot="prefix" name="download-simple" />
          Download JSON
        </hbr-button>
      </hbr-layout>
    </hbr-modal>
  </hbr-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  type DashboardConfig,
  type DashboardSection,
  type DashboardWidget,
  dashboardConfigs as initialDashboardConfigs,
} from "./custom-dashboard/config";

const cloneWidgets = (widgets: DashboardWidget[]) =>
  widgets.map((widget) => ({
    ...widget,
    metrics: widget.metrics?.map((metric) => ({ ...metric })),
  }));

const cloneSections = (sections: DashboardSection[]) =>
  sections.map((section) => ({
    ...section,
    widgets: cloneWidgets(section.widgets),
  }));

const cloneDashboardConfig = (config: DashboardConfig): DashboardConfig => ({
  ...config,
  sections: cloneSections(config.sections),
});

type DashboardWidgetSpan = {
  base?: number;
  sm?: number;
  xs?: number;
};

type DashboardFlowLayoutChangeDetail = {
  order?: string[];
  spanById?: Record<string, DashboardWidgetSpan>;
};

const addWidgetOptions: DashboardWidget[] = [
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

const applySpanPatch = (
  widget: DashboardWidget,
  span?: DashboardWidgetSpan
): DashboardWidget => {
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

const dashboardConfigs = ref(initialDashboardConfigs.map(cloneDashboardConfig));
const activeDashboardIndex = ref(0);
const dashboardName = ref(dashboardConfigs.value[0]?.dashboardName || "");
const sectionData = ref(
  cloneSections(dashboardConfigs.value[0]?.sections || [])
);
const isEditingDashboard = ref(false);
const isAddWidgetDrawerOpen = ref(false);
const selectedAddWidgetIds = ref<string[]>([]);
const savedDashboardName = ref(dashboardName.value);
const savedSectionData = ref(cloneSections(sectionData.value));
const shareModalOpen = ref(false);
const shareCancelConfirmOpen = ref(false);
const shareExportComplete = ref(false);
const jsonPreviewOpen = ref(false);
const sharedJson = ref("");

const activeDashboard = computed(
  () => dashboardConfigs.value[activeDashboardIndex.value]
);
const cardSection = computed(() =>
  sectionData.value.find((section) => section.widgetType === "card")
);
const containerSection = computed(() =>
  sectionData.value.find((section) => section.widgetType === "container")
);
const isContainerSectionEditable = computed(
  () => containerSection.value?.editable === true
);
const cardWidgets = computed(() => cardSection.value?.widgets || []);
const statisticsWidgets = computed(() =>
  cardWidgets.value.filter((widget) => widget.cardType === "statistics")
);
const healthWidgets = computed(() =>
  cardWidgets.value.filter((widget) => widget.cardType === "health")
);
const basicWidgets = computed(() =>
  cardWidgets.value.filter((widget) => widget.cardType === "basic")
);
const flowWidgets = computed(() => containerSection.value?.widgets || []);
const previewAddWidget = computed(() => {
  const previewWidgetId =
    selectedAddWidgetIds.value[selectedAddWidgetIds.value.length - 1];
  return (
    addWidgetOptions.find((widget) => widget.id === previewWidgetId) ||
    addWidgetOptions[0]
  );
});

const closeAddWidgetDrawer = () => {
  isAddWidgetDrawerOpen.value = false;
  selectedAddWidgetIds.value = [];
};

const toggleAddWidget = (widgetId: string) => {
  selectedAddWidgetIds.value = selectedAddWidgetIds.value.includes(widgetId)
    ? selectedAddWidgetIds.value.filter((id) => id !== widgetId)
    : [...selectedAddWidgetIds.value, widgetId];
};

const isAddWidgetSelected = (widgetId: string) =>
  selectedAddWidgetIds.value.includes(widgetId);

const loadActiveDashboard = () => {
  if (!activeDashboard.value) return;

  dashboardName.value = activeDashboard.value.dashboardName;
  sectionData.value = cloneSections(activeDashboard.value.sections);
  savedDashboardName.value = dashboardName.value;
  savedSectionData.value = cloneSections(sectionData.value);
  isEditingDashboard.value = false;
  shareModalOpen.value = false;
  shareCancelConfirmOpen.value = false;
  shareExportComplete.value = false;
  jsonPreviewOpen.value = false;
  closeAddWidgetDrawer();
};

const selectDashboard = (index: number) => {
  if (index === activeDashboardIndex.value) return;
  activeDashboardIndex.value = index;
  loadActiveDashboard();
};

const createDashboard = () => {
  const timestamp = Date.now();
  const nextDashboard: DashboardConfig = {
    dashboardName: `Dashboard ${dashboardConfigs.value.length + 1}`,
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
  };

  dashboardConfigs.value = [
    ...dashboardConfigs.value,
    cloneDashboardConfig(nextDashboard),
  ];
  activeDashboardIndex.value = dashboardConfigs.value.length - 1;
  loadActiveDashboard();
};

const startEdit = () => {
  savedDashboardName.value = dashboardName.value;
  savedSectionData.value = cloneSections(sectionData.value);
  isEditingDashboard.value = true;
};

const cancelEdit = () => {
  closeAddWidgetDrawer();
  dashboardName.value = savedDashboardName.value;
  sectionData.value = cloneSections(savedSectionData.value);
  isEditingDashboard.value = false;
};

const saveEdit = () => {
  closeAddWidgetDrawer();
  dashboardConfigs.value = dashboardConfigs.value.map((config, index) =>
    index === activeDashboardIndex.value
      ? {
          ...config,
          dashboardName: dashboardName.value,
          sections: cloneSections(sectionData.value),
        }
      : config
  );
  savedDashboardName.value = dashboardName.value;
  savedSectionData.value = cloneSections(sectionData.value);
  isEditingDashboard.value = false;
};

const removeDashboard = () => {
  if (!dashboardConfigs.value.length) return;
  dashboardConfigs.value = dashboardConfigs.value.filter(
    (_, index) => index !== activeDashboardIndex.value
  );
  activeDashboardIndex.value = dashboardConfigs.value.length
    ? Math.min(activeDashboardIndex.value, dashboardConfigs.value.length - 1)
    : 0;

  if (dashboardConfigs.value.length) {
    loadActiveDashboard();
  } else {
    dashboardName.value = "";
    sectionData.value = [];
  }
  isEditingDashboard.value = false;
  closeAddWidgetDrawer();
};

const addWidget = () => {
  if (!isContainerSectionEditable.value) return;
  isAddWidgetDrawerOpen.value = true;
};

const saveAddWidgets = () => {
  if (!isContainerSectionEditable.value || !selectedAddWidgetIds.value.length) {
    closeAddWidgetDrawer();
    return;
  }

  const timestamp = Date.now();
  const nextWidgets = addWidgetOptions
    .filter((widget) => selectedAddWidgetIds.value.includes(widget.id))
    .map((widget, index) => ({
      ...widget,
      id: `container-widget-${timestamp}-${index}`,
    }));

  sectionData.value = sectionData.value.map((section) =>
    section.widgetType === "container" && section.editable
      ? {
          ...section,
          widgets: [...section.widgets, ...nextWidgets],
        }
      : section
  );
  closeAddWidgetDrawer();
};

const handleFlowLayoutChange = (
  event: CustomEvent<DashboardFlowLayoutChangeDetail>
) => {
  const { order = [], spanById = {} } = event.detail || {};
  if (!order.length || !isContainerSectionEditable.value) return;

  const orderSet = new Set(order);
  sectionData.value = sectionData.value.map((section) => {
    if (section.widgetType !== "container" || !section.editable) {
      return section;
    }

    const widgetsById = new Map(
      section.widgets.map((widget) => [widget.id, widget])
    );
    const nextWidgets = [
      ...order
        .map((id) => widgetsById.get(id))
        .filter((widget): widget is DashboardWidget => Boolean(widget))
        .map((widget) => applySpanPatch(widget, spanById[widget.id])),
      ...section.widgets
        .filter((widget) => !orderSet.has(widget.id))
        .map((widget) => applySpanPatch(widget, spanById[widget.id])),
    ];

    return { ...section, widgets: nextWidgets };
  });
};

const removeWidget = (widgetId: string) => {
  if (!isContainerSectionEditable.value) return;
  sectionData.value = sectionData.value.map((section) =>
    section.widgetType === "container" && section.editable
      ? {
          ...section,
          widgets: section.widgets.filter((widget) => widget.id !== widgetId),
        }
      : section
  );
};

const getWidgetSpan = (
  widget: DashboardWidget
): DashboardWidgetSpan | undefined => {
  if (
    widget.dataColSpan == null &&
    widget.dataSmColSpan == null &&
    widget.dataXsColSpan == null
  ) {
    return undefined;
  }

  return {
    base: widget.dataColSpan,
    sm: widget.dataSmColSpan,
    xs: widget.dataXsColSpan,
  };
};

const onDashboardNameInput = (event: Event) => {
  dashboardName.value = (event.target as HTMLInputElement).value;
};

const getSharedDashboardJson = (): DashboardConfig => ({
  dashboardName: dashboardName.value,
  sections: cloneSections(sectionData.value),
});

const openShareModal = () => {
  shareCancelConfirmOpen.value = false;
  shareExportComplete.value = false;
  shareModalOpen.value = true;
};

const closeShareModal = () => {
  shareModalOpen.value = false;
  shareExportComplete.value = false;
};

const cancelShareModal = () => {
  shareModalOpen.value = false;
  shareCancelConfirmOpen.value = true;
};

const cancelShareCancelConfirm = () => {
  shareCancelConfirmOpen.value = false;
  shareModalOpen.value = true;
};

const hideShareCancelConfirm = () => {
  shareCancelConfirmOpen.value = false;
};

const confirmLeaveShareModal = () => {
  shareCancelConfirmOpen.value = false;
  shareModalOpen.value = false;
  shareExportComplete.value = false;
};

const exportDashboard = () => {
  sharedJson.value = JSON.stringify(getSharedDashboardJson(), null, 2);
  shareModalOpen.value = false;
  jsonPreviewOpen.value = true;
};

const closeJsonPreview = (event?: Event) => {
  if (event && event.target !== event.currentTarget) return;
  jsonPreviewOpen.value = false;
  shareExportComplete.value = true;
  shareModalOpen.value = true;
};

const copySharedJson = async () => {
  if (!sharedJson.value) {
    sharedJson.value = JSON.stringify(getSharedDashboardJson(), null, 2);
  }
  await navigator.clipboard?.writeText(sharedJson.value);
};

const downloadSharedJson = () => {
  if (!sharedJson.value) {
    sharedJson.value = JSON.stringify(getSharedDashboardJson(), null, 2);
  }
  const blob = new Blob([sharedJson.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-config-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.json-code-snippet::part(content) {
  display: block;
  max-height: 52vh;
  overflow: auto;
}
</style>

```

### custom-dashboard/config.ts
```ts
// file: custom-dashboard/config.ts
export interface DashboardMetric {
	id: string;
	value: string;
	label: string;
	sentiment: "positive" | "warning" | "negative";
	icon?: string;
}

export interface DashboardWidget {
	id: string;
	cardType?: "statistics" | "health" | "basic";
	title: string;
	value?: string;
	icon?: string;
	metrics?: DashboardMetric[];
	status?: string;
	height?: string;
	dataColSpan?: number;
	dataSmColSpan?: number;
	dataXsColSpan?: number;
}

export interface DashboardSection {
	id: string;
	sectionTitle: string;
	widgetType: "card" | "container";
	editable: boolean;
	widgets: DashboardWidget[];
}

export interface DashboardConfig {
	dashboardName: string;
	sections: DashboardSection[];
}

export const dashboardConfigs: DashboardConfig[] = [
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
						id: "section-one-statistic-card-3",
						cardType: "statistics",
						title: "Title 3",
						value: "Value 3",
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
						id: "dashboard-two-statistic-card-2",
						cardType: "statistics",
						title: "Title 2",
						value: "Value 2",
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
					{
						id: "dashboard-two-flow-widget-3",
						title: "Container Widget 3",
					},
				],
			},
		],
	},
];

```
