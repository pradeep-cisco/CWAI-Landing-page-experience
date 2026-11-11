import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

/**
 * Mixed drop indicator for dashboard-flow.
 *
 * Calculates quadrant-aware ghost positions with edge detection,
 * maps them to indicator edges, and computes row-indicator positioning
 * for "insert new row" operations.
 *
 * This logic is intentionally separate from the simple DropIndicator
 * used by hbr-drop-zone so that it is only loaded when the dashboard
 * flow feature is needed.
 */
class DashboardFlowIndicator {
    /**
     * Determines ghost position in the target element's quadrant grid.
     * When the pointer (minus half the ghost height) reaches the very top or
     * bottom edge, returns "top" or "bottom" to signal a new-row insertion.
     */
    calculateGhostPosition(pointerX, pointerY, targetRect, ghostHalfHeight = 0) {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const isLeft = pointerX < centerX;
        const isTop = pointerY < centerY;
        if (isTop && pointerY - ghostHalfHeight <= targetRect.top) {
            return "top";
        }
        if (!isTop && pointerY + ghostHalfHeight >= targetRect.bottom) {
            return "bottom";
        }
        if (isTop && isLeft)
            return "top-left";
        if (isTop && !isLeft)
            return "top-right";
        if (!isTop && isLeft)
            return "bottom-left";
        return "bottom-right";
    }
    /**
     * Maps a ghost position to an indicator edge based on direction.
     * For horizontal: left/right for quadrant positions, top/bottom for edge positions.
     * For vertical: top/bottom always.
     */
    calculateIndicatorEdge(ghostPosition, direction) {
        if (direction === "horizontal") {
            return ghostPosition.includes("left")
                ? "left"
                : ghostPosition.includes("right")
                    ? "right"
                    : ghostPosition;
        }
        return ghostPosition.includes("top") ? "top" : "bottom";
    }
    getIndicatorClass(direction, indicatorEdge) {
        const orientationPrefix = direction === "horizontal" ? "horizontal" : "vertical";
        const positionSuffix = indicatorEdge === "top" || indicatorEdge === "left" ? "before" : "after";
        return `hbr-drag-over--${orientationPrefix}-${positionSuffix}`;
    }
    /**
     * Returns true when the ghost position is at an exact edge ("top" or "bottom"),
     * indicating a new-row insertion rather than a reorder within a row.
     */
    isEdgePosition(ghostPosition) {
        return ghostPosition === "top" || ghostPosition === "bottom";
    }
    /**
     * Calculate row indicator position based on ghost position and target rect.
     * @returns RowIndicatorResult with visibility and top/bottom position
     *          relative to dropZoneRect.
     */
    calculateRowIndicator(ghostPosition, targetRect, dropZoneRect, dropZoneHost) {
        if (!this.isEdgePosition(ghostPosition)) {
            return { visible: false };
        }
        const halfGap = this.getDashboardSectionHalfGap(dropZoneHost);
        return {
            visible: true,
            top: ghostPosition === "top"
                ? targetRect.top - dropZoneRect.top - halfGap
                : undefined,
            bottom: ghostPosition === "bottom"
                ? dropZoneRect.bottom - targetRect.bottom - halfGap
                : undefined,
        };
    }
    getDashboardSectionHalfGap(dropZoneHost) {
        if (!dropZoneHost)
            return 0;
        const layoutElement = dropZoneHost.querySelector("hbr-layout[variant='dashboard:widgets:container']");
        if (!layoutElement)
            return 0;
        const styles = window.getComputedStyle(layoutElement);
        const rowGap = Number.parseFloat(styles.rowGap || "");
        if (Number.isFinite(rowGap) && rowGap > 0)
            return rowGap / 2;
        const gap = Number.parseFloat(styles.gap || "");
        if (Number.isFinite(gap) && gap > 0)
            return gap / 2;
        return 0;
    }
}

const COL_SPAN_MAP = {
    "1/4": 3,
    "1/3": 4,
    "1/2": 6,
    "2/3": 8,
    "3/4": 9,
    full: 12,
};
const DashboardFlow = /*@__PURE__*/ proxyCustomElement(class DashboardFlow extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.hbrFlowLayoutChange = createEvent(this, "hbr-flow-layout-change", 7);
        this.hasMounted = false;
        this.rafId = null;
        this.lastLayoutSignature = "";
        /** Rows array - seeded from the widgets prop and mutated on drop/remove */
        this.rows = [];
        this.invalidDropTarget = null;
        /** Mixed indicator state */
        this.mixedIndicator = new DashboardFlowIndicator();
        this.currentMixedTarget = null;
        this.currentMixedClass = null;
        this.currentMixedIndicatorEdge = null;
        this.cachedGhostHalfHeight = null;
        this.widgets = [];
    }
    handleDragOver(event) {
        const dropZone = this.host.querySelector("hbr-drop-zone");
        if (!dropZone || event.target !== dropZone)
            return;
        const { detail } = event;
        if (!detail)
            return;
        const { dragElement, targetElement, pointer, targetEntry } = detail;
        // Clear previous invalid state
        this.clearInvalidDrop();
        if (!dragElement || !targetElement || !pointer || !targetEntry) {
            this.clearMixedIndicator();
            this.hideRowIndicator();
            return;
        }
        const targetRect = targetEntry.rect;
        // Cache ghost half-height once per drag session
        if (this.cachedGhostHalfHeight === null) {
            const ghost = dropZone.querySelector("hbr-drag-ghost");
            this.cachedGhostHalfHeight = ghost
                ? ghost.getBoundingClientRect().height / 2
                : 0;
        }
        // Determine the direction from the drop-zone
        const direction = dropZone.direction || "horizontal";
        // Calculate mixed ghost position (quadrant + edge detection)
        const ghostPosition = this.mixedIndicator.calculateGhostPosition(pointer.x, pointer.y, targetRect, this.cachedGhostHalfHeight);
        // Calculate mixed indicator edge
        const mixedEdge = this.mixedIndicator.calculateIndicatorEdge(ghostPosition, direction);
        // Remove the simple indicator class that drop-zone applied
        this.clearSimpleIndicatorFromTarget(targetElement);
        if (this.mixedIndicator.isEdgePosition(ghostPosition)) {
            // Edge position → show row indicator, hide card-level indicator
            this.clearMixedIndicator();
            const dropZoneRect = dropZone.getBoundingClientRect();
            const rowResult = this.mixedIndicator.calculateRowIndicator(ghostPosition, targetRect, dropZoneRect, dropZone);
            if (rowResult.visible) {
                const pos = {};
                if (rowResult.top !== undefined)
                    pos.top = rowResult.top;
                if (rowResult.bottom !== undefined)
                    pos.bottom = rowResult.bottom;
                dropZone.showRowIndicator(pos);
            }
            // Store edge position as the mixed indicator
            this.currentMixedIndicatorEdge = ghostPosition;
        }
        else {
            // Quadrant position → show card indicator, hide row indicator
            this.hideRowIndicator();
            const newClass = this.mixedIndicator.getIndicatorClass(direction, mixedEdge);
            this.clearMixedIndicator();
            targetElement.classList.add(newClass);
            this.currentMixedTarget = targetElement;
            this.currentMixedClass = newClass;
            // }
            this.currentMixedIndicatorEdge = mixedEdge;
            // Check if drop would be invalid (cross-row into full row)
            if (dragElement &&
                targetElement &&
                this.isDropInvalid(dragElement, targetElement)) {
                targetElement.classList.add("hbr-drag-over--invalid");
                this.invalidDropTarget = targetElement;
            }
        }
    }
    handleDragEnd() {
        this.clearInvalidDrop();
        this.clearMixedIndicator();
        this.hideRowIndicator();
        this.cachedGhostHalfHeight = null;
        this.currentMixedIndicatorEdge = null;
    }
    handleItemDropped(event) {
        const dropZone = this.host.querySelector("hbr-drop-zone");
        if (!dropZone || event.target !== dropZone)
            return;
        const { detail } = event;
        if (!detail)
            return;
        const { dragElement } = detail;
        const targetElement = detail.targetElement;
        // Use our own tracked mixed indicator instead of the simple one from drop-zone
        const indicator = this.currentMixedIndicatorEdge;
        this.clearInvalidDrop();
        this.clearMixedIndicator();
        this.hideRowIndicator();
        this.currentMixedIndicatorEdge = null;
        if (indicator === "top" || indicator === "bottom") {
            const dragId = this.resolveIdFromElement(dragElement);
            const targetId = this.resolveIdFromElement(targetElement);
            if (dragId && targetId) {
                this.applyCreateNewRow(dragId, targetId, indicator);
            }
            return;
        }
        const dragId = this.resolveIdFromElement(dragElement);
        const targetId = this.resolveIdFromElement(targetElement);
        // Block drop into a full row from a different row
        if (dragId && targetId && this.isDropInvalid(dragId, targetId)) {
            return;
        }
        if (dragId && targetId) {
            this.updateRowsAfterReorder(dragId, targetId, indicator === "right");
        }
        this.applyFlowAndEmit("drop");
    }
    handleDraggableRemove(event) {
        const removedElement = event.target;
        if (!this.host.contains(removedElement))
            return;
        // Targeted mutation: remove just this card from its row and redistribute that row
        const removedId = this.resolveIdFromElement(removedElement);
        if (removedId) {
            this.removeCardFromRows(removedId);
        }
        // Emit directly — rows are already correctly updated, no full reflow needed
        this.emitLayout("remove");
    }
    componentDidLoad() {
        this.hasMounted = true;
        this.rows = this.buildRowsFromWidgets(this.widgets);
        this.applyFlowAndEmit("initial");
    }
    disconnectedCallback() {
        this.hasMounted = false;
        this.clearScheduledReflow();
        this.clearInvalidDrop();
        this.clearMixedIndicator();
        this.hideRowIndicator();
        this.cachedGhostHalfHeight = null;
        this.currentMixedIndicatorEdge = null;
        this.rows = [];
    }
    handleWidgetsChange() {
        if (!this.hasMounted)
            return;
        // Compare incoming widget IDs against the current rows (source of truth).
        // After a drop/remove, this.rows already reflects the correct state.
        // When the consumer echoes that order back as widgets, skip the rebuild.
        const incomingIds = this.widgets.map((d) => d.id).join("\0");
        const currentIds = this.rows
            .flatMap((r) => r.cards.map((c) => c.id))
            .join("\0");
        if (incomingIds === currentIds)
            return;
        this.rows = this.buildRowsFromWidgets(this.widgets);
        this.applyFlowAndEmit("widgets-changed");
    }
    async triggerReflow(reason = "widgets-changed") {
        if (!this.hasMounted)
            return;
        this.applyFlowAndEmit(reason);
    }
    clearScheduledReflow() {
        if (this.rafId != null) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
    /**
     * Creates a new row and moves the drag element into it.
     * Updates spans of remaining items in the original row.
     * Mutates this.rows directly.
     */
    applyCreateNewRow(dragId, targetId, position) {
        if (!this.rows.length)
            return;
        const targetRowIndex = this.rows.findIndex((row) => row.cards.some((entry) => entry.id === targetId));
        if (targetRowIndex < 0)
            return;
        const insertionRowIndex = position === "top" ? targetRowIndex : targetRowIndex + 1;
        if (insertionRowIndex < 0)
            return;
        // Remove dragged card from existing rows (mutate in place)
        let affectedRow = null;
        for (const row of this.rows) {
            const initialLength = row.cards.length;
            row.cards = row.cards.filter((entry) => entry.id !== dragId);
            if (row.cards.length !== initialLength) {
                row.totalSpan = row.cards.reduce((sum, entry) => sum + entry.span, 0);
                if (row.totalSpan !== 12 && row.cards.length > 0) {
                    affectedRow = row;
                }
            }
        }
        // Filter out empty rows
        this.rows = this.rows.filter((row) => row.cards.length > 0);
        // Recalculate spans for the affected row (only flexible items)
        if (affectedRow) {
            this.redistributeRowSpans(affectedRow);
        }
        const boundedInsertionIndex = Math.min(Math.max(0, insertionRowIndex), this.rows.length);
        const draggedCardSpan = 12;
        // Insert new row directly into this.rows
        this.rows.splice(boundedInsertionIndex, 0, {
            cards: [
                {
                    id: dragId,
                    span: draggedCardSpan,
                    isLocked: false,
                },
            ],
            totalSpan: draggedCardSpan,
        });
        this.emitLayout("drop", {
            skipped: true,
            newRowCreated: true,
        });
    }
    /**
     * Resolves the drag-id from a DOM element received in a drag event.
     * Walks up to find hbr-draggable or hbr-card and reads the drag-id.
     */
    resolveIdFromElement(element) {
        var _a;
        if (!element)
            return null;
        const tag = element.tagName.toLowerCase();
        if (tag === "hbr-card") {
            return (element.getAttribute("data-drag-id") ||
                ((_a = element.closest("hbr-draggable")) === null || _a === void 0 ? void 0 : _a.getAttribute("drag-id")) ||
                null);
        }
        if (tag === "hbr-draggable") {
            return element.getAttribute("drag-id") || null;
        }
        const draggable = element.closest("hbr-draggable");
        return (draggable === null || draggable === void 0 ? void 0 : draggable.getAttribute("drag-id")) || null;
    }
    /**
     * Builds rows from widget descriptors (pure data — no DOM scraping).
     * Locked widgets get their col-based span; flexible ones default to 4.
     * Cards are packed greedily into rows of total span 12.
     */
    buildRowsFromWidgets(widgets) {
        var _a;
        const rows = [];
        let currentRow = { cards: [], totalSpan: 0 };
        for (const widget of widgets) {
            const isLocked = !!widget.col;
            const span = isLocked ? (_a = COL_SPAN_MAP[widget.col]) !== null && _a !== void 0 ? _a : 4 : 4;
            if (currentRow.cards.length > 0 && currentRow.totalSpan + span > 12) {
                rows.push(currentRow);
                currentRow = { cards: [], totalSpan: 0 };
            }
            currentRow.cards.push({
                id: widget.id,
                span,
                isLocked,
            });
            currentRow.totalSpan += span;
        }
        if (currentRow.cards.length > 0) {
            rows.push(currentRow);
        }
        // Rebalance trailing orphans: if a row has a single card,
        // pull the last flexible card from the previous row down.
        for (let i = rows.length - 1; i > 0; i--) {
            if (rows[i].cards.length !== 1)
                continue;
            if (rows[i].cards[0].isLocked)
                continue;
            const prev = rows[i - 1];
            if (prev.cards.every((card) => card.isLocked))
                break;
            if (prev.cards.length <= 1)
                continue;
            const last = prev.cards[prev.cards.length - 1];
            if (last.isLocked)
                continue;
            prev.cards.pop();
            prev.totalSpan -= last.span;
            rows[i].cards.unshift(last);
            rows[i].totalSpan += last.span;
        }
        return rows;
    }
    /**
     * Removes a card from rows by ID.
     * Called when a draggable is removed.
     */
    removeCardFromRows(cardId) {
        for (const row of this.rows) {
            const initialLength = row.cards.length;
            row.cards = row.cards.filter((entry) => entry.id !== cardId);
            if (row.cards.length !== initialLength) {
                row.totalSpan = row.cards.reduce((sum, entry) => sum + entry.span, 0);
                // Redistribute spans for flexible items if row doesn't add up to 12
                if (row.cards.length > 0 && row.totalSpan !== 12) {
                    this.redistributeRowSpans(row);
                }
            }
        }
        // Filter out empty rows
        this.rows = this.rows.filter((row) => row.cards.length > 0);
    }
    updateRowsAfterReorder(dragId, targetId, insertAfter) {
        if (!this.rows.length)
            return;
        let dragRowIndex = -1;
        let dragCardIndex = -1;
        let targetRowIndex = -1;
        let targetCardIndex = -1;
        for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
            const row = this.rows[rowIdx];
            if (dragRowIndex === -1) {
                const index = row.cards.findIndex((entry) => entry.id === dragId);
                if (index !== -1) {
                    dragRowIndex = rowIdx;
                    dragCardIndex = index;
                }
            }
            if (targetRowIndex === -1) {
                const index = row.cards.findIndex((entry) => entry.id === targetId);
                if (index !== -1) {
                    targetRowIndex = rowIdx;
                    targetCardIndex = index;
                }
            }
            if (dragRowIndex !== -1 && targetRowIndex !== -1)
                break;
        }
        if (dragRowIndex === -1 ||
            targetRowIndex === -1 ||
            dragCardIndex === -1 ||
            targetCardIndex === -1) {
            return;
        }
        // No-op: already in intended relative position
        if (dragRowIndex === targetRowIndex) {
            if (!insertAfter && dragCardIndex === targetCardIndex - 1)
                return;
            if (insertAfter && dragCardIndex === targetCardIndex + 1)
                return;
        }
        const sourceRow = this.rows[dragRowIndex];
        const [dragEntry] = sourceRow.cards.splice(dragCardIndex, 1);
        if (!dragEntry)
            return;
        // Same-row target index shifts left after removal when dragged item was before target.
        if (dragRowIndex === targetRowIndex && dragCardIndex < targetCardIndex) {
            targetCardIndex -= 1;
        }
        if (sourceRow.cards.length === 0) {
            this.rows.splice(dragRowIndex, 1);
            // Target row shifts left only when the removed source row was before it.
            if (dragRowIndex < targetRowIndex) {
                targetRowIndex -= 1;
            }
        }
        else {
            sourceRow.totalSpan = sourceRow.cards.reduce((sum, entry) => sum + entry.span, 0);
        }
        const destinationRow = this.rows[targetRowIndex];
        if (!destinationRow)
            return;
        let insertIndex = insertAfter ? targetCardIndex + 1 : targetCardIndex;
        insertIndex = Math.max(0, Math.min(insertIndex, destinationRow.cards.length));
        destinationRow.cards.splice(insertIndex, 0, dragEntry);
        destinationRow.totalSpan = destinationRow.cards.reduce((sum, entry) => sum + entry.span, 0);
    }
    /**
     * Redistributes spans for flexible (non-locked) items in a row to total 12.
     * Locked items keep their span; the remaining space is distributed among flexible items.
     */
    redistributeRowSpans(row) {
        const lockedSpan = row.cards
            .filter((entry) => entry.isLocked)
            .reduce((sum, entry) => sum + entry.span, 0);
        const flexibleCards = row.cards.filter((entry) => !entry.isLocked);
        const availableSpan = 12 - lockedSpan;
        if (flexibleCards.length > 0 && availableSpan > 0) {
            const count = flexibleCards.length;
            const baseSpan = Math.max(4, Math.floor(availableSpan / count));
            const remainder = availableSpan - baseSpan * count;
            flexibleCards.forEach((entry, i) => {
                // Distribute remainder across the first N cards (1 extra each)
                entry.span = baseSpan + (i < remainder ? 1 : 0);
            });
        }
        row.totalSpan = row.cards.reduce((sum, entry) => sum + entry.span, 0);
    }
    /**
     * Redistributes spans for any row that doesn't total 12 and emits
     * the layout change event.
     */
    applyFlowAndEmit(reason) {
        for (const row of this.rows) {
            if (row.totalSpan !== 12) {
                this.redistributeRowSpans(row);
            }
        }
        this.emitLayout(reason);
    }
    /**
     * Computes order/spanById from this.rows and emits hbr-flow-layout-change.
     * Skips emission if nothing changed (signature check).
     */
    emitLayout(reason, extra) {
        var _a;
        const order = [];
        const spanById = {};
        for (const row of this.rows) {
            const responsiveSpans = this.getResponsiveSpansForRow(row);
            for (const entry of row.cards) {
                const responsive = (_a = responsiveSpans.get(entry)) !== null && _a !== void 0 ? _a : { sm: 6, xs: 12 };
                const spanValue = Object.assign({ base: entry.span }, responsive);
                order.push(entry.id);
                spanById[entry.id] = spanValue;
            }
        }
        if (!order.length)
            return;
        const signature = JSON.stringify({ order, spanById });
        if (signature === this.lastLayoutSignature)
            return;
        this.lastLayoutSignature = signature;
        this.hbrFlowLayoutChange.emit(Object.assign({ reason,
            order,
            spanById }, extra));
    }
    /**
     * Calculates responsive spans for all cards in a row.
     * Groups consecutive flexible cards separated by locked cards.
     * If a group has an odd count, the last card gets sm: 12 (full width);
     * the rest get sm: 6 (half width, paired).
     */
    getResponsiveSpansForRow(row) {
        const result = new Map();
        if (row.cards.length === 1) {
            result.set(row.cards[0], { sm: 12, xs: 12 });
            return result;
        }
        let flexGroup = [];
        const flushGroup = () => {
            if (!flexGroup.length)
                return;
            const isOdd = flexGroup.length % 2 !== 0;
            for (let i = 0; i < flexGroup.length; i++) {
                const isLast = i === flexGroup.length - 1;
                result.set(flexGroup[i], {
                    sm: isOdd && isLast ? 12 : 6,
                    xs: 12,
                });
            }
            flexGroup = [];
        };
        for (const card of row.cards) {
            if (card.isLocked) {
                flushGroup();
                const base = card.span;
                result.set(card, {
                    sm: base <= 4 ? 6 : 12,
                    xs: 12,
                });
            }
            else {
                flexGroup.push(card);
            }
        }
        flushGroup();
        return result;
    }
    /**
     * Checks if dropping a card onto another card's row would be invalid.
     * Invalid = cross-row move into a row that cannot fit another card.
     * Accepts IDs (used from drop handler) or HTMLElements (used from drag-over indicator).
     */
    isDropInvalid(dragIdOrElement, targetIdOrElement) {
        const dragId = typeof dragIdOrElement === "string"
            ? dragIdOrElement
            : this.resolveIdFromElement(dragIdOrElement);
        const targetId = typeof targetIdOrElement === "string"
            ? targetIdOrElement
            : this.resolveIdFromElement(targetIdOrElement);
        if (!dragId || !targetId)
            return false;
        let dragRowIndex = -1;
        let targetRowIndex = -1;
        for (let i = 0; i < this.rows.length; i++) {
            const row = this.rows[i];
            if (dragRowIndex === -1 && row.cards.some((c) => c.id === dragId)) {
                dragRowIndex = i;
            }
            if (targetRowIndex === -1 && row.cards.some((c) => c.id === targetId)) {
                targetRowIndex = i;
            }
            if (dragRowIndex !== -1 && targetRowIndex !== -1)
                break;
        }
        // Same row = reorder, always valid
        if (dragRowIndex === targetRowIndex)
            return false;
        if (targetRowIndex === -1)
            return false;
        return !this.canRowAcceptCard(this.rows[targetRowIndex]);
    }
    /**
     * Returns true if the row has enough available span to fit one more card.
     * Each flexible card requires a minimum span of 4.
     */
    canRowAcceptCard(row) {
        const lockedSpan = row.cards
            .filter((c) => c.isLocked)
            .reduce((sum, c) => sum + c.span, 0);
        const flexibleCount = row.cards.filter((c) => !c.isLocked).length;
        const availableSpan = 12 - lockedSpan;
        // Adding one more flexible card: each needs at least span 4
        return availableSpan >= 4 * (flexibleCount + 1);
    }
    clearInvalidDrop() {
        if (this.invalidDropTarget) {
            this.invalidDropTarget.classList.remove("hbr-drag-over--invalid");
            this.invalidDropTarget = null;
        }
    }
    /**
     * Removes the simple indicator class that drop-zone applied to a target.
     * We look for any hbr-drag-over--* class and strip it, since the mixed
     * indicator will apply its own class (or show the row indicator instead).
     */
    clearSimpleIndicatorFromTarget(target) {
        const classes = Array.from(target.classList);
        for (const cls of classes) {
            if (cls.startsWith("hbr-drag-over--") &&
                cls !== "hbr-drag-over--invalid") {
                target.classList.remove(cls);
            }
        }
    }
    /** Clears the mixed indicator class from the current target element */
    clearMixedIndicator() {
        if (this.currentMixedTarget && this.currentMixedClass) {
            this.currentMixedTarget.classList.remove(this.currentMixedClass);
        }
        this.currentMixedTarget = null;
        this.currentMixedClass = null;
    }
    /** Tells the drop-zone to hide its row indicator */
    hideRowIndicator() {
        const dropZone = this.host.querySelector("hbr-drop-zone");
        dropZone === null || dropZone === void 0 ? void 0 : dropZone.hideRowIndicator();
    }
    render() {
        return h("slot", { key: '60e9a5229941d57e3afc7df095dbed6ba725c8cb' });
    }
    get host() { return this; }
    static get watchers() { return {
        "widgets": ["handleWidgetsChange"]
    }; }
}, [4, "hbr-dashboard-flow", {
        "widgets": [16],
        "triggerReflow": [64]
    }, [[6, "hbr-drag-over", "handleDragOver"], [7, "dragend", "handleDragEnd"], [6, "hbr-item-dropped", "handleItemDropped"], [6, "hbr-draggable-remove", "handleDraggableRemove"]], {
        "widgets": ["handleWidgetsChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-dashboard-flow"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-dashboard-flow":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DashboardFlow);
            }
            break;
    } });
}

const HbrDashboardFlow = DashboardFlow;
const defineCustomElement = defineCustomElement$1;

export { HbrDashboardFlow, defineCustomElement };

