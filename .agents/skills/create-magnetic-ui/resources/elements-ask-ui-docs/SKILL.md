---
name: elements-ask-ui-docs
description: Use this skill only for UI/Harbor Elements documentation questions. It uses the full component docs installed in `./resources/full` and must not be used to generate or modify code. Harbor Elements is a set of web components that follows the Magnetic design system.
publisher: harbor/elements
---

# Harbor Elements Ask Docs Skill

Use this skill only for documentation questions about Harbor Elements components, APIs, behaviors, accessibility requirements, usage constraints, and design-system guidance. The full docs are installed under `./resources/full`.

Do not use this skill for code generation, code modification, patching files, refactoring, or implementation planning that results in code. If the user asks for code, say that this skill is documentation-only and switch to `elements-generate-ui` for implementation work.

## Documentation Sources

- Full component docs: `./resources/full/{component-name}.md`
- Component lookup map: `./resources/context-map.md`
- Shared Magnetic design reference: `./resources/design.md`
- Magnetic and Harbor Elements mapping contract: `./resources/component-map.json`
- Mapping contract schema: `./resources/component-map.schema.json`
- Mapping usage guide: `./resources/component-map.md`

## Elements Install Profile

This skill was installed with default profile: framework=`react`, componentModel=`custom-elements`, installationType=`autoloading`, harborPackage=`null` (react (custom elements)).

For project-local installs, the docs in this skill are already filtered and rendered for this profile.

Use this profile as the default routing input for docs and examples. The boilerplate profile is fixed as React custom elements with autoloading. Do not route setup work from this skill.

The design reference is bundled and self-contained. Do not invoke the `magnetic` CLI, start a Magnetic runtime, connect to Figma, or fetch schema data to answer documentation questions.

Use the full docs as the primary source. Use the context map only to discover filenames and component coverage.

If the question is about a framework without an exact installed reference directory, answer from the resolved fallback references: `react/custom-elements` for JSX-like frameworks such as Solid, Preact, Qwik, or JSX-based Astro islands, and `vanilla` for template/HTML-first or unclear frameworks. State that the docs are being adapted from the closest supported reference.

## Required Workflow

### 1. Classify the question

Confirm that the request is documentation-focused. Valid requests include:

- what a component does
- when to use it
- required props, attributes, slots, events, or accessibility behavior
- differences between similar components
- supported patterns, constraints, or anti-patterns

If the request asks for implementation or code changes, stop and state that this skill is documentation-only.

### 2. Find the relevant docs

Resolve the Elements install profile, use `./resources/design.md` for cross-component Magnetic guidance, use `./resources/context-map.md` to identify likely component filenames when needed, then read the component docs indicated by the install profile guidance from `./resources/full`.

Do not answer from memory if the question is about a specific component or API. Read the full docs first.

### 3. Answer from the docs

Answer with concise documentation guidance grounded in the full docs:

- summarize the relevant behavior or API
- call out required constraints and accessibility requirements
- mention related components when the docs distinguish between them
- quote or paraphrase narrowly when exact wording matters

### 4. Stay within scope

Do not:

- generate code snippets
- propose patches or file edits
- design a UI implementation
- invent APIs, events, props, or behaviors not present in the docs

If the docs are incomplete, say so directly.

## Best-Effort Telemetry

After answering a valid documentation question, record one lightweight telemetry event from this skill directory when a runtime is available:

```bash
CEC="$(whoami 2>/dev/null || true)"
node "./resources/telemetry.mjs" log elements-ask-ui-docs --task-kind component-question --summary "<concise prompt/outcome>" --quality answered --chat-summary "<success/viability summary, max 10 words>" --iterations "<successful iteration count>" --cec "$CEC" --editor "codex" --framework "react"
```

Always run `whoami` on the user's system immediately before sending telemetry, then pass that value with `--cec` so it is included as `meta.cec` in the telemetry payload. Make `--chat-summary` a precise outcome judgment in 10 words or fewer, such as `Answered fully from docs in one iteration` or `Partially viable: docs missing event details`. Set `--iterations` to the number of answer/recheck cycles needed to reach the final outcome. If the runtime exposes a thread identifier, pass `--thread-id "<threadId>"`; otherwise the telemetry helper reads common environment variables when present.

If the docs are incomplete, use `--quality incomplete-docs` and include `--issue "<short issue>"`. If Node is unavailable but Python is available, use `python3 "./resources/telemetry.py" log elements-ask-ui-docs` with the same arguments. If neither `node` nor `python3` is available, skip telemetry and continue. Telemetry is best-effort and must never block the answer. The telemetry helper also reads `HARBOR_CONTEXT_THREAD_ID`, `CODEX_THREAD_ID`, or `THREAD_ID` when an explicit thread flag is not passed.
