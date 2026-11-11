import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { F as FormControlGroup } from './form-control-group.js';
import { h as hasSlot } from './slot.js';

const checkboxGroupCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--label-margin:0;--label-font-size:var(--hbr-font-size-sm);--label-font-weight:var(--hbr-control-font-weight-label);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-margin:var(--hbr-spacing-sm) 0 0 0;--help-text-font-size:var(--hbr-font-size-sm);--help-text-font-weight:var(--hbr-control-font-weight);--help-text-color:var(--base-text-medium-default);--asterisk-color:var(--negative-text-default);--asterisk-margin:0 2px;--asterisk-font-weight:600;--help-text-align:var(--help-text-align-text, end);--width:100%;--display:block;display:var(--display)}.form-control-group{border:none;padding:0;margin:0;width:var(--width);display:var(--display)}.form-control-group__label-legend{font-family:var(--hbr-font-body);font-size:var(--label-font-size);font-weight:var(--label-font-weight);color:var(--label-color);padding:0px;white-space:normal;display:flex;flex-direction:row;margin:var(--label-margin)}.form-control-group--hide-fieldset .form-control-group__label-legend,.form-control-group--hide-label .form-control-group__label-legend{clip:rect(0 0 0 0);clip-path:inset(50%);height:0px;position:absolute;width:0px}.form-control-group__label-asterisk{color:var(--asterisk-color);margin:var(--asterisk-margin);font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display)}.form-control-group--has-rear .form-control__rear{padding-bottom:var(--hbr-spacing-sm)}.form-control-group--has-rear .form-control__rear{padding-top:var(--hbr-spacing-xs)}.form-control-group__children{display:flex}.form-control-group__children.form-control-group__direction-row{flex-direction:row;flex-wrap:wrap}.form-control-group__children.form-control-group__direction-column{flex-direction:column}.form-control-group__help-text{margin:var(--help-text-margin);font-size:var(--help-text-font-size);font-weight:var(--help-text-font-weight);color:var(--help-text-color);text-align:var(--help-text-align)}.form-control-group--label.form-control-group--xsmall .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-xs)}.form-control-group--label.form-control-group--small .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-sm)}.form-control-group--label.form-control-group--medium .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-md)}.form-control-group--label.form-control-group--large .form-control-group__label-legend{font-size:var(--hbr-control-font-size-label-lg)}.form-control-group--has-help-text.form-control-group--xsmall .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-xs)}.form-control-group--has-help-text.form-control-group--small .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-sm)}.form-control-group--has-help-text.form-control-group--medium .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-md)}.form-control-group--has-help-text.form-control-group--large .form-control-group__help-text{font-size:var(--hbr-control-font-size-label-lg)}.form-control-group--error.form-control-group--label .form-control-group__label-legend,.form-control-group--error.form-control-group--has-help-text .form-control-group__help-text{color:var(--label-error-color)}.form-control-group--disabled.form-control-group--label .form-control-group__label-legend{color:var(--base-text-disabled)}:host{--checkbox-margin-row:var(--hbr-spacing-sm) var(--hbr-spacing-lg) 0 0;--checkbox-margin-row-small:var(--hbr-spacing-xs) var(--hbr-spacing-md) 0 0;--checkbox-margin-column:var(--hbr-spacing-sm) 0 0 0;--checkbox-margin-column-small:var(--hbr-spacing-xs) 0 0 0;--display:block}.form-control-group__direction-row ::slotted(hbr-checkbox){margin:var(--checkbox-margin-row)}fieldset:not(.form-control-group--label) div.form-control-group__direction-column ::slotted(hbr-checkbox),fieldset:not(.form-control-group--hide-fieldset) div.form-control-group__direction-column ::slotted(hbr-checkbox){margin:var(--checkbox-margin-column)}fieldset.form-control-group--label div.form-control-group__direction-column ::slotted(hbr-checkbox:not(:first-child)),fieldset.form-control-group--hide-fieldset div.form-control-group__direction-column ::slotted(hbr-checkbox:not(:first-child)){margin:var(--checkbox-margin-column)}";
const HbrCheckboxGroupStyle0 = checkboxGroupCss;

let id = 0;
const CheckboxGroup = /*@__PURE__*/ proxyCustomElement(class CheckboxGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.labelId = `checkbox-group-label-${++id}`;
        this.hasLabel = false;
        this.hasHelpTextSlot = false;
        this.hasFrontSlot = false;
        this.hasRearSlot = false;
        this.noFieldset = false;
        this.label = "";
        this.helpText = "";
        this.helpTextId = "";
        this.required = undefined;
        this.error = undefined;
        this.disabled = undefined;
        this.size = "medium";
        this.direction = "row";
    }
    handleLabelChange() {
        this.handleSlotChange();
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    disconnectedCallback() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
    handleSlotChange() {
        this.hasLabel = hasSlot(this.host, "label");
        this.hasHelpTextSlot = hasSlot(this.host, "help-text");
        this.hasFrontSlot = hasSlot(this.host, "front");
        this.hasRearSlot = hasSlot(this.host, "rear");
    }
    render() {
        return (h(FormControlGroup, { key: 'ea65ae8597316c1a3726853f1c81cb5a4bfeae6a', hasHelpTextSlot: this.hasHelpTextSlot, label: this.label, labelId: this.labelId, hasLabelSlot: this.hasLabel, hasFrontSlot: this.hasFrontSlot, hasRearSlot: this.hasRearSlot, hasError: this.error, size: this.size, direction: this.direction, helpTextId: this.helpTextId, helpText: this.helpText, isRequired: this.required, isDisabled: this.disabled, noFieldset: this.noFieldset, role: "group" }, h("slot", { key: 'c69625e7dbea87632344394eeb36249d0f1f77ca' })));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get watchers() { return {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"]
    }; }
    static get style() { return HbrCheckboxGroupStyle0; }
}, [65, "hbr-checkbox-group", {
        "noFieldset": [4, "no-fieldset"],
        "label": [1],
        "helpText": [1, "help-text"],
        "helpTextId": [1, "help-text-id"],
        "required": [516],
        "error": [516],
        "disabled": [516],
        "size": [513],
        "direction": [513],
        "hasLabel": [32],
        "hasHelpTextSlot": [32],
        "hasFrontSlot": [32],
        "hasRearSlot": [32]
    }, undefined, {
        "helpText": ["handleLabelChange"],
        "label": ["handleLabelChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-checkbox-group"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-checkbox-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, CheckboxGroup);
            }
            break;
    } });
}

const HbrCheckboxGroup = CheckboxGroup;
const defineCustomElement = defineCustomElement$1;

export { HbrCheckboxGroup, defineCustomElement };

