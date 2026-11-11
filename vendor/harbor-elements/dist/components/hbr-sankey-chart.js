import { h, proxyCustomElement, HTMLElement, Host } from '@stencil/core/internal/client';
import { _ } from './harbor-charts-sankey.es.js';
import { r as react, E as Et$1, k, Z as Zr, b as useSpring, a as animated, $ as $r, t as to, c as createRoot } from './client.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { s as showChartPopover, h as hideChartPopover, b as browserDownloadCsv, d as defineCustomElement$9 } from './board.js';
import { m, D, $, S, o as omitChartConfigKeys, r as resolveChartPopoverOptions, a as applyChartPopoverOptions, i as isChartPopoverSelfManaged } from './popover-options.js';
import { d as defineCustomElement$8 } from './divider.js';
import { d as defineCustomElement$7 } from './icon.js';
import { d as defineCustomElement$6 } from './illustration.js';
import { d as defineCustomElement$5 } from './layout.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';
import { T as Te, $ as $e } from './chunk-K7HK2GXH.js';
import { G as Gt$1, T as Tt } from './chunk-Z46YYJNO.js';

var it={};m(it,{getCategoricalColors:()=>D,getColors:()=>Ee,getSankeyAutoSizeLabelWidth:()=>et,getSankeyAutoSizePlan:()=>He,getSankeyBaseConfig:()=>ft,getSankeyCategoricalConfig:()=>Qt,getSankeyClickSelectionState:()=>bt,getSankeyDynamicLegendPadding:()=>Mt,getSankeySelectionNodeIds:()=>We,isSankeyDynamicHeightMarginEnabled:()=>_t,isSankeyDynamicLegendEnabled:()=>Ct,toggleSankeyItemClickSelection:()=>kt,updateSankeySelectionLabelState:()=>St});var mt=({size:e,fill:t,borderWidth:a,borderColor:r},n,l=2)=>{let u=react.exports.createElement("div",{className:"--sankey-legend-rect",style:{background:t,width:e-l*2,height:e-l*2,margin:l}}),i=`hbr-sankey-legend-${Math.random().toString(16).slice(2)}`,o=react.exports.createElement("foreignObject",{className:"--sankey-legend-shape",id:i,tabIndex:-1,width:e,height:e,fill:"transparent",style:{width:e,height:e,pointerEvents:"none",background:"transparent"}},n?u:null),s=react.exports.createElement("rect",{x:l,y:l,fill:t,strokeWidth:a,stroke:r,width:e-l*2,height:e-l*2,style:{pointerEvents:"none"}});return react.exports.createElement(react.exports.Fragment,{},o,s)},ct=({nodes:e,width:t=0,height:a=0,margin:r={top:0,right:0,bottom:0,left:0}},{legend:n,isFocusable:l,isInteractive:u})=>{let i=[[n,e.map(o=>{var s;return {id:o.id,label:String((s=o.label)!=null?s:o.id),color:o.color,hidden:!1}})]];return Te({innerHeight:Math.max(0,a-r.top-r.bottom),innerWidth:Math.max(0,t-r.left-r.right),isFocusable:l,isInteractive:u,legendData:i})};var be={top:40,right:60,bottom:90,left:60},ze={fontSize:"var(--hbr-font-size-2xs)",fontFamily:"var(--hbr-font-body)",textColor:"var(--base-text-default)",axis:{text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--hbr-font-size-2xs)"}}}},vt=e=>{var a;let t=e.target;return (a=t==null?void 0:t.nextElementSibling)==null?void 0:a.id},Ze=(e,t)=>S($({},e),{legendId:vt(t)}),Ht=e=>{var l;let t=e.target,a=t==null?void 0:t.parentNode,r=a instanceof Element?a:null,n=e.key==="ArrowLeft"||e.key==="ArrowUp"?r==null?void 0:r.previousElementSibling:e.key==="ArrowRight"||e.key==="ArrowDown"?r==null?void 0:r.nextElementSibling:null;(l=n==null?void 0:n.firstElementChild)==null||l.focus();},ea=e=>{let t=e.target;return t?e.key==="ArrowLeft"||e.key==="ArrowUp"?t.previousElementSibling:e.key==="ArrowRight"||e.key==="ArrowDown"?t.nextElementSibling:t:null},ht=e=>{let t=ea(e);t==null||t.focus();let a=t==null?void 0:t.parentNode;a instanceof Element&&Array.from(a.children).forEach(r=>{r.tagName==="rect"?r!==t?(r.setAttribute("fill-opacity","0.75"),r.setAttribute("stroke-opacity","0.75")):(r.setAttribute("fill-opacity","1"),r.setAttribute("stroke-opacity","1")):r.tagName==="path"&&(r!==t?r.setAttribute("fill-opacity","0.15"):r.setAttribute("fill-opacity","0.6"));});},ta=e=>{var t,a,r,n,l,u,i,o;return {top:(a=(t=e.margin)==null?void 0:t.top)!=null?a:be.top,right:(n=(r=e.margin)==null?void 0:r.right)!=null?n:be.right,bottom:(u=(l=e.margin)==null?void 0:l.bottom)!=null?u:be.bottom,left:(o=(i=e.margin)==null?void 0:i.left)!=null?o:be.left}},Oe=(e,t,a)=>{var y,m,h,L;if(Array.isArray(e.legends)&&e.legends.length===0)return [];let r=(a==null?void 0:a.dynamicLegend)===!0,n=(y=a==null?void 0:a.dynamicLegendPadding)!=null?y:12,l=r?0:100,u="row",i=ta(e),o=Array.isArray(e.legends)&&e.legends.length>0?e.legends[0]:void 0,s=$({dataFrom:"keys",anchor:"bottom",direction:u,justify:!1,translateX:-i.left/2,translateY:r?Math.max(60,a.legendHeight+a.dynamicLegendPadding):60,dynamicLegend:r,itemsSpacing:10,itemWidth:l,itemHeight:20,itemDirection:"left-to-right",itemOpacity:.85,symbolSize:20,itemTextColor:"var(--base-text-default)",effects:[{on:"hover",style:{itemOpacity:1}}],symbolShape:f=>{var S,b;return mt(f,(S=e.isInteractive)!=null?S:!0,(b=e.legendShapePadding)!=null?b:2)},onMouseLeave:(f,S)=>{var b;(b=t==null?void 0:t.onMouseLeave)==null||b.call(t,f,S);},onKeyUp:(f,S)=>{Ht(S);},onMouseEnter:(f,S)=>{var b;(b=t==null?void 0:t.onMouseEnter)==null||b.call(t,Ze(f,S),S);},onFocus:(f,S)=>{var b;(b=t==null?void 0:t.onFocus)==null||b.call(t,Ze(f,S),S);},onBlur:(f,S)=>{var b;(b=t==null?void 0:t.onBlur)==null||b.call(t,f,S);},onClick:(f,S)=>{var b;(b=t==null?void 0:t.onClick)==null||b.call(t,Ze(f,S),S);}},o!=null?o:{});if(r){let f=(m=e.width)!=null?m:800,S=Math.max(0,f-i.left-i.right),b=((L=(h=e.data)==null?void 0:h.nodes)!=null?L:[]).map(_=>{var R,I;return String((I=(R=_.label)!=null?R:_.id)!=null?I:"")}).filter(Boolean),C=typeof s.itemHeight=="number"?s.itemHeight:20,A=Math.max(60,C+n);s.translateY=$e(b,S,s,A);}return [s]};var Ee=e=>typeof e!="number"?[]:["var(--accent-a-default, #7D8AFF)","var(--accent-b-default, #B02863)","var(--accent-c-default, #F2638C)","var(--accent-d-default, #753BCC)","var(--accent-e-default, #6BA32A)","var(--accent-f-default, #AD3907)","var(--accent-g-default, #04A4B0)","var(--accent-h-default, #006773)","var(--accent-i-default, #E85FC6)","var(--accent-j-default, #545C8A)"].slice(0,e),We=e=>{var a,r;if("source"in e&&"target"in e)return [String(e.source.id),String(e.target.id)];let t=new Set;return t.add(String(e.id)),(a=e.sourceLinks)==null||a.forEach(n=>{t.add(String(n.target.id));}),(r=e.targetLinks)==null||r.forEach(n=>{t.add(String(n.source.id));}),Array.from(t)},bt=e=>"source"in e&&"target"in e?{type:"link",sourceId:String(e.source.id),targetId:String(e.target.id),nodeIds:We(e)}:{type:"node",nodeId:String(e.id),nodeIds:We(e)},St=(e,t,a,r=700)=>{if(!e||t.length===0)return;let n=new Set(t);e.querySelectorAll("foreignObject div[nid]").forEach(u=>{let i=u.getAttribute("nid");!i||!n.has(i)||(u.style.fontWeight=a?String(r):"");});},kt=(e,t,a,{nodeHoverOpacity:r=1,nodeHoverOthersOpacity:n=.15,linkHoverOpacity:l=.6,linkHoverOthersOpacity:u=.15}={})=>{if(!e)return;let i=e.querySelectorAll("rect[aria-label]"),o=e.querySelectorAll("path[aria-label]");if(!a||!t){i.forEach(y=>{y.style.removeProperty("fill-opacity"),y.style.removeProperty("stroke-opacity");}),o.forEach(y=>{y.style.removeProperty("fill-opacity");});return}let s=new Set(t.nodeIds);i.forEach(y=>{var L;let m=(L=y.getAttribute("data-sankey-node-id"))!=null?L:y.getAttribute("aria-label"),h=!!(m&&s.has(m));y.style.setProperty("fill-opacity",String(h?r:n),"important"),y.style.setProperty("stroke-opacity",String(h?r:n),"important");}),o.forEach(y=>{var f,S,b,C,A,_;let m=(b=(S=y.getAttribute("data-sankey-source"))!=null?S:((f=y.getAttribute("aria-label"))!=null?f:"").split(" -> ")[0])!=null?b:"",h=(_=(A=y.getAttribute("data-sankey-target"))!=null?A:((C=y.getAttribute("aria-label"))!=null?C:"").split(" -> ")[1])!=null?_:"",L=t.type==="link"?m===t.sourceId&&h===t.targetId:m===t.nodeId||h===t.nodeId;y.style.setProperty("fill-opacity",String(L?l:u),"important");});};function ft(e,{legendsEventHandlers:t,itemsEventHandlers:a}){var n,l;return {margin:be,colors:Ee((l=(n=e==null?void 0:e.data)==null?void 0:n.nodes)==null?void 0:l.length),role:"application",labelPosition:(e==null?void 0:e.labelPosition)||"inside",labelPadding:6,labelTextColor:(e==null?void 0:e.labelTextColor)||"var(--base-text-default, #23282E)",onClick:(u,i)=>{var o,s;(o=e==null?void 0:e.onClick)==null||o.call(e,u,i),(s=a==null?void 0:a.onClick)==null||s.call(a,u,i);},onMouseEnter:(u,i)=>{var o,s;(o=e==null?void 0:e.onMouseEnter)==null||o.call(e,u,i),(s=a==null?void 0:a.onMouseEnter)==null||s.call(a,u,i);},onMouseLeave:(u,i)=>{var o,s;(o=e==null?void 0:e.onMouseLeave)==null||o.call(e,u,i),(s=a==null?void 0:a.onMouseLeave)==null||s.call(a,u,i);},onMouseMove:(u,i)=>{var o,s;(o=e==null?void 0:e.onMouseMove)==null||o.call(e,u,i),(s=a==null?void 0:a.onMouseMove)==null||s.call(a,u,i);},onFocus:(u,i)=>{var o,s;(o=e==null?void 0:e.onFocus)==null||o.call(e,u,i),(s=a==null?void 0:a.onFocus)==null||s.call(a,u,i);},onBlur:(u,i)=>{var o,s;(o=e==null?void 0:e.onBlur)==null||o.call(e,u,i),(s=a==null?void 0:a.onBlur)==null||s.call(a,u,i);},nodeTooltip:u=>{var i;return e!=null&&e.nodeTooltip?e.nodeTooltip(u):(i=a==null?void 0:a.nodeTooltip)==null?void 0:i.call(a,u)},linkTooltip:u=>{var i;return e!=null&&e.linkTooltip?e.linkTooltip(u):(i=a==null?void 0:a.linkTooltip)==null?void 0:i.call(a,u)},legends:Oe(e,t),onKeyUp:(u,i)=>{ht(i);},theme:ze}}var aa=45,ra=6,na=12,oa=.5,je=24,Xe=24,ia=16,la=20,ua=8,sa=20,Ye=10,qe={left:10,center:80,right:10},Qe={top:10,center:80,bottom:10},Ve=e=>typeof e.autoSize=="object"&&e.autoSize!==null?e.autoSize:{},Je=(e,t)=>typeof e=="number"&&Number.isFinite(e)&&e>=0?e:t,gt=(e,t)=>{var u,i;let a=Ve(e)[t],r=t==="chartWidthDistribution"?{start:qe.left,center:qe.center,end:qe.right}:{start:Qe.top,center:Qe.center,end:Qe.bottom},n=[Je((u=a==null?void 0:a.left)!=null?u:a==null?void 0:a.top,r.start),Je(a==null?void 0:a.center,r.center),Je((i=a==null?void 0:a.right)!=null?i:a==null?void 0:a.bottom,r.end)],l=n.reduce((o,s)=>o+s,0)||1;return {start:n[0]/l,center:n[1]/l,end:n[2]/l}},ve=(e,t,a=0)=>a>8||!e.includes("var(")?e:e.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]*))?\s*\)/g,(r,n,l)=>ve(t.getPropertyValue(n).trim()||(l==null?void 0:l.trim())||"",t,a+1)),Lt=e=>{if(e&&!e.includes("var("))return e;if(typeof document=="undefined")return e!=null?e:"";let t=getComputedStyle(document.documentElement),a=e?ve(e,t).trim():"",r=document.body?getComputedStyle(document.body).fontFamily.trim():"",n=ve(t.getPropertyValue("--viz-font-body").trim(),t).trim();return a||r||n||t.fontFamily},Ge=(e,t,a)=>Gt$1(Tt(e,`${t}px ${Lt(a)}`)),xt=(e,t,a)=>{let r=Math.abs(a)*Math.PI/180;return e*Math.cos(r)+t*1.2*Math.sin(r)},da=(e,t,a)=>{let r=Math.abs(a)*Math.PI/180;return e*Math.sin(r)+t*1.2*Math.cos(r)},ya=(e,t)=>{var r;let a=typeof t=="function"?t(e):typeof t=="string"?e[t]:(r=e.label)!=null?r:e.id;return String(a!=null?a:"")},pa=(e,t,a)=>Math.ceil(Ge(e,t,a)+la+ua),ma=(e,t,a,r)=>{let n=e.map(s=>pa(s,t,a)),l=Math.max(...n,0),u=[],i=[],o=0;return n.forEach(s=>{let y=i.length?o+Ye+s:s;i.length>0&&y>Math.max(1,r)&&(u.push(i),i=[],o=0),i.push(s),o=i.length===1?s:o+Ye+s;}),i.length>0&&u.push(i),{itemWidth:Math.max(l,1),direction:"row",height:u.length*sa+Math.max(0,u.length-1)*Ye}},ca=e=>{var t,a,r,n,l,u,i,o;return {top:(a=(t=e.margin)==null?void 0:t.top)!=null?a:40,right:(n=(r=e.margin)==null?void 0:r.right)!=null?n:60,bottom:(u=(l=e.margin)==null?void 0:l.bottom)!=null?u:90,left:(o=(i=e.margin)==null?void 0:i.left)!=null?o:60}},Ct=e=>typeof e.autoSize=="object"&&e.autoSize!==null?e.autoSize.dynamicLegend!==!1:e.autoSize===!0,_t=e=>Ve(e).dynamicHeightMargin!==!1,Mt=e=>{let t=Ve(e).dynamicLegendPadding;return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):12},He=(e,t={})=>{var v,H,D,Y,ee,ae,Z,T,te,ye,pe,F,E,G;if(!e.autoSize)return;let a=Ve(e),n=((H=(v=e.data)==null?void 0:v.nodes)!=null?H:[]).map(x=>ya(x,e.label)).filter(Boolean),l=Math.max(1,(Y=(D=t.width)!=null?D:e.width)!=null?Y:800),u=Math.max(1,(ae=(ee=t.height)!=null?ee:e.height)!=null?ae:600),i=na,o=typeof a.minFontSize=="number"&&Number.isFinite(a.minFontSize)&&a.minFontSize>0?a.minFontSize:ra,s=typeof a.maxRotation=="number"&&Number.isFinite(a.maxRotation)?Math.min(90,Math.max(0,a.maxRotation)):aa,y=(Z=a.strategy)!=null?Z:"rotate-and-shrink",m=Lt((T=e.theme)==null?void 0:T.fontFamily),h=gt(e,"chartWidthDistribution"),L=(te=e.labelPosition)!=null?te:"outside",f=L==="right"?h.end:L==="inside"?h.center:h.start,S=Math.max(Xe,l*f),b=(ye=e.labelPadding)!=null?ye:0,C=Math.max(Xe,S-b-je),A=(x,Se)=>xt(Math.max(...n.map(J=>Ge(J,x,m)),0),x,Se)<=C,_=i,R=y==="rotate"||y==="rotate-and-shrink"?(()=>{for(let x=0;x<=s;x+=1)if(A(i,x))return x;return s})():0,I=!1;for(y==="hide"&&!A(i,0)&&(I=!0);!I&&(y==="shrink"||y==="rotate-and-shrink")&&!A(_,R)&&_>o;)if(_=Math.max(o,_-oa),y==="rotate-and-shrink"){for(let x=0;x<=s;x+=1)if(A(_,x)){R=x;break}}let q=Math.max(...n.map(x=>Ge(x,_,m)),0),j=xt(q,_,R),Q=da(q,_,R),z=ca(e),$$1=I||n.length===0?0:j+b+je,V=$($({},z),L==="right"?{right:Math.max(z.right,$$1)}:L==="left"?{left:Math.max(z.left,$$1)}:L==="outside"||L===void 0?{left:Math.max(z.left,$$1),right:Math.max(z.right,$$1)}:{}),K=Ct(e),de=Mt(e),d=Number.parseFloat(String((G=(E=(F=(pe=e.theme)==null?void 0:pe.legends)==null?void 0:F.text)==null?void 0:E.fontSize)!=null?G:12)),c=ma(n,Number.isFinite(d)?d:12,m,Math.max(1,l-V.left-V.right)),g=gt(e,"chartHeightDistribution"),X=Math.max(Xe,u*g.start);return _t(e)&&R>0&&(e.labelPosition==="inside"||e.labelPosition===void 0)&&(V.top=Math.max(V.top,X,Q+je)),{nodeLabel:{fontSize:_,fontFamily:m,rotate:R,hide:I,labelHeight:Math.max(34,Math.ceil(Q+16)),labelContentHeight:Math.max(18,Math.ceil(_*1.2))},margin:V,dynamicLegend:K,dynamicLegendPadding:de,legendItemWidth:c.itemWidth,legendDirection:c.direction,legendHeight:c.height}},et=(e,t)=>Math.ceil(Ge(e,t.fontSize,t.fontFamily)+ia);var At=e=>Number.isFinite(e)?Math.max(0,e!=null?e:8):8,It=e=>{let t=e==null?void 0:e.fontSize;return typeof t=="number"?t:Number.parseFloat(t!=null?t:"12")||12},Nt=(e,t)=>{var n;if(!((n=t.columnHeaders)!=null&&n.length))return e;let a=It(t.columnHeaderTextTheme),r=At(t.columnHeaderGap);return S($({},e),{top:Math.max(e.top,Math.ceil(a+r+4))})},Rt=({nodes:e},{columnHeaders:t,columnHeaderGap:a,columnHeaderTextTheme:r,layout:n="horizontal"})=>{if(!(t!=null&&t.length)||n!=="horizontal"||e.length===0)return null;let l=At(a),u=Math.ceil(It(r)*.2),i=Array.from(new Map([...e].sort((o,s)=>o.x0-s.x0).map(o=>[o.x0,o])).values());return react.exports.createElement(react.exports.Fragment,null,...i.slice(0,t.length).map((o,s)=>{var y,m,h;return react.exports.createElement("text",{key:`column-header-${s}`,x:(o.x0+o.x1)/2,y:-(l+u),textAnchor:"middle",fill:(y=r==null?void 0:r.fill)!=null?y:"var(--base-text-default)",fontFamily:r==null?void 0:r.fontFamily,fontSize:(m=r==null?void 0:r.fontSize)!=null?m:12,fontWeight:(h=r==null?void 0:r.fontWeight)!=null?h:600,pointerEvents:"none"},t[s])}))};function fe(e){return function(){return e}}var tt=Math.PI,at=2*tt,ge=1e-6,ha=at-ge;function Ot(e){this._+=e[0];for(let t=1,a=e.length;t<a;++t)this._+=arguments[t]+e[t];}function ba(e){let t=Math.floor(e);if(!(t>=0))throw new Error(`invalid digits: ${e}`);if(t>15)return Ot;let a=10**t;return function(r){this._+=r[0];for(let n=1,l=r.length;n<l;++n)this._+=Math.round(arguments[n]*a)/a+r[n];}}var xe=class{constructor(t){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=t==null?Ot:ba(t);}moveTo(t,a){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+a}`;}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`);}lineTo(t,a){this._append`L${this._x1=+t},${this._y1=+a}`;}quadraticCurveTo(t,a,r,n){this._append`Q${+t},${+a},${this._x1=+r},${this._y1=+n}`;}bezierCurveTo(t,a,r,n,l,u){this._append`C${+t},${+a},${+r},${+n},${this._x1=+l},${this._y1=+u}`;}arcTo(t,a,r,n,l){if(t=+t,a=+a,r=+r,n=+n,l=+l,l<0)throw new Error(`negative radius: ${l}`);let u=this._x1,i=this._y1,o=r-t,s=n-a,y=u-t,m=i-a,h=y*y+m*m;if(this._x1===null)this._append`M${this._x1=t},${this._y1=a}`;else if(h>ge)if(!(Math.abs(m*o-s*y)>ge)||!l)this._append`L${this._x1=t},${this._y1=a}`;else {let L=r-u,f=n-i,S=o*o+s*s,b=L*L+f*f,C=Math.sqrt(S),A=Math.sqrt(h),_=l*Math.tan((tt-Math.acos((S+h-b)/(2*C*A)))/2),R=_/A,I=_/C;Math.abs(R-1)>ge&&this._append`L${t+R*y},${a+R*m}`,this._append`A${l},${l},0,0,${+(m*L>y*f)},${this._x1=t+I*o},${this._y1=a+I*s}`;}}arc(t,a,r,n,l,u){if(t=+t,a=+a,r=+r,u=!!u,r<0)throw new Error(`negative radius: ${r}`);let i=r*Math.cos(n),o=r*Math.sin(n),s=t+i,y=a+o,m=1^u,h=u?n-l:l-n;this._x1===null?this._append`M${s},${y}`:(Math.abs(this._x1-s)>ge||Math.abs(this._y1-y)>ge)&&this._append`L${s},${y}`,r&&(h<0&&(h=h%at+at),h>ha?this._append`A${r},${r},0,1,${m},${t-i},${a-o}A${r},${r},0,1,${m},${this._x1=s},${this._y1=y}`:h>ge&&this._append`A${r},${r},0,${+(h>=tt)},${m},${this._x1=t+r*Math.cos(l)},${this._y1=a+r*Math.sin(l)}`);}rect(t,a,r,n){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+a}h${r=+r}v${+n}h${-r}Z`;}toString(){return this._}};function $t(e){let t=3;return e.digits=function(a){if(!arguments.length)return t;if(a==null)t=null;else {let r=Math.floor(a);if(!(r>=0))throw new RangeError(`invalid digits: ${a}`);t=r;}return e},()=>new xe(t)}function wt(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function Pt(e){this._context=e;}Pt.prototype={areaStart:function(){this._line=0;},areaEnd:function(){this._line=NaN;},lineStart:function(){this._point=0;},lineEnd:function(){(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line;},point:function(e,t){switch(e=+e,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(e,t):this._context.moveTo(e,t);break;case 1:this._point=2;default:this._context.lineTo(e,t);break}}};function Dt(e){return new Pt(e)}function Ft(e){return e[0]}function Bt(e){return e[1]}function Ke(e,t){var a=fe(!0),r=null,n=Dt,l=null,u=$t(i);e=typeof e=="function"?e:e===void 0?Ft:fe(e),t=typeof t=="function"?t:t===void 0?Bt:fe(t);function i(o){var s,y=(o=wt(o)).length,m,h=!1,L;for(r==null&&(l=n(L=u())),s=0;s<=y;++s)!(s<y&&a(m=o[s],s,o))===h&&((h=!h)?l.lineStart():l.lineEnd()),h&&l.point(+e(m,s,o),+t(m,s,o));if(L)return l=null,L+""||null}return i.x=function(o){return arguments.length?(e=typeof o=="function"?o:fe(+o),i):e},i.y=function(o){return arguments.length?(t=typeof o=="function"?o:fe(+o),i):t},i.defined=function(o){return arguments.length?(a=typeof o=="function"?o:fe(!!o),i):a},i.curve=function(o){return arguments.length?(n=o,r!=null&&(l=n(r)),i):n},i.context=function(o){return arguments.length?(o==null?r=l=null:l=n(r=o),i):r},i}function zt(e){return e<0?-1:1}function Wt(e,t,a){var r=e._x1-e._x0,n=t-e._x1,l=(e._y1-e._y0)/(r||n<0&&-0),u=(a-e._y1)/(n||r<0&&-0),i=(l*n+u*r)/(r+n);return (zt(l)+zt(u))*Math.min(Math.abs(l),Math.abs(u),.5*Math.abs(i))||0}function Et(e,t){var a=e._x1-e._x0;return a?(3*(e._y1-e._y0)/a-t)/2:t}function rt(e,t,a){var r=e._x0,n=e._y0,l=e._x1,u=e._y1,i=(l-r)/3;e._context.bezierCurveTo(r+i,n+i*t,l-i,u-i*a,l,u);}function Ue(e){this._context=e;}Ue.prototype={areaStart:function(){this._line=0;},areaEnd:function(){this._line=NaN;},lineStart:function(){this._x0=this._x1=this._y0=this._y1=this._t0=NaN,this._point=0;},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x1,this._y1);break;case 3:rt(this,this._t0,Et(this,this._t0));break}(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line;},point:function(e,t){var a=NaN;if(e=+e,t=+t,!(e===this._x1&&t===this._y1)){switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(e,t):this._context.moveTo(e,t);break;case 1:this._point=2;break;case 2:this._point=3,rt(this,Et(this,a=Wt(this,e,t)),a);break;default:rt(this,this._t0,a=Wt(this,e,t));break}this._x0=this._x1,this._x1=e,this._y0=this._y1,this._y1=t,this._t0=a;}}};function Gt(e){this._context=new Vt(e);}(Gt.prototype=Object.create(Ue.prototype)).point=function(e,t){Ue.prototype.point.call(this,t,e);};function Vt(e){this._context=e;}Vt.prototype={moveTo:function(e,t){this._context.moveTo(t,e);},closePath:function(){this._context.closePath();},lineTo:function(e,t){this._context.lineTo(t,e);},bezierCurveTo:function(e,t,a,r,n,l){this._context.bezierCurveTo(t,e,r,a,l,n);}};function nt(e){return new Ue(e)}function ot(e){return new Gt(e)}var xa=({x:e,node:t,children:a})=>{let{animate:r,config:n}=Zr(),l=useSpring({x:e,y:t.y,height:t.height,config:n,immediate:!r});return react.exports.createElement(animated.g,{transform:to([l.x,l.y,l.height],(u,i,o)=>`translate(${u-e}, ${i+o/2-t.y-t.height/2})`)},a)},Kt=({nodes:e},{activeLabelFontWeight:t="var(--hbr-font-weight-semibold)",activeNodeIds:a=[],centerMiddleColumnLabels:r=!1,enableActiveLabelEmphasis:n=!1,labelOrientation:l="horizontal",labelPosition:u="outside",labelPadding:i=0,labelTextOutlineColor:o="var(--positive-border-weak-default)",labelTextOutlineWidth:s=1,labelTextColor:y="var(--base-text-strong-default)",labelWidth:m="auto",labelHeight:h=34,labelContentWidth:L="auto",labelContentHeight:f=18,isFocusable:S$1=!0,labelRender:b,labelEvents:C,autoSizePlan:A})=>{let _=react.exports.useRef({}),R=react.exports.useMemo(()=>{if(e.length===0)return 0;let d=Math.min(...e.map(g=>g.x0)),c=Math.max(...e.map(g=>g.x1));return (d+c)/2},[e]),I=react.exports.useMemo(()=>Array.from(new Set(e.map(d=>d.x0))).sort((d,c)=>d-c),[e]),q=I[0],j=I[I.length-1],Q=I.length,z=react.exports.useCallback(d=>{if(u==="left"||u==="right")return u;let g=(d.x0+d.x1)/2>=R;return u==="outside"?r&&Q>2?d.x0===q?"left":d.x0===j?"right":"inside":g?"right":"left":g?"left":"right"},[R,r,Q,q,u,j]),$$1=react.exports.useCallback((d,c=0)=>{let g=z(d);return g==="inside"?(d.x0+d.x1-c)/2:g==="left"?d.x0-c-i:d.x1+i},[z,i]),V=react.exports.useCallback(d=>{var c;if(A)return S($({},A.nodeLabel),{rotate:z(d)==="right"?Math.abs(A.nodeLabel.rotate):z(d)==="left"?-Math.abs(A.nodeLabel.rotate):0,width:et(String((c=d.label)!=null?c:d.id),A.nodeLabel)})},[A,z]),K=react.exports.useMemo(()=>{if(!o||s<=0)return;let d=`${s}px`,c=`-${d}`;return `
			${d} 0 0 ${o},
			${c} 0 0 ${o},
			0 ${d} 0 ${o},
			0 ${c} 0 ${o},
			${d} ${d} 0 ${o},
			${c} ${c} 0 ${o},
			${d} ${c} 0 ${o},
			${c} ${d} 0 ${o}
		`},[o,s]);react.exports.useEffect(()=>{let d=new ResizeObserver(c=>{var g,X,v,H;for(let D of c){let Y=D.target.closest("foreignObject"),{offsetWidth:ee}=D.target,ae=D.target.getAttribute("nid"),Z=e.find(te=>te.id===ae);if(!Y||!Z)continue;let T=V(Z);m==="auto"&&Y.setAttribute("width",String((g=T==null?void 0:T.width)!=null?g:ee)),Y.setAttribute("height",String((X=T==null?void 0:T.labelHeight)!=null?X:h)),Y.setAttribute("y",String((Z.y0+Z.y1-((v=T==null?void 0:T.labelHeight)!=null?v:h))/2)),Y.setAttribute("x",String($$1(Z,m==="auto"?(H=T==null?void 0:T.width)!=null?H:ee:m)));}});return Object.values(_.current).forEach(c=>{c&&d.observe(c);}),()=>{d.disconnect();}},[V,$$1,h,m,e]);let de=e.map(d=>{var ee,ae,Z,T,te,ye,pe;let c=V(d),g=(ee=c==null?void 0:c.labelHeight)!=null?ee:h,X=m==="auto"?c==null?void 0:c.width:m,v=$$1(d,X!=null?X:0),H=(d.y1+d.y0)/2-g/2,D=b?b(d,react.exports.createElement,C):react.exports.createElement("foreignObject",S($({key:d.id,x:v,y:H,height:g},X!==void 0&&{width:X}),{style:A?{overflow:"visible"}:void 0,tabIndex:S$1?0:void 0,"aria-label":String((ae=d.label)!=null?ae:d.id)}),react.exports.createElement("div",{className:"--sankey-label",style:{fontFamily:c==null?void 0:c.fontFamily,fontSize:(Z=c==null?void 0:c.fontSize)!=null?Z:12,fontWeight:n&&a.includes(d.id)?t:void 0,width:L==="auto"?"auto":`${L}px`,height:`${(T=c==null?void 0:c.labelContentHeight)!=null?T:f}px`,boxSizing:"border-box",margin:`${(g-((te=c==null?void 0:c.labelContentHeight)!=null?te:f))/2}px 0`,textShadow:K,writingMode:l==="vertical"?"vertical-lr":"horizontal-tb",transform:c!=null&&c.rotate?`rotate(${c.rotate}deg)`:void 0,transformOrigin:"center center",display:c!=null&&c.hide?"none":"inline-flex",color:typeof y=="function"?y(d):y},nid:d.id,ref:F=>{_.current[d.id]=F;}},d.label)),Y=!C||!react.exports.isValidElement(D)?D:react.exports.cloneElement(D,{style:S($({},D.props.style),{cursor:"default",pointerEvents:"auto"}),tabIndex:S$1?0:void 0,"aria-label":(pe=D.props["aria-label"])!=null?pe:String((ye=d.label)!=null?ye:d.id),onFocus:F=>{var E,G,x;(G=(E=D.props).onFocus)==null||G.call(E,F),(x=C.onFocus)==null||x.call(C,d,F);},onBlur:F=>{var E,G,x;(G=(E=D.props).onBlur)==null||G.call(E,F),(x=C.onBlur)==null||x.call(C,d,F);},onMouseEnter:F=>{var E,G,x;(G=(E=D.props).onMouseEnter)==null||G.call(E,F),(x=C.onMouseEnter)==null||x.call(C,d,F);},onMouseLeave:F=>{var E,G,x;(G=(E=D.props).onMouseLeave)==null||G.call(E,F),(x=C.onMouseLeave)==null||x.call(C,d,F);}});return react.exports.createElement(xa,{key:d.id,x:v,node:d},Y)});return react.exports.createElement("g",{},de)};var Ca=(e,t)=>{var i;let r=Math.max(1,e.thickness-t*2)/2,l=(e.target.x0-e.source.x1)*.12,u=[[e.source.x1,e.pos0-r],[e.source.x1+l,e.pos0-r],[e.target.x0-l,e.pos1-r],[e.target.x0,e.pos1-r],[e.target.x0,e.pos1+r],[e.target.x0-l,e.pos1+r],[e.source.x1+l,e.pos0+r],[e.source.x1,e.pos0+r],[e.source.x1,e.pos0-r]];return `${(i=Ke().curve(nt)(u))!=null?i:""}Z`},_a=(e,t)=>{var i;let r=Math.max(1,e.thickness-t*2)/2,l=(e.target.y0-e.source.y1)*.12,u=[[e.pos0+r,e.source.y1],[e.pos0+r,e.source.y1+l],[e.pos1+r,e.target.y0-l],[e.pos1+r,e.target.y0],[e.pos1-r,e.target.y0],[e.pos1-r,e.target.y0-l],[e.pos0-r,e.source.y1+l],[e.pos0-r,e.source.y1],[e.pos0+r,e.source.y1]];return `${(i=Ke().curve(ot)(u))!=null?i:""}Z`},Ma=(e,t,a)=>t==="vertical"?_a(e,a):Ca(e,a),Aa=(e,t)=>{if(!e)return new Set;let a=new Set([String(e.id)]);return t.filter(({source:r,target:n})=>String(r.id)===String(e.id)||String(n.id)===String(e.id)).forEach(({source:r,target:n})=>{a.add(String(r.id)),a.add(String(n.id));}),a},Ia=e=>{let t=e.target;if(!t)return;let a=e.key==="ArrowLeft"||e.key==="ArrowUp"?t.previousElementSibling:e.key==="ArrowRight"||e.key==="ArrowDown"?t.nextElementSibling:t;(a&&typeof a.focus=="function"?a:t).focus();},Ut=(e,t)=>typeof t=="function"?t(e):typeof t=="string"?t:e.color,Na=({ariaDisabled:e,ariaHidden:t,ariaLabel:a,ariaLabelledBy:r,ariaDescribedBy:n,borderColor:l,borderRadius:u,borderWidth:i,color:o,isFocusable:s,isInteractive:y,node:m,opacity:h,onBlur:L,onClick:f,onFocus:S,onKeyDown:b,onKeyUp:C,onMouseEnter:A,onMouseLeave:_,onMouseMove:R,tooltip:I})=>{let{hideTooltip:q,showTooltipFromEvent:j}=k(),{animate:Q,config:z}=Zr(),$=useSpring({x:m.x,y:m.y,width:m.width,height:m.height,color:o,opacity:h,config:z,immediate:!Q}),V=d=>{I&&j(react.exports.createElement(I,{node:m}),d,"left"),A==null||A(m,d);},K=d=>{I&&j(react.exports.createElement(I,{node:m}),d,"left"),R==null||R(m,d);},de=d=>{q(),_==null||_(m,d);};return react.exports.createElement(animated.rect,{x:$.x,y:$.y,rx:u,ry:u,width:$.width.to(d=>Math.max(d,0)),height:$.height.to(d=>Math.max(d,0)),fill:$.color,fillOpacity:$.opacity,strokeWidth:i,stroke:l,strokeOpacity:$.opacity,onMouseEnter:y?V:void 0,onMouseMove:y?K:void 0,onMouseLeave:y?de:void 0,onClick:y?d=>f==null?void 0:f(m,d):void 0,onKeyDown:y&&s?d=>b==null?void 0:b(m,d):void 0,onKeyUp:y&&s?d=>C==null?void 0:C(m,d):void 0,onFocus:y&&s?d=>S==null?void 0:S(m,d):void 0,onBlur:y&&s?d=>L==null?void 0:L(m,d):void 0,tabIndex:s?0:void 0,"aria-label":a==null?void 0:a(m),"aria-labelledby":r==null?void 0:r(m),"aria-describedby":n==null?void 0:n(m),"aria-disabled":e==null?void 0:e(m),"aria-hidden":t==null?void 0:t(m)})},Ra=({ariaDisabled:e,ariaHidden:t,ariaLabel:a,ariaLabelledBy:r,ariaDescribedBy:n,blendMode:l,color:u,enableGradient:i,isFocusable:o,isInteractive:s,link:y,opacity:m,path:h,onBlur:L,onClick:f,onFocus:S,onKeyDown:b,onKeyUp:C,onMouseEnter:A,onMouseLeave:_,onMouseMove:R,tooltip:I})=>{let{hideTooltip:q,showTooltipFromEvent:j}=k(),{animate:Q,config:z}=Zr(),$=$r(h),V=useSpring({color:u,opacity:m,config:z,immediate:!Q}),K=i?`url("#${encodeURI(`${y.source.id}.${y.target.id}.${y.index}`)}")`:V.color,de=g=>{I&&j(react.exports.createElement(I,{link:y}),g,"left"),A==null||A(y,g);},d=g=>{I&&j(react.exports.createElement(I,{link:y}),g,"left"),R==null||R(y,g);},c=g=>{q(),_==null||_(y,g);};return react.exports.createElement(animated.path,{fill:K,d:$,fillOpacity:V.opacity,onMouseEnter:s?de:void 0,onMouseMove:s?d:void 0,onMouseLeave:s?c:void 0,onClick:s?g=>f==null?void 0:f(y,g):void 0,onKeyDown:s&&o?g=>b==null?void 0:b(y,g):void 0,onKeyUp:s&&o?g=>C==null?void 0:C(y,g):void 0,onFocus:s&&o?g=>S==null?void 0:S(y,g):void 0,onBlur:s&&o?g=>L==null?void 0:L(y,g):void 0,style:{mixBlendMode:l},tabIndex:o?0:void 0,"aria-label":a==null?void 0:a(y),"aria-labelledby":r==null?void 0:r(y),"aria-describedby":n==null?void 0:n(y),"aria-disabled":e==null?void 0:e(y),"aria-hidden":t==null?void 0:t(y)})},Oa=({activeNodeIds:e,activeLabelFontWeight:t,autoSizePlan:a,centerMiddleColumnLabels:r,enableActiveLabelEmphasis:n,labelOrientation:l,labelPadding:u,labelPosition:i,labelWidth:o,labelHeight:s,labelContentWidth:y,labelContentHeight:m,labelRender:h,labelEvents:L,labelTextColor:f,labelTextOutlineColor:S,labelTextOutlineWidth:b,isFocusable:C,nodes:A,links:_})=>Kt({nodes:A,links:_},{activeLabelFontWeight:t,autoSizePlan:a,activeNodeIds:e,centerMiddleColumnLabels:r,enableActiveLabelEmphasis:n,labelOrientation:l,labelPadding:u,labelPosition:i,labelWidth:o,labelHeight:s,labelContentWidth:y,labelContentHeight:m,labelRender:h,labelEvents:L,labelTextColor:f,labelTextOutlineColor:S,labelTextOutlineWidth:b,isFocusable:C}),qt=({nodes:e,links:t},{activeLabelFontWeight:a,activeLabelEmphasisScope:r="hovered",autoSizePlan:n,centerMiddleColumnLabels:l=!1,color:u,enableActiveLabelEmphasis:i,enableLabel:o=!0,enableLinkGradient:s=!0,labelOrientation:y="horizontal",labelPadding:m=0,labelPosition:h="outside",labelWidth:L="auto",labelHeight:f=34,labelContentWidth:S="auto",labelContentHeight:b=18,labelRender:C,labelTextColor:A,labelTextOutlineColor:_,labelTextOutlineWidth:R,layout:I="horizontal",linkBlendMode:q="multiply",linkContract:j=0,linkHoverOpacity:Q=.6,linkOpacity:z=.25,linkTooltip:$,unrelatedItemOpacity:V=.3,unrelatedNodeColor:K,unrelatedNodeOpacity:de=1,nodeAriaDisabled:d,nodeAriaHidden:c,nodeAriaLabel:g,nodeAriaLabelledBy:X,nodeAriaDescribedBy:v,nodeBorderColor:H,nodeBorderRadius:D=2,nodeBorderWidth:Y=1,nodeHoverOpacity:ee=1,nodeOpacity:ae=1,nodeTooltip:Z,isFocusable:T=!0,isInteractive:te=!0,linkAriaDisabled:ye,linkAriaHidden:pe,linkAriaLabel:F,linkAriaLabelledBy:E,linkAriaDescribedBy:G,onBlur:x,onClick:Se,onFocus:J,onKeyDown:_e,onKeyUp:Le,onMouseEnter:re,onMouseLeave:ne,onMouseMove:me})=>{let[ue,Me]=react.exports.useState(null),[oe,Ae]=react.exports.useState(null),Ie=Aa(ue,t),$e=oe?[String(oe.source.id),String(oe.target.id)]:ue&&r==="related"?Array.from(Ie):ue?[String(ue.id)]:[],se=!!(ue||oe),Ce=p=>oe?String(p.id)===String(oe.source.id)||String(p.id)===String(oe.target.id):Ie.has(String(p.id)),ce=p=>oe?p.index===oe.index:ue!==null&&(String(p.source.id)===String(ue.id)||String(p.target.id)===String(ue.id)),we=p=>typeof K=="function"?K(p):K!=null?K:p.color,Pe=p=>se&&!Ce(p)?we(p):p.color,De=p=>se&&!ce(p)?u:p.color,Fe=p=>se?Ce(p)?ee:de:ae,Be=p=>se?ce(p)?Q:V:z,ie=p=>{Me(p),Ae(null);},he=p=>{Ae(p),Me(null);},Ne=(p,k)=>{Ia(k),Le==null||Le(p,k);};return react.exports.createElement(react.exports.Fragment,null,react.exports.createElement("defs",null,...t.filter(p=>s&&(!se||ce(p))).map(p=>{let k=`${p.source.id}.${p.target.id}.${p.index}`;return react.exports.createElement("linearGradient",{key:k,id:k,spreadMethod:"pad",x1:"0%",x2:I==="horizontal"?"100%":"0%",y1:"0%",y2:I==="horizontal"?"0%":"100%"},react.exports.createElement("stop",{offset:"0%",stopColor:p.startColor||p.source.color}),react.exports.createElement("stop",{offset:"100%",stopColor:p.endColor||p.target.color}))})),...t.map(p=>react.exports.createElement(Ra,{key:`link-${p.source.id}-${p.target.id}-${p.index}`,ariaDisabled:ye,ariaHidden:pe,ariaLabel:F,ariaLabelledBy:E,ariaDescribedBy:G,blendMode:se&&!ce(p)?"normal":q,color:De(p),enableGradient:s&&(!se||ce(p)),isFocusable:T,isInteractive:te,link:p,opacity:Be(p),path:Ma(p,I,j),onBlur:(k,P)=>{he(null),x==null||x(k,P);},onClick:Se,onFocus:(k,P)=>{he(k),J==null||J(k,P);},onKeyDown:_e,onKeyUp:Ne,onMouseEnter:(k,P)=>{he(k),re==null||re(k,P);},onMouseLeave:(k,P)=>{he(null),ne==null||ne(k,P);},onMouseMove:(k,P)=>{he(k),me==null||me(k,P);},tooltip:$})),...e.map(p=>react.exports.createElement(Na,{key:`node-${p.id}`,ariaDisabled:d,ariaHidden:c,ariaLabel:g,ariaLabelledBy:X,ariaDescribedBy:v,borderColor:se&&!Ce(p)?Ut(p,K!=null?K:H):Ut(p,H),borderRadius:D,borderWidth:Y,color:Pe(p),isFocusable:T,isInteractive:te,node:p,opacity:Fe(p),onBlur:(k,P)=>{ie(null),x==null||x(k,P);},onClick:Se,onFocus:(k,P)=>{ie(k),J==null||J(k,P);},onKeyDown:_e,onKeyUp:Ne,onMouseEnter:(k,P)=>{ie(k),re==null||re(k,P);},onMouseLeave:(k,P)=>{ie(null),ne==null||ne(k,P);},onMouseMove:(k,P)=>{ie(k),me==null||me(k,P);},tooltip:Z})),o?react.exports.createElement(Oa,{autoSizePlan:n,activeLabelFontWeight:a,activeNodeIds:$e,centerMiddleColumnLabels:l,enableActiveLabelEmphasis:i,labelOrientation:y,labelPadding:m,labelPosition:h,labelWidth:L,labelHeight:f,labelContentWidth:S,labelContentHeight:b,labelRender:C,labelEvents:{onBlur:(p,k)=>{ie(null),x==null||x(p,k);},onFocus:(p,k)=>{ie(p),J==null||J(p,k);},onMouseEnter:(p,k)=>{ie(p),re==null||re(p,k);},onMouseLeave:(p,k)=>{ie(null),ne==null||ne(p,k);}},labelTextColor:A,labelTextOutlineColor:_,labelTextOutlineWidth:R,isFocusable:T,links:t,nodes:e}):null)};var $a=e=>{let t=Et$1();return qt(e,t.__harborCategoricalSankeyLayerConfig)},wa=(e,t,a)=>{var u;if(!e.autoSize||typeof e.autoSize=="object"&&(e.autoSize.dynamicHeightMargin===!1||e.autoSize.dynamicLegend===!1))return t;let r=a[0];if((r==null?void 0:r.anchor)!=="bottom")return t;let n=typeof r.translateY=="number"?r.translateY:60,l=typeof((u=e.margin)==null?void 0:u.bottom)=="number";return S($({},t),{bottom:l?Math.max(t.bottom,n):n})};function Pa(e){if(typeof e.labelTextColor=="string"||typeof e.labelTextColor=="function")return e.labelTextColor}function Qt(e,{legendsEventHandlers:t,itemsEventHandlers:a},r={}){var d,c,g,X,v,H,D$1,Y,ee,ae,Z,T,te,ye,pe,F,E,G,x,Se,J,_e,Le,re,ne,me,ue,Me,oe,Ae,Ie,$e,se,Ce,ce,we,Pe,De,Fe,Be,ie,he,Ne,p,k,P,lt,ut;let n=He(e,r),l=Oe(n?S($($({},e),r.width?{width:r.width}:{}),{margin:n.margin}):e,t,n),u=l[0],i=Array.isArray(e.legends)&&e.legends.length===0?{top:10,bottom:10,left:60,right:70}:be,o=e.enableMarginOverride===!1?i:$($({},i),e.margin),s=wa(e,(d=n==null?void 0:n.margin)!=null?d:o,l),y=Number.isFinite(e.columnHeaderGap)?Math.max(0,(c=e.columnHeaderGap)!=null?c:8):8,m=Nt(s,{columnHeaders:e.columnHeaders,columnHeaderGap:y,columnHeaderTextTheme:(X=(g=e.theme)==null?void 0:g.columnHeaders)==null?void 0:X.text}),h=Pa(e),L=(v=e==null?void 0:e.unrelatedItemColor)!=null?v:"var(--control-border-default)",f=(H=e==null?void 0:e.unrelatedItemOpacity)!=null?H:.3,S$1=(D$1=e==null?void 0:e.unrelatedNodeOpacity)!=null?D$1:1,b=(M,N)=>{var O,U;(O=e.onClick)==null||O.call(e,M,N),(U=a==null?void 0:a.onClick)==null||U.call(a,M,N);},C=(M,N)=>{var O,U;(O=e.onMouseEnter)==null||O.call(e,M,N),(U=a==null?void 0:a.onMouseEnter)==null||U.call(a,M,N);},A=(M,N)=>{var O,U;(O=e.onMouseLeave)==null||O.call(e,M,N),(U=a==null?void 0:a.onMouseLeave)==null||U.call(a,M,N);},_=(M,N)=>{var O,U;(O=e.onMouseMove)==null||O.call(e,M,N),(U=a==null?void 0:a.onMouseMove)==null||U.call(a,M,N);},R=(M,N)=>{var O,U;(O=e.onFocus)==null||O.call(e,M,N),(U=a==null?void 0:a.onFocus)==null||U.call(a,M,N);},I=(M,N)=>{var O,U;(O=e.onBlur)==null||O.call(e,M,N),(U=a==null?void 0:a.onBlur)==null||U.call(a,M,N);},q=(M,N)=>{var O;(O=e.onKeyUp)==null||O.call(e,M,N);},j=M=>{var N;return e.nodeTooltip?e.nodeTooltip(M):(N=a==null?void 0:a.nodeTooltip)==null?void 0:N.call(a,M)},Q=M=>{var N;return e.linkTooltip?e.linkTooltip(M):(N=a==null?void 0:a.linkTooltip)==null?void 0:N.call(a,M)},z=(Y=e.nodeAriaLabel)!=null?Y:M=>String(M.id),$$1=(ee=e.linkAriaLabel)!=null?ee:M=>`${M.source.id} -> ${M.target.id}`,V={autoSizePlan:n,activeLabelFontWeight:e.activeLabelFontWeight,activeLabelEmphasisScope:e.activeLabelEmphasisScope,centerMiddleColumnLabels:(ae=e.centerMiddleColumnLabels)!=null?ae:!1,color:L,unrelatedItemOpacity:f,unrelatedNodeColor:e.unrelatedNodeColor,unrelatedNodeOpacity:S$1,enableActiveLabelEmphasis:(Z=e.enableActiveLabelEmphasis)!=null?Z:!0,enableLabel:e.enableLabel!==!1,enableLinkGradient:(T=e.enableLinkGradient)!=null?T:!0,labelOrientation:(te=e.labelOrientation)!=null?te:"horizontal",labelPadding:(ye=e.labelPadding)!=null?ye:0,labelPosition:(pe=e.labelPosition)!=null?pe:"outside",labelWidth:(F=e.labelWidth)!=null?F:"auto",labelHeight:(E=e.labelHeight)!=null?E:34,labelContentWidth:(G=e.labelContentWidth)!=null?G:"auto",labelContentHeight:(x=e.labelContentHeight)!=null?x:18,labelRender:e.labelRender,labelTextColor:h,labelTextOutlineColor:e.labelTextOutlineColor,labelTextOutlineWidth:e.labelTextOutlineWidth,layout:e.layout,linkBlendMode:e.linkBlendMode,linkContract:e.linkContract,linkHoverOpacity:(Se=e.linkHoverOpacity)!=null?Se:.6,linkHoverOthersOpacity:(J=e.linkHoverOthersOpacity)!=null?J:1,linkOpacity:(_e=e.linkOpacity)!=null?_e:.3,linkTooltip:Q,linkAriaDisabled:e.linkAriaDisabled,linkAriaHidden:e.linkAriaHidden,linkAriaLabel:$$1,linkAriaLabelledBy:e.linkAriaLabelledBy,linkAriaDescribedBy:e.linkAriaDescribedBy,nodeAriaDisabled:e.nodeAriaDisabled,nodeAriaHidden:e.nodeAriaHidden,nodeAriaLabel:z,nodeAriaLabelledBy:e.nodeAriaLabelledBy,nodeAriaDescribedBy:e.nodeAriaDescribedBy,nodeBorderColor:e.nodeBorderColor,nodeBorderRadius:(Le=e.nodeBorderRadius)!=null?Le:2,nodeBorderWidth:(re=e.nodeBorderWidth)!=null?re:1,nodeHoverOpacity:(ne=e.nodeHoverOpacity)!=null?ne:1,nodeHoverOthersOpacity:(me=e.nodeHoverOthersOpacity)!=null?me:1,nodeOpacity:(ue=e.nodeOpacity)!=null?ue:1,nodeTooltip:j,isFocusable:(Me=e.isFocusable)!=null?Me:!0,isInteractive:(oe=e.isInteractive)!=null?oe:!0,onBlur:I,onClick:b,onFocus:R,onKeyDown:e.onKeyDown,onKeyUp:q,onMouseEnter:C,onMouseLeave:A,onMouseMove:_},K=S($({},ze),{__harborCategoricalSankeyLayerConfig:V});return {nodeThickness:(Ae=e==null?void 0:e.nodeThickness)!=null?Ae:4,nodeSpacing:Math.max((Ie=e==null?void 0:e.nodeSpacing)!=null?Ie:12,12),nodeOpacity:($e=e==null?void 0:e.nodeOpacity)!=null?$e:1,linkOpacity:(se=e==null?void 0:e.linkOpacity)!=null?se:.3,unrelatedItemOpacity:f,nodeHoverOthersOpacity:(Ce=e==null?void 0:e.nodeHoverOthersOpacity)!=null?Ce:1,linkHoverOthersOpacity:(ce=e==null?void 0:e.linkHoverOthersOpacity)!=null?ce:1,nodeBorderRadius:(we=e==null?void 0:e.nodeBorderRadius)!=null?we:2,nodeBorderWidth:(Pe=e==null?void 0:e.nodeBorderWidth)!=null?Pe:1,nodeBorderColor:(De=e==null?void 0:e.nodeBorderColor)!=null?De:M=>M.color,enableActiveLabelEmphasis:(Fe=e==null?void 0:e.enableActiveLabelEmphasis)!=null?Fe:!0,enableClickSelection:(Be=e==null?void 0:e.enableClickSelection)!=null?Be:!0,enableLinkGradient:(ie=e==null?void 0:e.enableLinkGradient)!=null?ie:!0,enableMarginOverride:(he=e==null?void 0:e.enableMarginOverride)!=null?he:!0,margin:m,colors:D((p=(Ne=e.data)==null?void 0:Ne.nodes)==null?void 0:p.length),role:"application",labelPosition:(k=e==null?void 0:e.labelPosition)!=null?k:"outside",labelPadding:(P=e==null?void 0:e.labelPadding)!=null?P:0,labelTextColor:(e==null?void 0:e.labelTextColor)||"var(--base-text-strong-default, #373C42)",labelOrientation:(lt=e==null?void 0:e.labelOrientation)!=null?lt:"horizontal",nodeAriaLabel:z,linkAriaLabel:$$1,layers:[$a,(ut=e.columnHeaders)!=null&&ut.length?M=>{var N,O;return Rt(M,{columnHeaders:e.columnHeaders,columnHeaderGap:y,columnHeaderTextTheme:(O=(N=e.theme)==null?void 0:N.columnHeaders)==null?void 0:O.text,layout:e.layout})}:null,n!=null&&n.dynamicLegend&&u?M=>{var N,O;return ct(M,{legend:u,isFocusable:(N=e.isFocusable)!=null?N:!0,isInteractive:(O=e.isInteractive)!=null?O:!0})}:"legends"],onClick:b,onMouseEnter:C,onMouseLeave:A,onMouseMove:_,onFocus:R,onBlur:I,nodeTooltip:j,linkTooltip:Q,legends:Oe(e,t),onKeyDown:e.onKeyDown,onKeyUp:q,theme:K}}var Vr=$({},it);

const generateSankeyDefaultTooltip = (datum, _event) => {
    if (datum.id) {
        return `<div class="--hbr-sankey-popover-entity">
      <div class="--hbr-sankey-popover-color" style="background:${datum.color}"></div>
      ${datum.id}
    </div>`;
    }
    return `<div class="--hbr-sankey-popover-entity">
      <table>
        <tr>
          <td>Source:</td>
          <td>
            <div class="--hbr-sankey-popover-color" style="background:${datum.source.color}"></div>
            ${datum.source.id}
          </td>
        </tr>
        <tr>
          <td>Target:</td>
          <td>
            <div class="--hbr-sankey-popover-color" style="background:${datum.target.color}"></div>
            ${datum.target.id}
          </td>
        </tr>
        <tr>
          <td>Value:</td>
          <td class="--hbr-sankey-popover-value">
            ${datum.value}
          </td>
        </tr>
      </table>
    </div>
  </div>`;
};
const generateSankeyLegendTooltip = (datum, _event) => {
    return `<div class="--hbr-sankey-popover-entity">
      <div class="--hbr-sankey-popover-color" style="background:${datum.color}"></div>
      ${datum.id}
    </div>`;
};
const generateSankeyDefaultTooltipCategorical = (datum) => {
    if (datum.id) {
        const renderLinkSection = (label, links, getNode) => {
            if (!(links === null || links === void 0 ? void 0 : links.length)) {
                return null;
            }
            return h("div", { class: { "--sankey-section": true } }, [
                h("span", { class: { "--semi-bold": true, "--sankey-section-title": true } }, label),
                h("hbr-layout", {
                    align: "stretch",
                    class: { "--sankey-section-list": true },
                    direction: "column",
                    display: "flex",
                    gap: "xs",
                }, links.map((link) => {
                    const node = getNode(link);
                    return h("hbr-layout", {
                        align: "center",
                        class: { "--sankey-section-row": true },
                        direction: "row",
                        display: "flex",
                        gap: "xs",
                        justify: "space-between",
                    }, [
                        h("span", { class: { "--sankey-item": true } }, [
                            h("span", {
                                class: { "--color-box": true },
                                style: { background: node.color },
                            }),
                            node.id,
                        ]),
                        h("span", { class: { "--sankey-value": true, "--bold": true } }, link.value),
                    ]);
                })),
            ]);
        };
        const sourceSection = renderLinkSection("Source", datum.targetLinks, (link) => link.source);
        const destinationSection = renderLinkSection("Destination", datum.sourceLinks, (link) => link.target);
        const hasDualSections = Boolean(sourceSection && destinationSection);
        return h("div", {
            class: {
                "--hbr-sankey-popover-entity-categorical": true,
                "--dual-sections": hasDualSections,
            },
        }, [
            h("hbr-layout", {
                align: "center",
                class: { "--sankey-summary": true },
                direction: "row",
                display: "flex",
                gap: "xs",
            }, [
                h("span", { class: { "--semi-bold": true, "--sankey-item": true } }, [
                    h("span", {
                        class: { "--color-box": true },
                        style: { background: datum.color },
                    }),
                    datum.id,
                ]),
                h("span", { class: { "--sankey-value": true, "--bold": true } }, datum.value),
            ]),
            h("hbr-divider", null),
            h("div", {
                class: {
                    "--sankey-sections": true,
                    "--dual": hasDualSections,
                },
            }, [sourceSection, destinationSection].filter(Boolean)),
        ]);
    }
    return `<div class="--hbr-sankey-popover-link-categorical">
      <div class="--sankey-link-flow">
        <div class="--sankey-item --semi-bold">
          <div class="--color-box" style="background:${datum.source.color}"></div>
          <span>${datum.source.id}</span>
        </div>
        <span class="--sankey-arrow" aria-hidden="true">→</span>
        <div class="--sankey-item --semi-bold">
          <div class="--color-box" style="background:${datum.target.color}"></div>
          <span>${datum.target.id}</span>
        </div>
      </div>
      <div class="--sankey-value --bold">${datum.value}</div>
    </div>`;
};
const showSankeyItemTooltip = (data, event, tooltipRef, customItemTooltip, isCategorical) => {
    var _a, _b;
    if (tooltipRef && isCategorical) {
        const hasDualSections = Boolean((data === null || data === void 0 ? void 0 : data.id) && ((_a = data === null || data === void 0 ? void 0 : data.targetLinks) === null || _a === void 0 ? void 0 : _a.length) && ((_b = data === null || data === void 0 ? void 0 : data.sourceLinks) === null || _b === void 0 ? void 0 : _b.length));
        const configuredWidthExpand = tooltipRef.getAttribute("data-sankey-width-expand") === "true";
        tooltipRef.widthExpand = hasDualSections || configuredWidthExpand;
    }
    showChartPopover(tooltipRef, data, event, customItemTooltip, isCategorical
        ? generateSankeyDefaultTooltipCategorical
        : generateSankeyDefaultTooltip);
};
const hideSankeyTooltip = (tooltipRef) => {
    hideChartPopover(tooltipRef);
};
const showSankeyLegendTooltip = (data, event, tooltipRef, legendTooltipFunc) => {
    if (event.target) {
        showChartPopover(tooltipRef, data, event, legendTooltipFunc, generateSankeyLegendTooltip);
    }
};
const convertSankeyDataToCSV = (data) => {
    let csv = "source,target,value\n";
    data.links.forEach((link) => {
        const { source, target, value } = link;
        csv += `${source},${target},${value}\n`;
    });
    return csv;
};

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}.--sankey-chart{flex-grow:1;overflow:hidden}.--sankey-chart .legend-event-rect{border-radius:1px}.--sankey-chart .legend-event-rect:focus-visible{border:4px solid var(--viz-color-neutral-100);outline:2px solid -webkit-focus-ring-color;outline-offset:2px}.--sankey-chart .legend-event-rect:focus:not(:focus-visible){border:0;outline:0;outline-offset:0}.--sankey-chart foreignObject[tabindex]:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-lg)}.--sankey-chart foreignObject[tabindex]:focus:not(:focus-visible){outline:0;box-shadow:none;outline-offset:0}.--sankey-chart rect[tabindex]:focus:not(:focus-visible),.--sankey-chart path[tabindex]:focus:not(:focus-visible){outline:0}.--sankey-chart .--sankey-legend-shape{pointer-events:none}.--sankey-chart .--sankey-label{font-size:var(--hbr-font-size-xs);white-space:nowrap;display:inline-flex;align-items:center;box-sizing:border-box;padding:0 8px}:host{--max-width:280px;--bg-color:var(--base-bg-weak-default);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal);--line-height:18px;--text-color:var(--base-text-medium-default);--padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);--shadow:var(--hbr-shadow-lg)}:host.categorical hbr-popover{--text-color:var(--base-text-default)}:host .--hbr-sankey-popover-entity{display:flex;align-items:center}:host .--hbr-sankey-popover-entity tr{display:flex;align-items:center;justify-items:center}:host .--hbr-sankey-popover-entity tr td{display:flex;align-items:center;justify-items:flex-start;min-width:48px}:host .--hbr-sankey-popover-entity tr{gap:var(--hbr-spacing-sm)}:host .--hbr-sankey-popover-entity .--hbr-sankey-popover-color{width:12px;height:12px;margin-right:var(--hbr-spacing-2xs)}:host .--hbr-sankey-popover-entity .--hbr-sankey-popover-value{font-weight:var(--hbr-font-weight-semibold, 600)}:host .--hbr-sankey-popover-entity-categorical{line-height:24px;min-width:0}:host .--hbr-sankey-popover-entity-categorical .--sankey-summary{width:100%;margin-bottom:var(--hbr-spacing-2xs)}:host .--hbr-sankey-popover-entity-categorical .--sankey-sections{display:block}:host .--hbr-sankey-popover-entity-categorical .--sankey-sections.--dual{display:flex;gap:var(--hbr-spacing-lg);align-items:start;width:100%}:host .--hbr-sankey-popover-entity-categorical .--sankey-sections.--dual .--sankey-section{flex:1 1 0}:host .--hbr-sankey-popover-entity-categorical .--sankey-section{min-width:0}:host .--hbr-sankey-popover-entity-categorical .--sankey-section:not(:last-child){margin-bottom:var(--hbr-spacing-sm)}:host .--hbr-sankey-popover-entity-categorical .--sankey-section-title{display:block;margin-bottom:var(--hbr-spacing-xs);font-weight:var(--hbr-font-weight-semibold)}:host .--hbr-sankey-popover-entity-categorical .--sankey-section-list{width:100%}:host .--hbr-sankey-popover-entity-categorical .--sankey-summary .--sankey-value{padding-left:var(--hbr-spacing-2xl);text-align:right;white-space:nowrap}:host .--hbr-sankey-popover-entity-categorical .--sankey-section-row .--sankey-value{text-align:right;white-space:nowrap}:host .--hbr-sankey-popover-entity-categorical .--sankey-item{display:flex;align-items:center}:host .--hbr-sankey-popover-entity-categorical .--sankey-item .--color-box{width:6px;height:16px;margin-right:8px;border-radius:var(--hbr-border-radius-pill);flex:none}:host .--hbr-sankey-popover-entity-categorical .--bold{font-weight:var(--hbr-font-weight-bold, 700)}:host .--hbr-sankey-popover-entity-categorical .--semi-bold{font-weight:var(--hbr-font-weight-semibold)}:host .--hbr-sankey-popover-link-categorical{display:flex;align-items:center;justify-content:space-between;gap:var(--hbr-spacing-lg);min-width:220px}:host .--hbr-sankey-popover-link-categorical .--sankey-link-flow{display:flex;align-items:center;gap:var(--hbr-spacing-sm);min-width:0;flex:1 1 auto}:host .--hbr-sankey-popover-link-categorical .--sankey-item{display:flex;align-items:center;min-width:0}:host .--hbr-sankey-popover-link-categorical .--sankey-item .--color-box{width:6px;height:16px;margin-right:8px;border-radius:var(--hbr-border-radius-pill);flex:none}:host .--hbr-sankey-popover-link-categorical .--sankey-item span{white-space:nowrap}:host .--hbr-sankey-popover-link-categorical .--sankey-arrow{color:var(--base-text-weak-default);font-weight:var(--hbr-font-weight-semibold, 600);flex:none}:host .--hbr-sankey-popover-link-categorical .--sankey-value{text-align:right;flex:none;min-width:32px}:host .--hbr-sankey-popover-link-categorical .--semi-bold{font-weight:var(--hbr-font-weight-semibold)}:host .--hbr-sankey-popover-link-categorical .--bold{font-weight:var(--hbr-font-weight-bold, 700)}:host .chart-sankey__header{display:flex;align-items:center;justify-content:space-between}:host .chart-sankey__header>:nth-child(2){display:flex}:host .chart-sankey__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}:host .--sankey-chart{flex-grow:1;min-width:0;overflow:hidden}:host .--sankey-chart.--categorical{min-width:244px}:host .--sankey-chart.--categorical svg{display:block;width:100%;max-width:100%;margin-inline:auto}";
const HbrSankeyChartStyle0 = styleCss;

const { getSankeyBaseConfig, getSankeyCategoricalConfig, getSankeyClickSelectionState, getSankeySelectionNodeIds, toggleSankeyItemClickSelection, updateSankeySelectionLabelState, } = Vr;
const removeSankeyColumnHeaderExtensions = (config) => {
    const nivoConfig = Object.assign({}, config);
    nivoConfig.columnHeaders = undefined;
    nivoConfig.columnHeaderGap = undefined;
    if (nivoConfig.theme) {
        const theme = Object.assign({}, nivoConfig.theme);
        theme.columnHeaders = undefined;
        nivoConfig.theme = theme;
    }
    return nivoConfig;
};
const defaultI18n = {
    noData: "No data to display",
    noDataCategorical: "No matching results",
};
const HbrSankeyChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrSankeyChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.selectedNodeIds = [];
        this.selectedSelectionState = null;
        this.pendingItemClickSelection = false;
        this.restoreSelectionFrame = null;
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.warnedAboutNivoTooltips = false;
        this.syncSankeySelectionDataAttributes = () => {
            var _a, _b;
            if (!this.chartRef) {
                return;
            }
            const data = this.config.data;
            const nodes = (_a = data === null || data === void 0 ? void 0 : data.nodes) !== null && _a !== void 0 ? _a : [];
            const links = (_b = data === null || data === void 0 ? void 0 : data.links) !== null && _b !== void 0 ? _b : [];
            const nodeElements = Array.from(this.chartRef.querySelectorAll("rect")).slice(0, nodes.length);
            const linkElements = Array.from(this.chartRef.querySelectorAll("path"));
            nodeElements.forEach((element, index) => {
                var _a;
                const nodeId = (_a = nodes[index]) === null || _a === void 0 ? void 0 : _a.id;
                if (typeof nodeId === "string") {
                    element.setAttribute("data-sankey-node-id", nodeId);
                }
            });
            linkElements.forEach((element, index) => {
                var _a, _b;
                const link = links[index];
                const sourceId = typeof (link === null || link === void 0 ? void 0 : link.source) === "string" ? link.source : (_a = link === null || link === void 0 ? void 0 : link.source) === null || _a === void 0 ? void 0 : _a.id;
                const targetId = typeof (link === null || link === void 0 ? void 0 : link.target) === "string" ? link.target : (_b = link === null || link === void 0 ? void 0 : link.target) === null || _b === void 0 ? void 0 : _b.id;
                if (typeof sourceId === "string") {
                    element.setAttribute("data-sankey-source", sourceId);
                }
                if (typeof targetId === "string") {
                    element.setAttribute("data-sankey-target", targetId);
                }
            });
        };
        this.clearSelectionState = () => {
            if (this.restoreSelectionFrame !== null) {
                cancelAnimationFrame(this.restoreSelectionFrame);
                this.restoreSelectionFrame = null;
            }
            toggleSankeyItemClickSelection(this.chartRef, this.selectedSelectionState, false);
            if (this.categorical && this.activeLabelEmphasisEnabled) {
                updateSankeySelectionLabelState(this.chartRef, this.selectedNodeIds, false, this.resolvedActiveLabelFontWeight);
            }
            this.selectedSelectionState = null;
            this.selectedNodeIds = [];
        };
        this.applySelectionState = () => {
            if (!this.clickSelectionEnabled || !this.selectedSelectionState) {
                return;
            }
            toggleSankeyItemClickSelection(this.chartRef, this.selectedSelectionState, true, this.selectionVisualConfig);
            if (this.categorical && this.activeLabelEmphasisEnabled) {
                updateSankeySelectionLabelState(this.chartRef, this.selectedNodeIds, true, this.resolvedActiveLabelFontWeight);
            }
        };
        this.scheduleSelectionRestore = () => {
            if (!this.clickSelectionEnabled || !this.selectedSelectionState) {
                return;
            }
            if (this.restoreSelectionFrame !== null) {
                cancelAnimationFrame(this.restoreSelectionFrame);
            }
            this.restoreSelectionFrame = requestAnimationFrame(() => {
                this.restoreSelectionFrame = null;
                this.applySelectionState();
            });
        };
        this.handleItemSelection = (data) => {
            if (!this.clickSelectionEnabled) {
                return;
            }
            this.pendingItemClickSelection = true;
            this.clearSelectionState();
            this.selectedSelectionState = getSankeyClickSelectionState(data);
            this.selectedNodeIds = getSankeySelectionNodeIds(data);
            this.applySelectionState();
        };
        this.handleDocumentClick = () => {
            if (!this.clickSelectionEnabled) {
                return;
            }
            if (this.pendingItemClickSelection) {
                this.pendingItemClickSelection = false;
                return;
            }
            this.clearSelectionState();
        };
        this.renderChart = async () => {
            var _a, _b, _c, _d;
            const configWithNivoTooltips = this.config;
            if (!this.warnedAboutNivoTooltips &&
                (configWithNivoTooltips.nodeTooltip !== undefined ||
                    configWithNivoTooltips.linkTooltip !== undefined)) {
                console.warn("hbr-sankey-chart: config.nodeTooltip and config.linkTooltip are not supported. Use itemTooltip or legendTooltip instead.");
                this.warnedAboutNivoTooltips = true;
            }
            const publicConfig = omitChartConfigKeys(configWithNivoTooltips, [
                "nodeTooltip",
                "linkTooltip",
            ]);
            const legendPopoverOptions = this.getLegendPopoverOptions();
            // const eventHandlers = {
            const chartEventHandlers = {
                itemsEventHandlers: {
                    nodeTooltip: () => "",
                    linkTooltip: () => "",
                    onFocus: (data, event) => {
                        this.applyPopoverOptions();
                        showSankeyItemTooltip(data, event, this.tooltipRef, this.config.itemTooltip, this.categorical);
                    },
                    onBlur: () => {
                        hideSankeyTooltip(this.tooltipRef);
                        this.scheduleSelectionRestore();
                    },
                    onMouseEnter: (data, event) => {
                        this.applyPopoverOptions();
                        showSankeyItemTooltip(data, event, this.tooltipRef, this.config.itemTooltip, this.categorical);
                    },
                    onMouseLeave: () => {
                        if (!this.isPopoverSelfManaged()) {
                            hideSankeyTooltip(this.tooltipRef);
                        }
                        this.scheduleSelectionRestore();
                    },
                    onClick: (data) => {
                        this.handleItemSelection(data);
                    },
                },
                legendsEventHandlers: {
                    onMouseEnter: (data, event) => {
                        this.applyPopoverOptions(legendPopoverOptions);
                        showSankeyLegendTooltip(data, event, this.tooltipRef, this.config.legendTooltip);
                    },
                    onMouseLeave: () => {
                        if (!this.isPopoverSelfManaged(legendPopoverOptions)) {
                            hideSankeyTooltip(this.tooltipRef);
                        }
                    },
                    onFocus: (data, event) => {
                        this.applyPopoverOptions(legendPopoverOptions);
                        showSankeyLegendTooltip(data, event, this.tooltipRef, this.config.legendTooltip);
                    },
                    onBlur: () => {
                        hideSankeyTooltip(this.tooltipRef);
                    },
                },
            };
            const baseConfig = this.categorical
                ? getSankeyCategoricalConfig(publicConfig, chartEventHandlers, {
                    width: (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.clientWidth,
                    height: (_b = this.chartRef) === null || _b === void 0 ? void 0 : _b.clientHeight,
                })
                : getSankeyBaseConfig(publicConfig, chartEventHandlers);
            const existingEventHandlers = {
                onMouseEnter: baseConfig.onMouseEnter,
                onMouseLeave: baseConfig.onMouseLeave,
                onClick: baseConfig.onClick,
                onblur: baseConfig.onBlur,
                onFocus: baseConfig.onFocus,
            };
            let fullConfig = cjs(baseConfig, publicConfig, {
                customMerge: (key) => {
                    var _a;
                    if (key === "margin" && ((_a = publicConfig.columnHeaders) === null || _a === void 0 ? void 0 : _a.length)) {
                        return (calculatedMargin) => calculatedMargin;
                    }
                    if (key === "colors") {
                        return (_defaultColors, configuredColors) => configuredColors;
                    }
                    if (key === "legends") {
                        return (a, b) => {
                            const ret = a.length > b.length
                                ? a.map((r, i) => (Object.assign(Object.assign({}, r), b[i])))
                                : b.map((r, i) => (Object.assign(Object.assign({}, r), a[i])));
                            return ret;
                        };
                    }
                },
            });
            // Preserve Sankey-generated legends when publicConfig.legends isn't an array.
            // Explicit arrays, including [], are handled by the merge above.
            if (!Array.isArray(publicConfig.legends)) {
                fullConfig.legends = baseConfig.legends;
            }
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            fullConfig = omitChartConfigKeys(fullConfig, [
                "nodeTooltip",
                "linkTooltip",
            ]);
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement);
            }
            fullConfig = removeSankeyColumnHeaderExtensions(fullConfig);
            fullConfig = Object.assign(Object.assign({}, fullConfig), { nodeTooltip: (_c = fullConfig.nodeTooltip) !== null && _c !== void 0 ? _c : (() => ""), linkTooltip: (_d = fullConfig.linkTooltip) !== null && _d !== void 0 ? _d : (() => "") });
            if (!this.chartRef.innerHTML.length) {
                const newRoot = createRoot(this.chartRef);
                newRoot.render(react.exports.createElement(_, fullConfig, null));
                this.contextRoot = newRoot;
            }
            else {
                this.contextRoot.render(react.exports.createElement(_, fullConfig, null));
            }
            requestAnimationFrame(() => {
                this.syncSankeySelectionDataAttributes();
                this.applySelectionState();
            });
            if (this.boardRef.setChartConfig) {
                this.boardRef.setChartConfig(fullConfig);
            }
        };
        this.config = {
            data: { nodes: [], links: [] },
        };
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
        this.categorical = false;
        this.i18n = {};
        this.showHeader = "none";
        this.modifyHbrConfig = undefined;
        this.popoverOptions = undefined;
    }
    /** Public method for download data, use customFunc to create your own way to download data, such as pdf */
    async download(filename = "Export.csv", customFunc) {
        if (customFunc) {
            customFunc(this.config.data);
        }
        else {
            browserDownloadCsv(convertSankeyDataToCSV(this.config.data), filename);
        }
    }
    /** Public method to get popover reference, client can use this to control magnetic UX popover externally */
    async getPopoverRef() {
        return this.tooltipRef;
    }
    getLegendPopoverOptions() {
        var _a, _b;
        return (_b = (_a = this.config.legends) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.popoverOptions;
    }
    getPopoverOptions(override) {
        return resolveChartPopoverOptions({
            distance: this.categorical ? -6 : 10,
            variant: "chart",
            placement: "top",
        }, this.popoverOptions, this.categorical, override);
    }
    applyPopoverOptions(override) {
        var _a;
        const popoverOptions = this.getPopoverOptions(override);
        applyChartPopoverOptions(this.tooltipRef, popoverOptions);
        (_a = this.tooltipRef) === null || _a === void 0 ? void 0 : _a.toggleAttribute("data-sankey-width-expand", popoverOptions.widthExpand === true);
    }
    isPopoverSelfManaged(override) {
        return isChartPopoverSelfManaged(this.categorical, this.popoverOptions, override);
    }
    get clickSelectionEnabled() {
        var _a, _b;
        return Boolean((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.enableClickSelection) !== null && _b !== void 0 ? _b : this.categorical);
    }
    get activeLabelEmphasisEnabled() {
        var _a, _b;
        return Boolean((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.enableActiveLabelEmphasis) !== null && _b !== void 0 ? _b : this.categorical);
    }
    get resolvedActiveLabelFontWeight() {
        var _a;
        const activeLabelFontWeight = (_a = this.config) === null || _a === void 0 ? void 0 : _a.activeLabelFontWeight;
        if (typeof activeLabelFontWeight === "number") {
            return activeLabelFontWeight;
        }
        if (typeof activeLabelFontWeight === "string") {
            const parsedFontWeight = Number(activeLabelFontWeight);
            if (Number.isFinite(parsedFontWeight)) {
                return parsedFontWeight;
            }
        }
        return 700;
    }
    get selectionVisualConfig() {
        var _a, _b, _c, _d;
        const chartConfig = this.config;
        return {
            nodeHoverOpacity: (_a = chartConfig.nodeHoverOpacity) !== null && _a !== void 0 ? _a : 1,
            nodeHoverOthersOpacity: (_b = chartConfig.nodeHoverOthersOpacity) !== null && _b !== void 0 ? _b : 0.15,
            linkHoverOpacity: (_c = chartConfig.linkHoverOpacity) !== null && _c !== void 0 ? _c : 0.6,
            linkHoverOthersOpacity: (_d = chartConfig.linkHoverOthersOpacity) !== null && _d !== void 0 ? _d : 0.15,
        };
    }
    componentDidLoad() {
        this.renderChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
        document.addEventListener("click", this.handleDocumentClick);
    }
    componentShouldUpdate() {
        this.clearSelectionState();
        return this.renderChart();
    }
    disconnectedCallback() {
        document.removeEventListener("click", this.handleDocumentClick);
        this.clearSelectionState();
    }
    render() {
        const i18n = Object.assign(Object.assign({}, this.i18n), defaultI18n);
        const { config } = this;
        const layout = config.layout ? config.layout : "vertical";
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const popoverOptions = resolveChartPopoverOptions({ distance: this.categorical ? -6 : 10, variant: "chart" }, this.popoverOptions, this.categorical);
        return (h(Host, { key: '232a2bf4d5704b1c203f7a3fc559dd2210395d6f', class: this.categorical ? "categorical" : "" }, !Object.keys(config.data || {}).length && this.categorical && (h("div", { slot: "header", part: "header", class: "chart-sankey__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("hbr-chart-board", { key: '63268734fa167a70d8be3e3e4c4dc4e91d7d592d', ref: (el) => {
                this.boardRef = el;
            }, type: this.categorical ? "categorical-sankey" : null, description: this.categorical ? i18n.noDataCategorical : i18n.noData, isLoading: this.loading, isEmpty: !Object.keys(config.data || {}).length, style: { width: this.width, height: this.height }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: 'a84f7f20c1748ae4b0c87fcaa63932844feadd5c' }, popoverOptions, { "data-sankey-width-expand": popoverOptions.widthExpand === true ? "true" : undefined, style: this.categorical
                ? { "--text-color": "var(--base-text-default)" }
                : undefined, ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: 'c23bd1a5ddc16e17abdc0861753f1bd7e44ed24a', slot: "content" })), (Object.keys(config.data || {}).length || !this.categorical) && (h("div", { slot: "header", part: "header", class: "chart-sankey__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("div", { key: '77ed969c95fc6980da4794d38fa4bf487683196b', ref: (el) => {
                this.chartRef = el;
            }, class: `--hbr-chart --sankey-chart --sankey-${layout} ${this.categorical ? "--categorical" : ""}`, part: "chart" }), h("div", { key: 'db81e35c06ae3048890d9d5996baffc448051895', slot: "footer" }, h("slot", { key: '0c32f964e603e6d028e6c369be8f984e9a099d82', name: "footer" })), h("div", { key: '7fd7504c74af1218c85a8cac56fa116658036ed2', slot: "loading-state" }, h("slot", { key: '5846181e0dc20b2d798fd786376e1dca52e35350', name: "loading-state" })), h("div", { key: 'eb132732f9493f1f2b19a958693b70bb92408fd0', slot: "empty-state" }, h("slot", { key: '4da32a8c04152d6bc4a6f538d923c676b15d2107', name: "empty-state" })))));
    }
    get el() { return this; }
    static get style() { return HbrSankeyChartStyle0; }
}, [1, "hbr-sankey-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
        "categorical": [516],
        "i18n": [16],
        "showHeader": [1, "show-header"],
        "modifyHbrConfig": [16],
        "popoverOptions": [16],
        "download": [64],
        "getPopoverRef": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-sankey-chart", "hbr-chart-board", "hbr-divider", "hbr-icon", "hbr-illustration", "hbr-layout", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sankey-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrSankeyChart$1);
            }
            break;
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-divider":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-layout":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrSankeyChart = HbrSankeyChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrSankeyChart, defineCustomElement };

