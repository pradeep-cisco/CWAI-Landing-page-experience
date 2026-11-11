import { proxyCustomElement, HTMLElement, createEvent, h, Fragment } from '@stencil/core/internal/client';
import { s as setDefaultAnimation, a as stopAnimations } from './animate.js';
import { w as waitForEvent } from './browser.js';
import { a as attachElementInternals } from './element-internals.js';
import { u as updateValidity, s as setValidity, e as emitInvalidEvent } from './form.js';
import { s as scrollIntoView } from './scroll.js';
import { b as hasDefaultSlot, h as hasSlot } from './slot.js';
import { d as defineCustomElement$7 } from './icon.js';
import { d as defineCustomElement$6 } from './icon-button.js';
import { d as defineCustomElement$5 } from './popup.js';
import { d as defineCustomElement$4 } from './select-anchor.js';
import { d as defineCustomElement$3 } from './tag.js';
import { d as defineCustomElement$2 } from './tooltip.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const selectCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--popup-shadow:var(--hbr-shadow-md);--popup-padding:var(--hbr-spacing-md) 0;--popup-border-radius:var(--hbr-border-radius-md);--popup-bg:var(--base-bg-weak-default);--popup-min-width:none;box-sizing:border-box;--color:var(--base-text-default);--border-color:var(--control-border-default);--hover-color:var(--selected-text-hover, var(--base-text-default));--box-bg-color:transparent;--box-bg-color-disabled:transparent;--box-bg-color-focus:var(--box-bg-color);--anchor-color:var(--color);--anchor-hover-color:var(--hover-color);--anchor-box-bg-color:var(--box-bg-color);--anchor-box-bg-focus:var(--box-bg-color-focus);--anchor-box-bg-disabled:var(--box-bg-color-disabled);--anchor-border-color:var(--border-color);--min-width:none;--max-width:none;min-width:var(--min-width);max-width:var(--max-width);--anchor-min-width:var(--min-width);--anchor-max-width:var(--max-width);--popup-box-max-width:none}.select__listbox{box-sizing:border-box;display:block;position:relative;font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-md);font-weight:var(--hbr-font-weight-normal);box-shadow:var(--popup-shadow);background:var(--popup-bg);border:var(--popup-border);border-radius:var(--popup-border-radius);padding-block:var(--popup-padding);overflow:auto;overscroll-behavior:none;min-width:var(--popup-min-width);max-width:var(--popup-box-max-width, var(--auto-size-available-width));max-height:var(--auto-size-available-height);height:var(--listbox-height)}.select__listbox ::slotted(hbr-divider){--spacing:var(--hbr-spacing-xs)}.select__listbox ::slotted(small){font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-semibold);color:var(--base-text-default);padding-block:var(--hbr-spacing-xs)}.select__listbox.select__truncate{max-width:var(--truncate-max-width, 600px)}.select__listbox ::slotted(div.hbr-css__select-list-container){padding:var(--listbox-non-option-padding);display:flex;flex-direction:row;justify-content:center}.select__listbox ::slotted(div.hbr-css__select-sticky-header){position:sticky;top:calc(-1 * var(--popup-padding, var(--hbr-spacing-md)));margin-top:calc(-1 * var(--popup-padding, var(--hbr-spacing-md)));background-color:var(--popup-bg, var(--control-bg-weak-default));z-index:1}.select__listbox ::slotted(div.hbr-css__select-sticky-footer){position:sticky;bottom:calc(-1 * var(--popup-padding, var(--hbr-spacing-md)));margin-bottom:calc(-1 * var(--popup-padding, var(--hbr-spacing-md)));background-color:var(--popup-bg, var(--control-bg-weak-default));z-index:1}hbr-select-anchor{--box-bg-color:var(--anchor-box-bg-color);--box-bg-color-focus:var(--anchor-box-bg-focus);--color:var(--anchor-color);--hover-color:var(--anchor-hover-color);--anchor-box-bg-disabled-color:var(--box-bg-disabled);--border-color:var(--anchor-border-color, var(--control-border-default));--min-width:var(--anchor-min-width);--max-width:var(--anchor-max-width)}:host-context([data-theme=onecd]){--popup-bg:var(--onecd-glass-frost-bg-control, rgba(255, 255, 255, 0.85));--popup-shadow:0 0 30px 0 var(--onecd-glass-frost-shadow-inner, rgba(255, 255, 255, 0.60)) inset, 0 0 0 1px var(--onecd-glass-frost-shadow-border, rgba(255, 255, 255, 0.60)) inset, 0 2px 5px 0 var(--shadow-colors-elevation-subtle, rgba(0, 0, 0, 0.05))}:host-context([data-theme=onecd]) .select__listbox{--popup-border:var(--onecd-border-width-default, 1px) solid var(--control-border-default);--popup-border-radius:var(--onecd-radius-small-default, 6px)}:host-context([data-theme=onecd]) .select__listbox::before{content:\" \";z-index:-1;position:absolute;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(calc(var(--onecd-glass-frost-blur-base, 80px) / 2));border-radius:var(--popup-border-radius)}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]){--popup-bg:var(--control-bg-weak-default, #FFF);--popup-shadow:0 2px 5px 0 var(--shadow-colors-elevation-subtle, rgba(0, 0, 0, 0.05))}:host-context([data-theme=onecd][data-theme-onecd-mode=no-transparency]) .select__listbox::before{content:none}";
const HbrSelectStyle0 = selectCss;

/**
 * @since 0.0.14
 * @status stable
 *
 * @description A select lets users select one or more items from a list.
 *
 * @slot - The listbox options. Must be `<hbr-option>` elements. You can use `<hbr-divider>` to group items visually.
 * @slot prefix - Used to prepend a presentational icon or similar element to the combobox.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot label-suffix - Non-interactive content to display inline with the input label.
 * @slot label-info - Interactive informational content, such as a tooltip trigger, displayed next to the input label.
 * @slot tags - The container that houses option tags when `multiselect` is used.
 * @slot counter - The number of selected options when `multiselect` is used.
 * @slot counter-label - The label of number of selected options when `multiselect` is used.
 * @slot expand-icon - The icon to show when the control is expanded and collapsed. Rotates on open and close.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @part base - The component's base wrapper.
 * @part clear-button - The clear button.
 * @part form-control - The form control that wraps the label, input, and help text.
 * @part label-container - The container that wraps the label and label-info slot.
 * @part label - The input label.
 * @part combobox - The container the wraps the prefix, combobox, clear icon, and expand button.
 * @part prefix -  The container that wraps the prefix slot.
 * @part counter - The number of selected options element.
 * @part display-input - The element that displays the selected option's label, an `<input>` element.
 * @part listbox - The listbox container where options are slotted.
 * @part tags - The container that houses option tags when `multiselect` is used.
 * @part tag - The individual tags that represent each multiselect option.
 * @part tag__base - The tag's base part.
 * @part tag__prefix - The tag's prefix part.
 * @part tag__content - The tag's content part.
 * @part tag__remove-button - The tag's remove button.
 * @part tag__remove-button__base - The tag's remove button base part.
 * @part clear-button - The clear button.
 * @part clear-icon - The clear button.
 * @part expand-icon - The container that wraps the expand icon.
 * @part front - Placed between label and main content in the form element.
 * @part rear - Placed after the form element before the help text.
 * @part help-text - The help text wrapper element
 *
 * @data-testid combobox - The combobox trigger element.
 * @data-testid clear-button - The clear-value button when `clearable` is enabled.
 */
/**
 * We store a Set of controls that users have interacted with. This allows us to determine the interaction state
 * without littering the DOM with additional data attributes.
 */
const userInteractedControls = new WeakSet();
/**
 * We store a WeakMap of interactions for each form control so we can track when all conditions are met for validation.
 */
const interactions = new WeakMap();
let id = 0;
const Select = /*@__PURE__*/ proxyCustomElement(class Select extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.hbrSearch = createEvent(this, "hbr-search", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrClear = createEvent(this, "hbr-clear", 7);
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrComboInput = createEvent(this, "hbr-combo-input", 7);
        this.hbrInvalid = createEvent(this, "hbr-invalid", 7);
        this.inputId = `select-${++id}`;
        this.labelId = `select-label-${id}`;
        this.listboxId = `select-listbox-${id}`;
        this.helpTextId = `select-help-text-${id}`;
        // private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label');
        // private readonly localize = new LocalizeController(this);
        this.typeToSelectString = "";
        this.assumeInteractionOn = ["hbr-blur", "hbr-input"];
        this.multiType = this.variant === "multiple" || this.variant === "tag";
        this.defaultI18n = { clearEntry: "Clear entry" };
        this.handleTruncate = (event) => {
            const { truncated, content } = event.detail;
            this.truncateContent = truncated ? content : "";
        };
        this.handleInteraction = (event) => {
            var _a;
            const emittedEvents = (_a = interactions.get(this.host)) !== null && _a !== void 0 ? _a : undefined;
            if (!emittedEvents.includes(event.type)) {
                emittedEvents.push(event.type);
            }
            // Mark it as user-interacted as soon as all associated events have been emitted
            if (emittedEvents.length === this.assumeInteractionOn.length) {
                this.setUserInteracted(this.host, true);
            }
        };
        this.handleDocumentFocusIn = (event) => {
            // Close when focusing out of the select
            const path = event.composedPath();
            if (this && !path.includes(this.host)) {
                if (!this.anchor ||
                    !path.some((el) => el.localName === "hbr-select-anchor")) {
                    this.hide();
                }
            }
        };
        this.handleDocumentKeyDown = async (event) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if (this.readonly) {
                return;
            }
            const target = event.target;
            const isSpaceKey = event.key === " " || event.code === "Space";
            const isClearButton = target.closest(".select__clear") !== null;
            const isIconButton = target.closest("hbr-icon-button") !== null;
            const isOption = target.closest("hbr-option") !== null;
            this.eventTrigger = event.key || "mouse";
            // Ignore if it's add new option flow
            if (target.classList.contains("hbr-event__allow-default-behavior")) {
                return;
            }
            // Ignore presses when the target is an icon button (e.g. the remove button in <hbr-tag>)
            if (isClearButton || isIconButton) {
                return;
            }
            /** new option add button is in disaplay and a Tab pressed, focus should move to the add button */
            const focusOnAddButton = this.editable &&
                this.variant === "single" &&
                this.open &&
                event.key === "Tab";
            if (focusOnAddButton) {
                const addOption = this.host.querySelector("hbr-option[custom]");
                if (addOption && !addOption.disabled) {
                    addOption.focus();
                    return;
                }
            }
            if (this.searchable && this.open && isSpaceKey && !isOption) {
                return;
            }
            // Handle enter and space. When pressing space, we allow for type to select behaviors so if there's anything in the
            // buffer we _don't_ close it.
            if (!this.editable &&
                (event.key === "Enter" || (isSpaceKey && this.typeToSelectString === ""))) {
                event.preventDefault();
                event.stopImmediatePropagation();
                // If it's not open, open it
                if (!this.open) {
                    this.eventTrigger = event.key || "mouse";
                    this.show();
                    return;
                }
                // If it is open, update the value based on the current selection and close it
                /** adding !this.currentOption.custom condition due to adding new option flow. if entered new option and press enter key it works as expected.
                 * however press arrow down to select the new option div. then tab to '+Add' button it sets value "new option" in single select however it doesn't add 'selected' on the option.
                 * it's caused by setting currentOption on arrowDown to select the new option div */
                if (this.currentOption &&
                    !this.currentOption.custom &&
                    !this.currentOption.disabled) {
                    if (this.multiType) {
                        /** select all use case */
                        if (this.selectAll !== undefined &&
                            this.currentOption.dataset.check === "all") {
                            if (this.variant === "single" || this.disabled) {
                                return; /** only valid with multiple counter / tags. */
                            }
                            const checkbox = this.currentOption.querySelector("hbr-checkbox");
                            if (checkbox) {
                                this.hbrChange.emit({
                                    option: this.currentOption,
                                    selectAll: true,
                                });
                            }
                            return;
                        }
                        this.toggleOptionSelection(this.currentOption);
                    }
                    else {
                        this.setSelectedOptions(this.currentOption);
                    }
                    // Emit after updating
                    setTimeout(() => {
                        this.hbrInput.emit();
                        this.hbrChange.emit({ option: this.currentOption });
                    });
                    if (!this.multiType) {
                        this.hide();
                        (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                    }
                }
                else if (this.variant === "single" &&
                    ((_b = event.target) === null || _b === void 0 ? void 0 : _b.closest("hbr-option"))) {
                    this.hide();
                    (_c = this.displayInput) === null || _c === void 0 ? void 0 : _c.focus({ preventScroll: true });
                }
                return;
            }
            if (this.editable &&
                (event.key === "Enter" || (isSpaceKey && this.typeToSelectString === ""))) {
                if (event.target.closest("hbr-option")) {
                    //shouldn't click option unless focus is on the option
                    this.handleOptionClick(event);
                }
                else {
                    const targetValue = event.target.value;
                    if (!(targetValue === null || targetValue === void 0 ? void 0 : targetValue.length)) {
                        //only empty string. otherwise, space bar doesn't work for typing space
                        event.preventDefault();
                    }
                    this.open = false;
                    this.hbrInvalid.emit({
                        value: (_d = this.displayInput) === null || _d === void 0 ? void 0 : _d.value,
                    });
                }
                setTimeout(() => {
                    // should focus the input after the click
                    this.editable = true;
                });
            }
            // Navigate options
            if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                this.eventTrigger = event.key;
                const allOptions = this.getAllOptions();
                const currentIndex = allOptions.indexOf(this.currentOption);
                let newIndex = Math.max(0, currentIndex);
                // Prevent scrolling
                event.preventDefault();
                // Open it
                if (!this.open) {
                    this.show();
                    if (this.searchable) {
                        this.editable = true;
                    }
                    // If an option is already selected, stop here because we want that one to remain highlighted when the listbox
                    // opens for the first time
                    if (this.currentOption) {
                        return;
                    }
                }
                if (event.key === "ArrowDown") {
                    newIndex = currentIndex + 1;
                    /** skip focus on disabled item */
                    if ((_e = allOptions[newIndex]) === null || _e === void 0 ? void 0 : _e.disabled) {
                        while ((_f = allOptions[newIndex]) === null || _f === void 0 ? void 0 : _f.disabled) {
                            newIndex++;
                        }
                    }
                    if (newIndex > allOptions.length - 1)
                        newIndex = 0;
                }
                else if (event.key === "ArrowUp") {
                    newIndex = currentIndex - 1;
                    if (newIndex < 0)
                        newIndex = allOptions.length - 1;
                    /** skip focus on disabled item */
                    if ((_g = allOptions[newIndex]) === null || _g === void 0 ? void 0 : _g.disabled) {
                        while ((_h = allOptions[newIndex]) === null || _h === void 0 ? void 0 : _h.disabled) {
                            newIndex--;
                        }
                    }
                }
                else if (event.key === "Home") {
                    newIndex = 0;
                }
                else if (event.key === "End") {
                    newIndex = allOptions.length - 1;
                }
                this.setCurrentOption(allOptions[newIndex]); // focus new option div as well
            }
            if (!this.searchable) {
                // All other "printable" keys trigger type to select
                if (event.key.length === 1 || event.key === "Backspace") {
                    const allOptions = this.getAllOptions();
                    // Don't block important key combos like CMD+R
                    if (event.metaKey || event.ctrlKey || event.altKey) {
                        return;
                    }
                    // Open, unless the key that triggered is backspace
                    if (!this.open) {
                        if (event.key === "Backspace") {
                            return;
                        }
                        this.show();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    this.typeToSelectString = "";
                    clearTimeout(this.typeToSelectTimeout);
                    this.typeToSelectTimeout = window.setTimeout(() => { }, 1000);
                    if (event.key === "Backspace") {
                        this.typeToSelectString = this.typeToSelectString.slice(0, -1);
                    }
                    else {
                        this.typeToSelectString += event.key.toLowerCase();
                    }
                    for (const option of allOptions) {
                        /** if option.display exists, show it first */
                        const textContent = this.getTextContent(option);
                        const label = option.display
                            ? option.display.toLowerCase()
                            : textContent || ((_j = (await option.getTextLabel())) === null || _j === void 0 ? void 0 : _j.toLowerCase());
                        if (label.startsWith(this.typeToSelectString)) {
                            this.setCurrentOption(option);
                            break;
                        }
                    }
                }
            }
        };
        this.handleDocumentMouseDown = (event) => {
            this.eventTrigger = "mouse";
            // Close when clicking outside of the select
            const path = event.composedPath();
            if (this && !path.includes(this.host)) {
                if (!this.anchor ||
                    !path.some((el) => el.localName === "hbr-select-anchor")) {
                    this.hide();
                }
            }
        };
        this.hasFocus = false;
        this.displayLabel = "";
        this.currentOption = undefined;
        this.selectedOptions = [];
        this.rerender = false;
        this.truncateContent = "";
        this.hasLabelSlot = undefined;
        this.hasLabelInfoSlot = undefined;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.hasHelpTextSlot = undefined;
        this.hasClearIconSlot = undefined;
        this.hasExpandIconSlot = undefined;
        this.hasTagsSlot = undefined;
        this.hasDefaultSlot = false;
        this.editable = false;
        this.name = "";
        this.value = "";
        this.variant = "single";
        this.size = "medium";
        this.placeholder = "";
        this.multiple = false;
        this.disabled = false;
        this.clearable = false;
        this.open = false;
        this.hoist = false;
        this.enablePopover = false;
        this.filled = false;
        this.pill = false;
        this.label = undefined;
        this.arialabel = undefined;
        this.truncate = undefined;
        this.sync = "width";
        this.placement = undefined;
        this.skidding = undefined;
        this.helpText = "";
        this.required = false;
        this.error = false;
        this.anchor = undefined;
        this.searchable = undefined;
        this.search = undefined;
        this.custom = undefined;
        this.readonly = false;
        this.autocomplete = false;
        this.uncontrolled = undefined;
        this.tooltip = undefined;
        this.autofocus = undefined;
        this.tagWrap = undefined;
        this.lines = undefined;
        this.i18n = undefined;
    }
    /** Gets the validity state object */
    get validity() {
        var _a;
        return (_a = this.valueInput) === null || _a === void 0 ? void 0 : _a.validity;
    }
    /** Gets the validation message */
    get validationMessage() {
        var _a;
        return (_a = this.valueInput) === null || _a === void 0 ? void 0 : _a.validationMessage;
    }
    connectedCallback() {
        var _a;
        (_a = this.internals) !== null && _a !== void 0 ? _a : (this.internals = attachElementInternals(this.host));
        // Because this is a form control, it shouldn't be opened initially
        this.open = false;
        // Listen for interactions
        interactions.set(this.host, []);
        this.assumeInteractionOn.forEach((event) => {
            this.host.addEventListener(event, this.handleInteraction);
        });
        this.handleDefaultSlotChange = this.handleDefaultSlotChange.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.handleDisabledChange = this.handleDisabledChange.bind(this);
        this.handleComboboxKeyDown = this.handleComboboxKeyDown.bind(this);
        this.handleComboboxMouseDown = this.handleComboboxMouseDown.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleTagRemove = this.handleTagRemove.bind(this);
        this.handlePopupHide = this.handlePopupHide.bind(this);
        this.handlePopupKeydown = this.handlePopupKeydown.bind(this);
        if (!this.placement) {
            /** moving the default value here from Prop so we can conditionally set if sync is none or not */
            this.placement = this.sync === "none" ? "bottom-start" : "bottom";
        }
    }
    componentWillLoad() {
        var _a, _b, _c;
        if (this.autocomplete) {
            this.searchable = true;
        }
        if (this.searchable) {
            this.uncontrolled = true;
        }
        this.hasDefaultSlot = hasDefaultSlot(this.host);
        this.eventTrigger = undefined;
        //angular doesn't run watch("variant") on initial render
        if (!this.multiType &&
            (this.variant === "multiple" || this.variant === "tag")) {
            this.multiType = true;
        }
        // secure the tagLabels and selectedOptions if value is not empty
        if (this.searchable && ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length)) {
            if (!((_b = this.selectedOptions) === null || _b === void 0 ? void 0 : _b.length) ||
                (this.variant === "tag" && !((_c = this.tagLabels) === null || _c === void 0 ? void 0 : _c.length))) {
                this.handleValueChange();
            }
        }
    }
    componentDidLoad() {
        /** double check */
        if (this.selectAll === undefined) {
            this.setSelectAll();
        }
    }
    componentWillUpdate() {
        /** When the client-side updates trigger re-renders, the classes on the host are removed.
         * Therefore, we need to reapply them.
         */
        if (this.selectAll !== undefined) {
            if (!this.host.classList.contains("hbr-select-checkbox")) {
                this.host.classList.add("hbr-select-checkbox");
            }
            /** need for divider style */
            if (!this.host.classList.contains("hbr-select-all")) {
                this.host.classList.add("hbr-select-all");
            }
        }
    }
    componentWillRender() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (this.variant === "tag") {
            if ((_a = this.selectedOptions) === null || _a === void 0 ? void 0 : _a.length) {
                // For the custom style of flex start
                this.host.classList.add("select-tag--selected");
            }
            else {
                this.host.classList.remove("select-tag--selected");
            }
        }
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasClearIconSlot = hasSlot(this.host, "clear-icon");
        this.hasExpandIconSlot = hasSlot(this.host, "expand-icon");
        this.hasTagsSlot = hasSlot(this.host, "tags");
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        const hasCounterSlot = hasSlot(this.host, "counter");
        const hasLabel = this.label ? true : !!this.hasLabelSlot;
        const hasHelpText = this.helpText ? true : !!this.hasHelpTextSlot;
        if (this.open && hasHelpText) {
            const helpText = (_b = this.anchorEl) === null || _b === void 0 ? void 0 : _b.shadowRoot.querySelector(".form-control__help-text");
            helpText === null || helpText === void 0 ? void 0 : helpText.classList.add("select__hide-helpText");
        }
        if (this.open && this.hasRearSlot) {
            const rear = (_c = this.anchorEl) === null || _c === void 0 ? void 0 : _c.shadowRoot.querySelector(".form-control__rear");
            rear === null || rear === void 0 ? void 0 : rear.classList.add("select__hide-rear");
        }
        const optionSlotsExist = this.autocomplete || (!this.autocomplete && this.getAllOptions().length);
        const showClearIcon = (this.clearable && this.editable && ((_d = this.displayInput) === null || _d === void 0 ? void 0 : _d.value)) ||
            ((_e = this.value) === null || _e === void 0 ? void 0 : _e.length) > 0;
        const hasClearIcon = !!(this.clearable &&
            !this.disabled &&
            !this.readonly &&
            showClearIcon &&
            optionSlotsExist);
        const isPlaceholderVisible = !!(this.placeholder && ((_f = this.value) === null || _f === void 0 ? void 0 : _f.length) === 0);
        const showPrefix = !!(this.variant === "single" || !((_g = this.value) === null || _g === void 0 ? void 0 : _g.length));
        const hideInput = !!((this.variant === "tag" ||
            (!this.searchable && this.variant === "multiple")) &&
            ((_h = this.value) === null || _h === void 0 ? void 0 : _h.length)); //searchable need input for the search
        const cssClasses = {
            select: true,
            "select--open": this.open,
            "select--empty": ((_j = this.value) === null || _j === void 0 ? void 0 : _j.length) === 0,
            "select--clearable": this.clearable,
            "select--focused": this.hasFocus,
            "select--disabled": this.disabled,
            "select--readonly": this.readonly,
            "select--multiType": this.multiType,
            "select--single": this.variant === "single",
            "select--multi": this.variant === "multiple",
            "select--tag": this.variant === "tag",
            "select--searchable": this.searchable,
            "select--standard": true,
            "select--filled": this.filled,
            "select--placeholder-visible": isPlaceholderVisible,
            "select--has-num": this.variant === "multiple" && 0 < ((_k = this.value) === null || _k === void 0 ? void 0 : _k.length),
            "select--has-tags": this.variant === "tag" && 0 < ((_l = this.value) === null || _l === void 0 ? void 0 : _l.length),
            "select--small": this.size === "small",
            "select--medium": this.size === "medium",
            "select--large": this.size === "large",
            "select--pill": this.pill,
            "select--error": this.error,
            "select--top": this.placement === "top",
            "select--bottom": this.placement === "bottom",
            "select--autocomplete": this.autocomplete,
            "select--all": this.variant !== "single" && this.selectAll !== undefined,
            "select--uncontrolled": this.uncontrolled,
        };
        this.anchorProps = {
            inputId: this.inputId,
            label: this.label,
            labelId: this.labelId,
            arialabel: this.arialabel,
            listboxId: this.listboxId,
            hasLabel: hasLabel,
            hasLabelSlot: this.hasLabelSlot,
            hasLabelInfoSlot: this.hasLabelInfoSlot,
            hasFrontSlot: this.hasFrontSlot,
            hasRearSlot: this.hasRearSlot,
            hasCounterSlot: hasCounterSlot,
            hasClearIcon: hasClearIcon,
            showPrefix: showPrefix,
            hideInput: hideInput,
            helpTextId: this.helpText ? this.helpTextId : undefined,
            helpText: this.helpText,
            hasHelpText: hasHelpText,
            hasHelpTextSlot: this.hasHelpTextSlot,
            size: this.size,
            variant: this.variant,
            placeholder: this.placeholder,
            value: this.value,
            displayLabel: this.displayLabel,
            disabled: this.disabled,
            required: this.required,
            error: this.error,
            open: this.open,
            selectedOptions: this.selectedOptions,
            setDisplayInputRef: this.setDisplayInputRef.bind(this),
            setSearchInputRef: this.setSearchInputRef.bind(this),
            setComboboxRef: this.setComboboxRef.bind(this),
            setValueInputRef: this.setValueInputRef.bind(this),
            handleLabelClick: this.handleLabelClick,
            handleFocus: this.handleFocus.bind(this),
            handleKeyUp: this.handleKeyUp.bind(this),
            handleBlur: this.handleBlur.bind(this),
            handleSearch: this.handleSearch.bind(this),
            handleComboboxKeyDown: this.handleComboboxKeyDown,
            handleComboboxMouseDown: this.handleComboboxMouseDown,
            handleInvalid: this.handleInvalid,
            handleClearMouseDown: this.handleClearMouseDown,
            handleClearClick: this.handleClearClick,
            handleTagRemove: this.handleTagRemove,
            toggleOptionSelection: this.toggleOptionSelection,
            focusFunc: this.focusFunc,
            pill: this.pill,
            cssClasses,
            searchable: this.searchable,
            custom: this.custom,
            readonly: this.readonly,
            tooltip: this.tooltip,
            autocomplete: this.autocomplete,
            autofocus: this.autofocus,
            uncontrolled: this.uncontrolled,
            search: this.search,
            editable: this.editable,
            tagWrap: this.variant === "tag" && this.tagWrap,
            lines: this.variant === "tag" ? this.lines : undefined,
            tagLabels: this.tagLabels,
            i18n: Object.assign(Object.assign({}, this.defaultI18n), this.i18n),
            eventTrigger: this.eventTrigger,
            truncate: this.truncate,
            displayInput: this.displayInput,
        };
        this.syncExternalAnchor();
    }
    disconnectedCallback() {
        this.teardownExternalAnchor();
        this.truncateContent = "";
        this.clearPendingBlurCheck();
        // Clean up interactions
        interactions.delete(this.host);
        this.assumeInteractionOn.forEach((event) => {
            this.host.removeEventListener(event, this.handleInteraction);
        });
        this.eventTrigger = undefined;
    }
    getExternalAnchor() {
        if (!this.anchor) {
            return undefined;
        }
        if (typeof this.anchor === "string") {
            return document.querySelector(this.anchor);
        }
        if (this.anchor instanceof HTMLElement) {
            return this.anchor;
        }
        return undefined;
    }
    teardownExternalAnchor() {
        if (!this.selectAnchor) {
            return;
        }
        this.selectAnchor.removeEventListener("hbr-truncate", this.handleTruncate);
        this.selectAnchor = undefined;
        this.truncateContent = "";
    }
    syncExternalAnchor() {
        // Most instances don't use an external anchor — skip all work early
        if (!this.anchor) {
            if (this.selectAnchor) {
                this.teardownExternalAnchor();
            }
            return;
        }
        const externalAnchor = this.getExternalAnchor();
        if (this.selectAnchor && this.selectAnchor !== externalAnchor) {
            this.teardownExternalAnchor();
        }
        if (!externalAnchor) {
            if (this.truncateContent) {
                this.truncateContent = "";
            }
            return;
        }
        if (this.selectAnchor !== externalAnchor) {
            this.selectAnchor = externalAnchor;
            this.selectAnchor.addEventListener("hbr-truncate", this.handleTruncate);
        }
        Object.assign(externalAnchor, this.anchorProps);
    }
    getTooltipAnchor() {
        return this.displayInput || this.getExternalAnchor();
    }
    setUserInteracted(el, hasInteracted) {
        if (hasInteracted) {
            userInteractedControls.add(el);
        }
        else {
            userInteractedControls.delete(el);
        }
        /*** force to run again. */
        this.rerender = !this.rerender;
    }
    clearPendingBlurCheck() {
        if (this.blurTimeoutId) {
            window.clearTimeout(this.blurTimeoutId);
            this.blurTimeoutId = undefined;
        }
    }
    isFocusWithinSelect(activeElement) {
        if (!activeElement) {
            return false;
        }
        if (activeElement === this.host || this.host.contains(activeElement)) {
            return true;
        }
        const externalAnchor = this.getExternalAnchor();
        if (externalAnchor &&
            (activeElement === externalAnchor ||
                externalAnchor.contains(activeElement))) {
            return true;
        }
        return false;
    }
    addOpenListeners() {
        document.addEventListener("focusin", this.handleDocumentFocusIn);
        document.addEventListener("keydown", this.handleDocumentKeyDown);
        document.addEventListener("mousedown", this.handleDocumentMouseDown);
    }
    removeOpenListeners() {
        document.removeEventListener("focusin", this.handleDocumentFocusIn);
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        document.removeEventListener("mousedown", this.handleDocumentMouseDown);
    }
    handleFocus() {
        var _a, _b;
        this.clearPendingBlurCheck();
        this.hasFocus = true;
        if (!this.searchable) {
            if (((_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.tagName) === "INPUT") {
                //input only
                (_b = this.displayInput) === null || _b === void 0 ? void 0 : _b.setSelectionRange(0, 0); //sets the start and end positions of the current text selection
            }
        }
        this.hbrFocus.emit();
    }
    handleKeyUp(event) {
        var _a;
        if (this.searchable) {
            event.preventDefault();
            event.stopPropagation();
            /** KB focus */
            (_a = this.combobox) === null || _a === void 0 ? void 0 : _a.classList.add("keyboard--focused");
            const { key, target } = event;
            this.eventTrigger = event.key;
            if (this.editable) {
                if (key === "Escape" || key === "Esc") {
                    this.open = false;
                }
                return;
            }
            if (target === this.displayInput && (key === "Tab" || key === "Enter")) {
                this.editable = true;
            }
        }
    }
    handleBlur() {
        var _a;
        this.hasFocus = false;
        (_a = this.combobox) === null || _a === void 0 ? void 0 : _a.classList.remove("keyboard--focused");
        this.clearPendingBlurCheck();
        // Use a focusin listener to detect if focus returns to the select
        const onFocusIn = (event) => {
            if (this.isFocusWithinSelect(event.target)) {
                this.clearPendingBlurCheck();
            }
        };
        document.addEventListener("focusin", onFocusIn, { once: true });
        this.blurTimeoutId = window.setTimeout(() => {
            this.blurTimeoutId = undefined;
            document.removeEventListener("focusin", onFocusIn);
            if (this.isFocusWithinSelect(document.activeElement)) {
                return;
            }
            this.setUserInteracted(this.host, true);
            this.hbrBlur.emit();
        });
        if (this.editable && this.variant !== "tag") {
            //causing race condition issue on searchable tag
            setTimeout(() => {
                this.editable = false;
            }, 100);
        }
    }
    handleSearch(event) {
        if (this.searchable) {
            const { value } = event.target;
            this.hbrSearch.emit({ value });
        }
    }
    handleLabelClick() {
        var _a;
        (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus();
    }
    handleComboboxMouseDown(event) {
        var _a, _b, _c;
        const path = event.composedPath();
        const isIconButton = path.some((el) => { var _a; return ((_a = el.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "hbr-icon-button"; });
        // Ignore disabled controls and clicks on tags (remove buttons)
        if (this.disabled || this.readonly || isIconButton) {
            return;
        }
        // For autocomplete, when the click lands inside the input area (either the
        // editable search input or the readonly display input), preserve native
        // cursor placement and text selection by NOT calling preventDefault. The
        // listbox should only open when the input already has a value so we don't
        // obscure the field while the user is placing their cursor.
        const isAutocompleteInputClick = this.autocomplete &&
            ((!!this.searchInput && path.includes(this.searchInput)) ||
                (!!this.displayInput && path.includes(this.displayInput)));
        if (isAutocompleteInputClick) {
            this.eventTrigger = "mouse";
            const wasEditable = this.editable;
            if (this.uncontrolled) {
                this.editable = true;
            }
            // Only open the listbox if the user was already actively searching
            // (already in edit mode with typed text) AND there are options to show.
            // A fresh click that transitions from the display input to the search
            // input — e.g. after selecting an option — should not reopen the
            // listbox, and we should never open an empty listbox.
            if (wasEditable &&
                ((_a = this.searchInput) === null || _a === void 0 ? void 0 : _a.value) &&
                this.getAllOptions().length > 0) {
                this.open = true;
            }
            return;
        }
        event.preventDefault();
        (_b = this.displayInput) === null || _b === void 0 ? void 0 : _b.focus({ preventScroll: true });
        this.eventTrigger = "mouse"; //do not add focus style on mouse click
        if (this.hasDefaultSlot) {
            if (!this.multiType ||
                ((_c = event.currentTarget) === null || _c === void 0 ? void 0 : _c.classList.contains("select__combobox"))) {
                this.open = !this.open;
            }
            else {
                //make sure don't close on option click
                this.open = true;
            }
        }
        else {
            this.open = false;
        }
        if (this.uncontrolled) {
            this.editable = true;
        }
    }
    handleComboboxKeyDown(event) {
        event.stopPropagation();
        this.handleDocumentKeyDown(event);
    }
    handleClearClick(event) {
        var _a;
        event.stopPropagation();
        if (this.readonly) {
            return;
        }
        if (this.value !== "") {
            if (!this.uncontrolled) {
                this.setSelectedOptions([]);
                this.value = ""; // Reset the value, otherwise it will be set back on #753.
                (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                // Emit after update
                setTimeout(() => {
                    this.hbrClear.emit();
                    this.hbrInput.emit();
                    this.hbrChange.emit();
                });
            }
            else {
                setTimeout(() => {
                    this.hbrClear.emit();
                    this.displayLabel = "";
                    if (this.displayInput) {
                        this.displayInput.focus({ preventScroll: true });
                        this.displayInput.value = this.displayLabel;
                    }
                });
            }
        }
    }
    handleClearMouseDown(event) {
        // Don't lose focus or propagate events when clicking the clear button
        event.stopPropagation();
        event.preventDefault();
    }
    handleOptionClick(event) {
        var _a;
        if (this.readonly) {
            return;
        }
        const target = event.target;
        const option = target.closest("hbr-option");
        const oldValue = this.value;
        if (option) {
            if (!option.disabled) {
                if (((_a = option === null || option === void 0 ? void 0 : option.dataset) === null || _a === void 0 ? void 0 : _a.check) === "all") {
                    if (this.variant === "single" || this.disabled) {
                        return; /** only valid with multiple counter / tags. */
                    }
                    if (this.multiType) {
                        option.selected = !option.selected;
                    }
                    this.hbrChange.emit({
                        option,
                        selectAll: true,
                    });
                    return;
                }
                if (option.custom) {
                    this.editable = false;
                    if (!this.multiType) {
                        this.open = false;
                    }
                    return;
                }
                if (this.multiType) {
                    this.toggleOptionSelection(option);
                }
                else {
                    this.setSelectedOptions(option);
                }
                if (this.uncontrolled && this.editable) {
                    setTimeout(() => {
                        this.editable = false;
                    }, 100);
                }
                // Set focus after updating so the value is announced by screen readers
                setTimeout(() => { var _a; return (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true }); });
                if (this.uncontrolled || this.value !== oldValue) {
                    // Emit after updating
                    setTimeout(() => {
                        this.hbrInput.emit();
                        this.hbrChange.emit({ option });
                    });
                }
                if (!this.multiType) {
                    this.hide();
                    setTimeout(() => { var _a; return (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true }); });
                }
            }
        }
        else if (this.searchable) {
            /** should not close when click on the scroll bar */
            if (target.classList.contains("select__listbox")) {
                return;
            }
            /** adding new custom option ux as if existing option click */
            this.editable = false;
            if (!this.multiType) {
                this.open = false;
            }
        }
    }
    setSelectAll() {
        var _a;
        if (this.host.classList.contains("hbr-select-checkbox")) {
            return; /** already set */
        }
        if (this.disabled || this.variant === "single") {
            return; /** only valid with multiple counter / tags. */
        }
        const firstOption = this.getFirstOption();
        if (!firstOption) {
            return;
        }
        const checkbox = firstOption.querySelector("hbr-checkbox");
        if (!checkbox) {
            return;
        }
        this.host.classList.add("hbr-select-checkbox");
        if (this.host.classList.contains("hbr-select-all")) {
            return; /** already set */
        }
        const dataCheck = (_a = firstOption.dataset) === null || _a === void 0 ? void 0 : _a.check;
        if (!dataCheck || dataCheck !== "all") {
            return;
        }
        if (checkbox.querySelector("hbr-icon[slot]")) {
            return; /** no icon allowed */
        }
        this.selectAll = checkbox.indeterminate
            ? "indeterminate"
            : checkbox.checked;
        this.host.classList.add("hbr-select-all");
    }
    handleDefaultSlotChange() {
        var _a, _b, _c;
        this.hasDefaultSlot = hasDefaultSlot(this.host);
        if (!this.hasDefaultSlot) {
            this.open = false;
            return;
        }
        const allOptions = this.getAllOptions();
        if (this.uncontrolled) {
            if (this.editable && !this.open && ((_a = this.host.children) === null || _a === void 0 ? void 0 : _a.length)) {
                this.open = true;
            }
        }
        let value;
        if (this.multiType && ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) && !Array.isArray(this.value)) {
            //sanity check
            value = (_c = this.value) === null || _c === void 0 ? void 0 : _c.split(",");
        }
        else {
            value = Array.isArray(this.value) ? this.value : [this.value];
        }
        const values = [];
        // Check for duplicate values in menu items
        if (customElements.get("hbr-option")) {
            allOptions.forEach((option) => {
                if (this.truncate) {
                    option.truncate = true;
                }
                return values.push(option.value);
            });
            // Select only the options that match the new value
            if (this.multiType && this.editable) {
                allOptions.forEach((option) => {
                    option.selected = false;
                });
                return;
            }
            this.setSelectedOptions(allOptions.filter((el) => value.includes(el.value)));
        }
        else {
            // Rerun this handler when <hbr-option> is registered
            customElements
                .whenDefined("hbr-option")
                .then(() => this.handleDefaultSlotChange());
        }
        /** Select all */
        this.setSelectAll();
    }
    handleTagRemove(option, event) {
        event.stopPropagation();
        if (!this.disabled && !this.readonly) {
            this.toggleOptionSelection(option, false);
            // Emit after updating
            setTimeout(() => {
                var _a;
                this.hbrInput.emit();
                this.hbrChange.emit({ option });
                (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus();
            });
        }
    }
    handlePopupHide(event) {
        // for external anchor use case.
        // https://github.com/cisco-harbor/elements/issues/1170
        var _a;
        event.stopPropagation();
        if (this.open) {
            this.open = false;
            if (((_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.type) === "escape") {
                if (this.uncontrolled) {
                    //make sure to focus the input on escape key pressed if searchable or autocomplete
                    setTimeout(() => { var _a; return (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus(); }, 100);
                }
            }
        }
    }
    handlePopupKeydown(event) {
        var _a;
        const { key } = event;
        if (key === "Escape" || key === "Esc") {
            event.preventDefault();
            event.stopPropagation();
            (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
        }
    }
    // Gets an array of all <hbr-option> elements
    getAllOptions() {
        return [...this.host.querySelectorAll("hbr-option")];
    }
    // Gets the first <hbr-option> element
    getFirstOption() {
        return this.host.querySelector("hbr-option");
    }
    // Sets the current option, which is the option the user is currently interacting with (e.g. via keyboard). Only one
    // option may be "current" at a time.
    setCurrentOption(option) {
        const allOptions = this.getAllOptions();
        // Clear selection
        allOptions.forEach((el) => {
            el.current = false;
            el.tabIndex = -1;
        });
        // Select the target option
        if (option) {
            this.currentOption = option;
            option.current = true;
            option.tabIndex = option.disabled ? -1 : 0;
            // focus style should be only with keyboard event
            if (this.eventTrigger !== "mouse" && !option.disabled) {
                option.focus();
            }
        }
    }
    // Sets the selected option(s)
    setSelectedOptions(option) {
        const allOptions = this.getAllOptions();
        const newSelectedOptions = Array.isArray(option) ? option : [option];
        // Clear existing selection
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        allOptions.forEach((el) => (el.selected = false));
        // Set the new selection
        if (newSelectedOptions.length) {
            newSelectedOptions.forEach((el) => {
                el.selected = true;
            });
        }
        if (this.uncontrolled) {
            // React app renders twice and on the second render it picks up this.displayLabel
            // however angular app doesn't render twice so we need to set the displayLabel to ensure it displays as expected
            if (this.variant === "single" && this.value && !this.displayLabel) {
                const allOptions = this.getAllOptions();
                if (allOptions.length) {
                    const selected = allOptions.find((el) => el.value === this.value);
                    if (selected) {
                        this.displayLabel = selected.textContent;
                    }
                }
            }
            return;
        }
        // Update selection, value, and display label
        this.selectionChanged(option);
    }
    // Toggles an option's selected state
    toggleOptionSelection(option, force) {
        if (force === true || force === false) {
            option.selected = force;
        }
        else {
            option.selected = !option.selected;
        }
        if (this.uncontrolled) {
            return;
        }
        this.selectionChanged(option);
    }
    // This method must be called whenever the selection changes. It will update the selected options cache, the current
    // value, and the display value
    async selectionChanged(option) {
        var _a, _b, _c, _d, _e, _f;
        if (this.uncontrolled && option && option.custom) {
            // add this custom option ot the value list?
            return;
        }
        // Update selected options cache
        const allOptions = this.getAllOptions();
        this.selectedOptions = allOptions.filter((el) => el.selected);
        // Update the value and display label
        if (this.multiType) {
            // const CustomOptionSelected = option?.custom;
            const selectedOptionsArray = this.selectedOptions.map((el) => el.value);
            /** if data changes dynamically like reset to empty, we need to clear off the displayLabel. */
            const clearOffLabel = this.displayLabel !== "" && ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) === 0;
            if (JSON.stringify(this.value) === JSON.stringify(selectedOptionsArray)) {
                if (clearOffLabel) {
                    this.displayLabel = "";
                }
                return;
            }
            if (this.editable) {
                if (clearOffLabel) {
                    this.displayLabel = "";
                }
                return;
            }
            this.value = selectedOptionsArray;
            if (this.placeholder && ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                // When no items are selected, keep the value empty so the placeholder shows
                this.displayLabel = "";
            }
            else {
                if (!this.placeholder && ((_c = this.value) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                    /** Ensure that an empty input label is displayed when neither a value nor a placeholder is set." */
                    this.displayLabel = "";
                }
                else {
                    this.displayLabel = `${this.selectedOptions.length} ${((_d = this.value) === null || _d === void 0 ? void 0 : _d.length) === 1 ? "option" : "options"} selected`;
                }
            }
            /** To-Do for custom prop */
            // if (CustomOptionSelected && this.value.length) {
            // 	this.hbrChange.emit({
            // 		option: [...this.value, ...selectedOptionsArray],
            // 	});
            // 	this.displayLabel = "";
            // 	if (this.displayInput) {
            // 		this.displayInput.value = this.displayLabel;
            // 	}
            // } else {
            // 	const { length } = allOptions;
            // 	const customOption = this.multiType && length === 1;
            // 	const optionFromSearchResult =
            // 		1 < length && allOptions[length - 1].custom;
            // 	// selected options are not in the slot since slot changed based on the search
            // 	if (customOption || optionFromSearchResult) {
            // 		this.displayLabel = "";
            // 		if (this.displayInput) {
            // 			this.displayInput.value = this.displayLabel;
            // 		}
            // 	}
            // 	this.hbrChange.emit({
            // 		option: optionFromSearchResult
            // 			? [...this.value, ...selectedOptionsArray]
            // 			: selectedOptionsArray,
            // 	});
            // }
        }
        else {
            /**
       * When a value is set with empty options, the value gets reset to and empty string.
       This behavior is causing an issue on Angular application side which options are loaded, the value is preserved as empty string
       instead of previous set.
       */
            const selectedOption = this.selectedOptions[0];
            this.value = (_e = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.value) !== null && _e !== void 0 ? _e : this.value;
            if (this.searchable) {
                //uncontrolled
                return;
            }
            if (this.autocomplete && this.value && !selectedOption) {
                this.displayLabel = Array.isArray(this.value)
                    ? this.value[0]
                    : this.value; // Assign the first value of this.value
            }
            else {
                const textContent = this.getTextContent(selectedOption);
                /** Make sure to honor the 'display' value first if exists */
                this.displayLabel = (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.display)
                    ? selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.display
                    : (_f = (textContent || (await (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.getTextLabel())))) !== null && _f !== void 0 ? _f : "";
            }
        }
        // Update validity
        setTimeout(() => {
            updateValidity(this.host);
        });
    }
    getTextContent(element) {
        if (!element) {
            return "";
        }
        return Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => { var _a, _b; return (_b = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""; })
            .join(" ")
            .trim();
    }
    handleInvalid(event) {
        setValidity(false, this.host, userInteractedControls);
        emitInvalidEvent(event);
    }
    /** Sets focus on the button or input if searchable is on. */
    async setFocus(options) {
        var _a, _b;
        if (this.searchable && !this.readonly) {
            this.editable = true;
            (_a = this.searchInput) === null || _a === void 0 ? void 0 : _a.focus(options);
        }
        else {
            (_b = this.displayInput) === null || _b === void 0 ? void 0 : _b.focus(options);
        }
    }
    handleDisabledChange() {
        // Close the listbox when the control is disabled
        if (this.disabled) {
            this.open = false;
            this.handleOpenChange();
        }
    }
    handleReadonlyChange() {
        if (this.readonly) {
            this.open = false;
            this.editable = false;
        }
    }
    async handleValueChange() {
        var _a, _b;
        const allOptions = this.getAllOptions();
        const value = Array.isArray(this.value) ? this.value : [this.value];
        if (this.uncontrolled || this.searchable) {
            const selectedOptions = [];
            allOptions.forEach((option) => {
                const match = value.includes(option.value);
                if (match) {
                    option.selected = match;
                    selectedOptions.push(option);
                }
                else {
                    option.selected = false;
                }
            });
            this.selectedOptions = selectedOptions;
            this.tagLabels = [];
            if (this.multiType && this.variant === "tag") {
                this.selectedOptions.forEach((option) => {
                    /** Make sure to honor the 'display' value first if exists */
                    if (option.display) {
                        this.tagLabels.push(option.display);
                    }
                    else if (option.textContent) {
                        this.tagLabels.push(option.textContent);
                    }
                    else if (option.querySelector("hbr-highlight")) {
                        this.tagLabels.push(option.querySelector("hbr-highlight").text);
                    }
                });
            }
            /** need to clear off after adding a new option */
            if (this.variant === "tag" && this.tagLabels.length) {
                this.displayLabel = "";
                if (this.displayInput) {
                    /** make sure to clear off the input value */
                    this.displayInput.value = "";
                }
            }
            const selectedOption = this.selectedOptions[0];
            /** Make sure to honor the 'display' value first if exists */
            if (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.display) {
                this.displayLabel = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.display;
            }
            else {
                const highlight = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.querySelector("hbr-highlight");
                if (highlight) {
                    this.displayLabel = highlight.text;
                }
                else {
                    const textContent = this.getTextContent(selectedOption);
                    this.displayLabel =
                        (_a = (textContent || (await (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.getTextLabel())))) !== null && _a !== void 0 ? _a : "";
                }
            }
            if (!this.displayLabel && this.autocomplete && this.value) {
                this.displayLabel = this.value;
            }
            return;
        }
        // Select only the options that match the new value
        this.setSelectedOptions(allOptions
            .filter((ele) => !ele.hasAttribute("data-check"))
            .filter((el) => value.includes(el.value)));
        const formValue = Array.isArray(this.value)
            ? this.value.join(",")
            : this.value || null;
        (_b = this.internals) === null || _b === void 0 ? void 0 : _b.setFormValue(formValue);
    }
    handleVariantChange() {
        this.multiType = this.variant === "multiple" || this.variant === "tag";
    }
    async handleOpenChange() {
        if (this.open && this.readonly) {
            this.open = false;
            return;
        }
        if (this.open && !this.disabled) {
            // Reset the current option
            if (!this.searchable) {
                this.setCurrentOption(this.selectedOptions[0] || this.getFirstOption());
            }
            // Show
            this.hbrShow.emit();
            this.addOpenListeners();
            await stopAnimations(this.host);
            if (this.popupEl)
                this.popupEl.active = true;
            // Select the appropriate option based on value after the listbox opens
            requestAnimationFrame(() => {
                if (!this.currentOption) {
                    //to prevent focus moving to the list box from input
                    this.setCurrentOption(this.currentOption);
                    /** Reset the trigger flag */
                    this.eventTrigger = undefined;
                }
            });
            // const { keyframes, options } = getAnimation(this, "select.show", { dir: this.localize.dir() });
            // const { keyframes, options } = getAnimation(this.host, "select.show", {dir: ""});
            // await animateTo(this.popupEl.popup, keyframes, options);
            // Make sure the current option is scrolled into view (required for Safari)
            if (this.currentOption) {
                setTimeout(() => {
                    // selected option should be visible on DOM when this get executed
                    scrollIntoView(this.currentOption, this.listbox, "vertical", "auto");
                    if (this.eventTrigger && this.eventTrigger !== "mouse") {
                        this.currentOption.focus({ preventScroll: true });
                    }
                });
            }
            this.hbrAfterShow.emit();
        }
        else {
            /** remove "hide" class on the help slot:
             * we are putting form control inside of the anchor which creates an issue to push the listbox down when help slot is in display */
            const anchorEl = this.selectAnchor || this.anchorEl;
            const helpText = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.shadowRoot.querySelector(".form-control__help-text");
            helpText === null || helpText === void 0 ? void 0 : helpText.classList.remove("select__hide-helpText");
            const rear = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.shadowRoot.querySelector(".form-control__rear");
            rear === null || rear === void 0 ? void 0 : rear.classList.remove("select__hide-rear");
            // Hide
            this.hbrHide.emit();
            this.removeOpenListeners();
            await stopAnimations(this.host);
            // const { keyframes, options } = getAnimation(this.host, "select.hide", { dir: "" });//this.localize.dir()
            // await animateTo(this.popupEl.popup, keyframes, options);
            if (this.listbox)
                this.listbox.hidden = true;
            if (this.popupEl)
                this.popupEl.active = false;
            this.hbrAfterHide.emit();
        }
    }
    handleEditableChange() {
        if (this.editable && !this.readonly) {
            setTimeout(() => { var _a; return (_a = this.searchInput) === null || _a === void 0 ? void 0 : _a.focus(); });
        }
    }
    handleOptionClickEvent(event) {
        var _a, _b;
        if (this.disabled || this.readonly) {
            return;
        }
        if (this.searchable && this.variant === "tag") {
            const mouseEvent = (_b = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.event) !== null && _b !== void 0 ? _b : event;
            this.handleOptionClick(mouseEvent);
        }
    }
    /** Shows the listbox. */
    async show() {
        if (this.open || this.disabled || this.readonly) {
            this.open = false;
            return undefined;
        }
        if (this.hasDefaultSlot) {
            this.open = true;
            return waitForEvent(this.host, "hbr-after-show");
        }
    }
    /** Hides the listbox. */
    async hide() {
        if (!this.open || this.disabled) {
            this.open = false;
            return undefined;
        }
        this.open = false;
        if (this.editable) {
            this.editable = false;
            /** we need to clear off the options resulted from the search */
            if (this.searchable && !this.autocomplete) {
                this.hbrSearch.emit({ value: "" });
            }
        }
        return waitForEvent(this.host, "hbr-after-hide");
    }
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        var _a;
        return (_a = this.valueInput) === null || _a === void 0 ? void 0 : _a.checkValidity();
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        var _a;
        return (_a = this.valueInput) === null || _a === void 0 ? void 0 : _a.reportValidity();
    }
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message) {
        var _a;
        (_a = this.valueInput) === null || _a === void 0 ? void 0 : _a.setCustomValidity(message);
        updateValidity(this.host);
    }
    /** Sets focus on the control. */
    focusFunc(options) {
        var _a;
        (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the control. */
    blur() {
        var _a;
        (_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.blur();
    }
    setDisplayInputRef(ref) {
        this.displayInput = ref;
    }
    setSearchInputRef(ref) {
        this.searchInput = ref;
    }
    setComboboxRef(ref) {
        this.combobox = ref;
    }
    setValueInputRef(ref) {
        this.valueInput = ref;
    }
    render() {
        var _a;
        return (h(Fragment, { key: '66b83b6053d0fab5370bdaef967af4c28c4d9e14' }, h("hbr-popup", Object.assign({ key: '791a6e31067dc1c96fd175a5c6f3cb44d4226341', ref: (el) => {
                this.popupEl = el;
            }, strategy: this.enablePopover || this.hoist || this.sync === "none"
                ? "fixed"
                : "absolute", sync: this.sync === "none" ? undefined : this.sync, placement: this.placement || "bottom", distance: 4, flip: true, shift: true, enablePopover: this.enablePopover, skidding: this.skidding, "auto-size": "vertical", "auto-size-padding": "120", "data-component": "hbr-select", "data-external-anchor": this.anchor }, (this.anchor
            ? {
                anchor: this.anchor,
                composed: true,
            }
            : {}), { "onHbr-popup-hide": this.handlePopupHide, onKeyDown: this.handlePopupKeydown }), !this.anchor ? (h("hbr-select-anchor", Object.assign({}, this.anchorProps, { slot: "anchor", ref: (el) => {
                this.anchorEl = el;
            }, part: "select-anchor", exportparts: `
							form-control,
							label-container,
							label,
							asterisk,
							element,
							help-text,
							combobox,
							combobox_tags,
							prefix,
							display-input,
							clear-button,
							expand-icon,
							counter,
							tags,
							tag__base,
							tag__prefix,
							tag__content,
							tag__remove-button,
							tag__remove-button__base
						`, "onHbr-truncate": this.handleTruncate }), this.variant === "tag" && this.custom && ((_a = this.value) === null || _a === void 0 ? void 0 : _a.length) ? (h("slot", { name: "tags", slot: "tags" })) : (""), h("slot", { name: "label", slot: "label" }, this.label), h("slot", { name: "label-suffix", slot: "label-suffix" }), h("slot", { name: "label-info", slot: "label-info" }), h("slot", { name: "prefix", slot: "prefix" }), h("slot", { name: "tags", slot: "tags" }), h("slot", { name: "counter", slot: "counter" }), h("slot", { name: "counter-label", slot: "counter-label" }), this.hasClearIconSlot ? (h("slot", { name: "clear-icon", slot: "clear-icon" })) : (""), this.hasExpandIconSlot ? (h("slot", { name: "expand-icon", slot: "expand-icon" })) : (""), h("slot", { name: "front", slot: "front" }), h("slot", { name: "rear", slot: "rear" }), h("slot", { name: "help-text", slot: "help-text" }, this.helpText))) : null, h("div", { key: '3ec6c6e8b8f5a42e46fda28e59497226a24ae09f', id: this.listboxId, role: "listbox", "aria-expanded": this.open ? "true" : "false", "aria-multiselectable": this.variant === "multiple" || this.variant === "tag"
                ? "true"
                : "false", "aria-label": this.arialabel || this.label, part: "listbox", class: `select__listbox${this.truncate ? " select__truncate" : ""}`, tabindex: "-1", onMouseUp: !(this.searchable && this.variant === "tag")
                ? this.handleOptionClick
                : null, ref: (el) => {
                this.listbox = el;
            } }, h("slot", { key: '0eb9f67a86804b8e67436c06029df9de951796a5', onSlotchange: this.handleDefaultSlotChange }))), this.truncateContent ? (h("hbr-tooltip", { content: this.truncateContent, anchor: this.getTooltipAnchor(), class: "select--anchor-tooltip" })) : null));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledChange"],
        "readonly": ["handleReadonlyChange"],
        "value": ["handleValueChange"],
        "variant": ["handleVariantChange"],
        "open": ["handleOpenChange"],
        "editable": ["handleEditableChange"]
    }; }
    static get style() { return HbrSelectStyle0; }
}, [65, "hbr-select", {
        "name": [1],
        "value": [1025],
        "variant": [513],
        "size": [513],
        "placeholder": [1],
        "multiple": [516],
        "disabled": [516],
        "clearable": [516],
        "open": [1540],
        "hoist": [516],
        "enablePopover": [4, "enable-popover"],
        "filled": [516],
        "pill": [516],
        "label": [8],
        "arialabel": [8],
        "truncate": [4],
        "sync": [1],
        "placement": [1537],
        "skidding": [2],
        "helpText": [1, "help-text"],
        "required": [516],
        "error": [516],
        "anchor": [1],
        "searchable": [1540],
        "search": [1025],
        "custom": [4],
        "readonly": [516],
        "autocomplete": [516],
        "uncontrolled": [1540],
        "tooltip": [513],
        "autofocus": [4],
        "tagWrap": [4, "tag-wrap"],
        "lines": [514],
        "i18n": [16],
        "hasFocus": [32],
        "displayLabel": [32],
        "currentOption": [32],
        "selectedOptions": [32],
        "rerender": [32],
        "truncateContent": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "hasHelpTextSlot": [32],
        "hasClearIconSlot": [32],
        "hasExpandIconSlot": [32],
        "hasTagsSlot": [32],
        "hasDefaultSlot": [32],
        "editable": [32],
        "setFocus": [64]
    }, [[0, "hbr-option-click", "handleOptionClickEvent"]], {
        "disabled": ["handleDisabledChange"],
        "readonly": ["handleReadonlyChange"],
        "value": ["handleValueChange"],
        "variant": ["handleVariantChange"],
        "open": ["handleOpenChange"],
        "editable": ["handleEditableChange"]
    }]);
setDefaultAnimation("select.show", {
    keyframes: [
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 100, easing: "ease" },
});
setDefaultAnimation("select.hide", {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 },
    ],
    options: { duration: 100, easing: "ease" },
});
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-select", "hbr-icon", "hbr-icon-button", "hbr-popup", "hbr-select-anchor", "hbr-tag", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-select":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Select);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-select-anchor":
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

export { Select as S, defineCustomElement as d };

