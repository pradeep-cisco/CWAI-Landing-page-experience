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
`direction`: Main axis direction for flex layouts. ("column" | "row")
`display`: Display mode: 'flex' for linear layouts, 'grid' for widget grids. ("flex" | "grid")
`gap`: Spacing between child elements using design token scale. ("2xl" | "2xs" | "lg" | "md" | "none" | "sm" | "xl" | "xs")
`variant`: Semantic preset. Page: 'page' (container), 'page:header' (title area), 'page:footer' (footer). Form: 'form', 'form:section' (responsive column→row), 'form:section:header', 'form:section:body'. Dashboard: 'dashboard' (container query context), 'dashboard:section', 'dashboard:widgets:basic-statistics' (KPI grid), 'dashboard:widgets:basic-health', 'dashboard:widgets:basic-status', 'dashboard:widgets:container' (tables/charts), 'dashboard:widgets:content' (rich content cards with col prop). ('page' | 'page:header' | 'page:footer' | 'form' | 'form:section' | 'form:section:header' | 'form:section:body' | 'dashboard' | 'dashboard:section' | 'dashboard:widgets:basic-statistics' | 'dashboard:widgets:basic-health' | 'dashboard:widgets:basic-health:status' | 'dashboard:widgets:basic-status' | 'dashboard:widgets:basic-accent' | 'dashboard:widgets:container' | 'dashboard:widgets:content')
