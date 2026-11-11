import { h, proxyCustomElement, HTMLElement, createEvent } from '@stencil/core/internal/client';
import { d as debounce } from './function-helper.js';
import { I as INTERNAL_CHILD_CELL_CLASS, a as DRAGGABLE_CLASS, b as DRAG_ICON_CLASS, c as DATA_COL, d as DATA_ROW } from './consts.js';
import { n as GROUP_EXPAND_BTN, h as GROUP_EXPAND_EVENT, o as PSEUDO_GROUP_ITEM, G as GROUP_EXPANDED, c as GROUP_DEPTH, C as ColumnService, i as isGrouping } from './columnService.js';
import { g as getSourceItem } from './data.store.js';
import { e as dotsSix } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { d as defineCustomElement$3 } from './button.js';
import { d as defineCustomElement$1 } from './spinner.js';

const PADDING_DEPTH = 10;
const RowRenderer = ({ rowClass, size, start, style, depth, model, customSubRow }, cells) => {
    var _a;
    let attr = {};
    if ((_a = model === null || model === void 0 ? void 0 : model.model) === null || _a === void 0 ? void 0 : _a.id) {
        attr = {
            "data-row-id": model.model.id,
        };
    }
    return (h("div", Object.assign({ class: `rgRow ${rowClass || ""}`, role: "row" }, attr, { style: Object.assign(Object.assign({}, style), { height: `${size}px`, transform: `translateY(${start}px)`, paddingLeft: depth ? `${PADDING_DEPTH * depth}px` : undefined }) }),
        cells,
        customSubRow
            ? h("div", { class: INTERNAL_CHILD_CELL_CLASS }, customSubRow)
            : null));
};

function expandEvent(e, model, virtualIndex) {
    const event = new CustomEvent(GROUP_EXPAND_EVENT, {
        detail: {
            model,
            virtualIndex,
        },
        cancelable: true,
        bubbles: true,
    });
    e.target.dispatchEvent(event);
}
const GroupingRowRenderer = (props) => {
    const { model, itemIndex, hasExpand } = props;
    const name = model[PSEUDO_GROUP_ITEM];
    const expanded = model[GROUP_EXPANDED];
    const depth = parseInt(model[GROUP_DEPTH], 10) || 0;
    if (!hasExpand) {
        return h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }));
    }
    return (h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }),
        h("button", { class: { [GROUP_EXPAND_BTN]: true }, onClick: (e) => expandEvent(e, model, itemIndex) },
            h("svg", { "aria-hidden": "true", style: { transform: `rotate(${!expanded ? -90 : 0}deg)` }, focusable: "false", viewBox: "0 0 448 512" },
                h("path", { fill: "currentColor", d: "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" }))),
        name));
};

const CellRenderer = ({ model, canDrag, onDragStart }) => {
    var _a;
    const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
    const els = [];
    if (model.column.rowDrag && isRowDragService(model.column.rowDrag, model)) {
        const { model: curModel } = model;
        // hide children drag button limited to parent rows only. version 2.9.18
        if ((curModel === null || curModel === void 0 ? void 0 : curModel.childrenRow) && (curModel === null || curModel === void 0 ? void 0 : curModel.parentId)) {
            return els;
        }
        if (canDrag) {
            els.push(h("span", { class: DRAGGABLE_CLASS, onMouseDown: (e) => onDragStart(e) },
                h("span", { class: DRAG_ICON_CLASS }),
                h("hbr-button", { size: "xsmall", variant: "text", class: "hbr-css__table-row-drag-button" },
                    h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix }))));
        }
        else {
            els.push(h("span", { class: DRAGGABLE_CLASS }));
        }
    }
    els.push(`${ColumnService.getData(model.model[model.prop])}`);
    return els;
};
function isRowDragService(rowDrag, model) {
    if (typeof rowDrag === "function") {
        return rowDrag(model);
    }
    return !!rowDrag;
}

const dataCss = "hbr-table hbr-table-data{display:block;width:100%;position:relative}hbr-table hbr-table-data .rgRow{position:absolute;width:100%;left:0}hbr-table hbr-table-data .rgRow .hbr-internal__sub-row{overflow:hidden;display:flex;flex-direction:column;position:absolute;bottom:0;left:0;right:0;height:0}hbr-table hbr-table-data .rgRow.rgRow--expanded .hbr-internal__sub-row{height:calc(100% - var(--cell-height))}hbr-table hbr-table-data .rgRow[data-row-id].selected,hbr-table hbr-table-data .rgRow[data-row-id].selected.focused-rgRow{background-color:var(--row-bg-selected-color, var(--control-bg-weak-active, #e3eeff))}hbr-table hbr-table-data .rgRow.groupingRow{font-weight:var(--hbr-font-weight-semibold, 600)}hbr-table hbr-table-data .rgRow.groupingRow .group-expand{width:25px;height:100%;max-height:25px;margin-right:2px;background-color:transparent;border-color:transparent}hbr-table hbr-table-data .rgRow.groupingRow .group-expand svg{width:7px}hbr-table hbr-table-data .hbr-draggable{border:none;display:inline-flex;outline:0;padding:0;font-size:0.8125rem;box-sizing:border-box;align-items:center;white-space:nowrap;vertical-align:middle;justify-content:center;text-decoration:none;height:100%;cursor:pointer}hbr-table hbr-table-data .hbr-draggable>.hbr-drag-icon{vertical-align:middle;display:inline-block;pointer-events:none;transition:background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms}hbr-table hbr-table-data .rgCell{top:0;position:absolute;box-sizing:border-box;height:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:var(--cell-height, 100%)}hbr-table hbr-table-data .rgCell hbr-highlight[variant=underline]::part(base){text-overflow:ellipsis;overflow:hidden}hbr-table hbr-table-data .rgCell.align-center{text-align:center}hbr-table hbr-table-data .rgCell.align-left{text-align:left}hbr-table hbr-table-data .rgCell.align-right{text-align:right}";
const HbrTableDataStyle0 = dataCss;

const HbrgrData = /*@__PURE__*/ proxyCustomElement(class HbrgrData extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.dragStartCell = createEvent(this, "dragStartCell", 7);
        this.internalAfterLoad = createEvent(this, "internalAfterLoad", 7);
        this.cellsDidRender = [];
        this.cellsDisconnected = [];
        this.readonly = undefined;
        this.range = undefined;
        this.canDrag = undefined;
        this.rowClass = undefined;
        this.rowSelectionStore = undefined;
        this.viewportRow = undefined;
        this.viewportCol = undefined;
        this.dimensionRow = undefined;
        this.colData = undefined;
        this.dataStore = undefined;
        this.tbSelf = undefined;
    }
    connectedCallback() {
        this.columnService = new ColumnService(this.dataStore, this.colData);
        this.debouncedHandleRender = debounce(this.handleRender.bind(this), 1000);
    }
    disconnectedCallback() {
        this.cellsDisconnected.forEach((cell) => cell(this.tbSelf));
    }
    componentDidRender() {
        this.cellsDidRender.forEach((cell) => cell(this.tbSelf));
    }
    handleRender() {
        this.internalAfterLoad.emit();
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        let rows = this.viewportRow.get("items");
        const cols = this.viewportCol.get("items");
        if (!this.columnService.columns.length || !rows.length || !cols.length) {
            return "";
        }
        const range = (_a = this.rowSelectionStore) === null || _a === void 0 ? void 0 : _a.get("range");
        const rowsEls = [];
        const depth = this.dataStore.get("groupingDepth");
        if ((_c = (_b = this.tbSelf) === null || _b === void 0 ? void 0 : _b.paginationPlugin) === null || _c === void 0 ? void 0 : _c.getRows) {
            rows = (_e = (_d = this.tbSelf) === null || _d === void 0 ? void 0 : _d.paginationPlugin) === null || _e === void 0 ? void 0 : _e.getRows(rows);
        }
        for (const rgRow of rows) {
            const dataRow = getSourceItem(this.dataStore, rgRow.itemIndex);
            /** grouping */
            if (isGrouping(dataRow)) {
                rowsEls.push(h(GroupingRowRenderer, Object.assign({}, rgRow, { model: dataRow, hasExpand: this.columnService.hasGrouping })));
                continue;
            }
            /** grouping end */
            const cells = [];
            let rowClass = this.rowClass
                ? this.columnService.getRowClass(rgRow.itemIndex, this.rowClass)
                : "";
            if (range && rgRow.itemIndex >= range.y && rgRow.itemIndex <= range.y1) {
                rowClass += " focused-rgRow";
            }
            let model;
            cols.forEach((rgCol) => {
                model = this.columnService.rowDataModel(rgRow.itemIndex, rgCol.itemIndex);
                cells.push(this.getCellRenderer(rgRow, rgCol, this.canDrag, 
                /** grouping apply*/ this.columnService.hasGrouping ? depth : 0));
            });
            let customSubRow = null;
            const subRowTemplate = this.tbSelf.subRowTemplate;
            if (subRowTemplate &&
                !Object.prototype.hasOwnProperty.call((_f = model.column) !== null && _f !== void 0 ? _f : {}, "pin")) {
                // @ts-ignore
                customSubRow = subRowTemplate(h, getSourceItem(this.dataStore, rgRow.itemIndex), this.tbSelf);
            }
            rowsEls.push(h(RowRenderer, { rowClass: rowClass, size: rgRow.size, start: rgRow.start, model: model, customSubRow: customSubRow }, cells));
        }
        // HACK - to emit an event after the rows actually appended to DOM
        this.debouncedHandleRender();
        return rowsEls;
    }
    getCellRenderer(rgRow, rgCol, draggable = false, depth = 0) {
        const model = this.columnService.rowDataModel(rgRow.itemIndex, rgCol.itemIndex);
        const defaultProps = {
            [DATA_COL]: rgCol.itemIndex,
            [DATA_ROW]: rgRow.itemIndex,
            style: {
                width: `${rgCol.size}px`,
                transform: `translateX(${rgCol.start}px)`,
            },
        };
        if (depth && !rgCol.itemIndex) {
            defaultProps.style.paddingLeft = `${PADDING_DEPTH * depth}px`;
        }
        const props = this.columnService.mergeProperties(rgRow.itemIndex, rgCol.itemIndex, defaultProps);
        const custom = this.columnService.customRenderer(rgRow.itemIndex, rgCol.itemIndex, model, this.tbSelf);
        // if custom render
        if (typeof custom !== "undefined") {
            const customDidRender = this.columnService.customDidRender(rgRow.itemIndex, rgCol.itemIndex, model, custom);
            if (customDidRender) {
                !this.cellsDidRender.includes(customDidRender) &&
                    this.cellsDidRender.push(customDidRender);
            }
            const customDisconnected = this.columnService.customDisconnected(rgRow.itemIndex, rgCol.itemIndex, model, custom);
            if (customDisconnected) {
                !this.cellsDisconnected.includes(customDisconnected) &&
                    this.cellsDisconnected.push(customDisconnected);
            }
            return (h("div", Object.assign({}, props, { role: "cell", "aria-hidden": model.column.noRows ? "true" : undefined }), custom));
        }
        // something is wrong with data
        if (!model.column) {
            console.error("Investigate column problem");
            return;
        }
        // if regular render
        return (h("div", Object.assign({}, props, { role: "cell", "aria-hidden": model.column.noRows ? "true" : undefined }), h(CellRenderer, { model: model, canDrag: draggable, onDragStart: (e) => this.dragStartCell.emit(e) })));
    }
    get element() { return this; }
    static get style() { return HbrTableDataStyle0; }
}, [0, "hbr-table-data", {
        "readonly": [4],
        "range": [4],
        "canDrag": [4, "can-drag"],
        "rowClass": [1, "row-class"],
        "rowSelectionStore": [16],
        "viewportRow": [16],
        "viewportCol": [16],
        "dimensionRow": [16],
        "colData": [16],
        "dataStore": [16],
        "tbSelf": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table-data", "hbr-button", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table-data":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrData);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrgrData as H, defineCustomElement as d };

