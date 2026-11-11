import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { F as FormControl } from './form-control.js';
import { g as generateShortID } from './function-helper.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const sliderCss = ":host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--thumb-size-hover:20px;--margin-bottom:0px;text-align:start;--hbr-tooltip-line-height:var(--hbr-font-line-height-dense);--hbr-slider-tooltip-background-color:var(--inverse-bg-weak-default);--hbr-tooltip-color:var(--base-text-in-weak-default);--hbr-tooltip-arrow-background-color:var(--inverse-bg-weak-default);--hbr-slider-thumb-active-color:var(--hbr-slider-background-color);--slider-range-unselected-color:var(--control-border-weak-default);--slider-range-selected-color:var(--control-border-medium-active);--slider-ticks-active-color:var(--control-icon-in-medium-default);--slider-ticks-inactive-color:var(--control-icon-in-medium-active);--slider-track-border:none;--slider-track-hit-area-height:var(--slider-track-height);--slider-tick-offset-y:1px;--slider-range-unselected-color-disabled:var(--control-border-weak-default);--slider-range-selected-color-disabled:var(--control-border-medium-disabled);--margin-top:0px;--hbr-slider-background-color:var(--control-bg-weak-default);--hbr-slider-thumb-border:2px solid var(--control-border-strong-default);--hbr-slider-thumb-border-focus:2px solid var(--control-border-strong-hover);--thumb-size:24px;--thumb-margin-top:-9px;--hbr-slider-thumb-transition-scale:none;--slider-track-height:8px;--slider-tick-size:4px;--hbr-slider-thumb-border-active:2px solid var(--base-text-medium-default);--hbr-slider-thumb-outline-active:2px solid var(--control-border-active);--hbr-tooltip-arrow-size:8px;--tooltip-offset-y:12px;--slider-pip-label-top:34px;--margin-bottom:calc(var(--slider-pip-label-top) / 2)}:host([disabled]){--slider-ticks-active-color:var(--control-icon-in-disabled);--slider-ticks-inactive-color:var(--control-icon-in-disabled);--hbr-slider-background-color:var(--control-bg-weak-disabled);--hbr-slider-thumb-border:2px solid var(--control-border-strong-disabled)}:host([readonly]){--slider-range-unselected-color:var(--base-bg-weak-default);--slider-range-selected-color:var(--control-border-default);--slider-track-border:2px solid var(--base-border-medium-default);--hbr-slider-background-color:var(--control-bg-weak-default);--hbr-slider-thumb-border:2px solid var(--control-border-default);--slider-ticks-inactive-color:var(--control-icon-in-default);--slider-ticks-active-color:var(--control-icon-in-medium-default)}:host([readonly]:not([disabled])){--hbr-slider-background-color:var(--control-bg-weak-default);--hbr-slider-thumb-border:2px solid var(--control-border-default)}.wrapper{position:relative;width:var(--wrapper-width, 98%)}.wrapper .range{position:relative;width:100%;height:30px;margin-top:var(--margin-top);margin-bottom:var(--margin-bottom)}.wrapper .range:focus{outline:none}.wrapper .range:disabled{opacity:0.5}.wrapper .range:disabled::-webkit-slider-thumb{cursor:not-allowed}.wrapper .range:disabled::-moz-range-thumb{cursor:not-allowed}.wrapper .range .range--slider-track{width:99%;height:var(--slider-track-height);position:absolute;margin:12px auto;top:0;bottom:0;border:var(--slider-track-border);border-radius:var(--hbr-border-radius-sm, 4px);box-sizing:border-box}.wrapper .range input[type=range]{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:100%;outline:none;position:absolute;margin:auto;top:0;bottom:0;background-color:transparent;pointer-events:none}.wrapper .range input[type=range]::-webkit-slider-runnable-track{-webkit-appearance:none;height:5px}.wrapper .range input[type=range]::-moz-range-track{-moz-appearance:none;height:5px}.wrapper .range input[type=range]::-ms-track{appearance:none;height:5px}.wrapper .range input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:var(--thumb-size);width:var(--thumb-size);background-color:var(--hbr-slider-background-color);cursor:pointer;margin-top:var(--thumb-margin-top);pointer-events:auto;border-radius:50%;border:var(--hbr-slider-thumb-border);transition-property:all;transition-duration:var(--hbr-transition-fast);transition-timing-function:ease}.wrapper .range input[type=range]::-webkit-slider-thumb:disabled{cursor:not-allowed}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):hover::-webkit-slider-thumb{transform:var(--hbr-slider-thumb-transition-scale);border-color:var(--control-border-strong-hover)}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):active::-webkit-slider-thumb{background-color:var(--hbr-slider-thumb-active-color);border:var(--hbr-slider-thumb-border-active);outline:var(--hbr-slider-thumb-outline-active)}.wrapper .range.range--focused-start .range__input--start::-webkit-slider-thumb,.wrapper .range.range--focused-end .range__input--end::-webkit-slider-thumb{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.wrapper .range:not(.range--readonly).range--focused-start .range__input--start::-webkit-slider-thumb,.wrapper .range:not(.range--readonly).range--focused-end .range__input--end::-webkit-slider-thumb{border:var(--hbr-slider-thumb-border-focus, var(--hbr-slider-thumb-border))}.wrapper .range.range--focused-start .range__input--start::-moz-range-thumb,.wrapper .range.range--focused-end .range__input--end::-moz-range-thumb{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.wrapper .range:not(.range--readonly).range--focused-start .range__input--start::-moz-range-thumb,.wrapper .range:not(.range--readonly).range--focused-end .range__input--end::-moz-range-thumb{border:var(--hbr-slider-thumb-border-focus, var(--hbr-slider-thumb-border))}.wrapper .range.range--focused-start .range__input--start::-ms-thumb,.wrapper .range.range--focused-end .range__input--end::-ms-thumb{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.wrapper .range:not(.range--readonly).range--focused-start .range__input--start::-ms-thumb,.wrapper .range:not(.range--readonly).range--focused-end .range__input--end::-ms-thumb{border:var(--hbr-slider-thumb-border-focus, var(--hbr-slider-thumb-border))}.wrapper .range input[type=range][disabled]::-webkit-slider-thumb{cursor:not-allowed}.wrapper .range input[type=range]::-moz-range-thumb{-webkit-appearance:none;height:var(--thumb-size);width:var(--thumb-size);background-color:var(--hbr-slider-background-color);cursor:pointer;margin-top:var(--thumb-margin-top);pointer-events:auto;border-radius:50%;border:var(--hbr-slider-thumb-border);transition-property:all;transition-duration:var(--hbr-transition-fast);transition-timing-function:ease}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):hover::-moz-range-thumb{transform:var(--hbr-slider-thumb-transition-scale)}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):active::-moz-range-thumb{background-color:var(--hbr-slider-thumb-active-color);border:var(--hbr-slider-thumb-border-active);outline:var(--hbr-slider-thumb-outline-active)}.wrapper .range input[type=range][disabled]::-moz-range-thumb{cursor:not-allowed}.wrapper .range input[type=range]::-ms-thumb{appearance:none;height:var(--thumb-size);width:var(--thumb-size);background-color:var(--hbr-slider-background-color);cursor:pointer;margin-top:var(--thumb-margin-top);pointer-events:auto;border-radius:50%;border:var(--hbr-slider-thumb-border);transition-property:all;transition-duration:var(--hbr-transition-fast);transition-timing-function:ease}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):hover::-ms-thumb{transform:var(--hbr-slider-thumb-transition-scale)}.wrapper .range:not(.range--readonly) input[type=range]:not(:disabled):active::-ms-thumb{background-color:var(--hbr-slider-thumb-active-color);border:var(--hbr-slider-thumb-border-active);outline:var(--hbr-slider-thumb-outline-active)}.wrapper .range input[type=range][disabled]::-ms-thumb{cursor:not-allowed}.wrapper .range.range--readonly:not(.range--disabled) input[type=range]{cursor:default}.wrapper .range.range--readonly:not(.range--disabled) input[type=range]::-webkit-slider-thumb{cursor:default}.wrapper .range.range--readonly:not(.range--disabled) input[type=range]::-moz-range-thumb{cursor:default}.wrapper .range.range--readonly:not(.range--disabled) input[type=range]::-ms-thumb{cursor:default}.wrapper .range__tooltip{position:absolute;z-index:var(--hbr-z-index-tooltip);left:1px;border-radius:4px;background-color:var(--hbr-slider-tooltip-background-color);line-height:18px;color:var(--hbr-tooltip-color);opacity:0;transition:var(--hbr-transition-fast) opacity;pointer-events:none;font-weight:var(--hbr-font-weight-normal, 400);font-size:var(--hbr-font-size-xs, 12px);text-align:center;padding:4px 8px}.wrapper .range__tooltip::after{content:\"\";position:absolute;width:0;height:0;left:50%;margin-left:calc(-1 * var(--hbr-tooltip-arrow-size))}.wrapper .range__tooltip--visible{opacity:1}.wrapper .range--tooltip-top .range__tooltip{top:calc(-1 * var(--thumb-size) - var(--tooltip-offset-y));}.wrapper .range--tooltip-top .range__tooltip::after{border-top:var(--hbr-tooltip-arrow-size) solid var(--hbr-tooltip-arrow-background-color);border-left:var(--hbr-tooltip-arrow-size) solid transparent;border-right:var(--hbr-tooltip-arrow-size) solid transparent;top:100%}.wrapper .range--tooltip-bottom .range__tooltip{bottom:calc(-1 * var(--thumb-size) - var(--tooltip-offset-y));}.wrapper .range--tooltip-bottom .range__tooltip::after{border-bottom:var(--hbr-tooltip-arrow-size) solid var(--hbr-tooltip-background-color);border-left:var(--hbr-tooltip-arrow-size) solid transparent;border-right:var(--hbr-tooltip-arrow-size) solid transparent;bottom:100%}.wrapper .range__tick-marks{width:99%;position:absolute;margin:auto;top:0px;bottom:0;align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px}.wrapper .range__tick-mark--double:not(.range__hidden-tick){pointer-events:none}.wrapper .range__tick-mark,.wrapper .range__tick-mark--double.range__hidden-tick{cursor:pointer}.wrapper .range--disabled .range__tick-mark,.wrapper .range--disabled .range__tick-mark--double.range__hidden-tick{cursor:not-allowed}.wrapper .range--readonly:not(.range--disabled) .range__tick-mark,.wrapper .range--readonly:not(.range--disabled) .range__tick-mark--double.range__hidden-tick{cursor:default}.wrapper .range__tick-mark--active:not(.range__hidden-tick)::before{background-color:var(--slider-ticks-active-color)}.wrapper .range__tick-mark--active,.wrapper .range__tick-mark--inactive{border-radius:50%;height:var(--slider-track-hit-area-height);transform:translateY(var(--slider-tick-offset-y));width:var(--slider-tick-size)}.wrapper .range__tick-mark--active:not(.range__hidden-tick)::before,.wrapper .range__tick-mark--inactive:not(.range__hidden-tick)::before{border-radius:50%;content:\"\";height:var(--slider-tick-size);left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);width:var(--slider-tick-size)}.wrapper .range__hidden-tick{border-radius:0;height:var(--slider-track-hit-area-height)}.wrapper .range__tick-mark--inactive:not(.range__hidden-tick)::before{background-color:var(--slider-ticks-inactive-color)}.wrapper .range__pip-label-container{font-weight:var(--hbr-font-weight-normal, 400);font-size:var(--hbr-font-size-xs, 12px);line-height:18px;color:var(--base-text-medium-default)}.wrapper .range__pip-label{position:absolute;margin:auto;bottom:0;top:var(--slider-pip-label-top, 24px);bottom:0;left:-10px}.wrapper .range__hidden-ticks{background-color:transparent}:not(.range--disabled):not(.range--readonly) .range__input.range__input--start:hover::-webkit-slider-thumb,:not(.range--disabled):not(.range--readonly) .range__input.range__input--end:hover::-webkit-slider-thumb{border:2px solid var(--control-border-strong-hover)}.form-control__help-text{padding-top:4px}.form-control--has-label .form-control__label{margin-bottom:var(--hbr-spacing-xs, 8px)}";
const HbrSliderStyle0 = sliderCss;

const id = 0;
const minGap = 0;
const thumbSize = "20px";
const HbrSlider$1 = /*@__PURE__*/ proxyCustomElement(class HbrSlider extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrInput = createEvent(this, "hbr-input", 7);
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.labelId = `slider-label-${id}`;
        this.activeFocusTarget = null;
        this.activeHoverTarget = null;
        this.hasContent = false;
        this.arrayXTransform = [];
        this.uuid = generateShortID();
        this.hasLabelSlot = false;
        this.hasLabelInfoSlot = false;
        this.hasHelpTextSlot = false;
        this.hasHelpText = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.name = "";
        this.value = undefined;
        this.disabled = false;
        this.readonly = false;
        this.required = false;
        this.double = false;
        this.min = 0;
        this.max = 100;
        this.start = this.min;
        this.end = this.max;
        this.step = 1;
        this.discrete = false;
        this.tooltip = "top";
        this.values = [this.min, this.max];
        this.aria = undefined;
        this.uneven = undefined;
        this.tooltipFormatter = (value) => typeof value === "number" ? value.toString() : value;
        this.label = "";
        this.helpText = "";
        this.helpTextId = `slider-help-text-${id}`;
        this.valueStart = undefined;
        this.valueEnd = undefined;
    }
    connectedCallback() {
        this._onInputStart = this._onInputStart.bind(this);
        this._onInputEnd = this._onInputEnd.bind(this);
        this._onChange = this._onChange.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTickMarkClick = this.handleTickMarkClick.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.discretePoints();
        this.handleSlotChange();
        if (this.value) {
            if (this.double) {
                if (!Array.isArray(this.value)) {
                    return;
                }
                this.start = this.value[0];
                this.end = this.value[1];
            }
            else {
                this.start = this.value;
            }
        }
        /** https://github.com/cisco-harbor/elements/issues/596 */
        if (this.valueStart === undefined) {
            this.valueStart = this.start || 0;
        }
        if (this.valueEnd === undefined) {
            this.valueEnd = this.end || 0;
        }
    }
    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.inputstart);
            if (this.double)
                this.resizeObserver.unobserve(this.inputend);
            this.resizeObserver.unobserve(this[`sliderTrack${this.uuid}`]);
        }
        //Commenting for now. It might be added later.
        //this.resizeObserver.unobserve(this[`pipLabel$1${this.uuid}`]);
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    handleMinChange() {
        this.values[0] = this.min;
    }
    handleMaxChange() {
        this.values[1] = this.max;
    }
    handleStartChange() {
        this.valueStart = this.start < this.min ? this.min : this.start;
    }
    handleEndChange() {
        this.valueEnd = this.end > this.max ? this.max : this.end;
    }
    handleValueChange() {
        if (this.value) {
            if (this.double) {
                if (!Array.isArray(this.value)) {
                    return;
                }
                this.start = this.value[0];
                this.end = this.value[1];
            }
            else {
                this.start = this.value;
            }
        }
    }
    handleDisabledChange() {
        if (this.disabled) {
            this.activeFocusTarget = null;
            this.activeHoverTarget = null;
        }
    }
    componentDidLoad() {
        this.resizeObserver = new ResizeObserver((entries) => this.onResizeCallback(entries));
        setTimeout(() => {
            this.resizeObserver.observe(this[`sliderTrack${this.uuid}`]);
        });
    }
    componentDidRender() {
        this.sliderMaxValue = this.inputstart.max;
        this.fillColor();
        setTimeout(() => {
            this.syncLabels();
            this.syncTickStyle();
            this.syncTooltipStart();
            if (this.double)
                this.syncTooltipEnd();
        });
    }
    onResizeCallback(entries) {
        for (const entry of entries) {
            if (entry.target.className === "range--slider-track") {
                this.syncLabels();
            }
            else if (entry.target.id === "slider-1") {
                this.syncTooltipStart();
            }
            else if (entry.target.id === "slider-2") {
                this.syncTooltipEnd();
            }
        }
    }
    /** Sets focus on the input. */
    async setFocus(options) {
        if (this.disabled) {
            return;
        }
        this.inputstart.focus(options);
    }
    /** Removes focus from the input. */
    async removeFocus() {
        this.inputstart.blur();
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        return this.input.reportValidity();
    }
    handleTouchStart(event) {
        if (this.readonly) {
            event.preventDefault();
            return;
        }
        this.setFocus();
    }
    syncTooltipStart() {
        this.calculateX(this.valueStart, this.inputstart, `outputStart${this.uuid}`);
    }
    syncLabels() {
        this.values.forEach((ele, index) => {
            //Do some binary search here.
            //The plan of using arrayXTransform was to add more pipes in the future.
            //Since parseFloat, sometimes this.max does not match last value using value = value + step.
            //Find a more reliable way to match arrayXTransform values with interval.
            //this.arrayXTransform.forEach((ele2)=> {
            //if (ele2 === ele) {
            const percent = Math.max(0, (ele - this.min) / (this.max - this.min));
            const inputWidth = this.inputstart.offsetWidth;
            const x = `calc(${inputWidth * percent}px - calc(calc(${percent} * ${thumbSize}) - calc(${thumbSize} / 2)))`;
            this[`pipLabel${index}${this.uuid}`].style.transform = `translateX(${x})`;
            // }
            //})
        });
    }
    syncTooltipEnd() {
        this.calculateX(this.valueEnd, this.inputend, `outputEnd${this.uuid}`);
    }
    calculateX(value, slider, output) {
        if (this.tooltip !== "none" &&
            value !== undefined &&
            value !== null &&
            slider &&
            output) {
            const percent = Math.max(0, (value - this.min) / (this.max - this.min));
            const inputWidth = slider.offsetWidth;
            const tooltipWidth = this[output].offsetWidth;
            //const thumbSize = getComputedStyle(this.inputstart).getPropertyValue("--thumb-size");
            const x = `calc(${inputWidth * percent}px - calc(calc(${percent} * ${thumbSize}) - calc(${thumbSize} / 2)))`;
            this[output].style.transform = `translateX(${x})`;
            this[output].style.marginLeft = `-${tooltipWidth / 2}px`;
            //componentDidRender can't capture some elements yet like Tooltip.
            //Commenting for now.
            //this.hasTooltip = true;
        }
    }
    _onInputStart() {
        if (this.readonly) {
            this.inputstart.value = this.valueStart.toString();
            return;
        }
        this.fillColor();
        this.valueStart = parseFloat(this.inputstart.value);
        if (!this.double) {
            this.value = parseFloat(this.inputstart.value);
        }
        else {
            this.value =
                parseFloat(this.inputend.value) - parseFloat(this.inputstart.value) <=
                    minGap
                    ? [parseFloat(this.inputend.value), parseFloat(this.inputstart.value)]
                    : [
                        parseFloat(this.inputstart.value),
                        parseFloat(this.inputend.value),
                    ];
        }
        requestAnimationFrame(() => {
            this.syncTooltipStart();
            this.syncTickStyle();
        });
        this.hbrInput.emit();
    }
    _onChange(event) {
        if (this.readonly) {
            return;
        }
        const target = event.target === this.inputstart ? "start" : "end";
        this.hbrChange.emit({ target });
    }
    _onInputEnd() {
        if (this.readonly) {
            this.inputend.value = this.valueEnd.toString();
            return;
        }
        this.fillColor();
        this.valueEnd = parseFloat(this.inputend.value);
        if (!this.double) {
            this.value = parseFloat(this.inputend.value);
        }
        else {
            this.value =
                parseFloat(this.inputend.value) - parseFloat(this.inputstart.value) <=
                    minGap
                    ? [parseFloat(this.inputend.value), parseFloat(this.inputstart.value)]
                    : [
                        parseFloat(this.inputstart.value),
                        parseFloat(this.inputend.value),
                    ];
        }
        requestAnimationFrame(() => {
            this.syncTooltipEnd();
            this.syncTickStyle();
        });
        this.hbrInput.emit();
    }
    syncTickStyle() {
        Array.from(this[`tickMarks${this.uuid}`].children).forEach((ele) => {
            const hidden = ele.classList.contains("range__hidden-tick");
            if (!this.double) {
                if (parseFloat(this.inputstart.value) > parseFloat(ele.dataset.value)) {
                    ele.className = `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--inactive`;
                }
                else {
                    ele.className = `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--active`;
                }
            }
            else {
                if (parseFloat(this.inputstart.value) > parseFloat(ele.dataset.value) ||
                    parseFloat(this.inputend.value) < parseFloat(ele.dataset.value)) {
                    ele.className = `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--active`;
                }
                else {
                    ele.className = `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--inactive`;
                }
            }
            if (hidden) {
                ele.classList.add("range__hidden-tick");
            }
        });
    }
    fillColor() {
        const totalRange = this.max - this.min;
        const unselectedColor = this.disabled
            ? "var(--slider-range-unselected-color-disabled)"
            : "var(--slider-range-unselected-color)";
        const selectedColor = this.disabled
            ? "var(--slider-range-selected-color-disabled)"
            : "var(--slider-range-selected-color)";
        if (this.double) {
            const nonShadowSectionLeft = parseFloat(this.inputstart.value) - this.min;
            const nonShadowSectionRight = parseFloat(this.inputend.value) - this.min;
            const percent1 = (nonShadowSectionLeft / totalRange) * 100;
            const percent2 = (nonShadowSectionRight / totalRange) * 100;
            this[`sliderTrack${this.uuid}`].style.background = `linear-gradient(to right, 
          ${unselectedColor} ${percent1}%, 
          ${selectedColor} ${percent1}% , 
          ${selectedColor} ${percent2}%, 
          ${unselectedColor} ${percent2}%)`;
        }
        else {
            const shadowSection = parseFloat(this.inputstart.value) - this.min;
            const percent1 = (shadowSection / totalRange) * 100;
            const percent2 = 100;
            this[`sliderTrack${this.uuid}`].style.background = `linear-gradient(to right, 
          ${selectedColor} ${percent1}% , 
          ${unselectedColor} ${percent1}%,
           ${unselectedColor} ${percent2}%)`;
        }
    }
    discretePoints() {
        let temp = [];
        if (this.discrete && this.uneven) {
            temp = [...this.values.filter((ele) => !Number.isInteger(ele))];
        }
        const range = this.max - this.min;
        const numberOfPoints = range / this.step;
        const arrayTemp = [];
        let initialValue = this.min;
        Array.from({ length: numberOfPoints + 1 })
            .fill("1")
            .forEach(() => {
            arrayTemp.push(initialValue);
            if (temp.length > 0) {
                /** Ensure that floating-point numbers are added to the arrayTemp so that its tick can be updated. */
                if (Math.floor(temp[0]) === initialValue) {
                    arrayTemp.push(temp[0]);
                    temp.shift();
                }
            }
            initialValue = initialValue + this.step;
        });
        this.arrayXTransform = arrayTemp;
    }
    handleBlur(target) {
        if (this.activeFocusTarget === target) {
            this.activeFocusTarget = null;
        }
        this.hbrBlur.emit();
        this.resizeObserver.unobserve(this.inputstart);
        if (this.double)
            this.resizeObserver.unobserve(this.inputend);
    }
    handleFocus(target) {
        if (this.disabled) {
            return;
        }
        this.activeFocusTarget = target;
        this.hbrFocus.emit();
        this.resizeObserver.observe(this.inputstart);
        if (this.double)
            this.resizeObserver.observe(this.inputend);
    }
    handleMouseEnter(target) {
        if (this.disabled) {
            return;
        }
        this.activeHoverTarget = target;
    }
    handleMouseLeave(target) {
        if (this.activeHoverTarget === target) {
            this.activeHoverTarget = null;
        }
    }
    handleMouseDown(target, event) {
        if (this.disabled) {
            return;
        }
        if (this.readonly) {
            event.preventDefault();
            return;
        }
        this.activeFocusTarget = target;
    }
    handleMouseUp(target) {
        if (this.disabled || this.readonly) {
            return;
        }
        this.activeFocusTarget = target;
        this.activeHoverTarget = target;
    }
    handleTickMarkClick(event) {
        if (this.disabled || this.readonly) {
            return;
        }
        if (this.double) {
            const target = event.target;
            if (target) {
                const { value } = target.dataset;
                const { start, end } = this;
                const diffToStart = Math.abs(parseFloat(value) - start);
                const diffToEnd = Math.abs(parseFloat(value) - end);
                /** depends on the distance between clicked and start/end, dynamically update either start or end value.Depending on the distance between the clicked position and the start or end, dynamically update either the start or end value. */
                if (diffToStart <= diffToEnd) {
                    this.start = parseFloat(value);
                    this.value = [this.start, parseFloat(this.inputend.value)];
                    this.inputstart.focus();
                }
                else {
                    this.end = parseFloat(value);
                    this.value = [parseFloat(this.inputstart.value), this.end];
                    this.inputend.focus();
                }
            }
        }
        else {
            /** only triggers in non-double mode */
            this.start = parseFloat(event.target.dataset.value);
            this.value = this.start;
            this.inputstart.focus();
            setTimeout(() => {
                this.hbrChange.emit();
            });
        }
    }
    handleKeyDown(event) {
        const valueChangeKeys = [
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "End",
            "Home",
            "PageDown",
            "PageUp",
        ];
        if (this.readonly && valueChangeKeys.includes(event.key)) {
            event.preventDefault();
        }
    }
    handleSlotChange() {
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasLabelInfoSlot = hasSlot(this.host, "label-info");
        this.hasContent = hasSlot(this.host);
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasHelpText = this.helpText ? true : !!this.hasHelpTextSlot;
    }
    render() {
        var _a, _b, _c;
        const activeTooltipTarget = this.disabled
            ? null
            : this.activeHoverTarget || this.activeFocusTarget;
        return (h(FormControl, { key: '1c4d1f559a99788fa8861bdbba656aeb3d3eaa26', inputId: "", labelId: this.labelId, size: "medium", isRequired: this.required, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, label: this.label, helpText: this.helpText, hasHelpTextSlot: this.hasHelpText, helpTextId: this.helpTextId, isDisabled: this.disabled }, h("div", { key: '06f07281d291361b9291084d46d03f2dae8b1005', class: "wrapper" }, h("div", { key: '5840b31987e9557ce6fd928c26996062007b3ef9', part: "base", class: {
                range: true,
                // States
                "range--disabled": this.disabled,
                "range--readonly": this.readonly,
                "range--double": this.double,
                "range--focused-start": this.activeFocusTarget === "start",
                "range--focused-end": this.activeFocusTarget === "end",
                "range--tooltip-top": this.tooltip === "top",
                "range--tooltip-bottom": this.tooltip === "bottom",
            }, onTouchStart: this.handleTouchStart }, h("div", { key: '7946bf05f7ed9bc926c01162a0a0b8aa80bdf528', part: "track", class: "range--slider-track", ref: (el) => {
                this[`sliderTrack${this.uuid}`] = el;
            } }), h("div", { key: 'a460a7afb5d5d0419ab0641b4edb47db60df050c', class: "range__tick-marks", part: "ticks", ref: (el) => {
                this[`tickMarks${this.uuid}`] = el;
            } }, this.arrayXTransform.map((ele) => {
            if (this.discrete) {
                if (this.uneven) {
                    if (this.values.includes(ele)) {
                        return (h("div", { class: `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--inactive`, "data-value": ele, onClick: !this.double ? this.handleTickMarkClick : undefined }));
                    }
                }
                else {
                    return (h("div", { class: `range__tick-mark${this.double ? "--double" : ""} range__tick-mark--inactive`, "data-value": ele, onClick: !this.double ? this.handleTickMarkClick : undefined }));
                }
            }
            return (h("span", { class: `range__hidden-tick range__tick-mark${this.double ? "--double" : ""} range__tick-mark--inactive`, "data-value": ele, onClick: this.handleTickMarkClick }));
        })), h("div", { key: '0d12aab62b7c174c6dc8f250d80664d2992075cb', class: "range__pip-label-container", part: "pips" }, this.values.map((ele, index) => {
            return (h("div", { class: "range__pip-label", ref: (el) => {
                    this[`pipLabel${index}${this.uuid}`] = el;
                } }, ele));
        })), h("input", { key: '4707b9d4b01bd31f9111711175b7a54ace15624c', part: "inputstart", ref: (el) => {
                this.inputstart = el;
            }, class: "range__input range__input--start", name: this.name, type: "range", tabIndex: 0, min: this.min, max: this.max, step: this.step, value: !this.double && this.value && typeof this.value === "number"
                ? this.value
                : this.valueStart, disabled: this.disabled, id: "slider-1", onInput: this._onInputStart, onChange: this._onChange, onFocus: () => this.handleFocus("start"), onBlur: () => this.handleBlur("start"), onMouseEnter: () => this.handleMouseEnter("start"), onMouseLeave: () => this.handleMouseLeave("start"), onMouseDown: (event) => this.handleMouseDown("start", event), onMouseUp: () => this.handleMouseUp("start"), onTouchEnd: () => this.handleMouseUp("start"), onKeyDown: (event) => this.handleKeyDown(event), "aria-label": (!this.label && ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label)) || ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.labelStart), "aria-labelledby": this.labelId, "aria-readonly": this.readonly ? "true" : undefined }), this.tooltip !== "none" && (h("div", { part: "tooltipstart", ref: (el) => {
                this[`outputStart${this.uuid}`] = el;
            }, class: {
                range__tooltip: true,
                "range__tooltip--visible": activeTooltipTarget === "start",
            } }, this.tooltipFormatter(this.valueStart))), this.double && (h("input", { part: "inputend", ref: (el) => {
                this.inputend = el;
            }, class: "range__input range__input--end", name: this.name, type: "range", tabIndex: 0, min: this.min, max: this.max, step: this.step, value: this.valueEnd, disabled: this.disabled, id: "slider-2", onInput: this._onInputEnd, onChange: this._onChange, onFocus: () => this.handleFocus("end"), onBlur: () => this.handleBlur("end"), onMouseEnter: () => this.handleMouseEnter("end"), onMouseLeave: () => this.handleMouseLeave("end"), onMouseDown: (event) => this.handleMouseDown("end", event), onMouseUp: () => this.handleMouseUp("end"), onTouchEnd: () => this.handleMouseUp("end"), onKeyDown: (event) => this.handleKeyDown(event), "aria-label": !this.label && ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.labelEnd), "aria-labelledby": this.labelId, "aria-readonly": this.readonly ? "true" : undefined })), this.tooltip !== "none" && this.double && (h("div", { part: "tooltipend", ref: (el) => {
                this[`outputEnd${this.uuid}`] = el;
            }, class: {
                range__tooltip: true,
                "range__tooltip--visible": activeTooltipTarget === "end",
            } }, this.tooltipFormatter(this.valueEnd)))))));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "label": ["handleLabelChange"],
        "min": ["handleMinChange"],
        "max": ["handleMaxChange"],
        "start": ["handleStartChange"],
        "end": ["handleEndChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrSliderStyle0; }
}, [65, "hbr-slider", {
        "name": [1],
        "value": [1026],
        "disabled": [516],
        "readonly": [516],
        "required": [516],
        "double": [516],
        "min": [2],
        "max": [2],
        "start": [1538],
        "end": [1538],
        "step": [2],
        "discrete": [4],
        "tooltip": [1],
        "values": [16],
        "aria": [16],
        "uneven": [4],
        "tooltipFormatter": [16],
        "label": [513],
        "helpText": [513, "help-text"],
        "helpTextId": [513, "help-text-id"],
        "activeFocusTarget": [32],
        "activeHoverTarget": [32],
        "hasContent": [32],
        "arrayXTransform": [32],
        "uuid": [32],
        "hasLabelSlot": [32],
        "hasLabelInfoSlot": [32],
        "hasHelpTextSlot": [32],
        "hasHelpText": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32],
        "valueStart": [32],
        "valueEnd": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "reportValidity": [64]
    }, undefined, {
        "label": ["handleLabelChange"],
        "min": ["handleMinChange"],
        "max": ["handleMaxChange"],
        "start": ["handleStartChange"],
        "end": ["handleEndChange"],
        "value": ["handleValueChange"],
        "disabled": ["handleDisabledChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-slider", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-slider":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrSlider$1);
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrSlider = HbrSlider$1;
const defineCustomElement = defineCustomElement$1;

export { HbrSlider, defineCustomElement };

