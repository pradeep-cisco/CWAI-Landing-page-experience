# Card Container

Card Container is implemented using the web component: <hbr-card>.

## Description
Container card: larger card that can contain multiple sections or components. Used for page-level groupings of related content, such as dashboard widgets or detailed views.

## Generation Guidance
### Container Cards vs Content Cards

**Container cards** (`<hbr-card container>`) are for **complex, interactive content**:
- Multi section, multi-column layouts with Tables, data grids, charts, visualizations, etc.
- Accordions, expandable sections
- Forms, multi-step wizards
- Any content with significant internal interactivity

**Content cards** (basic cards in `dashboard:widgets:content`) are for **simpler content**:
- Key-value pairs
- Simple lists
- Static text with minimal interaction
- Simple tables, charts, and visualizations

**When in doubt, prefer Container cards** for any non-trivial content. They provide better structure and the `col` prop for flexible width control.

### Container Card Width (col prop)

Use the `col` prop to set card width in dashboard grids:
- `col="1/3"` - third width (3 cards per row)
- `col="1/2"` - half width (2 cards per row)
- `col="2/3"` - two-thirds width
- `col="full"` - full width (default for tables, large charts)

Cards auto-expand on smaller screens (tablet/mobile) via container queries.

### Layout Structure

Place container cards inside `dashboard:widgets:container` or `dashboard:widgets:content`:

```
<hbr-layout variant="dashboard">
  <hbr-layout variant="dashboard:section">
    <hbr-layout variant="dashboard:widgets:container">
      <hbr-card container col="full">
        <!-- Table, chart, or complex content -->
      </hbr-card>
    </hbr-layout>
  </hbr-layout>
</hbr-layout>
```

### Standard vs Collapsible Cards

- Use a standard `<hbr-card container>` for static sections, summaries, per-device/per-controller blocks, metric groups, and content that should always remain visible.
- Use a collapsible card or `<hbr-accordion variant="card">` only when the design explicitly shows an expand/collapse affordance or the user asks for collapsible behavior.
- Do not choose a collapsible card merely because a section has a title, description, metrics, or repeated instances.

### Row Layout Rules

- Cards in a row should sum to full width: `1/3 + 2/3`, `1/2 + 1/2`, `1/3 + 1/3 + 1/3`
- Use `col="full"` for tables and wide charts (most common)
- Use `col="2/3"` only when a `1/3` sibling is present
- Do NOT nest container cards inside other container cards

### Header Slot

Use the `header` slot for title, subtitle, and actions:

```
<hbr-card container col="full">
  <hbr-layout slot="header" direction="row" align="center">
    <hbr-text variant="section-title">Card Title</hbr-text>
    <hbr-button variant="text" size="small">Action</hbr-button>
  </hbr-layout>
  <!-- Content here -->
</hbr-card>
```

## Usage
```jsx
// NOTE FOR LLMs:
// This file contains TWO MINIMAL container card usage patterns.
// When asked for a "standard container card" or "collapsible card",
// return ONLY that specific component JSX (not the master demo wrapper).

/* ===================== STANDARD CONTAINER CARD ===================== */
// BEGIN: StandardContainerCardExample
// Purpose: Basic container card with header slot and body placeholder.
// Guidance: Use for general layouts needing a header + body. Keep content minimal.
export function StandardContainerCardExample() {
	return (
		<hbr-card container style={{ width: "480px" }}>
			<hbr-text slot="header" variant="section-title" style={{ margin: 0 }}>Title</hbr-text>
			<div style={{ height: "100px", background: "var(--base-bg-medium-default)", padding: "var(--hbr-spacing-md)" }} />
		</hbr-card>
	);
}
// END: StandardContainerCardExample

/* ===================== COLLAPSIBLE CARD (accordion variant) ===================== */
// BEGIN: CollapsibleContainerCardExample
// Purpose: Accordion-style card containers summarizing issue states.
// Guidance: Each accordion label combines icon + title + count tag. Body stays lightweight.
export function CollapsibleContainerCardExample() {
	return (
		<hbr-layout direction="column" gap="lg">
			<hbr-accordion variant="card" open>
				<div slot="label">
					<hbr-icon name="status-negative" sentiment="negative" size="20px" />
					<hbr-text variant="section-title" style={{ margin: 0 }}>Critical Issues</hbr-text>
					<hbr-tag size="small">3</hbr-tag>
				</div>
				<div style={{ height: "160px", background: "var(--base-bg-medium-default)", padding: "var(--hbr-spacing-md)" }}>
					Empty content.
				</div>
			</hbr-accordion>
			<hbr-accordion variant="card">
				<div slot="label">
					<hbr-icon name="status-positive" sentiment="positive" size="20px" />
					<hbr-text variant="section-title" style={{ margin: 0 }}>Resolved Issues</hbr-text>
					<hbr-tag size="small">134</hbr-tag>
				</div>
				<div style={{ height: "160px", background: "var(--base-bg-medium-default)", padding: "var(--hbr-spacing-md)" }}>
					Empty content.
				</div>
			</hbr-accordion>
		</hbr-layout>
	);
}
// END: CollapsibleContainerCardExample

/* ===================== MASTER DEMO EXPORT ===================== */
// The default export renders both patterns together.
// LLMs: Provide only the requested example component when asked.
export default function CardContainerPage() {
	return (
		<hbr-layout direction="column" gap="lg">
			<hbr-text variant="page-title">Card Container</hbr-text>

			<hbr-text variant="section-title">Standard Container Card</hbr-text>
			<hbr-text type="primary" size="md">
				Standard Container Cards are used for general use cases with a header, body, and optional footer.
			</hbr-text>
			<StandardContainerCardExample />

			<hbr-text variant="section-title">Collapsible Card</hbr-text>
			<hbr-text type="primary" size="md">
				Collapsible Cards are used for sections of content that can be expanded or collapsed to save space.
			</hbr-text>
			<CollapsibleContainerCardExample />
		</hbr-layout>
	);
}

```