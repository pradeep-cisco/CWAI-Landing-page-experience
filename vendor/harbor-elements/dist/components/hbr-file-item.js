import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { r as alertsNegativeLarge, v as paperclip, t as trashSimple } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$8 } from './icon.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$9 } from './button.js';
import { d as defineCustomElement$7 } from './icon-button.js';
import { d as defineCustomElement$6 } from './popup.js';
import { d as defineCustomElement$5 } from './progress-bar.js';
import { d as defineCustomElement$4 } from './spinner.js';
import { d as defineCustomElement$3 } from './tooltip.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const fileItemCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host([size=small]){--progress-min-width:80px;--container-gap:var(--hbr-spacing-xs, 8px);--label-font-size:var(--hbr-font-size-xs);--spinner-margin:0 var(--hbr-spacing-2xs)}:host{--width-medium:400px;--width-small:320px;--width:var(--width-medium);--progress-min-width:120px;--border-color:var(--control-border-weak-default);--error-bg-color:var(--negative-bg-medium-default);--icon-color:var(--interact-icon-weak-default);--disabled-file-name:var(--base-text-disabled);--disabled-icon-color:var(--control-icon-weak-disabled);--error-text-color:var(--negative-text-default);--error-icon-color:var(--negative-icon-default);--file-name-color:var(--base-text-default);--remove-icon-hover-color:var(--interact-icon-weak-hover);--thumbnail-file-error:var(--negative-bg-disabled);--no-image-bg-color:var(--base-text-disabled);--no-image-disabled-bg-color:var(--base-bg-default);--spinner-color:var(--interact-icon-weak-default)}:host([size=small]){--width:var(--width-small)}.file-item{list-style:none;border-bottom:1px solid var(--border-color);width:var(--width)}.file-item.file-item--single,.file-item.file-item-first-of-type{border-top:1px solid var(--border-color)}.file-item.file-item--thumbnail .file-item__thumbnail+.file-item__name{margin-right:auto}.file-item.file-item--thumbnail .file-item__thumbnail{color:var(--icon-color)}.file-item.file-item--thumbnail .file-item__thumbnail.no-image-available{background-color:var(--no-image-bg-color)}.file-item.file-item--thumbnail .file-item__thumbnail.no-image-available.disabled{background-color:var(--no-image-disabled-bg-color)}.file-item.file-item--thumbnail.file-item--medium .file-item__thumbnail{width:48px;height:48px}.file-item.file-item--thumbnail.file-item--small .file-item__thumbnail{width:32px;height:32px}.file-item.file-item--thumbnail .file-item__thumbnail.error{background-color:var(--thumbnail-file-error)}.file-item.file-item--thumbnail .file-item__status-icon.remove{padding:7px}.file-item.file-item--thumbnail.file-item--small .file-item__status-icon.remove{padding:6px}.file-item .file-item__container{display:flex;justify-content:space-between;align-items:center;border-radius:var(--hbr-border-radius-md, 6px);gap:var(--container-gap, var(--hbr-spacing-md, 16px));border-radius:var(--hbr-border-radius-md, 6px);margin-top:var(--hbr-spacing-2xs, 4px);margin-bottom:var(--hbr-spacing-2xs, 4px);padding:var(--file-item-padding, var(--hbr-spacing-xs, 8px))}.file-item.file-item--error .file-item__container{background-color:var(--error-bg-color)}.file-item .file-item__name{display:flex;align-items:center;gap:var(--file-name-gap, var(--hbr-spacing-2xs, 4px));overflow:hidden}.file-item .file-item__name .file-item__label{overflow:hidden;white-space:nowrap;cursor:pointer;color:var(--file-name-color);font-size:var(--label-font-size, var(--hbr-font-size-sm, 14px));line-height:var(--hbr-font-line-height-dense, 20px);height:20px}.file-item.file-item--readonly .file-item__container .file-item__name{cursor:default}.file-item.file-item--readonly .file-item__container .file-item__name .file-item__label{cursor:inherit}.file-item.file-item--small .file-item__container{margin-top:var(--hbr-spacing-3xs, 2px);margin-bottom:var(--hbr-spacing-3xs, 2px);padding:var(--hbr-spacing-2xs, 4px)}.file-item.file-item--small .file-item__label{font-size:var(--hbr-font-size-xs, 12px);line-height:var(--hbr-font-line-height-normal, 18px);height:18px}.file-item.file-item--small.file-item--thumbnail{padding:var(--hbr-spacing-3xs, 2px) 0px}.file-item.file-item--small.file-item--thumbnail .file-item__container{padding:var(--file-item-padding, var(--hbr-spacing-2xs, 4px));margin-top:var(--hbr-spacing-2xs, 4px);margin-bottom:var(--hbr-spacing-2xs, 4px)}.file-item:not(.file-item--thumbnail).file-item--small .file-item__name{gap:var(--file-name-gap, var(--hbr-spacing-3xs))}.file-item:not(.file-item--thumbnail) .file-item__status-icon.remove{padding-left:var(--hbr-spacing-md)}.file-item__paperclip,.file-item__status-icon.remove{color:var(--icon-color)}.file-item--progress .file-item__name,.file-item--loading .file-item__name{color:var(--disabled-file-name)}.file-item--progress .file-item__name .file-item__label,.file-item--loading .file-item__name .file-item__label{color:var(--disabled-file-name)}.file-item--progress .file-item__name .file-item__prefix,.file-item--progress .file-item__name .file-item__paperclip,.file-item--loading .file-item__name .file-item__prefix,.file-item--loading .file-item__name .file-item__paperclip{color:var(--disabled-icon-color)}.file-item__paperclip,.file-item__status-icon.remove::part(base){font-size:var(--hbr-font-size-md, 16px)}.file-item__prefix{display:flex}p.file-item__error{margin:0px}.file-item--has-error .file-item__error{color:var(--error-text-color);padding-bottom:var(--hbr-spacing-2xs);margin:inherit;font-size:var(--hbr-font-size-xs);line-height:var(--hbr-font-line-height-normal, 18px)}.file-item__icon--error{font-size:var(--hbr-font-size-md, 16px);color:var(--error-icon-color);--path-color-1:var(--base-text-in-default);--path-color-2:var(--base-text-in-default)}.file-item__status-icon.remove::part(base){width:28px;height:28px;--label-color:initial}.file-item__status-icon.remove::part(base):hover{color:var(--remove-icon-hover-color)}.file-item--small .file-item__status-icon.remove::part(base){height:18px}.file-item--thumbnail .file-item__status-icon.remove::part(base){width:20px;height:20px;font-size:20px}.file-item--small.file-item--thumbnail .file-item__status-icon.remove::part(base){width:16px;height:16px;font-size:16px}.file-item__status-icon.loading{font-size:20px;color:var(--spinner-color);margin:var(--spinner-margin)}hbr-icon-button.file-item__status-icon.remove::part(base){display:flex;padding:6px;justify-content:center;align-items:center;gap:var(--hbr-spacing-2xs, 4px)}";
const HbrFileItemStyle0 = fileItemCss;

let id = 0;
const FileItem = /*@__PURE__*/ proxyCustomElement(class FileItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrRemove = createEvent(this, "hbr-remove", 7);
        this.componentId = `hbr-file-item-${++id}`;
        this.renderPrefix = (thumbnail, state) => {
            var _a;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            if (!this.hasPrefix) {
                if (state === "error") {
                    return (h("hbr-icon", { part: "prefix-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["alerts-negative-large"]) ||
                            alertsNegativeLarge, class: "file-item__icon--error" }));
                }
                if (!thumbnail) {
                    return (h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.paperclip) || paperclip, part: "prefix-icon", class: "file-item__paperclip" }));
                }
            }
            if (this.hasPrefix) {
                // Make sure to render if this.hasPrefix to prevent adding few extra pixels on DOM even with dimension of 0*0 when prefix was not set
                return (h("span", { part: "prefix", class: "file-item__prefix" }, h("slot", { name: "prefix" })));
            }
        };
        this.renderSuffix = (state, percentage) => {
            if (!this.hasSuffix) {
                return state ? this.stateIconSuffix(state, percentage) : "";
            }
            return (h("span", { part: "suffix", class: "file-item__suffix" }, h("slot", { name: "suffix" })));
        };
        this.stateIconSuffix = (state, percentage) => {
            var _a, _b, _c;
            const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
            switch (state) {
                case "loading":
                    return (h("hbr-spinner", { part: "suffix", class: "file-item__suffix file-item__status-icon loading" }));
                case "progress":
                    return (h("hbr-progress-bar", { style: { minWidth: "var(--progress-min-width)" }, percentage: percentage, size: this.size, "no-suffix": true, aria: { label: ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.progressLabel) || "File upload progress" } }));
                default:
                    if (this.readonly) {
                        return "";
                    }
                    return (h("hbr-button", { variant: "text", part: "suffix", exportparts: "base:trash-button", arialabel: ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.removeFileLabel) || "Delete this file", "data-testid": "removeFile", onClick: this.handleFileDeleteClick.bind(this), class: "file-item__suffix file-item__status-icon remove" }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["trash-simple"]) || trashSimple })));
            }
        };
        this.hasPrefix = false;
        this.hasSuffix = false;
        this.hasError = false;
        this.hasThumbnailSlot = false;
        this.longName = undefined;
        this.file = undefined;
        this.disabled = undefined;
        this.size = "medium";
        this.thumbnail = undefined;
        this.state = undefined;
        this.percentage = undefined;
        this.custom = undefined;
        this.aria = undefined;
        this.readonly = false;
    }
    handleDisabledState() {
        this.host.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    handleFileDeleteClick() {
        this.hbrRemove.emit(this.file);
    }
    handleSlotChange() {
        this.hasPrefix = hasSlot(this.host, "prefix");
        this.hasSuffix = hasSlot(this.host, "suffix");
        this.hasError = hasSlot(this.host, "error");
        this.hasThumbnailSlot = hasSlot(this.host, "thumbnail");
    }
    getThumbnails() {
        const { file } = this;
        const fileReader = new FileReader();
        const img = this.imageRef; // Change the type to HTMLImageElement
        const imageFile = img.tagName === "IMG";
        if (imageFile) {
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                img.src = event.target.result; // Cast event.target.result to string
            };
        }
    }
    longFileName(fileLabel, file) {
        const scrollWidth = fileLabel.scrollWidth;
        // this.scrollWidth = scrollWidth;
        // Above throws
        // Uncaught TypeError: Cannot set property offsetWidth of #<HTMLElement> which has only a getter
        this._scrollWidth = scrollWidth;
        const clientWidth = this.fileLabel.clientWidth;
        const overflow = scrollWidth > clientWidth;
        if (overflow) {
            const oneLetterWidth = scrollWidth / file.name.length;
            /** try to figure out half point of the container */
            const halfWayToFitContainer = Math.round(clientWidth / 2 / oneLetterWidth);
            /** internal state change to trigger re-render  */
            const { name } = file;
            this.longName = `${name.slice(0, halfWayToFitContainer - 2)}...${name.slice(file.name.length + 2 - halfWayToFitContainer)}`;
        }
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        this.handleSlotChange();
    }
    componentDidLoad() {
        const { custom, fileLabel, file } = this;
        if (!custom) {
            /** show ellipsis & tooltip if file name is long */
            this.longFileName(fileLabel, file);
        }
    }
    componentDidRender() {
        if (this.thumbnail && this.imageRef) {
            this.getThumbnails();
        }
    }
    render() {
        const { custom, state, file, thumbnail, percentage } = this;
        let single;
        let firstOfType;
        if (this.host.hasAttribute("data-idx")) {
            if (this.host.getAttribute("data-idx") === "0") {
                single = true;
            }
            else if (this.host.getAttribute("data-idx") === "1") {
                firstOfType = true;
            }
        }
        /** make <ul><li> for multiple but single will use just <div> since it's not a list */
        const LI = single ? "div" : "li";
        const imageFile = this.file.type.startsWith("image/");
        const disabledState = this.disabled ||
            this.file.state === "loading" ||
            this.file.state === "progress";
        return (h(Host, { key: '10c7c8e649c4b327476db0e5ef03dcf8613b6f0c', role: !single ? "listitem" : "" }, h(LI, { key: '5c8e85bf4c67785c0f8f4f609495bb6af87ae350', ref: (el) => {
                this.fileItem = el;
            }, part: "base", role: "presentation", class: Object.assign({ "file-item": true, "file-item--single": LI === "div", "file-item--disabled": this.disabled, "file-item--small": this.size === "small", "file-item--medium": this.size === "medium", "file-item--has-prefix": this.hasPrefix, "file-item--has-suffix": this.hasSuffix, "file-item--has-error": this.hasError, "file-item-first-of-type": firstOfType, "file-item--thumbnail": thumbnail, "file-item--readonly": this.readonly }, (this.state ? { [`file-item--${this.state}`]: true } : null)) }, h("div", { key: 'ed79db0e5745ed551108e45e0046378d80528951', part: "file-item", class: "file-item__container" }, this.thumbnail ? (this.hasThumbnailSlot ? (h("slot", { name: "thumbnail" })) : file.state === "error" ? (h("span", { part: "thumbnail", class: "file-item__thumbnail error" })) : imageFile ? (h("img", { ref: (el) => {
                this.imageRef = el;
            }, alt: "", "aria-hidden": "true", part: "thumbnail", class: "file-item__thumbnail" })) : (h("span", { part: "thumbnail", class: `file-item__thumbnail no-image-available${disabledState ? " disabled" : ""}` }))) : (""), h("div", { key: '63fda6198119c739394b15d51daa2d794d878a14', part: "file-name", class: "file-item__name", ref: (el) => {
                this.container = el;
            } }, this.renderPrefix(thumbnail, state), custom ? (h("span", { part: "label", class: "file-item__label" }, h("slot", { onSlotchange: this.handleSlotChange }))) : (h("span", { part: "label", class: "file-item__label", ref: (el) => {
                this.fileLabel = el;
            }, "data-testid": "fileName" }, this.longName ? (h("hbr-tooltip", { content: this.file.name, style: { "--max-width": `${this._scrollWidth}px` }, hoist: true }, this.longName)) : (h("slot", { onSlotchange: this.handleSlotChange }, file.name))))), this.renderSuffix(state, percentage)), this.hasError ? (h("p", { part: "error", class: "file-item__error" }, h("slot", { name: "error", onSlotchange: this.handleSlotChange }))) : (""))));
    }
    get host() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledState"]
    }; }
    static get style() { return HbrFileItemStyle0; }
}, [1, "hbr-file-item", {
        "file": [8],
        "disabled": [516],
        "size": [513],
        "thumbnail": [4],
        "state": [513],
        "percentage": [2],
        "custom": [4],
        "aria": [16],
        "readonly": [516],
        "hasPrefix": [32],
        "hasSuffix": [32],
        "hasError": [32],
        "hasThumbnailSlot": [32],
        "longName": [32]
    }, undefined, {
        "disabled": ["handleDisabledState"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-file-item", "hbr-button", "hbr-icon", "hbr-icon-button", "hbr-popup", "hbr-progress-bar", "hbr-spinner", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-file-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FileItem);
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
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-progress-bar":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-tooltip":
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

const HbrFileItem = FileItem;
const defineCustomElement = defineCustomElement$1;

export { HbrFileItem, defineCustomElement };

