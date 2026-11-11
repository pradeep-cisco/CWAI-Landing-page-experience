import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';

const listItemCss = ":host{display:block;--padding:initial;--list-style-type:none;--margin:initial;--border:none;--color-bg:initial;--line-height:20px;--font-size:var(--hbr-font-size-sm, 14px);--width:inherit;--bg-color-hover:initial;--text-color-active:initial;--pointer:initial;--pointer-hover:pointer;--display:flex;--align-items:stretch;--flex-direction:column;--color:var(--sl-color-neutral-700);--cursor:pointer;--user-select:none;---webkit-user-select:none;--disabled-opacity:0.5;--disabled-outline:none;--disabled-cursor:not-allowed;--item-active-border-color:transparent}:host([variant=anchor]){--border-radius:2px;--position:relative;--item-display:flex;--item-align-items:center;--item-line-top:0;--item-line-left:0;--item-line-width:3px;--item-line-height:100%;--item-line-background:transparent;--item-active-line-color:var(--interact-text-default);--item-hover-line-color:var(--interact-border-medium-hover);--focus-ring-outline:var(--hbr-focus-ring);--focus-ring-offset:var(--hbr-focus-ring-offset);--focus-ring-z-index:2;--item-hover-bg-color:var(--interact-bg-weak-hover);--item-active-hover-bg-color:var(--interact-bg-weak-hover);--item-active-hover-line-color:var(--interact-text-default)}:host([variant=anchor][slot=children]){--indentation-display:block;--indentation-width:16px;--indentation-flex-shrink:0}:host([variant=anchor][active]){--item-line-border-radius:2px}:host(:not([variant=anchor])){--border-radius:0;--text-color-hover:var(--interact-text-default)}:host(:hover){background-color:var(--bg-color-hover);cursor:var(--pointer-hover)}:host(:focus){outline:var(--outline-focus)}.list-item{padding:var(--padding);list-style-type:var(--list-style-type);margin:var(--margin);border:var(--border);border-left:var(--border-left);background-color:var(--color-bg);line-height:var(--line-height);font-size:var(--font-size);width:var(--width);cursor:var(--pointer);display:var(--display);align-items:var(--align-items);flex-direction:var(--flex-direction);color:var(--color);cursor:var(--cursor);user-select:var(-- user-select);-webkit-user-select:var(---webkit-user-select);border-radius:var(--border-radius);position:var(--position)}.list-item:hover{background-color:var(--bg-color-hover);color:var(--text-color-hover)}.list-item__indentation{display:var(--indentation-display);width:var(--indentation-width);flex-shrink:var(--indentation-flex-shrink)}.list-item__line{position:absolute;top:var(--item-line-top);left:var(--item-line-left);width:var(--item-line-width);height:var(--item-line-height);background:var(--item-line-background);border-radius:var(--item-line-border-radius)}.list-item--active{color:var(--color-text-active)}.list-item--active>.list-item__item>.list-item__line{background-color:var(--item-active-line-color)}.list-item__item{display:var(--item-display);align-items:var(--item-align-items);border-inline-start:var(--item-border-inline-start)}.list-item__item:hover{background-color:var(--item-hover-bg-color)}.list-item__item:hover .list-item__line{background-color:var(--item-hover-line-color)}.list-item.list-item--has-children.list-item--active .list-item__item{position:relative}.list-item--active .list-item__item:hover .list-item__line{background-color:var(--item-active-hover-line-color)}.list-item--disabled .list-item__item{opacity:var(--disabled-opacity);outline:var(--disabled-outline);cursor:var(--disabled-cursor)}:host(:focus-visible) .list-item__item{outline:var(--focus-ring-outline);outline-offset:var(--focus-ring-offset);z-index:var(--focus-ring-z-index)}:host(:not([aria-disabled=true])) .list-item--active .list-item__item{background-color:var(--item-active-bg-color)}:host(:not([aria-disabled=true])) .list-item--active .list-item__item:hover{background-color:var(--item-active-hover-bg-color)}:host(:not([aria-disabled=true])) .list-item--active .list-item__item{border-inline-start-color:var(--item-active-border-color)}.list-item__label{display:flex;align-items:center;transition:var(--sl-transition-fast) color}.list-item__children{display:block;font-size:calc(1em + var(--indent-size, var(--hbr-spacing-medium)))}.list-item__children{position:relative}.list-item__children::before{content:\"\";position:absolute;top:var(--indent-guide-offset);bottom:var(--indent-guide-offset);left:calc(1em - var(--indent-guide-width) / 2 - 1px);border-inline-end:var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);z-index:1}.list-item--rtl .list-item__children::before{left:auto;right:1em}";
const HbrListItemStyle0 = listItemCss;

const HbrListItem$1 = /*@__PURE__*/ proxyCustomElement(class HbrListItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.variant = undefined;
        this.disabled = undefined;
        this.active = undefined;
        this.hasPrefix = false;
        this.hasSuffix = false;
        this.hasChildren = false;
    }
    handleDisabledChange() {
        this.host.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    handleSlotChange() {
        this.hasPrefix = hasSlot(this.host, "prefix");
        this.hasSuffix = hasSlot(this.host, "suffix");
    }
    handleChildrenSlotChange() {
        this.hasChildren = hasSlot(this.host, "children");
    }
    componentWillLoad() {
        this.handleChildrenSlotChange();
    }
    render() {
        let parts = "item";
        if (this.disabled) {
            parts += " item--disabled";
        }
        if (this.active) {
            parts += " item--active";
        }
        return (
        // due to the wrapper blocking for SR to read <li> be child of <ul>, we need to add the role to the host
        h(Host, { key: 'f576013b5f23ad8b016b73f088e68062737eb4e5', role: "listitem" }, h("li", { key: '6ecc1c391e200b2767d4f8e4f377dedc8976ac28', part: "base", role: "presentation", class: {
                "list-item": true,
                "list-item--active": this.active,
                "list-item--disabled": this.disabled,
                "list-item--has-prefix": this.hasPrefix,
                "list-item--has-suffix": this.hasSuffix,
                "list-item--has-children": this.hasChildren,
            } }, h("div", { key: '51ca6d4a95405ddd5f6d226c2874f7ab38a4cc74', class: "list-item__item", part: parts }, h("div", { key: '46cbaf71e3706591f6b2a7b8ea42c894da4a4bdd', class: "list-item__line", part: "line" }), h("div", { key: '57e6ad4f3c3aa044953580c866be01ace782289d', class: "list-item__indentation", part: "indentation" }), h("span", { key: '611a680f233228631fb29818d5940f61c8ef7b41', part: "prefix", class: { "list-item__prefix": this.hasPrefix } }, h("slot", { key: 'bc0b2f8784c3f604400b9bead311c54090a07470', onSlotchange: this.handleSlotChange.bind(this), name: "prefix" })), h("slot", { key: '58d5ae5c053b02a38ba0953dba75f6fcd6bde9cd' }), h("span", { key: '9c928420b987e213ec39c5fbc5a222b9dacc3cf0', part: "suffix", class: { "list-item__suffix": this.hasSuffix } }, h("slot", { key: '230f69f574b517b9bc1d6b7bb5aae23a6c483bae', onSlotchange: this.handleSlotChange.bind(this), name: "suffix" }))), this.hasChildren && (h("div", { class: "list-item__children", part: "children", role: "list" }, h("slot", { onSlotchange: this.handleChildrenSlotChange.bind(this), name: "children" }))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrListItemStyle0; }
}, [1, "hbr-list-item", {
        "variant": [513],
        "disabled": [516],
        "active": [1540],
        "hasPrefix": [32],
        "hasSuffix": [32],
        "hasChildren": [32]
    }, undefined, {
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-list-item"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-list-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrListItem$1);
            }
            break;
    } });
}

const HbrListItem = HbrListItem$1;
const defineCustomElement = defineCustomElement$1;

export { HbrListItem, defineCustomElement };

