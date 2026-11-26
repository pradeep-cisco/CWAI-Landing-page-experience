# Option 4 — landing and Jobs manager

The current landing presentation and shared incident thread are documented in [Cleaner landing and incident thread](CLEANER-INCIDENT-EXPERIENCE.md). The material below retains the preceding milestone's rationale and detailed manager behavior.

Updated: 2026-11-25. This document describes the landing and Jobs manager iteration for **04 · Agent-centric**. It supersedes the landing labels and inline jobs workspace described in [Scale and copy](SCALE-AND-COPY.md). The underlying scenario, authority model and earlier explorations remain intact.

## Intended outcome

The operator can identify a consequential decision, understand the work agents already own, and start a bounded task without sorting through a page of competing actions. Detailed job management has its own destination.

The three questions still govern the experience:

| Operator question | Landing answer | Deeper interaction |
| --- | --- | --- |
| What should I do? | **Needs review** gives delegated decisions priority. **Suggested** offers optional next steps quietly. | Review the exact proposal, or open the relevant existing work. |
| What happened? | **Jobs** gives a bounded view of actual work and source findings. | Open Jobs manager with the selected scope or filtered view. |
| What can I do? | One **Start job** entry on the landing. | Choose a task, check its scope and prerequisites, then submit a request. |

Agents retain ownership of investigations and remediation work throughout. An operator decision supplies the required authority; it does not turn the person into the investigator or transfer work to a traffic engineer.

## Visual hierarchy

The landing flows in this order: scope controls, Needs review, Jobs, Suggested. It does not introduce another network map or a roster of eight equally prominent agent cards.

### Scope and launch

All device groups and All agents remain compact filters. Inventory and current observation coverage establish the size and limits of the view. **Start job** is the single landing launch entry rather than a repeated action on every job and capability.

Device groups are the visible network scope for this iteration, including groups named for a region or PoP. They are distinct from the task categories used to organize jobs. Existing internal `domainId` keys, identifiers and `domain` URL parameters are retained for compatibility; this is a terminology change, not a schema migration.

### Needs review

A native Magnetic card has an asymmetric layout: a concise decision summary and count on one side; a short queue of scoped proposals on the other. It shows up to three decisions and the actual total, with one prominent **Review decisions** action into the complete review queue.

Queue rows are navigable surfaces with restrained chevrons. They identify the change and target without repeating blue Review buttons. A quiet or interrupted state replaces the invitation to decide with an accurate state explanation. Filters do not hide the existence of decisions elsewhere: the page names the reviews outside the current view and offers Clear filters.

### Jobs

The **Jobs · By task** section uses native Magnetic cards in a two-column grid on a wide screen and one column on a narrow screen. Every nonempty task category is represented, including categories containing only completed records. The default scenario has eight cards; there is no four-card limit or selected-issue pinning. Each card gives different information a clear visual weight:

1. A small task symbol, task title and neutral chevron establish the destination.
2. The actual job count establishes the scale of that work. Separate text counts identify each nonzero state: Running, Waiting, Review and Completed.
3. A larger source-supported finding supplies the useful content, with its specific device or scope immediately below.
4. Agent ownership and explicit state counts ground the finding in the underlying work without reducing mixed jobs to a single badge.

Task categories provide a stable reading structure. They are not configured work groups, collaboration teams or shared-cause claims. Every scoped job belongs to exactly one task, so the card totals partition the visible collection. The default scenario is:

| Task | Jobs | Underlying work |
| --- | ---: | --- |
| Investigations | 30 | Network troubleshooting, including investigations waiting for archive access |
| Configuration checks | 54 | Configuration anomaly and change assessments |
| Event correlation | 13 | Comparing events and applying incident-classification criteria |
| Risk assessments | 26 | Toxic factor analysis and vulnerability assessments |
| Capacity checks | 13 | Utilization and headroom analysis |
| Service checks | 13 | Service-specific reachability and performance checks |
| Remediation | 6 | Prepared corrections and the original routing correction lifecycle |
| Verification | 13 | Independent verification tasks for completed changes |

Task membership follows the declared task, capability and agent role rather than job status. Waiting or completing does not move a job into a different category. Risk assessments excludes capacity work, which has its own category. The original `ROUTE-104` correction stays in Remediation as it progresses through execution and verification; a separate verification task belongs in Verification. Individual findings retain their exact targets and sources. An otherwise valid job with an unrecognized task is retained under Investigations rather than disappearing.

The whole card is one focusable link into that task in Jobs manager, retaining the selected device group and agent. There are no repeated View jobs or View details buttons. A single quiet **Jobs manager** link in the section heading opens the full scoped collection. Read-only counts above the grid describe all scoped jobs; the cards account for the same collection once each. The footer says **168 jobs in this view** in the default scenario.

Card surfaces use the Magnetic One CD dark foundation with restrained blue and violet light at an edge, a single hover border and a clear keyboard focus treatment. Current work with running jobs can receive a subtle animated surface treatment. Status remains readable text rather than a distribution bar or an elapsed-progress visualization. In the default view, Investigations shows **10 Running, 18 Waiting and 2 Completed**; Risk assessments shows **16 Running, 6 Waiting and 4 Completed**. Zero states are omitted from the visible counts. An accessible summary retains every state's count, with **Last known** qualification when sources are interrupted.

### Suggested

**Suggested** replaces Attention for optional agent recommendations. Up to two concise suggestions appear in a quiet native card, each with its reason and agent. A row opens relevant work; its overflow menu can dismiss the suggestion. There are no task launch tiles or agent assignment controls competing with required decisions here. The section disappears when no relevant suggestions exist.

## Dedicated Jobs manager

Jobs manager is a separate page at `/network-monitoring/jobs`, not an expanded landing card or an All jobs drawer.

- Search covers job and issue identifiers, devices, agents, scope, checkpoints and findings.
- Device group, agent, status and **Task** filters combine. Task offers **All tasks** or a canonical category. The manager includes running, waiting, review and completed records. A selected legacy category appears as a saved filter, preserving its bookmarked membership without offering obsolete categories for new selections.
- The result range and 12-job pages make a large collection navigable without putting every record on the landing.
- Rows show a useful finding, responsible agent, exact scope and current status. Opening a row reveals the existing job inspector; the review queue opens eligible proposals for review.
- Agent assignment governance remains available under collapsed **Agent controls**, away from the landing's everyday priorities.

The manager uses the same model and task classifier as the landing. It does not create a second copy of job state. A task destination selects exactly the jobs belonging to that task, then intersects device group, agent, status and search filters. For example, Risk assessments contains toxic factor and vulnerability work, with capacity excluded; Verification does not include the original routing remediation. Each job appears once in a manager result. Previous bookmarked category links remain accepted through compatibility aliases, without adding duplicate cards to the landing.

## Scope, links and returning

Landing filters carry into Jobs manager. A selected task card adds its task; Review decisions adds the review status. A new submitted request opens the manager with its device group, agent, task and job selected.

Shareable application links encode device group, agent, status, task, search, page and selected job as applicable. The device-group selection continues to use the existing `domain` parameter, and task selections retain the `group` parameter and internal `groupId` key. Ordinary links remain usable with keyboard navigation and modified clicks. The router supplies the deployment base path.

An unknown or unavailable filter produces an explicit unavailable or empty view. It never silently broadens to every device group or job. A selected job outside the result has an explicit explanation rather than being opened from a different scope.

When the person returns Home during the same visit, the landing restores its device group and agent filters, scroll position and originating focus target where available. Closing an inspector restores focus to its trigger or a sensible page heading. A direct manager link has a scoped Home destination even without an earlier landing visit. Prototype state is not presented as durable backend storage.

## Starting one bounded job

1. **Start job** opens a task chooser in a native Magnetic drawer. Search and the current agent filter help locate the task. The chooser explains that network changes need separate authority.
2. Choosing a task opens its scope and readiness view. This names the responsible agent, task, prerequisites and change limit. Selection is not execution.
3. The person explicitly confirms the task for the displayed scope. Device-group selection does not invent verification readiness; change verification still requires completion evidence for the exact target.
4. Existing matching work leads to **Open job** rather than a duplicate request.
5. A new request enters **Request submitted**, then assessment only after acknowledgement. It opens in Jobs manager so its ownership and state remain visible.

Read-only network access can support findings, incident records and proposed plans. It does not authorize a network write. Submission and acknowledgement establish neither a network diagnosis nor a successful outcome.

## Scale and source truth

The deterministic arrival scenario retains 13,523 devices across eight device groups, 168 jobs, 113 issues and six delegated reviews. The status distribution is 117 running, 24 waiting, six requiring review and 21 completed. Current observations cover 13,395 devices; 128 await data. These are prototype records, not a live controller connection or a capacity benchmark.

The number of task categories stays bounded while every nonempty category and all its jobs remain represented. Device group and agent filters constrain findings and task counts before rendering; findings from another scope must not leak into a card. Completed-only categories remain visible as completed work and receive no running animation. Devices, observations, jobs, issues and decisions remain distinct objects.

Eighteen investigations share an event archive access prerequisite across three device groups. They remain inside Investigations; source access is a dependency, not a separate task category. That common dependency does not establish a common network root cause. A card with partly waiting work shows its running and waiting counts separately, rather than appearing wholly active or wholly blocked.

Quiet results apply only to assessed scopes. The quiet scenario retains its three completed records under Investigations, Configuration checks and Remediation. A genuinely empty collection has no task cards and does not establish network health. Interrupted sources retain last-confirmed records and visibly disable new starts and approvals.

## Authority and outcomes

The iteration changes presentation and navigation, not the authority model:

- A proposal is reviewed for its specific target and version, with evidence, exact change, constraints and verification criteria. There is no bulk approval of unrelated changes.
- A submitted decision waits for confirmation. Additional scoped change reviews retain execution and verification as unconfirmed until evidence establishes them.
- The original routing scenario keeps its separate authorization, execution, verification and recovery stages.
- Restricting an agent affects new assignments only after confirmation. It does not cancel existing work, reassign its owner or restore a missing source.
- An interrupted source is a visibility condition; an agent, adapter, upstream source and LLM failure are not interchangeable explanations.

## Motion and interaction

Motion communicates supported activity while keeping the reading order stable:

- A task card can reveal a finite set of supplied observations. The transition is a small fade and vertical movement; it does not invent a new finding, advance a job or change its task membership.
- Only current work with running jobs is eligible for subdued surface motion and a live pulse. Its text counts continue to distinguish any waiting, review or completed jobs in that card. A card with no running work remains still.
- Motion begins only after the card is observed in view and the reading conditions permit it. The initial render remains still. Hover, keyboard focus, an offscreen card, a hidden document, reduced-motion preference or interrupted sources stop its automatic supporting transitions and live treatment. The icon-only Pause updates control pauses the presentation, not the agents.
- Card hover changes one border and a quiet chevron. No duplicate outlines or large movement compete with the content.
- Native drawers retain clear focus, keyboard access and return behavior. Narrow layouts keep the same content order without shrinking the controls into unreadable labels.

## Preserved explorations and references

This iteration is isolated to **04 · Agent-centric**. Options 1–3, their map experiences and story state remain unchanged and switchable through the floating exploration panel. Earlier documents remain as exploration history rather than being rewritten to imply they described this layout.

Related references: [Concept and outcomes](CONCEPT-AND-OUTCOMES.md), [Story](STORY.md), [Scale and copy](SCALE-AND-COPY.md), [Eight agents](EIGHT-AGENTS.md).
