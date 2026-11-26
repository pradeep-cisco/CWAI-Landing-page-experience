# Option 4 experience overview

The floating Preview controls include **Experience overview**, matching the launch pattern in Option 1. It opens a separate full-window presentation and leaves the dashboard mounted beneath it.

## Slides

1. Crosswork AI landing experience: the three core questions mapped onto a simplified landing page.
2. Jobs and incidents: task categories versus the specific jobs addressing one incident.
3. One incident, several jobs: three capacity assessments support one bounded remediation proposal.
4. Decide, follow up or start work: required decisions, optional follow-ups and new scoped work remain distinct.
5. Verifying recovery: controller completion precedes verification; one utilization criterion is met while routing stability remains pending.

The five slide images are bundled in `src/features/agent-centric/overview/assets/` and imported through Vite so deployed subpaths work without a Spaces session. They are a snapshot of the reviewed stakeholder presentation, not a live rendering of the product. If the presentation changes, replace the corresponding assets and accessible descriptions together.

## Presentation controls

Use Previous/Next, the slide selectors, Left/Right, or Home/End. Done, Close or Escape returns to the product. Opening the presentation starts at slide 1. Each slide includes accessible descriptive text in addition to its image.

Presentation state stays local to the viewer. It never selects a dashboard scenario, changes the URL or filters, submits a decision, starts work, or opens/closes an incident. The native modal prevents accidental interaction with the underlying product while presenting. Closing restores focus to Experience overview and preserves the page's scroll position and selected incident dock.

The actual dashboard sections, task cards and data models are unchanged. Options 1–3 retain their existing presentation and product experiences.
