import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const keyValuePairsCss = "hbr-key-value-pairs{}hbr-key-value-pairs dl,hbr-key-value-pairs dt,hbr-key-value-pairs dd{margin:0}hbr-key-value-pairs dl{max-width:100%}hbr-key-value-pairs dd{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}hbr-key-value-pairs dt:has(hbr-icon){display:inline-flex;align-items:center;gap:var(--hbr-spacing-2xs)}hbr-key-value-pairs dt:has(hbr-icon) hbr-icon{color:var(--interact-icon-weak-default)}hbr-key-value-pairs[direction=row]:not(:has(>dl:nth-of-type(2))){display:contents}hbr-key-value-pairs[direction=row]:has(>dl:nth-of-type(2)){display:flex;flex-direction:row;align-items:start;flex-wrap:wrap}hbr-key-value-pairs[direction=row]:has(>dl:nth-of-type(2))[size=md]{column-gap:var(--hbr-spacing-4xl);row-gap:var(--hbr-spacing-sm)}hbr-key-value-pairs[direction=row]:has(>dl:nth-of-type(2))[size=sm]{column-gap:var(--hbr-spacing-3xl);row-gap:var(--hbr-spacing-xs)}hbr-key-value-pairs[direction=row]>dl{display:grid;grid-template-columns:max-content auto}hbr-key-value-pairs[direction=row][keywidth]>dl{grid-template-columns:fit-content(var(--key-width, 240px)) minmax(0, 1fr)}hbr-key-value-pairs[direction=row][size=md]>dl{gap:var(--hbr-spacing-sm) var(--hbr-spacing-lg)}hbr-key-value-pairs[direction=row][size=sm]>dl{gap:var(--hbr-spacing-xs) var(--hbr-spacing-md)}hbr-key-value-pairs[direction=row][no-gap]>dl{gap:0}hbr-key-value-pairs[direction=row] dt{font-family:var(--hbr-font-body);font-weight:var(--hbr-font-weight-semibold);line-height:var(--hbr-font-line-height-dense);color:var(--base-text-default)}hbr-key-value-pairs[direction=row] dd{font-family:var(--hbr-font-body);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-dense);color:var(--base-text-default)}hbr-key-value-pairs[direction=row][size=md] dt,hbr-key-value-pairs[direction=row][size=md] dd{font-size:var(--hbr-font-size-sm)}hbr-key-value-pairs[direction=row][size=sm] dt,hbr-key-value-pairs[direction=row][size=sm] dd{font-size:var(--hbr-font-size-xs)}hbr-key-value-pairs[direction=row][align=end] dd{text-align:end}hbr-key-value-pairs[direction=column]:not(:has(>dl:nth-of-type(2))){display:contents}hbr-key-value-pairs[direction=column]:has(>dl:nth-of-type(2)){display:flex;flex-direction:row;align-items:start;flex-wrap:wrap}hbr-key-value-pairs[direction=column]:has(>dl:nth-of-type(2))[size=md]{column-gap:var(--hbr-spacing-4xl);row-gap:var(--hbr-spacing-sm)}hbr-key-value-pairs[direction=column]:has(>dl:nth-of-type(2))[size=sm]{column-gap:var(--hbr-spacing-3xl);row-gap:var(--hbr-spacing-xs)}hbr-key-value-pairs[direction=column]>dl{display:flex;flex-direction:column;gap:var(--hbr-spacing-md)}hbr-key-value-pairs[direction=column][size=md] dt{margin-bottom:calc(var(--hbr-spacing-sm) * -1)}hbr-key-value-pairs[direction=column][size=sm] dt{margin-bottom:calc(var(--hbr-spacing-md) * -1)}hbr-key-value-pairs[direction=column] dt{font-family:var(--hbr-font-body);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-dense);color:var(--base-text-medium-default)}hbr-key-value-pairs[direction=column] dd{font-family:var(--hbr-font-body);font-weight:var(--hbr-font-weight-semibold);line-height:var(--hbr-font-line-height-dense);color:var(--base-text-default)}hbr-key-value-pairs[direction=column][size=md] dt,hbr-key-value-pairs[direction=column][size=md] dd{font-size:var(--hbr-font-size-sm)}hbr-key-value-pairs[direction=column][size=sm] dt,hbr-key-value-pairs[direction=column][size=sm] dd{font-size:var(--hbr-font-size-xs)}hbr-key-value-pairs[variant=form] dt{font-weight:var(--hbr-font-weight-semibold);color:var(--base-text-default)}hbr-key-value-pairs[variant=form] dd{font-weight:var(--hbr-font-weight-normal);color:var(--base-text-default)}";
const HbrKeyValuePairsStyle0 = keyValuePairsCss;

const KeyValuePairs = /*@__PURE__*/ proxyCustomElement(class KeyValuePairs extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.direction = "row";
        this.size = "md";
        this.align = "start";
        this.variant = undefined;
        this.keywidth = false;
        this.noGap = false;
    }
    componentWillRender() {
        this.el.setAttribute("direction", this.direction);
        this.el.setAttribute("size", this.size);
        this.el.setAttribute("align", this.align);
        if (this.noGap) {
            this.el.setAttribute("no-gap", "");
        }
        else {
            this.el.removeAttribute("no-gap");
        }
    }
    render() {
        return h(Host, { key: '62a2427394a4f0fd95a9108980156223cdc7025c' });
    }
    get el() { return this; }
    static get style() { return HbrKeyValuePairsStyle0; }
}, [0, "hbr-key-value-pairs", {
        "direction": [1],
        "size": [1],
        "align": [1],
        "variant": [513],
        "keywidth": [516],
        "noGap": [4, "no-gap"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-key-value-pairs"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-key-value-pairs":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, KeyValuePairs);
            }
            break;
    } });
}

const HbrKeyValuePairs = KeyValuePairs;
const defineCustomElement = defineCustomElement$1;

export { HbrKeyValuePairs, defineCustomElement };

