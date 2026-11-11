import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';

const highlightCss = ":host{display:block;--color:currentColor;--bg:transparent;--font-weight:bold;--text-decoration-color:currentColor;--text-decoration-thickness:1px;--text-underline-offset:1px}.highlight--highlighted-text{font-weight:bold}.highlight--underline .highlight--highlighted-text{text-decoration:underline}";
const HbrHighlightStyle0 = highlightCss;

const HbrHighlight = /*@__PURE__*/ proxyCustomElement(class HbrHighlight extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.sheet = new CSSStyleSheet();
        this.highlightName = `hbr-highlight-${++HbrHighlight.instanceCounter}`;
        this.textNode = null;
        this.text = "";
        this.queryText = "";
        this.caseSensitive = false;
        this.continuous = true;
        this.variant = undefined;
        this.slotText = "";
    }
    /** Returns an original text. */
    async getText() {
        return this.text;
    }
    escapeRegExp(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    getHighlightRegistry() {
        if (typeof CSS === "undefined")
            return undefined;
        return CSS.highlights;
    }
    getHighlightConstructor() {
        if (typeof window === "undefined")
            return undefined;
        return window.Highlight;
    }
    isSupported() {
        return (typeof this.getHighlightRegistry() !== "undefined" &&
            typeof this.getHighlightConstructor() !== "undefined" &&
            typeof Range !== "undefined");
    }
    legacyHighlight() {
        var _a, _b;
        let content = [this.text];
        let keywords;
        if (((_a = this.queryText) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = this.text) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const escapedQueryText = this.escapeRegExp(this.queryText);
            if (this.continuous) {
                keywords = [
                    this.caseSensitive
                        ? escapedQueryText
                        : escapedQueryText.toLowerCase(),
                ];
            }
            else {
                const keywordsString = this.caseSensitive
                    ? this.queryText.trim()
                    : this.queryText.trim().toLowerCase();
                keywords = keywordsString
                    .split(/\s+/)
                    .map((word) => this.escapeRegExp(word)); // Escaping special characters
            }
            const pattern = new RegExp(`(${keywords.join("|")})`, "g");
            let match = pattern.exec(this.caseSensitive ? this.text : this.text.toLowerCase());
            const indices = [];
            while (match !== null) {
                indices.push([match.index, match[0].length]);
                match = pattern.exec(this.caseSensitive ? this.text : this.text.toLowerCase());
            }
            if (indices.length > 0) {
                let prevIdx = 0;
                let texts = [];
                indices.forEach((value, _) => {
                    const [valIdx, valLength] = value;
                    texts = [
                        ...texts,
                        [this.text.substring(prevIdx, valIdx), "normal"],
                        [this.text.substring(valIdx, valIdx + valLength), "highlight"],
                    ];
                    prevIdx = valIdx + valLength;
                });
                texts = [
                    ...texts,
                    [this.text.substring(prevIdx, this.text.length), "normal"],
                ];
                content = texts.map((v) => {
                    if (!v[0])
                        return;
                    if (v[1] !== "highlight") {
                        return h("span", null, v[0]);
                    }
                    return (h("span", { "data-testid": "highlighted-text", class: "highlight--highlighted-text", part: "highlight" }, v[0]));
                });
            }
        }
        return content;
    }
    computeMatchIndices() {
        var _a, _b;
        if (!(((_a = this.queryText) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = this.slotText) === null || _b === void 0 ? void 0 : _b.length) > 0))
            return [];
        const escapedQueryText = this.escapeRegExp(this.queryText);
        let keywords;
        if (this.continuous) {
            keywords = [
                this.caseSensitive ? escapedQueryText : escapedQueryText.toLowerCase(),
            ];
        }
        else {
            const keywordsString = this.caseSensitive
                ? this.queryText.trim()
                : this.queryText.trim().toLowerCase();
            keywords = keywordsString
                .split(/\s+/)
                .map((word) => this.escapeRegExp(word));
        }
        const pattern = new RegExp(`(${keywords.join("|")})`, "g");
        const haystack = this.caseSensitive
            ? this.slotText
            : this.slotText.toLowerCase();
        const indices = [];
        let match = pattern.exec(haystack);
        while (match !== null) {
            indices.push([match.index, match[0].length]);
            match = pattern.exec(haystack);
        }
        return indices;
    }
    clearHighlight() {
        var _a;
        (_a = this.getHighlightRegistry()) === null || _a === void 0 ? void 0 : _a.delete(this.highlightName);
    }
    syncSlotText() {
        var _a, _b, _c;
        if (this.text)
            return;
        const assigned = (_b = (_a = this.slotElement) === null || _a === void 0 ? void 0 : _a.assignedNodes({ flatten: true })) !== null && _b !== void 0 ? _b : [];
        const textNode = (_c = assigned.find((node) => node.nodeType === Node.TEXT_NODE)) !== null && _c !== void 0 ? _c : null;
        const nextSlotText = (textNode === null || textNode === void 0 ? void 0 : textNode.data) || "";
        if (this.slotText !== nextSlotText) {
            this.slotText = nextSlotText;
        }
    }
    applyHighlight() {
        const textNode = this.textNode;
        if (this.text || !this.isSupported() || !textNode) {
            this.clearHighlight();
            return;
        }
        this.clearHighlight();
        const indices = this.computeMatchIndices();
        if (indices.length === 0)
            return;
        const HighlightCtor = this.getHighlightConstructor();
        const highlights = this.getHighlightRegistry();
        if (!HighlightCtor || !highlights)
            return;
        const ranges = indices.map(([start, length]) => {
            const range = new Range();
            range.setStart(textNode, start);
            range.setEnd(textNode, start + length);
            return range;
        });
        highlights.set(this.highlightName, new HighlightCtor(...ranges));
    }
    componentDidLoad() {
        this.syncSlotText();
        this.applyHighlight();
    }
    componentDidUpdate() {
        this.applyHighlight();
    }
    disconnectedCallback() {
        this.clearHighlight();
    }
    onInputsChanged() {
        this.applyHighlight();
    }
    render() {
        if (this.host && !this.text) {
            const underlineRule = this.variant === "underline" ? "text-decoration-line: underline;" : "";
            const rule = `
				 :host {
						::highlight(${this.highlightName}){
              color: var(--color);
              background: var(--bg);
              font-weight: var(--font-weight);
              text-decoration-color: var(--text-decoration-color);
              text-decoration-thickness: var(--text-decoration-thickness);
              text-underline-offset: var(--text-underline-offset);
              ${underlineRule}
            }
				 }
			 `;
            this.sheet.replaceSync(rule);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        let content = null;
        if (this.text) {
            content = this.legacyHighlight();
        }
        return (h(Host, { key: 'aa01bd9fdc5c7c5fa6b68466da47fa006cf23107', "data-name": this.highlightName }, !this.text && (h("span", { style: { display: "none" }, "aria-hidden": "true" }, h("slot", { ref: (el) => {
                this.slotElement = el;
            }, onSlotchange: () => {
                this.syncSlotText();
            } }))), h("span", { key: '67d4ffc0d45f9af32730ab8488600c72c457a038', "data-testid": "text", class: {
                highlight: true,
                "highlight--underline": this.variant === "underline",
            }, part: "base", ref: (el) => {
                var _a;
                if (this.text)
                    return;
                if (!el) {
                    this.textNode = null;
                    return;
                }
                if (el.childNodes.length === 1 &&
                    ((_a = el.firstChild) === null || _a === void 0 ? void 0 : _a.nodeType) === Node.TEXT_NODE) {
                    el.firstChild.data = this.slotText;
                }
                else {
                    el.textContent = this.slotText;
                }
                this.textNode = el.firstChild;
            } }, this.text ? content : this.slotText)));
    }
    get host() { return this; }
    static get watchers() { return {
        "text": ["onInputsChanged"],
        "queryText": ["onInputsChanged"],
        "caseSensitive": ["onInputsChanged"],
        "continuous": ["onInputsChanged"]
    }; }
    static get style() { return HbrHighlightStyle0; }
}, [1, "hbr-highlight", {
        "text": [1],
        "queryText": [1, "query-text"],
        "caseSensitive": [4, "case-sensitive"],
        "continuous": [4],
        "variant": [513],
        "slotText": [32],
        "getText": [64]
    }, undefined, {
        "text": ["onInputsChanged"],
        "queryText": ["onInputsChanged"],
        "caseSensitive": ["onInputsChanged"],
        "continuous": ["onInputsChanged"]
    }]);
HbrHighlight.instanceCounter = 0;
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-highlight"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-highlight":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrHighlight);
            }
            break;
    } });
}

export { HbrHighlight as H, defineCustomElement as d };

