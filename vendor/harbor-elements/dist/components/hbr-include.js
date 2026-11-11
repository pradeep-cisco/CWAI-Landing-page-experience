import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const includeFiles = new Map();
const requestInclude = async (src, mode = "cors") => {
    if (includeFiles.has(src)) {
        return includeFiles.get(src);
    }
    const request = fetch(src, { mode: mode }).then(async (response) => {
        return {
            ok: response.ok,
            status: response.status,
            html: await response.text(),
        };
    });
    includeFiles.set(src, request);
    return request;
};

const includeCss = ":host{display:block}";
const HbrIncludeStyle0 = includeCss;

const Include = /*@__PURE__*/ proxyCustomElement(class Include extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrLoad = createEvent(this, "hbr-load", 7);
        this.hbrError = createEvent(this, "hbr-error", 7);
        this.html = "";
        this.src = undefined;
        this.mode = "cors";
        this.allowScripts = false;
    }
    handleSrcChange() {
        this.loadSource();
    }
    componentWillLoad() {
        this.loadSource();
    }
    executeScript(script) {
        // Create a copy of the script and swap it out so the browser executes it
        const newScript = document.createElement("script");
        [...script.attributes].map((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
    }
    async loadSource() {
        try {
            if (this.prevSrc === this.src) {
                return;
            }
            if (!this.src) {
                this.host.innerHTML = "";
                return;
            }
            this.prevSrc = this.src;
            const src = this.src;
            const file = await requestInclude(src, this.mode);
            // If the src changed since the request started do nothing, otherwise we risk overwriting a subsequent response
            if (src !== this.src) {
                return;
            }
            if (!file.ok) {
                this.hbrError.emit({ status: file.status });
                return;
            }
            this.host.innerHTML = file.html;
            if (this.allowScripts) {
                [...this.host.querySelectorAll("script")].map((script) => this.executeScript(script));
            }
            this.hbrLoad.emit();
        }
        catch (_a) {
            this.hbrError.emit();
        }
    }
    render() {
        return h("slot", { key: '2c7a9eebcb32b95d5784f84bb4f1f9bb3b9b1b74' });
    }
    get host() { return this; }
    static get watchers() { return {
        "src": ["handleSrcChange"]
    }; }
    static get style() { return HbrIncludeStyle0; }
}, [1, "hbr-include", {
        "src": [1],
        "mode": [1],
        "allowScripts": [4, "allow-scripts"],
        "html": [32]
    }, undefined, {
        "src": ["handleSrcChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-include"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-include":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Include);
            }
            break;
    } });
}

const HbrInclude = Include;
const defineCustomElement = defineCustomElement$1;

export { HbrInclude, defineCustomElement };

