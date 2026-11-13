# NOC and traffic-engineering outcome pressure test

Date: 2026-11-13. Reviewed implementation: `5b42ffd` (`milestone/15-onecd-atmosphere`).

Status: **Ready for stakeholder review.** The structure is suitable for further validation; complete role and agentic outcome coverage is not established. This review changes no application code or UI.

## Request and interpretation

User request: “before implementation — recheck if this entire sections satisfy the outcomes of noc operator and traffic engineer” and ensure that “this entire story should be agentic based experience.” The immediate decisions are whether to simplify Connections and remove the Source alarms landing section.

Interpretation: validate the monitoring and incident-response outcomes before changing presentation. An uncluttered screen must preserve event coverage, access to connection evidence, the engineering decision path, and trustworthy autonomous work.

Scope: monitoring, diagnosis, response supervision, engineering escalation, recovery, and retained outcomes. The broader persona also covers service turn-up; that builder workflow is outside this landing-page assessment. The traffic engineer is assessed as the receiving specialist for exceptional cases, not as a requirement to put an entire engineering workbench on the landing page.

## Evidence register and boundaries

| ID | Source | Classification and limitation |
| --- | --- | --- |
| U1 | Current conversation: autonomous acknowledgement, routing, investigation, remediation and verification; backend agents are not the operator's task model | User decisions. These take precedence over older persona wording. |
| P1 | `/Users/kumprad3/Documents/cnc-context-persona/personas-v3/01-operator.md` | Supplied persona: watcher, builder, detective, guarantor; requires reasoning, sources, reversibility and no fabricated evidence. Its “AI drafts; the human commits” statement conflicts with the later autonomous-with-guardrails decision U1. Treat as historical reference, not implementation instructions. |
| P2 | `/Users/kumprad3/Documents/cnc-context-persona/personas-v3/03-ai-admin.md` | Supplied governance reference: centrally controlled autonomy, authority boundaries, auditable actions. No production policy service is implemented here. |
| C1 | `/Users/kumprad3/Documents/cnc-context/cisco-cnc.md` | Supplied CNC domain context. Used for terminology and the proposed engineering outcome model, not proof of current product/API availability. No separate traffic-engineer persona was supplied. |
| D1 | `docs/consolidated-operations-dashboard.md` | Current design intent and scope. A specification is not evidence that every stated behavior is complete. |
| I1 | `src/features/wan/model/agentic-model.js`, `model.js`, `watch-model.js` | Direct source evidence for deterministic prototype behavior. No real controller, agents, live telemetry or engineering recipient is connected. |
| I2 | `src/features/wan/operations/*`, `AgentWorkspace.jsx`, `WanOverview.jsx` | Direct implementation evidence for the operator-visible experience and available detail. |
| V1 | Existing automated suite re-run during this review | 103 tests pass. This is bounded regression evidence; it does not establish role fit or cover the newly reproduced defects below. |
| V2 | Read-only model probes and an isolated browser review | Reproduced failed/unknown progression, cross-case answers, restored-collection answers, accepted handoff without continuation, and outcome discoverability. The isolated browser tab was closed; the working dashboard tab was not changed. |

All judgments below are source-based assessments of the concept. They are not findings from a user study with practicing NOC operators or traffic engineers.

## Overall finding

**Retain the four section homes. Do not treat their current contents as complete role coverage.**

- NOC: the main interface-congestion lifecycle and several uncertainty/authority branches are demonstrated. Service or policy impact, operational workload scale, event completeness, and equivalent outcomes for other incident types remain incomplete.
- Traffic engineer: reason for handoff, resource scope and receiving-owner acceptance are demonstrated. Decision-grade path/constraint evidence and the engineer's continuation to a verified outcome are not.
- Agentic experience: automatic ownership and bounded main-path execution are demonstrated. Adaptation, failed or stalled agents, recovery from harmful change, and the full engineering exception loop are not. Specialist labels and motion do not establish these capabilities.

## Role outcomes

| Outcome | NOC assessment | Engineering assessment | Evidence / practical limit |
| --- | --- | --- | --- |
| Know what is current, unhealthy or unknown | Demonstrated in bounded cases | Useful entry context | Domain observations and Data health separate telemetry gaps from current reachability. Independent topology/reachability collection failures are not modeled. |
| Locate domain → device group → router → interface | Demonstrated | Demonstrated as resource context | Scope and peer inspection exist. A logical schematic is not a complete policy-path or service-dependency view. |
| Recognize developing conditions | Partial | Partial | One 73% pre-threshold utilization rise is shown. Persistence, forecast, cause and time-to-risk are not established. |
| Prioritize by consequence | Partial | Partial | Critical router, interface and collection cases have fixed ordering. Service impact, loss of redundancy, policy intent, age of blocked work and affected critical traffic are not modeled. |
| Follow work without prompting agents | Demonstrated for the main fixture | Partial | Automatic acknowledgement, investigation, execution and exception routing exist. Candidate reasoning and routes are scripted. |
| Know why attention is needed | Demonstrated for known exceptions | Partial | Missing response, restricted scope, target lock, unavailable catalogue, failed/unknown job have reasons. A complete engineering decision package is absent. |
| Choose or assess a safe engineering response | Not a routine NOC task | Not demonstrated | Fixed SR policy and response catalogue are named, but alternate-path capacity/dependency checks are asserted, not supported by inspectable candidate constraints and results. |
| Continue after engineering accepts | Partial: acceptance visible | Missing continuation | Acceptance does not lead to an engineer decision, revised response, permitted execution and verified closure. |
| Distinguish job completion from network recovery | Strong main-model behavior, UI conflict remains | Same | Main verification requires execution and independent source checks. Assistant progress can contradict actual failure. |
| Explain service impact without reducing all issues to service degradation | Not demonstrated beyond explicit uncertainty | Not demonstrated | No service/SLA dependency model. Network failures, resilience risks and controller visibility loss must remain valid conditions even when service impact is unknown or absent. |
| Reverse or recover from a harmful change | Missing | Missing | Pause is correctly not represented as cancellation or rollback. No rollback job, partial-change reconciliation or post-rollback proof exists. |
| Retain completed work and recurrence evidence | Partial | Partial | Recent and episode comparisons are interface-congestion records. Device/collection records have no equivalent discoverable outcome home; recurrence does not establish common cause. |

## Scenario pressure-test matrix

“Demonstrated” means the deterministic concept supports the specific bounded behavior. It is not a production capability claim.

| Scenario | Result | What the next story must establish |
| --- | --- | --- |
| Quiet network | Partial | The scope and freshness behind “within limits”; no implication of comprehensive health from one utilization metric. |
| Utilization rising below threshold | Demonstrated, limited | A developing observation stays distinct from a confirmed incident. Do not call two recorded points a validated forecast. |
| Interface congestion with approved remediation | Demonstrated, limited | Keep automatic ownership and independent recovery; make the engineering basis of the chosen action inspectable. |
| Related Minor alarms with the Major | Partial | Known three-alarm grouping exists; demonstrate disposition of unmatched, pending-correlation and ambiguous events. |
| Simultaneous Critical router fault | Partial | Priority and separately scoped panels exist. Assistant answers must use the selected case's evidence. |
| Telemetry collection gap | Partial | Preserve uncertainty and independent observations; establish autonomous repair/route and source-specific restoration proof. |
| Configuration description drift | Partial | Show whether the difference is harmless, operationally relevant, or unknown; retain agent ownership/disposition. Do not invent forwarding impact or auto-restore without authority. |
| Planned maintenance | Partial | The declared 09:00 window and pending checks are separate context. Expected effects versus unexpected incidents during execution are not demonstrated. |
| No applicable response, authority restriction, target lock, unavailable catalogue | Demonstrated until handoff | Preserve the exact reason and active agent responsibility while engineering decides. |
| Engineer accepts the handoff | Missing continuation | Establish the decision needed, receiving owner, updated evidence, revised response and route back to execution/verification or justified closure. |
| Controller job fails or result is unknown | Model blocks resolution; UI trust defect | One truthful status across assistant, incident, activity and outcome, plus reconciliation before another operation. |
| Source improves without successful execution | Demonstrated main-model protection | Source clearance is not a successful response. Explain the remaining follow-up and its owner. |
| Partial change or adverse post-change effect | Missing | Determine what changed, stop further work appropriately, preserve the actual job result, and follow a supported recovery/reversal path. |
| BGP/IGP/PCEP or policy-control fault | Not modeled | Include at least one non-congestion control-plane/policy-intent story, with network and service consequences separately qualified. |
| Controller/agent unavailable or stalled | Not modeled beyond catalogue loss | Work cannot remain indefinitely “investigating” without a supported status, owner, dependency and next action. |
| Router reachability restored | Partial | A restoration observation is retained internally; independent verification and a discoverable retained outcome are incomplete. |
| Collection restored | Partial, chat trust defect | Source restoration must not borrow the interface's alarm, threshold, job or stability interval. |
| Repeated occurrence | Partial | Comparison is honest about unknown common cause; follow-up ownership and prevention are not demonstrated. |
| Busy watch with many concurrent cases | Not demonstrated | Inventory scale is represented, but the queue is three hardcoded workstreams and Updates is limited to four items. Establish attention, aging and selection behavior under workload. |
| Toxic-factor detection | Undefined | Obtain a concrete meaning/example before claiming detection, explanation, routing or remediation. No placeholder risk should be presented as a finding. |

## Reproduced trust defects — resolve before the next visual iteration

### A. Failed or unconfirmed execution can look successfully remediated

Observed with frame 11 and `runOutcome: 'failed'` or `'unknown'`:

```
job.status: failed / unknown
response.resolved: false
response.steps: Investigate complete; Remediate complete; Verify blocked
```

`AgentWorkspace.jsx:17–35` renders these steps directly. The lower incident locally corrects their meaning in `SituationSections.jsx:16–24`, so the same case has contradictory progress across surfaces. Assistant activity also renders every event with a complete variant, including failed/unavailable events.

Source: `agentic-model.js:158–160`, `AgentWorkspace.jsx:65–85`. Browser confirmation at 08:35 showed RUN-017 Failed, no successful response, and an assistant Remediate stage labelled Complete. Evidence: [failure summary](screenshots/outcome-pressure-test/failed-execution-summary.png), [conflicting stage and narrow connection fallback](screenshots/outcome-pressure-test/failed-execution-complete-stage.png).

### B. Conversation answers borrow evidence from another case

Observed on the independent device incident at 08:12:

- “What changed?” answers with the main interface's 92% utilization and its preceding 93% sample.
- “What else is affected?” names East / XR-PE-E2 and then asserts association with SR-PE-W1-PE-E1, without an established relationship.

The generic branches in `agentic-model.js:196,198` bypass case-specific evidence. Correctly scoped case panels do not prevent this conversational defect.

### C. Collection restoration receives invented interface recovery proof

At 08:12, restore a West collection gap, select the collection case, and ask “Is recovery complete?” The answer claims source-alarm clearance and below-80% observations throughout 08:30–08:35. Those later interface facts are not collection restoration evidence. `agentic-model.js:199` uses interface-specific proof for any response marked resolved.

These defects concern truthfulness in the concept. They do not indicate that any real network change occurred.

## Engineering exception loop — the missing part of the story

Read-only probe: open a no-match handoff at 08:05, record engineer acceptance, and advance to 08:35.

```
handoff.status: accepted
response.stage: Investigating
job.status: not-started
response.resolved: false
```

This correctly avoids inventing an operation, but there is no modeled continuation. Execution and verified resolution are gated while the handoff remains present (`agentic-model.js:14,69,143`), and acceptance only records acknowledgement (`:220–222`).

The engineering outcome to validate is: Arun can understand the exact decision requested, inspect timestamped evidence and impact known/unknown, assess an action and alternatives against policy/path constraints, establish a permitted change and recovery plan, and follow its actual execution to independent verification. Agents continue collection, analysis and verification around the human decision. Priya does not become the dispatcher between agents and engineering.

The current delivered snapshot (`agentic-model.js:109–115`) contains scope, source time, one main-case metric, alarm, job status, reason and notes. It does not carry the complete job/output record, path comparison, constraint results, service dependencies, competing changes or proposed reversal evidence needed to establish that outcome.

## Implications for the existing section hierarchy

| Surface | Distinct outcome worth preserving | Pressure-test condition |
| --- | --- | --- |
| WAN overview | Locate conditions and inspect actual relationships | Maintain access to off-page, cross-domain and narrow-layout connections. A schematic alone does not prove an engineering path satisfies intent. |
| Updates | Notice a meaningful change in ongoing work | Current descriptions still lead with backend contributor names. The operator should understand the work, result or exception without decoding the agent roster. |
| Incidents | Follow agent-owned problems through evidence, intervention boundary and verification | Every incident type needs a coherent continuation; truthful shared state and case-specific conversation are prerequisites. |
| Watchlist | See developing exposure before incident promotion | The current example supports a utilization trend, not a general risk forecast or a populated network-wide watch. |
| Changes | Understand intended/observed differences and declared work | The current finding is evidence-only. Its significance, agent disposition and retained outcome need a story. |
| Recent | Review completed work and its proof | Include relevant completed work across incident types, with verification appropriate to each case. Do not force every case to require a configuration job. |
| Data health | Understand limits on the current picture and affected decisions | Current telemetry gaps work. Controller/control-plane/agent availability and the consequences of other missing sources remain untested. |

## Revised assessment of the two proposed removals

**Connections:** simplify the presentation, preserve the capability. The existing list is not wholly redundant:

- At map width ≤640px, `WanOverview.jsx:250–285` hides connection routes and route controls, and directs the operator to the list below. This was observed when the assistant was docked at the review viewport.
- Paged maps expose only their visible corridors and count off-page connections.
- Within a domain, the map receives only within-domain group bundles, while the list also exposes cross-domain group bundles (`WanOverview.jsx:390–391,432–446`).

Removing all list access would lose evidence. A quieter contextual text disclosure is a plausible presentation direction from the prior discussion, not a validated final interaction design.

**Source alarms:** the duplicate landing panel can be a removal candidate, but a no-lost-event outcome must be established first. The current known fixture groups CNC-1042/1043/1044 into one interface workstream. It does not demonstrate a general path for every new or unmatched event. The accountable dispositions to validate are linked incident, explained expected/suppressed event, active correlation, or an unclassified condition requiring attention. Original source alarms must remain inspectable with incident evidence; hiding the landing list is not equivalent to proving complete correlation.

## Story coverage to validate next

Keep the existing 07:55–08:35 congestion story as the baseline, then exercise its decision boundaries through these additional journeys before another presentation cleanup:

1. Autonomous response succeeds and independently verified recovery follows.
2. A response needs engineering judgment; Arun accepts, decides, and agents continue the same case toward a supported outcome.
3. A network/control-plane condition threatens resilience or policy intent without confirmed service degradation.
4. Missing telemetry or controller/agent capability prevents a trustworthy decision; the case remains owned through restoration or an explicit engineering boundary.
5. A configuration drift finding receives an agent-owned significance assessment and disposition.
6. A failed, unknown or harmful change is reconciled and followed through a supported recovery path.
7. Many concurrent conditions include an unclassified event, changing priorities, and an operator inspecting another case.

Agentic success is observable when work starts from events, keeps an accountable owner, gathers case-specific evidence, adapts or explains why it cannot proceed, requests only the required human decision, and verifies the case-specific outcome. Chat, contributor names, animation and a completed controller job are insufficient proof on their own.

## Stakeholder review decisions and validation

- Confirm monitoring/response scope and the traffic engineer's receiving-specialist outcome; a separate engineering persona remains a validation need.
- Confirm that delegated autonomy in the later story supersedes the persona's older human-commit wording. Governance configuration belongs to the AI Admin; the operator needs the relevant boundary and evidence.
- Agree which non-congestion and engineering-continuation journeys are mandatory in the next concept story.
- Define toxic-factor detection with a concrete example or leave it explicitly out of scope.
- Review the journeys with a NOC operator and traffic engineer using outcome questions: what is affected, what is known/unknown, what work is underway, who owns the next decision, and what proves recovery? This source/fixture audit does not replace that role validation.

Recommendation for the next iteration gate: preserve the current hierarchy, resolve the reproduced truthfulness defects, and establish the missing engineering and event-coverage journeys before removing access or adding visual treatment.
