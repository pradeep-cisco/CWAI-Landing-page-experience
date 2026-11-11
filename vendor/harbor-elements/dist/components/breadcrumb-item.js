import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { t as testSlot } from './slot.js';

const breadcrumbItemCss = ":host{box-sizing:border-box}:host *,:host *::before,:host *::after{box-sizing:inherit}:host(.collapsed){display:none}[hidden]{display:none !important}:host{display:inline-flex;--label-color:var(--interact-text-weak-hover);--label-hover-color:var(--interact-text-weak-hover);--label-active-color:var(--interact-text-weak-hover);--label-hover-text-decoration:none}.breadcrumb-item{display:inline-flex;align-items:center;font-family:var(--hbr-font-family-sans);font-size:var(--hbr-font-size-sm);color:var(--label-color);line-height:var(--hbr-font-line-height-normal);white-space:nowrap}.breadcrumb-item .breadcrumb-item__clickable{display:flex}.breadcrumb-item__label{display:inline-block;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;text-decoration:none;color:inherit;background:none;border:none;border-radius:var(--hbr-border-radius-md);padding:0;margin:0;cursor:pointer;transition:var(--hbr-transition-fast) --color}.breadcrumb-item__label:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}:host(:not(.breadcrumb-item--last)) .breadcrumb-item__label,:host(:not(:last-of-type)) .breadcrumb-item__label{color:var(--label-color)}:host(:not(.breadcrumb-item--last)) .breadcrumb-item__label:hover,:host(:not(:last-of-type)) .breadcrumb-item__label:hover{color:var(--label-hover-color);text-decoration:var(--label-hover-text-decoration)}:host(:not(.breadcrumb-item--last)) .breadcrumb-item__label:active,:host(:not(:last-of-type)) .breadcrumb-item__label:active{color:var(--label-active-color)}.breadcrumb-item__prefix,.breadcrumb-item__suffix{display:none;flex:0 0 auto;display:flex;align-items:center}.breadcrumb-item--has-prefix .breadcrumb-item__prefix{display:inline-flex;margin-right:var(--hbr-spacing-3xs)}.breadcrumb-item--has-suffix .breadcrumb-item__suffix{display:inline-flex;margin-left:var(--hbr-spacing-xs)}:host(.breadcrumb-item--last) .breadcrumb-item__separator{display:none}.breadcrumb-item__separator{display:inline-flex;align-items:center;margin:0 calc(var(--hbr-spacing-xs) - 2px);user-select:none}.breadcrumb-item__separator ::slotted(*){display:inline-flex;align-items:center}:host{--label-color:var(--interact-text-weak-default);--label-hover-color:var(--interact-text-weak-hover);--label-hover-text-decoration:underline}.breadcrumb-item{font-weight:var(--hbr-font-weight-semibold, 600);font-size:var(--hbr-font-size-sm, 14px);line-height:20px}:host(:not([disabled])) .breadcrumb-item__clickable:hover{color:var(--interact-text-weak-hover);text-decoration:underline}:host([disabled]) .breadcrumb-item{cursor:default}:host([disabled]) .breadcrumb-item:hover{color:inherit;text-decoration:none}.breadcrumb-item__separator{font-size:var(--hbr-font-size-xs, 12px);color:var(--base-text-weak-default)}:host(:not([disabled])) .breadcrumb-item__prefix:hover{cursor:pointer}:host([disabled]) .breadcrumb-item__label{cursor:default}:host([disabled]) .breadcrumb-item__label:hover{color:inherit;text-decoration:none}";
const HbrBreadcrumbItemStyle0 = breadcrumbItemCss;

const HbrBreadcrumbItem = /*@__PURE__*/ proxyCustomElement(class HbrBreadcrumbItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBreadcrumbChange = createEvent(this, "hbr-breadcrumb-change", 7);
        this.href = undefined;
        this.target = undefined;
        this.rel = "noreferrer noopener";
        this.disabled = false;
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    handleSlotChange() {
        this.hbrBreadcrumbChange.emit();
    }
    render() {
        const isLink = this.href ? true : false;
        const prefix = testSlot("prefix", this.el);
        const suffix = testSlot("suffix", this.el);
        return (h("div", { key: 'e3a0d0ffbaedbbc6958698fd25a800d934877aee', part: "base", class: `breadcrumb-item ${prefix
                ? "breadcrumb-item--has-prefix"
                : suffix
                    ? "breadcrumb-item--has-suffix"
                    : ""}` }, h("div", { key: '5bbc69228534de149dccc673326af8d8b97357bd', part: "clickable", class: "breadcrumb-item__clickable" }, h("span", { key: '2c746b225086fb36c8608739fb7358c76ef237c9', part: "prefix", class: "breadcrumb-item__prefix" }, h("slot", { key: 'e58c6097b3e0e9ba5bbabc084ea7531188a10dd1', name: "prefix" })), isLink ? (h("a", { part: "label", class: "breadcrumb-item__label breadcrumb-item__label--link", href: this.href, target: this.target ? this.target : "", rel: this.target ? this.rel : "" }, h("slot", null))) : (h("button", { disabled: this.disabled, part: "label", type: "button", class: "breadcrumb-item__label breadcrumb-item__label--button" }, h("slot", { onSlotchange: this.handleSlotChange }))), h("span", { key: 'f83e60cf2ad47687e9eb8cac72373ae35929312d', part: "suffix", class: "breadcrumb-item__suffix" }, h("slot", { key: '5ac197c768757149295914f4206481f2a7b477f6', name: "suffix" }))), h("span", { key: 'b9abb13834f20ff8f34c4e0c4d8755f88851e2cc', part: "separator", class: "breadcrumb-item__separator", "aria-hidden": "true", onClick: (event) => {
                event.stopPropagation();
            } }, h("slot", { key: 'a4ed0b593d4f0f6cfa80a658b8606f4de000d1f3', name: "separator" }))));
    }
    get el() { return this; }
    static get style() { return HbrBreadcrumbItemStyle0; }
}, [1, "hbr-breadcrumb-item", {
        "href": [1],
        "target": [1],
        "rel": [1],
        "disabled": [516]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-breadcrumb-item"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-breadcrumb-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrBreadcrumbItem);
            }
            break;
    } });
}

export { HbrBreadcrumbItem as H, defineCustomElement as d };

