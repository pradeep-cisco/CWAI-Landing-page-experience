# Layout

Layout is implemented using the web component: <hbr-layout>.

## Description
Semantic layout primitive for structuring UI blocks.

Provides flex and grid layouts with consistent spacing and alignment.
Use semantic variants for common page patterns (page, form, dashboard),
or set primitive props (display, direction, gap, align) for custom layouts.

Variants configure layout presets - explicit props override variant defaults.

## Generation Guidance
- PREFER semantic variants over manual props - they configure display, direction, gap, align correctly.
- Form structure: form > form:section > [form:section:header + form:section:body].
- Dashboard structure: dashboard > dashboard:section > dashboard:widgets:* (for card grids).
- Widget grids: 'basic-statistics' for KPI cards, 'container' for tables/charts.
- Explicit props (gap, align) override variant defaults when customization needed.
- Treat spacing as required structure. Give every adjacent group an explicit `gap` value or another documented spacing owner.
- Do not rely on browser defaults, incidental margins, line wrapping, or component coincidence for spacing.

## API Reference

### Props
`align`: Cross-axis alignment of child elements. ("baseline" | "center" | "end" | "start" | "stretch")
`custom`: Enables custom layout behavior. (boolean)
`direction`: Main axis direction for flex layouts. ("column" | "row")
`display`: Display mode: 'flex' for linear layouts, 'grid' for widget grids. ("flex" | "grid")
`gap`: Spacing between child elements using design token scale. ("2xl" | "2xs" | "lg" | "md" | "none" | "sm" | "xl" | "xs")
`justify`: Main-axis distribution of child elements. ("center" | "end" | "space-around" | "space-between" | "space-evenly" | "start")
`variant`: Semantic layout variant for common UI patterns.
Variants follow hierarchy: domain:scope:category (e.g., dashboard:widgets:basic-statistics). ("dashboard" | "dashboard:section" | "dashboard:widgets:basic-health" | "dashboard:widgets:basic-health:status" | "dashboard:widgets:basic-statistics" | "dashboard:widgets:basic-status" | "dashboard:widgets:container" | "dashboard:widgets:content" | "form" | "form:field" | "form:section" | "form:section:body" | "form:section:header" | "page" | "page:footer" | "page:header")

### Slots
`[default]`: Layout children elements.
