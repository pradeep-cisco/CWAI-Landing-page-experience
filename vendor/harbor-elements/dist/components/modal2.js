//Keyboard Helpers.
//Modified from https://github.com/grommet/grommet/blob/master/src/js/components/Keyboard/Keyboard.js
const validTags = /(svg|a|area|input|select|textarea|button|iframe|div|span)$/;
const unfocusable = ["hbr-icon", "hbr-badge", "hbr-visually-hidden"];
function filterByFocusable(focusable) {
    return Array.prototype.filter.call(focusable || [], (element) => {
        const currentTag = element.tagName.toLowerCase();
        const isValidTag = currentTag.match(validTags) && element.focus;
        if (currentTag === "a") {
            return (isValidTag &&
                element.childNodes.length > 0 &&
                element.getAttribute("href"));
        }
        if (currentTag === "svg" || currentTag === "div" || currentTag === "span") {
            return (isValidTag &&
                element.hasAttribute("tabindex") &&
                element.getAttribute("tabindex") > -1);
            //Allowing focusable harbor elements to be focused
        }
        if (currentTag.includes("hbr-") && !unfocusable.includes(currentTag)) {
            return !element.disabled;
        }
        return isValidTag;
    });
}
/**
 * Returns true if the element and all of its descendants are invisible or
 * inert and therefore unreachable by a keyboard user.
 */
function isSkippable(el) {
    if (!el)
        return true;
    if (el.hasAttribute("hidden") || el.hasAttribute("inert"))
        return true;
    if (el.getAttribute("aria-hidden") === "true")
        return true;
    const style = getComputedStyle(el);
    return style.display === "none" || style.visibility === "hidden";
}
/**
 * Depth-first search through `root`'s direct children for the first (or last)
 * focusable element.  Crosses shadow-DOM boundaries and follows <slot>
 * assignments to arbitrary depth.
 */
function findFocusable(root, direction) {
    let children = Array.from(root.children);
    if (direction === "last")
        children = [...children].reverse();
    for (const child of children) {
        const el = child;
        if (isSkippable(el))
            continue;
        if (el.tagName === "SLOT") {
            const assigned = el.assignedElements({
                flatten: true,
            });
            const ordered = direction === "last" ? [...assigned].reverse() : assigned;
            for (const node of ordered) {
                const result = findFocusableIn(node, direction);
                if (result)
                    return result;
            }
            continue;
        }
        const result = findFocusableIn(el, direction);
        if (result)
            return result;
    }
    return null;
}
/**
 * Given one candidate element, returns it if it is directly focusable.
 * Otherwise recurses into its shadow root and light-DOM children.
 */
function findFocusableIn(el, direction) {
    if (isSkippable(el))
        return null;
    if (filterByFocusable([el]).length > 0) {
        const isCustom = el.tagName.includes("-");
        if (!isCustom ||
            typeof el.setFocus === "function" ||
            el.hasAttribute("tabindex")) {
            return el;
        }
    }
    if (el.shadowRoot) {
        const result = findFocusable(el.shadowRoot, direction);
        if (result)
            return result;
    }
    return findFocusable(el, direction);
}
/**
 * Called when the start sentinel (before a panel) receives focus via Shift+Tab
 * — wraps to the last focusable element inside the panel.
 */
function handleStartSentinelFocus(panel, componentName = "component") {
    const last = findFocusableIn(panel, "last");
    if (last) {
        focusEl(last, componentName);
    }
    else {
        panel === null || panel === void 0 ? void 0 : panel.focus();
    }
}
/**
 * Called when the end sentinel (after a panel) receives focus via Tab —
 * wraps to the first focusable element inside the panel.
 */
function handleEndSentinelFocus(panel, componentName = "component") {
    const first = findFocusableIn(panel, "first");
    if (first) {
        focusEl(first, componentName);
    }
    else {
        panel === null || panel === void 0 ? void 0 : panel.focus();
    }
}
/**
 * Moves focus to `el`. Prefers the Stencil `setFocus()` async API when
 * present; otherwise falls back to the standard `focus()` method.
 */
function focusEl(el, componentName = "component") {
    if (!el)
        return;
    if (el.setFocus) {
        el.setFocus().catch((err) => {
            console.warn(`[${componentName}] focusEl: setFocus() rejected`, err);
        });
        return;
    }
    el.focus();
}

let activeModals = [];
class Modal {
    constructor(element, options, overlay = true) {
        this.element = element;
        this.options = options;
        this.overlay = overlay;
        if (overlay) {
            this.handleFocusIn = this.handleFocusIn.bind(this);
        }
    }
    activate() {
        activeModals.push(this.element);
        if (this.overlay) {
            document.addEventListener("focusin", this.handleFocusIn);
        }
    }
    deactivate() {
        activeModals = activeModals.filter((modal) => modal !== this.element);
        if (this.overlay) {
            document.removeEventListener("focusin", this.handleFocusIn);
        }
    }
    isActive() {
        // The "active" modal is always the most recent one shown
        return activeModals[activeModals.length - 1] === this.element;
    }
    handleFocusIn(event) {
        var _a;
        const composedPath = typeof event.composedPath === "function" ? event.composedPath() : [];
        const focusIsInsideModal = composedPath.includes(this.element);
        // If focus is lost while the modal is active, run the onFocusOut callback
        if (this.isActive() &&
            !focusIsInsideModal &&
            typeof ((_a = this.options) === null || _a === void 0 ? void 0 : _a.onFocusOut) === "function") {
            // Allow focus in portaled content that originated from within this modal
            if (this.isFocusInOwnedPortal(composedPath)) {
                return;
            }
            this.options.onFocusOut(event);
        }
    }
    isFocusInOwnedPortal(composedPath) {
        // Check if the focused element lives inside a known external container
        // that was populated by content originating from within this modal.
        // This covers hbr-portal (.hbr__default-portal) and
        // createFloatingContainer (.hbr-floating-container).
        const externalContainers = document.querySelectorAll(".hbr__default-portal, .hbr-floating-container");
        for (const container of Array.from(externalContainers)) {
            if (!composedPath.includes(container))
                continue;
            // Verify this modal actually owns content that was moved there.
            // hbr-portal: check if the modal contains a portal targeting this container.
            const hasPortal = this.element.querySelectorAll("hbr-portal").length > 0;
            if (hasPortal)
                return true;
        }
        return false;
    }
}

export { Modal as M, handleEndSentinelFocus as a, handleStartSentinelFocus as h };

