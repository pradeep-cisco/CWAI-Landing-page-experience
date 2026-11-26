# Agent-centric landing — concept and outcomes

Updated: 2026-11-24. Status: **Concept, decisions and value outcomes drafted; task goal drafted.** Step 2 of 5: concept and outcomes → task goal → story → use cases → implementation. Nothing here is implemented. The prototype will be a new option, **04 · Agent-centric**; 03 · Combined stays as it is.

## 1. Why rethink

03 · Combined is built around network jobs, with agents as a supporting line. Its map repeats what the CNC topology view already does. The new landing page puts the **agents** at the centre: what the person can ask them to do, what they did, and what the person needs to do next.

Same person as before: one operator-governor who holds both change authority and governance authority ([outcomes and story](../operations-governance/OUTCOMES-AND-STORY.md)).

### How agents work in Crosswork AI

- Agents read network data through **data retrieval adapters (DRAs)**. Each DRA connects to one source — CNC, NSO, or a third-party system — and is set up during onboarding.
- Agents reason with the **LLM**, also set up during onboarding.
- So when agent work is stuck, the cause is one of four things: the agent itself, its DRA, the source behind the DRA, or the LLM. The page always says which, and links to the right fix. A healthy agent with a missing DRA is not an agent failure.

## 2. The three questions

| Question | What the person means | Answered by |
| --- | --- | --- |
| **What can I do?** | Which actions can I start or control right now, through which agent, and is it ready? | Actions the operator can start (investigate, assess, verify) and controls over agents (restrict, resume). |
| **What happened?** | What did the agents do, what did it establish, and what is still running? | Agent work and its results, in plain language, with proof and authority one click away. |
| **What should I do?** | What needs my decision, and what do the agents recommend? | Required decisions first, then optional recommendations, each with a reason. |

## 3. Concept directions

| Direction | Shape | Strength | Weakness |
| --- | --- | --- | --- |
| **A. Three-question page** (recommended) | Three regions, one per question. Agent named on every item. | Each question has one obvious place. Close to the current structure, so cheap to test. | Agents are visible per item, not as a group. |
| **B. Agent roster** | One row per agent, each with its own "happened / needs you / can do". | Strongly agent-centric. | Decisions scatter across agents; hard to see "what should I do" at once. |
| **C. Briefing-led** | A short Crosswork AI briefing at the top ("Since 07:00, agents did X; 2 things need you"), then the regions. | Answers all three questions in one glance. | Risk of a summary that repeats the regions below. |

**Chosen:** A, without a briefing line. The page communicates its state through the three regions themselves. B's agent view becomes a filter: selecting an agent narrows all three regions to that agent.

### Proposed page

| Order | Region | Content |
| --- | --- | --- |
| 1 | **What should I do?** | Required decisions (Change / Governance tags), then **Suggested** next steps from agents. Quiet when empty. |
| 2 | **What happened?** | The **current issues seen in the network** and what agents have done about each: investigating, proposed, executing, verified, prevented, failed. Each issue shows its scope, the agent working on it, and what has been established. Resolved issues leave this region once verified; their record stays reachable. |
| 3 | **What can I do?** | Actions to start, grouped by goal (Investigate, Assess, Verify), each showing the agent that will do it, its readiness, and the authority it needs. Agent controls (restrict, resume) sit here too. |

Urgent question first (agreed 2026-11-24).

### Coherence: one set of issues, three questions

The three regions are not three separate feeds. They are three views of the **same current issues**:

- **What happened?** shows an issue and what the agents have done about it.
- **What should I do?** shows the decision or suggestion that issue now needs from me.
- **What can I do?** leads with the actions that apply to those issues.

So a reader can follow any issue across the page: *Metro East reachability is intermittent* → *T1 is investigating but collection is degraded* → *Review the T1 escalation* → *Start a source-access check for Metro East*. Every item names its issue; selecting it highlights the same issue in the other two regions. Nothing appears in one region that has no explanation in another, except standalone actions the person can always start.

This is what lets the page explain itself without a briefing line.

**Removed:** the network map. Network scope appears as text on each item and links to the CNC topology view.

## 4. Value outcomes

The outcomes are written as **value to the operator**: what changes in their day because agents do the work. Each one passes the same test: *what would the operator have to do without the agents?* If the answer is "the same thing", it is not an agentic outcome.

1. **Start from understanding, not alarms.**
   - Without agents: read alarms, events and dashboards, and correlate them by hand into issues.
   - With agents: see a short list of current issues, each already explained — scope, what is established, what is not.
2. **Arrive to work already done.**
   - Without agents: spend the first part of every issue gathering evidence — log in, compare config with intent, check change records.
   - With agents: find that work finished or in progress, with the evidence attached and the agent named.
3. **Spend judgement only where it is needed.**
   - Without agents: approve or watch every step, or trust automation blindly.
   - With agents: be asked only for decisions that need your authority, each with the exact change, the consequence of waiting, and whether it is a change or governance decision.
4. **Know the next best step.**
   - Without agents: work out what to do next from experience and runbooks.
   - With agents: get a suggested next step for each issue, with the agent's reason, clearly optional.
5. **Act in one step, safely.**
   - Without agents: switch tools, find the right script or team, and run it, hoping it is safe.
   - With agents: start the right action from the issue itself, see which agent will do it and whether it is ready, and know nothing changes in the network without your approval.
6. **Know it actually worked.**
   - Without agents: re-check after every change, because "command succeeded" is not proof.
   - With agents: see an outcome marked verified only when the agent has checked it against the agreed criteria; anything unproven stays open.
7. **Delegate with confidence.**
   - Without agents: no view of whether automation is reliable until it fails.
   - With agents: see when an agent starts degrading, before work fails, and contain it with one bounded decision.
8. **Account for everything without reconstructing it.**
   - Without agents: rebuild who did what from tickets, chat and device logs.
   - With agents: open any result and see the agent, version, authority and proof, or exactly which link is missing.

**Foundation — never a false all-clear.** The page never claims the network or the agents are fine just because nothing is listed. A quiet network, missing visibility, and stale data each look different. Without this, none of the outcomes above can be trusted.

### How we would know the value is real

- **Understanding and work already done:** time from opening the page to explaining each current issue; number of alarms compared with the number of issues shown.
- **Judgement only where needed:** decisions per shift; decisions made without leaving the page; decisions later reversed.
- **Next best step:** how often suggestions are taken, and whether they resolved issues faster.
- **Act safely:** tool switches needed to start common actions; unintended network changes (target: none).
- **Know it worked:** issues reopened after being marked verified; manual checks after changes.
- **Delegate with confidence:** time from an agent degrading to it being contained; work affected in between.
- **Account for everything:** time to answer "who changed this, under what authority?"

### Not carried forward on the landing page

- The network-state view and the map: replaced by scope text on each issue and a link to CNC topology.
- Understanding a single finding: now part of the first two outcomes, shown in each issue's detail.

## 5. Anti-outcomes

- An action looks available when its agent is restricted, degraded, or lacks access.
- Starting an action silently changes the network.
- A suggestion looks like a required decision, or the reverse.
- "What happened" shows a raw tool-call stream instead of meaningful results.
- An item in one region has no explanation in the others, so the reader cannot tell which issue it belongs to.
- The page claims the network or the agents are healthy because nothing is listed.

## 6. How this differs from 03 · Combined

| | 03 · Combined | 04 · Agent-centric |
| --- | --- | --- |
| Lead object | Network job | Agent and its work |
| Network map | Top of page | Removed; link to CNC topology |
| Starting work | Not possible from Home | **What can I do?** region |
| Recommendations | None | **Suggested** items in What should I do? |
| Regions | Attention / Actions / Activity | What should I do? / What happened? / What can I do? |

## 7. Decisions

| # | Question | Decision |
| --- | --- | --- |
| 1 | Region order | Urgent first: What should I do? → What happened? → What can I do? |
| 2 | What can I do? scope | Lead with actions that apply to the current issues, with a **See all actions** route to every permitted action. |
| 3 | What happened? content | The current issues seen in the network and the agents' work on them, not a time window. |
| 4 | Briefing line | None. The regions and the shared issues communicate the page's state. |

## 8. Task goal (draft)

> **When I open Crosswork AI, I want to see the network's current issues, what the agents are doing about them, and what I need to do — so I can act on the few things that need me and trust the agents with the rest.**

The landing visit succeeds when the person can, within one look and without opening detail:

1. Name the current issues and the agent working on each.
2. Name what needs their decision and which authority it needs.
3. Tell a suggestion from a required decision.
4. Find the action they would take next for any issue, and whether its agent is ready.
5. Tell a quiet network from missing visibility.

Next step: the story, built from this goal, following the same issues through all three regions.
