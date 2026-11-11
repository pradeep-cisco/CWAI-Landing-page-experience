var s=Object.create;var c=Object.defineProperty,f=Object.defineProperties,A=Object.getOwnPropertyDescriptor,B=Object.getOwnPropertyDescriptors,F=Object.getOwnPropertyNames,l=Object.getOwnPropertySymbols,E=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable;var u=(t,o,e)=>o in t?c(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e,$=(t,o)=>{for(var e in o||(o={}))C.call(o,e)&&u(t,e,o[e]);if(l)for(var e of l(o))d.call(o,e)&&u(t,e,o[e]);return t},S=(t,o)=>f(t,B(o));var b=(t,o)=>{var e={};for(var a in t)C.call(t,a)&&o.indexOf(a)<0&&(e[a]=t[a]);if(t!=null&&l)for(var a of l(t))o.indexOf(a)<0&&d.call(t,a)&&(e[a]=t[a]);return e};var p=(t,o)=>()=>(o||t((o={exports:{}}).exports,o),o.exports),m=(t,o)=>{for(var e in o)c(t,e,{get:o[e],enumerable:!0});},v=(t,o,e,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of F(o))!C.call(t,r)&&r!==e&&c(t,r,{get:()=>o[r],enumerable:!(a=A(o,r))||a.enumerable});return t};var z=(t,o,e)=>(e=t!=null?s(E(t)):{},v(o||!t||!t.__esModule?c(e,"default",{value:t,enumerable:!0}):e,t));var n={default:["#505ED9","#04A4B0","#A974F7","#C2306F","#7DA11B","#864AE0","#F2638C","#017580","#139BEB","#545C8A","#F26722","#0B7B46"],hover:["#3B47B2","#01818C","#A974F7","#991D53","#61800E","#6732B8","#CF3A7A","#005C66","#087ABD","#484F7A","#C44F14","#075E39"],focus:["#3B47B2","#01818C","#8D4EED","#991D53","#61800E","#6732B8","#CF3A7A","#005C66","#087ABD","#484F7A","#C44F14","#075E39"],active:["#505ED9","#04A4B0","#A974F7","#C2306F","#7DA11B","#864AE0","#F2638C","#017580","#139BEB","#545C8A","#F26722","#0B7B46"]},i=(t,o)=>{let e=n[o][t-1];return e?`var(--data-viz-categorical-${t}-${o}, ${e})`:void 0},D=(t,o="default")=>typeof t!="number"?[]:n[o].slice(0,t).map((a,r)=>i(r+1,o)).filter(a=>a!==void 0),k=(t="default")=>D(n[t].length,t),x=(t,o)=>{let e=t.match(/^var\(--data-viz-categorical-(\d+)-default(?:,.*)?\)$/);if(e){let a=Number(e[1]),r=i(a,"default"),g=i(a,o);if(r===t&&g)return g}return t.replace(/(--(?:data-viz|viz-color)-categorical-\d+)-default(?=$|[),\s])/g,`$1-${o}`).replace(/(--accent-[a-z])-default(?=[,)])/g,`$1-${o}`)};

const omitChartConfigKeys = (config, keys) => Object.fromEntries(Object.entries(config).filter(([key]) => !keys.includes(key)));
const noopChartTooltip = () => "";

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const isChartPopoverSelfManaged = (supportsSelfManaged, popoverOptions, override) => {
    var _a, _b;
    return supportsSelfManaged &&
        ((_b = (_a = override === null || override === void 0 ? void 0 : override.selfManaged) !== null && _a !== void 0 ? _a : popoverOptions === null || popoverOptions === void 0 ? void 0 : popoverOptions.selfManaged) !== null && _b !== void 0 ? _b : false);
};
const resolveChartPopoverOptions = (defaults, popoverOptions, supportsSelfManaged, override) => {
    const _a = popoverOptions !== null && popoverOptions !== void 0 ? popoverOptions : {}, resolvedPopoverOptions = __rest(_a, ["selfManaged"]);
    const _b = override !== null && override !== void 0 ? override : {}, resolvedOverride = __rest(_b, ["selfManaged"]);
    const selfManaged = isChartPopoverSelfManaged(supportsSelfManaged, popoverOptions, override);
    return Object.assign(Object.assign(Object.assign(Object.assign({}, defaults), (supportsSelfManaged
        ? { trigger: selfManaged ? "hover" : "click" }
        : {})), resolvedPopoverOptions), (supportsSelfManaged ? resolvedOverride : {}));
};
const applyChartPopoverOptions = (popover, popoverOptions) => {
    if (!popover) {
        return;
    }
    Object.entries(popoverOptions).forEach(([key, value]) => {
        if (value !== undefined) {
            Reflect.set(popover, key, value);
        }
    });
};

export { $, D, S, applyChartPopoverOptions as a, b, i as c, isChartPopoverSelfManaged as i, k, m, noopChartTooltip as n, omitChartConfigKeys as o, p, resolveChartPopoverOptions as r, x, z };

