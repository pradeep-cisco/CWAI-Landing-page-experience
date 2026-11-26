# Combined — outcomes and story for one operator-governor

Updated: 2026-11-23. Status: **Outcomes and story agreed as the basis for iteration; use cases updated and the main story implemented in 03 · Combined — Live activity.** The new governance branches in section 5 are not yet implemented. Outcomes come first; the story and use-case mapping follow from them. This document does not change the current landing structure of **03 · Combined — Live activity** (Network → Attention and Actions → Activity). Structural ideas are listed separately as suggestions.

It merges the operator outcomes in [use cases and interactions](USE-CASES-AND-INTERACTIONS.md) with the workforce-supervision outcomes O1–O8 in [AI workforce supervision](../ai-admin-governor/OUTCOMES-AND-STORIES.md). Where they overlap, they become one outcome with two lenses.

## 1. The person

One person is accountable for **network outcomes** and for **the AI agents that produce them**. They are not a dispatcher or a CLI engineer, and they are not a policy author on every visit.

| Lens | They are accountable for | They are not expected to |
| --- | --- | --- |
| **Network operator** | What is happening in the network, what it means, which corrections happen, and whether results are real. | Run each diagnostic step, choose paths, or compose configuration. |
| **AI governance admin** | Which agents act, whether they are reliable and within bounds, and whether every consequential action is accountable. | Approve every autonomous step, repair platform infrastructure, or author policy during daily work. |

**Primary outcome**

> I know what is happening in my network and what the agents are doing about it. I make the decisions that need my authority, and I can trust both the results and the agents that produced them.

**Two kinds of authority, one person.** The same person can hold:

- **Operational authority** — decide on a specific network change (authorize, revise, or hold a proposal).
- **Governance authority** — decide on what agents may do (restrict or restore an agent or capability, retain or adjust a boundary).

The page must always say which kind a decision needs. If the person lacks either kind for an item, the item stays visible with the reason and the route to someone who has it.

**Working assumption (agreed 2026-11-23):** this page is designed for one person who holds both kinds of authority. Separate views for people who hold only one kind may be explored later.

## 2. Outcomes

Each outcome states what the person can say, what they need to see, the decision it enables, and how a review can check it. **Lens** marks where the outcome came from: Op = operator, Gov = governance, Both = merged.

### OC1 — Know the current state of network and work · Both

**User statement:** “I know where the network needs attention, which jobs matter, who is doing them, and what is constraining each one.”

- Network scope with any active incident, and where each current job is located.
- Each job's purpose, scope, actual state, one material checkpoint, and the **accountable agent with its version and current health**.
- Work started before arrival, by someone else, or autonomously, shown without a replay or handover.

**Decision enabled:** Inspect a job, or keep watching. Normal progress creates no task.
**Review check:** Without opening inspection, the person can name for each job: purpose, state, constraint, and acting agent.
**Replaces:** Op “Understand work”, Gov O1.

### OC2 — Understand what a finding means · Op

**User statement:** “I know what changed, whether it is expected, drift, or an incident, and what the evidence does and does not establish.”

- The finding, its supporting observation, source time, and comparison against approved intent.
- Expected change, missing evidence, confirmed drift, incident, and proven cause as separate classifications.
- Relevant network relationships as context, not as proof of cause.

**Decision enabled:** Accept an assessment result, wait for evidence, or let the agents propose a response.
**Review check:** The person can tell an expected change from drift, and drift from an incident, using only the evidence shown.
**Replaces:** Op “Understand findings”.

### OC3 — Make the decisions that need my authority · Both

**User statement:** “I see only the decisions that genuinely need me, I know which authority each needs, and I know exactly what I am deciding.”

- **Change decisions:** exact proposal and version, scope, evidence, policy that requires review, limits, verification criteria, consequence of holding.
- **Agent decisions:** the affected agent or capability, what Crosswork AI already tried, the affected jobs, the bounded control offered (for example, restrict new assignments), and the treatment of work already in flight.
- The priority order and why it is the order.

**Decision enabled:** Authorize, request revision, or hold a plan; apply or decline a restriction; retain a boundary.
**Review check:** For each decision, the person can state the authority type, the exact scope, and what happens if they wait.
**Replaces:** Op “Make decisions”, Gov O2 and O6.

### OC4 — Supervise execution within bounds · Both

**User statement:** “I can see agents act inside what was authorized, and I know when the boundary stopped something or when conditions require another decision.”

- Checking, executing, and reconciling as separate confirmed states.
- **Boundary enforcement as its own fact:** a prevented request means the control worked, and no operation was issued.
- Revoked, expired, or changed authority stops unissued writes. It does not undo an operation already issued.

**Decision enabled:** Keep watching, hold further changes, or address a new decision.
**Review check:** The person can tell “prevented by policy” from “execution failed” and from “execution unknown”.
**Replaces:** Op “Supervise execution”, Gov O3 and part of O4.

### OC5 — Trust results · Both

**User statement:** “I know what actually changed, whether it achieved the intended result, and what remains unproven.”

- Submitted decision → effective authority → acknowledged execution → operation completed → verified outcome, each as a separate record.
- Verification criteria with met, pending, unavailable, or failed states and their evidence.
- A scoped result. One verified job never produces a global all-clear.

**Decision enabled:** Accept the result, or follow the remaining verification or recovery.
**Review check:** The person never mistakes “operation completed” for “verified”.
**Replaces:** Op “Trust results”, Gov O5.

### OC6 — Rely on the agents · Gov

**User statement:** “I know which agents and capabilities I can rely on, which are deteriorating, and how that affects the work.”

- Agent and version availability, capability-specific reliability, and the jobs that depend on it.
- A healthy agent with a blocked job, a degraded capability, and an unavailable agent as distinct conditions.
- Recovery and failover that Crosswork AI has actually performed, and any restriction in effect.

**Decision enabled:** Follow recovery, or act on an escalation through OC3.
**Review check:** The person can distinguish “agent healthy, job waiting for source access” from “capability degraded”.
**Replaces:** Gov O7, and Op use case 7.

### OC7 — Stay accountable · Gov

**User statement:** “I can show who did what, under which authority, and what it established — and I know when that trace is incomplete.”

- Each consequential record links the job, agent and version, the policy and authority valid at action time, and the evidence.
- A prevented request, a suspected deviation, a confirmed unauthorized action, and a missing trace are separate states.
- No compliance percentage or all-clear derived from a subset of records.

**Decision enabled:** Inspect the trace, or contain an affected agent through OC3.
**Review check:** For any record in Actions, the person can name its actor, authority, and evidence, or see that the link is missing.
**Replaces:** Gov O4 and the accountability part of O5.

### OC8 — Keep oversight as work grows or is interrupted · Both

**User statement:** “I keep track of all permitted unresolved work, even when there is a lot of it, nothing is happening, or my data is stale.”

- A bounded working set with routes to all activity, decisions, and records.
- Quiet, empty, filtered, interrupted, and incomplete-coverage states that never pretend to be healthy.
- Reading position, focus, and selection preserved through live updates.

**Decision enabled:** Find the most consequential item next.
**Review check:** No pending decision is hidden by a filter, the working-set limit, or a data interruption.
**Replaces:** Op “Continue oversight” and use case 10, Gov S5.

### Supporting outcome — Reach what enables the work

Integrations and source access, agent catalog, permitted LLM configuration, observability, and help are reachable from the job, decision, or health condition that needs them. They do not lead the landing page. (Gov O8.)

### Anti-outcomes — what must never happen

- A decision control appears before its proposal can be inspected.
- A submitted decision, an executed operation, or a completed tool step looks like a verified result.
- A waiting job is shown as an agent failure, or a degraded capability is hidden because no job is currently failing.
- A prevented request is shown as a violation, or a missing trace is shown as compliant.
- One job borrows another job's evidence, authority, or success.
- The page claims the network or the workforce is healthy because nothing is listed.

## 3. Where each outcome lives on the current page

No region is added. Each region keeps its question; governance content is added to the region that already answers that question.

| Region | Question | Operator content | Governance content |
| --- | --- | --- | --- |
| **Network** | Where is it happening? | Domains, incident markers, observed scope. | Marks for every job's scope, not only incidents. No agent or governance data on the map. |
| **Attention** | What needs my authority? | Change decisions (Review plan) and material exceptions. | Agent decisions (Review escalation), labelled with their authority type. A one-line “Being handled” note for conditions Crosswork AI already owns. |
| **Actions** | What has actually happened? | Plan authorized, execution acknowledged, operation completed, outcome verified. | Restriction effective, prevented request, compliance unconfirmed. Each opens its trace. |
| **Activity** | What is happening now, and by whom? | Job purpose, scope, state, checkpoint, stage bar. | One line per job: accountable agent, version, health. Degraded capability shown on the affected jobs. |

| Outcome | Network | Attention | Actions | Activity |
| --- | :-: | :-: | :-: | :-: |
| OC1 Know the state | ● | | | ● |
| OC2 Understand a finding | ○ | | | ● |
| OC3 Make decisions | | ● | | ○ |
| OC4 Supervise execution | | ○ | ● | ● |
| OC5 Trust results | | | ● | ● |
| OC6 Rely on agents | | ○ | | ● |
| OC7 Stay accountable | | | ● | ○ |
| OC8 Keep oversight | ○ | ● | ● | ● |

● primary · ○ supporting

## 4. The story

One continuous shift, using the existing three jobs so the prototype fixture can be extended rather than replaced. Governance is attached to the same jobs, not added as separate work. Names, versions and identifiers are illustrative.

| Job | Purpose | Accountable agent | Independent condition |
| --- | --- | --- | --- |
| **ROUTE-104** | Restore approved routing intent on XR-R07. | Remediation agent R1 v2.3 | Production correction requires a delegated change reviewer. |
| **CHECK-208** | Check recent configuration changes on XR-R12. | Config Drift agent D1 v1.8 | Read-only; completes under existing authority. |
| **REACH-319** | Investigate intermittent reachability in Metro East. | Network Troubleshooter T1 v3.1 | Needs archived event-source access; T1's collection capability later degrades. |

### Scene 1 — Arrive to shared, continuing work · OC1, OC8

**Network:** XR-R07 shows its active incident; XR-R12 and Metro East carry a quiet work mark.
**Activity:** Three jobs, each with its agent and health. ROUTE-104 *Assessing* (R1 · Healthy). CHECK-208 *Assessing* (D1 · Healthy). REACH-319 *Waiting for source access* (T1 · Healthy).
**Attention:** “No decisions require your review.”
**Actions:** Existing records only.
**The person can say:** “Three jobs are running. One is blocked on access, not on a broken agent.”

### Scene 2 — A finding becomes meaningful · OC2

**Activity:** ROUTE-104 changes in place to “Drift confirmed against approved routing intent”. The incident criteria are met, so INC-104 is linked to it. CHECK-208 completes: “Changes match their authorized records.”
**Actions:** “Independent assessment completed” for CHECK-208.
**The person can say:** “XR-R07 is real drift. XR-R12 was expected change.”

### Scene 3 — An agent's capability starts to deteriorate · OC6

**Activity:** REACH-319's T1 line changes to “Degraded collection — repeated timeouts, recovery in progress”. The job stays *Waiting*. No other job changes.
**Attention:** Still no decision. A one-line “Being handled: Crosswork AI is recovering T1 collection” note.
**The person can say:** “T1 is getting less reliable, and Crosswork AI is already dealing with it.”

### Scene 4 — Two decisions, two kinds of authority · OC3

**Attention:** Two Basic cards, ordered by consequence with the reason shown.

1. **Review configuration response** — *Change authority.* Production correction on XR-R07 requires your review.
2. **Review agent escalation** — *Governance authority.* T1 collection recovery is exhausted; no eligible replacement. Restrict new production assignments to T1 collection?

**Activity:** ROUTE-104 *Review required*. REACH-319 *Constrained*.
**The person can say:** “I have two separate decisions: one about the network, one about an agent.”

### Scene 5 — Decide both · OC3, OC7

The person reviews the plan (scope, version, evidence, criteria) and authorizes v1. Then they review the escalation (attempts, affected jobs, treatment of in-flight work) and apply the restriction.
**Attention:** Each card shows *Decision submitted* until it is confirmed, then leaves the active set.
**Actions:** “Plan authorized · v1”, then “Assignment restriction effective · T1 collection v3.1”. Each record links to its authority.
**Activity:** ROUTE-104 *Checking*. REACH-319 stays *Constrained*; T1 is shown as restricted, not as healthy, and the job is not cancelled.

### Scene 6 — Execute within bounds; a boundary works · OC4, OC7

**Activity:** ROUTE-104 *Executing* after the controller acknowledges the operation.
**Actions:** “Controller execution acknowledged”. While executing, R1 requests one additional statement outside the reviewed scope. Policy prevents it: **“Prevented request — out-of-scope change not issued.”**
**Attention:** No new decision. The boundary did its job, and the record explains it.
**The person can say:** “The agent tried to go beyond what I approved, and the control stopped it.”

### Scene 7 — Completed is not verified · OC5

**Actions:** “Configuration operation completed — outcome not yet established.”
**Activity:** ROUTE-104 *Verifying*, with criteria pending one by one.
Then **Actions:** “Routing intent restored — scoped outcome verified.” ROUTE-104 *Verified*. INC-104 resolves.

### Scene 8 — Continue oversight · OC1, OC6, OC8

**Network:** XR-R07 incident cleared. Metro East keeps its work mark.
**Activity:** ROUTE-104 *Verified* (R1 · Healthy). CHECK-208 *Complete* (D1 · Healthy). REACH-319 *Constrained* (T1 · Restricted), with its next checkpoint.
**Attention:** “No decisions require your review.” A one-line note that T1 remains restricted.
**The person can say:** “The routing fix is proven. Metro East is still open, and I know why. T1 is contained.”

### State continuity

| Moment | ROUTE-104 · R1 | CHECK-208 · D1 | REACH-319 · T1 |
| --- | --- | --- | --- |
| Arrive | Assessing · Healthy | Assessing · Healthy | Waiting for source · Healthy |
| Finding | Drift confirmed · INC-104 | Complete | Waiting · Healthy |
| Deterioration | Plan prepared | Complete | Waiting · Degraded, recovering |
| Two decisions | Review required | Complete | Constrained · Escalated |
| Decided | Checking · authorized v1 | Complete | Constrained · Restricted |
| Boundary | Executing · request prevented | Complete | Constrained · Restricted |
| Verified | Verified | Complete | Constrained · Restricted |

## 5. Branches

The existing prototype branches stay. New branches cover governance outcomes the main story does not show.

| Branch | Status | Outcomes |
| --- | --- | --- |
| Expected change | Existing | OC2 |
| Missing evidence | Existing | OC2, OC8 |
| Plan held | Existing | OC3 |
| Revision requested | Existing | OC3 |
| Plan changed during review | Existing | OC3 |
| Execution unknown | Existing | OC4, OC5 |
| Partial result | Existing | OC5 |
| Verification unavailable | Existing; reframe as a capability condition on the verifying agent | OC5, OC6 |
| Data interrupted | Existing | OC8 |
| **Autonomous recovery succeeds** — T1 recovers, or an eligible replacement continues; no escalation | New | OC6 |
| **Compliance unconfirmed** — an action's authority trace is incomplete | New | OC7 |
| **Lacks authority** — the person holds change authority but not governance authority, or the reverse | New | OC3 |
| **Restriction lifted** — capability restored; eligibility re-evaluated | New | OC6, OC7 |

## 6. Use-case coverage after refinement

| Use case in [use cases and interactions](USE-CASES-AND-INTERACTIONS.md) | Outcomes | Change needed |
| --- | --- | --- |
| 1 Understand work on arrival | OC1, OC8 | Add the agent, version and health line to each job. |
| 2 Understand a finding | OC2 | Open in *Assessing*, not pre-classified. |
| 3 Review a bounded response | OC3 | Label the decision as change authority. |
| 4 Supervise authorized execution | OC4 | Add the prevented-request record. |
| 5 Verify the result | OC5 | None. |
| 6 Understand results and continue | OC5, OC8 | Include agent restriction in the closing state. |
| 7 Blocked work vs unhealthy capability | OC6 | Extend into the escalation and restriction decision. |
| 8 Concurrent work at scale | OC8 | Order agent decisions and change decisions on one list. |
| 9 Change during review | OC3 | Also apply to agent decisions. |
| 10 Quiet or interrupted states | OC8 | None. |
| **New: Review an agent escalation** | OC3, OC6 | New use case. |
| **New: Boundary prevents an action** | OC4, OC7 | New use case. |
| **New: Inspect accountability of a record** | OC7 | New use case. |

## 7. Suggested structural changes (not applied)

These are suggestions for discussion. The outcomes above work without them.

1. **Bring Attention into the first desktop view.** Today the 560 px map pushes Attention to about 795 px. Either shorten the map or place the Attention and Actions row above it. Without this, OC3 depends on scrolling.
2. **Give the Network region an outcome job.** Mark every job's scope, not only incidents, so the map supports OC1. Otherwise consider reducing it to a slim strip.
3. **Label authority type on Attention cards.** A small tag (“Change” or “Governance”) is content, not structure, but it decides whether OC3 works for one person holding both roles.
4. **Bound the Actions list.** Show the latest few records with *View all*, newest first, so OC7 records do not push Activity down.
5. **A persistent Agents destination** in the left navigation for deep governance (catalog, versions, eligibility, restrictions history). This is the only change to navigation, and it keeps deep governance off Home.

## 8. Review questions

1. ~~Can one person hold both kinds of authority?~~ Decided: yes, for this page. Persona-specific views are a later exploration.
2. ~~Which agent control should the story offer first?~~ Decided: **Restrict new assignments** is the primary control. **Reassign** is offered only when an eligible, authorized replacement exists (see *Autonomous recovery succeeds*). Hold and retire stay outside the daily story.
3. Should a prevented request appear only in Actions, or also briefly in Attention when it is a first occurrence for that agent?
4. Is the agent line on every job card enough for OC1 and OC6, or is a separate agent health summary needed?
5. Which structural suggestion, if any, should be tested first?

Options considered for question 2, using the T1 example (its collection keeps timing out and recovery has failed):

| Option | What happens | Effect on current work |
| --- | --- | --- |
| **Restrict new assignments** (current draft) | T1 gets no new production work that needs collection. | Existing jobs stay with T1 and wait. Lowest risk; easy to undo. |
| **Hold** | T1 pauses all its work now. | Existing jobs stop where they are. Stronger; may stall work that was fine. |
| **Reassign** | Move T1's jobs to another eligible agent. | Work continues, but only if a capable, authorized replacement exists. |
| **Retire** | Take this T1 version out of production. | Permanent; a governance change, not a daily decision. |

These are proposed outcomes and story for review. No UI change, stakeholder agreement, or production capability is established by this document.
