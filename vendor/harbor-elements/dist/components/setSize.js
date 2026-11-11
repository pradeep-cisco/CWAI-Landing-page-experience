import { R as React, H } from './client.js';
import { c as cjs } from './cjs.js';
import { c as combineMergeArray } from './combineMergeArray.js';
import { s as sanitizeHtml } from './sanitizeHtml.js';

function positionRadialLabel(container, margin) {
    const labelLayer = container.nextElementSibling;
    if (labelLayer) {
        const top = (margin === null || margin === void 0 ? void 0 : margin.top) || 40;
        const mystery = 20;
        labelLayer.style.top = `${-top + mystery}px`;
    }
}
const arcLabelLink = (firstChild, children, dataLen) => firstChild.tagName === "g" &&
    children.length === dataLen &&
    firstChild.children &&
    firstChild.children.length === 2 &&
    firstChild.children[0].tagName === "path" &&
    firstChild.children[1].tagName === "text";
const donutRing = (firstChild, children, dataLen) => firstChild.tagName === "path" &&
    children.length === dataLen &&
    !firstChild.children.length;
const arcLabel = (firstChild) => firstChild.tagName === "g" &&
    firstChild.children.length === 1 &&
    firstChild.children[0].tagName === "text";
function addClass(el, data) {
    const dataLen = data.length;
    if (!el.classList.contains("--layer-radialLabel")) {
        const children = el && el.tagName === "g" && el.children;
        const firstChild = children === null || children === void 0 ? void 0 : children[0];
        if (firstChild) {
            const childrenArr = Array.from(children);
            if (arcLabelLink(firstChild, children, dataLen)) {
                el.classList.add("--layer-arcLabelLinks");
                childrenArr.forEach((label, i) => {
                    label.classList.add("--layer-arcLabelLink");
                    label.dataset.arcLabelLinkIndex = `${i}`;
                    label.children[0].classList.add("--layer-arcLabelLink-path");
                    label.children[1].classList.add("--layer-arcLabelLink-text");
                });
            }
            else if (donutRing(firstChild, children, dataLen)) {
                el.classList.add("--rings");
                childrenArr.forEach((path, i) => {
                    path.classList.add("--layer-ring");
                    path.dataset.ringIndex = `${i}`;
                    const { donutChart, config } = this;
                    const { margin } = config;
                    positionRadialLabel(donutChart, margin);
                });
            }
            else if (arcLabel(firstChild)) {
                el.classList.add("--layer-arcLabels");
                childrenArr.forEach((label, i) => {
                    label.classList.add("--layer-arcLabel");
                    label.dataset.arcLabelIndex = `${i}`;
                });
            }
        }
    }
}
function addClassesOnLayers(variant) {
    const { config } = this;
    const data = config.data;
    let svg;
    if (variant && variant === "sunburst") {
        svg = this.sunburstChart.querySelector("svg");
    }
    else {
        svg = this.donutChart.querySelector("svg");
    }
    if (svg) {
        const mainCanvas = svg.querySelector("g");
        mainCanvas.classList.add("--maincontainer");
        if (mainCanvas === null || mainCanvas === void 0 ? void 0 : mainCanvas.children) {
            Array.from(mainCanvas.children).forEach((g) => {
                addClass.call(this, g, data);
            });
        }
        else {
            console.warn("Something went wrong. Chart is not available.");
        }
    }
}

function handleOutsideClick() {
    // const notSelected = this.donutChart.querySelectorAll(".--donut--not--selected") as NodeListOf<HTMLElement>;
    // const selected = this.donutChart.querySelector(".--donut--selected");
    // selected?.classList.remove("--donut--selected");
    // if (notSelected?.length) {
    //   Array.from(notSelected).forEach(path => path?.classList.remove("--donut--not--selected"));
    // }
}
/** will clean up after UX confirms this */
// function handleLegendClick(parentItem, config) {
//need to turn whole donut to this one... and change radial.. config update...
// const idx = parentItem?.dataset?.legend;
// const selected = config.data[Number(idx)];
// }
function clickEvents(path) {
    const firstItemOnPath = path[0];
    const parentItem = firstItemOnPath === null || firstItemOnPath === void 0 ? void 0 : firstItemOnPath.parentElement;
    if (!parentItem.classList.contains("--rings")) {
        handleOutsideClick.call(this);
    }
    // if (firstItemOnPath.classList.contains("--legend-rect")) {
    //     handleLegendClick.call(this, parentItem, config);
    // }
}

function dividerLayer({ centerX, centerY }) {
    const { width, margin } = this.config;
    const paddingTop = 24;
    const yPos = this.partialLimited
        ? centerY + paddingTop
        : centerY * 2 + paddingTop;
    const x2Pos = this._size
        ? this._size.width - ((margin && margin.left + margin.right) || 0)
        : width
            ? width
            : 240;
    return React.createElement("g", {
        className: "--legends-divider",
    }, React.createElement("line", {
        opacity: 1,
        x1: centerX - x2Pos / 2,
        x2: centerX + x2Pos / 2,
        y1: yPos,
        y2: yPos,
        stroke: "var(--hbr-color-neutral-border)",
        strokeWidth: 1,
        className: "--legends-divider-line",
    }, null));
}

function labelNextRingLayer(props) {
    const { centerX, centerY, dataWithArc, innerRadius } = props;
    const thick = dataWithArc[0].arc.thickness;
    return React.createElement("g", {
        className: "--layer-partial-labels",
    }, React.createElement("text", {
        x: centerX - innerRadius + thick / 4,
        y: centerY - 6,
        textAnchor: "middle",
        className: "--layer-partial-label-0",
        dominantBaseline: "central",
        fontSize: "var(--hbr-font-size-2xs)",
        fontWeight: "var(--hbr-font-weight-light)",
        letterSpacing: "var(--hbr-font-letter-spacing-loose)",
    }, "0"), React.createElement("text", {
        x: centerX + innerRadius - thick / 4 - 6,
        y: centerY - 6,
        textAnchor: "middle",
        className: "--layer-partial-label-1",
        dominantBaseline: "central",
        fontSize: "var(--hbr-font-size-2xs)",
        fontWeight: "var(--hbr-font-weight-light)",
        letterSpacing: "var(--hbr-font-letter-spacing-loose)",
    }, "100"));
}

const LegendTooltip = async (config, props, evt, right) => {
    const { valueFormat } = config;
    const { currentTarget, relatedTarget } = evt;
    const { dataWithArc, centerX, centerY } = props;
    const targetLegend = currentTarget.tagName === "rect" && currentTarget.nextElementSibling;
    if (targetLegend) {
        let matched;
        const targetElColor = targetLegend.getAttribute("fill");
        if (targetElColor) {
            const slice = dataWithArc.filter((item) => item.color === targetElColor);
            if (slice.length) {
                matched = slice[0];
                let divContainer = relatedTarget;
                if (!divContainer ||
                    !divContainer.tagName ||
                    divContainer.tagName !== "DIV") {
                    divContainer = currentTarget.closest("svg").parentElement;
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
                    const stackedKeyValue = `
            <div class="tooltip-content-item">
              <div class="tooltip-content-shape">
                <span style="background-color: ${matched.color};"></span>
              </div>
              <div class="tooltip-content-id">${matched.label}</div>
              <div class="tooltip-content-value">
                ${valueFormat ? valueFormat(matched.value) : matched.value}
              </div>
            </div>
          `;
                    div.innerHTML = await sanitizeHtml(`
            <div class="tooltip-content">
              ${stackedKeyValue}
            </div>
          `);
                    tooltipWrapper.appendChild(div);
                    divContainer.appendChild(tooltipWrapper);
                    const tooltipRect = tooltipWrapper.getBoundingClientRect();
                    const tooltipOffset = {
                        width: tooltipRect.width,
                        height: tooltipRect.height,
                    };
                    const { startAngle, endAngle, innerRadius, outerRadius } = matched.arc;
                    const theta = (endAngle - startAngle) / 2 + startAngle - Math.PI / 2;
                    const r = (innerRadius + outerRadius) / 2;
                    const x = r * Math.cos(theta);
                    const y = r * Math.sin(theta);
                    if (tooltipOffset) {
                        const { width, height } = tooltipOffset;
                        const xPos = right ? centerX + x - width : centerX + x - width / 4;
                        const yPos = centerY + y + height / 4;
                        tooltipWrapper.style.transform = `translate(${xPos}px, ${yPos}px)`;
                        tooltipWrapper.style.visibility = "visible";
                    }
                }
            }
        }
    }
};
function CustomLegends(config, props) {
    var _a;
    const legends = [
        {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 68,
            itemsSpacing: 0,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "var(--hbr-color-neutral-text-weak)",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
        },
    ];
    let _legends;
    if ((_a = config.legends) === null || _a === void 0 ? void 0 : _a.length) {
        _legends = config.legends.map((leg, i) => cjs.all([legends[i], leg], {
            arrayMerge: combineMergeArray,
        }));
    }
    else {
        _legends = legends;
    }
    const { centerX, centerY, dataWithArc } = props;
    if (!Array.isArray(dataWithArc))
        return React.createElement(React.Fragment, {});
    const LegendsNodes = _legends.map((legend, i) => {
        legend.data = dataWithArc;
        let paths = [];
        if (this.rightLegend) {
            legend.anchor = legend.anchor || "right";
            legend.direction = legend.direction || "column";
            legend.translateX = legend.translateX || 24;
            legend.translateY = legend.translateY || 0;
        }
        /**
         * no tooltip if either legendTooltip or config.isInteractive is set to false
         * no dehighlight if only isInteractive is false
         * */
        const noInteraction = config.isInteractive !== undefined && !config.isInteractive;
        const noTooltip = !this.legendTooltip || noInteraction;
        if (noTooltip) {
            if (noInteraction) {
                return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { style: { cursor: "default" }, containerHeight: centerY * 2, containerWidth: centerX * 2 }));
            }
            return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { style: { cursor: "default" }, containerHeight: centerY * 2, containerWidth: centerX * 2, onMouseEnter: (data, evt) => {
                    const root = evt.currentTarget.closest("svg");
                    paths = root.querySelectorAll("svg path[fill]");
                    Array.from(paths)
                        .filter((p) => p.getAttribute("fill") !== data.color)
                        .forEach((p) => p.classList.add("--donut--dehighlight"));
                }, 
                // @ts-ignore
                onMouseLeave: (date, evt) => {
                    const root = evt.currentTarget.closest("svg");
                    paths = root.querySelectorAll("svg path[fill]");
                    Array.from(paths).forEach((p) => p.classList.remove("--donut--dehighlight"));
                } }));
        }
        return React.createElement(H, Object.assign(Object.assign({ key: i }, legend), { style: { cursor: "default" }, containerHeight: centerY * 2, containerWidth: centerX * 2, 
            // onClick: (data, evt) => {
            // the future implementation
            // https://nxt-cisco.invisionapp.com/share/9AYEWNA5M4X#/screens/435679659
            // },
            onMouseEnter: (data, evt) => {
                const root = evt.currentTarget.closest("svg");
                paths = root.querySelectorAll("svg path[fill]");
                Array.from(paths)
                    .filter((p) => p.getAttribute("fill") !== data.color)
                    .forEach((p) => p.classList.add("--donut--dehighlight"));
                LegendTooltip(config, props, evt, this.rightLegend);
            }, 
            // @ts-ignore
            onMouseLeave: (data, evt) => {
                let container = evt.relatedTarget;
                if (!container || !container.tagName || container.tagName !== "DIV") {
                    container = evt.target.closest("svg").parentElement;
                }
                if (container) {
                    const tooltip = container.querySelector(".--tooltip-legend");
                    if (tooltip)
                        tooltip.remove();
                }
                const root = evt.currentTarget.closest("svg");
                paths = root.querySelectorAll("svg path[fill]");
                Array.from(paths).forEach((p) => p.classList.remove("--donut--dehighlight"));
            } }));
    });
    return React.createElement(React.Fragment, {}, LegendsNodes);
}

function radialLabelLayer(props) {
    const { partialLimited, sunburst, radialLabel } = this;
    const { text, format } = radialLabel;
    const { centerX, centerY, innerRadius } = props;
    let dataWithArc;
    let nodes;
    let total = 0;
    if (sunburst) {
        nodes = props.nodes;
        nodes.forEach((datum) => (total += datum.depth === 1 ? datum.value : 0));
    }
    else {
        dataWithArc = props.dataWithArc;
        dataWithArc.forEach((datum) => (total += datum.value));
    }
    const large = this.size && this.size === "large";
    const distanceTop = partialLimited
        ? centerY - innerRadius + innerRadius / 2
        : centerY - 12;
    const distanceBottom = partialLimited
        ? centerY - innerRadius + innerRadius / 2 + innerRadius / 4
        : centerY + 12;
    return React.createElement("g", {
        className: "--layer-radialLabel",
    }, React.createElement("text", {
        x: centerX,
        y: distanceTop,
        textAnchor: "middle",
        className: "--layer-radialLabel-total",
        dominantBaseline: "central",
        fontSize: this === "partialLimited"
            ? large
                ? "var(--hbr-font-size-2xl)"
                : "var(--hbr-font-size-sm)"
            : "var(--hbr-font-size-xl)",
        fontWeight: "var(--hbr-font-weight-normal)",
        letterSpacing: "var(--hbr-font-letter-spacing-loose)",
        fill: "var(--hbr-color-neutral-text-weak)",
    }, format ? format(total) : total), React.createElement("text", {
        x: centerX,
        y: distanceBottom,
        textAnchor: "middle",
        className: "--layer-radialLabel-desc",
        dominantBaseline: "central",
        fontSize: this === "partialLimited"
            ? large
                ? "var(--hbr-font-size-sm)"
                : "var(--hbr-font-size-2xs)"
            : "var(--hbr-font-size-2xs)",
        fontWeight: "var(--hbr-font-weight-light)",
        letterSpacing: "var(--hbr-font-letter-spacing-loose)",
        fill: "var(--hbr-color-neutral-text-weak)",
    }, text));
}

function configSetup(size, config) {
    var _a;
    const layers = getLayers.call(this, config, "donut");
    if (this.radialLabel) {
        config.layers = [...layers, radialLabelLayer.bind(this)];
    }
    else {
        config.layers = layers;
    }
    if (((_a = this._legend) === null || _a === void 0 ? void 0 : _a.contains) && config.legends && config.legends[0]) {
        if (!config.legends[0].symbolSize) {
            config.legends[0].symbolSize = size === "small" ? 6 : 12;
        }
        if (!config.legends[0].itemsSpacing) {
            config.legends[0].itemsSpacing = size === "small" ? -36 : -24;
        }
    }
}

function getLayers(config, chartType) {
    const layers = ["arcs", "arcLabels"];
    let _layers;
    if (config.layers && Array.isArray(config.layers)) {
        _layers = config.layers;
    }
    else {
        _layers = layers;
    }
    const arcLinkIdx = _layers.findIndex((lyr) => lyr === "arcLinkLabels");
    if (-1 < arcLinkIdx) {
        _layers.splice(arcLinkIdx, 1);
    }
    _layers.unshift("arcLinkLabels");
    if (!chartType || chartType !== "sunburst") {
        if (this.hasLegends) {
            const legendsLayerIdx = _layers.findIndex((lyr) => lyr === "legends");
            if (-1 < legendsLayerIdx) {
                _layers.splice(legendsLayerIdx, 1);
            }
            if (this.rightLegend) {
                _layers.push(CustomLegends.bind(this, config));
            }
            else {
                _layers = [
                    ..._layers,
                    CustomLegends.bind(this, config),
                    dividerLayer.bind(this),
                ];
            }
        }
        if (this.partialLimited) {
            _layers.push(labelNextRingLayer.bind(this));
        }
    }
    return _layers;
}

function getSize(cls) {
    if (cls.includes("--size-")) {
        const clsArr = cls.split(" ");
        const idx = clsArr.findIndex((v) => v.includes("--size-"));
        if (-1 < idx) {
            const found = clsArr[idx];
            return found.slice(found.lastIndexOf("-") + 1);
        }
    }
    return;
}

function setMargin(size, legends, linkLabel) {
    let margin = { top: 40, bottom: 80, left: 0, right: 80 };
    if (size) {
        const rightLegend = legends && legends === "right";
        const hasLegends = legends && legends === "bottom";
        if (size === "small") {
            if (rightLegend) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 20, left: -10, right: 100 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: -50, right: 50 };
                }
            }
            else if (hasLegends) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 80, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 80, left: 0, right: 0 };
                }
            }
            else {
                if (linkLabel) {
                    margin = { top: 20, bottom: 0, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: 20, right: 20 };
                }
            }
        }
        else if (size === "medium") {
            if (rightLegend) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 20, left: -10, right: 100 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: -50, right: 100 };
                }
            }
            else if (hasLegends) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 80, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 80, left: 20, right: 20 };
                }
            }
            else {
                if (linkLabel) {
                    margin = { top: 20, bottom: 0, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: 20, right: 20 };
                }
            }
        }
        else if (size === "large") {
            if (rightLegend) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 20, left: -10, right: 100 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: -50, right: 100 };
                }
            }
            else if (hasLegends) {
                if (linkLabel) {
                    margin = { top: 20, bottom: 80, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 80, left: 20, right: 20 };
                }
            }
            else {
                if (linkLabel) {
                    margin = { top: 20, bottom: 0, left: 50, right: 50 };
                }
                else {
                    margin = { top: 20, bottom: 20, left: 20, right: 20 };
                }
            }
        }
    }
    return margin;
}

function setSize(size, config) {
    var _a;
    if (!size)
        return;
    const { enableArcLinkLabels, legends, startAngle, endAngle } = config;
    const partialLimited = endAngle === 90 && Math.abs(startAngle) === endAngle;
    this.hasLegends = !this.sunburst && (legends === undefined || legends.length);
    this.rightLegend = ((_a = legends === null || legends === void 0 ? void 0 : legends[0]) === null || _a === void 0 ? void 0 : _a.anchor) && legends[0].anchor === "right";
    const { hasLegends, rightLegend } = this;
    let width;
    let height;
    let _margin;
    if (size === "small") {
        if (rightLegend) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 20, left: -10, right: 100 };
                width = 362;
                height = 208;
            }
            else {
                _margin = { top: 20, bottom: 20, left: -50, right: 80 };
                width = 365;
                height = 208;
            }
        }
        else if (hasLegends) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 80, left: 50, right: 50 };
                width = 286;
                height = 246;
            }
            else {
                _margin = { top: 20, bottom: 80, left: 0, right: 0 };
                width = 222;
                height = 268;
            }
        }
        else {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 0, left: 50, right: 50 };
                width = 268;
                height = 242;
            }
            else {
                _margin = { top: 20, bottom: 20, left: 20, right: 20 };
                width = 208;
                height = 208;
            }
        }
    }
    else if (size === "medium") {
        if (rightLegend) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 20, left: -10, right: 100 };
                width = 440;
                height = 286;
            }
            else {
                _margin = { top: 20, bottom: 20, left: -50, right: 100 };
                width = 440;
                height = 286;
            }
        }
        else if (hasLegends) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 80, left: 50, right: 50 };
                width = 346;
                height = 346;
            }
            else {
                if (partialLimited) {
                    _margin = { top: 20, bottom: 80, left: 20, right: 20 };
                    width = 285;
                    height = 220;
                }
                else {
                    _margin = { top: 20, bottom: 80, left: 20, right: 20 };
                    width = 300;
                    height = 346;
                }
            }
        }
        else {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 0, left: 50, right: 50 };
                width = 346;
                height = 320;
            }
            else {
                if (this.sunburst) {
                    _margin = { top: 20, bottom: 20, left: 20, right: 20 };
                    width = 304;
                    height = 304;
                }
                else {
                    _margin = { top: 20, bottom: 20, left: 20, right: 20 };
                    width = 286;
                    height = 286;
                }
            }
        }
    }
    else if (size === "large") {
        if (rightLegend) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 20, left: -10, right: 100 };
                width = 570;
                height = 415;
            }
            else {
                _margin = { top: 20, bottom: 20, left: -50, right: 100 };
                width = 568;
                height = 415;
            }
        }
        else if (hasLegends) {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 80, left: 50, right: 50 };
                width = 475;
                height = 475;
            }
            else {
                _margin = { top: 20, bottom: 80, left: 20, right: 20 };
                width = 428;
                height = 475;
            }
        }
        else {
            if (enableArcLinkLabels) {
                _margin = { top: 20, bottom: 0, left: 50, right: 50 };
                width = 475;
                height = 450;
            }
            else {
                _margin = { top: 20, bottom: 20, left: 20, right: 20 };
                width = 415;
                height = 415;
            }
        }
    }
    config.margin = config.margin
        ? cjs.all([_margin, config.margin], {
            arrayMerge: combineMergeArray,
        })
        : _margin;
    return {
        width: `${width}px`,
        height: `${height}px`,
    };
}

export { addClassesOnLayers as a, configSetup as b, clickEvents as c, setSize as d, getSize as g, setMargin as s };

