function debounce(func, wait = 0, options = {}) {
    var _a;
    if (typeof func !== "function") {
        throw new TypeError("Expected a function");
    }
    let lastArgs;
    let lastThis;
    let result;
    let timerId;
    let lastCallTime;
    let lastInvokeTime = 0;
    const leading = !!options.leading;
    const trailing = "trailing" in options ? !!options.trailing : true;
    const maxing = "maxWait" in options;
    const maxWait = maxing ? Math.max((_a = options.maxWait) !== null && _a !== void 0 ? _a : 0, wait) : undefined;
    function now() {
        return Date.now();
    }
    function invokeFunc(time) {
        if (!lastArgs) {
            return result;
        }
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = undefined;
        lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function startTimer(pendingFunc, ms) {
        return setTimeout(pendingFunc, ms);
    }
    function cancelTimer(id) {
        clearTimeout(id);
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        const timeSinceLastCall = time - (lastCallTime !== null && lastCallTime !== void 0 ? lastCallTime : 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        return maxing
            ? Math.min(timeWaiting, (maxWait !== null && maxWait !== void 0 ? maxWait : 0) - timeSinceLastInvoke)
            : timeWaiting;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - (lastCallTime !== null && lastCallTime !== void 0 ? lastCallTime : 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= (maxWait !== null && maxWait !== void 0 ? maxWait : 0)));
    }
    function timerExpired() {
        const time = now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = startTimer(timerExpired, remainingWait(time));
        return undefined;
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = undefined;
        lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = undefined;
        lastCallTime = undefined;
        lastThis = undefined;
        timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(now());
    }
    function debounced(...args) {
        const time = now();
        const isInvoking = shouldInvoke(time);
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                if (timerId) {
                    cancelTimer(timerId);
                }
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
const each = (collection, iteratee) => {
    if (!collection)
        return; // handle null/undefined
    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            if (iteratee(collection[i], i, collection) === false) {
                break; // stop early like Lodash
            }
        }
    }
    else if (typeof collection === "object") {
        for (const key in collection) {
            if (Object.prototype.hasOwnProperty.call(collection, key)) {
                if (iteratee(collection[key], key, collection) === false) {
                    break; // stop early
                }
            }
        }
    }
};
const reduce = (collection, iteratee, initialValue) => {
    if (!collection)
        return initialValue;
    let accumulator = initialValue;
    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            accumulator = iteratee(accumulator, collection[i], i, collection);
        }
    }
    else {
        for (const key in collection) {
            if (Object.prototype.hasOwnProperty.call(collection, key)) {
                accumulator = iteratee(accumulator, collection[key], key, collection);
            }
        }
    }
    return accumulator;
};
function sortBy(collection, iteratee) {
    if (!collection)
        return [];
    const getValue = typeof iteratee === "function"
        ? iteratee
        : typeof iteratee === "string"
            ? (item) => item[iteratee]
            : (item) => item;
    return collection
        .map((item, index) => ({ item, index, value: getValue(item) }))
        .sort((a, b) => {
        const aValue = a.value;
        const bValue = b.value;
        if (aValue == null && bValue == null)
            return a.index - b.index;
        if (aValue == null)
            return 1; // undefined/null goes last
        if (bValue == null)
            return -1;
        // coerce to string or number for comparison
        if (aValue < bValue)
            return -1;
        if (aValue > bValue)
            return 1;
        return a.index - b.index; // stable sort
    })
        .map(({ item }) => item);
}
const sortedIndex = (array, value) => {
    let low = 0;
    let high = array == null ? 0 : array.length;
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (array[mid] < value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
};
const keyBy = (array, iteratee) => {
    if (!array)
        return {};
    const getKey = typeof iteratee === "function"
        ? iteratee
        : (item) => String(item[iteratee]);
    return array.reduce((acc, item) => {
        acc[getKey(item)] = item;
        return acc;
    }, {});
};
const groupBy = (array, iteratee) => {
    if (!array)
        return {};
    const getKey = typeof iteratee === "function"
        ? iteratee
        : (item) => String(item[iteratee]);
    return array.reduce((acc, item) => {
        const key = String(getKey(item));
        if (!acc[key])
            acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
};
function throttle(func, wait) {
    let lastCall = 0;
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    const throttled = function (...args) {
        const now = Date.now();
        const remaining = wait - (now - lastCall);
        lastThis = this;
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCall = now;
            func.apply(lastThis, args);
        }
        else {
            lastArgs = args;
            if (!timeout) {
                timeout = setTimeout(() => {
                    lastCall = Date.now();
                    timeout = null;
                    if (lastArgs) {
                        func.apply(lastThis, lastArgs);
                        lastArgs = null;
                    }
                }, remaining);
            }
        }
    };
    return throttled;
}
const size = (value) => {
    if (value == null)
        return 0; // handles null & undefined
    if (typeof value === "string" || Array.isArray(value)) {
        return value.length;
    }
    if (value instanceof Map || value instanceof Set) {
        return value.size;
    }
    if (typeof value === "object") {
        return Object.keys(value).length;
    }
    return 0;
};
function range(start, end, step = 1) {
    // Handle range(end) shorthand
    let startVal = start;
    let endVal = end;
    if (endVal === undefined) {
        endVal = startVal;
        startVal = 0;
    }
    if (step === 0) {
        throw new Error("step cannot be 0");
    }
    const result = [];
    const ascending = step > 0;
    if (ascending) {
        for (let i = startVal; i < endVal; i += step) {
            result.push(i);
        }
    }
    else {
        for (let i = startVal; i > endVal; i += step) {
            result.push(i);
        }
    }
    return result;
}
const generateShortID = () => `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
//
// Ensures a number stays within a minimum and maximum value
//
function clamp(value, min, max) {
    const noNegativeZero = (n) => (Object.is(n, -0) ? 0 : n);
    if (value < min) {
        return noNegativeZero(min);
    }
    if (value > max) {
        return noNegativeZero(max);
    }
    return noNegativeZero(value);
}
// Helper function to convert a VNode (JSX element) to a real DOM element
function createDOMElementFromVNode(vNode) {
    // 1. Handle Null, Undefined, and Boolean VNodes
    if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
        return null;
    }
    if (typeof vNode !== "object") {
        return null;
    }
    const vnode = vNode;
    // 2. Handle Text and Number VNodes (they use '$text$' and have a null '$tag$')
    if (vnode.$text$ !== null && vnode.$text$ !== undefined) {
        return document.createTextNode(String(vnode.$text$));
    }
    // 3. Check for a valid Element VNode (must have a '$tag$')
    if (typeof vnode.$tag$ !== "string") {
        // If it's a number, boolean, or another invalid type, skip it.
        return null;
    }
    // Create the element
    const element = document.createElement(vnode.$tag$);
    // Set attributes/props ($attrs$)
    if (vnode.$attrs$ && typeof vnode.$attrs$ === "object") {
        for (const key in vnode.$attrs$) {
            const value = vnode.$attrs$[key];
            if (key === "style" && value && typeof value === "object") {
                // Handle style object: apply individual style properties
                Object.assign(element.style, value);
            }
            else if (key === "class") {
                // Use className for the class attribute
                element.className = String(value);
            }
            else if (value !== undefined && value !== null) {
                // Set all other attributes/props
                element.setAttribute(key, String(value));
            }
        }
    }
    // Process children ($children$)
    if (vnode.$children$ && Array.isArray(vnode.$children$)) {
        vnode.$children$.forEach((childVNode) => {
            // Recursively process children
            const childElement = createDOMElementFromVNode(childVNode);
            if (childElement) {
                element.appendChild(childElement);
            }
        });
    }
    // Return the real DOM element
    return element;
}

export { groupBy as a, createDOMElementFromVNode as b, clamp as c, debounce as d, each as e, size as f, generateShortID as g, range as h, sortedIndex as i, keyBy as k, reduce as r, sortBy as s, throttle as t };

