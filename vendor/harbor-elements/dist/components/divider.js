import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const dividerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--color:var(--base-border-default);--color-strong:var(--base-border-strong-default);--color-medium:var(--control-border-disabled);--color-weak:var(--base-border-medium-default);--size:1px;--margin:var(--hbr-spacing-xs) 0}:host([vertical]){display:inline-block;height:100%}:host(:not([vertical])){display:block;width:100%}.divider{border-top:solid var(--size) var(--color);margin:var(--margin)}.divider--vertical{border:0;width:var(--size);height:100%;background:var(--color);--margin:0}.divider--noPadding{--margin:0}.divider--prominence-strong{--color:var(--color-strong)}.divider--prominence-medium{--color:var(--color-medium)}.divider--prominence-weak{--color:var(--color-weak)}.divider--size-small{--size:1px}.divider--size-medium{--size:2px}:host([grow]){position:initial}.divider--grow{border-color:transparent;background-color:transparent}.divider--grow::before{content:\"\";position:absolute;height:1px;background-color:var(--color);height:1px;background-color:var(--color);right:0;left:0}";
const HbrDividerStyle0 = dividerCss;

const Divider = /*@__PURE__*/ proxyCustomElement(class Divider extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.vertical = false;
        this.noPadding = false;
        this.prominence = "weak";
        this.size = "small";
        this.grow = false;
    }
    handleVerticalChange() {
        this.host.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
    }
    connectedCallback() {
        this.host.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
    }
    render() {
        return (h("div", { key: '968dab54634a1bf1a57703e95dda6a80acfd5469', part: "base", class: {
                divider: true,
                "divider--vertical": this.vertical,
                "divider--noPadding": this.noPadding,
                [`divider--prominence-${this.prominence}`]: true,
                [`divider--size-${this.size}`]: true,
                "divider--grow": this.grow,
            },
            // biome-ignore lint/a11y/useAriaPropsForRole: <explanation>
            role: "separator" }));
    }
    get host() { return this; }
    static get watchers() { return {
        "vertical": ["handleVerticalChange"]
    }; }
    static get style() { return HbrDividerStyle0; }
}, [1, "hbr-divider", {
        "vertical": [516],
        "noPadding": [516, "no-padding"],
        "prominence": [513],
        "size": [513],
        "grow": [516]
    }, undefined, {
        "vertical": ["handleVerticalChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-divider"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-divider":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Divider);
            }
            break;
    } });
}

export { Divider as D, defineCustomElement as d };

