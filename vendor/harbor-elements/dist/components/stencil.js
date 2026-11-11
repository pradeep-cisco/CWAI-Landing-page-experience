import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const stencilCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--border-radius:var(--hbr-border-radius-xl);--color:var(--base-bg-default);--sheen-color:var(--base-border-weak-default);--chart-width:264px;--chart-height:219px;display:block;position:relative}.stencil{display:flex;width:100%;height:100%;min-height:1rem}.stencil__indicator{flex:1 1 auto;background:var(--color);border-radius:var(--border-radius)}.stencil--sheen .stencil__indicator{background:linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));background-size:400% 100%;animation:sheen 8s ease-in-out infinite}.stencil--chart-svg{position:fixed;transform:translateZ(1px);-webkit-transform:translateZ(1px);top:-10000%;left:-10000%;z-index:-10000}.stencil--sheen .stencil__indicator-chart{clip-path:url(#hbr-stencil-chart-clipping);-webkit-clip-path:url(#hbr-stencil-chart-clipping);max-width:264px;max-height:219px;width:var(--chart-width);height:var(--chart-height)}.stencil--pulse .stencil__indicator{animation:pulse 2s ease-in-out 0.5s infinite}@keyframes sheen{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes pulse{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}";
const HbrStencilStyle0 = stencilCss;

const stencil = /*@__PURE__*/ proxyCustomElement(class stencil extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.renderChart = () => {
            return (h("svg", { class: "stencil--chart-svg", xmlns: "http://www.w3.org/2000/svg", width: "264px", height: "219px", viewBox: "0 0 264 219" }, h("defs", null, h("clipPath", { id: "hbr-stencil-chart-clipping", clipPathUnits: "objectBoundingBox" }, h("path", { d: "M0.577,0.395 C0.582,0.389,0.589,0.389,0.593,0.395 L0.794,0.631 L0.98,0.423 C0.985,0.418,0.992,0.418,0.996,0.424 C1,0.429,1,0.438,0.996,0.443 L0.801,0.659 C0.797,0.664,0.79,0.664,0.786,0.659 L0.585,0.423 L0.446,0.589 C0.463,0.629,0.473,0.673,0.473,0.721 C0.473,0.875,0.367,1,0.237,1 C0.106,1,0,0.875,0,0.721 L0,0.719 L0.068,0.719 C0.068,0.719,0.068,0.72,0.068,0.721 C0.068,0.831,0.144,0.92,0.237,0.92 C0.33,0.92,0.405,0.831,0.405,0.721 C0.405,0.611,0.33,0.522,0.237,0.522 C0.232,0.522,0.228,0.523,0.223,0.523 L0.223,0.442 C0.228,0.442,0.232,0.442,0.237,0.442 C0.319,0.442,0.391,0.491,0.434,0.566 L0.577,0.395 M0.585,0.442 L0.678,0.551 V0.862 H0.758 V0.645 L0.777,0.668 C0.786,0.679,0.8,0.679,0.809,0.669 L0.909,0.558 V0.862 H0.996 C0.998,0.862,1,0.864,1,0.866 V0.884 C1,0.886,0.998,0.888,0.996,0.888 L0.44,0.888 C0.445,0.88,0.45,0.871,0.454,0.862 L0.527,0.862 V0.512 L0.585,0.442 M0.212,0.443 V0.524 C0.135,0.538,0.075,0.613,0.069,0.705 H0 C0.007,0.568,0.097,0.457,0.212,0.443 M0.894,0.416 C0.903,0.416,0.909,0.422,0.909,0.434 V0.484 L0.794,0.612 L0.758,0.569 V0.434 C0.758,0.422,0.763,0.416,0.773,0.416 H0.894 M0.432,0.215 C0.441,0.215,0.447,0.221,0.447,0.233 V0.53 L0.435,0.545 C0.401,0.492,0.352,0.453,0.295,0.437 V0.233 C0.295,0.221,0.301,0.215,0.311,0.215 H0.432 M0.663,0 C0.672,0,0.678,0.007,0.678,0.018 V0.476 L0.601,0.385 C0.592,0.375,0.578,0.375,0.569,0.385 L0.527,0.436 V0.018 C0.527,0.007,0.532,0,0.542,0 H0.663" })))));
        };
        this.effect = "sheen";
        this.variant = undefined;
    }
    render() {
        return (h("div", { key: 'b2220e8fae5dfcbba31c36c6804f1e9a9b4a6109', part: "base", class: {
                stencil: true,
                "stencil--pulse": this.effect === "pulse",
                "stencil--sheen": this.effect === "sheen",
            }, "aria-busy": "true", "aria-live": "polite" }, this.variant === "chart" && this.renderChart(), h("div", { key: '8327b29562b661c6a821ab262bce2778563f122e', part: "indicator", class: {
                stencil__indicator: true,
                "stencil__indicator-chart": this.variant === "chart",
            } })));
    }
    static get style() { return HbrStencilStyle0; }
}, [1, "hbr-stencil", {
        "effect": [1],
        "variant": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, stencil);
            }
            break;
    } });
}

export { defineCustomElement as d, stencil as s };

