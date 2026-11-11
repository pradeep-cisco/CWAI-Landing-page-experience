import { proxyCustomElement, HTMLElement, h, Fragment, Host } from '@stencil/core/internal/client';
import { c as cjs } from './cjs.js';
import { p as preloadSanitizeHtml } from './sanitizeHtml.js';
import { d as defineCustomElement$7 } from './board.js';
import { d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$5 } from './illustration.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';

const matrixCss = ":host{--control-border-radius:var(--hbr-border-radius-md);--control-margin:var(--hbr-spacing-lg);--control-font-size:var(--hbr-font-size-xl);--control-info-gap:var(--hbr-spacing-xs);--control-info-margin:var(--hbr-spacing-xs);--container-padding:var(--hbr-spacing-md);--control-icon-size:var(--hbr-font-size-md);--grid-cell-border-radius:var(--hbr-border-radius-sm);--grid-cell-icon-size:45%;--grid-cell-on-select-border-style:dashed;--popover-title-gap:var(--hbr-spacing-xs);--popover-table-spacing:var(--hbr-spacing-xs);--popover-odd-cell-font-weight:var(--hbr-font-weight-semibold, 600);--axis-top-magnetic-transform:rotate(-45deg);--axis-top-magnetic-top:46px;--axis-top-magnetic-left:8px;--axis-left-magnetic-margin-right:16px;--matrix-default-font-size:var(--hbr-font-size-xs);--axis-hover-bg-color:var(--interact-bg-weak-hover);--border-color:var(--control-border-default);--control-selected-bg:var(--control-bg-weak-active);--control-selected-color:var(--interact-icon-medium-active);--control-bg-hover:var(--control-bg-weak-hover);--control-color-hover:var(--interact-icon-medium-hover);--control-background:var(--control-bg-weak-default);--control-border:var(--control-border-weak-default) 1px solid;--grid-cell-bg-color:var(--base-bg-medium-default);--grid-cell-bg-color-hover:var(--negative-bg-medium-hover);--grid-cell-border:1px solid var(--border-color);--grid-cell-border-hover:1px solid var(--control-border-hover);--horizontal-axis-label-width:24px;--vertical-axis-label-height:24px;--matrix-control-right:0px;--matrix-control-bottom:0px;--matrix-control-left:auto;--matrix-control-top:auto;--matrix-control-display:flex;--matrix-legend-margin-horizontal:8px;--matrix-legend-margin-vertical:12px}:host .--hbr-chart{position:relative;width:calc(100% - 2 * var(--container-padding));height:calc(100% - 2 * var(--container-padding));display:flex;flex-direction:column;padding:var(--container-padding);font-size:var(--matrix-default-font-size);font-family:Inter}:host .axis-group{overflow:visible}:host .axis-group foreignObject{overflow:visible;color:var(--base-text-default)}:host .axis-group .--hover span hbr-truncate::part(base){background-color:var(--axis-hover-bg-color);border-radius:4px}:host .axis-group div[part=axis-top]{position:relative;white-space:nowrap;transform:var(--axis-top-magnetic-transform);top:var(--axis-top-magnetic-top);left:var(--axis-top-magnetic-left)}:host .axis-group div[part=axis-top]>span{display:block}:host .axis-group div[part=axis-left]{height:100%;width:100%;display:flex;align-items:center;justify-content:flex-end}:host .axis-group div[part=axis-left]>span{margin-right:var(--axis-left-magnetic-margin-right);display:block;text-align:right}:host .axis-group div[part=axis-right]>span{display:block}:host .axis-group div[part=axis-bottom]>span{display:block}:host hbr-chart-board{position:relative}:host .chart-matrix__label-center{display:flex;flex-grow:1;overflow-x:hidden}:host .chart-matrix__label-center svg{flex-grow:1}:host .chart-matrix__label-center>div{display:flex}:host .chart-matrix__label-center .chart-matrix__body{flex-grow:1;overflow-x:scroll;overflow-y:visible;display:block}:host .chart-matrix__label{text-align:center}:host .chart-matrix__control{box-shadow:0px 4px 12px 0px var(--control-bg-weak-active);position:absolute;border-radius:var(--control-border-radius);border:var(--control-border);bottom:var(--matrix-control-bottom);right:var(--matrix-control-right);left:var(--matrix-control-left);top:var(--matrix-control-top);display:var(--matrix-control-display);flex-direction:column;font-size:var(--control-font-size);overflow:hidden}:host .chart-matrix__control hbr-button{color:var(--control-icon-strong-default);background:var(--control-background)}:host .chart-matrix__control hbr-button[disabled]{color:var(--control-icon-strong-disabled) !important}:host .chart-matrix__control .--selected{background:var(--control-selected-bg)}:host .chart-matrix__control .--selected::part(base){color:var(--control-selected-color)}:host .chart-matrix__control .chart-matrix__info-block{display:flex;gap:var(--control-info-gap);align-items:center;margin:var(--control-info-margin)}:host .chart-matrix__control .chart-matrix__info-block hbr-icon{width:var(--control-icon-size);height:var(--control-icon-size)}:host .chart-matrix__control hbr-icon-button{--bg-hover:var(--control-bg-hover);--color-hover:var(--control-color-hover)}:host .chart-matrix__control hbr-icon-button::part(base){border-radius:0}:host .grid-cell{overflow:visible}:host .grid-cell>div{width:100%;height:100%;border-radius:var(--grid-cell-border-radius);box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:visible}:host .grid-cell>div:focus{outline:none}:host .grid-cell hbr-icon{pointer-events:none}:host .chart-matrix__popover{color:var(--base-text-default)}:host .chart-matrix__popover .title hbr-tag::part(content){display:flex;align-items:center;gap:var(--popover-title-gap)}:host .chart-matrix__popover table{border-spacing:var(--popover-table-spacing)}:host .chart-matrix__popover td:first-child{font-weight:var(--popover-odd-cell-font-weight)}:host ::slotted([slot=axis-label-top]){display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--base-text-default);gap:var(--hbr-spacing-xs);height:var(--vertical-axis-label-height)}:host ::slotted([slot=axis-label-bottom]){display:flex;align-items:center;justify-content:center;font-weight:700;gap:var(--hbr-spacing-xs);color:var(--base-text-default);height:var(--vertical-axis-label-height)}:host ::slotted([slot=axis-label-left]){display:flex;align-items:center;justify-content:center;font-weight:700;gap:var(--hbr-spacing-xs);color:var(--base-text-default);transform:rotate(270deg);width:var(--horizontal-axis-label-width);pointer-events:none}:host ::slotted([slot=axis-label-right]){display:flex;align-items:center;justify-content:center;font-weight:700;gap:var(--hbr-spacing-xs);color:var(--base-text-default);transform:rotate(270deg);width:var(--horizontal-axis-label-width);pointer-events:none}:host .chart-matrix__label-top-container ::slotted(*){margin-bottom:var(--matrix-legend-margin-vertical)}:host .chart-matrix__label-bottom-container ::slotted(*){margin-top:var(--matrix-legend-margin-vertical)}:host .chart-matrix__label-left-container ::slotted(*){margin-right:var(--matrix-legend-margin-horizontal)}:host .chart-matrix__label-right-container ::slotted(*){margin-left:var(--matrix-legend-margin-horizontal)}";
const HbrMatrixChartStyle0 = matrixCss;

const LABEL_HEIGHT_TOP_OR_BOTTOM = 60;
const LABEL_WIDTH_LEFT_OR_RIGHT = 80;
const LABEL_TRUNCATE_WIDTH = 110;
const HbrMatrixChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrMatrixChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.keyboardFocusedIndex = -1;
        this.onZooming = (isZoomIn) => {
            var _a, _b, _c, _d, _e;
            const { fullConfig } = this;
            const nextIndex = ((_a = fullConfig.grid) === null || _a === void 0 ? void 0 : _a.itemSizes.findIndex((size) => size === this.gridSize.blockSize)) + (isZoomIn ? 1 : -1);
            if (nextIndex >= 0 && nextIndex < ((_b = fullConfig.grid) === null || _b === void 0 ? void 0 : _b.itemSizes.length)) {
                const newSize = {
                    blockSize: (_c = fullConfig.grid) === null || _c === void 0 ? void 0 : _c.itemSizes[nextIndex],
                    gapSize: (_d = fullConfig.grid) === null || _d === void 0 ? void 0 : _d.gapSizes[nextIndex],
                    iconSize: (_e = fullConfig.grid) === null || _e === void 0 ? void 0 : _e.iconSizes[nextIndex],
                };
                this.gridSize = newSize;
            }
        };
        this.onModeChange = (event) => {
            var _a, _b, _c, _d;
            if (!this.matrixRuntime) {
                return;
            }
            this.keyboardFocusedIndex = -1;
            const items = this.matrixRuntime.getAllEnabledCells(this.chartRef);
            if (this.mode === "view") {
                this.mode = "edit";
                items.forEach((item) => {
                    const status = item.getAttribute("data-selected") === "true"
                        ? "selected"
                        : "default";
                    this.matrixRuntime.applyItemStyleFromStatus(item, status, "edit", this.fullConfig.statuses, this.gridSize.iconSize);
                });
                (_b = (_a = this.fullConfig) === null || _a === void 0 ? void 0 : _a.onSwitchMode) === null || _b === void 0 ? void 0 : _b.call(_a, event, this.mode);
            }
            else {
                this.mode = "view";
                items.forEach((item) => {
                    this.matrixRuntime.applyItemStyleFromStatus(item, "default", "view", this.fullConfig.statuses, this.gridSize.iconSize);
                });
                (_d = (_c = this.fullConfig) === null || _c === void 0 ? void 0 : _c.onSwitchMode) === null || _d === void 0 ? void 0 : _d.call(_c, event, this.mode, this.selectedItems);
            }
        };
        this.showAxisTooltip = (event, data) => {
            if (!this.matrixRuntime) {
                return;
            }
            this.tooltipContent = this.matrixRuntime.setDefaultAxisTooltipTemplate(h, data);
            this.tooltipRef.open = true;
            this.tooltipRef.anchor = event.target;
        };
        this.hideAxisTooltip = () => {
            this.tooltipRef.open = false;
        };
        this.renderChart = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            if (!this.matrixRuntime) {
                return null;
            }
            const runtime = this.matrixRuntime;
            const { blockSize, gapSize, iconSize } = this.gridSize;
            const defaultConfig = runtime.getDefaultConfig(LABEL_HEIGHT_TOP_OR_BOTTOM, LABEL_WIDTH_LEFT_OR_RIGHT, this.showAxisTooltip, this.hideAxisTooltip, this.config.axis, LABEL_TRUNCATE_WIDTH);
            this.fullConfig = cjs(defaultConfig, this.config);
            const { axis, data = [] } = this.fullConfig;
            const rowLabels = runtime.getRowLabels(data);
            const colLabels = runtime.getColumnLabels(data);
            const complete2DAry = runtime.fillColIfEmpty(data, colLabels);
            this.fullConfig.eventListeners.view = runtime.getModeViewEventHandlers(this, complete2DAry, h);
            this.fullConfig.eventListeners.edit =
                runtime.getModeEditEventHandlers(this);
            const labelHeight = axis.top.height || LABEL_HEIGHT_TOP_OR_BOTTOM;
            const labelWidth = axis.left.width || LABEL_WIDTH_LEFT_OR_RIGHT;
            const marginLeft = ((_a = axis === null || axis === void 0 ? void 0 : axis.left) === null || _a === void 0 ? void 0 : _a.enabled) ? labelWidth : 0;
            const marginTop = ((_b = axis === null || axis === void 0 ? void 0 : axis.top) === null || _b === void 0 ? void 0 : _b.enabled) ? labelHeight : 0;
            const { containerWidth, containerHeight } = runtime.calculateContainerDimensions(axis, complete2DAry, blockSize, gapSize);
            const labelLeftWidth = ((_c = this.labelLeftRef) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().width) || 0;
            const labelRightWidth = ((_d = this.labelRightRef) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().width) || 0;
            const { onKeyDown } = runtime.getContainerKeyboardEvents(this);
            return (h(Fragment, null, h("div", { class: "chart-matrix__label-top-container", ref: (el) => {
                    this.labelTopRef = el;
                }, style: {
                    marginLeft: `${((_e = axis === null || axis === void 0 ? void 0 : axis.left) === null || _e === void 0 ? void 0 : _e.enabled) ? labelWidth + labelLeftWidth : labelLeftWidth}px`,
                    marginRight: `${((_f = axis === null || axis === void 0 ? void 0 : axis.right) === null || _f === void 0 ? void 0 : _f.enabled)
                        ? labelWidth + labelRightWidth
                        : labelRightWidth}px`,
                } }, h("slot", { name: "axis-label-top" })), h("div", { class: "chart-matrix__label-center" }, h("div", { class: "chart-matrix__label-left-container", ref: (el) => {
                    this.labelLeftRef = el;
                }, style: {
                    marginTop: ((_g = axis === null || axis === void 0 ? void 0 : axis.top) === null || _g === void 0 ? void 0 : _g.enabled) ? `${labelHeight}px` : "0",
                } }, h("slot", { name: "axis-label-left" })), h("div", { class: "chart-matrix__body" }, h("svg", { xmlns: "http://www.w3.org/2000/svg", role: "application", width: containerWidth, height: containerHeight, tabindex: 0, onKeyDown: onKeyDown }, h("title", null), ((_h = axis === null || axis === void 0 ? void 0 : axis.top) === null || _h === void 0 ? void 0 : _h.enabled) &&
                runtime.generateAxisTop(colLabels, blockSize, gapSize, Object.assign(Object.assign({}, axis === null || axis === void 0 ? void 0 : axis.top), { height: (axis === null || axis === void 0 ? void 0 : axis.top.height) || labelHeight }), marginLeft, this.el), ((_j = axis === null || axis === void 0 ? void 0 : axis.bottom) === null || _j === void 0 ? void 0 : _j.enabled) &&
                runtime.generateAxisBottom(colLabels, blockSize, gapSize, Object.assign(Object.assign({}, axis === null || axis === void 0 ? void 0 : axis.bottom), { height: (axis === null || axis === void 0 ? void 0 : axis.bottom.height) || labelHeight }), marginTop + complete2DAry.length * (blockSize + gapSize), marginLeft, this.el), ((_k = axis === null || axis === void 0 ? void 0 : axis.left) === null || _k === void 0 ? void 0 : _k.enabled) &&
                runtime.generateAxisLegendLeft(rowLabels, blockSize, gapSize, Object.assign(Object.assign({}, axis === null || axis === void 0 ? void 0 : axis.left), { width: (axis === null || axis === void 0 ? void 0 : axis.left.width) || labelWidth }), marginTop, this.el), ((_l = axis === null || axis === void 0 ? void 0 : axis.right) === null || _l === void 0 ? void 0 : _l.enabled) &&
                runtime.generateAxisRight(rowLabels, blockSize, gapSize, Object.assign(Object.assign({}, axis === null || axis === void 0 ? void 0 : axis.right), { width: (axis === null || axis === void 0 ? void 0 : axis.right.width) || labelWidth }), marginTop, marginLeft +
                    complete2DAry[0].data.length * (blockSize + gapSize) -
                    gapSize, this.el), runtime.generateDataBlock(complete2DAry, blockSize, gapSize, iconSize, marginLeft, marginTop, this.mode, this.fullConfig, this.selectedItems))), h("div", { class: "chart-matrix__label-right-container", ref: (el) => {
                    this.labelRightRef = el;
                }, style: {
                    marginTop: ((_m = axis === null || axis === void 0 ? void 0 : axis.top) === null || _m === void 0 ? void 0 : _m.enabled) ? `${labelHeight}px` : "0",
                } }, h("slot", { name: "axis-label-right" }))), h("div", { class: "chart-matrix__label-bottom-container", style: {
                    marginLeft: `${((_o = axis === null || axis === void 0 ? void 0 : axis.left) === null || _o === void 0 ? void 0 : _o.enabled) ? labelWidth + labelLeftWidth : labelLeftWidth}px`,
                    marginRight: `${((_p = axis === null || axis === void 0 ? void 0 : axis.right) === null || _p === void 0 ? void 0 : _p.enabled)
                        ? labelWidth + labelRightWidth
                        : labelRightWidth}px`,
                } }, h("slot", { name: "axis-label-bottom" }))));
        };
        this.config = {
            data: [],
            statuses: {},
            axis: {
                left: { enabled: false },
                right: { enabled: false },
                top: { enabled: false },
                bottom: { enabled: false },
            },
            accessibility: { ariaLabel: () => "" },
        };
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
        this.gridSize = {
            blockSize: 0,
            gapSize: 0,
            iconSize: 0,
        };
        this.mode = "view";
        this.tooltipContent = undefined;
        this.selectedItems = {};
        this.hoveredItems = { row: "", col: "", obj: {} };
        this.popoverOptions = undefined;
    }
    async componentWillLoad() {
        const [matrixRuntime] = await Promise.all([
            import('./matrix-runtime.js'),
            preloadSanitizeHtml(),
        ]);
        this.matrixRuntime = matrixRuntime;
    }
    componentDidLoad() {
        var _a, _b, _c, _d;
        if (!this.matrixRuntime) {
            return;
        }
        //stencil bug https://github.com/ionic-team/stencil/issues/3193
        this.matrixRuntime.setForeignObjectAttributes(this.chartRef);
        const idx = (_a = this.fullConfig.grid) === null || _a === void 0 ? void 0 : _a.itemSizes.findIndex((size) => { var _a; return size === ((_a = this.fullConfig.grid) === null || _a === void 0 ? void 0 : _a.defaultSize); });
        if (idx !== -1) {
            this.gridSize.blockSize = (_b = this.fullConfig.grid) === null || _b === void 0 ? void 0 : _b.itemSizes[idx];
            this.gridSize.gapSize = (_c = this.fullConfig.grid) === null || _c === void 0 ? void 0 : _c.gapSizes[idx];
            this.gridSize.iconSize = (_d = this.fullConfig.grid) === null || _d === void 0 ? void 0 : _d.iconSizes[idx];
            this.gridSize = JSON.parse(JSON.stringify(this.gridSize));
        }
    }
    async selectAll() {
        if (!this.matrixRuntime) {
            return this.selectedItems;
        }
        const items = this.matrixRuntime.getAllEnabledCells(this.chartRef);
        items.forEach((item) => {
            const row = item.getAttribute("data-row");
            const col = item.getAttribute("data-col");
            const status = item.getAttribute("data-status") || "default";
            this.selectedItems = Object.assign({ [`${row}-${col}`]: { status: status } }, this.selectedItems);
            this.matrixRuntime.applyItemStyleFromStatus(item, "selected", "edit", this.fullConfig.statuses, this.gridSize.iconSize);
        });
        return this.selectedItems;
    }
    async deselectAll() {
        if (!this.matrixRuntime) {
            return this.selectedItems;
        }
        this.selectedItems = {};
        const items = this.matrixRuntime.getAllEnabledCells(this.chartRef);
        items.forEach((item) => {
            this.matrixRuntime.applyItemStyleFromStatus(item, "default", "edit", this.fullConfig.statuses, this.gridSize.iconSize);
        });
        return this.selectedItems;
    }
    handleOutsideClick() {
        if (!this.matrixRuntime) {
            return;
        }
        const item = this.chartRef.querySelector(`[data-index="${this.keyboardFocusedIndex}"]`);
        if (item) {
            item.firstElementChild.removeAttribute("tabindex");
            item.firstElementChild.blur();
        }
        this.keyboardFocusedIndex = -1;
        const items = Array.from(this.chartRef.querySelectorAll(".grid-cell")).filter((r) => r.getAttribute("data-disabled") !== "true");
        items.forEach((item) => {
            const status = item.getAttribute("data-selected") === "true" ? "selected" : "default";
            const mode = this.mode === "edit" ? "edit" : "view";
            this.matrixRuntime.applyItemStyleFromStatus(item, status, mode, this.fullConfig.statuses, this.gridSize.iconSize);
        });
    }
    onGridSizeChange() {
        setTimeout(() => {
            var _a;
            (_a = this.matrixRuntime) === null || _a === void 0 ? void 0 : _a.setForeignObjectAttributes(this.chartRef);
        }, 100);
    }
    render() {
        var _a;
        if (!this.matrixRuntime) {
            return null;
        }
        const popoverOptions = Object.assign({ distance: 10, variant: "chart" }, this.popoverOptions);
        const gridBlock = this.renderChart();
        const controlBlock = this.matrixRuntime.generateControlPanel(this.onZooming, this.onModeChange, this.mode, this.fullConfig, this.gridSize.blockSize, this.controlRef, (el) => {
            this.controlRef = el;
        });
        return (h(Host, null, h("hbr-chart-board", { type: "bar", ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: !((_a = this.config.data) === null || _a === void 0 ? void 0 : _a.length), style: { width: this.width, height: this.height }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({}, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { slot: "content" }, this.tooltipContent)), h("div", { slot: "header", part: "header", class: "chart-matrix__header" }, h("slot", { name: "header" }, h("div", null, h("slot", { name: "header-title" })), h("div", null, h("slot", { name: "header-action" })))), h("div", { ref: (el) => {
                this.chartRef = el;
            }, class: "--hbr-chart --matrix-chart", part: "chart" }, gridBlock), controlBlock, h("slot", { name: "footer", slot: "footer" }), h("slot", { name: "loading-state", slot: "loading-state" }), h("slot", { name: "empty-state", slot: "empty-state" }))));
    }
    get el() { return this; }
    static get watchers() { return {
        "gridSize": ["onGridSizeChange"]
    }; }
    static get style() { return HbrMatrixChartStyle0; }
}, [1, "hbr-matrix-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
        "mode": [1025],
        "selectedItems": [1040],
        "popoverOptions": [16],
        "gridSize": [32],
        "tooltipContent": [32],
        "hoveredItems": [32],
        "selectAll": [64],
        "deselectAll": [64]
    }, [[1, "click", "handleOutsideClick"]], {
        "gridSize": ["onGridSizeChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-matrix-chart", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-matrix-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrMatrixChart$1);
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

const HbrMatrixChart = HbrMatrixChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrMatrixChart, defineCustomElement };

