import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { d as debounce } from './function-helper.js';

const resizeObserverCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:contents}";
const HbrResizeObserverStyle0 = resizeObserverCss;

const ResizeObserverUtility = /*@__PURE__*/ proxyCustomElement(class ResizeObserverUtility extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrResize = createEvent(this, "hbr-resize", 7);
        this.observedElement = null;
        this.anchorRef = null;
        this.anchor = undefined;
        this.observe = true;
        this.subscriber = undefined;
        this.responsive = false;
        this.breakpoints = [768, 960, 1440];
        this.debounce = 0;
        this.breakpointLabels = [
            "mobile",
            "tablet",
            "laptop",
            "desktop",
        ];
        this.breakpointClass = "hbr-css__breakpoint";
        this.handleResize = this.handleResize.bind(this);
    }
    connectedCallback() {
        if (this.debounce) {
            this.handleResize = debounce(this.handleResize, this.debounce);
        }
        this.resizeObserver = new ResizeObserver((entries) => {
            this.handleResize(entries[0]);
        });
        this.updateObserver = this.updateObserver.bind(this);
    }
    disconnectedCallback() {
        this.resizeObserver.disconnect();
    }
    componentDidLoad() {
        this.handleAnchorChange();
    }
    handleAnchorChange() {
        if (this.anchor && typeof this.anchor === "string") {
            // Locate the anchor by selector
            const root = this.host.getRootNode();
            this.anchorRef = root.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLElement) {
            // Use the anchor's reference
            this.anchorRef = this.anchor;
        }
        if (this.anchorRef) {
            this.updateObserver();
        }
    }
    handleResize(entry) {
        if (!entry)
            return;
        let width;
        let height;
        if (entry.contentBoxSize) {
            // Firefox implements `contentBoxSize` as a single content rect, rather than an array
            const { inlineSize, blockSize } = Array.isArray(entry.contentBoxSize)
                ? entry.contentBoxSize[0]
                : entry.contentBoxSize;
            width = inlineSize;
            height = blockSize;
        }
        else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }
        const payload = { entry, width, height };
        const activeBreakpoint = this.updateClasses(payload);
        this.hbrResize.emit(Object.assign(Object.assign({}, payload), { activeBreakpoint }));
    }
    updateObserver() {
        var _a, _b, _c;
        if (!this.observe) {
            return;
        }
        // Unwatch previous element
        if (this.observedElement) {
            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.observedElement);
            this.observedElement = null;
        }
        // Watch anchor element if it exists
        if (this.anchorRef) {
            (_b = this.resizeObserver) === null || _b === void 0 ? void 0 : _b.observe(this.anchorRef);
            this.observedElement = this.anchorRef;
            return;
        }
        // If no anchor is found, observe the first child of the slot
        const slot = this.host.shadowRoot.querySelector("slot");
        const child = slot.assignedElements({ flatten: true })[0];
        if (child) {
            (_c = this.resizeObserver) === null || _c === void 0 ? void 0 : _c.observe(child);
            this.observedElement = child;
        }
    }
    updateClasses({ entry, width }) {
        if (!this.responsive || !entry)
            return;
        const prefix = this.breakpointClass;
        const breakpoints = [0, ...this.breakpoints, Infinity];
        const labels = this.breakpointLabels;
        let activeBreakpoint;
        // for width in boundaries, add class to host, observed element
        for (let i = 0; i < breakpoints.length - 1; i++) {
            const activeLabel = labels[i];
            const className = `${prefix}-${activeLabel}`;
            if (width > breakpoints[i] && width <= breakpoints[i + 1]) {
                this.host.classList.add(className);
                if (this.observedElement) {
                    this.observedElement.classList.add(className);
                }
                if (this.subscriber instanceof HTMLElement) {
                    this.subscriber.classList.add(className);
                }
                activeBreakpoint = activeLabel;
            }
            else {
                this.host.classList.remove(className);
                if (this.observedElement) {
                    this.observedElement.classList.remove(className);
                }
                if (this.subscriber instanceof HTMLElement) {
                    this.subscriber.classList.remove(className);
                }
            }
        }
        return activeBreakpoint;
    }
    render() {
        return h("slot", { key: 'b07458c96688680bd4f3b1a444dfd9aee91a1a02', onSlotchange: this.updateObserver });
    }
    get host() { return this; }
    static get watchers() { return {
        "anchor": ["handleAnchorChange"]
    }; }
    static get style() { return HbrResizeObserverStyle0; }
}, [1, "hbr-resize-observer", {
        "anchor": [1],
        "observe": [516],
        "subscriber": [16],
        "responsive": [516],
        "breakpoints": [16],
        "debounce": [514],
        "breakpointLabels": [16],
        "breakpointClass": [513, "breakpoint-class"]
    }, undefined, {
        "anchor": ["handleAnchorChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-resize-observer"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-resize-observer":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ResizeObserverUtility);
            }
            break;
    } });
}

export { ResizeObserverUtility as R, defineCustomElement as d };

