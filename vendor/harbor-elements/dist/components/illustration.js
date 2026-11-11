import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { W as illustrationInfo } from './index2.js';
import { d as defineCustomElement$1 } from './icon.js';

const illustrationCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block;width:auto;--padding:0 0 var(--hbr-spacing-xl) 0;--icon-size:224px;--icon-margin:0;--content-width:255px;--heading-font-size:var(--hbr-font-size-lg);--heading-line-height:24px;--heading-margin-top:var(--hbr-spacing-sm);--header-margin-top:var(--hbr-spacing-xs, 8px);--body-font-size:var(--hbr-font-size-md);--body-line-height:22px;--body-margin-top:var(--hbr-spacing-2xs, 4px);--footer-margin-top:var(--hbr-spacing-md, 16px);--content-width-row:none;--heading-color:var(--base-text-strong-default);--body-color:var(--base-text-medium-default)}:host([size=medium]){--header-margin-top:var(--hbr-spacing-2xs, 4px)}.illustration{display:flex;flex-direction:column;align-items:center}.illustration .image{font-size:var(--icon-size);width:var(--icon-size);height:var(--icon-size);margin:var(--icon-margin);display:flex;align-items:center;justify-content:center}.illustration .content{display:flex;flex-direction:column;align-items:center;max-width:var(--content-width)}.illustration .content ::slotted([slot=heading]){margin-top:var(--header-margin-top);font-family:var(--hbr-font-heading);font-weight:var(--hbr-font-weight-bold);font-size:var(--heading-font-size);line-height:var(--heading-line-height);text-align:center;color:var(--heading-color)}.illustration .content ::slotted([slot=body]){margin-top:var(--body-margin-top);font-family:var(--hbr-font-body);font-weight:var(--hbr-font-weight-normal);font-size:var(--body-font-size);line-height:var(--body-line-height);text-align:center;color:var(--body-color)}.illustration .content ::slotted([slot=footer]){margin-top:var(--footer-margin-top);text-align:center}.illustration.illustration--medium{--padding:12px 0;--icon-size:76px;--content-width:255px;--heading-font-size:var(--hbr-font-size-md);--heading-line-height:22px;--heading-margin-top:var(--hbr-spacing-2xs);--body-font-size:var(--hbr-font-size-sm);--body-line-height:20px;--body-margin-top:var(--hbr-spacing-2xs);--footer-margin-top:var(--hbr-spacing-md)}.illustration.illustration--small{--padding:var(--hbr-spacing-2xs) var(--hbr-spacing-sm) var(--hbr-spacing-xs) var(--hbr-spacing-sm);--icon-size:36px;--content-width:236px;--heading-font-size:var(--hbr-font-size-md);--heading-line-height:22px;--heading-margin-top:var(--hbr-spacing-2xs);--body-font-size:var(--hbr-font-size-xs);--body-line-height:18px;--body-margin-top:0;--footer-margin-top:var(--hbr-spacing-md)}.illustration.illustration--row{flex-direction:row;--icon-margin:var(--hbr-spacing-lg)}.illustration.illustration--row .content{align-items:start;max-width:var(--content-width-row)}.illustration.illustration--row .content ::slotted([slot=body]){text-align:start}";
const HbrIllustrationStyle0 = illustrationCss;

const Illustration = /*@__PURE__*/ proxyCustomElement(class Illustration extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.name = undefined;
        this.asset = undefined;
        this.size = "large";
        this.width = undefined;
        this.height = undefined;
        this.sentiment = "info";
        this.direction = "column";
        this.staticColors = false;
    }
    render() {
        const { name, asset, size, width, height, sentiment, direction, staticColors, } = this;
        const iconProps = {};
        if (name) {
            iconProps.name = name;
        }
        else {
            iconProps.asset = asset ? asset : illustrationInfo;
        }
        return (h(Host, { key: '5ce6bb772615d8ffc3f934382d5c8fdf3a0883ab' }, h("div", { key: '55db04ea1100bbe748f8d3f63d6817f464736fc3', class: {
                illustration: true,
                [`illustration--${size}`]: true,
                [`illustration--${direction}`]: true,
            } }, h("div", { key: '8772fd385c46262899f028ee4c90a63d45e50a76', class: "image", part: "image" }, h("slot", { key: '857f9d3eea9a109183938d16c2b2d15ba46381a8', name: "image" }, h("hbr-icon", Object.assign({ key: '028a3ed95b1c04d73ed30ff1d8b393ea5e6c4425', sentiment: sentiment, size: size, width: width, height: height, class: "static-icon", staticColors: staticColors }, iconProps)))), h("div", { key: '5901454e58dc7411c5307c581aa34168a3a53a3a', class: "content", part: "content" }, h("slot", { key: 'a32fcc105b03990da01c56263cbb2ab6be70bc7f', name: "heading" }), h("slot", { key: '18703bcf45323748884a5cd77333749ec25cc166', name: "body" }), h("slot", { key: '0ee8ae2e21231e951a8d3be6505891a73792a570' }), h("slot", { key: '6168b8072126b0784c68db0912687998014559ba', name: "footer" })))));
    }
    static get style() { return HbrIllustrationStyle0; }
}, [1, "hbr-illustration", {
        "name": [520],
        "asset": [1],
        "size": [1],
        "width": [1],
        "height": [1],
        "sentiment": [513],
        "direction": [513],
        "staticColors": [516, "static-colors"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-illustration", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Illustration);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Illustration as I, defineCustomElement as d };

