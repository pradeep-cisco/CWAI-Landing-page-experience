import { proxyCustomElement, HTMLElement as HTMLElement$1, h, Host } from '@stencil/core/internal/client';
import { g as generateShortID } from './function-helper.js';
import { l as loadFloatingUi } from './floating-ui.js';
import { d as defineCustomElement$4 } from './icon.js';
import { d as defineCustomElement$3 } from './icon-button.js';
import { d as defineCustomElement$2 } from './tab.js';

// park event forwarding for now unless there is a use case
// const forwardEvents = (e, document) => {
//   const elmTree = e.composedPath() as HTMLElement[];
//   const target = elmTree.filter(r => r.classList && r.classList.contains("hbr-global-component"));
//   // forwarding event
//   if (target[0] && target[0].id) {
//     // back search
//     const targetRef = document.querySelector(`[component-id="${target[0].id}"]`);
//     if (targetRef && targetRef.getAttribute("bubble-on-ref") !== null) {
//       e.stopPropagation();
//       e.preventDefault();
//       // new Event works with custom Event such as hbr-blur, verified
//       targetRef.dispatchEvent(new Event(e.type, e));
//     }
//   }
// };
// This function should go inside of componentDidLoad, this may toss a warning on extra rendering
// This takes an element, usually a reference
// And then calculate it and parent's z index
// and then use such z index for floating element such as tooltip or dropdown
// so then these floating element won't be hidden because the reference element has an higher z-index
const getFloatElmZIndex = (elem) => {
    let z = 0;
    let nextTarget = elem;
    while (nextTarget) {
        const curZ = parseInt(elem.ownerDocument.defaultView
            .getComputedStyle(nextTarget, null)
            .getPropertyValue("z-index") ||
            elem.ownerDocument.defaultView
                .getComputedStyle(nextTarget, null)
                .getPropertyValue("zIndex"));
        if (!Number.isNaN(curZ)) {
            z = Math.max(z, curZ);
        }
        nextTarget = nextTarget.parentElement;
    }
    return z + 1;
};
const createFloatingContainer = (nodeToAttach) => {
    let floatingContainer = nodeToAttach.ownerDocument.querySelector(".hbr-floating-container");
    if (!floatingContainer) {
        floatingContainer = nodeToAttach.ownerDocument.createElement("div");
        floatingContainer.className = "hbr-floating-container";
        // park event forwarding for now unless there is a use case
        // add event listener for every event including hbr ones
        // Object.keys(nodeToAttach.ownerDocument.defaultView).forEach(key => {
        //   if (/^on/.test(key)) {
        //     floatingContainer.addEventListener(key.slice(2), event => {
        //       forwardEvents(event, nodeToAttach.ownerDocument);
        //     });
        //   }
        // });
        nodeToAttach.appendChild(floatingContainer);
    }
    return floatingContainer;
};
const showFloatingContainer = async (refNode, floatingNode, { distance = 0, placement, zIndex, delay = 0, marginLeft, marginTop, minWidth, }, callbackOnChange) => {
    const { autoPlacement, autoUpdate, computePosition, offset, shift } = await loadFloatingUi();
    const middleware = [offset(distance), shift()];
    // for placing pos with min-width case
    let widthOffset = 0;
    if (minWidth && minWidth > refNode.offsetWidth) {
        widthOffset = (minWidth - refNode.offsetWidth) / 2;
    }
    // autoUpdate calling updatePosition all the time
    // use injectCssVisible to set True manually for the first time a user trying to show floating element
    // subsequential call on updatePosition is done by autoUpdate with event as first argument
    // which does not change visibility and opacity
    function updatePosition(injectCssVisible = false) {
        const cssVisible = {
            visibility: "visible",
            opacity: 1,
        };
        setTimeout(() => {
            if (placement === "auto") {
                middleware.push(autoPlacement());
            }
            const positionOptions = placement === "auto" ? { middleware } : { placement, middleware };
            computePosition(refNode, floatingNode, positionOptions).then(({ x, y }) => {
                Object.assign(floatingNode.style, Object.assign(Object.assign({ top: `${y + (marginTop ? marginTop : 0)}px`, left: `${x + (marginLeft ? marginLeft : 0) + widthOffset}px` }, (typeof injectCssVisible === "boolean" &&
                    injectCssVisible === true
                    ? cssVisible
                    : "")), (zIndex ? { zIndex: zIndex } : "")));
                callbackOnChange === null || callbackOnChange === void 0 ? void 0 : callbackOnChange();
            });
        }, delay);
    }
    updatePosition(true);
    return autoUpdate(refNode, floatingNode, updatePosition);
};
const hideFloatingContainer = (target, { delay = 0 }, callbackOnChange) => {
    setTimeout(() => {
        let existStyle = target
            .getAttribute("style")
            .split(";")
            .map((r) => r.trim())
            .filter((r) => !(r === "visibility: visible" || r === "opacity: 1"))
            .join(";");
        existStyle += "visibility: hidden; opacity: 0";
        target.setAttribute("style", existStyle);
        callbackOnChange === null || callbackOnChange === void 0 ? void 0 : callbackOnChange();
    }, delay);
};

const tabPopoverCss = ":host{display:block;z-index:10;--height:40px;--line-height:var(--hbr-font-line-height-normal)}:host .hbr-menu{--box-shadow:none}:host hbr-tab{width:100%}:host([nav]){--prefix-margin-right:0;--suffix-margin-left:0}.tab_popover-collapsed{width:50px;overflow:hidden}.tab_popover-collapsed.tab_popover-active{min-width:fit-content;overflow:visible}.tab_popover-collapsed.label{margin-left:var(--hbr-spacing-lg)}.tab_popover--icon{font-size:var(--hbr-font-size-xl);height:var(--hbr-font-size-xl)}.tab_overlay{position:absolute;width:42px;height:40px;border-radius:4px;box-shadow:var(--hbr-shadow-lg);background-color:rgba(255, 255, 255, 0)}";
const HbrTabPopoverStyle0 = tabPopoverCss;

const TabPopover = /*@__PURE__*/ proxyCustomElement(class TabPopover extends HTMLElement$1 {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this._floatingListener = null;
        this.handleKeyDown = (event) => {
            if (["ArrowRight", "Enter"].includes(event.key)) {
                event.stopPropagation();
                const popoverDiv = this.host.ownerDocument.querySelector(`#${this.contentId}`);
                if (popoverDiv) {
                    const menuItems = popoverDiv.querySelectorAll("hbr-menu-item");
                    const selectedItem = menuItems && Array.from(menuItems).filter((item) => item.checked);
                    if (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem[0]) {
                        selectedItem[0].focus();
                    }
                    else {
                        const menuItemElem = popoverDiv.querySelector("hbr-menu-item");
                        menuItemElem === null || menuItemElem === void 0 ? void 0 : menuItemElem.focus();
                    }
                }
            }
        };
        this.onHover = async (options) => {
            if (this.focusEvent === null) {
                this.focusEvent = options.type === "focusin";
            }
            if (!this.active) {
                const popoverDiv = this.host.ownerDocument.querySelector(`#${this.contentId}`);
                this._floatingListener = await showFloatingContainer(this.host, popoverDiv, {
                    distance: this.distance,
                    placement: this.collapsed ? "bottom-end" : "right-start",
                    marginTop: this.collapsed ? -40 : 0,
                    zIndex: this.zIndex,
                    delay: 0,
                    marginLeft: this.collapsed ? 50 : 0,
                });
                this.active = true;
            }
            const tab = this.host.shadowRoot.querySelector("hbr-tab");
            tab.setFocus(options);
        };
        this.handlePanelKeyDown = (event) => {
            if (["ArrowLeft", "Escape"].includes(event.key)) {
                const activeEl = document.activeElement;
                const id = activeEl.closest(".hbr-tab-popover").id;
                const popover = document.querySelector(`[content-id=${id}]`);
                const tab = popover.shadowRoot.querySelector("hbr-tab");
                tab.setFocus({ preventScroll: true });
            }
        };
        this.onLeave = (event) => {
            this.focusEvent = null;
            // find the next element from moving out
            let nextTarget = event && (event.toElement || event.relatedTarget);
            let isCorspondingFloatingElem = false;
            while (!isCorspondingFloatingElem && nextTarget) {
                if (nextTarget.id === this.contentId) {
                    isCorspondingFloatingElem = true;
                    break;
                }
                nextTarget = nextTarget.parentNode;
            }
            if (!isCorspondingFloatingElem && this.active) {
                const target = this.host.ownerDocument.querySelector(`#${this.contentId}`);
                hideFloatingContainer(target, { delay: 0 });
                this.active = false;
            }
            const tab = this.host.shadowRoot.querySelector("hbr-tab");
            tab.removeFocus();
        };
        this.nav = false;
        this.collapsed = false;
        this.contentId = `hbr-tab-popover-id-${generateShortID()}`;
        this.zIndex = 1;
        this.distance = 0;
        this.placement = "right";
        this.active = false;
        this.focusEvent = false;
    }
    /** Sets focus to the tab-popover. */
    async setFocus(options) {
        this.onHover(options);
    }
    /** Removes focus to the tab-popover. */
    async removeFocus(event) {
        this.onLeave(event);
    }
    connectedCallback() {
        const floatingContainer = createFloatingContainer(this.host.ownerDocument.body);
        const curContainer = this.host.ownerDocument.createElement("div");
        curContainer.className = "hbr-tab-popover hbr-floating-component";
        curContainer.id = this.contentId;
        curContainer.setAttribute("part", "panel");
        curContainer.setAttribute("placement", this.placement);
        curContainer.addEventListener("mouseleave", this.onLeave);
        floatingContainer.appendChild(curContainer);
    }
    componentDidLoad() {
        // get max z-index of the reference
        if (this.zIndex === undefined) {
            this.zIndex = getFloatElmZIndex(this.host);
        }
        const popoverDiv = this.host.ownerDocument.querySelector(`#${this.contentId}`);
        if (popoverDiv && popoverDiv.innerHTML === "") {
            const slot = this.panel.querySelector("slot");
            if (slot) {
                // extract all the items
                const slotContent = [...slot.assignedElements({ flatten: true })];
                // remove the slot element, which is just an empty tag
                this.panel.innerHTML = "";
                // copy the panel
                popoverDiv.appendChild(this.panel);
                // push into panel again, panel is now in floating container
                slotContent.forEach((r) => {
                    this.panel.appendChild(r);
                });
            }
            else {
                console.warn("no slot in dropdown is found");
            }
        }
    }
    disconnectedCallback() {
        const popoverDiv = this.host.ownerDocument.querySelector(`#${this.contentId}`);
        popoverDiv.removeEventListener("mouseleave", this.onLeave);
        if (popoverDiv) {
            popoverDiv.remove();
        }
        if (this._floatingListener) {
            this._floatingListener();
        }
    }
    render() {
        return (h(Host, { key: 'b5ff15d37ac5dee423712e5d8307850c34d160f0' }, h("div", { key: '628943516505c43f0639bc412dc198b9da3476fe', part: "base", onMouseOver: this.onHover, onMouseLeave: this.onLeave, onFocusin: this.onHover, onFocus: this.onHover, onBlur: this.onLeave, onKeyDown: this.handleKeyDown, ref: (el) => {
                this.tabElement = el;
            }, class: {
                tab_popover: true,
                "tab_popover-collapsed": this.collapsed,
                "tab_popover-active": this.active,
            } }, this.collapsed && this.active ? h("div", { class: "tab_overlay" }) : null, h("hbr-tab", { key: '9ad6e869189c5560822f515660df4b9bdd9ece51', nav: true, vertical: true, popOver: true, hover: this.active, focusEvent: this.focusEvent }, h("div", { key: '01fecd649a42fcb93273df7e8ca455f36cdd9c00', slot: "prefix" }, h("slot", { key: 'db1d911add242ce23c1059c34dce1661e585e8d3', name: "icon" })), h("div", { key: 'a6e2da73c043fd2a5b848db66f991e518ab5f2ed', slot: "label" }, h("slot", { key: '402bbcf273e358d9c0296e92d81c1d8805d7e624', name: "label" }))), h("div", { key: '91efc92c61aaf4a8befed5ca8e7996238135b303', part: "panel", onKeyDown: this.handlePanelKeyDown, class: {
                "popover-panel": true,
                "popover-panel-collapsed": this.collapsed,
            }, ref: (el) => {
                this.panel = el;
            }, "aria-hidden": this.active ? "false" : "true", "aria-labelledby": this.contentId }, h("slot", { key: '3cd98e3de260d2dbf37396ccd32a8db32394c91b' })))));
    }
    get host() { return this; }
    static get style() { return HbrTabPopoverStyle0; }
}, [1, "hbr-tab-popover", {
        "nav": [516],
        "collapsed": [516],
        "contentId": [513, "content-id"],
        "zIndex": [1026, "z-index"],
        "distance": [2],
        "placement": [513],
        "active": [32],
        "focusEvent": [32],
        "setFocus": [64],
        "removeFocus": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-popover", "hbr-icon", "hbr-icon-button", "hbr-tab"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-popover":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabPopover);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTabPopover = TabPopover;
const defineCustomElement = defineCustomElement$1;

export { HbrTabPopover, defineCustomElement };

