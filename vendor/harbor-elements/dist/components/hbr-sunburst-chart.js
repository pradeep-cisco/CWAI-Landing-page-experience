import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { K } from './harbor-charts-sunburst.es.js';
import { r as react, c as createRoot } from './client.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { s as showChartPopover, h as hideChartPopover, b as browserDownloadCsv, d as defineCustomElement$7 } from './board.js';
import { k, o as omitChartConfigKeys, n as noopChartTooltip, i as isChartPopoverSelfManaged, r as resolveChartPopoverOptions } from './popover-options.js';
import { d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$5 } from './illustration.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';

var e=()=>["var(--accent-a-default, #7D8AFF)","var(--accent-b-default, #B02863)","var(--accent-c-default, #F2638C)","var(--accent-d-default, #753BCC)","var(--accent-e-default, #6BA32A)","var(--accent-f-default, #AD3907)","var(--accent-g-default, #04A4B0)","var(--accent-h-default, #006773)","var(--accent-i-default, #E85FC6)","var(--accent-j-default, #545C8A)"],a=()=>k();var i={top:40,right:60,bottom:90,left:60};function t({itemsEventHandlers:o}){return {id:"name",value:"value",margin:i,cornerRadius:1,enableArcLabels:!0,tooltip:()=>"",labelTextColor:"var(--base-text-default)",parentLabelTextColor:"var(--base-text-default)",onMouseEnter:o==null?void 0:o.onMouseEnter,onMouseMove:o==null?void 0:o.onMouseMove,onMouseLeave:o==null?void 0:o.onMouseLeave,onFocus:o==null?void 0:o.onFocus,onBlur:o==null?void 0:o.onBlur,onClick:o==null?void 0:o.onClick,onKeyDown:o==null?void 0:o.onKeyDown,onKeyUp:o==null?void 0:o.onKeyUp,colors:e(),theme:{fontSize:"var(--hbr-font-size-2xs)",fontFamily:"var(--hbr-font-body)",textColor:"var(--base-text-default)",legends:{text:{fill:"var(--base-text-default)"}},axis:{text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--hbr-font-size-2xs)"}}}}}}var c={top:40,right:60,bottom:90,left:60};function r({itemsEventHandlers:o}){return {id:"name",value:"value",margin:c,cornerRadius:1,enableArcLabels:!0,tooltip:()=>"",labelTextColor:"var(--base-text-default)",parentLabelTextColor:"var(--base-text-default)",onMouseEnter:o==null?void 0:o.onMouseEnter,onMouseMove:o==null?void 0:o.onMouseMove,onMouseLeave:o==null?void 0:o.onMouseLeave,onFocus:o==null?void 0:o.onFocus,onBlur:o==null?void 0:o.onBlur,onClick:o==null?void 0:o.onClick,onKeyDown:o==null?void 0:o.onKeyDown,onKeyUp:o==null?void 0:o.onKeyUp,colors:a(),theme:{fontSize:"var(--hbr-font-size-2xs)",fontFamily:"var(--hbr-font-body)",textColor:"var(--base-text-default)",legends:{text:{fill:"var(--base-text-default)"}},axis:{text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--hbr-font-size-2xs)"}}}}}}var p={getColors:e,getCategoricalColor:a,getSunburstBaseConfig:t,getSunburstCategoricalConfig:r};

const generateSunburstTooltip = (datum, config) => {
    return typeof (config === null || config === void 0 ? void 0 : config.itemTooltip) === "function"
        ? config.itemTooltip(datum)
        : `<div class="--hbr-sunburst-popover-entity">
    <svg class="--hbr-sunburst-popover-color" style="background:${datum.color}; opacity: ${datum.opacity}"></svg>
    ${datum.id} : ${datum.value}</div>`;
};
const showSunburstTooltip = (data, event, tooltipRef, config) => {
    showChartPopover(tooltipRef, data, event, config === null || config === void 0 ? void 0 : config.itemTooltip, () => generateSunburstTooltip(data, config));
};
const hideSunburstTooltip = (tooltipRef) => {
    hideChartPopover(tooltipRef);
};

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}.--sunburst-chart.non-interactive svg{pointer-events:none}.--sunburst-chart.non-focusable path[datum-id]:focus{outline:none}:host .--sunburst-chart{width:100%;height:100%}:host .--hbr-sunburst-popover-entity{display:flex;align-items:center}:host .--hbr-sunburst-popover-entity tr{display:flex;align-items:center;justify-items:center}:host .--hbr-sunburst-popover-entity tr td{display:flex;align-items:center;justify-items:flex-start;min-width:48px}:host .--hbr-sunburst-popover-entity tr{gap:var(--hbr-spacing-sm)}:host .--hbr-sunburst-popover-entity .--hbr-sunburst-popover-color{width:12px;height:12px;margin-right:var(--hbr-spacing-2xs)}:host .--hbr-sunburst-popover-entity .--hbr-sunburst-popover-value{font-weight:var(--hbr-font-weight-semibold, 600)}:host .chart-sunburst__header{display:flex;align-items:center;justify-content:space-between}:host .chart-sunburst__header>:nth-child(2){display:flex}:host .chart-sunburst__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}";
const HbrSunburstChartStyle0 = styleCss;

const { getSunburstBaseConfig } = p;
const HbrSunburstChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrSunburstChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.warnedAboutNivoTooltip = false;
        this.renderChart = async () => {
            var _a;
            const configWithNivoTooltip = this.config;
            if (!this.warnedAboutNivoTooltip &&
                configWithNivoTooltip.tooltip !== undefined) {
                console.warn("hbr-sunburst-chart: config.tooltip is not supported. Use itemTooltip instead.");
                this.warnedAboutNivoTooltip = true;
            }
            const publicConfig = omitChartConfigKeys(configWithNivoTooltip, [
                "tooltip",
            ]);
            const baseConfig = getSunburstBaseConfig({
                itemsEventHandlers: {
                    onFocus: (data, event) => {
                        var _a, _b;
                        showSunburstTooltip(data, event, this.tooltipRef, publicConfig);
                        (_b = (_a = this.config).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onBlur: (data, event) => {
                        var _a, _b;
                        hideSunburstTooltip(this.tooltipRef);
                        (_b = (_a = this.config).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onClick: (data, event) => {
                        var _a, _b;
                        (_b = (_a = this.config).onClick) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onMouseEnter: (data, event) => {
                        var _a, _b;
                        showSunburstTooltip(data, event, this.tooltipRef, publicConfig);
                        (_b = (_a = this.config).onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onMouseLeave: (data, event) => {
                        var _a, _b;
                        if (!this.isPopoverSelfManaged()) {
                            hideSunburstTooltip(this.tooltipRef);
                        }
                        (_b = (_a = this.config).onMouseLeave) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
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
                customMerge: (key) => {
                    if (key === "colors") {
                        return (_defaultColors, configuredColors) => configuredColors;
                    }
                },
            });
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            fullConfig = omitChartConfigKeys(fullConfig, [
                "tooltip",
            ]);
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement, p);
            }
            fullConfig = Object.assign(Object.assign({}, fullConfig), { tooltip: (_a = fullConfig.tooltip) !== null && _a !== void 0 ? _a : noopChartTooltip });
            if (!this.chartRef.innerHTML.length) {
                const newRoot = createRoot(this.chartRef);
                newRoot.render(react.exports.createElement(K, fullConfig, null));
                this.contextRoot = newRoot;
            }
            else {
                this.contextRoot.render(react.exports.createElement(K, fullConfig, null));
            }
            if (this.boardRef.setChartConfig) {
                this.boardRef.setChartConfig(fullConfig);
            }
        };
        this.config = undefined;
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
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
            browserDownloadCsv(this.convertToCSV(), filename);
        }
    }
    /** Public method to get popover reference, client can use this to control magnetic UX popover externally */
    async getPopoverRef() {
        return this.tooltipRef;
    }
    isPopoverSelfManaged() {
        return isChartPopoverSelfManaged(true, this.popoverOptions);
    }
    componentDidLoad() {
        this.renderChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentShouldUpdate() {
        return this.renderChart();
    }
    convertToCSV() {
        // no default way of converting to csv for multiple levels
        return "";
    }
    render() {
        var _a, _b;
        const { config } = this;
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const popoverOptions = resolveChartPopoverOptions({ distance: 10, variant: "chart" }, this.popoverOptions, true);
        return (h(Host, { key: '0e469e5f3408d2591c3dea55028bcc989473240d' }, h("hbr-chart-board", { key: '2d54f52ec5c54aeeace47ee682f0abd8f9e22ab4', ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: Object.keys(config.data).length === 0, style: { width: this.width, height: this.height }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: 'a0ca9dd7ab707807f31d2313fe79eb744884359d' }, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: '47b12c30c890eb9bbe049c44a83d584c2631bc60', slot: "content" })), h("div", { key: 'c9c802adafed410c780685b37170e65a6fcceb4f', slot: "header", part: "header", class: "chart-sunburst__header" }, h("slot", { key: '5c6e600cea501ac4498474d07d3b7544549a9579', name: "header" }, h("div", { key: '00487ba20dc1b0349e3aa7d501e9586a4dc40c1a' }, h("slot", { key: 'd6580fb3818edd0f465e3e989e5d22961f50f22d', name: "header-title" })), h("div", { key: 'b4d2de8ff7864a10018eb033e3f6d20c1090f4fc' }, h("slot", { key: '0dde1fc2f46233dfdae3243ce3eccfb1321bdfa0', name: "header-action" })))), h("div", { key: '452b89d55775d653da31dc7bdf3a95bd1cddcdf2', ref: (el) => {
                this.chartRef = el;
            }, class: `--hbr-sunburst --sunburst-chart ${((_a = this.config) === null || _a === void 0 ? void 0 : _a.isInteractive) === false ? "non-interactive" : ""} ${((_b = this.config) === null || _b === void 0 ? void 0 : _b.isFocusable) === false ? "non-focusable" : ""}
            `, part: "chart" }), h("slot", { key: '76abe826b43714fa0ca753ed689e7e8ae99097c6', name: "footer" }), h("slot", { key: '6b5338a7154090516bb7433122303ba4857a1bd8', slot: "loading-state", name: "loading-state" }), h("slot", { key: '07b6b0696a6e88da95f80eb0d3d239ed58e89f61', slot: "empty-state", name: "empty-state" }))));
    }
    get el() { return this; }
    static get style() { return HbrSunburstChartStyle0; }
}, [1, "hbr-sunburst-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
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
    const components = ["hbr-sunburst-chart", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sunburst-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrSunburstChart$1);
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

const HbrSunburstChart = HbrSunburstChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrSunburstChart, defineCustomElement };

