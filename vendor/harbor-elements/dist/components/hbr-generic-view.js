import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

const HbrGenericView$1 = /*@__PURE__*/ proxyCustomElement(class HbrGenericView extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.hbrConnect = createEvent(this, "hbr-connect", 7);
        this.hbrLoad = createEvent(this, "hbr-load", 7);
        this.hbrRender = createEvent(this, "hbr-render", 7);
        this.hbrDisconnect = createEvent(this, "hbr-disconnect", 7);
        this.view = undefined;
        this.emitDisconnect = false;
        this.viewProps = undefined;
    }
    connectedCallback() {
        this.hbrConnect.emit();
    }
    componentDidLoad() {
        this.hbrLoad.emit();
        try {
            if (this.host && typeof this.view === "function") {
                this.genericView = this.view();
                this.host.appendChild(this.genericView.getDOMNode(this.viewProps));
                if (this.genericView.onRender)
                    this.genericView.onRender();
            }
        }
        catch (err) {
            console.error("Failed to render wrapped view", err);
        }
    }
    componentDidRender() {
        this.hbrRender.emit();
        try {
            if (this.genericView) {
                this.genericView.getDOMNode(this.viewProps);
            }
        }
        catch (err) {
            console.error("Failed to update wrapped view", err);
        }
    }
    disconnectedCallback() {
        if (this.emitDisconnect) {
            this.hbrDisconnect.emit();
        }
        try {
            if (this.genericView && this.genericView.dispose) {
                this.genericView.dispose();
            }
        }
        catch (err) {
            console.error("Failed to dispose wrapped view");
        }
    }
    render() {
        return h(Host, { key: 'b78dda5d250684daaee0e7dfa9eb5bcb0b79fac2', style: { display: "contents" } });
    }
    get host() { return this; }
}, [0, "hbr-generic-view", {
        "view": [16],
        "emitDisconnect": [4, "emit-disconnect"],
        "viewProps": [16]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-generic-view"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-generic-view":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrGenericView$1);
            }
            break;
    } });
}

const HbrGenericView = HbrGenericView$1;
const defineCustomElement = defineCustomElement$1;

export { HbrGenericView, defineCustomElement };

