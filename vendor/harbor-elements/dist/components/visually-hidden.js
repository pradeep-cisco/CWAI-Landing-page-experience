import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const visuallyHiddenCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host(:not(:focus-within)){position:absolute !important;width:1px !important;height:1px !important;clip:rect(0 0 0 0) !important;clip-path:inset(50%) !important;border:none !important;overflow:hidden !important;white-space:nowrap !important;padding:0 !important}";
const HbrVisuallyHiddenStyle0 = visuallyHiddenCss;

const VisuallyHidden = /*@__PURE__*/ proxyCustomElement(class VisuallyHidden extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return h("slot", { key: 'ad668d8a8771d619c86381824e19a6b1958af073' });
    }
    static get style() { return HbrVisuallyHiddenStyle0; }
}, [1, "hbr-visually-hidden"]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, VisuallyHidden);
            }
            break;
    } });
}

export { VisuallyHidden as V, defineCustomElement as d };

