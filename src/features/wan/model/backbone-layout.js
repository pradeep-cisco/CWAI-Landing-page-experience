// Pure logical layout. Domain names and alarm state never determine placement.
const MAX_PAGE_SIZE = 12;
const CARD_HEIGHT = 104;
const EPSILON = 1e-7;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const numeric = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const samePoint = (a, b) => Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;

function simplify(points) {
  const clean = [];
  for (const point of points) {
    if (clean.length && samePoint(point, clean.at(-1))) continue;
    while (clean.length > 1) {
      const a = clean.at(-2), b = clean.at(-1);
      const cross = (b[0] - a[0]) * (point[1] - b[1]) - (b[1] - a[1]) * (point[0] - b[0]);
      const forward = (b[0] - a[0]) * (point[0] - b[0]) + (b[1] - a[1]) * (point[1] - b[1]);
      if (Math.abs(cross) > EPSILON || forward < 0) break;
      clean.pop();
    }
    clean.push([...point]);
  }
  return clean;
}

function rectangle(node, padding = 0) {
  return {left: node.x - node.width / 2 - padding, right: node.x + node.width / 2 + padding,
    top: node.y - node.height / 2 - padding, bottom: node.y + node.height / 2 + padding};
}

function segmentClear(a, b, obstacles) {
  if (Math.abs(a[0] - b[0]) < EPSILON) {
    return !obstacles.some(r => a[0] > r.left + EPSILON && a[0] < r.right - EPSILON &&
      Math.max(a[1], b[1]) > r.top + EPSILON && Math.min(a[1], b[1]) < r.bottom - EPSILON);
  }
  if (Math.abs(a[1] - b[1]) < EPSILON) {
    return !obstacles.some(r => a[1] > r.top + EPSILON && a[1] < r.bottom - EPSILON &&
      Math.max(a[0], b[0]) > r.left + EPSILON && Math.min(a[0], b[0]) < r.right - EPSILON);
  }
  return false;
}

function routeClear(points, obstacles) {
  return points.slice(1).every((point, i) => segmentClear(points[i], point, obstacles));
}

// A small binary heap keeps obstacle routing inexpensive on the bounded page.
class MinHeap {
  items = [];
  push(item) {
    const items = this.items;
    let i = items.length;
    items.push(item);
    while (i) {
      const parent = (i - 1) >> 1;
      if (items[parent].priority <= item.priority) break;
      items[i] = items[parent]; i = parent;
    }
    items[i] = item;
  }
  pop() {
    const items = this.items, first = items[0], last = items.pop();
    if (items.length) {
      let i = 0;
      while (i * 2 + 1 < items.length) {
        let child = i * 2 + 1;
        if (child + 1 < items.length && items[child + 1].priority < items[child].priority) child++;
        if (items[child].priority >= last.priority) break;
        items[i] = items[child]; i = child;
      }
      items[i] = last;
    }
    return first;
  }
}

// Rectilinear visibility grid: routes may use row gaps, column gaps, and the
// outside margin, but never pass through any card (including their own cards).
function orthogonalRoute(start, end, obstacles, width, height) {
  const coordinates = (axis, max) => [...new Set([
    start[axis], end[axis], EPSILON, max - EPSILON,
    ...obstacles.flatMap(r => axis ? [r.top, r.bottom] : [r.left, r.right]),
  ].filter(value => value >= 0 && value <= max))].sort((a, b) => a - b);
  const xs = coordinates(0, width), ys = coordinates(1, height), cols = xs.length;
  const index = (x, y) => y * cols + x;
  const point = key => [xs[key % cols], ys[Math.floor(key / cols)]];
  const origin = index(xs.indexOf(start[0]), ys.indexOf(start[1]));
  const destination = index(xs.indexOf(end[0]), ys.indexOf(end[1]));
  const distance = new Float64Array(xs.length * ys.length * 3).fill(Infinity);
  const previous = new Int32Array(distance.length).fill(-1);
  const queue = new MinHeap();
  distance[origin * 3] = 0;
  queue.push({state: origin * 3, cost: 0, priority: 0});
  while (queue.items.length) {
    const current = queue.pop();
    if (current.cost !== distance[current.state]) continue;
    const key = Math.floor(current.state / 3), axis = current.state % 3;
    if (key === destination) {
      const points = [];
      for (let state = current.state; state !== -1; state = previous[state]) points.push(point(Math.floor(state / 3)));
      return simplify(points.reverse());
    }
    const x = key % cols, y = Math.floor(key / cols), a = point(key);
    for (const [dx, dy, nextAxis] of [[-1, 0, 1], [1, 0, 1], [0, -1, 2], [0, 1, 2]]) {
      if (x + dx < 0 || x + dx >= cols || y + dy < 0 || y + dy >= ys.length) continue;
      const next = index(x + dx, y + dy), b = point(next);
      if (!segmentClear(a, b, obstacles)) continue;
      const cost = current.cost + Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + (axis && axis !== nextAxis ? 18 : 0);
      const state = next * 3 + nextAxis;
      if (cost >= distance[state]) continue;
      distance[state] = cost; previous[state] = current.state;
      queue.push({state, cost, priority: cost + Math.abs(b[0] - end[0]) + Math.abs(b[1] - end[1])});
    }
  }
  // With disjoint cards and a nonzero outer margin the visibility grid always
  // has a route. Failing explicitly is safer than drawing an invented shortcut.
  throw new Error('Unable to route a backbone connection around the visible cards');
}

function preferredSides(from, to) {
  if (from.id === to.id) return ['right', 'right'];
  if (Math.abs(from.y - to.y) > EPSILON) return from.y < to.y ? ['bottom', 'top'] : ['top', 'bottom'];
  return from.x < to.x ? ['right', 'left'] : ['left', 'right'];
}

function assignPorts(corridors, nodeIndex) {
  const groups = new Map();
  const routes = corridors.map((bundle, index) => {
    const from = nodeIndex.get(bundle.from), to = nodeIndex.get(bundle.to);
    const sides = preferredSides(from, to);
    const route = {...bundle, ports: []};
    [from, to].forEach((node, role) => {
      const side = sides[role], key = `${nodeIndex.get(node.id).order}:${side}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({node, side, target: role ? from : to, index, role, route});
    });
    return route;
  });
  for (const entries of groups.values()) {
    const horizontal = ['top', 'bottom'].includes(entries[0].side);
    entries.sort((a, b) => (horizontal ? a.target.x - b.target.x || a.target.y - b.target.y :
      a.target.y - b.target.y || a.target.x - b.target.x) || a.index - b.index || a.role - b.role);
    entries.forEach(({node, side, route, role}, i) => {
      const length = horizontal ? node.width : node.height;
      const usable = Math.max(0, length - Math.min(32, length / 3));
      const offset = ((i + 1) / (entries.length + 1) - .5) * usable;
      const point = horizontal ? [node.x + offset, node.y + (side === 'top' ? -1 : 1) * node.height / 2] :
        [node.x + (side === 'left' ? -1 : 1) * node.width / 2, node.y + offset];
      route.ports[role] = {point, side};
    });
  }
  return routes;
}

function exitPoint(port, distance) {
  const direction = {left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1]}[port.side];
  return [port.point[0] + direction[0] * distance, port.point[1] + direction[1] * distance];
}

function routePoints(route, obstacles, width, height, exitDistance) {
  const [from, to] = route.ports, a = exitPoint(from, exitDistance), b = exitPoint(to, exitDistance);
  const vertical = ['top', 'bottom'].includes(from.side);
  let middle;
  if (route.from === route.to) {
    const outside = Math.max(a[0], b[0]) + exitDistance;
    middle = [a, [outside, a[1]], [outside, b[1]], b];
  } else if (vertical) {
    const y = (a[1] + b[1]) / 2;
    middle = [a, [a[0], y], [b[0], y], b];
  } else {
    const x = (a[0] + b[0]) / 2;
    middle = [a, [x, a[1]], [x, b[1]], b];
  }
  if (!middle.every(([x, y]) => x >= 0 && x <= width && y >= 0 && y <= height) || !routeClear(middle, obstacles)) {
    middle = orthogonalRoute(a, b, obstacles, width, height);
  }
  return simplify([from.point, ...middle, to.point]);
}

function routeLabel(points, nodes, width, height) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const candidates = [];
  let elapsed = 0;
  lengths.forEach((length, i) => {
    for (const fraction of [.5, .25, .75, clamp((total / 2 - elapsed) / (length || 1), 0, 1)]) {
      const a = points[i], b = points[i + 1];
      candidates.push({point: [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction],
        score: Math.abs(elapsed + length * fraction - total / 2)});
    }
    elapsed += length;
  });
  candidates.sort((a, b) => a.score - b.score);
  const fits = ([x, y]) => x >= 26 && x <= width - 26 && y >= 13 && y <= height - 13 &&
    nodes.every(node => {
      const r = rectangle(node);
      return x + 26 <= r.left || x - 26 >= r.right || y + 13 <= r.top || y - 13 >= r.bottom;
    });
  return (candidates.find(candidate => fits(candidate.point)) || candidates[0]).point;
}

/**
 * All x/y node coordinates are card centers in CSS pixels. Every route begins
 * and ends at its actual cards' boundaries. `compact` intentionally preserves
 * anchors, dimensions, and route topology so focusing cannot rearrange the WAN.
 * Page numbers are zero based; start/end are one-based inclusive inventory rows.
 */
export function layoutBackbone({domains = [], bundles = [], width = 1000, compact = false, page = 0, pageSize = 12} = {}) {
  width = Number(width);
  if (!Number.isFinite(width) || width <= 0) width = 1000;
  const domainIds = new Set(domains.map(domain => domain.id));
  if (domainIds.size !== domains.length) throw new TypeError('Backbone domain IDs must be unique');
  const requestedSize = Number(pageSize);
  pageSize = Number.isFinite(requestedSize) && requestedSize > 0 ? clamp(Math.trunc(requestedSize), 1, MAX_PAGE_SIZE) : MAX_PAGE_SIZE;
  const pages = Math.max(1, Math.ceil(domains.length / pageSize));
  page = clamp(Math.trunc(numeric(page)), 0, pages - 1);
  const visibleDomains = domains.slice(page * pageSize, (page + 1) * pageSize);
  const visibleDomainIds = visibleDomains.map(domain => domain.id), visibleIds = new Set(visibleDomainIds);
  const columns = width >= 640 ? 3 : width >= 280 ? 2 : 1;
  const paddingX = columns === 3 ? 24 : columns === 2 ? clamp((width - 264) / 4, 8, 16) : Math.min(16, width / 10);
  const minGap = columns === 3 ? 72 : columns === 2 ? clamp(width - paddingX * 2 - 252, 12, 40) : 0;
  const cardWidth = Math.min(180, (width - paddingX * 2 - minGap * (columns - 1)) / columns);
  const cardHeight = columns === 3 ? 92 : CARD_HEIGHT, rowGap = columns === 3 ? 40 : 28;
  const paddingY = columns === 3 ? 20 : 24;
  const stepX = columns === 1 ? 0 : (width - paddingX * 2 - cardWidth) / (columns - 1);
  const occupied = new Set(), positions = new Map(), maxRows = Math.ceil(MAX_PAGE_SIZE / columns);
  // Optional numeric hints preserve a configured logical arrangement on wide
  // screens. Partial, colliding, or oversized hints fill the remaining grid.
  if (columns === 3) visibleDomains.forEach((domain, index) => {
    const hint = domain.layout;
    if (!Array.isArray(hint) || hint.length < 2) return;
    const [column, row] = hint;
    if (!Number.isInteger(column) || !Number.isInteger(row) || column < 0 || column >= columns || row < 0 || row >= maxRows) return;
    const key = `${column}:${row}`;
    if (occupied.has(key)) return;
    occupied.add(key); positions.set(index, [column, row]);
  });
  visibleDomains.forEach((domain, index) => {
    if (positions.has(index)) return;
    for (let cell = 0; cell < MAX_PAGE_SIZE; cell++) {
      const column = cell % columns, row = Math.floor(cell / columns), key = `${column}:${row}`;
      if (occupied.has(key)) continue;
      occupied.add(key); positions.set(index, [column, row]); break;
    }
  });
  const rows = visibleDomains.length ? Math.max(...[...positions.values()].map(([, row]) => row)) + 1 : 1;
  const height = paddingY * 2 + rows * cardHeight + (rows - 1) * rowGap;
  const nodes = visibleDomains.map((domain, order) => {
    const [column, row] = positions.get(order);
    return {...domain, label: domain.label ?? String(domain.id),
      x: columns === 1 ? width / 2 : paddingX + cardWidth / 2 + column * stepX,
      y: paddingY + cardHeight / 2 + row * (cardHeight + rowGap), width: cardWidth, height: cardHeight};
  });
  const nodeIndex = new Map(nodes.map((node, order) => [node.id, {...node, order}]));
  const includedBundles = [], offPageBundles = [], invalidBundles = [];
  for (const bundle of bundles) {
    const missing = [...new Set([bundle.from, bundle.to])].filter(id => !domainIds.has(id));
    if (missing.length) invalidBundles.push({...bundle, missing});
    else if (visibleIds.has(bundle.from) && visibleIds.has(bundle.to)) includedBundles.push(bundle);
    else offPageBundles.push({...bundle, visible: [...new Set([bundle.from, bundle.to])].filter(id => visibleIds.has(id)),
      offPage: [...new Set([bundle.from, bundle.to])].filter(id => !visibleIds.has(id))});
  }
  const horizontalGap = columns > 1 ? stepX - cardWidth : Infinity;
  const outerMargin = columns > 1 ? paddingX : (width - cardWidth) / 2;
  const clearance = Math.max(.01, Math.min(8, horizontalGap / 4, outerMargin / 2));
  const exitDistance = clearance * 1.5;
  const obstacles = nodes.map(node => rectangle(node, clearance));
  const corridors = assignPorts(includedBundles, nodeIndex).map(({ports, ...bundle}) => {
    const points = routePoints({...bundle, ports}, obstacles, width, height, exitDistance);
    return {...bundle, points, label: routeLabel(points, nodes, width, height)};
  });
  return {width, height, compact: Boolean(compact), columns, cardWidth, cardHeight, nodes, corridors,
    page, pageSize, pages, total: domains.length, start: domains.length ? page * pageSize + 1 : 0,
    end: Math.min(domains.length, (page + 1) * pageSize), omitted: domains.length - nodes.length,
    visibleDomainIds, offPageBundles, invalidBundles, offPageBundleCount: offPageBundles.length,
    offPageLinkCount: offPageBundles.reduce((sum, bundle) => sum + numeric(bundle.count), 0)};
}
