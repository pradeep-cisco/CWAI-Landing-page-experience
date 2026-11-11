import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { t as throttle, e as each } from './function-helper.js';
import { L as LocalScrollService } from './localScrollService.js';

const HEADER_SLOT = "header";
const FOOTER_SLOT = "footer";
const CONTENT_SLOT = "content";
const DATA_SLOT = "data";
/** Receive last visible in viewport by required type */
function getLastCell(data, rowType) {
    return {
        x: data.viewports[data.colType].store.get("realCount"),
        y: data.viewports[rowType].store.get("realCount"),
    };
}

async function resizeObserver() {
    if (!("ResizeObserver" in window)) {
        const module = await import('./resize-observer2.js');
        window.ResizeObserver =
            module.ResizeObserver;
    }
}

class GridResizeService {
    constructor(el, events) {
        this.events = events;
        this.resizeObserver = null;
        this.resize = throttle((e, o) => { var _a; return (_a = this.events) === null || _a === void 0 ? void 0 : _a.resize(e, o); }, 10);
        this.init(el);
    }
    async init(el) {
        var _a;
        await resizeObserver();
        this.resizeObserver = new ResizeObserver(this.resize);
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(el);
    }
    destroy() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.resizeObserver = null;
    }
}

const viewportScrollCss = "hbr-viewport-scroll{-ms-overflow-style:none;scrollbar-width:none;}hbr-viewport-scroll::-webkit-scrollbar{display:none;-webkit-appearance:none}hbr-viewport-scroll{overflow-x:auto;overflow-y:hidden;position:relative;z-index:1;height:100%}hbr-viewport-scroll.colPinStart,hbr-viewport-scroll.colPinEnd{z-index:2}hbr-viewport-scroll.rowHeaders{z-index:2;font-size:10px}hbr-viewport-scroll.rowHeaders hbr-table-data .rgCell{text-align:center}hbr-viewport-scroll.rowHeaders .rgCell{padding:0 1em !important;min-width:100%}hbr-viewport-scroll.rgCol{flex-grow:1}hbr-viewport-scroll .content-wrapper{overflow:hidden}hbr-viewport-scroll .inner-content-table{display:flex;flex-direction:column;max-height:100%;width:100%;min-width:100%;position:relative;z-index:0}hbr-viewport-scroll .vertical-inner{overflow-y:auto;position:relative;width:100%;flex-grow:1;-ms-overflow-style:none;scrollbar-width:none;}hbr-viewport-scroll .vertical-inner::-webkit-scrollbar{display:none;-webkit-appearance:none}hbr-viewport-scroll .vertical-inner hbr-table-data,hbr-viewport-scroll .vertical-inner hbr-overlay-selection{height:100%}hbr-viewport-scroll.colPinEnd.noRows{position:absolute;top:0;right:0;height:auto}hbr-viewport-scroll.colPinEnd.noRows .header-wrapper{background-color:var(--base-bg-weak-default)}hbr-viewport-scroll.colPinEnd.noRows .vertical-inner,hbr-viewport-scroll.colPinEnd.noRows .footer-wrapper{display:none}";
const HbrViewportScrollStyle0 = viewportScrollCss;

const HbrgrViewportScroll = /*@__PURE__*/ proxyCustomElement(class HbrgrViewportScroll extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.scrollViewport = createEvent(this, "scrollViewport", 3);
        this.resizeViewport = createEvent(this, "resizeViewport", 7);
        this.scrollchange = createEvent(this, "scrollchange", 7);
        this.hbrContentHeightChange = createEvent(this, "hbr-content-height-change", 7);
        this.scrollThrottling = 30;
        this.oldValY = this.contentHeight;
        this.oldValX = this.contentWidth;
        /**
         * Last mw event time for trigger scroll function below
         * If mousewheel function was ignored we still need to trigger render
         */
        this.mouseWheelScroll = {
            rgCol: 0,
            rgRow: 0,
        };
        this.reachTop = () => this.verticalScroll.scrollTop <= 0;
        this.reachBottom = () => {
            var _a;
            const rect = (_a = this.verticalScroll) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (rect) {
                return (this.verticalScroll.scrollTop >=
                    Math.ceil(this.contentHeight) - Math.ceil(rect.height));
            }
        };
        this.contentWidth = 0;
        this.contentHeight = 0;
        this.tbSelf = undefined;
    }
    handleContentHeightChanged(...params) {
        this.hbrContentHeightChange.emit({
            height: params[0],
            oldHeight: params[1],
        });
    }
    async setScroll(e) {
        var _a;
        this.latestScrollUpdate(e.dimension);
        (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
    }
    /**
     * update on delta in case we don't know existing position or external change
     * @param e
     */
    async changeScroll(e) {
        if (e.delta) {
            switch (e.dimension) {
                case "rgCol":
                    e.coordinate = this.horizontalScroll.scrollLeft + e.delta;
                    break;
                case "rgRow":
                    e.coordinate = this.verticalScroll.scrollTop + e.delta;
                    break;
            }
            this.setScroll(e);
        }
        return e;
    }
    connectedCallback() {
        /**
         * Bind scroll functions for farther usage
         */
        if ("ontouchstart" in document.documentElement) {
            this.scrollThrottling = 0;
        }
        else {
            this.verticalMouseWheel = this.onVerticalMouseWheel.bind(this, "rgRow", "deltaY");
            this.horizontalMouseWheel = this.onHorizontalMouseWheel.bind(this, "rgCol", "deltaX");
        }
        /**
         * Create local scroll service
         */
        this.scrollService = new LocalScrollService({
            beforeScroll: (e) => this.scrollViewport.emit(e),
            afterScroll: (e) => {
                switch (e.dimension) {
                    case "rgCol":
                        this.horizontalScroll.scrollLeft = e.coordinate;
                        break;
                    case "rgRow":
                        this.verticalScroll.scrollTop = e.coordinate;
                        break;
                }
            },
        });
    }
    componentDidLoad() {
        /**
         * Track horizontal viewport resize
         */
        this.horisontalResize = new GridResizeService(this.horizontalScroll, {
            resize: (entries) => {
                var _a, _b;
                let height = ((_a = entries[0]) === null || _a === void 0 ? void 0 : _a.contentRect.height) || 0;
                if (height) {
                    height -= this.header.clientHeight + this.footer.clientHeight;
                }
                const els = {
                    rgRow: {
                        size: height,
                        contentSize: this.contentHeight,
                        scroll: this.verticalScroll.scrollTop,
                    },
                    rgCol: {
                        size: ((_b = entries[0]) === null || _b === void 0 ? void 0 : _b.contentRect.width) || 0,
                        contentSize: this.contentWidth,
                        scroll: this.horizontalScroll.scrollLeft,
                    },
                };
                each(els, (item, dimension) => {
                    var _a;
                    this.resizeViewport.emit({ dimension, size: item.size });
                    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(item.scroll, dimension, true);
                    // track scroll visibility on outer element change
                    this.setScrollVisibility(dimension, item.size, item.contentSize);
                });
            },
        });
        /** Emit initial height of content */
        this.handleContentHeightChanged(this.contentHeight, 0);
    }
    /**
     * Check if scroll present or not per type
     * Trigger this method on inner content size change or on outer element size change
     * If inner content bigger then outer size then scroll is present and mousewheel binding required
     * @param type - dimension type 'rgRow/y' or 'rgCol/x'
     * @param size - outer content size
     * @param innerContentSize - inner content size
     */
    setScrollVisibility(type, size, innerContentSize) {
        // test if scroll present
        const hasScroll = size < innerContentSize;
        let el;
        // event reference for binding
        let event;
        switch (type) {
            case "rgCol":
                el = this.horizontalScroll;
                event = this.horizontalMouseWheel;
                break;
            case "rgRow":
                el = this.verticalScroll;
                event = this.verticalMouseWheel;
                break;
        }
        // based on scroll visibility assign or remove class and event
        if (hasScroll) {
            el.classList.add(`scroll-${type}`);
            el.addEventListener("mousewheel", event);
        }
        else {
            el.classList.remove(`scroll-${type}`);
            el.removeEventListener("mousewheel", event);
        }
        this.scrollchange.emit({ type, hasScroll });
    }
    disconnectedCallback() {
        this.verticalScroll.removeEventListener("mousewheel", this.verticalMouseWheel);
        this.horizontalScroll.removeEventListener("mousewheel", this.horizontalMouseWheel);
        this.horisontalResize.destroy();
    }
    async componentDidRender() {
        // scroll update if number of rows changed
        if (this.contentHeight < this.oldValY && this.verticalScroll) {
            if (this.tbSelf.syncScrollOnUpdate) {
                this.verticalScroll.scrollTop += this.contentHeight - this.oldValY;
            }
        }
        this.oldValY = this.contentHeight;
        // scroll update if number of cols changed
        if (this.contentWidth < this.oldValX) {
            this.horizontalScroll.scrollLeft += this.contentWidth - this.oldValX;
        }
        this.oldValX = this.contentWidth;
        this.scrollService.setParams({
            contentSize: this.contentHeight,
            clientSize: this.verticalScroll.clientHeight,
            virtualSize: 0,
        }, "rgRow");
        this.scrollService.setParams({
            contentSize: this.contentWidth,
            clientSize: this.horizontalScroll.clientWidth,
            virtualSize: 0,
        }, "rgCol");
        this.setScrollVisibility("rgRow", this.verticalScroll.clientHeight, this.contentHeight);
        this.setScrollVisibility("rgCol", this.horizontalScroll.clientWidth, this.contentWidth);
    }
    render() {
        return (h(Host, { key: '2cb6ac7405d85e770b18db5ee3f3872cafb547a0', onScroll: (e) => this.onScroll("rgCol", e) }, h("div", { key: '7a8e6402b81c083d6712df34e3ad2bc2fdf04944', class: "inner-content-table", style: { width: `${this.contentWidth}px` } }, h("div", { key: 'b6c965050d803d627ad942ca75ac6722c77136bc', class: "header-wrapper", ref: (e) => {
                this.header = e;
            } }, h("slot", { key: '3bf55aa942d88f47c05c82af3e2b797072f81ec8', name: HEADER_SLOT })), h("div", { key: 'c2996d4338646c1c8fdc20781cfd9f0ea6ec91f4', class: "vertical-inner", ref: (el) => {
                this.verticalScroll = el;
            }, onScroll: (e) => this.onScroll("rgRow", e) }, h("div", { key: '49286d58ac1293b421a3a21febf0c1fffcb827ab', class: "content-wrapper", style: { height: `${this.contentHeight}px` } }, h("slot", { key: 'a67595918f2bdfa7151cb2fba56a4e30e41b2dc8', name: CONTENT_SLOT }))), h("div", { key: '0e930762f869193de51979683b42cc51b55ad60a', class: "footer-wrapper", ref: (e) => {
                this.footer = e;
            } }, h("slot", { key: '6bc53fab13818105e932c8d91b111860332ff248', name: FOOTER_SLOT })))));
    }
    /**
     * Extra layer for scroll event monitoring, where MouseWheel event is not passing
     * We need to trigger scroll event in case there is no mousewheel event
     */
    onScroll(dimension, e) {
        var _a;
        const target = e.target;
        let scroll = 0;
        switch (dimension) {
            case "rgCol":
                scroll = target === null || target === void 0 ? void 0 : target.scrollLeft;
                break;
            case "rgRow":
                scroll = target === null || target === void 0 ? void 0 : target.scrollTop;
                break;
        }
        const change = new Date().getTime() - this.mouseWheelScroll[dimension];
        if (change > this.scrollThrottling) {
            (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(scroll, dimension, undefined, undefined, this.getScrollDetail());
        }
    }
    getScrollDetail() {
        var _a;
        const rect = (_a = this.verticalScroll) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect) {
            return {
                height: this.contentHeight - rect.height,
                scrollTop: this.verticalScroll.scrollTop,
            };
        }
        else {
            // @ts-ignore
            return {};
        }
    }
    /** remember last mw event time */
    latestScrollUpdate(dimension) {
        this.mouseWheelScroll[dimension] = new Date().getTime();
    }
    /**
     * On vertical mousewheel event
     * @param type
     * @param delta
     * @param e
     */
    onVerticalMouseWheel(type, delta, e) {
        var _a, _b, _c;
        // stop the native event when the scrolling is not reach the top/bottom
        if (delta === "deltaY") {
            if (!this.reachTop() && !this.reachBottom()) {
                e.preventDefault(); // hijacks scroll from page
            }
        }
        if ((_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.paginationPlugin) === null || _b === void 0 ? void 0 : _b.paginationRef) {
            this.handlePaginationScroll(type, delta, e);
        }
        else {
            const pos = this.verticalScroll.scrollTop + e[delta];
            (_c = this.scrollService) === null || _c === void 0 ? void 0 : _c.scroll(pos, type, undefined, e[delta], this.getScrollDetail());
            this.latestScrollUpdate(type);
        }
    }
    handlePaginationScroll(type, delta, e) {
        var _a, _b, _c;
        let pos = this.verticalScroll.scrollTop + e[delta];
        const paginationPlugin = this.tbSelf.paginationPlugin;
        const paginationRef = paginationPlugin.paginationRef;
        if (paginationPlugin.isStopScrolling())
            return;
        const wrapperHeight = this.verticalScroll.offsetHeight;
        const page = paginationRef.page;
        const pageSize = paginationRef.pageSize;
        const rowSize = (_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.themeService) === null || _b === void 0 ? void 0 : _b.rowSize;
        const min = rowSize * pageSize * page || 0;
        const max = rowSize * pageSize * (page + 1) - wrapperHeight;
        if (pos > max)
            pos = max;
        if (pos < min)
            pos = min;
        if (min <= pos && pos <= max) {
            (_c = this.scrollService) === null || _c === void 0 ? void 0 : _c.scroll(pos, type, undefined, e[delta]);
            this.latestScrollUpdate(type);
        }
    }
    /**
     * On horizontal mousewheel event
     * @param type
     * @param delta
     * @param e
     */
    onHorizontalMouseWheel(type, delta, e) {
        var _a;
        // e.preventDefault(); // hijacks scroll from page
        const pos = this.horizontalScroll.scrollLeft + e[delta];
        (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(pos, type, undefined, e[delta]);
        this.latestScrollUpdate(type);
    }
    get horizontalScroll() { return this; }
    static get watchers() { return {
        "contentHeight": ["handleContentHeightChanged"]
    }; }
    static get style() { return HbrViewportScrollStyle0; }
}, [4, "hbr-viewport-scroll", {
        "contentWidth": [2, "content-width"],
        "contentHeight": [2, "content-height"],
        "tbSelf": [8, "tb-self"],
        "setScroll": [64],
        "changeScroll": [64]
    }, undefined, {
        "contentHeight": ["handleContentHeightChanged"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-viewport-scroll"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-viewport-scroll":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrViewportScroll);
            }
            break;
    } });
}

export { CONTENT_SLOT as C, DATA_SLOT as D, FOOTER_SLOT as F, HEADER_SLOT as H, HbrgrViewportScroll as a, defineCustomElement as d, getLastCell as g };

