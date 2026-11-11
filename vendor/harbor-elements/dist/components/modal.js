import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { B as remove } from './index2.js';
import { i as isPreventScrollSupported } from './browser.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { M as Modal$1, h as handleStartSentinelFocus, a as handleEndSentinelFocus } from './modal2.js';
import { u as unlockBodyScrolling, l as lockBodyScrolling } from './scroll.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './icon-button.js';
import { d as defineCustomElement$1 } from './scroll-view.js';

const modalCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--width:fit-content;--width-xsmall:384px;--width-small:576px;--width-medium:768px;--width-large:912px;--padding:0px var(--hbr-spacing-lg) var(--hbr-spacing-lg) var(--hbr-spacing-lg);--height:auto;--min-height:0px;--panel-background-color:var(--base-bg-weak-default);--title-color:var(--base-text-strong-default);--close-button-color:var(--interact-icon-medium-default);--close-button-hover-color:var(--interact-icon-weak-hover);--body-content-color:var(--base-text-default);--slotted-alert-icon-color:var(--warning-icon-strong-default);--slotted-alert-title-color:var(--body-content-color);--slotted-alert-message-color:var(--body-content-color);--overlay-background-color:var(--overlay-bg-default);display:contents}[popover]{inset:auto;width:auto;height:auto;margin:0;padding:0;border:0;overflow:visible;color:inherit;background:transparent}:host(.hbr-css__scroll-view-offset-bottom),:host(.hbr-css__scroll-view-offset-bottom-none){--padding:0px var(--hbr-spacing-lg)}:host(.hbr-css__scroll-view-offset-top) .modal__header,:host(.hbr-css__scroll-view-offset-bottom) .modal__body{display:flex;border-bottom:1px solid var(--base-border-default)}.modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;right:0;bottom:0;left:0;z-index:var(--hbr-z-index-modal)}.modal:not(.modal--visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}.modal__panel{display:flex;flex-direction:column;z-index:2;height:var(--height);min-height:var(--min-height);background-color:var(--panel-background-color);border-radius:var(--hbr-border-radius-lg, 8px);box-shadow:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, 0.12));opacity:0;transform:scale(0.8);transition:var(--hbr-transition-medium) opacity, var(--hbr-transition-medium) transform}.modal__panel:focus{outline:none}@media only screen and (min-width: 23.5em){.modal__panel{width:var(--width);max-width:calc(100% - var(--hbr-spacing-2xl));max-height:min(80vh, 100% - var(--hbr-spacing-2xl))}.modal__panel.modal--xsmall{width:var(--width-xsmall)}.modal__panel.modal--small{width:var(--width-small)}.modal__panel.modal--medium{width:var(--width-medium)}.modal__panel.modal--large{width:var(--width-large)}}@media only screen and (max-width: 23.4375em){.modal__panel{max-height:80vh;width:100% !important;max-width:98% !important}}.modal--open .modal__panel{display:flex;opacity:1;transform:none}.modal__header{flex:0 0 auto;display:flex;position:relative}.modal__title{flex:1 1 auto;font-family:var(--hbr-font-heading);font-size:var(--hbr-font-size-xl);color:var(--title-color);line-height:var(--hbr-font-line-height-dense);font-weight:var(--hbr-font-weight-bold, 700);padding:var(--hbr-spacing-lg) var(--hbr-spacing-lg) var(--hbr-spacing-md) var(--hbr-spacing-lg)}.modal__close{display:none;font-size:14px;margin:var(--hbr-spacing-lg) var(--hbr-spacing-lg);position:absolute;right:0px;cursor:pointer}hbr-icon-button.modal__close::part(base){color:var(--close-button-color)}hbr-icon-button.modal__close::part(base):hover{color:var(--close-button-hover-color)}.modal__body{flex:1 1 auto;overflow:auto;-webkit-overflow-scrolling:touch;font-size:14px;color:var(--body-content-color);font-weight:var(--hbr-font-weight-normal)}.modal__body ::slotted(.hbr-modal-alert-container){padding:36px 0px;min-width:268px;display:flex;flex-direction:column;align-items:center}.modal__body ::slotted(.hbr-modal-alert-icon){padding-top:2px;padding-bottom:2px;text-align:center;font-size:60px;color:var(--slotted-alert-icon-color)}.modal__body ::slotted(.hbr-modal-alert-title){font-size:var(--hbr-font-size-xl);font-weight:var(--hbr-font-weight-semibold);line-height:var(--hbr-font-line-height-normal);letter-spacing:var(--hbr-font-letter-spacing-normal);color:var(--slotted-alert-title-color);text-align:center;padding-top:12px;padding-bottom:12px}.modal__body ::slotted(.hbr-modal-alert-message){font-size:14px;color:var(--slotted-alert-message-color);font-weight:400;letter-spacing:0.5px;line-height:20px;text-align:center;padding-top:0px;padding-bottom:32px;max-width:600px}@media only screen and (min-width: 23.5em){.modal__body{padding:var(--padding)}}@media only screen and (max-width: 23.4375em){.modal__body{padding-left:15px;padding-right:15px;padding-bottom:6px}}.modal__footer{flex:0 0 auto;text-align:right;padding:var(--hbr-spacing-lg)}.modal__footer ::slotted(hbr-button:not(:first-of-type)){margin-left:var(--hbr-spacing-xs)}.modal:not(.modal--has-footer) .modal__footer{display:none}.modal__overlay{position:fixed;top:0;right:0;bottom:0;left:0;background-color:var(--overlay-background-color);opacity:0;transition:var(--hbr-transition-medium) opacity}.modal--open .modal__overlay{opacity:1}.modal__focus-sentinel{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;outline:none}";
const HbrModalStyle0 = modalCss;

const hasPreventScroll = isPreventScrollSupported();
let id = 0;
const Modal = /*@__PURE__*/ proxyCustomElement(class Modal extends HTMLElement {
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
        this.componentId = `modal-${++id}`;
        this.willShow = false;
        this.willHide = false;
        this.hasFooter = false;
        this.isVisible = false;
        this.open = false;
        this.enablePopover = false;
        this.label = "";
        this.noHeader = false;
        this.size = null;
        this.scrollAware = false;
        this.aria = undefined;
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
        this.modalElement = new Modal$1(this.host, {
            onFocusOut: () => { var _a; return (_a = this.panel) === null || _a === void 0 ? void 0 : _a.focus(); },
        });
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
            this.modal.showPopover();
        }
    }
    disconnectedCallback() {
        this.host.removeEventListener("keydown", this.handleKeyDown, true);
        unlockBodyScrolling(this.host);
    }
    /** Shows the modal */
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
        this.modalElement.activate();
        if (this.enablePopover && this.modal) {
            this.modal.showPopover();
        }
        lockBodyScrolling(this.host);
        if (this.open) {
            if (hasPreventScroll) {
                // Wait for the next frame before setting initial focus so the modal is technically visible
                requestAnimationFrame(() => {
                    var _a;
                    const hbrInitialFocus = this.hbrInitialFocus.emit();
                    if (!hbrInitialFocus.defaultPrevented) {
                        (_a = this.panel) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
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
                this.modal.addEventListener("transitionend", () => {
                    var _a;
                    const hbrInitialFocus = this.hbrInitialFocus.emit();
                    if (!hbrInitialFocus.defaultPrevented) {
                        (_a = this.panel) === null || _a === void 0 ? void 0 : _a.focus();
                    }
                }, { once: true });
            }
        }
    }
    /** Hides the modal */
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
        this.modalElement.deactivate();
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
    }
    handleTransitionEnd(event) {
        const target = event.target;
        // Ensure we only emit one event when the target element is no longer visible
        if (event.propertyName === "opacity" &&
            target.classList.contains("modal__panel")) {
            this.isVisible = this.open;
            this.willShow = false;
            this.willHide = false;
            if (!this.open && this.enablePopover && this.modal) {
                this.modal.hidePopover();
            }
            this.open ? this.hbrAfterShow.emit() : this.hbrAfterHide.emit();
        }
    }
    render() {
        var _a, _b, _c, _d;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { role } = this.aria || {};
        const a11y = {
            role: role || "dialog",
            "aria-modal": "true",
            "aria-hidden": this.open ? "false" : "true",
        };
        const hostOwnsA11y = this.noHeader || Boolean((_b = this.aria) === null || _b === void 0 ? void 0 : _b.labelledby);
        const hostA11y = hostOwnsA11y
            ? Object.assign(Object.assign(Object.assign({}, a11y), (((_c = this.aria) === null || _c === void 0 ? void 0 : _c.labelledby)
                ? { "aria-labelledby": this.aria.labelledby }
                : this.label
                    ? { "aria-label": this.label }
                    : {})), (((_d = this.aria) === null || _d === void 0 ? void 0 : _d.describedby)
                ? { "aria-describedby": this.aria.describedby }
                : {})) : {};
        const panelA11y = !hostOwnsA11y
            ? Object.assign(Object.assign(Object.assign({}, a11y), (role === "alertdialog"
                ? { "aria-describedby": `${this.componentId}-content` }
                : {})), (this.label
                ? { "aria-label": this.label }
                : { "aria-labelledby": `${this.componentId}-title` })) : {};
        return (h(Host, Object.assign({ key: 'a7d5c20fb81ab43f53eec6795fdbdce98ed3df8e' }, hostA11y), h("div", { key: 'fc111cd056d11248c2edcaf087e216ae12f48b81', ref: (el) => {
                this.modal = el;
                if (this.enablePopover && this.modal) {
                    this.modal.popover = "manual";
                }
            }, part: "base", class: {
                modal: true,
                "modal--open": this.open,
                "modal--visible": this.isVisible,
                "modal--has-footer": this.hasFooter,
            }, onTransitionEnd: this.handleTransitionEnd }, h("div", { key: '60791789cb1356cb1e607083121c7f4d81b23f8e', part: "overlay", class: "modal__overlay", onClick: this.handleOverlayClick, tabIndex: -1 }), h("span", { key: '7a189e727a275e42b54aa1a6a326da761180b641', class: "modal__focus-sentinel", tabIndex: this.open ? 0 : -1, onFocus: () => handleStartSentinelFocus(this.panel, "modal"), "aria-hidden": this.open ? undefined : "true" }), h("div", Object.assign({ key: '132b9e1fc871ece4a878f0a87da8cd13281e7357', ref: (el) => {
                this.panel = el;
            }, part: "panel", tabIndex: -1, class: {
                modal__panel: true,
                //Sizes
                "modal--xsmall": this.size === "xsmall",
                "modal--small": this.size === "small",
                "modal--medium": this.size === "medium",
                "modal--large": this.size === "large",
            } }, panelA11y), !this.noHeader && (h("header", { part: "header", class: "modal__header" }, h("span", { part: "title", class: "modal__title", id: `${this.componentId}-title` }, h("slot", { name: "label" }, this.label || String.fromCharCode(65279))), h("hbr-icon-button", { class: "modal__close", part: "closer", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, arialabel: "Close Modal", onClick: this.handleCloseClick }))), h("div", { key: '3c98d9ed7dccc3dc468777e1b2c01f5c65c6616f', part: "body", class: "modal__body", id: `${this.componentId}-content` }, h("slot", { key: '701ceeb281b1e343957baa54ecf8da4299c08099' })), h("footer", { key: '7a3c872797af2ae802f881af7b0ac3c783e8225b', part: "footer", class: "modal__footer" }, h("slot", { key: 'bf64f2d0756bee1490b222ace5f01bf6c9c4a0fc', name: "footer", onSlotchange: this.handleSlotChange }))), h("span", { key: '6ae3872ac13134602a3a381daa0d47416f9d19b1', class: "modal__focus-sentinel", tabIndex: this.open ? 0 : -1, onFocus: () => handleEndSentinelFocus(this.panel, "modal"), "aria-hidden": this.open ? undefined : "true" }), this.scrollAware ? h("hbr-scroll-view", { anchor: ".modal__body" }) : null)));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"]
    }; }
    static get style() { return HbrModalStyle0; }
}, [1, "hbr-modal", {
        "open": [1540],
        "enablePopover": [4, "enable-popover"],
        "label": [1],
        "noHeader": [4, "no-header"],
        "size": [513],
        "scrollAware": [516, "scroll-aware"],
        "aria": [16],
        "hasFooter": [32],
        "isVisible": [32],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-modal", "hbr-icon", "hbr-icon-button", "hbr-scroll-view"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Modal);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-scroll-view":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Modal as M, defineCustomElement as d };

