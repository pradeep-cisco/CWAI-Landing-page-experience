import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { C as dropdownCaretDown, D as dropdownCaretRight, q as x } from './index2.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$5 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './portal.js';
import { d as defineCustomElement$2 } from './tooltip.js';

const navItemCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host([sentiment=neutral]){--sentiment-bg-color:#6f7680}:host([sentiment=success]){--sentiment-bg-color:#1d69cc}:host([sentiment=warning]){--sentiment-bg-color:#bd7202}:host([sentiment=danger]){--sentiment-bg-color:#d95a1a}:host([sentiment=info]){--sentiment-bg-color:#864ae0}:host([sentiment=error]){--sentiment-bg-color:#cc2d37}:host{--border-radius:var(--hbr-border-radius-lg);--line-height:var(--hbr-font-line-height-dense);--nav-item-normal-width:248px;--nav-item-collapsed-width:104px;--nav-item-titleless-width:56px;--nav-item-active-bg:var(--control-bg-weak-default);--nav-item-active-box-shadow:4px 0px 8px 0px #00000014;--nav-item-active-extra-box-shadow:8px 0px 8px 0px #00000014;--nav-item-border-radius:var(--border-radius);--nav-item-line-height:var(--line-height);--nav-item-prefix-size:24px;--nav-item-hover-bg:var(--base-bg-weak-hover);--nav-item-selected-bg:var(--base-bg-weak-active);--pointer-bg-color:var(--sentiment-bg-color, var(--hbr-color-brand, var(--brand-accent-icon-active)));--drawer-left:280px;--drawer-width:288px;--drawer-collapsed-left:136px;--drawer-collapsed-left-titleless:88px;--drawer-box-shadow:4px 0px 8px 0px #00000014;--drawer-border-radius:0 var(--hbr-border-radius-lg) var(--hbr-border-radius-lg) 0;--drawer-z-index:var(--hbr-z-index-drawer);--drawer-transition-duration:300ms;--switcher-border-color:var(--control-border-weak-default);position:relative;display:flex}:host ::slotted(hbr-menu-item::part(base)){background:black}:host hbr-tooltip::part(base){margin-top:12px;left:4px}:host ::slotted(div[slot=content-header]){font-size:12px;line-height:18px;color:var(--base-text-medium-default)}:host ::slotted(div[slot=content]){display:-webkit-box;line-clamp:3;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;white-space:normal}.tab_popover-active{width:100%}.nav{--hover-color:var(--color-sentiment-text);--active-color:var(--color-sentiment-text);--focus-color:var(--color-sentiment-text)}.nav ::slotted(.trigger){display:flex;align-items:center}.nav ::slotted(hbr-dropdown){--trigger-color:var(--base-text-default);--trigger-open-color:var(--slot-sentiment-color);--trigger-hover-color:var(--slot-sentiment-color);--trigger-selected-color:var(--slot-sentiment-color)}.nav-item__wrapper{width:100%;border-radius:var(--nav-item-border-radius)}.nav-item__wrapper--collapsed{width:var(--nav-item-collapsed-width, auto)}.nav-item__wrapper--titleless{width:var(--nav-item-titleless-width, auto)}.nav-item__wrapper-active{width:100%;box-shadow:var(--nav-item-active-box-shadow)}.nav-item__wrapper-active>div:first-child{border-top-right-radius:0px;border-bottom-right-radius:0px}.nav-item__wrapper-active::after{content:\"\";position:absolute;top:0;left:100%;width:var(--hbr-spacing-md);height:100%;background:var(--nav-item-active-bg);pointer-events:none;box-shadow:var(--nav-item-active-extra-box-shadow)}.nav-item{font-family:var(--hbr-font-body);line-height:var(--nav-item-line-height);white-space:nowrap;user-select:none;cursor:pointer;display:flex;align-items:center;color:var(--base-text-medium-default);padding:var(--hbr-spacing-xs) var(--hbr-spacing-sm) var(--hbr-spacing-xs) var(--hbr-spacing-md);font-size:var(--hbr-font-size-sm);border-radius:var(--nav-item-border-radius);background-color:inherit;font-weight:var(--hbr-font-weight-bold);width:var(--nav-item-normal-width, auto)}.nav-item:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.nav-item__content{max-width:160px;max-height:60px;overflow:hidden;text-wrap:wrap;font-weight:var(--hbr-font-weight-semibold)}.nav-item__content-placeholder{display:block}.nav-item__tag{margin:0px;line-height:20px}.nav-item .nav-item__selected-pointer{position:absolute;width:var(--hbr-spacing-2xs);height:100%;background-color:var(--pointer-bg-color);left:0px;border-top-left-radius:var(--nav-item-border-radius);border-bottom-left-radius:var(--nav-item-border-radius);display:none}.nav-item .nav-item__prefix{font-size:var(--hbr-font-size-xl);display:flex;height:var(--nav-item-prefix-size);width:var(--nav-item-prefix-size);--path-color-default:var(--hbr-color-neutral-icon, var(--brand-accent-icon-default));--path-color-strong:var(--hbr-color-neutral-icon-strong, var(--base-bg-strong-default));--path-color-medium:var(--hbr-color-neutral-icon-medium, var(--brand-accent-icon-medium-default));--path-color-weak:var(--hbr-color-neutral-icon-weak, var(--brand-accent-icon-weak-default))}.nav-item:not(.nav-item--switcher):not(.nav-item--collapsed) .nav-item__prefix{margin-right:16px}.nav-item:not(.nav-item--switcher):not(.nav-item--collapsed) .nav-item__content:not(.nav-item--switcher){margin-right:4px}.nav-item.nav-item--selected{background-color:var(--nav-item-selected-bg);border-top-left-radius:var(--hbr-border-radius-sm);border-bottom-left-radius:var(--hbr-border-radius-sm)}.nav-item.nav-item--selected:not(.nav-item--switcher){color:var(--base-text-default)}.nav-item.nav-item--selected .nav-item__label{color:var(--base-text-default)}.nav-item.nav-item--selected .nav-item__prefix{--path-color-default:var(--sentiment-bg-color, var(--hbr-color-brand-icon, var(--brand-accent-icon-active)));--path-color-strong:var(--sentiment-bg-color, var(--hbr-color-brand-icon-strong, var(--brand-accent-icon-medium-active)));--path-color-medium:var(--sentiment-bg-color, var(--hbr-color-brand-icon-medium, var(--brand-accent-icon-medium-active)));--path-color-weak:var(--sentiment-bg-color, var(--hbr-color-brand-icon-weak, var(--brand-accent-icon-weak-active)))}.nav-item.nav-item--selected .nav-item__selected-pointer{display:block;height:100%;top:0}.nav-item:hover>.nav-item__prefix{--path-color-default:var(--sentiment-bg-color, var(--hbr-color-brand-icon, var(--brand-accent-icon-active)));--path-color-strong:var(--sentiment-bg-color, var(--hbr-color-brand-icon-strong, var(--brand-accent-icon-medium-active)));--path-color-medium:var(--sentiment-bg-color, var(--hbr-color-brand-icon-medium, var(--brand-accent-icon-medium-active)));--path-color-weak:var(--sentiment-bg-color, var(--hbr-color-brand-icon-weak, var(--brand-accent-icon-weak-active)))}.nav-item:hover{background:var(--nav-item-hover-bg)}.nav-item:hover:not(.nav-item--switcher){color:var(--base-text-default)}.nav-item:hover .nav-item__prefix{--path-color-default:var(--sentiment-bg-color, var(--hbr-color-brand-icon, var(--brand-accent-icon-active)));--path-color-strong:var(--sentiment-bg-color, var(--hbr-color-brand-icon-strong, var(--brand-accent-icon-medium-active)));--path-color-medium:var(--sentiment-bg-color, var(--hbr-color-brand-icon-medium, var(--brand-accent-icon-medium-active)));--path-color-weak:var(--sentiment-bg-color, var(--hbr-color-brand-icon-weak, var(--brand-accent-icon-weak-active)))}.nav-item.nav-item--active{background:var(--nav-item-active-bg)}.nav-item.nav-item--active .nav-item__prefix{--path-color-default:var(--sentiment-bg-color, var(--hbr-color-brand-icon, var(--brand-accent-icon-active)));--path-color-strong:var(--sentiment-bg-color, var(--hbr-color-brand-icon-strong, var(--brand-accent-icon-medium-active)));--path-color-medium:var(--sentiment-bg-color, var(--hbr-color-brand-icon-medium, var(--brand-accent-icon-medium-active)));--path-color-weak:var(--sentiment-bg-color, var(--hbr-color-brand-icon-weak, var(--brand-accent-icon-weak-active)))}.nav-item.nav-item--active .nav-item__suffix{visibility:hidden}.nav-item.nav-item--active:hover{margin-left:0;width:inherit}.nav-item.nav-item--popover.nav-item--switcher.nav-item--collapsed{min-height:78px;max-height:114px;padding-top:calc(var(--hbr-spacing-sm) - 2px);padding-bottom:calc(var(--hbr-spacing-sm) - 2px)}.nav-item.nav-item--popover.nav-item--active{background:var(--nav-item-active-bg);border:none}.nav-item.nav-item--popover.nav-item--active:not(.nav-item--switcher){color:var(--base-text-default)}.nav-item.nav-item--popover.nav-item--active .nav-item__prefix{--path-color-default:var(--sentiment-bg-color, var(--hbr-color-brand-icon, var(--brand-accent-icon-active)));--path-color-strong:var(--sentiment-bg-color, var(--hbr-color-brand-icon-strong, var(--brand-accent-icon-medium-active)));--path-color-medium:var(--sentiment-bg-color, var(--hbr-color-brand-icon-medium, var(--brand-accent-icon-medium-active)));--path-color-weak:var(--sentiment-bg-color, var(--hbr-color-brand-icon-weak, var(--brand-accent-icon-weak-active)))}.nav-item.nav-item--popover.nav-item--active.nav-item--switcher{justify-content:flex-start;padding-top:9px;padding-bottom:9px}.nav-item.nav-item--popover.nav-item--active.nav-item--switcher.nav-item--collapsed{padding-top:6px;padding-bottom:6px}.nav-item.nav-item--popover.nav-item--active.nav-item--switcher:not(.nav-item--collapsed){padding-left:calc(var(--hbr-spacing-sm))}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed{display:flex;flex-direction:column;min-height:70px;height:auto;max-height:90px;width:100%;font-size:var(--hbr-font-size-xs);text-align:center}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed.nav-item--switcher{justify-content:center;min-height:78px;max-height:114px;padding-top:var(--hbr-spacing-sm);padding-bottom:var(--hbr-spacing-sm)}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed .nav-item__suffix{display:none}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed.nav-item--no-label{height:40px;min-height:40px;width:56px;padding:var(--hbr-spacing-xs) var(--hbr-spacing-md)}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed.nav-item--no-label.nav-item--switcher{padding:var(--hbr-spacing-sm) var(--hbr-spacing-xs);width:56px;height:56px;max-height:56px}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed.nav-item--no-label.nav-item--switcher.nav-item--active{height:56px;width:56px}.nav-item.nav-item--popover.nav-item--active.nav-item--collapsed.nav-item--no-label.nav-item--switcher .nav-item__content{display:none}.nav-item.nav-item--switcher{padding:calc(var(--hbr-spacing-xs) - 1px) calc(var(--hbr-spacing-sm) - 2px);border:var(--switcher-border, var(--hbr-spacing-3xs) solid var(--switcher-border-color));min-height:56px;max-height:96px;gap:12px;justify-content:space-between}.nav-item.nav-item--switcher .nav-item__suffix{padding-top:20px;width:16px}.nav-item.nav-item--switcher .nav-item__content{color:var(--base-text-default);max-height:78px;width:152px}.nav-item.nav-item--switcher>.nav-item__content{width:152px}.nav-item.nav-item--switcher .nav-item__selected-pointer{display:none}.nav-item.nav-item--switcher .nav-item__prefix{font-size:32px;height:32px;width:32px}.nav-item.nav-item--switcher.nav-item--collapsed.nav-item--no-label{height:56px;min-height:56px;padding:calc(var(--hbr-spacing-sm) - var(--hbr-spacing-3xs)) calc(var(--hbr-spacing-xs) - var(--hbr-spacing-3xs))}.nav-item.nav-item--collapsed{display:flex;flex-direction:column;justify-content:center;min-height:70px;max-height:90px;height:auto;width:var(--nav-item-collapsed-width, auto);white-space:normal;font-size:var(--hbr-font-size-xs);text-align:center;padding:var(--hbr-spacing-2xs) calc(1.5 * var(--hbr-spacing-2xs));gap:var(--hbr-spacing-2xs)}.nav-item.nav-item--collapsed.nav-item--switcher{justify-content:center;min-height:78px;max-height:114px}.nav-item.nav-item--collapsed.nav-item--switcher>.nav-item__content{width:88px}.nav-item.nav-item--collapsed .nav-item__label{width:88px}.nav-item.nav-item--collapsed .nav-item__group-label{display:none}.nav-item.nav-item--collapsed .nav-item__suffix{display:none}.nav-item.nav-item--collapsed.nav-item--no-label{padding:calc(var(--hbr-spacing-sm) - var(--hbr-spacing-3xs)) calc(var(--hbr-spacing-xs) - var(--hbr-spacing-3xs));width:56px;height:40px;min-height:40px}.nav-item.nav-item--collapsed.nav-item--no-label .nav-item__content{display:none}.nav-item.nav-item--collapsed.nav-item--active{min-height:70px;width:56px}.nav-item.nav-item--focusevent:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.nav-item.nav-item--collapsed:not(.nav-item--nav)>.nav-item__label,.nav-item.nav-item--collapsed:not(.nav-item--nav)>.nav-item__suffix,.nav-item.nav-item--collapsed:not(.nav-item--nav)>slot{display:none}.nav-item__drawer{position:fixed;bottom:0;top:var(--header-offset, 56px);z-index:0;overflow:hidden;left:var(--drawer-left);border-radius:var(--drawer-border-radius);pointer-events:none}.nav-item__drawer-active{z-index:var(--drawer-z-index);pointer-events:auto}.nav-item__drawer-delay-active{box-shadow:var(--drawer-box-shadow)}.nav-item__drawer-collapsed-item{left:var(--drawer-collapsed-left)}.nav-item__drawer-collapsed-item-titleless{left:var(--drawer-collapsed-left-titleless)}.nav-item__drawer-wrapper{transform:translateX(-100%);transition:transform var(--drawer-transition-duration) ease;display:flex;flex-direction:column;height:100%;background:var(--base-bg-weak-default)}.nav-item__drawer-wrapper-active{transform:translateX(0);width:var(--drawer-width)}.nav-item__drawer-wrapper-no-transform{transition:transform 0s}.nav-item__drawer-header{border-bottom:1px solid var(--base-border-default);font-size:18px;font-weight:var(--hbr-font-weight-semibold);color:var(--base-text-default);padding:22px 24px 16px;display:flex;justify-content:space-between;font-family:var(--hbr-font-heading, inherit);line-height:24px;align-items:flex-end}.nav-item__drawer-menu{padding:16px;overflow-y:auto;flex:1 1 auto}.nav-item__drawer-close{position:absolute;height:28px;width:28px;cursor:pointer;display:flex;justify-content:center;align-items:center;padding:6px;right:18px;top:20px;color:var(--control-icon-weak-default)}.nav-item__drawer-close:hover{background-color:var(--interact-bg-weak-hover);border-radius:var(--hbr-border-radius-md)}.nav-item__drawer-close:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:6px}.nav-item__suffix{margin-left:auto;font-size:16px}.nav-item__prefix,.nav-item__suffix{flex:0 0 auto;display:flex;align-items:center;pointer-events:none}";
const HbrNavItemStyle0 = navItemCss;

const NavItem = /*@__PURE__*/ proxyCustomElement(class NavItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrHover = createEvent(this, "hbr-hover", 7);
        this.hbrLeave = createEvent(this, "hbr-leave", 7);
        this.hbrActive = createEvent(this, "hbr-active", 7);
        this.hbrDrawerClose = createEvent(this, "hbr-hide", 7);
        this.hbrKeydown = createEvent(this, "hbr-keydown", 7);
        this.hbrItemSelect = createEvent(this, "hbr-nav-item-select", 7);
        this.componentId = `nav-${generateShortID()}`;
        this.hasPopover = false;
        this.activeTimer = null;
        this.hoverTimer = null;
        this.handleKeyDown = (event) => {
            if (this.active && event.key === "Escape") {
                this.drawerClose(true);
            }
        };
        this.onSidePanelItemKeyDown = async (event) => {
            this.hbrKeydown.emit(event);
            if ([" ", "Enter", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
                this.onSidePanelItemSelect(true);
            }
        };
        this.handleCloseDrawerKeyDown = (event) => {
            var _a;
            if ([" ", "Enter", "Escape", "ArrowLeft"].includes(event.key)) {
                this.drawerClose(true);
            }
            else if (event.key === "ArrowDown") {
                const target = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.parentElement.nextElementSibling;
                const menuSlot = target.querySelector("slot[name='menu']");
                if (menuSlot) {
                    const content = menuSlot.assignedElements();
                    if (content.length) {
                        const menuItems = content[0].querySelector("hbr-menu-item");
                        menuItems.setFocus();
                    }
                }
            }
            event.stopPropagation();
        };
        this.onSidePanelItemMouseEnter = () => {
            this.hbrHover.emit({ popover: this.hasMenu });
        };
        this.onSidePanelItemMouseLeave = () => {
            this.hbrLeave.emit();
        };
        this.getSlotHasContent = (slot) => {
            var _a, _b;
            return ((_b = (_a = slot === null || slot === void 0 ? void 0 : slot.assignedNodes({ flatten: true })) === null || _a === void 0 ? void 0 : _a.some((node) => {
                var _a;
                if (((_a = node.textContent) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
                    return true;
                }
                return node instanceof HTMLElement && node.children.length > 0;
            })) !== null && _b !== void 0 ? _b : false);
        };
        this.refreshContentState = () => {
            const slot = this.host.shadowRoot.querySelector('slot[name="content"]');
            this.hasContent = this.getSlotHasContent(slot);
        };
        this.observeContentSlot = () => {
            var _a;
            const slot = this.host.shadowRoot.querySelector('slot[name="content"]');
            (_a = this.contentObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            if (!slot) {
                this.hasContent = false;
                return;
            }
            this.refreshContentState();
            if (!this.contentObserver) {
                this.contentObserver = new MutationObserver(() => {
                    this.refreshContentState();
                });
            }
            slot.assignedNodes({ flatten: true }).forEach((node) => {
                this.contentObserver.observe(node, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                });
            });
        };
        this.onSlotUpdate = (slotName) => {
            var _a, _b;
            const slot = this.host.shadowRoot.querySelector(`slot[name="${slotName}"]`);
            if (slotName === "content") {
                this.observeContentSlot();
            }
            // only first slot
            if ((_a = slot === null || slot === void 0 ? void 0 : slot.assignedElements()) === null || _a === void 0 ? void 0 : _a.length) {
                const label = (_b = slot.assignedElements()[0].textContent) === null || _b === void 0 ? void 0 : _b.trim();
                if (!label) {
                    return;
                }
                this.ariaObject = JSON.parse(JSON.stringify({
                    label,
                }));
            }
        };
        this.ariaObject = { label: "" };
        this.hasMenu = false;
        this.hasContent = false;
        this.active = false;
        this.selected = false;
        this.switcher = false;
        this.switcherArrowDown = false;
        this.noTransform = false;
        this.collapsed = false;
        this.arialabel = "";
        this.sentiment = undefined;
        this.titleless = false;
        this.tooltipText = "";
        this.newTag = false;
        this.value = "";
        this.hoverDelay = 0;
        this.drawerTransitionDuration = 300;
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    componentDidLoad() {
        var _a;
        document.addEventListener("keydown", this.handleKeyDown);
        const slot = this.host.shadowRoot.querySelector('slot[name="menu"]');
        if ((_a = slot === null || slot === void 0 ? void 0 : slot.assignedNodes()) === null || _a === void 0 ? void 0 : _a.length) {
            this.hasPopover = true;
        }
        this.onSlotUpdate("content");
        this.onSlotUpdate("content-header");
    }
    disconnectedCallback() {
        var _a;
        document.removeEventListener("keydown", this.handleKeyDown);
        (_a = this.contentObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    /** Sets focus to the tab. */
    async setFocus(options) {
        this.baseRef.focus(options);
        this.setTooltipVisibility(true);
    }
    /** Removes focus from the tab. */
    async removeFocus() {
        this.baseRef.blur();
        this.setTooltipVisibility(false);
    }
    async drawerClose(withKeyboard = false) {
        this.hbrDrawerClose.emit(withKeyboard);
    }
    async setSelectedItem(navItem) {
        this.hbrItemSelect.emit(navItem);
    }
    async onSidePanelItemSelect(keyboard = false) {
        this.hbrClick.emit({ popover: this.hasMenu, keyboard: keyboard });
    }
    async haveMenu() {
        return this.hasMenu;
    }
    async setTooltipVisibility(visible = true) {
        this.tooltipRef.open = visible;
    }
    /**
     * Handles the active state change of a tab navigation item and manages drawer animations.
     *
     * This method manages a sliding in/out animation sequence for the drawer element:
     * - Emits an active event when the tab becomes active
     * - Toggles drawer CSS classes to create smooth transitions
     * - Handles animation delays to prevent overlapping animations when switching between tabs
     * - Uses a timer-based approach to coordinate class additions/removals for proper animation sequencing
     *
     * Animation Flow:
     * - When deactivating: removes the delay class, then removes the active class after delay
     * - When activating: adds active class, and optionally adds delay class based on previous state
     * - The delay class ensures smooth transitions when switching from one active tab to another
     *
     * @param {boolean} active - Whether the tab is becoming active (true) or inactive (false)
     *
     * @remarks
     * - Queries the closest shell-nav component to find the previously active nav item
     * - Respects the `noTransform` flag to determine animation delay behavior
     * - Clears any pending animation timers before starting a new sequence
     * - Animation timing is controlled by the drawer_delay constant
     */
    handleTabActive(active) {
        active && this.hbrActive.emit({ tab: this.host });
        const shellMav = this.host.closest("hbr-shell-nav");
        const prevActiveNav = shellMav === null || shellMav === void 0 ? void 0 : shellMav.querySelector("hbr-nav-item[active]");
        const drawer = this.host.shadowRoot.querySelector(".nav-item__drawer");
        if (drawer) {
            if (!active) {
                drawer.classList.remove("nav-item__drawer-delay-active");
            }
            else {
                drawer.classList.add("nav-item__drawer-active");
            }
            if (prevActiveNav && prevActiveNav !== this.host && this.noTransform) {
                drawer.classList.add("nav-item__drawer-delay-active");
            }
            clearTimeout(this.activeTimer);
            this.activeTimer = setTimeout(() => {
                if (!active) {
                    drawer.classList.remove("nav-item__drawer-active");
                }
                else {
                    if (!(prevActiveNav && prevActiveNav !== this.host && this.noTransform)) {
                        drawer.classList.add("nav-item__drawer-delay-active");
                    }
                }
            }, this.drawerTransitionDuration);
        }
    }
    handleSlotChange() {
        this.hasMenu = hasSlot(this.host, "menu");
    }
    render() {
        var _a, _b;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const isTooltipEnabled = !(((_b = this.tooltipText) === null || _b === void 0 ? void 0 : _b.length) &&
            this.collapsed &&
            this.titleless &&
            !this.active);
        return (h(Host, { key: '009853e5f967c6e05fadd2b5b903b7e118fdf93e', id: this.host.id || this.componentId, sentiment: this.sentiment, "aria-label": this.arialabel === "" ? this.ariaObject.label : this.arialabel, "aria-haspopup": this.hasPopover ? "true" : "false", "aria-current": this.hasMenu ? null : this.selected ? "true" : "false", "aria-expanded": this.hasMenu ? (this.active ? "true" : "false") : null, role: "menuitem" }, h("div", { key: '984842eacb20d520a4bba501cea60e3a60c6750a', class: {
                "nav-item__wrapper": true,
                "nav-item__wrapper-active": this.active,
                "nav-item__wrapper--collapsed": this.collapsed,
                "nav-item__wrapper--titleless": this.collapsed && this.titleless,
            } }, h("div", { key: '5eabe18ecfec86c4831437bf38bde72991e06f1b', part: "base", "data-testid": "base",
            // biome-ignore lint/a11y: nav item trigger is the keyboard focus target
            tabIndex: 0, ref: (el) => {
                this.baseRef = el;
            }, onMouseEnter: () => {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = setTimeout(() => {
                    this.onSidePanelItemMouseEnter();
                }, this.hoverDelay);
            }, onClick: () => {
                this.onSidePanelItemSelect(false);
            }, onMouseLeave: this.onSidePanelItemMouseLeave, onKeyDown: this.onSidePanelItemKeyDown, class: {
                "nav-item": true,
                // variants
                "nav-item--switcher": this.switcher,
                "nav-item--popover": this.hasPopover,
                "nav-item--no-label": this.titleless,
                // states
                "nav-item--active": this.active,
                "nav-item--selected": this.selected,
                "nav-item--collapsed": this.collapsed,
            } }, h("div", { key: '8a12b4ef7143d19c449d540cd7600bc13c352e61', part: "pointer", class: "nav-item__selected-pointer" }), h("span", { key: '64a0833b59c6fe7557c4dab2760a71bf0e998bcf', part: "prefix", class: "nav-item__prefix" }, h("slot", { key: 'ace7d22b37109a4537697d44d102ceebb67c49d1', name: "prefix" })), h("div", { key: '48ee2563b399560e7a7f6c69e55862b5f1d997db', part: "content", class: "nav-item__content" }, !this.collapsed && (h("slot", { name: "content-header", onSlotchange: () => this.onSlotUpdate("content-header") })), h("slot", { key: 'da6b8a7161a111cf4058382b4afab635eba69c89', name: "content", onSlotchange: () => this.onSlotUpdate("content") }), !this.hasContent ? (h("span", { class: "nav-item__content-placeholder" }, "\u2014")) : null), !this.collapsed && this.newTag && (h("span", { part: "tag", class: "nav-item__label-tag" }, h("slot", { name: "tag" }))), h("span", { key: '73220c91516135cc9e00fe6eb4b01abb3d42cb6a', part: "suffix", class: "nav-item__suffix" }, this.switcher && this.switcherArrowDown ? (h("hbr-icon", { slot: "suffix", asset: dropdownCaretDown })) : null, this.hasMenu ? (h("hbr-icon", { slot: "suffix", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dropdown-caret-right"]) ||
                dropdownCaretRight })) : null))), this.hasMenu ? (h("div", { part: "drawer", class: {
                "nav-item__drawer": true,
                "nav-item__drawer-collapsed-item": this.collapsed,
                "nav-item__drawer-collapsed-item-titleless": this.collapsed && this.titleless,
            }, style: {
                "--drawer-transition-duration": `${this.drawerTransitionDuration}ms`,
            }, "aria-hidden": !this.active, "aria-label": this.arialabel === "" ? this.ariaObject.label : this.arialabel }, h("div", { part: "drawer-container", class: {
                "nav-item__drawer-wrapper": true,
                "nav-item__drawer-wrapper-active": this.active,
                "nav-item__drawer-wrapper-no-transform": this.noTransform,
            } }, h("div", { class: "nav-item__drawer-header", part: "drawer-header" }, h("slot", { name: "drawerHeader" }), h("div", { class: "nav-item__drawer-close", role: "button", "aria-label": `Close ${this.arialabel === ""
                ? this.ariaObject.label
                : this.arialabel}`, onClick: () => {
                this.drawerClose();
            }, part: "drawer-close", "data-testid": "drawer-close", tabIndex: 0, onKeyDown: this.handleCloseDrawerKeyDown }, h("hbr-icon", { style: {
                display: "flex",
                alignItems: "center",
                fontSize: "var(--hbr-font-size-md)",
                cursor: "pointer",
                width: "16px",
                height: "16px",
            }, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-icon"]) || x }))), h("div", { class: "nav-item__drawer-menu", part: "drawer-content" }, h("slot", { name: "menu", onSlotchange: this.handleSlotChange }))))) : null, h("hbr-portal", { key: '4280c88e8de4ffd4ba3b63ac247058736c1fcd08' }, h("hbr-tooltip", { key: 'cd3356de005ea53a05d7619922c446637b9df906', ref: (el) => {
                this.tooltipRef = el;
            }, content: this.tooltipText, disabled: isTooltipEnabled, skidding: this.switcher ? 12 : 3, distance: 12, placement: "left-start", anchor: this.baseRef }))));
    }
    get host() { return this; }
    static get watchers() { return {
        "active": ["handleTabActive"]
    }; }
    static get style() { return HbrNavItemStyle0; }
}, [1, "hbr-nav-item", {
        "active": [516],
        "selected": [516],
        "switcher": [516],
        "switcherArrowDown": [4, "switcher-arrow-down"],
        "noTransform": [516, "no-transform"],
        "collapsed": [516],
        "arialabel": [1],
        "sentiment": [513],
        "titleless": [516],
        "tooltipText": [513, "tooltip-text"],
        "newTag": [4, "new-tag"],
        "value": [513],
        "hoverDelay": [2, "hover-delay"],
        "drawerTransitionDuration": [2, "drawer-transition-duration"],
        "ariaObject": [32],
        "hasMenu": [32],
        "hasContent": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "drawerClose": [64],
        "setSelectedItem": [64],
        "onSidePanelItemSelect": [64],
        "haveMenu": [64],
        "setTooltipVisibility": [64]
    }, undefined, {
        "active": ["handleTabActive"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-nav-item", "hbr-icon", "hbr-popup", "hbr-portal", "hbr-tooltip"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-nav-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, NavItem);
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

const HbrNavItem = NavItem;
const defineCustomElement = defineCustomElement$1;

export { HbrNavItem, defineCustomElement };

