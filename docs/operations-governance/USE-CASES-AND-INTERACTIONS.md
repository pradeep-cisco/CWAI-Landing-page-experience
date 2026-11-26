# Crosswork AI — operations and governance

Updated: 2026-11-23. Status: **Design specification with an interactive Combined concept implemented for review.** Outcomes and the target story are defined in [outcomes and story](OUTCOMES-AND-STORY.md); each use case below names the outcomes (OC1–OC8) it serves. The prototype's main story now includes the agent line, authority tags, the T1 escalation and restriction (use case 11), the prevented request (use case 12), and authority links on records (use case 13). The new governance branches (autonomous recovery, compliance unconfirmed, lacks authority, restriction lifted) and use case 9 for agent decisions are not yet in the prototype. The target use cases extend beyond the representative fixture; implementation scope and stable option names are recorded in [dashboard iteration cues](../exploration-options.md). The prior Operations and Governance explorations remain available.

The current layout iteration is [Combined — Network ribbon](NETWORK-RIBBON.md). It adds linked network context above the three work regions while preserving the previous Combined layout as a separately selectable baseline.

## Purpose

Help one person who is accountable for network outcomes and for the AI agents that produce them. They understand consequential network work, make the decisions that require their authority, rely on agents they can trust, and see the work carried through to an evidenced result. Operations supplies the purpose and result. Governance supplies the authority, constraints, agent reliability, and accountability attached to that same work.

The person remains in the loop at defined decisions. Agents continue the permitted technical work between those decisions. This page assumes the person holds two separate kinds of authority: **change authority** over specific network proposals and **governance authority** over what agents may do. Each decision states which kind it needs; one never implies the other. Persona-specific views for people holding only one kind are a later exploration.

This direction carries forward the principles of the [workforce exploration](../ai-admin-governor/README.md): continuous shared work, meaningful live changes, progressive detail, stable reading context, and verified outcomes. It introduces a separate combined story rather than replacing the existing story fixtures.

## Outcomes

The full definitions, review checks, and anti-outcomes are in [outcomes and story](OUTCOMES-AND-STORY.md).

| ID | Outcome | What the person should be able to say |
| --- | --- | --- |
| **OC1** | Know the current state of network and work | I know where the network needs attention, which jobs matter, who is doing them, and what is constraining each one. |
| **OC2** | Understand what a finding means | I know what changed, whether it is expected, drift, or an incident, and what the evidence does and does not establish. |
| **OC3** | Make the decisions that need my authority | I see only the decisions that need me, which authority each needs, and exactly what I am deciding. |
| **OC4** | Supervise execution within bounds | I see agents act inside what was authorized, and I know when a boundary stopped something or another decision is needed. |
| **OC5** | Trust results | I know what changed, whether it achieved the intended result, and what remains unproven. |
| **OC6** | Rely on the agents | I know which agents and capabilities I can rely on, which are deteriorating, and how that affects the work. |
| **OC7** | Stay accountable | I can show who did what, under which authority, and what it established — and I know when that trace is incomplete. |
| **OC8** | Keep oversight as work grows or is interrupted | I keep track of all permitted unresolved work, even when there is a lot of it, nothing is happening, or my data is stale. |

## Minimal composition

The landing page has three stable regions. The story unfolds through their changing contents; it does not create a new section for each story moment.

| Region | Visible content | Opens on demand |
| --- | --- | --- |
| **Attention** | A required decision, its consequence, and **Review plan**. Material exceptions use an appropriate specific review action. | Exact proposal, evidence, authority, limits, decision controls, and relevant uncertainty. |
| **Activity** | Job purpose, scope, actual state, one consequential checkpoint or constraint, and **Inspect job**. | Findings, relationships, dependencies, agent health, attempts, and detailed history. |
| **Actions** | Consequential confirmed records: authority changes, acknowledged execution, execution results, and verified outcomes. | Actor, authority, source record, time, scope, and exactly what each record establishes. |

### Visual instructions

- Keep the product title **Crosswork AI** and existing navigation. Use **Home** for the landing destination. Show current scope when needed to interpret the work.
- Use full-width Magnetic Container cards for the three regions. Use Basic cards for compact decisions and selectable action records. Activity uses spacious work rows inside its Container card.
- Start each row with its purpose, not an agent name, incident identifier, or timestamp. Follow with concise scope, a state label, and one material checkpoint. Let essential text wrap.
- Use a quiet One CD midnight surface. A restrained, static blue–violet–pink atmosphere may sit near the page edge. Keep content surfaces legible and semantic colors distinct from that atmosphere.
- Give active work a small checkpoint rail only when there are meaningful stages to communicate. A simple assessment or source wait needs a state, not a decorative pipeline.
- Keep evidence and technical detail in one attached inspection at a time. Expand it below the initiating item, inside the existing region, with a subtle divider and no additional outer card. Put essential review content first; use disclosure only for optional detail.
- Keep Attention compact when nothing requires this person's review. Do not fill the space with reassuring metrics, generic recommendations, or an agent roster.

A useful starting content budget is one purpose, one state, and one consequential sentence per Activity row. This is a design constraint for this exploration, not a Magnetic rule or a limit on the number of jobs. Increase height for meaningful content rather than shrinking type or clipping it. Preserve native card spacing and clear separation between rows.

On a wide screen, align each Activity row to the same invisible grid: purpose and scope at the left, a concise state toward the right, and the Inspect action at the trailing edge. Place the consequential checkpoint on the next line; use the short rail below it only where useful. Keep quiet rows free of extra borders. Do not draw connections between independent jobs. Actions uses a compact chronological list of selectable records rather than a second full job board. A selected record opens its related trace without duplicating that trace in every card.

Attention, Activity, and Actions answer different questions: **What requires a decision? What is happening? What has actually happened?** A job can have a related decision and action record, but each representation must add its own information. Avoid repeating the same finding in a hero, a summary band, and all three regions.

## Story fixture

The example carries three independent jobs through the same period. Labels and resources below are illustrative.

| Job | Purpose | Accountable agent | Independent condition |
| --- | --- | --- | --- |
| **A** | Assess a configuration difference on router XR-R07; restore approved routing intent if a correction is justified. | Remediation agent R1 | The configured policy requires an authorized reviewer for this class of production correction. |
| **B** | Check recent configuration changes in another scope. | Config Drift agent D1 | Read-only assessment can complete under existing authority. Its findings and result belong to its own scope. |
| **C** | Investigate intermittent reachability in another scope. | Network Troubleshooter T1 | A required archived event source is unavailable to the job. T1 is healthy at first; its collection capability later degrades (use cases 7 and 11). |

Each job shows its accountable agent, version, and current health as one quiet line. The agent supports the job's purpose; it does not replace it as the row's lead.

The letters are specification references, not prominent product labels. No job borrows evidence, approval, or success from another. The landing state is shared continuing work; arrival does not restart it or create a handover ritual.

The configuration story is one entry path into this experience. A service-led incident can use the same structure: show the affected service and observed degradation, let agents investigate the supported relationships, expose any genuinely required response decision, and verify the proposal's service criteria after execution. A finding that turns out to be expected change ends with an assessment result. These paths share the work model; they do not require separate CDD, troubleshooting, or remediation sections on Home.

## Use case 1 — Understand work on arrival

**Outcomes:** OC1, OC8.

**Trigger:** The operator opens Home while the three jobs already exist.

**Outcome:** Understand important work and genuine decisions without reconstructing every previous event.

**Visual storyboard:** Render the current settled state. Activity shows three aligned rows with generous vertical breathing room. A reads **Assess routing configuration**, with **Assessing** and “Checking against approved intent.” B shows its own assessment checkpoint. C reads **Waiting for source access**, with the missing prerequisite named. Do not give the waiting row a failure accent merely because it is not progressing. Each row carries one quiet agent line, for example “Network Troubleshooter T1 · v3.1 · Healthy”, so the person can tell a waiting job from an unhealthy agent without opening inspection.

If no decision or material exception is present, Attention contains the compact line “No decisions require your review.” A material exception instead appears with its actual consequence and supported inspection/response; the quiet message does not replace it. Actions shows only existing consequential records, or a short empty state. There is no compulsory welcome hero, KPI strip, or replay of earlier job stages.

**Microinteractions:** Each **Inspect job** control opens the related attached inspection. Native controls retain their focus treatment; the inspected row has a quiet persistent selection treatment distinct from keyboard focus. Re-selecting it preserves the inspection rather than restarting it. Closing returns focus to its initiating control, or the related job control/region heading if the original is no longer available, and keeps the same scroll position. Hover adds only the native hover treatment; it reveals no essential information.

**Motion:** Initial data arrives directly in its current state. Use a structural skeleton only while the initial request is unresolved. Do not animate historical stages on arrival. Later material updates receive the local treatment defined in the motion table.

**Completion and alternatives:** The operator can identify purpose, stage, constraint, and required decision for each represented job. If source freshness is insufficient, use the last-known treatment in use case 10 rather than presenting the snapshot as live.

## Use case 2 — Understand what a finding means

**Outcomes:** OC2.

**Trigger:** A configuration assessment finds a difference on XR-R07.

**Outcome:** Understand whether this is expected change, unexpected drift, or an unresolved finding before considering corrective work.

**Agent work:** Compare against authoritative current intent; check baseline currency, matching authorized change records, relevant relationships, and current observations. A knowledge-graph relationship supplies context, not proof of cause. A difference, confirmed drift, an incident, service impact, and a proven cause remain separate classifications.

**Visual storyboard:** The same Activity row updates in place. Initially it says **Assessing**. Once supported, the checkpoint becomes “Drift confirmed against approved routing intent.” If a correction becomes the job's agreed purpose, its title changes to **Restore approved routing intent**, retaining its identity and inspection history. Use an incident label only if configured incident criteria are met. (The prototype opens on the arrival scene in **Assessing**; INC-104 appears from the Review scene.)

Inside inspection, lead with a short finding and the observation that supports it. Put the relevant comparison immediately below. Add a compact **Context** view only when relationships help: the relevant configuration, router, interface, and service entities, using the existing knowledge-graph type mapping and actual returned relationship labels. Start with the entities needed for this finding; expand to the Admin explorer for broader analysis. Do not reproduce the full graph on Home.

**Microinteractions:** **View evidence** reveals the underlying observation, source time, and reference. Selecting a context entity pins its details. Related edges remain identifiable through labels and keyboard focus, not color alone. Selecting a configuration comparison keeps corresponding before/after content aligned. No interaction silently changes the intended target.

**Motion:** When the classification is confirmed, briefly emphasize only the changed checkpoint. Relevant graph relationships may become more visible once selected; there is no continuous physics movement or travelling signal that implies causation. Updating evidence keeps the selected entity and comparison position stable.

**Completion and alternatives:** An authorized expected change yields a scoped assessment result, without creating remediation or an incident. An outdated baseline, missing source, or conflicting intent yields **Waiting for evidence** with the missing prerequisite. Do not offer restoration against an uncertain target. Observed service impact appears only with its supporting evidence.

## Use case 3 — Review a bounded response

**Outcomes:** OC3.

**Trigger:** Agents prepare a corrective proposal for A, and the applicable policy requires a human decision.

**Outcome:** Make a meaningful decision about a specific change while agents retain the technical work.

**Visual storyboard:** Attention gains a compact Basic card titled **Review configuration response**. The supporting line explains the actual gate: “Production correction requires your review.” A small **Change** tag names the authority type, distinguishing it from a **Governance** decision about an agent (use case 11). Show the scope and **Review plan**. Do not expose an approval button before the proposal can be inspected. Keep A in Activity with **Review required**; its checkpoint can say “Corrective plan prepared” rather than repeating the Attention card.

**Review plan** expands an attached review block. Its first view contains the intended result, exact resources, proposal version, and the concrete change. Follow with supporting evidence, validation results and uncertainty, permitted limits, and the verification criteria. Put available stop/recovery behavior, consequence of holding, and any supplied validity condition beside the decision. A reader must not need to open optional history to understand what they are authorizing.

**Microinteractions:** Offer **Authorize plan**, **Request revision**, and **Hold plan** only where supported and permitted. The authorization applies to the reviewed version and scope. Revision opens a concise input for the requested change; the resulting proposal requires applicable revalidation and review. Holding retains ownership and prevents the governed write from being issued. Closing the review makes no decision.

Submission immediately shows a pending state such as **Decision submitted**. Show effective authorization only after the authority service confirms it. Keep a durable record of the confirmed decision. A failed or uncertain submission retains the inspected context and provides the specific supported recovery; it does not optimistically display execution. Reconcile an uncertain decision result before issuing another potentially duplicating request.

When confirmation arrives, retain the inspected decision and show its confirmed result in place. Do not remove or relocate the focused control or open review during that update. On explicit Close, return focus to a surviving initiating control, the related job control, or the Attention heading. A confirmed decision can leave the active set after inspection closes; its record remains available.

**Motion:** A newly ready decision receives one restrained local emphasis. It does not open a modal, steal focus, or jump above another item being read. Review opens with the native disclosure behavior, or a short attached expansion. Decision submission uses native button feedback. The decision card remains readable until the decision outcome is confirmed.

**Completion and alternatives:** A permitted choice is confirmed against a particular proposal. If this viewer lacks authority, show that constraint and the supported review route without offering a live authorization action. Another reviewer's decision, an expired proposal, or a changed scope follows use case 9. Apply additional confirmation only where the actual action or policy requires it; do not insert a generic second approval screen into every review.

## Use case 4 — Supervise authorized execution

**Outcomes:** OC4, OC7.

**Trigger:** A's exact proposal receives effective authorization.

**Outcome:** See agents act within the decision boundary and recognize meaningful constraints without operating each technical step.

**Agent work:** Recheck the applicable authority, current intent, resource version, and prerequisites before each governed write. Issue the operation only when those checks pass. Record actual acknowledgement and execution events.

**Visual storyboard:** After authorization, A becomes **Checking**, not immediately Executing. The checkpoint states the real prerequisite being validated. Actions gains a compact authority record: **Plan authorized**. Once the controller acknowledges execution, A becomes **Executing** and a separate action record establishes that operation. A short rail can show **Assess → Review → Execute → Verify** for this corrective job, with the actual current stage marked. It is a sequence of evidenced stages, not a percentage bar.

The other rows retain their independent states. B may complete while A is checking. C can remain waiting. No page-wide busy layer prevents the operator from inspecting either.

**Microinteractions:** Selecting the execution record reveals issued scope, authority reference, controller response, and time. If supported, **Hold further changes** clearly describes that it prevents subsequent governed writes. It must not imply cancellation or rollback of an in-flight operation. Any supported cancellation or rollback is a separate action with its own prerequisites and consequences. Do not offer capabilities the system cannot perform.

**Motion:** Advance the checkpoint only after its confirming event. Do not run a dot along the rail to simulate elapsed execution. When several underlying technical steps occur, update one meaningful checkpoint rather than streaming every tool invocation onto Home.

**Completion and alternatives:** Acknowledgement establishes execution, not success. Changed resources, stale evidence, expired/revoked authority, or new scope block subsequent unissued writes and require the applicable review/check. An already issued operation retains its actual execution status and still needs reconciliation and verification; do not imply it stopped. Supported cancellation or recovery follows its own controls.

Distinguish **Rejected before execution**, **Execution failed**, and **Partially applied** according to the controller's actual status contract. Preserve confirmed changes and observed effects; failure does not establish that nothing changed. Assess the resulting state before selecting supported recovery, with fresh authority where required. If execution status is unknown, show **Execution status unknown** and reconcile the existing operation before a potentially duplicating write. Keep the uncertainty attached to the affected job.

If an agent requests a governed write outside the authorized scope during execution, enforcement prevents it and no operation is issued. Record it in Actions as **Prevented request**, linked to the job; it creates no new decision unless policy requires one. Use case 12 defines the treatment.

## Use case 5 — Verify the result

**Outcomes:** OC5.

**Trigger:** The controller reports that A's operation completed.

**Outcome:** Distinguish successful tool execution from achievement of the intended correction.

**Visual storyboard:** Set A to **Verifying**. Actions records **Configuration operation completed**, while the job remains open. The checkpoint describes the current check, such as “Comparing resulting configuration with approved intent.” Inspection shows a compact list of the proposal's verification criteria with separate states: met, pending, unavailable, or failed.

Verify the actual resulting configuration and the case-specific operational conditions established in the reviewed proposal. Use current post-action observations distinct from the operation's success acknowledgement. These need not come from a separate system, but an echoed target payload, a successful command response, or a graph relationship alone cannot establish the outcome. If observations cannot establish it, remain unverified.

Do not claim every service is healthy merely because one configuration matches. Show only measurements that answer a criterion. If a time series is useful, use a small, source-labelled chart with an observed value, units, and relevant threshold or comparison. Avoid decorative sparklines or a synthetic trust score.

**Microinteractions:** Selecting a criterion reveals its observation, scope, source time, and required condition. **View comparison** opens the precise configuration difference that verification assessed. Missing evidence has an explicit prerequisite; the operator does not have to infer why the result remains open.

**Motion:** Move to the Verify checkpoint on the confirmed transition. Individual criteria settle locally when evidence arrives. Do not animate an invented countdown or fill a success bar while evidence is missing. Keep completed criteria still while another criterion waits.

**Completion and alternatives:** Mark **Verified** only when the required proof for this proposal is available and satisfies its criteria. Missing or stale evidence remains unverified. A failed criterion retains the observed result and creates supported agent follow-up under the appropriate authority. Do not silently retry a write, enlarge scope, or inherit another job's proof.

## Use case 6 — Understand results and continue

**Outcomes:** OC5, OC6, OC8.

**Trigger:** A's required outcome is verified while B is completed and C remains waiting.

**Outcome:** Know what was achieved, how it was controlled, and what still requires oversight.

**Visual storyboard:** A's row settles to **Verified**, with a result sentence scoped to the actual correction. Actions adds **Routing intent restored**, linked to its proof. This is visually distinct from the earlier authority and operation records. Keep the reviewed proposal, actor, authority, execution, and verification connected through the same work identity.

B retains its own read-only assessment result. C remains visibly open with its actual missing prerequisite. If an agent restriction is in effect (use case 11), C's agent line shows **Restricted** rather than Healthy, and a one-line note in Attention keeps the restriction discoverable. Do not turn the entire page green, claim a global all-clear, or erase unresolved work because A succeeded.

**Microinteractions:** **Inspect result** opens the evidence and decision trace. When an actively inspected job completes, retain it in place. A deliberate **View completed work** route preserves access after it leaves the current working set. Closing inspection returns to the same context. On a later visit, load the current shared state without replaying the story.

**Motion:** Use one small confirmation treatment on A's resulting state, then stillness. No confetti, congratulatory takeover, moving completed rows, or automatic scroll reset. A newly confirmed result can enter Actions with a short settling transition when that does not disturb reading.

**Completion and alternatives:** The operator can explain the scoped result and locate its proof while still recognizing C's unresolved work. Partial verification remains partial. A later regression creates or updates the appropriate tracked work rather than rewriting the earlier observation as if it never happened.

## Use case 7 — Distinguish blocked work from unhealthy capability

**Outcomes:** OC6.

**Trigger:** C lacks a required source, or a capability becomes unreliable and affects active work or readiness.

**Outcome:** Understand the actual constraint and response without treating every waiting job as agent failure.

**Visual storyboard:** For C's source wait, show **Waiting for source access** and name the missing prerequisite. Inspection can show **Agent healthy** separately from access/eligibility. For a material capability problem, name its consequence: “Verification unavailable for affected jobs.” Link the impacted jobs from one shared issue when appropriate; do not generate an identical incident for every attempt.

Routine agent health stays in inspection or the appropriate management destination. A material reliability or readiness problem earns landing attention even if no agent is currently executing a job. This prevents a job-only view from hiding loss of an important capability.

**Microinteractions:** **Inspect constraint** reveals the dependency, accountable resolution path, and last confirmed condition. Offer a bounded source-access review only when this person's authority permits it. Crosswork AI retains follow-up ownership while the prerequisite is unresolved. If supported reassignment occurs, preserve the job identity and record the assignment change; do not imply automatic failover always exists.

**Motion:** Waiting is visually still. A confirmed dependency recovery updates the relevant checkpoint and resumes work only when the job actually resumes. Remove active progress cues when source loss prevents observing progress. Other independent work continues normally.

**Completion and alternatives:** The prerequisite or capability is restored, the scope is revised under applicable authority, or the unresolved condition remains explicitly tracked. A healthy agent, accessible source, eligible assignment, and authorized operation are separate facts. While Crosswork AI is still recovering a degraded capability, Attention may carry a one-line **Being handled** note rather than a decision. When bounded recovery is exhausted and policy reserves the eligibility decision for this person, follow use case 11.

## Use case 8 — Supervise concurrent work at scale

**Outcomes:** OC3, OC8.

**Trigger:** Several jobs or decisions need attention at different stages, including pre-existing work from an earlier shift.

**Outcome:** Find the most consequential work while retaining access to all permitted unresolved work.

**Visual storyboard:** Keep purpose-first rows and use scope only to disambiguate. Order decisions by supported consequence, urgency, and dependencies; make the prioritization understandable. Change decisions and agent decisions share one ordered list; each card keeps its authority tag. An old item is not automatically the most important. Group repeated signals under their existing job, with source evidence available inside it. A shared dependency issue can reference several jobs without merging their individual outcomes.

Use a bounded landing working set with a clear **View all activity** and **View all decisions** route. The three-job fixture is not a production limit. If pending decisions exceed the visible set, show their remaining number only when nonzero and preserve access to each. Never suggest the displayed subset is the entire network or workforce. Keep source coverage and applied filters clear where they affect interpretation.

**Microinteractions:** Filters retain meaningful context and make hidden pending work discoverable. Background updates preserve selection, focus, and scroll. During deliberate filtering, keep focus on the filter control. If the selected job is excluded, explain that it is outside the current results and offer a route back; do not silently substitute another job.

A new consequential exception gets a compact **New attention** affordance without taking focus. Selecting it deliberately navigates to the relevant decision or material exception. While reading older Actions, incoming records accumulate behind **New updates**; they do not push the current record away. On return, restore the prior scope and selection where valid.

**Motion:** Coalesce related updates into a short local change. Do not continuously reorder rows, auto-advance a carousel, scroll a ticker, or animate every log entry. Preserve the focused control, scroll anchor, and selected job through background insertion; handle deliberate filtering as described above. A critical change remains discoverable through persistent semantic emphasis; motion is never its sole signal.

**Completion and alternatives:** All permitted pending work remains reachable, important constraints are discoverable, and one job's progress does not imply another's. No bulk approval silently spans different proposals, scopes, or permissions.

## Use case 9 — Handle change during review

**Outcomes:** OC3.

**Trigger:** The proposal, evidence, resource state, decision authority, or another reviewer's decision changes while inspection is open. This applies equally to agent decisions (use case 11), for example when the affected capability recovers during review.

**Outcome:** Avoid acting on an obsolete or already decided proposal while preserving the operator's understanding.

**Visual storyboard:** Keep the inspected content at its reading position. Mark its version and show an inline notice such as **Plan changed** or **Decision recorded by another reviewer**. Explain what changed and which action is affected. A material change invalidates the affected authorization action; a new timestamp alone does not automatically invalidate an otherwise current proposal.

**Microinteractions:** **Review updated plan** reveals the changed scope, effect, or validation and allows a deliberate transition to the new version. Preserve the old version as history. New authorization applies only to the reviewed current version. **Request revision** and **Hold plan** maintain their own confirmed status. A rejected submission explains the actual reason and supported next action without discarding the review context.

If a related operation was already issued, retain its actual execution state alongside the changed decision context. A revocation, expiry, or changed plan governs subsequent unissued writes; it does not retroactively erase an operation or establish that it stopped.

**Motion:** Briefly emphasize the inline notice, not the whole document. Do not replace the text under the pointer, move a decision button into another action's location, or use a crossfade to conceal a material change. Announce the changed decision availability accessibly.

**Completion and alternatives:** The operator reviews the valid current proposal, sees the confirmed prior decision, or leaves the job held. Expiry, supersession, withdrawal, and loss of authority are distinct explanations. An earlier grant does not silently carry over to expanded scope.

## Use case 10 — Stay truthful in quiet or interrupted states

**Outcomes:** OC8.

**Trigger:** There are no decisions, no active jobs, an initial load, no records for a filter, or an interruption to the data connection.

**Outcome:** Distinguish quiet operation from missing visibility without manufacturing activity.

| Condition | Visual and interaction treatment |
| --- | --- |
| No decisions for this viewer | A short quiet Attention state when no material exception exists; otherwise retain that exception and its consequence. Keep Activity and Actions. |
| No active jobs | State the actual scope and that no jobs are active. Keep recent outcomes available; do not claim the network is healthy from absence of jobs. |
| No consequential actions yet | A concise empty state. Do not fill Actions with heartbeat messages or proposals. |
| Initial load | Native skeleton for the known structure while loading. Keep navigation usable. |
| No matching results | Show the filter context and **Clear filters**. Do not make filtered absence look like global absence. |
| Data interrupted | Preserve last-known records, show last confirmed time, and remove unsupported live claims. Allow decisions only when the service can establish current validity. |
| Coverage incomplete | Name the relevant unavailable source or scope and the conclusions it prevents. Do not imply complete visibility through a quiet overall state. |

**Microinteractions:** Provide a specific recovery action when supported. Relative times reveal an unambiguous source time on selection; state the time zone once in the relevant context. Reconnection restores the current confirmed state, retaining selection and scroll. If the operator was reviewing, recheck decision validity before re-enabling any affected action.

**Motion:** Empty states remain still. On reconnection, group material changes instead of replaying every missed event. Reduced motion receives the same changed-state labels and recovery controls.

## Use case 11 — Review an agent escalation

**Outcomes:** OC3, OC6.

**Trigger:** C's agent, Network Troubleshooter T1, keeps timing out on required collection. Crosswork AI's bounded recovery has not restored it, no eligible authorized replacement exists, and policy reserves the production-eligibility decision for this person.

**Agent work:** Crosswork AI identifies the affected jobs, performs its configured recovery attempts, checks for an eligible replacement, and already withholds assignments whose prerequisites are unsupported. It cannot change T1's eligibility itself.

**Visual storyboard:** Before recovery is exhausted, Attention carries only a one-line **Being handled** note and C's agent line reads “Degraded collection — recovery in progress”. Once escalated, Attention gains a Basic card titled **Review agent escalation** with a **Governance** tag. The supporting line states the consequence: “T1 collection recovery is exhausted; no eligible replacement.” Show the affected jobs and **Review escalation**. C's row becomes **Constrained**, not failed.

Review expands an attached block. Its first view contains the affected agent, version, and capability; the recovery attempts and their results; the affected jobs; and the offered control. Follow with treatment of in-flight work and what Crosswork AI continues to own.

**Microinteractions:** The primary control is **Restrict new assignments**: T1 receives no new production work that needs the affected capability. Existing jobs stay with T1 and remain constrained; the restriction does not cancel, repair, or reassign them. **Reassign** is offered only when an eligible, authorized replacement exists with supported continuation (see *Autonomous recovery succeeds* in [outcomes and story](OUTCOMES-AND-STORY.md)). **Keep current eligibility** records the decision with a reason. Hold and retire are not offered from Home.

Submission shows **Decision submitted**. Show **Restriction effective** only after the governor confirms it. Actions gains a record linked to the agent, version, policy, and affected jobs.

**Motion:** The same restrained emphasis as any new decision. No pulsing health indicator on the agent line.

**Completion and alternatives:** The restriction is effective, C stays constrained with its owner and next checkpoint, and T1's line shows **Restricted**. If the capability recovers before or during review, use case 9 applies. If policy already permits automatic containment, Crosswork AI applies it and records it in Actions instead of creating a decision. A later restoration re-evaluates eligibility and records **Restriction lifted**; it does not rewrite the earlier record.

## Use case 12 — Boundary prevents an action

**Outcomes:** OC4, OC7.

**Trigger:** During A's authorized execution, agent R1 requests a governed write outside the reviewed scope, for example an additional statement on XR-R07.

**Agent work:** Enforcement checks the request against the effective authority and blocks it before any operation is issued. The authorized part of the operation continues unaffected.

**Visual storyboard:** Actions gains **Prevented request — out-of-scope change not issued**, linked to A and R1. A's Activity row keeps its actual state (**Executing**); it does not turn into a failure. Attention gains no decision unless policy requires one, such as repeated out-of-scope requests from the same agent.

**Microinteractions:** Selecting the record reveals the requested change, the authority it exceeded, the enforcing policy, and confirmation that no operation was issued.

**Motion:** The record enters Actions like any other confirmed record. No alarm treatment.

**Completion and alternatives:** The person can say the boundary worked. If a trace instead shows a write outside scope was actually issued, it is a **Confirmed deviation**, distinct from a prevented request, and it creates a governance decision under use case 11. If the record of enforcement is missing, use case 13 applies.

## Use case 13 — Inspect the accountability of a record

**Outcomes:** OC7.

**Trigger:** The person selects any consequential record in Actions, or a record's authority trace is incomplete.

**Visual storyboard:** The attached inspection shows the job, the agent and version, the policy and authority valid at action time, the source record, the time, and what the record establishes. A record whose links are incomplete shows **Compliance unconfirmed** and names the missing link. It is neither compliant nor violated.

**Microinteractions:** Each link opens its own source: the authority record, the proposal version, or the operation trace. Inspection never infers a missing link from a neighbouring record.

**Motion:** None beyond the attached inspection reveal.

**Completion and alternatives:** For any record, the person can name its actor, authority, and evidence, or see exactly which is missing. No compliance percentage or all-clear is derived from the visible records.

## Motion and microinteraction language

These timings are proposed design ranges, not Magnetic requirements, backend deadlines, or evidence that work has completed. Retain native component behavior where available. Prefer opacity, a brief local surface change, or a small positional settle; keep text legible throughout.

| Event | Proposed treatment | Persistent meaning |
| --- | --- | --- |
| Material checkpoint changes | Local emphasis over 180–260 ms, then return to rest. | Updated checkpoint and state remain visible. |
| Confirmed stage advances | Move the marker or reached segment over 240–360 ms. | Text states the actual stage; no inferred percentage. |
| Decision becomes ready | One restrained 200–280 ms emphasis. | Required decision and Review action remain discoverable. |
| Attached inspection opens | Native behavior; otherwise a 160–220 ms reveal. | Expanded state, heading, and explicit Close action. |
| Decision is submitted | Immediate native pending feedback. | Submission remains distinct from confirmed authority. |
| New consequential record arrives | At most a 4–6 px settle over 180–240 ms, when insertion will not disturb reading. | Inspectable record with actual scope and time. |
| Outcome becomes verified | One 180–240 ms confirmation treatment. | Scoped Verified state and evidence remain. |
| Waiting or dependency blocked | No recurring motion. | Named prerequisite, owner/resolution path, and last confirmed condition. |
| Reduced motion is enabled | Immediate settled updates without translation, pulsing, or animated rails. | All meaning, evidence, and controls remain available. |

Use at most one shared emphasis for a related batch. A timer may end an emphasis; it must never advance a job, confirm authority, acknowledge execution, or mark verification. Do not use heartbeat glows, rotating agent avatars, moving gradient backgrounds, continuous travelling dots, or indefinite “AI thinking” decoration. A native loading indicator may represent an actual pending request, with a distinct failure or unknown state when appropriate.

Native hover and keyboard focus provide the interaction treatment. Do not add a second border, glow, or outline around them. Keep selected state distinct from keyboard focus. Every icon-only control has a clear accessible name. Tooltips supplement visible content and never contain the only explanation of risk or scope.

## Responsive behavior and access

- Preserve the reading order Attention → Activity → Actions. Reflow work rows and review content rather than shrinking type or forcing a horizontal dashboard canvas.
- On narrow screens, keep a decision's purpose, reason, and Review action together. Show the current meaningful checkpoint, with the full sequence available accessibly in inspection.
- Keep inspection in document flow. Native disclosures keep focus on their trigger. For a custom review region, move focus to its heading only when needed to establish context after deliberate opening. On Close, return to a surviving initiating control or the related job control/region heading. Background updates never move focus.
- Use native button and selectable-card keyboard behavior. A selectable action card has one selection target; a decision card with a Review button is not also a competing whole-card target.
- Announce decision availability and consequential changes to the inspected job. Summarize other new attention once per related batch. Initial snapshots, offscreen routine progress, and historical record insertions stay silent; all updates remain available through normal navigation. Reserve interruptive announcements for genuinely urgent conditions.
- Maintain readable contrast and persistent text/icon cues for state. Color, glow, position, or motion alone never communicates required attention, job failure, or verification.

## Magnetic composition

| Need | Component treatment |
| --- | --- |
| Page regions | Native Container cards, using existing header/body composition. Do not nest Container cards or place them inside a drawer/modal. |
| Decisions and action records | Native Basic cards. Do not nest Basic cards. Use optional status accents sparingly for actual priority/state. |
| Activity lanes and checkpoint rail | Custom content inside the Container card, using native text, tags, icons, and controls. |
| Optional supporting evidence/history | Magnetic Collapse where its supported composition fits. Keep required proposal content visible; do not nest collapses or hide short content unnecessarily. |
| Review controls | Native buttons and form feedback. Keep decision, execution, and verification meaning separate. |
| Long review actions | If needed and available in the installed boilerplate, use Sticky Action Bar when its important enabled primary action has scrolled out of view. Use one authoritative action state across both presentations and prevent duplicate submission. Retain the focused presentation until focus leaves, even when its counterpart enters view. Otherwise hide the duplicate when the original is visible. Preserve an already pending button state. |
| Future conversational explanation | Use the Magnetic AI Assistant treatment when introduced. It is contextual support; the job, review, and verified result remain directly usable without chat. |

Let native components own typography, spacing, surfaces, border, radius, hover, and focus. Keep custom graphics limited to relationships and stage communication that standard components do not express well. Retain One CD midnight across this combined option. Required review content and warnings take precedence over decorative space.

## Story continuity check

| Moment | Attention | Activity | Actions |
| --- | --- | --- | --- |
| Arrival | Actual decisions only, possibly none for this viewer. | A assessing; B assessing; C waiting for its own source. | Existing consequential records only. |
| Meaning established | No new human gate until a proposal requires one. | A's classification is supported; B can finish independently; C stays waiting. | B's scoped assessment result, once confirmed. |
| Capability deteriorates | **Being handled** note only. | C waiting; T1 Degraded, recovery in progress. | No record until a control is confirmed. |
| Plan ready and escalation | Review A's proposal (**Change**) and T1's escalation (**Governance**), ordered with a reason. | A Review required; C Constrained; other states preserved. | No operation inferred from the proposal. |
| Decision submitted | Pending decision feedback. | A has not started execution merely because submission occurred. | Record effective authority and effective restriction only after confirmation. |
| Authorized execution | Only remaining genuine decisions/exceptions. | A Checking, then Executing after acknowledgement; C Constrained, T1 Restricted. | Separate authority, restriction, and acknowledged-operation records; a Prevented request if one occurs. |
| Operation complete | Exceptions only if applicable. | A Verifying; B's result remains independent. | Operation completion without a verified-outcome claim. |
| Result verified | Remaining genuine decisions/exceptions; a note that T1 remains restricted. | A Verified with scoped proof; C still open; T1 Restricted. | Linked verified result; no global all-clear. |

## Review criteria

The design is ready for implementation review when these checks hold across the main story and alternate states:

1. The operator can explain important work, its actual state, its material constraint, its accountable agent, and whether a decision is required from the landing page.
2. An expected change, missing evidence, confirmed drift, an incident, and a demonstrated cause have different truthful treatments.
3. A pending, failed, expired, or superseded decision never appears as an issued operation. Exact scope and permission determine the available action.
4. Unknown execution is reconciled before a potentially duplicating write. Tool completion, missing proof, and failed criteria never appear as Verified.
5. Multiple jobs retain their own authority, evidence, results, and unresolved conditions. Source waits do not automatically imply agent failure.
6. Live changes preserve reading position, keyboard focus, selection, and access to pending work on wide and narrow screens.
7. Every animation has a corresponding state change and a complete still/reduced-motion treatment. Repeated logs, status badges, and decorative summaries do not multiply the same information.
8. Every decision states whether it needs change authority or governance authority. An agent restriction never claims to cancel, repair, or reassign existing work.
9. A prevented request, a confirmed deviation, and compliance unconfirmed have different truthful treatments. Every consequential record links its agent, version, and authority, or names the missing link.

Before representing this as a working product, confirm the available authority/proposal version model, source-freshness rules, controller acknowledgement/status contract, verification criteria, in-flight controls, permission boundaries, supported dependency recovery, agent eligibility and restriction controls, and enforcement records. The prototype must identify simulated scenes; its external floating controls are for comparing explorations, not production task controls. The prototype must identify simulated scenes; its external floating controls are for comparing explorations, not production task controls.
