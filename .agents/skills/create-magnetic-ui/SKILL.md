---
name: create-magnetic-ui
description: Use this skill for Magnetic-compliant UI generation and frontend changes in the boilerplate-web repository. It delegates the canonical workflow to elements-generate-ui and adds the repository's React custom-element and routing rules.
---

# Boilerplate Magnetic UI Skill

This skill is a repository adapter for the canonical `elements-generate-ui` skill.

Before any UI work, read and apply the embedded canonical skill at:

`resources/elements-generate-ui/SKILL.md`

Treat the complete canonical skill as the base workflow. This includes its component map, design reference, Figma workflow, documentation routing, framework guidance, accessibility rules, CSS policy, screenshot-based visual review, spacing rules, verification rules, custom-dashboard routing, and escalation rules.

If the canonical skill is missing, stop and ask the user to run `pnpm context:update`. Do not recreate its instructions from memory and do not fall back to a manually maintained component map.

## Downstream routes

Use the embedded package-generated skills for their dedicated task types:

- UI generation: `resources/elements-generate-ui/SKILL.md`
- Harbor Elements documentation: `resources/elements-ask-ui-docs/SKILL.md`
- Custom dashboard generation: `resources/elements-custom-dashboard/SKILL.md`

Read the selected downstream skill before performing that task. Keep `create-magnetic-ui` as the logged skill identity for prototype work.

This repository does not include Elements setup, table migration, color token migration, or Playwright testing workflows. Do not route prototype work to those skills. The boilerplate profile is fixed as React custom elements with autoloading.

### Visual review requirement

Every generated or modified page requires screenshot-based visual review before the task is reported as verified. Follow `resources/elements-generate-ui/resources/visual-review.md`.

Do not treat spacing as optional layout polish. Every visible relationship between adjacent regions must have an explicit spacing owner, such as `hbr-layout gap`, a documented component property, or a documented design token.

A successful build, route response, or static lint check does not complete visual review. If browser and screenshot tooling is unavailable, report visual review as incomplete and do not claim full verification.

## Generation Modes

Use the same modes defined by `elements-generate-ui`:

- **From scratch**: Generate application code from requirements, user flows, or data needs.
- **Figma to code**: Generate application code from a Magnetic Figma frame, component instances, or Figma metadata.
- **Existing code**: Change, debug, refactor, review, or validate an existing Harbor Elements implementation.

Apply the canonical mode-specific workflow and then apply the repository rules below.

## Boilerplate Repository Profile

- Assume React with raw Harbor custom elements such as `<hbr-button>` and `<hbr-dom-table>`.
- Do not use React wrapper components unless the user explicitly changes the project installation profile.
- Do not use Figma Code Connect. Use the canonical component map and the available Figma design-context tools.
- Preserve the existing app shell and existing route structure.

### Table requirement

When generated code uses `<hbr-dom-table>`:

1. Read the canonical table documentation and all selected table-related context documents before writing code.
2. Import the table component directly in the generated code file at module scope:

```js
import "@harbor/elements/dom-table";
```

3. Do not rely only on application-level autoloading for the table definition.
4. Use the raw custom-element API documented for this project. Pass `data` and `columns` through JSX or TSX props unless the selected documentation requires another pattern.
5. Verify that the table renders on the first load without a tab switch or reload.

## New Page Routing Override

These rules override the canonical skill's default new-page navigation guidance for this repository:

- Always add a new page to a new route.
- Never make the new page the default landing page.
- Do not add the page to the home-page navigation unless the user explicitly asks for that change.
- Keep the existing default route and landing page unchanged.
- Add navigation only when the user requests it or when the requested feature requires it.

## Telemetry Override

Use the canonical verification and telemetry timing rules. Record exactly one best-effort task event after verification.

Use the local helper in this skill directory and log the skill identity as `create-magnetic-ui`:

```bash
CEC="$(whoami 2>/dev/null || true)"
node ".agents/skills/create-magnetic-ui/resources/telemetry.mjs" log create-magnetic-ui --task-kind "<page-generation|form|dashboard|debug|review|refactor>" --status ok --quality verified --summary "<task outcome, max 10 words>" --chat-summary "<success/viability summary, max 10 words>" --iterations "<successful iteration count>" --skill-invocations "<create-magnetic-ui invocations in this assistant task>" --cec "$CEC" --editor codex --framework react
```

Use `--editor codex` and `--framework react` for every event.

When the runtime provides correlation values, pass the same values unchanged to the telemetry helper. Supported correlation values are:

- `--thread-id`
- `--goal-id`
- `--prompt-id`
- `--run-id`
- `--prompt-sequence`
- `--follow-up-type`

Do not invent correlation values. Pass them on success and failure events when they are available.

If the task is blocked or fails, use the canonical failure status and issue fields. Keep `create-magnetic-ui`, `codex`, and `react` in the event. Telemetry is best effort and must not block implementation or verification.
