import { proxyCustomElement, HTMLElement, h, Fragment, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$4 } from './card.js';
import { d as defineCustomElement$3 } from './divider.js';
import { d as defineCustomElement$2 } from './layout.js';

const skeletonCss = "hbr-skeleton{display:block;width:100%;animation:hbr-skeleton-pulse 2s ease-in-out infinite;background:var(--base-bg-default);background-clip:padding-box;border-radius:var(--hbr-border-radius-pill);box-shadow:none;color:transparent;cursor:default;pointer-events:none;user-select:none}hbr-skeleton[strong]{background:var(--base-border-medium-default)}hbr-skeleton[size=small]{height:var(--hbr-spacing-md, 16px)}hbr-skeleton[size=medium]{height:var(--hbr-spacing-lg, 24px)}hbr-skeleton[size=large]{height:calc(var(--hbr-spacing-xl, 32px) + 4px)}hbr-skeleton[size=custom]{border-radius:var(--hbr-border-radius-md, 6px)}hbr-skeleton[variant^=\"layout:\"]{height:auto;animation:none;background:none;border-radius:0}hbr-skeleton[variant^=\"layout:\"] .skeleton-key-value-row{grid-template-columns:80px minmax(0, 1fr);padding:var(--hbr-spacing-md) 0}hbr-skeleton[variant^=\"layout:\"] .skeleton-chart{display:grid;grid-template-columns:minmax(0, 8fr) minmax(0, 2fr);gap:var(--hbr-spacing-lg)}@keyframes hbr-skeleton-pulse{50%{opacity:0.5}}@media (prefers-reduced-motion: reduce){hbr-skeleton{animation:none}}";
const HbrSkeletonStyle0 = skeletonCss;

const renderSkeleton = (props = {}) => h(["hbr", "skeleton"].join("-"), props);
const VARIANT_PROPS = {
    "text:body": {
        size: "small",
        strong: false,
    },
    "text:primary-title": {
        size: "large",
        strong: true,
    },
    "text:section-title": {
        size: "medium",
        strong: true,
    },
    "layout:basic-card": {
        size: "custom",
        strong: false,
    },
    "layout:statistics-or-status-cards": {
        size: "custom",
        strong: false,
    },
    "layout:table": {
        size: "custom",
        strong: false,
    },
    "layout:key-value-pairs:horizontal": {
        size: "custom",
        strong: false,
    },
    "layout:key-value-pairs:vertical": {
        size: "custom",
        strong: false,
    },
    "layout:list": {
        size: "custom",
        strong: false,
    },
    "layout:chart": {
        size: "custom",
        strong: false,
    },
};
const DEFAULTS = {
    size: "small",
    strong: false,
};
const Skeleton = /*@__PURE__*/ proxyCustomElement(class Skeleton extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.variant = undefined;
        this.size = undefined;
        this.strong = undefined;
        this.rows = 10;
    }
    componentWillRender() {
        var _a, _b;
        const variantProps = this.variant ? VARIANT_PROPS[this.variant] : null;
        // Priority: explicit prop > variant default > component default
        const finalSize = this.size || (variantProps === null || variantProps === void 0 ? void 0 : variantProps.size) || DEFAULTS.size;
        const finalStrong = (_b = (_a = this.strong) !== null && _a !== void 0 ? _a : variantProps === null || variantProps === void 0 ? void 0 : variantProps.strong) !== null && _b !== void 0 ? _b : DEFAULTS.strong;
        this.el.setAttribute("size", finalSize);
        if (finalStrong) {
            this.el.setAttribute("strong", "");
        }
        else {
            this.el.removeAttribute("strong");
        }
    }
    renderBasicCard() {
        return (h("hbr-card", { container: true, style: {
                width: "100%",
                "--container-gap": "var(--hbr-spacing-lg)",
            } }, renderSkeleton({
            slot: "header",
            size: "medium",
            style: { width: "60%" },
            strong: true,
        }), h("hbr-layout", { direction: "column", gap: "sm" }, renderSkeleton(), renderSkeleton(), renderSkeleton({ style: { width: "70%" } }))));
    }
    renderStatisticsOrStatusCards() {
        return (h("hbr-card", { container: true, style: { width: "100%" } }, h("hbr-layout", { align: "center" }, renderSkeleton({ style: { width: "60%" } }), renderSkeleton({
            style: {
                width: "36px",
                height: "36px",
                borderRadius: "var(--hbr-border-radius-md)",
                marginLeft: "auto",
            },
        }))));
    }
    renderTable() {
        const rowCount = Number.isFinite(this.rows) && this.rows > 0 ? Math.floor(this.rows) : 10;
        return (h("hbr-layout", { direction: "column", gap: "2xs" }, h("hbr-layout", { gap: "sm" }, Array.from({ length: 4 }, (_, column) => renderSkeleton({
            key: `header-${column}`,
            size: "small",
            strong: true,
        }))), h("hbr-divider", null), Array.from({ length: rowCount }, (_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton rows never reorder.
        h("div", { key: `row-${row}` }, h("div", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "var(--hbr-spacing-lg)",
                padding: "var(--hbr-spacing-2xs) 0",
            } }, Array.from({ length: 4 }, (_, column) => renderSkeleton({ key: `cell-${row}-${column}`, size: "small" }))), row < rowCount - 1 && h("hbr-divider", null))))));
    }
    renderHorizontalKeyValuePairs() {
        return (h("hbr-layout", { direction: "column", gap: "none" }, Array.from({ length: 3 }, (_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton pairs never reorder.
        h("div", { key: `pair-${row}` }, h("hbr-layout", { display: "grid", align: "start", gap: "lg", class: "skeleton-key-value-row" }, renderSkeleton({ size: "small", strong: true }), h("hbr-layout", { direction: "column", gap: "sm" }, renderSkeleton({ size: "small" }), row > 0 && (h(Fragment, null, renderSkeleton({ size: "small" }), renderSkeleton({ size: "small", style: { width: "75%" } }))))), row < 2 && h("hbr-divider", null))))));
    }
    renderVerticalKeyValuePairs() {
        return (h("hbr-layout", { direction: "column", gap: "lg" }, Array.from({ length: 4 }, (_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton pairs never reorder.
        h("hbr-layout", { key: `pair-${row}`, direction: "column", gap: "sm" }, renderSkeleton({ size: "small", style: { width: "40%" } }), renderSkeleton({ size: "small", strong: true }))))));
    }
    renderList() {
        return (h("hbr-layout", { direction: "column", gap: "lg" }, Array.from({ length: 3 }, (_, item) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder.
        h("hbr-layout", { key: `item-${item}`, align: "start" }, renderSkeleton({
            size: "custom",
            style: { width: "60px", height: "60px" },
        }), h("hbr-layout", { direction: "column", gap: "sm", style: { width: "100%" } }, renderSkeleton({ size: "small" }), renderSkeleton({ size: "small", style: { width: "70%" } })))))));
    }
    renderChart() {
        return (h("hbr-layout", { direction: "column", gap: "lg" }, renderSkeleton({
            size: "medium",
            strong: true,
            style: { width: "40%" },
        }), h("div", { class: "skeleton-chart" }, renderSkeleton({ size: "custom", style: { height: "220px" } }), h("hbr-layout", { direction: "column", gap: "sm" }, Array.from({ length: 6 }, (_, item) => renderSkeleton({ key: `legend-${item}`, size: "small" }))))));
    }
    renderTemplate() {
        switch (this.variant) {
            case "layout:basic-card":
                return this.renderBasicCard();
            case "layout:statistics-or-status-cards":
                return this.renderStatisticsOrStatusCards();
            case "layout:table":
                return this.renderTable();
            case "layout:key-value-pairs:horizontal":
                return this.renderHorizontalKeyValuePairs();
            case "layout:key-value-pairs:vertical":
                return this.renderVerticalKeyValuePairs();
            case "layout:list":
                return this.renderList();
            case "layout:chart":
                return this.renderChart();
            default:
                return null;
        }
    }
    render() {
        return h(Host, { key: 'a6601dfe78455a03bb26299e1ce2d3df8d033d0d', "aria-hidden": "true" }, this.renderTemplate());
    }
    get el() { return this; }
    static get style() { return HbrSkeletonStyle0; }
}, [0, "hbr-skeleton", {
        "variant": [513],
        "size": [1],
        "strong": [4],
        "rows": [2]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-skeleton", "hbr-card", "hbr-divider", "hbr-layout"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-skeleton":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Skeleton);
            }
            break;
        case "hbr-card":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-divider":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-layout":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrSkeleton = Skeleton;
const defineCustomElement = defineCustomElement$1;

export { HbrSkeleton, defineCustomElement };

