import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { g as caret } from './index2.js';
import { a as addConstructedStyle } from './browser.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';
import { c as getCssRulesForSentimentButton } from './sentiments.js';
import { h as hasSlot } from './slot.js';
import { c as color } from './token.js';
import { d as defineCustomElement$1 } from './spinner.js';

const buttonCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block;width:auto;cursor:pointer;position:relative;--border-width:var(--hbr-border-width, 2px);--border-style:solid;--border-color:transparent;--label-font-family:var(--hbr-control-font-family);--label-font-weight:var(--hbr-font-weight-semibold);--label-font-size:var(--hbr-control-font-size-md);--hbr-control-height-xs:2rem;--height-xsmall:var(--hbr-control-height-xs);--height-small:var(--hbr-control-height-sm);--height-medium:var(--hbr-control-height-md);--height-large:var(--hbr-control-height-lg);--focus-ring:none;--palm-width:100%;--label-affix-padding-sm:var(--hbr-spacing-2xs);--label-affix-padding-md:var(--hbr-spacing-xs);--label-affix-padding-lg:var(--hbr-spacing-sm);--padding-horizontal-sm:var(--hbr-spacing-sm);--padding-horizontal-md:var(--hbr-spacing-lg);--padding-horizontal-lg:var(--hbr-spacing-xl);--group-margin-left:-2px;--icon-label-w-caret-padding-inline-end:var(--label-affix-padding-md);--default-outline-color:var(--base-text-strong-default);--default-outline-disabled-color:var(--base-text-disabled)}@media only screen and (min-width: 23.5em){:host{width:auto}}:host{}:host([size=small]){border-radius:var(--hbr-control-border-radius-sm)}:host([size=medium]){border-radius:var(--hbr-control-border-radius-md)}:host([size=large]){border-radius:var(--hbr-control-border-radius-lg)}:host([circle]){border-radius:var(--hbr-border-radius-circle)}:host([pill][size=small]){border-radius:var(--hbr-control-height-sm)}:host([pill][size=medium]){border-radius:var(--hbr-control-height-md)}:host([pill][size=large]){border-radius:var(--hbr-control-height-lg)}:host([variant=text]){line-height:var(--host-text-line-height)}:host([floating]){position:var(--floating-position);top:var(--floating-position-top, auto);bottom:var(--floating-position-bottom, auto);right:var(--floating-position-right, auto);left:var(--floating-position-left, auto);z-index:var(---floating-z-index);box-shadow:var(--floating-shadow)}.button{display:inline-flex;align-items:var(--button-align-items, stretch);justify-content:center;width:inherit;font-family:var(--label-font-family);font-weight:var(--label-font-weight);font-size:var(--label-font-size);text-decoration:none;white-space:nowrap;vertical-align:middle;padding:0;transition:var(--hbr-transition-fast) background-color, var(--hbr-transition-fast) color, var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow;cursor:inherit}.button::-moz-focus-inner{border:0}.button.button--disabled{cursor:not-allowed}.button.button--disabled *{pointer-events:none}.button.button--no-padding{width:initial;border:none}.button.button--text{border:0}.button ::slotted(hbr-icon){pointer-events:none}:host([data-focused]) .button{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.button__prefix,.button__suffix{flex:0 0 auto;display:flex;align-items:center;justify-content:center}.button__label ::slotted(hbr-icon){vertical-align:-2px}.button__label{display:flex;align-items:center}.button{background:var(--bg-color);border:var(--border-width) var(--border-style) var(--border-color);color:var(--label-color)}.button:not(.button--loading):not(.button--disabled):hover{background:var(--bg-color-hover);border-color:var(--border-color-hover);color:var(--label-color-hover)}.button:not(.button--loading):not(.button--disabled):active{background:var(--bg-color-hover);border-color:var(--border-color-hover);color:var(--label-color-hover)}.button:not(.button--loading):not(.button--disabled).button--header:focus-visible{background:var(--bg-color-active);border-color:var(--border-color-active);color:var(--label-color-active)}.button.button--fill{border-color:transparent}.button.button--loading.button--outline{border-color:var(--label-color)}.button--outline{border:var(--border-style) var(--border-width) var(--border-color)}.button--outline.button--default{--border-color:var(--control-border-weak-default);color:var(--default-outline-color)}.button--outline.button--default.button--disabled{color:var(--default-outline-disabled-color)}.button.button--context{--bg-color:transparent;--label-color:currentColor;--border-color:transparent;--bg-color-hover:transparent;--label-color-hover:currentColor;--border-color-hover:transparent;--bg-color-active:transparent;--label-color-active:currentColor;--border-color-active:transparent}.button--xsmall{--label-font-size:var(--hbr-font-size-xs);border-radius:var(--hbr-control-border-radius-sm);height:var(--hbr-control-height-xs)}.button--xsmall:not(.button--text):not(.button--no-padding):not(.button--context){height:var(--height-xsmall)}.button--xsmall{line-height:calc(var(--height-xsmall) - var(--hbr-control-border-width) * 2)}.button--xsmall.button--text,.button--xsmall.button--context{line-height:var(--hbr-font-line-height-dense)}.button--small{--label-font-size:var(--hbr-font-size-xs);border-radius:var(--hbr-control-border-radius-sm)}.button--small:not(.button--text):not(.button--no-padding):not(.button--context){height:var(--height-small)}.button--small{line-height:calc(var(--height-small) - var(--hbr-control-border-width) * 2)}.button--small.button--text,.button--small.button--context{line-height:var(--hbr-font-line-height-dense)}.button--medium{--label-font-size:var(--hbr-control-font-size-md);border-radius:var(--hbr-control-border-radius-md)}.button--medium:not(.button--text):not(.button--no-padding):not(.button--context){height:var(--height-medium)}.button--medium{line-height:calc(var(--height-medium) - var(--hbr-control-border-width) * 2)}.button--medium.button--text,.button--medium.button--context{line-height:var(--hbr-font-line-height-normal)}.button--large{--label-font-size:var(--hbr-control-font-size-lg);border-radius:var(--hbr-control-border-radius-lg)}.button--large:not(.button--text):not(.button--no-padding):not(.button--context){height:var(--height-large)}.button--large{line-height:calc(var(--height-large) - var(--hbr-control-border-width) * 2)}.button--large.button--text,.button--large.button--context{line-height:var(--hbr-font-line-height-loose)}.button--pill.button--small{border-radius:var(--hbr-control-height-sm)}.button--pill.button--medium{border-radius:var(--hbr-control-height-md)}.button--pill.button--large{border-radius:var(--hbr-control-height-lg)}.button--icon-label-button{padding-left:0;padding-right:0}.button--icon-label-button.button--xsmall{width:var(--hbr-control-height-xs);height:var(--hbr-control-height-xs);line-height:var(--hbr-control-height-xs)}.button--icon-label-button.button--small{width:var(--hbr-control-height-sm);height:var(--hbr-control-height-sm);line-height:var(--hbr-control-height-sm)}.button--icon-label-button.button--small .button__label{line-height:calc(var(--hbr-control-height-sm) - var(--hbr-control-border-width) * 3)}.button--icon-label-button.button--medium{width:var(--button-icon-label-width-md, var(--hbr-control-height-md));height:var(--button-icon-label-height-md, var(--hbr-control-height-md));line-height:var(--button-icon-line-height-md, var(--hbr-control-height-md))}.button--icon-label-button.button--medium .button__label{line-height:calc(var(--hbr-control-height-md) - var(--hbr-control-border-width) * 2)}.button--icon-label-button.button--large{width:var(--hbr-control-height-lg);height:var(--hbr-control-height-lg);line-height:var(--hbr-control-height-lg)}.button--circle{padding-left:0;padding-right:0}.button--circle.button--small{width:var(--hbr-control-height-sm);height:var(--hbr-control-height-sm);line-height:var(--hbr-control-height-sm);border-radius:var(--hbr-border-radius-circle)}.button--circle.button--small .button__label{line-height:calc(var(--hbr-control-height-sm) - var(--hbr-control-border-width) * 3)}.button--circle.button--medium{width:var(--hbr-control-height-md);height:var(--hbr-control-height-md);border-radius:var(--hbr-border-radius-circle);line-height:var(--hbr-control-height-md)}.button--circle.button--medium .button__label{line-height:calc(var(--hbr-control-height-md) - var(--hbr-control-border-width) * 2)}.button--circle.button--large{width:var(--hbr-control-height-lg);height:var(--hbr-control-height-lg);border-radius:var(--hbr-border-radius-circle);line-height:var(--hbr-control-height-lg)}.button--circle .button__prefix,.button--circle .button__suffix,.button--circle .button__caret{display:none}.button--circle .button__label{display:flex;align-items:center}.button--caret .button__suffix{display:none}.button--caret .button__caret{height:auto;display:inherit}.button--caret.button--header .button__caret{height:100%}.button--loading{position:relative;cursor:wait}.button--loading .button__prefix,.button--loading .button__label,.button--loading .button__suffix,.button--loading .button__caret{visibility:hidden}.button--loading hbr-spinner{--indicator-color:currentColor;position:absolute;height:1em;width:1em;top:calc(50% - 0.5em);left:calc(50% - 0.5em)}.button--loading{min-width:34px}.button--loading.button--small{min-width:24px}.button--loading.button--large{min-width:42px}.button ::slotted(hbr-badge:not([inline])){position:absolute;top:0;right:0;transform:translateY(-50%) translateX(50%);pointer-events:none}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-label.button--xsmall .button__label{padding:0 calc(var(--padding-horizontal-sm) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-label.button--small .button__label{padding:0 calc(var(--padding-horizontal-sm) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-label.button--medium .button__label{padding:0 calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-label.button--large .button__label{padding:0 calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-prefix.button--xsmall{padding-inline-start:calc(var(--hbr-spacing-xs) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-prefix.button--small{padding-inline-start:calc(var(--hbr-spacing-xs) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-prefix.button--small .button__label{padding-inline-start:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-suffix.button--small .button__label{padding-inline-end:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-prefix.button--medium{padding-inline-start:calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-prefix.button--medium .button__label{padding-inline-start:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-suffix.button--medium .button__label{padding-inline-end:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-prefix.button--large{padding-inline-start:calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-prefix.button--large .button__label{padding-inline-start:var(--label-affix-padding-lg)}:not(.button--text):not(.button--no-padding):not(.button--context):not(.button--icon-button).button--has-suffix.button--large .button__label{padding-inline-end:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-suffix.button--xsmall,:not(.button--text):not(.button--no-padding):not(.button--context).button--has-suffix.button--small,:not(.button--text):not(.button--no-padding):not(.button--context).button--caret.button--small{padding-inline-end:calc(var(--padding-horizontal-sm) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context).split--right.button--has-suffix.button--small,:not(.button--text):not(.button--no-padding):not(.button--context).split--right.button--caret.button--small{padding-inline-end:4px}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-suffix.button--medium,:not(.button--text):not(.button--no-padding):not(.button--context).button--caret.button--medium{padding-inline-end:calc(var(--padding-horizontal-md) - var(--hbr-control-border-width))}:not(.button--text):not(.button--no-padding):not(.button--context).split--right.button--has-suffix.button--medium,:not(.button--text):not(.button--no-padding):not(.button--context).split--right.button--caret.button--medium{padding-inline-end:6px}:not(.button--text):not(.button--no-padding):not(.button--context).button--has-suffix.button--large,:not(.button--text):not(.button--no-padding):not(.button--context).button--caret.button--large{padding-inline-end:calc(var(--padding-horizontal-lg) - var(--hbr-control-border-width))}:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--medium.button--has-prefix,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--small.button--has-prefix,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--large.button--has-prefix{width:fit-content}:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--medium.button--has-prefix .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--small.button--has-prefix .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--large.button--has-prefix .button__label{padding-left:var(--hbr-spacing-2xs)}:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--medium.button--has-suffix,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--small.button--has-suffix,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--large.button--has-suffix{width:fit-content}:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--medium.button--has-suffix .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--small.button--has-suffix .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--large.button--has-suffix .button__label{padding-right:var(--hbr-spacing-2xs)}:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--medium .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--small .button__label,:not(.button--text):not(.button--outline):not(.button--context):not(.button--icon-button).button--has-label.button--header.button--large .button__label{padding:0px}:not(.button--text):not(.button--no-padding).button--has-suffix.button--medium .button__label,:not(.button--text):not(.button--no-padding).button--caret.button--medium .button__label{padding-inline-end:var(--label-affix-padding-md)}:not(.button--text):not(.button--no-padding).split--right.button--has-suffix.button--medium .button__label,:not(.button--text):not(.button--no-padding).split--right.button--caret.button--medium .button__label{padding-inline-end:6px}:not(.button--text):not(.button--no-padding).split--right.button--has-suffix.button--small .button__label,:not(.button--text):not(.button--no-padding).split--right.button--caret.button--small .button__label{padding-inline-end:4px}:not(.button--text):not(.button--no-padding):not(.button--icon-button).button--has-suffix.button--large .button__label,:not(.button--text):not(.button--no-padding):not(.button--icon-button).button--caret.button--large .button__label{padding-inline-end:var(--label-affix-padding-lg)}.button--text.button--has-prefix.button--small .button__label{padding-inline-start:var(--label-affix-padding-md)}.button--text.button--has-prefix.button--medium .button__label{padding-inline-start:var(--label-affix-padding-md)}.button--text.button--has-prefix.button--large .button__label{padding-inline-start:var(--label-affix-padding-lg)}.button--text.button--has-suffix.button--small .button__label,.button--text.button--caret.button--small .button__label{padding-inline-end:var(--label-affix-padding-md)}.button--text.button--has-suffix.button--medium .button__label,.button--text.button--caret.button--medium .button__label{padding-inline-end:var(--label-affix-padding-md)}.button--text.button--has-suffix.button--large .button__label,.button--text.button--caret.button--large .button__label{padding-inline-end:var(--label-affix-padding-lg)}.button--text{}.button--text.button--small.button--caret.button--icon-label-button .button__label{padding-inline-end:var(--icon-label-w-caret-padding-inline-end)}.button--floating{box-shadow:var(--floating-shadow);transition:all 0.08s ease-in-out}:host(.hbr-button-group__button--first:not(.hbr-button-group__button--last)) .button{border-start-end-radius:0;border-end-end-radius:0}:host(.hbr-button-group__button--inner) .button{border-radius:0}:host(.hbr-button-group__button--last:not(.hbr-button-group__button--first)) .button{border-start-start-radius:0;border-end-start-radius:0}:host(.hbr-button-group__button:not(.hbr-button-group__button--first)){margin-inline-start:var(--group-margin-left)}:host(.button--split:not(.hbr-button-group__button--first)){margin-inline-start:-1px}:host(.hbr-button-group__button:not(.hbr-button-group__button--focus,.hbr-button-group__button--first,.hbr-button-group__button--radio,[variant=default]):not(:hover,:active,:focus-visible)) .button:after{content:\"\";position:absolute;top:0;inset-inline-start:0;bottom:0;border-left:solid 1px rgba(212, 220, 227, 0.33);mix-blend-mode:multiply}:host(.hbr-button-group__button--hover){z-index:1}:host(.hbr-button-group__button--focus),:host(.hbr-button-group__button[checked]){z-index:2}:host(.button--split.hbr-button-group__button--last){z-index:4}:host(.button--split.hbr-button-group__button--last) .button[aria-expanded=true]{background:var(--bg-color-hover)}:host([data-focused].button--split.hbr-button-group__button--first){z-index:3}:host(.button--split.hbr-button-group__button--first) .button{border-inline-end:none}:host(.button--split.hbr-button-group__button--last) .button{border-inline-start:none;padding-inline-start:1px}:host(.button--split:not(.hbr-button-group__button--first)){margin-inline-start:0}.button.split--right::before{content:\"\";position:absolute;top:calc(var(--border-width) + 5px);inset-inline-start:0;transform:translateX(-50%);bottom:calc(var(--border-width) + 5px);width:1px;background-color:var(--split-separator-color, var(--label-color));z-index:5;pointer-events:none}:host([data-focused]) .button.split--right::before{display:none}:host-context([data-theme=onecd]){--hbr-border-width:1px}";
const HbrButtonStyle0 = buttonCss;

const Button = /*@__PURE__*/ proxyCustomElement(class Button extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrBlur = createEvent(this, "hbr-blur", 7);
        this.hbrFocus = createEvent(this, "hbr-focus", 7);
        this.sheet = new CSSStyleSheet();
        this.sentimentSheet = new CSSStyleSheet();
        this.buttonGroup = false;
        this.visibilityHidden = false;
        this.hasFocus = false;
        this.hasLabel = false;
        this.hasPrefix = false;
        this.hasSuffix = false;
        this.splitPosition = undefined;
        this.tooltipId = `tooltip-${generateShortID()}`;
        this.sentiment = undefined;
        this.variant = undefined;
        this.size = "medium";
        this.caret = false;
        this.disabled = false;
        this.loading = false;
        this.pill = false;
        this.circle = false;
        this.submit = false;
        this.error = false;
        this.floating = false;
        this.requestSubmit = false;
        this.type = "button";
        this.name = undefined;
        this.value = undefined;
        this.noPadding = undefined;
        this.ariahaspopup = undefined;
        this.ariaexpanded = undefined;
        this.arialabel = undefined;
        this.ariacontrols = undefined;
        this.ariarole = undefined;
        this.ariapressed = undefined;
        this.aria = undefined;
        this.tabidx = undefined;
        this.tooltip = undefined;
    }
    connectedCallback() {
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.buttonGroup = !!this.host.closest("hbr-button-group");
        this.visibilityHidden = this.containVisuallyHidden();
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    /** Sets focus on the button. */
    async setFocus(options) {
        var _a;
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.focus(options);
    }
    /** Removes focus from the button. */
    async removeFocus() {
        var _a;
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.blur();
    }
    /** Sets the split button position when managed by an internal button group. */
    async setSplitPosition(splitPosition) {
        this.splitPosition = splitPosition;
    }
    handleSlotChange() {
        this.hasLabel = this.visibilityHidden ? false : hasSlot(this.host);
        this.hasPrefix = hasSlot(this.host, "prefix");
        this.hasSuffix = hasSlot(this.host, "suffix");
        /** make sure to set sentiment's default to interact for the loading buttons due to the spinning icon color */
        this.spinner =
            !this.loading &&
                this.hasPrefix &&
                !!this.host.querySelector("hbr-spinner");
        if (this.loading || this.spinner) {
            this.disabled = true;
            if (!this.sentiment) {
                this.sentiment = "interact";
            }
        }
    }
    containVisuallyHidden() {
        const { children } = this.host;
        if (children.length) {
            const el = Array.from(children)[0];
            const tagName = el.tagName.toLowerCase();
            if (tagName === "hbr-visually-hidden") {
                return true;
            }
        }
        return false;
    }
    handleBlur(event) {
        this.hasFocus = false;
        this.hbrBlur.emit();
        this.host.removeAttribute("data-focused");
    }
    handleFocus(event) {
        var _a;
        this.hasFocus = true;
        this.hbrFocus.emit();
        const target = event.target;
        const isFocusVisible = !!((_a = target === null || target === void 0 ? void 0 : target.matches) === null || _a === void 0 ? void 0 : _a.call(target, ":focus-visible"));
        if (isFocusVisible) {
            this.host.setAttribute("data-focused", "true");
        }
        else {
            this.host.removeAttribute("data-focused");
        }
    }
    handlePointerDown() {
        var _a;
        if (this.host.hasAttribute("data-focused")) {
            (_a = this.button) === null || _a === void 0 ? void 0 : _a.blur();
        }
    }
    handleClick(event) {
        var _a;
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            if (this.requestSubmit || this.type === "submit") {
                (_a = this.host.closest("form")) === null || _a === void 0 ? void 0 : _a.requestSubmit();
            }
        }
    }
    render() {
        var _a;
        const { disabled, loading, size, circle, sentiment, variant, arialabel } = this;
        let part = "base";
        if (this.error)
            part += " error";
        let _sentiment = sentiment;
        let _variant = variant;
        if (!_sentiment) {
            if (!this.buttonGroup) {
                _sentiment = "interact";
            }
            else {
                _sentiment = "default";
            }
        }
        if (!_variant) {
            if (!this.buttonGroup) {
                _variant = "fill";
            }
            else {
                _variant = "outline";
            }
        }
        const iconButton = this.circle && this.host.querySelector("hbr-icon");
        // truthy only when hbr-icon is present in the default slot and not in suffix, prefix, etc
        const iconLabelButton = this.host.querySelector("hbr-icon:not([slot])");
        const btnCls = {
            button: true,
            // Sizes
            "button--xsmall": size === "xsmall",
            "button--small": size === "small",
            "button--medium": size === "medium",
            "button--large": size === "large",
            // Modifiers
            "button--caret": this.caret,
            "button--circle": circle,
            "button--disabled": disabled,
            "button--focused": this.hasFocus,
            "button--loading": loading,
            "button--pill": this.pill,
            "button--standard": _variant !== "outline",
            "button--outline": _variant === "outline",
            "button--has-label": this.hasLabel,
            "button--has-prefix": this.hasPrefix,
            "button--has-suffix": this.hasSuffix,
            "button--no-padding": !!this.noPadding,
            "button--icon-button": !!iconButton,
            "button--icon-label-button": !!iconLabelButton,
            "button--floating": this.floating,
            "split--left": this.splitPosition === "left",
            "split--right": this.splitPosition === "right",
            // State
            "button--error": this.error,
        };
        btnCls[`button--${_sentiment}`] = !!this.sentiment || !!_sentiment;
        btnCls[`button--${_variant}`] = !!this.variant || !!_variant;
        let ariaLabel = "";
        if (!this.visibilityHidden) {
            if (arialabel) {
                ariaLabel = arialabel;
            }
        }
        if (this.host) {
            if (this.buttonGroup && _sentiment === "default") {
                this.sheet.replaceSync(`
					:host {
						--bg-color: none;
						--border-color: var(--base-border-medium-default);
						--border-color-hover: var(--control-border-weak-disabled);
						--bg-color-hover: var(--base-bg-weak-hover);
						--label-color-hover: var(--base-text-default);
					}
				`);
            }
            else if (![
                "interact",
                "danger",
                "success",
                "warning",
                "info",
                "positive",
                "negative",
            ].includes(_sentiment)) {
                // Non-Magnetic and custom sentiments
                this.sheet.replaceSync(`
					:host {
						--bg-color: ${_sentiment === "default"
                    ? `${disabled
                        ? "var(--base-bg-strong-disabled)"
                        : color("neutral", "bg")}`
                    : _variant === "fill"
                        ? color(_sentiment, "", "", loading ? "hover" : disabled ? "disabled" : "")
                        : _variant === "text"
                            ? "transparent"
                            : color("neutral", "", "bg")};
						--label-color: ${_sentiment === "default"
                    ? color("neutral", "text", "weak", disabled ? "disabled" : "")
                    : _variant === "fill"
                        ? color("neutral", "contrast-text")
                        : color(_sentiment, "", "", disabled ? "disabled" : "")};
						--border-color: ${_sentiment === "default"
                    ? "var(--control-border-medium-disabled)"
                    : _variant === "fill"
                        ? `${color(_sentiment, "", "", disabled ? "disabled" : "")}`
                        : _variant === "text"
                            ? "transparent"
                            : `${color(_sentiment, "", "", disabled ? "disabled" : "")}`};

						--bg-color-hover: ${_sentiment === "default"
                    ? color("neutral", "", "bg-weak")
                    : _variant === "fill"
                        ? color(_sentiment, "", "", "hover")
                        : color(_sentiment, "bg", "", "hover")};
						--label-color-hover: ${_variant !== "fill"
                    ? color(_sentiment, "", "", "hover")
                    : color("neutral", "contrast-text")};
						--border-color-hover: ${_sentiment === "default"
                    ? color("neutral", "border", "medium", "")
                    : _variant === "text"
                        ? "transparent"
                        : color(_sentiment, "", "", "hover")};

						--bg-color-active: ${_sentiment === "default"
                    ? color("neutral", "", "bg-weak")
                    : _variant !== "fill"
                        ? _variant === "outline"
                            ? disabled
                                ? "transparent"
                                : color(_sentiment, "", "", "highlight")
                            : color(_sentiment, "", "", "highlight")
                        : color(_sentiment, "", "", "active")};
						--label-color-active: ${_variant !== "fill" && _variant !== "outline"
                    ? color(_sentiment, "", "", "hover")
                    : _variant === "outline"
                        ? color(_sentiment, "", "", "")
                        : color("neutral", "contrast-text")};
						--border-color-active: ${_sentiment === "default"
                    ? color("neutral", "border", "medium", "")
                    : _variant === "fill"
                        ? color(_sentiment, "", "", "active")
                        : _variant === "outline"
                            ? color(_sentiment, "", "", disabled ? "disabled" : "")
                            : "transparent"};
					}
				`);
            }
            else {
                const _variant = this.buttonGroup && !this.variant
                    ? "outline"
                    : !this.variant
                        ? "fill"
                        : this.variant;
                this.sheet.replaceSync(`
					:host {
						${getCssRulesForSentimentButton({
                    sentiment: sentiment || "interact",
                    variant: _variant,
                    disabled,
                })};
					}
				`);
            }
            addConstructedStyle(this.host.shadowRoot, this.sheet);
            /** icon */
            if (sentiment && sentiment !== "header") {
                const _variant = this.buttonGroup && !this.variant
                    ? "outline"
                    : !this.variant
                        ? "fill"
                        : this.variant;
                this.sentimentSheet.replaceSync(`
					:host {
						${getCssRulesForSentimentButton({
                    sentiment,
                    variant: _variant,
                    disabled,
                    type: "icon",
                })};
					}
				`);
                addConstructedStyle(this.host.shadowRoot, this.sentimentSheet);
            }
        }
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { label, expanded, pressed, haspopup, controls, role } = this.aria || {};
        return (h(Host, { key: 'c50b794c7f9c4fd19f4037bb4d9f62adfc19c3c7' }, h("button", { key: '69b838ce37824c1a557c3fecadf34d0dd45c609d', ref: (el) => {
                this.button = el;
            }, role: role || this.ariarole, part: part, class: btnCls, disabled: this.disabled, type: this.type, name: this.name, value: this.value, onBlur: this.handleBlur, onFocus: this.handleFocus, onPointerDown: this.handlePointerDown, onClick: this.handleClick, "aria-disabled": loading || disabled ? "true" : "false", "aria-haspopup": haspopup || this.ariahaspopup, "aria-describedby": this.tooltip ? this.tooltipId : null, "aria-expanded": expanded || this.ariaexpanded, "aria-label": label || ariaLabel, "aria-pressed": pressed || this.ariapressed, "aria-controls": controls || this.ariacontrols, tabindex: this.tabidx ? this.tabidx : this.disabled ? "-1" : "0", "data-testid": "HbrButton-button" }, this.hasPrefix && (h("span", { part: "prefix", class: { button__prefix: this.hasPrefix } }, h("slot", { onSlotchange: this.handleSlotChange, name: "prefix" }))), h("span", { key: '91beab868f63bc0c08248c18b067db6858045dc4', part: `label${iconLabelButton ? " icon-label" : ""}`, class: "button__label" }, h("slot", { key: '6c1d0a69f909499ce70669560686552f043a745e', onSlotchange: this.handleSlotChange })), this.hasSuffix && (h("span", { part: "suffix", class: { button__suffix: this.hasSuffix } }, h("slot", { onSlotchange: this.handleSlotChange, name: "suffix" }))), this.caret && (h("hbr-icon", { part: "caret", class: "button__caret", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.caret) || caret })), this.loading && h("hbr-spinner", null)), h("span", { key: '4851e6d3386909620fd8305582308c63d691ba5f', id: this.tooltipId, hidden: true }, this.tooltip)));
    }
    get host() { return this; }
    static get style() { return HbrButtonStyle0; }
}, [1, "hbr-button", {
        "sentiment": [1537],
        "variant": [513],
        "size": [513],
        "caret": [516],
        "disabled": [1540],
        "loading": [516],
        "pill": [516],
        "circle": [516],
        "submit": [516],
        "error": [516],
        "floating": [516],
        "requestSubmit": [516, "request-submit"],
        "type": [513],
        "name": [1],
        "value": [1],
        "noPadding": [516, "no-padding"],
        "ariahaspopup": [1],
        "ariaexpanded": [1],
        "arialabel": [1],
        "ariacontrols": [1],
        "ariarole": [513],
        "ariapressed": [1],
        "aria": [16],
        "tabidx": [1],
        "tooltip": [513],
        "hasFocus": [32],
        "hasLabel": [32],
        "hasPrefix": [32],
        "hasSuffix": [32],
        "splitPosition": [32],
        "tooltipId": [32],
        "setFocus": [64],
        "removeFocus": [64],
        "setSplitPosition": [64]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-button", "hbr-icon", "hbr-spinner"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-button":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Button);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Button as B, defineCustomElement as d };

