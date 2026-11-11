import { h, proxyCustomElement, HTMLElement, createEvent, forceUpdate, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';
import { h as copy, i as alertsPositiveSmall } from './index2.js';
import { F as FormControl } from './form-control.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$8 } from './icon.js';
import { d as defineCustomElement$9 } from './button.js';
import { d as defineCustomElement$7 } from './popover.js';
import { d as defineCustomElement$6 } from './popup.js';
import { d as defineCustomElement$5 } from './spinner.js';
import { d as defineCustomElement$4 } from './tooltip.js';
import { d as defineCustomElement$3 } from './truncation.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

var _a;
const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
const generateClipBoardOverFlowLabelTooltip = (refCallback, textContent) => {
    return (h("hbr-tooltip", { ref: refCallback, enablePopover: true },
        h("div", { slot: "content" }, textContent)));
};
const generateClipBoardActionTooltip = (refCallback, isVisible, textContent) => {
    return (h("hbr-tooltip", { ref: refCallback, part: "tooltip", class: "copyClipboard__floating-content copyClipboard__action-tooltip", open: isVisible, enablePopover: true },
        h("div", { slot: "content" },
            h("slot", { name: "tooltip-hovered" },
                h("div", null, textContent)))));
};
const generateClipboardActionPopover = (refCallback, isVisible, textContent) => {
    return (h("hbr-popover", { enablePopover: true, ref: refCallback, part: "popover", class: "copyClipboard__floating-content copyClipboard__action-popover", open: isVisible },
        h("div", { slot: "content", part: "content", class: "copyClipboard__content" },
            h("slot", { name: "tooltip-clicked" },
                h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["alerts-positive-small"]) ||
                        alertsPositiveSmall, size: "16px", sentiment: "success" }),
                h("div", null, textContent)))));
};
const generateButtonOnlyClipboard = (handleMouseEnter, handleMouseLeave, handleFocus, handleBlur, handleKeyDown, handleClick, size, arialabel, i18nCopy) => {
    return (h("hbr-button", { variant: "text", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown, onClick: handleClick, "data-testid": "copyClipBoard-copy-button", arialabel: arialabel, part: "copy-button", exportparts: "base:button-base", size: size },
        h("hbr-icon", { slot: "prefix", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.copy) || copy, size: size === "small" ? "14px" : "16px", part: "icon-button" }),
        h("slot", { name: "copy-label" },
            h("span", { class: "copyClipboard__button-text" }, i18nCopy))));
};
const generateIconOnlyClipboard = (handleMouseEnter, handleMouseLeave, handleFocus, handleBlur, handleKeyDown, handleClick, size, arialabel) => {
    return (h("hbr-button", { variant: "text", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown, onClick: handleClick, "data-testid": "copyClipBoard-copy-button", arialabel: arialabel, part: "copy-button", exportparts: "base:button-base", size: size },
        h("slot", { name: "copy-icon" },
            h("hbr-icon", { class: "copyClipboard__icon-only", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.copy) || copy, size: size === "small" ? "14px" : "16px", part: "icon-button" }))));
};
const generateFormClipboard = (label, hasLabelSlot, size, arialabel, i18nCopy, value, handleMouseEnter, handleMouseLeave, handleFocus, handleBlur, handleKeyDown, handleClick, tooltipRef, truncate) => {
    return (h(FormControl, { inputId: `copyClipboard-${generateShortID()}`, label: label, labelId: `copyClipboard-label-${generateShortID()}`, hasLabelSlot: hasLabelSlot, helpTextId: "", helpText: "", hasHelpTextSlot: false, size: size, source: "", hasFocus: false, hasValue: false, hasError: false, isDisabled: false, isRequired: false },
        h("div", { class: {
                copyClipboard: true,
                // Sizes
                "copyClipboard--small": size === "small",
                "copyClipboard--medium": size === "medium",
                "copyClipboard--large": size === "large",
            }, part: "main-container" },
            h("div", { class: "copyClipboard__value", part: "value" }, truncate ? (h("hbr-truncation", { tooltipTarget: tooltipRef }, value)) : (value)),
            h("hbr-button", { variant: "text", onMouseEnter: handleMouseEnter, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown, onMouseLeave: handleMouseLeave, onClick: handleClick, "data-testid": "copyClipBoard-copy-button", arialabel: arialabel, class: "copyClipboard__tooltip-button", part: "copy-button", size: size },
                h("hbr-icon", { slot: "prefix", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.copy) || copy, part: "icon-button" }),
                h("slot", { name: "copy-label" },
                    h("span", { class: "copyClipboard__button-text" }, i18nCopy))))));
};

// navigator.clipboard API is not supported in all browsers (e.g. IE)
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
const executeBrowserCopy = (value) => {
    return new Promise((resolve, reject) => {
        try {
            navigator.clipboard
                .writeText(value)
                .then(() => {
                resolve(value);
            })
                .catch((error) => {
                reject(error);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};

const copyclipboardCss = ":host{--label-font-size-xsmall:var(--hbr-control-font-size-label-xs);--label-font-size-small:var(--hbr-control-font-size-label-sm);--label-font-size-medium:var(--hbr-control-font-size-label-md);--label-font-size-large:var(--hbr-control-font-size-label-lg);--label-font-family:var(--hbr-font-body);--label-font-weight:var(--hbr-control-font-weight-label, --hbr-font-weight-normal);--label-color:var(--base-text-default);--label-error-color:var(--negative-text-default);--help-text-font-size-small:var(--hbr-control-font-size-helptext-sm);--help-text-font-size-medium:var(--hbr-control-font-size-helptext-md);--help-text-font-size-large:var(--hbr-control-font-size-helptext-lg);--help-text-color:var(--base-text-medium-default);--help-text-align:var(--help-text-align-text, end);--help-text-font-family:inherit;--rear-font-size-medium:var(--hbr-control-font-size-rear-md);--rear-font-weight:var(--hbr-control-font-weight-rear-md);--front-font-size-medium:var(--hbr-control-font-size-front-md);--front-font-weight:var(--hbr-control-font-weight-front-md);--asterisk-color:var(--negative-text-default);--asterisk-font-weight:600;--help-text-error-color:var(--negative-text-default)}.form-control--has-rear .form-control__rear{font-size:var(--hbr-control-font-size-rear);padding-top:var(--hbr-spacing-xs)}.form-control--has-trailing{display:grid;grid-template-columns:max-content auto;column-gap:var(--hbr-spacing-xs, 8px);justify-content:start}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container,.form-control--has-trailing .form-control__front,.form-control--has-trailing .form-control__help-text,.form-control--has-trailing .form-control__rear{grid-column:1/-1}.form-control--has-trailing .form-control__label,.form-control--has-trailing .form-control__label-container{grid-row:1}.form-control--has-trailing .form-control__front{grid-row:2}.form-control--has-trailing .form-control__element{grid-column:1;grid-row:3;display:inline-flex;min-width:0;width:fit-content;max-width:100%}.form-control.form-control--has-trailing .form-control__trailing{grid-column:2;grid-row:3;display:inline-flex;align-items:center;align-self:center;padding-top:0}.form-control--has-trailing .form-control__help-text{grid-row:4}.form-control--has-trailing .form-control__rear{grid-row:5}.form-control .form-control__label-container{display:none}.form-control .form-control__label{display:none}.form-control .form-control__help-text{display:none;margin-top:var(--hbr-spacing-2xs)}.form-control .form-control__trailing{display:none}.form-control--has-label .form-control-asterisk-required{color:var(--asterisk-color);margin:0;font-weight:var(--asterisk-font-weight);display:var(--form-control-asterisk-display, \"block\")}.form-control--has-label .form-control__label{display:flex;flex-direction:row;align-items:center;color:var(--label-color);margin-bottom:var(--hbr-spacing-2xs);font-family:var(--label-font-family);font-weight:var(--label-font-weight);gap:var(--label-flex-gap)}.form-control--has-label .form-control__label.error{color:var(--label-error-color);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label .form-control__label-text{display:inline-flex;align-items:center;gap:var(--hbr-spacing-3xs)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]),.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){font-size:inherit;line-height:inherit;font-weight:var(--hbr-font-weight-normal);--path-secondary-color:currentColor;display:var(--label-suffix-slotted-display);gap:var(--label-suffix-slotted-flex-gap);align-items:var(--label-suffix-slotted-align-items)}.form-control--has-label .form-control__label ::slotted([slot=label-suffix]){color:var(--label-suffix-color)}.form-control--has-label.form-control--has-label-info .form-control__label-container ::slotted([slot=label-info]){color:var(--interact-icon-weak-default)}.form-control--has-label.form-control--xsmall .form-control__label{font-size:var(--label-font-size-xsmall);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--xsmall .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--xsmall .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--xsmall .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label{font-size:var(--label-font-size-small);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--small .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--small .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--small .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label{font-size:var(--label-font-size-medium);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--medium .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--medium .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--medium .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label{font-size:var(--label-font-size-large);font-weight:var(--hbr-control-font-weight-label)}.form-control--has-label.form-control--large .form-control__label.input{color:var(--interact-text-default)}.form-control--has-label.form-control--large .form-control__label.input.error{color:var(--negative-text-default);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--large .form-control__label.input.disabled{color:var(--base-text-disabled);font-weight:var(--hbr-control-font-weight)}.form-control--has-label.form-control--has-label-info .form-control__label-container{display:flex;flex-direction:row;align-items:center;margin-bottom:var(--hbr-spacing-2xs);gap:var(--hbr-spacing-2xs)}.form-control--has-label.form-control--has-label-info.form-control--large .form-control__label-container{gap:var(--hbr-spacing-xs)}.form-control--has-label.form-control--has-label-info .form-control__label{margin-bottom:0}.form-control--has-help-text .form-control__help-text{font-family:var(--help-text-font-family);display:block;color:var(--help-text-color);text-align:var(--help-text-align)}.form-control--has-help-text .form-control__help-text ::slotted(*){margin-top:var(--hbr-spacing-3xs)}.form-control--has-help-text .form-control__help-text.error{color:var(--help-text-error-color);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--small .form-control__help-text{font-size:var(--help-text-font-size-small);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__help-text{font-size:var(--help-text-font-size-medium);font-weight:var(--hbr-font-weight-normal)}.form-control--has-help-text.form-control--medium .form-control__front{font-size:var(--front-font-size-medium);font-weight:var(--front-font-weight)}.form-control--has-help-text.form-control--medium .form-control__rear{font-size:var(--rear-font-size-medium);font-weight:var(--rear-font-weight)}.form-control--has-help-text.form-control--large .form-control__help-text{font-size:var(--help-text-font-size-large);font-weight:var(--hbr-font-weight-normal)}.form-control__element-wrapper{display:flex;flex-direction:row;align-items:center;gap:var(--element-suffix-gap, var(--hbr-spacing-sm, 12px))}:host{display:block;--hbr-copyclipboard-value-color:var(--base-text-default);--hbr-copyclipboard-value-font-size:var(--hbr-font-size-sm);--hbr-copyclipboard-value-font-weight:var(--hbr-font-weight-normal);--hbr-copyclipboard-value-font-spacing:var(--hbr-font-letter-spacing-normal);--hbr-copyclipboard-value-font-height:20px;--hbr-copyclipboard-button-text-font-size:var(--hbr-font-size-sm, 14px);--hbr-copyclipboard-button-text-font-height:18px;--hbr-copyclipboard-button-text-color:var(--interact-text-default);--copyClipboard-value-color:var(--hbr-copyclipboard-value-color);--copyClipboard-value-font-size:var(--hbr-copyclipboard-value-font-size);--copyClipboard-value-font-weight:var(--hbr-copyclipboard-value-font-weight);--copyClipboard-value-font-spacing:var(--hbr-copyclipboard-value-font-spacing);--copyClipboard-value-font-height:var(--hbr-copyclipboard-value-font-height);--copyClipboard-button-text-font-size:var(--hbr-copyclipboard-button-text-font-size);--copyClipboard-button-text-font-height:var(--hbr-copyclipboard-button-text-font-height);--icon-color:var(--label-color);max-width:var(--max-width)}:host hbr-tooltip{width:0}:host hbr-popover{width:0}:host .copyClipboard__floating-content{display:flex;justify-content:center}:host .copyClipboard__action-tooltip{pointer-events:none}:host .copyClipboard__action-popover{pointer-events:none}:host .copyClipboard__floating-content_invisible{display:none}:host .copyClipboard{display:flex;flex-direction:row;justify-content:space-between;height:calc(var(--hbr-spacing-sm, 12px) * 2 + 20px);align-items:center;padding:var(--hbr-spacing-sm, 12px);gap:16px;background-color:var(--base-bg-default);border-radius:var(--hbr-border-radius-md, 6px)}:host .copyClipboard .copyClipboard__button-text{font-family:Inter;font-weight:var(--hbr-font-weight-bold, 700);font-size:var(--copyClipboard-button-text-font-size, 14px);line-height:20px;color:var(--hbr-copyclipboard-button-text-color)}:host .copyClipboard .copyClipboard__tooltip-button{display:flex;flex-direction:row}:host .copyClipboard .copyClipboard__tooltip-button>hbr-icon{font-size:16px}:host .copyClipboard .copyClipboard__tooltip-button::part(label){padding-inline-start:4px}:host .copyClipboard .copyClipboard__value{flex:1;color:var(--copyClipboard-value-color);font-family:Inter;font-size:var(--copyClipboard-value-font-size);font-weight:var(--copyClipboard-value-font-weight);height:18px;letter-spacing:var(--copyClipboard-value-font-spacing);line-height:var(--copyClipboard-value-font-height)}:host .copyClipboard__content{display:flex;align-items:center;gap:var(--hbr-spacing-2xs)}:host([button-only]){width:fit-content}:host([button-only]) .copyClipboard__button-text{font-family:Inter;font-weight:var(--hbr-font-weight-bold, 700);font-size:var(--copyClipboard-button-text-font-size, 14px);line-height:20px;color:var(--hbr-copyclipboard-button-text-color)}:host([button-only][size=small]) .copyClipboard__button-text{font-size:var(--hbr-font-size-xs, 12px);line-height:18px}:host([size=medium]){--max-width:600px}:host([size=small]){--max-width:520px}:host([size=small]) .copyClipboard{gap:12px}:host(.small-size) .copyClipboard__value,:host([size=medium].small-size) .copyClipboard__value,:host([size=small]) .copyClipboard__value{font-family:Inter;font-weight:var(--hbr-font-weight-normal, 400);font-size:var(--hbr-font-size-xs, 12px);line-height:18px}:host [part=format-button]{color:var(--interact-text-default)}:host [part=copy-button]:hover{background-color:transparent;border-color:transparent}:host(.small-size) .copyClipboard,:host([size=medium].small-size) .copyClipboard,:host([size=small]) .copyClipboard{padding:var(--hbr-spacing-xs, 8px);height:34px}:host(.small-size) [part=copy-button],:host([size=medium].small-size) [part=copy-button],:host([size=small]) [part=copy-button]{font-size:var(--hbr-font-size-xs, 12px)}:host(.small-size),:host([size=medium].small-size),:host([size=small]){--copyClipboard-button-text-font-size:var(--hbr-font-size-xs, 12px);--copyClipboard-button-text-font-height:18px}:host(.small-size) hbr-button [part=icon-button],:host([size=medium].small-size) hbr-button [part=icon-button],:host([size=small]) hbr-button [part=icon-button]{font-size:var(--hbr-font-size-sm, 14px)}:host([icon-only]){--icon-color:var(--interact-icon-weak-default)}.copyClipboard__icon-only{color:var(--icon-color)}";
const HbrCopyclipboardStyle0 = copyclipboardCss;

const defaultI18n = {
    copy: "Copy",
    copyToClipboard: "Copy to Clipboard",
    copiedToClipboard: "Copied to Clipboard",
};
const HbrCopyclipboard$1 = /*@__PURE__*/ proxyCustomElement(class HbrCopyclipboard extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrCopy = createEvent(this, "hbr-copy", 7);
        this.handleMouseEnter = (event) => {
            const { currentTarget } = event;
            this.showTooltip(currentTarget);
        };
        this.handleMouseLeave = (event) => {
            this.hideTooltipAndPopover(event);
        };
        this.handleFocus = (event) => {
            const { currentTarget } = event;
            this.showTooltip(currentTarget);
        };
        this.handleBlur = (event) => {
            this.hideTooltipAndPopover(event);
        };
        this.handleKeyDown = (event) => {
            if (event.key === "Escape" &&
                (this.popoverVisible || this.tooltipVisible)) {
                event.stopPropagation();
                this.popoverVisible = false;
                this.tooltipVisible = false;
            }
        };
        this.handleClick = (event) => {
            const { currentTarget } = event;
            executeBrowserCopy(this.value)
                .then(() => {
                this.showPopover(currentTarget);
                this.hbrCopy.emit(event);
            })
                .catch((error) => {
                console.warn(`There was an error copying the text. ${error}`);
            });
        };
        this.showTooltip = (anchoringElement) => {
            if (this.tooltipRef && this.popoverRef && anchoringElement) {
                this.tooltipRef.anchor = anchoringElement;
                this.popoverVisible = false;
                // this.tooltipRef.style.display = "block";
                this.tooltipRef.classList.remove("copyClipboard__floating-content_invisible");
                this.tooltipVisible = true;
            }
        };
        this.showPopover = (anchoringElement) => {
            if (this.tooltipRef && this.popoverRef && anchoringElement) {
                this.popoverRef.anchor = anchoringElement;
                this.tooltipVisible = false;
                // to deal with tooltip shows up sometimes while popover is visible
                // this.tooltipRef.style.display = "none";
                this.tooltipRef.classList.add("copyClipboard__floating-content_invisible");
                this.popoverVisible = true;
            }
        };
        this.hideTooltipAndPopover = (event) => {
            const { target } = event;
            if (target !== this.host) {
                this.popoverVisible = false;
                this.tooltipVisible = false;
            }
        };
        this.value = "";
        this.label = "";
        this.size = "medium";
        this.iconOnly = undefined;
        this.buttonOnly = undefined;
        this.arialabel = undefined;
        this.aria = undefined;
        this.truncate = true;
        this.i18n = undefined;
        this.hasLabelSlot = false;
        this.popoverVisible = false;
        this.tooltipVisible = false;
    }
    handleLabelChange() {
        this.hasLabelSlot = hasSlot(this.host, "label");
    }
    connectedCallback() {
        this.host.ownerDocument.addEventListener("click", this.hideTooltipAndPopover);
    }
    disconnectedCallback() {
        this.host.ownerDocument.removeEventListener("click", this.hideTooltipAndPopover);
    }
    // this is required to ensure tooltip/popover has ref after first render
    componentDidLoad() {
        forceUpdate(this);
    }
    render() {
        const i18n = Object.assign(Object.assign({}, this.i18n), defaultI18n);
        const aria = Object.assign(Object.assign({ label: `copy: ${this.value}` }, (this.arialabel && { label: this.arialabel })), this.aria);
        return (h(Host, { key: '99e4435c3609dfb2fb7a3deff7ad2ba75288e65f' }, this.buttonOnly
            ? generateButtonOnlyClipboard(this.handleMouseEnter, this.handleMouseLeave, this.handleFocus, this.handleBlur, this.handleKeyDown, this.handleClick, this.size, aria === null || aria === void 0 ? void 0 : aria.label, i18n === null || i18n === void 0 ? void 0 : i18n.copy)
            : this.iconOnly
                ? generateIconOnlyClipboard(this.handleMouseEnter, this.handleMouseLeave, this.handleFocus, this.handleBlur, this.handleKeyDown, this.handleClick, this.size, aria === null || aria === void 0 ? void 0 : aria.label)
                : generateFormClipboard(this.label, this.hasLabelSlot, this.size, aria === null || aria === void 0 ? void 0 : aria.label, i18n === null || i18n === void 0 ? void 0 : i18n.copy, this.value, this.handleMouseEnter, this.handleMouseLeave, this.handleFocus, this.handleBlur, this.handleKeyDown, this.handleClick, this.labelOverflowTooltipRef, this.truncate), generateClipBoardOverFlowLabelTooltip((el) => {
            this.labelOverflowTooltipRef = el;
        }, this.value), generateClipBoardActionTooltip((el) => {
            this.tooltipRef = el;
        }, this.tooltipVisible, i18n === null || i18n === void 0 ? void 0 : i18n.copyToClipboard), generateClipboardActionPopover((el) => {
            this.popoverRef = el;
        }, this.popoverVisible, i18n === null || i18n === void 0 ? void 0 : i18n.copiedToClipboard)));
    }
    get host() { return this; }
    static get watchers() { return {
        "label": ["handleLabelChange"]
    }; }
    static get style() { return HbrCopyclipboardStyle0; }
}, [1, "hbr-copyclipboard", {
        "value": [1],
        "label": [1],
        "size": [513],
        "iconOnly": [516, "icon-only"],
        "buttonOnly": [516, "button-only"],
        "arialabel": [1],
        "aria": [16],
        "truncate": [4],
        "i18n": [16],
        "hasLabelSlot": [32],
        "popoverVisible": [32],
        "tooltipVisible": [32]
    }, undefined, {
        "label": ["handleLabelChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-copyclipboard", "hbr-button", "hbr-icon", "hbr-popover", "hbr-popup", "hbr-spinner", "hbr-tooltip", "hbr-truncation", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-copyclipboard":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrCopyclipboard$1);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-truncation":
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

const HbrCopyclipboard = HbrCopyclipboard$1;
const defineCustomElement = defineCustomElement$1;

export { HbrCopyclipboard, defineCustomElement };

