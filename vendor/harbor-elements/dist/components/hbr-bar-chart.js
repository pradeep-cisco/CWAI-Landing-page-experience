import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { M as Me } from './harbor-charts-bar.es.js';
import { r as react, c as createRoot } from './client.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { s as showChartPopover, h as hideChartPopover, b as browserDownloadCsv, d as defineCustomElement$7 } from './board.js';
import { o as omitChartConfigKeys, n as noopChartTooltip, r as resolveChartPopoverOptions, a as applyChartPopoverOptions, i as isChartPopoverSelfManaged } from './popover-options.js';
import { d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$5 } from './illustration.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';
import { Z as Zo } from './chunk-EORJBOKT.js';

const getPatternIndex = (id, userConfig) => {
    const keys = Array.isArray(userConfig === null || userConfig === void 0 ? void 0 : userConfig.keys) ? userConfig.keys : [];
    const index = keys.findIndex((key) => String(key) === String(id));
    return index < 0 ? 0 : (index % 12) + 1;
};
const getPopoverIndicator = (obj, row, color, categorical, userConfig) => {
    var _a, _b, _c;
    const id = (_b = (_a = row === null || row === void 0 ? void 0 : row.id) !== null && _a !== void 0 ? _a : obj === null || obj === void 0 ? void 0 : obj.id) !== null && _b !== void 0 ? _b : (_c = obj === null || obj === void 0 ? void 0 : obj.data) === null || _c === void 0 ? void 0 : _c.id;
    const patternIndex = categorical && (userConfig === null || userConfig === void 0 ? void 0 : userConfig.pattern) ? getPatternIndex(id, userConfig) : 0;
    const className = [
        "chart-bar__popover-indicator",
        patternIndex > 1 ? "chart-bar__popover-indicator--pattern" : "",
        patternIndex > 1
            ? `chart-bar__popover-indicator--pattern-${patternIndex}`
            : "",
    ]
        .filter(Boolean)
        .join(" ");
    const indicatorStyle = categorical
        ? "border-radius:var(--viz-bar-categorical-popover-indicator-border-radius, 2px);"
        : "";
    return `<div class="${className}" style="background:${color};${indicatorStyle}"></div>`;
};
function generateTooltipContentRow(obj, categorical = false, userConfig) {
    const popoverClassName = categorical
        ? "chart-bar__popover chart-bar__popover--categorical"
        : "chart-bar__popover";
    let infoBlock = null;
    if (Array.isArray(obj.data)) {
        const rows = obj.data
            .map((r) => {
            var _a;
            return `<div class="${popoverClassName}">
        <div>
          ${getPopoverIndicator(obj, r, r.color || obj.color, categorical, userConfig)}
          ${r.key || r.id}
        </div>
        <div>
          ${(_a = r.formattedValue) !== null && _a !== void 0 ? _a : r.value}
        </div>
      </div>`;
        })
            .join("");
        infoBlock =
            obj.data.length > 1
                ? `<div class="chart-bar__popover-rows">${rows}</div>`
                : rows;
    }
    else {
        infoBlock = `
      <div class="${popoverClassName}">
        <div>
          ${getPopoverIndicator(obj, undefined, obj.color, categorical, userConfig)}
          ${categorical &&
            Array.isArray(userConfig === null || userConfig === void 0 ? void 0 : userConfig.keys) &&
            userConfig.keys.length > 1
            ? obj.data.id
            : obj.data.indexValue}
        </div>
        <div>
          ${obj.data.value}
        </div>
      </div>
    `;
    }
    return infoBlock;
}
const toggleBarItemPopover = (tooltipRef, event, node, customTooltipFunc, categorical = false, userConfig) => {
    if (event && tooltipRef) {
        showChartPopover(tooltipRef, node, event, customTooltipFunc, (data) => generateTooltipContentRow(data, categorical, userConfig));
    }
    else if (tooltipRef) {
        hideChartPopover(tooltipRef);
    }
};
const toggleBarLegendPopover = (tooltipRef, event, id, fill, userConfig, categorical = false) => {
    if (event && id && fill && userConfig) {
        const curDataAry = userConfig.data
            .filter((r) => Object.prototype.hasOwnProperty.call(r, id))
            .map((r) => ({
            key: r[userConfig.indexBy],
            value: r[id],
            formattedValue: r[id],
        }));
        showChartPopover(tooltipRef, { id, data: curDataAry, color: fill }, event, userConfig.legendTooltip, (data) => generateTooltipContentRow(data, categorical, userConfig));
    }
    else {
        hideChartPopover(tooltipRef);
    }
};
const toggleBarMarkerLegendPopover = (tooltipRef, event, legendData, customTooltipFunc) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!event ||
        !tooltipRef ||
        !legendData ||
        typeof customTooltipFunc !== "function") {
        hideChartPopover(tooltipRef);
        return;
    }
    const markerLabel = (_b = (_a = legendData.markerLegendLabel) !== null && _a !== void 0 ? _a : legendData.markerValue) !== null && _b !== void 0 ? _b : "";
    const markerValue = (_d = (_c = legendData.markerValue) !== null && _c !== void 0 ? _c : legendData.markerLegendLabel) !== null && _d !== void 0 ? _d : "";
    const fill = legendData.color || "var(--viz-color-neutral-40)";
    const stroke = ((_e = legendData.lineStyle) === null || _e === void 0 ? void 0 : _e.stroke) || fill;
    const strokeWidth = Math.min(Number((_f = legendData.lineStyle) === null || _f === void 0 ? void 0 : _f.strokeWidth) || 3, 3);
    const dashArray = (_g = legendData.lineStyle) === null || _g === void 0 ? void 0 : _g.strokeDasharray;
    const symbol = `<svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
		<rect x="0" y="2" width="20" height="12" fill="${fill}" opacity="${(_h = legendData.opacity) !== null && _h !== void 0 ? _h : 1}"></rect>
		<line x1="0" y1="2" x2="20" y2="2" stroke="${stroke}" stroke-width="${strokeWidth}"${dashArray ? ` stroke-dasharray="${dashArray}"` : ""}></line>
	</svg>`;
    showChartPopover(tooltipRef, legendData, event, (data, tooltipEvent, h) => customTooltipFunc(Object.assign(Object.assign({}, data), { markerLabel, markerValue }), tooltipEvent, h), () => `<div class="chart-bar__popover chart-bar__popover--categorical">
				<div>${symbol}${markerLabel}</div>
				<div>${markerValue}</div>
			</div>`);
};
const showBarAxisPopover = (data, event, tooltipRef, customTooltipFunc, categorical = false, userConfig) => {
    if (event && tooltipRef) {
        showChartPopover(tooltipRef, { data }, event, customTooltipFunc, (data) => generateTooltipContentRow(data, categorical, userConfig));
    }
    else if (tooltipRef) {
        hideChartPopover(tooltipRef);
    }
};
const hideBarPopover = (tooltipRef) => {
    hideChartPopover(tooltipRef);
};
const convertBarDataToCSV = (arr) => {
    const headers = Array.from(arr.reduce((total, cur) => {
        const keys = Object.keys(cur);
        keys.forEach((r) => total.add(r));
        return total;
    }, new Set()));
    const title = `${headers.join(",")}\n`;
    const result = arr
        .map((it) => {
        const line = headers.reduce((total, cur, idx) => {
            let row = total + (it[cur] || '""');
            if (idx !== headers.length - 1) {
                row += ",";
            }
            return row;
        }, "");
        return line;
    })
        .join("\n");
    return title + result;
};

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}:root{--viz-color-empty-shade-color:var(--control-border-weak-default, #E1E4E8);--viz-color-empty-shade-bg:var(--base-bg-weak-default, #FFFFFF)}@media (prefers-color-scheme: light){:root{--viz-text-color:var(--base-text-default, #23282E);--viz-inverse-text-color:var(--base-text-in-default, #FFFFFF);--viz-donut-color-select-ring:var(--base-text-default, #23282E)}:root .hbr-mode-dark,:root .dark{--viz-text-color:var(--base-text-default, #FFFFFF);--viz-inverse-text-color:var(--base-text-in-default, #23282E);--viz-donut-color-select-ring:var(--base-text-default, #FFFFFF)}}@media (prefers-color-scheme: dark){:root{--viz-text-color:var(--base-text-default, #FFFFFF);--viz-inverse-text-color:var(--base-text-in-default, #23282E);--viz-donut-color-select-ring:var(--base-text-default, #FFFFFF)}:root .hbr-mode-light,:root .light{--viz-text-color:var(--base-text-default, #23282E);--viz-inverse-text-color:var(--base-text-in-default, #FFFFFF);--viz-donut-color-select-ring:var(--base-text-default, #23282E)}}@media (prefers-color-scheme: light){:root{--viz-gradient-style-categorical-vertical-1-default:linear-gradient(180deg, var(--data-viz-categorical-1-gradient-default-end, #505ED9) 0%, var(--data-viz-categorical-1-gradient-default-start, #6977F0) 100%);--viz-gradient-style-categorical-vertical-2-default:linear-gradient(180deg, var(--data-viz-categorical-2-gradient-default-end, #04A4B0) 0%, var(--data-viz-categorical-2-gradient-default-start, #17C2C2) 100%);--viz-gradient-style-categorical-vertical-3-default:linear-gradient(180deg, var(--data-viz-categorical-3-gradient-default-end, #A974F7) 0%, var(--data-viz-categorical-3-gradient-default-start, #C299FF) 100%);--viz-gradient-style-categorical-vertical-4-default:linear-gradient(180deg, var(--data-viz-categorical-4-gradient-default-end, #C2306F) 0%, var(--data-viz-categorical-4-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-vertical-5-default:linear-gradient(180deg, var(--data-viz-categorical-5-gradient-default-end, #7DA11B) 0%, var(--data-viz-categorical-5-gradient-default-start, #9DBA4C) 100%);--viz-gradient-style-categorical-vertical-6-default:linear-gradient(180deg, var(--data-viz-categorical-6-gradient-default-end, #864AE0) 0%, var(--data-viz-categorical-6-gradient-default-start, #9B5FF5) 100%);--viz-gradient-style-categorical-vertical-7-default:linear-gradient(180deg, var(--data-viz-categorical-7-gradient-default-end, #F2638C) 0%, var(--data-viz-categorical-7-gradient-default-start, #FF87A9) 100%);--viz-gradient-style-categorical-vertical-8-default:linear-gradient(180deg, var(--data-viz-categorical-8-gradient-default-end, #017580) 0%, var(--data-viz-categorical-8-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-vertical-9-default:linear-gradient(180deg, var(--data-viz-categorical-9-gradient-default-end, #139BEB) 0%, var(--data-viz-categorical-9-gradient-default-start, #33BBF5) 100%);--viz-gradient-style-categorical-vertical-10-default:linear-gradient(180deg, var(--data-viz-categorical-10-gradient-default-end, #545C8A) 0%, var(--data-viz-categorical-10-gradient-default-start, #6871A3) 100%);--viz-gradient-style-categorical-vertical-11-default:linear-gradient(180deg, var(--data-viz-categorical-11-gradient-default-end, #F26722) 0%, var(--data-viz-categorical-11-gradient-default-start, #FC8D4C) 100%);--viz-gradient-style-categorical-vertical-12-default:linear-gradient(180deg, var(--data-viz-categorical-12-gradient-default-end, #0B7B46) 0%, var(--data-viz-categorical-12-gradient-default-start, #169855) 100%);--viz-gradient-style-categorical-horizontal-1-default:linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end, #505ED9) 0%, var(--data-viz-categorical-1-gradient-default-start, #6977F0) 100%);--viz-gradient-style-categorical-horizontal-2-default:linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end, #04A4B0) 0%, var(--data-viz-categorical-2-gradient-default-start, #17C2C2) 100%);--viz-gradient-style-categorical-horizontal-3-default:linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end, #A974F7) 0%, var(--data-viz-categorical-3-gradient-default-start, #C299FF) 100%);--viz-gradient-style-categorical-horizontal-4-default:linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end, #C2306F) 0%, var(--data-viz-categorical-4-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-horizontal-5-default:linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end, #7DA11B) 0%, var(--data-viz-categorical-5-gradient-default-start, #9DBA4C) 100%);--viz-gradient-style-categorical-horizontal-6-default:linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end, #864AE0) 0%, var(--data-viz-categorical-6-gradient-default-start, #9B5FF5) 100%);--viz-gradient-style-categorical-horizontal-7-default:linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end, #F2638C) 0%, var(--data-viz-categorical-7-gradient-default-start, #FF87A9) 100%);--viz-gradient-style-categorical-horizontal-8-default:linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end, #017580) 0%, var(--data-viz-categorical-8-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-horizontal-9-default:linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end, #139BEB) 0%, var(--data-viz-categorical-9-gradient-default-start, #33BBF5) 100%);--viz-gradient-style-categorical-horizontal-10-default:linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end, #545C8A) 0%, var(--data-viz-categorical-10-gradient-default-start, #6871A3) 100%);--viz-gradient-style-categorical-horizontal-11-default:linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end, #F26722) 0%, var(--data-viz-categorical-11-gradient-default-start, #FC8D4C) 100%);--viz-gradient-style-categorical-horizontal-12-default:linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end, #0B7B46) 0%, var(--data-viz-categorical-12-gradient-default-start, #169855) 100%)}:root .hbr-mode-dark,:root .dark{--viz-gradient-style-categorical-vertical-1-default:linear-gradient(180deg, var(--data-viz-categorical-1-gradient-default-end, #6977F0) 0%, var(--data-viz-categorical-1-gradient-default-start, #4653C7) 100%);--viz-gradient-style-categorical-vertical-2-default:linear-gradient(180deg, var(--data-viz-categorical-2-gradient-default-end, #17C2C2) 0%, var(--data-viz-categorical-2-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-vertical-3-default:linear-gradient(180deg, var(--data-viz-categorical-3-gradient-default-end, #E0CCFF) 0%, var(--data-viz-categorical-3-gradient-default-start, #B587FA) 100%);--viz-gradient-style-categorical-vertical-4-default:linear-gradient(180deg, var(--data-viz-categorical-4-gradient-default-end, #E3447C) 0%, var(--data-viz-categorical-4-gradient-default-start, #B02863) 100%);--viz-gradient-style-categorical-vertical-5-default:linear-gradient(180deg, var(--data-viz-categorical-5-gradient-default-end, #9DBA4C) 0%, var(--data-viz-categorical-5-gradient-default-start, #6C8C14) 100%);--viz-gradient-style-categorical-vertical-6-default:linear-gradient(180deg, var(--data-viz-categorical-6-gradient-default-end, #9B5FF5) 0%, var(--data-viz-categorical-6-gradient-default-start, #753BCC) 100%);--viz-gradient-style-categorical-vertical-7-default:linear-gradient(180deg, var(--data-viz-categorical-7-gradient-default-end, #FF87A9) 0%, var(--data-viz-categorical-7-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-vertical-8-default:linear-gradient(180deg, var(--data-viz-categorical-8-gradient-default-end, #028E99) 0%, var(--data-viz-categorical-8-gradient-default-start, #006773) 100%);--viz-gradient-style-categorical-vertical-9-default:linear-gradient(180deg, var(--data-viz-categorical-9-gradient-default-end, #9ADFFC) 0%, var(--data-viz-categorical-9-gradient-default-start, #23A8EB) 100%);--viz-gradient-style-categorical-vertical-10-default:linear-gradient(180deg, var(--data-viz-categorical-10-gradient-default-end, #767EB2) 0%, var(--data-viz-categorical-10-gradient-default-start, #545C8A) 100%);--viz-gradient-style-categorical-vertical-11-default:linear-gradient(180deg, var(--data-viz-categorical-11-gradient-default-end, #FC8D4C) 0%, var(--data-viz-categorical-11-gradient-default-start, #D95A1A) 100%);--viz-gradient-style-categorical-vertical-12-default:linear-gradient(180deg, var(--data-viz-categorical-12-gradient-default-end, #169855) 0%, var(--data-viz-categorical-12-gradient-default-start, #087041) 100%);--viz-gradient-style-categorical-horizontal-1-default:linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end, #6977F0) 0%, var(--data-viz-categorical-1-gradient-default-start, #4653C7) 100%);--viz-gradient-style-categorical-horizontal-2-default:linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end, #17C2C2) 0%, var(--data-viz-categorical-2-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-horizontal-3-default:linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end, #E0CCFF) 0%, var(--data-viz-categorical-3-gradient-default-start, #B587FA) 100%);--viz-gradient-style-categorical-horizontal-4-default:linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end, #E3447C) 0%, var(--data-viz-categorical-4-gradient-default-start, #B02863) 100%);--viz-gradient-style-categorical-horizontal-5-default:linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end, #9DBA4C) 0%, var(--data-viz-categorical-5-gradient-default-start, #6C8C14) 100%);--viz-gradient-style-categorical-horizontal-6-default:linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end, #9B5FF5) 0%, var(--data-viz-categorical-6-gradient-default-start, #753BCC) 100%);--viz-gradient-style-categorical-horizontal-7-default:linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end, #FF87A9) 0%, var(--data-viz-categorical-7-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-horizontal-8-default:linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end, #028E99) 0%, var(--data-viz-categorical-8-gradient-default-start, #006773) 100%);--viz-gradient-style-categorical-horizontal-9-default:linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end, #9ADFFC) 0%, var(--data-viz-categorical-9-gradient-default-start, #23A8EB) 100%);--viz-gradient-style-categorical-horizontal-10-default:linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end, #767EB2) 0%, var(--data-viz-categorical-10-gradient-default-start, #545C8A) 100%);--viz-gradient-style-categorical-horizontal-11-default:linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end, #FC8D4C) 0%, var(--data-viz-categorical-11-gradient-default-start, #D95A1A) 100%);--viz-gradient-style-categorical-horizontal-12-default:linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end, #169855) 0%, var(--data-viz-categorical-12-gradient-default-start, #087041) 100%)}}@media (prefers-color-scheme: dark){:root{--viz-gradient-style-categorical-vertical-1-default:linear-gradient(180deg, var(--data-viz-categorical-1-gradient-default-end, #6977F0) 0%, var(--data-viz-categorical-1-gradient-default-start, #4653C7) 100%);--viz-gradient-style-categorical-vertical-2-default:linear-gradient(180deg, var(--data-viz-categorical-2-gradient-default-end, #17C2C2) 0%, var(--data-viz-categorical-2-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-vertical-3-default:linear-gradient(180deg, var(--data-viz-categorical-3-gradient-default-end, #E0CCFF) 0%, var(--data-viz-categorical-3-gradient-default-start, #B587FA) 100%);--viz-gradient-style-categorical-vertical-4-default:linear-gradient(180deg, var(--data-viz-categorical-4-gradient-default-end, #E3447C) 0%, var(--data-viz-categorical-4-gradient-default-start, #B02863) 100%);--viz-gradient-style-categorical-vertical-5-default:linear-gradient(180deg, var(--data-viz-categorical-5-gradient-default-end, #9DBA4C) 0%, var(--data-viz-categorical-5-gradient-default-start, #6C8C14) 100%);--viz-gradient-style-categorical-vertical-6-default:linear-gradient(180deg, var(--data-viz-categorical-6-gradient-default-end, #9B5FF5) 0%, var(--data-viz-categorical-6-gradient-default-start, #753BCC) 100%);--viz-gradient-style-categorical-vertical-7-default:linear-gradient(180deg, var(--data-viz-categorical-7-gradient-default-end, #FF87A9) 0%, var(--data-viz-categorical-7-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-vertical-8-default:linear-gradient(180deg, var(--data-viz-categorical-8-gradient-default-end, #028E99) 0%, var(--data-viz-categorical-8-gradient-default-start, #006773) 100%);--viz-gradient-style-categorical-vertical-9-default:linear-gradient(180deg, var(--data-viz-categorical-9-gradient-default-end, #9ADFFC) 0%, var(--data-viz-categorical-9-gradient-default-start, #23A8EB) 100%);--viz-gradient-style-categorical-vertical-10-default:linear-gradient(180deg, var(--data-viz-categorical-10-gradient-default-end, #767EB2) 0%, var(--data-viz-categorical-10-gradient-default-start, #545C8A) 100%);--viz-gradient-style-categorical-vertical-11-default:linear-gradient(180deg, var(--data-viz-categorical-11-gradient-default-end, #FC8D4C) 0%, var(--data-viz-categorical-11-gradient-default-start, #D95A1A) 100%);--viz-gradient-style-categorical-vertical-12-default:linear-gradient(180deg, var(--data-viz-categorical-12-gradient-default-end, #169855) 0%, var(--data-viz-categorical-12-gradient-default-start, #087041) 100%);--viz-gradient-style-categorical-horizontal-1-default:linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end, #6977F0) 0%, var(--data-viz-categorical-1-gradient-default-start, #4653C7) 100%);--viz-gradient-style-categorical-horizontal-2-default:linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end, #17C2C2) 0%, var(--data-viz-categorical-2-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-horizontal-3-default:linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end, #E0CCFF) 0%, var(--data-viz-categorical-3-gradient-default-start, #B587FA) 100%);--viz-gradient-style-categorical-horizontal-4-default:linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end, #E3447C) 0%, var(--data-viz-categorical-4-gradient-default-start, #B02863) 100%);--viz-gradient-style-categorical-horizontal-5-default:linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end, #9DBA4C) 0%, var(--data-viz-categorical-5-gradient-default-start, #6C8C14) 100%);--viz-gradient-style-categorical-horizontal-6-default:linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end, #9B5FF5) 0%, var(--data-viz-categorical-6-gradient-default-start, #753BCC) 100%);--viz-gradient-style-categorical-horizontal-7-default:linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end, #FF87A9) 0%, var(--data-viz-categorical-7-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-horizontal-8-default:linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end, #028E99) 0%, var(--data-viz-categorical-8-gradient-default-start, #006773) 100%);--viz-gradient-style-categorical-horizontal-9-default:linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end, #9ADFFC) 0%, var(--data-viz-categorical-9-gradient-default-start, #23A8EB) 100%);--viz-gradient-style-categorical-horizontal-10-default:linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end, #767EB2) 0%, var(--data-viz-categorical-10-gradient-default-start, #545C8A) 100%);--viz-gradient-style-categorical-horizontal-11-default:linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end, #FC8D4C) 0%, var(--data-viz-categorical-11-gradient-default-start, #D95A1A) 100%);--viz-gradient-style-categorical-horizontal-12-default:linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end, #169855) 0%, var(--data-viz-categorical-12-gradient-default-start, #087041) 100%)}:root .hbr-mode-light,:root .light{--viz-gradient-style-categorical-vertical-1-default:linear-gradient(180deg, var(--data-viz-categorical-1-gradient-default-end, #505ED9) 0%, var(--data-viz-categorical-1-gradient-default-start, #6977F0) 100%);--viz-gradient-style-categorical-vertical-2-default:linear-gradient(180deg, var(--data-viz-categorical-2-gradient-default-end, #04A4B0) 0%, var(--data-viz-categorical-2-gradient-default-start, #17C2C2) 100%);--viz-gradient-style-categorical-vertical-3-default:linear-gradient(180deg, var(--data-viz-categorical-3-gradient-default-end, #A974F7) 0%, var(--data-viz-categorical-3-gradient-default-start, #C299FF) 100%);--viz-gradient-style-categorical-vertical-4-default:linear-gradient(180deg, var(--data-viz-categorical-4-gradient-default-end, #C2306F) 0%, var(--data-viz-categorical-4-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-vertical-5-default:linear-gradient(180deg, var(--data-viz-categorical-5-gradient-default-end, #7DA11B) 0%, var(--data-viz-categorical-5-gradient-default-start, #9DBA4C) 100%);--viz-gradient-style-categorical-vertical-6-default:linear-gradient(180deg, var(--data-viz-categorical-6-gradient-default-end, #864AE0) 0%, var(--data-viz-categorical-6-gradient-default-start, #9B5FF5) 100%);--viz-gradient-style-categorical-vertical-7-default:linear-gradient(180deg, var(--data-viz-categorical-7-gradient-default-end, #F2638C) 0%, var(--data-viz-categorical-7-gradient-default-start, #FF87A9) 100%);--viz-gradient-style-categorical-vertical-8-default:linear-gradient(180deg, var(--data-viz-categorical-8-gradient-default-end, #017580) 0%, var(--data-viz-categorical-8-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-vertical-9-default:linear-gradient(180deg, var(--data-viz-categorical-9-gradient-default-end, #139BEB) 0%, var(--data-viz-categorical-9-gradient-default-start, #33BBF5) 100%);--viz-gradient-style-categorical-vertical-10-default:linear-gradient(180deg, var(--data-viz-categorical-10-gradient-default-end, #545C8A) 0%, var(--data-viz-categorical-10-gradient-default-start, #6871A3) 100%);--viz-gradient-style-categorical-vertical-11-default:linear-gradient(180deg, var(--data-viz-categorical-11-gradient-default-end, #F26722) 0%, var(--data-viz-categorical-11-gradient-default-start, #FC8D4C) 100%);--viz-gradient-style-categorical-vertical-12-default:linear-gradient(180deg, var(--data-viz-categorical-12-gradient-default-end, #0B7B46) 0%, var(--data-viz-categorical-12-gradient-default-start, #169855) 100%);--viz-gradient-style-categorical-horizontal-1-default:linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end, #505ED9) 0%, var(--data-viz-categorical-1-gradient-default-start, #6977F0) 100%);--viz-gradient-style-categorical-horizontal-2-default:linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end, #04A4B0) 0%, var(--data-viz-categorical-2-gradient-default-start, #17C2C2) 100%);--viz-gradient-style-categorical-horizontal-3-default:linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end, #A974F7) 0%, var(--data-viz-categorical-3-gradient-default-start, #C299FF) 100%);--viz-gradient-style-categorical-horizontal-4-default:linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end, #C2306F) 0%, var(--data-viz-categorical-4-gradient-default-start, #E3447C) 100%);--viz-gradient-style-categorical-horizontal-5-default:linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end, #7DA11B) 0%, var(--data-viz-categorical-5-gradient-default-start, #9DBA4C) 100%);--viz-gradient-style-categorical-horizontal-6-default:linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end, #864AE0) 0%, var(--data-viz-categorical-6-gradient-default-start, #9B5FF5) 100%);--viz-gradient-style-categorical-horizontal-7-default:linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end, #F2638C) 0%, var(--data-viz-categorical-7-gradient-default-start, #FF87A9) 100%);--viz-gradient-style-categorical-horizontal-8-default:linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end, #017580) 0%, var(--data-viz-categorical-8-gradient-default-start, #028E99) 100%);--viz-gradient-style-categorical-horizontal-9-default:linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end, #139BEB) 0%, var(--data-viz-categorical-9-gradient-default-start, #33BBF5) 100%);--viz-gradient-style-categorical-horizontal-10-default:linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end, #545C8A) 0%, var(--data-viz-categorical-10-gradient-default-start, #6871A3) 100%);--viz-gradient-style-categorical-horizontal-11-default:linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end, #F26722) 0%, var(--data-viz-categorical-11-gradient-default-start, #FC8D4C) 100%);--viz-gradient-style-categorical-horizontal-12-default:linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end, #0B7B46) 0%, var(--data-viz-categorical-12-gradient-default-start, #169855) 100%)}}.--bar-chart{--viz-bar-item-vertical-border-radius:6px 6px 0 0;--viz-bar-item-horizontal-border-radius:0 6px 6px 0;--viz-bar-item-grouped-border-radius:3px;--viz-bar-text-in:var(--viz-inverse-text-color);--viz-bar-color-text-above:var(--base-text-default);--viz-bar-opacity-not-selected:.25;--viz-bar-opacity-dehighlight:.5;--viz-bar-opacity-default:1;--viz-bar-label-above-font-size:var(--viz-font-size-xs);--viz-bar-label-right-font-size:var(--viz-font-size-xs)}.--bar-chart.--categorical .legend-event-rect{cursor:default!important}.--bar-chart.--categorical .legend-event-rect:hover~text{font-weight:var(--viz-bar-legend-text-hover-font-weight, 600)!important}.--bar-chart.--categorical g:has(>.--bar-legend-empty) .legend-event-rect:hover~text{font-weight:inherit!important}.--bar-chart.--categorical g:has(>.--bar-legend-empty) .legend-event-rect{display:contents;pointer-events:none!important}.--bar-chart.--categorical g:has(>.--bar-legend-empty){cursor:not-allowed;pointer-events:bounding-box}.--bar-chart .viz-bar-item-categorical-1{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end) 0%, var(--data-viz-categorical-1-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-1-gradient-default));--viz-bar-pattern-overlay:none}.--bar-chart .viz-bar-item-categorical-1.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-1-gradient-default-end) 0%, var(--data-viz-categorical-1-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-1.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-1-gradient-default))}.--bar-chart .viz-bar-item-categorical-1.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-1-hover, #3B47B2))}.--bar-chart .viz-bar-item-categorical-1.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-1-focus, #3B47B2))}.--bar-chart .viz-bar-item-categorical-1.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-1-active, #505ED9))}.--bar-chart .viz-bar-item-categorical-2{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end) 0%, var(--data-viz-categorical-2-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-2-gradient-default));--viz-bar-pattern-overlay:repeating-linear-gradient(0deg, var(--base-text-in-default) 0 2px, transparent 2px 8px)}.--bar-chart .viz-bar-item-categorical-2.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-2-gradient-default-end) 0%, var(--data-viz-categorical-2-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-2.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-2-gradient-default))}.--bar-chart .viz-bar-item-categorical-2.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-2-hover, #01818C))}.--bar-chart .viz-bar-item-categorical-2.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-2-focus, #01818C))}.--bar-chart .viz-bar-item-categorical-2.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-2-active, #04A4B0))}.--bar-chart .viz-bar-item-categorical-3{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end) 0%, var(--data-viz-categorical-3-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-3-gradient-default));--viz-bar-pattern-overlay:radial-gradient(circle, var(--base-text-in-default) 0 1.8px, transparent 1.8px), radial-gradient(circle, var(--base-text-in-default) 0 1.8px, transparent 1.8px);--viz-bar-pattern-overlay-size:16px 16px, 16px 16px;--viz-bar-pattern-overlay-position:6px 6px, 14px 14px}.--bar-chart .viz-bar-item-categorical-3.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-3-gradient-default-end) 0%, var(--data-viz-categorical-3-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-3.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-3-gradient-default))}.--bar-chart .viz-bar-item-categorical-3.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-3-hover, #A974F7))}.--bar-chart .viz-bar-item-categorical-3.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-3-focus, #8D4EED))}.--bar-chart .viz-bar-item-categorical-3.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-3-active, #A974F7))}.--bar-chart .viz-bar-item-categorical-4{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end) 0%, var(--data-viz-categorical-4-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-4-gradient-default));--viz-bar-pattern-overlay:repeating-linear-gradient(90deg, var(--base-text-in-default) 0 2px, transparent 2px 7px)}.--bar-chart .viz-bar-item-categorical-4.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-4-gradient-default-end) 0%, var(--data-viz-categorical-4-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-4.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-4-gradient-default))}.--bar-chart .viz-bar-item-categorical-4.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-4-hover, #991D53))}.--bar-chart .viz-bar-item-categorical-4.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-4-focus, #991D53))}.--bar-chart .viz-bar-item-categorical-4.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-4-active, #C2306F))}.--bar-chart .viz-bar-item-categorical-5{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end) 0%, var(--data-viz-categorical-5-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-5-gradient-default));--viz-bar-pattern-overlay:conic-gradient(from 90deg, var(--base-text-in-default) 0 25%, transparent 0 50%, var(--base-text-in-default) 0 75%, transparent 0);--viz-bar-pattern-overlay-size:14px 14px}.--bar-chart .viz-bar-item-categorical-5.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-5-gradient-default-end) 0%, var(--data-viz-categorical-5-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-5.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-5-gradient-default))}.--bar-chart .viz-bar-item-categorical-5.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-5-hover, #61800E))}.--bar-chart .viz-bar-item-categorical-5.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-5-focus, #61800E))}.--bar-chart .viz-bar-item-categorical-5.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-5-active, #7DA11B))}.--bar-chart .viz-bar-item-categorical-6{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end) 0%, var(--data-viz-categorical-6-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-6-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12'%3E%3Cpath d='M0 6 Q3 0 6 6 T12 6 T18 6 T24 6' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:24px 12px;--viz-bar-pattern-color:var(--base-text-in-default)}.--bar-chart .viz-bar-item-categorical-6.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-6-gradient-default-end) 0%, var(--data-viz-categorical-6-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-6.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-6-gradient-default))}.--bar-chart .viz-bar-item-categorical-6.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-6-hover, #6732B8))}.--bar-chart .viz-bar-item-categorical-6.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-6-focus, #6732B8))}.--bar-chart .viz-bar-item-categorical-6.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-6-active, #864AE0))}.--bar-chart .viz-bar-item-categorical-7{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end) 0%, var(--data-viz-categorical-7-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-7-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 2.5 L9.5 6 L6 9.5 L2.5 6 Z' fill='none' stroke='black' stroke-width='1.3'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:12px 12px;--viz-bar-pattern-color:var(--base-text-in-default)}.--bar-chart .viz-bar-item-categorical-7.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-7-gradient-default-end) 0%, var(--data-viz-categorical-7-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-7.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-7-gradient-default))}.--bar-chart .viz-bar-item-categorical-7.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-7-hover, #CF3A7A))}.--bar-chart .viz-bar-item-categorical-7.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-7-focus, #CF3A7A))}.--bar-chart .viz-bar-item-categorical-7.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-7-active, #F2638C))}.--bar-chart .viz-bar-item-categorical-8{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end) 0%, var(--data-viz-categorical-8-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-8-gradient-default));--viz-bar-pattern-overlay:repeating-linear-gradient(90deg, var(--base-text-in-default) 0 1.5px, transparent 1.5px 7px), repeating-linear-gradient(0deg, var(--base-text-in-default) 0 1.5px, transparent 1.5px 7px)}.--bar-chart .viz-bar-item-categorical-8.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-8-gradient-default-end) 0%, var(--data-viz-categorical-8-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-8.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-8-gradient-default))}.--bar-chart .viz-bar-item-categorical-8.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-8-hover, #005C66))}.--bar-chart .viz-bar-item-categorical-8.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-8-focus, #005C66))}.--bar-chart .viz-bar-item-categorical-8.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-8-active, #017580))}.--bar-chart .viz-bar-item-categorical-9{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end) 0%, var(--data-viz-categorical-9-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-9-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpath d='M4 0.4 L8 7.6 H0 Z' fill='black'/%3E%3Cpath d='M12 7.6 L8 0.4 H16 Z' fill='black'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:16px 8px;--viz-bar-pattern-border-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpath d='M4 0.4 L8 7.6 H0 Z' fill='none' stroke='black' stroke-width='1.2' stroke-linejoin='round'/%3E%3Cpath d='M12 7.6 L8 0.4 H16 Z' fill='none' stroke='black' stroke-width='1.2' stroke-linejoin='round'/%3E%3C/svg%3E\");--viz-bar-pattern-border-mask-size:16px 8px;--viz-bar-pattern-color:var(--base-text-in-default);--viz-bar-pattern-border-color:var(--data-viz-categorical-9-default)}.--bar-chart .viz-bar-item-categorical-9.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-9-gradient-default-end) 0%, var(--data-viz-categorical-9-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-9.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-9-gradient-default))}.--bar-chart .viz-bar-item-categorical-9.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-9-hover, #087ABD))}.--bar-chart .viz-bar-item-categorical-9.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-9-focus, #087ABD))}.--bar-chart .viz-bar-item-categorical-9.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-9-active, #139BEB))}.--bar-chart .viz-bar-item-categorical-10{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end) 0%, var(--data-viz-categorical-10-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-10-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E%3Cpath d='M6 0 Q0 3 6 6 T6 12 T6 18 T6 24' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:12px 24px;--viz-bar-pattern-color:var(--base-text-in-default)}.--bar-chart .viz-bar-item-categorical-10.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-10-gradient-default-end) 0%, var(--data-viz-categorical-10-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-10.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-10-gradient-default))}.--bar-chart .viz-bar-item-categorical-10.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-10-hover, #484F7A))}.--bar-chart .viz-bar-item-categorical-10.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-10-focus, #484F7A))}.--bar-chart .viz-bar-item-categorical-10.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-10-active, #545C8A))}.--bar-chart .viz-bar-item-categorical-11{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end) 0%, var(--data-viz-categorical-11-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-11-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Ccircle cx='9' cy='9' r='3.2' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:18px 18px;--viz-bar-pattern-color:var(--base-text-in-default)}.--bar-chart .viz-bar-item-categorical-11.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-11-gradient-default-end) 0%, var(--data-viz-categorical-11-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-11.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-11-gradient-default))}.--bar-chart .viz-bar-item-categorical-11.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-11-hover, #C44F14))}.--bar-chart .viz-bar-item-categorical-11.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-11-focus, #C44F14))}.--bar-chart .viz-bar-item-categorical-11.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-11-active, #F26722))}.--bar-chart .viz-bar-item-categorical-12{--viz-bar-pattern-bg-horizontal:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end) 0%, var(--data-viz-categorical-12-gradient-default-start) 100%));--viz-bar-pattern-bg-vertical:var(--viz-bar-item-custom-background, var(--data-viz-categorical-12-gradient-default));--viz-bar-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath d='M7 4 V10 M4 7 H10' stroke='black' stroke-width='1.7' stroke-linecap='square'/%3E%3C/svg%3E\");--viz-bar-pattern-mask-size:14px 14px;--viz-bar-pattern-color:var(--base-text-in-default)}.--bar-chart .viz-bar-item-categorical-12.horizontal{background:var(--viz-bar-item-custom-background, linear-gradient(270deg, var(--data-viz-categorical-12-gradient-default-end) 0%, var(--data-viz-categorical-12-gradient-default-start) 100%))}.--bar-chart .viz-bar-item-categorical-12.vertical{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-12-gradient-default))}.--bar-chart .viz-bar-item-categorical-12.hover{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-12-hover, #075E39))}.--bar-chart .viz-bar-item-categorical-12.focus{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-12-focus, #075E39))}.--bar-chart .viz-bar-item-categorical-12.active{background:var(--viz-bar-item-custom-background, var(--data-viz-categorical-12-active, #0B7B46))}.--bar-chart .--bar-pattern{--viz-bar-pattern-overlay:none;--viz-bar-pattern-mask:none;--viz-bar-pattern-mask-size:auto;--viz-bar-pattern-mask-position:0 0;--viz-bar-pattern-border-mask:none;--viz-bar-pattern-border-mask-size:auto;--viz-bar-pattern-border-mask-position:0 0;--viz-bar-pattern-color:transparent;--viz-bar-pattern-border-color:transparent;position:relative;overflow:hidden}.--bar-chart .--bar-pattern.horizontal{background:var(--viz-bar-pattern-bg-horizontal)}.--bar-chart .--bar-pattern.vertical{background:var(--viz-bar-pattern-bg-vertical)}.--bar-chart .--bar-pattern .--bar-pattern-svg{position:absolute;inset:0;display:block;width:100%;height:100%;border-radius:inherit;pointer-events:none}.--bar-chart .--bar-pattern:before,.--bar-chart .--bar-pattern:after{content:none}.--bar-chart .--empty{cursor:not-allowed}.--bar-chart svg>g{line-height:var(--viz-font-line-height-normal);letter-spacing:var(--viz-font-letter-spacing-loose)}.--bar-chart svg>g .--bar-item-rect{display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--base-text-default);font-size:var(--viz-font-size-sm);pointer-events:none}.--bar-chart svg>g .--bar-axis-tick-label.hover,.--bar-chart svg>g .--bar-axis-tick-label.active{font-weight:var(--hbr-font-weight-bold)}.--bar-chart svg>g .--bar-axis-tick-label{font-weight:var(--hbr-font-weight-normal, 400)}.--bar-chart svg>g .--bar-item-rect{position:fixed}.--bar-chart svg>g .--bar-legend-rect{display:inline-block}.--bar-chart svg>g rect{visibility:visible;opacity:var(--viz-bar-opacity-default);transition:visibility 0s,opacity .15s linear;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;border-radius:2px}.--bar-chart svg>g rect:focus-visible{outline-offset:2px;outline:2px solid var(--viz-color-interact-border-medium)}.--bar-chart svg>g .--bar.--bar--selected rect:focus{outline-offset:2px;outline:2px solid var(--viz-color-interact-border-medium);opacity:var(--viz-bar-opacity-default)}.--bar-chart svg>g .--bar.--bar--dehighlight rect{opacity:var(--viz-bar-opacity-dehighlight)}.--bar-chart svg>g .--bar.--bar--dehighlight rect>.--bar-item-rect{opacity:var(--viz-bar-opacity-dehighlight)}.--bar-chart svg>g .--bar.--bar--dehighlight.--bar--selected rect:focus{outline-offset:2px;outline:2px solid var(--viz-color-interact-border-medium);opacity:var(--viz-bar-opacity-default)}.--bar-chart svg>g .--bar.--bar--not-selected rect{opacity:var(--viz-bar-opacity-not-selected)}.--bar-chart svg>g .--bar.--bar--not-selected rect>.--bar-item-rect{opacity:var(--viz-bar-opacity-not-selected)}.--bar-chart svg>g .--bar.--bar--not-selected:hover rect{visibility:visible;opacity:var(--viz-bar-opacity-default)}.--bar-chart svg>g .legend-event-rect{border-radius:1px}.--bar-chart svg>g .legend-event-rect:focus-visible{border:4px solid var(--viz-color-neutral-100);outline:2px solid -webkit-focus-ring-color;outline-offset:2px}.--bar-chart svg>g .legend-event-rect:focus:not(:focus-visible){border:0;outline:0;outline-offset:0}.--bar-chart svg>g .--bar-legend-shape{pointer-events:none}.--bar-chart svg>g .--bar .--bar-item.active{outline-offset:0px;outline:2px solid var(--base-text-default)}.--bar-chart svg>g .--bar .--bar-item.keyboard-focus{outline-offset:0px;outline:2px solid var(--data-viz-categorical-1-focus, #3B47B2)}.--bar-chart svg>g .--bar .--bar-item.keyboard-focus.click-active{outline-offset:5px;outline:2px solid var(--data-viz-categorical-1-focus, #3B47B2);box-shadow:0 0 10px 0 var(--data-viz-categorical-1-focus, #3B47B2)}.--bar-chart svg>g .--bar .--bar-item.keyboard-focus.click-active>div[class*=viz-bar-item-categorical-]{box-shadow:0 0 0 3px var(--base-text-default);outline:2px solid var(--shadow-colors-control-focus-inner);outline-offset:2px}.--bar-chart svg>g .--bar .--bar-item>div[class*=viz-bar-item-categorical-].active:not(.focus){border:2px solid transparent;background-clip:padding-box;box-sizing:border-box}.--bar-chart svg>g .--bar .--bar-item.keyboard-focus>div[class*=viz-bar-item-categorical-].focus{border:3px solid var(--shadow-colors-control-focus-inner);box-sizing:border-box}.--bar-chart .--bar-label-top{font-size:var(--viz-bar-label-above-font-size);font-weight:var(--viz-bar-label-above-font-weight, 600)}.--bar-chart .--bar-label-right{font-size:var(--viz-bar-label-right-font-size);font-weight:var(--viz-bar-label-right-font-weight, 600)}.--bar-chart .--bar-item-text{font-weight:var(--hbr-font-weight-semibold)!important}.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item>.--bar-label-top,.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item>.--bar-label-right{font-weight:var(--hbr-font-weight-normal, 400)}.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item.hover>.--bar-label-top,.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item.hover>.--bar-label-right,.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item.active>.--bar-label-top,.--bar-chart.--categorical:has(.--bar-label-item.hover,.--bar-label-item.active) .--bar-label-item.active>.--bar-label-right{font-weight:var(--hbr-font-weight-bold)}.--bar-chart.--categorical:has(.--bar-item.active,.--bar-item>div[class*=viz-bar-item-categorical-].hover,.--bar-item>div[class*=viz-bar-item-categorical-].active) .--bar-item-text{font-weight:var(--hbr-font-weight-normal, 400)!important}.--bar-chart.--categorical:has(.--bar-item.active,.--bar-item>div[class*=viz-bar-item-categorical-].hover,.--bar-item>div[class*=viz-bar-item-categorical-].active) .--bar:has(>.--bar-item.active,>.--bar-item>div[class*=viz-bar-item-categorical-].hover,>.--bar-item>div[class*=viz-bar-item-categorical-].active)>.--bar-item-text{font-weight:var(--hbr-font-weight-bold)!important}.--bar-chart.--categorical{--viz-bar-label-background-color:var(--base-bg-weak-default, #fff);--viz-bar-label-background-border-radius:4px}.--bar-horizontal:not(.--categorical) .--bar-label-top{font-weight:var(--viz-bar-label-above-font-weight, 400)}.--bar-horizontal:not(.--categorical) .--bar-label-right{font-weight:var(--viz-bar-label-right-font-weight, 400)}.--bar-horizontal:not(.--categorical) .--bar-item{border-right:1px solid var(--viz-color-neutral-100)}.--bar-vertical:not(.--categorical) .--bar-label-top{font-weight:var(--viz-bar-label-above-font-weight, 400)}.--bar-vertical:not(.--categorical) .--bar-label-right{font-weight:var(--viz-bar-label-right-font-weight, 400)}.--bar-vertical:not(.--categorical) .--bar-item{border-top:1px solid var(--viz-color-neutral-100)}.chart-html-legend{display:flex;flex-wrap:wrap;align-items:flex-start;align-content:flex-start;column-gap:var(--hbr-spacing-lg, 24px);row-gap:var(--hbr-spacing-2xs, 4px);width:100%;box-sizing:border-box;margin-top:var(--hbr-spacing-md, 16px);padding:4px 6px;background-color:transparent;font-family:var(--hbr-font-body, sans-serif);font-size:var(--hbr-font-size-xs, 12px);line-height:18px}.chart-html-legend-item{display:inline-flex;align-items:center;flex:0 0 auto;gap:var(--chart-html-legend-item-gap, 8px);padding:0;border:0;background:transparent;color:var(--chart-html-legend-item-color, var(--base-text-default));font:inherit;font-size:var(--hbr-font-size-xs, 12px);opacity:var(--chart-html-legend-item-opacity, 1);cursor:var(--chart-html-legend-item-cursor, default)}.chart-html-legend-selectable-item{display:inline-flex;align-items:center;gap:var(--chart-html-legend-item-gap, 8px)}.chart-html-legend-symbol{display:block;flex:0 0 var(--chart-html-legend-symbol-size, 16px);width:var(--chart-html-legend-symbol-size, 16px);height:var(--chart-html-legend-symbol-size, 16px);border-radius:2px;background-color:var(--chart-html-legend-symbol-color, transparent)}.chart-html-legend-pattern{position:relative;overflow:hidden}.chart-html-legend-pattern>svg{position:absolute;inset:0;display:block;pointer-events:none}:host{display:flex;flex-direction:column}:host .chart-bar__header{display:flex;align-items:center;justify-content:space-between}:host .chart-bar__header>:nth-child(2){display:flex}:host .chart-bar__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}:host .--bar-chart{flex-grow:1;overflow:hidden;min-width:0;min-height:0}:host .chart-bar__popover{display:flex;justify-content:space-between;gap:var(--hbr-spacing-lg)}:host .chart-bar__popover.chart-bar__popover--categorical{color:var(--base-text-default);padding:5px 6px}:host .chart-bar__popover>div:first-child{display:flex;align-items:center;gap:var(--hbr-spacing-xs)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator{width:16px;height:16px}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern{position:relative;overflow:hidden}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern::before,:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern::after{content:\"\";position:absolute;inset:0;pointer-events:none}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern::before{background:var(--viz-bar-popover-pattern-overlay, transparent);background-position:var(--viz-bar-popover-pattern-overlay-position, 0 0);background-size:var(--viz-bar-popover-pattern-overlay-size, auto);background-color:var(--viz-bar-popover-pattern-color, transparent);mask-image:var(--viz-bar-popover-pattern-mask, none);mask-position:var(--viz-bar-popover-pattern-mask-position, 0 0);mask-repeat:repeat;mask-size:var(--viz-bar-popover-pattern-mask-size, auto);-webkit-mask-image:var(--viz-bar-popover-pattern-mask, none);-webkit-mask-position:var(--viz-bar-popover-pattern-mask-position, 0 0);-webkit-mask-repeat:repeat;-webkit-mask-size:var(--viz-bar-popover-pattern-mask-size, auto)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern::after{background-color:var(--viz-bar-popover-pattern-border-color, transparent);mask-image:var(--viz-bar-popover-pattern-border-mask, none);mask-position:var(--viz-bar-popover-pattern-border-mask-position, 0 0);mask-repeat:repeat;mask-size:var(--viz-bar-popover-pattern-border-mask-size, auto);-webkit-mask-image:var(--viz-bar-popover-pattern-border-mask, none);-webkit-mask-position:var(--viz-bar-popover-pattern-border-mask-position, 0 0);-webkit-mask-repeat:repeat;-webkit-mask-size:var(--viz-bar-popover-pattern-border-mask-size, auto)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-2{--viz-bar-popover-pattern-overlay:repeating-linear-gradient(0deg, var(--viz-color-neutral-100) 0 2px, transparent 2px 6px)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-3{--viz-bar-popover-pattern-overlay:radial-gradient(circle, var(--viz-color-neutral-100) 0 1.6px, transparent 1.6px),\n    radial-gradient(circle, var(--viz-color-neutral-100) 0 1.6px, transparent 1.6px);--viz-bar-popover-pattern-overlay-size:8px 8px, 8px 8px;--viz-bar-popover-pattern-overlay-position:2px 2px, 6px 6px}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-4{--viz-bar-popover-pattern-overlay:repeating-linear-gradient(90deg, var(--viz-color-neutral-100) 0 2px, transparent 2px 6px)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-5{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Crect x='1' y='1' width='3' height='3' fill='black'/%3E%3Crect x='7' y='7' width='3' height='3' fill='black'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:12px 12px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-6{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpath d='M0 4 Q2 0 4 4 T8 4 T12 4 T16 4' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:16px 8px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-7{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 2 L8 5 L5 8 L2 5 Z' fill='none' stroke='black' stroke-width='1.3'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:10px 10px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-8{--viz-bar-popover-pattern-overlay:repeating-linear-gradient(90deg, var(--viz-color-neutral-100) 0 1.5px, transparent 1.5px 6px),\n    repeating-linear-gradient(0deg, var(--viz-color-neutral-100) 0 1.5px, transparent 1.5px 6px)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-9{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath d='M3 0.3 L6 5.7 H0 Z' fill='black'/%3E%3Cpath d='M9 5.7 L6 0.3 H12 Z' fill='black'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:12px 6px;--viz-bar-popover-pattern-border-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath d='M3 0.3 L6 5.7 H0 Z' fill='none' stroke='black' stroke-width='1' stroke-linejoin='round'/%3E%3Cpath d='M9 5.7 L6 0.3 H12 Z' fill='none' stroke='black' stroke-width='1' stroke-linejoin='round'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-border-mask-size:12px 6px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100);--viz-bar-popover-pattern-border-color:var(--data-viz-categorical-9-default)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-10{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='16' viewBox='0 0 8 16'%3E%3Cpath d='M4 0 Q0 2 4 4 T4 8 T4 12 T4 16' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:8px 16px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-11{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='2.6' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:12px 12px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:first-child .chart-bar__popover-indicator.chart-bar__popover-indicator--pattern-12{--viz-bar-popover-pattern-mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 2 V8 M2 5 H8' stroke='black' stroke-width='1.7' stroke-linecap='square'/%3E%3C/svg%3E\");--viz-bar-popover-pattern-mask-size:10px 10px;--viz-bar-popover-pattern-color:var(--viz-color-neutral-100)}:host .chart-bar__popover>div:last-child{font-weight:var(--hbr-font-weight-bold, 700)}:host .chart-bar__popover-rows{display:flex;flex-direction:column;row-gap:var(--hbr-spacing-sm)}:host[categorical] .chart-bar__popover+.chart-bar__popover{margin-top:var(--hbr-spacing-xs)}";
const HbrBarChartStyle0 = styleCss;

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const { getBarBaseConfig, getBarCategoricalConfig, getBarCategoricalColorsFromConfig, postUpdateMergedBarConfig, //for threshold only now
toggleBarIndividualClickingClass, } = Zo;
const isNoDataLegendId = (id) => {
    const normalizedId = String(id).toLowerCase();
    return normalizedId === "no data" || normalizedId === "null";
};
const hasSingleBarNoDataLegend = (config) => {
    var _a, _b, _c;
    return !config.groupMode &&
        ((_b = (_a = config.keys) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 2 &&
        ((_c = config.keys) === null || _c === void 0 ? void 0 : _c.some(isNoDataLegendId));
};
const shouldShowLegendTooltip = (config) => {
    if (config.legendTooltip === false)
        return false;
    if (config.legendTooltip === true ||
        typeof config.legendTooltip === "function") {
        return true;
    }
    return !hasSingleBarNoDataLegend(config) || config.groupMode === "grouped";
};
const normalizeThresholdStatus = (status) => /^[a-z][a-z0-9-]*$/.test(status) ? status : "neutral";
const getThresholdAreaColor = (status) => status === "neutral"
    ? "var(--base-border-medium-default)"
    : `var(--${status}-bg-medium-default)`;
const applyThresholdStatus = (config) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!Array.isArray(config.markers) || config.markers.length === 0) {
        return config;
    }
    const isMultipleThresholds = config.markers.length > 1;
    return Object.assign(Object.assign(Object.assign(Object.assign({}, config), { labelSkipWidth: (_a = config.labelSkipWidth) !== null && _a !== void 0 ? _a : 0 }), (isMultipleThresholds
        ? {
            margin: Object.assign(Object.assign({}, config.margin), { right: Math.max((_c = (_b = config.margin) === null || _b === void 0 ? void 0 : _b.right) !== null && _c !== void 0 ? _c : 0, 30) }),
        }
        : {
            margin: Object.assign(Object.assign({}, config.margin), { bottom: (_e = (_d = config.margin) === null || _d === void 0 ? void 0 : _d.bottom) !== null && _e !== void 0 ? _e : 60, right: (_g = (_f = config.margin) === null || _f === void 0 ? void 0 : _f.right) !== null && _g !== void 0 ? _g : 20 }),
            "marker-legend": Object.assign(Object.assign({}, (config.layout === "horizontal"
                ? { translateX: -55 }
                : { translateX: -35 })), config["marker-legend"]),
        })), { markers: config.markers.map((marker) => {
            var _a, _b, _c, _d;
            const { status } = marker, markerConfig = __rest(marker, ["status"]);
            const resolvedStatus = normalizeThresholdStatus(status !== null && status !== void 0 ? status : "neutral");
            const markerWithAxis = Object.assign(Object.assign({}, markerConfig), { axis: (_a = marker.axis) !== null && _a !== void 0 ? _a : (config.layout === "horizontal" ? "x" : "y"), annotation: (_b = marker.annotation) !== null && _b !== void 0 ? _b : (resolvedStatus === "neutral"
                    ? undefined
                    : {
                        content: react.exports.createElement("hbr-icon", {
                            name: `status-${resolvedStatus}`,
                            sentiment: resolvedStatus,
                            style: { fontSize: "16px" },
                        }),
                        position: "end",
                        offsetX: 4,
                        width: 16,
                        height: 16,
                    }) });
            const areaColor = getThresholdAreaColor(resolvedStatus);
            if (isMultipleThresholds) {
                const markerWithoutAreaStyle = Object.assign({}, markerWithAxis);
                markerWithoutAreaStyle.areaStyle = undefined;
                return Object.assign(Object.assign({}, markerWithoutAreaStyle), { enableArea: false, lineStyle: Object.assign({ stroke: resolvedStatus === "neutral"
                            ? "var(--base-border-strong-default)"
                            : `var(--${resolvedStatus}-border-default, var(--base-border-strong-default))`, strokeWidth: 3, strokeDasharray: "3, 3, 3, 3" }, marker.lineStyle) });
            }
            return Object.assign(Object.assign({}, markerWithAxis), { annotation: marker.annotation, enableArea: true, lineStyle: Object.assign({ stroke: "var(--base-border-strong-default)", strokeWidth: 3, strokeDasharray: "3, 3, 3, 3" }, marker.lineStyle), areaStyle: Object.assign(Object.assign({ background: "#fff" }, marker.areaStyle), { color: (_d = (_c = marker.areaStyle) === null || _c === void 0 ? void 0 : _c.color) !== null && _d !== void 0 ? _d : areaColor }) });
        }) });
};
const BAR_AXIS_PLACEMENTS = {
    axisTop: "top",
    axisRight: "right",
    axisBottom: "bottom",
    axisLeft: "left",
};
const HbrBarChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrBarChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.warnedAboutNivoTooltip = false;
        this.selectedSelectableLegendIds = null;
        this.lastBoardHorizontalMargin = null;
        this.onSelectableLegendChange = (selectedIds) => {
            var _a;
            const keys = ((_a = this.config.keys) !== null && _a !== void 0 ? _a : []).map(String);
            const selected = new Set(selectedIds.map(String).filter((id) => keys.includes(id)));
            this.selectedSelectableLegendIds =
                selected.size === 0 || keys.every((key) => selected.has(key))
                    ? null
                    : selected;
            void this.renderChart();
        };
        this.renderChart = async () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const selection = this.selectedSelectableLegendIds;
            const configuredLegends = this.config.legends;
            const firstLegend = configuredLegends === null || configuredLegends === void 0 ? void 0 : configuredLegends[0];
            const configuredLegendData = firstLegend === null || firstLegend === void 0 ? void 0 : firstLegend.data;
            const selectableLegendColors = Array.isArray(this.config.colors)
                ? this.config.colors
                : getBarCategoricalColorsFromConfig({ keys: this.config.keys }, false);
            const selectableLegendData = Array.isArray(configuredLegendData) && configuredLegendData.length > 0
                ? configuredLegendData.map((item, index) => {
                    var _a;
                    if (!item || typeof item !== "object")
                        return item;
                    const datum = item;
                    if (datum.color != null)
                        return datum;
                    const keyIndex = ((_a = this.config.keys) !== null && _a !== void 0 ? _a : []).findIndex((key) => String(key) === String(datum.id));
                    return Object.assign(Object.assign({}, datum), { color: selectableLegendColors[keyIndex === -1 ? index : keyIndex] });
                })
                : ((_a = this.config.keys) !== null && _a !== void 0 ? _a : []).map((id, index) => ({
                    id,
                    label: String(id),
                    color: selectableLegendColors[index],
                }));
            const selectableColors = selectableLegendData.map((item, index) => item && typeof item === "object" && "color" in item
                ? String(item.color)
                : selectableLegendColors[index]);
            const configWithSelection = this.config.selectableLegend
                ? Object.assign(Object.assign(Object.assign({}, this.config), { animate: (_b = this.config.animate) !== null && _b !== void 0 ? _b : false, legendLayout: "html", colors: selectableColors, legends: [
                        Object.assign(Object.assign({}, firstLegend), { data: selectableLegendData }),
                        ...((_c = configuredLegends === null || configuredLegends === void 0 ? void 0 : configuredLegends.slice(1)) !== null && _c !== void 0 ? _c : []),
                    ] }), (selection
                    ? {
                        data: ((_d = this.config.data) !== null && _d !== void 0 ? _d : []).map((datum) => {
                            var _a;
                            const filteredDatum = Object.assign({}, datum);
                            for (const key of (_a = this.config.keys) !== null && _a !== void 0 ? _a : []) {
                                if (!selection.has(String(key))) {
                                    filteredDatum[key] = null;
                                }
                            }
                            return filteredDatum;
                        }),
                    }
                    : {})) : this.config;
            const configWithNivoTooltip = configWithSelection;
            if (!this.warnedAboutNivoTooltip &&
                configWithNivoTooltip.tooltip !== undefined) {
                console.warn("hbr-bar-chart: config.tooltip is not supported. Use itemTooltip or legendTooltip instead.");
                this.warnedAboutNivoTooltip = true;
            }
            const publicConfig = applyThresholdStatus(omitChartConfigKeys(configWithNivoTooltip, ["tooltip", "threshold"]));
            const getConfig = this.categorical
                ? getBarCategoricalConfig
                : getBarBaseConfig;
            const getAxisConfig = (axis) => (publicConfig[axis] || {});
            const getAxisTooltip = (axisConfig) => axisConfig.tooltip === true ? undefined : axisConfig.tooltip;
            const getAxisWithTooltip = (axis) => {
                const axisConfig = getAxisConfig(axis);
                const tooltip = getAxisTooltip(axisConfig);
                const tooltipEnabled = !!axisConfig.tooltip;
                return Object.assign(Object.assign({}, (publicConfig[axis] || {})), { onClick: (data, event, tick) => {
                        var _a;
                        (_a = axisConfig.onClick) === null || _a === void 0 ? void 0 : _a.call(axisConfig, data, event, tick);
                    }, onMouseEnter: (data, event, tick) => {
                        var _a;
                        if (tooltipEnabled) {
                            this.applyPopoverOptions(BAR_AXIS_PLACEMENTS[axis], axisConfig.popoverOptions);
                            showBarAxisPopover(data, event, this.tooltipRef, tooltip, this.categorical, publicConfig);
                        }
                        (_a = axisConfig.onMouseEnter) === null || _a === void 0 ? void 0 : _a.call(axisConfig, data, event, tick);
                    }, onMouseLeave: (data, event, tick) => {
                        var _a;
                        if (tooltipEnabled &&
                            !this.isPopoverSelfManaged(axisConfig.popoverOptions)) {
                            hideBarPopover(this.tooltipRef);
                        }
                        (_a = axisConfig.onMouseLeave) === null || _a === void 0 ? void 0 : _a.call(axisConfig, data, event, tick);
                    }, onMouseMove: (data, event, tick) => {
                        var _a;
                        if (tooltipEnabled) {
                            this.applyPopoverOptions(BAR_AXIS_PLACEMENTS[axis], axisConfig.popoverOptions);
                            showBarAxisPopover(data, event, this.tooltipRef, tooltip, this.categorical, publicConfig);
                        }
                        (_a = axisConfig.onMouseMove) === null || _a === void 0 ? void 0 : _a.call(axisConfig, data, event, tick);
                    } });
            };
            // Elements owns tooltip policy; pass the result down so chart-config can
            // enable the no-data legend's event and keyboard targets before rendering.
            const interactiveNoDataLegend = this.categorical && shouldShowLegendTooltip(publicConfig);
            const config = this.categorical
                ? Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, publicConfig), { interactiveNoDataLegend }), (publicConfig.axisTop
                    ? { axisTop: getAxisWithTooltip("axisTop") }
                    : {})), (publicConfig.axisRight
                    ? { axisRight: getAxisWithTooltip("axisRight") }
                    : {})), { axisBottom: getAxisWithTooltip("axisBottom"), axisLeft: getAxisWithTooltip("axisLeft") }) : publicConfig;
            const legendPopoverOptions = this.getLegendPopoverOptions();
            const markerLegendPopoverOptions = this.getMarkerLegendPopoverOptions();
            const shouldDisplayLegendTooltip = (id) => {
                if (publicConfig.legendTooltip === false)
                    return false;
                // No-data entries use the categorical policy; regular entries use the global setting.
                if (!isNoDataLegendId(id))
                    return true;
                return this.categorical && interactiveNoDataLegend;
            };
            const baseConfig = getConfig(config, {
                itemsEventHandlers: {
                    onMouseEnter: (datum, event) => {
                        this.applyPopoverOptions();
                        toggleBarItemPopover(this.tooltipRef, event, datum, publicConfig.itemTooltip, this.categorical, publicConfig);
                    },
                    onMouseLeave: () => {
                        if (!this.isPopoverSelfManaged()) {
                            toggleBarItemPopover(this.tooltipRef);
                        }
                    },
                    onFocus: (datum, event) => {
                        this.applyPopoverOptions();
                        toggleBarItemPopover(this.tooltipRef, event, datum, publicConfig.itemTooltip, this.categorical, publicConfig);
                    },
                    onBlur: () => toggleBarItemPopover(this.tooltipRef),
                    onClick: (datum, event) => {
                        this.applyPopoverOptions();
                        toggleBarItemPopover(this.tooltipRef, event, datum, publicConfig.itemTooltip, this.categorical, publicConfig);
                    },
                },
                legendsEventHandlers: {
                    onMouseEnter: (data, event) => {
                        if ("markerValue" in data) {
                            this.applyPopoverOptions("top", markerLegendPopoverOptions);
                            toggleBarMarkerLegendPopover(this.tooltipRef, event, data, publicConfig.legendTooltip);
                            return;
                        }
                        if (shouldDisplayLegendTooltip(data.id)) {
                            this.applyPopoverOptions("top", legendPopoverOptions);
                            toggleBarLegendPopover(this.tooltipRef, event, data.id, data.color, publicConfig, this.categorical);
                        }
                    },
                    onMouseMove: (data, event) => {
                        if ("markerValue" in data) {
                            this.applyPopoverOptions("top", markerLegendPopoverOptions);
                            toggleBarMarkerLegendPopover(this.tooltipRef, event, data, publicConfig.legendTooltip);
                        }
                    },
                    onMouseLeave: (data) => {
                        const popoverOptions = "markerValue" in data
                            ? markerLegendPopoverOptions
                            : legendPopoverOptions;
                        if (!this.isPopoverSelfManaged(popoverOptions)) {
                            "markerValue" in data
                                ? toggleBarMarkerLegendPopover(this.tooltipRef)
                                : toggleBarLegendPopover(this.tooltipRef);
                        }
                    },
                    onFocus: (data, event) => {
                        if ("markerValue" in data) {
                            this.applyPopoverOptions("top", markerLegendPopoverOptions);
                            toggleBarMarkerLegendPopover(this.tooltipRef, event, data, publicConfig.legendTooltip);
                            return;
                        }
                        if (shouldDisplayLegendTooltip(data.id)) {
                            this.applyPopoverOptions("top", legendPopoverOptions);
                            toggleBarLegendPopover(this.tooltipRef, event, data.id, data.color, publicConfig, this.categorical);
                        }
                    },
                    onBlur: (data) => "markerValue" in data
                        ? toggleBarMarkerLegendPopover(this.tooltipRef)
                        : toggleBarLegendPopover(this.tooltipRef),
                    onClick: (data, event) => {
                        if ("markerValue" in data) {
                            this.applyPopoverOptions("top", markerLegendPopoverOptions);
                            toggleBarMarkerLegendPopover(this.tooltipRef, event, data, publicConfig.legendTooltip);
                            return;
                        }
                        if (shouldDisplayLegendTooltip(data.id)) {
                            this.applyPopoverOptions("top", legendPopoverOptions);
                            toggleBarLegendPopover(this.tooltipRef, event, data.id, data.color, publicConfig, this.categorical);
                        }
                    },
                },
            });
            const existingEventHandlers = {
                onMouseEnter: baseConfig.onMouseEnter,
                onMouseLeave: baseConfig.onMouseLeave,
                onClick: baseConfig.onClick,
                onblur: baseConfig.onBlur,
                onFocus: baseConfig.onFocus,
            };
            let fullConfig = cjs(baseConfig, publicConfig, {
                arrayMerge: (_destinationArray, sourceArray) => sourceArray,
                customMerge: (key) => {
                    // Keep generated patterns while allowing consumer definitions to override an ID.
                    if (key === "defs") {
                        return (defaults, overrides) => {
                            const overriddenIds = new Set(overrides.map(({ id }) => id));
                            return [
                                ...defaults.filter(({ id }) => !overriddenIds.has(id)),
                                ...overrides,
                            ];
                        };
                    }
                    if (key === "fill") {
                        // Consumer rules win; built-in no-data and accessibility rules remain fallbacks.
                        return (defaults, overrides) => [
                            ...overrides,
                            ...defaults,
                        ];
                    }
                    if (key === "legends") {
                        return (a, b) => {
                            const ret = a.length > b.length
                                ? a.map((r, i) => (Object.assign(Object.assign({}, r), b[i])))
                                : b.map((r, i) => (Object.assign(Object.assign({}, a[i]), r)));
                            return ret;
                        };
                    }
                },
            });
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            // base config adds theme as default
            // but theme may not cover every detail such as threshold line color
            // adding threshold default color/width if threshold is present
            fullConfig = postUpdateMergedBarConfig(fullConfig);
            fullConfig = omitChartConfigKeys(fullConfig, [
                "tooltip",
            ]);
            const valueScale = fullConfig.valueScale;
            if (this.categorical &&
                (valueScale === null || valueScale === void 0 ? void 0 : valueScale.max) === "auto" &&
                typeof fullConfig.maxValue === "number") {
                // Use the generated axis maximum so clamped grid ticks stay on distinct lines.
                fullConfig = Object.assign(Object.assign({}, fullConfig), { valueScale: Object.assign(Object.assign({}, valueScale), { max: fullConfig.maxValue }) });
            }
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement, Zo);
            }
            if (this.categorical &&
                fullConfig.groupMode !== "grouped" &&
                fullConfig.barComponent === baseConfig.barComponent) {
                // Keep the scale geometry intact; the renderer spaces only shared edges.
                const barComponent = fullConfig.barComponent;
                const stackedInnerPadding = (_e = fullConfig.innerPadding) !== null && _e !== void 0 ? _e : 0;
                fullConfig = Object.assign(Object.assign({}, fullConfig), { innerPadding: 0, barComponent: (props) => {
                        const rendererProps = Object.assign(Object.assign({}, props), { stackedInnerPadding });
                        return react.exports.createElement(barComponent, rendererProps);
                    } });
            }
            fullConfig = Object.assign(Object.assign({}, fullConfig), { tooltip: (_f = fullConfig.tooltip) !== null && _f !== void 0 ? _f : noopChartTooltip });
            if (!this.contextRoot) {
                this.contextRoot = createRoot(this.chartRef);
            }
            this.contextRoot.render(react.exports.createElement(Me, fullConfig, null));
            if (this.boardRef.setChartConfig) {
                const margin = fullConfig.margin;
                const horizontalMargin = `${(_g = margin === null || margin === void 0 ? void 0 : margin.left) !== null && _g !== void 0 ? _g : 0}:${(_h = margin === null || margin === void 0 ? void 0 : margin.right) !== null && _h !== void 0 ? _h : 0}`;
                if (horizontalMargin !== this.lastBoardHorizontalMargin) {
                    this.lastBoardHorizontalMargin = horizontalMargin;
                    this.boardRef.setChartConfig(fullConfig);
                }
            }
            if (this.categorical) {
                const shouldRenderHtmlLegend = this.config.selectableLegend === true ||
                    (this.config.legendLayout === "html" &&
                        (((_k = (_j = this.config.legends) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0) > 0 ||
                            this.config.legends === undefined));
                if (shouldRenderHtmlLegend) {
                    const { renderDonutHtmlLegend } = await import('./html-legend.js');
                    renderDonutHtmlLegend(this.boardRef, Object.assign(Object.assign({}, fullConfig), { legendLayout: "html" }), "bar", this.config.selectableLegend
                        ? {
                            selectedIds: (_l = this.selectedSelectableLegendIds) !== null && _l !== void 0 ? _l : undefined,
                            onSelectionChange: this.onSelectableLegendChange,
                        }
                        : undefined);
                }
                else {
                    (_m = this.boardRef.querySelector(".chart-html-legend")) === null || _m === void 0 ? void 0 : _m.remove();
                }
            }
        };
        this.config = {
            data: [],
        };
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
        this.categorical = false;
        this.modifyHbrConfig = undefined;
        this.popoverOptions = undefined;
    }
    /** Public method for download data, use customFunc to create your own way to download data, such as pdf */
    async download(filename = "Export.csv", customFunc) {
        if (customFunc) {
            customFunc(this.config.data);
        }
        else {
            browserDownloadCsv(convertBarDataToCSV(this.config.data), filename);
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
    getMarkerLegendPopoverOptions() {
        var _a;
        return (_a = this.config["marker-legend"]) === null || _a === void 0 ? void 0 : _a.popoverOptions;
    }
    getPopoverOptions(placement = "top", override) {
        return resolveChartPopoverOptions({
            distance: this.categorical ? 4 : 10,
            variant: "chart",
            placement,
        }, this.popoverOptions, this.categorical, override);
    }
    applyPopoverOptions(placement = "top", override) {
        applyChartPopoverOptions(this.tooltipRef, this.getPopoverOptions(placement, override));
    }
    isPopoverSelfManaged(override) {
        return isChartPopoverSelfManaged(this.categorical, this.popoverOptions, override);
    }
    componentDidLoad() {
        this.renderChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentShouldUpdate() {
        return this.renderChart();
    }
    handleOutsideClick(event) {
        var _a;
        if ((_a = this.config.isInteractive) !== null && _a !== void 0 ? _a : true) {
            toggleBarIndividualClickingClass(event, false);
        }
    }
    render() {
        var _a, _b, _c;
        const layout = this.config.layout ? this.config.layout : "vertical";
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const popoverOptions = resolveChartPopoverOptions({
            distance: this.categorical ? 4 : 10,
            variant: "chart",
        }, this.popoverOptions, this.categorical);
        return (h(Host, { key: 'f95e4aa4eb94b46f0b2e156248dc770aa3957629' }, !((_a = this.config.data) === null || _a === void 0 ? void 0 : _a.length) && this.categorical && (h("div", { slot: "header", part: "header", class: "chart-bar__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("hbr-chart-board", { key: 'da720a4fd16cbf5b65d295f951ea8e5e463e1689', type: this.categorical ? "categorical" : "bar", ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: !((_b = this.config.data) === null || _b === void 0 ? void 0 : _b.length), style: {
                width: this.width,
                height: this.height,
            }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: 'b8951c11ccce7e05a54985756c3e26a19dd4ba93' }, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: 'd8e5ee46eea6238e1cb90a4e62146b7eccad7359', slot: "content" })), (((_c = this.config.data) === null || _c === void 0 ? void 0 : _c.length) || !this.categorical) && (h("div", { slot: "header", part: "header", class: "chart-bar__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" }))))), h("div", { key: 'fb6f67eab8d417626b9b2491d8d4863d26feb778', ref: (el) => {
                this.chartRef = el;
            }, class: `--hbr-chart --bar-chart --bar-${layout} ${this.categorical ? "--categorical" : ""}`, part: "chart" }), h("slot", { key: '4814359c31ca676ee7e1a4d3eec705b7fde12ed4', slot: "footer", name: "footer" }), h("slot", { key: '43719137c130f28518e3636321eff2ed6c69e195', slot: "loading-state", name: "loading-state" }), h("slot", { key: '952a78c568d7b0b92dbc3754dda39f1be9227bba', slot: "empty-state", name: "empty-state" }))));
    }
    get el() { return this; }
    static get style() { return HbrBarChartStyle0; }
}, [1, "hbr-bar-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
        "categorical": [516],
        "modifyHbrConfig": [16],
        "popoverOptions": [16],
        "download": [64],
        "getPopoverRef": [64]
    }, [[1, "click", "handleOutsideClick"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-bar-chart", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-bar-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrBarChart$1);
            }
            break;
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-illustration":
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

const HbrBarChart = HbrBarChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrBarChart, defineCustomElement };

