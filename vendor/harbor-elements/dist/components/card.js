import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';
import { g as generateShortID } from './function-helper.js';
import { d as getCssRulesForSentimentCard } from './sentiments.js';
import { a as hasNamedSlot } from './slot.js';

const cardCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--outline-color:var(--control-border-weak-default);--outline:none;--border-color:var(--control-border-weak-default);--border:solid var(--border-width) var(--border-color);--border-radius:var(--hbr-border-radius-md);--border-width:var(--hbr-control-border-width);--header-padding:var(--hbr-spacing-lg) var(--hbr-spacing-lg) 0;--body-padding:var(--hbr-spacing-md) var(--hbr-spacing-lg);--footer-padding:var(--hbr-spacing-md) var(--hbr-spacing-lg) var(--hbr-spacing-lg);--box-shadow:var(--hbr-shadow-md);--box-shadow-hover:var(--hbr-shadow-lg);--min-width:initial;--max-width:initial;--width:initial;--height:initial;--min-width:initial;--max-width:initial;--accent-disabled-color:var(--accent-disabled-opacity-color);--basic-box-shadow:none;--selectable-box-shadow:none;--selected-border-color:var(--control-border-active);--bg-color:var(--control-bg-weak-default);--hover-border-color:var(--control-border-hover);--hover-outline:none;--selected-outline:none;--footer-width:auto;--focus-border-color:var(--control-border-focus);--backdrop-filter:none;display:inline-block}:host([disabled]){opacity:0.5}:host([disabled]) .card__accent{opacity:0.5}:host(:not([container])){--min-width:208px;--border-radius:var(--hbr-border-radius-lg)}:host([container]){--border:none;--container-gap:var(--hbr-spacing-md)}:host([selectable]:not([container])){--selectable-box-shadow:var(--hbr-shadow-xs);--box-shadow-hover:var(--hbr-shadow-sm);--focus-box-shadow:var(--hbr-shadow-xs)}.card{display:flex;flex-direction:column;background-color:var(--bg-color);box-shadow:var(--box-shadow);border:var(--border);outline:var(--outline);border-radius:var(--border-radius);color:var(--base-text-default);min-width:var(--min-width);max-width:var(--max-width);width:var(--width);min-height:var(--min-height);max-height:var(--max-height);height:var(--height);backdrop-filter:var(--backdrop-filter);-webkit-backdrop-filter:var(--backdrop-filter)}.card.card--container{border:var(--border, none);padding:var(--hbr-spacing-lg);border-radius:var(--border-radius, var(--hbr-border-radius-xl));box-shadow:var(--box-shadow, var(--hbr-shadow-sm));gap:var(--container-gap)}.card.card--basic{align-items:flex-start;gap:var(--hbr-spacing-sm);align-self:stretch;padding:var(--hbr-spacing-md)}.card.card--basic:not(.card--is-selectable){box-shadow:var(--basic-box-shadow)}.card.card--basic.card--is-selectable{box-shadow:var(--selectable-box-shadow)}.card.card--is-disabled{pointer-events:none;color:var(--base-text-disabled)}.card.card--is-selected{outline:var(--selected-outline);border-color:var(--selected-border-color)}.card:not(.card--is-disabled).card--is-selectable:hover{box-shadow:var(--box-shadow-hover);outline:var(--hover-outline);border-color:var(--hover-border-color);cursor:pointer}.card:not(.card--is-disabled).card--is-selectable.card--is-selected{box-shadow:var(--focus-box-shadow);outline-color:var(--focus-outline-color);border-color:var(--focus-border-color)}.card:not(.card--is-disabled).card--is-selectable:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.card__image{border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);margin:calc(-1 * var(--border-width));overflow:hidden}.card__header ::slotted(div.hbr-css__card-title){font-size:var(--hbr-font-size-lg, 38px)}.card__image ::slotted(img){display:block;width:100%}.card:not(.card--has-image) .card__image{display:none}.card__header{font-weight:var(--hbr-font-weight-bold);font-size:var(--hbr-font-size-lg);line-height:22px;width:100%}.card:not(.card--is-disabled) .card__header{color:var(--base-text-strong-default)}.card.card--is-disabled .card__header{color:var(--base-text-disabled)}.card__accent{left:2px;right:2px;top:2px;height:calc(100% - 2px);position:absolute;z-index:1;border-radius:calc(var(--hbr-border-radius-lg) - 3px);background-image:linear-gradient(to bottom, var(--sentiment-color), var(--sentiment-color) 6px, transparent 6px, transparent);pointer-events:none}.card:not(.card--has-header) .card__header{display:none}.card__body{font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-normal);width:100%}.card:not(.card--is-disabled) .card__body{color:var(-base-text-default)}.card.card--is-disabled .card__body{color:var(--base-text-disabled)}.card:not(.card--has-footer) .card__footer{display:none}.card.card--has-footer .card__footer{width:var(--footer-width)}";
const HbrCardStyle0 = cardCss;

/**
 * Maps semantic col values to responsive data-col-span attributes.
 * Structure: { base, sm, xs } where:
 * - base: default desktop span (data-col-span)
 * - sm: tablet span 554-783px (data-sm-col-span)
 * - xs: mobile span ≤553px (data-xs-col-span)
 */
const COL_SPAN_MAP = {
    "1/4": { base: 3, sm: 6, xs: 12 },
    "1/3": { base: 4, sm: 6, xs: 12 },
    "1/2": { base: 6, sm: 12, xs: 12 },
    "2/3": { base: 8, sm: 12, xs: 12 },
    "3/4": { base: 9, sm: 12, xs: 12 },
    full: { base: 12, sm: 12, xs: 12 },
};
const Card = /*@__PURE__*/ proxyCustomElement(class Card extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sheet = new CSSStyleSheet();
        this.hasFooter = false;
        this.hasImage = false;
        this.hasHeader = false;
        this.uuid = generateShortID();
        this.disabled = false;
        this.selected = false;
        this.selectable = false;
        this.sentiment = undefined;
        this.tabIndexNumber = undefined;
        this.container = undefined;
        this.col = undefined;
        this.span = undefined;
        this.arialabelledby = undefined;
        this.aria = undefined;
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        this.handleSlotChange();
        this.applyColSpanAttributes();
    }
    handleColChange() {
        this.applyColSpanAttributes();
    }
    handleSpanChange() {
        this.applyColSpanAttributes();
    }
    /**
     * Applies responsive data-col-span attributes.
     * Priority: col prop > span prop (col is user-locked)
     */
    applyColSpanAttributes() {
        // col prop takes precedence (user-locked)
        const spans = (this.col && COL_SPAN_MAP[this.col]) || this.span;
        if (!spans) {
            this.host.removeAttribute("data-col-span");
            this.host.removeAttribute("data-sm-col-span");
            this.host.removeAttribute("data-xs-col-span");
            return;
        }
        if (spans.base != null)
            this.host.setAttribute("data-col-span", spans.base.toString());
        if (spans.sm != null)
            this.host.setAttribute("data-sm-col-span", spans.sm.toString());
        if (spans.xs != null)
            this.host.setAttribute("data-xs-col-span", spans.xs.toString());
    }
    componentDidLoad() {
        /** A11y for SR users */
        const header = this.host.querySelector("[role='heading']");
        if (header) {
            if (!header.id) {
                header.id = `hbr-card--${this.uuid}`;
                if (!this.host.getAttribute("aria-labelledby")) {
                    this.host.setAttribute("aria-labelledby", header.id);
                }
            }
        }
    }
    handleSlotChange() {
        this.hasImage = hasNamedSlot(this.host, "image");
        this.hasHeader = hasNamedSlot(this.host, "header");
        this.hasFooter = hasNamedSlot(this.host, "footer");
    }
    handleKeyDown(event) {
        if (event.composedPath()[0] !== this.card) {
            return;
        }
        if (event.key === "Enter" && !this.disabled) {
            this.host.click();
        }
        else if (event.key === " ") {
            event.preventDefault();
        }
    }
    handleKeyUp(event) {
        if (event.composedPath()[0] !== this.card) {
            return;
        }
        if (event.key === " " && !this.disabled) {
            this.host.click();
        }
    }
    render() {
        var _a;
        const props = {
            tabIndex: this.selectable
                ? this.tabIndexNumber !== undefined
                    ? this.tabIndexNumber
                    : 0
                : null,
            onKeyDown: this.selectable ? this.handleKeyDown.bind(this) : null,
            onKeyUp: this.selectable ? this.handleKeyUp.bind(this) : null,
        };
        const _arialabelledby = ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.labelledby) || this.arialabelledby;
        const { sentiment, disabled } = this;
        const a11y = {};
        if (_arialabelledby) {
            a11y["aria-labelledby"] = _arialabelledby;
        }
        if (this.disabled) {
            a11y["aria-disabled"] = "true";
        }
        /** Updating to add magnetic token and also update the color align to magnetic guideline */
        if (this.host && this.sentiment) {
            this.sheet.replaceSync(`
				:host {
					${getCssRulesForSentimentCard({
                sentiment: this.sentiment,
                disabled,
            })}
				}
			`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Host, Object.assign({ key: 'c6a4a1203eab14d13d3d9edf862d5f2ce41c4adf' }, a11y), sentiment && h("div", { class: "card__accent", part: "accent" }), h("div", Object.assign({ key: '0205beaca79f2c3c43d0f6551cf14f5a181a6561', ref: (el) => {
                this.card = el;
            }, part: "base", class: {
                card: true,
                "card--has-image": this.hasImage,
                "card--has-header": this.hasHeader,
                "card--has-footer": this.hasFooter,
                "card--is-disabled": this.disabled,
                "card--is-selectable": this.selectable,
                "card--is-selected": this.selected,
                "card--has-sentiment": !!sentiment,
                "card--basic": !this.container,
                "card--container hbr-css__layout-col-md": this.container,
            } }, props), h("div", { key: 'c338d98d220b236f7e23812ad74fc1672e400e2f', part: "image", class: "card__image" }, h("slot", { key: '9cf69181e1ca53990a36ee1498e1698398625d95', name: "image", onSlotchange: this.handleSlotChange })), h("div", { key: 'ad201a584893dbf41a2a70319664a0140c35d4bd', part: "header", class: "card__header" }, h("slot", { key: 'e31cf045065c7c82a72f3200cc0641dcd75a3f1e', name: "header", onSlotchange: this.handleSlotChange })), h("div", { key: 'bc1ae450ff6b56dac2060063007c4eb3e2a6315e', part: "body", class: "card__body" }, h("slot", { key: '90c462236f8d9f492fff800d389954795b7df93e' })), h("div", { key: 'ae7e1b328d0ec7cdcdea4bc7f947f999a3d27f12', part: "footer", class: "card__footer" }, h("slot", { key: '9c2be10b6d463420d8fbcb1d2fa117313c6496c9', name: "footer", onSlotchange: this.handleSlotChange })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "col": ["handleColChange"],
        "span": ["handleSpanChange"]
    }; }
    static get style() { return HbrCardStyle0; }
}, [1, "hbr-card", {
        "disabled": [516],
        "selected": [516],
        "selectable": [516],
        "sentiment": [513],
        "tabIndexNumber": [2, "tab-index-number"],
        "container": [516],
        "col": [513],
        "span": [16],
        "arialabelledby": [1],
        "aria": [16],
        "hasFooter": [32],
        "hasImage": [32],
        "hasHeader": [32],
        "uuid": [32]
    }, undefined, {
        "col": ["handleColChange"],
        "span": ["handleSpanChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-card"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-card":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Card);
            }
            break;
    } });
}

export { Card as C, defineCustomElement as d };

