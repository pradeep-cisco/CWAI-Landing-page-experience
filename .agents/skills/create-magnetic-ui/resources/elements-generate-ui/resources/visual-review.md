# Screenshot Visual Review

Use this checklist for every generated or modified page that renders Harbor Elements or other user interface content.

## Required review

1. Start the consuming application.
2. Open the exact page route in an available browser or browser automation tool.
3. Wait for custom elements, charts, tables, and asynchronous content to render.
4. Capture a screenshot at the user-requested viewport.
5. If the user did not provide a viewport, capture a desktop screenshot at 1440 by 900 pixels.
6. Capture a responsive screenshot at 390 by 844 pixels unless the target explicitly supports desktop only.
7. Review each screenshot for page hierarchy, alignment, spacing, wrapping, clipping, overflow, overlapping content, sticky or fixed elements, focus visibility, and empty states.
8. Verify that every adjacent region has an explicit spacing owner. Use `hbr-layout gap`, a documented component spacing property, or a documented design token.
9. For tables, review the filter-to-table gap, table-to-pagination gap, header height, wrapped column labels, row alignment, and the table's relationship to its card boundary.
10. For charts, review the chart frame, labels, legends, tooltips, and the chart's relationship to its card boundary.
11. Interact with the page states that can change layout, then capture another screenshot. Include filters, pagination, sorting, expanded content, drawers, modals, tabs, and empty states when present.
12. Re-capture screenshots after every layout fix.

## Completion rules

- A build, lint, route response, or DOM assertion does not replace screenshot review.
- Do not use browser-default margins, incidental whitespace, or line wrapping as the spacing mechanism for adjacent functional regions.
- If browser or screenshot tooling is unavailable, report the visual review as incomplete.
- Do not report the page as fully verified when the required screenshots were not captured and reviewed.
