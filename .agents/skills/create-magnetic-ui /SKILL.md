---
name: create-magnetic-ui
description: Use this skill by default for frontend coding tasks in this repository, including UI generation, frontend code changes, validation, debugging, refactoring, and review.
---

# Magnetic Design System UI Skill

This skill applies to all frontend and UI tasks in this repository. "Magnetic" is a design system for Cisco products, implemented as web components in the `@harbor/elements` library. All custom elements are prefixed with `hbr-`.

**When to apply**: Any task involving UI, components, layout, forms, visualization, interaction, page assembly, refactoring, or review — including follow-ups that modify existing UI. Skip only if the user explicitly opts out of Magnetic components.

## Component Documentation

- **Context map**: `ui-context/elements/context-map.md` — lists all available components by name and description.
- **Component docs**: `ui-context/elements/context/{component-name}.md` — one file per component (e.g., `button.md`, `table.md`).
- **Templates**: `template-form.md`, `template-form-multi-section.md`, `template-dashboard.md` in the same directory.

Each component doc follows this structure:

```markdown
# {Component Name}
{Component Name} is implemented using the web component: <hbr-{component-name}>.

## Description
{Semantic purpose and use cases}

## Generation Guidance
{Mandatory rules, constraints, do/don't patterns}

## Usage
{Code examples — may be overridden by React 18 compatibility patterns}

## API Reference
{Props, events, attributes}
```

---

## Workflow (MANDATORY — follow every step exactly)

### Step 1: Parse user intent

Identify feature nouns from the request (e.g., "filterable paginated table", "dashboard with cards").

### Step 1.5: Detect OneCD state and downstream workflow

This repository may include an `apply-onecd-theme` skill.

Before generating or changing UI code, check whether OneCD is already applied:

- The Harbor loader has `injectOneCDTokens: true`, `injectOneCDDarkTokens: true`, `injectOneCDTheme: true`, and `injectOneCDDarkTheme: true`.
- `src` contains at least one OneCD surface or shell marker, such as `data-theme="onecd"`, `hbr-css__onecd-theme`, or `hbr-css__base-bg-gradient-layer`.

If OneCD is not already applied, do not enable OneCD bootstrap flags, add `data-theme="onecd"`, or add OneCD shell/background classes during ordinary UI generation, refactoring, or review.

If the user explicitly invokes `apply-onecd-theme` in the current turn, complete this skill's normal component workflow first, then run the `apply-onecd-theme` workflow against the generated or touched files.

If OneCD is already applied and this skill is called to generate or edit frontend code, use `apply-onecd-theme` as a downstream reference in reference mode. Generated or touched supported OneCD components must follow that skill's scoping rules, including `data-theme="onecd"` on supported components such as `hbr-shell-header`, `hbr-shell-nav`, `hbr-card[container]`, `hbr-global-search`, `hbr-modal`, `hbr-tooltip`, `hbr-popover`, and `hbr-drawer`.

### Step 2: Load and read component documentation

2.1. Load `ui-context/elements/context-map.md` to see all available components.

2.2. Select candidate components that match the user's request.

2.3. Read `ui-context/elements/context/{component-name}.md` for **every** selected component. This includes common components like buttons, icons, and cards — never assume knowledge without reading the doc.

2.4. For each component, extract a generation checklist from its documentation:
- Extract all constraints and requirements from Generation Guidance
- Identify correct code patterns from Usage examples
- Note prop types and API surface from API Reference
- Convert rules into actionable verification items

### Step 3: Plan structure

Plan the minimal structure: layout, spacing, data shape, event handlers.

**App shell rules** (apply only when creating a new page):
- Explore the repository to find the existing app shell and preserve it.
- Add the new page to navigation using an icon from `ui-context/elements/context/icon.md`.
- Set the new page as the active/default route so it is immediately visible.

**Layout defaults** (always read the referenced docs when they apply):
- Always include a page title — see `ui-context/elements/context/page-title.md`.
- For forms, use `ui-context/elements/context/template-form.md` or `template-form-multi-section.md`.
- For dashboards, use `ui-context/elements/context/template-dashboard.md`.
- If no template applies, wrap content with a container card — see `ui-context/elements/context/card-container.md`.

### Step 4: Generate code

Write minimal, correct, runnable code following these rules:

- **Only use documented components.** Every `hbr-` tag in your output must come from a doc read in step 2. Do not use `hbr-` components based on prior knowledge of other design systems (Material, Common UI, etc.).
- **No custom CSS.** Rely entirely on `hbr-` components and their built-in classes for all styling.
- **Spacing**: 12px between cards, 16px between containers, 24px between sections.
- **Mock data**: Use 20–30 realistic items.
- **Flesh out features completely** — search, filter, edit, interactivity. No stubs or placeholders.
- Keep output concise: minimal rationale + code.

### Step 5: Verify

Cross-reference your generated code against:

1. Every item in the generation checklists from step 2.
2. The implementation rules from step 4.
3. Accessibility requirements from component docs.
4. That no prohibited patterns or anti-patterns from the docs were used.
5. If Step 1.5 detected OneCD is already applied or the user explicitly invoked `apply-onecd-theme`, verify the generated or touched supported OneCD components comply with the `apply-onecd-theme` scope rules.

State that verification is complete.
