import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const dragGhostCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}hbr-drag-ghost{display:flex;align-items:center;justify-content:center;gap:var(--hbr-spacing-xs, 8px);box-sizing:border-box;pointer-events:none;z-index:var(--hbr-z-index-drag-ghost, 1100);cursor:grabbing;position:absolute;top:-9999px;left:-9999px}hbr-drag-ghost:where(.hbr-drag-ghost--card){background-color:var(--control-bg-weak-hover);border-radius:var(--hbr-border-radius-lg);opacity:0.8;width:225px;height:195px;border:2px solid var(--control-border-hover)}.hbr-drag-ghost__icon{flex-shrink:0;font-size:var(--hbr-font-size-md);color:var(--interact-icon-medium-default)}.hbr-drag-ghost__content{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}::slotted(*){max-width:100%;overflow:hidden;text-overflow:ellipsis}";
const HbrDragGhostStyle0 = dragGhostCss;

const DragGhost = /*@__PURE__*/ proxyCustomElement(class DragGhost extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.dragCleanupListenerAdded = false;
        // ─────────────────────────────────────────────────────────────────────────────
        // EVENT HANDLERS
        // ─────────────────────────────────────────────────────────────────────────────
        this.handleIconSlotChange = () => {
            this.hasSlottedIcon = this.host.querySelector('[slot="icon"]') !== null;
        };
        this.handleGlobalDragCleanup = () => {
            this.isActive = false;
        };
        this.content = "";
        this.offsetX = 0;
        this.offsetY = 0;
        this.isActive = false;
        this.resolvedContent = "";
        this.hasSlottedIcon = false;
    }
    connectedCallback() {
        if (!this.dragCleanupListenerAdded) {
            document.addEventListener("dragend", this.handleGlobalDragCleanup, true);
            document.addEventListener("drop", this.handleGlobalDragCleanup, true);
            this.dragCleanupListenerAdded = true;
        }
    }
    disconnectedCallback() {
        if (this.dragCleanupListenerAdded) {
            document.removeEventListener("dragend", this.handleGlobalDragCleanup, true);
            document.removeEventListener("drop", this.handleGlobalDragCleanup, true);
            this.dragCleanupListenerAdded = false;
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // PUBLIC METHODS
    // ─────────────────────────────────────────────────────────────────────────────
    /**
     * Attaches this ghost as the drag image for a drag event.
     * Must be called synchronously within a dragstart event handler.
     * @param event - The DragEvent from dragstart
     * @param dragId - Optional ID to interpolate into content template
     */
    async attachToEvent(event, dragId) {
        if (!event.dataTransfer) {
            console.warn("hbr-drag-ghost: No dataTransfer on event");
            return;
        }
        // Update resolved content with dragId template
        this.resolvedContent = dragId
            ? this.content.replace(/\{id\}/g, dragId)
            : this.content;
        this.isActive = true;
        // Set as drag image - MUST be synchronous within dragstart
        event.dataTransfer.setDragImage(this.host, this.offsetX || this.host.offsetWidth / 2, this.offsetY || this.host.offsetHeight / 2);
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────────
    render() {
        // Use resolvedContent (with dragId interpolation) or fall back to content prop
        const displayContent = this.resolvedContent || this.content;
        return (h(Host, { key: 'cec84268d16d6617b964ee20ae837bee61c8eb65', class: {
                "hbr-drag-ghost": true,
                "hbr-drag-ghost--active": this.isActive,
                "hbr-drag-ghost--card": true,
                "has-slotted-icon": this.hasSlottedIcon,
            } }, !this.hasSlottedIcon && (h("span", { class: "hbr-drag-ghost__icon" }, h("slot", { name: "icon", onSlotchange: this.handleIconSlotChange }))), displayContent && (h("span", { class: "hbr-drag-ghost__content" }, displayContent)), h("slot", { key: '15a25e1b4ba3931cbdd5362cb68ce4f25a0d8a93' })));
    }
    get host() { return this; }
    static get style() { return HbrDragGhostStyle0; }
}, [4, "hbr-drag-ghost", {
        "content": [1],
        "offsetX": [2, "offset-x"],
        "offsetY": [2, "offset-y"],
        "isActive": [32],
        "resolvedContent": [32],
        "hasSlottedIcon": [32],
        "attachToEvent": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-drag-ghost"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-drag-ghost":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DragGhost);
            }
            break;
    } });
}

const HbrDragGhost = DragGhost;
const defineCustomElement = defineCustomElement$1;

export { HbrDragGhost, defineCustomElement };

