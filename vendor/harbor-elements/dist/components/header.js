import { h, Fragment, proxyCustomElement, HTMLElement, createEvent } from '@stencil/core/internal/client';
import { d as debounce, e as each, k as keyBy } from './function-helper.js';
import { a as getItemByPosition, g as getItemByIndex } from './dimension.helpers.js';
import { M as MIN_COL_SIZE, H as HEADER_CLASS, e as HEADER_ROW_CLASS, F as FOCUS_CLASS, f as HEADER_SORTABLE_CLASS, c as DATA_COL, g as HEADER_ACTUAL_ROW_CLASS } from './consts.js';
import { C as ColumnService, p as getElement } from './columnService.js';
import { a as FilterButton } from './filter.button.js';
import { d as defineCustomElement$2 } from './header2.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

class BasePlugin {
    constructor(hbrtable) {
        this.hbrtable = hbrtable;
        this.subscriptions = {};
    }
    addEventListener(name, func) {
        this.hbrtable.addEventListener(name, func);
        this.subscriptions[name] = func;
    }
    removeEventListener(type) {
        this.hbrtable.removeEventListener(type, this.subscriptions[type]);
        delete this.subscriptions[type];
    }
    emit(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            cancelable: true,
        });
        this.hbrtable.dispatchEvent(event);
        return event;
    }
    clearSubscriptions() {
        for (const type in this.subscriptions) {
            this.removeEventListener(type);
        }
    }
    destroy() {
        this.clearSubscriptions();
    }
}

class GroupingColumnPlugin extends BasePlugin {
    static gatherGroup(res, colData, collection, level = 0) {
        // group template
        const group = Object.assign(Object.assign({}, colData), { level, ids: [] });
        // check columns for update
        for (const k in collection.columns) {
            const key = k;
            const resultItem = res.columns[key];
            // [] to be type safe
            const collectionItem = collection.columns[key] || [];
            // if column data
            if (Array.isArray(resultItem) && Array.isArray(collectionItem)) {
                // fill columns
                resultItem.push(...collectionItem);
                // fill grouping
                if (collectionItem.length) {
                    res.columnGrouping[key].push(Object.assign(Object.assign({}, group), { ids: collectionItem.map((i) => i.prop) }));
                }
            }
        }
        // merge column groupings
        for (const k in collection.columnGrouping) {
            const key = k;
            const collectionItem = collection.columnGrouping[key];
            res.columnGrouping[key].push(...collectionItem);
        }
        res.maxLevel = Math.max(res.maxLevel, collection.maxLevel);
        return res;
    }
    static isColGrouping(colData) {
        return !!colData.children;
    }
}
function isColGrouping(colData) {
    return !!colData.children;
}

/**
 * Dispatch custom event to element
 */
function dispatch(target, eventName, detail) {
    const event = new CustomEvent(eventName, {
        detail,
        cancelable: true,
        bubbles: true,
    });
    target === null || target === void 0 ? void 0 : target.dispatchEvent(event);
    return event;
}

const COLUMN_DRAG_CLASS = "column-drag-start";
class ColumnOrderHandler {
    constructor() {
        this.offset = 0;
    }
    renderAutoscroll(_, parent) {
        if (!parent) {
            return;
        }
        this.autoscrollEl = document.createElement("div");
        this.autoscrollEl.classList.add("drag-auto-scroll-y");
        parent.appendChild(this.autoscrollEl);
    }
    autoscroll(pos, dataContainerSize, direction = "translateX") {
        if (!this.autoscrollEl) {
            return;
        }
        const helperOffset = 10;
        // calculate current y position inside of the grid active holder
        // 3 - size of element + border
        const maxScroll = Math.min(pos + helperOffset, dataContainerSize - 3);
        this.autoscrollEl.style.transform = `${direction}(${maxScroll}px)`;
        this.autoscrollEl.scrollIntoView({
            block: "nearest",
            inline: "nearest",
        });
    }
    start(e, { dataEl, gridRect, scrollEl, }, dir = "left") {
        const scrollContainerRect = scrollEl.getBoundingClientRect();
        if (scrollContainerRect) {
            this.offset = scrollContainerRect[dir] - gridRect[dir];
        }
        this.renderAutoscroll(e, dataEl);
    }
    stop(gridEl) {
        var _a;
        gridEl.classList.remove(COLUMN_DRAG_CLASS);
        if (this.element) {
            this.element.hidden = true;
        }
        this.offset = 0;
        (_a = this.autoscrollEl) === null || _a === void 0 ? void 0 : _a.remove();
        this.autoscrollEl = undefined;
    }
    showHandler(pos, size, direction = "translateX", width = 144) {
        if (!this.element) {
            return;
        }
        // do not allow overcross top of the scrollable area, header excluded
        if (this.offset) {
            pos = Math.max(pos, this.offset);
        }
        // can not be bigger then grid end
        pos = Math.min(pos, size);
        this.element.hidden = false;
        this.element.style.width = width + "px";
        this.element.style.transform = `${direction}(${pos}px)`;
    }
    render() {
        return (h("div", { class: "hbr-table-drag-position-y", hidden: true, ref: (el) => (this.element = el) }));
    }
}

/**
 * Plugin for column manual move
 */
const COLUMN_CLICK = "column-click";
const MOVE = "column-mouse-move";
const DRAG_END = "column-drag-end";
const BEFORE_DRAG_END = "before-column-drag-end";
const COLUMN_DRAG_LEFT_CLASS = "column-drag-left";
const COLUMN_DRAG_RIGHT_CLASS = "column-drag-right";
const COLUMN_DRAGGING = "column-dragging";
// use this event subscription to drop D&D for particular columns
const DRAG_START = "column-drag-start";
class ColumnPlugin extends BasePlugin {
    constructor(revogrid, providers) {
        super(revogrid);
        this.revogrid = revogrid;
        this.providers = providers;
        this.moveFunc = debounce((e) => this.doMove(e), 5);
        this.staticDragData = null;
        this.dragData = null;
        this.lastDragItem = null;
        this.localSubscriptions = {};
        this.orderUi = new ColumnOrderHandler();
        revogrid.registerVNode([this.orderUi.render()]);
        revogrid.classList.add("column-draggable");
        /** Register events */
        this.localSubscriptions.mouseleave = {
            target: document,
            callback: (e) => this.onMouseOut(e),
        };
        this.localSubscriptions.mouseup = {
            target: document,
            callback: (e) => this.onMouseUp(e),
        };
        this.localSubscriptions.mousemove = {
            target: document,
            callback: (e) => this.move(e),
        };
        this.addEventListener(COLUMN_CLICK, ({ detail }) => this.dragStart(detail));
    }
    dragStart({ event, data }) {
        if (event.defaultPrevented) {
            return;
        }
        const { defaultPrevented } = dispatch(this.revogrid, DRAG_START, data);
        // check if allowed to drag particular column
        if (defaultPrevented) {
            return;
        }
        this.clearOrder();
        const { mouseleave, mouseup, mousemove } = this.localSubscriptions;
        mouseleave.target.addEventListener("mouseleave", mouseleave.callback);
        mouseup.target.addEventListener("mouseup", mouseup.callback);
        const headerCell = event.target.closest(".rgHeaderCell");
        if (headerCell) {
            this.lastDragItem = headerCell;
            headerCell.classList.add(COLUMN_DRAGGING);
        }
        const dataEl = event.target.closest("hbr-table-header");
        const scrollEl = event.target.closest("hbr-viewport-scroll");
        if (!dataEl || !scrollEl) {
            return;
        }
        if (isColGrouping(data)) {
            return;
        }
        const cols = this.getDimension(data.pin || "rgCol");
        const gridRect = this.revogrid.getBoundingClientRect();
        const elRect = dataEl.getBoundingClientRect();
        const startItem = getItemByPosition(cols, getLeftRelative(event.x, gridRect.left, elRect.left - gridRect.left));
        this.staticDragData = {
            startPos: event.x,
            startItem,
            data,
            dataEl,
            scrollEl,
            gridEl: this.revogrid,
            cols,
        };
        this.dragData = this.getData(this.staticDragData);
        mousemove.target.addEventListener("mousemove", mousemove.callback);
        this.orderUi.start(event, Object.assign(Object.assign({}, this.dragData), this.staticDragData));
    }
    doMove(e) {
        if (!this.staticDragData) {
            return;
        }
        this.staticDragData.gridEl.classList.add(COLUMN_DRAG_CLASS);
        this.staticDragData.gridEl.classList.remove(COLUMN_DRAG_LEFT_CLASS);
        this.staticDragData.gridEl.classList.remove(COLUMN_DRAG_RIGHT_CLASS);
        const dragData = (this.dragData = this.getData(this.staticDragData));
        if (!dragData) {
            return;
        }
        const start = this.staticDragData.startPos;
        if (Math.abs(start - e.x) > 10) {
            const x = getLeftRelative(e.x, this.dragData.gridRect.left, this.dragData.scrollOffset);
            const rgCol = getItemByPosition(this.staticDragData.cols, x);
            if (this.staticDragData.startItem.itemIndex > rgCol.itemIndex) {
                this.staticDragData.gridEl.classList.add(COLUMN_DRAG_LEFT_CLASS);
            }
            else {
                this.staticDragData.gridEl.classList.add(COLUMN_DRAG_RIGHT_CLASS);
            }
            this.orderUi.autoscroll(x, dragData.elRect.width);
            this.orderUi.showHandler(e.clientX - dragData.gridRect.left + 10, dragData.gridRect.width, "translateX");
        }
    }
    move(e) {
        dispatch(this.revogrid, MOVE, Object.assign({}, e));
        // then do move
        this.moveFunc(e);
    }
    onMouseOut(_) {
        this.clearOrder();
    }
    onMouseUp(e) {
        var _a;
        // apply new positions
        (_a = this.lastDragItem) === null || _a === void 0 ? void 0 : _a.classList.remove(COLUMN_DRAGGING);
        this.staticDragData.gridEl.classList.remove(COLUMN_DRAG_LEFT_CLASS);
        this.staticDragData.gridEl.classList.remove(COLUMN_DRAG_RIGHT_CLASS);
        if (this.dragData) {
            let relativePos = getLeftRelative(e.x, this.dragData.gridRect.left, this.dragData.scrollOffset);
            if (relativePos < 0) {
                relativePos = 0;
            }
            const newPosition = getItemByPosition(this.staticDragData.cols, relativePos);
            const store = this.providers.column.stores[this.dragData.type].store;
            const items = [...store.get("items")];
            // prevent position change if needed
            const { defaultPrevented: stopDrag } = dispatch(this.revogrid, BEFORE_DRAG_END, Object.assign(Object.assign({}, this.staticDragData), { startPosition: this.staticDragData.startItem, newPosition, newItem: store.get("source")[items[this.staticDragData.startItem.itemIndex]] }));
            if (!stopDrag) {
                // todo: if move item out of group remove item from group
                const toMove = items.splice(this.staticDragData.startItem.itemIndex, 1);
                items.splice(newPosition.itemIndex, 0, ...toMove);
                store.set("items", items);
            }
            dispatch(this.revogrid, DRAG_END, this.dragData);
        }
        this.clearOrder();
    }
    clearLocalSubscriptions() {
        each(this.localSubscriptions, ({ target, callback }, key) => target.removeEventListener(key, callback));
    }
    clearOrder() {
        this.staticDragData = null;
        this.dragData = null;
        this.clearLocalSubscriptions();
        this.orderUi.stop(this.revogrid);
    }
    /**
     * Clearing subscription
     */
    clearSubscriptions() {
        super.clearSubscriptions();
        this.clearLocalSubscriptions();
    }
    getData({ gridEl, dataEl, data }) {
        const gridRect = gridEl.getBoundingClientRect();
        const elRect = dataEl.getBoundingClientRect();
        const scrollOffset = elRect.left - gridRect.left;
        return {
            elRect,
            gridRect,
            type: data.pin || "rgCol",
            scrollOffset,
        };
    }
    getDimension(type) {
        return this.providers.dimension.stores[type].getCurrentState();
    }
}
function getLeftRelative(absoluteX, gridPos, offset) {
    return absoluteX - gridPos - offset;
}

var ResizeEvents;
(function (ResizeEvents) {
    ResizeEvents["start"] = "resize:start";
    ResizeEvents["move"] = "resize:move";
    ResizeEvents["end"] = "resize:end";
})(ResizeEvents || (ResizeEvents = {}));
const RESIZE_MASK = {
    "resizable-r": { bit: 0b0001, cursor: "ew-resize" },
    "resizable-rb": { bit: 0b0011, cursor: "se-resize" },
    "resizable-b": { bit: 0b0010, cursor: "s-resize" },
    "resizable-lb": { bit: 0b0110, cursor: "sw-resize" },
    "resizable-l": { bit: 0b0100, cursor: "w-resize" },
    "resizable-lt": { bit: 0b1100, cursor: "nw-resize" },
    "resizable-t": { bit: 0b1000, cursor: "n-resize" },
    "resizable-rt": { bit: 0b1001, cursor: "ne-resize" },
};
const DISABLE_MASK = {
    l: 0b0001,
    t: 0b0010,
    w: 0b0100,
    h: 0b1000,
};
const defaultProps = (props) => {
    return Object.assign(Object.assign({}, props), { fitParent: props.fitParent || false, active: props.active || [], disableAttributes: props.disableAttributes || [], minWidth: props.minWidth || 0, minHeight: props.minHeight || 0 });
};
class ResizeDirective {
    constructor(initialProps, $event) {
        this.initialProps = initialProps;
        this.$event = $event;
        this.mouseX = 0;
        this.mouseY = 0;
        this.width = 0;
        this.height = 0;
        this.changeX = 0;
        this.changeY = 0;
        this.disableCalcMap = 0b1111;
        this.props = defaultProps(initialProps);
        this.mouseMoveFunc = this.handleMove.bind(this);
        this.mouseUpFunc = this.handleUp.bind(this);
        this.minW = this.props.minWidth;
        this.minH = this.props.minHeight;
        this.maxW = this.props.maxWidth;
        this.maxH = this.props.maxHeight;
        this.parent = { width: 0, height: 0 };
        this.resizeState = 0;
    }
    set($el) {
        this.$el = $el;
        this.props.disableAttributes.forEach((attr) => {
            switch (attr) {
                case "l":
                    this.disableCalcMap &= ~DISABLE_MASK.l;
                    break;
                case "t":
                    this.disableCalcMap &= ~DISABLE_MASK.t;
                    break;
                case "w":
                    this.disableCalcMap &= ~DISABLE_MASK.w;
                    break;
                case "h":
                    this.disableCalcMap &= ~DISABLE_MASK.h;
            }
        });
    }
    emitEvent(eventName, additionalOptions) {
        if (!this.$event) {
            return;
        }
        this.$event(Object.assign({ eventName, width: this.width + this.changeX, height: this.height + this.changeY, changedX: this.changeX, changedY: this.changeY }, additionalOptions));
    }
    static isTouchEvent(e) {
        var _a;
        const event = e;
        return ((_a = event.touches) === null || _a === void 0 ? void 0 : _a.length) >= 0;
    }
    handleMove(event) {
        if (!this.resizeState) {
            return;
        }
        let eventY;
        let eventX;
        if (ResizeDirective.isTouchEvent(event)) {
            eventY = event.touches[0].clientY;
            eventX = event.touches[0].clientX;
        }
        else {
            eventY = event.clientY;
            eventX = event.clientX;
        }
        const isX = this.resizeState & RESIZE_MASK["resizable-r"].bit ||
            this.resizeState & RESIZE_MASK["resizable-l"].bit;
        const isY = this.resizeState & RESIZE_MASK["resizable-t"].bit ||
            this.resizeState & RESIZE_MASK["resizable-b"].bit;
        if (isY && this.disableCalcMap & DISABLE_MASK.h) {
            const diffY = eventY - this.mouseY;
            let changedY = this.changeY + diffY;
            const newHeight = this.height + changedY;
            // if overcrossed min height
            if (newHeight < this.minH) {
                changedY = -(this.height - this.minH);
            }
            // if overcrossed max heiht
            if (this.maxH && newHeight > this.maxH) {
                changedY = this.maxH - this.height;
            }
            this.changeY = changedY;
            this.mouseY = eventY;
            if (this.activeResizer) {
                this.activeResizer.style.bottom = `${-this.changeY}px`;
            }
        }
        if (isX && this.disableCalcMap & DISABLE_MASK.w) {
            const diffX = eventX - this.mouseX;
            let changedX = this.changeX + diffX;
            const newWidth = this.width + changedX;
            // if overcrossed min width
            if (newWidth < this.minW) {
                changedX = -(this.width - this.minW);
            }
            // if overcrossed max width
            if (this.maxW && newWidth > this.maxW) {
                changedX = this.maxW - this.width;
            }
            this.changeX = changedX;
            this.mouseX = eventX;
            if (this.activeResizer) {
                this.activeResizer.style.right = `${-this.changeX}px`;
            }
        }
        this.emitEvent(ResizeEvents.move);
    }
    handleDown(event) {
        var _a;
        if (event.defaultPrevented) {
            return;
        }
        this.dropInitial();
        for (const elClass in RESIZE_MASK) {
            const target = event.target;
            if (this.$el.contains(target) && (target === null || target === void 0 ? void 0 : target.classList.contains(elClass))) {
                document.body.style.cursor = RESIZE_MASK[elClass].cursor;
                if (ResizeDirective.isTouchEvent(event)) {
                    this.setInitials(event.touches[0], target);
                }
                else {
                    (_a = event.preventDefault) === null || _a === void 0 ? void 0 : _a.call(event);
                    this.setInitials(event, target);
                }
                this.resizeState = RESIZE_MASK[elClass].bit;
                const eventName = ResizeEvents.start;
                this.emitEvent(eventName);
                break;
            }
        }
        this.bindMove();
    }
    handleUp(e) {
        e.preventDefault();
        if (this.resizeState !== 0) {
            this.resizeState = 0;
            document.body.style.cursor = "";
            const eventName = ResizeEvents.end;
            this.emitEvent(eventName);
        }
        this.dropInitial();
        this.unbindMove();
    }
    setInitials({ clientX, clientY }, target) {
        const computedStyle = getComputedStyle(this.$el);
        this.$el.classList.add("active");
        this.activeResizer = target;
        if (this.disableCalcMap & DISABLE_MASK.w) {
            this.mouseX = clientX;
            this.width = this.$el.clientWidth;
            this.parent.width = this.$el.parentElement.clientWidth;
            // min width
            const minPaddingX = parseFloat(computedStyle.paddingLeft) +
                parseFloat(computedStyle.paddingRight);
            this.minW = Math.max(minPaddingX, this.initialProps.minWidth || 0);
            // max width
            if (this.initialProps.maxWidth) {
                this.maxW = Math.max(this.width, this.initialProps.maxWidth);
            }
        }
        if (this.disableCalcMap & DISABLE_MASK.h) {
            this.mouseY = clientY;
            this.height = this.$el.clientHeight;
            this.parent.height = this.$el.parentElement.clientHeight;
            // min height
            const minPaddingY = parseFloat(computedStyle.paddingTop) +
                parseFloat(computedStyle.paddingBottom);
            this.minH = Math.max(minPaddingY, this.initialProps.minHeight || 0);
            // max height
            if (this.initialProps.maxHeight) {
                this.maxH = Math.max(this.height, this.initialProps.maxHeight);
            }
        }
    }
    dropInitial() {
        this.changeX = this.changeY = this.minW = this.minH;
        this.width = this.height = 0;
        if (this.activeResizer) {
            this.activeResizer.removeAttribute("style");
        }
        this.$el.classList.remove("active");
        this.activeResizer = null;
    }
    bindMove() {
        document.documentElement.addEventListener("mouseup", this.mouseUpFunc, true);
        document.documentElement.addEventListener("touchend", this.mouseUpFunc, true);
        document.documentElement.addEventListener("mousemove", this.mouseMoveFunc, true);
        document.documentElement.addEventListener("touchmove", this.mouseMoveFunc, true);
        document.documentElement.addEventListener("mouseleave", this.mouseUpFunc);
    }
    unbindMove() {
        document.documentElement.removeEventListener("mouseup", this.mouseUpFunc, true);
        document.documentElement.removeEventListener("touchend", this.mouseUpFunc, true);
        document.documentElement.removeEventListener("mousemove", this.mouseMoveFunc, true);
        document.documentElement.removeEventListener("touchmove", this.mouseMoveFunc, true);
        document.documentElement.removeEventListener("mouseleave", this.mouseUpFunc);
    }
}
const ResizableElement = (props, children) => {
    const resizeEls = [];
    const directive = (props.canResize &&
        new ResizeDirective(props, (e) => {
            var _a;
            if (e.eventName === ResizeEvents.end) {
                (_a = props.onResize) === null || _a === void 0 ? void 0 : _a.call(props, e);
            }
        })) ||
        null;
    if (props.canResize) {
        if (props.active) {
            for (const p in props.active) {
                resizeEls.push(h("div", { onClick: (e) => e.preventDefault(), onDblClick: (e) => {
                        var _a;
                        e.preventDefault();
                        (_a = props.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(props);
                    }, onMouseDown: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), onTouchStart: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), class: `resizable resizable-${props.active[p]}` }));
            }
        }
    }
    else {
        if (props.active && props.canResize) {
            for (const p in props.active) {
                resizeEls.push(h("div", { onClick: (e) => e.preventDefault(), onDblClick: (e) => {
                        var _a;
                        e.preventDefault();
                        (_a = props.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(props);
                    }, class: `no-resize resizable resizable-${props.active[p]}` }));
            }
        }
    }
    return (h("div", Object.assign({}, props, { ref: (e) => {
            directive === null || directive === void 0 ? void 0 : directive.set(e);
            if (!props.ariaSort && e) {
                e.removeAttribute("aria-sort");
            }
        }, role: "columnheader" }),
        children,
        resizeEls));
};

const HeaderCellRenderer = ({ data, props, isHeaderSlot, columnDidRender, table }, children) => {
    const text = data === null || data === void 0 ? void 0 : data.name;
    const hiddenText = data === null || data === void 0 ? void 0 : data.hiddenText;
    let colTemplate;
    let cellProps = props;
    if (data === null || data === void 0 ? void 0 : data.columnTemplate) {
        colTemplate = data.columnTemplate(h, data, table);
        const didRender = data === null || data === void 0 ? void 0 : data.columnDidRender;
        if (didRender)
            columnDidRender === null || columnDidRender === void 0 ? void 0 : columnDidRender.push([didRender, data, colTemplate]);
    }
    if (data === null || data === void 0 ? void 0 : data.columnProperties) {
        const extra = data.columnProperties(data);
        if (extra && typeof extra === "object") {
            cellProps = ColumnService.doMerge(props, extra);
        }
    }
    if (data === null || data === void 0 ? void 0 : data.columnFooterTemplate) {
        console.warn("hbr-table: do NOT use columnFooterTemplate API!");
        data.columnFooterTemplate(h, data, table);
    }
    return (h(ResizableElement, Object.assign({}, cellProps, { onMouseDown: (e) => {
            const target = e.currentTarget;
            dispatch(target, COLUMN_CLICK, {
                data,
                event: e,
            });
        } }), isHeaderSlot ? (h("hbr-table-header-cell", { data: data },
        colTemplate,
        h("div", { slot: "top-end" }, children))) : (h(Fragment, null,
        h("div", { class: "header-content", role: "columnheader" },
            colTemplate || text,
            hiddenText && h("hbr-visually-hidden", null, hiddenText)),
        children))));
};

const GroupHeaderRenderer = (p) => {
    const groupProps = {
        canResize: p.canResize,
        minWidth: p.group.ids.length * MIN_COL_SIZE,
        maxWidth: 0,
        active: ["r"],
        class: {
            [HEADER_CLASS]: true,
        },
        style: {
            transform: `translateX(${p.start}px)`,
            width: `${p.end - p.start}px`,
        },
        onResize: p.onResize,
    };
    return (h(HeaderCellRenderer, { data: p.group, props: groupProps, table: p.table }));
};

const ColumnGroupsRenderer = ({ depth, groups, visibleProps, dimensionCol, canResize, onResize, table, }) => {
    // render group columns
    const groupRow = [];
    for (let i = 0; i < depth; i++) {
        if (groups[i]) {
            for (const group of groups[i]) {
                // if group in visible range
                // find first visible group prop in visible columns range
                const indexFirstVisibleCol = group.ids.findIndex((id) => typeof visibleProps[id] === "number");
                // if found visible column in group
                if (indexFirstVisibleCol > -1) {
                    const colVisibleIndex = visibleProps[group.ids[indexFirstVisibleCol]]; // get column index
                    const groupStartIndex = colVisibleIndex - indexFirstVisibleCol; // first column index in group
                    const groupEndIndex = groupStartIndex + group.ids.length - 1; // last column index in group
                    // coordinates
                    const groupStart = getItemByIndex(dimensionCol, groupStartIndex).start;
                    const groupEnd = getItemByIndex(dimensionCol, groupEndIndex).end;
                    groupRow.push(h(GroupHeaderRenderer, { table: table, start: groupStart, end: groupEnd, group: group, canResize: canResize, onResize: (e) => onResize(e.changedX, groupStartIndex, groupEndIndex) }));
                }
            }
        }
        groupRow.push(h("div", { class: `${HEADER_ROW_CLASS} group` }));
    }
    return groupRow;
};

const Default = () => (h("svg", { "data-header-sort": "true", "aria-hidden": "true", width: "21", height: "20", viewBox: "0 0 21 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    h("path", { "data-header-sort": "true", d: "M7.35355 12.8536C7.03857 12.5386 7.26165 12 7.70711 12H13.2929C13.7383 12 13.9614 12.5386 13.6464 12.8536L10.8536 15.6464C10.6583 15.8417 10.3417 15.8417 10.1464 15.6464L7.35355 12.8536Z", fill: "var(--sort-icon-default-fill, var(--interact-icon-weak-hover, #D0D4D9))" }),
    h("path", { "data-header-sort": "true", d: "M10.1464 4.35355C10.3417 4.15829 10.6583 4.15829 10.8536 4.35355L13.6464 7.14645C13.9614 7.46143 13.7383 8 13.2929 8H7.70711C7.26165 8 7.03857 7.46143 7.35355 7.14645L10.1464 4.35355Z", fill: "var(--sort-icon-default-fill, var(--interact-icon-weak-hover, #D0D4D9))" })));
const Asc = () => (h("svg", { "data-header-sort": "true", "aria-hidden": "true", width: "21", height: "20", viewBox: "0 0 21 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    h("path", { "data-header-sort": "true", d: "M7.35355 12.8536C7.03857 12.5386 7.26165 12 7.70711 12H13.2929C13.7383 12 13.9614 12.5386 13.6464 12.8536L10.8536 15.6464C10.6583 15.8417 10.3417 15.8417 10.1464 15.6464L7.35355 12.8536Z", fill: "var(--control-icon-weak-disabled, #D0D4D9)" }),
    h("path", { "data-header-sort": "true", d: "M10.1464 4.35355C10.3417 4.15829 10.6583 4.15829 10.8536 4.35355L13.6464 7.14645C13.9614 7.46143 13.7383 8 13.2929 8H7.70711C7.26165 8 7.03857 7.46143 7.35355 7.14645L10.1464 4.35355Z", fill: "var(--control-icon-weak-default, #7E868F)" })));
const Desc = () => (h("svg", { "data-header-sort": "true", "aria-hidden": "true", width: "21", height: "20", viewBox: "0 0 21 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    h("path", { "data-header-sort": "true", d: "M7.35355 12.8536C7.03857 12.5386 7.26165 12 7.70711 12H13.2929C13.7383 12 13.9614 12.5386 13.6464 12.8536L10.8536 15.6464C10.6583 15.8417 10.3417 15.8417 10.1464 15.6464L7.35355 12.8536Z", fill: "var(--control-icon-weak-default, #7E868F)" }),
    h("path", { "data-header-sort": "true", d: "M10.1464 4.35355C10.3417 4.15829 10.6583 4.15829 10.8536 4.35355L13.6464 7.14645C13.9614 7.46143 13.7383 8 13.2929 8H7.70711C7.26165 8 7.03857 7.46143 7.35355 7.14645L10.1464 4.35355Z", fill: "var(--control-icon-weak-disabled, #D0D4D9)" })));
const SortingSign = ({ column, table }) => {
    return table.theme === "magnetic" ? (h("span", { "data-header-sort": "true", class: `hbr-table-header-sorting-wrapper ${column.order === undefined ? "default" : column.order}` },
        column.order === undefined ? (h(Default, { class: "hbr-table-header-sorting-default" })) : (""),
        column.order === "asc" ? h(Asc, null) : "",
        column.order === "desc" ? h(Desc, null) : "")) : (h("i", { class: column.order }));
};

const HeaderRenderer = (p) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const isHeaderSlot = !!((_a = p === null || p === void 0 ? void 0 : p.table) === null || _a === void 0 ? void 0 : _a.headerSlot) && ((_b = p.data) === null || _b === void 0 ? void 0 : _b.headerSlot) !== false;
    const cellClass = {
        [HEADER_CLASS]: true,
        [HEADER_SORTABLE_CLASS]: !!((_c = p.data) === null || _c === void 0 ? void 0 : _c.sortable),
        "hbr-table-header-content-sort": isHeaderSlot,
        "hbr-table-header-align-right": ((_d = p.data) === null || _d === void 0 ? void 0 : _d.headerAlign) === "right" && !isHeaderSlot,
        "hbr-table-header-slot-align-right": ((_e = p.data) === null || _e === void 0 ? void 0 : _e.headerAlign) === "right" && isHeaderSlot,
        "hbr-table-header-align-center": ((_f = p.data) === null || _f === void 0 ? void 0 : _f.headerAlign) === "center" && !isHeaderSlot,
        "hbr-table-header-slot-align-center": ((_g = p.data) === null || _g === void 0 ? void 0 : _g.headerAlign) === "center" && isHeaderSlot
    };
    if ((_h = p.data) === null || _h === void 0 ? void 0 : _h.order) {
        cellClass[p.data.order] = true;
    }
    const dataProps = {
        [DATA_COL]: p.column.itemIndex,
        canResize: p.canResize,
        minWidth: ((_j = p.data) === null || _j === void 0 ? void 0 : _j.minSize) || MIN_COL_SIZE,
        maxWidth: (_k = p.data) === null || _k === void 0 ? void 0 : _k.maxSize,
        active: ["r"],
        class: cellClass,
        style: {
            width: `${p.column.size}px`,
            transform: `translateX(${p.column.start}px)`,
        },
        ariaSort: ((_l = p.data) === null || _l === void 0 ? void 0 : _l.order) === "asc" ? "ascending" : ((_m = p.data) === null || _m === void 0 ? void 0 : _m.order) === "desc" ? "descending" : undefined,
        onResize: p.onResize,
        onDoubleClick(originalEvent) {
            p.onDoubleClick({
                column: p.data,
                index: p.column.itemIndex,
                originalEvent,
            });
        },
        onClick(originalEvent) {
            if (originalEvent.defaultPrevented || !p.onClick) {
                return;
            }
            if (isHeaderSlot) {
                const targetEle = originalEvent.target;
                if (targetEle.hasAttribute("data-header-sort")) {
                    p.onClick({ column: p.data, index: p.column.itemIndex, originalEvent });
                }
            }
            else {
                p.onClick({ column: p.data, index: p.column.itemIndex, originalEvent });
            }
        },
    };
    if ((_o = p === null || p === void 0 ? void 0 : p.data) === null || _o === void 0 ? void 0 : _o.hasOwnProperty("canResize")) {
        dataProps.canResize = (_p = p.data) === null || _p === void 0 ? void 0 : _p.canResize;
    }
    if (p.range) {
        if (p.column.itemIndex >= p.range.x && p.column.itemIndex <= p.range.x1) {
            if (typeof dataProps.class === "object") {
                dataProps.class[FOCUS_CLASS] = true;
            }
        }
    }
    return (h(HeaderCellRenderer, { data: p.data, isHeaderSlot: isHeaderSlot, props: dataProps, columnDidRender: p.columnDidRender, table: p.table },
        ((_q = p.data) === null || _q === void 0 ? void 0 : _q.sortable) ? h(SortingSign, { column: p.data, table: p.table }) : "",
        p.canFilter && ((_r = p.data) === null || _r === void 0 ? void 0 : _r.filter) !== false ? (h(FilterButton, { column: p.data })) : ("")));
};

const styleCss = "hbr-table .hbr-table-column-checkbox{text-overflow:unset !important;padding:0px !important;display:flex;justify-content:center;align-items:center}hbr-table .rgCell.disabled{background-color:var(--cell-disabled-color, var(--control-bg-disabled, #f7f7f7))}hbr-table hbr-table-data .rgRow .rgCell.hbr-table-cell-readonly-background-color{background-color:var(--hbr-background-color)}hbr-table hbr-table-header .rgHeaderCell.hbr-table-column-header-checkbox-tree,hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell.hbr-table-column-header-checkbox-tree{padding:0px}hbr-table-header{position:relative;z-index:5;display:block}hbr-table-header .hbr-table-column-header-checkbox{padding:0px !important}hbr-table-header .hbr-table-column-header-checkbox .header-content{display:flex;justify-content:center;align-items:center}hbr-table-header .rgHeaderCell{display:flex}hbr-table-header .rgHeaderCell.hbr-table-header-align-right{justify-content:flex-end}hbr-table-header .rgHeaderCell.hbr-table-header-align-right .header-content{flex-grow:unset}hbr-table-header .rgHeaderCell.hbr-table-header-slot-align-right hbr-table-header-cell .hbr-table-header-cell-top{justify-content:flex-end}hbr-table-header .rgHeaderCell.hbr-table-header-align-center{justify-content:center}hbr-table-header .rgHeaderCell.hbr-table-header-align-center .header-content{flex-grow:unset}hbr-table-header .rgHeaderCell.hbr-table-header-slot-align-center hbr-table-header-cell .hbr-table-header-cell-top{justify-content:center}hbr-table-header .rgHeaderCell.align-center{text-align:center}hbr-table-header .rgHeaderCell.align-left{text-align:left}hbr-table-header .rgHeaderCell.align-right{text-align:right}hbr-table-header .rgHeaderCell .hbr-table-header-cell{display:flex;flex-direction:column;width:100%;justify-content:space-between}hbr-table-header .rgHeaderCell .hbr-table-header-cell-top{display:flex;flex-direction:row;width:100%}hbr-table-header .rgHeaderCell .hbr-table-header-cell-bottom{display:flex;align-items:center;width:100%}hbr-table-header .rgHeaderCell .hbr-table-header-cell-bottom hbr-input{width:100%}hbr-table-header .rgHeaderCell .hbr-table-header-cell-bottom hbr-input::part(element){line-height:initial}hbr-table-header .rgHeaderCell.sortable .hbr-table-header-sorting-wrapper{display:flex;align-items:center;cursor:pointer}hbr-table-header .rgHeaderCell.sortable .hbr-table-header-sorting-wrapper.default svg{display:none}hbr-table-header .rgHeaderCell.sortable:hover{background-color:var(--sortable-hover-bg-color, var(--control-bg-hover));cursor:pointer}hbr-table-header .rgHeaderCell.sortable:hover .hbr-table-header-sorting-wrapper.default svg{display:flex}hbr-table-header .rgHeaderCell.sortable.hbr-table-header-content-sort:hover{cursor:default}hbr-table-header .rgHeaderCell.hbr-table-header-content-sort{align-items:flex-start}hbr-table-header .rgHeaderCell i.asc,hbr-table-header .rgHeaderCell i.desc{display:flex;align-items:center;justify-content:center}hbr-table-header .rgHeaderCell i.asc:after,hbr-table-header .rgHeaderCell i.desc:after{font-size:13px}hbr-table-header .rgHeaderCell i.asc:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid var(--interact-text-default);content:\" \"}hbr-table-header .rgHeaderCell i.desc{padding-bottom:5px}hbr-table-header .rgHeaderCell i.desc:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid var(--interact-text-default);content:\" \"}hbr-table-header .rgHeaderCell,hbr-table-header .grouped-cell{position:absolute;box-sizing:border-box;height:100%;z-index:1}hbr-table-header .header-rgRow{display:block;position:relative}hbr-table-header .header-rgRow.group{z-index:0}hbr-table-header .group-rgRow{position:relative;text-align:center}hbr-table-header .rgHeaderCell.active{z-index:10}hbr-table-header .rgHeaderCell.active .resizable{background-color:var(--resizable-bg-color, var(--control-bg-strong-default))}hbr-table-header .rgHeaderCell .header-content{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-grow:1}hbr-table-header .rgHeaderCell.sortable .header-content{flex-grow:unset}hbr-table-header .rgHeaderCell .resizable{display:block;position:absolute;z-index:90;touch-action:none;user-select:none}hbr-table-header .rgHeaderCell .resizable:hover{background-color:var(--resizable-bg-color, var(--control-bg-strong-default))}hbr-table-header .rgHeaderCell>.resizable-r{cursor:ew-resize;width:6px;right:0;top:0;height:100%}hbr-table-header .rgHeaderCell>.resizable-rb{cursor:se-resize;width:6px;height:6px;right:0;bottom:0}hbr-table-header .rgHeaderCell>.resizable-b{cursor:s-resize;height:6px;bottom:0;width:100%;left:0}hbr-table-header .rgHeaderCell>.resizable-lb{cursor:sw-resize;width:6px;height:6px;left:0;bottom:0}hbr-table-header .rgHeaderCell>.resizable-l{cursor:w-resize;width:6px;left:0;height:100%;top:0}hbr-table-header .rgHeaderCell>.resizable-lt{cursor:nw-resize;width:6px;height:6px;left:0;top:0}hbr-table-header .rgHeaderCell>.resizable-t{cursor:n-resize;height:6px;top:0;width:100%;left:0}hbr-table-header .rgHeaderCell>.resizable-rt{cursor:ne-resize;width:6px;height:6px;right:0;top:0}hbr-table-header .rv-filter{visibility:hidden}";
const HbrTableHeaderStyle0 = styleCss;

const HbrgrHeaderComponent = /*@__PURE__*/ proxyCustomElement(class HbrgrHeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.initialHeaderClick = createEvent(this, "initialHeaderClick", 7);
        this.headerresize = createEvent(this, "headerresize", 7);
        this.headerdblClick = createEvent(this, "headerdblClick", 7);
        this.columnDidRender = [];
        this.viewportCol = undefined;
        this.dimensionCol = undefined;
        this.selectionStore = undefined;
        this.parent = "";
        this.groups = undefined;
        this.groupingDepth = 0;
        this.canResize = undefined;
        this.colData = undefined;
        this.columnFilter = undefined;
        this.tbSelf = undefined;
        this.role = undefined;
    }
    onResize({ width }, index) {
        this.headerresize.emit({ [index]: width || 0 });
    }
    onResizeGroup(changedX, startIndex, endIndex) {
        const sizes = {};
        const cols = keyBy(this.viewportCol.get("items"), "itemIndex");
        const change = changedX / (endIndex - startIndex + 1);
        for (let i = startIndex; i <= endIndex; i++) {
            const item = cols[i];
            if (item) {
                sizes[i] = item.size + change;
            }
        }
        this.headerresize.emit(sizes);
    }
    componentDidRender() {
        this.columnDidRender.forEach(([didRender, data, colTemplate]) => {
            const ele = getElement(colTemplate);
            return didRender(data, ele, this.tbSelf.source, colTemplate);
        });
    }
    render() {
        var _a;
        this.columnDidRender = [];
        const cols = this.viewportCol.get("items");
        const range = (_a = this.selectionStore) === null || _a === void 0 ? void 0 : _a.get("range");
        const cells = [];
        const visibleProps = {};
        // render header columns
        for (const rgCol of cols) {
            const colData = this.colData[rgCol.itemIndex];
            cells.push(h(HeaderRenderer, { key: '27235e5c2206113f567d1f5df8211f8a180f013c', table: this.tbSelf, columnDidRender: this.columnDidRender, range: range, column: rgCol, data: colData, canFilter: !!this.columnFilter, canResize: this.canResize, onResize: (e) => this.onResize(e, rgCol.itemIndex), onDoubleClick: (e) => this.headerdblClick.emit(e), onClick: (e) => this.initialHeaderClick.emit(e) }));
            visibleProps[colData === null || colData === void 0 ? void 0 : colData.prop] = rgCol.itemIndex;
        }
        return [
            h("div", { key: 'c4a0a054d28cdea782fb4bb8e2f7bbb06c52509b', class: "group-rgRow" }, h(ColumnGroupsRenderer, { key: '9bfaf8000eb5498d19b471e06b1cbae05d704e84', table: this.tbSelf, canResize: this.canResize, visibleProps: visibleProps, groups: this.groups, dimensionCol: this.dimensionCol.state, depth: this.groupingDepth, onResize: (changedX, startIndex, endIndex) => this.onResizeGroup(changedX, startIndex, endIndex) })),
            h("div", { key: 'aaad88951797bae974c66419ce8c8741b4af6bcd', class: `${HEADER_ROW_CLASS} ${HEADER_ACTUAL_ROW_CLASS}`, role: "row" }, cells),
        ];
    }
    get element() { return this; }
    static get style() { return HbrTableHeaderStyle0; }
}, [0, "hbr-table-header", {
        "viewportCol": [16],
        "dimensionCol": [16],
        "selectionStore": [16],
        "parent": [1],
        "groups": [16],
        "groupingDepth": [2, "grouping-depth"],
        "canResize": [4, "can-resize"],
        "colData": [16],
        "columnFilter": [4, "column-filter"],
        "tbSelf": [8, "tb-self"],
        "role": [520]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table-header", "hbr-table-header-cell", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table-header":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrgrHeaderComponent);
            }
            break;
        case "hbr-table-header-cell":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { BasePlugin as B, ColumnPlugin as C, GroupingColumnPlugin as G, HbrgrHeaderComponent as H, defineCustomElement as d };

