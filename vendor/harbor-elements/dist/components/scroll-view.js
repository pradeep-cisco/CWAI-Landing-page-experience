import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

// The Updater class is used to manage scrollable elements and their visual updates.
class Updater {
    // The constructor initializes the callback, ResizeObserver, and MutationObserver
    constructor() {
        // The callback function calls the update method with the target element
        this.cb = () => this.update();
        // The ResizeObserver is initialized with the callback function
        this.rO = new ResizeObserver(this.cb);
        // The MutationObserver is initialized to call the on method with the current element
        this.mO = new MutationObserver(() => this.on(this.el));
    }
    // The on method is used to start observing a new element
    on(element) {
        var _a, _b;
        // If there is a current element, stop observing it
        if (this.el) {
            this.el.removeEventListener("scroll", this.cb);
            this.rO.disconnect();
            this.mO.disconnect();
        }
        // If no new element is provided, return
        if (!element)
            return;
        // containers
        const validContainers = ["hbr-drawer", "hbr-modal", "hbr-stepper"];
        for (let i = 0; i < validContainers.length; i++) {
            const tag = validContainers[i];
            const shadowHost = (_a = element.getRootNode()) === null || _a === void 0 ? void 0 : _a.host;
            if (((_b = shadowHost === null || shadowHost === void 0 ? void 0 : shadowHost.tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === tag) {
                this.container = shadowHost;
                break;
            }
            if (element.closest) {
                const closestContainer = element.closest(tag);
                if (closestContainer) {
                    this.container = closestContainer;
                    break;
                }
            }
        }
        // If the new element is a table without scrollable overflow, observe the table and set the element to its first tbody
        if (element.nodeName === "TABLE" &&
            !/scroll|auto/.test(getComputedStyle(element).getPropertyValue("overflow"))) {
            this.rO.observe(element);
            element = element.tBodies[0];
        }
        // Add a scroll event listener to the element
        element.addEventListener("scroll", this.cb);
        // Observe the element and its children for size changes
        [element, ...element.children].forEach((el) => this.rO.observe(el));
        // Observe the element for changes in its child list
        this.mO.observe(element, { childList: true });
        // Set the current element to the new element
        this.el = element;
    }
    // The off method is used to stop observing the current element
    off() {
        this.on();
    }
    // The update method is used to update the visual state of the target element
    update() {
        let offset = {
            top: Math.floor(this.el.scrollTop),
            bottom: Math.floor(this.el.scrollHeight - this.el.offsetHeight - this.el.scrollTop),
            left: Math.floor(this.el.scrollLeft),
            right: Math.floor(this.el.scrollWidth - this.el.offsetWidth - this.el.scrollLeft),
        };
        // If the current element is a tbody, add its position relative to its parent table to the cssText
        if (this.el.nodeName === "TBODY") {
            const clientRect = this.el.getBoundingClientRect();
            const rootClientRect = (this.el.parentElement).getBoundingClientRect();
            offset = {
                top: Math.floor(clientRect.top - rootClientRect.top),
                bottom: Math.floor(rootClientRect.bottom - clientRect.bottom),
                left: Math.floor(clientRect.left - rootClientRect.left),
                right: Math.floor(rootClientRect.right - clientRect.right),
            };
        }
        const scrollClassNames = {
            top: "hbr-css__scroll-view-offset-top",
            bottom: "hbr-css__scroll-view-offset-bottom",
            bottomNone: "hbr-css__scroll-view-offset-bottom-none",
            left: "hbr-css__scroll-view-offset-left",
            right: "hbr-css__scroll-view-offset-right",
        };
        // const cssText = `
        // 	top: ${offset.top}px;
        // 	bottom: ${offset.bottom}px;
        // 	left: ${offset.left}px;
        // 	right: ${offset.right}px;
        // `
        const offsetClasslist = [];
        if (offset.top > 0)
            offsetClasslist.push(scrollClassNames.top);
        if (offset.bottom > 0) {
            offsetClasslist.push(scrollClassNames.bottom);
        }
        else {
            offsetClasslist.push(scrollClassNames.bottomNone);
        }
        if (offset.left > 0)
            offsetClasslist.push(scrollClassNames.left);
        if (offset.right > 0)
            offsetClasslist.push(scrollClassNames.right);
        // Apply the new CSS to the target element on the next animation frame
        requestAnimationFrame(() => {
            this.el.classList.remove(...Object.values(scrollClassNames));
            if (this.container) {
                this.container.classList.remove(...Object.values(scrollClassNames));
            }
            if (offsetClasslist.length) {
                this.el.classList.add(...offsetClasslist);
                if (this.container) {
                    this.container.classList.add(...offsetClasslist);
                }
            }
        });
    }
}

const scrollViewCss = ":host{display:inline-block;position:relative}:host([hidden]){display:none}.base{width:100%;height:100%}s{position:absolute;top:0;bottom:0;left:0;right:0;pointer-events:none;--m:var(--scroll-shadow-size, 14) * 1px;background-repeat:no-repeat}";
const HbrScrollViewStyle0 = scrollViewCss;

const HbrScrollView = /*@__PURE__*/ proxyCustomElement(class HbrScrollView extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.anchor = null;
    }
    slotChangeHandler() {
        this.initializeUpdater();
    }
    componentDidLoad() {
        this.initializeUpdater();
    }
    disconnectedCallback() {
        if (this.updater) {
            this.updater.off();
        }
    }
    initializeUpdater() {
        var _a;
        const anchorEl = this.anchor && this.el.parentElement
            ? this.el.parentElement.querySelector(this.anchor)
            : (_a = this.el) === null || _a === void 0 ? void 0 : _a.children[0];
        if (!anchorEl) {
            console.warn("Scroll view cannot find an anchor to observe scroll.");
            return;
        }
        this.updater = new Updater();
        this.updater.on(anchorEl);
    }
    render() {
        return (h(Host, { key: '28991f5c502f282fa26e185bf9f6063e5d7e4873' }, h("div", { key: '43bc2e5e2ee4c0b3c95af0780c3a9eb0766b5697', class: "base", part: "base" }, h("slot", { key: 'af77ba7735bed51d975bad7fae95180e6c2e6ed3' }))));
    }
    get el() { return this; }
    static get style() { return HbrScrollViewStyle0; }
}, [1, "hbr-scroll-view", {
        "anchor": [1]
    }, [[0, "slotchange", "slotChangeHandler"]]]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-scroll-view"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-scroll-view":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrScrollView);
            }
            break;
    } });
}

export { HbrScrollView as H, defineCustomElement as d };

