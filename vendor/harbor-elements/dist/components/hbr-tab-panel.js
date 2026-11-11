import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const tabPanelCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--padding:0px;--border:none}.tab-panel{border:var(--border);padding:var(--padding)}";
const HbrTabPanelStyle0 = tabPanelCss;

let id = 0;
const TabPanel = /*@__PURE__*/ proxyCustomElement(class TabPanel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.componentId = `tab-panel-${++id}`;
        this.name = "";
        this.arialabel = undefined;
        this.ariarole = "tabpanel";
        this.active = false;
    }
    render() {
        let ariaProps = {};
        if (this.ariarole) {
            ariaProps = {
                role: this.ariarole,
                ariaHidden: this.active ? "false" : "true",
                ariaLabel: this.arialabel,
            };
        }
        return (
        // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
        h(Host, { key: '6404aa7fcebb6430f7791747aa031937bf0df0dd', id: this.host.id || this.componentId, style: { display: this.active ? "block" : "none" } }, h("div", Object.assign({ key: '09e1a912f32f7473ffb37fe89fb34883a178a773', part: "base", class: "tab-panel" }, ariaProps), h("slot", { key: '41d162ab5b90dc5c65f9ca01865c42ed388bc838' }))));
    }
    get host() { return this; }
    static get style() { return HbrTabPanelStyle0; }
}, [1, "hbr-tab-panel", {
        "name": [1537],
        "arialabel": [1],
        "ariarole": [8],
        "active": [516]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tab-panel"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tab-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TabPanel);
            }
            break;
    } });
}

const HbrTabPanel = TabPanel;
const defineCustomElement = defineCustomElement$1;

export { HbrTabPanel, defineCustomElement };

