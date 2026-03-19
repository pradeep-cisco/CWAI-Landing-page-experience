# Card Basic

Card Basic is implemented using the web component: <hbr-card>.

## Description
Basic card: simple container for related content. Used for small, self-contained pieces of content like status indicators, summaries, or key metrics.

## Generation Guidance
- **IMPORTANT**: for <hbr-icon>, use `class` instead of `className`, you must ALWAYS use this because custom web components can not convert `className` to `class`
- **IMPORTANT**: when generating UI choose one pattern in the Usage and follow the styling and layout strictly, patterns in Usage are isolated and annotated with BEGIN/END markers (e.g. `// BEGIN: StatusCardExample`)

Basic Cards group related information in flexible containers. Five common patterns are intentionally showcased in the concise examples:

1. **Status card** – very small KPI/status metric with icon (e.g. Online count).  
2. **Statistics card** – value + trend indicator + delta context.  
3. **Health card** – container-style with header slot and multiple sub-metrics.  
4. **Accent card** – sentiment-emphasized card (uses `sentiment` prop) paired with textual status.
5. **Content card** – container for rich content (key-value pairs, tables, charts, accordions, lists). NOT SELECTABLE.

> Models: Each pattern is isolated and annotated with BEGIN/END markers (e.g. `// BEGIN: StatusCardExample`). When generating UI containing a single type of card, copy only the corresponding component body; do not include other examples or the master export wrapper.

### CONTENT CARD GUIDELINES

Content cards display rich, interactive content rather than single metrics. Key differences from other card types:

- **NOT SELECTABLE** – Content cards contain internal interactive elements (tables, accordions, etc.) so the card itself should not be selectable.
- **Use `col` prop** for width: `1/3`, `1/2`, `2/3`, or `full`. The grid handles responsive behavior.
- **Prefer wider layouts** – Use at least `1/2` width for content cards, except for small content like a single-column key-value pair.
- **Fractional widths for siblings** – Use `2/3` only when a `1/3` sibling card is present to complete the row. Use `1/2` when paired with another `1/2` card.
- **Layout variant** – Place content cards inside `<hbr-layout variant="dashboard:widgets:content">`.
- **Header slot** – Use the `header` slot for title, subtitle, and optional tags.

### ACCESSIBILITY GUIDELINES

- Use `role="button"` only when the entire card acts like a single interactive control (toggle / navigation). If the card contains internal interactive elements, prefer leaving the root without a button role and wire interactions to child controls instead.
- Provide a textual label (heading + supporting span) and ensure IDs referenced by `aria-labelledby` exist and are unique on the page.
- Do not rely on color sentiment alone—include textual status tokens (e.g. "Online", "Alerting").

### DASHBOARD LAYOUT STRUCTURE

Cards must be placed inside the semantic `hbr-layout` hierarchy:

```
<hbr-layout variant="dashboard">              <!-- Top-level dashboard container for container queries -->
  <hbr-layout variant="dashboard:section">    <!-- Groups related widgets -->
    <hbr-layout variant="dashboard:widgets:basic-statistics">  <!-- Grid for Status/Statistics cards -->
      <hbr-card>...</hbr-card>
    </hbr-layout>
  </hbr-layout>
</hbr-layout>
```

**Widget grid variants** (choose based on card type):
- `dashboard:widgets:basic-statistics` – for Status and Statistics cards (small KPI cards)
- `dashboard:widgets:basic-health` – for Health cards (container-style with sub-metrics)
- `dashboard:widgets:basic-status` – for Status cards with icons
- `dashboard:widgets:basic-accent` – for Accent cards (sentiment-emphasized)
- `dashboard:widgets:container` – for tables, charts, and larger widgets
- `dashboard:widgets:content` – for Content cards (use `col` prop for width)

**Key points:**
- The layout variants handle all spacing, grid alignment, and responsive behavior automatically.
- Do NOT use inline styles for width, gap, or spacing – the variants manage this.
- Cards stretch to fill available width within the grid.
- The grid is responsive via container queries – no manual breakpoints needed.

### INTERACTION MODEL (SELECTABLE)

The shared handler:
`toggleSelectable(event) -> toggles card.selected when the nearest selectable card isn't disabled.`

### EXTENDING THE EXAMPLES

To produce a variant (e.g. warning accent health card):
1. Start from the closest base (Health or Accent).  
2. Add or change only what's necessary (e.g. `sentiment="warning"`, adjust icon + status text).
3. Keep sub-metrics symmetrical—avoid unbalanced columns.  
4. Maintain accessible labeling (update `aria-labelledby` and IDs).  

**Choosing the right pattern:**
- **Content card** – for rich content (tables, charts, key-value pairs, lists, accordions)
- **Status card** – for a single metric/KPI
- **Health card** – for multiple grouped metrics
- **Statistics card** – for trend language (increase/decrease)
- **Accent card** – for sentiment-emphasized status

### ANTI-PATTERNS

- Do not mix and match between card type (Status/Statistic/Health/Accent/Content) styles or layouts.
- Do not make Content cards selectable – they contain interactive elements.
- Do not use small widths (1/3) for Content cards unless the content is very compact.

## Usage
```jsx
// A card type should always be wrapped in a layout component with a variant of the same type. Do not mix and match.

// Shared click toggle helper (works with the custom element <hbr-card />)
const toggleSelectable = (event) => {
	const t = event.target;
	const card =
		t.tagName?.toLowerCase() === "hbr-card"
			? t
			: t.closest("hbr-card[selectable]");
	if (card && !card.disabled) card.selected = !card.selected;
};

/* ===================== CONTENT CARD ===================== */
// BEGIN: ContentCardExample
// Purpose: Display simple content (key-value pairs, lists, simple tables). NOT SELECTABLE.
// Key props: col (1/3, 1/2, 2/3, full) for width. Prefer wider (2/3, full) unless content is compact.
export function ContentCardExample() {
	return (
		<hbr-layout variant="dashboard:widgets:content">
			<hbr-card col="1/2">
				<hbr-layout slot="header" direction="column" gap="3xs">
					<hbr-layout direction="row" gap="2xs">
						<hbr-text variant="section-title">Title</hbr-text>
						<hbr-tag size="small">Tag</hbr-tag>
					</hbr-layout>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div style={{ height: "300px", background: "var(--base-bg-medium-default)", padding: "var(--hbr-spacing-md)" }}>
					Content
				</div>
			</hbr-card>
			<hbr-card col="1/2">
				<hbr-layout slot="header" direction="column" gap="3xs">
					<hbr-layout direction="row" gap="2xs">
						<hbr-text variant="section-title">Title</hbr-text>
						<hbr-tag size="small">Tag</hbr-tag>
					</hbr-layout>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div style={{ height: "300px", background: "var(--base-bg-medium-default)", padding: "var(--hbr-spacing-md)" }}>
					Content
				</div>
			</hbr-card>
			{/* More content cards here */}
		</hbr-layout>
	);
}
// END: ContentCardExample

/* ===================== STATUS CARD (small / metric) ===================== */
// BEGIN: StatusCardExample
// Purpose: Show a compact status metric + icon. Use for small dashboard KPIs.
// Key props: selectable, role="button" for accessibility, semantic icon.
export function StatusCardExample() {
	return (
		<hbr-layout variant="dashboard:widgets:basic-status">
			<hbr-card selectable role="button" onClick={toggleSelectable}>
				<hbr-layout direction="row" style={{ justifyContent: "space-between" }}>
					<hbr-layout direction="row" gap="2xs" align="end">
						<hbr-text type="primary" size="lg" weight="bold">8</hbr-text>
						<hbr-text type="primary" size="xs" weight="semibold">Online</hbr-text>
					</hbr-layout>
					<hbr-icon name="status-positive-bg" sentiment="positive" size="28px" style={{ marginInlineStart: "auto" }} />
				</hbr-layout>
			</hbr-card>
			{/* More status cards here */}
		</hbr-layout>
	);
}
// END: StatusCardExample

/* ===================== STATISTICS CARD (trend) ===================== */
// BEGIN: StatisticsCardExample
// Purpose: Display a primary value with a directional trend & delta.
// Guidance: Keep to a single concise value cluster; trend icon conveys direction.
export function StatisticsCardExample() {
	return (
		<hbr-layout variant="dashboard:widgets:basic-statistics">
			<hbr-card selectable>
				<hbr-layout direction="column" gap="2xs">
					<hbr-text type="secondary" size="sm">Throughput</hbr-text>
					<hbr-layout direction="row" gap="2xs" align="end">
						<hbr-text type="primary" size="lg" weight="bold">100%</hbr-text>
						<hbr-icon name="trend-up" style={{ fontSize: "16px", color: "var(--positive-icon-active)" }} />
						<hbr-text type="primary" size="xs" weight="semibold">+1%</hbr-text>
						<hbr-text type="secondary" size="xs" weight="semibold">vs yesterday</hbr-text>
					</hbr-layout>
				</hbr-layout>
			</hbr-card>
			{/* More statistics cards here */}
		</hbr-layout>
	);
}
// END: StatisticsCardExample

/* ===================== HEALTH CARD (container style) ===================== */
// BEGIN: HealthCardExample
// Purpose: Larger card with header slot & grouped sub-metrics.
// Guidance: Use for summarizing system / fleet health at a higher level.
export function HealthCardExample() {
	return (
		<hbr-layout variant="dashboard:widgets:basic-health">
			<hbr-card selectable role="button" onClick={toggleSelectable}>
				<hbr-layout slot="header" direction="row" gap="sm">
					<hbr-layout direction="row" gap="2xs" align="end">
						<hbr-text variant="section-title" style={{ margin: 0 }}>Devices</hbr-text>
						<hbr-text type="secondary" size="xs">83 total</hbr-text>
					</hbr-layout>
					<hbr-icon name="device-uplink" style={{ marginInlineStart: "auto" }} />
				</hbr-layout>
				<hbr-layout direction="row" gap="md">
					<hbr-layout variant="dashboard:widgets:basic-health:status">
						<hbr-text type="primary" size="lg" weight="bold">62</hbr-text>
						<hbr-layout direction="row" gap="2xs">
							<hbr-text type="primary" size="xs" weight="semibold">Online</hbr-text>
							<hbr-icon name="status-positive" sentiment="positive" size="16px" />
						</hbr-layout>
					</hbr-layout>
					<hbr-layout variant="dashboard:widgets:basic-health:status">
						<hbr-text type="primary" size="lg" weight="bold">21</hbr-text>
						<hbr-layout direction="row" gap="2xs">
							<hbr-text type="primary" size="xs" weight="semibold">Alerting</hbr-text>
							<hbr-icon name="status-warning" sentiment="warning" size="16px" />
						</hbr-layout>
					</hbr-layout>
				</hbr-layout>
			</hbr-card>
			{/* More health cards here */}
		</hbr-layout>
	);
}
// END: HealthCardExample

/* ===================== ACCENT CARD (sentiment) ===================== */
// BEGIN: AccentCardExample
// Purpose: Showcase sentiment accent (visual emphasis) + accessible header.
// Guidance: Pair accent color with a textual status for accessibility.
export function AccentCardExample() {
	return (
		<hbr-layout variant="dashboard:widgets:basic-health">
			<hbr-card selectable role="button" sentiment="warning" onClick={toggleSelectable}>
				<hbr-layout slot="header" direction="row" gap="sm">
					<hbr-layout direction="column" gap="2xs">
						<hbr-layout direction="row" gap="2xs">
							<hbr-text variant="section-title" style={{ margin: 0 }}>Title</hbr-text>
							<hbr-tag sentiment="warning" size="small">
								<hbr-icon name="status-warning" sentiment="warning" size="16px" slot="prefix" />
								Warning
							</hbr-tag>
						</hbr-layout>
						<hbr-text type="secondary" size="xs">Subtitle</hbr-text>
					</hbr-layout>
					<hbr-icon name="device-uplink" style={{ marginInlineStart: "auto" }} />
				</hbr-layout>
				<hbr-layout direction="row">
					<hbr-layout variant="dashboard:widgets:basic-health:status">
						<hbr-text type="primary" size="lg" weight="bold">62</hbr-text>
						<hbr-layout direction="row" gap="2xs">
							<hbr-text type="primary" size="xs" weight="semibold">Online</hbr-text>
							<hbr-icon name="status-warning" sentiment="warning" size="16px" />
						</hbr-layout>
					</hbr-layout>
				</hbr-layout>
			</hbr-card>
			{/* More accent cards here */}
		</hbr-layout>
	);
}
// END: AccentCardExample

/* ===================== MASTER DEMO EXPORT ===================== */
// The default export renders all five minimal patterns together.
// LLMs: When asked for "a status card" etc., return ONLY the corresponding component JSX, not the whole group.
export default function CardExamples() {
	return (
		<hbr-layout variant="dashboard">
			<hbr-layout variant="dashboard:section">
				<hbr-text variant="section-title">Content</hbr-text>
				<ContentCardExample />
			</hbr-layout>
			<hbr-layout variant="dashboard:section">
				<hbr-text variant="section-title">Status</hbr-text>
				<StatusCardExample />
			</hbr-layout>
			<hbr-layout variant="dashboard:section">
				<hbr-text variant="section-title">Statistics</hbr-text>
				<StatisticsCardExample />
			</hbr-layout>
			<hbr-layout variant="dashboard:section">
				<hbr-text variant="section-title">Health</hbr-text>
				<HealthCardExample />
			</hbr-layout>
			<hbr-layout variant="dashboard:section">
				<hbr-text variant="section-title">Accent</hbr-text>
				<AccentCardExample />
			</hbr-layout>
		</hbr-layout>
	);
}

```