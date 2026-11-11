import { h } from '@stencil/core/internal/client';

const FormControl = (props, children) => {
    const hasLabel = props.label ? true : props.hasLabelSlot;
    const hasFront = props.hasFrontSlot;
    const hasRear = props.hasRearSlot;
    const hasTrailing = props.hasTrailingSlot;
    const hasHelpText = props.helpText ? true : props.hasHelpTextSlot;
    const isTooltip = props.tooltip ? true : false;
    let cls = "form-control__input form-control__element";
    if (props.cssClasses && Object.keys(props.cssClasses).length > 0) {
        const cssCls = props.cssClasses;
        for (const prop in cssCls) {
            if (cssCls[prop]) {
                cls += ` ${prop}`;
            }
        }
    }
    const renderLabel = () => (h("label", { part: "label", id: props.labelId, class: `form-control__label${props.hasError ? " error" : ""} ${props.isDisabled ? " disabled" : ""}`, htmlFor: props.inputId, onClick: props.onLabelClick },
        h("span", { class: "form-control__label-text" },
            h("slot", { name: "label" }, props.label),
            " ",
            props.isRequired && (h("span", { part: "asterisk", class: "form-control-asterisk-required" }, "*"))),
        h("slot", { name: "label-suffix" })));
    return (h("div", { part: "form-control", class: {
            "form-control": true,
            "form-control--xsmall": props.size === "xsmall",
            "form-control--small": props.size === "small",
            "form-control--medium": props.size === "medium",
            "form-control--large": props.size === "large",
            "form-control--has-label": !!hasLabel,
            "form-control--has-label-info": !!props.hasLabelInfoSlot,
            "form-control--has-front": !!hasFront,
            "form-control--has-rear": !!hasRear,
            "form-control--has-trailing": !!hasTrailing,
            "form-control--has-help-text": !!hasHelpText,
            "form-control--disabled": !!props.isDisabled,
            "form-control--tooltip-reference": !!isTooltip,
            "form-control--has-maxlength": props.maxlength !== undefined && props.maxlength > 0,
        } },
        hasLabel && props.hasLabelInfoSlot ? (h("div", { part: "label-container", class: "form-control__label-container" },
            renderLabel(),
            h("slot", { name: "label-info" }))) : hasLabel ? (renderLabel()) : (""),
        h("div", { part: "front", "data-testid": "front", class: "form-control__front" },
            h("slot", { name: "front" })),
        h("div", { part: "element", class: {
                [cls]: true,
                "form-control__element-wrapper": !!props.hasElementSuffix,
            } },
            children,
            h("span", { part: "element-suffix", class: "form-control__element-suffix" },
                h("slot", { name: "element-suffix" }))),
        h("div", { part: "trailing", "data-testid": "trailing", class: "form-control__trailing" },
            h("slot", { name: "trailing" })),
        h("div", { part: "help-text", id: props.helpTextId, class: `form-control__help-text ${props.hasError ? " error" : ""}`, "data-testid": "helpText" },
            h("slot", { name: "help-text" }, props.helpText),
            props.renderHelpTextRight ? props.renderHelpTextRight() : null),
        h("div", { part: "rear", "data-testid": "rear", class: "form-control__rear" },
            h("slot", { name: "rear" })),
        props.tooltip ? (
        // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: <explanation>
        h("hbr-visually-hidden", { role: "tooltip", id: props.tooltipId }, props.tooltip)) : null));
};

export { FormControl as F };

