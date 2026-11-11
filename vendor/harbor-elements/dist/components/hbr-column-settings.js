import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { e as dotsSix, l as lock, p as pushPinSimple, f as pushPinSimpleFill } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$9 } from './icon.js';
import { d as defineCustomElement$c } from './button.js';
import { d as defineCustomElement$b } from './checkbox.js';
import { d as defineCustomElement$a } from './divider.js';
import { d as defineCustomElement$8 } from './popup.js';
import { d as defineCustomElement$7 } from './portal.js';
import { d as defineCustomElement$6 } from './spinner.js';
import { d as defineCustomElement$5 } from './text.js';
import { d as defineCustomElement$4 } from './tooltip.js';
import { d as defineCustomElement$3 } from './truncation.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const columnSettingsCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--drag-effect-bg-color:var(--control-bg-weak-active)}.base{display:flex;flex-direction:column;gap:14px}.header{display:flex;flex-direction:column;gap:4px}.column-settings{display:flex;flex-direction:column;gap:4px}.column-settings.dragging *{cursor:grabbing}.item{position:relative}.item .indicator{position:absolute;left:0;right:0;height:2px}.item .top-indicator{top:-2px}.item .bottom-indicator{bottom:-2px}.item:has(.row--drop-before) .top-indicator:before,.item:has(.row--drop-after) .bottom-indicator:before{background-color:var(--control-border-active);content:\"\";position:absolute;left:0;right:0;height:2px}.item:has(.row--drop-before) .top-indicator:before{top:-1px}.item:has(.row--drop-after) .bottom-indicator::before{bottom:-1px}.item.item-dragging hbr-button{--bg-color-hover:transparent}.item.item-dragging:active{cursor:grabbing}.item.item-dragging--start{background-color:var(--drag-effect-bg-color)}.item.item-dragging--start .indicator{display:none}.row{display:flex;align-items:flex-start;gap:var(--hbr-spacing-2xs, 4px)}.row hbr-icon{color:var(--interact-icon-weak-default);font-size:16px}.row hbr-button{--button-icon-label-height-md:28px;--button-icon-label-width-md:28px}.row hbr-button[disabled] hbr-icon{color:var(--interact-icon-weak-disabled)}.row .visibility-control{padding-top:4px}.row hbr-checkbox::part(default-icon),.row hbr-checkbox::part(checked-icon){font-size:20px}.row hbr-checkbox.checkbox::part(base){align-items:flex-start}.row .checkbox{margin-left:4px}.row .locked{display:flex;align-items:flex-start;gap:8px;margin-left:4px}.row .locked hbr-icon{font-size:20px;min-width:20px;color:var(--control-icon-weak-default);cursor:not-allowed}.row .locked hbr-truncation{color:var(--base-text-default);font-weight:400;font-size:14px;line-height:20px;letter-spacing:0%}.row .locked .locked-content{display:flex;flex-direction:row;gap:4px}.grab-btn{cursor:grab}.grab-btn hbr-icon{font-size:16px}.pin-icon--disabled{font-size:16px}.pin-icon--pinned{font-size:16px;color:var(--control-icon-weak-default)}.pin-icon--unpinned{font-size:16px;color:var(--control-icon-weak-default)}.divider{--margin:16px 0}::slotted([slot^=column-][slot$=-suffix]){display:flex;align-items:center}.hidden{display:none;overflow:hidden;height:0;width:0}";
const HbrColumnSettingsStyle0 = columnSettingsCss;

const DEFAULT_I18N = {
    header: "Column settings",
    description: "Select or deselect to show or hide columns.",
    descriptionReorder: "Reorder columns by dragging.",
    descriptionPin: "Use the pin button to pin or unpin a column to the left.",
    tooltipPin: "This column can't be pinned.",
    tooltipUnpin: "This column can't be unpinned.",
    tooltipVisibility: "This column can't be hidden.",
    tooltipReorder: "This column can't be reordered.",
};
const TOOLTIP_DATA_ID = "column-settings-visibility-label";
const ColumnSettings = /*@__PURE__*/ proxyCustomElement(class ColumnSettings extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrColumnsChange = createEvent(this, "hbr-columns-change", 7);
        this._dragId = null;
        this.handleDragStart = (e, colId) => {
            this._dragId = colId;
            const ele = e.target;
            this.dragStartEle = ele;
            ele === null || ele === void 0 ? void 0 : ele.classList.add("item-dragging--start");
            if (e.dataTransfer)
                e.dataTransfer.effectAllowed = "move";
        };
        this.handleDragOver = (e, colId) => {
            var _a;
            e.preventDefault();
            // Block cross-zone drag: dragged item must be in the same zone as the target
            if (this._dragId) {
                const draggedCol = this.columns.find((c) => c.id === this._dragId);
                const targetCol = this.columns.find((c) => c.id === colId);
                if (((draggedCol === null || draggedCol === void 0 ? void 0 : draggedCol.pin) === "left") !== ((targetCol === null || targetCol === void 0 ? void 0 : targetCol.pin) === "left")) {
                    if (e.dataTransfer)
                        e.dataTransfer.dropEffect = "none";
                    this._dragOverId = null;
                    return;
                }
            }
            if (this.dragStartEle) {
                this.dragStartEle.classList.remove("item-dragging--start");
            }
            (_a = this.columnSettings) === null || _a === void 0 ? void 0 : _a.classList.add("dragging");
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = "move";
            const rect = e.currentTarget.getBoundingClientRect();
            this._insertAfter = e.clientY > rect.top + rect.height / 2;
            this._dragOverId = colId;
        };
        this.handleDragLeave = (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                this._dragOverId = null;
            }
        };
        this.handleDragEnd = () => {
            var _a;
            this._dragId = null;
            this._dragOverId = null;
            if (this.dragStartEle) {
                this.dragStartEle.classList.remove("item-dragging");
                this.dragStartEle.classList.remove("item-dragging--start");
                this.dragStartEle = undefined;
            }
            (_a = this.columnSettings) === null || _a === void 0 ? void 0 : _a.classList.remove("dragging");
        };
        this.handleDrop = (e, targetId) => {
            e.preventDefault();
            const dragId = this._dragId;
            const insertAfter = this._insertAfter;
            this._dragId = null;
            this._dragOverId = null;
            if (!dragId || dragId === targetId)
                return;
            const draggedCol = this.columns.find((c) => c.id === dragId);
            if ((draggedCol === null || draggedCol === void 0 ? void 0 : draggedCol.reorderable) === false)
                return;
            // Block cross-zone drops: pinned items stay in the pinned zone, unpinned in the unpinned zone
            const targetCol = this.columns.find((c) => c.id === targetId);
            if (((draggedCol === null || draggedCol === void 0 ? void 0 : draggedCol.pin) === "left") !== ((targetCol === null || targetCol === void 0 ? void 0 : targetCol.pin) === "left"))
                return;
            const rightPinned = this.columns.filter((c) => c.pin === "right");
            const rightPinnedIds = new Set(rightPinned.map((c) => c.id));
            const draggable = this.columns.filter((c) => c.id !== "empty" && !rightPinnedIds.has(c.id));
            const orderedList = [
                ...draggable.filter((c) => c.pin === "left"),
                ...draggable.filter((c) => c.pin !== "left"),
            ];
            const fromIdx = orderedList.findIndex((c) => c.id === dragId);
            const toIdx = orderedList.findIndex((c) => c.id === targetId);
            if (fromIdx === -1 || toIdx === -1)
                return;
            const [moved] = orderedList.splice(fromIdx, 1);
            const insertPos = orderedList.findIndex((c) => c.id === targetId) + (insertAfter ? 1 : 0);
            orderedList.splice(insertPos, 0, moved);
            const emptyCol = this.columns.find((c) => c.id === "empty");
            const result = [
                ...orderedList,
                ...(emptyCol ? [emptyCol] : []),
                ...rightPinned,
            ];
            this.hbrColumnsChange.emit({
                type: "reorder",
                fromIdx,
                toIdx,
                columns: result,
            });
        };
        this.cleanDrag = (event) => {
            var _a;
            const ele = event.target;
            (_a = ele.closest(".item")) === null || _a === void 0 ? void 0 : _a.classList.remove("item-dragging");
        };
        this.columns = [];
        this.pinnable = false;
        this.reorderable = false;
        this.i18n = Object.assign({}, DEFAULT_I18N);
        this.hidden = ["selectable", "expandable"];
        this._dragOverId = null;
        this._insertAfter = false;
    }
    componentDidRender() {
        this.orderedCols.forEach((col) => {
            if (this.reorderable &&
                !col.reorderable &&
                this[`tooltip-${col.id}`] instanceof HTMLElement) {
                if (this[`button-${col.id}`] instanceof HTMLElement) {
                    this[`tooltip-${col.id}`].anchor = this[`button-${col.id}`];
                }
            }
        });
    }
    get visibleCols() {
        return this.columns.filter((c) => c.id !== "empty" && c.pin !== "right");
    }
    get pinnedCols() {
        return this.visibleCols.filter((c) => c.pin === "left");
    }
    get orderedCols() {
        const unpinned = this.visibleCols.filter((c) => c.pin !== "left");
        return [...this.pinnedCols, ...unpinned];
    }
    get icons() {
        var _a, _b, _c, _d, _e;
        const custom = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return {
            grab: (_b = custom === null || custom === void 0 ? void 0 : custom["dots-six"]) !== null && _b !== void 0 ? _b : dotsSix,
            lock: (_c = custom === null || custom === void 0 ? void 0 : custom.lock) !== null && _c !== void 0 ? _c : lock,
            pin: (_d = custom === null || custom === void 0 ? void 0 : custom["push-pin-simple"]) !== null && _d !== void 0 ? _d : pushPinSimple,
            pinFill: (_e = custom === null || custom === void 0 ? void 0 : custom["push-pin-simple-fill"]) !== null && _e !== void 0 ? _e : pushPinSimpleFill,
        };
    }
    normalizeColumns(columns) {
        const pinnedLeftCols = columns.filter((c) => c.pin === "left");
        const unpinnedCols = columns.filter((c) => !c.pin && c.id !== "empty");
        const emptyCol = columns.find((c) => c.id === "empty");
        const pinnedRightCols = columns.filter((c) => c.pin === "right");
        return [
            ...pinnedLeftCols,
            ...unpinnedCols,
            ...(emptyCol ? [emptyCol] : []),
            ...pinnedRightCols,
        ];
    }
    handlePin(col) {
        const nowPinned = col.pin !== "left";
        // Remove the column from its current position, then re-insert it at the
        // correct zone boundary so that:
        //   pinning   → appended after the last pinned column
        //   unpinning → prepended before the first unpinned column
        const without = this.columns.filter((c) => c.id !== col.id);
        const updatedCol = Object.assign(Object.assign({}, col), { pin: nowPinned ? "left" : undefined });
        let insertIdx;
        if (nowPinned) {
            // Find the index right after the last currently-pinned column
            const lastPinnedIdx = without.reduce((acc, c, i) => (c.pin === "left" ? i : acc), -1);
            insertIdx = lastPinnedIdx + 1;
        }
        else {
            // Find the index of the first currently-unpinned, non-special column
            const firstUnpinnedIdx = without.findIndex((c) => c.pin !== "left" && c.id !== "empty");
            insertIdx = firstUnpinnedIdx === -1 ? without.length : firstUnpinnedIdx;
        }
        const updated = this.normalizeColumns([
            ...without.slice(0, insertIdx),
            updatedCol,
            ...without.slice(insertIdx),
        ]);
        this.hbrColumnsChange.emit({
            type: "pin",
            column: updatedCol,
            pinned: nowPinned,
            columns: updated,
        });
    }
    handleVisibility(col, visible) {
        const updated = this.normalizeColumns(this.columns.map((c) => c.id === col.id ? Object.assign(Object.assign({}, c), { hidden: !visible }) : c));
        this.hbrColumnsChange.emit({
            type: "visibility",
            column: Object.assign(Object.assign({}, col), { hidden: !visible }),
            visible,
            columns: updated,
        });
    }
    renderPinButton(col) {
        var _a, _b, _c, _d;
        if (!this.pinnable)
            return null;
        const { pin, pinFill } = this.icons;
        const isDisabled = !col.pinnable;
        if (isDisabled) {
            const tooltipText = col.pin === "left"
                ? (_b = (_a = this.i18n) === null || _a === void 0 ? void 0 : _a.tooltipUnpin) !== null && _b !== void 0 ? _b : DEFAULT_I18N.tooltipUnpin
                : (_d = (_c = this.i18n) === null || _c === void 0 ? void 0 : _c.tooltipPin) !== null && _d !== void 0 ? _d : DEFAULT_I18N.tooltipPin;
            return (h("hbr-tooltip", { hoist: true }, h("hbr-button", { variant: "text", disabled: true }, h("hbr-icon", { asset: col.pin === "left" ? pinFill : pin, class: "pin-icon--disabled" })), h("slot", { name: `tooltip-pin-${col.id}`, slot: "content" }, tooltipText)));
        }
        const isPinned = col.pin === "left";
        return (h("hbr-button", { variant: "text", onClick: () => this.handlePin(col) }, h("hbr-icon", { asset: isPinned ? pinFill : pin, class: isPinned ? "pin-icon--pinned" : "pin-icon--unpinned" })));
    }
    renderVisibilityControl(col, label) {
        var _a, _b;
        const slot = [
            h("slot", { name: `column-${col.id}` }, h("hbr-truncation", { tooltipTarget: `[data-id="${TOOLTIP_DATA_ID}"]` }, h("slot", { name: `column-${col.id}-label` }, label))),
            h("slot", { name: `column-${col.id}-suffix`, slot: "element-suffix" }),
        ];
        return (h("div", { class: "visibility-control" }, h("slot", { name: `visibility-${col.id}` }, col.hideable ? (h("hbr-checkbox", { class: "checkbox", checked: !col.hidden, value: col.id, "onHbr-change": (e) => {
                this.handleVisibility(col, e.target.checked);
            } }, slot)) : (h("div", { class: "locked" }, h("hbr-tooltip", { hoist: true }, h("hbr-icon", { asset: this.icons.lock }), h("slot", { name: `tooltip-visibility-${col.id}`, slot: "content" }, (_b = (_a = this.i18n) === null || _a === void 0 ? void 0 : _a.tooltipVisibility) !== null && _b !== void 0 ? _b : DEFAULT_I18N.tooltipVisibility)), h("div", { class: "locked-content" }, slot))))));
    }
    renderRow(col, isDragOver = false, insertAfter = false, inert = {}) {
        var _a, _b;
        const label = col.name;
        return (h("div", Object.assign({ class: {
                hidden: this.hidden.includes(col.id),
            } }, inert), h("div", { class: {
                row: true,
                "row--drop-after": isDragOver && insertAfter,
                "row--drop-before": isDragOver && !insertAfter,
            } }, this.reorderable && (h("hbr-button", { "data-id": col.id, disabled: !col.reorderable, variant: "text", class: "grab-btn", ref: (ref) => {
                this[`button-${col.id}`] = ref;
            }, onMouseDown: (e) => {
                var _a;
                const ele = e.target;
                (_a = ele.closest(".item")) === null || _a === void 0 ? void 0 : _a.classList.add("item-dragging");
            }, onMouseUp: this.cleanDrag, onMouseLeave: this.cleanDrag }, h("hbr-icon", { asset: this.icons.grab, class: "icon" }))), this.pinnable && this.renderPinButton(col), this.renderVisibilityControl(col, label)), this.reorderable && !col.reorderable && (h("hbr-portal", null, h("hbr-tooltip", { hoist: true, ref: (ref) => {
                this[`tooltip-${col.id}`] = ref;
            }, placement: "left" }, h("slot", { name: `tooltip-reorder-${col.id}`, slot: "content" }, (_b = (_a = this.i18n) === null || _a === void 0 ? void 0 : _a.tooltipReorder) !== null && _b !== void 0 ? _b : DEFAULT_I18N.tooltipReorder))))));
    }
    render() {
        const pinnedCount = this.pinnedCols.length;
        const i18n = Object.assign(Object.assign({}, DEFAULT_I18N), this.i18n);
        return (h(Host, { key: 'f0e371190ec884647b8aeeea428c6daccecd467a' }, h("div", { key: 'd1890fc1bb8584531b89d26bc00114634908969c', part: "base", class: "base" }, h("slot", { key: '1672032af171367d67a3cee8c5fe7fbe2e4b7063', name: "header" }, h("div", { key: '796d10f7845f154f6ade939835fa4bcc85606a9b', part: "header-wrapper", class: "header" }, h("hbr-text", { key: '06ad7de51ff6d332ee708d0481386b71769e6a96', part: "header", "aria-level": "3", type: "primary", weight: "semibold", size: "sm" }, i18n.header), h("slot", { key: '4c079ff3acd00d553ea8a8751219103afd5ff840', name: "description" }, h("hbr-text", { key: '0c9432d68d6a6397e3f7a47b5bec93d014c26e18', part: "description", type: "secondary", size: "sm" }, i18n.description, " ", this.reorderable && ` ${i18n.descriptionReorder}`, this.pinnable && ` ${i18n.descriptionPin}`)))), h("div", { key: '4b33230019678d4b987579909e633d39280c983d', role: "list", class: "column-settings", ref: (ref) => {
                this.columnSettings = ref;
            } }, this.orderedCols.flatMap((col, idx) => {
            const showDivider = pinnedCount > 0 && col.pin !== "left" && idx === pinnedCount;
            const isDragOver = this._dragOverId === col.id;
            const inert = this.hidden.includes(col.id) ? { inert: true } : {};
            const row = this.renderRow(col, isDragOver, this._insertAfter, inert);
            return [
                showDivider ? h("hbr-divider", { class: "divider" }) : null,
                !col.reorderable ? (row) : (h("div", Object.assign({ role: "listitem", key: col.id, class: {
                        item: true,
                        hidden: this.hidden.includes(col.id),
                    }, "data-id": `column-${col.id}`, draggable: true, onDragStart: (e) => this.handleDragStart(e, col.id), onDragOver: (e) => this.handleDragOver(e, col.id), onDragLeave: this.handleDragLeave, onDragEnd: this.handleDragEnd, onDrop: (e) => this.handleDrop(e, col.id) }, inert), h("div", { class: "indicator top-indicator" }), row, h("div", { class: "indicator bottom-indicator" }))),
            ];
        }))), h("hbr-portal", { key: 'a135dd2d12fa52a4cc32a008e6dc41d3a550cb3f' }, h("hbr-tooltip", { key: '80138c3a24407b890a43eaa24f515ed4731536bf', "data-id": TOOLTIP_DATA_ID }))));
    }
    get host() { return this; }
    static get style() { return HbrColumnSettingsStyle0; }
}, [1, "hbr-column-settings", {
        "columns": [1040],
        "pinnable": [4],
        "reorderable": [4],
        "i18n": [16],
        "hidden": [16],
        "_dragOverId": [32],
        "_insertAfter": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-column-settings", "hbr-button", "hbr-checkbox", "hbr-divider", "hbr-icon", "hbr-popup", "hbr-portal", "hbr-spinner", "hbr-text", "hbr-tooltip", "hbr-truncation", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-column-settings":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ColumnSettings);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-checkbox":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-divider":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-portal":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-text":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-truncation":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrColumnSettings = ColumnSettings;
const defineCustomElement = defineCustomElement$1;

export { HbrColumnSettings, defineCustomElement };

