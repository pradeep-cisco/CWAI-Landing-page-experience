import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

//
// Formats a number to a human-readable string of bytes or bits such as "100 MB"
//
function formatBytes(bytes, options) {
    const obj = Object.assign({
        unit: "bytes",
        locale: undefined,
    }, options);
    const byteUnits = ["Byte", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const bitUnits = [
        "bit",
        "kbit",
        "Mbit",
        "Gbit",
        "Tbit",
        "Pbit",
        "Ebit",
        "Zbit",
        "Ybit",
    ];
    const units = obj.unit === "bytes" ? byteUnits : bitUnits;
    const isNegative = bytes < 0;
    const localBytes = Math.abs(bytes);
    if (localBytes === 0)
        return "0 B";
    const i = Math.min(Math.floor(Math.log10(localBytes) / 3), units.length - 1);
    const num = Number((localBytes / 1000 ** i).toPrecision(3));
    const numString = num.toLocaleString(obj.locale);
    const prefix = isNegative ? "-" : "";
    return `${prefix}${numString} ${units[i]}`;
}

const FormatBytes = /*@__PURE__*/ proxyCustomElement(class FormatBytes extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.value = 0;
        this.unit = "bytes";
        this.locale = undefined;
    }
    render() {
        return formatBytes(this.value, {
            unit: this.unit,
            locale: this.locale,
        });
    }
}, [1, "hbr-format-bytes", {
        "value": [2],
        "unit": [1],
        "locale": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-format-bytes"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-format-bytes":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FormatBytes);
            }
            break;
    } });
}

const HbrFormatBytes = FormatBytes;
const defineCustomElement = defineCustomElement$1;

export { HbrFormatBytes, defineCustomElement };

