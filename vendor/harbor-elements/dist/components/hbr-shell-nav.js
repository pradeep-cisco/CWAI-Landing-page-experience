import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { J as nav } from './index2.js';
import { f as focusVisible } from './focus-visible.js';
import { g as getBootstrapConfig, d as defineCustomElement$5 } from './icon.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './portal.js';
import { d as defineCustomElement$2 } from './tooltip.js';

const shellNavCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--sentiment-color:var(--interact-bg-default);--header-offset:var(--hbr-app-shift-top, 0px);--bg-color:var(--base-bg-default);--collapse-btn-color:var(--control-icon-weak-default);--collapse-btn-hover-color:var(--control-icon-weak-default);height:100%}:host ::slotted(hbr-menu-divider){--margin:0px}.nav{display:flex;flex-direction:row;border-radius:0;height:100%;background-color:var(--bg)}.nav__nav-container{padding:var(--hbr-spacing-md)}.nav__collapse-icon{display:flex;justify-content:flex-start;padding:0 var(--hbr-spacing-xs) var(--hbr-spacing-xs) var(--hbr-spacing-xs);max-width:248px}.nav__collapse-icon-collapsed{padding:0 0 var(--hbr-spacing-xs);margin-left:0;justify-content:center}.nav__collapse-icon-titleless{padding:0 0 var(--hbr-spacing-xs)}.nav__collapse-icon hbr-icon{color:var(--collapse-btn-color);flex:0 0 auto;display:flex;align-items:center;font-size:var(--hbr-font-size-md);width:24px;height:24px}.nav__collapse-icon-wrapper{display:flex;justify-content:flex-start;transition:justify-content 0.3s ease;padding:var(--hbr-spacing-xs);cursor:pointer;border-radius:var(--hbr-border-radius-lg, 8px)}.nav__collapse-icon-wrapper .nav__collapse-label{margin-left:var(--hbr-spacing-md);font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-semibold);line-height:var(--hbr-font-line-height-normal);padding-top:2px;color:var(--base-text-medium-default);display:-webkit-box;line-clamp:1;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;white-space:normal}.nav__collapse-icon-wrapper:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.nav__collapse-icon-wrapper-collapsed{width:100%;justify-content:center;padding:var(--hbr-spacing-xs)}.nav__collapse-icon-wrapper-titleless{width:56px;height:40px}.nav__collapse-icon-wrapper:hover{background-color:var(--base-bg-weak-hover)}.nav__collapse-icon-wrapper:hover .nav__collapse-label{color:var(--base-text-default)}.nav__collapse-icon-wrapper:hover hbr-icon{color:var(--collapse-btn-hover-color)}.nav__collapse-icon-hidden{display:none}.nav--collapsed{width:136px}.nav--collapsed>.nav__nav-container{padding-bottom:var(--hbr-spacing-lg)}.nav--collapsed.nav__collapse-icon{display:flex;justify-content:center}.nav--collapsed hbr-drawer::part(base){left:var(--drawer-collapsed-left)}.nav.nav--titleless{width:88px}.nav.nav--titleless hbr-drawer::part(base){left:var(--drawer-collapsed-left-titleless)}.nav .nav__items{display:flex;position:relative;flex-direction:column;min-width:var(--min-width);padding:0;gap:var(--hbr-spacing-xs);margin-top:0px;margin-bottom:0px}.nav .nav__items-nav{gap:var(--hbr-spacing-xs);margin-left:var(--hbr-spacing-md)}.nav .nav__items-nav hbr-menu-divider{width:248px}.nav .nav__items-nav ::slotted(hbr-menu-divider){width:248px}.nav .nav__items-nav--collapsed ::slotted(hbr-menu-divider){width:104px}.nav .nav__items-nav--collapsed.nav__items-nav--titleless{width:56px}.nav .nav__items-nav--collapsed.nav__items-nav--titleless ::slotted(hbr-menu-divider){width:56px}.nav:not(.focus-visible) ::slotted(hbr-tab){--focus-ring:none}.nav{--slot-sentiment-color:var(--sentiment-color)}.nav ::slotted(.hbr-tab-header){padding:var(--hbr-spacing-sm) 40px;margin:0px}.nav .nav__body{width:0;flex:1 1 auto;order:2}";
const HbrShellNavStyle0 = shellNavCss;

const ShellNav = /*@__PURE__*/ proxyCustomElement(class ShellNav extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrNavItemClick = createEvent(this, "hbr-nav-item-click", 7);
        this.hbrCollapseClick = createEvent(this, "hbr-collapse-click", 7);
        this.hbrItemSelect = createEvent(this, "hbr-select", 7);
        this.hbrCollapse = createEvent(this, "hbr-collapse", 7);
        this.hbrExpand = createEvent(this, "hbr-expand", 7);
        this.hoverTimeoutId = null;
        this.defaultAria = {
            collapseBtnAriaCollapse: "Collapse navigation",
            collapseBtnAriaExpand: "Expand navigation",
        };
        this.setMenuItemValue = (activeItem) => {
            const navItems = this.host.querySelectorAll("hbr-nav-item");
            navItems === null || navItems === void 0 ? void 0 : navItems.forEach((item) => {
                var _a;
                (_a = item.querySelectorAll("hbr-menu-item")) === null || _a === void 0 ? void 0 : _a.forEach((menuItem) => {
                    const condition = activeItem && menuItem.value === activeItem.value;
                    menuItem.checked = condition;
                    menuItem.checkMark = condition;
                });
            });
        };
        this.getPopoverContent = (element) => {
            var _a;
            const slot = element.shadowRoot.querySelector('slot[name="menu"]');
            if ((_a = slot === null || slot === void 0 ? void 0 : slot.assignedNodes()) === null || _a === void 0 ? void 0 : _a.length) {
                return slot.assignedNodes()[0];
            }
        };
        this.onDrawerClose = (shouldFocus = false) => {
            var _a;
            if (shouldFocus) {
                (_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.setFocus();
            }
            this.isActiveFromClick = false;
            this.noTransform = false;
            this.activeItem = null;
        };
        this.onMouseLeave = async () => {
            if (this.isActiveFromClick)
                return;
            this.activeItem = null;
        };
        this.setView = () => {
            const prevScreenWidthReduced = this.inCompactView;
            const screenWidthReduced = window.innerWidth < this.compactViewWidth;
            if (prevScreenWidthReduced !== screenWidthReduced) {
                this.inCompactView = screenWidthReduced;
                if (this.inCompactView) {
                    this.hbrCollapse.emit();
                    this.collapsed = true;
                }
                else {
                    this.hbrExpand.emit();
                    this.collapsed = false;
                }
            }
        };
        this.setCollapsedEntry = () => {
            const collapsedByPropOrScreenWidth = this.collapsed || (!this.noResponsive && this.inCompactView);
            this.getAllItems().forEach((item) => {
                item.collapsed = collapsedByPropOrScreenWidth;
                item.titleless = collapsedByPropOrScreenWidth && this.titleless;
            });
            this.getAllGroups().forEach((label) => {
                label.collapsed = collapsedByPropOrScreenWidth;
            });
        };
        this.getAllItems = (ele) => {
            var _a;
            let slot = ele;
            if (!ele)
                slot = (_a = this.navItemContainerRef) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            const slotList = slot ? [...slot.assignedElements()] : [];
            const pushItems = (acc, cur) => {
                var _a;
                if (cur.tagName.toLowerCase() === "hbr-nav-item") {
                    acc.push(cur);
                }
                else if (cur.tagName.toLowerCase() === "hbr-nav-group") {
                    return [...cur.children].reduce(pushItems, acc);
                }
                else {
                    // account for nav-item nested deeply in other elements
                    const deeplyNestedItem = (_a = cur.querySelector) === null || _a === void 0 ? void 0 : _a.call(cur, "hbr-nav-item");
                    if (deeplyNestedItem) {
                        acc.push(deeplyNestedItem);
                    }
                }
                return acc;
            };
            return slotList.reduce(pushItems, []);
        };
        this.getAllGroups = (ele) => {
            var _a;
            let slot = ele;
            if (!ele)
                slot = (_a = this.navItemContainerRef) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            const slotList = slot ? [...slot.assignedElements()] : [];
            const itemsList = slotList.reduce((acc, cur) => {
                if (cur.tagName.toLowerCase() === "hbr-nav-group")
                    acc.push(cur);
                return acc;
            }, []);
            return itemsList;
        };
        this.getAllLabels = (ele) => {
            var _a;
            let slot = ele;
            if (!ele)
                slot = (_a = this.navItemContainerRef) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            const slotList = slot ? [...slot.assignedElements()] : [];
            const itemsList = slotList.reduce((acc, cur) => {
                if (cur.tagName.toLowerCase() === "hbr-nav-label")
                    acc.push(cur);
                return acc;
            }, []);
            return itemsList;
        };
        this.toggleCollapsed = () => {
            this.hbrCollapseClick.emit();
        };
        this.onShellNavKeyDown = (event) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const target = event.target;
            if (target.tagName.toLowerCase() === "hbr-nav-item") {
                if (event.key === "ArrowDown") {
                    const allNavItems = [...this.host.querySelectorAll("hbr-nav-item")];
                    const focusedIdx = allNavItems.findIndex((item) => {
                        return this.host.ownerDocument.activeElement === item;
                    });
                    if (focusedIdx < allNavItems.length - 1) {
                        (_b = (_a = allNavItems[focusedIdx]) === null || _a === void 0 ? void 0 : _a.removeFocus) === null || _b === void 0 ? void 0 : _b.call(_a);
                        (_d = (_c = allNavItems[focusedIdx + 1]) === null || _c === void 0 ? void 0 : _c.setFocus) === null || _d === void 0 ? void 0 : _d.call(_c);
                    }
                    event.preventDefault();
                }
                else if (event.key === "ArrowUp") {
                    const allNavItems = [...this.host.querySelectorAll("hbr-nav-item")];
                    const focusedIdx = allNavItems.findIndex((item) => {
                        return this.host.ownerDocument.activeElement === item;
                    });
                    if (focusedIdx > 0) {
                        (_f = (_e = allNavItems[focusedIdx]) === null || _e === void 0 ? void 0 : _e.removeFocus) === null || _f === void 0 ? void 0 : _f.call(_e);
                        (_h = (_g = allNavItems[focusedIdx - 1]) === null || _g === void 0 ? void 0 : _g.setFocus) === null || _h === void 0 ? void 0 : _h.call(_g);
                    }
                    event.preventDefault();
                }
            }
        };
        this.activeItem = undefined;
        this.selectedItem = undefined;
        this.selectedMenuItem = null;
        this.isActiveFromClick = false;
        this.noTransform = false;
        this.inCompactView = false;
        this.noResponsive = false;
        this.collapseLabel = "";
        this.aria = undefined;
        this.collapseTooltipLabel = "Collapse";
        this.disableCollapseTooltip = false;
        this.collapsed = false;
        this.titleless = false;
        this.reselectable = false;
        this.showCollapseButton = true;
        this.hoverTimer = 400;
        this.compactViewWidth = 980;
        this.disableClickToClose = false;
    }
    async resetSelected() {
        this.selectedItem = null;
        this.selectedMenuItem = null;
    }
    activeItemWatcher(activeItem) {
        this.hbrItemSelect.emit(activeItem);
        if (!activeItem) {
            this.getAllItems().forEach((item) => {
                const popover = this.getPopoverContent(item);
                if (popover) {
                    item.active = false;
                    this.noTransform = false;
                }
            });
        }
        else {
            this.getAllItems().forEach((item) => {
                const popover = this.getPopoverContent(item);
                if (popover) {
                    item.active = item === activeItem;
                }
            });
        }
    }
    noTransformWatcher(noTransform) {
        this.getAllItems().forEach((item) => {
            const popover = this.getPopoverContent(item);
            if (popover) {
                item.noTransform = noTransform;
            }
        });
    }
    selectedItemWatcher(selectedItem) {
        // to deal with undefined
        if (selectedItem) {
            this.getAllItems().forEach((item) => {
                item.selected = item === selectedItem;
            });
            //emit event for nav item click
            if (this.selectedMenuItem === null) {
                this.hbrNavItemClick.emit({
                    selectedItem: selectedItem,
                    selectedMenuItem: this.selectedMenuItem,
                });
            }
        }
    }
    selectedMenuWatcher(selectedMenuItem) {
        if (selectedMenuItem !== null &&
            !selectedMenuItem.hasAttribute("has-children")) {
            this.setMenuItemValue(selectedMenuItem);
        }
        else {
            this.setMenuItemValue(null);
        }
    }
    itemHoverListener(event) {
        var _a;
        //checking clicked or not
        if (this.isActiveFromClick)
            return;
        // checking if hovered on ordinary item or with popover
        if (!((_a = event.detail) === null || _a === void 0 ? void 0 : _a.popover)) {
            this.activeItem = null;
            this.isActiveFromClick = false;
        }
        else {
            // else if with popover
            if (this.activeItem === event.target) {
                return;
            }
            if (!this.activeItem && this.isActiveFromClick === false) {
                this.hoverTimeoutId = setTimeout(() => {
                    this.activeItem = event.target;
                }, this.hoverTimer);
            }
            else {
                this.noTransform = true;
                this.activeItem = event.target;
            }
        }
    }
    itemLeaveListener() {
        if (this.hoverTimeoutId) {
            clearTimeout(this.hoverTimeoutId);
        }
    }
    async itemClickListener(event) {
        var _a, _b;
        const targetElm = event.target;
        // checking if hovered on ordinary or popover
        // if hbr-click comes back without popover, it means nav-item is closed
        // OR if the previous active item was from a click action,
        // and now the new clicked item is the same as the previous active item,
        // then we close the popover
        if (!((_a = event.detail) === null || _a === void 0 ? void 0 : _a.popover) ||
            (this.isActiveFromClick &&
                targetElm.tagName.toLowerCase() === "hbr-menu-item" &&
                this.activeItem === event.target)) {
            if (this.selectedMenuItem) {
                this.selectedMenuItem = null;
            }
            this.isActiveFromClick = false;
            if (this.reselectable) {
                this.selectedItem = undefined;
            }
            this.selectedItem = targetElm;
            this.activeItem = null;
        }
        else {
            this.isActiveFromClick = true;
            // hiding existing active item
            if (this.activeItem !== targetElm) {
                this.noTransform = false;
                this.activeItem = targetElm;
            }
            else if (targetElm.tagName.toLowerCase() === "hbr-nav-item") {
                if (!this.disableClickToClose) {
                    this.onDrawerClose();
                }
            }
            if ((_b = event.detail) === null || _b === void 0 ? void 0 : _b.keyboard) {
                setTimeout(() => {
                    targetElm.shadowRoot
                        .querySelector(".nav-item__drawer-close")
                        .focus();
                }, 100);
            }
        }
    }
    async drawerCloseListener(event) {
        const target = event.target;
        if (target.tagName.toLowerCase() === "hbr-nav-item") {
            this.onDrawerClose(event === null || event === void 0 ? void 0 : event.detail);
        }
        if (target.tagName.toLowerCase() === "hbr-shell-nav") {
            this.isActiveFromClick = false;
            this.activeItem = null;
        }
    }
    handleClickOutside(event) {
        const target = event.target;
        // if clicked outside of the navigation, close the drawer
        if (this.activeItem && !this.host.contains(target)) {
            this.onDrawerClose(true);
        }
    }
    async selectItemListener(event) {
        this.selectedItem = event === null || event === void 0 ? void 0 : event.detail;
    }
    async menuItemListener(event) {
        var _a, _b, _c;
        if (event.target.tagName.toLowerCase() === "hbr-menu") {
            this.isActiveFromClick = true;
            const menuItem = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.item;
            this.selectedMenuItem = menuItem;
            const navItem = menuItem === null || menuItem === void 0 ? void 0 : menuItem.closest("hbr-nav-item");
            if (!(navItem === null || navItem === void 0 ? void 0 : navItem.switcher)) {
                if (this.reselectable) {
                    this.selectedItem = undefined;
                }
                this.selectedItem = navItem;
            }
            this.hbrNavItemClick.emit({
                selectedItem: navItem,
                selectedMenuItem: menuItem,
            });
            // check if it is a switcher or the menu item clicked has sub menu
            if (!(navItem === null || navItem === void 0 ? void 0 : navItem.switcher) && !menuItem.hasAttribute("has-children")) {
                (_b = this.selectedItem) === null || _b === void 0 ? void 0 : _b.setFocus();
                (_c = this.selectedItem) === null || _c === void 0 ? void 0 : _c.drawerClose();
            }
        }
    }
    componentDidLoad() {
        this.setView();
        this.setCollapsedEntry();
        window.addEventListener("resize", this.setView);
        // Set initial items state when the items first become visible
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].intersectionRatio > 0) {
                this.setAriaLabels();
                observer.unobserve(entries[0].target);
            }
        });
        observer.observe(this.host);
        focusVisible.observe(this.baseRef);
    }
    disconnectedCallback() {
        focusVisible.unobserve(this.baseRef);
        window.removeEventListener("resize", this.setView);
    }
    handleCollapsedChange() {
        this.setCollapsedEntry();
    }
    handleTitlelessChange() {
        this.setCollapsedEntry();
    }
    handleInCompactViewChange() {
        this.setCollapsedEntry();
    }
    getAllPanels() {
        const slot = this.bodyRef.querySelector("slot");
        return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "hbr-tab-panel");
    }
    setAriaLabels() {
        const items = this.getAllItems();
        const panels = this.getAllPanels();
        // Link each tab with its corresponding panel
        items.map((tab) => {
            const panel = panels.find((el) => el.name === tab.panel);
            if (panel) {
                tab.setAttribute("aria-controls", panel.getAttribute("id"));
                panel.setAttribute("aria-labelledby", tab.getAttribute("id"));
            }
        });
    }
    render() {
        var _a, _b, _c;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const collapsedByPropOrScreenWidth = this.collapsed || (!this.noResponsive && this.inCompactView);
        return (h(Host, { key: 'e7314a969af7a88c530f1969bb0fcd593f96fe0a' }, h("div", { key: '459ce10de5d23803cd446fbcf045b3b70c092414', part: "base", ref: (el) => {
                this.baseRef = el;
            }, class: {
                nav: true,
                "nav--collapsed": collapsedByPropOrScreenWidth,
                "nav--titleless": collapsedByPropOrScreenWidth && this.titleless,
            } }, h("div", { key: 'ee7f2a1d4476f3ed9e0acfa8e5ba3756d5c94d35', part: "nav-container", class: {
                "nav__nav-container": true,
                "nav__nav-container-no-responsive": this.noResponsive,
            }, onMouseLeave: this.onMouseLeave }, h("div", { key: '5c973cd3306ea46800e5de023e7c5f9459aae167', class: {
                "nav__collapse-icon": true,
                "nav__collapse-icon-collapsed": collapsedByPropOrScreenWidth,
                "nav__collapse-icon-hidden": this.inCompactView || !this.showCollapseButton,
                "nav__collapse-icon-titleless": collapsedByPropOrScreenWidth && this.titleless,
            }, part: "collapsible-icon" }, h("div", { key: '9b11285e9c3613787726f4b7cdf4131c3a021fdb', class: {
                "nav__collapse-icon-wrapper": true,
                "nav__collapse-icon-wrapper-collapsed": collapsedByPropOrScreenWidth,
                "nav__collapse-icon-wrapper-titleless": collapsedByPropOrScreenWidth && this.titleless,
            }, onClick: this.toggleCollapsed, onKeyDown: (e) => {
                e.key === "Enter" && this.toggleCollapsed();
            }, tabIndex: 0, ref: (el) => {
                this.collapseIconRef = el;
            }, "data-testid": "collapse-button", part: "collapse-button", "aria-label": this.collapsed
                ? ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.collapseBtnAriaExpand) ||
                    this.defaultAria.collapseBtnAriaExpand
                : ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.collapseBtnAriaCollapse) ||
                    this.defaultAria.collapseBtnAriaCollapse, role: "button" }, h("hbr-icon", { key: '39370ce4ea3d6c17b369fa8264b6fd8eb4115789', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.nav) || nav }), !this.collapsed && this.collapseLabel && (h("div", { part: "collapse-label", class: "nav__collapse-label" }, this.collapseLabel)))), h("div", { key: "nav", part: "nav", class: "nav__nav" }, h("div", { key: '43e5d7e15903a10ed3cfb76d774e506fb7cb813f', part: "nav-items", ref: (el) => {
                this.navItemContainerRef = el;
            }, onKeyDown: this.onShellNavKeyDown, class: {
                nav__items: true,
                "nav__items-nav--collapsed": collapsedByPropOrScreenWidth,
                "nav__items-nav--titleless": collapsedByPropOrScreenWidth && this.titleless,
            }, role: "menu", "aria-orientation": "vertical" }, h("slot", { key: '2f0c27b483e8a2b013eae41a1913eafd5ef08e5c' })))), h("div", { key: '0f7072eec22774438c93a8c6c2e9be489289edc9', ref: (el) => {
                this.bodyRef = el;
            }, part: "body", class: "nav__body" }, h("slot", { key: 'a7fa3305da65f6b87de56f131f59c0f8109d9d5f', name: "content" }))), h("hbr-portal", { key: '33b344cfc871a56cb203fdca8ac510fdbe87660b' }, h("hbr-tooltip", { key: '5c778ec3df5f898d800156afef9c9d044a7f1614', class: "hbr-shell-nav__collapse-tooltip", content: this.collapseTooltipLabel, disabled: this.disableCollapseTooltip, skidding: 3, distance: 5, placement: "left-start", anchor: this.collapseIconRef }))));
    }
    get host() { return this; }
    static get watchers() { return {
        "activeItem": ["activeItemWatcher"],
        "noTransform": ["noTransformWatcher"],
        "selectedItem": ["selectedItemWatcher"],
        "selectedMenuItem": ["selectedMenuWatcher"],
        "collapsed": ["handleCollapsedChange"],
        "titleless": ["handleTitlelessChange"],
        "inCompactView": ["handleInCompactViewChange"]
    }; }
    static get style() { return HbrShellNavStyle0; }
}, [1, "hbr-shell-nav", {
        "noResponsive": [516, "no-responsive"],
        "collapseLabel": [513, "collapse-label"],
        "aria": [16],
        "collapseTooltipLabel": [513, "collapse-tooltip-label"],
        "disableCollapseTooltip": [516, "disable-collapse-tooltip"],
        "collapsed": [1540],
        "titleless": [516],
        "reselectable": [4],
        "showCollapseButton": [4, "show-collapse-button"],
        "hoverTimer": [2, "hover-timer"],
        "compactViewWidth": [2, "compact-view-width"],
        "disableClickToClose": [516, "disable-click-to-close"],
        "activeItem": [32],
        "selectedItem": [32],
        "selectedMenuItem": [32],
        "isActiveFromClick": [32],
        "noTransform": [32],
        "inCompactView": [32],
        "resetSelected": [64]
    }, [[0, "hbr-hover", "itemHoverListener"], [0, "hbr-leave", "itemLeaveListener"], [0, "hbr-click", "itemClickListener"], [0, "hbr-hide", "drawerCloseListener"], [6, "click", "handleClickOutside"], [0, "hbr-nav-item-select", "selectItemListener"], [0, "hbr-select", "menuItemListener"]], {
        "activeItem": ["activeItemWatcher"],
        "noTransform": ["noTransformWatcher"],
        "selectedItem": ["selectedItemWatcher"],
        "selectedMenuItem": ["selectedMenuWatcher"],
        "collapsed": ["handleCollapsedChange"],
        "titleless": ["handleTitlelessChange"],
        "inCompactView": ["handleInCompactViewChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-shell-nav", "hbr-icon", "hbr-popup", "hbr-portal", "hbr-tooltip"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-shell-nav":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ShellNav);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-portal":
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

const HbrShellNav = ShellNav;
const defineCustomElement = defineCustomElement$1;

export { HbrShellNav, defineCustomElement };

