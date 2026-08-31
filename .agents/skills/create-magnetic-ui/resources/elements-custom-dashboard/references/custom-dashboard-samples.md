# Custom Dashboard Sample Reference

Use these bundled samples as implementation references when generating a Harbor Elements custom dashboard. Each sample is a per-framework rendering of the same custom dashboard template consumed from `@harbor/elements-context`. Prefer loading only the sample that matches the target framework.

Bundled sample source:

```text
references/custom-dashboard-samples-src/
  react/template-custom-dashboard.md
  react-autoloading/template-custom-dashboard.md
  react-standalone/template-custom-dashboard.md
  angular/template-custom-dashboard.md
  vue/template-custom-dashboard.md
  vanilla/template-custom-dashboard.md
  lit/template-custom-dashboard.md
```

Each sample contains a `## Generation Guidance` section (config shape, widget data contract, layout variants, rendering rules, editing/create/share behavior) and a `## Usage` section with framework-specific code.

The `## Usage` section is split into supporting files. A custom dashboard is builder-style, so reproduce the full supporting file set, not just the main page. The React samples show the fullest layout: `custom-dashboard.<ext>` (page), `custom-dashboard/AddWidgetDrawer.<ext>`, `custom-dashboard/DashboardCreate.<ext>`, `custom-dashboard/DashboardShare.<ext>`, and seed `custom-dashboard/config*.<ext>` files. Angular, Vue, vanilla, and Lit samples may show fewer files in `## Usage`, but their `## Generation Guidance` still describes the same add-widget, create, and share companion modules to recreate.

## Framework To Sample Map

| Target | Sample |
| --- | --- |
| React custom elements | `react/template-custom-dashboard.md` |
| React wrappers + autoloading | `react-autoloading/template-custom-dashboard.md` |
| React wrappers + standalone | `react-standalone/template-custom-dashboard.md` |
| Angular (autoloading or standalone) | `angular/template-custom-dashboard.md` |
| Vue | `vue/template-custom-dashboard.md` |
| Vanilla web components / HTML | `vanilla/template-custom-dashboard.md` |
| Lit | `lit/template-custom-dashboard.md` |

For any framework without a matching sample, read `react/template-custom-dashboard.md` for behavior and config intent, then translate the JSX into the target framework's binding syntax, event syntax, state model, and slot/content projection.

## Important Overrides

Samples are references, not generation rules. The `SKILL.md` guardrails override sample code:

- Keep config data serializable JSON, and clone configs, sections, and widgets before editing state.
- Use `cardType` on card widgets; do not store layout `variant` or `statusVariant` in config.
- Do not seed config with `height` or container span fields; span fields are emitted by `hbr-dashboard-flow` after a resize.
- Only expose edit-mode behavior for sections with `editable: true`.
- Keep create-dashboard and share/export behavior in small companion modules.
- Do not add persistence, server-side loading, backend integration, or URL sync unless the user asks.
- Load only the narrowest sample needed for the target framework.
