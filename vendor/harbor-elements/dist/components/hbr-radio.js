import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { G as radioButtonDefault, H as radioButtonSelected, I as radioButtonIndeterminate } from './index2.js';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const radioCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{--size:var(--hbr-font-size-md);--form-control-width:100%;--font-weight:var(--hbr-font-weight-normal);--font-size:var(--hbr-font-size-sm);--label-color:var(--base-text-default);--label-hover-color:var(--base-text-default);--label-checked-color:var(--base-text-default);--label-disabled-color:var(--base-text-disabled);--label-margin:0 0 0 var(--hbr-spacing-xs);--control-hover-color:var(--control-hover-color);--control-focused-color:var(--control-icon-strong-focus);--description-color:var(--base-text-medium-default);--radio-default-stroke-width:2px;--radio-focus-icon-color:var(--control-border-default);--radio-focus-box-shadow:var(--hbr-focus-ring);--radio-focus-box-shadow-default:0 0 0 2px var(--interact-bg-weak-hover);--radio-focus-box-shadow-large:0 0 0 3px var(--interact-bg-weak-hover);--radio-focus-outline:var(--hbr-focus-outline);--radio-focus-outline-offset:var(--hbr-focus-ring-width);--disabled-opacity:0.9;display:flex}:host([size=small]){--left-shift:calc(var(--hbr-font-size-md) + var(--hbr-spacing-xs))}:host([size=medium]){--left-shift:calc(20px + var(--hbr-spacing-xs))}:host([size=large]){--left-shift:calc(var(--hbr-font-size-xl) + var(--hbr-spacing-xs))}.form-control{width:var(--form-control-width)}.form-control__input{display:flex}.radio{display:inline-flex;align-items:center;vertical-align:middle;cursor:pointer}.radio .radio__label{color:var(--label-color);user-select:none}.radio .radio__label,.radio .main-container .radio__description{font-weight:var(--font-weight);font-size:calc(var(--size) - 2px)}.radio:not(.radio--disabled):hover .radio__label{color:var(--label-hover-color)}.radio:not(.radio--has-description) .radio__label{margin:var(--label-margin)}.radio.radio--has-description{align-items:flex-start}.radio.radio--has-description .radio__label{--label-color:var(--base-text-default);font-weight:var(--hbr-font-weight-semibold)}.radio .main-container{margin:var(--label-margin);gap:var(--hbr-spacing-2xs)}.radio .main-container .radio__description{color:var(--description-color)}.radio__icon{display:inline-flex}.radio__icon svg{width:100%;height:100%}.radio__control{flex:0 0 auto;position:relative;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;color:transparent;font-size:var(--size);transition:var(--hbr-transition-fast) border-color, var(--hbr-transition-fast) background-color, var(--hbr-transition-fast) color, var(--hbr-transition-fast) box-shadow}.radio__control input[type=radio]{position:absolute;opacity:0;padding:0;margin:0;pointer-events:none}.radio.radio--focused:not(.radio--disabled) .radio__control{outline:var(--radio-focus-outline);box-shadow:var(--radio-focus-box-shadow);outline-offset:var(--radio-focus-outline-offset)}.radio:not(.radio--checked):not(.radio--indeterminate):not(.radio--disabled):hover .radio__control hbr-icon{color:var(--control-hover-color)}.radio--checked .radio__label{color:var(--label-checked-color)}.radio.radio--disabled{opacity:var(--disabled-opacity);cursor:not-allowed}.radio.radio--disabled .radio__label{color:var(--label-disabled-color)}.radio--size-small .radio__control{font-size:var(--hbr-font-size-xs)}.radio--size-small .radio__label,.radio--size-small .main-container .radio__description{font-size:var(--hbr-font-size-xs)}.radio--size-large .radio__control{font-size:var(--hbr-font-size-lg)}.radio--size-large .radio__label{font-size:var(--hbr-font-size-lg)}.radio--has-description .main-container{display:flex;flex-direction:column}.radio__icon_error{color:var(--negative-border-medium-active)}:host([error]:not(:disabled)) .radio__control{--control-hover-color:var(--negative-bg-default);border-color:var(--negative-bg-default);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}:host([size=small]) .radio__control{font-size:var(--hbr-font-size-md, 16px)}:host([size=medium]) .radio__control{font-size:20px}:host([size=medium]) .radio__label{line-height:20px}:host([size=large]) .radio__control{font-size:var(--hbr-font-size-xl, 24px)}.radio--focused .radio__control{box-shadow:var(--radio-focus-box-shadow-default)}:host([size=large]) .radio--focused .radio__control{box-shadow:var(--radio-focus-box-shadow-large)}:host([disabled]) .radio__label{color:var(--base-text-disabled)}.radio__label{color:var(--base-text-default)}:host(:not([disabled]):not([readonly])) .radio:not(.radio--checked):not(.radio--indeterminate) .radio__icon:not(.radio__icon_error)>hbr-icon{color:var(--control-border-default)}:host(:not([disabled]):focus-within) .radio:not(.radio--checked):not(.radio--indeterminate) .radio__icon:not(.radio__icon_error)>hbr-icon{color:var(--radio-focus-icon-color)}:host(:not([disabled]):hover) .radio:not(.radio--checked):not(.radio--indeterminate) .radio__icon:not(.radio__icon_error)>hbr-icon{color:var(--control-border-hover)}:host([disabled]) .radio:not(.radio--checked):not(.radio--indeterminate) .radio__icon:not(.radio__icon_error)>hbr-icon{color:var(--control-border-disabled);--path-color-contrast:var(--control-bg-weak-disabled)}:host([disabled]) .radio--checked .radio__icon>hbr-icon{color:var(--control-border-disabled);--path-color-contrast:var(--control-bg-weak-disabled);--path-color-2:var(--control-icon-strong-disabled);--path-color-0:var(--control-border-disabled)}.radio--checked .radio__icon>hbr-icon{color:var(--control-border-strong-active);--path-color-1:var(--control-border-strong-active)}:host(:not([disabled])) .radio--checked .radio__icon>hbr-icon:hover{color:var(--control-bg-strong-hover);--path-color-1:var(--control-bg-strong-hover)}.radio--readonly{cursor:default}.radio--readonly .radio__label{user-select:text}.radio--readonly input[type=radio]{cursor:default}:host([readonly]) .radio:not(.radio--checked):not(.radio--indeterminate) .radio__icon>hbr-icon,:host([readonly]) .radio:not(.radio--checked):not(.radio--indeterminate):hover .radio__icon>hbr-icon{pointer-events:none;--path-color-0:var(--control-border-disabled, #D0D4D9);--path-color-contrast:var(--base-bg-disabled, #F0F1F2)}:host([readonly]) .radio--checked .radio__icon>hbr-icon,:host([readonly]) .radio--checked:hover .radio__icon>hbr-icon{pointer-events:none;color:var(--control-icon-weak-default, #7e868f);--path-color-0:var(--control-border-disabled, #D0D4D9);--path-color-contrast:var(--base-bg-disabled, #F0F1F2)}";
const HbrRadioStyle0 = radioCss;

let id = 0;
const Radio = /*@__PURE__*/ proxyCustomElement(class Radio extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.inputId = `radio-${++id}`;
        this.labelId = `radio-label-${id}`;
        this._helpTextId = `radio-helpTextId-${id}`;
        this.handleFirstRadioTabindex = () => {
            const group = this.host.closest("hbr-radio-group");
            group === null || group === void 0 ? void 0 : group.getRadioTabindexStatus();
        };
        this.renderIcon = () => {
            var _a;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            if (this.error && !this.checked && !this.indeterminate && !this.disabled) {
                return (h("span", { part: "error-icon-wrapper", class: "radio__icon radio__icon_error" }, h("hbr-icon", { part: "error-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["radio-button-default"]) || radioButtonDefault })));
            }
            if (!this.checked && !this.indeterminate) {
                // Default
                return (h("span", { part: "default-icon-wrapper", class: "radio__icon" }, h("hbr-icon", { part: "default-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["radio-button-default"]) || radioButtonDefault })));
            }
            if (this.checked) {
                // Check
                return (h("span", { part: "checked-icon-wrapper", class: "radio__icon" }, h("hbr-icon", { part: "checked-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["radio-button-selected"]) ||
                        radioButtonSelected })));
            }
            if (!this.checked && this.indeterminate) {
                // Indeterminate
                return (h("span", { part: "indeterminate-icon-wrapper", class: "radio__icon" }, h("hbr-icon", { part: "indeterminate-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["radio-button-indeterminate"]) ||
                        radioButtonIndeterminate })));
            }
        };
        this.renderContent = () => {
            return (h("span", { part: `content ${this.checked ? "content-checked" : ""}`, id: this.labelId, class: { radio__label: this.hasContent } }, h("slot", { onSlotchange: this.handleSlotChange })));
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
        this.indeterminate = false;
        this.checked = false;
        this.sentiment = "interact";
        this.invalid = false;
        this.tabidx = false;
        this.tooltip = undefined;
        this.autofocus = undefined;
        this.aria = undefined;
    }
    handleCheckedChange() {
        var _a;
        if (this.checked) {
            this.getSiblingRadios().forEach((radio) => {
                radio.checked = false;
            });
        }
        if (this.input) {
            this.input.checked = this.checked;
            (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.checked ? this.value || "on" : null);
        }
        this.hbrChange.emit();
        this.handleFirstRadioTabindex();
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleDisabledChange() {
        // Disabled form controls are always valid, so we need to recheck validity when the state changes
        if (this.input) {
            this.input.disabled = this.disabled;
        }
        this.handleFirstRadioTabindex();
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    componentDidLoad() {
        if (this.input) {
            this.input.indeterminate = this.indeterminate;
        }
        this.handleFirstRadioTabindex();
        setTimeout(() => {
            if (this.autofocus && document.activeElement !== this.host) {
                this.input.focus();
            }
        });
    }
    /** Simulates a click on the radio. */
    async setClick() {
        var _a;
        (_a = this.input) === null || _a === void 0 ? void 0 : _a.click();
    }
    /** Sets focus on the radio. */
    async setFocus(options) {
        var _a;
        (_a = this.input) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the radio. */
    async removeFocus() {
        var _a;
        (_a = this.input) === null || _a === void 0 ? void 0 : _a.blur();
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        var _a;
        return (_a = this.input) === null || _a === void 0 ? void 0 : _a.reportValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        var _a;
        (_a = this.input) === null || _a === void 0 ? void 0 : _a.setCustomValidity(message);
    }
    getAllRadios() {
        const parent = this.host.closest("hbr-radio-group");
        if (!parent)
            return [];
        return Array.from(parent.querySelectorAll("hbr-radio"));
    }
    getSiblingRadios() {
        return this.getAllRadios().filter((radio) => radio !== this.host);
    }
    handleClick(event) {
        var _a;
        if (this.readonly) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            this.input.checked = this.checked;
            return;
        }
        this.checked = (_a = this.input) === null || _a === void 0 ? void 0 : _a.checked;
        this.indeterminate = false;
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
    handleKeyDown(event) {
        var _a;
        if (this.readonly &&
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            return;
        }
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            const radios = this.getAllRadios().filter((radio) => !radio.disabled && !radio.readonly);
            const incr = ["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 1;
            let index = radios.indexOf(this.host) + incr;
            if (index < 0)
                index = radios.length - 1;
            if (index > radios.length - 1)
                index = 0;
            radios.forEach((radio) => {
                radio.checked = false;
            });
            if (radios[index]) {
                (_a = radios[index].shadowRoot.querySelector("input")) === null || _a === void 0 ? void 0 : _a.click();
                radios[index].setFocus();
            }
            event.preventDefault();
        }
    }
    handleMouseDown(event) {
        // Allow text selection in the read-only state while keeping the radio focusable.
        if (!this.readonly) {
            // Prevent clicks on the label from briefly blurring the input
            event.preventDefault();
        }
        this.input.focus();
    }
    handleSlotChange() {
        var _a;
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        this.hasContent = hasSlot(this.host);
        this._ariaLabel = ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) || this.host.textContent;
        this.hasElementSuffix = hasSlot(this.host, "element-suffix");
        this.hasDescriptionSlot = hasSlot(this.host, "description");
    }
    renderRadio() {
        const describedHelpId = this.helpTextId || this.hasHelpTextSlot ? this._helpTextId : "";
        const tooltipId = this.tooltip ? `${this.inputId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        return (h("label", { part: "base", class: {
                radio: true,
                "radio--checked": this.checked,
                "radio--disabled": this.disabled,
                "radio--readonly": this.readonly,
                "radio--focused": this.hasFocus,
                "radio--indeterminate": this.indeterminate,
                "radio--size-small": this.size === "small",
                "radio--size-medium": this.size === "medium",
                "radio--size-large": this.size === "large",
                "radio--has-description": this.hasDescriptionSlot,
            }, htmlFor: this.inputId, onKeyDown: this.handleKeyDown, onMouseDown: this.handleMouseDown }, h("span", { part: `control ${this.hasFocus ? "control-focus" : ""}`, class: "radio__control" }, this.renderIcon(), h("input", { part: "input", ref: (el) => {
                this.input = el;
            }, id: this.inputId, type: "radio", name: this.name, value: this.value, checked: this.checked, disabled: this.disabled, required: this.required, tabindex: this.tabidx ? `${this.tabidx}` : this.checked ? "0" : "-1", role: "radio", "aria-checked": this.indeterminate ? "mixed" : this.checked ? "true" : "false", "aria-disabled": this.disabled ? "true" : "false", "aria-readonly": this.readonly ? "true" : undefined, "aria-describedby": describedId, "aria-invalid": this.invalid ? "true" : false, onClick: this.handleClick, onBlur: this.handleBlur, onFocus: this.handleFocus, autofocus: this.autofocus, "aria-label": this._ariaLabel })), this.hasDescriptionSlot ? (h("span", { class: "main-container" }, this.renderContent(), h("span", { part: "description", class: "radio__description" }, h("slot", { name: "description", onSlotchange: this.handleSlotChange })))) : (this.renderContent())));
    }
    render() {
        return (h(Host, { key: '58d974f47e471462dc93ce6a0ab5d940c246c009' }, h(FormControl, { key: '573b1ebd83943443ad9005c1ce4b4d3ee342b2ee', inputId: "", labelId: this.labelId, size: this.size, isRequired: this.required, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, hasElementSuffix: this.hasElementSuffix, hasHelpTextSlot: this.hasHelpTextSlot, label: this.label, helpText: this.helpText, helpTextId: this.helpTextId || this._helpTextId, hasError: this.error, isDisabled: this.disabled, tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.inputId}-tooltip` : undefined }, this.renderRadio())));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "checked": ["handleCheckedChange"],
        "indeterminate": ["handleCheckedChange"],
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrRadioStyle0; }
}, [65, "hbr-radio", {
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
        "indeterminate": [1540],
        "checked": [1540],
        "sentiment": [1537],
        "invalid": [1540],
        "tabidx": [1032],
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
        "setCustomValidity": [64]
    }, undefined, {
        "checked": ["handleCheckedChange"],
        "indeterminate": ["handleCheckedChange"],
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-radio", "hbr-icon", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-radio":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Radio);
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

const HbrRadio = Radio;
const defineCustomElement = defineCustomElement$1;

export { HbrRadio, defineCustomElement };

