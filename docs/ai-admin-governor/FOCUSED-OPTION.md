# Focused workforce landing option

Created: 2026-11-20. Status: **Interactive concept for review.** The supervisor's job remains “Supervise the AI workforce.” This option reduces the amount of information shown on arrival while retaining access to the underlying work and evidence.

## Compare the options

Use **Switch exploration** in the floating Preview panel:

- **Workforce · Focused** opens the new landing treatment. The panel provides the seven story states, Prev, Play/Pause, and Next. These select illustrative snapshots rather than trigger real agents or controller operations.
- **Workforce · Original** opens the previous exploration, including its original storyboard and inspection behavior.
- **Network overview** returns to the existing NOC dashboard and its WAN examples.

The focused view initially opens the escalation scene so that concurrent work and genuine supervisory decisions can be assessed together. Its scene selection remains available while comparing the workforce alternatives.

Direct local entry: `/network-monitoring?exploration=workforce`. Original entry: `/network-monitoring?exploration=workforce-original`. Deployment paths use the application's existing base-path handling.

## Information that earns a place on the landing page

| Area | Visible on arrival | Available through inspection |
| --- | --- | --- |
| **Activity** | Job purpose, actual state, one material checkpoint or constraint, semantic checkpoint rail, accountable agent and capability health. Assignment restrictions remain separate from health. | Full evidence, attempts, dependency context, eligibility, source access, and applicable authority. |
| **Attention** | Exact supervisory decisions and why the configured policy needs this person's authority. Autonomous handling has a quieter explanation. | Proposal scope, decision state, supporting evidence, and control consequences. |
| **Actions** | Confirmed authorization/control changes, acknowledged execution, execution results, and verified outcomes. | Actor, source record, authority, and what the event actually establishes. |
| **Trust** | A scoped statement about the represented work with a trace entry point. | Separate authority, execution, and outcome records. |

Pending proposals, repeated retries, unchanged prerequisites, and heartbeat messages do not fill Actions. Before any consequential action is recorded, the section stays honestly quiet. The same three jobs remain visible so that reducing noise does not hide unresolved work.

## Visual behavior

Activity uses purpose-first work lanes and small checkpoint rails instead of repeated explanatory paragraphs. Agent identity and health support the work rather than lead it. Actions use a small set of inspectable event marks with concise result labels. Standard controls, tags, and icons use the available Magnetic boilerplate components; the job relationships and motion are custom where that improves clarity.

The Focused option now uses the native Magnetic card composition:

- **Container cards:** Activity, Attention, and Actions, using `hbr-card container` and their standard header/body slots.
- **Basic cards:** the opening summary, individual decisions, selectable action records, and attached inspection. Container cards are not nested inside other Container cards.
- **Layout and text:** `hbr-layout` supplies the section and content layouts; `hbr-text` supplies the main heading, section headings, card headings, and supporting content.
- **Interaction:** action cards expose one native selectable target with Enter/Space support. Decision cards remain nonselectable and use their Review button. Closing inspection returns keyboard focus to the related job.

Native cards provide the One CD surfaces, spacing, borders, corner radii, and elevation. Their supported minimum-width and outline settings retain narrow-screen fitting and the existing single-hover treatment. The job lanes, checkpoint rail, and event-driven motion remain custom content within those surfaces.

The One CD dark treatment uses restrained blue, violet, and pink atmosphere. A changed job receives a short local emphasis; checkpoint states update with the selected source snapshot. Waiting is understandable at rest. Reduced motion keeps every state and inspection available. There is no invented progress percentage or animated indication that an unavailable prerequisite is advancing.

The existing story facts remain binding: authorization is separate from issuing an operation; an operation completing is separate from verified remediation; T1's restriction does not repair its capability; D1 stays healthy while J23 waits for source access. One verified result leaves the other jobs unresolved.

## Preserved checkpoint

The original conversation exploration remains at its existing visualization path. A byte-identical source is retained in `public/explorations/workforce-original.fragment.html`; the standalone comparison is `public/explorations/workforce-original.html`.

Original source SHA-256: `25997decf7b11bb3804652f49c2717d7dca3c4054a5404ff260904496c6350bf`.

The prior [visual storyboard](VISUAL-STORYBOARD.md), [outcomes and stories](OUTCOMES-AND-STORIES.md), and their archive remain intact. This iteration adds a selectable concept and floating comparison controls; it does not connect a live governor or change the WAN overview's behavior.

## Review checks

The focused option's seven snapshots, decision inspection, contextual details, retained action history, keyboard close-and-return behavior, floating comparison actions, and timed story playback were checked in the browser. The original retained its selected scene when switching between the two workforce options. Returning to Network overview retained the existing six-domain WAN view.

The layout was inspected at 1,440px, 390px, and 320px. The narrow view and floating panel fit their containers; the checkpoint rail shows its current label on small screens while retaining accessible labels for every stage. Reduced-motion rules retain the settled state without custom movement.

After the native-card migration, composition was checked for nested Container cards and nested Basic cards; neither was present. Native action selection was exercised with Enter and Space, and repeat transitions from quiet Actions to populated Actions retained visible cards. The 320px inspection card also fit its available width.

All 190 automated checks passed, including five new checks for independent job constraints, authorization before execution, separate verification, consequential action filtering, and retained source records. The production build passes. These are prototype checks, not validation of live governance APIs or usability with representative AI Admins.
