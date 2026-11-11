import { h } from '@stencil/core/internal/client';

const FormControlGroup = (props, children) => {
    const hasLabel = !!props.label || props.hasLabelSlot;
    const hasHelpText = !!props.helpText || props.hasHelpTextSlot;
    const helpId = props.helpTextId || "help-text";
    const groupLabelId = props.labelId;
    const hasFront = props.hasFrontSlot;
    const hasRear = props.hasRearSlot;
    return (h("fieldset", { part: "base", class: {
            "form-control-group": true,
            "form-control-group--label": hasLabel,
            "form-control-group--hide-label": !hasLabel,
            "form-control-group--hide-fieldset": props.noFieldset,
            "form-control-group--error": props.hasError,
            "form-control-group--xsmall": props.size === "xsmall",
            "form-control-group--small": props.size === "small",
            "form-control-group--medium": props.size === "medium",
            "form-control-group--large": props.size === "large",
            "form-control-group--has-help-text": hasHelpText,
            "form-control-group--disabled": props.isDisabled,
            "form-control-group--has-front": hasFront,
            "form-control-group--has-rear": hasRear,
        }, "aria-required": props.isRequired ? "true" : "false", "aria-labelledby": groupLabelId, "aria-describedby": helpId, role: props.role },
        h("div", { part: "label", class: "form-control-group__label", "aria-hidden": hasLabel ? "false" : "true" },
            h("legend", { id: groupLabelId, part: "legend", class: "form-control-group__label-legend" },
                h("slot", { name: "label" }, props.label),
                props.isRequired && (h("span", { "aria-hidden": "true", part: "asterisk", class: "form-control-group__label-asterisk" }, "*"))),
            h("slot", { name: "label-suffix" })),
        h("div", { part: "front", "data-testid": "front", class: "form-control__front" },
            h("slot", { name: "front" })),
        h("div", { part: "children", class: {
                "form-control-group__children": true,
                "form-control-group__direction-row": props.direction === "row",
                "form-control-group__direction-column": props.direction === "column",
            } },
            h("div", { class: "visually-hidden" },
                h("div", { id: "error-message", "aria-live": "assertive" }, props.errorMessage),
                h("label", { class: "radio-group__validation" },
                    h("input", { type: "text", class: "radio-group__validation-input", required: props.isRequired, tabindex: "-1", hidden: true }))),
            children),
        h("div", { part: "rear", "data-testid": "rear", class: "form-control__rear" },
            h("slot", { name: "rear" })),
        h("div", { part: "help-text", id: helpId, "aria-hidden": hasHelpText ? "false" : "true", class: { "form-control-group__help-text": hasHelpText } },
            h("slot", { name: "help-text" }, props.helpText))));
};

export { FormControlGroup as F };

