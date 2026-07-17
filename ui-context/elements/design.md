---
version: alpha
name: Cisco Magnetic
description: Shared Magnetic foundations for Harbor UI design and implementation.
typography:
  heading-primary:
    fontFamily: Sharp Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: 0px
  heading-section:
    fontFamily: Sharp Sans
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: 0px
  heading-subsection:
    fontFamily: Sharp Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  heading-small:
    fontFamily: Sharp Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0px
  body-large:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  body-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-small:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  monospace-default:
    fontFamily: Roboto Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 40px
x-magnetic:
  source: "@cisco-magnetic/schema"
  queryProfile: ask
  nodes:
    - design-tokens
    - layout
    - text
    - color-and-contrast
    - magnetic-review-checklist
  colorPolicy: semantic-theme-tokens
  consumerMode: bundled-snapshot
  requiresCli: false
---

# Cisco Magnetic Design Reference

## Overview

Magnetic is the design system for dense, technical Cisco product experiences. Interfaces should feel precise, professional, calm, and easy to scan while remaining accessible and responsive.

This file is the shared foundation reference for Harbor capabilities. Use `context-map.md` to choose component-specific documentation; use this file for rules that apply across components. Component documentation and the current Magnetic schema take precedence when a detail is more specific or has changed.

The source of truth is the layered Magnetic schema. This file is a curated, release-time snapshot of the `design-tokens`, `layout`, `text`, `color-and-contrast`, and `magnetic-review-checklist` nodes; `design-references/schema-sources.md` records their responsibilities and precedence. The bundle is self-contained: consumers must not invoke the Magnetic CLI, start the Magnetic runtime, connect to Figma, or fetch schema data while using it. Package maintainers refresh the snapshot before publishing a new context release.

## Colors

Magnetic uses sentiment-based, theme-aware tokens. Read a token as `sentiment.usage[.prominence][.interaction]`: for example, `interact.bg.default`, `base.text.default`, or `negative.icon.default`. In Figma the same segments use slashes; distributed CSS variables use hyphens.

- Use the token whose sentiment matches the meaning: `base` for neutral chrome, `interact` for actions and links, `positive` for success, `warning` for caution, `negative` for errors or destructive actions, and `control` for form controls.
- Let Harbor Elements components own their color tokens. Override component colors only when the component documentation explicitly supports it.
- Use `base.text.default` for primary text and `base.text.medium.default` for secondary text.
- Preserve theme behavior. Do not copy a light- or dark-theme hex value into application CSS, and do not invent token names.
- Meet at least 4.5:1 contrast for standard text, 3:1 for large text (18px+ bold or 24px+ regular), and 3:1 for essential non-text UI.
- Never communicate status or action with color alone. Pair color with text, an icon, a pattern, or another visible cue.

The YAML front matter intentionally omits literal color values: Magnetic color tokens resolve through themes, so a single hardcoded palette would misrepresent the design system and break light/dark adaptation.

## Typography

Use Sharp Sans Bold for headings, Inter for body copy, and Roboto Mono only for code and technical values such as IP or MAC addresses. The YAML front matter contains the core roles most agents need; component documentation may define additional weights and sizes.

- Default body copy is P3: Inter Regular at 14px/20px.
- Primary titles use title case. Section, subsection, and smaller headings use sentence case.
- Use sentence case for UI copy except page titles, proper nouns, breadcrumbs, and left-navigation items.
- Keep links and tertiary buttons bold, except where a component guideline explicitly defines another treatment.
- Contextualize large numerals with a unit, percentage, label, or nearby explanatory text.
- Do not use monospace for ordinary labels or prose.

## Layout

Use a consistent application shell with a header, left navigation, content region, and an optional footer. Every page requires a page title. Organize primary page regions on a 12-column grid with 24px gutters and allow the content area to respond fluidly.

Use the 4px spacing scale in the YAML front matter for margins, padding, gaps, and line heights. Prefer established component and template spacing over one-off values. Container cards use 24px inner padding; spacing between containers is normally 16px or 24px depending on hierarchy. Forms normally use 16px vertical spacing, increasing to 24px for complex groupings.

Design at a medium or large desktop width, then verify small and extra-large widths. Keep long-form text near 80 characters per line: approximately 720px at 16px body text, 600px at 14px, and 520px at 12px.

## Elevation & Depth

Use Magnetic elevation tokens by name: Subtle for resting cards and containers, Lifted for hovered or lightly raised surfaces, Raised for overlays and dropdowns, and Floating for modals and dialogs. Use one elevation token per surface. Do not hardcode or stack shadows, and do not use shadows as a substitute for correct z-index hierarchy.

## Shapes

Shape and corner radius are component-level decisions in Magnetic, not a universal styling scale. Preserve the radius built into Harbor Elements components and documented variants. Do not apply a global radius or reshape controls to create a different visual language.

## Components

Start with Harbor Elements components and templates. Read `context-map.md`, then load the documentation for every component you intend to use. The component node owns anatomy, properties, variants, behavior, accessibility, and implementation syntax; this file supplies only cross-component design foundations.

Use the standard page title, shell, container-card, form, table, notification, and navigation patterns when they match the task. Do not recreate a documented component with custom markup or CSS. Do not add extra padding around a page-title component, and use a radio group—not a view switcher—when the user is choosing a form value.

## Do's and Don'ts

- Do use Magnetic components, semantic design tokens, and the 4px spacing grid.
- Do keep layouts compact enough for data-rich products while preserving hierarchy and readable line lengths.
- Do use P3 body text by default and pair status colors with labels or icons.
- Do preserve keyboard access, semantic landmarks, visible focus, and logical heading order.
- Do verify the result against the relevant component docs and Magnetic review rules.
- Don't hardcode palette values, invent design tokens, or override component styling without documented support.
- Don't introduce one-off spacing, arbitrary shadows, or a global corner-radius treatment.
- Don't rely on color alone, placeholder text alone, or visual position alone to convey meaning.
- Don't treat this summary as an API reference; component documentation remains authoritative for code.
