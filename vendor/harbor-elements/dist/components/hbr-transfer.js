import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { b as caretLeft, a as caretRight } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$5 } from './button.js';
import { d as defineCustomElement$4 } from './divider.js';
import { d as defineCustomElement$2 } from './spinner.js';

const transferCss = ":host{--min-width:inherit;--min-height:100%;--width:100%;--max-height:100%}:host{--min-width:145px;--min-height:158px;--width:400px;--max-height:482px}@media (min-width: 910px){:host{display:block;width:fit-content}}.transfer--list-outer{display:flex;gap:var(--hbr-spacing-lg)}.transfer__list-container{width:var(--width);min-width:var(--min-width);height:fit-content;border:var(--hbr-border-width) solid var(--control-border-default);border-radius:var(--hbr-border-radius-xl);min-height:var(--min-height);max-height:var(--max-height);display:flex;flex-direction:column;overflow:hidden;background:var(--base-bg-weak-default)}.transfer__list{height:100%;overflow-y:auto;margin-bottom:16px}.transfer__buttons-container{display:flex;flex-direction:column;gap:var(--hbr-spacing-sm);justify-content:center}.transfer__source-check{margin:var(--hbr-spacing-md)}.transfer__divider{--margin:0px}";
const HbrTransferStyle0 = transferCss;

const Transfer = /*@__PURE__*/ proxyCustomElement(class Transfer extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTransfer = createEvent(this, "hbr-transfer", 7);
        this.transfer = (source, destination, selected) => {
            for (let i = 0; i < source.length; i++) {
                const node = source[i];
                if (node.children && node.children.length > 0) {
                    const selectedChildren = node.children.filter((child) => child.id && selected.includes(child.id));
                    if (selectedChildren.length > 0) {
                        const existingNode = destination.find((n) => n.id === node.id);
                        if (existingNode) {
                            existingNode.children = existingNode.children
                                ? [...existingNode.children, ...selectedChildren]
                                : [...selectedChildren];
                        }
                        else {
                            destination.push(Object.assign(Object.assign({}, node), { children: selectedChildren }));
                        }
                        node.children = node.children.filter((child) => child.id && !selected.includes(child.id));
                    }
                }
                if (node.id && selected.includes(node.id)) {
                    const existingNode = destination.find((n) => n.id === node.id);
                    if (!existingNode) {
                        destination.push(node);
                    }
                    source.splice(i, 1);
                    i--;
                }
            }
        };
        this.data = undefined;
        this.selected = undefined;
        this.aria = undefined;
    }
    transferChangeHandler(event) {
        var _a, _b, _c;
        const selected = (_a = this.selected) !== null && _a !== void 0 ? _a : [[], []];
        if (event.detail.direction === "left") {
            this.transfer(this.data[1].children, this.data[0].children, (_b = selected[1]) !== null && _b !== void 0 ? _b : []);
            event.detail.data = [this.data[1], this.data[0]];
        }
        else {
            this.transfer(this.data[0].children, this.data[1].children, (_c = selected[0]) !== null && _c !== void 0 ? _c : []);
            event.detail.data = [this.data[0], this.data[1]];
        }
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const selected = (_b = this.selected) !== null && _b !== void 0 ? _b : [[], []];
        return (h("div", { key: '9e4af9e3fc2406aac9832b892d80ccf188bf3dc1', class: "transfer--list-outer" }, h("div", { key: '62142c04197aea30294758936becfd7aa36cd77a', class: "transfer__list-container", part: "transfer-list-container" }, h("div", { key: '1ffe24157933e5b02ed254ec69bb46acd915cf89', class: "transfer__source-check" }, h("slot", { key: '2b821260a7c8da88e65bbb0437db077d93a4be36', name: "left-check-all" })), h("div", { key: '6e381bcc529b272fe3293ae525d01adaea40410c', class: "transfer__divider" }, h("hbr-divider", { key: 'b667de6e87f98fd2c109c2b68d3e350b9b3abad8', class: "transfer__divider" })), h("div", { key: '1cd846d799630fd059e3f056bd9e3c7728bb731e', class: "transfer__search" }, h("slot", { key: '1360594a03c7d6b9c4228a9c6bcb7ff572e87edd', name: "left-search-input" })), h("div", { key: '426886d486dfc604e9c8d0cc9c99d1672f510fd3', class: "transfer__list" }, h("slot", { key: '70372a33d6bf181e3f31387db156f5b094b0dd5d', name: "left-list" }))), h("div", { key: '33560bcf5a4172de54fb0de902b218c7c018ea24', class: "transfer__buttons-container" }, h("div", { key: '87d4f7ae9eb322ab25752b0a879fca0548dec774', slot: "left-transfer-button" }, h("hbr-button", { key: '9377f1667cffd814131602b038f9316ef61c2b0a', disabled: !((_c = selected[1]) === null || _c === void 0 ? void 0 : _c.length), onClick: () => this.hbrTransfer.emit({ direction: "left" }), "data-testid": "transfer--left-button", aria: {
                label: ((_d = this.aria) === null || _d === void 0 ? void 0 : _d.leftButton) ||
                    "Move selected items to the left list",
            } }, " ", h("hbr-icon", { key: '9e0264613a816faa44675b781c8aae6a73915bf9', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-left"]) || caretLeft }))), h("div", { key: '4605d7ddd6ca0f5df07bf1660bc181f2c8c0c761', slot: "right-transfer-button" }, h("hbr-button", { key: '4876714a2dc6089b777540836c0d1b0452578340', disabled: !((_e = selected[0]) === null || _e === void 0 ? void 0 : _e.length), onClick: () => this.hbrTransfer.emit({ direction: "right" }), "data-testid": "transfer--right-button", aria: {
                label: ((_f = this.aria) === null || _f === void 0 ? void 0 : _f.rightButton) ||
                    "Move selected items to the right list",
            } }, " ", h("hbr-icon", { key: '884b2b449a2c0182255ff489006fb5b14451e03d', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight })))), h("div", { key: 'edbfa2daf473dc4275c525d0e78259ce4608b573', class: "transfer__list-container", part: "transfer-list-container" }, h("div", { key: '3fbea49a7788b311dbc6ca51ca9bcf9bfdb3a6af', class: "transfer__source-check" }, h("slot", { key: 'b93ae07572bbdb408dd8379a09b5fb4541349b88', name: "right-check-all" })), h("div", { key: 'eca119a1d0755b7948726e58f06d12f4c9c5fbcd', class: "transfer__divider" }, h("hbr-divider", { key: '24754346cd1367d94fa659bb4b9d3878a42578a6', class: "transfer__divider" })), h("div", { key: 'd15ab4ba05272000cf6f654238b4079ccb1eb785', class: "transfer__search" }, h("slot", { key: '79fe8f3c14dbc31fbe669653ae00e9f3564f01e2', name: "right-search-input" })), h("div", { key: '09214e069e7c9b16d1540393be80aa16117d0d0d', class: "transfer__list" }, h("slot", { key: 'ff090f29bd0f19c46d83eb0efa5cb7a3af61c6ae', name: "right-list" })))));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get style() { return HbrTransferStyle0; }
}, [65, "hbr-transfer", {
        "data": [16],
        "selected": [16],
        "aria": [16]
    }, [[0, "hbr-transfer", "transferChangeHandler"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-transfer", "hbr-button", "hbr-divider", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-transfer":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Transfer);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-divider":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTransfer = Transfer;
const defineCustomElement = defineCustomElement$1;

export { HbrTransfer, defineCustomElement };

