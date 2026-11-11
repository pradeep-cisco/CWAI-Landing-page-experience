import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';

const truncationCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--line-clamp:1;--word-break:break-all}.truncation{text-align:start;overflow:hidden;white-space:normal;display:-webkit-box;line-clamp:var(--line-clamp);-webkit-box-orient:vertical;-webkit-line-clamp:var(--line-clamp);word-break:var(--word-break)}:host([data-truncated]){cursor:pointer}";
const HbrTruncationStyle0 = truncationCss;

const Truncation = /*@__PURE__*/ proxyCustomElement(class Truncation extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sheet = new CSSStyleSheet();
        this.truncated = false;
        this.getTooltipTarget = () => {
            var _a;
            if (typeof this.tooltipTarget === "string") {
                const root = this.host.getRootNode();
                const body = this.host.ownerDocument.body;
                const tooltip = (_a = (root === this.host.ownerDocument ? body : root)) === null || _a === void 0 ? void 0 : _a.querySelector(this.tooltipTarget);
                // A selector cannot cross a shadow boundary. Fall back to the owning
                // document to preserve support for tooltips outside the component's root.
                return (tooltip !== null && tooltip !== void 0 ? tooltip : (root !== this.host.ownerDocument
                    ? body === null || body === void 0 ? void 0 : body.querySelector(this.tooltipTarget)
                    : null));
            }
            if (this.tooltipTarget instanceof HTMLElement) {
                return this.tooltipTarget;
            }
        };
        this.handleHideTooltip = (event) => {
            var _a, _b;
            (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.setAttribute("data-truncation-hidden", "true");
            (_b = event.currentTarget) === null || _b === void 0 ? void 0 : _b.removeEventListener("hbr-popup-hide", this.handleHideTooltip);
        };
        this.getTextContent = (node) => {
            if (node instanceof HTMLSlotElement) {
                return node
                    .assignedNodes({ flatten: true })
                    .map(this.getTextContent)
                    .join("");
            }
            return node.textContent || "";
        };
        this.getTooltipContent = () => {
            var _a;
            const slot = (_a = this.ref) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            return slot
                ? slot.assignedNodes({ flatten: true }).map(this.getTextContent).join("")
                : this.host.textContent || "";
        };
        this.handleMouseEnter = () => {
            const tooltip = this.getTooltipTarget();
            if (!tooltip)
                return;
            if (tooltip.tagName !== "HBR-TOOLTIP") {
                console.warn("hbr-truncation: The tooltipTarget only supports hbr-tooltip");
            }
            this.clearTooltipSelection(tooltip);
            if (this.isTruncated()) {
                tooltip.addEventListener("hbr-popup-hide", this.handleHideTooltip);
                tooltip.onmousedown = (e) => {
                    e.stopPropagation();
                };
                tooltip.onmouseup = (e) => {
                    e.stopPropagation();
                };
                tooltip.anchor = this.host;
                tooltip.open = true;
                tooltip.content = this.getTooltipContent();
                tooltip.removeAttribute("data-truncation-hidden");
            }
            else {
                tooltip.anchor = undefined;
                tooltip.open = false;
                tooltip.content = "";
                tooltip.setAttribute("data-truncation-hidden", "true");
            }
        };
        this.isTruncated = () => {
            var _a, _b, _c, _d;
            this.truncated =
                this.host.scrollHeight > this.host.clientHeight ||
                    this.host.scrollWidth > this.host.clientWidth ||
                    ((_a = this.ref) === null || _a === void 0 ? void 0 : _a.scrollHeight) > ((_b = this.ref) === null || _b === void 0 ? void 0 : _b.clientHeight) ||
                    ((_c = this.ref) === null || _c === void 0 ? void 0 : _c.scrollWidth) > ((_d = this.ref) === null || _d === void 0 ? void 0 : _d.clientWidth);
            if (this.truncated) {
                this.host.setAttribute("data-truncated", "true");
            }
            else {
                this.host.removeAttribute("data-truncated");
            }
            return this.truncated;
        };
        this.nodeIsInTooltip = (node, tooltip) => {
            var _a;
            return (!!node &&
                (node === tooltip ||
                    tooltip.contains(node) ||
                    !!((_a = tooltip.shadowRoot) === null || _a === void 0 ? void 0 : _a.contains(node))));
        };
        this.selectionIsInTooltip = (selection, tooltip) => {
            return (!selection.isCollapsed &&
                (this.nodeIsInTooltip(selection.anchorNode, tooltip) ||
                    this.nodeIsInTooltip(selection.focusNode, tooltip)));
        };
        this.clearTooltipSelection = (tooltip) => {
            const selection = window.getSelection();
            if (selection && tooltip && this.selectionIsInTooltip(selection, tooltip)) {
                selection.removeAllRanges();
            }
        };
        this.handleMouseLeave = () => {
            const tooltip = this.getTooltipTarget();
            if (tooltip) {
                this.clearTooltipSelection(tooltip);
            }
        };
        this.lines = 1;
        this.tooltipTarget = undefined;
    }
    componentDidLoad() {
        this.isTruncated();
    }
    render() {
        const { lines } = this;
        if (this.host) {
            this.sheet.replaceSync(`
    		:host {
					--line-clamp: ${lines};
    		}
    	`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Host, { key: 'e130a845b7c664373d4da64d430ee1dae8a905c2', onMouseOver: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, h("span", { key: 'baa773977783b3fedd05f069df2ceece42363ed8', ref: (el) => {
                this.ref = el;
                this.isTruncated();
            }, class: {
                truncation: true,
                "truncation--multi": this.lines > 1,
            } }, h("slot", { key: '49894f54454f8a5a6371306bc1f528b6b9e56498', onSlotchange: this.isTruncated }))));
    }
    get host() { return this; }
    static get style() { return HbrTruncationStyle0; }
}, [1, "hbr-truncation", {
        "lines": [514],
        "tooltipTarget": [8, "tooltip-target"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-truncation"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-truncation":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Truncation);
            }
            break;
    } });
}

export { Truncation as T, defineCustomElement as d };

