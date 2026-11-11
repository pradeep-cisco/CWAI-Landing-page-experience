import * as StencilCore from '@stencil/core/internal/client';
import { h as range } from './function-helper.js';

const appendToMap = (map, propName, value) => {
    let refs = map.get(propName);
    if (!refs) {
        refs = [];
        map.set(propName, refs);
    }
    if (!refs.some((ref) => ref.deref() === value)) {
        refs.push(new WeakRef(value));
    }
};
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce((map) => {
    for (let key of map.keys()) {
        const refs = map.get(key).filter((ref) => {
            const elm = ref.deref();
            return elm && isConnected(elm);
        });
        map.set(key, refs);
    }
}, 2_000);
const core = StencilCore;
const forceUpdate = core.forceUpdate;
const getRenderingRef = core.getRenderingRef;
const stencilSubscription = () => {
    if (typeof getRenderingRef !== 'function' || typeof forceUpdate !== 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        return {};
    }
    const ensureForceUpdate = forceUpdate;
    const ensureGetRenderingRef = getRenderingRef;
    const elmsToUpdate = new Map();
    return {
        dispose: () => elmsToUpdate.clear(),
        get: (propName) => {
            const elm = ensureGetRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        },
        set: (propName) => {
            const refs = elmsToUpdate.get(propName);
            if (refs) {
                const nextRefs = refs.filter((ref) => {
                    const elm = ref.deref();
                    if (!elm)
                        return false;
                    return ensureForceUpdate(elm);
                });
                elmsToUpdate.set(propName, nextRefs);
            }
            cleanupElements(elmsToUpdate);
        },
        reset: () => {
            elmsToUpdate.forEach((refs) => {
                refs.forEach((ref) => {
                    const elm = ref.deref();
                    if (elm)
                        ensureForceUpdate(elm);
                });
            });
            cleanupElements(elmsToUpdate);
        },
    };
};

const unwrap = (val) => (typeof val === 'function' ? val() : val);
const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    const resolveDefaultState = () => (unwrap(defaultState) ?? {});
    const initialState = resolveDefaultState();
    let states = new Map(Object.entries(initialState));
    const proxyAvailable = typeof Proxy !== 'undefined';
    const plainState = proxyAvailable ? null : {};
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    // Track onChange listeners to enable removeListener functionality
    const changeListeners = new Map();
    const reset = () => {
        // When resetting the state, the default state may be a function - unwrap it to invoke it.
        // otherwise, the state won't be properly reset
        states = new Map(Object.entries(resolveDefaultState()));
        if (!proxyAvailable) {
            syncPlainStateKeys();
        }
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            if (!proxyAvailable) {
                ensurePlainProperty(propName);
            }
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (proxyAvailable
        ? new Proxy(initialState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        })
        : (() => {
            syncPlainStateKeys();
            return plainState;
        })());
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const setHandler = (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        };
        const resetHandler = () => {
            const snapshot = resolveDefaultState();
            cb(snapshot[propName]);
        };
        // Register the handlers
        const unSet = on('set', setHandler);
        const unReset = on('reset', resetHandler);
        // Track the relationship between the user callback and internal handlers
        changeListeners.set(cb, { setHandler, resetHandler, propName });
        return () => {
            unSet();
            unReset();
            changeListeners.delete(cb);
        };
    };
    const use = (...subscriptions) => {
        const unsubs = subscriptions.reduce((unsubs, subscription) => {
            if (subscription.set) {
                unsubs.push(on('set', subscription.set));
            }
            if (subscription.get) {
                unsubs.push(on('get', subscription.get));
            }
            if (subscription.reset) {
                unsubs.push(on('reset', subscription.reset));
            }
            if (subscription.dispose) {
                unsubs.push(on('dispose', subscription.dispose));
            }
            return unsubs;
        }, []);
        return () => unsubs.forEach((unsub) => unsub());
    };
    const forceUpdate = (key) => {
        const oldValue = states.get(key);
        handlers.set.forEach((cb) => cb(key, oldValue, oldValue));
    };
    const removeListener = (propName, listener) => {
        const listenerInfo = changeListeners.get(listener);
        if (listenerInfo && listenerInfo.propName === propName) {
            // Remove the specific handlers that were created for this listener
            removeFromArray(handlers.set, listenerInfo.setHandler);
            removeFromArray(handlers.reset, listenerInfo.resetHandler);
            changeListeners.delete(listener);
        }
    };
    function ensurePlainProperty(key) {
        if (proxyAvailable || !plainState) {
            return;
        }
        if (Object.prototype.hasOwnProperty.call(plainState, key)) {
            return;
        }
        Object.defineProperty(plainState, key, {
            configurable: true,
            enumerable: true,
            get() {
                return get(key);
            },
            set(value) {
                set(key, value);
            },
        });
    }
    function syncPlainStateKeys() {
        if (proxyAvailable || !plainState) {
            return;
        }
        const knownKeys = new Set(states.keys());
        for (const key of Object.keys(plainState)) {
            if (!knownKeys.has(key)) {
                delete plainState[key];
            }
        }
        for (const key of knownKeys) {
            ensurePlainProperty(key);
        }
    }
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
        forceUpdate,
        removeListener,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    map.use(stencilSubscription());
    return map;
};

/**
 * Hide items from main collection
 * But keep them in store
 */
const trimmedPlugin = (store) => ({
    set(k, newVal) {
        switch (k) {
            case "trimmed": {
                const proxy = store.get("proxyItems");
                const trimmed = gatherTrimmedItems(newVal);
                const newItems = proxy.reduce((result, v) => {
                    // check if present in new trimmed remove from items (filter)
                    if (!trimmed[v]) {
                        result.push(v);
                    }
                    return result;
                }, []);
                store.set("items", newItems);
                break;
            }
        }
    },
});
function gatherTrimmedItems(trimmedItems) {
    const trimmed = {};
    for (const trimmedKey in trimmedItems) {
        // trimmed overweight not trimmed
        for (const t in trimmedItems[trimmedKey]) {
            trimmed[t] = trimmed[t] || trimmedItems[trimmedKey][t];
        }
    }
    return trimmed;
}

/** Set stores data */
function setStore(store, data) {
    for (const key in data) {
        store.set(key, data[key]);
    }
}

/**
 * All items
 * Used as proxy for sorting
 * Keep order but do not modify final source
 */
const proxyPlugin = (store) => ({
    set(k, newVal) {
        if (!isProxy(k)) {
            return;
        }
        /**
         * Getting existing collection of items
         * Mark indexes as visible
         */
        const oldItems = store
            .get("items")
            .reduce((r, v) => {
            r[v] = true;
            return r;
        }, {});
        /**
         * Check if new values where present in items
         * Filter item collection according presense
         */
        const newItems = newVal.reduce((r, i) => {
            if (oldItems[i]) {
                r.push(i);
            }
            return r;
        }, []);
        store.set("items", newItems);
    },
});
function isProxy(k) {
    return k === "proxyItems";
}

class DataStore {
    get store() {
        return this.dataStore;
    }
    constructor(type) {
        const store = (this.dataStore = createStore({
            items: [],
            proxyItems: [],
            source: [],
            groupingDepth: 0,
            groups: {},
            type,
            trimmed: {},
        }));
        store.use(proxyPlugin(store));
        store.use(trimmedPlugin(store));
    }
    /**
     * full data source update
     * @param source - data column/rgRow source
     * @param grouping - grouping information if present
     */
    updateData(source, grouping, silent = false) {
        // during full update we do drop trim
        if (!silent) {
            this.store.set("trimmed", {});
        }
        // clear items
        this.store.set("items", []);
        const items = range(0, (source === null || source === void 0 ? void 0 : source.length) || 0);
        // set proxy first
        setStore(this.store, {
            source,
            proxyItems: [...items],
        });
        // update data items
        this.store.set("items", items);
        // apply grooping if present
        if (grouping) {
            setStore(this.store, {
                groupingDepth: grouping.depth,
                groups: grouping.groups,
            });
        }
    }
    addTrimmed(some) {
        let trimmed = this.store.get("trimmed");
        trimmed = Object.assign(Object.assign({}, trimmed), some);
        setStore(this.store, { trimmed });
    }
    // local data update
    setData(input) {
        const data = Object.assign({}, input);
        setStore(this.store, data);
    }
    refresh() {
        const source = this.store.get("source");
        this.store.set("source", [...source]);
    }
}
/**
 * get physical index by virtual
 * @param store - store to process
 */
function getPhysical(store, virtualIndex) {
    const items = store.get("items");
    return items[virtualIndex];
}
/**
 * get all visible items
 * @param store - store to process
 */
function getVisibleSourceItem(store) {
    const source = store.get("source");
    return store.get("items").map((v) => source[v]);
}
/**
 * get mapped item from source
 * @param store - store to process
 * @param virtualIndex - virtual index to process
 */
function getSourceItem(store, virtualIndex) {
    const items = store.get("items");
    const source = store.get("source");
    return source[items[virtualIndex]];
}
/**
 * set item to source
 * @param store  - store to process
 * @param modelByIndex - collection of rows with virtual indexes to setup
 */
function setSourceByVirtualIndex(store, modelByIndex) {
    const items = store.get("items");
    const source = store.get("source");
    for (const virtualIndex in modelByIndex) {
        const realIndex = items[virtualIndex];
        source[realIndex] = modelByIndex[virtualIndex];
    }
    store.set("source", [...source]);
}
function setItems(store, items) {
    store.set("items", items);
}
function getSourceItemVirtualIndexByProp(store, prop) {
    const items = store.get("items");
    const source = store.get("source");
    const physicalIndex = source.findIndex((c) => c.prop === prop);
    return items.indexOf(physicalIndex);
}

export { DataStore as D, getSourceItemVirtualIndexByProp as a, getPhysical as b, setItems as c, setStore as d, getVisibleSourceItem as e, createStore as f, getSourceItem as g, setSourceByVirtualIndex as s };

