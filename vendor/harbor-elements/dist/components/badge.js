import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';
import { g as getCssRulesForSentimentBadge } from './sentiments.js';

const badgeCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-flex;--padding:0 var(--hbr-spacing-2xs, 4px);--bg-color:var(--control-bg-medium-disabled);--text-color:var(--base-text-default);--pulse-color:var(--interact-text-default);--bg-color-hover:var(--control-bg-strong-hover);--dot-size:10px;--border:none;--outline:none;--border-radius:var(--hbr-border-radius-sm)}.badge{display:inline-flex;align-items:center;justify-content:center;font-size:var(--hbr-font-size-xs, 12px);font-weight:var(--hbr-font-weight-bold, 700);letter-spacing:var(--hbr-font-letter-spacing-normal);line-height:var(--hbr-font-line-height-normal);white-space:nowrap;user-select:none;cursor:inherit;background-color:var(--bg-color);color:var(--text-color);border:var(--border);outline:var(--outline)}.badge--anchored:not(.badge--status){border:2px solid var(--base-border-weak-default)}.badge:not(.badge--dot){padding:var(--padding);border-radius:var(--border-radius)}.badge:not(.badge--square):not(.badge--dot){height:18px;min-width:18px}.badge--interact.badge--disabled{cursor:not-allowed}.badge--interact.badge--disabled *{pointer-events:none}.badge--interact:not(.badge--disabled){background-color:var(--bg-color);cursor:pointer}.badge--interact:hover{background-color:var(--bg-color-hover)}.badge--dot{min-width:var(--dot-size);height:var(--dot-size);padding:0;border-radius:var(--hbr-border-radius-pill)}.badge--small{font-size:var(--hbr-font-size-xs, 12px);line-height:var(--hbr-font-line-height-dense);font-weight:var(--hbr-font-weight-semibold, 600)}.badge--medium{font-size:var(--hbr-font-size-xs, 12px);line-height:var(--hbr-font-line-height-normal);font-weight:var(--hbr-font-weight-semibold, 600)}.badge--large{font-size:var(--hbr-font-size-md, 16px);line-height:var(--hbr-font-line-height-loose);font-weight:var(--hbr-font-weight-semibold, 600)}.badge--pill:not(.badge--dot){border-radius:var(--hbr-border-radius-pill)}.badge--pill:not(.badge--dot).badge--small{padding:9px 5px}.badge--pill:not(.badge--dot).badge--medium{padding:10px 6px}.badge--pill:not(.badge--dot).badge--large{padding:13px 9px}.badge--square:not(.badge--dot){border-radius:var(--border-radius);padding:var(--padding);border:var(--border-square);min-width:var(--min-width, 18px)}.badge--pulse{animation:pulse 1.5s infinite}@keyframes pulse{0%{box-shadow:0 0 0 0 var(--pulse-color)}70%{box-shadow:0 0 0 0.5rem transparent}100%{box-shadow:0 0 0 0 transparent}}:host(.badge-host--anchored){position:relative;display:inline-flex}.badge--anchored{position:absolute;top:0;right:0;transform:translate(50%, -50%);z-index:1}.badge--status{background-color:transparent;padding:0;min-width:unset;height:unset}:host(:not([sentiment])){--bg-color:var(--control-bg-medium-disabled);--text-color:var(--base-text-default)}:host([square]){--border-radius:var(--hbr-border-radius-md);--padding:2px 4px;--min-width:24px}:host(:not([sentiment]):not([dot])) .badge{font-weight:var(--hbr-font-weight-semibold, 600)}:host([size=small]:not([dot])) .badge{line-height:18px}:host([size=medium]:not([dot])) .badge,:host([size=large]:not([dot])) .badge{font-size:var(--hbr-font-size-sm, 14px);line-height:20px}:host([pill][size=small]:not([dot])) .badge{padding:1px 8px;height:20px}:host([pill][size=medium]:not([dot])) .badge{padding:3px 10px;height:26px}:host([pill][size=large]:not([dot])) .badge{padding:5px 12px;height:30px}";
const HbrBadgeStyle0 = badgeCss;

const Badge = /*@__PURE__*/ proxyCustomElement(class Badge extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sheet = new CSSStyleSheet();
        this.handleSlotChange = () => {
            this.syncSlotState();
        };
        this.hasBaseSlot = false;
        this.hasBadgeSlot = false;
        this.sentiment = undefined;
        this.disabled = false;
        this.pill = false;
        this.inline = false;
        this.pulse = false;
        this.dot = false;
        this.square = false;
        this.size = "medium";
        this.status = false;
    }
    componentWillLoad() {
        this.syncSlotState();
    }
    get slottedChildren() {
        return Array.from(this.host.children).filter((child) => child instanceof HTMLElement);
    }
    // Anchored mode is enabled when `base` is present and there is either
    // explicit badge content or a dot badge that only needs the anchor element.
    get isAnchored() {
        return this.hasBaseSlot && (this.hasBadgeSlot || this.dot);
    }
    syncSlotState() {
        const baseSlotChildren = this.slottedChildren.filter((child) => child.getAttribute("slot") === "base");
        const badgeSlotChildren = this.slottedChildren.filter((child) => child.getAttribute("slot") === "badge");
        this.hasBaseSlot = baseSlotChildren.length > 0;
        this.hasBadgeSlot = badgeSlotChildren.length > 0;
    }
    render() {
        const { sentiment, size, pulse, disabled } = this;
        const cls = {
            badge: true,
            "badge--has-sentiment": !!sentiment,
            "badge--pill": this.pill,
            "badge--pulse": pulse,
            "badge--dot": this.dot,
            "badge--square": this.square,
            "badge--anchored": this.isAnchored,
            "badge--status": this.status,
            [`badge--${size}`]: true,
        };
        if (sentiment) {
            cls[`badge--${sentiment}`] = true;
        }
        if (disabled) {
            //for interactive badge
            cls["badge--disabled"] = true;
        }
        if (sentiment && this.host) {
            this.sheet.replaceSync(`
				:host {
					${getCssRulesForSentimentBadge({
                sentiment: this.sentiment,
                pulse: this.pulse,
            })}
				}
			`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        if (this.isAnchored) {
            return (h(Host, { class: {
                    "badge-host--anchored": true,
                } }, h("slot", { name: "base", onSlotchange: this.handleSlotChange }), h("span", { ref: (el) => {
                    this.badge = el;
                }, part: "base indicator", class: cls, role: "status" }, h("slot", { name: "badge", onSlotchange: this.handleSlotChange }))));
        }
        return (h(Host, null, h("span", { ref: (el) => {
                this.badge = el;
            }, part: "base", class: cls, role: "status" }, h("slot", null))));
    }
    get host() { return this; }
    static get style() { return HbrBadgeStyle0; }
}, [1, "hbr-badge", {
        "sentiment": [513],
        "disabled": [516],
        "pill": [516],
        "inline": [516],
        "pulse": [516],
        "dot": [516],
        "square": [516],
        "size": [513],
        "status": [516],
        "hasBaseSlot": [32],
        "hasBadgeSlot": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-badge"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-badge":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Badge);
            }
            break;
    } });
}

export { Badge as B, defineCustomElement as d };

