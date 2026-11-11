import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { F as FormControl } from './form-control.js';
import { a as attachElementInternals } from './element-internals.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const textareaCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{--focus-ring:var(--inverse-border-focus);display:block;--background-color:var(--control-bg-weak-default);--background-color-hover:var(--base-bg-weak-default);--background-color-focus:var(--control-bg-weak-default);--background-color-disabled:var(--control-bg-weak-disabled);--border-color:var(--control-border-default);--border-color-hover:var(--control-border-hover);--border-color-focus:var(--control-border-focus);--border-color-disabled:var(--control-border-disabled);--border-width:var(--hbr-border-width);--border-radius-large:var(--hbr-border-radius-md);--border:solid var(--border-width) var(--border-color);--border-color-bottom:var(--control-border-hover);--box-border:solid var(--border-width) var(--border-color-bottom);--font-size-small:var(--hbr-control-font-size-sm);--font-size-medium:var(--hbr-control-font-size-md);--font-size-large:var(--hbr-control-font-size-lg);--letter-spacing:var(--hbr-font-letter-spacing-normal);--color:var(--base-text-default);--color-hover:var(--base-text-default);--color-focus:var(--base-text-default);--color-disabled:var(--base-text-disabled);--placeholder-color:var(--base-text-weak-default);--spacing-small:var(--hbr-spacing-sm);--spacing-medium:var(--hbr-spacing-md);--spacing-large:var(--hbr-spacing-lg);--height:80px;--max-height:300px;--width:min(100%, 600px)}:host([fixed-width]){box-sizing:border-box;--min-width:60px;--width:280px;--max-width:600px;width:min(var(--width), 100%);min-width:var(--min-width);max-width:max(var(--width), var(--max-width))}:host([fixed-width][size=small]){--min-width:48px;--width:240px;--max-width:520px}:host([size=small]){--width:min(100%, 520px)}.textarea{box-sizing:border-box;display:flex;align-items:center;position:relative;width:var(--width);max-width:max(var(--width), 600px);font-family:var(--hbr-control-font-family);font-weight:var(--hbr-control-font-weight);line-height:var(--hbr-font-line-height-normal);letter-spacing:var(--letter-spacing);background-color:var(--background-color, var(--control-bg-weak-default));border:var(--border);vertical-align:middle;transition:var(--hbr-transition-fast) color, var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow;cursor:text}.textarea.textarea--fixed-width{width:100%}.textarea:hover:not(.textarea--disabled):not(.textarea--readonly){background-color:var(--background-color-hover);border-color:var(--control-border-hover)}.textarea:hover:not(.textarea--disabled):not(.textarea--readonly) .textarea__control{color:var(--color-hover)}.textarea.textarea--focused:not(.textarea--disabled){border-color:var(--border-color-focus);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.textarea.textarea--focused:not(.textarea--disabled):not(.textarea--error){outline:var(--hbr-focus-outline)}.textarea.textarea--focused:not(.textarea--disabled).textarea--error{outline:var(--hbr-focus-outline-error)}.textarea.textarea--focused:not(.textarea--disabled) .textarea__control{color:var(--color)}.textarea.textarea--readonly:not(.textarea--disabled){background-color:var(--base-bg-disabled);border-color:var(--control-border-disabled)}.textarea.textarea--error:not(.textarea--disabled){border-color:var(--negative-bg-default);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.textarea.textarea--error:not(.textarea--disabled) .input__control{color:var(--color)}.textarea.textarea--disabled{border-color:var(--border-color-disabled);cursor:not-allowed}.textarea.textarea--disabled .textarea__control{background-color:var(--background-color-disabled);color:var(--color-disabled)}.textarea.textarea--disabled .textarea__control::placeholder{color:var(--base-text-disabled)}.textarea__control{flex:1 1 auto;min-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:1.4;color:var(--color);border:none;border-radius:var(--control-border-radius);background:var(--control-bg-color, none);box-shadow:none;cursor:inherit;-webkit-appearance:none}.textarea__control::-webkit-search-decoration,.textarea__control::-webkit-search-cancel-button,.textarea__control::-webkit-search-results-button,.textarea__control::-webkit-search-results-decoration{-webkit-appearance:none}.textarea__control::placeholder{color:var(--placeholder-color);user-select:none}.textarea__control:focus{outline:none}.textarea:not(.textarea--rows) .textarea__control{height:var(--height);min-height:var(--min-height);max-height:var(--max-height)}.textarea__char-counter{text-align:right;font-size:var(--help-text-font-size-medium)}.textarea__char-counter{margin-top:var(--hbr-spacing-2xs, 4px)}.help-text-right .textarea__char-counter{margin-top:0px}.textarea__char-counter,.form-control--has-maxlength .form-control__help-text{color:var(--help-text-color)}.textarea__char-counter .char-counter__valid,.form-control--has-maxlength .form-control__help-text .char-counter__valid{font-weight:var(--hbr-font-weight-semibold, 600)}.form-control--has-help-text.form-control--has-maxlength .form-control__help-text{display:flex;gap:var(--hbr-spacing-lg, 24px)}.form-control--has-help-text.form-control--has-maxlength .form-control__help-text .help-text-right{display:flex;margin-left:auto}.textarea--small{max-width:max(var(--width), 520px)}.textarea--small:not(.textarea--rows){--min-height:28px}.textarea--small{border-radius:var(--border-radius-large);font-size:var(--font-size-small)}.textarea--small .textarea__control{padding:var(--spacing-small) var(--spacing-small)}.textarea--medium:not(.textarea--rows){--min-height:34px}.textarea--medium{border-radius:var(--hbr-border-radius-md);font-size:var(--font-size-medium)}.textarea--medium .textarea__control{padding:var(--spacing-small) var(--spacing-small)}.textarea--large{border-radius:var(--border-radius-large);font-size:var(--font-size-large)}.textarea--large .textarea__control{padding:var(--spacing-small) var(--spacing-small)}.textarea--resize-none .textarea__control{resize:none}.textarea--resize-vertical .textarea__control{resize:vertical}.textarea--resize-auto .textarea__control{height:auto;resize:none}:host{--control-border-radius:var(--hbr-border-radius-md, 6px)}:host([size=large]) .textarea__control{padding:7px 32px 7px 16px;line-height:22px}:host([size=large]) .textarea{font-size:var(--hbr-font-size-md, 16px)}:host([size=medium]) .textarea__control{padding:5px 20px 5px 10px;line-height:20px}:host([size=medium]) .textarea{font-size:var(--hbr-font-size-sm, 14px)}:host([size=small]) .textarea__control{padding:3px 20px 3px 6px;line-height:18px}:host([size=small]) .textarea{font-size:var(--hbr-font-size-xs, 12px)}:host-context([data-theme=onecd]){--border:solid var(--onecd-border-width-default) var(--border-color)}";
const HbrTextareaStyle0 = textareaCss;

let id = 0;
const DEFAULT_ROWS = 3;
const Textarea = /*@__PURE__*/ proxyCustomElement(class Textarea extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.inputId = `textarea-${++id}`;
        this.labelId = `textarea-label-${id}`;
        this.helpTextId = `textarea-help-text-${id}`;
        this.hasFocus = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.size = "medium";
        this.fixedWidth = false;
        this.name = "";
        this.value = "";
        this.label = "";
        this.helpText = "";
        this.placeholder = undefined;
        this.rows = DEFAULT_ROWS;
        this.resize = "vertical";
        this.disabled = false;
        this.readonly = false;
        this.minlength = undefined;
        this.maxlength = undefined;
        this.counter = true;
        this.required = undefined;
        this.invalid = false;
        this.autocapitalize = undefined;
        this.autocorrect = undefined;
        this.autocomplete = undefined;
        this.autofocus = undefined;
        this.spellcheck = undefined;
        this.inputmode = undefined;
        this.error = false;
        this.arialabel = undefined;
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleRowsChange() {
        this.setTextareaHeight();
    }
    handleDisabledChange() {
        // Disabled form controls are always valid, so we need to recheck validity when the state changes
        if (!this.textarea) {
            return;
        }
        this.textarea.disabled = this.disabled;
        this.invalid = !this.textarea.checkValidity();
    }
    handleValueChange() {
        var _a;
        // In rare cases, the watcher may be called before render so we need to make sure the textarea exists
        this.invalid = this.textarea ? !this.textarea.checkValidity() : false;
        // When value updates, textArea height should be updated
        // setTimeout is used to make sure value is updated in textarea before height is calculated
        setTimeout(() => this.setTextareaHeight());
        (_a = this.internals) === null || _a === void 0 ? void 0 : _a.setFormValue(this.value || null);
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.renderHelpTextRight = this.renderHelpTextRight.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    componentDidLoad() {
        this.setTextareaHeight();
        this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight());
        if (this.textarea) {
            this.resizeObserver.observe(this.textarea);
            this.invalid = !this.textarea.checkValidity();
        }
    }
    disconnectedCallback() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.textarea);
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    /** Sets focus on the textarea. */
    async setFocus(options) {
        this.textarea.focus(options);
    }
    /** Removes focus from the textarea. */
    async removeFocus() {
        this.textarea.blur();
    }
    /** Selects all the text in the input. */
    async select() {
        var _a;
        return (_a = this.textarea) === null || _a === void 0 ? void 0 : _a.select();
    }
    /** Sets the start and end positions of the text selection (0-based). */
    async setSelectionRange(selectionStart, selectionEnd, selectionDirection = "none") {
        var _a;
        return (_a = this.textarea) === null || _a === void 0 ? void 0 : _a.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }
    /** Replaces a range of text with a new string. */
    async setRangeText(replacement, start, end, selectMode = "preserve") {
        if (this.textarea) {
            this.textarea.setRangeText(replacement, start, end, selectMode);
            if (this.value !== this.textarea.value) {
                this.value = this.textarea.value;
                this.setTextareaHeight();
                this.hbrChange.emit();
                this.hbrInput.emit();
            }
        }
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        var _a;
        return (_a = this.textarea) === null || _a === void 0 ? void 0 : _a.reportValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        if (this.textarea) {
            this.textarea.setCustomValidity(message);
            this.invalid = !this.textarea.checkValidity();
        }
    }
    /** Scrolls the textarea to the bottom. Useful for display where new content is appended. */
    async scrollToBottom() {
        if (!this.textarea) {
            return;
        }
        // Frameworks (Angular, React, Vue) often call scrollToBottom in the same
        // tick as updating state, but the new value prop hasn't been pushed to
        // the web component yet. Yielding to the next microtask lets the
        // framework's change-detection / render cycle flush the binding first.
        await Promise.resolve();
        if (!this.textarea)
            return;
        // Ensure the native element and auto-height are in sync with the
        // (now-updated) value before we measure scrollHeight.
        this.textarea.value = this.value;
        this.setTextareaHeight();
        this.textarea.scrollTop = this.textarea.scrollHeight;
    }
    handleChange() {
        this.hbrChange.emit();
    }
    handleInput() {
        var _a;
        this.value = (_a = this.textarea) === null || _a === void 0 ? void 0 : _a.value;
        this.setTextareaHeight();
        this.hbrInput.emit();
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
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
    }
    handleInvalid() {
        this.invalid = true;
    }
    setTextareaHeight() {
        if (!this.textarea) {
            return;
        }
        const wrapper = this.textarea.closest(".textarea");
        const wrapperStyle = wrapper instanceof HTMLElement ? getComputedStyle(wrapper) : undefined;
        const maxHeight = wrapperStyle
            ? Number.parseFloat(wrapperStyle.maxHeight)
            : Number.NaN;
        const hasMaxHeight = Number.isFinite(maxHeight) && maxHeight > 0;
        const textareaStyle = getComputedStyle(this.textarea);
        const verticalChrome = textareaStyle.boxSizing === "border-box"
            ? 0
            : Number.parseFloat(textareaStyle.paddingTop || "0") +
                Number.parseFloat(textareaStyle.paddingBottom || "0") +
                Number.parseFloat(textareaStyle.borderTopWidth || "0") +
                Number.parseFloat(textareaStyle.borderBottomWidth || "0");
        const textareaMaxHeight = hasMaxHeight
            ? Math.max(maxHeight - verticalChrome, 0)
            : Number.NaN;
        if (hasMaxHeight) {
            this.textarea.style.maxHeight = `${textareaMaxHeight}px`;
        }
        else {
            this.textarea.style.removeProperty("max-height");
        }
        if (this.resize === "auto") {
            this.textarea.style.height = "auto";
            const maxConstrainedHeight = hasMaxHeight
                ? Math.min(this.textarea.scrollHeight, textareaMaxHeight)
                : this.textarea.scrollHeight;
            this.textarea.style.height = `${maxConstrainedHeight}px`;
            this.textarea.style.overflowY =
                hasMaxHeight && this.textarea.scrollHeight > textareaMaxHeight
                    ? "auto"
                    : "hidden";
        }
        else {
            if (hasMaxHeight && this.textarea.offsetHeight > maxHeight) {
                this.textarea.style.height = `${textareaMaxHeight}px`;
            }
            this.textarea.style.removeProperty("overflow-y");
        }
    }
    renderHelpTextRight() {
        if (!this.counter || !this.maxlength || this.maxlength <= 0) {
            return null;
        }
        if (this.helpText) {
            return (h("div", { part: "help-text-right", class: "help-text-right" }, h("slot", { name: "help-text-right" }), this.renderCounterText()));
        }
        return null;
    }
    renderCounterText() {
        var _a, _b, _c;
        return (h("div", { part: "char-counter", slot: "char-counter", class: "textarea__char-counter" }, h("span", { class: {
                "char-counter__current": true,
                "char-counter__valid": ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) <= this.maxlength,
            } }, ((_c = this.value) === null || _c === void 0 ? void 0 : _c.length) || 0), "/", h("span", { class: "char-max-length" }, this.maxlength)));
    }
    render() {
        var _a, _b;
        return (h(FormControl, { key: '6223e1b48f1e7994cd64cbb0a154baa5324b162b', inputId: this.inputId, label: this.label, labelId: this.labelId, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, helpTextId: this.helpText || this.hasHelpTextSlot ? this.helpTextId : undefined, helpText: this.helpText, hasHelpTextSlot: this.hasHelpTextSlot, size: this.size, source: "textarea", hasFocus: this.hasFocus, hasValue: ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) > 0, hasError: this.error, isRequired: this.required, isDisabled: this.disabled, maxlength: this.maxlength, renderHelpTextRight: this.renderHelpTextRight }, h("div", { key: '023fa6cf25362069be0a01fae2d1c1241d6ea40b', part: "base", class: {
                textarea: true,
                // Sizes
                "textarea--small": this.size === "small",
                "textarea--medium": this.size === "medium",
                "textarea--large": this.size === "large",
                "textarea--fixed-width": this.fixedWidth,
                // States
                "textarea--disabled": this.disabled,
                "textarea--readonly": this.readonly,
                "textarea--focused": this.hasFocus,
                "textarea--empty": ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) === 0,
                "textarea--invalid": this.invalid,
                "textarea--error": this.error,
                // Modifiers
                "textarea--resize-none": this.resize === "none",
                "textarea--resize-vertical": this.resize === "vertical",
                "textarea--resize-auto": this.resize === "auto",
                "textarea--max-length": this.maxlength && this.maxlength > 0,
                "textarea--rows": this.rows !== DEFAULT_ROWS,
            } }, h("span", { key: '0c76829ee0431e122d0a9579332e0d5511529946', part: "prefix", class: "textarea__prefix" }, h("slot", { key: 'b443dc9ad598dbc8b33204575145a853b4025022', name: "prefix" })), h("textarea", { key: '7a3826024fa333ffb53169bbcacacbf113f948d0', part: `textarea${this.error ? " error" : ""}`, ref: (el) => {
                this.textarea = el;
            }, id: this.inputId, class: "textarea__control", name: this.name, placeholder: this.placeholder, disabled: this.disabled, readOnly: this.readonly, rows: this.rows, minLength: this.minlength, maxLength: this.maxlength, value: this.value, autoCapitalize: this.autocapitalize, autoCorrect: this.autocorrect, spellcheck: this.spellcheck, required: this.required, inputMode: this.inputmode, onChange: this.handleChange, onInput: this.handleInput, onInvalid: this.handleInvalid, onFocus: this.handleFocus, onBlur: this.handleBlur, "aria-label": this.arialabel, "aria-describedby": this.helpText || this.hasHelpTextSlot
                ? this.helpTextId
                : undefined }), h("span", { key: '6287a652c58b24b08a2ccd948468278299035d6c', part: "suffix", class: "textarea__suffix" }, h("slot", { key: 'fcdf3d5ed7ebbad51e9fa3331e047e646815777d', name: "suffix" }))), !this.helpText &&
            this.maxlength !== undefined &&
            this.maxlength > 0 &&
            this.counter &&
            this.renderCounterText()));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "rows": ["handleRowsChange"],
        "disabled": ["handleDisabledChange"],
        "value": ["handleValueChange"]
    }; }
    static get style() { return HbrTextareaStyle0; }
}, [65, "hbr-textarea", {
        "size": [513],
        "fixedWidth": [516, "fixed-width"],
        "name": [513],
        "value": [1537],
        "label": [1],
        "helpText": [1, "help-text"],
        "placeholder": [1],
        "rows": [2],
        "resize": [1],
        "disabled": [516],
        "readonly": [516],
        "minlength": [514],
        "maxlength": [514],
        "counter": [1028],
        "required": [516],
        "invalid": [1540],
        "autocapitalize": [1],
        "autocorrect": [1],
        "autocomplete": [1],
        "autofocus": [4],
        "spellcheck": [4],
        "inputmode": [1],
        "error": [4],
        "arialabel": [1],
        "hasFocus": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "select": [64],
        "setSelectionRange": [64],
        "setRangeText": [64],
        "reportValidity": [64],
        "setCustomValidity": [64],
        "scrollToBottom": [64]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"],
        "rows": ["handleRowsChange"],
        "disabled": ["handleDisabledChange"],
        "value": ["handleValueChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-textarea", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-textarea":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Textarea);
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTextarea = Textarea;
const defineCustomElement = defineCustomElement$1;

export { HbrTextarea, defineCustomElement };

