# Current NOC and agentic direction

Updated: 2026-11-13. Status: current user direction; revised story coverage ready for review. No application code or UI changed in this clarification pass.

## Scope decision

The user clarified: “forget about the traffic engineer” and focus on agents with network visibility through a knowledge graph and detailed sources, so that the NOC operator can complete the work without another engineer's involvement.

The primary actor is the NOC operator. CW AI owns investigation, planning, remediation and verification. The operator remains in the controller, understands the condition and agent work, asks questions, sets or clarifies an operational objective when necessary, and can intervene by choice. The operator does not routinely acknowledge to start work, select agents, coordinate specialists, assemble evidence or hand off a case to a human traffic engineer.

This decision supersedes the dual-role scope in [the earlier pressure test](agentic-outcome-pressure-test.md), its engineer-acceptance story gates, and the older persona's mandatory human-commit wording. Monitoring, troubleshooting, remediation and verification remain the landing-page focus; this clarification does not add a service-provisioning workflow.

## Capability assumptions and proof

The user supplies the target capability: specialist agents can use a comprehensive network knowledge graph and detailed connected sources. The current deterministic prototype does not implement or prove that backend. Future concept stories must demonstrate what the capability enables rather than presenting a knowledge-graph badge or an agent roster as proof.

Useful visible results include:

- Several alarms are understood as one condition with inspectable relationships and original source evidence.
- Affected routers, interfaces, adjacencies, policies, dependencies, and services where relevant are identified. A network fault or reduced resilience does not require a confirmed service outage.
- Telemetry, topology, configuration, routing state, logs and controller results are reconciled with their own timestamps and scope. Broad visibility does not remove the need to distinguish fresh, stale, conflicting and unknown evidence.
- Candidate responses are compared against intent, capacity, dependencies, competing changes and permitted effects. The selected response has an inspectable reason and expected outcome.
- New evidence changes the plan when necessary. The system follows actual execution and subsequent effects rather than advancing a predetermined success animation.
- Recovery is established with criteria appropriate to the case, including relevant downstream consequences. A configuration job is not mandatory for a condition that recovered without one.

## Revised operational journey

**Detect → enrich from the knowledge graph → investigate → compare responses → validate constraints → execute → observe effects → adapt or recover → verify → retain outcome.**

Lack of a matching playbook becomes a planning and validation problem for the agents. It is no longer a default human-engineering handoff. This assumes the target agent platform supports constructing and validating responses within its configured autonomy; the current prototype's fixed-catalogue gate must not be presented as that capability.

An unknown execution result triggers agent-led reconciliation of the controller and actual network state before another operation. A partial or adverse result triggers an appropriate supported recovery/reversal path and renewed verification. If a real dependency blocks progress, CW AI retains ownership and shows the dependency, work underway and next supported action. Neither indefinite “Investigating” nor invented success satisfies the outcome. Routine operator approval is not inserted into the normal journey.

## Operator outcomes by existing surface

| Surface | Agentic contribution | NOC outcome |
| --- | --- | --- |
| WAN overview | Relates current conditions to actual network resources and dependencies | Understand where a condition is and what else is implicated. Preserve connection access in narrow, cross-domain and off-page cases. |
| Updates | Reports significant findings, actions, adaptations and measured effects | Notice meaningful developments without following the backend agent roster. |
| Incidents | Maintains one owned investigation and response from detection through verification | Understand what CW AI is doing, why, and what the evidence supports. |
| Watchlist | Investigates developing exposure and relevant dependencies | Understand what is being watched or prevented before further degradation. Do not invent a forecast without supporting evidence. |
| Changes | Assesses configuration differences against intended state and consequences; acts or records a reasoned disposition | Understand whether drift matters and what CW AI has done about it. |
| Recent | Retains case-specific outcomes and evidence across relevant incident types | Trust the outcome and review how it was achieved. |
| Data health | Explains uncertainty and agent work to restore a trustworthy picture | Understand which decisions are affected by a missing or conflicting source. |

## Revised pressure-test journeys

1. A developing condition is investigated and mitigated autonomously before further degradation.
2. A known incident reaches permitted execution and independently verified recovery.
3. No matching playbook exists: agents gather more evidence, construct and validate a permitted response, execute it and verify the result in the same case.
4. A routing/policy or resilience condition is detected and addressed without assuming a service outage.
5. Configuration drift is classified, assessed for consequences, and corrected or explicitly retained with a reason.
6. Missing/conflicting data or an unknown job result produces agent-led reconciliation, preserving case-specific uncertainty and avoiding a duplicate change.
7. A partial or adverse response produces supported recovery/reversal, a revised plan and independently verified restoration.
8. Concurrent and unclassified conditions remain accounted for; stalled or failed agent work retains an accountable owner and a supported next action.
9. Router, collection, policy and configuration outcomes remain discoverable alongside congestion outcomes.

The three reproduced truthfulness defects in the earlier pressure test remain next-iteration gates: contradictory remediation progress, answers borrowing another case's evidence, and interface-specific recovery proof used for collection restoration. Removing the human engineer does not remove these defects.

## Story example

Congestion is detected. CW AI relates the symptoms, interface, policy path, recent configuration and dependencies through the knowledge graph. The initial candidate lacks capacity on a dependent path. Agents discard it, validate another permitted response, apply it and monitor actual effects. A controller completion record alone does not close the incident. Fresh network observations and relevant post-change criteria establish recovery; the result is retained in Recent. Priya can understand and inspect the work throughout without initiating each task or involving another engineer.

This example is proposed story behavior, not a claim that the existing fixed scenario already implements adaptive planning.
