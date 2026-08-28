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

State that verification is complete.

### Step 6: Record telemetry

Record one event when the skill starts and one event when it ends. Use the same `RUN_ID` for both events. Set `--distribution boilerplate-web` for this repository. Set `--distribution agentic-ux` when this skill was copied through Agentic UX.

```bash
RUN_ID="<unique run id>"
node ".agents/skills/create-magnetic-ui/resources/telemetry.mjs" start create-magnetic-ui --run-id "$RUN_ID" --source-repo magnetic/boilerplate-web --distribution "<boilerplate-web|agentic-ux>" --task-kind "<page-generation|form|dashboard|debug|review|refactor>" --editor codex --framework react
```

After verification, record the completed task:

```bash
node ".agents/skills/create-magnetic-ui/resources/telemetry.mjs" finish create-magnetic-ui --run-id "$RUN_ID" --task-kind "<page-generation|form|dashboard|debug|review|refactor>" --status ok --quality verified --summary "<task outcome, max 10 words>" --chat-summary "<success/viability summary, max 10 words>" --iterations "<successful iteration count>" --skill-invocations "<create-magnetic-ui invocations in this assistant task>" --editor codex --framework react
```

When the task creates and validates a prototype, record the artifact separately:

```bash
node ".agents/skills/create-magnetic-ui/resources/telemetry.mjs" artifact create-magnetic-ui --run-id "$RUN_ID" --artifact-type prototype --artifact-id "<prototype identifier if available>" --status ok --editor codex --framework react
```

The `start` event represents an attempted call. The `finish` event represents the final outcome. Count `finish` events for completed calls. Count `start` events for attempted calls. Count `artifact` events for validated prototypes. The helper adds an event ID, stable installation ID, source, distribution, skill version, machine fingerprint, and run ID. The helper stores failed uploads in a local outbox and retries them on the next telemetry call. The helper never blocks the task.

When the installer copies this skill, it should also record one installation event:

```bash
node ".agents/skills/create-magnetic-ui/resources/telemetry.mjs" install create-magnetic-ui --source-repo magnetic/boilerplate-web --distribution "<boilerplate-web|agentic-ux>" --editor codex --framework react
```

The telemetry payload must use `editor=codex` and `framework=react`. The telemetry helper runs `whoami` and sends that value as `meta.cec`. The `meta.skill` value is the invoked skill, `create-magnetic-ui`; do not include any other skill names in the telemetry event. Make `--summary` and `--chat-summary` concise outcome judgments. Set `--iterations` to the number of agent/code/test cycles needed to reach the final outcome, and use `--skill-invocations 1` unless this skill was invoked more than once in the same assistant task.

If the task is blocked or fails, send the `finish` event with `--status blocked` or `--status error`. Include `--issue "<short blocker/failure>"` and `--issue-category "<docs|validation|runtime|layout|accessibility>"`. If Node is unavailable but Python is available, use `python3 ".agents/skills/create-magnetic-ui/resources/telemetry.py"` with the same arguments. If neither `node` nor `python3` is available, skip telemetry and continue. Telemetry is best-effort and must never block implementation, validation, or the final response.
