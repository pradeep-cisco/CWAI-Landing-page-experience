// Lightweight utilities to ergonomically wait for one or more custom elements
// to be defined inside React components (React 18/19 compatible) without
// altering the custom element source code.
//
// Provided APIs:
// 1. useCustomElementDefined(tag) -> boolean
// 2. useCustomElementsDefined([tag1, tag2, ...]) -> boolean (all must be defined)
// 3. useSuspendCustomElements([tags]) -> throws a promise until all are defined (for Suspense)
// 4. <Defined tags={[..]} fallback={...}> children </Defined>
//
// Goals:
// - Single shared promise per tag (dedup network / flush effects once)
// - Immediate true if already defined
// - Avoid re-renders beyond necessary
// - Tiny footprint; no external deps

import { useEffect, useState, useRef } from 'react';

// Internal registry of definition promises keyed by tag name.
const definitionPromises = new Map();

function getDefinitionPromise(tag) {
  const lower = tag.toLowerCase();
  if (customElements.get(lower)) {
    // Already defined; resolve synchronously.
    return Promise.resolve();
  }
  if (!definitionPromises.has(lower)) {
    definitionPromises.set(lower, customElements.whenDefined(lower));
  }
  return definitionPromises.get(lower);
}

/**
 * Hook: returns true once the given custom element tag is defined.
 * @param {string} tag - custom element tag name (case-insensitive)
 * @param {object} [opts]
 * @param {boolean} [opts.ssrAlwaysTrue] - If true, returns true on server (noop). Default: true.
 */
export function useCustomElementDefined(tag, opts = {}) {
  const { ssrAlwaysTrue = true } = opts;
  const isServer = typeof window === 'undefined' || !window.customElements;
  const initial = isServer ? !!ssrAlwaysTrue : !!customElements.get(tag);
  const [defined, setDefined] = useState(initial);
  const tagRef = useRef(tag);
  tagRef.current = tag;

  useEffect(() => {
    if (defined) return; // already done
    let cancelled = false;
    getDefinitionPromise(tagRef.current).then(() => {
      if (!cancelled) setDefined(true);
    });
    return () => { cancelled = true; };
  }, [defined, tag]);

  return defined;
}

/**
 * Hook: returns true once ALL provided tags are defined.
 * @param {string[]} tags
 */
export function useCustomElementsDefined(tags) {
  const allDefinedNow = tags.every(t => !!customElements.get(t));
  const [all, setAll] = useState(allDefinedNow);
  const tagsRef = useRef(tags);
  tagsRef.current = tags;

  useEffect(() => {
    if (all) return;
    let cancelled = false;
    Promise.all(tagsRef.current.map(getDefinitionPromise)).then(() => {
      if (!cancelled) setAll(true);
    });
    return () => { cancelled = true; };
  }, [all, tags.join('|')]);
  return all;
}

/**
 * Suspense helper: throws a promise until all tags are defined.
 * @param {string[]} tags
 */
export function useSuspendCustomElements(tags) {
  const allDefinedNow = tags.every(t => !!customElements.get(t));
  if (allDefinedNow) return; // nothing to do
  // Throw a combined promise for Suspense boundary.
  throw Promise.all(tags.map(getDefinitionPromise));
}

/**
 * Component wrapper that waits for tags before rendering children.
 * If `suspense` is true and a Suspense boundary is above, prefer Suspense approach.
 */
export function Defined({ tags, fallback = null, children, suspense = false }) {
  if (suspense) {
    // Will throw promise if not ready.
    useSuspendCustomElements(tags);
    return children;
  }
  const ready = useCustomElementsDefined(tags);
  return ready ? children : fallback;
}

// Convenience single-tag alias component
export function WhenDefined({ tag, fallback = null, children, suspense = false }) {
  return <Defined tags={[tag]} fallback={fallback} suspense={suspense}>{children}</Defined>;
}

// (Optional) Pre-warm definitions manually (can be tree-shaken)
export function prewarmCustomElementDefinitions(tags) {
  tags.forEach(t => getDefinitionPromise(t));
}

export default useCustomElementDefined;
