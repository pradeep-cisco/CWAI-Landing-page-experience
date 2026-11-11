import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const menuLabelCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--padding:7px var(--hbr-spacing-sm, 12px);--nav-color:var(--base-text-default);--font-size:var(--hbr-font-size-xs);--font-weight:var(--hbr-font-weight-normal);--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-normal);--color:var(--base-text-medium-default);--nav-color:var(--base-text-default)}.menu-label{font-family:var(--hbr-font-body);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);letter-spacing:var(--letter-spacing);color:var(--color);padding:var(--padding);user-select:none}.menu-label--nav{font-size:var(--hbr-font-size-xs);line-height:20px;font-weight:var(--hbr-font-weight-bold);padding:0 var(--hbr-spacing-sm);color:var(--nav-color)}.menu-label--shell-nav{font-size:var(--hbr-font-size-sm);line-height:20px;font-weight:var(--hbr-font-weight-bold);color:var(--nav-color);padding:0px 10px}.menu-label--small{--padding:var(--hbr-spacing-2xs) calc(var(--hbr-spacing-2xs) + 2px)}.menu-label--medium{--padding:calc(var(--hbr-spacing-xs) - 2px) calc(var(--hbr-spacing-xs) + 2px)}.menu-label--large{--padding:var(--hbr-spacing-xs) calc(var(--hbr-spacing-sm) + 2px)}";
const HbrMenuLabelStyle0 = menuLabelCss;

const MenuLabel = /*@__PURE__*/ proxyCustomElement(class MenuLabel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.size = "medium";
        this.nav = false;
    }
    render() {
        const isInShellNav = !!this.host.closest("hbr-shell-nav");
        return (h("div", { key: 'a6f5f3eec6a164ede0ef637712c94e8d89aa9c44', part: "base", class: {
                "menu-label": true,
                "menu-label--nav": this.nav,
                "menu-label--shell-nav": isInShellNav,
                [`menu-label--${this.size}`]: true,
            } }, h("slot", { key: 'b0195f8943ef87d1a9e68946a1d239cceed073a3' })));
    }
    get host() { return this; }
    static get style() { return HbrMenuLabelStyle0; }
}, [1, "hbr-menu-label", {
        "size": [513],
        "nav": [4]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-menu-label"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-menu-label":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, MenuLabel);
            }
            break;
    } });
}

const HbrMenuLabel = MenuLabel;
const defineCustomElement = defineCustomElement$1;

export { HbrMenuLabel, defineCustomElement };

