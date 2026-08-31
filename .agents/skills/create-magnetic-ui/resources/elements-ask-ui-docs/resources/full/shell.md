# Shell (App Frame) Guidelines

PRIORITY: Preserve the existing app shell (header + left navigation + main content region + footer if present). Do NOT remove, duplicate, or radically restructure it. Enhance only.

## Purpose
The shell supplies global context (brand, primary navigation, global actions) and a stable frame for generated feature content. Generated UI goes inside the main content region or (for small additions) an existing landing/home tab panel.

## When to Add a NEW NAV PAGE vs TAB
Decision algorithm (run in order):
1. Scope Assessment:
   - New standalone workflow, dashboard, multi-section data view, or feature with its own lifecycle/state persistence → NEW PAGE.
   - Minor tool, single chart, form variant, settings subsection, or narrow visualization closely related to home context → NEW TAB in existing home/landing tab group.
2. User Explicitness:
   - If user explicitly says "new page" / "add to navigation" → NEW PAGE.
   - If user explicitly says "add a tab" / "within home" → TAB.
3. Ambiguous → Prefer TAB (lower structural impact) unless complexity clearly requires isolation.

## Adding a New Navigation Page
1. Choose a unique route / slug (kebab-case) derived from feature name.
2. Insert a nav entry with a valid Magnetic navigation icon (`nav-*`). If none semantically matches, fallback to a closest general system icon; Use `nav-objects` as fallback if no other icon is suitable.
3. Set the newly added nav item as ACTIVE so the generated page is immediately visible.
4. Render page title (H1 or designated title pattern) inside main content region followed by feature content.

## Adding a New Tab (Landing/Home)
1. Reuse existing landing page tab group (do not create a parallel one).
2. Insert a new tab label (short, Title Case, 1–3 words).
3. Activate (select) the new tab.
4. Place generated feature content inside that tab panel only.

## Shell Modification Rules
Allowed when explicitly requested or clearly required for feature coherence:
- Add / remove a nav page (removal only if user directs it)
- Add a global action (e.g., button) in header action area
- Reorder nav for logical grouping after insertion (minimal disruption)
- Inject status indicator or badge reflecting new feature state

Not allowed without explicit instruction:
- Renaming existing pages
- Changing existing nav icons
- Removing branding / header structure
- Flattening navigation hierarchy (if present)

## Icon & Naming
Follow `icon.md` priority. Verify icon exists. Never invent names. Maintain consistent sizing (commonly 20–24px in navigation). Provide `aria-label` if the nav item lacks adjacent text label (depending on implementation pattern).

## Activation Requirements
After generation, the user should see the new context immediately:
- New page: nav item marked active & its content displayed.
- New tab: tab selected & panel visible.

## Enhancement vs Overhaul
Enhance = additive improvements (extra actions, filters, tabs, pages). Avoid structural overhaul (layout rewrites, wholesale component swaps) unless user explicitly asks.

## Fallback Handling
If a requested feature is too small for a page but too specialized for existing tabs, still prefer a tab. Only deny page creation if user insists on small feature AND placement is ambiguous—then ask for clarification (or choose a tab with neutral label like "Tools").

## Checklist (Before Emitting Shell Changes)
[ ] Classified request: page or tab
[ ] Chosen valid icon (or justified fallback)
[ ] Added & activated nav item OR added & activated tab
[ ] Preserved header & existing nav items
[ ] Avoided unauthorized renames/removals
[ ] Ensured accessibility (labels where needed)

## Principle
Stability first: The shell is a constant frame; new features plug in, they do not redefine the frame.
