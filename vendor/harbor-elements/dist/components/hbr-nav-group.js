import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './resize-observer.js';
import { d as defineCustomElement$2 } from './tooltip.js';

const navGroupCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--nav-group-normal-width:248px;display:flex;flex-direction:column;gap:var(--hbr-spacing-xs);min-width:0;--padding:var(--hbr-spacing-xs) var(--hbr-spacing-sm);--color:var(--base-text-medium-default);--font-size:var(--hbr-font-size-xs, 0.8rem);--font-weight:var(--hbr-font-weight-bold);--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-normal)}.nav-label{display:block;font-family:var(--hbr-font-body);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);letter-spacing:var(--letter-spacing);color:var(--color);padding:var(--padding);user-select:none;box-sizing:border-box;max-width:100%;overflow:hidden;width:var(--nav-group-normal-width, auto)}::slotted([slot=label]){display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host([collapsed]) .nav-label{display:none}.nav-label--collapsed{display:none}";
const HbrNavGroupStyle0 = navGroupCss;

const HbrNavGroup$1 = /*@__PURE__*/ proxyCustomElement(class HbrNavGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.getAssignedLabelElement = () => {
            var _a, _b;
            return (_b = (_a = this.labelSlotRef) === null || _a === void 0 ? void 0 : _a.assignedElements({ flatten: true })) === null || _b === void 0 ? void 0 : _b[0];
        };
        this.syncLabelText = () => {
            var _a;
            this.labelText = (_a = this.labelSlotRef) === null || _a === void 0 ? void 0 : _a.assignedNodes({ flatten: true }).map((node) => { var _a; return (_a = node.textContent) !== null && _a !== void 0 ? _a : ""; }).join("").trim();
        };
        this.syncLabelOverflow = () => {
            const assignedLabelElement = this.getAssignedLabelElement();
            const overflowElement = assignedLabelElement !== null && assignedLabelElement !== void 0 ? assignedLabelElement : this.labelRef;
            this.labelTruncated = overflowElement
                ? overflowElement.scrollWidth > overflowElement.clientWidth
                : false;
        };
        this.handleLabelSlotChange = () => {
            this.syncLabelText();
            this.syncLabelOverflow();
        };
        this.labelTruncated = false;
        this.labelText = "";
        this.collapsed = false;
    }
    componentDidLoad() {
        this.syncLabelText();
        this.syncLabelOverflow();
    }
    render() {
        return (h(Host, { key: 'b20f57fcd27c99befbad806f37b6b7d22ae7b1b1', role: "group" }, h("span", { key: '32ecae8d8994fc9221356672903ad28d28d30cfa', ref: (el) => {
                this.labelRef = el;
            }, class: {
                "nav-label": true,
                "nav-label--collapsed": this.collapsed,
            }, part: "label" }, h("slot", { key: '85c7d40b65c20111e41610eed27c8f31c86c0cbd', name: "label", ref: (el) => {
                this.labelSlotRef = el;
            }, onSlotchange: this.handleLabelSlotChange })), h("slot", { key: 'fa052402a2db5dc14981d276c80d8b8dfb71eb06' }), h("hbr-tooltip", { key: '903da585174fb90960975fd1f01303564cc247fb', content: this.labelText, anchor: this.labelRef, disabled: !this.labelTruncated, hoist: true, placement: "right-start" }), h("hbr-resize-observer", { key: 'b2246ac0b11b8c84098d0d3a8e6b839d18c9e0a6', anchor: this.host, subscriber: this.labelRef, "onHbr-resize": this.syncLabelOverflow })));
    }
    get host() { return this; }
    static get style() { return HbrNavGroupStyle0; }
}, [1, "hbr-nav-group", {
        "collapsed": [516],
        "labelTruncated": [32],
        "labelText": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-nav-group", "hbr-popup", "hbr-resize-observer", "hbr-tooltip"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-nav-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrNavGroup$1);
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-resize-observer":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrNavGroup = HbrNavGroup$1;
const defineCustomElement = defineCustomElement$1;

export { HbrNavGroup, defineCustomElement };

