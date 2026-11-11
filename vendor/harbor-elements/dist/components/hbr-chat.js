import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a as caretRight, b as caretLeft } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$4 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$5 } from './button.js';
import { d as defineCustomElement$3 } from './resize-observer.js';
import { d as defineCustomElement$2 } from './spinner.js';

const chatCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:flex;flex-direction:column;width:100%;height:100%;display:flex;flex-direction:column;background:var(--base-bg-default);padding-bottom:var(--hbr-spacing-md);min-width:380px;pointer-events:none;--aside-width:264px;--chat-panel-background:var(--base-bg-weak-default);--aside-background:var(--base-bg-weak-default);--aside-border-gradient:linear-gradient(180deg, var(--base-bg-default) 0%, var(--base-border-default) 50%, var(--base-bg-default) 100%);--collapse-button-border-color:var(--control-border-weak-default);--collapse-button-background:var(--control-bg-weak-default);--collapse-button-hover-background:var(--control-bg-weak-hover);--collapse-button-hover-border-color:var(--interact-border-hover);--collapse-button-hover-color:var(--interact-text-weak-hover)}.header,.aside,.chat-panel,.footer{pointer-events:all}.header{display:flex;align-items:center;align-self:stretch;flex-shrink:0;width:100%}.header--empty{display:none}.main{display:flex;flex-direction:row;gap:var(--hbr-spacing-2xs);flex:1;padding:0 var(--hbr-spacing-md);height:calc(100% - 52px)}.main.header--empty{height:100%}.main .chat-panel{display:flex;flex-direction:column;flex:1;overflow:hidden;background:var(--chat-panel-background);border-radius:var(--hbr-border-radius-lg);margin-inline:auto;position:relative}.main .chat-panel>::slotted(.hbr-css__chat-panel){width:100%;max-width:min(100%, 1096px)}.hbr-css__chat-container-lg{position:relative}.hbr-css__chat-container-lg .aside{padding:var(--hbr-spacing-sm) var(--hbr-spacing-xs);background:var(--aside-background);border-radius:var(--hbr-border-radius-lg);overflow-x:hidden;transition:flex-basis 0.3s ease;flex-basis:var(--aside-width)}.hbr-css__chat-container-lg .aside>*{opacity:1;transition:opacity 0.3s ease}.hbr-css__chat-container-lg .aside.collapsed{flex-basis:0;padding-left:0;padding-right:0}.hbr-css__chat-container-lg .aside.collapsed>*{opacity:0}.hbr-css__chat-container-lg .aside:hover+.collapse-button-trigger{background:linear-gradient(180deg, var(--base-bg-default) 0%, var(--base-border-default) 50%, var(--base-bg-default) 100%)}.hbr-css__chat-container-lg .aside:hover~.collapse-button-container .collapse-button::part(base){opacity:1}.hbr-css__chat-container-lg .aside-wrapper{display:contents}.hbr-css__chat-container-lg .collapse-button-trigger,.hbr-css__chat-container-lg .collapse-button-container{position:absolute;z-index:2;pointer-events:all;transition:left 0.3s ease}.hbr-css__chat-container-lg .collapse-button-trigger{background:transparent;height:100%;width:var(--hbr-spacing-2xs);left:calc(var(--aside-width) + var(--hbr-spacing-md))}.hbr-css__chat-container-lg .collapse-button-trigger.collapsed{left:var(--hbr-spacing-md)}.hbr-css__chat-container-lg .collapse-button-trigger.collapsed:hover,.hbr-css__chat-container-lg .collapse-button-trigger.collapsed:has(+.collapse-button-container:hover){background:transparent}.hbr-css__chat-container-lg .collapse-button-trigger:hover,.hbr-css__chat-container-lg .collapse-button-trigger:has(+.collapse-button-container:hover){background:linear-gradient(180deg, var(--base-bg-default) 0%, var(--base-border-default) 50%, var(--base-bg-default) 100%)}.hbr-css__chat-container-lg .collapse-button-trigger:hover+.collapse-button-container .collapse-button::part(base){opacity:1}.hbr-css__chat-container-lg .collapse-button-container{width:28px;height:28px;top:calc(50% - 14px);left:calc(var(--aside-width) + var(--hbr-spacing-md) - 14px + 2px)}.hbr-css__chat-container-lg .collapse-button-container.collapsed{left:calc(var(--hbr-spacing-md) - 12px)}.hbr-css__chat-container-lg .collapse-button-container.collapsed .collapse-button::part(base){opacity:1}.hbr-css__chat-container-lg .collapse-button-container:hover .collapse-button::part(base){opacity:1}.hbr-css__chat-container-lg .collapse-button::part(base){opacity:0;transition:opacity 0.3s ease;border:var(--hbr-border-width) solid var(--collapse-button-border-color);background:var(--collapse-button-background)}.hbr-css__chat-container-lg .collapse-button::part(base):hover{background-color:var(--collapse-button-hover-background);border-color:var(--collapse-button-hover-border-color);color:var(--collapse-button-hover-color);opacity:1}.hbr-css__chat-container-lg .collapse-button::part(base):focus-visible,.hbr-css__chat-container-lg .collapse-button::part(base):focus{opacity:1}.hbr-css__chat-container-sm{padding-bottom:0}.hbr-css__chat-container-sm .aside{position:absolute;z-index:1;bottom:0;top:0;left:0;width:100%;background-color:var(--overlay-bg-default);transition:background-color 0.3s ease}.hbr-css__chat-container-sm .aside.collapsed{background-color:transparent;pointer-events:none}.hbr-css__chat-container-sm .asideWrapper{padding:var(--hbr-spacing-sm) var(--hbr-spacing-xs);display:flex;width:var(--aside-width);background:var(--aside-background);flex-direction:column;position:absolute;top:0;bottom:0;left:0;transition:left 0.3s ease}.hbr-css__chat-container-sm .asideWrapper.collapsed{left:calc(-1 * var(--aside-width))}.hbr-css__chat-container-sm.main{padding:0 var(--hbr-spacing-xs)}.hbr-css__chat-container-sm .collapse-button-trigger,.hbr-css__chat-container-sm .collapse-button-container{display:none}";
const HbrChatStyle0 = chatCss;

const BREAKPOINT_CLASS = "hbr-css__chat-container";
const HbrChat$1 = /*@__PURE__*/ proxyCustomElement(class HbrChat extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrCollapse = createEvent(this, "hbr-collapse", 7);
        this.hbrExpand = createEvent(this, "hbr-expand", 7);
        this.hbrViewChange = createEvent(this, "hbr-view-change", 7);
        this.activeView = "lg";
        this.collapsedOnResize = false;
        this.collapsed = null;
        this.hasHeader = false;
    }
    handleSlotChange() {
        this.hasHeader = hasSlot(this.host, "header");
    }
    handleResize(event) {
        const { activeBreakpoint } = event.detail;
        if (this.mainRef) {
            this.mainRef.classList.remove(`${BREAKPOINT_CLASS}-${this.activeView}`);
            this.mainRef.classList.add(`${BREAKPOINT_CLASS}-${activeBreakpoint}`);
        }
        if (activeBreakpoint !== this.activeView) {
            this.activeView = activeBreakpoint;
            if (this.activeView === "sm" && !this.collapsed) {
                this.collapsed = true;
                this.hbrCollapse.emit();
                this.collapsedOnResize = true;
            }
            if (this.activeView === "lg" && this.collapsedOnResize) {
                this.collapsed = false;
                this.hbrExpand.emit();
                this.collapsedOnResize = false;
            }
            this.hbrViewChange.emit({ view: this.activeView });
        }
    }
    handleCollapseClick() {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this.hbrCollapse.emit();
        }
        else {
            this.hbrExpand.emit();
        }
    }
    handleAsideClick() {
        if (this.activeView === "sm" && !this.collapsed) {
            this.collapsed = true;
            this.hbrCollapse.emit();
        }
    }
    connectedCallback() {
        var _a;
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        if ((_a = this.host) === null || _a === void 0 ? void 0 : _a.closest) {
            this.parentWindowRef = this.host.closest("hbr-window");
        }
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: 'b8094d6e0c02b4dacbd5a90e0853ae1131236ad4' }, h("div", { key: 'ad507bacc24d1ce303b59b71a4b88e42a64f4606', class: {
                header: true,
                "header--empty": !this.hasHeader,
            } }, h("slot", { key: 'e275126f7a92707c7a2a3c1d850771ecf59c1102', name: "header", onSlotchange: this.handleSlotChange })), h("div", { key: '0579688fe7852afc09dd72d58262b1bcb7070757', ref: (el) => {
                this.mainRef = el;
            }, class: {
                main: true,
                "header--empty": !this.hasHeader,
            } }, h("slot", { key: '71b701ed6d26c98a2d20363e13aeab7e819c4ffe', name: "main" }, h("div", { key: 'e1a19825b8af3e1d1cac217c2725acd62964c428', class: { aside: true, collapsed: !!this.collapsed }, onClick: this.handleAsideClick.bind(this) }, h("div", { key: '774e86272fb19052ceaa85ed43ca71e8ac85845f', class: { asideWrapper: true, collapsed: !!this.collapsed } }, h("slot", { key: '575ac422a233d13a2a49e1c67c07e88cb50a3e51', name: "aside" }))), h("div", { key: '8acd16e0fe3e393da097b80f4697948fbe877601', class: {
                "collapse-button-trigger": true,
                collapsed: !!this.collapsed,
            } }), h("div", { key: '763fb61e733d4b6418f969abc195e1a7c75d6797', class: {
                "collapse-button-container": true,
                collapsed: !!this.collapsed,
            } }, h("hbr-button", { key: 'abc5ee0fcd9cdf8640e0ddbe7f3c6a0f2c1e3a97', part: "collapse-button", variant: "outline", circle: true, sentiment: "neutral", size: "small", class: "collapse-button", onClick: this.handleCollapseClick.bind(this) }, h("hbr-icon", { key: '9b3af71dd97e48828afd06c5f1e108462d259518', asset: this.collapsed
                ? (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight
                : (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-left"]) || caretLeft, style: { fontSize: "16px" } }))), h("div", { key: '2d953ef030a432e64911acdc61d6bd63aefaeb28', class: "chat-panel" }, h("slot", { key: 'ed5b127ba70e1b91fdf8c6ebae66c29f208e98c0', name: "chat-panel" })))), h("div", { key: 'de5c7418b07a8125d7d18ce940b15ad39810d897', class: "footer" }, h("slot", { key: '4c40559751e509b99cd5e07ddd479fed8b92bc9f', name: "footer" })), h("hbr-resize-observer", { key: '2288a8533124a9a4b42bce26b70b38bcb156b7c4', debounce: 100, breakpointClass: BREAKPOINT_CLASS, breakpoints: [768], breakpointLabels: ["sm", "lg"], "onHbr-resize": this.handleResize, responsive: true, anchor: this.host, subscriber: this.parentWindowRef || this.host })));
    }
    get host() { return this; }
    static get style() { return HbrChatStyle0; }
}, [1, "hbr-chat", {
        "collapsed": [1540],
        "hasHeader": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-chat", "hbr-button", "hbr-icon", "hbr-resize-observer", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-chat":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrChat$1);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-icon":
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

const HbrChat = HbrChat$1;
const defineCustomElement = defineCustomElement$1;

export { HbrChat, defineCustomElement };

