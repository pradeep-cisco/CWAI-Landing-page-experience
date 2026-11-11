import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { F as FOCUS_CLASS } from './consts.js';
import { g as getElStyle } from './selection.utils.js';

const focusCss = "hbr-focus.focused-cell{box-shadow:-1px 0 0 #0d63e8 inset, 1px 0 0 #0d63e8 inset, 0 -1px 0 #0d63e8 inset, 0 1px 0 #0d63e8 inset;position:absolute;pointer-events:none;z-index:9;display:block}";
const HbrFocusStyle0 = focusCss;

const HbrgrFocus = /*@__PURE__*/ proxyCustomElement(class HbrgrFocus extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.selectionStore = undefined;
        this.dimensionRow = undefined;
        this.dimensionCol = undefined;
    }
    changed(e) {
        e === null || e === void 0 ? void 0 : e.scrollIntoView({
            block: "nearest",
            inline: "nearest",
        });
    }
    componentDidRender() {
        this.el && this.changed(this.el);
    }
    render() {
        const data = this.selectionStore.get("focus");
        if (data) {
            const style = getElStyle(Object.assign(Object.assign({}, data), { x1: data.x, y1: data.y }), this.dimensionRow.state, this.dimensionCol.state);
            return h(Host, { key: '8fb5097326e4bfed3baef8da0d60711af4505f2c', class: FOCUS_CLASS, style: style });
        }
    }
    get el() { return this; }
    static get style() { return HbrFocusStyle0; }
}, [0, "hbr-focus", {
        "selectionStore": [16],
        "dimensionRow": [16],
        "dimensionCol": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-focus"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-focus":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrFocus);
            }
            break;
    } });
}

export { HbrgrFocus as H, defineCustomElement as d };

