import { h, proxyCustomElement, HTMLElement, Host, Fragment } from '@stencil/core/internal/client';
import { D as De } from './harbor-charts-line.es.js';
import { _ } from './harbor-charts-pie.es.js';
import { r as react, c as createRoot } from './client.js';
import { d as debounce, b as createDOMElementFromVNode } from './function-helper.js';
import { s as sanitizeHtml } from './sanitizeHtml.js';
import { d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './illustration.js';
import { d as defineCustomElement$1 } from './stencil.js';

const browserDownloadCsv = (resultCsv, filename) => {
    const blob = new Blob([resultCsv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
const showChartPopover = async (tooltipRef, data, event, customItemTooltip, defaultTooltipGenerator) => {
    if (!tooltipRef) {
        console.warn("Tooltip reference is not provided");
        return;
    }
    // Explicitly disabled
    if (customItemTooltip === false) {
        tooltipRef.open = false;
        return;
    }
    const target = event.target;
    if (!target) {
        tooltipRef.open = false;
        return;
    }
    const content = tooltipRef.querySelector("[slot=content]");
    if (!content) {
        console.warn("Tooltip content element not found: [slot=content]");
        return;
    }
    // 1) Try custom tooltip (if provided)
    const custom = typeof customItemTooltip === "function"
        ? customItemTooltip(data, event, h)
        : undefined;
    // Custom tooltip can explicitly disable
    if (custom === false) {
        tooltipRef.open = false;
        return;
    }
    // 2) Fall back to default tooltip
    const finalContent = custom !== null && custom !== void 0 ? custom : defaultTooltipGenerator(data, event);
    if (!finalContent) {
        tooltipRef.open = false;
        return;
    }
    // Clear previous content (faster/cleaner than innerHTML = "")
    content.replaceChildren();
    // Render final content
    if (typeof finalContent === "string") {
        content.innerHTML = await sanitizeHtml(finalContent);
    }
    else if (typeof Node !== "undefined" && finalContent instanceof Node) {
        content.appendChild(finalContent);
    }
    else {
        content.appendChild(createDOMElementFromVNode(finalContent));
    }
    // Open popover (single place)
    tooltipRef.anchor = target;
    tooltipRef.open = true;
};
const hideChartPopover = (tooltipRef) => {
    if (!tooltipRef) {
        console.warn("Tooltip reference is not provided");
        return;
    }
    tooltipRef.open = false;
    const content = tooltipRef.querySelector("[slot=content]");
    content.innerHTML = "";
};
const hasAssignedLoadingState = (host) => {
    const slot = host.querySelector('slot[name="loading-state"]');
    if (slot) {
        const assignedNodes = slot.assignedNodes();
        return assignedNodes.some((node) => node.nodeType === Node.ELEMENT_NODE);
    }
    return false;
};
const hasAssignedEmptyState = (host) => {
    const slot = host.querySelector('slot[name="empty-state"]');
    if (slot) {
        const assignedNodes = slot.assignedNodes();
        return assignedNodes.some((node) => node.nodeType === Node.ELEMENT_NODE);
    }
    return false;
};
/**
 * This function hides native empty state ref and shows react rendered ref
 */
const showReactEmptyRef = (emptyNativeRef, emptyRootRef) => {
    if (emptyNativeRef) {
        emptyNativeRef.style.display = "none";
    }
    if (emptyRootRef) {
        emptyRootRef.style.display = "";
    }
};
const hideBothEmptyRefs = (emptyNativeRef, emptyRootRef) => {
    if (emptyNativeRef) {
        emptyNativeRef.style.display = "none";
    }
    if (emptyRootRef) {
        emptyRootRef.style.display = "none";
    }
};
/**
 * This function shows native empty state ref and hides react rendered ref
 */
const showNativeEmptyRef = (emptyNativeRef, emptyRootRef) => {
    if (emptyNativeRef) {
        emptyNativeRef.style.display = "";
    }
    if (emptyRootRef) {
        emptyRootRef.style.display = "none";
    }
};
function computeIllustrationSize(width, type) {
    if (type === "donut" ||
        type === "gauge" ||
        type === "pie" ||
        type === "categorical-sankey")
        return "medium";
    if (width < 240)
        return "small";
    if (width < 320)
        return "medium";
    return "large";
}
function getBarlineEmptyConfigVisibilityOnSize(width, type) {
    if (type !== "bar" && type !== "line")
        return false;
    if (width < 240)
        return false;
    return true;
}
function shouldRenderDefaultEmpty(params) {
    const { isLoading, isEmpty, type, hasCustomEmpty } = params;
    return !isLoading && isEmpty && !hasCustomEmpty && type !== "none";
}
function makeEmptyRenderKey(type, description) {
    return `${type}::${description}`;
}
function createBoardController(opts) {
    var _a;
    const debounceMs = (_a = opts.debounceMs) !== null && _a !== void 0 ? _a : 80;
    let lastEmptyRenderKey = null;
    // RO loop prevention + resize bookkeeping
    let lastMeasuredW = 0;
    let lastMeasuredH = 0;
    let roWriteLock = false;
    let pendingW = 0;
    let pendingH = 0;
    const applyResize = () => {
        if (roWriteLock)
            return;
        const el = opts.getEl();
        const hasCustomEmpty = hasAssignedEmptyState(el);
        if (!shouldRenderDefaultEmpty({
            isLoading: opts.getIsLoading(),
            isEmpty: opts.getIsEmpty(),
            type: opts.getType(),
            hasCustomEmpty,
        })) {
            return;
        }
        if (!opts.hasEmptyRefs())
            return;
        const w = pendingW;
        const h = pendingH;
        if (w <= 0 || h <= 0)
            return;
        roWriteLock = true;
        try {
            const barlineEmptyVisibility = getBarlineEmptyConfigVisibilityOnSize(w, opts.getType());
            opts.renderDefaultEmptyBg(w, h, barlineEmptyVisibility);
        }
        finally {
            // release quickly to avoid RO feedback loop
            setTimeout(() => {
                roWriteLock = false;
            }, 0);
        }
    };
    const debouncedApplyResize = debounce(applyResize, debounceMs, {
        trailing: true,
        leading: false,
    });
    const onResize = (width, height) => {
        if (roWriteLock)
            return;
        if (width <= 0 || height <= 0)
            return;
        const w = Math.round(width);
        const h = Math.round(height);
        if (w === lastMeasuredW && h === lastMeasuredH)
            return;
        lastMeasuredW = w;
        lastMeasuredH = h;
        // update illustration size (cheap)
        const nextSize = computeIllustrationSize(w, opts.getType());
        opts.updateIllustrationSize(nextSize);
        pendingW = w;
        pendingH = h;
        debouncedApplyResize();
    };
    const renderEmptyIfNeeded = () => {
        const el = opts.getEl();
        const hasCustomEmpty = hasAssignedEmptyState(el);
        if (!shouldRenderDefaultEmpty({
            isLoading: opts.getIsLoading(),
            isEmpty: opts.getIsEmpty(),
            type: opts.getType(),
            hasCustomEmpty,
        })) {
            lastEmptyRenderKey = null;
            return;
        }
        if (!opts.hasEmptyRefs())
            return;
        const rect = el.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w <= 0 || h <= 0)
            return;
        const key = makeEmptyRenderKey(opts.getType(), opts.getDescription());
        if (lastEmptyRenderKey === key)
            return;
        lastEmptyRenderKey = key;
        const barlineEmptyVisibility = getBarlineEmptyConfigVisibilityOnSize(w, opts.getType());
        // do an immediate paint (not debounced)
        opts.renderDefaultEmptyBg(w, h, barlineEmptyVisibility);
    };
    const onPropAffectsEmptyChanged = () => {
        lastEmptyRenderKey = null;
        renderEmptyIfNeeded();
    };
    const disconnect = () => {
        debouncedApplyResize.cancel();
        lastEmptyRenderKey = null;
    };
    return {
        onResize,
        renderEmptyIfNeeded,
        onPropAffectsEmptyChanged,
        disconnect,
    };
}

const emptyConfigForBarline = () => {
    return {
        data: [],
        xScale: { type: "linear" },
        yScale: { type: "linear", min: 0, max: 100 },
        margin: {
            left: 40,
            top: 10,
            bottom: 10,
        },
        axisLeft: {
            tickValues: [0, 20, 40, 60, 80, 100],
            format: (r) => `${r}%`,
        },
        axisBottom: {
            enable: true,
        },
        axisTop: {
            enable: true,
            tickValues: [],
        },
        axisRight: {
            enable: true,
            tickValues: [],
        },
        enablePoints: false,
        useMesh: false,
        legends: [],
        enableGridX: false,
        enableGridY: false,
        isInteractive: false,
        theme: {
            fontSize: "var(--hbr-font-size-2xs)",
            fontFamily: "var(--hbr-font-body)",
            axis: {
                domain: {
                    line: {
                        stroke: "var(--base-border-default)",
                        strokeWidth: 1,
                        strokeDasharray: "4,2",
                    },
                },
                ticks: {
                    text: {
                        fontSize: 11,
                        fill: "var(--interact-text-weak-default)",
                        outlineWidth: 0,
                        outlineColor: "transparent",
                    },
                },
                text: {
                    fill: "var(--base-text-medium-default)",
                },
            },
        },
    };
};
const emptyConfigForDonut = () => {
    return {
        data: [
            {
                id: "No Data",
                value: 1,
            },
        ],
        innerRadius: 0.75,
        enableArcLabels: false,
        enableArcLinkLabels: false,
        isInteractive: false,
        defs: [
            {
                id: "no-value-pattern",
                type: "patternLines",
                spacing: 4,
                rotation: -45,
                lineWidth: 2,
                background: "var(--control-border-weak-default)",
                color: "var(--control-icon-strong-disabled)",
            },
        ],
        fill: [{ match: { id: "No Data" }, id: "no-value-pattern" }],
    };
};
const emptyInnerHtmlForPie = (width = 400, height = 300, borderDiff = 15) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img">
      <defs aria-hidden="true">
        <pattern id="no-value-pattern-1" width="5.656854249492381" height="5.65685424949238" patternUnits="userSpaceOnUse">
          <rect width="5.656854249492381" height="5.65685424949238" fill="var(--base-bg-weak-default)"></rect>
          <path d="M -5.656854249492381 5.65685424949238 L 5.656854249492381 -5.65685424949238M -5.656854249492381 11.31370849898476 L 11.313708498984761 -5.65685424949238M 0 11.31370849898476 L 11.313708498984761 0" stroke-width="1" stroke="var(--control-icon-strong-disabled)" stroke-linecap="square"></path>
        </pattern>
        <pattern id="no-value-pattern-2" width="5.656854249492381" height="5.65685424949238" patternUnits="userSpaceOnUse">
          <rect width="5.656854249492381" height="5.65685424949238" fill="var(--base-bg-weak-default)"></rect>
          <path d="M -5.656854249492381 5.65685424949238 L 5.656854249492381 -5.65685424949238M -5.656854249492381 11.31370849898476 L 11.313708498984761 -5.65685424949238M 0 11.31370849898476 L 11.313708498984761 0" stroke-width="0.5" stroke="var(--control-bg-active)" stroke-linecap="square"></path>
        </pattern>

      </defs>
    <rect width="${width}" height="${height}" fill="transparent"></rect>
    <g transform="translate(0,0)">
        <circle
          cx="${width / 2}"
          cy="${height / 2}"
          r="${Math.min(width, height) / 2}"
          fill="url(#no-value-pattern-1)"
          tabindex="0"
        />
        <circle
 					cx="${width / 2}"
          cy="${height / 2}"
					r="${Math.min(width, height) / 2 - borderDiff}"
          fill="url(#no-value-pattern-2)"
          tabindex="0"
        />
    </g>
  </svg>`;
};

const styleCss = ":host{flex:1;display:block;width:100%;height:100%;min-width:0;min-height:0}:host .chart-board__footer{background:var(--chart-board-footer-background, var(--base-bg-default))}:host{--border-radius:var(--hbr-border-radius-xl);--color:var(--base-bg-default);--sheen-color:var(--base-bg-weak-default)}:host .stencil{display:flex;width:100%;height:100%;justify-content:center;align-items:center;min-height:219px}:host .stencil__indicator{flex:1 1 auto;background:var(--color);border-radius:var(--border-radius)}:host .stencil__indicator{background:linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));background-size:400% 100%;animation:sheen 8s ease-in-out infinite;clip-path:url(#hbr-stencil-chart-clipping);-webkit-clip-path:url(#hbr-stencil-chart-clipping);max-width:264px;max-height:219px;width:264px;height:219px;display:block;position:relative}:host .stencil--chart-svg{position:fixed;transform:translateZ(1px);-webkit-transform:translateZ(1px);top:-10000%;left:-10000%;z-index:-10000}@keyframes sheen{0%{background-position:200% 0}to{background-position:-200% 0}}:host .chart-board__container{width:100%;height:100%;display:flex;flex-direction:column;position:relative}:host .chart-board__container>div:first-child{display:flex;justify-content:space-between;align-items:center}:host .chart-board__container>div:first-child>div:nth-child(2){display:flex}:host .chart-board__empty{display:flex;align-items:center;justify-content:center;width:100%;height:100%;position:relative}:host .chart-board__empty>hbr-illustration{position:absolute}:host .chart-board__empty.categorical,:host .chart-board__empty.categorical-sankey{color:var(--base-text-medium-default);background:var(--base-bg-disabled)}:host .chart-board__empty.categorical>div:nth-child(2),:host .chart-board__empty.categorical-sankey>div:nth-child(2){height:auto}:host .chart-board__empty.gauge{color:var(--base-text-medium-default)}:host .chart-board__empty.gauge>div{width:75%;height:auto;min-height:72px;padding:0 var(--hbr-spacing-md);border-radius:var(--hbr-border-radius-lg);background:var(--base-bg-disabled);text-align:center}:host .chart-board__empty>div{width:75%;height:75%;display:flex;align-items:center;justify-content:center}:host .chart-board__loading{display:flex;align-items:center;justify-content:center;width:100%;height:100%;position:relative}:host .chart-board__loading>hbr-stencil{position:absolute;height:100%;width:100%;padding:1rem;--chart-height:100%;--chart-width:100%}:host .chart-board__loading>hbr-stencil::part(base){justify-content:center;align-items:center}:host .chart-board__loading{}:host .chart-board__loading>*:nth-child(2){width:100%;height:100%;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center}";
const HbrChartBoardStyle0 = styleCss;

const HbrChartBoard = /*@__PURE__*/ proxyCustomElement(class HbrChartBoard extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.contextRoot = null;
        // controller to manage empty/loading states
        // With ResizeObserver, controller can adjust illustration size based on container size
        // and also debounce resize events to avoid excessive re-renders
        this.controller = createBoardController({
            getEl: () => this.el,
            getIsLoading: () => this.isLoading,
            getIsEmpty: () => this.isEmpty,
            getType: () => this.type,
            getDescription: () => this.description,
            hasEmptyRefs: () => !!this.emptyRootRef && !!this.emptyNativeRef,
            updateIllustrationSize: (next) => {
                if (next !== this.illustrationSize)
                    this.illustrationSize = next;
            },
            toggleVisibilityOnBarLineEmpty: (visible) => {
                if (this.emptyRootRef) {
                    this.emptyRootRef.style.display = visible ? "block" : "none";
                }
            },
            renderDefaultEmptyBg: (w, h, v) => this.renderDefaultEmptyBg(w, h, v),
            debounceMs: 80,
        });
        this.isLoading = false;
        this.type = "none";
        this.isEmpty = false;
        this.description = "No data to display";
        this.config = {
            margin: {
                right: 0,
                bottom: 0,
                left: 0,
                top: 0,
            },
        };
        this.illustrationSize = "large";
    }
    async setChartConfig(config) {
        this.config = config;
    }
    componentDidLoad() {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.controller.onResize(width, height);
            }
        });
        this.resizeObserver.observe(this.el);
    }
    disconnectedCallback() {
        var _a;
        this.controller.disconnect();
        if (this.contextRoot) {
            this.contextRoot.unmount();
            this.contextRoot = null;
        }
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    onPropsAffectingEmptyChange() {
        // When leaving the empty state, clear imperatively-set content on refs
        // before Stencil re-renders — its VDOM diff may reuse these DOM nodes
        // for the non-empty branch (e.g. emptyNativeRef → footer div),
        // and text set via .textContent would otherwise persist.
        if (!this.isEmpty) {
            if (this.emptyNativeRef) {
                this.emptyNativeRef.textContent = "";
            }
            if (this.contextRoot) {
                this.contextRoot.unmount();
                this.contextRoot = null;
            }
        }
        this.controller.onPropAffectsEmptyChanged();
    }
    renderDefaultEmptyBg(width, height, visibility) {
        let emptyEntity = null;
        if (this.type === "categorical") {
            showNativeEmptyRef(this.emptyNativeRef, this.emptyRootRef);
            this.emptyNativeRef.textContent = this.description;
            return;
        }
        if (this.type === "gauge") {
            showNativeEmptyRef(this.emptyNativeRef, this.emptyRootRef);
            this.emptyNativeRef.textContent = this.description;
            return;
        }
        if (this.type === "bar" || this.type === "line") {
            if (!visibility) {
                hideBothEmptyRefs(this.emptyNativeRef, this.emptyRootRef);
                return;
            }
            showReactEmptyRef(this.emptyNativeRef, this.emptyRootRef);
            emptyEntity = react.exports.createElement(De, emptyConfigForBarline(), null);
        }
        else if (this.type === "donut") {
            showReactEmptyRef(this.emptyNativeRef, this.emptyRootRef);
            emptyEntity = react.exports.createElement(_, emptyConfigForDonut(), null);
        }
        else if (this.type === "pie") {
            showNativeEmptyRef(this.emptyNativeRef, this.emptyRootRef);
            // 0.75 to maintain 4:3 aspect ratio
            // same as style.scss 75% width and height
            this.emptyNativeRef.innerHTML = emptyInnerHtmlForPie(width > 0 ? width * 0.75 : 400, height > 0 ? height * 0.75 : 300);
            return;
        }
        if ((this.type === "bar" || this.type === "line" || this.type === "donut") &&
            emptyEntity) {
            if (!this.contextRoot)
                this.contextRoot = createRoot(this.emptyRootRef);
            this.contextRoot.render(react.exports.createElement(react.exports.Fragment, null, emptyEntity));
        }
    }
    componentDidRender() {
        this.controller.renderEmptyIfNeeded();
    }
    render() {
        var _a;
        const customLoadingState = hasAssignedLoadingState(this.el);
        const customEmptyState = hasAssignedEmptyState(this.el);
        const { right = 0, left = 0 } = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.margin) || {};
        if (this.isLoading) {
            return (h(Host, null, customLoadingState ? (h("slot", { name: "loading-state" })) : (h("div", { class: "chart-board__loading" }, h("hbr-stencil", { variant: "chart", part: "loading-state-illustration" }), h("div", { ref: (el) => {
                    this.loadingRef = el;
                }, part: "loading-state-image" })))));
        }
        if (!this.isEmpty) {
            return (h(Host, null, h(Fragment, null, h("div", { class: "chart-board__container" }, h("slot", { name: "header" }), h("slot", null), this.type === "categorical" && h("slot", { name: "legend" }), h("div", { class: "chart-board__footer", style: {
                    marginLeft: `${left}px`,
                    marginRight: `${right}px`,
                } }, h("slot", { name: "footer" }))))));
        }
        return (h(Host, null, customEmptyState ? (h("slot", { name: "empty-state" })) : (h("div", { class: `chart-board__empty ${this.type}` }, this.type !== "categorical" && this.type !== "gauge" && (h("hbr-illustration", { size: this.illustrationSize, part: "empty-state-illustration" }, h("div", { slot: "body" }, this.description))), h("div", { ref: (el) => {
                this.emptyRootRef = el;
            }, part: "empty-state-image" }), h("div", { ref: (el) => {
                this.emptyNativeRef = el;
            }, part: "empty-state-image" })))));
    }
    get el() { return this; }
    static get watchers() { return {
        "type": ["onPropsAffectingEmptyChange"],
        "description": ["onPropsAffectingEmptyChange"],
        "isEmpty": ["onPropsAffectingEmptyChange"],
        "isLoading": ["onPropsAffectingEmptyChange"]
    }; }
    static get style() { return HbrChartBoardStyle0; }
}, [1, "hbr-chart-board", {
        "isLoading": [516, "is-loading"],
        "type": [513],
        "isEmpty": [4, "is-empty"],
        "description": [1],
        "config": [32],
        "illustrationSize": [32],
        "setChartConfig": [64]
    }, undefined, {
        "type": ["onPropsAffectingEmptyChange"],
        "description": ["onPropsAffectingEmptyChange"],
        "isEmpty": ["onPropsAffectingEmptyChange"],
        "isLoading": ["onPropsAffectingEmptyChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrChartBoard);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrChartBoard as H, browserDownloadCsv as b, defineCustomElement as d, hideChartPopover as h, showChartPopover as s };

