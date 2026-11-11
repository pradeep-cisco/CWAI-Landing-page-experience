import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const styleCss = "hbr-table-header-cell{display:flex;flex-direction:column;flex-grow:1;gap:4px;width:100%}hbr-table-header-cell .hbr-table-header-cell-top{overflow:hidden}hbr-table-header-cell .hbr-table-header-cell-top .hbr-table-header-cell-name{overflow:hidden}hbr-table-header-cell .hbr-table-header-cell-top .hbr-table-header-cell-top-slot{overflow:hidden}hbr-table-header-cell .hbr-table-header-cell-top .hbr-table-header-cell-top-end{display:flex;flex-direction:row}.rgHeaderCell.hbr-table-header-cell-top-flex-end hbr-table-header-cell .hbr-table-header-cell-top{justify-content:flex-end}.rgHeaderCell .header-content{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-grow:1}.rgHeaderCell .header-content .hbr-header-cell-sorting-button{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rgHeaderCell .header-content .hbr-header-cell-sorting-button:focus-visible{outline:2px solid var(--control-border-focus);outline-offset:-2px;border-radius:4px}.rgHeaderCell.sortable .header-content{flex-grow:unset}.rgHeaderCell.sortable .hbr-table-header-cell-top:hover{cursor:pointer}hbr-table[theme=magnetic] .rgHeaderCell.hbr-table-column-header-text-wrap .header-content{align-items:flex-start}hbr-table[theme=magnetic] .rgHeaderCell.hbr-table-column-header-text-wrap .header-content .hbr-header-cell-sorting-button{display:-webkit-box;line-clamp:var(--column-header-text-line-clamp, 2);-webkit-line-clamp:var(--column-header-text-line-clamp, 2);-webkit-box-orient:vertical;white-space:normal}";
const HbrTableHeaderCellStyle0 = styleCss;

const TableHeaderCell = /*@__PURE__*/ proxyCustomElement(class TableHeaderCell extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.data = {};
    }
    componentDidRender() {
        if (this.ref) {
            const slotList = Array.from(this.ref.querySelectorAll("[slot]"));
            slotList.forEach(ele => {
                const slotContainer = this.ref.querySelector(`[data-slot="${ele.getAttribute("slot")}"]`);
                if (slotContainer && !slotContainer.contains(ele)) {
                    slotContainer.appendChild(ele);
                }
            });
        }
    }
    render() {
        var _a, _b, _c;
        const name = ((_a = this.data) === null || _a === void 0 ? void 0 : _a.noName) ? null : (_b = this.data) === null || _b === void 0 ? void 0 : _b.name;
        return (h(Host, { key: 'cf6b3c66cab1e367505f548bf8ee4a775d87fd87', ref: ref => {
                this.ref = ref;
            } }, h("div", { key: '6d38826704261ef72919540c992bc7581a630502', class: "hbr-table-header-cell-top", "data-header-sort": "true" }, h("div", { key: 'a5ec1e830e0a3e648912d6bb1da99e0dbb9f4486', class: "hbr-table-header-cell-top-slot", "data-slot": "top" }, h("slot", { key: '745ff4b08727de47f0160a7f6f03bdc764190fa3', name: "top" }, h("div", { key: '6b8ea860baf59b357f58cf27324132aeb06cb70b', class: "header-content" }, h("div", { key: '43af9a73f5705c461367aed80c5c49587f3ea2c1', class: "hbr-table-header-cell-top-prefix", "data-slot": "prefix" }, h("slot", { key: '42db50571f6f737646178a9fa65bf9acc82107e8', name: "prefix" })), h("div", { key: '4633f8739f1ec64643f9a591f801385cb8ed1be8', class: "hbr-table-header-cell-name", "data-slot": "name" }, h("slot", { key: '69fc5c80d920e552ba612b46a81471b24b3a185f', name: "name" }, ((_c = this.data) === null || _c === void 0 ? void 0 : _c.sortable) ? (h("div", { role: "button", tabindex: "0", "data-header-sort": "true", "data-testid": "hbr-table-header-sorting-button", class: "hbr-header-cell-sorting-button", title: name, onKeyDown: e => {
                if ([" ", "Enter"].includes(e.key)) {
                    const ele = e.target;
                    ele === null || ele === void 0 ? void 0 : ele.click();
                }
            } }, name)) : (h("div", null, name)))), h("div", { key: '44ab656d7be3c9ba2f4f021bbb7ce40229430232', class: "hbr-table-header-cell-top-suffix", "data-slot": "suffix" }, h("slot", { key: '13f4ce41762d05f343c58a2702d8082cf8fc616d', name: "suffix" })), h("div", { key: 'fd2d99ff18b2c581883d60e5baf9639b19894602', class: "hbr-table-header-cell-top-end", "data-slot": "top-end" }, h("slot", { key: 'aa076fa9ada41600290abdaed8d8b65605c89d21', name: "top-end" })))))), h("div", { key: 'fc654d7697deba8f75f4d508db63133bc8c14320', class: "hbr-table-header-cell-bottom", "data-slot": "bottom" }, h("slot", { key: '5499bea1b6650d849ff62f35222d924d73249308', name: "bottom" }))));
    }
    static get style() { return HbrTableHeaderCellStyle0; }
}, [4, "hbr-table-header-cell", {
        "data": [8]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table-header-cell"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table-header-cell":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TableHeaderCell);
            }
            break;
    } });
}

export { TableHeaderCell as T, defineCustomElement as d };

