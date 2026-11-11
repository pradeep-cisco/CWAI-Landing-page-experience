import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a as caretRight } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$4 } from './button.js';
import { d as defineCustomElement$2 } from './spinner.js';

const tabFoldCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--color-sentiment-text-hover:var(--base-text-default)}:host:not([sentiment=interact]){--color-sentiment-indicator-hover:var(--brand-accent-border-hover)}:host([sentiment=interact]){--color-sentiment-indicator:var(--interact-border-medium-active);--color-sentiment-indicator-hover:var(--interact-border-medium-hover);--color-sentiment-text:var(--interact-text-weak-active)}:host([primary]){--color-sentiment-indicator:var(--brand-accent-border-active);--color-sentiment-indicator-hover:var(--brand-accent-border-hover);--color-sentiment-text:var(--base-text-medium-default)}:host([sentiment=success]):not([primary]){--color-sentiment-indicator:var(--positive-border-active);--color-sentiment-indicator-hover:var(--positive-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=danger]),:host([sentiment=negative]){--color-sentiment-indicator:var(--negative-border-medium-active);--color-sentiment-indicator-hover:var(--negative-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=warning]){--color-sentiment-indicator:var(--warning-border-active);--color-sentiment-indicator-hover:var(--warning-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host{--focus-ring:inset 0 0 0 var(--hbr-focus-ring-width) var(--interact-border-medium-hover);--padding:0px;--padding-label:12px 12px 12px 40px;--color:var(--interact-text-weak-default);--indicator-left:unset;--indicator-right:0;display:inline-block;--hover-color:var(--color-sentiment-text);--active-color:var(--color-sentiment-text);--focus-color:var(--color-sentiment-text);--indicator-color:var(--color-sentiment-indicator);--indicator-hover-color:var(--color-sentiment-indicator-hover);--open-color:var(--interact-text-weak-default, #656C75);--font-weight-active:var(--hbr-font-weight-semibold);--font-weight:var(--hbr-font-weight-semibold);--disabled-color:var(--interact-text-weak-disabled);--tabs-gap:var(--hbr-spacing-2xs);--tabs-padding:0px}:host([static]){--padding-label:8px 5px 8px 0px}.tab-fold ::slotted(hbr-tab){width:100%;--width:100%;--active-background-color:none;--color:var(--interact-text-weak-default);--border-radius:none;--padding:12px 52px;--focus-outline-offset:-2px}.tab-fold:not(.focus-visible),.tab-fold:not(.focus-visible) ::slotted(hbr-tab){--focus-ring:none}.tab-fold{display:flex;flex-direction:column;color:var(--color);padding:var(--padding);white-space:nowrap;font-size:var(--hbr-font-size-sm);font-weight:var(--font-weight);position:relative}.tab-fold.tab-fold--active:not(.tab-fold--disabled){color:var(--active-color)}.tab-fold.tab-fold--disabled{cursor:not-allowed}.tab-fold.tab-fold--disabled:hover{cursor:not-allowed}.tab-fold.tab-fold--disabled span{color:var(--disabled-color)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:hover{cursor:pointer;color:var(--hover-color)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:focus{outline:none}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:focus-within{color:var(--focus-color)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:hover{color:var(--hover-color)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:hover .tab-fold__arrow-right{color:var(--hover-color)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:hover .tab-fold__arrow-right hbr-button{--bg-color:var(--bg-color-hover)}.tab-fold:not(.tab-fold--disabled):not(.tab-fold--static) .tab-fold--label:hover .tab-fold__arrow-right hbr-button hbr-icon{color:var(--interact-icon-weak-hover)}.tab-fold:not(.tab-fold--static) .tab-fold--label{display:flex;justify-content:space-between;flex-direction:row;align-items:center;font-weight:var(--hbr-font-weight-semibold);line-height:20px}.tab-fold .tab-fold--tabs{padding:var(--tabs-padding);flex-direction:column;gap:var(--tabs-gap);transition:var(--hbr-transition-medium) max-height ease;display:none;height:fit-content}.tab-fold .tab-fold__arrow-right{display:flex;align-items:center;justify-content:center;transform-origin:center;transform:rotate(0deg);transition:var(--hbr-transition-fast) transform ease}.tab-fold .tab-fold__arrow-right hbr-button{--hbr-control-height-xs:16px;--label-color:var(--interact-icon-weak-default);--hbr-control-height-sm:24px}.tab-fold .tab-fold__arrow-right hbr-button[disabled]{--label-color:var(--interact-icon-weak-disabled)}.tab-fold .tab-fold__arrow-right hbr-button hbr-icon{font-size:14px}.tab-fold .tab-fold__arrow-right hbr-button:focus-within{background:var(--interact-bg-weak-focus, #CCE1FF)}.tab-fold .tab-fold--label{padding:var(--padding-label);line-height:20px;font-weight:var(--font-weight-active)}.tab-fold.tab-fold--active .tab-fold--label span{color:var(--active-color);font-weight:var(--font-weight-active)}.tab-fold.tab-fold--active .tab-fold__arrow-right{color:var(--active-color)}.tab-fold.tab-fold--open .tab-fold--tabs{display:flex}.tab-fold.tab-fold--open:not(.tab-fold--disabled) .tab-fold--label span{color:var(--open-color)}.tab-fold.tab-fold--open .tab-fold--label span{font-weight:var(--font-weight-active)}.tab-fold.tab-fold--open:not(.tab-fold--static):not(.tab-fold--disabled):focus-within .tab-fold--label span{color:var(--focus-color)}.tab-fold.tab-fold--open .tab-fold__arrow-right{transform:rotate(90deg)}.tab-fold__vertical-indicator{width:var(--indicator-size);height:100%;border-radius:8px;background:var(--indicator-color);position:absolute;top:0px;left:var(--indicator-left);right:var(--indicator-right)}.tab-fold--label:has(hbr-button:focus){outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:2px;border-radius:2px}.tab-fold--label hbr-button[data-focused]{--hbr-focus-outline:none;--hbr-focus-ring:none;--focus-outline-offset:none}";
const HbrTabFoldStyle0 = tabFoldCss;

let id = 0;
const TabFold = /*@__PURE__*/ proxyCustomElement(class TabFold extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrOpen = createEvent(this, "hbr-open", 7);
        this.sheet = new CSSStyleSheet();
        this.componentId = `tab-fold-${++id}`;
        this.handleOpen = () => {
            if (this.static)
                return;
            if (this.disabled)
                return;
            if (this.foldTabs) {
                this.open = !this.open;
                if (this.open) {
                    this.active = false;
                }
                else {
                    this.active = this.hasNestedTabActive(this.foldTabs);
                }
                this.setNestedTabindex();
                this.hbrOpen.emit({ open: this.open, fold: this.host });
            }
        };
        this.onKeyDownMenu = (event) => {
            const target = event.target;
            if (this.static) {
                const tabVertical = this.host.closest("hbr-tab-vertical[variant='nested']");
                if (tabVertical) {
                    const tabs = Array.from(tabVertical.querySelectorAll(':scope > hbr-tab:not([disabled]):not([slot="content"]), :scope > :not([slot="content"]) hbr-tab:not([disabled])'));
                    let index = tabs.indexOf(target);
                    if (!tabs.length)
                        return;
                    if (event.key === "ArrowUp") {
                        event.stopPropagation();
                        index = Math.max(0, index - 1);
                        const tab = tabs[index];
                        tab === null || tab === void 0 ? void 0 : tab.setFocus({ preventScroll: true });
                        event.preventDefault();
                    }
                    else if (event.key === "ArrowDown") {
                        event.stopPropagation();
                        index = Math.min(tabs.length - 1, index + 1);
                        const tab = tabs[index];
                        tab === null || tab === void 0 ? void 0 : tab.setFocus({ preventScroll: true });
                        event.preventDefault();
                    }
                }
                return;
            }
            if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                event.stopPropagation();
                const tabs = Array.from(this.host.querySelectorAll("hbr-tab:not([disabled])"));
                let index = tabs.indexOf(target);
                if (!tabs.length)
                    return;
                if (event.key === "ArrowUp") {
                    index = Math.max(0, index - 1);
                }
                else if (event.key === "ArrowDown") {
                    index = Math.min(tabs.length - 1, index + 1);
                }
                const tab = tabs[index];
                tab === null || tab === void 0 ? void 0 : tab.setFocus({ preventScroll: true });
                event.preventDefault();
            }
            else if (event.key === "Escape") {
                this.handleOpen();
                this.setFocus();
            }
        };
        this.onKeyDown = (event) => {
            if (["Enter", " ", "Space"].includes(event.key)) {
                event.preventDefault();
                this.handleOpen();
            }
            else if (event.key === "ArrowDown") {
                if (this.open) {
                    event.stopPropagation();
                    const tabs = Array.from(this.host.querySelectorAll("hbr-tab:not([disabled])"));
                    tabs.length && tabs[0].setFocus({ preventScroll: true });
                }
            }
        };
        this.getAllTabs = (ele) => {
            const slot = ele === null || ele === void 0 ? void 0 : ele.querySelector("slot");
            if (!slot)
                return [];
            return [...slot.assignedElements()].filter((ele) => ele.tagName.toLowerCase() === "hbr-tab");
        };
        this.setNestedTabindex = () => {
            const list = this.getAllTabs(this.foldTabs);
            return list.forEach((tab) => {
                tab.setTabindex();
            });
        };
        this.hasNestedTabActive = (ele) => {
            const list = this.getAllTabs(ele);
            return list.some((tab) => tab === null || tab === void 0 ? void 0 : tab.active);
        };
        this.panel = "";
        this.active = false;
        this.noRightArrow = false;
        this.open = false;
        this.disabled = false;
        this.sentiment = undefined;
        this.arialabelledby = "";
        this.menuArialabelledby = "";
        this.ariarole = "";
        this.static = false;
    }
    connectedCallback() {
        this.handleActiveState = this.handleActiveState.bind(this);
    }
    /** Sets focus to the tab. */
    async setFocus(options) {
        var _a;
        (_a = this.tabFoldLabel) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the tab. */
    async removeFocus() {
        var _a;
        (_a = this.tabFoldLabel) === null || _a === void 0 ? void 0 : _a.blur();
    }
    watchStatic() {
        this.open = true;
    }
    componentWillLoad() {
        if (this.static) {
            this.open = true;
        }
    }
    componentDidLoad() {
        this.handleActiveState();
        this.setNestedTabindex();
        focusVisible.observe(this.tabFold);
    }
    disconnectedCallback() {
        focusVisible.unobserve(this.tabFold);
    }
    handleActiveState() {
        if (this.foldTabs && !this.open) {
            this.active = this.hasNestedTabActive(this.foldTabs);
        }
    }
    render() {
        var _a;
        let isNested = false;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        let props = {};
        if (!this.static) {
            props = {
                tabindex: this.disabled ? "-1" : this.active ? "0" : "-1",
                onClick: this.handleOpen,
                onKeyDown: this.onKeyDown,
                onFocus: (e) => {
                    var _a;
                    const ele = e.currentTarget;
                    (_a = ele.querySelector("hbr-button")) === null || _a === void 0 ? void 0 : _a.setFocus();
                },
            };
            const parent = this.host.closest("hbr-tab-vertical");
            if (parent && parent.variant !== "nested") {
                props = Object.assign(Object.assign({}, props), { role: this.ariarole || "tab", "aria-haspopup": "menu", "aria-disabled": this.disabled ? "true" : "false" });
            }
            isNested = parent && parent.variant === "nested" ? true : false;
            if (isNested) {
                parent.getTabFolds().then((folds) => {
                    if (folds.includes(this.host)) {
                        this.host.setAttribute("aria-expanded", this.open ? "true" : "false");
                    }
                });
            }
        }
        return (
        // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
        h(Host, { key: '5668ae0f78483ef833b05951228a654e74f61e83', id: this.host.id || this.componentId }, h("div", { key: '2edd9d497ecea84c56fb7b23039799edbb31a9c2', part: "base", ref: (el) => {
                this.tabFold = el;
            }, class: {
                "tab-fold": true,
                // States
                "tab-fold--active": this.active,
                "tab-fold--open": this.open,
                "tab-fold--disabled": this.disabled,
                "tab-fold--static": this.static,
            } }, this.active && !this.open && (h("span", { part: "indicator", class: "tab-fold__vertical-indicator" })), h("div", Object.assign({ key: '2f777d3e1b3d8b9dd7e4785e1725a7e47573d1e1', part: "label", class: "tab-fold--label", ref: (ref) => {
                this.tabFoldLabel = ref;
            } }, props), h("span", { key: 'd6183d0ace10079211e40aaaa6d831466b207782' }, h("slot", { key: 'c07ebdef8178620ddf57ba0ec5ee0bf5222ad221', name: "label" })), this.static || this.noRightArrow ? null : (h("div", { class: "tab-fold__arrow-right" }, h("hbr-button", { "data-testid": "tab-fold-button", variant: "text", size: "small", disabled: this.disabled, aria: { label: this.open ? "Collapse" : "Expand" } }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight, exportparts: "base:open-button" }))))), h("div", { key: 'acaad96f6859a7fd47d19ea8ece3dacbe9f49c4b', part: "tabs", class: "tab-fold--tabs", "aria-hidden": this.open ? "false" : "true", role: isNested ? "group" : "menu", onKeyDown: this.onKeyDownMenu, ref: (r) => {
                this.foldTabs = r;
            } }, h("slot", { key: '3f27e0c4be8bcc28508fa3c78683cdd2926f49b5' })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "static": ["watchStatic"]
    }; }
    static get style() { return HbrTabFoldStyle0; }
}, [1, "hbr-tab-fold", {
        "panel": [513],
        "active": [1540],
        "noRightArrow": [1540, "no-right-arrow"],
        "open": [1540],
        "disabled": [516],
        "sentiment": [1544],
        "arialabelledby": [1537],
        "menuArialabelledby": [1537, "menu-arialabelledby"],
        "ariarole": [513],
        "static": [516],
        "setFocus": [64],
        "removeFocus": [64]
    }, undefined, {
        "static": ["watchStatic"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-fold", "hbr-button", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-fold":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabFold);
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

const HbrTabFold = TabFold;
const defineCustomElement = defineCustomElement$1;

export { HbrTabFold, defineCustomElement };

