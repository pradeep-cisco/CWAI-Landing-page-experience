---
name: elements-custom-dashboard
description: Generate config-driven Harbor Elements custom dashboards with editable sections, statistics/health/basic card widgets, container widgets, tabs, add-widget drawers, drag/resize, and share/export. Use when a user asks to build, scaffold, or extend a custom dashboard, dashboard builder, editable dashboard, or widget dashboard in React, Angular, Vue, vanilla JavaScript, Lit, HTML, JSX, or TSX. Bundles per-framework custom dashboard samples consumed from @harbor/elements-context.
---

# Elements Custom Dashboard

## Overview

Use this skill to generate a Harbor Elements custom dashboard: a config-driven dashboard whose sections and widgets are described by serializable JSON, rendered with `hbr-layout` dashboard variants, and edited, reordered, resized, created, and shared by the user. Treat the bundled per-framework samples under `references/custom-dashboard-samples-src/` as the source of truth for structure, config shape, layout variants, editing behavior, and file layout.

Whenever a request mentions a custom dashboard, implement a builder-style dashboard by default, not a static dashboard page. A builder-style custom dashboard loads dashboard config objects, renders the active config, and supports dashboard tabs, edit mode, an add-widget drawer, drag/resize, create-dashboard, and share/export. Reproduce the full supporting file structure shown in the matching sample's `## Usage` section; do not collapse it into a single page component.

Do not confuse a custom dashboard with the simpler static dashboard template from `elements-generate-ui`. The static template is a fixed layout of cards; a custom dashboard is a config-driven builder.

## Builder Supporting Files

Each sample's `## Usage` section is split into supporting files. Recreate the same file structure (adapted to the target framework) so the builder behavior stays modular. The React samples are the fullest reference:

- `custom-dashboard.<ext>` — the dashboard page: loads config objects, renders the active config, owns dashboard tabs, edit-mode draft state, toolbar, and Save/Cancel/Delete.
- `custom-dashboard/AddWidgetDrawer.<ext>` — the add-widget drawer with a widget checklist and live preview for editable sections.
- `custom-dashboard/DashboardCreate.<ext>` — the create-dashboard drawer and draft-widget serialization, kept out of the page.
- `custom-dashboard/DashboardShare.<ext>` — the share/export flow (share modal, leave-page confirmation, JSON preview, copy, download), kept out of the page.
- `custom-dashboard/config.<ext>` and a second config — seed dashboard config objects that the page loads into state.

For Angular, Vue, vanilla, and Lit, the sample `## Usage` may show fewer files, but the `## Generation Guidance` still describes the same add-widget, create, and share companion modules. Keep that separation of concerns and translate the React file layout into the target framework's module/component conventions.

## Required Workflow

1. Confirm the target framework and file.
   - If the user named a framework or file, use it. Otherwise infer the framework from the repository and confirm before generating.
   - Use the fixed boilerplate React custom-elements profile and its existing import style.

2. Load the matching bundled sample.
   - Read `references/custom-dashboard-samples.md` to pick the framework sample.
   - Read `references/custom-dashboard-samples-src/<framework>/template-custom-dashboard.md` for the framework whose idioms match the target repository.
   - Read both the `## Generation Guidance` and the `## Usage` sections. Enumerate every file in `## Usage` and plan to reproduce that full supporting file set, not only the main page component.
   - If no sample matches the target framework exactly, read the `react/template-custom-dashboard.md` sample for behavior, file layout, and config intent, then translate the JSX and file structure into the target framework's binding syntax, event syntax, state model, and slot/content projection.

3. Build the dashboard config first.
   - Model each dashboard as a config object with `dashboardName` and `sections`.
   - Default to an empty dashboard: unless the user explicitly asks for widgets to be present, seed exactly one editable `container` section holding a single empty container card and one `card` section holding a single empty basic card. Do not pre-populate statistics, health, or other example widgets, even though the bundled samples do. The empty starting point lets the user decide what goes on the dashboard through the add-widget and create flows.
   - An empty basic card is a `basic` card widget with an empty `title` and no `status`; an empty container card is a container widget with an empty `title`. Give each a stable `id`.
   - Give each section an `id`, `sectionTitle`, `widgetType` (`card` or `container`), `editable` flag, and `widgets` array.
   - Use `cardType` on card widgets (`statistics`, `health`, `basic`); do not store layout `variant` or `statusVariant` in config.
   - Keep container widgets in a `widgetType: "container"` section and seed them with serializable content only; do not seed height or span fields.
   - Keep all config data serializable JSON, and clone configs, sections, and widgets before editing state.

4. Render from the config.
   - Use `hbr-layout` semantic variants: `variant="page"`, `variant="dashboard"`, `variant="dashboard:section"`, and derive widget grids as `dashboard:widgets:<widgetType>` or `dashboard:widgets:basic-<cardType>`.
   - Render statistics widgets in the statistics grid; render health and basic widgets in the health grid.
   - Render container widgets inside `hbr-dashboard-flow` so drag order and spans can be persisted.
   - Use `hbr-text` variants for titles: `page-title`, `section-title`, `sub-section-title`, and `drawer-title`.
   - Only expose edit-mode widget add, remove, drag, or resize behavior for sections with `editable: true`.
   - Treat spacing as structural behavior. Give every adjacent dashboard region an explicit `hbr-layout gap`, documented component property, or documented design token.

5. Implement the full builder by default.
   - Build the complete builder-style dashboard from the sample: dashboard tabs, edit mode, add-widget drawer, drag/resize, create-dashboard, and share/export. Do not ship a static, non-editable dashboard when the request is for a custom dashboard.
   - Reproduce the supporting files from the sample's `## Usage` section: the dashboard page plus the `AddWidgetDrawer`, `DashboardCreate`, and `DashboardShare` companion modules and the seed config files, adapted to the target framework.
   - Keep an editable draft in component state while editing; commit on Save and restore on Cancel.
   - Keep create-dashboard behavior in its companion module and pass only the completed dashboard config back to the page.
   - Keep share/export behavior in its companion module and pass only dashboard name, sections, and state handlers from the page.
   - Persist through the app's own data layer. Demos may use localStorage; do not wire real backend integration, saved user preferences, or URL sync unless the user asks. Narrow the builder to a subset of features only when the user explicitly requests a reduced scope.

6. Validate.
   - Run the narrowest relevant typecheck, lint, or test command available for the touched package.
   - Follow `../elements-generate-ui/resources/visual-review.md` and capture screenshots at the primary and responsive viewports before reporting the dashboard as verified.
   - Confirm the dashboard renders the seeded sections and widgets, and that the full builder behavior works: dashboard tabs, edit mode, add-widget drawer, drag/resize, create-dashboard, and share/export. By default the seeded content is only one empty container card and one empty basic card. Edit-mode widget add/remove/drag/resize applies to sections with `editable: true`.
   - Ask the user to validate the dashboard in the consuming app flow, including the edit, drag, resize, create, and share behavior.

## Guardrails

- Treat any mention of a custom dashboard as a request for the full builder-style implementation and its supporting files; only reduce scope when the user explicitly asks.
- Default to an empty dashboard: seed only one empty container card and one empty basic card unless the user explicitly requests pre-populated widgets. Do not seed the sample's example statistics or health widgets by default; the empty state is intentional so the user can customize the dashboard.
- Prefer the bundled framework sample over inventing patterns. Treat `SKILL.md` guardrails as higher priority than sample code.
- Keep config data serializable JSON, and clone configs, sections, and widgets before editing state.
- Do not mix basic cards and container cards in the same grid.
- Do not treat spacing as optional layout polish. Do not rely on browser defaults, incidental margins, line wrapping, or component coincidence for required spacing.
- Do not store layout `variant` or `statusVariant` in card config; use `cardType`.
- Do not seed custom dashboard config with `height` or container span fields; span fields such as `dataColSpan` are emitted by `hbr-dashboard-flow` after a resize.
- Keep add-widget options aligned with the target section `widgetType`.
- Do not derive unsupported grid variants such as `dashboard:widgets:basic-basic`.
- Do not inline create-dashboard or share/export logic in the main dashboard template; keep them in their `DashboardCreate` and `DashboardShare` companion modules.
- Use Harbor events such as `hbr-hide`, `hbr-change`, `hbr-draggable-remove`, and `hbr-flow-layout-change`, applied with the target framework's event syntax.
- For React/JSX, use direct props and native `onClick` for `HbrButton`; use Harbor custom event props for component-specific events. For Angular, Vue, vanilla, and Lit, use that framework's native binding and event syntax.
- For chart widgets, omit custom tooltip props unless the selected Harbor chart documentation defines the exact callback signature. Harbor wraps Nivo, so do not infer callback arguments from Nivo. Guard nested values in every chart callback and verify chart rendering after pointer, focus, keyboard, click, scroll, and resize events.
- Do not add persistence, saved user preferences, server-side loading, backend API integration, caching, or URL synchronization unless the user explicitly asks for it. This does not reduce the builder UI itself: build the add-widget, create, and share behavior by default and use demo/localStorage persistence when no data layer is specified.
