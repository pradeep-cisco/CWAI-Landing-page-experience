import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const version = "2.19.6";

const Context = /*@__PURE__*/ proxyCustomElement(class Context extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.pack = Number(version.slice(version.lastIndexOf(".") + 1)) || 0;
        this.version = undefined;
    }
    /** Method to manually set the asset base path where assets can be found */
    async setAssetPath(path) {
        setAssetPath(path);
        return Promise.resolve();
    }
    componentWillLoad() {
        if (typeof window === "undefined") {
            return;
        }
        const harborSide = window.location.hostname.includes("localhost") ||
            window.location.hostname.includes("harbor");
        if (!harborSide) {
            this.pack++;
        }
        this.version = `v.${version.replace(/\.[^.]*$/, `.${this.pack.toString()}`)}`;
    }
    render() {
        return this.version;
    }
}, [0, "hbr-context", {
        "version": [1025],
        "setAssetPath": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-context"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-context":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Context);
            }
            break;
    } });
}

const HbrContext = Context;
const defineCustomElement = defineCustomElement$1;

export { HbrContext, defineCustomElement, version as v };

