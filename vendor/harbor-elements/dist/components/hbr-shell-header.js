import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const headerCss = ":host{--hbr-color-header-text-in:var(--base-text-in-weak-default);--hbr-color-header-hover:var(--brand-bg-hover);--hbr-color-header-active:var(--brand-bg-strong-active);--color:var(--brand-text-default);--bg:linear-gradient(90deg, var(--inverse-bg-gradient-start) 0.29%, var(--inverse-bg-gradient-end) 100%, var(--inverse-bg-gradient-end) 100%);--box-shadow:none;--backdrop-filter:none;--min-width:880px;--skip-bg:var(--base-bg-default)}:host{--hbr-color-header:\"transparent\";--color:var(--brand-text-default);color:var(--color)}.shell-header__main slot[name=menu]::slotted(hbr-button){--color-icon:var(--brand-icon-default);--padding:4px;font-size:24px;--border-radius:var(--hbr-border-radius-lg, 8px)}.shell-header__main{box-sizing:border-box;display:flex;align-items:center;width:100%;height:56px;background:var(--bg);padding:10px 16px;min-width:var(--min-width);box-shadow:var(--box-shadow);backdrop-filter:var(--backdrop-filter)}.shell-header__main.shell-header--brand{background:linear-gradient(90deg, var(--inverse-bg-gradient-start) 0.29%, var(--inverse-bg-gradient-end) 100%)}@media only screen and (max-width: 23.4375em){.shell-header__main slot[name=application-launcher],.shell-header__main slot[name=user-profile]{display:none;position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.shell-header__main slot[name=search]::slotted(hbr-input){background-color:#373c42;border-radius:var(--hbr-border-radius-lg, 8px);--placeholder-color:#ffffff}@media only screen and (min-width: 23.5em){.shell-header__main slot[name=search]{display:inherit}}@media only screen and (max-width: 23.4375em){.shell-header__main slot[name=search]{display:none;position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;pointer-events:none;visibility:hidden}}.shell-header__main slot[name=logo-name]::slotted(a[slot=logo-name]){display:flex;align-items:center;margin-right:auto;height:36px;text-decoration:none;border:2px solid transparent;border-left-width:0px;color:inherit;text-decoration:inherit}.shell-header__main slot[name=logo-name]::slotted(a[slot=logo-name]:focus-visible){outline:var(--hbr-focus-outline) solid 2px;box-shadow:0 0 0 2px var(--brand-border-active);outline-offset:2px;border-radius:var(--hbr-border-radius-lg, 8px)}.shell-header__main slot[name=utilities]::slotted(div[slot=utilities]){display:flex;flex-direction:row;align-items:center}.shell-header__main slot[name=title]::slotted(div){display:flex;align-items:center;height:100%}.shell-header__main slot[name=user-profile]::slotted(hbr-dropdown[slot=user-profile]){--trigger-color:var(--inverse-icon-default) !important;--trigger-hover-color:var(--inverse-icon-default) !important;--trigger-open-color:var(--inverse-icon-default) !important;margin-left:10px;}@media only screen and (min-width: 23.5em){.shell-header__main slot[name=user-profile]::slotted(hbr-dropdown[slot=user-profile]){--trigger-display:inherit}}@media only screen and (max-width: 23.4375em){.shell-header__main slot[name=user-profile]::slotted(hbr-dropdown[slot=user-profile]){--trigger-display:none !important}}.wrapper{display:flex;flex-direction:column;width:100%}.skip{background:var(--skip-bg)}.skip:not(:focus-within){transform-style:preserve-3d;transform:rotateY(90deg);position:absolute;left:0;top:0;height:0;-ms-overflow-style:none;scrollbar-width:none}.skip:not(:focus-within)::-webkit-scrollbar{display:none}.skip:focus-within{display:flex;flex-direction:row;gap:16px;padding:8px 16px}@media (max-width: 880px){:host{--min-width:unset}}";
const HbrShellHeaderStyle0 = headerCss;

const Header = /*@__PURE__*/ proxyCustomElement(class Header extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.heightChange = createEvent(this, "hbr-height-changed", 7);
        this.previousHeight = 0;
        this.emitHeightChange = () => {
            const { height } = this.host.getBoundingClientRect();
            if (this.previousHeight !== height) {
                this.heightChange.emit({ height });
            }
            this.previousHeight = height;
        };
        this.handleSkipLinksFocusIn = () => {
            var _a;
            if ((_a = this.skipLinksRef) === null || _a === void 0 ? void 0 : _a.matches(":focus-within")) {
                this.emitHeightChange();
            }
        };
        this.handleSkipLinksFocusOut = () => {
            var _a;
            if (!((_a = this.skipLinksRef) === null || _a === void 0 ? void 0 : _a.matches(":focus-within"))) {
                this.emitHeightChange();
            }
        };
        this.updateScrollState = (scrollTop) => {
            const hasMarkedScroller = document.querySelector("[data-header-scroll-fx]");
            const scrollProgress = Math.min(Math.max(scrollTop, 0) / Header.blurScrollRange, 1);
            const blur = hasMarkedScroller
                ? Header.minimumBlur +
                    (Header.maximumBlur - Header.minimumBlur) * scrollProgress
                : Header.defaultBlur;
            const isScrolled = scrollTop > Header.blurScrollRange;
            this.host.classList.toggle("scrolled", isScrolled);
            this.host.style.setProperty("--blur", `${blur}px`);
            const glowLayer = document.querySelector(".hbr-css__glow-layer");
            if (glowLayer) {
                glowLayer.style.top = `-${scrollTop}px`;
            }
        };
        this.getScrollTop = () => {
            const markedScroller = document.querySelector("[data-header-scroll-fx]");
            if (markedScroller) {
                const overflowY = window.getComputedStyle(markedScroller).overflowY;
                const hasScrollableOverflow = /^(auto|scroll|overlay)$/.test(overflowY) &&
                    markedScroller.scrollHeight > markedScroller.clientHeight;
                if (hasScrollableOverflow)
                    return markedScroller.scrollTop;
            }
            return (window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0);
        };
        this.handleWindowScroll = () => {
            this.updateScrollState(this.getScrollTop());
        };
    }
    componentDidLoad() {
        window.addEventListener("scroll", this.handleWindowScroll, {
            capture: true,
            passive: true,
        });
        this.updateScrollState(this.getScrollTop());
    }
    disconnectedCallback() {
        window.removeEventListener("scroll", this.handleWindowScroll, true);
        this.host.classList.remove("scrolled");
        this.host.style.removeProperty("--blur");
    }
    render() {
        return (h("div", { key: '84aacc29b505f61fe34e16216faabe259e29d2a6', class: "wrapper", part: "wrapper", onFocusin: this.handleSkipLinksFocusIn, onFocusout: this.handleSkipLinksFocusOut }, h("div", { key: 'da9deecd23caa2ef23c4f9bcd14b762fd6f8224b', class: "skip", part: "skip", ref: (el) => (this.skipLinksRef = el) }, h("slot", { key: '3e10de9b7ca145faed95fb72d21a5e36cd504635', name: "skip" })), h("header", { key: '25accc556a22213d2ee329e9c0258e57f227b184', class: { "shell-header__main": true }, part: "base" }, h("slot", { key: 'd5eee7d0258d37de864231d127d092599807db31', name: "menu" }), h("slot", { key: '2a36722ff8ecbda266a5ba29272c9d878f840655', name: "logo-name" }), h("slot", { key: 'd103cad6d39cf92c3de89d8aca4da93f19ff353e', name: "title" }), h("slot", { key: '9192210d6c7f439c42eef227f329cee1a608cc77', name: "search" }), h("slot", { key: '792fb031d4c989d9fc7d2288e33364bdf0624e30', name: "utilities" }), h("slot", { key: 'db7cccdadcf882810bcd77574ce14328897f85c9', name: "user-profile" }), h("slot", { key: '331578dac8225cf0e98dd6aeee9474f8a93a5af4', name: "application-launcher" }))));
    }
    get host() { return this; }
    static get style() { return HbrShellHeaderStyle0; }
}, [1, "hbr-shell-header"]);
Header.blurScrollRange = 160;
Header.minimumBlur = 1;
Header.maximumBlur = 30;
Header.defaultBlur = 4;
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-shell-header"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-shell-header":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Header);
            }
            break;
    } });
}

const HbrShellHeader = Header;
const defineCustomElement = defineCustomElement$1;

export { HbrShellHeader, defineCustomElement };

