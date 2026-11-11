import { s as showChartPopover, h as hideChartPopover } from './board.js';

const generateTooltipSwatch = (fill) => {
    var _a;
    const patternId = typeof fill === "string" ? (_a = /^url\(#([\w-]+)\)$/.exec(fill)) === null || _a === void 0 ? void 0 : _a[1] : undefined;
    if (patternId) {
        return `<div style="overflow:hidden;"><svg width="16" height="16" viewBox="0 0 16 16" style="width:16px;height:16px;margin:0;" aria-hidden="true" focusable="false"><rect width="16" height="16" fill="url(#${patternId})" /></svg></div>`;
    }
    return `<div style="background:${fill !== null && fill !== void 0 ? fill : "transparent"};"></div>`;
};
/**
 *
 * @param data - either slice data or point data
 * @param chartContextRoot
 * @returns either return a tooltip div for nivo slice to consume
 * @returns or set the content of a existing hbr-popover with no return
 */
function generateTooltipContent(data, formatFunc) {
    const infoBlock = `
      <div class="chart-donut__popover">
        <div>
          ${generateTooltipSwatch(data.fill)}
          ${data.id}
        </div>
        <div>
          ${formatFunc
        ? formatFunc({ formattedValue: data.value })
        : data.formattedValue || data.value}
        </div>
      </div>
    `;
    return infoBlock;
}
const toggleDonutLegendPopover = (tooltipRef, event, id, fill, userConfig) => {
    if (event) {
        const target = userConfig.data.find((record) => {
            const targetId = typeof userConfig.id === "function"
                ? userConfig.id(record)
                : userConfig.id
                    ? record[userConfig.id]
                    : record.id;
            return String(targetId) === String(id);
        });
        if (tooltipRef && target) {
            const arc = Array.from(tooltipRef.getRootNode().querySelectorAll("[datum-id]")).find((path) => path.getAttribute("datum-id") === String(id));
            showChartPopover(tooltipRef, 
            // not passing data and event, since custom legend and generator is passed with variables
            null, event, (_data, event, h) => { var _a; return (_a = userConfig === null || userConfig === void 0 ? void 0 : userConfig.legendTooltip) === null || _a === void 0 ? void 0 : _a.call(userConfig, target, fill, event, h); }, () => {
                var _a, _b;
                return generateTooltipContent(userConfig.id
                    ? Object.assign(Object.assign({}, target), { id: target[userConfig.id], fill: (_a = arc === null || arc === void 0 ? void 0 : arc.getAttribute("data-default-fill")) !== null && _a !== void 0 ? _a : fill }) : Object.assign(Object.assign({}, target), { fill: (_b = arc === null || arc === void 0 ? void 0 : arc.getAttribute("data-default-fill")) !== null && _b !== void 0 ? _b : fill }), userConfig.tooltip);
            });
        }
    }
    else {
        hideChartPopover(tooltipRef);
    }
};
const toggleDonutSectionPopover = (tooltipRef, event, datum, itemTooltip, tooltipFormattingFunc) => {
    var _a, _b, _c, _d;
    if (event) {
        const target = ((_a = event.currentTarget) !== null && _a !== void 0 ? _a : event.target);
        const root = target.closest("svg");
        const arc = Array.from((_b = root === null || root === void 0 ? void 0 : root.querySelectorAll("[datum-id]")) !== null && _b !== void 0 ? _b : []).find((path) => path.getAttribute("datum-id") === String(datum.id));
        const color = arc === null || arc === void 0 ? void 0 : arc.getAttribute("datum-color");
        const fill = (_d = (_c = arc === null || arc === void 0 ? void 0 : arc.getAttribute("fill")) !== null && _c !== void 0 ? _c : arc === null || arc === void 0 ? void 0 : arc.getAttribute("data-default-fill")) !== null && _d !== void 0 ? _d : color;
        const value = arc === null || arc === void 0 ? void 0 : arc.getAttribute("datum-value");
        const formattedValue = arc === null || arc === void 0 ? void 0 : arc.getAttribute("datum-formatted-value");
        showChartPopover(tooltipRef, Object.assign(Object.assign({}, datum), { id: datum.id, value, formattedValue, color, fill }), event, 
        // itemTooltip was passed like itemTooltip(datum, event)
        itemTooltip, () => generateTooltipContent({ id: datum.id, value, formattedValue, fill }, tooltipFormattingFunc));
    }
    else {
        hideChartPopover(tooltipRef);
    }
};
const convertDonutDataToCSV = (arr) => {
    const csv = [];
    // Get the headers from the first object
    const headers = Object.keys(arr[0]);
    csv.push(headers.join(","));
    // Iterate over each object and convert it to a CSV row
    arr.forEach((obj) => {
        const row = headers.map((header) => obj[header]);
        csv.push(row.join(","));
    });
    return csv.join("\n");
};

export { toggleDonutLegendPopover as a, convertDonutDataToCSV as c, toggleDonutSectionPopover as t };

