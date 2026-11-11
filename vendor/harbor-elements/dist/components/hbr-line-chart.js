import { h, proxyCustomElement, HTMLElement, Host } from '@stencil/core/internal/client';
import { D as De$1 } from './harbor-charts-line.es.js';
import { r as react, R as React, E as Et$1, x, z, $ as $r$1, a as animated, Z as Zr, b as useSpring, D as Dt$1, c as createRoot } from './client.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { b as createDOMElementFromVNode } from './function-helper.js';
import { s as sanitizeHtml } from './sanitizeHtml.js';
import { s as showChartPopover, h as hideChartPopover, b as browserDownloadCsv, d as defineCustomElement$8 } from './board.js';
import { G as Gt, T as Tt$1 } from './chunk-Z46YYJNO.js';
import { m, D, S, $, x as x$1, b, o as omitChartConfigKeys, r as resolveChartPopoverOptions, a as applyChartPopoverOptions, i as isChartPopoverSelfManaged } from './popover-options.js';
import { d as defineCustomElement$7 } from './icon.js';
import { d as defineCustomElement$6 } from './illustration.js';
import { d as defineCustomElement$5 } from './layout.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';

var Vt={};m(Vt,{HarborCustomDashedLine:()=>jr,getCategoricalColors:()=>D,getCategoricalLineSymbolSVG:()=>vr,getCategoricalLineSymbols:()=>De,getColors:()=>Ge,getLineBaseConfig:()=>tr,getLineCategoricalConfig:()=>Xr,getLineSymbols:()=>Re,toggleLineClickingClass:()=>de,toggleLinePointHoverClass:()=>Y});function Ur({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("circle",{r:e/2,cx:0,cy:0,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function Kr({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e/2;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:`M 0 ${-c} L ${-c} ${c} L ${c} ${c} Z`,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function qr({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e/2,d=e/5,y=`M ${-c} ${-c+d}
		L ${-c+d} ${-c}
		L 0 ${-d}
		L ${c-d} ${-c}
		L ${c} ${-c+d}
		L ${d} 0
		L ${c} ${c-d}
		L ${c-d} ${c}
		L 0 ${d}
		L ${-c+d} ${c}
		L ${-c} ${c-d}
		L ${-d} 0
		Z`;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:y,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function Jr({size:e,fill:t,opacity:r=1,tabIndex:n,pointAriaDescribedBy:o,pointAriaLabel:s,pointAriaLabelledBy:i,pointAriaHidden:a,pointAriaDisabled:l}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:n,"aria-label":s,"aria-describedby":o,"aria-labelledby":i,"aria-hidden":a,"aria-disabled":l},react.exports.createElement("circle",{cx:0,cy:0,r:e/2,fill:"transparent",stroke:t,opacity:r,strokeWidth:Math.max(1,e/3),style:{pointerEvents:"none"}}))}function Qr({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e*.26,d=e*.5,y=`M ${-c} ${d} L ${c} ${-d}`;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:y,fill:"none",opacity:r,stroke:t,strokeWidth:Math.max(2,e/5),strokeLinecap:"round",style:{pointerEvents:"none"}}),react.exports.createElement("path",{d:y,fill:"none",opacity:r,stroke:o,strokeWidth:n,strokeLinecap:"round",style:{pointerEvents:"none"}}))}function Hr({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e*.26,d=e*.5,y=`M ${-c} ${-d} L ${c} ${d}`;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:y,fill:"none",opacity:r,stroke:t,strokeWidth:Math.max(2,e/5),strokeLinecap:"round",style:{pointerEvents:"none"}}),react.exports.createElement("path",{d:y,fill:"none",opacity:r,stroke:o,strokeWidth:n,strokeLinecap:"round",style:{pointerEvents:"none"}}))}function en({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("rect",{x:-e/4,y:-e/2,width:e/2,height:e,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function tn({size:e,fill:t,opacity:r=1,tabIndex:n,pointAriaDescribedBy:o,pointAriaLabel:s,pointAriaLabelledBy:i,pointAriaHidden:a,pointAriaDisabled:l}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:n,"aria-label":s,"aria-describedby":o,"aria-labelledby":i,"aria-hidden":a,"aria-disabled":l},react.exports.createElement("rect",{x:-e/2,y:-e/2,width:e,height:e,fill:"transparent",stroke:t,opacity:r,strokeWidth:Math.max(1,e/4),style:{pointerEvents:"none"}}))}function rn({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e/2;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:`M ${-c} ${-c} L ${c} ${-c} L 0 ${c} Z`,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function nn({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("rect",{x:-e/2,y:-e/2,width:e,height:e,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function an({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e/2;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:`M ${-c} 0 L 0 ${-c} L ${c} 0 L 0 ${c} Z`,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}function on({size:e,fill:t,opacity:r=1,borderWidth:n=0,borderColor:o="transparent",tabIndex:s,pointAriaDescribedBy:i,pointAriaLabel:a,pointAriaLabelledBy:l,pointAriaHidden:u,pointAriaDisabled:m}){let c=e/1.8;return react.exports.createElement("g",{transform:`translate(${-c/2}, 0)`,className:"--harbor-symbol",tabIndex:s,"aria-label":a,"aria-describedby":i,"aria-labelledby":l,"aria-hidden":u,"aria-disabled":m},react.exports.createElement("path",{d:`M 0 ${-c} A ${c} ${c} 0 0 1 0 ${c} L 0 ${-c} Z`,fill:t,opacity:r,strokeWidth:n,stroke:o,style:{pointerEvents:"none"}}))}var sn=[{type:"circle",symbol:Ur,svg:e=>`
      <svg>
        <circle fill="${e}" r="6" cx="10" cy="8"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("circle",{fill:e,r:6,cx:10,cy:8}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"inverted-triangle",symbol:Kr,svg:e=>`
      <svg>
        <path d="M10 0 L2 16 L18 16Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M10 0 L2 16 L18 16Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"spike",symbol:qr,svg:e=>`
      <svg>
        <rect fill="${e}" width="16" height="2" rx="1" ry="1" x="2" y="7" transform="rotate(45)" transform-origin="10 8"/>
        <rect fill="${e}" width="16" height="2" rx="1" ry="1" x="2" y="7" transform="rotate(-45)" transform-origin="10 8"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:16,height:2,rx:1,ry:1,x:2,y:7,transform:"rotate(45)","transform-origin":"10 8"}),react.exports.createElement("rect",{fill:e,width:16,height:2,rx:1,ry:1,x:2,y:7,transform:"rotate(-45)","transform-origin":"10 8"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"bead",symbol:Jr,svg:e=>`
      <svg>
        <rect fill="${e}" width="6" height="4" x="0" y="6"/>
        <rect fill="${e}" width="6" height="4" x="14" y="6"/>
        <circle stroke="${e}"" cx="10" cy="8" r="4" stroke-width="3" fill="transparent"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:6,height:4,x:0,y:6}),react.exports.createElement("rect",{fill:e,width:6,height:4,x:14,y:6}),react.exports.createElement("circle",{stroke:e,cx:10,cy:8,r:4,strokeWidth:3,fill:"transparent"}))},{type:"brick",symbol:en,svg:e=>`
        <svg>
          <path d="M8 14 L8 2 L12 2 L12 14Z" fill="${e}"/>
          <rect fill="${e}" width="20" height="4" x="0" y="6"/>
        </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M8 14 L8 2 L12 2 L12 14Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"chain",symbol:tn,svg:e=>`
      <svg>
        <rect fill="${e}" width="6" height="4" x="0" y="6"/>
        <rect fill="${e}" width="6" height="4" x="14" y="6"/>
        <rect stroke="${e}" stroke-width="3" width="8" height="8" x="6" y="4"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:6,height:4,x:0,y:6}),react.exports.createElement("rect",{fill:e,width:6,height:4,x:14,y:6}),react.exports.createElement("rect",{stroke:e,x:6,y:4,width:8,height:8,strokeWidth:3,fill:"transparent"}))},{type:"triangle",symbol:rn,svg:e=>`
      <svg>
        <path d="M10 18 L2 0 L18 0Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M10 18 L2 0 L18 0Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"square",symbol:nn,svg:e=>`
        <svg>
          <path d="M4 16 L4 0 L16 0 L16 16Z" fill="${e}"/>
          <rect fill="${e}" width="20" height="4" x="0" y="6"/>
        </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M4 16 L4 0 L16 0 L16 16Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"diamond",symbol:an,svg:e=>`
      <svg>
        <path d="M2 8 L10 0 L18 8 L10 16Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M2 8 L10 0 L18 8 L10 16Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"moon",symbol:on,svg:e=>`
      <svg>
        <path d="M7,2 A1,1 0 0,1 7,15Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M7,2 A1,1 0 0,1 7,15Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"slash",symbol:Qr,svg:e=>`
      <svg>
        <path d="M6 14 L14 2" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{d:"M6 14 L14 2",stroke:e,strokeWidth:3,strokeLinecap:"round",fill:"none"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"skew",symbol:Hr,svg:e=>`
      <svg>
        <path d="M6 2 L14 14" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFregment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{d:"M6 2 L14 14",stroke:e,strokeWidth:3,strokeLinecap:"round",fill:"none"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))}];function Re(){return sn}var Wt=({fill:e,id:t},r)=>{let{legendShapePadding:n=2}=r,{data:o}=r||{},s=Re(),i=o==null?void 0:o.reduce((l,u)=>(l.indexOf(u.id)===-1&&l.push(u.id),l),[]),a=s[i.indexOf(t)%s.length];return react.exports.createElement(react.exports.Fragment,{},a.reactFregment(e,n))};var Ge=e=>typeof e!="number"?[]:["var(--accent-a-default, #7D8AFF)","var(--accent-b-default, #B02863)","var(--accent-c-default, #F2638C)","var(--accent-d-default, #753BCC)","var(--accent-e-default, #6BA32A)","var(--accent-f-default, #AD3907)","var(--accent-g-default, #04A4B0)","var(--accent-h-default, #006773)","var(--accent-i-default, #E85FC6)","var(--accent-j-default, #545C8A)"].slice(0,e),Oe=e=>x$1(e,"hover");function _t(e){return e?Array.from(e.querySelectorAll("svg .--point")):[]}function Yt(e){return e?Array.from(e.querySelectorAll("svg > g > path")):[]}function Y(e,t,r,n){var u,m;let o=[],s=[];r?(o=gt(r),s=Xt(r)):t&&(o=_t(t),s=Yt(t));let i=!!(e&&e.serieId==="*")&&n==="all",a=((u=e==null?void 0:e.data)==null?void 0:u.x)!==void 0&&((m=e==null?void 0:e.data)==null?void 0:m.x)!==null,l=c=>{var d;return !a||`${(d=e==null?void 0:e.data)==null?void 0:d.x}`===c.getAttribute("category")};Array.from(o).forEach(c=>{var d,y,p,g,f,b,k,x,h;e?(i?l(c):c.getAttribute("series")===e.serieId)?((d=c.classList)==null||d.add("--point--highlight"),(y=c.classList)==null||y.remove("--point--dehighlight"),(p=c.classList)==null||p.remove("--point--target"),typeof n=="boolean"&&n&&a&&l(c)?(g=c.classList)==null||g.add("--point--target"):typeof n=="string"&&n==="all"&&l(c)&&((f=c.classList)==null||f.add("--point--target"))):((b=c.classList)==null||b.remove("--point--highlight"),(k=c.classList)==null||k.add("--point--dehighlight"),(x=c.classList)==null||x.remove("--point--target")):(h=c.classList)==null||h.remove("--point--dehighlight","--point--highlight","--point--target");}),!i&&Array.from(s).forEach(c=>{var d,y,p,g,f,b;if(e){let k=(d=c.getAttribute("d"))==null?void 0:d.substring(1).split("L").map(h=>h.split(","));(k==null?void 0:k.find(h=>h[0]===`${e.x}`&&h[1]===`${e.y}`))?((y=c.classList)==null||y.remove("--line--dehighlight"),(p=c.classList)==null||p.add("--line--highlight")):((g=c.classList)==null||g.remove("--line--highlight"),(f=c.classList)==null||f.add("--line--dehighlight"));}else (b=c.classList)==null||b.remove("--line--dehighlight","--line--highlight");});}function de(e,t,r){let n=[],o=[];r?(n=gt(r),o=Xt(r)):t&&(n=_t(t),o=Yt(t)),Array.from(n).forEach(s=>{var i,a,l;e?e&&s.getAttribute("series")===e.serieId?(i=s.classList)==null||i.remove("--point--deselected"):(a=s.classList)==null||a.add("--point--deselected"):(l=s.classList)==null||l.remove("--point--deselected","--point--selected");}),Array.from(o).forEach(s=>{var i,a,l,u,m,c;if(e){let d=(i=s.getAttribute("d"))==null?void 0:i.substring(1).split("L").map(p=>p.split(","));(d==null?void 0:d.find(p=>p[0]===`${e.x}`&&p[1]===`${e.y}`))?((a=s.classList)==null||a.remove("--line--deselected"),(l=s.classList)==null||l.add("--line--selected")):((u=s.classList)==null||u.remove("--line--selected"),(m=s.classList)==null||m.add("--line--deselected"));}else (c=s.classList)==null||c.remove("--line--deselected","--line--selected");});}var et=e=>{var t;return Array.from(((t=e==null?void 0:e.parentElement)==null?void 0:t.children)||[]).filter(r=>r.matches('.--point[tabindex="0"]'))};function tt(e){var o;let t=e.currentTarget,r=et(t),n=r.findIndex(s=>s===t);n>=0&&((o=r[n+1])==null||o.focus());}function rt(e){var o;let t=e.currentTarget,r=et(t),n=r.findIndex(s=>s===t);n>0&&((o=r[n-1])==null||o.focus());}function nt(e){var i;let t=e.currentTarget,r=t==null?void 0:t.getAttribute("category"),n=et(t),o=n.filter(a=>(a==null?void 0:a.getAttribute("category"))===r),s=o.findIndex(a=>a===t);if(s>=0&&s<o.length-1)o[s+1].focus();else {let a=n.findIndex(m=>m===t),l=(i=n[a+1])==null?void 0:i.getAttribute("category"),u=n.filter(m=>(m==null?void 0:m.getAttribute("category"))===l);u.length&&u[0].focus();}}function at(e){var i;let t=e.currentTarget,r=t==null?void 0:t.getAttribute("category"),n=et(t),o=n.filter(a=>(a==null?void 0:a.getAttribute("category"))===r),s=o.findIndex(a=>a===t);if(s>0)o[s-1].focus();else {let a=n.findIndex(m=>m===t),l=(i=n[a-1])==null?void 0:i.getAttribute("category"),u=n.filter(m=>(m==null?void 0:m.getAttribute("category"))===l);u.length&&u[u.length-1].focus();}}function gt(e){let t=ee(e);return t?Array.from(t.querySelectorAll("svg > g > g .--point")):[]}function Xt(e){let t=ee(e);return t?Array.from(t.querySelectorAll("svg > g > path")):[]}function ee(e){let{currentTarget:t}=e;return t.closest("svg")}function Ee(e,t,r){let n=gt(t),o=n.reduce((a,l)=>{var c;let u=l.getAttribute("series"),m=Number(l.getAttribute("xid"));return !u||!Number.isFinite(m)||(a[u]=Math.max((c=a[u])!=null?c:-1/0,m)),a},{}),s=a=>{let l=a.getAttribute("series"),u=Number(a.getAttribute("xid"));return !!l&&u===o[l]},i=(a,l)=>{let u=a.querySelector(".--harbor-symbol"),m=u==null?void 0:u.querySelector("circle,path,rect,polygon,line"),c=l?"1":"0";if(u==null||u.setAttribute("opacity",c),m==null||m.setAttribute("opacity",c),l&&(m==null?void 0:m.tagName.toLowerCase())==="circle"){let d=a.getAttribute("pcolor");d&&m.setAttribute("fill",d);}};n.forEach(a=>{r?s(a)?i(a,!0):i(a,!1):a.getAttribute("series")===e.serieId&&a.getAttribute("category")===`${e.data.x}`?i(a,!0):s(a)||i(a,!1);});}var ln=(e,t,r)=>Math.max(t,Math.min(r,e)),un=e=>{if(typeof e.lineColorContained!="function")return null;let t=e.lineColorContained(e);if(typeof t!="string")return null;let r=t.trim();return r||null},cn=(e,t)=>{if(typeof e.lineColorContainedHover!="function")return Oe(t);let r=e.lineColorContainedHover(e);return typeof r!="string"?t:r.trim()||t},ot=(e=[],t)=>t?e.map((r,n)=>{var i;if(((i=r.axis)!=null?i:"y")==="x"||r.value===null||r.value===void 0)return null;let o=un(r);if(!o)return null;let s=t(r.value);return Number.isFinite(s)?{thresholdY:s,color:o,hoverColor:cn(r,o),order:n,isNumericThreshold:typeof r.value=="number"&&Number.isFinite(r.value)}:null}).filter(r=>r!==null).sort((r,n)=>r.thresholdY===n.thresholdY?r.order-n.order:r.thresholdY-n.thresholdY):[],it=e=>{var o;if(!e)return null;let t=e(0);if(!Number.isFinite(t))return null;let[r,n]=((o=e.range)==null?void 0:o.call(e))||[];return !Number.isFinite(r)||!Number.isFinite(n)?t:ln(t,Math.min(r,n),Math.max(r,n))},ze=(e,t,r,n="default")=>{let o=a=>n==="hover"?a.hoverColor:a.color,s=t.filter(a=>{if(!a.isNumericThreshold||!Number.isFinite(r))return !1;let l=Math.min(a.thresholdY,r),u=Math.max(a.thresholdY,r);return e>=l&&e<=u});if(s.length){let a=s.sort((l,u)=>Math.abs(e-l.thresholdY)-Math.abs(e-u.thresholdY)||l.order-u.order)[0];return o(a)}let i=null;for(let a of t)!a.isNumericThreshold&&a.thresholdY<=e&&(i=o(a));return i};var jt=r=>{var n=r,{d:e}=n,t=b(n,["d"]);let o=$r$1(e!=null?e:"");return react.exports.createElement(animated.path,S($({},t),{d:o}))},Zt=({series:e,lineGenerator:t,lineWidth:r})=>react.exports.createElement(react.exports.Fragment,null,...e.map(n=>{var o;return react.exports.createElement(jt,{key:String(n.id),fill:"none",stroke:(o=n.color)!=null?o:"currentColor",strokeWidth:r,d:t(n.data.map(s=>s.position))||void 0})})),st=(e,t)=>`${String(e)}::${String(t)}`,lt=(e,t,r)=>Math.max(t,Math.min(r,e)),yn=e=>!!e.lineStyleInHighlight&&Object.keys(e.lineStyleInHighlight).length>0,hn=(e,t,r)=>{let n=[e],o=t.y-e.y;if(o!==0){let s=r.map(i=>{let a=(i.thresholdY-e.y)/o;return a<=0||a>=1?null:{t:a,point:{x:e.x+(t.x-e.x)*a,y:i.thresholdY}}}).filter(i=>i!==null).sort((i,a)=>i.t-a.t);n.push(...s.map(i=>i.point));}return n.push(t),n},bn=e=>{var t;return e.color||((t=e.lineStyle)==null?void 0:t.stroke)||"rgba(255, 0, 0, 0.1)"},pn=e=>{var t;return (t=e.opacity)!=null?t:1},gn=e=>e.replace(/[^a-zA-Z0-9_-]/g,"-"),fn=e=>{let t=new Map;return e.forEach(r=>{t.set(st(r.serieId,r.data.x),r);}),t},xn=({series:e,points:t,marker:r,yScale:n,innerHeight:o})=>{var f,b;let s=fn(t),i=e[0];if(!i)return [];let a=r.axis==="x"?null:r.value;if(a==null)return [];let[l=o,u=0]=((f=n==null?void 0:n.range)==null?void 0:f.call(n))||[],m=Math.min(l,u),c=Math.max(l,u),d=lt(n(a),m,c),y=(b=r.markerAreaUnderLineOperation)!=null?b:"or",p=[],g=[];return i.data.forEach(k=>{let x=e.map(E=>s.get(st(E.id,k.data.x))).filter(Boolean);if(!x.length){g.length&&(p.push(g),g=[]);return}let h=x.map(E=>E.y),L=y==="and"?Math.max(...h):Math.min(...h),M=lt(Math.max(d,L),m,c);g.push({x:x[0].x,y:M});}),g.length&&p.push(g),p},Ln=(e,t,r)=>{let n=bn(e),o=pn(e),s=`marker-area-gradient-${gn(r)}`,i=e.axis==="x";return e.markerAreaStyle==="gradient"?{defs:react.exports.createElement("defs",{key:`${r}-defs`},react.exports.createElement("linearGradient",{id:s,x1:"0%",y1:"0%",x2:i?"100%":"0%",y2:i?"0%":"100%"},[react.exports.createElement("stop",{offset:"0%",stopColor:n,stopOpacity:i?0:o,key:`${r}-stop-start`}),react.exports.createElement("stop",{offset:"100%",stopColor:n,stopOpacity:i?o:0,key:`${r}-stop-end`})])),paths:[react.exports.createElement("path",{key:r,d:t,fill:`url(#${s})`,pointerEvents:"none"})]}:e.markerAreaStyle!=="shaded"?{defs:null,paths:[react.exports.createElement("path",{key:r,d:t,fill:n,opacity:o,pointerEvents:"none"})]}:{defs:null,paths:[react.exports.createElement("path",{key:`${r}-fill`,d:t,fill:n,opacity:o,pointerEvents:"none"}),react.exports.createElement("path",{key:`${r}-pattern`,d:t,fill:"url(#marker-area-shaded-pattern)",pointerEvents:"none"})]}},Sn=({series:e,points:t,markers:r,yScale:n,innerHeight:o})=>{if(!n)return {defs:[],paths:[]};let s=[],i=[];return r.forEach((a,l)=>{var m;if(!a.enableArea||!a.markerAreaUnderLineOnly||((m=a.axis)!=null?m:"y")==="x")return;xn({series:e,points:t,marker:a,yScale:n,innerHeight:o}).forEach((c,d)=>{if(c.length<2)return;let y=c[0],p=c[c.length-1],g=[`M ${y.x} ${y.y}`,...c.slice(1).map(b=>`L ${b.x} ${b.y}`),`L ${p.x} ${o}`,`L ${y.x} ${o}`,"Z"].join(" "),f=Ln(a,g,`marker-area-under-line-${String(a.value)}-${l}-${d}`);f.defs&&s.push(f.defs),i.push(...f.paths);});}),{defs:s,paths:i}},We=({series:e,points:t})=>{let r=new Map;return t.forEach(n=>{r.set(st(n.serieId,n.data.x),n);}),e.flatMap(({id:n,data:o,color:s},i)=>{let a=[],l=[],u=0;return o.forEach(m=>{let c=m.data.y;if(c==null){l.length&&(a.push({key:`line-path-${String(n!=null?n:s)}-${i}-${u}`,color:s,points:l}),l=[],u+=1);return}let d=r.get(st(n,m.data.x));d&&l.push({x:d.x,y:d.y});}),l.length&&a.push({key:`line-path-${String(n!=null?n:s)}-${i}-${u}`,color:s,points:l}),a})},kn=({series:e,points:t,markers:r,yScale:n})=>{let o=We({series:e,points:t}),s=ot(r,n),i=it(n);return s.length?o.flatMap(a=>{let l=[],u=null,m=()=>{u&&(l.push({key:`${a.key}-${l.length}`,color:u.color,points:u.points}),u=null);};for(let c=0;c<a.points.length-1;c+=1){let d=a.points[c],y=a.points[c+1],p=hn(d,y,s);for(let g=0;g<p.length-1;g+=1){let f=p[g],b=p[g+1],k=(f.y+b.y)/2,x=ze(k,s,i)||a.color;if(!u){u={color:x,points:[f,b]};continue}if(u.color===x){u.points.push(b);continue}m(),u={color:x,points:[f,b]};}}return m(),l}):o};function Ut({series:e,lineGenerator:t,points:r,highlight:n=[],markers:o=[],lineWidth:s=2,xScale:i,yScale:a,innerHeight:l,innerWidth:u}){var h;let m=kn({series:e,points:r,markers:o,yScale:a}),c=Sn({series:e,points:r,markers:o,yScale:a,innerHeight:l!=null?l:0}),d=n.filter(yn),[y=0,p=0]=((h=i==null?void 0:i.range)==null?void 0:h.call(i))||[],g=Math.min(y,p),f=Math.max(y,p),b=!!i&&typeof l=="number"&&typeof u=="number"&&d.length>0,k="line-highlight-base-line-mask",x=m.map(({key:L,color:M,points:E})=>react.exports.createElement(jt,{key:L,fill:"none",stroke:M,strokeWidth:s,d:t(E)||void 0}));return b?react.exports.createElement(react.exports.Fragment,null,c.defs,...c.paths,react.exports.createElement("defs",null,react.exports.createElement("mask",{id:k},react.exports.createElement("rect",{x:g,y:0,width:u,height:l,fill:"white"}),d.map((L,M)=>{let E=i(L.x1),P=i(L.x2);if(!Number.isFinite(E)||!Number.isFinite(P))return null;let z=lt(E,g,f),N=lt(P,g,f),B=Math.min(z,N),_=Math.max(z,N);return react.exports.createElement("rect",{key:`line-highlight-base-line-mask-${M}`,x:B,y:0,width:_-B,height:l,fill:"black"})}))),react.exports.createElement("g",{mask:`url(#${k})`},x)):react.exports.createElement(react.exports.Fragment,null,c.defs,...c.paths,x)}var Kt=24,qt=(e,t,r)=>Math.max(t,Math.min(r,e)),An=({marker:e,scaledValue:t,innerHeight:r,innerWidth:n,width:o,height:s,position:i,offsetX:a,offsetY:l})=>{if(e.axis==="x"){let m=t-o/2+a;return i==="start"?{x:m,y:0-s+l}:i==="center"?{x:m,y:r/2-s/2+l}:{x:m,y:r+l}}let u=t-s/2+l;return i==="start"?{x:0-o+a,y:u}:i==="center"?{x:n/2-o/2+a,y:u}:{x:n+a,y:u}},Mn=(e,t,r,n)=>{let o=typeof t=="function"?t(e):t;if(typeof o=="undefined"||o===null)return null;let s={className:r,style:$({width:"100%",height:"100%",overflow:"visible",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"},n)};return typeof o=="string"||typeof o=="number"?react.exports.createElement("div",S($({},s),{dangerouslySetInnerHTML:{__html:String(o)}})):react.exports.createElement("div",s,o)},ut=({yScale:e,xScale:t,innerHeight:r,innerWidth:n},o)=>{var a;let i=((a=o.markers)!=null?a:[]).map((l,u)=>{var L,M,E,P,z,N,B;let m=l.annotation;if(!(m!=null&&m.content))return null;let c=(L=m.width)!=null?L:Kt,d=(M=m.height)!=null?M:Kt,y=(E=m.offsetX)!=null?E:0,p=(P=m.offsetY)!=null?P:0,g=(z=m.position)!=null?z:"end",f=l.axis==="x"?t(l.value):e(l.value);if(!Number.isFinite(f))return null;let b=l.axis==="x"?qt(f,0,n):qt(f,0,r),{x:k,y:x}=An({marker:l,scaledValue:b,innerHeight:r,innerWidth:n,width:c,height:d,position:g,offsetX:y,offsetY:p}),h=Mn(l,m.content,m.className,m.style);return h?react.exports.createElement("foreignObject",{key:`marker-annotation-${(N=l.axis)!=null?N:"y"}-${String(l.value)}-${u}`,x:k,y:x,width:c,height:d,style:{overflow:"visible"},"data-marker-axis":(B=l.axis)!=null?B:"y","data-marker-value":String(l.value)},h):null}).filter(Boolean);return i.length?react.exports.createElement("g",{className:"--line-marker-annotations"},i):null};var ct=n=>{var o=n,{x:e,y:t}=o,r=b(o,["x","y"]);let{animate:s,config:i}=Zr(),a=useSpring({transform:`translate(${e}, ${t})`,config:i,immediate:!s});return react.exports.createElement(animated.g,S($({},r),{transform:a.transform}))};function Qt({pointSize:e=0,points:t,isSparkline:r=!1,isInteractive:n=!0,isFocusable:o=!0,pointAriaDescribedBy:s=null,pointAriaLabel:i=null,pointAriaLabelledBy:a=null,pointAriaHidden:l=null,pointAriaDisabled:u=null,onFocus:m,onBlur:c}){if(e<=0)return react.exports.createElement("g",{});let d=Re(),y=t.reduce((b,k)=>(b.indexOf(k.serieId)===-1&&b.push(k.serieId),b),[]),p=Object.entries(y).reduce((b,k,x)=>(b[k[1]]=d[x%d.length],b),{}),g=t.reduce((b,k)=>{var x;return b[k.serieId]=Math.max((x=b[k.serieId])!=null?x:-1/0,k.x),b},{}),f=t.map((b,k)=>{let x=`${b.serieId}-${String(b.data.x)}-${String(b.id)}-${k}`,h=p[b.serieId].symbol,L=b.x===g[b.serieId],M=!r||L,E={id:b.id,fill:M?b.color:"transparent",opacity:M?1:0,borderColor:b.borderColor,pointAriaDescribedBy:s==null?void 0:s(b),pointAriaLabel:i==null?void 0:i(b),pointAriaLabelledBy:a==null?void 0:a(b),pointAriaHidden:l==null?void 0:l(b),pointAriaDisabled:u==null?void 0:u(b)};return react.exports.createElement(ct,{className:"--point",key:`g-${x}`,x:b.x,y:b.y,xid:b.x,yid:b.y,series:b.serieId,category:b.data.x,pcolor:b.color,tabIndex:n&&o?0:void 0,type:p[b.serieId].type,onFocus:P=>{de(null,null,P),Y(b,null,P),m==null||m(b,P);},onBlur:P=>{c==null||c(b,P);},onKeyUp:P=>{o&&n&&(P.key==="ArrowLeft"?rt(P):P.key==="ArrowRight"?tt(P):P.key==="ArrowUp"?nt(P):P.key==="ArrowDown"&&at(P));}},react.exports.createElement(h,S($({},E),{size:e,key:x})))});return react.exports.createElement("g",{},f)}function ve(e,t){var r,n,o;return S($({},e),{id:String((r=e.id)!=null?r:""),legendId:(o=(n=t.target)==null?void 0:n.nextSibling)==null?void 0:o.id})}var ye=null,er={top:40,right:60,bottom:90,left:60},Ht=e=>e.replace(/[^a-zA-Z0-9_-]/g,"-"),Pn=e=>{var s;if((e==null?void 0:e.areaStyle)!=="gradient"||!Array.isArray(e==null?void 0:e.data))return {};let t=e.data.filter(i=>!!i&&typeof i=="object");if(!t.length)return {};let r=(s=e.areaOpacity)!=null?s:.2,n=Array.isArray(e.colors)?e.colors:Ge(t.length||1);return {areaOpacity:1,defs:[...t.map((i,a)=>{var m;let l=String(n[a%n.length]);return {id:`line-area-gradient-${Ht(String((m=i.id)!=null?m:a))}`,type:"linearGradient",colors:[{offset:0,color:l,opacity:r},{offset:100,color:l,opacity:0}]}}),...Array.isArray(e.defs)?e.defs:[]],fill:[...t.map((i,a)=>{var l;return {match:{id:i.id},id:`line-area-gradient-${Ht(String((l=i.id)!=null?l:a))}`}}),...Array.isArray(e.fill)?e.fill:[]]}},ft=(e,t)=>{let r=ee(t);if(!r)return;let n=r.querySelectorAll(`[series='${e.id}']`);if(n[0]){let o=n[0].getAttribute("xid"),s=n[0].getAttribute("yid");Y({x:o,y:s,serieId:e.id},null,t);}},Cn=(e,t)=>{var s;let r=(e==null?void 0:e.margin)||er;return [$({dataFrom:"keys",anchor:"bottom",direction:"row",justify:!1,translateX:-r.left/2,translateY:(r.top+r.bottom)/2,itemsSpacing:10,itemWidth:100,itemHeight:20,itemDirection:"left-to-right",itemOpacity:.85,symbolSize:20,itemTextColor:"var(--base-text-default)",effects:[{on:"hover",style:{itemOpacity:1}}],symbolShape:i=>Wt(i,e),eventDivHandlerStyle:()=>({}),onMouseEnter:(i,a)=>{var l;ft({id:i.id,color:i.color},a),(l=t==null?void 0:t.onMouseEnter)==null||l.call(t,ve(i,a),a);},onMouseLeave:(i,a)=>{var l;Y(null,null,a),(l=t==null?void 0:t.onMouseLeave)==null||l.call(t,ve(i,a),a);},onMouseMove:(i,a)=>{var l;(l=t==null?void 0:t.onMouseMove)==null||l.call(t,ve(i,a),a);},onFocus:(i,a)=>{var l;ft({id:i.id,color:i.color},a),(l=t==null?void 0:t.onFocus)==null||l.call(t,ve(i,a),a);},onBlur:(i,a)=>{var l;Y(null,null,a),(l=t==null?void 0:t.onBlur)==null||l.call(t,ve(i,a),a);},onClick:(i,a)=>{var l,u,m;(l=e==null?void 0:e.legends)!=null&&l.length&&((u=e==null?void 0:e.legends[0])!=null&&u.isInteractive)&&(ft({id:i.id,color:i.color},a),(m=t==null?void 0:t.onClick)==null||m.call(t,ve(i,a),a));},onKeyUp:(i,a)=>{var c,d,y,p;let l=a.target,u=(d=(c=l==null?void 0:l.parentElement)==null?void 0:c.previousSibling)==null?void 0:d.firstChild,m=(p=(y=l==null?void 0:l.parentElement)==null?void 0:y.nextSibling)==null?void 0:p.firstChild;a.key==="ArrowLeft"?u==null||u.focus():a.key==="ArrowRight"?m==null||m.focus():a.key==="ArrowUp"?u==null||u.focus():a.key==="ArrowDown"&&(m==null||m.focus());}},(e==null?void 0:e.legends)&&!!((s=e==null?void 0:e.legends)!=null&&s.length)&&(e==null?void 0:e.legends[0]))]};function tr(e,{legendsEventHandlers:t,itemsEventHandlers:r}){var o,s;return S($({axisRight:{type:"linear",tickSize:0,tickPadding:0,tickRotation:0,format:()=>""},axisLeft:{type:"linear",orientation:"left",tickSize:0,tickPadding:6,tickRotation:0},axisBottom:{type:"linear",orientation:"bottom",tickSize:0,tickPadding:6,tickRotation:0,legendPosition:"middle",legendOffset:27},useMesh:!0,ariaLabel:"",ariaDescribedBy:"",margin:er,padding:.5,borderColor:{from:"color",modifiers:[["darker",1.6]]},colors:Ge((o=e==null?void 0:e.data)==null?void 0:o.length)},Pn(e)),{enableGridY:!0,enableGridX:!1,enableLabel:!1,onMouseEnter:(i,a)=>{var l,u;ye=ee(a),(l=e==null?void 0:e.onMouseEnter)==null||l.call(e,i,a),(u=r==null?void 0:r.onMouseEnter)==null||u.call(r,i,a);},onMouseMove:(i,a)=>{var l,u;ye=ee(a),(l=e==null?void 0:e.onMouseMove)==null||l.call(e,i,a),(u=r==null?void 0:r.onMouseMove)==null||u.call(r,i,a),e!=null&&e.isSparkline&&Ee(i,a);},onMouseLeave:(i,a)=>{var l,u;ye=ee(a),Y(null,null,a),(l=e==null?void 0:e.onMouseLeave)==null||l.call(e,i,a),(u=r==null?void 0:r.onMouseLeave)==null||u.call(r,i,a),e!=null&&e.isSparkline&&Ee(i,a,!0);},onClick:(i,a)=>{var l,u;ye=ee(a),a.stopPropagation(),de(i.points?i.points[0]:i,null,a),(l=e==null?void 0:e.onClick)==null||l.call(e,i,a),(u=r==null?void 0:r.onClick)==null||u.call(r,i,a);},onBlur:(i,a)=>{var l,u;ye=ee(a),(l=e==null?void 0:e.onBlur)==null||l.call(e,i,a),(u=r==null?void 0:r.onBlur)==null||u.call(r,i,a);},onFocus:(i,a)=>{var l,u;ye=ee(a),(l=e==null?void 0:e.onFocus)==null||l.call(e,i,a),(u=r==null?void 0:r.onFocus)==null||u.call(r,i,a);},role:"application",isFocusable:!0,isInteractive:!0,tooltip:i=>{var a;return (a=r==null?void 0:r.tooltipFunc)==null||a.call(r,i,e==null?void 0:e.itemTooltip),Y(i.point,ye),null},sliceTooltip:i=>{var u;let{slice:a,axis:l}=i;return l!=="x"&&Y(a.points[0],ye),(u=r==null?void 0:r.sliceTooltipFunc)==null?void 0:u.call(r,i,e==null?void 0:e.itemTooltip,!1)},legends:Cn(e,t),layers:["grid","markers",i=>ut(i,e),"axes","areas","crosshair",Zt,i=>Qt(S($({},i),{isSparkline:e==null?void 0:e.isSparkline,isInteractive:e==null?void 0:e.isInteractive,isFocusable:e==null?void 0:e.isFocusable,pointAriaDescribedBy:e==null?void 0:e.pointAriaDescribedBy,pointAriaLabel:e==null?void 0:e.pointAriaLabel,pointAriaLabelledBy:e==null?void 0:e.pointAriaLabelledBy,pointAriaHidden:e==null?void 0:e.pointAriaHidden,pointAriaDisabled:e==null?void 0:e.pointAriaDisabled})),"slices","mesh",!(e!=null&&e.legends)||(s=e==null?void 0:e.legends)!=null&&s.length?"legends":null],crosshairType:"cross",theme:{fontSize:"var(--viz-font-size-2xs)",fontFamily:"var(--viz-font-body)",textColor:"var(--base-text-default)",grid:{line:{stroke:"var(--viz-color-neutral-90)",strokeWidth:1,strokeDasharray:"3 3"}},axis:{domain:{line:{stroke:"var(--viz-color-neutral-90)",strokeWidth:1}},ticks:{text:{fontSize:11,fill:"var(--base-text-default)",outlineWidth:0,outlineColor:"transparent"}},text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--viz-font-size-2xs)"}}},tooltip:{container:{display:"block",boxSizing:"border-box",width:"max-content",maxWidth:"280px",borderRadius:"var(--viz-border-radius-md)",backgroundColor:"var(--control-bg-weak-default)",shadow:"var(--viz-shadow-lg)",fontSize:"var(--viz-font-size-xs)"},basic:{},chip:{},table:{},tableCell:{},tableCellValue:{}},crosshair:{line:{stroke:"var(--base-text-default)",strokeWidth:1}}}})}var $n=45,wn=6,Dn=12,ar=.5,Pe=24,vt=24,In=.06,xt={left:10,center:80,right:10},Lt={top:10,center:80,bottom:10},mt=(e,t)=>e[t],or=e=>{if(typeof e=="number"&&Number.isFinite(e))return e;let t=Number.parseFloat(String(e!=null?e:""));return Number.isFinite(t)?t:Dn},St=(e,t,r=0)=>r>8||!e.includes("var(")?e:e.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]*))?\s*\)/g,(n,o,s)=>St(t.getPropertyValue(o).trim()||(s==null?void 0:s.trim())||"",t,r+1)),Pt=e=>{if(e&&!e.includes("var("))return e;if(typeof document=="undefined")return e!=null?e:"";let t=getComputedStyle(document.documentElement),r=e?St(e,t).trim():"",n=document.body?getComputedStyle(document.body).fontFamily.trim():"",o=St(t.getPropertyValue("--viz-font-body").trim(),t).trim();return r||n||o||t.fontFamily},he=e=>typeof e.autoSize=="object"&&e.autoSize!==null?e.autoSize:{},ir=e=>{let t=he(e).maxRotation;return typeof t=="number"&&Number.isFinite(t)?Math.min(90,Math.max(0,t)):$n},sr=e=>{let t=he(e).minFontSize;return typeof t=="number"&&Number.isFinite(t)&&t>0?t:wn},lr=e=>{var t;return (t=he(e).strategy)!=null?t:"rotate-and-shrink"},Ct=e=>he(e).dynamicHeightMargin!==!1,kt=Ct,Ce=(e,t)=>typeof e=="number"&&Number.isFinite(e)&&e>=0?e:t,Nn=e=>{let t=he(e).chartWidthDistribution,r=[Ce(t==null?void 0:t.left,xt.left),Ce(t==null?void 0:t.center,xt.center),Ce(t==null?void 0:t.right,xt.right)],n=r.reduce((o,s)=>o+s,0)||1;return {left:r[0]/n,center:r[1]/n,right:r[2]/n}},Fn=e=>{let t=he(e).chartHeightDistribution,r=[Ce(t==null?void 0:t.top,Lt.top),Ce(t==null?void 0:t.center,Lt.center),Ce(t==null?void 0:t.bottom,Lt.bottom)],n=r.reduce((o,s)=>o+s,0)||1;return {top:r[0]/n,center:r[1]/n,bottom:r[2]/n}},At=(e,t)=>{var o;let r=Nn(t),n=e==="axisLeft"?r.left:r.right;return Math.max(vt,((o=t.width)!=null?o:800)*n)},Tn=(e,t)=>{var o;let r=Fn(t),n=e==="axisTop"?r.top:r.bottom;return Math.max(vt,((o=t.height)!=null?o:600)*n)},ur=(e,t)=>{let r=t.format?t.format(e):String(e),n=String(r),o=t.truncateTickAt;return typeof o=="number"&&o>0&&n.length>o?`${n.slice(0,o)}...`:n},cr=(e,t)=>{var d;let r=mt(t,e),n=Array.isArray(r==null?void 0:r.tickValues)?r.tickValues.filter(y=>typeof y=="string"||typeof y=="number"||y instanceof Date):[];if(n.length)return n;let o=((d=t.data)!=null?d:[]).filter(y=>!!y&&typeof y=="object");if(e==="axisTop"||e==="axisBottom"){let y=o.flatMap(p=>{var g,f;return (f=(g=p.data)==null?void 0:g.map(b=>b.x))!=null?f:[]});return Array.from(new Map(y.filter(p=>p!==void 0).map(p=>[String(p instanceof Date?p.valueOf():p),p])).values())}let s=Array.isArray(t.gridYValues)?t.gridYValues.filter(y=>typeof y=="string"||typeof y=="number"||y instanceof Date):[];if(s.length)return s;let i=o.flatMap(y=>{var p;return ((p=y.data)!=null?p:[]).flatMap(g=>typeof g.y=="number"?[g.y]:[])}),a=t.yScale,l=typeof(a==null?void 0:a.min)=="number"?a.min:Math.min(0,...i),u=typeof(a==null?void 0:a.max)=="number"?a.max:Math.max(1,...i),m=5,c=(u-l)/(m-1);return Array.from({length:m},(y,p)=>l+c*p)},Mt=(e,t,r)=>Gt(Tt$1(e,`${t}px ${Pt(r)}`))+Math.max(0,e.length-1)*t*In,Rt=(e,t,r)=>{let n=Math.abs(r)*Math.PI/180;return e*Math.cos(n)+t*1.2*Math.sin(n)},Bn=(e,t,r)=>{let n=Math.abs(r)*Math.PI/180;return e*Math.sin(n)+t*1.2*Math.cos(n)},Et=(e,t)=>{var n,o;let r=mt(t,e);return ((n=r==null?void 0:r.tickPadding)!=null?n:6)+((o=r==null?void 0:r.tickSize)!=null?o:0)},rr=(e,t)=>{var f;if(!t.autoSize)return;let r=(f=mt(t,e))!=null?f:{},n=cr(e,t).map(b=>ur(b,r));if(!n.length)return;let o=lr(t),s=or(r.fontSize),i=sr(t),a=ir(t),l=Pt(r.fontFamily),u=At(e,t),m=Math.max(vt,u-Et(e,t)-Pe),c=(b,k)=>Rt(Math.max(...n.map(x=>Mt(x,b,l))),b,k)<=m;if(o==="hide"&&!c(s,0))return {fontSize:s,fontFamily:l,hide:!0,rotate:0,margin:Math.ceil(u)};let d=b=>{for(let k=0;k<=a;k+=1)if(c(b,k))return k;return a},y=s,p=o==="rotate"||o==="rotate-and-shrink"?d(s):0;for(;(o==="shrink"||o==="rotate-and-shrink")&&!c(y,p)&&y>i;)y=Math.max(i,y-ar),o==="rotate-and-shrink"&&(p=d(y));let g=Rt(Math.max(...n.map(b=>Mt(b,y,l))),y,p);return {fontSize:y,fontFamily:l,rotate:(e==="axisLeft"?-1:1)*p,margin:Math.ceil(Math.max(u,g+Et(e,t)+Pe))}},nr=(e,t,r)=>{var M,E,P,z,N,B,_;if(!t.autoSize)return;let n=(M=mt(t,e))!=null?M:{},s=cr(e,t).map(G=>ur(G,n));if(!s.length)return;let i=lr(t),a=or(n.fontSize),l=sr(t),u=ir(t),m=Pt(n.fontFamily),c=kt(t)?Tn(e,t):0,d=$({left:(P=(E=r.axisLeft)==null?void 0:E.margin)!=null?P:At("axisLeft",t),right:(N=(z=r.axisRight)==null?void 0:z.margin)!=null?N:At("axisRight",t)},(B=t.margin)!=null?B:{}),y=Math.max(0,((_=t.width)!=null?_:800)-d.left-d.right),p=s.map((G,F)=>(F+.5)/Math.max(s.length,1)*y),g=Math.min(...p.map((G,F)=>{let j=F?G-p[F-1]:Number.POSITIVE_INFINITY,Q=F<p.length-1?p[F+1]-G:Number.POSITIVE_INFINITY,O=F===0?2*Math.max(0,d.left-Pe):F===p.length-1?2*Math.max(0,d.right-Pe):Number.POSITIVE_INFINITY;return Math.max(0,Math.min(Math.min(j,Q)-Pe*2,O))})),f=G=>s.map(F=>Mt(F,G,m)),b=(G,F)=>Math.max(...f(G).map(j=>Rt(j,G,F)))<=g;if(i==="hide"&&!b(a,0))return {fontSize:a,fontFamily:m,hide:!0,rotate:0,margin:0,yOffset:0};let k=G=>{for(let F=0;F<=u;F+=1)if(b(G,F))return F;return u},x=a,h=i==="rotate"||i==="rotate-and-shrink"?k(a):0;for(;(i==="shrink"||i==="rotate-and-shrink")&&!b(x,h)&&x>l;)x=Math.max(l,x-ar),i==="rotate-and-shrink"&&(h=k(x));let L=Math.max(...f(x).map(G=>Bn(G,x,h)));return {fontSize:x,fontFamily:m,rotate:(e==="axisTop"?1:-1)*h,margin:Math.ceil(Math.max(c,L+Et(e,t)+Pe)),rotatedHeight:L,yOffset:h===0?0:(e==="axisBottom"?1:-1)*L/2}},mr=e=>{if(he(e).axisLabels===!1)return {};let t=rr("axisLeft",e),r=e.axisRight?rr("axisRight",e):void 0,n={axisLeft:t,axisRight:r};return {axisLeft:t,axisRight:r,axisTop:e.axisTop?nr("axisTop",e,n):void 0,axisBottom:nr("axisBottom",e,n)}},dr=(e,t)=>{var n,o,s;let r=$({top:40,right:60,bottom:90,left:60},(n=e.margin)!=null?n:{});return $($($($($({},r),t.axisLeft?{left:t.axisLeft.margin}:{}),t.axisRight?{right:t.axisRight.margin}:{}),t.axisTop&&kt(e)?{top:Math.max(typeof((o=e.margin)==null?void 0:o.top)=="number"?e.margin.top:0,t.axisTop.margin)}:{}),t.axisBottom&&kt(e)?{bottom:Math.max(typeof((s=e.margin)==null?void 0:s.bottom)=="number"?e.margin.bottom:0,t.axisBottom.margin)}:{})},yr=(e,t,r,n)=>{var s;if(!t)return;let o=e==="axisTop"||e==="axisBottom";return {fontSize:t.fontSize,fontFamily:t.fontFamily,hide:t.hide,rotate:t.rotate,textAnchor:o&&t.rotate!==0?"middle":r,textBaseline:o&&t.rotate!==0?"middle":n,yOffset:o&&t.rotate!==0&&(s=t.yOffset)!=null?s:0}},hr=e=>{let t=he(e).dynamicLegendPadding;return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):12},dt=e=>typeof e.autoSize=="object"&&e.autoSize!==null?e.autoSize.dynamicLegend!==!1:e.autoSize===!0,br=e=>{var t;return ((t=e.data)!=null?t:[]).filter(r=>!!r&&typeof r=="object").map(r=>{var n;return String((n=r.id)!=null?n:"")}).filter(Boolean)},pr=e=>{var t,r;return (r=(t=e.axisBottom)==null?void 0:t.rotatedHeight)!=null?r:0};var $e=12,yt=1,Vn={stroke:"var(--control-border-default)",strokeWidth:1,strokeDasharray:"3 3 3 3"},gr=({values:e,scale:t,fallbackCount:r})=>{var o,s;if(!t)return [];let n=Array.isArray(e)?e:typeof e=="number"?(o=t.ticks)==null?void 0:o.call(t,e):(s=t.ticks)==null?void 0:s.call(t,r);return Array.from(new Set((n||[]).map(i=>t(i)).filter(i=>Number.isFinite(i)))).sort((i,a)=>i-a)},Gn=(e=[])=>Array.from(new Set(e.map(t=>t.x))).sort((t,r)=>t-r);function fr({theme:e,points:t=[],gridXValues:r,gridYValues:n,xScale:o,yScale:s,innerWidth:i,innerHeight:a,isSparkline:l=!1,enableGridX:u=!0,enableGridY:m=!0}){var k;if(l)return null;let c=$($({},Vn),((k=e==null?void 0:e.grid)==null?void 0:k.line)||{}),d=Gn(t),y=gr({values:r,scale:o,fallbackCount:d.length}),p=y.length?y:d,g=gr({values:n,scale:s,fallbackCount:6}),f=(u?p:[]).filter(x=>x>=-yt&&x<=i+yt),b=(m?g:[]).filter(x=>x>=-yt&&x<=a+yt);return react.exports.createElement("g",{className:"--line-categorical-grid-overflow-layer","aria-hidden":!0,style:{pointerEvents:"none"}},[...b.map((x,h)=>react.exports.createElement(react.exports.Fragment,{key:`horizontal-grid-overflow-${h}`},react.exports.createElement("line",$({x1:-$e,x2:0,y1:x,y2:x},c)),react.exports.createElement("line",$({x1:i,x2:i+$e,y1:x,y2:x},c)))),...f.map((x,h)=>react.exports.createElement(react.exports.Fragment,{key:`vertical-grid-overflow-${h}`},react.exports.createElement("line",$({x1:x,x2:x,y1:-$e,y2:0},c)),react.exports.createElement("line",$({x1:x,x2:x,y1:a,y2:a+$e},c))))])}var be=(e,t,r,n)=>t.reduce((o,s)=>{var a;let i=((a=s.data)==null?void 0:a.filter(l=>{let u=l[r];return u===void 0?!1:n?n(u)===n(e):u===e}))||[];return i.length&&o.push(...i.map(l=>S($({},l),{serieId:s.id}))),o},[]),xr=(e,t,r,n,o)=>{var h,L,M,E,P,z,N,B,_,G,F,j,Q,O;let s=Et$1().axis.ticks,i=4,a=t==="axisLeft"||t==="axisRight",l=Math.sign(e.textX||e.lineX||0),u=Math.sign(e.textY||e.lineY||0),m=a?e.textX+(l||-1)*i:e.textX,c=a?e.textY:e.textY+(u||1)*i,d=e.format?e.format(e.value):String(e.value),y=(e.truncateTickAt||0)>0&&d.length>(e.truncateTickAt||0)?`${d.slice(0,e.truncateTickAt)}\u2026`:d,p=S($({fill:(M=(h=s.text)==null?void 0:h.fill)!=null?M:(L=n==null?void 0:n.text)==null?void 0:L.fill},s.textStyle),{"--line-categorical-axis-tick-label-hover-font-weight":(P=(E=s.hoverTextStyle)==null?void 0:E.fontWeight)!=null?P:600}),g=yr(t,o,(z=e.textAnchor)!=null?z:"middle",(N=e.textBaseline)!=null?N:"central"),f=g&&(t==="axisTop"||t==="axisBottom")&&g.rotate!==0?`rotate(${g.rotate} ${m} ${c+g.yOffset})`:`rotate(${(_=(B=g==null?void 0:g.rotate)!=null?B:e.rotate)!=null?_:0})`,b=g?{transform:f}:{rotate:e.rotate},k=e.lineX<0||e.lineY<0,x=k?$e-Math.abs(e.lineX||e.lineY):0;return React.createElement("g",{key:`${t}-${String(e.value)}`,transform:`translate(${e.x}, ${e.y})`},e.lineX||e.lineY?React.createElement("line",{x1:k?e.lineX:0,y1:k?e.lineY:0,x2:k?0:e.lineX,y2:k?0:e.lineY,style:$($({strokeDashoffset:x},s.line),s.style)}):null,g!=null&&g.hide?null:React.createElement("text",$(S($({x:m,y:c+((G=g==null?void 0:g.yOffset)!=null?G:0),textAnchor:(F=g==null?void 0:g.textAnchor)!=null?F:e.textAnchor,dominantBaseline:(j=g==null?void 0:g.textBaseline)!=null?j:e.textBaseline},b),{cursor:"default",className:`--line-categorical-axis-tick-label ${a?"vertical-tick-label":"horizontal-tick-label"}`,fontSize:(Q=g==null?void 0:g.fontSize)!=null?Q:"var(--hbr-font-size-xs)",fontFamily:(O=g==null?void 0:g.fontFamily)!=null?O:"var(--hbr-font-body)",tabIndex:-1,style:p}),r),y))},wt=(e,t,r,n,o)=>{let s=n==null?void 0:n[t];return xr(e,t,{onMouseEnter:i=>{var l;let a=be(e.value,n.data||[],"x",e.format);(l=s==null?void 0:s.onMouseEnter)==null||l.call(s,a,i,e);},onMouseMove:i=>{var l;let a=be(e.value,n.data||[],"x",e.format);(l=s==null?void 0:s.onMouseMove)==null||l.call(s,a,i,e);},onMouseLeave:i=>{var l;let a=be(e.value,n.data||[],"x",e.format);(l=s==null?void 0:s.onMouseLeave)==null||l.call(s,a,i,e);},onClick:i=>{var l;let a=be(e.value,n.data||[],"x",e.format);(l=s==null?void 0:s.onClick)==null||l.call(s,a,i,e);}},r,o==null?void 0:o[t])},Dt=(e,t,r,n,o)=>{let s=n==null?void 0:n[t];return xr(e,t,{onMouseEnter:i=>{var l;let a=be(e.value,n.data||[],"y",e.format);(l=s==null?void 0:s.onMouseEnter)==null||l.call(s,a,i,e);},onMouseMove:i=>{var l;let a=be(e.value,n.data||[],"y",e.format);(l=s==null?void 0:s.onMouseMove)==null||l.call(s,a,i,e);},onMouseLeave:i=>{var l;let a=be(e.value,n.data||[],"y",e.format);(l=s==null?void 0:s.onMouseLeave)==null||l.call(s,a,i,e);},onClick:i=>{var l;let a=be(e.value,n.data||[],"y",e.format);(l=s==null?void 0:s.onClick)==null||l.call(s,a,i,e);}},r,o==null?void 0:o[t])};var Lr=()=>React.createElement("defs",null,React.createElement("pattern",{id:"marker-area-shaded-pattern",patternUnits:"userSpaceOnUse",width:"4",height:"4",patternTransform:"rotate(45)"},[React.createElement("rect",{x:"0",y:"0",width:"4",height:"4",fill:"rgba(255, 255, 255, 0.3)",key:"marker-area-shaded-pattern-bg"}),React.createElement("path",{d:"M0 0 L0 4",stroke:"rgba(255, 255, 255, 0.7)",strokeWidth:"2",key:"marker-area-shaded-pattern-lines"})]),React.createElement("filter",{id:"beads-filter",x:"-50%",y:"-50%",width:"200%",height:"200%"},[React.createElement("feMorphology",{in:"SourceAlpha",result:"expanded",operator:"dilate",radius:"1",key:"feMorphology"}),React.createElement("feComposite",{in:"expanded",in2:"SourceAlpha",operator:"out",result:"ring",key:"feComposite1"}),React.createElement("feFlood",{floodColor:"var(--base-bg-weak-default)",result:"ringColor",key:"feFlood"}),React.createElement("feComposite",{in:"ringColor",in2:"ring",operator:"in",result:"outerStroke",key:"feComposite2"}),React.createElement("feMerge",{key:"feMerge"},[React.createElement("feMergeNode",{in:"outerStroke",key:"outerStroke"}),React.createElement("feMergeNode",{in:"SourceGraphic",key:"SourceGraphic"})])]),React.createElement("mask",{id:"moon-mask",maskUnits:"objectBoundingBox"},React.createElement("rect",{x:"0.5",y:"0",width:"0.5",height:"1",fill:"black"})),React.createElement("filter",{id:"chain-outline",filterUnits:"userSpaceOnUse"},[React.createElement("feMorphology",{in:"SourceAlpha",result:"thicken",operator:"dilate",radius:"1",key:"feMorphology1"}),React.createElement("feFlood",{floodColor:"var(--base-bg-weak-default)",result:"chainColor",key:"feFlood1"}),React.createElement("feComposite",{in:"chainColor",in2:"thicken",operator:"in",result:"outline",key:"feComposite1"}),React.createElement("feMerge",{key:"feMerge1"},[React.createElement("feMergeNode",{in:"outline",key:"outline"}),React.createElement("feMergeNode",{in:"SourceGraphic",key:"SourceGraphic"})])]));var Sr=(e,t)=>{let r=typeof e=="number"?e:Number(String(e!=null?e:t).trim().replace(/px$/,""));return Number.isFinite(r)?Math.max(0,r):t},ht=(e,t)=>e instanceof Date&&t instanceof Date?e.getTime()===t.getTime():e===t,Wn=(e=[])=>{let t=new Set,r=new Set;return e.filter(n=>{let o=n.data.x;if(o instanceof Date){let s=o.getTime();return r.has(s)?!1:(r.add(s),!0)}return t.has(o)?!1:(t.add(o),!0)})},_n=(e=[])=>e.reduce((t,r)=>{var n;return r.serieId&&(t[r.serieId]=Math.max((n=t[r.serieId])!=null?n:-1/0,r.x)),t},{}),Yn=(e=[])=>e.reduce((t,r)=>{var n;return r.serieId&&(t[r.serieId]=Math.min((n=t[r.serieId])!=null?n:1/0,r.x)),t},{}),Xn=({x:e,innerHeight:t,width:r,barStyle:n})=>react.exports.createElement("rect",{className:"--line-categorical-focus-bar",x:e-r/2,y:0,width:r,height:t,rx:n.borderRadius,ry:n.borderRadius,style:n,pointerEvents:"none"}),kr=({xScale:e,innerWidth:t,innerHeight:r,currentPoint:n,currentSlice:o,enableSlices:s,points:i=[],interactiveMode:a="vertical-bar",hideTerminalPoints:l=!0,tooltipFunc:u,itemTooltip:m})=>{var b$1,k,h,L,M,E;let c=Et$1(),x=(k=(b$1=c.focusBar)==null?void 0:b$1.bar)!=null?k:{},{width:d}=x,y=b(x,["width"]),p=d!=null?d:30,g=n||((h=o==null?void 0:o.points)==null?void 0:h[0]);if(a==="vertical-bar"){let P=(L=c==null?void 0:c.focusBar)==null?void 0:L.outline,z=(M=P==null?void 0:P.borderRadius)!=null?M:1,N=(E=c.focusBar)==null?void 0:E.innerOutline,B=Sr(N==null?void 0:N.strokeWidth,0),_=(Sr(P==null?void 0:P.strokeWidth,1)+B)/2,G=N&&B>0&&p>_*2&&r>_*2,F=G?_:0,j=_n(i),Q=Yn(i),O=Wn(i).sort((w,T)=>e(w.data.x)-e(T.data.x)).filter(w=>{if(!l)return !0;let T=i.filter(D=>ht(D.data.x,w.data.x));return T.length?!T.every(D=>D.serieId?D.x===j[D.serieId]||D.x===Q[D.serieId]:!1):!0});return react.exports.createElement("g",{className:"--line-categorical-focus-bar-layer"},O.map((w,T)=>{var V,re;let D=e(w.data.x);return Number.isFinite(D)?react.exports.createElement("g",{key:`focus-bar-${T}-${String(w.data.x)}`,className:"--line-categorical-focus-bar-target",role:"button",tabIndex:0,"aria-label":`Focus ${String(w.data.x)}`,transform:`translate(${D-p/2}, 0)`,onMouseEnter:A=>{let W=i.filter(Z=>ht(Z.data.x,w.data.x));u==null||u({slice:{points:W.length?W:[w]}},m,A),Y({serieId:"*",data:{x:w.data.x}},null,A,"all");},onMouseMove:A=>{let W=i.filter(Z=>ht(Z.data.x,w.data.x));u==null||u({slice:{points:W.length?W:[w]}},m,A),Y({serieId:"*",data:{x:w.data.x}},null,A,"all");},onMouseLeave:A=>{u==null||u(null,m,A),Y(null,null,A,"all");},onPointerLeave:A=>{u==null||u(null,m,A),Y(null,null,A,"all");},onFocus:A=>{let W=i.filter(Z=>ht(Z.data.x,w.data.x));u==null||u({slice:{points:W.length?W:[w]}},m,A),Y({serieId:"*",data:{x:w.data.x}},null,A,"all");},onBlur:A=>{u==null||u(null,m,A),Y(null,null,A,"all");}},react.exports.createElement("rect",{className:"--line-categorical-focus-bar",x:0,y:0,width:p,height:r,rx:y.borderRadius,ry:y.borderRadius,style:y,pointerEvents:"none"}),react.exports.createElement("g",{className:"--line-categorical-focus-bar-outline-layer",style:P,fill:"transparent",stroke:"var(--interact-icon-medium-focus)",strokeWidth:1,strokeLinecap:"square",strokeLinejoin:"miter",pointerEvents:"none"},react.exports.createElement("rect",{className:"--line-categorical-focus-bar-outline",x:F,y:F,width:p-F*2,height:r-F*2,rx:z,ry:z,pointerEvents:"none"}),G&&N?react.exports.createElement("rect",{className:"--line-categorical-focus-bar-inner-outline",x:0,y:0,width:p,height:r,rx:(V=N.borderRadius)!=null?V:1,ry:(re=N.borderRadius)!=null?re:1,style:N,fill:"transparent",pointerEvents:"none"}):null),react.exports.createElement("rect",{className:"--line-categorical-focus-bar-hitarea",x:0,y:0,width:p,height:r,fill:"transparent",pointerEvents:"all"})):null}).filter(Boolean))}if(!g)return null;if(o&&s==="y")return react.exports.createElement("rect",{x:0,y:g.y-p/2,width:t,height:p,rx:y.borderRadius,ry:y.borderRadius,style:y,pointerEvents:"none"});let f=o?g.x:e(g.data.x);return Xn({x:f,innerHeight:r,width:p,barStyle:y})};var Ar=(e,t,r)=>Math.max(t,Math.min(r,e)),Xe=(e,t)=>`${String(e)}::${String(t)}`,Mr=e=>{var t;return e?{stroke:e.stroke||"var(--base-border-medium-default)",strokeWidth:(t=e.strokeWidth)!=null?t:1,strokeDasharray:e.strokeDasharray,strokeOpacity:e.strokeOpacity}:null},jn=(e,t,r)=>{let n=(i,a)=>i instanceof Date&&a instanceof Date?i.valueOf()===a.valueOf():i===a,o=e.findIndex(i=>n(i.data.x,t)),s=e.findIndex(i=>n(i.data.x,r));return o===-1||s===-1||o>=s?!1:e.slice(o+1,s).some(i=>i.data.y===null||i.data.y===void 0)},Rr=({xScale:e,innerHeight:t,series:r,points:n,lineGenerator:o},s)=>{var p,g;let i=(p=s.highlight)!=null?p:[],[a=0,l=0]=((g=e==null?void 0:e.range)==null?void 0:g.call(e))||[],u=Math.min(a,l),m=Math.max(a,l),c=We({series:r,points:n}).map(({key:f,color:b,points:k})=>({key:f,color:b,d:o(k)})),d=new Map(n.map(f=>[Xe(f.serieId,f.data.x),f])),y=i.map((f,b)=>{var F,j,Q;let k=e(f.x1),x=e(f.x2);if(!Number.isFinite(k)||!Number.isFinite(x))return null;let h=Ar(k,u,m),L=Ar(x,u,m),M=Math.min(h,L),E=Math.max(h,L),P=f.lineStyleInHighlight,z=!!P&&Object.keys(P).length>0,N=Mr((F=f.border)==null?void 0:F.vertical),B=Mr((j=f.border)==null?void 0:j.horizontal),_=[];N&&_.push(react.exports.createElement("line",$({key:`highlight-range-vertical-left-${b}`,x1:M,x2:M,y1:0,y2:t},N)),react.exports.createElement("line",$({key:`highlight-range-vertical-right-${b}`,x1:E,x2:E,y1:0,y2:t},N))),B&&_.push(react.exports.createElement("line",$({key:`highlight-range-horizontal-top-${b}`,x1:M,x2:E,y1:0,y2:0},B)),react.exports.createElement("line",$({key:`highlight-range-horizontal-bottom-${b}`,x1:M,x2:E,y1:t,y2:t},B)));let G=z?r.filter(O=>jn(O.data,f.x1,f.x2)&&d.has(Xe(O.id,f.x1))&&d.has(Xe(O.id,f.x2))).map((O,w)=>{let T=d.get(Xe(O.id,f.x1)),D=d.get(Xe(O.id,f.x2));return !T||!D?null:{key:`highlight-range-bridge-${b}-${w}`,color:O.color,d:o([{x:T.x,y:T.y},{x:D.x,y:D.y}])}}).filter(Boolean):[];return react.exports.createElement("g",{key:`highlight-range-${b}`,pointerEvents:"none"},react.exports.createElement("defs",null,react.exports.createElement("clipPath",{id:`highlight-range-clip-${b}`},react.exports.createElement("rect",{x:M,y:0,width:E-M,height:t}))),react.exports.createElement("rect",{x:M,y:0,width:E-M,height:t,fill:f.fill||"var(--base-color-weak)",opacity:(Q=f.opacity)!=null?Q:.2}),z?react.exports.createElement("g",{clipPath:`url(#highlight-range-clip-${b})`},c.map(({key:O,color:w,d:T})=>react.exports.createElement("path",{key:O,d:T,fill:"none",stroke:P.stroke||w,style:$({strokeWidth:2},P)})),G.map(O=>O?react.exports.createElement("path",{key:O.key,d:O.d,fill:"none",stroke:P.stroke||O.color,style:$({strokeWidth:2},P)}):null)):null,_.length?react.exports.createElement("g",{pointerEvents:"none"},_):null)});return react.exports.createElement("g",{className:"--line-highlight-range"},y)};var le=(e,t)=>{var r;return (r=e!=null?e:t)!=null?r:"var(--base-bg-weak-default)"},ue=(e,t,r)=>{var n;return (n=t!=null?t:r)!=null?n:1};function Zn({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e*4.5/12;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("circle",{className:"--harbor-symbol-color-fill",r:y,cx:0,cy:0,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function Un({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e/2,p=0,g=0+e/2,f=0-y,b=0-e/2,k=0+y,x=0-e/2;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{className:"--harbor-symbol-color-fill",d:`M ${p} ${g} L ${f} ${b} L ${k} ${x} Z`,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function Kn({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e/2,p=e/5,g=`M ${-y} ${-y+p}
    L ${-y+p} ${-y}
    L 0 ${-p}
    L ${y-p} ${-y}
    L ${y} ${-y+p}
    L ${p} 0
    L ${y} ${y-p}
    L ${y-p} ${y}
    L 0 ${p}
    L ${-y+p} ${y}
    L ${-y} ${y-p}
    L ${-p} 0
    Z
  `.trim();return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{className:"--harbor-symbol-color-fill",d:g,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function qn({size:e,fill:t,opacity:r=1,tabIndex:n,pointAriaDescribedBy:o,pointAriaLabel:s,pointAriaLabelledBy:i,pointAriaHidden:a,pointAriaDisabled:l}){return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:n,"aria-label":s,"aria-describedby":o,"aria-labelledby":i,"aria-hidden":a,"aria-disabled":l},react.exports.createElement("circle",{className:"--harbor-symbol-color-stroke",r:e*4.5/12,cx:0,cy:0,fill:"var(--base-bg-weak-default)",opacity:r,strokeWidth:e/5,stroke:t,style:{pointerEvents:"none"},filter:"url(#beads-filter)"}))}function Jn({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e/6,p=e*.375,g=`M ${-y} ${p} L ${y} ${-p}`;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{d:g,fill:"none",opacity:r,stroke:le(s,n),strokeWidth:ue(e,i,o),strokeLinecap:"round",style:{pointerEvents:"none"}}),react.exports.createElement("path",{className:"--harbor-symbol-color-stroke",d:g,fill:"none",opacity:r,stroke:t,strokeWidth:Math.max(2,e/5),strokeLinecap:"round",style:{pointerEvents:"none"}}))}function Qn({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e/6,p=e*.375,g=`M ${-y} ${-p} L ${y} ${p}`;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{d:g,fill:"none",opacity:r,stroke:le(s,n),strokeWidth:ue(e,i,o),strokeLinecap:"round",style:{pointerEvents:"none"}}),react.exports.createElement("path",{className:"--harbor-symbol-color-stroke",d:g,fill:"none",opacity:r,stroke:t,strokeWidth:Math.max(2,e/5),strokeLinecap:"round",style:{pointerEvents:"none"}}))}function Hn({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e*.375,p=e*1.125;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("rect",{className:"--harbor-symbol-color-fill",x:-y/2,y:-p/2,width:y,height:p,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function ea({size:e,fill:t,opacity:r=1,tabIndex:n,pointAriaDescribedBy:o,pointAriaLabel:s,pointAriaLabelledBy:i,pointAriaHidden:a,pointAriaDisabled:l}){let u=e*.75;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:n,"aria-label":s,"aria-describedby":o,"aria-labelledby":i,"aria-hidden":a,"aria-disabled":l},react.exports.createElement("rect",{className:"--harbor-symbol-color-stroke",x:-u/2,y:-u/2,width:u,height:u,fill:"var(--base-bg-weak-default)",opacity:r,strokeWidth:e/5,stroke:t,filter:"url(#chain-outline)",style:{pointerEvents:"none"}}))}function ta({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e/2,p=0,g=0-e/2,f=0-y,b=0+e/2,k=0+y,x=0+e/2;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{className:"--harbor-symbol-color-fill",d:`M ${p} ${g} L ${f} ${b} L ${k} ${x} Z`,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function ra({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e*.75;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("rect",{className:"--harbor-symbol-color-fill",x:-y/2,y:-y/2,width:y,height:y,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function na({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e*.75;return react.exports.createElement("g",{className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("rect",{className:"--harbor-symbol-color-fill",transform:"rotate(45)",x:-y/2,y:-y/2,width:y,height:y,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}function aa({size:e,fill:t,opacity:r=1,borderColor:n,borderWidth:o,pointBorderColor:s,pointBorderWidth:i,tabIndex:a,pointAriaDescribedBy:l,pointAriaLabel:u,pointAriaLabelledBy:m,pointAriaHidden:c,pointAriaDisabled:d}){let y=e*.5625;return react.exports.createElement("g",{transform:`translate(${-y/2}, 0)`,className:"--harbor-symbol",tabIndex:a,"aria-label":u,"aria-describedby":l,"aria-labelledby":m,"aria-hidden":c,"aria-disabled":d},react.exports.createElement("path",{className:"--harbor-symbol-color-fill",d:`
      M 0 ${0-y} A ${y} ${y} 0 0 1 0 ${0+y} L 0 ${0-y} Z
      `,fill:t,opacity:r,strokeWidth:ue(e,i,o),stroke:le(s,n),style:{pointerEvents:"none"}}))}var je=[{type:"circle",symbol:Zn,svg:e=>`
      <svg>
        <circle fill="${e}" r="5" cx="10" cy="8"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("circle",{fill:e,r:5,cx:10,cy:8}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"inverted-triangle",symbol:Un,svg:e=>`
      <svg>
        <path d="M10 16 L2 0 L18 0Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M10 15 L3 1 L17 1Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"spike",symbol:Kn,svg:e=>`
      <svg>
        <rect fill="${e}" width="16" height="2" rx="1" ry="1" x="2" y="7" transform="rotate(45)" transform-origin="10 8"/>
        <rect fill="${e}" width="16" height="2" rx="1" ry="1" x="2" y="7" transform="rotate(-45)" transform-origin="10 8"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:16,height:2,rx:1,ry:1,x:2,y:7,transform:"rotate(45)","transform-origin":"10 8"}),react.exports.createElement("rect",{fill:e,width:16,height:2,rx:1,ry:1,x:2,y:7,transform:"rotate(-45)","transform-origin":"10 8"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"bead",symbol:qn,svg:e=>`
      <svg>
        <rect fill="${e}" width="6" height="4" x="0" y="6"/>
        <rect fill="${e}" width="6" height="4" x="14" y="6"/>
        <circle stroke="${e}"" cx="10" cy="8" r="4" stroke-width="3" fill="transparent"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:6,height:4,x:0,y:6}),react.exports.createElement("rect",{fill:e,width:6,height:4,x:14,y:6}),react.exports.createElement("circle",{stroke:e,cx:10,cy:8,r:4,strokeWidth:3,fill:"transparent"}))},{type:"brick",symbol:Hn,svg:e=>`
        <svg>
          <path d="M8 14 L8 2 L12 2 L12 14Z" fill="${e}"/>
          <rect fill="${e}" width="20" height="4" x="0" y="6"/>
        </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M8 14 L8 2 L12 2 L12 14Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"chain",symbol:ea,svg:e=>`
      <svg>
        <rect fill="${e}" width="6" height="4" x="0" y="6"/>
        <rect fill="${e}" width="6" height="4" x="14" y="6"/>
        <rect stroke="${e}" stroke-width="3" width="8" height="8" x="6" y="4"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:6,height:4,x:0,y:6}),react.exports.createElement("rect",{fill:e,width:6,height:4,x:14,y:6}),react.exports.createElement("rect",{stroke:e,x:6,y:4,width:8,height:8,strokeWidth:3,fill:"transparent"}))},{type:"triangle",symbol:ta,svg:e=>`
      <svg>
        <path d="M10 0 L2 16 L18 16Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M10 0 L2 16 L18 16Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"square",symbol:ra,svg:e=>`
        <svg>
          <rect fill="${e}" width="4" height="4" x="0" y="6"/>
          <rect fill="${e}" width="12" height="12" x="4" y="2"/>
          <rect fill="${e}" width="4" height="4" x="16" y="6"/>
        </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("rect",{fill:e,width:4,height:4,x:0,y:6}),react.exports.createElement("rect",{fill:e,width:10,height:10,x:5,y:3}),react.exports.createElement("rect",{fill:e,width:4,height:4,x:16,y:6}))},{type:"diamond",symbol:na,svg:e=>`
      <svg>
        <path d="M2 8 L10 0 L18 8 L10 16Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M3 8 L10 1 L17 8 L10 15Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"moon",symbol:aa,svg:e=>`
      <svg>
        <path d="M7,2 A1,1 0 0,1 7,15Z" fill="${e}"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{fill:e,d:"M7,2 A1,1 0 0,1 7,15Z"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"slash",symbol:Jn,svg:e=>`
      <svg>
        <path d="M6 14 L14 2" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{d:"M6 14 L14 2",stroke:e,strokeWidth:3,strokeLinecap:"round",fill:"none"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))},{type:"skew",symbol:Qn,svg:e=>`
      <svg>
        <path d="M6 2 L14 14" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <rect fill="${e}" width="20" height="4" x="0" y="6"/>
      </svg>`,reactFragment:(e,t)=>react.exports.createElement("g",{transform:`translate(${t}, ${t})`},react.exports.createElement("path",{d:"M6 2 L14 14",stroke:e,strokeWidth:3,strokeLinecap:"round",fill:"none"}),react.exports.createElement("rect",{fill:e,width:20,height:4,x:0,y:6}))}];function De(e){if(!Array.isArray(e)||!e.length)return je;let t=[];for(let r of e){let n=je.find(o=>o.type===r);if(!n)return je;t.push(n);}return t}var It=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Er=e=>e==="className"?"class":e.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`),bt=e=>{if(Array.isArray(e))return e.map(bt).join("");if(!react.exports.isValidElement(e))return "";if(e.type===react.exports.Fragment)return bt(e.props.children);if(typeof e.type!="string"||!["g","circle","path","rect","ellipse","line","polygon","polyline"].includes(e.type))return "";let t=Object.entries(e.props).flatMap(([r,n])=>{if(n==null||["children","tabIndex","key","ref"].includes(r)||/^on/i.test(r))return [];if(r==="style"){let o=Object.entries(n).filter(([,s])=>typeof s=="string"||typeof s=="number").map(([s,i])=>`${Er(s)}:${i}`).join(";");return o?[`style="${It(o)}"`]:[]}return !/^[a-zA-Z_:][\w:.-]*$/.test(r)||!["string","number","boolean"].includes(typeof n)?[]:[`${Er(r)}="${It(String(n))}"`]}).join(" ");return `<${e.type}${t?` ${t}`:""}>${bt(e.props.children)}</${e.type}>`},we=(e,t)=>typeof e=="number"&&Number.isFinite(e)&&e>=0?e:t;function vr(e,t,r){var c,d;let n=(c=je.find(y=>y.type===e))!=null?c:je[0];if(r===void 0)return n.svg(t);let o=we(r.width,16),s=we(r.height,o),i=we(r.symbolSize,Math.min(o,s)),a=we(r.lineWidth,0),l=Math.min(1,we(r.opacity,1)),u=n.symbol({id:n.type,x:0,y:0,size:i,fill:t,opacity:l,borderColor:(d=r.borderColor)!=null?d:"transparent",borderWidth:we(r.borderWidth,0),tabIndex:-1}),m=a>0?`<path d="M0 ${s/2} H${o}" fill="none" stroke="${It(t)}" stroke-width="${a}" opacity="${l}"/>`:"";return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o} ${s}" width="${o}" height="${s}" aria-hidden="true">${m}<g transform="translate(${o/2},${s/2})">${bt(u)}</g></svg>`}var Pr=({x:e=0,y:t=0,size:r=20,fill:n,id:o,borderWidth:s,borderColor:i},a)=>{var x;let{legendShapePadding:l=2}=a,{data:u}=a||{},m=De(a.symbolTypes),c=u==null?void 0:u.reduce((h,L)=>(h.indexOf(L.id)===-1&&h.push(L.id),h),[]),d=m[Math.max(0,(x=c==null?void 0:c.indexOf(o))!=null?x:0)%m.length],y=r/20,p=d.reactFragment(n,l),g=react.exports.cloneElement(p,{transform:`translate(${e}, ${t}) scale(${y}) ${p.props.transform}`});if(!s)return g;let f=react.exports.Children.toArray(g.props.children),b=h=>react.exports.isValidElement(h)&&h.type==="rect"&&h.props.height===4&&h.props.y===6,k=f.filter(h=>!b(h)).map(h=>!react.exports.isValidElement(h)||["none","transparent"].includes(h.props.fill)?h:react.exports.cloneElement(h,{stroke:i,strokeWidth:y>0?s/y:0}));return react.exports.cloneElement(g,{},[...f.filter(b),...k])},Ft=e=>{var t,r,n,o;return typeof e=="number"?{top:e,right:e,bottom:e,left:e}:{top:(t=e==null?void 0:e.top)!=null?t:0,right:(r=e==null?void 0:e.right)!=null?r:0,bottom:(n=e==null?void 0:e.bottom)!=null?n:0,left:(o=e==null?void 0:e.left)!=null?o:0}},Cr=e=>{if(typeof e=="number")return String(e);if(!e||!e.includes("var("))return e!=null?e:"";if(typeof document=="undefined")return e;let t=getComputedStyle(document.documentElement),r=e;for(let n=0;n<5&&r.includes("var(");n+=1){let o=r.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/g,(s,i,a)=>t.getPropertyValue(i).trim()||(a==null?void 0:a.trim())||"");if(o===r)break;r=o;}return r},$r=e=>{let r=Cr(e).trim().match(/^(-?\d*\.?\d+)(px|rem|em|pt|%)?$/i);if(!r)return 12;let n=Number.parseFloat(r[1]);if(!Number.isFinite(n))return 12;if(!r[2]||r[2].toLowerCase()==="px"||typeof document=="undefined")return n;let o=Number.parseFloat(getComputedStyle(document.documentElement).fontSize)||16;switch(r[2].toLowerCase()){case"em":case"rem":return n*o;case"pt":return n*96/72;case"%":return n*o/100;default:return n}},wr=e=>{let t=Cr(e);if(t)return t;if(typeof document=="undefined")return "";let r=getComputedStyle(document.documentElement);return r.getPropertyValue("--viz-font-body").trim()||(document.body?getComputedStyle(document.body).fontFamily:"")||r.fontFamily||"sans-serif"},Dr=(e,t,r,n,o,s)=>Math.max(s,Math.ceil(n+o+Gt(Tt$1(String(e),`${t}px ${r}`))+16)),la=(e,t,r,n)=>{var g,f,b,k;if(e.length===0||typeof document=="undefined"&&typeof OffscreenCanvas=="undefined")return 0;let o=Ft(r.padding),s=(g=r.itemHeight)!=null?g:20,i=(f=r.itemsSpacing)!=null?f:0,a=(b=r.symbolSize)!=null?b:16,l=(k=r.symbolSpacing)!=null?k:8,u=Math.max(0,t-o.left-o.right),m=[],c=0,d=0,y=$r(n==null?void 0:n.fontSize),p=wr(n==null?void 0:n.fontFamily);return e.forEach(x=>{var M;let h=Dr(x,y,p,a,l,(M=r.itemWidth)!=null?M:0),L=d?c+i+h:h;r.direction==="row"&&d>0&&L>u&&(m.push(c),c=0,d=0),c=d?c+i+h:h,d+=1;}),d>0&&m.push(c),m.length*s+Math.max(m.length-1,0)*i+o.top+o.bottom},Ir=(e,t,r,n,o)=>{var u;if(e.length===0||typeof document=="undefined"&&typeof OffscreenCanvas=="undefined")return n;let s=Ft(r.padding),i=(u=r.itemHeight)!=null?u:20,a=la(e,t,r,o),l=i+s.top+s.bottom;return n+Math.max(0,a-l)},Nt=e=>typeof e=="string"&&["no data","null"].includes(e.toLowerCase()),ua=(e,t,r,n,o)=>{var s,i;return x({anchor:e.anchor,translateX:(s=e.translateX)!=null?s:0,translateY:(i=e.translateY)!=null?i:0,containerWidth:t,containerHeight:r,width:n,height:o})},Nr=({innerHeight:e,innerWidth:t,isFocusable:r,isInteractive:n,legends:o,series:s})=>{let i=Et$1(),a=$r(i.legends.text.fontSize),l=wr(i.legends.text.fontFamily),u=(s!=null?s:[]).map(m=>({id:m.id,label:String(m.id),color:m.color,hidden:!1})).reverse();return react.exports.createElement(react.exports.Fragment,{},(o!=null?o:[]).map((m,c)=>{var G,F,j,Q,O;let d=m,y=(Array.isArray(m.data)?m.data:u).map(w=>{var T;return w.color!==void 0||w.fill!==void 0?w:S($({},w),{color:(T=s==null?void 0:s.find(D=>String(D.id)===String(w.id)))==null?void 0:T.color})}),p=(G=d.isInteractive)!=null?G:n,g=d.dynamicLegend===!0,f=Ft(d.padding),b=(F=d.itemsSpacing)!=null?F:0,k=(j=d.itemHeight)!=null?j:20,x=(Q=d.symbolSize)!=null?Q:16,h=(O=d.symbolSpacing)!=null?O:8,L=Math.max(0,t-f.left-f.right),M=[],E=[],P=0;y.forEach(w=>{var V,re;let T=g?Dr(w.label,a,l,x,h,(V=d.itemWidth)!=null?V:0):(re=d.itemWidth)!=null?re:100,D=E.length?P+b+T:T;g&&d.direction==="row"&&E.length>0&&D>L&&(M.push(E),E=[],P=0),E.push({data:w,width:T}),P=E.length===1?T:P+b+T;}),E.length>0&&M.push(E);let N=(M.length?g?Math.min(L,Math.max(...M.map(w=>w.reduce((T,D)=>T+D.width,0)+Math.max(w.length-1,0)*b))):Math.max(...M.map(w=>w.reduce((T,D)=>T+D.width,0)+Math.max(w.length-1,0)*b)):0)+f.left+f.right,B=M.length*k+Math.max(M.length-1,0)*b+f.top+f.bottom,_=ua(d,t,e,N,B);return react.exports.createElement("g",{key:`line-categorical-legend-${c}`,transform:`translate(${_.x}, ${_.y})`,onMouseMove:p===!1||!d.onMouseMove?void 0:w=>{var A,W,Z;let D=(A=w.target.closest(".legend-event-rect"))==null?void 0:A.parentElement;if(!D)return;let V=Array.from(w.currentTarget.children).indexOf(D),re=(W=M.flat()[V])==null?void 0:W.data;re&&!Nt(re.id)&&((Z=d.onMouseMove)==null||Z.call(d,re,w));}},M.flatMap((w,T)=>{let D=f.left;return w.map((V,re)=>{var W,Z;let A=react.exports.createElement(z,{key:`line-categorical-legend-${c}-${T}-${re}-${String(V.data.id)}`,x:D,y:f.top+T*(k+b),width:V.width,height:k,data:V.data,direction:d.itemDirection,justify:d.justify,textColor:d.itemTextColor,background:d.itemBackground,opacity:d.itemOpacity,symbolShape:d.symbolShape,symbolSize:x,symbolSpacing:h,symbolBorderWidth:d.symbolBorderWidth,symbolBorderColor:d.symbolBorderColor,onClick:p===!1?void 0:d.onClick,onMouseEnter:d.onMouseEnter,onMouseLeave:d.onMouseLeave,onFocus:d.onFocus,onBlur:d.onBlur,onKeyUp:d.onKeyUp,onKeyDown:d.onKeyDown,effects:d.effects,getAriaHidden:d.getAriaHidden,getAriaDisabled:d.getAriaDisabled,getAriaLabel:d.getAriaLabel,getAriaLabelledBy:d.getAriaLabelledBy,getAriaDescribedBy:d.getAriaDescribedBy,isFocusable:Nt(V.data.id)?!1:(W=d.isFocusable)!=null?W:r,isInteractive:Nt(V.data.id)?!1:(Z=d.isInteractive)!=null?Z:n});return D+=V.width+b,A})}))}))};var ca={stroke:"var(--base-text-medium-default)",strokeWidth:3,strokeDasharray:"6 3"},ce=2,Le=20,Ie=18,ma=80,da=20,ya=ce+Ie/2,ha=e=>e.replace(/[^a-zA-Z0-9_-]/g,"-"),Fr=e=>{var t;return e.color?e.color:((t=e.lineStyle)==null?void 0:t.stroke)||"rgba(255, 0, 0, 0.1)"},ba=(e,t)=>{var a,l,u;let r=Fr(e),n=(a=e.opacity)!=null?a:1,o=`${(u=(l=e.legendLabel)!=null?l:e.legend)!=null?u:e.value}-${t}`,s=`marker-area-gradient-${ha(String(o))}`,i=e.axis==="x";return e.markerAreaStyle==="gradient"?react.exports.createElement(react.exports.Fragment,{},react.exports.createElement("defs",{key:`${s}-defs`},react.exports.createElement("linearGradient",{id:s,x1:"0%",y1:"0%",x2:i?"100%":"0%",y2:i?"0%":"100%"},[react.exports.createElement("stop",{offset:"0%",stopColor:r,stopOpacity:i?0:n,key:`${s}-stop-start`}),react.exports.createElement("stop",{offset:"100%",stopColor:r,stopOpacity:i?n:0,key:`${s}-stop-end`})])),react.exports.createElement("rect",{x:0,y:ce,width:Le,height:Ie,fill:`url(#${s})`})):e.markerAreaStyle!=="shaded"?react.exports.createElement("rect",{x:0,y:ce,width:Le,height:Ie,fill:r,opacity:n}):react.exports.createElement(react.exports.Fragment,{},react.exports.createElement("rect",{x:0,y:ce,width:Le,height:Ie,fill:r,opacity:n}),react.exports.createElement("rect",{x:0,y:ce,width:Le,height:Ie,fill:"url(#marker-area-shaded-pattern)"}))},pa=e=>e==="vertical"?{x1:Le,y1:ce,x2:Le,y2:ce+Ie}:{x1:0,y1:ce,x2:Le,y2:ce},Tr=({innerHeight:e},t)=>{var m,c,d,y,p,g;let n=((m=t.markers)!=null?m:[]).filter(f=>f.showMarkerLegend);if(!n.length)return null;let o=(c=n[0])==null?void 0:c.markerLegendLayout,s=(d=o==null?void 0:o.direction)!=null?d:"column",i=(y=o==null?void 0:o.itemWidth)!=null?y:ma,a=(p=o==null?void 0:o.itemHeight)!=null?p:da,l=(g=o==null?void 0:o.itemsSpacing)!=null?g:0,u=e+40;return react.exports.createElement("g",{className:"--line-marker-legend"},n.map((f,b)=>{var G,F,j,Q,O,w,T;let k=$($({},ca),f.lineStyle),x=Math.min(Number(k.strokeWidth)||3,3),h=(F=(G=f.legendLabel)!=null?G:f.legend)!=null?F:f.value,L=t.markerLegendEventHandlers,M=pa((j=f.legendOrientation)!=null?j:f.axis==="x"?"vertical":"horizontal"),E={id:String(h),axis:f.axis,color:Fr(f),lineStyle:f.lineStyle,opacity:f.opacity,markerAreaStyle:f.markerAreaStyle,markerLegendLabel:h,markerValue:f.value,markerLegendTooltip:f.markerLegendTooltip,markerLegendPopoverOptions:f.markerLegendPopoverOptions},P={role:"button",tabIndex:0,style:{cursor:"default"},onMouseEnter:D=>{var V;(V=L==null?void 0:L.onMouseEnter)==null||V.call(L,E,D);},onMouseMove:D=>{var V;(V=L==null?void 0:L.onMouseMove)==null||V.call(L,E,D);},onMouseLeave:D=>{var V;(V=L==null?void 0:L.onMouseLeave)==null||V.call(L,E,D);},onFocus:D=>{var V;(V=L==null?void 0:L.onFocus)==null||V.call(L,E,D);},onBlur:D=>{var V;(V=L==null?void 0:L.onBlur)==null||V.call(L,E,D);},onClick:D=>{var V;(V=L==null?void 0:L.onClick)==null||V.call(L,E,D);}},z=(O=(Q=f.markerLegendPosition)==null?void 0:Q.translateX)!=null?O:0,N=s==="row"?0:b*(a+l),B=(T=(w=f.markerLegendPosition)==null?void 0:w.translateY)!=null?T:u+N,_=s==="row"?b*(i+l):0;return react.exports.createElement("g",$({key:`marker-legend-${String(h)}-${b}`,transform:`translate(${z+_}, ${B})`},P),ba(f,b),react.exports.createElement("line",S($({},M),{stroke:k.stroke,strokeWidth:x,strokeDasharray:k.strokeDasharray})),h!=null?react.exports.createElement("text",{x:28,y:ya,dominantBaseline:"middle",fill:"var(--base-text-default)",fontFamily:"var(--viz-font-body)",fontSize:"var(--viz-font-size-xs)",style:{cursor:"default"}},typeof h=="string"||typeof h=="number"?String(h):h.toString()):null)}))};var Br=(e,t,r)=>Math.max(t,Math.min(r,e)),Vr=(e,t,r,n)=>{let o=Br(e,r,n),s=Br(t,r,n);return {start:Math.min(o,s),size:Math.abs(s-o)}},ga=e=>e.replace(/[^a-zA-Z0-9_-]/g,"-"),Or=e=>{var t;return e.color||((t=e.lineStyle)==null?void 0:t.stroke)||"rgba(255, 0, 0, 0.1)"},zr=e=>{var t;return (t=e.opacity)!=null?t:1},fa=(e,t,r)=>{let n=Or(e),o=zr(e),s=`marker-area-gradient-${ga(t.key)}`;return react.exports.createElement(react.exports.Fragment,{key:t.key},react.exports.createElement("defs",{key:`${t.key}-defs`},react.exports.createElement("linearGradient",{id:s,x1:"0%",y1:"0%",x2:r?"100%":"0%",y2:r?"0%":"100%"},[react.exports.createElement("stop",{offset:"0%",stopColor:n,stopOpacity:r?0:o,key:`${t.key}-stop-start`}),react.exports.createElement("stop",{offset:"100%",stopColor:n,stopOpacity:r?o:0,key:`${t.key}-stop-end`})])),react.exports.createElement("rect",S($({},t),{fill:`url(#${s})`,pointerEvents:"none"})))},Gr=(e,t,r)=>{let n=Or(e),o=zr(e);return e.markerAreaStyle==="gradient"?fa(e,t,r):e.markerAreaStyle!=="shaded"?react.exports.createElement("rect",S($({},t),{fill:n,opacity:o,pointerEvents:"none"})):react.exports.createElement(react.exports.Fragment,{key:t.key},react.exports.createElement("rect",{x:t.x,y:t.y,width:t.width,height:t.height,fill:n,opacity:o,pointerEvents:"none"}),react.exports.createElement("rect",{x:t.x,y:t.y,width:t.width,height:t.height,fill:"url(#marker-area-shaded-pattern)",pointerEvents:"none"}))},Wr=({yScale:e,xScale:t,innerHeight:r,innerWidth:n},o)=>{var f,b,k,x;let s=(f=o.markers)!=null?f:[],[i=0,a=n]=((b=t==null?void 0:t.range)==null?void 0:b.call(t))||[],l=Math.min(i,a),u=Math.max(i,a),[m=r,c=0]=((k=e==null?void 0:e.range)==null?void 0:k.call(e))||[],d=Math.min(m,c),y=Math.max(m,c),p=((x=o==null?void 0:o.layout)==null?void 0:x.toLowerCase())==="horizontal",g=s.map((h,L)=>{var N;if(!h.enableArea||h.markerAreaUnderLineOnly&&((N=h.axis)!=null?N:p?"x":"y")!=="x")return null;if(h.axis==="x"||!h.axis&&p){let B=t(h.value);if(!Number.isFinite(B))return null;let _=typeof h.value=="number"&&Number.isFinite(h.value)?t(0):l,{start:G,size:F}=Vr(B,Number.isFinite(_)?_:l,l,u);return Gr(h,{key:`marker-area-${h.value}-${L}`,x:G,y:0,width:F,height:r},!0)}let M=e(h.value);if(!Number.isFinite(M))return null;let E=typeof h.value=="number"&&Number.isFinite(h.value)?e(0):y,{start:P,size:z}=Vr(M,Number.isFinite(E)?E:y,d,y);return Gr(h,{key:`marker-area-${h.value}-${L}`,x:0,y:P,width:n,height:z},!1)});return react.exports.createElement("g",{className:"--bar-marker-area"},g)};var xa=(e,t,r,n)=>{var i;if(!r.length||!n)return t;let o=n(e.data.x);if(!Number.isFinite(o))return t;let s=r.find(a=>{if(typeof a.pointSize!="number")return !1;let l=n(a.x1),u=n(a.x2);if(!Number.isFinite(l)||!Number.isFinite(u))return !1;let m=Math.min(l,u),c=Math.max(l,u);return o>m&&o<c});return (i=s==null?void 0:s.pointSize)!=null?i:t};function _r({pointSize:e=0,points:t,highlight:r=[],xScale:n,yScale:o,isSparkline:s=!1,interactiveMode:i,hoverMode:a="vertical-bar",hideTerminalPoints:l=!0,isInteractive:u=!0,isFocusable:m=!0,pointAriaDescribedBy:c=null,pointAriaLabel:d=null,pointAriaLabelledBy:y=null,pointAriaHidden:p=null,pointAriaDisabled:g=null,onFocus:f,onBlur:b,onKeyDown:k,onKeyUp:x,onClick:h,onMouseEnter:L,onMouseLeave:M,onMouseMove:E,pointBorderColor:P,pointBorderWidth:z,markers:N=[],pointColorByMarker:B=!0,hoverColors:_=[],symbolTypes:G}){let F=De(G),j=i!=null?i:a,Q=ot(N,o),O=it(o),w=t.reduce((A,W)=>(A.indexOf(W.serieId)===-1&&A.push(W.serieId),A),[]),T=Object.entries(w).reduce((A,W,Z)=>(A[W[1]]=F[Z%F.length],A),{}),D=t.reduce((A,W)=>{var Z;return A[W.serieId]=Math.max((Z=A[W.serieId])!=null?Z:-1/0,W.x),A},{}),V=t.reduce((A,W)=>{var Z;return A[W.serieId]=Math.min((Z=A[W.serieId])!=null?Z:1/0,W.x),A},{}),re=t.map((A,W)=>{var Be,Ve,Gt,Ot;let Z=xa(A,e,r,n);if(Z<=0)return null;let Fe=`${A.serieId}-${String(A.data.x)}-${String(A.id)}-${W}`,Ze=T[A.serieId].symbol,Ue=A.x===D[A.serieId],Ke=A.x===V[A.serieId]||A.x===D[A.serieId],ge=s?Ue:!l||!Ke,fe=u&&m&&ge&&j!=="vertical-bar",Se=B&&(Be=ze(A.y,Q,O))!=null?Be:A.color,Te=w.indexOf(A.serieId),qe=B?(Gt=(Ve=ze(A.y,Q,O,"hover"))!=null?Ve:_[Te])!=null?Gt:Oe(A.color):(Ot=_[Te])!=null?Ot:Oe(A.color),xe=Math.max(16,Z+8),ke=Math.max(12,xe-4),C=xe/2,$$1=ke/2,K={"--line-point-default-color":Se,"--line-point-hover-color":qe},U={id:A.id,fill:ge?Se:"transparent",opacity:ge?1:0,borderColor:A.borderColor,pointBorderColor:P,pointBorderWidth:z,pointAriaDescribedBy:c==null?void 0:c(A),pointAriaLabel:d==null?void 0:d(A),pointAriaLabelledBy:y==null?void 0:y(A),pointAriaHidden:p==null?void 0:p(A),pointAriaDisabled:g==null?void 0:g(A)};return react.exports.createElement(ct,{key:`g-${Fe}`,x:A.x,y:A.y,xid:A.x,yid:A.y,series:A.serieId,category:A.data.x,pcolor:Se,className:j==="points"?"--point --point--hover-mode-points":j==="vertical-bar"?"--point --point--hover-mode-vertical-bar":"--point",tabIndex:fe?0:-1,"aria-hidden":ge?void 0:!0,type:T[A.serieId].type,style:K,onFocus:X=>{fe&&(Y(A,null,X,!0),f==null||f(A,X));},onBlur:X=>{m&&u&&j!=="vertical-bar"&&(Y(null,null,X,!0),b==null||b(A,X));},onKeyUp:X=>{fe&&(X.key==="ArrowLeft"?rt(X):X.key==="ArrowRight"?tt(X):X.key==="ArrowUp"?nt(X):X.key==="ArrowDown"&&at(X),x==null||x(A,X));},onKeyDown:X=>{fe&&(k==null||k(A,X));},onClick:X=>{u&&(h==null||h(A,X));},onMouseEnter:X=>{u&&(Y(A,null,X,!0),L==null||L(A,X));},onMouseMove:X=>{u&&(E==null||E(A,X));},onMouseLeave:X=>{u&&(Y(null,null,X,!0),M==null||M(A,X));}},react.exports.createElement(Ze,S($({},U),{size:Z,key:Fe})),j==="points"?react.exports.createElement(react.exports.Fragment,null,react.exports.createElement("rect",{className:"--point-focus-box --point-focus-box--outer",x:-C,y:-C,width:xe,height:xe,rx:2,ry:2}),react.exports.createElement("rect",{className:"--point-focus-box --point-focus-box--inner",x:-$$1,y:-$$1,width:ke,height:ke,rx:1,ry:1})):null)});return react.exports.createElement("g",{},re)}function Ne(e,t){var r,n,o;return S($({},e),{id:String((r=e.id)!=null?r:""),legendId:(o=(n=t.target)==null?void 0:n.nextSibling)==null?void 0:o.id})}var Sa=e=>{var t;return e!=null&&e.interactiveMode?e.interactiveMode:e!=null&&e.hoverMode?e.hoverMode:((t=e==null?void 0:e.verticalFocusBar)==null?void 0:t.enabled)===!1?"crosshair":"vertical-bar"},pe=null,Bt={top:40,right:60,bottom:90,left:60},Yr=e=>e.replace(/[^a-zA-Z0-9_-]/g,"-"),ka=e=>{if(!(e!=null&&e.isSparkline))return;if(e.gridYValues!==void 0)return e.gridYValues;let t=e.yScale,r=t==null?void 0:t.min,n=t==null?void 0:t.max;if(typeof r=="number"&&typeof n=="number")return r===n?[r]:[r,n]},Aa=e=>{var s;if((e==null?void 0:e.areaStyle)!=="gradient"||!Array.isArray(e==null?void 0:e.data))return {};let t=e.data.filter(i=>!!i&&typeof i=="object");if(!t.length)return {};let r=(s=e.areaOpacity)!=null?s:.2,n=Array.isArray(e.colors)?e.colors:D(t.length||1);return {areaOpacity:1,defs:[...t.map((i,a)=>{var m;let l=String(n[a%n.length]);return {id:`line-area-gradient-${Yr(String((m=i.id)!=null?m:a))}`,type:"linearGradient",colors:[{offset:0,color:l,opacity:r},{offset:100,color:l,opacity:0}]}}),...e.defs||[]],fill:[...t.map((i,a)=>{var l;return {match:{id:i.id},id:`line-area-gradient-${Yr(String((l=i.id)!=null?l:a))}`}}),...e.fill||[]]}},Ma=e=>Array.isArray(e)?Array.from(new Map(e.map(t=>[t instanceof Date?String(t.valueOf()):String(t),t])).values()):e,pt=e=>!e||typeof e!="object"?e:S($({},e),{tickValues:Ma(e.tickValues)}),J={fontSize:"var(--viz-font-size-xs)",fontFamily:"var(--viz-font-body)",textColor:"var(--base-text-default)",focusBar:{bar:{width:30,fill:"var(--base-color-weak)",fillOpacity:.15,borderRadius:0,strokeWidth:1},outline:{borderRadius:1,stroke:"var(--base-bg-weak-default)",strokeWidth:2,outlineColor:"var(--control-border-focus)",outlineStyle:"solid",outlineWidth:2,outlineOffset:0},innerOutline:{borderRadius:1,stroke:"var(--interact-bg-weak-active, #CCE1FF)",strokeWidth:2}},grid:{line:{stroke:"var(--control-border-default)",strokeWidth:1,strokeDasharray:"3 3 3 3"}},axis:{domain:{line:{stroke:"transparent",strokeWidth:0}},ticks:{line:{strokeWidth:1,stroke:"var(--control-border-default)",strokeDasharray:"3 3 3 3"},text:{fontSize:"var(--hbr-font-size-xs)",fill:"var(--base-text-default)",outlineWidth:0,outlineColor:"transparent"}},text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--viz-font-size-xs)",fontFamily:"var(--hbr-font-body)",fontWeight:"var(--hbr-font-weight-semibold)",lineHeight:"var(--hbr-font-line-height-denser)"}}},tooltip:{borderRadius:2,container:{display:"block",boxSizing:"border-box",width:"max-content",maxWidth:"280px",borderRadius:2,backgroundColor:"var(--control-bg-weak-default)",shadow:"var(--viz-shadow-lg)",fontSize:"var(--viz-font-size-xs)"},basic:{},chip:{},table:{},tableCell:{},tableCellValue:{}},crosshair:{line:{stroke:"var(--base-text-default)"}}},Tt=(e,t)=>{let r=ee(t);if(!r)return;let n=r.querySelectorAll(`[series='${e.id}']`);if(n[0]){let o=n[0].getAttribute("xid"),s=n[0].getAttribute("yid");Y({x:o,y:s,serieId:e.id},null,t,"all");}},Ra=(e,t,r=0,n)=>{var c,d,y,p,g,f,b,k;let o=dt(e),s=hr(e),i=o?s+(Ct(e)?Math.max(0,r):0):0,a=$($({},Bt),o?e==null?void 0:e.margin:n||{}),l=o?0:100,u=[$(S($({dataFrom:"keys",anchor:"bottom",direction:"row",justify:!1,translateX:o?(a.right-a.left)/2:-a.left/2,translateY:(a.top+a.bottom)/2},o?{padding:{top:i},dynamicLegend:!0}:{}),{itemsSpacing:10,itemWidth:l,itemHeight:20,itemDirection:"left-to-right",itemOpacity:.85,symbolSize:20,itemTextColor:"var(--base-text-default)",effects:[{on:"hover",style:{itemOpacity:1}}],symbolShape:x=>Pr(x,e),eventDivHandlerStyle:()=>({}),onMouseEnter:(x,h)=>{var L;Tt({id:x.id,color:x.color},h),(L=t==null?void 0:t.onMouseEnter)==null||L.call(t,Ne(x,h),h);},onMouseLeave:(x,h)=>{var L;Y(null,null,h,!0),(L=t==null?void 0:t.onMouseLeave)==null||L.call(t,Ne(x,h),h);},onMouseMove:(x,h)=>{var L;(L=t==null?void 0:t.onMouseMove)==null||L.call(t,Ne(x,h),h);},onFocus:(x,h)=>{var L;Tt({id:x.id,color:x.color},h),(L=t==null?void 0:t.onFocus)==null||L.call(t,Ne(x,h),h);},onBlur:(x,h)=>{var L;Y(null,null,h,!0),(L=t==null?void 0:t.onBlur)==null||L.call(t,Ne(x,h),h);},onClick:(x,h)=>{var L,M,E;(L=e==null?void 0:e.legends)!=null&&L.length&&((M=e==null?void 0:e.legends[0])!=null&&M.isInteractive)&&(Tt({id:x.id,color:x.color},h),(E=t==null?void 0:t.onClick)==null||E.call(t,Ne(x,h),h));},onKeyUp:(x,h)=>{var P,z,N,B;let L=h.target,M=(z=(P=L==null?void 0:L.parentElement)==null?void 0:P.previousSibling)==null?void 0:z.firstChild,E=(B=(N=L==null?void 0:L.parentElement)==null?void 0:N.nextSibling)==null?void 0:B.firstChild;h.key==="ArrowLeft"?M==null||M.focus():h.key==="ArrowRight"?E==null||E.focus():h.key==="ArrowUp"?M==null||M.focus():h.key==="ArrowDown"&&(E==null||E.focus());}}),(e==null?void 0:e.legends)&&!!((c=e==null?void 0:e.legends)!=null&&c.length)&&(e==null?void 0:e.legends[0]))],m=u[0];if(o&&["bottom","bottom-left","bottom-right"].includes(String(m.anchor))&&typeof((y=(d=e.legends)==null?void 0:d[0])==null?void 0:y.translateY)!="number"){let x=(p=e.width)!=null?p:800,h=Math.max(0,x-a.left-a.right),L=typeof m.itemHeight=="number"?m.itemHeight:20,M=m.padding,E=L+(typeof M=="number"?M*2:((g=M==null?void 0:M.top)!=null?g:0)+((f=M==null?void 0:M.bottom)!=null?f:0)),P=(k=(b=e.theme)==null?void 0:b.legends)==null?void 0:k.text,z=Array.isArray(m.data)?m.data.map(N=>{var B;return (B=N.label)!=null?B:N.id}):br(e);m.translateY=Ir(z,h,m,Math.max(60,E),$($({},J.axis.legend.text),P));}return u},Ea=(e,t,r,n)=>{var a;if(!n||!dt(e))return t;let o=r[0];if(!o||!["bottom","bottom-left","bottom-right"].includes(o.anchor))return t;let s=typeof o.translateY=="number"?o.translateY:60,i=typeof((a=e.margin)==null?void 0:a.bottom)=="number";return S($({},t),{bottom:i?Math.max(t.bottom,s):s})};function Xr(e,{legendsEventHandlers:t,itemsEventHandlers:r}){var k,x,h,L,M,E,P,z,N,B,_,G,F,j,Q,O,w,T,D$1,V,re,A,W,Z,Fe,Ze,Ue,Ke,ge,fe,Se,Te,qe,xe,ke;let n=e.margin,o=mr(e),s=dr(e,o);e=S($({},e),{margin:s});let i=Sa(e),a=pt(e==null?void 0:e.axisLeft),l=pt(e==null?void 0:e.axisBottom),u=pt(e==null?void 0:e.axisRight),m=pt(e==null?void 0:e.axisTop),c=!(e!=null&&e.legends)||e.legends.length>0,d=Ra(e,t,pr(o),n);e=S($({},e),{margin:Ea(e,(k=e.margin)!=null?k:Bt,d,c)});let y=$($({},((x=J==null?void 0:J.grid)==null?void 0:x.line)||{}),((L=(h=e==null?void 0:e.theme)==null?void 0:h.grid)==null?void 0:L.line)||{}),p=i==="crosshair"?"crosshair":null,g=$({},(M=e==null?void 0:e.verticalFocusBar)==null?void 0:M.border);((E=e==null?void 0:e.verticalFocusBar)==null?void 0:E.width)!==void 0&&(g.width=e.verticalFocusBar.width),((P=e==null?void 0:e.verticalFocusBar)==null?void 0:P.background)!==void 0&&(g.fill=e.verticalFocusBar.background),((z=e==null?void 0:e.verticalFocusBar)==null?void 0:z.opacity)!==void 0&&(g.fillOpacity=e.verticalFocusBar.opacity);let f=i==="vertical-bar"?C=>react.exports.createElement(kr,S($({},C),{interactiveMode:i,hideTerminalPoints:e==null?void 0:e.hideTerminalPoints,tooltipFunc:r==null?void 0:r.tooltipFunc,itemTooltip:e==null?void 0:e.itemTooltip})):null;return S($({axisLeft:S($({type:"linear",orientation:"left",tickSize:8,tickPadding:6,tickRotation:0},a),{renderTick:C=>{var $;return Dt(C,"axisLeft",($=J==null?void 0:J.axis)==null?void 0:$.ticks,e,o)}}),axisBottom:S($({tickSize:8},l),{renderTick:C=>{var $;return wt(C,"axisBottom",($=J==null?void 0:J.axis)==null?void 0:$.ticks,e,o)}}),axisRight:u?S($({type:"linear",tickSize:8,format:()=>""},u),{renderTick:C=>{var $;return Dt(C,"axisRight",($=J==null?void 0:J.axis)==null?void 0:$.ticks,e,o)}}):void 0,axisTop:m?S($({tickSize:8,format:()=>""},m),{renderTick:C=>{var $;return wt(C,"axisTop",($=J==null?void 0:J.axis)==null?void 0:$.ticks,e,o)}}):void 0,useMesh:!0,ariaLabel:"",ariaDescribedBy:"",margin:(N=e.margin)!=null?N:Bt,padding:.5,pointSize:(B=e==null?void 0:e.pointSize)!=null?B:12,pointBorderColor:(_=e==null?void 0:e.pointBorderColor)!=null?_:"var(--base-bg-weak-default)",borderColor:{from:"color",modifiers:[["darker",1.6]]},colors:D((G=e==null?void 0:e.data)==null?void 0:G.length),areaOpacity:1,areaBlendMode:"normal"},Aa(e)),{gridYValues:ka(e),enableGridY:!0,enableGridX:!0,enableLabel:!1,crosshairType:i==="crosshair"?"cross":void 0,onMouseEnter:(C,$)=>{var K,U;pe=ee($),(K=e==null?void 0:e.onMouseEnter)==null||K.call(e,C,$),(U=r==null?void 0:r.onMouseEnter)==null||U.call(r,C,$);},onMouseMove:(C,$)=>{var K,U;pe=ee($),(K=e==null?void 0:e.onMouseMove)==null||K.call(e,C,$),(U=r==null?void 0:r.onMouseMove)==null||U.call(r,C,$),e!=null&&e.isSparkline&&Ee(C,$);},onMouseLeave:(C,$)=>{var K,U;pe=ee($),Y(null,null,$,!0),(K=e==null?void 0:e.onMouseLeave)==null||K.call(e,C,$),(U=r==null?void 0:r.onMouseLeave)==null||U.call(r,C,$),e!=null&&e.isSparkline&&Ee(C,$,!0);},onClick:(C,$)=>{var K,U;pe=ee($),$.stopPropagation(),de(C.points?C.points[0]:C,null,$),(K=e==null?void 0:e.onClick)==null||K.call(e,C,$),(U=r==null?void 0:r.onClick)==null||U.call(r,C,$);},onBlur:(C,$)=>{var K,U;pe=ee($),(K=e==null?void 0:e.onBlur)==null||K.call(e,C,$),(U=r==null?void 0:r.onBlur)==null||U.call(r,C,$);},onFocus:(C,$)=>{var K,U;pe=ee($),(K=e==null?void 0:e.onFocus)==null||K.call(e,C,$),(U=r==null?void 0:r.onFocus)==null||U.call(r,C,$);},role:"application",isFocusable:i!=="vertical-bar",isInteractive:!0,tooltip:C=>{var $;return ($=r==null?void 0:r.tooltipFunc)==null||$.call(r,C,e==null?void 0:e.itemTooltip),Y(C.point,pe,null,!0),null},sliceTooltip:C=>{var U;let{slice:$,axis:K}=C;return K!=="x"&&Y($.points[0],pe,null,!0),(U=r==null?void 0:r.sliceTooltipFunc)==null?void 0:U.call(r,C,e==null?void 0:e.itemTooltip,!1)},legends:d,layers:[Lr,"grid","markers",C=>Wr(C,e),"axes",C=>{var $$1,K,U,Be,Ve;return fr(S($({},C),{isSparkline:e==null?void 0:e.isSparkline,enableGridX:($$1=C.enableGridX)!=null?$$1:e==null?void 0:e.enableGridX,enableGridY:(K=C.enableGridY)!=null?K:e==null?void 0:e.enableGridY,theme:S($({},C.theme||{}),{grid:S($({},((U=C.theme)==null?void 0:U.grid)||{}),{line:$($({},y),((Ve=(Be=C.theme)==null?void 0:Be.grid)==null?void 0:Ve.line)||{})})})}))},C=>ut(C,e),"areas",C=>Rr(C,e),C=>Ut(S($({},C),{highlight:(e==null?void 0:e.highlight)||[],markers:(e==null?void 0:e.markers)||[],lineWidth:e==null?void 0:e.lineWidth})),C=>_r(S($({},C),{highlight:(e==null?void 0:e.highlight)||[],markers:(e==null?void 0:e.markers)||[],pointColorByMarker:(e==null?void 0:e.pointColorByMarker)!==!1,hoverColors:e==null?void 0:e.hoverColors,symbolTypes:e==null?void 0:e.symbolTypes,isSparkline:e==null?void 0:e.isSparkline,interactiveMode:e==null?void 0:e.interactiveMode,hoverMode:e==null?void 0:e.hoverMode,hideTerminalPoints:e==null?void 0:e.hideTerminalPoints,isInteractive:e==null?void 0:e.isInteractive,isFocusable:i==="vertical-bar"?!1:e==null?void 0:e.isFocusable,pointBorderColor:e==null?void 0:e.pointBorderColor,pointBorderWidth:e==null?void 0:e.pointBorderWidth,pointAriaDescribedBy:e==null?void 0:e.pointAriaDescribedBy,pointAriaLabel:e==null?void 0:e.pointAriaLabel,pointAriaLabelledBy:e==null?void 0:e.pointAriaLabelledBy,pointAriaHidden:e==null?void 0:e.pointAriaHidden,pointAriaDisabled:e==null?void 0:e.pointAriaDisabled})),p,"slices","mesh",f,C=>Tr(C,{markers:e==null?void 0:e.markers,markerLegendEventHandlers:t}),c?dt(e)?Nr:"legends":null],theme:S($({},J),{axis:S($({},J.axis),{ticks:S($({},J.axis.ticks),{line:$($({},J.axis.ticks.line),(Q=(j=(F=e==null?void 0:e.theme)==null?void 0:F.axis)==null?void 0:j.ticks)==null?void 0:Q.line),style:(T=(w=(O=e==null?void 0:e.theme)==null?void 0:O.axis)==null?void 0:w.ticks)==null?void 0:T.style,text:$($({},J.axis.ticks.text),(re=(V=(D$1=e==null?void 0:e.theme)==null?void 0:D$1.axis)==null?void 0:V.ticks)==null?void 0:re.text),textStyle:(Z=(W=(A=e==null?void 0:e.theme)==null?void 0:A.axis)==null?void 0:W.ticks)==null?void 0:Z.textStyle,hoverTextStyle:(Ue=(Ze=(Fe=e==null?void 0:e.theme)==null?void 0:Fe.axis)==null?void 0:Ze.ticks)==null?void 0:Ue.hoverTextStyle})}),focusBar:{bar:$($($({},J.focusBar.bar),g),(ge=(Ke=e==null?void 0:e.theme)==null?void 0:Ke.focusBar)==null?void 0:ge.bar),outline:$($({},J.focusBar.outline),(Se=(fe=e==null?void 0:e.theme)==null?void 0:fe.focusBar)==null?void 0:Se.outline),innerOutline:$($({},J.focusBar.innerOutline),(qe=(Te=e==null?void 0:e.theme)==null?void 0:Te.focusBar)==null?void 0:qe.innerOutline)},legends:{text:{fill:"var(--base-text-default)",fontSize:"var(--viz-font-size-xs)",fontFamily:"var(--hbr-font-body)","--line-legend-text-hover-font-weight":String((ke=(xe=e==null?void 0:e.legendTextHoverStyle)==null?void 0:xe.fontWeight)!=null?ke:"var(--hbr-font-weight-bold, 700)")}}})})}var Pa={default:{strokeDasharray:"1, 16",strokeWidth:8,strokeLinejoin:"round",strokeLinecap:"round"}},jr=({series:e,lineGenerator:t,points:r})=>We({series:e,points:r}).map(({key:n,color:o,points:s})=>React.createElement("path",{key:`dashed-${n}`,d:t(s)||void 0,fill:"none",stroke:o,style:Pa.default}));var pi=$({},Vt);

const { getLineSymbols, getCategoricalColors } = pi;
const toSvgId = (value) => value.replace(/[^a-zA-Z0-9_-]/g, "-");
function isCategoricalChart(chartRef) {
    var _a;
    const host = chartRef.getRootNode().host;
    return (_a = host === null || host === void 0 ? void 0 : host.hasAttribute("categorical")) !== null && _a !== void 0 ? _a : false;
}
function resolveCustomLineTooltip(callback, ...args) {
    return callback === false
        ? false
        : typeof callback === "function"
            ? () => callback(...args)
            : undefined;
}
/** Build the categorical layout as DOM so HTML sanitization keeps the custom element. */
function getDefaultLinePopoverContent(chartRef, rows) {
    if (!chartRef || !isCategoricalChart(chartRef)) {
        return rows
            .map((row) => {
            var _a, _b;
            return `<div class="--hbr-line-popover-row">
					<div>${row.swatch}${(_a = row.label) !== null && _a !== void 0 ? _a : ""}</div>
					<div>${(_b = row.value) !== null && _b !== void 0 ? _b : ""}</div>
				</div>`;
        })
            .join("");
    }
    // Stencil's optimized runtime mangles VNode fields; build this DOM directly.
    const layout = document.createElement("hbr-layout");
    layout.className = "--hbr-line-popover-layout";
    layout.setAttribute("direction", "column");
    layout.setAttribute("gap", "xs");
    Object.assign(layout.style, {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    });
    for (const { label, value, swatch } of rows) {
        const row = document.createElement("div");
        row.className = "--hbr-line-popover-row";
        const labelCell = document.createElement("div");
        const symbol = document.createElement("span");
        symbol.className = "--hbr-line-popover-swatch";
        const labelText = document.createElement("span");
        labelText.textContent = String(label !== null && label !== void 0 ? label : "");
        labelCell.appendChild(symbol);
        labelCell.appendChild(labelText);
        const valueCell = document.createElement("div");
        valueCell.className = "--hbr-line-popover-value";
        valueCell.textContent = String(value !== null && value !== void 0 ? value : "");
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        layout.appendChild(row);
        void sanitizeHtml(swatch).then((markup) => {
            symbol.innerHTML = markup;
        });
    }
    return layout;
}
function hasRenderableLineValue(point) {
    return point.y != null;
}
// axis tooltip content does not have point color
// so we need to manually inject colors to data
function getSymbolByType(type) {
    return getLineSymbols().find((symbol) => symbol.type === type);
}
function getRenderedLinePoint(chartRef, point) {
    const points = Array.from(chartRef.querySelectorAll("[series][pcolor]")).filter((element) => element.getAttribute("series") === String(point.serieId));
    return (points.find((element) => element.getAttribute("xid") === String(point.x) &&
        element.getAttribute("yid") === String(point.y)) ||
        points.find((element) => { var _a, _b; return element.getAttribute("category") === String((_b = (_a = point.data) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : point.x); }) ||
        points[0]);
}
function getLinePopoverSwatch(chartRef, serieId, color, symbol, point) {
    if (!chartRef || !isCategoricalChart(chartRef))
        return symbol ? symbol.svg(color) : "";
    const rendered = getRenderedLinePoint(chartRef, point || { serieId });
    let type = symbol === null || symbol === void 0 ? void 0 : symbol.type;
    let resolvedColor = color;
    let borderColor;
    let borderWidth = 1;
    if (rendered) {
        type = rendered.getAttribute("type") || type;
        if (point)
            resolvedColor = rendered.getAttribute("pcolor") || color;
        const core = rendered.querySelector(".--harbor-symbol-color-fill, .--harbor-symbol [stroke]");
        if (core) {
            borderColor = core.getAttribute("stroke") || undefined;
            const width = core.getAttribute("stroke-width");
            if (width !== null)
                borderWidth = Number(width);
        }
    }
    const definition = pi
        .getCategoricalLineSymbols()
        .find((definition) => definition.type === (type || "circle"));
    if (!definition)
        return symbol ? symbol.svg(resolvedColor) : "";
    return pi.getCategoricalLineSymbolSVG(definition.type, resolvedColor, {
        width: 24,
        height: 16,
        symbolSize: 12,
        lineWidth: 2,
        borderColor: borderColor !== null && borderColor !== void 0 ? borderColor : "var(--base-bg-weak-default)",
        borderWidth,
    });
}
function getLinePopoverPointRow(chartRef, point, label = point.serieId) {
    var _a;
    const data = point.data || {};
    return {
        label,
        value: data.yFormatted != null
            ? data.yFormatted
            : data.y != null
                ? data.y
                : point.y,
        swatch: getLinePopoverSwatch(chartRef, point.serieId, point.color || "", point.symbol ||
            getSymbolByType((_a = getRenderedLinePoint(chartRef, point)) === null || _a === void 0 ? void 0 : _a.getAttribute("type")), point),
    };
}
function injectCategoricalColorsAndSymbolToData(data, chartRef, config) {
    var _a, _b;
    const visibleData = data.filter(hasRenderableLineValue);
    const symbols = getLineSymbols();
    const series = Array.from(new Set(visibleData.map((point) => point.serieId)));
    const configuredSeries = (_b = (_a = config === null || config === void 0 ? void 0 : config.data) === null || _a === void 0 ? void 0 : _a.map((item) => String(item.id))) !== null && _b !== void 0 ? _b : series;
    const customColors = Array.isArray(config === null || config === void 0 ? void 0 : config.colors) && config.colors.length
        ? config.colors
        : undefined;
    const colors = customColors !== null && customColors !== void 0 ? customColors : getCategoricalColors(configuredSeries.length);
    return visibleData.map((d) => {
        var _a;
        const renderedPoint = getRenderedLinePoint(chartRef, d);
        const seriesIndex = configuredSeries.indexOf(String(d.serieId));
        return Object.assign(Object.assign({}, d), { symbol: getSymbolByType((renderedPoint === null || renderedPoint === void 0 ? void 0 : renderedPoint.getAttribute("type")) ||
                ((_a = config === null || config === void 0 ? void 0 : config.symbolTypes) === null || _a === void 0 ? void 0 : _a[seriesIndex])) || symbols[seriesIndex % symbols.length], color: (renderedPoint === null || renderedPoint === void 0 ? void 0 : renderedPoint.getAttribute("pcolor")) ||
                (customColors && seriesIndex >= 0
                    ? customColors[seriesIndex % customColors.length]
                    : d.color || colors[seriesIndex]) });
    });
}
function showLinePointPopover(tooltipRef, chartRef, point, event, customTooltipFunc) {
    var _a;
    const selector = `[xid='${point.x}'][yid='${point.y}']`;
    const type = (_a = getRenderedLinePoint(chartRef, point)) === null || _a === void 0 ? void 0 : _a.getAttribute("type");
    showChartPopover(tooltipRef, point, Object.assign(Object.assign({}, event), { target: type
            ? selector
            : chartRef.querySelectorAll("circle")[point.index || 0] }), resolveCustomLineTooltip(customTooltipFunc, point, event, h), () => {
        var _a, _b;
        return getDefaultLinePopoverContent(chartRef, [
            getLinePopoverPointRow(chartRef, point, (_b = (_a = point.data.xFormatted) !== null && _a !== void 0 ? _a : point.data.x) !== null && _b !== void 0 ? _b : point.x),
        ]);
    });
}
function toggleLineSlicePopover(tooltipRef, chartRef, slice, event, customTooltipFunc) {
    const points = slice.points || [];
    if (!points.length) {
        hideChartPopover(tooltipRef);
        return;
    }
    const eventTarget = event && typeof event === "object" && "currentTarget" in event
        ? event
            .currentTarget
        : event.target;
    showChartPopover(tooltipRef, points, Object.assign(Object.assign({}, event), { target: eventTarget ||
            chartRef.querySelector(`[xid='${points[0].x}'][yid='${points[0].y}']`) ||
            chartRef.querySelectorAll("circle")[points[0].index || 0] }), resolveCustomLineTooltip(customTooltipFunc, points, event, h), () => getDefaultLinePopoverContent(chartRef, points.map((point) => getLinePopoverPointRow(chartRef, point))));
}
function toggleLineLegendPopover(legendData, tooltipRef, customTooltipFunc, chartRef) {
    var _a, _b;
    const { serieId, data, event, fill, xFormat, yFormat } = legendData || {};
    if (!legendData) {
        hideChartPopover(tooltipRef);
    }
    else {
        const symbols = getLineSymbols();
        const formatX = Dt$1(xFormat);
        const formatY = Dt$1(yFormat);
        // hard wire id may have some issue
        const series = Array.from(new Set(data.map((item) => item.id)));
        const targetSymbol = (chartRef &&
            getSymbolByType((_a = Array.from(chartRef.querySelectorAll("[series]"))
                .find((element) => element.getAttribute("series") === serieId)) === null || _a === void 0 ? void 0 : _a.getAttribute("type"))) ||
            symbols[series.indexOf(serieId) % symbols.length];
        const targetSeies = ((_b = data.find((r) => r.id === serieId)) === null || _b === void 0 ? void 0 : _b.data) || [];
        showChartPopover(tooltipRef, { data, event }, event, resolveCustomLineTooltip(customTooltipFunc, Object.assign(Object.assign({}, data), { targetSymbol, targetSeies, serieId }), event, h), () => getDefaultLinePopoverContent(chartRef, targetSeies
            .filter((point) => point.y != null)
            .map((point) => ({
            label: formatX(point.x),
            value: formatY(point.y),
            swatch: getLinePopoverSwatch(chartRef, serieId, fill, targetSymbol),
        }))));
    }
}
function toggleLineMarkerLegendPopover(legendData, tooltipRef, customTooltipFunc, event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (!legendData || typeof customTooltipFunc !== "function") {
        hideChartPopover(tooltipRef);
        return;
    }
    const markerLabel = (_b = (_a = legendData.markerLegendLabel) !== null && _a !== void 0 ? _a : legendData.markerValue) !== null && _b !== void 0 ? _b : "";
    const markerValue = (_d = (_c = legendData.markerValue) !== null && _c !== void 0 ? _c : legendData.markerLegendLabel) !== null && _d !== void 0 ? _d : "";
    const fill = legendData.color || "rgba(255, 0, 0, 0.1)";
    const stroke = ((_e = legendData.lineStyle) === null || _e === void 0 ? void 0 : _e.stroke) || fill;
    const strokeWidth = Math.min(Number((_f = legendData.lineStyle) === null || _f === void 0 ? void 0 : _f.strokeWidth) || 3, 3);
    const dashArray = (_g = legendData.lineStyle) === null || _g === void 0 ? void 0 : _g.strokeDasharray;
    const markerKey = `${(_h = legendData.axis) !== null && _h !== void 0 ? _h : "y"}-${markerLabel}-${markerValue}`;
    const gradientId = `marker-area-gradient-${toSvgId(String(markerKey))}`;
    const isHorizontalArea = legendData.axis === "x";
    const gradientX2 = isHorizontalArea ? "100%" : "0%";
    const gradientY2 = isHorizontalArea ? "0%" : "100%";
    const gradientStartOpacity = isHorizontalArea ? 0 : (_j = legendData.opacity) !== null && _j !== void 0 ? _j : 1;
    const gradientEndOpacity = isHorizontalArea ? (_k = legendData.opacity) !== null && _k !== void 0 ? _k : 1 : 0;
    const shadedPattern = legendData.markerAreaStyle === "shaded"
        ? `
		<defs>
			<pattern id="marker-area-shaded-pattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
				<rect x="0" y="0" width="4" height="4" fill="rgba(255, 255, 255, 0.3)"></rect>
				<path d="M0 0 L0 4" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2"></path>
			</pattern>
		</defs>
		`
        : "";
    const gradientDefs = legendData.markerAreaStyle === "gradient"
        ? `
		<defs>
			<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="${gradientX2}" y2="${gradientY2}">
				<stop offset="0%" stop-color="${fill}" stop-opacity="${gradientStartOpacity}"></stop>
				<stop offset="100%" stop-color="${fill}" stop-opacity="${gradientEndOpacity}"></stop>
			</linearGradient>
		</defs>
		`
        : "";
    const symbol = `<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" focusable="false">${shadedPattern}
		${gradientDefs}
		<rect x="0" y="2" width="20" height="12" fill="${legendData.markerAreaStyle === "gradient" ? `url(#${gradientId})` : fill}" opacity="${legendData.markerAreaStyle === "gradient" ? 1 : (_l = legendData.opacity) !== null && _l !== void 0 ? _l : 1}"></rect>
		${legendData.markerAreaStyle === "shaded"
        ? '<rect x="0" y="2" width="20" height="12" fill="url(#marker-area-shaded-pattern)"></rect>'
        : ""}
		<line x1="0" y1="2" x2="20" y2="2" stroke="${stroke}" stroke-width="${strokeWidth}"${dashArray ? ` stroke-dasharray="${dashArray}"` : ""}></line>
	</svg>`;
    showChartPopover(tooltipRef, legendData, event, () => customTooltipFunc === null || customTooltipFunc === void 0 ? void 0 : customTooltipFunc(Object.assign(Object.assign({}, legendData), { markerLabel,
        markerValue }), event, h), () => `<div class="--hbr-line-popover-row">
				<div>
					${symbol}
					${markerLabel}
				</div>
				<div>
					${markerValue}
				</div>
			</div>`);
}
/**
 *
 * @param data - either slice data or point data
 * @param chartContextRoot
 * @returns either return a tooltip div for nivo slice to consume
 * @returns or set the content of a existing hbr-popover with no return
 */
function generateOrSetTooltipContentRow(data, chartContextRoot, _showOnlySelectedSerie = false, itemTooltip) {
    const { slice, point } = data || {};
    const { tooltipRef, chartRef } = chartContextRoot;
    if (itemTooltip === false) {
        hideChartPopover(tooltipRef);
        return null;
    }
    if (slice === null || slice === void 0 ? void 0 : slice.points) {
        const custom = typeof itemTooltip === "function"
            ? itemTooltip(slice.points, null, h)
            : undefined;
        if (custom === false) {
            hideChartPopover(tooltipRef);
            return null;
        }
        const content = custom !== null && custom !== void 0 ? custom : getDefaultLinePopoverContent(chartRef, slice.points.map((point) => getLinePopoverPointRow(chartRef, point)));
        return react.exports.createElement("div", {
            className: "--hbr-line-popover-container",
            ref: (element) => {
                if (!element)
                    return;
                element.replaceChildren();
                if (typeof content === "string") {
                    void sanitizeHtml(content).then((markup) => {
                        element.innerHTML = markup;
                    });
                }
                else {
                    const node = content instanceof Node
                        ? content
                        : createDOMElementFromVNode(content);
                    if (node)
                        element.appendChild(node);
                }
            },
        });
    }
    if (point) {
        showLinePointPopover(tooltipRef, chartRef, point, {}, itemTooltip);
    }
    else {
        hideChartPopover(tooltipRef);
    }
}
const showHorizontalAxisPopover = (data, event, chartContextRoot, customTooltipFunc) => {
    const { tooltipRef, chartRef, resolvedConfig } = chartContextRoot;
    const { target } = event;
    const fullData = injectCategoricalColorsAndSymbolToData(data, chartRef, resolvedConfig);
    const formatY = Dt$1(resolvedConfig === null || resolvedConfig === void 0 ? void 0 : resolvedConfig.yFormat);
    showChartPopover(tooltipRef, fullData, event, resolveCustomLineTooltip(customTooltipFunc, fullData, target), () => getDefaultLinePopoverContent(chartRef, fullData.map((point) => ({
        label: point.serieId,
        value: formatY(point.y),
        swatch: getLinePopoverSwatch(chartRef, point.serieId, point.color || "", point.symbol, point),
    }))));
};
const showVerticalAxisPopover = (data, event, chartContextRoot, customTooltipFunc) => {
    const { tooltipRef, chartRef, resolvedConfig } = chartContextRoot;
    const { target } = event;
    const fullData = injectCategoricalColorsAndSymbolToData(data, chartRef, resolvedConfig);
    showChartPopover(tooltipRef, fullData, event, resolveCustomLineTooltip(customTooltipFunc, fullData, target), () => false);
};
const hideLinePopover = (tooltipRef) => {
    hideChartPopover(tooltipRef);
};
const convertLineDataToCSV = (arr) => {
    let csv = "group,x,y\n";
    arr.forEach((group) => {
        const groupId = group.id;
        group.data.forEach((item) => {
            var _a, _b;
            const x = (_a = item.x) !== null && _a !== void 0 ? _a : "";
            const y = (_b = item.y) !== null && _b !== void 0 ? _b : "";
            csv += `${groupId},${x},${y}\n`;
        });
    });
    return csv;
};

function isLineChartEasyConfig(config) {
    return ("xKey" in config &&
        "yKey" in config &&
        typeof config.xKey === "string" &&
        typeof config.yKey === "string");
}
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/;
/** Only unambiguous ISO strings and valid Date objects participate in time inference. */
function getDate(value) {
    if (value instanceof Date) {
        return Number.isFinite(value.valueOf()) ? value : undefined;
    }
    if (typeof value !== "string" || !ISO_DATE.test(value))
        return undefined;
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    const calendarDate = new Date(0);
    calendarDate.setUTCFullYear(year, month - 1, day);
    if (calendarDate.getUTCFullYear() !== year ||
        calendarDate.getUTCMonth() !== month - 1 ||
        calendarDate.getUTCDate() !== day) {
        return undefined;
    }
    const date = new Date(value);
    return Number.isFinite(date.valueOf()) ? date : undefined;
}
function isXValue(value) {
    return ((typeof value === "number" && Number.isFinite(value)) ||
        (typeof value === "string" && value.trim().length > 0) ||
        (value instanceof Date && Number.isFinite(value.valueOf())));
}
function getYValue(value) {
    return isXValue(value) ? value : null;
}
const formatPercentage = (value) => `${value}%`;
const suppressAxisPopover = () => false;
const formatDate = (value) => {
    const date = getDate(value);
    return date
        ? date
            .toISOString()
            .replace("T", " ")
            .replace(/\.000Z$/, "")
        : String(value);
};
function getTimeAxisDefaults(values) {
    const uniqueDates = new Map();
    for (const date of values)
        uniqueDates.set(date.valueOf(), date);
    const dates = Array.from(uniqueDates.values()).sort((first, second) => first.valueOf() - second.valueOf());
    const sameDay = dates.every((date) => date.toISOString().slice(0, 10) === dates[0].toISOString().slice(0, 10));
    const showTime = dates.some((date) => date.toISOString().slice(11, 23) !== "00:00:00.000");
    const showMilliseconds = dates.some((date) => date.getUTCMilliseconds() !== 0);
    const showSeconds = dates.some((date) => date.getUTCSeconds() !== 0);
    const timeEnd = showMilliseconds ? 23 : showSeconds ? 19 : 16;
    const tickCount = Math.min(6, dates.length);
    const tickValues = dates.length <= tickCount
        ? dates
        : Array.from({ length: tickCount }, (_value, index) => dates[Math.round((index * (dates.length - 1)) / (tickCount - 1))]);
    return {
        tickValues,
        format: (value) => {
            const date = getDate(value);
            if (!date)
                return String(value);
            const isoDate = date.toISOString();
            const dateLabel = isoDate.slice(0, 10);
            const timeLabel = isoDate.slice(11, timeEnd);
            return showTime
                ? sameDay
                    ? timeLabel
                    : `${dateLabel} ${timeLabel}`
                : dateLabel;
        },
    };
}
function resolveHighlight(highlight, parseDates) {
    var _a;
    const mode = highlight.mode;
    const range = Object.assign({}, highlight);
    Reflect.deleteProperty(range, "mode");
    const resolved = Object.assign({ fill: "var(--base-bg-medium-default)", opacity: 1, pointSize: 0 }, range, {
        border: Object.assign({}, range.border, {
            vertical: Object.assign({ stroke: "var(--control-border-strong-default)", strokeWidth: 1 }, (_a = range.border) === null || _a === void 0 ? void 0 : _a.vertical),
        }),
        lineStyleInHighlight: Object.assign(mode === "incomplete"
            ? { strokeOpacity: 0 }
            : {
                stroke: "var(--base-border-strong-default)",
                strokeWidth: 1.5,
                strokeDasharray: "2 2",
            }, range.lineStyleInHighlight),
    });
    if (parseDates) {
        resolved.x1 = getDate(range.x1) || range.x1;
        resolved.x2 = getDate(range.x2) || range.x2;
    }
    return resolved;
}
function setMissingOptions(options, defaults) {
    for (const key of Object.keys(defaults)) {
        if (options[key] === undefined)
            options[key] = defaults[key];
    }
}
function applyAreaDefaults(resolved, input) {
    if (input.enableArea !== true || input.isSparkline)
        return;
    const yScale = {
        type: "linear",
        min: 0,
        max: 100,
        stacked: true,
    };
    resolved.yScale =
        input.yScale === undefined
            ? yScale
            : input.yScale.type === "linear"
                ? Object.assign(Object.assign({}, yScale), input.yScale) : input.yScale;
    if (resolved.areaStyle === undefined)
        resolved.areaStyle = "gradient";
}
function applySparklineDefaults(options, data, percentage, height) {
    var _a, _b, _c;
    if (!options.isSparkline)
        return;
    if (options.axisBottom === undefined && height > 0 && height <= 36) {
        options.axisBottom = null;
    }
    if (options.interactiveMode === undefined &&
        options.hoverMode === undefined &&
        ((_a = options.verticalFocusBar) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
        options.interactiveMode = "points";
    }
    setMissingOptions(options, {
        isInteractive: false,
        isFocusable: false,
        pointSize: 8,
        axisLeft: null,
        axisRight: null,
        axisTop: null,
        legends: [],
        colors: ["var(--data-viz-categorical-1-default)"],
        enableArea: true,
        areaBaselineValue: 0,
        areaStyle: "gradient",
        enableGridX: false,
        enableGridY: true,
        enableCrosshair: false,
    });
    options.margin = Object.assign({ top: 0, right: 0, bottom: options.axisBottom === null ? 5 : 29, left: 0 }, options.margin);
    const yScale = { type: "linear", min: 0, max: 100 };
    options.yScale =
        options.yScale === undefined
            ? yScale
            : options.yScale.type === "linear"
                ? Object.assign(Object.assign({}, yScale), options.yScale) : options.yScale;
    options.verticalFocusBar = Object.assign({ enabled: false }, options.verticalFocusBar);
    if (options.axisBottom !== null) {
        const values = data
            .flatMap((series) => series.data.map((point) => point.x))
            .filter(isXValue);
        const first = values[0];
        const last = values[values.length - 1];
        const sameEndpoint = first instanceof Date && last instanceof Date
            ? first.valueOf() === last.valueOf()
            : first === last;
        options.axisBottom = Object.assign(Object.assign({ tickSize: 0, tickPadding: 8, tooltip: suppressAxisPopover }, (values.length
            ? { tickValues: sameEndpoint ? [first] : [first, last] }
            : {})), options.axisBottom);
    }
    const theme = options.theme;
    const ticks = (_b = theme === null || theme === void 0 ? void 0 : theme.axis) === null || _b === void 0 ? void 0 : _b.ticks;
    const text = Object.assign({ fill: "var(--base-text-medium-default)" }, ticks === null || ticks === void 0 ? void 0 : ticks.text);
    const tickTheme = Object.assign(Object.assign({}, ticks), { text });
    options.theme = Object.assign(Object.assign({}, theme), { grid: Object.assign(Object.assign({}, theme === null || theme === void 0 ? void 0 : theme.grid), { line: Object.assign({ stroke: "var(--base-border-default)" }, (_c = theme === null || theme === void 0 ? void 0 : theme.grid) === null || _c === void 0 ? void 0 : _c.line) }), axis: Object.assign(Object.assign({}, theme === null || theme === void 0 ? void 0 : theme.axis), { ticks: tickTheme }) });
    if (percentage && options.yFormat === undefined)
        options.yFormat = formatPercentage;
}
function applyMarkerDefaults(resolved, input, data, easy) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!((_a = resolved.markers) === null || _a === void 0 ? void 0 : _a.length))
        return;
    const sparkline = resolved.isSparkline;
    const multiple = resolved.markers.length > 1;
    let hasStatus = false;
    resolved.markers = resolved.markers.map((marker) => {
        var _a, _b, _c;
        if (!easy &&
            !sparkline &&
            marker.status === undefined &&
            marker.axis !== undefined)
            return marker;
        const status = ["positive", "negative", "warning", "info"].includes(marker.status)
            ? marker.status
            : "neutral";
        const sentiment = status !== "neutral";
        hasStatus || (hasStatus = sentiment);
        const color = sentiment
            ? status === "info"
                ? "var(--info-icon-default)"
                : `var(--data-viz-${status}-default)`
            : "var(--base-border-strong-default)";
        const defaults = {
            value: marker.value,
            axis: "y",
            enableArea: sparkline || !multiple,
            showMarkerLegend: !sparkline && !multiple,
            lineStyle: {
                stroke: sparkline
                    ? "var(--base-text-medium-default)"
                    : multiple && sentiment
                        ? color
                        : "var(--base-border-strong-default)",
                strokeWidth: sparkline ? 1.5 : 2,
                strokeDasharray: !sparkline && multiple ? "4 2" : "3 3",
            },
        };
        if (sentiment)
            defaults.lineColorContained = () => color;
        if (defaults.enableArea) {
            defaults.color = color;
            defaults.opacity = sparkline ? 0.12 : 0.15;
            defaults.markerAreaStyle = sparkline ? "solid" : "shaded";
        }
        if (defaults.showMarkerLegend) {
            defaults.legendLabel = "Threshold";
            defaults.markerLegendPosition = {
                translateX: -((_b = (_a = resolved.margin) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 60),
            };
        }
        const value = input.percentage ? `${marker.value}%` : String(marker.value);
        if (sparkline && resolved.axisBottom !== null) {
            defaults.annotation = {
                content: react.exports.createElement("span", {}, value),
                position: "start",
                offsetX: -5,
                width: 25,
                height: 16,
                style: { color: "var(--base-text-medium-default)", fontSize: "12px" },
            };
        }
        else if (!sparkline && multiple && sentiment) {
            defaults.annotation = {
                content: react.exports.createElement("hbr-icon", {
                    name: `status-${status}`,
                    sentiment: status,
                    label: `${status[0].toUpperCase()}${status.slice(1)} threshold: ${value}`,
                    style: { fontSize: "16px" },
                }),
                position: "end",
                offsetX: 12,
                width: 16,
                height: 16,
            };
        }
        const result = Object.assign(Object.assign({}, defaults), marker);
        Reflect.deleteProperty(result, "status");
        result.lineStyle = Object.assign(Object.assign({}, defaults.lineStyle), marker.lineStyle);
        if (defaults.annotation && marker.annotation !== null) {
            result.annotation = Object.assign(Object.assign(Object.assign({}, defaults.annotation), marker.annotation), { style: Object.assign(Object.assign({}, defaults.annotation.style), (_c = marker.annotation) === null || _c === void 0 ? void 0 : _c.style) });
        }
        if (defaults.markerLegendPosition) {
            result.markerLegendPosition = Object.assign(Object.assign({}, defaults.markerLegendPosition), marker.markerLegendPosition);
        }
        return result;
    });
    if (!sparkline &&
        hasStatus &&
        resolved.colors === undefined &&
        data.filter((series) => series.data.some((point) => point.y != null))
            .length <= 1) {
        resolved.colors = ["var(--data-viz-positive-default)"];
    }
    const showLegend = resolved.markers.some((marker) => marker.showMarkerLegend);
    const showIcon = !sparkline && multiple && hasStatus;
    if (showLegend || showIcon) {
        resolved.margin = Object.assign(Object.assign(Object.assign({}, resolved.margin), (showLegend && ((_b = input.margin) === null || _b === void 0 ? void 0 : _b.bottom) === undefined
            ? { bottom: Math.max((_d = (_c = resolved.margin) === null || _c === void 0 ? void 0 : _c.bottom) !== null && _d !== void 0 ? _d : 0, 80) }
            : {})), (showIcon && ((_e = input.margin) === null || _e === void 0 ? void 0 : _e.right) === undefined
            ? { right: Math.max((_g = (_f = resolved.margin) === null || _f === void 0 ? void 0 : _f.right) !== null && _g !== void 0 ? _g : 0, 44) }
            : {}));
    }
}
function resolveLineChartConfig(config, layout = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (!isLineChartEasyConfig(config)) {
        if (!config.isSparkline &&
            config.enableArea !== true &&
            config.percentage === undefined &&
            !((_a = config.markers) === null || _a === void 0 ? void 0 : _a.some((marker) => marker.status !== undefined || marker.axis === undefined)))
            return config;
        const resolved = Object.assign({}, config);
        Reflect.deleteProperty(resolved, "percentage");
        applySparklineDefaults(resolved, (_b = resolved.data) !== null && _b !== void 0 ? _b : [], config.percentage, layout.height);
        if (config.percentage && !config.isSparkline) {
            if (resolved.yScale === undefined)
                resolved.yScale = { type: "linear", min: 0, max: 100 };
            if (resolved.yFormat === undefined)
                resolved.yFormat = formatPercentage;
        }
        applyAreaDefaults(resolved, config);
        applyMarkerDefaults(resolved, config, (_c = resolved.data) !== null && _c !== void 0 ? _c : [], false);
        return resolved;
    }
    const { data: rows, xKey, yKey, groupKey, xTitle, yTitle, percentage, highlight, } = config;
    const options = Object.assign({}, config);
    for (const key of [
        "data",
        "xKey",
        "yKey",
        "groupKey",
        "xTitle",
        "yTitle",
        "percentage",
        "highlight",
    ]) {
        Reflect.deleteProperty(options, key);
    }
    const getRowValue = (row, key) => row[key];
    const validRows = rows.filter((row) => isXValue(getRowValue(row, xKey)));
    const xValues = validRows.map((row) => getRowValue(row, xKey));
    const isNumeric = xValues.length > 0 && xValues.every((value) => typeof value === "number");
    const dates = xValues.map(getDate);
    const isTime = dates.length > 0 && dates.every(Boolean);
    const inferredXScale = isNumeric
        ? { type: "linear", min: "auto", max: "auto" }
        : isTime
            ? {
                type: "time",
                format: "native",
                precision: "millisecond",
                useUTC: true,
            }
            : { type: "point" };
    const xScale = (_d = options.xScale) !== null && _d !== void 0 ? _d : inferredXScale;
    const parseDates = isTime &&
        xScale.type === "time" &&
        (xScale.format === undefined || xScale.format === "native");
    const groups = new Map();
    const fallbackId = yTitle || yKey;
    for (const row of validRows) {
        const groupValue = groupKey ? getRowValue(row, groupKey) : undefined;
        const id = typeof groupValue === "string" || typeof groupValue === "number"
            ? groupValue
            : fallbackId;
        let series = groups.get(id);
        if (!series) {
            series = { id, data: [] };
            groups.set(id, series);
        }
        const x = getRowValue(row, xKey);
        const point = Object.assign(Object.assign({}, row), { x: parseDates ? getDate(x) : x, y: getYValue(getRowValue(row, yKey)) });
        series.data.push(point);
    }
    const data = Array.from(groups.values());
    applySparklineDefaults(options, data, percentage, layout.height);
    const nonemptySeriesCount = data.filter((series) => series.data.some((point) => point.y !== null)).length;
    const showLegends = options.legends
        ? options.legends.length > 0
        : nonemptySeriesCount > 1;
    const automaticLegends = options.legends === undefined && showLegends;
    const axisBottomDefaults = parseDates
        ? getTimeAxisDefaults(dates)
        : {};
    if (xTitle) {
        Object.assign(axisBottomDefaults, {
            legend: xTitle,
            legendPosition: "middle",
            legendOffset: 42,
        });
    }
    const axisLeftDefaults = {};
    if (percentage) {
        axisLeftDefaults.format = formatPercentage;
        if (options.yScale === undefined) {
            axisLeftDefaults.tickValues = [0, 20, 40, 60, 80, 100];
        }
    }
    if (yTitle) {
        Object.assign(axisLeftDefaults, {
            legend: yTitle,
            legendPosition: "middle",
            legendOffset: -52,
        });
    }
    const axisBottom = options.axisBottom === null
        ? null
        : Object.assign(axisBottomDefaults, options.axisBottom);
    const axisLeft = options.axisLeft === null
        ? null
        : Object.assign(axisLeftDefaults, options.axisLeft);
    const axisBottomMargin = axisBottom === null ? 16 : axisBottom.legend ? 54 : 32;
    const defaultYScale = {
        type: "linear",
        min: percentage ? 0 : "auto",
        max: percentage ? 100 : "auto",
        stacked: false,
        reverse: false,
    };
    const resolved = Object.assign(Object.assign({}, options), { data,
        xScale, yScale: options.yScale === undefined
            ? defaultYScale
            : options.yScale.type === "linear"
                ? Object.assign(Object.assign({}, defaultYScale), options.yScale) : options.yScale, axisBottom,
        axisLeft, margin: Object.assign({ top: 16, right: 16, bottom: axisBottomMargin + (showLegends ? 40 : 0), left: axisLeft === null ? 16 : axisLeft.legend ? 64 : 48 }, options.margin) });
    if (automaticLegends) {
        resolved.autoSize = (_e = options.autoSize) !== null && _e !== void 0 ? _e : {
            axisLabels: false,
            dynamicLegend: true,
            dynamicHeightMargin: false,
        };
        const dynamicLegend = resolved.autoSize !== false &&
            (typeof resolved.autoSize !== "object" ||
                resolved.autoSize.dynamicLegend !== false);
        resolved.legends = [
            Object.assign(Object.assign({ data: data.map((series) => ({ id: series.id, label: series.id })), anchor: "bottom-left", direction: "row", justify: false, translateX: -((_g = (_f = resolved.margin) === null || _f === void 0 ? void 0 : _f.left) !== null && _g !== void 0 ? _g : 0), padding: { top: axisBottomMargin + 12 } }, (dynamicLegend ? {} : { translateY: axisBottomMargin + 40 })), { itemWidth: dynamicLegend ? 0 : 100, itemHeight: 28, itemsSpacing: 16, itemDirection: "left-to-right", itemOpacity: 1, symbolSize: 24, symbolSpacing: 6, symbolBorderWidth: (_h = options.pointBorderWidth) !== null && _h !== void 0 ? _h : 1, symbolBorderColor: (_j = options.pointBorderColor) !== null && _j !== void 0 ? _j : "var(--base-bg-weak-default)" }),
        ];
        resolved.theme = Object.assign(Object.assign({}, options.theme), { legends: Object.assign(Object.assign({}, (_k = options.theme) === null || _k === void 0 ? void 0 : _k.legends), { text: Object.assign({ fontSize: "var(--viz-font-size-xs, 12px)" }, (_m = (_l = options.theme) === null || _l === void 0 ? void 0 : _l.legends) === null || _m === void 0 ? void 0 : _m.text) }) });
        resolved.isFocusable = (_o = options.isFocusable) !== null && _o !== void 0 ? _o : true;
    }
    if (highlight !== undefined) {
        resolved.highlight = highlight.map((range) => resolveHighlight(range, parseDates));
    }
    if (nonemptySeriesCount <= 1 &&
        options.interactiveMode === undefined &&
        options.hoverMode === undefined &&
        ((_p = options.verticalFocusBar) === null || _p === void 0 ? void 0 : _p.enabled) === undefined) {
        resolved.interactiveMode = "points";
    }
    if (parseDates && options.xFormat === undefined) {
        resolved.xFormat = formatDate;
    }
    if (percentage) {
        if (options.yFormat === undefined) {
            resolved.yFormat = formatPercentage;
        }
        if (!options.isSparkline &&
            options.yScale === undefined &&
            options.gridYValues === undefined) {
            resolved.gridYValues = [0, 20, 40, 60, 80, 100];
        }
    }
    if (options.legends === undefined && !showLegends) {
        resolved.legends = [];
    }
    applyAreaDefaults(resolved, config);
    applyMarkerDefaults(resolved, config, data, true);
    return resolved;
}
const getAutomaticMarkerLegendIndices = (input, rendered) => {
    var _a;
    if (input.isSparkline || input.layers !== undefined)
        return [];
    const easy = isLineChartEasyConfig(input);
    return ((_a = rendered.markers) !== null && _a !== void 0 ? _a : []).flatMap((marker, index) => {
        var _a, _b;
        const original = (_a = input.markers) === null || _a === void 0 ? void 0 : _a[index];
        return marker.showMarkerLegend &&
            original &&
            (easy || original.axis === undefined || original.status !== undefined) &&
            ((_b = original.markerLegendPosition) === null || _b === void 0 ? void 0 : _b.translateY) === undefined
            ? [index]
            : [];
    });
};
/** Marker shortcut legends need current chart dimensions, including on height-only resizes. */
function hasAutomaticLineMarkerLegends(input, rendered) {
    return getAutomaticMarkerLegendIndices(input, rendered).length > 0;
}
/** Position automatic legends after the renderer has resolved their sizing and spacing. */
function applyMagneticLineLegendLayout(input, rendered, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const automaticSeriesLegends = isLineChartEasyConfig(input) && input.legends === undefined;
    const legends = automaticSeriesLegends
        ? (_a = rendered.legends) === null || _a === void 0 ? void 0 : _a.map((legend) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, legend), { anchor: "bottom-left", translateX: -((_b = (_a = rendered.margin) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 0) }));
        })
        : rendered.legends;
    const automaticMarkers = options.markerLegends === false
        ? []
        : getAutomaticMarkerLegendIndices(input, rendered);
    if (!automaticMarkers.length) {
        return automaticSeriesLegends ? Object.assign(Object.assign({}, rendered), { legends }) : rendered;
    }
    const markers = (_b = rendered.markers) !== null && _b !== void 0 ? _b : [];
    const visibleMarkers = markers.filter((marker) => marker.showMarkerLegend);
    const layout = (_c = visibleMarkers[0]) === null || _c === void 0 ? void 0 : _c.markerLegendLayout;
    const direction = (_d = layout === null || layout === void 0 ? void 0 : layout.direction) !== null && _d !== void 0 ? _d : "column";
    const rowPitch = ((_e = layout === null || layout === void 0 ? void 0 : layout.itemHeight) !== null && _e !== void 0 ? _e : 20) + ((_f = layout === null || layout === void 0 ? void 0 : layout.itemsSpacing) !== null && _f !== void 0 ? _f : 0);
    const axis = rendered.axisBottom;
    const axisClearance = axis === null
        ? 0
        : Math.max(32, (axis === null || axis === void 0 ? void 0 : axis.legend) ? ((_g = axis.legendOffset) !== null && _g !== void 0 ? _g : 42) + 12 : 0);
    // A bottom-anchored SVG legend ends at innerHeight + translateY, including wrapped rows.
    const seriesBottom = Math.max(0, ...(legends !== null && legends !== void 0 ? legends : [])
        .filter((legend) => ["bottom", "bottom-left", "bottom-right"].includes(legend.anchor))
        .map((legend) => { var _a; return (_a = legend.translateY) !== null && _a !== void 0 ? _a : 0; }));
    const markerOffset = Math.max(axisClearance, seriesBottom) + 12;
    const automaticSet = new Set(automaticMarkers);
    let visibleIndex = 0;
    const offsets = markers.map((marker, index) => {
        if (!marker.showMarkerLegend)
            return 0;
        const offset = markerOffset + (direction === "row" ? 0 : visibleIndex * rowPitch);
        visibleIndex += 1;
        return automaticSet.has(index) ? offset : 0;
    });
    // The existing marker swatch is 20px tall, independently of its configured row pitch.
    const requiredBottom = Math.max(...offsets) + 20 + 12;
    const chartHeight = (_h = options.height) !== null && _h !== void 0 ? _h : 360;
    const margin = Object.assign(Object.assign({}, rendered.margin), { bottom: (_k = (_j = input.margin) === null || _j === void 0 ? void 0 : _j.bottom) !== null && _k !== void 0 ? _k : Math.min(Math.max((_m = (_l = rendered.margin) === null || _l === void 0 ? void 0 : _l.bottom) !== null && _m !== void 0 ? _m : 0, requiredBottom), Math.max(0, chartHeight - ((_p = (_o = rendered.margin) === null || _o === void 0 ? void 0 : _o.top) !== null && _p !== void 0 ? _p : 0))) });
    const innerHeight = Math.max(0, chartHeight - ((_q = margin.top) !== null && _q !== void 0 ? _q : 0) - margin.bottom);
    return Object.assign(Object.assign({}, rendered), { legends,
        margin, markers: markers.map((marker, index) => {
            var _a, _b, _c, _d, _e;
            return automaticSet.has(index)
                ? Object.assign(Object.assign({}, marker), { markerLegendPosition: Object.assign(Object.assign({}, marker.markerLegendPosition), { translateX: (_d = (_c = (_b = (_a = input.markers) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.markerLegendPosition) === null || _c === void 0 ? void 0 : _c.translateX) !== null && _d !== void 0 ? _d : -((_e = margin.left) !== null && _e !== void 0 ? _e : 0), translateY: innerHeight + offsets[index] }) }) : marker;
        }) });
}

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}.--line-chart:not(.--categorical) svg>g>path{visibility:visible;opacity:1;transition:visibility 0s,opacity .15s linear}.--line-chart:not(.--categorical) svg>g>path.--line--dehighlight{opacity:.1}.--line-chart:not(.--categorical) svg>g>path.--line--deselected{opacity:.1}.--line-chart:not(.--categorical) svg>g>path.--line--selected{opacity:1}.--line-chart:not(.--categorical) svg>g>path.--line--highlight{opacity:.7}.--line-chart:not(.--categorical) svg>g>path.--line--deselected.--line--highlight{opacity:.7}.--line-chart:not(.--categorical) .--point path,.--line-chart:not(.--categorical) .--point rect,.--line-chart:not(.--categorical) .--point circle{visibility:visible;opacity:1;transition:visibility 0s,opacity .15s linear}.--line-chart:not(.--categorical) .--point--dehighlight path,.--line-chart:not(.--categorical) .--point--dehighlight rect,.--line-chart:not(.--categorical) .--point--dehighlight circle{opacity:.1}.--line-chart:not(.--categorical) .--point--highlight{opacity:.7}.--line-chart:not(.--categorical) .--point--deselected path,.--line-chart:not(.--categorical) .--point--deselected rect,.--line-chart:not(.--categorical) .--point--deselected circle{opacity:.1}.--line-chart:not(.--categorical) .--point--deselected.--point--highlight path,.--line-chart:not(.--categorical) .--point--deselected.--point--highlight rect,.--line-chart:not(.--categorical) .--point--deselected.--point--highlight circle{opacity:.7}.--line-chart:not(.--categorical) .--point--selected path,.--line-chart:not(.--categorical) .--point--selected circle{opacity:1!important}.--line-chart:not(.--categorical) .legend-event-rect{border-radius:1px}.--line-chart:not(.--categorical) .legend-event-rect:focus-visible{border:4px solid var(--viz-color-neutral-100);outline:2px solid -webkit-focus-ring-color;outline-offset:2px}.--line-chart:not(.--categorical) .legend-event-rect:focus:not(:focus-visible){border:0;outline:0;outline-offset:0}.--line-chart:not(.--categorical) .--line-legend-rect{width:100%;height:100%;display:flex;align-items:center}.--line-chart:not(.--categorical) .--line-legend-rect svg{width:100%;height:16px}.--line-chart.--categorical .--point .--harbor-symbol-color-fill{fill:var(--line-point-default-color)}.--line-chart.--categorical .--point .--harbor-symbol-color-stroke{stroke:var(--line-point-default-color)}.--line-chart.--categorical .--point.--point--target .--harbor-symbol-color-fill{fill:var(--line-point-hover-color, var(--line-point-default-color))}.--line-chart.--categorical .--point.--point--target .--harbor-symbol-color-stroke{stroke:var(--line-point-hover-color, var(--line-point-default-color))}.--line-chart.--categorical .--point:focus{outline:none}.--line-chart.--categorical .--point--hover-mode-points .--harbor-symbol,.--line-chart.--categorical .--point--hover-mode-vertical-bar .--harbor-symbol{transition:transform .15s linear;transform-box:fill-box;transform-origin:center}.--line-chart.--categorical .--point--hover-mode-points.--point--target .--harbor-symbol,.--line-chart.--categorical .--point--hover-mode-vertical-bar.--point--target .--harbor-symbol{transform:scale(1.35)}.--line-chart.--categorical .--point-focus-box{pointer-events:none;fill:transparent;opacity:0;visibility:hidden;transition:opacity .15s linear,visibility .15s linear}.--line-chart.--categorical .--point-focus-box--outer{stroke:var(--interact-icon-medium-focus);stroke-width:2}.--line-chart.--categorical .--point-focus-box--inner{stroke:var(--interact-bg-weak-active);stroke-width:2}.--line-chart.--categorical .--point--hover-mode-points:focus-visible .--point-focus-box--outer{opacity:1;visibility:visible}.--line-chart.--categorical .--point--hover-mode-points:focus-visible .--point-focus-box--inner{opacity:1;visibility:visible}.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar,.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-outline-layer{opacity:0;visibility:hidden;transition:opacity .15s linear,visibility .15s linear}.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-target:focus,.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-target:focus-visible{outline:none}.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-target:hover .--line-categorical-focus-bar{opacity:1;visibility:visible}.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-target:focus-within .--line-categorical-focus-bar{opacity:1;visibility:visible}.--line-chart.--categorical .--line-categorical-focus-bar-layer .--line-categorical-focus-bar-target:focus-within .--line-categorical-focus-bar-outline-layer{opacity:1;visibility:visible}.--line-chart.--categorical .--line-categorical-axis-tick-label{user-select:none;cursor:default}.--line-chart.--categorical .--line-categorical-axis-tick-label:hover{font-weight:var(--line-categorical-axis-tick-label-hover-font-weight, 600)}.--line-chart.--categorical .--line-categorical-axis-tick-label:focus{outline:none}.--line-chart.--categorical .legend-event-rect{border-radius:1px;cursor:auto!important}.--line-chart.--categorical .legend-event-rect:hover~text,.--line-chart.--categorical .legend-event-rect:focus-visible~text{font-weight:var(--line-legend-text-hover-font-weight, var(--hbr-font-weight-bold, 700))}.--line-chart.--categorical .legend-event-rect:focus-visible{border:4px solid var(--base-text-in-default);outline:2px solid -webkit-focus-ring-color;outline-offset:2px}.--line-chart.--categorical .legend-event-rect:focus:not(:focus-visible){border:0;outline:0;outline-offset:0}.--line-chart.--categorical .--line-legend-rect{width:100%;height:100%;display:flex;align-items:center}.--line-chart.--categorical .--line-legend-rect svg{width:100%;height:16px}:host{--max-width:280px;--border-radius:var(--hbr-border-radius-md);--bg-color:var(--base-bg-weak-default);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal);--line-height:18px;--text-color:var(--base-text-medium-default);--padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);--shadow:var(--hbr-shadow-lg);display:flex;flex-direction:column}:host .--hbr-line-popover-container{display:block;box-sizing:border-box;width:max-content;max-width:var(--max-width);border-radius:var(--border-radius);background-color:var(--bg-color);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);color:var(--text-color);padding:var(--padding);box-shadow:var(--shadow);border:2px solid var(--base-border-strong-default)}:host .--hbr-line-popover-row{display:flex;justify-content:space-between;gap:var(--hbr-spacing-lg)}:host .--hbr-line-popover-row>div:first-child{display:flex;align-items:center;gap:6px}:host .--hbr-line-popover-row>div:first-child svg{width:20px;height:16px}:host .--hbr-line-popover-row>div:last-child{font-weight:var(--hbr-font-weight-semibold, 600)}:host .chart-line__header{display:flex;align-items:center;justify-content:space-between}:host .chart-line__header>:nth-child(2){display:flex}:host .chart-line__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}:host .--line-chart{flex-grow:1;min-height:0;overflow:hidden}:host([categorical]){--border-radius:0;--text-color:var(--base-text-default)}:host([categorical]) .--line-chart.--sparkline{overflow:visible}:host([categorical]) .--line-chart.--sparkline>div>svg,:host([categorical]) .--line-chart.--sparkline>div>div>svg{overflow:visible}:host([categorical]) .--hbr-line-popover-container{border-radius:2}:host([categorical]) .--hbr-line-popover-row{height:28px;min-height:28px;align-items:center;padding:0;color:var(--base-text-default)}:host([categorical]) .--hbr-line-popover-row>div{line-height:var(--line-height)}:host([categorical]) .--hbr-line-popover-row>div:first-child svg{width:24px;flex:0 0 24px}:host([categorical]) .--hbr-line-popover-row>div:last-child{font-weight:var(--hbr-font-weight-bold)}:host([categorical]) .--hbr-line-popover-swatch{display:flex;align-items:center;flex-shrink:0}:host([categorical]) .--hbr-line-popover-layout{color:var(--base-text-default)}:host([categorical]) .--point-focus-box--outer{stroke:var(--control-border-focus)}:host([categorical]) .--point-focus-box--inner{stroke:var(--base-bg-weak-default)}";
const HbrLineChartStyle0 = styleCss;

const { getLineBaseConfig, getLineCategoricalConfig, toggleLineClickingClass, toggleLinePointHoverClass, } = pi;
const HbrLineChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrLineChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        /** Configuration normalized for rendering, interactions, and export. */
        this.resolvedConfig = { data: [] };
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.activePopoverSelfManaged = null;
        this.chartResizeObserver = null;
        this.measuredChartWidth = 0;
        this.measuredChartHeight = 0;
        this.warnedAboutNivoTooltip = false;
        this.legendShowPopover = (event, id, fill, chartContextRoot, popoverOptions) => {
            const { resolvedConfig: config, tooltipRef } = chartContextRoot;
            this.applyActivePopoverOptions("top", popoverOptions);
            const legendDatum = {
                serieId: id,
                fill,
                event,
                data: config.data || [],
                xFormat: config.xFormat,
                yFormat: config.yFormat,
            };
            toggleLineLegendPopover(legendDatum, tooltipRef, config.legendTooltip, this.chartRef);
        };
        this.markerLegendShowPopover = (event, data, chartContextRoot) => {
            var _b;
            const { resolvedConfig: config, tooltipRef } = chartContextRoot;
            this.applyActivePopoverOptions("top", data.markerLegendPopoverOptions);
            const markerTooltip = (_b = data.markerLegendTooltip) !== null && _b !== void 0 ? _b : config.legendTooltip;
            toggleLineMarkerLegendPopover(data, tooltipRef, markerTooltip, event);
        };
        this.legendHidePopover = (chartContextRoot) => {
            toggleLineLegendPopover(null, chartContextRoot.tooltipRef);
            toggleLineMarkerLegendPopover(null, chartContextRoot.tooltipRef);
        };
        this.renderChart = () => {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            this.measuredChartWidth = this.chartRef.clientWidth;
            this.measuredChartHeight = this.chartRef.clientHeight;
            this.resolvedConfig = resolveLineChartConfig(this.config, {
                height: this.measuredChartHeight,
            });
            const configWithNivoTooltip = this.resolvedConfig;
            if (!this.warnedAboutNivoTooltip &&
                configWithNivoTooltip.tooltip !== undefined) {
                console.warn("hbr-line-chart: config.tooltip is not supported. Use itemTooltip, legendTooltip, or markerLegendTooltip instead.");
                this.warnedAboutNivoTooltip = true;
            }
            const publicConfig = omitChartConfigKeys(configWithNivoTooltip, [
                "tooltip",
            ]);
            // Custom marker layers retain this local array; never mutate caller-owned markers.
            const rendererMarkers = this.categorical
                ? (_b = publicConfig.markers) === null || _b === void 0 ? void 0 : _b.map((marker) => (Object.assign({}, marker)))
                : undefined;
            if (rendererMarkers)
                publicConfig.markers = rendererMarkers;
            if (this.categorical && isLineChartEasyConfig(this.config)) {
                (_c = publicConfig.symbolTypes) !== null && _c !== void 0 ? _c : (publicConfig.symbolTypes = [
                    "circle",
                    "diamond",
                    "square",
                    "inverted-triangle",
                ]);
                publicConfig.theme = Object.assign(Object.assign({}, publicConfig.theme), { focusBar: Object.assign(Object.assign({}, (_d = publicConfig.theme) === null || _d === void 0 ? void 0 : _d.focusBar), { bar: Object.assign({ fill: (_f = (_e = publicConfig.verticalFocusBar) === null || _e === void 0 ? void 0 : _e.background) !== null && _f !== void 0 ? _f : "var(--base-bg-strong-default)", fillOpacity: (_h = (_g = publicConfig.verticalFocusBar) === null || _g === void 0 ? void 0 : _g.opacity) !== null && _h !== void 0 ? _h : 0.1 }, (_k = (_j = publicConfig.theme) === null || _j === void 0 ? void 0 : _j.focusBar) === null || _k === void 0 ? void 0 : _k.bar) }) });
            }
            const getConfig = this.categorical
                ? getLineCategoricalConfig
                : getLineBaseConfig;
            const axisBottomConfig = this.resolvedConfig.axisBottom;
            const axisLeftConfig = this.resolvedConfig.axisLeft;
            const axisTopConfig = this.resolvedConfig.axisTop;
            const axisRightConfig = this.resolvedConfig.axisRight;
            const legendPopoverOptions = this.getLegendPopoverOptions();
            const getAxisWithTooltip = (axisConfig, placement, dimension) => {
                if (axisConfig === null)
                    return null;
                const show = (data, event) => {
                    if (this.resolvedConfig.isSparkline &&
                        this.resolvedConfig.isInteractive === false) {
                        hideLinePopover(this.tooltipRef);
                        return false;
                    }
                    if (this.categorical)
                        this.applyActivePopoverOptions(placement, axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.popoverOptions);
                    const showAxisPopover = dimension === "horizontal"
                        ? showHorizontalAxisPopover
                        : showVerticalAxisPopover;
                    showAxisPopover(data, event, this, axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.tooltip);
                    return true;
                };
                return Object.assign(Object.assign({}, axisConfig), { onMouseEnter: (data, event, tick) => {
                        var _b;
                        if (show(data, event))
                            (_b = axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(axisConfig, data, event, tick);
                    }, onMouseMove: (data, event, tick) => {
                        var _b;
                        show(data, event);
                        (_b = axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.onMouseMove) === null || _b === void 0 ? void 0 : _b.call(axisConfig, data, event, tick);
                    }, onMouseLeave: (data, event, tick) => {
                        var _b;
                        if (!this.isPopoverSelfManaged(axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.popoverOptions))
                            hideLinePopover(this.tooltipRef);
                        (_b = axisConfig === null || axisConfig === void 0 ? void 0 : axisConfig.onMouseLeave) === null || _b === void 0 ? void 0 : _b.call(axisConfig, data, event, tick);
                    } });
            };
            const baseConfig = getConfig(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, publicConfig), (this.usesResponsiveLegendSizing()
                ? {
                    width: this.measuredChartWidth,
                    height: this.chartRef.clientHeight,
                }
                : {})), {
                // Elements resolves shortcut markers to native markers with an axis.
                markers: publicConfig.markers, axisBottom: getAxisWithTooltip(axisBottomConfig, "bottom", "horizontal"), axisLeft: getAxisWithTooltip(axisLeftConfig, "left", "vertical")
            }), (this.categorical && axisTopConfig
                ? {
                    axisTop: getAxisWithTooltip(axisTopConfig, "top", "horizontal"),
                }
                : {})), (this.categorical && axisRightConfig
                ? {
                    axisRight: getAxisWithTooltip(axisRightConfig, "right", "vertical"),
                }
                : {})), {
                itemsEventHandlers: {
                    tooltipFunc: (data, itemTooltip, event) => {
                        var _b, _c, _d;
                        const tooltipItemFunc = itemTooltip;
                        if (!event) {
                            return generateOrSetTooltipContentRow(data, this, true, tooltipItemFunc);
                        }
                        this.applyActivePopoverOptions();
                        if (!data ||
                            typeof data !== "object" ||
                            !("slice" in data)) {
                            if (!((_b = this.activePopoverSelfManaged) !== null && _b !== void 0 ? _b : this.isPopoverSelfManaged())) {
                                hideLinePopover(this.tooltipRef);
                            }
                            return null;
                        }
                        const slice = data.slice;
                        if (!((_c = slice === null || slice === void 0 ? void 0 : slice.points) === null || _c === void 0 ? void 0 : _c.length)) {
                            if (!((_d = this.activePopoverSelfManaged) !== null && _d !== void 0 ? _d : this.isPopoverSelfManaged())) {
                                hideLinePopover(this.tooltipRef);
                            }
                            return null;
                        }
                        toggleLineSlicePopover(this.tooltipRef, this.chartRef, slice, event, tooltipItemFunc);
                        return null;
                    },
                    sliceTooltipFunc: (data, itemTooltip, showOnlySelectedSerie) => generateOrSetTooltipContentRow(data, this, showOnlySelectedSerie, itemTooltip),
                    onFocus: (data, event) => {
                        this.applyActivePopoverOptions();
                        showLinePointPopover(this.tooltipRef, this.chartRef, data, event, this.resolvedConfig
                            .itemTooltip);
                    },
                    onBlur: () => {
                        var _b;
                        if (!((_b = this.activePopoverSelfManaged) !== null && _b !== void 0 ? _b : this.isPopoverSelfManaged())) {
                            hideLinePopover(this.tooltipRef);
                        }
                        this.activePopoverSelfManaged = null;
                    },
                },
                legendsEventHandlers: {
                    onMouseEnter: (data, event) => "markerValue" in data
                        ? this.markerLegendShowPopover(event, data, this)
                        : this.legendShowPopover(event, data.id, data.color, this, legendPopoverOptions),
                    onMouseMove: (data, event) => "markerValue" in data
                        ? this.markerLegendShowPopover(event, data, this)
                        : this.legendShowPopover(event, data.id, data.color, this, legendPopoverOptions),
                    onMouseLeave: (data) => {
                        const popoverOptions = "markerValue" in data
                            ? data.markerLegendPopoverOptions
                            : legendPopoverOptions;
                        if (!this.isPopoverSelfManaged(popoverOptions)) {
                            this.legendHidePopover(this);
                        }
                    },
                    onFocus: (data, event) => "markerValue" in data
                        ? this.markerLegendShowPopover(event, data, this)
                        : this.legendShowPopover(event, data.id, data.color, this, legendPopoverOptions),
                    onBlur: (_data, _event) => {
                        this.activePopoverSelfManaged = null;
                        this.legendHidePopover(this);
                    },
                    onClick: (data, event) => "markerValue" in data
                        ? this.markerLegendShowPopover(event, data, this)
                        : this.legendShowPopover(event, data.id, data.color, this, legendPopoverOptions),
                },
            });
            const existingEventHandlers = {
                onMouseEnter: baseConfig.onMouseEnter,
                onMouseLeave: baseConfig.onMouseLeave,
                onClick: baseConfig.onClick,
                onBlur: baseConfig.onBlur,
                onFocus: baseConfig.onFocus,
            };
            let fullConfig = cjs(baseConfig, publicConfig, {
                customMerge: (key, options) => {
                    if (key === "legends") {
                        return (a, b) => {
                            // Only legend arrays use index merging; theme.legends is a theme object.
                            if (!Array.isArray(a) || !Array.isArray(b)) {
                                return cjs(a, b, options);
                            }
                            if (!b.length)
                                return [];
                            return (a.length > b.length ? a : b).map((_legend, i) => (Object.assign(Object.assign({}, a[i]), b[i])));
                        };
                    }
                    if (["tickValues", "gridYValues", "symbolTypes", "colors"].includes(key)) {
                        return (_a, b) => b;
                    }
                },
            });
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            if (this.usesResponsiveLegendSizing() && ((_l = fullConfig.legends) === null || _l === void 0 ? void 0 : _l.length)) {
                // Keep the SVG renderer's measured legend space; caller margins still take precedence.
                fullConfig.margin = Object.assign(Object.assign({}, baseConfig.margin), this.config.margin);
            }
            fullConfig = applyMagneticLineLegendLayout(this.config, fullConfig, {
                height: this.measuredChartHeight,
                markerLegends: this.categorical,
            });
            // Keep endpoint labels inside the compact easy-mode plot without replacing client renderers.
            if (this.categorical &&
                isLineChartEasyConfig(this.config) &&
                !this.config.autoSize &&
                !((_m = this.config.axisBottom) === null || _m === void 0 ? void 0 : _m.renderTick) &&
                ((_o = fullConfig.axisBottom) === null || _o === void 0 ? void 0 : _o.renderTick)) {
                const renderTick = fullConfig.axisBottom.renderTick;
                fullConfig.axisBottom.renderTick = (tick) => {
                    var _b, _c, _d, _e;
                    const rendered = renderTick(tick);
                    const plotWidth = this.chartRef.clientWidth -
                        ((_c = (_b = fullConfig.margin) === null || _b === void 0 ? void 0 : _b.left) !== null && _c !== void 0 ? _c : 0) -
                        ((_e = (_d = fullConfig.margin) === null || _d === void 0 ? void 0 : _d.right) !== null && _e !== void 0 ? _e : 0);
                    const anchor = tick.x <= 1
                        ? "start"
                        : plotWidth > 0 && tick.x >= plotWidth - 1
                            ? "end"
                            : undefined;
                    return anchor
                        ? react.exports.cloneElement(rendered, {}, react.exports.Children.map(rendered.props.children, (child) => react.exports.isValidElement(child) && child.type === "text"
                            ? react.exports.cloneElement(child, {
                                textAnchor: anchor,
                            })
                            : child))
                        : rendered;
                };
            }
            // Opaque tinted stops prevent lower stacked lines from showing through upper areas.
            if (this.categorical &&
                isLineChartEasyConfig(this.config) &&
                fullConfig.enableArea &&
                ((_p = fullConfig.yScale) === null || _p === void 0 ? void 0 : _p.type) === "linear" &&
                fullConfig.yScale.stacked === true &&
                this.config.areaOpacity === undefined &&
                this.config.defs === undefined &&
                fullConfig.defs) {
                fullConfig.defs = fullConfig.defs.map((definition) => definition.id.startsWith("line-area-gradient-")
                    ? Object.assign(Object.assign({}, definition), { colors: definition.colors.map((stop) => (Object.assign(Object.assign({}, stop), { color: `color-mix(in srgb, ${stop.color} ${stop.offset === 0 ? 32 : 8}%, var(--base-bg-weak-default))`, opacity: 1 }))) }) : definition);
            }
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement, pi);
            }
            // Keep chart-config's captured marker data aligned with the final native config.
            rendererMarkers === null || rendererMarkers === void 0 ? void 0 : rendererMarkers.splice(0, rendererMarkers.length, ...((_q = fullConfig.markers) !== null && _q !== void 0 ? _q : []));
            this.resolvedConfig = fullConfig;
            if (!this.contextRoot) {
                this.contextRoot = createRoot(this.chartRef);
            }
            this.contextRoot.render(react.exports.createElement(De$1, fullConfig));
            if (this.boardRef.setChartConfig) {
                this.boardRef.setChartConfig(fullConfig);
            }
        };
        this.config = { data: [] };
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
        this.categorical = false;
        this.modifyHbrConfig = undefined;
        this.popoverOptions = undefined;
    }
    /** Public method for download data, use customFunc to create your own way to download data, such as pdf */
    async download(filename = "Export.csv", customFunc) {
        var _b;
        const data = (_b = this.resolvedConfig.data) !== null && _b !== void 0 ? _b : [];
        if (customFunc) {
            customFunc(data);
        }
        else {
            browserDownloadCsv(convertLineDataToCSV(data), filename);
        }
    }
    /** Public method to get popover reference, client can use this to control magnetic UX popover externally */
    async getPopoverRef() {
        return this.tooltipRef;
    }
    usesResponsiveLegendSizing() {
        var _b;
        const autoSize = this.resolvedConfig.autoSize;
        return (this.categorical &&
            ((isLineChartEasyConfig(this.config) &&
                Boolean((_b = this.resolvedConfig.legends) === null || _b === void 0 ? void 0 : _b.length) &&
                (autoSize === true ||
                    (typeof autoSize === "object" &&
                        autoSize.dynamicLegend !== false))) ||
                hasAutomaticLineMarkerLegends(this.config, this.resolvedConfig)));
    }
    getLegendPopoverOptions() {
        var _b, _c;
        return (_c = (_b = this.resolvedConfig.legends) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.popoverOptions;
    }
    getPopoverOptions(placement = "top", override) {
        return resolveChartPopoverOptions({ distance: 10, variant: "chart", placement }, this.popoverOptions, this.categorical, override);
    }
    applyActivePopoverOptions(placement = "top", override) {
        this.activePopoverSelfManaged = this.isPopoverSelfManaged(override);
        applyChartPopoverOptions(this.tooltipRef, this.getPopoverOptions(placement, override));
    }
    isPopoverSelfManaged(override) {
        return isChartPopoverSelfManaged(this.categorical, this.popoverOptions, override);
    }
    componentDidLoad() {
        this.renderChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
        if (typeof ResizeObserver === "undefined")
            return;
        this.chartResizeObserver = new ResizeObserver(() => {
            const width = this.chartRef.clientWidth;
            const height = this.chartRef.clientHeight;
            if (width > 0 &&
                (width !== this.measuredChartWidth ||
                    height !== this.measuredChartHeight) &&
                (this.usesResponsiveLegendSizing() ||
                    (this.config.isSparkline &&
                        this.config.axisBottom === undefined &&
                        height !== this.measuredChartHeight))) {
                this.renderChart();
            }
        });
        this.chartResizeObserver.observe(this.chartRef);
    }
    connectedCallback() {
        var _b;
        if (this.chartRef)
            (_b = this.chartResizeObserver) === null || _b === void 0 ? void 0 : _b.observe(this.chartRef);
    }
    disconnectedCallback() {
        var _b;
        (_b = this.chartResizeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
    }
    componentDidUpdate() {
        this.renderChart();
    }
    handleOutsideClick() {
        var _b;
        if ((_b = this.resolvedConfig.isInteractive) !== null && _b !== void 0 ? _b : true) {
            toggleLinePointHoverClass(null, this.chartRef);
            toggleLineClickingClass(null, this.chartRef);
        }
    }
    handleHoverOut() {
        var _b;
        if (!((_b = this.activePopoverSelfManaged) !== null && _b !== void 0 ? _b : this.isPopoverSelfManaged())) {
            hideLinePopover(this.tooltipRef);
        }
    }
    render() {
        var _b, _c, _d;
        this.resolvedConfig = resolveLineChartConfig(this.config);
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const popoverOptions = resolveChartPopoverOptions({ distance: 10, variant: "chart" }, this.popoverOptions, this.categorical);
        // Chart-managed visibility remains the default due to the chart mesh.
        return (h(Host, { key: '107d8539e47beaeac534d24ad977351f4972a3bb' }, !((_b = this.resolvedConfig.data) === null || _b === void 0 ? void 0 : _b.length) && this.categorical && (h("div", { slot: "header", part: "header", class: "chart-line__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("hbr-chart-board", { key: '97fa69d2759dbd45dc35dbd30dc260b37f63c052', type: this.categorical ? "categorical" : "line", ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: !((_c = this.resolvedConfig.data) === null || _c === void 0 ? void 0 : _c.length), style: { width: this.width, height: this.height }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: '628fa99fe02a1ad54a67d23b9b1df5895a0040dd' }, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: 'af5571aa697c55357366da7f622d1347ac70286a', slot: "content" })), (((_d = this.resolvedConfig.data) === null || _d === void 0 ? void 0 : _d.length) || !this.categorical) && (h("div", { slot: "header", part: "header", class: "chart-line__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("hbr-layout", { key: '1e892641b164495fbe48882498529c281dbba40d', direction: "column", style: { flex: "1", minHeight: "0" } }, h("div", { key: '3eb653549c165ee2644600fc762274e0923c7301', ref: (el) => {
                this.chartRef = el;
            }, class: `--hbr-chart --line-chart ${this.categorical ? "--categorical" : ""} ${this.resolvedConfig.isSparkline ? "--sparkline" : ""}`, part: "chart" })), h("slot", { key: '0c171805fc3f472f28b4d64f16c60a68121bf0ab', name: "footer" }), h("slot", { key: '77b23d1da325fd97c42011b5d0e686e9f9bcfea0', slot: "loading-state", name: "loading-state" }), h("slot", { key: 'ea3becbc59cf38252d79332cfbc65a9e89f61581', slot: "empty-state", name: "empty-state" }))));
    }
    get el() { return this; }
    static get style() { return HbrLineChartStyle0; }
}, [1, "hbr-line-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
        "categorical": [516],
        "modifyHbrConfig": [16],
        "popoverOptions": [16],
        "download": [64],
        "getPopoverRef": [64]
    }, [[1, "click", "handleOutsideClick"], [1, "mouseout", "handleHoverOut"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-line-chart", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-layout", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-line-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrLineChart$1);
            }
            break;
        case "hbr-chart-board":
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

const HbrLineChart = HbrLineChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrLineChart, defineCustomElement };

