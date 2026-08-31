# Magnetic Schema Sources

The installed design bundle is a release-time projection of these Magnetic schema nodes:

- `design-tokens`: semantic token naming, theme behavior, and token usage rules.
- `layout`: application shell, grid, spacing, responsive behavior, and composition.
- `text`: typography roles and visual specifications.
- `color-and-contrast`: contrast thresholds and non-color communication requirements.
- `magnetic-review-checklist`: cross-component review rules and common anti-patterns.

## Precedence

1. Component-specific Harbor Elements context governs component APIs, variants, events, slots, and framework syntax.
2. The current Magnetic schema governs Magnetic component identity and Figma library targets.
3. `component-map.json` governs translation between the two systems.
4. `design.md` governs cross-component Magnetic foundations and design intent.
5. Existing product conventions govern product-specific shell and navigation decisions when they do not conflict with documented Magnetic requirements.

## Consumer boundary

This snapshot and its supplemental resources are self-contained. Consumers do not need the Magnetic CLI, runtime, Figma connection, network access, or schema source checkout.
