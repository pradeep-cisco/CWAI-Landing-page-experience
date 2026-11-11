import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { T as checkboxIndeterminate, U as checkboxUnselected, V as checkboxSelected } from './index2.js';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const checkboxCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{--padding:none;--height:none;--width:none;--size:var(--hbr-font-size-md);--form-control-width:100%;--label-width:fit-content;--font-family:var(--hbr-font-family-sans);--font-weight:var(--hbr-font-weight-normal);--font-size:var(--hbr-font-size-sm);--label-color:var(--base-text-default);--label-hover-color:var(--base-text-default);--label-margin:0 0 0 var(--hbr-spacing-xs);--label-disabled-color:var(--base-text-disabled);--label-checked-color:var(--base-text-default);--control-border-radius:var(--hbr-border-radius-sm);--control-color:var(--control-icon-weak-default);--control-hover-color:var(--control-border-hover);--control-focused-color:var(--control-icon-strong-focus);--focus-ring:var(--hbr-focus-ring);--checkbox-default-stroke-width:2px;--checkbox-focus-icon-color:var(--control-border-default);--checkbox-focus-box-shadow:var(--hbr-focus-ring);--checkbox-focus-outline:var(--hbr-focus-outline);--checkbox-focus-outline-offset:var(--hbr-focus-ring-width);--description-color:var(--base-text-medium-default);--element-suffix-gap:4px;display:flex;height:fit-content}:host([size=small]){--left-shift:calc(var(--hbr-font-size-md) + var(--hbr-spacing-xs))}:host([size=medium]){--left-shift:calc(20px + var(--hbr-spacing-xs))}:host([size=large]){--left-shift:calc(var(--hbr-font-size-xl) + var(--hbr-spacing-xs))}.form-control{width:var(--form-control-width)}.form-control__input{display:flex}.checkbox{display:inline-flex;align-items:center;vertical-align:middle;cursor:pointer;padding:var(--padding);height:var(--height);width:var(--width)}.checkbox__control{flex:0 0 auto;position:relative;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--control-border-radius);color:var(--control-color);font-size:var(--size);transition:var(--hbr-transition-fast) border-color, var(--hbr-transition-fast) background-color, var(--hbr-transition-fast) color, var(--hbr-transition-fast) box-shadow}.checkbox__control input[type=checkbox]{position:absolute;opacity:0;padding:0;margin:0}.checkbox__control input[type=checkbox]:not(:disabled){cursor:pointer}.checkbox__control input[type=checkbox]:disabled{cursor:not-allowed}.checkbox__control .checkbox__icon{display:inline-flex}.checkbox__control .checkbox__icon svg{width:100%;height:100%}.checkbox .checkbox__label{font-family:var(--font-family);color:var(--label-color);user-select:none;width:var(--label-width)}.checkbox .checkbox__label,.checkbox .main-container .checkbox__description{font-weight:var(--font-weight);font-size:calc(var(--size) - 2px)}.checkbox:not(.checkbox--disabled):hover .checkbox__label{color:var(--label-hover-color)}.checkbox:not(.checkbox--has-description) .checkbox__label{margin:var(--label-margin)}.checkbox.checkbox--has-description{align-items:flex-start}.checkbox.checkbox--has-description .checkbox__label{--label-color:var(--base-text-default);font-weight:var(--hbr-font-weight-semibold)}.checkbox .main-container{margin:var(--label-margin);gap:var(--hbr-spacing-2xs)}.checkbox .main-container .checkbox__description{color:var(--description-color)}.checkbox:not(.checkbox--checked):not(.checkbox--indeterminate):not(.checkbox--disabled):hover .checkbox__control hbr-icon{color:var(--control-hover-color)}.checkbox.checkbox--focused:not(.checkbox--disabled) .checkbox__control{outline:var(--checkbox-focus-outline);box-shadow:var(--checkbox-focus-box-shadow);outline-offset:var(--checkbox-focus-outline-offset)}.checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,.checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover{border-color:var(--control-hover-color)}.checkbox--disabled{opacity:0.9;cursor:not-allowed}.checkbox.checkbox--disabled .checkbox__label{color:var(--label-disabled-color)}.checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__label,.checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__label{color:var(--label-checked-color)}.checkbox--size-small .checkbox__control{font-size:var(--hbr-font-size-md, 16px)}.checkbox--size-small .checkbox__label,.checkbox--size-small .main-container .checkbox__description{font-size:var(--hbr-font-size-xs)}.checkbox--size-medium .checkbox__control{font-size:20px}.checkbox--size-medium .checkbox__label{line-height:20px}.checkbox--size-large .checkbox__control{font-size:var(--hbr-font-size-xl, 24px)}.checkbox--size-large .checkbox__label,.checkbox--size-large .main-container .checkbox__description{font-size:var(--hbr-font-size-lg)}.checkbox--has-description .main-container{display:flex;flex-direction:column}.checkbox--error .checkbox__control{--path-fill-color-0:var(--control-bg-weak-default);--hbr-focus-outline:var(--hbr-focus-outline-error);--focus-ring:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.checkbox--disabled .checkbox__control{--path-fill-color-0:var(--control-bg-weak-disabled)}.checkbox--default .checkbox__control{--path-fill-color-0:var(--control-bg-weak-default)}.checkbox:not(.checkbox--disabled) .checkbox__icon_selected:hover hbr-icon,.checkbox:not(.checkbox--disabled) .checkbox__icon_indeterminate:hover hbr-icon{color:var(--control-bg-strong-hover);--path-color-0:var(--control-bg-strong-hover);--path-color-2:var(--control-bg-strong-hover);--path-fill-color-0:var(--control-bg-strong-hover)}.checkbox:not(.checkbox--disabled).checkbox--error .checkbox__control{box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.checkbox.checkbox--disabled .checkbox__icon_default hbr-icon{color:var(--control-border-disabled);--path-color-2:var(--control-bg-weak-disabled)}.checkbox:not(.checkbox--disabled).checkbox--error .checkbox__control{box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.checkbox:not(.checkbox--disabled) .checkbox__icon_default hbr-icon{--path-color-0:var(--control-border-default)}.checkbox:not(.checkbox--disabled):focus-within .checkbox__icon_default hbr-icon{--path-color-0:var(--checkbox-focus-icon-color)}.checkbox:not(.checkbox--disabled):hover .checkbox__icon_default hbr-icon{--path-color-0:var(--control-border-hover)}.checkbox:not(.checkbox--disabled).checkbox--error .checkbox__icon_error hbr-icon{--path-color-0:var(--negative-border-medium-active)}.checkbox .checkbox__icon_selected hbr-icon,.checkbox .checkbox__icon_indeterminate hbr-icon{color:var(--control-bg-strong-default);--path-color-0:var(--control-bg-strong-default);--path-color-2:var(--control-bg-strong-default);--path-fill-color-0:var(--control-bg-strong-default);--path-color-contrast:var(--control-icon-in-active)}.checkbox.checkbox--disabled .checkbox__icon_selected hbr-icon,.checkbox.checkbox--disabled .checkbox__icon_indeterminate hbr-icon{color:var(--control-border-disabled);--path-fill-color-0:var(--control-bg-weak-disabled);--path-color-1:var(--control-border-disabled);--path-color-2:var(--control-bg-weak-disabled);--path-color-0:var(--control-border-disabled);--path-color-contrast:var(--control-icon-in-disabled)}.checkbox--readonly{cursor:default}.checkbox--readonly .checkbox__label{user-select:text}.checkbox--readonly input[type=checkbox]{cursor:default}.checkbox--readonly.checkbox--default .checkbox__icon_default hbr-icon,.checkbox--readonly.checkbox--default:hover .checkbox__icon_default hbr-icon{pointer-events:none;--path-color-0:var(--control-border-disabled, #D0D4D9);--path-fill-color-0:var(--base-bg-disabled, #F0F1F2)}.checkbox--readonly.checkbox--indeterminate .checkbox__icon_indeterminate hbr-icon,.checkbox--readonly.checkbox--indeterminate:hover .checkbox__icon_indeterminate hbr-icon{pointer-events:none;--path-color-0:var(--control-border-disabled, #D0D4D9);--path-fill-color-0:var(--base-bg-disabled, #F0F1F2);--path-color-contrast:var(--control-icon-weak-default, #7E868F)}.checkbox--readonly.checkbox--checked .checkbox__icon_selected hbr-icon,.checkbox--readonly.checkbox--checked:hover .checkbox__icon_selected hbr-icon{pointer-events:none;--path-color-0:var(--control-border-disabled, #D0D4D9);--path-fill-color-0:var(--base-bg-disabled, #F0F1F2);--path-color-contrast:var(--control-icon-weak-default, #7E868F)}:host-context([data-theme=onecd]){--onecd-border-width-default:1px;--checkbox-default-stroke-width:var(--onecd-border-width-default);--checkbox-focus-icon-color:var(--control-border-focus);--checkbox-focus-box-shadow:inset 0 0 0 1px #cfe2ff,\n    0 0 0 2px #cfe2ff;--checkbox-focus-outline:2px solid var(--control-icon-strong-focus);--checkbox-focus-outline-offset:1px}";
const HbrCheckboxStyle0 = checkboxCss;

let id = 0;
const Checkbox = /*@__PURE__*/ proxyCustomElement(class Checkbox extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.inputId = `checkbox-${++id}`;
        this.labelId = `checkbox-label-${id}`;
        this._helpTextId = `checkbox-helpTextId-${id}`;
        this.renderIcon = () => {
            var _a;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            if (this.indeterminate) {
                return (h("span", { part: "indeterminate-icon-wrapper", class: "checkbox__icon checkbox__icon_indeterminate" }, h("hbr-icon", { part: "indeterminate-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["checkbox-indeterminate"]) ||
                        checkboxIndeterminate })));
            }
            if (this.error && !this.checked && !this.indeterminate && !this.disabled) {
                return (h("span", { part: "error-icon-wrapper", class: "checkbox__icon checkbox__icon_error" }, h("hbr-icon", { part: "error-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["checkbox-unselected"]) || checkboxUnselected })));
            }
            if (!this.checked && !this.indeterminate) {
                return (h("span", { part: "default-icon-wrapper", class: "checkbox__icon checkbox__icon_default" }, h("hbr-icon", { part: "default-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["checkbox-unselected"]) || checkboxUnselected })));
            }
            if (this.checked) {
                return (h("span", { part: "checked-icon-wrapper", class: "checkbox__icon checkbox__icon_selected" }, h("hbr-icon", { part: "checked-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["checkbox-selected"]) || checkboxSelected })));
            }
        };
        this.renderContent = () => {
            return (h("span", { part: `content ${this.checked ? "content-checked" : ""}`, id: this.labelId, class: { checkbox__label: this.hasContent } }, h("slot", { onSlotchange: this.handleSlotChange })));
        };
        this.hasFocus = false;
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.hasElementSuffix = false;
        this.hasDescriptionSlot = false;
        this.name = undefined;
        this.value = undefined;
        this.label = "";
        this.helpText = "";
        this.helpTextId = "";
        this.disabled = false;
        this.readonly = false;
        this.required = false;
        this.error = false;
        this.size = "medium";
        this.checked = false;
        this.indeterminate = false;
        this.invalid = false;
        this.sentiment = "interact";
        this.tooltip = undefined;
        this.autofocus = undefined;
        this.aria = undefined;
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        this.handleClick = this.handleClick.bind(this);
        this.setCheck = this.setCheck.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleCheckedChange = this.handleCheckedChange.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleOnClickFireOnce = this.handleOnClickFireOnce.bind(this);
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
    handleCheckedChange() {
        var _a;
        if (this.input) {
            this.input.checked = this.checked;
            this.input.indeterminate = this.indeterminate;
            this.hbrChange.emit({ checked: this.checked });
            (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.checked ? this.value || "on" : null);
        }
    }
    handleDisabledChange() {
        // Disabled form controls are always valid, so we need to recheck validity when the state changes
        if (this.input) {
            this.input.disabled = this.disabled;
        }
    }
    componentDidLoad() {
        this.input.indeterminate = this.indeterminate;
        if (this.indeterminate)
            this.input.checked = true;
        setTimeout(() => {
            if (this.autofocus && document.activeElement !== this.host) {
                this.input.focus();
            }
        });
    }
    /** Simulates a click on the radio. */
    async setClick() {
        this.input.click();
    }
    /** Sets focus on the checkbox. */
    async setFocus(options) {
        this.input.focus(options);
    }
    /** Removes focus from the checkbox. */
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
    }
    handleClick(event) {
        if (this.readonly) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            this.input.checked = this.checked;
            this.input.indeterminate = this.indeterminate;
            return;
        }
        this.checked = this.input.checked;
        this.indeterminate = false;
        this.hbrClick.emit({ event });
    }
    async setCheck() {
        this.handleClick();
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
        // Allow text selection in the read-only state while keeping the checkbox focusable.
        if (!this.readonly) {
            // Prevent clicks on the label from briefly blurring the input
            event.preventDefault();
        }
        this.input.focus();
    }
    handleKeyDown(event) {
        if (event.code === "Space") {
            event.preventDefault();
            this.input.click();
        }
    }
    handleOnClickFireOnce(e) {
        if (e.target !== this.input) {
            e.stopPropagation();
        }
    }
    renderCheckbox() {
        const describedHelpId = this.helpTextId || this.hasHelpTextSlot ? this._helpTextId : "";
        const tooltipId = this.tooltip ? `${this.inputId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        return (h("label", { part: "base", class: {
                checkbox: true,
                "checkbox--default": !this.checked &&
                    !this.indeterminate &&
                    !this.disabled &&
                    !this.error,
                "checkbox--checked": this.checked,
                "checkbox--disabled": this.disabled,
                "checkbox--readonly": this.readonly,
                "checkbox--focused": this.hasFocus,
                "checkbox--indeterminate": this.indeterminate,
                "checkbox--error": this.error,
                "checkbox--size-small": this.size === "small",
                "checkbox--size-medium": this.size === "medium",
                "checkbox--size-large": this.size === "large",
                "checkbox--has-description": this.hasDescriptionSlot,
            }, htmlFor: this.inputId, onMouseDown: this.handleMouseDown, onKeyDown: this.handleKeyDown, onClick: this.handleOnClickFireOnce }, h("span", { part: `control ${this.hasFocus ? "control-focus" : ""}`, class: "checkbox__control" }, this.renderIcon(), h("input", { part: "input", ref: (el) => {
                this.input = el;
            }, id: this.inputId, type: "checkbox", name: this.name, value: this.value, checked: this.checked, disabled: this.disabled, required: this.required, role: "checkbox", "aria-checked": this.indeterminate ? "mixed" : this.checked ? "true" : "false", "aria-readonly": this.readonly ? "true" : undefined, "aria-describedby": describedId, "aria-invalid": this.invalid ? "true" : false, onClick: this.handleClick, onBlur: this.handleBlur, onFocus: this.handleFocus, autofocus: this.autofocus, "aria-label": this._ariaLabel })), this.hasDescriptionSlot ? (h("span", { class: "main-container" }, this.renderContent(), h("span", { part: "description", class: "checkbox__description" }, h("slot", { name: "description", onSlotchange: this.handleSlotChange })))) : (this.renderContent())));
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
        this.hasElementSuffix = hasSlot(this.host, "element-suffix");
        this.hasDescriptionSlot = hasSlot(this.host, "description");
    }
    render() {
        return (h(Host, { key: '041e877b182d199b94b0148aa4905595efd217c3' }, h(FormControl, { key: 'f817823636ae83cc06424473730c0189518147d0', inputId: "", labelId: this.labelId, size: this.size, isRequired: this.required, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasElementSuffix: this.hasElementSuffix, hasHelpTextSlot: this.hasHelpTextSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, label: this.label, helpText: this.helpText, helpTextId: this.helpTextId || this._helpTextId, hasError: this.error, isDisabled: this.disabled, tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.inputId}-tooltip` : undefined }, this.renderCheckbox())));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "checked": ["handleCheckedChange"],
        "indeterminate": ["handleCheckedChange"],
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrCheckboxStyle0; }
}, [65, "hbr-checkbox", {
        "name": [513],
        "value": [513],
        "label": [513],
        "helpText": [513, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "disabled": [516],
        "readonly": [516],
        "required": [516],
        "error": [516],
        "size": [513],
        "checked": [1540],
        "indeterminate": [1540],
        "invalid": [1540],
        "sentiment": [1537],
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
        "hasElementSuffix": [32],
        "hasDescriptionSlot": [32],
        "setClick": [64],
        "setFocus": [64],
        "removeFocus": [64],
        "reportValidity": [64],
        "setCustomValidity": [64],
        "setCheck": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "checked": ["handleCheckedChange"],
        "indeterminate": ["handleCheckedChange"],
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-checkbox", "hbr-icon", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-checkbox":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Checkbox);
            }
            break;
        case "hbr-icon":
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

export { Checkbox as C, defineCustomElement as d };

