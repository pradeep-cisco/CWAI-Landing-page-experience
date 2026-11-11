import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { g as generateShortID } from './function-helper.js';

const progressRingCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--stroke-width:var(--hbr-spacing-xs);--percentage-color:var(--info-border-default);--track-color:var(--base-border-default);--display:inline-flex;display:var(--display)}.progress-ring{display:var(--display);align-items:center;justify-content:center;position:relative}.progress-ring__image{transform:rotate(-90deg);transform-origin:50% 50%}.progress-ring__track{stroke:var(--track-color);stroke-width:var(--stroke-width)}.progress-ring__percentage{stroke:var(--percentage-color);stroke-width:var(--stroke-width);transition:0.35s stroke-dashoffset, 0.35s stroke}.progress-ring__label{display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;width:100%;height:100%;text-align:center;user-select:none;color:var(--base-text-medium-default)}.progress-ring--indeterminate .progress-ring__percentage{transform-origin:center;animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
const HbrProgressRingStyle0 = progressRingCss;

const Progress = /*@__PURE__*/ proxyCustomElement(class Progress extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.size = 128;
        this.label = "";
        this.strokeWidth = 8;
        this.percentage = undefined;
        this.indeterminate = false;
        this.uniqueId = generateShortID();
    }
    get labelId() {
        return `hbrProgressRing-label-${this.uniqueId}`;
    }
    handlePercentageChange() {
        this.updateProgress();
    }
    componentDidLoad() {
        this.updateProgress();
    }
    updateProgress() {
        const radius = this.indicator.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = this.indeterminate
            ? circumference - (25 / 100) * circumference
            : circumference - (this.percentage / 100) * circumference;
        this.indicator.style.strokeDasharray = `${circumference} ${circumference}`;
        this.indicator.style.strokeDashoffset = `${offset}`;
    }
    render() {
        return (h("div", { key: 'f82c2d94494379360be1efe79848410962b497c6', part: "base", class: {
                "progress-ring": true,
                "progress-ring--indeterminate": this.indeterminate,
            }, role: "progressbar", "aria-label": this.label.length > 0 ? this.label : "progress", "aria-describedby": this.indeterminate ? null : this.labelId, "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": this.indeterminate ? null : this.percentage }, h("svg", { key: '84265ef854195e35fd48e07a2786c40dfc894cb0', class: "progress-ring__image", width: this.size, height: this.size }, h("title", { key: 'ea8290fb587085cdf498991174b1962bbb077f11' }, this.label), h("circle", { key: 'da49a41262e4c07ace30d7d2d95f531b4d6983c3', class: "progress-ring__track", "stroke-width": this.strokeWidth, "stroke-linecap": "round", fill: "transparent", r: this.size / 2 - this.strokeWidth * 2, cx: this.size / 2, cy: this.size / 2 }), h("circle", { key: 'ddb6d881a578e6f77c8ae0ee1937add57e3bb623', part: "percentage", ref: (el) => {
                this.indicator = el;
            }, class: "progress-ring__percentage", "stroke-width": this.strokeWidth, "stroke-linecap": "round", fill: "transparent", r: this.size / 2 - this.strokeWidth * 2, cx: this.size / 2, cy: this.size / 2 })), this.indeterminate ? null : (h("span", { part: "label", id: this.labelId, class: "progress-ring__label" }, h("slot", null)))));
    }
    static get watchers() { return {
        "percentage": ["handlePercentageChange"]
    }; }
    static get style() { return HbrProgressRingStyle0; }
}, [1, "hbr-progress-ring", {
        "size": [2],
        "label": [1],
        "strokeWidth": [2, "stroke-width"],
        "percentage": [2],
        "indeterminate": [4],
        "uniqueId": [1, "unique-id"]
    }, undefined, {
        "percentage": ["handlePercentageChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-progress-ring"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-progress-ring":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Progress);
            }
            break;
    } });
}

const HbrProgressRing = Progress;
const defineCustomElement = defineCustomElement$1;

export { HbrProgressRing, defineCustomElement };

