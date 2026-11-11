import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { R as caretDoubleLeft, S as caretDoubleRight } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$1 } from './icon-button.js';

const pickerCss = ":host{--picker-width:252px;--border:var(--hbr-border-width, 2px) solid var(--control-border-default);--box-shadow:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, 0.05));--border-radius:var(--hbr-border-radius-md, 6px);--padding:10px;--header-gap:var(--hbr-spacing-xs, 8px);--header-padding:0 var(--hbr-spacing-2xs) var(--hbr-spacing-sm);--header-line-height:20px;--button-height:40px;--button-width:76px;--button-padding:0;--button-border:2px solid var(--base-border-default);--button-border-radius:var(--hbr-border-radius-md, 6px);--button-font-weight-hover:var(--hbr-font-weight-semi-bold, 600);--button-font-weight-selected:var(--hbr-font-weight-semi-bold, 600);--button-border-disabled:2px solid var(--control-border-weak-disabled);display:block}:host([variant=quarter]){--button-width:55px;--button-height:40px}abbr[title]{text-decoration:none}.picker{padding:var(--padding);background-color:var(--control-bg-weak-default);border:var(--border);box-shadow:var(--box-shadow);border-radius:var(--border-radius);width:var(--picker-width)}.header{display:flex;justify-content:space-between;align-items:center;gap:var(--header-gap);padding:var(--header-padding);font-size:var(--header-font-size, var(--hbr-font-size-sm, 14px));font-weight:var(--header-font-weight, var(--hbr-font-weight-bold, 700));line-height:var(--header-line-height);color:var(--base-text-default)}.picker__body{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:var(--body-gap, var(--hbr-spacing-xs, 8px));padding:var(--body-padding, var(--hbr-spacing-3xs))}.picker__button{width:var(--button-width, auto);height:var(--button-height, auto);padding:var(--button-padding)}.picker__button.picker__month{width:var(--month-button-width, var(--button-width));height:var(--month-button-height, var(--button-height))}.picker__button.picker__quarter{width:var(--quarter-button-width, var(--button-width));height:var(--quarter-button-height, var(--button-height))}.picker__button.picker__year{width:var(--year-button-width, var(--button-width));height:var(--year-button-height, var(--button-height))}.picker__button{border:var(--button-border);background-color:var(--button-bg);color:var(--button-color);border-radius:var(--button-border-radius);font-weight:var(--button-font-weight)}.picker__button:not(.picker__disabled):hover{cursor:pointer;border:var(--button-border-hover);background-color:var(--button-bg-hover);color:var(--control-bg-strong-hover);font-weight:var(--button-font-weight-hover)}.picker__button.picker__disabled{cursor:not-allowed;border:var(--button-border-disabled);background-color:var(--control-bg-disabled);color:var(--base-text-disabled);cursor:not-allowed}.picker__button.picker__disabled abbr,.picker__button.picker__disabled span{pointer-events:none}.picker__button.picker__selected{border:var(--button-border-selected);background-color:var(--control-bg-strong-default);color:var(--interact-text-in-default);font-weight:var(--button-font-weight-selected)}:host-context([data-theme=onecd]){--button-border:var(--onecd-border-width-default) solid var(--base-border-default)}";
const HbrPickerStyle0 = pickerCss;

const HbrPicker = /*@__PURE__*/ proxyCustomElement(class HbrPicker extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrPreviousYear = createEvent(this, "hbr-previous-year", 7);
        this.hbrNextYear = createEvent(this, "hbr-next-year", 7);
        this.hbrYearHeadingClick = createEvent(this, "hbr-year-heading-click", 7);
        this.i18n = {
            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            quarters: ["Q1", "Q2", "Q3", "Q4"],
            previousYear: "Click to go to the previous year.",
            nextYear: "Click to go to the next year.",
        };
        this.data = undefined;
        this.selected = undefined;
        this.variant = undefined;
        this.yearRange = undefined;
        this.year = undefined;
        this.value = undefined;
        this.disabled = undefined;
        this.disablePrevious = undefined;
        this.disableNext = undefined;
        this.minYear = undefined;
        this.maxYear = undefined;
        this.selectedValue = undefined;
        this.hasHeaderSlot = undefined;
    }
    handleDisabledChange() {
        this.host.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    setVariant() {
        var _a;
        if (!this.variant) {
            // Ensure variant is set for angular
            const { year } = this;
            if (year && typeof year === "string" && year.includes("-")) {
                // "2020-2029"
                this.variant = "year";
            }
            else if (((_a = this.data) === null || _a === void 0 ? void 0 : _a.length) === 12) {
                const firstData = this.data[0];
                if (typeof firstData === "string" &&
                    this.i18n.months[0].includes(firstData)) {
                    this.variant = "month";
                }
            }
        }
    }
    connectedCallback() {
        const { variant, i18n } = this;
        this.handleSlotChange = this.handleSlotChange.bind(this);
        if (!this.data) {
            if (variant === "month") {
                this.data = i18n.months;
            }
            else if (variant === "quarter") {
                this.data = i18n.quarters;
            }
            else if ((variant === "year" && !this.yearRange) ||
                this.yearRange === 10) {
                this.data = Array.from({ length: 12 }, (_, i) => i + 1);
            }
        }
        this.setVariant();
    }
    componentWillLoad() {
        this.setVariant();
    }
    handleSlotChange() {
        this.hasHeaderSlot = hasSlot(this.host, "header");
    }
    handlePrevYearClick(event) {
        this.year = String(Number(this.year) - 1);
        this.hbrPreviousYear.emit({ year: Number(this.year), event });
    }
    handleNextYearClick(event) {
        this.year = String(Number(this.year) + 1);
        this.hbrNextYear.emit({ year: Number(this.year), event });
    }
    handlePrevYearRangeClick(event) {
        let filteredData;
        if (typeof this.data[0] === "object") {
            filteredData = this.data
                .filter((d) => !d.disabled)
                .map((d) => (typeof d === "object" ? Number(d.year) : d));
        }
        else {
            filteredData = this.data.filter((year) => { var _a; return ((_a = this.disabled) === null || _a === void 0 ? void 0 : _a.length) ? !this.disabled.includes(year) : true; });
        }
        const currentStartYear = Number(filteredData[0]);
        const prevEndYear = currentStartYear - 1;
        const prevStartYear = prevEndYear - 9;
        this.data = Array.from({ length: 12 }, (_, i) => {
            const currentYear = prevStartYear - 1 + i;
            return {
                year: currentYear,
                disabled: currentYear < prevStartYear || currentYear > prevEndYear,
            };
        });
        this.disabled = this.data
            .filter((d) => d.disabled)
            .map((d) => d.year);
        this.year = `${prevStartYear}-${prevEndYear}`;
        this.hbrPreviousYear.emit({ year: this.year, event });
    }
    handleNextYearRangeClick(event) {
        var _a;
        let filteredData;
        if (typeof this.data[0] === "object") {
            filteredData = this.data
                .filter((d) => !d.disabled)
                .map((d) => (typeof d === "object" ? Number(d.year) : d));
        }
        else {
            filteredData = this.data.filter((year) => { var _a; return ((_a = this.disabled) === null || _a === void 0 ? void 0 : _a.length) ? !this.disabled.includes(year) : true; });
        }
        const currentEndYear = ((_a = filteredData === null || filteredData === void 0 ? void 0 : filteredData.length) !== null && _a !== void 0 ? _a : 0) &&
            Number(filteredData[filteredData.length - 1]);
        const nextStartYear = currentEndYear + 1;
        const nextEndYear = nextStartYear + 9;
        this.data = Array.from({ length: 12 }, (_, i) => {
            const currentYear = nextStartYear - 1 + i;
            return {
                year: currentYear,
                disabled: currentYear < nextStartYear || currentYear > nextEndYear,
            };
        });
        this.disabled = this.data
            .filter((d) => d.disabled)
            .map((d) => d.year);
        this.year = `${nextStartYear}-${nextEndYear}`;
        this.hbrNextYear.emit({ year: this.year, event });
    }
    handleButtonClick(value, month, event) {
        this.hbrClick.emit({
            value,
            event,
            month,
            data: this.data,
            year: this.year,
        });
    }
    handleYearHeader() {
        this.hbrYearHeadingClick.emit({ year: Number(this.year) });
    }
    render() {
        var _a, _b;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        if (!this.data || this.data.length === 0) {
            return null;
        }
        let yearRangeLabel = "";
        if (this.variant === "year") {
            if (typeof this.data[0] === "object") {
                const validYearsArray = this.data.filter((d) => typeof d === "object" && !d.disabled);
                yearRangeLabel = `${validYearsArray[0].year}-${validYearsArray[validYearsArray.length - 1].year}`;
            }
            else {
                const filteredData = this.data.filter((year) => !this.disabled || !this.disabled.includes(year));
                yearRangeLabel = `${filteredData[0]}-${filteredData[filteredData.length - 1]}`;
            }
        }
        const nextYearArrowDisable = Number(this.year) ===
            (((_b = this.disabled) === null || _b === void 0 ? void 0 : _b.length) &&
                this.disabled.length > 1 &&
                Number(this.disabled[1]) - 1);
        return (h(Host, null, h("div", { part: "base", class: "picker" }, h("div", { class: "header", part: "header" }, this.hasHeaderSlot ? (h("slot", { name: "header", onSlotchange: this.handleSlotChange })) : (h(Fragment, null, h("slot", { name: "previous-year", onSlotchange: this.handleSlotChange }, this.variant === "month" || this.variant === "quarter" ? (h("hbr-icon-button", { "data-testid": "prevYear", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-left"]) ||
                caretDoubleLeft, onClick: this.handlePrevYearClick.bind(this), class: "picker__prev-year", aria: {
                label: this.i18n.previousYear ||
                    "Click to go to the previous year.",
            }, size: "12px", disabled: Number(this.year) - 1 === this.minYear })) : (h("hbr-icon-button", { "data-testid": "prevYear", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-left"]) ||
                caretDoubleLeft, onClick: this.handlePrevYearRangeClick.bind(this), class: "picker__prev-year", aria: {
                label: this.i18n.previousYear ||
                    "Click to go to the previous year.",
            }, size: "12px" }))), this.variant === "month" || this.variant === "quarter" ? (h("span", { part: "year", role: "button", tabindex: "0", onClick: this.handleYearHeader.bind(this) }, h("slot", { name: "year", onSlotchange: this.handleSlotChange }, this.year))) : (h("span", { part: "year" }, h("slot", { name: "year", onSlotchange: this.handleSlotChange }, yearRangeLabel))))), h("slot", { name: "next-year", onSlotchange: this.handleSlotChange }, this.variant === "month" || this.variant === "quarter" ? (h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-right"]) ||
                caretDoubleRight, arialabel: this.i18n.nextYear || "Click to go to the next year.", "data-testid": "nextYear", class: "picker__next-year", onClick: this.handleNextYearClick.bind(this), size: "12px", disabled: nextYearArrowDisable })) : (h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-right"]) ||
                caretDoubleRight, arialabel: this.i18n.nextYear || "Click to go to the next year.", "data-testid": "nextYear", class: "picker__next-year", onClick: this.handleNextYearRangeClick.bind(this), size: "12px", disabled: nextYearArrowDisable })))), h("div", { class: `picker__body ${this.variant}`, part: "body" }, h("slot", null, this.data.map((_d, index) => {
            var _a, _b;
            let buttonDisabled;
            if (typeof _d === "object") {
                //for now, year picker only
                const { year, disabled } = _d;
                buttonDisabled = disabled;
                return (h("button", { type: "button", "data-testid": `year-button-${year}`, key: index.toString(), value: year, class: {
                        /** type of picker */
                        picker__month: this.variant === "month",
                        picker__year: this.variant === "year",
                        picker__quarter: this.variant === "quarter",
                        picker__button: true,
                        picker__selected: (!disabled && this.value === year) ||
                            this.value === index,
                        picker__disabled: disabled,
                    }, disabled: buttonDisabled ||
                        (((_a = this.disabled) === null || _a === void 0 ? void 0 : _a.length) &&
                            this.disabled.includes(year)), onClick: !disabled &&
                        this.handleButtonClick.bind(this, year, this.variant === "month" ? index : undefined) }, year));
            }
            buttonDisabled =
                ((_b = this.disabled) === null || _b === void 0 ? void 0 : _b.length) && this.disabled.includes(_d);
            return (h("button", Object.assign({ type: "button", "data-testid": this.variant === "quarter"
                    ? `quarter-button-${_d}`
                    : this.variant === "year"
                        ? `year-button-${_d}`
                        : `month-button-${_d}`, key: index.toString(), value: _d }, (this.variant === "month" && {
                "data-month": index,
            }), { class: {
                    /** type of picker */
                    picker__month: this.variant === "month",
                    picker__year: this.variant === "year",
                    picker__quarter: this.variant === "quarter",
                    picker__button: true,
                    picker__selected: (!buttonDisabled && this.value === _d) ||
                        this.value === index,
                    picker__disabled: buttonDisabled,
                }, disabled: buttonDisabled, onClick: !buttonDisabled &&
                    this.handleButtonClick.bind(this, _d, this.variant === "month" ? index : undefined) }), this.variant === "month" ? (h("abbr", { title: this.i18n.months[index] }, _d)) : (_d)));
        }))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrPickerStyle0; }
}, [1, "hbr-picker", {
        "i18n": [16],
        "data": [1040],
        "selected": [1537],
        "variant": [1537],
        "yearRange": [514, "year-range"],
        "year": [1544],
        "value": [1544],
        "disabled": [1040],
        "disablePrevious": [1540, "disable-previous"],
        "disableNext": [1540, "disable-next"],
        "minYear": [514, "min-year"],
        "maxYear": [514, "max-year"],
        "selectedValue": [32],
        "hasHeaderSlot": [32]
    }, undefined, {
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-picker", "hbr-icon", "hbr-icon-button"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-picker":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrPicker);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrPicker as H, defineCustomElement as d };

