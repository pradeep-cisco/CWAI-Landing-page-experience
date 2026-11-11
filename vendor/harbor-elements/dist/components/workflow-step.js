import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as check } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$1 } from './icon.js';

const workflowStepCss = ".wf-step{height:28px;display:block;line-height:28px;padding:8px 0 8px 24px;font-size:14px;cursor:pointer}.wf-step-border-right{float:right;width:3px;border-radius:3px;height:44px;position:relative;top:-8px}.wf-step-number{width:24px;height:24px;display:inline-flex;justify-content:center;border:2px solid #326CD1;border-radius:16px;margin-right:12px;line-height:24px}.wf-step-completed-icon{font-size:20px;margin-top:2px;color:#326CD1}.wf-step-title{display:inline-block;color:#464C54}.wf-step_idle .wf-step-title{color:#6F7680}.wf-step_idle .wf-step-number{color:#6F7680;border-color:#E1E4E8}.wf-step_hovered .wf-step-title{color:#326CD1}.wf-step_hovered .wf-step-border-right{background-color:#CCDEFC}.wf-step_idle_hovered .wf-step-number{border-color:#D9E7FF;background-color:#D9E7FF;color:#235EC4}.wf-step_completed .wf-step-title{vertical-align:top}.wf-step_disabled{cursor:no-drop}.wf-step_disabled .wf-step-title{color:#C1C6CC}.wf-step_disabled .wf-step-number{color:#C1C6CC;border-color:#C1C6CC}.wf-step_disabled .wf-step-border-right{background-color:#ffffff}.wf-step_current .wf-step-number{background-color:#326CD1;color:#ffffff}.wf-step_current .wf-step-title{color:#326CD1;vertical-align:baseline}.wf-step_current .wf-step-border-right{background-color:#326CD1}.wf-step_not-active .wf-step-title{display:none}";
const HbrWorkflowStepStyle0 = workflowStepCss;

const HbrWorkflowStep = /*@__PURE__*/ proxyCustomElement(class HbrWorkflowStep extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.onHover = (value) => {
            this.hovered = value;
        };
        this.current = false;
        this.completed = false;
        this.disabled = false;
        this.number = undefined;
        this.stepTitle = undefined;
        this.stepperActive = true;
        this.hovered = false;
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        console.error("hbr-workflow-step is deprecated in January 2025. Please use hbr-stepper instead.");
        return (h(Host, { key: 'a39cad5ea16afd94b500c5d71b4d62f66ae40d1e' }, h("div", { key: '262a3ab22dc63f22442cff650de68408e1489220', class: `
            wf-step
            ${this.hovered ? "wf-step_hovered" : ""}
            ${this.current ? "wf-step_current" : ""}
            ${this.disabled ? "wf-step_disabled" : ""}
            ${this.completed ? "wf-step_completed" : ""}
            ${!this.completed && !this.disabled && !this.current
                ? "wf-step_idle"
                : ""}
            ${!this.completed && !this.disabled && !this.current && this.hovered
                ? "wf-step_idle_hovered"
                : ""}
            ${!this.stepperActive ? "wf-step_not-active" : ""}
          `, onMouseEnter: () => this.onHover(true), onMouseLeave: () => this.onHover(false) }, h("div", { key: 'c84daab87b087fd031d8c9189473d300644c2371', class: "wf-step-number" }, this.completed && !this.current ? (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check) || check, class: "wf-step-completed-icon" })) : (this.number)), h("div", { key: 'afd7f75386e3ad6dc395a5a7f95574da2472595a', class: "wf-step-title" }, this.stepTitle), h("div", { key: 'f71698555d8a7d28516903f626bae854e03d6a09', class: "wf-step-border-right" }))));
    }
    get host() { return this; }
    static get style() { return HbrWorkflowStepStyle0; }
}, [1, "hbr-workflow-step", {
        "current": [4],
        "completed": [4],
        "disabled": [4],
        "number": [2],
        "stepTitle": [1, "step-title"],
        "stepperActive": [4, "stepper-active"],
        "hovered": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-workflow-step", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-workflow-step":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrWorkflowStep);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrWorkflowStep as H, defineCustomElement as d };

