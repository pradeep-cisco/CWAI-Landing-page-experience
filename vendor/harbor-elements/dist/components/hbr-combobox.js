import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { x as xCircle, g as caret } from './index2.js';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const comboboxCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--color:var(--base-text-default);--box-bg-color:transparent;--border-width:var(--hbr-control-border-width);--border-color:var(--control-border-default);--box-border:solid var(--border-width) var(--border-color);--placeholder-color:var(--base-text-weak-default);--placeholder-disabled-color:var(--base-text-weak-disabled);--caret-icon-color:var(--interact-icon-medium-default);--clear-button-color:var(--interact-icon-medium-default);--box-bg-color-hover:var(--base-bg-weak-default);--border-color-hover:var(--control-border-hover);--border-color-focus:var(--control-border-focus);--focus-ring:0px 0px 0px 2px #d8e6fa;--focus-ring-error:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus);--height-small:var(--hbr-control-height-sm);--height-medium:var(--hbr-control-height-md);--height-large:var(--hbr-control-height-lg);--icon-color:var(--control-icon-weak-default);--font-size-small:var(--hbr-control-font-size-sm, 12px);--font-size-medium:var(--hbr-control-font-size-md, 14px);--font-size-large:var(--hbr-font-size-md, 16px);--spacing-small:var(--hbr-control-spacing-sm);--spacing-medium:var(--hbr-control-spacing-md);--spacing-large:var(--hbr-control-spacing-lg);--spacing-icon-top:14px;--border-radius-small:calc(var(--hbr-control-border-radius-sm) - 2px);--border-radius-medium:var(--hbr-control-border-radius-md);--border-radius-large:var(--hbr-control-border-radius-lg);--width:100%;--input-min-width:22px;--input-width:100%;width:fit-content}.combobox{width:var(--width);max-height:94px;overflow-y:auto;box-sizing:border-box;flex:1 1 auto;gap:4px;display:inline-flex;align-items:stretch;justify-content:start;position:relative;font-family:var(--hbr-control-font-family);font-weight:var(--hbr-control-font-weight);letter-spacing:var(--hbr-control-letter-spacing);background-color:var(--base-bg-weak-default);border:var(--box-border);vertical-align:middle;transition:var(--hbr-transition-fast) color, var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow;cursor:text}.combobox:hover:not(.combobox--disabled){background-color:var(--box-bg-color-hover);border-color:var(--border-color-hover)}.combobox:hover:not(.combobox--disabled) .combobox__control{color:var(--color)}.combobox.combobox--focused:not(.combobox--disabled){border-color:var(--border-color-focus);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.combobox.combobox--focused:not(.combobox--disabled):not(.combobox--error){outline:var(--hbr-focus-outline)}.combobox.combobox--focused:not(.combobox--disabled).combobox--error{outline:var(--hbr-focus-outline-error)}.combobox.combobox--focused:not(.combobox--disabled) .combobox__control{color:var(--color)}.combobox.combobox--error:not(.combobox--disabled){border-color:var(--negative-border-default);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.combobox.combobox--error:not(.combobox--disabled) .combobox__control{color:var(--color)}.combobox.combobox--readonly:not(.combobox--disabled){background-color:var(--control-bg-default);border-color:transparent}.combobox.combobox--readonly:not(.combobox--disabled) .combobox__control{color:var(--color);font-weight:400;margin:0px}.combobox.combobox--disabled{background-color:var(--control-bg-disabled);border-color:var(--control-border-disabled);cursor:not-allowed}.combobox.combobox--disabled .combobox__control{color:var(--base-text-disabled)}.combobox.combobox--disabled .combobox__control::placeholder{color:var(--placeholder-disabled-color)}.combobox:not(.combobox--disabled) .combobox__no-input{cursor:pointer}.combobox__main{display:flex;flex:1;flex-wrap:wrap;flex-direction:row;gap:4px}.combobox:has(.combobox__control:invalid){border-color:var(--negative-border-default);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.combobox:has(.combobox__control:invalid).combobox--focused{outline:var(--hbr-focus-outline-danger)}.combobox__control{font-family:inherit;font-size:inherit;font-weight:inherit;min-width:var(--input-min-width);width:var(--input-width);color:var(--color);border:none;background:none;box-shadow:none;margin:0;cursor:inherit;-webkit-appearance:none}.combobox__control::-webkit-search-decoration,.combobox__control::-webkit-search-cancel-button,.combobox__control::-webkit-search-results-button,.combobox__control::-webkit-search-results-decoration{-webkit-appearance:none}.combobox__control:-webkit-autofill,.combobox__control:-webkit-autofill:hover,.combobox__control:-webkit-autofill:focus,.combobox__control:-webkit-autofill:active{box-shadow:0 0 0 var(--height-large) var(--control-bg-default) inset !important;-webkit-text-fill-color:var(--interact-text-default)}.combobox__control::placeholder{color:var(--placeholder-color);user-select:none}.combobox__control:focus{outline:none}.combobox__prefix,.combobox__suffix{display:inline-flex;flex:0 0 auto;align-items:center;cursor:default}.combobox__prefix ::slotted(hbr-icon),.combobox__suffix ::slotted(hbr-icon){color:var(--icon-color)}.combobox--small{border-radius:var(--hbr-control-border-radius-sm);font-size:var(--font-size-small);padding:0px 6px}.combobox--small .combobox__control{font-size:var(--hbr-font-size-xs)}.combobox--small .combobox__control.number{margin:0 0 0 14px}.combobox--small .combobox__control.number::-webkit-textfield-decoration-container{height:100%}.combobox--small .combobox__suffix-container{height:24px}.combobox--small .combobox__main{margin:2px 0px;gap:2px}.combobox--small .combobox__clear hbr-icon{color:var(--clear-button-color);font-size:14px}.combobox--medium{border-radius:var(--border-radius-medium);font-size:var(--hbr-control-font-size-md);min-height:34px;padding:2px 8px}.combobox--medium .combobox__control.number{margin:0 0 0 var(--spacing-medium)}.combobox--medium .combobox__control.number::-webkit-textfield-decoration-container{height:100%}.combobox--medium .combobox__suffix-container{height:26px}.combobox--large{border-radius:var(--border-radius-large);font-size:var(--font-size-large)}.combobox--large .combobox__control.number{margin:0 0 0 var(--spacing-large)}.combobox--large .combobox__control.number::-webkit-textfield-decoration-container{height:100%}.combobox__clear{display:inline-flex;align-items:center;font-size:16px;color:var(--base-text-medium-default);border:none;background:none;padding:0;transition:var(--hbr-transition-fast) color;padding:var(--hbr-spacing-3xs) 3px;margin-left:5px;cursor:pointer}.combobox__clear:focus-visible{outline:none}.combobox__clear:focus-visible hbr-icon{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-circle)}.combobox__clear:hover{color:var(--base-text-medium-default)}.combobox--empty .combobox__clear{visibility:hidden}.combobox__suffix-container{position:sticky;top:0px;margin-left:auto;display:flex;align-items:center;justify-content:center;gap:2px}.combobox__expand-icon{font-size:16px;padding:var(--hbr-spacing-3xs);color:var(--caret-icon-color)}.combobox__expand-icon-caret{display:flex;transition:var(--hbr-transition-medium) rotate ease;rotate:0}:host([open]) .combobox__expand-icon-caret-open{rotate:-180deg}:host-context([data-theme=onecd]){--box-border:solid var(--onecd-border-width-default) var(--border-color)}";
const HbrComboboxStyle0 = comboboxCss;

let id = 0;
const Combobox = /*@__PURE__*/ proxyCustomElement(class Combobox extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClear = createEvent(this, "hbr-clear", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.inputId = `combobox-${++id}`;
        this.labelId = `combobox-label-${id}`;
        this.suffixId = `combobox-suffix-label--${id}`;
        this.prefixId = `combobox-prefix-label--${id}`;
        this.helpTextId = `combobox-help-text-${id}`;
        this.getValue = () => {
            return this.searchable ? this.inputValue : this.value;
        };
        this.setValue = (value) => {
            if (this.searchable) {
                this.inputValue = value;
            }
            else {
                this.value = value;
            }
        };
        this.handlePlaceholder = () => {
            if (this.dynamicPlaceholder && !this.multiple) {
                return this.hasFocus ? this.value || this.placeholder : this.placeholder;
            }
            return this.placeholder;
        };
        this.handleValue = () => {
            if (this.dynamicPlaceholder) {
                if (this.getValue() && this.open && !this.hasFocus)
                    return this.getValue();
                return !this.hasFocus ? this.value : this.getValue();
            }
            return this.getValue();
        };
        this.handleIsEmpty = () => {
            if (this.dynamicPlaceholder) {
                return !(!this.hasFocus && this.value);
            }
            const value = this.getValue();
            if (Array.isArray(value))
                return value.length === 0;
            return [null, undefined, ""].includes(value);
        };
        this.hasFocus = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.hasPrefixSlot = false;
        this.hasSuffixSlot = false;
        this.requiredAfterFocus = false;
        this.hasElementSuffix = false;
        this.type = "text";
        this.size = "medium";
        this.dynamicInputWidth = false;
        this.name = "";
        this.dynamicPlaceholder = false;
        this.multiple = false;
        this.searchable = false;
        this.expandIcon = true;
        this.inputValue = "";
        this.value = "";
        this.label = "";
        this.placeholder = undefined;
        this.open = false;
        this.disabled = false;
        this.readonly = false;
        this.minlength = undefined;
        this.maxlength = undefined;
        this.min = undefined;
        this.max = undefined;
        this.step = undefined;
        this.pattern = undefined;
        this.required = undefined;
        this.invalid = false;
        this.autocapitalize = undefined;
        this.autocorrect = undefined;
        this.autocomplete = undefined;
        this.autofocus = undefined;
        this.spellcheck = undefined;
        this.clearable = true;
        this.inputmode = undefined;
        this.error = false;
        this.arialabel = undefined;
        this.tooltip = undefined;
        this.ariahaspopup = "dialog";
        this.ariacontrols = undefined;
        this.ariarole = "combobox";
        this.aria = undefined;
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleValueChange() {
        var _a;
        // In rare cases, the watcher may be called before render so we need to make sure the input exists
        this.invalid = this.input ? !this.input.checkValidity() : false;
        const value = this.getValue();
        const formValue = Array.isArray(value) ? value.join(",") : value || null;
        (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(formValue);
    }
    handleDisabledChange() {
        if (this.input) {
            // Disabled form controls are always valid, so we need to recheck validity when the state changes
            this.input.disabled = this.disabled;
            this.invalid = !this.input.checkValidity();
        }
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        this.handleFocusInput = this.handleFocusInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.handleInputWidth = this.handleInputWidth.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
        //Replacing with :has pseudo class. If native input is invalid, red border will be set.
        //this.invalid = !this.input?.checkValidity();
        this.handleInputWidth();
    }
    componentWillRender() {
        this.handleInputWidth();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    /** Sets focus on the input. */
    async setFocus(options) {
        this.input.focus(options);
    }
    /** Removes focus from the input. */
    async removeFocus() {
        this.input.blur();
    }
    /** Selects all the text in the input. */
    async select() {
        return this.input.select();
    }
    /** Sets the start and end positions of the text selection (0-based). */
    async setSelectionRange(selectionStart, selectionEnd, selectionDirection = "none") {
        return this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }
    /** Replaces a range of text with a new string. */
    async setRangeText(replacement, start, end, selectMode = "preserve") {
        this.input.setRangeText(replacement, start, end, selectMode);
        if (this.getValue() !== this.input.value) {
            this.setValue(this.input.value);
            this.hbrChange.emit();
            this.hbrInput.emit();
        }
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
    handleInputWidth() {
        if (this.dynamicInputWidth) {
            if (this.getValue().length > 10 || this.placeholder) {
                this.host.style.setProperty("--input-width", "100%");
            }
            else {
                this.host.style.setProperty("--input-width", `${this.getValue().length + 1}ch`);
            }
        }
    }
    handleChange() {
        this.setValue(this.input.value);
        this.handleInputWidth();
        this.hbrChange.emit();
    }
    handleInput() {
        this.setValue(this.input.value);
        this.handleInputWidth();
        if (this.required)
            this.requiredAfterFocus = true;
        this.hbrInput.emit();
    }
    handleInvalid() {
        this.invalid = true;
    }
    handleBlur() {
        this.hasFocus = false;
        this.host.setAttribute("data-focused", "false");
        this.hbrBlur.emit();
    }
    handleFocus() {
        this.hasFocus = true;
        this.host.setAttribute("data-focused", "true");
        this.hbrFocus.emit();
    }
    handleClearClick(event) {
        this.setValue("");
        this.handleInputWidth();
        this.hbrClear.emit();
        this.hbrInput.emit();
        this.hbrChange.emit();
        this.input.focus();
        event.stopPropagation();
    }
    handleFocusInput(event) {
        var _a;
        if (this.disabled || this.readonly)
            return;
        if (event.target.classList.contains("combobox__suffix-container") ||
            event.target.classList.contains("combobox") ||
            event.target.classList.contains("combobox__main")) {
            (_a = this.input) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }
    handleSlotChange() {
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        this.hasPrefixSlot = hasSlot(this.host, "prefix");
        this.hasSuffixSlot = hasSlot(this.host, "suffix");
        this.hasElementSuffix = hasSlot(this.host, "element-suffix");
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g;
        const describedHelpId = this.hasHelpTextSlot ? this.helpTextId : "";
        const tooltipId = this.tooltip ? `${this.inputId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        const optionalProps = {
            //due to the biome error on input autofocus
            autoFocus: this.autofocus,
        };
        const placeholder = this.handlePlaceholder();
        const value = this.handleValue();
        const isEmpty = this.handleIsEmpty();
        const baseProps = {};
        if (this.multiple) {
            baseProps.onClick = this.handleFocusInput;
        }
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h(Host, { key: 'c3a6bc2c36abdafd64e6085f2624d107df18a772', "aria-controls": ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.controls) || this.ariacontrols }, h(FormControl, { key: '9af60aff76ded4db0da5926f3053da87f97859e3', inputId: this.inputId, label: this.label, labelId: this.labelId, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, helpTextId: this.helpTextId, hasHelpTextSlot: this.hasHelpTextSlot, hasElementSuffix: this.hasElementSuffix, size: this.size, source: "input", hasFocus: this.hasFocus, hasValue: ((_c = this.getValue()) === null || _c === void 0 ? void 0 : _c.length) > 0, hasError: this.error, isDisabled: this.disabled, isRequired: this.required, tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.inputId}-tooltip` : undefined }, h("div", Object.assign({ key: '573aec8528be6f9166bb6fbe578eafeb4302c17c', part: `base ${this.error ? " error" : ""}`, class: {
                combobox: true,
                // Sizes
                "combobox--small": this.size === "small",
                "combobox--medium": this.size === "medium",
                "combobox--large": this.size === "large",
                // States
                "combobox--disabled": this.disabled,
                "combobox--focused": this.hasFocus,
                "combobox--empty": isEmpty,
                "combobox--invalid": this.invalid,
                "combobox--error": this.error,
                "combobox--readonly": this.readonly,
            } }, baseProps), this.hasPrefixSlot && (h("span", { part: "prefix", class: "combobox__prefix", id: this.prefixId }, h("slot", { name: "prefix" }))), h("span", { key: '5e34507fe515a14c0eddbe7d2facde09e9c74017', part: "main", class: "combobox__main" }, h("slot", { key: '85c56ee5f710a18b2155169317c09ed8f275a1f0', name: "tags" }), h("input", Object.assign({ key: '7281d9fe2cd40bc7d2d74419132fb4bec97ee003', part: "input", ref: (el) => {
                this.input = el;
            }, id: this.inputId, class: {
                combobox__control: true,
                combobox__number: this.type === "number",
                "combobox__no-input": !this.searchable,
            }, type: this.type, name: this.name, placeholder: placeholder, disabled: this.disabled, readonly: !this.searchable || this.readonly, minLength: this.minlength, maxLength: this.maxlength, min: this.min, max: this.max, step: this.step, value: value, autoCapitalize: this.autocapitalize, autoComplete: this.autocomplete, autoCorrect: this.autocorrect }, optionalProps, { spellcheck: this.spellcheck, pattern: this.pattern, required: this.requiredAfterFocus, inputMode: this.inputmode, onChange: this.handleChange, onInput: this.handleInput, onInvalid: this.handleInvalid, onFocus: this.handleFocus, onBlur: this.handleBlur, "aria-expanded": this.open ? "true" : "false", "aria-haspopup": ((_d = this.aria) === null || _d === void 0 ? void 0 : _d.haspopup) || this.ariahaspopup, "aria-disabled": this.disabled ? "true" : "false", "aria-describedby": describedId, role: ((_e = this.aria) === null || _e === void 0 ? void 0 : _e.role) || this.ariarole, "aria-label": ((_f = this.aria) === null || _f === void 0 ? void 0 : _f.label) || this.arialabel, "aria-invalid": this.invalid ? "true" : "false" }))), h("span", { key: '12bea5a160b4b8d9c87de7fb118706c3f5e19e28', class: "combobox__suffix-container" }, this.clearable && (h("button", { part: "clear-button", class: "combobox__clear", type: "button", "aria-label": ((_g = this.aria) === null || _g === void 0 ? void 0 : _g.deleteInputContent) || "delete input content", "data-testid": "clear-button", onClick: this.handleClearClick }, h("slot", { name: "clear-icon" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-circle"]) || xCircle })))), this.invalid && (h("hbr-visually-hidden", null, h("div", { class: "hidden", "aria-live": "polite", "aria-atomic": "true" }, "Invalid Input"))), this.hasSuffixSlot && (h("span", { part: "suffix", class: "combobox__suffix", id: this.suffixId }, h("slot", { name: "suffix" }))), this.expandIcon && (h("span", { part: "expand-icon", class: "combobox__expand-icon" }, h("slot", { name: "expand-icon" }, h("hbr-icon", { class: {
                "combobox__expand-icon-caret": true,
                "combobox__expand-icon-caret-open": true,
            }, asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.caret) || caret })))))))));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrComboboxStyle0; }
}, [65, "hbr-combobox", {
        "type": [513],
        "size": [513],
        "dynamicInputWidth": [516, "dynamic-input-width"],
        "name": [513],
        "dynamicPlaceholder": [516, "dynamic-placeholder"],
        "multiple": [516],
        "searchable": [516],
        "expandIcon": [516, "expand-icon"],
        "inputValue": [1537, "input-value"],
        "value": [1537],
        "label": [1],
        "placeholder": [1],
        "open": [516],
        "disabled": [516],
        "readonly": [516],
        "minlength": [514],
        "maxlength": [514],
        "min": [514],
        "max": [514],
        "step": [520],
        "pattern": [513],
        "required": [516],
        "invalid": [1540],
        "autocapitalize": [1],
        "autocorrect": [1],
        "autocomplete": [1],
        "autofocus": [4],
        "spellcheck": [4],
        "clearable": [4],
        "inputmode": [1],
        "error": [4],
        "arialabel": [1],
        "tooltip": [513],
        "ariahaspopup": [1],
        "ariacontrols": [8],
        "ariarole": [1],
        "aria": [16],
        "hasFocus": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "hasPrefixSlot": [32],
        "hasSuffixSlot": [32],
        "requiredAfterFocus": [32],
        "hasElementSuffix": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "select": [64],
        "setSelectionRange": [64],
        "setRangeText": [64],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-combobox", "hbr-icon", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-combobox":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Combobox);
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

const HbrCombobox = Combobox;
const defineCustomElement = defineCustomElement$1;

export { HbrCombobox, defineCustomElement };

