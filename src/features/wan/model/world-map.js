import land from './world-land.json' with { type: 'json' };

export const WIDTH = 1000;
export const HEIGHT = 650;
export const WORLD_WIDTH = WIDTH;
export const WORLD_HEIGHT = HEIGHT;
export const LAND = Object.freeze(land.paths);
export const LAND_META = Object.freeze({ ...land, paths: undefined });
export const WORLD_EXTENT = Object.freeze({ west: -180, east: 180, north: 84, south: -60 });

// An equirectangular projection with identical angular scale on both axes.
// The viewport omits Antarctica to reserve room for operational cards.
export function projectLonLat(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const [lon, lat] = coordinates;
  if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -180 || lon > 180 || lat < -60 || lat > 84) return null;
  return { x: 30 + (lon + 180) * 940 / 360, y: 160 + (84 - lat) * 940 / 360 };
}

const coreLocations = [
  { coordinates: [-73, 41], label: 'Eastern North America' },
  { coordinates: [4, 49], label: 'Western Europe' },
  { coordinates: [77, 28], label: 'Northern India' },
];
const placement = (coordinates, card, label, extras = {}) => ({ coordinates, card, label, ...extras });

// These are deliberately declared presentation presets. They are not inferred
// from domain names and are not site coordinates received from the controller.
export const ILLUSTRATIVE_PLACEMENTS = Object.freeze({
  national: {
    West: placement([-118, 34], [110, 235], 'Western North America'),
    Core: placement([4, 49], [445, 60], 'Logical backbone across several locations', { multiRegion: true, locations: coreLocations }),
    East: placement([139, 36], [895, 230], 'Eastern Asia'),
    North: placement([10, 59], [690, 120], 'Northern Europe'),
    South: placement([25, -29], [480, 565], 'Southern Africa'),
    Metro: placement([104, 1], [840, 470], 'Southeast Asia'),
  },
  metro: {
    Access: placement([-118, 34], [110, 235], 'Western North America'),
    Transport: placement([4, 49], [445, 60], 'Logical transport across several locations', { multiRegion: true, locations: coreLocations }),
    Enterprise: placement([139, 36], [895, 230], 'Eastern Asia'),
    Campus: placement([25, -29], [480, 565], 'Southern Africa'),
  },
  regional: {
    Coastal: placement([-122, 37], [110, 235], 'Western North America'),
    Inland: placement([15, 49], [445, 60], 'Central Europe'),
    Capital: placement([139, 36], [895, 230], 'Eastern Asia'),
    Highlands: placement([77, 28], [840, 470], 'Northern India'),
    Southern: placement([25, -29], [480, 565], 'Southern Africa'),
  },
});

function curve(from, to, key) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const hash = [...key].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  const side = hash % 2 ? 1 : -1;
  // Small local bends keep neighboring European anchors legible. Longer
  // corridors arc over oceans without claiming an actual physical cable path.
  const bend = Math.min(60, distance * .16) * side;
  const nx = distance ? -dy / distance : 0, ny = distance ? dx / distance : 0;
  const control1 = { x: from.x + dx / 3 + nx * bend, y: from.y + dy / 3 + ny * bend };
  const control2 = { x: from.x + dx * 2 / 3 + nx * bend, y: from.y + dy * 2 / 3 + ny * bend };
  const midpoint = {
    x: (from.x + 3 * control1.x + 3 * control2.x + to.x) / 8,
    y: (from.y + 3 * control1.y + 3 * control2.y + to.y) / 8,
  };
  const pair = point => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  return { d: `M ${pair(from)} C ${pair(control1)} ${pair(control2)} ${pair(to)}`, midpoint, label: [midpoint.x, midpoint.y] };
}

/** Inventory edges retain their identity and membership; geography is display-only. */
export function buildWorldLayout(domains = [], bundles = [], setupId = 'national') {
  const ids = new Set(domains.map(domain => domain.id));
  if (ids.size !== domains.length) throw new TypeError('World-map domain IDs must be unique');
  if (new Set(bundles.map(bundle => bundle.id)).size !== bundles.length) throw new TypeError('World-map bundle IDs must be unique');
  const presets = ILLUSTRATIVE_PLACEMENTS[setupId] || {};
  const nodes = [], unplaced = [];
  for (const domain of domains) {
    const preset = presets[domain.id];
    const anchor = preset && projectLonLat(preset.coordinates);
    if (!anchor) {
      unplaced.push({ ...domain, reason: 'No declared geographic placement' });
      continue;
    }
    const locations = preset.locations || [{ coordinates: preset.coordinates, label: preset.label }];
    nodes.push({
      ...domain, x: preset.card[0], y: preset.card[1], width: 190, height: 78,
      anchor, anchors: locations.map(location => ({ ...projectLonLat(location.coordinates), coordinates: [...location.coordinates], label: location.label })),
      coordinates: [...preset.coordinates], multiRegion: Boolean(preset.multiRegion),
      locationLabel: preset.label, locationSource: 'illustrative',
    });
  }
  const byId = new Map(nodes.map(node => [node.id, node]));
  const routes = [], unmappedRoutes = [];
  for (const bundle of bundles) {
    const from = byId.get(bundle.from), to = byId.get(bundle.to);
    if (!from || !to) {
      unmappedRoutes.push({ ...bundle, reason: 'A domain has no declared geographic placement' });
      continue;
    }
    routes.push({ ...bundle, ...curve(from.anchor, to.anchor, bundle.id), fromAnchor: from.anchor, toAnchor: to.anchor });
  }
  return { width: WIDTH, height: HEIGHT, nodes, routes, unplaced, unmappedRoutes, illustrative: true };
}
