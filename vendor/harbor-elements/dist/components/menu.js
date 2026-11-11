import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { g as getTextContent } from './slot.js';

const menuCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--box-shadow:var(--hbr-shadow-md);--padding:var(--hbr-spacing-md) 0;--border-radius:var(--hbr-border-radius-md);--border:none;--width:fit-content;--min-width:fit-content;--max-width:fit-content;--background:var(--base-bg-weak-default);--max-height:var(--panel-max-height)}:host ::slotted(hbr-menu-item.hbr-menu-item-group){--padding:7px 10px 7px 18px}.menu{display:flex;flex-direction:column;width:var(--width);min-width:var(--minwidth, var(--width, var(--min-width)));max-width:var(--max-width);max-height:var(--max-height);padding:var(--padding);box-shadow:var(--box-shadow);border-radius:var(--border-radius);border:var(--border);background:var(--background);overflow:auto;overscroll-behavior:none}.menu--context{--width:100%;--max-width:100%;--box-shadow:none;--border:none;--background:none;--padding:0;overflow:visible}.menu--nested{position:relative;left:4px}.menu--nav{border:none;box-shadow:none}.menu--shell-nav{padding-bottom:var(--menu-group-gap, 32px);padding-top:0px;border:none;box-shadow:none;gap:4px;overflow:visible}.menu--shell-nav--last{padding-bottom:0px}:host{--border:2px solid var(--control-border-default);--box-shadow:var(--hbr-shadow-xs);--border-radius:var(--hbr-border-radius-md, 6px);--padding:var(--hbr-spacing-2xs, 4px) 0}:host-context([data-theme=onecd]) .menu{--border:var(--onecd-border-width-default, 1px) solid var(--control-border-default, #788391)}";
const HbrMenuStyle0 = menuCss;

const Menu = /*@__PURE__*/ proxyCustomElement(class Menu extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrSelect = createEvent(this, "hbr-select", 7);
        this.typeToSelectString = "";
        this.getCurrentLevelItems = () => {
            const items = Array.from(this.host.querySelectorAll("hbr-menu-item"));
            return items.filter((item) => {
                const menu = item === null || item === void 0 ? void 0 : item.closest("hbr-menu");
                return this.host === menu;
            });
        };
        this.triggerTheFocus = (element) => {
            if (typeof (element === null || element === void 0 ? void 0 : element.setFocus) === "function") {
                const base = element === null || element === void 0 ? void 0 : element.shadowRoot.querySelector("[part='base']");
                base === null || base === void 0 ? void 0 : base.focus();
            }
            else if (typeof (element === null || element === void 0 ? void 0 : element.focus) === "function") {
                element.focus();
            }
        };
        this.variant = undefined;
        this.nested = false;
        this.nav = false;
        this.last = false;
        this.cascading = false;
        this.textWrap = false;
    }
    connectedCallback() {
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.getItems = this.getItems.bind(this);
        this.host.setAttribute("role", "menu");
    }
    /**
     * Initiates type-to-select logic, which automatically selects an option based on what the user is currently typing.
     * The key passed will be appended to the internal query and the selection will be updated. After a brief period, the
     * internal query is cleared automatically. This method is intended to be used with the keydown event. Useful for
     * enabling type-to-select when the menu doesn't have focus.
     */
    async typeToSelect(key) {
        clearTimeout(this.typeToSelectTimeout);
        this.typeToSelectTimeout = setTimeout(() => {
            this.typeToSelectString = "";
        }, 750);
        this.typeToSelectString += key.toLowerCase();
        const items = this.getItems();
        for (const item of items) {
            const slot = item.shadowRoot.querySelector("slot:not([name])");
            const label = getTextContent(slot).toLowerCase().trim();
            if (label.substring(0, this.typeToSelectString.length) ===
                this.typeToSelectString) {
                item.setFocus();
                break;
            }
        }
    }
    async getMenuItems() {
        return this.getItems() || [];
    }
    handleSlotChange() {
        var _a;
        const items = this.getItems();
        // Reset the roving tab index when the slotted items change
        if (items.length > 0) {
            if (!this.cascading) {
                (_a = items[0]) === null || _a === void 0 ? void 0 : _a.setFocus();
            }
        }
    }
    getItems() {
        let items = Array.from(this.nested
            ? this.host.querySelectorAll("hbr-menu-item")
            : this.getCurrentLevelItems());
        items = items.reduce((acc, cur) => {
            if (cur.nestedInteractive) {
                const eleList = Array.from(cur.querySelectorAll("*"));
                eleList.forEach((ele) => {
                    if (ele instanceof HTMLElement) {
                        // @ts-ignore
                        if (ele &&
                            // @ts-ignore
                            !ele.disabled &&
                            (
                            // @ts-ignore
                            ele === null || ele === void 0 ? void 0 : ele.setFocus) &&
                            // @ts-ignore
                            typeof (ele === null || ele === void 0 ? void 0 : ele.setFocus) === "function") {
                            acc.push(ele);
                        }
                        if (ele.getAttribute("tabindex") === "0") {
                            acc.push(ele);
                        }
                    }
                });
            }
            else {
                if (!cur.disabled && !cur.noninteractive)
                    acc.push(cur);
            }
            return acc;
        }, []);
        return items.filter((item) => {
            const menu = item === null || item === void 0 ? void 0 : item.closest("hbr-menu");
            if (this.host === menu) {
                return true;
            }
            return !(menu === null || menu === void 0 ? void 0 : menu.nested);
        });
    }
    getActiveItem() {
        const isMenuItem = document.activeElement.closest("hbr-menu-item");
        return this.getItems().find((i) => i === isMenuItem);
    }
    handleClick(event) {
        const target = event.target;
        const item = target.closest("hbr-menu-item");
        if (item === null || item === void 0 ? void 0 : item.noninteractive)
            return;
        if (item && !item.disabled && !item.nested) {
            this.hbrSelect.emit({ item, event });
        }
    }
    handleKeyDown(event) {
        var _a, _b;
        // Make a selection when pressing enter
        if (["Enter", " "].includes(event.key)) {
            const item = this.getActiveItem();
            if (item === null || item === void 0 ? void 0 : item.noninteractive)
                return;
            event.preventDefault();
            if (item) {
                // event.stopImmediatePropagation();
                /** event is being used on hbr-select multi */
                // Simulate a click to support @click handlers on menu items that also work with the keyboard
                item.click();
            }
            else {
                const focused = (_a = this.getItems()) === null || _a === void 0 ? void 0 : _a.findIndex((item) => { var _a; return (_a = item.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[tabindex='0']"); });
                if (focused > -1) {
                    this.getItems()[focused].click();
                }
            }
        }
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            if (this.nested) {
                event.stopPropagation();
            }
            const items = this.getItems();
            const selectedItem = this.getActiveItem();
            const datePicker = document.activeElement.closest("hbr-date-picker");
            let index = -1;
            if (selectedItem) {
                index = items.indexOf(selectedItem);
            }
            else if (datePicker) {
                const focused = (_b = this.getItems()) === null || _b === void 0 ? void 0 : _b.findIndex((item) => { var _a; return (_a = item.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[tabindex='0']"); });
                if (focused > -1) {
                    index = focused;
                }
            }
            else {
                index = items.indexOf(selectedItem);
            }
            const _index = index;
            if (items.length > 0) {
                event.preventDefault();
                if (event.key === "ArrowDown") {
                    index++;
                }
                else if (event.key === "ArrowUp") {
                    index--;
                }
                else if (event.key === "Home") {
                    index = 0;
                }
                else if (event.key === "End") {
                    index = items.length - 1;
                }
                if (index < 0) {
                    index = items.length - 1;
                }
                if (index > items.length - 1) {
                    index = 0;
                }
                if (datePicker) {
                    const currentItem = this.getItems()[_index];
                    if (currentItem) {
                        currentItem.tabindx = "-1";
                    }
                    items[index].tabindx = "0";
                }
                this.triggerTheFocus(items[index]);
                return;
            }
        }
        else if (["ArrowLeft", "Escape"].includes(event.key)) {
            if (this.nested) {
                event.stopPropagation();
                const item = this.host.closest("hbr-menu-item");
                if (item) {
                    item.open = false;
                    item.setFocus();
                }
            }
            return;
        }
        else if ("ArrowRight" === event.key) {
            return;
        }
        else {
            this.typeToSelect(event.key);
        }
    }
    render() {
        const navParent = this.host.closest("hbr-shell-nav");
        const isInShellNav = !!navParent;
        return (h(Host, { key: 'c6b429046cd6634e34ee717cc1ea003ec2104bb2' }, h("div", { key: '9a82e5bb7924c609e02e65c8bd9588576f179fbc', part: `${this.nested ? "base nested" : "base"}`, class: {
                menu: true,
                [`menu--${this.variant}`]: true,
                "menu--nested": this.nested,
                "menu--nav": this.nav,
                "menu--shell-nav": isInShellNav,
                "menu--shell-nav--last": this.last,
                "menu--cascading": this.cascading,
            }, onClick: this.handleClick, onKeyDown: this.handleKeyDown }, h("slot", { key: '652593963088557a2f9efe0d1584dbd61fec7ff6', onSlotchange: this.handleSlotChange }))));
    }
    get host() { return this; }
    static get style() { return HbrMenuStyle0; }
}, [1, "hbr-menu", {
        "variant": [513],
        "nested": [1540],
        "nav": [4],
        "last": [4],
        "cascading": [516],
        "textWrap": [516, "text-wrap"],
        "typeToSelect": [64],
        "getMenuItems": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-menu"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Menu);
            }
            break;
    } });
}

export { Menu as M, defineCustomElement as d };

