import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';
import { R as caretDoubleLeft, b as caretLeft, a as caretRight, S as caretDoubleRight } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './icon-button.js';
import { d as defineCustomElement$1 } from './picker.js';

/** Helper Functions */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}
function getDaysInMonth(year, month) {
    return [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month];
}
function isDate(obj) {
    // return obj instanceof Date && !isNaN(obj.getTime());
    return (/Date/.test(Object.prototype.toString.call(obj)) &&
        !Number.isNaN(obj.getTime()));
}
function setToStartOfDay(date) {
    if (isDate(date))
        date.setHours(0, 0, 0, 0);
}
function compareDates(day1, day2) {
    // weak date comparison (use setToStartOfDay(date) to ensure correct result)
    return day1.getTime() === day2.getTime();
}
function adjustCalendar(calendar) {
    if (calendar.month < 0) {
        calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
        calendar.month += 12;
    }
    if (calendar.month > 11) {
        calendar.year += Math.floor(Math.abs(calendar.month) / 12);
        calendar.month -= 12;
    }
    return calendar;
}
function isoWeek(date, firstWeekOfYearMinDays) {
    // Ensure we're at the start of the day.
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year because January 4th
    // is always in the first week according to ISO8601.
    const yearDay = date.getDate();
    const weekDay = date.getDay();
    const dayInFirstWeek = firstWeekOfYearMinDays;
    const dayShift = dayInFirstWeek - 1; // counting starts at 0
    const daysPerWeek = 7;
    const prevWeekDay = (day) => (day + daysPerWeek - 1) % daysPerWeek;
    // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
    date.setDate(yearDay + dayShift - prevWeekDay(weekDay));
    const jan4th = new Date(date.getFullYear(), 0, dayInFirstWeek);
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysBetween = (date.getTime() - jan4th.getTime()) / msPerDay;
    const weekNum = 1 +
        Math.round((daysBetween - dayShift + prevWeekDay(jan4th.getDay())) / daysPerWeek);
    return weekNum;
}

function _renderDayName(options, day, abbr) {
    // const modifiedDay = day + options.firstDay;
    const modifiedDay = day;
    let modifiedDayOfWeek = modifiedDay;
    while (modifiedDayOfWeek >= 7) {
        modifiedDayOfWeek -= 7;
    }
    const { weekdays, weekdaysShort } = options.i18n || {};
    return abbr
        ? weekdaysShort[modifiedDayOfWeek]
        : weekdays
            ? weekdays[modifiedDayOfWeek]
            : [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ][modifiedDayOfWeek];
}

function moveFocusToDay(day, self) {
    const d = self.focusDay;
    self.focusDay = day;
    if (d.getMonth() !== self.focusDay.getMonth() ||
        d.getFullYear() !== self.focusDay.getFullYear()) {
        updateGrid(self);
        setTimeout(() => {
            if (d.getDate() !== self.focusDay.getDate()) {
                self.focusDay.setDate(self.theDay);
                self.setFocusDay();
            }
            else {
                self.setFocusDay();
            }
        }, 100);
    }
    else {
        self.setFocusDay();
    }
}
function updateGrid(self) {
    const fd = self.focusDay;
    const currentViewMonth = self.calendars[0].month;
    const currentViewYear = self.calendars[0].year;
    if (fd.getFullYear() !== currentViewYear) {
        if (fd.getFullYear() < currentViewYear) {
            self.handlePrevMonthClick();
        }
        else {
            self.handleNextMonthClick();
        }
    }
    else {
        if (fd.getMonth() !== currentViewMonth) {
            if (fd.getMonth() < currentViewMonth) {
                self.handlePrevMonthClick();
            }
            else {
                self.handleNextMonthClick();
            }
        }
    }
}
function moveFocusToNextDay(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() + 1);
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}
function moveFocusToPreviousDay(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() - 1);
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}
function moveFocusToNextWeek(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() + 7);
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}
function moveFocusToPreviousWeek(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() - 7);
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}
function moveFocusToFirstDayOfWeek(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() - d.getDay());
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}
function moveFocusToLastDayOfWeek(self) {
    const d = new Date(self.focusDay);
    d.setDate(d.getDate() + (6 - d.getDay()));
    self.theDay = d.getDate();
    moveFocusToDay(d, self);
}

const calendarCss = "@charset \"UTF-8\";:host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-flex;--bg-color:var(--control-bg-weak-default);--border:none;--color:var(--base-text-default);--border-radius:var(--hbr-border-radius-md);--padding:10px;--width:100%;--selected-day-color:var(--interact-text-in-default);--selected-day-bg-color:var(--interact-text-default);--month-year-button-color-disabled:var(--base-text-disabled);--month-year-button-bg-color-disabled:var(--control-bg-weak-disabled);--month-year-border-color:var(--control-border-weak-default);--month-year-color:var(--base-text-default);--month-year-button-bg-color-selected:var(--interact-text-default);--month-year-button-selected-color:var(--interact-text-in-default);--month-year-button-selected-color-hover:var(--interact-text-in-default);--border:var(--hbr-border-width) solid var(--control-border-default);--range-first-title-padding:10px 4px 12px 14px;--range-last-title-padding:10px 14px 12px 4px;--title-padding:0px 4px 12px;--title-title-justify-content:center;--title-title-width:100px;--title-text-padding-left:0px;--title-text-padding-right:0px;--title-gap:var(--hbr-spacing-xs);--title-arrows-gap:var(--hbr-spacing-xs);--title-year-icon-padding:0px;--thead-padding:4px 4px 8px;--th-line-height:18px;--th-width:28px;--dates-container-padding-top:4px;--dates-container-padding-bottom:4px;--day-start-end-range-bg-color-hover:var(--control-border-hover);--day-in-range-bg-color:var(--control-bg-weak-active);--picker-button-border:2px solid var(--control-border-default);--picker-button-border-disabled:2px solid var(--control-border-weak-disabled);--button-bg-disabled:var(--control-bg-disabled);--button-color-selected:var(--interact-text-in-default);--picker-border:var(--hbr-border-width) solid var(--control-border-default);--header-color:var(--base-text-default);--picker-button-border:2px solid var(--control-border-default);--picker-color-button-bg-hover:var(--interact-bg-weak-hover);--picker-button-border-disabled:var(--hbr-border-width) solid var(--control-border-disabled);--picker-button-bg-disabled:var(--control-bg-disabled);--picker-button-color-disabled:var(--control-icon-strong-disabled);--picker-button-bg-selected:var(--control-bg-strong-default);--picker-button-color-selected:var(--interact-text-in-default);width:var(--width)}hbr-icon-button.hidden{visibility:hidden}/*!\n * Pikaday\n * Copyright © 2014 David Bushell | BSD & MIT license | https://dbushell.com/\n */.pika-single{z-index:var(--hbr-z-index-tooltip);display:flex;flex-wrap:wrap;position:relative;color:var(--color);background-color:var(--bg-color);border:var(--border);font-family:inherit;border-radius:var(--border-radius);padding:var(--padding)}.pika-single.is-hidden{display:none}.pika-single.is-bound{position:absolute;box-shadow:var(--hbr-shadow-md)}.pika-single.range{gap:var(--hbr-spacing-lg);width:100%;align-items:center;align-content:center;justify-content:space-between}.pika-title{display:flex;align-items:center;justify-content:space-between;gap:var(--title-gap);padding:var(--title-padding, 0px var(--hbr-spacing-2xs) 0px);max-width:var(--title-max-width)}.pika-title select{cursor:pointer;position:absolute;z-index:var(--hbr-z-index-tooltip)-1;margin:0;left:0;top:5px;opacity:0}.pika-title .pika-title-text{display:flex;align-items:center;padding-left:var(--title-text-padding-left, --hbr-spacing-2xs);padding-right:var(--title-text-padding-right, --hbr-spacing-2xs);justify-content:var(--title-text-justify-content);width:var(--title-text-width);gap:6px}.pika-single .pika-table .thead{padding:var(--thead-padding, var(--hbr-spacing-2xs) var(--hbr-spacing-2xs) var(--hbr-spacing-xs))}.pika-single .pika-table .tr{display:flex;width:100%;gap:var(--tr-gap, var(--hbr-spacing-xs));align-items:center;align-content:center;justify-content:space-between}.pika-single .pika-table .th{width:var(--th-width, 28px)}.tbody{display:flex;flex-direction:column;gap:var(--tbody-gap, var(--hbr-spacing-xs));padding-top:var(--dates-container-padding-top, var(--hbr-spacing-2xs, 4px));padding-bottom:var(--dates-container-padding-bottom, var(--hbr-spacing-2xs, 4px))}.pika-row{display:flex;align-items:center;align-content:center;padding:var(--row-padding);height:28px}.calendar:not(.hbr-calendar-square) .pika-row{width:100%;gap:var(--tr-gap, var(--hbr-spacing-xs));align-items:center;justify-content:space-between}.range .pika-lendar .pika-title{max-width:var(--range-title-max-width)}.pika-lendar.month .pika-title{padding:0 0 12px}.pika-title-prev-icons,.pika-title-next-icons{display:flex;gap:var(--title-arrows-gap)}.pika-prev,.pika-prev-year,.pika-next,.pika-next-year{padding:var(--title-year-icon-padding, 0 var(--hbr-spacing-2xs))}hbr-icon-button.pika-prev::part(base),hbr-icon-button.pika-prev-year::part(base),hbr-icon-button.pika-next::part(base),hbr-icon-button.pika-next-year::part(base){padding:var(--hbr-spacing-xs);font-size:var(--hbr-font-size-xs)}hbr-icon-button.pika-prev.is-disabled::part(base),hbr-icon-button.pika-next.is-disabled::part(base){cursor:not-allowed;color:var(--control-icon-in-strong-disabled)}hbr-icon-button.pika-select-month::part(base),hbr-icon-button.pika-select-year::part(base){padding-left:0;padding-right:0}.pika-title-text{line-height:20px;font-weight:var(--hbr-font-weight-bold, 700)}.pika-label{display:inline-block;position:relative;z-index:var(--hbr-z-index-tooltip);overflow:hidden;margin:0;padding:0;color:var(--base-text-medium-default)}.pika-prev,.pika-next{display:inline-block;cursor:pointer;position:relative}.pika-prev:hover,.pika-next:hover{opacity:1}.pika-prev.is-disabled,.pika-next.is-disabled{cursor:default;color:var(--base-text-disabled)}.pika-select{display:inline-block}.pika-select.pika-select-month,.pika-select.pika-select-year{cursor:var(--month-year-label-pointer, pointer);pointer-events:var(--month-year-label-pointer-events)}.pika-select.pika-select-month:focus-visible,.pika-select.pika-select-year:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-md)}.pika-select.pika-select-month hbr-icon[name=arrow-down],.pika-select.pika-select-year hbr-icon[name=arrow-down]{font-size:var(--hbr-font-size-xs)}.pika-table{width:100%;border-collapse:separate;border:0;padding:var(--table-padding, 0px)}.pika-table .th,.pika-table .td{padding:0}.pika-table .th{font-size:var(--hbr-font-size-sm);line-height:var(--th-line-height, var(--hbr-line-height-normal));text-align:center;font-weight:var(--hbr-font-weight-normal)}.pika-table abbr{border-bottom:none;text-decoration:none}.pika-button{cursor:pointer;display:block;-moz-box-sizing:border-box;box-sizing:border-box;outline:none;border:0;margin:0;padding:var(--hbr-spacing-2xs);text-align:center;background-color:transparent;color:inherit;}.has-event .pika-button{color:var(--interact-text-in-default);background:var(--interact-text-weak-active)}.is-today .pika-button{font-weight:var(--hbr-font-weight-bold)}.is-selected .pika-button{color:var(--selected-day-color, var(--interact-text-in-default));background:var(--selected-day-bg-color, var(--interact-text-weak-active));border-radius:var(--hbr-border-radius-pill)}.is-selected .pika-button:hover{color:var(--base-text-default)}.is-disabled .pika-button,.is-outside-current-month .pika-button{color:var(--base-text-disabled)}.is-disabled .pika-button{pointer-events:none;cursor:default}.pika-button .is-selection-disabled{pointer-events:none;cursor:default}.pika-week{font-size:var(--hbr-font-size-xs)}.pika-table .td:not(.is-duration-disabled) .pika-button:hover{border:2px solid var(--interact-text-default);background-color:var(--control-bg-weak-default)}.is-startrange .pika-button,.is-endrange .pika-button{color:var(--day-in-range-color, var(--interact-text-in-default));background:var(--control-bg-strong-default);box-shadow:none}.is-startrange .pika-button:hover,.is-endrange .pika-button:hover{background-color:var(--day-start-end-range-bg-color-hover, var(--control-border-hover));color:unset}.hbrDate_view--months,.hbrDate_view--years{display:grid;align-items:center;justify-items:center}.hbrDate_view--months button,.hbrDate_view--years button{outline:0;border:none}.hbrDate_view--months button:hover:not(:disabled),.hbrDate_view--years button:hover:not(:disabled){color:var(--month-year-button-color-hover, var(--interact-text-weak-active))}.hbrDate_view--months button:hover:not(.is-duration-disabled),.hbrDate_view--years button:hover:not(.is-duration-disabled){color:var(--month-year-button-color-hover, var(--interact-text-weak-active))}.hbrDate_view--months button:disabled,.hbrDate_view--years button:disabled{color:var(--month-year-button-color-disabled)}.hbrDate_view--months button.selected,.hbrDate_view--years button.selected{border-radius:var(--hbr-border-radius-xl);color:var(--month-year-button-selected-color);background:var(--month-year-button-bg-color-selected)}.hbrDate_view--months button.selected:hover,.hbrDate_view--years button.selected:hover{background-color:var(--control-bg-strong-hover);color:var(--month-year-button-selected-color-hover)}.hbrDate_view--months button:not(.selected),.hbrDate_view--years button:not(.selected){background-color:inherit}.hbrDate_view--months{grid-template-columns:1fr 1fr;gap:1.1rem}.hbrDate_view--months button{width:80px;padding:0;height:44px}.hbrDate_view--months button[disabled]:hover{color:var(--view-months-color-hover-disabled, var(--base-text-medium-default))}.hbrDate_view--months button[disabled]{cursor:not-allowed}.hbrDate_view--years{grid-template-columns:1fr 1fr 1fr;gap:var(--hbr-spacing-2xs);padding:var(--hbr-spacing-2xs)}.hbrDate_view--years button{width:80px;height:36px}.hbrDate_view--months button.curmonth:not(.selected),.hbrDate_view--years button.curyear:not(.selected){color:var(--view-months-color-hover-disabled, var(--base-text-medium-default));font-weight:var(--hbr-font-weight-bold)}.pika-lendar.month,.pika-lendar.year{padding:10px}.pika-lendar.month:not(.magnetic) hbr-icon-button.pika-prev,.pika-lendar.month:not(.magnetic) hbr-icon-button.pika-next,.pika-lendar.year:not(.magnetic) hbr-icon-button.pika-prev,.pika-lendar.year:not(.magnetic) hbr-icon-button.pika-next{display:none}.pika-single:not(.hbr-calendar-square) .pika-button{border-radius:var(--hbr-border-radius-circle, 50%);width:2.8rem;height:2.8rem}.pika-single:not(.hbr-calendar-square) .pika-button:hover{background:var(--control-icon-weak-default);box-shadow:none}.pika-single:not(.hbr-calendar-square).is-empty+.td:not(.is-duration-disabled).is-inrange,.pika-single:not(.hbr-calendar-square).is-outside-current-month+.td:not(.is-duration-disabled).is-inrange,.pika-single:not(.hbr-calendar-square).is-selection-disabled+.td:not(.is-duration-disabled).is-inrange{background-color:transparent}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled) .pika-button:hover{border-radius:var(--hbr-border-radius-circle)}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange:not(:first-child):not(:last-child):not(.is-last-day){background-color:var(--control-border-hover)}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange .pika-button:hover{background-color:transparent}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange.is-last-day,.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange:first-child,.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange:last-child{background-color:var(--control-border-hover)}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange:first-child{border-top-left-radius:var(--hbr-border-radius-circle, 50%);border-bottom-left-radius:var(--hbr-border-radius-circle, 50%)}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange.is-last-day,.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-inrange:last-child{border-top-right-radius:var(--hbr-border-radius-circle, 50%);border-bottom-right-radius:var(--hbr-border-radius-circle, 50%)}.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-empty+.td:not(.is-duration-disabled).is-inrange,.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-outside-current-month+.td:not(.is-duration-disabled).is-inrange,.pika-single:not(.hbr-calendar-square) .pika-table .td:not(.is-duration-disabled).is-selection-disabled+.td:not(.is-duration-disabled).is-inrange{border-top-left-radius:var(--hbr-border-radius-circle, 50%);border-bottom-left-radius:var(--hbr-border-radius-circle, 50%)}.pika-single:not(.hbr-calendar-square) .is-startrange .pika-button,.pika-single:not(.hbr-calendar-square) .is-endrange .pika-button{position:relative}.pika-single:not(.hbr-calendar-square) .is-startrange.full-range .pika-button::before,.pika-single:not(.hbr-calendar-square) .is-startrange.full-range .pika-button:hover::before,.pika-single:not(.hbr-calendar-square) .is-endrange.full-range .pika-button::before,.pika-single:not(.hbr-calendar-square) .is-endrange.full-range .pika-button:hover::before{position:absolute;content:\"\";width:3.6rem;height:3.6rem;top:0;left:0}.pika-single:not(.hbr-calendar-square) .is-startrange.full-range .pika-button:hover,.pika-single:not(.hbr-calendar-square) .is-endrange.full-range .pika-button:hover{position:relative}.pika-single:not(.hbr-calendar-square) .is-startrange.full-range .pika-button:hover::before,.pika-single:not(.hbr-calendar-square) .is-endrange.full-range .pika-button:hover::before{top:-2px;left:-2px}.pika-single:not(.hbr-calendar-square) .is-startrange:hover:before,.pika-single:not(.hbr-calendar-square) .is-endrange:hover:before{cursor:pointer}.pika-single:not(.hbr-calendar-square) .is-startrange,.pika-single:not(.hbr-calendar-square) .is-endrange{}.pika-single:not(.hbr-calendar-square) .is-startrange.nobackground .pika-button::before,.pika-single:not(.hbr-calendar-square) .is-endrange.nobackground .pika-button::before{background-color:transparent}.pika-single:not(.hbr-calendar-square) .is-startrange:not(.nobackground) .pika-button::before,.pika-single:not(.hbr-calendar-square) .is-endrange:not(.nobackground) .pika-button::before{background-color:rgba(17, 112, 207, 0.15)}.pika-single:not(.hbr-calendar-square) .is-startrange .pika-button::before{border-top-left-radius:var(--hbr-border-radius-circle, 50%);border-bottom-left-radius:var(--hbr-border-radius-circle, 50%);left:0}.pika-single:not(.hbr-calendar-square) .is-startrange:last-child .pika-button::before{background-color:transparent}.pika-single:not(.hbr-calendar-square) .is-endrange:first-child .pika-button::before{background-color:transparent}.pika-single:not(.hbr-calendar-square) .is-endrange .pika-button::before{right:0;border-top-right-radius:var(--hbr-border-radius-circle, 50%);border-bottom-right-radius:var(--hbr-border-radius-circle, 50%)}.pika-single.hbr-calendar-square .pika-table .thead{font-weight:var(--hbr-font-weight-normal, 400);font-size:var(--hbr-font-size-xs);color:var(--title-color, var(--base-text-medium-default))}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled) .pika-button{font-size:var(--hbr-font-size-sm)}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled) .pika-button:hover{border-radius:var(--hbr-border-radius-md);background-color:var(--interact-bg-weak-hover);color:var(--interact-text-hover);font-weight:var(--hbr-font-weight-semibold)}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled):not(.is-today) .pika-button:hover{border:none}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-selected .pika-button:hover{background-color:var(--selected-day-bg-color, var(--interact-text-weak-active));color:var(--selected-day-color)}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-inrange{padding:0}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-inrange .pika-button{background-color:var(--day-in-range-bg-color, var(--control-bg-weak-active));width:36px}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-inrange .pika-button[data-pika-day-of-week=\"0\"]{border-top-left-radius:6px;border-bottom-left-radius:6px}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-inrange .pika-button[data-pika-day-of-week=\"6\"]{border-top-right-radius:6px;border-bottom-right-radius:6px}.pika-single.hbr-calendar-square .pika-table .td:not(.is-duration-disabled).is-inrange .pika-button:hover{background-color:transparent}.pika-single.hbr-calendar-square .pika-lendar.month .pika-select-month,.pika-single.hbr-calendar-square .pika-lendar.year .pika-select-month{display:none}.pika-single.hbr-calendar-square .hbrDate_view--month,.pika-single.hbr-calendar-square .hbrDate_view--year{border:var(--hbr-control-border-width) solid var(--month-year-border-color);border-radius:var(--hbr-border-radius-md);color:var(--month-year-color)}.pika-single.hbr-calendar-square .hbrDate_view--month.selected,.pika-single.hbr-calendar-square .hbrDate_view--year.selected{border:var(--hbr-control-border-width) solid var(--interact-text-default);background:var(--month-year-button-bg-color-selected);color:var(--month-year-button-selected-color)}.pika-single.hbr-calendar-square .hbrDate_view--month.disabled,.pika-single.hbr-calendar-square .hbrDate_view--year.disabled{pointer-events:none;cursor:not-allowed;background-color:var(--month-year-button-bg-color-disabled);color:var(--month-year-button-color-disabled)}.pika-single.hbr-calendar-square .td{padding:var(--hbr-spacing-2xs)}.pika-single.hbr-calendar-square .pika-button{width:28px;height:28px;font-weight:var(--hbr-font-weight-normal, 400);color:var(--base-text-default)}.pika-single.hbr-calendar-square .pika-button:hover{background:var(--interact-icon-weak-default);box-shadow:none;border-radius:var(--hbr-border-radius-md)}.pika-single.hbr-calendar-square .pika-button:focus-visible{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.pika-single.hbr-calendar-square .is-today .pika-button{font-weight:var(--hbr-font-weight-normal);border-radius:var(--hbr-border-radius-md);border:2px solid var(--control-bg-strong-default)}.pika-single.hbr-calendar-square .is-today.is-disabled .pika-button{pointer-events:none;cursor:not-allowed;background-color:var(--month-year-button-bg-color-disabled);color:var(--month-year-button-color-disabled);border-color:var(--month-year-border-color)}.pika-single.hbr-calendar-square .is-selected .pika-button{border-radius:var(--hbr-border-radius-md);color:var(--month-year-button-selected-color-hover)}.pika-single.hbr-calendar-square .is-empty .pika-button,.pika-single.hbr-calendar-square .is-disabled .pika-button{pointer-events:none;color:var(--month-year-button-color-disabled)}.pika-single.hbr-calendar-square .is-startrange .pika-button,.pika-single.hbr-calendar-square .is-endrange .pika-button{position:relative;color:var(--month-year-button-selected-color-hover);border-radius:var(--hbr-border-radius-md)}.pika-single.hbr-calendar-square .is-startrange .pika-button:hover,.pika-single.hbr-calendar-square .is-endrange .pika-button:hover{color:var(--month-year-color)}.pika-single.hbr-calendar-square .is-startrange .pika-button::after,.pika-single.hbr-calendar-square .is-endrange .pika-button::before{position:absolute;background-color:var(--day-in-range-bg-color, var(--control-bg-weak-active));content:\"\";z-index:-1;top:0;bottom:0;left:14px;right:14px}.pika-single.hbr-calendar-square .is-startrange .pika-button::after{right:-4px}.pika-single.hbr-calendar-square .is-endrange .pika-button::before{left:-4px}.month-picker,.year-picker{width:var(--picker-width, 274px);--bg-color:var(--control-bg-weak-default);--border:var(--picker-border, var(--hbr-border-width, 2px) solid var(--control-border-default));--box-shadow:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, 0.05));--border-radius:var(--hbr-border-radius-md, 6px);--padding:10px;--header-gap:var(--hbr-spacing-xs, 8px);--header-padding:0px var(--hbr-spacing-2xs) var(--hbr-spacing-sm);--header-line-height:20px;--header-color:var(--base-text-medium-default);--button-height:40px;--button-width:76px;--button-padding:0;--button-border:var(--picker-button-border, var(--hbr-border-width) solid var(--control-border-default));--button-border-radius:var(--hbr-border-radius-md, 6px);--button-font-weight-hover:var(--hbr-font-weight-semi-bold, 600);--button-font-weight-selected:var(--hbr-font-weight-semi-bold, 600);--button-bg-hover:var(var(--interact-bg-weak-hover));--button-color-hover:var(--interact-text-hover);--button-border-disabled:var(--picker-button-border-disabled, var(--hbr-border-width) solid var(--control-border-disabled));--button-bg-disabled:var(--picker-button-bg-disabled);--button-color-disabled:var(--picker-button-color-disabled);--button-bg-selected:var(--picker-button-bg-selected);--button-color-selected:var(--picker-button-color-selected)}:host-context([data-theme=onecd]){--border:var(--onecd-border-width-default) solid var(--control-border-default);--bg-color:var(--onecd-glass-frost-bg-control, rgba(255, 255, 255, 0.85));--border-radius:var(--onecd-radius-small-default, 6px);--border:var(--onecd-border-width-default, 1px) solid var(--control-border-default, #636F7E)}:host-context([data-theme=onecd]) .calendar{box-shadow:0 0 30px 0 var(--onecd-glass-frost-shadow-inner, rgba(255, 255, 255, 0.6)) inset, 0 0 0 1px var(--onecd-glass-frost-shadow-border, rgba(255, 255, 255, 0.6)) inset, 0 2px 5px 0 var(--shadow-colors-elevation-subtle, rgba(11, 17, 24, 0.05))}:host-context([data-theme=onecd]) .calendar::before{content:\" \";z-index:-1;position:absolute;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));border-radius:var(--onecd-radius-small-default, 6px)}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]){--bg-color:var(--control-bg-weak-default, #FFF)}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]) .calendar{box-shadow:0 2px 5px 0 var(--shadow-colors-elevation-subtle, rgba(11, 17, 24, 0.05))}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]) .calendar::before{content:none}";
const HbrCalendarStyle0 = calendarCss;

const Calendar = /*@__PURE__*/ proxyCustomElement(class Calendar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrDayClick = createEvent(this, "hbr-day-click", 7);
        this.hbrDayFocus = createEvent(this, "hbr-day-focus", 7);
        this.hbrDayKeydown = createEvent(this, "hbr-day-keydown", 7);
        this.hbrTitleKeydown = createEvent(this, "hbr-title-keydown", 7);
        this.hbrMonthView = createEvent(this, "hbr-month-view", 7);
        this.hbrYearView = createEvent(this, "hbr-year-view", 7);
        this.hbrDayView = createEvent(this, "hbr-day-view", 7);
        this.defaultOptions = {
            defaultDate: null,
            firstDay: 0,
            firstWeekOfYearMinDays: 4,
            yearRange: 10,
            showWeekNumber: false,
            pickWholeWeek: false,
            minYear: 0,
            maxYear: 9999,
            isRTL: false,
            yearSuffix: "",
            showMonthAfterYear: false,
            showDaysInNextAndPreviousMonths: false,
            enableSelectionDaysInNextAndPreviousMonths: false,
            numberOfMonths: 1,
            mainCalendar: "left",
            blurFieldOnSelect: true,
            startRange: null,
            endRange: null,
            i18n: {
                previousMonth: "Previous Month",
                previousYear: "Previous Year",
                nextMonth: "Next Month",
                nextYear: "Next Year",
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
            },
            minMonth: 0,
            maxMonth: 0,
            parse: null,
            disableWeekends: false,
            disableDayFn: null,
            showSixWeeks: true, //Magnetic design shows 6weeks as default to keep the height of the calendar consistent
        };
        this.defaultAria = {
            role: "dialog",
            label: "Choose Date",
            level: 3,
            prevMonth: "Previous Month",
            prevYear: "Previous Year",
            nextMonth: "Next Month",
            nextYear: "Next Year",
        };
        this.renderDay = (dayConfig) => {
            const array = [];
            let ariaSelected = "false";
            if (dayConfig.isEmpty) {
                if (dayConfig.showDaysInNextAndPreviousMonths) {
                    array.push("is-outside-current-month");
                    if (!dayConfig.enableSelectionDaysInNextAndPreviousMonths) {
                        array.push("is-selection-disabled");
                    }
                }
                else {
                    array.push("is-empty");
                }
            }
            if (dayConfig.isDisabled || array.includes("is-selection-disabled")) {
                array.push("is-disabled");
            }
            if (!array.includes("is-outside-current-month")) {
                if (dayConfig.isToday) {
                    array.push("is-today");
                }
                if (dayConfig.isSelected) {
                    array.push("is-selected");
                    ariaSelected = "true";
                    this.hasSelectedDay = dayConfig.day;
                }
                if (dayConfig.hasEvent) {
                    array.push("has-event");
                }
                if (dayConfig.isInRange) {
                    array.push("is-inrange");
                    if (dayConfig.lastDay) {
                        array.push("is-last-day");
                    }
                }
                if (dayConfig.isStartRange) {
                    array.push("is-startrange");
                    ariaSelected = "true";
                }
                if (dayConfig.isEndRange) {
                    array.push("is-endrange");
                    ariaSelected = "true";
                }
            }
            let buttonPart = "";
            if (array.includes("is-selection-disabled")) {
                buttonPart += "day-button-disabled";
            }
            else {
                buttonPart += "day-button";
            }
            if (array.includes("is-selected")) {
                buttonPart += " day-button-selected";
            }
            let cls = "";
            if (dayConfig.isEmpty && !dayConfig.showDaysInNextAndPreviousMonths) {
                cls = "is-empty";
            }
            else {
                cls = array.join(" ");
            }
            return (h("div", { "data-day": dayConfig.day, "data-month": dayConfig.month, "data-year": dayConfig.year, class: `td ${cls}` }, h("button", { part: buttonPart, class: "pika-button pika-day", type: "button", tabindex: array.includes("is-selected") ? "0" : "-1", "data-pika-year": dayConfig.year, "data-pika-month": dayConfig.month, "data-pika-day": dayConfig.day, "data-pika-day-of-week": dayConfig.dayOfWeek, "aria-label": navigator.language
                    ? new Intl.DateTimeFormat(navigator.language, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }).format(new Date().setFullYear(dayConfig.year, dayConfig.month, dayConfig.day))
                    : "", onClick: this.handleDayButtonClick.bind(this), disabled: dayConfig.isDisabled || dayConfig.isEmpty, onKeyDown: this.handleDayKeyDown.bind(this), onFocus: this.handleDayFocus.bind(this), role: "gridcell", "aria-selected": ariaSelected }, dayConfig.day)));
        };
        this.renderWeek = (day, month, year, firstWeekOfYearMinDays) => {
            const date = new Date(year, month, day);
            const week = isoWeek(date, firstWeekOfYearMinDays);
            return h("div", { class: "pika-week" }, "$", week);
        };
        this.monthView = (aria) => {
            var _a;
            const labelMonthValue = typeof this.labelMonth === "string"
                ? Number(this.labelMonth)
                : this.labelMonth;
            const mainCalendarIndex = this.options.mainCalendar === "right"
                ? this.options.numberOfMonths - 1
                : 0;
            return (h(Host, { role: aria.role, "aria-label": aria.label, "aria-modal": aria.modal ? "true" : null }, h("hbr-picker", { year: this.yearValue || this.calendars[0].year, data: this.options.i18n.months, "onHbr-previous-year": (event) => {
                    const { year } = event.detail;
                    this.gotoYear(Number(year));
                }, "onHbr-next-year": (event) => {
                    const { year } = event.detail;
                    this.gotoYear(Number(year));
                }, "onHbr-click": (event) => {
                    const { month } = event.detail;
                    this.displayView = "day";
                    this.hbrDayView.emit({ event });
                    this.gotoMonth(month);
                }, value: Number.isFinite(labelMonthValue)
                    ? labelMonthValue
                    : this.calendars[mainCalendarIndex].month, disabled: ((_a = this.config) === null || _a === void 0 ? void 0 : _a.disableMonths) ? [...this.config.disableMonths] : [], class: "month-picker", part: "month-picker", variant: "month", exportparts: "base: picker-base, header: picker-header, body: picker-body" })));
        };
        this.yearView = (aria) => {
            const { yearRange } = this.config;
            const { year, month } = this.dayConfig;
            let _year = year;
            if (month === 0 && new Date().getMonth() !== 0) {
                _year -= 1; //this.dayConfig is set to the next month to display empnty days in calendar
            }
            let startYear;
            let endYear;
            if (Array.isArray(yearRange)) {
                startYear = yearRange[0];
                endYear = yearRange[1];
            }
            else {
                startYear = Math.floor(year / 10) * 10;
                endYear = startYear + yearRange - 1;
            }
            const yearData = Array.from({ length: 12 }, (_, i) => {
                const currentYear = startYear - 1 + i;
                return {
                    year: currentYear,
                    disabled: currentYear < startYear || currentYear > endYear,
                };
            });
            return (h(Host, { role: aria.role, "aria-label": aria.label, "aria-modal": aria.modal ? "true" : null }, h("hbr-picker", { year: this.yearValue || this.calendars[0].year, data: yearData, "onHbr-click": (event) => {
                    const { value } = event.detail;
                    this.displayView = "day";
                    this.hbrDayView.emit({ event });
                    this.gotoYear(Number(value));
                }, "onHbr-year-heading-click": (event) => {
                    const { year } = event.detail;
                    this.gotoYear(Number(year));
                    this.displayView = "year";
                }, value: _year, part: "month-picker", variant: "year", yearRange: yearRange, class: "year-picker", exportparts: "base: picker-base, header: picker-header, body: picker-body" })));
        };
        this.hasHeaderSlot = undefined;
        this.hasWeekSlot = undefined;
        this.hasDaysSlot = undefined;
        this.setDefaultDate = undefined;
        this.calendars = undefined;
        this.date = undefined;
        this.reRender = undefined;
        this.displayView = "day";
        this.config = undefined;
        this.arialevel = undefined;
        this.square = undefined;
        this.reRenderOnSlotChange = undefined;
        this.aria = undefined;
    }
    componentWillLoad() {
        var _a;
        let { config, square } = this;
        if (square) {
            this.defaultOptions.i18n.weekdaysShort = [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa",
            ];
            this.defaultOptions.i18n.months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
        }
        if (config) {
            if (config.numberOfMonths) {
                const numOfMon = config.numberOfMonths || 1;
                config.numberOfMonths = numOfMon > 4 ? 4 : numOfMon;
            }
            if (config.minDate && !isDate(config.minDate)) {
                config.minDate = null;
            }
            else if (typeof config.minDate === "string") {
                config.minDate = new Date(Date.parse(config.minDate));
            }
            if (!isDate(config.maxDate)) {
                config.maxDate = null;
            }
            if (config.minDate && config.maxDate && config.minDate > config.maxDate) {
                config.maxDate = config.minDate = null;
            }
            if (config.minDate) {
                this.setMinDate(new Date(config.minDate));
            }
            if (Array.isArray(config.yearRange)) {
                const fallback = new Date().getFullYear() - 10;
                const startYear = config.yearRange[0] || fallback;
                const endYear = config.yearRange[1] || fallback;
                config = Object.assign(Object.assign({}, config), { yearRange: [startYear, endYear] });
            }
            else {
                config.yearRange =
                    Math.abs(config.yearRange) || this.defaultOptions.yearRange;
                if (typeof config.yearRange === "number" && config.yearRange > 100) {
                    config.yearRange = 100;
                }
            }
        }
        this.options = Object.assign(Object.assign({}, this.defaultOptions), this.config);
        /** Make sure i18n can have all the items even a user only update one item. */
        this.options.i18n = Object.assign(Object.assign({}, this.defaultOptions.i18n), (_a = this.config) === null || _a === void 0 ? void 0 : _a.i18n);
        const defDate = this.options.defaultDate && new Date(this.options.defaultDate);
        if (isDate(defDate)) {
            if (this.options.setDefaultDate) {
                this.setDate(defDate);
            }
            else {
                this.gotoDate(defDate);
            }
        }
        else {
            if (this.options.startRange) {
                this.gotoDate(this.options.startRange);
            }
            else {
                this.gotoDate(new Date());
            }
        }
        this.multiCalendar = this.options.numberOfMonths > 1;
    }
    componentDidUpdate() {
        this.labelMonth = undefined;
    }
    async getDate() {
        return isDate(this.date) ? new Date(this.date.getTime()) : null;
    }
    async setDate(date, preventOnSelect) {
        if (!date) {
            this.date = null;
            return this.draw();
        }
        let _date = date;
        if (typeof date === "string") {
            _date = new Date(Date.parse(date));
        }
        if (!isDate(date)) {
            return;
        }
        const { minDate, maxDate, onSelect } = this.options;
        const min = minDate;
        const max = maxDate;
        if (isDate(min) && date < min) {
            _date = min;
        }
        else if (isDate(max) && date > max) {
            _date = max;
        }
        this.date = new Date(_date.getTime());
        setToStartOfDay(this.date);
        this.gotoDate(this.date);
        if (!preventOnSelect && typeof onSelect === "function") {
            this.options.onSelect.call(this, this.date, false);
        }
    }
    async clear() {
        this.setDate(null);
    }
    async gotoDate(date) {
        let newCalendar = true;
        if (!isDate(date)) {
            return;
        }
        if (this.calendars) {
            const firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1);
            const lastVisibleDate = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1);
            const visibleDate = date.getTime();
            // get the end of the month
            lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
            lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
            newCalendar =
                visibleDate < firstVisibleDate.getTime() ||
                    lastVisibleDate.getTime() < visibleDate;
        }
        if (newCalendar) {
            this.calendars = [
                {
                    month: date.getMonth(),
                    year: date.getFullYear(),
                },
            ];
            if (this.options.mainCalendar === "right") {
                this.calendars[0].month += 1 - this.options.numberOfMonths;
            }
        }
        this.adjustCalendars();
    }
    async adjustCalendars() {
        this.calendars[0] = adjustCalendar(this.calendars[0]);
        for (let c = 1; c < this.options.numberOfMonths; c++) {
            this.calendars[c] = adjustCalendar({
                month: this.calendars[0].month + c,
                year: this.calendars[0].year,
            });
        }
        this.draw();
    }
    async gotoToday() {
        this.gotoDate(new Date());
    }
    /** change view to a specific month (zero-index, e.g. 0: January) */
    async gotoMonth(month) {
        this.calendars[0].month = month;
        this.adjustCalendars();
    }
    async nextMonth() {
        this.calendars[0].month++;
        this.adjustCalendars();
    }
    async prevMonth() {
        this.calendars[0].month--;
        this.adjustCalendars();
    }
    /** change view to a specific full year (e.g. "2036") */
    async gotoYear(year) {
        this.calendars[0].year = year;
        this.adjustCalendars();
    }
    /** change the minDate */
    async setMinDate(value) {
        const { defaultOptions } = this;
        if (value instanceof Date) {
            setToStartOfDay(value);
            this.options = Object.assign(Object.assign({}, this.options), { minDate: value, minYear: value.getFullYear(), minMonth: value.getMonth() });
        }
        else {
            this.options = Object.assign(Object.assign({}, this.options), { minDate: defaultOptions.minDate, minYear: defaultOptions.minYear, minMonth: defaultOptions.minMonth });
        }
        this.draw();
    }
    async setMaxDate(value) {
        const { defaultOptions } = this;
        if (value instanceof Date) {
            setToStartOfDay(value);
            this.options = Object.assign(Object.assign({}, this.options), { maxDate: value, maxYear: value.getFullYear(), maxMonth: value.getMonth() });
        }
        else {
            this.options = Object.assign(Object.assign({}, this.options), { maxDate: defaultOptions.maxDate, maxYear: defaultOptions.maxYear, maxMonth: defaultOptions.maxMonth });
        }
        this.draw();
    }
    async setStartRange(value) {
        this.options = Object.assign(Object.assign({}, this.options), { startRange: value });
    }
    async setEndRange(value) {
        this.options = Object.assign(Object.assign({}, this.options), { endRange: value });
    }
    async setFocusDay(date) {
        let day;
        if (date) {
            day = date;
        }
        else {
            day = this.focusDay.getDate();
        }
        const button = this.host.shadowRoot.querySelector(`div:not(.is-disabled)[data-day="${day}"] > button[data-pika-day="${day}"]`);
        button === null || button === void 0 ? void 0 : button.focus();
    }
    async draw() {
        const { options } = this;
        const minYear = options.minYear;
        const maxYear = options.maxYear;
        const minMonth = options.minMonth;
        const maxMonth = options.maxMonth;
        if (this.year <= minYear) {
            this.year = minYear;
            if (this.month < minMonth) {
                this.month = minMonth;
            }
        }
        if (this.year >= maxYear) {
            this.year = maxYear;
            if (this.month > maxMonth) {
                this.month = maxMonth;
            }
        }
        this.reRender = !this.reRender;
    }
    async getConfig() {
        return {
            calendars: this.calendars,
            date: this.date,
            displayView: this.displayView,
            options: this.options,
        };
    }
    componentWillRender() {
        this.hasSelectedDay = undefined;
    }
    componentDidRender() {
        if (!this.hasSelectedDay) {
            const todayButton = this.host.shadowRoot.querySelector(".is-today > button.pika-day");
            if (todayButton) {
                todayButton.setAttribute("tabindex", "0");
                this.focusDay = new Date(todayButton.getAttribute("aria-label"));
            }
        }
    }
    disconnectedCallback() {
        this.hasSelectedDay = undefined;
    }
    handleSlotChange() {
        this.hasHeaderSlot = hasSlot(this.host, "header");
        this.hasWeekSlot = hasSlot(this.host, "week");
        this.hasDaysSlot = hasSlot(this.host, "days");
    }
    handleDayButtonClick(event) {
        const day = event.target;
        const { pikaYear, pikaMonth, pikaDay } = day.dataset;
        const _date = new Date(Number(pikaYear), Number(pikaMonth), Number(pikaDay));
        _date.setHours(0, 0, 0, 0);
        this.hbrDayClick.emit({
            event,
            year: Number(pikaYear),
            month: Number(pikaMonth),
            day: Number(pikaDay),
            date: _date,
        });
    }
    handleDayKeyDown(event) {
        const day = event.target;
        let flag = false;
        switch (event.key) {
            case "Esc":
            case "Escape":
                this.hbrDayKeydown.emit({
                    event,
                    key: "escape",
                    day,
                });
                break;
            case " ":
            case "Spacebar":
                this.handleDayButtonClick(event);
                flag = true;
                break;
            case "Enter":
                this.handleDayButtonClick(event);
                flag = true;
                break;
            case "Tab":
                if (event.shiftKey) {
                    const nextYearIcon = this.host.shadowRoot.querySelector("[data-testid='nextYear']");
                    nextYearIcon.setFocus();
                }
                else {
                    const { nextElementSibling } = this.host.parentElement;
                    if (nextElementSibling) {
                        this.hbrDayKeydown.emit({
                            event,
                            key: "tab",
                            day,
                            nextElementSibling,
                        });
                    }
                    else {
                        const prevYearIcon = this.host.shadowRoot.querySelector("[data-testid='prevYear']");
                        prevYearIcon.setFocus();
                    }
                }
                flag = true;
                break;
            case "Right":
            case "ArrowRight":
                moveFocusToNextDay(this);
                flag = true;
                break;
            case "Left":
            case "ArrowLeft":
                moveFocusToPreviousDay(this);
                flag = true;
                break;
            case "Down":
            case "ArrowDown":
                moveFocusToNextWeek(this);
                flag = true;
                break;
            case "Up":
            case "ArrowUp":
                moveFocusToPreviousWeek(this);
                flag = true;
                break;
            case "PageUp":
                if (event.shiftKey) {
                    this.handlePrevYearClick();
                }
                else {
                    this.handlePrevMonthClick();
                }
                this.setFocusDay();
                flag = true;
                break;
            case "PageDown":
                if (event.shiftKey) {
                    this.handleNextYearClick();
                }
                else {
                    this.handleNextMonthClick();
                }
                this.setFocusDay();
                flag = true;
                break;
            case "Home":
                moveFocusToFirstDayOfWeek(this);
                flag = true;
                break;
            case "End":
                moveFocusToLastDayOfWeek(this);
                flag = true;
                break;
        }
        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    handleDayFocus(event) {
        const day = event.target;
        this.hbrDayFocus.emit({
            event,
            year: Number(day.dataset.pikaYear),
            month: Number(day.dataset.pikaMonth),
            day: Number(day.dataset.pikaDay),
            date: new Date(Number(day.dataset.pikaYear), Number(day.dataset.pikaMonth), Number(day.dataset.pikaDay)),
        });
    }
    handleMonthLabelClick(event) {
        this.displayView = "month";
        this.labelMonth = Number(event.target.dataset.titleMonth);
        this.hbrMonthView.emit({ event, month: this.labelMonth });
    }
    handleMonthTitleKeyDown(event) {
        if (event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar") {
            this.handleMonthLabelClick(event);
        }
    }
    handleYearLabelClick(event) {
        this.displayView = "year";
        this.hbrYearView.emit({ event, year: this.year });
    }
    handleYearTitleKeyDown(event) {
        if (event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar") {
            this.handleYearLabelClick(event);
        }
    }
    renderMonthHeading(month) {
        return (h("span", { part: "month-label", "data-testid": "calendarMonth", class: "pika-label month pika-select pika-select-month", "data-title-month": month, role: "button", "aria-label": "Select different month", tabindex: "0", onClick: this.handleMonthLabelClick.bind(this), onKeyDown: this.handleMonthTitleKeyDown.bind(this) }, this.options.i18n.months[month]));
    }
    renderYearHeading(year) {
        return (h("span", { part: "year-label", "data-testid": "calendarYear", class: "pika-label year pika-select pika-select-year", "data-title-year": year, onClick: this.handleYearLabelClick.bind(this), onKeyDown: this.handleYearTitleKeyDown.bind(this), role: "button", tabindex: "0", "aria-label": "Select different year" }, year, this.options.yearSuffix));
    }
    handlePrevMonthClick() {
        this.calendars[0].month--;
        this.adjustCalendars();
    }
    handleNextMonthClick() {
        this.calendars[0].month++;
        this.adjustCalendars();
    }
    handlePrevYearClick() {
        this.calendars[0].year--;
        this.gotoYear(this.calendars[0].year);
    }
    handleNextYearClick() {
        this.calendars[0].year++;
        this.gotoYear(this.calendars[0].year);
    }
    handleTitleKeyDown(event) {
        if (event.key === "Tab" && event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            const { nextElementSibling } = this.host.parentElement;
            if (nextElementSibling) {
                this.hbrTitleKeydown.emit({
                    event,
                    key: "shift",
                    target: "prevYear",
                    nextElementSibling,
                });
            }
            else {
                const activeDay = this.host.shadowRoot.querySelector("button.pika-day[tabindex='0']");
                activeDay === null || activeDay === void 0 ? void 0 : activeDay.focus();
            }
        }
    }
    render() {
        const { options } = this;
        const { numberOfMonths } = options;
        const _aria = Object.assign(Object.assign({}, this.defaultAria), this.aria);
        // const popover = this.host.parentElement?.closest(".date-picker--popover");
        // popover?.classList.remove("picker-view");
        if (this.displayView === "month") {
            // popover?.classList.add("picker-view");
            return this.monthView(_aria);
        }
        if (this.displayView === "year") {
            // popover?.classList.add("picker-view");
            return this.yearView(_aria);
        }
        return (h(Host, { role: _aria.role, "aria-label": _aria.label, "aria-modal": _aria.modal ? "true" : null }, h("div", { part: "base", class: {
                calendar: true,
                "pika-single": true,
                "hbr-calendar-square": this.square,
                range: this.multiCalendar,
            } }, Array.from({ length: numberOfMonths }).map((_, index) => {
            var _a, _b;
            const renderID = `pika-title-${Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .slice(0, 2)}`;
            const _month = this.calendars[index].month;
            const _year = this.calendars[index].year;
            const now = new Date();
            const daysInMonth = getDaysInMonth(_year, _month);
            let before = new Date(_year, _month, 1).getDay();
            let row = [];
            setToStartOfDay(now);
            if (options.firstDay > 0) {
                before -= options.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            const previousMonth = _month === 0 ? 11 : _month - 1;
            const nextMonth = _month === 11 ? 0 : _month + 1;
            const yearOfPreviousMonth = _month === 0 ? _year - 1 : _year;
            const yearOfNextMonth = _month === 11 ? _year + 1 : _year;
            const daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
            let cells = daysInMonth + before;
            let after = cells;
            while (after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            let isWeekSelected = false;
            const rows = [];
            const lastDay = [];
            for (let daysIndex = 0, dayOfWeek = 0; daysIndex < cells; daysIndex++) {
                const day = new Date(_year, _month, 1 + (daysIndex - before));
                const isSelected = isDate(this.date)
                    ? compareDates(day, this.date)
                    : false;
                const isToday = compareDates(day, now);
                /** we are not supporting this */
                // const hasEvent =
                // 	options.events.indexOf(day.toDateString()) !== -1 ? true : false;
                const isEmpty = daysIndex < before || daysIndex >= daysInMonth + before;
                let dayNumber = 1 + (daysIndex - before);
                let monthNumber = _month;
                let yearNumber = _year;
                const isStartRange = options.startRange && compareDates(options.startRange, day);
                const isEndRange = options.endRange && compareDates(options.endRange, day);
                const isInRange = options.startRange &&
                    options.endRange &&
                    options.startRange < day &&
                    day < options.endRange;
                const isDisabled = (options.minDate && day < options.minDate) ||
                    (options.maxDate && day > options.maxDate) ||
                    (options.disableWeekends && isWeekend(day)) ||
                    ((_a = options.disableDayFn) === null || _a === void 0 ? void 0 : _a.call(options, day));
                if (isEmpty) {
                    if (daysIndex < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    }
                    else {
                        dayNumber = dayNumber - daysInMonth;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }
                this.dayConfig = {
                    day: dayNumber,
                    month: monthNumber,
                    year: yearNumber,
                    // hasEvent: hasEvent,
                    isSelected,
                    isToday,
                    isDisabled,
                    isEmpty,
                    isStartRange,
                    isEndRange,
                    isInRange,
                    showDaysInNextAndPreviousMonths: options.showDaysInNextAndPreviousMonths,
                    enableSelectionDaysInNextAndPreviousMonths: options.enableSelectionDaysInNextAndPreviousMonths,
                    dayOfWeek,
                };
                if (options.pickWholeWeek && isSelected) {
                    isWeekSelected = true;
                }
                const _options = Object.assign(Object.assign({}, this.dayConfig), { isRTL: options.isRTL, pickWholeWeek: options.pickWholeWeek, isRowSelected: isWeekSelected });
                row.push(_options);
                if (++dayOfWeek === 7) {
                    if (options.showWeekNumber) {
                        row.unshift(this.renderWeek(daysIndex - before, _month, _year, options.firstWeekOfYearMinDays));
                    }
                    rows.push(row);
                    row = [];
                    dayOfWeek = 0;
                    isWeekSelected = false;
                }
                lastDay[0] = dayNumber;
                lastDay[1] = monthNumber;
                lastDay[2] = yearNumber;
            }
            let lastRowDay = lastDay[0];
            if (rows.length < 6 && options.showSixWeeks) {
                const extraRow = [];
                const extra = {
                    isDisabled: true,
                    isEmpty: true,
                };
                if (lastRowDay === daysInMonth) {
                    /** last day is last day of the week */
                    lastRowDay = 1;
                    extra.month = _month + lastDay[1] > 11 ? 0 : _month + 1;
                    extra.year = lastDay[2] + 1;
                }
                else {
                    /** continue with same month */
                    lastRowDay++;
                    extra.month = lastDay[1];
                    extra.year = lastDay[2];
                }
                for (let dayIndex = 1; dayIndex < 8; dayIndex++) {
                    const lastDayConfig = Object.assign({ day: lastRowDay }, extra);
                    extraRow.push(lastDayConfig);
                    lastRowDay++;
                }
                rows.push(extraRow);
            }
            const customSystemIcons = (_b = getBootstrapConfig()) === null || _b === void 0 ? void 0 : _b.systemIcons;
            return (h("div", { part: "calendar", class: `pika-lendar calendar__${index} ${this.displayView}` }, this.hasHeaderSlot ? (h("div", { part: "header", class: "calendar__prefix" }, h("slot", { name: "header", onSlotchange: this.handleSlotChange.bind(this) }))) : (h("div", { class: "calendar__header pika-title" }, h("div", { class: "pika-title-prev-icons" }, h("hbr-icon-button", { "data-testid": "prevYear", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-left"]) ||
                    caretDoubleLeft, onClick: this.handlePrevYearClick.bind(this), onKeyDown: this.handleTitleKeyDown.bind(this), class: `pika-prev-year 
													${this.multiCalendar &&
                    index === this.options.numberOfMonths - 1
                    ? "hidden"
                    : ""}
														`, arialabel: _aria.prevYear }), h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-left"]) || caretLeft, "data-testid": "prevMonth", class: `pika-prev
													${this.multiCalendar &&
                    index === this.options.numberOfMonths - 1
                    ? "hidden"
                    : ""}
														`, onClick: this.handlePrevMonthClick.bind(this), arialabel: _aria.prevMonth })), h("div", { "aria-live": "polite", class: "calendar__month-year pika-title-text", role: "heading", "aria-level": _aria.level || this.arialevel, id: renderID }, options.showMonthAfterYear ? (h(Fragment, null, this.renderYearHeading(this.calendars[index].year), this.renderMonthHeading(this.calendars[index].month))) : (h(Fragment, null, this.renderMonthHeading(this.calendars[index].month), this.renderYearHeading(this.calendars[index].year)))), h("div", { class: "pika-title-next-icons" }, h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight, arialabel: _aria.nextMonth, "data-testid": "nextMonth", class: `pika-next
													${this.multiCalendar && index === 0 ? "hidden" : ""}
													`, onClick: this.handleNextMonthClick.bind(this) }), h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-double-right"]) ||
                    caretDoubleRight, arialabel: _aria.nextYear, "data-testid": "nextYear", class: `
													pika-next-year ${this.multiCalendar && index === 0 ? "hidden" : ""}`, onClick: this.handleNextYearClick.bind(this) })))), h("div", { class: "calendar__content pika-table", part: "calendar-content", role: "grid" }, h("div", { class: "thead", role: "rowgroup" }, h("div", { role: "row", class: "calendar__week-title tr", part: "week-title" }, this.hasWeekSlot && (h("slot", { name: "week", onSlotchange: this.handleSlotChange.bind(this) })), Array.from({ length: 7 }).map((_, i) => (h("span", { role: "columnheader", "aria-colindex": i + 1, part: "thead", class: "th" }, h("abbr", { title: _renderDayName(options, i, null) }, _renderDayName(options, i, true))))))), h("div", { class: "tbody" }, rows.map((row) => {
                return (h("div", { role: "row", class: `calendar__week pika-row ${row.pickWholeWeek ? " pick-whole-week" : ""}  ${row.isRowSelected ? " is-selected" : ""}`, part: "week", "aria-selected": row.isRowSelected ? "true" : "false" }, row.map((day) => {
                    return this.renderDay(day);
                })));
            })))));
        }))));
    }
    get host() { return this; }
    static get style() { return HbrCalendarStyle0; }
}, [1, "hbr-calendar", {
        "config": [1040],
        "arialevel": [2],
        "square": [4],
        "reRenderOnSlotChange": [4, "re-render-on-slot-change"],
        "aria": [16],
        "hasHeaderSlot": [32],
        "hasWeekSlot": [32],
        "hasDaysSlot": [32],
        "setDefaultDate": [32],
        "calendars": [32],
        "date": [32],
        "reRender": [32],
        "displayView": [32],
        "getDate": [64],
        "setDate": [64],
        "clear": [64],
        "gotoDate": [64],
        "adjustCalendars": [64],
        "gotoToday": [64],
        "gotoMonth": [64],
        "nextMonth": [64],
        "prevMonth": [64],
        "gotoYear": [64],
        "setMinDate": [64],
        "setMaxDate": [64],
        "setStartRange": [64],
        "setEndRange": [64],
        "setFocusDay": [64],
        "draw": [64],
        "getConfig": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-calendar", "hbr-icon", "hbr-icon-button", "hbr-picker"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-calendar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Calendar);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-picker":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Calendar as C, defineCustomElement as d };

