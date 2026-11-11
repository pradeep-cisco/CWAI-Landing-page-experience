import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { c as caretDown } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$4 } from './button.js';
import { d as defineCustomElement$2 } from './spinner.js';

const accordionCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--margin-top:0;--margin-bottom:0;--margin-left:0;--margin-right:0;--border-width:2px;--border-color:var(--control-border-default);--border-top:var(--hbr-border-width, 2px) solid var(--control-border-default);--border-right:var(--border-width) solid var(--border-color);--border-bottom:var(--border-width) solid var(--border-color);--border-left:var(--border-width) solid var(--border-color);--border-radius:var(--hbr-border-radius-lg, 8px);--border-top-left-radius:var(--border-radius);--border-top-right-radius:var(--border-radius);--border-bottom-left-radius:var(--border-radius);--border-bottom-right-radius:var(--border-radius);--hide-duration:var(--hbr-transition-medium);--hide-timing-function:ease;--show-duration:var(--hbr-transition-medium);--show-timing-function:ease;--icon-rotation:rotate(90deg);--summary-text-color:var(--base-text-default);--header-padding-top:var(--hbr-spacing-sm);--header-padding-bottom:var(--hbr-spacing-sm);--header-padding-right:var(--hbr-spacing-md);--header-padding-left:var(--hbr-spacing-md);--header-border-bottom:1px solid var(--control-border-weak-default);--header-trigger-size:var(--hbr-font-size-md);--header-trigger-color:var(--interact-icon-weak-default);--label-line-height:20px;--header-line-height:var(--label-line-height);--label-font-family:var(--hbr-font-body);--label-font-size:var(--hbr-font-size-sm, 14px);--label-font-weight:var(--hbr-font-weight-semibold);--content-padding-top:var(--hbr-spacing-sm);--content-padding-bottom:var(--hbr-spacing-md);--content-padding-right:var(--hbr-spacing-md);--content-padding-left:var(--hbr-spacing-md);--content-font-size:var(--hbr-font-size-sm, 14px);--content-line-height:20px;--box-shadow:var(--hbr-shadow-sm);--box-shadow-hover:var(--hbr-shadow-lg);--border-radius:var(--hbr-border-radius-md);--outline-color:var(--control-border-weak-default);--outline:solid var(--border-width) var(--outline-color);--min-width:initial;--header-icon-bg-hover:var(--interact-bg-weak-hover);--bg-color:var(--base-bg-weak-default);display:block}.accordion{overflow-anchor:none;margin:var(--margin-top) var(--margin-right) var(--margin-bottom) var(--margin-left);border-top:var(--border-top);border-right:var(--border-right);border-bottom:var(--border-bottom);border-left:var(--border-left);border-top-left-radius:var(--border-top-left-radius);border-top-right-radius:var(--border-top-right-radius);border-bottom-left-radius:var(--border-bottom-left-radius);border-bottom-right-radius:var(--border-bottom-right-radius);background-color:var(--bg-color)}.accordion--stacked.accordion--small{--margin-bottom:var(--hbr-spacing-xs, 8px)}.accordion--stacked.accordion--medium{--margin-bottom:var(--hbr-spacing-xs, 8px)}.accordion--stacked.accordion--large{--margin-bottom:var(--hbr-spacing-sm, 12px)}.accordion--disabled{opacity:0.5}.accordion__heading{border-radius:inherit}.accordion__header{display:flex;border-radius:inherit;padding:var(--header-padding-top) var(--header-padding-right) var(--header-padding-bottom) var(--header-padding-left);font-size:var(--label-font-size);font-weight:var(--header-font-weight);line-height:var(--header-line-height);user-select:none;cursor:pointer}.accordion__header:focus{outline:none}.accordion__header{}.accordion__header.accordion--header-small{--header-padding-top:var(--hbr-spacing-xs);--header-padding-bottom:var(--hbr-spacing-xs);--header-padding-right:var(--hbr-spacing-sm);--header-padding-left:var(--hbr-spacing-sm);--label-font-size:var(--hbr-font-size-xs, 12px);--label-line-height:18px;--header-line-height:18px}.accordion__header.accordion--header-large{--header-padding-top:var(--hbr-spacing-md);--header-padding-bottom:var(--hbr-spacing-md);--header-padding-right:var(--hbr-spacing-lg);--header-padding-left:var(--hbr-spacing-lg);--label-font-size:var(--hbr-font-size-md, 16px);--label-line-height:22px;--header-line-height:22px}.accordion__header__expanded{border-bottom:var(--header-border-bottom);border-radius:0px}.accordion__header[aria-expanded=false]:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.accordion__header[aria-expanded=true]:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius)}.accordion--disabled .accordion__header{cursor:not-allowed}.accordion--disabled .accordion__header:focus{outline:none;box-shadow:none}.accordion__summary{flex:1 1 auto;display:flex;align-items:center;color:var(--summary-text-color);font-family:var(--label-font-family);font-weight:var(--label-font-weight, 600)}.accordion__summary:hover{color:var(--summary-text-color)}.accordion__summary.active{color:var(--summary-text-color)}.accordion__summary-icon-button{font-size:var(--header-trigger-size);height:var(--label-line-height);flex:0 0 auto;display:flex;align-items:center;transition:var(--hbr-transition-medium) transform ease;cursor:pointer}.accordion__summary-icon-button:hover{color:var(--interact-icon-weak-hover)}.accordion--open .accordion__summary-icon-button{transform:var(--icon-rotation, rotate(90deg));cursor:pointer}hbr-icon::part(base){color:var(--header-trigger-color)}hbr-button::part(base){width:auto;height:auto;color:var(--header-trigger-color)}hbr-button::part(base):hover{color:var(--interact-icon-weak-hover);background-color:var(--bg-color)}.accordion__body{height:0;overflow:hidden;transition-property:height;transition-duration:var(--hide-duration);transition-timing-function:var(--hide-timing-function)}.accordion--open .accordion__body{transition-duration:var(--show-duration);transition-timing-function:var(--show-timing-function)}.accordion--content{padding:var(--content-padding-top) var(--content-padding-right) var(--content-padding-bottom) var(--content-padding-left);color:var(--base-text-medium-default);font-size:var(--hbr-control-font-size-label-md, 14px);font-size:var(--content-font-size);line-height:var(--content-line-height);}.accordion--content.accordion--content-small{--content-padding-top:var(--hbr-spacing-xs);--content-padding-bottom:var(--hbr-spacing-sm);--content-padding-right:var(--hbr-spacing-sm);--content-padding-left:var(--hbr-spacing-sm);--content-font-size:var(--hbr-font-size-xs, 12px);--content-line-height:18px}.accordion--content.accordion--content-large{--content-padding-top:var(--hbr-spacing-md);--content-padding-bottom:var(--hbr-spacing-lg);--content-padding-right:var(--hbr-spacing-lg);--content-padding-left:var(--hbr-spacing-lg)}.accordion--card{--header-padding-top:var(--hbr-spacing-lg);--header-padding-bottom:var(--hbr-spacing-lg);--header-padding-right:var(--hbr-spacing-lg);--header-padding-left:var(--hbr-spacing-lg);--content-padding-top:0;--content-padding-bottom:var(--hbr-spacing-lg);--content-padding-right:var(--hbr-spacing-lg);--content-padding-left:var(--hbr-spacing-lg);--border-top:none;--border-right:none;--border-bottom:none;--border-left:none;min-width:var(--min-width);box-shadow:var(--box-shadow);outline:var(--outline);border-radius:var(--border-radius)}.accordion--card.card--is-disabled{pointer-events:none;color:var(--base-text-disabled)}.accordion--card.card--is-selected{outline:solid var(--hbr-border-width) var(--interact-text-default)}.accordion--card:not(.card--is-disabled):hover{box-shadow:var(--box-shadow-hover)}.accordion--card:not(.card--is-disabled):focus{box-shadow:var(--box-shadow-hover)}.accordion--card:not(.card--is-disabled):focus-visible{box-shadow:var(--hbr-focus-ring)}.accordion--card .accordion__header{color:var(--base-text-strong-default);--header-border-bottom:0}.accordion--card .accordion__header:hover .accordion__summary-icon{background-color:var(--control-bg-weak-hover);border-radius:var(--hbr-control-border-radius-md)}.accordion--card:not(.card--is-disabled) .accordion__header:hover .accordion__summary-icon-button{background-color:var(--header-icon-bg-hover);border-radius:var(--header-icon-border-radius)}.accordion--card .accordion__summary ::slotted(div){display:flex;align-items:center;gap:var(--hbr-spacing-xs)}.accordion--card .accordion--card:not(.accordion--disabled) .accordion__summary.active{color:inherit}.accordion--card .accordion__summary{font-weight:var(--hbr-font-weight-bold);font-size:var(--hbr-font-size-lg)}.accordion--card .accordion__summary:hover{color:var(--base-text-strong-default)}.accordion--card .accordion__summary.active{color:var(--base-text-strong-default)}.accordion--card:not(.accordion--disabled) .accordion--content{color:var(--base-text-default)}.accordion--card .accordion--content{font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-normal);width:100%}:host{--icon-rotation:rotate(180deg)}:host([variant=stacked]:last-of-type) .accordion{--margin-bottom:0}:host([variant=contained]:last-of-type) .accordion{--border-bottom-right-radius:var(--border-radius);--border-bottom-left-radius:var(--border-radius)}:host([variant=contained]) .accordion{--border-top-left-radius:0;--border-top-right-radius:0;--border-bottom-right-radius:0;--border-bottom-left-radius:0}:host([variant=contained]:first-of-type) .accordion{--border-bottom:0;--border-top-left-radius:var(--border-radius);--border-top-right-radius:var(--border-radius)}:host([variant=contained]){--header-border-bottom:0 solid transparent}:host([variant=borderless]) .accordion{--border-right:0;--border-left:0;--border-top-left-radius:0;--border-top-right-radius:0;--border-bottom-right-radius:0;--border-bottom-left-radius:0}:host([variant=borderless]:first-of-type) .accordion{--border-bottom:0}:host([variant=borderless]){--header-border-bottom:0 solid transparent}:host([variant=borderless]:not(:first-of-type)) .accordion,:host([variant=borderless]:not(:first-of-type):not(:last-of-type)) .accordion,:host([variant=contained]:not(:first-of-type)) .accordion,:host([variant=contained]:not(:first-of-type):not(:last-of-type)) .accordion{--border-top:none}:host([variant=borderless]:first-of-type) .accordion,:host([variant=contained]:first-of-type) .accordion{--border-bottom:var(--hbr-border-width, 2px) solid var(--control-border-default)}:host([triggerposition=left]){--icon-rotation:rotate(180deg)}:host([size=large]) .accordion__header{gap:var(--hbr-spacing-md)}:host([size=medium]) .accordion__header{gap:var(--hbr-spacing-sm)}:host([size=small]) .accordion__header{gap:var(--hbr-spacing-xs)}:host([size=large][variant=borderless]) .accordion--content,:host([size=large][variant=contained]) .accordion--content{padding-top:var(--hbr-spacing-xs)}:host([size=small][variant=borderless]) .accordion--content,:host([size=medium][variant=borderless]) .accordion--content,:host([size=small][variant=contained]) .accordion--content,:host([size=medium][variant=contained]) .accordion--content{padding-top:var(--hbr-spacing-2xs)}:host([variant=card]){--border-radius:var(--hbr-border-radius-xl, 12px);--outline:0;--label-font-family:var(--hbr-font-heading);--header-icon-border-radius:var(--hbr-border-radius-md)}";
const HbrAccordionStyle0 = accordionCss;

let id = 0;
const defaultAria = {
    triggerButtonLabel: "Trigger Button",
    expandButton: "Expand Button", //deprecated, use triggerButtonLabel instead
    collapseButton: "Collapse Button", //deprecated, use triggerButtonLabel instead
};
const Accordion = /*@__PURE__*/ proxyCustomElement(class Accordion extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrHeaderClick = createEvent(this, "hbr-header-click", 7);
        this.componentId = `accordion-${++id}`;
        this.isVisible = false;
        this.open = false;
        this.summary = "";
        this.uncontrolled = false;
        this.label = "";
        this.size = "medium";
        this.headingLevel = undefined;
        this.interactive = false;
        this.aria = {
            triggerButtonLabel: "Trigger Button",
            expandButton: "Expand Button", //deprecated, use triggerButtonLabel instead
            collapseButton: "Collapse Button", //deprecated, use triggerButtonLabel instead
        };
        this.variant = "stacked";
        this.disabled = false;
        this.triggerposition = "left";
    }
    handleOpenChange() {
        this.body ? (this.open ? this.show() : this.hide()) : null;
    }
    connectedCallback() {
        this.handleBodyTransitionEnd = this.handleBodyTransitionEnd.bind(this);
        this.handleSummaryClick = this.handleSummaryClick.bind(this);
        this.handleSummaryKeyDown = this.handleSummaryKeyDown.bind(this);
    }
    componentDidLoad() {
        focusVisible.observe(this.accordion);
        if (this.body) {
            this.body.hidden = !this.open;
        }
        // Show on init if open
        if (this.open) {
            this.body ? this.show() : null;
        }
    }
    disconnectedCallback() {
        focusVisible.unobserve(this.accordion);
    }
    /** Shows the alert. */
    async show() {
        // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
        if (this.isVisible) {
            return;
        }
        const hbrShow = this.hbrShow.emit();
        if (hbrShow.defaultPrevented) {
            this.open = false;
            return;
        }
        this.body.hidden = false;
        if (this.body.scrollHeight === 0) {
            // When the scroll height can't be measured, use auto. This prevents a borked open state when the accordion is open
            // intiially, but not immediately visible (i.e. in a tab panel).
            this.body.style.height = "auto";
            this.body.style.overflow = "visible";
        }
        else {
            this.body.style.height = `${this.body.scrollHeight}px`;
            this.body.style.overflow = "hidden";
        }
        this.isVisible = true;
        this.open = true;
    }
    /** Hides the alert */
    async hide() {
        // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
        if (!this.isVisible) {
            return;
        }
        const hbrHide = this.hbrHide.emit();
        if (hbrHide.defaultPrevented) {
            this.open = true;
            return;
        }
        // We can't transition out of `height: auto`, so let's set it to the current height first
        this.body.style.height = `${this.body.scrollHeight}px`;
        this.body.style.overflow = "hidden";
        requestAnimationFrame(() => {
            this.body.style.height = "0";
        });
        this.isVisible = false;
        this.open = false;
    }
    handleBodyTransitionEnd(event) {
        const target = event.target;
        // Ensure we only emit one event when the target element is no longer visible
        if (event.propertyName === "height" &&
            target.classList.contains("accordion__body") &&
            this.body) {
            this.body.style.overflow = this.open ? "visible" : "hidden";
            this.body.style.height = this.open ? "auto" : "0";
            this.open
                ? this.hbrAfterShow.emit({ open: this.open })
                : this.hbrAfterHide.emit({ open: this.open });
            this.body.hidden = !this.open;
        }
    }
    handleSummaryClick() {
        if (!this.disabled) {
            if (this.uncontrolled) {
                this.hbrHeaderClick.emit({ open: !this.open });
            }
            else {
                this.body ? (this.open ? this.hide() : this.show()) : null;
                this.header.focus();
            }
        }
    }
    handleSummaryKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (this.uncontrolled) {
                this.hbrHeaderClick.emit({ open: !this.open });
            }
            else {
                this.body ? (this.open ? this.hide() : this.show()) : null;
            }
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            if (this.uncontrolled) {
                this.hbrHeaderClick.emit({ open: false });
            }
            else {
                this.body ? this.hide() : null;
            }
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            if (this.uncontrolled) {
                this.hbrHeaderClick.emit({ open: true });
            }
            else {
                this.body ? this.show() : null;
            }
        }
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const a11y = { role: null, tabIndex: null, onClick: null, onKeyDown: null };
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        if (!this.interactive) {
            a11y.role = "button";
            a11y["aria-expanded"] = this.open ? "true" : "false";
            a11y["aria-controls"] = `${this.componentId}-content`;
            a11y["aria-disabled"] = this.disabled ? "true" : "false";
            a11y.tabIndex = 0;
            a11y.onClick = () => this.handleSummaryClick();
            a11y.onKeyDown = (event) => this.handleSummaryKeyDown(event);
        }
        const header = (h("div", Object.assign({ key: 'd101f3921de9284935f0e0070b42e1c25a1bcb28', ref: (el) => {
                this.header = el;
            }, part: "header", id: `${this.componentId}-header`, class: {
                accordion__header: true,
                [`accordion--header-${this.size}`]: true,
                accordion__header__expanded: this.open,
            } }, a11y), this.triggerposition === "left" && (h("span", { part: "trigger" }, this.interactive ? (h("hbr-button", { class: "accordion__summary-icon-button", onClick: this.handleSummaryClick, onKeyDown: this.handleSummaryKeyDown, variant: "text", ariaexpanded: this.open ? "true" : "false", ariacontrols: `${this.componentId}-content`, arialabel: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.triggerButtonLabel)
                ? (_c = this.aria) === null || _c === void 0 ? void 0 : _c.triggerButtonLabel
                : this.open
                    ? ((_d = this.aria) === null || _d === void 0 ? void 0 : _d.collapseButton) || defaultAria.collapseButton
                    : ((_e = this.aria) === null || _e === void 0 ? void 0 : _e.expandButton) || defaultAria.expandButton, disabled: this.disabled, size: "large", "data-testid": "accordion--trigger" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown, class: "accordion__summary-icon" }))) : (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown, class: "accordion__summary-icon-button", role: "button", "aria-label": ((_f = this.aria) === null || _f === void 0 ? void 0 : _f.triggerButtonLabel)
                ? (_g = this.aria) === null || _g === void 0 ? void 0 : _g.triggerButtonLabel
                : this.open
                    ? ((_h = this.aria) === null || _h === void 0 ? void 0 : _h.collapseButton) || defaultAria.collapseButton
                    : ((_j = this.aria) === null || _j === void 0 ? void 0 : _j.expandButton) || defaultAria.expandButton })))), h("div", { key: 'c95e0849334e8e40c0de54e5224d9077db024b9b', part: "label", class: this.open ? "accordion__summary active" : "accordion__summary" }, h("slot", { key: 'a68d3f5d73e70c0791b64b3402a076ddc9429df7', name: "label" }, this.summary || this.label)), this.triggerposition === "right" && (h("span", { part: "trigger" }, this.interactive ? (h("hbr-button", { class: "accordion__summary-icon-button", onClick: this.handleSummaryClick, onKeyDown: this.handleSummaryKeyDown, variant: "text", ariaexpanded: this.open ? "true" : "false", ariacontrols: `${this.componentId}-content`, arialabel: ((_k = this.aria) === null || _k === void 0 ? void 0 : _k.triggerButtonLabel)
                ? (_l = this.aria) === null || _l === void 0 ? void 0 : _l.triggerButtonLabel
                : this.open
                    ? ((_m = this.aria) === null || _m === void 0 ? void 0 : _m.collapseButton) || defaultAria.collapseButton
                    : ((_o = this.aria) === null || _o === void 0 ? void 0 : _o.expandButton) || defaultAria.expandButton, disabled: this.disabled, size: "large", "data-testid": "accordion--trigger" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown, class: "accordion__summary-icon" }))) : (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown, class: "accordion__summary-icon-button", role: "button", "aria-label": ((_p = this.aria) === null || _p === void 0 ? void 0 : _p.triggerButtonLabel)
                ? (_q = this.aria) === null || _q === void 0 ? void 0 : _q.triggerButtonLabel
                : this.open
                    ? ((_r = this.aria) === null || _r === void 0 ? void 0 : _r.collapseButton) || defaultAria.collapseButton
                    : ((_s = this.aria) === null || _s === void 0 ? void 0 : _s.expandButton) || defaultAria.expandButton }))))));
        return (h("div", { key: 'c265f1bec7881fd8cbe70c47656d96d09afa8aed', ref: (el) => {
                this.accordion = el;
            }, part: "base", class: {
                accordion: true,
                "accordion--open": this.open,
                "accordion--disabled": this.disabled,
                [`accordion--${this.variant}`]: true,
                [`accordion--${this.size}`]: true,
            } }, typeof this.headingLevel === "number" &&
            Number.isInteger(this.headingLevel) &&
            this.headingLevel > 0 ? (h("div", { class: "accordion__heading", role: "heading", "aria-level": this.headingLevel }, header)) : (header), h("div", { key: 'cd7d36b0c313a08e8bdb050c3d29989bf401e0b1', ref: (el) => {
                this.body = el;
            }, class: "accordion__body", onTransitionEnd: this.handleBodyTransitionEnd }, h("div", { key: 'e117797c4c515a03cf3264ac48b5c6264d0539b3', part: "content", id: `${this.componentId}-content`, class: {
                "accordion--content": true,
                [`accordion--content-${this.size}`]: true,
            }, role: "region", "aria-labelledby": `${this.componentId}-header` }, h("slot", { key: 'cbc8d50c26a25f1c3bae81f2570992630ee350d3' })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"]
    }; }
    static get style() { return HbrAccordionStyle0; }
}, [1, "hbr-accordion", {
        "open": [1540],
        "summary": [1],
        "uncontrolled": [516],
        "label": [1],
        "size": [513],
        "headingLevel": [2, "heading-level"],
        "interactive": [516],
        "aria": [16],
        "variant": [513],
        "disabled": [4],
        "triggerposition": [513],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-accordion", "hbr-button", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-accordion":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Accordion);
            }
            break;
        case "hbr-button":
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

const HbrAccordion = Accordion;
const defineCustomElement = defineCustomElement$1;

export { HbrAccordion, defineCustomElement };

