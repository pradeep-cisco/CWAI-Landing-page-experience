import { j as jsxRuntime, J as Jt, e as Ht, B as Bt, r as react, g as Hi, _ as _i, w as w$1, E as Et, p as pr, W as We, G as Gi, I as It, k } from './client.js';
import { d as dn, j, r as rn } from './harbor-charts-arcs.es.js';
import { c as cloneDeep_1 } from './cloneDeep.js';
import { s as sortBy_1 } from './sortBy.js';
import { P, r as roundNode, h as hierarchy } from './dice.js';

function y() {
  var dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root) {
    var n = root.height + 1;
    root.x0 =
    root.y0 = padding;
    root.x1 = dx;
    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(dy, n) {
    return function(node) {
      if (node.children) {
        P(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
      }
      var x0 = node.x0,
          y0 = node.y0,
          x1 = node.x1 - padding,
          y1 = node.y1 - padding;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.round = function(x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  partition.padding = function(x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}

function A(){return A=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var o=arguments[r];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i]);}return e},A.apply(this,arguments)}var B={id:"id",value:"value",cornerRadius:0,layers:["arcs","arcLabels"],colors:{scheme:"nivo"},colorBy:"id",inheritColorFromParent:!0,childColor:{from:"color"},borderWidth:1,borderColor:"white",enableArcLabels:!1,arcLabel:"formattedValue",arcLabelsRadiusOffset:.5,arcLabelsSkipAngle:0,arcLabelsTextColor:{theme:"labels.text.fill"},animate:!0,motionConfig:"gentle",transitionMode:"innerRadius",isInteractive:!0,isFocusable:!1,defs:[],fill:[],tooltip:function(e){var r=e.id,o=e.formattedValue,i=e.color;return jsxRuntime.exports.jsx(w$1,{id:r,value:o,enableChip:!0,color:i})},role:"img"},F=function(r){var o=r.data,t=r.id,l=void 0===t?B.id:t,c=r.value,d=void 0===c?B.value:c,s=r.valueFormat,f=r.radius,v=r.cornerRadius,b=void 0===v?B.cornerRadius:v,h=r.colors,m=void 0===h?B.colors:h,A=r.colorBy,F=void 0===A?B.colorBy:A,D=r.inheritColorFromParent,R=void 0===D?B.inheritColorFromParent:D,w=r.childColor,x=void 0===w?B.childColor:w,I=Et(),K=pr(m,F),W=We(x,I),O=Gi(l),k=Gi(d),G=It(s),P=react.exports.useMemo((function(){var e,r=cloneDeep_1(o),i=hierarchy(r).sum(k),n=y().size([2*Math.PI,f*f])(i).descendants().slice(1),a=null!=(e=i.value)?e:0;return sortBy_1(n,"depth").reduce((function(e,r){var o,i=O(r.data),n=r.value,t=100*n/a,l=r.ancestors().map((function(e){return O(e.data)})),c={startAngle:r.x0,endAngle:r.x1,innerRadius:Math.sqrt(r.y0),outerRadius:Math.sqrt(r.y1)};r.parent&&(o=e.find((function(e){return e.id===O(r.parent.data)})));var d={id:i,path:l,value:n,percentage:t,formattedValue:s?G(n):t.toFixed(2)+"%",color:"",arc:c,data:r.data,depth:r.depth,height:r.height};return R&&o&&d.depth>1?d.color=W(o,d):d.color=K(d),[].concat(e,[d])}),[])}),[o,f,k,O,s,G,K,R,W]);return {arcGenerator:dn({cornerRadius:b}),nodes:P}},D=function(r){var o=r.nodes,i=r.arcGenerator,n=r.centerX,a=r.centerY,t=r.radius;return react.exports.useMemo((function(){return {nodes:o,arcGenerator:i,centerX:n,centerY:a,radius:t}}),[o,i,n,a,t])},R=function(o){var i=o.center,n=o.data,a=o.arcGenerator,t=o.borderWidth,l=o.borderColor,c=o.isInteractive,d=o.isFocusable,s=o.onClick,u=o.onMouseEnter,v=o.onMouseMove,b=o.onMouseLeave,p=o.onFocus,y=o.onBlur,L=o.onKeyDown,C=o.onKeyUp,g=o.sliceAriaLabel,M=o.sliceAriaLabelledBy,A=o.sliceAriaDescribedBy,B=o.sliceAriaDisabled,F=o.sliceAriaHidden,D=o.tooltip,R=o.transitionMode,w=k(),x=w.showTooltipFromEvent,I=w.hideTooltip,K=react.exports.useMemo((function(){if(c)return function(e,r){null==s||s(e,r);}}),[c,s]),W=react.exports.useMemo((function(){if(c)return function(e,o){x(react.exports.createElement(D,e),o),null==u||u(e,o);}}),[c,x,D,u]),O=react.exports.useMemo((function(){if(c)return function(e,o){x(react.exports.createElement(D,e),o),null==v||v(e,o);}}),[c,x,D,v]),k$1=react.exports.useMemo((function(){if(c)return function(e,r){I(),null==b||b(e,r);}}),[c,I,b]),G=react.exports.useMemo((function(){if(c)return function(e,r){null==p||p(e,r);}}),[c,p]),P=react.exports.useMemo((function(){if(c)return function(e,r){null==y||y(e,r);}}),[c,y]),H=react.exports.useMemo((function(){if(c&&d)return function(e,r){null==L||L(e,r);}}),[d,c,L]),j=react.exports.useMemo((function(){if(c&&d)return function(e,r){null==C||C(e,r);}}),[d,c,C]);return jsxRuntime.exports.jsx(rn,{center:i,data:n,arcGenerator:a,borderWidth:t,borderColor:l,transitionMode:R,onClick:K,onMouseEnter:W,onMouseMove:O,onMouseLeave:k$1,onFocus:G,onBlur:P,onKeyDown:H,onKeyUp:j,ariaLabel:g,ariaLabelledBy:M,ariaDescribedBy:A,ariaDisabled:B,ariaHidden:F})},w=["isInteractive","animate","motionConfig","theme","renderWrapper"],x=function(i){var n=i.data,a=i.id,t=void 0===a?B.id:a,s=i.value,u=void 0===s?B.value:s,f=i.valueFormat,b=i.cornerRadius,h=void 0===b?B.cornerRadius:b,p=i.layers,y=void 0===p?B.layers:p,L=i.colors,C=void 0===L?B.colors:L,g=i.colorBy,M=void 0===g?B.colorBy:g,A=i.inheritColorFromParent,w=void 0===A?B.inheritColorFromParent:A,x=i.childColor,I=void 0===x?B.childColor:x,K=i.borderWidth,W=void 0===K?B.borderWidth:K,O=i.borderColor,k=void 0===O?B.borderColor:O,G=i.margin,P=i.width,H=i.height,j$1=i.enableArcLabels,E=void 0===j$1?B.enableArcLabels:j$1,T=i.arcLabel,X=void 0===T?B.arcLabel:T,Y=i.arcLabelsRadiusOffset,U=void 0===Y?B.arcLabelsRadiusOffset:Y,S=i.arcLabelsSkipAngle,V=void 0===S?B.arcLabelsSkipAngle:S,q=i.arcLabelsTextColor,z=void 0===q?B.arcLabelsTextColor:q,J=i.arcLabelsComponent,N=i.defs,Q=void 0===N?B.defs:N,Z=i.fill,$=void 0===Z?B.fill:Z,_=i.transitionMode,ee=void 0===_?B.transitionMode:_,re=i.isInteractive,oe=void 0===re?B.isInteractive:re,ie=i.isFocusable,ne=void 0===ie?B.isFocusable:ie,ae=i.ariaLabel,te=i.ariaLabelledBy,le=i.ariaDescribedBy,ce=i.onClick,de=i.onMouseEnter,se=i.onMouseLeave,ue=i.onMouseMove,fe=i.onBlur,ve=i.onFocus,be=i.onKeyDown,he=i.onKeyUp,me=i.tooltip,pe=void 0===me?B.tooltip:me,ye=i.role,Le=void 0===ye?B.role:ye,Ce=i.sliceAriaLabel,ge=i.sliceAriaLabelledBy,Me=i.sliceAriaDescribedBy,Ae=i.sliceAriaDisabled,Be=i.sliceAriaHidden,Fe=Bt(P,H,G),De=Fe.innerHeight,Re=Fe.innerWidth,we=Fe.margin,xe=Fe.outerHeight,Ie=Fe.outerWidth,Ke=react.exports.useMemo((function(){return {radius:Math.min(Re,De)/2,centerX:Re/2,centerY:De/2}}),[De,Re]),We=Ke.centerX,Oe=Ke.centerY,ke=Ke.radius,Ge=F({data:n,id:t,value:u,valueFormat:f,radius:ke,cornerRadius:h,colors:C,colorBy:M,inheritColorFromParent:w,childColor:I}),Pe=Ge.arcGenerator,He=Ge.nodes,je=Hi(Q,He,$,{dataKey:".",colorKey:"color",targetKey:"fill"}),Ee={arcs:null,arcLabels:null};y.includes("arcs")&&(Ee.arcs=jsxRuntime.exports.jsx(R,{center:[We,Oe],data:He,arcGenerator:Pe,borderWidth:W,borderColor:k,transitionMode:ee,isInteractive:oe,isFocusable:ne,tooltip:pe,onClick:ce,onMouseEnter:de,onMouseLeave:se,onMouseMove:ue,onFocus:ve,onBlur:fe,onKeyDown:be,onKeyUp:he,sliceAriaLabel:Ce,sliceAriaLabelledBy:ge,sliceAriaDescribedBy:Me,sliceAriaDisabled:Ae,sliceAriaHidden:Be},"arcs")),E&&y.includes("arcLabels")&&(Ee.arcLabels=jsxRuntime.exports.jsx(j,{center:[We,Oe],data:He,label:X,radiusOffset:U,skipAngle:V,textColor:z,transitionMode:ee,component:J},"arcLabels"));var Te=D({nodes:He,arcGenerator:Pe,centerX:We,centerY:Oe,radius:ke});return jsxRuntime.exports.jsx(_i,{width:Ie,height:xe,defs:je,margin:we,role:Le,ariaLabel:ae,ariaLabelledBy:te,ariaDescribedBy:le,isFocusable:ne,children:y.map((function(e,i){return void 0!==Ee[e]?Ee[e]:"function"==typeof e?jsxRuntime.exports.jsx(react.exports.Fragment,{children:react.exports.createElement(e,Te)},i):null}))})},I=function(e){var r=e.isInteractive,o=void 0===r?B.isInteractive:r,i=e.animate,n=void 0===i?B.animate:i,a=e.motionConfig,l=void 0===a?B.motionConfig:a,c=e.theme,d=e.renderWrapper,s=function(e,r){if(null==e)return {};var o,i,n={},a=Object.keys(e);for(i=0;i<a.length;i++)o=a[i],r.indexOf(o)>=0||(n[o]=e[o]);return n}(e,w);return jsxRuntime.exports.jsx(Ht,{isInteractive:o,animate:n,motionConfig:l,theme:c,renderWrapper:d,children:jsxRuntime.exports.jsx(x,A({isInteractive:o},s))})},K=function(e){return jsxRuntime.exports.jsx(Jt,{children:function(r){var o=r.width,i=r.height;return jsxRuntime.exports.jsx(I,A({width:o,height:i},e))}})};

export { K };

