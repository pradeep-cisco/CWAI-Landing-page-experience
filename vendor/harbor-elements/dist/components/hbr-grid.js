import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { c as cjs } from './cjs.js';
import { c as combineMergeArray } from './combineMergeArray.js';
import { d as debounce } from './function-helper.js';

let muuriPromise;
const loadMuuri = () => {
    if (!muuriPromise) {
        muuriPromise = import('./muuri.module.js');
    }
    return muuriPromise;
};

const constants = {
    containerClass: "hbr-css--grid",
    itemClass: "hbr-css--grid-item",
    itemVisibleClass: "hbr-css--grid-item-shown",
    itemHiddenClass: "hbr-css--grid-item-hidden",
    itemPositioningClass: "hbr-css--grid-item-positioning",
    itemDraggingClass: "hbr-css--grid-item-dragging",
    itemReleasingClass: "hbr-css--grid-item-releasing",
    itemPlaceholderClass: "hbr-css--grid-item-placeholder",
    scrSizes: {
        lg: "large",
        md: "medium",
        sm: "small",
    },
    scrWidthBreakPoints: {
        large: 1000,
        medium: 800,
        small: 0,
    },
    scrHeightBreakPoints: {
        large: 400,
        medium: 300,
        small: 0,
    },
};

// Copyright 2021 angvozde
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const utils = {
    createCustomElement: (tag, config) => {
        const element = document.createElement(tag);
        Object.keys(config).forEach((key) => {
            if (["innerHTML", "responsiveWidth", "responsiveHeight"].indexOf(key) !== -1) {
                element[key] = config[key];
            }
            else {
                element.setAttribute(key, config[key]);
            }
        });
        element.config = config;
        return element;
    },
};

const hbrGridCss = "hbr-grid{--margin-x:var(--hbr-spacing-2xs);display:block;position:relative;width:calc(100% + 2 * var(--margin-x));margin-left:calc(0px - var(--margin-x));opacity:0}";
const HbrGridStyle0 = hbrGridCss;

const { scrSizes, scrWidthBreakPoints, scrHeightBreakPoints } = constants;
const { createCustomElement } = utils;
const HbrGrid$1 = /*@__PURE__*/ proxyCustomElement(class HbrGrid extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.gridStateUpdated = createEvent(this, "hbr-grid-state-updated", 7);
        this.gridInitId = 0;
        this.getScreenSize = () => {
            let screenWidthSize;
            let screenHeightSize;
            const screenWidth = window.innerWidth;
            if (screenWidth >= scrWidthBreakPoints[scrSizes.lg]) {
                screenWidthSize = scrSizes.lg;
            }
            else if (screenWidth >= scrWidthBreakPoints[scrSizes.md] &&
                screenWidth < scrWidthBreakPoints[scrSizes.lg]) {
                screenWidthSize = scrSizes.md;
            }
            else {
                screenWidthSize = scrSizes.sm;
            }
            const screenHeight = window.innerHeight;
            if (screenHeight >= scrHeightBreakPoints[scrSizes.lg]) {
                screenHeightSize = scrSizes.lg;
            }
            else if (screenHeight >= scrHeightBreakPoints[scrSizes.md] &&
                screenHeight < scrHeightBreakPoints[scrSizes.lg]) {
                screenHeightSize = scrSizes.md;
            }
            else {
                screenHeightSize = scrSizes.sm;
            }
            this.updateGridItemProps("screenSize", {
                width: screenWidthSize,
                height: screenHeightSize,
            });
        };
        this.getPreviousGridItems = async () => {
            var _a, _b, _c;
            if (((_a = this.persistence) === null || _a === void 0 ? void 0 : _a.load) && typeof this.persistence.load === "function") {
                const pref = await this.persistence.load();
                if (!pref) {
                    const gridItems = (_b = this.grid) === null || _b === void 0 ? void 0 : _b.getItems();
                    this.itemsOrderArray = gridItems.map((item) => item._element.uuid);
                    this.loading = false;
                }
                else {
                    const { gridItems } = pref || {};
                    this.itemsOrderArray = pref.order;
                    this.gridItemsConfigsObj = pref.gridItems;
                    const deletedItems = [];
                    const addedItems = [];
                    if (gridItems) {
                        const DOMGridItems = (_c = this.grid) === null || _c === void 0 ? void 0 : _c.getItems();
                        Object.keys(gridItems).forEach((uuid, key) => {
                            const correntItem = gridItems[uuid];
                            const configToStr = JSON.stringify(correntItem.config);
                            // get deleted and added items
                            if (correntItem.deleted && !correntItem.config) {
                                deletedItems.push(DOMGridItems[key]);
                            }
                            if (correntItem.config &&
                                configToStr !== "{}" &&
                                !correntItem.deleted) {
                                addedItems.push(uuid);
                            }
                        });
                        if (deletedItems.length) {
                            this.grid.remove(deletedItems, { removeElements: true });
                        }
                        if (addedItems.length) {
                            this.dashletsToAdd = addedItems;
                            addedItems.forEach((item) => {
                                var _a;
                                const element = createCustomElement("hbr-grid-item", gridItems[item].config);
                                (_a = this.grid) === null || _a === void 0 ? void 0 : _a.add([element]);
                            });
                        }
                        else {
                            this.loading = false;
                        }
                    }
                    this.grid.sort((a, b) => {
                        return (this.itemsOrderArray.indexOf(a.getElement().uuid) -
                            this.itemsOrderArray.indexOf(b.getElement().uuid));
                    });
                }
            }
        };
        this.muuriConfig = {};
        this.removeItemsAllowed = false;
        this.filterFunction = undefined;
        this.sortFunction = undefined;
        this.selectable = false;
        this.multiSelect = true;
        this.state = undefined;
        this.type = "custom";
        this.persistence = null;
        this.selectedItems = [];
        this.notSelectabeItems = [];
        this.gridItemsConfigsObj = {};
        this.itemsOrderArray = [];
        this.loading = true;
        this.isMoving = false;
        this.dashletsToAdd = undefined;
    }
    stateWatcher(state) {
        this.gridStateUpdated.emit(state);
    }
    filterfunctionWatcher(filterFunc) {
        this.grid.filter((item) => {
            return filterFunc(item
                .getElement()
                .firstElementChild.firstElementChild.getAttribute("value"));
        });
    }
    sortfunctionWatcher(sortFunc) {
        this.grid.sort((a, b) => {
            const getValue = (item) => parseInt(item
                .getElement()
                .firstElementChild.firstElementChild.getAttribute("value"));
            return sortFunc(getValue(a), getValue(b));
        });
        this.savePersistence();
    }
    handleDragUpdates(newValue) {
        this.updateGridItemProps("isMoving", newValue);
    }
    syncSelection(newValue) {
        const items = [
            ...this.host.querySelectorAll("hbr-grid-item"),
        ];
        items.forEach((item) => {
            if (newValue && newValue.indexOf(item.uuid) !== -1) {
                item.selected = true;
            }
            else {
                item.selected = false;
            }
        });
    }
    async muuriConfigWatcher() {
        var _a, _b;
        if (this.grid) {
            (_a = this.grid) === null || _a === void 0 ? void 0 : _a.destroy();
            this.grid = undefined;
            await this.initializeMuuri(true);
            (_b = this.grid) === null || _b === void 0 ? void 0 : _b.layout(true);
        }
    }
    updateGridItemProps(prop, value) {
        const items = [
            ...this.host.querySelectorAll("hbr-grid-item"),
        ];
        items.forEach((item) => {
            item[prop] = value;
        });
    }
    componentWillLoad() {
        this.getScreenSize();
        if (this.selectable) {
            this.detectNotSelectableItems();
        }
    }
    async componentDidLoad() {
        var _a;
        await this.initializeMuuri();
        if (this.getPreviousGridItems) {
            await this.getPreviousGridItems();
        }
        else {
            this.loading = false;
        }
        window.addEventListener("resize", debounce(() => {
            this.getScreenSize();
        }, 100));
        (_a = this.grid) === null || _a === void 0 ? void 0 : _a.layout(true);
    }
    async initializeMuuri(layoutOnInit = false) {
        const initId = ++this.gridInitId;
        const { default: Muuri } = await loadMuuri();
        if (initId !== this.gridInitId || !this.host.isConnected) {
            return;
        }
        this.grid = new Muuri(this.host, cjs.all([
            { layoutOnInit: layoutOnInit }, // default muuri config
            this.muuriConfig, // dev overrides
            constants,
        ], { arrayMerge: combineMergeArray }));
        this.attachMuuriEvents();
    }
    attachMuuriEvents() {
        var _a;
        if (!this.grid) {
            return;
        }
        // @ts-ignore
        if ((_a = this.muuriConfig) === null || _a === void 0 ? void 0 : _a.dragEnabled) {
            this.grid.on("dragEnd", () => {
                var _a;
                if (this.isMoving) {
                    this.isMoving = false;
                    if (this.savePersistence) {
                        const gridItems = (_a = this.grid) === null || _a === void 0 ? void 0 : _a.getItems();
                        this.itemsOrderArray = gridItems.map((item) => item._element.uuid);
                        this.savePersistence();
                    }
                }
            });
            this.grid.on("dragMove", () => {
                if (!this.isMoving) {
                    this.isMoving = true;
                }
            });
        }
        this.grid.on("layoutEnd", () => {
            if (this.loading)
                this.loading = false;
        });
    }
    // Method for react type of frameworks, where props are hidden
    getGridItem(uuid) {
        return [...this.host.querySelectorAll("hbr-grid-item")].filter((item) => item.uuid === uuid);
    }
    addItemHandler(event) {
        var _a;
        const uuid = event.detail;
        if (!this.loading) {
            if (this.itemsOrderArray.indexOf(uuid) === -1) {
                // @ts-ignore
                this.gridItemsConfigsObj[uuid] = { config: event.target.config };
                this.itemsOrderArray = [...this.itemsOrderArray, uuid];
                const addedGridItem = this.getGridItem(uuid)[0];
                (_a = this.grid) === null || _a === void 0 ? void 0 : _a.add([addedGridItem]);
                this.savePersistence();
            }
            else {
                const addedGridItem = this.getGridItem(uuid)[1];
                if (addedGridItem) {
                    addedGridItem.remove();
                    alert(`grid item wuth uuid "${uuid}" already exists"`);
                }
            }
        }
        if (this.dashletsToAdd) {
            this.dashletsToAdd.splice(this.dashletsToAdd.indexOf(uuid), 1);
            if (!this.dashletsToAdd.length) {
                this.loading = false;
            }
        }
    }
    removeGridItemHandler(event) {
        const uuid = event.detail;
        const index = this.itemsOrderArray.indexOf(uuid);
        if (index !== -1) {
            this.grid.remove(this.grid.getItems(index), { removeElements: true });
            this.itemsOrderArray.splice(this.itemsOrderArray.indexOf(uuid), 1);
            this.gridItemsConfigsObj[uuid] = { deleted: true };
            this.savePersistence();
        }
        else {
            console.error("Item with such id doesn't exist");
        }
    }
    selectGridItemHandler(event) {
        const uuid = event.detail;
        if (this.selectable && this.notSelectabeItems.indexOf(uuid) === -1) {
            if (this.selectedItems && Array.isArray(this.selectedItems)) {
                if (this.selectedItems.indexOf(uuid) !== -1) {
                    this.selectedItems = this.selectedItems.filter((item) => item !== uuid);
                }
                else {
                    if (this.multiSelect) {
                        this.selectedItems = [...this.selectedItems, uuid];
                    }
                    else {
                        this.selectedItems = [uuid];
                    }
                }
            }
            else {
                this.selectedItems = [uuid];
            }
        }
    }
    savePersistence() {
        var _a;
        if (((_a = this.persistence) === null || _a === void 0 ? void 0 : _a.save) && typeof this.persistence.save === "function") {
            this.persistence.save("grid-persistence-save", {
                order: this.itemsOrderArray,
                gridItems: this.gridItemsConfigsObj,
            });
        }
    }
    detectNotSelectableItems() {
        const originalItems = [...this.host.querySelectorAll("hbr-grid-item")];
        const notSelectableItemsList = [];
        originalItems.forEach((item) => {
            if (item.notSelectable) {
                notSelectableItemsList.push(item.uuid);
            }
        });
        this.notSelectabeItems = notSelectableItemsList;
    }
    getSelected() {
        return Promise.resolve(this.selectedItems);
    }
    render() {
        return this.loading ? null : h(Host, { style: { opacity: "1" } });
    }
    get host() { return this; }
    static get watchers() { return {
        "state": ["stateWatcher"],
        "filterFunction": ["filterfunctionWatcher"],
        "sortFunction": ["sortfunctionWatcher"],
        "isMoving": ["handleDragUpdates"],
        "selectedItems": ["syncSelection"],
        "muuriConfig": ["muuriConfigWatcher"]
    }; }
    static get style() { return HbrGridStyle0; }
}, [0, "hbr-grid", {
        "muuriConfig": [16],
        "removeItemsAllowed": [4, "remove-items-allowed"],
        "filterFunction": [8, "filter-function"],
        "sortFunction": [8, "sort-function"],
        "selectable": [4],
        "multiSelect": [4, "multi-select"],
        "state": [8],
        "type": [1],
        "persistence": [16],
        "selectedItems": [32],
        "notSelectabeItems": [32],
        "gridItemsConfigsObj": [32],
        "itemsOrderArray": [32],
        "loading": [32],
        "isMoving": [32],
        "dashletsToAdd": [32],
        "getSelected": [64]
    }, [[0, "hbr-add-grid-item", "addItemHandler"], [0, "hbr-remove-grid-item", "removeGridItemHandler"], [0, "hbr-select-grid-item", "selectGridItemHandler"]], {
        "state": ["stateWatcher"],
        "filterFunction": ["filterfunctionWatcher"],
        "sortFunction": ["sortfunctionWatcher"],
        "isMoving": ["handleDragUpdates"],
        "selectedItems": ["syncSelection"],
        "muuriConfig": ["muuriConfigWatcher"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-grid"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-grid":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrGrid$1);
            }
            break;
    } });
}

const HbrGrid = HbrGrid$1;
const defineCustomElement = defineCustomElement$1;

export { HbrGrid, defineCustomElement };

