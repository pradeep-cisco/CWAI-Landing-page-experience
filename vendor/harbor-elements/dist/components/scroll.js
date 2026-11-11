import { c as getOffset } from './browser.js';

const locks = new Set();
//
// Prevents body scrolling. Keeps track of which elements requested a lock so multiple levels of locking are possible
// without premature unlocking.
//
function lockBodyScrolling(lockingEl) {
    locks.add(lockingEl);
    document.body.classList.add("hbr-scroll-lock");
}
//
// Unlocks body scrolling. Scrolling will only be unlocked once all elements that requested a lock call this method.
//
function unlockBodyScrolling(lockingEl) {
    locks.delete(lockingEl);
    if (locks.size === 0) {
        document.body.classList.remove("hbr-scroll-lock");
    }
}
//
// Scrolls an element into view of its container. If the element is already in view, nothing will happen.
//
function scrollIntoView(element, container, direction = "vertical", behavior = "smooth") {
    const offset = getOffset(element, container);
    const offsetTop = offset.top + container.scrollTop;
    const offsetLeft = offset.left + container.scrollLeft;
    const minX = container.scrollLeft;
    const maxX = container.scrollLeft + container.offsetWidth;
    const minY = container.scrollTop;
    const maxY = container.scrollTop + container.offsetHeight;
    if (direction === "horizontal" || direction === "both") {
        if (offsetLeft < minX) {
            container.scrollTo({ left: offsetLeft, behavior });
        }
        else if (offsetLeft + element.clientWidth > maxX) {
            container.scrollTo({
                left: offsetLeft - container.offsetWidth + element.clientWidth,
                behavior,
            });
        }
    }
    if (direction === "vertical" || direction === "both") {
        if (offsetTop < minY) {
            container.scrollTo({ top: offsetTop, behavior });
        }
        else if (offsetTop + element.clientHeight > maxY) {
            container.scrollTo({
                top: offsetTop - container.offsetHeight + element.clientHeight,
                behavior,
            });
        }
    }
}

export { lockBodyScrolling as l, scrollIntoView as s, unlockBodyScrolling as u };

