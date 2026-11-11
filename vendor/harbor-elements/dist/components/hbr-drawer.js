import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { q as x } from './index2.js';
import { i as isPreventScrollSupported } from './browser.js';
import { g as getBootstrapConfig, d as defineCustomElement$4 } from './icon.js';
import { M as Modal, h as handleStartSentinelFocus, a as handleEndSentinelFocus } from './modal2.js';
import { u as unlockBodyScrolling, l as lockBodyScrolling } from './scroll.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$5 } from './button.js';
import { d as defineCustomElement$3 } from './scroll-view.js';
import { d as defineCustomElement$2 } from './spinner.js';

const drawerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--size:400px;--size-small:400px;--size-medium:576px;--size-large:768px;--size-xlarge:960px;--closer-icon-color:var(--interact-icon-weak-default);--closer-icon-color-hover:var(--interact-icon-weak-hover);--bg-color:var(--control-bg-weak-default);--overlay-color:var(--overlay-bg-default);--panel-border-color:none;--header-border-bottom-color:var(--base-border-medium-default);--body-text-color:var(--base-text-default);display:contents;--shift-top:var(--hbr-app-shift-top, 0px)}[popover]{inset:auto;width:auto;height:auto;margin:0;padding:0;border:0;color:inherit;background:transparent}.drawer{top:var(--shift-top);left:0;width:100%;height:calc(100% - var(--shift-top));pointer-events:none;overflow:hidden}.drawer:not(.drawer--visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}.drawer--visible.drawer--open{overflow:visible}.drawer--no-overlay{top:var(--shift-top);height:calc(100% - var(--shift-top));pointer-events:none;overflow:hidden}.drawer--no-overlay:not(.drawer--visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}@media only screen and (min-width: 23.5em){.drawer--no-overlay{width:var(--size);right:0px}.drawer--no-overlay.drawer__small{width:var(--size-small)}.drawer--no-overlay.drawer__medium{width:var(--size-medium)}.drawer--no-overlay.drawer__large{width:var(--size-large)}.drawer--no-overlay.drawer__xlarge{width:var(--size-xlarge)}}@media only screen and (max-width: 23.4375em){.drawer--no-overlay{left:0px !important;width:100% !important}}.drawer--contained{position:absolute;z-index:initial}.drawer--fixed{position:fixed;z-index:var(--hbr-z-index-drawer)}.drawer__panel{position:absolute;display:flex;flex-direction:column;z-index:2;max-width:100%;max-height:100%;background-color:var(--bg-color);box-shadow:var(--hbr-shadow-md);transition:var(--hbr-transition-medium) transform;overflow:auto;pointer-events:all;border-left-style:none;border-left-width:none;border-color:var(--panel-border-color)}.drawer__panel:focus{outline:none}.drawer--top .drawer__panel{top:0;right:auto;bottom:auto;left:0;width:100%;height:var(--size);transform:translate(0, -100%)}.drawer--right .drawer__panel{top:0;height:100%;transform:translate(100%, 0)}@media only screen and (min-width: 23.5em){.drawer--right .drawer__panel{width:var(--size);left:auto;right:0;bottom:auto}.drawer--right .drawer__panel.drawer__small{width:var(--size-small)}.drawer--right .drawer__panel.drawer__medium{width:var(--size-medium)}.drawer--right .drawer__panel.drawer__large{width:var(--size-large)}.drawer--right .drawer__panel.drawer__xlarge{width:var(--size-xlarge)}}@media only screen and (max-width: 23.4375em){.drawer--right .drawer__panel{left:0px !important;width:100% !important}}.drawer--bottom .drawer__panel{top:auto;right:auto;bottom:0;left:0;width:100%;height:var(--size);transform:translate(0, 100%)}.drawer--left .drawer__panel{top:0;right:auto;bottom:auto;left:0;width:var(--size);height:100%;transform:translate(-100%, 0)}.drawer--open .drawer__panel{transform:translate(0, 0)}.drawer__header{display:flex;border-bottom-width:1px;border-bottom-color:var(--header-border-bottom-color);border-bottom-style:solid}:host(:not(.hbr-css__scroll-view-offset-top)) .drawer__header{border:none}.drawer__title{flex:1 1 auto;font-size:var(--hbr-font-size-xl);line-height:var(--hbr-font-line-height-dense);padding:16px 52px 12px 24px;font-family:var(--hbr-font-heading);font-weight:var(--hbr-font-weight-bold, 700);color:var(--base-text-strong-default)}.drawer__description{padding-top:var(--hbr-spacing-2xs);font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-normal, 400);line-height:var(--hbr-font-line-height-dense);color:var(--base-text-medium-default)}.drawer__close{margin:calc(var(--hbr-spacing-md) - 2px) var(--hbr-spacing-lg) 44px var(--hbr-spacing-sm);font-size:var(--hbr-font-size-md, 16px);position:fixed;right:0px;cursor:pointer}hbr-button.drawer__close::part(base){width:34px;height:34px;line-height:34px}.drawer__header hbr-icon-button::part(base){color:var(--closer-icon-color)}.drawer__header hbr-icon-button::part(icon-base){width:16px;height:16px}.drawer__header hbr-icon-button::part(base):hover{color:var(--closer-icon-color-hover)}.drawer__body{display:flex;flex-direction:column;flex:1 1 auto;padding:var(--hbr-spacing-lg);overflow:auto;-webkit-overflow-scrolling:touch;font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-normal);color:var(--body-text-color);letter-spacing:var(--hbr-font-letter-spacing-normal)}:host(:not([no-padding])) .drawer__body{padding:4px 24px 24px 24px}.drawer--base:not(.drawer--button-group-footer) .drawer__footer{text-align:right;padding:var(--hbr-spacing-md)}.drawer--base:not(.drawer--button-group-footer) .drawer__footer ::slotted(hbr-button:not(:last-of-type)){margin-right:var(--hbr-spacing-xs)}.drawer--button-group-footer .drawer__footer ::slotted(*){--button-group-padding:var(--hbr-spacing-md);--button-group-bg-color:transparent}.drawer--base:not(.drawer--has-footer) .drawer__footer{display:none}.drawer__overlay{display:block;position:fixed;top:0;right:0;bottom:0;left:0;background-color:var(--overlay-color);opacity:0;transition:var(--hbr-transition-medium) opacity;pointer-events:all}.drawer--contained .drawer__overlay{position:absolute}.drawer--open .drawer__overlay{opacity:1}.drawer--no-padding .drawer__body{padding:0}.drawer--no-padding .drawer__footer{padding:0}";
const HbrDrawerStyle0 = drawerCss;

const hasPreventScroll = isPreventScrollSupported();
let id = 0;
const Drawer = /*@__PURE__*/ proxyCustomElement(class Drawer extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrInitialFocus = createEvent(this, "hbr-initial-focus", 7);
        this.hbrOverlayDismiss = createEvent(this, "hbr-overlay-dismiss", 7);
        this.componentId = `drawer-${++id}`;
        this.willShow = false;
        this.willHide = false;
        // TODO : remove support for footer padding in v2.0 and remove this logic.
        this.buttonGroupInFooter = false;
        this.hasFooter = false;
        this.hasLabel = false;
        this.hasDescription = false;
        this.isVisible = false;
        this.open = false;
        this.enablePopover = false;
        this.label = "";
        this.placement = "right";
        this.contained = false;
        this.noHeader = false;
        this.overlay = false;
        this.noPadding = false;
        this.size = null;
        this.scrollAware = false;
    }
    handleOpenChange() {
        this.open ? this.show() : this.hide();
    }
    connectedCallback() {
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.host.addEventListener("keydown", this.handleKeyDown, true);
        this.modal = new Modal(this.host, {
            onFocusOut: () => { var _a; return (this.contained ? null : (_a = this.panel) === null || _a === void 0 ? void 0 : _a.focus()); },
        }, this.overlay);
    }
    componentWillLoad() {
        this.handleSlotChange();
        // Show on init if open
        if (this.open) {
            this.show();
        }
    }
    componentDidLoad() {
        if (this.open && this.enablePopover) {
            this.drawer.showPopover();
        }
    }
    disconnectedCallback() {
        this.host.removeEventListener("keydown", this.handleKeyDown, true);
        unlockBodyScrolling(this.host);
    }
    /** Shows the drawer */
    async show() {
        if (this.willShow) {
            return;
        }
        const hbrShow = this.hbrShow.emit();
        if (hbrShow.defaultPrevented) {
            this.open = false;
            return;
        }
        this.willShow = true;
        this.isVisible = true;
        this.open = true;
        if (this.enablePopover && this.drawer) {
            this.drawer.showPopover();
        }
        // Lock body scrolling only if the drawer isn't contained
        if (!this.contained) {
            this.modal.activate();
            if (this.overlay)
                lockBodyScrolling(this.host);
        }
        if (this.open) {
            if (hasPreventScroll) {
                // Wait for the next frame before setting initial focus so the dialog is technically visible
                requestAnimationFrame(() => {
                    var _a;
                    const hbrInitialFocus = this.hbrInitialFocus.emit();
                    if (!hbrInitialFocus.defaultPrevented && !this.noHeader) {
                        (_a = this.host.shadowRoot.querySelector(".drawer__close")) === null || _a === void 0 ? void 0 : _a.setFocus({ preventScroll: true });
                    }
                });
            }
            else {
                // Once Safari supports { preventScroll: true } we can remove this nasty little hack, but until then we need to
                // wait for the transition to complete before setting focus, otherwise the panel may render in a buggy way its
                // out of view initially.
                //
                // Fiddle: https://jsfiddle.net/g6buoafq/1/
                // Safari: https://bugs.webkit.org/show_bug.cgi?id=178583
                //
                this.drawer.addEventListener("transitionend", () => {
                    var _a;
                    const hbrInitialFocus = this.hbrInitialFocus.emit();
                    if (!hbrInitialFocus.defaultPrevented && !this.noHeader) {
                        (_a = this.host.shadowRoot.querySelector(".drawer__close")) === null || _a === void 0 ? void 0 : _a.setFocus({ preventScroll: true });
                    }
                }, { once: true });
            }
        }
    }
    /** Hides the drawer */
    async hide() {
        if (this.willHide) {
            return;
        }
        const hbrHide = this.hbrHide.emit();
        if (hbrHide.defaultPrevented) {
            this.open = true;
            return;
        }
        this.willHide = true;
        this.open = false;
        this.modal.deactivate();
        if (this.overlay)
            unlockBodyScrolling(this.host);
    }
    handleCloseClick() {
        this.hide();
    }
    handleKeyDown(event) {
        if (event.key === "Escape") {
            this.hide();
        }
    }
    handleOverlayClick() {
        const hbrOverlayDismiss = this.hbrOverlayDismiss.emit();
        if (!hbrOverlayDismiss.defaultPrevented) {
            this.hide();
        }
    }
    handleSlotChange() {
        this.hasFooter = hasSlot(this.host, "footer");
        this.hasLabel = hasSlot(this.host, "label");
        this.hasDescription = hasSlot(this.host, "description");
        if (this.hasFooter) {
            if (this.host.querySelector(".hbr-css__button-group")) {
                this.buttonGroupInFooter = true;
            }
        }
    }
    handleTransitionEnd(event) {
        const target = event.target;
        // Ensure we only emit one event when the target element is no longer visible
        if (event.propertyName === "transform" &&
            target.classList.contains("drawer__panel")) {
            this.isVisible = this.open;
            this.willShow = false;
            this.willHide = false;
            if (!this.open && this.enablePopover && this.drawer) {
                this.drawer.hidePopover();
            }
            this.open ? this.hbrAfterShow.emit() : this.hbrAfterHide.emit();
        }
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h("div", { key: 'bc2c8715327f55a6edd89dc2c8af3f188d0a4ad3', ref: (el) => {
                this.drawer = el;
                if (this.enablePopover && this.drawer) {
                    this.drawer.popover = "manual";
                }
            }, part: "base", class: {
                "drawer--base": true,
                drawer: this.overlay,
                "drawer--open": this.open,
                "drawer--visible": this.isVisible,
                "drawer--top": this.placement === "top",
                "drawer--right": this.placement === "right",
                "drawer--bottom": this.placement === "bottom",
                "drawer--left": this.placement === "left",
                "drawer--contained": this.contained,
                "drawer--fixed": !this.contained,
                "drawer--has-footer": this.hasFooter,
                "drawer--no-overlay": !this.overlay,
                drawer__small: this.size === "small",
                drawer__medium: this.size === "medium",
                drawer__large: this.size === "large",
                drawer__xlarge: this.size === "xlarge",
                "drawer--no-padding": this.noPadding,
                "drawer--button-group-footer": this.buttonGroupInFooter,
            }, onTransitionEnd: this.handleTransitionEnd }, this.overlay && (h("div", { part: "overlay", class: "drawer__overlay", onClick: this.handleOverlayClick, tabIndex: -1 })), h("span", { key: 'f9af6673f6710dc8b3c92a50dd6616b16ffdab3b', class: "drawer__focus-sentinel", tabIndex: this.open && !this.contained ? 0 : -1, onFocus: () => handleStartSentinelFocus(this.panel, "drawer"), "aria-hidden": this.open && !this.contained ? undefined : "true" }), h("div", { key: 'da68af522d7fb7bb77872f91d0b7a5c0104dfbe9', ref: (el) => {
                this.panel = el;
            }, part: "panel", tabIndex: -1, class: {
                drawer__panel: true,
                drawer__small: this.size === "small",
                drawer__medium: this.size === "medium",
                drawer__large: this.size === "large",
                drawer__xlarge: this.size === "xlarge",
            }, role: "dialog", "aria-modal": "true", "aria-hidden": this.open ? "false" : "true", "aria-label": this.noHeader ? this.label : null, "aria-labelledby": !this.noHeader ? `${this.componentId}-title` : null, "aria-describedby": !this.noHeader && !this.hasLabel && this.hasDescription
                ? `${this.componentId}-description`
                : null }, !this.noHeader && (h("header", { part: "header", class: "drawer__header" }, this.hasLabel ? (h("span", { part: "title", class: "drawer__title", id: `${this.componentId}-title` }, h("slot", { name: "label", onSlotchange: this.handleSlotChange }))) : (h("div", { part: "title", class: "drawer__title" }, h("div", { class: "drawer__heading", id: `${this.componentId}-title`, role: "heading", "aria-level": "2" }, h("slot", { name: "title", onSlotchange: this.handleSlotChange }, this.label || String.fromCharCode(65279))), h("div", { part: "description", class: "drawer__description", id: `${this.componentId}-description`, hidden: !this.hasDescription }, h("slot", { name: "description", onSlotchange: this.handleSlotChange })))), h("hbr-button", { variant: "text", class: "drawer__close", part: "closer", arialabel: "close the drawer", exportparts: "base:close-button", onClick: this.handleCloseClick, size: "medium", "data-testid": "close-button" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-icon"]) || x, sentiment: "neutral", size: "20px" })))), h("div", { key: 'a5be72c3d3536ec245c0ded4c6f650be230fb5fc', part: "body", class: "drawer__body", ref: (it) => {
                this.bodyRef = it;
            } }, h("slot", { key: 'c6e57fd7c8c5c16605a57bc4e284920b125971b1' })), h("footer", { key: '5e59de8425d95bf7bae59f0f5f84dbe9b700d6d6', part: "footer", class: "drawer__footer" }, h("slot", { key: '3fe58370b0c2323e3ff09d0d08e421bb072b9c59', name: "footer", onSlotchange: this.handleSlotChange }))), h("span", { key: '2fa88ca6c870fa1356b827f9d282c4d0143e988d', class: "drawer__focus-sentinel", tabIndex: this.open && !this.contained ? 0 : -1, onFocus: () => handleEndSentinelFocus(this.panel, "drawer"), "aria-hidden": this.open && !this.contained ? undefined : "true" }), this.scrollAware ? h("hbr-scroll-view", { anchor: ".drawer__body" }) : null));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"]
    }; }
    static get style() { return HbrDrawerStyle0; }
}, [1, "hbr-drawer", {
        "open": [1540],
        "enablePopover": [4, "enable-popover"],
        "label": [1],
        "placement": [1],
        "contained": [4],
        "noHeader": [4, "no-header"],
        "overlay": [4],
        "noPadding": [516, "no-padding"],
        "size": [513],
        "scrollAware": [516, "scroll-aware"],
        "hasFooter": [32],
        "hasLabel": [32],
        "hasDescription": [32],
        "isVisible": [32],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-drawer", "hbr-button", "hbr-icon", "hbr-scroll-view", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-drawer":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Drawer);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-scroll-view":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrDrawer = Drawer;
const defineCustomElement = defineCustomElement$1;

export { HbrDrawer, defineCustomElement };

