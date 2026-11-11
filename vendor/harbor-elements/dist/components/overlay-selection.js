import { h, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { l as getRange, C as ColumnService, m as isRangeSingleCell } from './columnService.js';
import { C as CELL_HANDLER_CLASS, E as EDIT_INPUT_WR, S as SELECTION_BORDER_CLASS } from './consts.js';
import { i as isCtrlKey, c as codesLetter, a as isClear, b as isEnterKey, e as isLetterKey, d as defineCustomElement$1 } from './edit.js';
import { d as debounce, e as each } from './function-helper.js';
import { g as getSourceItem } from './data.store.js';
import { a as getCell, b as getCurrentCell, c as getDirectionCoordinate, d as getLargestAxis, i as isAfterLast, e as getCoordinate, f as isBeforeFirst, g as getElStyle } from './selection.utils.js';
import { t as timeout } from './utils.js';
import { d as defineCustomElement$2 } from './order-editor.js';

class SelectionStoreService {
    constructor(store, config) {
        this.store = store;
        this.config = config;
        this.store = store;
    }
    get edited() {
        return this.store.get("edit");
    }
    get focused() {
        return this.store.get("focus");
    }
    get ranged() {
        return this.store.get("range");
    }
    changeRange(range) {
        return this.config.changeRange(range);
    }
    focus(cell, isMulti = false) {
        if (!cell) {
            return false;
        }
        const end = cell;
        // range edit
        if (isMulti) {
            const start = this.store.get("focus");
            if (start) {
                return this.config.changeRange(getRange(start, end));
            }
        }
        // single focus
        return this.config.focus(cell, end);
    }
}

var AutoFillType;
(function (AutoFillType) {
    AutoFillType["selection"] = "Selection";
    AutoFillType["autoFill"] = "AutoFill";
})(AutoFillType || (AutoFillType = {}));
class AutoFillService {
    constructor(sv) {
        this.sv = sv;
        this.autoFillType = null;
        this.autoFillInitial = null;
        this.autoFillStart = null;
        this.autoFillLast = null;
    }
    /**
     * Render autofill box
     * @param range
     * @param selectionFocus
     */
    renderAutofill(range, selectionFocus) {
        let handlerStyle;
        if (range) {
            handlerStyle = getCell(range, this.sv.dimensionRow.state, this.sv.dimensionCol.state);
        }
        else {
            handlerStyle = getCell(Object.assign(Object.assign({}, selectionFocus), { x1: selectionFocus.x, y1: selectionFocus.y }), this.sv.dimensionRow.state, this.sv.dimensionCol.state);
        }
        return (h("div", { class: CELL_HANDLER_CLASS, style: {
                left: `${handlerStyle.right}px`,
                top: `${handlerStyle.bottom}px`,
            }, onMouseDown: (e) => this.selectionStart(e, this.sv.getData(), AutoFillType.autoFill) }));
    }
    get isAutoFill() {
        return !!this.autoFillType;
    }
    /** Process mouse move events */
    selectionMouseMove(e) {
        // initiate mouse move debounce if not present
        if (!this.onMouseMoveAutofill) {
            this.onMouseMoveAutofill = debounce((e, data) => this.doAutofillMouseMove(e, data), 5);
        }
        if (this.isAutoFill) {
            this.onMouseMoveAutofill(e, this.sv.getData());
        }
    }
    getFocus() {
        let focus = this.sv.selectionStoreService.focused;
        const range = this.sv.selectionStoreService.ranged;
        if (range) {
            focus = { x: range.x, y: range.y };
        }
        if (!focus && !range) {
            return null;
        }
        return focus;
    }
    /**
     * Autofill logic:
     * on mouse move apply based on previous direction (if present)
     */
    doAutofillMouseMove({ x, y }, data) {
        if (!this.autoFillInitial) {
            return;
        }
        let current = getCurrentCell({ x, y }, data);
        let direction;
        if (this.autoFillLast) {
            direction = getDirectionCoordinate(this.autoFillStart, this.autoFillLast);
        }
        // first time or direction equal to start(same as first time)
        if (!this.autoFillLast || !direction) {
            direction = getLargestAxis(this.autoFillStart, current);
            if (!this.autoFillLast) {
                this.autoFillLast = this.autoFillStart;
            }
        }
        // nothing changed
        if (!direction) {
            return;
        }
        each(direction, (v, k) => {
            if (v) {
                current = Object.assign(Object.assign({}, this.autoFillLast), { [k]: current[k] });
            }
        });
        // check if not the latest
        if (isAfterLast(current, data)) {
            return;
        }
        this.autoFillLast = current;
        this.sv.setTempRange({
            area: getRange(this.autoFillInitial, this.autoFillLast),
            type: this.autoFillType,
        });
    }
    /**
     * Range selection started
     * Mode @param type:
     * Can be triggered from MouseDown selection on element
     * Or can be triggered on corner square drag
     */
    selectionStart(e, data, type = AutoFillType.selection) {
        /** Get cell by autofill element */
        const { top, left } = e.target.getBoundingClientRect();
        this.autoFillInitial = this.getFocus();
        this.autoFillType = type;
        this.autoFillStart = getCurrentCell({ x: left, y: top }, data);
        e.preventDefault();
    }
    /** Clear current range selection */
    clearAutoFillSelection() {
        // Apply autofill values on mouse up
        if (this.autoFillInitial) {
            // Get latest
            this.autoFillInitial = this.getFocus();
            if (this.autoFillType === AutoFillType.autoFill) {
                this.applyRangeWithData(this.autoFillInitial, this.autoFillLast);
            }
            else {
                this.applyRangeOnly(this.autoFillInitial, this.autoFillLast);
            }
        }
        this.autoFillType = null;
        this.autoFillInitial = null;
        this.autoFillLast = null;
        this.autoFillStart = null;
    }
    /** Trigger range apply events and handle responses */
    onRangeApply(data, range) {
        const models = {};
        for (const rowIndex in data) {
            models[rowIndex] = getSourceItem(this.sv.dataStore, parseInt(rowIndex, 10));
        }
        const dataEvent = this.sv.internalRangeDataApply({
            data,
            models,
            type: this.sv.dataStore.get("type"),
        });
        if (!dataEvent.defaultPrevented) {
            this.sv.columnService.applyRangeData(data);
        }
        this.sv.setRange(range);
    }
    /** Apply range and copy data during range application */
    applyRangeWithData(start, end) {
        // no changes to apply
        if (!start || !end) {
            return;
        }
        const oldRange = this.sv.selectionStoreService.ranged;
        const newRange = getRange(start, end);
        const columns = [...this.sv.columnService.columns];
        const rangeData = {
            type: this.sv.dataStore.get("type"),
            newData: {},
            newRange,
            oldRange,
            newProps: columns.slice(newRange.x, newRange.x1 + 1).map((v) => v.prop),
            oldProps: columns.slice(oldRange === null || oldRange === void 0 ? void 0 : oldRange.x, (oldRange === null || oldRange === void 0 ? void 0 : oldRange.x1) + 1).map((v) => v.prop),
        };
        rangeData.newData = this.sv.columnService.getRangeData(rangeData);
        const selectionEndEvent = this.sv.internalSelectionChanged(rangeData);
        if (selectionEndEvent.defaultPrevented) {
            this.sv.setTempRange(null);
            return;
        }
        this.onRangeApply(rangeData.newData, newRange);
    }
    /** Update range selection ony, no data change (mouse selection) */
    applyRangeOnly(start, end) {
        // no changes to apply
        if (!start || !end) {
            return;
        }
        const newRange = getRange(start, end);
        this.sv.setRange(newRange);
    }
}

class ClipboardService {
    constructor(sv) {
        this.sv = sv;
    }
    onCopy(e) {
        const canCopy = this.sv.internalCopy();
        if (canCopy.defaultPrevented) {
            return false;
        }
        const focus = this.sv.selectionStoreService.focused;
        let range = this.sv.selectionStoreService.ranged;
        let data;
        if (!range) {
            range = getRange(focus, focus);
        }
        if (range) {
            const columns = [...this.sv.columnService.columns];
            const props = columns.slice(range.x, range.x1 + 1).map((v) => v.prop);
            data = this.sv.columnService.copyRangeArray(range, props, this.sv.dataStore);
        }
        this.clipboard.doCopy(e, data);
        return true;
    }
    renderClipboard() {
        return (h("hbr-clipboard", { onCopyRegion: (e) => this.onCopy(e.detail), ref: (e) => {
                this.clipboard = e;
            }, onPasteRegion: (e) => this.onPaste(e.detail) }));
    }
    onPaste(data) {
        const focus = this.sv.selectionStoreService.focused;
        const isEditing = this.sv.selectionStoreService.edited !== null;
        if (!focus || isEditing) {
            return;
        }
        const { changed, range } = this.sv.columnService.getTransformedDataToApply(focus, data);
        this.sv.onRangeApply(changed, range);
    }
}

// is edit input
function isEditInput(el) {
    return !!(el === null || el === void 0 ? void 0 : el.closest(`.${EDIT_INPUT_WR}`));
}

class KeyboardService {
    constructor(sv) {
        this.sv = sv;
        this.ctrlDown = false;
    }
    async keyDown(e, canRange) {
        if (!this.sv.selectionStoreService.focused) {
            return;
        }
        if (isCtrlKey(e.keyCode, navigator.platform)) {
            this.ctrlDown = true;
        }
        // tab key means same as arrow right
        if (codesLetter.TAB === e.code) {
            this.keyChangeSelection(e, canRange);
            return;
        }
        /**
         *  IF EDIT MODE
         */
        if (this.sv.selectionStoreService.edited) {
            switch (e.code) {
                case codesLetter.ESCAPE:
                    this.sv.doEdit(undefined, true);
                    break;
            }
            return;
        }
        /**
         *  IF NOT EDIT MODE
         */
        // pressed clear key
        if (isClear(e.code)) {
            this.sv.clearCell();
            return;
        }
        // pressed enter
        if (isEnterKey(e.code)) {
            this.sv.doEdit();
            return;
        }
        // copy operation
        if (this.isCopy(e)) {
            return;
        }
        // paste operation
        if (this.isPaste(e)) {
            this.sv.internalPaste();
            return;
        }
        // pressed letter key
        if (isLetterKey(e.keyCode)) {
            this.sv.doEdit(e.key);
            return;
        }
        // pressed arrow, change selection position
        if (await this.keyChangeSelection(e, canRange)) {
            return;
        }
    }
    async keyChangeSelection(e, canRange) {
        const data = this.changeDirectionKey(e, canRange);
        if (!data) {
            return false;
        }
        await timeout();
        const range = this.sv.selectionStore.get("range");
        const focus = this.sv.selectionStore.get("focus");
        return this.keyPositionChange(data.changes, this.sv.getData(), range, focus, data.isMulti);
    }
    keyPositionChange(changes, eData, range, focus, isMulti = false) {
        var _a, _b, _c, _d, _e;
        if (!range || !focus) {
            return false;
        }
        const data = getCoordinate(range, focus, changes, isMulti);
        if (!data) {
            return false;
        }
        if ((_a = this.sv) === null || _a === void 0 ? void 0 : _a.paginationPlugin) {
            if (((_c = (_b = this.sv) === null || _b === void 0 ? void 0 : _b.paginationPlugin) === null || _c === void 0 ? void 0 : _c.canSelectOrEditPagination(data.start)) ||
                ((_e = (_d = this.sv) === null || _d === void 0 ? void 0 : _d.paginationPlugin) === null || _e === void 0 ? void 0 : _e.canSelectOrEditPagination(data.end))) {
                return;
            }
        }
        if (isMulti) {
            if (isAfterLast(data.end, eData) || isBeforeFirst(data.start)) {
                return false;
            }
            const range = getRange(data.start, data.end);
            return this.sv.selectionStoreService.changeRange(range);
        }
        return this.sv.selectionStoreService.focus(data.start);
    }
    keyUp(e) {
        if (isCtrlKey(e.keyCode, navigator.platform)) {
            this.ctrlDown = false;
        }
    }
    isCopy(e) {
        return this.ctrlDown && e.code === codesLetter.C;
    }
    isPaste(e) {
        return this.ctrlDown && e.code === codesLetter.V;
    }
    /** Monitor key direction changes */
    changeDirectionKey(e, canRange) {
        const isMulti = canRange && e.shiftKey;
        switch (e.code) {
            case codesLetter.TAB:
            case codesLetter.ARROW_UP:
            case codesLetter.ARROW_DOWN:
            case codesLetter.ARROW_LEFT:
            case codesLetter.ARROW_RIGHT:
                e.preventDefault();
                break;
        }
        switch (e.code) {
            case codesLetter.ARROW_UP:
                return { changes: { y: -1 }, isMulti };
            case codesLetter.ARROW_DOWN:
                return { changes: { y: 1 }, isMulti };
            case codesLetter.ARROW_LEFT:
                return { changes: { x: -1 }, isMulti };
            case codesLetter.TAB:
                return { changes: { x: e.shiftKey ? -1 : 1 }, isMulti };
            case codesLetter.ARROW_RIGHT:
                return { changes: { x: 1 }, isMulti };
        }
    }
}

const overlayStyleCss = "hbr-overlay-selection{display:block;position:relative;width:100%}hbr-overlay-selection .autofill-handle{position:absolute;width:10px;height:10px;background:#0d63e8;margin-left:-9px;margin-top:-9px;border:1px solid white;box-sizing:border-box;z-index:10;cursor:crosshair}hbr-overlay-selection .selection-border-range{position:absolute;pointer-events:none;z-index:9}hbr-overlay-selection .selection-border-range{box-shadow:-1px 0 0 #0d63e8 inset, 1px 0 0 #0d63e8 inset, 0 -1px 0 #0d63e8 inset, 0 1px 0 #0d63e8 inset}hbr-overlay-selection hbr-table-edit{z-index:10}";
const HbrOverlaySelectionStyle0 = overlayStyleCss;

const OverlaySelection = /*@__PURE__*/ proxyCustomElement(class OverlaySelection extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.internalCopy = createEvent(this, "internalCopy", 7);
        this.internalPaste = createEvent(this, "internalPaste", 7);
        this.internalCellEdit = createEvent(this, "internalCellEdit", 7);
        this.internalFocusCell = createEvent(this, "internalFocusCell", 7);
        this.setEdit = createEvent(this, "setEdit", 3);
        this.setRange = createEvent(this, "setRange", 7);
        this.setTempRange = createEvent(this, "setTempRange", 7);
        this.focusCell = createEvent(this, "focusCell", 3);
        this.internalSelectionChanged = createEvent(this, "internalSelectionChanged", 7);
        this.internalRangeDataApply = createEvent(this, "internalRangeDataApply", 7);
        this.keyboardService = null;
        this.autoFillService = null;
        this.clipboardService = null;
        this.readonly = undefined;
        this.range = undefined;
        this.canDrag = undefined;
        this.useClipboard = undefined;
        this.selectionStore = undefined;
        this.dimensionRow = undefined;
        this.dimensionCol = undefined;
        this.dataStore = undefined;
        this.colData = undefined;
        this.lastCell = undefined;
        this.editors = undefined;
        this.tbSelf = undefined;
    }
    // --------------------------------------------------------------------------
    //
    //  Listeners
    //
    // --------------------------------------------------------------------------
    onMouseMove(e) {
        if (this.selectionStoreService.focused) {
            this.autoFillService.selectionMouseMove(e);
        }
    }
    /** Pointer left document, clear any active operation */
    onMouseOut() {
        this.autoFillService.clearAutoFillSelection();
    }
    /** Action finished inside of the document */
    onMouseUp() {
        this.autoFillService.clearAutoFillSelection();
    }
    /** Row drag started */
    onCellDrag(e) {
        var _a;
        (_a = this.orderEditor) === null || _a === void 0 ? void 0 : _a.dragStart(e.detail);
    }
    /** Recived keyboard down from element */
    onKeyUp(e) {
        var _a;
        (_a = this.keyboardService) === null || _a === void 0 ? void 0 : _a.keyUp(e);
    }
    /** Recived keyboard down from element */
    onKeyDown(e) {
        var _a;
        (_a = this.keyboardService) === null || _a === void 0 ? void 0 : _a.keyDown(e, this.range);
    }
    /** Create selection store */
    selectionServiceSet(s) {
        var _a;
        this.selectionStoreService = new SelectionStoreService(s, {
            changeRange: (range) => { var _a; return !((_a = this.setRange.emit(range)) === null || _a === void 0 ? void 0 : _a.defaultPrevented); },
            focus: (focus, end) => {
                var _a;
                const focused = { focus, end };
                const { defaultPrevented } = this.internalFocusCell.emit(this.columnService.getSaveData(focus.y, focus.x));
                if (defaultPrevented) {
                    return false;
                }
                return !((_a = this.focusCell.emit(focused)) === null || _a === void 0 ? void 0 : _a.defaultPrevented);
            },
        });
        this.keyboardService = new KeyboardService({
            selectionStoreService: this.selectionStoreService,
            selectionStore: s,
            doEdit: (v, c) => this.doEdit(v, c),
            clearCell: () => this.clearCell(),
            getData: () => this.getData(),
            internalPaste: () => this.internalPaste.emit(),
            paginationPlugin: (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.paginationPlugin,
        });
        this.createAutoFillService();
        this.createClipboardService();
    }
    createAutoFillService() {
        this.autoFillService = new AutoFillService({
            selectionStoreService: this.selectionStoreService,
            dimensionRow: this.dimensionRow,
            dimensionCol: this.dimensionCol,
            columnService: this.columnService,
            dataStore: this.dataStore,
            setTempRange: (e) => this.setTempRange.emit(e),
            internalSelectionChanged: (e) => this.internalSelectionChanged.emit(e),
            internalRangeDataApply: (e) => this.internalRangeDataApply.emit(e),
            setRange: (e) => this.setRange.emit(e),
            getData: () => this.getData(),
        });
    }
    columnServiceSet() {
        var _a;
        (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
        this.columnService = new ColumnService(this.dataStore, this.colData);
        this.createAutoFillService();
        this.createClipboardService();
    }
    createClipboardService() {
        this.clipboardService = new ClipboardService({
            selectionStoreService: this.selectionStoreService,
            columnService: this.columnService,
            dataStore: this.dataStore,
            onRangeApply: (d, r) => this.autoFillService.onRangeApply(d, r),
            internalCopy: () => this.internalCopy.emit(),
        });
    }
    connectedCallback() {
        this.columnServiceSet();
        this.selectionServiceSet(this.selectionStore);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    renderRange(range) {
        const style = getElStyle(range, this.dimensionRow.state, this.dimensionCol.state);
        return [h("div", { class: SELECTION_BORDER_CLASS, style: style })];
    }
    renderEditCell() {
        // if can edit
        const editCell = this.selectionStore.get("edit");
        if (this.readonly || !editCell) {
            return;
        }
        const val = editCell.val || this.columnService.getCellData(editCell.y, editCell.x);
        const editable = Object.assign(Object.assign({}, editCell), this.columnService.getSaveData(editCell.y, editCell.x, val));
        const style = getElStyle(Object.assign(Object.assign({}, editCell), { x1: editCell.x, y1: editCell.y }), this.dimensionRow.state, this.dimensionCol.state);
        return (h("hbr-table-edit", { onCellEdit: (e) => this.onCellEdit(e.detail), onCloseEdit: (e) => this.closeEdit(e), editCell: editable, column: this.columnService.columns[editCell.x], editor: this.columnService.getCellEditor(editCell.y, editCell.x, this.editors), style: style }));
    }
    render() {
        const range = this.selectionStoreService.ranged;
        const selectionFocus = this.selectionStoreService.focused;
        const els = [];
        if ((range || selectionFocus) && this.useClipboard) {
            els.push(this.clipboardService.renderClipboard());
        }
        if (range) {
            els.push(...this.renderRange(range));
        }
        const editCell = this.renderEditCell();
        if (editCell) {
            els.push(editCell);
        }
        if (selectionFocus && !this.readonly && !editCell && this.range) {
            els.push(this.autoFillService.renderAutofill(range, selectionFocus));
        }
        if (this.canDrag) {
            els.push(h("hbr-order-editor", { key: '7b86269fd576ba20382776780970f713609e80ed', ref: (e) => (this.orderEditor = e), dataStore: this.dataStore, dimensionRow: this.dimensionRow, dimensionCol: this.dimensionCol, parent: this.element, onInternalRowDragStart: (e) => this.onRowDragStart(e) }));
        }
        return (h(Host, { key: '43622d2001efd7150687bb5af4eafb18f6b96a61', onDblClick: () => this.doEdit(), onMouseDown: (e) => this.onElementMouseDown(e) }, els, h("slot", { key: 'e98e0e4293cf7098e36e42df16a967b9d037be99', name: "data" })));
    }
    onElementMouseDown(e) {
        var _a, _b;
        // Ignore focus if clicked input
        if (isEditInput(e.target)) {
            return;
        }
        const data = this.getData();
        if (e.defaultPrevented) {
            return;
        }
        // Regular cell click
        const focusCell = getCurrentCell({ x: e.x, y: e.y }, data);
        if ((_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.paginationPlugin) === null || _b === void 0 ? void 0 : _b.canSelectOrEditPagination(focusCell))
            return;
        this.selectionStoreService.focus(focusCell, this.range && e.shiftKey);
        // Initiate autofill selection
        if (this.range) {
            this.autoFillService.selectionStart(e, data);
        }
    }
    doEdit(val = "", isCancel = false) {
        var _a;
        if (this.canEdit()) {
            const editCell = this.selectionStore.get("focus");
            const data = this.columnService.getSaveData(editCell.y, editCell.x);
            (_a = this.setEdit) === null || _a === void 0 ? void 0 : _a.emit(Object.assign(Object.assign({}, data), { isCancel,
                val }));
        }
    }
    closeEdit(e) {
        this.doEdit(undefined, true);
        if (e === null || e === void 0 ? void 0 : e.detail) {
            this.focusNext();
        }
    }
    async focusNext() {
        const canFocus = await this.keyboardService.keyChangeSelection(new KeyboardEvent("keydown", {
            code: codesLetter.ARROW_DOWN,
        }), this.range);
        if (!canFocus) {
            this.closeEdit();
        }
    }
    clearCell() {
        if (this.selectionStoreService.ranged &&
            !isRangeSingleCell(this.selectionStoreService.ranged)) {
            const data = this.columnService.getRangeStaticData(this.selectionStoreService.ranged, "");
            this.autoFillService.onRangeApply(data, this.selectionStoreService.ranged);
        }
        else if (this.canEdit()) {
            const focused = this.selectionStoreService.focused;
            this.onCellEdit({ rgRow: focused.y, rgCol: focused.x, val: "" }, true);
        }
    }
    /** Edit finished, close cell and save */
    onCellEdit(e, clear = false) {
        const dataToSave = this.columnService.getSaveData(e.rgRow, e.rgCol, e.val);
        this.internalCellEdit.emit(dataToSave);
        // if not clear navigate to next cell after edit
        if (!clear && !e.preventFocus) {
            this.focusNext();
        }
    }
    onRowDragStart({ detail, }) {
        detail.text = this.columnService.getCellData(detail.cell.y, detail.cell.x);
    }
    /** Check if edit possible */
    canEdit() {
        var _a, _b, _c;
        if (this.readonly) {
            return false;
        }
        const editCell = this.selectionStoreService.focused;
        if ((_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.paginationPlugin) === null || _b === void 0 ? void 0 : _b.canSelectOrEditPagination(editCell))
            return;
        return editCell && !((_c = this.columnService) === null || _c === void 0 ? void 0 : _c.isReadOnly(editCell.y, editCell.x));
    }
    /** Collect data from element */
    getData() {
        return {
            el: this.element,
            rows: this.dimensionRow.state,
            cols: this.dimensionCol.state,
            lastCell: this.lastCell,
        };
    }
    get element() { return this; }
    static get watchers() { return {
        "selectionStore": ["selectionServiceSet"],
        "dimensionRow": ["createAutoFillService"],
        "dimensionCol": ["createAutoFillService"],
        "dataStore": ["columnServiceSet"],
        "colData": ["columnServiceSet"]
    }; }
    static get style() { return HbrOverlaySelectionStyle0; }
}, [4, "hbr-overlay-selection", {
        "readonly": [4],
        "range": [4],
        "canDrag": [4, "can-drag"],
        "useClipboard": [4, "use-clipboard"],
        "selectionStore": [16],
        "dimensionRow": [16],
        "dimensionCol": [16],
        "dataStore": [16],
        "colData": [16],
        "lastCell": [16],
        "editors": [16],
        "tbSelf": [8, "tb-self"]
    }, [[5, "mousemove", "onMouseMove"], [5, "mouseleave", "onMouseOut"], [5, "mouseup", "onMouseUp"], [0, "dragStartCell", "onCellDrag"], [4, "keyup", "onKeyUp"], [4, "keydown", "onKeyDown"]], {
        "selectionStore": ["selectionServiceSet"],
        "dimensionRow": ["createAutoFillService"],
        "dimensionCol": ["createAutoFillService"],
        "dataStore": ["columnServiceSet"],
        "colData": ["columnServiceSet"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-overlay-selection", "hbr-order-editor", "hbr-table-edit"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-overlay-selection":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, OverlaySelection);
            }
            break;
        case "hbr-order-editor":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-table-edit":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { OverlaySelection as O, defineCustomElement as d };

