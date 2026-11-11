import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as caretRight } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$7 } from './icon.js';
import { d as defineCustomElement$a } from './breadcrumb-item.js';
import { d as defineCustomElement$9 } from './button.js';
import { d as defineCustomElement$8 } from './dropdown.js';
import { d as defineCustomElement$6 } from './menu.js';
import { d as defineCustomElement$5 } from './menu-item.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './resize-observer.js';
import { d as defineCustomElement$2 } from './spinner.js';

const breadcrumbCss = ":host{box-sizing:border-box}:host *,:host *::before,:host *::after{box-sizing:inherit}[hidden]{display:none !important}.breadcrumb{display:flex;align-items:center;flex-wrap:wrap}.breadcrumb.hbr-breadcrumb--truncate{flex-wrap:nowrap;white-space:nowrap;overflow:hidden}.breadcrumb__list{display:flex;align-items:center;flex-wrap:inherit;list-style:none;margin:0;padding:0}.hbr-breadcrumb--truncate .breadcrumb__list{white-space:inherit;overflow:inherit}";
const HbrBreadcrumbStyle0 = breadcrumbCss;

const HbrBreadcrumb$1 = /*@__PURE__*/ proxyCustomElement(class HbrBreadcrumb extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.ellipsisRef = null;
        // Cached template data
        this.separatorTemplate = null;
        this.separatorSignature = null; // outerHTML of source node
        this.label = "Breadcrumb";
        this.truncate = false;
    }
    getSeparator() {
        var _a;
        /**
         * Stable separator factory
         * Instead of cloneNode (which can cause flicker and fails for shadow roots),
         * we snapshot the current slotted separator once and create lightweight
         * instances on demand via document.createElement + innerHTML.
         * We also cache a signature (outerHTML) so we only invalidate existing
         * default separators when user-provided slot content actually changes.
         */
        if (!this.separatorTemplate) {
            this.buildSeparatorTemplate();
        }
        else {
            // Check if slot content changed; if so rebuild template
            const current = (_a = this.separatorSlot) === null || _a === void 0 ? void 0 : _a.assignedElements({
                flatten: true,
            })[0];
            if (current && current.outerHTML !== this.separatorSignature) {
                this.buildSeparatorTemplate();
            }
        }
        return this.createSeparatorInstance();
    }
    buildSeparatorTemplate() {
        var _a, _b;
        const source = ((_a = this.separatorSlot) === null || _a === void 0 ? void 0 : _a.assignedElements({
            flatten: true,
        })[0]) || null;
        if (!source) {
            // Programmatic fallback icon (no fallback markup in slot). This avoids rendering an extra visible separator.
            const customSystemIcons = (_b = getBootstrapConfig()) === null || _b === void 0 ? void 0 : _b.systemIcons;
            this.separatorTemplate = {
                tag: "hbr-icon",
                attrs: {
                    // asset attribute is set as a normal attribute for consistency; stencil component will pick up property assignment below if needed
                    asset: ((customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight),
                },
                inner: "",
                isIcon: true,
                asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight,
            };
            this.separatorSignature = null;
            return;
        }
        const attrs = {};
        Array.from(source.attributes).forEach((attr) => {
            if (attr.name === "id" || attr.name === "slot")
                return; // strip id & slot
            attrs[attr.name] = attr.value;
        });
        const isIcon = source.tagName === "HBR-ICON";
        this.separatorTemplate = {
            tag: source.tagName.toLowerCase(),
            attrs,
            inner: source.innerHTML,
            isIcon,
            asset: isIcon
                ? source.asset
                : undefined,
            // Some consumers may use <hbr-icon name="caret-right"/> instead of asset
            name: isIcon
                ? source.name
                : undefined,
        };
        this.separatorSignature = source.outerHTML;
    }
    createSeparatorInstance() {
        var _a;
        if (!this.separatorTemplate)
            return null;
        const t = this.separatorTemplate;
        const el = document.createElement(t.tag);
        Object.entries(t.attrs).forEach(([k, v]) => el.setAttribute(k, v));
        if (t.isIcon) {
            // Prefer asset when provided, otherwise fallback to name
            if (t.asset) {
                el.asset = t.asset;
            }
            else if (t.name) {
                el.name = t.name;
            }
            // Wait for the icon component to be defined/upgraded before it renders
            // This ensures proper layout and styling
            if (customElements.get("hbr-icon") &&
                typeof el.componentOnReady === "function") {
                (_a = el.componentOnReady) === null || _a === void 0 ? void 0 : _a.call(el);
            }
        }
        if (t.inner) {
            el.innerHTML = t.inner;
        }
        // sanitize IDs inside template
        if (el.id)
            el.removeAttribute("id");
        el.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
        el.setAttribute("data-default", "");
        el.slot = "separator";
        return el;
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleBreadcrumbChange = this.handleBreadcrumbChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.checkAndCollapseItems = this.checkAndCollapseItems.bind(this);
        this.el.addEventListener("hbr-breadcrumb-change", this.handleBreadcrumbChange);
    }
    handleBreadcrumbChange() {
        this.handleSlotChange();
    }
    componentDidLoad() {
        this.handleSlotChange();
        if (this.truncate) {
            requestAnimationFrame(() => {
                // Double rAF to ensure all styling and fonts are loaded
                requestAnimationFrame(() => {
                    this.checkAndCollapseItems();
                });
            });
        }
    }
    handleSlotChange() {
        var _a;
        const assignedSlotDefault = (_a = this.defaultSlot) === null || _a === void 0 ? void 0 : _a.assignedElements({
            flatten: true,
        });
        if (assignedSlotDefault) {
            const items = [...assignedSlotDefault].reduce((agg, item) => {
                if (item.tagName.toLowerCase() === "hbr-breadcrumb-item") {
                    agg.push(item);
                    return agg;
                }
                // If breadcrumb item is child of a tooltip
                const crumbChildItem = item.querySelector("hbr-breadcrumb-item");
                if (crumbChildItem) {
                    agg.push(crumbChildItem);
                    return agg;
                }
                return agg;
            }, []);
            items.forEach((item, index) => {
                var _a;
                item.classList.toggle("breadcrumb-item--last", index === items.length - 1);
                if (!item.hasAttribute("role")) {
                    item.setAttribute("role", "listitem");
                }
                // separator logic only applies when there are more than 1 breadcrumb items
                // and not the last item
                if (items.length > 0 && index !== items.length - 1) {
                    const separator = item.querySelector('[slot="separator"]');
                    if (separator === null) {
                        item.append(this.getSeparator());
                    }
                    else if (separator.hasAttribute("data-default")) {
                        // Only replace if source separator slot template changed
                        const currentSource = (_a = this.separatorSlot) === null || _a === void 0 ? void 0 : _a.assignedElements({
                            flatten: true,
                        })[0];
                        const currentSignature = currentSource
                            ? currentSource.outerHTML
                            : null;
                        if (currentSignature !== this.separatorSignature) {
                            // force rebuild template + replace
                            this.buildSeparatorTemplate();
                            separator.replaceWith(this.getSeparator());
                        }
                    }
                }
                // The last breadcrumb item is the "current page"
                // TODO : is the above relevant? Magnetic specs are different
                if (index === items.length - 1) {
                    this.setAriaCurrent(item, "set");
                }
                else {
                    this.setAriaCurrent(item, "remove");
                }
            });
        }
    }
    handleResize() {
        this.checkAndCollapseItems();
    }
    getEllipsisDropdown() {
        if (!this.ellipsisRef) {
            // Creating dropdown container for the ellipsis dropdown
            const dropdownContainer = document.createElement("hbr-breadcrumb-item");
            dropdownContainer.className = "hbr-internal__breadcrumb-ellipsis";
            // Creating the dropdown
            const dropdown = document.createElement("hbr-dropdown");
            dropdown.setAttribute("menu", "");
            dropdown.setAttribute("variant", "outline");
            dropdown.setAttribute("hoist", "true");
            // Creating the dropdown trigger button
            const triggerButton = document.createElement("hbr-button");
            triggerButton.className = "breadcrumb__ellipsisTrigger";
            triggerButton.setAttribute("slot", "trigger");
            triggerButton.setAttribute("variant", "text");
            triggerButton.setAttribute("data-testid", "ellipsis-trigger");
            triggerButton.innerHTML = "...";
            dropdownContainer.addEventListener("focus", () => {
                triggerButton.setFocus();
            });
            // Creating the dropdown menu
            const menu = document.createElement("hbr-menu");
            dropdown.appendChild(triggerButton);
            dropdown.appendChild(menu);
            dropdownContainer.appendChild(dropdown);
            // Adding dropdown to the ellipsis reference instead of just the text ellipsis
            // This ensures that the dropdown is properly initialized and can be reused
            this.ellipsisRef = dropdownContainer;
        }
        return this.ellipsisRef;
    }
    checkAndCollapseItems() {
        var _a, _b, _c;
        const containerWidth = this.el.clientWidth - 4;
        let breadcrumbItems = [...this.el.querySelectorAll("hbr-breadcrumb-item")];
        if ((_a = this.ellipsisRef) === null || _a === void 0 ? void 0 : _a.isConnected) {
            breadcrumbItems = breadcrumbItems.filter((item) => item !== this.ellipsisRef);
        }
        const previouslyCollapsedItems = breadcrumbItems.filter((item) => item.classList.contains("collapsed"));
        breadcrumbItems.forEach((item) => item.classList.remove("collapsed"));
        let totalWidth = 0;
        if ((_b = this.ellipsisRef) === null || _b === void 0 ? void 0 : _b.isConnected) {
            totalWidth += this.ellipsisRef.offsetWidth;
            // Keep the dropdown connected while measuring so an open menu remains
            // interactive if this resize does not change which items are collapsed.
            this.ellipsisRef.style.display = "none";
        }
        // Always show first and last item
        const firstItemWidth = breadcrumbItems[0].offsetWidth;
        const lastItemWidth = breadcrumbItems[breadcrumbItems.length - 1].offsetWidth;
        totalWidth += firstItemWidth + lastItemWidth;
        let ellipsisAdded = false;
        const collapsedItems = [];
        if (breadcrumbItems.length > 2) {
            // Inserting ellipsis dropdown into the DOM
            const ellipsisDropdown = this.getEllipsisDropdown();
            // Check space for intermediate items
            for (let i = breadcrumbItems.length - 2; i > 0; i--) {
                const itemWidth = breadcrumbItems[i].offsetWidth;
                if (totalWidth + itemWidth > containerWidth) {
                    // Collapse following breadcrumb item and add it to dropdown
                    breadcrumbItems[i].classList.add("collapsed");
                    collapsedItems.unshift(breadcrumbItems[i]); // Add after first breadcrumb item to maintain order
                    ellipsisAdded = true;
                }
                else {
                    // Fit this item
                    totalWidth += itemWidth;
                }
            }
            // ResizeObserver can report changes caused by collapsing items. Keep the
            // existing dropdown nodes when the same items remain collapsed, so an open
            // menu is not detached while a user is interacting with it.
            const collapsedItemsUnchanged = previouslyCollapsedItems.length === collapsedItems.length &&
                previouslyCollapsedItems.every((item, index) => item === collapsedItems[index]);
            if (collapsedItemsUnchanged) {
                if (this.ellipsisRef) {
                    this.ellipsisRef.style.display = "";
                }
                return;
            }
            if ((_c = this.ellipsisRef) === null || _c === void 0 ? void 0 : _c.isConnected) {
                this.ellipsisRef.remove();
            }
            if (ellipsisAdded) {
                this.el.insertBefore(ellipsisDropdown, breadcrumbItems[1]);
            }
            if (this.ellipsisRef) {
                this.ellipsisRef.style.display = "";
            }
            // Populate dropdown menu with collapsed items
            if (collapsedItems.length > 0) {
                const menu = ellipsisDropdown.querySelector("hbr-menu");
                const dropdown = ellipsisDropdown.querySelector("hbr-dropdown");
                // Clear existing menu items
                menu.innerHTML = "";
                collapsedItems.forEach((item, index) => {
                    const menuItem = document.createElement("hbr-menu-item");
                    menuItem.setAttribute("value", index.toString());
                    // Clone the original breadcrumb item's inner content
                    const itemClone = item.cloneNode(true);
                    // Remove any separator elements from the clone
                    const separators = itemClone.querySelectorAll('[slot="separator"]');
                    separators.forEach((separator) => separator.remove());
                    // Copy all attributes from the original item to the menu item
                    menuItem.innerHTML = itemClone.innerHTML;
                    // Clone and preserve all event listeners by dispatching events from menu item to original item
                    menuItem.addEventListener("click", (event) => {
                        // Prevent the menu item's default behavior
                        event.preventDefault();
                        event.stopPropagation();
                        // handling the case where the original breadcrumb item has an href
                        Array.from(item.attributes).forEach((attr) => {
                            if (attr.name === "href") {
                                const features = ["noopener", "noreferrer"]
                                    .filter((feature) => { var _a; return (_a = item.rel) === null || _a === void 0 ? void 0 : _a.includes(feature); })
                                    .join(",");
                                window.open(attr.value, item.target || "_self", features);
                            }
                        });
                        // Create a new click event and dispatch it on the original breadcrumb item
                        const clickEvent = new MouseEvent("click", {
                            bubbles: event.bubbles,
                            cancelable: event.cancelable,
                            view: window,
                            detail: event.detail,
                            screenX: event.screenX,
                            screenY: event.screenY,
                            clientX: event.clientX,
                            clientY: event.clientY,
                            ctrlKey: event.ctrlKey,
                            altKey: event.altKey,
                            shiftKey: event.shiftKey,
                            metaKey: event.metaKey,
                            button: event.button,
                            buttons: event.buttons,
                        });
                        // Dispatch the event on the original item
                        item.dispatchEvent(clickEvent);
                        dropdown.hide();
                    });
                    // Also handle any links within the menu item
                    const links = menuItem.querySelectorAll("a");
                    links.forEach((link) => {
                        link.addEventListener("click", (event) => {
                            // Find the corresponding link in the original item
                            const originalLinks = item.querySelectorAll("a");
                            const linkIndex = Array.from(menuItem.querySelectorAll("a")).indexOf(link);
                            const originalLink = originalLinks[linkIndex];
                            if (originalLink) {
                                event.preventDefault();
                                event.stopPropagation();
                                // Create and dispatch click event on original link
                                const linkClickEvent = new MouseEvent("click", {
                                    bubbles: event.bubbles,
                                    cancelable: event.cancelable,
                                    view: window,
                                    detail: event.detail,
                                    screenX: event.screenX,
                                    screenY: event.screenY,
                                    clientX: event.clientX,
                                    clientY: event.clientY,
                                    ctrlKey: event.ctrlKey,
                                    altKey: event.altKey,
                                    shiftKey: event.shiftKey,
                                    metaKey: event.metaKey,
                                    button: event.button,
                                    buttons: event.buttons,
                                });
                                originalLink.dispatchEvent(linkClickEvent);
                            }
                        });
                    });
                    menu.appendChild(menuItem);
                });
            }
            // Check if ellipsis is needed
            if (!this.el.querySelector("hbr-breadcrumb-item.collapsed") &&
                ellipsisAdded) {
                ellipsisDropdown.remove();
            }
        }
    }
    disconnectedCallback() {
        this.el.removeEventListener("hbr-breadcrumb-change", this.handleBreadcrumbChange);
    }
    setAriaCurrent(item, type) {
        var _a;
        const applyAriaCurrent = () => {
            var _a;
            const currentElement = (_a = item === null || item === void 0 ? void 0 : item.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("a, button");
            if (!currentElement)
                return;
            type === "set"
                ? currentElement.setAttribute("aria-current", "page")
                : currentElement.removeAttribute("aria-current");
        };
        applyAriaCurrent();
        (_a = item === null || item === void 0 ? void 0 : item.componentOnReady) === null || _a === void 0 ? void 0 : _a.call(item).then(applyAriaCurrent);
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: 'f57cb0e701fec2c6bf9ca0bc7df6b0829e572f91' }, this.truncate ? (h("hbr-resize-observer", { debounce: 300, "onHbr-resize": this.handleResize }, h("nav", { part: "base", class: "breadcrumb hbr-breadcrumb--truncate", "aria-label": this.label }, h("ol", { part: "list", class: "breadcrumb__list" }, h("slot", { ref: (el) => {
                this.defaultSlot = el;
            }, onSlotchange: this.handleSlotChange }))))) : (h("nav", { part: "base", class: "breadcrumb", "aria-label": this.label }, h("ol", { part: "list", class: "breadcrumb__list" }, h("slot", { ref: (el) => {
                this.defaultSlot = el;
            }, onSlotchange: this.handleSlotChange })))), h("slot", { key: '76c3f4634391f6b80a202e1aae96845d15343904', name: "separator",
            // @ts-ignore
            hidden: true, ref: (el) => {
                this.separatorSlot = el;
            } }, h("hbr-icon", { key: '67b087d94e6086f71117c32e792f27af95cd6448', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight }))));
    }
    get el() { return this; }
    static get style() { return HbrBreadcrumbStyle0; }
}, [1, "hbr-breadcrumb", {
        "label": [1],
        "truncate": [516]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-breadcrumb", "hbr-breadcrumb-item", "hbr-button", "hbr-dropdown", "hbr-icon", "hbr-menu", "hbr-menu-item", "hbr-popup", "hbr-resize-observer", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-breadcrumb":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrBreadcrumb$1);
            }
            break;
        case "hbr-breadcrumb-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-resize-observer":
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

const HbrBreadcrumb = HbrBreadcrumb$1;
const defineCustomElement = defineCustomElement$1;

export { HbrBreadcrumb, defineCustomElement };

