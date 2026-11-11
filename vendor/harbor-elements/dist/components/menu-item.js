import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { d as check, a as caretRight } from './index2.js';
import { a as addConstructedStyle } from './browser.js';
import { g as getBootstrapConfig, d as defineCustomElement$1 } from './icon.js';

const menuItemCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--checkbox-checked-background-color:transparent;--indent:0;--padding:var(--hbr-spacing-xs) var(--hbr-spacing-sm);--padding-nested:var(--hbr-spacing-xs) 13px var(--hbr-spacing-xs) var(--hbr-spacing-lg);--label-padding:0;--font-size:var(--hbr-font-size-sm);--line-height:20px;--check-mark-color:#2774d9;--check-mark-size:var(--hbr-font-size-md);--slot-gap:8px;--align-items:stretch;--prefix-align-items:center;--color-sentiment-bg-hover:var(--control-bg-weak-hover);--color-sentiment-bg:var(--base-bg-weak-default);--color-sentiment-checked:var(--base-text-default);--color-sentiment-bg-checked:var(--control-bg-weak-hover);--color:var(--color-sentiment-text);--hover-color:var(--color-sentiment-text-hover);--disabled-color:var(--color-sentiment-text-disabled);--background:var(--color-sentiment-bg);--hover-background:var(--color-sentiment-bg-hover);--icon-color:var(--color-sentiment-icon);--icon-hover-color:var(--color-sentiment-icon-hover);--icon-disabled-color:var(--color-sentiment-icon-disabled);--checked-color:var(--color-sentiment-checked);--checked-background-color:var(--color-sentiment-bg-checked);--hover-checked-background-color:var(--checked-background-color)}:host([sentiment=neutral]),:host([sentiment=admin]){--color-sentiment-text:var(--base-text-default);--color-sentiment-text-hover:var(--base-text-default);--color-sentiment-text-disabled:var(--base-text-disabled);--color-sentiment-icon:var(--interact-icon-weak-default);--color-sentiment-checked:var(--base-text-default);--color-sentiment-icon-hover:var(--interact-icon-weak-hover);--color-sentiment-icon-disabled:var(--interact-icon-weak-disabled)}:host([sentiment=admin]){--color-sentiment-text:var(--base-text-default);--color-sentiment-text-hover:var(--base-text-default);--color-sentiment-text-disabled:var(--base-text-disabled);--color-sentiment-bg:var(--control-bg-default);--color-sentiment-bg-hover:var(--control-bg-strong-disabled);--checked-color:var(--base-text-default);--checked-background-color:#3E84E54D}:host([sentiment=danger]){--color-sentiment-text:var(--negative-text-default);--color-sentiment-text-hover:var(--negative-text-hover);--color-sentiment-text-disabled:var(--negative-text-disabled);--color-sentiment-icon:var(--negative-icon-default);--color-sentiment-icon-hover:var(--negative-icon-hover);--color-sentiment-icon-disabled:var(--negative-icon-disabled);--color-sentiment-checked:var(--negative-text-active);--color-sentiment-bg-checked:none;--hover-checked-background-color:var(--negative-icon-weak-default);--color-sentiment-bg-hover:var(--negative-icon-weak-default)}:host([noninteractive]){--icon-hover-color:var(--icon-color)}:host(:focus-visible){outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.menu-item{background-color:var(--background);position:relative;display:flex;align-items:var(--align-items);font-family:var(--hbr-font-body);font-size:var(--font-size);font-weight:var(--hbr-font-weight-normal);line-height:var(--line-height);letter-spacing:var(--hbr-font-letter-spacing-normal);text-align:left;color:var(--color);padding:var(--padding);transition:var(--hbr-transition-fast) fill;user-select:none;white-space:nowrap;cursor:pointer}.menu-item:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);z-index:1}.menu-item.menu-item--disabled{outline:none;box-shadow:none;color:var(--disabled-color);cursor:not-allowed;user-select:none}.menu-item--noninteractive{cursor:unset}.menu-item:hover:not(.menu-item--disabled):not(.menu-item--noninteractive){background-color:var(--hover-background);color:var(--hover-color);outline:none;box-shadow:none}.menu-item:hover:not(.menu-item--disabled):not(.menu-item--noninteractive) .menu-item__right-caret{color:var(--interact-icon-medium-hover)}.menu-item.menu-item--checked:hover:not(.menu-item--disabled):not(.menu-item--noninteractive),.menu-item.menu-item--nested-selected:hover:not(.menu-item--disabled):not(.menu-item--noninteractive){background-color:var(--hover-checked-background-color)}.menu-item:hover .menu-item__prefix{color:var(--icon-hover-color)}.menu-item .menu-item__label{padding:var(--label-padding);flex:1 1 auto}.menu-item .menu-item__text-wrap{min-width:0;white-space:normal;overflow-wrap:anywhere}.menu-item .menu-item__ghost{white-space:nowrap;display:block;visibility:hidden;pointer-events:none;height:0;max-height:0;overflow:hidden}.menu-item .menu-item__prefix{flex:0 0 auto;display:flex;align-items:var(--prefix-align-items)}.menu-item .menu-item__prefix ::slotted(*){margin-right:var(--slot-gap);font-size:var(--line-height)}.menu-item .menu-item__check-mark{display:flex;margin-left:var(--hbr-spacing-xs);align-items:center;justify-content:center;color:var(--check-mark-color);font-size:var(--check-mark-size)}.menu-item .menu-item__right-caret{display:flex;margin-left:var(--hbr-spacing-xs);align-items:center;justify-content:center;color:var(--interact-icon-weak-default);font-size:var(--check-mark-size)}.menu-item .menu-item__right-caret:hover{color:var(--interact-icon-medium-hover)}.menu-item .menu-item__suffix{flex:0 0 auto;display:flex;align-items:center}.menu-item .menu-item__suffix ::slotted(*){margin-left:var(--slot-gap);font-size:var(--line-height)}.menu-item .menu-item__check{display:flex;position:absolute;left:0.5em;top:calc(50% - 0.5em);visibility:hidden;align-items:center;font-size:inherit}.menu-item.menu-item--checked:not(.menu-item--noninteractive){color:var(--checked-color);background-color:var(--checked-background-color)}.menu-item.menu-item--checked:not(.menu-item--noninteractive).menu-item--shell-nav{font-weight:var(--hbr-font-weight-semibold)}.menu-item.menu-item--checkbox.menu-item--checked{background-color:var(--checkbox-checked-background-color)}.menu-item.menu-item--checked .menu-item__check{visibility:visible}.menu-item.menu-item--nested-selected{color:var(--checked-color);background-color:var(--checked-background-color)}.menu-item .menu-item__positioner{position:absolute;top:0px;right:0px;width:fit-content;height:fit-content}.menu-item .menu-item__nested{position:fixed;width:fit-content;height:fit-content}.menu-item--nested{padding:var(--padding-nested);position:relative}.menu-item--nested ::slotted(hbr-menu){display:none}.menu-item--nested.menu-item--open ::slotted(hbr-menu){display:flex}.menu-item--indented{--indent:6px}.menu-item--checkbox.menu-item--disabled{cursor:not-allowed}.menu-item--checkbox{--padding:0px}.menu-item--checkbox ::slotted(hbr-checkbox){width:100%;--width:100%;--padding:8px 24px;--label-width:100%;--form-control-width:100%}.menu-item--nav{--width:200px;width:var(--width);padding:6px var(--hbr-spacing-sm);border-radius:var(--hbr-border-radius-md)}.menu-item--nav .icon-checked{color:var(--hbr-color-brand);font-size:20px;height:20px}.menu-item--shell-nav{--width:256px;width:var(--width);min-height:28px;height:auto;color:var(--base-text-default);border-radius:var(--hbr-border-radius-md);line-height:var(--hbr-font-line-height-dense, 20px);padding:var(--hbr-spacing-2xs) 10px;vertical-align:middle;align-items:center;--hover-background:var(--interact-bg-medium-hover);--checked-background-color:var(--control-bg-active);--hover-color:var(--interact-bg-hover);--padding:calc(var(--hbr-spacing-2xs) + 2px) calc(var(--hbr-spacing-xs) + 2px)}.menu-item--shell-nav:hover:not(.menu-item--disabled){--hover-color:var(--interact-text-hover);color:var(--interact-text-hover)}.menu-item--shell-nav:hover:not(.menu-item--disabled) .menu-item__right-caret{color:var(--interact-icon-medium-hover)}.menu-item--shell-nav.menu-item--checked{--hover-color:var(--base-text-default);--check-mark-color:var(--interact-icon-medium-active);--checked-background-color:var(--base-bg-medium-active);--hover-color:var(--base-text-default);color:var(--interact-icon-medium-active)}.menu-item--shell-nav.menu-item--checked:hover{--hover-color:var(--base-text-default);color:var(--interact-text-hover)}.menu-item--shell-nav.menu-item--checked:hover .menu-item__right-caret{color:var(--interact-icon-medium-hover)}.menu-item--shell-nav.menu-item--checked .menu-item__check-mark{color:var(--interact-icon-medium-active)}.menu-item--shell-nav.menu-item--checked .menu-item__right-caret{color:var(--interact-icon-weak-default)}.menu-item--shell-nav.menu-item--compact{min-height:28px}.menu-item--shell-nav.menu-item--comfy{min-height:32px}.menu-item--shell-nav.menu-item__check,.menu-item--shell-nav .menu-item__prefix{display:none}.menu-item--shell-nav .menu-item__label{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;max-width:212px;white-space:normal}.menu-item--shell-nav:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);width:calc(100% - 10px);margin-right:5px;margin-left:5px;padding-left:5px;padding-right:5px}.menu-item.menu-item--neutral,.menu-item.menu-item--admin{--checked-background-color:#3E84E54D}.menu-item.menu-item--danger{--color-sentiment-text:var(--negative-text-default);--color-sentiment-icon-hover:var(--negative-icon-hover)}.menu-item.menu-item--admin{padding:2px}.menu-item.menu-item--admin .menu-item__wrapper{border:1px dashed #887be3;border-radius:var(--hbr-border-radius-sm, 4px);background:#f3f2ff;padding:5px 7px;width:100%;height:100%;display:flex}.menu-item.menu-item--admin.menu-item--small .menu-item__wrapper{padding:1px 3px}.menu-item.menu-item--admin.menu-item--large .menu-item__wrapper{padding:6px 11px}.menu-item.menu-item--indented{padding-left:calc(var(--hbr-spacing-sm) - 2px + var(--indent))}.menu-item.menu-item--small{--font-size:var(--hbr-spacing-sm, 12px);--line-height:18px;--padding:var(--hbr-spacing-2xs) calc(var(--hbr-spacing-2xs) + 2px);--slot-gap:4px}.menu-item.menu-item--small.menu-item--indented{padding-left:calc(var(--hbr-spacing-2xs) + 2px + var(--indent))}.menu-item.menu-item--large{--font-size:var(--hbr-spacing-md);--line-height:22px;--padding:calc(var(--hbr-spacing-xs) + 1px) calc(var(--hbr-spacing-sm) + 2px)}.menu-item.menu-item--large.menu-item--indented{padding-left:calc(var(--hbr-spacing-sm) + 2px + var(--indent))}.dropdown__trigger-gap{display:none}.dropdown__trigger-gap-open{display:flex;position:absolute;bottom:calc(-1 * var(--trigger-gap));left:0px;height:var(--trigger-gap);width:100%}.dropdown__trigger-gap-right{right:0px;height:100%;width:100%;top:0px}.dropdown__trigger-gap-right .dropdown__trigger-gap__fixed{position:fixed;right:var(--level);width:6px}:host([size=medium]:not([sentiment=admin])) .menu-item{--padding:var(--hbr-spacing-xs) 10px}:host(.hbr-menu-item-group:not([sentiment=admin])) .menu-item{--padding:7px 10px 7px 18px}:host([sentiment=neutral]){--color:var(--base-text-default)}:host([sentiment=neutral]) .menu-item{--hover-background:var(--bg-hover, var(--control-bg-weak-hover));--checked-background-color:var(--bg-color-checked, none);--hover-checked-background-color:var(--bg-color-checked-hover, var(--hover-background))}:host([nested]) .menu-item{--padding-nested:var(--hbr-spacing-xs) 10px}:host([sentiment=neutral][nested]:hover) .menu-item,:host([sentiment=neutral][nested][nested-selected]) .menu-item{--hover-background:var(--control-bg-weak-hover);--checked-background-color:none;--hover-checked-background-color:var(--hover-background)}:host([checkbox]){--padding:0}::slotted(hbr-icon){color:var(--color-sentiment-icon)}:host(:hover) ::slotted(hbr-icon),:host([checked]) ::slotted(hbr-icon){color:var(--color-sentiment-icon-hover)}:host([disabled]) ::slotted(hbr-icon),:host([disabled]:hover) ::slotted(hbr-icon){color:var(--color-sentiment-icon-disabled)}";
const HbrMenuItemStyle0 = menuItemCss;

let id = 0;
const MenuItem = /*@__PURE__*/ proxyCustomElement(class MenuItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChecked = createEvent(this, "hbr-checked", 7);
        this.hbrHidePopover = createEvent(this, "hbr-hide-popover", 7);
        this.hbrTriggerFocus = createEvent(this, "hbr-trigger-focus", 7);
        this.sheet = new CSSStyleSheet();
        this.componentId = `hbr-menu-item-${++id}`;
        this.toid = null;
        this.syncGhostText = (e) => {
            var _a;
            const menu = this.host.closest("hbr-menu");
            this.isTextWrapped = !!(menu && menu.hasAttribute("text-wrap"));
            const ghost = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("span[data-ghost]");
            if (this.isTextWrapped) {
                const slot = e.currentTarget;
                const text = slot
                    .assignedNodes({ flatten: true })
                    .map((n) => { var _a; return (_a = n.textContent) !== null && _a !== void 0 ? _a : ""; })
                    .join("")
                    .trim();
                if (ghost) {
                    ghost.textContent = text;
                }
            }
            else {
                if (ghost) {
                    ghost.textContent = "";
                }
            }
        };
        this.closestElement = (selector, el) => {
            return ((el && el !== document && el !== window && el.closest(selector)) ||
                (el && this.closestElement(selector, el.getRootNode().host)));
        };
        this.handleCheckboxClick = (e) => {
            if (this.cascading) {
                return;
            }
            if (this.handleNestedInteractiveClose(e))
                return;
            if (this.checkbox && !this.disabled) {
                this.checked = !this.checked;
            }
        };
        this.handleCheckboxKeyDown = (e) => {
            if (["Enter", " "].includes(e.key) && this.checkbox && !this.disabled) {
                this.checked = !this.checked;
            }
        };
        this.conditionalWrapper = ({ condition, children }) => {
            return condition ? (h("div", { class: "menu-item__wrapper", part: "wrapper" }, children)) : (children);
        };
        this.syncGapHeigh = () => {
            var _a;
            if (this._gap) {
                const height = (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height;
                if (height) {
                    this._gap.style.height = `${height}px`;
                }
            }
        };
        this.handleOnMouseEnter = () => {
            if (this.cascading)
                return;
            if (this.nested) {
                this.open = true;
                this.syncGapHeigh();
            }
        };
        this.handleOnMouseLeave = () => {
            if (this.cascading) {
                return;
            }
            if (this.nested) {
                this.open = false;
            }
        };
        this.handleNestedMenuOpen = (e) => {
            var _a, _b;
            if (this.nested && !this.disabled && ["Enter", " "].includes(e.key)) {
                e.stopPropagation();
                this.open = !this.open;
            }
            if (this.nested && !this.disabled && ["ArrowRight"].includes(e.key)) {
                e.stopPropagation();
                this.open = true;
                // have to manually get the element and focus due to the async setFocus method will cause a delay
                (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.classList.add("menu-item--open");
                const item = (_b = this.host) === null || _b === void 0 ? void 0 : _b.querySelector("hbr-menu hbr-menu-item:not(disabled)");
                if (item) {
                    const base = item.shadowRoot.querySelector("[part='base']");
                    base === null || base === void 0 ? void 0 : base.focus();
                }
            }
        };
        // handle interactive element close popover
        // TODO: support `floated`
        this.handleNestedInteractiveClose = (e) => {
            let noninteractive = false;
            const timeout = e.type === "click" ? 0 : 140;
            if ((this.noninteractive && [" ", "Enter"].includes(e.key)) ||
                (this.noninteractive && e.type === "click")) {
                const ele = e.target;
                if (ele instanceof HTMLElement) {
                    // @ts-ignore
                    if (ele.hasAttribute("data-close") ||
                        // @ts-ignore
                        typeof (ele === null || ele === void 0 ? void 0 : ele.setFocus) === "function") {
                        setTimeout(() => {
                            this.hbrHidePopover.emit();
                            this.hbrTriggerFocus.emit();
                        }, timeout);
                        noninteractive = true;
                    }
                }
                e.stopPropagation();
            }
            return noninteractive;
        };
        this.handleOnKeyDown = (e) => {
            if (this.cascading) {
                return;
            }
            if (this.handleNestedInteractiveClose(e))
                return;
            this.handleCheckboxKeyDown(e);
            this.handleNestedMenuOpen(e);
        };
        this.hasFocus = false;
        this.isTextWrapped = false;
        this.checked = false;
        this.indeterminate = false;
        this.value = "";
        this.disabled = false;
        this.indented = false;
        this.ariacontrols = undefined;
        this.nested = false;
        this.checkbox = false;
        this.open = false;
        this.checkMark = false;
        this.noSelectedState = false;
        this.level = 1;
        this.tabindx = undefined;
        this.nav = false;
        this.sentiment = "neutral";
        this.size = "medium";
        this.nestedSelected = false;
        this.noninteractive = false;
        this.cascading = false;
        this.hasChildren = false;
        this.loading = false;
        this.nestedInteractive = false;
        this.density = "compact";
    }
    connectedCallback() {
        this.handleCheckboxState = this.handleCheckboxState.bind(this);
        this.handleNestedState = this.handleNestedState.bind(this);
        this.handleHostClick = this.handleHostClick.bind(this);
        this.handleLoading = this.handleLoading.bind(this);
        if (!this.checkbox) {
            this.host.setAttribute("role", "menuitem");
        }
        else {
            this.handleTypeChange();
        }
        this.host.addEventListener("click", this.handleHostClick);
    }
    handleHostClick(event) {
        // Prevent the click event from being emitted when the button is disabled or loading
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
    /** Sets focus on the button. */
    async setFocus(options, hasDelay, delay) {
        var _a;
        this.hasFocus = true;
        if (hasDelay) {
            this.toid && clearTimeout(this.toid);
            this.toid = setTimeout(() => {
                var _a;
                this.toid && clearTimeout(this.toid);
                (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.focus(options);
            }, delay || 0);
        }
        else {
            (_a = this.menuItem) === null || _a === void 0 ? void 0 : _a.focus(options);
        }
    }
    /** Removes focus from the button. */
    async removeFocus() {
        this.hasFocus = false;
        this.menuItem.blur();
    }
    componentDidLoad() {
        this.handleCheckboxState();
    }
    handleCheckboxState() {
        if (this.checkbox) {
            const checkbox = this.host.querySelector("hbr-checkbox");
            if (checkbox) {
                checkbox.checked = this.checked;
                checkbox.disabled = this.disabled;
                checkbox.indeterminate = this.indeterminate;
            }
        }
    }
    handleDisabledState() {
        this.handleCheckboxState();
    }
    handleEmitSelectEvent() {
        this.checked && this.hbrChecked.emit();
        this.handleCheckboxState();
        this.handleNestedState();
        // Only checkbox types can receive the aria-checked attribute
        if (this.checkbox) {
            this.host.setAttribute("aria-checked", this.checked ? "true" : "false");
        }
        else {
            this.host.removeAttribute("aria-checked");
        }
    }
    handleTypeChange() {
        if (this.checkbox) {
            this.host.setAttribute("role", "menuitemcheckbox");
            this.host.setAttribute("aria-checked", this.checked ? "true" : "false");
        }
    }
    handleNestedState() {
        if (this.nested && this.checked) {
            this.nestedSelected = false;
        }
    }
    handleLoading(value) {
        if (value) {
            this.host.setAttribute("aria-busy", "true");
        }
        else {
            this.host.removeAttribute("aria-busy");
        }
    }
    syncNestedMenuTop() {
        var _a;
        if (this.nested) {
            const top = (_a = this.positioner) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().top;
            if (this.nestedFixer && typeof top === "number") {
                this.nestedFixer.style.top = `${top}px`;
            }
        }
    }
    render() {
        var _a;
        const isInShellNav = !!this.host.closest("hbr-shell-nav");
        const { sentiment } = this;
        const showCheckMark = !this.nav &&
            !this.nested &&
            this.checkMark &&
            this.checked &&
            !this.noninteractive &&
            !this.hasChildren;
        const showRightCaret = isInShellNav && this.hasChildren;
        this.sheet.replaceSync(`
		:host {
			--level: ${this.level === 1 ? "-4px" : "-90%"};
		`);
        if (this.host)
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: 'fd95938cd0f714471fbc7c330ea6965dca95a046', "aria-controls": this.ariacontrols }, h("div", { key: '1a116c8eabe92cc91ab28db9c7f11740fcc4e947', "aria-disabled": this.disabled ? "true" : "false", "aria-haspopup": this.nested ? "true" : null, "aria-expanded": this.nested ? (this.open ? "true" : "false") : null, ref: (el) => {
                this.menuItem = el;
            }, part: "base", class: {
                "menu-item": true,
                "menu-item--checked": this.noninteractive || this.noSelectedState
                    ? false
                    : this.checked,
                "menu-item--disabled": this.disabled,
                "menu-item--focused": this.hasFocus,
                "menu-item--nested": this.nested,
                "menu-item--indented": this.indented,
                "menu-item--nested-selected": this.nestedSelected,
                "menu-item--checkbox": this.checkbox,
                "menu-item--nav": this.nav,
                "menu-item--shell-nav": isInShellNav,
                [`menu-item--${sentiment}`]: true,
                "menu-item--small": this.size === "small",
                "menu-item--medium": this.size === "medium",
                "menu-item--large": this.size === "large",
                "menu-item--comfy": isInShellNav && this.density === "comfy",
                "menu-item--compact": isInShellNav && this.density === "compact",
                "menu-item--open": this.open,
                "menu-item--noninteractive": this.noninteractive,
            }, tabindex: this.disabled
                ? "-1"
                : this.tabindx
                    ? this.tabindx
                    : this.hasFocus
                        ? "0"
                        : "-1",
            // aria-labelledby={this.componentId}
            onKeyDown: this.handleOnKeyDown, onClick: this.handleCheckboxClick, onMouseEnter: this.handleOnMouseEnter, onMouseLeave: this.handleOnMouseLeave }, this.conditionalWrapper({
            condition: this.sentiment === "admin",
            children: (h(Fragment, null, h("span", { part: "checked-icon", class: "menu-item__check" }), h("span", { part: "prefix", class: "menu-item__prefix" }, h("slot", { name: "prefix" })), h("span", { ref: (el) => {
                    this.menuLabel = el;
                }, part: "label", class: {
                    "menu-item__label": true,
                    "menu-item__text-wrap": this.isTextWrapped
                }, id: this.componentId }, h("span", { "data-ghost": true, class: { "menu-item__ghost": this.isTextWrapped }, "aria-hidden": "true" }), h("slot", { onSlotchange: this.syncGhostText })), h("span", { part: "suffix", class: "menu-item__suffix" }, h("slot", { name: "suffix" }), showCheckMark && (h("span", { part: "check-mark", class: "menu-item__check-mark" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check) || check }))), showRightCaret && (h("span", { part: "check-mark", class: "menu-item__right-caret" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight })))), this.nav && this.checked && !this.noninteractive && (h("div", { part: "icon-checked", class: "icon-checked" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check) || check }))), this.nested && (h("div", { part: "trigger-gap", class: {
                    "dropdown__trigger-gap": true,
                    "dropdown__trigger-gap-open": this.open,
                    "dropdown__trigger-gap-right": this.open,
                } }, h("div", { part: "trigger-gap-fixed", ref: (el) => {
                    this._gap = el;
                }, class: {
                    "dropdown__trigger-gap__fixed": this.open,
                } }))), this.nested && (h("span", { class: "menu-item__positioner", ref: (el) => {
                    this.positioner = el;
                } }, h("span", { part: "nested", class: "menu-item__nested", ref: (el) => {
                    this.nestedFixer = el;
                } }, h("slot", { name: "nested" })))))),
        }))));
    }
    get host() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledState"],
        "indeterminate": ["handleDisabledState"],
        "checked": ["handleEmitSelectEvent"],
        "checkbox": ["handleTypeChange"],
        "loading": ["handleLoading"],
        "open": ["syncNestedMenuTop"]
    }; }
    static get style() { return HbrMenuItemStyle0; }
}, [1, "hbr-menu-item", {
        "checked": [1540],
        "indeterminate": [516],
        "value": [513],
        "disabled": [516],
        "indented": [516],
        "ariacontrols": [8],
        "nested": [516],
        "checkbox": [516],
        "open": [1540],
        "checkMark": [1540, "check-mark"],
        "noSelectedState": [1540, "no-selected-state"],
        "level": [514],
        "tabindx": [513],
        "nav": [516],
        "sentiment": [1537],
        "size": [513],
        "nestedSelected": [1540, "nested-selected"],
        "noninteractive": [516],
        "cascading": [516],
        "hasChildren": [516, "has-children"],
        "loading": [516],
        "nestedInteractive": [516, "nested-interactive"],
        "density": [513],
        "hasFocus": [32],
        "isTextWrapped": [32],
        "setFocus": [64],
        "removeFocus": [64]
    }, undefined, {
        "disabled": ["handleDisabledState"],
        "indeterminate": ["handleDisabledState"],
        "checked": ["handleEmitSelectEvent"],
        "checkbox": ["handleTypeChange"],
        "loading": ["handleLoading"],
        "open": ["syncNestedMenuTop"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-menu-item", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, MenuItem);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { MenuItem as M, defineCustomElement as d };

