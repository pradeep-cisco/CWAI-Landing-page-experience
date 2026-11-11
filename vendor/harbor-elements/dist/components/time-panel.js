import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';
import { g as getDefaultTime } from './util.js';
import { d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './menu.js';
import { d as defineCustomElement$1 } from './menu-item.js';

const timePanelCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--max-height:300px;--footer-width:100%;--column-width:100%;--column-menu-width:60px;--panel-border-width:2px;--column-left-border-color:var(--control-border-weak-default);--column-left-border-not-first-type:1px solid var(--column-left-border-color);--column-header-justify-content:flex-start;--column-header-font-weight:var(--hbr-font-weight-semibold, 600);--column-header-border-bottom:1px solid var(--column-left-border-color);--column-header-color:var(--base-text-medium-default);--column-header-padding:var(--hbr-spacing-xs, 8px) var(--hbr-spacing-sm, 12px) var(--hbr-spacing-2xs, 4px);--column-item-text-color:var(--base-text-default);--column-item-text-width:60px;--column-item-text-padding:8px 12px;--column-item-text-justify-content:flex-start;--panel-footer-font-weight:var(--hbr-font-weight-bold);--checkbox-checked-background-color:var(--control-bg-weak-active);display:flex;flex-direction:row;width:var(--host-width)}.time-panel--hour-min .time-panel__body{display:grid;grid-template-columns:1fr 1fr}.time-panel--hour-min-sec .time-panel__body{display:grid;grid-template-columns:1fr 1fr 1fr}.time-panel--has-footer .time-panel__footer{position:absolute;box-sizing:border-box;border-top:var(--footer-border-top, 1px solid var(--base-border-default));bottom:var(--panel-border-width);width:var(--footer-width);background:var(--control-bg-weak-default);border-bottom-right-radius:var(--hbr-border-radius-md);border-bottom-left-radius:var(--hbr-border-radius-md);font-weight:var(--panel-footer-font-weight)}.time-panel--has-footer .time-panel__footer ::slotted([slot=footer]){height:var(--footer-height, 50px);padding:var(--footer-padding, 8px);display:flex;flex-direction:row;justify-content:space-between;align-items:center}.time-panel__column{position:relative;width:var(--column-menu-width)}.time-panel__column hbr-menu{--box-shadow:none;--padding:none;--border-radius:0px;--border:none;--width:var(--column-width)}.time-panel__column hbr-menu::part(base){margin-bottom:var(--menu-margin-bottom)}.time-panel__column:first-of-type{border-left:var(--column-left-border-first-type)}.time-panel__column:not(div:first-of-type){border-left:var(--column-left-border-not-first-type, 1px solid var(--column-left-border-color))}.time-panel__column-header{display:var(--column-header-display, flex);justify-content:var(--column-header-justify-content, center);flex-direction:var(--column-header-flex-direction);align-items:var(--column-header-align-items, center);height:var(--column-header-height, 32px);line-height:var(--line-height, 18px);font-size:var(--column-header-font-size, var(--hbr-font-size-xs, 12px));font-weight:var(--column-header-font-weight);color:var(--column-header-color);border-bottom:var(--column-header-border-bottom);padding:var(--column-header-padding)}.time-panel__column-body{display:flex;flex-direction:column;max-height:var(--max-height);overflow-y:auto;-ms-overflow-style:none;scrollbar-width:none;}.time-panel__column-body::-webkit-scrollbar{display:none}.time-panel__column-item-text{display:flex;align-items:center;justify-content:var(--column-item-text-justify-content, center);color:var(--column-item-text-color);font-weight:400;font-size:14px;line-height:20px;padding:var(--column-item-text-padding, 8px 12px);width:var(--column-item-text-width)}hbr-menu-item.time-panel__column-item{--padding:var(--column-menu-item-padding, 0px)}hbr-menu-item.time-panel__column-item::part(base){--hover-background:var(--control-bg-weak-hover);--checked-background-color:var(--control-bg-weak-active);--checkbox-checked-background-color:var(--checked-background-color, var(--control-bg-weak-active));--padding:0px;--column-menu-item-padding:var(--column-menu-item-padding, 0px)}";
const HbrTimePanelStyle0 = timePanelCss;

const TimePanel = /*@__PURE__*/ proxyCustomElement(class TimePanel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrMenuClick = createEvent(this, "hbr-menu-click", 7);
        this.renderColumn = (header, data, type) => {
            return (h("div", { class: "time-panel__column", part: "column" }, h("div", { class: "time-panel__column-header", part: "column-header" }, header), h("hbr-menu", { class: "time-panel__column-body", part: "column-menu", exportparts: "base: column-menu-base", "data-type": type === "minute" ? "min" : type === "second" ? "sec" : type, "onHbr-select": (event) => {
                    var _a;
                    event.preventDefault();
                    event.stopPropagation();
                    this.hbrMenuClick.emit({
                        type,
                        item: (_a = event.detail) === null || _a === void 0 ? void 0 : _a.item,
                    });
                } }, data.map((d) => (h("hbr-menu-item", { exportparts: "\n\t\t\t\t\t\t\t\tbase: column-menu-item, wrapper, checked-icon, nested, prefix, label, suffix,\n\t\t\t\t\t\t\t\tcheck-mark, icon-checked, trigger-gap, trigger-gap-fixed\n\t\t\t\t\t\t\t", class: "time-panel__column-item", value: d, checked: this[type] === d }, h("div", { class: "time-panel__column-item-text", part: "column-menu-item-text" }, d)))))));
        };
        this.hours = Array.from({ length: 24 }, (_, i) => getDefaultTime(i));
        this.minutes = Array.from({ length: 60 }, (_, i) => getDefaultTime(i));
        this.seconds = Array.from({ length: 60 }, (_, i) => getDefaultTime(i));
        this.hour = undefined;
        this.minute = undefined;
        this.second = undefined;
        this.i18n = {
            hour: "Hour",
            min: "Min",
            sec: "Sec",
        };
        this.showSeconds = false;
        this.disabled = false;
        this.hasFooterSlot = false;
    }
    // @ts-ignore
    handleHourChange(_, __, name) {
        this.handleMenuItemChecked(name, this[name]);
    }
    handleMenuItemChecked(type, value) {
        const menu = this.host.shadowRoot.querySelector(`hbr-menu[data-type='${type}']`);
        if (menu) {
            const items = Array.from(menu.querySelectorAll("hbr-menu-item"));
            items.forEach((item) => {
                item.checked = item.value === value;
                if (item.value === value) {
                    clearTimeout(this[`${type}-void`]);
                    // async needed, scrollIntoView will cancel out the pre scrollIntoView call
                    this[`${type}-void`] = setTimeout(() => {
                        item === null || item === void 0 ? void 0 : item.scrollIntoView({ behavior: "auto", block: "nearest" });
                    }, type === "hour" ? 0 : type === "min" ? 50 : 100);
                }
            });
        }
    }
    handleSlotchange() {
        this.hasFooterSlot = hasSlot(this.host, "footer");
    }
    render() {
        return (h(Host, { key: 'ba66c9f8004ca70732a0a680762aa7cf8775c1c2' }, h("div", { key: '2e3236db97ea8670e51f1e214c022560f3aba3b1', part: "panel base", class: {
                "time-panel": true,
                "time-panel--hour-min": !this.showSeconds,
                "time-panel--hour-min-sec": this.showSeconds,
                "time-panel--disabled": this.disabled,
                "time-panel--has-footer": this.hasFooterSlot,
            } }, h("div", { key: '4ff01fe4b8b3ba60f6fb6946232a1b8c37c74846', part: "panel-body", class: "time-panel__body" }, this.renderColumn(this.i18n.hour, this.hours, "hour"), this.renderColumn(this.i18n.min, this.minutes, "minute"), this.showSeconds &&
            this.renderColumn(this.i18n.sec, this.seconds, "second")), h("div", { key: 'd7b597cf4b371d35d4567736f6110bd1a2228576', part: "panel-footer", class: "time-panel__footer" }, h("slot", { key: '0200b3f3bdf8f488e833238c7bb23cf781eb21c7', name: "footer", onSlotchange: () => this.handleSlotchange() })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "hour": ["handleHourChange"],
        "minute": ["handleHourChange"],
        "second": ["handleHourChange"]
    }; }
    static get style() { return HbrTimePanelStyle0; }
}, [1, "hbr-time-panel", {
        "hours": [1040],
        "minutes": [1040],
        "seconds": [1040],
        "hour": [1537],
        "minute": [1537],
        "second": [1537],
        "i18n": [16],
        "showSeconds": [1540, "show-seconds"],
        "disabled": [516],
        "hasFooterSlot": [32]
    }, undefined, {
        "hour": ["handleHourChange"],
        "minute": ["handleHourChange"],
        "second": ["handleHourChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-time-panel", "hbr-icon", "hbr-menu", "hbr-menu-item"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-time-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TimePanel);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { TimePanel as T, defineCustomElement as d };

