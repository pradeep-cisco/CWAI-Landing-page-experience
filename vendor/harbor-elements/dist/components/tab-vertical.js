import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { J as nav, B as remove } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './icon-button.js';
import { d as defineCustomElement$1 } from './panel.js';

const tabVerticalCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--color-sentiment-text-hover:var(--base-text-default)}:host:not([sentiment=interact]){--color-sentiment-indicator-hover:var(--brand-accent-border-hover)}:host([sentiment=interact]){--color-sentiment-indicator:var(--interact-border-medium-active);--color-sentiment-indicator-hover:var(--interact-border-medium-hover);--color-sentiment-text:var(--interact-text-weak-active)}:host([primary]){--color-sentiment-indicator:var(--brand-accent-border-active);--color-sentiment-indicator-hover:var(--brand-accent-border-hover);--color-sentiment-text:var(--base-text-medium-default)}:host([sentiment=success]):not([primary]){--color-sentiment-indicator:var(--positive-border-active);--color-sentiment-indicator-hover:var(--positive-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=danger]),:host([sentiment=negative]){--color-sentiment-indicator:var(--negative-border-medium-active);--color-sentiment-indicator-hover:var(--negative-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=warning]){--color-sentiment-indicator:var(--warning-border-active);--color-sentiment-indicator-hover:var(--warning-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host{display:block;--padding:12px 0px;--min-width:250px;--tab-padding:12px 13px 12px 40px;--close-button-padding:12px 13px 12px 30px;--sentiment-color:var(--control-icon-default);--indicator-size:3px;--splitter-width:1px;--splitter-color:var(--control-border-weak-default);--height:100%;--hbr-border-width:1px;--max-height:100%}:host(:not([navigation])){--resizer-width:1px}:host([variant=nested]),:host([variant=tab]){--tab-padding:8px 12px 8px 0px}:host([variant=nested]) .tab-vertical__tabs,:host([variant=tab]) .tab-vertical__tabs{gap:8px}:host([collapsed]){--min-width:0}.tab-vertical{display:flex;flex-direction:row;border:solid var(--hbr-border-width) transparent;border-radius:0;height:var(--height)}.tab-vertical.tab-vertical--collapsed{border-right:var(--splitter-width) solid var(--splitter-color)}@media only screen and (min-width: 23.5em){.tab-vertical>hbr-icon-button.tab-vertical__menu-icon{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.tab-vertical>hbr-icon-button.tab-vertical__menu-icon.tab-vertical__menu-icon-no-responsive{display:none}.tab-vertical hbr-icon-button.tab-vertical__close-icon{padding:var(--close-button-padding)}@media only screen and (min-width: 23.5em){.tab-vertical hbr-icon-button.tab-vertical__close-icon{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.tab-vertical hbr-icon-button.tab-vertical__close-icon.tab-vertical__close-icon-no-responsive{display:none}.tab-vertical .tab-vertical__tabs{display:flex;position:relative;flex-direction:column;min-width:var(--min-width)}.tab-vertical .tab-vertical__tabs-nav{gap:8px;width:256px}.tab-vertical .tab-vertical__tabs-nav--collapsed{width:50px}.tab-vertical .tab-vertical__nav-container{padding:var(--padding)}@media only screen and (max-width: 23.4375em){.tab-vertical .tab-vertical__nav-container:not(.tab-vertical__nav-container-no-responsive){position:fixed;z-index:var(--hbr-z-index-drawer);top:0;left:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;background-color:var(--base-bg-default) !important;-moz-transition:all 0.5s ease-in-out;-webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out}}@media only screen and (max-width: 23.4375em) and (max-width: 23.4375em){.tab-vertical .tab-vertical__nav-container:not(.tab-vertical__nav-container-no-responsive):not(.tab-visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.tab-vertical:not(.focus-visible) ::slotted(hbr-tab){--focus-ring:none}.tab-vertical{--slot-sentiment-color:var(--sentiment-color)}.tab-vertical ::slotted(hbr-menu-divider){--margin:20px 0px}.tab-vertical ::slotted(hbr-tab){--padding:var(--tab-padding);--width:100%;width:100%;--active-background-color:none;--border-radius:none;--color:var(--base-text-default);--sentiment-color:var(--slot-sentiment-color)}.tab-vertical ::slotted(.hbr-tab-header){padding:12px 40px;margin:0px}.tab-vertical ::slotted(hbr-tab-fold){--sentiment-color:var(--slot-sentiment-color)}.tab-vertical .tab-vertical__body{flex:1 1 auto;order:2;overflow-x:auto}.tab-vertical .tab-vertical__resizer{width:var(--hbr-border-width);background:var(--control-border-weak-default)}.tab-vertical .tab-vertical__resizer-border{background:var(--control-border-weak-default)}.tab-vertical .tab-vertical__prefix,.tab-vertical .tab-vertical__suffix{width:100%}.tab-vertical__top{padding:12px 12px 12px 0px}.tab-vertical--resizable .tab-vertical__nav{overflow:auto;max-height:var(--max-height)}hbr-panel{--overflow:visible}:host([variant=nested]) .tab-vertical__body{margin-left:16px}";
const HbrTabVerticalStyle0 = tabVerticalCss;

const TabVertical = /*@__PURE__*/ proxyCustomElement(class TabVertical extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTabShow = createEvent(this, "hbr-tab-show", 7);
        this.hbrTabHide = createEvent(this, "hbr-tab-hide", 7);
        this.sheet = new CSSStyleSheet();
        this.handleTopSlotChange = (event) => {
            const slot = event.target;
            this.hasTopSlot = slot.assignedNodes({ flatten: true }).length > 0;
        };
        this.isTab = () => {
            return ["tab", "nested"].includes(this.variant);
        };
        this._getTabs = () => {
            return Array.from(this.host.querySelectorAll("hbr-tab:not(hbr-tab-panel hbr-tab)"));
        };
        this._getTabFolds = () => {
            return Array.from(this.host.querySelectorAll("hbr-tab-fold:not(hbr-tab-panel hbr-tab-fold)"));
        };
        this.handleSlotChange = () => {
            const tabs = this._getTabs();
            const tabFolds = this._getTabFolds();
            tabs.forEach((tab) => {
                tab.vertical = true;
                if (this.variant === "nested") {
                    tab.aria = { role: "treeitem" };
                }
            });
            if (this.variant === "nested") {
                tabFolds.forEach((tabFold) => {
                    tabFold.setAttribute("role", "treeitem");
                });
            }
            const divider = this.host.querySelector("hbr-divider:not(hbr-tab-panel hbr-divider)");
            if (divider) {
                divider.setAttribute("aria-hidden", "true");
            }
        };
        this.handleContentSlotChange = () => {
            if (!["tab", "nested"].includes(this.variant))
                return;
            const panels = Array.from(this.host.querySelectorAll(':scope > hbr-tab-panel[slot="content"]'));
            panels.forEach((panel) => {
                panel.ariarole = false;
            });
        };
        this.conditionalPanel = (children) => {
            if (this.collapsable || this.resizable) {
                return (h("hbr-panel", { part: "panel", collapsable: this.collapsable, resizable: this.resizable, collapsed: this.collapsed, size: this.width, minSize: this.minWidth, maxSize: this.maxWidth, "onHbr-panel-resizing": (e) => {
                        this.host.style.setProperty("--min-width", `${e.detail.size}px`);
                    } }, children));
            }
            return children;
        };
        this.collapsable = false;
        this.resizable = false;
        this.width = 250;
        this.minWidth = 120;
        this.maxWidth = 360;
        this.isVisible = false;
        this.hasTopSlot = false;
        this.navigation = false;
        this.variant = "";
        this.sentiment = "interact";
        this.border = false;
        this.uncontrolled = false;
        this.responsive = false;
        this.ariarole = undefined;
        this.arialabel = false;
        this.collapsed = false;
        this.aria = undefined;
    }
    menuItemListener(e) {
        const target = e.target;
        const popover = target.closest("hbr-tab-popover");
        if (popover instanceof HTMLElement) {
            const tab = popover.shadowRoot.querySelector("hbr-tab");
            if (tab) {
                this.setActiveTab(tab);
            }
        }
    }
    connectedCallback() {
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.getAllTabs = this.getAllTabs.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this);
        this.getAllTabFold = this.getAllTabFold.bind(this);
        this.handleClickIcon = this.handleClickIcon.bind(this);
    }
    componentDidLoad() {
        this.syncCollapsedOfTabs();
        // Set initial tab state when the tabs first become visible
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].intersectionRatio > 0) {
                this.setAriaLabels();
                if (!this.navigation) {
                    if (!this.uncontrolled) {
                        this.setActiveTab(this.getActiveTab() || this.getAllTabs()[0], false);
                    }
                }
                observer.unobserve(entries[0].target);
            }
        });
        observer.observe(this.host);
        focusVisible.observe(this.tabVertical);
        // Update aria labels if the DOM changes
        this.mutationObserver = new MutationObserver((mutations) => {
            if (mutations.some((mutation) => {
                return !["aria-labelledby", "aria-controls"].includes(mutation.attributeName);
            })) {
                setTimeout(() => this.setAriaLabels());
            }
        });
        this.mutationObserver.observe(this.host, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }
    disconnectedCallback() {
        var _a, _b;
        (_a = this.mutationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        focusVisible.unobserve(this.tabVertical);
        (_b = this.resizeObserver) === null || _b === void 0 ? void 0 : _b.unobserve(this.navEle);
    }
    /** Shows the specified tab panel. */
    async show(panel) {
        const tabs = this.getAllTabs();
        const tab = tabs.find((el) => el.panel === panel);
        if (tab) {
            this.setActiveTab(tab);
        }
    }
    syncCollapsedOfTabs() {
        if (this.collapsable)
            return;
        this.host.querySelectorAll("hbr-tab").forEach((tab) => {
            tab.collapsed = this.collapsed;
        });
    }
    getAllTabs(includeDisabled = false, ele, isAll = true) {
        var _a;
        let slot = ele;
        if (!ele)
            slot = (_a = this.tabs) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!slot)
            return [];
        const slotList = [...slot.assignedElements({ flatten: true })];
        const tabList = slotList.reduce((acc, cur) => {
            var _a;
            if (cur.tagName.toLowerCase() === "hbr-tab" && !cur.disabled)
                acc.push(cur);
            if (cur.tagName.toLowerCase() === "hbr-tab-fold" && !cur.disabled) {
                acc.push(cur);
                if (cur.open || isAll) {
                    const slot = (_a = cur === null || cur === void 0 ? void 0 : cur.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot:not([name='label'])");
                    if (slot)
                        acc.push(...this.getAllTabs(includeDisabled, slot));
                }
            }
            if (cur.tagName.toLowerCase() === "hbr-tab-popover") {
                const tab = cur === null || cur === void 0 ? void 0 : cur.shadowRoot.querySelector("hbr-tab");
                if (tab) {
                    acc.push(tab);
                }
            }
            return acc;
        }, []);
        return tabList;
    }
    getAllPanels() {
        var _a;
        const slot = (_a = this.body) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!slot)
            return [];
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-panel");
    }
    getAllTabFold() {
        var _a;
        const slot = (_a = this.tabs) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!slot)
            return [];
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-fold");
    }
    getActiveTab() {
        return this.getAllTabs().find((el) => el.active);
    }
    handleClick(event) {
        if (this.uncontrolled)
            return;
        const target = event.target;
        const tab = target.closest("hbr-tab");
        const tabVertical = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-vertical");
        // Ensure the target tab is in this tab group
        if (tabVertical !== this.host) {
            return false;
        }
        if (tab) {
            this.setActiveTab(tab);
        }
        this.isVisible = !this.isVisible;
    }
    handleClickIcon() {
        this.isVisible = !this.isVisible;
    }
    getOrientation() {
        return this.host.getAttribute("aria-orientation") === "horizontal"
            ? "horizontal"
            : "vertical";
    }
    handleKeyDown(event) {
        if (this.uncontrolled)
            return;
        const target = event.target;
        const tab = target.closest("hbr-tab");
        const tabFold = target.closest("hbr-tab-fold");
        let tabVertical = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-vertical");
        if (tabFold) {
            tabVertical = tabFold === null || tabFold === void 0 ? void 0 : tabFold.closest("hbr-tab-vertical");
        }
        // Ensure the target tab is in this tab group
        if (tabVertical !== this.host) {
            return false;
        }
        // Activate a tab
        if (["Enter", " "].includes(event.key)) {
            if (tab) {
                if (this.uncontrolled)
                    return;
                this.setActiveTab(tab);
                event.preventDefault();
                this.isVisible = false;
            }
        }
        const orientation = this.getOrientation();
        const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
        const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
        // Move focus across tabs based on orientation
        if ([prevKey, nextKey, "Home", "End"].includes(event.key)) {
            const activeEl = document.activeElement;
            if (!activeEl)
                return;
            const isTab = activeEl.closest("hbr-tab") || activeEl.closest("hbr-tab-fold");
            if (isTab) {
                const tabs = this.getAllTabs(false, false, false);
                let index = tabs.indexOf(isTab);
                if (event.key === "Home") {
                    index = 0;
                }
                else if (event.key === "End") {
                    index = tabs.length - 1;
                }
                else if (event.key === prevKey) {
                    index = Math.max(0, index - 1);
                }
                else if (event.key === nextKey) {
                    index = Math.min(tabs.length - 1, index + 1);
                }
                const tab = tabs[index];
                tab.setFocus({ preventScroll: true });
                event.preventDefault();
            }
        }
    }
    setActiveTab(tab, emitEvents = true) {
        const isNestedTab = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-panel");
        if (isNestedTab && this.host.contains(isNestedTab))
            return;
        if (tab && tab !== this.activeTab && !tab.disabled) {
            const previousTab = this.activeTab;
            this.activeTab = tab;
            // Sync tabs and panels
            this.getAllTabs().map((el) => {
                el.active = el === this.activeTab;
            });
            this.getAllTabFold().forEach((el) => {
                if (el.contains(tab) && !el.open)
                    el.active = true;
                else
                    el.active = false;
            });
            this.getAllPanels().map((el) => {
                el.active = el.name === this.activeTab.panel;
            });
            // Emit events
            if (emitEvents) {
                if (previousTab) {
                    this.hbrTabHide.emit({ name: previousTab.panel });
                }
                this.hbrTabShow.emit({ name: this.activeTab.panel });
            }
        }
    }
    setAriaLabels() {
        if (this.variant === "nested")
            return;
        const tabs = this.getAllTabs();
        const panels = this.getAllPanels();
        // Link each tab with its corresponding panel
        tabs.map((tab) => {
            const panel = panels.find((el) => el.name === tab.panel);
            if (panel) {
                const tabId = tab.getAttribute("id");
                const panelId = panel.getAttribute("id");
                panelId && tab.setAttribute("aria-controls", panelId);
                tabId && panel.setAttribute("aria-labelledby", tabId);
            }
        });
    }
    async getTabs() {
        return this._getTabs();
    }
    async getTabFolds() {
        return this._getTabFolds();
    }
    render() {
        var _a, _b;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: '584ee5c8a4694167acdae90a058e74a42e8b6f3b' }, h("div", { key: 'e979a69c18e54404ef572157de814c1f2264cc38', part: "base", ref: (el) => {
                this.tabVertical = el;
            }, class: {
                "tab-vertical": true,
                "tab-vertical--collapsed": !this.collapsable && this.collapsed,
                "tab-vertical--resizable": this.resizable,
            } }, h("hbr-icon-button", { key: '18873691b9940c0c86f064374c1badf726bb2b07', class: {
                "tab-vertical__menu-icon": true,
                "tab-vertical__menu-icon-no-responsive": !this.responsive,
            }, onClick: this.handleClickIcon, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.nav) || nav, arialabel: "Open menu" }), this.conditionalPanel(h("div", { class: {
                "tab-vertical__nav-container": !this.isTab(),
                "tab-visible": this.isVisible,
                "tab-vertical__nav-container-no-responsive": !this.responsive,
            }, part: "nav-container" }, h("div", { class: { "tab-vertical__top": this.hasTopSlot } }, h("slot", { name: "top", onSlotchange: this.handleTopSlotChange })), h("hbr-icon-button", { class: {
                "tab-vertical__close-icon": true,
                "tab-vertical__close-icon-no-responsive": !this.responsive,
            }, onClick: this.handleClickIcon, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, arialabel: "Close menu" }), h("div", { part: "prefix", class: "tab-vertical__prefix" }, h("slot", { name: "prefix" })), h("div", { ref: (el) => {
                this.navEle = el;
            }, key: "nav", part: "nav", class: "tab-vertical__nav" }, h("div", Object.assign({ ref: (el) => {
                this.tabs = el;
            }, part: "tabs", class: {
                "tab-vertical__tabs": true,
                "tab-vertical__tabs-nav": this.navigation,
            } }, (((_b = this.aria) === null || _b === void 0 ? void 0 : _b.role) === "none" //stepper
            ? undefined
            : {
                role: this.variant === "nested"
                    ? "tree"
                    : this.ariarole || this.navigation
                        ? "menubar"
                        : "tablist",
                "aria-orientation": "vertical",
            }), { "aria-label": this.arialabel, onClick: this.handleClick, onKeyDown: this.handleKeyDown }), h("slot", { onSlotchange: this.handleSlotChange }))), h("div", { part: "suffix", class: "tab-vertical__suffix" }, h("slot", { name: "suffix" })))), !this.resizable && !this.collapsable && (h("span", { part: "border", class: {
                "tab-vertical__resizer": true,
                "tab-vertical__resizer-border": this.border,
            } })), h("div", { key: '26c46254d237f2b1b3791ffb5762fd361e832437', ref: (el) => {
                this.body = el;
            }, part: "body", class: "tab-vertical__body" }, h("slot", { key: '6c200e0fec3dc8b6bfe173dd8b3e2015b78f671c', name: "content", onSlotchange: this.handleContentSlotChange })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "collapsed": ["syncCollapsedOfTabs"]
    }; }
    static get style() { return HbrTabVerticalStyle0; }
}, [1, "hbr-tab-vertical", {
        "collapsable": [516],
        "resizable": [516],
        "width": [1538],
        "minWidth": [2, "min-width"],
        "maxWidth": [2, "max-width"],
        "navigation": [516],
        "variant": [513],
        "sentiment": [1537],
        "border": [516],
        "uncontrolled": [4],
        "responsive": [516],
        "ariarole": [513],
        "arialabel": [520],
        "collapsed": [1540],
        "aria": [16],
        "isVisible": [32],
        "hasTopSlot": [32],
        "show": [64],
        "getTabs": [64],
        "getTabFolds": [64]
    }, [[0, "hbr-select", "menuItemListener"]], {
        "collapsed": ["syncCollapsedOfTabs"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-vertical", "hbr-icon", "hbr-icon-button", "hbr-panel"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-vertical":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabVertical);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-panel":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { TabVertical as T, defineCustomElement as d };

