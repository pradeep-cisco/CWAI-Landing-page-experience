import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { K as toggleCheckmark } from './index2.js';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$3 } from './icon.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const switchCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{--control-height:24px;--control-width:40px;--form-control-width:100%;--font-size:var(--hbr-font-size-sm);--font-weight:var(--hbr-font-weight-normal);--letter-spacing:var(--hbr-font-letter-spacing-normal);--line-height:var(--hbr-font-line-height-normal);--label-margin:0 0 0 8px;--label-color:var(--base-text-default);--label-checked-color:var(--base-text-default);--label-disabled-color:var(--base-text-disabled);--label-white-space:nowrap;--control-color:var(--base-bg-strong-default);--control-hover-color:var(--base-bg-strong-hover);--control-checked-color:var(--control-bg-strong-default);--control-checked-hover-color:var(--control-bg-strong-hover);--control-checked-focus-color:var(--control-bg-strong-hover);--control-disabled-color:var(--base-bg-strong-disabled);--control-checked-disabled-color:var(--control-bg-strong-disabled);--thumb-size:20px;--thumb-color:var(--control-icon-in-default);--thumb-disabled-color:var(--control-icon-in-default);--thumb-box-shadow:0px 0px 6px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.18);--control-unchecked-padding-left:2px;--control-checked-padding-left:18px;--description-color:var(--base-text-medium-default);display:inline-block;--align-items:center}.form-control{width:var(--form-control-width)}.switch{display:inline-flex;align-items:var(--align-items);vertical-align:middle;cursor:pointer}.switch:not(.switch--has-description) .switch__label{margin:var(--label-margin)}.switch.switch--has-description{align-items:flex-start}.switch .main-container{margin:var(--label-margin);gap:var(--hbr-spacing-2xs)}.switch .main-container .switch__description{color:var(--description-color)}.switch__control{flex:0 0 auto;position:relative;display:inline-flex;align-items:center;width:var(--control-width);height:var(--control-height);background-color:var(--control-color);border-radius:var(--control-height);transition:var(--hbr-transition-fast) border-color, var(--hbr-transition-fast) background-color;transition:padding 0.2s ease;padding-left:var(--control-unchecked-padding-left)}.switch__control .switch__thumb{width:var(--thumb-size);height:var(--thumb-size);background-color:var(--thumb-color);border-radius:50%;box-shadow:var(--thumb-box-shadow)}.switch__control input[type=checkbox]{position:absolute;opacity:0;padding:0;margin:0;pointer-events:none}.switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover{background-color:var(--control-hover-color)}.switch--focused:not(.switch--checked):not(.switch--disabled) .switch__control{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.switch--checked .switch__control{background-color:var(--control-checked-color);padding-left:var(--control-checked-padding-left)}.switch--checked .switch__label{color:var(--label-checked-color)}.switch.switch--disabled.switch--checked .switch__control{background-color:var(--control-checked-disabled-color);padding-left:var(--control-checked-padding-left)}.switch.switch--disabled.switch--checked .switch__control .switch__thumb{box-shadow:none}.switch.switch--checked:not(.switch--disabled) .switch__control:hover{background-color:var(--control-checked-hover-color)}.switch.switch--checked:not(.switch--disabled).switch--focused .switch__control{background-color:var(--control-checked-focus-color);outline:2px solid #cce1ff;box-shadow:0px 0px 0px 4px var(--control-border-medium-focus);border-radius:var(--control-height)}.switch--disabled{cursor:not-allowed}.switch--disabled .switch__control{background-color:var(--control-disabled-color)}.switch--disabled .switch__control .switch__thumb{background-color:var(--thumb-disabled-color);box-shadow:none}.switch--disabled .switch__label{color:var(--label-disabled-color)}.switch__label{line-height:var(--line-height);user-select:none;white-space:var(--label-white-space);color:var(--label-color);font-family:var(--hbr-font-body);letter-spacing:var(--letter-spacing)}.switch__label,.main-container .switch__description{font-weight:var(--font-weight)}.switch--size-small{--thumb-size:10px;--control-width:32px;--control-unchecked-padding-left:2px;--control-checked-padding-left:14px}.switch--size-small .switch__label,.switch--size-small .main-container .switch__description{font-size:var(--hbr-font-size-xs)}.switch--size-small.switch--checked{--thumb-size:12px}.switch--size-small.switch--checked .switch__thumb hbr-icon{font-size:8px}.switch--size-medium{--thumb-size:12px}.switch--size-medium .switch__label,.switch--size-medium .main-container .switch__description{font-size:var(--font-size)}.switch--size-medium.switch--checked{--thumb-size:14px}.switch--size-medium.switch--checked .switch__thumb hbr-icon{font-size:10px}.switch--size-large{--thumb-size:24px;--control-height:28px;--control-width:48px;--control-unchecked-padding-left:2px;--control-checked-padding-left:22px}.switch--size-large .switch__label,.switch--size-large .main-container .switch__description{font-size:var(--hbr-font-size-md)}.switch--size-large.switch--checked .switch__thumb hbr-icon{font-size:12px}.switch--has-description .main-container{display:flex;flex-direction:column}.switch--checked .switch__thumb{display:flex;align-items:center;justify-content:center}.switch--checked .switch__thumb hbr-icon{color:var(--interact-icon-default);opacity:0;animation:checkmark-in 0.1s ease 0.1s forwards}.switch--checked:hover .switch__thumb hbr-icon{color:var(--interact-icon-hover)}@keyframes checkmark-in{to{opacity:1}}.switch--disabled.switch--checked .switch__thumb hbr-icon{color:var(--interact-icon-disabled)}:host{--label-white-space:normal;--align-items:flex-start;--line-height:20px}:host([size=small]) .switch{--control-height:16px;--control-width:32px;--control-unchecked-padding-left:3px;--control-checked-padding-left:calc(var(--control-width) - var(--thumb-size) - var(--control-unchecked-padding-left));--line-height:18px}:host([size=small]) .switch__label{font-size:var(--hbr-font-size-xs)}:host([size=medium]) .switch{--control-height:20px;--control-width:40px;--control-unchecked-padding-left:4px;--control-checked-padding-left:calc(var(--control-width) - var(--thumb-size) - var(--control-unchecked-padding-left))}:host([size=medium]) .switch__label{font-size:var(--hbr-font-size-sm)}:host([size=large]) .switch{--thumb-size:18px;--control-height:24px;--control-width:48px;--control-unchecked-padding-left:3px;--control-checked-padding-left:calc(var(--control-width) - var(--thumb-size) - var(--control-unchecked-padding-left))}:host([size=large]) .switch__label{font-size:var(--hbr-font-size-md)}.switch--readonly:not(.switch--disabled){cursor:default}.switch--readonly:not(.switch--disabled) .switch__label{user-select:text}.switch--readonly:not(.switch--disabled) .switch__control,.switch--readonly:not(.switch--disabled) input[type=checkbox]{cursor:default}:host([readonly]:not([disabled])) .switch:not(.switch--checked) .switch__control{border:2px solid var(--control-border-disabled, #D0D4D9);background:var(--base-bg-disabled, #F0F1F2);padding-left:2px}:host([readonly]:not([disabled])) .switch:not(.switch--checked) .switch__control .switch__thumb{background:var(--control-icon-in-medium-default, #6F7680);box-shadow:none}:host([readonly]:not([disabled])) .switch--checked .switch__control{border:2px solid var(--control-border-disabled, #D0D4D9);background:var(--base-bg-disabled, #F0F1F2);padding-left:21px}:host([readonly]:not([disabled])) .switch--checked .switch__control .switch__thumb{box-shadow:none;background:var(--control-icon-in-strong-default, #2774D9)}:host([readonly]:not([disabled])) .switch--checked .switch__control .switch__thumb hbr-icon{color:var(--control-icon-in-default, #FFF)}";
const HbrSwitchStyle0 = switchCss;

let id = 0;
const Switch = /*@__PURE__*/ proxyCustomElement(class Switch extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.switchId = `switch-${++id}`;
        this.labelId = `switch-label-${id}`;
        this._helpTextId = `switch-helpTextId-${id}`;
        this.renderContent = () => {
            return (h("span", { part: "content", id: this.labelId, class: "switch__label" }, h("slot", { onSlotchange: this.handleSlotChange })));
        };
        this.hasFocus = false;
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.hasDescriptionSlot = false;
        this.name = undefined;
        this.value = undefined;
        this.label = "";
        this.helpText = "";
        this.helpTextId = "";
        this.error = false;
        this.size = "medium";
        this.disabled = false;
        this.readonly = false;
        this.required = false;
        this.checked = false;
        this.invalid = false;
        this.arialabel = false;
        this.tooltip = undefined;
        this.autofocus = undefined;
        this.aria = undefined;
    }
    handleCheckedChange() {
        var _a;
        if (this.input) {
            this.input.checked = this.checked;
            (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.checked ? this.value || "on" : null);
        }
        this.hbrChange.emit();
    }
    handleDisabledChange() {
        // Disabled form controls are always valid, so we need to recheck validity when the state changes
        if (this.input) {
            this.input.disabled = this.disabled;
        }
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleCheckedChange = this.handleCheckedChange.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    /** Sets focus on the switch. */
    async setFocus(options) {
        this.input.focus(options);
    }
    /** Removes focus from the switch. */
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
        this.invalid = !this.input.checkValidity();
    }
    handleClick(event) {
        if (this.readonly) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            this.input.checked = this.checked;
            return;
        }
        this.checked = this.input.checked;
        this.hbrClick.emit();
    }
    handleBlur() {
        this.hasFocus = false;
        this.hbrBlur.emit();
    }
    handleFocus() {
        this.hasFocus = true;
        this.hbrFocus.emit();
    }
    handleMouseDown(event) {
        if (!this.readonly) {
            // Prevent clicks on the label from briefly blurring the input
            event.preventDefault();
        }
        this.input.focus();
    }
    renderSwitch() {
        const _helpTextId = this.helpTextId || this._helpTextId;
        const describedHelpId = _helpTextId ? _helpTextId : "";
        const tooltipId = this.tooltip ? `${this.switchId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        return (h("label", { part: "base", htmlFor: this.switchId, class: {
                switch: true,
                "switch--checked": this.checked,
                "switch--disabled": this.disabled,
                "switch--readonly": this.readonly,
                "switch--focused": this.hasFocus,
                "switch--size-small": this.size === "small",
                "switch--size-medium": this.size === "medium",
                "switch--size-large": this.size === "large",
                "switch--has-description": this.hasDescriptionSlot,
            }, onMouseDown: this.handleMouseDown }, h("span", { part: "control", class: "switch__control" }, h("span", { part: `thumb ${this.checked ? "thumb-checked" : ""}`, class: "switch__thumb" }, this.checked ? h("hbr-icon", { asset: toggleCheckmark }) : null), h("input", { part: "input", ref: (el) => {
                this.input = el;
            }, id: this.switchId, type: "checkbox", name: this.name, value: this.value, checked: this.checked, disabled: this.disabled, "aria-readonly": this.readonly ? "true" : undefined, required: this.required, role: "switch", "aria-invalid": this.invalid ? "true" : false, "aria-checked": this.checked ? "true" : "false", "aria-label": this.arialabel || this._ariaLabel, onClick: this.handleClick, onBlur: this.handleBlur, onFocus: this.handleFocus, "aria-describedby": describedId, autofocus: this.autofocus })), this.hasDescriptionSlot ? (h("span", { class: "main-container" }, this.renderContent(), h("span", { part: "description", class: "switch__description" }, h("slot", { name: "description", onSlotchange: this.handleSlotChange })))) : (this.renderContent())));
    }
    handleSlotChange() {
        var _a;
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasContent = hasSlot(this.host);
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        this._ariaLabel = ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) || this.host.textContent;
        this.hasDescriptionSlot = hasSlot(this.host, "description");
    }
    render() {
        return (h(FormControl, { key: '3a3251071dc07f67a2f82eac9674492bd51be01e', inputId: "", size: this.size, isRequired: this.required, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasHelpTextSlot: this.hasHelpTextSlot, label: this.label, helpText: this.helpText, helpTextId: this.helpTextId || this._helpTextId, hasError: this.error, isDisabled: this.disabled, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.switchId}-tooltip` : undefined }, this.renderSwitch()));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "checked": ["handleCheckedChange"],
        "disabled": ["handleDisabledChange"],
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"]
    }; }
    static get style() { return HbrSwitchStyle0; }
}, [65, "hbr-switch", {
        "name": [513],
        "value": [513],
        "label": [513],
        "helpText": [513, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "error": [516],
        "size": [513],
        "disabled": [1540],
        "readonly": [516],
        "required": [1540],
        "checked": [1540],
        "invalid": [1540],
        "arialabel": [1544],
        "tooltip": [513],
        "autofocus": [4],
        "aria": [16],
        "hasFocus": [32],
        "hasContent": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "hasDescriptionSlot": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "checked": ["handleCheckedChange"],
        "disabled": ["handleDisabledChange"],
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-switch", "hbr-icon", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-switch":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Switch);
            }
            break;
        case "hbr-icon":
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

const HbrSwitch = Switch;
const defineCustomElement = defineCustomElement$1;

export { HbrSwitch, defineCustomElement };

