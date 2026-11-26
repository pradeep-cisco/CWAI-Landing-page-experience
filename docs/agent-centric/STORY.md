# Agent-centric landing — the story

Updated: 2026-11-24. Status: **Draft for alignment.** Step 3 of 5. Built from the task goal and value outcomes in [concept and outcomes](CONCEPT-AND-OUTCOMES.md). Nothing here is implemented.

## The person and the morning

Priya is a network operator who also governs the agents that work on her network. She signs in at the start of her shift. She was not here overnight, but the agents were.

The agents read the network through **data retrieval adapters (DRAs)** set up during onboarding — CNC, NSO and third-party sources — and reason with the LLM set up the same way. When work gets stuck, the page tells her whether the cause is the agent, a DRA, the source behind it, or the LLM.

Three things are going on when she arrives:

- **Routing on XR-R07 no longer matches its approved intent.** The remediation agent read the configuration through the CNC DRA, confirmed the drift, and prepared a fix. Production changes need Priya's approval.
- **Reachability in Metro East is intermittent.** The troubleshooting agent is investigating. It needs last week's event history, which lives in a third-party event archive that no DRA connects to yet. Separately, the agent's own analysis keeps failing — even though the CNC DRA it reads from works fine for the other agents.
- **Configuration on XR-R12 changed overnight.** The config drift agent checked it against the change records in NSO. It was an approved change, so nothing needs doing.

The story follows these same three issues from sign-in to mid-morning. Each moment names the value Priya feels.

## The page she lands on

Three regions, read top to bottom:

1. **What should I do?** — decisions that need her, then suggestions.
2. **What happened?** — the current issues and what the agents have done about each.
3. **What can I do?** — actions she can start, led by the ones that fit the current issues.

There is no map and no summary banner. The three issues appear across the regions, and selecting any item highlights the same issue everywhere on the page.

## The journey

### 1. Sign in

- **Touchpoint:** sign-in page, then Home.
- **She sees:** Home loads straight into the current state. A brief skeleton while data arrives; no welcome screen, no handover step, no replay of the night.
- **Behind the scenes:** the agents kept working all night; nothing restarts because she arrived.
- **Value — start from understanding:** her first screen is the current situation, not a blank dashboard she has to fill in.

### 2. First glance

- **Touchpoint:** the whole Home page.
- **She sees:**
  - What should I do? — two decisions and one suggestion.
  - What happened? — three issues, each with its scope, the agent on it, and its state. XR-R12 is marked *Settled · new to you*.
  - What can I do? — two actions that fit those issues, and a See all actions link.
- **She can say:** "Three things happened overnight. One is settled, two need me."
- **Value — start from understanding, not alarms:** dozens of overnight alarms are already grouped into three issues she can name.

### 3. Read what happened

- **Touchpoint:** issue cards in What happened?
- **She sees:**
  - *XR-R07 routing drift* — remediation agent. Confirmed against approved intent; no matching change record; fix prepared, waiting for her.
  - *Metro East reachability* — troubleshooting agent. Investigating; blocked because no DRA connects to the event archive; the agent itself is degraded.
  - *XR-R12 configuration change* — config drift agent. Matches an approved change in NSO. Settled; no action needed.
- **She does:** opens the XR-R07 issue. The detail shows the comparison (local preference 120 found, 100 approved), the evidence the agent used, and which DRA it came from. She also opens XR-R12 briefly; having seen it, it will move to *Recently resolved* when she next returns.
- **Value — arrive to work already done:** the investigation she would have spent her first half-hour on is finished, with the evidence attached.

### 4. Decide the routing fix

- **Touchpoint:** decision card **Review routing fix** (tagged *Change*), then its review panel.
- **She sees:** the exact change, the router and policy it touches, what the agent will verify afterwards, and what happens if she waits. The XR-R07 issue is highlighted, so she knows which issue this decision belongs to.
- **She does:** approves the fix.
- **The page shows:** "Decision submitted" until the approval is confirmed, then "Approved". The decision leaves What should I do? and the issue moves to *Checking*, then *Applying*.
- **Value — spend judgement only where it is needed:** one decision, with everything she needs on one panel. She is not asked to approve each step the agent takes.

### 5. Contain a struggling agent

- **Touchpoint:** decision card **Review troubleshooting agent** (tagged *Governance*), then its review panel.
- **She sees:**
  - The agent's analysis steps keep failing.
  - Its data is not the problem: the CNC DRA it reads from is healthy and serving the other agents. The LLM is responding normally.
  - The agent's own recovery attempts, listed with times.
  - No other agent can take over this investigation.
  - The Metro East issue is highlighted.
- **Her choices:** stop assigning new investigations to this agent, or keep it as it is.
- **She does:** stops new investigations for this agent.
- **The page shows:** the agent reads *Restricted* on the Metro East issue. The current investigation is not cancelled; the agent keeps it.
- **Value — delegate with confidence:** she can see the fault is in the agent, not its data, and contains it in one bounded step before it fails more work.

### 6. Take the suggested next step

- **Touchpoint:** suggestion row in What should I do? — **Connect the event archive**, with the agent's reason: "The investigation needs last week's event history, which is only in the event archive. No DRA connects to it yet."
- **She sees:** it is marked *Suggested*, so she knows it is optional.
- **She does:** takes the suggestion. It opens the matching action in What can I do?
- **Value — know the next best step:** she didn't need a runbook to know what unblocks Metro East.

### 7. Start the action

- **Touchpoint:** action card **Add a data retrieval adapter** in What can I do?, then the DRA setup flow from onboarding, prefilled for the event archive.
- **She sees:** this only connects a data source and changes nothing in the network; it needs the archive's connection details; she has the permission to add a DRA.
- **She does:** completes the setup.
- **The page shows:** the Metro East issue gains a line: "Event archive DRA added — validating connection". The action card shows *In progress*.
- **Value — act in one step, safely:** she fixed the real blocker from the issue itself, in the same flow used at onboarding, with no risk to the network.

### 8. See the fix proven

- **Touchpoint:** the XR-R07 issue in What happened?
- **She sees:** the issue moves from *Applying* to *Change complete — checking result*. It is not marked fixed yet. A few minutes later the agent's checks pass — configuration read back through the CNC DRA, routes as expected, nothing outside the approved change — and it becomes *Verified*.
- **The page shows:** the issue leaves What happened? and its result stays reachable from *Recently resolved*.
- **Value — know it actually worked:** she doesn't re-check the router herself; "verified" means the agent proved it.

### 9. Answer "who did what?"

- **Touchpoint:** the resolved XR-R07 result, then its trace.
- **She sees:** who approved the fix (her), under which policy, which agent and version applied it, when, which DRA supplied the evidence, and the result. One line shows the agent tried to change a second setting outside the approved fix; the policy blocked it and nothing was applied.
- **She does:** copies the trace into the change ticket.
- **Value — account for everything without reconstructing it:** the audit trail is already assembled, including what the guardrails stopped.

### 10. Mid-morning check-in

- **Touchpoint:** Home again, later.
- **She sees:**
  - What should I do? — nothing to decide.
  - What happened? — one issue: Metro East, *Event archive DRA validating*, agent *Restricted*. Clearly still open. XR-R07 and XR-R12 are under *Recently resolved*.
  - What can I do? — the DRA setup *In progress*; actions for other common tasks.
- **She can say:** "Routing is fixed and proven. Metro East is still open and I know why. The struggling agent is contained."
- **Value — never a false all-clear:** a calm page that is still honest about what is not done.

## At a glance

| Moment | Touchpoint | She does | Value she feels |
| --- | --- | --- | --- |
| Sign in | Sign-in page → Home | Lands on the current state | The situation is ready for her |
| First glance | Whole page | Reads three regions | Alarms are already issues |
| Read what happened | Issue cards | Opens XR-R07 and XR-R12 | The investigation is done |
| Decide the fix | Change decision and review | Approves | Judgement only where needed |
| Contain an agent | Governance decision and review | Stops new investigations | Knows it's the agent, not the data |
| Next step | Suggestion row | Takes the suggestion | Knows what unblocks the issue |
| Start an action | Add a DRA | Connects the event archive | Fixes the real blocker safely |
| Proof | XR-R07 issue | Watches it verify | Knows it worked |
| Who did what | Resolved result and trace | Copies the trace | Audit trail already built |
| Check-in | Home | Glances | Calm, and still honest |

## How the issues move across the page

| Moment | Routing drift on XR-R07 | Metro East reachability | XR-R12 change |
| --- | --- | --- | --- |
| Arrival | Fix prepared · decision waiting | Investigating · no DRA for event archive · agent degraded · decision waiting | Settled · new to you |
| After reading | Fix prepared | Unchanged | Seen; moves to recently resolved on next visit |
| After approving | Checking, then applying | Unchanged | Seen |
| After containing | Applying | Agent restricted · investigation kept | Seen |
| After adding the DRA | Applying | Event archive DRA validating | Seen |
| After verification | Verified · recently resolved | Event archive DRA validating | Seen |
| Check-in | Recently resolved | Still open, reason shown | Recently resolved |

## What this story deliberately shows

- Every item on the page belongs to one of the three issues, except standalone actions.
- When work is stuck, the page names the cause: agent, DRA, source, or LLM.
- A required decision and a suggestion never look the same.
- Approving, applying, completing and verifying are separate moments.
- A restricted agent keeps its work; nothing is silently cancelled.
- A blocked change outside the approved scope is a sign the guardrails worked, not a failure.
- A settled issue stays visible until she has seen it once.
- The page ends calm without claiming everything is fine.

## Open points

1. **Recently resolved** as the home for verified and seen-settled issues: to be validated in testing.
2. **Adding a DRA from Home:** confirm that the operator-governor can start DRA setup, or whether it should route to an admin with a request.
