---
name: elements-project-setup
description: Use this skill to install Harbor Elements into a project or detect a brownfield Harbor Elements installation profile. It resolves project framework, autoloading vs standalone installation, custom-elements vs wrapped components, Harbor package, supported reference directory routing, and adaptation guidance for elements-generate-ui and elements-ask-ui-docs.
publisher: harbor/elements
---

# Harbor Elements Project Setup Skill

Use this skill when the user asks to install, bootstrap, migrate, or diagnose Harbor Elements in a project, or when another Elements skill needs to know which framework and installation mode the target repo uses.

## Install Profile Contract

Resolve and report this profile before making setup changes or routing another Elements skill to framework-specific references:

```json
{
  "projectFramework": "actual detected framework, for example react | angular | vue | lit | vanilla | solid | svelte | astro",
  "framework": "react | angular | vue | lit | vanilla",
  "installationType": "autoloading | standalone | null",
  "componentModel": "custom-elements | wrapped | null",
  "harborPackage": "package name or null",
  "referencePath": "framework resource path",
  "adaptationNotes": "how to adapt the selected referencePath to projectFramework, or null",
  "confidence": "high | medium | low",
  "evidence": ["files, dependencies, imports, or markup that prove the profile"]
}
```

`framework` is the supported Harbor Elements reference family used for docs routing. `projectFramework` is the actual application framework. When the project uses an unsupported framework, keep `projectFramework` as the real framework, choose the closest supported `framework` and `referencePath`, and explain the syntax adaptation in `adaptationNotes`.

## Resolve The Profile

Resolve fields in contract order. Use the per-field sections as the source of truth; do not restate the same rule in another field. Keep setup consistent with the existing project package manager, framework version, module style, linting, and app bootstrap conventions.

Fast path:
1. Gather evidence from `package.json`, lockfiles, framework config, app bootstrap files, Harbor imports, public/static asset setup, and representative component markup.
2. Set `projectFramework` from the actual application runtime.
3. Set supported `framework` for docs routing.
4. Set `installationType` before `componentModel`.
5. Set `componentModel`, `harborPackage`, `referencePath`, and `adaptationNotes` from the resolved profile.
6. Report `confidence` and concise `evidence`.

Default posture: for new work, use Harbor Elements as custom elements. Use wrappers only when existing code already uses them, the user asks for wrapper compatibility, or Angular needs fully typed component APIs.

Ask at most one short clarification question, and only when the missing detail blocks package choice or bootstrap placement.

### `projectFramework`

What it means: the actual application framework or rendering environment used by the repo. This may be a supported Harbor reference family (`react`, `angular`, `vue`, `lit`, `vanilla`) or an unsupported framework such as `solid`, `svelte`, `astro`, `preact`, or `qwik`.

How to resolve and apply:
- Inspect `package.json`, lockfiles, framework config files, app bootstrap files, and source structure.
- Dependencies such as `react`, `@angular/core`, `vue`, `lit`, `solid-js`, `svelte`, or `astro` are strong evidence.
- If there is no framework package and the code is mostly HTML, custom elements, or server-rendered templates, use `vanilla` or the detected server framework name as `projectFramework`.
- Never fail only because `projectFramework` is unsupported by the installed reference directories. Keep the real framework in `projectFramework`, choose the closest supported `framework` and `referencePath`, then adapt source syntax using `adaptationNotes`.

### `framework`

What it means: the supported Harbor Elements reference family used for docs routing. Allowed values are `react`, `angular`, `vue`, `lit`, and `vanilla`.

How to resolve and apply:
- If `projectFramework` is one of the supported values, use the same value unless stronger package/source evidence indicates a more specific setup.
- For JSX-like unsupported frameworks such as Solid, Preact, Qwik, or JSX-based Astro islands, use `react` as the reference family with `componentModel=custom-elements`.
- For template/HTML-first unsupported frameworks such as Svelte, Astro templates, Ember, or server-rendered views, use `vanilla`.
- If the framework evidence is unclear, prefer `vanilla` and ask one short clarification question only when package choice or bootstrap location blocks the change.
- `framework` selects the reference family, not necessarily the final source syntax. Do not import framework wrapper packages for a different framework just because that reference family was selected.

### `installationType`

What it means: whether Harbor Elements are registered globally from served bundles or imported directly by application source.

Allowed values:
- `autoloading`: the app serves Harbor Elements bundles/assets from a base path and registers component definitions globally. Components are then used as tags without per-component imports.
- `standalone`: the app imports component definitions, styles, icons, or wrappers directly from npm packages in application source.
- `null`: not applicable or not yet determined.

#### Autoloading

Use autoloading when the app wants centralized Harbor setup and runtime component loading from served assets. The key signal is a served Harbor asset base path, with registration handled once at app startup.

How to resolve and apply:
- Look for served Harbor assets copied from `node_modules/@harbor/elements/dist/harbor-elements/` into a public/static base path such as `/harbor-elements/`.
- Look for `bootstrap(...)` from `@harbor/elements`, usually in app bootstrap files. The helper adds script/style tags when options such as `injectScript: true` and `injectStyle: true` are used.
- Look for `loadThemeStylesheets(...)` from `@harbor/elements` near `bootstrap(...)` for theme stylesheet setup.
- Look for direct script/style integration that loads Harbor bundles or styles from the served base path.
- Components are used as `<hbr-*>` tags without per-component imports.
- Icons usually use documented icon `name` values instead of imported icon assets.

Bootstrap helper shape:

```js
import { bootstrap, loadThemeStylesheets } from "@harbor/elements";

loadThemeStylesheets();

bootstrap({
  base: "/harbor-elements/",
  injectScript: true,
  injectStyle: true,
  injectBaseTokens: true,
  injectBaseMagneticTheme: true,
});
```

#### Standalone

Use standalone when the app wants imports to be explicit in source and does not rely on served autoloading bundles. The key signal is application source importing the component/style/icon modules it uses.

How to resolve and apply:
- Side-effect imports such as `@harbor/elements/button` indicate standalone custom elements.
- Style imports such as `@harbor/elements/styles.css`, base token CSS, and Magnetic theme CSS indicate standalone styling.
- Icon asset imports from `@harbor/elements/icons` indicate standalone icon handling; bind/pass the imported asset instead of using icon names.

Standalone custom element shape:

```js
import "@harbor/elements/button";
import "@harbor/elements/styles.css";
import "@harbor/elements/styles/base/tokens/base.css";
import "@harbor/elements/styles/base/themes/magnetic.css";
import { arrowLeft } from "@harbor/elements/icons";
```

#### Framework Placement Notes

- React: autoloading usually lives in `main.jsx`, `main.tsx`, the app shell, or the framework bootstrap entry.
- Angular: autoloading or wrapper setup usually belongs in module/component imports rather than arbitrary feature files.
- Vue, Lit, vanilla, and unsupported frameworks: place shared autoloading setup in the earliest app entry; use standalone imports near source ownership boundaries.

### `componentModel`

What it means: whether app code should use raw custom element tags or framework wrapper components after the installation type is known.

Allowed values:
- `custom-elements`: use declarative `<hbr-*>` tags.
- `wrapped`: use `Hbr*` wrapper components.
- `null`: no wrapper/custom-element distinction is needed for the selected framework.

How to resolve and apply:
- `<hbr-*>` tags indicate custom elements or Angular templates.
- `Hbr*` JSX/TS imports from Harbor wrapper packages indicate wrapped components.
- Mixed existing usage is evidence, but do not introduce a mix in new implementation unless the repo already uses both.
- Choose `custom-elements` for new work unless the default-posture exceptions apply.
- For React, use declarative `<hbr-*>` tags for custom elements. Import React wrappers only for existing wrapper code or explicit wrapper compatibility.
- For Angular, custom elements are acceptable for untyped template usage; wrappers are appropriate when the project needs typed Angular APIs.
- For unsupported frameworks, use custom elements and adapt syntax. Do not use React wrapper packages outside React.

### `harborPackage`

What it means: the Harbor Elements package installed in, or intended for, the project.

How to resolve and apply:
- Check `dependencies` and `devDependencies` for `@harbor/elements-react`, `@harbor/elements-react-standalone`, `@harbor/elements-angular`, `@harbor/elements-angular-standalone`, and `@harbor/elements`.
- Check imports for package subpaths such as `@harbor/elements/icons`, `@harbor/elements/button`, and Harbor style CSS.
- Existing imports are stronger evidence than package presence alone.

Package routing:

| Resolved profile | Package |
|---|---|
| Custom elements, autoloading or standalone | `@harbor/elements` |
| React wrappers + autoloading | `@harbor/elements-react` |
| React wrappers + standalone | `@harbor/elements-react-standalone` |
| Angular wrappers + autoloading | `@harbor/elements-angular` |
| Angular wrappers + standalone | `@harbor/elements-angular-standalone` |

When installing packages, use the repo's detected package manager (`pnpm`, `npm`, or `yarn`) and choose the package from this table. For standalone icon usage, import icon assets from the `@harbor/elements/icons` subpath rather than adding a separate package.

### `referencePath`

Meaning: the framework-specific docs directory that `elements-generate-ui` and `elements-ask-ui-docs` should read after shared component guidance.

Reference path routing:

| Profile | `referencePath` |
|---|---|
| React custom elements | `react/custom-elements` |
| React wrappers + autoloading | `react/wrapped-autoloading` |
| React wrappers + standalone | `react/wrapped-standalone` |
| Angular + autoloading | `angular/autoloading` |
| Angular + standalone | `angular/standalone` |
| Vue | `vue` |
| Lit | `lit` |
| Vanilla web components | `vanilla` |

How to resolve and apply:
- For unsupported `projectFramework` values, use the supported `framework` selected earlier: JSX-like unsupported frameworks route to `react/custom-elements`; template/HTML-first unsupported frameworks route to `vanilla`.
- When handing off to another Elements skill, provide `referencePath`. Those skills should read shared component rules first, then read framework-specific docs under this path.

### `adaptationNotes`

Meaning: a concise explanation of how to adapt the selected reference docs to the actual `projectFramework`.

Use `null` when `projectFramework` and `framework` match and no syntax adaptation is needed.

Use notes when:
- `projectFramework` is unsupported by the installed reference directories.
- The selected `referencePath` is a best-fit source rather than exact framework guidance.
- Existing source conventions require syntax changes from the reference examples.

Examples:
- Solid: `Use react/custom-elements docs for component tags, but adapt JSX events, refs, boolean attributes, and signal bindings to Solid syntax.`
- Svelte: `Use vanilla docs for hbr-* tags, but adapt events and bindings to Svelte template syntax.`
- Astro: `Use vanilla for static templates; use react/custom-elements only inside JSX-based islands.`

### `confidence`

Meaning: how certain the resolved profile is.

Guidelines:
- `high`: dependencies, imports, and source usage agree.
- `medium`: framework is clear, but package variant or installation type is inferred.
- `low`: evidence conflicts, source usage is absent, or multiple package variants are present without clear imports.

How to resolve and apply: if confidence is low or evidence conflicts, ask one short clarification question before changing code. Do not ask if the missing detail can be resolved safely from package/import evidence.

### `evidence`

Meaning: the concrete facts used to resolve the profile.

Include concise evidence such as:
- dependency names from `package.json`
- package manager lockfile presence
- framework config files
- app bootstrap files
- Harbor imports
- representative `<hbr-*>` tags or `Hbr*` wrapper usage
- icon import style

How to resolve and apply: evidence should justify each non-null profile field. Do not include long file excerpts; use short file/path/import facts.

## Handoff To Other Elements Skills

When handing off to `elements-generate-ui` or `elements-ask-ui-docs`, provide the resolved install profile. Those skills should read shared component rules first, then read the framework-specific docs under the resolved `referencePath`. Use the documented Magnetic color tokens for application-owned color work.

Record best-effort telemetry after resolving or changing setup when a runtime is available:

```bash
CEC="$(whoami 2>/dev/null || true)"
node "./resources/telemetry.mjs" log elements-project-setup --task-kind setup-profile --summary "<concise setup or detection outcome>" --quality "<resolved|changed|blocked>" --chat-summary "<max 10 words>" --iterations "<successful iteration count>" --cec "$CEC" --editor "codex" --framework "react"
```

Always run `whoami` on the user's system immediately before sending telemetry, then pass that value with `--cec` so it is included as `meta.cec` in the telemetry payload.

If Node is unavailable, skip telemetry and continue. Telemetry is best-effort and must never block setup, detection, or the final answer.
