import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const loaderCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--color:var(--interact-bg-default);--label-color:var(--base-text-default);--label-margin-top:calc(var(--hbr-spacing-md) + var(--hbr-spacing-3xs));--shape-border-radius:var(--hbr-border-radius-sm)}.loader{display:flex;flex-direction:column;align-items:center;width:fit-content}.loader .label{font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-normal);letter-spacing:var(--hbr-line-letter-spacing-normal);font-family:var(--hbr-font-body);margin-top:var(--label-margin-top);color:var(--label-color);text-align:center}.loader .loading{display:flex;flex-direction:row;align-items:center;justify-content:space-between}.loader .shape{background:var(--color);border-radius:var(--shape-border-radius);animation-duration:2.1s;animation-timing-function:ease-in-out;animation-direction:normal;animation-iteration-count:infinite;animation-play-state:running}.loader .shape:nth-child(1){animation-name:animation1}.loader .shape:nth-child(2){animation-name:animation2}.loader .shape:nth-child(3){animation-name:animation3}.loader .shape:nth-child(4){animation-name:animation4}.loader .shape:nth-child(5){animation-name:animation5}.loader .shape:nth-child(6){animation-name:animation6}.loader .shape:nth-child(7){animation-name:animation7}.loader .shape:nth-child(8){animation-name:animation8}.loader .shape:nth-child(9){margin-right:0px;animation-name:animation9}@keyframes animation1{0%{height:0%}3%{height:11.7%}9.1%{height:40%}37.9%{height:11.7%}44%{height:40%}50%{height:21.7%}100%{height:21.7%}}@keyframes animation2{0%{height:0%}4.6%{height:0%}7.6%{height:11.7%}13.6%{height:70%}19.7%{height:36.7%}40.9%{height:11.7%}47%{height:70%}53%{height:36.7%}100%{height:36.7%}}@keyframes animation3{0%{height:0%}7.6%{height:0%}10.6%{height:11.7%}16.7%{height:100%}22.7%{height:70%}47%{height:11.7%}53%{height:100%}59.1%{height:70%}100%{height:70%}}@keyframes animation4{0%{height:0%}13.7%{height:0%}16.7%{height:11.7%}22.7%{height:70%}28.8%{height:36.7%}53%{height:11.7%}59.1%{height:70%}65.1%{height:36.7%}100%{height:36.7%}}@keyframes animation5{0%{height:0%}18.2%{height:0%}21.2%{height:11.7%}27.3%{height:40%}57.6%{height:11.7%}63.6%{height:40%}69.7%{height:21.7%}100%{height:21.7%}}@keyframes animation6{0%{height:0%}22.8%{height:0%}25.8%{height:11.7%}31.8%{height:70%}37.9%{height:36.7%}62.1%{height:11.7%}68.2%{height:70%}74.2%{height:36.7%}100%{height:36.7%}}@keyframes animation7{0%{height:0%}28.8%{height:0%}31.8%{height:11.7%}37.9%{height:100%}44%{height:70%}68.2%{height:11.7%}74.2%{height:100%}80.3%{height:70%}100%{height:70%}}@keyframes animation8{0%{height:0%}34.9%{height:0%}37.9%{height:11.7%}44%{height:70%}50%{height:36.7%}74.2%{height:11.7%}80.3%{height:70%}86.4%{height:36.7%}100%{height:36.7%}}@keyframes animation9{0%{height:0%}39.4%{height:0%}42.4%{height:11.7%}48.5%{height:40%}78.8%{height:11.7%}84.9%{height:40%}90.9%{height:21.7%}100%{height:21.7%}}";
const HbrLoaderStyle0 = loaderCss;

const Loader = /*@__PURE__*/ proxyCustomElement(class Loader extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.maxSize = 60;
        this.size = 24;
        this.aria = undefined;
    }
    render() {
        var _a;
        if (this.size > this.maxSize)
            this.size = this.maxSize;
        const width = Math.round(this.size * 2.5);
        const shapeWidth = Math.round(width * 0.047);
        return (h("div", { key: 'ffafa4cc9104dc4b35dcd334ee785c4ba6605042', part: "base", class: {
                loader: true,
            }, "aria-label": ((_a = this.aria) === null || _a === void 0 ? void 0 : _a.label) || "Loading...", role: "status", "aria-live": "polite" }, h("div", { key: '72254427eade48df710b785e01fd16d65b314afa', class: "loading", style: {
                height: `${this.size}px`,
                width: `${width}px`,
            } }, [...Array(9).keys()].map(() => (h("div", { class: "shape", style: { width: `${shapeWidth}px` } })))), h("div", { key: 'ca44c6c49e6058b65076fa2d4c489bef6437a88f', class: "label" }, h("slot", { key: '93d9782db99976c0be9503d7261cdd7dec37bbfe' }))));
    }
    get host() { return this; }
    static get style() { return HbrLoaderStyle0; }
}, [1, "hbr-loader", {
        "size": [2],
        "aria": [16]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-loader"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-loader":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Loader);
            }
            break;
    } });
}

const HbrLoader = Loader;
const defineCustomElement = defineCustomElement$1;

export { HbrLoader, defineCustomElement };

