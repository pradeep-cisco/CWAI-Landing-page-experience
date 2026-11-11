import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const FormatNumber = /*@__PURE__*/ proxyCustomElement(class FormatNumber extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.value = 0;
        this.locale = undefined;
        this.type = "decimal";
        this.noGrouping = false;
        this.currency = "USD";
        this.currencyDisplay = "symbol";
        this.minimumIntegerDigits = undefined;
        this.minimumFractionDigits = undefined;
        this.maximumFractionDigits = undefined;
        this.minimumSignificantDigits = undefined;
        this.maximumSignificantDigits = undefined;
    }
    render() {
        if (Number.isNaN(this.value)) {
            return "";
        }
        return new Intl.NumberFormat(this.locale, {
            style: this.type,
            currency: this.currency,
            currencyDisplay: this.currencyDisplay,
            useGrouping: !this.noGrouping,
            minimumIntegerDigits: this.minimumIntegerDigits,
            minimumFractionDigits: this.minimumFractionDigits,
            maximumFractionDigits: this.maximumFractionDigits,
            minimumSignificantDigits: this.minimumSignificantDigits,
            maximumSignificantDigits: this.maximumSignificantDigits,
        }).format(this.value);
    }
}, [1, "hbr-format-number", {
        "value": [2],
        "locale": [1],
        "type": [1],
        "noGrouping": [4, "no-grouping"],
        "currency": [1],
        "currencyDisplay": [1, "currency-display"],
        "minimumIntegerDigits": [2, "minimum-integer-digits"],
        "minimumFractionDigits": [2, "minimum-fraction-digits"],
        "maximumFractionDigits": [2, "maximum-fraction-digits"],
        "minimumSignificantDigits": [2, "minimum-significant-digits"],
        "maximumSignificantDigits": [2, "maximum-significant-digits"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-format-number"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-format-number":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FormatNumber);
            }
            break;
    } });
}

const HbrFormatNumber = FormatNumber;
const defineCustomElement = defineCustomElement$1;

export { HbrFormatNumber, defineCustomElement };

