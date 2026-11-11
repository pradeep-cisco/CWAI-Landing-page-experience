import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a1 as clock } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$d } from './icon.js';
import { h as hasSlot } from './slot.js';
import { g as getDefaultTime, i as isPM, a as getHourMinSecFromInput, b as getDate, c as isValidDate, d as autoFillInputValue, e as isValidInput, f as formatInputPopover, h as getHourMinSec, j as isEmpty, k as formatInput, l as formatToInputValue, m as isInput } from './util.js';
import { d as defineCustomElement$f } from './button.js';
import { d as defineCustomElement$e } from './dropdown.js';
import { d as defineCustomElement$c } from './icon-button.js';
import { d as defineCustomElement$b } from './input.js';
import { d as defineCustomElement$a } from './menu.js';
import { d as defineCustomElement$9 } from './menu-item.js';
import { d as defineCustomElement$8 } from './option.js';
import { d as defineCustomElement$7 } from './popup.js';
import { d as defineCustomElement$6 } from './select.js';
import { d as defineCustomElement$5 } from './select-anchor.js';
import { d as defineCustomElement$4 } from './spinner.js';
import { d as defineCustomElement$3 } from './tag.js';
import { d as defineCustomElement$2 } from './tooltip.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const timePickerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:flex;flex-direction:row;--column-width:100%;--input-min-width:none;--input-max-width:none;--column-menu-width:60px;--input-width:125px;--panel-border-width:2px}.time-picker{display:flex;height:fit-content}.time-picker hbr-dropdown{--panel-border:var(--panel-border-width) solid var(--control-border-default)}.time-picker hbr-input{--label-error-color:var(--base-text-default);--box-bg-color:var(--base-bg-weak-default)}.time-picker hbr-input[disabled]::part(label){color:var(--label-color)}.time-picker hbr-input::part(error-icon){display:none}.time-picker hbr-input::part(help-text){--help-text-font-size-small:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-md)}.time-picker hbr-select{--box-bg-color:var(--base-bg-weak-default)}.time-picker.time-picker--hour-min .time-picker__panel-body{display:grid;grid-template-columns:1fr 1fr}.time-picker.time-picker--hour-min-sec .time-picker__panel-body{display:grid;grid-template-columns:1fr 1fr 1fr}.time-picker .time-picker__panel-footer{position:absolute;box-sizing:border-box;display:flex;flex-direction:row;justify-content:space-between;align-items:center;height:50px;padding:8px;border-top:1px solid var(--base-border-default);bottom:var(--panel-border-width);width:calc(100% - var(--panel-border-width) * 2);background:var(--control-bg-weak-default);border-bottom-right-radius:var(--hbr-border-radius-md);border-bottom-left-radius:var(--hbr-border-radius-md)}.time-picker .time-picker__column{position:relative;width:var(--column-menu-width)}.time-picker .time-picker__column:not(div:first-of-type){border-left:1px solid var(--base-border-default)}.time-picker .time-picker__column hbr-menu{--box-shadow:none;--padding:none;--border-radius:0px;--border:none}.time-picker .time-picker__column-header{display:flex;justify-content:flex-start;align-items:center;height:32px;line-height:18px;font-size:var(--hbr-font-size-xs, 12px);color:var(--base-text-medium-default);padding:var(--hbr-spacing-xs, 8px) var(--hbr-spacing-sm, 12px) var(--hbr-spacing-2xs, 4px);font-weight:var(--hbr-font-weight-semibold, 600);border-bottom:1px solid var(--base-border-default)}.time-picker .time-picker__panel{max-height:var(--auto-size-available-height)}.time-picker .time-picker__column-body{display:flex;flex-direction:column;max-height:300px;overflow-y:auto;-ms-overflow-style:none;scrollbar-width:none;}.time-picker .time-picker__column-body::-webkit-scrollbar{display:none}.time-picker .time-picker__column-item-text{display:flex;align-items:center;justify-content:flex-start;color:var(--base-text-default);font-weight:400;font-size:14px;line-height:20px;padding:8px 12px;width:60px}.time-picker hbr-menu-item.time-picker__column-item{--checked-background-color:var(--control-bg-weak-active)}.time-picker hbr-menu-item.time-picker__column-item::part(base){--hover-background:var(--control-bg-weak-hover);--checked-background-color:var(--control-bg-weak-active);--padding:0px}.time-picker .time-picker__panel-footer{--hbr-font-weight-normal:var(--hbr-font-weight-bold)}.time-picker .time-picker__panel-footer hbr-button[part=now-button]::part(base){color:var(--interact-text-default)}.time-picker .time-picker__panel-footer hbr-button[part=ok-button]::part(base){--bg-color:var(--interact-text-default)}.time-picker.time-picker--hour-min hbr-dropdown::part(positioner){width:125px}.time-picker hbr-dropdown{--trigger-padding:0px}.time-picker hbr-dropdown::part(panel){max-height:fit-content}.time-picker hbr-dropdown hbr-menu{--padding:0px;--border-radius:0px;--max-height:calc(var(--auto-size-available-height) - 50px - 32px)}.time-picker hbr-dropdown hbr-menu::part(base){margin-bottom:50px}.time-picker hbr-dropdown::part(panel){background-color:var(--control-bg-weak-default);color:var(--base-text-medium-default)}.time-picker hbr-input{--border-width:var(--panel-border-width);width:var(--input-width);min-width:var(--input-min-width);max-width:var(--input-max-width)}.time-picker hbr-input[disabled]::part(label){color:var(--label-color)}.time-picker hbr-input::part(input){margin-left:10px;margin-right:8px}.time-picker hbr-input::part(input) ::placeholder{color:var(--base-text-weak-default)}hbr-icon.time-picker--icon-clock{margin-right:10px;cursor:pointer;font-size:var(--hbr-font-size-md, 16px)}.time-picker--icon-clock{color:var(--control-icon-weak-default)}.time-picker--disabled .time-picker--icon-clock{color:var(--interact-icon-weak-disabled)}.time-picker--disabled hbr-input hbr-icon.time-picker--icon-clock{color:var(--base-text-disabled)}.time-picker--disabled hbr-input hbr-icon.time-picker--icon-clock:hover{cursor:not-allowed}.time-picker--trigger{display:flex;flex-direction:row}.time-picker--trigger hbr-select{display:none;margin:0 0 0 4px}.time-picker--trigger hbr-select.time-picker--select{display:flex}.time-picker--trigger hbr-select.time-picker--select-hide{display:none}.time-picker--trigger hbr-select::part(label){visibility:hidden}:host-context([data-theme=onecd]){--panel-border-width:var(--onecd-border-width-default)}:host-context([data-theme=onecd]) .time-picker .time-picker__column-header{border-bottom:none}:host-context([data-theme=onecd]) .time-picker .time-picker__panel-footer{border-top:none}";
const HbrTimePickerStyle0 = timePickerCss;

let id = 0;
const TimePicker = /*@__PURE__*/ proxyCustomElement(class TimePicker extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.inputId = `time-picker-${++id}`;
        this.labelId = `time-picker-label-${id}`;
        this._helpTextId = `time-picker-helpTextId-${id}`;
        this.isValid = true;
        this.onValidating = false;
        this._hours = Array.from({ length: 24 }, (_, i) => getDefaultTime(i));
        this._min = Array.from({ length: 60 }, (_, i) => getDefaultTime(i));
        this._sec = Array.from({ length: 60 }, (_, i) => getDefaultTime(i));
        this.setMeridiem = (value) => {
            const hour = value.getHours();
            if (isPM(hour))
                this.meridiem = "PM";
            else
                this.meridiem = "AM";
        };
        this.setHourAndMin = (value) => {
            // TODO: with sec
            let { hour, min, sec } = getHourMinSecFromInput(value, this.format, this.second);
            const now = getDate(this.value, this.date);
            if (this.format === "12") {
                if (this.meridiem === "PM")
                    hour = hour === 12 ? 12 : hour + 12;
                else if (this.meridiem === "AM" && hour === 12)
                    hour = 0;
            }
            now.setHours(hour);
            now.setMinutes(min);
            this.second && now.setSeconds(sec);
            if (isValidDate(now))
                return now === null || now === void 0 ? void 0 : now.toISOString();
            return now === null || now === void 0 ? void 0 : now.toString();
        };
        this.onValidate = (e, isAutoFill = false) => {
            const inputValue = isInput(e.target) ? e.target.value : this.input.value;
            if (inputValue === "") {
                this.isValid = true;
                this.dateString = "";
                this.value = "";
                return true;
            }
            const value = autoFillInputValue(inputValue, this.format, this.second);
            if (isValidInput(value, this.format, this.second)) {
                const now = this.setHourAndMin(value);
                if (value.trim() !== "") {
                    this.dateString = now;
                    this.isValid = true;
                    if (isAutoFill)
                        this.input.value = value;
                    this.value = this.dateString;
                    return true;
                }
            }
            else {
                this.isValid = false;
                this.dateString = value;
                this.value = value;
                return false;
            }
        };
        this.handleValidation = (e, isAutoFill = false) => {
            if (e.type === "hbr-change")
                e.stopPropagation();
            this.onValidating = true;
            const isValid = this.onValidate(e, isAutoFill);
            setTimeout(() => {
                this.onValidating = false;
            });
            this.hbrChange.emit({
                isValid,
                input: this.input.value,
                value: this.dateString,
                meridiem: this.meridiem,
            });
        };
        this.handleFocusout = (e) => {
            this.handleValidation(e, true);
        };
        this.handleHbrChange = (e) => {
            e.stopPropagation();
        };
        this.onKeyUp = (e) => {
            if (e && e.key === "Enter")
                this.handleValidation(e, true);
        };
        this.handleSelectChange = (e) => {
            this.meridiem = e.target.value;
            this.handleValidation(e);
        };
        this.renderTrigger = () => {
            var _a;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            return (h("div", { class: "time-picker--trigger", slot: "trigger" }, h("hbr-input", { label: this.label, required: this.required, error: this.error, size: this.size, disabled: this.disabled, part: "input", exportparts: "\n\t\t\t\t\t\terror-icon:input-error-icon, label, element, base: input-base, clear-button,\n\t\t\t\t\t\tinput: input-input, help-text, prefix, suffix\n\t\t\t\t  \t", helpText: this.helpText, ref: (e) => {
                    this.input = e;
                }, placeholder: this.placeholder
                    ? this.placeholder
                    : this.second
                        ? "hh:mm:ss"
                        : "hh:mm", onKeyUp: this.onKeyUp, "onHbr-change": this.handleHbrChange, onFocusout: this.handleFocusout }, h("div", { part: "label", slot: this.hasLabelSlot ? "label" : "" }, h("slot", { name: "label" })), h("div", { part: "help-text", slot: this.hasHelpTextSlot ? "help-text" : "" }, h("slot", { name: "help-text" })), h("slot", { name: "input-suffix", slot: "suffix" }, this.popOver && (h("hbr-icon", { class: "time-picker--icon-clock", part: "suffix-clock", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.clock) || clock })))), h("hbr-select", { part: "select", class: {
                    "time-picker--select": this.format === "12",
                }, label: this.label, ref: (ref) => {
                    this.select = ref;
                }, disabled: this.disabled, value: this.meridiem, size: this.size, "onHbr-change": this.handleSelectChange, onClick: (e) => {
                    if (this.popOver) {
                        this.dropdown.open = false;
                        e.stopPropagation();
                    }
                }, exportparts: "\n\t\t\t\t\t\tselect-anchor,\n\t\t\t\t\t\terror-icon: select-error-icon, label: select-label, element: select-element, base: select-base" }, h("hbr-option", { value: "AM" }, this.i18n.am), h("hbr-option", { value: "PM" }, this.i18n.pm))));
        };
        this.setHourMinSec = ({ hour, min, sec, }) => {
            this.hour = hour;
            this.min = min;
            if (this.second) {
                this.sec = sec;
            }
        };
        this.handleMenuItemClick = (type) => (e) => {
            var _a;
            this[type] = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.item.value;
        };
        this.renderColumn = (header, data, type) => {
            return (h("div", { class: "time-picker__column", part: "column" }, h("div", { class: "time-picker__column-header", part: "column-header" }, header), h("hbr-menu", { class: "time-picker__column-body", "data-type": type, "onHbr-select": this.handleMenuItemClick(type), part: "column-menu" }, data.map((d) => (h("hbr-menu-item", { tabindx: "0", class: "time-picker__column-item", value: d, part: "column-menu-item" }, h("div", { class: "time-picker__column-item-text", part: "column-menu-item-text" }, d)))))));
        };
        this.handleMenuItemChecked = (type, value) => {
            const menu = this.host.shadowRoot.querySelector(`hbr-menu[data-type='${type}']`);
            if (menu) {
                const items = Array.from(menu.querySelectorAll("hbr-menu-item"));
                items.forEach((item) => {
                    item.checked = item.value === value;
                    if (item.value === value) {
                        clearTimeout(this[`${type}-toid`]);
                        // async needed, scrollIntoView will cancel out the pre scrollIntoView call
                        this[`${type}-toid`] = setTimeout(() => {
                            item === null || item === void 0 ? void 0 : item.scrollIntoView({ behavior: "auto", block: "nearest" });
                        }, type === "hour" ? 0 : type === "min" ? 50 : 100);
                    }
                });
            }
        };
        this.handleNowBtnClick = () => {
            const value = formatInputPopover(this, true).value;
            value && this.setHourMinSec(getHourMinSec(value));
        };
        this.handleOKBtnClick = () => {
            const { date, value } = formatInputPopover(this);
            const dateString = date.toISOString();
            this.input.value = value;
            this.value = dateString;
            this.dropdown.open = false;
            this.hbrChange.emit({
                isValid: this.isValid,
                value: this.dateString,
                input: value,
            });
        };
        this.hour = "";
        this.min = "";
        this.sec = "";
        this.hasFocus = false;
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.meridiem = "AM";
        this.panelOpen = false;
        this.popOver = true;
        this.distance = 3;
        this.panelFitTrigger = false;
        this.open = false;
        this.name = undefined;
        this.hoist = true;
        this.placement = "bottom-start";
        this.format = "12";
        this.value = undefined;
        this.second = false;
        this.date = undefined;
        this.label = "";
        this.placeholder = undefined;
        this.helpText = "";
        this.helpTextId = "";
        this.disabled = false;
        this.required = false;
        this.error = false;
        this.size = "medium";
        this.i18n = {
            now: "Now",
            ok: "OK",
            hour: "Hour",
            min: "Min",
            sec: "Sec",
            am: "AM",
            pm: "PM",
        };
        this.invalid = false;
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleDisabledChange() {
        this.input.disabled = this.disabled;
        this.select.disabled = this.disabled;
    }
    connectedCallback() {
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleHbrChange = this.handleHbrChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleDropdownPanelShow = this.handleDropdownPanelShow.bind(this);
        this.handleHourChange = this.handleHourChange.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
        if (isValidDate(this.value)) {
            const value = getDate(this.value, this.date);
            this.setMeridiem(value);
        }
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    componentDidLoad() {
        this.handleValueChange();
    }
    /** Simulates a click on the input. */
    async setClick() {
        this.input.click();
    }
    /** Sets focus on the input. */
    async setFocus(options) {
        this.input.focus(options);
    }
    /** Removes focus from the input. */
    async removeFocus() {
        this.input.blur();
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        return this.input.reportValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        this.input.setCustomValidity(message);
        // this.invalid = !this.input?.checkValidity();
    }
    handleBlur() {
        this.hasFocus = false;
        this.hbrBlur.emit();
    }
    handleFocus() {
        this.hasFocus = true;
        this.hbrFocus.emit();
    }
    handleSlotChange() {
        this.hasContent = hasSlot(this.host);
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
    }
    // @ts-ignore
    handleValueChange(_, __, name) {
        if (this.onValidating)
            return;
        this.handlePopoverValueChange(this.value);
        const value = name === "format" ? this.dateString : this.value;
        if (!this.input)
            return;
        if (isEmpty(value)) {
            this.input.value = "";
            this.dateString = "";
            this.isValid = true;
            this.meridiem = "AM";
        }
        else if (value) {
            if (isValidDate(value)) {
                const _value = getDate(value, this.date);
                this.dateString = _value.toISOString();
                this.setMeridiem(_value);
                this.input.value = formatInput(this);
                this.isValid = true;
            }
            else {
                this.isValid = false;
                this.dateString = this.input.value;
            }
        }
        name &&
            this.hbrChange.emit({
                isValid: this.isValid,
                input: this.input.value,
                value: this.dateString,
            });
    }
    /**
     * Popover logic
     */
    handleDropdownPanelShow() {
        var _a, _b, _c;
        if (this.popOver) {
            const helpText = (_b = (_a = this.input) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector(".form-control__help-text");
            // @ts-ignore
            const offset = helpText === null || helpText === void 0 ? void 0 : helpText.offsetHeight;
            if (helpText &&
                window.getComputedStyle(helpText, null).display === "block")
                this.dropdown.distance = -offset - this.distance;
            else
                this.dropdown.distance = this.distance;
            const hourMinSec = getHourMinSec((_c = this.input) === null || _c === void 0 ? void 0 : _c.value);
            if (hourMinSec) {
                this.setHourMinSec(hourMinSec);
                const { hour, min, sec } = hourMinSec;
                this.handleMenuItemChecked("hour", hour);
                this.handleMenuItemChecked("min", min);
                this.second && this.handleMenuItemChecked("sec", sec);
            }
        }
    }
    handlePopoverValueChange(newValue) {
        const value = formatToInputValue(getDate(newValue, this.date), this.second, this.format);
        const hourMinSec = newValue
            ? getHourMinSec(value)
            : { hour: "", min: "", sec: "" };
        this.setHourMinSec(hourMinSec);
    }
    // @ts-ignore
    handleHourChange(_, __, name) {
        this.handleMenuItemChecked(name, this[name]);
    }
    render() {
        return (h(Host, { key: '54434845b6ae65dcd5b7fbab77e655f1b900bf3a' }, h("div", { key: 'd7405548332b5ad192c29731349ad430c5b4c630', part: "base", class: {
                "time-picker": true,
                "time-picker--hour-min": !this.second,
                "time-picker--hour-min-sec": this.second,
                "time-picker--disabled": this.disabled,
            } }, h("hbr-dropdown", { key: '9bde8c77313e43e0d44afc83d879eeae71f367a8', part: "dropdown", manualTrigger: !this.popOver, "onHbr-show": this.handleDropdownPanelShow, panelFitTrigger: this.panelFitTrigger, placement: this.placement, autoSize: "both", closeOnSelect: false, uncontrolled: true, ref: (el) => {
                this.dropdown = el;
            }, open: this.open, disabled: this.disabled, distance: this.distance, sentiment: "none" }, this.renderTrigger(), h("div", { key: '7f8070132d50535e7b547aa3c41b9bb28417cb50', part: "panel", class: "time-picker__panel" }, h("div", { key: '1e2a8b79641ecdc0bb17c8326322143921528abd', part: "panel-body", class: "time-picker__panel-body" }, this.renderColumn(this.i18n.hour, this._hours, "hour"), this.renderColumn(this.i18n.min, this._min, "min"), this.second &&
            this.renderColumn(this.i18n.sec, this._sec, "sec")), h("div", { key: 'f4446abfc831ebab7996465feab3144dcf252118', part: "panel-footer", class: "time-picker__panel-footer" }, h("hbr-button", { key: '69842d0792a47a7da9a185c28049faa176a54e49', part: "now-button", size: "small", variant: "text", onClick: this.handleNowBtnClick }, this.i18n.now), h("hbr-button", { key: '2fcbc2b78501ab691fa771bf876de83d1cf93620', part: "ok-button", size: "small", onClick: this.handleOKBtnClick }, this.i18n.ok)))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"],
        "popOver": ["handleValueChange"],
        "second": ["handleValueChange"],
        "format": ["handleValueChange"],
        "value": ["handleValueChange"],
        "hour": ["handleHourChange"],
        "min": ["handleHourChange"],
        "sec": ["handleHourChange"]
    }; }
    static get style() { return HbrTimePickerStyle0; }
}, [1, "hbr-time-picker", {
        "popOver": [1028, "pop-over"],
        "distance": [1538],
        "panelFitTrigger": [1540, "panel-fit-trigger"],
        "open": [516],
        "name": [513],
        "hoist": [516],
        "placement": [513],
        "format": [1537],
        "value": [1025],
        "second": [1540],
        "date": [1025],
        "label": [513],
        "placeholder": [513],
        "helpText": [513, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "disabled": [516],
        "required": [516],
        "error": [516],
        "size": [513],
        "i18n": [16],
        "invalid": [1540],
        "hour": [32],
        "min": [32],
        "sec": [32],
        "hasFocus": [32],
        "hasContent": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "meridiem": [32],
        "panelOpen": [32],
        "setClick": [64],
        "setFocus": [64],
        "removeFocus": [64],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"],
        "popOver": ["handleValueChange"],
        "second": ["handleValueChange"],
        "format": ["handleValueChange"],
        "value": ["handleValueChange"],
        "hour": ["handleHourChange"],
        "min": ["handleHourChange"],
        "sec": ["handleHourChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-time-picker", "hbr-button", "hbr-dropdown", "hbr-icon", "hbr-icon-button", "hbr-input", "hbr-menu", "hbr-menu-item", "hbr-option", "hbr-popup", "hbr-select", "hbr-select-anchor", "hbr-spinner", "hbr-tag", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-time-picker":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TimePicker);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$f();
            }
            break;
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                defineCustomElement$e();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$d();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-input":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-option":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-select":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-select-anchor":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-tag":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { TimePicker as T, defineCustomElement as d };

