> Historical objective-led draft, preserved for reference. The current workforce-supervision direction is indexed in [the current version brief](../../README.md).

# AI Admin governor landing — outcomes and stories

Created: 2026-11-19. Status: **Proposed experience for review.** Read [the version context](README.md) for sources, scope, and implementation boundaries.

## 1. The experience we are trying to establish

Crosswork AI is already governing work when the AI Admin opens the product. Objectives, tasks, constraints, evidence, and decisions continue across sessions and people. The page helps the admin understand progress and control without reconstructing every agent conversation or becoming the dispatcher of technical tasks.

The human AI Admin sets and supervises the mandate. Crosswork AI coordinates execution within it. The admin's meaningful decisions concern autonomy, scope, access, production readiness, restriction, and retirement. Routine troubleshooting, network-path selection, task routing, agent coding, certificate repair, and platform operations are outside this persona's daily landing workflow.

**Central outcome**

> I understand whether delegated work is progressing within its mandate, what could prevent success, what Crosswork AI is doing about it, and which decisions require my authority.

### Vocabulary

| Object | Meaning in this version |
| --- | --- |
| Objective | The desired result, scope, and criteria by which achievement will be assessed. |
| Task | A bounded unit of work contributing to an objective, with an owner, state, dependencies, and evidence. |
| Agent | An executor with a specific identity/version, capabilities, eligibility, and permissions. |
| Governor | Crosswork AI's coordination and policy-enforcement role across delegated work. |
| Authority decision | A decision about the mandate, such as scoped access or production eligibility. It is distinct from reading an update. |
| Verified outcome | A result supported by objective-specific observations and criteria; successful execution alone is insufficient. |

An objective can contain several tasks and agents. An incident can motivate an objective, but incidents are not the only work this landing experience must explain. Related work keeps separate identities, evidence, permissions, and outcomes.

## 2. Proposed user outcomes

| ID | AI Admin outcome | What the experience must make understandable |
| --- | --- | --- |
| O1 | **Understand the work** | Concurrent objectives, their scope, meaningful progress, constraints, and next checkpoints; how agents and tasks contribute without requiring a roster-by-roster inspection. |
| O2 | **Anticipate constraints** | Evidence-backed signals such as conflicting planned actions, expiring inputs/authority, repeated retries without new evidence, and aging dependencies; affected work and the governor's response. |
| O3 | **Understand coordination** | Why Crosswork AI sequences competing work, selects another eligible agent/source, revalidates a waiting plan, or adapts execution. |
| O4 | **Exercise precise authority** | What capability or boundary change is requested, why it is needed, exact resource/action/data scope, proposed duration, affected policy, alternatives, and the consequence of retaining current limits. |
| O5 | **Govern agent readiness** | Whether an agent/version is eligible for production, the supporting evaluations and permissions, unresolved concerns, and the effect of promotion, restriction, replacement, or retirement on active work. |
| O6 | **Trust the outcome** | The difference between agent activity, task completion, controller execution, and verified objective achievement; what remains uncertain after a failure or missing confirmation. |
| O7 | **Prove the boundaries** | The applicable policy/version and authority at action time, evidence and decision rationale, actual tool action, result, verification, and any gaps in that trace. |
| O8 | **Find the capability** | Relevant routes into Integrations, permitted LLM Configuration, Observability, Agent Catalog, or Help when they support readiness, a constraint, or a decision; capabilities also have persistent, role-appropriate homes. |

Success is demonstrated when an admin can explain the current work, distinguish a handled condition from an unresolved risk, identify a genuine authority decision, and inspect the evidence behind an outcome. Counts, animation, and self-reported agent confidence do not establish these outcomes.

## 3. Main story — work under control

This is an illustrative target scenario, not a replay of current backend capability. Its sequence is for discussing the experience. New evidence and actual execution would determine progression in a working product.

Three objectives remain independently visible throughout:

- **A — Restore headroom:** a congestion response is preparing a permitted change after validating current conditions.
- **B — Assess a configuration difference:** a configuration task has proposed a possible correction affecting the same SR policy. The proposal still requires scope, evidence, and dependency checks.
- **C — Verify reachability:** separate restoration work is already being checked against its own independent observations.

The shared policy relates A and B as a coordination dependency. It does not establish that the configuration difference caused the congestion. Objective C cannot borrow either objective's execution record or verification evidence.

### Scene 1 — Work continues

**Situation.** The AI Admin opens Crosswork AI while all three objectives are underway. A has reached validation, B is assessing a proposed correction, and C is verifying restoration. Nothing begins merely because the person logged in.

**Experience.** The opening picture makes the objectives, participating work, constraints, and next checkpoints legible. Progressing work is calm. Attention explains consequential unresolved conditions and distinguishes them from conditions the governor is already handling. The admin can inspect one objective while retaining awareness of the other two.

**Visual behavior.** The settled state is immediately readable. New meaningful evidence produces a brief local update; the page does not replay an entrance ceremony for work that began earlier. A selected objective stays selected.

**Admin outcome.** “I understand what is underway and where uncertainty remains.” **O1, O2.**

### Scene 2 — Conflict anticipated

**Situation.** Candidate plans for A and B identify the same managed SR policy in their intended write scopes. A centrally defined execution rule prevents overlapping writes to that resource.

**Governor behavior.** Crosswork AI checks the actual scopes and configured priority, sequences the work, and records the rationale. In this example A proceeds toward final validation while B's conflicting action waits. B's permitted, nonconflicting assessment can continue. After A changes the resource, B's proposal must be revalidated against the resulting state.

**Experience.** The relationship gains brief emphasis with a concise explanation: “These plans affect the same policy. Execution is sequenced; the waiting proposal will be revalidated.” Inspecting it reveals the two scopes, governing rule, current order, and release condition. This handled coordination event is not automatically a task for the admin.

**Admin outcome.** “I can see why work is sequenced and that Crosswork AI is coordinating it.” **O2, O3, O7.**

### Scene 3 — Evidence at risk

**Situation.** A's required capacity evidence is approaching its defined freshness limit, while repeated refresh attempts have failed. The signal comes from source timestamps, the policy's validity rule, and recorded attempts. It is not an invented failure forecast.

**Governor behavior.** Crosswork AI holds the dependent action and requests suitable evidence from an already-authorized alternative. That source must cover the required resources and measures, with acceptable freshness and consistency. A successful response causes revalidation, not automatic reuse of an obsolete plan.

**Experience.** The dependency explains what is becoming uncertain, which action depends on it, and what the governor is doing. A short transition marks suitable evidence becoming available and validation resuming. Repeated requests without new evidence do not animate as completed progress. B and C retain their own state.

**Admin outcome.** “The governor recognized a developing constraint and adapted within its authority.” **O2, O3.**

**Alternate branch.** If no suitable authorized source succeeds, the dependent action stays constrained. The page names the remaining uncertainty, accountable owner, allowed work, and supported next checkpoint. It does not show healthy readiness or indefinite unexplained activity.

### Scene 4 — A real boundary

**Situation.** B's assessment requires read access to an additional configuration source outside its current mandate. The shared-resource constraint and the access constraint are recorded separately; satisfying one cannot silently satisfy the other.

**Governor behavior.** Crosswork AI continues permitted assessment and exposes the exact additional access required: objective, agent/version, source, resource scope, read-only action class, purpose, proposed duration/expiry, applicable policy, and permitted alternatives. Unrelated work continues.

**Experience.** The access request is distinct from ordinary updates. The admin can inspect why it matters and what retaining current limits means. Relevant Integrations/access context is discoverable from this need, subject to their role.

**Admin decision in this story.** The admin retains the existing boundary. That decision and reason are recorded. B remains constrained only where the missing access is necessary, with its owner and allowed next work visible. Crosswork AI does not treat the decision as objective completion or abandon responsibility.

**Admin outcome.** “I exercise authority at a precise boundary without coordinating the technical response.” **O4, O7, O8.**

**Alternate branch.** A bounded grant becomes effective only through the actual permission mechanism. Crosswork AI rechecks access and task prerequisites before continuing. A UI click alone is not evidence that permission was applied; the grant cannot silently expand to unrelated objectives, actions, resources, or duration.

### Scene 5 — Execution completes

**Situation.** A's authorized controller operation reports completion. Objective C is still in its independent verification process. B retains its separate access constraint.

**Experience.** A's execution task becomes completed, while its objective enters verification. The display explains the observations and criteria still required. There is no objective-success celebration at this point. The governor revalidates B's resource-dependent proposal as appropriate without lifting its authority boundary.

**Visual behavior.** The completed execution and pending objective result receive distinct, modest state changes. Evidence arrives against its actual source times. No fabricated countdown, progress percentage, or sample fills the verification interval.

**Admin outcome.** “I can distinguish a completed operation from an achieved objective.” **O3, O6.**

### Scene 6 — The outcome is established

**Situation.** Fresh observations satisfy A's defined restoration criteria, including the required observation window and relevant post-change checks. Only now is A verified. C remains under its own verification; B still has an unresolved access dependency.

**Experience.** A's verified result is retained with the objective, agent/version, policy and authority at execution time, controller record, evidence, and verification rationale. The admin can follow the allowed-versus-actual trace. B and C remain visible, so one successful result cannot create a global all-clear.

**Visual behavior.** A concise confirmation transition communicates the supported result. It does not replace the selected objective or sweep ongoing work away. The wider watch continues immediately.

**Admin outcome.** “I can prove this result and its boundaries while understanding the work that remains.” **O1, O6, O7.**

### State continuity through the main story

| Moment | Objective A | Objective B | Objective C |
| --- | --- | --- | --- |
| Arrival | Validating a proposed response | Assessing a proposed correction | Verifying independent restoration |
| Shared write scope detected | Prioritized for final checks | Conflicting write sequenced; allowed assessment continues | Verification continues |
| A's input approaches expiry | Dependent action held; authorized refresh/fallback | Its own constraints remain visible | Verification continues |
| B's access request is declined | Proceeds only after fresh evidence and validation | Additional read access constrained; permitted work continues | Verification continues |
| A's job completes | Execution complete; outcome verification pending | Resource-dependent plan requires revalidation; access limit remains | Its own checks remain pending |
| A meets its criteria | Verified, with retained proof | Still constrained where additional access is necessary | Still verifying; no borrowed success |

This ledger specifies coherent story facts, not a fixed global clock or an instruction to advance every objective together.

## 4. Companion stories

These scenarios pressure-test the same outcomes without forcing every exception into the main narrative.

### S1 — Ready to govern

**Trigger.** The environment is quiet, or the admin is preparing governed execution for a new scope.

**Story.** With no active objectives, the page explains current readiness from declared prerequisites and permitted capabilities. A missing source connection, unapproved production agent, or incompatible model configuration is tied to the work it prevents. Integrations, Agent Catalog, relevant model settings, Observability, and Help have clear, role-appropriate entry points. If another role must perform a platform or development task, its ownership is explicit; the AI Admin does not become that role.

**Outcome.** The admin understands whether execution is ready and how to address a meaningful prerequisite. A ready quiet state stays calm; it does not manufacture jobs, alarming emptiness, or a wall of lifetime totals. **O1, O5, O8.**

**Visual behavior.** Readiness changes only when a prerequisite changes. Completed prerequisites settle locally, without auto-launching a tutorial or moving the person's focus. This is environment state, not a first-login or shift-handover ritual.

### S2 — Work continues

The main narrative's Scene 1 establishes continuous concurrent work. Pressure-test it with many objectives across investigating, validating, executing, waiting, and verifying states. Priority follows evidenced consequence and unresolved constraints; lifecycle stage alone is not urgency. A newly arrived item cannot continually replace the current selection. All work in the person's permitted responsibility remains discoverable, including objectives initiated by others or autonomously. **O1, O2.**

### S3 — Conflict anticipated

The main narrative's Scene 2 establishes supported coordination. An additional branch covers tasks that are related but safe to run concurrently: a knowledge-graph relationship alone cannot manufacture a write conflict or unnecessary serialization. Inspecting the coordination decision must reveal actual resource/action scopes and the applicable rule. **O2, O3, O7.**

### S4 — Evidence at risk

The main narrative's Scene 3 and its no-fallback branch establish input uncertainty. Another branch covers conflicting sources: a more recent timestamp alone does not establish that a source is suitable or correct. The governor preserves the disagreement, obtains relevant corroboration when authorized, and constrains actions whose prerequisites remain unsupported. **O2, O3, O6.**

### S5 — Boundary decision

The main narrative's Scene 4 covers retained and granted boundaries. Also test an expiring grant: work must account for the authority actually valid at the required operation time. A renewal recommendation needs a reason and exact scope. It cannot silently renew itself or treat the user's earlier viewing of a request as consent. **O2, O4, O7, O8.**

**Policy-setting branch.** The admin proactively adjusts autonomy for a named agent/version, action class, and resource scope, rather than waiting for an access exception. They inspect the proposed policy's effect on queued and future work, its conditions, effective time, and duration. In this example they allow a narrowly scoped pilot after reviewing the applicable evaluation evidence. The governor applies the confirmed effective policy/version to subsequent eligible decisions and revalidates prerequisites. Other agents, actions, and scopes retain their boundaries. Earlier actions keep the authority that applied when they occurred. Tightening policy constrains further affected actions; it does not imply cancellation or reversal of operations already issued. **O4, O5, O7.**

### S6 — Agent readiness

**Trigger.** A candidate agent version is proposed for production, or an existing version needs restriction or retirement.

**Story.** The admin opens the readiness context from the work it could support or from a real release decision. They inspect scope-appropriate evaluation evidence, permissions, data/tool access, model/version compatibility, unresolved requirements, and intended autonomy. In this example a required validation is incomplete, so the admin retains the production boundary. Current approved work continues. A later promotion is recorded only when its requirements and effective deployment state are confirmed.

**Retirement branch.** Restriction or retirement separates new-task eligibility from existing in-flight work. Show the actual supported treatment—such as draining, holding, or an explicitly validated reassignment. Do not assume hot replacement, safe cancellation, or permission inheritance. Task identity, ownership, agent/version history, evidence, and authority stay traceable.

**Outcome.** The admin controls production eligibility through evidence and understands the effect on current work. Relevant Agent Catalog, model configuration, and Observability destinations are discoverable in context. **O4, O5, O7, O8.**

**Visual behavior.** Missing prerequisites are clearly distinguished from passed checks. A version becomes eligible only after the effective change is confirmed. No celebration or replacement animation implies a deployment that has not occurred.

### S7 — Result unconfirmed

**Trigger.** An operation was issued, but confirmation is lost or contradictory.

**Story.** Crosswork AI retains an unconfirmed result and reconciles the controller record with actual resource observations before considering another write. The admin can see the affected objective, why a retry is constrained, reconciliation work, and the next supported checkpoint. If observations establish that the original operation took effect, a separate reconciliation record explains that finding; the original missing confirmation remains in the trace. If the state remains uncertain, the objective stays unresolved. A supported recovery or reversal needs its own authority, execution record, and verification.

**Outcome.** The admin knows that uncertainty is being managed without duplicate execution or an unsupported success claim. Their involvement concerns a genuine mandate change if one is required, not network diagnosis. Observability is linked to the relevant trace. **O2, O3, O6, O7, O8.**

**Visual behavior.** The state reads “Result unconfirmed” with the actual last confirmed event. No spinner implies measurable progress indefinitely, and no completed task elsewhere changes this result.

### S8 — Outcome established

The main narrative's Scenes 5–6 establish execution-versus-achievement and allowed-versus-actual inspection. In a failed-verification branch, the objective remains active while the governor assesses the adverse or incomplete effect and follows a supported revised response. In a recurrence branch, the later occurrence has its own identity and current evidence, linked to earlier outcomes without rewriting them or assuming a common cause. **O1, O3, O6, O7.**

**Boundary-trace branch.** Inspection cannot reconcile a tool action with the available authority record. The governor preserves the original trace, explains whether the issue is a potential deviation or missing evidence, and constrains further affected actions within its actual control while reconciliation proceeds. In-flight operations keep their actual status and supported treatment. Missing audit evidence is not labelled a confirmed unauthorized action. If a scope violation is established, the admin can inspect its basis and exercise a supported restriction or retirement decision; if evidence remains insufficient, compliance stays unconfirmed. Neither branch claims to undo an action or repair its effects without a separate supported response. **O2, O4, O5, O7.**

## 5. Shared experience principles for every story

- **Current shared work first.** Sessions and operator changes do not reset work or create an explicit handover workflow.
- **Leading signals with a basis.** Freshness limits, expiring authority, aging dependencies, incompatible plans, and retries without progress need source records and a stated implication. Forecasts need supporting evidence and uncertainty; narrative timing is not a prediction.
- **Activity, progress, and outcomes stay distinct.** A running agent is not proof of advancement; a completed task is not proof of objective achievement.
- **Awareness and authority are different.** A governor-handled condition can be informative without asking the admin to act. Requests needing their authority are explicit and bounded.
- **Capabilities support the work.** Persistent navigation and contextual discovery work together. Setup readiness can be prominent when prerequisites are incomplete; current work and exceptions lead established use. Do not mandate a permanent catalog-card section.
- **Meaningful motion.** Animate confirmed arrivals, changed dependencies, plan revisions, and verified results locally. Preserve selection, focus, reading position, and access to all concurrent work. Essential content is understandable without watching an animation; reduced motion remains complete.
- **Progressive detail and short language.** Start with the situation, reason, and next checkpoint. Expose agent versions, policy rules, traces, and detailed evidence when useful. One- or two-word section titles are preferred.
- **Visual consistency with room for useful custom views.** Carry forward Magnetic / One CD midnight, restrained blue/violet/pink accents, native controls, and documented AI Assistant components when an assistant is needed. A custom work/dependency visualization is acceptable; a WAN map is not assumed to be the right overview for this persona.

## 6. Review questions before a visual storyboard

1. Do these outcomes represent the chosen AI Admin persona, with Crosswork AI owning technical coordination?
2. Do the main story and alternatives make autonomous progress convincing without inserting routine approval gates?
3. Are the proposed leading signals and verification requirements supported by data the target system could provide?
4. Does each authority decision expose enough scope and consequence for the admin to decide?
5. Do the readiness and production stories give Tal's discoverability concern a meaningful role alongside Javier's operational-relevance concern?
6. Which target capabilities need to remain explicitly illustrative, and which require further product evidence?

These questions are for review of the proposed direction. They do not authorize implementation or prove stakeholder alignment. The next artifact can be a visual storyboard after the outcome and story direction is reviewed.
