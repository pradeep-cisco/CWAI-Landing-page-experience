import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { p as parseDuration } from './animate.js';
import { g as generateShortID } from './function-helper.js';
import { s as scrollIntoView } from './scroll.js';
import { g as getNearestTabbableElement } from './browser.js';
import { d as defineCustomElement$1 } from './popup.js';

const dropdownCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--trigger-padding:var(--hbr-spacing-3xs) 0px;--trigger-border:none;--trigger-background-color:transparent;--trigger-background-hover-color:transparent;--trigger-background-open-color:transparent;--trigger-hover-color:var(--interact-bg-hover);--trigger-open-color:var(--interact-bg-hover);--trigger-selected-color:var(--trigger-color);--trigger-disabled-color:var(--interact-bg-disabled);--trigger-font-weight:var(--hbr-font-weight-normal);--trigger-error:var(--negative-bg-default);--trigger-gap:2px;--trigger-focus-ring:0 0 0 var(--hbr-focus-ring-width) var(--interact-border-medium-hover);--panel-box-shadow:var(--hbr-shadow-md);--panel-border-radius:var(--hbr-border-radius-md);--panel-border:none;--panel-max-height:50vh;--panel-overflow:auto;--popup-z-index:var(--hbr-z-index-dropdown);height:fit-content;display:inline-block}:host([size=small]) .dropdown .dropdown__trigger{border-radius:var(--hbr-border-radius-sm)}:host([size=medium]) .dropdown .dropdown__trigger{border-radius:var(--hbr-border-radius-md)}:host([size=large]) .dropdown .dropdown__trigger{border-radius:var(--hbr-border-radius-lg)}.dropdown{position:relative;font-size:var(--hbr-font-size-sm)}.dropdown .dropdown__trigger{border:var(--trigger-border);background-color:var(--trigger-background-color);font-weight:var(--trigger-font-weight);display:flex;align-items:center}.dropdown.dropdown--open .dropdown__trigger{background-color:var(--trigger-background-open-color)}.dropdown.dropdown--disabled .dropdown__trigger{cursor:not-allowed}.dropdown::part(popup){z-index:var(--popup-z-index)}.dropdown.dropdown--menu.dropdown--disabled .dropdown__trigger,.dropdown.dropdown--menu.dropdown--disabled .dropdown__arrow-down-icon{color:var(--trigger-disabled-color)}.dropdown.dropdown--menu.dropdown--selected .dropdown__trigger,.dropdown.dropdown--menu.dropdown--selected .dropdown__arrow-down-icon{color:var(--trigger-selected-color)}.dropdown.dropdown--menu .dropdown__trigger:focus-visible{box-shadow:var(--trigger-focus-ring);outline:none}.dropdown__positioner{position:absolute;z-index:var(--hbr-z-index-dropdown, 800);border-radius:var(--panel-border-radius)}.dropdown__panel{box-sizing:border-box;max-height:var(--panel-max-height);box-shadow:var(--panel-box-shadow);border-radius:var(--panel-border-radius);border:var(--panel-border);overflow:var(--panel-overflow);overscroll-behavior:none}.dropdown__panel-autosize{max-height:var(--auto-size-available-height);max-width:var(--auto-size-available-width)}.dropdown__panel-autosize ::slotted(hbr-menu){--max-height:var(--auto-size-available-height);--max-width:var(--auto-size-available-width);--minwidth:none}.dropdown__arrow-down-icon-hide{display:none}.dropdown--disabled{user-select:none}.dropdown--disabled:hover .dropdown__trigger{cursor:not-allowed}.dropdown--disabled .dropdown__trigger{color:var(--trigger-disabled-color)}.dropdown.dropdown--error{--trigger-color:var(--trigger-error);--trigger-open-color:var(--trigger-error);--trigger-hover-color:var(--trigger-error)}.dropdown .dropdown__trigger{cursor:pointer}.hbr-dropdown-wrapper{display:inline-block;height:100%;width:auto}.hbr-dropdown-wrapper .hbr-dropdown-ref{display:flex;align-items:center;column-gap:var(--hbr-spacing-sm)}";
const HbrDropdownStyle0 = dropdownCss;

const Dropdown = /*@__PURE__*/ proxyCustomElement(class Dropdown extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrSelect = createEvent(this, "hbr-select", 7);
        this.hbrDismiss = createEvent(this, "hbr-dismiss", 7);
        //for highlighting first item when dropdown is on display
        this.isKeyboardEvent = false;
        this.isFirstItemFocus = true;
        this.shortId = generateShortID();
        this.isFirstTimeOpen = true;
        this.handleKeyDown = (event) => {
            // Close when escape is pressed inside an open dropdown. We need to listen on the panel itself and stop propagation
            // in case any ancestors are also listening for this key.
            if (this.open && event.key === "Escape") {
                event.stopPropagation();
                this.hide();
                this.focusOnTrigger();
            }
        };
        this.getIsComboBox = () => { var _a; return this.anchorRef && ((_a = this.anchorRef) === null || _a === void 0 ? void 0 : _a.tagName) === "HBR-COMBOBOX"; };
        this.handleTreeItemArrowUpDown = (key) => {
            var _a, _b;
            if (((_a = this.anchorRef) === null || _a === void 0 ? void 0 : _a.closest('[slot="interactive"]')) &&
                ((_b = this.anchorRef) === null || _b === void 0 ? void 0 : _b.closest("hbr-tree-item"))) {
                if (["ArrowDown", "ArrowUp"].includes(key)) {
                    return true;
                }
            }
        };
        // $$custom
        this.handleFocus = () => {
            if (this.hasTrigger("focus") && !this.skipHandlingFocusOnTrigger) {
                this.show();
            }
            this.skipHandlingFocusOnTrigger = false;
        };
        // $$custom
        this.handleTriggerMouseEnter = () => {
            this.isKeyboardEvent = false;
            if (!this.disabled && this.hasTrigger("hover") && !this.manualTrigger) {
                const delay = parseDuration(getComputedStyle(this.host).getPropertyValue("--hide-delay"));
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = window.setTimeout(() => this.show(), delay);
            }
        };
        // $$custom
        this.handleTriggerMouseLeave = (e) => {
            if (!this.disabled && this.hasTrigger("hover") && !this.manualTrigger) {
                // if the event is on the trigger,
                // if pointer is within (this.distance) from around the panel, do not hide
                // OR if the event is on the panel,
                // if pointer is within (this.distance) from around the trigger, do not hide
                const rect = this.popupContentRef.getBoundingClientRect();
                if (e.clientX < rect.left - this.distance ||
                    e.clientX > rect.right + this.distance ||
                    e.clientY < rect.top - this.distance ||
                    e.clientY > rect.bottom + this.distance) {
                    this.hide();
                }
            }
        };
        this.handlePopupContentMouseLeave = (_) => {
            if (this.open &&
                !this.disabled &&
                this.trigger === "hover" &&
                !this.manualTrigger) {
                this.hide();
            }
        };
        // $$custom
        this.handleMenuItemCheck = () => {
            if (this.uncontrolled)
                return;
            if (!this.multiple) {
                const menu = this.getMenu();
                const menuItems = menu
                    ? Array.from(menu.querySelectorAll("hbr-menu-item"))
                    : [];
                if (menuItems.length) {
                    const checkedList = menuItems.filter((item) => item.checked);
                    if (checkedList.length)
                        this.value = checkedList[0].value;
                }
            }
        };
        this.isSelected = false;
        this.anchor = undefined;
        this.flipBoundary = undefined;
        this.flipPadding = 0;
        this.contentId = `hbr-dropdown-id-${this.shortId}`;
        this.open = false;
        this.placement = "bottom-start";
        this.disabled = false;
        this.closeOnSelect = true;
        this.containingElement = undefined;
        this.menuFitTrigger = false;
        this.panelFitTrigger = false;
        this.manualTrigger = false;
        this.multiple = false;
        this.noFocusoutTillPanelClose = false;
        this.distance = 4;
        this.skidding = 0;
        this.autoSize = undefined;
        this.autoSizePadding = undefined;
        this.hoist = false;
        this.trigger = "click";
        this.size = "medium";
        this.menu = false;
        this.sentiment = "interact";
        this.value = undefined;
        this.nested = false;
        this.uncontrolled = false;
        this.closeOnScroll = false;
        this.enablePopover = false;
    }
    /** Shows the dropdown panel. */
    async show() {
        if (this.open) {
            return undefined;
        }
        this.open = true;
    }
    /** Hides the dropdown panel */
    async hide() {
        if (!this.open) {
            return undefined;
        }
        this.open = false;
    }
    /** Forces the dropdown's menu to reposition. */
    async reposition() {
        var _a;
        if (!this.open) {
            return;
        }
        (_a = this.popupRef) === null || _a === void 0 ? void 0 : _a.reposition();
    }
    // $$custom
    listenClosePopover() {
        this.hide();
    }
    // $$custom
    listenTriggerFocus() {
        this.focusOnTrigger();
    }
    // $$custom
    handleAnchorChange() {
        if (this.anchor && typeof this.anchor === "string") {
            this.anchorRef = document === null || document === void 0 ? void 0 : document.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLElement) {
            this.anchorRef = this.anchor;
        }
        if (this.anchorRef) {
            this.bindEventsToAnchor();
        }
    }
    // $$custom
    setMenuValue() {
        var _a;
        if (this.uncontrolled)
            return;
        if (this.multiple) {
            this.syncItemsFromValue();
        }
        else {
            this.handleItemSelected();
        }
        this.isSelected = this.multiple ? !!((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) : !!this.value;
    }
    async handleOpenChange() {
        if (!this.popupRef)
            return;
        if (this.getIsComboBox()) {
            const anchorRef = this.anchorRef;
            if (anchorRef.disabled)
                return;
            anchorRef.open = this.open;
        }
        if (this.disabled) {
            this.open = false;
            return;
        }
        this.updateAccessibleTrigger();
        if (this.open) {
            // Show
            this.hbrShow.emit();
            this.addOpenListeners();
            this.popupContentRef.hidden = false;
            this.popupRef.active = true;
            this.hbrAfterShow.emit();
            await this.focusOnFirstMenuItem();
        }
        else {
            // Hide
            this.hbrHide.emit();
            this.removeOpenListeners();
            this.popupRef.active = false;
            this.popupContentRef.hidden = true;
            this.hbrAfterHide.emit();
            const items = Array.from(this.host.querySelectorAll("hbr-menu-item[open]"));
            items.forEach((item) => {
                item.open = false;
            });
        }
    }
    addOpenListeners() {
        this.popupContentRef.addEventListener("hbr-select", this.handlePanelSelect);
        this.popupContentRef.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keydown", this.handleDocumentKeyDown);
        document.addEventListener("mousedown", this.handleDocumentMouseDown);
        this.closeOnScroll &&
            document.addEventListener("scroll", this.handleCloseOnScroll, true);
    }
    removeOpenListeners() {
        if (this.popupContentRef) {
            this.popupContentRef.removeEventListener("hbr-select", this.handlePanelSelect);
            this.popupContentRef.removeEventListener("keydown", this.handleKeyDown);
        }
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        document.removeEventListener("mousedown", this.handleDocumentMouseDown);
        this.closeOnScroll &&
            document.removeEventListener("scroll", this.handleCloseOnScroll, true);
    }
    connectedCallback() {
        if (!this.containingElement) {
            this.containingElement = this.host;
        }
        // $$custom , are all these bindings needed?
        this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
        this.handleDocumentMouseDown = this.handleDocumentMouseDown.bind(this);
        this.handleMenuItemActivate = this.handleMenuItemActivate.bind(this);
        this.handlePanelSelect = this.handlePanelSelect.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleTriggerKeyDown = this.handleTriggerKeyDown.bind(this);
        this.handleTriggerKeyUp = this.handleTriggerKeyUp.bind(this);
        this.handleTriggerSlotChange = this.handleTriggerSlotChange.bind(this);
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.setNestedSelected = this.setNestedSelected.bind(this);
        this.syncItemsFromValue = this.syncItemsFromValue.bind(this);
        this.syncValueFromItems = this.syncValueFromItems.bind(this);
        this.getValueAsArray = this.getValueAsArray.bind(this);
        this.handleMenuSelect = this.handleMenuSelect.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
        this.updateAccessibleTrigger = this.updateAccessibleTrigger.bind(this);
        this.reposition = this.reposition.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleCloseOnScroll = this.handleCloseOnScroll.bind(this);
        this.resizeObserver = new ResizeObserver(() => this.resizeMenu());
    }
    componentDidLoad() {
        this.handleAnchorChange();
        this.popupContentRef.hidden = !this.open;
        // If the dropdown is visible on init, update its position
        if (this.open) {
            this.addOpenListeners();
            this.popupRef.active = true;
        }
        // $$custom
        if (!this.getIsComboBox()) {
            this.setMenuValue();
        }
        (this.menuFitTrigger || this.panelFitTrigger) &&
            this.resizeObserver.observe(this.host);
        // this.bindEventsToAnchor();
    }
    disconnectedCallback() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.host);
        this.removeOpenListeners();
        this.hide();
    }
    handleCloseOnScroll() {
        if (this.open)
            this.open = false;
    }
    // $$custom - // slightly modified and has extra cases
    focusOnTrigger() {
        let trigger;
        if (this.anchor) {
            trigger = this.anchorRef;
        }
        else {
            const slot = this.anchorRef.querySelector("slot[name='trigger']");
            trigger = slot === null || slot === void 0 ? void 0 : slot.assignedElements({ flatten: true })[0];
        }
        if (trigger) {
            if (typeof trigger.setFocus === "function") {
                trigger.setFocus();
                this.skipHandlingFocusOnTrigger = true;
            }
            else if (typeof trigger.focus === "function") {
                trigger.focus();
                this.skipHandlingFocusOnTrigger = true;
            }
        }
    }
    getMenu() {
        const menu = this.host.querySelector("hbr-menu");
        return menu ? menu : null;
    }
    // $$custom
    resizeMenu() {
        if (this.menuFitTrigger) {
            const menu = this.getSlotMenu();
            if (menu.length) {
                menu[0].style.setProperty("--min-width", `${this.anchorRef.clientWidth}px`);
                // Above doesn't work because width overrides min-width, so set one of the child item's min-width as well
                const firstChild = menu[0].firstElementChild;
                firstChild === null || firstChild === void 0 ? void 0 : firstChild.style.setProperty("min-width", `${this.anchorRef.clientWidth}px`);
            }
            this.reposition();
        }
        if (this.panelFitTrigger) {
            this.popupContentRef.style.minWidth = `${this.anchorRef.clientWidth}px`;
            this.reposition();
        }
    }
    handleDocumentKeyDown(event) {
        var _a;
        this.isKeyboardEvent = true;
        // Close when escape or tab is pressed
        if (event.key === "Escape" && this.open) {
            event.stopPropagation();
            this.focusOnTrigger();
            this.hide();
            return;
        }
        // Handle tabbing
        if (event.key === "Tab") {
            // Tabbing within an open menu should close the dropdown and refocus the trigger
            if (this.open &&
                ((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) === "hbr-menu-item") {
                event.preventDefault();
                this.hide();
                this.focusOnTrigger();
                return;
            }
            // Tabbing outside of the containing element closes the panel
            //
            // If the dropdown is used within a shadow DOM, we need to obtain the activeElement within that shadowRoot,
            // otherwise `document.activeElement` will only return the name of the parent shadow DOM element.
            setTimeout(() => {
                var _a;
                const activeElement = this.containingElement.getRootNode() instanceof ShadowRoot
                    ? (_a = document.activeElement.shadowRoot) === null || _a === void 0 ? void 0 : _a.activeElement
                    : document.activeElement;
                if (!this.containingElement ||
                    (activeElement === null || activeElement === void 0 ? void 0 : activeElement.closest(this.containingElement.tagName.toLowerCase())) !== this.containingElement) {
                    this.hide();
                }
            });
        }
    }
    handleDocumentMouseDown(event) {
        const path = event.composedPath();
        if (this.containingElement &&
            !path.includes(this.host) &&
            !path.includes(this.anchorRef)) {
            this.hide();
        }
    }
    handlePanelSelect(event) {
        const target = event.target;
        // Hide the dropdown when a menu item is selected
        if (this.closeOnSelect && target.tagName.toLowerCase() === "hbr-menu") {
            this.hide();
            this.focusOnTrigger();
        }
    }
    // $$custom
    handleMenuItemActivate(event) {
        const item = event.target;
        scrollIntoView(item, this.popupContentRef);
    }
    handleTriggerClick(_e, isKeyboardEvent) {
        if (this.disabled || this.manualTrigger)
            return;
        if (this.open) {
            if (this.getIsComboBox())
                return;
            this.hide();
        }
        else {
            this.show();
            this.isKeyboardEvent = !!isKeyboardEvent;
        }
    }
    handleTriggerKeyDown(event) {
        if (this.manualTrigger)
            return;
        // When spacebar/enter is pressed, show the panel but don't focus on the menu. This let's the user press the same
        // key again to hide the menu in case they don't want to make a selection.
        const enterSpace = ["Enter", " "];
        if (this.getIsComboBox())
            enterSpace.pop();
        if (enterSpace.includes(event.key)) {
            event.preventDefault();
            this.isKeyboardEvent = true;
            this.isFirstItemFocus = true;
            this.show();
        }
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            if (this.handleTreeItemArrowUpDown(event.key))
                return;
            event.preventDefault();
            if (event.key === "ArrowDown" || event.key === "Home") {
                this.isKeyboardEvent = true;
                this.isFirstItemFocus = true;
                this.open && this.focusOnFirstMenuItem();
                this.show();
                return;
            }
            if (event.key === "ArrowUp") {
                this.isKeyboardEvent = true;
                this.isFirstItemFocus = false;
                this.open && this.focusOnFirstMenuItem();
                this.show();
                return;
            }
        }
        else if (event.key === "Escape") {
            this.hide();
            this.focusOnTrigger();
            return;
        }
    }
    handleTriggerKeyUp(event) {
        if (this.getIsComboBox())
            return;
        // Prevent space from triggering a click event in Firefox
        this.isKeyboardEvent = true;
        if (event.key === " ") {
            event.preventDefault();
        }
    }
    handleTriggerSlotChange() {
        this.updateAccessibleTrigger();
    }
    //
    // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
    // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
    // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
    // a child of the slotted element, or an element in the slotted element's shadow root.
    //
    // For example, the accessible trigger of an <hbr-button> is a <button> located inside its shadow root.
    //
    // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
    //
    updateAccessibleTrigger() {
        let accessibleTrigger = null;
        if (this.anchor && this.anchorRef) {
            accessibleTrigger = getNearestTabbableElement(this.anchorRef);
        }
        if (!this.anchor && this.anchorRef) {
            const slot = this.anchorRef.querySelector("slot");
            const assignedElements = slot.assignedElements({
                flatten: true,
            });
            accessibleTrigger = assignedElements.map(getNearestTabbableElement)[0];
        }
        if (accessibleTrigger) {
            accessibleTrigger.setAttribute("aria-haspopup", "true");
            accessibleTrigger.setAttribute("aria-expanded", this.open ? "true" : "false");
        }
    }
    // $$custom
    async focusOnFirstMenuItem() {
        if (this.menu && this.isKeyboardEvent) {
            this.isFirstTimeOpen && (await customElements.whenDefined("hbr-menu"));
            const menu = this.getMenu();
            if (menu) {
                this.isFirstTimeOpen &&
                    (await customElements.whenDefined("hbr-menu-item"));
                const menuItems = await menu.getMenuItems();
                if (menuItems.length) {
                    let item;
                    if (this.isFirstItemFocus) {
                        item = menuItems[0];
                    }
                    else {
                        item = menuItems[menuItems.length - 1];
                    }
                    item === null || item === void 0 ? void 0 : item.setFocus({}, true, 100);
                    if (this.isFirstTimeOpen) {
                        this.isFirstTimeOpen = false;
                    }
                }
            }
        }
        this.isKeyboardEvent = false;
    }
    // $$custom
    hasTrigger(triggerType) {
        const triggers = this.trigger.split(" ");
        return triggers.includes(triggerType);
    }
    // $$custom
    setNestedSelected(item) {
        const menuItem = item.closest("hbr-menu-item[nested]");
        if (menuItem === null || menuItem === void 0 ? void 0 : menuItem.nested) {
            menuItem.nestedSelected = true;
            const menu = menuItem.closest("hbr-menu");
            if (menu) {
                const parentItem = menu.closest("hbr-menu-item[nested]");
                parentItem && this.setNestedSelected(parentItem);
            }
        }
    }
    // $$custom
    handleItemSelected() {
        this.getItems().forEach((item) => {
            const checked = item.value === this.value;
            if (item.nested && !checked) {
                item.nestedSelected = false;
            }
            checked && this.setNestedSelected(item);
            item.checked = checked;
        });
    }
    // $$custom
    getItems() {
        return [
            ...this.host.querySelectorAll("hbr-menu-item"),
        ];
    }
    // $$custom
    getValueAsArray() {
        if (this.multiple && this.value === "") {
            return [];
        }
        return Array.isArray(this.value) ? this.value : [this.value];
    }
    // $$custom
    syncItemsFromValue() {
        const menusItemList = this.getItems();
        const value = this.getValueAsArray();
        menusItemList.forEach((item) => {
            item.checked = value.includes(item.value);
        });
    }
    // $$custom
    syncValueFromItems() {
        const menusItemList = this.getItems();
        const checkedItems = menusItemList.filter((item) => item.checked);
        const checkedValues = checkedItems.map((item) => item.value);
        this.value = checkedValues;
    }
    // $$custom
    getSlotMenu() {
        const slot = this.popupContentRef.querySelector("slot");
        return [...slot.assignedElements()].filter((e) => e.tagName.toLocaleLowerCase() === "hbr-menu");
    }
    // $$custom
    handleMenuSelect(e) {
        var _a;
        if (this.uncontrolled)
            return;
        e.stopPropagation();
        if ((_a = e.detail) === null || _a === void 0 ? void 0 : _a.item) {
            if (this.multiple) {
                this.syncValueFromItems();
            }
            else {
                this.getItems().forEach((item) => {
                    var _a;
                    if ((_a = e.detail) === null || _a === void 0 ? void 0 : _a.item)
                        item.checked = item === e.detail.item;
                });
            }
        }
        this.hbrSelect.emit(e.detail);
    }
    bindEventsToAnchor() {
        if (!this.anchorRef)
            return;
        //$$custom
        this.anchorRef.addEventListener("focus", this.handleFocus, true);
        this.anchorRef.onclick = this.handleTriggerClick;
        this.anchorRef.onkeydown = this.handleTriggerKeyDown;
        this.anchorRef.onkeyup = this.handleTriggerKeyUp;
        //$$custom
        this.anchorRef.onmouseenter = this.handleTriggerMouseEnter;
        this.anchorRef.onmouseleave = this.handleTriggerMouseLeave;
    }
    render() {
        const autoSize = this.autoSize === "off" ? undefined : this.autoSize || "vertical";
        const defaultPadding = this.autoSize === undefined ? 10 : 24;
        const autoSizePadding = this.autoSizePadding !== undefined
            ? this.autoSizePadding
            : defaultPadding;
        return (h(Host, { key: '48424cc98a0bb2d3ab4153ca44b566a7406831c0' }, h("hbr-popup", { key: '037750960bb96637bec77aa815f2932a9649e650', part: "base", exportparts: "popup", id: this.contentId, placement: this.placement, distance: this.distance, skidding: this.skidding, strategy: this.hoist || this.hoist === "true" ? "fixed" : "absolute", flip: true, shift: true, autoSize: autoSize, enablePopover: this.enablePopover, autoSizePadding: autoSizePadding, flipPadding: this.flipPadding, flipBoundary: this.flipBoundary, ref: (el) => {
                this.popupRef = el;
            }, anchor: this.anchor, class: {
                dropdown: true,
                "dropdown--open": this.open,
                "dropdown--menu": this.menu,
                "dropdown--selected": this.isSelected,
                "dropdown--disabled": this.disabled,
                "dropdown--small": this.size === "small",
                "dropdown--medium": this.size === "medium",
                "dropdown--large": this.size === "large",
            }, "onhbr-select": this.handleMenuSelect, "onhbr-checked": this.handleMenuItemCheck, onFocusout: (e) => {
                if (this.noFocusoutTillPanelClose && this.open) {
                    e.stopPropagation();
                }
            } }, !this.anchor ? (h("span", { part: "trigger", slot: "anchor", class: "dropdown__trigger", ref: (el) => {
                this.anchorRef = el;
            } }, h("slot", { name: "trigger", onSlotchange: this.handleTriggerSlotChange }))) : null, h("div", { key: '83b0e183591707e1fcf9a47c89922b245693c33f', ref: (el) => {
                this.popupContentRef = el;
            }, part: "panel", class: {
                dropdown__panel: true,
                "dropdown__panel-autosize": this.autoSize && this.autoSize !== "off",
            }, "aria-hidden": this.open ? "false" : "true", "aria-labelledby": this.contentId, onMouseLeave: this.handlePopupContentMouseLeave }, h("slot", { key: 'db0782cdee6edb717b38205d0156c72e94735d35' })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "anchor": ["handleAnchorChange"],
        "value": ["setMenuValue"],
        "open": ["handleOpenChange"]
    }; }
    static get style() { return HbrDropdownStyle0; }
}, [1, "hbr-dropdown", {
        "anchor": [1],
        "flipBoundary": [16],
        "flipPadding": [2, "flip-padding"],
        "contentId": [513, "content-id"],
        "open": [1540],
        "placement": [513],
        "disabled": [516],
        "closeOnSelect": [516, "close-on-select"],
        "containingElement": [1040],
        "menuFitTrigger": [1540, "menu-fit-trigger"],
        "panelFitTrigger": [1540, "panel-fit-trigger"],
        "manualTrigger": [1540, "manual-trigger"],
        "multiple": [516],
        "noFocusoutTillPanelClose": [516, "no-focusout-till-panel-close"],
        "distance": [2],
        "skidding": [2],
        "autoSize": [513, "auto-size"],
        "autoSizePadding": [520, "auto-size-padding"],
        "hoist": [8],
        "trigger": [513],
        "size": [513],
        "menu": [516],
        "sentiment": [513],
        "value": [1537],
        "nested": [1540],
        "uncontrolled": [1540],
        "closeOnScroll": [516, "close-on-scroll"],
        "enablePopover": [4, "enable-popover"],
        "isSelected": [32],
        "show": [64],
        "hide": [64],
        "reposition": [64]
    }, [[0, "hbr-hide-popover", "listenClosePopover"], [0, "hbr-trigger-focus", "listenTriggerFocus"]], {
        "anchor": ["handleAnchorChange"],
        "value": ["setMenuValue"],
        "open": ["handleOpenChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-dropdown", "hbr-popup"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Dropdown);
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Dropdown as D, defineCustomElement as d };

