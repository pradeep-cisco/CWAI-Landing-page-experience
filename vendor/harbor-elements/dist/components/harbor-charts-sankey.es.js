import { j as jsxRuntime, J as Jt, e as Ht, B as Bt, r as react, H, _ as _i, w, N as g, E as Et, p as pr, W as We, G as Gi, I as It, a4 as monotoneX, a5 as monotoneY, Z as Zr, a6 as useSprings, a as animated, b as useSpring, k, $ as $r } from './client.js';
import { u as uniq_1 } from './uniq.js';
import { c as cloneDeep_1 } from './cloneDeep.js';
import { K } from './line.js';

function max(values, valueof) {
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  }
  return max;
}

function min(values, valueof) {
  let min;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  }
  return min;
}

function sum(values, valueof) {
  let sum = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value = +value) {
        sum += value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if (value = +valueof(value, ++index, values)) {
        sum += value;
      }
    }
  }
  return sum;
}

function targetDepth(d) {
  return d.target.depth;
}

function left(node) {
  return node.depth;
}

function right(node, n) {
  return n - 1 - node.height;
}

function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

function center(node) {
  return node.targetLinks.length ? node.depth
      : node.sourceLinks.length ? min(node.sourceLinks, targetDepth) - 1
      : 0;
}

function constant(x) {
  return function() {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function defaultId(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  const node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

function computeLinkBreadths({nodes}) {
  for (const node of nodes) {
    let y0 = node.y0;
    let y1 = y0;
    for (const link of node.sourceLinks) {
      link.y0 = y0 + link.width / 2;
      y0 += link.width;
    }
    for (const link of node.targetLinks) {
      link.y1 = y1 + link.width / 2;
      y1 += link.width;
    }
  }
}

function Sankey() {
  let x0 = 0, y0 = 0, x1 = 1, y1 = 1; // extent
  let dx = 24; // nodeWidth
  let dy = 8, py; // nodePadding
  let id = defaultId;
  let align = justify;
  let sort;
  let linkSort;
  let nodes = defaultNodes;
  let links = defaultLinks;
  let iterations = 6;

  function sankey() {
    const graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant(_), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
  };

  sankey.nodeSort = function(_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? (dy = py = +_, sankey) : dy;
  };

  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant(_), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant(_), sankey) : links;
  };

  sankey.linkSort = function(_) {
    return arguments.length ? (linkSort = _, sankey) : linkSort;
  };

  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  function computeNodeLinks({nodes, links}) {
    for (const [i, node] of nodes.entries()) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    }
    const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
    for (const [i, link] of links.entries()) {
      link.index = i;
      let {source, target} = link;
      if (typeof source !== "object") source = link.source = find(nodeById, source);
      if (typeof target !== "object") target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }
    if (linkSort != null) {
      for (const {sourceLinks, targetLinks} of nodes) {
        sourceLinks.sort(linkSort);
        targetLinks.sort(linkSort);
      }
    }
  }

  function computeNodeValues({nodes}) {
    for (const node of nodes) {
      node.value = node.fixedValue === undefined
          ? Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value))
          : node.fixedValue;
    }
  }

  function computeNodeDepths({nodes}) {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set;
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.depth = x;
        for (const {target} of node.sourceLinks) {
          next.add(target);
        }
      }
      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set;
    }
  }

  function computeNodeHeights({nodes}) {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set;
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.height = x;
        for (const {source} of node.targetLinks) {
          next.add(source);
        }
      }
      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set;
    }
  }

  function computeNodeLayers({nodes}) {
    const x = max(nodes, d => d.depth) + 1;
    const kx = (x1 - x0 - dx) / (x - 1);
    const columns = new Array(x);
    for (const node of nodes) {
      const i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
      node.layer = i;
      node.x0 = x0 + i * kx;
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort) for (const column of columns) {
      column.sort(sort);
    }
    return columns;
  }

  function initializeNodeBreadths(columns) {
    const ky = min(columns, c => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
    for (const nodes of columns) {
      let y = y0;
      for (const node of nodes) {
        node.y0 = y;
        node.y1 = y + node.value * ky;
        y = node.y1 + py;
        for (const link of node.sourceLinks) {
          link.width = link.value * ky;
        }
      }
      y = (y1 - y + py) / (nodes.length + 1);
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        node.y0 += y * (i + 1);
        node.y1 += y * (i + 1);
      }
      reorderLinks(nodes);
    }
  }

  function computeNodeBreadths(graph) {
    const columns = computeNodeLayers(graph);
    py = Math.min(dy, (y1 - y0) / (max(columns, c => c.length) - 1));
    initializeNodeBreadths(columns);
    for (let i = 0; i < iterations; ++i) {
      const alpha = Math.pow(0.99, i);
      const beta = Math.max(1 - alpha, (i + 1) / iterations);
      relaxRightToLeft(columns, alpha, beta);
      relaxLeftToRight(columns, alpha, beta);
    }
  }

  // Reposition each node based on its incoming (target) links.
  function relaxLeftToRight(columns, alpha, beta) {
    for (let i = 1, n = columns.length; i < n; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y = 0;
        let w = 0;
        for (const {source, value} of target.targetLinks) {
          let v = value * (target.layer - source.layer);
          y += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - target.y0) * alpha;
        target.y0 += dy;
        target.y1 += dy;
        reorderNodeLinks(target);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  // Reposition each node based on its outgoing (source) links.
  function relaxRightToLeft(columns, alpha, beta) {
    for (let n = columns.length, i = n - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y = 0;
        let w = 0;
        for (const {target, value} of source.sourceLinks) {
          let v = value * (target.layer - source.layer);
          y += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - source.y0) * alpha;
        source.y0 += dy;
        source.y1 += dy;
        reorderNodeLinks(source);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  function resolveCollisions(nodes, alpha) {
    const i = nodes.length >> 1;
    const subject = nodes[i];
    resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
  }

  // Push any overlapping nodes down.
  function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
    for (; i < nodes.length; ++i) {
      const node = nodes[i];
      const dy = (y - node.y0) * alpha;
      if (dy > 1e-6) node.y0 += dy, node.y1 += dy;
      y = node.y1 + py;
    }
  }

  // Push any overlapping nodes up.
  function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
    for (; i >= 0; --i) {
      const node = nodes[i];
      const dy = (node.y1 - y) * alpha;
      if (dy > 1e-6) node.y0 -= dy, node.y1 -= dy;
      y = node.y0 - py;
    }
  }

  function reorderNodeLinks({sourceLinks, targetLinks}) {
    if (linkSort === undefined) {
      for (const {source: {sourceLinks}} of targetLinks) {
        sourceLinks.sort(ascendingTargetBreadth);
      }
      for (const {target: {targetLinks}} of sourceLinks) {
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  function reorderLinks(nodes) {
    if (linkSort === undefined) {
      for (const {sourceLinks, targetLinks} of nodes) {
        sourceLinks.sort(ascendingTargetBreadth);
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  // Returns the target.y0 that would produce an ideal link from source to target.
  function targetTop(source, target) {
    let y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  }

  // Returns the source.y0 that would produce an ideal link from source to target.
  function sourceTop(source, target) {
    let y = target.y0 - (target.targetLinks.length - 1) * py / 2;
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  }

  return sankey;
}

function W(){return W=Object.assign?Object.assign.bind():function(e){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},W.apply(this,arguments)}var A={container:{display:"flex",alignItems:"center"},sourceChip:{marginRight:7},targetChip:{marginLeft:7,marginRight:7}},N={center:center,justify:justify,start:left,end:right},R=function(e){return N[e]},S={layout:"horizontal",align:"center",sort:"auto",colors:{scheme:"nivo"},nodeOpacity:.75,nodeHoverOpacity:1,nodeHoverOthersOpacity:.15,nodeThickness:12,nodeSpacing:12,nodeInnerPadding:0,nodeBorderWidth:1,nodeBorderColor:{from:"color",modifiers:[["darker",.5]]},nodeBorderRadius:0,linkOpacity:.25,linkHoverOpacity:.6,linkHoverOthersOpacity:.15,linkContract:0,linkBlendMode:"multiply",enableLinkGradient:!1,enableLabels:!0,label:"id",labelPosition:"inside",labelPadding:9,labelOrientation:"horizontal",labelTextColor:{from:"color",modifiers:[["darker",.8]]},isInteractive:!0,isFocusable:!0,nodeTooltip:function(e){var o=e.node;return jsxRuntime.exports.jsx(w,{id:o.label,enableChip:!0,color:o.color})},linkTooltip:function(e){var o=e.link;return jsxRuntime.exports.jsx(w,{id:jsxRuntime.exports.jsxs("span",{style:A.container,children:[jsxRuntime.exports.jsx(g,{color:o.source.color,style:A.sourceChip}),jsxRuntime.exports.jsx("strong",{children:o.source.label})," > ",jsxRuntime.exports.jsx("strong",{children:o.target.label}),jsxRuntime.exports.jsx(g,{color:o.target.color,style:A.targetChip}),jsxRuntime.exports.jsx("strong",{children:o.formattedValue})]})})},legends:[],layers:["links","nodes","labels","legends"],role:"img",animate:!0,motionConfig:"gentle"},z=function(e){return e.id},G=function(n){var i=n.data,r=n.valueFormat,t=n.layout,s=n.width,c=n.height,u=n.sort,v=n.align,h=n.colors,y=n.nodeThickness,b=n.nodeSpacing,p=n.nodeInnerPadding,f=n.nodeBorderColor,g=n.label,k=n.labelTextColor,x=react.exports.useState(null),C=x[0],M=x[1],L=react.exports.useState(null),B=L[0],O=L[1],H=react.exports.useMemo((function(){if("auto"!==u)return "input"===u?null:"ascending"===u?function(e,o){return e.value-o.value}:"descending"===u?function(e,o){return o.value-e.value}:u}),[u]),I="input"===u?null:void 0,T=react.exports.useMemo((function(){return "function"==typeof v?v:R(v)}),[v]),K=Et(),P=pr(h,"id"),E=We(f,K),W=Gi(g),A=We(k,K),N=It(r),U=react.exports.useMemo((function(){return function(e){var o=e.data,n=e.formatValue,i=e.layout,r=e.alignFunction,t=e.sortFunction,a=e.linkSortMode,l=e.nodeThickness,d=e.nodeSpacing,s=e.nodeInnerPadding,c=e.width,u=e.height,v=e.getColor,h=e.getLabel,y=Sankey().nodeAlign(r).nodeSort(t).linkSort(a).nodeWidth(l).nodePadding(d).size("horizontal"===i?[c,u]:[u,c]).nodeId(z),b=cloneDeep_1(o);return y(b),b.nodes.forEach((function(e){if(e.color=v(e),e.label=h(e),e.formattedValue=n(e.value),"horizontal"===i)e.x=e.x0+s,e.y=e.y0,e.width=Math.max(e.x1-e.x0-2*s,0),e.height=Math.max(e.y1-e.y0,0);else {e.x=e.y0,e.y=e.x0+s,e.width=Math.max(e.y1-e.y0,0),e.height=Math.max(e.x1-e.x0-2*s,0);var o=e.x0,r=e.x1;e.x0=e.y0,e.x1=e.y1,e.y0=o,e.y1=r;}})),b.links.forEach((function(e){e.formattedValue=n(e.value),e.color=e.source.color,e.pos0=e.y0,e.pos1=e.y1,e.thickness=e.width,delete e.y0,delete e.y1,delete e.width;})),b}({data:i,formatValue:N,layout:t,alignFunction:T,sortFunction:H,linkSortMode:I,nodeThickness:y,nodeSpacing:b,nodeInnerPadding:p,width:s,height:c,getColor:P,getLabel:W})}),[i,N,t,T,H,I,y,b,p,s,c,P,W]),S=U.nodes,G=U.links,j=react.exports.useMemo((function(){return S.map((function(e){return {id:e.id,label:e.label,color:e.color}}))}),[S]);return {nodes:S,links:G,legendData:j,getNodeBorderColor:E,currentNode:C,setCurrentNode:M,currentLink:B,setCurrentLink:O,getLabelTextColor:A}},j=function(e){var o=e.node,r=e.x,t=e.y,a=e.width,l=e.height,d=e.color,c=e.opacity,u=e.borderWidth,v=e.borderColor,h=e.borderRadius,y=e.setCurrent,b=e.isInteractive,p=e.isFocusable,f=e.onClick,g=e.onKeyDown,k$1=e.onKeyUp,m=e.onFocus,x=e.onBlur,C=e.onMouseEnter,B=e.onMouseMove,O=e.onMouseLeave,F=e.ariaLabel,w=e.ariaLabelledBy,D=e.ariaDescribedBy,T=e.ariaDisabled,K=e.ariaHidden,P=e.tooltip,E=Zr(),W=E.animate,A=E.config,N=useSpring({x:r,y:t,width:a,height:l,opacity:c,color:d,config:A,immediate:!W}),U=k(),R=U.showTooltipFromEvent,S=U.hideTooltip,z=react.exports.useCallback((function(e){y(o),R(react.exports.createElement(P,{node:o}),e,"left"),null==C||C(o,e);}),[y,o,R,P,C]),G=react.exports.useCallback((function(e){R(react.exports.createElement(P,{node:o}),e,"left"),null==B||B(o,e);}),[R,P,o,B]),j=react.exports.useCallback((function(e){y(null),S(),null==O||O(o,e);}),[y,S,o,O]),V=react.exports.useCallback((function(e){null==f||f(o,e);}),[f,o]),Z=react.exports.useCallback((function(e){null==g||g(o,e);}),[g,o]),q=react.exports.useCallback((function(e){null==k$1||k$1(o,e);}),[k$1,o]),J=react.exports.useCallback((function(e){null==m||m(o,e);}),[m,o]),Q=react.exports.useCallback((function(e){null==x||x(o,e);}),[x,o]);return jsxRuntime.exports.jsx(animated.rect,{x:N.x,y:N.y,rx:h,ry:h,width:N.width.to((function(e){return Math.max(e,0)})),height:N.height.to((function(e){return Math.max(e,0)})),fill:N.color,fillOpacity:N.opacity,strokeWidth:u,stroke:v,strokeOpacity:c,onMouseEnter:b?z:void 0,onMouseMove:b?G:void 0,onMouseLeave:b?j:void 0,onClick:b?V:void 0,onKeyDown:b&&p?Z:void 0,onKeyUp:b&&p?q:void 0,onFocus:b&&p?J:void 0,onBlur:b&&p?Q:void 0,tabIndex:p?0:void 0,"aria-label":null==F?void 0:F(o),"aria-labelledby":null==w?void 0:w(o),"aria-describedby":null==D?void 0:D(o),"aria-disabled":null==T?void 0:T(o),"aria-hidden":null==K?void 0:K(o)})},V=function(e){var o=e.nodes,n=e.nodeOpacity,i=e.nodeHoverOpacity,r=e.nodeHoverOthersOpacity,t=e.borderWidth,a=e.getBorderColor,l=e.borderRadius,d=e.setCurrentNode,s=e.currentNode,c=e.currentLink,u=e.isCurrentNode,v=e.isInteractive,h=e.isFocusable,y=e.onClick,b=e.onKeyDown,p=e.onKeyUp,f=e.onFocus,g=e.onBlur,k=e.onMouseEnter,m=e.onMouseMove,x=e.onMouseLeave,C=e.ariaLabel,M=e.ariaLabelledBy,B=e.ariaDescribedBy,F=e.ariaDisabled,w=e.ariaHidden,D=e.tooltip,H=function(e){return s||c?u(e)?i:r:n};return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:o.map((function(e){return jsxRuntime.exports.jsx(j,{node:e,x:e.x,y:e.y,width:e.width,height:e.height,color:e.color,opacity:H(e),borderWidth:t,borderColor:a(e),borderRadius:l,setCurrent:d,isInteractive:v,isFocusable:h,onClick:y,onMouseEnter:k,onMouseMove:m,onMouseLeave:x,onKeyDown:b,onKeyUp:p,onFocus:f,onBlur:g,ariaDescribedBy:B,ariaLabel:C,ariaLabelledBy:M,ariaDisabled:F,ariaHidden:w,tooltip:D},e.id)}))})},Z=function(e){var o=e.id,n=e.layout,i=e.startColor,r=e.endColor;return jsxRuntime.exports.jsxs("linearGradient",W({id:o,spreadMethod:"pad"},"horizontal"===n?{x1:"0%",x2:"100%",y1:"0%",y2:"0%"}:{x1:"0%",x2:"0%",y1:"0%",y2:"100%"},{children:[jsxRuntime.exports.jsx("stop",{offset:"0%",stopColor:i}),jsxRuntime.exports.jsx("stop",{offset:"100%",stopColor:r})]}))},q=function(e){var o=e.link,r=e.layout,t=e.path,a=e.color,l=e.opacity,d=e.blendMode,u=e.enableGradient,v=e.setCurrent,h=e.tooltip,y=e.isInteractive,b=e.isFocusable,p=e.onClick,f=e.onKeyDown,g=e.onKeyUp,k$1=e.onFocus,m=e.onBlur,x=e.onMouseEnter,C=e.onMouseMove,F=e.onMouseLeave,w=e.ariaLabel,D=e.ariaLabelledBy,T=e.ariaDescribedBy,K=e.ariaDisabled,P=e.ariaHidden,E=o.source.id+"."+o.target.id+"."+o.index,W=Zr(),A=W.animate,N=W.config,U=$r(t),R=useSpring({color:a,opacity:l,config:N,immediate:!A}),S=k(),z=S.showTooltipFromEvent,G=S.hideTooltip,j=react.exports.useCallback((function(e){v(o),z(react.exports.createElement(h,{link:o}),e,"left"),null==x||x(o,e);}),[v,o,z,h,x]),V=react.exports.useCallback((function(e){z(react.exports.createElement(h,{link:o}),e,"left"),null==C||C(o,e);}),[z,h,o,C]),q=react.exports.useCallback((function(e){v(null),G(),null==F||F(o,e);}),[v,G,o,F]),J=react.exports.useCallback((function(e){null==p||p(o,e);}),[p,o]),Q=react.exports.useCallback((function(e){null==f||f(o,e);}),[f,o]),X=react.exports.useCallback((function(e){null==g||g(o,e);}),[g,o]),Y=react.exports.useCallback((function(e){null==k$1||k$1(o,e);}),[k$1,o]),$=react.exports.useCallback((function(e){null==m||m(o,e);}),[m,o]);return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[u&&jsxRuntime.exports.jsx(Z,{id:E,layout:r,startColor:o.startColor||o.source.color,endColor:o.endColor||o.target.color}),jsxRuntime.exports.jsx(animated.path,{fill:u?'url("#'+encodeURI(E)+'")':R.color,d:U,fillOpacity:R.opacity,onMouseEnter:y?j:void 0,onMouseMove:y?V:void 0,onMouseLeave:y?q:void 0,onKeyDown:y&&b?Q:void 0,onKeyUp:y&&b?X:void 0,onFocus:y&&b?Y:void 0,onBlur:y&&b?$:void 0,onClick:y?J:void 0,style:{mixBlendMode:d},tabIndex:b?0:void 0,"aria-label":null==w?void 0:w(o),"aria-labelledby":null==D?void 0:D(o),"aria-describedby":null==T?void 0:T(o),"aria-disabled":null==K?void 0:K(o),"aria-hidden":null==P?void 0:P(o)})]})},J=function(e){var n=e.links,i=e.layout,r=e.linkOpacity,t=e.linkHoverOpacity,a=e.linkHoverOthersOpacity,l=e.linkContract,d=e.linkBlendMode,s=e.enableLinkGradient,c=e.setCurrentLink,u=e.currentLink,v=e.currentNode,h=e.isCurrentLink,y=e.isInteractive,b=e.isFocusable,p=e.onClick,f=e.onKeyDown,g=e.onKeyUp,k=e.onMouseEnter,m=e.onMouseMove,x=e.onMouseLeave,C=e.onFocus,M=e.onBlur,B=e.ariaLabel,F=e.ariaLabelledBy,w=e.ariaDescribedBy,D=e.ariaDisabled,H=e.ariaHidden,I=e.tooltip,T=function(e){return v||u?h(e)?t:a:r},W=react.exports.useMemo((function(){return "horizontal"===i?(e=K().curve(monotoneX),function(o,n){var i=Math.max(1,o.thickness-2*n)/2,r=.12*(o.target.x0-o.source.x1),t=[[o.source.x1,o.pos0-i],[o.source.x1+r,o.pos0-i],[o.target.x0-r,o.pos1-i],[o.target.x0,o.pos1-i],[o.target.x0,o.pos1+i],[o.target.x0-r,o.pos1+i],[o.source.x1+r,o.pos0+i],[o.source.x1,o.pos0+i],[o.source.x1,o.pos0-i]];return e(t)+"Z"}):function(){var e=K().curve(monotoneY);return function(o,n){var i=Math.max(1,o.thickness-2*n)/2,r=.12*(o.target.y0-o.source.y1),t=[[o.pos0+i,o.source.y1],[o.pos0+i,o.source.y1+r],[o.pos1+i,o.target.y0-r],[o.pos1+i,o.target.y0],[o.pos1-i,o.target.y0],[o.pos1-i,o.target.y0-r],[o.pos0-i,o.source.y1+r],[o.pos0-i,o.source.y1],[o.pos0+i,o.source.y1]];return e(t)+"Z"}}();var e;}),[i]);return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:n.map((function(e){return jsxRuntime.exports.jsx(q,{link:e,layout:i,path:W(e,l),color:e.color,opacity:T(e),blendMode:d,enableGradient:s,setCurrent:c,isInteractive:y,isFocusable:b,onClick:p,onMouseEnter:k,onMouseMove:m,onMouseLeave:x,onKeyDown:f,onKeyUp:g,onFocus:C,onBlur:M,ariaDescribedBy:w,ariaLabel:B,ariaLabelledBy:F,ariaDisabled:D,ariaHidden:H,tooltip:I},e.source.id+"."+e.target.id+"."+e.index)}))})},Q=function(e){var o=e.nodes,n=e.layout,i=e.width,r=e.height,t=e.labelPosition,l=e.labelPadding,d=e.labelOrientation,c=e.getLabelTextColor,u=Et(),v="vertical"===d?-90:0,h=o.map((function(e){var o,a,s;return "horizontal"===n?(a=e.y+e.height/2,e.x<i/2?"inside"===t?(o=e.x1+l,s="vertical"===d?"middle":"start"):(o=e.x-l,s="vertical"===d?"middle":"end"):"inside"===t?(o=e.x-l,s="vertical"===d?"middle":"end"):(o=e.x1+l,s="vertical"===d?"middle":"start")):"vertical"===n&&(o=e.x+e.width/2,e.y<r/2?"inside"===t?(a=e.y1+l,s="vertical"===d?"end":"middle"):(a=e.y-l,s="vertical"===d?"start":"middle"):"inside"===t?(a=e.y-l,s="vertical"===d?"start":"middle"):(a=e.y1+l,s="vertical"===d?"end":"middle")),{id:e.id,label:e.label,x:o,y:a,textAnchor:s,color:c(e)}})),y=Zr(),b=y.animate,p=y.config,f=useSprings(h.length,h.map((function(e){return {transform:"translate("+e.x+", "+e.y+") rotate("+v+")",color:e.color,config:p,immediate:!b}})));return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:f.map((function(e,o){var n=h[o];return jsxRuntime.exports.jsx(animated.text,{dominantBaseline:"central",textAnchor:n.textAnchor,transform:e.transform,style:W({},u.labels.text,{fill:e.color,pointerEvents:"none"}),children:n.label},n.id)}))})},X=["isInteractive","isFocusable","animate","motionConfig","theme","renderWrapper"],Y=function(e){var o=e.data,n=e.valueFormat,a=e.layout,l=void 0===a?S.layout:a,d=e.sort,s=void 0===d?S.sort:d,c=e.align,u=void 0===c?S.align:c,y=e.width,p=e.height,f=e.margin,g=e.colors,k=void 0===g?S.colors:g,m=e.nodeThickness,x=void 0===m?S.nodeThickness:m,C=e.nodeSpacing,M=void 0===C?S.nodeThickness:C,B=e.nodeInnerPadding,O=void 0===B?S.nodeInnerPadding:B,F=e.nodeBorderColor,w=void 0===F?S.nodeBorderColor:F,D=e.nodeOpacity,H$1=void 0===D?S.nodeOpacity:D,I=e.nodeHoverOpacity,T=void 0===I?S.nodeHoverOpacity:I,K=e.nodeHoverOthersOpacity,P=void 0===K?S.nodeHoverOthersOpacity:K,E=e.nodeBorderWidth,A=void 0===E?S.nodeBorderWidth:E,N=e.nodeBorderRadius,U=void 0===N?S.nodeBorderRadius:N,R=e.linkOpacity,z=void 0===R?S.linkOpacity:R,j=e.linkHoverOpacity,Z=void 0===j?S.linkHoverOpacity:j,q=e.linkHoverOthersOpacity,X=void 0===q?S.linkHoverOthersOpacity:q,Y=e.linkContract,$=void 0===Y?S.linkContract:Y,_=e.linkBlendMode,ee=void 0===_?S.linkBlendMode:_,oe=e.enableLinkGradient,ne=void 0===oe?S.enableLinkGradient:oe,ie=e.enableLabels,re=void 0===ie?S.enableLabels:ie,te=e.labelPosition,ae=void 0===te?S.labelPosition:te,le=e.labelPadding,de=void 0===le?S.labelPadding:le,se=e.labelOrientation,ce=void 0===se?S.labelOrientation:se,ue=e.label,ve=void 0===ue?S.label:ue,he=e.labelTextColor,ye=void 0===he?S.labelTextColor:he,be=e.nodeTooltip,pe=void 0===be?S.nodeTooltip:be,fe=e.linkTooltip,ge=void 0===fe?S.linkTooltip:fe,ke=e.isInteractive,me=void 0===ke?S.isInteractive:ke,xe=e.isFocusable,Ce=void 0===xe?S.isFocusable:xe,Me=e.onClick,Le=e.onKeyDown,Be=e.onKeyUp,Oe=e.onMouseEnter,Fe=e.onMouseMove,we=e.onMouseLeave,De=e.onFocus,He=e.onBlur,Ie=e.legends,Te=void 0===Ie?S.legends:Ie,Ke=e.layers,Pe=void 0===Ke?S.layers:Ke,Ee=e.role,We=void 0===Ee?S.role:Ee,Ae=e.ariaLabel,Ne=e.ariaLabelledBy,Ue=e.ariaDescribedBy,Re=e.linkAriaLabel,Se=e.linkAriaLabelledBy,ze=e.linkAriaDescribedBy,Ge=e.linkAriaDisabled,je=e.linkAriaHidden,Ve=e.nodeAriaLabel,Ze=e.nodeAriaLabelledBy,qe=e.nodeAriaDescribedBy,Je=e.nodeAriaDisabled,Qe=e.nodeAriaHidden,Xe=Bt(y,p,f),Ye=Xe.margin,$e=Xe.innerWidth,_e=Xe.innerHeight,eo=Xe.outerWidth,oo=Xe.outerHeight,no=G({data:o,valueFormat:n,layout:l,width:$e,height:_e,sort:s,align:u,colors:k,nodeThickness:x,nodeSpacing:M,nodeInnerPadding:O,nodeBorderColor:w,label:ve,labelTextColor:ye}),io=no.nodes,ro=no.links,to=no.legendData,ao=no.getNodeBorderColor,lo=no.currentNode,so=no.setCurrentNode,co=no.currentLink,uo=no.setCurrentLink,vo=no.getLabelTextColor,ho=function(){return !1},yo=function(){return !1};if(co&&(ho=function(e){var o=e.id;return o===co.source.id||o===co.target.id},yo=function(e){var o=e.source,n=e.target;return o.id===co.source.id&&n.id===co.target.id}),lo){var bo=[lo.id];ro.filter((function(e){var o=e.source,n=e.target;return o.id===lo.id||n.id===lo.id})).forEach((function(e){var o=e.source,n=e.target;bo.push(o.id),bo.push(n.id);})),bo=uniq_1(bo),ho=function(e){var o=e.id;return bo.includes(o)},yo=function(e){var o=e.source,n=e.target;return o.id===lo.id||n.id===lo.id};}var po={links:ro,nodes:io,margin:Ye,width:y,height:p,outerWidth:eo,outerHeight:oo},fo={links:null,nodes:null,labels:null,legends:null};return Pe.includes("links")&&(fo.links=jsxRuntime.exports.jsx(J,{links:ro,layout:l,linkContract:$,linkOpacity:z,linkHoverOpacity:Z,linkHoverOthersOpacity:X,linkBlendMode:ee,enableLinkGradient:ne,setCurrentLink:uo,currentNode:lo,currentLink:co,isCurrentLink:yo,isInteractive:me,isFocusable:Ce,onClick:Me,onKeyDown:Le,onKeyUp:Be,onFocus:De,onBlur:He,onMouseEnter:Oe,onMouseMove:Fe,onMouseLeave:we,ariaLabel:Re,ariaLabelledBy:Se,ariaDescribedBy:ze,ariaDisabled:Ge,ariaHidden:je,tooltip:ge},"links")),Pe.includes("nodes")&&(fo.nodes=jsxRuntime.exports.jsx(V,{nodes:io,nodeOpacity:H$1,nodeHoverOpacity:T,nodeHoverOthersOpacity:P,borderWidth:A,borderRadius:U,getBorderColor:ao,setCurrentNode:so,currentNode:lo,currentLink:co,isCurrentNode:ho,isInteractive:me,isFocusable:Ce,onClick:Me,onKeyDown:Le,onKeyUp:Be,onFocus:De,onBlur:He,onMouseEnter:Oe,onMouseMove:Fe,onMouseLeave:we,ariaLabel:Ve,ariaLabelledBy:Ze,ariaDescribedBy:qe,ariaDisabled:Je,ariaHidden:Qe,tooltip:pe},"nodes")),Pe.includes("labels")&&re&&(fo.labels=jsxRuntime.exports.jsx(Q,{nodes:io,layout:l,width:$e,height:_e,labelPosition:ae,labelPadding:de,labelOrientation:ce,getLabelTextColor:vo},"labels")),Pe.includes("legends")&&(fo.legends=jsxRuntime.exports.jsx(react.exports.Fragment,{children:Te.map((function(e,o){return jsxRuntime.exports.jsx(H,W({},e,{containerWidth:$e,containerHeight:_e,data:to}),"legend"+o)}))},"legends")),jsxRuntime.exports.jsx(_i,{width:eo,height:oo,margin:Ye,role:We,isFocusable:Ce,ariaLabel:Ae,ariaLabelledBy:Ne,ariaDescribedBy:Ue,children:Pe.map((function(e,o){var n;return "function"==typeof e?jsxRuntime.exports.jsx(react.exports.Fragment,{children:react.exports.createElement(e,po)},o):null!=(n=null==fo?void 0:fo[e])?n:null}))})},$=function(e){var o=e.isInteractive,n=void 0===o?S.isInteractive:o,i=e.isFocusable,r=void 0===i?S.isFocusable:i,t=e.animate,a=void 0===t?S.animate:t,l=e.motionConfig,d=void 0===l?S.motionConfig:l,s=e.theme,c=e.renderWrapper,v=function(e,o){if(null==e)return {};var n,i,r={},t=Object.keys(e);for(i=0;i<t.length;i++)n=t[i],o.indexOf(n)>=0||(r[n]=e[n]);return r}(e,X);return jsxRuntime.exports.jsx(Ht,{animate:a,isInteractive:n,isFocusable:r,motionConfig:d,renderWrapper:c,theme:s,children:jsxRuntime.exports.jsx(Y,W({isInteractive:n,isFocusable:r},v))})},_=function(e){return jsxRuntime.exports.jsx(Jt,{children:function(o){var n=o.width,i=o.height;return jsxRuntime.exports.jsx($,W({width:n,height:i},e))}})};

export { _ };

