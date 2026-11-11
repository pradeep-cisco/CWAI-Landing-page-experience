import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { g as getColors } from './getColors.js';
import { M as Me } from './harbor-charts-bar.es.js';
import { c as cjs } from './cjs.js';
import { c as createRoot, R as React, H } from './client.js';
import { g as getBaseConfig } from './baseConfig.js';
import { c as combineMergeArray } from './combineMergeArray.js';
import { s as sanitizeHtml } from './sanitizeHtml.js';

function barColors(config) {
    const { colors, groupMode, keys, _nulldataColor } = config;
    if (colors && Array.isArray(colors) && colors.length) {
        return colors;
    }
    if (groupMode) {
        if (_nulldataColor) {
            return [...getColors(keys.length - 1), _nulldataColor];
        }
        return getColors(keys.length);
    }
    if (keys.length === 1) {
        return getColors(keys.length);
    }
    return [...getColors(1), _nulldataColor];
}

function getLegends(config, margin, chartType) {
    let colors = Array.isArray(config.colors)
        ? config.colors
        : getColors(config.data.length);
    if (typeof config.colors === "string")
        colors = [config.colors];
    let _data = [];
    if (chartType === "line") {
        _data = config.data.map((d, i) => ({
            color: colors[i],
            id: d.id,
            label: d.id,
        }));
    }
    else if (chartType === "bar") {
        if (typeof config.colors !== "string")
            colors = barColors(config);
        _data = config.keys.map((d, i) => ({
            color: colors[i],
            id: d,
            label: d,
        }));
    }
    const legends = [
        {
            dataFrom: "id",
            data: _data,
            anchor: "bottom-left",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: typeof (margin === null || margin === void 0 ? void 0 : margin.top) === "number" ? (margin === null || margin === void 0 ? void 0 : margin.top) * -1 : 0,
            itemsSpacing: 0,
            itemWidth: 80,
            itemDirection: "left-to-right",
            itemHeight: 20,
            itemOpacity: 1,
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

function getBarBaseConfig(config, threshold) {
    const isThreshold = threshold && typeof threshold === "number";
    const basicConfig = {
        padding: 0.5,
        valueScale: {
            type: "linear",
        },
        indexScale: {
            type: "band",
            round: true,
        },
        borderColor: {
            from: "color",
            modifiers: [["darker", 1.6]],
        },
        motionStiffness: 90,
        motionDamping: 15,
        labelTextColor: "var(--hbr-color-neutral-bg)",
        labelSkipWidth: 16,
        colors: barColors(config),
        onMouseEnter: (props, evt) => {
            const { currentTarget } = evt;
            const root = currentTarget.closest("svg");
            if (root) {
                const nullBar = config._nulldataColor &&
                    root.querySelector(`svg > g > g> rect[fill='${config._nulldataColor}']`);
                if (nullBar && nullBar === currentTarget) {
                    currentTarget.style.cursor = "not-allowed";
                }
                else {
                    const barRects = root.querySelectorAll("svg > g > g > rect[fill]"); //make sure filter out legends
                    Array.from(barRects).forEach((bar) => {
                        var _a, _b;
                        const parent = bar.parentElement;
                        if (parent) {
                            (_a = parent.classList) === null || _a === void 0 ? void 0 : _a.add("--bar");
                            if (bar !== currentTarget) {
                                (_b = parent.classList) === null || _b === void 0 ? void 0 : _b.add("--bar--dehighlight");
                            }
                        }
                    });
                }
            }
            if (config.onMouseEnter) {
                config.onMouseEnter(props, evt);
            }
        },
        onMouseLeave: (props, evt) => {
            const { currentTarget } = evt;
            const root = currentTarget.closest("svg");
            if (root) {
                const barRects = root.querySelectorAll("svg > g > g > rect[fill]"); //make sure filter out legends
                Array.from(barRects).forEach((bar) => {
                    const parent = bar.parentElement;
                    if (parent) {
                        parent.classList.remove("--bar--dehighlight");
                    }
                });
            }
            if (config.onMouseLeave) {
                config.onMouseLeave(props, evt);
            }
        },
        onClick: (props, evt) => {
            const { currentTarget } = evt;
            const root = currentTarget.closest("svg");
            if (root && props.color !== config._nulldataColor) {
                const barRects = root.querySelectorAll("svg > g > g > rect[fill]"); //make sure filter out legends
                Array.from(barRects).forEach((bar) => {
                    const parent = bar.parentElement;
                    if (parent) {
                        parent.classList.remove("--bar--selected", "--bar--not-selected");
                        if (bar !== currentTarget) {
                            parent.classList.add("--bar--not-selected");
                        }
                        else {
                            parent.classList.add("--bar--selected");
                        }
                    }
                });
            }
            if (config.onClick) {
                config.onClick(props, evt);
            }
        },
    };
    const axisLeft = {
        tickValues: 3,
        tickSize: 0,
        tickPadding: 1.5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -36,
    };
    const axisBottom = {
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 27,
    };
    if (config.groupMode)
        basicConfig.groupMode = config.groupMode;
    if (isThreshold) {
        basicConfig.markers = [
            {
                axis: "y",
                value: threshold,
                lineStyle: {
                    stroke: "var(--hbr-color-on-surface, #545454)",
                    strokeWidth: 1,
                    strokeDasharray: "4, 2",
                },
            },
        ];
    }
    config.colors = basicConfig.colors;
    if (config.layout && config.layout === "horizontal") {
        basicConfig.enableGridX = true;
        basicConfig.enableGridY = false;
    }
    if (config.axisLeft) {
        config.axisLeft = Object.assign(Object.assign({}, axisLeft), config.axisLeft);
    }
    if (config.axisBottom) {
        config.axisBottom = Object.assign(Object.assign({}, axisBottom), config.axisBottom);
    }
    return basicConfig;
}
function renderChart({ el, config, threshold, contextRoot }) {
    const _config = cjs.all([getBaseConfig(), getBarBaseConfig(config, threshold), config], {
        arrayMerge: combineMergeArray,
    });
    if (!el.innerHTML.length) {
        const newRoot = createRoot(el);
        newRoot.render(React.createElement(Me, _config, null));
        return newRoot;
    }
    contextRoot.render(React.createElement(Me, _config, null));
    return contextRoot;
}

function componentFromHTMLString(str, type = "html", props = {}) {
    return React.createElement(type === "svg" ? "g" : "div", Object.assign({ dangerouslySetInnerHTML: { __html: str } }, props));
}

function labelAboveBar(config, props) {
    const { bars } = props;
    const { _compactLabel } = config;
    const variant = _compactLabel === null || _compactLabel === void 0 ? void 0 : _compactLabel.variant;
    const additional = _compactLabel === null || _compactLabel === void 0 ? void 0 : _compactLabel.additional;
    const cls = `--label-above${variant && variant === "link" ? " --label-above-link" : ""}`;
    const PADDING_RIGHT = 6;
    const PADDING_BOTTOM = 5;
    const unique = [];
    const map = new Map();
    for (const item of bars) {
        if (!map.has(item.data.indexValue)) {
            map.set(item.data.indexValue, true); // set any value to Map
            unique.push(item);
        }
    }
    if (!additional) {
        return unique.map((_bar) => {
            return componentFromHTMLString(`<text class="${cls}" data-indexvalue="${_bar.data.indexValue}">${_bar.data.indexValue}</text>`, "svg", {
                key: _bar.key,
                className: "--layer-aboveBar",
                transform: `translate(${_bar.x + PADDING_RIGHT}, ${_bar.y - PADDING_BOTTOM})`,
            });
        });
    }
    return unique.map((_bar) => {
        const found = additional.filter((d) => d.label === _bar.data.indexValue);
        let details = "";
        if (found === null || found === void 0 ? void 0 : found.length) {
            details = found[0].text;
        }
        return componentFromHTMLString(`<g transform="${`translate(${_bar.x + PADDING_RIGHT}, ${_bar.y - PADDING_BOTTOM})`}">
                    <text>
                        <tspan
                            class="${cls}"
                            data-indexvalue="${_bar.data.indexValue}"
                        >${_bar.data.indexValue}</tspan>
                        <tspan dx="10">${details}</tspan>
                    </text>
                    </g>`, "svg", {
            key: _bar.key,
            className: "--layer-aboveBar",
        });
    });
}

function thresholdFn(config, props) {
    const { _threshold } = config;
    const { yScale, innerWidth } = props;
    const value = _threshold;
    const yValue = yScale(value);
    return componentFromHTMLString(`<rect
        height="${yScale(0) - yValue - 1}"
        width="${innerWidth}"
        x="0"
        y="${yValue + 1}"
        fill="rgba(212, 55, 28, 0.15)"
      ></rect>
      `, "svg", {
        className: "--layer-threshold",
    });
}

function getContainer(evt) {
    let container = evt.relatedTarget;
    if (!container || !container.tagName || container.tagName !== "DIV") {
        container = evt.target.closest("svg").parentElement;
    }
    return container;
}
function legendInteractionHover(evt, barRects, _data) {
    const container = getContainer(evt);
    if (container) {
        const root = evt.currentTarget.closest("svg");
        barRects = root.querySelectorAll("svg > g > g > rect[fill]"); //make sure filter out legends
        Array.from(barRects)
            .filter((p) => {
            if (_data.color.includes("var")) {
                const color = _data.color.split(",")[0];
                return !p.getAttribute("fill").includes(color);
            }
            return p.getAttribute("fill") !== _data.color;
        })
            .forEach((p) => p.parentElement.classList.add("--bar", "--bar--dehighlight"));
    }
    return barRects;
}

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
const nullDataFn = (item) => item === "no data" || item === "null data" || item === "null";
const LegendTooltip = async (config, props, evt) => {
    const { color, label } = props;
    const { target, relatedTarget } = evt;
    const { data, _nulldataColor, keys, tooltipFormat, indexBy } = config;
    if (_nulldataColor && label === keys[keys.length - 1])
        return;
    let divContainer = relatedTarget;
    if (!divContainer ||
        !divContainer.tagName ||
        divContainer.tagName !== "DIV") {
        divContainer = target.closest("svg").parentElement;
    }
    if (divContainer) {
        const tooltip = divContainer.querySelector(".--tooltip-legend");
        if (tooltip)
            return;
        const tooltipWrapper = document.createElement("div");
        tooltipWrapper.classList.add("chart--custom-tooltip-wrapper", "--tooltip-legend");
        tooltipWrapper.style.visibility = "hidden";
        const div = document.createElement("div");
        div.classList.add("chart--custom-tooltip");
        let nullData;
        if (_nulldataColor) {
            const item = label.toLowerCase().trim();
            nullData = nullDataFn(item);
        }
        let stackedKeyValue;
        if (label && !nullData) {
            const itemsHtml = data.map((item) => `
        <div class="tooltip-content-item">
          <div class="tooltip-content-shape">
            <span style="background-color: ${color};"></span>
          </div>
          <div class="tooltip-content-id">${item[indexBy]}</div>
          <div class="tooltip-content-value">${item[label] === undefined
                ? keys[keys.length - 1]
                : tooltipFormat
                    ? tooltipFormat(item[label])
                    : item[label]}
          </div>
        </div>
      `);
            stackedKeyValue = itemsHtml.join(" ");
        }
        div.innerHTML = await sanitizeHtml(`
      <div class="tooltip-content">
        <div class="tooltip-content-title">
          ${label}
        </div>
        ${stackedKeyValue}
      </div>
    `);
        tooltipWrapper.appendChild(div);
        divContainer.appendChild(tooltipWrapper);
        const refRect = target.getBoundingClientRect();
        const refOffset = {
            top: refRect.top,
            left: refRect.left,
            width: refRect.width,
        };
        const tooltipRect = tooltipWrapper.getBoundingClientRect();
        const tooltipOffset = {
            height: tooltipRect.height,
        };
        if (refOffset && tooltipOffset) {
            const tooltipX = refOffset.left - refOffset.width / 2;
            const tooltipY = refOffset.top - tooltipOffset.height - 5;
            tooltipWrapper.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
            tooltipWrapper.style.visibility = "visible";
        }
    }
};
const legendInteractionClick = (evt, barRects, _data, obj) => {
    const { target, legendContainer } = obj;
    const container = getContainer(evt);
    if (container && legendContainer) {
        const root = evt.currentTarget.closest("svg");
        barRects = root.querySelectorAll("svg > g > g > rect[fill]"); //make sure filter out legends
        const value = legendContainer.getAttribute("data-legend-selected-items") || "";
        const valueArr = (value === null || value === void 0 ? void 0 : value.split(",")) || [];
        const targetSelected = target.hasAttribute("data-legend-selected");
        let resetAll;
        let hideTarget;
        let addValue;
        let addInitialValue;
        barRects.forEach((p) => {
            const parent = p.parentElement;
            parent.classList.add("--bar");
            const color = _data.color.includes("var")
                ? _data.color.split(",")[0]
                : _data.color;
            if (!value) {
                // none selected
                if (!p.getAttribute("fill").includes(color)) {
                    parent.classList.add("--bar--hide");
                }
                else {
                    target.setAttribute("data-legend-selected", true);
                    parent.classList.add("--bar-selected-by-legend");
                }
                addInitialValue = true;
            }
            else {
                if (targetSelected) {
                    if (valueArr.length === 1 && valueArr[0] === _data.id) {
                        resetAll = true;
                        parent.classList.remove("--bar--hide", "--bar-selected-by-legend");
                    }
                    else {
                        hideTarget = true;
                        if (p.getAttribute("fill").includes(color)) {
                            parent.classList.add("--bar--hide");
                        }
                    }
                }
                else {
                    if (valueArr.length === legendContainer.children.length - 1) {
                        resetAll = true;
                        parent.classList.remove("--bar--hide", "--bar-selected-by-legend");
                    }
                    else {
                        if (p.getAttribute("fill").includes(color)) {
                            parent.classList.remove("--bar--hide");
                        }
                        addValue = true;
                    }
                }
            }
        });
        if (resetAll || hideTarget) {
            target.removeAttribute("data-legend-selected");
            if (resetAll) {
                legendContainer.removeAttribute("data-legend-selected-items");
                Array.from(legendContainer.children).forEach((node) => node.removeAttribute("data-legend-selected"));
            }
            else if (hideTarget) {
                const idx = valueArr.findIndex((v) => v === _data.id);
                const newValue = valueArr.splice(idx, 1).join(",");
                legendContainer.setAttribute("data-legend-selected-items", newValue);
            }
        }
        if (addInitialValue) {
            legendContainer.setAttribute("data-legend-selected-items", _data.id);
        }
        if (addValue) {
            target.setAttribute("data-legend-selected", true);
            legendContainer.setAttribute("data-legend-selected-items", `${value},${_data.id}`);
        }
    }
    return barRects;
};
function legendComponent(config, legends, props) {
    const { _noFirstLegend, _threshold, keys, colors, groupMode } = config;
    const { height, width } = props;
    const noFristLegend = !groupMode && _noFirstLegend;
    const hideLegend = noFristLegend && keys.length === 1;
    if (!Array.isArray(legends) || (hideLegend && !_threshold)) {
        return React.createElement(React.Fragment, {});
    }
    let _legends = Array.from(legends);
    const lastValue = legends[legends.length - 1];
    const _data = [];
    if (noFristLegend) {
        //no data key exists
        _data.push({
            color: colors[1],
            id: keys[1],
            label: keys[1],
        });
    }
    else {
        keys.forEach((key, i) => {
            const item = {
                color: colors[i],
                id: key,
                label: key,
            };
            _data.push(item);
        });
    }
    lastValue.data = _data;
    if (Array.isArray(legends) && keys.length && _threshold && legends.length) {
        /** custom layer props not returning legends anymore(v0.72.0) for the bar cart */
        const thresholdData = Object.assign({}, lastValue);
        thresholdData.symbolShape = CustomThresholdSymbolShape;
        const legendsData = thresholdData.data.map((_, i) => ({
            id: i,
            color: "transparent",
            label: "",
        }));
        if (hideLegend) {
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
        if (hideLegend)
            _legends = [Object.assign({}, thresholdData)];
        else
            _legends = [Object.assign({}, thresholdData), ..._legends];
    }
    const LegendsNodes = _legends.map((legend, i) => {
        let rects = [];
        const singleBar = !groupMode;
        let legendContainer;
        const noInteraction = config.isInteractive !== undefined && !config.isInteractive;
        const noTooltip = !this.legendTooltip || noInteraction;
        if (noTooltip) {
            if (noInteraction) {
                return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { containerHeight: height, containerWidth: width }));
            }
            return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { containerHeight: height, containerWidth: width, onMouseEnter: singleBar
                    ? () => { }
                    : (_data, evt) => {
                        const nullData = config._nulldataColor && _data.color === config._nulldataColor;
                        if (nullData) {
                            return (evt.currentTarget.style.cursor = "not-allowed");
                        }
                        rects = legendInteractionHover(evt, rects, _data);
                        return rects;
                    }, 
                //@ts-ignore
                onMouseLeave: (props, evt) => {
                    if (legend.data.id === "threshold")
                        return;
                    return Array.from(rects).forEach((p) => p.parentElement.classList.remove("--bar--dehighlight"));
                }, onClick: singleBar
                    ? () => { }
                    : (_data, evt) => {
                        var _a;
                        const target = evt.target.closest("g");
                        if (!legendContainer) {
                            legendContainer = target.parentElement;
                        }
                        if (config.groupMode) {
                            (_a = legendContainer === null || legendContainer === void 0 ? void 0 : legendContainer.classList) === null || _a === void 0 ? void 0 : _a.add("--legends");
                            const clickObj = { target, legendContainer };
                            rects = legendInteractionClick(evt, rects, _data, clickObj);
                        }
                    } }));
        }
        return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { containerHeight: height, containerWidth: width, onMouseEnter: singleBar
                ? () => { }
                : (_data, evt) => {
                    const nullData = config._nulldataColor && _data.color === config._nulldataColor;
                    if (nullData) {
                        return (evt.currentTarget.style.cursor = "not-allowed");
                    }
                    rects = legendInteractionHover(evt, rects, _data);
                    return LegendTooltip(config, _data, evt);
                }, 
            //@ts-ignore
            onMouseLeave: (props, evt) => {
                const container = getContainer(evt);
                if (container) {
                    const tooltip = container.querySelector(".--tooltip-legend");
                    if (tooltip)
                        tooltip.remove();
                }
                if (legend.data.id === "threshold")
                    return;
                return Array.from(rects).forEach((p) => p.parentElement.classList.remove("--bar--dehighlight"));
            }, onClick: singleBar
                ? () => { }
                : (_data, evt) => {
                    var _a;
                    const target = evt.target.closest("g");
                    if (!legendContainer) {
                        legendContainer = target.parentElement;
                    }
                    if (config.groupMode) {
                        (_a = legendContainer === null || legendContainer === void 0 ? void 0 : legendContainer.classList) === null || _a === void 0 ? void 0 : _a.add("--legends");
                        const clickObj = { target, legendContainer };
                        rects = legendInteractionClick(evt, rects, _data, clickObj);
                    }
                } }));
    });
    return React.createElement(React.Fragment, {}, LegendsNodes);
}
function customLegendFn(config, legendIdx, layers, legend) {
    layers.splice(legendIdx, 1, legendComponent.bind(this, config, legend));
    return layers;
}

const noLegend = (legends, keys, noFirstLegend) => legends === null ||
    (legends && !legends.length) ||
    (noFirstLegend && keys.length === 1);
function layers(config, legend) {
    const { keys, layers, legends, _threshold, markers, _noFirstLegend, _variant, } = config;
    let dLayers;
    if (noLegend(legends, keys, _noFirstLegend)) {
        if (legends === null)
            config.legends = [];
        dLayers = ["grid", "axes", "bars"];
    }
    else {
        dLayers = ["grid", "axes", "bars", "legends"];
    }
    if (_threshold || markers) {
        dLayers.unshift("markers");
        if (!markers) {
            dLayers.unshift(thresholdFn.bind(this, config));
        }
    }
    if (layers) {
        dLayers = [...new Set([...dLayers, ...layers])];
    }
    const legendIdx = dLayers.indexOf("legends");
    if (-1 < legendIdx) {
        customLegendFn.call(this, config, legendIdx, dLayers, legend);
    }
    if (_variant && _variant === "compact") {
        dLayers.push(labelAboveBar.bind(this, config));
    }
    return dLayers;
}

function customTooltipFn(config) {
    const { isInteractive, tooltip, groupMode, keys, tooltipFormat } = config;
    const containsNoData = !groupMode && keys.length === 2; /** single with no data */
    if ((isInteractive === undefined || isInteractive) &&
        !tooltip &&
        containsNoData) {
        config.tooltip = ({ id, value }) => {
            if (id !== keys[1]) {
                return componentFromHTMLString(`
          <div class="tooltip-content">
            <span class="tooltip-content-value">
              ${id}: <strong>${tooltipFormat ? tooltipFormat(value) : value}</strong>
            </span>
          </div>`, "html", {
                    className: "chart--custom-tooltip --single",
                });
            }
            return componentFromHTMLString(`
        <div class="tooltip-content">
          ${id}
        </div>`, "html", {
                className: "chart--custom-tooltip --single",
            });
        };
        return config.tooltip;
    }
}

function updateConfig(config) {
    const { groupMode, keys, colors, innerPadding } = this.config;
    config._noFirstLegend = this.noFirstLegend;
    config._threshold = this.threshold;
    if (this.variant) {
        config._variant = this.variant;
        if (this.variant === "compact" && this.compactLabel) {
            config._compactLabel = this.compactLabel;
        }
    }
    /** Single bar with no data */
    if (!groupMode && keys.length === 2) {
        if (colors) {
            this.config._nulldataColor = colors[1];
        }
        else {
            this.config._nulldataColor = "var(--hbr-color-neutral-90)";
        }
    }
    else if (groupMode) {
        const lastItem = keys[keys.length - 1].toLowerCase().trim();
        if (lastItem === "no data" ||
            lastItem === "null data" ||
            lastItem === "null") {
            if (colors) {
                this.config._nulldataColor = colors[colors.length - 1];
            }
            else {
                this.config._nulldataColor = "var(--hbr-color-neutral-90)";
            }
        }
    }
    if (groupMode && !innerPadding) {
        config.innerPadding = 1;
    }
    config.isFocusable = true;
    return config;
}

function barSelectState(bar) {
    const bars = bar.querySelectorAll(".--bar");
    if (bars.length) {
        Array.from(bars).forEach((bar) => bar.classList.remove("--bar--selected", "--bar--not-selected"));
    }
}
function barResetSelected(origin) {
    const root = this.barchart.querySelector("svg");
    const bars = root.querySelectorAll(".--bar");
    if (bars.length) {
        Array.from(bars).forEach((bar) => bar.classList.remove("--bar--hide", "--bar-selected-by-legend"));
        if (origin === "legend") {
            const legendContainer = root.querySelector("g[data-legend-selected-items]");
            if (legendContainer) {
                legendContainer.removeAttribute("data-legend-selected-items");
                const selected = legendContainer.querySelectorAll("g[data-legend-selected]");
                if (selected.length) {
                    Array.from(selected).forEach((legend) => legend.removeAttribute("data-legend-selected"));
                }
            }
        }
    }
}
function resetLegend(legendsSelected) {
    if (legendsSelected) {
        legendsSelected.classList.remove("--legends-selected");
        const clsOnBarContainer = this.barchart.querySelector(".--legend-selected");
        if (clsOnBarContainer) {
            clsOnBarContainer.classList.remove("--legend-selected");
        }
        const legendSelected = legendsSelected.querySelector(".--legend-selected");
        if (legendSelected) {
            legendSelected.classList.remove("--legend-selected");
            const { config, original } = this;
            const { maxValue, gridYValues } = original;
            if (config.maxValue !== maxValue) {
                this.config = Object.assign(Object.assign({}, config), { maxValue,
                    gridYValues, axisLeft: Object.assign(Object.assign({}, config.axisLeft), { tickValues: gridYValues }) });
            }
        }
    }
}
function resetStyles(grouped, target) {
    /** More to add */
    if (grouped) {
        const { barchart } = this;
        const tickSelected = barchart.querySelector(".--tick-selected");
        const legendsSelected = barchart.querySelector(".--legends-selected");
        const visibleBar = target.classList.contains("--rect") &&
            !target.parentElement.classList.contains("--bar--hide");
        if (tickSelected) {
            tickSelected.classList.remove("--tick-selected");
            barResetSelected.call(this, "tick");
        }
        else if (legendsSelected && !visibleBar) {
            resetLegend.call(this, legendsSelected);
            barResetSelected.call(this, "legend");
        }
    }
}

const styleCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host .--bar-chart svg>g{line-height:var(--hbr-font-line-height-normal);letter-spacing:var(--hbr-font-letter-spacing-loose)}:host .--bar-chart svg>g .--bar rect{visibility:visible;opacity:1}:host .--bar-chart svg>g .--bar.--bar--dehighlight rect{opacity:0.5;transition:visibility 0s, opacity 0.15s linear}:host .--bar-chart svg>g .--bar.--bar--dehighlight.--bar--selected rect{opacity:1;transition:visibility 0s, opacity 0.15s linear}:host .--bar-chart svg>g .--bar.--bar--not-selected rect{opacity:0.25;transition:visibility 0s, opacity 0.15s linear}:host .--bar-chart svg>g .--bar.--bar--not-selected:hover rect{visibility:visible;opacity:1}:host .--bar-chart svg>g .--bar.--bar--hide{visibility:hidden;opacity:0;transition:visibility 0s, opacity 0.15s linear;cursor:default}:host .--bar-chart svg>g g.--legends g circle{opacity:1;visibility:visible}:host .--bar-chart svg>g g.--legends g text{opacity:1;visibility:visible}:host .--bar-chart svg>g g.--legends[data-legend-selected-items] g:not([data-legend-selected]) circle{opacity:0.25;transition:visibility 0s, opacity 0.15s linear}:host .--bar-chart svg>g g.--legends[data-legend-selected-items] g:not([data-legend-selected]) text{opacity:0.5;transition:visibility 0s, opacity 0.15s linear}:host .--bar-chart svg>g g.--layer-inBar>text{font-size:10px;font-weight:normal}:host .--bar-chart svg>g{}:host .--bar-chart svg>g .--layer-aboveBar{font-size:var(--hbr-font-size-xs, 12px);letter-spacing:var(--hbr-font-letter-spacing-normal);line-height:var(--hbr-font-line-height-normal);font-weight:300}:host .--bar-chart svg>g .--layer-aboveBar .--label-above:not(.--hbr-color-chart-1b){fill:var(--hbr-color-neutral-text)}:host .--bar-chart svg>g .--layer-aboveBar .--label-above:not(.--label-above-link){fill:var(--hbr-color-neutral-text);cursor:default}:host .--bar-chart svg>g .--layer-aboveBar .--label-above.--hbr-color-chart-1b{fill:var(--hbr-color-chart-1b)}:host .--bar-chart svg>g .--layer-aboveBar .--label-above.--label-above-link{fill:var(--interact-text-default);cursor:pointer}:host .--bar-chart svg+div>div>div>span{border-radius:var(--hbr-border-radius-circle);margin-right:var(--hbr-spacing-xs)}";
const HbrBarStyle0 = styleCss;

const HbrBarCohesion = /*@__PURE__*/ proxyCustomElement(class HbrBarCohesion extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrAboveBarlabelClick = createEvent(this, "hbr-above-barlabel-click", 7);
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.grouped = false;
        this.stacked = false;
        this.isvertical = true;
        this.verticalFn = (layout) => !layout || layout === "vertical";
        this.keepOriginal = (config) => {
            const { grouped, original } = this;
            if (grouped && !original) {
                /** may modified on legend click */
                this.original = {
                    maxValue: config.maxValue,
                    gridYValues: config.gridYValues,
                };
            }
        };
        this.labesOnBar = () => {
            const lablesIn = this.barchart.querySelectorAll(".--layer-inBar");
            const lablesAbove = this.barchart.querySelectorAll(".--layer-aboveBar");
            let labelsInArr;
            let labelsAboveArr;
            if (lablesIn === null || lablesIn === void 0 ? void 0 : lablesIn.length) {
                labelsInArr = Array.from(lablesIn);
            }
            if (lablesAbove === null || lablesAbove === void 0 ? void 0 : lablesAbove.length) {
                labelsAboveArr = Array.from(lablesAbove);
            }
            return {
                labelsInBar: labelsInArr,
                labelsAboveBar: labelsAboveArr,
            };
        };
        this.labelContnainerFn = (gFirstChild, labelLine, labelText) => gFirstChild.tagName === "g" &&
            labelLine.tagName === "line" &&
            labelText.tagName === "text";
        this.variablesObj = (index, obj) => {
            const { isvertical } = this;
            const { data, gridXValues, newGridYValues, indexBy, tickText } = obj;
            const dataLen = data === null || data === void 0 ? void 0 : data.length;
            const dataLabel = dataLen && index < dataLen ? data[index][indexBy] : "";
            const xValues = gridXValues === null || gridXValues === void 0 ? void 0 : gridXValues.length;
            const yValues = newGridYValues === null || newGridYValues === void 0 ? void 0 : newGridYValues.length;
            const gridValues = isvertical
                ? yValues && newGridYValues
                : xValues && gridXValues;
            const dataValue = gridValues === null || gridValues === void 0 ? void 0 : gridValues[index];
            return {
                dataLabel,
                dataValue,
                gridValues,
                isXAxis: tickText && dataLabel && tickText === dataLabel,
            };
        };
        this.singleBarFn = () => !this.stacked && !this.grouped;
        this.config = undefined;
        this.variant = undefined;
        this.compactLabel = undefined;
        this.width = "100%";
        this.height = "360px";
        this.tickLabelTooltip = true;
        this.legendTooltip = true;
        this.threshold = undefined;
        this.noFirstLegend = true;
    }
    componentDidLoad() {
        this.createChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
        setTimeout(() => {
            /** can't pass func through componentFromHTMLString so listen for the click and emit to users */
            const linkLabels = this.barchart.querySelectorAll(".--label-above-link");
            if (linkLabels === null || linkLabels === void 0 ? void 0 : linkLabels.length) {
                Array.from(linkLabels).forEach((linkLabel) => linkLabel.addEventListener("click", (evt) => this.abovebarlabelOnClick(linkLabel, evt)));
            }
        });
    }
    componentShouldUpdate() {
        return this.createChart();
    }
    abovebarlabelOnClick(el, evt) {
        this.hbrAboveBarlabelClick.emit({
            event: evt,
            indexvalue: el.dataset.indexvalue,
        });
    }
    handleOutsideClick(evt) {
        var _a, _b;
        const { grouped } = this;
        const path = evt.path || ((_a = evt.composedPath) === null || _a === void 0 ? void 0 : _a.call(evt));
        if (path === null || path === void 0 ? void 0 : path.length) {
            const firstItemOnPath = path[0];
            const parentItem = firstItemOnPath.parentElement;
            let legendClick;
            const barClick = (_b = firstItemOnPath.parentElement) === null || _b === void 0 ? void 0 : _b.classList.contains("--bar");
            if (grouped) {
                legendClick =
                    firstItemOnPath.tagName === "rect" &&
                        firstItemOnPath.nextElementSibling &&
                        firstItemOnPath.nextElementSibling.tagName === "circle" &&
                        firstItemOnPath.nextElementSibling.nextElementSibling &&
                        firstItemOnPath.nextElementSibling.nextElementSibling.tagName ===
                            "text";
            }
            if (!legendClick) {
                resetStyles.call(this, grouped, firstItemOnPath);
                if (this.barchart.querySelector("[data-legend-selected-items]")) {
                    barResetSelected.call(this, "legend");
                }
                if (!barClick &&
                    this.barchart.querySelector("g.--bar.--bar--not-selected")) {
                    barSelectState.call(this, parentItem);
                }
            }
        }
    }
    createChart() {
        var _a;
        const { config } = this;
        const { groupMode, layout } = config;
        if (!this.axesupdate) {
            const _layout = layout ? layout : "vertical";
            this.isvertical = this.verticalFn(_layout);
            if (groupMode) {
                this.grouped = groupMode === "grouped";
                this.stacked = groupMode === "stacked";
            }
            customTooltipFn.call(this, config);
            updateConfig.call(this, config);
            this.keepOriginal(config);
        }
        if (config.legends === undefined || ((_a = config.legends) === null || _a === void 0 ? void 0 : _a.length)) {
            // skip if legends is null or []
            config.legends = getLegends(config, config.margin, "bar");
        }
        if (!config.layers || !Array.isArray(config.layers)) {
            // skip if layers is Array.
            config.layers = layers.call(this, config, getLegends(config, config.margin, "bar"));
        }
        this.contextRoot = renderChart({
            el: this.barchart,
            config,
            threshold: this.threshold,
            contextRoot: this.contextRoot,
        });
    }
    render() {
        const { config } = this;
        const { groupMode } = config;
        const layout = config.layout ? config.layout : "vertical";
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        return (h(Host, { key: '3c1c078a50ac802d2ff4fb7b340dcb7eceb5c74e' }, h("div", { key: '4607f2a6de37562728a8d42d978252f77c2dc1bc', id: "root", style: { width: this.width, height: this.height }, ref: (el) => (this.barchart = el), class: `--hbr-chart --bar-chart --bar-${layout}${groupMode === "stacked"
                ? " --bar--stacked"
                : groupMode === "grouped"
                    ? " --bar--grouped"
                    : ""}` })));
    }
    get el() { return this; }
    static get style() { return HbrBarStyle0; }
}, [1, "hbr-bar", {
        "config": [1032],
        "variant": [1],
        "compactLabel": [16],
        "width": [1],
        "height": [1],
        "tickLabelTooltip": [4, "tick-label-tooltip"],
        "legendTooltip": [4, "legend-tooltip"],
        "threshold": [2],
        "noFirstLegend": [4, "no-first-legend"]
    }, [[1, "click", "handleOutsideClick"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-bar"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-bar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrBarCohesion);
            }
            break;
    } });
}

const HbrBar = HbrBarCohesion;
const defineCustomElement = defineCustomElement$1;

export { HbrBar, defineCustomElement };

