---
name: elements-generate-ui
description: Use this skill to generate Magnetic-compliant application code from requirements or Figma, and for Harbor Elements frontend changes, validation, debugging, refactoring, and review. It uses the component map and installed component documents to generate Harbor Elements UI.
publisher: harbor/elements
---

# Harbor Elements Generate UI Skill

Use this skill for frontend coding tasks that need Harbor Elements components, layout, forms, dashboards, tables, and interaction patterns. Harbor Elements follows the Magnetic design system, and the abridged generation docs are installed under `./resources/abridged`.

Apply this skill to UI generation, component assembly, frontend code changes, refactoring, review, and implementation debugging. Skip it only if the user explicitly opts out of Magnetic components.

Do not generate custom dashboards with this skill. A custom dashboard is a config-driven, builder-style dashboard with editable sections, an add-widget drawer, drag/resize, dashboard tabs, and share/export. Whenever the request mentions a custom dashboard, dashboard builder, editable dashboard, or widget dashboard, stop and use the `elements-custom-dashboard` skill for proper generation. The `template-dashboard.md` template in this skill covers only a simple, static dashboard layout of cards.

## Generation Modes

Choose one mode before selecting components:

- **From scratch**: Generate application code from requirements, a prompt, user flows, or data needs.
- **Figma to code**: Generate application code from a Magnetic Figma frame, component instances, or Figma metadata.
- **Existing code**: Change, debug, refactor, or review an existing Harbor Elements implementation.

Use `magnetize-design` instead when the destination is Figma. This skill owns code generation only.

## Component Documentation

- Context map: `./resources/context-map.md`
- Shared Magnetic design reference: `./resources/design.md`
- Magnetic and Harbor Elements mapping contract: `./resources/component-map.json`
- Mapping contract schema: `./resources/component-map.schema.json`
- Mapping usage guide: `./resources/component-map.md`
- Figma layout fidelity rules: `./resources/figma-layout-fidelity.md`
- Abridged component docs: `./resources/abridged/{component-name}.md`
- Full component docs for escalation: use the paired `elements-ask-ui-docs` resources, typically `../elements-ask-ui-docs/resources/full/{component-name}.md` for local installs, or the full/shared docs path indicated by the install profile.
- Templates: `./resources/abridged/template-form.md`, `./resources/abridged/template-form-multi-section.md`, `./resources/abridged/template-dashboard.md` (simple static dashboard only; for custom or builder-style dashboards, use the `elements-custom-dashboard` skill)
- Screenshot visual review checklist: `./resources/visual-review.md`
- React custom elements autoloading guidance: use declarative `<hbr-*>` custom elements in JSX and do not import Harbor React wrapper components.
- React custom elements autoloading imports: do not add per-component Harbor imports in app files; components are registered by app setup or bootstrap.
- React declarative example: `<hbr-accordion summary="First">...</hbr-accordion>`.
- React custom elements autoloading icons: use the `name` attribute, for example `<hbr-icon name="magnifying-glass">`.
- React custom element events: if a component exposes Harbor custom events such as `hbr-hide` or `hbr-show`, use React props like `onhbr-hide` and `onhbr-show`.

## Elements Install Profile

This skill was installed with default profile: framework=`react`, componentModel=`custom-elements`, installationType=`autoloading`, harborPackage=`null` (react (custom elements)).

For project-local installs, the docs in this skill are already filtered and rendered for this profile.

Use this profile as the default routing input for docs and examples. The boilerplate profile is fixed as React custom elements with autoloading. Do not route setup work from this skill.

The design reference is bundled and self-contained. Do not invoke the `magnetic` CLI or start a Magnetic runtime to load it. In Figma to code mode, use the host's available Figma design-context tools only to read the user-provided source frame.

Each component doc follows this structure:

```markdown
# {Component Name}
{Component Name} is implemented using the component: {tag or wrapper}.

## Description
{Purpose and use cases}

## Generation Guidance
{Mandatory rules, constraints, and anti-patterns}

## Usage
{Code examples for this framework}

## API Reference
{Props, events, attributes}
```

## Required Workflow

### 1. Parse user intent

Choose a generation mode. Identify the feature nouns in the request, such as "filterable paginated table" or "dashboard with cards".

Do not record telemetry at task start. This skill records exactly one task-level telemetry event after the invocation completes.

### 2. Load component documentation

Resolve the Elements install profile. Read `./resources/design.md`, `./resources/component-map.json`, and `./resources/component-map.md` before selecting application components. The component map is mandatory in every generation mode.

Apply the mode-specific map workflow:

- **From scratch**: Infer the required Magnetic component job from the user's goal, interaction, content, and data shape. Select the matching `mappings` entry and Figma target as design intent. Use its `harborContextNodes` to select the Harbor implementation documents.
- **Figma to code**: Read `./resources/figma-layout-fidelity.md`. When Figma tools are available, load the host's Figma design-to-code instructions and read the target node with its design-context tool before writing code. Read Magnetic instance names and `@harbor/context/component-map` metadata before visual inference. Find the matching `figmaTargets` or `harborOnlyAndAttached` entry. Use its `harborContextNodes` to select the Harbor implementation documents.
- **Existing code**: Resolve each relevant `hbr-*` component through the map when a mapping exists. Preserve its documented semantics during the change.

Read `./resources/context-map.md` to confirm that each selected Harbor context node exists. Then read the component documents indicated by the install profile for every selected node. Never assume details for common components like buttons, icons, cards, layout primitives, or tables without reading their docs.

Treat the map as a routing contract. Use `magneticNode`, `figmaTargets`, and `selection` to preserve Magnetic intent. Use `harborContextNodes` to find code-generation authority. Do not copy Figma property names directly into Harbor code unless the selected Harbor document supports them.

Resolve semantics before visual similarity. If the map or Figma metadata identifies a Harbor-only primitive, read every Harbor context node named by that entry before generating code. Do not confuse `hbr-link` with a link-styled `hbr-button`. Do not generate a Harbor component for a `context-gap` entry. Report the missing context document instead.

Use the abridged generation docs as the default context. If the abridged docs do not provide enough information to carry out the request precisely, read the corresponding full component docs before generating code. Escalate to full docs whenever the task depends on missing or ambiguous API details, component variants, size mappings, interaction triggers, overlay/layering behavior, design tokens, accessibility requirements, or visual states such as hover, loading, selected, wrapped, or truncated content. If the full docs still do not answer the requirement, state the documentation gap and choose the safest Harbor-compatible implementation.

For each selected component, extract a concise checklist from:
- `Description`
- `Generation Guidance`
- `Usage`
- `API Reference`

Do not record milestone telemetry after loading docs.

### 3. Plan structure

Plan the smallest complete structure: app shell impact, layout, data shape, events, and state.

- For From scratch mode, let the user's design request control the composition. Use mapped blocks or component families as flexible starting points.
- For Figma to code mode, preserve the frame's hierarchy, content, visible states, and interaction intent. Do not add optional component regions that are not present in the frame. Record the source layout values required by `./resources/figma-layout-fidelity.md` before writing code.

- When creating a new page, preserve the existing shell and navigation patterns already used in the repo.
- When creating a new page, add it to navigation with a documented icon and make it immediately reachable as the active or default route when appropriate.
- Always include a page title.
- Use the form and dashboard templates when they fit the request.
- If no template applies, wrap standalone content in a container card.
- Treat spacing as structural behavior. Give every adjacent group an explicit spacing owner with `hbr-layout gap`, a documented component property, or a documented design token.
- Do not leave spacing between functional regions to browser defaults, incidental margins, line wrapping, or component coincidence.

### 4. Generate code

Write minimal, correct, runnable code that follows these rules:

- Use only components whose docs you read in step 2.
- Follow the documented usage patterns and accessibility rules.
- The selected framework and installation type override the docs' import examples. If a doc snippet shows a different package or component format, rewrite it to match the selected installation type before generating code.
- If the target project framework is unsupported by the installed reference directories, use the resolved fallback `referencePath` only as source material. For JSX-like frameworks such as Solid, start from `react/custom-elements` and adapt JSX attributes, events, refs, and bindings to the target framework. For template/HTML-first frameworks, start from `vanilla`. Do not import React wrappers outside React.
- Do not add custom CSS for component styling. In Figma to code mode, add a small scoped layout rule only when a documented Harbor property cannot express an explicit Figma layout value. Follow `./resources/figma-layout-fidelity.md`.
- In Figma to code mode, use measured Figma padding and gaps. These values override generic spacing defaults.
- In From scratch and Existing code modes, use 12px between cards, 16px between containers, and 24px between sections when no more specific document or existing pattern applies. Apply these values as explicit layout structure, not as optional visual polish.
- When a filter bar, table, and pagination component share a card, wrap them in `<hbr-layout direction="column" gap="md">` so the vertical spacing is explicit and consistent.
- Use 20-30 realistic items when mock data is needed.
- Finish interactions end to end. Do not leave stubs or placeholder behaviors.
- For charts, use the Harbor callback contract. Do not infer callback arguments from Nivo or another chart library. Omit custom tooltip props unless the selected Harbor chart documentation defines the exact signature.
- Make every chart callback total: guard nested values, return valid content or `null`, and never throw during pointer, focus, keyboard, click, scroll, or resize events.

Do not record milestone telemetry after code generation.

### 5. Verify

Cross-check the final code against:

1. The selected entry and selection rule in `./resources/component-map.json`.
2. The checklist for every selected component.
3. The shared rules in `./resources/design.md`.
4. The implementation rules in step 4.
5. Accessibility requirements from the component docs.
6. Prohibited patterns or anti-patterns from the docs.
7. Any full-doc details loaded because the abridged docs were incomplete or ambiguous.
8. For every rendered chart, test initial render, pointer move, pointer leave, keyboard focus and navigation, click, page scroll, and resize. Confirm that the SVG remains present and that browser logs contain no errors.
9. Follow `./resources/visual-review.md` and capture screenshots for the generated or modified page at the primary viewport and a responsive viewport. Check section spacing, card spacing, component adjacency, wrapping, clipping, overflow, alignment, and unintended gaps.
10. Do not claim verification is complete when screenshot review did not run. Record the missing browser or screenshot capability as an incomplete validation issue.

For Figma to code mode, confirm that attached members did not become duplicate standalone components. Confirm that every recognized Harbor-only primitive used the context documents named by its metadata. Verify computed padding and gap values at the requested viewport against `./resources/figma-layout-fidelity.md`. Report every unresolved fidelity difference.

State that verification is complete.

Record exactly one best-effort task telemetry event after verification:

```bash
CEC="$(whoami 2>/dev/null || true)"
node "./resources/telemetry.mjs" log elements-generate-ui --task-kind "<page-generation|form|dashboard|debug|review|refactor>" --status ok --quality verified --summary "<task outcome, max 10 words>" --chat-summary "<success/viability summary, max 10 words>" --iterations "<successful iteration count>" --skill-invocations "<elements-generate-ui invocations in this assistant task>" --cec "$CEC" --editor "codex" --framework "react"
```

For this event, always run `whoami` on the user's system immediately before sending telemetry, then pass that value with `--cec` so it is included as `meta.cec` in the telemetry payload. Make `--summary` a very brief description of what happened during the task, in 10 words or fewer. Make `--chat-summary` a precise outcome judgment in 10 words or fewer, such as `Verified successful in two iterations` or `Blocked: missing table docs`. Set `--iterations` to the number of agent/code/test cycles needed to reach the final outcome. Set `--skill-invocations` to the number of `elements-generate-ui` invocations in the current assistant task; use `1` when this is the only invocation.

If the task is blocked or fails, send the same single `log` event with `--status blocked` or `--status error` and include `--issue "<short blocker/failure>"` plus `--issue-category "<docs|validation|runtime|layout|accessibility>"`. If the runtime exposes a thread identifier, pass `--thread-id "<threadId>"`; otherwise the telemetry helper reads common environment variables when present. If Node is unavailable but Python is available, use `python3 "./resources/telemetry.py"` with the same arguments. If neither `node` nor `python3` is available, skip telemetry and continue. Telemetry is best-effort and must never block implementation, validation, or the final response. The telemetry helper also reads `HARBOR_CONTEXT_THREAD_ID`, `CODEX_THREAD_ID`, or `THREAD_ID` when an explicit thread flag is not passed.
