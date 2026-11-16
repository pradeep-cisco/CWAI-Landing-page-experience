export const MIN_MAP_SCALE = 1;
export const MAX_MAP_SCALE = 3;

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const dimension = value => Math.max(0, finite(value));
const within = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const cleanZero = value => value === 0 ? 0 : value;

// A viewport transforms a point in the fitted pixel canvas to p * scale + offset.
// Keep the original canvas covering the viewport, with no pan at the fitted size.
export function clampViewport(current, size) {
  const scale = within(finite(current?.scale, MIN_MAP_SCALE), MIN_MAP_SCALE, MAX_MAP_SCALE);
  const width = dimension(size?.width), height = dimension(size?.height);
  return {
    x: cleanZero(within(finite(current?.x), width * (1 - scale), 0)),
    y: cleanZero(within(finite(current?.y), height * (1 - scale), 0)),
    scale,
  };
}

export function zoomAt(current, factor, anchor, size) {
  const start = clampViewport(current, size);
  const multiplier = Number.isFinite(factor) && factor > 0 ? factor : 1;
  const scale = within(start.scale * multiplier, MIN_MAP_SCALE, MAX_MAP_SCALE);
  const ratio = scale / start.scale;
  const x = finite(anchor?.x, dimension(size?.width) / 2);
  const y = finite(anchor?.y, dimension(size?.height) / 2);
  return clampViewport({
    x: x - (x - start.x) * ratio,
    y: y - (y - start.y) * ratio,
    scale,
  }, size);
}

export function panBy(current, dx, dy, size) {
  const start = clampViewport(current, size);
  return clampViewport({ ...start, x: start.x + finite(dx), y: start.y + finite(dy) }, size);
}

// Fit arbitrary source bounds without stretching either map axis. The returned
// offset includes a nonzero source origin, as used by the compact world view.
export function fitMapViewport(width, height, bounds) {
  const targetWidth = dimension(width), targetHeight = dimension(height);
  const sourceWidth = dimension(bounds?.width), sourceHeight = dimension(bounds?.height);
  if (!targetWidth || !targetHeight || !sourceWidth || !sourceHeight) return { x: 0, y: 0, scale: 1 };
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  if (!Number.isFinite(scale) || scale <= 0) return { x: 0, y: 0, scale: 1 };
  return {
    x: finite((targetWidth - sourceWidth * scale) / 2 - finite(bounds?.x) * scale),
    y: finite((targetHeight - sourceHeight * scale) / 2 - finite(bounds?.y) * scale),
    scale,
  };
}
