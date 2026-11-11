import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { t as throttle } from './function-helper.js';
import { T as TMP_SELECTION_BG_CLASS } from './consts.js';
import { g as getElStyle } from './selection.utils.js';

const tempRangeStyleCss = ".temp-bg-range{display:block;position:absolute;pointer-events:none;z-index:9;border:1px solid rgb(255, 94, 0);box-sizing:border-box}.temp-bg-range.Selection{border:1px dashed gray}.temp-bg-range>div{width:1px;height:1px;position:absolute}.temp-bg-range>div.top{top:-1px}.temp-bg-range>div.bottom{bottom:-1px}.temp-bg-range>div.left{left:-1px}.temp-bg-range>div.right{right:-1px}";
const HbrTempRangeStyle0 = tempRangeStyleCss;

const HbrgrFocus = /*@__PURE__*/ proxyCustomElement(class HbrgrFocus extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.onChange = throttle((e) => this.doChange(e), 300);
        this.selectionStore = undefined;
        this.dimensionRow = undefined;
        this.dimensionCol = undefined;
    }
    doChange(e) {
        e === null || e === void 0 ? void 0 : e.scrollIntoView({
            block: "nearest",
            inline: "nearest",
        });
    }
    componentDidRender() {
        if (this.el) {
            this.onChange(this.el);
        }
    }
    render() {
        const data = this.selectionStore.get("tempRange");
        const type = this.selectionStore.get("tempRangeType");
        if (!data) {
            return;
        }
        let directionY = "bottom";
        let directionX = "right";
        const range = this.getRange();
        if (!range) {
            return;
        }
        if (data.y < range.y) {
            directionY = "top";
        }
        if (data.x < range.x) {
            directionX = "left";
        }
        const directionClass = `${directionX} ${directionY}`;
        const style = getElStyle(data, this.dimensionRow.state, this.dimensionCol.state);
        return (h(Host, { class: {
                [TMP_SELECTION_BG_CLASS]: true,
                [type || ""]: true,
            }, style: style }, h("div", { class: directionClass, ref: (e) => {
                this.el = e;
            } })));
    }
    getRange() {
        const range = this.selectionStore.get("range");
        if (range) {
            return range;
        }
        const focus = this.selectionStore.get("focus");
        if (!focus) {
            return null;
        }
        return Object.assign(Object.assign({}, focus), { x1: focus.x, y1: focus.y });
    }
    static get style() { return HbrTempRangeStyle0; }
}, [0, "hbr-temp-range", {
        "selectionStore": [16],
        "dimensionRow": [16],
        "dimensionCol": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-temp-range"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-temp-range":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrFocus);
            }
            break;
    } });
}

export { HbrgrFocus as H, defineCustomElement as d };

