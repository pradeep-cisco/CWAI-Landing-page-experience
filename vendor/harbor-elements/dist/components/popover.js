import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { b as isSafari } from './browser.js';
import { p as parseDuration } from './animate.js';
import { d as defineCustomElement$1 } from './popup.js';

const popoverCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--hide-delay:0ms;--show-delay:150ms;--bg-color:var(--control-bg-weak-default);--text-color:var(--base-text-medium-default);--padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);--max-width:280px;--shadow:var(--hbr-shadow-lg);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal);--line-height:18px;--arrow-color:var(--bg-color);--arrow-radius:8px;--arrow-offset:calc(var(--arrow-radius) * 2);--transition-delay:0.3s;--border-width:0;--border-radius:var(--hbr-border-radius-md);--outline-width:0;--popup-z-index:var(--hbr-z-index-tooltip);--chart-body-border-color:var(--control-border-strong-default);--map-arrow-color:var(--control-icon-strong-hover);--map-body-border-color:var(--control-icon-strong-hover);--border:var(--border-width) solid transparent}.popover{--arrow-size:8px;--arrow-color:var(--bg-color)}.popover.popover--small{--max-width:200px}.popover.popover--large{--max-width:360px}.popover .popover__body{border:var(--border);--arrow-border-overlap:0px}.popover.popover--brand{--border-width:2px;--outline-width:2px;--arrow-offset:calc(calc(var(--arrow-radius) * 2) + var(--border-width));--arrow-color:var(--brand-accent-icon-weak-active, #6BBF41);--arrow-zindex:-1}.popover.popover--brand .popover__body{border:var(--border-width) solid var(--brand-accent-icon-medium-active, #52A62B);outline:var(--outline-width) solid var(--brand-accent-icon-weak-active, #6BBF41)}.popover.popover--chart{--arrow-size:0;--border-width:2px}.popover.popover--chart .popover__body{border:var(--border-width) solid var(--chart-body-border-color)}.popover.popover--confirm{--max-width:276px}.popover.popover--confirm.popover--small{--max-width:196px}.popover.popover--confirm.popover--large{--max-width:356px}.popover.popover--width-expand .popover__body{min-width:var(--max-width);max-width:initial}.popover.popover--map{--border-width:2px;--arrow-offset:calc(calc(var(--arrow-radius) * 2) + var(--border-width));--arrow-color:var(--control-icon-strong-hover);--arrow-zindex:-1}.popover.popover--map .popover__body{border:var(--border-width) solid var(--control-icon-strong-hover)}.popover::part(popup){z-index:var(--popup-z-index)}.popover[placement^=top]::part(popup){transform-origin:bottom}.popover[placement^=bottom]::part(popup){transform-origin:top}.popover[placement^=left]::part(popup){transform-origin:right}.popover[placement^=right]::part(popup){transform-origin:left}.popover__body{display:block;box-sizing:border-box;width:max-content;max-width:var(--max-width);border-radius:var(--border-radius);background-color:var(--bg-color);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);color:var(--text-color);padding:var(--padding);box-shadow:var(--shadow);border:var(--border)}.hbr-css-popover__anchor{width:fit-content;display:flex}:host-context([data-theme=onecd]){--border-radius:var(--onecd-radius-large-strong, 12px);--border:none;--bg-color:var(--onecd-glass-frost-bg-control, rgba(255, 255, 255, 0.85));--shadow:0 0 30px 0 var(--onecd-glass-frost-shadow-inner, rgba(255, 255, 255, 0.60)) inset, 0 0 0 1px var(--onecd-glass-frost-shadow-border, rgba(255, 255, 255, 0.60)) inset, 0 0 0 0 rgba(0, 0, 0, 0.00);position:relative}:host-context([data-theme=onecd]) .popover--chart{--border-width:0px}:host-context([data-theme=onecd]) hbr-popup::part(popup){box-shadow:0 4px 12px 0 var(--shadow-colors-elevation-floating, rgba(11, 17, 24, 0.18));border-radius:var(--onecd-radius-large-strong, 12px)}:host-context([data-theme=onecd]):not([sentiment=brand]) hbr-popup::part(arrow){background-color:var(--onecd-glass-frost-bg-control, rgba(255, 255, 255, 0.85));box-shadow:0 0 30px 0 var(--onecd-glass-frost-shadow-inner, rgba(255, 255, 255, 0.6)) inset, 0 0 0 1px var(--onecd-glass-frost-shadow-border, rgba(255, 255, 255, 0.6)) inset, 0 0 0 0 rgba(0, 0, 0, 0)}:host-context([data-theme=onecd]):not([sentiment=brand]) hbr-popup::part(arrow)::before{content:\" \";z-index:-1;position:absolute;top:0;left:0;right:0;bottom:0;-webkit-backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));border-radius:inherit}:host-context([data-theme=onecd]) [part=body]::before{content:\" \";z-index:-1;position:absolute;top:0;left:0;right:0;bottom:0;-webkit-backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));border-radius:inherit}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]){--bg-color:var(--control-bg-weak-default, #FFF);--shadow:0 4px 12px 0 var(--shadow-colors-elevation-floating, rgba(0, 0, 0, 0.18))}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]):not([sentiment=brand]) hbr-popup::part(arrow){background-color:var(--control-bg-weak-default, #FFF);box-shadow:0 4px 12px 0 var(--shadow-colors-elevation-floating, rgba(0, 0, 0, 0.18))}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]):not([sentiment=brand]) hbr-popup::part(arrow)::before{content:none}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]) [part=body]::before{content:none}";
const HbrPopoverStyle0 = popoverCss;

const HbrPopover = /*@__PURE__*/ proxyCustomElement(class HbrPopover extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrDismiss = createEvent(this, "hbr-dismiss", 7);
        this.cancelHide = false;
        this.handleBlur = () => {
            if (this.hasTrigger("focus")) {
                this.open = false;
            }
        };
        this.handleClick = () => {
            if (this.featureHighlight)
                return;
            if (this.hasTrigger("click")) {
                this.open = !this.open;
            }
        };
        this.handleFocus = () => {
            if (this.hasTrigger("focus")) {
                this.open = true;
            }
        };
        this.handleKeyDown = (event) => {
            if (this.featureHighlight)
                return; //only close when a user explicitly dismisses it using the buttons inside the popover.
            // Pressing escape when the target element has focus should dismiss the popover
            if (this.open && event.key === "Escape") {
                event.stopPropagation();
                this.open = false;
            }
        };
        this.handleMouseOver = () => {
            if (this.hasTrigger("hover")) {
                const delay = parseDuration(getComputedStyle(this.host).getPropertyValue("--hide-delay"));
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = window.setTimeout(() => this.show(), delay);
            }
        };
        this.handleMouseOut = () => {
            if (this.hasTrigger("hover")) {
                const delay = parseDuration(getComputedStyle(this.host).getPropertyValue("--show-delay"));
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = window.setTimeout(() => this.hide(), delay);
            }
        };
        this.handleArrowMouseLeave = () => {
            this.cancelHide = false;
            this.handleMouseOut();
        };
        this.handleArrowMouseEnter = () => {
            this.cancelHide = true;
        };
        this.anchor = undefined;
        this.content = "";
        this.placement = "top";
        this.disabled = false;
        this.distance = 8;
        this.open = false;
        this.skidding = 0;
        this.trigger = "click";
        this.hoist = false;
        this.enablePopover = false;
        this.size = undefined;
        this.variant = "default";
        this.sentiment = undefined;
        this.widthExpand = false;
        this.featureHighlight = false;
    }
    async handleOpenChange() {
        if (!this.popupRef)
            return;
        if (this.open) {
            if (this.disabled) {
                return;
            }
            // Show
            this.hbrShow.emit();
            // TODO: animation
            /**  await stopAnimations(this.popupContentRef); */
            if (this.popupContentRef) {
                this.popupContentRef.hidden = false;
            }
            this.popupRef.active = true;
            /**
      const { keyframes, options } = getAnimation(this.host, 'popover.show', { dir: "ltr" });
      await animateTo(this.popupRef.popupRef, keyframes, options);
      */
            this.hbrAfterShow.emit();
            // Dismiss on click outside
            document.addEventListener("click", this.handleBodyClick);
        }
        else {
            // Hide
            this.hbrHide.emit();
            // TODO: animation
            /**
      await stopAnimations(this.popupContentRef);
      const { keyframes, options } = getAnimation(this, 'popover.hide', { dir: this.localize.dir() });
      await animateTo(this.popupRef.popupRef, keyframes, options);
      */
            this.popupRef.active = false;
            if (this.popupContentRef) {
                this.popupContentRef.hidden = true;
            }
            // Safari fix: force re-render of shadow DOM slot content
            if (isSafari()) {
                const anchor = this.anchorRef;
                if (anchor) {
                    const parent = anchor.parentElement;
                    const next = anchor.nextSibling;
                    // Delay re-insertion slightly to ensure reflow
                    requestAnimationFrame(() => {
                        parent === null || parent === void 0 ? void 0 : parent.removeChild(anchor);
                        requestAnimationFrame(() => {
                            if (next) {
                                parent === null || parent === void 0 ? void 0 : parent.insertBefore(anchor, next);
                            }
                            else {
                                parent === null || parent === void 0 ? void 0 : parent.appendChild(anchor);
                            }
                        });
                    });
                }
            }
            this.hbrAfterHide.emit();
            // Remove Dismiss on click outside
            // TODO: remove event doesn't work in portal case, probably because handleBodyClick reference changes
            document.removeEventListener("click", this.handleBodyClick);
        }
    }
    async handleOptionsChange() {
        var _a;
        await ((_a = this.popupRef) === null || _a === void 0 ? void 0 : _a.reposition());
    }
    handleDisabledChange() {
        if (this.disabled && this.open) {
            this.open = false;
        }
    }
    handleSentimentChange() {
        this.featureHighlight = this.sentiment === "brand";
    }
    handleAnchorChange() {
        if (this.anchor && typeof this.anchor === "string") {
            const root = this.host.getRootNode();
            this.anchorRef = root.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLElement ||
            this.anchor instanceof SVGElement) {
            this.anchorRef = this.anchor;
        }
        if (this.anchorRef) {
            this.bindEventsToAnchor();
        }
    }
    /** Shows the popover. */
    async show() {
        if (this.open) {
            return undefined;
        }
        this.open = true;
        this.hbrAfterShow.emit();
    }
    /** Hides the popover */
    async hide() {
        if (this.hasTrigger("hover") && this.cancelHide) {
            return undefined;
        }
        if (!this.open) {
            return undefined;
        }
        this.open = false;
        this.hbrAfterHide.emit();
    }
    hasTrigger(triggerType) {
        const triggers = this.trigger.split(" ");
        return triggers.includes(triggerType);
    }
    isTargetWithin(e) {
        return (e.target.closest("hbr-popover") === this.host ||
            e.target.closest(".hbr-css-popover__anchor") === this.anchorRef ||
            e.target === this.anchorRef);
    }
    handleBodyClick(e) {
        if (this.featureHighlight)
            return; //only close when a user explicitly dismisses it using the buttons inside the popover.
        if (this.isTargetWithin(e))
            return;
        if (this.trigger === "manual")
            return;
        const hbrDismiss = this.hbrDismiss.emit();
        if (!hbrDismiss.defaultPrevented) {
            this.hide();
        }
    }
    bindEventsToAnchor() {
        this.anchorRef.addEventListener("blur", this.handleBlur, true);
        this.anchorRef.addEventListener("focus", this.handleFocus, true);
        this.anchorRef.addEventListener("click", this.handleClick);
        this.anchorRef.addEventListener("keydown", this.handleKeyDown);
        this.anchorRef.addEventListener("mouseover", this.handleMouseOver);
        this.anchorRef.addEventListener("mouseout", this.handleMouseOut);
    }
    connectedCallback() {
        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.handleAnchorChange = this.handleAnchorChange.bind(this);
        this.handleSentimentChange();
    }
    componentDidLoad() {
        var _a;
        this.handleAnchorChange();
        if (this.popupContentRef)
            this.popupContentRef.hidden = !this.open;
        // If the popover is visible on init, update its position
        if (this.open) {
            this.handleOpenChange();
            this.popupRef.active = true;
            (_a = this.popupRef) === null || _a === void 0 ? void 0 : _a.reposition();
        }
    }
    render() {
        const anchor = this.anchorRef || this.anchor;
        return (h(Host, { key: '57849f1f61992810ae4f14efe970e518e607f44d' }, h("hbr-popup", { key: 'fd2cfd0b447881f843e8c4b27b0eda1f69c75c28', part: "base", exportparts: "arrow:base__arrow,popup:base__popup", ref: (el) => {
                this.popupRef = el;
            }, anchor: anchor, class: Object.assign(Object.assign({ popover: true, "popover--open": this.open, "popover--width-expand": this.widthExpand, [`popover--${this.variant}`]: true }, (this.size ? { [`popover--${this.size}`]: true } : null)), (this.sentiment
                ? { [`popover--${this.sentiment}`]: true }
                : null)), placement: this.placement, distance: this.distance, skidding: this.skidding, strategy: this.enablePopover || this.hoist ? "fixed" : "absolute", enablePopover: this.enablePopover, flip: true, shift: true, arrow: true, arrowSize: 8, "onHbr-arrow-mouseleave": this.handleArrowMouseLeave, "onHbr-arrow-mouseenter": this.handleArrowMouseEnter }, !this.anchor ? (h("div", { slot: "anchor", class: "hbr-css-popover__anchor", "aria-describedby": "popover", ref: (el) => {
                this.anchorRef = el;
            } }, h("slot", null))) : null, h("div", { key: '04a85f1f9c758429a9da77e0739bdf2a1c0360ee', part: "body", class: "popover__body", "aria-live": this.open ? "polite" : "off", onMouseLeave: () => {
                this.cancelHide = false;
                this.handleMouseOut();
            }, onMouseEnter: () => {
                this.cancelHide = true;
            }, ref: (el) => {
                this.popupContentRef = el;
            } }, h("slot", { key: '822d08e220060438addda4cdd0d3e4f347c41329', name: "content" }, this.content)))));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"],
        "content": ["handleOptionsChange"],
        "distance": ["handleOptionsChange"],
        "hoist": ["handleOptionsChange"],
        "placement": ["handleOptionsChange"],
        "skidding": ["handleOptionsChange"],
        "disabled": ["handleDisabledChange"],
        "sentiment": ["handleSentimentChange"],
        "anchor": ["handleAnchorChange"]
    }; }
    static get style() { return HbrPopoverStyle0; }
}, [1, "hbr-popover", {
        "anchor": [1],
        "content": [1],
        "placement": [1],
        "disabled": [516],
        "distance": [2],
        "open": [1540],
        "skidding": [2],
        "trigger": [1],
        "hoist": [516],
        "enablePopover": [4, "enable-popover"],
        "size": [1],
        "variant": [1],
        "sentiment": [513],
        "widthExpand": [516, "width-expand"],
        "featureHighlight": [32],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"],
        "content": ["handleOptionsChange"],
        "distance": ["handleOptionsChange"],
        "hoist": ["handleOptionsChange"],
        "placement": ["handleOptionsChange"],
        "skidding": ["handleOptionsChange"],
        "disabled": ["handleDisabledChange"],
        "sentiment": ["handleSentimentChange"],
        "anchor": ["handleAnchorChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-popover", "hbr-popup"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrPopover);
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrPopover as H, defineCustomElement as d };

