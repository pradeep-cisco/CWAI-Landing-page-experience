import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

const dropZoneCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{position:relative;display:block;--bg-color:transparent;--border:none;--min-height:48px;--indicator-marker-size:12px;min-width:0;overflow:visible}:host(.drop-zone){background-color:var(--bg-color);border:var(--border);min-height:var(--min-height)}:host(.drop-zone--empty){display:flex;justify-content:center;align-items:center}:host(.drop-zone--disabled){opacity:0.5;cursor:not-allowed}.drop-zone__label{text-align:center;user-select:none;margin:auto}.drop-zone__row-indicator{position:absolute;pointer-events:none;z-index:40;height:2px}.drop-indicator__line{position:absolute;inset:0 auto auto 0;width:100%;height:100%;border-radius:2px;background-color:var(--control-border-active)}.drop-indicator__marker-dot{position:absolute;left:calc(-1 * var(--indicator-marker-size) / 2 - 4px);top:50%;transform:translateY(-50%);pointer-events:none;transition:none;width:var(--indicator-marker-size);height:var(--indicator-marker-size);display:flex;align-items:center;justify-content:center;box-sizing:border-box;border:2px solid var(--control-border-active) !important;border-radius:50%;background:transparent}::slotted(.drop-zone__item--draggable){cursor:grab;user-select:none;transition:opacity 0.2s ease, transform 0.2s ease}::slotted(.drop-zone__item--draggable:hover){box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}::slotted(.drop-zone__item--dragging){opacity:0.5;cursor:grabbing}.drop-zone__drag-handle{cursor:grab}.drop-zone__drag-handle:active{cursor:grabbing}";
const HbrDropZoneStyle0 = dropZoneCss;

const DropZone = /*@__PURE__*/ proxyCustomElement(class DropZone extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrItemDropped = createEvent(this, "hbr-item-dropped", 7);
        this.hbrDragStart = createEvent(this, "hbr-drag-start", 7);
        this.hbrDragOver = createEvent(this, "hbr-drag-over", 7);
        this.hbrDragLeave = createEvent(this, "hbr-drag-leave", 7);
        this.dragStartListenerAdded = false;
        this.handleGlobalDragStart = (event) => {
            this.hbrDragStart.emit(event);
            if (!event.target || !(event.target instanceof HTMLElement)) {
                return;
            }
            // Find the draggable element to get its dragId
            const draggableElement = event.target.closest("hbr-draggable");
            if (!draggableElement)
                return;
            const owningDropZone = draggableElement.closest("hbr-drop-zone");
            if (owningDropZone !== this.host)
                return;
            this.dragSourceElement = draggableElement;
            const dragId = (draggableElement === null || draggableElement === void 0 ? void 0 : draggableElement.getAttribute("drag-id")) || undefined;
            // Attach ghost as the drag image (if ghost element exists)
            if (this.ghostElement) {
                this.ghostElement.attachToEvent(event, dragId);
            }
        };
        this.handleGlobalDragEnd = () => {
            this.isDragOver = false;
            this.rowIndicator = null;
            this.clearIndicatorClasses();
        };
        /**
         * Clears indicator classes from the current target element
         */
        this.clearIndicatorClasses = () => {
            if (this.currentTargetElement && this.currentIndicatorClass) {
                this.currentTargetElement.classList.remove(this.currentIndicatorClass);
            }
            this.currentTargetElement = undefined;
            this.currentIndicatorClass = undefined;
        };
        /**
         * Global dragover handler to show indicators and track position
         */
        this.handleGlobalDragOver = (event) => {
            var _a;
            event.preventDefault();
            // Only process if drag originated from this drop zone
            if (!this.dragSourceElement)
                return;
            const targetElement = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("hbr-draggable");
            // Check if target is within this drop zone
            if (targetElement) {
                const targetDropZone = targetElement.closest("hbr-drop-zone");
                if (targetDropZone !== this.host) {
                    this.clearIndicatorClasses();
                    return;
                }
            }
            this.isDragOver = true;
            if (!targetElement) {
                this.clearIndicatorClasses();
                return;
            }
            const targetRect = targetElement.getBoundingClientRect();
            const pointerX = event.clientX;
            const pointerY = event.clientY;
            // Calculate simple indicator edge based on direction
            let indicatorEdge;
            if (this.direction === "horizontal") {
                const centerX = targetRect.left + targetRect.width / 2;
                indicatorEdge = pointerX < centerX ? "left" : "right";
            }
            else {
                const centerY = targetRect.top + targetRect.height / 2;
                indicatorEdge = pointerY < centerY ? "top" : "bottom";
            }
            const orientationPrefix = this.direction === "horizontal" ? "horizontal" : "vertical";
            const positionSuffix = indicatorEdge === "top" || indicatorEdge === "left" ? "before" : "after";
            const newIndicatorClass = `hbr-drag-over--${orientationPrefix}-${positionSuffix}`;
            if (this.currentTargetElement !== targetElement ||
                this.currentIndicatorClass !== newIndicatorClass) {
                this.clearIndicatorClasses();
                targetElement.classList.add(newIndicatorClass);
                this.currentTargetElement = targetElement;
                this.currentIndicatorClass = newIndicatorClass;
            }
            // Store indicatorEdge for use in handleDrop
            this.currentIndicatorEdge = indicatorEdge;
            // Emit drag over event
            const detail = {
                dragElement: this.dragSourceElement || null,
                targetElement,
                pointer: { x: pointerX, y: pointerY },
                targetEntry: { element: targetElement, rect: targetRect },
                indicator: indicatorEdge,
                event,
            };
            this.hbrDragOver.emit(detail);
        };
        this.getDragData = (event) => {
            const dataTransfer = event.dataTransfer;
            if (!dataTransfer) {
                throw new Error("No data transfer available");
            }
            const id = dataTransfer.getData("text/plain") || "";
            const data = dataTransfer.getData("application/json") || undefined;
            const operation = dataTransfer.dropEffect || "move";
            return {
                id,
                data,
                operation,
            };
        };
        this.handleGhostSlotChange = (event) => {
            const slot = event.target;
            const elements = slot.assignedElements();
            if (elements.length > 0) {
                const slottedElement = elements[0];
                // It's a drag-ghost component (native drag)
                this.ghostElement = slottedElement;
            }
            else {
                // Slotted element was removed
                this.ghostElement = undefined;
            }
        };
        this.handleDragLeave = (event) => {
            const relatedTarget = event.relatedTarget;
            if (relatedTarget && this.host.contains(relatedTarget))
                return;
            this.isDragOver = false;
            this.clearIndicatorClasses();
            this.hbrDragLeave.emit(event);
        };
        this.handleDrop = (event) => {
            var _a;
            if (this.disabled)
                return;
            event.preventDefault();
            const targetElement = ((_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("hbr-draggable")) || null;
            const indicator = this.currentIndicatorEdge;
            // Reset state
            this.isDragOver = false;
            this.currentIndicatorEdge = null;
            this.clearIndicatorClasses();
            try {
                // Parse drag data from the event
                const dragData = this.getDragData(event);
                // Emit drop event with full context including indicator
                this.hbrItemDropped.emit({
                    dragData,
                    dragElement: this.dragSourceElement,
                    targetElement: targetElement,
                    indicator,
                    event,
                });
            }
            catch (error) {
                console.error("Error handling drop:", error);
                // Emit basic drop event even on error
                this.hbrItemDropped.emit({
                    dragElement: this.dragSourceElement,
                    targetElement,
                    indicator,
                    event,
                });
            }
        };
        this.isDragOver = false;
        this.rowIndicator = null;
        this.label = "Drop here";
        this.disabled = false;
        this.direction = "vertical";
        this.contained = false;
    }
    connectedCallback() {
        // Always add dragstart listener for containment tracking
        if (!this.dragStartListenerAdded) {
            document.addEventListener("dragstart", this.handleGlobalDragStart, true);
            // Use bubble phase (false) for dragover so we can override after other handlers
            document.addEventListener("dragover", this.handleGlobalDragOver, false);
            document.addEventListener("dragend", this.handleGlobalDragEnd, true);
            this.dragStartListenerAdded = true;
        }
    }
    /** Show a row indicator at the given position */
    async showRowIndicator(position) {
        this.rowIndicator = position;
    }
    /** Hide the row indicator */
    async hideRowIndicator() {
        this.rowIndicator = null;
    }
    disconnectedCallback() {
        if (this.dragStartListenerAdded) {
            document.removeEventListener("dragstart", this.handleGlobalDragStart, true);
            document.removeEventListener("dragover", this.handleGlobalDragOver, false);
            document.removeEventListener("dragend", this.handleGlobalDragEnd, true);
            this.dragStartListenerAdded = false;
        }
    }
    render() {
        return (h(Host, { key: '725a01415387fdf636a2104ed3ca98241baaf9a6', class: {
                "drop-zone": true,
                "drop-zone--drag-over": this.isDragOver,
                "drop-zone--disabled": this.disabled,
                "drop-zone--horizontal": this.direction === "horizontal",
                "drop-zone--vertical": this.direction === "vertical",
            }, onDragLeave: this.handleDragLeave, onDrop: this.handleDrop }, h("slot", { key: 'a2e19ea481014dbd94b3aee9eb28a9307eae3666', name: "ghost", onSlotchange: this.handleGhostSlotChange }), this.rowIndicator && (h("div", { class: "drop-zone__row-indicator", "aria-hidden": "true", style: Object.assign(Object.assign({ left: "0px", right: "0px" }, (this.rowIndicator.top !== undefined
                ? { top: `${this.rowIndicator.top}px` }
                : {})), (this.rowIndicator.bottom !== undefined
                ? { bottom: `${this.rowIndicator.bottom}px` }
                : {})) }, h("div", { class: "drop-indicator__line" }), h("div", { class: "drop-indicator__marker-dot" }))), h("slot", { key: '383c312a3d86874838fe6d02cf1bdeb349d1a516' })));
    }
    get host() { return this; }
    static get style() { return HbrDropZoneStyle0; }
}, [1, "hbr-drop-zone", {
        "label": [1],
        "disabled": [4],
        "direction": [1],
        "contained": [516],
        "isDragOver": [32],
        "rowIndicator": [32],
        "showRowIndicator": [64],
        "hideRowIndicator": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-drop-zone"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-drop-zone":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DropZone);
            }
            break;
    } });
}

const HbrDropZone = DropZone;
const defineCustomElement = defineCustomElement$1;

export { HbrDropZone, defineCustomElement };

