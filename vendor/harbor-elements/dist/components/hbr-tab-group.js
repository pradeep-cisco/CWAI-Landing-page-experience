import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { A as arrowLeft, k as arrowRight } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { s as scrollIntoView } from './scroll.js';
import { d as defineCustomElement$2 } from './icon-button.js';

const tabGroupCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--color-sentiment-text-hover:var(--base-text-default)}:host:not([sentiment=interact]){--color-sentiment-indicator-hover:var(--brand-accent-border-hover)}:host([sentiment=interact]){--color-sentiment-indicator:var(--interact-border-medium-active);--color-sentiment-indicator-hover:var(--interact-border-medium-hover);--color-sentiment-text:var(--interact-text-weak-active)}:host([primary]){--color-sentiment-indicator:var(--brand-accent-border-active);--color-sentiment-indicator-hover:var(--brand-accent-border-hover);--color-sentiment-text:var(--base-text-medium-default)}:host([sentiment=success]):not([primary]){--color-sentiment-indicator:var(--positive-border-active);--color-sentiment-indicator-hover:var(--positive-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=danger]),:host([sentiment=negative]){--color-sentiment-indicator:var(--negative-border-medium-active);--color-sentiment-indicator-hover:var(--negative-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host([sentiment=warning]){--color-sentiment-indicator:var(--warning-border-active);--color-sentiment-indicator-hover:var(--warning-bg-medium-hover);--color-sentiment-text:var(--color-sentiment-indicator)}:host{--border-color:var(--control-border-weak-default);--gap:0;display:block;--group-border-bottom:1px solid transparent}:host{--group-border-bottom:none}:host([gap][size=small]){--gap:var(--hbr-spacing-lg, 24px)}:host([gap][size=medium]){--gap:var(--hbr-spacing-xl, 32px)}:host([gap][size=large]){--gap:var(--hbr-spacing-2xl, 48px)}.tab-group{display:flex;border:solid 1px transparent;border-radius:0;--indicator-size:3px}.tab-group .tab-group__tabs{display:flex;position:relative}.tab-group .tab-group__tabs-gap{gap:var(--gap)}.tab-group:not(.focus-visible) ::slotted(hbr-tab){--focus-ring:none}.tab-group.tab-group--small ::slotted(hbr-tab){--font-size:var(--hbr-font-size-sm)}.tab-group.tab-group--medium ::slotted(hbr-tab){--font-size:var(--hbr-font-size-md)}.tab-group.tab-group--large ::slotted(hbr-tab){--font-size:var(--hbr-font-size-lg)}.tab-group ::slotted(hbr-tab){--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-normal)}.tab-group--has-scroll-controls .tab-group__nav-container{position:relative;padding:0 var(--hbr-spacing-xl)}.tab-group__scroll-button{display:flex;align-items:center;justify-content:center;position:absolute;top:0;bottom:0;width:var(--hbr-spacing-xl)}.tab-group__scroll-button--left{left:0}.tab-group__scroll-button--right{right:0}.tab-group--top{flex-direction:column}.tab-group--top .tab-group__nav-container{order:1}.tab-group--top .tab-group__nav{display:flex;padding:4px;scrollbar-width:none;-ms-overflow-style:none}.tab-group--top .tab-group__nav::-webkit-scrollbar{width:0;height:0}.tab-group--top .tab-group__nav-scroll{overflow-x:auto}.tab-group--top .tab-group__tabs{flex:1 1 auto;position:relative;flex-direction:row;box-shadow:0 -1px 0 var(--border-color) inset;border-bottom:var(--group-border-bottom)}.tab-group--top .tab-group__body{order:2}.tab-group--bottom{flex-direction:column}.tab-group--bottom .tab-group__nav-container{order:2}.tab-group--bottom .tab-group__nav{display:flex;overflow-x:auto;padding:4px;scrollbar-width:none;-ms-overflow-style:none}.tab-group--bottom .tab-group__nav::-webkit-scrollbar{width:0;height:0}.tab-group--bottom .tab-group__tabs{flex:1 1 auto;position:relative;flex-direction:row;border-top:solid 1px var(--border-color)}.tab-group--bottom .tab-group__body{order:1}.tab-group--left{flex-direction:row}.tab-group--left .tab-group__nav-container{order:1}.tab-group--left .tab-group__tabs{flex:0 0 auto;flex-direction:column;border-right:solid 1px var(--border-color)}.tab-group--left .tab-group__body{flex:1 1 auto;order:2}.tab-group--right{flex-direction:row}.tab-group--right .tab-group__nav-container{order:2}.tab-group--right .tab-group__tabs{flex:0 0 auto;flex-direction:column;border-left:solid 1px var(--border-color)}.tab-group--right .tab-group__body{flex:1 1 auto;order:1}.tab-group--top ::slotted(hbr-tab),.tab-group--bottom ::slotted(hbr-tab){--margin-right:32px;--padding:var(--hbr-spacing-xs) 1px calc(var(--hbr-spacing-xs) + var(--indicator-size)) 1px}.tab-group--large ::slotted(hbr-tab){--margin-right:48px}.tab-group.tab-group--primary.tab-group--top .tab-group__tabs{box-shadow:none}.tab-group.tab-group--primary ::slotted(hbr-tab){--active-color:var(--base-bg-strong-active);--hover-color:var(--base-bg-strong-hover)}:host .tab-group__nav{padding:0}";
const HbrTabGroupStyle0 = tabGroupCss;

const TabGroup = /*@__PURE__*/ proxyCustomElement(class TabGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTabShow = createEvent(this, "hbr-tab-show", 7);
        this.hbrTabHide = createEvent(this, "hbr-tab-hide", 7);
        this.sheet = new CSSStyleSheet();
        this.getTab = (ele, includeButton) => {
            if (includeButton) {
                return ((ele.tagName === "HBR-TAB" && !ele.nested) ||
                    (ele.tagName === "HBR-BUTTON" && ele.ariarole === "tab"));
            }
            return ele.tagName === "HBR-TAB";
        };
        this.handleScroll = () => {
            const nav = this.nav;
            if (nav) {
                this.isScrolledToLeft = nav.scrollLeft === 0;
                this.isScrolledToRight =
                    Math.ceil(nav.scrollLeft + nav.clientWidth) >= nav.scrollWidth;
            }
        };
        this.hasScrollControls = false;
        this.isScrolledToLeft = false;
        this.isScrolledToRight = false;
        this.placement = "top";
        this.noScrollControls = false;
        this.noActiveEventBubble = true;
        this.noSelectEventBubble = true;
        this.uncontrolled = false;
        this.gap = false;
        this.size = "medium";
        this.sentiment = "interact";
        this.primary = false;
    }
    handleNoScrollControlsChange() {
        this.updateScrollControls();
    }
    connectedCallback() {
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);
        this.stopBubbleHbrActiveEvent = this.stopBubbleHbrActiveEvent.bind(this);
        this.listenActiveTab = this.listenActiveTab.bind(this);
        this.setNestedActiveTab = this.setNestedActiveTab.bind(this);
        this.updateScrollControls = this.updateScrollControls.bind(this);
    }
    componentDidLoad() {
        // Set initial tab state when the tabs first become visible
        let load = false;
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].intersectionRatio > 0) {
                this.setAriaLabels();
                if (!this.uncontrolled) {
                    this.setActiveTab(this.getActiveTab() || this.getAllTabs()[0], false);
                }
                load = true;
                observer.unobserve(entries[0].target);
            }
        });
        setTimeout(() => {
            // IntersectionObserver call is not guaranteed
            if (load === false) {
                this.setAriaLabels();
                if (!this.uncontrolled) {
                    this.setActiveTab(this.getActiveTab() || this.getAllTabs()[0], false);
                }
            }
        }, 500);
        observer.observe(this.host);
        focusVisible.observe(this.tabGroup);
        this.resizeObserver = new ResizeObserver(this.updateScrollControls);
        this.resizeObserver.observe(this.nav);
        requestAnimationFrame(this.updateScrollControls);
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
        focusVisible === null || focusVisible === void 0 ? void 0 : focusVisible.unobserve(this.tabGroup);
        (_b = this.resizeObserver) === null || _b === void 0 ? void 0 : _b.unobserve(this.nav);
    }
    /** Shows the specified tab panel. */
    async show(panel) {
        const tabs = this.getAllTabs();
        const tab = tabs.find((el) => el.panel === panel);
        if (tab) {
            this.setActiveTab(tab);
        }
    }
    getAllTabs(includeDisabled = false, includeButton = false) {
        const slot = this.tabs.querySelector("slot");
        const list = [...slot.assignedElements({ flatten: true })];
        if (includeButton) {
            const buttonList = [];
            list.forEach((e) => {
                if (e.nested) {
                    const button = e === null || e === void 0 ? void 0 : e.querySelector("hbr-button[ariarole='tab']");
                    if (button) {
                        if (includeDisabled) {
                            button && buttonList.push(button);
                        }
                        else {
                            button && !button.disabled && buttonList.push(button);
                        }
                    }
                }
            });
            list.push(...buttonList);
        }
        return list.filter((el) => {
            return includeDisabled
                ? this.getTab(el, includeButton)
                : this.getTab(el, includeButton) && !el.disabled;
        });
    }
    getAllPanels() {
        const slot = this.body.querySelector("slot");
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-panel");
    }
    getActiveTab() {
        return this.getAllTabs().find((el) => el.active);
    }
    handleClick(event) {
        if (this.uncontrolled)
            return;
        const target = event.target;
        const tab = target.closest("hbr-tab");
        const tabGroup = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-group");
        // Ensure the target tab is in this tab group
        if (tabGroup !== this.host) {
            return false;
        }
        if (tab) {
            if (this.uncontrolled)
                return;
            const dropdown = this.host.querySelector("hbr-dropdown");
            if (dropdown) {
                dropdown.value = "";
            }
            this.setActiveTab(tab);
        }
    }
    handleKeyDown(event) {
        var _a;
        const target = event.target;
        const tab = target.closest("hbr-tab");
        const tabGroup = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-group");
        // Ensure the target tab is in this tab group
        if (tabGroup !== this.host) {
            return false;
        }
        // Activate a tab
        if (["Enter", " "].includes(event.key)) {
            if (tab) {
                if (this.uncontrolled)
                    return;
                const dropdown = this.host.querySelector("hbr-dropdown");
                if (dropdown) {
                    dropdown.value = "";
                }
                if (target.tagName !== "HBR-BUTTON") {
                    this.setActiveTab(tab);
                }
                event.preventDefault();
            }
        }
        // Move focus left or right
        if ([
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
        ].includes(event.key)) {
            let activeEl = document.activeElement;
            if (!["HBR-TAB", "HBR-BUTTON"].includes(activeEl.tagName)) {
                activeEl = activeEl.closest("hbr-tab");
            }
            if (activeEl && ["HBR-TAB", "HBR-BUTTON"].includes(activeEl.tagName)) {
                const tabs = this.getAllTabs(false, true);
                let index = tabs.indexOf(activeEl);
                if (event.key === "Home") {
                    index = 0;
                }
                else if (event.key === "End") {
                    index = tabs.length - 1;
                }
                else if (event.key === "ArrowLeft") {
                    index = Math.max(0, index - 1);
                }
                else if (event.key === "ArrowRight") {
                    index = Math.min(tabs.length - 1, index + 1);
                }
                (_a = tabs[index]) === null || _a === void 0 ? void 0 : _a.setFocus({ preventScroll: true });
                if (["top", "bottom"].includes(this.placement)) {
                    // ts-ignore
                    tabs[index] && scrollIntoView(tabs[index], this.nav, "horizontal");
                }
            }
        }
    }
    handleScrollLeft() {
        this.nav.scroll({
            left: this.nav.scrollLeft - this.nav.clientWidth,
            behavior: "smooth",
        });
        this.handleScroll();
    }
    handleScrollRight() {
        this.nav.scroll({
            left: this.nav.scrollLeft + this.nav.clientWidth,
            behavior: "smooth",
        });
        this.handleScroll();
    }
    updateScrollControls() {
        if (this.noScrollControls) {
            this.hasScrollControls = false;
        }
        else {
            this.hasScrollControls =
                ["top", "bottom"].includes(this.placement) &&
                    this.nav.scrollWidth - 1 > this.nav.clientWidth;
            // the -1 solution is for the weird bug in safari #978
            // disabled the left and right scroll buttons
            this.handleScroll();
        }
    }
    setActiveTab(tab, emitEvents = true, isNested = false) {
        const isNestedTab = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-panel");
        if (isNestedTab && this.host.contains(isNestedTab))
            return;
        const isTabVertical = tab === null || tab === void 0 ? void 0 : tab.closest("hbr-tab-vertical");
        if (isTabVertical && this.host.contains(isTabVertical))
            return;
        if ((tab && tab !== this.activeTab && !tab.disabled) ||
            (isNested && tab && !tab.disabled)) {
            const previousTab = this.activeTab;
            this.activeTab = tab;
            // Sync tabs and panels
            this.getAllTabs().map((el) => {
                el.active = el === this.activeTab;
            });
            this.getAllPanels().map((el) => {
                el.active = el.name === this.activeTab.panel;
            });
            if (["top", "bottom"].includes(this.placement)) {
                // ts-ignore
                scrollIntoView(this.activeTab, this.nav, "horizontal");
            }
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
    listenActiveTab(event) {
        var _a;
        const tab = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.tab;
        tab && this.setActiveTab(tab);
    }
    setNestedActiveTab(e) {
        var _a, _b, _c;
        const tab = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.closest("hbr-tab");
        if (tab === null || tab === void 0 ? void 0 : tab.nested) {
            const panel = (_c = (_b = e === null || e === void 0 ? void 0 : e.detail) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.getAttribute("panel");
            if (tab && panel) {
                tab.panel = panel;
                this.setActiveTab(tab, true, true);
            }
        }
    }
    stopBubbleHbrActiveEvent(event) {
        this.noActiveEventBubble && event.stopPropagation();
    }
    stopBubbleHbrSelectEvent(event) {
        this.noSelectEventBubble && event.stopPropagation();
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: '833d39cf45b3549da7f1c08eb9dae1eb65db3c02', "onHbr-active": this.stopBubbleHbrActiveEvent, "onHbr-select": this.stopBubbleHbrSelectEvent }, h("div", { key: '98e513acc9b5492f9b8e3d9db3efb0fd9d4e8378', part: "base", ref: (el) => {
                this.tabGroup = el;
            }, class: {
                "tab-group": true,
                // Placements
                "tab-group--top": this.placement === "top",
                "tab-group--bottom": this.placement === "bottom",
                "tab-group--left": this.placement === "left",
                "tab-group--right": this.placement === "right",
                "tab-group--has-scroll-controls": this.hasScrollControls,
                "tab-group--large": this.size === "large",
                "tab-group--medium": this.size === "medium",
                "tab-group--small": this.size === "small",
                "tab-group--primary": this.primary,
            }, onClick: this.handleClick, onKeyDown: this.handleKeyDown, "onHbr-active": this.listenActiveTab, "onHbr-select": this.setNestedActiveTab }, h("div", { key: '11d9781b59e65951cff9a87812370e60370e0c06', class: "tab-group__nav-container", part: "nav-container" }, this.hasScrollControls && (h("hbr-icon-button", { arialabel: "previous", class: "tab-group__scroll-button tab-group__scroll-button--left", exportparts: "base:scroll-button, base:scroll-button-left", disabled: this.isScrolledToLeft, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-left"]) || arrowLeft, "data-testid": "scroll-left-button", onClick: this.handleScrollLeft })), h("div", { ref: (el) => {
                this.nav = el;
            }, key: "nav", part: "nav", class: {
                "tab-group__nav": true,
                "tab-group__nav-scroll": this.hasScrollControls,
            }, onScroll: this.handleScroll }, h("div", { key: '41ae0cf6b8dd2d19a40d1c5c7a3afe83193e7165', ref: (el) => {
                this.tabs = el;
            }, part: "tabs", class: {
                "tab-group__tabs": true,
                "tab-group__tabs-gap": this.gap,
            }, role: "tablist", "aria-orientation": "horizontal" }, h("slot", { key: '6bc19d4b2061e6327416b1b92e7fa6ab4b0b827e', name: "nav" }))), this.hasScrollControls && (h("hbr-icon-button", { arialabel: "next", class: "tab-group__scroll-button tab-group__scroll-button--right", exportparts: "base:scroll-button, base:scroll-button-right", disabled: this.isScrolledToRight, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-right"]) || arrowRight, "data-testid": "scroll-right-button", onClick: this.handleScrollRight }))), h("div", { key: '64e805bac6b9c45bd051a9f5f1c41dff0df13813', ref: (el) => {
                this.body = el;
            }, part: "body", class: "tab-group__body" }, h("slot", { key: 'f3e84e723d002788d70c6dbf8109a94cd1fc0264' })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "noScrollControls": ["handleNoScrollControlsChange"]
    }; }
    static get style() { return HbrTabGroupStyle0; }
}, [1, "hbr-tab-group", {
        "placement": [1],
        "noScrollControls": [4, "no-scroll-controls"],
        "noActiveEventBubble": [4, "no-active-event-bubble"],
        "noSelectEventBubble": [4, "no-select-event-bubble"],
        "uncontrolled": [4],
        "gap": [516],
        "size": [513],
        "sentiment": [1537],
        "primary": [1540],
        "hasScrollControls": [32],
        "isScrolledToLeft": [32],
        "isScrolledToRight": [32],
        "show": [64]
    }, undefined, {
        "noScrollControls": ["handleNoScrollControlsChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-group", "hbr-icon", "hbr-icon-button"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabGroup);
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

const HbrTabGroup = TabGroup;
const defineCustomElement = defineCustomElement$1;

export { HbrTabGroup, defineCustomElement };

