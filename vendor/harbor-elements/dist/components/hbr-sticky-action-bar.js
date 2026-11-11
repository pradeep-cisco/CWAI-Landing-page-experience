import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const stickyActionBarCss = ".hbr-sticky-action-bar-sentinel{height:1px;margin-top:-1px;pointer-events:none;visibility:hidden}hbr-sticky-action-bar{--background-stuck:var(--control-bg-weak-default);--background-raised:var(--control-bg-weak-default);--bar-shadow:0px -3px 8px 0 rgba(0, 0, 0, 0.08);--border-radius:8px 8px 0 0;--divider-top:none;display:flex;align-items:center;flex-wrap:wrap;width:100%}hbr-sticky-action-bar[size=md]{gap:var(--hbr-spacing-xs);padding:var(--hbr-spacing-sm) var(--hbr-spacing-lg)}hbr-sticky-action-bar[size=sm]{gap:var(--hbr-spacing-2xs);padding:0}hbr-sticky-action-bar[align=end]{justify-content:flex-end}hbr-sticky-action-bar[sticky]{position:sticky;bottom:0;margin:0;background:transparent}hbr-sticky-action-bar.is-stuck{background:var(--background-stuck);border-top:var(--divider-top)}hbr-sticky-action-bar.is-stuck[raised]{box-shadow:var(--bar-shadow)}hbr-sticky-action-bar.is-stuck[rounded]{border-radius:var(--border-radius)}hbr-sticky-action-bar[raised]:not([sticky]){background:var(--background-raised);box-shadow:var(--bar-shadow)}hbr-sticky-action-bar[rounded]:not([sticky]){border-radius:var(--border-radius)}hbr-sticky-action-bar>hbr-button[variant=text]{margin:0 var(--hbr-spacing-xs)}";
const HbrStickyActionBarStyle0 = stickyActionBarCss;

const VARIANT_PRESETS = {
    "body-content": { rounded: true, align: "start", raised: true, sticky: true },
    drawer: { rounded: false, align: "end", raised: false, sticky: true },
};
const StickyActionBar = /*@__PURE__*/ proxyCustomElement(class StickyActionBar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.variant = undefined;
        this.size = "md";
        this.align = "start";
        this.raised = false;
        this.rounded = false;
        this.sticky = false;
        this.isStuck = false;
    }
    /** Resolves effective prop value, preferring variant preset if variant is set */
    getEffective(prop) {
        if (this.variant && VARIANT_PRESETS[this.variant]) {
            return VARIANT_PRESETS[this.variant][prop];
        }
        return this[prop];
    }
    componentDidLoad() {
        if (this.getEffective("sticky")) {
            this.setupStickyDetection();
        }
    }
    disconnectedCallback() {
        this.cleanupStickyDetection();
    }
    componentWillRender() {
        // Apply effective values as attributes for CSS styling
        this.el.setAttribute("size", this.size);
        this.el.setAttribute("align", this.getEffective("align"));
        // Reflect effective boolean props
        const effectiveRaised = this.getEffective("raised");
        const effectiveRounded = this.getEffective("rounded");
        const effectiveSticky = this.getEffective("sticky");
        if (effectiveRaised) {
            this.el.setAttribute("raised", "");
        }
        else {
            this.el.removeAttribute("raised");
        }
        if (effectiveRounded) {
            this.el.setAttribute("rounded", "");
        }
        else {
            this.el.removeAttribute("rounded");
        }
        if (effectiveSticky) {
            this.el.setAttribute("sticky", "");
        }
        else {
            this.el.removeAttribute("sticky");
        }
    }
    /**
     * Stuck detection:
     * Sets up IntersectionObserver with a sentinel element to detect stuck state.
     * When the sentinel (placed after the sticky bar) goes out of view,
     * it means the bar is stuck/overlapping content.
     */
    setupStickyDetection() {
        // Create sentinel element - a 1px element placed after the sticky bar
        this.sentinel = document.createElement("div");
        this.sentinel.className = "hbr-sticky-action-bar-sentinel";
        this.sentinel.setAttribute("aria-hidden", "true");
        this.el.insertAdjacentElement("afterend", this.sentinel);
        // Find scroll container for the observer root
        const scrollContainer = this.findScrollContainer();
        this.observer = new IntersectionObserver((entries) => {
            var _a, _b;
            // Sentinel visible = bar is resting (not stuck)
            // Sentinel hidden = bar is stuck (overlapping content)
            const isIntersecting = (_b = (_a = entries[0]) === null || _a === void 0 ? void 0 : _a.isIntersecting) !== null && _b !== void 0 ? _b : true;
            this.isStuck = !isIntersecting;
        }, {
            root: scrollContainer,
            threshold: 0,
            // Small margin to trigger slightly before sentinel is fully hidden
            rootMargin: "0px 0px 1px 0px",
        });
        this.observer.observe(this.sentinel);
    }
    cleanupStickyDetection() {
        var _a, _b;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.sentinel) === null || _b === void 0 ? void 0 : _b.remove();
    }
    /**
     * Traverses up the DOM to find the nearest scrollable container.
     * Returns null to use viewport if none found.
     */
    findScrollContainer() {
        let parent = this.el.parentElement;
        while (parent) {
            const style = getComputedStyle(parent);
            const overflowY = style.overflowY;
            if (overflowY === "auto" || overflowY === "scroll") {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null; // Use viewport
    }
    render() {
        const effectiveSticky = this.getEffective("sticky");
        return h(Host, { key: 'a236eccdf140272b9f2736a1609fc493cf3ad97a', class: { "is-stuck": this.isStuck && effectiveSticky } });
    }
    get el() { return this; }
    static get style() { return HbrStickyActionBarStyle0; }
}, [0, "hbr-sticky-action-bar", {
        "variant": [513],
        "size": [1],
        "align": [1],
        "raised": [4],
        "rounded": [4],
        "sticky": [4],
        "isStuck": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-sticky-action-bar"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sticky-action-bar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, StickyActionBar);
            }
            break;
    } });
}

const HbrStickyActionBar = StickyActionBar;
const defineCustomElement = defineCustomElement$1;

export { HbrStickyActionBar, defineCustomElement };

