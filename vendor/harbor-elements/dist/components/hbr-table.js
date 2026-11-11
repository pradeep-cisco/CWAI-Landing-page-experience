import { setMode, h, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { r as reduce, e as each, f as size } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$d } from './icon.js';
import { g as getSourceItem, a as getSourceItemVirtualIndexByProp, s as setSourceByVirtualIndex, D as DataStore, b as getPhysical, c as setItems, d as setStore, e as getVisibleSourceItem, f as createStore } from './data.store.js';
import { G as GroupingColumnPlugin, B as BasePlugin, C as ColumnPlugin, d as defineCustomElement$6 } from './header.js';
import { t as timeout, g as getScrollbarWidth } from './utils.js';
import { i as isGrouping, g as getGroupingName, P as PSEUDO_GROUP_ITEM_ID, G as GROUP_EXPANDED, a as getParsedGroup, b as isSameGroup, c as GROUP_DEPTH, d as GROUPING_ROW_TYPE, e as PSEUDO_GROUP_ITEM_VALUE, f as PSEUDO_GROUP_COLUMN, h as GROUP_EXPAND_EVENT, j as gatherGrouping, k as isGroupingColumn, E as EMPTY_INDEX, S as SelectionStoreConnector } from './columnService.js';
import { i as isFilterBtn, F as FILTER_PROP } from './filter.button.js';
import { c as calculateDimensionData, g as getItemByIndex, a as getItemByPosition } from './dimension.helpers.js';
import { U as UUID } from './consts.js';
import { e as dotsSix } from './index2.js';
import { H as HEADER_SLOT, D as DATA_SLOT, g as getLastCell, C as CONTENT_SLOT, F as FOOTER_SLOT, d as defineCustomElement$3 } from './revogr-viewport-scroll.js';
import { d as defineCustomElement$f } from './button.js';
import { d as defineCustomElement$e } from './focus.js';
import { d as defineCustomElement$c } from './order-editor.js';
import { d as defineCustomElement$b } from './overlay-selection.js';
import { d as defineCustomElement$a } from './scroll-virtual.js';
import { d as defineCustomElement$9 } from './spinner.js';
import { d as defineCustomElement$8 } from './data.js';
import { d as defineCustomElement$7 } from './edit.js';
import { d as defineCustomElement$5 } from './header2.js';
import { d as defineCustomElement$4 } from './temp-range.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

class ThemeCohesion {
    constructor() {
        this.defaultRowSize = 42;
    }
}

class ThemeCompact {
    constructor() {
        this.defaultRowSize = 32;
    }
}

class ThemeDefault {
    constructor() {
        this.defaultRowSize = 27;
    }
}

class ThemeMagnetic {
    constructor() {
        this.defaultRowSize = 37;
    }
}

class ThemeMaterial {
    constructor() {
        this.defaultRowSize = 42;
    }
}

const DEFAULT_THEME = "cohesion";
const allowedThemes = [
    DEFAULT_THEME,
    "material",
    "magnetic",
    "compact",
    "darkMaterial",
    "darkCompact",
    "default",
];
class ThemeService {
    get theme() {
        return this.currentTheme;
    }
    get rowSize() {
        return this.customRowSize || this.currentTheme.defaultRowSize;
    }
    set rowSize(size) {
        this.customRowSize = size;
    }
    constructor(cfg) {
        this.customRowSize = 0;
        this.customRowSize = cfg.rowSize;
        this.register(cfg.theme);
    }
    register(theme) {
        const parsedTheme = ThemeService.getTheme(theme);
        switch (parsedTheme) {
            case "material":
            case "darkMaterial":
                this.currentTheme = new ThemeMaterial();
                break;
            case "compact":
            case "darkCompact":
                this.currentTheme = new ThemeCompact();
                break;
            case "cohesion":
                this.currentTheme = new ThemeCohesion();
                break;
            case "magnetic":
                this.currentTheme = new ThemeMagnetic();
                break;
            default:
                this.currentTheme = new ThemeDefault();
                break;
        }
    }
    static getTheme(theme) {
        if (allowedThemes.indexOf(theme) > -1) {
            return theme;
        }
        return DEFAULT_THEME;
    }
}

setMode((elm) => {
    if (elm.tagName.toLowerCase() !== "hbr-table") {
        return undefined;
    }
    let theme = elm.theme || elm.getAttribute("theme");
    if (typeof theme === "string") {
        theme = theme.trim();
    }
    const parsedTheme = ThemeService.getTheme(theme);
    if (parsedTheme !== theme) {
        elm.setAttribute("theme", parsedTheme);
    }
    return parsedTheme;
});

const rowTypes = [
    "rowPinStart",
    "rgRow",
    "rowPinEnd",
];
const columnTypes = [
    "colPinStart",
    "rgCol",
    "colPinEnd",
];
function isRowType(type) {
    return rowTypes.indexOf(type) > -1;
}

class ColumnDataProvider {
    get order() {
        return reduce(this.sorting, (r, c, prop) => {
            r[prop] = c.order;
            return r;
        }, {});
    }
    get stores() {
        return this.dataSources;
    }
    constructor() {
        this.sorting = null;
        this.dataSources = reduce(columnTypes, (sources, k) => {
            sources[k] = new DataStore(k);
            return sources;
        }, {});
    }
    column(c, pin) {
        return this.getColumn(c, pin || "rgCol");
    }
    getColumn(virtualIndex, type) {
        return getSourceItem(this.dataSources[type].store, virtualIndex);
    }
    getRawColumns() {
        return reduce(this.dataSources, (result, item, type) => {
            result[type] = item.store.get("source");
            return result;
        }, {
            rgCol: [],
            colPinStart: [],
            colPinEnd: [],
        });
    }
    getColumns(type = "all") {
        if (type !== "all") {
            return this.dataSources[type].store.get("source");
        }
        return columnTypes.reduce((r, t) => {
            r.push(...this.dataSources[t].store.get("source"));
            return r;
        }, []);
    }
    getColumnIndexByProp(prop, type) {
        return getSourceItemVirtualIndexByProp(this.dataSources[type].store, prop);
    }
    getColumnByProp(prop, type) {
        const items = this.dataSources[type].store.get("source");
        return items.find((c) => {
        });
    }
    refreshByType(type) {
        this.dataSources[type].refresh();
    }
    setColumns(data) {
        each(columnTypes, (k) => {
            // set columns data
            this.dataSources[k].updateData(data.columns[k], {
                // max depth level
                depth: data.maxLevel,
                // groups
                groups: reduce(data.columnGrouping[k], (res, g) => {
                    if (!res[g.level]) {
                        res[g.level] = [];
                    }
                    res[g.level].push(g);
                    return res;
                }, {}),
            });
        });
        this.sorting = data.sort;
        return data;
    }
    updateColumns(cols) {
        // collect column by type and property
        const columnByKey = cols.reduce((res, c) => {
            const type = ColumnDataProvider.getColumnType(c);
            if (!res[type]) {
                res[type] = {};
            }
            res[type][c.prop] = c;
            return res;
        }, {});
        // find indexes in source
        const colByIndex = {};
        each(columnByKey, (colsToUpdate, type) => {
            const items = this.dataSources[type].store.get("source");
            colByIndex[type] = items.reduce((result, rgCol, index) => {
                const colToUpdateIfExists = colsToUpdate[rgCol.prop];
                if (colToUpdateIfExists) {
                    result[index] = colToUpdateIfExists;
                }
                return result;
            }, {});
        });
        each(colByIndex, (colsToUpdate, type) => setSourceByVirtualIndex(this.dataSources[type].store, colsToUpdate));
    }
    updateColumn(column, index) {
        const type = ColumnDataProvider.getColumnType(column);
        setSourceByVirtualIndex(this.dataSources[type].store, { [index]: column });
    }
    updateColumnSorting(column, index, sorting) {
        this.clearSorting();
        column.order = sorting;
        this.sorting[column.prop] = column;
        this.updateColumn(column, index);
        return column;
    }
    clearSorting() {
        const types = reduce(this.sorting, (r, c) => {
            const k = ColumnDataProvider.getColumnType(c);
            r[k] = true;
            return r;
        }, {});
        each(types, (_, type) => {
            const cols = this.dataSources[type].store.get("source");
            each(cols, (c) => {
                c.order = undefined;
            });
            this.dataSources[type].setData({ source: [...cols] });
        });
        this.sorting = {};
    }
    static getSizes(cols) {
        return reduce(cols, (res, c, i) => {
            if (c.size) {
                res[i] = c.size;
            }
            return res;
        }, {});
    }
    static getColumnByProp(columns, prop) {
        return columns.find((c) => {
            if (GroupingColumnPlugin.isColGrouping(c)) {
                return ColumnDataProvider.getColumnByProp(c.children, prop);
            }
            return c.prop === prop;
        });
    }
    // columns processing
    static getColumns(columns, level = 0, types) {
        return reduce(columns, (res, colData) => {
            var _a;
            /** Grouped column */
            if (GroupingColumnPlugin.isColGrouping(colData)) {
                return GroupingColumnPlugin.gatherGroup(res, colData, ColumnDataProvider.getColumns(colData.children, level + 1, types), level);
            }
            /** Regular column */
            const regularColumn = Object.assign(Object.assign({}, (colData.columnType && types && types[colData.columnType])), colData);
            // not pin
            if (!regularColumn.pin) {
                res.columns.rgCol.push(regularColumn);
                // pin
            }
            else {
                res.columns[regularColumn.pin].push(regularColumn);
            }
            if (regularColumn.order) {
                res.sort[regularColumn.prop] = regularColumn;
            }
            // trigger setup hook if present
            (_a = regularColumn.beforeSetup) === null || _a === void 0 ? void 0 : _a.call(regularColumn, regularColumn);
            return res;
        }, {
            columns: {
                rgCol: [],
                colPinStart: [],
                colPinEnd: [],
            },
            columnGrouping: {
                rgCol: [],
                colPinStart: [],
                colPinEnd: [],
            },
            maxLevel: level,
            sort: {},
        });
    }
    static getColumnType(rgCol) {
        if (rgCol.pin) {
            return rgCol.pin;
        }
        return "rgCol";
    }
}

/**
 * Plugin module for revo-grid grid system
 * Add support for automatic column resize
 */
const LETTER_BLOCK_SIZE$1 = 7;
var ColumnAutoSizeMode;
(function (ColumnAutoSizeMode) {
    // increases column width on header click according the largest text value
    ColumnAutoSizeMode["headerClickAutosize"] = "headerClickAutoSize";
    // increases column width on data set and text edit, decreases performance
    ColumnAutoSizeMode["autoSizeOnTextOverlap"] = "autoSizeOnTextOverlap";
    // increases and decreases column width based on all items sizes, worst for performance
    ColumnAutoSizeMode["autoSizeAll"] = "autoSizeAll";
})(ColumnAutoSizeMode || (ColumnAutoSizeMode = {}));
class AutoSizeColumn extends BasePlugin {
    constructor(hbrtable, providers, config) {
        super(hbrtable);
        this.providers = providers;
        this.config = config;
        this.name = "auto-size-column";
        this.autoSizeColumns = null;
        /** for edge case when no columns defined before data */
        this.dataResolve = null;
        this.dataReject = null;
        this.letterBlockSize = (config === null || config === void 0 ? void 0 : config.letterBlockSize) || LETTER_BLOCK_SIZE$1;
        // create test container to check text width
        if (config === null || config === void 0 ? void 0 : config.preciseSize) {
            this.precsizeCalculationArea = this.initiatePresizeElement();
            hbrtable.appendChild(this.precsizeCalculationArea);
        }
        const aftersourceset = ({ detail: { source }, }) => {
            this.setSource(source);
        };
        const afteredit = ({ detail }) => {
            this.afteredit(detail);
        };
        const afterEditAll = ({ detail }) => {
            this.afterEditAll(detail);
        };
        const beforecolumnsset = ({ detail: { columns }, }) => {
            this.columnSet(columns);
        };
        const headerDblClick = ({ detail, }) => {
            const type = ColumnDataProvider.getColumnType(detail);
            const size = this.getColumnSize(detail.index, type);
            if (size) {
                this.providers.dimensionProvider.setDimensionSize(type, {
                    [detail.index]: size,
                });
            }
        };
        this.addEventListener("beforecolumnsset", beforecolumnsset);
        switch (config === null || config === void 0 ? void 0 : config.mode) {
            case ColumnAutoSizeMode.autoSizeOnTextOverlap:
                this.addEventListener("aftersourceset", aftersourceset);
                this.addEventListener("afteredit", afteredit);
                break;
            case ColumnAutoSizeMode.autoSizeAll:
                this.addEventListener("aftersourceset", aftersourceset);
                this.addEventListener("afteredit", afterEditAll);
                break;
            default:
                this.addEventListener("headerdblClick", headerDblClick);
                break;
        }
    }
    async autoSize(source, autoSize) {
        this.columnSet(autoSize);
        return this.setSource(source);
    }
    async setSource(source) {
        let autoSize = this.autoSizeColumns;
        if (this.dataReject) {
            this.dataReject();
            this.clearPromise();
        }
        /** If data set first and no column provided await until get one */
        if (!autoSize) {
            const request = new Promise((resolve, reject) => {
                this.dataResolve = resolve;
                this.dataReject = reject;
            });
            try {
                autoSize = await request;
            }
            catch (e) {
                return;
            }
        }
        // calculate sizes
        each(autoSize, (_v, type) => {
            const sizes = {};
            each(autoSize[type], (rgCol) => {
                // calculate size
                rgCol.size = sizes[rgCol.index] = source.reduce((prev, rgRow) => Math.max(prev, this.getLength(rgRow[rgCol.prop])), 0);
            });
            this.providers.dimensionProvider.setDimensionSize(type, sizes);
        });
    }
    getLength(len) {
        var _a;
        const padding = 15;
        if (!len) {
            return 0;
        }
        try {
            const str = len.toString();
            /**if exact calculation required proxy with html element, slow operation */
            if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.preciseSize) {
                this.precsizeCalculationArea.innerText = str;
                return this.precsizeCalculationArea.scrollWidth + padding * 2;
            }
            return str.length * this.letterBlockSize + padding * 2;
        }
        catch (e) {
            return 0;
        }
    }
    afteredit(e) {
        let data;
        if (this.isRangeEdit(e)) {
            data = e.data;
        }
        else {
            data = { 0: { [e.prop]: e.val } };
        }
        each(this.autoSizeColumns, (columns, type) => {
            const sizes = {};
            each(columns, (rgCol) => {
                // calculate size
                const size = reduce(data, (prev, rgRow) => {
                    if (typeof rgRow[rgCol.prop] === "undefined") {
                        return prev;
                    }
                    return Math.max(prev || 0, this.getLength(rgRow[rgCol.prop]));
                }, undefined);
                if (size && rgCol.size < size) {
                    rgCol.size = sizes[rgCol.index] = size;
                }
            });
            this.providers.dimensionProvider.setDimensionSize(type, sizes);
        });
    }
    afterEditAll(e) {
        const props = {};
        if (this.isRangeEdit(e)) {
            each(e.data, (r) => each(r, (_v, p) => {
                props[p] = true;
            }));
        }
        else {
            props[e.prop] = true;
        }
        each(this.autoSizeColumns, (columns, type) => {
            const sizes = {};
            each(columns, (rgCol) => {
                if (props[rgCol.prop]) {
                    const size = this.getColumnSize(rgCol.index, type);
                    if (size) {
                        sizes[rgCol.index] = size;
                    }
                }
            });
            this.providers.dimensionProvider.setDimensionSize(type, sizes);
        });
    }
    getColumnSize(index, type) {
        const rgCol = this.autoSizeColumns[type][index];
        if (!rgCol) {
            return 0;
        }
        return reduce(this.providers.dataProvider.stores, (r, s) => {
            const perStore = reduce(s.store.get("items"), (prev, _row, i) => {
                const item = getSourceItem(s.store, i);
                return Math.max(prev || 0, this.getLength(item[rgCol.prop]));
            }, 0);
            return Math.max(r, perStore);
        }, rgCol.size || 0);
    }
    columnSet(columns) {
        var _a;
        for (const t of columnTypes) {
            const type = t;
            const cols = columns[type];
            for (const i in cols) {
                if (cols[i].autoSize || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.allColumns)) {
                    if (!this.autoSizeColumns) {
                        this.autoSizeColumns = {};
                    }
                    if (!this.autoSizeColumns[type]) {
                        this.autoSizeColumns[type] = {};
                    }
                    this.autoSizeColumns[type][i] = Object.assign(Object.assign({}, cols[i]), { index: parseInt(i, 10) });
                }
            }
        }
        if (this.dataResolve) {
            this.dataResolve(this.autoSizeColumns);
            this.clearPromise();
        }
    }
    clearPromise() {
        this.dataResolve = null;
        this.dataReject = null;
    }
    isRangeEdit(e) {
        return !!e.data;
    }
    initiatePresizeElement() {
        const styleForFontTest = {
            position: "absolute",
            fontSize: "14px",
            height: "0",
            width: "0",
            whiteSpace: "nowrap",
            top: "0",
            overflowX: "scroll",
        };
        const el = document.createElement("div");
        for (const s in styleForFontTest) {
            el.style[s] = styleForFontTest[s];
        }
        el.classList.add("revo-test-container");
        return el;
    }
    destroy() {
        var _a;
        super.destroy();
        (_a = this.precsizeCalculationArea) === null || _a === void 0 ? void 0 : _a.remove();
    }
}

const INITIAL = {
    mime: "text/csv",
    fileKind: "csv",
    // BOM signature
    bom: true,
    columnDelimiter: ",",
    rowDelimiter: "\r\n",
    encoding: "",
};
// The ASCII character code 13 is called a Carriage Return or CR.
const CARRIAGE_RETURN = String.fromCharCode(13);
// Chr(13) followed by a Chr(10) that compose a proper CRLF.
const LINE_FEED = String.fromCharCode(10);
const DOUBLE_QT = String.fromCharCode(34);
const NO_BREAK_SPACE = String.fromCharCode(0xfeff);
const escapeRegex = /"/g;
const FORMULA_PREFIX_REGEX = /^[=+\-@\t\r]/;
class ExportCsv {
    constructor(options = {}) {
        this.options = Object.assign(Object.assign({}, INITIAL), options);
    }
    doExport({ data, headers, props }) {
        let result = this.options.bom ? NO_BREAK_SPACE : "";
        // any header
        if ((headers === null || headers === void 0 ? void 0 : headers.length) > 0) {
            headers.forEach((header) => {
                // ignore empty
                if (!header.length) {
                    return;
                }
                result += this.prepareHeader(header, this.options.columnDelimiter);
                result += this.options.rowDelimiter;
            });
        }
        data.forEach((rgRow, index) => {
            if (index > 0) {
                result += this.options.rowDelimiter;
            }
            // support grouping
            if (isGrouping(rgRow)) {
                result += this.parseCell(getGroupingName(rgRow), this.options.columnDelimiter);
                return;
            }
            result += props
                .map((p) => this.parseCell(rgRow[p], this.options.columnDelimiter))
                .join(this.options.columnDelimiter);
        });
        return result;
    }
    prepareHeader(columnHeaders, columnDelimiter) {
        let result = "";
        const newColumnHeaders = columnHeaders.map((v) => this.parseCell(v, columnDelimiter, true));
        result += newColumnHeaders.join(columnDelimiter);
        return result;
    }
    parseCell(value, columnDelimiter, force = false) {
        let escape = value;
        if (typeof value !== "string") {
            escape = JSON.stringify(value);
        }
        const toEscape = [CARRIAGE_RETURN, DOUBLE_QT, LINE_FEED, columnDelimiter];
        if (typeof escape === "undefined") {
            return "";
        }
        if (FORMULA_PREFIX_REGEX.test(escape)) {
            escape = `'${escape}`;
        }
        if (escape !== "" &&
            (force || toEscape.some((i) => escape.indexOf(i) >= 0))) {
            return `"${escape.replace(escapeRegex, '""')}"`;
        }
        return escape;
    }
}

var ExportTypes;
(function (ExportTypes) {
    ExportTypes["csv"] = "csv";
})(ExportTypes || (ExportTypes = {}));
class ExportFilePlugin extends BasePlugin {
    constructor() {
        super(...arguments);
        this.name = "exporting";
    }
    /** Exports string */
    async exportString(options = {}, t = ExportTypes.csv) {
        const data = await this.beforeexport();
        if (!data) {
            return null;
        }
        return this.formatter(t, options).doExport(data);
    }
    /** Exports Blob */
    async exportBlob(options = {}, t = ExportTypes.csv) {
        return await this.getBlob(this.formatter(t, options));
    }
    /** Export file */
    async exportFile(options = {}, t = ExportTypes.csv) {
        const formatter = this.formatter(t, options);
        const blob = await this.getBlob(formatter);
        // url
        const URL = window.URL || window.webkitURL;
        const a = document.createElement("a");
        const { filename, fileKind } = formatter.options;
        const name = `${filename}.${fileKind}`;
        const url = URL.createObjectURL(blob);
        a.style.display = "none";
        a.setAttribute("href", url);
        a.setAttribute("download", name);
        this.hbrtable.appendChild(a);
        a.dispatchEvent(new MouseEvent("click"));
        this.hbrtable.removeChild(a);
        // delay for revoke, correct for some browsers
        await timeout(120);
        URL.revokeObjectURL(url);
    }
    /** Blob object */
    async getBlob(formatter) {
        const type = `${formatter.options.mime};charset=${formatter.options.encoding}`;
        if (typeof Blob !== "undefined") {
            const data = await this.beforeexport();
            if (!data) {
                return null;
            }
            return new Blob([formatter.doExport(data)], { type });
        }
        return null;
    }
    // before event
    async beforeexport() {
        const data = await this.getData();
        const event = this.emit("beforeexport", {
            data,
        });
        if (event.defaultPrevented) {
            return null;
        }
        return event.detail.data;
    }
    async getData() {
        const data = await this.getSource();
        const colSource = [];
        const colPromises = [];
        columnTypes.forEach((t, i) => {
            colPromises.push(this.getColPerSource(t).then((s) => (colSource[i] = s)));
        });
        await Promise.all(colPromises);
        const columns = {
            headers: [],
            props: [],
        };
        for (const source of colSource) {
            source.headers.forEach((h, i) => {
                if (!columns.headers[i]) {
                    columns.headers[i] = [];
                }
                columns.headers[i].push(...h);
            });
            columns.props.push(...source.props);
        }
        return Object.assign({ data }, columns);
    }
    async getColPerSource(t) {
        const store = await this.hbrtable.getColumnStore(t);
        const source = store.get("source");
        const virtualIndexes = store.get("items");
        const depth = store.get("groupingDepth");
        const groups = store.get("groups");
        const colNames = [];
        const colProps = [];
        const visibleItems = virtualIndexes.reduce((r, v, virtualIndex) => {
            const prop = source[v].prop;
            colNames.push(source[v].name || "");
            colProps.push(prop);
            r[prop] = virtualIndex;
            return r;
        }, {});
        const rows = this.getGroupHeaders(depth, groups, virtualIndexes, visibleItems);
        rows.push(colNames);
        return {
            headers: rows,
            props: colProps,
        };
    }
    getGroupHeaders(depth, groups, items, visibleItems) {
        const rows = [];
        const template = new Array(items.length).fill("");
        for (let d = 0; d < depth; d++) {
            const rgRow = [...template];
            rows.push(rgRow);
            if (!groups[d]) {
                continue;
            }
            const levelGroups = groups[d];
            // add names of groups
            levelGroups.forEach((group) => {
                const minIndex = this.findGroupStartIndex(group.ids, visibleItems);
                if (typeof minIndex === "number") {
                    rgRow[minIndex] = group.name;
                }
            });
        }
        return rows;
    }
    findGroupStartIndex(ids, visibleItems) {
        let min;
        ids.forEach((id) => {
            const current = visibleItems[id];
            if (typeof current === "number") {
                if (typeof min !== "number" || min > current) {
                    min = current;
                }
            }
        });
        return min;
    }
    async getSource() {
        const data = [];
        const promisesData = [];
        rowTypes.forEach((t) => {
            const dataPart = [];
            data.push(dataPart);
            const promise = this.hbrtable
                .getVisibleSource(t)
                .then((d) => dataPart.push(...d));
            promisesData.push(promise);
        });
        await Promise.all(promisesData);
        return data.reduce((r, v) => {
            r.push(...v);
            return r;
        }, []);
    }
    // get correct class for future multiple types support
    formatter(type, options = {}) {
        switch (type) {
            case ExportTypes.csv:
                return new ExportCsv(options);
            default:
                throw new Error("Unknown format");
        }
    }
}

const eq = (value, extra) => {
    if (typeof value === "undefined" || (value === null && !extra)) {
        return true;
    }
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }
    return value.toLocaleLowerCase() === extra;
};
const notEq = (value, extra) => !eq(value, extra);
notEq.extra = "input";
eq.extra = "input";

const gtThan = (value, extra) => {
    let conditionValue;
    if (typeof value === "number") {
        conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
        return value > conditionValue;
    }
    return false;
};
gtThan.extra = "input";

const gtThanEq = (value, extra) => eq(value, extra) || gtThan(value, extra);
gtThanEq.extra = "input";

const lt = (value, extra) => {
    let conditionValue;
    if (typeof value === "number") {
        conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
        return value < conditionValue;
    }
    return false;
};
lt.extra = "input";

const lsEq = (value, extra) => eq(value, extra) || lt(value, extra);
lsEq.extra = "input";

const set = (value) => !(value === "" || value === null || value === void 0);
const notSet = (value) => !set(value);

const beginsWith = (value, extra) => {
    if (!value) {
        return false;
    }
    if (!extra) {
        return true;
    }
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }
    if (typeof extra !== "string") {
        extra = JSON.stringify(extra);
    }
    return value.toLocaleLowerCase().indexOf(extra.toLocaleLowerCase()) === 0;
};
beginsWith.extra = "input";

const contains = (value, extra) => {
    if (!value) {
        return false;
    }
    if (extra) {
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        return (value.toLocaleLowerCase().indexOf(extra.toString().toLowerCase()) > -1);
    }
    return true;
};
const notContains = (value, extra) => {
    return !contains(value, extra);
};
notContains.extra = "input";
contains.extra = "input";

const filterNames = {
    none: "None",
    empty: "Not set",
    notEmpty: "Set",
    eq: "Equal",
    notEq: "Not equal",
    begins: "Begins with",
    contains: "Contains",
    notContains: "Does not contain",
    eqN: "=",
    neqN: "!=",
    gt: ">",
    gte: ">=",
    lt: "<",
    lte: "<=",
};
const filterEntities = {
    none: () => true,
    empty: notSet,
    notEmpty: set,
    eq: eq,
    notEq: notEq,
    begins: beginsWith,
    contains: contains,
    notContains: notContains,
    eqN: eq,
    neqN: notEq,
    gt: gtThan,
    gte: gtThanEq,
    lt: lt,
    lte: lsEq,
};
const filterTypes = {
    string: [
        "notEmpty",
        "empty",
        "eq",
        "notEq",
        "begins",
        "contains",
        "notContains",
    ],
    number: ["notEmpty", "empty", "eqN", "neqN", "gt", "gte", "lt", "lte"],
};

const FILTER_TRIMMED_TYPE = "filter";
class FilterPlugin extends BasePlugin {
    constructor(revogrid, uiid, config) {
        super(revogrid);
        this.revogrid = revogrid;
        this.filterCollection = {};
        this.possibleFilters = Object.assign({}, filterTypes);
        this.possibleFilterNames = Object.assign({}, filterNames);
        this.possibleFilterEntities = Object.assign({}, filterEntities);
        if (config) {
            this.initConfig(config);
        }
        const headerclick = (e) => this.headerclick(e);
        const aftersourceset = () => {
            if (this.revogrid.disableFiltering) {
                return;
            }
            if (Object.keys(this.filterCollection).length) {
                this.filterByProps(this.filterCollection);
            }
        };
        this.addEventListener("headerclick", headerclick);
        this.addEventListener("aftersourceset", aftersourceset);
        this.handleFilter = this.filterByProps.bind(this);
        this.handleClearFilter = this.onClearFilter.bind(this);
        this.handleSearchTextChange = this.onSeachTextChange.bind(this);
        this.revogrid.registerVNode([
            h("revogr-filter-panel", { revogrid: this.revogrid, uuid: `filter-${uiid}`, filterNames: this.possibleFilterNames, filterEntities: this.possibleFilterEntities, onFilterChange: (e) => this.onFilterChange(e.detail), ref: (e) => (this.pop = e) }),
        ]);
    }
    initConfig(config) {
        if (config.collection) {
            this.filterCollection = Object.assign({}, config.collection);
        }
        if (config.customFilters) {
            for (const cType in config.customFilters) {
                const cFilter = config.customFilters[cType];
                if (!this.possibleFilters[cFilter.columnFilterType]) {
                    this.possibleFilters[cFilter.columnFilterType] = [];
                }
                this.possibleFilters[cFilter.columnFilterType].push(cType);
                this.possibleFilterEntities[cType] = cFilter.func;
                this.possibleFilterNames[cType] = cFilter.name;
            }
        }
        /**
         * which filters has to be included/excluded
         * convinient way to exclude system filters
         */
        if (config.include) {
            const filters = {};
            for (const t in this.possibleFilters) {
                // validate filters, if appropriate function present
                const newTypes = this.possibleFilters[t].filter((f) => config.include.indexOf(f) > -1);
                if (newTypes.length) {
                    filters[t] = newTypes;
                }
            }
            // if any valid filters provided show them
            if (Object.keys(filters).length > 0) {
                this.possibleFilters = filters;
            }
        }
    }
    async headerclick(e) {
        var _a;
        const el = (_a = e.detail.originalEvent) === null || _a === void 0 ? void 0 : _a.target;
        if (!isFilterBtn(el)) {
            return;
        }
        e.preventDefault();
        // close if same
        const changes = await this.pop.getChanges();
        if (changes && (changes === null || changes === void 0 ? void 0 : changes.prop) === e.detail.prop) {
            this.pop.show();
            return;
        }
        // filter button clicked, open filter dialog
        const gridPos = this.revogrid.getBoundingClientRect();
        const buttonPos = el.getBoundingClientRect();
        const prop = e.detail.prop;
        this.pop.filterTypes = this.getColumnFilter(e.detail.filter);
        this.pop.show(Object.assign(Object.assign({}, this.filterCollection[prop]), { x: buttonPos.x - gridPos.x, y: buttonPos.y - gridPos.y + buttonPos.height, prop }));
    }
    getColumnFilter(type) {
        let filterType = "string";
        if (!type) {
            return { [filterType]: this.possibleFilters[filterType] };
        }
        // if custom column filter
        if (this.isValidType(type)) {
            filterType = type;
            // if multiple filters applied
        }
        else if (typeof type === "object" && type.length) {
            return type.reduce((r, multiType) => {
                if (this.isValidType(multiType)) {
                    r[multiType] = this.possibleFilters[multiType];
                }
                return r;
            }, {});
        }
        return { [filterType]: this.possibleFilters[filterType] };
    }
    isValidType(type) {
        return !!(typeof type === "string" && this.possibleFilters[type]);
    }
    // called on internal component change
    async onFilterChange(filterItem) {
        this.filterByProps({ [filterItem.prop]: filterItem });
    }
    /**
     * clear all the filter
     */
    async onClearFilter() {
        const columns = await this.revogrid.getColumns();
        const filterItems = columns.reduce((cum, cur) => {
            cum[cur.prop] = {
                prop: cur.prop,
                type: "none",
                value: "",
            };
            return cum;
        }, {});
        // @ts-ignore
        await this.filterByProps(filterItems, true);
    }
    async onSeachTextChange(value) {
        const source = await this.revogrid.getSource();
        const columns = await this.revogrid.getColumns();
        const { defaultPrevented: beforefilterapplyDefaultPrevented } = this.emit("beforefilterapply", {
            collection: this.filterCollection,
            source,
            columns,
        });
        if (beforefilterapplyDefaultPrevented) {
            return;
        }
        const searchFilter = await this.getSearchTextRowFilter(value);
        const columnFilter = await this.getAllColumnSearchFilter();
        const filter = Object.assign(Object.assign({}, searchFilter), columnFilter);
        // check is filter event prevented
        const { defaultPrevented } = this.emit("beforefiltertrimmed", {
            collection: this.filterCollection,
            itemsToFilter: filter,
            source,
        });
        if (defaultPrevented) {
            return;
        }
        // check is trimmed event prevented
        const isAddedEvent = await this.revogrid.addTrimmed(filter, FILTER_TRIMMED_TYPE);
        if (isAddedEvent.defaultPrevented) {
            return;
        }
        this.emit("afterFilterApply", {
            collection: this.filterCollection,
            itemsToFilter: filter,
            source,
        });
    }
    /**
     * get search text row filter
     * @param value: search text
     * @returns
     */
    async getSearchTextRowFilter(value) {
        const source = await this.revogrid.getSource();
        const columns = await this.revogrid.getColumns();
        const itemsToFilter = columns.reduce((con, cur) => {
            const condition = {
                [cur.prop]: {
                    filter: this.possibleFilterEntities.contains,
                    type: "contains",
                    value,
                },
            };
            const rowFilter = this.getRowFilter(source, condition);
            Object.keys(rowFilter).forEach((r) => {
                if (!con.hasOwnProperty(r))
                    con[r] = 1;
                else
                    con[r]++;
            });
            return con;
        }, {});
        Object.keys(itemsToFilter).forEach((i) => {
            if (itemsToFilter[i] !== columns.length)
                delete itemsToFilter[i];
        });
        return itemsToFilter;
    }
    /**
     * get columns search filter
     * @returns
     */
    async getAllColumnSearchFilter() {
        const columns = await this.revogrid.getColumns();
        const source = await this.revogrid.getSource();
        // todo improvement: loop through collection of props
        const collection = this.filterCollection;
        columns.forEach((rgCol) => {
            const column = Object.assign({}, rgCol);
            const hasFilter = collection[column.prop];
            if (column[FILTER_PROP] && !hasFilter) {
                delete column[FILTER_PROP];
            }
            if (!column[FILTER_PROP] && hasFilter) {
                column[FILTER_PROP] = true;
            }
        });
        const itemsToFilter = this.getRowFilter(source, collection);
        return itemsToFilter;
    }
    /**
     * Apply filters collection to extend existing one or override
     * @method
     * @param conditions - list of filters to apply
     */
    async filterByProps(conditions, override = false) {
        if (override) {
            this.filterCollection = {};
        }
        for (const prop in conditions) {
            const { type, value } = conditions[prop];
            if (type === "none") {
                delete this.filterCollection[prop];
            }
            else {
                const filter = this.possibleFilterEntities[type];
                this.filterCollection[prop] = {
                    filter,
                    value,
                    type,
                };
            }
        }
        const source = await this.revogrid.getSource();
        const columns = await this.revogrid.getColumns();
        const { defaultPrevented, detail } = this.emit("beforefilterapply", {
            collection: this.filterCollection,
            source,
            columns,
        });
        if (defaultPrevented) {
            return;
        }
        this.doFiltering(detail.collection, detail.source, detail.columns);
    }
    /**
     * Triggers grid filtering
     */
    async doFiltering(collection, items, columns) {
        const columnsToUpdate = [];
        // todo improvement: loop through collection of props
        columns.forEach((rgCol) => {
            const column = Object.assign({}, rgCol);
            const hasFilter = collection[column.prop];
            if (column[FILTER_PROP] && !hasFilter) {
                delete column[FILTER_PROP];
                columnsToUpdate.push(column);
            }
            if (!column[FILTER_PROP] && hasFilter) {
                columnsToUpdate.push(column);
                column[FILTER_PROP] = true;
            }
        });
        let itemsToFilter = this.getRowFilter(items, collection);
        // @ts-ignore
        if (this.hbrtable.searchText) {
            // @ts-ignore
            const searchTextFilter = await this.getSearchTextRowFilter(this.hbrtable.searchText);
            itemsToFilter = Object.assign(Object.assign({}, itemsToFilter), searchTextFilter);
        }
        // check is filter event prevented
        const { defaultPrevented, detail } = this.emit("beforefiltertrimmed", {
            collection,
            itemsToFilter,
            source: items,
        });
        if (defaultPrevented) {
            return;
        }
        // check is trimmed event prevented
        const isAddedEvent = await this.revogrid.addTrimmed(detail.itemsToFilter, FILTER_TRIMMED_TYPE);
        if (isAddedEvent.defaultPrevented) {
            return;
        }
        await this.revogrid.updateColumns(columnsToUpdate);
        this.emit("afterFilterApply", { collection, itemsToFilter, source: items });
    }
    getRowFilter(rows, collection) {
        const trimmed = {};
        rows.forEach((model, rowIndex) => {
            for (const prop in collection) {
                const filterItem = collection[prop];
                const filter = filterItem.filter;
                if (!filter(model[prop], filterItem.value)) {
                    trimmed[rowIndex] = true;
                }
            }
        });
        return trimmed;
    }
}

// provide collapse data
function doCollapse(pIndex, source) {
    const model = source[pIndex];
    const currentId = model[PSEUDO_GROUP_ITEM_ID];
    const trimmed = {};
    let i = pIndex + 1;
    const total = source.length;
    while (i < total) {
        const currentModel = source[i];
        if (isGrouping(currentModel)) {
            if (currentId !== currentModel[PSEUDO_GROUP_ITEM_ID]) {
                break;
            }
            currentModel[GROUP_EXPANDED] = false;
        }
        trimmed[i++] = true;
    }
    model[GROUP_EXPANDED] = false;
    return { trimmed };
}
/**
 *
 * @param pIndex - physical index
 * @param vIndex - virtual index, need to update item collection
 * @param source - data source
 * @param rowItemsIndexes - rgRow indexes
 */
function doExpand(vIndex, source, rowItemsIndexes) {
    const physicalIndex = rowItemsIndexes[vIndex];
    const model = source[physicalIndex];
    const currentGroup = getParsedGroup(model[PSEUDO_GROUP_ITEM_ID]);
    const trimmed = {};
    // no group found
    if (!currentGroup) {
        return { trimmed };
    }
    const groupItems = [];
    model[GROUP_EXPANDED] = true;
    let i = physicalIndex + 1;
    const total = source.length;
    let groupLevelOnly = 0;
    // go through all rows
    while (i < total) {
        const currentModel = source[i];
        const isGroup = isGrouping(currentModel);
        // group found
        if (isGroup) {
            if (!isSameGroup(currentGroup, model, currentModel)) {
                break;
            }
            if (!groupLevelOnly) {
                // if get group first it's group only level
                groupLevelOnly = currentModel[GROUP_DEPTH];
            }
        }
        // level 0 or same depth
        if (!groupLevelOnly ||
            (isGroup && groupLevelOnly === currentModel[GROUP_DEPTH])) {
            trimmed[i] = false;
            groupItems.push(i);
        }
        i++;
    }
    const result = {
        trimmed,
    };
    if (groupItems.length) {
        const items = [...rowItemsIndexes];
        items.splice(vIndex + 1, 0, ...groupItems);
        result.items = items;
    }
    return result;
}

const TRIMMED_GROUPING = "grouping";
/**
 * Prepare trimming updated indexes for grouping
 * @param initiallyTrimed
 * @param firstLevelMap
 * @param secondLevelMap
 */
function processDoubleConversionTrimmed(initiallyTrimed, firstLevelMap, secondLevelMap) {
    const trimemedOptionsToUpgrade = {};
    /**
     * go through all groups except grouping
     */
    for (const type in initiallyTrimed) {
        if (type === TRIMMED_GROUPING) {
            continue;
        }
        const items = initiallyTrimed[type];
        const newItems = {};
        for (const initialIndex in items) {
            /**
             * if item exists we find it in collection
             * we support 2 level of conversions
             */
            let newConversionIndex = firstLevelMap[initialIndex];
            if (secondLevelMap) {
                newConversionIndex = secondLevelMap[newConversionIndex];
            }
            /**
             * if item was trimmed previously
             * trimming makes sense to apply
             */
            if (items[initialIndex]) {
                newItems[newConversionIndex] = true;
                /**
                 * If changes present apply changes to new source
                 */
                if (newConversionIndex !== parseInt(initialIndex, 10)) {
                    trimemedOptionsToUpgrade[type] = newItems;
                }
            }
        }
    }
    return trimemedOptionsToUpgrade;
}

class GroupingRowPlugin extends BasePlugin {
    get hasProps() {
        var _a, _b;
        return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.length;
    }
    get store() {
        return this.providers.dataProvider.stores[GROUPING_ROW_TYPE].store;
    }
    // proxy for items get
    get rowItems() {
        return this.store.get("items");
    }
    get trimmed() {
        return this.store.get("trimmed");
    }
    constructor(revogrid, providers) {
        super(revogrid);
        this.revogrid = revogrid;
        this.providers = providers;
    }
    // befoce cell focus
    onFocus(e) {
        if (isGrouping(e.detail.model)) {
            e.preventDefault();
        }
    }
    // expand event triggered
    onExpand({ virtualIndex }) {
        const { source } = this.getSource();
        let newTrimmed = this.trimmed[TRIMMED_GROUPING];
        const i = getPhysical(this.store, virtualIndex);
        const model = source[i];
        const prevExpanded = model[GROUP_EXPANDED];
        if (!prevExpanded) {
            const { trimmed, items } = doExpand(virtualIndex, source, this.rowItems);
            newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
            if (items) {
                setItems(this.store, items);
            }
        }
        else {
            const { trimmed } = doCollapse(i, source);
            newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
            this.revogrid.clearFocus();
        }
        this.store.set("source", source);
        this.revogrid.addTrimmed(newTrimmed, TRIMMED_GROUPING);
    }
    // get source based on proxy item collection to preserve rgRow order
    getSource(withoutGrouping = false) {
        const source = this.store.get("source");
        const items = this.store.get("proxyItems");
        let index = 0;
        // order important here, expected parent is first, then others
        return items.reduce((result, i) => {
            const model = source[i];
            if (!withoutGrouping) {
                result.source.push(model);
                return result;
            }
            // grouping filter
            if (!isGrouping(model)) {
                result.source.push(model);
                result.oldNewIndexes[i] = index;
                index++;
            }
            else {
                if (model[GROUP_EXPANDED]) {
                    result.prevExpanded[model[PSEUDO_GROUP_ITEM_VALUE]] = true;
                }
            }
            return result;
        }, {
            source: [],
            prevExpanded: {},
            oldNewIndexes: {},
        });
    }
    setColumnGrouping(cols) {
        // if 0 column as holder
        if (cols === null || cols === void 0 ? void 0 : cols.length) {
            cols[0][PSEUDO_GROUP_COLUMN] = true;
            return true;
        }
        return false;
    }
    setColumns({ columns }) {
        for (const type of columnTypes) {
            if (this.setColumnGrouping(columns[type])) {
                break;
            }
        }
    }
    // evaluate drag between groups
    onDrag(e) {
        const { from, to } = e.detail;
        const isDown = to - from >= 0;
        const { source } = this.getSource();
        const items = this.rowItems;
        let i = isDown ? from : to;
        const end = isDown ? to : from;
        for (; i < end; i++) {
            const model = source[items[i]];
            const isGroup = isGrouping(model);
            if (isGroup) {
                e.preventDefault();
                return;
            }
        }
    }
    beforeTrimmedApply(trimmed, type) {
        /** Before filter apply remove grouping filtering */
        if (type === FILTER_TRIMMED_TYPE) {
            const source = this.store.get("source");
            for (const index in trimmed) {
                if (trimmed[index] && isGrouping(source[index])) {
                    trimmed[index] = false;
                }
            }
        }
    }
    // subscribe to grid events to process them accordingly
    subscribe() {
        /** if grouping present and new data source arrived */
        this.addEventListener("beforesourceset", ({ detail }) => this.onDataSet(detail));
        this.addEventListener("beforecolumnsset", ({ detail }) => this.setColumns(detail));
        /**
         * filter applied need to clear grouping and apply again
         * based on new results can be new grouping
         */
        this.addEventListener("beforetrimmed", ({ detail: { trimmed, trimmedType } }) => this.beforeTrimmedApply(trimmed, trimmedType));
        /**
         * sorting applied need to clear grouping and apply again
         * based on new results whole grouping order will changed
         */
        this.addEventListener("afterSortingApply", () => this.doSourceUpdate());
        /**
         * Apply logic for focus inside of grouping
         * We can't focus on grouping rows, navigation only inside of groups for now
         */
        this.addEventListener("beforecellfocus", (e) => this.onFocus(e));
        /**
         * Prevent rgRow drag outside the group
         */
        this.addEventListener("roworderchanged", (e) => this.onDrag(e));
        /**
         * When grouping expand icon was clicked
         */
        this.addEventListener(GROUP_EXPAND_EVENT, ({ detail }) => this.onExpand(detail));
    }
    /**
     * Starts global source update with group clearing and applying new one
     * Initiated when need to reapply grouping
     */
    doSourceUpdate(options) {
        if (!this.hasProps) {
            return;
        }
        /**
         * Get source without grouping
         * @param newOldIndexMap - provides us mapping with new indexes vs old indexes, we would use it for trimmed mapping
         */
        const { source, prevExpanded, oldNewIndexes } = this.getSource(true);
        /**
         * Group again
         * @param oldNewIndexMap - provides us mapping with new indexes vs old indexes
         */
        const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup, } = gatherGrouping(source, 
        // filter
        (item) => { var _a; return (_a = this.options) === null || _a === void 0 ? void 0 : _a.props.map((key) => item[key]); }, Object.assign({ prevExpanded }, options));
        // setup source
        this.providers.dataProvider.setData(sourceWithGroups, GROUPING_ROW_TYPE, { depth }, true);
        this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexes, oldNewIndexMap);
    }
    /**
     * Apply grouping on data set
     * Clear grouping from source
     * If source came from other plugin
     */
    onDataSet(data) {
        if (!this.hasProps || !(data === null || data === void 0 ? void 0 : data.source) || !data.source.length) {
            return;
        }
        const source = data.source.filter((s) => !isGrouping(s));
        const expanded = this.revogrid.grouping || {};
        const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup, } = gatherGrouping(source, 
        // filter
        (item) => { var _a; return (_a = this.options) === null || _a === void 0 ? void 0 : _a.props.map((key) => item[key]); }, Object.assign({}, (expanded || {})));
        data.source = sourceWithGroups;
        this.providers.dataProvider.setGrouping({ depth });
        this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexMap);
    }
    // apply grouping
    setGrouping(options) {
        // unsubscribe from all events when group applied
        this.clearSubscriptions();
        this.options = options;
        // clear props, no grouping exists
        if (!options.props || !Object.keys(options.props).length) {
            this.clearGrouping();
            return;
        }
        // props exist and source inited
        const { source } = this.getSource();
        if (source.length) {
            this.doSourceUpdate(Object.assign({}, options));
        }
        // props exist and columns inited
        for (const t of columnTypes) {
            if (this.setColumnGrouping(this.providers.columnProvider.getColumns(t))) {
                this.providers.columnProvider.refreshByType(t);
                break;
            }
        }
        // if has any grouping subscribe to events again
        this.subscribe();
    }
    // clear grouping
    clearGrouping() {
        // clear columns
        columnTypes.forEach((t) => {
            const cols = this.providers.columnProvider.getColumns(t);
            let deleted = false;
            cols.forEach((c) => {
                if (isGroupingColumn(c)) {
                    delete c[PSEUDO_GROUP_COLUMN];
                    deleted = true;
                }
            });
            // if column store had grouping clear and refresh
            if (deleted) {
                this.providers.columnProvider.refreshByType(t);
            }
        });
        // clear rows
        const { source, oldNewIndexes } = this.getSource(true);
        this.providers.dataProvider.setData(source, GROUPING_ROW_TYPE, undefined, true);
        this.updateTrimmed(undefined, undefined, oldNewIndexes);
    }
    updateTrimmed(trimmedGroup, _childrenByGroup, firstLevelMap, secondLevelMap) {
        // map previously trimmed data
        const trimemedOptionsToUpgrade = processDoubleConversionTrimmed(this.trimmed, firstLevelMap, secondLevelMap);
        for (const type in trimemedOptionsToUpgrade) {
            this.revogrid.addTrimmed(trimemedOptionsToUpgrade[type], type);
        }
        // const emptyGroups = this.filterOutEmptyGroups(trimemedOptionsToUpgrade, childrenByGroup);
        // setup trimmed data for grouping
        this.revogrid.addTrimmed(Object.assign({}, trimmedGroup), TRIMMED_GROUPING);
    }
}

class PaginationPlugin extends BasePlugin {
    constructor(tbSelf) {
        var _a, _b, _c;
        super(tbSelf.element);
        this.tbSelf = tbSelf;
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.changePageNumber = this.changePageNumber.bind(this);
        this.hanleScrollPostion = this.hanleScrollPostion.bind(this);
        //@ts-ignore
        this.addEventListener("hbr-page-changed", this.handlePageChanged);
        this.addEventListener("hbr-size-changed", this.handlePageChanged);
        tbSelf.element.addEventListener("afterFilterApply", this.hanleScrollPostion);
        if (tbSelf.subscribers && typeof tbSelf.subscribers === "object") {
            tbSelf.subscribers["hbr-page-changed"] = this.handlePageChanged;
            tbSelf.subscribers["hbr-size-changed"] = this.handlePageChanged;
        }
        this.tbSelf.element.registerVNode([
            h("hbr-pagination", { 
                // @ts-ignore
                uuid: `pagination-${tbSelf.uuid}`, page: ((_a = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.pagination) === null || _a === void 0 ? void 0 : _a.page) || 0, "page-size": ((_b = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.pagination) === null || _b === void 0 ? void 0 : _b.pageSize) || 10, "item-count": ((_c = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.source) === null || _c === void 0 ? void 0 : _c.length) || 0, ref: (r) => (this.paginationRef = r) }),
        ]);
        setTimeout(() => {
            var _a, _b, _c;
            if ((_a = tbSelf.pagination) === null || _a === void 0 ? void 0 : _a.page) {
                const pageSize = ((_b = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.pagination) === null || _b === void 0 ? void 0 : _b.pageSize) || 10;
                const page = (_c = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.pagination) === null || _c === void 0 ? void 0 : _c.page;
                this.tbSelf.scrollToRow(page * pageSize);
            }
        }, 500);
    }
    destroy() {
        this.tbSelf.element.removeEventListener("afterFilterApply", this.hanleScrollPostion);
    }
    changePageNumber(e) {
        var _a, _b, _c, _d;
        this.clearSelection();
        const rowSize = ((_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.themeService) === null || _b === void 0 ? void 0 : _b.rowSize) || 0;
        const pageSize = ((_d = (_c = this.tbSelf) === null || _c === void 0 ? void 0 : _c.pagination) === null || _d === void 0 ? void 0 : _d.pageSize) || 10;
        let currentPage = e.detail.coordinate / rowSize / pageSize;
        currentPage = Math.floor(currentPage);
        currentPage = currentPage < 0 ? 0 : currentPage;
        if (this.paginationRef) {
            this.paginationRef.page = currentPage;
        }
    }
    hanleScrollPostion() {
        this.tbSelf.scrollToRow(0);
    }
    handlePageChanged(e) {
        var _a, _b;
        this.clearSelection();
        const target = (e === null || e === void 0 ? void 0 : e.target) || this.paginationRef;
        const pageSize = (target === null || target === void 0 ? void 0 : target.pageSize) || 0;
        let page = (e === null || e === void 0 ? void 0 : e.detail) || 0;
        if (typeof ((_a = this.tbSelf.pagination) === null || _a === void 0 ? void 0 : _a.page) === "number") {
            this.tbSelf.pagination.page = page;
        }
        if (typeof ((_b = this.tbSelf.pagination) === null || _b === void 0 ? void 0 : _b.pageSize) === "number") {
            this.tbSelf.pagination.pageSize = pageSize;
        }
        if (typeof (e === null || e === void 0 ? void 0 : e.detail) !== "number" || !Number.isInteger(page))
            page = 0;
        this.tbSelf.scrollToRow(page * pageSize);
        this.tbSelf.element.refresh();
    }
    clearSelection() {
        var _a, _b, _c, _d, _e, _f;
        (_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.selectionStoreConnector) === null || _b === void 0 ? void 0 : _b.clearAll();
        (_d = (_c = this.tbSelf) === null || _c === void 0 ? void 0 : _c.selectionStoreConnector) === null || _d === void 0 ? void 0 : _d.setEdit(false);
        (_f = (_e = this.tbSelf) === null || _e === void 0 ? void 0 : _e.viewport) === null || _f === void 0 ? void 0 : _f.clearFocused();
    }
    rePagination() {
        this.clearSelection();
        const filteredItems = this.tbSelf.dataProvider.stores.rgRow.store.get("items");
        if (filteredItems) {
            this.paginationRef.itemCount = filteredItems.length;
            this.paginationRef.page = 0;
        }
    }
    getPageSize() {
        var _a, _b;
        return (((_a = this.paginationRef) === null || _a === void 0 ? void 0 : _a.pageSize) || ((_b = this.tbSelf.pagination) === null || _b === void 0 ? void 0 : _b.pageSize) || 10);
    }
    getRowSize() {
        var _a, _b;
        return ((_b = (_a = this.tbSelf) === null || _a === void 0 ? void 0 : _a.themeService) === null || _b === void 0 ? void 0 : _b.rowSize) || 42;
    }
    getRealSize(count) {
        const height = this.getVerticalInnerHeight();
        let realSize = 0;
        const pageSize = this.getPageSize();
        const rowSize = this.getRowSize();
        const totalPage = Math.ceil(count / pageSize);
        realSize = rowSize * pageSize * totalPage;
        if (height) {
            const totalInnerHeight = totalPage * height;
            if (totalInnerHeight > realSize) {
                realSize = totalInnerHeight;
            }
        }
        return realSize;
    }
    canSelectOrEditPagination(cell) {
        var _a, _b;
        const pageSize = (_a = this.paginationRef) === null || _a === void 0 ? void 0 : _a.pageSize;
        const page = ((_b = this.paginationRef) === null || _b === void 0 ? void 0 : _b.page) + 1;
        const yStart = pageSize * page - pageSize;
        const yEnd = pageSize * page;
        if (!cell || (cell && cell.y < yStart) || (cell && cell.y >= yEnd))
            return true;
        return false;
    }
    getRows(rows) {
        var _a;
        const items = this.tbSelf.dataProvider.stores.rgRow.dataStore.get("items");
        const pageSize = this.getPageSize();
        const page = (_a = this.paginationRef) === null || _a === void 0 ? void 0 : _a.page;
        return rows.filter(({ itemIndex }) => {
            const start = pageSize * page;
            const end = start + pageSize;
            return start <= itemIndex && itemIndex < end && itemIndex < items.length;
        });
    }
    getVerticalInnerHeight() {
        var _a;
        const innerElement = this.tbSelf.element.querySelector(".vertical-inner");
        const height = (_a = innerElement === null || innerElement === void 0 ? void 0 : innerElement.getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.height;
        return height;
    }
    getLastPageHeight() {
        const items = this.tbSelf.dataProvider.stores.rgRow.dataStore.get("items");
        return (items.length % this.getPageSize()) * this.getRowSize();
    }
    isStopScrolling() {
        const height = this.getVerticalInnerHeight();
        const lastPageHeight = this.getLastPageHeight();
        const isLastPage = this.isLastPage();
        return height && isLastPage && lastPageHeight && lastPageHeight < height;
    }
    isLastPage() {
        const pageSize = this.getPageSize();
        const itemCount = this.paginationRef.itemCount;
        const refLastPage = Math.ceil(itemCount / pageSize);
        return this.paginationRef.page + 1 === refLastPage;
    }
}

/**
 * lifecycle
 * 1) @event beforesorting - sorting just started, nothing happened yet
 * 2) @metod updateColumnSorting - column sorting icon applied to grid and column get updated, data still untiuched
 * 3) @event beforesortingapply - before we applied sorting data to data source, you can prevent data apply from here
 * 4) @event afterSortingApply - sorting applied, just finished event
 *
 * If you prevent event it'll not reach farther steps
 */
class SortingPlugin extends BasePlugin {
    get name() {
        return "internalSorting";
    }
    get hasSorting() {
        return !!this.sorting;
    }
    constructor(revogrid) {
        super(revogrid);
        this.revogrid = revogrid;
        this.sorting = null;
        this.sortingFunc = null;
        this.handleSorting = this.updateColumnSorting.bind(this);
        const beforesourceset = ({ detail }) => {
            if (this.hasSorting) {
                // is sorting allowed
                const event = this.emit("beforesourcesortingapply");
                // sorting prevented
                if (event.defaultPrevented) {
                    return;
                }
            }
            const data = this.setData(detail.source, detail.type);
            if (data) {
                detail.source = data;
            }
        };
        const aftercolumnsset = async ({ detail: { order }, }) => {
            const beforeEvent = this.emit("beforecolumnsordersort", {
                detail: { order },
            });
            if (beforeEvent.defaultPrevented) {
                return;
            }
            const columns = await this.revogrid.getColumns();
            const sortingFunc = {};
            for (const prop in order) {
                const column = ColumnDataProvider.getColumnByProp(columns, prop);
                const cmp = (column === null || column === void 0 ? void 0 : column.cellCompare) || this.defaultCellCompare;
                sortingFunc[prop] =
                    order[prop] === "desc" ? this.descCellCompare(cmp) : cmp;
            }
            this.sort(order, sortingFunc);
        };
        const headerclick = async (e) => {
            if (e.defaultPrevented) {
                return;
            }
            if (!e.detail.column.sortable) {
                return;
            }
            this.headerclick(e.detail.column, e.detail.index);
        };
        this.addEventListener("beforesourceset", beforesourceset);
        this.addEventListener("aftercolumnsset", aftercolumnsset);
        this.addEventListener("initialHeaderClick", headerclick);
    }
    async updateColumnSorting(column, index, order) {
        const beforeEvent = this.emit("beforesorting", { column, order });
        if (beforeEvent.defaultPrevented) {
            return;
        }
        order = beforeEvent.detail.order;
        const newCol = await this.revogrid.updateColumnSorting(beforeEvent.detail.column, index, order);
        // apply sort data
        const beforeApplyEvent = this.emit("beforesortingapply", {
            column: newCol,
            order,
        });
        if (beforeApplyEvent.defaultPrevented) {
            return;
        }
        order = beforeApplyEvent.detail.order;
        const cmp = (column === null || column === void 0 ? void 0 : column.cellCompare) || this.defaultCellCompare;
        this.sort({ [column.prop]: order }, { [column.prop]: order === "desc" ? this.descCellCompare(cmp) : cmp });
        return newCol;
    }
    async headerclick(column, index) {
        let order = this.getNextOrder(column.order);
        const beforeEvent = this.emit("beforesorting", { column, order });
        if (beforeEvent.defaultPrevented) {
            return;
        }
        order = beforeEvent.detail.order;
        const newCol = await this.revogrid.updateColumnSorting(beforeEvent.detail.column, index, order);
        // apply sort data
        const beforeApplyEvent = this.emit("beforesortingapply", {
            column: newCol,
            order,
        });
        if (beforeApplyEvent.defaultPrevented) {
            return;
        }
        order = beforeApplyEvent.detail.order;
        const cmp = (column === null || column === void 0 ? void 0 : column.cellCompare) || this.defaultCellCompare;
        this.sort({ [column.prop]: order }, { [column.prop]: order === "desc" ? this.descCellCompare(cmp) : cmp });
    }
    setData(data, type) {
        // sorting available for rgRow type only
        if (type === "rgRow" && this.sorting && this.sortingFunc) {
            return this.sortItems(data, this.sorting, this.sortingFunc);
        }
    }
    /**
     * Sorting apply, available for rgRow type only
     * @param sorting - per column sorting
     * @param data - this.stores['rgRow'].store.get('source')
     */
    async sort(sorting, sortingFunc) {
        if (!size(sorting)) {
            this.sorting = null;
            this.sortingFunc = null;
            return;
        }
        this.sorting = sorting;
        this.sortingFunc = sortingFunc;
        const store = await this.revogrid.getSourceStore();
        const source = store.get("source");
        const proxyItems = this.sortIndexByItems([...store.get("proxyItems")], source, this.sorting, this.sortingFunc);
        setStore(store, {
            proxyItems,
            source: [...source],
        });
        this.emit("afterSortingApply");
    }
    defaultCellCompare(prop, a, b) {
        const av = a[prop];
        const bv = b[prop];
        return (av === null || av === void 0 ? void 0 : av.toString().toLowerCase()) > (bv === null || bv === void 0 ? void 0 : bv.toString().toLowerCase()) ? 1 : -1;
    }
    descCellCompare(cmp) {
        return (prop, a, b, dir) => {
            return -1 * cmp(prop, a, b, dir);
        };
    }
    sortIndexByItems(indexes, source, sorting, sortingFunc) {
        // TODO - is there a situation where multiple kvps in the `sorting` object would cause this to break?
        for (const prop in sortingFunc) {
            if (typeof sortingFunc[prop] === "undefined") {
                // Unsort indexes
                return [...Array(indexes.length).keys()];
            }
        }
        return indexes.sort((a, b) => {
            let sorted = 0;
            for (const prop in sortingFunc) {
                const dir = sorting[prop];
                const cmp = sortingFunc[prop];
                const itemA = source[a];
                const itemB = source[b];
                sorted = cmp(prop, itemA, itemB, dir);
                if (sorted) {
                    break;
                }
            }
            return sorted;
        });
    }
    sortItems(source, sorting, sortingFunc) {
        return source.sort((a, b) => {
            let sorted = 0;
            for (const prop in sortingFunc) {
                const dir = sorting[prop];
                const cmp = sortingFunc[prop];
                sorted = cmp(prop, a, b, dir);
                if (sorted) {
                    break;
                }
            }
            return sorted;
        });
    }
    getNextOrder(currentOrder) {
        switch (currentOrder) {
            case undefined:
                return "asc";
            case "asc":
                return "desc";
            case "desc":
                return undefined;
        }
    }
}

class SortingExternalPlugin extends BasePlugin {
    get name() {
        return "externalSorting";
    }
    get hasSorting() {
        return !!this.sorting;
    }
    constructor(revogrid) {
        super(revogrid);
        this.revogrid = revogrid;
        this.sorting = null;
        const headerclick = async (e) => {
            if (e.defaultPrevented)
                return;
            if (!e.detail.column.sortable)
                return;
            this.headerclick(e.detail.column);
        };
        this.addEventListener("initialHeaderClick", headerclick);
    }
    async headerclick(column) {
        let order = this.getNextOrder(column.order);
        this.emit("hbr-before-sort", {
            column,
            order,
        });
    }
    getNextOrder(currentOrder) {
        switch (currentOrder) {
            case undefined:
                return "asc";
            case "asc":
                return "desc";
            case "desc":
                return undefined;
        }
    }
}

class StretchColumn extends BasePlugin {
    constructor(hbrtable, dimensionProvider) {
        super(hbrtable);
        this.dimensionProvider = dimensionProvider;
        this.stretchedColumn = null;
        this.name = "stretchColumn";
        this.scrollSize = getScrollbarWidth(document);
        const beforecolumnapplied = ({ detail: { columns }, }) => {
            setTimeout(() => {
                this.applyStretch(columns);
            }, 100);
        };
        this.addEventListener("beforecolumnapplied", beforecolumnapplied);
    }
    setScroll({ type, hasScroll }) {
        var _a;
        if (type === "rgRow" &&
            this.stretchedColumn &&
            ((_a = this.stretchedColumn) === null || _a === void 0 ? void 0 : _a.initialSize) === this.stretchedColumn.size) {
            if (hasScroll) {
                this.stretchedColumn.size -= this.scrollSize;
                this.apply();
                this.dropChanges();
            }
        }
    }
    activateChanges() {
        const setScroll = ({ detail }) => this.setScroll(detail);
        this.addEventListener("scrollchange", setScroll);
    }
    dropChanges() {
        this.stretchedColumn = null;
        this.removeEventListener("scrollchange");
    }
    apply() {
        if (!this.stretchedColumn) {
            return;
        }
        const type = "rgCol";
        this.dimensionProvider.setDimensionSize(type, {
            [this.stretchedColumn.index]: this.stretchedColumn.size,
        });
    }
    applyStretch(columns) {
        this.dropChanges();
        let sizeDifference = this.hbrtable.clientWidth - 1;
        each(columns, (_c, type) => {
            const realSize = this.dimensionProvider.stores[type].store.get("realSize");
            sizeDifference -= realSize;
        });
        if (sizeDifference > 0) {
            // currently plugin accepts last column
            const index = columns.rgCol.length - 1;
            const last = columns.rgCol[index];
            // has column
            // no auto size applied
            // size for column shouldn't be defined
            const colSize = (last === null || last === void 0 ? void 0 : last.size) || this.hbrtable.colSize || 0;
            const size = sizeDifference + colSize - 1;
            if (last && !last.autoSize && colSize < size) {
                this.stretchedColumn = {
                    initialSize: size,
                    index,
                    size,
                };
                this.apply();
                this.activateChanges();
            }
        }
    }
}
function isStretchPlugin(plugin) {
    return !!plugin.applyStretch;
}

class DataProvider {
    constructor(dimensionProvider, tbSelf) {
        this.dimensionProvider = dimensionProvider;
        this.tbSelf = tbSelf;
        this.stores = reduce(rowTypes, (sources, k) => {
            sources[k] = new DataStore(k);
            return sources;
        }, {});
    }
    setData(data, type = "rgRow", grouping, silent = false) {
        // set rgRow data
        this.stores[type].updateData([...data], grouping, silent);
        this.dimensionProvider.setData(data, type, type !== "rgRow", this.tbSelf);
        return data;
    }
    getModel(virtualIndex, type = "rgRow") {
        const store = this.stores[type].store;
        return getSourceItem(store, virtualIndex);
    }
    setCellData({ type, rowIndex, prop, val }) {
        const model = this.getModel(rowIndex, type);
        model[prop] = val;
        setSourceByVirtualIndex(this.stores[type].store, { [rowIndex]: model });
    }
    refresh(type = "all") {
        if (isRowType(type)) {
            this.refreshItems(type);
        }
        rowTypes.forEach((t) => this.refreshItems(t));
    }
    refreshItems(type = "rgRow") {
        const items = this.stores[type].store.get("items");
        this.stores[type].setData({ items: [...items] });
    }
    setGrouping({ depth }, type = "rgRow") {
        this.stores[type].setData({ groupingDepth: depth });
    }
    setTrimmed(trimmed, type = "rgRow") {
        const store = this.stores[type];
        store.addTrimmed(trimmed);
        if (type === "rgRow") {
            this.dimensionProvider.setData(getVisibleSourceItem(store.store), type, false, this.tbSelf);
        }
    }
}

/**
 * Storing pre-calculated
 * Dimension information and sizes
 */
function initialBase() {
    return {
        indexes: [],
        // item index to size
        sizes: {},
        // order in indexes[] to coordinate
        positionIndexToItem: {},
        // initial element to coordinate ^
        indexToItem: {},
        positionIndexes: [],
    };
}
function initialState$1() {
    return Object.assign(Object.assign({}, initialBase()), { 
        // size which all items can take
        realSize: 0, 
        // initial item size if it wasn't changed
        originItemSize: 0, frameOffset: 0 });
}
class DimensionStore {
    constructor() {
        this.store = createStore(initialState$1());
    }
    getCurrentState() {
        const state = initialState$1();
        const keys = Object.keys(state);
        return reduce(keys, (r, k) => {
            const data = this.store.get(k);
            r[k] = data;
            return r;
        }, state);
    }
    setRealSize(count, tbSelf) {
        let realSize = 0;
        for (let i = 0; i < count; i++) {
            realSize +=
                this.store.get("sizes")[i] || this.store.get("originItemSize");
        }
        if (tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.pagination) {
            realSize = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.paginationPlugin.getRealSize(count);
            setStore(this.store, { realSize });
        }
        else {
            setStore(this.store, { realSize });
        }
    }
    setStore(data) {
        setStore(this.store, data);
    }
    drop() {
        setStore(this.store, initialBase());
    }
    setDimensionSize(sizes) {
        const dimensionData = calculateDimensionData(this.getCurrentState(), sizes);
        setStore(this.store, dimensionData);
        return dimensionData;
    }
}

class DimensionProvider {
    constructor(viewports) {
        this.viewports = viewports;
        this.stores = reduce([...rowTypes, ...columnTypes], (sources, k) => {
            sources[k] = new DimensionStore();
            return sources;
        }, {});
    }
    setDimensionSize(dimensionType, sizes) {
        this.stores[dimensionType].setDimensionSize(sizes);
        this.viewports.stores[dimensionType].setViewPortDimension(sizes);
    }
    setRealSize(realCount, type, tbSelf) {
        this.viewports.stores[type].setViewport({ realCount });
        if (type === "rgRow") {
            // need pin col as well
            this.stores[type].setRealSize(realCount, tbSelf);
        }
        else {
            this.stores[type].setRealSize(realCount);
        }
    }
    /**
     * Sets dimension data and view port coordinate
     * @param items - data/column items
     * @param type - dimension type
     */
    setData(items, type, noVirtual = false, tbSelf) {
        this.setRealSize(items.length, type, tbSelf);
        if (noVirtual) {
            this.setNoVirtual(type);
        }
        this.setViewPortCoordinate({
            coordinate: this.viewports.stores[type].store.get("lastCoordinate"),
            type,
        });
    }
    setNoVirtual(type) {
        const dimension = this.stores[type].getCurrentState();
        this.viewports.stores[type].setViewport({
            virtualSize: dimension.realSize,
        });
    }
    drop() {
        for (const type of columnTypes) {
            this.stores[type].drop();
        }
    }
    setColumns(type, sizes, noVirtual = false) {
        this.stores[type].setDimensionSize(sizes);
        if (noVirtual) {
            this.setNoVirtual(type);
        }
        this.setViewPortCoordinate({
            coordinate: this.viewports.stores[type].store.get("lastCoordinate"),
            type,
        });
    }
    setViewPortCoordinate({ coordinate, type, }) {
        const dimension = this.stores[type].getCurrentState();
        this.viewports.stores[type].setViewPortCoordinate(coordinate, dimension);
    }
    getViewPortPos(e) {
        const dimension = this.stores[e.dimension].getCurrentState();
        const item = getItemByIndex(dimension, e.coordinate);
        return item.start;
    }
    setSettings(data, dimensionType) {
        let stores = [];
        switch (dimensionType) {
            case "rgCol":
                stores = columnTypes;
                break;
            case "rgRow":
                stores = rowTypes;
                break;
        }
        for (const s of stores) {
            this.stores[s].setStore(data);
        }
    }
}

/**
 * Update items based on new scroll position
 * If viewport wasn't changed fully simple recombination of positions
 * Otherwise rebuild viewport items
 */
function getUpdatedItemsByPosition(pos, items, realCount, virtualSize, dimension) {
    const activeItem = getItemByPosition(dimension, pos);
    const firstItem = getFirstItem(items);
    let toUpdate;
    // do simple position replacement if items already present in viewport
    if (firstItem) {
        const changedOffsetStart = activeItem.itemIndex - (firstItem.itemIndex || 0);
        if (changedOffsetStart) {
            // simple recombination
            const newData = recombineByOffset(Math.abs(changedOffsetStart), Object.assign(Object.assign({ positiveDirection: changedOffsetStart > -1 }, dimension), items));
            if (newData) {
                toUpdate = newData;
            }
            // if partial replacement add items if revo-viewport has some space left
            if (toUpdate) {
                const extra = addMissingItems(activeItem, realCount, virtualSize, toUpdate, dimension);
                if (extra.length) {
                    updateMissingAndRange(toUpdate.items, extra, toUpdate);
                }
            }
        }
    }
    // new collection if no items after replacement full replacement
    if (!toUpdate) {
        const items = getItems({
            start: activeItem.start,
            startIndex: activeItem.itemIndex,
            origSize: dimension.originItemSize,
            maxSize: virtualSize,
            maxCount: realCount,
            sizes: dimension.sizes,
        });
        // range now comes from 0 to length - 1
        toUpdate = {
            items,
            start: 0,
            end: items.length - 1,
        };
    }
    return toUpdate;
}
function updateMissingAndRange(items, missing, range) {
    items.splice(range.end + 1, 0, ...missing);
    // update range if start larger after recombination
    if (range.start >= range.end &&
        !(range.start === range.end && range.start === 0)) {
        range.start += missing.length;
    }
    range.end += missing.length;
}
// if partial replacement add items if revo-viewport has some space left
function addMissingItems(firstItem, realCount, virtualSize, existingCollection, dimension) {
    const lastItem = getLastItem(existingCollection);
    const items = getItems({
        sizes: dimension.sizes,
        start: lastItem.end,
        startIndex: lastItem.itemIndex + 1,
        origSize: dimension.originItemSize,
        maxSize: virtualSize - (lastItem.end - firstItem.start),
        maxCount: realCount,
    });
    return items;
}
// get revo-viewport items parameters, caching position and calculating items count in revo-viewport
function getItems(opt, currentSize = 0) {
    const items = [];
    let index = opt.startIndex;
    let size = currentSize;
    while (size <= opt.maxSize && index < opt.maxCount) {
        const newSize = getItemSize(index, opt.sizes, opt.origSize);
        items.push({
            start: opt.start + size,
            end: opt.start + size + newSize,
            itemIndex: index,
            size: newSize,
        });
        size += newSize;
        index++;
    }
    return items;
}
/**
 * Do batch items recombination
 * If items not overlapped with existing viewport returns null
 */
function recombineByOffset(offset, data) {
    const newItems = [...data.items];
    const itemsCount = newItems.length;
    const newRange = {
        start: data.start,
        end: data.end,
    };
    // if offset out of revo-viewport, makes sense whole redraw
    if (offset > itemsCount) {
        return null;
    }
    // is direction of scroll positive
    if (data.positiveDirection) {
        // push item to the end
        let lastItem = getLastItem(data);
        let i = newRange.start;
        const length = i + offset;
        for (; i < length; i++) {
            const newIndex = lastItem.itemIndex + 1;
            const size = getItemSize(newIndex, data.sizes, data.originItemSize);
            // if item overlapped limit break a loop
            if (lastItem.end + size > data.realSize) {
                break;
            }
            // new item index to recombine
            const newEnd = i % itemsCount;
            // item should always present, we do not create new item, we recombine them
            if (!newItems[newEnd]) {
                throw new Error("incorrect index");
            }
            // do recombination
            newItems[newEnd] = lastItem = {
                start: lastItem.end,
                end: lastItem.end + size,
                itemIndex: newIndex,
                size: size,
            };
            // update range
            newRange.start++;
            newRange.end = newEnd;
        }
        // direction is negative
    }
    else {
        // push item to the start
        let firstItem = getFirstItem(data);
        const end = newRange.end;
        for (let i = 0; i < offset; i++) {
            const newIndex = firstItem.itemIndex - 1;
            const size = getItemSize(newIndex, data.sizes, data.originItemSize);
            // new item index to recombine
            let newStart = end - i;
            newStart = (newStart < 0 ? itemsCount + newStart : newStart) % itemsCount;
            // item should always present, we do not create new item, we recombine them
            if (!newItems[newStart]) {
                throw new Error("incorrect index");
            }
            // do recombination
            newItems[newStart] = firstItem = {
                start: firstItem.start - size,
                end: firstItem.start,
                itemIndex: newIndex,
                size: size,
            };
            // update range
            newRange.start = newStart;
            newRange.end--;
        }
    }
    const range = {
        start: (newRange.start < 0 ? itemsCount + newRange.start : newRange.start) %
            itemsCount,
        end: (newRange.end < 0 ? itemsCount + newRange.end : newRange.end) %
            itemsCount,
    };
    return Object.assign({ items: newItems }, range);
}
function getItemSize(index, sizes, origSize = 0) {
    if (sizes === null || sizes === void 0 ? void 0 : sizes[index]) {
        return sizes[index];
    }
    return origSize;
}
/**
 * Verify if position is in range of the PositionItem, start and end are included
 */
function isActiveRange(pos, realSize, first, last) {
    if (!first || !last) {
        return false;
    }
    // if position is in range of first item
    // or position is after first item and last item is the last item in real size
    return ((pos >= first.start && pos <= first.end) ||
        (pos > first.end && last.end === realSize));
}
function getFirstItem(s) {
    return s.items[s.start];
}
function getLastItem(s) {
    return s.items[s.end];
}
function isActiveRangeOutsideLastItem(pos, virtualSize, firstItem, lastItem) {
    // if no first item, means no items in viewport
    if (!firstItem) {
        return false;
    }
    return virtualSize + pos > (lastItem === null || lastItem === void 0 ? void 0 : lastItem.end);
}
/**
 * Set items sizes from start index to end
 * @param vpItems
 * @param start
 * @param size
 * @param lastCoordinate
 * @returns
 */
function setItemSizes(vpItems, initialIndex, size, lastCoordinate) {
    const items = [...vpItems];
    const count = items.length;
    let pos = lastCoordinate;
    let i = 0;
    let start = initialIndex;
    // viewport not inited
    if (!count) {
        return [];
    }
    // loop through array from initial item after recombination
    while (i < count) {
        const item = items[start];
        item.start = pos;
        item.size = size;
        item.end = item.start + size;
        pos = item.end;
        // loop by start index
        start++;
        i++;
        // if start index out of array, reset it
        if (start === count) {
            start = 0;
        }
    }
    return items;
}

/**
 * Store is responsible for visible
 * Viewport information for each dimension
 * Redraw items during scrolling
 */
function initialState() {
    return {
        // virtual item information per rendered item
        items: [],
        // virtual dom item order to render
        start: 0,
        end: 0,
        // size of viewport in px
        virtualSize: 0,
        // total number of items
        realCount: 0,
        // last coordinate for store position restore
        lastCoordinate: 0,
    };
}
class ViewportStore {
    constructor() {
        this.store = createStore(initialState());
        this.store.onChange("realCount", () => this.clear());
    }
    /** Render viewport based on coordinate, this is main method for draw */
    setViewPortCoordinate(position, dimension) {
        let virtualSize = this.store.get("virtualSize");
        // no visible data to calculate
        if (!virtualSize) {
            return;
        }
        const frameOffset = dimension.frameOffset;
        const singleOffsetInPx = dimension.originItemSize * frameOffset;
        // add offset to virtual size from both sides
        const outsize = singleOffsetInPx * 2;
        virtualSize += outsize;
        // expected no scroll if real size less than virtual size, position is 0
        let maxCoordinate = 0;
        // if there is nodes outside of viewport, max coordinate has to be adjusted
        if (dimension.realSize > virtualSize) {
            // max coordinate is real size minus virtual/rendered space
            maxCoordinate = dimension.realSize - virtualSize;
        }
        let toUpdate = {
            lastCoordinate: position,
        };
        let pos = position;
        pos -= singleOffsetInPx;
        pos = pos < 0 ? 0 : pos < maxCoordinate ? pos : maxCoordinate;
        const allItems = this.getItems();
        const firstItem = getFirstItem(allItems);
        const lastItem = getLastItem(allItems);
        // left position changed
        // verify if new position is in range of previously rendered first item
        if (!isActiveRange(pos, dimension.realSize, firstItem, lastItem)) {
            toUpdate = Object.assign(Object.assign({}, toUpdate), getUpdatedItemsByPosition(pos, allItems, this.store.get("realCount"), virtualSize, dimension));
            this.setViewport(Object.assign({}, toUpdate));
            // right position changed
        }
        else if (isActiveRangeOutsideLastItem(pos, virtualSize, firstItem, lastItem)) {
            // check is any item missing for full fill content
            const missing = addMissingItems(firstItem, this.store.get("realCount"), virtualSize + pos - firstItem.start, allItems, dimension);
            // update missing items
            if (missing.length) {
                const items = [...this.store.get("items")];
                const range = {
                    start: this.store.get("start"),
                    end: this.store.get("end"),
                };
                updateMissingAndRange(items, missing, range);
                toUpdate = Object.assign(Object.assign(Object.assign({}, toUpdate), { items: [...items] }), range);
                this.setViewport(Object.assign({}, toUpdate));
            }
        }
    }
    /** Update viewport sizes */
    setViewPortDimension(sizes, dropToOriginalSize) {
        let items = this.store.get("items");
        const count = items.length;
        // viewport not inited
        if (!count) {
            return;
        }
        let changedCoordinate = 0;
        let i = 0;
        let start = this.store.get("start");
        // drop to original size if requested
        if (dropToOriginalSize) {
            items = setItemSizes(items, start, dropToOriginalSize, this.store.get("lastCoordinate"));
        }
        // loop through array from initial item after recombination
        while (i < count) {
            const item = items[start];
            // change pos if size change present before
            if (changedCoordinate) {
                item.start += changedCoordinate;
                item.end += changedCoordinate;
            }
            // change size
            const size = sizes[item.itemIndex];
            if (size) {
                const changedSize = size - item.size;
                changedCoordinate += changedSize;
                item.size = size;
                item.end = item.start + size;
            }
            // loop by start index
            start++;
            i++;
            if (start === count) {
                start = 0;
            }
        }
        this.setViewport({ items: [...items] });
    }
    getItems() {
        return {
            items: this.store.get("items"),
            start: this.store.get("start"),
            end: this.store.get("end"),
        };
    }
    setViewport(data) {
        setStore(this.store, data);
    }
    clear() {
        this.store.set("items", []);
    }
}

class ViewportProvider {
    constructor() {
        this.stores = reduce([...rowTypes, ...columnTypes], (sources, k) => {
            sources[k] = new ViewportStore();
            return sources;
        }, {});
    }
    setViewport(dimensionType, data) {
        this.stores[dimensionType].setViewport(data);
    }
}

const RowHeaderRender = (start) => (_h, e) => start + e.rowIndex;

const LETTER_BLOCK_SIZE = 10;
const HbrgrRowHeaders = ({ anyView, height, rowHeaderColumn, beforeRowAdd, onScrollViewport, onElementToScroll, tbSelf, }) => {
    const dataViews = [];
    const viewport = new ViewportStore();
    /** render viewports rows */
    let totalLength = 1;
    for (const data of anyView.dataPorts) {
        const colData = new DataStore("colPinStart");
        const rowSelectionStore = beforeRowAdd(data.position.y);
        const dataStore = new DataStore(data.type);
        dataStore.updateData(data.dataStore.get("source"));
        // initiate column data
        const column = Object.assign({ cellTemplate: RowHeaderRender(totalLength) }, rowHeaderColumn);
        colData.updateData([column]);
        dataViews.push(h("hbr-table-data", Object.assign({ slot: "content" }, data, { dataStore: dataStore.store, colData: colData.store, viewportCol: viewport.store, readonly: true, range: false, rowSelectionStore: rowSelectionStore.store, tbSelf: tbSelf, role: "rowgroup" })));
        totalLength += data.dataStore.get("items").length;
    }
    const colSize = (rowHeaderColumn === null || rowHeaderColumn === void 0 ? void 0 : rowHeaderColumn.size) ||
        (totalLength.toString().length + 1) * LETTER_BLOCK_SIZE;
    viewport.setViewport({
        realCount: 1,
        virtualSize: 0,
        items: [
            {
                size: colSize,
                start: 0,
                end: colSize,
                itemIndex: 0,
            },
        ],
    });
    const parent = `${anyView.prop[UUID]}-rowHeaders`;
    return (h("hbr-viewport-scroll", { [UUID]: parent, contentHeight: height, contentWidth: 0, class: "rowHeaders", key: "rowHeaders", style: { minWidth: `${colSize}px` }, ref: (el) => onElementToScroll(el), onScrollViewport: (e) => onScrollViewport(e.detail) },
        h("hbr-table-header", Object.assign({}, anyView.headerProp, { colData: typeof rowHeaderColumn === "object" ? [rowHeaderColumn] : [], viewportCol: viewport.store, parent: parent, slot: "header", canResize: false, role: "rowgroup" })),
        dataViews));
};

/**
 * Draw drag
 */
class OrdererService {
    constructor() {
        this.parentY = 0;
    }
    start(parent, { pos, text, event, }) {
        var _a, _b;
        const { top } = parent.getBoundingClientRect();
        this.parentY = top;
        if (this.text) {
            if (text) {
                this.text.innerText = text;
            }
            else {
                const ele = event.target;
                const rowEle = ele.closest(".rgRow");
                if (rowEle) {
                    const cloneRowEle = rowEle.cloneNode(true);
                    const icon = cloneRowEle === null || cloneRowEle === void 0 ? void 0 : cloneRowEle.querySelector(".hbr-css__table-row-drag-button hbr-icon");
                    if (icon) {
                        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
                        icon.asset = (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix;
                    }
                    this.text.innerHTML = "";
                    this.text.appendChild(cloneRowEle);
                }
            }
        }
        this.move(pos);
        this.moveTip({ x: event.x, y: event.y });
        (_b = this.el) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
    }
    end() {
        var _a;
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    }
    move(pos) {
        this.moveElement(pos.end - this.parentY);
    }
    moveTip({ x, y }) {
        if (!this.draggable) {
            return;
        }
        this.draggable.style.left = `${x}px`;
        this.draggable.style.top = `${y}px`;
    }
    moveElement(y) {
        if (!this.rgRow) {
            return;
        }
        this.rgRow.style.transform = `translateY(${y}px)`;
    }
}
const OrderRenderer = ({ ref }) => {
    var _a;
    const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
    const service = new OrdererService();
    ref(service);
    return (h("div", { class: "draggable-wrapper hidden", ref: (e) => {
            service.el = e;
        } },
        h("div", { class: "draggable", ref: (el) => {
                service.draggable = el;
            } },
            h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["dots-six"]) || dotsSix }),
            h("span", { ref: (e) => {
                    service.text = e;
                } })),
        h("div", { class: "drag-position", ref: (e) => {
                service.rgRow = e;
            } })));
};

const HbrViewPort = ({ viewports, dimensions, orderRef, nakedClick, registerElement, onScroll, tbSelf, viewPortUUID, }, children) => {
    var _a;
    const pinEndColumns = ((_a = tbSelf === null || tbSelf === void 0 ? void 0 : tbSelf.columnProvider) === null || _a === void 0 ? void 0 : _a.getColumns("colPinEnd")) || [];
    const hasHeaderOnlyPinEnd = pinEndColumns.length > 0 && pinEndColumns.every((column) => column.noRows);
    const viewPortClick = (e, el) => {
        if (el === e.target) {
            nakedClick(e);
        }
    };
    let el;
    return [
        h("div", { class: "main-viewport", ref: (e) => (el = e), onClick: (e) => viewPortClick(e, el), "view-port-uuid": viewPortUUID },
            h("div", { class: {
                    viewports: true,
                    "viewports--header-only-pin-end": hasHeaderOnlyPinEnd,
                } },
                children,
                tbSelf.pagination ? null : (h("hbr-scroll-virtual", { class: "vertical", dimension: "rgRow", viewportStore: viewports.rgRow.store, dimensionStore: dimensions.rgRow.store, ref: (el) => registerElement(el, "rowScroll"), onScrollVirtual: (e) => onScroll(e.detail) })),
                h(OrderRenderer, { ref: orderRef }))),
        h("hbr-scroll-virtual", { class: "horizontal", dimension: "rgCol", viewportStore: viewports.rgCol.store, dimensionStore: dimensions.rgCol.store, ref: (el) => registerElement(el, "colScroll"), onScrollVirtual: (e) => onScroll(e.detail) }),
    ];
};

class GridScrollingService {
    constructor(setViewport) {
        this.setViewport = setViewport;
        this.elements = {};
    }
    async onScroll(e, key) {
        let newEvent;
        for (const elKey in this.elements) {
            if (this.isPinnedColumn(key) && e.dimension === "rgCol") {
                if (elKey === key || !e.delta) {
                    continue;
                }
                for (const el of this.elements[elKey]) {
                    el.changeScroll && (newEvent = el.changeScroll(e));
                }
            }
            else {
                for (const el of this.elements[elKey]) {
                    el.setScroll(e);
                }
            }
        }
        let event = e;
        if (newEvent) {
            event = await newEvent;
        }
        this.setViewport(event);
    }
    isPinnedColumn(key) {
        return ["colPinStart", "colPinEnd"].indexOf(key) > -1;
    }
    registerElements(els) {
        this.elements = els;
    }
    /**
     * Register new element for farther scroll support
     * @param el - can be null if holder removed
     * @param key - element key
     */
    registerElement(el, key) {
        if (!this.elements[key]) {
            this.elements[key] = [];
        }
        // new element added
        if (el) {
            this.elements[key].push(el);
        }
        else if (this.elements[key]) {
            // element removed
            delete this.elements[key];
        }
    }
    unregister() {
        this.elements = undefined;
        this.elements = {};
    }
}

/**
 * All render based on sections
 * First we render vertical parts - pinned start, data, pinned end
 * Per each column we render data collections: headers, pinned top, center data, pinned bottom
 */
const ViewPortSections = ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, registerElement, onEdit, onScroll, tbSelf, }) => {
    const viewPortHtml = [];
    /** render viewports columns */
    for (const view of columns) {
        /** render viewports rows */
        const dataViews = [
            h("hbr-table-header", Object.assign({ viewportCol: view.viewportCol }, view.headerProp, { selectionStore: view.columnSelectionStore, slot: HEADER_SLOT, columnFilter: columnFilter, canResize: resize, tbSelf: tbSelf, role: "rowgroup" })),
        ];
        view.dataPorts.forEach((data, j) => {
            const key = view.prop.key + (j + 1);
            const dataView = (h("hbr-overlay-selection", Object.assign({}, data, { slot: data.slot, selectionStore: data.segmentSelectionStore, editors: editors, readonly: readonly, range: range, useClipboard: useClipboard, onSetEdit: ({ detail }) => onEdit(detail) }),
                h("hbr-table-data", Object.assign({}, data, { [UUID]: data.uuid, key: key, readonly: readonly, range: range, rowClass: rowClass, rowSelectionStore: data.rowSelectionStore, slot: DATA_SLOT, tbSelf: tbSelf, "data-table-uuid": tbSelf.uuid, role: "rowgroup" })),
                h("hbr-temp-range", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol }),
                h("hbr-focus", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol })));
            dataViews.push(dataView);
        });
        viewPortHtml.push(h("hbr-viewport-scroll", Object.assign({}, view.prop, { tbSelf: view.tbSelf, ref: (el) => registerElement(el, view.prop.key), onScrollViewport: (e) => onScroll(e.detail, view.prop.key) }), dataViews));
    }
    return viewPortHtml;
};

class ViewportService {
    constructor(sv, contentHeight) {
        var _a, _b;
        this.sv = sv;
        this.storesByType = {};
        this.storesXToType = {};
        this.storesYToType = {};
        (_a = this.sv.selectionStoreConnector) === null || _a === void 0 ? void 0 : _a.beforeUpdate();
        this.columns = this.getViewportColumnData(contentHeight);
        (_b = this.sv.scrollingService) === null || _b === void 0 ? void 0 : _b.unregister();
    }
    onColumnResize(type, e, store) {
        var _a;
        (_a = this.sv.dimensionProvider) === null || _a === void 0 ? void 0 : _a.setDimensionSize(type, e.detail);
        const changedItems = reduce(e.detail || {}, (r, size, index) => {
            const item = getSourceItem(store, parseInt(index, 10));
            if (item) {
                r[item.prop] = Object.assign(Object.assign({}, item), { size });
            }
            return r;
        }, {});
        this.sv.resize(changedItems);
    }
    /**
     * Transform data from stores and apply it to different components
     */
    getViewportColumnData(contentHeight) {
        const columns = [];
        let x = 0; // we increase x only if column present
        columnTypes.forEach((val) => {
            const colStore = this.sv.columnProvider.stores[val].store;
            // only columns that have data show
            if (!colStore.get("items").length) {
                return;
            }
            const column = {
                colType: val,
                position: { x, y: 1 },
                contentHeight,
                fixWidth: val !== "rgCol",
                uuid: `${this.sv.uuid}-${x}`,
                viewports: this.sv.viewportProvider.stores,
                dimensions: this.sv.dimensionProvider.stores,
                rowStores: this.sv.dataProvider.stores,
                colStore,
                onHeaderresize: (e) => this.onColumnResize(val, e, colStore),
            };
            if (val === "rgCol") {
                column.onResizeViewport = (e) => {
                    var _a;
                    return (_a = this.sv.viewportProvider) === null || _a === void 0 ? void 0 : _a.setViewport(e.detail.dimension, {
                        virtualSize: e.detail.size,
                    });
                };
            }
            const colData = this.gatherColumnData(column);
            const columnSelectionStore = this.registerCol(colData.position.x, val);
            // render per each column data collections vertically
            const dataPorts = this.dataViewPort(column).reduce((r, rgRow) => {
                // register selection store for Segment
                const segmentSelection = this.registerSegment(rgRow.position);
                segmentSelection.setLastCell(rgRow.lastCell);
                // register selection store for Row
                const rowSelectionStore = this.registerRow(rgRow.position.y, rgRow.type);
                const rowDef = Object.assign(Object.assign({}, rgRow), { rowSelectionStore, segmentSelectionStore: segmentSelection.store, ref: (e) => this.sv.selectionStoreConnector.registerSection(e), onSetRange: (e) => segmentSelection.setRangeArea(e.detail), onSetTempRange: (e) => segmentSelection.setTempArea(e.detail), onFocusCell: (e) => {
                        segmentSelection.clearFocus();
                        this.sv.selectionStoreConnector.focus(segmentSelection, e.detail);
                    }, tbSelf: this.sv.tbSelf });
                r.push(rowDef);
                return r;
            }, []);
            columns.push(Object.assign(Object.assign({}, colData), { columnSelectionStore,
                dataPorts, tbSelf: this.sv.tbSelf }));
            x++;
        });
        return columns;
    }
    /** register selection store for Segment */
    registerSegment(position) {
        return this.sv.selectionStoreConnector.register(position);
    }
    /** register selection store for Row */
    registerRow(y, type) {
        // link to position
        this.storesByType[type] = y;
        this.storesYToType[y] = type;
        return this.sv.selectionStoreConnector.registerRow(y).store;
    }
    /** register selection store for Column */
    registerCol(x, type) {
        // link to position
        this.storesByType[type] = x;
        this.storesXToType[x] = type;
        return this.sv.selectionStoreConnector.registerColumn(x).store;
    }
    /** Collect Column data */
    gatherColumnData(data) {
        const parent = data.uuid;
        const realSize = data.dimensions[data.colType].store.get("realSize");
        const noRows = data.colType === "colPinEnd" &&
            data.colStore.get("source").length > 0 &&
            data.colStore.get("source").every((column) => column.noRows);
        const prop = {
            contentWidth: realSize,
            class: `${data.colType}${noRows ? " noRows" : ""}`,
            [`${UUID}`]: data.uuid,
            contentHeight: data.contentHeight,
            key: data.colType,
            onResizeViewport: data.onResizeViewport,
        };
        if (data.fixWidth) {
            prop.style = { minWidth: `${realSize}px` };
        }
        const headerProp = {
            parent,
            colData: getVisibleSourceItem(data.colStore),
            dimensionCol: data.dimensions[data.colType].store,
            groups: data.colStore.get("groups"),
            groupingDepth: data.colStore.get("groupingDepth"),
            onHeaderresize: data.onHeaderresize,
        };
        return {
            prop,
            position: data.position,
            headerProp,
            parent,
            viewportCol: data.viewports[data.colType].store,
        };
    }
    /** Collect Row data */
    dataViewPort(data) {
        const slots = {
            rowPinStart: HEADER_SLOT,
            rgRow: CONTENT_SLOT,
            rowPinEnd: FOOTER_SLOT,
        };
        // y position for selection
        let y = 0;
        return rowTypes.reduce((r, type) => {
            // filter out empty sources, we still need to return source to keep slot working
            const isPresent = data.viewports[type].store.get("realCount") || type === "rgRow";
            const rgCol = Object.assign(Object.assign({}, data), { position: Object.assign(Object.assign({}, data.position), { y: isPresent ? y : EMPTY_INDEX }) });
            r.push(this.dataPartition(rgCol, type, slots[type], type !== "rgRow" // is fixed
            ));
            if (isPresent) {
                y++;
            }
            return r;
        }, []);
    }
    dataPartition(data, type, slot, fixed) {
        return {
            colData: data.colStore,
            viewportCol: data.viewports[data.colType].store,
            viewportRow: data.viewports[type].store,
            lastCell: getLastCell(data, type),
            slot,
            type,
            canDrag: !fixed,
            position: data.position,
            uuid: `${data.uuid}-${data.position.x}-${data.position.y}`,
            dataStore: data.rowStores[type].store,
            dimensionCol: data.dimensions[data.colType].store,
            dimensionRow: data.dimensions[type].store,
            style: fixed
                ? { height: `${data.dimensions[type].store.get("realSize")}px` }
                : undefined,
        };
    }
    scrollToCell(cell) {
        for (const key in cell) {
            const coordinate = cell[key];
            this.sv.scrollingService.onScroll({
                dimension: key === "x" ? "rgCol" : "rgRow",
                coordinate,
            });
        }
    }
    /**
     * Clear current grid focus
     */
    clearFocused() {
        this.sv.selectionStoreConnector.clearAll();
    }
    clearEdit() {
        this.sv.selectionStoreConnector.setEdit(false);
    }
    getFocused() {
        const focused = this.sv.selectionStoreConnector.focusedStore;
        if (!focused) {
            return null;
        }
        const colType = this.storesXToType[focused.position.x];
        const column = this.sv.columnProvider.getColumn(focused.cell.x, colType);
        const rowType = this.storesYToType[focused.position.y];
        const model = this.sv.dataProvider.getModel(focused.cell.y, rowType);
        return {
            column,
            model,
            cell: focused.cell,
            colType,
            rowType,
        };
    }
    setEdit(rowIndex, colIndex, colType, rowType) {
        var _a;
        const stores = this.storesByType;
        const storeCoordinate = {
            x: stores[colType],
            y: stores[rowType],
        };
        (_a = this.sv.selectionStoreConnector) === null || _a === void 0 ? void 0 : _a.setEditByCell(storeCoordinate, {
            x: colIndex,
            y: rowIndex,
        });
    }
}

const tableCss = "hbr-table[theme=default]{font-size:12px}hbr-table[theme=default] hbr-table-header{text-align:center;line-height:30px;background-color:#f8f9fa}hbr-table[theme=default] hbr-table-header .group-rgRow{box-shadow:none}hbr-table[theme=default] hbr-table-header .header-rgRow,hbr-table[theme=default] hbr-table-header .group-rgRow{text-transform:uppercase;font-size:12px;color:#61656a}hbr-table[theme=default] hbr-table-header .header-rgRow{height:30px;box-shadow:0 -1px 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-table-header .rgHeaderCell{box-shadow:-1px 0 0 0 #c0c0c0, -1px 0 0 0 #c0c0c0 inset, 0 -1px 0 0 #c0c0c0, 0 -1px 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}hbr-table[theme=default] hbr-viewport-scroll.rowHeaders{background-color:#f8f9fa}hbr-table[theme=default] hbr-viewport-scroll.rowHeaders hbr-table-data .rgCell{color:#61656a;box-shadow:0 -1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-viewport-scroll.rowHeaders hbr-table-header{box-shadow:0 -1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-viewport-scroll.colPinStart hbr-table-data .rgRow .rgCell:last-child{box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-viewport-scroll.colPinStart .footer-wrapper hbr-table-data .rgRow:first-child .rgCell{box-shadow:0 1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}hbr-table[theme=default] hbr-viewport-scroll.colPinEnd,hbr-table[theme=default] hbr-viewport-scroll.colPinEnd hbr-table-header{box-shadow:1px 0 0 #c0c0c0 inset}hbr-table[theme=default] .footer-wrapper hbr-table-data .rgRow:first-child .rgCell{box-shadow:0 1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset, 0 -1px 0 0 #e2e3e3 inset}hbr-table[theme=default] hbr-table-data{text-align:center}hbr-table[theme=default] hbr-table-data .rgRow{line-height:27px;box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}hbr-table[theme=default] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}hbr-table[theme=default] hbr-table-data .rgCell{box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}hbr-table[theme=default] hbr-table-data .rgCell.disabled{background-color:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}hbr-table[theme=material]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}hbr-table[theme=material] hbr-table-header{line-height:50px;font-weight:var(--hbr-font-weight-semibold, 600);text-align:left}hbr-table[theme=material] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=material] hbr-table-header .header-rgRow{height:50px}hbr-table[theme=material] hbr-table-data{text-align:left}hbr-table[theme=material] hbr-table-data .rgRow{line-height:42px}hbr-table[theme=material] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=material] .viewports{width:100%}hbr-table[theme=material]{--header-border-color:#f1f1f1}hbr-table[theme=material] .rowHeaders{background-color:#f7faff}hbr-table[theme=material] .rowHeaders hbr-table-data .rgCell{color:#757a82}hbr-table[theme=material] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=material] hbr-table-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 var(--header-border-color), 0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=material] hbr-table-header .rgHeaderCell.sortable:hover{background-color:#f1f1f1}hbr-table[theme=material] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}hbr-table[theme=material] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 var(--header-border-color)}hbr-table[theme=material] hbr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 var(--header-border-color) inset}hbr-table[theme=material] hbr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 var(--header-border-color)}hbr-table[theme=material] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=material] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}hbr-table[theme=material] hbr-table-data .rgCell{color:rgba(0, 0, 0, 0.87)}hbr-table[theme=material] hbr-table-data .rgCell.disabled{background-color:var(--cell-disabled-color, #f7f7f7)}hbr-table[theme=material] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:#d4d4d4}hbr-table[theme=material] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:black}hbr-table[theme=darkMaterial]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}hbr-table[theme=darkMaterial] hbr-table-header{line-height:50px;font-weight:var(--hbr-font-weight-semibold, 600);text-align:left}hbr-table[theme=darkMaterial] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=darkMaterial] hbr-table-header .header-rgRow{height:50px}hbr-table[theme=darkMaterial] hbr-table-data{text-align:left}hbr-table[theme=darkMaterial] hbr-table-data .rgRow{line-height:42px}hbr-table[theme=darkMaterial] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=darkMaterial] .viewports{width:100%}hbr-table[theme=darkMaterial]{color:#d8d8d8}hbr-table[theme=darkMaterial] .rowHeaders{background-color:rgba(40, 39, 43, 0.8)}hbr-table[theme=darkMaterial] .rowHeaders hbr-table-data .rgCell{color:rgba(216, 216, 216, 0.8)}hbr-table[theme=darkMaterial] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 #404040 inset}hbr-table[theme=darkMaterial] hbr-table-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #404040, 0 -1px 0 0 #404040 inset}hbr-table[theme=darkMaterial] hbr-table-header .rgHeaderCell.sortable:hover{background-color:rgba(64, 64, 64, 0.5)}hbr-table[theme=darkMaterial] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(115, 148, 160, 0.15)}hbr-table[theme=darkMaterial] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 #404040}hbr-table[theme=darkMaterial] hbr-table-data .rgCell{color:rgba(216, 216, 216, 0.9)}hbr-table[theme=darkMaterial] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 #404040 inset}hbr-table[theme=darkMaterial] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(115, 148, 160, 0.15)}hbr-table[theme=darkMaterial] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:rgba(216, 216, 216, 0.5)}hbr-table[theme=darkMaterial] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:rgba(216, 216, 216, 0.7)}hbr-table[theme=darkMaterial] hbr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #404040 inset}hbr-table[theme=darkMaterial] hbr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #404040}hbr-table[theme=darkCompact]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}hbr-table[theme=darkCompact] hbr-table-header{line-height:45px;font-weight:var(--hbr-font-weight-semibold, 600);text-align:left}hbr-table[theme=darkCompact] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=darkCompact] hbr-table-header .header-rgRow{height:45px}hbr-table[theme=darkCompact] hbr-table-data{text-align:left}hbr-table[theme=darkCompact] hbr-table-data .rgRow{line-height:32px}hbr-table[theme=darkCompact] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=darkCompact] .viewports{width:100%}hbr-table[theme=darkCompact]{color:#d8d8d8}hbr-table[theme=darkCompact] .rowHeaders{background-color:rgba(40, 39, 43, 0.8)}hbr-table[theme=darkCompact] .rowHeaders hbr-table-data .rgCell{color:rgba(216, 216, 216, 0.8)}hbr-table[theme=darkCompact] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 #404040 inset}hbr-table[theme=darkCompact] hbr-table-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #404040, 0 -1px 0 0 #404040 inset}hbr-table[theme=darkCompact] hbr-table-header .rgHeaderCell.sortable:hover{background-color:rgba(64, 64, 64, 0.5)}hbr-table[theme=darkCompact] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(115, 148, 160, 0.15)}hbr-table[theme=darkCompact] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 #404040}hbr-table[theme=darkCompact] hbr-table-data .rgCell{color:rgba(216, 216, 216, 0.9)}hbr-table[theme=darkCompact] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 #404040 inset}hbr-table[theme=darkCompact] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(115, 148, 160, 0.15)}hbr-table[theme=darkCompact] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:rgba(216, 216, 216, 0.5)}hbr-table[theme=darkCompact] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:rgba(216, 216, 216, 0.7)}hbr-table[theme=darkCompact] hbr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #404040 inset}hbr-table[theme=darkCompact] hbr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #404040}hbr-table[theme=compact]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}hbr-table[theme=compact] hbr-table-header{line-height:45px;font-weight:var(--hbr-font-weight-semibold, 600);text-align:left}hbr-table[theme=compact] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=compact] hbr-table-header .header-rgRow{height:45px}hbr-table[theme=compact] hbr-table-data{text-align:left}hbr-table[theme=compact] hbr-table-data .rgRow{line-height:32px}hbr-table[theme=compact] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=compact] .viewports{width:100%}hbr-table[theme=compact]{--header-border-color:#f1f1f1}hbr-table[theme=compact] .rowHeaders{background-color:#f7faff}hbr-table[theme=compact] .rowHeaders hbr-table-data .rgCell{color:#757a82}hbr-table[theme=compact] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=compact] hbr-table-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 var(--header-border-color), 0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=compact] hbr-table-header .rgHeaderCell.sortable:hover{background-color:#f1f1f1}hbr-table[theme=compact] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}hbr-table[theme=compact] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 var(--header-border-color)}hbr-table[theme=compact] hbr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 var(--header-border-color) inset}hbr-table[theme=compact] hbr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 var(--header-border-color)}hbr-table[theme=compact] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=compact] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}hbr-table[theme=compact] hbr-table-data .rgCell{color:rgba(0, 0, 0, 0.87)}hbr-table[theme=compact] hbr-table-data .rgCell.disabled{background-color:var(--cell-disabled-color, #f7f7f7)}hbr-table[theme=compact] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:#d4d4d4}hbr-table[theme=compact] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:black}hbr-table[theme=compact] hbr-dropdown .rv-dr-root{padding:0px 9px}hbr-table[theme=cohesion]{--header-height:43px;--row-height:42px;font-family:var(--hbr-font-body)}hbr-table[theme=cohesion] hbr-table-header{line-height:var(--header-height);font-weight:var(--hbr-font-weight-normal, 400);text-align:left}hbr-table[theme=cohesion] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=cohesion] hbr-table-header .header-rgRow{height:var(--header-height)}hbr-table[theme=cohesion] hbr-table-data{text-align:left}hbr-table[theme=cohesion] hbr-table-data .rgRow{line-height:var(--row-height)}hbr-table[theme=cohesion] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=cohesion] .viewports{width:100%}hbr-table[theme=cohesion] .rowHeaders{background-color:transparent}hbr-table[theme=cohesion] .rowHeaders hbr-table-data .rgCell{color:var(--base-text-default)}hbr-table[theme=cohesion] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 var(--control-border-default) inset}hbr-table[theme=cohesion] hbr-table-header .header-rgRow:not(.group){font-size:var(--hbr-font-size-xs);border-bottom:1px solid var(--control-border-default);box-shadow:var(--hbr-shadow-xs);clip-path:inset(0px 0px -8px 0px)}hbr-table[theme=cohesion] hbr-table-header .rgHeaderCell.focused-cell{background:transparent}hbr-table[theme=cohesion] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 var(--control-border-default)}hbr-table[theme=cohesion] hbr-viewport-scroll.colPinStart{box-shadow:var(--hbr-shadow-sm);clip-path:inset(0px -10px 0px 0px)}hbr-table[theme=cohesion] hbr-viewport-scroll.colPinEnd{box-shadow:var(--hbr-shadow-sm);clip-path:inset(0px 0px 0px -10px)}hbr-table[theme=cohesion] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 var(--control-border-default) inset}hbr-table[theme=cohesion] hbr-table-data .rgRow.focused-rgRow{background-color:transparent}hbr-table[theme=cohesion] hbr-table-data .rgCell{color:var(--base-text-medium-default)}hbr-table[theme=cohesion] hbr-table-data .rgCell.disabled{background-color:var(--cell-disabled-color, #f7f7f7)}hbr-table[theme=cohesion] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:var(--interact-icon-medium-active)}hbr-table[theme=cohesion] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:var(--interact-icon-hover)}hbr-table{--row-border-bottom-color:var(--base-border-medium-default);display:block;height:100%;font-family:Helvetica, Arial, Sans-Serif, serif;font-size:14px;position:relative;color:var(--base-text-default)}hbr-table .footer-wrapper,hbr-table .header-wrapper{width:100%}hbr-table .footer-wrapper hbr-table-data,hbr-table .header-wrapper hbr-table-data{z-index:3}hbr-table hbr-dropdown .rv-dr-root{max-height:100%}hbr-table hbr-dropdown.shrink label{opacity:0}hbr-table .viewports{display:flex;flex-direction:row;align-items:flex-start;max-width:100%}hbr-table .viewports--header-only-pin-end{position:relative}hbr-table{display:flex;flex-direction:column;width:100%;height:100%}hbr-table .main-viewport{flex-grow:1;height:0;display:flex;flex-direction:row}hbr-table .draggable{position:fixed;background:var(--row-draggable-bg, var(--base-bg-weak-default));border-radius:3px;z-index:100;box-shadow:var(--row-draggable-box-shadow, 0 4px 20px 0 rgba(0, 0, 0, 0.15));padding:10px;display:flex;justify-items:center;align-items:center}hbr-table .draggable:has(.rgRow)>hbr-icon{display:none}hbr-table .draggable:has(.rgRow){padding:0px}hbr-table .draggable:has(.rgRow)>span .rgRow{transform:none !important;display:flex;justify-items:center;align-items:center}hbr-table .draggable:has(.rgRow)>span .rgRow>.rgCell{padding:0px var(--cell-padding)}hbr-table .draggable:has(.rgRow)>span .rgRow>*{transform:none !important}hbr-table .draggable.hidden{display:none}hbr-table .draggable .hbr-alt-icon{background-color:var(--base-text-default, #23282E);position:absolute;left:5px;top:10px}hbr-table .draggable-wrapper.hidden{display:none}hbr-table .drag-position{position:absolute;left:0;right:0;height:2px;z-index:2;background:var(--control-border-active)}hbr-table .clipboard{position:absolute;left:0;top:0}hbr-table hbr-scroll-virtual{position:relative}hbr-table hbr-scroll-virtual.vertical,hbr-table hbr-scroll-virtual.horizontal{z-index:3}hbr-table.hbr-table-no-selection{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.hbr-css__table-tree-line{display:block;width:4px;height:100%;background:var(--control-bg-medium-disabled)}.hbr-css__table-tree-last-line{border-bottom-left-radius:50px;border-bottom-right-radius:50px;height:70%}.hbr-css__table-tree-last-child{box-shadow:0 -1px 0 var(--row-border-bottom-color) inset}.hbr-css__table-tree-first-line{border-top-left-radius:50px;border-top-right-radius:50px;height:70%}.hbr-css__table-tree-only-line{height:40%}.hbr-css__table-tree-child{background:transparent}.hbr-css__table-tree-line-wrapper.hbr-css__table-tree-line-last-wrapper{align-items:flex-start}.hbr-css__table-tree-line-wrapper.hbr-css__table-tree-line-first-wrapper{align-items:flex-end}.hbr-css__table-tree-line-wrapper{justify-content:center}.hbr-css__table-tree-line-container,.hbr-css__table-tree-line-wrapper,.hbr-css__table-tree-column{z-index:2;overflow:visible;position:relative}.hbr-css__table-tree-line-container{display:flex;flex-direction:row;height:100%}.hbr-css__table-tree-caret{display:flex;align-items:center;justify-content:center}hbr-table hbr-table-data .rgCell.hbr-css__table-tree-column{overflow:visible;box-shadow:none !important}.hbr-css__table-tree-line-gap{position:absolute;height:1px;width:4px;left:calc(50% - 2px);top:-1px;background:var(--control-bg-medium-disabled)}.hbr-css__table-tree-border-line-cover{position:absolute;height:1px;width:100%;bottom:0px;background:var(--base-bg-default)}.hbr-css__table-tree-children{background:var(--base-bg-default)}hbr-table.hbr-css__table-tree hbr-table-data .rgRow::before{content:\"\";position:absolute;right:0px;bottom:0px;height:1px;width:50%;box-shadow:0 -1px 0 var(--row-border-bottom-color) inset}hbr-table.hbr-css__table-tree hbr-table-data .rgCell{box-shadow:0 -1px 0 var(--row-border-bottom-color) inset}hbr-table.hbr-css__table-tree hbr-table-data .rgRow{border-bottom:none;box-shadow:none}hbr-table.column-drag-start.column-draggable{user-select:none;cursor:copy}hbr-table.column-drag-start.column-draggable *{cursor:copy}hbr-table.column-drag-start.column-draggable hbr-table-header,hbr-table.column-drag-start.column-draggable hbr-table-header *{cursor:copy}hbr-table.column-drag-start.column-draggable .column-dragging{background:var(--control-bg-weak-active)}hbr-table.column-drag-start.column-draggable .header-content{user-select:none}hbr-table .hbr-table-drag-position-y{position:absolute;top:0;background:rgba(204, 225, 255, 0.8);box-shadow:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, 0.08));height:100%;z-index:10}hbr-table.column-drag-start hbr-table-header{cursor:move}hbr-table[theme=magnetic]{--header-height:38px;--row-height:37px;font-family:var(--hbr-font-body)}hbr-table[theme=magnetic] hbr-table-header{line-height:var(--header-height);font-weight:var(--hbr-font-weight-semibold, 600);text-align:left}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}hbr-table[theme=magnetic] hbr-table-header .header-rgRow{height:var(--header-height)}hbr-table[theme=magnetic] hbr-table-data{text-align:left}hbr-table[theme=magnetic] hbr-table-data .rgRow{line-height:var(--row-height)}hbr-table[theme=magnetic] hbr-table-data .rgCell{padding:0 15px}hbr-table[theme=magnetic] .viewports{width:100%}hbr-table[theme=magnetic]{--header-border-color:#f1f1f1}hbr-table[theme=magnetic] hbr-table-header .header-rgRow.group{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=magnetic] hbr-table-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 var(--header-border-color), 0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}hbr-table[theme=magnetic] .footer-wrapper hbr-table-data{box-shadow:0 -1px 0 var(--header-border-color)}hbr-table[theme=magnetic] hbr-viewport-scroll.colPinStart{box-shadow:var(--hbr-shadow-sm);clip-path:inset(0px -10px 0px 0px)}hbr-table[theme=magnetic] hbr-viewport-scroll.colPinEnd{box-shadow:var(--hbr-shadow-sm);clip-path:inset(0px 0px 0px -10px)}hbr-table[theme=magnetic] hbr-table-data .rgRow{box-shadow:0 -1px 0 0 var(--header-border-color) inset}hbr-table[theme=magnetic] hbr-table-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}hbr-table[theme=magnetic] hbr-table-data .hbr-draggable>.hbr-drag-icon{background-color:#d4d4d4}hbr-table[theme=magnetic] hbr-table-data .hbr-draggable:hover>.hbr-drag-icon{background-color:black}hbr-table.hbr-css__table-tree[theme=magnetic] hbr-table-data .rgCell{box-shadow:0 -1px 0 var(--row-border-bottom-color) inset}hbr-table.hbr-css__table-tree[theme=magnetic] hbr-table-data .rgRow{border-bottom:none;box-shadow:none}hbr-table[theme] hbr-table-header .header-rgRow:not(.group),hbr-table-header::part(row){font-weight:800;border-bottom:var(--hbr-border-width) solid var(--base-text-default);box-shadow:none;clip-path:none}hbr-table[theme=magnetic]{--header-height:36px;--row-height:37px;--header-border-color:var(--control-border-strong-default);--row-bg-selected-color:var(--control-bg-weak-active);--cell-padding:var(--hbr-spacing-xs, 8px);--row-border-bottom-color:var(--control-border-weak-default);--sortable-hover-bg-color:var(--control-bg-hover);--resizable-bg-color:var(--control-bg-strong-default);--sort-icon-default-fill:var(--interact-icon-weak-hover)}hbr-table[theme=magnetic] hbr-table-header .header-rgRow:not(.group),hbr-table[theme=magnetic] hbr-table-header::part(row){font-weight:800;border-bottom:var(--hbr-border-width) solid var(--header-border-color);box-shadow:none;clip-path:none}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell,hbr-table[theme=magnetic] hbr-table-data .rgCell{padding:var(--cell-padding, 8px)}hbr-table[theme=magnetic] hbr-table-data .rgCell{font-size:14px;line-height:20px;color:var(--base-text-default)}hbr-table[theme=magnetic] hbr-table-data .rgRow{line-height:21px;box-shadow:none;border-bottom:1px solid var(--row-border-bottom-color)}hbr-table[theme=magnetic] hbr-table-header .header-rgRow{height:var(--header-height)}hbr-table[theme=magnetic] hbr-table-header .header-rgRow.group{height:var(--group-header-height, var(--header-height))}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell .rv-filter{height:unset}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell .filter-wrapper{display:flex}hbr-table[theme=magnetic] hbr-table-header .rgHeaderCell .header-content{color:var(--base-text-default);font-size:14px;font-style:normal;font-weight:700;line-height:20px;display:flex;align-items:center}hbr-table[theme=magnetic] hbr-table-data .rgRow.groupingRow .group-expand{max-height:unset}hbr-table{--row-draggable-bg:rgba(204, 225, 255, 0.8);--row-draggable-box-shadow:var(--hbr-shadow-sm)}hbr-table.column-drag-start hbr-table-header{user-select:none}hbr-table.column-drag-start.column-drag-left hbr-table-header .rgHeaderCell:not(.column-dragging):hover{border-left:2px solid var(--control-border-active)}hbr-table.column-drag-start.column-drag-right hbr-table-header .rgHeaderCell:not(.column-dragging):hover{border-right:2px solid var(--control-border-active)}.hbr-css__table-tree-children{background:var(--base-bg-default)}[data-theme=onecd] hbr-table[theme=magnetic] hbr-table-header .header-rgRow:not(.group),[data-theme=onecd] hbr-table[theme=magnetic] hbr-table-header::part(row){border-bottom-width:var(--onecd-border-width-default)}";
const HbrTableStyle0 = tableCss;

const sizePaddingMap = {
    compact: "var(--hbr-spacing-xs)",
    comfy: "var(--hbr-spacing-sm)",
    spacious: "var(--hbr-spacing-md)",
};
const HbrTableComponent = /*@__PURE__*/ proxyCustomElement(class HbrTableComponent extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.hbrQuery = createEvent(this, "hbr-query", 7);
        this.beforeedit = createEvent(this, "beforeedit", 7);
        this.beforerangeedit = createEvent(this, "beforerangeedit", 7);
        this.afteredit = createEvent(this, "afteredit", 7);
        this.beforeautofill = createEvent(this, "beforeautofill", 7);
        this.beforeaange = createEvent(this, "beforeaange", 7);
        this.roworderchanged = createEvent(this, "roworderchanged", 7);
        this.beforesourcesortingapply = createEvent(this, "beforesourcesortingapply", 7);
        this.hbrBeforeSort = createEvent(this, "hbr-before-sort", 7);
        this.beforesortingapply = createEvent(this, "beforesortingapply", 7);
        this.beforesorting = createEvent(this, "beforesorting", 7);
        this.rowdragstart = createEvent(this, "rowdragstart", 7);
        this.headerclick = createEvent(this, "headerclick", 7);
        this.beforecellfocus = createEvent(this, "beforecellfocus", 7);
        this.beforefocuslost = createEvent(this, "beforefocuslost", 7);
        this.beforesourceset = createEvent(this, "beforesourceset", 7);
        this.aftersourceset = createEvent(this, "aftersourceset", 7);
        this.beforecolumnsset = createEvent(this, "beforecolumnsset", 7);
        this.beforecolumnapplied = createEvent(this, "beforecolumnapplied", 7);
        this.aftercolumnsset = createEvent(this, "aftercolumnsset", 7);
        this.beforecolumnsordersort = createEvent(this, "beforecolumnsordersort", 7);
        this.beforefilterapply = createEvent(this, "beforefilterapply", 7);
        this.beforefiltertrimmed = createEvent(this, "beforefiltertrimmed", 7);
        this.beforetrimmed = createEvent(this, "beforetrimmed", 7);
        this.aftertrimmed = createEvent(this, "aftertrimmed", 7);
        this.viewportscroll = createEvent(this, "viewportscroll", 7);
        this.beforeexport = createEvent(this, "beforeexport", 7);
        this.beforeeditstart = createEvent(this, "beforeeditstart", 7);
        this.aftercolumnresize = createEvent(this, "aftercolumnresize", 7);
        this.afterload = createEvent(this, "afterload", 7);
        this._lastCoordinate = 0;
        this.afterLoadEmitted = false;
        this.uuid = null;
        this.viewport = null;
        /**
         * Plugins
         * Define plugins collection
         */
        this.internalPlugins = [];
        this.subscribers = {};
        this.handleInit = () => {
            this.viewportProvider = new ViewportProvider();
            this.themeService = new ThemeService({
                rowSize: this.resolveRowSize(),
                theme: this.theme,
            });
            this.dimensionProvider = new DimensionProvider(this.viewportProvider);
            this.columnProvider = new ColumnDataProvider();
            this.dataProvider = new DataProvider(this.dimensionProvider, this);
            this.uuid = `${new Date().getTime()}-hbrtable`;
            const pluginData = {
                data: this.dataProvider,
                column: this.columnProvider,
                dimension: this.dimensionProvider,
                viewport: this.viewportProvider,
                selection: this.selectionStoreConnector,
            };
            if (this.autoSizeColumn) {
                this.internalPlugins.push(this.getAutoSizePlugin());
            }
            if (this.filter) {
                this.internalPlugins.push(new FilterPlugin(this.host, this.uuid, typeof this.filter === "object" ? this.filter : undefined));
            }
            if (this.exporting) {
                this.internalPlugins.push(new ExportFilePlugin(this.host));
            }
            if (this.externalSorting) {
                this.internalPlugins.push(new SortingExternalPlugin(this.host));
            }
            else {
                this.internalPlugins.push(new SortingPlugin(this.host));
            }
            if (this.plugins) {
                this.plugins.forEach((p) => {
                    this.internalPlugins.push(new p(this.host));
                });
            }
            if (this.pagination) {
                this.paginationPlugin = new PaginationPlugin(this);
                this.internalPlugins.push(this.paginationPlugin);
            }
            if (this.canMoveColumns) {
                this.internalPlugins.push(new ColumnPlugin(this.host, pluginData));
            }
            this.internalPlugins.push(new GroupingRowPlugin(this.host, {
                dataProvider: this.dataProvider,
                columnProvider: this.columnProvider,
            }));
            this.applyStretch(this.stretch);
            this.themeChanged(this.theme);
            this.columnChanged(this.columns);
            this.dataChanged(this.source);
            this.dataTopChanged(this.pinnedTopSource);
            this.dataBottomChanged(this.pinnedBottomSource);
            this.trimmedRowsChanged(this.trimmedRows);
            this.rowDefChanged(this.rowDefinitions);
            this.groupingChanged(this.grouping);
            this.selectionStoreConnector = new SelectionStoreConnector();
            this.scrollingService = new GridScrollingService((e) => {
                if (e.dimension === "rgRow")
                    this._lastCoordinate = e.coordinate;
                this.dimensionProvider.setViewPortCoordinate({
                    coordinate: e.coordinate,
                    type: e.dimension,
                });
                this.viewportscroll.emit(e);
            });
            this.subscribers = { click: this.handleOutsideClick.bind(this) };
            for (const type in this.subscribers) {
                document.addEventListener(type, this.subscribers[type]);
            }
        };
        this.size = undefined;
        this.sizeMap = { compact: 37, comfy: 45, spacious: 52 };
        this.rowHeaders = undefined;
        this.frameSize = 9999;
        this.rowSize = 0;
        this.colSize = 100;
        this.range = false;
        this.readonly = false;
        this.resize = false;
        this.canFocus = true;
        this.useClipboard = true;
        this.disableFiltering = true;
        this.enableColumnPopSelect = false;
        this.columns = [];
        this.subRowTemplate = undefined;
        this.source = [];
        this.pinnedTopSource = [];
        this.pinnedBottomSource = [];
        this.rowDefinitions = [];
        this.editors = {};
        this.canMoveColumns = false;
        this.searchText = undefined;
        this.plugins = undefined;
        this.columnTypes = {};
        this.theme = "magnetic";
        this.rowClass = "";
        this.autoSizeColumn = false;
        this.filter = false;
        this.enableRowSize = false;
        this.syncScrollOnUpdate = true;
        this.trimmedRows = {};
        this.externalSorting = false;
        this.exporting = false;
        this.grouping = undefined;
        this.stretch = false;
        this.headerSlot = false;
        this.deferInit = false;
        this.extraElements = [];
        this.applyStretch = this.applyStretch.bind(this);
        this.resetScrollPosition = this.resetScrollPosition.bind(this);
    }
    // --------------------------------------------------------------------------
    //
    //  Methods
    //
    // --------------------------------------------------------------------------
    /**
     * set row selection
     */
    async setRowSelection({ id, selected }) {
        const row = Array.from(this.host.querySelectorAll(`hbr-table-data .rgRow[data-row-id="${id}"]`));
        row.forEach((r) => {
            if (selected) {
                r.classList.add("selected");
            }
            else {
                r.classList.remove("selected");
            }
        });
    }
    /**
     * Refreshes data viewport.
     * Can be specific part as rgRow or pinned rgRow or 'all' by default.
     */
    async refresh(type = "all") {
        if (type === "hard") {
            this.dataChanged(this.source);
        }
        else {
            this.dataProvider.refresh(type);
        }
    }
    getAutoSizePlugin() {
        return new AutoSizeColumn(this.host, {
            dataProvider: this.dataProvider,
            columnProvider: this.columnProvider,
            dimensionProvider: this.dimensionProvider,
        }, typeof this.autoSizeColumn === "object" ? this.autoSizeColumn : undefined);
    }
    /**
     * adjust the size of the columns that have autoSize: true, it applies to text only
     */
    async adjustAutoSizeColumn() {
        if (!this.autoSizeColumn)
            return;
        const internalPlugin = this.internalPlugins.filter((p) => {
            const plugin = p;
            if (plugin.name === "auto-size-column")
                return p;
        });
        let autoSizeColumnPlugin;
        if (internalPlugin.length === 0) {
            autoSizeColumnPlugin = this.getAutoSizePlugin();
        }
        else {
            autoSizeColumnPlugin = internalPlugin[0];
        }
        if (!autoSizeColumnPlugin)
            return;
        const columnGather = ColumnDataProvider.getColumns(this.columns, 0, this.columnTypes);
        return autoSizeColumnPlugin === null || autoSizeColumnPlugin === void 0 ? void 0 : autoSizeColumnPlugin.autoSize(this.source, columnGather.columns);
    }
    /**  Scrolls view port to specified rgRow index */
    async scrollToRow(coordinate = 0) {
        const y = this.dimensionProvider.getViewPortPos({
            coordinate,
            dimension: "rgRow",
        });
        await this.scrollToCoordinate({ y });
    }
    /** Scrolls view port to specified column index */
    async scrollToColumnIndex(coordinate = 0) {
        const x = this.dimensionProvider.getViewPortPos({
            coordinate,
            dimension: "rgCol",
        });
        await this.scrollToCoordinate({ x });
    }
    /**  Scrolls view port to specified column prop */
    async scrollToColumnProp(prop) {
        const coordinate = this.columnProvider.getColumnIndexByProp(prop, "rgCol");
        if (coordinate < 0) {
            // already on the screen
            return;
        }
        const x = this.dimensionProvider.getViewPortPos({
            coordinate,
            dimension: "rgCol",
        });
        await this.scrollToCoordinate({ x });
    }
    /** Update columns */
    async updateColumns(cols) {
        this.columnProvider.updateColumns(cols);
    }
    /** Add trimmed by type */
    async addTrimmed(trimmed, trimmedType = "external", type = "rgRow") {
        const event = this.beforetrimmed.emit({
            trimmed,
            trimmedType,
            type,
        });
        if (event.defaultPrevented) {
            return event;
        }
        this.dataProvider.setTrimmed({ [trimmedType]: event.detail.trimmed }, type);
        this.aftertrimmed.emit();
        return event;
    }
    /**  Scrolls view port to coordinate */
    async scrollToCoordinate(cell) {
        var _a;
        (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.scrollToCell(cell);
    }
    /**  Bring cell to edit mode */
    async setCellEdit(rgRow, prop, rowSource = "rgRow") {
        var _a;
        const rgCol = ColumnDataProvider.getColumnByProp(this.columns, prop);
        if (!rgCol) {
            return;
        }
        await timeout();
        (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.setEdit(rgRow, this.columnProvider.getColumnIndexByProp(prop, "rgCol"), rgCol.pin || "rgCol", rowSource);
    }
    /**
     * Register new virtual node inside of table
     * Used for additional items creation such as plugin elements
     */
    async registerVNode(elements) {
        this.extraElements.push(...elements);
        this.extraElements = [...this.extraElements];
    }
    /**  Get data from source */
    async getSource(type = "rgRow") {
        return this.dataProvider.stores[type].store.get("source");
    }
    /**
     * Get data from visible part of source
     * Trimmed/filtered rows will be excluded
     * @param type - type of source
     */
    async getVisibleSource(type = "rgRow") {
        return getVisibleSourceItem(this.dataProvider.stores[type].store);
    }
    /**
     * Provides access to rows internal store observer
     * Can be used for plugin support
     * @param type - type of source
     */
    async getSourceStore(type = "rgRow") {
        return this.dataProvider.stores[type].store;
    }
    /**
     * Provides access to column internal store observer
     * Can be used for plugin support
     * @param type - type of column
     */
    async getColumnStore(type = "rgCol") {
        return this.columnProvider.stores[type].store;
    }
    /**
     * Update column sorting
     * @param column - full column details to update
     * @param index - virtual column index
     * @param order - order to apply
     */
    async updateColumnSorting(column, index, order) {
        return this.columnProvider.updateColumnSorting(column, index, order);
    }
    /**
     * Receive all columns in data source
     */
    async getColumns() {
        return this.columnProvider.getColumns();
    }
    /**
     * Clear current table focus
     */
    async clearFocus() {
        var _a;
        const focused = await this.getFocused();
        const event = this.beforefocuslost.emit(focused);
        if (event.defaultPrevented) {
            return;
        }
        this.selectionStoreConnector.clearAll();
        (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.clearFocused();
    }
    /**
     * Get all active plugins instances
     */
    async getPlugins() {
        return [...this.internalPlugins];
    }
    /**
     * Get all active plugins instances
     */
    async getFocused() {
        var _a;
        return (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getFocused();
    }
    getPlugin(ins) {
        const FilterPluginInstance = this.internalPlugins.filter((plugin) => plugin instanceof ins);
        if (FilterPluginInstance.length) {
            return FilterPluginInstance[0];
        }
    }
    async clearFilter() {
        const filterPlugin = this.getPlugin(FilterPlugin);
        // @ts-ignore
        if (filterPlugin)
            return filterPlugin.handleClearFilter();
    }
    /**
     * filtering
     */
    async handleFilter(condition) {
        const filterPlugin = this.getPlugin(FilterPlugin);
        // @ts-ignore
        if (filterPlugin)
            return filterPlugin.handleFilter(condition);
    }
    /**
     * table query
     */
    async query(params) {
        this.hbrQuery.emit(params);
    }
    /**
     * resolve rowSizes in the order of priority
     *  - rowSize passed by user
     *  - size passed by user
     *  - default rowSize
     */
    resolveRowSize() {
        let rowSize = this.rowSize;
        if (rowSize === 0 && this.size && this.sizeMap[this.size]) {
            rowSize = this.sizeMap[this.size];
        }
        return rowSize;
    }
    async setRowSize() {
        const rowSize = this.resolveRowSize();
        const type = "rgRow";
        this.themeService = new ThemeService({ rowSize });
        if (this.enableRowSize) {
            const sizes = {};
            this.source.forEach((_, i) => {
                sizes[i] = rowSize;
            });
            this.dimensionProvider.setDimensionSize(type, sizes);
        }
        this.dimensionProvider.setSettings({ originItemSize: rowSize }, type);
        this.dimensionProvider.setRealSize(this.source.length, type);
        if (!this.enableRowSize) {
            const temp = this.source;
            this.source = [];
            this.source = temp;
        }
    }
    /**
     * sorting column
     */
    async handleSorting(column, index, order) {
        const sortingPlugin = this.getPlugin(SortingPlugin);
        // @ts-ignore
        if (sortingPlugin)
            return sortingPlugin.handleSorting(column, index, order);
    }
    // --------------------------------------------------------------------------
    //
    //  Listeners outside scope
    //
    // --------------------------------------------------------------------------
    /** Clear data which is outside of table container */
    handleOutsideClick({ target }) {
        if (!(target === null || target === void 0 ? void 0 : target.closest(`[view-port-uuid="${this.uuid}"]`))) {
            this.clearFocus();
        }
    }
    // --------------------------------------------------------------------------
    //
    //  Listeners
    //
    // --------------------------------------------------------------------------
    /** DRAG AND DROP */
    onRowDragStarted(e) {
        var _a;
        e.cancelBubble = true;
        const dragStart = this.rowdragstart.emit(e.detail);
        if (dragStart.defaultPrevented) {
            e.preventDefault();
            return;
        }
        (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.start(this.host, Object.assign(Object.assign({}, e.detail), dragStart.detail));
    }
    onRowDragEnd() {
        var _a;
        (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.end();
    }
    onRowDrag({ detail, }) {
        var _a;
        (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.move(detail);
    }
    onRowMouseMove(e) {
        var _a;
        e.cancelBubble = true;
        (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.moveTip(e.detail);
    }
    async onBeforeEdit(e) {
        e.cancelBubble = true;
        const { defaultPrevented, detail } = this.beforeedit.emit(e.detail);
        await timeout();
        // apply data
        if (!defaultPrevented) {
            this.dataProvider.setCellData(detail);
            this.afteredit.emit(detail);
        }
    }
    onBeforeRangeEdit(e) {
        e.cancelBubble = true;
        const { defaultPrevented } = this.beforerangeedit.emit(e.detail);
        if (defaultPrevented) {
            e.preventDefault();
            return;
        }
        this.afteredit.emit(e.detail);
    }
    onRangeChanged(e) {
        e.cancelBubble = true;
        const beforeaange = this.beforeaange.emit(e.detail);
        if (beforeaange.defaultPrevented) {
            e.preventDefault();
        }
        const beforeFill = this.beforeautofill.emit(e.detail);
        if (beforeFill.defaultPrevented) {
            return;
        }
    }
    onRowDropped(e) {
        e.cancelBubble = true;
        const { defaultPrevented } = this.roworderchanged.emit(e.detail);
        if (defaultPrevented) {
            e.preventDefault();
        }
    }
    onHeaderClick(e) {
        const { defaultPrevented } = this.headerclick.emit(Object.assign(Object.assign({}, e.detail.column), { originalEvent: e.detail.originalEvent }));
        if (defaultPrevented) {
            e.preventDefault();
        }
    }
    onCellFocus(e) {
        e.cancelBubble = true;
        const { defaultPrevented } = this.beforecellfocus.emit(e.detail);
        if (!this.canFocus || defaultPrevented) {
            e.preventDefault();
        }
    }
    rePagination() {
        if (this.paginationPlugin)
            this.paginationPlugin.rePagination();
    }
    handleAfterLoad() {
        if (this.afterLoadEmitted)
            return;
        this.afterload.emit();
        this.afterLoadEmitted = true;
    }
    sizeChanged() {
        this.setRowSize();
    }
    columnChanged(newVal = []) {
        this.dimensionProvider.drop();
        const columnGather = ColumnDataProvider.getColumns(newVal, 0, this.columnTypes);
        this.beforecolumnsset.emit(columnGather);
        for (const type of columnTypes) {
            const items = columnGather.columns[type];
            const sizes = {};
            items.forEach((item, idx) => {
                if (item.size)
                    sizes[idx] = item.size;
            });
            this.dimensionProvider.setDimensionSize(type, sizes);
            this.dimensionProvider.setRealSize(items.length, type);
            this.dimensionProvider.setColumns(type, ColumnDataProvider.getSizes(items), type !== "rgCol");
        }
        this.beforecolumnapplied.emit(columnGather);
        const columns = this.columnProvider.setColumns(columnGather);
        this.aftercolumnsset.emit({
            columns,
            order: this.columnProvider.order,
        });
    }
    themeChanged(t) {
        const frameOffset = 9999;
        this.themeService.register(t);
        this.dimensionProvider.setSettings({
            originItemSize: this.themeService.rowSize,
            frameOffset,
        }, "rgRow");
        this.dimensionProvider.setSettings({ originItemSize: this.colSize, frameOffset }, "rgCol");
    }
    dataChanged(source = []) {
        let newSource = [...source];
        const beforesourceset = this.beforesourceset.emit({
            type: "rgRow",
            source: newSource,
        });
        newSource = beforesourceset.detail.source;
        newSource = this.dataProvider.setData(newSource, "rgRow");
        this.aftersourceset.emit({
            type: "rgRow",
            source: newSource,
        });
    }
    dataBottomChanged(newVal = []) {
        this.dataProvider.setData(newVal, "rowPinEnd");
    }
    dataTopChanged(newVal = []) {
        this.dataProvider.setData(newVal, "rowPinStart");
    }
    rowDefChanged(newVal = []) {
        if (!newVal.length) {
            return;
        }
        const rows = reduce(newVal, (r, v) => {
            // @ts-ignore
            if (v.type === "row")
                v.type = "rgRow";
            if (!r[v.type]) {
                r[v.type] = {};
            }
            if (v.size) {
                if (!r[v.type].sizes) {
                    r[v.type].sizes = {};
                }
                r[v.type].sizes[v.index] = v.size;
            }
            return r;
        }, {});
        each(rows, (r, k) => {
            if (r.sizes) {
                this.dimensionProvider.setDimensionSize(k, r.sizes);
            }
        });
    }
    trimmedRowsChanged(newVal = {}) {
        this.addTrimmed(newVal);
    }
    groupingChanged(newVal = {}) {
        let grPlugin;
        for (const p of this.internalPlugins) {
            const isGrouping = p;
            if (isGrouping.setGrouping) {
                grPlugin = isGrouping;
                break;
            }
        }
        if (!grPlugin) {
            return;
        }
        grPlugin.setGrouping(newVal || {});
    }
    async setStretch() {
        const stretch = this.internalPlugins.filter((p) => isStretchPlugin(p))[0];
        stretch.applyStretch(this.columnProvider.getRawColumns());
    }
    async resetScrollPosition() {
        const last = this._lastCoordinate;
        await this.scrollToCoordinate({ y: last });
    }
    applyStretch(isStretch) {
        if (isStretch === "false") {
            isStretch = false;
        }
        // @ts-ignore
        const plugins = this.internalPlugins.filter((p) => p.name === "stretchColumn");
        if (isStretch) {
            let plugin;
            if (!plugins.length) {
                plugin = new StretchColumn(this.host, this.dimensionProvider);
                this.internalPlugins.push(plugin);
            }
            else {
                plugin = plugins[0];
            }
            setTimeout(() => {
                plugin.applyStretch(this.columnProvider.getRawColumns());
            });
        }
        else {
            if (plugins.length) {
                const index = this.internalPlugins.indexOf(plugins[0]);
                this.internalPlugins.splice(index, 1);
            }
        }
    }
    handleExporting(isExporting) {
        let _isExporting = isExporting;
        if (isExporting === "false") {
            _isExporting = false;
        }
        const plugins = this.internalPlugins.filter((p) => p.name === "exporting");
        if (_isExporting) {
            if (!plugins.length) {
                this.internalPlugins.push(new ExportFilePlugin(this.host));
            }
        }
        else {
            if (plugins.length) {
                const index = this.internalPlugins.indexOf(plugins[0]);
                this.internalPlugins.splice(index, 1);
            }
        }
    }
    async handleSearchTextChange() {
        const filterPlugin = this.getPlugin(FilterPlugin);
        if (filterPlugin) {
            // @ts-ignore
            return await filterPlugin.handleSearchTextChange(this.searchText || "");
        }
    }
    connectedCallback() {
        this.init = this.init.bind(this);
        this.handleDeferInit = this.handleDeferInit.bind(this);
        !this.deferInit && this.handleInit();
    }
    componentWillLoad() {
        this.deferInit && this.handleInit();
    }
    componentDidLoad() {
        if (this.deferInit) {
            this.internalPlugins = this.internalPlugins.filter(p => {
                if (this.externalSorting) {
                    if (p.name === "internalSorting") {
                        p.destroy();
                        return false;
                    }
                }
                return true;
            });
        }
    }
    init() {
        this.handleInit();
        return Promise.resolve();
    }
    handleDeferInit(value) {
        if (value) {
            this.handleInit();
        }
    }
    handleExternalSorting(newValue) {
        this.internalPlugins = this.internalPlugins.map((p) => {
            if (newValue && p.name === "internalSorting") {
                p.destroy();
                return new SortingExternalPlugin(this.host);
            }
            if (!newValue && p.name === "externalSorting") {
                p.destroy();
                return new SortingPlugin(this.host);
            }
            return p;
        });
    }
    disconnectedCallback() {
        // destroy plugins on element disconnect
        each(this.internalPlugins, (p) => p.destroy());
        this.internalPlugins = [];
        // clear events
        for (const type in this.subscribers) {
            document.removeEventListener(type, this.subscribers[type]);
            delete this.subscribers[type];
        }
    }
    render() {
        var _a, _b, _c;
        const { nonce = "" } = getBootstrapConfig();
        const contentHeight = this.dimensionProvider.stores.rgRow.store.get("realSize");
        this.viewport = new ViewportService({
            columnProvider: this.columnProvider,
            dataProvider: this.dataProvider,
            dimensionProvider: this.dimensionProvider,
            viewportProvider: this.viewportProvider,
            uuid: this.uuid,
            scrollingService: this.scrollingService,
            orderService: this.orderService,
            selectionStoreConnector: this.selectionStoreConnector,
            resize: (c) => this.aftercolumnresize.emit(c),
            tbSelf: this,
        }, contentHeight);
        const groupingDepth = ((_c = (_b = (_a = this.columnProvider) === null || _a === void 0 ? void 0 : _a.stores) === null || _b === void 0 ? void 0 : _b.rgCol) === null || _c === void 0 ? void 0 : _c.store.get("groupingDepth")) || 0;
        return (h(Host, { key: '3850ba7f960cb99fba5010d3af294c5c490ba7ce', [`${UUID}`]: this.uuid, class: {
                "hbr-table-no-selection": this.useClipboard,
            }, role: "table" }, h("slot", { key: 'f32c4806dd1a23eb6a3b13ab02f69a44ddf3ad44', name: "header" }), h(HbrViewPort, { key: '34bf6c7ce77c9776f6abab77cf50fcdee95dd581', viewports: this.viewportProvider.stores, dimensions: this.dimensionProvider.stores, orderRef: (e) => {
                this.orderService = e;
            }, registerElement: (e, k) => this.scrollingService.registerElement(e, k), nakedClick: () => this.viewport.clearEdit(), onScroll: (details) => this.scrollingService.onScroll(details), tbSelf: this, viewPortUUID: this.uuid }, this.rowHeaders ? (h(HbrgrRowHeaders, { height: contentHeight, anyView: this.viewport.columns[0], resize: this.resize, rowHeaderColumn: typeof this.rowHeaders === "object"
                ? this.rowHeaders
                : undefined, beforeRowAdd: (y) => this.selectionStoreConnector.registerRow(y), onScrollViewport: (e) => this.scrollingService.onScroll(e, "headerRow"), onElementToScroll: (e) => this.scrollingService.registerElement(e, "headerRow"), tbSelf: this })) : (""), h(ViewPortSections, { key: '283d2cdbe7f4c581520847d143afbb15861cdd66', tbSelf: this, columnFilter: !!this.filter, resize: this.resize, readonly: this.readonly, range: this.range, rowClass: this.rowClass, editors: this.editors, useClipboard: this.useClipboard, columns: this.viewport.columns, onEdit: (detail) => {
                const event = this.beforeeditstart.emit(detail);
                if (!event.defaultPrevented) {
                    this.selectionStoreConnector.setEdit(detail.isCancel ? false : detail.val);
                }
            }, registerElement: (e, k) => this.scrollingService.registerElement(e, k), onScroll: (details) => this.scrollingService.onScroll(details) })), h("slot", { key: '949116ecb920c3cc1d50dbd2da66e48c6d1f8266', name: "empty" }), this.extraElements, h("slot", { key: '736b7a4d611e37b6e914994fcb15fcc13514ffc9', name: "footer" }), h("span", { key: 'a5e05cf2d4615bc7bdb8570e7a9cbd98a5ce66e8', style: { display: "none" }, innerHTML: `<style nonce="${nonce}">
          hbr-table[${UUID}="${this.uuid}"]{
            ${this.resolveRowSize()
                ? `--header-height: ${this.resolveRowSize()}px;`
                : ""}${this.size ? `--cell-padding: ${sizePaddingMap[this.size]};` : ""}
          --hbr-table-row-size: ${this.sizeMap[this.size]}px;
					--group-header-depth: ${groupingDepth};
          }
          </style>` })));
    }
    get host() { return this; }
    static get watchers() { return {
        "size": ["sizeChanged"],
        "columns": ["columnChanged"],
        "theme": ["themeChanged"],
        "source": ["dataChanged"],
        "pinnedBottomSource": ["dataBottomChanged"],
        "pinnedTopSource": ["dataTopChanged"],
        "rowDefinitions": ["rowDefChanged"],
        "trimmedRows": ["trimmedRowsChanged"],
        "grouping": ["groupingChanged"],
        "stretch": ["applyStretch"],
        "exporting": ["handleExporting"],
        "searchText": ["handleSearchTextChange"],
        "deferInit": ["handleDeferInit"],
        "externalSorting": ["handleExternalSorting"]
    }; }
    static get style() { return HbrTableStyle0; }
}, [4, "hbr-table", {
        "size": [1],
        "sizeMap": [16],
        "rowHeaders": [4, "row-headers"],
        "frameSize": [2, "frame-size"],
        "rowSize": [1026, "row-size"],
        "colSize": [2, "col-size"],
        "range": [4],
        "readonly": [4],
        "resize": [4],
        "canFocus": [4, "can-focus"],
        "useClipboard": [4, "use-clipboard"],
        "disableFiltering": [4, "disable-filtering"],
        "enableColumnPopSelect": [4, "enable-column-pop-select"],
        "columns": [16],
        "subRowTemplate": [16],
        "source": [1040],
        "pinnedTopSource": [16],
        "pinnedBottomSource": [16],
        "rowDefinitions": [16],
        "editors": [16],
        "canMoveColumns": [4, "can-move-columns"],
        "searchText": [1, "search-text"],
        "plugins": [16],
        "columnTypes": [16],
        "theme": [1537],
        "rowClass": [513, "row-class"],
        "autoSizeColumn": [4, "auto-size-column"],
        "filter": [4],
        "enableRowSize": [4, "enable-row-size"],
        "syncScrollOnUpdate": [4, "sync-scroll-on-update"],
        "trimmedRows": [16],
        "externalSorting": [4, "external-sorting"],
        "exporting": [4],
        "grouping": [16],
        "stretch": [8],
        "headerSlot": [4, "header-slot"],
        "deferInit": [4, "defer-init"],
        "extraElements": [32],
        "setRowSelection": [64],
        "refresh": [64],
        "adjustAutoSizeColumn": [64],
        "scrollToRow": [64],
        "scrollToColumnIndex": [64],
        "scrollToColumnProp": [64],
        "updateColumns": [64],
        "addTrimmed": [64],
        "scrollToCoordinate": [64],
        "setCellEdit": [64],
        "registerVNode": [64],
        "getSource": [64],
        "getVisibleSource": [64],
        "getSourceStore": [64],
        "getColumnStore": [64],
        "updateColumnSorting": [64],
        "getColumns": [64],
        "clearFocus": [64],
        "getPlugins": [64],
        "getFocused": [64],
        "clearFilter": [64],
        "handleFilter": [64],
        "query": [64],
        "setRowSize": [64],
        "handleSorting": [64],
        "setStretch": [64],
        "resetScrollPosition": [64],
        "init": [64]
    }, [[0, "internalRowDragStart", "onRowDragStarted"], [0, "internalRowDragEnd", "onRowDragEnd"], [0, "internalRowDrag", "onRowDrag"], [0, "internalRowMouseMove", "onRowMouseMove"], [0, "internalCellEdit", "onBeforeEdit"], [0, "internalRangeDataApply", "onBeforeRangeEdit"], [0, "internalSelectionChanged", "onRangeChanged"], [0, "initialRowDropped", "onRowDropped"], [0, "initialHeaderClick", "onHeaderClick"], [0, "internalFocusCell", "onCellFocus"], [0, "afterFilterApply", "rePagination"], [0, "internalAfterLoad", "handleAfterLoad"]], {
        "size": ["sizeChanged"],
        "columns": ["columnChanged"],
        "theme": ["themeChanged"],
        "source": ["dataChanged"],
        "pinnedBottomSource": ["dataBottomChanged"],
        "pinnedTopSource": ["dataTopChanged"],
        "rowDefinitions": ["rowDefChanged"],
        "trimmedRows": ["trimmedRowsChanged"],
        "grouping": ["groupingChanged"],
        "stretch": ["applyStretch"],
        "exporting": ["handleExporting"],
        "searchText": ["handleSearchTextChange"],
        "deferInit": ["handleDeferInit"],
        "externalSorting": ["handleExternalSorting"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table", "hbr-button", "hbr-focus", "hbr-icon", "hbr-order-editor", "hbr-overlay-selection", "hbr-scroll-virtual", "hbr-spinner", "hbr-table-data", "hbr-table-edit", "hbr-table-header", "hbr-table-header-cell", "hbr-temp-range", "hbr-viewport-scroll", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrTableComponent);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$f();
            }
            break;
        case "hbr-focus":
            if (!customElements.get(tagName)) {
                defineCustomElement$e();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$d();
            }
            break;
        case "hbr-order-editor":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-overlay-selection":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-scroll-virtual":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-table-data":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-table-edit":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-table-header":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-table-header-cell":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-temp-range":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-viewport-scroll":
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

const HbrTable = HbrTableComponent;
const defineCustomElement = defineCustomElement$1;

export { HbrTable, defineCustomElement };

