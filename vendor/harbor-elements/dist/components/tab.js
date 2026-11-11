import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { B as remove } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$1 } from './icon-button.js';

const tabCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--color-sentiment-text-hover:var(--base-text-default)}:host:not([sentiment=interact]){--color-sentiment-indicator-hover:var(--brand-accent-border-hover)}:host([sentiment=interact]){--color-sentiment-indicator:var(--interact-border-medium-active);--color-sentiment-indicator-hover:var(--interact-border-medium-hover);--color-sentiment-text:var(--interact-text-weak-active)}:host([primary]){--color-sentiment-indicator:var(--brand-accent-border-active);--color-sentiment-indicator-hover:var(--brand-accent-border-hover);--color-sentiment-text:var(--base-text-medium-default)}:host([sentiment=success]):not([primary]){--color-sentiment-indicator:var(--positive-border-active);--color-sentiment-indicator-hover:var(--positive-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=danger]),:host([sentiment=negative]){--color-sentiment-indicator:var(--negative-border-medium-active);--color-sentiment-indicator-hover:var(--negative-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=warning]){--color-sentiment-indicator:var(--warning-border-active);--color-sentiment-indicator-hover:var(--warning-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host{--color:var(--interact-text-weak-default);--focus-ring:inset 0 0 0 var(--hbr-focus-ring-width) var(--interact-border-medium-hover);--active-background-color:none;--indicator-disabled-color:var(--base-text-disabled);--disabled-color:var(--base-text-disabled);--width:fit-content;--height:40px;--padding:var(--hbr-spacing-sm) var(--hbr-spacing-lg);--margin-right:0;--prefix-margin-right:calc(var(--hbr-spacing-xs) - 2px);--suffix-margin-left:calc(var(--hbr-spacing-xs) - 2px);--indicator-left:unset;--indicator-right:0;--border-radius:4px;--font-size:var(--hbr-font-size-sm);--font-weight:var(--hbr-font-weight-semibold);--font-weight-active:var(--hbr-font-weight-bold);--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-dense);--focus-outline-offset:var(--hbr-focus-ring-width);--slot-sentiment-color:var(--color-sentiment-text);position:relative;display:flex}:host([vertical]){--line-height:20px}:host([nav]){--prefix-margin-right:0;--suffix-margin-left:0}.tab{--hover-color:var(--color-sentiment-text);--active-color:var(--color-sentiment-text);--focus-color:var(--color-sentiment-text);--indicator-color:var(--color-sentiment-indicator);--indicator-hover-color:var(--color-sentiment-indicator-hover)}.tab ::slotted(.trigger){display:flex;align-items:center}.tab ::slotted(hbr-dropdown){--trigger-color:var(--base-text-default);--trigger-open-color:var(--slot-sentiment-color);--trigger-hover-color:var(--slot-sentiment-color);--trigger-selected-color:var(--slot-sentiment-color)}.tab{display:inline-flex;align-items:center;position:relative;font-family:var(--hbr-font-body);font-size:var(--font-size);font-weight:var(--font-weight);border-radius:var(--border-radius);letter-spacing:var(--letter-spacing);line-height:var(--line-height);color:var(--color);margin-right:var(--margin-right);padding:var(--padding);white-space:nowrap;user-select:none;cursor:pointer;transition:var(--transition-speed) box-shadow, var(--transition-speed) color;width:var(--width);line-height:var(--line-height)}.tab:focus{outline:none}.tab:focus-visible:not(.tab--disabled):not(.tab--popover){color:var(--focus-color);outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:2px;border-radius:2px}.tab.tab--active:not(.tab--disabled){color:var(--active-color);background-color:var(--active-background-color)}.tab.tab--disabled{cursor:not-allowed;color:var(--disabled-color)}.tab.tab--nav{display:flex;gap:var(--hbr-spacing-md);align-items:center;color:var(--base-text-medium-default);padding:var(--hbr-spacing-xs) var(--hbr-spacing-sm);font-size:var(--hbr-font-size-sm);border-radius:var(--hbr-border-radius-md);background-color:inherit;font-weight:var(--hbr-font-weight-bold);height:var(--height)}.tab.tab--nav .tab__prefix{font-size:var(--hbr-font-size-xl);display:block;height:29px}.tab.tab--nav.tab--hover{color:var(--hover-color)}.tab.tab--nav.tab--active{color:var(--control-border-strong-default);background-color:var(--interact-border-weak-active);padding-left:var(--hbr-spacing-xs);margin-left:var(--hbr-spacing-2xs);width:calc(100% - var(--hbr-spacing-xs))}.tab.tab--nav.tab--active .tab__prefix{color:var(--brand-accent-icon-active)}.tab.tab--nav.tab--active:hover{margin-left:0;width:inherit}.tab.tab--nav.tab--active.tab--popover{margin-left:0;padding-left:var(--hbr-spacing-sm)}.tab.tab--nav.tab--collapsed:not(:hover):not(.tab--popover){width:40px;overflow:hidden;border-radius:8px}.tab.tab--nav.tab--collapsed:hover:not(.tab--popover){width:256px}.tab.tab--nav:hover{color:var(--base-text-default);background-color:var(--base-bg-weak-default);box-shadow:var(--hbr-shadow-lg);padding-left:var(--hbr-spacing-sm);padding-right:var(--hbr-spacing-md)}.tab.tab--nav:hover .tab__prefix{color:var(--hbr-color-brand)}.tab.tab--nav.tab--popover{width:100%;color:var(--interact-text-weak-default);padding-left:var(--hbr-spacing-xs);margin-left:var(--hbr-spacing-2xs)}.tab:hover:not(.tab--disabled):not(.tab--active):not(.tab--nav){color:var(--hover-color)}.tab.tab--focusevent:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.tab.tab--collapsed:not(.tab--nav)>.tab__label,.tab.tab--collapsed:not(.tab--nav)>.tab__suffix,.tab.tab--collapsed:not(.tab--nav)>slot{display:none}.tab--nav.tab--popover.tab--active{border-top-right-radius:0;border-bottom-right-radius:0;clip-path:inset(-100vw 0 -100vw -100vw);color:var(--base-text-default);box-shadow:var(--hbr-shadow-lg);position:relative;z-index:1001;background-color:var(--base-bg-weak-default);padding-left:var(--hbr-spacing-xs)}.tab--nav.tab--popover.tab--active:not(.tab--hover){background-color:var(--base-bg-weak-hover);border-radius:var(--border-radius);box-shadow:none;margin-left:var(--hbr-spacing-2xs);width:calc(100% - var(--hbr-spacing-xs));padding-left:var(--hbr-spacing-xs)}.tab--nav.tab--popover.tab--active.tab--collapsed{box-shadow:none;border-top-right-radius:var(--border-radius);border-bottom-right-radius:var(--border-radius);clip-path:none}.tab--nav.tab--popover.tab--active.tab--collapsed .tab__label{margin-left:var(--hbr-spacing-lg)}.tab--nav.tab--popover.tab--active:hover{width:100%}.tab__prefix,.tab__suffix{flex:0 0 auto;display:flex;align-items:center}.tab__prefix ::slotted(*){margin-right:var(--prefix-margin-right)}.tab__suffix ::slotted(*){margin-left:var(--suffix-margin-left)}.tab__close-button{font-size:var(--hbr-font-size-sm);margin-left:var(--hbr-spacing-2xs)}.tab__close-button::part(base){padding:var(--hbr-spacing-3xs)}.tab--nested{--padding:0px}.tab--nested ::slotted(hbr-dropdown){--trigger-padding:12px 0px;--trigger-selected-color:var(--active-color)}.tab--vertical .tab__indicator{width:var(--indicator-size);height:100%;border-radius:var(--hbr-border-width, 2px);background:var(--indicator-color);position:absolute;top:0px;left:var(--indicator-left);right:var(--indicator-right);display:none}.tab--vertical.tab--active .tab__indicator,.tab--vertical.tab--hover .tab__indicator{display:flex}.tab--vertical .tab--active .tab__indicator{background:var(--indicator-color)}.tab--vertical .tab--hover .tab__indicator{background:var(--indicator-hover-color)}.tab--vertical:not(.tab--disabled):not(.tab--active):hover .tab__indicator{display:flex;background:var(--indicator-hover-color)}.tab--vertical.tab--disabled .tab__indicator{background:var(--indicator-disabled-color)}.tab--variant-tab .tab__default-slot,.tab--variant-nested .tab__default-slot{width:100%}.tab--variant-tab .tab__prefix,.tab--variant-tab .tab__suffix,.tab--variant-nested .tab__prefix,.tab--variant-nested .tab__suffix{display:flex;align-items:center;justify-content:center;font-size:16px}.tab--variant-tab .tab__suffix ::slotted(hbr-icon-button),.tab--variant-nested .tab__suffix ::slotted(hbr-icon-button){--padding:0px}.tab--horizontal .tab__indicator{width:100%;border-radius:2px;height:3px;display:none;position:absolute;bottom:0px}.tab--horizontal:not(.tab--disabled):not(.tab--active):hover .tab__indicator{display:flex;background:var(--indicator-hover-color)}.tab--horizontal.tab--active .tab__indicator{display:flex;background:var(--indicator-color)}.tab.tab--nested{--margin-right:0px}.tab--menu-horizontal.tab--menu-nested:not(.tab--menu-disabled){--indicator-color:var(--color-sentiment-indicator);--indicator-hover-color:var(--color-sentiment-indicator-hover);border-radius:var(--border-radius)}.tab--menu-horizontal.tab--menu-nested:not(.tab--menu-disabled) .tab--menu__indicator{width:100%;border-radius:2px;height:3px;display:none;position:absolute;bottom:0px}.tab--menu-horizontal.tab--menu-nested:not(.tab--menu-disabled):hover .tab--menu__indicator{display:flex;background:var(--indicator-hover-color)}.tab--menu-horizontal.tab--menu-nested:not(.tab--menu-disabled).tab--menu-active .tab--menu__indicator{display:flex;background:var(--indicator-color)}.tab--active{font-weight:var(--font-weight-active)}";
const HbrTabStyle0 = tabCss;

let id = 0;
const Tab = /*@__PURE__*/ proxyCustomElement(class Tab extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrClose = createEvent(this, "hbr-close", 7);
        this.hbrActive = createEvent(this, "hbr-active", 7);
        this.sheet = new CSSStyleSheet();
        this.componentId = `tab-${++id}`;
        this.setNestedButtonTriggerTabindex = () => {
            if (this.nested) {
                const button = this.host.querySelector("hbr-button[ariarole='tab']");
                if (button) {
                    button.setAttribute("tabidx", button.disabled ? "-1" : this.active ? "0" : "-1");
                }
            }
        };
        this.getTabindex = () => {
            return this.disabled
                ? "-1"
                : this.nav
                    ? "0"
                    : this.nested
                        ? "-1"
                        : this.active
                            ? "0"
                            : "-1";
        };
        this.hasMenu = false;
        this.name = undefined;
        this.panel = "";
        this.active = false;
        this.closable = false;
        this.popOver = false;
        this.hover = false;
        this.nav = false;
        this.disabled = false;
        this.vertical = undefined;
        this.nested = undefined;
        this.collapsed = false;
        this.focusEvent = false;
        this.arialabelledby = undefined;
        this.ariahidden = false;
        this.ariarole = undefined;
        this.sentiment = undefined;
        this.aria = undefined;
    }
    connectedCallback() {
        this.handleBaseClick = this.handleBaseClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleCloseIconOnKeyDown = this.handleCloseIconOnKeyDown.bind(this);
        this.handleTabActive = this.handleTabActive.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        const verticalTab = this.host.closest("hbr-tab-vertical");
        if (verticalTab) {
            this.collapsed = verticalTab.collapsed;
        }
        this.handleSlotChange();
    }
    componentDidLoad() {
        this.setNestedButtonTriggerTabindex();
    }
    /** Sets focus to the tab. */
    async setFocus(options) {
        var _a;
        (_a = this.tab) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the tab. */
    async removeFocus() {
        var _a;
        (_a = this.tab) === null || _a === void 0 ? void 0 : _a.blur();
    }
    async setTabindex() {
        var _a;
        (_a = this.tab) === null || _a === void 0 ? void 0 : _a.setAttribute("tabindex", this.getTabindex());
    }
    handleBaseClick() {
        !this.disabled && this.hbrClick.emit();
    }
    handleKeyDown(event) {
        var _a;
        if ([" ", "Enter"].includes(event.key)) {
            if (!this.nested)
                (_a = this.tab) === null || _a === void 0 ? void 0 : _a.click();
        }
    }
    handleCloseClick() {
        !this.disabled && this.hbrClose.emit();
    }
    handleCloseIconOnKeyDown(e) {
        !this.disabled && e.code === "Enter" && this.hbrClose.emit();
    }
    handleTabActive() {
        this.active && this.hbrActive.emit({ tab: this.host });
        this.setNestedButtonTriggerTabindex();
    }
    setNestedValue() {
        var _a;
        if (this.nested) {
            const slot = (_a = this.tab) === null || _a === void 0 ? void 0 : _a.querySelector("slot:not([name='prefix']):not([name='suffix'])");
            if (!slot)
                return;
            const element = Array.from(slot.assignedElements({ flatten: true })).filter((e) => e.tagName.toLocaleLowerCase() === "hbr-dropdown");
            if (element.length) {
                const dropdown = element[0];
                if (dropdown && !this.active)
                    dropdown.value = this.active ? "selected" : "";
            }
        }
    }
    handleSlotChange() {
        this.hasMenu = hasSlot(this.host, "menu");
    }
    renderDefaultSlot(variant) {
        if (["tab", "nested"].includes(variant) && this.vertical) {
            return (h("span", { class: "tab__default-slot" }, h("slot", null)));
        }
        return h("slot", null);
    }
    render() {
        var _a, _b;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        let props = {};
        if (this.popOver) {
            props = {
                "aria-haspopup": this.popOver ? "true" : "false",
                "aria-expanded": this.popOver && this.hover ? "true" : "false",
            };
        }
        const tabIndex = this.getTabindex();
        const parent = this.host.closest("hbr-tab-vertical");
        const variant = (parent === null || parent === void 0 ? void 0 : parent.variant) ? parent.variant : "";
        if (parent && variant === "nested") {
            parent.getTabs().then((tabs) => {
                if (tabs.includes(this.host)) {
                    if (this.active) {
                        this.host.setAttribute("aria-current", "true");
                    }
                    else {
                        this.host.removeAttribute("aria-current");
                    }
                }
                this.host.setAttribute("role", "treeitem");
            });
        }
        return (
        // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
        h(Host, Object.assign({ key: '17c9f5e76371bf162b256a4c0c14d659e6272b79', id: this.host.id || this.componentId, onClick: (e) => {
                if (this.nested)
                    e.stopPropagation();
            } }, (((_b = this.aria) === null || _b === void 0 ? void 0 : _b.role) === "none" //stepper
            ? undefined
            : {
                role: this.ariarole || this.nav ? "menuitem" : "tab",
                "aria-selected": this.active ? "true" : "false",
                "aria-disabled": this.disabled ? "true" : "false",
                "aria-haspopup": this.nav && this.popOver ? "true" : false,
                "aria-expanded": this.nav && this.popOver ? (this.hover ? "true" : false) : null,
            })), h("div", Object.assign({ key: '865dea6757a1a340c082d6ef411a636be186726b', part: "base", ref: (el) => {
                this.tab = el;
            }, class: {
                tab: true,
                // variants
                "tab--horizontal": !this.vertical && !this.nav,
                "tab--vertical": this.vertical,
                "tab--nav": this.nav,
                "tab--nested": this.nested,
                "tab--popover": this.popOver,
                "tab--closable": this.closable,
                "tab--focusevent": this.focusEvent,
                // states
                "tab--active": this.active || this.hover,
                "tab--disabled": this.disabled,
                "tab--hover": this.hover,
                "tab--collapsed": this.collapsed,
                "tab--variant-tab": variant === "tab",
                "tab--variant-nested": variant === "nested",
            }, "aria-hidden": this.ariahidden, onClick: this.handleBaseClick, onKeyDown: this.handleKeyDown, tabindex: this.getTabindex() }, props), h("span", { key: 'aff9b8b38d2bbf78e3f7eb6d9c56bb40ddbc2d77', part: "prefix", class: "tab__prefix" }, h("slot", { key: '34e6d1933af37f6f07b0767de941b82e73634ded', name: "prefix" })), this.renderDefaultSlot(variant), h("span", { key: '7deaf0e60909094f77aee0a2eb3859f24468fd3e', part: "label", class: "tab__label" }, h("slot", { key: '32b38cc1e33d4cf4082cb2fb0f97e7e253805d49', name: "label" })), h("span", { key: '640154355cf244cad1674c73e1f9e47741a0127e', part: "suffix", class: "tab__suffix" }, h("slot", { key: '1dc8f29dead3c3433263f425c87e9dc19bbb0662', name: "suffix" })), this.closable && (h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, arialabel: "remove", exportparts: "base:close-button", class: "tab__close-button", onClick: this.handleCloseClick, onKeyDown: this.handleCloseIconOnKeyDown, tabindex: tabIndex })), !this.nav && !this.nested && (h("span", { part: "indicator", class: "tab__indicator" }))), h("div", { key: '4b2c69bf3e24ee8d6129718e43d1da3a0d408983', part: "menu", class: {
                "tab--menu-horizontal": !this.vertical && !this.nav,
                "tab--menu": true,
                "tab--menu-nested": this.nested,
                "tab--menu-active": this.active,
                "tab--menu-disabled": this.disabled,
            } }, h("slot", { key: '1fd0e318dea42260de5a2613755e0a6710ee827b', name: "menu", onSlotchange: this.handleSlotChange }), this.nested && (h("span", { part: "menu-indicator", class: "tab--menu__indicator" })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "active": ["handleTabActive", "setNestedValue"]
    }; }
    static get style() { return HbrTabStyle0; }
}, [1, "hbr-tab", {
        "name": [513],
        "panel": [513],
        "active": [516],
        "closable": [516],
        "popOver": [4, "pop-over"],
        "hover": [516],
        "nav": [516],
        "disabled": [516],
        "vertical": [1540],
        "nested": [1540],
        "collapsed": [1540],
        "focusEvent": [516, "focus-event"],
        "arialabelledby": [1537],
        "ariahidden": [1544],
        "ariarole": [513],
        "sentiment": [520],
        "aria": [16],
        "hasMenu": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "setTabindex": [64]
    }, undefined, {
        "active": ["handleTabActive", "setNestedValue"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab", "hbr-icon", "hbr-icon-button"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Tab);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Tab as T, defineCustomElement as d };

