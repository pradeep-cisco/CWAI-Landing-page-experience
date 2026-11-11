import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$7 } from './board.js';
import { d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$5 } from './illustration.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';

const exploreCss = "";
const HbrExploreStyle0 = exploreCss;

const POPOVER_DISTANCE = 10;
const POPOVER_PLACEMENT = "top";
const HbrExploreChart = /*@__PURE__*/ proxyCustomElement(class HbrExploreChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.renderRequestId = 0;
        this.getRenderModule = () => {
            if (!this.renderModulePromise) {
                this.renderModulePromise = import('./render-chart.js');
            }
            return this.renderModulePromise;
        };
        this.queueRenderChart = async () => {
            const requestId = ++this.renderRequestId;
            await this.boardRef.setChartConfig(this.config);
            setTimeout(async () => {
                if (requestId !== this.renderRequestId ||
                    !this.chartRef ||
                    !this.tooltipRef) {
                    return;
                }
                const { renderExploreChart } = await this.getRenderModule();
                if (requestId !== this.renderRequestId) {
                    return;
                }
                await renderExploreChart({
                    chartRef: this.chartRef,
                    tooltipRef: this.tooltipRef,
                    config: this.config,
                });
            }, 50);
        };
        this.loading = false;
        this.config = {
            data: {
                name: "Empty Root",
            },
            leaf: {
                label: {
                    paddingX: 20,
                    paddingY: 10,
                    borderRadius: 10,
                    backgroundColor: "transparent",
                    deltaX: 180,
                    deltaY: 0,
                },
            },
            width: 720,
            height: 480,
            scale: 0.85,
            sector: {
                fontSize: 18,
                heightDiff: 0,
                textUpperDelta1: 32,
                textLowerDelta1: -18,
                textUpperDelta2: 32,
                textLowerDelta2: -18,
                textUpperDelta3: 32,
                textLowerDelta3: -18,
            },
        };
    }
    async componentDidLoad() {
        await this.queueRenderChart();
    }
    async componentShouldUpdate() {
        await this.queueRenderChart();
    }
    render() {
        return (h(Host, { key: '70a1701a41bda75f33f055d4a5c0483af2c7208d' }, h("hbr-chart-board", { key: '61e83d2e585097ab7c9097eacc46bd0b35001c0d', ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, style: { width: "100%", height: "100%" } }, h("hbr-popover", { key: '0fe1a2091130fe0d08ac06d113c69d46e9d7b569', distance: POPOVER_DISTANCE, anchor: "", ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", variant: "chart", placement: POPOVER_PLACEMENT }, h("div", { key: 'a04d6e0713493900ce92bfcbfb9f47a8a18d1c32', slot: "content" }, h("div", { key: '4f53dc7b137ca5165a2bd2a6aec585b7d552139a', style: { display: "flex", justifyContent: "space-between" } }, h("div", { key: '995a317e5b45a4f23fc8f7beaf45bc6088fa5f06', style: { display: "flex", alignItems: "center", gap: "6px" } }, h("div", { key: 'c8233cd4e52a11c25254a1820de0aba19acd71d0', class: "color", style: { width: "16px", height: "16px", background: "" } }), h("span", { key: '0047d44a79fc2325baf7e02b8a379f6d7d46fbdf' })), h("div", { key: '0a4569e6df0559618e7b5e0be0b61b2d40035480' }, h("span", { key: '392e211cc6cd64fe769dd0897529ba575b284c06' }))))), h("div", { key: 'b4e37f76986c0602b806ded9d047908953994a8c', style: { width: "100%", height: "100%" }, ref: (el) => {
                this.chartRef = el;
            }, class: "--hbr-explore", part: "chart" }), h("div", { key: '67afe80d4c32893287d666e7ca5644b0a1a92255', slot: "footer" }, h("slot", { key: '8d48118e93037a188e384a5ce1c774a6219c2f63', name: "footer" })), h("div", { key: '5087b6b2c98ebfe343f84ced8e3540388bc3bc5b', slot: "loading-state" }, h("slot", { key: '93242d1c321c3cd3fa147739ee3bd0b985ad51cc', name: "loading-state" })), h("div", { key: '2d9d0769778d728c1cda1142f94472f4e170201d', slot: "empty-state" }, h("slot", { key: '2f8d4d7a9409953c42525715a2d3f2052b4addb5', name: "empty-state" })))));
    }
    get host() { return this; }
    static get style() { return HbrExploreStyle0; }
}, [1, "hbr-explore", {
        "loading": [4],
        "config": [16]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-explore", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-explore":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrExploreChart);
            }
            break;
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrExplore = HbrExploreChart;
const defineCustomElement = defineCustomElement$1;

export { HbrExplore, defineCustomElement };

