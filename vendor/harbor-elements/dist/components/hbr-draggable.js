import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { o as statusNegative, e as dotsSix, t as trashSimple } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$5 } from './icon.js';
import { d as defineCustomElement$6 } from './button.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './spinner.js';
import { d as defineCustomElement$2 } from './tooltip.js';

/**
 * Accessibility utilities for the draggable component
 * Handles keyboard navigation, ARIA attributes, and screen reader support
 *
 * ## Keyboard Drag and Drop Instructions
 *
 * Users can drag and drop items using only the keyboard:
 *
 * 1. **Navigate to item**: Use Tab to focus on a draggable item
 * 2. **Pick up item**: Press Space or Enter to grab the item
 *    - The item will be visually highlighted to indicate it's grabbed
 *    - Screen readers will announce "grabbed"
 * 3. **Move item**: Use Arrow keys to move the item:
 *    - Arrow Up / Arrow Down: Move to previous/next row
 *    - Arrow Left / Arrow Right: Move to previous/next position in row
 * 4. **Drop item**: Press Space or Enter to drop the item at the new position
 *    - Screen readers will announce the new position
 * 5. **Cancel**: Press Escape to cancel the drag and return the item to its original position
 *
 * ## Screen Reader Announcements
 *
 * - When grabbed: "Item grabbed. Use arrow keys to move, Space or Enter to drop, Escape to cancel"
 * - During movement: "Position X of Y" (announces current position)
 * - When dropped: "Item dropped at position X"
 * - When cancelled: "Drag cancelled"
 */
/** ARIA attributes for draggable elements */
const DRAGGABLE_ARIA = {
    role: "button",
    roledescription: "draggable",
    grabbed: {
        true: "true",
        false: "false",
    },
};
/** CSS classes for drag states */
const DRAG_CLASSES = {
    dragging: "hbr-draggable--dragging",
    selected: "hbr-draggable--selected",
    multiSelect: "hbr-draggable--multi-select",
    keyboardGrabbed: "hbr-draggable--keyboard-grabbed",
    handle: "hbr-draggable__handle",
};
/** Arrow key to direction mapping */
const ARROW_KEY_DIRECTIONS = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
};
/**
 * Set the grabbed state on an element
 */
function setGrabbedState(element, grabbed) {
    element.setAttribute("aria-grabbed", grabbed ? DRAGGABLE_ARIA.grabbed.true : DRAGGABLE_ARIA.grabbed.false);
}
/**
 * Apply visual grab state classes to an element
 */
function applyGrabStateClasses(element, options = {}) {
    if (options.dragging) {
        element.classList.add(DRAG_CLASSES.dragging);
    }
    if (options.keyboardGrabbed) {
        element.classList.add(DRAG_CLASSES.keyboardGrabbed);
    }
    if (options.selected) {
        element.classList.add(DRAG_CLASSES.selected);
    }
    if (options.multiSelect) {
        element.classList.add(DRAG_CLASSES.multiSelect);
    }
}
/**
 * Remove visual grab state classes from an element
 */
function removeGrabStateClasses(element) {
    element.classList.remove(DRAG_CLASSES.dragging);
    element.classList.remove(DRAG_CLASSES.keyboardGrabbed);
    element.classList.remove(DRAG_CLASSES.selected);
    element.classList.remove(DRAG_CLASSES.multiSelect);
}
/**
 * Keyboard handler class for draggable accessibility
 * Manages keyboard navigation, grab state, and emits appropriate events
 */
class DraggableKeyboardHandler {
    constructor(context) {
        this.keyboardGrabbed = false;
        /**
         * Keyboard event handler - attach this to the element's keydown event
         */
        this.onKeyDown = (event) => {
            const target = this.context.getSlottedChild();
            if (!target)
                return;
            console.log("[Draggable A11y] onKeyDown:", event.key, "keyboardGrabbed:", this.keyboardGrabbed);
            // Handle Space/Enter for grab toggle or drop
            if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                if (this.keyboardGrabbed) {
                    console.log("[Draggable A11y] Dropping...");
                    this.handleDrop();
                }
                else {
                    console.log("[Draggable A11y] Grabbing...");
                    this.handleGrab(true);
                }
                return;
            }
            // Handle arrow keys when grabbed
            if (this.keyboardGrabbed && ARROW_KEY_DIRECTIONS[event.key]) {
                event.preventDefault();
                this.handleMove(ARROW_KEY_DIRECTIONS[event.key]);
                return;
            }
            // Handle Escape to cancel
            if (event.key === "Escape" && this.keyboardGrabbed) {
                event.preventDefault();
                this.handleGrab(false);
            }
        };
        this.context = context;
    }
    /**
     * Get the current index of the draggable within its parent
     */
    getOriginalIndex() {
        const host = this.context.getHost();
        const parent = host.parentElement;
        if (!parent)
            return -1;
        const siblings = Array.from(parent.children);
        return siblings.indexOf(host);
    }
    /**
     * Check if keyboard grab is active
     */
    isGrabbed() {
        return this.keyboardGrabbed;
    }
    /**
     * Handle keyboard grab state changes
     */
    handleGrab(grabbed) {
        const target = this.context.getSlottedChild();
        const slottedChild = this.context.getSlottedChild();
        const host = this.context.getHost();
        if (!target)
            return;
        setGrabbedState(target, grabbed);
        this.keyboardGrabbed = grabbed;
        if (grabbed) {
            host.classList.add("dragging");
            if (slottedChild) {
                applyGrabStateClasses(slottedChild, {
                    dragging: true,
                    keyboardGrabbed: true,
                });
            }
        }
        else {
            host.classList.remove("dragging");
            if (slottedChild) {
                removeGrabStateClasses(slottedChild);
            }
        }
        this.context.emitters.onKeyboardGrab({
            grabbed,
            id: this.context.getDragId(),
            element: slottedChild,
            originalIndex: this.getOriginalIndex(),
        });
    }
    /**
     * Handle keyboard move requests
     */
    handleMove(direction) {
        this.context.emitters.onKeyboardMove({
            direction,
            id: this.context.getDragId(),
            element: this.context.getSlottedChild(),
        });
    }
    /**
     * Handle keyboard drop confirmation
     */
    handleDrop() {
        console.log("[Draggable A11y] handleDrop called, emitting keyboard-drop event");
        this.context.emitters.onKeyboardDrop({
            id: this.context.getDragId(),
            element: this.context.getSlottedChild(),
        });
        // Reset grab state after drop
        this.handleGrab(false);
    }
    /**
     * Reset the keyboard handler state
     */
    reset() {
        if (this.keyboardGrabbed) {
            this.handleGrab(false);
        }
    }
}

const draggableCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;position:relative;--indicator-gap:16px;--border-width:0px;--indicator-line-size:2px;--indicator-bg-color:var(--control-border-active);--indicator-marker-size:12px;--indicator-marker-offset:calc(var(--indicator-marker-size) / 2);--indicator-marker-edge-offset:calc(-1 * var(--indicator-marker-size));--width:auto;width:var(--width)}::slotted(*){display:block;width:100%;height:100%}:host(.hbr-draggable--hidden.dragging){opacity:0 !important;pointer-events:none}:host(.hbr-draggable--pointer-dragging){cursor:grabbing;box-shadow:var(--hbr-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));opacity:0.95;position:fixed;z-index:9999;pointer-events:none;margin:0}.overlay{position:absolute;inset:calc(-1 * var(--border-width, 0px));display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:10}.overlay::before{content:\"\";position:absolute;inset:0;background:var(--interact-bg-weak-hover);border-radius:calc(var(--overlay-border-radius, var(--hbr-border-radius-xl, 12px)) - var(--border-width, 0px));opacity:0;transition:opacity 0.15s ease;z-index:-1}.overlay--dragging::before{opacity:0.6}:host(:hover) .overlay::before,:host(:focus-visible) .overlay::before{background-color:var(--interact-bg-weak-hover);opacity:0.6}:host(:hover) .overlay::after,:host(.dragging) .overlay::after{content:\"\";position:absolute;inset:0;border:var(--hbr-border-width) solid var(--control-border-hover);border-radius:calc(var(--overlay-border-radius, var(--hbr-border-radius-xl, 12px)) - var(--border-width, 0px));pointer-events:none}:host(:focus-visible) .overlay::before{box-shadow:inset 0 0 0 1px var(--control-border-hover)}.drop-indicator{position:absolute;inset:0;z-index:20;pointer-events:none}.drop-indicator__line{position:absolute;opacity:0;transform:scale(0.92);transition:opacity 90ms cubic-bezier(0.2, 0, 0, 1), transform 90ms cubic-bezier(0.2, 0, 0, 1);pointer-events:none;background-color:var(--indicator-bg-color);border-radius:3px}.drop-indicator__marker{position:absolute;opacity:0;visibility:hidden;pointer-events:none;transition:none;width:var(--indicator-marker-size);height:var(--indicator-marker-size);display:flex;align-items:center;justify-content:center}.drop-indicator__marker-dot{box-sizing:border-box;width:100%;height:100%;border:2px solid var(--control-border-active) !important;border-radius:50%;background:transparent}.drop-indicator__marker-icon{display:none;font-size:var(--hbr-font-size-md);line-height:1}:host(.hbr-drag-over--vertical-before) .drop-indicator__line,:host(.hbr-drag-over--vertical-after) .drop-indicator__line,:host(.hbr-drag-over--horizontal-before) .drop-indicator__line,:host(.hbr-drag-over--horizontal-after) .drop-indicator__line{opacity:1;transform:scale(1);transition-duration:120ms}:host(.hbr-drag-over--vertical-before) .drop-indicator__marker,:host(.hbr-drag-over--vertical-after) .drop-indicator__marker,:host(.hbr-drag-over--horizontal-before) .drop-indicator__marker,:host(.hbr-drag-over--horizontal-after) .drop-indicator__marker{opacity:1;visibility:visible}:host(.hbr-drag-over--vertical-before) .drop-indicator__line,:host(.hbr-drag-over--vertical-after) .drop-indicator__line{left:-2px;right:0;height:var(--indicator-line-size)}:host(.hbr-drag-over--vertical-before) .drop-indicator__line{top:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-line-size) / 2)}:host(.hbr-drag-over--vertical-after) .drop-indicator__line{bottom:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-line-size) / 2)}:host(.hbr-drag-over--horizontal-before) .drop-indicator__line,:host(.hbr-drag-over--horizontal-after) .drop-indicator__line{top:-2px;bottom:0;width:var(--indicator-line-size)}:host(.hbr-drag-over--horizontal-before) .drop-indicator__line{left:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-line-size) / 2)}:host(.hbr-drag-over--horizontal-after) .drop-indicator__line{right:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-line-size) / 2)}:host(.hbr-drag-over--horizontal-before) .drop-indicator__marker{top:var(--indicator-marker-edge-offset);left:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-offset))}:host(.hbr-drag-over--horizontal-after) .drop-indicator__marker{top:var(--indicator-marker-edge-offset);right:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-offset))}:host(.hbr-drag-over--vertical-before) .drop-indicator__marker{left:var(--indicator-marker-edge-offset);top:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-offset))}:host(.hbr-drag-over--vertical-after) .drop-indicator__marker{left:var(--indicator-marker-edge-offset);bottom:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-offset))}:host(.hbr-drag-over--invalid){--indicator-marker-size:16px}:host(.hbr-drag-over--invalid) .drop-indicator__marker-icon{display:block}:host(.hbr-drag-over--invalid) .drop-indicator__marker-dot{display:none}:host(.hbr-drag-over--invalid) .drop-indicator__line{background-color:var(--negative-border-default)}:host(.hbr-drag-over--invalid.hbr-drag-over--horizontal-before) .drop-indicator__marker{top:calc(-1 * var(--indicator-marker-size) / 1.3);left:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-size) / 2)}:host(.hbr-drag-over--invalid.hbr-drag-over--horizontal-after) .drop-indicator__marker{top:calc(-1 * var(--indicator-marker-size) / 1.3);right:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-size) / 2)}:host(.hbr-drag-over--invalid.hbr-drag-over--vertical-before) .drop-indicator__marker{left:calc(-1 * var(--indicator-marker-size));top:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-size) / 2)}:host(.hbr-drag-over--invalid.hbr-drag-over--vertical-after) .drop-indicator__marker{left:calc(-1 * var(--indicator-marker-size));bottom:calc(var(--indicator-distance, calc(-1 * var(--indicator-gap) / 2 + var(--border-width))) - var(--indicator-marker-size) / 2)}.overlay__handle-icon{color:var(--interact-icon-medium-default, var(--interact-icon-medium-hover));transition:color 0.15s ease}:host(:hover) .overlay__handle-icon,:host(:focus-visible) .overlay__handle-icon{color:var(--interact-icon-medium-hover)}.overlay__handle-icon{display:flex;align-items:center;justify-content:center;font-size:var(--overlay-icon-size, 32px);color:var(--interact-icon-medium-default, var(--interact-icon-medium-hover));transition:color 0.15s ease}:host(:hover) .overlay__handle-icon,:host(:focus-visible) .overlay__handle-icon{color:var(--interact-icon-medium-hover)}.delete-button{position:absolute;top:var(--hbr-spacing-md, 16px);right:var(--hbr-spacing-md, 16px);z-index:15}.delete-button:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-md)}.delete-button>hbr-icon{font-size:var(--hbr-font-size-sm, 14px)}";
const HbrDraggableStyle0 = draggableCss;

const Draggable = /*@__PURE__*/ proxyCustomElement(class Draggable extends HTMLElement {
    /**
     * Get the first slotted child element
     */
    get slottedChild() {
        return this.host.firstElementChild;
    }
    /**
     * Computed property to determine if overlay should be shown.
     */
    get shouldoverlay() {
        return this.overlay;
    }
    get shouldShowOverlayIcon() {
        return this.shouldoverlay && this.overlayIcon;
    }
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrDragStart = createEvent(this, "hbr-drag-start", 7);
        this.hbrDragEnd = createEvent(this, "hbr-drag-end", 7);
        this.hbrKeyboardGrab = createEvent(this, "hbr-keyboard-grab", 7);
        this.hbrKeyboardMove = createEvent(this, "hbr-keyboard-move", 7);
        this.hbrKeyboardDrop = createEvent(this, "hbr-keyboard-drop", 7);
        this.hbrDraggableRemove = createEvent(this, "hbr-draggable-remove", 7);
        this.onDragStart = (event) => {
            var _a;
            // Only the innermost draggable that initiated the drag should handle it.
            // This prevents parent draggables in nested layouts from overwriting drag data.
            const sourceDraggable = event
                .composedPath()
                .find((node) => node instanceof HTMLElement &&
                node.tagName.toLowerCase() === "hbr-draggable");
            if (sourceDraggable !== this.host)
                return;
            const parent = this.host.parentElement;
            const originalIndex = parent
                ? Array.from(parent.children).indexOf(this.host)
                : -1;
            let parsedData = this.dragData;
            if (this.dragData) {
                try {
                    parsedData = JSON.parse(this.dragData);
                }
                catch (_b) {
                    parsedData = this.dragData;
                }
            }
            const dragInfo = {
                id: this.dragId,
                data: parsedData,
                originalIndex,
            };
            event.dataTransfer.setData("application/json", JSON.stringify(dragInfo));
            event.dataTransfer.setData("text/plain", this.dragData || this.dragId);
            const effectByOperation = {
                copy: "copy",
                move: "move",
                reorder: "move",
            };
            event.dataTransfer.effectAllowed =
                (_a = effectByOperation[this.operation]) !== null && _a !== void 0 ? _a : "all";
            this.host.classList.add("dragging");
            if (this.slottedChild) {
                applyGrabStateClasses(this.slottedChild, {
                    dragging: !this.overlay,
                });
            }
            this.hbrDragStart.emit({
                id: this.dragId,
                data: this.dragData,
                element: this.slottedChild,
            });
            setTimeout(() => {
                this.isDragging = true;
            }, 0);
        };
        this.onDragEnd = (event) => {
            this.host.classList.remove("dragging");
            this.isDragging = false;
            if (this.slottedChild) {
                removeGrabStateClasses(this.slottedChild);
            }
            if (this.host.isConnected) {
                this.hbrDragEnd.emit({
                    id: this.dragId,
                    success: event.dataTransfer.dropEffect !== "none",
                });
            }
        };
        this.onDeleteClick = (event) => {
            this.hbrDraggableRemove.emit({
                id: this.dragId,
                data: this.dragData,
                element: this.slottedChild,
                event,
            });
        };
        this.onDeleteKeyDown = (event) => {
            if (event.key === "Enter") {
                this.onDeleteClick(event);
            }
        };
        this.stopDragFromDelete = (event) => {
            event.stopPropagation();
            if ("preventDefault" in event)
                event.preventDefault();
        };
        this.operation = "move";
        this.dragId = undefined;
        this.dragData = undefined;
        this.overlay = true;
        this.overlayIcon = true;
        this.delete = false;
        this.i18n = { rowFull: "Row is full" };
        this.isDragging = false;
        // Initialize keyboard handler with context
        this.keyboardHandler = new DraggableKeyboardHandler({
            getHost: () => this.host,
            getSlottedChild: () => this.slottedChild,
            getDragId: () => this.dragId,
            emitters: {
                onKeyboardGrab: (detail) => this.hbrKeyboardGrab.emit(detail),
                onKeyboardMove: (detail) => this.hbrKeyboardMove.emit(detail),
                onKeyboardDrop: (detail) => this.hbrKeyboardDrop.emit(detail),
            },
        });
    }
    disconnectedCallback() {
        if (this.slottedChild) {
            removeGrabStateClasses(this.slottedChild);
        }
        this.keyboardHandler.reset();
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: '28ea33e106db1746c7ca3bb58eb2e17503fa0b37', class: {
                dragging: this.isDragging,
            }, draggable: "true", tabindex: 0, role: DRAGGABLE_ARIA.role, "aria-roledescription": DRAGGABLE_ARIA.roledescription, "aria-grabbed": this.isDragging ? "true" : "false", style: {
                cursor: this.isDragging ? "grabbing" : "grab",
            }, onDragStart: this.onDragStart, onDragEnd: this.onDragEnd, onKeyDown: this.keyboardHandler.onKeyDown }, h("slot", { key: '07f8c6081e806801ce06d5e860130cf2ac5ce7d5' }), h("div", { key: '49a80d2475af31b6ab4b60f78f154ec53b248128', class: "drop-indicator", "aria-hidden": "true" }, h("div", { key: 'f430c95d570e3cb5afd41c45040225b0267b04a0', class: "drop-indicator__line" }), h("div", { key: '94315153c4924d603dc39b8e33471cdfd654fe6c', class: "drop-indicator__marker" }, h("div", { key: 'd45c943ce104f47ce103ce838e5beb8e6a7cc437', class: "drop-indicator__marker-dot" }), h("div", { key: '57903456e2f90c90fb35e926a7a61c62779ac713', class: "drop-indicator__marker-icon", slot: "invalid-icon" }, h("hbr-tooltip", { key: '0f936103846d65b3d5588007fdd5391415a4055c', content: this.i18n.rowFull, placement: "top", open: true, exportparts: "base:drop-indicator-invalid-tooltip, base__popup:drop-indicator-invalid-tooltip__popup, base__arrow:drop-indicator-invalid-tooltip__arrow" }, h("hbr-icon", { key: '6adee78b0020dac30759d014afa8e29749046766', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["status-negative"]) || statusNegative, sentiment: "danger", exportparts: "base:drop-indicator-invalid-icon" }))))), this.shouldoverlay && (h("div", { class: {
                overlay: true,
                "overlay--dragging": this.isDragging,
            }, part: "overlay" }, this.shouldShowOverlayIcon && (h("slot", { name: "overlay-handle" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix, class: "overlay__handle-icon", exportparts: "base:overlay-handle" }))))), this.delete && (h("slot", { name: "delete-button" }, h("hbr-button", { variant: "outline", class: "delete-button", arialabel: "Delete item", exportparts: "base:delete-button", onClick: this.onDeleteClick, onKeyDown: this.onDeleteKeyDown, onMouseDown: this.stopDragFromDelete, onPointerDown: this.stopDragFromDelete, onDragStart: this.stopDragFromDelete, sentiment: "negative", size: "small" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["trash-simple"]) || trashSimple, exportparts: "base:delete-button-icon" }))))));
    }
    get host() { return this; }
    static get style() { return HbrDraggableStyle0; }
}, [1, "hbr-draggable", {
        "operation": [1],
        "dragId": [513, "drag-id"],
        "dragData": [1, "drag-data"],
        "overlay": [516],
        "overlayIcon": [516, "overlay-icon"],
        "delete": [4],
        "i18n": [16],
        "isDragging": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-draggable", "hbr-button", "hbr-icon", "hbr-popup", "hbr-spinner", "hbr-tooltip"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-draggable":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Draggable);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrDraggable = Draggable;
const defineCustomElement = defineCustomElement$1;

export { HbrDraggable, defineCustomElement };

