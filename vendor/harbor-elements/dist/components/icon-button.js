import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';
import { f as focusVisible } from './focus-visible.js';
import { g as generateShortID } from './function-helper.js';
import { e as getCssRulesForSentimentIconButton } from './sentiments.js';
import { d as defineCustomElement$1 } from './icon.js';

const iconButtonCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block;--padding:var(--hbr-spacing-xs);--border-radius:var(--hbr-border-radius-md);--color:var(--interact-icon-strong-default);--color-hover:var(--interact-icon-strong-hover);--bg:transparent;--bg-hover:transparent;--focus-border-radius:var(--hbr-border-radius-circle)}.icon-button{flex:0 0 auto;display:flex;align-items:center;background:none;border:none;border-radius:var(--border-radius);font-size:inherit;color:var(--color);padding:var(--padding);cursor:pointer;transition:var(--hbr-transition-medium) color;-webkit-appearance:none;appearance:none;background:var(--bg)}.icon-button:hover:not(.icon-button--disabled){color:var(--color-hover);background:var(--bg-hover)}.icon-button:focus:not(.icon-button--disabled){background:var(--focus-bg-hover)}.icon-button:focus{outline:none}.icon-button--disabled{opacity:0.5;cursor:not-allowed}.icon-button--no-padding{--padding:0}.focus-visible.icon-button:focus hbr-icon{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--focus-border-radius)}";
const HbrIconButtonStyle0 = iconButtonCss;

const IconButton = /*@__PURE__*/ proxyCustomElement(class IconButton extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sheet = new CSSStyleSheet();
        this.asset = undefined;
        this.name = undefined;
        this.size = undefined;
        this.width = undefined;
        this.height = undefined;
        this.label = undefined;
        this.colors = undefined;
        this.staticColors = false;
        this.arialabel = "";
        this.aria = undefined;
        this.library = undefined;
        this.src = undefined;
        this.disabled = false;
        this.sentiment = undefined;
        this.noPadding = undefined;
        this.tooltip = undefined;
        this.tooltipId = `tooltip-${generateShortID()}`;
    }
    /** Focuses the icon button. */
    async setFocus() {
        this.button.focus();
    }
    componentDidLoad() {
        if (this.button) {
            focusVisible.observe(this.button);
        }
    }
    disconnectedCallback() {
        if (this.button) {
            focusVisible.unobserve(this.button);
        }
    }
    render() {
        var _a;
        if (this.sentiment && this.host) {
            this.sheet.replaceSync(`
				${getCssRulesForSentimentIconButton({
                sentiment: this.sentiment,
                disabled: this.disabled,
            })}
				.icon-button:hover {
					${getCssRulesForSentimentIconButton({
                sentiment: this.sentiment,
                disabled: this.disabled,
                type: "hover",
            })}
				}
			`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Host, { key: '24ee485755778c0e4b2b1a79c54924a248c37088' }, h("button", Object.assign({ key: '3a5884d8a1beb1d3fd0369ce8545632c9bfdbeb0', ref: (el) => {
                this.button = el;
            }, part: "base", class: {
                "icon-button": true,
                "icon-button--disabled": this.disabled,
                "icon-button--no-padding": this.noPadding,
            }, type: "button", role: "button", "aria-label": ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) || this.arialabel || `${this.name}`, "aria-describedby": this.tooltip ? this.tooltipId : null, disabled: this.disabled, "aria-disabled": this.disabled ? "true" : null }, this.aria), h("hbr-icon", { key: '3e6690a3ebd54294da9d9fc16c55912b7b08108b', library: this.library, asset: this.asset, name: this.name, src: this.src, size: this.size, width: this.width, height: this.height, label: this.label, colors: this.colors, sentiment: this.sentiment, staticColors: this.staticColors, exportparts: "base:icon-base" })), h("span", { key: '9c656a135a66a5ef4c51c167e974027bac6b3a89', id: this.tooltipId, hidden: true }, this.tooltip)));
    }
    get host() { return this; }
    static get style() { return HbrIconButtonStyle0; }
}, [1, "hbr-icon-button", {
        "asset": [1],
        "name": [513],
        "size": [1],
        "width": [1],
        "height": [1],
        "label": [1],
        "colors": [16],
        "staticColors": [516, "static-colors"],
        "arialabel": [1],
        "aria": [16],
        "library": [513],
        "src": [513],
        "disabled": [516],
        "sentiment": [513],
        "noPadding": [516, "no-padding"],
        "tooltip": [513],
        "tooltipId": [32],
        "setFocus": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-icon-button", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, IconButton);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { IconButton as I, defineCustomElement as d };

