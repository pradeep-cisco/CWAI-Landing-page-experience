import { proxyCustomElement, HTMLElement, createEvent, h, Fragment } from '@stencil/core/internal/client';
import { B as remove } from './index2.js';
import { a as addConstructedStyle } from './browser.js';
import { f as focusVisible } from './focus-visible.js';
import { d as defineCustomElement$3, g as getBootstrapConfig } from './icon.js';
import { i as internationalization } from './translations.js';
import { a as getCssRulesForSentimentBanner, b as getCssRulesForSentiment } from './sentiments.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$4 } from './button.js';
import { d as defineCustomElement$2 } from './icon-button.js';
import { d as defineCustomElement$1 } from './spinner.js';

const translations = {
    en: {
        viewAlerts: "View Alerts",
        hideAlerts: "Hide Alerts",
    },
    ko: {
        viewAlerts: "알림 보기",
        hideAlerts: "알림 숨기기",
    },
    ja: {
        viewAlerts: "アラートを表示",
        hideAlerts: "アラートを非表示",
    },
    zh: {
        viewAlerts: "查看提示信息",
        hideAlerts: "隐藏详细信息",
    },
};

const bannerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:contents;--status-icon-size:var(--hbr-font-size-xl);--toast-status-icon-size:var(--hbr-font-size-xl);--state-icon-margin-left-toast:var(--hbr-spacing-xl);--close-btn-padding:var(--hbr-spacing-md);--close-btn-padding-inline:var(--hbr-spacing-sm);--close-btn-padding-top-toast:var(--hbr-spacing-2xs);--border-fill:none;--fill-padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);-fill-single-box-shadow:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, 0.08));-fill-multi-message-container-border-top:1px solid var(--border-color);--container-padding:12px 20px 12px 0px;--gap:var(--hbr-spacing-lg, 24px);--close-button-color:var(--interact-icon-weak-default);--text-color:var(--base-text-default);--multi-bg-color:var(--base-bg-weak-default);--multi-title-text-color:var(--base-text-default);--close-button-hover-color:var(--interact-icon-weak-hover);--multi-outline-expanded-border-top:1px solid var(--control-border-weak-default);--border-color:transparent;--bg-color:var(--control-bg-medium-active);margin:0}.banner{position:relative;display:flex;align-items:flex-start;background-color:var(--bg-color);font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-normal, 400);line-height:var(--hbr-font-line-height-normal);color:var(--text-color);opacity:0;transform:scale(0.9)}.banner:not(.banner--child){transition:var(--hbr-transition-medium) opacity ease, var(--hbr-transition-medium) transform ease}.banner{margin:inherit}.banner:not(.banner--child){border-radius:var(--hbr-border-radius-md)}.banner:not(.banner--child):not(.banner--toast):not(.banner--fill){border-top:var(--hbr-border-width) solid var(--control-border-default);border-right:var(--hbr-border-width) solid var(--control-border-default);border-bottom:var(--hbr-border-width) solid var(--control-border-default)}.banner:not(.banner--child).banner--toast{box-shadow:var(--hbr-shadow-md)}.banner:not(.banner--visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}.banner ::slotted(br){display:block;padding-top:4px;content:\"\"}.banner ::slotted([slot=dismiss]){padding-top:var(--hbr-spacing-3xs, 2px);display:flex;align-items:center;margin-left:auto}.multi--collapsible{max-width:var(--max-width);min-width:var(--min-width);box-shadow:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, 0.08));border-radius:var(--hbr-border-radius-md)}.multi--collapsible .banner--outline:not(.banner--child){border-left:none}.multi--collapsible .banner--multiBanner.banner--outline.banner--expanded+.banner__multiBanner{border-top:var(--multi-outline-expanded-border-top)}.multi--collapsible .banner--multiBanner.banner--fill.banner--expanded+.banner__multiBanner{border-top:var(--multi-fill-expanded-border-top)}.multi--collapsible.outline-collapsible{border-left:var(--multi-outline-collapsible-border-left)}.multi--collapsible.fill-collapsible{border:var(--multi-fill-collapsible-border)}.banner:not(.banner--outline-collapsible){max-width:var(--max-width)}.multi--collapsible .banner--multiBanner{box-shadow:none}.banner--open{opacity:1;transform:none}.banner__icon{flex:0 0 auto;display:flex;align-items:inherit;font-size:var(--status-icon-size);align-self:start}.banner--outline:not(.banner--child):not(.banner--toast) .banner__icon ::slotted(*){margin-left:18px}.banner--outline.banner--toast:not(.banner--child) .banner__icon ::slotted(*){margin-left:22px}.banner--outline:not(.banner--child){border-left:var(--hbr-control-border-radius-md) solid var(--border-color);gap:var(--gap)}.banner--outline:not(.banner--child):not(.banner--toast){padding:var(--container-padding)}.banner--outline:not(.banner--child).banner--toast{padding:16px 24px 16px 0}.banner--fill,.banner--plain{border:var(--border-fill);align-items:center}.banner--fill .banner__icon ::slotted(hbr-icon),.banner--plain .banner__icon ::slotted(hbr-icon){width:24px;height:24px;padding-right:var(--hbr-spacing-xs)}.banner--fill{padding:var(--fill-padding)}.banner--fill.banner--product .banner__icon ::slotted(hbr-icon){padding-right:var(--multi-fill-icon-padding-right)}.banner--plain{padding:var(--hbr-spacing-xs)}.banner.banner--multiBanner.banner--expanded{border-bottom-left-radius:0;border-bottom-right-radius:0}.banner__message{flex:1 1 auto;overflow:hidden;display:var(--message-display);gap:var(--message-flex-gap)}.banner__close{flex:0 0 auto;display:flex;align-items:flex-start;margin-left:auto;font-size:var(--hbr-font-size-md, 16px)}hbr-icon-button.banner__close::part(base){color:var(--close-button-color);padding:0}hbr-icon-button.banner__close::part(base):hover{color:var(--close-button-hover-color)}.banner--product.banner--fill:not(.banner--multiBanner){border:1px solid var(--border-color);box-shadow:var(--fill-single-box-shadow)}.banner__multiBanner{display:flex;flex-direction:column;border-bottom-left-radius:var(--hbr-border-radius-md);background-color:var(--multi-bg-color);border-bottom-right-radius:var(--hbr-border-radius-md);max-height:0px;overflow:hidden;height:0px}.banner__multiBanner.message__expand{padding:var(--hbr-spacing-2xs, 4px) var(--hbr-spacing-md, 16px) var(--hbr-spacing-sm, 12px) 46px;max-height:100vh;transition:max-height var(--hbr-transition-medium) ease-out;height:auto}.banner--fill+.banner__multiBanner{border-top:var(--fill-multi-message-container-border-top)}.multi__empty_span{width:1px;padding-right:var(--hbr-spacing-lg, 24px)}.banner--multi .banner__multi{flex:1 1 auto;padding:var(--hbr-spacing-lg, 24px) var(--hbr-spacing-md) 0 0;overflow:hidden}.banner--multi .banner__multi .banner__title{font-size:var(--hbr-font-size-lg, 18px);color:var(--multi-title-text-color)}.banner--multi .banner__multi .banner__expand_button{padding-top:var(--hbr-spacing-md, 16px);padding-bottom:var(--hbr-spacing-lg, 24px)}.banner--multi .banner__expand ::slotted(div:not(:last-child)){padding-bottom:var(--hbr-spacing-lg, 24px)}.banner--multi .banner__expand ::slotted(div:last-child){padding-bottom:var(--hbr-spacing-xl, 32px)}.banner--child .banner__icon{font-size:var(--status-icon-size)}.banner--toast .banner__icon{font-size:var(--toast-status-icon-size)}.banner--toast .banner__icon ::slotted(*){margin-left:var(--state-icon-margin-left-toast)}.banner--toast .banner__close{padding-top:var(--close-btn-padding-top-toast)}:host{--multi-fill-expanded-border-top:1px solid var(--border-color);--multi-outline-collapsible-border-left:var(--hbr-control-border-radius-md) solid var(--border-color);--multi-fill-collapsible-border:1px solid var(--border-color);--container-padding:16px 20px 16px 0;--message-display:inline}.banner{line-height:20px;align-items:flex-start}:host(:not([product])) .banner[part~=base]{border-top:none;border-bottom:none;border-right:none}.banner--outline{box-shadow:var(--hbr-shadow-sm, 0 3px 8px rgba(0, 0, 0, 0.08))}.banner--outline.banner--multiBanner{box-shadow:none}.banner--fill{box-shadow:none;--close-btn-padding-inline:var(--hbr-spacing-md) var(--hbr-spacing-md) var(--hbr-spacing-xs)}.banner__message{padding-top:var(--hbr-spacing-3xs, 2px)}.banner--outline .banner__message{max-width:var(--max-width, 720px)}.banner--fill .banner__close::part(base){padding-top:var(--hbr-spacing-2xs, 4px)}.banner--info:not(.banner--fill){border-left-color:var(--info-border-default)}.banner--progress .banner__icon{font-size:19px}.banner--outline .banner__close::part(base){padding-block:var(--hbr-spacing-3xs, 2px)}:host([variant=fill][product]){--fill-padding:10px 14px;--multi-fill-icon-padding-right:var(--hbr-spacing-md)}:host([multiple]){--gap:var(--hbr-spacing-md, 16px)}";
const HbrBannerStyle0 = bannerCss;

const toastStack = Object.assign(document.createElement("div"), {
    className: "hbr-toast-stack",
});
const DEFAULT_BANNER_DURATION = Number.POSITIVE_INFINITY;
const DEFAULT_INFO_POSITIVE_TOAST_DURATION = 6000;
const DEFAULT_WARNING_TOAST_DURATION = 8000;
const Banner = /*@__PURE__*/ proxyCustomElement(class Banner extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrExpand = createEvent(this, "hbr-expand", 7);
        this.hbrAfterExpand = createEvent(this, "hbr-after-expand", 7);
        this.hbrCollapse = createEvent(this, "hbr-collapse", 7);
        this.hbrAfterCollapse = createEvent(this, "hbr-after-collapse", 7);
        this.sheet = new CSSStyleSheet();
        this.defaultAria = {
            clear: "Remove this alert message",
        };
        this.isVisible = false;
        this.isExpanded = false;
        this.hasMessagesSlot = false;
        this.open = false;
        this.expanded = false;
        this.closable = false;
        this.sentiment = undefined;
        this.variant = "outline";
        this.duration = DEFAULT_BANNER_DURATION;
        this.multiple = false;
        this.child = false;
        this.arialevel = "3";
        this.product = undefined;
        this.i18n = undefined;
        this.aria = undefined;
    }
    handleOpenChange() {
        this.open ? this.show() : this.hide();
    }
    handleExpandChange() {
        if (this.expanded) {
            this.expand();
            this.isExpanded = true;
        }
        else {
            this.collapse();
            this.isExpanded = false;
        }
    }
    handleDurationChange() {
        if (this.toastDuration !== undefined) {
            this.toastDuration = this.getToastDuration();
        }
        this.restartAutoHide();
    }
    connectedCallback() {
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.sheet = new CSSStyleSheet();
    }
    componentWillLoad() {
        // Show on init if open
        if (this.open) {
            this.show();
        }
        if (this.expanded) {
            this.expand();
        }
        this.handleSlotChange();
        this.multiBanner =
            (this.variant === "fill" || this.variant === "outline") && this.multiple;
        if (this.multiBanner && this.expanded) {
            this.isExpanded = true;
        }
    }
    /** Shows the banner. */
    async show() {
        // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
        if (this.isVisible) {
            return;
        }
        const hbrShow = this.hbrShow.emit();
        if (hbrShow.defaultPrevented) {
            this.open = false;
            return;
        }
        this.isVisible = true;
        this.open = true;
        this.restartAutoHide();
    }
    /** Hides the banner */
    async hide() {
        // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
        if (!this.isVisible) {
            return;
        }
        const hbrHide = this.hbrHide.emit();
        if (hbrHide.defaultPrevented) {
            this.open = true;
            return;
        }
        clearTimeout(this.autoHideTimeout);
        this.toastDuration = undefined;
        this.isVisible = false;
        this.open = false;
    }
    /** Expands the multi banner. */
    async expand() {
        const hbrExpand = this.hbrExpand.emit();
        if (hbrExpand.defaultPrevented) {
            this.expanded = false;
            return;
        }
        this.expanded = true;
        if (this.duration < Number.POSITIVE_INFINITY) {
            this.autoCollapseTimeout = setTimeout(() => this.collapse(), this.duration);
        }
    }
    /** Collapse the multi banner */
    async collapse() {
        const hbrCollapse = this.hbrCollapse.emit();
        if (hbrCollapse.defaultPrevented) {
            this.expanded = true;
            return;
        }
        clearTimeout(this.autoCollapseTimeout);
        this.expanded = false;
    }
    /**
     * Displays the banner as a toast notification. This will move the banner out of its position in the DOM and, when
     * dismiss, it will be removed from the DOM completely. By storing a reference to the banner, you can reuse it by
     * calling this method again. The returned promise will resolve after the banner is hidden.
     */
    async toast() {
        this.toastDuration = this.getToastDuration();
        return new Promise((resolve) => {
            var _a;
            if (!toastStack.parentElement) {
                document.body.append(toastStack);
            }
            this.host.setAttribute("role", "alert");
            this.banner.classList.add("banner--toast");
            toastStack.append(this.host);
            const closeBtn = (_a = this.btn) === null || _a === void 0 ? void 0 : _a.shadowRoot.querySelector("button.icon-button");
            // Wait for the toast stack to render
            requestAnimationFrame(() => {
                this.show();
                if (this.closable && closeBtn) {
                    focusVisible.observe(closeBtn);
                }
            });
            this.host.addEventListener("hbr-after-hide", () => {
                this.host.remove();
                resolve();
                // Remove the toast stack from the DOM when there are no more banners
                if (!toastStack.querySelector("hbr-banner")) {
                    toastStack.remove();
                }
                if (this.closable && closeBtn) {
                    focusVisible.unobserve(closeBtn);
                }
            }, { once: true });
        });
    }
    handleCloseClick() {
        this.hide();
    }
    handleMouseMove() {
        this.restartAutoHide();
    }
    handleExpandClick() {
        this.expanded ? this.collapse() : this.expand();
    }
    handleTransitionEnd(event) {
        const target = event.target;
        // Ensure we only emit one event when the target element is no longer visible
        if (event.propertyName === "opacity" &&
            target.classList.contains("banner")) {
            this.isVisible = this.open;
            this.open ? this.hbrAfterShow.emit() : this.hbrAfterHide.emit();
            if (this.child && !this.open) {
                const parent = this.host.closest("hbr-banner:not([child])");
                const banners = parent === null || parent === void 0 ? void 0 : parent.querySelectorAll("hbr-banner");
                if ((banners === null || banners === void 0 ? void 0 : banners.length) === 1) {
                    parent.collapse();
                    parent.remove();
                }
            }
        }
    }
    isNestedBanner() {
        var _a;
        return (this.child ||
            (this.variant === "plain" &&
                Boolean((_a = this.host.parentElement) === null || _a === void 0 ? void 0 : _a.closest("hbr-banner[multiple]"))));
    }
    restartAutoHide() {
        var _a;
        clearTimeout(this.autoHideTimeout);
        const duration = (_a = this.toastDuration) !== null && _a !== void 0 ? _a : this.duration;
        if (this.open && duration < Number.POSITIVE_INFINITY) {
            this.autoHideTimeout = setTimeout(() => this.hide(), duration);
        }
    }
    getToastDuration() {
        return this.duration === DEFAULT_BANNER_DURATION
            ? this.getDefaultToastDuration()
            : this.duration;
    }
    getDefaultToastDuration() {
        var _a;
        const sentiment = ((_a = this.sentiment) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        if (sentiment === "danger") {
            return DEFAULT_BANNER_DURATION;
        }
        return sentiment === "warning"
            ? DEFAULT_WARNING_TOAST_DURATION
            : DEFAULT_INFO_POSITIVE_TOAST_DURATION;
    }
    handleSlotChange() {
        this.hasMessagesSlot = hasSlot(this.host, "messages");
    }
    render() {
        var _a;
        const { sentiment } = this;
        //Demo purpose
        let customLang;
        if (this.multiple) {
            customLang = (_a = this.host.parentElement) === null || _a === void 0 ? void 0 : _a.lang;
        }
        const cls = {
            banner: true,
            "banner--open": this.open,
            "banner--visible": this.isVisible,
            "banner--closable": this.closable,
            "banner--multi": this.multiple,
            "banner--multiBanner": this.multiBanner,
            "banner--child": this.isNestedBanner(),
            "banner--product": this.product,
            "banner--expanded": this.isExpanded,
            "banner--collapsed": !this.isExpanded,
            "banner--outline-collapsible": this.variant === "outline" && this.multiBanner,
        };
        cls[`banner--${sentiment ? sentiment : "interact"}`] = true;
        cls[`banner--${this.variant}`] = true;
        let multiPart = "";
        if (this.multiBanner) {
            if (this.variant === "outline") {
                multiPart = "outline-multi";
            }
            else if (this.variant === "fill") {
                multiPart = "fill-multi";
            }
        }
        const part = `base ${this.variant} ${multiPart}`;
        const banner = () => {
            return (h("div", { ref: (el) => {
                    this.banner = el;
                }, part: part, class: cls, role: "alert", "aria-live": sentiment !== "danger" ? "polite" : "assertive", "aria-atomic": "true", "aria-hidden": this.open ? "false" : "true", onMouseMove: this.handleMouseMove, onTransitionEnd: this.handleTransitionEnd }, !this.multiBanner &&
                (this.multiple ? bannerMessages() : bannerMessage()), !this.multiBanner && this.closable && closableIcon(), this.multiBanner && bannerMessage(), this.multiBanner && this.closable && closableIcon(), this.multiBanner && h("slot", { name: "dismiss" })));
        };
        const bannerMessage = () => {
            return (h(Fragment, null, h("span", { part: "icon", class: "banner__icon" }, h("slot", { name: "icon" })), h("span", { part: "message", class: "banner__message" }, h("slot", null))));
        };
        const bannerMessages = () => {
            var _a, _b;
            const { hideAlerts, viewAlerts } = this.i18n || {};
            const _hideAlerts = hideAlerts
                ? hideAlerts
                : internationalization(translations, "hideAlerts", customLang);
            const _viewAlerts = viewAlerts
                ? viewAlerts
                : internationalization(translations, "viewAlerts", customLang);
            return (h(Fragment, null, h("span", { class: "multi__empty_span" }), h("div", { part: "multi", class: "banner__multi" }, h("div", { part: "title", class: "banner__title", role: "heading", "aria-level": ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.level) || this.arialevel }, h("slot", { name: "title" })), h("hbr-button", { variant: "outline", class: "banner__expand_button", onClick: this.handleExpandClick, aria: {
                    expanded: (_b = this.expanded) === null || _b === void 0 ? void 0 : _b.toString(),
                } }, this.expanded ? _hideAlerts : _viewAlerts), h("div", { class: {
                    banner__alerts: true,
                    banner__expand: this.expanded,
                    banner__collapse: !this.expanded,
                } }, h("slot", { name: "banner" })))));
        };
        const multiBannerMessages = () => {
            const { isExpanded } = this;
            return (h("div", { part: "messages", class: `banner__multiBanner ${isExpanded ? "message__expand" : "message__collapse"}` }, this.isExpanded && (h("slot", { name: "messages", onSlotchange: this.handleSlotChange }))));
        };
        const closableIcon = () => {
            var _a, _b, _c;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            return (h("hbr-icon-button", { exportparts: "base:close-button", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, ref: (el) => {
                    this.btn = el;
                }, class: "banner__close", arialabel: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.clear) || ((_c = this.defaultAria) === null || _c === void 0 ? void 0 : _c.clear), onClick: this.handleCloseClick, "data-testid": "banner-close" }));
        };
        if (this.host) {
            this.sheet.replaceSync(`
				:host {
					${getCssRulesForSentimentBanner({
                sentiment: sentiment || "interact",
                variant: this.variant || "",
                type: "background",
            })}
					${getCssRulesForSentimentBanner({
                sentiment,
                variant: this.variant,
                type: "border",
            })}
				}
				.banner__icon {
					${getCssRulesForSentiment({
                sentiment: sentiment || "interact",
                type: "icon",
            })}
				}
			`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Fragment, null, this.multiBanner ? (h("div", { part: "multiBanner", class: `multi--collapsible ${this.variant}-collapsible ${this.isExpanded ? " multi--collapsible-expanded" : ""}` }, banner(), multiBannerMessages())) : (banner())));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"],
        "expanded": ["handleExpandChange"],
        "duration": ["handleDurationChange"]
    }; }
    static get style() { return HbrBannerStyle0; }
}, [1, "hbr-banner", {
        "open": [1540],
        "expanded": [1540],
        "closable": [516],
        "sentiment": [513],
        "variant": [513],
        "duration": [2],
        "multiple": [516],
        "child": [516],
        "arialevel": [1],
        "product": [516],
        "i18n": [1040],
        "aria": [16],
        "isVisible": [32],
        "isExpanded": [32],
        "hasMessagesSlot": [32],
        "show": [64],
        "hide": [64],
        "expand": [64],
        "collapse": [64],
        "toast": [64]
    }, undefined, {
        "open": ["handleOpenChange"],
        "expanded": ["handleExpandChange"],
        "duration": ["handleDurationChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-banner", "hbr-button", "hbr-icon", "hbr-icon-button", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-banner":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Banner);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
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
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Banner as B, defineCustomElement as d };

