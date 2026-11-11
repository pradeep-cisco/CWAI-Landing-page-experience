import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const chatMessageCss = ".chat-message{position:relative;padding:calc(var(--hbr-spacing-md) + var(--hbr-spacing-2xs));color:var(--base-text-default);font-size:var(--hbr-font-size-md);font-weight:var(--hbr-font-weight-normal);line-height:22px;overflow:hidden}.chat-message__assistant{position:relative;background:var(--base-bg-medium-default);border-radius:var(--hbr-border-radius-md);padding:var(--hbr-spacing-md) var(--hbr-spacing-md) var(--hbr-spacing-sm) calc(var(--hbr-spacing-md) + var(--hbr-spacing-2xs))}.chat-message__gradient-border{position:absolute;top:0;left:0;width:4px;height:100%;border-radius:12px 0px 0px 12px;background:linear-gradient(27deg, #3B76EA 10.22%, #00BCEB 88.93%, #63FFF7 162.86%)}";
const HbrChatMessageStyle0 = chatMessageCss;

const HbrChatMessage$1 = /*@__PURE__*/ proxyCustomElement(class HbrChatMessage extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.variant = "user";
    }
    render() {
        return (h(Host, { key: '40b9d5fde0988f4998edef16037e503d623641bf' }, h("div", { key: '3e5634e1015816985c90a69be69d29d893fe4ccc', class: {
                "chat-message": true,
                [`chat-message__${this.variant}`]: true,
            }, part: "base" }, h("slot", { key: '6eceb96edc8539e7a90f218e94bb1170f48f4ab7' }), this.variant === "assistant" ? (h("div", { class: "chat-message__gradient-border" })) : null)));
    }
    static get style() { return HbrChatMessageStyle0; }
}, [1, "hbr-chat-message", {
        "variant": [513]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-chat-message"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-chat-message":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrChatMessage$1);
            }
            break;
    } });
}

const HbrChatMessage = HbrChatMessage$1;
const defineCustomElement = defineCustomElement$1;

export { HbrChatMessage, defineCustomElement };

