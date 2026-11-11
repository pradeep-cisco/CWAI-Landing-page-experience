import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';

const codeSnippetCss = ":host{--border-radius:var(--hbr-border-radius-md, 6px);--font-family:var(--hbr-font-family-mono, Roboto Mono);border-radius:var(--border-radius);--border:1px solid var(--base-border-default);color:var(--base-text-default);--bg:var(--base-bg-medium-default);--line-number-bg:var(--base-bg-disabled);--tools-gap:16px}:host([size=small]){--font-size:12px;--line-height:18px;--height:18px;--padding:12px;--icon-size:14px;--button-height:16px;--tools-gap:12px;--tools-padding:8px 12px}:host([size=medium]){--font-size:14px;--line-height:20px;--height:20px;--padding:16px;--icon-size:16px;--button-height:20px;--tools-padding:12px 16px}:host([size=auto]){--font-size:inherit;--line-height:inherit;--height:inherit;--padding:16px;--icon-size:inherit}:host([inline]){--border-radius:4px;display:inline}:host(:not([inline])){width:100%;display:flex}:host([syntax]){--bg:var(--base-bg-weak-default)}.code-snippet{display:flex;flex-direction:column;width:100%;border-radius:var(--border-radius)}.code-snippet.code-snippet--tools,.code-snippet.code-snippet--syntax{border:var(--border)}.code-snippet.code-snippet--tools .code-snippet__tools{display:flex}.code-snippet .code-snippet__tools{display:none;flex-direction:row;padding:var(--tools-padding);background:var(--base-bg-weak-default);border-bottom:var(--border);gap:var(--tools-gap);border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius)}.code-snippet:not(.code-snippet--tools) .code-snippet__content{border-top-left-radius:calc(var(--border-radius) - 1px);border-top-right-radius:calc(var(--border-radius) - 1px)}.code-snippet .code-snippet__content{font-family:var(--font-family);font-size:var(--font-size);line-height:var(--line-height);overflow:hidden;border-bottom-left-radius:calc(var(--border-radius) - 1px);border-bottom-right-radius:calc(var(--border-radius) - 1px)}.code-snippet pre{margin:0px;background:var(--bg)}.code-snippet pre code{font-family:var(--font-family);display:flex;flex-direction:column}.code-snippet .line{display:inline-flex;width:100%;white-space:pre-wrap}.code-snippet .line:first-child .line-number,.code-snippet .line:first-child .line-content{padding-top:var(--padding)}.code-snippet .line:last-child .line-number,.code-snippet .line:last-child .line-content{padding-bottom:var(--padding)}.code-snippet .line-number{font-family:var(--font-family);user-select:none;display:block;flex-shrink:0;min-width:calc(var(--line-min-width) * 1ch);padding:0px var(--padding);text-align:right;color:var(--base-text-medium-default);background:var(--line-number-bg)}.code-snippet .line-content{font-family:var(--font-family);word-wrap:break-word;word-break:break-all;position:relative;color:var(--base-text-default);padding:0px var(--padding);max-width:calc(var(--hbr-code-snippet-max-characters) * 1ch)}.code-snippet--inline{font-family:var(--font-family);border-radius:var(--border-radius);background:var(--base-bg-disabled);font-size:var(--font-size);font-weight:var(--hbr-font-weight-normal, 400);padding:0 var(--hbr-spacing-xs, 8px);display:inline}.code-snippet--inline code{height:var(--height)}.code-snippet--inline.code-snippet--inline-medium{line-height:var(--line-height)}::slotted([slot=suffix]){margin-left:var(--hbr-spacing-xs, 8px)}";
const HbrCodeSnippetStyle0 = codeSnippetCss;

const CodeSnippet = /*@__PURE__*/ proxyCustomElement(class CodeSnippet extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.code = "";
        this.lineNumber = false;
        this.inline = false;
        this.maxCharacters = 120;
        this.syntax = false;
        this.size = "medium";
        this.hasTools = false;
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.copy = this.copy.bind(this);
    }
    handleSlotChange() {
        this.hasTools = hasSlot(this.host, "tools");
    }
    convertToHtml() {
        const lineNumberWidth = this.code.split("\n").length.toString().length;
        return this.code.split("\n").map((line, idx) => {
            const maxCharacters = this.maxCharacters.toString();
            return (h("span", { part: "line", class: "line", style: { "--line-min-width": lineNumberWidth.toString() } }, this.lineNumber ? h("span", { part: "line-number", class: "line-number" }, idx + 1) : null, h("span", { part: "line-content", class: "line-content", style: { "--hbr-code-snippet-max-characters": maxCharacters } }, line || h("br", null))));
        });
    }
    async copy(data) {
        try {
            await navigator.clipboard.writeText(data);
            return true;
        }
        catch (error) {
            console.error(error);
        }
    }
    async export(data, filename) {
        try {
            const blob = new Blob([data], { type: "plain/text" });
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error(error);
        }
    }
    render() {
        const code = this.code ? this.convertToHtml() : null;
        return (h(Host, { key: '3aca5922e217801e35417b29a1db825d53ee5d64' }, this.inline ? (h("code", { part: "inline", class: {
                "code-snippet--inline": true,
                "code-snippet--inline-small": this.size === "small",
                "code-snippet--inline-medium": this.size === "medium",
            } }, h("slot", null, this.code), h("slot", { name: "suffix" }))) : (h("div", { part: "base", class: {
                "code-snippet": true,
                "code-snippet--tools": this.hasTools,
                "code-snippet--syntax": this.syntax,
                "code-snippet--small": this.size === "small",
                "code-snippet--medium": this.size === "medium",
            } }, h("div", { part: "tools", class: {
                "code-snippet__tools": true,
            } }, h("slot", { name: "tools", onSlotchange: this.handleSlotChange })), h("span", { part: "content", class: "code-snippet__content" }, h("slot", null, h("pre", { part: "pre" }, h("code", { part: "code" }, code))))))));
    }
    get host() { return this; }
    static get style() { return HbrCodeSnippetStyle0; }
}, [1, "hbr-code-snippet", {
        "code": [1],
        "lineNumber": [516, "line-number"],
        "inline": [516],
        "maxCharacters": [514, "max-characters"],
        "syntax": [516],
        "size": [513],
        "hasTools": [32],
        "copy": [64],
        "export": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-code-snippet"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-code-snippet":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, CodeSnippet);
            }
            break;
    } });
}

const HbrCodeSnippet = CodeSnippet;
const defineCustomElement = defineCustomElement$1;

export { HbrCodeSnippet, defineCustomElement };

