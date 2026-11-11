import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { D as De } from './harbor-charts-line.es.js';
import { c as cjs } from './cjs.js';
import { R as React, r as react, H, c as createRoot } from './client.js';
import { g as getBaseConfig } from './baseConfig.js';
import { g as getColors } from './getColors.js';
import { c as combineMergeArray } from './combineMergeArray.js';

const getAxisBottomFormat = (value) => {
    if (!value)
        return "";
    if (!isDate(value))
        return "";
    const _value = new Date(value);
    const meridiem = _value.toLocaleTimeString("en-US").slice(-2);
    let hour = _value.getHours().toString();
    hour = hour.length === 1 ? `0${hour}` : hour;
    if (hour === "00") {
        const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(_value.getMonth());
        const day = _value.getUTCDate();
        return `${month} ${day}`;
    }
    return `${hour} ${meridiem}`;
};

function getGridXValues(config) {
    var _a;
    const ticksArrays = [];
    if (((_a = config.axisBottom) === null || _a === void 0 ? void 0 : _a.tickValues) !== "every 2 hours")
        return ticksArrays;
    const { data, xScale = {} } = config;
    const { type } = xScale;
    if (type === "time" || !type) {
        if (!Array.isArray(config.data))
            return ticksArrays;
        if (data.length && Array.isArray(data[0].data)) {
            data[0].data.forEach((t) => {
                let _date = t.x;
                if (typeof t.x === "string") {
                    _date = new Date(t.x);
                }
                if (isDate(_date) &&
                    _date.getHours() % 2 === 0 &&
                    _date.getMinutes() === 0) {
                    ticksArrays.push(_date.getTime());
                }
            });
        }
        return ticksArrays;
    }
}

const CustomAreas = (props) => {
    const { data, xScale, yScale, areaGenerator, gridYValues, markers, _threshold, } = props;
    let value;
    let axis;
    if (Array.isArray(markers) && markers.length) {
        value = markers[0].value;
        axis = markers[0].axis;
    }
    if ((typeof value === "number" && axis === "y") ||
        typeof _threshold === "number") {
        let maxY = null;
        if (Array.isArray(gridYValues) && gridYValues.length) {
            maxY = gridYValues[gridYValues.length - 1];
        }
        const _area = areaGenerator
            .x0((d) => xScale(d.x))
            .x1((d) => xScale(d.x))
            .y0((d) => yScale(d.y))
            .y1((_) => (maxY ? yScale(maxY) : yScale(value)));
        // .y1(d => (d.y <= value ? yScale(value) : yScale(d.y)));
        const pathEleList = data.map((d, i) => {
            return React.createElement("path", {
                key: i,
                fill: value ? "rgba(212, 55, 28, 0.15)" : "none",
                d: _area(d.data),
                clipPath: "url(#myThresholdArea)",
            });
        });
        if (value) {
            const rectProps = {
                height: props.height, // yScale(value),
                width: props.width,
                y: yScale(value) + 0.5,
            };
            const rect = React.createElement("rect", rectProps);
            const clipPath = React.createElement("clipPath", { id: "myThresholdArea" }, rect);
            const def = React.createElement("defs", { key: "myThresholdAreaDef" }, clipPath);
            return [
                def,
                React.createElement("g", { key: "myThresholdAreaG" }, pathEleList),
            ];
        }
        return pathEleList;
    }
    return React.createElement(React.Fragment);
};

const CustomThresholdSymbolShape = ({ id, x, y, size, fill, borderWidth, borderColor, }) => {
    const rect = React.createElement("rect", {
        key: "rect",
        height: 8,
        width: 15,
        x: 0,
        y: 7,
        fill: "rgba(212, 55, 28, 0.15)",
    });
    const line = React.createElement("line", {
        key: "line",
        x1: 0,
        y1: 7,
        x2: 15,
        y2: 7,
        stroke: "var(--hbr-color-neutral-text-weak)",
        strokeWidth: 1,
        strokeDasharray: "2, 4",
    });
    return React.createElement("g", {
        key: id,
        id: "thresholdIcon",
        name: "threshold",
        x,
        y,
        fill,
        strokeWidth: borderWidth,
        stroke: borderColor,
        width: size,
        height: size,
        style: {
            pointerEvents: "none",
            display: id === "threshold" ? "block" : "none",
        },
    }, [line, rect]);
};
const CustomLegends = (props) => {
    const { height, legends, width, data } = props;
    const noFirstLegend = data.length === 1 && props._noFirstLegend;
    if (!Array.isArray(legends) || (noFirstLegend && !isThreshold(props)))
        return React.createElement(React.Fragment, {});
    let _legends = Array.from(legends);
    if (Array.isArray(legends) &&
        data.length &&
        isThreshold(props) &&
        legends.length) {
        const lastValue = legends[legends.length - 1];
        const thresholdData = Object.assign({}, lastValue);
        thresholdData.symbolShape = CustomThresholdSymbolShape;
        const legendsData = thresholdData.data.map((_, i) => ({
            id: i,
            color: "transparent",
            label: "",
        }));
        if (noFirstLegend) {
            thresholdData.data = [
                {
                    color: "",
                    id: "threshold",
                    label: "Threshold",
                },
            ];
        }
        else {
            thresholdData.data = [
                ...legendsData,
                {
                    color: "",
                    id: "threshold",
                    label: "Threshold",
                },
            ];
        }
        thresholdData.isThreshold = true;
        if (noFirstLegend)
            _legends = [Object.assign({}, thresholdData)];
        else
            _legends = [Object.assign({}, thresholdData), ..._legends];
    }
    const LegendsNodes = _legends.map((legend, i) => {
        let paths = [];
        return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { style: { cursor: "default" }, containerHeight: height, containerWidth: width, onMouseEnter: legend.isThreshold
                ? (_data, event) => {
                    if (event.currentTarget) {
                        const g = event.currentTarget.closest("g");
                        if (!g)
                            return;
                        const rect = g.querySelector("rect");
                        if (rect)
                            rect.style = "cursor: default";
                    }
                }
                : (_data, event) => {
                    const root = event.currentTarget.closest("svg");
                    paths = root.querySelectorAll("svg path[stroke]");
                    Array.from(paths)
                        .filter((p) => p.getAttribute("stroke") !== _data.color)
                        .forEach((p) => {
                        p.setAttribute("opacity", "0.1");
                    });
                }, onMouseLeave: legend.isThreshold
                ? () => { }
                : () => {
                    if (legend.data.id === "threshold")
                        return;
                    Array.from(paths).forEach((p) => {
                        p.setAttribute("opacity", "1");
                    });
                } }));
    });
    return React.createElement(React.Fragment, {}, LegendsNodes);
};
const CustomLegends$1 = (props) => React.createElement(react.exports.memo(CustomLegends), props);

const CustomPoints = (props) => {
    const points = props.points.reduce((acc, point, i) => {
        let show = false;
        if (props.currentSlice) {
            let points = props.currentSlice.points;
            if (Array.isArray(points)) {
                points = [...points].reverse();
            }
            points.forEach((_point, _i) => {
                if (_point.x === point.x && _point.y === point.y)
                    show = true;
                else
                    show = false;
                if (point.data.__isolatedPoint)
                    show = true;
                const _props = {
                    key: `${i} ${_i}`,
                    cx: point.x,
                    cy: point.y,
                    r: "3",
                    fill: point.serieColor,
                    style: { visibility: show ? "visible" : "hidden" },
                };
                acc.push(React.createElement("circle", _props));
            });
            return acc;
        }
        if (point === null || point === void 0 ? void 0 : point.data.__isolatedPoint) {
            const _props = {
                key: `${i}`,
                cx: point.x,
                cy: point.y,
                r: "3",
                fill: point.serieColor,
                style: { visibility: true },
            };
            acc.push(React.createElement("circle", _props));
        }
        return acc;
    }, []);
    return points;
};

const layers = [
    "grid",
    "markers",
    "axes",
    "areas",
    CustomAreas,
    "crosshair",
    "lines",
    "points",
    CustomPoints,
    "slices",
    "mesh",
    CustomLegends$1,
];
const layersMap = {
    AreasThreshold: CustomAreas,
    PointsDotsOnHover: CustomPoints,
    LegendsThreshold: CustomLegends$1,
};
function getLayers(config) {
    let _layers = layers;
    if (config._variant === "small")
        return ["lines"];
    if (config.layers && Array.isArray(config.layers)) {
        _layers = config.layers.map((layer) => {
            if (layersMap[layer])
                return layersMap[layer];
            return layer;
        });
    }
    return _layers;
}

function getLegends(config, margin) {
    let colors = Array.isArray(config.colors)
        ? config.colors
        : getColors(config.data.length);
    if (typeof config.colors === "string")
        colors = [config.colors];
    const legends = [
        {
            dataFrom: "id",
            data: config.data.map((d, i) => ({
                color: colors[i],
                id: d.id,
                label: d.id,
            })),
            anchor: "bottom-left",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: typeof (margin === null || margin === void 0 ? void 0 : margin.top) === "number" ? (margin === null || margin === void 0 ? void 0 : margin.top) * -1 : 0,
            itemsSpacing: 0,
            itemWidth: 80,
            itemDirection: "left-to-right",
            itemHeight: 20,
            //itemOpacity: 0.75, removing this so legend dots can fade with overwriting opacity on hover
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [],
        },
    ];
    if (!Array.isArray(config.data))
        return [];
    if (config._variant === "small")
        return [];
    return legends;
}

const getMarkers = (threshold) => {
    return threshold
        ? [
            {
                axis: "y",
                value: threshold,
                lineStyle: {
                    stroke: "var(--hbr-color-neutral-text-weak)",
                    strokeWidth: 1,
                    strokeDasharray: "4, 2",
                },
            },
        ]
        : [];
};

const getThresholdValue = (config) => {
    if (isNumber(config._threshold))
        return config._threshold;
    if (Array.isArray(config.markers) && config.markers.length) {
        const threshold = config.markers
            .filter((marker) => marker.axis === "y" && isNumber(marker.value))
            .map((marker) => marker.value);
        if (threshold.length)
            return threshold;
    }
    return null;
};

function getVariant(variant) {
    switch (variant) {
        case "small" :
            return {
                margin: { top: 2, right: 2, bottom: 2, left: 2 },
                yScale: { min: "auto", max: "auto" },
                isInteractive: false,
                axisBottom: null,
                gridYValues: 0,
                gridXValues: 0,
                axisLeft: {
                    tickValues: [],
                    legend: "",
                },
            };
        default:
            return {};
    }
}

const isDate = (date) => date instanceof Date && typeof date.getHours === "function";

const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

const isThreshold = (config) => {
    const value = getThresholdValue(config);
    return isNumber(value) || Array.isArray(value);
};

const handleIsolatedPoint = (config) => {
    const { xScale = {} } = config;
    const { type } = xScale;
    if (type === "time" || !type) {
        const isPreNull = (d, i) => { var _a; return [null, undefined].includes((_a = d.data[i - 1]) === null || _a === void 0 ? void 0 : _a.y); };
        const isNextNull = (d, i) => { var _a; return [null, undefined].includes((_a = d.data[i + 1]) === null || _a === void 0 ? void 0 : _a.y); };
        config.data.forEach((d) => {
            d.data.forEach((_d, _i) => {
                if (0 < _i && _i < d.data.length - 1) {
                    if (isPreNull(d, _i) && isNextNull(d, _i)) {
                        _d.__isolatedPoint = true;
                    }
                }
                if ((_i === 0 && _i === d.data.length - 1 && isNextNull(d, _i)) ||
                    (_i === d.data.length - 1 && isPreNull(d, _i))) {
                    _d.__isolatedPoint = true;
                }
            });
        });
    }
};
const _preprocessCycle = [handleIsolatedPoint];
const _preprocessData = (preprocessCycle = _preprocessCycle) => (config) => {
    preprocessCycle.forEach((f) => f(config));
    return config.data;
};
const preprocessData = _preprocessData(_preprocessCycle);

function hideOriginalCrosshair(config) {
    if (config.variant === "period" ||
        (Array.isArray(config.variant) && config.variant.inclues("period"))) {
        return {
            stroke: "#000000",
            strokeWidth: 0,
            strokeOpacity: 0,
        };
    }
    return false;
}

function getLineBaseConfig({ config }) {
    var _a;
    const _data = config.data;
    const _margin = { top: 10, right: 10, bottom: 50, left: 60 };
    const margin = typeof ((_a = config.margin) === null || _a === void 0 ? void 0 : _a.top) === "number"
        ? Object.assign(Object.assign({}, _margin), config.margin) : _margin;
    return {
        margin: margin,
        curve: "catmullRom",
        enableSlices: "x",
        xScale: {
            type: "time",
            format: "native",
        },
        yScale: { type: "linear" },
        axisRight: null,
        data: preprocessData(config),
        axisBottom: {
            format: getAxisBottomFormat,
            tickSize: 0,
            fill: "var(--hbr-primary-text, #545454)",
            tickPadding: 10,
        },
        colors: config.colors || getColors(_data.length),
        axisLeft: {
            orient: "left",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: "",
            legendOffset: -40,
            legendPosition: "middle",
        },
        enablePoints: false,
        pointColor: { theme: "background" },
        pointBorderColor: { from: "serieColor" },
        pointLabelYOffset: -12,
        theme: {
            fontSize: "var(--hbr-font-size-2xs)",
            fontFamily: "var(--hbr-font-body)",
            textColor: "var(--hbr-color-neutral-text-weak)",
            axis: {
                legend: {
                    text: {
                        fontSize: "var(--hbr-font-size-2xs)",
                        fill: "var(--hbr-color-neutral-text-weak)",
                    },
                },
            },
            grid: { line: { stroke: "var(--hbr-color-neutral-border)" } },
            crosshair: {
                line: hideOriginalCrosshair(config) || {
                    stroke: "var(--hbr-color-neutral-text-weak)",
                    strokeWidth: 1.5,
                    strokeOpacity: 0.35,
                    strokeDasharray: "3,3",
                },
            },
            tooltip: {
                basic: {
                    background: "var(--hbr-color-neutral-bg)",
                    fontSize: "var(--hbr-font-size-xs)",
                    fontWeight: "350",
                    color: "var(--hbr-color-neutral-text-weak)",
                    fontFamily: "var(--hbr-font-body)",
                },
                container: {
                    padding: "12px",
                    background: "var(--hbr-color-neutral-bg)",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.08), 0px 4px 6px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                },
            },
        },
        layers: getLayers(config),
        enableGridX: true,
        gridXValues: getGridXValues(config),
        axisTop: null,
        animate: false,
        isInteractive: true,
        useMesh: true,
        legends: getLegends(config, margin),
        markers: getMarkers(config._threshold),
    };
}
function renderChart(params) {
    const { el, variant, config, contextRoot } = params;
    config._variant = variant;
    /**
     * merges: common charts config < bar charts common config < config from user
     * TODO: do we need un modifiable config?
     */
    const _variant = variant ? getVariant(variant) : {};
    const _config = cjs.all([getBaseConfig(), getLineBaseConfig(params), _variant, config], {
        arrayMerge: combineMergeArray,
    });
    if (!el.innerHTML.length) {
        const newRoot = createRoot(el);
        /* @ts-ignore */
        newRoot.render(React.createElement(De, _config, null));
        return newRoot;
    }
    contextRoot.render(React.createElement(De, _config, null));
    return contextRoot;
}

const lineCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host{display:block;width:100%;height:100%}:host .default-tooltip svg+div>div table tr td:not(:last-child):not(:first-child){padding-right:32px !important}:host .default-tooltip svg+div>div table tr td{padding:0px !important}:host .default-tooltip svg+div>div table tr:not(:last-child) td{padding-bottom:12px !important}:host .default-tooltip svg+div>div table tr td:first-child{padding-right:8px !important}:host .default-tooltip svg+div>div table tr td:first-child span{border-radius:50%;margin-right:0px !important}:host .default-tooltip.hide-tooltip-color-dot svg+div>div table tr:first-child td:first-child{display:none !important}";
const HbrLineStyle0 = lineCss;

const HbrLine$1 = /*@__PURE__*/ proxyCustomElement(class HbrLine extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.config = { data: [] };
        this.width = "100%";
        this.height = "360px";
        this.variant = "";
        this.threshold = undefined;
        this.noFirstLegend = true;
    }
    componentDidLoad() {
        this.createChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentDidUpdate() { }
    componentShouldUpdate() {
        this.createChart();
        return false;
    }
    createChart() {
        const root = this.el.shadowRoot.querySelector("div");
        this.config._threshold = this.threshold;
        this.config._noFirstLegend = this.noFirstLegend;
        this.contextRoot = renderChart({
            el: root,
            variant: this.variant,
            config: this.config,
            contextRoot: this.contextRoot,
        });
    }
    render() {
        var _a, _b;
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        return (h(Host, { key: '8d19b26d3bc2a66e6b7c1d1aeb484e2ba87fb413' }, h("div", { key: 'f328c49292ed7b2274b5bbff228f995dfd88e71d', id: "root", style: { width: this.width, height: this.height }, class: {
                "default-tooltip": !this.config.sliceTooltip,
                "hide-tooltip-color-dot": this.noFirstLegend && ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length) === 1,
            } })));
    }
    get el() { return this; }
    static get style() { return HbrLineStyle0; }
}, [1, "hbr-line", {
        "config": [8],
        "width": [1],
        "height": [1],
        "variant": [1],
        "threshold": [2],
        "noFirstLegend": [4, "no-first-legend"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-line"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-line":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrLine$1);
            }
            break;
    } });
}

const HbrLine = HbrLine$1;
const defineCustomElement = defineCustomElement$1;

export { HbrLine, defineCustomElement };

