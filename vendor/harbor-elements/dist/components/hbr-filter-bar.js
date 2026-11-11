import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';

const filterBarCss = ":host([size=small]){--gap:6px;--fixed-gap:12px}:host([size=medium]){--gap:8px;--fixed-gap:16px}:host{display:flex;flex-direction:row;width:100%;--fixed-section-padding-left:var(--gap);--fixed-section-padding-right:var(--gap);--align-items:center;--collapsible-padding-right:36px}.filter-bar{width:100%;display:flex;flex-direction:row;align-items:var(--align-items);gap:var(--gap)}.filter-bar--start-hide{display:none}.filter-bar--collapsible{display:flex;flex-direction:row;padding-right:var(--collapsible-padding-right);gap:var(--gap)}.filter-bar--filters{display:flex;flex-direction:row;align-items:var(--align-items);gap:var(--gap)}.filter-bar--filters-hide{display:none}.filter-bar--fixed{display:flex;flex-direction:row;align-items:center;gap:var(--fixed-gap);padding-left:var(--fixed-section-padding-left);padding-right:var(--fixed-section-padding-right)}.filter-bar--end{display:flex;flex-direction:row;align-items:var(--align-items);margin-left:auto}.filter-bar--hidden{transform-style:preserve-3d;transform:rotateY(90deg);position:absolute;left:0;top:0;height:0;-ms-overflow-style:none;scrollbar-width:none}.filter-bar--hidden::-webkit-scrollbar{display:none}";
const HbrFilterBarStyle0 = filterBarCss;

const FilterBar = /*@__PURE__*/ proxyCustomElement(class FilterBar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this._gap = { small: 6, medium: 8 };
        this._offset = 0;
        this.size = "medium";
    }
    getTotalWidth() {
        return (this._start.clientWidth +
            this._collapsible.clientWidth +
            this._end.clientWidth);
    }
    handleShowAndHide() {
        const visibleElements = this.getDefaultSlotNodes();
        const totalWidth = this.getTotalWidth();
        if (totalWidth > this._base.clientWidth) {
            this.hideLastElement(visibleElements);
        }
        else {
            this.showFirstHiddenElement(totalWidth);
        }
        if (this.getDefaultSlotNodes().length === 0) {
            this._filters.classList.add("filter-bar--filters-hide");
        }
        else {
            this._filters.classList.remove("filter-bar--filters-hide");
        }
        this.updateOverflowSlots();
    }
    hideLastElement(elements) {
        if (elements.length) {
            elements[elements.length - 1].setAttribute("slot", "hide");
        }
    }
    showFirstHiddenElement(totalWidth) {
        const hiddenElements = this.getHiddenElements();
        if (hiddenElements.length &&
            totalWidth +
                hiddenElements[0].clientWidth +
                this._gap[this.size] +
                this._offset <
                this._base.clientWidth) {
            hiddenElements[0].removeAttribute("slot");
        }
    }
    updateOverflowSlots() {
        const hiddenElements = this.getHiddenElements();
        const overflowSlot = this.host.querySelector("[slot='overflow']");
        const overflowHideSlot = this.host.querySelector("[slot='overflow-hide']");
        if (!hiddenElements.length) {
            overflowSlot === null || overflowSlot === void 0 ? void 0 : overflowSlot.setAttribute("slot", "overflow-hide");
        }
        else {
            overflowHideSlot === null || overflowHideSlot === void 0 ? void 0 : overflowHideSlot.setAttribute("slot", "overflow");
        }
    }
    getDefaultSlotNodes() {
        const slot = this._filters.querySelector("slot");
        const assignedNodes = slot.assignedNodes();
        return assignedNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    }
    getHiddenElements() {
        return Array.from(this.host.querySelectorAll("[slot='hide']"));
    }
    initializeResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => this.handleShowAndHide());
        this._resizeObserver.observe(this._base);
        this._resizeObserver.observe(this._collapsible);
    }
    handleSlotChange() {
        this._hasStart = hasSlot(this.host, "start");
        this._hasFixed = hasSlot(this.host, "fixed");
        this._hasOverflow = hasSlot(this.host, "overflow");
        this._hasFixedSuffix = hasSlot(this.host, "fixed-suffix");
    }
    componentDidLoad() {
        this._base = this.host.shadowRoot.querySelector("[part='base']");
        this._start = this.host.shadowRoot.querySelector("[part='start']");
        this._filters = this.host.shadowRoot.querySelector("[part='filters']");
        this._fixed = this.host.shadowRoot.querySelector("[part='fixed']");
        this._end = this.host.shadowRoot.querySelector("[part='end']");
        this._collapsible = this.host.shadowRoot.querySelector("[part='collapsible']");
        if (!this._base || !this._filters || !this._fixed || !this._end)
            return;
        this.initializeResizeObserver();
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    disconnectedCallback() {
        var _a;
        (_a = this._resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    render() {
        return (h(Host, { key: 'b7196e4b854de98f0f384b88b82c72308347543b' }, h("div", { key: '957c57501f3db67afa405300c92f3839c83c5e71', class: {
                "filter-bar": true,
                "filter-bar--small": this.size === "small",
                "filter-bar--medium": this.size === "medium",
            }, part: "base" }, h("div", { key: 'c4d6c2cec1cd0803b72f93136152bcf9bb168f2c', class: { "filter-bar--start-hide": !this._hasStart }, part: "start" }, h("slot", { key: 'a0051abeeb44d51f01c65247bee24983132e1b2c', name: "start", onSlotchange: this.handleSlotChange })), h("div", { key: 'bc7c8fed92be91463e40e478f4d5cb818e4f91aa', class: "filter-bar--collapsible", part: "collapsible" }, h("div", { key: '47d236a859358a8baeda304addbdf5181b5e0853', class: "filter-bar--filters", part: "filters" }, h("slot", { key: '297a5420db1731b7ae7e757ad79b42a80d6228a9', onSlotchange: this.handleSlotChange })), h("div", { key: 'fdbd77448723eda5cf6466f89a7a93714a50b5dd', class: {
                "filter-bar--fixed": this._hasFixed || this._hasOverflow || this._hasFixedSuffix,
            }, part: "fixed" }, h("slot", { key: 'e9b5911daf6c48acb142fe3387e048b5d262cdf2', name: "fixed", onSlotchange: this.handleSlotChange }), h("slot", { key: '922e3892651a617b0643172d31737df92864e859', name: "overflow", onSlotchange: this.handleSlotChange }), h("slot", { key: 'e026555ca63a1fd869c8d719f8cd59a7a95ba29b', name: "fixed-suffix", onSlotchange: this.handleSlotChange }))), h("div", { key: 'b15624e21088f53a688d8f72d7d89baacb4c7eae', class: "filter-bar--end", part: "end" }, h("slot", { key: '355c37b5121ac0c68157e05436778ea56b8f5fdf', name: "end" }))), h("div", { key: '45eac74e52eb9661b97ff8080779c1f3057e35f3', class: "filter-bar--hidden", part: "hidden", inert: true }, h("slot", { key: '70329c11f08e61a193625beb9791d2e8844cb4fc', name: "hide" }), h("slot", { key: 'af30598cd0264b1913db2d914c6b47c947289e83', name: "overflow-hide" }))));
    }
    get host() { return this; }
    static get style() { return HbrFilterBarStyle0; }
}, [1, "hbr-filter-bar", {
        "size": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-filter-bar"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-filter-bar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FilterBar);
            }
            break;
    } });
}

const HbrFilterBar = FilterBar;
const defineCustomElement = defineCustomElement$1;

export { HbrFilterBar, defineCustomElement };

