import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { i as isFilterBtn } from './filter.button.js';
import { d as defineCustomElement$4 } from './button.js';
import { d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './spinner.js';

(function closest() {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this;
            do {
                if (Element.prototype.matches.call(el, s)) {
                    return el;
                }
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
})();

const filterStyleCss = "revogr-filter-panel{position:absolute;display:block;top:0;left:0;z-index:100;opacity:1;transform:none;background-color:var(--base-bg-weak-default);transform-origin:62px 0px;box-shadow:0 5px 18px -2px rgba(0, 0, 0, 0.2);padding:10px;border-radius:4px;min-width:150px;text-align:left}revogr-filter-panel label{color:var(--base-text-default);font-size:13px;font-weight:600;display:block;padding:8px 0}revogr-filter-panel select{width:100%}revogr-filter-panel input[type=text]{border:0;min-height:34px;margin:5px 0;color:var(--base-text-default);background:var(--base-bg-default);border-radius:5px;padding:0 10px;box-sizing:border-box}revogr-filter-panel button{margin-top:10px;margin-right:5px}revogr-filter-panel .button-group{display:flex;justify-content:space-between;margin-top:8px}.rgHeaderCell:hover .rv-filter{transition:opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms}.rgHeaderCell:hover .rv-filter,.rgHeaderCell .rv-filter.active{opacity:1}.rgHeaderCell .rv-filter{height:24px;width:24px;background:none;border:0;opacity:0;visibility:visible;cursor:pointer;border-radius:4px}.rgHeaderCell .rv-filter.active{color:#10224a}.rgHeaderCell .rv-filter .filter-img{color:gray;width:11px}.select-css{display:block;font-family:sans-serif;font-weight:600;color:#444;line-height:1.3;padding:0.6em 1.4em 0.5em 0.8em;width:100%;max-width:100%;box-sizing:border-box;margin:0;border:1px solid #f1f1f1;box-shadow:transparent;border-radius:0.5em;appearance:none;background-color:#fff;background-image:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);background-repeat:no-repeat, repeat;background-position:right 0.7em top 50%, 0 0;background-size:0.65em auto, 100%;}.select-css::-ms-expand{display:none}.select-css{}.select-css:hover{border-color:rgb(197, 197, 197)}.select-css{}.select-css:focus{border-color:#f1f1f1;box-shadow:0 0 1px 3px rgba(59, 153, 252, 0.7);box-shadow:0 0 0 3px -moz-mac-focusring;color:#222;outline:none}.select-css{}.select-css option{font-weight:normal}.select-css{}.select-css:disabled,.select-css[aria-disabled=true]{color:gray;background-image:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(to bottom, #ffffff 0%, #ffffff 100%)}.select-css:disabled:hover,.select-css[aria-disabled=true]{border-color:#f1f1f1}";
const RevogrFilterPanelStyle0 = filterStyleCss;

const defaultType = "contains";
const FilterPanel = /*@__PURE__*/ proxyCustomElement(class FilterPanel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.filterChange = createEvent(this, "filterChange", 7);
        this.changes = undefined;
        this.uuid = undefined;
        this.filterTypes = {};
        this.revogrid = undefined;
        this.filterNames = {};
        this.filterEntities = {};
    }
    onMouseDown(e) {
        if (this.changes && !e.defaultPrevented) {
            const el = e.target;
            if (this.isOutside(el) && !isFilterBtn(el)) {
                this.changes = undefined;
            }
        }
    }
    async show(newEntity) {
        this.changes = newEntity;
        if (this.changes) {
            this.changes.type = this.changes.type || defaultType;
        }
    }
    async getChanges() {
        return this.changes;
    }
    renderConditions(type) {
        const options = [];
        for (const gIndex in this.filterTypes) {
            options.push(h("option", { value: defaultType }, this.filterNames[defaultType]));
            options.push(...this.filterTypes[gIndex].map((k) => (h("option", { value: k, selected: type === k }, this.filterNames[k]))));
            options.push(h("option", { disabled: true }));
        }
        return options;
    }
    renderExtra(extra, value) {
        var _a;
        this.extraElement = undefined;
        if (!((_a = this.revogrid) === null || _a === void 0 ? void 0 : _a.enableColumnPopSelect) || extra === "input") {
            return (h("input", { type: "text", value: value, onInput: (e) => (this.changes.value = e.target.value), onKeyDown: (e) => this.onKeyDown(e), ref: (e) => (this.extraElement = e) }));
        }
        return "";
    }
    customRenderer(column) {
        const tpl = column === null || column === void 0 ? void 0 : column.columnPopTemplate;
        if (tpl) {
            return tpl(h, column);
        }
    }
    render() {
        var _a;
        if (!this.changes || !this.changes) {
            return h(Host, { style: { display: "none" } });
        }
        const style = {
            display: "block",
            left: `${this.changes.x}px`,
            top: `${this.changes.y}px`,
        };
        let custom = undefined;
        this.revogrid.columns.forEach((c) => {
            if (c.prop === this.changes.prop) {
                custom = this.customRenderer(c);
            }
        });
        if (custom) {
            return h(Host, { style: style }, custom);
        }
        return (h(Host, { style: style }, h("label", null, "Column Filter"), ((_a = this.revogrid) === null || _a === void 0 ? void 0 : _a.enableColumnPopSelect) && (h("select", { class: "select-css", onChange: (e) => this.onFilterChange(e) }, this.renderConditions(this.changes.type))), h("div", null, this.renderExtra(this.filterEntities[this.changes.type].extra, this.changes.value)), h("div", { class: "button-group" }, h("hbr-button", { size: "small", variant: "fill", onClick: () => this.onSave() }, "Save"), h("hbr-button", { size: "small", variant: "outline", onClick: () => this.onCancel() }, "Cancel"))));
    }
    onFilterChange(e) {
        if (!this.changes) {
            throw new Error("Changes required per edit");
        }
        const el = e.target;
        const type = el.value;
        this.changes = Object.assign(Object.assign({}, this.changes), { type });
    }
    onKeyDown(e) {
        if (e.key.toLowerCase() === "enter") {
            this.onSave();
        }
    }
    onCancel() {
        this.changes = undefined;
    }
    onSave() {
        var _a, _b;
        if (!this.changes) {
            throw new Error("Changes required per edit");
        }
        this.filterChange.emit({
            prop: this.changes.prop,
            type: this.changes.type,
            value: (_b = (_a = this.extraElement) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim(),
        });
        this.changes = undefined;
    }
    isOutside(e) {
        if (e.classList.contains(`[uuid="${this.uuid}"]`)) {
            return false;
        }
        return !(e === null || e === void 0 ? void 0 : e.closest(`[uuid="${this.uuid}"]`));
    }
    static get style() { return RevogrFilterPanelStyle0; }
}, [0, "revogr-filter-panel", {
        "uuid": [1537],
        "filterTypes": [16],
        "revogrid": [8],
        "filterNames": [16],
        "filterEntities": [16],
        "changes": [32],
        "show": [64],
        "getChanges": [64]
    }, [[5, "mousedown", "onMouseDown"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["revogr-filter-panel", "hbr-button", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "revogr-filter-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FilterPanel);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const RevogrFilterPanel = FilterPanel;
const defineCustomElement = defineCustomElement$1;

export { RevogrFilterPanel, defineCustomElement };

