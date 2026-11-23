# AI workforce supervision — outcomes and stories

Updated: 2026-11-19. Status: **Proposed experience for review.** The primary direction is the user's clarification: **“Supervise the AI workforce.”** Read [the version context](README.md) for sources and scope. The earlier objective-led draft is [preserved separately](archive/objective-led/OUTCOMES-AND-STORIES.md).

## 1. The persona's daily job

The AI Admin acts as the **AI workforce supervisor** in everyday use. They need to understand agent activity, pending approvals, remediation work, trust and compliance, automated actions, escalations, and agent health. Deep policy administration, model configuration, agent evaluation, and audit inspection support this daily supervision; they do not lead every landing-page journey.

Crosswork AI is the software governor. It owns permitted coordination, task routing, dependency handling, recovery attempts, execution follow-up, and verification. The supervisor makes the specific decisions that require their authority and understands the consequences. They do not routinely dispatch specialists, choose network paths, repair platform infrastructure, or approve every autonomous step.

**Primary outcome**

> I know what the AI workforce is doing, whether it is operating reliably and within bounds, where my attention is needed, and what resulted from its actions.

The landing picture is continuous and shared within the person's authorized responsibility. Work can have started before they arrived, been initiated by another person, or been started autonomously. Login and operator changes create no new handover workflow and reset no jobs.

### Working vocabulary

| Object | Meaning |
| --- | --- |
| Agent | A named capability/executor with an identity, version, eligibility, permissions, and observed reliability. An agent can be healthy while a job it owns is blocked. |
| Job | A tracked work item, such as an investigation, assessment, or remediation, with purpose, scope, accountable owner, state, dependencies, and result. |
| Task/attempt | A bounded step or attempt inside a job. Repeated attempts retain their own records and do not become separate successful jobs. |
| Action | A consequential operation performed or proposed by an agent through a tool or controller. Action status remains separate from job outcome. |
| Approval | A specific decision required by the configured policy for a proposal. It is not an acknowledgement of an informative update. |
| Escalation | An unresolved supervisory exception with a clear reason, affected work, attempts already made, and supported decision. It is not automatic transfer to a network engineer. |
| Verification | Case-specific evidence establishing whether the intended result occurred. Task completion or a controller success record alone is insufficient. |

The seven areas below are information responsibilities, not a requirement for seven equally sized cards. Their hierarchy, representation, and layout remain open for visual storyboarding.

## 2. Detailed user outcomes

### O1 — Understand agent activity

**User statement:** “I can see who is working on what, where meaningful progress is occurring, and which work deserves inspection.”

**What the supervisor needs to understand**

- The agent and version accountable for a job, its purpose, current stage, dependency, and next meaningful checkpoint.
- The latest confirmed advancement, such as required evidence obtained or a proposed action validated, rather than a stream of messages.
- Which agents or jobs are related, and which remain independent.
- The wider workload while inspecting one item, including work initiated by others.

**Supervisory decision:** Inspect the relevant agent/job or continue the wider watch. Normal progress does not create an approval task.

**Leading value:** Repeated attempts with no new evidence, an aging dependency, or loss of advancement at an expected checkpoint can become visible before the job fails. Any time expectation needs a declared rule or supporting baseline; age alone is not proof of a fault.

**Example:** “Network Troubleshooter T1 is gathering evidence for J17. The required tool has timed out repeatedly; Crosswork AI is checking the dependency.”

**Experience proof:** The supervisor can explain the current work and next checkpoint without opening every agent conversation. A local update marks an actual state change; a frequent heartbeat does not animate as task progress.

### O2 — Resolve pending approvals confidently

**User statement:** “I know which decisions genuinely need me, why they are required, and what I am authorizing.”

**What the supervisor needs to understand**

- The requesting job and agent/version, exact proposed action, purpose, affected resources, validation evidence, and policy requiring approval.
- The proposal's limits, relevant risks and uncertainty, conditions, duration/expiry, alternatives, and consequence of waiting or declining.
- Whether the proposal has changed since review and whether authorization actually became effective.

**Supervisory decision:** Permit the bounded proposal, retain the restriction, or request missing decision evidence through a supported workflow. Narrowing scope creates a revised proposal that must be revalidated; it is not an unvalidated inline edit to an approved plan.

**Leading value:** An impending validity deadline or approval dependency becomes meaningful when its consequence for the job is supported. An old approval is not automatically urgent, and a handled governor update is not an approval request.

**Example:** “Remediation J21 requires approval for this declared action and scope because it falls outside the configured unattended-action set. No controller operation has been issued.”

**Experience proof:** The supervisor can explain the exact decision and consequences. Submitting approval, effective authorization, starting execution, and successful completion are visibly distinct.

### O3 — Keep remediation work moving

**User statement:** “I can tell which corrective jobs are progressing, what is preventing others, and whether intervention is necessary.”

**What the supervisor needs to understand**

- Jobs that are queued, awaiting approval, running, blocked, reconciling, or verifying, with an accountable agent and reason for the state.
- The actual dependency behind a wait, such as evidence, resource contention, permission, tool availability, or a preceding action.
- Crosswork AI's current recovery or coordination response, remaining alternatives, and next supported checkpoint.
- The reason for relative priority, rather than assuming the longest queue or oldest job is necessarily most urgent.

**Supervisory decision:** Follow a job, inspect a constraint, or address a specific supported exception. Routine dependency management stays with Crosswork AI.

**Leading value:** Incompatible planned actions, persistent lack of progress, a prerequisite approaching expiry, or repeated unsuccessful recovery can reveal exposure before an execution failure. A large queue alone does not establish a problem.

**Example:** “J21 is ready for its bounded approval. Another remediation is waiting for a resource reservation; the governor has sequenced the work and recorded its release condition.”

**Experience proof:** The queue explains why work is waiting and what happens next. A healthy agent's blocked job is not automatically labelled an agent failure. A completed operation can remain in verification.

### O4 — Understand trust and compliance now

**User statement:** “I can tell whether the workforce remains under control and inspect any exception or gap in accountability.”

**What the supervisor needs to understand**

- Whether a planned action is allowed, awaiting a policy-required decision, or prevented by an enforced boundary.
- A prevented request, suspected deviation, confirmed unauthorized action, and missing audit evidence as distinct conditions.
- The policy/version and effective authority applicable to an actual action, including scope and timing.
- Which work is affected by an unresolved discrepancy and what containment or reconciliation Crosswork AI has actually performed.

**Supervisory decision:** Inspect evidence, retain or adjust a supported boundary, or restrict an affected agent/capability when warranted. Deep policy authoring and compliance reporting remain available as supporting work.

**Leading value:** Expiring authority, a missing required trace before execution, or a planned scope mismatch can be detected before another action. A violation already detected is still important current evidence, even though it describes a past action.

**Example:** “An out-of-scope proposal was prevented; no tool operation was issued. A separate action has an incomplete authority trace, so its compliance status is unconfirmed.”

**Experience proof:** The supervisor can distinguish enforcement working from a real control failure. No unsupported global compliance percentage or all-clear is derived from a subset of records.

### O5 — Understand automated actions and results

**User statement:** “I know what the AI workforce changed, what resulted, and what follow-up remains.”

**What the supervisor needs to understand**

- Consequential findings/actions linked to the job, task/attempt, agent/version, applicable authority, execution result, and subsequent verification.
- Completed, failed, unconfirmed, verifying, and verified states, with source times and evidence.
- How a retry, reconciliation, or recovery relates to the original action without rewriting or duplicating its history.
- A meaningful recent conversation when it helps resume or inspect that job, with its context and evidence retained.

**Supervisory decision:** Inspect the action/result, follow remaining verification, or examine a consequential adverse or unconfirmed result. This is not a raw tool-call stream.

**Leading/current value:** Incomplete verification or a newly observed adverse effect can require follow-up. Executed actions remain useful accountability evidence; lifetime action totals do not become the landing page's primary signal.

**Example:** “J21's controller operation completed. The remediation is verifying its expected effect; no verified result is claimed yet.”

**Experience proof:** The supervisor can trace what happened and what it established without reconstructing several agent chats. A short state transition follows a confirmed record rather than a scripted success animation.

### O6 — Address genuine escalations

**User statement:** “I can recognize when Crosswork AI needs my decision, understand what it already tried, and take the appropriate supervisory action.”

**What the supervisor needs to understand**

- The unresolved condition, affected agent/capability and jobs, observed consequence or uncertainty, and why existing permitted paths have not resolved it.
- Recovery attempts, authorization or capability limits, available alternatives, and the exact decision within their role.
- What Crosswork AI continues to own, treatment of in-flight work, and the next supported check after the decision.

**Supervisory decision:** Exercise a supported control such as restricting new assignments to an affected version/capability, retaining a boundary, or authorizing a bounded change. The supervisor does not become the technical dispatcher or network engineer.

**Leading value:** The governor can surface unresolved lack of progress before downstream jobs fail. A failed attempt already being recovered does not automatically create a human escalation.

**Example:** “T1's collection capability remains unavailable after bounded recovery checks. No suitable authorized replacement is available. Review a restriction on new assignments to this capability while Crosswork AI retains the affected work.”

**Experience proof:** The escalation names a decision the person can actually make. Restriction does not claim to cancel a running operation, repair the agent, or resolve the blocked job.

### O7 — Understand agent health through affected work

**User statement:** “I know which agents can be relied on, which capabilities are deteriorating, and how that affects the work.”

**What the supervisor needs to understand**

- Agent/version availability, capability-specific reliability, last meaningful successful progress, and the jobs depending on the affected capability.
- Whether evidence points to an agent problem, a shared tool/model/source problem, or a job-specific constraint; uncertainty remains explicit.
- Recovery, failover, new-assignment restrictions, and eligibility decisions that the governor has actually confirmed.

**Supervisory decision:** Inspect reliability evidence, follow recovery, or use a supported restriction/production-readiness control. Agent evaluation, deployment, and model settings are supporting destinations where relevant.

**Leading value:** Repeated tool failures without advancement, deteriorating source/model availability, or a dependency affecting several jobs can reveal risk before an agent becomes completely unavailable. One unsuccessful job alone does not establish that the entire agent is unhealthy.

**Example:** “T1 remains reachable, but its required collection capability is degraded. D1 is healthy; its assessment is waiting for source access.”

**Experience proof:** The supervisor can distinguish availability from effectiveness and a blocked job from an unhealthy agent. An eligible replacement must have actual capability, authority, and supported work-continuity semantics.

### O8 — Discover what enables the work

**Cross-cutting user statement:** “I can reach the capability or context needed to understand or unblock the situation.”

Integrations/access context, permitted LLM Configuration, Observability, Agent Catalog, and Help have persistent, role-appropriate homes and useful entry points from relevant jobs, approvals, health conditions, and readiness needs. The supervisor is not assumed to possess Platform Admin or Agent Developer permissions.

**Example:** Opening D1's waiting assessment reveals that source access is the prerequisite and links to the specific integration context. Opening T1's degradation leads to the related trace and agent/version record. A policy explanation links to the relevant Help and decision context.

**Experience proof:** The person can find what matters without scanning a large catalog or opening unrelated settings. Readiness can be prominent when prerequisites are incomplete; ongoing work and consequential exceptions lead established use.

## 3. Main story — supervising the AI workforce

This is an illustrative target experience. Supported enforcement, restrictions, recovery paths, approvals, and verification are assumptions to validate, not backend capabilities proved by the current prototype. Story order explains a possible sequence; real events determine progression.

### The continuing cast

| Job | Accountable agent/version | Initial situation | Important distinction |
| --- | --- | --- | --- |
| Investigation J17 | Network Troubleshooter T1 | Gathering read-only evidence; its required tool calls are repeatedly timing out | T1 is reachable, but a required capability is deteriorating. No production write is in progress for this job. |
| Remediation J21 | Remediation R1 | A validated proposal awaits an approval required by the configured policy | No controller operation has been issued. Approval covers one defined proposal and scope. |
| Assessment J23 | Config Drift D1 | Waiting for baseline-source access needed for its declared scope | D1 is healthy; the job has a source-access prerequisite. |

Event correlation, routing, and other workforce activity continue independently. Their contributions become visible when relevant; a constantly animated roster is not required to prove that they exist. Job titles provide purpose; network diagnosis stays inside job detail.

### Scene 1 — See the workforce

**What is happening.** The supervisor arrives while these jobs and other permitted work are already underway. A genuine approval, a developing reliability issue, and a healthy agent's blocked assessment coexist.

**What the supervisor experiences.** Agent activity connects each executor to its work, latest meaningful advancement, dependency, and next checkpoint. Pending decisions are distinguishable from informative updates. They can inspect J17 without losing awareness of J21 and J23.

**What Crosswork AI owns.** Task routing, dependency checks, routine execution under existing authority, and current-state reconciliation continue without requiring acknowledgement.

**Visual behavior.** The settled picture is immediately legible. New material updates appear locally; historical work does not replay an entrance animation. Selection and reading position remain stable.

**User outcome.** “I know what the workforce is doing and what deserves a closer look.” **O1, O2, O3, O7.**

### Scene 2 — Notice deterioration

**What is happening.** More required collection attempts for J17 time out without producing suitable new evidence. This pattern and loss of advancement support a capability-specific degradation signal.

**What Crosswork AI does.** It identifies the affected jobs, checks the dependency, and performs its configured bounded recovery attempts. It checks whether any authorized, eligible replacement can perform the needed work using a supported continuation or safe replay.

**What the supervisor experiences.** T1's health context explains the capability affected and consequence for J17. J17's activity and state explain the same problem consistently. D1 remains healthy; its separate access constraint is not relabelled as the same failure.

**Visual behavior.** One update changes the affected item to “Degraded capability” and links its work. Repeated retries update their existing account; they do not create a growing stream of apparent accomplishments.

**User outcome.** “I see an emerging reliability problem and understand its effect before jobs silently fail.” **O1, O6, O7.**

### Scene 3 — Address an escalation

**What is happening.** The bounded recovery checks have not restored the capability, and no suitable authorized replacement is available in this branch. Further unsupported retries would not establish progress.

**What Crosswork AI does.** It keeps J17 explicitly constrained and presents the evidence, attempts, remaining limits, and a supported supervisory control. In this example the configured policy reserves the production-eligibility decision for the AI Admin; the governor can hold the unsupported task step but cannot independently change that eligibility. While that decision is pending, Crosswork AI already withholds assignments whose prerequisites are unsupported and continues permitted recovery; the escalation does not leave work exposed. The control can restrict new production assignments to T1's affected capability/version and explains treatment of existing jobs before it is applied. If the policy already permits automatic containment, Crosswork AI should apply that supported control and inform the supervisor instead of manufacturing an approval task.

**What the supervisor does.** They review and apply that bounded restriction. Crosswork AI confirms the effective assignment restriction, retains ownership of J17, and continues its allowed dependency checks. The next supported checkpoint concerns capability restoration and eligibility re-evaluation; the story does not invent a restoration ETA.

**Visual behavior.** The escalation records the decision and resulting control state. T1 does not turn healthy, J17 does not become completed, and existing operations are not represented as cancelled. Other agents' activity remains visible.

**User outcome.** “I can contain exposure through a precise supervisory decision while Crosswork AI owns the technical follow-up.” **O4, O6, O7.**

### Scene 4 — Decide an approval

**What is happening.** Independently, J21's proposed corrective action requires approval because it falls outside the configured unattended-action set. It has not yet been issued to a controller.

**What the supervisor experiences.** The decision context names R1, J21, the exact proposal and affected scope, purpose, relevant validation evidence and uncertainty, policy, conditions, duration/expiry, alternatives, and consequence of retaining the restriction. They can inspect the plan without selecting network paths or composing a router configuration.

**What the supervisor does.** They permit this bounded proposal. Crosswork AI confirms effective authorization, checks that the proposal has not changed, and revalidates prerequisites. Only then can the action be issued. A changed or expired proposal stays constrained until it has the required valid authority and evidence.

**Visual behavior.** Approval submission, effective authorization, and execution start are separate confirmed changes. A click does not immediately animate the remediation as successful. The T1 restriction and J17 constraint remain visible.

**User outcome.** “I understand and control what is authorized without approving every autonomous step.” **O2, O3, O4.**

### Scene 5 — Follow work and find its context

**What is happening.** J21 now has an actual execution record and progresses on confirmed events. J23 remains waiting for its baseline-source access; D1 continues to be healthy.

**What the supervisor experiences.** The remediation queue explains J21's current stage and next checkpoint. Inspecting J23 reveals its different prerequisite and opens the relevant integration/access context, including which role can perform the needed change. The person does not need to infer whether D1 is broken or become a platform credential administrator.

**What Crosswork AI owns.** Execution follow-up, validation of newly available source access, and independent job state. Source access becoming available would require actual confirmation and renewed checks before J23 continues.

**Visual behavior.** J21 advances in place. J23 retains a clear dependency label; no artificial spinning progress appears while the prerequisite is missing. Discovery is connected to the work that makes it relevant, while persistent navigation remains available.

**User outcome.** “I can distinguish progressing work, decision-dependent work, and readiness constraints—and reach the right capability.” **O1, O3, O7, O8.**

### Scene 6 — Inspect automated actions

**What is happening.** J21's controller operation reports completion. Its intended effect still requires verification.

**What the supervisor experiences.** Automated Actions shows the consequential operation, J21, R1/version, applicable policy and effective approval, execution result, and outstanding checks. Trust/compliance inspection can trace the relevant action against the authority valid at action time, or explicitly reveal a missing link. An inspectable record does not establish workforce-wide compliance.

**What Crosswork AI does.** It observes the required effects and evaluates J21's case-specific criteria. A missing confirmation or adverse effect follows its own reconciliation/recovery branch; it is not silently treated as success.

**Visual behavior.** The action becomes “Execution completed” while the remediation becomes “Verifying.” A brief local transition communicates each event. The supervisor's selected context remains in place.

**User outcome.** “I can see what the workforce actually did, whether it was authorized, and what remains unproven.” **O3, O4, O5.**

### Scene 7 — Confirm a result and continue supervision

**What is happening.** J21's own observations satisfy the defined verification criteria. Its remediation becomes a retained verified result. J17 remains constrained and T1 remains restricted from the affected new assignments. J23 retains its independent access prerequisite.

**What the supervisor experiences.** The result is linked to its action, authority, executor/version, and proof. Other work stays discoverable and truthful; one successful remediation cannot create a global all-clear. New work can arrive without replacing the current selection or moving the content being read.

**Visual behavior.** A concise confirmation marks the supported result, then settles. Other jobs retain their actual state and supported next checkpoint. Relevant activity is lively because work changes, not because every agent icon must continuously move.

**User outcome.** “I can confirm a result and maintain oversight of the entire workforce.” **O1, O3, O4, O5, O6, O7.**

### State continuity ledger

| Moment | T1 / investigation J17 | R1 / remediation J21 | D1 / assessment J23 |
| --- | --- | --- | --- |
| Landing | Reachable agent; gathering evidence with required tool timeouts | Proposal awaiting policy-required approval; no controller operation issued | Healthy agent; source-access prerequisite missing |
| Reliability signal | Affected capability degraded; bounded recovery underway | Approval remains pending | Independent access constraint unchanged |
| Recovery exhausted in this branch | J17 constrained; effective restriction on affected new assignments; allowed checks retained | Independent approval context still available | Healthy agent, waiting job |
| J21 approval becomes effective | Restriction and actual job state remain | Proposal revalidated; actual execution can begin | Access remains unconfigured for the required scope |
| Controller completes J21 operation | No inherited recovery | Execution completed; remediation verifying | No inherited success or failure |
| J21 criteria met | Still constrained with owner and next checkpoint | Verified result with linked proof | Still waiting for its own confirmed prerequisite |

These are story facts for a proposed experience, not instructions to synchronize unrelated jobs to a single success clock.

## 4. Companion stories and alternate branches

### S1 — Autonomous recovery succeeds

Use Scene 2's alternative branch when an eligible executor/source and supported continuation exist. Crosswork AI validates capability, scope, current authority, and whether the relevant read-only step can safely be restarted or resumed. It preserves job identity, attempts, executor/version history, and evidence. The supervisor sees the supported recovery and resulting progress; no unnecessary human escalation is created. A completed reassignment alone does not establish task or remediation success. Do not assume arbitrary hot migration or permission inheritance. **O1, O3, O6, O7.**

### S2 — Approval retained, changed, or expired

The supervisor can retain the restriction with a reason; affected work remains constrained and owned while other permitted work continues. A narrower proposal is a new validated proposal. An expired or materially changed plan cannot use the previous approval as authorization. The effective approval and policy version remain traceable at action time. **O2, O3, O4, O5.**

### S3 — A boundary prevents an action

A planned out-of-scope operation is prevented before a tool action is issued. The experience says “Prevented request” and explains enforcement, affected work, and the governor's next permitted path. It does not claim an unauthorized operation occurred. If a trace instead establishes an actual scope violation, the supported containment/restriction workflow and treatment of in-flight work are explicit. If records are missing, compliance is unconfirmed rather than labelled violated. **O4, O5, O6.**

### S4 — Execution is unknown or verification fails

After issuance, confirmation may be lost. Crosswork AI reconciles controller records and actual resource observations before a potentially duplicating write. Original attempts/results are retained; new findings have their own provenance. Failed verification keeps the remediation unresolved. Supported retry, revised response, or reversal requires its own authority and proof; pausing is not represented as rollback. The supervisor sees what is known and any precise decision required. **O3, O4, O5, O6.**

### S5 — The workforce is ready and quiet

With no consequential exception, the page calmly explains current readiness and relevant ongoing work or permitted capabilities. It does not manufacture activity, alarming emptiness, or lifetime totals. If a prerequisite is incomplete, the affected work and a role-appropriate capability destination become clear. Agent Catalog, Integrations, permitted LLM Configuration, Observability, and Help remain discoverable through persistent homes as well as useful context. The emphasis follows readiness/work state, not first login or an explicit handover. **O1, O7, O8.**

### S6 — Change the workforce's operating boundaries

Proactive autonomy changes, agent promotion, restriction, replacement, and retirement remain important supporting governance journeys. A real readiness item, evaluation finding, policy need, or health condition provides the entry point. The supervisor inspects the applicable evidence and affected work before deciding. Changes apply only when effective and retain policy/version history; they do not retroactively change earlier authority. New-task eligibility is separate from actual in-flight treatment. Any draining or reassignment must be supported, preserve ownership, and avoid silent permission expansion. This depth supports workforce supervision without making every landing session a policy-authoring workflow. **O2, O4, O6, O7, O8.**

## 5. Shared experience and motion principles

- Lead with agents, assigned jobs, meaningful activity, and supervisory exceptions. The underlying network explains job scope and evidence inside inspection; it does not retake the primary landing narrative.
- Show continuous shared work across people and sessions. No shift-handover ceremony, login reset, or personal-creator-only workload.
- Distinguish ordinary progress, a condition the governor is already handling, an unresolved risk, and a decision needing this person's authority. Attention is not automatically an approval or escalation.
- Treat lifecycle state, priority, uncertainty, agent health, and authorization as separate facts. A single failed action cannot establish global agent failure or platform noncompliance.
- Use leading signals with records and explicit implications. Completed actions and past failures remain useful current accountability evidence; do not replace them with unsupported forecasts or vanity totals.
- Keep one linked work identity across activity, approvals, remediation, actions, and escalation inspection. Several views of J21 are not several jobs; expose their relationships without duplicating work or inflating counts.
- Keep the whole workload legible as it grows. Aggregate by meaningful job/agent/capability relationships, preserve individual access and source identities, and expose the reason for priority. Counts can explain actionable scope and open their underlying work.
- Animate confirmed arrivals, meaningful progress, degraded capability, changed dependencies, effective decisions, and verified results locally. Group routine retries/updates into their existing job. Do not animate an empty wait as advancement.
- Preserve selection, expanded evidence, keyboard focus, and scroll position. Material new work can be announced without forcibly replacing the inspected item. Motion is bounded, pausable where needed, and fully understandable under reduced motion.
- Use short, familiar section names. Candidate labels include Activity, Approvals, Remediation, Trust, Actions, Escalations, and Agent health; final layout and composition are still open. Seven information responsibilities do not require seven dashboard tiles.
- Maintain Magnetic / One CD midnight, readable typography, restrained blue/violet/pink accents, and documented standard/assistant components where appropriate. Custom workforce/work visuals may be useful; a WAN map or animated constellation is not assumed to be the overview.

## 6. Review before visual storyboarding

1. Can the supervisor distinguish T1's degraded capability from D1's healthy-but-blocked job and J21's approval-dependent remediation?
2. Can they recognize what Crosswork AI is already handling and which specific decisions need them?
3. Are the approval, restriction, recovery, reassignment, enforcement, and verification capabilities supported or explicitly illustrative?
4. Can each material action and result be traced to its own job, actor/version, authority, and evidence?
5. Does the experience stay useful when one job succeeds while others remain constrained or unresolved?
6. Are capability discovery and deeper governance reachable without dominating the daily supervisory watch?

These are proposed experience outcomes and stories for review. No UI implementation, external publication, stakeholder agreement, or production capability is established by this document.
