import { proxyCustomElement, HTMLElement, createEvent, h, Fragment, Host } from '@stencil/core/internal/client';
import { r as alertsNegativeLarge, B as remove } from './index2.js';
import { g as generateShortID } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$3 } from './icon.js';
import { i as internationalization } from './translations.js';
import { h as hasSlot } from './slot.js';
import { d as defineCustomElement$2 } from './icon-button.js';

const translations = {
    en: {
        multiFileError: "Please select only one file to upload.",
    },
    ko: {
        multiFileError: "업로드할 파일을 하나만 선택하십시오.",
    },
    ja: {
        multiFileError: "アップロードするファイルを1つだけ選択してください。",
    },
    zh: {
        multiFileError: "请仅选择一个文件进行上传。",
    },
};

const uploaderCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--width:100%;--height:inherit;--file-container-width:100%;--text-align:center;--supplemental-text-align:center;--padding-md:var(--hbr-spacing-2xl) var(--hbr-spacing-lg);--padding-medium:var(--padding-md);--padding-sm:var(--hbr-spacing-lg);--padding-small:var(--padding-sm);--max-height:initial;--gap:var(--hbr-spacing-sm);--label-text-color:var(--base-text-default);--drop-container-border:var(--hbr-border-width) dashed var(--control-border-default);--drop-container-bg-color:var(--control-bg-weak-default);--drop-area-bg-color:var(--control-bg-weak-active);--drop-area-color:var(--interact-text-default);--drop-area-border-color:var(--control-border-active);--content-color:var(--base-text-default);--supplemental-content-color:var(--base-text-medium-default);--optional-content-color:var(--base-text-medium-default);--error-message-bg-color:var(--negative-bg-medium-default)}:host([size=medium]){--gap:var(--hbr-spacing-sm)}:host([size=small]){--gap:var(--hbr-spacing-xs)}:host([container]){--width:400px;--file-container-width:400px}:host([container][size=small]){--width:320px;--file-container-width:320px}.uploader{width:var(--width);height:var(--height);display:flex;flex-direction:column;gap:var(--gap)}.uploader:not(.uploader--draggable) label{width:fit-content}.uploader__label{display:flex;gap:var(--hbr-spacing-xs);font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-semibold);line-height:20px;color:var(--label-text-color);margin-bottom:var(--hbr-spacing-xs)}.uploader--error{display:flex;flex-direction:column;gap:var(--hbr-spacing-xs)}.uploader__icon-upload{display:none;width:20px;height:20px}:host([size=small]) .uploader__icon-upload{width:16px;height:16px}.uploader__drop-container{border:var(--drop-container-border);border-radius:var(--hbr-border-radius-lg);font-weight:var(--hbr-font-weight-semibold);background:var(--drop-container-bg-color)}.uploader__drop-container.uploader__input-kb--focused{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.uploader__drop-container{}.uploader__drop-container .uploader__icon-upload{display:inline-block}.uploader label{display:inline-flex;align-items:flex-start;vertical-align:middle}.uploader:not(.uploader--readonly) label{cursor:pointer}.uploader--draggable label{align-items:center;justify-content:center;display:flex;flex-direction:column;line-height:var(--hbr-font-line-height-normal)}.uploader--disabled .uploader__drop-container{cursor:not-allowed}.uploader--disabled .uploader__drop-container *{pointer-events:none}.uploader--readonly .uploader__drop-container{border-color:var(--control-border-disabled);background:var(--base-bg-disabled);cursor:default}.uploader--readonly .uploader__content{color:var(--base-text-default)}.uploader__icon-upload{color:var(--control-icon-strong-default)}.uploader--readonly .uploader__icon-upload{color:var(--control-icon-weak-default)}.uploader:not(.uploader--disabled):not(.uploader--readonly) .uploader__drop-container:hover,.uploader:not(.uploader--disabled):not(.uploader--readonly) .uploader__dropZone-highlight{background-color:var(--drop-area-bg-color);color:var(--drop-area-color);border-color:var(--drop-area-border-color)}.uploader--draggable.uploader--medium{font-size:var(--hbr-font-size-sm)}.uploader--draggable.uploader--medium label{gap:var(--hbr-spacing-xs);padding:var(--padding-md)}.uploader--draggable.uploader--medium label .uploader__icon-upload ::slotted(hbr-icon){font-size:20px;width:20px;height:20px}.uploader--draggable.uploader--small{font-size:var(--hbr-font-size-xs)}.uploader--draggable.uploader--small label{gap:var(--hbr-spacing-2xs);padding:34px var(--padding-sm)}.uploader--draggable.uploader--small label .uploader__icon-upload ::slotted(hbr-icon){font-size:16px}.uploader__content{display:flex;flex-direction:column;gap:var(--hbr-spacing-2xs);align-items:center;color:var(--content-color)}.uploader__content>span:first-child{text-align:var(--text-align)}.uploader__supplemental-text{font-size:var(--hbr-font-size-xs);line-height:18px;font-weight:var(--hbr-font-weight-normal);color:var(--supplemental-content-color);text-align:var(--supplemental-text-align)}.uploader__input{position:absolute;opacity:0;padding:0;margin:0;pointer-events:none;width:0}.uploader--has-optional-title,.uploader__optional-content{display:flex;flex-direction:column;align-items:flex-start;gap:var(--hbr-spacing-sm)}.uploader__optional-content{gap:var(--hbr-spacing-2xs)}.uploader:not(.uploader--draggable) .uploader__optional-content:not(.uploader--has-optional-content){display:none}.uploader__optional-content slot[name=optional-title]{font-family:Inter;font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-bold);line-height:20px}.uploader__optional-content slot[name=optional-text]{color:var(--optional-content-color);font-size:var(--hbr-font-size-sm);line-height:20px}.uploader__error-message{display:flex;padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);column-gap:var(--hbr-spacing-xs);font-size:var(--hbr-font-size-sm);line-height:20px;background-color:var(--error-message-bg-color);border-radius:var(--hbr-border-radius-md);align-items:center}.uploader__error-message.hbr-hide{display:none}.uploader__error-remove{margin-left:auto;font-size:16px}hbr-icon-button.uploader__error-remove::part(base){padding:var(--hbr-spacing-2xs) 0 0}.uploader__error-icon{font-size:24px;color:var(--negative-bg-default);--path-color-1:var(--base-text-in-default);--path-color-2:var(--base-text-in-default)}.uploader__files-container:not(.uploader--has-file-list){display:none}.uploader__files-container{max-height:var(--max-height);overflow:auto}:not(.uploader--draggable) .uploader__files-container{width:var(--file-container-width)}ul.uploader__files-container{list-style-type:none;margin-block-end:0;padding-inline-start:0;margin-block-start:0}.uploader label{line-height:20px}:host([size=small]) .uploader label,.uploader__supplemental-text{line-height:18px}";
const HbrUploaderStyle0 = uploaderCss;

const Uploader = /*@__PURE__*/ proxyCustomElement(class Uploader extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrFileDrop = createEvent(this, "hbr-file-drop", 7);
        this.hbrError = createEvent(this, "hbr-error", 7);
        this.hbrSelect = createEvent(this, "hbr-select", 7);
        this.hasFileList = false;
        this.hasOptionalTitle = false;
        this.hasOptionalText = false;
        this.hasOptionalContent = false;
        this.hasContainerIcon = false;
        this.hasLabelContainer = false;
        this.hasSupplementalText = false;
        this.disabled = false;
        this.label = undefined;
        this.size = "medium";
        this.container = undefined;
        this.readonly = false;
        this.files = [];
        this.multiple = undefined;
        this.accept = undefined;
        this.error = undefined;
        this.name = "";
        this.hasContent = false;
        this.hasHelpTextSlot = false;
        this.hasLabelSlot = false;
        this.inputId = this.name || generateShortID();
    }
    async handleChange(event) {
        if (this.container && this.readonly)
            return;
        const input = event.target;
        const files = await input.files;
        this.hbrSelect.emit({ files, event });
        this.input.value = "";
    }
    handleDefaultSlotChange(e) {
        this.hasFileList = hasSlot(this.host);
        if (this.hasFileList) {
            const slot = e.target;
            const slottedElements = [
                ...slot.assignedElements({ flatten: true }),
            ];
            const notMedium = this.size !== "medium";
            const { multiple } = this;
            if (slottedElements.length) {
                slottedElements.forEach((file, idx) => {
                    file.toggleAttribute("readonly", this.container && this.readonly);
                    let newIndex = idx;
                    if (multiple) {
                        newIndex++;
                        file.setAttribute("data-idx", `${newIndex}`);
                    }
                    else {
                        file.setAttribute("data-idx", "0");
                    }
                    if (notMedium) {
                        file.size = this.size;
                    }
                    return file;
                });
            }
        }
    }
    handleSlotChange() {
        this.hasLabelSlot = hasSlot(this.host, "label");
        this.hasOptionalTitle = hasSlot(this.host, "optional-title");
        this.hasOptionalText = hasSlot(this.host, "optional-text");
        this.hasContainerIcon = hasSlot(this.host, "container-icon");
        this.hasSupplementalText = hasSlot(this.host, "supplemental-text");
        this.hasOptionalContent =
            !this.container && (this.hasOptionalTitle || this.hasOptionalText);
    }
    handleDragEnter() {
        var _a;
        if (this.container && this.readonly)
            return;
        (_a = this.dropZone) === null || _a === void 0 ? void 0 : _a.classList.add("uploader__dropZone-highlight");
    }
    handleDragOver(event) {
        var _a;
        event.preventDefault();
        if (this.container && this.readonly)
            return false;
        (_a = this.dropZone) === null || _a === void 0 ? void 0 : _a.classList.add("uploader__dropZone-highlight");
        return false;
    }
    handleDragLeave() {
        var _a;
        (_a = this.dropZone) === null || _a === void 0 ? void 0 : _a.classList.remove("uploader__dropZone-highlight");
    }
    handleDrop(event) {
        var _a, _b;
        event.preventDefault();
        if (this.container && this.readonly)
            return;
        (_a = this.dropZone) === null || _a === void 0 ? void 0 : _a.classList.remove("uploader__dropZone-highlight");
        const { dataTransfer } = event;
        const queue = [...event.dataTransfer.items].map((item) => item.getAsFile());
        const responses = [];
        for (const file of queue) {
            responses.push(file);
        }
        if (!this.multiple) {
            if (1 < ((_b = dataTransfer.files) === null || _b === void 0 ? void 0 : _b.length)) {
                this.error = internationalization(translations, "multiFileError");
                this.hbrError.emit({ files: responses, error: this.error });
                return;
            }
            if (this.error) {
                this.error = undefined;
            }
        }
        return this.hbrFileDrop.emit({ files: responses, dataTransfer });
    }
    handleErrorRemoveClick() {
        this.errorMessage.classList.add("hbr-hide");
        this.error = undefined;
    }
    handleFocus(event) {
        if (this.dropZone) {
            const mouseEvent = event.relatedTarget;
            if (mouseEvent)
                this.dropZone.classList.add("uploader__input-kb--focused");
        }
    }
    handleTriggerClick(event) {
        var _a;
        event.preventDefault();
        event.stopPropagation();
        if (this.container && this.readonly)
            return;
        (_a = this.input) === null || _a === void 0 ? void 0 : _a.click();
    }
    handleBlur() {
        var _a;
        (_a = this.dropZone) === null || _a === void 0 ? void 0 : _a.classList.remove("uploader__input-kb--focused");
    }
    getLabel() {
        const { inputId, name, multiple, disabled } = this;
        const readonlyContainer = Boolean(this.container && this.readonly);
        const acceptType = Array.isArray(this.accept)
            ? this.accept.join(",")
            : this.accept;
        return (h(Fragment, null, h("div", { class: {
                "uploader__optional-content": true,
                "uploader--has-optional-content": this.hasOptionalContent,
            } }, h("slot", { name: "optional-title", onSlotchange: this.handleSlotChange }), h("slot", { name: "optional-text", onSlotchange: this.handleSlotChange })), h("input", { id: inputId, class: "uploader__input", type: "file", name: name, disabled: disabled || readonlyContainer, onChange: this.handleChange.bind(this), accept: acceptType, multiple: multiple, ref: (el) => {
                this.input = el;
            }, "data-testid": "fileSelect-input", onFocus: this.handleFocus.bind(this), onBlur: this.handleBlur.bind(this) }), h("label", { part: "label", htmlFor: inputId }, h("span", { part: "container-icon", class: "uploader__icon-upload" }, h("slot", { name: "container-icon", onSlotchange: this.handleSlotChange })), h("div", { part: "content", class: "uploader__content" }, h("span", { onClick: this.handleTriggerClick.bind(this) }, h("slot", { name: "trigger", onSlotchange: this.handleSlotChange })), this.hasSupplementalText ? (h("span", { class: "uploader__supplemental-text" }, h("slot", { name: "supplemental-text", onSlotchange: this.handleSlotChange }))) : ("")))));
    }
    removeSessionStorage() {
        sessionStorage["hbr__session-uploadInProgress"] = undefined;
        return;
    }
    setSessionStorage() {
        const { files } = this;
        if (files === null || files === void 0 ? void 0 : files.length) {
            if (files.some((file) => file.state === "progress")) {
                const SESSION_STORAGE = "hbr__session-uploadInProgress";
                sessionStorage.setItem(SESSION_STORAGE, "true");
            }
            else {
                this.removeSessionStorage();
            }
        }
        else {
            this.removeSessionStorage();
        }
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    componentWillLoad() {
        this.handleSlotChange();
        /** For preset file item like test use case */
        const fileItem = this.host.querySelector("hbr-file-item");
        if (fileItem) {
            if (this.multiple) {
                fileItem.setAttribute("data-idx", "1");
            }
            else {
                fileItem.setAttribute("data-idx", "0");
            }
        }
    }
    disconnectedCallback() {
        this.removeSessionStorage();
    }
    componentDidRender() {
        const readonlyContainer = Boolean(this.container && this.readonly);
        this.host.querySelectorAll("hbr-file-item").forEach((fileItem) => {
            fileItem.toggleAttribute("readonly", readonlyContainer);
        });
        this.setSessionStorage();
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { container, size, inputId, disabled, multiple } = this;
        const readonlyContainer = Boolean(container && this.readonly);
        const showError = this.error && typeof this.error === "string";
        const UL = multiple ? "ul" : "div";
        const containsLabel = !!(this.hasLabelSlot || this.label);
        return (h(Host, { key: 'b4bbb850796be0da73de7fc25e8e4ee29c49a783' }, containsLabel && (h("div", { class: "uploader__label" }, h("slot", { name: "label" }, this.label), h("slot", { name: "label-suffix" }))), h("div", { key: '4e01f863a2111f46f751107f44c41f2e190f4a17', part: "base", class: Object.assign(Object.assign({ uploader: true, "uploader--draggable": container }, (size ? { [`uploader--${size}`]: true } : null)), { "uploader--multiple": multiple, "uploader--disabled": disabled, "uploader--readonly": readonlyContainer, "uploader--error": showError,
                /** slot */
                "uploader--has-file-list": this.hasFileList, "uploader--has-optional-title": this.hasOptionalTitle, "uploader--has-optional-text": this.hasOptionalText, "uploader--has-container-icon": this.hasContainerIcon, "uploader--has-supplemental-text": this.hasSupplementalText }) }, this.container ? (h("div", { id: `hbr--id_${inputId}-uploader--drop`, onDragEnter: this.handleDragEnter.bind(this), onDragOver: this.handleDragOver.bind(this), onDragLeave: this.handleDragLeave.bind(this), onDrop: this.handleDrop.bind(this), part: "drop-zone", class: "uploader__drop-container", ref: (el) => {
                this.dropZone = el;
            }, "data-testid": "dropZone" }, this.getLabel())) : (this.getLabel()), showError ? (h("div", { class: "uploader__error-message", part: "error-message", ref: (el) => {
                this.errorMessage = el;
            } }, h("hbr-icon", { class: "uploader__error-icon", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["alerts-negative-large"]) ||
                alertsNegativeLarge }), this.error, h("hbr-icon-button", { exportparts: "base:error-remove-button", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.remove) || remove, class: "uploader__error-remove", arialabel: "Remove this error message", "data-testid": "errorMessage-removeIcon", onClick: this.handleErrorRemoveClick.bind(this) }))) : (""), h(UL, { key: 'c253a28220535ef96d4e1199ae7be1de2d708e23', part: "list-container", class: {
                "uploader__files-container": true,
                "uploader--has-file-list": this.hasFileList,
            } }, h("slot", { key: '111ba43d136aa016d3a741163472f3f328a23ae5', onSlotchange: this.handleDefaultSlotChange.bind(this) })))));
    }
    static get formAssociated() { return true; }
    get host() { return this; }
    static get style() { return HbrUploaderStyle0; }
}, [65, "hbr-uploader", {
        "disabled": [1540],
        "label": [1],
        "size": [513],
        "container": [516],
        "readonly": [516],
        "files": [16],
        "multiple": [516],
        "accept": [1],
        "error": [1],
        "name": [513],
        "hasFileList": [32],
        "hasOptionalTitle": [32],
        "hasOptionalText": [32],
        "hasOptionalContent": [32],
        "hasContainerIcon": [32],
        "hasLabelContainer": [32],
        "hasSupplementalText": [32],
        "hasContent": [32],
        "hasHelpTextSlot": [32],
        "hasLabelSlot": [32],
        "inputId": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-uploader", "hbr-icon", "hbr-icon-button"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-uploader":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Uploader);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrUploader = Uploader;
const defineCustomElement = defineCustomElement$1;

export { HbrUploader, defineCustomElement };

