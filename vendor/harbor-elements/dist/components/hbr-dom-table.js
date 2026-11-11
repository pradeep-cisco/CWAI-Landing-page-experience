import { h, proxyCustomElement, HTMLElement as HTMLElement$1, createEvent, Host } from '@stencil/core/internal/client';
import { s as sortDown, m as sortUp, n as sort, e as dotsSix } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$4 } from './icon.js';
import { d as defineCustomElement$5 } from './button.js';
import { d as defineCustomElement$3 } from './shift-selection.js';
import { d as defineCustomElement$2 } from './spinner.js';

const rotateOrder = (currentOrder) => {
    switch (currentOrder) {
        case "asc":
            return "desc";
        case "desc":
            return undefined;
        case undefined:
            return "asc";
        default:
            return "asc";
    }
};
const isNumeric = (num) => (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num);
const getIconAsset = (order) => order === "asc" ? sortDown : order === "desc" ? sortUp : sort;

class ReorderService {
    constructor(self, columnService) {
        this.detectSameGroupReorder = () => {
            for (const col of this.table.columns) {
                if (Array.isArray(col.group)) {
                    let foundFrom = false;
                    let foundTo = false;
                    for (const groupCol of col.group) {
                        if (groupCol.id === this.columnFromId)
                            foundFrom = true;
                        if (groupCol.id === this.columnToId)
                            foundTo = true;
                        if (foundFrom && foundTo)
                            return true;
                    }
                }
            }
            return false;
        };
        this.detectFlatReorder = () => {
            const ids = this.table.columns.map((col) => col.id);
            return ids.includes(this.columnFromId) && ids.includes(this.columnToId);
        };
        this.canReorderToTarget = () => this.columnService.getColumnPin(this.columnFromId) === this.columnService.getColumnPin(this.columnToId);
        this.handleChildBorderLeftRight = (position = "left") => {
            var _a, _b;
            const toGroup = this.table.groupService.getGroup(this.columnToId);
            if (toGroup && Array.isArray(toGroup.group) && toGroup.group.length) {
                let id = undefined;
                if (position === "left") {
                    id = (_a = toGroup.group.find(col => !col.hidden)) === null || _a === void 0 ? void 0 : _a.id;
                }
                else {
                    id = (_b = toGroup.group.findLast(col => !col.hidden)) === null || _b === void 0 ? void 0 : _b.id;
                }
                if (!id)
                    return;
                const child = this.table.host.shadowRoot.querySelector(`th[data-id="${id}"]`);
                if (!child)
                    return;
                if (position === "left") {
                    child.classList.add("col-reorder-left");
                }
                else {
                    child.classList.add("col-reorder-right");
                }
            }
        };
        this.handleLeftRightBorder = (e) => {
            const th = e.currentTarget;
            if (th.getAttribute("draggable") !== "true")
                return;
            const columns = this.columnService.getColumns();
            let fromIdx = columns.findIndex((col) => col.id === this.columnFromId);
            let toIdx = columns.findIndex((col) => col.id === this.columnToId);
            const fromGroup = this.table.groupService.getGroup(this.columnFromId);
            const toGroup = this.table.groupService.getGroup(this.columnToId);
            if (fromIdx === -1 || fromGroup) {
                fromIdx = this.table.columns.findIndex((col) => col.id === this.columnFromId && col.reorderable);
            }
            if (toIdx === -1 || toGroup) {
                toIdx = this.table.columns.findIndex((col) => col.id === this.columnToId && col.reorderable);
            }
            if (fromIdx === -1 || toIdx === -1) {
                this.columnToId = "";
                return;
            }
            if (!this.canReorderToTarget()) {
                this.columnToId = "";
                this.removeColClass(th);
                return;
            }
            if (this.detectFlatReorder() || this.detectSameGroupReorder()) {
                if (fromIdx < toIdx) {
                    if (!th.classList.contains("col-reorder-right")) {
                        th.classList.add("col-reorder-right");
                        this.handleChildBorderLeftRight("right");
                    }
                }
                else if (fromIdx > toIdx) {
                    if (!th.classList.contains("col-reorder-left")) {
                        th.classList.add("col-reorder-left");
                        this.handleChildBorderLeftRight();
                    }
                }
            }
        };
        this.removeColClass = (element) => {
            element.classList.remove("col-reorder-left");
            element.classList.remove("col-reorder-right");
        };
        this.removeBorderClass = () => {
            const thList = Array.from(this.table.host.shadowRoot.querySelectorAll("th"));
            thList.forEach(th => {
                this.removeColClass(th);
                th.classList.remove("col-dragging");
            });
        };
        this.table = self;
        this.columnService = columnService;
    }
    setColDragImage(e) {
        this.dynamicDragImage = this.table.host.shadowRoot.querySelector('[data-drag-image]');
        const th = e.currentTarget;
        const { width } = th.getBoundingClientRect();
        const { height } = this.table.host.getBoundingClientRect();
        this.dynamicDragImage.style.height = height + "px";
        this.dynamicDragImage.style.width = width + "px";
        const dynamicXOffset = this.dynamicDragImage.offsetWidth / 4;
        const dynamicYOffset = this.dynamicDragImage.offsetHeight / 6;
        e.dataTransfer.setDragImage(this.dynamicDragImage, dynamicXOffset, dynamicYOffset);
    }
    colReorder(column, element) {
        element.draggable = this.columnService.resizingColumn
            ? false
            : column.reorderable
                ? true
                : false;
        element.ondragstart = (event) => {
            if (this.columnService.resizingColumn) {
                event.preventDefault();
                return;
            }
            this.table.isColReordering = true;
            const ele = event.target;
            if (!(ele instanceof HTMLElement))
                return;
            const table = ele === null || ele === void 0 ? void 0 : ele.closest("table");
            if (table) {
                table.classList.add("dom-table--col-reordering");
            }
            const th = event.currentTarget;
            th.classList.add("col-dragging");
            this.columnFromId = column.id;
            event.dataTransfer.setData("text", column.id);
            this.setColDragImage(event);
        };
        element.ondragover = (event) => {
            event.preventDefault();
            this.columnToId = element.dataset.id;
            this.handleLeftRightBorder(event);
        };
        element.ondragleave = (event) => {
            const th = event.currentTarget;
            this.removeColClass(th);
            this.removeBorderClass();
        };
    }
    clearReorder(event) {
        event.dataTransfer.clearData();
        this.columnFromId = "";
        this.columnToId = "";
        this.table.isColReordering = false;
        this.removeBorderClass();
    }
    handleReorder(event, newColumns) {
        const fromIdx = this.table.columns.findIndex((col) => col.id === this.columnFromId && col.reorderable);
        const toIdx = this.table.columns.findIndex((col) => col.id === this.columnToId && col.reorderable);
        if (fromIdx === -1 || toIdx === -1 || !this.canReorderToTarget()) {
            return;
        }
        this.moveItem(newColumns, fromIdx, toIdx);
        this.table.reorderDrop.emit({ columns: newColumns, fromId: this.columnFromId, toId: this.columnToId });
        this.clearReorder(event);
    }
    moveItem(list, fromIdx, toIdx) {
        const item = list.splice(fromIdx, 1)[0];
        list.splice(toIdx, 0, item);
    }
    handleReorderWithinGroup(event, newColumns, itemFromGroup) {
        if (!this.canReorderToTarget()) {
            return;
        }
        // the spec only allows reordering within the same group or between groups
        const fromIdx = itemFromGroup.group.findIndex((col) => col.id === this.columnFromId);
        const toIdx = itemFromGroup.group.findIndex((col) => col.id === this.columnToId);
        newColumns.forEach((col) => {
            // reorder instead of swapping
            if (col.id === itemFromGroup.id) {
                const newGroup = [...col.group];
                this.moveItem(newGroup, fromIdx, toIdx);
                col.group = newGroup;
            }
        });
        this.table.reorderDrop.emit({ columns: newColumns, fromId: this.columnFromId, toId: this.columnToId });
        this.clearReorder(event);
    }
    colsReorder() {
        return {
            onDrop: (event) => {
                if (this.columnToId && this.columnToId !== "empty") {
                    const itemFromGroup = this.table.groupService.getItemInGroup(this.columnFromId);
                    const itemToGroup = this.table.groupService.getItemInGroup(this.columnToId);
                    const fromGroup = this.table.groupService.getGroup(this.columnFromId);
                    const toGroup = this.table.groupService.getGroup(this.columnToId);
                    const newColumns = this.table.columns.map((col) => (Object.assign({}, col)));
                    if (fromGroup && toGroup && fromGroup !== toGroup) {
                        this.handleReorder(event, newColumns);
                    }
                    else if (itemFromGroup && itemFromGroup === itemToGroup) {
                        this.handleReorderWithinGroup(event, newColumns, itemFromGroup);
                    }
                }
            },
            onDragEnd: (event) => {
                const ele = event.target;
                if (!(ele instanceof HTMLElement))
                    return;
                const table = ele === null || ele === void 0 ? void 0 : ele.closest("table");
                if (table) {
                    table.classList.add("dom-table--col-reordering");
                }
                this.clearReorder(event);
            }
        };
    }
}

class RowReorderService {
    constructor(self, columnService) {
        this.rowFromEle = null;
        this.rowToEle = null;
        this.handleBorder = (event) => {
            const ele = event.currentTarget;
            const { top: toTop } = ele.getBoundingClientRect();
            const { top: fromTop } = this.rowFromEle.getBoundingClientRect();
            if (fromTop < toTop) {
                ele.classList.add("dom-table-tr-bottom--dragging");
                ele.classList.remove("dom-table-tr-top--dragging");
            }
            else {
                ele.classList.add("dom-table-tr-top--dragging");
                ele.classList.remove("dom-table-tr-bottom--dragging");
            }
        };
        this.removeBorder = (ele = this.rowToEle) => {
            if (ele) {
                ele.classList.remove("dom-table-tr-top--dragging");
                ele.classList.remove("dom-table-tr-bottom--dragging");
            }
        };
        this.table = self;
        this.columnService = columnService;
    }
    rowReorder(rowId, element) {
        const columns = this.columnService.getColumns();
        const column = columns.find(col => col.rowReorder);
        element.draggable = !!column;
        if (element.draggable) {
            element.ondragstart = (event) => {
                const ele = event.target;
                const table = ele.closest("table");
                if (table) {
                    table.classList.add("dom-table--row-reordering");
                }
                ele.classList.add("dom-table--row-reordering-from");
                this.rowFromId = rowId;
                this.rowFromEle = event.currentTarget;
                setTimeout(() => {
                    ele.classList.remove("dom-table--row-reordering-from");
                });
            };
            element.ondragover = (event) => {
                event.preventDefault();
                this.rowToId = element.dataset.id;
                this.rowToEle = event.currentTarget;
                this.handleBorder(event);
            };
            element.ondragleave = (event) => {
                const ele = event.currentTarget;
                this.removeBorder(ele);
            };
        }
    }
    dropEvent() {
        return {
            onDrop: () => {
                const fromIdx = this.table.data.findIndex((row) => row.id === this.rowFromId);
                const toIdx = this.table.data.findIndex((row) => row.id === this.rowToId);
                const data = [...this.table.data];
                const [movedRow] = data.splice(fromIdx, 1);
                data.splice(toIdx, 0, movedRow);
                this.table.rowReorderDrop.emit({ data, fromId: this.rowFromId, toId: this.rowToId });
            },
            onDragEnd: () => {
                var _a;
                const table = (_a = this.rowFromEle) === null || _a === void 0 ? void 0 : _a.closest("table");
                if (table) {
                    table.classList.remove("dom-table--row-reordering");
                }
                this.removeBorder();
                this.rowFromEle = null;
                this.rowToEle = null;
            }
        };
    }
}

class GroupService {
    constructor(self, columnService) {
        this.getGroup = (col) => {
            let hasChild;
            if (typeof col === "string") {
                return this.table.columns.find((c) => !c.hidden && c.id === col);
            }
            else if (typeof col === "object" && Array.isArray(col.group)) {
                if (col.group.length && !col.hidden) {
                    return col;
                }
            }
            return hasChild;
        };
        this.isGroup = (col) => {
            return !!this.getGroup(col);
        };
        this.getItemInGroup = (col) => {
            let group = false;
            this.table.columns.forEach((column) => {
                if (Array.isArray(column.group) && column.group.length) {
                    column.group.forEach((child) => {
                        if (typeof col === "string" && child.id === col) {
                            group = column;
                        }
                        else if (typeof col === "object" && child === col) {
                            group = column;
                        }
                    });
                }
            });
            return group;
        };
        this.hasGroup = () => {
            return this.table.columns.some(this.isGroup);
        };
        this.renderGroup = (isSticky) => {
            const hasGroup = this.hasGroup();
            if (!hasGroup) {
                return null;
            }
            const shouldBeInert = this.table.stickyHeader && !isSticky;
            const rows = [];
            this.table.columns.forEach((col) => {
                if (this.isGroup(col)) {
                    const colSpan = col.group.filter((child) => {
                        return this.columnService
                            .getColumns()
                            .find((column) => column.id === child.id);
                    }).length;
                    if (colSpan) {
                        rows.push(h("th", { class: {
                                "dom-table__group-th": true,
                                "dom-table__group-header": true,
                                "dom-table__group-reorderable": col.reorderable
                            }, key: `group-${col.id}`, colSpan: colSpan, scope: "colgroup", "data-id": col.id, ref: ref => {
                                if (ref) {
                                    this.columnService.reorder(col, ref);
                                }
                            } },
                            h("slot", { name: `group-${col.id}` }, col.name)));
                    }
                }
                else {
                    if (this.columnService.getColumns().find((c) => c.id === col.id)) {
                        rows.push(h("th", { class: "dom-table__group-th", key: `group-${col.id}`, colSpan: 1 }));
                    }
                }
            });
            return h("tr", Object.assign({ class: {
                    "dom-table-tr--dragging": this.table.isColReordering,
                } }, (shouldBeInert ? { inert: true } : {}), this.columnService.reorderEndEvents()), rows);
        };
        this.isFirstOfTheGroup = (column) => {
            let isFirst = false;
            this.table.columns.forEach((col) => {
                if (Array.isArray(col.group)) {
                    const group = this.getVisibleColumns(col.group);
                    if (group.length && group[0].id === column.id) {
                        isFirst = true;
                    }
                }
            });
            return isFirst;
        };
        this.getVisibleColumns = (children) => {
            const list = [];
            children.forEach((col) => {
                const column = this.columnService.getColumns().find((c) => c.id === col.id);
                if (column) {
                    list.push(column);
                }
            });
            return list;
        };
        this.isLastOfTheGroup = (column) => {
            let isLast = false;
            this.table.columns.forEach((col) => {
                if (Array.isArray(col.group)) {
                    const group = this.getVisibleColumns(col.group);
                    if (group.length && group[group.length - 1].id === column.id) {
                        isLast = true;
                    }
                }
            });
            return isLast;
        };
        this.getGroupClassName = (col) => {
            return {
                "dom-table__group-left-border": this.isFirstOfTheGroup(col),
                "dom-table__group-right-border": this.isLastOfTheGroup(col)
            };
        };
        this.table = self;
        this.columnService = columnService;
    }
}

class StickyHeaderService {
    constructor(self, columnService) {
        this.subscriptions = {};
        this.syncWidth = () => {
            if (!this.table.stickyHeader || !this.table.stickyHeaderRef || !this.table.tableWrapperRef) {
                return;
            }
            const stickyThList = Array.from(this.table.stickyHeaderRef.querySelectorAll("th"));
            const thList = Array.from(this.table.tableWrapperRef.querySelectorAll("th"));
            stickyThList.forEach((th, idx) => {
                const thEle = thList[idx];
                if (thEle) {
                    th.style.minWidth = `${thEle.offsetWidth}px`;
                }
            });
            this.table.stickyHeaderRef.style.width = this.table.tableWrapperRef.offsetWidth + "px";
        };
        // Sync horizontal scroll position between main table and sticky header
        this.syncScrollLeft = (event) => {
            if (!this.table.stickyHeaderRef)
                return;
            const scrollingElement = event.target;
            const scrollLeft = scrollingElement.scrollLeft;
            this.table.stickyHeaderRef.scrollLeft = scrollLeft;
        };
        this.handleStickyHeaderFixed = () => {
            if (this.table.stickyHeader && this.table.stickyHeaderRef && this.table.tableWrapperRef) {
                const thead = this.table.tableWrapperRef.querySelector('thead');
                const table = this.table.host;
                if (thead && table) {
                    this.syncWidth();
                    const { top } = thead.getBoundingClientRect();
                    const { bottom: tableBottom } = table.getBoundingClientRect();
                    const { height: stickyHeaderBottom } = this.table.stickyHeaderRef.getBoundingClientRect();
                    const computeStyle = window.getComputedStyle(this.table.host);
                    let offsetTop = 0;
                    if (computeStyle) {
                        offsetTop = parseInt(computeStyle.getPropertyValue("--sticky-header-top"), 10);
                    }
                    // Check if the stickyHeaderRef is within table bounds
                    if (top - offsetTop <= 0 && stickyHeaderBottom <= tableBottom - offsetTop) {
                        this.table.stickyHeaderRef.classList.add('dom-table__sticky-header-fixed');
                    }
                    else {
                        this.table.stickyHeaderRef.classList.remove('dom-table__sticky-header-fixed');
                    }
                }
            }
        };
        this.table = self;
        this.table.stickyHeaderService = this;
        this.columnService = columnService;
        this.subscriptions = {
            resize: {
                target: window,
                callback: this.syncWidth
            },
            scroll: {
                target: window,
                callback: this.handleStickyHeaderFixed,
                options: { capture: true, passive: true },
            }
        };
        columnService.subscriptions = Object.assign(Object.assign({}, columnService.subscriptions), this.subscriptions);
    }
}

class ColumnService {
    constructor(self) {
        this.pinLeftBorder = -1;
        this.pinRightBorder = -1;
        this.resizingColumn = undefined;
        this.resizingTh = undefined;
        this.subscriptions = {};
        this.findPinBorder = () => {
            var _a;
            this.pinLeftBorder = (_a = this.table.columns) === null || _a === void 0 ? void 0 : _a.filter(col => !col.hidden).findLastIndex((column) => (column === null || column === void 0 ? void 0 : column.pin) === "left");
            this.pinRightBorder = this.getColumns().findIndex((column) => (column === null || column === void 0 ? void 0 : column.pin) === "right");
        };
        this.setColPinShadow = () => {
            const target = this.table.host.shadowRoot.querySelector(".wrapper");
            if (target && "scrollLeft" in target) {
                const isPinRightShadow = this.scrollNotAtRight(target);
                const isPinLeftShadow = this.scrollNotAtLeft(target);
                this.table.host.style.setProperty('--col-pin-left-border-shadow', isPinLeftShadow ? "var(--col-pin-left-shadow)" : "none");
                this.table.host.style.setProperty('--col-pin-right-border-shadow', isPinRightShadow ? "var(--col-pin-right-shadow)" : "none");
            }
        };
        this.applyPinOffset = (pinCols, column, element, pin = "left") => {
            const leftOffset = pinCols
                .filter((col) => col.pin === pin && col.id !== column.id)
                .reduce((acc, column) => {
                let width = 0;
                if (isNumeric(column.width)) {
                    width = column.width;
                }
                let ele = this.table[`th-${column.id}`];
                if (!ele) {
                    ele = this.table.host.shadowRoot.querySelector(`th[data-id="${column.id}"]`);
                }
                if (ele) {
                    width = Math.max(ele.offsetWidth, width);
                }
                return acc += width;
            }, 0);
            element.style.setProperty(`--col-pin-${pin}-offset`, `${leftOffset}px`);
        };
        this.setPinOffset = (column, colIdx, element) => {
            if (!element)
                return;
            setTimeout(() => {
                if (column.pin === "left") {
                    const pinCols = this.getColumns().slice(0, colIdx + 1);
                    this.applyPinOffset(pinCols, column, element, "left");
                }
                else if (column.pin === "right") {
                    const pinCols = this.getColumns().slice(colIdx + 1).toReversed();
                    this.applyPinOffset(pinCols, column, element, "right");
                }
            });
        };
        this.setWidth = (column, element) => {
            if (typeof column.minWidth === "number") {
                element.style.minWidth = column.minWidth + "px";
            }
            if (typeof column.width === "number") {
                element.style.width = column.width + "px";
                element.style.minWidth = column.width + "px";
            }
            else if (typeof column.width === "string") {
                element.style.width = column.width;
                element.style.minWidth = column.width;
            }
            if (typeof column.maxWidth === "number") {
                element.style.maxWidth = column.maxWidth + "px";
            }
        };
        this.getPinClassName = (colIdx) => {
            return {
                "dom-table__col-pin-left-border": this.pinLeftBorder === colIdx,
                "dom-table__col-pin-right-border": this.pinRightBorder === colIdx,
            };
        };
        this.getColumns = () => {
            return this.table.columns.reduce((acc, column) => {
                if (Array.isArray(column.group)) {
                    const groupColumns = column.group.filter(col => !col.hidden);
                    if (column.hidden) {
                        return acc;
                    }
                    return [...acc, ...groupColumns];
                }
                else {
                    if (!column.hidden) {
                        acc.push(column);
                    }
                    return acc;
                }
            }, []);
        };
        this.resize = (e) => {
            var _a;
            if (this.resizingColumn) {
                const th = this.resizingTh;
                const newWidth = e.clientX - th.getBoundingClientRect().left + 2;
                const minWidth = this.resizingColumn.minWidth;
                if (isNumeric(minWidth) && newWidth < minWidth) {
                    return;
                }
                const maxWidth = this.resizingColumn.maxWidth;
                if (isNumeric(maxWidth) && maxWidth < newWidth) {
                    return;
                }
                this.resizingColumn.width = newWidth;
                th.style.minWidth = `${newWidth}px`;
                th.style.width = `${newWidth}px`;
            }
            if (["left", "right"].includes((_a = this.resizingColumn) === null || _a === void 0 ? void 0 : _a.pin)) {
                this.table.reRender = !this.table.reRender;
            }
        };
        this.cleanResize = () => {
            var _a;
            if (["left", "right"].includes((_a = this.resizingColumn) === null || _a === void 0 ? void 0 : _a.pin)) {
                this.table.reRender = !this.table.reRender;
            }
            if (this.resizingColumn) {
                this.table.columnResize.emit({
                    column: Object.assign({}, this.resizingColumn)
                });
            }
            setTimeout(() => {
                this.resizingColumn = undefined;
                this.resizingTh = undefined;
            });
        };
        this.handleSort = (column) => {
            const prop = column.prop || column.id;
            if (column.type === "string") {
                return (a, b) => {
                    var _a, _b;
                    const valA = (_a = a[prop]) !== null && _a !== void 0 ? _a : "";
                    const valB = (_b = b[prop]) !== null && _b !== void 0 ? _b : "";
                    if (column.order === "asc") {
                        return String(valA).localeCompare(String(valB));
                    }
                    else if (column.order === "desc") {
                        return String(valB).localeCompare(String(valA));
                    }
                    else {
                        return 0;
                    }
                };
            }
            else if (column.type === "number") {
                return (a, b) => {
                    const valA = Number(a[prop]);
                    const valB = Number(b[prop]);
                    if (isNaN(valA) || isNaN(valB))
                        return 0;
                    if (column.order === "asc") {
                        return valA - valB;
                    }
                    else if (column.order === "desc") {
                        return valB - valA;
                    }
                    else {
                        return 0;
                    }
                };
            }
            else if (column.type === "date") {
                return (a, b) => {
                    const dateA = new Date(a[prop]);
                    const dateB = new Date(b[prop]);
                    // @ts-ignore
                    if (isNaN(dateA) || isNaN(dateB))
                        return 0; // fail-safe for invalid dates
                    if (column.order === "asc") {
                        return dateA.getTime() - dateB.getTime();
                    }
                    else if (column.order === "desc") {
                        return dateB.getTime() - dateA.getTime();
                    }
                    else {
                        return 0;
                    }
                };
            }
        };
        this.subscribe = () => {
            for (const [key, value] of Object.entries(this.subscriptions)) {
                const { target, callback, options = {} } = value;
                target === null || target === void 0 ? void 0 : target.addEventListener(key, callback, options);
            }
        };
        this.rowLevelClick = (data) => (event) => {
            this.table.rowClick.emit({
                data,
                event,
                target: event.target
            });
        };
        this.getColumnPin = (columnId) => {
            if (!columnId)
                return undefined;
            const column = this.table.columns.find((col) => col.id === columnId);
            if (column)
                return column.pin;
            const group = this.table.groupService.getItemInGroup(columnId);
            return group === null || group === void 0 ? void 0 : group.pin;
        };
        this.table = self;
        this.reorderService = new ReorderService(self, this);
        this.table.rowReorderService = this.rowReorderService = new RowReorderService(self, this);
        this.table.groupService = new GroupService(self, this);
        this.subscriptions = {
            resize: {
                target: window,
                callback: this.setColPinShadow
            },
            mousemove: {
                target: document,
                callback: this.resize
            },
            mouseup: {
                target: document,
                callback: this.cleanResize
            },
        };
        if (this.table.stickyHeader) {
            new StickyHeaderService(this.table, this);
        }
        this.subscribe();
    }
    scrollNotAtRight(ele) {
        const scrollableWidth = ele.scrollWidth - ele.clientWidth;
        return Math.ceil(ele.scrollLeft) < scrollableWidth;
    }
    scrollNotAtLeft(ele) {
        return ele.scrollLeft > 0;
    }
    reorder(column, element) {
        this.reorderService.colReorder(column, element);
    }
    reorderEndEvents() {
        return this.reorderService.colsReorder();
    }
    sort(column, element) {
        element.onclick = (event) => {
            var _a;
            if (!column.sortable)
                return;
            const target = event.target;
            if (target.closest(".dom-table-header--bottom") ||
                target.closest(".dom-table__resizer") ||
                this.resizingColumn) {
                return;
            }
            if (!column.skipRotateOrder) {
                this.getColumns().forEach((col) => {
                    if (col === column) {
                        column.order = rotateOrder(column.order);
                    }
                    else {
                        col.order = undefined;
                    }
                });
            }
            let sortedData = undefined;
            if (column.type) {
                sortedData = (_a = [...this.table.data]) === null || _a === void 0 ? void 0 : _a.sort(this.handleSort(column));
            }
            this.table.customSort.emit({
                column,
                order: column.order,
                rotateOrder,
                data: sortedData,
                sortFn: this.handleSort
            });
        };
    }
    clearSubscriptions() {
        for (const [key, value] of Object.entries(this.subscriptions)) {
            const { target, callback, options = {} } = value;
            target === null || target === void 0 ? void 0 : target.removeEventListener(key, callback, options);
        }
    }
}

class TreeService {
    constructor(self) {
        this.renderTreeRow = ({ data, level, idx, children }) => {
            var _a;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            const isParent = Array.isArray(children);
            return (h("tr", { key: data.id, "aria-level": level + 1, "aria-setsize": isParent ? children.length || 1 : 1, "aria-posinset": idx + 1, "aria-expanded": isParent
                    ? this.table.opened.includes(data.id)
                        ? "true"
                        : "false"
                    : undefined, class: {
                    "dom-table__tree-children": level > 0,
                    "dom-table__row-selected": this.table.selected.includes(data.id),
                    "dom-table__row-level": this.table.rowLevel,
                }, ref: (ref) => {
                    if (ref) {
                        level === 0 && this.table.rowReorderService.rowReorder(data.id, ref);
                    }
                }, onClick: this.table.columnService.rowLevelClick(data), "data-id": data.id }, this.table.columnService.getColumns().map((column, colIdx) => {
                const isRowDrag = level === 0 && column.rowReorder;
                const className = column.noRows
                    ? {}
                    : this.table.columnService.getPinClassName(colIdx);
                return (h("td", { key: `row-${data.id}-column-${column.id}`, role: "gridcell", class: Object.assign({ [`dom-table__col-pin-${column.pin}`]: !column.noRows && !!column.pin, "dom-table__row-selected": this.table.selected.includes(data.id), "dom-table__td-align-center": column.align === "center", "dom-table__td-align-right": column.align === "right" }, className), ref: (ref) => {
                        ref && this.table.columnService.setPinOffset(column, colIdx, ref);
                    } },
                    h("slot", { name: `row-${data.id}-column-${column.id}` }, isRowDrag ? null : data[column.prop || column.id]),
                    isRowDrag &&
                        h("hbr-button", { size: "xsmall", variant: "text", class: "dom-table--row-drag-icon" },
                            h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix }))));
            })));
        };
        this.renderTreeList = ({ treeList, level, data }) => {
            if (level === 0) {
                treeList.push(this.renderTreeRow({
                    data,
                    level,
                    idx: 0,
                    children: data.children,
                }));
            }
            if (data.expandable && this.table.expanded.includes(data.id)) {
                treeList.push(h("tr", { key: `row-${data.id}-expandable`, "data-expandable-row": true },
                    h("td", { colSpan: this.table.columnService.getColumns().length },
                        h("slot", { name: `row-${data.id}-expandable` }))));
            }
            if (!this.table.opened.includes(data.id))
                return;
            level++;
            data.children.forEach((child, idx) => {
                treeList.push(this.renderTreeRow({
                    data: child,
                    idx,
                    children: data.children,
                    level,
                }));
                if (child.children) {
                    this.renderTreeList({
                        treeList,
                        data: child,
                        level,
                    });
                }
            });
        };
        this.getTree = () => {
            return this.table.data.map((data) => {
                const treeList = [];
                this.renderTreeList({
                    treeList,
                    data,
                    level: 0,
                });
                return treeList;
            });
        };
        this.table = self;
    }
}

const domTableCss = ":host{position:relative;color:var(--base-text-default);--vertical-align:top;--border-collapse:separate;--row-selected-bg-color:var(--control-bg-weak-active);--row-border-bottom-color:var(--control-border-weak-default);--row-hover-bg-color:var(--control-bg-medium-hover);--reorder-border-color:var(--control-border-active);--row-drag-icon-label-color:var(--interact-icon-weak-default);--row-drag-icon-label-color-hover:var(--interact-icon-weak-hover);--row-drag-icon-bg-color-hover:var(--control-bg-weak-active);--row-drag-from-bg-color:var(--control-bg-weak-active);--bg-color:var(--base-bg-weak-default);--pin-bg-color:var(--bg-color);--drag-image-bg-color:var(--control-bg-weak-active);--density-condensed:var(--hbr-spacing-2xs, 4px);--density-compact:var(--hbr-spacing-xs, 8px);--density-comfy:var(--hbr-spacing-sm, 12px);--density-spacious:var(--hbr-spacing-md, 16px);--font-size:var(--hbr-font-size-sm);--line-height:20px;--sortable-hover-bg-color:var(--control-bg-hover);--header-border-color:var(--control-border-strong-default);--header-cell-line-clamp:2;--header-gap:4px;--header-top-gap:var(--hbr-spacing-3xs, 2px);--sticky-header-top:var(--hbr-app-shift-top, 0px);--header-border-width:2px;--col-pin-left-offset:0px;--col-pin-right-offset:0px;--col-pin-border-color:var(--control-border-weak-default);--col-pin-left-z-index:1;--col-pin-right-z-index:2;--col-pin-left-shadow:inset 10px 0 8px -8px var(--shadow-colors-lifted);--col-pin-right-shadow:inset -10px 0 8px -8px var(--shadow-colors-lifted);--col-pin-left-border-shadow:var(--col-pin-left-shadow);--col-pin-right-border-shadow:var(--col-pin-right-shadow);--resizer-width:4px;--resizable-bg-color:var(--control-bg-strong-hover);--group-header-bg-color:var(--base-bg-medium-default);--group-header-border-color:var(--base-border-strong-default);--group-header-border-color:var(--base-border-strong-default);--group-header-bg-color-hover:var(--control-bg-medium-focus);--tree-bg-color:var(--base-bg-default);--sort-icon-default-fill:var(--interact-icon-weak-hover)}:host .dom-table--auto-layout{width:100%}:host .wrapper{position:relative;overflow:auto}:host .left-border{pointer-events:none;content:\"\";position:absolute;z-index:2;top:0;bottom:0;width:8px;box-shadow:var(--col-pin-left-border-shadow)}:host .right-border{pointer-events:none;content:\"\";position:absolute;z-index:2;top:0;bottom:0;width:8px;right:0;box-shadow:var(--col-pin-right-border-shadow)}:host{color:var(--base-text-default);--header-height:36px;--row-height:37px;--cell-padding:var(--hbr-spacing-xs, 8px)}.dom-table--density-condensed th,.dom-table--density-condensed td{padding:var(--density-condensed)}.dom-table--density-compact th,.dom-table--density-compact td{padding:var(--density-compact)}.dom-table--density-comfy th,.dom-table--density-comfy td{padding:var(--density-comfy)}.dom-table--density-spacious th,.dom-table--density-spacious td{padding:var(--density-spacious)}.dom-table-header--sortable{cursor:pointer}.dom-table-header--sortable:hover{background-color:var(--sortable-hover-bg-color)}.dom-table-header--sortable:hover .dom-table__sort-button .dom-table-header__sort-icon-default{opacity:1}.dom-table-header--sortable:has(slot[name$=-suffix]:focus-within) .dom-table__sort-button .dom-table-header__sort-icon-default{opacity:1}.dom-table-header--top slot[name$=-suffix]::slotted(*){min-height:20px;display:flex;align-items:center}.dom-table-header--sortable .dom-table-header--top:hover .dom-table-header__sort-icon{opacity:1}.dom-table-header__sort-icon{transition:opacity 0.1s linear;width:20px;height:20px;flex-shrink:0px}.dom-table__sort-button:not(:focus) .dom-table-header__sort-icon-default{opacity:0}.dom-table__sort-button:has(.dom-table-header__sort-icon){height:20px;border-radius:var(--hbr-border-radius-sm);min-width:fit-content}.dom-table__sort-button:has(.dom-table-header__sort-icon):focus{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.dom-table-header--align-right .dom-table__sort-button:not(:focus) .dom-table-header__sort-icon-default{opacity:1}.dom-table-header--align-right:has(.dom-table-header__sort-icon-default){padding-inline-start:20px}.dom-table-header--align-right .dom-table__sort-button:has(.dom-table-header__sort-icon-default){min-width:0;width:0}.dom-table-header--sortable:hover .dom-table-header--align-right:has(.dom-table-header__sort-icon-default),.dom-table-header--align-right:focus-within:has(.dom-table-header__sort-icon-default){padding-inline-start:0}.dom-table-header--sortable:hover .dom-table-header--align-right:has(.dom-table-header__sort-icon-default) .dom-table__sort-button:has(.dom-table-header__sort-icon-default),.dom-table-header--align-right:focus-within:has(.dom-table-header__sort-icon-default) .dom-table__sort-button:has(.dom-table-header__sort-icon-default){width:20px}.dom-table-header__sort-icon-default{--path-color-0:var(--sort-icon-default-fill);--path-color-1:var(--sort-icon-default-fill);--path-color-default:var(--path-color-0);--path-color-weak:var(--path-color-1)}.dom-table-header__sort-icon--asc{--path-color-0:var(--control-icon-weak-disabled);--path-color-1:var(--control-icon-weak-default);--path-color-default:var(--path-color-0);--path-color-weak:var(--path-color-1)}.dom-table-header__sort-icon--desc{--path-color-0:var(--control-icon-weak-default);--path-color-1:var(--control-icon-weak-disabled);--path-color-weak:var(--path-color-0);--path-color-default:var(--path-color-1)}.dom-table__sort-button{background:none;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;overflow:hidden;display:flex;line-height:20px;text-align:left;text-overflow:ellipsis;word-wrap:break-word;-webkit-box-orient:vertical;-webkit-line-clamp:var(--header-cell-line-clamp)}.dom-table-header{display:flex;flex-direction:column}.dom-table-header-gap{gap:var(--header-gap)}.dom-table-header--align-left{justify-content:flex-start}.dom-table-header--align-center{justify-content:center}.dom-table-header--align-right{justify-content:flex-end}.dom-table-header--top{display:flex;align-items:flex-start;flex-flow:row;flex:0 1 auto;gap:var(--header-top-gap)}.dom-table__td-align-center{text-align:center}.dom-table__td-align-right{text-align:right}.dom-table-header--resizing{cursor:col-resize;user-select:none}.dom-table__resizer{position:absolute;width:var(--resizer-width);height:100%;top:0;right:0;bottom:0;opacity:0;background:var(--resizable-bg-color);cursor:col-resize;z-index:5}.dom-table__resizer:hover{opacity:1}table.dom-table--row-reordering{--border-collapse:collapse}table.dom-table--col-reordering{--border-collapse:separate}table{text-indent:initial;position:relative;border-spacing:0;box-sizing:border-box;border-collapse:var(--border-collapse);background-color:var(--bg-color)}table th{font-weight:var(--hbr-font-weight-bold);position:relative}table th:not(.dom-table__group-th){text-align:left;border-bottom:var(--header-border-width) solid var(--header-border-color)}table th.dom-table__group-th{text-align:center}table th.dom-table__group-header{background-color:var(--group-header-bg-color);border:1px solid var(--group-header-border-color);border-bottom:var(--header-border-width) solid var(--group-header-border-color)}table th.dom-table__group-left-border{border-left:1px solid var(--group-header-border-color)}table th.dom-table__group-right-border{border-right:1px solid var(--group-header-border-color)}table th.dom-table__group-reorderable:hover{cursor:grab;background-color:var(--group-header-bg-color-hover)}table td{border-bottom:1px solid var(--row-border-bottom-color)}table td,table th{font-size:var(--font-size);line-height:var(--line-height);vertical-align:var(--vertical-align);box-sizing:border-box;background-color:var(--bg-color)}table tr.dom-table__row-level:hover td{background-color:var(--row-hover-bg-color)}table tr[data-expandable-row] td{padding:0}.dom-table__tree-children td,.dom-table__tree-children td.colPinRight{background:var(--tree-bg-color)}.dom-table__row-selected td,.dom-table__row-selected td.colPinRight{background:var(--row-selected-bg-color)}.dom-table__col-pin-left{background:var(--pin-bg-color);position:sticky;left:var(--col-pin-left-offset);z-index:var(--col-pin-left-z-index);clip-path:inset(0 -15px 0 0)}.dom-table__col-pin-left-border{border-right:1px solid var(--col-pin-border-color)}.dom-table__col-pin-left-border::after{pointer-events:none;content:\"\";position:absolute;top:0;right:0;bottom:0;transform:translate(100%);width:30px;box-shadow:var(--col-pin-left-border-shadow)}.dom-table__col-pin-right{background:var(--pin-bg-color);position:sticky;right:var(--col-pin-right-offset);z-index:var(--col-pin-right-z-index)}.dom-table__col-pin-right-border{border-left:1px solid var(--col-pin-border-color)}.dom-table__col-pin-right-border::before{clip-path:inset(0px 0px 0px -10px);box-sizing:border-box;pointer-events:none;content:\"\";position:absolute;top:0;bottom:0;left:0;transform:translate(-100%);width:30px;box-shadow:var(--col-pin-right-border-shadow)}.dom-table__empty .dom-table__empty-row td{padding:0}table tr.dom-table-tr-top--dragging{border-top:2px solid var(--reorder-border-color)}table tr.dom-table-tr-bottom--dragging{border-bottom:2px solid var(--reorder-border-color)}table .dom-table--row-drag-icon:hover{cursor:move}table.dom-table--row-reordering *{cursor:grabbing}table .dom-table--row-reordering-from td{background:var(--row-drag-from-bg-color)}[data-drag-image]{position:absolute;top:0;background:var(--drag-image-bg-color);box-shadow:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, 0.08));left:-9999px;height:100%;z-index:10}[data-drag-image].hide{display:none}[data-drag-image]:hover{cursor:copy}table tr:hover.dom-table-tr--dragging *{cursor:copy}table tr.dom-table-tr--dragging th.col-reorder-left{border-left:2px solid var(--reorder-border-color)}table tr.dom-table-tr--dragging th.col-reorder-right{border-right:2px solid var(--reorder-border-color)}table .dom-table-tr--dragging th.col-dragging{background-color:var(--sortable-hover-bg-color)}hbr-button[size=xsmall]{--hbr-control-height-xs:20px;--label-color:var(--row-drag-icon-label-color);--label-color-hover:var(--row-drag-icon-label-color-hover);--bg-color-hover:var(--row-drag-icon-bg-color-hover)}.dom-table__group-right-border+.dom-table__group-left-border,.dom-table__group-header+.dom-table__group-header{border-left:0}.dom-table__sticky-header{position:absolute;z-index:3;top:0px}.dom-table__sticky-header-fixed{overflow:hidden;position:fixed;top:var(--sticky-header-top)}.wrapper__sticky-header thead tr:not(.dom-table__sticky-header tr)[inert]{opacity:0;pointer-events:none}";
const HbrDomTableStyle0 = domTableCss;

const DomTable = /*@__PURE__*/ proxyCustomElement(class DomTable extends HTMLElement$1 {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.rowReorderDrop = createEvent(this, "hbr-row-reorder", 7);
        this.reorderDrop = createEvent(this, "hbr-column-reorder", 7);
        this.columnResize = createEvent(this, "hbr-column-resize", 7);
        this.customSort = createEvent(this, "hbr-sort", 7);
        this.rowClick = createEvent(this, "hbr-row-click", 7);
        this.desnitySize = {
            condensed: 4,
            compact: 8,
            comfy: 12,
            spacious: 16,
        };
        this.renderHeaderRows = (isSticky = false) => {
            const slotPrefix = isSticky && this.stickyHeader ? "sticky-" : "";
            const shouldBeInert = this.stickyHeader && !isSticky;
            return [
                this.groupService.renderGroup(isSticky),
                h("tr", Object.assign({ class: { "dom-table-tr--dragging": this.isColReordering } }, this.columnService.reorderEndEvents(), (shouldBeInert ? { inert: true } : {})), this.columnService.getColumns().map((column, colIdx) => {
                    var _a;
                    return (h("th", { key: `column-${column.id}`, role: column.noRows ? "none" : null, "data-id": column.id, "aria-hidden": column.id === "empty" ? "true" : undefined, class: Object.assign(Object.assign({ [`dom-table__col-pin-${column.pin}`]: !!column.pin, "dom-table-header--sortable": column.sortable, "dom-table-header--resizable": column.resizable, "dom-table-header--resizing": column === this.columnService.resizingColumn }, this.columnService.getPinClassName(colIdx)), this.groupService.getGroupClassName(column)), ref: (ref) => {
                            if (ref) {
                                this[`th-${column.id}`] = ref;
                                this.columnService.setPinOffset(column, colIdx, ref);
                                this.columnService.setWidth(column, ref);
                                this.columnService.reorder(column, ref);
                                this.columnService.sort(column, ref);
                            }
                        }, "aria-sort": column.order === "asc"
                            ? "ascending"
                            : column.order === "desc"
                                ? "descending"
                                : null }, h("slot", { name: `${slotPrefix}column-${column.id}-th` }, h("div", { part: "base", class: {
                            "dom-table-header": true,
                            "dom-table-header-gap": ((_a = this.host) === null || _a === void 0 ? void 0 : _a.querySelector(`[slot="${slotPrefix}column-${column.id}-bottom"]`)) !== null,
                        } }, h("div", { class: {
                            "dom-table-header--top": true,
                            "dom-table-header--align-left": !column.align,
                            "dom-table-header--align-center": column.align === "center",
                            "dom-table-header--align-right": column.align === "right",
                        } }, h("slot", { name: `${slotPrefix}column-${column.id}-prefix` }), column.sortable ? (h("button", { type: "button", part: "sort-button", "data-testid": "sort-button", class: "dom-table__sort-button", tabIndex: -1, id: `${slotPrefix}column-${column.id}-sort-button-text` }, h("slot", { name: `${slotPrefix}column-${column.id}` }, column.name))) : (h("slot", { name: `${slotPrefix}column-${column.id}` }, column.name)), h("slot", { name: `${slotPrefix}column-${column.id}-suffix` }), h("slot", { name: `${slotPrefix}column-${column.id}-sort-icon` }, column.sortable && (h("button", { type: "button", class: "dom-table__sort-button", "aria-labelledby": `${slotPrefix}column-${column.id}-sort-button-text`, "data-testid": "sort-icon-button" }, h("hbr-icon", { class: {
                            "dom-table-header__sort-icon": true,
                            "dom-table-header__sort-icon-default": !column.order,
                            "dom-table-header__sort-icon--asc": column.order === "asc",
                            "dom-table-header__sort-icon--desc": column.order === "desc",
                        }, asset: getIconAsset(column.order) }))))), h("div", { class: "dom-table-header--bottom", onClick: (event) => {
                            event.stopPropagation();
                        } }, h("slot", { name: `${slotPrefix}column-${column.id}-bottom` })), column.resizable && (h("span", { part: "resizer", class: "dom-table__resizer", "data-resize": "true", onMouseDown: (event) => {
                            const th = event.target.closest("th");
                            this.columnService.resizingTh = th;
                            this.columnService.resizingColumn = column;
                        } }))))));
                })),
            ];
        };
        this.renderHeader = () => {
            return (h("thead", { part: "thead" }, this.renderHeaderRows(), this.stickyHeader && (h("div", { ref: (el) => {
                    this.stickyHeaderRef = el;
                }, class: "dom-table__sticky-header" }, this.renderHeaderRows(true)))));
        };
        this.renderRows = () => {
            var _a;
            if (this.tree) {
                return this.treeService.getTree();
            }
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            const list = [];
            const columns = this.columnService.getColumns();
            for (let i = 0; i < this.data.length; i++) {
                const id = this.data[i].id;
                list.push(h("tr", { key: `row-${id}`, class: {
                        "dom-table__row-selected": this.selected.includes(id),
                        "dom-table__row-level": this.rowLevel,
                    }, onClick: this.columnService.rowLevelClick(this.data[i]), ref: (ref) => {
                        if (ref) {
                            this.rowReorderService.rowReorder(id, ref);
                        }
                    }, "data-id": id }, columns.map((column, colIdx) => {
                    const className = column.noRows
                        ? {}
                        : this.columnService.getPinClassName(colIdx);
                    return (h("td", { "aria-hidden": column.id === "empty" || column.noRows ? "true" : undefined, key: `row-${id}-column-${column.id}`, class: Object.assign({ "dom-table__td-align-center": column.align === "center", "dom-table__td-align-right": column.align === "right", [`dom-table__col-pin-${column.pin}`]: !column.noRows && !!column.pin }, className), ref: (ref) => {
                            ref && this.columnService.setPinOffset(column, colIdx, ref);
                        } }, h("slot", { name: `row-${id}-column-${column.id}` }, this.data[i][column.prop || column.id]), column.rowReorder && (h("hbr-button", { size: "xsmall", variant: "text", class: "dom-table--row-drag-icon" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix })))));
                })));
                if (this.data[i].expandable && this.expanded.includes(id)) {
                    list.push(h("tr", { key: `row-${id}-expandable`, "data-expandable-row": true }, h("td", { colSpan: this.columnService.getColumns().length }, h("slot", { name: `row-${id}-expandable` }))));
                }
            }
            return list;
        };
        this.isColReordering = undefined;
        this.reRender = false;
        this.autoLayout = false;
        this.columns = [];
        this.data = [];
        this.tree = false;
        this.opened = [];
        this.selected = [];
        this.shiftSelection = false;
        this.selectionColumn = "selectable";
        this.expanded = [];
        this.rowLevel = false;
        this.aria = {
            label: "",
        };
        this.density = "compact";
        this.stickyHeader = false;
    }
    disconnectedCallback() {
        if (this.columnService) {
            this.columnService.clearSubscriptions();
        }
    }
    componentWillLoad() {
        this.columnService = new ColumnService(this);
    }
    componentWillRender() {
        if (this.tree) {
            this.treeService = new TreeService(this);
        }
        this.columnService.findPinBorder();
    }
    componentDidRender() {
        this.columnService.setColPinShadow();
        this.stickyHeader && this.stickyHeaderService.syncWidth();
    }
    render() {
        var _a, _b;
        return (h(Host, { key: 'f1164969901f2588332644af5bcb4d06addf290a' }, h("div", { key: 'ea4a9d9d88056141b4e709e79ac135c4956a2575', part: "left-border", class: { "left-border": this.columnService.pinLeftBorder === -1 } }), h("div", { key: '51eeb924648dcc64ec39fdfd249ed5af33780427', part: "base", class: {
                wrapper: true,
                "wrapper__sticky-header": this.stickyHeader,
            }, ref: (el) => {
                this.tableWrapperRef = el;
            }, onScroll: (e) => {
                if (this.stickyHeader) {
                    // Only handle horizontal scroll sync
                    this.stickyHeaderService.syncScrollLeft(e);
                }
            } }, h("table", { key: 'c615d11c96d23a99a908e886951b2866ab59827a', part: "table", role: this.tree ? "treegrid" : undefined, "aria-label": ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) ? (_b = this.aria) === null || _b === void 0 ? void 0 : _b.label : undefined, class: {
                [`dom-table--density-${this.density}`]: true,
                "dom-table--auto-layout": this.autoLayout,
                "dom-table__empty": !this.data.length,
            } }, this.renderHeader(), h("tbody", Object.assign({ key: 'e6bcc7d815bbf6011d0c6987c5ce750be81ea1d7', part: "tbody" }, this.rowReorderService.dropEvent()), this.data.length ? (this.renderRows()) : (h("tr", { class: "dom-table__empty-row" }, h("td", { colSpan: this.columnService.getColumns().length }, h("slot", { name: "empty" }))))))), h("div", { key: 'af52c35fd404d209b58a972e5d94461620e926b3', "data-drag-image": true }), h("slot", { key: 'dd224577c5ef4ba51ae0fae917d82938c6d1305c', name: "service" }, this.shiftSelection && (h("hbr-shift-selection", { selected: this.selected, selectionColumn: this.selectionColumn }))), h("div", { key: 'a1717b3ebc80e24d46e49c89e9f5d9e8d664df2b', part: "right-border", class: { "right-border": this.columnService.pinRightBorder === -1 } })));
    }
    get host() { return this; }
    static get style() { return HbrDomTableStyle0; }
}, [1, "hbr-dom-table", {
        "autoLayout": [516, "auto-layout"],
        "columns": [16],
        "data": [16],
        "tree": [516],
        "opened": [16],
        "selected": [16],
        "shiftSelection": [516, "shift-selection"],
        "selectionColumn": [1, "selection-column"],
        "expanded": [16],
        "rowLevel": [516, "row-level"],
        "aria": [16],
        "density": [513],
        "stickyHeader": [516, "sticky-header"],
        "isColReordering": [32],
        "reRender": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-dom-table", "hbr-button", "hbr-icon", "hbr-shift-selection", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-dom-table":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DomTable);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-shift-selection":
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

const HbrDomTable = DomTable;
const defineCustomElement = defineCustomElement$1;

export { HbrDomTable, defineCustomElement };

