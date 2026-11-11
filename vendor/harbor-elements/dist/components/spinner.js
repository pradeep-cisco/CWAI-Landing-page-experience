import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { $ as loader } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$1 } from './icon.js';
import { i as internationalization } from './translations.js';

const translations = {
    en: {
        loading: "loading",
    },
    ko: {
        loading: "로드 중",
    },
    ja: {
        loading: "読み込み中",
    },
    zh: {
        loading: "加载中",
    },
};

const spinnerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--indicator-color:var(--interact-icon-weak-default);--label-color:var(--base-text-medium-default);--stroke-width:var(--hbr-spacing-3xs);--size:1em;--size-sm:20px;--size-md:36px;--size-lg:48px;--size-xl:72px;--label-size:1em;--label-size-sm:var(--hbr-font-size-sm);--label-size-md:var(--hbr-font-size-md);--label-size-lg:var(--hbr-font-size-lg);--label-size-xl:var(--hbr-font-size-lg);--gap:12px;--gap-sm:8px;--gap-md:12px;--gap-lg:12px;--gap-xl:16px;display:inline-flex}.spinner{display:flex;align-items:center;font-size:var(--size);color:var(--indicator-color);gap:var(--gap)}.spinner .spinner-icon{width:1em;height:1em;line-height:1em;animation:1s linear infinite spin}.spinner slot[name=label]{color:var(--label-color);text-align:center;font-weight:600;font-size:var(--label-size);line-height:var(--hbr-line-height-normal)}.spinner.spinner-size-small{font-size:var(--size-sm);gap:var(--gap-sm)}.spinner.spinner-size-small slot[name=label]{font-size:var(--label-size-sm);line-height:20px}.spinner.spinner-size-medium{font-size:var(--size-md);gap:var(--gap-md)}.spinner.spinner-size-medium slot[name=label]{font-size:var(--label-size-md);line-height:22px}.spinner.spinner-size-large{font-size:var(--size-lg);gap:var(--gap-lg)}.spinner.spinner-size-large slot[name=label]{font-size:var(--label-size-lg);line-height:24px}.spinner.spinner-size-extra-large{font-size:var(--size-xl);gap:var(--gap-xl)}.spinner.spinner-size-extra-large slot[name=label]{font-size:var(--label-size-xl);line-height:24px}.spinner.spinner-direction-column{flex-direction:column}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
const HbrSpinnerStyle0 = spinnerCss;

const Spinner = /*@__PURE__*/ proxyCustomElement(class Spinner extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.size = undefined;
        this.direction = "row";
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        return (h("span", { key: 'e3f156996b3f75529b9044ce1d90409f8b65a249', part: "base", class: Object.assign({ spinner: true, [`spinner-direction-${this.direction}`]: true }, (this.size ? { [`spinner-size-${this.size}`]: true } : null)),
            // biome-ignore lint/a11y/useAriaPropsForRole: WAI-ARIA requires omitting aria-valuenow for indeterminate progressbars.
            role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-label": internationalization(translations, "loading") }, h("div", { key: '148f44ac9392ddc179cb2dc3f86029e4ebab12d2', class: "spinner-icon", part: "icon" }, h("slot", { key: 'af1727532a7d605fb1c2f64fa2d9d01b6f17dbb4', name: "icon" }, h("hbr-icon", { key: '5b85b22a6b368447d39c91cad8ca1fc643a4dbcb', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.loader) || loader }))), h("slot", { key: 'a71a5091fec30fb1ecf930a08a54b025623fa222', name: "label" })));
    }
    static get style() { return HbrSpinnerStyle0; }
}, [1, "hbr-spinner", {
        "size": [513],
        "direction": [513]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-spinner", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Spinner);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { Spinner as S, defineCustomElement as d };

