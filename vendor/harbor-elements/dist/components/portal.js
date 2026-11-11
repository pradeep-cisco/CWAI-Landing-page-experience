import { proxyCustomElement, HTMLElement as HTMLElement$1 } from '@stencil/core/internal/client';

/**
 * constant values, utilities common across components, utils, and other harbor-elements capabilities
 */
const PORTAL_CLASSNAME = "hbr__default-portal";
function createDefaultPortalContainer() {
    const canUseDOM = !!(typeof window !== "undefined" &&
        window.document &&
        window.document.createElement);
    if (canUseDOM) {
        const existingPortalEl = document.querySelector(`.${PORTAL_CLASSNAME}`);
        const defaultPortalEl = existingPortalEl ||
            Object.assign(document.createElement("div"), {
                className: PORTAL_CLASSNAME,
            });
        document.body.appendChild(defaultPortalEl);
        return defaultPortalEl;
    }
    return null;
}
/**
 * Resolves an HTMLElement from a string or HTMLElement
 * @param elementOrString string | HTMLElement
 * @returns HTMLElement
 */
function resolveElementFromElementOrString(elementOrString, proxyBody = false) {
    if (!elementOrString)
        return null;
    let element;
    if (elementOrString && typeof elementOrString === "string") {
        if (proxyBody && elementOrString === "body") {
            element = createDefaultPortalContainer();
        }
        else {
            element = document.querySelector(elementOrString);
        }
    }
    else if (elementOrString instanceof HTMLElement) {
        element = elementOrString;
    }
    if (!element) {
        console.warn("Invalid target element: no target could be found using the target attribute.");
    }
    return element;
}

const portalCss = ":host{display:block}";
const HbrPortalStyle0 = portalCss;

const HbrPortal = /*@__PURE__*/ proxyCustomElement(class HbrPortal extends HTMLElement$1 {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.movedChildren = [];
        this.target = "body";
    }
    handletargetChange() {
        this.targetRef = resolveElementFromElementOrString(this.target, true);
    }
    connectedCallback() {
        this.handletargetChange = this.handletargetChange.bind(this);
    }
    componentWillLoad() {
        this.handletargetChange();
    }
    componentDidLoad() {
        if (this.targetRef) {
            this.moveChildren();
        }
    }
    disconnectedCallback() {
        if (this.el && this.targetRef) {
            this.moveChildrenBack();
        }
    }
    moveChildren() {
        while (this.el.childNodes.length > 0) {
            const child = this.el.firstChild;
            this.targetRef.appendChild(this.el.firstChild);
            this.movedChildren.push(child);
        }
    }
    moveChildrenBack() {
        while (this.movedChildren.length > 0) {
            this.el.appendChild(this.movedChildren.pop());
        }
    }
    render() {
        return null;
    }
    get el() { return this; }
    static get watchers() { return {
        "target": ["handletargetChange"]
    }; }
    static get style() { return HbrPortalStyle0; }
}, [1, "hbr-portal", {
        "target": [1]
    }, undefined, {
        "target": ["handletargetChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-portal"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-portal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrPortal);
            }
            break;
    } });
}

export { HbrPortal as H, defineCustomElement as d };

