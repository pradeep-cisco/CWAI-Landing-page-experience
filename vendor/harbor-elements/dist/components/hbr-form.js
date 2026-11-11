import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const formCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block}";
const HbrFormStyle0 = formCss;

const Form = /*@__PURE__*/ proxyCustomElement(class Form extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrSubmit = createEvent(this, "hbr-submit", 7);
        this.hbrInit = createEvent(this, "hbr-init", 7);
        this.supportedComponentsMap = {};
        this.validate = false;
        this.getBoolean = (value) => {
            if (value === "true")
                return true;
            if (value === "false")
                return false;
            return value;
        };
        this.updateSupportedComponentsMap = () => {
            this.supportedComponentsMap = this.formControls.reduce((pre, item) => {
                pre[item.tag] = true;
                return pre;
            }, {});
        };
    }
    componentWillLoad() {
        this.hbrInit.emit();
    }
    connectedCallback() {
        this.getFormControls = this.getFormControls.bind(this);
        this.formControls = [
            {
                tag: "button",
                serialize: (el, formData) => el.name ? formData.append(el.name, el.value) : null,
                click: (event) => {
                },
            },
            {
                tag: "input",
                serialize: (el, formData) => {
                    if (!el.name) {
                        return;
                    }
                    if (el.type === "checkbox" || el.type === "radio") {
                        return;
                    }
                    if (el.type === "file") {
                        Array.from(el.files).map((file) => formData.append(el.name, file));
                        return;
                    }
                    formData.append(el.name, el.value);
                },
                click: (event) => {
                },
                keyDown: (event) => {
                },
            },
            {
                tag: "select",
                serialize: (el, formData) => {
                    if (el.name) {
                        if (el.multiple) {
                            const selectedOptions = Array.from(el.querySelectorAll("option:checked"));
                            if (selectedOptions.length) {
                                selectedOptions.map((option) => formData.append(el.name, option.value));
                            }
                            else {
                                formData.append(el.name, "");
                            }
                        }
                        else {
                            formData.append(el.name, el.value);
                        }
                    }
                },
            },
            {
                tag: "hbr-button",
                serialize: (el, formData) => el.name ? formData.append(el.name, el.value) : null,
                click: (event) => {
                },
            },
            {
                tag: "hbr-checkbox",
                serialize: (el, formData) => el.name ? formData.append(el.name, `${el.checked}`) : null,
            },
            {
                tag: "hbr-time-picker",
                serialize: (timePickerElement, formData) => {
                    const el = timePickerElement;
                    el.name ? formData.append(el.name, el.value) : null;
                },
            },
            {
                tag: "hbr-date-picker",
                serialize: (datePickerElement, formData) => {
                    const el = datePickerElement;
                    if (Array.isArray(el.value) || el.range) {
                        const rangeValue = Array.from(el.value);
                        if (rangeValue.length) {
                            rangeValue.map((value) => formData.append(el.name, value));
                        }
                        else {
                            formData.append(el.name, "");
                        }
                    }
                    else {
                        el.name ? formData.append(el.name, el.value) : null;
                    }
                },
            },
            {
                tag: "hbr-input",
                serialize: (el, formData) => el.name ? formData.append(el.name, el.value) : null,
                keyDown: (event) => {
                },
            },
            {
                tag: "hbr-radio",
                serialize: (el, formData) => el.name ? formData.append(el.name, `${el.checked}`) : null,
            },
            {
                tag: "hbr-slider",
                serialize: (el, formData) => {
                    if (el.name) {
                        formData.append(el.name, "");
                    }
                },
            },
            {
                tag: "hbr-select",
                serialize: (el, formData) => {
                    if (el.name) {
                        if (el.variant === "multiple") {
                            const selectedOptions = Array.from(el.value);
                            if (selectedOptions.length) {
                                selectedOptions.map((value) => formData.append(el.name, value));
                            }
                            else {
                                formData.append(el.name, "");
                            }
                        }
                        else {
                            formData.append(el.name, `${el.value}`);
                        }
                    }
                },
            },
            {
                tag: "hbr-switch",
                serialize: (el, formData) => el.name ? formData.append(el.name, `${el.checked}`) : null,
            },
            {
                tag: "hbr-textarea",
                serialize: (el, formData) => el.name ? formData.append(el.name, el.value) : null,
            },
            {
                tag: "textarea",
                serialize: (el, formData) => el.name ? formData.append(el.name, el.value) : null,
            },
        ];
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.runSchema = this.runSchema.bind(this);
        this.serializeElement = this.serializeElement.bind(this);
        this.updateSupportedComponentsMap =
            this.updateSupportedComponentsMap.bind(this);
        this.updateSupportedComponentsMap();
    }
    /** Serializes all form controls elements and returns a `FormData` object. */
    async getFormData() {
        const formData = new FormData();
        const formControls = await this.getFormControls();
        formControls.map((el) => this.serializeElement(el, formData));
        return formData;
    }
    /** extend more form controls elements, please see the interface of returning array of formControl  */
    async extendFormControls(data) {
        Array.isArray(data) && this.formControls.push(...data);
        this.updateSupportedComponentsMap();
        return this.formControls;
    }
    async getFormControlsThatReport() {
        const formControls = await this.getFormControls();
        return formControls.filter((el) => typeof el.reportValidity === "function");
    }
    /** set form element to touched or untouched, params interface {elementName: boolean}  */
    async setTouched(touched = {}) {
        const formControls = await this.getFormControls();
        const result = {};
        for (const el of formControls) {
            // @ts-ignore
            const name = el === null || el === void 0 ? void 0 : el.name;
            if (name) {
                if (name in touched) {
                    if (touched[name]) {
                        el === null || el === void 0 ? void 0 : el.setAttribute("data-touched", "true");
                    }
                    else if (touched[name] === false) {
                        el === null || el === void 0 ? void 0 : el.removeAttribute("data-touched");
                    }
                }
                if (!result[name])
                    result[name] = {};
                result[name].touched = touched[name];
            }
        }
        return result;
    }
    /** get form elements and form touched state */
    async getTouched() {
        const formControls = await this.getFormControls();
        const result = {};
        let isFormTouched = false;
        for (const el of formControls) {
            // @ts-ignore
            const name = el === null || el === void 0 ? void 0 : el.name;
            if (name) {
                if (!result[name])
                    result[name] = {};
                if (el.hasAttribute("data-touched")) {
                    result[name].touched = true;
                    isFormTouched = true;
                }
                else {
                    result[name].touched = false;
                }
            }
        }
        return { result, isFormTouched };
    }
    /** set form element value to touched or untouched, params inteface {elementName: {key: string<elementName>, value: any}}  */
    async setValues(values) {
        const formControls = await this.getFormControls();
        for (const el of formControls) {
            // @ts-ignore
            const name = el === null || el === void 0 ? void 0 : el.name;
            const entries = values[name];
            if (!entries)
                continue;
            if (name in values && entries) {
                el[entries.key] = entries.value;
            }
        }
    }
    /** Gets all form control elements (native and custom). */
    async getFormControls() {
        const childrenList = Array.from(this.host.querySelectorAll("*"));
        const tags = this.formControls.map((control) => control.tag);
        return childrenList.filter((el) => tags.includes(el.tagName.toLowerCase()));
    }
    /** set multiple conditions against the element, each condition hold relative message */
    async runSchema(schema, touched = {}) {
        var _a;
        const formControls = await this.getFormControls();
        const result = {};
        const _touched = {};
        const _error = {};
        const _condition = {};
        let isFormValid = true;
        for (const el of formControls) {
            if (el) {
                // @ts-ignore
                const name = (el === null || el === void 0 ? void 0 : el.name) || (el === null || el === void 0 ? void 0 : el.getAttribute("name"));
                if (!name)
                    continue;
                let conditions = [];
                let error = false;
                if (schema[name]) {
                    conditions = (((_a = schema[name]) === null || _a === void 0 ? void 0 : _a.conditions) || []).map((con) => {
                        const condition = con === null || con === void 0 ? void 0 : con.condition({
                            element: el,
                            elements: formControls,
                        });
                        if (condition) {
                            isFormValid = false;
                            error = true;
                        }
                        return Object.assign(Object.assign({}, con), { show: condition });
                    });
                }
                if (name in touched) {
                    if (touched[name]) {
                        el === null || el === void 0 ? void 0 : el.setAttribute("data-touched", "true");
                    }
                    else if (touched[name] === false) {
                        el === null || el === void 0 ? void 0 : el.removeAttribute("data-touched");
                    }
                }
                const isTouched = touched[name] || (el === null || el === void 0 ? void 0 : el.hasAttribute("data-touched"));
                _touched[name] = isTouched;
                _error[name] = error;
                _condition[name] = conditions;
                result[name] = { conditions, error, touched: isTouched };
            }
        }
        const formData = await this.getFormData();
        return {
            isFormValid,
            result,
            formData,
            touched: _touched,
            error: _error,
            condition: _condition,
        };
    }
    /**
    deprecated
   */
    async submit() {
        const formData = await this.getFormData();
        const formControls = await this.getFormControls();
        const formControlsThatReport = formControls.filter((el) => typeof el.reportValidity === "function");
        if (this.validate) {
            for (const el of formControlsThatReport) {
                const isValid = await el.reportValidity();
                if (!isValid) {
                    return false;
                }
            }
        }
        this.hbrSubmit.emit({ formData, formControls });
        return true;
    }
    /**
     * Serializes a form and returns a plain object. If a form control with the same name appears more than once, the
     * property will be converted to an array.
     */
    async serialize(data) {
        const formData = data;
        const object = {};
        formData === null || formData === void 0 ? void 0 : formData.forEach((value, key) => {
            const _value = this.getBoolean(value);
            if (Reflect.has(object, key)) {
                const entry = object[key];
                if (Array.isArray(entry)) {
                    entry.push(_value);
                }
                else {
                    object[key] = [object[key], _value];
                }
            }
            else {
                object[key] = _value;
            }
        });
        return object;
    }
    handleClick(event) {
        const target = event.target;
        const tag = target.tagName.toLowerCase();
        for (const formControl of this.formControls) {
            if (formControl.tag === tag && formControl.click) {
                formControl.click(event);
            }
        }
    }
    handleKeyDown(event) {
        const target = event.target;
        const tag = target.tagName.toLowerCase();
        for (const formControl of this.formControls) {
            if (formControl.tag === tag && formControl.keyDown) {
                formControl.keyDown(event);
            }
        }
    }
    serializeElement(el, formData) {
        const tag = el.tagName.toLowerCase();
        for (const formControl of this.formControls) {
            if (formControl.tag === tag) {
                return formControl.serialize(el, formData);
            }
        }
        return null;
    }
    render() {
        return (h("div", { key: 'f7c934db29456272455e8b1024c49202d2b96a3a', part: "base", class: "form", role: "form", onClick: this.handleClick, onKeyDown: this.handleKeyDown, onFocusout: (e) => {
                var _a;
                const target = e === null || e === void 0 ? void 0 : e.target;
                const tag = (_a = target === null || target === void 0 ? void 0 : target.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                this.supportedComponentsMap[tag] &&
                    (target === null || target === void 0 ? void 0 : target.setAttribute("data-touched", "true"));
            } }, h("slot", { key: '03d1f5cb5994f43268ee17f7d0670f0b72e51ca7' })));
    }
    get host() { return this; }
    static get style() { return HbrFormStyle0; }
}, [1, "hbr-form", {
        "getFormData": [64],
        "extendFormControls": [64],
        "getFormControlsThatReport": [64],
        "setTouched": [64],
        "getTouched": [64],
        "setValues": [64],
        "getFormControls": [64],
        "runSchema": [64],
        "submit": [64],
        "serialize": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-form"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-form":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Form);
            }
            break;
    } });
}

const HbrForm = Form;
const defineCustomElement = defineCustomElement$1;

export { HbrForm, defineCustomElement };

