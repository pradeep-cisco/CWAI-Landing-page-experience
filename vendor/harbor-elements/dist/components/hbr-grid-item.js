import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { B as remove } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';

const hbrGridItemCss = ":host{display:block}hbr-grid-item{display:block;position:absolute;overflow:hidden;z-index:1;display:flex}hbr-grid-item.hbr-css--grid-item-dragging{z-index:3}hbr-grid-item.hbr-css--grid-item-releasing{z-index:2}hbr-grid-item.hbr-css--grid-item-hidden{z-index:0}hbr-grid-item>.hbr-css--grid-item--content{position:relative;width:100%;height:100%}hbr-grid-item .removeGridItem{position:absolute;right:0;z-index:10;cursor:pointer;margin-top:5px;margin-right:5px}.hbr-css--grid-item--type-dashboard,.hbr-css--grid-item--type-cards{--margin-y:var(--hbr-spacing-xs);--margin-x:var(--hbr-spacing-2xs);border-radius:var(--hbr-border-radius-lg);border:1px solid var(--control-border-default);margin:var(--margin-y) var(--margin-x);box-shadow:var(--hbr-shadow-xs);overflow:clip;background-color:var(--control-bg-weak-default)}.hbr-css--grid-item--drag-enabled{cursor:move}.hbr-css--grid-item--item-moving{cursor:grabbing}.hbr-css--grid-item--framework-wrapper{width:100%;height:100%}.hbr-css--grid-item--framework-wrapper.hbr-css--grid-item--type-dashboard,.hbr-css--grid-item--framework-wrapper.hbr-css--grid-item--type-cards{width:calc(100% - 2 * var(--margin-x));height:calc(100% - 2 * var(--margin-y))}";
const HbrGridItemStyle0 = hbrGridItemCss;

const HbrGridItem$1 = /*@__PURE__*/ proxyCustomElement(class HbrGridItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.selectGridItem = createEvent(this, "hbr-select-grid-item", 7);
        this.removeGridItem = createEvent(this, "hbr-remove-grid-item", 7);
        this.addGridItem = createEvent(this, "hbr-add-grid-item", 7);
        this.selectLayoutItemHandler = () => {
            this.selectGridItem.emit(this.uuid);
        };
        this.removeItemHandler = () => {
            this.removeGridItem.emit(this.uuid);
        };
        this.getWidth = () => {
            var _a;
            if (this.responsiveWidth) {
                return this.responsiveWidth[(_a = this.screenSize) === null || _a === void 0 ? void 0 : _a.width];
            }
            return this.width;
        };
        this.getHeight = () => {
            var _a;
            if (this.responsiveHeight) {
                return this.responsiveHeight[(_a = this.screenSize) === null || _a === void 0 ? void 0 : _a.height];
            }
            return this.height;
        };
        this.updateStateHandler = (e) => {
            if (e.target === this.host.closest("hbr-grid")) {
                // @ts-ignore
                this.host.querySelector("div").state = e.detail;
            }
        };
        this.state = null;
        this.uuid = undefined;
        this.type = undefined;
        this.width = undefined;
        this.height = undefined;
        this.responsiveWidth = undefined;
        this.responsiveHeight = undefined;
        this.notSelectable = false;
        this.selected = false;
        this.isRemovable = true;
        this.screenSize = undefined;
        this.isMoving = false;
    }
    componentWillLoad() {
        this.parent = this.host.closest("hbr-grid");
    }
    componentDidLoad() {
        this.runChecks();
        this.addGridItem.emit(this.uuid);
        window.addEventListener("hbr-grid-state-updated", this.updateStateHandler);
    }
    disconnectedCallback() {
        window.removeEventListener("hbr-grid-state-updated", this.updateStateHandler);
    }
    runChecks() {
        if (!this.uuid) {
            console.warn("uuid is a required property for hbr-layout-item");
        }
    }
    render() {
        var _a;
        if (!this.parent)
            return null;
        if (this.host.querySelector("div")) {
            // @ts-ignore
            this.host.querySelector("div").selected = this.selected;
            if (this.isRemovable && this.parent.removeItemsAllowed) {
                this.host.querySelector("div").removeGridItem = this.removeItemHandler;
            }
        }
        const type = this.type || this.parent.type;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { style: {
                width: this.getWidth(),
                height: this.getHeight(),
            } }, h("div", { class: "hbr-css--grid-item--content" }, h("div", { class: `
              hbr-css--grid-item--framework-wrapper
              ${this.parent.muuriConfig.dragEnabled
                ? "hbr-css--grid-item--drag-enabled"
                : ""}
              ${this.isMoving ? "hbr-css--grid-item--item-moving" : ""}
              hbr-css--grid-item--type-${type}
            `, onClick: this.selectLayoutItemHandler, onKeyUp: (event) => {
                if (event.key === "Enter") {
                    this.selectLayoutItemHandler();
                }
            } }, this.parent.type === "dashboard" &&
            this.isRemovable &&
            this.parent.removeItemsAllowed && (h("div", { part: "deleteIcon", class: "removeGridItem", onClick: this.removeItemHandler, onKeyUp: (event) => {
                if (event.key === "Enter") {
                    this.removeItemHandler();
                }
            } }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove }))), h("slot", null)))));
    }
    get host() { return this; }
    static get style() { return HbrGridItemStyle0; }
}, [4, "hbr-grid-item", {
        "uuid": [1],
        "type": [1],
        "width": [1],
        "height": [1],
        "responsiveWidth": [16],
        "responsiveHeight": [16],
        "notSelectable": [4, "not-selectable"],
        "selected": [4],
        "isRemovable": [4, "is-removable"],
        "screenSize": [16],
        "isMoving": [4, "is-moving"],
        "state": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-grid-item", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-grid-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrGridItem$1);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrGridItem = HbrGridItem$1;
const defineCustomElement = defineCustomElement$1;

export { HbrGridItem, defineCustomElement };

