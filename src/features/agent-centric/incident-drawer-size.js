const positive = value => Number.isFinite(value) && value > 0;

/** Reserve room for both the dock and the remaining application workspace. */
export function getIncidentDrawerBounds(contentWidth, viewportWidth = contentWidth) {
  const content = positive(contentWidth) ? contentWidth : positive(viewportWidth) ? viewportWidth : 1280;
  const viewport = positive(viewportWidth) ? viewportWidth : content;
  const usable = Math.min(content, viewport);
  const max = Math.max(1, Math.floor(Math.min(640, usable - 440)));
  const min = Math.min(320, max);
  const defaultWidth = Math.min(max, Math.max(min, 480));
  return { min, max, defaultWidth };
}

export function clampIncidentDrawerWidth(width, bounds) {
  const value = positive(width) ? width : bounds.defaultWidth;
  return Math.min(bounds.max, Math.max(bounds.min, Math.round(value)));
}

/** A right-docked drawer grows when its left edge moves left. */
export function incidentDrawerWidthForKey(key, width, bounds, step = 32) {
  const current = clampIncidentDrawerWidth(width, bounds);
  const increment = positive(step) ? step : 32;
  if (key === 'Home') return bounds.min;
  if (key === 'End') return bounds.max;
  if (key === 'ArrowLeft') return clampIncidentDrawerWidth(current + increment, bounds);
  if (key === 'ArrowRight') return clampIncidentDrawerWidth(current - increment, bounds);
  return null;
}
