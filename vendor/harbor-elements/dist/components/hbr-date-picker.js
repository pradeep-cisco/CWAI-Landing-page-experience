import { proxyCustomElement, HTMLElement, createEvent, h, Fragment, Host } from '@stencil/core/internal/client';
import { j as calendarBlank, k as arrowRight } from './index2.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$h } from './icon.js';
import { b as browserLanguage } from './translations.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$k } from './button.js';
import { d as defineCustomElement$j } from './calendar.js';
import { d as defineCustomElement$i } from './dropdown.js';
import { d as defineCustomElement$g } from './icon-button.js';
import { d as defineCustomElement$f } from './input.js';
import { d as defineCustomElement$e } from './menu.js';
import { d as defineCustomElement$d } from './menu-item.js';
import { d as defineCustomElement$c } from './option.js';
import { d as defineCustomElement$b } from './picker.js';
import { d as defineCustomElement$a } from './popup.js';
import { d as defineCustomElement$9 } from './select.js';
import { d as defineCustomElement$8 } from './select-anchor.js';
import { d as defineCustomElement$7 } from './spinner.js';
import { d as defineCustomElement$6 } from './tag.js';
import { d as defineCustomElement$5 } from './time-panel.js';
import { d as defineCustomElement$4 } from './time-picker.js';
import { d as defineCustomElement$3 } from './tooltip.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const NUMERIC_DATE_PARTS = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
};
const PADDED_NUMERIC_DATE_PARTS = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
};
const ENGLISH_FORMAT_OPTIONS = {
    year: "numeric",
    month: "short",
    day: "numeric",
};
const LONG_DATE_OPTIONS = {
    year: "numeric",
    month: "long",
    day: "numeric",
};
const DEFAULT_EN_I18N = {
    previousMonth: "Previous Month",
    nextMonth: "Next Month",
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
    weekdays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],
};
const createDateFromParts = (year, month, day) => {
    if (!Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)) {
        return null;
    }
    const parsed = new Date(year, month - 1, day);
    if (parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day) {
        return null;
    }
    return parsed;
};
const parseDate = (value) => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value);
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const formatDate = (value, locale, options) => {
    const parsed = parseDate(value);
    return parsed ? new Intl.DateTimeFormat(locale, options).format(parsed) : "";
};
const getDatePartsOrder = (locale, options = NUMERIC_DATE_PARTS) => new Intl.DateTimeFormat(locale, options)
    .formatToParts(new Date(2001, 10, 22))
    .filter((part) => ["year", "month", "day", "literal"].includes(part.type));
const parseNumericDateString = (dateString, order) => {
    const values = dateString.match(/\d+/g);
    if (!values || values.length < 3) {
        return null;
    }
    const parts = { year: 0, month: 0, day: 0 };
    order.forEach((part, index) => {
        parts[part] = Number(values[index]);
    });
    return createDateFromParts(parts.year, parts.month, parts.day);
};
const getLocaleDateMetadata = (locale, options = NUMERIC_DATE_PARTS) => {
    const parts = getDatePartsOrder(locale, options);
    return {
        parts,
        order: parts
            .filter((part) => part.type !== "literal")
            .map((part) => part.type),
    };
};
const getLocaleMonths = (locale, format = "long") => Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2020, month, 1)));
const getLocaleWeekdays = (locale, format = "long") => Array.from({ length: 7 }, (_, offset) => new Intl.DateTimeFormat(locale, { weekday: format }).format(new Date(2020, 5, 7 + offset)));
const getFormatPattern = (locale) => getDatePartsOrder(locale, PADDED_NUMERIC_DATE_PARTS)
    .map((part) => {
    switch (part.type) {
        case "year":
            return "YYYY";
        case "month":
            return "MM";
        case "day":
            return "DD";
        default:
            return part.value;
    }
})
    .join("");
const getFirstDayOfWeek = (locale) => {
    var _a;
    try {
        const intlLocale = new Intl.Locale(locale);
        if ((_a = intlLocale.weekInfo) === null || _a === void 0 ? void 0 : _a.firstDay) {
            return intlLocale.weekInfo.firstDay % 7;
        }
    }
    catch (_b) {
        // Fallback below.
    }
    return 0;
};
const getLocalizedDateConfig = (locale) => ({
    months: getLocaleMonths(locale, "long"),
    monthsShort: getLocaleMonths(locale, "short"),
    weekdays: getLocaleWeekdays(locale, "long"),
    weekdaysShort: getLocaleWeekdays(locale, "short"),
});
const isEmpty = (value) => value === null ||
    value === "null" ||
    value === undefined ||
    value === "undefined" ||
    value === "";
function valueValidDate(str) {
    return Boolean(parseDate(str));
}
function isValidDate(str, self) {
    const { minDate: min, maxDate: max } = self;
    if (!valueValidDate(str))
        return;
    if (!min && !max)
        return true;
    if (min) {
        if (!valueValidDate(min))
            return;
        if (new Date(str).getTime() < new Date(min).getTime()) {
            return false;
        }
    }
    if (max && !valueValidDate(max))
        return;
    return true;
}
function validUserInput(date) {
    if (Number.isNaN(Number(date[0])))
        return true; /** skip if neutral format */
    const numericDate = parseNumericDateString(date, /^\d{4}\D/.test(date) ? ["year", "month", "day"] : ["month", "day", "year"]);
    return Boolean(numericDate);
}
/**
 * Handles non-English "MMM D, YYYY" formats (as generated in #517)
 * by converting Intl.DateTimeFormat(locale).format(date) (in line #515) output into a format suitable for validation.
 */
function swapDateFormat(date) {
    if (Number.isNaN(Number(date[0])))
        return ""; /** skip if neutral format */
    // Replace any non-numeric character (except "-" or "/") with "/"
    let cleaned = date.replace(/[^0-9/-]+/g, "/");
    if (Number.isNaN(Number(cleaned[cleaned.length - 1]))) {
        cleaned = cleaned.slice(0, cleaned.length - 1);
    }
    // Check if the cleaned string contains only valid separators
    if (/^[\d/-]+$/.test(cleaned)) {
        return cleaned;
    }
    // Fallback: return the cleaned string
    return cleaned;
}
/** usage: parseLocaleDate("2025/4/18", "ja-JP") -> Wed Apr 18 2025 00:00:00 GMT-0700 (Pacific Daylight Time) */
function parseLocaleDate(dateString, locale, formatOptions) {
    try {
        const { order } = getLocaleDateMetadata(locale, formatOptions || NUMERIC_DATE_PARTS);
        return parseNumericDateString(dateString, order);
    }
    catch (error) {
        console.error("Error parsing locale date:", error);
        return null;
    }
}
/** Usage: parseToEnUsFormat("2025/4/18", "ja-JP")
 * converts a date from the "ja-JP" format ("2025/4/18") to the "en-US" format ("4/18/2025")
 * for validUserInput validation. */
function parseToEnUsFormat(date, locale, formatOptions) {
    const parsed = parseLocaleDate(date, locale, formatOptions);
    if (parsed) {
        return Intl.DateTimeFormat("en-US").format(parsed);
    }
    return null;
}
function getMinDate(minDate) {
    if (minDate !== undefined) {
        if (minDate === 0 || parseDate(minDate)) {
            return new Date(minDate);
        }
    }
    return null;
}
function getMaxDate(maxDate) {
    if (maxDate !== undefined) {
        if (parseDate(maxDate)) {
            return new Date(maxDate);
        }
    }
    return null;
}
function formatInput(value, self) {
    const { locale } = self;
    if (!isValidDate(value, self)) {
        return value;
    }
    let formattedDate;
    switch (locale.toLocaleLowerCase()) {
        case "ko":
            formattedDate = formatDate(value, "ko", LONG_DATE_OPTIONS);
            break;
        case "ja":
            formattedDate = formatDate(value, "ja", LONG_DATE_OPTIONS);
            break;
        case "zh":
        case "zh-cn":
            formattedDate = formatDate(value, "zh-CN", LONG_DATE_OPTIONS);
            break;
        default: {
            let _value = value;
            if (self.customFormat) {
                _value = self.reConstructDate(value);
            }
            formattedDate = formatDate(_value, "en-US", ENGLISH_FORMAT_OPTIONS);
        }
    }
    return formattedDate;
}
function getDateFormat(self) {
    const { locale, format, firstDay, i18n } = self;
    const applyLocaleDateConfig = (displayLocale) => {
        if (!format) {
            self.format = getFormatPattern(displayLocale);
        }
        const _i18n = getLocalizedDateConfig(displayLocale);
        if (self.i18n) {
            for (const prop in self.i18n) {
                if (_i18n[prop]) {
                    _i18n[prop] = self.i18n[prop];
                }
                else {
                    self.i18n[prop] = _i18n[prop];
                }
            }
        }
        else {
            self.i18n = _i18n;
        }
        if (!firstDay) {
            self.firstDay = getFirstDayOfWeek(displayLocale);
        }
    };
    switch (locale.toLocaleLowerCase()) {
        case "ko":
            applyLocaleDateConfig("ko");
            break;
        case "ja":
            applyLocaleDateConfig("ja");
            break;
        case "zh":
        case "zh-cn":
            applyLocaleDateConfig("zh-CN");
            break;
        default:
            if (locale && !locale.toLowerCase().includes("en")) {
                return;
            }
            if (!format) {
                self.format = "MM/DD/YYYY";
            }
            if (!i18n) {
                self.i18n = Object.assign({}, DEFAULT_EN_I18N);
            }
            if (!firstDay) {
                self.firstDay = 0;
            }
    }
}
function getEnFormat(self) {
    if (!self.format) {
        self.format = "MM/DD/YYYY";
    }
    const _i18n = Object.assign({}, DEFAULT_EN_I18N);
    if (self.i18n) {
        for (const prop in self.i18n) {
            if (_i18n[prop]) {
                _i18n[prop] = self.i18n[prop];
            }
        }
    }
    self.i18n = _i18n;
    if (!self.firstDay) {
        self.firstDay = 0;
    }
}
const setDateInFormat = (date) => {
    if (!(date instanceof Date) || !Number.isNaN(date.getTime())) {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }
    return date;
};
const onSelectFn = (self, date) => {
    var _a, _b;
    const { calendar, time, locale, _locale } = self;
    self.error = false;
    self.onSelectFromCalendar = true;
    let startDate = time ? self.timePicker.value : self.inputStart.value;
    let endDate = time ? self.timePickerEnd.value : self.inputEnd.value;
    if (!_locale &&
        locale &&
        !locale.includes("en") &&
        !startDate.includes("/")) {
        /** Change from 2025년 5월 15일 to 2025/5/15 */
        startDate = swapDateFormat(startDate);
        endDate = swapDateFormat(endDate);
    }
    calendar.draw();
    if (startDate && endDate) {
        self.dateString = [
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString(),
        ];
    }
    else if (startDate) {
        self.dateString = [new Date(startDate).toISOString(), ""];
    }
    else {
        self.dateString = ["", new Date(date).toISOString()];
    }
    if (!self.timePanel) {
        if (self.value === self.dateString) {
            return;
        }
        self.value = self.dateString;
    }
    else {
        self.calendarDaySelected = true;
    }
    self.hbrChange.emit({
        isValid: self.isValid,
        value: self.dateString,
        focused: self.focusedInput,
        date: ((_a = self.dateString) === null || _a === void 0 ? void 0 : _a.length) === 2 ? [startDate, endDate] : undefined,
        utc: ((_b = self.dateString) === null || _b === void 0 ? void 0 : _b.length) === 2
            ? [new Date(startDate).toUTCString(), new Date(endDate).toUTCString()]
            : undefined,
    });
    self.isValid = true;
};
const initConfig = (self) => {
    var _a, _b;
    const { i18n, firstDay, format, showMonthAfterYear, _locale } = self;
    let isYearBeforeMonth;
    if (!format) {
        const langCode = _locale || navigator.language || document.documentElement.lang;
        const formatter = new Intl.DateTimeFormat(langCode);
        const showFormat = formatter.format();
        const firstFourDigit = showFormat.slice(0, 4);
        if (typeof Number(firstFourDigit) === "number") {
            isYearBeforeMonth = true;
        }
    }
    let config = {
        minDate: getMinDate(self.minDate),
        maxDate: getMaxDate(self.maxDate),
        numberOfMonths: self.range ? 2 : 1, //we can add numberOfMonths prop if needed in the future
        i18n,
        firstDay,
        showMonthAfterYear: !showMonthAfterYear
            ? format
                ? format[0].toLocaleLowerCase() === "y"
                : isYearBeforeMonth
            : showMonthAfterYear,
        keyboardInput: false,
        yearRange: self.yearRange,
    };
    if (self.showDaysInNextAndPreviousMonths) {
        config.showDaysInNextAndPreviousMonths =
            self.showDaysInNextAndPreviousMonths;
    }
    if (self.calendarStyle) {
        config.calendarStyle = self.calendarStyle;
    }
    if (self.range) {
        if ((_a = self.inputStart) === null || _a === void 0 ? void 0 : _a.value) {
            config.startRange = setDateInFormat(self.inputStart.value);
        }
        else if (self.value) {
            config.startRange = setDateInFormat(self.value[0]);
        }
        if ((_b = self.inputEnd) === null || _b === void 0 ? void 0 : _b.value) {
            config.endRange = setDateInFormat(self.inputEnd.value);
        }
        else if (self.value) {
            config.endRange = setDateInFormat(self.value[1]);
        }
        config = Object.assign(Object.assign({}, config), { mainCalendar: self.mainCalendar || "left", onSelect: (date) => onSelectFn(self, date) });
    }
    else {
        if (!self.error && self.value) {
            config.defaultDate = setDateInFormat(self.value);
            config.setDefaultDate = true;
        }
        config.onSelect = (date, calendar) => {
            self.error = false;
            if (calendar) {
                self.onSelectFromCalendar = true;
            }
            const timepicker = self.time;
            if (timepicker && !self.error) {
                const timeValue = self.value;
                if (timeValue) {
                    date.setHours(new Date(timeValue).getHours());
                    date.setMinutes(new Date(timeValue).getMinutes());
                    date.setSeconds(new Date(timeValue).getSeconds());
                }
            }
            self.dateString = date.toISOString();
            if (!self.timePanel) {
                if (self.value === self.dateString) {
                    return;
                }
                self.value = self.dateString;
            }
            if (!self.timePanel) {
                if (self._locale) {
                    /** make sure to render in locale format */
                    self.input.value = Intl.DateTimeFormat(self._locale).format(date);
                }
                else {
                    self.input.value = formatDate(date, "en-US", ENGLISH_FORMAT_OPTIONS);
                }
            }
            else {
                self.calendarDaySelected = true;
            }
            if (timepicker)
                self.timePicker.value = new Date(date);
            self.isValid = true;
            if (!self.timePanel) {
                self.hbrChange.emit({
                    isValid: self.isValid,
                    value: self.dateString, //returns ISOString
                    focused: self.focusedInput,
                    utc: date.toUTCString(), // returns UTCString
                    date: date, // returns date in Date object
                });
            }
        };
    }
    return config;
};

const datePickerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-color:var(--base-text-default);--label-error-color:var(--base-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--asterisk-color:var(--negative-text-default);--asterisk-margin:0px 0px 0px 4px;--asterisk-font-weight:var(--hbr-font-weight-semibold, 600);--help-text-align-text:left;--help-text-align:var(--help-text-align-text, end);--input-max-width:176px;--input-small-max-width:160px;--input-large-max-width:192px;--input-bg-color:var(--control-bg-weak-default);--panel-border-width:2px;--panel-border-color:var(--control-border-default);--panel-border-color-hover:var(--control-border-hover);--panel-border-color-disabled:var(--control-border-disabled);--dropdown-panel-bg-color:var(--control-bg-weak-default);--disabled-bg-color:var(--control-bg-weak-disabled);--disabled-text-color:var(--base-text-disabled);--icon-color-disabled:var(--control-icon-weak-disabled);--border-color-error:var(--negative-border-medium-active);--timePanel-footer-border-top-color:var(--control-border-weak-default);--timePanel-footer-bg-color:var(--control-bg-weak-default);--button-color-selected:var(--interact-text-in-default);--picker-border:var(--hbr-border-width) solid var(--control-border-default);--picker-bg-color:var(--control-bg-weak-default);--picker-header-color:var(--base-text-medium-default);--header-color:var(--base-text-default);--picker-button-border:2px solid var(--control-border-default);--picker-color-button-bg-hover:var(--interact-bg-weak-hover);--picker-color-button-color-hover:var(--interact-text-hover);--picker-button-border-disabled:var(--hbr-border-width) solid var(--control-border-disabled);--picker-button-bg-disabled:var(--control-bg-disabled);--picker-button-color-disabled:var(--control-icon-strong-disabled);--picker-button-bg-selected:var(--control-bg-strong-default);--picker-button-color-selected:var(--interact-text-in-default);--picker-panel-min-width:274px;--picker-panel-width:274px}.date-picker--popover{display:flex;height:fit-content}.date-picker--popover hbr-dropdown{--panel-border:var(--hbr-border-width) solid var(--panel-border-color);--trigger-padding:0px;--trigger-background-color:var(--dropdown-trigger-bg-color)}.date-picker--popover hbr-dropdown hbr-menu{--padding:0px;--border-radius:0px}.date-picker--popover hbr-dropdown::part(panel){background-color:var(--dropdown-panel-bg-color)}.date-picker--popover hbr-input::part(base error){box-shadow:none}.date-picker--popover.date-picker--large:not(.range-picker):not(.time-picker) hbr-input::part(input){margin-left:14px;margin-right:12px}.date-picker--popover.date-picker--large:not(.range-picker):not(.time-picker) hbr-icon-button.calendar-icon{--padding:0;font-size:20px;height:22px;margin-right:14px}.date-picker--popover.date-picker--small:not(.range-picker):not(.time-picker) hbr-input.hbr-range-start::part(input),.date-picker--popover.date-picker--small:not(.range-picker):not(.time-picker) hbr-input.hbr-range-end::part(input){margin:0 var(--hbr-control-spacing-md)}.date-picker--popover.date-picker--small:not(.range-picker):not(.time-picker) hbr-input.hbr-range-start::part(input){margin:0 var(--hbr-control-spacing-sm) 0 6px}.date-picker--popover.date-picker--small:not(.range-picker):not(.time-picker) .range--suffix-arrow-right-icon,.date-picker--popover.date-picker--small:not(.range-picker):not(.time-picker) .range--suffix-calendar-icon{font-size:14px}.date-picker--popover.range-picker,.date-picker--popover.time-picker{width:fit-content}.date-picker--popover.range-picker hbr-dropdown hbr-input::part(base),.date-picker--popover.time-picker hbr-dropdown hbr-input::part(base){overflow:visible}.date-picker--popover.range-picker.date-picker--disabled,.date-picker--popover.time-picker.date-picker--disabled{background-color:var(--disabled-bg-color);color:var(--disabled-text-color);cursor:not-allowed}.date-picker--popover.range-picker.date-picker--disabled hbr-dropdown::part(base),.date-picker--popover.time-picker.date-picker--disabled hbr-dropdown::part(base){pointer-events:none}.date-picker--popover.range-picker.date-picker--has-help-text,.date-picker--popover.time-picker.date-picker--has-help-text{position:relative}.date-picker--popover.range-picker .date-picker__help-text,.date-picker--popover.time-picker .date-picker__help-text{position:absolute;bottom:calc(-1 * (var(--hbr-control-height-md) / 2 + 2px));right:0;font-weight:var(--hbr-font-weight-normal);display:block;color:var(--base-text-medium-default);width:100%;display:block;text-align:var(--help-text-align)}.date-picker--popover.range-picker.date-picker--medium .date-picker__help-text,.date-picker--popover.time-picker.date-picker--medium .date-picker__help-text{font-size:var(--help-text-font-size-medium)}.date-picker--popover.range-picker.date-picker--small .date-picker__help-text,.date-picker--popover.time-picker.date-picker--small .date-picker__help-text{font-size:var(--help-text-font-size-small)}.date-picker--popover.range-picker.date-picker--large .date-picker__help-text,.date-picker--popover.time-picker.date-picker--large .date-picker__help-text{font-size:var(--help-text-font-size-large)}.date-picker--popover.range-picker hbr-dropdown::part(prefix),.date-picker--popover.range-picker hbr-dropdown::part(suffix){display:none}.date-picker--popover.range-picker.range-picker--outline .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline .range--suffix-calendar-icon{font-size:var(--hbr-font-size-md)}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-input::part(base){height:36px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-input::part(input){font-size:var(--hbr-font-size-md)}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-dropdown>hbr-input.hbr-range-start{margin-right:36px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-dropdown>hbr-input{margin-right:42px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-input.hbr-range-start::part(input){margin:0 16px 0 14px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large hbr-input.hbr-range-end::part(input){margin-left:16px;margin-right:16px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline.date-picker--large .range--suffix-calendar-icon{font-size:20px;height:22px;display:flex;align-items:center}.date-picker--popover.range-picker.range-picker--outline.date-picker--large .range--suffix-arrow-right-icon{margin-right:8px;left:140px}.date-picker--popover.range-picker.range-picker--outline.date-picker--large .range--suffix-calendar-icon{margin-right:12px;right:-42px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium hbr-input::part(input){max-width:var(--range-input-max-width, 140px);font-size:var(--hbr-font-size-sm)}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium hbr-input.hbr-range-start::part(input){margin:0 10px 0 8px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium hbr-input.hbr-range-end::part(input){margin:0 10px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium hbr-dropdown>hbr-input.hbr-range-start{margin-right:28px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium hbr-dropdown>hbr-input.hbr-range-end{margin-right:32px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline.date-picker--medium .range--suffix-calendar-icon{font-size:16px;height:20px;display:flex;align-items:center}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium .range--suffix-arrow-right-icon{left:118px;margin-right:6px}.date-picker--popover.range-picker.range-picker--outline.date-picker--medium .range--suffix-calendar-icon{right:-37px;margin-right:13px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-input::part(base){height:24px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-input.hbr-range-start::part(input){margin:0 6px 0 4px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-input.hbr-range-end::part(input){margin:0 6px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-input::part(input).hbr-range-start{margin-left:var(--hbr-spacing-2xs)}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-input::part(input){max-width:var(--range-input-max-width-sm, 121px);font-size:var(--hbr-font-size-xs)}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-dropdown>hbr-input.hbr-range-start{margin-right:24px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small hbr-dropdown>hbr-input.hbr-range-end{margin-right:26px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline.date-picker--small .range--suffix-calendar-icon{font-size:var(--hbr-font-size-sm);height:18px;display:flex;align-items:center}.date-picker--popover.range-picker.range-picker--outline.date-picker--small .range--suffix-arrow-right-icon{left:96px;margin-right:4px}.date-picker--popover.range-picker.range-picker--outline.date-picker--small .range--suffix-calendar-icon{right:-28px;margin-right:6px;padding-left:4px}.date-picker--popover.range-picker.range-picker--outline{border:var(--hbr-control-border-width) solid var(--panel-border-color, var(--control-border-default));border-radius:var(--hbr-border-radius-md)}.date-picker--popover.range-picker.range-picker--outline:not(.range-picker--focused):not(.date-picker--disabled):not(.date-picker--error):hover{border-color:var(--panel-border-color-hover)}.date-picker--popover.range-picker.range-picker--outline.date-picker--disabled{border-color:var(--panel-border-color-disabled)}.date-picker--popover.range-picker.range-picker--outline.date-picker--disabled .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline.date-picker--disabled .range--suffix-calendar-icon{color:var(--icon-color-disabled)}.date-picker--popover.range-picker.range-picker--outline.date-picker--error,.date-picker--popover.range-picker.range-picker--outline.date-picker--error:hover{border-color:var(--border-color-error)}.date-picker--popover.range-picker.range-picker--outline.date-picker--error{box-shadow:0 0 0 var(--hbr-focus-ring-width) #f9ded9}.date-picker--popover.range-picker.range-picker--outline .range--suffix-arrow-right-icon,.date-picker--popover.range-picker.range-picker--outline .range--suffix-calendar-icon{color:var(--interact-icon-medium-default);position:absolute}.date-picker--popover.range-picker.range-picker--outline hbr-input:not([data-focused=true])::part(base){border-color:transparent}.date-picker--popover.range-picker.range-picker--outline hbr-input[data-focused=true]::part(base){outline:2px solid var(--control-border-active);border-color:transparent;box-shadow:0px 0px 0px 4px rgba(62, 132, 229, 0.2)}.date-picker--popover.range-picker.range-picker--outline hbr-dropdown::part(panel){width:var(--calendar-panel-width, 556px)}.date-picker--popover.range-picker.range-picker--outline hbr-input::part(base){height:calc(var(--height-medium) - 2px)}.date-picker--popover.range-picker.range-picker--outline hbr-input::part(form-control){border-radius:var(--hbr-border-radius-md)}.date-picker--popover.time-picker .suffix-hbr-time-start,.date-picker--popover.time-picker .suffix-hbr-time-end{color:var(--base-text-weak-default);position:absolute}.date-picker--popover.time-picker hbr-time-picker::part(input){width:60px}.date-picker--popover.time-picker{display:flex}.date-picker--popover.time-picker hbr-time-picker::part(base){margin-left:4px}.date-picker--popover.time-picker .date-picker__panel-time{display:flex;align-items:flex-start}.date-picker--popover.time-picker{position:relative}.date-picker--popover.time-picker hbr-dropdown>hbr-input{margin-right:154px}.date-picker--popover.time-picker hbr-dropdown>hbr-input[size=large]{margin-right:218px}.date-picker--popover.time-picker hbr-time-picker{position:absolute;bottom:0}.date-picker--popover.time-picker hbr-time-picker.hbr-time-start{left:136px}.date-picker--popover.time-picker hbr-time-picker.hbr-time-end{right:14px}.date-picker--popover.time-picker hbr-time-picker[size=small].hbr-time-start{left:107px}.date-picker--popover.time-picker hbr-time-picker[size=small].hbr-time-end{right:39px}.date-picker--popover.time-picker hbr-time-picker[size=large].hbr-time-start{left:174px}.date-picker--popover.time-picker hbr-time-picker[size=large].hbr-time-end{right:20px}.date-picker--popover.time-panel{--column-menu-width:60px;--column-left-border-color:var(--control-border-weak-default);--column-left-border-not-first-type:1px solid var(--column-left-border-color);--column-header-justify-content:flex-start;--column-header-font-weight:var(--hbr-font-weight-semibold, 600);--column-header-border-bottom:1px solid var(--column-left-border-color);--column-header-color:var(--base-text-medium-default);--column-header-padding:var(--hbr-spacing-xs, 8px) var(--hbr-spacing-sm, 12px) var(--hbr-spacing-2xs, 4px);-column-menu-item-padding:0px;--column-item-text-color:var(--base-text-default);--column-item-text-width:60px;--column-item-text-padding:8px 12px;--column-item-text-justify-content:flex-start;--panel-footer-font-weight:var(--hbr-font-weight-bold);position:relative}.date-picker--popover.time-panel .date-picker__timePanel{display:flex;align-items:flex-start;justify-content:space-between}.date-picker--popover.time-panel .time-panel__panel-body{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;border-top-left-radius:var(--hbr-border-radius-md);overflow:hidden;z-index:1}.date-picker--popover.time-panel .time-panel__panel-body ::slotted(hbr-time-panel){max-height:var(--time-panel-max-height, 342px);--column-item-text-padding:8px 12px}.date-picker--popover.time-panel .time-panel__panel-footer{position:absolute;box-sizing:border-box;display:flex;flex-direction:row;justify-content:flex-end;margin-left:auto;align-items:center;height:50px;padding:8px;border-top:1px solid var(--timePanel-footer-border-top-color);bottom:calc(var(--panel-border-width) - 1px);width:calc(100% - var(--panel-border-width) * 2);background:var(--timePanel-footer-bg-color);border-bottom-right-radius:var(--hbr-border-radius-md);border-bottom-left-radius:var(--hbr-border-radius-md);z-index:2}.date-picker--popover.time-panel hbr-time-panel{--column-menu-width:none;--column-header-color:var(--interact-text-weak-default);--column-left-border-first-type:1px solid var(--timePanel-footer-border-top-color);max-height:var(--time-panel-max-height, 377px);--column-left-border-color:var(--timePanel-footer-border-top-color);--menu-margin-bottom:85px}.date-picker--popover.time-panel hbr-dropdown{--panel-max-height:var(--dropdown-panel-max-height, 380px)}.date-picker--popover:not(.range-picker--outline).range-picker:not(.time-picker) hbr-input.hbr-range-start{margin-right:var(--hbr-spacing-md)}.date-picker--popover:not(.range-picker--outline).range-picker:not(.time-picker) hbr-input[size=small].hbr-range-start{margin-right:var(--hbr-spacing-sm)}.date-picker--popover:not(.range-picker--outline).range-picker:not(.time-picker) hbr-input[size=large].hbr-range-start{margin-right:36px}.date-picker--popover.date-picker--disabled hbr-icon-button.calendar-icon{--color:var(--control-icon-weak-disabled)}.date-picker--popover hbr-icon-button.calendar-icon{--padding:0}.date-picker--popover hbr-input{--border-width:var(--hbr-border-width);--box-bg-color:var(--input-bg-color)}.date-picker--popover hbr-input::part(input){max-width:var(--input-max-width)}.date-picker--popover hbr-input[size=small]::part(input){max-width:var(--input-small-max-width)}.date-picker--popover hbr-input[size=large]::part(input){max-width:var(--input-large-max-width)}.date-picker--popover slot[name=prefix]{margin-left:0}.date-picker--popover slot[name=prefix] ::slotted(*){margin-left:var(--spacing-small)}.range-picker--outline-label{font-weight:var(--hbr-control-font-weight-label, 600);display:flex;align-items:center;margin-bottom:var(--hbr-spacing-2xs)}.range-picker--outline-label.range-picker--outline-label--small{font-size:var(--label-font-size-small, 12px)}.range-picker--outline-label.range-picker--outline_label--medium{font-size:var(--label-font-size-medium, 14px)}.range-picker--outline-label.range-picker--outline-label--large{font-size:var(--label-font-size-large, 16px)}.form-control--has-help-text{text-align:var(--help-text-align)}.form-control--has-help-text .date-picker__help-text{display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .date-picker__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.error{color:var(--help-text-color-error, var(--negative-text-default));font-weight:var(--hbr-font-weight-normal)}.date-picker--popover.picker-view hbr-dropdown::part(panel){--panel-box-shadow:none;--panel-border-radius:var(--hbr-border-radius-md);--panel-border:none;box-shadow:none}.date-picker--popover.picker-view.range-picker hbr-dropdown::part(panel){min-width:var(--picker-panel-min-width);width:var(--picker-panel-width)}.date-picker__panel hbr-calendar{--border:none;--picker-border:none}.month-view hbr-dropdown::part(panel),.year-view hbr-dropdown::part(panel){min-width:var(--calendar-panel-min-width, 250px);--calendar-panel-width:var(--picker-panel-width, 274px)}:host([range][variant=outline]){--dropdown-trigger-bg-color:var(--control-bg-weak-default)}:host([range][variant=outline][disabled]){--dropdown-trigger-bg-color:var(--disabled-bg-color)}.date-picker__help-text,hbr-input::part(help-text){--help-text-font-size-small:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-md)}.date-picker--dropdown::part(panel){box-shadow:var(--hbr-shadow-sm, 0 2px 5px rgba(0, 0, 0, 0.05));border-color:var(--control-border-default)}:host-context([data-theme=onecd]) .date-picker--popover hbr-input{--border-width:var(--onecd-border-width-default)}:host-context([data-theme=onecd]) .date-picker--popover hbr-dropdown{--panel-border:var(--onecd-border-width-default) solid var(--panel-border-color)}";
const HbrDatePickerStyle0 = datePickerCss;

let id = 0;
const DatePicker = /*@__PURE__*/ proxyCustomElement(class DatePicker extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.hbrCalendarTitleKeydown = createEvent(this, "hbr-calendar-title-keydown", 7);
        this.inputId = `date-picker-${++id}`;
        this.labelId = `date-picker-label-${id}`;
        this._helpTextId = `date-picker-helpTextId-${id}`;
        this.defaultAria = {
            role: "dialog",
            label: "Choose Date",
            modal: true,
            level: 3,
            prevYear: "Previous Year",
            nextYear: "Next Year",
            prevMonth: "Previous Month",
            nextMonth: "Next Month",
        };
        this.isValid = true;
        this.handleFocusout = (event) => {
            const { range } = this;
            const { target } = event;
            this.error = false;
            if (!range) {
                this.hbrBlur.emit();
            }
            this.hasFocus = false;
            if (!this.onSelectFromCalendar) {
                const { value } = target;
                let _value = target.value;
                let parsedEnDate;
                if (value) {
                    if (this._locale && !this._locale.includes("en")) {
                        /** Usage: parseToEnUsFormat("2025/4/18", "ja-JP")
                         * converts a date from the "ja-JP" format ("2025/4/18") to the "en-US" format ("4/18/2025")
                         * for validUserInput validation. */
                        parsedEnDate = parseToEnUsFormat(value, this._locale);
                        if (parsedEnDate && this.dateString) {
                            if (this.dateString === parsedEnDate) {
                                return;
                            }
                        }
                    }
                    else if (!this._locale &&
                        this.locale &&
                        !this.locale.includes("en") &&
                        !value.includes("/")) {
                        //set by the browserLanguage()
                        const updated = swapDateFormat(value);
                        parsedEnDate = parseToEnUsFormat(updated, this.locale);
                    }
                    _value = !valueValidDate(parsedEnDate || value)
                        ? new Date(parsedEnDate || value)
                        : parsedEnDate || value;
                    if (!valueValidDate(_value) || !validUserInput(parsedEnDate || value)) {
                        this.hbrChange.emit({
                            isValid: false,
                            value: value,
                            focused: this.focusedInput,
                        });
                        this.error = true;
                        return;
                    }
                }
                else {
                    if (this.cleared) {
                        this.hbrChange.emit({
                            isValid: this.error ? false : true,
                            value: value,
                            focused: this.focusedInput,
                        });
                        this.cleared = undefined;
                    }
                }
                if (!range) {
                    return;
                }
                /** check if value has changed to avoid unnecessary re-rendering */
                const rangeStart = range && target.classList.contains("hbr-range-start");
                const valueChanged = this.valueChanged(_value, rangeStart);
                const dateNotFormatted = _value.includes("/") || _value.includes("-") || _value.includes(".");
                const noChange = !valueChanged && !dateNotFormatted; //should update to natural language if value is same but format change only
                if (noChange) {
                    return;
                }
                this.handleValidation(event);
            }
        };
        this.handleInput = (event) => {
            event.stopPropagation();
        };
        this.handleDateChange = (event) => {
            var _a;
            /** Maybe we should not set value until ok button is clicked if timePanel is set to true */
            const { date, event: { key }, } = event.detail;
            if (this.range) {
                const { startRange, endRange } = this.config;
                const startRangeUpdated = !this.focusedInput || this.focusedInput === "start";
                const time = date.getTime();
                /** updates */
                const updateStartRange = () => {
                    if (this._locale) {
                        this.inputStart.value = Intl.DateTimeFormat(this._locale).format(date);
                    }
                    else {
                        this.inputStart.value = formatInput(date.toDateString(), this);
                    }
                    if (typeof this.dateString === "object") {
                        this.dateString = [date.toISOString(), this.dateString[1]];
                    }
                    this.config = Object.assign(Object.assign({}, this.config), { startRange: date });
                    this.calendar.setStartRange(date);
                };
                const updateEndRange = () => {
                    if (this._locale) {
                        this.inputEnd.value = Intl.DateTimeFormat(this._locale).format(date);
                    }
                    else {
                        this.inputEnd.value = formatInput(date.toDateString(), this);
                    }
                    if (typeof this.dateString === "object") {
                        this.dateString = [this.dateString[0], date.toISOString()];
                    }
                    this.config = Object.assign(Object.assign({}, this.config), { endRange: date });
                    this.calendar.setEndRange(date);
                };
                /****************************************************************/
                if (startRange &&
                    endRange &&
                    (time === startRange.getTime() || time === endRange.getTime())) {
                    return;
                }
                if (startRangeUpdated) {
                    if (endRange && time > endRange.getTime()) {
                        updateEndRange();
                        this.inputEnd.setFocus();
                    }
                    else {
                        updateStartRange();
                        this.inputEnd.setFocus();
                    }
                }
                else {
                    if (startRange && time < startRange.getTime()) {
                        updateStartRange();
                        this.inputEnd.setFocus();
                    }
                    else {
                        updateEndRange();
                        this.inputEnd.setFocus();
                    }
                }
                this.calendar.setDate(date);
            }
            else {
                if (!this.timePanel) {
                    if (this._locale) {
                        this.input.value = Intl.DateTimeFormat(this._locale).format(date);
                    }
                    else {
                        this.input.value = formatInput(date.toDateString(), this);
                    }
                    if (!this.onSelectFromCalendar) {
                        this.dropdown.hide();
                        this.open = false;
                    }
                }
                this.dateString = date.toISOString();
                this.calendar.setDate(date);
                if (key) {
                    (_a = this.input) === null || _a === void 0 ? void 0 : _a.setFocus();
                }
                //calendar closes when date is selected in single calendar
                this.open = false;
            }
        };
        this.handleDayKeydown = (event) => {
            const { key } = event.detail;
            if (key === "Escape") {
                event.stopPropagation();
                event.preventDefault();
                setTimeout(() => {
                    var _a;
                    this.open = false;
                    (_a = this.calendarIconRef) === null || _a === void 0 ? void 0 : _a.setFocus();
                }, 100);
                return;
            }
            if (key === "tab") {
                if (this.timePanelRef) {
                    event.stopPropagation();
                    event.preventDefault();
                    const menu = this.timePanelRef.shadowRoot.querySelector("hbr-menu");
                    this.focusMenuItemKeyboard(menu);
                }
            }
        };
        this.handleCalendarTitleKeydown = (event) => {
            var _a, _b;
            const { key, target, nextElementSibling } = event.detail;
            if (this.timePanel) {
                if (key === "shift" && target === "prevYear" && nextElementSibling) {
                    const panel = event.target.closest(".date-picker__panel");
                    const okButton = panel === null || panel === void 0 ? void 0 : panel.querySelector("slot[name='panel-footer'] hbr-button");
                    if (okButton) {
                        if (okButton.disabled) {
                            const activeItems = (_b = (_a = this.timePanelRef) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelectorAll("[tabindex='0']");
                            if (activeItems === null || activeItems === void 0 ? void 0 : activeItems.length) {
                                const activeItemArray = Array.from(activeItems);
                                const activeItem = activeItemArray[activeItemArray.length - 1];
                                activeItem.setFocus();
                            }
                            else {
                                const activeDayButton = this.calendar.shadowRoot.querySelector("[tabindex='0']");
                                activeDayButton === null || activeDayButton === void 0 ? void 0 : activeDayButton.setFocus();
                            }
                        }
                        else {
                            okButton.setFocus();
                        }
                    }
                    else {
                        this.hbrCalendarTitleKeydown.emit({
                            event,
                            key: "shift",
                            target: "prevYear",
                            nextElementSibling,
                        });
                    }
                }
            }
            else {
                this.hbrCalendarTitleKeydown.emit({
                    event,
                    key: "shift",
                    target: "prevYear",
                    nextElementSibling,
                });
            }
        };
        this.handleHbrChange = (event) => {
            event.stopPropagation();
            const target = event.target;
            const { value } = target;
            if (value && !valueValidDate(value)) {
                this.isValid = false;
                return;
            }
            this.isValid = true;
            this.error = false;
            if (this.input.value) {
                this.dateString = new Date(this.input.value).toISOString();
                this.calendar.setDate(new Date(this.input.value));
            }
            else {
                this.dateString = "";
                this.calendar.clear();
                this.cleared = true;
            }
        };
        this.handleInputStartChange = (event) => {
            event.stopPropagation();
            const target = event.target;
            this.inputStart.value = target.value;
            if (typeof this.dateString === "object") {
                const valid = valueValidDate(this.inputStart.value);
                if (!valid) {
                    this.error = true;
                    return;
                }
                /** update calendar when start date got updated by user input */
                if (this.inputStart.value) {
                    this.calendar.setStartRange(new Date(this.inputStart.value));
                }
                else {
                    this.calendar.setStartRange(null);
                }
                this.dateString[0] = new Date(this.inputStart.value).toISOString();
            }
        };
        this.handleInputEndChange = (event) => {
            event.stopPropagation();
            const target = event.target;
            this.inputEnd.value = target.value;
            if (typeof this.dateString === "object") {
                const valid = valueValidDate(this.inputEnd.value);
                if (!valid) {
                    this.error = true;
                    return;
                }
                /** update calendar when end date got updated by user input */
                if (this.inputEnd.value) {
                    this.calendar.setEndRange(new Date(this.inputEnd.value));
                }
                else {
                    this.calendar.setEndRange(null);
                }
                this.dateString[1] = new Date(this.inputEnd.value).toISOString();
            }
        };
        this.handleKeyup = (event) => {
            var _a;
            const { key, target } = event;
            if (key === "Enter") {
                if ((_a = target === null || target === void 0 ? void 0 : target.classList) === null || _a === void 0 ? void 0 : _a.contains("calendar-icon")) {
                    this.handleClick(event);
                }
                else {
                    if (this.range && !target.value) {
                        this.dropdown.open = true;
                        setTimeout(() => {
                            let focusDay;
                            if (this.calendar) {
                                const activeDay = this.calendar.shadowRoot.querySelector(".is-selected > button");
                                if (activeDay) {
                                    focusDay = activeDay;
                                }
                                else {
                                    const today = this.calendar.shadowRoot.querySelector(".is-today > button");
                                    if (today) {
                                        focusDay = today;
                                    }
                                }
                                if (focusDay) {
                                    focusDay.focus();
                                }
                                else {
                                    const firstActive = this.calendar.shadowRoot.querySelector("[tabindex='0']");
                                    if (firstActive) {
                                        firstActive.focus();
                                    }
                                }
                            }
                        });
                    }
                    this.handleValidation(event);
                }
            }
            else if (key === "Escape") {
                event.stopPropagation();
                event.preventDefault();
                setTimeout(() => {
                    this.open = false;
                    this.dropdown.open = false;
                }, 100);
                return;
            }
        };
        this.handleKeydown = (event) => {
            event.stopPropagation();
        };
        this.setInputValue = (value) => {
            if (!this.range) {
                this.input.value = value;
            }
            else {
                this.inputStart.value = value[0];
                this.inputEnd.value = value[1];
            }
        };
        this.setTimeValue = (value) => {
            if (!this.range) {
                this.timePicker.value = value;
            }
            else {
                this.timePicker.value = value[0];
                this.timePickerEnd.value = value[1];
            }
        };
        this.convertToISOString = (date, setToStartOfDay) => {
            if (!date) {
                return;
            }
            const _date = new Date(date);
            if (setToStartOfDay) {
                _date.setHours(0, 0, 0, 0);
            }
            return _date.toISOString();
        };
        this.isDateOnly = (date) => date.getHours() === 0 &&
            date.getMinutes() === 0 &&
            date.getSeconds() === 0 &&
            date.getMilliseconds() === 0;
        this.valueChanged = (value, rangeStart) => {
            if (!value) {
                return false;
            }
            const { range } = this;
            if (range) {
                if (!value.length)
                    return true;
                if (this.value.length === 2) {
                    if (rangeStart) {
                        if (this.convertToISOString(value) === this.value[0]) {
                            return false;
                        }
                    }
                    else {
                        if (this.convertToISOString(value) === this.value[1]) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (this.convertToISOString(value) === this.value) {
                    return false;
                }
            }
            return true;
        };
        this.onValidate = (event) => {
            const { target } = event;
            const timeStart = target.classList.contains("hbr-time-start");
            const timeEnd = target.classList.contains("hbr-time-end");
            const rangeStart = target.classList.contains("hbr-range-start");
            const rangeEnd = target.classList.contains("hbr-range-end");
            const value = this.restructureValue(target, timeStart, rangeStart);
            let _value = value;
            if (timeStart) {
                _value = value[0];
            }
            else if (timeEnd) {
                _value = value[1];
            }
            else if (rangeStart) {
                _value = value[0];
            }
            else if (rangeEnd) {
                _value = value[1];
            }
            if (isEmpty(value)) {
                if (!this.range) {
                    this.setInputValue("");
                    if (this.time)
                        this.setTimeValue("");
                }
                else {
                    this.setInputValue([]);
                    if (this.time)
                        this.setTimeValue([]);
                }
                this.isValid = true;
                this.error = false;
                return true;
            }
            if (isValidDate(_value, this)) {
                if (typeof _value === "string" && (_value === null || _value === void 0 ? void 0 : _value.trim()) !== "") {
                    if (!valueValidDate(_value)) {
                        this.isValid = false;
                        return;
                    }
                    if (!this.value && !_value) {
                        return;
                    }
                    this.isValid = true;
                    this.error = false;
                    const formattedDate = formatInput(_value, this);
                    if (!this.range) {
                        this.setInputValue(formattedDate);
                        if (!this.time) {
                            this.dateString = new Date(this.input.value).toISOString();
                        }
                        else {
                            this.setTimeValue(value);
                            this.dateString = new Date(this.timePicker.value).toISOString();
                        }
                    }
                    else {
                        if (!this.time) {
                            if (this._locale) {
                                this.setInputValue([
                                    value[0]
                                        ? Intl.DateTimeFormat(this._locale).format(new Date(value[0]))
                                        : "",
                                    value[1]
                                        ? Intl.DateTimeFormat(this._locale).format(new Date(value[1]))
                                        : "",
                                ]);
                            }
                            else {
                                this.setInputValue([
                                    value[0] ? formatInput(value[0], this) : "",
                                    value[1] ? formatInput(value[1], this) : "",
                                ]);
                            }
                            let start = new Date(this.inputStart.value);
                            const localeNaturalFormat = !this._locale &&
                                this.locale &&
                                !this.locale.includes("en") &&
                                !this.inputStart.value.includes("/");
                            if (Number.isNaN(start.getTime())) {
                                if (localeNaturalFormat) {
                                    const updatedFormat = swapDateFormat(this.inputStart.value);
                                    start = new Date(updatedFormat);
                                }
                                else {
                                    return true; //let users do the validation
                                }
                            }
                            start.setHours(0, 0, 0, 0);
                            let end = new Date(this.inputEnd.value);
                            if (Number.isNaN(end.getTime())) {
                                if (localeNaturalFormat) {
                                    const updatedFormat = swapDateFormat(this.inputEnd.value);
                                    end = new Date(updatedFormat);
                                }
                                else {
                                    return true; //let users do the validation
                                }
                            }
                            end.setHours(0, 0, 0, 0);
                            this.dateString = [
                                this.inputStart.value ? start.toISOString() : "",
                                this.inputEnd.value ? end.toISOString() : "",
                            ];
                        }
                        else {
                            this.setTimeValue([
                                value[0] ? value[0] : "",
                                value[1] ? value[1] : "",
                            ]);
                            this.dateString = [
                                this.timePicker.value
                                    ? new Date(this.timePicker.value).toISOString()
                                    : "",
                                this.timePickerEnd.value
                                    ? new Date(this.timePickerEnd.value).toISOString()
                                    : "",
                            ];
                        }
                    }
                    if (this.value)
                        this.value = this.dateString;
                    return true;
                }
            }
            else {
                this.isValid = false;
                this.value = value;
                return false;
            }
        };
        this.handleTimePickerChange = (event) => {
            event.stopPropagation();
            const { target } = event;
            const timeValue = event.detail.value;
            const dateValue = this.dateString;
            if (!this.range) {
                if (timeValue && dateValue && !Array.isArray(dateValue)) {
                    if (new Date(timeValue).getTime() !== new Date(dateValue).getTime()) {
                        const updated = timeValue;
                        this.value = updated;
                        this.dateString = updated;
                    }
                }
            }
            else {
                if (timeValue && dateValue && Array.isArray(dateValue)) {
                    if (target.classList.contains("hbr-time-start")) {
                        const updated = [timeValue, dateValue[1]];
                        this.value = updated;
                        this.dateString = updated;
                    }
                    else {
                        const updated = [dateValue[0], timeValue];
                        this.value = updated;
                        this.dateString = updated;
                    }
                }
            }
        };
        this.timePickerEl = (range, value) => {
            return (h(Fragment, null, h("hbr-time-picker", { class: "hbr-time-start", ref: (ref) => {
                    this.timePicker = ref;
                }, value: range ? (value.length ? value[0] : "") : value ? value : "", size: this.size, exportparts: "\n\t\t\t\t\t\tlabel: time-picker-label, base: time-picker-base, input-base: time-picker-input-base,\n\t\t\t\t\t\tprefix: time-picker-prefix, suffix: time-picker-suffix\n\t\t\t\t\t", popOver: false, "onHbr-change": this.handleTimePickerChange }), range && (h("hbr-time-picker", { class: "hbr-time-end", ref: (ref) => {
                    this.timePickerEnd = ref;
                }, value: value.length ? value[1] : "", size: this.size, exportparts: "\n\t\t\t\t\t\t\tlabel: time-picker-label, base: time-picker-base, input-base: time-picker-input-base,\n\t\t\t\t\t\t\tprefix: time-picker-prefix, suffix: time-picker-suffix\n\t\t\t\t\t\t", popOver: false, "onHbr-change": this.handleTimePickerChange }))));
        };
        this.startDateSuffix = () => {
            var _a, _b;
            const { range, time, variant } = this;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            if (this.trigger === "calendar") {
                return (h("hbr-icon-button", { slot: "suffix", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["calendar-blank"]) || calendarBlank, class: "calendar-icon", aria: {
                        label: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.calendarLabel) ||
                            this.ariaCalendar ||
                            "Click to display calendar",
                    }, "data-testid": "calendar-icon", onKeyDown: this.handleCalendarKeydown, ref: (el) => {
                        this.calendarIconRef = el;
                    } }));
            }
            if (!range && !time && this.trigger !== "calendar") {
                return h("slot", { slot: "suffix", name: "suffix" });
            }
            if (range && variant && variant === "outline") {
                return (h("span", { slot: "suffix", class: "range--suffix-arrow-right-icon" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["arrow-right"]) || arrowRight })));
            }
        };
        this.endDateSuffix = () => {
            var _a, _b;
            const { variant } = this;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            return variant && variant === "outline" ? (h("span", { slot: "suffix", class: "range--suffix-calendar-icon" }, h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["calendar-blank"]) || calendarBlank, class: "calendar-icon", aria: {
                    label: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.rangeCalendarLabel) || "Click to show calendar",
                } }))) : !this.time ? (h("slot", { slot: "suffix-end" })) : ("");
        };
        this.getDateIdx = () => {
            const { format } = this;
            const formatArr = format.toLocaleLowerCase().split("/");
            let monthIdx;
            let dayIdx;
            let yearIdx;
            formatArr.forEach((value, i) => {
                const _value = value.toLocaleLowerCase();
                if (_value.includes("d"))
                    dayIdx = i;
                else if (_value.includes("m"))
                    monthIdx = i;
                else
                    yearIdx = i;
            });
            return { monthIdx, dayIdx, yearIdx };
        };
        this.reConstructDate = (date) => {
            let newDate;
            const { monthIdx, dayIdx, yearIdx } = this.getDateIdx();
            if (date && typeof date === "string") {
                //not until user input value exists. min/max date = 'object'
                const dateArr = date.split(/[.,\-/ ]/);
                newDate = `${dateArr[monthIdx]}/${dateArr[dayIdx]}/${dateArr[yearIdx]}`;
            }
            return newDate;
        };
        this.deConstructDate = (date) => {
            //putting back to original format when an error occurs
            if (typeof date !== "string")
                return date;
            if (Number.isNaN(Number(date[0])))
                return date;
            const dateArr = date.split("/");
            if (dateArr.length !== 3)
                return date;
            const { monthIdx, dayIdx, yearIdx } = this.getDateIdx();
            const newArr = [];
            newArr[monthIdx] = dateArr[0];
            newArr[dayIdx] = dateArr[1];
            newArr[yearIdx] = dateArr[2];
            return newArr.join("/");
        };
        this.calendarEl = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const { role, label, modal, level, prevMonth, prevYear, nextMonth, nextYear, } = this.defaultAria;
            return (h("slot", { name: "calendar" }, h("hbr-calendar", { ref: (el) => {
                    this.calendar = el;
                }, exportparts: "base:calendar-base, calendar, header, month-year, week-title, week, day", config: this.config, square: this.calendarStyle && this.calendarStyle === "square", "onHbr-day-click": this.handleDateChange, "onHbr-day-keydown": this.handleDayKeydown, "onHbr-title-keydown": this.handleCalendarTitleKeydown, "onHbr-month-view": () => {
                    this.calendarView = "month";
                }, "onHbr-year-view": () => {
                    this.calendarView = "year";
                }, "onHbr-day-view": () => {
                    this.calendarView = "day";
                }, style: this.calendarStyle && this.calendarStyle === "square"
                    ? {
                        "--title-padding": "0px 4px 12px",
                        "--range-first-title-padding": "10px 4px 12px 14px",
                        "--range-last-title-padding": "10px 14px 12px 4px",
                        "--title-title-justify-content": "center",
                        "--title-title-width": "100px",
                        "--title-text-padding-left": "0px",
                        "--title-text-padding-right": "0px",
                        "--title-gap": "var(--hbr-spacing-xs)",
                        "--title-arrows-gap": "var(--hbr-spacing-xs)",
                        "--title-year-icon-padding": "0px",
                        "--thead-padding": "4px 4px 8px",
                        "--th-line-height": "18px",
                        "--dates-container-padding-top": "4px;",
                        "--dates-container-padding-bottom": "4px;",
                    }
                    : {}, aria: {
                    role: ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.calendarRole) || role,
                    label: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.calendarLabel) || label,
                    modal: ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.calendarModal) || modal,
                    prevMonth: ((_d = this.aria) === null || _d === void 0 ? void 0 : _d.prevMonth) || prevMonth,
                    nextMonth: ((_e = this.aria) === null || _e === void 0 ? void 0 : _e.nextMonth) || nextMonth,
                    prevYear: ((_f = this.aria) === null || _f === void 0 ? void 0 : _f.prevYear) || prevYear,
                    nextYear: ((_g = this.aria) === null || _g === void 0 ? void 0 : _g.nextYear) || nextYear,
                    level: ((_h = this.aria) === null || _h === void 0 ? void 0 : _h.calendarLevel) || level,
                } })));
        };
        this.timePanelEl = () => {
            return (h("slot", { name: "time" }, h("hbr-time-panel", Object.assign({ exportparts: "base:time-panel, panel-body:time-panel-body, panel-footer: time-panel-footer,\n\t\t\t\t\tcolumn, column-header, column-menu, column-menu-base, column-menu-item, column-menu-item-text,\n\t\t\t\t\twrapper:column-wrapper, checked-icon - The container that wraps the checked icon, nested, prefix: panel-prefix,\n\t\t\t\t\tlabel: panel-label, suffix: panel-suffix, check-mark, icon-checked, trigger-gap, trigger-gap-fixed" }, this.timeConfig, { "data-testid": "time-panel", style: {
                    "--host-width": "fit-content",
                    "--column-menu-item-padding": "0px",
                }, ref: (ref) => {
                    this.timePanelRef = ref;
                }, "onHbr-menu-click": (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { type } = event.detail;
                    if (!this.timeConfig)
                        this.timeConfig = {};
                    this.timeConfig = Object.assign(Object.assign({}, this.timeConfig), { [type]: event.detail.item.value });
                } }))));
        };
        this.panelEl = () => {
            var _a, _b;
            return (h("div", { part: "panel", class: {
                    "date-picker__panel": true,
                    "date-picker__timePanel": this.timePanel,
                } }, !this.timePanel ? (this.calendarEl()) : (h(Fragment, null, h("div", { part: "panel-body", class: "time-panel__panel-body" }, this.calendarEl(), this.timePanelEl()), h("div", { part: "panel-footer", class: "time-panel__panel-footer" }, h("slot", { name: "panel-footer" }, h("hbr-button", { part: "ok-button", size: "small", onClick: this.handleOKButtonClick, disabled: !this.value && !this.calendarDaySelected, onKeyDown: this.handleOKButtonKeydown }, ((_b = (_a = this.timeConfig) === null || _a === void 0 ? void 0 : _a.i18n) === null || _b === void 0 ? void 0 : _b.ok) || "OK")))))));
        };
        this.hasFocus = false;
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasStartLabelSlot = false;
        this.hasEndLabelSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.panelOpen = false;
        this.uuid = generateShortID();
        this.dateString = "";
        this.config = {};
        this.calendarView = "day";
        this.open = false;
        this.name = undefined;
        this.hoist = undefined;
        this.variant = undefined;
        this.trigger = "input";
        this.value = "";
        this.label = "";
        this.labels = undefined;
        this.placeholder = undefined;
        this.placeholders = undefined;
        this.format = undefined;
        this.minDate = undefined;
        this.maxDate = undefined;
        this.helpText = undefined;
        this.helpTextId = "";
        this.disabled = false;
        this.required = false;
        this.error = undefined;
        this.size = "medium";
        this.range = false;
        this.time = false;
        this.timePanel = false;
        this.width = undefined;
        this.locale = undefined;
        this.i18n = undefined;
        this.aria = undefined;
        this.firstDay = undefined;
        this.showMonthAfterYear = undefined;
        this.mainCalendar = undefined;
        this.showDaysInNextAndPreviousMonths = undefined;
        this.yearRange = 10;
        this.invalid = false;
        this.calendarStyle = undefined;
        this.ariaInput = undefined;
        this.ariaCalendar = undefined;
        this.timeConfig = undefined;
        this.anchor = undefined;
        this.placement = "bottom-start";
    }
    // private calendarView = "day";
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleDisabledChange() {
        if (this.range) {
            if (this.inputStart) {
                this.inputStart.disabled = this.disabled;
                this.inputEnd.disabled = this.disabled;
            }
        }
        else {
            if (this.input)
                this.input.disabled = this.disabled;
            // (this.input as HTMLHbrInputElement).disabled = this.disabled;
        }
    }
    handleMinDateChange() {
        const min = setDateInFormat(this.minDate);
        (async () => {
            var _a;
            await ((_a = this.calendar) === null || _a === void 0 ? void 0 : _a.setMinDate(min));
        })();
    }
    handleMaxDateChange() {
        const max = setDateInFormat(this.maxDate);
        (async () => {
            var _a;
            await ((_a = this.calendar) === null || _a === void 0 ? void 0 : _a.setMaxDate(max));
        })();
    }
    handleValueChange() {
        const { calendar, value, error } = this;
        /** if value is set systematically we need to update the calendar UI */
        if (error) {
            return;
        }
        if (!this.onSelectFromCalendar) {
            if (this.range) {
                calendar === null || calendar === void 0 ? void 0 : calendar.clear();
                const startDate = value[0];
                const endDate = value[1];
                startDate
                    ? calendar.setStartRange(this.newDateFn(new Date(startDate)))
                    : calendar.setStartRange(null);
                if (endDate) {
                    calendar.setEndRange(this.newDateFn(new Date(endDate)));
                }
                else {
                    calendar.setEndRange(null);
                }
                calendar.draw();
            }
            else {
                if (value && !Array.isArray(value)) {
                    calendar === null || calendar === void 0 ? void 0 : calendar.setDate(new Date(value));
                }
                else {
                    calendar === null || calendar === void 0 ? void 0 : calendar.clear();
                }
            }
        }
    }
    handleErrorChange() {
        if (this.error) {
            this.isValid = false;
        }
    }
    handleAnchorChange() {
        /** we only accept <hbr-input> as an anchor.  */
        if (!this.anchor) {
            return;
        }
        if (this.anchorRef && this.anchorRef instanceof HTMLHbrInputElement) {
            return;
        }
        if (typeof this.anchor === "string") {
            this.anchorRef = document.querySelector(this.anchor);
        }
        else if (this.anchor instanceof HTMLHbrInputElement) {
            this.anchorRef = this.anchor;
        }
        this.input = this.anchorRef;
        this.bindEventsToAnchor();
    }
    handleLocaleChange(cur, prev) {
        this.setLocaleByLanguage = cur && !prev ? true : false;
        if (!this._locale) {
            if (!this.setLocaleByLanguage) {
                this._locale = this.locale;
            }
        }
    }
    /** Simulates a click on the input. */
    async setClick() {
        if (this.range) {
            this.inputStart.click();
        }
        else {
            this.input.click();
        }
    }
    /** Sets focus on the input. */
    async setFocus(input) {
        var _a, _b;
        (_b = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(input)) === null || _b === void 0 ? void 0 : _b.focus();
        return setTimeout(() => {
            var _a, _b;
            return (_b = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(input)) === null || _b === void 0 ? void 0 : _b.setSelectionRange(0, 0, "none");
        });
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        if (this.range) {
            return this.inputStart.reportValidity() && this.inputEnd.reportValidity();
        }
        return this.input.reportValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        if (this.range) {
            this.inputStart.setCustomValidity(message);
            this.inputEnd.setCustomValidity(message);
        }
        else {
            this.input.setCustomValidity(message);
        }
    }
    bindEventsToAnchor() {
        this.anchorRef.addEventListener("blur", this.handleFocusout);
        this.anchorRef.addEventListener("focus", this.handleFocus);
        this.anchorRef.addEventListener("change", this.handleHbrChange);
        this.anchorRef.addEventListener("keyup", this.handleKeyup);
        this.anchorRef.addEventListener("keydown", this.handleKeydown);
        this.anchorRef.addEventListener("input", this.handleInput);
        this.anchorRef.addEventListener("click", this.handleClick);
    }
    removeEventsToAnchor() {
        this.anchorRef.removeEventListener("blur", this.handleFocusout);
        this.anchorRef.removeEventListener("focus", this.handleFocus);
        this.anchorRef.removeEventListener("change", this.handleHbrChange);
        this.anchorRef.removeEventListener("keyup", this.handleKeyup);
        this.anchorRef.removeEventListener("keydown", this.handleKeydown);
        this.anchorRef.removeEventListener("input", this.handleInput);
        this.anchorRef.removeEventListener("click", this.handleClick);
    }
    connectedCallback() {
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleHbrChange = this.handleHbrChange.bind(this);
        this.handleInputStartChange = this.handleInputStartChange.bind(this);
        this.handleInputEndChange = this.handleInputEndChange.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleOKButtonClick = this.handleOKButtonClick.bind(this);
        this.handleOKButtonKeydown = this.handleOKButtonKeydown.bind(this);
        this.handleCalendarKeydown = this.handleCalendarKeydown.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
        if (this.trigger === "calendar")
            this.calendarTrigger = true;
        /** get localization setup */
        if (this.locale) {
            this._locale = this.locale;
        }
        if (!this.locale) {
            const language = browserLanguage();
            this.setLocaleByLanguage = true;
            this.locale = language;
        }
        const { format, range, value } = this;
        if (format && format !== "mm/dd/yyyy") {
            this.customFormat = true; //make sure it's not a default format
            this.placeholder = format;
            if (this.anchorRef && !this.anchorRef.placeholder) {
                this.input.placeholder = format;
            }
        }
        else if (this.locale !== "en") {
            getDateFormat(this);
        }
        else {
            getEnFormat(this);
        }
        if (range) {
            this.outlined = this.variant && this.variant === "outline";
            if (!this.dateString) {
                //initialize
                if (value === null || value === void 0 ? void 0 : value.length) {
                    if (isValidDate(value[0], this) && isValidDate(value[1], this)) {
                        this.dateString = [
                            new Date(value[0]).toISOString(),
                            new Date(value[1]).toISOString(),
                        ];
                    }
                    else {
                        this.dateString = ["", ""];
                    }
                }
                else {
                    this.dateString = ["", ""];
                }
            }
            if (!this.outlined) {
                this.labelExist =
                    this.labels &&
                        Array.isArray(this.labels) &&
                        this.labels.length &&
                        this.labels.some((item) => item !== "");
                this.errorExist = this.error && !!Object.keys(this.error).length;
            }
            else {
                this.labelExist = !!this.label;
            }
            this.placeholdersExist =
                this.placeholder && !!Object.keys(this.placeholder).length;
        }
        else {
            this.labelExist = !!this.label;
            if (value && !this.dateString && isValidDate(value, this)) {
                this.dateString =
                    typeof value === "string" && new Date(value).toISOString();
            }
        }
        this.hasHelpText = this.helpText ? true : this.hasHelpTextSlot;
        this.config = initConfig(this);
        if (this.calendarStyle && this.calendarStyle === "square") {
            this.magnetic = true;
        }
        this.handleAnchorChange();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
        if (this.anchorRef) {
            this.removeEventsToAnchor();
        }
    }
    componentDidRender() {
        const focusedInput = this.datePicker.querySelector("[data-focused='true']");
        if (focusedInput) {
            const { name } = focusedInput;
            const lastIndex = name === null || name === void 0 ? void 0 : name.lastIndexOf("-");
            this.focusedInput = lastIndex && name.slice(lastIndex + 1);
        }
    }
    componentDidUpdate() {
        /** reset */
        this.isValid = false;
        this.onSelectFromCalendar = false;
    }
    componentDidLoad() {
        if (this.value && (!this.dateString || !this.dateString.length)) {
            if (this.range && this.value.length) {
                const startDate = this.value[0];
                const endDate = this.value[1];
                if (isValidDate(startDate, this) && isValidDate(endDate, this)) {
                    this.dateString = [
                        new Date(this.value[0]).toISOString(),
                        new Date(this.value[1]).toISOString(),
                    ];
                }
            }
        }
    }
    handleFocus(event) {
        const { target } = event;
        if (target.tagName === "HBR-INPUT") {
            setTimeout(() => target.setFocus());
        }
        this.hasFocus = true;
        this.hbrFocus.emit();
    }
    handleClick(event) {
        const { target, key } = event;
        if (this.range) {
            if (this.dropdown.open) {
                this.open = true;
                // event.stopPropagation(); //Do not close
                event.stopPropagation();
                event.preventDefault();
            }
            else {
                this.open = false;
            }
            if (key === "Enter" && target.classList.contains("calendar-icon")) {
                setTimeout(() => {
                    if (this.calendar) {
                        let focusDay;
                        focusDay = this.calendar.shadowRoot.querySelector(".is-selected > button");
                        if (this.range) {
                            if (!focusDay) {
                                focusDay =
                                    this.calendar.shadowRoot.querySelector(".is-startrange > button") ||
                                        this.calendar.shadowRoot.querySelector(".is-endrange > button");
                            }
                        }
                        if (!focusDay) {
                            focusDay =
                                this.calendar.shadowRoot.querySelector(".is-today > button") ||
                                    this.calendar.shadowRoot.querySelector("[tabindex=0]");
                        }
                        if (focusDay) {
                            focusDay.focus();
                        }
                    }
                });
            }
        }
        else {
            if (this.trigger === "calendar") {
                if (!target.classList.contains("calendar-icon")) {
                    event.stopPropagation();
                }
            }
        }
    }
    focusMenuItemKeyboard(menu) {
        if (!menu)
            return;
        const checked = menu.querySelector("hbr-menu-item[checked]");
        if (checked) {
            checked.setFocus();
        }
        else {
            const menuItem = menu.querySelector("hbr-menu-item");
            menuItem.setFocus();
        }
    }
    handleSlotChange() {
        this.hasContent = hasSlot(this.host);
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasStartLabelSlot = hasSlot(this.host, "start-label");
        this.hasEndLabelSlot = hasSlot(this.host, "end-label");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
    }
    handleOKButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const date = new Date(this.dateString.toString());
        const { hour, minute, second, showSeconds } = this.timeConfig || {};
        date.setHours(Number.parseInt(hour) || 0, Number.parseInt(minute) || 0, Number.parseInt(second) || 0, 0);
        if (!hour) {
            this.timeConfig = Object.assign(Object.assign({}, this.timeConfig), { hour: "00" });
        }
        if (!minute) {
            this.timeConfig = Object.assign(Object.assign({}, this.timeConfig), { minute: "00" });
        }
        if (showSeconds && !second) {
            this.timeConfig = Object.assign(Object.assign({}, this.timeConfig), { second: "00" });
        }
        this.dateString = date.toISOString();
        if (this._locale) {
            this.input.value = Intl.DateTimeFormat(this._locale).format(date);
        }
        else {
            this.input.value = formatInput(date.toDateString(), this);
        }
        this.value = this.dateString;
        this.hbrChange.emit({
            isValid: this.isValid,
            value: this.dateString,
            focused: this.focusedInput,
            date,
            utc: date.toUTCString(),
        });
        this.dropdown.hide();
        this.open = false;
    }
    handleOKButtonKeydown(event) {
        const { key, shiftKey } = event;
        if (key === "Tab") {
            event.preventDefault();
            event.stopPropagation();
            if (shiftKey) {
                const panelBody = this.timePanelRef.shadowRoot.querySelector(".time-panel__body");
                let lastMenuColumn;
                if (panelBody) {
                    if (panelBody.childElementCount > 0) {
                        lastMenuColumn = panelBody.lastElementChild;
                    }
                }
                const lastMenu = lastMenuColumn === null || lastMenuColumn === void 0 ? void 0 : lastMenuColumn.querySelector("hbr-menu");
                if (lastMenu) {
                    this.focusMenuItemKeyboard(lastMenu);
                }
            }
            else {
                const prevYearIcon = this.calendar.shadowRoot.querySelector("[data-testid='prevYear']");
                prevYearIcon === null || prevYearIcon === void 0 ? void 0 : prevYearIcon.setFocus();
            }
        }
        else if (key === "Enter" || key === " ") {
            setTimeout(() => { var _a; return (_a = this.calendarIconRef) === null || _a === void 0 ? void 0 : _a.setFocus(); }, 100);
        }
    }
    handleCalendarKeydown(event) {
        const { key } = event;
        if (key === "Enter" || key === " ") {
            event.stopPropagation();
            event.preventDefault();
            this.open = !this.open;
            this.setFocusDay();
        }
    }
    setFocusDay() {
        setTimeout(() => {
            let focusedDay;
            const calendarTable = this.calendar.shadowRoot.querySelector(".calendar__content");
            if (calendarTable) {
                focusedDay = calendarTable.querySelector(".day-button-selected");
                this.calendar.getConfig().then((config) => {
                    if (config.date) {
                        const { date } = config;
                        focusedDay = this.calendar.shadowRoot.querySelector(`[data-pika-year='${date.getFullYear()}'][data-pika-month='${date.getMonth()}'][data-pika-day='${date.getDate()}']`);
                    }
                    if (!focusedDay) {
                        focusedDay =
                            calendarTable.querySelector(".is-today > button") ||
                                this.calendar.shadowRoot.querySelector("[tabindex='0']");
                    }
                    if (focusedDay) {
                        focusedDay.focus();
                    }
                });
            }
        }, 600);
    }
    restructureValue(target, timeStart, rangeStart) {
        const { range, time } = this;
        const isInput = (obj) => (obj === null || obj === void 0 ? void 0 : obj.tagName) === "HBR-INPUT";
        const isTimeInput = (obj) => (obj === null || obj === void 0 ? void 0 : obj.tagName) === "HBR-TIME-PICKER";
        let value;
        if (this.dateString) {
            return this.dateString;
        }
        if (!range) {
            if (time) {
                value = isTimeInput(target) ? target.value : this.timePicker.value;
            }
            else {
                value = isInput(target) ? target.value : this.input.value;
            }
        }
        else {
            if (time) {
                if (isTimeInput(target)) {
                    value = timeStart
                        ? [target.value, this.timePickerEnd.value]
                        : [this.timePicker.value, target.value];
                }
                else {
                    value = [this.timePicker.value, this.timePickerEnd.value];
                }
            }
            else {
                if (isInput(target)) {
                    value = rangeStart
                        ? [target.value, this.value[1] || ""]
                        : [this.value[0] || "", target.value];
                }
                else {
                    value = [this.inputStart.value, this.inputEnd.value];
                }
            }
        }
        return value;
    }
    newDateFn(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    async handleValidation(event) {
        var _a, _b;
        const { type, target } = event;
        if (type === "hbr-change")
            event.stopPropagation();
        this.onValidating = true;
        const isValid = this.onValidate(event);
        if (isValid) {
            if (this.range) {
                const start = target.classList.contains("hbr-range-start");
                const end = target.classList.contains("hbr-range-end");
                if (start) {
                    this.calendar.setStartRange(this.newDateFn(new Date(target.value)));
                }
                else if (end) {
                    this.calendar.setEndRange(this.newDateFn(new Date(target.value)));
                }
                this.calendar.draw();
            }
            else {
                this.calendar.setDate(typeof this.value === "string"
                    ? new Date(this.value)
                    : new Date(this.value[0]));
            }
            this.error = false;
        }
        else {
            let empty;
            if (Array.isArray(this.value)) {
                empty = this.value.every((value) => !value || value === "");
            }
            if (empty) {
                this.error = false;
            }
            else {
                this.error = true;
            }
        }
        setTimeout(() => {
            this.onValidating = false;
        });
        if (typeof this.value === "string") {
            this.hbrChange.emit({
                isValid,
                value: this.value,
                focused: this.focusedInput,
                date: new Date(this.value),
                utc: new Date(this.value).toUTCString(),
            });
        }
        else if (Array.isArray(this.value)) {
            this.hbrChange.emit({
                isValid,
                value: this.value,
                focused: this.focusedInput,
                date: ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) === 2
                    ? [new Date(this.value[0]), new Date(this.value[1])]
                    : undefined,
                utc: ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) === 2
                    ? [
                        new Date(this.value[0]).toUTCString(),
                        new Date(this.value[1]).toUTCString(),
                    ]
                    : undefined,
            });
        }
    }
    getValueAsArray() {
        if (this.range && this.value === "") {
            return [];
        }
        return Array.isArray(this.value) ? this.value : [this.value];
    }
    render() {
        var _a, _b;
        const { name, placeholder, range, time, variant, magnetic, width, anchor } = this;
        const placeholderText = placeholder
            ? placeholder
            : magnetic
                ? this.format
                : this.format.toLocaleLowerCase();
        if (this.anchor && !this.anchorRef.placeholder) {
            this.anchorRef.placeholder = placeholderText;
        }
        let startValue = "";
        let endValue = "";
        if (range) {
            const valueArr = this.getValueAsArray();
            if (valueArr.length) {
                startValue = valueArr[0];
                endValue = valueArr[1];
            }
        }
        const defaultWidth = width || "100%";
        const _width = {
            "--width": defaultWidth,
        };
        const outlined = this.variant && this.variant === "outline";
        let startWidth = _width;
        if (outlined) {
            let updatedWidth;
            if (width === null || width === void 0 ? void 0 : width.includes("px")) {
                updatedWidth = `${Number(width.replace(/\D/g, "")) - 2}px`;
                startWidth = {
                    "--width": updatedWidth || "100%",
                };
            }
        }
        let hasError;
        let hasLabel;
        if (this.range && !this.outlined) {
            hasError =
                this.error &&
                    Array.isArray(this.error) &&
                    this.error.length &&
                    this.error.some((item) => item === true);
            hasLabel = this.labelExist;
        }
        else {
            hasError = !!this.error;
            hasLabel = !!this.label;
        }
        const uniqueId = this.name || this.uuid;
        const dropdownProp = {}; // Add type annotation for 'dropdownProp'
        if (this.hoist)
            dropdownProp.hoist = true; // Add 'hoist' property to 'dropdownProp' object
        let label = "";
        if (this.outlined) {
            label = "";
        }
        else {
            if (!this.range) {
                label = this.label;
            }
            else if (this.labelExist) {
                label = this.labels[0];
            }
        }
        let helpText;
        if (this.helpText && !this.range && !this.time) {
            helpText = this.helpText;
        }
        let showCustomHelpText;
        if (this.time || this.range) {
            showCustomHelpText = true;
        }
        let hasLabelSlot;
        let hasHelpTextSlot;
        if (!this.range) {
            hasLabelSlot = this.hasLabelSlot;
            if (!this.time) {
                hasHelpTextSlot = this.hasHelpTextSlot;
            }
        }
        let inputValue = "";
        if (!this.error) {
            if (range) {
                if (startValue) {
                    if (this._locale) {
                        inputValue = Intl.DateTimeFormat(this._locale).format(new Date(startValue));
                    }
                    else {
                        inputValue = formatInput(startValue, this);
                    }
                }
                else {
                    inputValue = "";
                }
                if (endValue) {
                    if (this._locale) {
                        endValue = Intl.DateTimeFormat(this._locale).format(new Date(endValue));
                    }
                    else {
                        endValue = formatInput(endValue, this);
                    }
                }
            }
            else {
                if (this.value) {
                    if (this._locale) {
                        if (typeof this.value === "string") {
                            inputValue = Intl.DateTimeFormat(this._locale).format(new Date(this.value));
                        }
                    }
                    else {
                        inputValue = formatInput(this.value, this);
                    }
                }
            }
        }
        else {
            /** Need to render formatted value for calendar selected dates (this.value === this.dateString) */
            if (this.range) {
                if ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) {
                    if (startValue && startValue === this.dateString[0]) {
                        if (this._locale) {
                            inputValue = Intl.DateTimeFormat(this._locale).format(new Date(startValue));
                        }
                        else {
                            inputValue = formatInput(startValue, this);
                        }
                    }
                    else {
                        inputValue = startValue;
                    }
                    if (endValue && endValue === this.dateString[1]) {
                        if (this._locale) {
                            endValue = Intl.DateTimeFormat(this._locale).format(new Date(endValue));
                        }
                        else {
                            endValue = formatInput(endValue, this);
                        }
                    }
                }
            }
            else {
                if (this.value) {
                    if (this.value === this.dateString) {
                        if (this._locale) {
                            if (typeof this.value === "string") {
                                inputValue = Intl.DateTimeFormat(this._locale).format(new Date(this.value));
                            }
                        }
                        else {
                            inputValue = formatInput(this.value, this);
                        }
                    }
                    else if (typeof this.value === "string") {
                        inputValue = this.value;
                    }
                }
            }
        }
        if (anchor) {
            let anchorRef;
            if (typeof anchor === "string") {
                anchorRef = document.querySelector(anchor);
            }
            else {
                anchorRef = anchor;
            }
            if (!range) {
                if (anchorRef.tagName === "HBR-INPUT") {
                    anchorRef.value = inputValue;
                }
            }
        }
        return (h(Host, { key: 'd4ce4c7d5b0ff18f587a23fe71d105cf7f703c8b' }, range && outlined && (hasLabel || this.hasLabelSlot) && (h("div", { part: "label", id: `date-picker-label-${uniqueId}`, class: `
							form-control__label range-picker--outline-label
							range-picker--outline_label--${this.size}
							${hasError ? " error" : ""}
							${this.disabled ? " disabled" : ""}
							` }, h("slot", { name: "label" }, this.label), " ", this.required && (h("span", { part: "asterisk", class: "form-control-asterisk-required" }, "*")), h("slot", { name: "label-suffix" }))), h("div", { key: '5444666c317e6b85df6d4f77138d74e5aae40f4a', part: `base${range ? " range" : ""}`, class: {
                "date-picker--popover": true,
                "date-picker--disabled": this.disabled,
                "range-picker": this.range,
                "time-picker": this.time,
                "time-panel": this.timePanel,
                "range-picker--outline": variant && variant === "outline",
                "range-picker--focused": this.hasFocus,
                "date-picker--error": !!(this.error || hasError),
                "date-picker--has-label": hasLabel,
                "date-picker--has-help-text": this.hasHelpText,
                "date-picker--has-front": this.hasFrontSlot,
                "date-picker--has-rear": this.hasRearSlot,
                // Sizes
                "date-picker--small": this.size === "small",
                "date-picker--medium": this.size === "medium",
                "date-picker--large": this.size === "large",
                [`${this.calendarView}-view`]: true, //since date picker is not re-rendering, this is not working
            }, ref: (ref) => {
                this.datePicker = ref;
            }, id: `date-picker-${uniqueId}` }, h("hbr-dropdown", Object.assign({ key: 'df576d84d558a0e8aaa8d7b4758a9c86c65a07b8', exportparts: "base:dropdown, trigger, panel:dropdown-panel", id: "date-picker-dropdown", panelFitTrigger: true, closeOnSelect: false, uncontrolled: true, ref: (el) => {
                this.dropdown = el;
            }, open: this.open, disabled: this.disabled, class: "date-picker--dropdown", distance: outlined ? 4 : 2, anchor: this.anchor, placement: this.placement }, dropdownProp), !this.anchor ? (h(Fragment, null, h("hbr-input", { class: {
                "hbr-range-start": this.range,
            }, exportparts: "label, element, base: input-base, input, help-text, prefix, suffix", ref: (ref) => {
                if (this.range) {
                    this.inputStart = ref;
                }
                else {
                    this.input = ref;
                }
            }, name: `${name ? `${name}-` : ""}date-${this.uuid}${range ? "-start" : ""}`, slot: "trigger", label: label, placeholder: this.placeholdersExist
                ? this.placeholder[0]
                    ? this.placeholder[0]
                    : ""
                : placeholderText, error: this.errorExist ? this.error[0] : this.error, required: this.required, size: this.size, disabled: this.disabled, "help-text": helpText, "onHbr-input": this.handleInput, onKeyDown: this.handleKeydown, onKeyUp: this.handleKeyup, "onHbr-focus": this.handleFocus, "onHbr-blur": this.handleFocusout, "onHbr-change": this.range
                ? this.handleInputStartChange
                : this.handleHbrChange, onClick: this.handleClick, style: startWidth, aria: { label: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.inputLabel) || this.ariaInput }, value: inputValue, "data-testid": "date-picker-input" }, this.startDateSuffix(), hasLabelSlot && h("slot", { name: "label", slot: "label" }), this.hasStartLabelSlot && (h("slot", { name: "start-label", slot: "label" })), hasHelpTextSlot && (h("slot", { name: "help-text", slot: "help-text" })), h("slot", { name: "clear-icon", slot: "clear-icon" }), this.hasFrontSlot && h("slot", { name: "front", slot: "front" }), this.hasRearSlot && h("slot", { name: "rear", slot: "rear" })), range && (h("hbr-input", { class: {
                "hbr-range-end": this.range,
            }, exportparts: "\n\t\t\t\t\t\t\t\t\t\t\tbase:base-end,\n\t\t\t\t\t\t\t\t\t\t\tinput:input-end,\n\t\t\t\t\t\t\t\t\t\t\tlabel:label-end,\n\t\t\t\t\t\t\t\t\t\t\tprefix:prefix-end,\n\t\t\t\t\t\t\t\t\t\t\tclear-button:clear-button-end,\n\t\t\t\t\t\t\t\t\t\t\tpassword-toggle-button:password-toggle-button-end,\n\t\t\t\t\t\t\t\t\t\t\tsuffix:suffix-end\n\t\t\t\t\t\t\t\t\t\t", ref: (ref) => {
                this.inputEnd = ref;
            }, name: `${name ? `${name}-` : ""}date-${this.uuid}-end`, slot: "trigger", label: !outlined ? (this.labelExist ? this.labels[1] : "") : "", placeholder: this.placeholdersExist
                ? this.placeholder[1]
                : magnetic
                    ? this.format
                    : this.format.toLocaleLowerCase(), error: this.errorExist ? this.error[1] : false, required: this.required, size: this.size, disabled: this.disabled, "onHbr-input": this.handleInput, onKeyDown: this.handleKeydown, onKeyUp: this.handleKeyup, "onHbr-focus": this.handleFocus, "onHbr-blur": this.handleFocusout, "onHbr-change": this.handleInputEndChange, onClick: this.handleClick, value: endValue, style: _width, "data-testid": "date-picker-input-end" }, this.hasEndLabelSlot && (h("slot", { name: "end-label", slot: "label" })), h("slot", { slot: "prefix-end", name: "prefix-end" }), this.endDateSuffix())))) : null, this.panelEl()), time && this.timePickerEl(range, this.value), showCustomHelpText && (h("div", { class: "date-picker__help-text", part: "help-text" }, h("slot", { name: "help-text" }, this.helpText))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"],
        "minDate": ["handleMinDateChange"],
        "maxDate": ["handleMaxDateChange"],
        "value": ["handleValueChange"],
        "error": ["handleErrorChange"],
        "anchor": ["handleAnchorChange"],
        "locale": ["handleLocaleChange"]
    }; }
    static get style() { return HbrDatePickerStyle0; }
}, [1, "hbr-date-picker", {
        "open": [1540],
        "name": [513],
        "hoist": [516],
        "variant": [513],
        "trigger": [513],
        "value": [1025],
        "label": [513],
        "labels": [520],
        "placeholder": [513],
        "placeholders": [520],
        "format": [1025],
        "minDate": [1537, "min-date"],
        "maxDate": [1537, "max-date"],
        "helpText": [1537, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "disabled": [1540],
        "required": [516],
        "error": [1540],
        "size": [513],
        "range": [516],
        "time": [516],
        "timePanel": [516, "time-panel"],
        "width": [513],
        "locale": [1537],
        "i18n": [1032, "i-1-8n"],
        "aria": [16],
        "firstDay": [1026, "first-day"],
        "showMonthAfterYear": [4, "show-month-after-year"],
        "mainCalendar": [1, "main-calendar"],
        "showDaysInNextAndPreviousMonths": [4, "show-days-in-next-and-previous-months"],
        "yearRange": [2, "year-range"],
        "invalid": [1540],
        "calendarStyle": [1, "calendar-style"],
        "ariaInput": [1, "aria-input"],
        "ariaCalendar": [1, "aria-calendar"],
        "timeConfig": [1040],
        "anchor": [8],
        "placement": [513],
        "hasFocus": [32],
        "hasContent": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasStartLabelSlot": [32],
        "hasEndLabelSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "panelOpen": [32],
        "uuid": [32],
        "dateString": [32],
        "config": [32],
        "calendarView": [32],
        "setClick": [64],
        "setFocus": [64],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"],
        "minDate": ["handleMinDateChange"],
        "maxDate": ["handleMaxDateChange"],
        "value": ["handleValueChange"],
        "error": ["handleErrorChange"],
        "anchor": ["handleAnchorChange"],
        "locale": ["handleLocaleChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-date-picker", "hbr-button", "hbr-calendar", "hbr-dropdown", "hbr-icon", "hbr-icon-button", "hbr-input", "hbr-menu", "hbr-menu-item", "hbr-option", "hbr-picker", "hbr-popup", "hbr-select", "hbr-select-anchor", "hbr-spinner", "hbr-tag", "hbr-time-panel", "hbr-time-picker", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-date-picker":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DatePicker);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$k();
            }
            break;
        case "hbr-calendar":
            if (!customElements.get(tagName)) {
                defineCustomElement$j();
            }
            break;
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                defineCustomElement$i();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$h();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$g();
            }
            break;
        case "hbr-input":
            if (!customElements.get(tagName)) {
                defineCustomElement$f();
            }
            break;
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                defineCustomElement$e();
            }
            break;
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$d();
            }
            break;
        case "hbr-option":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-picker":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-select":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-select-anchor":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-tag":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-time-panel":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-time-picker":
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

const HbrDatePicker = DatePicker;
const defineCustomElement = defineCustomElement$1;

export { HbrDatePicker, defineCustomElement };

