import { aK as halfPi, aL as abs, aM as epsilon, U as tau, aN as cos, aO as sin, aP as sqrt, aQ as min, aR as asin, aS as pi, aT as acos, aU as atan2, aV as max, r as react, G as Gi, E as Et, W as We, a0 as oi, u as useTransition, t as to, j as jsxRuntime, aI as li, Z as Zr, aW as ai, V as ni, a as animated } from './client.js';
import { p as path, K } from './line.js';
import { c as constant } from './constant.js';

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < epsilon) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function y() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau - epsilon) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
          rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon) {
        var p0 = asin(rp / r0 * sin(ap)),
            p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos(a01),
          y01 = r1 * sin(a01),
          x10 = r0 * cos(a10),
          y10 = r0 * sin(a10);

      // Apply rounded corners?
      if (rc > epsilon) {
        var x11 = r1 * cos(a11),
            y11 = r1 * sin(a11),
            x00 = r0 * cos(a00),
            y00 = r0 * sin(a00),
            oc;

        // Restrict the corner radius according to the sector angle.
        if (da < pi && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
          var ax = x01 - oc[0],
              ay = y01 - oc[1],
              bx = x11 - oc[0],
              by = y11 - oc[1],
              kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
              lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = min(rc, (r0 - lc) / (kc - 1));
          rc1 = min(rc, (r1 - lc) / (kc + 1));
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon) || !(da0 > epsilon)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

function b(){return b=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);}return n},b.apply(this,arguments)}var M={pointerEvents:"none"},k=function(t){var e=t.label,r=t.style,i=t.datum,o=Et();return jsxRuntime.exports.jsxs(animated.g,{transform:r.transform,opacity:r.progress,style:M,children:[jsxRuntime.exports.jsx(animated.text,{textAnchor:"middle",dominantBaseline:"central",style:b({},o.labels.text,{fill:r.textColor}),children:e}),jsxRuntime.exports.jsx("foreignObject",{"datum-id":i.id,"datum-value":i.value,"datum-color":i.color,"datum-formatted-value":i.formattedValue,children:jsxRuntime.exports.jsx("div",{})})]})},L=function(n){var t=n%(2*Math.PI);return t<0&&(t+=2*Math.PI),t},C=function(n,t){return n.filter((function(n){return Math.abs(oi(n.arc.endAngle-n.arc.startAngle))>=t}))},B={startAngle:{enter:function(n){return b({},n,{endAngle:n.startAngle})},update:function(n){return n},leave:function(n){return b({},n,{startAngle:n.endAngle})}},middleAngle:{enter:function(n){var t=n.startAngle+(n.endAngle-n.startAngle)/2;return b({},n,{startAngle:t,endAngle:t})},update:function(n){return n},leave:function(n){var t=n.startAngle+(n.endAngle-n.startAngle)/2;return b({},n,{startAngle:t,endAngle:t})}},endAngle:{enter:function(n){return b({},n,{startAngle:n.endAngle})},update:function(n){return n},leave:function(n){return b({},n,{endAngle:n.startAngle})}},innerRadius:{enter:function(n){return b({},n,{outerRadius:n.innerRadius})},update:function(n){return n},leave:function(n){return b({},n,{innerRadius:n.outerRadius})}},centerRadius:{enter:function(n){var t=n.innerRadius+(n.outerRadius-n.innerRadius)/2;return b({},n,{innerRadius:t,outerRadius:t})},update:function(n){return n},leave:function(n){var t=n.innerRadius+(n.outerRadius-n.innerRadius)/2;return b({},n,{innerRadius:t,outerRadius:t})}},outerRadius:{enter:function(n){return b({},n,{innerRadius:n.outerRadius})},update:function(n){return n},leave:function(n){return b({},n,{outerRadius:n.innerRadius})}},pushIn:{enter:function(n){return b({},n,{innerRadius:n.innerRadius-n.outerRadius+n.innerRadius,outerRadius:n.innerRadius})},update:function(n){return n},leave:function(n){return b({},n,{innerRadius:n.outerRadius,outerRadius:n.outerRadius+n.outerRadius-n.innerRadius})}},pushOut:{enter:function(n){return b({},n,{innerRadius:n.outerRadius,outerRadius:n.outerRadius+n.outerRadius-n.innerRadius})},update:function(n){return n},leave:function(n){return b({},n,{innerRadius:n.innerRadius-n.outerRadius+n.innerRadius,outerRadius:n.innerRadius})}}},D=function(n,t){return react.exports.useMemo((function(){var e=B[n];return {enter:function(n){return b({progress:0},e.enter(n.arc),t?t.enter(n):{})},update:function(n){return b({progress:1},e.update(n.arc),t?t.update(n):{})},leave:function(n){return b({progress:0},e.leave(n.arc),t?t.leave(n):{})}}}),[n,t])},I=function(n,t){var e=ai(n)-Math.PI/2,r=n.innerRadius+(n.outerRadius-n.innerRadius)*t;return li(e,r)},E=function(n){return function(e,r,a,i){return to([e,r,a,i],(function(t,e,r,a){var i=I({startAngle:t,endAngle:e,innerRadius:r,outerRadius:a},n);return "translate("+i.x+","+i.y+")"}))}},w=function(n,t,r,a){void 0===t&&(t=.5),void 0===r&&(r="innerRadius");var i=Zr(),o=i.animate,u=i.config,l=D(r,a);return {transition:useTransition(n,{keys:function(n){return n.id},initial:l.update,from:l.enter,enter:l.update,update:l.update,leave:l.leave,config:u,immediate:!o}),interpolate:E(t)}},j=function(n){var t=n.center,e=n.data,r=n.transitionMode,o=n.label,u=n.radiusOffset,l=n.skipAngle,d=n.textColor,c=n.component,f=void 0===c?k:c,g=Gi(o),p=Et(),A=We(d,p),m=react.exports.useMemo((function(){return e.filter((function(n){return Math.abs(oi(n.arc.endAngle-n.arc.startAngle))>=l}))}),[e,l]),y=w(m,u,r),M=y.transition,L=y.interpolate,C=f;return jsxRuntime.exports.jsx("g",{transform:"translate("+t[0]+","+t[1]+")",children:M((function(n,t){return react.exports.createElement(C,{key:t.id,datum:t,label:g(t),style:b({},n,{transform:L(n.startAngle,n.endAngle,n.innerRadius,n.outerRadius),textColor:A(t)})})}))})},S=function(t){var e=t.label,r=t.style,i=Et();return jsxRuntime.exports.jsxs(animated.g,{opacity:r.opacity,children:[jsxRuntime.exports.jsx(animated.path,{fill:"none",stroke:r.linkColor,strokeWidth:r.thickness,d:r.path}),jsxRuntime.exports.jsx(animated.text,{transform:r.textPosition,textAnchor:r.textAnchor,dominantBaseline:"central",style:b({},i.labels.text,{fill:r.textColor}),children:e})]})},U=function(n){var t=L(n.startAngle+(n.endAngle-n.startAngle)/2-Math.PI/2);return t<Math.PI/2||t>1.5*Math.PI?"start":"end"},H=function(n,t,e,r){var a,i,u=L(n.startAngle+(n.endAngle-n.startAngle)/2-Math.PI/2),l=li(u,n.outerRadius+t),d=li(u,n.outerRadius+t+e);return u<Math.PI/2||u>1.5*Math.PI?(a="after",i={x:d.x+r,y:d.y}):(a="before",i={x:d.x-r,y:d.y}),{side:a,points:[l,d,i]}},z=K().x((function(n){return n.x})).y((function(n){return n.y})),V=function(n,e,r,a,i,o,u){return to([n,e,r,a,i,o,u],(function(n,t,e,r,a,i,o){var u=H({startAngle:n,endAngle:t,innerRadius:e,outerRadius:r},a,i,o).points;return z(u)}))},G=function(n,e,r,a){return to([n,e,r,a],(function(n,t,e,r){return U({startAngle:n,endAngle:t,innerRadius:e,outerRadius:r})}))},q=function(n,e,r,a,i,o,u,l){return to([n,e,r,a,i,o,u,l],(function(n,t,e,r,a,i,o,u){var l=H({startAngle:n,endAngle:t,innerRadius:e,outerRadius:r},a,i,o),d=l.points,s=l.side,c=d[2];return "before"===s?c.x-=u:c.x+=u,"translate("+c.x+","+c.y+")"}))},J=function(n){var t=n.data,r=n.offset,i=void 0===r?0:r,o=n.diagonalLength,u=n.straightLength,l=n.skipAngle,s=void 0===l?0:l,c=n.textOffset,f=n.linkColor,g=n.textColor,p=Zr(),v=p.animate,x=p.config,A=Et(),m=We(f,A),y=We(g,A),b=function(n,t){return react.exports.useMemo((function(){return C(n,t)}),[n,t])}(t,s),M=function(n){var t=n.offset,e=n.diagonalLength,r=n.straightLength,a=n.textOffset,i=n.getLinkColor,o=n.getTextColor;return react.exports.useMemo((function(){return {enter:function(n){return {startAngle:n.arc.startAngle,endAngle:n.arc.endAngle,innerRadius:n.arc.innerRadius,outerRadius:n.arc.outerRadius,offset:t,diagonalLength:0,straightLength:0,textOffset:a,linkColor:i(n),textColor:o(n),opacity:0}},update:function(n){return {startAngle:n.arc.startAngle,endAngle:n.arc.endAngle,innerRadius:n.arc.innerRadius,outerRadius:n.arc.outerRadius,offset:t,diagonalLength:e,straightLength:r,textOffset:a,linkColor:i(n),textColor:o(n),opacity:1}},leave:function(n){return {startAngle:n.arc.startAngle,endAngle:n.arc.endAngle,innerRadius:n.arc.innerRadius,outerRadius:n.arc.outerRadius,offset:t,diagonalLength:0,straightLength:0,textOffset:a,linkColor:i(n),textColor:o(n),opacity:0}}}}),[e,r,a,i,o,t])}({offset:i,diagonalLength:o,straightLength:u,textOffset:c,getLinkColor:m,getTextColor:y});return {transition:useTransition(b,{keys:function(n){return n.id},initial:M.update,from:M.enter,enter:M.update,update:M.update,leave:M.leave,config:x,immediate:!v}),interpolateLink:V,interpolateTextAnchor:G,interpolateTextPosition:q}},N=function(n){var t=n.center,e=n.data,r=n.label,a=n.skipAngle,i=n.offset,o=n.diagonalLength,u=n.straightLength,l=n.strokeWidth,d=n.textOffset,c=n.textColor,f=n.linkColor,g=n.component,p=void 0===g?S:g,h=Gi(r),A=J({data:e,skipAngle:a,offset:i,diagonalLength:o,straightLength:u,textOffset:d,linkColor:f,textColor:c}),R=A.transition,m=A.interpolateLink,y=A.interpolateTextAnchor,M=A.interpolateTextPosition,k=p;return jsxRuntime.exports.jsx("g",{transform:"translate("+t[0]+","+t[1]+")",children:R((function(n,t){return react.exports.createElement(k,{key:t.id,datum:t,label:h(t),style:b({},n,{thickness:l,path:m(n.startAngle,n.endAngle,n.innerRadius,n.outerRadius,n.offset,n.diagonalLength,n.straightLength),textAnchor:y(n.startAngle,n.endAngle,n.innerRadius,n.outerRadius),textPosition:M(n.startAngle,n.endAngle,n.innerRadius,n.outerRadius,n.offset,n.diagonalLength,n.straightLength,n.textOffset)})})}))})},nn=function(t){var e=t.datum,r=t.style,a=t.onClick,i=t.onMouseDown,o=t.onMouseEnter,u=t.onMouseMove,l=t.onMouseLeave,d=t.onFocus,s=t.onBlur,c=t.onKeyDown,f=t.onKeyUp,g=t.tabIndex,p=t.ariaLabel,h=t.ariaLabelledBy,x=t.ariaDescribedBy,R=t.ariaDisabled,m=t.ariaHidden,y=react.exports.useCallback((function(n){return null==a?void 0:a(e,n)}),[a,e]),b=react.exports.useCallback((function(n){return null==i?void 0:i(e,n)}),[i,e]),M=react.exports.useCallback((function(n){return null==o?void 0:o(e,n)}),[o,e]),k=react.exports.useCallback((function(n){return null==u?void 0:u(e,n)}),[u,e]),L=react.exports.useCallback((function(n){return null==l?void 0:l(e,n)}),[l,e]),C=react.exports.useCallback((function(n){return null==d?void 0:d(e,n)}),[d,e]),O=react.exports.useCallback((function(n){return null==s?void 0:s(e,n)}),[s,e]),P=react.exports.useCallback((function(n){return null==c?void 0:c(e,n)}),[c,e]),B=react.exports.useCallback((function(n){return null==f?void 0:f(e,n)}),[f,e]);return jsxRuntime.exports.jsx(animated.path,{d:r.path,opacity:r.opacity,fill:e.fill||r.color,stroke:r.borderColor,strokeWidth:r.borderWidth,onClick:a?y:void 0,onMouseDown:i?b:void 0,onMouseEnter:o?M:void 0,onMouseMove:u?k:void 0,onMouseLeave:l?L:void 0,onFocus:d?C:void 0,onBlur:s?O:void 0,onKeyDown:c?P:void 0,onKeyUp:f?B:void 0,tabIndex:g,"datum-id":e.id,"datum-value":e.value,"datum-color":e.color,"datum-formatted-value":e.formattedValue,"aria-label":p,"aria-labelledby":h,"aria-describedby":x,"aria-disabled":R,"aria-hidden":m})},tn=function(n,e,r,a,i){return to([n,e,r,a],(function(n,t,e,r){return i({startAngle:n,endAngle:t,innerRadius:Math.max(0,e),outerRadius:Math.max(0,r)})}))},en=function(n,t,r){void 0===t&&(t="innerRadius");var a=Zr(),i=a.animate,o=a.config,u=D(t,r);return {transition:useTransition(n,{keys:function(n){return n.id},initial:u.update,from:u.enter,enter:u.update,update:u.update,leave:u.leave,config:o,immediate:!i}),interpolate:tn}},rn=function(n){var t=n.center,e=n.data,r=n.arcGenerator,i=n.borderWidth,o=n.borderColor,u=n.onClick,l=n.onMouseDown,d=n.onMouseEnter,s=n.onMouseMove,c=n.onMouseLeave,f=n.onFocus,g=n.onBlur,p=n.onKeyDown,h=n.onKeyUp,A=n.ariaLabel,m=n.ariaLabelledBy,y=n.ariaDescribedBy,M=n.ariaDisabled,k=n.ariaHidden,L=n.transitionMode,C=n.isFocusable,O=void 0===C||C,P=n.component,B=void 0===P?nn:P,D=Et(),I=We(o,D),E=en(e,L,{enter:function(n){return {opacity:0,color:n.color,borderColor:I(n)}},update:function(n){return {opacity:1,color:n.color,borderColor:I(n)}},leave:function(n){return {opacity:0,color:n.color,borderColor:I(n)}}}),w=E.transition,T=E.interpolate,j=B;return jsxRuntime.exports.jsx("g",{transform:"translate("+t[0]+","+t[1]+")",children:w((function(n,t){return react.exports.createElement(j,{key:t.id,datum:t,style:b({},n,{borderWidth:i,path:T(n.startAngle,n.endAngle,n.innerRadius,n.outerRadius,r)}),tabIndex:O?0:void 0,onClick:u,onMouseDown:l,onMouseEnter:d,onMouseMove:s,onMouseLeave:c,onFocus:f,onBlur:g,onKeyDown:p,onKeyUp:h,ariaLabel:null==A?void 0:A(t),ariaLabelledBy:null==m?void 0:m(t),ariaDescribedBy:null==y?void 0:y(t),ariaDisabled:null==M?void 0:M(t),ariaHidden:null==k?void 0:k(t)})}))})},an=function(n,t,e,r,a,i){void 0===i&&(i=!0);var l=[],d=li(ni(r),e);l.push([d.x,d.y]);var s=li(ni(a),e);l.push([s.x,s.y]);for(var c=Math.round(Math.min(r,a));c<=Math.round(Math.max(r,a));c++)if(c%90==0){var f=li(ni(c),e);l.push([f.x,f.y]);}l=l.map((function(e){var r=e[0],a=e[1];return [n+r,t+a]})),i&&l.push([n,t]);var g=l.map((function(n){return n[0]})),p=l.map((function(n){return n[1]})),v=Math.min.apply(Math,g),h=Math.max.apply(Math,g),x=Math.min.apply(Math,p);return {points:l,x:v,y:x,width:h-v,height:Math.max.apply(Math,p)-x}},dn=function(n){var t=void 0===n?{}:n,e=t.cornerRadius,r=void 0===e?0:e,a=t.padAngle,i=void 0===a?0:a;return react.exports.useMemo((function(){return y().innerRadius((function(n){return n.innerRadius})).outerRadius((function(n){return n.outerRadius})).cornerRadius(r).padAngle(i)}),[r,i])};

export { N, an as a, dn as d, j, rn as r };

