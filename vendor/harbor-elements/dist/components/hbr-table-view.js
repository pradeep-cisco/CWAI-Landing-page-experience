import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const tableViewCss = "";
const HbrTableViewStyle0 = tableViewCss;

const TableView = /*@__PURE__*/ proxyCustomElement(class TableView extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '25d88d65f44a40697b5320d7ec9aaf3084b0da71' }, h("span", { key: 'd26a1d6f51ca27b3c4d4e42efa715f2eac4e48e0', class: "header", part: "header" }, h("slot", { key: '71877700e73973f209fed313809e034a4ec43c52', name: "header" })), h("span", { key: '58f6d00f1c19621152f730ca1c2a4ffc53c13c34', part: "content" }, h("slot", { key: 'c7a2ab597b20c4486b34e16a72d682374ec52383' })), h("span", { key: 'b6724b477859ef6239251c7f9455d43c552e78fe', class: "footer", part: "footer" }, h("slot", { key: '66487e33d4af697085ea9a643f4095f0e67cc848', name: "footer" }))));
    }
    static get style() { return HbrTableViewStyle0; }
}, [1, "hbr-table-view"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table-view"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table-view":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TableView);
            }
            break;
    } });
}

const HbrTableView = TableView;
const defineCustomElement = defineCustomElement$1;

export { HbrTableView, defineCustomElement };

