import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const buttonGroupCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block}.button-group{display:flex;flex-wrap:nowrap;position:relative}::slotted(.hbr-hover){z-index:1}::slotted(.hbr-focus){z-index:2}.button-group--disabled{cursor:not-allowed}.button-group--disabled ::slotted(hbr-button),.button-group--disabled ::slotted(hbr-radio-button){cursor:not-allowed}";
const HbrButtonGroupStyle0 = buttonGroupCss;

const BUTTON_CHILDREN = ["hbr-button", "hbr-radio-button"];
const BUTTON_SELECTOR = BUTTON_CHILDREN.join(",");
const SPLIT_BUTTON_ATTRIBUTE = "split-button";
const ButtonGroup = /*@__PURE__*/ proxyCustomElement(class ButtonGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.label = "";
        this.aria = undefined;
        this.size = undefined;
        this.disabled = false;
        this.sentiment = undefined;
        this.disableRole = false;
    }
    handleDisabledChange(newValue) {
        const slottedElements = this.getSlottedElements();
        slottedElements.forEach((el) => {
            const button = findButton(el);
            if (button !== null) {
                button.disabled = newValue;
            }
        });
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }
    getSlottedElements() {
        var _a;
        const slot = (_a = this.el.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!(slot instanceof HTMLSlotElement)) {
            return [];
        }
        return slot
            .assignedElements({ flatten: true })
            .filter((el) => {
            return el instanceof HTMLElement;
        });
    }
    getButtonFromEventTarget(target) {
        if (!(target instanceof HTMLElement)) {
            return null;
        }
        return findButton(target);
    }
    getIsSplitButton(slottedElements) {
        if (slottedElements.length !== 2) {
            return false;
        }
        const [firstElement, secondElement] = slottedElements;
        if (!isButtonElement(firstElement)) {
            return false;
        }
        if (isDropdownElement(secondElement)) {
            return hasLightDomTriggerButton(secondElement);
        }
        return (isButtonElement(secondElement) &&
            this.isAnchoredByExternalDropdown(secondElement));
    }
    resolveDropdownAnchor(dropdown) {
        var _a;
        const anchor = (_a = dropdown.anchor) !== null && _a !== void 0 ? _a : dropdown.getAttribute("anchor");
        if (typeof anchor === "string") {
            try {
                return this.el.ownerDocument.querySelector(anchor);
            }
            catch (_b) {
                return null;
            }
        }
        return anchor instanceof HTMLElement ? anchor : null;
    }
    isAnchoredByExternalDropdown(button) {
        const dropdowns = this.el.ownerDocument.querySelectorAll("hbr-dropdown");
        return Array.from(dropdowns).some((dropdown) => {
            return this.resolveDropdownAnchor(dropdown) === button;
        });
    }
    setSplitButtonAttribute(value) {
        this.el.toggleAttribute(SPLIT_BUTTON_ATTRIBUTE, value);
    }
    handleFocus(event) {
        if (this.disabled)
            return;
        const button = this.getButtonFromEventTarget(event.target);
        button === null || button === void 0 ? void 0 : button.classList.add("hbr-button-group__button--focus");
    }
    handleBlur(event) {
        const button = this.getButtonFromEventTarget(event.target);
        button === null || button === void 0 ? void 0 : button.classList.remove("hbr-button-group__button--focus");
    }
    handleMouseOver(event) {
        if (this.disabled)
            return;
        const button = this.getButtonFromEventTarget(event.target);
        button === null || button === void 0 ? void 0 : button.classList.add("hbr-button-group__button--hover");
    }
    handleMouseOut(event) {
        const button = this.getButtonFromEventTarget(event.target);
        button === null || button === void 0 ? void 0 : button.classList.remove("hbr-button-group__button--hover");
    }
    handleSlotChange() {
        const slottedElements = this.getSlottedElements();
        const splitButton = this.getIsSplitButton(slottedElements);
        this.setSplitButtonAttribute(splitButton);
        slottedElements.forEach((el, index) => {
            const button = findButton(el);
            const sentiment = this.sentiment;
            /** set/overwrite sentiment on split button */
            if (splitButton) {
                const buttonElement = getSplitButtonElement(el, index);
                if (buttonElement) {
                    const triggerEl = isDropdownElement(buttonElement)
                        ? buttonElement.querySelector("hbr-button[slot='trigger']") ||
                            buttonElement.querySelector("hbr-button")
                        : null;
                    const trigger = isButtonElement(triggerEl) ? triggerEl : null;
                    if (!sentiment) {
                        if (!buttonElement.sentiment) {
                            buttonElement.sentiment = "interact";
                            if (trigger && !trigger.sentiment) {
                                trigger.sentiment = "interact";
                            }
                        }
                    }
                    else {
                        buttonElement.sentiment = sentiment;
                        if (trigger) {
                            trigger.sentiment = sentiment;
                        }
                    }
                }
            }
            /** ------------------------------- */
            if (button !== null) {
                const isSplitMember = splitButton && index < 2;
                const splitPosition = isSplitMember
                    ? index === 0
                        ? "left"
                        : "right"
                    : null;
                button.classList.add("hbr-button-group__button");
                button.classList.toggle("button--split", isSplitMember);
                button.classList.toggle("hbr-button-group__button--first", index === 0);
                button.classList.toggle("hbr-button-group__button--inner", index > 0 && index < slottedElements.length - 1);
                button.classList.toggle("hbr-button-group__button--last", index === slottedElements.length - 1);
                button.classList.toggle("hbr-button-group__button--radio", button.localName === "hbr-radio-button");
                if (isButtonElement(button)) {
                    void button.setSplitPosition(splitPosition !== null && splitPosition !== void 0 ? splitPosition : undefined);
                }
                if (this.disabled) {
                    button.disabled = true;
                }
            }
        });
    }
    render() {
        var _a;
        return (h(Host, { key: '7d7216463f17f033fd232e59b12b662e14fb8cb2' }, h("div", { key: '63339c5f4fbc31a0bfa90159e04aa4150ed07f56', ref: (el) => {
                this.buttonGroup = el;
            }, part: "base", class: {
                "button-group": true,
                "button-group--disabled": this.disabled,
                [`button-group--${this.size}`]: !!this.size,
                [`button-group--${this.sentiment}`]: !!this.sentiment,
            }, role: this.disableRole ? "presentation" : "group", "aria-label": ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) || this.label, "aria-disabled": this.disabled, onMouseOver: this.handleMouseOver, onBlur: this.handleBlur, onFocus: this.handleFocus, onMouseOut: this.handleMouseOut }, h("slot", { key: '3cf15399bcf095bb1ae9f190a296ee5dd2bea825', onSlotchange: this.handleSlotChange }))));
    }
    get el() { return this; }
    static get watchers() { return {
        "disabled": ["handleDisabledChange"]
    }; }
    static get style() { return HbrButtonGroupStyle0; }
}, [1, "hbr-button-group", {
        "label": [1],
        "aria": [16],
        "size": [513],
        "disabled": [516],
        "sentiment": [513],
        "disableRole": [1028, "disable-role"]
    }, undefined, {
        "disabled": ["handleDisabledChange"]
    }]);
function isButtonElement(el) {
    return !!el && el.localName === "hbr-button";
}
function isDropdownElement(el) {
    return !!el && el.localName === "hbr-dropdown";
}
function hasLightDomTriggerButton(dropdown) {
    return Array.from(dropdown.children).some((child) => {
        return (isButtonElement(child) &&
            (!child.hasAttribute("slot") || child.slot === "trigger"));
    });
}
function isButtonChildElement(el) {
    return (!!el &&
        BUTTON_CHILDREN.includes(el.localName));
}
function getSplitButtonElement(el, index) {
    if (index === 0 && isButtonElement(el)) {
        return el;
    }
    if (index === 1 && (isDropdownElement(el) || isButtonElement(el))) {
        return el;
    }
    return null;
}
function findButton(el) {
    if (isButtonChildElement(el)) {
        return el;
    }
    const button = el.querySelector(BUTTON_SELECTOR);
    return isButtonChildElement(button) ? button : null;
}
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-button-group"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-button-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ButtonGroup);
            }
            break;
    } });
}

export { ButtonGroup as B, defineCustomElement as d };

