import { o as dr, r as react, l as Ai, j as jsxRuntime, K as K$1, q as bt, X as Xe, s as zt, v as D, y as Jr, C as yt, M as Mi, J as Jt, w as w$1, E as Et, L as C, N as g$1, $ as $r, a as animated, k as k$1, O as ji, P as Wi, B as Bt, Q as mt, Y, F as Fi, I as It, p as pr, W as We$1, Z as Zr, b as useSpring, T as Ti, H, g as Hi, S as P$1, _ as _i } from './client.js';
import { w, D as D$1, j as j$1, d as dn, z, X } from './harbor-charts-axes.es.js';
import { K, x as x$1, y, p as path } from './line.js';
import { c as constant } from './constant.js';

function I() {
  var x0 = x$1,
      x1 = null,
      y0 = constant(0),
      y1 = y,
      defined = constant(true),
      context = null,
      curve = dr,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return K().defined(defined).curve(curve).context(context);
  }

  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : y1;
  };

  area.lineX0 =
  area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };

  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

const EPSILON = Math.pow(2, -52);
const EDGE_STACK = new Uint32Array(512);

class Delaunator {

    static from(points, getX = defaultGetX, getY = defaultGetY) {
        const n = points.length;
        const coords = new Float64Array(n * 2);

        for (let i = 0; i < n; i++) {
            const p = points[i];
            coords[2 * i] = getX(p);
            coords[2 * i + 1] = getY(p);
        }

        return new Delaunator(coords);
    }

    constructor(coords) {
        const n = coords.length >> 1;
        if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');

        this.coords = coords;

        // arrays that will store the triangulation graph
        const maxTriangles = Math.max(2 * n - 5, 0);
        this._triangles = new Uint32Array(maxTriangles * 3);
        this._halfedges = new Int32Array(maxTriangles * 3);

        // temporary arrays for tracking the edges of the advancing convex hull
        this._hashSize = Math.ceil(Math.sqrt(n));
        this._hullPrev = new Uint32Array(n); // edge to prev edge
        this._hullNext = new Uint32Array(n); // edge to next edge
        this._hullTri = new Uint32Array(n); // edge to adjacent triangle
        this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash

        // temporary arrays for sorting points
        this._ids = new Uint32Array(n);
        this._dists = new Float64Array(n);

        this.update();
    }

    update() {
        const {coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash} =  this;
        const n = coords.length >> 1;

        // populate an array of point indices; calculate input data bbox
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (let i = 0; i < n; i++) {
            const x = coords[2 * i];
            const y = coords[2 * i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            this._ids[i] = i;
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        let minDist = Infinity;
        let i0, i1, i2;

        // pick a seed point close to the center
        for (let i = 0; i < n; i++) {
            const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist) {
                i0 = i;
                minDist = d;
            }
        }
        const i0x = coords[2 * i0];
        const i0y = coords[2 * i0 + 1];

        minDist = Infinity;

        // find the point closest to the seed
        for (let i = 0; i < n; i++) {
            if (i === i0) continue;
            const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist && d > 0) {
                i1 = i;
                minDist = d;
            }
        }
        let i1x = coords[2 * i1];
        let i1y = coords[2 * i1 + 1];

        let minRadius = Infinity;

        // find the third point which forms the smallest circumcircle with the first two
        for (let i = 0; i < n; i++) {
            if (i === i0 || i === i1) continue;
            const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
            if (r < minRadius) {
                i2 = i;
                minRadius = r;
            }
        }
        let i2x = coords[2 * i2];
        let i2y = coords[2 * i2 + 1];

        if (minRadius === Infinity) {
            // order collinear points by dx (or dy if all x are identical)
            // and return the list as a hull
            for (let i = 0; i < n; i++) {
                this._dists[i] = (coords[2 * i] - coords[0]) || (coords[2 * i + 1] - coords[1]);
            }
            quicksort(this._ids, this._dists, 0, n - 1);
            const hull = new Uint32Array(n);
            let j = 0;
            for (let i = 0, d0 = -Infinity; i < n; i++) {
                const id = this._ids[i];
                if (this._dists[id] > d0) {
                    hull[j++] = id;
                    d0 = this._dists[id];
                }
            }
            this.hull = hull.subarray(0, j);
            this.triangles = new Uint32Array(0);
            this.halfedges = new Uint32Array(0);
            return;
        }

        // swap the order of the seed points for counter-clockwise orientation
        if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
            const i = i1;
            const x = i1x;
            const y = i1y;
            i1 = i2;
            i1x = i2x;
            i1y = i2y;
            i2 = i;
            i2x = x;
            i2y = y;
        }

        const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
        this._cx = center.x;
        this._cy = center.y;

        for (let i = 0; i < n; i++) {
            this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
        }

        // sort the points by distance from the seed triangle circumcenter
        quicksort(this._ids, this._dists, 0, n - 1);

        // set up the seed triangle as the starting hull
        this._hullStart = i0;
        let hullSize = 3;

        hullNext[i0] = hullPrev[i2] = i1;
        hullNext[i1] = hullPrev[i0] = i2;
        hullNext[i2] = hullPrev[i1] = i0;

        hullTri[i0] = 0;
        hullTri[i1] = 1;
        hullTri[i2] = 2;

        hullHash.fill(-1);
        hullHash[this._hashKey(i0x, i0y)] = i0;
        hullHash[this._hashKey(i1x, i1y)] = i1;
        hullHash[this._hashKey(i2x, i2y)] = i2;

        this.trianglesLen = 0;
        this._addTriangle(i0, i1, i2, -1, -1, -1);

        for (let k = 0, xp, yp; k < this._ids.length; k++) {
            const i = this._ids[k];
            const x = coords[2 * i];
            const y = coords[2 * i + 1];

            // skip near-duplicate points
            if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
            xp = x;
            yp = y;

            // skip seed triangle points
            if (i === i0 || i === i1 || i === i2) continue;

            // find a visible edge on the convex hull using edge hash
            let start = 0;
            for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
                start = hullHash[(key + j) % this._hashSize];
                if (start !== -1 && start !== hullNext[start]) break;
            }

            start = hullPrev[start];
            let e = start, q;
            while (q = hullNext[e], !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
                e = q;
                if (e === start) {
                    e = -1;
                    break;
                }
            }
            if (e === -1) continue; // likely a near-duplicate point; skip it

            // add the first triangle from the point
            let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);

            // recursively flip triangles from the point until they satisfy the Delaunay condition
            hullTri[i] = this._legalize(t + 2);
            hullTri[e] = t; // keep track of boundary triangles on the hull
            hullSize++;

            // walk forward through the hull, adding more triangles and flipping recursively
            let n = hullNext[e];
            while (q = hullNext[n], orient(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1])) {
                t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
                hullTri[i] = this._legalize(t + 2);
                hullNext[n] = n; // mark as removed
                hullSize--;
                n = q;
            }

            // walk backward from the other side, adding more triangles and flipping
            if (e === start) {
                while (q = hullPrev[e], orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
                    t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
                    this._legalize(t + 2);
                    hullTri[q] = t;
                    hullNext[e] = e; // mark as removed
                    hullSize--;
                    e = q;
                }
            }

            // update the hull indices
            this._hullStart = hullPrev[i] = e;
            hullNext[e] = hullPrev[n] = i;
            hullNext[i] = n;

            // save the two new edges in the hash table
            hullHash[this._hashKey(x, y)] = i;
            hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
        }

        this.hull = new Uint32Array(hullSize);
        for (let i = 0, e = this._hullStart; i < hullSize; i++) {
            this.hull[i] = e;
            e = hullNext[e];
        }

        // trim typed triangle mesh arrays
        this.triangles = this._triangles.subarray(0, this.trianglesLen);
        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }

    _hashKey(x, y) {
        return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
    }

    _legalize(a) {
        const {_triangles: triangles, _halfedges: halfedges, coords} = this;

        let i = 0;
        let ar = 0;

        // recursion eliminated with a fixed-size stack
        while (true) {
            const b = halfedges[a];

            /* if the pair of triangles doesn't satisfy the Delaunay condition
             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
             * then do the same check/flip recursively for the new pair of triangles
             *
             *           pl                    pl
             *          /||\                  /  \
             *       al/ || \bl            al/    \a
             *        /  ||  \              /      \
             *       /  a||b  \    flip    /___ar___\
             *     p0\   ||   /p1   =>   p0\---bl---/p1
             *        \  ||  /              \      /
             *       ar\ || /br             b\    /br
             *          \||/                  \  /
             *           pr                    pr
             */
            const a0 = a - a % 3;
            ar = a0 + (a + 2) % 3;

            if (b === -1) { // convex hull edge
                if (i === 0) break;
                a = EDGE_STACK[--i];
                continue;
            }

            const b0 = b - b % 3;
            const al = a0 + (a + 1) % 3;
            const bl = b0 + (b + 2) % 3;

            const p0 = triangles[ar];
            const pr = triangles[a];
            const pl = triangles[al];
            const p1 = triangles[bl];

            const illegal = inCircle(
                coords[2 * p0], coords[2 * p0 + 1],
                coords[2 * pr], coords[2 * pr + 1],
                coords[2 * pl], coords[2 * pl + 1],
                coords[2 * p1], coords[2 * p1 + 1]);

            if (illegal) {
                triangles[a] = p1;
                triangles[b] = p0;

                const hbl = halfedges[bl];

                // edge swapped on the other side of the hull (rare); fix the halfedge reference
                if (hbl === -1) {
                    let e = this._hullStart;
                    do {
                        if (this._hullTri[e] === bl) {
                            this._hullTri[e] = a;
                            break;
                        }
                        e = this._hullPrev[e];
                    } while (e !== this._hullStart);
                }
                this._link(a, hbl);
                this._link(b, halfedges[ar]);
                this._link(ar, bl);

                const br = b0 + (b + 1) % 3;

                // don't worry about hitting the cap: it can only happen on extremely degenerate input
                if (i < EDGE_STACK.length) {
                    EDGE_STACK[i++] = br;
                }
            } else {
                if (i === 0) break;
                a = EDGE_STACK[--i];
            }
        }

        return ar;
    }

    _link(a, b) {
        this._halfedges[a] = b;
        if (b !== -1) this._halfedges[b] = a;
    }

    // add a new triangle given vertex indices and adjacent half-edge ids
    _addTriangle(i0, i1, i2, a, b, c) {
        const t = this.trianglesLen;

        this._triangles[t] = i0;
        this._triangles[t + 1] = i1;
        this._triangles[t + 2] = i2;

        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);

        this.trianglesLen += 3;

        return t;
    }
}

// monotonically increases with real angle, but doesn't need expensive trigonometry
function pseudoAngle(dx, dy) {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}

function dist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}

// return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
function orientIfSure(px, py, rx, ry, qx, qy) {
    const l = (ry - py) * (qx - px);
    const r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
}

// a more robust orientation test that's stable in a given triangle (to fix robustness issues)
function orient(rx, ry, qx, qy, px, py) {
    const sign = orientIfSure(px, py, rx, ry, qx, qy) ||
    orientIfSure(rx, ry, qx, qy, px, py) ||
    orientIfSure(qx, qy, px, py, rx, ry);
    return sign < 0;
}

function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    const dx = ax - px;
    const dy = ay - py;
    const ex = bx - px;
    const ey = by - py;
    const fx = cx - px;
    const fy = cy - py;

    const ap = dx * dx + dy * dy;
    const bp = ex * ex + ey * ey;
    const cp = fx * fx + fy * fy;

    return dx * (ey * cp - bp * fy) -
           dy * (ex * cp - bp * fx) +
           ap * (ex * fy - ey * fx) < 0;
}

function circumradius(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;

    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);

    const x = (ey * bl - dy * cl) * d;
    const y = (dx * cl - ex * bl) * d;

    return x * x + y * y;
}

function circumcenter(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;

    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);

    const x = ax + (ey * bl - dy * cl) * d;
    const y = ay + (dx * cl - ex * bl) * d;

    return {x, y};
}

function quicksort(ids, dists, left, right) {
    if (right - left <= 20) {
        for (let i = left + 1; i <= right; i++) {
            const temp = ids[i];
            const tempDist = dists[temp];
            let j = i - 1;
            while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];
            ids[j + 1] = temp;
        }
    } else {
        const median = (left + right) >> 1;
        let i = left + 1;
        let j = right;
        swap(ids, median, i);
        if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
        if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
        if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);

        const temp = ids[i];
        const tempDist = dists[temp];
        while (true) {
            do i++; while (dists[ids[i]] < tempDist);
            do j--; while (dists[ids[j]] > tempDist);
            if (j < i) break;
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;

        if (right - i + 1 >= j - left) {
            quicksort(ids, dists, i, right);
            quicksort(ids, dists, left, j - 1);
        } else {
            quicksort(ids, dists, left, j - 1);
            quicksort(ids, dists, i, right);
        }
    }
}

function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultGetX(p) {
    return p[0];
}
function defaultGetY(p) {
    return p[1];
}

const epsilon = 1e-6;

class Path {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  }
  moveTo(x, y) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  }
  lineTo(x, y) {
    this._ += `L${this._x1 = +x},${this._y1 = +y}`;
  }
  arc(x, y, r) {
    x = +x, y = +y, r = +r;
    const x0 = x + r;
    const y0 = y;
    if (r < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._ += "L" + x0 + "," + y0;
    if (!r) return;
    this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
  }
  rect(x, y, w, h) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
  }
  value() {
    return this._ || null;
  }
}

class Polygon {
  constructor() {
    this._ = [];
  }
  moveTo(x, y) {
    this._.push([x, y]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x, y) {
    this._.push([x, y]);
  }
  value() {
    return this._.length ? this._ : null;
  }
}

class Voronoi {
  constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
    this.delaunay = delaunay;
    this._circumcenters = new Float64Array(delaunay.points.length * 2);
    this.vectors = new Float64Array(delaunay.points.length * 2);
    this.xmax = xmax, this.xmin = xmin;
    this.ymax = ymax, this.ymin = ymin;
    this._init();
  }
  update() {
    this.delaunay.update();
    this._init();
    return this;
  }
  _init() {
    const {delaunay: {points, hull, triangles}, vectors} = this;

    // Compute circumcenters.
    const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
    for (let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2) {
      const t1 = triangles[i] * 2;
      const t2 = triangles[i + 1] * 2;
      const t3 = triangles[i + 2] * 2;
      const x1 = points[t1];
      const y1 = points[t1 + 1];
      const x2 = points[t2];
      const y2 = points[t2 + 1];
      const x3 = points[t3];
      const y3 = points[t3 + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const ex = x3 - x1;
      const ey = y3 - y1;
      const bl = dx * dx + dy * dy;
      const cl = ex * ex + ey * ey;
      const ab = (dx * ey - dy * ex) * 2;

      if (!ab) {
        // degenerate case (collinear diagram)
        x = (x1 + x3) / 2 - 1e8 * ey;
        y = (y1 + y3) / 2 + 1e8 * ex;
      }
      else if (Math.abs(ab) < 1e-8) {
        // almost equal points (degenerate triangle)
        x = (x1 + x3) / 2;
        y = (y1 + y3) / 2;
      } else {
        const d = 1 / ab;
        x = x1 + (ey * bl - dy * cl) * d;
        y = y1 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j] = x;
      circumcenters[j + 1] = y;
    }

    // Compute exterior cell rays.
    let h = hull[hull.length - 1];
    let p0, p1 = h * 4;
    let x0, x1 = points[2 * h];
    let y0, y1 = points[2 * h + 1];
    vectors.fill(0);
    for (let i = 0; i < hull.length; ++i) {
      h = hull[i];
      p0 = p1, x0 = x1, y0 = y1;
      p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
      vectors[p0 + 2] = vectors[p1] = y0 - y1;
      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path : undefined;
    const {delaunay: {halfedges, inedges, hull}, circumcenters, vectors} = this;
    if (hull.length <= 1) return null;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j = halfedges[i];
      if (j < i) continue;
      const ti = Math.floor(i / 3) * 2;
      const tj = Math.floor(j / 3) * 2;
      const xi = circumcenters[ti];
      const yi = circumcenters[ti + 1];
      const xj = circumcenters[tj];
      const yj = circumcenters[tj + 1];
      this._renderSegment(xi, yi, xj, yj, context);
    }
    let h0, h1 = hull[hull.length - 1];
    for (let i = 0; i < hull.length; ++i) {
      h0 = h1, h1 = hull[i];
      const t = Math.floor(inedges[h1] / 3) * 2;
      const x = circumcenters[t];
      const y = circumcenters[t + 1];
      const v = h0 * 4;
      const p = this._project(x, y, vectors[v + 2], vectors[v + 3]);
      if (p) this._renderSegment(x, y, p[0], p[1], context);
    }
    return buffer && buffer.value();
  }
  renderBounds(context) {
    const buffer = context == null ? context = new Path : undefined;
    context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    return buffer && buffer.value();
  }
  renderCell(i, context) {
    const buffer = context == null ? context = new Path : undefined;
    const points = this._clip(i);
    if (points === null || !points.length) return;
    context.moveTo(points[0], points[1]);
    let n = points.length;
    while (points[0] === points[n-2] && points[1] === points[n-1] && n > 1) n -= 2;
    for (let i = 2; i < n; i += 2) {
      if (points[i] !== points[i-2] || points[i+1] !== points[i-1])
        context.lineTo(points[i], points[i + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  *cellPolygons() {
    const {delaunay: {points}} = this;
    for (let i = 0, n = points.length / 2; i < n; ++i) {
      const cell = this.cellPolygon(i);
      if (cell) cell.index = i, yield cell;
    }
  }
  cellPolygon(i) {
    const polygon = new Polygon;
    this.renderCell(i, polygon);
    return polygon.value();
  }
  _renderSegment(x0, y0, x1, y1, context) {
    let S;
    const c0 = this._regioncode(x0, y0);
    const c1 = this._regioncode(x1, y1);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
    } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
      context.moveTo(S[0], S[1]);
      context.lineTo(S[2], S[3]);
    }
  }
  contains(i, x, y) {
    if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
    return this.delaunay._step(i, x, y) === i;
  }
  *neighbors(i) {
    const ci = this._clip(i);
    if (ci) for (const j of this.delaunay.neighbors(i)) {
      const cj = this._clip(j);
      // find the common edge
      if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
        for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
          if (ci[ai] == cj[aj]
          && ci[ai + 1] == cj[aj + 1]
          && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj]
          && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]
          ) {
            yield j;
            break loop;
          }
        }
      }
    }
  }
  _cell(i) {
    const {circumcenters, delaunay: {inedges, halfedges, triangles}} = this;
    const e0 = inedges[i];
    if (e0 === -1) return null; // coincident point
    const points = [];
    let e = e0;
    do {
      const t = Math.floor(e / 3);
      points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break; // bad triangulation
      e = halfedges[e];
    } while (e !== e0 && e !== -1);
    return points;
  }
  _clip(i) {
    // degenerate case (1 valid point: return the box)
    if (i === 0 && this.delaunay.hull.length === 1) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    const points = this._cell(i);
    if (points === null) return null;
    const {vectors: V} = this;
    const v = i * 4;
    return V[v] || V[v + 1]
        ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
        : this._clipFinite(i, points);
  }
  _clipFinite(i, points) {
    const n = points.length;
    let P = null;
    let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1;
    for (let j = 0; j < n; j += 2) {
      x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
      c0 = c1, c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P) P.push(x1, y1);
        else P = [x1, y1];
      } else {
        let S, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
          [sx0, sy0, sx1, sy1] = S;
        } else {
          if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
          [sx1, sy1, sx0, sy0] = S;
          e0 = e1, e1 = this._edgecode(sx0, sy0);
          if (e0 && e1) this._edge(i, e0, e1, P, P.length);
          if (P) P.push(sx0, sy0);
          else P = [sx0, sy0];
        }
        e0 = e1, e1 = this._edgecode(sx1, sy1);
        if (e0 && e1) this._edge(i, e0, e1, P, P.length);
        if (P) P.push(sx1, sy1);
        else P = [sx1, sy1];
      }
    }
    if (P) {
      e0 = e1, e1 = this._edgecode(P[0], P[1]);
      if (e0 && e1) this._edge(i, e0, e1, P, P.length);
    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    return P;
  }
  _clipSegment(x0, y0, x1, y1, c0, c1) {
    while (true) {
      if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
      if (c0 & c1) return null;
      let x, y, c = c0 || c1;
      if (c & 0b1000) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
      else if (c & 0b0100) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
      else if (c & 0b0010) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
      else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
      if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
      else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
    }
  }
  _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
    let P = Array.from(points), p;
    if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
    if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
    if (P = this._clipFinite(i, P)) {
      for (let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
        c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
        if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
      }
    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P;
  }
  _edge(i, e0, e1, P, j) {
    while (e0 !== e1) {
      let x, y;
      switch (e0) {
        case 0b0101: e0 = 0b0100; continue; // top-left
        case 0b0100: e0 = 0b0110, x = this.xmax, y = this.ymin; break; // top
        case 0b0110: e0 = 0b0010; continue; // top-right
        case 0b0010: e0 = 0b1010, x = this.xmax, y = this.ymax; break; // right
        case 0b1010: e0 = 0b1000; continue; // bottom-right
        case 0b1000: e0 = 0b1001, x = this.xmin, y = this.ymax; break; // bottom
        case 0b1001: e0 = 0b0001; continue; // bottom-left
        case 0b0001: e0 = 0b0101, x = this.xmin, y = this.ymin; break; // left
      }
      if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
        P.splice(j, 0, x, y), j += 2;
      }
    }
    if (P.length > 4) {
      for (let i = 0; i < P.length; i+= 2) {
        const j = (i + 2) % P.length, k = (i + 4) % P.length;
        if (P[i] === P[j] && P[j] === P[k]
        || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1])
          P.splice(j, 2), i -= 2;
      }
    }
    return j;
  }
  _project(x0, y0, vx, vy) {
    let t = Infinity, c, x, y;
    if (vy < 0) { // top
      if (y0 <= this.ymin) return null;
      if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
    } else if (vy > 0) { // bottom
      if (y0 >= this.ymax) return null;
      if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
    }
    if (vx > 0) { // right
      if (x0 >= this.xmax) return null;
      if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
    } else if (vx < 0) { // left
      if (x0 <= this.xmin) return null;
      if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
    }
    return [x, y];
  }
  _edgecode(x, y) {
    return (x === this.xmin ? 0b0001
        : x === this.xmax ? 0b0010 : 0b0000)
        | (y === this.ymin ? 0b0100
        : y === this.ymax ? 0b1000 : 0b0000);
  }
  _regioncode(x, y) {
    return (x < this.xmin ? 0b0001
        : x > this.xmax ? 0b0010 : 0b0000)
        | (y < this.ymin ? 0b0100
        : y > this.ymax ? 0b1000 : 0b0000);
  }
}

const tau = 2 * Math.PI, pow = Math.pow;

function pointX(p) {
  return p[0];
}

function pointY(p) {
  return p[1];
}

// A triangulation is collinear if all its triangles have a non-null area
function collinear(d) {
  const {triangles, coords} = d;
  for (let i = 0; i < triangles.length; i += 3) {
    const a = 2 * triangles[i],
          b = 2 * triangles[i + 1],
          c = 2 * triangles[i + 2],
          cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1])
                - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
    if (cross > 1e-10) return false;
  }
  return true;
}

function jitter(x, y, r) {
  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
}

class Delaunay {
  static from(points, fx = pointX, fy = pointY, that) {
    return new Delaunay("length" in points
        ? flatArray(points, fx, fy, that)
        : Float64Array.from(flatIterable(points, fx, fy, that)));
  }
  constructor(points) {
    this._delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = this._delaunator.coords;
    this._init();
  }
  update() {
    this._delaunator.update();
    this._init();
    return this;
  }
  _init() {
    const d = this._delaunator, points = this.points;

    // check for collinear
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({length: points.length/2}, (_,i) => i)
        .sort((i, j) => points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]); // for exact neighbors
      const e = this.collinear[0], f = this.collinear[this.collinear.length - 1],
        bounds = [ points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1] ],
        r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i = 0, n = points.length / 2; i < n; ++i) {
        const p = jitter(points[2 * i], points[2 * i + 1], r);
        points[2 * i] = p[0];
        points[2 * i + 1] = p[1];
      }
      this._delaunator = new Delaunator(points);
    } else {
      delete this.collinear;
    }

    const halfedges = this.halfedges = this._delaunator.halfedges;
    const hull = this.hull = this._delaunator.hull;
    const triangles = this.triangles = this._delaunator.triangles;
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);

    // Compute an index from each point to an (arbitrary) incoming halfedge
    // Used to give the first neighbor of each point; for this reason,
    // on the hull we give priority to exterior halfedges
    for (let e = 0, n = halfedges.length; e < n; ++e) {
      const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
      if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
    }
    for (let i = 0, n = hull.length; i < n; ++i) {
      hullIndex[hull[i]] = i;
    }

    // degenerate case: 1 or 2 (distinct) points
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      this.triangles[1] = hull[1];
      this.triangles[2] = hull[1];
      inedges[hull[0]] = 1;
      if (hull.length === 2) inedges[hull[1]] = 0;
    }
  }
  voronoi(bounds) {
    return new Voronoi(this, bounds);
  }
  *neighbors(i) {
    const {inedges, hull, _hullIndex, halfedges, triangles, collinear} = this;

    // degenerate case with several collinear points
    if (collinear) {
      const l = collinear.indexOf(i);
      if (l > 0) yield collinear[l - 1];
      if (l < collinear.length - 1) yield collinear[l + 1];
      return;
    }

    const e0 = inedges[i];
    if (e0 === -1) return; // coincident point
    let e = e0, p0 = -1;
    do {
      yield p0 = triangles[e];
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) return; // bad triangulation
      e = halfedges[e];
      if (e === -1) {
        const p = hull[(_hullIndex[i] + 1) % hull.length];
        if (p !== p0) yield p;
        return;
      }
    } while (e !== e0);
  }
  find(x, y, i = 0) {
    if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
    const i0 = i;
    let c;
    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;
    return c;
  }
  _step(i, x, y) {
    const {inedges, hull, _hullIndex, halfedges, triangles, points} = this;
    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
    let c = i;
    let dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
    const e0 = inedges[i];
    let e = e0;
    do {
      let t = triangles[e];
      const dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
      if (dt < dc) dc = dt, c = t;
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break; // bad triangulation
      e = halfedges[e];
      if (e === -1) {
        e = hull[(_hullIndex[i] + 1) % hull.length];
        if (e !== t) {
          if (pow(x - points[e * 2], 2) + pow(y - points[e * 2 + 1], 2) < dc) return e;
        }
        break;
      }
    } while (e !== e0);
    return c;
  }
  render(context) {
    const buffer = context == null ? context = new Path : undefined;
    const {points, halfedges, triangles} = this;
    for (let i = 0, n = halfedges.length; i < n; ++i) {
      const j = halfedges[i];
      if (j < i) continue;
      const ti = triangles[i] * 2;
      const tj = triangles[j] * 2;
      context.moveTo(points[ti], points[ti + 1]);
      context.lineTo(points[tj], points[tj + 1]);
    }
    this.renderHull(context);
    return buffer && buffer.value();
  }
  renderPoints(context, r = 2) {
    const buffer = context == null ? context = new Path : undefined;
    const {points} = this;
    for (let i = 0, n = points.length; i < n; i += 2) {
      const x = points[i], y = points[i + 1];
      context.moveTo(x + r, y);
      context.arc(x, y, r, 0, tau);
    }
    return buffer && buffer.value();
  }
  renderHull(context) {
    const buffer = context == null ? context = new Path : undefined;
    const {hull, points} = this;
    const h = hull[0] * 2, n = hull.length;
    context.moveTo(points[h], points[h + 1]);
    for (let i = 1; i < n; ++i) {
      const h = 2 * hull[i];
      context.lineTo(points[h], points[h + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  hullPolygon() {
    const polygon = new Polygon;
    this.renderHull(polygon);
    return polygon.value();
  }
  renderTriangle(i, context) {
    const buffer = context == null ? context = new Path : undefined;
    const {points, triangles} = this;
    const t0 = triangles[i *= 3] * 2;
    const t1 = triangles[i + 1] * 2;
    const t2 = triangles[i + 2] * 2;
    context.moveTo(points[t0], points[t0 + 1]);
    context.lineTo(points[t1], points[t1 + 1]);
    context.lineTo(points[t2], points[t2 + 1]);
    context.closePath();
    return buffer && buffer.value();
  }
  *trianglePolygons() {
    const {triangles} = this;
    for (let i = 0, n = triangles.length / 3; i < n; ++i) {
      yield this.trianglePolygon(i);
    }
  }
  trianglePolygon(i) {
    const polygon = new Polygon;
    this.renderTriangle(i, polygon);
    return polygon.value();
  }
}

function flatArray(points, fx, fy, that) {
  const n = points.length;
  const array = new Float64Array(n * 2);
  for (let i = 0; i < n; ++i) {
    const p = points[i];
    array[i * 2] = fx.call(that, p, i, points);
    array[i * 2 + 1] = fy.call(that, p, i, points);
  }
  return array;
}

function* flatIterable(points, fx, fy, that) {
  let i = 0;
  for (const p of points) {
    yield fx.call(that, p, i, points);
    yield fy.call(that, p, i, points);
    ++i;
  }
}

var b=function(n){return "function"==typeof n?n:function(e){return e[n]}},g=function(n){var e=n.points,i=n.x,o=void 0===i?"x":i,t=n.y,r=void 0===t?"y":t,l=b(o),u=b(r);return e.map((function(n){return [l(n),u(n)]}))},k=function(n){var e=n.points,i=n.width,o=n.height,t=n.debug,r=Delaunay.from(e),l=t?r.voronoi([0,0,i,o]):void 0;return {delaunay:r,voronoi:l}},x=function(e){var i=e.points,o=e.x,t=e.y,r=e.width,l=e.height,u=e.debug,a=react.exports.useMemo((function(){return g({points:i,x:o,y:t})}),[i,o,t]);return react.exports.useMemo((function(){return k({points:a,width:r,height:l,debug:u})}),[a,r,l,u])},O=function(e){var i=e.nodes,l=e.width,u=e.height,a=e.x,d=e.y,c=e.onMouseEnter,h=e.onMouseMove,m=e.onMouseLeave,y=e.onClick,b=e.debug,g=react.exports.useRef(null),k=react.exports.useState(null),C=k[0],L=k[1],w=x({points:i,x:a,y:d,width:l,height:u,debug:b}),W=w.delaunay,D=w.voronoi,M=react.exports.useMemo((function(){if(b&&D)return D.render()}),[b,D]),O=react.exports.useCallback((function(n){if(!g.current)return [null,null];var e=Ai(g.current,n),o=e[0],t=e[1],r=W.find(o,t);return [r,void 0!==r?i[r]:null]}),[g,W]),P=react.exports.useCallback((function(n){var e=O(n),i=e[0],o=e[1];L(i),o&&(null==c||c(o,n));}),[O,L,c]),j=react.exports.useCallback((function(n){var e=O(n),i=e[0],o=e[1];L(i),o&&(null==h||h(o,n));}),[O,L,h]),S=react.exports.useCallback((function(n){if(L(null),m){var e=void 0;null!==C&&(e=i[C]),e&&m(e,n);}}),[L,C,m,i]),z=react.exports.useCallback((function(n){var e=O(n),i=e[0],o=e[1];L(i),o&&(null==y||y(o,n));}),[O,L,y]);return jsxRuntime.exports.jsxs("g",{ref:g,children:[b&&D&&jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[jsxRuntime.exports.jsx("path",{d:M,stroke:"red",strokeWidth:1,opacity:.75}),null!==C&&jsxRuntime.exports.jsx("path",{fill:"pink",opacity:.35,d:D.renderCell(C)})]}),jsxRuntime.exports.jsx("rect",{width:l,height:u,fill:"red",opacity:0,style:{cursor:"auto"},onMouseEnter:P,onMouseMove:j,onMouseLeave:S,onClick:z})]})},P=function(n,e){n.save(),n.globalAlpha=.75,n.beginPath(),e.render(n),n.strokeStyle="red",n.lineWidth=1,n.stroke(),n.restore();},j=function(n,e,i){n.save(),n.globalAlpha=.35,n.beginPath(),e.renderCell(i,n),n.fillStyle="red",n.fill(),n.restore();};

function re(){return re=Object.assign?Object.assign.bind():function(e){for(var i=1;i<arguments.length;i++){var r=arguments[i];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);}return e},re.apply(this,arguments)}var ne=function(e){var i=e.point;return jsxRuntime.exports.jsx(w$1,{id:jsxRuntime.exports.jsxs("span",{children:["x: ",jsxRuntime.exports.jsx("strong",{children:i.data.xFormatted}),", y:"," ",jsxRuntime.exports.jsx("strong",{children:i.data.yFormatted})]}),enableChip:!0,color:i.serieColor})};ne.propTypes={point:K$1.object.isRequired};var oe=react.exports.memo(ne),te=function(e){var i=e.slice,r=e.axis,n=Et(),o="x"===r?"y":"x";return jsxRuntime.exports.jsx(C,{rows:i.points.map((function(e){return [jsxRuntime.exports.jsx(g$1,{color:e.serieColor,style:n.tooltip.chip},"chip"),e.serieId,jsxRuntime.exports.jsx("span",{style:n.tooltip.tableCellValue,children:e.data[o+"Formatted"]},"value")]}))})};te.propTypes={slice:K$1.object.isRequired,axis:K$1.oneOf(["x","y"]).isRequired};var ae=react.exports.memo(te),se={data:K$1.arrayOf(K$1.shape({id:K$1.oneOfType([K$1.string,K$1.number]).isRequired,data:K$1.arrayOf(K$1.shape({x:K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]),y:K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)])})).isRequired})).isRequired,xScale:K$1.object.isRequired,xFormat:K$1.oneOfType([K$1.func,K$1.string]),yScale:K$1.object.isRequired,yFormat:K$1.oneOfType([K$1.func,K$1.string]),layers:K$1.arrayOf(K$1.oneOfType([K$1.oneOf(["grid","markers","axes","areas","crosshair","lines","slices","points","mesh","legends"]),K$1.func])).isRequired,curve:bt.isRequired,axisTop:w,axisRight:w,axisBottom:w,axisLeft:w,enableGridX:K$1.bool.isRequired,enableGridY:K$1.bool.isRequired,gridXValues:K$1.oneOfType([K$1.number,K$1.arrayOf(K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]))]),gridYValues:K$1.oneOfType([K$1.number,K$1.arrayOf(K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]))]),enablePoints:K$1.bool.isRequired,pointSymbol:K$1.func,pointSize:K$1.number.isRequired,pointColor:K$1.any.isRequired,pointBorderWidth:K$1.number.isRequired,pointBorderColor:K$1.any.isRequired,enablePointLabel:K$1.bool.isRequired,pointLabel:K$1.oneOfType([K$1.string,K$1.func]).isRequired,markers:K$1.arrayOf(K$1.shape({axis:K$1.oneOf(["x","y"]).isRequired,value:K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]).isRequired,style:K$1.object})),colors:Xe.isRequired,enableArea:K$1.bool.isRequired,areaOpacity:K$1.number.isRequired,areaBlendMode:zt.isRequired,areaBaselineValue:K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]).isRequired,lineWidth:K$1.number.isRequired,legends:K$1.arrayOf(K$1.shape(D)).isRequired,isInteractive:K$1.bool.isRequired,debugMesh:K$1.bool.isRequired,tooltip:K$1.oneOfType([K$1.func,K$1.object]).isRequired,enableSlices:K$1.oneOf(["x","y",!1]).isRequired,debugSlices:K$1.bool.isRequired,sliceTooltip:K$1.oneOfType([K$1.func,K$1.object]).isRequired,enableCrosshair:K$1.bool.isRequired,crosshairType:K$1.string.isRequired},le=re({},se,{enablePointLabel:K$1.bool.isRequired,role:K$1.string.isRequired,useMesh:K$1.bool.isRequired},Jr,yt),ue=re({pixelRatio:K$1.number.isRequired},se),de={curve:"linear",xScale:{type:"point"},yScale:{type:"linear",min:0,max:"auto"},layers:["grid","markers","axes","areas","crosshair","lines","points","slices","mesh","legends"],axisBottom:{},axisLeft:{},enableGridX:!0,enableGridY:!0,enablePoints:!0,pointSize:6,pointColor:{from:"color"},pointBorderWidth:0,pointBorderColor:{theme:"background"},enablePointLabel:!1,pointLabel:"yFormatted",colors:{scheme:"nivo"},enableArea:!1,areaBaselineValue:0,areaOpacity:.2,areaBlendMode:"normal",lineWidth:2,legends:[],isInteractive:!0,tooltip:oe,enableSlices:!1,debugSlices:!1,sliceTooltip:ae,debugMesh:!1,enableCrosshair:!0,crosshairType:"bottom-left"},ce=re({},de,{enablePointLabel:!1,useMesh:!1,animate:!0,motionConfig:"gentle",defs:[],fill:[],role:"img",isFocusable:!1}),pe=re({},de,{pixelRatio:"undefined"!=typeof window&&window.devicePixelRatio||1}),fe=function(e){var r=e.curve;return react.exports.useMemo((function(){return K().defined((function(e){return null!==e.x&&null!==e.y})).x((function(e){return e.x})).y((function(e){return e.y})).curve(mt(r))}),[r])},he=function(e){var r=e.curve,n=e.yScale,o=e.areaBaselineValue;return react.exports.useMemo((function(){return I().defined((function(e){return null!==e.x&&null!==e.y})).x((function(e){return e.x})).y1((function(e){return e.y})).curve(mt(r)).y0(n(o))}),[r,n,o])},be=function(e){var r=e.enableSlices,n=e.points,o=e.width,t=e.height;return react.exports.useMemo((function(){if(!1===r)return [];if("x"===r){var e=new Map;return n.forEach((function(i){null!==i.data.x&&null!==i.data.y&&(e.has(i.x)?e.get(i.x).push(i):e.set(i.x,[i]));})),Array.from(e.entries()).sort((function(e,i){return e[0]-i[0]})).map((function(e,i,r){var n,a=e[0],s=e[1],l=r[i-1],u=r[i+1];return {id:a,x0:n=l?a-(a-l[0])/2:a,x:a,y0:0,y:0,width:u?a-n+(u[0]-a)/2:o-n,height:t,points:s.reverse()}}))}if("y"===r){var i=new Map;return n.forEach((function(e){null!==e.data.x&&null!==e.data.y&&(i.has(e.y)?i.get(e.y).push(e):i.set(e.y,[e]));})),Array.from(i.entries()).sort((function(e,i){return e[0]-i[0]})).map((function(e,i,r){var n,a,s=e[0],l=e[1],u=r[i-1],d=r[i+1];return n=u?s-(s-u[0])/2:s,a=d?s-n+(d[0]-s)/2:t-n,{id:s,x0:0,x:0,y0:n,y:s,width:o,height:a,points:l.reverse()}}))}}),[r,n])},ye=function(e){var o=e.data,t=e.xScale,a=void 0===t?ce.xScale:t,s=e.xFormat,l=e.yScale,d=void 0===l?ce.yScale:l,c=e.yFormat,p=e.width,f=e.height,h=e.colors,y=void 0===h?ce.colors:h,g=e.curve,m=void 0===g?ce.curve:g,v=e.areaBaselineValue,x=void 0===v?ce.areaBaselineValue:v,R=e.pointColor,q=void 0===R?ce.pointColor:R,O=e.pointBorderColor,M=void 0===O?ce.pointBorderColor:O,C=e.enableSlices,S=void 0===C?ce.enableSlicesTooltip:C,B=It(s),T=It(c),k=pr(y,"id"),A=Et(),W=We$1(q,A),D=We$1(M,A),F=react.exports.useState([]),G=F[0],P=F[1],E=react.exports.useMemo((function(){return dn(o.filter((function(e){return -1===G.indexOf(e.id)})),a,d,p,f)}),[o,G,a,d,p,f]),j=E.xScale,V=E.yScale,H=E.series,Y=react.exports.useMemo((function(){var e=o.map((function(e){return {id:e.id,label:e.id,color:k(e)}})),i=e.map((function(e){return re({},H.find((function(i){return i.id===e.id})),{color:e.color})})).filter((function(e){return Boolean(e.id)}));return {legendData:e.map((function(e){return re({},e,{hidden:!i.find((function(i){return i.id===e.id}))})})).reverse(),series:i}}),[o,H,k]),X=Y.legendData,z=Y.series,I=react.exports.useCallback((function(e){P((function(i){return i.indexOf(e)>-1?i.filter((function(i){return i!==e})):[].concat(i,[e])}));}),[]),K=function(e){var r=e.series,n=e.getPointColor,o=e.getPointBorderColor,t=e.formatX,a=e.formatY;return react.exports.useMemo((function(){return r.reduce((function(e,i){return [].concat(e,i.data.filter((function(e){return null!==e.position.x&&null!==e.position.y})).map((function(r,s){var l={id:i.id+"."+s,index:e.length+s,serieId:i.id,serieColor:i.color,x:r.position.x,y:r.position.y};return l.color=n(i),l.borderColor=o(l),l.data=re({},r.data,{xFormatted:t(r.data.x),yFormatted:a(r.data.y)}),l})))}),[])}),[r,n,o,t,a])}({series:z,getPointColor:W,getPointBorderColor:D,formatX:B,formatY:T}),N=be({enableSlices:S,points:K,width:p,height:f});return {legendData:X,toggleSerie:I,lineGenerator:fe({curve:m}),areaGenerator:he({curve:m,yScale:V,areaBaselineValue:x}),getColor:k,series:z,xScale:j,yScale:V,slices:N,points:K}},ge=function(e){var i=e.areaBlendMode,r=e.areaOpacity,n=e.color,o=e.fill,t=e.path,a=Zr(),s=a.animate,l=a.config,u=$r(t),d=useSpring({color:n,config:l,immediate:!s});return jsxRuntime.exports.jsx(animated.path,{d:u,fill:o||d.color,fillOpacity:r,strokeWidth:0,style:{mixBlendMode:i}})};ge.propTypes={areaBlendMode:zt.isRequired,areaOpacity:K$1.number.isRequired,color:K$1.string,fill:K$1.string,path:K$1.string.isRequired};var me=function(e){var i=e.areaGenerator,r=e.areaOpacity,n=e.areaBlendMode,o=e.lines.slice(0).reverse();return jsxRuntime.exports.jsx("g",{children:o.map((function(e){return jsxRuntime.exports.jsx(ge,re({path:i(e.data.map((function(e){return e.position})))},re({areaOpacity:r,areaBlendMode:n},e)),e.id)}))})};me.propTypes={areaGenerator:K$1.func.isRequired,areaOpacity:K$1.number.isRequired,areaBlendMode:zt.isRequired,lines:K$1.arrayOf(K$1.object).isRequired};var ve=react.exports.memo(me),xe=function(e){var r=e.lineGenerator,n=e.points,o=e.color,t=e.thickness,a=react.exports.useMemo((function(){return r(n)}),[r,n]),s=$r(a);return jsxRuntime.exports.jsx(animated.path,{d:s,fill:"none",strokeWidth:t,stroke:o})};xe.propTypes={points:K$1.arrayOf(K$1.shape({x:K$1.oneOfType([K$1.string,K$1.number]),y:K$1.oneOfType([K$1.string,K$1.number])})),lineGenerator:K$1.func.isRequired,color:K$1.string.isRequired,thickness:K$1.number.isRequired};var Re=react.exports.memo(xe),qe=function(e){var i=e.lines,r=e.lineGenerator,n=e.lineWidth;return i.slice(0).reverse().map((function(e){var i=e.id,o=e.data,t=e.color;return jsxRuntime.exports.jsx(Re,{id:i,points:o.map((function(e){return e.position})),lineGenerator:r,color:t,thickness:n},i)}))};qe.propTypes={lines:K$1.arrayOf(K$1.shape({id:K$1.oneOfType([K$1.string,K$1.number]).isRequired,color:K$1.string.isRequired,data:K$1.arrayOf(K$1.shape({data:K$1.shape({x:K$1.oneOfType([K$1.string,K$1.number,K$1.instanceOf(Date)]),y:K$1.oneOfType([K$1.string,K$1.number,K$1.instanceOf(Date)])}).isRequired,position:K$1.shape({x:K$1.number,y:K$1.number}).isRequired})).isRequired})).isRequired,lineWidth:K$1.number.isRequired,lineGenerator:K$1.func.isRequired};var Oe=react.exports.memo(qe),Me=function(e){var i=e.slice,r=e.axis,t=e.debug,a=e.tooltip,s=e.isCurrent,l=e.setCurrent,u=e.onMouseEnter,d=e.onMouseMove,c=e.onMouseLeave,p=e.onClick,f=k$1(),h=f.showTooltipFromEvent,b=f.hideTooltip,y=react.exports.useCallback((function(e){h(react.exports.createElement(a,{slice:i,axis:r}),e,"right"),l(i),u&&u(i,e);}),[h,a,i,u]),g=react.exports.useCallback((function(e){h(react.exports.createElement(a,{slice:i,axis:r}),e,"right"),d&&d(i,e);}),[h,a,i,d]),m=react.exports.useCallback((function(e){b(),l(null),c&&c(i,e);}),[b,i,c]),v=react.exports.useCallback((function(e){p&&p(i,e);}),[i,p]);return jsxRuntime.exports.jsx("rect",{x:i.x0,y:i.y0,width:i.width,height:i.height,stroke:"red",strokeWidth:t?1:0,strokeOpacity:.75,fill:"red",fillOpacity:s&&t?.35:0,onMouseEnter:y,onMouseMove:g,onMouseLeave:m,onClick:v,"data-testid":"slice-"+i.id})};Me.propTypes={slice:K$1.object.isRequired,axis:K$1.oneOf(["x","y"]).isRequired,debug:K$1.bool.isRequired,height:K$1.number.isRequired,tooltip:K$1.oneOfType([K$1.func,K$1.object]),isCurrent:K$1.bool.isRequired,setCurrent:K$1.func.isRequired,onMouseEnter:K$1.func,onMouseMove:K$1.func,onMouseLeave:K$1.func,onClick:K$1.func};var Ce=react.exports.memo(Me),Se=function(e){var i=e.slices,r=e.axis,n=e.debug,o=e.height,t=e.tooltip,a=e.current,s=e.setCurrent,l=e.onMouseEnter,u=e.onMouseMove,d=e.onMouseLeave,c=e.onClick;return i.map((function(e){return jsxRuntime.exports.jsx(Ce,{slice:e,axis:r,debug:n,height:o,tooltip:t,setCurrent:s,isCurrent:null!==a&&a.id===e.id,onMouseEnter:l,onMouseMove:u,onMouseLeave:d,onClick:c},e.id)}))};Se.propTypes={slices:K$1.arrayOf(K$1.shape({id:K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)]).isRequired,x:K$1.number.isRequired,y:K$1.number.isRequired,points:K$1.arrayOf(K$1.object).isRequired})).isRequired,axis:K$1.oneOf(["x","y"]).isRequired,debug:K$1.bool.isRequired,height:K$1.number.isRequired,tooltip:K$1.oneOfType([K$1.func,K$1.object]).isRequired,current:K$1.object,setCurrent:K$1.func.isRequired,onMouseEnter:K$1.func,onMouseMove:K$1.func,onMouseLeave:K$1.func,onClick:K$1.func};var Be=react.exports.memo(Se),Te=function(e){var i=e.points,r=e.symbol,n=e.size,o=e.borderWidth,t=e.enableLabel,a=e.label,s=e.labelYOffset,l=e.isFocusable,d=e.pointAriaLabel,c=e.pointAriaLabelledBy,p=e.pointAriaDescribedBy,f=e.pointAriaHidden,h=e.pointAriaDisabled,b=Et(),y=ji(a),g=i.slice(0).map((function(e){return {id:e.id,x:e.x,y:e.y,datum:e.data,fill:e.color,stroke:e.borderColor,label:t?y(e.data):null,isFocusable:l,pointAriaLabel:d&&d(e),pointAriaLabelledBy:c&&c(e),pointAriaDescribedBy:p&&p(e),pointAriaHidden:f&&f(e),pointAriaDisabled:h&&h(e)}}));return jsxRuntime.exports.jsx("g",{children:g.map((function(e){return jsxRuntime.exports.jsx(Wi,{x:e.x,y:e.y,datum:e.datum,symbol:r,size:n,color:e.fill,borderWidth:o,borderColor:e.stroke,label:e.label,labelYOffset:s,theme:b,isFocusable:l,ariaLabel:e.pointAriaLabel,ariaLabelledBy:e.pointAriaLabelledBy,ariaDescribedBy:e.pointAriaDescribedBy,ariaHidden:e.pointAriaHidden,ariaDisabled:e.pointAriaDisabled},e.id)}))})};Te.propTypes={points:K$1.arrayOf(K$1.object),symbol:K$1.func,size:K$1.number.isRequired,color:K$1.func.isRequired,borderWidth:K$1.number.isRequired,borderColor:K$1.func.isRequired,enableLabel:K$1.bool.isRequired,label:K$1.oneOfType([K$1.string,K$1.func]).isRequired,labelYOffset:K$1.number};var Le=react.exports.memo(Te),we=function(e){var i=e.points,r=e.width,t=e.height,a=e.margin,s=e.setCurrent,l=e.onMouseEnter,u=e.onMouseMove,d=e.onMouseLeave,c=e.onClick,p=e.tooltip,f=e.debug,h=k$1(),b=h.showTooltipAt,y=h.hideTooltip,g=react.exports.useCallback((function(e,i){b(react.exports.createElement(p,{point:e}),[e.x+a.left,e.y+a.top],"top"),s(e),l&&l(e,i);}),[s,b,p,l,a]),m=react.exports.useCallback((function(e,i){b(react.exports.createElement(p,{point:e}),[e.x+a.left,e.y+a.top],"top"),s(e),u&&u(e,i);}),[s,b,p,u]),v=react.exports.useCallback((function(e,i){y(),s(null),d&&d(e,i);}),[y,s,d]),x=react.exports.useCallback((function(e,i){c&&c(e,i);}),[c]);return jsxRuntime.exports.jsx(O,{nodes:i,width:r,height:t,onMouseEnter:g,onMouseMove:m,onMouseLeave:v,onClick:x,debug:f})};we.propTypes={points:K$1.arrayOf(K$1.object).isRequired,width:K$1.number.isRequired,height:K$1.number.isRequired,margin:K$1.object.isRequired,setCurrent:K$1.func.isRequired,onMouseEnter:K$1.func,onMouseMove:K$1.func,onMouseLeave:K$1.func,onClick:K$1.func,tooltip:K$1.oneOfType([K$1.func,K$1.object]).isRequired,debug:K$1.bool.isRequired};var ke=react.exports.memo(we),Ae=function(e){var i=e.data,n=e.xScale,o=e.xFormat,a=e.yScale,s=e.yFormat,l=e.layers,d=e.curve,c=e.areaBaselineValue,p=e.colors,f=e.margin,h=e.width,b=e.height,y=e.axisTop,g=e.axisRight,m=e.axisBottom,v=e.axisLeft,x=e.enableGridX,C=e.enableGridY,S=e.gridXValues,B=e.gridYValues,T=e.lineWidth,L=e.enableArea,k=e.areaOpacity,D=e.areaBlendMode,F=e.enablePoints,G=e.pointSymbol,E=e.pointSize,j=e.pointColor,V=e.pointBorderWidth,H$1=e.pointBorderColor,Y=e.enablePointLabel,z$1=e.pointLabel,I=e.pointLabelYOffset,J=e.defs,K=e.fill,Q=e.markers,U=e.legends,Z=e.isInteractive,$=e.useMesh,_=e.debugMesh,ee=e.onMouseEnter,ie=e.onMouseMove,ne=e.onMouseLeave,oe=e.onClick,te=e.tooltip,ae=e.enableSlices,se=e.debugSlices,le=e.sliceTooltip,ue=e.enableCrosshair,de=e.crosshairType,ce=e.role,pe=e.ariaLabel,fe=e.ariaLabelledBy,he=e.ariaDescribedBy,be=e.isFocusable,ge=e.pointAriaLabel,me=e.pointAriaLabelledBy,xe=e.pointAriaDescribedBy,Re=e.pointAriaHidden,qe=e.pointAriaDisabled,Me=Bt(h,b,f),Ce=Me.margin,Se=Me.innerWidth,Te=Me.innerHeight,we=Me.outerWidth,Ae=Me.outerHeight,We=ye({data:i,xScale:n,xFormat:o,yScale:a,yFormat:s,width:Se,height:Te,colors:p,curve:d,areaBaselineValue:c,pointColor:j,pointBorderColor:H$1,enableSlices:ae}),De=We.legendData,Fe=We.toggleSerie,Ge=We.lineGenerator,Pe=We.areaGenerator,Ee=We.series,je=We.xScale,Ve=We.yScale,He=We.slices,Ye=We.points,Xe=Et(),ze=We$1(j,Xe),Ie=We$1(H$1,Xe),Je=react.exports.useState(null),Ke=Je[0],Ne=Je[1],Qe=react.exports.useState(null),Ue=Qe[0],Ze=Qe[1],$e={grid:jsxRuntime.exports.jsx(z,{theme:Xe,width:Se,height:Te,xScale:x?je:null,yScale:C?Ve:null,xValues:S,yValues:B},"grid"),markers:jsxRuntime.exports.jsx(Ti,{markers:Q,width:Se,height:Te,xScale:je,yScale:Ve,theme:Xe},"markers"),axes:jsxRuntime.exports.jsx(X,{xScale:je,yScale:Ve,width:Se,height:Te,theme:Xe,top:y,right:g,bottom:m,left:v},"axes"),areas:null,lines:jsxRuntime.exports.jsx(Oe,{lines:Ee,lineGenerator:Ge,lineWidth:T},"lines"),slices:null,points:null,crosshair:null,mesh:null,legends:U.map((function(e,i){return jsxRuntime.exports.jsx(H,re({},e,{containerWidth:Se,containerHeight:Te,data:e.data||De,theme:Xe,toggleSerie:e.toggleSerie?Fe:void 0}),"legend."+i)}))},_e=Hi(J,Ee,K);return L&&($e.areas=jsxRuntime.exports.jsx(ve,{areaGenerator:Pe,areaOpacity:k,areaBlendMode:D,lines:Ee},"areas")),Z&&!1!==ae&&($e.slices=jsxRuntime.exports.jsx(Be,{slices:He,axis:ae,debug:se,height:Te,tooltip:le,current:Ue,setCurrent:Ze,onMouseEnter:ee,onMouseMove:ie,onMouseLeave:ne,onClick:oe},"slices")),F&&($e.points=jsxRuntime.exports.jsx(Le,{points:Ye,symbol:G,size:E,color:ze,borderWidth:V,borderColor:Ie,enableLabel:Y,label:z$1,labelYOffset:I,isFocusable:be,pointAriaLabel:ge,pointAriaLabelledBy:me,pointAriaDescribedBy:xe,pointAriaHidden:Re,pointAriaDisabled:qe},"points")),Z&&ue&&(null!==Ke&&($e.crosshair=jsxRuntime.exports.jsx(P$1,{width:Se,height:Te,x:Ke.x,y:Ke.y,type:de},"crosshair")),null!==Ue&&($e.crosshair=jsxRuntime.exports.jsx(P$1,{width:Se,height:Te,x:Ue.x,y:Ue.y,type:ae},"crosshair"))),Z&&$&&!1===ae&&($e.mesh=jsxRuntime.exports.jsx(ke,{points:Ye,width:Se,height:Te,margin:Ce,current:Ke,setCurrent:Ne,onMouseEnter:ee,onMouseMove:ie,onMouseLeave:ne,onClick:oe,tooltip:te,debug:_},"mesh")),jsxRuntime.exports.jsx(_i,{defs:_e,width:we,height:Ae,margin:Ce,role:ce,ariaLabel:pe,ariaLabelledBy:fe,ariaDescribedBy:he,isFocusable:be,children:l.map((function(i,r){return "function"==typeof i?jsxRuntime.exports.jsx(react.exports.Fragment,{children:i(re({},e,{innerWidth:Se,innerHeight:Te,series:Ee,slices:He,points:Ye,xScale:je,yScale:Ve,lineGenerator:Ge,areaGenerator:Pe,currentPoint:Ke,setCurrentPoint:Ne,currentSlice:Ue,setCurrentSlice:Ze}))},r):$e[i]}))})};Ae.propTypes=le,Ae.defaultProps=ce;var We=Mi(Ae),De=function(e){return jsxRuntime.exports.jsx(Jt,{children:function(i){var r=i.width,n=i.height;return jsxRuntime.exports.jsx(We,re({width:r,height:n},e))}})},Fe=function(e){var i=e.width,t=e.height,a=e.margin,d=e.pixelRatio,c=e.data,p=e.xScale,f=e.xFormat,h=e.yScale,b=e.yFormat,y=e.curve,g=e.layers,m=e.colors,v=e.lineWidth,x$1=e.enableArea,q=e.areaBaselineValue,O=e.areaOpacity,M=e.enablePoints,C=e.pointSize,T=e.pointColor,L=e.pointBorderWidth,w=e.pointBorderColor,k=e.enableGridX,A=e.gridXValues,W=e.enableGridY,G=e.gridYValues,P$1=e.axisTop,j$2=e.axisRight,V=e.axisBottom,H=e.axisLeft,X=e.legends,z=e.isInteractive,I=e.debugMesh,J=e.onMouseLeave,K=e.onClick,Q=e.tooltip,U=e.canvasRef,Z=react.exports.useRef(null),$=Bt(i,t,a),ne=$.margin,oe=$.innerWidth,te=$.innerHeight,ae=$.outerWidth,se=$.outerHeight,le=Et(),ue=react.exports.useState(null),de=ue[0],ce=ue[1],pe=ye({data:c,xScale:p,xFormat:f,yScale:h,yFormat:b,width:oe,height:te,colors:m,curve:y,areaBaselineValue:q,pointColor:T,pointBorderColor:w}),fe=pe.lineGenerator,he=pe.areaGenerator,be=pe.series,ge=pe.xScale,me=pe.yScale,ve=pe.points,xe=x({points:ve,width:oe,height:te,debug:I}),Re=xe.delaunay,qe=xe.voronoi;react.exports.useEffect((function(){U&&(U.current=Z.current),Z.current.width=ae*d,Z.current.height=se*d;var e=Z.current.getContext("2d");e.scale(d,d),e.fillStyle=le.background,e.fillRect(0,0,ae,se),e.translate(ne.left,ne.top),g.forEach((function(i){if("function"==typeof i&&i({ctx:e,innerWidth:oe,innerHeight:te,series:be,points:ve,xScale:ge,yScale:me,lineWidth:v,lineGenerator:fe,areaGenerator:he,currentPoint:de,setCurrentPoint:ce}),"grid"===i&&le.grid.line.strokeWidth>0&&(e.lineWidth=le.grid.line.strokeWidth,e.strokeStyle=le.grid.line.stroke,k&&D$1(e,{width:oe,height:te,scale:ge,axis:"x",values:A}),W&&D$1(e,{width:oe,height:te,scale:me,axis:"y",values:G})),"axes"===i&&j$1(e,{xScale:ge,yScale:me,width:oe,height:te,top:P$1,right:j$2,bottom:V,left:H,theme:le}),"areas"===i&&!0===x$1&&(e.save(),e.globalAlpha=O,he.context(e),be.forEach((function(i){e.fillStyle=i.color,e.beginPath(),he(i.data.map((function(e){return e.position}))),e.fill();})),e.restore()),"lines"===i&&(fe.context(e),be.forEach((function(i){e.strokeStyle=i.color,e.lineWidth=v,e.beginPath(),fe(i.data.map((function(e){return e.position}))),e.stroke();}))),"points"===i&&!0===M&&C>0&&ve.forEach((function(i){e.fillStyle=i.color,e.beginPath(),e.arc(i.x,i.y,C/2,0,2*Math.PI),e.fill(),L>0&&(e.strokeStyle=i.borderColor,e.lineWidth=L,e.stroke());})),"mesh"===i&&!0===I&&(P(e,qe),de&&j(e,qe,de.index)),"legends"===i){var r=be.map((function(e){return {id:e.id,label:e.id,color:e.color}})).reverse();X.forEach((function(i){Y(e,re({},i,{data:i.data||r,containerWidth:oe,containerHeight:te,theme:le}));}));}}));}),[Z,ae,se,g,le,fe,be,ge,me,k,A,W,G,P$1,j$2,V,H,X,ve,M,C,de]);var Oe=react.exports.useCallback((function(e){var i=Ai(Z.current,e),r=i[0],n=i[1];if(!Fi(ne.left,ne.top,oe,te,r,n))return null;var o=Re.find(r-ne.left,n-ne.top);return ve[o]}),[Z,ne,oe,te,Re]),Me=k$1(),Ce=Me.showTooltipFromEvent,Se=Me.hideTooltip,Be=react.exports.useCallback((function(e){var i=Oe(e);ce(i),i?Ce(react.exports.createElement(Q,{point:i}),e):Se();}),[Oe,ce,Ce,Se,Q]),Te=react.exports.useCallback((function(e){Se(),ce(null),de&&J&&J(de,e);}),[Se,ce,J]),Le=react.exports.useCallback((function(e){if(K){var i=Oe(e);i&&K(i,e);}}),[Oe,K]);return jsxRuntime.exports.jsx("canvas",{ref:Z,width:ae*d,height:se*d,style:{width:ae,height:se,cursor:z?"auto":"normal"},onMouseEnter:z?Be:void 0,onMouseMove:z?Be:void 0,onMouseLeave:z?Te:void 0,onClick:z?Le:void 0})};Fe.propTypes=ue,Fe.defaultProps=pe;var Ge=Mi(Fe),Pe=react.exports.forwardRef((function(e,i){return jsxRuntime.exports.jsx(Ge,re({},e,{canvasRef:i}))}));react.exports.forwardRef((function(e,i){return jsxRuntime.exports.jsx(Jt,{children:function(r){var n=r.width,o=r.height;return jsxRuntime.exports.jsx(Pe,re({width:n,height:o},e,{ref:i}))}})}));

export { De as D };

