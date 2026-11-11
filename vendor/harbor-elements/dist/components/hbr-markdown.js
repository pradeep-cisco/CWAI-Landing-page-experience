import { proxyCustomElement, HTMLElement, createEvent, forceUpdate, h, Host } from '@stencil/core/internal/client';

const markdownCss = "table{width:100%;border-spacing:0;color:inherit;background:var(--control-bg-default);border-radius:var(--hbr-border-radius-xl);border:var(--hbr-spacing-md) solid var(--control-bg-default)}table td{border-bottom:1px solid var(--base-border-default)}table tr:last-child td{border-bottom:none}table th{font-weight:var(--hbr-font-weight-bold);text-align:left;border-bottom:2px solid var(--control-border-default)}table td,table th{font-size:var(--hbr-font-size-sm);line-height:20px;padding:var(--hbr-spacing-xs);white-space:nowrap}table th p:first-child,table td p:first-child{margin-top:0}table th p:last-child,table td p:last-child{margin-bottom:0}table{max-width:100%;overflow-x:auto}table code{white-space:nowrap}th.table-name,th.table-event-detail{min-width:15ch}th.table-description{min-width:50ch !important;max-width:70ch}pre{color:var(--base-text-in-weak-default);background-color:var(--inverse-bg-weak-default);overflow-x:auto;font-weight:400;font-size:0.875em;line-height:1.71429;margin-top:1.71429em;margin-bottom:1.71429em;border-radius:0.375rem;padding:0.857143em 1.14286em}code{background-color:transparent;border-width:0px;border-radius:0px;padding:0px;font-weight:inherit;color:inherit;font-size:inherit;font-family:inherit;line-height:inherit}";
const HbrMarkdownStyle0 = markdownCss;

let markdownModulesPromise;
const loadMarkdownModules = async () => {
    if (!markdownModulesPromise) {
        markdownModulesPromise = Promise.all([
            import('./purify.js').then(function (n) { return n.p; }),
            import('./marked.umd.js').then(function (n) { return n.m; }),
        ]).then(([dompurifyModule, markedModule]) => ({
            DOMPurify: dompurifyModule.default,
            parse: markedModule.parse,
        }));
    }
    return markdownModulesPromise;
};
const HbrMarkdown$1 = /*@__PURE__*/ proxyCustomElement(class HbrMarkdown extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.didRender = createEvent(this, "hbr-markdown-did-render", 7);
        this.renderId = 0;
        this.pendingEmitId = 0;
        this.content = undefined;
        this.parsed = undefined;
        this.afterSanitizeAttributes = undefined;
        this.skipSanitize = false;
        this.markedOptions = {};
        this.renderedContent = null;
    }
    async componentWillLoad() {
        await this.updateRenderedContent();
    }
    componentDidRender() {
        if (this.pendingEmitId !== 0 && this.pendingEmitId === this.renderId) {
            this.pendingEmitId = 0;
            this.didRender.emit({ base: this.baseRef });
        }
    }
    async updateRenderedContent() {
        const currentRenderId = ++this.renderId;
        if (!this.content) {
            this.renderedContent = null;
            this.pendingEmitId = currentRenderId;
            forceUpdate(this);
            return;
        }
        const { DOMPurify, parse } = await loadMarkdownModules();
        if (currentRenderId !== this.renderId) {
            return;
        }
        const pendingHookWork = [];
        if (this.afterSanitizeAttributes) {
            DOMPurify.addHook("afterSanitizeAttributes", (node) => {
                // @ts-ignore
                const result = this.afterSanitizeAttributes(node);
                if (result && typeof result.then === "function") {
                    pendingHookWork.push(result);
                }
            });
        }
        try {
            const purifiedString = this.skipSanitize
                ? this.content
                : DOMPurify.sanitize(this.content);
            // Defensively await any async work the user-provided
            // afterSanitizeAttributes callback returned. DOMPurify hooks are
            // invoked synchronously and their return values are ignored, so
            // without this await an async callback's side effects could land
            // after didRender is emitted.
            if (pendingHookWork.length > 0) {
                await Promise.all(pendingHookWork);
                if (currentRenderId !== this.renderId) {
                    return;
                }
            }
            this.renderedContent = this.parsed
                ? purifiedString
                : parse(purifiedString, this.markedOptions);
            this.pendingEmitId = currentRenderId;
            forceUpdate(this);
        }
        finally {
            if (this.afterSanitizeAttributes) {
                DOMPurify.removeHook("afterSanitizeAttributes");
            }
        }
    }
    render() {
        return (h(Host, { key: 'b12050226b853394c584461a38024b09812a2e53' }, h("div", { key: '6e4e603b41838d9efec7f7e676cd19434e870c8b', ref: (ref) => {
                this.baseRef = ref;
            }, class: "prose", part: "base", innerHTML: this.renderedContent })));
    }
    static get watchers() { return {
        "afterSanitizeAttributes": ["updateRenderedContent"],
        "content": ["updateRenderedContent"],
        "markedOptions": ["updateRenderedContent"],
        "parsed": ["updateRenderedContent"],
        "skipSanitize": ["updateRenderedContent"]
    }; }
    static get style() { return HbrMarkdownStyle0; }
}, [1, "hbr-markdown", {
        "content": [1],
        "parsed": [516],
        "afterSanitizeAttributes": [16],
        "skipSanitize": [4, "skip-sanitize"],
        "markedOptions": [16],
        "renderedContent": [32]
    }, undefined, {
        "afterSanitizeAttributes": ["updateRenderedContent"],
        "content": ["updateRenderedContent"],
        "markedOptions": ["updateRenderedContent"],
        "parsed": ["updateRenderedContent"],
        "skipSanitize": ["updateRenderedContent"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-markdown"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-markdown":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrMarkdown$1);
            }
            break;
    } });
}

const HbrMarkdown = HbrMarkdown$1;
const defineCustomElement = defineCustomElement$1;

export { HbrMarkdown, defineCustomElement };

