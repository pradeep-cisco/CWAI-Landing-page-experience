import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const labelCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--color:var(--base-text-medium-default);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal, 400);--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-normal)}:host([variant=menu-group][size=small]){--padding:var(--hbr-spacing-2xs) calc(var(--hbr-spacing-2xs) + 2px)}:host([variant=menu-group][size=medium]){--padding:calc(var(--hbr-spacing-xs) - 2px) calc(var(--hbr-spacing-xs) + 2px)}:host([variant=menu-group][size=large]){--padding:var(--hbr-spacing-xs) calc(var(--hbr-spacing-sm) + 2px)}:host([variant=nav-group]){--font-weight:var(--hbr-font-weight-semibold, 600);--line-height:18px;--padding:0 0 0 var(--hbr-spacing-xs, 8px);--color:var(--base-text-medium-default)}:host([variant=nav-menu-group]){--padding:0 10px;--font-size:var(--hbr-font-size-sm, 14px);--line-height:20px;--font-weight:var(--hbr-font-weight-bold, 700);--color:var(--base-text-default)}.label{font-family:var(--font-family);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);letter-spacing:var(--letter-spacing);color:var(--color);padding:var(--padding)}";
const HbrLabelStyle0 = labelCss;

const Label = /*@__PURE__*/ proxyCustomElement(class Label extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.size = "medium";
        this.variant = undefined;
    }
    render() {
        return (h(Host, { key: '56720262969ffefb8bc599d1d1a1e153e2b29bf9' }, h("div", { key: '911edb4402a2dccc78c46e99d018d0eb20211ed5', part: "base", class: {
                label: true,
                [`label--${this.variant}`]: !!this.variant,
                [`label--${this.size}`]: true,
            } }, h("slot", { key: 'f0fbb5c41cd76900915a6be10b9836d252e37d44' }))));
    }
    static get style() { return HbrLabelStyle0; }
}, [1, "hbr-label", {
        "size": [513],
        "variant": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-label"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-label":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Label);
            }
            break;
    } });
}

const HbrLabel = Label;
const defineCustomElement = defineCustomElement$1;

export { HbrLabel, defineCustomElement };

