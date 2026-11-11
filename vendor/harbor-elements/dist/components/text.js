import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const textCss = "hbr-text{display:contents}hbr-text>*{margin:0}hbr-text:not(:has(*)){display:inline;margin:0}hbr-text:not(:has(*))[size=xl],hbr-text:has(*)[size=xl]>*{font-size:var(--hbr-font-size-xl);line-height:34px}hbr-text:not(:has(*))[size=lg],hbr-text:has(*)[size=lg]>*{font-size:var(--hbr-font-size-lg);line-height:24px}hbr-text:not(:has(*))[size=md],hbr-text:has(*)[size=md]>*{font-size:var(--hbr-font-size-md);line-height:22px}hbr-text:not(:has(*))[size=sm],hbr-text:has(*)[size=sm]>*{font-size:var(--hbr-font-size-sm);line-height:var(--hbr-font-line-height-dense)}hbr-text:not(:has(*))[size=xs],hbr-text:has(*)[size=xs]>*{font-size:var(--hbr-font-size-xs);line-height:18px}hbr-text:not(:has(*))[type=heading],hbr-text:has(*)[type=heading]>*{font-family:var(--hbr-font-heading);color:var(--base-text-strong-default)}hbr-text:not(:has(*))[type=primary],hbr-text:has(*)[type=primary]>*{font-family:var(--hbr-font-body);color:var(--base-text-default)}hbr-text:not(:has(*))[type=secondary],hbr-text:has(*)[type=secondary]>*{font-family:var(--hbr-font-body);color:var(--base-text-medium-default)}hbr-text:not(:has(*))[type=placeholder],hbr-text:has(*)[type=placeholder]>*{font-family:var(--hbr-font-body);color:var(--base-text-weak-default)}hbr-text:not(:has(*))[type=mono],hbr-text:has(*)[type=mono]>*{font-family:var(--hbr-font-family-mono);color:var(--base-text-default)}hbr-text:not(:has(*))[type=number],hbr-text:has(*)[type=number]>*{font-family:var(--hbr-font-heading);color:var(--base-text-strong-default)}hbr-text:not(:has(*))[weight=normal],hbr-text:has(*)[weight=normal]>*{font-weight:var(--hbr-font-weight-normal)}hbr-text:not(:has(*))[weight=semibold],hbr-text:has(*)[weight=semibold]>*{font-weight:var(--hbr-font-weight-semibold)}hbr-text:not(:has(*))[weight=bold],hbr-text:has(*)[weight=bold]>*{font-weight:var(--hbr-font-weight-bold)}hbr-text:not(:has(*))[type=number][size=xl],hbr-text:has(*)[type=number][size=xl]>*{font-size:60px;line-height:72px}hbr-text:not(:has(*))[type=number][size=lg],hbr-text:has(*)[type=number][size=lg]>*{font-size:48px;line-height:60px}hbr-text:not(:has(*))[type=number][size=md],hbr-text:has(*)[type=number][size=md]>*{font-size:40px;line-height:52px}hbr-text:not(:has(*))[type=number][size=sm],hbr-text:has(*)[type=number][size=sm]>*{font-size:32px;line-height:43px}hbr-text:not(:has(*))[type=number][size=xs],hbr-text:has(*)[type=number][size=xs]>*{font-size:24px;line-height:34px}hbr-text:not(:has(*))[truncate=end],hbr-text:has(*)[truncate=end]>*{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}hbr-text:not(:has(*))[truncate=start],hbr-text:has(*)[truncate=start]>*{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:rtl;text-align:left}hbr-text:not(:has(*))[truncate=multiline],hbr-text:has(*)[truncate=multiline]>*{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:var(--_lines, 2);line-clamp:var(--_lines, 2)}hbr-text[length=sm]{display:block;max-width:520px}hbr-text[length=md]{display:block;max-width:600px}hbr-text[length=lg]{display:block;max-width:720px}";
const HbrTextStyle0 = textCss;

/**
 * Semantic typography primitive for consistent text styling.
 *
 * **Usage modes:**
 * 1. Wrap semantic HTML: `<hbr-text variant="page-title"><h1>Title</h1></hbr-text>`
 * 2. Text-only (auto-adds ARIA): `<hbr-text variant="page-title">Title</hbr-text>`
 *
 * **Type determines font family and color:**
 * - heading: heading font, strong color
 * - primary: body font, default color
 * - secondary: body font, medium color
 * - placeholder: body font, weak color
 * - mono: monospace font, default color
 * - number: heading font, strong color (for display numbers)
 */
// Variant definitions - maps semantic names to primitive values
// Based on design system "Heading" typography specs
const VARIANT_PROPS = {
    "page-title": { type: "heading", size: "xl", weight: "bold", ariaLevel: 1 },
    "modal-title": { type: "heading", size: "xl", weight: "bold", ariaLevel: 1 },
    "drawer-title": { type: "heading", size: "xl", weight: "bold", ariaLevel: 2 },
    "section-title": {
        type: "heading",
        size: "lg",
        weight: "bold",
        ariaLevel: 2,
    },
    "sub-section-title": {
        type: "heading",
        size: "md",
        weight: "bold",
        ariaLevel: 3,
    },
    "smallest-title": {
        type: "heading",
        size: "sm",
        weight: "bold",
        ariaLevel: 4,
    },
};
// Map heading sizes to aria-level (for text-only heading mode)
const SIZE_TO_ARIA_LEVEL = {
    xl: 1,
    lg: 2,
    md: 3,
    sm: 4,
    xs: 5,
};
const Text = /*@__PURE__*/ proxyCustomElement(class Text extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.variant = undefined;
        this.type = undefined;
        this.size = undefined;
        this.weight = undefined;
        this.truncate = undefined;
        this.lines = 2;
        this.length = undefined;
    }
    hasChildElements() {
        return Array.from(this.el.childNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);
    }
    componentWillRender() {
        const variantProps = this.variant ? VARIANT_PROPS[this.variant] : null;
        // Priority: explicit prop > variant default > component default
        const finalType = this.type || (variantProps === null || variantProps === void 0 ? void 0 : variantProps.type) || "primary";
        const finalSize = this.size || (variantProps === null || variantProps === void 0 ? void 0 : variantProps.size) || "md";
        const finalWeight = this.weight || (variantProps === null || variantProps === void 0 ? void 0 : variantProps.weight) || "normal";
        // Set CSS variable for multiline truncation via JS (doesn't interfere with user styles)
        if (this.truncate === "multiline") {
            this.el.style.setProperty("--_lines", this.lines.toString());
        }
        else {
            this.el.style.removeProperty("--_lines");
        }
        // Determine mode: text-only vs with child elements
        const textOnly = !this.hasChildElements();
        // Set core attributes
        this.el.setAttribute("type", finalType);
        this.el.setAttribute("size", finalSize);
        this.el.setAttribute("weight", finalWeight);
        // Set optional attributes
        if (this.truncate) {
            this.el.setAttribute("truncate", this.truncate);
        }
        else {
            this.el.removeAttribute("truncate");
        }
        if (this.length) {
            this.el.setAttribute("length", this.length);
        }
        else {
            this.el.removeAttribute("length");
        }
        // Set accessibility attributes for text-only headings
        if (textOnly && finalType === "heading") {
            const ariaLevel = (variantProps === null || variantProps === void 0 ? void 0 : variantProps.ariaLevel) ||
                SIZE_TO_ARIA_LEVEL[finalSize];
            this.el.setAttribute("role", "heading");
            this.el.setAttribute("aria-level", ariaLevel.toString());
        }
        else {
            this.el.removeAttribute("role");
            this.el.removeAttribute("aria-level");
        }
    }
    render() {
        return h(Host, { key: '853ec71f5d74dfaeb6481f22b940c12dcd04511c' });
    }
    get el() { return this; }
    static get style() { return HbrTextStyle0; }
}, [0, "hbr-text", {
        "variant": [513],
        "type": [1],
        "size": [1],
        "weight": [1],
        "truncate": [1],
        "lines": [2],
        "length": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-text"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-text":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Text);
            }
            break;
    } });
}

export { Text as T, defineCustomElement as d };

