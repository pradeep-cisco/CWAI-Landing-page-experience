# Harbor Elements Playwright Testing

Use this guide when the request is about testing pages that render Harbor Elements components with Playwright.

## Core Rules

1. Prefer user-facing locators first.
2. Use explicit `data-testid` contracts only when role, label, text, placeholder, alt text, or title are not sufficient.
3. Wait on visible state and accessibility state instead of arbitrary timers.
4. Do not use XPath for Harbor Elements.

## Screenshot review for generated pages

When testing a generated or modified page, capture screenshots at the primary viewport and a responsive viewport. Review hierarchy, alignment, wrapping, clipping, overflow, and required spacing between adjacent regions.

Treat spacing as structural behavior. Verify that `hbr-layout gap`, a documented component property, or a documented design token owns each required relationship. A build or DOM assertion does not replace screenshot review.

## Shadow DOM

Playwright locators work through Harbor Elements' open shadow roots by default. Prefer `getByRole()`, `getByLabel()`, and `getByText()` instead of falling back to CSS or DOM traversal just because a component is implemented as a web component.

## Locator Order

Use locators in this order unless the component exposes a better explicit contract:

1. `getByRole()`
2. `getByLabel()`
3. `getByText()`
4. `getByPlaceholder()`
5. `getByAltText()` or `getByTitle()`
6. `getByTestId()`

## App-Owned vs Library-Owned Test IDs

- App-owned host ids: application code can add `data-testid` to Harbor component hosts for page-level scoping.
- Library-owned internal ids: Harbor exposes stable ids for internal controls where semantic locators are not enough.

If the user wants to target a component instance on their page, recommend a host-level id first.

```html
<hbr-select data-testid="country"></hbr-select>
```

Then scope within it:

```ts
const country = page.getByTestId("country");
await country.getByTestId("combobox").click();
await page.getByTestId("option-us").click();
```

## High-Value Harbor Contracts

Recommend built-in contracts only when the request needs awkward internal controls or deterministic overlay state.

- `hbr-button`
  - host `data-testid` remains on the component host
  - native clickable button exposes `{host-data-testid}-control`
- `hbr-select`
  - `combobox`
  - `clear-button`
  - listbox `data-state="open|closed"`
  - listbox `data-options-loaded="true|false"`
- `hbr-option`
  - `option-{value}`
- `hbr-dropdown`
  - host ids derive `{host}-trigger`, `{host}-control`, `{host}-panel`
  - panel `data-state="open|closed"`
  - panel `data-items-loaded="true|false"`
- `hbr-popover`
  - host ids derive `{host}-trigger`, `{host}-control`, `{host}-panel`
  - trigger exposes `aria-controls`, `aria-expanded`, and `aria-describedby`
  - panel `data-state="open|closed"`
  - panel `data-content-loaded="true|false"`
- `hbr-modal`
  - `close-button`
  - host ids derive `{host}-panel` and `{host}-overlay`
  - panel `data-state="open|closed"`
- `hbr-drawer`
  - `close-button`
  - host ids derive `{host}-panel` and `{host}-overlay`
  - panel `data-state="open|closed"`
- `hbr-dom-table`
  - row identity via `data-row-id`
  - row id via `row-{id}`
  - row selection checkbox via `row-checkbox-{rowId}`
  - selected rows expose `aria-selected="true|false"`
- `hbr-table`
  - data rows expose `data-row-id`
  - row selection checkbox via `row-checkbox-{rowId}` when present
  - selected rows expose `aria-selected="true|false"`
- `hbr-tree-item`
  - node id via `treeitem-{dataId}`
  - selection checkbox via `checkbox-{dataId}`
  - action container via `actions-{dataId}`
  - slotted action controls can opt into `delete-{dataId}` style ids with `data-action`
- `hbr-truncate` and `hbr-truncation`
  - truncated content exposes the full value via `title` and `data-full-text`

## Common Patterns

### Row selection

Prefer the explicit row checkbox contract over clicking the whole row.

```ts
const row = page.locator('[data-row-id="inventory-1"]');
const checkbox = page.getByTestId("row-checkbox-inventory-1");
await expect(checkbox).toHaveAttribute("aria-checked", "false");
await checkbox.click();
await expect(checkbox).toHaveAttribute("aria-checked", "true");
await expect(row).toHaveAttribute("aria-selected", "true");
```

### Overlay state

Assert role-based visibility first, then explicit state attributes when available.

```ts
await page.getByTestId("country").getByTestId("combobox").click();
const listbox = page.getByRole("listbox");
await expect(listbox).toHaveAttribute("data-state", "open");
await expect(listbox).toHaveAttribute("data-options-loaded", "true");
```

```ts
await page.getByTestId("settings-trigger").click();
await expect(page.getByTestId("settings-panel")).toHaveAttribute("data-state", "open");
```

### Truncated text

Do not depend on hover-only tooltips when the full value is already exposed on the component.

```ts
const truncated = page.locator('hbr-truncate[data-testid="serial-number"]');
await expect(truncated).toHaveAttribute("data-truncated");
await expect(truncated).toHaveAttribute("title", /ABC-123/);
await expect(truncated).toHaveAttribute("data-full-text", /ABC-123/);
```

## Avoid

- Do not claim every Harbor component supports every Playwright locator family.
- Do not recommend nth-based locators as a primary strategy.
- Do not recommend CSS structure selectors when a role, label, text, or explicit test contract exists.
- Do not force `getByTestId()` where a semantic locator is already stable.
