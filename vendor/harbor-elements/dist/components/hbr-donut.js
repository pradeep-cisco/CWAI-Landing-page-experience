import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { g as getSize, s as setMargin, c as clickEvents, a as addClassesOnLayers, b as configSetup, d as setSize } from './setSize.js';
import { c as createRoot, R as React } from './client.js';
import { c as cjs } from './cjs.js';
import { _ } from './harbor-charts-pie.es.js';
import { g as getBaseConfig } from './baseConfig.js';
import { g as getColors } from './getColors.js';
import { c as combineMergeArray } from './combineMergeArray.js';

const getNumLabels = (labels, dataLen) => {
    if (labels) {
        return labels.children.length;
    }
    return dataLen;
};
function arcLinkLabel(config, container) {
    if (config.enableArcLinkLabels) {
        const { data } = config;
        const dataLen = data.length;
        const _data = data.slice();
        const labels = container.querySelector(".--layer-arcLabels");
        const numLabels = getNumLabels(labels, dataLen);
        const labelLinks = container.querySelector(".--layer-arcLabelLinks");
        const links = labelLinks && labelLinks.children;
        links &&
            Array.from(links).forEach((label, i) => {
                if (numLabels < dataLen) {
                    const diff = dataLen - numLabels; //show path only for diff item(s);
                    _data.sort((a, b) => a.value - b.value);
                    const noLabelData = _data.slice(0, diff);
                    const indexArr = [];
                    noLabelData.forEach((d) => indexArr.push(data.findIndex((v) => v.id === d.id)));
                    if (indexArr.length && !indexArr.includes(i)) {
                        label.firstElementChild.classList.add("hbr-hide");
                    }
                }
                else {
                    label.firstElementChild.classList.add("hbr-hide");
                }
            });
        labels === null || labels === void 0 ? void 0 : labels.classList.add("hbr-hide");
    }
}

function getDonutBaseConfig(config, size) {
    const { legends: confLegends } = config;
    const hasLegends = confLegends === undefined ||
        (Array.isArray(confLegends) && 0 < config.legends.length);
    const legendRight = hasLegends &&
        Array.isArray(confLegends) &&
        config.legends[0].anchor === "right";
    const _legends = legendRight ? "right" : hasLegends ? "bottom" : undefined;
    const _margin = setMargin(size, _legends, config.enableArcLinkLabels);
    const donutConfig = {
        /** need to work on this for size && legend position */
        margin: _margin,
        innerRadius: 0.66,
        padAngle: 0.7,
        borderColor: "var(--hbr-color-neutral-bg)",
        colors: config.colors || getColors(config.data.length),
        radialLabelsTextColor: "var(--hbr-color-neutral-text)",
        radialLabelsLinkColor: { from: "color" },
        /** enableArcLabels: UX default - false. we need  enable this to figure out which ones to show the path
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
                    path.classList.add("--donut--dehighlight");
                }
                else {
                    path.classList.remove("--donut--dehighlight");
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
            Array.from(parent.children).forEach((path) => path.classList.remove("--donut--dehighlight"));
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
                    path.classList.remove("--donut--not--selected");
                    path.classList.add("--donut--selected");
                }
                else {
                    path.classList.remove("--donut--selected");
                    path.classList.add("--donut--not--selected");
                }
            });
            if (config.onClick) {
                config.onClick(props, evt);
            }
        },
    };
    return donutConfig;
}
function renderPieChart({ el, config }) {
    const size = getSize(el.className);
    const _config = cjs.all([getBaseConfig(), getDonutBaseConfig(config, size), config], {
        arrayMerge: combineMergeArray,
    });
    const root = createRoot(el);
    root.render(React.createElement(_, _config, null));
}

const donutCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host div.--donut-chart path{visibility:visible;opacity:1}:host div.--donut-chart path.--donut--dehighlight{opacity:0.5}:host svg+div>div>div>span{border-radius:var(--hbr-border-radius-circle);margin-right:var(--hbr-spacing-xs)}";
const HbrDonutStyle0 = donutCss;

const HbrDonut$1 = /*@__PURE__*/ proxyCustomElement(class HbrDonut extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
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
            addClassesOnLayers.call(this, "donut");
            /** make sure hide path(line) from LinkLabels except skip label items */
            arcLinkLabel(this.config, this.donutChart);
        }, 100);
    }
    componentShouldUpdate() {
        return this.createChart();
    }
    createChart() {
        const { config, size, donutChart } = this;
        configSetup.call(this, size, config);
        renderPieChart({
            el: donutChart,
            config,
        });
    }
    /** enableRadialLabels --
     * nivo provide this as boolean but hbr wants only enable for the items with low value not all the items */
    render() {
        var _a;
        const { config, size } = this;
        if (config.legends === null) {
            config.legends = [];
        }
        const { legends, endAngle, startAngle } = config;
        const hasLegend = legends === undefined || (Array.isArray(legends) && 0 < (legends === null || legends === void 0 ? void 0 : legends.length));
        this.hasLegends = hasLegend;
        this.rightLegend = Array.isArray(legends) && ((_a = legends[0]) === null || _a === void 0 ? void 0 : _a.anchor) === "right";
        this.partialLimited = endAngle === 90 && Math.abs(startAngle) === endAngle;
        this.hasLegends = legends === undefined || legends.length;
        if (size) {
            const { width, height } = setSize.call(this, size, config);
            this.width = width;
            this.height = height;
        }
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const cls = `--hbr-chart --donut-chart${size ? ` --size-${size}` : ""}`;
        return (h(Host, { key: '75b96a5d03d39390bf8c5a9cf65ea79a3af88f8b' }, h("div", { key: 'be4daf1c2aa98f8b5c06cb084334c2bf4a18a0c5', id: "root", style: { width: this.width, height: this.height }, ref: (el) => (this.donutChart = el), class: cls })));
    }
    get el() { return this; }
    static get style() { return HbrDonutStyle0; }
}, [1, "hbr-donut", {
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
    const components = ["hbr-donut"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-donut":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrDonut$1);
            }
            break;
    } });
}

const HbrDonut = HbrDonut$1;
const defineCustomElement = defineCustomElement$1;

export { HbrDonut, defineCustomElement };

