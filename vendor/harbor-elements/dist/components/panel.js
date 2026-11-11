import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { b as caretLeft, a as caretRight, Z as caretUp, c as caretDown } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$1 } from './icon.js';

class PanelResizeController {
    constructor(options) {
        this.options = options;
        this.resizing = false;
        this.startCoord = 0;
        this.startSize = 0;
        this.start = (event) => {
            var _a, _b;
            if (!this.options.isResizable() || this.options.isCollapsed()) {
                return;
            }
            event.preventDefault();
            this.resizing = true;
            this.startCoord = this.getAxis() === "y" ? event.clientY : event.clientX;
            this.startSize = this.options.getSize();
            (_b = (_a = this.options).onResizeStart) === null || _b === void 0 ? void 0 : _b.call(_a);
            window.addEventListener("mousemove", this.handleMove);
            window.addEventListener("mouseup", this.handleEnd);
        };
        this.handleMove = (event) => {
            var _a, _b;
            if (!this.resizing) {
                return;
            }
            const current = this.getAxis() === "y" ? event.clientY : event.clientX;
            const delta = (current - this.startCoord) * this.getDirection();
            const nextSize = this.clampSize(this.startSize + delta);
            this.options.setSize(nextSize);
            (_b = (_a = this.options).onResize) === null || _b === void 0 ? void 0 : _b.call(_a, nextSize);
        };
        this.handleEnd = () => {
            this.stop();
        };
    }
    get isResizing() {
        return this.resizing;
    }
    destroy() {
        this.stop();
    }
    clampSize(size) {
        const safeMin = Number.isFinite(this.options.getMinSize())
            ? this.options.getMinSize()
            : 120;
        const safeMax = Number.isFinite(this.options.getMaxSize())
            ? this.options.getMaxSize()
            : 700;
        const min = Math.min(safeMin, safeMax);
        const max = Math.max(safeMin, safeMax);
        const value = Number.isFinite(size) ? size : 320;
        return Math.min(Math.max(value, min), max);
    }
    getAxis() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.options).getAxis) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : "x";
    }
    getDirection() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.options).getDirection) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : 1;
    }
    stop() {
        var _a, _b;
        if (!this.resizing) {
            return;
        }
        this.resizing = false;
        window.removeEventListener("mousemove", this.handleMove);
        window.removeEventListener("mouseup", this.handleEnd);
        (_b = (_a = this.options).onResizeEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
}

const panelCss = ":host{--size:250px;--min-size:120px;--resizer-size:1px;--resizer-color:var(--control-border-weak-default);--collapsed-border-color:var(--resizer-color);--overflow:auto;display:block;box-sizing:border-box}:host([placement=left]),:host([placement=right]){height:100%}:host([placement=top]),:host([placement=bottom]){width:100%}.panel{position:relative;display:flex;height:100%;width:100%}.panel__container{position:relative;display:flex;flex-direction:column;box-sizing:border-box}.panel--placement-left .panel__container,.panel--placement-right .panel__container{min-width:var(--min-size);width:var(--size);height:100%}.panel--placement-right{justify-content:flex-end}.panel--collapsed.panel--placement-left .panel__container{border-right:var(--resizer-size) solid var(--resizer-color)}.panel--collapsed.panel--placement-right .panel__container{border-left:var(--resizer-size) solid var(--resizer-color)}.panel--placement-top .panel__container,.panel--placement-bottom .panel__container{min-height:var(--min-size);height:var(--size);width:100%}.panel--collapsed.panel--placement-top .panel__container{border-bottom:var(--resizer-size) solid var(--resizer-color)}.panel--collapsed.panel--placement-bottom .panel__container{border-top:var(--resizer-size) solid var(--resizer-color)}.panel__content{flex:1 1 auto;min-height:0;min-width:0;overflow:var(--overflow)}.panel__resizer{position:absolute;background:var(--resizer-color)}.panel--placement-left .panel__resizer{top:0;right:-1px;width:var(--resizer-size);height:100%}.panel--placement-right .panel__resizer{top:0;left:-1px;width:var(--resizer-size);height:100%}.panel--placement-top .panel__resizer{left:0;bottom:-1px;height:var(--resizer-size);width:100%}.panel--placement-bottom .panel__resizer{left:0;top:-1px;height:var(--resizer-size);width:100%}.panel--placement-left .panel__resizer-border,.panel--placement-right .panel__resizer-border{cursor:col-resize}.panel--placement-top .panel__resizer-border,.panel--placement-bottom .panel__resizer-border{cursor:row-resize}.panel--placement-left .panel__resizer-border:hover{right:-4px;width:4px;background:var(--control-bg-strong-hover)}.panel--placement-right .panel__resizer-border:hover{left:-4px;width:4px;background:var(--control-bg-strong-hover)}.panel--placement-top .panel__resizer-border:hover{bottom:-4px;height:4px;background:var(--control-bg-strong-hover)}.panel--placement-bottom .panel__resizer-border:hover{top:-4px;height:4px;background:var(--control-bg-strong-hover)}.panel--resizing.panel--placement-left,.panel--resizing.panel--placement-right{cursor:col-resize}.panel--resizing.panel--placement-top,.panel--resizing.panel--placement-bottom{cursor:row-resize}.panel--resizing.panel--placement-left .panel__resizer{right:-4px;width:4px;min-width:4px;background:var(--control-bg-strong-hover)}.panel--resizing.panel--placement-right .panel__resizer{left:-4px;width:4px;min-width:4px;background:var(--control-bg-strong-hover)}.panel--resizing.panel--placement-top .panel__resizer{bottom:-4px;height:4px;min-height:4px;background:var(--control-bg-strong-hover)}.panel--resizing.panel--placement-bottom .panel__resizer{top:-4px;height:4px;min-height:4px;background:var(--control-bg-strong-hover)}.panel__container-collapsed{overflow:hidden}.panel--placement-left .panel__container-collapsed,.panel--placement-right .panel__container-collapsed{max-width:0;width:0;min-width:0}.panel--placement-top .panel__container-collapsed,.panel--placement-bottom .panel__container-collapsed{max-height:0;height:0;min-height:0}.panel--placement-right .panel__container-collapsed{border-left-color:var(--collapsed-border-color)}.panel--placement-left .panel__container-collapsed{border-right-color:var(--collapsed-border-color)}.panel--placement-top .panel__container-collapsed{border-bottom-color:var(--collapsed-border-color)}.panel--placement-bottom .panel__container-collapsed{border-top-color:var(--collapsed-border-color)}.collapse-button{--button-thickness:18px;--button-length:48px;position:absolute;border:1px solid var(--control-border-weak-default);background:var(--base-bg-weak-default);color:var(--interact-icon-weak-default);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:var(--hbr-shadow-sm);padding:0}.collapse-button hbr-icon{position:absolute;font-size:12px}.panel--placement-left .collapse-button,.panel--placement-right .collapse-button{width:var(--button-thickness);height:var(--button-length);top:calc(min(50%, 40vh) - var(--button-length) / 2)}.panel--placement-left .collapse-button{left:var(--size);border-top-right-radius:8px;border-bottom-right-radius:8px}.panel--placement-right .collapse-button{right:var(--size);border-top-left-radius:8px;border-bottom-left-radius:8px}.panel--placement-left.panel--collapsed .collapse-button{left:0}.panel--placement-right.panel--collapsed .collapse-button{right:0}.panel--placement-top .collapse-button,.panel--placement-bottom .collapse-button{height:var(--button-thickness);width:var(--button-length);left:calc(50% - var(--button-length) / 2)}.panel--placement-top .collapse-button{top:var(--size);border-bottom-left-radius:8px;border-bottom-right-radius:8px}.panel--placement-bottom .collapse-button{bottom:var(--size);border-top-left-radius:8px;border-top-right-radius:8px}.panel--placement-top.panel--collapsed .collapse-button{top:0}.panel--placement-bottom.panel--collapsed .collapse-button{bottom:0}";
const HbrPanelStyle0 = panelCss;

const Panel = /*@__PURE__*/ proxyCustomElement(class Panel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrPanelCollapsed = createEvent(this, "hbr-panel-collapsed", 3);
        this.hbrPanelResizing = createEvent(this, "hbr-panel-resizing", 3);
        this.panelId = `hbr-panel__${++Panel.panelId}`;
        this.resizeController = new PanelResizeController({
            getSize: () => this.size,
            setSize: (size) => {
                this.size = size;
            },
            getMinSize: () => this.minSize,
            getMaxSize: () => this.maxSize,
            isResizable: () => this.resizable,
            isCollapsed: () => this.collapsed,
            getAxis: () => (this.isVertical() ? "y" : "x"),
            getDirection: () => this.placement === "right" || this.placement === "bottom" ? -1 : 1,
            onResizeStart: () => {
                this.isResizing = true;
            },
            onResize: (size) => {
                this.hbrPanelResizing.emit({ size });
            },
            onResizeEnd: () => {
                this.isResizing = false;
            },
        });
        this.onResizeStart = (event) => {
            this.resizeController.start(event);
        };
        this.onToggleCollapse = () => {
            this.collapsed = !this.collapsed;
            this.hbrPanelCollapsed.emit({ collapsed: this.collapsed });
        };
        this.collapsable = false;
        this.resizable = true;
        this.collapsed = false;
        this.size = 250;
        this.minSize = 24;
        this.maxSize = 800;
        this.placement = "left";
        this.isResizing = false;
    }
    componentWillLoad() {
        this.size = this.clampSize(this.size);
        this.host.style.setProperty("--size", `${this.size}px`);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.resizeController) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    onSizeChange(newValue) {
        this.size = this.clampSize(newValue);
        this.host.style.setProperty("--size", `${this.size}px`);
    }
    onLimitsChange() {
        this.size = this.clampSize(this.size);
    }
    clampSize(size) {
        return this.resizeController.clampSize(size);
    }
    isVertical() {
        return this.placement === "top" || this.placement === "bottom";
    }
    render() {
        var _a;
        const vertical = this.isVertical();
        let containerProp = {};
        if (this.collapsed) {
            containerProp = { inert: true };
        }
        if (this.resizable && !this.collapsed) {
            const sizeStyle = vertical
                ? { minHeight: `${this.size}px`, height: `${this.size}px` }
                : { minWidth: `${this.size}px`, width: `${this.size}px` };
            containerProp = Object.assign(Object.assign({}, containerProp), { style: sizeStyle });
        }
        const collapseIconName = this.collapsed
            ? this.placement === "right"
                ? "caret-left"
                : this.placement === "left"
                    ? "caret-right"
                    : this.placement === "bottom"
                        ? "caret-up"
                        : "caret-down"
            : this.placement === "right"
                ? "caret-right"
                : this.placement === "left"
                    ? "caret-left"
                    : this.placement === "bottom"
                        ? "caret-down"
                        : "caret-up";
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const fallbackByName = {
            "caret-left": caretLeft,
            "caret-right": caretRight,
            "caret-up": caretUp,
            "caret-down": caretDown,
        };
        const collapseIconAsset = (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons[collapseIconName]) || fallbackByName[collapseIconName];
        return (h(Host, { key: '416a591dbcf3daeeda7f438d292d8581a7bb9def' }, h("div", { key: '48a7e0eb2d4f80860582d5ae3a98674131606ee2', part: "base", class: {
                panel: true,
                "panel--resizable": this.resizable,
                "panel--resizing": this.isResizing,
                "panel--collapsed": this.collapsed,
                [`panel--placement-${this.placement}`]: true,
            } }, h("div", Object.assign({ key: 'cb89f8414ec5fe107f7bd3306160adb3092e54a8', part: "container", class: {
                panel__container: true,
                "panel__container-collapsed": this.collapsed,
            }, id: this.panelId }, containerProp), h("div", { key: '151a3654071a99a8c16aafcdf66c054b1e5506f9', part: "content", class: "panel__content" }, h("slot", { key: '6c58b34b39fe854feae21da5f5cc418d17727bf9' })), h("span", { key: 'ab6d3690bdc377bf1df2fc7be2dae43333576b12', part: "resizer", class: {
                panel__resizer: true,
                "panel__resizer-border": this.resizable,
            }, onMouseDown: this.onResizeStart, role: "separator", "aria-orientation": vertical ? "horizontal" : "vertical", "aria-label": "Resize panel", "aria-valuemin": this.minSize, "aria-valuemax": this.maxSize, "aria-valuenow": this.size })), this.collapsable && (h("button", { part: "collapse-button", class: "collapse-button", type: "button", onClick: this.onToggleCollapse, "aria-expanded": `${!this.collapsed}`, "aria-controls": this.panelId, "aria-label": this.collapsed ? "Expand panel" : "Collapse panel" }, h("slot", { name: "collapse-icon" }, h("hbr-icon", { asset: collapseIconAsset })))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "size": ["onSizeChange"],
        "minSize": ["onLimitsChange"],
        "maxSize": ["onLimitsChange"]
    }; }
    static get style() { return HbrPanelStyle0; }
}, [1, "hbr-panel", {
        "collapsable": [516],
        "resizable": [516],
        "collapsed": [1540],
        "size": [1538],
        "minSize": [514, "min-size"],
        "maxSize": [514, "max-size"],
        "placement": [513],
        "isResizing": [32]
    }, undefined, {
        "size": ["onSizeChange"],
        "minSize": ["onLimitsChange"],
        "maxSize": ["onLimitsChange"]
    }]);
Panel.panelId = 0;
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-panel", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Panel);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Panel as P, defineCustomElement as d };

