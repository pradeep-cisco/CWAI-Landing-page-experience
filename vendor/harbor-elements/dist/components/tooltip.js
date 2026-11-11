import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';
import { p as parseDuration } from './animate.js';
import { d as defineCustomElement$1 } from './popup.js';

const tooltipCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--hide-delay:0ms;--show-delay:0ms;--bg-color:var(--inverse-bg-weak-default);--text-color:var(--base-text-in-weak-default);--max-width:240px;--min-width:30px;--padding:var(--hbr-spacing-xs) var(--hbr-spacing-sm);--shadow:var(--hbr-shadow-xs);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal);--line-height:18px;--arrow-color:var(--bg-color);--arrow-radius:8px;--arrow-offset:calc(var(--arrow-radius) * 2);--transition-delay:0.3s;--border-width:0;--border-radius:var(--hbr-border-radius-md);--outline-width:0;--popup-z-index:var(--hbr-z-index-tooltip);--font-family:var(--hbr-font-body);display:contents}.tooltip{--arrow-size:8px;--arrow-color:var(--bg-color)}.tooltip.tooltip--small{--max-width:200px}.tooltip.tooltip--large{--max-width:360px}.tooltip::part(popup){z-index:var(--popup-z-index)}.tooltip[placement^=top]::part(popup){transform-origin:bottom}.tooltip[placement^=bottom]::part(popup){transform-origin:top}.tooltip[placement^=left]::part(popup){transform-origin:right}.tooltip[placement^=right]::part(popup){transform-origin:left}.tooltip__body{display:block;box-sizing:border-box;width:max-content;max-width:var(--max-width);min-width:var(--min-width);border-radius:var(--border-radius);background-color:var(--bg-color);font-family:var(--font-family);font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);color:var(--text-color);padding:var(--padding);box-shadow:var(--shadow);white-space:normal;overflow-wrap:break-word}.hbr-css-tooltip__anchor{width:fit-content;display:flex}.hbr-css-tooltip__anchor--empty{display:contents}";
const HbrTooltipStyle0 = tooltipCss;

const HbrTooltip = /*@__PURE__*/ proxyCustomElement(class HbrTooltip extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrTooltipDismiss = createEvent(this, "hbr-tooltip-dismiss", 7);
        this.dismissedOnClick = false;
        this.cancelHide = false;
        this.originalAnchorTooltip = "";
        this.hadAnchorTooltip = false;
        this.originalDescribedIconAttrs = new Map();
        this.handleBlur = () => {
            if (this.hasTrigger("focus")) {
                this.open = false;
            }
        };
        this.handleClick = () => {
            if (this.hasTrigger("hover")) {
                if (this.dismissOnClick) {
                    this.open = false;
                    this.dismissedOnClick = true;
                }
            }
            else if (this.hasTrigger("click")) {
                this.open = !this.open;
            }
        };
        this.handleFocus = () => {
            if (this.hasTrigger("focus")) {
                this.open = true;
            }
        };
        this.handleKeyDown = (event) => {
            // Pressing escape when the target element has focus should dismiss the tooltip
            if (this.open && event.key === "Tab") {
                event.stopPropagation();
                this.open = false;
            }
            if (event.key === "Enter" && this.hasTrigger("click")) {
                this.open = !this.open;
            }
        };
        this.handleKeyUp = (event) => {
            if (event.key === "Tab" && this.hasTrigger("hover")) {
                event.stopPropagation();
                this.open = true;
            }
        };
        this.handleDocumentKeyDown = (event) => {
            if (this.open && event.key === "Escape") {
                clearTimeout(this.hoverTimeout);
                this.open = false;
            }
        };
        this.handleMouseOver = () => {
            if (this.hasTrigger("hover")) {
                const delay = parseDuration(getComputedStyle(this.host).getPropertyValue("--show-delay"));
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = window.setTimeout(() => {
                    if (this.dismissOnClick) {
                        if (!this.dismissedOnClick) {
                            this.show();
                        }
                    }
                    else {
                        this.show();
                    }
                }, delay);
            }
        };
        this.handleMouseLeave = () => {
            if (this.dismissOnClick) {
                this.dismissedOnClick = false;
            }
        };
        this.handleMouseOut = () => {
            if (this.hasTrigger("hover")) {
                const delay = parseDuration(getComputedStyle(this.host).getPropertyValue("--hide-delay"));
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = window.setTimeout(() => {
                    this.hide();
                }, delay);
            }
        };
        this.handleAnchorSlotChange = () => {
            this.hasAnchorSlot = hasSlot(this.host);
            this.syncAnchorDescription(true);
        };
        this.handleArrowMouseLeave = () => {
            this.cancelHide = false;
            this.handleMouseOut();
        };
        this.handleArrowMouseEnter = () => {
            this.cancelHide = true;
        };
        this.hasContent = false;
        this.hasAnchorSlot = false;
        this.anchor = undefined;
        this.content = "";
        this.placement = "top";
        this.disabled = false;
        this.distance = 8;
        this.open = false;
        this.skidding = 0;
        this.trigger = "hover";
        this.hoist = false;
        this.dismissOnClick = false;
        this.size = undefined;
        this.enablePopover = false;
    }
    // Use the owning document so tooltip listeners work when rendered inside an iframe, such as docs samples.
    getDocument() {
        var _a, _b;
        return (_b = (_a = this.host) === null || _a === void 0 ? void 0 : _a.ownerDocument) !== null && _b !== void 0 ? _b : document;
    }
    getKeydownDocuments() {
        var _a, _b;
        const ownerDocument = this.getDocument();
        const documents = [ownerDocument];
        try {
            const parentDocument = (_b = (_a = ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.document;
            if (parentDocument && parentDocument !== ownerDocument) {
                documents.push(parentDocument);
            }
        }
        catch (_c) {
            // Ignore cross-origin parent frames.
        }
        return documents;
    }
    addKeydownListener() {
        for (const doc of this.getKeydownDocuments()) {
            doc.addEventListener("keydown", this.handleDocumentKeyDown);
        }
    }
    removeKeydownListener() {
        for (const doc of this.getKeydownDocuments()) {
            doc.removeEventListener("keydown", this.handleDocumentKeyDown);
        }
    }
    async handleOpenChange() {
        if (!this.popupRef)
            return;
        if (this.open) {
            if (this.disabled) {
                return;
            }
            // Show
            this.hbrShow.emit();
            // TODO: animation
            /**  await stopAnimations(this.popupContentRef); */
            if (this.popupContentRef)
                this.popupContentRef.hidden = false;
            this.popupRef.active = true;
            /**
            const { keyframes, options } = getAnimation(this.host, 'tooltip.show', { dir: "ltr" });
            await animateTo(this.popupRef.popupRef, keyframes, options);
            */
            this.hbrAfterShow.emit();
            // Dismiss on click outside
            document.addEventListener("click", this.handleBodyClick);
            this.addKeydownListener();
        }
        else {
            // Hide
            this.hbrHide.emit();
            // TODO: animation
            /**
            await stopAnimations(this.popupContentRef);
            const { keyframes, options } = getAnimation(this, 'tooltip.hide', { dir: this.localize.dir() });
            await animateTo(this.popupRef.popupRef, keyframes, options);
            */
            this.popupRef.active = false;
            if (this.popupContentRef)
                this.popupContentRef.hidden = true;
            this.hbrAfterHide.emit();
            // Remove Dismiss on click outside
            // TODO: remove event does not work in portal case, probably because handleBodyClick reference changes
            document.removeEventListener("click", this.handleBodyClick);
            this.removeKeydownListener();
        }
    }
    async handleOptionsChange() {
        var _a;
        await ((_a = this.popupRef) === null || _a === void 0 ? void 0 : _a.reposition());
    }
    handleContentChange() {
        this.syncAnchorDescription(true);
    }
    handleDisabledChange() {
        if (this.disabled && this.open) {
            this.open = false;
        }
    }
    handleAnchorChange() {
        if (this.anchor && typeof this.anchor === "string") {
            this.anchorRef = document.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLElement) {
            this.anchorRef = this.anchor;
        }
        if (this.anchorRef) {
            this.bindEventsToAnchor();
        }
        if (this.anchorRef) {
            const slot = this.anchorRef.querySelector("slot");
            if (!slot) {
                if (this.anchorRef instanceof HTMLElement) {
                    this.slottedAnchorRef = this.anchorRef;
                }
                this.syncAnchorDescription(true);
                return;
            }
            const slotted = slot === null || slot === void 0 ? void 0 : slot.assignedElements({
                flatten: true,
            })[0];
            if (slotted) {
                this.slottedAnchorRef = slotted;
            }
        }
        this.syncAnchorDescription(true);
    }
    /** Shows the tooltip. */
    async show() {
        if (this.open) {
            return undefined;
        }
        this.open = true;
    }
    /** Hides the tooltip */
    async hide() {
        if (this.cancelHide) {
            return;
        }
        if (!this.open) {
            return undefined;
        }
        this.open = false;
    }
    hasTrigger(triggerType) {
        const triggers = this.trigger.split(" ");
        return triggers.includes(triggerType);
    }
    isTargetWithin(event) {
        const target = event.target;
        return (target.closest("hbr-tooltip") === this.host ||
            target.closest(".hbr-css-tooltip__anchor") === this.anchorRef ||
            event.target === this.anchorRef);
    }
    handleBodyClick(event) {
        if (this.isTargetWithin(event))
            return;
        const hbrTooltipDismiss = this.hbrTooltipDismiss.emit();
        if (!hbrTooltipDismiss.defaultPrevented) {
            this.hide();
        }
    }
    bindEventsToAnchor() {
        this.anchorRef.addEventListener("blur", this.handleBlur, true);
        this.anchorRef.addEventListener("focus", this.handleFocus, true);
        this.anchorRef.addEventListener("click", this.handleClick);
        this.anchorRef.addEventListener("keydown", this.handleKeyDown);
        this.anchorRef.addEventListener("keyup", this.handleKeyUp);
        this.anchorRef.addEventListener("mouseover", this.handleMouseOver);
        this.anchorRef.addEventListener("mouseout", this.handleMouseOut);
        this.anchorRef.addEventListener("mouseleave", this.handleMouseLeave);
    }
    getAccessibleAnchor() {
        var _a, _b;
        const slotted = (_b = (_a = this.anchorRef) === null || _a === void 0 ? void 0 : _a.querySelector("slot")) === null || _b === void 0 ? void 0 : _b.assignedElements({ flatten: true })[0];
        if (slotted instanceof HTMLElement) {
            return slotted;
        }
        if (this.slottedAnchorRef instanceof HTMLElement) {
            return this.slottedAnchorRef;
        }
        if (this.anchorRef instanceof HTMLElement) {
            return this.anchorRef;
        }
        return null;
    }
    getDefaultSlottedAnchor() {
        var _a, _b, _c;
        if (!((_a = this.anchorRef) === null || _a === void 0 ? void 0 : _a.classList.contains("hbr-css-tooltip__anchor"))) {
            return null;
        }
        const slotted = (_c = (_b = this.anchorRef) === null || _b === void 0 ? void 0 : _b.querySelector("slot")) === null || _c === void 0 ? void 0 : _c.assignedElements({ flatten: true })[0];
        return slotted instanceof HTMLElement ? slotted : null;
    }
    getTooltipText() {
        var _a;
        if (this.hasContent) {
            const contentSlot = this.host.querySelector("[slot='content']");
            return ((_a = contentSlot === null || contentSlot === void 0 ? void 0 : contentSlot.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        }
        return (this.content || "").trim();
    }
    syncButtonTooltipProp(anchor, shouldAttach, tooltipText) {
        const buttonAnchor = anchor;
        const supportsTooltipProp = ["hbr-button", "hbr-icon-button", "hbr-radio-button"].includes(anchor.localName) && "tooltip" in buttonAnchor;
        if (this.tooltipAnchorRef && this.tooltipAnchorRef !== buttonAnchor) {
            this.restoreAnchorTooltip();
        }
        if (!supportsTooltipProp || !shouldAttach) {
            if (this.tooltipAnchorRef === buttonAnchor) {
                this.restoreAnchorTooltip();
            }
            return supportsTooltipProp;
        }
        if (!this.hadAnchorTooltip || this.tooltipAnchorRef !== buttonAnchor) {
            this.originalAnchorTooltip = buttonAnchor.tooltip || "";
            this.hadAnchorTooltip = true;
            this.tooltipAnchorRef = buttonAnchor;
        }
        if (buttonAnchor.tooltip !== tooltipText) {
            buttonAnchor.tooltip = tooltipText;
        }
        return true;
    }
    syncIconAnchorDescription(shouldAttach, tooltipText) {
        const iconAnchor = this.getDefaultSlottedAnchor();
        const shouldDescribe = (iconAnchor === null || iconAnchor === void 0 ? void 0 : iconAnchor.localName) === "hbr-icon" &&
            shouldAttach &&
            !!tooltipText &&
            this.hasTrigger("hover");
        if (this.describedIconAnchorRef &&
            this.describedIconAnchorRef !== iconAnchor) {
            this.restoreIconAnchorDescription();
        }
        if (!iconAnchor || !shouldDescribe) {
            if (!iconAnchor || this.describedIconAnchorRef === iconAnchor) {
                this.restoreIconAnchorDescription();
            }
            return;
        }
        if (this.describedIconAnchorRef !== iconAnchor) {
            this.describedIconAnchorRef = iconAnchor;
            this.originalDescribedIconAttrs.clear();
            for (const name of ["tabindex", "aria-description"]) {
                this.originalDescribedIconAttrs.set(name, iconAnchor.getAttribute(name));
            }
        }
        if (!iconAnchor.hasAttribute("tabindex")) {
            iconAnchor.setAttribute("tabindex", "0");
        }
        iconAnchor.setAttribute("aria-description", tooltipText);
    }
    syncAnchorDescription(shouldAttach) {
        const anchor = this.getAccessibleAnchor();
        if (!anchor)
            return;
        const tooltipText = this.getTooltipText();
        const shouldAttachWithText = shouldAttach && !!tooltipText;
        this.syncButtonTooltipProp(anchor, shouldAttachWithText, tooltipText);
        this.syncIconAnchorDescription(shouldAttachWithText, tooltipText);
    }
    restoreAnchorTooltip() {
        if (!this.hadAnchorTooltip || !this.tooltipAnchorRef)
            return;
        this.tooltipAnchorRef.tooltip = this.originalAnchorTooltip;
        this.originalAnchorTooltip = "";
        this.hadAnchorTooltip = false;
        this.tooltipAnchorRef = undefined;
    }
    restoreIconAnchorDescription() {
        if (!this.describedIconAnchorRef)
            return;
        for (const [name, value] of this.originalDescribedIconAttrs) {
            if (value === null) {
                this.describedIconAnchorRef.removeAttribute(name);
            }
            else {
                this.describedIconAnchorRef.setAttribute(name, value);
            }
        }
        this.describedIconAnchorRef = undefined;
        this.originalDescribedIconAttrs.clear();
    }
    handleSlotChange() {
        this.hasContent = hasSlot(this.host, "content");
        this.syncAnchorDescription(true);
    }
    connectedCallback() {
        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.hasAnchorSlot = hasSlot(this.host);
    }
    componentDidLoad() {
        var _a;
        this.handleAnchorChange();
        if (this.popupContentRef)
            this.popupContentRef.hidden = !this.open;
        // If the tooltip is visible on init, update its position
        if (this.open) {
            this.handleOpenChange();
            this.popupRef.active = true;
            (_a = this.popupRef) === null || _a === void 0 ? void 0 : _a.reposition();
        }
    }
    disconnectedCallback() {
        document.removeEventListener("click", this.handleBodyClick);
        this.removeKeydownListener();
        this.restoreAnchorTooltip();
        this.restoreIconAnchorDescription();
    }
    render() {
        return (h(Host, { key: 'b44580036ad5075702a9fd46048141dd8a324bfc' }, h("hbr-popup", { key: '17a07c58ec269f87dc61b1537941beccc116334a', part: "base", ref: (el) => {
                this.popupRef = el;
            }, anchor: this.anchor, class: Object.assign({ tooltip: true, "tooltip--open": this.open }, (this.size ? { [`tooltip--${this.size}`]: true } : null)), placement: this.placement, distance: this.distance, skidding: this.skidding, strategy: this.enablePopover || this.hoist ? "fixed" : "absolute", enablePopover: this.enablePopover, flip: true, shift: true, arrow: true, "onHbr-arrow-mouseleave": this.handleArrowMouseLeave, "onHbr-arrow-mouseenter": this.handleArrowMouseEnter }, !this.anchor ? (h("div", { slot: "anchor", class: {
                "hbr-css-tooltip__anchor": true,
                "hbr-css-tooltip__anchor--empty": !this.hasAnchorSlot,
            }, ref: (el) => {
                this.anchorRef = el;
            } }, h("slot", { onSlotchange: this.handleAnchorSlotChange }))) : null, h("div", { key: '1ffef73b50b2cdb33d79daa4a16e55635eb89903', part: "body", class: "tooltip__body", "aria-hidden": "true", onMouseLeave: () => {
                this.cancelHide = false;
                this.handleMouseOut();
            }, onMouseEnter: () => {
                this.cancelHide = true;
            }, ref: (el) => {
                this.popupContentRef = el;
            } }, h("slot", { key: '69c17040de46c7806e4d4ea7ffc726c08cc06a87', name: "content", onSlotchange: this.handleSlotChange }, this.content)))));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"],
        "content": ["handleOptionsChange", "handleContentChange"],
        "distance": ["handleOptionsChange"],
        "hoist": ["handleOptionsChange"],
        "placement": ["handleOptionsChange"],
        "skidding": ["handleOptionsChange"],
        "disabled": ["handleDisabledChange"],
        "anchor": ["handleAnchorChange"]
    }; }
    static get style() { return HbrTooltipStyle0; }
}, [1, "hbr-tooltip", {
        "anchor": [1],
        "content": [1],
        "placement": [1],
        "disabled": [516],
        "distance": [2],
        "open": [1540],
        "skidding": [2],
        "trigger": [1],
        "hoist": [516],
        "dismissOnClick": [516, "dismiss-on-click"],
        "size": [1],
        "enablePopover": [4, "enable-popover"],
        "hasContent": [32],
        "hasAnchorSlot": [32],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"],
        "content": ["handleOptionsChange", "handleContentChange"],
        "distance": ["handleOptionsChange"],
        "hoist": ["handleOptionsChange"],
        "placement": ["handleOptionsChange"],
        "skidding": ["handleOptionsChange"],
        "disabled": ["handleDisabledChange"],
        "anchor": ["handleAnchorChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tooltip", "hbr-popup"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrTooltip);
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrTooltip as H, defineCustomElement as d };

