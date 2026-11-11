import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const hbrCardHorizontalCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:flex}.card-horizontal{display:flex;justify-content:center;align-items:stretch;background:transparent;border:solid 1px var(--control-border-default);width:fit-content;border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md)}.card-horizontal:hover{box-shadow:var(--hbr-shadow-lg)}.card-horizontal ::slotted(hbr-card){--box-shadow:none;--box-shadow-hover:none;--border:none}";
const HbrCardHorizontalStyle0 = hbrCardHorizontalCss;

const HbrCardHorizontal$1 = /*@__PURE__*/ proxyCustomElement(class HbrCardHorizontal extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.disabled = false;
        this.divider = false;
    }
    render() {
        return (h("div", { key: '4ababb89629fdcb200a8aaf8c10746fb16d5576b', ref: (el) => (this.cardHorizontal = el), part: "base", class: {
                "card-horizontal": true,
                "card-horizontal--is-disabled": this.disabled,
                "card-horizontal--middle-divider": this.divider,
            } }, h("slot", { key: '7e7385737a7c437a93ccabf87f6ac01a3ef32e15', name: "left" }), h("slot", { key: '72cbbb28b0652e79817ed1750c44b7b029cda32b', name: "right" })));
    }
    get host() { return this; }
    static get style() { return HbrCardHorizontalStyle0; }
}, [1, "hbr-card-horizontal", {
        "disabled": [516],
        "divider": [4]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-card-horizontal"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-card-horizontal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrCardHorizontal$1);
            }
            break;
    } });
}

const HbrCardHorizontal = HbrCardHorizontal$1;
const defineCustomElement = defineCustomElement$1;

export { HbrCardHorizontal, defineCustomElement };

