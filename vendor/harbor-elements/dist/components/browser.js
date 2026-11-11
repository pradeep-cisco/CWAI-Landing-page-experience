const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};
//
// Determines if the browser supports focus({ preventScroll })
//
function isPreventScrollSupported() {
    let supported = false;
    document.createElement("div").focus({
        get preventScroll() {
            supported = true;
            return false;
        },
    });
    return supported;
}
const addConstructedStyle = (shadowRoot, sheet) => {
    const index = shadowRoot.adoptedStyleSheets.indexOf((s) => s === sheet);
    if (index !== -1) {
        shadowRoot.adoptedStyleSheets[index] = sheet;
    }
    else {
        shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
    }
};
//
// Returns an element's offset relative to its parent. Similar to element.offsetTop and element.offsetLeft, except the
// parent doesn't have to be positioned relative or absolute.
//
// NOTE: This was created to work around what appears to be a bug in Chrome where a slotted element's offsetParent
// seems to ignore elements inside the surrounding shadow DOM: https://bugs.chromium.org/p/chromium/issues/detail?id=920069
//
function getOffset(element, parent) {
    return {
        top: Math.round(element.getBoundingClientRect().top - parent.getBoundingClientRect().top),
        left: Math.round(element.getBoundingClientRect().left - parent.getBoundingClientRect().left),
    };
}
/** Waits for a specific event to be emitted from an element. Ignores events that bubble up from child elements. */
function waitForEvent(el, eventName) {
    return new Promise((resolve) => {
        function done(event) {
            if (event.target === el) {
                el.removeEventListener(eventName, done);
                resolve();
            }
        }
        el.addEventListener(eventName, done);
    });
}
function isTabbable(el) {
    const tabIndex = el.tabIndex;
    return tabIndex > -1;
}
function getNearestTabbableElement(el) {
    // Check the element
    if (isTabbable(el)) {
        return el;
    }
    // Check the element's shadow root
    if (el.shadowRoot) {
        const tabbableShadowChild = Array.from(el.shadowRoot.children).find(isTabbable);
        if (tabbableShadowChild) {
            return tabbableShadowChild;
        }
    }
    // Check the element's children
    if (el.children) {
        return Array.from(el.children).map(getNearestTabbableElement)[0];
    }
    return null;
}

export { addConstructedStyle as a, isSafari as b, getOffset as c, getNearestTabbableElement as g, isPreventScrollSupported as i, waitForEvent as w };

