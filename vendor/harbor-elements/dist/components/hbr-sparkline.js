import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { D as De } from './harbor-charts-line.es.js';
import { c as cjs } from './cjs.js';
import { R as React, c as createRoot } from './client.js';
import { g as getBaseConfig } from './baseConfig.js';
import { c as combineMergeArray } from './combineMergeArray.js';

const generateDataWithNulls = (data) => {
    if (data) {
        const newDataSet = [...data];
        const lengthArray = newDataSet[0].data.length;
        const newDataNull = { id: "nullline", data: [] };
        newDataSet[0].data.forEach((ele, index) => {
            if (index !== 0 && index !== lengthArray - 1) {
                const previousValue = newDataSet[0].data[index - 1].y;
                const nextValue = newDataSet[0].data[index + 1].y;
                if (ele.y === null) {
                    if (previousValue !== null) {
                        newDataNull.data.push(newDataSet[0].data[index - 1]);
                    }
                }
                else if (ele.y !== null) {
                    newDataNull.data.push(ele);
                }
                if (ele.y !== null && nextValue === null && previousValue === null) {
                    ele.pointSymbolNull = true;
                }
            }
        });
        newDataSet.push(newDataNull);
        const generateDataAreaWithNullsArray = generateDataAreaWithNulls(data);
        newDataSet.push(generateDataAreaWithNullsArray);
        return newDataSet;
    }
    return null;
};
const generateDataAreaWithNulls = (data) => {
    const newDataSet = [...data];
    const newDataAreaNull = { id: "arealinewithnulls", data: [] };
    newDataSet[0].data.forEach((ele) => {
        if (ele.y !== null) {
            newDataAreaNull.data.push(ele);
        }
    });
    return newDataAreaNull;
};

function getSparklineBaseConfig(datasize, data) {
    return {
        margin: { top: 4, right: 4, bottom: 4, left: 4 },
        //padding: 0,
        xScale: { type: "point" },
        yScale: {
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
        },
        curve: "linear",
        enablePoints: true,
        pointLabelYOffset: -12,
        lineWidth: 2,
        pointSymbol: (props) => {
            const { size, color, borderWidth, borderColor, datum } = props;
            let gReact;
            if (datum.x === data[datasize - 1].x ||
                datum.pointSymbol ||
                datum.pointSymbolNull) {
                gReact = React.createElement("g", {}, React.createElement("circle", {
                    r: size / (datum.pointSymbolNull ? 4 : 2),
                    strokeWidth: borderWidth,
                    stroke: borderColor,
                    fill: color,
                    fillOpacity: 1,
                }));
            }
            else {
                gReact = React.createElement("g", {}, null);
            }
            return gReact;
        },
        colors: ["var(--hbr-sparkline-line1-color)", "transparent", "transparent"],
        theme: {
            grid: {
                line: {
                    stroke: "var(--hbr-sparkline-grid-color)",
                    strokeWidth: 1,
                },
            },
            axis: {
                ticks: {
                    text: {
                        fontSize: "var(--hbr-sparkline-tick-text-size)",
                        fill: "var(--hbr-sparkline-tick-text-color)",
                        lineHeight: "var(--hbr-sparkline-tick-line-height)",
                        letterSpacing: "var(--hbr-sparkline-tick-letter-spacing)",
                    },
                },
            },
        },
        axisTop: null,
        axisRight: null,
        enableGridX: false,
        enableGridY: true,
        axisBottom: {
            orient: "bottom",
            tickSize: 0,
            tickRotation: 0,
            legend: "",
            format: (value) => {
                if (value === data[0].x || value === data[datasize - 1].x) {
                    return value;
                }
                return "";
            },
            tickPadding: 15,
        },
        //useMesh: true,
        //enableSlices: "x",
        axisLeft: null,
        /* layers: [
        'grid',
        'markers',
        'areas',
        'crosshair',
        'lines',
        'axes',
        'points',
        'slices',
        'mesh',
        'legends'
    ] */
    };
}
function renderChart({ el, config }) {
    /**
     * merges: common charts config < bar charts common config < config from user
     * TODO: do we need un modifiable config?
     */
    var _a, _b, _c;
    const dataSize = ((_a = config.data) === null || _a === void 0 ? void 0 : _a[0]) ? config.data[0].data.length : null;
    const data = ((_c = (_b = config.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.data) ? config.data[0].data : null;
    config.data = generateDataWithNulls(config.data);
    let finalConfig;
    //if (mergereplace && dataSize && data & config.data) {
    //  finalConfig = merge.all([getBaseConfig(), getSparklineBaseConfig(dataSize, data), config], customMerge);
    //} else if (dataSize && data && config.data) {
    finalConfig = cjs.all([getBaseConfig(), getSparklineBaseConfig(dataSize, data), config], {
        arrayMerge: combineMergeArray,
    });
    //}
    const root = createRoot(el);
    /* @ts-ignore */
    root.render(React.createElement(De, finalConfig, null));
}

const sparklineCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host{display:block;--hbr-sparkline-line1-color:var(--hbr-color-chart-1b);--hbr-sparkline-grid-color:var(--hbr-color-neutral-border);--hbr-sparkline-tick-text-size:var(--hbr-font-size-2xs);--hbr-sparkline-tick-text-color:var(--hbr-color-neutral-700);--hbr-sparkline-tick-line-height:var(--hbr-font-line-height-dense);--hbr-sparkline-tick-letter-spacing:var(--hbr-font-letter-spacing-dense)}";
const HbrSparklineStyle0 = sparklineCss;

const HbrSparkline$1 = /*@__PURE__*/ proxyCustomElement(class HbrSparkline extends HTMLElement {
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
            config: Object.assign({}, this.config),
        });
    }
    render() {
        return (h(Host, { key: 'e7b1a68068fd18110a70f9c64f14fb32d374f4ea' }, h("div", { key: 'b766e1c3d8b0355c00737d6dbbda873bc8abbeed', id: "root", style: { width: this.width, height: this.height } })));
    }
    get el() { return this; }
    static get style() { return HbrSparklineStyle0; }
}, [1, "hbr-sparkline", {
        "config": [8],
        "width": [1],
        "height": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-sparkline"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sparkline":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrSparkline$1);
            }
            break;
    } });
}

const HbrSparkline = HbrSparkline$1;
const defineCustomElement = defineCustomElement$1;

export { HbrSparkline, defineCustomElement };

