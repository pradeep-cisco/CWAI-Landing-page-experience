import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { s as sortBy, a as groupBy, d as debounce } from './function-helper.js';
import { w as magnifyingGlass, x as xCircle, y as arrowUp, z as arrowDown, A as arrowLeft } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$8 } from './icon.js';
import { i as internationalization } from './translations.js';
import { d as defineCustomElement$b } from './badge.js';
import { d as defineCustomElement$a } from './global-search-group.js';
import { d as defineCustomElement$9 } from './highlight.js';
import { d as defineCustomElement$7 } from './icon-button.js';
import { d as defineCustomElement$6 } from './illustration.js';
import { d as defineCustomElement$5 } from './input.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './tooltip.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const QUERY_TIMEOUT_MS = 30000;
const createErrorResult = (error) => [{ error }];
const runQueryHandler = (options, handlerMod, onResults, onComplete, isCancelled) => {
    let finished = false;
    const finish = () => {
        if (finished) {
            return;
        }
        finished = true;
        clearTimeout(timeoutId);
        onComplete();
    };
    const emitResults = (results) => {
        if (finished || isCancelled()) {
            return;
        }
        onResults(results);
    };
    const timeoutId = window.setTimeout(() => {
        emitResults(createErrorResult({ message: "Request has timed out." }));
        finish();
    }, QUERY_TIMEOUT_MS);
    Promise.resolve()
        .then(() => handlerMod(options, {
        send(data) {
            emitResults(data);
            finish();
        },
        sendPartial(data) {
            emitResults(data);
        },
        error(error) {
            console.error("Query handler errored", error);
            emitResults(createErrorResult(error));
            finish();
        },
        complete() {
            finish();
        },
    }))
        .catch((err) => {
        console.error("Query handler errored", err);
        emitResults(createErrorResult(err));
        finish();
    });
    return () => {
        finished = true;
        clearTimeout(timeoutId);
    };
};
const concatResults = ([accResults, processedCount], newResults) => {
    return [sortBy(accResults.concat(newResults), "id"), processedCount + 1];
};
/**
 *
 * @param data array of queryHandlers of type {q: function}
 * @param options {queryText: string, limit: number, typeFilter: string}
 * @returns the modified queryHandler collection as a subscribable stream
 */
const handler = (data, options) => {
    return {
        subscribe(observer) {
            var _a;
            const queryHandlers = data.filter((value) => typeof value === "function");
            let cancelled = false;
            let accResults = [];
            let processedCount = 0;
            let pendingHandlers = queryHandlers.length;
            if (!pendingHandlers) {
                (_a = observer.complete) === null || _a === void 0 ? void 0 : _a.call(observer);
                return {
                    unsubscribe() {
                        cancelled = true;
                    },
                };
            }
            const cleanups = queryHandlers.map((queryHandler) => runQueryHandler(Object.assign({}, options), queryHandler, (results) => {
                var _a;
                if (cancelled) {
                    return;
                }
                [accResults, processedCount] = concatResults([accResults, processedCount], results);
                (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, [accResults, processedCount]);
            }, () => {
                var _a;
                if (cancelled) {
                    return;
                }
                pendingHandlers -= 1;
                if (pendingHandlers === 0) {
                    (_a = observer.complete) === null || _a === void 0 ? void 0 : _a.call(observer);
                }
            }, () => cancelled));
            return {
                unsubscribe() {
                    cancelled = true;
                    cleanups.forEach((cleanup) => cleanup());
                },
            };
        },
    };
};
const handleArrowDown = (searchResult, selectedItem, showAllActiveGroupId, limit) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    let updatedSelectedItem = { id: undefined, group: undefined };
    if (!selectedItem || !selectedItem.group) {
        // User just typed query
        updatedSelectedItem = Object.assign({ group: (_a = searchResult[0]) === null || _a === void 0 ? void 0 : _a.id }, (_b = searchResult[0]) === null || _b === void 0 ? void 0 : _b.resultItems[0]);
        return updatedSelectedItem;
    }
    const groupIndex = searchResult === null || searchResult === void 0 ? void 0 : searchResult.map((item) => item === null || item === void 0 ? void 0 : item.id).indexOf(selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.group);
    const group = searchResult[groupIndex];
    const itemIndex = (_c = group === null || group === void 0 ? void 0 : group.resultItems) === null || _c === void 0 ? void 0 : _c.map((item) => item.id).indexOf(selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id);
    if (itemIndex === -1) {
        // If the item index is -1, select the first item of the next group
        if (groupIndex < (searchResult === null || searchResult === void 0 ? void 0 : searchResult.length) - 1) {
            updatedSelectedItem = Object.assign({ group: (_d = searchResult[groupIndex + 1]) === null || _d === void 0 ? void 0 : _d.id }, (_e = searchResult[groupIndex + 1]) === null || _e === void 0 ? void 0 : _e.resultItems[0]);
        }
        else {
            updatedSelectedItem = Object.assign({ group: (_f = searchResult[0]) === null || _f === void 0 ? void 0 : _f.id }, (_g = searchResult[0]) === null || _g === void 0 ? void 0 : _g.resultItems[0]);
        }
    }
    else {
        // Handle expanded group case
        if (showAllActiveGroupId === group.id) {
            if (itemIndex < ((_h = group === null || group === void 0 ? void 0 : group.resultItems) === null || _h === void 0 ? void 0 : _h.length) - 1) {
                updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[itemIndex + 1]);
            }
            else {
                updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[0]);
            }
        }
        else {
            // Default navigation
            if (itemIndex < limit - 1 && itemIndex < ((_j = group === null || group === void 0 ? void 0 : group.resultItems) === null || _j === void 0 ? void 0 : _j.length) - 1) {
                updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[itemIndex + 1]);
            }
            else if (itemIndex === ((_k = group === null || group === void 0 ? void 0 : group.resultItems) === null || _k === void 0 ? void 0 : _k.length) - 1) {
                if (groupIndex < (searchResult === null || searchResult === void 0 ? void 0 : searchResult.length) - 1) {
                    updatedSelectedItem = Object.assign({ group: (_l = searchResult[groupIndex + 1]) === null || _l === void 0 ? void 0 : _l.id }, (_m = searchResult[groupIndex + 1]) === null || _m === void 0 ? void 0 : _m.resultItems[0]);
                }
                else {
                    updatedSelectedItem = Object.assign({ group: (_o = searchResult[0]) === null || _o === void 0 ? void 0 : _o.id }, (_p = searchResult[0]) === null || _p === void 0 ? void 0 : _p.resultItems[0]);
                }
            }
            else {
                updatedSelectedItem = {
                    group: group.id,
                    id: "show_all",
                };
            }
        }
    }
    // Handle "More Results..." button click
    if (showAllActiveGroupId &&
        (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id) === "show_all" &&
        (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.group) === (group === null || group === void 0 ? void 0 : group.id)) {
        updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[0]);
    }
    return updatedSelectedItem;
};
const handleArrowUp = (searchResult, selectedItem, showAllActiveGroupId, limit) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let updatedSelectedItem = { id: undefined, group: undefined };
    if (!selectedItem || !(selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.group)) {
        // User just pressed the up arrow for the first time
        const lastGroup = searchResult[searchResult.length - 1];
        if (((_a = lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.resultItems) === null || _a === void 0 ? void 0 : _a.length) > limit) {
            updatedSelectedItem = {
                group: lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.id,
                id: "show_all",
            };
        }
        else {
            updatedSelectedItem = Object.assign({ group: lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.id }, lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.resultItems[((_b = lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.resultItems) === null || _b === void 0 ? void 0 : _b.length) - 1]);
        }
        return updatedSelectedItem;
    }
    const groupIndex = searchResult === null || searchResult === void 0 ? void 0 : searchResult.findIndex((item) => (item === null || item === void 0 ? void 0 : item.id) === (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.group));
    const group = searchResult[groupIndex];
    const itemIndex = group === null || group === void 0 ? void 0 : group.resultItems.findIndex((item) => (item === null || item === void 0 ? void 0 : item.id) === (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id));
    const isExpandedGroup = showAllActiveGroupId === (group === null || group === void 0 ? void 0 : group.id);
    const groupItemsToShow = isExpandedGroup
        ? (_c = group === null || group === void 0 ? void 0 : group.resultItems) === null || _c === void 0 ? void 0 : _c.length
        : Math.min((_d = group === null || group === void 0 ? void 0 : group.resultItems) === null || _d === void 0 ? void 0 : _d.length, limit);
    if (itemIndex > 0) {
        // Navigate within the group
        updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[itemIndex - 1]);
    }
    else if ((selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id) === "show_all") {
        // If "More Results..." is selected, navigate to the last item of the current group
        updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[groupItemsToShow - 1]);
    }
    else if (itemIndex === 0 && !isExpandedGroup) {
        // Navigate to the "More Results..." link of the previous group
        const newGroupIndex = groupIndex > 0 ? groupIndex - 1 : (searchResult === null || searchResult === void 0 ? void 0 : searchResult.length) - 1;
        const newGroup = searchResult[newGroupIndex];
        const newGroupItemsToShow = showAllActiveGroupId === (newGroup === null || newGroup === void 0 ? void 0 : newGroup.id)
            ? (_e = newGroup === null || newGroup === void 0 ? void 0 : newGroup.resultItems) === null || _e === void 0 ? void 0 : _e.length
            : Math.min((_f = newGroup === null || newGroup === void 0 ? void 0 : newGroup.resultItems) === null || _f === void 0 ? void 0 : _f.length, limit);
        if (newGroupItemsToShow < limit) {
            updatedSelectedItem = Object.assign({ group: newGroup === null || newGroup === void 0 ? void 0 : newGroup.id }, newGroup === null || newGroup === void 0 ? void 0 : newGroup.resultItems[newGroupItemsToShow - 1]);
        }
        else {
            updatedSelectedItem = {
                group: newGroup === null || newGroup === void 0 ? void 0 : newGroup.id,
                id: "show_all",
            };
        }
    }
    else if (isExpandedGroup) {
        // Trapping focus within the expanded group
        updatedSelectedItem = Object.assign({ group: group === null || group === void 0 ? void 0 : group.id }, group === null || group === void 0 ? void 0 : group.resultItems[((_g = group === null || group === void 0 ? void 0 : group.resultItems) === null || _g === void 0 ? void 0 : _g.length) - 1]);
    }
    return updatedSelectedItem;
};

const translations = {
    en: {
        search: "Search",
        allCategories: "All Categories",
    },
    ko: {
        search: "검색",
        allCategories: "모든 카테고리",
    },
    ja: {
        search: "検索",
        allCategories: "すべてのカテゴリ",
    },
    zh: {
        search: "搜索",
        allCategories: "所有类别",
    },
};

const noSearchResultsSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MyIgdmlld0JveD0iMCAwIDIwMCAyNTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODUiIGZpbGw9IiNGN0Y3RjciLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMTUuOCA1Ni43OTZMMTE0IDU4Ljk2NUwxMTYuNzk3IDU5LjMxMUwxMTguOTY2IDYxLjExMUwxMTkuMzEyIDU4LjMxNEwxMjEuMTEyIDU2LjE0NUwxMTguMzE1IDU1LjhMMTE2LjE0NiA1NEwxMTUuOCA1Ni43OTZaIiBmaWxsPSIjRTBCRkZEIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIzLjgzNyA2NS4zMDA5TDEyMi4wODQgNjUuODkxOUwxMjMuNTI3IDY3LjA0OTlMMTI0LjExOCA2OC44MDI5TDEyNS4yNzUgNjcuMzU5OUwxMjcuMDI4IDY2Ljc2NzlMMTI1LjU4NSA2NS42MTA5TDEyNC45OTQgNjMuODU3OUwxMjMuODM3IDY1LjMwMDlaIiBmaWxsPSIjRkFEOUZDIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNzguNjA0NCA2My4zNjk0TDc3LjQ3MSA3MC4wMTEzTDgzLjY3NDYgNjcuMzg0OEw5MC4zMTYyIDY4LjUxOTJMODcuNjg5MSA2Mi4zMTQ4TDg4LjgyMjUgNTUuNjcyOUw4Mi42MjAxIDU4LjMwMTVMNzUuOTc4NSA1Ny4xNjcxTDc4LjYwNDQgNjMuMzY5NFoiIGZpbGw9IiNDNUJFRTAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01OC42Nzc0IDQ2Ljk1MDZMNTUuNzA5NiA1MC4zMkw2MC4xNDc5IDUxLjAwMjRMNjMuNTE3MiA1My45NjkzTDY0LjE5ODMgNDkuNTMyNkw2Ny4xNjQ4IDQ2LjE2MUw2Mi43Mjc4IDQ1LjQ4MDdMNTkuMzU4NSA0Mi41MTM5TDU4LjY3NzQgNDYuOTUwNloiIGZpbGw9IiNGNkI5RkEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNDIuOTUyIDE3My41NTlMMTAwLjEwOSAxOTguNTE1TDU3LjA0ODggMTczLjU1OUw5OS44OTE4IDE0OC40OTVMMTQyLjk1MiAxNzMuNTU5WiIgZmlsbD0iI0M1QkVFMCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1Mi4xNjYgMTM4LjE2MkwxNDQuMDYxIDEzMC4xMjlMMTAwLjU0NCAxMDVMMTExLjM5NiAxMTUuNzU0TDE1MS41NjQgMTM4Ljk1QzE1Mi4wNzIgMTM5LjI0MyAxNTIuNTgzIDEzOC41NzQgMTUyLjE2NiAxMzguMTYyWk05NS45MjU2IDEwOS45NDNDOTYuNzExMiAxMDkuMTAyIDk1LjY4ODMgMTA3LjgxNyA5NC42OTMgMTA4LjM5NUw1Ny4yNDYxIDEzMC4xMjNMNDguNDg0MSAxMzkuNUM0OC4wOTEzIDEzOS45MiA0OC42MDI4IDE0MC41NjIgNDkuMTAwNCAxNDAuMjczTDg5LjQ3MjggMTE2Ljg0OEw5NS45MjU2IDEwOS45NDNaIiBmaWxsPSIjQzVCRUUwIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQ0LjAzOSAxMzAuMDE4TDE0My45MzggMTcxLjE0QzE0My45MzUgMTcyLjY3NyAxNDIuMjcxIDE3My42MzUgMTQwLjkzOSAxNzIuODY4TDEwMC41NDQgMTQ5LjU3NFYxMDVMMTQ0LjAzOSAxMzAuMDE4WiIgZmlsbD0iI0U1RTFGNCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwMC41NDQgMTQ5LjU4M1YxMDVMNTcuMTU4NCAxMzAuMTI3TDU3LjA1NzEgMTcxLjEyNUM1Ny4wNTMzIDE3Mi42NjYgNTguNzE4OCAxNzMuNjMyIDYwLjA1NDEgMTcyLjg2NEwxMDAuNTQ0IDE0OS41ODNaTTE0My45MzIgMTczLjMyNUwxNDQuMDM5IDEzMC4wMUwxMDAuNTQ0IDE1NS4wMTlWMTk5LjYwMkwxNDIuOTM0IDE3NS4wNTFDMTQzLjU1IDE3NC42OTQgMTQzLjkzIDE3NC4wMzcgMTQzLjkzMiAxNzMuMzI1WiIgZmlsbD0iI0Q1Q0ZFRCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwMC41NDQgMTU1LjAyOFYxOTkuNjAyTDU4LjA1NDUgMTc1LjE2MkM1Ny40MzI2IDE3NC44MDQgNTcuMDQ5OSAxNzQuMTQxIDU3LjA1MTcgMTczLjQyNEw1Ny4xNTgxIDEzMC4wMUwxMDAuNTQ0IDE1NS4wMjhaIiBmaWxsPSIjRTVFMUY0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNODguMzM4MSAxNzYuMTI2TDEwMC41NDQgMTU1LjA4MkwxMTIuMzgxIDE3Ni4wNzZDMTEyLjkzMSAxNzcuMDUzIDExNC4xNzUgMTc3LjM4NiAxMTUuMTQgMTc2LjgxNkwxNTQuMzU5IDE1My42NDNDMTU1LjI3OCAxNTMuMSAxNTUuNjA5IDE1MS45MzEgMTU1LjExIDE1MC45ODdMMTQ0LjAzOSAxMzAuMDFMMTAwLjU0NCAxNTUuMDgyTDU3LjIwODIgMTMwLjAxTDQ1LjAwNDYgMTUxLjA1MUM0NC40NSAxNTIuMDA3IDQ0Ljc3NjMgMTUzLjIzMiA0NS43MzMxIDE1My43ODVMODUuNjA2NSAxNzYuODU0Qzg2LjU2MTggMTc3LjQwNyA4Ny43ODQzIDE3Ny4wODEgODguMzM4MSAxNzYuMTI2WiIgZmlsbD0iI0M1QkVFMCIvPgo8L3N2Zz4K';

const globalSearchCss = ":host{display:block;--color:var(--base-text-strong-default);--search-input-padding:0 var(--hbr-spacing-md);--accessibility-text:block;--input-text:var(--brand-text-weak-default);--input-text-font-weight:none;--input-bg:var(--brand-bg-strong-default);--placeholder-text-color:var(--base-text-in-weak-default);--search-text:var(--control-icon-in-medium-default);--close-icon:var(--brand-icon-weak-default);--close-icon-hover:var(--brand-icon-weak-default);--overlay-bg:var(--overlay-bg-default);--border-color:var(--control-border-default);--content-bg:var(--base-bg-weak-default);--content-border-color:var(--control-border-disabled);--all-categories-color:var(--interact-text-default);--all-categories-hover:var(--interact-text-hover);--all-categories-active:var(--interact-text-active);--content-text-color:var(--base-text-medium-default);--arrow-icon-bg:var(--base-bg-medium-hover);--arrow-icon-text:var(--base-text-medium-default);--box-shadow-hover:var(--hbr-shadow-md);--border-radius:var(--hbr-border-radius-lg)}hbr-input.search__input_field::part(base){border:none;background:none;box-shadow:none;outline:none;color:var(--input-text);font-weight:var(--input-text-font-weight)}.search__base--modal{position:fixed;top:0;bottom:0;left:0;right:0;z-index:10}.search__text{color:var(--search-text);padding-top:var(--hbr-spacing-lg);font-size:var(--hbr-font-size-sm);font-style:normal;font-weight:var(--hbr-font-weight-normal)}.search__drawer_close{--color:var(--close-icon);--color-hover:var(--close-icon-hover)}.search__overlay__modal{position:fixed;top:0;right:0;left:0;bottom:0;background:var(--overlay-bg);z-index:1}.search{border-radius:var(--hbr-border-radius-md);border-color:var(--border-color);box-shadow:none;transition:box-shadow 0.2s ease-in-out}.search:hover{box-shadow:var(--box-shadow-hover)}.search--active{box-shadow:var(--box-shadow-hover);position:absolute;top:10px;right:0;left:0;z-index:10;margin:0 auto;margin-right:var(--hbr-spacing-lg);margin-left:var(--hbr-spacing-lg)}.search--inactive{width:260px}.search__modal{position:absolute;width:80%;left:50%;transform:translate(-50%, 0);top:200px;z-index:10}.search__input_area{display:flex;gap:var(--hbr-spacing-xs);border-radius:var(--border-radius);padding:var(--search-input-padding);color:var(--input-text);background:var(--input-bg);height:36px;z-index:10;justify-content:center;align-items:center}.search__input_area>hbr-icon,.search__input_area hbr-icon-button{font-size:var(--hbr-spacing-lg)}.search__input_area_active{border-radius:var(--hbr-border-radius-lg) var(--hbr-border-radius-lg) 0px 0px;height:46px}.search__input_area input::placeholder{color:var(--base-text-in-weak-default)}.search__input_area hbr-icon[part=search-icon]{width:var(--hbr-spacing-lg);height:var(--hbr-spacing-lg);margin:auto}@keyframes slidein{0%{transform:translateX(0)}100%{transform:translateX(58px)}}.search__content_wrapper{display:block;background-color:var(--content-bg);border-bottom-left-radius:var(--hbr-border-radius-sm);border-bottom-right-radius:var(--hbr-border-radius-sm);overflow:hidden;color:var(--color)}.search__error_container{padding:var(--hbr-spacing-sm) 0px}.search__content{display:grid;grid-template-columns:0.5fr 0.5fr;overflow:auto;flex-grow:1;flex-basis:0;min-height:0}.search__content>*{max-height:100%}.search__content{height:754px;background-color:var(--content-bg);border-color:var(--content-border-color)}.search__content--hidden{display:none}.search__description{margin:var(--hbr-spacing-xl) var(--hbr-spacing-xl) var(--hbr-spacing-xl) 0px;border-left:1px solid;border-color:inherit}.search__description_content_area{width:50%;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin:12px 0px;overflow:auto}.search__accessibility-text{display:var(--accessibility-text)}.search__left_content{padding:var(--hbr-spacing-sm) var(--hbr-spacing-2xl);border-right:1px solid var(--control-border-disabled);overflow:auto}.search__content_results{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--hbr-spacing-xl);display:grid;grid-template-columns:repeat(auto-fit, minmax(270px, 1fr));gap:var(--hbr-spacing-lg) var(--hbr-spacing-xl);display:grid}.search__all_categories{margin-bottom:var(--hbr-spacing-lg);font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-sm);font-style:normal;font-weight:var(--hbr-font-weight-semibold, 600);cursor:pointer;color:var(--all-categories-color)}.search__all_categories:hover{color:var(--all-categories-hover)}.search__all_categories:active{color:var(--all-categories-active)}.search__all_categories:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-md)}.search__item_description_text{margin:var(--hbr-spacing-xl);color:var(--content-text-color);font-size:var(--hbr-font-size-sm)}.search__initial{display:flex;border-color:inherit;flex-direction:column;padding:var(--hbr-spacing-md) 0px;padding-left:var(--hbr-spacing-2xl)}.search__initial--hidden{display:none}.search__no_results{display:flex;border-color:inherit;flex-direction:column;align-items:center;padding:var(--hbr-spacing-lg)}.search__loading{display:flex;border-color:inherit;flex-direction:column;align-items:center;padding:var(--hbr-spacing-lg)}.search__image_description{font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-light);color:var(--content-text-color)}.search__initial_search_content_box{display:flex;flex-direction:column;height:100%;padding:var(--hbr-spacing-sm) 0px;color:var(--content-text-color);font-size:var(--hbr-font-size-sm)}.search__content_box{padding-bottom:var(--hbr-spacing-md)}.search__save_search{margin-left:auto;margin-right:0;font-size:var(--hbr-font-size-md)}.search__footer_badge{padding-right:var(--hbr-spacing-2xs);--bg-color:var(--arrow-icon-bg);--text-color:var(--arrow-icon-text)}.search__input_field{border:none;background:none;width:100%;--color:var(--input-text)}hbr-input::part(input)::placeholder{color:var(--brand-text-weak-default, #F7F7F7);font-size:var(--hbr-font-size-sm, 14px);font-style:normal;font-weight:var(--hbr-font-weight-semibold, 600);line-height:20px}hbr-input::part(input){margin:0px}hbr-icon.search__icon{font-size:var(--hbr-font-size-xl, 24px);color:var(--brand-icon-weak-default)}.search__widgets{display:flex}";
const HbrGlobalSearchStyle0 = globalSearchCss;

const HbrGlobalSearch$1 = /*@__PURE__*/ proxyCustomElement(class HbrGlobalSearch extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClose = createEvent(this, "hbr-close", 7);
        this.hbrSearch = createEvent(this, "hbr-search", 7);
        this.hbrKeyDown = createEvent(this, "hbr-key-down", 7);
        this.hbrResult = createEvent(this, "hbr-result", 7);
        this.handleSearchKeyDown = (event) => {
            if (this.active) {
                if (!this.result) {
                    // prevent search when an enter key pressed on the result link
                    if (event.key === "Enter" && this.typingInProgress) {
                        event.stopPropagation();
                        this.startSearch();
                        this.typingInProgress = false;
                    }
                }
                if (this.searchResult.length > 0 && !this.loading) {
                    if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].indexOf(event.key) !== -1) {
                        this.navigationStarted = true;
                        event.preventDefault();
                        if (this.result && this.result.length > 0) {
                            this.hbrKeyDown.emit({ key: event.key, event: event });
                            return;
                        }
                        const selectedItem = event.key === "ArrowDown"
                            ? handleArrowDown(this.searchResult, this.selectedItem, this.showAllActiveGroupId, this.limit)
                            : handleArrowUp(this.searchResult, this.selectedItem, this.showAllActiveGroupId, this.limit);
                        this.selectedItem = selectedItem;
                        if (this.searchCallback) {
                            this.searchCallback({
                                queryText: this.queryText,
                                errors: this.errors,
                                selectedItem: this.selectedItem,
                            });
                        }
                    }
                    else if (event.key === "Enter") {
                        this.navigationStarted = true;
                        if (this.result && this.result.length > 0) {
                            this.hbrKeyDown.emit({ key: event.key, event: event });
                            return;
                        }
                        this.triggerItemAction();
                    }
                }
                if (event.key === "Escape") {
                    this.active = false;
                    this.queryText = "";
                    this.clearResults();
                    this.hbrClose.emit();
                }
            }
            if (event.key &&
                event.key.toLowerCase() === "s" &&
                (event.altKey || event.metaKey || event.ctrlKey)) {
                this.active = !this.active;
                event.preventDefault();
            }
        };
        this.activateSearch = (event) => {
            if (event.button === 0) {
                this.active = true;
            }
        };
        this.onMouseClick = (event) => {
            var _a;
            if (event.button === 0) {
                this.active = true;
                //@ts-ignore
                const containsNode = (_a = this.host) === null || _a === void 0 ? void 0 : _a.contains(event.target);
                if (!this.active && containsNode) {
                    this.active = true;
                }
            }
        };
        this.triggerItemAction = () => {
            var _a, _b;
            (_b = (_a = this.selectedItem) === null || _a === void 0 ? void 0 : _a.actionConfig) === null || _b === void 0 ? void 0 : _b.action();
        };
        this.updateOlderEntries = (resultItems) => {
            const latestItemsMap = new Map();
            resultItems.forEach((item) => {
                if (!latestItemsMap.has(item.id) ||
                    latestItemsMap.get(item.id).title !== item.title) {
                    latestItemsMap.set(item.id, item);
                }
            });
            return Array.from(latestItemsMap.values());
        };
        this.removeDuplicates = (resultItems) => {
            const oldestItemsMap = new Map();
            resultItems.forEach((item) => {
                if (!oldestItemsMap.has(item.id)) {
                    oldestItemsMap.set(item.id, item);
                }
            });
            return Array.from(oldestItemsMap.values());
        };
        this.performQuery = (manual = false) => {
            var _a;
            if (!manual) {
                (_a = this.searchCallback) === null || _a === void 0 ? void 0 : _a.call(this, {
                    queryText: this.queryText,
                    errors: this.errors,
                    selectedItem: this.selectedItem,
                });
            }
            setTimeout(() => {
                if (this.loading) {
                    this.showLoading = true;
                }
            }, 3000);
            if (this.queryText) {
                const options = {
                    queryText: this.queryText,
                };
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
                this.subscription = handler(this.queryHandlers, options).subscribe({
                    next: (results) => {
                        if (this.queryText) {
                            // @ts-ignore
                            const [unfilteredResults, processedCount] = results;
                            const { unsortedResults = [], errors = [] } = groupBy(unfilteredResults, (r) => r.error ? "errors" : "unsortedResults");
                            const filteredResults = unsortedResults.filter((it) => {
                                const item = it;
                                return (item.id &&
                                    item.title &&
                                    item.resultItems &&
                                    item.resultItems.length > 0);
                            });
                            const processedResults = groupBy(filteredResults, (r) => r.id);
                            const finalResults = Object.keys(processedResults).map((key) => {
                                return {
                                    id: key,
                                    title: processedResults[key][0]
                                        .title,
                                    resultItems: processedResults[key].flatMap((it) => it.resultItems.map((item) => {
                                        return Object.assign(Object.assign({}, item), { group: key });
                                    })),
                                };
                            });
                            finalResults.forEach((group) => {
                                if (this.updateStream) {
                                    group.resultItems = this.updateOlderEntries(group.resultItems);
                                }
                                else {
                                    group.resultItems = this.removeDuplicates(group.resultItems);
                                }
                            });
                            this.searchResult = finalResults;
                            this.queryToHighlight = this.queryText;
                            this.errors = errors.flatMap((it) => {
                                if (typeof it === "object" && it !== null && "error" in it) {
                                    const errorObj = it;
                                    if (Array.isArray(errorObj.error)) {
                                        return errorObj.error.map((err) => err.message);
                                    }
                                    if (errorObj.error &&
                                        typeof errorObj.error === "object" &&
                                        "message" in errorObj.error) {
                                        return errorObj.error.message;
                                    }
                                }
                                return [];
                            });
                            this.loading = false;
                            this.showLoading = false;
                            this.errors.length > 0 &&
                                this.searchCallback &&
                                this.searchCallback({
                                    queryText: this.queryText,
                                    errors: this.errors,
                                    selectedItem: this.selectedItem,
                                });
                            this.hbrResult.emit({
                                results: this.searchResult,
                                errors: this.errors,
                                query: this.queryText,
                            });
                        }
                        else {
                            this.clearResults();
                        }
                    },
                    complete: () => {
                        this.loading = false;
                        this.showLoading = false;
                    },
                });
            }
        };
        this.onInput = (event) => {
            const { value } = event.currentTarget;
            this.queryText = value;
            this.active = true;
            if (!this.uponEnter) {
                this.queryToHighlight = this.queryText;
                this.startSearch();
            }
            else {
                this.typingInProgress = true;
            }
            this.hbrSearch.emit({ value, event: event });
        };
        this.startSearch = () => {
            this.selectedItem = null;
            this.navigationStarted = false;
            if (this.queryText.length > 0) {
                this.loading = true;
                if (!this.uponEnter) {
                    debounce(this.performQuery.bind(this), this.debounceInterval)();
                }
                else {
                    this.performQuery();
                }
                this.showAllActiveGroupId = "";
            }
            else {
                this.clearResults();
            }
        };
        this.clearResults = () => {
            this.queryToHighlight = "";
            this.selectedItem = null;
            this.errors = [];
            if (this.searchCallback)
                this.searchCallback({
                    queryText: this.queryText,
                    errors: this.errors,
                    selectedItem: this.selectedItem,
                });
            this.searchResult = [];
            this.loading = false;
            this.showLoading = false;
            this.showAllActiveGroupId = "";
            this.hbrResult.emit({
                results: this.searchResult,
                errors: this.errors,
                query: this.queryText,
            });
        };
        this.handleClear = (event) => {
            this.clearResults();
            this.queryText = "";
            this.active = false;
            this.hbrClose.emit();
            event.stopPropagation();
        };
        this.selectResultHandler = (item) => {
            this.selectedItem = item;
            this.navigationStarted = true;
            if (this.searchCallback)
                this.searchCallback({
                    queryText: this.queryText,
                    errors: this.errors,
                    selectedItem: this.selectedItem,
                });
        };
        this.showAllClickHandler = (groupId) => {
            var _a, _b, _c, _d, _e;
            if (groupId && ((_a = this.selectedItem) === null || _a === void 0 ? void 0 : _a.id) !== "show_all") {
                const groupIndex = this.searchResult
                    .map((item) => item.id)
                    .indexOf(groupId);
                if ((_b = this.selectedItem) === null || _b === void 0 ? void 0 : _b.id) {
                    const itemIndex = (_c = this.searchResult[groupIndex]) === null || _c === void 0 ? void 0 : _c.resultItems.map((item) => item.id).indexOf(this.selectedItem.id);
                    if (itemIndex > this.limit - 1) {
                        this.selectedItem = Object.assign(Object.assign({}, this.selectedItem), { id: (_e = (_d = this.searchResult[groupIndex]) === null || _d === void 0 ? void 0 : _d.resultItems[this.limit - 1]) === null || _e === void 0 ? void 0 : _e.id });
                    }
                }
            }
            if (this.showAllActiveGroupId !== groupId) {
                this.showAllActiveGroupId = groupId;
            }
            else {
                // if same id => clicked go back and clear the value
                this.showAllActiveGroupId = "";
            }
        };
        this.goBack = () => {
            this.showAllActiveGroupId = "";
            this.active = true;
        };
        this.onScroll = (event) => {
            if (this.active) {
                event.preventDefault();
            }
        };
        this.queryHandlers = [];
        this.uponEnter = true;
        this.debounceInterval = 500;
        this.limit = 5;
        this.value = "";
        this.initialMessage = "Search for Network Devices, Sites, Clients, Settings, Tasks, and Menu Items.";
        this.searchCallback = undefined;
        this.result = undefined;
        this.updateStream = true;
        this.searchResult = [];
        this.queryText = "";
        this.noResultsMessage = `We couldn't find any match for '$$$$$'. Check the spelling or try a different term.`;
        this.active = false;
        this.loading = false;
        this.showLoading = false;
        this.selectedItem = null;
        this.showAllActiveGroupId = "";
        this.subscription = null;
        this.errors = [];
        this.navigationStarted = false;
        this.typingInProgress = false;
        this.queryToHighlight = "";
    }
    componentWillLoad() {
        window.addEventListener("keydown", this.handleSearchKeyDown, true);
        window.addEventListener("scroll", this.onScroll, false);
        window.addEventListener("touchmove", this.onScroll);
    }
    queryTextWatcher(queryText) {
        if (!queryText.length) {
            this.clearResults();
        }
    }
    valueWatcher(value) {
        if (value && value.length > 0) {
            this.queryText = value;
            this.active = true;
            this.performQuery(true);
        }
        else if (value === "" ||
            (typeof value === "string" && value.length === 0)) {
            this.queryText = "";
            // The queryTextWatcher will handle clearing results
        }
    }
    handleActiveChange(active) {
        if (active) {
            setTimeout(() => { var _a; return (_a = this.input) === null || _a === void 0 ? void 0 : _a.setFocus(); }, 100);
        }
    }
    handleResultChange(result) {
        this.searchResult = result;
    }
    /**
     * Method to reset the search input to empty string
     */
    async resetSearch() {
        this.queryText = "";
        this.value = "";
        // The queryTextWatcher will automatically handle clearing results when queryText becomes empty
    }
    disconnectedCallback() {
        var _a;
        //@ts-ignore
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        window.removeEventListener("keydown", this.handleSearchKeyDown);
        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("touchmove", this.onScroll);
    }
    render() {
        var _a;
        const platform = navigator.platform.toLowerCase();
        const noResMsg = this.noResultsMessage.replace("$$$$$", this.queryText);
        const accessibility_message1 = "Tip: Press Return/Enter to search. Toggle search with ";
        const accessibility_message2 = " or Esc, and navigate search results with ";
        const accessibility_message3 = " or ";
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const searchBar = (h("div", { part: `input-area${this.active ? " input-area-active" : ""}`, class: {
                search__input_area: true,
                search__input_area_active: this.active,
            }, onClick: this.activateSearch, "data-testid": "global-search--input-area" }, h("hbr-icon", { part: "glass-icon", asset: magnifyingGlass, "data-testid": "global-search--icon", class: "search__icon", size: "24px" }), h("hbr-input", { exportparts: "input, base: base-search-input", class: {
                search__input_field: true,
            }, onInput: this.onInput, value: this.queryText, ref: (el) => {
                this.input = el;
            }, placeholder: internationalization(translations, "search"), "data-testid": "global-search--input", part: "search-input" }), this.active && (h("div", { class: "search__widgets", part: "widgets" }, h("slot", { name: "custom-widgets" }), h("hbr-icon-button", { class: "search__drawer_close", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-circle"]) || xCircle, arialabel: "close the drawer", onClick: this.handleClear, size: "var(--hbr-font-size-xl)", "data-testid": "global-search__clear-query", part: "close-icon" })))));
        const accessibility = (h("div", { class: "search__initial" }, h("div", { class: "search__image_description" }, this.initialMessage), h("div", { class: "search__image_description" }, accessibility_message1, platform.includes("mac") ? "⌘" : "Ctrl", "+S", accessibility_message2, h("hbr-badge", { class: "search__footer_badge", size: "small" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-up"]) || arrowUp })), accessibility_message3, h("hbr-badge", { class: "search__footer_badge", size: "small" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-down"]) || arrowDown })))));
        const defaultDetailView = (h("div", { class: "search__description_content_area" }, h("hbr-illustration", { size: "medium" }, h("div", { slot: "body" }, "Click a result to see more details."))));
        const description = this.selectedItem ? (h("slot", { name: "description" })) : (defaultDetailView);
        const currResult = this.searchResult.filter((it) => it.id === this.showAllActiveGroupId);
        const searchResults = (h("div", { class: "search__content_results" }, this.showAllActiveGroupId.length === 0 &&
            this.searchResult.length > 0 ? (this.searchResult.map((group, key) => {
            return (h("hbr-global-search-group", { noPadding: key === 0, groupConfig: group, showMore: this.showAllActiveGroupId === group.id, queryText: this.queryToHighlight, selectedItem: this.selectedItem && this.selectedItem.group === group.id
                    ? this.selectedItem.id
                    : "", limit: this.limit, selectResultHandler: this.selectResultHandler, showAllClickHandler: this.showAllClickHandler }));
        })) : (h("div", null, this.showAllActiveGroupId.length > 0 &&
            currResult.length > 0 &&
            currResult[0].resultItems.length > 5 && (h("div", { class: "search__all_categories hbr-type-link", onClick: this.goBack, "data-testid": "global-search--all-categories", onKeyDown: (event) => event.key === "Enter" && this.goBack() }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-left"]) || arrowLeft }), ` ${internationalization(translations, "allCategories")}`)), this.showAllActiveGroupId.length > 0 &&
            this.searchResult.length > 0 &&
            currResult.length > 0 &&
            currResult.map((group, key) => {
                return (h("hbr-global-search-group", { showCount: true, noPadding: key === 0, groupConfig: group, showMore: this.showAllActiveGroupId === group.id, queryText: this.queryToHighlight, selectedItem: this.selectedItem && this.selectedItem.group === group.id
                        ? this.selectedItem.id
                        : "", limit: this.limit, selectResultHandler: this.selectResultHandler, showAllClickHandler: this.showAllClickHandler }));
            })))));
        const contentBox = (h("div", { class: "search__content" }, h("div", { class: "search__left_content" }, h("div", { class: "search__error_container" }, h("slot", { name: "error" })), searchResults), description));
        const noResults = (h("div", { class: "search__no_results" }, h("img", { src: noSearchResultsSvg, width: "300", height: "212", alt: "" }), h("div", { class: "search__image_description" }, noResMsg.split(". ").map((it) => (h("div", null, it))))));
        const loadingView = (h("div", { class: "search__loading" }, h("hbr-illustration", { size: "medium" }, h("div", { slot: "body" }, "Search results are loading..."))));
        const content = (h("slot", { name: "custom-result" }, h("div", { class: "search__content_wrapper", part: "content" }, this.showLoading ? (loadingView) : !this.result && this.searchResult.length > 0 ? (contentBox) : this.queryText.length > 0 &&
            !this.loading &&
            !this.typingInProgress ? (noResults) : (h("div", { class: "search__initial_search_content_box" }, accessibility, h("slot", { name: "initial_content" }))), h("slot", { name: "search-result" }))));
        return (h(Host, null, h("div", { class: {
                search__base: true,
                search__base_modal: this.active,
            }, part: "base" }, h("div", { class: {
                search__overlay: true,
                search__overlay_modal: this.active,
            } }), h("div", { class: {
                search: true,
                "search--active": this.active,
                "search--inactive": !this.active,
            }, part: `container${this.active ? " container-active" : ""}` }, searchBar, this.active && content))));
    }
    get host() { return this; }
    static get watchers() { return {
        "queryText": ["queryTextWatcher"],
        "value": ["valueWatcher"],
        "active": ["handleActiveChange"],
        "result": ["handleResultChange"]
    }; }
    static get style() { return HbrGlobalSearchStyle0; }
}, [1, "hbr-global-search", {
        "queryHandlers": [16],
        "uponEnter": [4, "upon-enter"],
        "debounceInterval": [2, "debounce-interval"],
        "limit": [2],
        "value": [1025],
        "initialMessage": [1, "initial-message"],
        "searchCallback": [16],
        "result": [1040],
        "updateStream": [4, "update-stream"],
        "noResultsMessage": [1, "no-results-message"],
        "searchResult": [32],
        "queryText": [32],
        "active": [32],
        "loading": [32],
        "showLoading": [32],
        "selectedItem": [32],
        "showAllActiveGroupId": [32],
        "subscription": [32],
        "errors": [32],
        "navigationStarted": [32],
        "typingInProgress": [32],
        "queryToHighlight": [32],
        "resetSearch": [64]
    }, undefined, {
        "queryText": ["queryTextWatcher"],
        "value": ["valueWatcher"],
        "active": ["handleActiveChange"],
        "result": ["handleResultChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-global-search", "hbr-badge", "hbr-global-search-group", "hbr-highlight", "hbr-icon", "hbr-icon-button", "hbr-illustration", "hbr-input", "hbr-popup", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-global-search":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrGlobalSearch$1);
            }
            break;
        case "hbr-badge":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-global-search-group":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-highlight":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-input":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrGlobalSearch = HbrGlobalSearch$1;
const defineCustomElement = defineCustomElement$1;

export { HbrGlobalSearch, defineCustomElement };

