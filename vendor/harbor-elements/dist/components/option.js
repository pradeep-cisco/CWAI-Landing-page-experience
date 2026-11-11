import { proxyCustomElement, HTMLElement, createEvent, h, Fragment, Host } from '@stencil/core/internal/client';
import { d as check } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$1 } from './icon.js';

const optionCss = ":host{display:block;user-select:none;--font-weight:var(--hbr-font-weight-normal);--disabled-text:var(--base-text-disabled);--error-bg-hover:var(--negative-bg-weak-hover);--error-text-hover:var(--negative-text-hover);--admin-bg-selected:var(--control-bg-weak-active);--selected-bg-hover:var(--control-bg-weak-active);--bg-hover:var(--control-bg-weak-hover);--bg-hover-browser:var(--interact-bg-weak-hover)}:host(:focus-visible){outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}:host(:not([sentiment]):not([disabled])) .option{color:var(--base-text-default)}.option{padding:var(--option-padding, var(--hbr-spacing-xs) 10px);display:flex;align-items:center;justify-content:space-between;user-select:none;font-family:var(--font-family);font-weight:var(--font-weight);line-height:var(--hbr-font-line-height-normal)}.option:not(.option--disabled):not(.option--custom){pointer-events:auto;cursor:pointer}.option:hover:not(.option--disabled):not(.option--custom){background-color:var(--bg-hover-browser)}.option--hover:not(.option--selected):not(.option--disabled):not(.option--no-checkMark):not(.option--custom){background-color:var(--bg-hover)}.option--hover.option--selected:not(.option--no-checkMark):not(.option--custom){background-color:var(--bg-hover)}.option--selected:not(.option--no-checkMark):not(.option--custom),.option--selected:not(.option--no-checkMark):not(.option--custom).option--disabled{background-color:var(--selected-bg-hover)}.option--disabled{outline:none;color:var(--disabled-text);cursor:not-allowed}.option--check,.option .option__check{flex:0 0 auto;display:flex;align-items:center;justify-content:center;visibility:hidden;padding-inline-start:var(-hbr-spacing-xs)}.option__check{color:var(--interact-text-default);font-size:var(--hbr-font-size-md)}.option--custom .option__check{display:none}.option--custom{position:relative;padding-inline-end:var(--option-custom-suffix-width, 66px)}.option--custom .option__label{min-width:0}.option__label{flex:1 1 auto;display:inline-block;line-height:20px}.option__label.option__label--custom{display:flex;align-items:center;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.option__label.option__label--custom::before,.option__label.option__label--custom::after{content:'\"';flex:0 0 auto}.option__custom-label{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.option__custom-label ::slotted(*){max-width:100%;min-width:0;overflow:hidden;overflow-wrap:normal;text-overflow:ellipsis;white-space:nowrap;word-break:normal}.option__custom-label ::slotted(hbr-truncation[lines]){display:block;overflow:visible;overflow-wrap:initial;text-overflow:clip;white-space:normal;word-break:initial}.option--selected .option__check{visibility:visible}.option__prefix,.option__suffix{flex:0 0 auto;display:flex;align-items:center}.option__prefix ::slotted(*){margin-inline-end:var(--hbr-spacing-xs)}.option__suffix ::slotted(*){margin-inline-start:var(--hbr-spacing-2xs)}.option--custom .option__suffix{position:absolute;inset-inline-end:10px;--label-affix-padding-md:var(--hbr-spacing-xs)}.option--custom .option__suffix ::slotted(*){margin-inline-start:var(--hbr-spacing-xs)}.option--small .option__label{line-height:18px}.option--small .option__prefix ::slotted(*){margin-inline-end:var(--hbr-spacing-2xs)}.option--small .option__suffix ::slotted(*){margin-inline-start:var(--hbr-spacing-3xs)}.option--small.option--custom{padding-inline-end:calc(var(--option-custom-suffix-width, 66px) + 6px)}.option--small.option--custom .option__suffix{inset-inline-end:6px}.option--truncate{max-width:var(--truncate-max-width, 600px)}.option--truncate .option__label{text-overflow:ellipsis;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;line-clamp:var(--line-clamp, 3);-webkit-line-clamp:var(--line-clamp, 3)}.option--single-non-breakable-word .option__label{white-space:normal;overflow-wrap:anywhere;word-break:break-word}@media (forced-colors: active){:host(:hover:not([aria-disabled=true])) .option{outline:dashed 1px SelectedItem;outline-offset:-1px}}.option--small{font-size:var(--hbr-font-size-xs, 12px);line-height:var(--hbr-font-line-height-dense);letter-spacing:var(--hbr-font-letter-spacing-dense);padding:var(--hbr-spacing-2xs) 6px}.option--medium{font-size:var(--hbr-control-font-size-sm);line-height:var(--hbr-font-line-height-normal);letter-spacing:var(--hbr-line-letter-spacing-normal)}.option--large{font-size:var(--hbr-control-font-size-md);line-height:var(--hbr-font-line-height-loose);letter-spacing:var(--hbr-font-letter-spacing-loose);padding:var(--hbr-spacing-sm) 10px}.option--danger{color:var(--negative-text-default)}.option--danger:hover{background-color:var(--error-bg-hover);color:var(--error-text-hover)}.option--admin{padding:2px}.option--admin .option__wrapper{border:1px dashed #887be3;border-radius:var(--hbr-border-radius-sm, 4px);background:#f3f2ff;padding:5px 7px;width:100%;height:100%;display:flex}.option--admin.option--small .option__wrapper{padding:1px 3px}.option--admin.option--large .option__wrapper{padding:6px 11px}.option--admin:hover{background-color:var(--admin-bg-selected)}";
const HbrOptionStyle0 = optionCss;

const HbrOption = /*@__PURE__*/ proxyCustomElement(class HbrOption extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-option-click", 7);
        this.handleMouseEnter = () => {
            this.hovered = true;
        };
        this.handleMouseLeave = () => {
            this.hovered = false;
        };
        this.handleDefaultSlotChange = async () => {
            if (this.custom) {
                // Backward-compat: previously consumers wrapped custom option content in `"..."`.
                // Quotes are now added via CSS pseudo-elements outside the ellipsis container, so strip any
                // user-supplied wrapping quotes to avoid `""foo""` and ensure the closing quote stays visible after truncation.
                this.stripWrappingQuotes();
            }
            const textLabel = await this.getTextLabel();
            this.singleNonBreakableWord = this.isSingleNonBreakableWord(textLabel !== null && textLabel !== void 0 ? textLabel : "");
            // Ignore the first time the label is set
            if (typeof this.cachedTextLabel === "undefined") {
                this.cachedTextLabel = textLabel;
                return;
            }
            // When the label changes, emit a slotchange event so parent controls see it
            if (textLabel !== this.cachedTextLabel) {
                this.cachedTextLabel = textLabel;
            }
        };
        this.hovered = false;
        this.current = false;
        this.singleNonBreakableWord = false;
        this.value = undefined;
        this.disabled = false;
        this.size = "medium";
        this.sentiment = undefined;
        this.selected = false;
        this.noCheckMark = false;
        this.custom = undefined;
        this.allowSpace = undefined;
        this.truncate = undefined;
        this.display = undefined;
    }
    handleValueChange() {
        // Ensure the value is a string. This ensures the next line doesn't error and allows framework users to pass numbers
        // instead of requiring them to cast the value to a string.
        if (typeof this.value !== "string") {
            this.value = String(this.value);
        }
        setTimeout(() => {
            if (this.value.includes(" ") &&
                !this.allowSpace &&
                !this.host.hasAttribute("allow-space")) {
                console.error("Option values cannot include a space. All spaces have been replaced with underscores.", this);
                this.value = this.value.replace(/ /g, "_");
            }
        });
    }
    isSingleNonBreakableWord(label) {
        const text = label.trim();
        return text.length > 0 && !/[\s\u002d\u2010-\u2015]/.test(text);
    }
    stripWrappingQuotes() {
        var _a, _b, _c, _d, _e, _f;
        const slot = (_b = (_a = this.host) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("slot:not([name])");
        if (!slot)
            return;
        const textNodes = [];
        for (const node of slot.assignedNodes({ flatten: true })) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (((_c = node.textContent) !== null && _c !== void 0 ? _c : "").trim())
                    textNodes.push(node);
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                let current = walker.nextNode();
                while (current) {
                    if (((_d = current.textContent) !== null && _d !== void 0 ? _d : "").trim())
                        textNodes.push(current);
                    current = walker.nextNode();
                }
            }
        }
        if (!textNodes.length)
            return;
        const first = textNodes[0];
        const last = textNodes[textNodes.length - 1];
        const firstText = (_e = first.textContent) !== null && _e !== void 0 ? _e : "";
        const lastText = (_f = last.textContent) !== null && _f !== void 0 ? _f : "";
        if (!/^\s*"/.test(firstText) || !/"\s*$/.test(lastText)) {
            return;
        }
        if (first === last) {
            first.textContent = firstText
                .replace(/^(\s*)"/, "$1")
                .replace(/"(\s*)$/, "$1");
            return;
        }
        first.textContent = firstText.replace(/^(\s*)"/, "$1");
        last.textContent = lastText.replace(/"(\s*)$/, "$1");
    }
    componentDidRender() {
        const checkbox = this.host.querySelector("hbr-checkbox");
        if (checkbox) {
            if (this.disabled) {
                checkbox.disabled = true;
            }
            if (this.selected) {
                checkbox.checked = true;
            }
            else {
                if (!checkbox.checked) {
                    //for uncontrolled checkbox - checked on implementation
                    checkbox.checked = false;
                }
            }
        }
    }
    connectedCallback() {
        const checkbox = this.host.querySelector("hbr-checkbox");
        if (checkbox)
            this.noCheckMark = true;
    }
    /** Returns a plain text label based on the option's content. */
    async getTextLabel() {
        var _a, _b;
        /** Make sure take text content only from the default slot. Not from the prefix or suffix slot  */
        const slot = (_b = (_a = this.host) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("slot:not([name])");
        if (!slot) {
            return;
        }
        let textContent = "";
        const assignedNodes = slot.assignedNodes({ flatten: true });
        assignedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                textContent += node.textContent;
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                textContent += node.textContent;
            }
        });
        return textContent.trim();
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const { sentiment } = this;
        const cls = {
            option: true,
            "option--current": this.current,
            "option--disabled": this.disabled,
            "option--selected": this.selected,
            "option--small": this.size === "small",
            "option--medium": this.size === "medium",
            "option--large": this.size === "large",
            "option--custom": this.custom,
            "option--no-checkMark": this.noCheckMark,
            "option--truncate": this.truncate,
            "option--single-non-breakable-word": this.singleNonBreakableWord,
        };
        if (sentiment) {
            cls[`option--${sentiment}`] = true;
        }
        else if (this.hovered) {
            cls["option--hover"] = true;
        }
        const optionChildren = (h(Fragment, { key: '81483cd56c85022da7c376ce4aa01d5947210abd' }, h("div", { key: 'cc4d895e076a408386ac0fc2023c70503315990b', part: "prefix", class: "option__prefix" }, h("slot", { key: '1630c6947cae5de7c1fb6ba8fe640b3182f3eeb2', name: "prefix" })), this.custom ? (h("div", { part: "label", class: "option__label option__label--custom" }, h("span", { class: "option__custom-label" }, h("slot", { onSlotchange: this.handleDefaultSlotChange })))) : (h("div", { part: "label", class: "option__label" }, h("slot", { onSlotchange: this.handleDefaultSlotChange }))), h("div", { key: '9a0522281da6a41bd4e9aff0ed27924feb0e7a98', part: "suffix", class: "option__suffix" }, h("slot", { key: '289d33cedbbb3caa041b5ac3afdd0550e45cb2f3', name: "suffix" })), !this.noCheckMark && (h("hbr-icon", { part: "checked-icon", class: "option__check", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check) || check }))));
        return (h(Host, { key: 'c4a6158a4bcc08e74b016e0eeba1e9db56e81793', "aria-disabled": this.disabled, role: "option", "aria-selected": this.selected ? "true" : null, onClick: (event) => {
                if (this.disabled) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                if (!this.host.isConnected) {
                    return;
                }
                this.hbrChange.emit({
                    value: this.value,
                    custom: this.custom,
                });
            } }, h("div", { key: '998491fde7d5ef97e2c6cc93395daddfe43f2cab', onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, class: cls, part: "base" }, sentiment && sentiment === "admin" ? (h("div", { class: "option__wrapper", part: "wrapper" }, optionChildren)) : (optionChildren))));
    }
    get host() { return this; }
    static get watchers() { return {
        "value": ["handleValueChange"]
    }; }
    static get style() { return HbrOptionStyle0; }
}, [1, "hbr-option", {
        "value": [520],
        "disabled": [516],
        "size": [513],
        "sentiment": [1544],
        "selected": [1540],
        "noCheckMark": [1028, "no-check-mark"],
        "custom": [1540],
        "allowSpace": [516, "allow-space"],
        "truncate": [4],
        "display": [1],
        "hovered": [32],
        "current": [32],
        "singleNonBreakableWord": [32],
        "getTextLabel": [64]
    }, undefined, {
        "value": ["handleValueChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-option", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-option":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrOption);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrOption as H, defineCustomElement as d };

