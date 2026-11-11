//
//
// Given a slot, this function iterates over all of its assigned text nodes and returns the concatenated text as a
// string. This is useful because we can't use slot.textContent as an alternative.
//
function getTextContent(slot) {
    const nodes = slot ? slot.assignedNodes({ flatten: true }) : [];
    let text = "";
    [...nodes].map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        }
    });
    return text;
}
//
// Determines whether an element has a slot. If name is specified, the function will look for a corresponding named
// slot, otherwise it will look for a "default" slot (e.g. a non-empty text node or an element with no slot attribute).
//
function hasSlot(el, name) {
    // Look for a named slot
    if (name) {
        return el.querySelector(`[slot="${name}"]`) !== null;
    }
    // Look for a default slot
    return Array.from(el.childNodes).some((node) => {
        if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
            return true;
        }
        if (node.nodeType === node.ELEMENT_NODE) {
            const el = node;
            if (!el.hasAttribute("slot")) {
                return true;
            }
        }
        return false;
    });
}
function hasNamedSlot(hostEl, name) {
    return hostEl.querySelector(`:scope > [slot="${name}"]`) !== null;
}
function hasDefaultSlot(hostEl) {
    return [...hostEl.childNodes].some((node) => {
        var _a;
        if (node.nodeType === node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== "") {
            return true;
        }
        if (node.nodeType === node.ELEMENT_NODE) {
            const el = node;
            const tagName = el.tagName.toLowerCase();
            // Ignore visually hidden elements since they aren't rendered
            if (tagName === "hbr-visually-hidden") {
                return false;
            }
            // If it doesn't have a slot attribute, it's part of the default slot
            if (!el.hasAttribute("slot")) {
                return true;
            }
        }
        return false;
    });
}
function testSlot(slotName, hostEl) {
    return slotName === "[default]"
        ? hasDefaultSlot(hostEl)
        : hasNamedSlot(hostEl, slotName);
}

export { hasNamedSlot as a, hasDefaultSlot as b, getTextContent as g, hasSlot as h, testSlot as t };

