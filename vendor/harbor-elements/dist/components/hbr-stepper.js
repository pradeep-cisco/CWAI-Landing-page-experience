import { h, Fragment, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { d as check, a as caretRight, b as caretLeft } from './index2.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$8 } from './icon.js';
import { d as defineCustomElement$9 } from './button.js';
import { d as defineCustomElement$7 } from './icon-button.js';
import { d as defineCustomElement$6 } from './panel.js';
import { d as defineCustomElement$5 } from './spinner.js';
import { d as defineCustomElement$4 } from './tab.js';
import { d as defineCustomElement$3 } from './tab-vertical.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const stopIconOnlyTabClick = (event) => {
    event.stopPropagation();
};
const stopIconOnlyTabActivation = (event) => {
    if (["Enter", " "].includes(event.key)) {
        event.stopPropagation();
    }
};
const focusStepIcon = (tab) => {
    var _a;
    const stepIconButton = tab.querySelector("[slot='prefix'] hbr-button");
    void ((_a = stepIconButton === null || stepIconButton === void 0 ? void 0 : stepIconButton.setFocus) === null || _a === void 0 ? void 0 : _a.call(stepIconButton, { preventScroll: true }));
};
const moveFocusToAdjacentStepIcon = (event) => {
    if (event.key !== "Tab")
        return false;
    const tab = event.currentTarget.closest("hbr-tab");
    if (!tab)
        return false;
    const tabList = tab.closest("hbr-tab-vertical");
    const tabs = Array.from((tabList === null || tabList === void 0 ? void 0 : tabList.querySelectorAll("hbr-tab")) || []);
    const tabIndex = tabs.indexOf(tab);
    const direction = event.shiftKey ? -1 : 1;
    for (let nextIndex = tabIndex + direction; nextIndex >= 0 && nextIndex < tabs.length; nextIndex += direction) {
        const nextTab = tabs[nextIndex];
        if (!nextTab.active &&
            !nextTab.disabled &&
            !nextTab.classList.contains("hbr-stepper--tab-hidden")) {
            event.preventDefault();
            event.stopPropagation();
            focusStepIcon(nextTab);
            return true;
        }
    }
    return false;
};
const handleIconOnlyTabKeyDown = (event, shouldMoveBetweenStepIcons) => {
    if (shouldMoveBetweenStepIcons && moveFocusToAdjacentStepIcon(event)) {
        return;
    }
    stopIconOnlyTabActivation(event);
};
const generateSubStep = (subStep, _index, lastVisibleStepId, activeStepId, handleStepChange, handleStepFocusIn, customCheck, aria, stepperId, iconOnly = false, disableActiveStepTabFocus = false) => {
    var _a, _b, _c;
    const isSubStepDisabled = !!((_a = subStep.status) === null || _a === void 0 ? void 0 : _a.includes("disabled"));
    const isSubStepDone = !!((_b = subStep.status) === null || _b === void 0 ? void 0 : _b.includes("done"));
    const supProps = Object.assign(Object.assign({ class: {
            "hbr-stepper--tab": true,
            "hbr-stepper--tab-done": isSubStepDone,
            "hbr-stepper--tab-last-visible": subStep.id === lastVisibleStepId,
            "hbr-stepper--tab-sub": true,
            "hbr-stepper--tab-hidden": subStep.status === "hidden",
        }, key: subStep.label, vertical: true, sentiment: "interact", active: subStep.id === activeStepId, intermediate: (_c = subStep === null || subStep === void 0 ? void 0 : subStep.subSteps) === null || _c === void 0 ? void 0 : _c.some((subSubStep) => activeStepId === subSubStep.id), disabled: isSubStepDisabled ||
            subStep.status === "hidden" ||
            subStep.isInteractive === false }, (!iconOnly
        ? { "onHbr-click": () => handleStepChange("side-nav", subStep, true) }
        : {})), { role: (aria === null || aria === void 0 ? void 0 : aria.role) === "list" ? "listitem" : "tab", aria: { role: "none" } });
    const stepIconTabidx = !iconOnly ||
        supProps.disabled ||
        (disableActiveStepTabFocus && supProps.active)
        ? "-1"
        : subStep.isInteractive !== false
            ? "0"
            : "-1";
    return (h("hbr-tab", Object.assign({ key: subStep.id }, supProps, { "data-testid": subStep.id, onFocusin: handleStepFocusIn }, (aria.role === "list" && supProps.active
        ? { "aria-current": "step" }
        : {}), (supProps.active || supProps.intermediate
        ? { "aria-controls": `stepper-main-${stepperId}` }
        : {}), (aria.role !== "list"
        ? supProps.active
            ? { "aria-selected": "true" }
            : { "aria-selected": "false" }
        : {}), (supProps.disabled ? { "aria-disabled": "true" } : {}), (iconOnly ? { onClick: stopIconOnlyTabClick } : {}), (iconOnly
        ? {
            onKeyDown: (event) => handleIconOnlyTabKeyDown(event, disableActiveStepTabFocus),
        }
        : {})),
        h("div", { class: "hbr-stepper--step_label", title: subStep.label },
            subStep.label,
            h("div", { class: "hbr-stepper--step_sub-label" }, subStep.subtitle)),
        h("div", { slot: "prefix", class: "hbr-stepper--step_icon" },
            h("hbr-button", Object.assign({ size: "small", disabled: supProps.disabled, "aria-hidden": iconOnly ? null : "true" }, (disableActiveStepTabFocus && supProps.active
                ? { tabindex: "-1" }
                : {}), { tabidx: stepIconTabidx, circle: true, variant: supProps.active ? "fill" : "outline", sentiment: isSubStepDone || supProps.active ? "interact" : "neutral" }, (iconOnly
                ? {
                    onClick: (event) => {
                        event.stopPropagation();
                        handleStepChange("side-nav", subStep, true);
                    },
                    onKeyDown: (event) => handleIconOnlyTabKeyDown(event, disableActiveStepTabFocus),
                }
                : {})), isSubStepDone ? (h(Fragment, null,
                h("hbr-visually-hidden", null, aria.completed),
                h("hbr-icon", { class: "hbr-stepper--sub_step_icon", asset: customCheck || check }))) : null))));
};
const generateMainStep = (step, index, lastVisibleStepId, activeStepId, handleStepChange, handleStepFocusIn, customCheck, aria, stepperId, iconOnly = false, disableActiveStepTabFocus = false) => {
    var _a, _b, _c;
    const isStepDisabled = !!((_a = step.status) === null || _a === void 0 ? void 0 : _a.includes("disabled"));
    const isStepDone = !!((_b = step.status) === null || _b === void 0 ? void 0 : _b.includes("done"));
    const props = Object.assign(Object.assign({ class: {
            "hbr-stepper--tab": true,
            "hbr-stepper--tab-done": isStepDone,
            "hbr-stepper--tab-last-visible": step.id === lastVisibleStepId,
            "hbr-stepper--tab-non-interactive": step.isInteractive === false,
            "hbr-stepper--tab-hidden": step.status === "hidden",
        }, key: step.label, vertical: true, sentiment: "interact", active: step.id === activeStepId, intermediate: (_c = step === null || step === void 0 ? void 0 : step.subSteps) === null || _c === void 0 ? void 0 : _c.some((subStep) => activeStepId === subStep.id), disabled: isStepDisabled ||
            step.status === "hidden" ||
            step.isInteractive === false }, (!iconOnly
        ? { "onHbr-click": () => handleStepChange("side-nav", step, false) }
        : {})), { role: aria.role === "list" ? "listitem" : "tab", aria: { role: "none" } });
    const stepIconTabidx = !iconOnly || props.disabled || (disableActiveStepTabFocus && props.active)
        ? "-1"
        : step.isInteractive !== false
            ? "0"
            : "-1";
    return (h("hbr-tab", Object.assign({ key: step.id }, props, { "data-testid": step.id, onFocusin: handleStepFocusIn }, (aria.role === "list" && props.active
        ? { "aria-current": "step" }
        : {}), (aria.role !== "list"
        ? props.active
            ? { "aria-selected": "true" }
            : { "aria-selected": "false" }
        : {}), (props.active || props.intermediate
        ? { "aria-controls": `stepper-main-${stepperId}` }
        : {}), (props.disabled ? { "aria-disabled": "true" } : {}), (iconOnly ? { onClick: stopIconOnlyTabClick } : {}), (iconOnly
        ? {
            onKeyDown: (event) => handleIconOnlyTabKeyDown(event, disableActiveStepTabFocus),
        }
        : {})),
        h("div", { class: "hbr-stepper--step_label", title: step.label },
            step.label,
            h("div", { class: "hbr-stepper--step_sub-label" }, step.subtitle)),
        h("div", { slot: "prefix", class: "hbr-stepper--step_icon" },
            h("hbr-button", Object.assign({ size: "small", disabled: props.disabled, "aria-hidden": iconOnly ? null : "true" }, (disableActiveStepTabFocus && props.active
                ? { tabindex: "-1" }
                : {}), { tabidx: stepIconTabidx, circle: true, variant: props.active ? "fill" : "outline", sentiment: isStepDone || props.active ? "interact" : "neutral" }, (iconOnly
                ? {
                    onClick: (event) => {
                        event.stopPropagation();
                        handleStepChange("side-nav", step, false);
                    },
                    onKeyDown: (event) => handleIconOnlyTabKeyDown(event, disableActiveStepTabFocus),
                }
                : {})), isStepDone ? (h(Fragment, null,
                h("hbr-visually-hidden", null, aria.completed || "Completed"),
                h("hbr-icon", { class: "hbr-stepper--main_step_icon", asset: customCheck || check }))) : (h(Fragment, null,
                h("hbr-visually-hidden", null, aria.step || "Step"),
                index + 1))))));
};

const stepperCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}hbr-stepper{--color-disabled:var(--base-text-disabled);--color-border:var(--base-border-default);--color-text-interact:var(--interact-text-default);display:block;height:100%;min-width:640px}.hbr-stepper--{--left-width-expanded:320px;--left-width:var(--left-width-expanded);--collapsed-left-width:77px;--left-border-size:1px;--top-padding:var(--hbr-spacing-md) var(--hbr-spacing-lg) var(--hbr-spacing-xs);--top-label-width:120px;--step-icon-size:28px;--sub-step-margin-left:40px;position:relative;display:grid;grid-template-columns:auto 1fr;height:100%}.hbr-stepper--.hbr-stepper--collapsed{--left-width:var(--collapsed-left-width)}.hbr-stepper--.hbr-stepper--direction-row{--left-width:0;--left-border-size:0}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row{padding:var(--top-padding);margin:0 0 var(--hbr-spacing-md) 0}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical::part(base){border:0}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical::part(tabs){display:flex;flex-direction:row}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical::part(border),.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical::part(body){display:none}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical::part(nav-container){flex:1;padding:0}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab{margin:0;width:0;flex:1 1 0px}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab::part(base){display:flex;flex-direction:column;padding:0;cursor:auto}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab .hbr-stepper--step_icon{margin:0 0 var(--hbr-spacing-2xs) 0}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab .hbr-stepper--step_label{text-align:center;font-size:var(--hbr-font-size-xs);line-height:18px;max-width:var(--top-label-width);overflow:hidden;white-space:normal}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab::part(indicator){--indicator-size:1px;--indicator-color:var(--color-border);--gap:10px;--offset:calc(var(--step-icon-size) + calc(2 * var(--gap)));display:block;height:var(--indicator-size);width:calc(100% - var(--offset));left:calc(50% + var(--offset) / 2);top:calc(var(--step-icon-size) / 2 - var(--indicator-size) / 2)}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab.hbr-stepper--tab-last-visible::part(indicator),.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab.hbr-stepper--tab-last-visible:hover:not([disabled]):not([active])::part(indicator){display:none}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab.hbr-stepper--tab-done::part(indicator){--indicator-size:2px;--indicator-color:var(--color-sentiment-indicator)}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab.hbr-stepper--tab-done[disabled]::part(indicator){--indicator-color:var(--interact-border-disabled)}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab .hbr-stepper--step_icon hbr-button{pointer-events:auto}.hbr-stepper--.hbr-stepper--direction-row .hbr-stepper--nav-row hbr-tab-vertical hbr-tab:not(.hbr-stepper--tab-last-visible):hover:not([disabled]):not([active])::part(indicator){display:block !important;background:var(--indicator-color) !important}.hbr-stepper-- .hbr-stepper--step_icon{margin-right:var(--hbr-spacing-sm)}.hbr-stepper-- .hbr-stepper--tab-hidden{display:none}.hbr-stepper--left{position:absolute;width:var(--left-width);top:0;left:0;bottom:0;display:flex;flex-direction:column;border-right:var(--left-border-size) solid var(--color-border)}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs{height:100%}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs::part(base){height:100%;border:0}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs::part(nav-container){--padding:24px 0 0 0;width:100%}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs::part(border){display:none}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab{display:flex;margin:0 0 var(--hbr-spacing-sm, 12px) 0;--prefix-margin-right:var(--hbr-spacing-sm)}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab::part(base){padding-right:15px;font-size:14px;font-weight:600;line-height:20px;align-items:flex-start}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--main_step_icon{font-size:16px}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--sub_step_icon{font-size:10px}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--step_label{margin-top:4px}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab-hidden{display:none}.hbr-stepper--left .hbr-stepper--nav_vertical_tabs .hbr-stepper--tab-non-interactive{pointer-events:none}.hbr-stepper--left .hbr-stepper--tab.hbr-stepper--tab-sub>.hbr-stepper--step_icon{display:auto}.hbr-stepper--nav_vertical_tabs:not([collapsed]) .hbr-stepper--tab.hbr-stepper--tab-sub{margin-left:var(--sub-step-margin-left);width:auto}.hbr-stepper--nav_vertical_tabs:not([collapsed]) .hbr-stepper--tab.hbr-stepper--tab-sub>.hbr-stepper--step_icon{display:none}.hbr-stepper--nav_vertical_tabs[collapsed] .hbr-stepper--tab::part(base){display:flex;justify-content:center}.hbr-stepper--nav_vertical_tabs[collapsed] .hbr-stepper--tab>.hbr-stepper--step_icon{margin:0}.hbr-stepper--nav_vertical_tabs[collapsed] .hbr-stepper--tab.hbr-stepper--tab-sub>.hbr-stepper--step_icon>hbr-button::part(base){width:16px;height:16px}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab hbr-button::part(label){font-size:14px;font-weight:600;line-height:20px}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--step_icon hbr-button{pointer-events:none}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab:not([active]):not([disabled]):not([intermediate]) .hbr-stepper--step_icon>hbr-button::part(label){color:var(--interact-text-weak-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab:not([active]):not([disabled]) .hbr-stepper--step_icon>hbr-button::part(base){border-color:var(--color-border)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab:hover:not([active]):not([disabled]):not([intermediate]) .hbr-stepper--step_icon>hbr-button::part(base){background-color:var(--interact-bg-medium-hover);border-color:var(--interact-bg-medium-hover)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab:hover:not([active]):not([disabled]):not([intermediate]) .hbr-stepper--step_icon>hbr-button::part(label){color:var(--interact-text-active)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[active] .hbr-stepper--step_icon>hbr-button::part(base){background:var(--control-icon-medium-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[active] .hbr-stepper--step_icon>hbr-button::part(label){color:var(--base-text-in-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[disabled] .hbr-stepper--step_icon>hbr-button::part(base){border-color:var(--color-border)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[disabled] .hbr-stepper--step_icon>hbr-button::part(label){color:var(--color-disabled)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[intermediate] .hbr-stepper--step_icon>hbr-button:not([sentiment=interact])::part(base){border:0}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[intermediate] .hbr-stepper--step_icon>hbr-button::part(base){background:var(--control-icon-medium-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[intermediate] .hbr-stepper--step_icon>hbr-button::part(label){color:var(--base-text-in-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[intermediate] .hbr-stepper--step_label{color:var(--color-text-interact)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab[intermediate] .hbr-stepper--step_label .hbr-stepper--step_sub-label{color:var(--interact-text-weak-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active]) .hbr-stepper--step_icon>hbr-button::part(base),.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]) .hbr-stepper--step_icon>hbr-button::part(base){border-color:var(--color-text-interact);background:transparent}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active]) .hbr-stepper--step_icon>hbr-button::part(label),.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]) .hbr-stepper--step_icon>hbr-button::part(label){color:var(--color-text-interact)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active]) .hbr-stepper--main_step_icon,.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active]) .hbr-stepper--sub_step_icon,.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]) .hbr-stepper--main_step_icon,.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]) .hbr-stepper--sub_step_icon{color:var(--color-text-interact);--path-color-default:var(--color-text-interact);--path-color-medium:var(--color-text-interact);--path-color-strong:var(--color-text-interact);--path-color-weak:var(--color-text-interact)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]):not([disabled]) .hbr-stepper--step_icon>hbr-button::part(base){border-width:2px;border-color:var(--interact-border-default);background:var(--interact-bg-weak-hover)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]):not([disabled]) .hbr-stepper--main_step_icon,.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:hover:not([active]):not([disabled]) .hbr-stepper--sub_step_icon{color:var(--interact-border-default);--path-color-default:var(--interact-border-default);--path-color-medium:var(--interact-border-default);--path-color-strong:var(--interact-border-default);--path-color-weak:var(--interact-border-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active])::part(base){color:var(--base-text-default)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab.hbr-stepper--tab-done:not([active])::part(base):hover:not([disabled]){color:var(--interact-text-weak-hover)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--step_label{width:100%;overflow:hidden;white-space:normal;text-overflow:ellipsis}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab .hbr-stepper--step_label .hbr-stepper--step_sub-label{position:absolute;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-normal)}.hbr-stepper--nav_vertical_tabs .hbr-stepper--tab:not([disabled]) .hbr-stepper--step_sub-label{color:var(--interact-text-weak-default)}.hbr-stepper--left-content{flex:1;overflow-y:auto}.hbr-stepper--collapse-container{position:absolute;bottom:0;right:0;display:inline-block;padding:0 12px 7px 0;border-bottom-left-radius:12px;background:transparent}.hbr-stepper--collapsed .hbr-stepper--collapse-container{position:relative;display:flex;justify-content:center;align-items:center;padding:0 0 7px 0}.hbr-stepper--collapse-button::part(base){margin:12px;border:var(--hbr-border-width) solid var(--color-border)}.hbr-stepper--collapse-button::part(base):hover{background-color:var(--interact-bg-medium-hover);border-color:var(--interact-bg-medium-hover);color:var(--color-text-interact)}.hbr-stepper--nav_vertical_tabs::part(nav){display:flex;flex-direction:column;height:100%}.hbr-stepper--nav_vertical_tabs::part(tabs){flex-grow:1}.hbr-stepper--nav_container{padding-bottom:var(--hbr-spacing-lg)}.hbr-stepper--collapsed .hbr-stepper--nav_container{padding-bottom:0}.hbr-stepper--main{position:absolute;top:0;right:0;bottom:0;left:var(--left-width);display:flex;flex-direction:column}.hbr-stepper--content{flex:1;overflow-y:auto}.hbr-stepper--footer .hbr-stepper--cta{display:flex;justify-content:space-between;padding:var(--hbr-spacing-md) var(--hbr-spacing-lg)}.hbr-stepper--footer .hbr-stepper--cta .hbr-stepper--cta_changes-saved{display:flex;font-size:var(--hbr-font-size-xs);color:var(--base-text-medium-default);margin-left:var(--hbr-spacing-lg);font-weight:400;line-height:18px}.hbr-stepper--footer .hbr-stepper--cta .hbr-stepper--cta_left{display:flex;align-items:center}.hbr-stepper--footer .hbr-stepper--cta .hbr-stepper--cta_left hbr-button{display:flex;align-items:center}.hbr-stepper--footer .hbr-stepper--cta .hbr-stepper--cta_right{margin-left:var(--hbr-spacing-lg);display:flex;align-items:center;gap:var(--hbr-spacing-xs)}.hbr-stepper--raisedFooter .hbr-stepper--cta{box-shadow:0px -3px 8px 0px rgba(0, 0, 0, 0.08)}";
const HbrStepperStyle0 = stepperCss;

const HbrStepper$1 = /*@__PURE__*/ proxyCustomElement(class HbrStepper extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.hbrStepChange = createEvent(this, "hbr-step-change", 7);
        this.hbrCollapse = createEvent(this, "hbr-collapse", 7);
        this.hbrExpand = createEvent(this, "hbr-expand", 7);
        this.defaultAria = {
            role: "tablist",
            label: "Stepper",
            step: "step",
            completed: "Completed",
            collapseBtnAriaExpand: "Expand panel",
            collapseBtnAriaCollapse: "Collapse panel",
        };
        this.stepperId = generateShortID();
        this.handleStepFocusIn = async (event) => {
            var _a, _b, _c;
            const tab = event.currentTarget;
            if (!tab)
                return;
            if (this.direction === "column") {
                this.syncColumnRovingTabindex(tab);
                return;
            }
            const target = event.target;
            const stepIconButton = tab === null || tab === void 0 ? void 0 : tab.querySelector("[slot='prefix'] hbr-button");
            if (!target || !stepIconButton)
                return;
            if (this.shouldDisableActiveStepTabFocus() && tab.active) {
                await ((_a = tab.removeFocus) === null || _a === void 0 ? void 0 : _a.call(tab));
                await ((_b = stepIconButton.removeFocus) === null || _b === void 0 ? void 0 : _b.call(stepIconButton));
                return;
            }
            if (target === stepIconButton)
                return;
            await ((_c = stepIconButton.setFocus) === null || _c === void 0 ? void 0 : _c.call(stepIconButton));
        };
        this.steps = undefined;
        this.activeStepId = undefined;
        this.cancelEnabled = true;
        this.cancelVisible = true;
        this.cancelLabel = "Cancel";
        this.secondaryEnabled = true;
        this.secondaryVisible = true;
        this.secondaryLabel = "Back";
        this.primaryEnabled = true;
        this.primaryVisible = true;
        this.primaryLabel = "Next";
        this.changesSavedVisible = true;
        this.changesSavedLabel = "All changes saved";
        this.hideLeft = false;
        this.raisedFooter = false;
        this.collapsible = true;
        this.collapsed = false;
        this.direction = "column";
        this.stepPanelWidth = HbrStepper.DEFAULT_STEP_PANEL_WIDTH;
        this.aria = undefined;
    }
    shouldDisableActiveStepTabFocus() {
        return this.direction === "row" && !!this.host.closest("hbr-modal");
    }
    syncModalRowCurrentStepTabindex() {
        if (!this.shouldDisableActiveStepTabFocus())
            return;
        const tabs = this.host.querySelectorAll("hbr-tab");
        tabs.forEach((tab) => {
            var _a, _b;
            const base = (_a = tab.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part='base']");
            const stepIconButton = tab.querySelector("[slot='prefix'] hbr-button");
            if (tab.active) {
                tab.setAttribute("tabindex", "-1");
                base === null || base === void 0 ? void 0 : base.setAttribute("tabindex", "-1");
                stepIconButton === null || stepIconButton === void 0 ? void 0 : stepIconButton.setAttribute("tabindex", "-1");
                void ((_b = stepIconButton === null || stepIconButton === void 0 ? void 0 : stepIconButton.removeFocus) === null || _b === void 0 ? void 0 : _b.call(stepIconButton));
            }
            else if (stepIconButton &&
                !tab.disabled &&
                !tab.classList.contains("hbr-stepper--tab-hidden")) {
                stepIconButton.removeAttribute("tabindex");
            }
        });
    }
    componentDidRender() {
        this.syncModalRowCurrentStepTabindex();
    }
    syncColumnRovingTabindex(focusedTab) {
        const stepsContainer = this.host.querySelector(".hbr-stepper--nav_vertical_tabs");
        stepsContainer === null || stepsContainer === void 0 ? void 0 : stepsContainer.querySelectorAll("hbr-tab").forEach((tab) => {
            var _a;
            const base = (_a = tab.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part='base']");
            base === null || base === void 0 ? void 0 : base.setAttribute("tabindex", tab === focusedTab ? "0" : "-1");
        });
    }
    handleStepChange(actionType, curStep, isSubStep) {
        var _a, _b, _c;
        let calcStep = null;
        let isCalcSubStep = null;
        if (actionType === "next" || actionType === "back") {
            let stepIndex = -1;
            let subStepIndex = -1;
            for (const [stepIdx, step] of this.steps.entries()) {
                if (step.id === curStep.id) {
                    stepIndex = stepIdx;
                    break;
                }
                if (step.subSteps) {
                    for (const [subStepIdx, subStep] of step.subSteps.entries()) {
                        if (subStep.id === curStep.id) {
                            stepIndex = stepIdx;
                            subStepIndex = subStepIdx;
                            break;
                        }
                    }
                }
            }
            if (actionType === "next") {
                if (subStepIndex === -1) {
                    if (stepIndex === this.steps.length - 1 &&
                        !((_a = this.steps[stepIndex].subSteps) === null || _a === void 0 ? void 0 : _a.length)) {
                        calcStep = null;
                        isCalcSubStep = false;
                    }
                    else {
                        if ((_b = this.steps[stepIndex].subSteps) === null || _b === void 0 ? void 0 : _b.length) {
                            calcStep = this.steps[stepIndex].subSteps[0];
                            isCalcSubStep = true;
                        }
                        else {
                            calcStep = this.steps[stepIndex + 1];
                            isCalcSubStep = false;
                        }
                    }
                }
                else {
                    if (this.steps[stepIndex].subSteps.length > subStepIndex + 1) {
                        calcStep = this.steps[stepIndex].subSteps[subStepIndex + 1];
                        isCalcSubStep = true;
                    }
                    else {
                        if (this.steps.length > stepIndex + 1) {
                            calcStep = this.steps[stepIndex + 1];
                            isCalcSubStep = false;
                        }
                        else {
                            calcStep = null;
                            isCalcSubStep = false;
                        }
                    }
                }
            }
            else if (actionType === "back") {
                if (subStepIndex === -1) {
                    if (stepIndex === 0) {
                        calcStep = null;
                        isCalcSubStep = false;
                    }
                    else {
                        if ((_c = this.steps[stepIndex - 1].subSteps) === null || _c === void 0 ? void 0 : _c.length) {
                            isCalcSubStep = true;
                            calcStep =
                                this.steps[stepIndex - 1].subSteps[this.steps[stepIndex - 1].subSteps.length - 1];
                        }
                        else {
                            calcStep = this.steps[stepIndex - 1];
                            isCalcSubStep = false;
                        }
                    }
                }
                else {
                    if (subStepIndex > 0) {
                        calcStep = this.steps[stepIndex].subSteps[subStepIndex - 1];
                        isCalcSubStep = true;
                    }
                    else {
                        calcStep = this.steps[stepIndex];
                        isCalcSubStep = false;
                    }
                }
            }
        }
        this.hbrStepChange.emit({
            type: actionType,
            step: actionType === "side-nav" ? curStep : calcStep,
            isSubStep: actionType === "side-nav" ? isSubStep : isCalcSubStep,
        });
    }
    handleCollapseClick() {
        this.collapsed = !this.collapsed;
        if (this.collapsed)
            this.hbrCollapse.emit();
        else
            this.hbrExpand.emit();
    }
    getExpandedStepPanelWidth() {
        const normalizedWidth = Number(this.stepPanelWidth);
        if (Number.isNaN(normalizedWidth)) {
            return HbrStepper.DEFAULT_STEP_PANEL_WIDTH;
        }
        return Math.min(HbrStepper.MAX_STEP_PANEL_WIDTH, Math.max(HbrStepper.MIN_STEP_PANEL_WIDTH, normalizedWidth));
    }
    render() {
        var _a;
        const _aria = Object.assign(Object.assign({}, this.defaultAria), this.aria);
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { cancelEnabled, cancelVisible, cancelLabel, secondaryEnabled, secondaryVisible, secondaryLabel, primaryEnabled, primaryVisible, primaryLabel, changesSavedVisible, changesSavedLabel, hideLeft, } = this;
        const { steps, activeStepId, collapsed, collapsible, direction } = this;
        const disableActiveStepTabFocus = this.shouldDisableActiveStepTabFocus();
        const lastVisibleStep = steps
            .slice()
            .reverse()
            .find((it) => it.status !== "hidden");
        const SidebarNav = (h("div", { class: `hbr-stepper--nav_container hbr-stepper--nav-${this.direction}` }, h("hbr-tab-vertical", { class: "hbr-stepper--nav_vertical_tabs", sentiment: "interact", collapsed: collapsed, "data-testid": "steps-container", aria: { role: "none" }, role: _aria.role === "tablist" ? "tablist" : "list", "aria-orientation": _aria.role === "tablist"
                ? direction === "column"
                    ? "vertical"
                    : "horizontal"
                : undefined, "aria-label": _aria.label || "Stepper" }, steps.map((step, idx) => {
            const mainSteps = generateMainStep(step, idx, lastVisibleStep.id, activeStepId, this.handleStepChange.bind(this), this.handleStepFocusIn, customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check, _aria, this.stepperId, direction === "row", disableActiveStepTabFocus);
            if (step.subSteps) {
                const subSteps = step.subSteps.map((subStep, idx) => generateSubStep(subStep, idx, lastVisibleStep.id, activeStepId, this.handleStepChange.bind(this), this.handleStepFocusIn, customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check, _aria, this.stepperId, direction === "row", disableActiveStepTabFocus));
                return (h(Fragment, null, mainSteps, subSteps));
            }
            return mainSteps;
        }))));
        const CtaBar = (h("div", { class: "hbr-stepper--cta" }, h("div", { class: "hbr-stepper--cta_left" }, cancelVisible ? (h("hbr-button", { onClick: () => this.handleStepChange("cancel", { id: null }), variant: "text", disabled: !cancelEnabled, "data-testid": "cancel" }, cancelLabel)) : null, changesSavedVisible ? (h("div", { class: "hbr-stepper--cta_changes-saved" }, changesSavedLabel)) : null), h("div", { class: "hbr-stepper--cta_right" }, secondaryVisible ? (h("hbr-button", { variant: "outline", onClick: () => this.handleStepChange("back", { id: activeStepId }), disabled: !secondaryEnabled, "data-testid": "back" }, secondaryLabel)) : null, primaryVisible ? (h("hbr-button", { onClick: () => this.handleStepChange("next", { id: activeStepId }), disabled: !primaryEnabled, "data-testid": "next" }, primaryLabel)) : null)));
        return (h(Host, null, h("div", { part: "base", style: {
                "--left-width-expanded": `${this.getExpandedStepPanelWidth()}px`,
            }, class: {
                "hbr-stepper--": true,
                "hbr-stepper--hideLeft": this.hideLeft,
                "hbr-stepper--collapsed": this.collapsed,
                "hbr-stepper--raisedFooter": this.raisedFooter,
                [`hbr-stepper--direction-${this.direction}`]: true,
            } }, hideLeft ? null : (h("div", { class: "hbr-stepper--left" }, h("div", { class: "hbr-stepper--left-header" }, h("slot", { name: "left-header" })), h("div", { class: "hbr-stepper--left-content" }, h("slot", { name: "left" }, direction === "column" ? SidebarNav : null)), h("div", { class: "hbr-stepper--left-footer" }, h("slot", { name: "left-footer" }, collapsible && direction === "column" ? (h("div", { class: "hbr-stepper--collapse-container" }, h("hbr-button", { part: "collapse-button", variant: "outline", circle: true, sentiment: "neutral", size: "small", class: "hbr-stepper--collapse-button", arialabel: collapsed
                ? _aria.collapseBtnAriaExpand
                : _aria.collapseBtnAriaCollapse, onClick: this.handleCollapseClick.bind(this), "data-testid": "collapse-button" }, h("hbr-icon", { asset: collapsed ? caretRight : caretLeft })))) : null)))), h("div", { class: "hbr-stepper--main", id: `stepper-main-${this.stepperId}` }, h("div", { class: "hbr-stepper--header" }, h("slot", { name: "header" }, direction === "row" ? SidebarNav : null)), h("div", { class: "hbr-stepper--content" }, h("slot", { name: "content" })), h("div", { class: "hbr-stepper--footer" }, h("slot", { name: "footer" }, CtaBar))))));
    }
    get host() { return this; }
    static get style() { return HbrStepperStyle0; }
}, [4, "hbr-stepper", {
        "steps": [16],
        "activeStepId": [1, "active-step-id"],
        "cancelEnabled": [4, "cancel-enabled"],
        "cancelVisible": [4, "cancel-visible"],
        "cancelLabel": [1, "cancel-label"],
        "secondaryEnabled": [4, "secondary-enabled"],
        "secondaryVisible": [4, "secondary-visible"],
        "secondaryLabel": [1, "secondary-label"],
        "primaryEnabled": [4, "primary-enabled"],
        "primaryVisible": [4, "primary-visible"],
        "primaryLabel": [1, "primary-label"],
        "changesSavedVisible": [4, "changes-saved-visible"],
        "changesSavedLabel": [1, "changes-saved-label"],
        "hideLeft": [4, "hide-left"],
        "raisedFooter": [4, "raised-footer"],
        "collapsible": [516],
        "collapsed": [516],
        "direction": [513],
        "stepPanelWidth": [514, "step-panel-width"],
        "aria": [16]
    }]);
HbrStepper$1.DEFAULT_STEP_PANEL_WIDTH = 320;
HbrStepper$1.MIN_STEP_PANEL_WIDTH = 200;
HbrStepper$1.MAX_STEP_PANEL_WIDTH = 400;
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-stepper", "hbr-button", "hbr-icon", "hbr-icon-button", "hbr-panel", "hbr-spinner", "hbr-tab", "hbr-tab-vertical", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-stepper":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrStepper$1);
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
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-panel":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-tab":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-tab-vertical":
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

const HbrStepper = HbrStepper$1;
const defineCustomElement = defineCustomElement$1;

export { HbrStepper, defineCustomElement };

