import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const menuDividerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--margin:var(--hbr-spacing-xs) 0;--border-color:var(--base-border-default);background-color:var(--background);--vertical-bg:var(--brand-icon-default)}:host([vertical]){height:100%}.menu-divider{border-top:solid 1px var(--border-color);margin:var(--margin)}.menu-divider--vertical{border:0;width:1px;height:100%;background:var(--vertical-bg);--margin:0}";
const HbrMenuDividerStyle0 = menuDividerCss;

const MenuDivider = /*@__PURE__*/ proxyCustomElement(class MenuDivider extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.vertical = false;
    }
    render() {
        return (h("div", { key: '87a379b2a5124c2f8f569add78bccee565187a9c', part: "base", class: {
                "menu-divider": true,
                "menu-divider--vertical": this.vertical,
            },
            // biome-ignore lint/a11y/useAriaPropsForRole: W3C does not recommend using role="separator" for menu dividers
            role: "separator", "aria-hidden": "true" }));
    }
    static get style() { return HbrMenuDividerStyle0; }
}, [1, "hbr-menu-divider", {
        "vertical": [516]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-menu-divider"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-menu-divider":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, MenuDivider);
            }
            break;
    } });
}

const HbrMenuDivider = MenuDivider;
const defineCustomElement = defineCustomElement$1;

export { HbrMenuDivider, defineCustomElement };

