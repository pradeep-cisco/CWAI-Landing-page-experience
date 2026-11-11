import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { f as fe } from './harbor-charts-heatmap.es.js';
import { c as cjs } from './cjs.js';
import { c as createRoot, R as React } from './client.js';
import { g as getBaseConfig } from './baseConfig.js';
import { c as combineMergeArray } from './combineMergeArray.js';

function getLayers(config) {
    const layers = ["grid", "axes", "cells"];
    const legendExist = (Array.isArray(config.legends) && 0 < config.legends.length) ||
        config.legends === undefined;
    let _layers = layers;
    if (legendExist) {
        _layers.push("legends");
    }
    if (config.layers && Array.isArray(config.layers)) {
        _layers = config.layers.map((layer) => {
            return layer;
        });
        delete config.layers;
    }
    return _layers;
}

function getHeatmapBaseConfig({ config }) {
    return {
        emptyColor: "transparent",
        axisLeft: {
            tickSize: 0,
            tickPadding: 10,
        },
        axisTop: {
            tickSize: 0,
            tickPadding: 10,
        },
        forceSquare: true,
        animate: false,
        motionConfig: "wobbly",
        motionStiffness: 80,
        motionDamping: 9,
        layers: getLayers(config),
        enableGridX: false,
        isInteractive: true,
        legends: [
            {
                anchor: "bottom",
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: "row",
                tickPosition: "after",
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                titleOffset: 4,
            },
        ],
    };
}
function renderChart(params) {
    const { el, config } = params;
    const _config = cjs.all([getBaseConfig(), getHeatmapBaseConfig(params), config], {
        arrayMerge: combineMergeArray,
    });
    const root = createRoot(el);
    root.render(React.createElement(fe, _config, null));
}

const heatmapCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host{display:block;position:relative}:host svg.--heatmap-svg+div>div>div>span:first-child{border-radius:var(--hbr-border-radius-circle)}:host div.legend{display:none;position:absolute}:host div.legend--top-left,:host div.legend--top-right,:host div.legend--left,:host div.legend--right{display:flex;align-items:center}:host div.legend--top-left div.legend-item,:host div.legend--top-right div.legend-item,:host div.legend--left div.legend-item,:host div.legend--right div.legend-item{padding-right:var(--hbr-spacing-lg);font-size:var(--hbr-font-size-2xs);color:var(--hbr-color-on-surface)}:host div.legend--top-left div.legend-item span.legend-shape,:host div.legend--top-right div.legend-item span.legend-shape,:host div.legend--left div.legend-item span.legend-shape,:host div.legend--right div.legend-item span.legend-shape{width:var(--hbr-font-size-2xs);height:var(--hbr-font-size-2xs);border-radius:var(--hbr-border-radius-circle);display:inline-block;margin-right:var(--hbr-spacing-xs)}:host div.legend--top-left{display:flex;top:0}:host div.legend--top-right{top:0;right:0}:host div.legend--left{left:0}:host div.legend--right{right:0}";
const HbrHeatmapStyle0 = heatmapCss;

const HbrHeatmap$1 = /*@__PURE__*/ proxyCustomElement(class HbrHeatmap extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.config = { data: [] };
        this.width = "100%";
        this.height = "360px";
    }
    componentDidLoad() {
        this.createChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentShouldUpdate() {
        this.createChart();
        return false;
    }
    createChart() {
        const root = this.el.shadowRoot.querySelector("div");
        renderChart({
            el: root,
            config: this.config,
        });
        return root;
    }
    render() {
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        return (h(Host, { key: '55c43676b70436a788d964c78177dcf9679079c6' }, h("div", { key: 'ab67781f4ac8077fdf5d24ee534b797da2833aac', ref: (el) => (this.heatmap = el), style: { width: this.width, height: this.height } })));
    }
    get el() { return this; }
    static get style() { return HbrHeatmapStyle0; }
}, [1, "hbr-heatmap", {
        "config": [8],
        "width": [1],
        "height": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-heatmap"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-heatmap":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrHeatmap$1);
            }
            break;
    } });
}

const HbrHeatmap = HbrHeatmap$1;
const defineCustomElement = defineCustomElement$1;

export { HbrHeatmap, defineCustomElement };

