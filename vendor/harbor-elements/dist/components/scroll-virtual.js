import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { L as LocalScrollService } from './localScrollService.js';
import { g as getScrollbarWidth } from './utils.js';

const scrollCss = "hbr-scroll-virtual[auto-hide]{position:absolute;z-index:100}hbr-scroll-virtual[auto-hide].vertical{right:0}hbr-scroll-virtual[auto-hide].vertical:hover{min-width:20px}hbr-scroll-virtual[auto-hide].horizontal{bottom:0;left:0}hbr-scroll-virtual[auto-hide].horizontal:hover{min-height:20px}hbr-scroll-virtual.vertical{--vertical-scroll-offset-default:calc(var(--header-height) * calc(1 + var(--group-header-depth, 0)));overflow-y:auto;overflow-x:hidden;height:calc(100% - var(--vertical-scroll-offset, var(--vertical-scroll-offset-default)));position:absolute;right:0px;bottom:0px}hbr-scroll-virtual.vertical>div{width:1px}hbr-scroll-virtual.horizontal{overflow-x:auto;overflow-y:hidden;width:100%}hbr-scroll-virtual.horizontal>div{height:1px}";
const HbrScrollVirtualStyle0 = scrollCss;

const HbrgrScrollVirtual = /*@__PURE__*/ proxyCustomElement(class HbrgrScrollVirtual extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.scrollVirtual = createEvent(this, "scrollVirtual", 7);
        this.scrollSize = 0;
        this.isAutoHide = false;
        this.autoHideTimeout = 0;
        this.dimension = "rgRow";
        this.viewportStore = undefined;
        this.dimensionStore = undefined;
    }
    async setScroll(e) {
        var _a;
        if (this.dimension !== e.dimension) {
            return;
        }
        (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
    }
    // update on delta in case we don't know existing position or external change
    async changeScroll(e) {
        if (e.delta) {
            switch (e.dimension) {
                case "rgCol":
                    e.coordinate = this.element.scrollLeft + e.delta;
                    break;
                case "rgRow":
                    e.coordinate = this.element.scrollTop + e.delta;
                    break;
            }
            this.setScroll(e);
        }
        return e;
    }
    set size(s) {
        if (this.dimension === "rgRow") {
            this.element.style.minWidth = `${s}px`;
            return;
        }
        this.element.style.minHeight = `${s}px`;
    }
    get size() {
        if (this.dimension === "rgRow") {
            return this.element.clientHeight;
        }
        return this.element.clientWidth;
    }
    connectedCallback() {
        this.scrollService = new LocalScrollService({
            beforeScroll: (e) => this.scrollVirtual.emit(e),
            afterScroll: (e) => {
                const type = e.dimension === "rgRow" ? "scrollTop" : "scrollLeft";
                this.element[type] = e.coordinate;
            },
        });
    }
    disconnectedCallback() {
        clearTimeout(this.autoHideTimeout);
    }
    componentWillLoad() {
        this.scrollSize = getScrollbarWidth(document);
        this.isAutoHide = !this.scrollSize;
    }
    componentDidRender() {
        const type = this.dimension === "rgRow" ? "scrollHeight" : "scrollWidth";
        if (this.element[type] > this.size) {
            this.size = this.scrollSize;
        }
        else {
            this.size = 0;
        }
        this.scrollService.setParams({
            contentSize: this.dimensionStore.get("realSize"),
            clientSize: this.size,
            virtualSize: this.viewportStore.get("virtualSize"),
        }, this.dimension);
    }
    onScroll(e) {
        var _a;
        let type = "scrollLeft";
        if (this.dimension === "rgRow") {
            type = "scrollTop";
        }
        if (this.isAutoHide) {
            this.size = 20;
            this.autoHideTimeout = this.autoHide(this.autoHideTimeout);
        }
        const target = e.target;
        (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(target[type] || 0, this.dimension, undefined, undefined, { scrollTop: target.scrollTop, height: this.dimensionStore.get("realSize") - this.viewportStore.get("virtualSize") });
    }
    autoHide(timeout) {
        clearTimeout(timeout);
        return setTimeout(() => {
            this.size = 0;
        }, 6000);
    }
    render() {
        const sizeType = this.dimension === "rgRow" ? "height" : "width";
        return (h(Host, { key: 'cc0ff1d7305d0b7a2ce640dd0a556cae9588582d', "auto-hide": this.isAutoHide, onScroll: (e) => this.onScroll(e) }, h("div", { key: '48eae5e0ad509720fb1a8836c3b37f9219cfe137', style: {
                [sizeType]: `${this.extContentSize(this.viewportStore.get("virtualSize"), this.dimensionStore.get("realSize"))}px`,
            } })));
    }
    extContentSize(vsize, contentSize) {
        return LocalScrollService.getVirtualContentSize(contentSize, this.size, vsize);
    }
    get element() { return this; }
    static get style() { return HbrScrollVirtualStyle0; }
}, [0, "hbr-scroll-virtual", {
        "dimension": [1],
        "viewportStore": [16],
        "dimensionStore": [16],
        "setScroll": [64],
        "changeScroll": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-scroll-virtual"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-scroll-virtual":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrScrollVirtual);
            }
            break;
    } });
}

export { HbrgrScrollVirtual as H, defineCustomElement as d };

