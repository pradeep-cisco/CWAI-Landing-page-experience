import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';
import { f as getCssRulesForSentimentLink } from './sentiments.js';
import { h as hasSlot } from './slot.js';

const linkCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block;width:auto;cursor:pointer;--display:initial;--justify-content:initial;--white-space:initial;--padding:initial;--width:initial;--border-style:none;--link-interact-color:var(--interact-text-default);--link-interact-color-hover:var(--interact-text-hover);--link-interact-color-active:var(--interact-text-active);--link-interact-color-disabled:var(--interact-text-disabled);--height-small:var(--hbr-control-height-sm);--height-medium:var(--hbr-control-height-md);--height-large:var(--hbr-control-height-lg);--focus-ring:none;--palm-width:100%;--label-affix-padding-sm:var(--hbr-spacing-2xs);--label-affix-padding-md:var(--hbr-spacing-xs);--label-affix-padding-lg:var(--hbr-spacing-sm);--padding-horizontal-sm:var(--hbr-spacing-sm);--padding-horizontal-md:var(--hbr-spacing-lg);--padding-horizontal-lg:var(--hbr-spacing-xl);--line-height:var(--hbr-font-line-height-dense);--text-link-interact-width:initial;--align-items:initial;--transition:none;--text-decoration:none;--label-icon-vertical-align:initial}@media only screen and (min-width: 23.5em){:host{width:auto}}:host{--width:100%;--display:inline-flex;--justify-content:center;--align-items:stretch;--padding:0;--transition:var(--hbr-transition-fast) background-color, var(--hbr-transition-fast) color,\n    var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow;--border-style:solid;--font-weight:var(--hbr-font-weight-semibold);--text-decoration:none;--label-icon-vertical-align:-2px}:host([inline]){--display:inline;--width:auto}:host(:not([variant=outline]):not([variant=fill]):not([disabled])){--bg-color-hover:var(--interact-bg-weak-hover)}:host([size=small]){font-size:var(--hbr-font-size-xs)}:host([size=medium]){font-size:var(--hbr-font-size-sm)}:host([size=large]){font-size:var(--hbr-font-size-md)}:host([inline]){display:inline;--display:inline;font-size:inherit}.link{display:var(--display);align-items:var(--align-items);justify-content:var(--justify-content);width:var(--width);border-style:var(--border-style);border-width:var(--hbr-border-width);font-family:var(--hbr-control-font-family);font-weight:var(--font-weight);font-size:inherit;text-decoration:var(--text-decoration);white-space:var(--white-space);vertical-align:middle;padding:var(--padding);transition:var(--transition);cursor:inherit}.link::-moz-focus-inner{border:0}.link:focus{outline:none}.link.link--disabled{cursor:not-allowed}.link.link--disabled *{pointer-events:none}.link.link--no-padding{width:initial}.link ::slotted(hbr-icon){pointer-events:none}.link--inline{vertical-align:baseline}.link__prefix,.link__suffix{flex:0 0 auto;display:flex;align-items:center}.link__label ::slotted(hbr-icon){vertical-align:var(--label-icon-vertical-align)}.link{background-color:var(--bg-color);border:var(--border);color:var(--label-color);border:var(--border);padding:var(--padding)}.link:not(.link--disabled):hover{background-color:var(--bg-color-hover);border-color:var(--border-color-hover);color:var(--label-color-hover)}.link:not(.link--disabled):focus,.link:not(.link--disabled):active{background-color:var(--bg-color-press);border-color:var(--border-color-press);color:var(--label-color-press)}.link.link--text.link--interact{border:none;width:var(--text-link-interact-width);color:var(--link-interact-color);background-color:transparent}.link.link--text.link--interact.link--search-selected{background-color:var(--control-bg-weak-active)}.link.link--text.link--interact:hover{color:var(--link-interact-color-hover);background-color:var(--bg-color-hover)}.link.link--text.link--interact:focus,.link.link--text.link--interact:active{color:var(--link-interact-color-active)}.link.link--text.link--interact:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.link.link--text.link--interact.link--disabled{color:var(--link-interact-color-disabled)}.link.link--text.link--interact.link--selected{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.link--small{border-radius:var(--hbr-control-border-radius-sm)}.link--small:not(.link--text){height:var(--height-small)}.link--small{line-height:calc(var(--height-small) - var(--hbr-control-border-width) * 2)}.link--small.link--text{line-height:var(--hbr-font-line-height-normal)}.link--medium{border-radius:var(--hbr-control-border-radius-md)}.link--medium:not(.link--text){height:var(--height-medium)}.link--medium{line-height:calc(var(--height-medium) - var(--hbr-control-border-width) * 2)}.link--medium.link--text{line-height:var(--line-height)}.link--large{border-radius:var(--hbr-control-border-radius-lg)}.link--large:not(.link--text){height:var(--height-large)}.link--large{line-height:calc(var(--height-large) - var(--hbr-control-border-width) * 2)}.link--large.link--text{line-height:var(--hbr-font-line-height-dense)}.link--pill.link--small{border-radius:var(--hbr-control-height-sm)}.link--pill.link--medium{border-radius:var(--hbr-control-height-md)}.link--pill.link--large{border-radius:var(--hbr-control-height-lg)}.link--circle{padding-left:0;padding-right:0}.link--circle.link--small{width:var(--hbr-control-height-sm);height:var(--hbr-control-height-sm);line-height:var(--hbr-control-height-sm);border-radius:var(--hbr-border-radius-circle)}.link--circle.link--small .link__label{line-height:calc(var(--hbr-control-height-sm) - var(--hbr-control-border-width) * 3)}.link--circle.link--medium{width:var(--hbr-control-height-md);height:var(--hbr-control-height-md);border-radius:var(--hbr-border-radius-circle);line-height:var(--hbr-control-height-md)}.link--circle.link--medium .link__label{line-height:calc(var(--hbr-control-height-md) - var(--hbr-control-border-width) * 2)}.link--circle.link--large{width:var(--hbr-control-height-lg);height:var(--hbr-control-height-lg);border-radius:var(--hbr-border-radius-circle);line-height:var(--hbr-control-height-lg)}.link--circle .link__prefix,.link--circle .link__suffix,.link--circle .link__caret{display:none}:not(.link--text).link--has-label.link--small .link__label{padding:0 calc(var(--padding-horizontal-sm) - var(--hbr-control-border-width))}:not(.link--text).link--has-label.link--medium .link__label{padding:0 calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.link--text).link--has-label.link--large .link__label{padding:0 calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.link--text).link--has-prefix.link--small{padding-inline-start:calc(var(--hbr-spacing-sm) - var(--hbr-control-border-width))}:not(.link--text).link--has-prefix.link--small .link__label{padding-inline-start:var(--label-affix-padding-sm)}:not(.link--text).link--has-prefix.link--medium{padding-inline-start:calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.link--text).link--has-prefix.link--medium .link__label{padding-inline-start:var(--label-affix-padding-sm)}:not(.link--text).link--has-prefix.link--large{padding-inline-start:calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.link--text).link--has-prefix.link--large .link__label{padding-inline-start:var(--label-affix-padding-lg)}:not(.link--text).link--has-suffix.link--small,:not(.link--text).link--caret.link--small{padding-inline-end:calc(var(--padding-horizontal-sm) - var(--hbr-control-border-width))}:not(.link--text).link--has-suffix.link--small .link__label,:not(.link--text).link--caret.link--small .link__label{padding-inline-end:var(--label-affix-padding-sm)}:not(.link--text).link--has-suffix.link--medium,:not(.link--text).link--caret.link--medium{padding-inline-end:calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.link--text).link--has-suffix.link--medium .link__label,:not(.link--text).link--caret.link--medium .link__label{padding-inline-end:var(--label-affix-padding-sm)}:not(.link--text).link--has-suffix.link--large,:not(.link--text).link--caret.link--large{padding-inline-end:calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.link--text).link--has-suffix.link--large .link__label,:not(.link--text).link--caret.link--large .link__label{padding-inline-end:var(--label-affix-padding-lg)}.link--text.link--has-prefix.link--small .link__label{padding-inline-start:var(--label-affix-padding-sm)}.link--text.link--has-prefix.link--medium .link__label{padding-inline-start:var(--label-affix-padding-sm)}.link--text.link--has-prefix.link--large .link__label{padding-inline-start:var(--label-affix-padding-lg)}.link--text.link--has-suffix.link--small .link__label,.link--text.link--caret.link--small .link__label{padding-inline-end:var(--label-affix-padding-sm)}.link--text.link--has-suffix.link--medium .link__label,.link--text.link--caret.link--medium .link__label{padding-inline-end:var(--label-affix-padding-sm)}.link--text.link--has-suffix.link--large .link__label,.link--text.link--caret.link--large .link__label{padding-inline-end:var(--label-affix-padding-lg)}";
const HbrLinkStyle0 = linkCss;

const Link = /*@__PURE__*/ proxyCustomElement(class Link extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.sheet = new CSSStyleSheet();
        this.hasFocus = false;
        this.hasLabel = false;
        this.hasPrefix = false;
        this.hasSuffix = false;
        this.linkTitle = "";
        this.sentiment = "interact";
        this.variant = "text";
        this.size = "medium";
        this.disabled = false;
        this.pill = false;
        this.circle = false;
        this.error = false;
        this.inline = false;
        this.href = undefined;
        this.target = undefined;
        this.aria = {};
        this.rel = "noreferrer noopener";
        this.download = undefined;
        this.noPadding = false;
    }
    connectedCallback() {
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    /** Sets focus on the link. */
    async setFocus(options) {
        var _a;
        (_a = this.link) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the link. */
    async removeFocus() {
        var _a;
        (_a = this.link) === null || _a === void 0 ? void 0 : _a.blur();
    }
    handleSlotChange() {
        this.hasLabel = hasSlot(this.host);
        this.hasPrefix = hasSlot(this.host, "prefix");
        this.hasSuffix = hasSlot(this.host, "suffix");
    }
    handleBlur() {
        this.hasFocus = false;
        this.hbrBlur.emit();
    }
    handleFocus() {
        this.hasFocus = true;
        this.hbrFocus.emit();
    }
    handleClick(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    render() {
        var _a;
        const { size, circle, sentiment, variant, disabled } = this;
        let part = "base";
        if (this.error)
            part += " error";
        const cls = {
            link: true,
            // Sizes
            "link--small": size === "small",
            "link--medium": size === "medium",
            "link--large": size === "large",
            // Modifiers
            "link--circle": circle,
            "link--disabled": this.disabled,
            "link--focused": this.hasFocus,
            "link--pill": this.pill,
            "link--text": variant === "text",
            "link--fill": variant === "fill",
            "link--outline": variant === "outline",
            "link--has-label": this.hasLabel,
            "link--has-prefix": this.hasPrefix,
            "link--has-suffix": this.hasSuffix,
            "link--no-padding": this.noPadding,
            "link--inline": this.inline,
        };
        cls[`link--${sentiment}`] = true;
        if (sentiment &&
            sentiment !== "interact" &&
            variant &&
            variant !== "text" &&
            this.host) {
            /** seems like this is not being used. however we are going to leave as it is for backward compatibility reason. */
            this.sheet.replaceSync(`
				:host {
					${getCssRulesForSentimentLink({ sentiment, disabled, variant })}
				}
			`);
            if (this.host.shadowRoot) {
                addConstructedStyle(this.host.shadowRoot, this.sheet);
            }
        }
        return (h(Host, { key: 'b076af29712ff230f176659d7e8ebf1a9a4f35c0' }, h("a", { key: 'c9041ce7ed7c1405c797d618d7eb403628afe9d3', part: part, class: cls, ref: (el) => {
                this.link = el;
            }, href: this.href, target: this.target, download: this.download, rel: this.rel, onBlur: this.handleBlur, onFocus: this.handleFocus, onClick: this.handleClick, "aria-disabled": this.disabled ? "true" : undefined, title: this
                .linkTitle /* An empty title prevents browser validation tooltips from appearing on hover */, tabIndex: this.disabled ? -1 : 0, "aria-label": (_a = this.aria) === null || _a === void 0 ? void 0 : _a.label }, h("span", { key: 'a9c2328d355cfcb3ac8c2ff289e2ba004d1e3975', part: this.hasPrefix ? "prefix" : "", class: { link__prefix: this.hasPrefix } }, h("slot", { key: 'd1cffa330afa1e1d4eee931c7a8208d312308833', onSlotchange: this.handleSlotChange, name: "prefix" })), h("span", { key: '101275b296519f38cdae599f3a7aea23bda65910', part: this.hasLabel ? "label" : "", class: { link__label: this.hasLabel } }, h("slot", { key: 'cf102b88a251acf332e9ce49063bc936d0dc5de9', onSlotchange: this.handleSlotChange })), h("span", { key: 'b5059e35a36eb0093315cdfe4bb9b5ad7f0fc869', part: this.hasSuffix ? "suffix" : "", class: { link__suffix: this.hasSuffix } }, h("slot", { key: 'e72042e0a73dc469f2209759e33b5ade0318e5ec', onSlotchange: this.handleSlotChange, name: "suffix" })))));
    }
    get host() { return this; }
    static get style() { return HbrLinkStyle0; }
}, [1, "hbr-link", {
        "linkTitle": [1, "link-title"],
        "sentiment": [513],
        "variant": [513],
        "size": [513],
        "disabled": [516],
        "pill": [516],
        "circle": [516],
        "error": [516],
        "inline": [516],
        "href": [1],
        "target": [1],
        "aria": [16],
        "rel": [1],
        "download": [1],
        "noPadding": [516, "no-padding"],
        "hasFocus": [32],
        "hasLabel": [32],
        "hasPrefix": [32],
        "hasSuffix": [32],
        "setFocus": [64],
        "removeFocus": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-link"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-link":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Link);
            }
            break;
    } });
}

export { Link as L, defineCustomElement as d };

