import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';
import { u as unregisterLibrary, r as registerLibrary } from './icon-library-registry.js';

const iconLibraryCss = ":host{display:none}";
const HbrIconLibraryStyle0 = iconLibraryCss;

const IconLibrary = /*@__PURE__*/ proxyCustomElement(class IconLibrary extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.name = undefined;
        this.resolver = undefined;
        this.mutator = undefined;
    }
    handleUpdate() {
        // Subsequent registrations with the same name will invalidate existing ones
        this.register();
    }
    connectedCallback() {
        if (this.name && this.resolver) {
            this.register();
        }
    }
    disconnectedCallback() {
        unregisterLibrary(this.name);
    }
    register() {
        const { name, resolver, mutator } = this;
        registerLibrary(name, resolver, mutator);
    }
    render() {
        return null;
    }
    static get watchers() { return {
        "name": ["handleUpdate"],
        "resolver": ["handleUpdate"],
        "mutator": ["handleUpdate"]
    }; }
    static get style() { return HbrIconLibraryStyle0; }
}, [1, "hbr-icon-library", {
        "name": [1],
        "resolver": [16],
        "mutator": [16]
    }, undefined, {
        "name": ["handleUpdate"],
        "resolver": ["handleUpdate"],
        "mutator": ["handleUpdate"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-icon-library"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-icon-library":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, IconLibrary);
            }
            break;
    } });
}

const HbrIconLibrary = IconLibrary;
const defineCustomElement = defineCustomElement$1;

export { HbrIconLibrary, defineCustomElement };

