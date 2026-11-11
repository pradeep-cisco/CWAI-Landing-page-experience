import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

const listCss = ":host{display:block}:host([variant=outline]){--border:var(--hbr-border, var(--hbr-border-width, 2px) solid var(--control-border-default));--border-radius:var(--hbr-border-radius-md, 6px);--box-shadow:var(--hbr-shadow-xs, 0 2px 5px rgb(0 0 0 / 5%));--bg-color:var(--control-bg-weak-default)}:host([variant=outline]:not([anchor])) .list{padding-block:var(--hbr-spacing-2xs, 4px)}:host([variant=outline][anchor]){--padding:6px}:host(:not([variant=list]):not([variant=interactive]):not([anchor])) ::slotted(*){--padding:8px 12px}:host([anchor]){--position:relative;--indent-guide-color:transparent;--indent-size:16px;--link-interact-color:var(--interact-text-default);--line-position:absolute;--line-width:3px;--line-top:6px;--line-bottom:6px;--line-background:var(--control-border-weak-default)}:host([variant=list][size=xlarge]),:host([variant=interactive][size=xlarge]),:host([variant=list][size=xl]),:host([variant=interactive][size=xl]){font-size:var(--hbr-font-size-lg, 18px)}:host([variant=list][size=large]),:host([variant=interactive][size=large]),:host([variant=list][size=lg]),:host([variant=interactive][size=lg]){font-size:var(--hbr-font-size-md, 16px)}:host([variant=list][size=medium]),:host([variant=interactive][size=medium]),:host([variant=list][size=md]),:host([variant=interactive][size=md]){font-size:var(--hbr-font-size-sm, 14px)}:host([variant=list][size=small]),:host([variant=interactive][size=small]),:host([variant=list][size=sm]),:host([variant=interactive][size=sm]){font-size:var(--hbr-font-size-xs, 12px)}:host(:not([variant=list],[variant=interactive])){font-size:0}:host([variant=list],[variant=interactive]){font-size:var(--hbr-font-size-sm, 14px)}.list{padding-inline:var(--padding-inline);padding:var(--padding);list-style-type:var(--list-style-type);margin:var(--margin);border:var(--border);border-radius:var(--border-radius);box-shadow:var(--box-shadow);background-color:var(--bg-color);width:var(--width);position:var(--position)}.list__line{position:var(--line-position);width:var(--line-width);top:var(--line-top);bottom:var(--line-bottom);background:var(--line-background);border-radius:var(--line-border-radius)}";
const HbrListStyle0 = listCss;

const HbrList$1 = /*@__PURE__*/ proxyCustomElement(class HbrList extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.variant = undefined;
        this.size = "medium";
        this.ordered = undefined;
        this.arialabel = undefined;
        this.anchor = undefined;
        this.nested = undefined;
        this.spacing = "compact";
    }
    handleClick(event) {
        const target = event.target;
        const listItem = target.closest("hbr-list-item");
        if (!listItem) {
            return;
        }
        //
        // Don't Do anything if there's no list item, if it's disabled, or if the click doesn't match the initial target
        // from mousedown. The latter case prevents the user from starting a click on one item and ending it on another,
        // causing the parent node to collapse.
        //
        if (!listItem || listItem.disabled || target !== this.clickTarget) {
            return;
        }
        this.hbrClick.emit();
    }
    handleMouseDown(event) {
        // Record the click target so we know which item the click initially targeted
        this.clickTarget = event.target;
    }
    handleKeyDown(event) {
        // Ignore key presses we aren't interested in
        if (![
            "ArrowDown",
            "ArrowUp",
            "ArrowRight",
            "ArrowLeft",
            "Home",
            "End",
            "Enter",
            " ",
        ].includes(event.key)) {
            return;
        }
        // Ignore key presses when focus is inside a text field. This prevents the component from hijacking nested form
        // controls that exist inside tree items.
        // if (
        // 	event
        // 		.composedPath()
        // 		.some((el: HTMLElement) =>
        // 			["input", "textarea"].includes(el?.tagName?.toLowerCase()),
        // 		)
        // ) {
        // 	return;
        // }
    }
    render() {
        if (this.variant === "list") {
            return (h(Host, null, h("slot", null)));
        }
        const Tag = this.ordered ? "ol" : "ul";
        return (
        // due to the wrapper blocking for SR to read <li> be child of <ul>, we need to add the role to the host
        h(Host, { role: "list" }, h(Tag, Object.assign({ part: "base", role: "presentation", class: {
                list: true,
                "list--outline": this.variant === "outline",
                "list--ordered": this.ordered,
                "list--anchor": this.anchor,
            } }, (this.arialabel ? { "aria-label": this.arialabel } : {}), { onClick: this.handleClick.bind(this), onMouseDown: this.handleMouseDown.bind(this), onKeyDown: this.handleKeyDown.bind(this) }), h("div", { class: "list__line", part: "line" }), h("slot", null))));
    }
    get host() { return this; }
    static get style() { return HbrListStyle0; }
}, [1, "hbr-list", {
        "variant": [1537],
        "size": [513],
        "ordered": [516],
        "arialabel": [1],
        "anchor": [516],
        "nested": [516],
        "spacing": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-list"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-list":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrList$1);
            }
            break;
    } });
}

const HbrList = HbrList$1;
const defineCustomElement = defineCustomElement$1;

export { HbrList, defineCustomElement };

