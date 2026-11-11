import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { B as remove } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { c as color } from './token.js';
import { d as defineCustomElement$2 } from './icon-button.js';

const tabNavCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--padding:12px 0px;--min-width:250px;--tab-padding:12px 13px 12px 40px;--close-button-padding:12px 13px 12px 30px;--sentiment-color:var(--interact-border-default)}.tab-nav{display:flex;flex-direction:column;border:solid var(--hbr-border-width) transparent;border-radius:0}.tab-nav--collapsed{width:52px}.tab-nav>hbr-icon-button.tab-nav__menu-icon{padding-left:var(--hbr-spacing-xs)}.tab-nav hbr-icon-button.tab-nav__close-icon{padding:var(--close-button-padding)}@media only screen and (min-width: 23.5em){.tab-nav hbr-icon-button.tab-nav__close-icon{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.tab-nav hbr-icon-button.tab-nav__close-icon.tab-nav__close-icon-no-responsive{display:none}.tab-nav .tab-nav__tabs{display:flex;position:relative;flex-direction:column;min-width:var(--min-width)}.tab-nav .tab-nav__tabs-nav{gap:8px;width:256px}.tab-nav .tab-nav__tabs-nav--collapsed{width:50px;min-width:50px}.tab-nav .tab-nav__nav-container{padding:var(--padding)}@media only screen and (max-width: 23.4375em){.tab-nav .tab-nav__nav-container:not(.tab-nav__nav-container-no-responsive){position:fixed;z-index:var(--hbr-z-index-drawer);top:0;left:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;background-color:var(--base-bg-default) !important;-moz-transition:all 0.5s ease-in-out;-webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out}}@media only screen and (max-width: 23.4375em) and (max-width: 23.4375em){.tab-nav .tab-nav__nav-container:not(.tab-nav__nav-container-no-responsive):not(.tab-visible){position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.tab-nav:not(.focus-visible) ::slotted(hbr-tab){--focus-ring:none}.tab-nav{--slot-sentiment-color:var(--sentiment-color)}.tab-nav ::slotted(hbr-menu-divider){--margin:20px 0px}.tab-nav ::slotted(hbr-tab){--padding:var(--tab-padding);--width:100%;width:100%;--active-background-color:none;--border-radius:none;--color:var(--base-text-default);--sentiment-color:var(--slot-sentiment-color)}.tab-nav ::slotted(.hbr-tab-header){padding:12px 40px;margin:0px}.tab-nav ::slotted(hbr-tab-fold){--sentiment-color:var(--slot-sentiment-color)}.tab-nav .tab-nav__body{flex:1 1 auto;order:2}.tab-nav .tab-nav__resizer{width:var(--hbr-border-width)}.tab-nav .tab-nav__resizer-border{background:var(--control-border-default)}";
const HbrTabNavStyle0 = tabNavCss;

const TabNav = /*@__PURE__*/ proxyCustomElement(class TabNav extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTabShow = createEvent(this, "hbr-tab-show", 7);
        this.hbrTabHide = createEvent(this, "hbr-tab-hide", 7);
        this.isVisible = false;
        this.nav = true;
        this.sentiment = "interact";
        this.border = false;
        this.uncontrolled = false;
        this.noResponsive = false;
        this.collapsed = false;
    }
    menuItemListener(e) {
        const popover = e.target.closest("hbr-tab-popover");
        const tab = popover === null || popover === void 0 ? void 0 : popover.shadowRoot.querySelector("hbr-tab");
        if (tab) {
            this.setActiveTab(tab);
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
        // Set initial tab state when the tabs first become visible
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].intersectionRatio > 0) {
                this.setAriaLabels();
                if (!this.nav) {
                    this.setActiveTab(this.getActiveTab() || this.getAllTabs()[0], false);
                }
                observer.unobserve(entries[0].target);
            }
        });
        observer.observe(this.host);
        focusVisible.observe(this.tabnav);
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
        var _a;
        this.mutationObserver.disconnect();
        focusVisible.unobserve(this.tabnav);
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.navEl);
    }
    /** Shows the specified tab panel. */
    async show(panel) {
        const tabs = this.getAllTabs();
        const tab = tabs.find((el) => el.panel === panel);
        if (tab) {
            this.setActiveTab(tab);
        }
    }
    toggleTab() {
        this.getAllTabs().forEach((tab) => {
            tab.collapsed = this.collapsed;
        });
        const tabPopovers = this.host.querySelectorAll("hbr-tab-popover");
        if (tabPopovers) {
            tabPopovers.forEach((popoverTab) => {
                popoverTab.collapsed = this.collapsed;
            });
        }
    }
    getAllTabs(includeDisabled = false, ele, isAll = true) {
        let slot = ele;
        if (!ele)
            slot = this.tabs.querySelector("slot");
        const slotList = [...slot.assignedElements()];
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
        const slot = this.body.querySelector("slot");
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-panel");
    }
    getAllTabFold() {
        const slot = this.tabs.querySelector("slot");
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-fold");
    }
    getActiveTab() {
        return this.getAllTabs().find((el) => el.active);
    }
    closeAllPopovers() {
        const slot = this.tabs.querySelector("slot");
        const slotList = [...slot.assignedElements()];
        slotList.forEach((cur) => {
            if (cur.tagName.toLowerCase() === "hbr-tab-popover") {
                cur.removeFocus(null);
            }
        });
    }
    handleClick(event) {
        if (this.uncontrolled)
            return;
        const target = event.target;
        const tab = target.closest("hbr-tab");
        const tabnav = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-nav");
        // Ensure the target tab is in this tab group
        if (tabnav !== this.host) {
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
    handleKeyDown(event) {
        if (this.uncontrolled)
            return;
        const target = event.target;
        let tab;
        let popover;
        let tabnav;
        if (target.tagName.toLowerCase() === "hbr-tab-popover") {
            popover = target;
            tab = target.shadowRoot.querySelector("hbr-tab");
            tabnav = popover === null || popover === void 0 ? void 0 : popover.closest("hbr-tab-nav");
        }
        else {
            tab = target.closest("hbr-tab");
            popover = target.closest("hbr-tab-popover");
            tabnav = (tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-nav")) || (popover === null || popover === void 0 ? void 0 : popover.closest("hbr-tab-nav"));
        }
        // Ensure the target tab is in this tab group
        if (tabnav !== this.host) {
            return false;
        }
        // Activate a tab
        if (["Enter", " "].includes(event.key)) {
            if (tab && !popover) {
                if (this.uncontrolled)
                    return;
                this.setActiveTab(tab);
                event.preventDefault();
                this.isVisible = false;
            }
            else if (popover) {
                const popoverBlock = document.getElementById(popover.contentId);
                const menuItem = popoverBlock.querySelector("hbr-menu-item");
                menuItem === null || menuItem === void 0 ? void 0 : menuItem.setFocus();
            }
        }
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            if (popover && event.key === "ArrowRight") {
                const poperBlock = document.getElementById(popover.contentId);
                const menuItem = poperBlock.querySelector("hbr-menu-item");
                menuItem === null || menuItem === void 0 ? void 0 : menuItem.setFocus();
            }
        }
        // Move focus up or down
        if (["ArrowUp", "ArrowDown", "Home", "End", "Tab", "ArrowLeft"].includes(event.key)) {
            const activeEl = document.activeElement;
            const targetPopover = activeEl.closest("hbr-tab-popover");
            const isTab = activeEl &&
                ["hbr-tab", "hbr-tab-fold", "hbr-tab-popover"].includes(activeEl.tagName.toLowerCase());
            if (isTab || popover) {
                const tabs = this.getAllTabs(false, false, false);
                let popover;
                let tab;
                if (activeEl.tagName.toLowerCase() === "hbr-tab-popover") {
                    popover = target;
                    tab = popover.shadowRoot.querySelector("hbr-tab");
                }
                else if (activeEl.tagName.toLowerCase() === "hbr-tab") {
                    tab = activeEl;
                    popover = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-popover");
                }
                else {
                    popover = targetPopover;
                    tab = popover.shadowRoot.querySelector("hbr-tab");
                }
                let index = tabs.indexOf(tab);
                if (event.key === "Home") {
                    index = 0;
                }
                else if (event.key === "End") {
                    index = tabs.length - 1;
                }
                else if (event.key === "ArrowUp" ||
                    (event.key === "Tab" && event.shiftKey && isTab)) {
                    index = Math.max(0, index - 1);
                }
                else if (event.key === "ArrowDown" ||
                    (event.key === "Tab" && !event.shiftKey && isTab)) {
                    index = Math.min(tabs.length - 1, index + 1);
                }
                tab = tabs[index];
                if (tab && tab.tagName.toLowerCase() === "hbr-tab") {
                    const basePart = tab.shadowRoot.querySelector("div[part='base']");
                    const tabindex = basePart.getAttribute("tabindex");
                    if (popover) {
                        popover.removeFocus(null);
                    }
                    tabindex === "0" && tab.setFocus({ preventScroll: true });
                }
                else if (tab && tab.tagName.toLowerCase() === "hbr-tab-fold") {
                    tab.setFocus({ preventScroll: true });
                }
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
            this.getAllTabs().forEach((el) => {
                el.active = el === this.activeTab;
            });
            this.getAllTabFold().forEach((el) => {
                if (el.contains(tab) && !el.open)
                    el.active = true;
                else
                    el.active = false;
            });
            this.getAllPanels().forEach((el) => {
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
        const tabs = this.getAllTabs();
        const panels = this.getAllPanels();
        // Link each tab with its corresponding panel
        tabs.map((tab) => {
            const panel = panels.find((el) => el.name === tab.panel);
            if (panel) {
                tab.setAttribute("aria-controls", panel.getAttribute("id"));
                panel.setAttribute("aria-labelledby", tab.getAttribute("id"));
            }
        });
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: '719a99fa5566578fc3d1f7f571d2e2c729d546fc', style: {
                "--sentiment-color": `${color(this.sentiment)}`,
            } }, h("div", { key: '4a82b7db370830c829c0b31ad0d87a371f35cfd2', part: "base", ref: (el) => {
                this.tabnav = el;
            }, class: {
                "tab-nav": true,
                "tab-nav--collapsed": this.collapsed,
            }, onClick: this.handleClick, onKeyDown: this.handleKeyDown }, h("div", { key: 'c0515b5fbf5503ab2c5e8d19a477c771316a5f6a', class: {
                "tab-nav__nav-container": true,
                "tab-visible": this.isVisible,
                "tab-nav__nav-container-no-responsive": this.noResponsive,
            } }, h("hbr-icon-button", { key: '2024ebd88684f9e845874e27810a2e8ddf40f5d3', class: {
                "tab-nav__close-icon": true,
                "tab-nav__close-icon-no-responsive": this.noResponsive,
            }, onClick: this.handleClickIcon, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, arialabel: "Close menu" }), h("div", { ref: (el) => {
                this.navEl = el;
            }, key: "nav", part: "nav", class: "tab-nav__nav" }, h("div", { key: '29912efab3e8e00a4dd9195d8fe732ad3a218813', ref: (el) => {
                this.tabs = el;
            }, part: "tabs", class: {
                "tab-nav__tabs": true,
                "tab-nav__tabs-nav": this.nav,
                "tab-nav__tabs-nav--collapsed": this.collapsed,
            }, role: "menubar", "aria-orientation": "vertical" }, h("slot", { key: 'fc95c069dca98e29977804f12478f7bc42e8c5d2' })))), h("span", { key: 'f3aa7de4e29740c82a210e9b0d405f89d61c7f0c', part: "border", class: {
                "tab-nav__resizer": true,
                "tab-nav__resizer-border": this.border,
            } }), h("div", { key: '5441eb1a12fa22ec939f681a3459933ed1d7e162', ref: (el) => {
                this.body = el;
            }, part: "body", class: "tab-nav__body" }, h("slot", { key: '133ef005a9ec6e8a7c2384f4406014f35b32ab01', name: "content" })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "collapsed": ["toggleTab"]
    }; }
    static get style() { return HbrTabNavStyle0; }
}, [1, "hbr-tab-nav", {
        "nav": [516],
        "sentiment": [1537],
        "border": [516],
        "uncontrolled": [4],
        "noResponsive": [516, "no-responsive"],
        "collapsed": [4],
        "isVisible": [32],
        "show": [64]
    }, [[0, "hbr-select", "menuItemListener"]], {
        "collapsed": ["toggleTab"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-nav", "hbr-icon", "hbr-icon-button"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-nav":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabNav);
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
    } });
}

const HbrTabNav = TabNav;
const defineCustomElement = defineCustomElement$1;

export { HbrTabNav, defineCustomElement };

