import { U as tau, j as jsxRuntime, J as Jt, e as Ht, B as Bt, r as react, g as Hi, _ as _i, H as H$1, w, G as Gi, I as It, p as pr, k, V as ni, a0 as oi } from './client.js';
import { d as dn, N as N$1, j as j$1, a as an, r as rn } from './harbor-charts-arcs.es.js';
import { c as constant } from './constant.js';

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity(d) {
  return d;
}

function W() {
  var value = identity,
      sortValues = descending,
      sort = null,
      startAngle = constant(0),
      endAngle = constant(tau),
      padAngle = constant(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau, Math.max(-tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
  };

  return pie;
}

function G(){return G=Object.assign?Object.assign.bind():function(e){for(var i=1;i<arguments.length;i++){var a=arguments[i];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n]);}return e},G.apply(this,arguments)}function H(e,i){if(null==e)return {};var a,n,t={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],i.indexOf(a)>=0||(t[a]=e[a]);return t}var E,K=function(e){var i=e.width,a=e.height,n=e.legends,t=e.data,r=e.toggleSerie;return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:n.map((function(e,n){var o;return jsxRuntime.exports.jsx(H$1,G({},e,{containerWidth:i,containerHeight:a,data:null!=(o=e.data)?o:t,toggleSerie:e.toggleSerie?r:void 0}),n)}))})},X={id:"id",value:"value",sortByValue:!1,innerRadius:0,padAngle:0,cornerRadius:0,layers:["arcs","arcLinkLabels","arcLabels","legends"],startAngle:0,endAngle:360,fit:!0,activeInnerRadiusOffset:0,activeOuterRadiusOffset:0,borderWidth:0,borderColor:{from:"color",modifiers:[["darker",1]]},enableArcLabels:!0,arcLabel:"formattedValue",arcLabelsSkipAngle:0,arcLabelsRadiusOffset:.5,arcLabelsTextColor:{theme:"labels.text.fill"},enableArcLinkLabels:!0,arcLinkLabel:"id",arcLinkLabelsSkipAngle:0,arcLinkLabelsOffset:0,arcLinkLabelsDiagonalLength:16,arcLinkLabelsStraightLength:24,arcLinkLabelsThickness:1,arcLinkLabelsTextOffset:6,arcLinkLabelsTextColor:{theme:"labels.text.fill"},arcLinkLabelsColor:{theme:"axis.ticks.line.stroke"},colors:{scheme:"nivo"},defs:[],fill:[],isInteractive:!0,isFocusable:!0,animate:!0,motionConfig:"gentle",transitionMode:"innerRadius",tooltip:function(e){var i=e.datum;return jsxRuntime.exports.jsx(w,{id:i.id,value:i.formattedValue,enableChip:!0,color:i.color})},legends:[],role:"img",pixelRatio:"undefined"!=typeof window&&null!=(E=window.devicePixelRatio)?E:1},Y=["points"],j=function(i){var a=i.data,n=i.id,t=void 0===n?X.id:n,r=i.value,o=void 0===r?X.value:r,s=i.valueFormat,c=i.colors,u=void 0===c?X.colors:c,v=Gi(t),f=Gi(o),g=It(s),L=pr(u,"id");return react.exports.useMemo((function(){return a.map((function(e){var i,a=v(e),n=f(e),t={id:a,label:null!=(i=e.label)?i:a,hidden:!1,value:n,formattedValue:g(n),data:e};return G({},t,{color:L(t)})}))}),[a,v,f,g,L])},U=function(n){var t=n.data,r=n.startAngle,o=n.endAngle,d=n.innerRadius,l=n.outerRadius,u=n.padAngle,v=n.sortByValue,f=n.activeId,g=n.activeInnerRadiusOffset,L=n.activeOuterRadiusOffset,h=n.hiddenIds,b=n.forwardLegendData,A=react.exports.useMemo((function(){var e=W().value((function(e){return e.value})).startAngle(ni(r)).endAngle(ni(o)).padAngle(ni(u));return v||e.sortValues(null),e}),[r,o,u,v]),p=react.exports.useMemo((function(){var e=t.filter((function(e){return !h.includes(e.id)}));return {dataWithArc:A(e).map((function(e){var i=Math.abs(e.endAngle-e.startAngle);return G({},e.data,{arc:{index:e.index,startAngle:e.startAngle,endAngle:e.endAngle,innerRadius:f===e.data.id?d-g:d,outerRadius:f===e.data.id?l+L:l,thickness:l-d,padAngle:e.padAngle,angle:i,angleDeg:oi(i)}})})),legendData:t.map((function(e){return {id:e.id,label:e.label,color:e.color,hidden:h.includes(e.id),data:e}}))}}),[A,t,h,f,d,g,l,L]),k=p.legendData,I=react.exports.useRef(b);return react.exports.useEffect((function(){"function"==typeof I.current&&I.current(k);}),[I,k]),p},P=function(e){var i=e.activeId,a=e.onActiveIdChange,r=e.defaultActiveId,o=void 0!==i,d=react.exports.useState(o?null:void 0===r?null:r),l=d[0],s=d[1];return {activeId:o?i:l,setActiveId:react.exports.useCallback((function(e){a&&a(e),o||s(e);}),[o,a,s])}},z=function(i){var a=i.data,r=i.width,o=i.height,d=i.innerRadius,l=void 0===d?X.innerRadius:d,c=i.startAngle,u=void 0===c?X.startAngle:c,v=i.endAngle,f=void 0===v?X.endAngle:v,g=i.padAngle,L=void 0===g?X.padAngle:g,h=i.sortByValue,b=void 0===h?X.sortByValue:h,k=i.cornerRadius,I=void 0===k?X.cornerRadius:k,R=i.fit,m=void 0===R?X.fit:R,O=i.activeInnerRadiusOffset,C=void 0===O?X.activeInnerRadiusOffset:O,y=i.activeOuterRadiusOffset,w=void 0===y?X.activeOuterRadiusOffset:y,x=i.activeId,M=i.onActiveIdChange,D=i.defaultActiveId,B=i.forwardLegendData,W=P({activeId:x,onActiveIdChange:M,defaultActiveId:D}),S=W.activeId,T=W.setActiveId,F=react.exports.useState([]),V=F[0],E=F[1],K=react.exports.useMemo((function(){var e,i=Math.min(r,o)/2,a=i*Math.min(l,1),n=r/2,t=o/2;if(m){var d=an(n,t,i,u-90,f-90),s=d.points,c=H(d,Y),v=Math.min(r/c.width,o/c.height),g={width:c.width*v,height:c.height*v};g.x=(r-g.width)/2,g.y=(o-g.height)/2,n=(n-c.x)/c.width*c.width*v+g.x,t=(t-c.y)/c.height*c.height*v+g.y,e={box:c,ratio:v,points:s},i*=v,a*=v;}return {centerX:n,centerY:t,radius:i,innerRadius:a,debug:e}}),[r,o,l,u,f,m]),j=U({data:a,startAngle:u,endAngle:f,innerRadius:K.innerRadius,outerRadius:K.radius,padAngle:L,sortByValue:b,activeId:S,activeInnerRadiusOffset:C,activeOuterRadiusOffset:w,hiddenIds:V,forwardLegendData:B}),q=react.exports.useCallback((function(e){E((function(i){return i.indexOf(e)>-1?i.filter((function(i){return i!==e})):[].concat(i,[e])}));}),[]);return G({arcGenerator:dn({cornerRadius:I,padAngle:ni(L)}),activeId:S,setActiveId:T,toggleSerie:q},j,K)},J=function(i){var a=i.dataWithArc,n=i.arcGenerator,t=i.centerX,r=i.centerY,o=i.radius,d=i.innerRadius;return react.exports.useMemo((function(){return {dataWithArc:a,arcGenerator:n,centerX:t,centerY:r,radius:o,innerRadius:d}}),[a,n,t,r,o,d])},N=function(i){var a=i.center,n=i.data,t=i.arcGenerator,o=i.borderWidth,d=i.borderColor,l=i.isInteractive,s=i.isFocusable,c=i.onClick,u=i.onMouseDown,v=i.onMouseEnter,f=i.onMouseMove,g=i.onMouseLeave,L=i.onFocus,h=i.onBlur,b=i.onKeyDown,A=i.onKeyUp,p=i.sliceAriaLabel,I=i.sliceAriaLabelledBy,R=i.sliceAriaDescribedBy,m=i.sliceAriaDisabled,O=i.sliceAriaHidden,C=i.setActiveId,y=i.tooltip,w=i.transitionMode,x=k(),M=x.showTooltipFromEvent,B=x.hideTooltip,W=react.exports.useMemo((function(){if(l)return function(e,i){null==c||c(e,i);}}),[l,c]),S=react.exports.useMemo((function(){if(l)return function(e,i){M(react.exports.createElement(y,{datum:e}),i),C(e.id),null==v||v(e,i);}}),[l,M,C,v,y]),T=react.exports.useMemo((function(){if(l)return function(e,i){M(react.exports.createElement(y,{datum:e}),i),null==f||f(e,i);}}),[l,M,f,y]),F=react.exports.useMemo((function(){if(l)return function(e,i){B(),C(null),null==g||g(e,i);}}),[l,B,C,g]),G=react.exports.useMemo((function(){if(l)return function(e,i){null==L||L(e,i);}}),[l,L]),H=react.exports.useMemo((function(){if(l)return function(e,i){null==h||h(e,i);}}),[l,h]),E=react.exports.useMemo((function(){if(l&&s)return function(e,i){null==b||b(e,i);}}),[s,l,b]),K=react.exports.useMemo((function(){if(l&&s)return function(e,i){null==A||A(e,i);}}),[s,l,A]);return jsxRuntime.exports.jsx(rn,{center:a,data:n,arcGenerator:t,borderWidth:o,borderColor:d,isFocusable:s,transitionMode:w,onClick:W,onMouseDown:u,onMouseEnter:S,onMouseMove:T,onMouseLeave:F,onFocus:G,onBlur:H,onKeyDown:E,onKeyUp:K,ariaLabel:p,ariaLabelledBy:I,ariaDescribedBy:R,ariaDisabled:m,ariaHidden:O})},Q=["isInteractive","animate","motionConfig","theme","renderWrapper"],Z=function(e){var i=e.data,a=e.id,n=void 0===a?X.id:a,t=e.value,d=void 0===t?X.value:t,l=e.valueFormat,s=e.sortByValue,c=void 0===s?X.sortByValue:s,u=e.layers,L=void 0===u?X.layers:u,h=e.startAngle,b=void 0===h?X.startAngle:h,A=e.endAngle,p=void 0===A?X.endAngle:A,k=e.padAngle,m=void 0===k?X.padAngle:k,O=e.fit,C=void 0===O?X.fit:O,y=e.innerRadius,w=void 0===y?X.innerRadius:y,x=e.cornerRadius,M=void 0===x?X.cornerRadius:x,B=e.activeInnerRadiusOffset,W=void 0===B?X.activeInnerRadiusOffset:B,S=e.activeOuterRadiusOffset,T=void 0===S?X.activeOuterRadiusOffset:S,F=e.width,V=e.height,G=e.margin,H=e.colors,E=void 0===H?X.colors:H,Y=e.borderWidth,U=void 0===Y?X.borderWidth:Y,P=e.borderColor,q=void 0===P?X.borderColor:P,Q=e.enableArcLabels,Z=void 0===Q?X.enableArcLabels:Q,$=e.arcLabel,_=void 0===$?X.arcLabel:$,ee=e.arcLabelsSkipAngle,ie=void 0===ee?X.arcLabelsSkipAngle:ee,ae=e.arcLabelsTextColor,ne=void 0===ae?X.arcLabelsTextColor:ae,te=e.arcLabelsRadiusOffset,re=void 0===te?X.arcLabelsRadiusOffset:te,oe=e.arcLabelsComponent,de=e.enableArcLinkLabels,le=void 0===de?X.enableArcLinkLabels:de,se=e.arcLinkLabel,ce=void 0===se?X.arcLinkLabel:se,ue=e.arcLinkLabelsSkipAngle,ve=void 0===ue?X.arcLinkLabelsSkipAngle:ue,fe=e.arcLinkLabelsOffset,ge=void 0===fe?X.arcLinkLabelsOffset:fe,Le=e.arcLinkLabelsDiagonalLength,he=void 0===Le?X.arcLinkLabelsDiagonalLength:Le,be=e.arcLinkLabelsStraightLength,Ae=void 0===be?X.arcLinkLabelsStraightLength:be,pe=e.arcLinkLabelsThickness,ke=void 0===pe?X.arcLinkLabelsThickness:pe,Ie=e.arcLinkLabelsTextOffset,Re=void 0===Ie?X.arcLinkLabelsTextOffset:Ie,me=e.arcLinkLabelsTextColor,Oe=void 0===me?X.arcLinkLabelsTextColor:me,Ce=e.arcLinkLabelsColor,ye=void 0===Ce?X.arcLinkLabelsColor:Ce,we=e.arcLinkLabelComponent,xe=e.defs,Me=void 0===xe?X.defs:xe,De=e.fill,Be=void 0===De?X.fill:De,We=e.isInteractive,Se=void 0===We?X.isInteractive:We,Te=e.isFocusable,Fe=void 0===Te?X.isFocusable:Te,Ve=e.ariaLabel,Ge=e.ariaLabelledBy,He=e.ariaDescribedBy,Ee=e.onClick,Ke=e.onMouseDown,Xe=e.onMouseEnter,Ye=e.onMouseMove,je=e.onMouseLeave,Ue=e.onBlur,Pe=e.onFocus,qe=e.onKeyDown,ze=e.onKeyUp,Je=e.tooltip,Ne=void 0===Je?X.tooltip:Je,Qe=e.activeId,Ze=e.onActiveIdChange,$e=e.defaultActiveId,_e=e.transitionMode,ei=void 0===_e?X.transitionMode:_e,ii=e.legends,ai=void 0===ii?X.legends:ii,ni=e.forwardLegendData,ti=e.role,ri=void 0===ti?X.role:ti,oi=e.sliceAriaLabel,di=e.sliceAriaLabelledBy,li=e.sliceAriaDescribedBy,si=e.sliceAriaDisabled,ci=e.sliceAriaHidden,ui=Bt(F,V,G),vi=ui.outerWidth,fi=ui.outerHeight,gi=ui.margin,Li=ui.innerWidth,hi=ui.innerHeight,bi=j({data:i,id:n,value:d,valueFormat:l,colors:E}),Ai=z({data:bi,width:Li,height:hi,fit:C,innerRadius:w,startAngle:b,endAngle:p,padAngle:m,sortByValue:c,cornerRadius:M,activeInnerRadiusOffset:W,activeOuterRadiusOffset:T,activeId:Qe,onActiveIdChange:Ze,defaultActiveId:$e,forwardLegendData:ni}),pi=Ai.dataWithArc,ki=Ai.legendData,Ii=Ai.arcGenerator,Ri=Ai.centerX,mi=Ai.centerY,Oi=Ai.radius,Ci=Ai.innerRadius,yi=Ai.setActiveId,wi=Ai.toggleSerie,xi=Hi(Me,pi,Be),Mi={arcs:null,arcLinkLabels:null,arcLabels:null,legends:null};L.includes("arcs")&&(Mi.arcs=jsxRuntime.exports.jsx(N,{center:[Ri,mi],data:pi,arcGenerator:Ii,borderWidth:U,borderColor:q,isInteractive:Se,isFocusable:Fe,onClick:Ee,onMouseDown:Ke,onMouseEnter:Xe,onMouseMove:Ye,onMouseLeave:je,onBlur:Ue,onFocus:Pe,onKeyDown:qe,onKeyUp:ze,sliceAriaLabel:oi,sliceAriaLabelledBy:di,sliceAriaDescribedBy:li,sliceAriaDisabled:si,sliceAriaHidden:ci,setActiveId:yi,tooltip:Ne,transitionMode:ei},"arcs")),le&&L.includes("arcLinkLabels")&&(Mi.arcLinkLabels=jsxRuntime.exports.jsx(N$1,{center:[Ri,mi],data:pi,label:ce,skipAngle:ve,offset:ge,diagonalLength:he,straightLength:Ae,strokeWidth:ke,textOffset:Re,textColor:Oe,linkColor:ye,component:we},"arcLinkLabels")),Z&&L.includes("arcLabels")&&(Mi.arcLabels=jsxRuntime.exports.jsx(j$1,{center:[Ri,mi],data:pi,label:_,radiusOffset:re,skipAngle:ie,textColor:ne,transitionMode:ei,component:oe},"arcLabels")),ai.length>0&&L.includes("legends")&&(Mi.legends=jsxRuntime.exports.jsx(K,{width:Li,height:hi,data:ki,legends:ai,toggleSerie:wi},"legends"));var Di=J({dataWithArc:pi,arcGenerator:Ii,centerX:Ri,centerY:mi,radius:Oi,innerRadius:Ci});return jsxRuntime.exports.jsx(_i,{width:vi,height:fi,margin:gi,defs:xi,role:ri,ariaLabel:Ve,ariaLabelledBy:Ge,ariaDescribedBy:He,isFocusable:Fe,children:L.map((function(e,i){return void 0!==Mi[e]?Mi[e]:"function"==typeof e?jsxRuntime.exports.jsx(react.exports.Fragment,{children:react.exports.createElement(e,Di)},i):null}))})},$=function(e){var i=e.isInteractive,a=void 0===i?X.isInteractive:i,n=e.animate,t=void 0===n?X.animate:n,r=e.motionConfig,o=void 0===r?X.motionConfig:r,d=e.theme,l=e.renderWrapper,s=H(e,Q);return jsxRuntime.exports.jsx(Ht,{animate:t,isInteractive:a,motionConfig:o,renderWrapper:l,theme:d,children:jsxRuntime.exports.jsx(Z,G({isInteractive:a},s))})},_=function(e){return jsxRuntime.exports.jsx(Jt,{children:function(i){var a=i.width,n=i.height;return jsxRuntime.exports.jsx($,G({width:a,height:n},e))}})};

export { _ };

