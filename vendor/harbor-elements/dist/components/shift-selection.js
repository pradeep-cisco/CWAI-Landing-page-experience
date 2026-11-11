import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

const ShiftSelection = /*@__PURE__*/ proxyCustomElement(class ShiftSelection extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.selectionChange = createEvent(this, "hbr-selection-change", 7);
        this.anchor = null;
        this.anchorRowIds = [];
        this.handleClick = (event) => {
            var _a;
            const slotTarget = event.composedPath().find((target) => target instanceof HTMLElement && Boolean(target.getAttribute("slot")));
            const slot = slotTarget === null || slotTarget === void 0 ? void 0 : slotTarget.getAttribute("slot");
            const suffix = `-column-${this.selectionColumn}`;
            if (slot === `column-${this.selectionColumn}`) {
                this.resetAnchor();
                return;
            }
            if (!(slot === null || slot === void 0 ? void 0 : slot.startsWith("row-")) || !slot.endsWith(suffix))
                return;
            const id = slot.slice(4, -suffix.length);
            const rowIds = this.getVisibleSelectableRowIds();
            const nativeEvent = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.event;
            if (!(nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey)) {
                this.setAnchor(id, rowIds);
                return;
            }
            if (!this.anchor || !this.hasSameRows(rowIds)) {
                this.setAnchor(id, rowIds);
                return;
            }
            const selected = new Set(this.selected);
            const anchorIndex = rowIds.indexOf(this.anchor);
            const currentIndex = rowIds.indexOf(id);
            if (anchorIndex !== -1 && currentIndex !== -1) {
                const [start, end] = anchorIndex < currentIndex ? [anchorIndex, currentIndex] : [currentIndex, anchorIndex];
                const deselect = selected.has(id);
                rowIds.slice(start, end + 1).forEach(rowId => deselect ? selected.delete(rowId) : selected.add(rowId));
            }
            this.setAnchor(id, rowIds);
            this.selectionChange.emit({ selected: [...selected] });
        };
        this.selected = [];
        this.selectionColumn = "selectable";
    }
    componentDidLoad() {
        var _a;
        const root = this.host.getRootNode();
        const shadowHost = root instanceof ShadowRoot ? root.host : undefined;
        this.table =
            this.host.closest("hbr-dom-table") ||
                (shadowHost instanceof HTMLElement && shadowHost.matches("hbr-dom-table")
                    ? shadowHost
                    : undefined);
        (_a = this.table) === null || _a === void 0 ? void 0 : _a.addEventListener("hbr-click", this.handleClick);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.table) === null || _a === void 0 ? void 0 : _a.removeEventListener("hbr-click", this.handleClick);
    }
    resetAnchor() {
        this.anchor = null;
        this.anchorRowIds = [];
    }
    setAnchor(id, rowIds) {
        this.anchor = rowIds.includes(id) ? id : null;
        this.anchorRowIds = [...rowIds];
    }
    hasSameRows(rowIds) {
        return rowIds.length === this.anchorRowIds.length && rowIds.every((id, index) => id === this.anchorRowIds[index]);
    }
    getVisibleSelectableRowIds() {
        var _a, _b, _c;
        const rows = Array.from(((_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelectorAll("tbody tr[data-id]")) || []);
        const checkboxes = Array.from(((_c = this.table) === null || _c === void 0 ? void 0 : _c.querySelectorAll("hbr-checkbox")) || []);
        return rows.map(row => row.dataset.id).filter((id) => {
            const checkbox = checkboxes.find(control => control.closest(`[slot="row-${id}-column-${this.selectionColumn}"]`) !== null);
            return Boolean(checkbox && !checkbox.hasAttribute("disabled"));
        });
    }
    render() { return h(Host, { key: '712f6ad852ecc59f79da212c9304c4ea0166b673', hidden: true }); }
    get host() { return this; }
}, [0, "hbr-shift-selection", {
        "selected": [16],
        "selectionColumn": [1, "selection-column"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-shift-selection"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-shift-selection":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ShiftSelection);
            }
            break;
    } });
}

export { ShiftSelection as S, defineCustomElement as d };

