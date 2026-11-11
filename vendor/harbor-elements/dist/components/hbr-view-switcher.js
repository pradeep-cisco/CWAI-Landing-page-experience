import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { F as FormControlGroup } from './form-control-group.js';
import { c as customErrorValidityState, v as valueMissingValidityState, a as validValidityState } from './form.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './button-group.js';

const viewSwitcherCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-margin:0;--label-font-size:var(--hbr-font-size-sm);--label-font-weight:var(--hbr-control-font-weight-label);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-margin:var(--hbr-spacing-sm) 0 0 0;--help-text-font-size:var(--hbr-font-size-sm);--help-text-font-weight:var(--hbr-control-font-weight);--help-text-color:var(--base-text-medium-default);--asterisk-color:var(--negative-text-default);--asterisk-margin:0 2px;--asterisk-font-weight:600;--help-text-align:var(--help-text-align-text, end);--width:100%;--display:block;display:var(--display)}.form-control-group{border:none;padding:0;margin:0;width:var(--width);display:var(--display)}.form-control-group__label-legend{font-family:var(--hbr-font-body);font-size:var(--label-font-size);font-weight:var(--label-font-weight);color:var(--label-color);padding:0px;white-space:normal;display:flex;flex-direction:row;margin:var(--label-margin)}.form-control-group--hide-fieldset .form-control-group__label-legend,.form-control-group--hide-label .form-control-group__label-legend{clip:rect(0 0 0 0);clip-path:inset(50%);height:0px;position:absolute;width:0px}.form-control-group__label-asterisk{color:var(--asterisk-color);margin:var(--asterisk-margin);font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display)}.form-control-group--has-rear .form-control__rear{padding-bottom:var(--hbr-spacing-sm)}.form-control-group--has-rear .form-control__rear{padding-top:var(--hbr-spacing-xs)}.form-control-group__children{display:flex}.form-control-group__children.form-control-group__direction-row{flex-direction:row;flex-wrap:wrap}.form-control-group__children.form-control-group__direction-column{flex-direction:column}.form-control-group__help-text{margin:var(--help-text-margin);font-size:var(--help-text-font-size);font-weight:var(--help-text-font-weight);color:var(--help-text-color);text-align:var(--help-text-align)}.form-control-group--label.form-control-group--xsmall .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-xs)}.form-control-group--label.form-control-group--small .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-sm)}.form-control-group--label.form-control-group--medium .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-md)}.form-control-group--label.form-control-group--large .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-lg)}.form-control-group--has-help-text.form-control-group--xsmall .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-xs)}.form-control-group--has-help-text.form-control-group--small .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-sm)}.form-control-group--has-help-text.form-control-group--medium .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-md)}.form-control-group--has-help-text.form-control-group--large .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-lg)}.form-control-group--error.form-control-group--label .form-control-group__label-legend,.form-control-group--error.form-control-group--has-help-text .form-control-group__help-text{color:var(--label-error-color)}.form-control-group--disabled.form-control-group--label .form-control-group__label-legend{color:var(--base-text-disabled)}:host{--display:block;--legend-margin:0 0 var(--hbr-spacing-2xs);--vs-bg-color-hover:var(--control-bg-medium-hover);--vs-border-color-hover:var(--control-border-weak-default);--vs-label-color-hover:var(--base-text-default);--vs-bg-color-active:var(--control-bg-medium-active);--vs-border-color-active:var(--control-border-active);--vs-label-color-active:var(--interact-text-weak-active);--vs-bg-color-checked:var(--control-bg-medium-active);--vs-border-color-checked:var(--control-border-active);--vs-label-color-checked:var(--interact-text-weak-active)}:host fieldset{--label-margin:var(--legend-margin)}:host ::slotted(hbr-radio-button){--bg-color-hover:var(--vs-bg-color-hover);--border-color-hover:var(--vs-border-color-hover);--label-color-hover:var(--vs-label-color-hover);--bg-color-active:var(--vs-bg-color-active);--border-color-active:var(--vs-border-color-active);--label-color-active:var(--vs-label-color-active);--bg-color-checked:var(--vs-bg-color-checked);--border-color-checked:var(--vs-border-color-checked);--label-color-checked:var(--vs-label-color-checked)}";
const HbrViewSwitcherStyle0 = viewSwitcherCss;

const ViewSwitcher = /*@__PURE__*/ proxyCustomElement(class ViewSwitcher extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.customValidityMessage = "";
        this.hasLabel = false;
        this.hasHelpTextSlot = false;
        this.errorMessage = "";
        this.defaultValue = "";
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.noFieldset = false;
        this.label = "";
        this.helpText = "";
        this.helpTextId = "";
        this.required = false;
        this.disabled = false;
        this.error = false;
        this.size = "medium";
        this.value = "";
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleValueChange() {
        const radios = this.getAllRadios();
        radios.forEach((radio) => {
            radio.checked = radio.value === this.value;
        });
    }
    /** Gets the validity state object */
    get validity() {
        const isRequiredAndEmpty = this.required && !this.value;
        const hasCustomValidityMessage = this.customValidityMessage !== "";
        if (hasCustomValidityMessage) {
            return customErrorValidityState;
        }
        if (isRequiredAndEmpty) {
            return valueMissingValidityState;
        }
        return validValidityState;
    }
    /** Gets the validation message */
    get validationMessage() {
        const isRequiredAndEmpty = this.required && !this.value;
        const hasCustomValidityMessage = this.customValidityMessage !== "";
        if (hasCustomValidityMessage) {
            return this.customValidityMessage;
        }
        if (isRequiredAndEmpty) {
            return this.validationInput.validationMessage;
        }
        return "";
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleRadioClick = this.handleRadioClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    componentDidLoad() {
        this.validationInput = this.host.shadowRoot.querySelector(".radio-group__validation-input");
        this.handleSlotChange();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    handleSlotChange() {
        var _a, _b;
        this.hasLabel = hasSlot(this.host, "label");
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        const radios = this.getAllRadios();
        radios.forEach((radio) => {
            radio.checked = radio.value === this.value;
        });
        if (!radios.some((radio) => radio.checked)) {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const buttonRadio = (_a = radios[0].shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("button");
            if (buttonRadio)
                buttonRadio.tabIndex = 0;
        }
        const buttonGroup = (_b = this.host.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("hbr-button-group");
        if (buttonGroup) {
            buttonGroup.disableRole = true;
        }
    }
    getAllRadios() {
        return [
            ...this.host.querySelectorAll("hbr-radio-button"),
        ];
    }
    handleRadioClick(event) {
        var _a;
        const target = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("hbr-radio-button");
        if (!target || target.disabled) {
            return;
        }
        const radios = this.getAllRadios();
        const oldValue = this.value;
        this.value = target.value;
        radios.forEach((radio) => {
            radio.checked = radio === target;
        });
        if (this.value !== oldValue) {
            this.hbrChange.emit();
            this.hbrInput.emit();
        }
    }
    handleKeyDown(event) {
        var _a, _b, _c;
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
            return;
        }
        const radios = this.getAllRadios().filter((radio) => !radio.disabled);
        const checkedRadio = (_a = radios.find((radio) => radio.checked)) !== null && _a !== void 0 ? _a : radios[0];
        const incr = event.key === " "
            ? 0
            : ["ArrowUp", "ArrowLeft"].includes(event.key)
                ? -1
                : 1;
        const oldValue = this.value;
        let index = radios.indexOf(checkedRadio) + incr;
        if (index < 0) {
            index = radios.length - 1;
        }
        if (index > radios.length - 1) {
            index = 0;
        }
        this.getAllRadios().forEach((radio) => {
            radio.checked = false;
        });
        this.value = radios[index].value;
        radios[index].checked = true;
        (_c = (_b = radios[index].shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("button")) === null || _c === void 0 ? void 0 : _c.focus();
        if (this.value !== oldValue) {
            this.hbrChange.emit();
            this.hbrInput.emit();
        }
        event.preventDefault();
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        const isValid = this.validity.valid;
        this.errorMessage =
            this.customValidityMessage || isValid
                ? ""
                : this.validationInput.validationMessage;
        if (this.validationInput)
            this.validationInput.hidden = true;
        clearTimeout(this.validationTimeout);
        if (!isValid && this.validationInput) {
            // Show the browser's constraint validation message
            this.validationInput.hidden = false;
            this.validationInput.reportValidity();
            this.validationTimeout = setTimeout(() => {
                this.validationInput.hidden = true;
            }, 10000);
        }
        return isValid;
    }
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    async setCustomValidity(message = "") {
        this.customValidityMessage = message;
        this.errorMessage = message;
        this.validationInput.setCustomValidity(message);
    }
    render() {
        return (h(FormControlGroup, { key: 'b37a566a49e7711fdba99e5785e108a4f53310a1', hasHelpTextSlot: this.hasHelpTextSlot, label: this.label, hasError: this.error, size: this.size, hasLabelSlot: this.hasLabel, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, helpTextId: this.helpTextId, helpText: this.helpText, isRequired: this.required, isDisabled: this.disabled, noFieldset: this.noFieldset,
            // role={"presentation"}
            errorMessage: this.errorMessage }, h("hbr-button-group", { key: 'dbe52ea607a3cb278dbcfe3bff74ec864b6e64d4', part: "button-group", exportparts: "base:button-group__base", onClick: this.handleRadioClick, onKeyDown: this.handleKeyDown, disabled: this.disabled }, h("slot", { key: 'e36e8182f98e2b645c4b1f95d0c6766a2efad350', onSlotchange: this.handleSlotChange }))));
    }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"]
    }; }
    static get style() { return HbrViewSwitcherStyle0; }
}, [1, "hbr-view-switcher", {
        "noFieldset": [4, "no-fieldset"],
        "label": [1],
        "helpText": [1, "help-text"],
        "helpTextId": [1, "help-text-id"],
        "required": [516],
        "disabled": [516],
        "error": [4],
        "size": [513],
        "value": [1537],
        "hasLabel": [32],
        "hasHelpTextSlot": [32],
        "errorMessage": [32],
        "defaultValue": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-view-switcher", "hbr-button-group"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-view-switcher":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ViewSwitcher);
            }
            break;
        case "hbr-button-group":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrViewSwitcher = ViewSwitcher;
const defineCustomElement = defineCustomElement$1;

export { HbrViewSwitcher, defineCustomElement };

