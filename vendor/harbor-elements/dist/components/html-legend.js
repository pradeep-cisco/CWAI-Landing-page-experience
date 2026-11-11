import { a as toggleDonutLegendPopover } from './chart-util.js';
import { Z as Zo } from './chunk-EORJBOKT.js';

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CATEGORICAL_PATTERN_COUNT = 12;
let nextHtmlPatternId = 0;
const selectableLegendState = new WeakMap();
const getCategoricalPatternId = (index, state = "default", colorIndex) => `viz-categorical-pattern-${(index % CATEGORICAL_PATTERN_COUNT) + 1}${colorIndex === undefined || colorIndex === 0
    ? ""
    : `-color-${colorIndex + 1}`}${state === "hover" ? "-hover" : ""}`;
const isNoValueLegendItem = (id) => {
    const normalizedId = String(id).toLowerCase();
    return normalizedId.includes("no data") || normalizedId === "null";
};
const hasSingleBarNoDataLegend = (config) => {
    var _a, _b, _c;
    return !config.groupMode &&
        ((_b = (_a = config.keys) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 2 &&
        ((_c = config.keys) === null || _c === void 0 ? void 0 : _c.some((key) => isNoValueLegendItem(key)));
};
const shouldShowLegendTooltip = (config) => {
    if (config.legendTooltip === false)
        return false;
    if (config.legendTooltip === true ||
        typeof config.legendTooltip === "function") {
        return true;
    }
    return !hasSingleBarNoDataLegend(config) || config.groupMode === "grouped";
};
const getLegendData = (config) => {
    var _a, _b, _c, _d;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    const configuredData = Array.isArray(legend === null || legend === void 0 ? void 0 : legend.data) && legend.data.length > 0 ? legend.data : null;
    const nodes = (_b = config.data) === null || _b === void 0 ? void 0 : _b.nodes;
    const data = configuredData !== null && configuredData !== void 0 ? configuredData : (((_c = config.keys) === null || _c === void 0 ? void 0 : _c.length)
        ? [...config.keys]
        : Array.isArray(nodes)
            ? nodes
            : Array.isArray(config.data)
                ? config.data
                : []);
    const colors = Array.isArray(config.colors) ? config.colors : [];
    const idAccessor = (_d = config.id) !== null && _d !== void 0 ? _d : "id";
    return data.map((datum, index) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const isPrimitive = typeof datum === "string" || typeof datum === "number";
        const record = isPrimitive
            ? {}
            : datum;
        const id = ((_a = config.keys) === null || _a === void 0 ? void 0 : _a.length) && !configuredData
            ? datum
            : configuredData
                ? (_b = record.id) !== null && _b !== void 0 ? _b : index
                : typeof idAccessor === "function"
                    ? idAccessor(record)
                    : (_d = (_c = record[idAccessor]) !== null && _c !== void 0 ? _c : record.name) !== null && _d !== void 0 ? _d : index;
        return {
            id: id,
            label: String((_e = record.label) !== null && _e !== void 0 ? _e : id),
            color: String((_g = (_f = record.color) !== null && _f !== void 0 ? _f : (colors.length ? colors[index % colors.length] : undefined)) !== null && _g !== void 0 ? _g : `var(--data-viz-categorical-${index + 1}-default)`),
            index,
        };
    });
};
const appendPatternShape = (parent, shape) => {
    var _a;
    if (Array.isArray(shape)) {
        shape.forEach((child) => appendPatternShape(parent, child));
        return;
    }
    if (!shape || typeof shape !== "object")
        return;
    const reactElement = shape;
    if (typeof reactElement.type !== "string")
        return;
    const element = document.createElementNS(SVG_NAMESPACE, reactElement.type);
    const props = (_a = reactElement.props) !== null && _a !== void 0 ? _a : {};
    for (const [name, value] of Object.entries(props)) {
        if (name === "children" || value === null || value === undefined)
            continue;
        if (typeof value === "string" || typeof value === "number") {
            const attributeName = name.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
            element.setAttribute(attributeName, String(value));
        }
    }
    const children = props.children;
    if (Array.isArray(children)) {
        children.forEach((child) => appendPatternShape(element, child));
    }
    else if (children) {
        appendPatternShape(element, children);
    }
    parent.append(element);
};
const createLegendSymbol = ({ id, color, index }, pattern, chartType, size, patternColorIndex) => {
    const isNoValue = isNoValueLegendItem(id);
    if (chartType === "bar" && pattern && !isNoValue) {
        const symbol = document.createElement("span");
        symbol.className = "chart-html-legend-symbol chart-html-legend-pattern";
        symbol.style.setProperty("--chart-html-legend-symbol-size", `${size}px`);
        symbol.style.background = color;
        symbol.setAttribute("aria-hidden", "true");
        const patternId = `bar-categorical-html-pattern-${nextHtmlPatternId++}`;
        const patternShape = Zo.getCategoricalPatternShape(index + 1, patternId);
        if (patternShape) {
            const overlay = document.createElementNS(SVG_NAMESPACE, "svg");
            overlay.setAttribute("width", String(size));
            overlay.setAttribute("height", String(size));
            overlay.setAttribute("viewBox", `0 0 ${size} ${size}`);
            overlay.setAttribute("aria-hidden", "true");
            const defs = document.createElementNS(SVG_NAMESPACE, "defs");
            appendPatternShape(defs, patternShape);
            const rect = document.createElementNS(SVG_NAMESPACE, "rect");
            rect.setAttribute("width", String(size));
            rect.setAttribute("height", String(size));
            rect.setAttribute("rx", "2");
            rect.setAttribute("fill", `url(#${patternId})`);
            overlay.append(defs, rect);
            symbol.append(overlay);
        }
        return symbol;
    }
    const usePattern = pattern || isNoValue;
    if (!usePattern) {
        const symbol = document.createElement("span");
        symbol.className = "chart-html-legend-symbol";
        if (chartType === "bar") {
            symbol.style.background = color;
        }
        else {
            symbol.style.setProperty("--chart-html-legend-symbol-color", color);
        }
        symbol.style.setProperty("--chart-html-legend-symbol-size", `${size}px`);
        symbol.setAttribute("aria-hidden", "true");
        return symbol;
    }
    const patternId = isNoValue
        ? "no-value-pattern"
        : getCategoricalPatternId(index, "default", patternColorIndex);
    const symbol = document.createElementNS(SVG_NAMESPACE, "svg");
    symbol.classList.add("chart-html-legend-symbol");
    if (chartType === "donut") {
        symbol.classList.add("chart-donut__categorical-legend-symbol");
    }
    symbol.style.setProperty("--chart-html-legend-symbol-size", `${size}px`);
    symbol.setAttribute("viewBox", `0 0 ${size} ${size}`);
    symbol.setAttribute("width", String(size));
    symbol.setAttribute("height", String(size));
    symbol.setAttribute("aria-hidden", "true");
    const rect = document.createElementNS(SVG_NAMESPACE, "rect");
    rect.setAttribute("width", String(size));
    rect.setAttribute("height", String(size));
    rect.setAttribute("rx", "2");
    rect.setAttribute("fill", `url(#${patternId})`);
    if (isNoValue) {
        rect.setAttribute("stroke-width", "0");
        rect.setAttribute("stroke", "transparent");
        rect.style.pointerEvents = "none";
    }
    symbol.append(rect);
    return symbol;
};
const getPatternColorIndex = (legendDatum, config) => {
    const colors = Array.isArray(config.colors) ? config.colors : [];
    if (!colors.length)
        return undefined;
    const colorIndex = colors.indexOf(legendDatum.color);
    return colorIndex >= 0 ? colorIndex : legendDatum.index % colors.length;
};
const dispatchArcEvent = (board, id, type) => {
    const path = Array.from(board.querySelectorAll("[datum-id]")).find((element) => element.getAttribute("datum-id") === id);
    if (!path)
        return;
    path.dispatchEvent(type === "focusin" || type === "focusout"
        ? new FocusEvent(type, { bubbles: true })
        : new MouseEvent(type, { bubbles: true }));
};
const handleLegendEvent = (board, config, event) => {
    const button = event.target.closest(".chart-donut__categorical-legend-item");
    if (!button)
        return;
    const tooltip = board.querySelector("hbr-popover");
    const relatedTarget = event
        .relatedTarget;
    if ((event.type === "mouseover" || event.type === "mouseout") &&
        relatedTarget &&
        button.contains(relatedTarget)) {
        return;
    }
    const id = button.dataset.id;
    if (id === undefined)
        return;
    if (isNoValueLegendItem(id)) {
        if (event.type === "mouseout" || event.type === "blur") {
            toggleDonutLegendPopover(tooltip);
        }
        return;
    }
    dispatchArcEvent(board, id, {
        mouseover: "mouseover",
        mouseout: "mouseout",
        focus: "focusin",
        blur: "focusout",
        click: "click",
    }[event.type]);
    if (event.type === "mouseover" || event.type === "focus") {
        toggleDonutLegendPopover(tooltip, event, id, button.dataset.color, config);
    }
    else if (event.type === "click") {
        event.stopPropagation();
        toggleDonutLegendPopover(tooltip, event, id, button.dataset.color, config);
    }
    else {
        toggleDonutLegendPopover(tooltip);
    }
};
const renderDonutHtmlLegend = (board, config, chartType = "donut", selectableLegendOptions) => {
    var _a, _b, _c;
    const legend = (_a = config.legends) === null || _a === void 0 ? void 0 : _a[0];
    const isHorizontalLegend = (legend === null || legend === void 0 ? void 0 : legend.horizontal) === true;
    const isBottomRow = !legend ||
        (["bottom", "bottom-left"].includes(String((_b = legend.anchor) !== null && _b !== void 0 ? _b : (isHorizontalLegend ? "right" : "bottom"))) &&
            ((_c = legend.direction) !== null && _c !== void 0 ? _c : (isHorizontalLegend ? "column" : "row")) === "row");
    const data = isBottomRow ? getLegendData(config) : [];
    const symbolSize = Number(legend === null || legend === void 0 ? void 0 : legend.symbolSize) || 16;
    let container = board.querySelector(".chart-html-legend");
    if (!data.length || config.legendLayout !== "html" || !isBottomRow) {
        container === null || container === void 0 ? void 0 : container.remove();
        return;
    }
    if (!container) {
        container = document.createElement("div");
        container.slot = "legend";
        container.className =
            chartType === "donut"
                ? "chart-html-legend chart-donut__categorical-legend"
                : "chart-html-legend";
        container.setAttribute("role", "list");
        board.append(container);
    }
    const selectableItems = new Map(Array.from(container.querySelectorAll(".chart-html-legend-selectable-item[data-id]")).map((item) => { var _a; return [(_a = item.dataset.id) !== null && _a !== void 0 ? _a : "", item]; }));
    const checkboxUpdates = [];
    const isSelectableLegend = chartType === "bar" && config.selectableLegend === true;
    const selectedIds = selectableLegendOptions === null || selectableLegendOptions === void 0 ? void 0 : selectableLegendOptions.selectedIds;
    const items = data.map((legendDatum) => {
        var _a, _b, _c;
        if (isSelectableLegend && selectedIds) {
            const listItem = (_a = selectableItems.get(String(legendDatum.id))) !== null && _a !== void 0 ? _a : document.createElement("div");
            listItem.classList.add("chart-html-legend-selectable-item");
            listItem.dataset.id = String(legendDatum.id);
            listItem.setAttribute("role", "listitem");
            if (config.pattern === true) {
                if (!listItem.querySelector(".chart-html-legend-pattern")) {
                    listItem.prepend(createLegendSymbol(legendDatum, true, chartType, symbolSize, getPatternColorIndex(legendDatum, config)));
                }
            }
            else {
                (_b = listItem.querySelector(".chart-html-legend-pattern")) === null || _b === void 0 ? void 0 : _b.remove();
            }
            let checkbox = listItem.querySelector("hbr-checkbox");
            if (!checkbox) {
                checkbox = document.createElement("hbr-checkbox");
                checkbox.setAttribute("size", "small");
                checkbox.append(document.createTextNode(legendDatum.label));
                checkbox.addEventListener("hbr-change", (event) => {
                    var _a, _b;
                    event.stopPropagation();
                    const currentSelectedIds = (_a = selectableLegendState.get(checkbox)) !== null && _a !== void 0 ? _a : new Set();
                    const id = String(legendDatum.id);
                    if (checkbox.checked === currentSelectedIds.has(id))
                        return;
                    const nextSelectedIds = new Set(currentSelectedIds);
                    if (checkbox.checked) {
                        nextSelectedIds.add(id);
                    }
                    else {
                        nextSelectedIds.delete(id);
                    }
                    (_b = selectableLegendOptions === null || selectableLegendOptions === void 0 ? void 0 : selectableLegendOptions.onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(selectableLegendOptions, Array.from(nextSelectedIds));
                });
            }
            checkboxUpdates.push({
                listItem,
                checkbox,
                id: String(legendDatum.id),
                color: legendDatum.color,
                selectedIds,
            });
            return listItem;
        }
        const isNoData = isNoValueLegendItem(legendDatum.id) ||
            isNoValueLegendItem(legendDatum.label);
        const hasTooltip = shouldShowLegendTooltip(config);
        const hasInteraction = !isNoData &&
            (chartType !== "bar" ||
                hasTooltip ||
                Boolean(config.groupMode) ||
                isSelectableLegend);
        const item = hasInteraction
            ? document.createElement("button")
            : document.createElement("span");
        if (item instanceof HTMLButtonElement)
            item.type = "button";
        item.className =
            chartType === "donut"
                ? "chart-html-legend-item chart-donut__categorical-legend-item"
                : "chart-html-legend-item";
        item.setAttribute("role", "listitem");
        item.dataset.id = String(legendDatum.id);
        item.dataset.color = legendDatum.color;
        item.style.setProperty("--chart-html-legend-item-gap", typeof (legend === null || legend === void 0 ? void 0 : legend.symbolSpacing) === "number"
            ? `${legend.symbolSpacing}px`
            : chartType === "donut"
                ? "var(--hbr-spacing-3xs, 2px)"
                : "8px");
        item.style.setProperty("--chart-html-legend-item-color", typeof (legend === null || legend === void 0 ? void 0 : legend.itemTextColor) === "string"
            ? legend.itemTextColor
            : "var(--base-text-default)");
        item.style.setProperty("--chart-html-legend-item-opacity", String(typeof (legend === null || legend === void 0 ? void 0 : legend.itemOpacity) === "number" ? legend.itemOpacity : 1));
        item.style.setProperty("--chart-html-legend-item-cursor", hasInteraction ? "pointer" : "default");
        if (chartType === "donut") {
            item.onmouseover = (event) => handleLegendEvent(board, config, event);
            item.onmouseout = (event) => handleLegendEvent(board, config, event);
            item.onfocus = (event) => handleLegendEvent(board, config, event);
            item.onblur = (event) => handleLegendEvent(board, config, event);
        }
        else if (hasInteraction) {
            const configuredLegend = (_c = config.legends) === null || _c === void 0 ? void 0 : _c[0];
            const itemData = {
                id: legendDatum.id,
                label: legendDatum.label,
                color: legendDatum.color,
                hidden: false,
            };
            const dispatch = (name, event) => {
                const handler = configuredLegend === null || configuredLegend === void 0 ? void 0 : configuredLegend[name];
                if (typeof handler === "function") {
                    handler(itemData, event);
                }
            };
            item.onmouseenter = (event) => dispatch("onMouseEnter", event);
            item.onmouseleave = (event) => dispatch("onMouseLeave", event);
            item.onfocus = (event) => dispatch("onFocus", event);
            item.onblur = (event) => dispatch("onBlur", event);
            item.onclick = (event) => {
                var _a;
                if (isSelectableLegend) {
                    event.stopPropagation();
                    (_a = selectableLegendOptions === null || selectableLegendOptions === void 0 ? void 0 : selectableLegendOptions.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(selectableLegendOptions, [legendDatum.id]);
                    return;
                }
                dispatch("onClick", event);
            };
        }
        item.append(createLegendSymbol(legendDatum, config.pattern === true, chartType, symbolSize, getPatternColorIndex(legendDatum, config)), document.createTextNode(legendDatum.label));
        return item;
    });
    const hasSameItems = container.children.length === items.length &&
        items.every((item, index) => (container === null || container === void 0 ? void 0 : container.children[index]) === item);
    if (!hasSameItems)
        container.replaceChildren(...items);
    for (const { listItem, checkbox, id, color, selectedIds, } of checkboxUpdates) {
        if (!checkbox.isConnected)
            listItem.append(checkbox);
        const updateCheckbox = () => {
            selectableLegendState.set(checkbox, selectedIds);
            checkbox.size = "small";
            const isChecked = selectedIds.has(id);
            if (checkbox.checked !== isChecked)
                checkbox.checked = isChecked;
            checkbox.style.setProperty("--control-bg-strong-default", color);
            checkbox.style.setProperty("--control-bg-strong-hover", color);
        };
        const componentOnReady = checkbox.componentOnReady;
        if (componentOnReady) {
            void componentOnReady.call(checkbox).then(updateCheckbox);
        }
        else {
            updateCheckbox();
        }
    }
    if (chartType === "donut") {
        container.onmouseover = (event) => handleLegendEvent(board, config, event);
        container.onmouseout = (event) => handleLegendEvent(board, config, event);
        container.onclick = (event) => handleLegendEvent(board, config, event);
    }
};

export { renderDonutHtmlLegend };

