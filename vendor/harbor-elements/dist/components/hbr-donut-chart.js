import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { _ } from './harbor-charts-pie.es.js';
import { r as react, a as animated, R as React, E as Et$1, x, z, G as Gi, t as to, Z as Zr$1, u as useTransition, c as createRoot } from './client.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { t as toggleDonutSectionPopover, c as convertDonutDataToCSV, a as toggleDonutLegendPopover } from './chart-util.js';
import { h as hasSlot } from './slot.js';
import { b as browserDownloadCsv, d as defineCustomElement$9 } from './board.js';
import { m, $, S, D, b, x as x$1, o as omitChartConfigKeys, r as resolveChartPopoverOptions, a as applyChartPopoverOptions, i as isChartPopoverSelfManaged } from './popover-options.js';
import { d as defineCustomElement$8 } from './icon.js';
import { d as defineCustomElement$7 } from './icon-button.js';
import { d as defineCustomElement$6 } from './illustration.js';
import { d as defineCustomElement$5 } from './popover.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './stencil.js';
import { d as defineCustomElement$2 } from './tag.js';
import { T, O, m as m$1 } from './chunk-DMVJNFOI.js';
import { t } from './chunk-RK5MMMIC.js';
import { G as Gt, T as Tt$1 } from './chunk-Z46YYJNO.js';

var ce={};m(ce,{generateDonutFillAttributeForNoDataColumn:()=>ht,getDonutBaseConfig:()=>Ke,getDonutCategoricalAutoSizePlan:()=>wt,getDonutCategoricalConfig:()=>nr,getDonutColorsFromConfig:()=>$t,getGaugeConfig:()=>ur,isDonutDynamicLegendEnabled:()=>ft,itemTogglePathHover:()=>lt,itemTogglePathSelect:()=>zt,itemTogglePathUnselect:()=>ve,keyIsNoValueItem:()=>B,legendTogglePathHover:()=>ct,resetAllCategoricalArcSelection:()=>Be});var De=t=>{if(typeof t=="number")return String(t);if(!t||!t.includes("var("))return t!=null?t:"";if(typeof document=="undefined")return t;let e=getComputedStyle(document.documentElement),r=t;for(let n=0;n<5&&r.includes("var(");n+=1){let o=r.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/g,(a,i,s)=>e.getPropertyValue(i).trim()||(s==null?void 0:s.trim())||"");if(o===r)break;r=o;}return r.includes("var(")?"":r},Pt=t=>{let r=De(t).trim().match(/^(-?\d*\.?\d+)(px|rem|em|pt|%)?$/i);if(!r){if(typeof document!="undefined"&&document.body){let a=Number.parseFloat(getComputedStyle(document.body).fontSize);if(Number.isFinite(a))return a}return 12}let n=Number.parseFloat(r[1]);if(!Number.isFinite(n))return 12;if(!r[2]||r[2].toLowerCase()==="px"||typeof document=="undefined")return n;let o=Number.parseFloat(getComputedStyle(document.documentElement).fontSize)||16;switch(r[2].toLowerCase()){case"em":case"rem":return n*o;case"pt":return n*96/72;case"%":return n*o/100;default:return n}},Ft=t=>{let e=De(t);if(e)return e;if(typeof document=="undefined")return "";let r=getComputedStyle(document.documentElement);return r.getPropertyValue("--viz-font-body").trim()||(document.body?getComputedStyle(document.body).fontFamily:"")||r.fontFamily||"sans-serif"};var cr=12,mr=6,dr=.5,Le=12,ye={left:10,center:80,right:10},Et={top:10,center:80,bottom:10},br=28,fe=10,hr=16,vt=t=>typeof t.autoSize=="object"&&t.autoSize!==null?t.autoSize:{},pr=t=>{var n;let e=(n=t.theme)==null?void 0:n.fontSize,r=Number.parseFloat(String(e!=null?e:""));return Number.isFinite(r)&&r>0?r:cr},Ht=(t,e,r=0)=>r>8||!t.includes("var(")?t:t.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/g,(n,o,a)=>Ht(e.getPropertyValue(o).trim()||(a==null?void 0:a.trim())||"",e,r+1)),Dr=t=>{var i,s;let e=String((s=(i=t.theme)==null?void 0:i.fontFamily)!=null?s:"");if(typeof document=="undefined")return e;let r=getComputedStyle(document.documentElement),n=Ht(e,r).trim(),o=document.body?getComputedStyle(document.body).fontFamily.trim():"",a=Ht(r.getPropertyValue("--viz-font-body").trim(),r).trim();return n||o||a||r.fontFamily},ge=(t,e)=>{var a,i,s,l,u,c;let r=(a=vt(t)[e])!=null?a:{},n=[Math.max(0,Number((i=r.left)!=null?i:e==="chartWidthDistribution"?ye.left:Et.top)),Math.max(0,Number((s=r.center)!=null?s:80)),Math.max(0,Number((l=r.right)!=null?l:e==="chartWidthDistribution"?ye.right:Et.bottom))];e==="chartHeightDistribution"&&(n[0]=Math.max(0,Number((u=r.top)!=null?u:Et.top)),n[2]=Math.max(0,Number((c=r.bottom)!=null?c:Et.bottom)));let o=n.reduce((m,h)=>m+h,0)||1;return {start:n[0]/o,center:n[1]/o,end:n[2]/o}},yr=t=>{var e;return (e=vt(t).strategy)!=null?e:"shrink"},gr=t=>{let e=vt(t).minFontSize;return typeof e=="number"&&Number.isFinite(e)&&e>0?e:mr},Ar=t=>{var e;return `${String((e=t.label)!=null?e:t.id)}: ${String(t.value)}`},Se=(t,e,r)=>Gt(Tt$1(t,`${e}px ${r}`)),Qt=(t,e,r)=>Se(t,e,r)+Le,Ae=(t,e,r,n)=>Object.fromEntries(t.map((o,a)=>{var i;return [String(o.id),Se((i=e[a])!=null?i:"",r,n)]})),Lr=(t,e,r,n,o)=>{var C,k,A,L,P,g,d,S,N;if(((C=t.legends)==null?void 0:C.length)===0||!((k=t.legends)!=null&&k.length))return 1;let a=t.legends[0],i=(A=a.anchor)!=null?A:"bottom",s=(L=a.direction)!=null?L:"row";if(i!=="bottom"||s!=="row")return 1;let l=Math.max(0,e-r.left-r.right),u=((P=t.data)!=null?P:[]).map(w=>{var O,T;return String((T=(O=w.label)!=null?O:w.id)!=null?T:"")}),c=Number((g=a.symbolSize)!=null?g:28),m=Number((d=a.symbolSpacing)!=null?d:2),h=Number((S=a.itemWidth)!=null?S:0),p=Number((N=a.itemsSpacing)!=null?N:a.horizontal===!0?8:fe),f=u.map(w=>Math.max(h,Math.ceil(c+m+Gt(Tt$1(w,`${n}px ${o}`))+hr))),M=1,y=0;for(let w of f){let O=y?y+p+w:w;y>0&&O>l?(M+=1,y=w):y=O;}return M},fr=(t,e,r)=>{var a,i,s;let n=(a=t.legends)==null?void 0:a[0],o=n==null?void 0:n.padding;return typeof o=="number"?{top:o,bottom:o}:o&&typeof o=="object"&&!Array.isArray(o)?{top:Number((i=o.top)!=null?i:0),bottom:Number((s=o.bottom)!=null?s:0)}:{top:e?r:0,bottom:0}},wt=(t,e=800,r=600)=>{var b,I,V,j,Z,J,H,x,G,K,at,Dt,Mt,Rt;if(!t.autoSize)return;let n=vt(t),o=!!((b=t.legends)!=null&&b.length),a=$({top:40,right:60,bottom:o?90:40,left:60},(I=t.margin)!=null?I:{}),i=pr(t),s=Dr(t),l=(j=(V=t.theme)==null?void 0:V.legends)==null?void 0:j.text,u=Pt((Z=l==null?void 0:l.fontSize)!=null?Z:"var(--hbr-font-size-xs, 11px)"),c=Ft((J=l==null?void 0:l.fontFamily)!=null?J:"var(--hbr-font-body, sans-serif)"),m=(H=t.data)!=null?H:[],h=m.map(Ar),p=h.map(X=>Qt(X,i,s)),f=Math.max(0,...p),M=ge(t,"chartWidthDistribution"),y=ge(t,"chartHeightDistribution"),C=n.dynamicLegend!==!1,k=typeof n.dynamicLegendPadding=="number"&&Number.isFinite(n.dynamicLegendPadding)?Math.max(0,n.dynamicLegendPadding):12,A=fr(t,C,k),L=(x=t.legends)==null?void 0:x[0],P=Number((G=L==null?void 0:L.itemHeight)!=null?G:br),g=Number((K=L==null?void 0:L.itemsSpacing)!=null?K:(L==null?void 0:L.horizontal)===!0?8:fe),d=Math.max(0,e-r+Math.max(a.left,a.right)),S$1=Math.max(a.left,a.right,e*Math.min(M.start,M.end),d),N=yr(t),w=gr(t),O=n.dynamicHeightMargin!==!1,T=X=>{var kt;let et=Lr(t,e,X,u,c),Kt=C&&((kt=t.legends)!=null&&kt.length)?et*P+Math.max(0,et-1)*g+A.top+A.bottom:0;return {legendRows:et,legendHeight:Kt}},q=X=>Math.max(...h.map(et=>Qt(et,X,s)))<=S$1;if(N==="hide"&&!q(i)){let{legendRows:X,legendHeight:et}=T(a);return {margin:$($({},a),O&&{bottom:Math.max((Dt=(at=t.margin)==null?void 0:at.bottom)!=null?Dt:a.bottom,et)}),autoSizeText:{fontSize:i,fontFamily:s,hide:!0,labelWidth:f,labelWidths:Ae(m,h,i,s)},legendRows:X,legendHeight:et,labelVerticalMargin:0}}let U=i;for(;N==="shrink"&&!q(U)&&U>w;)U=Math.max(w,U-dr);let E=h.map(X=>Qt(X,U,s)),W=Math.max(0,...E),$$1=Math.ceil(W+Le),_=O?Math.ceil(U*1.2*Math.max(y.start,y.end)/Math.min(y.start,y.end)):0,{legendRows:z,legendHeight:F}=T(S($({},a),{left:Math.max(a.left,$$1),right:Math.max(a.right,$$1)}));return {margin:$(S($({},a),{left:Math.max(a.left,$$1),right:Math.max(a.right,$$1)}),O&&{top:Math.max(a.top,_),bottom:Math.max((Rt=(Mt=t.margin)==null?void 0:Mt.bottom)!=null?Rt:a.bottom,_+F)}),autoSizeText:{fontSize:U,fontFamily:s,labelWidth:Math.ceil(W),labelWidths:Ae(m,h,U,s)},legendRows:z,legendHeight:F,labelVerticalMargin:_}},ft=t=>typeof t.autoSize=="object"&&t.autoSize!==null?t.autoSize.dynamicLegend!==!1:t.autoSize===!0;var ee=(t,e,r)=>S($({},t),{innerRadius:t.innerRadius-e,outerRadius:t.outerRadius+r}),xe=(t,e)=>{let r=(t.startAngle+t.endAngle)/2,n=t.innerRadius+(t.outerRadius-t.innerRadius)*e;return `translate(${n*Math.sin(r)},${-n*Math.cos(r)})`},re=(t,e,r)=>{if(r===void 0)return t(e);let n=t;if(!n.cornerRadius)return t(e);let o=u=>{let c=n.cornerRadius();try{return n.cornerRadius(u),t(e)}finally{n.cornerRadius(c);}};if(typeof r=="number")return o(r);let a=o(r.outer),i=o(r.inner),s=a.indexOf("L"),l=i.indexOf("L");return s===-1||l===-1?a:`${a.slice(0,s)}${i.slice(l)}`},Me=({startAngle:t,endAngle:e,outerRadius:r})=>{let n=l=>({x:r*Math.sin(l),y:-r*Math.cos(l)}),o=n(t),a=n(e),i=Math.abs(e-t),s=e>=t?1:0;if(i>=Math.PI*2-Number.EPSILON){let l=n(t+Math.PI);return `M${o.x},${o.y}A${r},${r},0,1,${s},${l.x},${l.y}A${r},${r},0,1,${s},${o.x},${o.y}`}return `M${o.x},${o.y}A${r},${r},0,${i>Math.PI?1:0},${s},${a.x},${a.y}`};function Tt(t){if(!t||t.indexOf("A")===-1)return null;let e=t.indexOf("L");if(e!==-1)return t.substring(0,e);let r=t.indexOf("M",1);if(r!==-1)return t.substring(0,r);let n=t.indexOf("Z",1);return n!==-1?t.substring(0,n):t}function Mr({centerX:t,centerY:e,sin:r,cos:n,arc:o,arcLinkLabelsOffset:a,arcLinkLabelsDiagonalLength:i,arcLinkLabelsStraightLength:s,activeOuterRadiusOffset:l=0}){let u=t+(o.outerRadius+a+l)*n,c=e+(o.outerRadius+a+l)*r,m=t+(o.outerRadius+a+i+l)*n,h=e+(o.outerRadius+a+i+l)*r,p=m+(n>=0?1:-1)*s;return {x0:u,y0:c,x1:m,y1:h,x2:p,y2:h}}var Ot=(t,{centerX:e,centerY:r,arcLinkLabelsOffset:n,arcLinkLabelsDiagonalLength:o,arcLinkLabelsStraightLength:a,arcLinkLabelsTextOffset:i,margin:s,requestedLabelWidth:l,height:u,measuredLabelWidth:c,autoSize:m})=>{let h=(t.startAngle+t.endAngle)/2-Math.PI/2,p=Math.sin(h),f=Math.cos(h),{x0:M,y0:y,x1:C,y1:k,x2:A,y2:L}=Mr({centerX:e,centerY:r,sin:p,cos:f,arc:t,arcLinkLabelsOffset:n,arcLinkLabelsDiagonalLength:o,arcLinkLabelsStraightLength:a+(a>0?Math.max(0,p)*12:0)}),P=f>=0?"start":"end",g=A+(f>=0?i:-i),d=f>=0?e*2+s.right-g:s.left+g,S=m?c!=null?c:Math.max(m.labelWidth,l):Math.min(l,Math.max(0,d)),N=m?Math.max(u,m.fontSize*1.2):u;return {x0:M,y0:y,x1:C,y1:k,x2:A,y2:L,x:f<0?g-S:g,y:L-N/2,width:S,height:N,textAnchor:P}},ne=(t,e,{centerX:r,centerY:n,arcLinkLabelsOffset:o,arcLinkLabelsDiagonalLength:a,arcLinkLabelsStraightLength:i,resting:s})=>{var m;let l=(m=s==null?void 0:s.coordinates)!=null?m:t,u=[{x:l.x0,y:l.y0},...a>0&&i>0?[{x:l.x1,y:l.y1}]:[],{x:l.x2,y:l.y2}];return (s?Rr(u,S($({},s.arc),{outerRadius:e.outerRadius}),r,n,o):u).map((h,p)=>`${p?"L":"M"}${h.x},${h.y}`).join(" ")},tt=1e-7,It=Math.PI*2,te=(t,e)=>t.x*e.y-t.y*e.x,Rr=(t,e,r,n,o)=>{let a=Math.max(0,e.outerRadius+o);if(t.length<2||![a,e.startAngle,e.endAngle,r,n].every(Number.isFinite)||t.some(m=>!Number.isFinite(m.x+m.y)))return t;let i={x:t[0].x-r,y:t[0].y-n};if(Math.hypot(i.x,i.y)>=a-tt)return t;let s=e.endAngle-e.startAngle,l=Math.abs(s),u=l<It-tt;if(u){let h=((Math.atan2(i.y,i.x)+Math.PI/2-e.startAngle)*Math.sign(s)%It+It)%It;if(h<=tt||h>=l-tt)return t}let c=u?[e.startAngle,e.endAngle].map(m=>({x:Math.sin(m),y:-Math.cos(m)})):[];for(let m=0;m<t.length-1;m++){let h=t[m],p=t[m+1],f={x:h.x-r,y:h.y-n},M={x:p.x-h.x,y:p.y-h.y},y=M.x**2+M.y**2;if(y<=tt**2)continue;let C=f.x*M.x+f.y*M.y,k=C**2+y*(a**2-f.x**2-f.y**2),A=Number.POSITIVE_INFINITY,L=g=>{g>=-tt&&g<=1+tt&&(A=Math.min(A,Math.max(0,Math.min(1,g))));};k>=0&&L((-C+Math.sqrt(k))/y);for(let g of c){let d=te(M,g);if(Math.abs(d)<=tt)continue;let S=te(f,M)/-d;S>=-tt&&S<=a+tt&&L(-te(f,g)/d);}if(!Number.isFinite(A))continue;let P=[{x:h.x+M.x*A,y:h.y+M.y*A}];for(let g of t.slice(m+1)){let d=P[P.length-1];Math.hypot(g.x-d.x,g.y-d.y)>tt&&P.push(g);}return P.length>1?P:[]}return []},dt=(t,e,r)=>to([t.startAngle,t.endAngle,t.innerRadius,t.outerRadius],(n,o,a,i)=>r(S($({},e),{startAngle:n,endAngle:o,innerRadius:Math.max(0,a),outerRadius:Math.max(0,i)}))),kr={startAngle:{enter:t=>S($({},t),{endAngle:t.startAngle}),update:t=>t,leave:t=>S($({},t),{startAngle:t.endAngle})},middleAngle:{enter:t=>{let e=t.startAngle+(t.endAngle-t.startAngle)/2;return S($({},t),{startAngle:e,endAngle:e})},update:t=>t,leave:t=>{let e=t.startAngle+(t.endAngle-t.startAngle)/2;return S($({},t),{startAngle:e,endAngle:e})}},endAngle:{enter:t=>S($({},t),{startAngle:t.endAngle}),update:t=>t,leave:t=>S($({},t),{endAngle:t.startAngle})},innerRadius:{enter:t=>S($({},t),{outerRadius:t.innerRadius}),update:t=>t,leave:t=>S($({},t),{innerRadius:t.outerRadius})},centerRadius:{enter:t=>{let e=t.innerRadius+(t.outerRadius-t.innerRadius)/2;return S($({},t),{innerRadius:e,outerRadius:e})},update:t=>t,leave:t=>{let e=t.innerRadius+(t.outerRadius-t.innerRadius)/2;return S($({},t),{innerRadius:e,outerRadius:e})}},outerRadius:{enter:t=>S($({},t),{innerRadius:t.outerRadius}),update:t=>t,leave:t=>S($({},t),{outerRadius:t.innerRadius})},pushIn:{enter:t=>S($({},t),{innerRadius:t.innerRadius-t.outerRadius+t.innerRadius,outerRadius:t.innerRadius}),update:t=>t,leave:t=>S($({},t),{innerRadius:t.outerRadius,outerRadius:t.outerRadius+t.outerRadius-t.innerRadius})},pushOut:{enter:t=>S($({},t),{innerRadius:t.outerRadius,outerRadius:t.outerRadius+t.outerRadius-t.innerRadius}),update:t=>t,leave:t=>S($({},t),{innerRadius:t.innerRadius-t.outerRadius+t.innerRadius,outerRadius:t.innerRadius})}},Re=(t,{mode:e="innerRadius",activeId:r,activeInnerRadiusOffset:n=0,activeOuterRadiusOffset:o=0}={})=>{let a=react.exports.useMemo(()=>t.map(p=>p.id===r?S($({},p),{arc:ee(p.arc,n,o)}):p),[t,r,n,o]),{animate:i,config:s}=Zr$1(),l=kr[e],u=react.exports.useMemo(()=>({enter:p=>$({progress:0},l.enter(p.arc)),update:p=>$({progress:1},l.update(p.arc)),leave:p=>$({progress:0},l.leave(p.arc))}),[l]),c=useTransition(a,{keys:p=>p.id,initial:u.update,from:u.enter,enter:u.update,update:u.update,leave:u.leave,config:s,immediate:!i}),m=[],h=new Map;return c((p,f)=>(m.push(f),h.set(f.id,p),null)),{animatedData:m,animatedArcs:h}};var it=1,Ge=.5,Pe=.4,st="hbr-donut-hover-entity",bt="hbr-donut-select-entity",Nt={top:40,right:60,bottom:90,left:60};function Fe(a){var i=a,{margin:t,itemWidth:e,itemHeight:r,itemsSpacing:n}=i,o=b(i,["margin","itemWidth","itemHeight","itemsSpacing"]);return $({dataFrom:"keys",anchor:"bottom",direction:"row",justify:!1,translateX:-t.left/2,translateY:(t.top+t.bottom)/2,itemsSpacing:n,itemWidth:e,itemHeight:r,itemDirection:"left-to-right",itemOpacity:.85,symbolSize:20,itemTextColor:"var(--base-text-default, #23282E)",effects:[{on:"hover",style:{itemOpacity:1}}]},o)}function B(t){let e=String(t).toLowerCase();return e.indexOf("no data")!==-1||e==="null"}function Ee(t,e){var o,a,i;let r=e.target,n=e.key==="ArrowLeft"||e.key==="ArrowUp"?(o=r.parentElement)==null?void 0:o.previousSibling:e.key==="ArrowRight"||e.key==="ArrowDown"?(a=r.parentElement)==null?void 0:a.nextSibling:null;(i=n==null?void 0:n.firstChild)==null||i.focus();}function Gr(t){var r,n;let{id:e="id"}=t;return (n=(r=t.data)==null?void 0:r.findIndex(o=>{let a=typeof e=="function"?e(o):o[e];return typeof a=="string"&&(a.toLowerCase()==="no data"||a.toLowerCase()==="null")}))!=null?n:-1}var ke=t=>typeof t!="number"?[]:["var(--accent-a-default, #7D8AFF)","var(--accent-b-default, #B02863)","var(--accent-c-default, #F2638C)","var(--accent-d-default, #753BCC)","var(--accent-e-default, #6BA32A)","var(--accent-f-default, #AD3907)","var(--accent-g-default, #04A4B0)","var(--accent-h-default, #006773)","var(--accent-i-default, #E85FC6)","var(--accent-j-default, #545C8A)"].slice(0,t),$t=t=>{var r,n;let e=Gr(t);if(e!==-1){let o=ke((r=t==null?void 0:t.data)==null?void 0:r.length);return o[e]="var(--viz-color-neutral-80)",o}return ke((n=t==null?void 0:t.data)==null?void 0:n.length)};function ht(){return [{match:{id:"No Data"},id:"no-value-pattern"},{match:{id:"no data"},id:"no-value-pattern"},{match:{id:"No data"},id:"no-value-pattern"},{match:{id:"null"},id:"no-value-pattern"},{match:{id:"Null"},id:"no-value-pattern"},{match:{id:"NULL"},id:"no-value-pattern"}]}var zt=(t,e)=>{let r=t.target,n=r.getAttribute("d"),o=Tt(n);if(o){let a=r.parentElement,i=a.querySelector('[selected="true"]');i==null||i.removeAttribute("selected"),r.setAttribute("selected","true"),r.setAttribute("opacity","1");let s=1.05,l=a.querySelector(`#${bt}`);l?(l.setAttribute("d",o),l.setAttribute("stroke",e.color)):(l=document.createElementNS("http://www.w3.org/2000/svg","path"),l.setAttribute("d",o),l.setAttribute("stroke-width","5"),l.setAttribute("fill","transparent"),l.setAttribute("stroke",e.color),l.style.scale=`${s}`,l.id=bt,l.style.pointerEvents="none",a.prepend(l));let u=a.querySelector(`#${st}`);u&&(a.removeChild(u),r.removeAttribute("hovering")),[...a.querySelectorAll("path")].filter(c=>c!==l&&c!==r).forEach(c=>{c.setAttribute("opacity",`${Pe}`);});}},ve=(t,e)=>{let r=e.querySelector(`#${bt}`);r==null||r.remove(),e.querySelectorAll("svg > g > g:first-child>path").forEach(o=>{o.setAttribute("hovering","false"),o.setAttribute("selected","false"),o.setAttribute("opacity",`${it}`);});},lt=(t,e,r)=>{if(r){if(t.target){let n=t.target,o=n.parentElement,a=o.querySelector(`#${st}`),i=o.querySelector(`#${bt}`),s=o.querySelector('[selected="true"]'),l=o.querySelector('[hover="true"]');a&&(o.removeChild(a),i?([...o.querySelectorAll("path")].filter(u=>u!==i&&u!==s).forEach(u=>{u.setAttribute("opacity",`${Pe}`);}),s==null||s.setAttribute("opacity",`${it}`)):([...o.querySelectorAll("path")].filter(u=>u!==a&&u!==n).forEach(u=>{u.setAttribute("opacity",`${it}`);}),l==null||l.setAttribute("opacity",`${it}`)),n.removeAttribute("hovering"));}}else {let n=t.target,o=n.getAttribute("d"),a=Tt(o);if(a){let i=n.parentElement,s=i.querySelector(`#${bt}`),l=i.querySelector('[selected="true"]'),u=i.querySelector('[hover="true"]');u==null||u.removeAttribute("hover"),n.setAttribute("hovering","true"),n.setAttribute("opacity",`${it}`);let c=i.querySelector(`#${st}`);n!==l&&(c?(c.setAttribute("d",a),c.setAttribute("stroke",e.color)):(c=document.createElementNS("http://www.w3.org/2000/svg","path"),c.setAttribute("d",a),c.setAttribute("stroke-width","10"),c.setAttribute("fill","transparent"),c.setAttribute("stroke",e.color),c.id=st,c.style.pointerEvents="none",i.prepend(c))),[...i.querySelectorAll("path")].filter(m=>m!==c&&m!==n&&m!==s&&m!==l).forEach(m=>{m.setAttribute("opacity",`${Ge}`);});}}},ct=(t,e,r=!1)=>{if(t)if(r){let n=t.parentElement;[...n.querySelectorAll("path")].forEach(a=>{a.setAttribute("opacity",`${it}`);});let o=n.querySelector(`#${st}`);o==null||o.remove();}else {let n=t.getAttribute("d"),o=Tt(n);if(o){let a=t.parentElement,i=a.querySelector(`#${bt}`),s=a.querySelector('[selected="true"]'),l=a.querySelector('[hover="true"]');l==null||l.removeAttribute("hover"),t.setAttribute("hovering","true"),t.setAttribute("opacity",`${it}`);let u=a.querySelector(`#${st}`);t!==s&&(u?(u.setAttribute("d",o),u.setAttribute("stroke",e!=null?e:"")):(u=document.createElementNS("http://www.w3.org/2000/svg","path"),u.setAttribute("d",o),u.setAttribute("stroke-width","10"),u.setAttribute("fill","transparent"),u.setAttribute("stroke",e!=null?e:""),u.id=st,u.style.pointerEvents="none",a.prepend(u))),[...a.querySelectorAll("path")].filter(c=>c!==u&&c!==t&&c!==i&&c!==s).forEach(c=>{c.setAttribute("opacity",`${Ge}`);});}}};function we(t,e,r){var o;let n=e.currentTarget.closest("svg").querySelector(`[datum-id="${t}"]`);n&&(n.setAttribute("data-input-modality","keyboard"),(o=n.parentElement)==null||o.querySelectorAll(".arc-path-focus").forEach(a=>{a.setAttribute("opacity",r?"1":"0");}));}function Ie(t){let{data:e=[],id:r="id"}=t;return e.map((n,o)=>{let a=typeof r=="function"?r(n):n[r];return {match:{id:String(a)},id:`harbor-pattern-${o+1}`}})}var oe=new WeakMap,Te=(t,e)=>(oe.set(t,e),()=>{oe.delete(t);});function nt(t,e,r){var i,s,l,u;let n=e.currentTarget.closest("svg");if(!n)return;let o=n.querySelector(`[datum-id="${t}"]`);if(((i=o==null?void 0:o.dataset)==null?void 0:i.categorical)==="true"&&n.style.setProperty("overflow","visible","important"),(s=oe.get(n))==null||s(t,r),((l=o==null?void 0:o.dataset)==null?void 0:l.gauge)==="true"||((u=o==null?void 0:o.dataset)==null?void 0:u.categorical)==="true"){let c=r==="expanded"?o.dataset.hoverFill:r==="active"?o.dataset.activeFill:r==="focus"?o.dataset.focusFill:o.dataset.defaultFill;c&&o.setAttribute("fill",c);}n.querySelectorAll(".arc-link-label").forEach(c=>{c.id===String(t)&&c.classList.toggle("arc-link-label--hover",r==="expanded");});}function Wt(t,e){var o;let r=e.currentTarget,n=r.matches("[datum-id]")?r:(o=r.closest("svg"))==null?void 0:o.querySelector(`[datum-id="${t}"]`);return (n==null?void 0:n.getAttribute("data-selected"))==="true"?"active":"base"}function Oe(t,e){nt(t.id,e,"expanded");}function Ne(t,e){nt(t.id,e,"focus");}function $e(t){var a;let e=t.currentTarget;if(!e)return !1;let r=e.getRootNode(),n="activeElement"in r?r.activeElement:(a=e.ownerDocument)==null?void 0:a.activeElement,o=e.getAttribute("data-input-modality");return (n===e||e.matches(":focus"))&&o==="keyboard"}function ze(t,e){$e(e)||nt(t.id,e,Wt(t.id,e));}function We(t,e){nt(t.id,e,Wt(t.id,e));}function _e(t,e){nt(t.id,e,"expanded");}function Ve(t,e){nt(t.id,e,Wt(t.id,e));}function Ue(t,e){nt(t.id,e,"focus"),we(t.id,e,!0);}function ae(t,e){nt(t.id,e,Wt(t.id,e)),we(t.id,e,!1);}function _t(t,e,r){var m,h,p,f,M;let n=e.target,o=n.closest("svg");o==null||o.style.setProperty("overflow","visible","important");let a=o.querySelector(`[datum-id="${t.id}"]`),i=a.getAttribute("data-selected")==="true";i?a.removeAttribute("data-selected"):a.setAttribute("data-selected","true");let s=!i,l=a.getAttribute("data-input-modality"),u=$e(e);nt(t.id,e,!s&&u?"expanded":s?"active":"base"),(m=a.parentElement)==null||m.querySelectorAll(".arc-path-focus").forEach(y=>{let C=!s&&l==="keyboard"&&document.activeElement===a;y.setAttribute("opacity",C?"1":"0");}),(h=a.parentElement)==null||h.querySelectorAll(".arc-path-selected").forEach(y=>{y.setAttribute("opacity",i?"0":"1");});let c=Array.from((M=(f=(p=n.parentElement)==null?void 0:p.parentElement)==null?void 0:f.children)!=null?M:[]).map(y=>{var C;return (C=y.children)==null?void 0:C[0]}).filter(y=>!!y).filter(y=>y.getAttribute("data-selected")==="true");r==null||r(t,e,c);}function Be(t){t.querySelectorAll(".arc-path[data-selected]").forEach(e=>{var n;e.removeAttribute("data-selected");let r=e.dataset.defaultFill;r&&e.setAttribute("fill",r),(n=e.parentElement)==null||n.querySelectorAll(".arc-path-selected").forEach(o=>{o.setAttribute("opacity","0");});});}var pt=({datum:t,label:e,style:r},n)=>react.exports.createElement(animated.g,{transform:r.transform},n&&!B(t.id)?react.exports.createElement("text",{textAnchor:"middle",dominantBaseline:"central",fill:"var(--viz-donut-text-in)","datum-id":t.id,"datum-value":t.value,style:{pointerEvents:"none"}},e):null);var qe={width:"100%",height:"100%",overflow:"visible"},Fr=t=>t<=204?"sm":t<=307?"md":"lg",Er=(t,e,r)=>react.exports.createElement("div",{className:"gauge-center-content__container"},react.exports.createElement("div",{className:["gauge-center-content__layout",e].filter(Boolean).join(" ")},react.exports.createElement("div",{className:"gauge-center-content__value-row"},react.exports.createElement("slot",{name:`${t}-value`}),react.exports.createElement("slot",{name:`${t}-suffix`})),react.exports.createElement("slot",{name:`${t}-label`,className:r==="md"||r==="sm"?"gauge-center-content__label--compact":void 0})),react.exports.createElement("slot",{name:"status-tag"})),vr=t=>react.exports.createElement("div",{className:"donut-center-content__layout"},react.exports.createElement("slot",{name:`${t}-label`,className:"donut-center-content__label-slot"}),react.exports.createElement("slot",{name:`${t}-sublabel`,className:"donut-center-content__sublabel-slot"})),Vt=({dataWithArc:t,centerX:e,centerY:r,innerRadius:n},o,a,i="center",s="default",l,u)=>{var k,A,L;if(!o&&!a)return null;let c=Math.max(0,n),m=i==="center-baseline",h=s==="gauge",p=s==="donut",f=Math.round(((A=(k=t[0])==null?void 0:k.arc.outerRadius)!=null?A:e)*2),M=p?Fr(f):void 0,y={x:m?-c/2:e-c/2,y:m?-c:r-c/2,width:c,height:c,transform:m?`translate(${e}, ${r})`:void 0,className:h?"gauge-center-content":p?"donut-center-content":void 0,"data-size":(L=h?u:void 0)!=null?L:M,style:m?void 0:{overflow:"visible"}},C=a?h?Er(a,l,u):p?vr(a):react.exports.createElement("slot",{name:a,style:qe}):react.exports.createElement(h?"hbr-layout":"div",S($({},h?{className:["gauge-center-content__layout",l].filter(Boolean).join(" "),direction:"column",align:"center",justify:"end",gap:"none"}:{style:qe}),{dangerouslySetInnerHTML:{__html:o(t)}}));return react.exports.createElement("foreignObject",y,C)};var Bt=({arcGenerator:t,centerX:e,centerY:r,dataWithArc:n,radius:o},a,i)=>{var U,E,W,$,_,z,F,b,I,V,j,Z,J,H;if(!a||!((U=a.ticks)!=null&&U.length)||!n.length)return null;let s=Math.min(...n.map(x=>Math.min(x.arc.startAngle,x.arc.endAngle))),l=Math.max(...n.map(x=>Math.max(x.arc.startAngle,x.arc.endAngle))),u=(E=a.min)!=null?E:0,c=(W=a.max)!=null?W:100,m=a.showLabels!==!1&&i!=="sm",h=($=a.radiusOffset)!=null?$:10,p=(_=a.ringWidth)!=null?_:3,f=(z=a.labelOffset)!=null?z:10,M=(F=a.labelColor)!=null?F:"var(--base-text-medium-default)",y=(b=a.fontSize)!=null?b:12,C=(I=a.fontWeight)!=null?I:400,k=(V=a.fontFamily)!=null?V:"var(--viz-font-body)",A=a.ticks.map(x=>typeof x=="number"?{value:x}:x),L=(j=a.labelFormatter)!=null?j:x=>{var G;return (G=x.label)!=null?G:String(x.value)},P=(Z=a.segmentOverlapAngle)!=null?Z:0,g=(J=a.segmentGapAngle)!=null?J:0,d=o+h,S=5;if(c<=u)return null;let N=x=>{let K=(Math.min(Math.max(x,u),c)-u)/(c-u);return s+(l-s)*K},w=(x,G)=>{let K=x-Math.PI/2;return {x:Math.cos(K)*G,y:Math.sin(K)*G,cos:Math.cos(K)}},O=x=>Math.abs(x)<.2?"middle":x>0?"start":"end",T=((H=a.segments)!=null?H:[]).filter(x=>x.to>x.from).map(x=>{let G=N(x.from),K=N(x.to),at={startAngle:G+g/2-P/2,endAngle:K-g/2+P/2,innerRadius:d-p,outerRadius:d};return react.exports.createElement("path",{key:`gauge-scale-segment-${x.from}-${x.to}`,d:t(at),fill:x.color,stroke:"none",style:{pointerEvents:"none"}})}),q=m?A.map(x=>{let G=w(N(x.value),d+f);return react.exports.createElement("text",{key:`gauge-scale-tick-${x.value}`,x:G.x,y:G.y-(x.value<=u||x.value>=c?S:0),fill:M,fontSize:y,fontWeight:C,fontFamily:k,textAnchor:O(G.cos),dominantBaseline:"central",style:{pointerEvents:"none"}},L(x))}):[];return react.exports.createElement("g",{transform:`translate(${e}, ${r})`},...T,...q)};var qt=({x:t,y:e,size:r,fill:n,borderWidth:o,borderColor:a,id:i},s,l,u=0,c=2)=>{let{legendShapePadding:m=c,pattern:h}=s,p=n;if(h){let M=l.find(y=>y.match.id===i);M&&(p=`url(#${M.id})`);}let f=react.exports.createElement("rect",{x:t+m,y:e+m,fill:B(i)?"url(#no-value-pattern)":p,strokeWidth:o,stroke:a,width:r-m*2,height:r-m*2,rx:u>0?u:void 0,ry:u>0?u:void 0,style:{pointerEvents:"none"}});return react.exports.createElement(react.exports.Fragment,{},f)};var je={top:40,right:60,bottom:90,left:60},wr=(t,e,r)=>{var i;let n=(t==null?void 0:t.margin)||je;return [$({dataFrom:"keys",anchor:"bottom",direction:"row",justify:!1,translateX:-n.left/2,translateY:(n.top+n.bottom)/2,itemsSpacing:10,itemWidth:100,itemHeight:20,itemDirection:"left-to-right",itemOpacity:.85,symbolSize:20,itemTextColor:"var(--base-text-default, #23282E)",effects:[{on:"hover",style:{itemOpacity:1}}],symbolShape:s=>qt(s,t,r),eventDivHandlerStyle:s=>B(s.id)?{pointerEvents:"none",display:"contents"}:{},onMouseLeave:(s,l)=>{var c;let u=l.target.closest("svg");if(u){let m=u.querySelector(`[datum-id="${s.id}"]`);ct(m,null,!0),(c=e==null?void 0:e.onMouseLeave)==null||c.call(e,s,l);}},onMouseEnter:(s,l)=>{var c;let u=l.target.closest("svg");if(u){let m=u.querySelector(`[datum-id="${s.id}"]`);ct(m,s.color),(c=e==null?void 0:e.onMouseEnter)==null||c.call(e,s,l);}},onFocus:(s,l)=>{var c;let u=l.target.closest("svg");if(u){let m=u.querySelector(`[datum-id="${s.id}"]`);ct(m,s.color),(c=e==null?void 0:e.onFocus)==null||c.call(e,s,l);}},onBlur:(s,l)=>{var c;let u=l.target.closest("svg");if(u){let m=u.querySelector(`[datum-id="${s.id}"]`);ct(m,null,!0),(c=e==null?void 0:e.onBlur)==null||c.call(e,s,l);}},onClick:(s,l)=>{var u;(u=e==null?void 0:e.onClick)==null||u.call(e,s,l);},onKeyUp:(s,l)=>{var c,m,h,p,f,M,y,C,k,A,L,P;let u=l.target;l.key==="ArrowLeft"?(h=(m=(c=u.parentElement)==null?void 0:c.previousSibling)==null?void 0:m.firstChild)==null||h.focus():l.key==="ArrowRight"?(M=(f=(p=u.parentElement)==null?void 0:p.nextSibling)==null?void 0:f.firstChild)==null||M.focus():l.key==="ArrowUp"?(k=(C=(y=u.parentElement)==null?void 0:y.previousSibling)==null?void 0:C.firstChild)==null||k.focus():l.key==="ArrowDown"&&((P=(L=(A=u.parentElement)==null?void 0:A.nextSibling)==null?void 0:L.firstChild)==null||P.focus());}},(t==null?void 0:t.legends)&&!!((i=t==null?void 0:t.legends)!=null&&i.length)&&(t==null?void 0:t.legends[0]))]};function Ke(t$1,{legendsEventHandlers:e,itemsEventHandlers:r}){var a;let n=t$1!=null&&t$1.pattern?Ie(t$1):[];return {margin:je,colors:$t(t$1),innerRadius:.5,enableArcLinkLabels:!0,arcLinkLabelsDiagonalLength:0,arcLinkLabelsStraightLength:36,arcLinkLabelsTextColor:(t$1==null?void 0:t$1.arcLinkLabelsTextColor)||"var(--base-text-default)",arcLinkLabelsColor:(t$1==null?void 0:t$1.arcLinkLabelsColor)||"var(--base-text-default)",enableArcLabels:!1,borderWidth:3,borderColor:(t$1==null?void 0:t$1.borderColor)||"var(--control-bg-weak-default, var(--base-bg-weak-default, rgb(255, 255, 255)))",ariaLabel:"",ariaDescribedBy:"",isFocusable:!0,role:"application",tooltip:({datum:i})=>r!=null&&r.tooltipCallback?r==null?void 0:r.tooltipCallback(i,t$1==null?void 0:t$1.itemTooltip):null,layers:["arcs",t$1!=null&&t$1.gaugeScale?i=>Bt(i,t$1.gaugeScale):null,"arcLinkLabels","arcLabels",!(t$1!=null&&t$1.legends)||(a=t$1==null?void 0:t$1.legends)!=null&&a.length?"legends":null,i=>Vt(i,t$1==null?void 0:t$1.centerContent,t$1==null?void 0:t$1.centerSlotName)],arcLabelsComponent:i=>{var s;return pt(i,(s=t$1==null?void 0:t$1.enableArcLabels)!=null?s:!1)},onMouseEnter:(i,s)=>{var l,u;lt(s,i),(l=t$1==null?void 0:t$1.onMouseEnter)==null||l.call(t$1,i,s),(u=r==null?void 0:r.onMouseEnter)==null||u.call(r,i,s);},onMouseMove:(i,s)=>{var l,u;(l=t$1==null?void 0:t$1.onMouseMove)==null||l.call(t$1,i,s),(u=r==null?void 0:r.onMouseMove)==null||u.call(r,i,s);},onMouseLeave:(i,s)=>{var l,u;lt(s,i,!0),(l=t$1==null?void 0:t$1.onMouseLeave)==null||l.call(t$1,i,s),(u=r==null?void 0:r.onMouseLeave)==null||u.call(r,i,s);},onClick:(i,s)=>{var l,u;zt(s,i),(l=t$1==null?void 0:t$1.onClick)==null||l.call(t$1,i,s),(u=r==null?void 0:r.onClick)==null||u.call(r,i,s),s.stopPropagation(),s.preventDefault();},onMouseDown:(i,s)=>{s.stopPropagation(),s.preventDefault();},onFocus:(i,s)=>{var u,c,m;let{id:l}=i;lt(s,i),(u=t$1==null?void 0:t$1.onFocus)==null||u.call(t$1,i,s),(c=r==null?void 0:r.onFocus)==null||c.call(r,i,s),(m=r==null?void 0:r.tooltipCallback)==null||m.call(r,{id:l,config:t$1,event:s},t$1==null?void 0:t$1.itemTooltip);},onBlur:(i,s)=>{var l,u,c;lt(s,i,!0),(l=t$1==null?void 0:t$1.onBlur)==null||l.call(t$1,i,s),(u=r==null?void 0:r.onBlur)==null||u.call(r,i,s),(c=r==null?void 0:r.tooltipCallback)==null||c.call(r,{id:null,config:t$1,event:null},t$1==null?void 0:t$1.itemTooltip);},legends:wr(t$1,e,n),fill:[...ht(),...n],defs:[{id:"no-value-pattern",type:"patternLines",spacing:4,rotation:-45,lineWidth:2,background:"var(--viz-color-neutral-90)",color:"var(--viz-color-neutral-80)"},...t$1!=null&&t$1.pattern?t():[]],theme:{fontSize:"var(--viz-font-size-2xs)",fontFamily:"var(--viz-font-body)",textColor:"var(--base-text-default)"}}}var Ir=t=>t.includes("--data-viz-")?t.replace(/-default(?=[,)\s]|$)/g,"-hover"):t.replace(/--accent-([a-z])-default(?=[,)])/g,"--accent-$1-hover"),Ye=({centerX:t,centerY:e,dataWithArc:r,arcGenerator:n,pattern:o,patternColors:a,isGauge:i,isGaugeBackground:s,animatedArcs:l,getArcCornerRadius:u,isInteractive:c,isFocusable:m,onMouseEnter:h,onMouseLeave:p,onMouseMove:f,onClick:M,onFocus:y,onBlur:C,onKeyDown:k,onKeyUp:A,sliceAriaLabel:L,sliceAriaLabelledBy:P,sliceAriaDescribedBy:g,sliceAriaDisabled:d,sliceAriaHidden:S$1,activeOuterRadiusOffset:N,activeInnerRadiusOffset:w,sectorArcStyles:O,selectedArcStyle:T,borderWidth:q,borderColor:U,focusOutlineColor:E,focusOutlineUnderlayColor:W})=>{let $$1=(_,z)=>{var j;let F=_.currentTarget,b=F.getAttribute("data-input-modality"),I=(j=F.parentElement)==null?void 0:j.querySelectorAll(".arc-path-focus"),V=z&&b!=="pointer"?"1":"0";I==null||I.forEach(Z=>{Z.setAttribute("opacity",z?V:"0");});};return React.createElement(React.Fragment,null,(()=>{let _=b=>s&&(String(b.id).trim()===""||B(b.id)),z=s&&r.length?{startAngle:Math.min(...r.map(({arc:b})=>b.startAngle)),endAngle:Math.max(...r.map(({arc:b})=>b.endAngle))}:void 0,F=z?[...r].sort((b,I)=>Number(_(I))-Number(_(b))):r;return F.map((b,I)=>{var de;if(b.hidden!==!1)return null;let V=_(b),j=B(b.id)||V,Z=V?$($({},b.arc),z):b.arc,J=u==null?void 0:u(b,I,F),{fill:H,strokeWidth:x,stroke:G}=(O==null?void 0:O(b))||{},K=b.fill,at=a==null?void 0:a.findIndex(v=>v===b.color),Dt=a!=null&&a.length?at!==void 0&&at>=0?at:I%a.length:void 0,Mt=o?`url(#${m$1(I+1,"default",Dt)})`:void 0,Rt=o?`url(#${m$1(I+1,"hover",Dt)})`:void 0,X=V?"var(--base-border-default)":B(b.id)?"url(#no-value-pattern)":Mt||K||H||b.color,et=i?Ir(X):Rt||x$1(X,"hover"),Kt=x$1(X,"active"),kt=x$1(X,"focus"),rt=c&&!j,yt=l==null?void 0:l.get(b.id),Yt=v=>yt?dt(yt,b.arc,gt=>v(V?$($({},gt),z):gt)):v(Z),ir=Yt(v=>re(n,v,J)),me=Yt(v=>re(n,ee(v,w,N),J)),sr=Yt(Me);return React.createElement(animated.g,{key:b.id,transform:`translate(${t}, ${e})`,opacity:(de=yt==null?void 0:yt.progress)!=null?de:b.opacity},React.createElement(animated.path,{d:me,className:"arc-path-focus arc-path-focus-outline",opacity:0,fill:"transparent",stroke:E||"var(--control-border-focus)",strokeWidth:6,strokeLinejoin:"round",style:{pointerEvents:"none"},tabIndex:-1}),React.createElement(animated.path,{d:me,className:"arc-path-focus arc-path-focus-underlay",opacity:0,fill:"transparent",stroke:W||"var(--viz-color-empty-shade-bg)",strokeWidth:3,strokeLinejoin:"round",style:{pointerEvents:"none"},tabIndex:-1}),React.createElement(animated.path,{d:ir,"data-input-modality":"keyboard",className:`arc-path ${j?"disabled":""}`,fill:X,"data-gauge":i?"true":void 0,"data-categorical":i?void 0:"true","data-default-fill":X,"data-hover-fill":et,"data-active-fill":Kt,"data-focus-fill":kt,stroke:G||U||"none",strokeWidth:x||q||0,tabIndex:rt&&m?j?-1:0:void 0,onClick:rt?v=>{_t(b,v,M),v.stopPropagation();}:void 0,onMouseDown:rt?v=>{v.currentTarget.setAttribute("data-input-modality","pointer");}:void 0,onMouseEnter:rt?v=>{Oe(b,v),h==null||h(b,v);}:void 0,onMouseLeave:rt?v=>{ze(b,v),p==null||p(b,v);}:void 0,onMouseMove:rt?v=>f==null?void 0:f(b,v):void 0,onFocus:rt&&m?v=>{let gt=v.currentTarget;gt.matches(":focus-visible")&&gt.setAttribute("data-input-modality","keyboard"),Ne(b,v),$$1(v,!0),y==null||y(b,v);}:void 0,onBlur:rt&&m?v=>{We(b,v),$$1(v,!1),C==null||C(b,v);}:void 0,onKeyDown:rt?v=>{v.currentTarget.setAttribute("data-input-modality","keyboard"),k==null||k(b,v);}:void 0,onKeyUp:rt?v=>A==null?void 0:A(b,v):void 0,"datum-id":b.id,"datum-value":b.value,"datum-color":b.color,"datum-formatted-value":b.formattedValue,"aria-label":L==null?void 0:L(b),"aria-labelledby":P==null?void 0:P(b),"aria-describedby":g==null?void 0:g(b),"aria-disabled":d==null?void 0:d(b),"aria-hidden":S$1==null?void 0:S$1(b)}),React.createElement(animated.path,S($({d:sr,className:"arc-path-selected",opacity:0,fill:"transparent",stroke:"var(--viz-donut-color-select-ring)",strokeWidth:5,style:{pointerEvents:"none"},transform:"scale(1.05)"},T==null?void 0:T(b)),{tabIndex:-1})))})})())};var Xe=({dataWithArc:t,animatedArcs:e,activeId:r,labelPositionData:n,centerX:o,centerY:a,arcLinkLabelsOffset:i,arcLinkLabelsDiagonalLength:s,arcLinkLabelsStraightLength:l,arcLinkLabelsTextOffset:u,arcLinkLabelsThickness:c,arcLinkLabelsSkipAngle:m,arcLinkLabelsColor:h,arcLinkLabelsHtml:p,missingDataLabel:f="Missing data",margin:M={top:0,right:0,bottom:0,left:0},autoSize:y})=>{let{width:C=160,height:k=20,labelTemplate:A,labelContent:L}=p||{},P=s>0,g=l>0;return react.exports.createElement("g",null,...t.filter(d=>(d.arc.endAngle-d.arc.startAngle)*(180/Math.PI)>=m).map(d=>{var b,I,V,j,Z,J,H,x;let S$1=n==null?void 0:n.find(G=>G.id===d.id),N=typeof C=="function"?C(d):C,w={centerX:o,centerY:a,arcLinkLabelsOffset:i,arcLinkLabelsDiagonalLength:s,arcLinkLabelsStraightLength:l,arcLinkLabelsTextOffset:u,margin:M,requestedLabelWidth:N,height:k,measuredLabelWidth:(b=y==null?void 0:y.labelWidths)==null?void 0:b[String(d.id)],autoSize:y},O=e==null?void 0:e.get(d.id),T=Ot(d.arc,w),q=S$1?Ot(S$1.arc,w):T,U=S($({},w),{resting:S$1?{arc:S$1.arc,coordinates:q}:void 0}),E=O?dt(O,d.arc,G=>{let K=Ot(G,w);return S($({},K),{d:ne(K,G,U)})}):void 0,W=typeof h=="function"?h(d):h,$$1=B(d.id)?f:`${d.label}: ${d.value}`,_=A?A(d,react.exports.createElement):L?react.exports.createElement("div",{dangerouslySetInnerHTML:{__html:L(d)}}):react.exports.createElement("div",null,$$1),z=react.exports.createElement(animated.div,{style:y?{fontFamily:y.fontFamily||void 0,fontSize:`${y.fontSize}px`,lineHeight:`${y.fontSize*1.2}px`,display:"flex",alignItems:"center",justifyContent:E?E.to(({textAnchor:G})=>G==="end"?"flex-end":"flex-start"):T.textAnchor==="end"?"flex-end":"flex-start",width:"100%",height:"100%",boxSizing:"border-box","--hbr-font-size-xs":`${y.fontSize}px`}:void 0},_),F=G=>`arc-link-label arc-link-label--${G}${d.id===r?" arc-link-label--hover":""}`;return react.exports.createElement(animated.g,{className:F(T.textAnchor),"data-side":(I=E==null?void 0:E.to(({textAnchor:G})=>G))!=null?I:T.textAnchor,key:d.id,id:String(d.id),opacity:(V=O==null?void 0:O.progress)!=null?V:d.opacity},!(y!=null&&y.hide)&&(P||g)&&react.exports.createElement(animated.path,{d:(j=E==null?void 0:E.to(({d:G})=>G))!=null?j:ne(T,d.arc,U),fill:"none",stroke:W,strokeWidth:c}),!(y!=null&&y.hide)&&react.exports.createElement(animated.foreignObject,{x:S$1?q.x:(Z=E==null?void 0:E.to(({x:G})=>G))!=null?Z:T.x,y:S$1?q.y:(J=E==null?void 0:E.to(({y:G})=>G))!=null?J:T.y,width:S$1?q.width:(H=E==null?void 0:E.to(({width:G})=>G))!=null?H:T.width,height:T.height,style:{pointerEvents:"none",overflow:"visible",textAlign:(x=E==null?void 0:E.to(({textAnchor:G})=>G))!=null?x:T.textAnchor}},z))}))};var Ze=t=>React.createElement("defs",null,...O("default",t),...O("hover",t),React.createElement("filter",{id:"sector-filter",x:"-50%",y:"-50%",width:"200%",height:"200%"},React.createElement("feGaussianBlur",{in:"SourceGraphic",stdDeviation:2,result:"blur"}),React.createElement("feFlood",{floodColor:"white",result:"whiteFill"}),React.createElement("feComposite",{in:"whiteFill",in2:"blur",operator:"in",result:"whiteGlow"}),React.createElement("feMerge",null,React.createElement("feMergeNode",{in:"whiteGlow"}),React.createElement("feMergeNode",{in:"SourceGraphic"}))));var Nr=t=>{var e;return (e=t.formattedValue)!=null?e:t.value},$r=({dataWithArc:t,centerX:e,centerY:r,arcGenerator:n,activeInnerRadiusOffset:o=0,activeOuterRadiusOffset:a=0,transitionMode:i,arcProps:s,linkProps:l,labelProps:u})=>{var C,k;let c=react.exports.useRef(null),[m,h]=react.exports.useState(null),{animatedData:p,animatedArcs:f}=Re(t,{mode:i,activeId:m,activeInnerRadiusOffset:o,activeOuterRadiusOffset:a}),M=Gi((C=u.label)!=null?C:Nr);react.exports.useLayoutEffect(()=>{var L;let A=(L=c.current)==null?void 0:L.closest("svg");if(A)return Te(A,(P,g)=>{var S,N;let d=(N=(S=t.find(w=>String(w.id)===String(P)))==null?void 0:S.id)!=null?N:P;h(g==="expanded"?d:w=>w===d?null:w);})},[t]);let y=(k=u.radiusOffset)!=null?k:.5;return react.exports.createElement("g",{ref:c},Ye(S($({},s),{dataWithArc:p,centerX:e,centerY:r,arcGenerator:n,animatedArcs:f,activeInnerRadiusOffset:0,activeOuterRadiusOffset:0})),l&&Xe(S($({},l),{dataWithArc:p,labelPositionData:l.fixedLabelPositionOnExpand?t:void 0,animatedArcs:f,activeId:m,centerX:e,centerY:r,activeOuterRadiusOffset:0})),u.enabled&&react.exports.createElement("g",{transform:`translate(${e},${r})`},p.filter(A=>{var L;return A.hidden===!1&&Math.abs((A.arc.endAngle-A.arc.startAngle)*(180/Math.PI))>=((L=u.skipAngle)!=null?L:0)}).map(A=>{let L=f.get(A.id);if(!L)return null;let P={datum:A,label:M(A),style:{transform:dt(L,A.arc,g=>xe(g,y))}};return react.exports.createElement(animated.g,{key:A.id,opacity:L.progress},u.component?react.exports.createElement(u.component,P):pt(P,!0))})))},Je=new WeakMap,Qe=(t,e)=>{let r=Je.get(t);return r||(r={config:e,listeners:new Set},Je.set(t,r)),r},He=t=>e=>{let r=Qe(e.arcGenerator,t);return react.exports.useLayoutEffect(()=>{r.config=t;for(let n of r.listeners)n();},[r,t]),Ze(t.patternColors)},tr=t=>{let e=react.exports.useMemo(()=>{let n=Qe(t.arcGenerator);return {subscribe:o=>(n.listeners.add(o),()=>{n.listeners.delete(o);}),getSnapshot:()=>n.config}},[t.arcGenerator]),r=react.exports.useSyncExternalStore(e.subscribe,e.getSnapshot,e.getSnapshot);return r?react.exports.createElement($r,$($({},t),r)):null};var Vr=t=>{var e,r,n,o;return typeof t=="number"?{top:t,right:t,bottom:t,left:t}:{top:(e=t==null?void 0:t.top)!=null?e:0,right:(r=t==null?void 0:t.right)!=null?r:0,bottom:(n=t==null?void 0:t.bottom)!=null?n:0,left:(o=t==null?void 0:t.left)!=null?o:0}},Ur=16,Br=(t,e,r,n,o,a)=>Math.max(a,Math.ceil(n+o+Gt(Tt$1(String(t),`${e}px ${r}`))+Ur)),er=({dataWithArc:t,centerX:e,centerY:r,legend:n,isFocusable:o,isInteractive:a})=>{var N,w,O,T,q,U,E;let i=Et$1(),s=Pt(i.legends.text.fontSize),l=Ft(i.legends.text.fontFamily),u=n,c=Vr(u.padding),m=(N=u.itemsSpacing)!=null?N:0,h=(w=u.itemHeight)!=null?w:20,p=(O=u.symbolSize)!=null?O:16,f=(T=u.symbolSpacing)!=null?T:8,M=(q=u.itemWidth)!=null?q:0,y=Math.max(0,e*2-c.left-c.right),C=t.map(W=>({id:W.id,label:W.label,hidden:W.hidden,color:W.color})),k=[],A=[],L=0;C.forEach(W=>{let $=Br(W.label,s,l,p,f,M),_=A.length?L+m+$:$;u.direction==="row"&&A.length>0&&_>y&&(k.push(A),A=[],L=0),A.push({data:W,width:$}),L=A.length===1?$:L+m+$;}),A.length>0&&k.push(A);let g=(k.length?Math.min(y,Math.max(...k.map(W=>W.reduce(($,_)=>$+_.width,0)+Math.max(W.length-1,0)*m))):0)+c.left+c.right,d=k.length*h+Math.max(k.length-1,0)*m+c.top+c.bottom,S=x({anchor:u.anchor,translateX:(U=u.translateX)!=null?U:0,translateY:(E=u.translateY)!=null?E:0,containerWidth:e*2,containerHeight:r*2,width:g,height:d});return react.exports.createElement("g",{transform:`translate(${S.x}, ${S.y})`},k.flatMap((W,$)=>{let _=c.left;return W.map((z$1,F)=>{var I,V;let b=react.exports.createElement(z,{key:`donut-categorical-legend-${$}-${F}-${String(z$1.data.id)}`,x:_,y:c.top+$*(h+m),width:z$1.width,height:h,data:z$1.data,direction:u.itemDirection,justify:u.justify,textColor:u.itemTextColor,background:u.itemBackground,opacity:u.itemOpacity,symbolShape:u.symbolShape,symbolSize:p,symbolSpacing:f,symbolBorderWidth:u.symbolBorderWidth,symbolBorderColor:u.symbolBorderColor,onClick:u.onClick,onMouseEnter:u.onMouseEnter,onMouseLeave:u.onMouseLeave,onFocus:u.onFocus,onBlur:u.onBlur,onKeyUp:u.onKeyUp,onKeyDown:u.onKeyDown,effects:u.effects,isFocusable:B(z$1.data.id)?!1:(I=u.isFocusable)!=null?I:o,isInteractive:B(z$1.data.id)?!1:(V=u.isInteractive)!=null?V:a});return _+=z$1.width+m,b})}))};var se=(t,e)=>{let r=Math.max(t,100),n=e?205:190,o=150;return r>n?"lg":r>=o?"md":"sm"},xt=(t,e=!1)=>{let{width:r,height:n}=t!=null?t:{};if(!Number.isFinite(r)||!Number.isFinite(n)||r<=0||n<=0)return;let o=Math.min(r,n*2);return se(o,e)};var qr=t=>Math.min(160,Math.max(72,String(t.label).length*7+String(t.value).length*7+32)),jr=(t="Missing data",e)=>({width:qr,labelTemplate:(r,n)=>{var i;let o=B(r.id),a=o?t:r.label;return n("div",{className:"--categorical-donut-link-label"},n("span",{className:"--categorical-donut-link-label-text",title:a},a),!o&&((i=e==null?void 0:e(`${r.value}%`))!=null?i:n("span",{className:"--categorical-donut-link-label-value"},`${r.value}%`)))}}),Kr=(t,e,r,n)=>{var y,C,k,A,L,P;let o=(y=t==null?void 0:t.legends)==null?void 0:y[0],a=ft(t),i=a&&n?n:(t==null?void 0:t.margin)||Nt,s=typeof t.autoSize=="object"&&t.autoSize!==null?t.autoSize:void 0,l=typeof(s==null?void 0:s.dynamicLegendPadding)=="number"&&Number.isFinite(s.dynamicLegendPadding)?Math.max(0,s.dynamicLegendPadding):12,u=Number((C=o==null?void 0:o.itemWidth)!=null?C:a?0:100),c=Number((k=o==null?void 0:o.itemHeight)!=null?k:28),m=Number((A=o==null?void 0:o.itemsSpacing)!=null?A:(o==null?void 0:o.horizontal)===!0?8:10),h=(o==null?void 0:o.horizontal)===!0,p=o==null?void 0:o.padding,f=typeof p=="number"?p*2:p&&typeof p=="object"&&!Array.isArray(p)?Number((L=p.left)!=null?L:0)+Number((P=p.right)!=null?P:0):0;return [Fe($($(S($(S($({margin:i,itemWidth:u,itemHeight:c,itemsSpacing:m,symbolSize:t.legendLayout==="html"?16:28,symbolSpacing:2,translateX:h?u+16+f:a?(i.right-i.left)/2:-i.left/2,translateY:h?0:a?i.bottom:(i.top+i.bottom)/2},h&&{anchor:"right",direction:"column",translateY:0}),{symbolShape:g=>{var d,S;return qt(g,t,r,(d=t.legendShapeRadius)!=null?d:2,(S=t.legendShapePadding)!=null?S:6)},eventDivHandlerStyle:g=>B(g.id)?{pointerEvents:"none",display:"contents",cursor:"default"}:{}}),a&&{padding:{top:typeof(o==null?void 0:o.padding)=="number"?o.padding:l}}),{onMouseLeave:(g,d)=>{var S;B(g.id)||(Ve(g,d),(S=e==null?void 0:e.onMouseLeave)==null||S.call(e,g,d));},onMouseEnter:(g,d)=>{var S;B(g.id)||(_e(g,d),(S=e==null?void 0:e.onMouseEnter)==null||S.call(e,g,d));},onFocus:(g,d)=>{var S;if(!B(g.id)){if(!d.target.matches(":focus-visible"))return;Ue(g,d),(S=e==null?void 0:e.onFocus)==null||S.call(e,g,d);}},onBlur:(g,d)=>{var S;B(g.id)||(ae(g,d),(S=e==null?void 0:e.onBlur)==null||S.call(e,g,d));},onClick:(g,d)=>{B(g.id)||(d.stopPropagation(),_t(g,d,e==null?void 0:e.onClick),ae(g,d));},onKeyUp:Ee}),o!=null?o:{}),a&&{dynamicLegend:!0}))]},Yr=t=>{var n,o,a;let e=(n=t.legends)==null?void 0:n[0],r=(e==null?void 0:e.horizontal)===!0;return t.legendLayout==="html"&&((o=e==null?void 0:e.anchor)!=null?o:r?"right":"bottom")==="bottom"&&((a=e==null?void 0:e.direction)!=null?a:r?"column":"row")==="row"};function nr(t,{legendsEventHandlers:e,itemsEventHandlers:r},n){var h,p,f,M,y,C,k,A,L,P,g,d,S$1,N,w,O,T$1,q,U,E,W,$$1,_,z;let o=Array.isArray(t==null?void 0:t.colors)?t.colors:void 0,a=t!=null&&t.pattern?T(t==null?void 0:t.data,t==null?void 0:t.id,o):[],i=wt(t,n==null?void 0:n.width,n==null?void 0:n.height),s=ft(t),l=Kr(t,e,a,i==null?void 0:i.margin),u=({dataWithArc:F,centerX:b})=>{var j,Z,J,H,x,G,K;if(!(n!=null&&n.isGauge))return;if(t.centerContentSize==="small")return "sm";if(t.centerContentSize==="medium")return "md";if(t.centerContentSize==="large")return "lg";let I=((Z=(j=F[0])==null?void 0:j.arc.outerRadius)!=null?Z:b)*2,V=!!((H=(J=t.gaugeScale)==null?void 0:J.ticks)!=null&&H.length||(G=(x=t.gaugeScale)==null?void 0:x.segments)!=null&&G.length);return (K=xt({width:n.width,height:n.height},V))!=null?K:se(I,V)},c=He({patternColors:o,transitionMode:t==null?void 0:t.transitionMode,activeInnerRadiusOffset:n!=null&&n.isGauge?0:(h=t==null?void 0:t.activeInnerRadiusOffset)!=null?h:0,activeOuterRadiusOffset:n!=null&&n.isGauge?0:(p=t==null?void 0:t.activeOuterRadiusOffset)!=null?p:10,arcProps:{pattern:t==null?void 0:t.pattern,patternColors:t!=null&&t.pattern?t==null?void 0:t.colors:void 0,isGauge:n==null?void 0:n.isGauge,isGaugeBackground:n==null?void 0:n.isGaugeBackground,getArcCornerRadius:n==null?void 0:n.getArcCornerRadius,isInteractive:(f=t==null?void 0:t.isInteractive)!=null?f:!0,isFocusable:(M=t==null?void 0:t.isFocusable)!=null?M:!0,borderWidth:n!=null&&n.isGaugeBackground?0:3,borderColor:(t==null?void 0:t.borderColor)||"var(--control-bg-weak-default, var(--base-bg-weak-default, rgb(255, 255, 255)))",focusOutlineColor:(t==null?void 0:t.focusOutlineColor)||"var(--control-border-focus)",focusOutlineUnderlayColor:(t==null?void 0:t.focusOutlineUnderlayColor)||"var(--base-bg-weak-default)",onMouseEnter:(F,b)=>{var I,V;(I=t==null?void 0:t.onMouseEnter)==null||I.call(t,F,b),(V=r==null?void 0:r.onMouseEnter)==null||V.call(r,F,b);},onMouseLeave:(F,b)=>{var I,V;(I=t==null?void 0:t.onMouseLeave)==null||I.call(t,F,b),(V=r==null?void 0:r.onMouseLeave)==null||V.call(r,F,b);},onMouseMove:t==null?void 0:t.onMouseMove,onClick:t==null?void 0:t.onClick,onFocus:t==null?void 0:t.onFocus,onBlur:t==null?void 0:t.onBlur,onKeyUp:t==null?void 0:t.onKeyUp,onKeyDown:t==null?void 0:t.onKeyDown,sectorArcStyles:t==null?void 0:t.sectorArcStyles,selectedArcStyle:t==null?void 0:t.selectedArcStyle},linkProps:(t==null?void 0:t.enableArcLinkLabels)===!1?void 0:{margin:(y=t==null?void 0:t.margin)!=null?y:Nt,arcLinkLabelsOffset:(C=t==null?void 0:t.arcLinkLabelsOffset)!=null?C:2,arcLinkLabelsDiagonalLength:(k=t==null?void 0:t.arcLinkLabelsDiagonalLength)!=null?k:0,arcLinkLabelsStraightLength:(A=t==null?void 0:t.arcLinkLabelsStraightLength)!=null?A:36,arcLinkLabelsTextOffset:(t==null?void 0:t.arcLinkLabelsTextOffset)||6,arcLinkLabelsThickness:(t==null?void 0:t.arcLinkLabelsThickness)||1,arcLinkLabelsSkipAngle:(t==null?void 0:t.arcLinkLabelsSkipAngle)||0,arcLinkLabelsColor:(t==null?void 0:t.arcLinkLabelsColor)||"var(--base-text-default)",arcLinkLabelsHtml:(L=t==null?void 0:t.arcLinkLabelsHtml)!=null?L:jr(t==null?void 0:t.missingDataLabel,n==null?void 0:n.createTag),fixedLabelPositionOnExpand:(P=t==null?void 0:t.arcLinkLabelsFixedOnExpand)!=null?P:!0,missingDataLabel:t==null?void 0:t.missingDataLabel,autoSize:i==null?void 0:i.autoSizeText},labelProps:{enabled:(g=t==null?void 0:t.enableArcLabels)!=null?g:!1,radiusOffset:(d=t==null?void 0:t.arcLabelsRadiusOffset)!=null?d:.5,skipAngle:(S$1=t==null?void 0:t.arcLabelsSkipAngle)!=null?S$1:0,label:t==null?void 0:t.arcLabel,component:t==null?void 0:t.arcLabelsComponent}});return {animate:t==null?void 0:t.animate,motionConfig:t==null?void 0:t.motionConfig,margin:(O=(w=(N=i==null?void 0:i.margin)!=null?N:t==null?void 0:t.margin)!=null?w:n==null?void 0:n.margin)!=null?O:Nt,colors:(q=t==null?void 0:t.colors)!=null?q:D((T$1=t==null?void 0:t.data)==null?void 0:T$1.length),innerRadius:.65,activeOuterRadiusOffset:n!=null&&n.isGauge?0:(U=t==null?void 0:t.activeOuterRadiusOffset)!=null?U:10,activeInnerRadiusOffset:n!=null&&n.isGauge?0:(E=t==null?void 0:t.activeInnerRadiusOffset)!=null?E:0,enableArcLinkLabels:!0,arcLinkLabelsDiagonalLength:(W=t==null?void 0:t.arcLinkLabelsDiagonalLength)!=null?W:0,arcLinkLabelsStraightLength:($$1=t==null?void 0:t.arcLinkLabelsStraightLength)!=null?$$1:36,arcLinkLabelsFixedOnExpand:(_=t==null?void 0:t.arcLinkLabelsFixedOnExpand)!=null?_:!0,arcLinkLabelsTextColor:(t==null?void 0:t.arcLinkLabelsTextColor)||"var(--base-text-default)",arcLinkLabelsColor:(t==null?void 0:t.arcLinkLabelsColor)||"var(--base-text-default)",enableArcLabels:!1,borderWidth:3,cornerRadius:4,borderColor:(t==null?void 0:t.borderColor)||"var(--control-bg-weak-default, var(--base-bg-weak-default, rgb(255, 255, 255)))",ariaLabel:"",ariaDescribedBy:"",isFocusable:!0,role:"application",tooltip:({datum:F})=>r!=null&&r.tooltipCallback?r==null?void 0:r.tooltipCallback(F,t==null?void 0:t.itemTooltip):null,layers:[c,tr,t!=null&&t.gaugeScale?F=>Bt(F,t.gaugeScale,u(F)):null,(z=t==null?void 0:t.legends)!=null&&z.length?Yr(t)?null:s?F=>{var b,I;return react.exports.createElement(er,S($({},F),{legend:l[0],isFocusable:(b=t.isFocusable)!=null?b:!0,isInteractive:(I=t.isInteractive)!=null?I:!0}))}:"legends":null,F=>Vt(F,t==null?void 0:t.centerContent,t==null?void 0:t.centerSlotName,t==null?void 0:t.centerContentAlignment,t==null?void 0:t.centerContentLayout,t==null?void 0:t.centerContentClassName,u(F))],arcLabelsComponent:F=>{var b;return pt(F,(b=t==null?void 0:t.enableArcLabels)!=null?b:!1)},legends:l,fill:[...ht(),...a],defs:[{id:"no-value-pattern",type:"patternLines",spacing:5,rotation:-45,lineWidth:1.5,background:"var(--base-bg-default, #ffffff)",color:"var(--base-text-disabled, #C1C6CC)"}],theme:{fontSize:"var(--viz-font-size-2xs)",fontFamily:"var(--viz-font-body)",textColor:"var(--base-text-default)",legends:{text:{fontFamily:"var(--hbr-font-body, sans-serif)",fontSize:"var(--hbr-font-size-xs, 11px)",lineHeight:"18px",fill:"var(--base-text-default)"}}}}}var or=t=>{if(t==="sm")return "small";if(t==="md")return "medium";if(t==="lg")return "large"},le={positive:"var(--data-viz-positive-default)",info:"var(--info-icon-default)","low-warning":"var(--data-viz-low-warning-default)",warning:"var(--data-viz-warning-default)","severe-warning":"var(--data-viz-severe-warning-default)",negative:"var(--data-viz-negative-default)",excellent:"var(--data-viz-excellent-default)",inactive:"var(--data-viz-dormant-default)","in-progress":"var(--in-progress-icon-default)",disabled:"var(--base-text-disabled)"},Xr=(t,e)=>{var r;return e&&t.sentiment?le[t.sentiment]:(r=t.color)!=null?r:t.sentiment?le[t.sentiment]:void 0},Zr={radiusOffset:0,ringWidth:0,labelOffset:8},Jr={radiusOffset:6,ringWidth:2.5,segmentGapAngle:.03},Qr={showLabels:!1},Hr={top:0,right:5,bottom:0,left:5},ar={large:{default:{top:0,right:2,bottom:-2,left:2},scale:{top:5,right:30,bottom:-5,left:20},threshold:{top:16,right:25,bottom:0,left:25},status:{top:0,right:2,bottom:-2,left:2}},medium:{default:{top:4,right:20,bottom:0,left:12},scale:{top:4,right:32,bottom:0,left:20},threshold:{top:20,right:10,bottom:5,left:10},status:{top:5,right:5,bottom:2,left:5}},small:{default:{top:0,right:0,bottom:0,left:0},scale:{top:4,right:8,bottom:0,left:8},threshold:{top:6,right:8,bottom:0,left:8},status:{top:0,right:0,bottom:0,left:0}}},tn=t=>{var e,r;return t.status?"status":(r=(e=t.gaugeScale)==null?void 0:e.segments)!=null&&r.length?"threshold":t.gaugeScale?"scale":"default"},en=(t,e,r=t)=>{var n;return e.gaugeScale&&!e.status&&!((n=e.gaugeScale.segments)!=null&&n.length)&&(t==="small"||e.gaugeScale.showLabels===!1)?ar[r].default:ar[t][tn(e)]},rn=4,nn=(t,e)=>{let{width:r,height:n}=e!=null?e:{};if(!Number.isFinite(r)||!Number.isFinite(n)||r<=0||n<=0)return t;let o=n-Math.max(0,t.top)-Math.max(0,t.bottom),a=Math.max(0,r-o*2),i=a>0?a+rn*2:0,s=t.left+t.right,l=Math.ceil(Math.max(0,i-s)/2);return S($({},t),{left:t.left+l,right:t.right+l})},ur=(t,e,r,n=!1,o=!1,a,i,s=!1,l=!1)=>{var L,P,g,d,S$1,N,w,O,T,q,U,E,W,$$1,_;let u=t,c=!!((P=(L=u.gaugeScale)==null?void 0:L.ticks)!=null&&P.length||(d=(g=u.gaugeScale)==null?void 0:g.segments)!=null&&d.length),m=i!=null?i:or(xt(a,c)),h=i!=null?i:or(xt(a,!1)),p=(S$1=u.margin)!=null?S$1:m?en(m,u,h):Hr,f=s&&(m==="small"||m==="medium")?30:0,M=s&&m==="small"?10:s&&m==="medium"?15:0,y=l?m==="large"?32:m==="small"||m==="medium"?24:0:0,C=u.status===!0,k=(N=u.data)==null?void 0:N.some(({sentiment:z})=>z),A=((w=u.data)==null?void 0:w.length)&&u.data.every(({color:z,sentiment:F})=>z||F&&le[F]);return S($($(S($({startAngle:-90,endAngle:90,innerRadius:.85,borderWidth:0},o&&{cornerRadius:C?1:(O=u.cornerRadius)!=null?O:4}),{enableArcLabels:!1,enableArcLinkLabels:!1,legends:[]}),t),o&&{margin:(T=u.margin)!=null?T:nn(S($({},p),{top:p.top+M,bottom:p.bottom+f+y}),a),innerRadius:(q=u.innerRadius)!=null?q:C||m==="small"?.8:.85,gaugeScale:$($($($({},Zr),m==="small"?Qr:{}),(E=(U=u.gaugeScale)==null?void 0:U.segments)!=null&&E.length?Jr:{}),u.gaugeScale)}),{isInteractive:e,isFocusable:r,centerSlotName:(W=u.centerSlotName)!=null?W:u.centerContent?void 0:"center",centerContentAlignment:n?"center-baseline":"center",centerContentLayout:n?"gauge":"default",centerContentSize:m,colors:($$1=u.colors)!=null?$$1:A?({data:z})=>Xr(z,C):void 0,padAngle:(_=u.padAngle)!=null?_:C&&k?1:0})};var To=$({},ce);/*!
 * Arc transition behavior adapted from Harbor Charts/Nivo's
 * packages/arcs/src/arcTransitionMode.ts and useArcsTransition.ts.
 *
 * Copyright (c) Raphaël Benitte
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const DONUT_SIZE_PIXELS = {
    large: 375,
    medium: 240,
    small: 168,
};
const DONUT_HORIZONTAL_LEGEND_GAP = 16;
const getAvailableDonutWidth = (width, element) => {
    var _a, _b;
    const requestedWidth = Number.parseFloat(width);
    if (/^\d+(?:\.\d+)?px$/.test(width) && Number.isFinite(requestedWidth)) {
        return requestedWidth;
    }
    const parentWidth = (_b = (_a = element === null || element === void 0 ? void 0 : element.parentElement) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width) !== null && _b !== void 0 ? _b : 0;
    if (parentWidth) {
        return parentWidth;
    }
    return (element === null || element === void 0 ? void 0 : element.getBoundingClientRect().width) || undefined;
};
const getDonutArcLinkLabelGutter = (data = [], labelWidth, size, activeOuterRadiusOffset = 10) => {
    // Estimate each label at 7px per label/value character plus 32px for the
    // value tag and its gap.
    const calculatedLabelWidth = Math.min(160, Math.max(72, ...data.map(({ id, value }) => String(id).length * 7 + String(value).length * 7 + 32)));
    const fallbackGutter = 54 + (labelWidth !== null && labelWidth !== void 0 ? labelWidth : calculatedLabelWidth);
    if (!size || !data.length) {
        return { left: fallbackGutter, right: fallbackGutter };
    }
    const radius = DONUT_SIZE_PIXELS[size] / 2;
    const total = data.reduce((sum, datum) => {
        const value = Number(datum.value);
        return Number.isFinite(value) && value > 0 ? sum + value : sum;
    }, 0);
    if (!total) {
        return { left: fallbackGutter, right: fallbackGutter };
    }
    const arcLinkLabelsOffset = size === "small" ? 0 : 2;
    const arcLinkLabelsStraightLength = size === "small" ? 24 : 36;
    const arcLinkLabelsTextOffset = 6;
    const radialDistance = radius + arcLinkLabelsOffset + activeOuterRadiusOffset;
    let startAngle = 0;
    let left = 0;
    let right = 0;
    data.forEach((datum) => {
        const value = Number(datum.value);
        if (!Number.isFinite(value) || value <= 0) {
            return;
        }
        const angle = startAngle + (value / total) * Math.PI;
        const sin = Math.sin(angle - Math.PI / 2);
        const cos = Math.cos(angle - Math.PI / 2);
        const width = labelWidth !== null && labelWidth !== void 0 ? labelWidth : Math.min(160, Math.max(72, String(datum.id).length * 7 + String(datum.value).length * 7 + 32));
        const requiredGutter = Math.ceil(width +
            arcLinkLabelsStraightLength +
            (sin > 0 ? sin * 12 : 0) +
            arcLinkLabelsTextOffset +
            radialDistance * (cos >= 0 ? cos : -cos) -
            radius);
        if (cos >= 0) {
            right = Math.max(right, requiredGutter);
        }
        else {
            left = Math.max(left, requiredGutter);
        }
        startAngle += (value / total) * 2 * Math.PI;
    });
    return { left: Math.max(0, left), right: Math.max(0, right) };
};
const getDonutLegendHorizontalPadding = (legend) => {
    var _a, _b;
    const padding = legend.padding;
    if (typeof padding === "number") {
        return padding * 2;
    }
    if (padding && typeof padding === "object" && !Array.isArray(padding)) {
        return (Number((_a = padding.left) !== null && _a !== void 0 ? _a : 0) +
            Number((_b = padding.right) !== null && _b !== void 0 ? _b : 0));
    }
    return 0;
};
const isHorizontalDonutLegend = (config) => {
    var _a;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    return Boolean(legend &&
        typeof legend === "object" &&
        !Array.isArray(legend) &&
        legend.horizontal === true);
};
const getDonutHorizontalLegendWidth = (config) => {
    var _a, _b;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    if (!legend || typeof legend !== "object" || Array.isArray(legend)) {
        return 0;
    }
    const legendConfig = legend;
    const itemWidth = Number((_b = legendConfig.itemWidth) !== null && _b !== void 0 ? _b : 100);
    return ((Number.isFinite(itemWidth) ? itemWidth : 100) +
        getDonutLegendHorizontalPadding(legendConfig));
};
const getDonutHorizontalLegendMargin = (config) => getDonutHorizontalLegendWidth(config) + DONUT_HORIZONTAL_LEGEND_GAP;
const HTML_LEGEND_ITEM_GAP = 4;
const HTML_LEGEND_COLUMN_GAP = 24;
const HTML_LEGEND_ITEM_HEIGHT = 20;
const HTML_LEGEND_SYMBOL_SIZE = 16;
const getDonutLegendLabels = (config) => {
    var _a, _b;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    if (legend &&
        typeof legend === "object" &&
        !Array.isArray(legend) &&
        Array.isArray(legend.data)) {
        return legend.data.map((datum) => {
            var _a;
            return String(datum && typeof datum === "object"
                ? (_a = datum.label) !== null && _a !== void 0 ? _a : datum.id
                : datum);
        });
    }
    return ((_b = config.data) !== null && _b !== void 0 ? _b : []).map((datum, index) => {
        var _a, _b;
        const record = datum;
        return String((_b = (_a = record.label) !== null && _a !== void 0 ? _a : record.id) !== null && _b !== void 0 ? _b : index);
    });
};
const getDonutLegendLayout = (config, availableWidth, categorical = false) => {
    var _a, _b, _c;
    if (!categorical) {
        return { rows: 1, rowHeight: 0 };
    }
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    if (!legend ||
        !availableWidth ||
        typeof legend !== "object" ||
        Array.isArray(legend)) {
        return { rows: 1, rowHeight: 0 };
    }
    const legendConfig = legend;
    const isHorizontalLegend = legendConfig.horizontal === true;
    const anchor = (_b = legendConfig.anchor) !== null && _b !== void 0 ? _b : (isHorizontalLegend ? "right" : "bottom");
    const direction = (_c = legendConfig.direction) !== null && _c !== void 0 ? _c : (isHorizontalLegend ? "column" : "row");
    if (anchor !== "bottom" ||
        (config.legendLayout !== "html" && direction !== "row")) {
        return { rows: 1, rowHeight: 0 };
    }
    if (config.legendLayout === "html") {
        const itemWidths = getDonutLegendLabels(config).map((label) => Math.max(HTML_LEGEND_SYMBOL_SIZE, label.length * 7) +
            HTML_LEGEND_ITEM_GAP +
            HTML_LEGEND_SYMBOL_SIZE);
        let rows = 1;
        let rowWidth = 0;
        for (const itemWidth of itemWidths) {
            const nextWidth = rowWidth
                ? rowWidth + HTML_LEGEND_COLUMN_GAP + itemWidth
                : itemWidth;
            if (rowWidth && nextWidth > availableWidth) {
                rows += 1;
                rowWidth = itemWidth;
            }
            else {
                rowWidth = nextWidth;
            }
        }
        return {
            rows,
            rowHeight: HTML_LEGEND_ITEM_HEIGHT + HTML_LEGEND_ITEM_GAP,
        };
    }
    return { rows: 1, rowHeight: 0 };
};
const DEFAULT_DONUT_MARGIN = {
    top: 40,
    right: 60,
    bottom: 90,
    left: 60,
};
const DEFAULT_DONUT_LEGEND_MARGIN = Object.assign(Object.assign({}, DEFAULT_DONUT_MARGIN), { right: 0, left: 0 });
const HTML_LEGEND_PADDING = 16;
const HTML_LEGEND_ROW_GAP = 4;
const DONUT_LEGEND_EXTRA_INTERACTION_MARGIN = 16;
const getDonutChartSettings = (config, width, element, gauge, size, categorical = false) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const availableWidth = getAvailableDonutWidth(width, element);
    const fixedSize = categorical && size && !gauge ? size : undefined;
    const hasArcLinkLabels = config.enableArcLinkLabels !== false;
    const labelWidth = (_a = config.arcLinkLabelsHtml) === null || _a === void 0 ? void 0 : _a.width;
    const horizontalGutter = getDonutArcLinkLabelGutter(config.data, typeof labelWidth === "number" ? labelWidth : undefined, fixedSize, (_b = config.activeOuterRadiusOffset) !== null && _b !== void 0 ? _b : 10);
    const legendLayout = getDonutLegendLayout(config, availableWidth, categorical);
    const hasExtraLegendInteractionMargin = fixedSize &&
        (isHorizontalDonutLegend(config) || config.legendLayout === "html");
    const interactionMargin = gauge
        ? 0
        : fixedSize
            ? ((_c = config.activeOuterRadiusOffset) !== null && _c !== void 0 ? _c : 10) +
                (hasExtraLegendInteractionMargin
                    ? DONUT_LEGEND_EXTRA_INTERACTION_MARGIN
                    : 0)
            : 0;
    const horizontalMargin = ((_e = (_d = config.margin) === null || _d === void 0 ? void 0 : _d.left) !== null && _e !== void 0 ? _e : 0) + ((_g = (_f = config.margin) === null || _f === void 0 ? void 0 : _f.right) !== null && _g !== void 0 ? _g : 0);
    const fixedChartWidth = fixedSize && (isHorizontalDonutLegend(config) || !hasArcLinkLabels)
        ? DONUT_SIZE_PIXELS[fixedSize] +
            horizontalMargin +
            interactionMargin * 2 +
            (isHorizontalDonutLegend(config)
                ? getDonutHorizontalLegendMargin(config)
                : 0)
        : undefined;
    const renderedConfig = fixedSize && hasArcLinkLabels && !((_h = config.legends) === null || _h === void 0 ? void 0 : _h.length) && !config.margin
        ? Object.assign(Object.assign({}, config), { margin: {
                top: 14,
                right: horizontalGutter.right,
                bottom: 14,
                left: horizontalGutter.left,
            } }) : config;
    return {
        fixedSize,
        fixedChartWidth,
        horizontalGutter,
        interactionMargin,
        legendRows: legendLayout.rows,
        legendRowHeight: legendLayout.rowHeight,
        config: renderedConfig,
    };
};
const getDonutCategoricalRenderConfig = (config, fixedSize, categorical, legendRows, legendRowHeight, interactionMargin) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    const hasLegend = Boolean((_b = config.legends) === null || _b === void 0 ? void 0 : _b.length);
    const isHorizontalLegend = isHorizontalDonutLegend(config);
    const horizontalLegendMargin = isHorizontalLegend
        ? getDonutHorizontalLegendMargin(config)
        : 0;
    const legendAnchor = legend && typeof legend === "object" && !Array.isArray(legend)
        ? (_c = legend.anchor) !== null && _c !== void 0 ? _c : (isHorizontalLegend ? "right" : "bottom")
        : "bottom";
    const legendDirection = legend && typeof legend === "object" && !Array.isArray(legend)
        ? (_d = legend.direction) !== null && _d !== void 0 ? _d : (isHorizontalLegend ? "column" : "row")
        : "row";
    const hasBottomRowLegend = legend &&
        typeof legend === "object" &&
        !Array.isArray(legend) &&
        legendAnchor === "bottom" &&
        legendDirection === "row";
    const hasHtmlLegend = config.legendLayout === "html" && Boolean(hasBottomRowLegend);
    const hasDefaultFixedMargin = Boolean(fixedSize) &&
        !config.margin &&
        !isHorizontalLegend &&
        !hasHtmlLegend &&
        !hasBottomRowLegend;
    const baseMargin = (_f = (config.margin
        ? Object.assign(Object.assign({}, config.margin), (isHorizontalLegend && {
            right: ((_e = config.margin.right) !== null && _e !== void 0 ? _e : 0) + horizontalLegendMargin,
        })) : undefined)) !== null && _f !== void 0 ? _f : (isHorizontalLegend
        ? {
            top: interactionMargin,
            right: horizontalLegendMargin,
            bottom: interactionMargin,
            left: 0,
        }
        : hasHtmlLegend
            ? { top: 0, right: 0, bottom: 0, left: 0 }
            : hasBottomRowLegend
                ? Object.assign(Object.assign({}, DEFAULT_DONUT_LEGEND_MARGIN), { left: interactionMargin, right: interactionMargin }) : hasDefaultFixedMargin
                ? {
                    left: 0,
                    right: 0,
                    top: interactionMargin,
                    bottom: 0,
                }
                : undefined);
    if (!categorical || !fixedSize || !baseMargin) {
        return config;
    }
    return Object.assign(Object.assign({}, config), { margin: Object.assign(Object.assign({}, baseMargin), { top: ((_g = baseMargin.top) !== null && _g !== void 0 ? _g : 0) +
                (config.margin || hasHtmlLegend ? interactionMargin : 0), right: ((_h = baseMargin.right) !== null && _h !== void 0 ? _h : 0) + interactionMargin, bottom: ((_j = baseMargin.bottom) !== null && _j !== void 0 ? _j : 0) +
                (hasHtmlLegend
                    ? interactionMargin
                    : hasLegend
                        ? Math.max(0, legendRows - 1) * legendRowHeight
                        : interactionMargin), left: ((_k = baseMargin.left) !== null && _k !== void 0 ? _k : 0) + interactionMargin }) });
};
const getDonutChartDimensions = (config, width, settings) => {
    var _a, _b, _c, _d, _e;
    const { fixedSize, interactionMargin, legendRows, legendRowHeight } = settings;
    const hasLegend = Boolean((_a = config.legends) === null || _a === void 0 ? void 0 : _a.length);
    const hasArcLinkLabels = config.enableArcLinkLabels !== false;
    const hasHtmlLegend = config.legendLayout === "html" && hasLegend;
    const configuredMargin = config.margin;
    const isHorizontalLegendLayout = isHorizontalDonutLegend(config);
    const htmlLegendItemHeight = HTML_LEGEND_ITEM_HEIGHT;
    const htmlLegendHeight = HTML_LEGEND_PADDING +
        htmlLegendItemHeight +
        Math.max(0, legendRows - 1) *
            (HTML_LEGEND_ITEM_HEIGHT + HTML_LEGEND_ROW_GAP);
    const fixedDonutAreaHeight = ((_b = configuredMargin === null || configuredMargin === void 0 ? void 0 : configuredMargin.top) !== null && _b !== void 0 ? _b : 0) +
        ((_c = configuredMargin === null || configuredMargin === void 0 ? void 0 : configuredMargin.bottom) !== null && _c !== void 0 ? _c : 0) +
        interactionMargin * 2;
    const legendVerticalMargin = isHorizontalLegendLayout
        ? fixedDonutAreaHeight
        : ((_d = configuredMargin === null || configuredMargin === void 0 ? void 0 : configuredMargin.top) !== null && _d !== void 0 ? _d : DEFAULT_DONUT_MARGIN.top) +
            ((_e = configuredMargin === null || configuredMargin === void 0 ? void 0 : configuredMargin.bottom) !== null && _e !== void 0 ? _e : DEFAULT_DONUT_MARGIN.bottom) +
            (hasHtmlLegend
                ? interactionMargin * 2
                : hasLegend || configuredMargin
                    ? interactionMargin
                    : 0) +
            (hasHtmlLegend
                ? htmlLegendHeight
                : Math.max(0, legendRows - 1) * legendRowHeight);
    // Keep the board at the available width so fixed-size categorical donuts
    // without legends can center their chart within the container.
    const chartWidth = width;
    const chartHeight = fixedSize
        ? `${DONUT_SIZE_PIXELS[fixedSize] +
            (hasHtmlLegend
                ? fixedDonutAreaHeight + htmlLegendHeight
                : hasLegend
                    ? legendVerticalMargin
                    : hasArcLinkLabels
                        ? 28 + interactionMargin * 2
                        : fixedDonutAreaHeight)}px`
        : undefined;
    return { chartWidth, chartHeight };
};
const getCategoricalDonutSizeConfig = (config, size) => {
    var _a, _b, _c;
    return (Object.assign(Object.assign(Object.assign({}, config), { fit: false, innerRadius: (_a = config.innerRadius) !== null && _a !== void 0 ? _a : (size === "small" ? 0.75 : 0.65) }), (size === "small" && {
        arcLinkLabelsOffset: (_b = config.arcLinkLabelsOffset) !== null && _b !== void 0 ? _b : 0,
        arcLinkLabelsStraightLength: (_c = config.arcLinkLabelsStraightLength) !== null && _c !== void 0 ? _c : 24,
    })));
};

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}:root{--viz-color-empty-shade-color:var(--control-border-weak-default, #e1e4e8);--viz-color-empty-shade-bg:var(--base-bg-weak-default, #ffffff)}@media (prefers-color-scheme: light){:root{--viz-text-color:var(--base-text-default, #23282e);--viz-inverse-text-color:var(--base-text-in-default, #ffffff);--viz-donut-color-select-ring:var(--base-text-default, #23282e)}:root .hbr-mode-dark,:root .dark{--viz-text-color:var(--base-text-default, #ffffff);--viz-inverse-text-color:var(--base-text-in-default, #23282e);--viz-donut-color-select-ring:var(--base-text-default, #ffffff)}}@media (prefers-color-scheme: dark){:root{--viz-text-color:var(--base-text-default, #ffffff);--viz-inverse-text-color:var(--base-text-in-default, #23282e);--viz-donut-color-select-ring:var(--base-text-default, #ffffff)}:root .hbr-mode-light,:root .light{--viz-text-color:var(--base-text-default, #23282e);--viz-inverse-text-color:var(--base-text-in-default, #ffffff);--viz-donut-color-select-ring:var(--base-text-default, #23282e)}}.--donut-chart{--viz-donut-text-in:var(--viz-inverse-text-color)}.--donut-chart .legend-event-rect{border-radius:1px}.--donut-chart .legend-event-rect:focus-visible{border:4px solid var(--viz-color-neutral-100);outline:2px solid -webkit-focus-ring-color;outline-offset:2px}.--donut-chart .legend-event-rect:focus:not(:focus-visible){border:0;outline:0;outline-offset:0}.--donut-chart .arc-path.disabled{cursor:not-allowed;pointer-events:none}.--donut-chart .arc-path:focus{outline:none}.--donut-chart .arc-link-label{font-weight:var(--hbr-font-weight-semibold)}.--donut-chart.--categorical .arc-link-label.arc-link-label--hover{font-weight:var(--hbr-font-weight-bold)}.--donut-chart.--categorical>svg{overflow:visible}.--donut-chart .--categorical-donut-link-label{display:flex;align-items:center;gap:var(--viz-spacing-2xs);font-size:var(--hbr-font-size-sm);line-height:18px;width:100%;box-sizing:border-box;white-space:nowrap}.--donut-chart .arc-link-label[data-side=end] .--categorical-donut-link-label{justify-content:flex-end}.--donut-chart .--categorical-donut-link-label-text{display:block;flex:0 1 auto;overflow:hidden;min-width:0;text-overflow:ellipsis}.--donut-chart .--categorical-donut-link-label-value{flex:none}.--donut-chart .gauge-center-content,.--donut-chart .gauge-center-content__container,.--donut-chart .gauge-center-content__layout{overflow:visible}:host([data-gauge=true]:not([data-gauge-center-label=true])) .--donut-chart .gauge-center-content .gauge-center-content__layout{margin-top:4px}:host([data-status=true]) .--donut-chart .gauge-center-content .gauge-center-content__layout{margin-top:3px}:host([data-status=true]) .--donut-chart .gauge-center-content[data-size=sm] .gauge-center-content__layout{margin-top:1px}.--donut-chart>div>svg:focus{outline:none}:host([gauge]),:host([data-gauge=true]){min-width:100px}:host([gauge]) .--hbr-donut.--donut-chart,:host([data-gauge=true]) .--hbr-donut.--donut-chart{position:relative;border-radius:var(--hbr-border-radius-lg)}:host([gauge]) .--hbr-donut.--donut-chart:after,:host([data-gauge=true]) .--hbr-donut.--donut-chart:after{position:absolute;inset:0;border-radius:inherit;outline-offset:5px;content:\"\";box-shadow:var(--hbr-focus-ring);opacity:0;pointer-events:none}:host([gauge]) .--hbr-donut.--donut-chart.gauge-chart--focused:after,:host([data-gauge=true]) .--hbr-donut.--donut-chart.gauge-chart--focused:after{opacity:1}:host([gauge]) .--hbr-donut.--donut-chart svg,:host([gauge]) .--hbr-donut.--donut-chart svg:focus,:host([gauge]) .--hbr-donut.--donut-chart svg:focus-visible,:host([data-gauge=true]) .--hbr-donut.--donut-chart svg,:host([data-gauge=true]) .--hbr-donut.--donut-chart svg:focus,:host([data-gauge=true]) .--hbr-donut.--donut-chart svg:focus-visible{outline:none}.gauge-center-content[data-size] slot[name=center-value]::slotted(span){color:var(--base-text-default);font:var(--hbr-font-weight-bold) 40px/52px var(--hbr-font-heading);text-align:right}.gauge-center-content[data-size] slot[name=center-suffix]::slotted(span){color:var(--base-text-medium-default);font-family:var(--hbr-font-heading);font-weight:var(--hbr-font-weight-bold)}.gauge-center-content[data-size=lg] slot[name=center-suffix]::slotted(span){font-size:var(--hbr-font-size-xl);line-height:var(--hbr-font-line-height-dense)}.gauge-center-content[data-size=md] slot[name=center-suffix]::slotted(span){font-size:var(--hbr-font-size-lg);line-height:var(--hbr-font-line-height-denser)}.gauge-center-content[data-size=sm] slot[name=center-suffix]::slotted(span){font-size:var(--hbr-font-size-xs);line-height:var(--hbr-font-line-height-denser)}.gauge-center-content__container{position:relative;width:100%;height:100%;overflow:visible}.gauge-center-content__layout{position:relative;display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:flex-end;overflow:visible}.donut-center-content__layout{display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center}.donut-center-content__label-slot::slotted(*){color:var(--base-text-default);font-family:var(--hbr-font-heading, \"Sharp Sans\");font-size:60px;line-height:72px;font-weight:var(--hbr-font-weight-bold)}.donut-center-content[data-size=md] .donut-center-content__label-slot::slotted(*){font-size:40px;line-height:52px}.donut-center-content__sublabel-slot::slotted(*){color:var(--base-text-medium-default);font-family:var(--hbr-font-body);font-size:18px;font-weight:var(--hbr-font-weight-regular);line-height:24px}.donut-center-content[data-size=sm] .donut-center-content__label-slot::slotted(*){font-size:32px;line-height:43px}.donut-center-content[data-size=sm] .donut-center-content__sublabel-slot::slotted(*){font-size:var(--hbr-font-size-xs)}.gauge-center-content__value-row{display:flex;align-items:baseline;justify-content:center;gap:3px;transform:translateY(calc(var(--hbr-spacing-2xs) + var(--hbr-spacing-3xs)))}.gauge-center-content[data-size=sm] slot[name=center-value]::slotted(span){font-size:var(--hbr-font-size-xl);line-height:var(--hbr-font-line-height-dense)}:host([data-status=true]) .gauge-center-content:is([data-size=lg],[data-size=md]) slot[name=center-value]::slotted(span){font:var(--hbr-font-weight-bold) var(--hbr-font-size-xl)/var(--hbr-font-line-height-dense) var(--hbr-font-heading)}:host([data-status=true]) .gauge-center-content__value-row{transform:translateY(var(--hbr-spacing-2xs))}:host([data-status=true]) .gauge-center-content[data-size=sm] slot[name=center-value]::slotted(span){font:var(--hbr-font-weight-bold) var(--hbr-font-size-sm)/var(--hbr-font-line-height-dense) var(--hbr-font-body)}.gauge-center-content[data-size] slot[name=center-label]::slotted(span){color:var(--base-text-default);font:var(--hbr-font-weight-normal) var(--hbr-font-size-sm)/var(--hbr-font-line-height-dense) var(--hbr-font-body)}.gauge-center-content[data-size=md] .gauge-center-content__label--compact::slotted(span),.gauge-center-content[data-size=sm] .gauge-center-content__label--compact::slotted(span){position:absolute;top:calc(100% + var(--hbr-spacing-2xs));left:50%;transform:translate(-50%);font:var(--hbr-font-weight-normal) var(--hbr-font-size-xs)/18px var(--hbr-font-body);text-align:center;white-space:nowrap}.gauge-center-content slot[name=status-tag]::slotted(*){position:absolute;left:50%;display:flex;height:20px;min-height:20px;align-items:center;justify-content:center;transform:translate(-50%);white-space:nowrap}.gauge-center-content[data-size=lg] slot[name=status-tag]::slotted(*){top:calc(100% + var(--hbr-spacing-sm))}.gauge-center-content[data-size=md] slot[name=status-tag]::slotted(*),.gauge-center-content[data-size=sm] slot[name=status-tag]::slotted(*){top:calc(100% + var(--hbr-spacing-xs))}.chart-html-legend{display:flex;flex-wrap:wrap;align-items:flex-start;align-content:flex-start;column-gap:var(--hbr-spacing-lg, 24px);row-gap:var(--hbr-spacing-2xs, 4px);width:100%;box-sizing:border-box;margin-top:var(--hbr-spacing-md, 16px);padding:4px 6px;background-color:transparent;font-family:var(--hbr-font-body, sans-serif);font-size:var(--hbr-font-size-xs, 12px);line-height:18px}.chart-html-legend-item{display:inline-flex;align-items:center;flex:0 0 auto;gap:var(--chart-html-legend-item-gap, 8px);padding:0;border:0;background:transparent;color:var(--chart-html-legend-item-color, var(--base-text-default));font:inherit;font-size:var(--hbr-font-size-xs, 12px);opacity:var(--chart-html-legend-item-opacity, 1);cursor:var(--chart-html-legend-item-cursor, default)}.chart-html-legend-selectable-item{display:inline-flex;align-items:center;gap:var(--chart-html-legend-item-gap, 8px)}.chart-html-legend-symbol{display:block;flex:0 0 var(--chart-html-legend-symbol-size, 16px);width:var(--chart-html-legend-symbol-size, 16px);height:var(--chart-html-legend-symbol-size, 16px);border-radius:2px;background-color:var(--chart-html-legend-symbol-color, transparent)}.chart-html-legend-pattern{position:relative;overflow:hidden}.chart-html-legend-pattern>svg{position:absolute;inset:0;display:block;pointer-events:none}:host([categorical][data-gauge=true]){min-height:60px;min-width:100px}:host([categorical][data-status=true]) .--donut-chart,:host([categorical][data-status=true]) .--donut-chart>svg{overflow:visible}:host([categorical]:not([data-gauge=true])){min-width:168px;min-height:168px}:host([categorical]:not([data-gauge=true])) .chart-donut__categorical-legend{flex:0 0 auto}:host([categorical]:not([data-gauge=true])) .chart-html-legend-symbol{margin:6px}:host([categorical]:not([data-gauge=true])) .--categorical-donut-link-label{font-weight:var(--hbr-font-weight-semibold);font-size:var(--hbr-font-size-xs);line-height:18px}:host([categorical]:not([data-gauge=true])) .--categorical-donut-link-label .--categorical-donut-link-label-value::part(base){font-weight:var(--hbr-font-weight-semibold)}:host{display:flex;flex-direction:column;--max-width:280px;--bg-color:var(--base-bg-weak-default);--font-size:var(--hbr-font-size-xs);--font-weight:var(--hbr-font-weight-normal);--line-height:var(--hbr-font-line-height-normal);--text-color:var(--base-text-medium-default);--padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);--shadow:var(--hbr-shadow-lg)}:host .--hbr-donut-popover-container{display:block;box-sizing:border-box;width:max-content;max-width:var(--max-width);border-radius:var(--hbr-border-radius-md);background-color:var(--bg-color);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);color:var(--text-color);padding:var(--padding);box-shadow:var(--shadow);border:2px solid var(--base-border-strong-default)}:host .--hbr-donut-popover-row{display:flex;justify-content:space-between;gap:60px}:host .--hbr-donut-popover-row>div:first-child{display:flex;align-items:center}:host .--hbr-donut-popover-row>div:first-child svg{width:20px;height:16px;margin-right:4px}:host .chart-donut__header{display:flex;align-items:center;justify-content:space-between}:host .chart-donut__header>:nth-child(2){display:flex}:host .chart-donut__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}:host .--donut-chart{flex-grow:1;overflow:hidden}:host .--donut-chart.--categorical .arc-link-label.arc-link-label--hover hbr-tag{--font-weight:var(--hbr-font-weight-bold)}:host .--donut-chart.--categorical{flex:1 1 0;width:100%;height:0;min-width:0;overflow:visible}:host .chart-donut__popover{display:flex;justify-content:space-between;gap:var(--hbr-spacing-lg);color:var(--base-text-default)}:host .chart-donut__popover>div:first-child{display:flex;align-items:center;gap:6px}:host .chart-donut__popover>div:first-child>div:first-child{width:16px;height:16px}:host .chart-donut__popover>div:last-child{font-weight:var(--hbr-font-weight-bold)}:host([categorical]:not([data-gauge=true])) .chart-donut__popover>div:first-child>div:first-child{border-radius:2px}";
const HbrDonutChartStyle0 = styleCss;

const { getDonutBaseConfig, getDonutCategoricalConfig, getDonutCategoricalAutoSizePlan, getGaugeConfig, resetAllCategoricalArcSelection, itemTogglePathUnselect, } = To;
const PIE_DEFAULT_CONFIG = {
    innerRadius: 0,
    borderWidth: 2,
    borderColor: "var(--base-bg-weak-default)",
};
const HbrDonutChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrDonutChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrGaugeSizeChange = createEvent(this, "hbr-gauge-size-change", 7);
        this.hbrGaugeLayoutChange = createEvent(this, "hbr-gauge-layout-change", 7);
        this.observer = null;
        this.htmlLegendResizeObserver = null;
        this.gaugeResizeObserver = null;
        this.htmlLegendRef = null;
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.activePopoverSelfManaged = null;
        this.warnedAboutNivoTooltip = false;
        this.lastGaugeSize = null;
        this.chartFocusInHandler = (event) => {
            var _a;
            const target = event.target;
            if (target instanceof SVGElement || target instanceof HTMLElement) {
                target.style.setProperty("outline", "none", "important");
            }
            (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.classList.toggle("gauge-chart--focused", this.isGaugeMode() &&
                (target instanceof SVGElement || target instanceof HTMLElement) &&
                target.matches(":focus-visible"));
        };
        this.chartFocusOutHandler = () => {
            var _a;
            (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.classList.remove("gauge-chart--focused");
        };
        this.getStatusArcCornerRadius = (datum, index, data) => {
            const visibleArcCount = data.filter(({ hidden }) => hidden === false).length;
            const visibleArcIndex = data
                .slice(0, index)
                .filter(({ hidden }) => hidden === false).length;
            const isSmallStatusGauge = this.size
                ? this.size === "small"
                : datum.arc.outerRadius <= 32;
            return isSmallStatusGauge ||
                (visibleArcIndex !== 0 && visibleArcIndex !== visibleArcCount - 1)
                ? 1
                : { outer: 3, inner: 1 };
        };
        this.clearHtmlLegend = () => {
            var _a, _b;
            (_a = this.htmlLegendRef) === null || _a === void 0 ? void 0 : _a.remove();
            this.htmlLegendRef = null;
            (_b = this.htmlLegendResizeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
            this.htmlLegendResizeObserver = null;
        };
        // Keep the bottom legend in the chart-board legend slot as real HTML so it can
        // use native button behavior and normal HTML layout instead of SVG coordinates.
        this.syncHtmlLegend = async () => {
            var _a;
            const config = this.getChartConfig();
            if (!this.categorical || config.legendLayout !== "html") {
                this.clearHtmlLegend();
                return;
            }
            if (!((_a = this.boardRef) === null || _a === void 0 ? void 0 : _a.isConnected))
                return;
            const { renderDonutHtmlLegend } = await import('./html-legend.js');
            renderDonutHtmlLegend(this.boardRef, config);
            this.htmlLegendRef = this.boardRef.querySelector(".chart-donut__categorical-legend");
            this.syncHtmlLegendHeight();
            this.observeHtmlLegendResize();
        };
        this.syncHtmlLegendHeight = () => {
            var _a, _b, _c, _d, _e;
            const container = (_b = (_a = this.boardRef) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector(".chart-board__container");
            const legend = container === null || container === void 0 ? void 0 : container.querySelector('slot[name="legend"]');
            const footer = container === null || container === void 0 ? void 0 : container.querySelector(".chart-board__footer");
            if (!container || !legend || !footer)
                return;
            const headerHeight = (_c = container
                .querySelector('slot[name="header"]')) === null || _c === void 0 ? void 0 : _c.assignedElements().reduce((height, element) => height + element.getBoundingClientRect().height, 0);
            const chartHeight = (_e = (_d = this.chartRef) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().height) !== null && _e !== void 0 ? _e : 0;
            const legendHeight = legend
                .assignedElements()
                .reduce((height, element) => height + element.getBoundingClientRect().height, 0);
            const footerHeight = Math.max(footer.getBoundingClientRect().height, footer.scrollHeight);
            const requiredHeight = (headerHeight !== null && headerHeight !== void 0 ? headerHeight : 0) + chartHeight + legendHeight + footerHeight;
            const currentHeight = this.boardRef.getBoundingClientRect().height;
            if (requiredHeight > currentHeight + 1) {
                const nextHeight = `${Math.ceil(requiredHeight)}px`;
                this.el.style.height = nextHeight;
                this.boardRef.style.height = nextHeight;
            }
        };
        this.observeHtmlLegendResize = () => {
            var _a;
            (_a = this.htmlLegendResizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            if (!this.htmlLegendRef || typeof ResizeObserver === "undefined")
                return;
            this.htmlLegendResizeObserver = new ResizeObserver(() => this.syncHtmlLegendHeight());
            this.htmlLegendResizeObserver.observe(this.htmlLegendRef);
        };
        this.observeGaugeResize = () => {
            var _a;
            (_a = this.gaugeResizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            if (!this.categorical ||
                !this.isGaugeMode() ||
                typeof ResizeObserver === "undefined") {
                this.gaugeResizeObserver = null;
                return;
            }
            this.gaugeResizeObserver = new ResizeObserver(([entry]) => {
                const { width, height } = entry.contentRect;
                if (width <= 0 || height <= 0)
                    return;
                if (Math.abs(this.gaugeDimensions.width - width) < 0.5 &&
                    Math.abs(this.gaugeDimensions.height - height) < 0.5) {
                    return;
                }
                this.gaugeDimensions = { width, height };
            });
            this.gaugeResizeObserver.observe(this.el);
        };
        this.renderChart = async () => {
            var _a, _b, _c, _d;
            const config = this.getChartConfig();
            const configWithNivoTooltip = this.config;
            if (!this.warnedAboutNivoTooltip &&
                configWithNivoTooltip.tooltip !== undefined) {
                console.warn("hbr-donut-chart: config.tooltip is not supported. Use itemTooltip or legendTooltip instead.");
                this.warnedAboutNivoTooltip = true;
            }
            const isGaugeMode = this.isGaugeMode();
            const isInteractive = this.getChartInteractivity();
            const isFocusable = this.getChartFocusability();
            const { fixedSize, interactionMargin, legendRows, legendRowHeight, config: categoricalConfig, } = this.getChartSettings();
            const categoricalSizeConfig = this.categorical && fixedSize
                ? getCategoricalDonutSizeConfig(categoricalConfig, fixedSize)
                : categoricalConfig;
            const categoricalRenderConfig = this.categorical
                ? getDonutCategoricalRenderConfig(categoricalSizeConfig, fixedSize, true, legendRows, legendRowHeight, interactionMargin)
                : categoricalConfig;
            const hasCategoricalCenterSlots = hasSlot(this.el, "center-label") || hasSlot(this.el, "center-sublabel");
            const runtimeConfig = isGaugeMode
                ? getGaugeConfig(config, isInteractive, isFocusable, hasSlot(this.el, "center-value"), this.categorical, this.gaugeDimensions, this.size, hasSlot(this.el, "center-label"), hasSlot(this.el, "status-tag"))
                : this.categorical && hasCategoricalCenterSlots
                    ? Object.assign(Object.assign({}, categoricalRenderConfig), { centerSlotName: "center", centerContentLayout: "donut" }) : categoricalRenderConfig;
            const autoSizeRuntimeConfig = this.categorical && runtimeConfig.autoSize
                ? Object.assign(Object.assign({}, runtimeConfig), { margin: (_c = (_b = getDonutCategoricalAutoSizePlan(runtimeConfig, Number.parseFloat(String((_a = getAvailableDonutWidth(this.width, this.el)) !== null && _a !== void 0 ? _a : this.width)), Number.parseFloat(String(this.height)))) === null || _b === void 0 ? void 0 : _b.margin) !== null && _c !== void 0 ? _c : runtimeConfig.margin }) : runtimeConfig;
            const tooltipConfig = config;
            const legendPopoverOptions = this.getLegendPopoverOptions();
            const showSectionPopover = (node, event) => {
                this.applyActivePopoverOptions();
                toggleDonutSectionPopover(this.tooltipRef, event, node, tooltipConfig.itemTooltip, tooltipConfig.tooltip);
            };
            const hidePopover = () => {
                if (!this.isPopoverSelfManaged()) {
                    toggleDonutSectionPopover(this.tooltipRef);
                }
            };
            const showLegendPopover = (data, event) => {
                this.applyActivePopoverOptions(legendPopoverOptions);
                toggleDonutLegendPopover(this.tooltipRef, event, data.id, data.color, config);
            };
            const hideLegendPopover = () => {
                if (!this.isPopoverSelfManaged(legendPopoverOptions)) {
                    toggleDonutLegendPopover(this.tooltipRef);
                }
            };
            const hideLegendPopoverOnBlur = () => {
                this.activePopoverSelfManaged = null;
                toggleDonutLegendPopover(this.tooltipRef);
            };
            const htmlLegendMargin = categoricalConfig.legendLayout === "html" &&
                categoricalConfig.enableArcLinkLabels === false
                ? { top: 0, right: 0, bottom: 0, left: 0 }
                : undefined;
            const baseConfig = this.categorical
                ? getDonutCategoricalConfig(autoSizeRuntimeConfig, {
                    itemsEventHandlers: isGaugeMode && !isInteractive
                        ? {}
                        : {
                            onMouseEnter: showSectionPopover,
                            onMouseLeave: hidePopover,
                            onFocus: showSectionPopover,
                            onBlur: () => toggleDonutSectionPopover(this.tooltipRef),
                        },
                    legendsEventHandlers: isGaugeMode && !isInteractive
                        ? {}
                        : {
                            onMouseEnter: showLegendPopover,
                            onMouseLeave: hideLegendPopover,
                            onFocus: showLegendPopover,
                            onBlur: hideLegendPopoverOnBlur,
                            onClick: showLegendPopover,
                        },
                }, {
                    isGauge: isGaugeMode,
                    isGaugeBackground: isGaugeMode && !this.isStatusGauge(),
                    margin: htmlLegendMargin,
                    width: Number.parseFloat(String((_d = getAvailableDonutWidth(this.width, this.el)) !== null && _d !== void 0 ? _d : this.width)),
                    height: Number.parseFloat(String(this.height)),
                    isStatusGauge: this.isStatusGauge(),
                    isSmallStatusGauge: this.isStatusGauge()
                        ? this.size
                            ? this.size === "small"
                            : undefined
                        : undefined,
                    getArcCornerRadius: this.isStatusGauge()
                        ? this.getStatusArcCornerRadius
                        : undefined,
                    createTag: (value) => react.exports.createElement("hbr-tag", {
                        size: "small",
                        className: "--categorical-donut-link-label-value",
                    }, value),
                })
                : getDonutBaseConfig(autoSizeRuntimeConfig, {
                    itemsEventHandlers: isGaugeMode && !isInteractive
                        ? {}
                        : {
                            onMouseEnter: showSectionPopover,
                            onMouseLeave: hidePopover,
                            onFocus: showSectionPopover,
                            onBlur: () => toggleDonutSectionPopover(this.tooltipRef),
                        },
                    legendsEventHandlers: isGaugeMode && !isInteractive
                        ? {}
                        : {
                            onMouseEnter: showLegendPopover,
                            onMouseLeave: hideLegendPopover,
                            onFocus: showLegendPopover,
                            onBlur: hideLegendPopoverOnBlur,
                            onClick: showLegendPopover,
                        },
                });
            const existingEventHandlers = isGaugeMode
                ? {}
                : {
                    onMouseEnter: baseConfig.onMouseEnter,
                    onMouseLeave: baseConfig.onMouseLeave,
                    onClick: baseConfig.onClick,
                    onblur: baseConfig.onBlur,
                    onFocus: baseConfig.onFocus,
                };
            let fullConfig = cjs(baseConfig, autoSizeRuntimeConfig, {
                customMerge: (key) => {
                    if (key === "colors") {
                        return (_destination, source) => source;
                    }
                    if (key === "legends") {
                        return (a, b) => {
                            if (this.categorical) {
                                return a.length > b.length
                                    ? a
                                    : b.map((r, i) => (Object.assign(Object.assign({}, a[i]), r)));
                            }
                            return a.length > b.length
                                ? a.map((r, i) => (Object.assign(Object.assign({}, r), b[i])))
                                : b.map((r, i) => (Object.assign(Object.assign({}, a[i]), r)));
                        };
                    }
                },
            });
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement, To);
            }
            if (isGaugeMode) {
                fullConfig = Object.assign(Object.assign({}, fullConfig), { isInteractive,
                    isFocusable, onMouseEnter: isInteractive ? fullConfig.onMouseEnter : undefined, onMouseLeave: isInteractive ? fullConfig.onMouseLeave : undefined, onMouseMove: isInteractive ? fullConfig.onMouseMove : undefined, onClick: isInteractive ? fullConfig.onClick : undefined, onMouseDown: isInteractive ? fullConfig.onMouseDown : undefined, onFocus: isInteractive && isFocusable ? fullConfig.onFocus : undefined, onBlur: isInteractive && isFocusable ? fullConfig.onBlur : undefined });
            }
            const pieElement = react.exports.createElement(_, fullConfig, null);
            if (!this.contextRoot) {
                this.contextRoot = createRoot(this.chartRef);
            }
            this.contextRoot.render(pieElement);
            if (this.boardRef.setChartConfig) {
                this.boardRef.setChartConfig(fullConfig);
            }
            this.syncChartSvgFocusability();
        };
        this.config = {
            data: [],
        };
        this.width = "100%";
        this.height = "360px";
        this.size = undefined;
        this.loading = false;
        this.categorical = false;
        this.gauge = false;
        this.gaugeDimensions = { width: 0, height: 0 };
        this.modifyHbrConfig = undefined;
        this.popoverOptions = undefined;
        this.variant = undefined;
    }
    /** Public method for download data, use customFunc to create your own way to download data, such as pdf */
    async download(filename = "Export.csv", customFunc) {
        if (customFunc) {
            customFunc(this.config.data);
        }
        else {
            browserDownloadCsv(convertDonutDataToCSV(this.config.data), filename);
        }
    }
    /** Public method to get popover reference, client can use this to control magnetic UX popover externally */
    async getPopoverRef() {
        return this.tooltipRef;
    }
    isGaugeMode() {
        return this.gauge || this.variant === "gauge";
    }
    getChartConfig() {
        const config = omitChartConfigKeys(this.config, [
            "tooltip",
        ]);
        return this.categorical && this.variant === "pie"
            ? Object.assign(Object.assign({}, PIE_DEFAULT_CONFIG), config) : config;
    }
    getLegendPopoverOptions() {
        var _a, _b;
        return (_b = (_a = this.config.legends) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.popoverOptions;
    }
    getPopoverOptions(override) {
        return resolveChartPopoverOptions({
            distance: this.categorical ? 0 : 10,
            variant: "chart",
            placement: "top",
        }, this.popoverOptions, this.categorical, override);
    }
    applyActivePopoverOptions(override) {
        this.activePopoverSelfManaged = this.isPopoverSelfManaged(override);
        applyChartPopoverOptions(this.tooltipRef, this.getPopoverOptions(override));
    }
    isPopoverSelfManaged(override) {
        return isChartPopoverSelfManaged(this.categorical, this.popoverOptions, override);
    }
    getChartSettings() {
        return getDonutChartSettings(this.getChartConfig(), this.width, this.el, this.isGaugeMode(), this.categorical ? this.size : undefined, this.categorical);
    }
    isStatusGauge() {
        return this.isGaugeMode() && this.getChartConfig().status === true;
    }
    getChartInteractivity() {
        var _a, _b;
        const config = this.getChartConfig();
        return this.isGaugeMode()
            ? (_a = config.isInteractive) !== null && _a !== void 0 ? _a : false
            : (_b = config.isInteractive) !== null && _b !== void 0 ? _b : true;
    }
    getChartFocusability() {
        var _a, _b;
        const config = this.getChartConfig();
        return this.isGaugeMode()
            ? (_a = config.isFocusable) !== null && _a !== void 0 ? _a : false
            : (_b = config.isFocusable) !== null && _b !== void 0 ? _b : true;
    }
    syncChartSvgFocusability() {
        var _a;
        const config = this.getChartConfig();
        const svg = (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.querySelector("svg");
        if (!svg) {
            return;
        }
        this.chartRef
            .querySelectorAll(".legend-event-rect ~ text")
            .forEach((text) => text.classList.toggle("donut-legend-text", this.categorical));
        svg.style.setProperty("outline", "none", "important");
        if (config.isChartFocusable !== false) {
            svg.setAttribute("tabindex", "0");
            svg.setAttribute("focusable", "true");
        }
        else {
            svg.removeAttribute("tabindex");
            svg.removeAttribute("focusable");
        }
    }
    syncGaugeLayout() {
        var _a;
        if (!this.categorical || !this.isGaugeMode()) {
            this.lastGaugeSize = null;
            return;
        }
        if (this.gaugeDimensions.width <= 0 || this.gaugeDimensions.height <= 0) {
            return;
        }
        const foreignObject = (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.querySelector(".gauge-center-content");
        const size = foreignObject === null || foreignObject === void 0 ? void 0 : foreignObject.getAttribute("data-size");
        const resolvedSize = size === "sm"
            ? "small"
            : size === "md"
                ? "medium"
                : size === "lg"
                    ? "large"
                    : null;
        if (!resolvedSize || !foreignObject) {
            this.lastGaugeSize = null;
            return;
        }
        const sizeChanged = resolvedSize !== this.lastGaugeSize;
        if (sizeChanged) {
            this.hbrGaugeSizeChange.emit({ size: resolvedSize });
        }
        if (sizeChanged) {
            this.hbrGaugeLayoutChange.emit({ size: resolvedSize });
        }
        this.lastGaugeSize = resolvedSize;
    }
    componentDidLoad() {
        this.observeGaugeResize();
        void this.renderChart().then(() => {
            this.syncHtmlLegend();
            this.syncGaugeLayout();
        });
        reactShadowDomRetargetEvents(this.el.shadowRoot);
        this.chartRef.addEventListener("focusin", this.chartFocusInHandler);
        this.chartRef.addEventListener("focusout", this.chartFocusOutHandler);
        this.observer = new MutationObserver(() => {
            this.syncChartSvgFocusability();
            this.syncGaugeLayout();
        });
        this.observer.observe(this.chartRef, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["data-size"],
        });
    }
    componentShouldUpdate() {
        if (this.getChartInteractivity()) {
            itemTogglePathUnselect(null, this.chartRef);
        }
        return this.renderChart().then(() => {
            this.syncHtmlLegend();
            this.syncGaugeLayout();
        });
    }
    handleOutsideClick(event) {
        var _a;
        if (!this.getChartInteractivity()) {
            return;
        }
        // The chart reference can be cleared while React switches between keyed variants.
        if (!this.chartRef) {
            return;
        }
        if (this.categorical) {
            resetAllCategoricalArcSelection(this.chartRef);
            if (!((_a = this.activePopoverSelfManaged) !== null && _a !== void 0 ? _a : this.isPopoverSelfManaged())) {
                toggleDonutSectionPopover(this.tooltipRef);
                toggleDonutLegendPopover(this.tooltipRef);
            }
        }
        else {
            itemTogglePathUnselect(event, this.chartRef);
        }
    }
    handleHoverOut() {
        var _a;
        if (this.tooltipRef &&
            !((_a = this.activePopoverSelfManaged) !== null && _a !== void 0 ? _a : this.isPopoverSelfManaged())) {
            this.tooltipRef.open = false;
        }
    }
    disconnectedCallback() {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.chartRef) === null || _a === void 0 ? void 0 : _a.removeEventListener("focusin", this.chartFocusInHandler);
        (_b = this.chartRef) === null || _b === void 0 ? void 0 : _b.removeEventListener("focusout", this.chartFocusOutHandler);
        (_c = this.chartRef) === null || _c === void 0 ? void 0 : _c.classList.remove("gauge-chart--focused");
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        (_d = this.htmlLegendResizeObserver) === null || _d === void 0 ? void 0 : _d.disconnect();
        this.htmlLegendResizeObserver = null;
        (_e = this.gaugeResizeObserver) === null || _e === void 0 ? void 0 : _e.disconnect();
        this.gaugeResizeObserver = null;
        (_f = this.contextRoot) === null || _f === void 0 ? void 0 : _f.unmount();
        this.contextRoot = null;
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const config = this.getChartConfig();
        const chartSettings = this.getChartSettings();
        const { chartWidth, chartHeight = this.height } = getDonutChartDimensions(config, this.width, chartSettings);
        const hasLegend = Boolean((_a = config.legends) === null || _a === void 0 ? void 0 : _a.length);
        const hasArcLinkLabels = config.enableArcLinkLabels !== false;
        const horizontalMargin = ((_c = (_b = config.margin) === null || _b === void 0 ? void 0 : _b.left) !== null && _c !== void 0 ? _c : 0) + ((_e = (_d = config.margin) === null || _d === void 0 ? void 0 : _d.right) !== null && _e !== void 0 ? _e : 0);
        const shouldUseFixedDonutStyle = Boolean(chartSettings.fixedSize) && (hasLegend || !hasArcLinkLabels);
        const shouldFixDonutAreaHeight = shouldUseFixedDonutStyle &&
            (!hasLegend || config.legendLayout === "html");
        const fixedDonutWidth = chartSettings.fixedSize
            ? (_f = chartSettings.fixedChartWidth) !== null && _f !== void 0 ? _f : DONUT_SIZE_PIXELS[chartSettings.fixedSize] +
                horizontalMargin +
                chartSettings.interactionMargin * 2
            : undefined;
        const fixedDonutHeight = shouldUseFixedDonutStyle
            ? shouldFixDonutAreaHeight
                ? `${DONUT_SIZE_PIXELS[chartSettings.fixedSize] +
                    ((_h = (_g = config.margin) === null || _g === void 0 ? void 0 : _g.top) !== null && _h !== void 0 ? _h : 0) +
                    ((_k = (_j = config.margin) === null || _j === void 0 ? void 0 : _j.bottom) !== null && _k !== void 0 ? _k : 0) +
                    chartSettings.interactionMargin * 2}px`
                : chartHeight
            : undefined;
        const fixedDonutStyle = shouldUseFixedDonutStyle
            ? Object.assign(Object.assign({ width: `${fixedDonutWidth}px`, minWidth: `${fixedDonutWidth}px`, minHeight: `${DONUT_SIZE_PIXELS[chartSettings.fixedSize] +
                    chartSettings.interactionMargin * 2}px` }, (fixedDonutHeight && {
                height: fixedDonutHeight,
                flex: "0 0 auto",
            })), { alignSelf: "center" }) : undefined;
        this.el.style.width = this.width;
        this.el.style.height = chartHeight;
        let type = "donut";
        if (this.isGaugeMode()) {
            type = "gauge";
        }
        else if (this.variant === "pie" || config.innerRadius === 0) {
            type = "pie";
        }
        const popoverOptions = resolveChartPopoverOptions({
            distance: this.categorical ? 0 : 10,
            variant: "chart",
        }, this.popoverOptions, this.categorical);
        // Chart-managed visibility remains the default due to the chart mesh.
        return (h(Host, { key: '23e8a21bf1598a2ec740a499b3f197054a52b4ce', "data-gauge": this.categorical && this.isGaugeMode() ? "true" : null, "data-gauge-scale": this.categorical &&
                this.isGaugeMode() &&
                config.gaugeScale
                ? "true"
                : null, "data-gauge-center-label": this.categorical &&
                this.isGaugeMode() &&
                hasSlot(this.el, "center-label")
                ? "true"
                : null, "data-status": this.isStatusGauge() ? "true" : null }, !((_l = config.data) === null || _l === void 0 ? void 0 : _l.length) && (this.categorical || this.isGaugeMode()) && (h("div", { slot: "header", part: "header", class: "chart-donut__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("hbr-chart-board", { key: 'f05e523308586a7798095abd80410719f29ba416', type: this.categorical ? "categorical" : type, ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: !((_m = config.data) === null || _m === void 0 ? void 0 : _m.length), style: {
                width: chartWidth,
                height: chartHeight,
            }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: '120de9d4537b217636240493b08b0d8a30bcaacc' }, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: '6f535d87bb82ffb6b3c442108775d5da60694213', slot: "content" })), (((_o = config.data) === null || _o === void 0 ? void 0 : _o.length) ||
            (!this.categorical && !this.isGaugeMode())) && (h("div", { slot: "header", part: "header", class: "chart-donut__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("div", { key: '4b2da2618ebc6a22b18d380bafb8013e3fa662b6', ref: (el) => {
                this.chartRef = el;
            }, class: `--hbr-donut --donut-chart ${this.categorical ? "--categorical" : ""}`, style: fixedDonutStyle, part: "chart" }), h("slot", { key: '3f755c166550e94f74071ed27081a0195eb8e474', name: "footer" }), h("slot", { key: '8b7c72c3e31b983b7dfb4ca97aca6f856090dbd9', slot: "loading-state", name: "loading-state" }), h("slot", { key: '80f41f1c6872b43ed744c377bc5367cae975cf5a', slot: "empty-state", name: "empty-state" }))));
    }
    get el() { return this; }
    static get style() { return HbrDonutChartStyle0; }
}, [1, "hbr-donut-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "size": [513],
        "loading": [4],
        "categorical": [516],
        "gauge": [516],
        "modifyHbrConfig": [16],
        "popoverOptions": [16],
        "variant": [1],
        "gaugeDimensions": [32],
        "download": [64],
        "getPopoverRef": [64]
    }, [[5, "click", "handleOutsideClick"], [1, "mouseout", "handleHoverOut"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-donut-chart", "hbr-chart-board", "hbr-icon", "hbr-icon-button", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil", "hbr-tag"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-donut-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrDonutChart$1);
            }
            break;
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tag":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrDonutChart = HbrDonutChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrDonutChart, defineCustomElement };

