import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { r as alertsNegativeLarge, _ as alertsPositiveLarge, B as remove } from './index2.js';
import { F as FormControl } from './form-control.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './icon-button.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const progressBarCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--stacked-center-medium-text-margin-right:42px;--stacked-center-small-text-margin-right:33px;--suffix-width:30px}:host{--height:var(--hbr-spacing-xs);--label-color:var(--base-text-default);--border-radius:var(--hbr-border-radius-lg);--icon-size:20px;--percentage-font-size:14px;--suffix-width:calc(var(--hbr-spacing-lg) + var(--hbr-spacing-3xs));--suffix-margin-left:var(--hbr-font-size-xs);--success-color:var(--positive-border-default);--error-color:var(--negative-border-default);--percentage-color:var(--info-border-default);--track-color:var(--base-border-default);display:block}:host([alignment=inline])::part(form-control){display:flex;align-items:center;flex-wrap:wrap}:host([alignment=inline])::part(element){margin-left:var(--suffix-margin-left, 12px);flex-grow:1;flex-shrink:1;align-self:flex-start;width:auto}:host([alignment=inline])::part(help-text){width:100%}:host([alignment=stacked-center])::part(form-control){display:flex;flex-direction:column;align-items:center}:host([alignment=stacked-center]) .form-control--small .form-control__label,:host([alignment=stacked-center]) .form-control--small .form-control__help-text{margin-right:var(--stacked-center-small-text-margin-right)}:host([alignment=stacked-center]) .form-control--medium .form-control__label,:host([alignment=stacked-center]) .form-control--medium .form-control__help-text{margin-right:var(--stacked-center-medium-text-margin-right)}:host([alignment=stacked-center][indeterminate])::part(form-control){display:flex;flex-direction:column;align-items:center}:host([alignment=stacked-center][indeterminate]) .form-control--small .form-control__label,:host([alignment=stacked-center][indeterminate]) .form-control--small .form-control__help-text,:host([alignment=stacked-center][indeterminate]) .form-control--medium .form-control__label,:host([alignment=stacked-center][indeterminate]) .form-control--medium .form-control__help-text{margin-right:0}.progress-bar{display:flex;flex-direction:row;justify-content:center;align-items:center;width:100%}.progress-bar .progress-bar__suffix i.progress-bar__icon-stop{display:none}.progress-bar .progress-bar__suffix i.progress-bar__icon-stop hbr-icon-button,.progress-bar .progress-bar__suffix i.progress-bar__icon-stop ::slotted(hbr-icon-button){--padding:0px}.progress-bar__track{width:100%;position:relative;background-color:var(--track-color);height:var(--height);border-radius:var(--border-radius);overflow:hidden}.progress-bar__percentage{height:100%;font-family:var(--hbr-font-body);font-size:12px;font-weight:var(--hbr-font-weight-normal);background-color:var(--percentage-color);color:var(--label-color);text-align:center;line-height:var(--height);white-space:nowrap;overflow:hidden;transition:width 400ms ease 0s, background-color 400ms ease 0s;user-select:none;border-radius:var(--border-radius)}.progress-bar--inanimate .progress-bar__percentage{transition:none}.progress-bar--indeterminate .progress-bar__percentage{position:absolute;animation:indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1)}@keyframes indeterminate{0%{left:-50%;width:50%}75%,100%{left:100%;width:50%}}.form-control__element{width:100%;display:flex;justify-content:center}.progress-bar--success{--percentage-color:var(--success-color)}.progress-bar--success hbr-icon,.progress-bar--success ::slotted(hbr-icon){color:var(--success-color);font-size:var(--icon-size)}.progress-bar--error{--percentage-color:var(--error-color)}.progress-bar--error hbr-icon,.progress-bar--error ::slotted(hbr-icon){color:var(--error-color);font-size:var(--icon-size)}.progress-bar__suffix{min-width:var(--suffix-width);margin-left:var(--suffix-margin-left);display:flex;justify-content:flex-start;align-items:center}.progress-bar__suffix .progress-bar__value{color:var(--base-text-default);font-size:var(--percentage-font-size);font-weight:var(--hbr-font-weight-normal);line-height:20px}.progress-bar__suffix i.progress-bar__icon{display:flex;justify-content:flex-start;align-items:center;font-size:20px}.progress-bar--stop .progress-bar__suffix{cursor:pointer}.progress-bar--stop .progress-bar__suffix:hover{cursor:pointer}.progress-bar--stop .progress-bar__suffix:hover .progress-bar__value{display:none}.progress-bar--stop .progress-bar__suffix:hover .progress-bar__icon-stop{display:flex}.form-control__label{font-weight:var(--hbr-font-weight-semibold, 600);font-size:var(--hbr-font-size-sm, 14px);line-height:20px;color:var(--base-text-default)}.form-control__help-text{font-weight:var(--hbr-font-weight-normal, 400);font-size:var(--hbr-font-size-xs, 12px);line-height:18px;color:var(--base-text-medium-default)}.form-control__help-text.error{color:var(--negative-text-default)}.form-control--medium .progress-bar--suffix{min-height:24px}.form-control--medium .progress-bar--label-without-suffix{min-height:24px}.form-control--medium .progress-bar--indeterminate{min-height:24px}.form-control--medium .progress-bar__track{height:8px}.form-control--medium .progress-bar__suffix{--suffix-width:42px;--suffix-margin-left:12px;font-size:14px}.form-control--small .progress-bar--suffix{min-height:18px}.form-control--small .progress-bar--label-without-suffix{min-height:18px}.form-control--small .progress-bar--indeterminate{min-height:18px}.form-control--small .form-control__label{font-size:12px;font-weight:600;line-height:18px}.form-control--small .progress-bar__suffix{--suffix-width:33px;--suffix-margin-left:8px;font-size:12px}.form-control--small .progress-bar__suffix .progress-bar__value{font-size:12px;font-weight:400;line-height:18px}.form-control--small .progress-bar__suffix i.progress-bar__icon{font-size:16px}.form-control--small .progress-bar__suffix i.progress-bar__icon hbr-icon{--icon-size:16px}.form-control--small .progress-bar__track{height:6px}";
const HbrProgressBarStyle0 = progressBarCss;

const ProgressBar = /*@__PURE__*/ proxyCustomElement(class ProgressBar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrStop = createEvent(this, "hbr-stop", 7);
        this.uuid = generateShortID();
        this._helpTextId = `progress-bar-helpTextId-${this.uuid}`;
        this.labelId = `progress-bar-label-${this.uuid}`;
        this.hasFocus = false;
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.percentage = 0;
        this.indeterminate = false;
        this.error = false;
        this.noSuffix = false;
        this.disabled = false;
        this.required = false;
        this.size = "medium";
        this.alignment = "stacked";
        this.label = "";
        this.helpText = "";
        this.helpTextId = "";
        this.indicator = true;
        this.inanimate = false;
        this.noncancelable = false;
        this.aria = undefined;
    }
    renderIndicator() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return this.error ? (h("i", { part: "error", class: "progress-bar__icon" }, h("slot", { name: "error" }, h("hbr-icon", { part: "error-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["alerts-negative-large"]) ||
                alertsNegativeLarge })))) : this.percentage === 100 ? (h("i", { part: "success", class: "progress-bar__icon" }, h("slot", { name: "success" }, h("hbr-icon", { part: "success-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["alert-positive-large"]) || alertsPositiveLarge })))) : this.indeterminate ? null : (h("span", { class: "progress-bar__value", part: "percentage-text" }, h("slot", { name: "percentage" }, this.percentage, "%")));
    }
    handleSlotChange() {
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasContent = hasSlot(this.host);
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
    }
    render() {
        var _a, _b, _c;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const isStop = !this.noncancelable &&
            this.percentage !== 100 &&
            !this.error &&
            !this.indeterminate;
        return (h(Host, { key: '37611f39cf64645dc888621440ee9aa324ce489e' }, h(FormControl, { key: '19f224cf6b8af68bfd2b8b9669f91bd5740beef8', inputId: "", labelId: this.labelId, size: this.size, isRequired: this.required, hasLabelSlot: this.hasLabelSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, hasHelpTextSlot: this.hasHelpTextSlot, label: this.label, helpText: this.helpText, helpTextId: this.helpTextId || this._helpTextId, hasError: this.error, isDisabled: this.disabled }, h("div", { key: 'be101a7d7a28200b85e2a5533999f0ce3d65c889', part: "base", class: {
                "progress-bar": true,
                "progress-bar--success": this.percentage === 100,
                "progress-bar--indeterminate": this.indeterminate,
                "progress-bar--error": this.error,
                "progress-bar--stop": isStop,
                "progress-bar--suffix": !this.noSuffix,
                "progress-bar--label-without-suffix": this.noSuffix && this.label !== "",
                "progress-bar--inanimate": this.inanimate,
            }, role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": this.indeterminate ? null : this.percentage, tabIndex: this.disabled ? -1 : 0, "aria-label": (_b = this.aria) === null || _b === void 0 ? void 0 : _b.label, "aria-labelledby": this.label ? this.labelId : ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.labelledby) || "", "aria-describedby": this.helpText ? this._helpTextId : "" }, h("div", { key: '62412de26f21fa6d4283cbcaa0fcb8b3429ce0b7', class: "progress-bar__track", part: "track" }, h("div", { key: '35c7d4e589c0c251ff2bf5bfb2400d14dde81fb9', part: "percentage", class: "progress-bar__percentage", style: {
                width: `${this.percentage}%`,
            } }, !this.indeterminate && (h("span", { part: "label", class: "progress-bar__label" }, h("slot", null))))), !this.noSuffix && (h("div", { part: "suffix", class: "progress-bar__suffix" }, h("slot", { name: "suffix" }, this.indicator && this.renderIndicator(), isStop && (h("i", { class: "progress-bar__icon progress-bar__icon-stop" }, h("slot", { name: "stop" }, h("hbr-icon-button", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, arialabel: "Stop progress", onClick: (event) => this.hbrStop.emit({ event }) })))))))))));
    }
    get host() { return this; }
    static get style() { return HbrProgressBarStyle0; }
}, [1, "hbr-progress-bar", {
        "percentage": [514],
        "indeterminate": [516],
        "error": [516],
        "noSuffix": [4, "no-suffix"],
        "disabled": [516],
        "required": [516],
        "size": [513],
        "alignment": [513],
        "label": [513],
        "helpText": [513, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "indicator": [4],
        "inanimate": [4],
        "noncancelable": [4],
        "aria": [16],
        "hasFocus": [32],
        "hasContent": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-progress-bar", "hbr-icon", "hbr-icon-button", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-progress-bar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ProgressBar);
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
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { ProgressBar as P, defineCustomElement as d };

