import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { u as user } from './index2.js';
import { d as defineCustomElement$2 } from './icon.js';

const avatarCss = ":host{display:inline-block;vertical-align:middle;--size:32px;--initials-font-size:var(--hbr-font-size-sm);--icon-size:var(--hbr-font-size-md);--bg-color:var(--control-bg-medium-disabled);--text-color:initial;--text-font:var(--hbr-font-body, var(--hbr-font-family-sans, sans-serif));--text-weight:var(--hbr-font-weight-semibold, 600);--round-border-radius:var(--hbr-border-radius-sm);--size-small:24px;--size-medium:32px;--size-large:40px;--border:none}:host([size=small]){--size:var(--size-small);--initials-font-size:var(--hbr-font-size-xs);--icon-size:var(--hbr-font-size-sm)}:host([size=large]){--size:var(--size-large);--initials-font-size:var(--hbr-font-size-md);--icon-size:var(--hbr-font-size-lg)}.avatar{display:inline-flex;align-items:center;justify-content:center;position:relative;width:var(--size);height:var(--size);background-color:var(--bg-color);--color:var(--text-color);--font-family:var(--text-font);--font-weight:var(--text-weight);text-transform:uppercase;user-select:none;overflow:hidden;-webkit-user-select:none;vertical-align:middle;border:var(--border)}.avatar--circle{border-radius:50%}.avatar__content{display:flex;align-items:center;justify-content:center;width:100%;height:100%}.avatar__image{width:100%;height:100%;object-fit:cover;object-position:center}.avatar__initials{font-size:var(--initials-font-size);line-height:1;text-align:center}.avatar__icon{font-size:var(--icon-size);height:var(--icon-size);display:flex;align-items:center;justify-content:center}.avatar__circle,.avatar__circle .avatar__image{border-radius:var(--hbr-border-radius-circle)}.avatar__rounded,.avatar__rounded .avatar__image{border-radius:var(--round-border-radius)}.avatar--square{border-radius:0}";
const HbrAvatarStyle0 = avatarCss;

const Avatar = /*@__PURE__*/ proxyCustomElement(class Avatar extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.aria = { label: "User avatar" };
        this.image = undefined;
        this.size = "medium";
        this.initials = undefined;
        this.loading = "eager";
        this.shape = "circle";
    }
    render() {
        let content;
        if (this.image) {
            content = (h("img", { key: '6b40b16945cb259b469281fe8e025e6330e75edc', part: "image", class: "avatar__image", src: this.image, loading: this.loading, alt: this.aria.label }));
        }
        else if (this.initials) {
            content = (h("div", { key: '2507022041d3f134e08083971b1ce03ca207ed76', part: "initials", class: "avatar__initials" }, this.initials));
        }
        else {
            content = (h("div", { key: '6596427ce800ae859e75e5e2ff4321f542bda140', part: "icon", class: "avatar__icon", "aria-hidden": "true" }, h("slot", { key: '5225e08c1d740ebb1d3b27955ee2311f3a15adb3', name: "icon" }, h("hbr-icon", { key: 'a4824c55b3ad130d8655a096ef6f188d4bfc1cd5', asset: user }))));
        }
        return (h(Host, { key: 'e974656ddcf98ea5241a4dbb6c2b68f687039084' }, h("div", { key: 'b1d891617057718bcfed97ed16d4e1626e5a3a4d', part: "base", class: {
                avatar: true,
                [`avatar__${this.shape}`]: true,
            }, role: "img", "aria-label": this.aria.label }, content)));
    }
    static get style() { return HbrAvatarStyle0; }
}, [1, "hbr-avatar", {
        "aria": [16],
        "image": [1],
        "size": [513],
        "initials": [1],
        "loading": [1],
        "shape": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-avatar", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-avatar":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Avatar);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrAvatar = Avatar;
const defineCustomElement = defineCustomElement$1;

export { HbrAvatar, defineCustomElement };

