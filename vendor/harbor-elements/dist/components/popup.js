import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { l as loadFloatingUi } from './floating-ui.js';

/* eslint-disable @typescript-eslint/ban-types */
function offsetParent(element) {
    return offsetParentPolyfill(element);
}
function flatTreeParent(element) {
    if (element.assignedSlot) {
        return element.assignedSlot;
    }
    if (element.parentNode instanceof ShadowRoot) {
        return element.parentNode.host;
    }
    return element.parentNode;
}
function offsetParentPolyfill(element) {
    // Do an initial walk to check for display:none ancestors.
    for (let ancestor = element; ancestor; ancestor = flatTreeParent(ancestor)) {
        if (!(ancestor instanceof Element)) {
            continue;
        }
        if (getComputedStyle(ancestor).display === 'none') {
            return null;
        }
    }
    for (let ancestor = flatTreeParent(element); ancestor; ancestor = flatTreeParent(ancestor)) {
        if (!(ancestor instanceof Element)) {
            continue;
        }
        const style = getComputedStyle(ancestor);
        // Display:contents nodes aren't in the layout tree so they should be skipped.
        if (style.display === 'contents') {
            continue;
        }
        if (style.position !== 'static' || style.filter !== 'none') {
            return ancestor;
        }
        if (ancestor.tagName === 'BODY') {
            return ancestor;
        }
    }
    return null;
}

const popupCss = ":host{--arrow-color:var(--inverse-bg-weak-default);--arrow-size:6px;--arrow-zindex:1;display:contents}.popup{position:absolute;isolation:isolate;max-width:var(--auto-size-available-width, none);max-height:var(--auto-size-available-height, none)}.popup--active{z-index:var(--hbr-z-index-tooltip)}.popup--fixed{position:fixed}.popup:not(.popup--active){display:none}.popup__arrow{position:absolute;width:calc(var(--arrow-size) * 2);height:calc(var(--arrow-size) * 2);background:var(--arrow-color);z-index:var(--arrow-zindex)}:host([data-current-placement^=top]) .popup__arrow{clip-path:polygon(0% 50%, 100% 50%, 50% 100%)}:host([data-current-placement^=bottom]) .popup__arrow{clip-path:var(--clip-path-bottom, polygon(50% 0%, 0% 54%, 100% 54%))}:host([data-current-placement^=left]) .popup__arrow{clip-path:polygon(50% 0%, 100% 50%, 50% 100%)}:host([data-current-placement^=right]) .popup__arrow{clip-path:polygon(0% 50%, 50% 0%, 50% 100%)}.arrow__overlay{position:absolute;width:calc(var(--arrow-size) * 2);height:calc(var(--arrow-size) * 2);z-index:var(--arrow-zindex)}[popover]{margin:0px;padding:0px;border:none;overlay:none !important;overflow:visible;position:fixed}";
const HbrPopupStyle0 = popupCss;

const HbrPopup = /*@__PURE__*/ proxyCustomElement(class HbrPopup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrReposition = createEvent(this, "hbr-reposition", 7);
        this.hbrPlacementChange = createEvent(this, "hbr-placement-change", 7);
        this.hbrPopupHide = createEvent(this, "hbr-popup-hide", 7);
        this.hbrPopupShow = createEvent(this, "hbr-popup-show", 7);
        this.arrowMouseleave = createEvent(this, "hbr-arrow-mouseleave", 7);
        this.arrowMouseenter = createEvent(this, "hbr-arrow-mouseenter", 7);
        this.currentPlacement = null;
        this.startGeneration = 0;
        this.anchor = undefined;
        this.active = false;
        this.placement = "top";
        this.strategy = "absolute";
        this.distance = 0;
        this.skidding = 0;
        this.arrow = false;
        this.arrowSize = 6;
        this.arrowPlacement = "anchor";
        this.arrowPadding = 12;
        this.flip = false;
        this.flipFallbackStrategy = "best-fit";
        this.flipBoundary = undefined;
        this.flipPadding = 0;
        this.shift = false;
        this.enablePopover = false;
        this.shiftBoundary = undefined;
        this.shiftPadding = 0;
        this.autoSize = undefined;
        this.sync = undefined;
        this.autoSizeBoundary = undefined;
        this.autoSizePadding = 0;
        this.composed = false;
    }
    handleMousedown(event) {
        const path = event.composedPath();
        const component = this.host.hasAttribute("data-component");
        const select = component && this.host.hasAttribute("data-component");
        this.host.getAttribute("data-component") === "hbr-select";
        const externalAnchor = select && this.host.getAttribute("data-external-anchor");
        // Avoid unnecessary event listeners on select
        if (select && !externalAnchor) {
            return;
        }
        if (path.includes(this.host)) {
            this.hbrPopupShow.emit({
                type: "inside-click",
                component,
                externalAnchor,
            });
        }
        else {
            if (!(this.anchor instanceof HTMLElement) &&
                path.includes(this.anchorRef)) {
                /** external */
                this.hbrPopupShow.emit({
                    type: "inside-click",
                    component,
                    externalAnchor,
                });
            }
            else {
                this.hbrPopupHide.emit({
                    type: "outside-click",
                    component,
                    externalAnchor,
                });
            }
        }
    }
    connectedCallback() {
        this.handleAnchorChange = this.handleAnchorChange.bind(this);
        // Stencil calls connectedCallback again when a loaded popup is reattached.
        if (this.popupRef && this.active) {
            void this.start();
        }
    }
    disconnectedCallback() {
        void this.stop();
    }
    componentDidLoad() {
        this.handleAnchorChange();
    }
    componentDidUpdate() {
        // All other properties will trigger a reposition when active
        if (this.active) {
            this.reposition();
        }
    }
    handleAnchorChange() {
        this.stop();
        if (this.anchor && typeof this.anchor === "string") {
            // Locate the anchor by querySelector
            this.anchorRef = document === null || document === void 0 ? void 0 : document.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLElement ||
            this.anchor instanceof SVGElement) {
            // Use the anchor's reference
            this.anchorRef = this.anchor;
        }
        else {
            // Look for a slotted anchor
            this.anchorRef = this.host.querySelector('[slot="anchor"]');
        }
        if (this.enablePopover && this.anchorRef) {
            this.anchorRef.popoverTargetElement = this.popupRef;
        }
        // If the anchor is a <slot>, we'll use the first assigned element as the target since slots use `display: contents`
        // and positioning can't be calculated on them
        if (this.anchorRef instanceof HTMLSlotElement) {
            this.anchorRef = this.anchorRef.assignedElements({
                flatten: true,
            })[0];
        }
        if (!this.anchorRef) {
            console.warn("Invalid anchor element: no anchor could be found using the anchor slot or the anchor attribute.");
        }
        this.start();
    }
    async start() {
        // Position tracking is only needed while the popup is connected and active.
        if (!this.host.isConnected || !this.active || !this.anchorRef) {
            return;
        }
        if (this.cleanup) {
            return;
        }
        const generation = ++this.startGeneration;
        const anchorRef = this.anchorRef;
        const popupRef = this.popupRef;
        if (!anchorRef || !popupRef) {
            return;
        }
        const { autoUpdate } = await loadFloatingUi();
        if (generation !== this.startGeneration ||
            !this.host.isConnected ||
            !this.active ||
            anchorRef !== this.anchorRef ||
            popupRef !== this.popupRef) {
            return;
        }
        this.cleanup = autoUpdate(anchorRef, popupRef, () => {
            void this.reposition();
        });
    }
    stop() {
        this.startGeneration++;
        return new Promise((resolve) => {
            if (this.cleanup) {
                this.cleanup();
                this.cleanup = undefined;
                this.currentPlacement = null;
                this.host.removeAttribute("data-current-placement");
                this.host.style.removeProperty("--auto-size-available-width");
                this.host.style.removeProperty("--auto-size-available-height");
                requestAnimationFrame(() => resolve(null));
            }
            else {
                resolve(null);
            }
        });
    }
    async handleActiveChange() {
        if (this.active) {
            if (this.enablePopover && this.popupRef) {
                this.popupRef.showPopover();
            }
            await this.start();
        }
        else {
            if (this.enablePopover && this.popupRef) {
                this.popupRef.hidePopover();
            }
            await this.stop();
        }
    }
    handlePlacementChange() {
        if (this.active) {
            this.reposition();
        }
    }
    handleArrowChange() {
        if (this.active) {
            this.reposition();
        }
    }
    /** Forces the popup to recalculate and reposition itself. */
    async reposition() {
        // Nothing to do if the popup is inactive or the anchor doesn't exist
        if (!this.active || !this.anchorRef) {
            return;
        }
        const { arrow, computePosition, flip, offset, platform, shift, size } = await loadFloatingUi();
        //
        // NOTE: Floating UI middlewares are order dependent: https://floating-ui.com/docs/middleware
        //
        const middleware = [
            // The offset middleware goes first
            offset({
                mainAxis: this.arrow ? this.arrowSize + this.distance : this.distance,
                crossAxis: this.skidding,
            }),
        ];
        // First we sync width/height
        if (this.sync) {
            middleware.push(size({
                apply: ({ rects }) => {
                    const syncWidth = this.sync === "width" || this.sync === "both";
                    const syncHeight = this.sync === "height" || this.sync === "both";
                    this.popupRef.style.width = syncWidth
                        ? `${rects.reference.width}px`
                        : "";
                    this.popupRef.style.height = syncHeight
                        ? `${rects.reference.height}px`
                        : "";
                },
            }));
        }
        else {
            // Cleanup styles if we're not matching width/height
            this.popupRef.style.width = "";
            this.popupRef.style.height = "";
        }
        // Then we flip
        if (this.flip) {
            middleware.push(flip({
                boundary: this.flipBoundary,
                // // @ts-expect-error - We're converting a string attribute to an array here
                // fallbackPlacements: this.flipFallbackPlacements,
                fallbackStrategy: this.flipFallbackStrategy === "best-fit"
                    ? "bestFit"
                    : "initialPlacement",
                padding: this.flipPadding,
            }));
        }
        // Then we shift
        if (this.shift) {
            middleware.push(shift({
                boundary: this.shiftBoundary,
                padding: this.shiftPadding,
            }));
        }
        // Now we adjust the size as needed
        // TODO - readdress this logic at 319
        if (this.autoSize) {
            middleware.push(size({
                boundary: this.autoSizeBoundary,
                padding: this.autoSizePadding,
                apply: ({ availableWidth, availableHeight }) => {
                    if (this.autoSize === "vertical" || this.autoSize === "both") {
                        this.host.style.setProperty("--auto-size-available-height", `${Math.max(availableHeight, this.autoSizePadding || 0)}px`);
                    }
                    else {
                        this.host.style.removeProperty("--auto-size-available-height");
                    }
                    if (this.autoSize === "horizontal" || this.autoSize === "both") {
                        this.host.style.setProperty("--auto-size-available-width", `${availableWidth}px`);
                    }
                    else {
                        this.host.style.removeProperty("--auto-size-available-width");
                    }
                },
            }));
        }
        else {
            // Cleanup styles if we're no longer using auto-size
            this.host.style.removeProperty("--auto-size-available-width");
            this.host.style.removeProperty("--auto-size-available-height");
        }
        // Finally, we add an arrow
        if (this.arrow) {
            middleware.push(arrow({
                element: this.arrowRef,
                padding: this.arrowPadding,
            }));
        }
        //
        // Use custom positioning logic if the strategy is absolute. Otherwise, fall back to the default logic.
        //
        // More info: https://github.com/shoelace-style/shoelace/issues/1135
        //
        const getOffsetParent = this.strategy === "absolute"
            ? (element) => platform.getOffsetParent(element, offsetParent)
            : platform.getOffsetParent;
        computePosition(this.anchorRef, this.popupRef, {
            placement: this.placement,
            middleware,
            strategy: this.strategy,
            platform: Object.assign(Object.assign({}, platform), { getOffsetParent }),
        }).then(({ x, y, middlewareData, placement }) => {
            var _a, _b, _c;
            //
            // Even though we have our own localization utility, it uses different heuristics to determine RTL. Because of
            // that, we'll use the same approach that Floating UI uses.
            //
            // Source: https://github.com/floating-ui/floating-ui/blob/cb3b6ab07f95275730d3e6e46c702f8d4908b55c/packages/dom/src/utils/getDocumentRect.ts#L31
            //
            const isRtl = getComputedStyle(this.host).direction === "rtl";
            // biome-ignore lint/style/noNonNullAssertion: unknown
            const staticSide = {
                top: "bottom",
                right: "left",
                bottom: "top",
                left: "right",
            }[placement.split("-")[0]];
            const previousPlacement = this.currentPlacement;
            this.currentPlacement = placement;
            this.host.setAttribute("data-current-placement", placement);
            if (this.placement !== placement && previousPlacement !== placement) {
                this.hbrPlacementChange.emit({
                    placement: this.placement,
                    currentPlacement: placement,
                });
            }
            Object.assign(this.popupRef.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
            if (this.arrow) {
                const arrowX = (_a = middlewareData.arrow) === null || _a === void 0 ? void 0 : _a.x;
                const arrowY = (_b = middlewareData.arrow) === null || _b === void 0 ? void 0 : _b.y;
                let top = "";
                let right = "";
                let bottom = "";
                let left = "";
                if (this.arrowPlacement === "start") {
                    // Start
                    const value = typeof arrowX === "number" ? `${this.arrowPadding}px` : "";
                    top = typeof arrowY === "number" ? `${this.arrowPadding}px` : "";
                    right = isRtl ? value : "";
                    left = isRtl ? "" : value;
                }
                else if (this.arrowPlacement === "end") {
                    // End
                    const value = typeof arrowX === "number" ? `${this.arrowPadding}px` : "";
                    right = isRtl ? "" : value;
                    left = isRtl ? value : "";
                    bottom = typeof arrowY === "number" ? `${this.arrowPadding}px` : "";
                }
                else if (this.arrowPlacement === "center") {
                    // Center
                    left =
                        typeof arrowX === "number" ? "calc(50% - var(--arrow-size))" : "";
                    top =
                        typeof arrowY === "number" ? "calc(50% - var(--arrow-size))" : "";
                }
                else {
                    // Anchor (default)
                    left = typeof arrowX === "number" ? `${arrowX}px` : "";
                    top = typeof arrowY === "number" ? `${arrowY}px` : "";
                }
                Object.assign(this.arrowRef.style, {
                    top,
                    right,
                    bottom,
                    left,
                    [staticSide]: "calc(var(--arrow-size) * -1 + var(--arrow-border-overlap, 0px))",
                });
                /** for onHover use case */
                if (this.arrowOverlayRef) {
                    Object.assign(this.arrowOverlayRef.style, {
                        top,
                        right,
                        bottom,
                        left,
                        [staticSide]: "calc(var(--arrow-size) * -1 + var(--arrow-border-overlap, 0px))",
                    });
                    const { height, width } = ((_c = this.arrowRef) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect()) || {};
                    const { distance } = this;
                    const { style } = this.arrowRef || {};
                    if (height && width && style) {
                        const overlayPadding = 4; // Extra padding for easier hovering
                        const overlayWidth = overlayPadding * 4;
                        const overlayOffset = overlayWidth / 1.5;
                        if (staticSide === "top") {
                            this.arrowOverlayRef.style.top = `${-(height / 2 +
                                distance +
                                overlayPadding)}px`;
                            this.arrowOverlayRef.style.height = `${height + distance + overlayPadding}px`;
                            this.arrowOverlayRef.style.width = `${width + overlayWidth}px`;
                            this.arrowOverlayRef.style.left = `${typeof arrowX === "number"
                                ? arrowX - overlayOffset
                                : -overlayOffset}px`;
                        }
                        else if (staticSide === "bottom") {
                            this.arrowOverlayRef.style.bottom = `${-height / 2 - distance - overlayPadding}px`;
                            this.arrowOverlayRef.style.height = `${height + distance + overlayPadding}px`;
                            this.arrowOverlayRef.style.width = `${width + overlayWidth}px`;
                            this.arrowOverlayRef.style.left = `${typeof arrowX === "number"
                                ? arrowX - overlayOffset
                                : -overlayOffset}px`;
                        }
                        else if (staticSide === "left") {
                            this.arrowOverlayRef.style.left = `${-(width / 2 +
                                distance +
                                overlayPadding)}px`;
                            this.arrowOverlayRef.style.width = `${width + distance + overlayPadding}px`;
                            this.arrowOverlayRef.style.height = `${height + overlayWidth}px`;
                            this.arrowOverlayRef.style.top = `${typeof arrowY === "number"
                                ? arrowY - overlayOffset
                                : -overlayOffset}px`;
                        }
                        else if (staticSide === "right") {
                            this.arrowOverlayRef.style.right = `${-width / 2 - distance - overlayPadding}px`;
                            this.arrowOverlayRef.style.width = `${width + distance + overlayPadding}px`;
                            this.arrowOverlayRef.style.height = `${height + overlayWidth}px`;
                            this.arrowOverlayRef.style.top = `${typeof arrowY === "number"
                                ? arrowY - overlayOffset
                                : -overlayOffset}px`;
                        }
                    }
                }
            }
        });
        this.hbrReposition.emit();
    }
    handleKeyDown(event) {
        if (event.key === "Escape" || event.key === "Esc") {
            this.hbrPopupHide.emit({ type: "escape" });
        }
    }
    render() {
        return (h(Host, { key: 'a3b7473487d3b50db409a80f6f46a0f95fcea4e0' }, h("slot", { key: '8158c44cff928669d0e55c497b78b38229bf9fb6', name: "anchor", onSlotchange: this.handleAnchorChange }), h("div", { key: 'b3c58a0644db57b9048fca7a8aaefc6a2c015917', part: "popup", ref: (el) => {
                this.popupRef = el;
                if (this.enablePopover && this.popupRef) {
                    this.popupRef.popover = "manual";
                }
            }, class: {
                popup: true,
                "popup--active": this.active,
                "popup--fixed": this.strategy === "fixed",
                "popup--has-arrow": this.arrow,
            }, onKeyDown: this.handleKeyDown.bind(this) }, this.arrow ? (h(Fragment, null, h("div", { part: "arrow", ref: (el) => {
                this.arrowRef = el;
            }, class: "popup__arrow", role: "presentation" }), h("div", { class: "arrow__overlay", onMouseLeave: () => {
                this.arrowMouseleave.emit();
            }, onMouseEnter: () => {
                this.arrowMouseenter.emit();
            }, ref: (el) => {
                this.arrowOverlayRef = el;
            } }))) : null, h("slot", { key: 'bc758a821f685e5ba958ed3e7369a72732466fce' }))));
    }
    get host() { return this; }
    static get watchers() { return {
        "anchor": ["handleAnchorChange"],
        "active": ["handleActiveChange"],
        "placement": ["handlePlacementChange"],
        "arrow": ["handleArrowChange"]
    }; }
    static get style() { return HbrPopupStyle0; }
}, [1, "hbr-popup", {
        "anchor": [1],
        "active": [516],
        "placement": [513],
        "strategy": [513],
        "distance": [2],
        "skidding": [2],
        "arrow": [516],
        "arrowSize": [514, "arrow-size"],
        "arrowPlacement": [1, "arrow-placement"],
        "arrowPadding": [514, "arrow-padding"],
        "flip": [4],
        "flipFallbackStrategy": [1, "flip-fallback-strategy"],
        "flipBoundary": [16],
        "flipPadding": [2, "flip-padding"],
        "shift": [4],
        "enablePopover": [4, "enable-popover"],
        "shiftBoundary": [16],
        "shiftPadding": [2, "shift-padding"],
        "autoSize": [1, "auto-size"],
        "sync": [1],
        "autoSizeBoundary": [16],
        "autoSizePadding": [2, "auto-size-padding"],
        "composed": [4],
        "reposition": [64]
    }, [[5, "mousedown", "handleMousedown"]], {
        "anchor": ["handleAnchorChange"],
        "active": ["handleActiveChange"],
        "placement": ["handlePlacementChange"],
        "arrow": ["handleArrowChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-popup"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrPopup);
            }
            break;
    } });
}

export { HbrPopup as H, defineCustomElement as d };

