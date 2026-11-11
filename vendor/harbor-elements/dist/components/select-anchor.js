import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { x as xCircle, c as caretDown } from './index2.js';
import { F as FormControl } from './form-control.js';
import { g as getBootstrapConfig, d as defineCustomElement$4 } from './icon.js';
import { d as defineCustomElement$3 } from './icon-button.js';
import { d as defineCustomElement$2 } from './tag.js';
import { d as defineCustomElement$1 } from './visually-hidden.js';

const selectAnchorCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--color:var(--base-text-default);--border-width:var(--hbr-control-border-width);--border-color:var(--control-border-default);--box-border:solid var(--border-width) var(--border-color);--box-font-family:var(--hbr-control-font-family);--box-font-weight:var(--hbr-control-font-weight);--placeholder-color:var(--base-text-weak-default);--placeholder-disabled-color:var(--base-text-disabled);--box-bg-color:transparent;--box-bg-color-hover:var(--control-bg-weak-default);--border-color-hover:var(--control-border-hover);--box-bg-color-focus:var(--control-bg-weak-default);--border-color-focus:var(--control-border-focus);--focus-ring:0px 0px 0px 2px rgba(62, 132, 229, 0.2);--focus-ring-error:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus);--color-disabled:var(--base-text-disabled);--box-bg-color-disabled:var(--anchor-box-bg-disabled-color, var(--control-bg-weak-disabled));--border-color-disabled:var(--control-border-disabled);--height-small:var(--hbr-control-height-sm);--height-medium:var(--hbr-control-height-md);--height-large:var(--hbr-control-height-lg);--icon-color:var(--interact-icon-weak-default);--icon-color-hover:var(--interact-icon-weak-hover);--font-size-small:var(--hbr-font-size-xs);--font-size-medium:var(--hbr-font-size-sm);--font-size-large:var(--hbr-font-size-md);--spacing-small:var(--hbr-control-spacing-xs);--spacing-medium:var(--hbr-control-spacing-sm);--spacing-large:var(--hbr-control-spacing-lg);--spacing-icon-top:14px;--border-radius-small:var(--hbr-control-border-radius-sm);--border-radius-medium:var(--hbr-control-border-radius-md);--border-radius-large:var(--hbr-control-border-radius-lg);--popup-z-index:var(--hbr-z-index-dropdown);--combobox-border-color-danger:var(--negative-border-medium-active);--tag-search-placeholder-color:var(--base-text-weak-default);--placeholder-color:var(--base-text-weak-default);--count-bg-color:var(--interact-text-default);--count-text-color:var(--base-text-default);--select-tag-line-height-small:20px;--select-tag-line-height-medium:26px;--select-tag-line-height-large:28px;--select-tag-line-gap-small:2px;--select-tag-line-gap-medium:var(--hbr-spacing-2xs);--select-tag-line-gap-large:4px;box-sizing:border-box !important;--min-width:none;--max-width:none;min-width:var(--min-width);max-width:var(--max-width)}:host([disabled]) ::placeholder{color:var(--color-disabled)}.select{position:relative;vertical-align:middle}.select::part(popup){z-index:var(--popup-z-index)}.select[data-current-placement^=top]::part(popup){transform-origin:bottom}.select[data-current-placement^=bottom]::part(popup){transform-origin:top}.select--error:not(.select--disabled) .select__combobox{border-color:var(--combobox-border-color-danger);box-shadow:0 0 0 var(--hbr-control-border-width) var(--negative-bg-weak-focus)}.form-control__help-text.select__hide-helpText,.form-control__rear.select__hide-rear,.form-control__help-text.select__hide-helpText ::slotted(*),.form-control__rear.select__hide-rear ::slotted(*){display:none}.select__combobox{box-sizing:border-box;flex:1 1 0%;display:flex;gap:var(--hbr-spacing-3xs);width:100%;position:relative;align-items:center;justify-content:start;font-family:var(--box-font-family);font-weight:var(--box-font-weight);letter-spacing:var(--hbr-control-letter-spacing);vertical-align:middle;overflow:hidden;cursor:pointer;transition:var(--hbr-transition-fast) color, var(--hbr-transition-fast) border, var(--hbr-transition-fast) box-shadow, var(--hbr-transition-fast) background-color;background-color:var(--box-bg-color)}.select--readonly .select__combobox{cursor:default}.select__combobox--tag-lines{overflow-x:hidden;overflow-y:auto}.select__combobox--tag-lines>.select__tags{align-self:flex-start}.select__display-input,.select__search-input{position:relative;width:100%;font:inherit;border:none;background:none;color:var(--color);cursor:inherit;overflow:hidden;padding:0;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.select:not(.select--disabled) .select__display-input.span.placeholder,.select:not(.select--disabled) .select--placeholder-visible:not(.select--uncontrolled):hover .select__display-input.span.placeholder{color:var(--placeholder-color)}.select-anchor__tag-displayInput>input.select__display-input,.select--tag.select--searchable.select--placeholder-visible:hover .select-anchor__tag-displayInput>input.select__display-input{color:var(--tag-search-placeholder-color)}.select__search-input::-webkit-search-decoration,.select__search-input::-webkit-search-cancel-button,.select__search-input::-webkit-search-results-button,.select__search-input::-webkit-search-results-decoration{-webkit-appearance:var(--search-input-appearance);-moz-appearance:var(--search-input-appearance);appearance:var(--search-input-appearance)}.select--disabled .select__display-input{color:var(--color-disabled)}.select__display-input.hideInput-tag{width:0px;min-width:0px}.select:not(.select--disabled):not(.select--readonly):not(.select--error):hover .select__combobox{background-color:var(--box-bg-color-hover, var(--control-bg-weak-default));border-color:var(--border-color-hover, var(--control-border-hover))}.select:not(.select--disabled):not(.select--readonly):not(.select--error):hover:not(.select--placeholder-visible) .select__display-input{color:var(--hover-color, var(--selected-text-hover, var(--base-text-default)))}.select__display-input:focus,.select__search-input:focus{outline:none}.select--multiple:not(.select--placeholder-visible) .select__display-input{position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;opacity:0}.select__value-input{position:absolute;top:0;left:0;width:100%;height:100%;padding:0;margin:0;opacity:0;z-index:-1}.select__tags,.select__tags.select__tags-custom ::slotted(*),.select__multiple{display:flex;flex:1;align-items:center;flex-wrap:wrap;width:calc(100% - 56px);line-height:var(--hbr-font-line-height-normal)}.select__count{background-color:var(--count-bg-color);color:var(--count-text-color);display:flex;align-items:center;margin-right:var(--hbr-spacing-xs);border-radius:var(--count-border-radius, var(--hbr-border-radius-sm));padding-left:var(--hbr-spacing-xs);padding-right:var(--hbr-spacing-xs)}.select__count--custom{padding-inline:0}.select__count--custom ::slotted([slot=counter]){display:flex;align-items:center;padding-inline:var(--hbr-spacing-xs)}.select--disabled .select__count{opacity:0.5}.select__tags::slotted(hbr-tag){cursor:pointer !important}.select-anchor__tag-searchInput{display:flex;flex:1 0 100%;min-width:0;width:100%}.select-anchor__tag-searchInput>.select__search-input{flex:1 1 auto;min-width:0;width:100%}.select--disabled .select__tags,.select--disabled .select__tags::slotted(hbr-tag){cursor:not-allowed !important}.select--standard .select__combobox{background-color:var(--box-bg-color);border:solid var(--border-width) var(--border-color)}.select--standard.select--disabled .select__combobox{background-color:var(--box-bg-color-disabled);border-color:var(--border-color-disabled);color:var(--color-disabled);outline:none}.select--standard.select--readonly .select__combobox{background-color:var(--base-bg-disabled);border-color:var(--border-color-disabled);color:var(--base-text-default);outline:none}.select--disabled hbr-tag::part(base){opacity:0.5}.select__combobox.truncate{max-width:var(--truncate-max-width, 600px)}.select--standard.select--disabled{cursor:not-allowed}.select--standard.select--disabled *{pointer-events:none}.select--standard:not(.select--disabled):not(.select--readonly).select--open .select__combobox,.select--standard:not(.select--disabled):not(.select--readonly).select--focused .select__combobox{background-color:var(--box-bg-color-focus, var(--control-bg-weak-default))}.select--standard:not(.select--disabled):not(.select--error).select--open .select__combobox,.select--standard:not(.select--disabled):not(.select--error).select--focused .select__combobox{border-color:var(--border-color-focus);box-shadow:var(--hbr-focus-ring);outline:var(--hbr-focus-outline);outline-offset:var(--hbr-focus-ring-width)}.select--filled .select__combobox{border:none;background-color:var(--base-bg-default);color:var(--base-text-default)}.select--filled:hover:not(.select--disabled):not(.select--readonly) .select__combobox{background-color:var(--control-bg-medium-hover)}.select--filled.select--disabled .select__combobox{background-color:var(--control-bg-weak-disabled);opacity:0.5;cursor:not-allowed}.select--filled:not(.select--disabled):not(.select--readonly).select--open .select__combobox,.select--filled:not(.select--disabled):not(.select--readonly).select--focused .select__combobox{background-color:var(--base-bg-disabled);outline:var(--hbr-focus-ring)}.select--small .select__combobox{border-radius:var(--border-radius-small);font-size:var(--font-size-small);min-height:var(--height-small);max-height:max(var(--height-small), var(--select-tag-lines) * var(--select-tag-line-height-small) + max(var(--select-tag-lines) - 1, 0) * var(--select-tag-line-gap-small));padding-block:0;padding-inline:var(--spacing-small)}.select--medium .select__prefix ::slotted(*){margin-right:var(--hbr-spacing-2xs)}.select--small .select__prefix ::slotted(*){margin-right:var(--hbr-spacing-2xs)}.select--small.select--multiple:not(.select--placeholder-visible) .select__combobox{padding-block:2px}.select--small .select__tags{gap:2px}.select--medium .select__combobox{border-radius:var(--border-radius-medium);font-size:var(--font-size-medium);min-height:var(--height-medium);max-height:max(var(--height-medium), var(--select-tag-lines) * var(--select-tag-line-height-medium) + 4px + 2 * var(--border-width) + max(var(--select-tag-lines) - 1, 0) * var(--select-tag-line-gap-medium));padding-block:0;padding-inline:var(--spacing-medium)}.select--medium.select--tag.select--has-tags .select__combobox{padding-block:2px}.select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox{padding-block:3px}.select--medium .select__tags,.select--medium .select__tags.select__tags-custom ::slotted(*){gap:var(--hbr-spacing-2xs)}.select--large .select__combobox{border-radius:var(--border-radius-large);font-size:var(--font-size-large);min-height:var(--height-large);max-height:max(var(--height-large), var(--select-tag-lines) * var(--select-tag-line-height-large) + max(var(--select-tag-lines) - 1, 0) * var(--select-tag-line-gap-large));padding-block:0}.select--large.select--multiple:not(.select--placeholder-visible) .select__combobox{padding-block:4px}.select--large .select__tags{gap:4px}.select--pill.select--small .select__combobox{border-radius:var(--height-small)}.select--pill.select--medium .select__combobox{border-radius:var(--height-medium)}.select--pill.select--large .select__combobox{border-radius:var(--height-large)}.select__prefix{flex:0;display:inline-flex;align-items:center;color:var(--placeholder-color)}.select--disabled .select__prefix{color:unset}.select--readonly .select__prefix{color:var(--control-icon-weak-default)}.select__clear{display:inline-flex;align-items:center;font-size:var(--hbr-font-size-md);color:var(--base-text-medium-default);border:none;background:none}.select__clear:focus-visible{outline:none}.select__clear:focus-visible hbr-icon{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-circle)}.select__clear{transition:var(--hbr-transition-fast) color;cursor:pointer}.select__clear:hover{color:var(--base-text-medium-default)}.select__clear:hover{color:var(--icon-color-hover)}.select__clear:focus{outline:none}.select__expand-icon{flex:0 0 auto;display:flex;align-items:center;transition:var(--hbr-transition-medium) rotate ease;rotate:0;color:var(--icon-color)}.select--autocomplete .select__expand-icon{display:none}.select__expand-icon:hover{color:var(--icon-color-hover)}.select--open .select__expand-icon{rotate:-180deg}.select-anchor__tag{max-width:100%}.select-anchor__tag::part(base){white-space:initial;height:auto}.select-anchor__tag[size=medium]::part(base){min-height:26px}.select-anchor__tag[size=small]::part(base){min-height:20px}.select-anchor__tag::part(content){display:block;overflow-wrap:break-word}.select-anchor__tag-text-slot{word-wrap:break-word;max-width:100%}.select-anchor__tag-text-slot::after{content:\"\";padding:0}.select-anchor__tag-displayInput.select-anchor__tag-has-value{display:none}:host-context([data-theme=onecd]){--border-width:var(--onecd-border-width-default, 1px)}";
const HbrSelectAnchorStyle0 = selectAnchorCss;

const SelectAnchor = /*@__PURE__*/ proxyCustomElement(class SelectAnchor extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTruncate = createEvent(this, "hbr-truncate", 7);
        this.defaultI18n = {
            clearEntry: "Clear entry",
        };
        this.setTagsRef = (elm) => {
            this.tagsEl = elm;
        };
        this.setLocalComboboxRef = (elm) => {
            this.comboboxRef = elm;
            if (typeof this.setComboboxRef === "function") {
                this.setComboboxRef(elm);
            }
        };
        this.searchInputElement = (editPlaceholder, describedId, prop) => {
            return (h("input", Object.assign({ part: "search-input", class: "select__search-input", type: "search", placeholder: editPlaceholder, disabled: this.disabled, autocomplete: "off", spellcheck: "false", autocapitalize: "off", readonly: false, "aria-controls": this.listboxId, "aria-expanded": this.open ? "true" : "false", "aria-haspopup": "listbox", "aria-disabled": this.disabled ? "true" : "false", "aria-readonly": this.readonly ? "true" : "false", "aria-describedby": describedId, role: "combobox", tabIndex: 0, onFocus: this.handleFocus, onBlur: this.handleBlur, onInput: this.handleSearch, ref: this.setSearchInputRef, id: this.inputId, onKeyUp: this.handleKeyUp, value: this.autocomplete ? this.value : null }, prop)));
        };
        this.readonlyInputElement = (readonlyValue, describedId, prop) => {
            if (this.variant === "single" && !this.uncontrolled) {
                return (h("span", Object.assign({ part: "display-input", class: `select__display-input span ${!this.value ? "placeholder" : ""}`, "aria-controls": this.listboxId, "aria-expanded": this.open ? "true" : "false", "aria-haspopup": "listbox", "aria-disabled": this.disabled ? "true" : "false", "aria-readonly": this.readonly ? "true" : "false", "aria-describedby": describedId, role: "combobox", tabIndex: 0, onFocus: this.handleFocus, onBlur: this.handleBlur, ref: this.setDisplayInputRef, id: this.inputId, onKeyUp: this.handleKeyUp }, prop), this.value ? readonlyValue : this.placeholder));
            }
            return (h("input", Object.assign({ part: "display-input", class: `select__display-input input${this.hideInput ? " hideInput-tag" : ""}`, type: "text", placeholder: this.placeholder, disabled: this.disabled, value: readonlyValue, autocomplete: "off", spellcheck: "false", autocapitalize: "off", readonly: true, "aria-controls": this.listboxId, "aria-expanded": this.open ? "true" : "false", "aria-haspopup": "listbox", "aria-disabled": this.disabled ? "true" : "false", "aria-readonly": this.readonly ? "true" : "false", "aria-describedby": describedId, role: "combobox", tabIndex: 0, onFocus: this.handleFocus, onBlur: this.handleBlur, ref: this.setDisplayInputRef, id: this.inputId, onKeyUp: this.handleKeyUp }, prop)));
        };
        this.selectedTagsInDisplay = (tagRemove, obj) => {
            var _a, _b;
            return (h("div", { part: "tags", class: {
                    select__tags: true,
                    "select__tags-custom": this.custom,
                }, ref: this.setTagsRef }, this.custom ? (h("slot", { name: "tags" })) : ((_a = this.selectedOptions) === null || _a === void 0 ? void 0 : _a.map((option, index) => {
                var _a;
                const prefixElement = option.querySelector('[slot="prefix"]');
                const tagLabel = this.editable ? this.tagLabels[index] : "";
                return (h("hbr-tag", { part: "tag", exportparts: "\n\t\t\t\t\t\t\t\tbase:tag__base,\n\t\t\t\t\t\t\t\tprefix: tag__prefix,\n\t\t\t\t\t\t\t\tcontent:tag__content,\n\t\t\t\t\t\t\t\tremove-button:tag__remove-button,\n\t\t\t\t\t\t\t\tremove-button__base:tag__remove-button__base\n\t\t\t\t\t\t\t", pill: this.pill, size: this.size, removable: !this.readonly ? tagRemove : undefined, "onHbr-remove": this.handleTagRemoveLocal.bind(this, option), class: "select-anchor__tag", wrap: this.tagWrap }, (prefixElement === null || prefixElement === void 0 ? void 0 : prefixElement.tagName.toLowerCase()) === "hbr-icon" ? (h("hbr-icon", { name: prefixElement.name, slot: "prefix" })) : (""), h("span", { class: "select-anchor__tag-text-slot" }, tagLabel ||
                    option.display ||
                    option.textContent ||
                    ((_a = option.querySelector("hbr-highlight")) === null || _a === void 0 ? void 0 : _a.text))));
            })), this.uncontrolled && (h("span", { class: {
                    "select-anchor__tag-searchInput": this.editable,
                    "select-anchor__tag-displayInput": !this.editable,
                    "select-anchor__tag-has-value": ((_b = this.value) === null || _b === void 0 ? void 0 : _b.length) > 0,
                } }, this.editable
                ? this.searchInputElement(obj.editPlaceholder, obj.describedId, obj.prop)
                : this.readonlyInputElement(obj.editPlaceholder, obj.describedId, obj.prop)))));
        };
        this.name = undefined;
        this.value = "";
        this.variant = "single";
        this.size = "medium";
        this.placeholder = undefined;
        this.multiple = false;
        this.disabled = false;
        this.clearable = false;
        this.open = false;
        this.hoist = false;
        this.filled = false;
        this.pill = false;
        this.label = "";
        this.arialabel = undefined;
        this.displayLabel = "";
        this.selectedOptions = [];
        this.readonly = false;
        this.placement = "bottom";
        this.helpText = "";
        this.required = false;
        this.error = false;
        this.inputId = undefined;
        this.labelId = undefined;
        this.listboxId = undefined;
        this.helpTextId = undefined;
        this.cssClass = undefined;
        this.hasLabel = undefined;
        this.hasLabelSlot = undefined;
        this.hasLabelInfoSlot = undefined;
        this.hasHelpText = undefined;
        this.hasHelpTextSlot = undefined;
        this.hasFrontSlot = undefined;
        this.hasRearSlot = undefined;
        this.hasClearIcon = undefined;
        this.showPrefix = undefined;
        this.hideInput = undefined;
        this.hasCounterSlot = undefined;
        this.handleLabelClick = undefined;
        this.handleHelpSlotChange = undefined;
        this.handleComboboxKeyDown = undefined;
        this.handleComboboxMouseDown = undefined;
        this.handleFocus = undefined;
        this.handleKeyUp = undefined;
        this.handleBlur = undefined;
        this.handleSearch = undefined;
        this.handleInvalid = undefined;
        this.handleClearMouseDown = undefined;
        this.handleClearClick = undefined;
        this.handleTagRemove = undefined;
        this.toggleOptionSelection = undefined;
        this.setDisplayInputRef = undefined;
        this.setSearchInputRef = undefined;
        this.setComboboxRef = undefined;
        this.setValueInputRef = undefined;
        this.focusFunc = undefined;
        this.cssClasses = {};
        this.truncate = false;
        this.searchable = undefined;
        this.custom = undefined;
        this.tooltip = undefined;
        this.autocomplete = undefined;
        this.autofocus = undefined;
        this.uncontrolled = undefined;
        this.search = undefined;
        this.editable = undefined;
        this.tagWrap = undefined;
        this.lines = undefined;
        this.tagLabels = undefined;
        this.i18n = undefined;
        this.eventTrigger = undefined;
        this.displayInput = undefined;
        this.measuredTagMaxHeight = undefined;
    }
    componentDidRender() {
        var _a, _b;
        this.scheduleMeasuredTagMaxHeightSync();
        const isTruncated = ((_a = this.displayInput) === null || _a === void 0 ? void 0 : _a.scrollWidth) > ((_b = this.displayInput) === null || _b === void 0 ? void 0 : _b.clientWidth);
        if (isTruncated) {
            this.hbrTruncate.emit({
                truncated: true,
                content: this.displayLabel ||
                    (typeof this.value === "string" ? this.value : ""),
            });
        }
        else {
            this.hbrTruncate.emit({
                truncated: false,
                content: "",
            });
        }
    }
    componentDidLoad() {
        if (!this.hasLinesLimit())
            return;
        this.resizeObserver = new ResizeObserver(() => {
            this.scheduleMeasuredTagMaxHeightSync();
        });
        if (this.comboboxRef)
            this.resizeObserver.observe(this.comboboxRef);
        if (this.tagsEl)
            this.resizeObserver.observe(this.tagsEl);
    }
    disconnectedCallback() {
        var _a;
        if (this.pendingMeasurementFrame) {
            cancelAnimationFrame(this.pendingMeasurementFrame);
            this.pendingMeasurementFrame = undefined;
        }
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    handleTagRemoveLocal(option, event) {
        this.handleTagRemove(option, event);
    }
    hasLinesLimit() {
        return this.variant === "tag" && !!this.lines && this.lines >= 1;
    }
    scheduleMeasuredTagMaxHeightSync() {
        if (!this.hasLinesLimit())
            return;
        if (this.pendingMeasurementFrame !== undefined) {
            cancelAnimationFrame(this.pendingMeasurementFrame);
        }
        this.pendingMeasurementFrame = requestAnimationFrame(() => this.syncMeasuredTagMaxHeight());
    }
    syncMeasuredTagMaxHeight() {
        var _a;
        const { comboboxRef, tagsEl, lines } = this;
        if (!comboboxRef || !tagsEl)
            return;
        const saved = comboboxRef.style.maxHeight;
        comboboxRef.style.maxHeight = "none";
        const slot = tagsEl.querySelector('slot[name="tags"]');
        const items = (slot ? slot.assignedElements({ flatten: true }) : [...tagsEl.children]).filter((el) => el instanceof HTMLElement && el.offsetParent !== null);
        const tagsTop = tagsEl.getBoundingClientRect().top;
        const rowBottoms = new Map();
        for (const item of items) {
            const rect = item.getBoundingClientRect();
            const rowTop = Math.round(rect.top - tagsTop);
            rowBottoms.set(rowTop, Math.max((_a = rowBottoms.get(rowTop)) !== null && _a !== void 0 ? _a : 0, rect.bottom - tagsTop));
        }
        const visibleRows = [...rowBottoms.entries()]
            .sort(([a], [b]) => a - b)
            .slice(0, lines);
        comboboxRef.style.maxHeight = saved;
        if (!visibleRows.length) {
            this.measuredTagMaxHeight = undefined;
            return;
        }
        const visibleBottom = Math.max(...visibleRows.map(([, b]) => b));
        const { borderTopWidth, borderBottomWidth } = getComputedStyle(comboboxRef);
        const border = parseFloat(borderTopWidth || "0") + parseFloat(borderBottomWidth || "0");
        const next = `${Math.ceil(visibleBottom + comboboxRef.scrollHeight - tagsEl.scrollHeight + border)}px`;
        if (this.measuredTagMaxHeight !== next)
            this.measuredTagMaxHeight = next;
    }
    getLineStyle() {
        if (!this.hasLinesLimit())
            return undefined;
        return Object.assign({ "--select-tag-lines": `${this.lines}` }, (this.measuredTagMaxHeight
            ? { maxHeight: this.measuredTagMaxHeight }
            : {}));
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g;
        const prop = {};
        const tagRemove = !this.readonly;
        const multiSelected = this.variant !== "single" && !!((_a = this.value) === null || _a === void 0 ? void 0 : _a.length);
        const hasLabel = this.label || this.hasLabelSlot;
        const fallbackLabel = this.arialabel || this.placeholder;
        if (multiSelected) {
            if (!this.searchable) {
                const baseLabel = this.label || fallbackLabel;
                prop["aria-label"] = baseLabel
                    ? `${(_b = this.value) === null || _b === void 0 ? void 0 : _b.length} ${baseLabel} selected`
                    : `${(_c = this.value) === null || _c === void 0 ? void 0 : _c.length} selected`;
            }
            else if (hasLabel) {
                prop["aria-labelledby"] = this.labelId;
            }
            else if (fallbackLabel) {
                prop["aria-label"] = fallbackLabel;
            }
        }
        else {
            if (hasLabel) {
                prop["aria-labelledby"] = this.labelId;
            }
            else if (fallbackLabel) {
                prop["aria-label"] = fallbackLabel;
            }
        }
        const describedHelpId = this.helpTextId ? this.helpTextId : "";
        const tooltipId = this.tooltip ? `${this.inputId}-tooltip` : "";
        const describedId = describedHelpId || tooltipId
            ? `${describedHelpId} ${tooltipId}`
            : undefined;
        let editPlaceholder = this.placeholder;
        if (this.value &&
            typeof this.value === "string" &&
            typeof this.placeholder === "string" &&
            this.searchable) {
            editPlaceholder = this.displayLabel || this.value;
        }
        let readonlyValue = this.displayLabel;
        if (this.searchable && ((_d = this.value) === null || _d === void 0 ? void 0 : _d.length)) {
            if (this.variant === "multiple") {
                readonlyValue = this.label || this.placeholder;
            }
            else if (typeof this.value === "string") {
                readonlyValue = this.displayLabel || this.value;
            }
        }
        const uncontrolledTag = this.variant === "tag" && this.uncontrolled;
        const customSystemIcons = (_e = getBootstrapConfig()) === null || _e === void 0 ? void 0 : _e.systemIcons;
        const triggeredByKeyboard = this.eventTrigger && this.eventTrigger !== "mouse";
        const shouldHideClearButtonForKeyboardSearch = this.searchable && this.editable && triggeredByKeyboard;
        const lineStyle = this.getLineStyle();
        // should keep the search string on display while pressing arrow down on the options
        if (this.searchable && triggeredByKeyboard) {
            const displayInputValue = this.displayInput &&
                this.displayInput instanceof HTMLInputElement &&
                this.displayInput.value;
            if (displayInputValue) {
                readonlyValue = displayInputValue;
            }
        }
        return (h(FormControl, { key: '94e870b4ad09cbb92b61e6bdd8c6b52e3db92c45', inputId: this.inputId, label: this.label, labelId: this.labelId, hasLabelSlot: this.hasLabelSlot, hasLabelInfoSlot: this.hasLabelInfoSlot, helpTextId: this.helpTextId, helpText: this.helpText, hasHelpTextSlot: this.hasHelpTextSlot, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, size: this.size, onLabelClick: this.handleLabelClick, hasValue: ((_f = this.value) === null || _f === void 0 ? void 0 : _f.length) > 0, isDisabled: this.disabled, isRequired: this.required, hasError: this.error, cssClasses: this.cssClasses, source: "select", tooltip: this.tooltip, tooltipId: this.tooltip ? `${this.inputId}-tooltip` : undefined }, h("div", { key: 'f669c2f89eddb6830af15b998f8f9f1d27867409', part: "combobox", class: `select__combobox${this.truncate ? " truncate" : ""}${lineStyle ? " select__combobox--tag-lines" : ""}`, onKeyDown: this.handleComboboxKeyDown, onMouseDown: this.handleComboboxMouseDown, ref: this.setLocalComboboxRef, style: lineStyle, "data-testid": "combobox" }, this.showPrefix && (h("span", { part: "prefix", class: "select__prefix" }, h("slot", { name: "prefix" }))), this.variant === "multiple" && this.value.length ? (this.searchable ? (h("span", { class: "select__multiple" }, h("span", { part: "counter", class: {
                select__count: true,
                "select__count--custom": this.hasCounterSlot,
            } }, !this.hasCounterSlot ? ( // show number tag without tooltip as default
        this.value.length) : (h("slot", { name: "counter" }))), h("slot", { name: "counter-label" }))) : !this.hasCounterSlot ? ( // show number tag without tooltip as default
        h("span", { class: "select__multiple" }, h("span", { part: "counter", class: "select__count" }, this.value.length), !this.searchable ? this.label || this.placeholder : "") // To displaying a tooltip, we let users add number tag too
        ) : (h("span", { class: "select__multiple" }, h("span", { part: "counter", class: "select__count select__count--custom" }, h("slot", { name: "counter" })), h("slot", { name: "counter-label" })))) : (""), !uncontrolledTag &&
            (!this.editable
                ? this.readonlyInputElement(readonlyValue, describedId, prop)
                : this.searchInputElement(editPlaceholder, describedId, prop)), this.variant === "tag"
            ? this.selectedTagsInDisplay(tagRemove, {
                editPlaceholder,
                describedId,
                prop,
            })
            : "", ((this.autocomplete && this.value) ||
            !shouldHideClearButtonForKeyboardSearch) &&
            this.hasClearIcon /** do not show clear button while searching */ ? (h("button", { part: "clear-button", class: "select__clear", type: "button", "aria-label": ((_g = this.i18n) === null || _g === void 0 ? void 0 : _g.clearEntry) || this.defaultI18n.clearEntry, onMouseDown: this.handleClearMouseDown, onClick: this.handleClearClick, "data-testid": "clear-button" }, h("slot", { name: "clear-icon" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["x-circle"]) || xCircle, size: this.size === "small" ? "14px" : "16px" })))) : (""), h("span", { key: '0cb4d6cf45b927e678ce986fccdf2ba849eecf4a', part: "expand-icon", class: "select__expand-icon" }, h("slot", { key: '4a795b0ac07e1eaa624e893ca497c4258920016a', name: "expand-icon" }, h("hbr-icon", { key: 'bb1f6094a09abdc96382f8c33d54fdc0b7f5de3b', class: this.open
                ? "select__icon select__icon__flipped"
                : "select__icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown }))))));
    }
    static get style() { return HbrSelectAnchorStyle0; }
}, [1, "hbr-select-anchor", {
        "name": [1],
        "value": [1025],
        "variant": [513],
        "size": [513],
        "placeholder": [1],
        "multiple": [516],
        "disabled": [516],
        "clearable": [4],
        "open": [1540],
        "hoist": [4],
        "filled": [516],
        "pill": [516],
        "label": [1],
        "arialabel": [1],
        "displayLabel": [1, "display-label"],
        "selectedOptions": [16],
        "readonly": [4],
        "placement": [513],
        "helpText": [1, "help-text"],
        "required": [516],
        "error": [4],
        "inputId": [1, "input-id"],
        "labelId": [1, "label-id"],
        "listboxId": [1, "listbox-id"],
        "helpTextId": [1, "help-text-id"],
        "cssClass": [16],
        "hasLabel": [4, "has-label"],
        "hasLabelSlot": [4, "has-label-slot"],
        "hasLabelInfoSlot": [4, "has-label-info-slot"],
        "hasHelpText": [4, "has-help-text"],
        "hasHelpTextSlot": [4, "has-help-text-slot"],
        "hasFrontSlot": [4, "has-front-slot"],
        "hasRearSlot": [4, "has-rear-slot"],
        "hasClearIcon": [4, "has-clear-icon"],
        "showPrefix": [4, "show-prefix"],
        "hideInput": [4, "hide-input"],
        "hasCounterSlot": [4, "has-counter-slot"],
        "handleLabelClick": [16],
        "handleHelpSlotChange": [16],
        "handleComboboxKeyDown": [16],
        "handleComboboxMouseDown": [16],
        "handleFocus": [16],
        "handleKeyUp": [16],
        "handleBlur": [16],
        "handleSearch": [16],
        "handleInvalid": [16],
        "handleClearMouseDown": [16],
        "handleClearClick": [16],
        "handleTagRemove": [16],
        "toggleOptionSelection": [16],
        "setDisplayInputRef": [16],
        "setSearchInputRef": [16],
        "setComboboxRef": [16],
        "setValueInputRef": [16],
        "focusFunc": [16],
        "cssClasses": [16],
        "truncate": [4],
        "searchable": [4],
        "custom": [4],
        "tooltip": [1],
        "autocomplete": [4],
        "autofocus": [4],
        "uncontrolled": [4],
        "search": [1],
        "editable": [4],
        "tagWrap": [4, "tag-wrap"],
        "lines": [514],
        "tagLabels": [16],
        "i18n": [16],
        "eventTrigger": [1, "event-trigger"],
        "displayInput": [16],
        "measuredTagMaxHeight": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-select-anchor", "hbr-icon", "hbr-icon-button", "hbr-tag", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-select-anchor":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SelectAnchor);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-tag":
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

export { SelectAnchor as S, defineCustomElement as d };

