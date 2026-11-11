import { proxyCustomElement, HTMLElement, createEvent, h, Host, Fragment } from '@stencil/core/internal/client';
import { Q as alertsWarningLarge } from './index2.js';
import { d as defineCustomElement$d } from './banner.js';
import { d as defineCustomElement$c } from './button.js';
import { d as defineCustomElement$b } from './checkbox.js';
import { d as defineCustomElement$a } from './icon.js';
import { d as defineCustomElement$9 } from './icon-button.js';
import { d as defineCustomElement$8 } from './modal.js';
import { d as defineCustomElement$7 } from './popup.js';
import { d as defineCustomElement$6 } from './scroll-view.js';
import { d as defineCustomElement$5 } from './spinner.js';
import { d as defineCustomElement$4 } from './tooltip.js';
import { d as defineCustomElement$3 } from './visually-hidden.js';
import { d as defineCustomElement$2 } from './workflow-step.js';

const workflowCss = ":host{display:block}:host hbr-modal::part(panel){width:576px;min-height:246px}:host hbr-modal::part(body){padding:24px;color:var(--interact-text-weak-default)}:host hbr-modal::part(footer){height:82px;padding:24px}:host hbr-modal .modal-title{font-size:var(--hbr-font-size-xl);padding-bottom:var(--hbr-spacing-md)}:host hbr-modal .modal-message{font-size:var(--hbr-font-size-md)}:host hbr-modal .modal-checkbox{font-size:var(--hbr-font-size-sm)}:host hbr-modal .modal-message,:host hbr-modal .modal-checkbox{padding-bottom:var(--hbr-spacing-lg);font-weight:var(--hbr-font-weight-light)}:host hbr-modal .modal-cancel-button{margin-right:16px}.wf-wrapper-magnetic{display:flex;height:570px;width:960px;box-shadow:var(--hbr-shadow-md);border-radius:var(--hbr-border-radius-lg)}.wf-wrapper-magnetic .wf-content-area{width:calc(100% - 76px);position:relative}.wf-wrapper-magnetic .wf-user-content{max-height:calc(100% - 78px);overflow:scroll}.wf-wrapper-magnetic .wf-buttons{padding:var(--hbr-spacing-lg) var(--hbr-spacing-lg) 0}.wf-stepper{position:relative;padding-top:var(--hbr-spacing-lg);width:76px;height:calc(100% - 24px);border-right:1px solid #E1E4E8}.wf-stepper_active{width:320px}.wf-stepper-toggle{border:2px solid #E1E4E8;border-radius:var(--hbr-border-radius-circle);color:#6F7680;position:absolute;right:24px;bottom:18px;width:24px;height:24px;display:flex;justify-content:center;align-items:center;cursor:pointer}.wf-stepper-toggle:hover{background-color:#D9E7FF;border-color:#D9E7FF;color:#235EC4}.wf-stepper-item{height:44px;padding-bottom:var(--hbr-spacing-sm)}.wf-control-area{height:80px;width:100%;right:0;bottom:0;position:relative;bottom:0}.wf-buttons{padding:var(--hbr-spacing-lg);width:calc(100% - 48px);display:flex;margin-right:var(--hbr-spacing-lg);justify-content:space-between}.wf-control-buttons{width:200px;display:flex;justify-content:space-between}.wf-navigate-buttons{display:flex;gap:20px}.wf-status-area{cursor:pointer;position:absolute;width:100%;height:8px;background-color:var(--base-bg-default);transition:height 0.3s cubic-bezier(0, 0, 0.2, 1)}.wf-status-area--active{height:10px}.wf-status-bar{width:0;margin-top:1px;height:6px;background:var(--interact-text-default);transition:width 0.6s cubic-bezier(0, 0, 0.2, 1), height 0.3s cubic-bezier(0, 0, 0.2, 1)}.wf-status-bar--active{height:10px}.wf-tooltip{position:relative;height:30px}.wf-tooltip hbr-tooltip{--hbr-tooltip-background-color:var(--control-bg-weak-default);--hbr-tooltip-max-width:300px;--hbr-tooltip-padding:var(--hbr-spacing-lg);--hbr-tooltip-arrow-start-end-offset:15px;--hbr-tooltip-arrow-size:11px}.wf-status-step{padding:var(--hbr-spacing-xs) var(--hbr-spacing-md);color:var(--interact-text-active);cursor:pointer}.wf-status-step:hover{color:var(--interact-text-hover)}.wf-status-step--current{cursor:not-allowed}.wf-status-step--disabled{color:var(--base-text-disabled);cursor:not-allowed}.wf-status-step--disabled:hover{color:var(--base-text-disabled)}.hbr-fw-btn{padding-top:var(--hbr-spacing-sm);padding-bottom:var(--hbr-spacing-sm)}.wf-exit-button{display:inline-block}.wf-autosave{color:var(--control-icon-in-medium-default);font-size:var(--hbr-font-size-xs);display:inline-block;margin-left:var(--hbr-spacing-lg)}";
const HbrWorkflowStyle0 = workflowCss;

let steps = [];
const HbrWorkflows = /*@__PURE__*/ proxyCustomElement(class HbrWorkflows extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.HbrLaunch = createEvent(this, "hbr-launch", 7);
        this.HbrRestart = createEvent(this, "hbr-restart", 7);
        this.HbrNext = createEvent(this, "hbr-next", 7);
        this.HbrLeave = createEvent(this, "hbr-leave", 7);
        this.HbrExit = createEvent(this, "hbr-complete", 7);
        this.HbrAutoSave = createEvent(this, "hbr-autosave", 7);
        this.HbrModalShow = createEvent(this, "hbr-modal-show", 7);
        this.restartWorkflow = () => {
            this.closeModal();
            this.HbrRestart.emit({ uuid: this.uuid, resolver: this.resolver });
        };
        this.themeHandler = ({ activeTheme }) => {
            if (activeTheme.isCohesionV1) {
                this.theme = "cohesion";
            }
            else if (activeTheme.isCohesion) {
                this.theme = "cohesion";
            }
            else if (activeTheme.isMagnetic) {
                this.theme = "magnetic";
            }
        };
        this.modalCheckboxChange = () => {
            this.HbrModalShow.emit(!this.doNotShowExitModal);
            this.doNotShowExitModal = !this.doNotShowExitModal;
        };
        this.autosave = () => {
            this.saveInProgress = true;
            this.HbrAutoSave.emit({
                uuid: this.uuid,
                state: this.state,
                resolver: this.autoSaveResolver,
            });
        };
        this.getStepById = (stepId) => {
            const step = steps.filter((i) => i.id === stepId);
            if (step.length > 0) {
                return step[0];
            }
            console.error(`step with "${stepId}" doesn't exist`);
        };
        this.navigateToStep = (step) => {
            var _a, _b;
            this.navigate(step.path, { state: this.state });
            this.currentStep = step;
            if (!this.customBehavior) {
                this.prevStepId = (_a = this.getPrevStep(this.currentStep)) === null || _a === void 0 ? void 0 : _a.id;
                this.nextStepId = (_b = this.getNextStep(this.currentStep)) === null || _b === void 0 ? void 0 : _b.id;
            }
        };
        this.onPrimaryClick = () => {
            const nextStep = this.getStepById(this.nextStepId);
            this.navigateToStep(nextStep);
            this.HbrNext.emit({
                uuid: this.uuid,
                state: this.state,
                stepId: this.currentStep.id,
                resolver: this.stepResolver,
            });
        };
        this.onComplete = () => {
            this.HbrExit.emit({ uuid: this.uuid, state: this.state });
        };
        this.onSecondaryClick = () => {
            const prevStep = this.getStepById(this.prevStepId);
            this.navigateToStep(prevStep);
            this.HbrNext.emit({
                uuid: this.uuid,
                state: this.state,
                stepId: this.currentStep.id,
                resolver: this.stepResolver,
            });
        };
        this.openModal = () => {
            var _a;
            (_a = this.modal) === null || _a === void 0 ? void 0 : _a.show();
        };
        this.closeModal = () => {
            this.modalTheme = "";
            this.modal.hide();
        };
        this.onExitClick = () => {
            this.modal.hide();
            this.HbrLeave.emit({
                uuid: this.uuid,
                state: this.state,
                customBehaviour: true,
                doNotShowExitModal: this.doNotShowExitModal,
            });
        };
        this.isStepReady = (stepId) => {
            return this.completedSteps.includes(stepId);
        };
        this.tooltipHover = (value) => {
            this.tooltipActive = value;
        };
        this.getStepStatusArr = (stepId, state) => {
            const steps = [];
            let num = 0;
            let rate = 0;
            steps.forEach((it) => {
                num++;
                if (it.id === stepId) {
                    rate = (num / steps.length) * 100;
                }
                steps.push(Object.assign(Object.assign({}, it), { completed: !!Object.keys(state).length && Object.keys(state).includes(it.id), current: it.id === stepId }));
            });
            return { stepsStatus: steps, rate };
        };
        this.resolver = ({ state = {}, currStepId, nextStepId, prevStepId, statusData, completedSteps = [], doNotShowExitModal = false, initialState = false, }) => {
            var _a, _b;
            if (currStepId) {
                // custom framework behaviour
                this.nextStepId = nextStepId;
                this.prevStepId = prevStepId;
                this.navigateToStep(this.getStepById(currStepId));
                this.statusData = statusData;
                this.customBehavior = true;
                this.completedSteps = completedSteps;
            }
            else {
                // default framework behaviour
                let currStep = 0;
                if (state && Object.keys(state).length === 0) {
                    currStep = 0;
                }
                else if (Object.keys(state).length === steps.length) {
                    currStep = steps.length - 1;
                    this.lastStep = true;
                }
                else {
                    let i = 0;
                    while (!currStep) {
                        const stepId = steps[i].id;
                        if (!(Object.keys(state).includes(stepId) && !!state[stepId])) {
                            currStep = i;
                        }
                        i++;
                    }
                }
                this.currentStep = steps[currStep];
                this.prevStepId = (_a = this.getPrevStep(this.currentStep)) === null || _a === void 0 ? void 0 : _a.id;
                this.nextStepId = (_b = this.getNextStep(this.currentStep)) === null || _b === void 0 ? void 0 : _b.id;
                this.navigateToStep(steps[currStep]);
                this.statusData = this.getStepStatusArr(steps[currStep], this.state);
                this.completedSteps = Object.keys(this.state);
                this.workflowReady = true;
            }
            if (initialState) {
                this.workflowReady = true;
            }
            else {
                this.modalTheme = "resume";
            }
            this.doNotShowExitModal = doNotShowExitModal;
            this.state = state;
            this.HbrNext.emit({
                uuid: this.uuid,
                state: this.state,
                stepId: this.currentStep.id,
                resolver: this.stepResolver,
            });
        };
        this.stepResolver = ({ state, nextStepId, prevStepId, statusData, completedSteps, }) => {
            this.state = Object.assign(Object.assign({}, this.state), state);
            if (this.customBehavior) {
                this.nextStepId = nextStepId;
                this.prevStepId = prevStepId;
                this.statusData = statusData;
                if (completedSteps) {
                    this.completedSteps = completedSteps;
                }
                else {
                    this.statusData = this.getStepStatusArr(this.currentStep, this.state);
                    this.completedSteps = Object.keys(this.state);
                }
            }
        };
        this.autoSaveResolver = (success) => {
            if (success) {
                this.saveInProgress = false;
            }
        };
        this.toggleStepper = () => {
            this.stepperActive = !this.stepperActive;
        };
        this.navTree = undefined;
        this.theme = undefined;
        this.currentStep = undefined;
        this.positions = [];
        this.nextStepId = "";
        this.prevStepId = "";
        this.lastStep = false;
        this.state = {};
        this.tooltipActive = false;
        this.statusData = {
            stepsStatus: [],
            rate: 0,
        };
        this.customBehavior = false;
        this.completedSteps = [];
        this.stepperActive = true;
        this.saveInProgress = false;
        this.doNotShowExitModal = false;
        this.modalTheme = "";
        this.workflowReady = false;
    }
    handleModalTheme() {
        if (this.modalTheme.length && this.modal) {
            this.openModal();
        }
    }
    componentWillLoad() {
        if (this.navTree) {
            steps = this.navTree
                .children(this.uuid)
                .sort((a, b) => a.position - b.position);
        }
        else {
            console.log(this.childRoutes);
            steps = this.childRoutes.sort((a, b) => a.position - b.position);
        }
        this.positions = steps.map((a) => a.position);
        this.HbrLaunch.emit({ uuid: this.uuid, resolver: this.resolver });
        if (this.autoSave) {
            this.interval = setInterval(this.autosave, 10000);
        }
    }
    componentDidLoad() {
        if (!this.workflowReady && this.modalTheme === "resume") {
            this.openModal();
        }
    }
    disconnectedCallback() {
        this.HbrLeave.emit({ uuid: this.uuid, state: this.state });
        if (this.autoSave) {
            clearInterval(this.interval);
        }
    }
    getNextStep(step) {
        const index = this.positions.indexOf(step.position) + 1;
        if (index === steps.length) {
            this.lastStep = true;
        }
        return steps[index];
    }
    getPrevStep(step) {
        const index = this.positions.indexOf(step.position) - 1;
        if (this.lastStep) {
            this.lastStep = false;
        }
        return steps[index];
    }
    render() {
        console.error("hbr-workflow-step is deprecated in January 2025. Please use hbr-stepper instead.");
        const { stepsStatus, rate } = this.statusData;
        return (h(Host, { key: '4d73dddaae942546827daa398eddecbcb0be3662' }, this.workflowReady ? (h("div", { class: `wf-wrapper wf-wrapper-${this.theme}` }, this.theme === "cohesion" && (h("div", { class: "wf-tooltip", part: "wf-status-bar" }, h("hbr-tooltip", { class: "wf-tooltip-component", trigger: "click", placement: "bottom" }, h("div", { slot: "content" }, h("div", { class: "wf-status-steps" }, stepsStatus === null || stepsStatus === void 0 ? void 0 : stepsStatus.map((it, key) => (h("div", { class: `
                            wf-status-step
                            ${!it.completed && !it.current
                ? "wf-status-step--disabled"
                : ""}
                            ${it.current ? "wf-status-step--current" : ""}`, key: key.toString(), onClick: () => {
                if (it.completed) {
                    this.HbrNext.emit({
                        uuid: this.uuid,
                        state: this.state,
                        stepId: it.id,
                        resolver: this.stepResolver,
                    });
                    this.navigateToStep(it);
                }
            } }, it.title))))), h("div", { onMouseEnter: () => this.tooltipHover(true), onMouseLeave: () => this.tooltipHover(false), class: `wf-status-area ${this.tooltipActive ? "wf-status-area--active" : ""}` }, h("div", { class: `wf-status-bar ${this.tooltipActive ? "wf-status-bar--active" : ""}`, style: { width: `${rate}%` } }))))), this.theme === "magnetic" && (h("div", { class: `wf-stepper ${this.stepperActive ? "wf-stepper_active" : ""}` }, stepsStatus.map((it, key) => (h("div", { class: "wf-stepper-item", key: key.toString(), onClick: () => {
                if (!it.disabled) {
                    this.HbrNext.emit({
                        uuid: this.uuid,
                        state: this.state,
                        stepId: it.id,
                        resolver: this.stepResolver,
                    });
                    this.navigateToStep(it);
                }
            } }, h("hbr-workflow-step", { number: it.number, current: it.current, stepTitle: it.title, completed: it.completed, disabled: it.disabled, stepperActive: this.stepperActive })))), h("div", { class: "wf-stepper-toggle", onClick: this.toggleStepper }, h("hbr-icon", { name: `caret-${this.stepperActive ? "left" : "right"}` })))), h("div", { class: "wf-content-area" }, h("div", { class: "wf-user-content" }, h("slot", null)), h("div", { class: "wf-control-area", part: "wf-control-area" }, h("div", { class: "wf-buttons", part: "wf-buttons" }, h("div", null, h("div", { part: "wf-exit-button", class: "wf-exit-button" }, h("hbr-button", { class: "hbr-fw-btn --left-margin", onClick: this.doNotShowExitModal
                ? this.onExitClick
                : () => {
                    this.modalTheme = "exit";
                }, variant: "text", size: "small" }, this.theme === "magnetic" ? "Cancel" : "Exit")), this.autoSave && (h("div", { part: "wf-autosave", class: "wf-autosave" }, this.saveInProgress
            ? "Saving..."
            : "All changes saved"))), h("div", { class: "wf-navigate-buttons", part: "wf-navigate-buttons" }, !!Object.keys(this.state).length &&
            ((this.customBehavior && this.prevStepId) ||
                (!this.customBehavior &&
                    !(this.currentStep.id === steps[0].id))) && (h("div", { part: "wf-secondary-button" }, h("hbr-button", { class: "hbr-fw-btn", onClick: this.onSecondaryClick, variant: "outline", size: "small" }, "Back"))), (this.isStepReady(this.currentStep.id) ||
            this.theme === "magnetic") && (h("div", { part: "wf-primary-button" }, h("hbr-button", { class: "hbr-fw-btn --left-margin --right-margin", onClick: (!this.customBehavior && !this.lastStep) ||
                (this.customBehavior && this.nextStepId)
                ? this.onPrimaryClick
                : this.onComplete, variant: "fill", size: "small", disabled: !this.isStepReady(this.currentStep.id) }, (!this.customBehavior && !this.lastStep) ||
            (this.customBehavior && this.nextStepId)
            ? "Next"
            : "Complete"))))))))) : null, h("hbr-modal", { key: 'de4538af604f2f1c21862b66d0a1d54641be2a4d', ref: (el) => {
                this.modal = el;
                return this.modal;
            }, noHeader: true, class: "dialog-width" }, h("div", { key: '41fadde3631562502b7a30fe5d8e13e98f19da99' }, h("div", { key: 'e2808b006f7b47c586b2881d011ab997c7af0ba6', class: "modal-title" }, "Confirmation title"), this.modalTheme === "exit" && (h(Fragment, null, h("div", { class: "modal-message" }, "Your current progress will be saved automatically when you exit."), h("div", { class: "modal-checkbox", "onHbr-click": this.modalCheckboxChange }, h("hbr-checkbox", null, "Don\u2019t show this to me again")))), " ", this.modalTheme === "resume" && (h(Fragment, null, h("div", { class: "modal-message" }, "\u2018Resume\u2019 will launch the workflow from where you last left off. \u2018Restart\u2019 allows you to start a new workflow."), h("div", { class: "modal-checkbox" }, h("hbr-banner", { sentiment: "warning", variant: "fill", open: true }, h("hbr-icon", { slot: "icon", asset: alertsWarningLarge }), "'Restart' will delete all saved progress. This action can't be undone."))))), h("div", { key: '356865eb653ce7e1dfa06bc86da374ac9c50881c', slot: "footer" }, h("hbr-button", { key: '9c0a25ed032376e2c0a950bb107229b24f871d7a', class: "hbr-fw-btn modal-cancel-button", onClick: this.modalTheme === "exit"
                ? this.closeModal
                : this.restartWorkflow, variant: "text", size: "small" }, this.modalTheme === "exit" ? "Cancel" : "Restart"), h("hbr-button", { key: '1028dddd324af5e3809f58c97385dc995422f683', class: "hbr-fw-btn", onClick: this.modalTheme === "exit"
                ? this.onExitClick
                : () => {
                    this.closeModal();
                    this.workflowReady = true;
                }, variant: "fill", size: "small" }, this.modalTheme === "exit" ? "Exit" : "Resume")))));
    }
    static get watchers() { return {
        "modalTheme": ["handleModalTheme"]
    }; }
    static get style() { return HbrWorkflowStyle0; }
}, [1, "hbr-workflow", {
        "navTree": [16],
        "theme": [32],
        "currentStep": [32],
        "positions": [32],
        "nextStepId": [32],
        "prevStepId": [32],
        "lastStep": [32],
        "state": [32],
        "tooltipActive": [32],
        "statusData": [32],
        "customBehavior": [32],
        "completedSteps": [32],
        "stepperActive": [32],
        "saveInProgress": [32],
        "doNotShowExitModal": [32],
        "modalTheme": [32],
        "workflowReady": [32]
    }, undefined, {
        "modalTheme": ["handleModalTheme"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-workflow", "hbr-banner", "hbr-button", "hbr-checkbox", "hbr-icon", "hbr-icon-button", "hbr-modal", "hbr-popup", "hbr-scroll-view", "hbr-spinner", "hbr-tooltip", "hbr-visually-hidden", "hbr-workflow-step"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-workflow":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrWorkflows);
            }
            break;
        case "hbr-banner":
            if (!customElements.get(tagName)) {
                defineCustomElement$d();
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-checkbox":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-modal":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-scroll-view":
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
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-workflow-step":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrWorkflow = HbrWorkflows;
const defineCustomElement = defineCustomElement$1;

export { HbrWorkflow, defineCustomElement };

