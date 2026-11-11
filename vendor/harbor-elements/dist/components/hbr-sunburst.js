import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { g as getSize, s as setMargin, c as clickEvents, a as addClassesOnLayers, b as configSetup, d as setSize } from './setSize.js';
import { c as createRoot, R as React } from './client.js';
import { c as cjs } from './cjs.js';
import { K } from './harbor-charts-sunburst.es.js';
import { g as getBaseConfig } from './baseConfig.js';
import { g as getColors } from './getColors.js';
import { c as combineMergeArray } from './combineMergeArray.js';

function getsunburstBaseConfig(config, size) {
    var _a;
    const legendRight = config.legends && ((_a = config.legends[0]) === null || _a === void 0 ? void 0 : _a.anchor) === "right";
    const _legends = legendRight
        ? "right"
        : config.legends === undefined || config.legends.length
            ? "bottom"
            : undefined;
    const _margin = setMargin(size, _legends, config.enableArcLinkLabels);
    const sunburstConfig = {
        /** need to work on this for size && legend position */
        margin: _margin,
        innerRadius: 0.66,
        padAngle: 0.7,
        borderColor: "var(--hbr-color-neutral-bg)",
        colors: config.colors || getColors(config.data.length),
        radialLabelsTextColor: "var(--hbr-color-neutral-text)",
        radialLabelsLinkColor: { from: "color" },
        /** enableArcLabels: UX default - false. we need  enbale this to figure out which ones to show the path
         * if enableArcLinkLabels is true. then hide the ArcLabels after. arcLinkLabel()
         */
        enableArcLabels: config.enableArcLinkLabels ? true : false,
        enableArcLinkLabels: false, // UX default
        arcLabelsSkipAngle: 12,
        arcLabelsTextColor: "var(--hbr-color-100)",
        arcLinkLabelsTextOffset: 6, //distance btw arclink line & label text
        arcLinkLabelsStraightLength: 6, //bended line
        arcLinkLabelsDiagonalLength: 12, //donut to bended?
        // arcLinkLabel: d => `${d.value}%`,
        // arcLabelsSkipAngle: 10, //too small to show the label on it
        // arcLinkLabelsSkipAngle: -21,
        // activeOuterRadiusOffset: 10, //hovered slice gets expands
        arcLinkLabelsTextColor: "var(--hbr-color-neutral-text)",
        theme: {
            fontSize: "var(--hbr-font-size-2xs)",
            fontFamily: "var(--hbr-font-body)",
            textColor: "var(--hbr-color-neutral-text)",
        },
        // @ts-ignore
        onMouseEnter: (props, evt) => {
            const { target } = evt;
            const parent = target.parentElement;
            Array.from(parent.children).forEach((path) => {
                if (path !== target) {
                    path.classList.add("--sunburst--dehighlight");
                }
                else {
                    path.classList.remove("--sunburst--dehighlight");
                }
            });
            if (config.onMouseEnter) {
                config.onMouseEnter(props, evt);
            }
        },
        // @ts-ignore
        onMouseLeave: (props, evt) => {
            const { target } = evt;
            const parent = target.parentElement;
            Array.from(parent.children).forEach((path) => path.classList.remove("--sunburst--dehighlight"));
            if (config.onMouseLeave) {
                config.onMouseLeave(props, evt);
            }
        },
        // @ts-ignore
        onClick: (props, evt) => {
            const { target } = evt;
            const parent = target.parentElement;
            Array.from(parent.children).forEach((path) => {
                if (path === target) {
                    path.classList.remove("--sunburst--not--selected");
                    path.classList.add("--sunburst--selected");
                }
                else {
                    path.classList.remove("--sunburst--selected");
                    path.classList.add("--sunburst--not--selected");
                }
            });
            if (config.onClick) {
                config.onClick(props, evt);
            }
        },
    };
    return sunburstConfig;
}
function renderSunburstChart({ el, config }) {
    const size = getSize(el.className);
    const _config = cjs.all([getBaseConfig(), getsunburstBaseConfig(config, size), config], {
        arrayMerge: combineMergeArray,
    });
    const root = createRoot(el);
    root.render(React.createElement(K, _config, null));
}

const sunburstCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}div.--sunburst-chart path.--sunburst--dehighlight{opacity:0.5}div.--sunburst-chart path.--sunburst--selected{opacity:1}div.--sunburst-chart path.--sunburst--not--selected{opacity:0.25}div.--sunburst-chart path.--sunburst--not--selected:hover{opacity:1}div.--sunburst-chart svg+div>div>div>span{border-radius:var(--hbr-border-radius-circle);margin-right:var(--hbr-spacing-xs)}";
const HbrSunburstStyle0 = sunburstCss;

const Hbrsunburst = /*@__PURE__*/ proxyCustomElement(class Hbrsunburst extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sunburst = true;
        this.noLegendFn = (layers, legends) => (!layers || !layers.includes("legends")) && (!legends || !legends.length);
        this.config = undefined;
        this.size = undefined;
        this.width = "100%";
        this.height = "360px";
        this.radialLabel = undefined;
        this.legendTooltip = true;
    }
    handleClick(evt) {
        var _a;
        const path = evt.path || ((_a = evt.composedPath) === null || _a === void 0 ? void 0 : _a.call(evt));
        if (path === null || path === void 0 ? void 0 : path.length) {
            clickEvents.call(this, path);
        }
    }
    componentDidLoad() {
        this.createChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
        setTimeout(() => {
            addClassesOnLayers.call(this, "sunburst");
        }, 100);
    }
    componentShouldUpdate() {
        return this.createChart();
    }
    createChart() {
        const { config, size } = this;
        configSetup.call(this, size, config);
        renderSunburstChart({
            el: this.sunburstChart,
            config,
        });
    }
    /** enableRadialLabels --
     * nivo provide this as boolean but hbr wants only enable for the items with low value not all the items */
    render() {
        var _a;
        const { config, size } = this;
        const { legends, endAngle, startAngle } = config;
        this.rightLegend = ((_a = legends === null || legends === void 0 ? void 0 : legends[0]) === null || _a === void 0 ? void 0 : _a.anchor) && legends[0].anchor === "right";
        this.partialLimited = endAngle === 90 && Math.abs(startAngle) === endAngle;
        if (size) {
            const { width, height } = setSize.call(this, size, config);
            this.width = width;
            this.height = height;
        }
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        return (h(Host, { key: '078ac173e5a5d4e140d310f90044314b634bdd19' }, h("div", { key: 'cecabf4af1a4b33fd0e41b4851fc59d7cf256ac2', id: "root", style: { width: this.width, height: this.height }, ref: (el) => (this.sunburstChart = el), class: `--hbr-chart --sunburst-chart${size ? ` --size-${size}` : ""}` })));
    }
    get el() { return this; }
    static get style() { return HbrSunburstStyle0; }
}, [1, "hbr-sunburst", {
        "config": [1032],
        "size": [1],
        "width": [1],
        "height": [1],
        "radialLabel": [16],
        "legendTooltip": [4, "legend-tooltip"]
    }, [[1, "click", "handleClick"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-sunburst"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sunburst":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Hbrsunburst);
            }
            break;
    } });
}

const HbrSunburst = Hbrsunburst;
const defineCustomElement = defineCustomElement$1;

export { HbrSunburst, defineCustomElement };

