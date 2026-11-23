> Historical objective-led draft, preserved for reference. The current workforce-supervision direction is indexed in [the current version brief](../../README.md).

# Instructions — Crosswork AI Admin governor version

Created: 2026-11-19. Status: **Draft working brief, derived from proposed outcomes and stories.** Read [OUTCOMES-AND-STORIES.md](OUTCOMES-AND-STORIES.md) first and [README.md](README.md) for the source register and evidence boundaries.

## Activation and scope

- Apply this file when the user explicitly requests the separate **AI Admin / Crosswork AI governor** version. Do not silently apply its persona or information hierarchy to the NOC operator version.
- Current user instructions take precedence. Treat the proposed stories as reviewable design hypotheses, not validated requirements or proof of implemented capabilities.
- This file does not itself authorize UI implementation, backend integration, GitHub publication, or deployment. Continue with the phase the user requests.
- Preserve the existing operator dashboard and its reference material. When implementation is requested, isolate this version through a separate route or variant consistent with the repository's routing rules. The final entry mechanism remains undecided.
- Store future outcomes, story revisions, visual storyboards, interaction notes, limitations, and milestones under this directory so the version remains recoverable and understandable.

## Persona and product roles

The **human AI Admin** sets and supervises the mandate: autonomy, guardrails, data/tool access, production eligibility, restriction/retirement, and auditability.

**Crosswork AI is the software governor.** Within its actual authority and capabilities, it coordinates agents and tasks, manages dependencies and incompatible actions, adapts plans, follows execution, and verifies objective outcomes.

Keep these roles distinct. The admin does not routinely dispatch specialists, choose SR candidate paths, diagnose router faults, repair platform certificates, or build agents. Agent Developer, Platform Admin, and NOC Operator responsibilities remain separate. They can appear as context or an accountable prerequisite owner, not be silently assigned to this persona.

## North-star outcome

> The AI Admin understands whether delegated work is progressing within its mandate, what could prevent success, what Crosswork AI is doing about it, and which decisions require their authority.

Use O1–O8 in the companion document as the outcome reference: work understanding, emerging constraints, coordination, precise authority, production readiness, verified achievement, allowed-versus-actual proof, and relevant discovery.

## Landing-page principles

1. **Show continuous shared work.** Objectives and their evidence persist across people and sessions. Do not invent a shift-handover ceremony, reset work on login, or limit the picture to tasks personally created by the current admin.
2. **Lead with useful current state.** Explain objectives, meaningful progress, constraints, and the next checkpoint. Inventory counts, lifetime totals, decorative gauges, or a roster of online agents must not be the landing page's primary value.
3. **Bring emerging constraints forward.** Use evidence such as conflicting planned write scopes, expiring input validity or authority, dependency aging, repeated attempts without progress, and inconsistent observations. Explain the affected work, basis, uncertainty, and governor response. Do not fabricate a risk score, forecast, completion percentage, or ETA.
4. **Make coordination inspectable.** Show consequential sequencing, permitted reassignment, plan revision, and revalidation with short reasons and supporting records. A typed graph relationship does not by itself prove a conflict or common cause.
5. **Separate awareness from decisions.** A handled coordination event may only need a concise update. Surface a human task when their actual authority is required, with bounded options and consequences. Do not insert routine approval at every autonomous step.
6. **Keep the whole workload legible.** Support simultaneous objectives in different states. Priority, lifecycle stage, uncertainty, and policy status are separate dimensions. One selected or successful objective must not hide unresolved work elsewhere.
7. **Keep capabilities discoverable.** Provide clear, role-appropriate homes and useful contextual entry points for Integrations, LLM Configuration, Observability, Agent Catalog, and Help. Setup-incomplete states can emphasize readiness; established use emphasizes work and consequential exceptions. Do not assume the final solution is a permanent bank of discovery cards.
8. **Use evidence to establish achievement.** Agent activity, task completion, controller execution, and verified objective result remain distinct. Historical results support audit and learning; current and leading signals guide landing-page attention.
9. **Keep the experience stable as it updates.** Preserve selected work, expanded evidence, keyboard focus, and reading position. New updates can be announced without automatically opening a different objective or continuously reordering the item being read.
10. **Make it lively through meaning.** Use brief local motion for confirmed evidence arrivals, dependency changes, adaptations, and verified results. Avoid fictitious traffic, perpetual agent choreography, and predetermined success animation. A static view and reduced-motion mode must still communicate the full state.

## Governance and evidence boundaries

- Authority requests identify purpose, objective, agent/version, capability/action class, data/resource scope, proposed duration/expiry, policy, alternatives, and the consequence of retaining the boundary.
- Respect the effective permissions and policy version applicable at action time. Viewing a request is not consent; a UI decision is not proof that a permission/deployment change took effect.
- Refusal or retained limits leave the affected step constrained with ownership, allowed work, and a supported next checkpoint. Unrelated work continues where permitted.
- Support proactive autonomy policy setting per agent/version, action class, and scope as well as reactive exceptions. Explain affected work and effective policy/version; changes do not retroactively rewrite authority or broaden unrelated permissions.
- An alternative source must already be authorized and suitable for the required scope, meaning, freshness, and consistency. Otherwise explain the constraint or genuine authority request.
- A controller result that is unknown needs reconciliation before another potentially duplicating write. Preserve original records and the provenance of subsequent findings.
- Failed verification keeps the objective unresolved. Recovery/reversal needs its own actual support, authority, execution record, and verification.
- Promotion and retirement preserve version-specific evidence and active task continuity. Do not assume hot replacement, permission inheritance, or that pausing means cancellation or rollback.
- Audit can connect objective → tasks and agent versions → authority/policy at action time → evidence and decision → tool action → result → verification. Missing links stay explicit. A traceable subset does not establish global compliance.
- Distinguish a confirmed boundary violation from an audit gap or suspected discrepancy. Preserve evidence, show supported containment of further affected actions and actual in-flight status, and expose the admin's precise restriction/retirement decision when warranted. Do not claim automatic rollback or compliance from incomplete records.
- Knowledge-graph relationships support inspection of dependencies and context; they are not sufficient evidence of causal impact.
- Do not invent the meaning of “toxic-factor detection”; its semantics remain unspecified in the supplied context.
- Label concept fixtures and proposed capabilities accurately. The existing deterministic app is not proof of a production governor or general-purpose autonomous planning backend.

## Story and visual development

- Begin with the outcome and story situation; derive visual treatment from what the admin must understand or decide. Do not start by arranging cards for every product feature.
- Maintain separate objective/task identities through the main concurrent-work story. Never borrow another objective's evidence, permissions, job history, or outcome.
- Use the main narrative plus companion scenarios S1–S8. Avoid putting every failure and governance exception into a single artificial timeline.
- For each visual story beat, record: trigger/current state; governor action; what becomes visible; admin interpretation or decision; relevant evidence; motion/interaction; and resulting user outcome.
- Pressure-test quiet readiness, many simultaneous objectives, incompatible planned actions, weak/conflicting evidence, retained/granted boundaries, agent promotion/retirement, unknown execution, failed verification, and recurrence.
- Section names should usually be one or two familiar words. Explain the situation before exposing detailed agent or platform mechanics. Chat and task traces are contextual inspection tools, not mandatory navigation for every job.
- There is no first-fold-only or artificial page-height constraint. Still make the opening picture useful immediately and use progressive detail to prevent clutter.
- The final overview could show work and dependencies. Reuse of the operator's geographic WAN map is not assumed.

## Design-system direction for later implementation

- Carry forward the Magnetic / One CD midnight language and restrained blue, violet, and pink accents. Keep text, contrast, and state meaning clear.
- Use the repository's documented Magnetic/Harbor components for standard controls and supported patterns. Prefer the documented Magnetic AI Assistant components when an assistant is included; verify availability and report gaps rather than inventing APIs.
- Outcome and clarity take precedence over forcing a component that does not fit. Custom work/dependency visuals are allowed with accessible, readable equivalents and theme-aware styling.
- Dots, glow, gradients, and motion are supporting visual decisions, not proof of intelligence or mandatory copies of the operator page. Keep decorative patterns away from borders and content legible.
- When implementation is requested, read the repository UI skill, current component documentation, and local routing instructions. Visually review desktop/responsive states, keyboard use, overflow, meaningful transitions, and reduced motion. Match tests to actual logic and risks.

## Decisions still open

- Detailed information architecture, overview representation, section arrangement, and route/entry mechanism.
- Exact task/objective schemas, policy enforcement APIs, supported agent reassignment/retirement semantics, and real data availability.
- Product-level role defaults beyond this explicitly chosen AI Admin version.
- Which proposed leading signals and verification criteria can be supported by target-system evidence.

Do not present these open decisions as settled because they appear in a polished story. Continue from the companion outcomes and stories when the user reviews or revises the direction.
