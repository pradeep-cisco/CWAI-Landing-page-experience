import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { x as xCircle, X as eyeSlash, Y as eye } from './index2.js';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const inputCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--color:var(--base-text-default);--box-bg-color:var(--control-bg-weak-default);--border-width:var(--hbr-control-border-width);--border-color:var(--control-border-default);--box-border:solid var(--border-width) var(--border-color);--placeholder-color:var(--base-text-weak-default);--placeholder-disabled-color:var(--base-text-disabled);--box-font-family:var(--hbr-control-font-family);--box-font-weight:var(--hbr-control-font-weight);--placeholder-font-family:inherit;--placeholder-font-weight:inherit;--box-bg-color-hover:var(--control-bg-weak-default);--border-color-hover:var(--control-border-hover);--border-color-focus:var(--control-border-focus);--focus-ring:0px 0px 0px 2px var(--control-border-focus);--focus-ring-error:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus);--height-small:var(--hbr-control-height-sm);--height-medium:var(--hbr-control-height-md);--height-large:var(--hbr-control-height-lg);--icon-color:var(--control-icon-weak-default);--font-size-small:var(--hbr-control-font-size-sm, 12px);--font-size-medium:var(--hbr-control-font-size-md, 14px);--font-size-large:var(--hbr-font-size-md, 16px);--spacing-small:6px;--spacing-medium:10px;--spacing-large:14px;--spacing-icon-top:14px;--border-radius:var(--hbr-control-border-radius, 6px);--autofill-text-color:var(--base-text-default);--password-toggle-color:var(--interact-text-default);--clear-button-color:var(--interact-icon-weak-default);--clear-button-hover-color:var(--control-icon-weak-hover);--password-toggle-hover-color:var(--control-icon-weak-hover);--password-show-hide-color:var(--interact-text-default);--error-border-color:var(--negative-border-medium-active);--invalid-border-color:var(--negative-border-medium-active);--disabled-bg-color:var(--control-bg-weak-disabled);--disabled-border-color:var(--control-border-disabled);--disabled-text-color:var(--base-text-disabled);--disabled-placeholder-color:var(--base-text-disabled);--input-bg-color:var(--control-bg-weak-default);--shell-header-search-outline-color:var(--control-border-active);--password-toggle-border-radius:var(--hbr-border-radius-md, 6px);--width:min(100%, 600px)}:host([fixed-width]){--min-width:60px;--max-width:600px;--width:280px;width:min(var(--width), 100%);min-width:var(--min-width);max-width:max(var(--width), var(--max-width));box-sizing:border-box}:host([fixed-width][size=small]){--min-width:48px;--width:240px;--max-width:520px}:host([size=small]){--width:min(100%, 520px)}:host(.shell-header-input-search) .input.input--focused:not(.input--disabled){outline:var(--shell-header-search-outline-color) solid 2px;box-shadow:0px 0px 0px 2px rgba(62, 132, 229, 0.2);outline-offset:2px;border-radius:var(--hbr-border-radius-lg, 8px);border:none}:host([disabled]){--password-toggle-color:var(--control-icon-weak-disabled);--clear-button-color:var(--control-icon-weak-disabled)}:host(:not([disabled])){--password-toggle-bg-color-hover:var(--interact-bg-weak-hover)}:host([type=date]),:host([type=time]),:host([type=datetime-local]){--box-font-family:var(--hbr-font-family-mono);--help-text-font-family:var(--hbr-font-body)}.input{box-sizing:border-box;flex:1 1 auto;display:inline-flex;align-items:stretch;justify-content:start;position:relative;width:var(--width);font-family:var(--box-font-family);font-weight:var(--box-font-weight);letter-spacing:var(--hbr-control-letter-spacing);background-color:var(--input-bg-color);border:var(--box-border);vertical-align:middle;overflow:hidden;transition:var(--hbr-transition-fast) color, var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow;cursor:text;background-color:var(--box-bg-color);border-radius:var(--border-radius);max-width:max(var(--width), 600px)}.input.input--fixed-width{width:100%}.input:hover:not(.input--disabled){background-color:var(--control-bg-weak-default);border-color:var(--control-border-hover)}.input:hover:not(.input--disabled) .input__control{color:var(--color)}.input.input--focused:not(.input--disabled){border-color:var(--border-color-focus);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.input.input--focused:not(.input--disabled):not(.input--error){outline:var(--hbr-focus-outline)}.input.input--focused:not(.input--disabled).input--error{outline:var(--hbr-focus-outline-error)}.input.input--focused:not(.input--disabled) .input__control{color:var(--color)}.input.input--error:not(.input--disabled){border-color:var(--error-border-color);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.input.input--error:not(.input--disabled) .input__control{color:var(--color)}.input.input--readonly:not(.input--disabled){background-color:var(--base-bg-disabled);border-color:var(--control-border-disabled)}.input.input--disabled{background-color:var(--disabled-bg-color);border-color:var(--disabled-border-color);cursor:not-allowed}.input.input--disabled .input__control{color:var(--disabled-text-color)}.input.input--disabled .input__control::placeholder{color:var(--disabled-placeholder-color)}.input:has(.input__control:invalid){border-color:var(--invalid-border-color);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.input:has(.input__control:invalid).input--focused{outline:var(--hbr-focus-outline-danger)}.input__control{flex:1 1 auto;font-family:inherit;font-size:inherit;font-weight:inherit;min-width:0;height:100%;color:var(--color);border:none;background:none;box-shadow:none;padding:0;margin:0;cursor:inherit;-webkit-appearance:none}.input__control::-webkit-search-decoration,.input__control::-webkit-search-cancel-button,.input__control::-webkit-search-results-button,.input__control::-webkit-search-results-decoration{-webkit-appearance:none}.input__control:-webkit-autofill,.input__control:-webkit-autofill:hover,.input__control:-webkit-autofill:focus,.input__control:-webkit-autofill:active{box-shadow:0 0 0 var(--height-large) var(--control-bg-weak-default) inset !important;-webkit-text-fill-color:var(--autofill-text-color)}.input__control::placeholder{color:var(--placeholder-color, var(--base-text-weak-default));font-family:var(--placeholder-font-family);font-weight:var(--placeholder-font-weight);user-select:none}.input__control:focus{outline:none}.input__prefix,.input__suffix{display:inline-flex;flex:0 0 auto;align-items:center;cursor:default}.input__prefix ::slotted(hbr-icon),.input__suffix ::slotted(hbr-icon){color:var(--icon-color);font-size:var(--icon-font-size);padding:var(--icon-padding);margin-top:var(--icon-margin-top)}.input__password-toggle:focus-visible span{border-radius:var(--hbr-border-radius-md);outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.input__password-toggle .input__password-show-hide{font-size:var(--hbr-control-font-size-sm);color:var(--password-show-hide-color);letter-spacing:0.42px}.input--small{height:var(--height-small);font-size:var(--hbr-font-size-xs, 12px);line-height:18px;max-width:max(520px, var(--width))}.input--small .input__control{margin:0px var(--spacing-small)}.input--small .input__control.number{margin-right:0px}.input--small .input__control.number::-webkit-textfield-decoration-container{height:100%}.input--small .input__clear{margin-right:var(--spacing-small);font-size:var(--font-size-sm, 14px)}.input--small .input__prefix ::slotted(*){margin-left:var(--spacing-small)}.input--small .input__suffix ::slotted(*){margin-right:var(--spacing-small)}.input--small.input--password .input__control{margin:0px 4px 0px var(--spacing-small)}.input--medium{font-size:var(--hbr-control-font-size-md);height:var(--height-medium)}.input--medium .input__control{margin:0px var(--spacing-medium)}.input--medium .input__control.number{margin-right:0px}.input--medium .input__control.number::-webkit-textfield-decoration-container{height:100%}.input--medium .input__clear{margin-right:var(--spacing-medium)}.input--medium .input__prefix ::slotted(*){margin-left:var(--spacing-medium)}.input--medium .input__suffix ::slotted(*){margin-right:var(--spacing-medium)}.input--medium.input--password .input__control{margin:0px 8px 0px var(--spacing-medium)}.input--large{font-size:var(--font-size-large);height:var(--height-large)}.input--large .input__control{margin:0px 14px}.input--large .input__control.number{margin-right:0}.input--large .input__control.number::-webkit-textfield-decoration-container{height:100%}.input--large .input__clear{margin-right:14px}.input--large .input__prefix ::slotted(*){margin-left:var(--spacing-large)}.input--large .input__suffix ::slotted(*){margin-right:var(--spacing-large)}.input--large.input--password .input__control{margin:0px 12px 0px 14px}.input--has-prefix .input__control{margin-left:var(--hbr-spacing-xs)}.input--small.input--has-prefix .input__control{margin-left:var(--hbr-spacing-2xs)}.input--has-suffix .input__control,.input--has-clear .input__control{margin-right:var(--hbr-spacing-xs)}.input--medium.input--has-prefix .input__control{margin-left:6px}.input--medium.input--has-suffix .input__control,.input--medium.input--has-clear .input__control{margin-right:6px}.input--small.input--has-suffix .input__control,.input--small.input--has-clear .input__control{margin-right:var(--hbr-spacing-2xs)}.input--small.input--has-suffix .input__suffix ::slotted(*),.input--small.input--has-clear .input__clear{margin-right:6px}.input--pill.input--small{border-radius:var(--height-small)}.input--pill.input--medium{border-radius:var(--height-medium)}.input--pill.input--large{border-radius:var(--height-large)}.input__clear,.input__password-toggle{display:inline-flex;align-items:center;font-size:16px;border:none;background:none;padding:0;transition:var(--hbr-transition-fast) color;cursor:pointer}.input__clear:focus-visible,.input__password-toggle:focus-visible{outline:none}.input__clear:focus-visible hbr-icon,.input__password-toggle:focus-visible hbr-icon{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-circle)}.input__clear:hover{color:var(--clear-button-hover-color)}.input__password-toggle:hover{color:var(--password-toggle-hover-color)}.input__password-toggle:hover .input__password-show-hide-medium-magnetic{border-radius:var(--password-toggle-border-radius);background-color:var(--password-toggle-bg-color-hover)}.input__password-toggle{color:var(--password-toggle-color);margin-right:var(--spacing-medium);font-weight:var(--hbr-font-weight-bold, 700);font-size:var(--hbr-font-size-xs, 12px);line-height:18px;font-family:var(--hbr-font-body, Inter)}.input--small .input__password-toggle{margin-right:6px}.input--large .input__password-toggle{margin-right:14px;font-weight:var(--hbr-font-weight-bold, 700);font-size:var(--hbr-font-size-sm, 14px);line-height:20px}.input__clear{color:var(--clear-button-color)}:host-context([data-theme=onecd]){--border-width:var(--onecd-border-width-default, 1px)}";
const HbrInputStyle0 = inputCss;

let id = 0;
const Input = /*@__PURE__*/ proxyCustomElement(class Input extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClear = createEvent(this, "hbr-clear", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.inputId = `input-${++id}`;
        this.labelId = `input-label-${id}`;
        this.suffixId = `input-suffix-label--${id}`;
        this.prefixId = `input-prefix-label--${id}`;
        this.helpTextId = `input-help-text-${id}`;
        this.defaultAria = {
            clear: "delete input content",
        };
        this.defaultI18n = {
            show: "Show",
            hide: "Hide",
            invalidFeedback: "Invalid Input",
        };
        this.getInputValue = (event) => {
            var _a, _b;
            const inputData = event === null || event === void 0 ? void 0 : event.data;
            const inputElement = (_a = this.input) !== null && _a !== void 0 ? _a : event === null || event === void 0 ? void 0 : event.target;
            const inputValue = (_b = inputElement === null || inputElement === void 0 ? void 0 : inputElement.value) !== null && _b !== void 0 ? _b : "";
            if (this.type === "number") {
                // https://github.com/cisco-harbor/elements/issues/3475
                if (inputData !== "-" &&
                    inputData !== "+" &&
                    !this.isValidNumber(inputValue) &&
                    this.input) {
                    this.input.value = "";
                }
            }
            return inputValue;
        };
        this.hasFocus = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.hasTrailingSlot = false;
        this.hasElementSuffix = false;
        this.hasPrefixSlot = false;
        this.hasSuffixSlot = false;
        this.isPasswordVisible = false;
        this.library = "hbr-theme-magnetic";
        this.requiredAfterFocus = false;
        this.type = "text";
        this.size = "medium";
        this.fixedWidth = false;
        this.name = "";
        this.value = "";
        this.pill = false;
        this.label = "";
        this.helpText = "";
        this.placeholder = undefined;
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
        this.clearable = false;
        this.togglePassword = false;
        this.attr = {};
        this.inputmode = undefined;
        this.error = false;
        this.arialabel = undefined;
        this.ariarole = undefined;
        this.ariaexpanded = undefined;
        this.tooltip = undefined;
        this.aria = undefined;
        this.i18n = undefined;
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleValueChange() {
        // In rare cases, the watcher may be called before render so we need to make sure the input exists
        this.invalid = this.input ? !this.input.checkValidity() : false;
    }
    handleDisabledChange() {
        if (this.input) {
            // Disabled form controls are always valid, so we need to recheck validity when the state changes
            this.input.disabled = this.disabled;
            this.invalid = !this.input.checkValidity();
        }
    }
    // /** Emitted when the control becomes invalid. */
    // @Event({ eventName: "hbr-invalid" }) hbrInvalid: EventEmitter;
    connectedCallback() {
        var _a;
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBaseClick = this.handleBaseClick.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.handlePasswordToggle = this.handlePasswordToggle.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
    }
    componentWillLoad() {
        this.handleSlotChange();
        //Replacing with :has pseudo class. If native input is invalid, red border will be set.
        //this.invalid = !this.input?.checkValidity();
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
        if (this.value !== this.input.value) {
            this.value = this.getInputValue();
            this.hbrChange.emit();
            this.hbrInput.emit();
        }
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        // this method shows the native browser validation tooltip.
        return this.input.reportValidity();
    }
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    async checkValidity() {
        return this.input.checkValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        this.input.setCustomValidity(message);
        this.invalid = !this.input.checkValidity();
    }
    handleChange(event) {
        var _a;
        this.value = this.getInputValue(event);
        (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.getInputValue(event));
        this.hbrChange.emit();
    }
    isValidNumber(input) {
        // support floating number, and negative number
        return /^-?\d*\.?\d+$/.test(input);
    }
    handleInput(event) {
        var _a;
        this.value = this.getInputValue(event);
        (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.value || null);
        if (this.required)
            this.requiredAfterFocus = true;
        this.hbrInput.emit();
    }
    handleInvalid(event) {
        /**
         * The oninvalid event is emitted when a submittable element is checked for validity and fails to satisfy its constraints.
         * This typically occurs in the following scenarios:
         * - Form Submission:
         * When a form containing the invalid input is submitted, the invalid event is fired on each individual form control that does not meet its validation criteria
         * - Explicit Validity Check:
         * When checkValidity() or reportValidity() methods are explicitly called on the input element or its containing form, and the input's value does not pass validation.
         */
        // Prevent the native browser validation tooltip from appearing
        event.preventDefault();
        this.invalid = true;
        // this.hbrInvalid.emit({invalid: true});
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
    handleBaseClick(event) {
        var _a;
        if (this.disabled || this.readonly)
            return;
        const target = event.composedPath()[0];
        const interactiveTarget = (_a = target.closest) === null || _a === void 0 ? void 0 : _a.call(target, "button, a, input, select, textarea, hbr-icon-button, [role='button'], [tabindex]");
        if (interactiveTarget)
            return;
        this.input.focus();
    }
    handleClearClick(event) {
        this.value = "";
        this.hbrClear.emit();
        this.hbrInput.emit();
        this.hbrChange.emit();
        this.input.focus();
        event.stopPropagation();
    }
    handlePasswordToggle() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    handleSlotChange() {
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        this.hasTrailingSlot = hasSlot(this.host, "trailing");
        this.hasElementSuffix = hasSlot(this.host, "element-suffix");
        this.hasPrefixSlot = hasSlot(this.host, "prefix");
        this.hasSuffixSlot = hasSlot(this.host, "suffix");
    }
    render() {
        var _a, _b, _c;
        const describedHelpId = this.helpText || this.hasHelpTextSlot ? this.helpTextId : "";
        const tooltipId = this.tooltip ? `${this.inputId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        const optionalProps = Object.assign({
            //due to the biome error on input autofocus
            autoFocus: this.autofocus
        }, this.attr);
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { arialabel, ariarole, ariaexpanded, aria } = this;
        const { label, describedby, invalid, role, expanded } = aria || {};
        const _aria = Object.assign(Object.assign({}, this.defaultAria), this.aria);
        const _i18n = Object.assign(Object.assign({}, this.defaultI18n), this.i18n);
        const { show, hide } = _i18n;
        const a11y = {
            "aria-label": label || arialabel,
            "aria-describedby": describedby || describedId,
            "aria-invalid": invalid || this.invalid ? "true" : "false",
            role: role || ariarole,
            "aria-expanded": expanded || ariaexpanded,
        };
        const isEmpty = [null, undefined, ""].includes(this.value);
        const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
        const showClearIcon = hasClearIcon && (typeof this.value === "number" || this.value.length > 0);
        return (h(FormControl, { key: 'a3432c389017ab71eecae49d873fc1e641d27b52', inputId: this.inputId, label: this.label, labelId: this.labelId, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, hasTrailingSlot: this.hasTrailingSlot, hasElementSuffix: this.hasElementSuffix, helpTextId: this.helpTextId, helpText: this.helpText, hasHelpTextSlot: this.hasHelpTextSlot, size: this.size, source: "input", hasFocus: this.hasFocus, hasValue: ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) > 0, hasError: this.error, isDisabled: this.disabled, isRequired: this.required, tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.inputId}-tooltip` : undefined }, h("div", { key: 'bf5104901eed8518182da44609dd9087e693ca25', part: `base ${this.error ? " error" : ""}`, onClick: this.handleBaseClick, class: {
                input: true,
                // Sizes
                "input--small": this.size === "small",
                "input--medium": this.size === "medium",
                "input--large": this.size === "large",
                // States
                "input--pill": this.pill,
                "input--has-prefix": this.hasPrefixSlot,
                "input--has-suffix": this.hasSuffixSlot,
                "input--has-clear": showClearIcon,
                "input--fixed-width": this.fixedWidth,
                "input--disabled": this.disabled,
                "input--focused": this.hasFocus,
                "input--empty": isEmpty,
                "input--invalid": this.invalid,
                "input--error": this.error,
                "input--readonly": this.readonly,
                [`input--${this.type}`]: true,
            } }, h("span", { key: '62552addbd2643aa39aceaad0da041b598677c03', part: "prefix", class: "input__prefix", id: this.prefixId }, h("slot", { key: 'ce69db1e628fa04cef1aa142c85103260c245bb5', name: "prefix" })), h("input", Object.assign({ key: '22a09956b2565ed65068a82d28521d6af11bff0b', part: "input", ref: (el) => {
                this.input = el;
            } }, (((_c = this.attr) === null || _c === void 0 ? void 0 : _c.id) ? {} : { id: this.inputId }), { class: `input__control ${this.type === "number" ? "number" : ""}`, type: this.type === "password" && this.isPasswordVisible
                ? "text"
                : this.type, name: this.name, placeholder: this.placeholder, disabled: this.disabled, readonly: this.readonly, minLength: this.minlength, maxLength: this.maxlength, min: this.min, max: this.max, step: this.step, value: this.value, autoCapitalize: this.autocapitalize, autoComplete: this.autocomplete, autoCorrect: this.autocorrect }, optionalProps, { spellcheck: this.spellcheck, pattern: this.pattern, required: this.requiredAfterFocus, inputMode: this.inputmode, onChange: this.handleChange, onInput: this.handleInput, onInvalid: this.handleInvalid }, (this.type === "time" ? { title: "" } : null), { onFocus: this.handleFocus, onBlur: this.handleBlur }, a11y)), showClearIcon && (h("button", { part: "clear-button", class: "input__clear", type: "button", "aria-label": _aria.clear, onClick: this.handleClearClick }, h("slot", { name: "clear-icon" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-circle"]) || xCircle })))), this.invalid && (h("hbr-visually-hidden", null, h("div", { class: "hidden", "aria-live": "polite", "aria-atomic": "true" }, _i18n.invalidFeedback))), this.togglePassword && (h("button", { part: "password-toggle-button", class: "input__password-toggle", type: "button", onClick: this.handlePasswordToggle }, this.isPasswordVisible ? (h("slot", { name: "show-password-icon" }, this.library === "hbr-theme-cohesion" && (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["eye-slash"]) || eyeSlash })), this.library === "hbr-theme-cohesion-v1" && (h("span", { class: `input__password-show-hide-${this.size}` }, hide.toUpperCase())), this.library === "hbr-theme-magnetic" && (h("span", { class: `input__password-show-hide-${this.size}-magnetic` }, hide)))) : (h("slot", { name: "hide-password-icon" }, this.library === "hbr-theme-cohesion" && (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.eye) || eye })), this.library === "hbr-theme-cohesion-v1" && (h("span", { class: `input__password-show-hide-${this.size}` }, show.toUpperCase())), this.library === "hbr-theme-magnetic" && (h("span", { class: `input__password-show-hide-${this.size}-magnetic` }, show)))))), h("span", { key: '494ce26a871c302aa75bb5dced6c25f787fc3708', part: "suffix", class: "input__suffix", id: this.suffixId }, h("slot", { key: '2c4b8e96b226f172b6282c42491a53a551fdb93f', name: "suffix" })))));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrInputStyle0; }
}, [65, "hbr-input", {
        "type": [513],
        "size": [513],
        "fixedWidth": [516, "fixed-width"],
        "name": [513],
        "value": [1025],
        "pill": [516],
        "label": [1],
        "helpText": [1, "help-text"],
        "placeholder": [1025],
        "disabled": [516],
        "readonly": [516],
        "minlength": [514],
        "maxlength": [514],
        "min": [520],
        "max": [520],
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
        "togglePassword": [4, "toggle-password"],
        "attr": [16],
        "inputmode": [1],
        "error": [4],
        "arialabel": [1],
        "ariarole": [1],
        "ariaexpanded": [1],
        "tooltip": [513],
        "aria": [16],
        "i18n": [16],
        "hasFocus": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "hasTrailingSlot": [32],
        "hasElementSuffix": [32],
        "hasPrefixSlot": [32],
        "hasSuffixSlot": [32],
        "isPasswordVisible": [32],
        "library": [32],
        "requiredAfterFocus": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "select": [64],
        "setSelectionRange": [64],
        "setRangeText": [64],
        "reportValidity": [64],
        "checkValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-input", "hbr-icon", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-input":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Input);
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

export { Input as I, defineCustomElement as d };

