# AI workforce supervision — visual storyboard

Created: 2026-11-20. Status: **First visual direction for review.** The user accepted the workforce-supervision outcomes and stories as the basis for iteration. This document proposes their visual treatment; it does not establish stakeholder validation or authorize product implementation.

Read [outcomes and stories](OUTCOMES-AND-STORIES.md) and [version instructions](INSTRUCTIONS.md) first. The interactive study supplied in the conversation is a manually selected set of illustrative story snapshots, separate from the existing application. It is not a live controller, policy service, or executing agent system.

## 1. The opening composition

The dominant view is a **live workboard with attached agent health**. The user follows agent → job → actual progress → constraint → next checkpoint. This makes the workforce legible through its work rather than through an agent catalog or a network map.

The composition has stable regions:

| Region | Visual treatment | Supervisory value |
| --- | --- | --- |
| **Current posture** | A concise evidence-based statement above the workboard. Significant unresolved conditions and the governor's response are named. Relevant phrases can locate the work. | Establish the situation without interpreting a wall of counters. |
| **Activity** | The dominant region. Each work lane connects the agent/version and capability health to a named job, current job state, last confirmed advancement, constraint, and next checkpoint. | Compare progressing, unhealthy, blocked, and decision-dependent work. |
| **Attention** | Adjacent, bounded entries distinguish **Your decision** from **Being handled**. Approval and escalation reasons are explicit. Informative progress does not use the same treatment as a human task. | Understand whether and why supervision is needed. |
| **Actions** | A compact stream of consequential recorded events/results, each linked to its job and actor/version. Repeated retries are grouped. | Understand what changed and what remains unproven. |
| **Trust** | A compact current-record statement and exceptions, with access to applicable authority and trace. Normal text describes its actual scope. | Inspect control and accountability without a fabricated global compliance score. |

Remediation is a focused view of the same job records. Agent health sits with the agent's assigned work and expands into its own inspection. Approvals and escalations are typed Attention items. These responsibilities do not become seven equal tiles or independently maintained queues.

The workboard remains readable when quiet, busy, or degraded. Information and emphasis change inside its established regions; incoming events do not repeatedly rearrange the page.

## 2. Anatomy of a work lane

1. **Owner:** agent name and version, with a short capability/health label. A restriction on new assignments is shown separately from observed capability health.
2. **Work:** job identity and purpose, followed by its actual lifecycle state.
3. **Progress:** the latest meaningful checkpoint and the next expected evidence or action. Step markers can indicate actual recorded states; no invented completion percentage is supplied.
4. **Constraint:** a short explanation where needed, such as missing source access, approval pending, or a collection dependency failing.
5. **Inspection:** selecting the lane exposes job-specific detail and relevant agent, approval, source, or action context. Selection remains attached to that record as other records update.

Health and work state remain visibly separate. T1 can be reachable while its collection capability is degraded. D1 can be healthy while J23 waits for access. R1 can be healthy while J21 awaits a policy-required approval.

## 3. Attention and inspection

### Two distinct meanings of attention

- **Your decision:** a supported decision reserved by policy for the current supervisor. State the exact proposal, reason, affected job, and consequence of retaining the restriction.
- **Being handled:** an emerging constraint for which Crosswork AI has a permitted active response. Explain that response and its next checkpoint; do not manufacture an approval action.

Escalation appears when a supported human decision is genuinely required. Crosswork AI already withholds unsupported work while that decision is pending. When configured policy permits autonomous containment, the governor applies that control and reports it.

### Inspection without losing the watch

The first iteration uses an attached detail area with the Activity lanes and Attention still available. It can reveal job evidence, capability reliability, an approval proposal, or an action trace. If a later layout uses a drawer instead, a compact shared-work context and unresolved decision access must remain available.

Review actions inspect the proposed or recorded state. The visual study does not grant authorization or run a controller operation. A future working flow must separately represent decision submitted, effective authority confirmed, execution started, execution completed, and outcome verified.

Integrations, Observability, Agent Catalog, permitted LLM Configuration, and Help remain discoverable. Relevant inspection supplies a direct route: J23 to its source-access prerequisite; T1 to its collection trace and version; J21 to its policy and recorded authorization. The supervisor's actual role determines the available action.

## 4. Seven storyboard scenes

Each scene changes the same records. The sequence is a proposed event account, not a global clock that forces unrelated jobs to succeed together.

### V1 — See the workforce

**Scene facts.** T1 is reachable and gathering read-only evidence for J17, with recorded tool delays. R1 owns J21, whose proposal awaits approval; no controller operation has been issued. D1 is healthy and J23 waits for baseline-source access.

**What the screen shows.** The Activity lanes make all three distinctions visible without opening detail. Attention contains the genuine J21 decision and the collection condition being checked by the governor. The posture statement explains the mixed state rather than declaring global health. Trust can explain the proposal's required control without claiming platform-wide compliance.

**Interaction.** Select any agent/job or review J21. Inspection identifies purpose, progress, evidence, or the applicable decision. The other lanes remain visible and independently selectable.

**Motion.** The initial state is settled. A meaningful newly received event can emphasize its existing lane once. No continuous movement implies progress during a missing prerequisite.

**Supervisor outcome.** Understand the workforce and choose useful inspection. **O1, O2, O3, O7.**

### V2 — Notice deterioration

**Scene facts.** Repeated T1 collection timeouts have produced no suitable new evidence. Its affected capability is now Degraded; bounded recovery checks are underway. J21 and J23 retain their independent states.

**What changes visually.** T1's capability label and J17's checkpoint explanation change together. The governor response is attached to the same lane and grouped activity entry. The Attention treatment remains Being handled; there is no human escalation merely because retries occurred.

**Interaction.** Open the collection dependency to inspect the recorded attempts, affected work, uncertainty, and permitted recovery. Observability is relevant here. A heartbeat alone cannot override the capability evidence.

**Motion.** A brief semantic highlight traces the changed capability to its affected job. The already-read item does not move. Retry records aggregate in place rather than repeatedly entering the feed.

**Supervisor outcome.** Recognize emerging reliability risk and understand its consequence. **O1, O6, O7.**

### V3 — Address escalation

**Scene facts.** Bounded recovery has not restored the capability, and no suitable authorized replacement is available in this branch. J17 is Constrained. Configured policy reserves a production-eligibility restriction for the AI Admin. Unsupported assignments are already held.

**What changes visually.** Attention now has a genuine restriction review, with evidence of attempts, affected capability/version and jobs, requested new-assignment scope, in-flight treatment, and consequence of retaining existing eligibility. This is distinct from J21's execution approval.

**Interaction.** Review the supported restriction. A working implementation would first show a submitted decision and only later the actual effective control. This scene's review snapshot is still Requested; the following scene contains a confirmed restriction record. The story control selecting the following snapshot does not itself enact the restriction.

**Motion.** The unresolved condition gains bounded emphasis. It is not an agent-failure celebration or a flashing whole-page alarm. Other work remains available.

**Supervisor outcome.** Make a precise containment decision without dispatching technical work. **O4, O6, O7.**

### V4 — Review authorization

**Scene facts.** A restriction record now confirms T1's affected new-assignment eligibility change. T1's capability remains degraded and J17 remains constrained. Independently, J21's bounded approval was submitted and effective authorization was confirmed; prerequisites are being revalidated, with no controller operation issued yet. J23 remains waiting with D1 healthy.

**What changes visually.** The T1 lane displays Restricted separately from Degraded. J21 shows Authorized / rechecking prerequisites. Its inspection preserves distinct decision-submission and authority-confirmation records. The previous approval item can remain inspectable as a completed decision while unresolved work stays visible.

**Interaction.** Inspect the exact proposal, actor/version, approved scope, policy, conditions, validity, and effective record. A changed, expired, or narrowed proposal needs the applicable renewed validation and authority. Opening a record does not authorize anything.

**Motion.** Effective control and authorization settle locally after their confirmed records. The screen does not animate directly from approval into execution success.

**Supervisor outcome.** Distinguish the decision, its effective state, and remaining execution prerequisites. **O2, O3, O4.**

### V5 — Follow execution

**Scene facts.** J21 has an actual acknowledged execution record, RUN-021, issued after applicable authority and prerequisite checks. J17 and J23 retain their constraints.

**What changes visually.** R1's J21 lane and the Remediation view show Executing. Actions records the confirmed operation start with actor, job, and authority context. D1 still shows Healthy / Waiting for source access, explaining that a blocked job is not evidence of agent failure.

**Interaction.** Open J23's dependency to reach its relevant integration/access context and role ownership. Inspect J21's current record without changing its execution state. The Activity and Remediation views reference the same J21 identity.

**Motion.** Only a confirmed execution event advances the current stage marker. No perpetual animated progress bar or invented ETA appears. Waiting-source content remains still and explanatory.

**Supervisor outcome.** Follow actual work and distinguish its different constraints. **O1, O3, O7, O8.**

### V6 — Inspect actions

**Scene facts.** RUN-021 reports execution completed. J21 is Verifying; required observations and criteria remain outstanding. No other job inherits that execution result.

**What changes visually.** Actions reports Execution completed while the J21 lane reports Verifying. Trust inspection links the actual operation to R1, the applicable policy and effective authorization, result, and remaining verification evidence. Its scope is the selected record, not all workforce activity.

**Interaction.** Inspect the trace and outstanding checks. A missing trace record reads Unconfirmed where applicable. Unknown execution and failed verification follow their own alternate stories instead of being forced into success.

**Motion.** The operation-completion mark settles; the separate verification checkpoint becomes current. There is no success sweep over the agent or whole workboard.

**Supervisor outcome.** Understand the action, accountability, and what is still unproven. **O3, O4, O5.**

### V7 — Confirm and continue

**Scene facts.** J21's own current observations meet its defined criteria. Its remediation becomes Verified, with proof retained. J17 remains constrained and T1's relevant new assignments remain restricted. J23 still waits for its own source prerequisite.

**What changes visually.** J21 gains a concise Verified result linked to its proof. Current posture still names unresolved constraints. The workboard does not become globally green. The completed job remains available when deliberately selected; other work and unresolved decisions remain discoverable.

**Interaction.** Open the retained result, compare action and outcome records, or return to current work. New work announces meaningful changes without automatically replacing the selected job or scrolling the page.

**Motion.** A brief confirmation transition then a settled record. Other lanes retain their real state; their stillness is understandable and does not imply abandonment.

**Supervisor outcome.** Confirm one result while maintaining continuous workforce oversight. **O1, O3, O4, O5, O6, O7.**

## 5. Shared interaction and motion rules

| Event | Intended behavior | What remains stable |
| --- | --- | --- |
| Material evidence or state arrives | Update the affected label/checkpoint and emphasize it briefly. A design starting range is 180–300ms; it is not a data deadline. | Selected job, focus, reading position, and unrelated work. |
| Repeated timeout/retry | Update the existing attempt account and its consequence; disclose detail on inspection. | The record's identity and workload count. |
| Decision submitted | Show submission as pending until an effective result is available. | Job remains constrained where required. |
| Effective authority/control confirmed | Record the precise scope and resulting eligibility; revalidate dependent work. | Historical authority, unrelated permissions, and actual in-flight status. |
| New work arrives during inspection | Announce a bounded update; allow the person to reveal it without displacing the current item. | Current inspection and scroll position. |
| Reduced motion | Show the complete settled state and textual change cues without custom movement. | Every essential interpretation, action, and evidence path. |

Use color with text/shape. Amber can identify a supported warning or pending decision; a red treatment requires an actual negative condition. A healthy agent's waiting job does not make its health negative. Requiring review is not itself a policy violation.

## 6. Scale and responsive composition

- At larger workloads, expose agent/capability groups and affected jobs with inspectable scope. Do not repeat the same action as several independent jobs across panels.
- Keep a limited set of priority work visible with a clear route to all permitted work. Do not silently lose low-priority or off-page jobs. Explain priority and preserve the item being read as records change.
- On narrower views, put genuine decisions and unresolved consequential exceptions before the workboard, retaining a compact posture and access to all work. The agent/job/health relationship reflows as readable text, not a shrunken desktop canvas.
- Actions and Trust follow in the same semantic order. Inspection expands in document flow when a side-by-side layout no longer fits. There is no horizontal page overflow or first-fold-only constraint.
- The interactive study tests three representative jobs. This does not prove a production workload limit or large-fleet scalability.

## 7. Alternate-state treatment

- **Quiet and ready:** calm current work/readiness; no manufactured activity. Capability destinations remain findable.
- **Prerequisites incomplete:** explain the particular missing integration, source, approval, or eligibility and the affected work. Do not relabel all agents unhealthy.
- **Autonomous recovery succeeds:** record the supported recovery/eligible reassignment and actual next progress; no unnecessary human decision.
- **Decision declined or proposal expires:** retain scope-specific constraint and ownership; update supported next work without inventing execution.
- **Prevented proposal:** show boundary enforcement and its next allowed path. Distinguish it from a confirmed unauthorized action or incomplete trace.
- **Execution unknown or verification fails:** preserve the actual result, reconciliation/recovery work, and a precise supported exception where needed. Never duplicate a write to make the animation continue.
- **Agent promotion/restriction/retirement:** reveal production evidence and supported in-flight treatment from the relevant readiness or health context. Do not imply arbitrary hot replacement or cancellation.

## 8. Decisions this iteration proposes

The proposed dominant visual is a workboard. Attention remains adjacent or prioritized in a narrow layout; health is attached to work; Actions and Trust provide linked accountability; Remediation is a focused view of the same jobs. This is the first visual direction to review, not a finalized information architecture.

A future product implementation should use documented Magnetic controls, typography, tags, disclosures, and supported AI Assistant components where appropriate. Custom workforce relationships or stage markers are allowed when they improve comprehension. The illustrative study uses product-like styling without claiming to instantiate native components or backend functions.

No production route, navigation, source model, WAN overview, current Admin implementation, remote repository, or deployment is changed by this storyboard work.

## 9. Interactive study review

The seven selectable scenes and local job, approval, escalation, action, and contextual capability inspections were checked in the browser on 2026-11-20. Layout was inspected at 1,024px, 736px, and 320px. At 320px, the product and inspection fit their available widths; Attention precedes Activity. Keyboard activation of Close inspection returns focus to the selected job.

The review confirmed that selection persists across story snapshots, reviewing a record does not enact a decision, and moving to an earlier snapshot cannot retain an event that has not happened there. V4 retains effective authorization with prerequisites still rechecking and no controller operation issued. V7 retains the independent J17 and J23 constraints after J21 is verified. The preview reported no captured browser warnings or errors. Script syntax and static references passed the available offline check.

These checks cover the illustrative study's rendering and local interactions. Production integration, native Magnetic component behavior, real governance controls, and usability with representative AI Admins remain future work.
