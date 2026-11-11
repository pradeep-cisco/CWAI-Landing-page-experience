import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const responsiveEmbedCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block}.responsive-embed{position:relative}.responsive-embed ::slotted(embed),.responsive-embed ::slotted(iframe),.responsive-embed ::slotted(object){position:absolute !important;top:0 !important;left:0 !important;width:100% !important;height:100% !important}";
const HbrResponsiveEmbedStyle0 = responsiveEmbedCss;

const ResponsiveEmbed = /*@__PURE__*/ proxyCustomElement(class ResponsiveEmbed extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.aspectRatio = "16:9";
    }
    handleAspectRatioChange() {
        this.setAspectRatio();
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    handleSlotChange() {
        this.setAspectRatio();
    }
    setAspectRatio() {
        const split = this.aspectRatio.split(":");
        const x = parseInt(split[0]);
        const y = parseInt(split[1]);
        this.base.style.paddingBottom = x && y ? `${(y / x) * 100}%` : null;
    }
    render() {
        return (h("div", { key: '3237cbe008678c00c714b9b8f51093d9a68f14af', ref: (el) => (this.base = el), part: "base", class: "responsive-embed" }, h("slot", { key: '2ad5d9e553b47b6188e434b84b70469f17725d04', onSlotchange: this.handleSlotChange })));
    }
    static get watchers() { return {
        "aspectRatio": ["handleAspectRatioChange"]
    }; }
    static get style() { return HbrResponsiveEmbedStyle0; }
}, [1, "hbr-responsive-embed", {
        "aspectRatio": [1, "aspect-ratio"]
    }, undefined, {
        "aspectRatio": ["handleAspectRatioChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-responsive-embed"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-responsive-embed":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ResponsiveEmbed);
            }
            break;
    } });
}

const HbrResponsiveEmbed = ResponsiveEmbed;
const defineCustomElement = defineCustomElement$1;

export { HbrResponsiveEmbed, defineCustomElement };

