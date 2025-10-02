# Hooks

This folder contains ergonomic React hooks/utilities for working with lazily loaded Custom Elements without needing per-component boilerplate.

## `useCustomElementDefined(tag, options?)`
Returns `true` once the given custom element tag has been defined (or immediately if it already is). You can use the boolean to conditionally render fallback UI.

```jsx
import useCustomElementDefined from '../hooks/useCustomElementDefined';

function TableShell() {
  const ready = useCustomElementDefined('hbr-dom-table');
  if (!ready) return <div>Loading table…</div>;
  return <hbr-dom-table columns={cols} data={rows} aria={{ label: 'People' }} />;
}
```

### Options
- `ssrAlwaysTrue` (default: `true`): If rendering on the server, always return `true` to avoid mismatches.

## `useCustomElementsDefined(tags: string[])`
Returns `true` when **all** provided tags are defined.

```jsx
const all = useCustomElementsDefined(['hbr-dom-table','hbr-dom-chart']);
```

## `useSuspendCustomElements(tags: string[])`
Integrates with React Suspense. If any tag is not yet defined, it **throws a promise**, causing the nearest `<Suspense>` boundary to show its fallback.

```jsx
import { useSuspendCustomElements } from '../hooks/useCustomElementDefined';

function LazyArea() {
  useSuspendCustomElements(['hbr-dom-table']);
  return <hbr-dom-table columns={cols} data={rows} />;
}

// Usage
<Suspense fallback={<Spinner />}> 
  <LazyArea />
</Suspense>
```

## `<Defined />` Component
Declarative wrapper that waits for one or many tags before rendering children.

```jsx
import { Defined } from '../hooks/useCustomElementDefined';

<Defined tags={['hbr-dom-table']} fallback={<Skeleton />}> 
  <hbr-dom-table columns={cols} data={rows} />
</Defined>
```

## `<WhenDefined />` Component
Sugar for a single tag.

```jsx
import { WhenDefined } from '../hooks/useCustomElementDefined';

<WhenDefined tag="hbr-dom-table" fallback={<div>Loading…</div>}>
  <hbr-dom-table columns={cols} data={rows} />
</WhenDefined>
```

## `prewarmCustomElementDefinitions(tags: string[])`
Triggers the internal `customElements.whenDefined(tag)` promises early, useful if you know a view that needs them is about to mount.

```js
import { prewarmCustomElementDefinitions } from '../hooks/useCustomElementDefined';
prewarmCustomElementDefinitions(['hbr-dom-table']);
```

## Design Notes
- **No mutation observer needed**: relies on the platform's `customElements.whenDefined` API.
- **Promise deduplication**: Each tag's definition promise is stored and reused, avoiding redundant microtasks.
- **SSR-friendly**: Prevents hydration mismatches by returning `true` immediately on the server (configurable).
- **Suspense-ready**: Enables progressive enhancement without custom wrappers around each element.

## Choosing an Approach
| Goal | API | Notes |
|------|-----|-------|
| Quick conditional rendering | `useCustomElementDefined` | Imperative boolean gate |
| Multiple elements readiness | `useCustomElementsDefined` | All-or-nothing boolean |
| Suspense boundary fallback | `useSuspendCustomElements` | Throws until ready |
| Declarative wrapper | `<Defined/>` / `<WhenDefined/>` | Clean JSX, very readable |
| Prefetch readiness | `prewarmCustomElementDefinitions` | Preps before first mount |

## Pattern Example (Route Split)
```jsx
// Route component
function TableRoute() {
  const ready = useCustomElementDefined('hbr-dom-table');
  return (
    <section>
      <h1>Users</h1>
      {!ready && <p>Preparing table…</p>}
      {ready && (
        <hbr-dom-table columns={cols} data={rows} aria={{ label: 'Users table' }} />
      )}
    </section>
  );
}
```

## Advanced: Combining with Dynamic Imports
If you dynamically import the *definition* code late:
```jsx
useEffect(() => {
  import('https://cdn.example.com/hbr-dom-table/v1/define.js');
}, []);
```
The hook will flip to `true` automatically once that module registers the element.

## Caveats
- Must run in a browser environment that supports `customElements` (all modern evergreen browsers). If you polyfill, load the polyfill before using these hooks.
- Does not itself load the element code; it only observes definition status.
- If React renders the element *before* definition and you pass complex objects as attributes (not properties), those might serialize; ensure you use property binding (JSX does this automatically for recognized definitions) or load a stub definition early.

## Future Enhancements (Potential)
- Optional debug logging of timing
- Timeout / warning if definition takes too long
- TypeScript typings

---
Feel free to add more hooks or extend existing ones here.
