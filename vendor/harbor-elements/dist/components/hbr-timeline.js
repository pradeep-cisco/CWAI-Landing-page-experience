import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const activityTimelineCss = ":host{display:block;line-height:0}ul{list-style:none;margin:0;padding:0;background-color:transparent;width:100%;overflow:hidden;width:100%}";
const HbrTimelineStyle0 = activityTimelineCss;

const Timeline = /*@__PURE__*/ proxyCustomElement(class Timeline extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    componentDidLoad() {
        var _a;
        const ulElements = this.host.shadowRoot
            ? this.host.shadowRoot.querySelector("ul")
            : null;
        if (ulElements === null || ulElements === void 0 ? void 0 : ulElements.children) {
            // Use type assertion to treat the first child as HTMLSlotElement
            const firstChild = ulElements.children[0];
            const assignedNodes = firstChild.assignedNodes();
            const arrayLength = assignedNodes.length;
            if (arrayLength > 0) {
                // Ensure the last node is treated as an HTMLElement to use setAttribute
                const lastNode = assignedNodes[arrayLength - 1];
                (_a = lastNode === null || lastNode === void 0 ? void 0 : lastNode.setAttribute) === null || _a === void 0 ? void 0 : _a.call(lastNode, "last", "true");
            }
        }
    }
    render() {
        return (h("ul", { key: '319c36aee967f5e9b647f1079308ebdc1f6dd10c', class: "dnx-activity-timeline-accordion-list" }, h("slot", { key: '83143963032d1b263ac437c6fe438a05696ba5c2' })));
    }
    get host() { return this; }
    static get style() { return HbrTimelineStyle0; }
}, [1, "hbr-timeline"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-timeline"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-timeline":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Timeline);
            }
            break;
    } });
}

const HbrTimeline = Timeline;
const defineCustomElement = defineCustomElement$1;

export { HbrTimeline, defineCustomElement };

