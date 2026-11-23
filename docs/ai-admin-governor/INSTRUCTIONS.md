# Instructions — AI workforce supervision version

Updated: 2026-11-20. Status: **Draft working brief.** Read [current outcomes and stories](OUTCOMES-AND-STORIES.md) first, [the proposed visual storyboard](VISUAL-STORYBOARD.md) for the current visual iteration, and [README.md](README.md) for sources and scope. This version adopts the user's primary job: **“Supervise the AI workforce.”**

## Activation and scope

- Apply this file when the user explicitly requests the separate AI Admin / Crosswork AI governor version. Do not silently change the NOC operator experience.
- Current user instructions take precedence. This document does not itself authorize implementation, backend integration, GitHub publication, or deployment. Continue with the requested phase.
- Current outcomes and stories are reviewable hypotheses, not validated requirements or implemented capability. The [objective-led draft](archive/objective-led/README.md) is historical; its landing emphasis is superseded here.
- Preserve the operator dashboard and reference material. When implementation is requested, isolate this version through a separate route or variant consistent with repository routing rules. The final entry mechanism remains open.
- Keep version-specific outcomes, stories, visual storyboards, interaction notes, limitations, and milestones under this directory.

## Persona and north-star outcome

The human AI Admin acts as the **AI workforce supervisor** in everyday use. Their primary job is to understand current agent activity, decisions, corrective work, accountability, unresolved exceptions, and workforce reliability.

> I know what the AI workforce is doing, whether it is operating reliably and within bounds, where my attention is needed, and what resulted from its actions.

Crosswork AI is the software governor. It owns permitted task routing, coordination, dependency handling, recovery, execution follow-up, and result verification. Human decisions concern a precise action, authority boundary, or supported workforce control.

The supervisor does not routinely choose network paths, repair platform credentials, build agents, manually dispatch every task, or approve each autonomous step. Policy authoring, autonomy adjustment, production eligibility, retirement, and detailed audit remain supporting governance journeys, discoverable when relevant.

## Outcome and information responsibilities

Use O1–O8 from the companion document:

1. **Agent activity:** who is working on what; confirmed progress, dependencies, next checkpoints, and wider workload.
2. **Pending approvals:** genuinely policy-required decisions with exact proposal, reason, scope, evidence, limits, and consequences.
3. **Remediation queue:** queued, running, blocked, reconciling, and verifying corrective work; owner, reason, priority basis, and supported next action.
4. **Trust and compliance:** allowed/prevented/requested behavior, potential or confirmed deviations, effective authority, and accountability gaps.
5. **Automated actions:** consequential actions linked to jobs, agents/versions, authority, execution results, and subsequent verification.
6. **Escalations:** unresolved supervisory exceptions after supported governor handling, with a specific decision the person can actually make.
7. **Agent health:** capability/version reliability through observed behavior and affected work; distinguish agent, shared dependency, and job constraints.
8. **Contextual discovery:** relevant Integrations, permitted LLM Configuration, Observability, Agent Catalog, and Help, with clear persistent homes.

These are responsibilities, not a mandate for seven equal tiles or a finalized layout. Network diagnosis and broad business objectives provide job context; do not make the homepage a renamed WAN incident dashboard or an abstract objective portfolio. Likewise, do not lead every visit with policy forms or a feature catalog.

## Landing-page principles

- Show continuous shared work within the person's authorized responsibility, regardless of who initiated it. Do not invent handover ceremonies or reset work on login.
- Lead with meaningful current activity and supervisory exceptions. Agent totals, lifetime action counts, decorative gauges, generic health percentages, and message volume are not the primary value.
- Explain emerging constraints using supported records: retries without advancement, expiring evidence/authority, dependency aging, capability/tool degradation, and incompatible planned actions. Do not fabricate forecasts, confidence scores, progress percentages, or ETAs.
- Distinguish progressing work, a condition the governor is already handling, unresolved risk, and a genuine human decision. Attention does not automatically mean approval or escalation.
- Keep priority, lifecycle stage, uncertainty, agent health, and authorization separate. A healthy agent can own a blocked job; one failed operation does not establish agent failure.
- Keep one linked work identity across activity, approvals, remediation, actions, and escalation views. Do not duplicate jobs or inflate counts because the same work has several inspection paths.
- Keep all work discoverable as volume grows. Aggregate meaningfully while preserving individual records, job identity, priority rationale, and access to details. One selected or successful job cannot hide the rest.
- Use recent actions and results as accountability evidence. Leading signals guide attention; historical results remain useful when they explain current work or support inspection.
- Make discovery operationally relevant and role-aware. Readiness can lead when prerequisites are incomplete; established use centers the workforce and consequential exceptions. Do not force a permanent strip of capability cards.
- Preserve selected work, expanded evidence, focus, and scroll position. New entries can be announced without replacing what is being read or continuously reordering the focused item.
- Make the screen lively through confirmed events: meaningful progress, effective decisions, changed dependencies, adaptations, degraded capability, and verified results. Group repetitive updates into their job. Avoid fictitious traffic, perpetual avatar choreography, or animated waiting that suggests progress.
- Keep essential state readable at rest and under reduced motion. Use short, familiar titles and progressive detail. There is no artificial page-height limit, but the opening picture must be useful immediately.

## Story and evidence rules

- Build from agent → job/task → observed progress or constraint → governor response → any genuine supervisory decision → resulting evidence. Do not let network remediation details become the primary persona narrative.
- Maintain the main story's independent jobs and agents. Never borrow another job's evidence, authority, history, or result. The final state can mix verified, constrained, restricted, and waiting work.
- Show the main story and alternate branches, not a fixed global success clock. Data and actual execution drive transitions.
- An approval identifies the requesting agent/version, job, exact proposal, purpose, resources/action class, validation basis, limits, policy, expiry, alternatives, and effect of retaining the restriction.
- Approval submission, effective authorization, execution start/completion, and verified outcome remain distinct. Changed/expired proposals require renewed applicable checks and valid authority. Narrowing a plan creates a revised proposal, not an unvalidated edit.
- Escalations explain the attempts already made and why permitted handling has not resolved the condition. Crosswork AI retains accountable follow-up; an escalation does not imply automatic transfer to a traffic engineer.
- A new-assignment restriction is separate from agent health, current task ownership, cancellation, or rollback. Show its actual scope, effective state, and supported in-flight treatment.
- Reassignment needs an eligible executor, current authority, and supported checkpoint continuation or safe replay. Preserve attempts, actor/version history, and evidence. Do not assume hot migration or inherited permissions.
- An unknown execution result requires reconciliation before a potentially duplicating write. Original records remain intact. Failed verification leaves work unresolved; supported retry/reversal has its own authority and proof.
- Distinguish a prevented proposal, suspected deviation, confirmed unauthorized action, and insufficient audit evidence. Missing evidence is not proof of a violation; a traceable subset is not global compliance.
- A knowledge-graph relationship can explain a dependency; it does not alone prove a conflict, common cause, or impact.
- Label concept fixtures and target capabilities accurately. Do not invent the meaning of toxic-factor detection, which remains unspecified.

## Visual and interaction direction for later phases

- Derive visual treatment from what the supervisor needs to understand or decide. For each storyboard beat record the event, governor action, visible change, interpretation, optional supervisory action, evidence, motion, and outcome.
- Carry forward Magnetic / One CD midnight, readable typography, semantic states, and restrained blue/violet/pink accents. Standard controls and supported assistant patterns should use documented components.
- Outcome and clarity take precedence over forcing an unsuitable component. Custom workforce, job, or dependency visuals can be appropriate with accessible/readable equivalents. A WAN map or animated constellation is not assumed.
- Keep decorative patterns inset from borders, motion purposeful, and content legible. Do not imply intelligence merely through glow, activity, or agent counts.
- Use the repository UI skill and current component docs when implementation is requested. Verify desktop/responsive behavior, keyboard access, overflow, meaningful transitions, source-state truthfulness, and reduced motion with appropriate checks.

## Open decisions

Detailed information architecture, visual overview, section arrangement, entry route, source schemas, actual enforcement and workforce-control APIs, supported recovery/reassignment, verification criteria, and data availability remain open. Product-wide role defaults beyond this explicitly chosen version also remain open.

The first visual storyboard is now proposed for review. Continue refining its composition, states, and interactions; product implementation begins when requested. Do not present unresolved design or capability assumptions as settled because the narrative is polished.
