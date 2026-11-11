import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { _ } from './harbor-charts-sankey.es.js';
import { c as cjs } from './cjs.js';
import { c as createRoot, R as React } from './client.js';
import { c as combineMergeArray } from './combineMergeArray.js';

function getSankeyBaseConfig(data) {
    return {
        data,
    };
}
function renderChart(params) {
    const { el, config } = params;
    /**
     * merges: common charts config < bar charts common config < config from user
     * TODO: do we need un modifiable config?
     */
    const _config = cjs.all([getSankeyBaseConfig(config.data), config], {
        arrayMerge: combineMergeArray,
    });
    const root = createRoot(el);
    root.render(React.createElement(_, _config, null));
}

const hbrSankeyCss = ".hbr-hide{display:none}:host svg+div>div.chart--custom-tooltip{background:var(--hbr-color-neutral-bg);color:var(--hbr-color-neutral-text);font-size:var(--hbr-font-size-xs);font-family:var(--hbr-font-body);border-radius:var(--hbr-border-radius-md);box-shadow:var(--hbr-shadow-md);padding:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content .tooltip-content-title{padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item{display:flex;width:100%;align-items:center;justify-content:space-between;font-size:var(--hbr-font-size-xs);font-weight:var(--hbr-font-weight-light)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item:not(:last-child){padding-bottom:var(--hbr-spacing-sm)}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-shape span{width:var(--hbr-spacing-xs);height:var(--hbr-spacing-xs);border-radius:var(--hbr-border-radius-circle);display:inline-block}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div.tooltip-content-id{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;padding-left:var(--hbr-spacing-2xs);padding-right:var(--hbr-spacing-xl);text-align:left}:host svg+div>div.chart--custom-tooltip .tooltip-content div.tooltip-content-item div:last-child{margin-left:auto}:host{}:host svg+div.chart--custom-tooltip-wrapper{pointer-events:none;position:absolute;z-index:var(--hbr-z-index-tooltip);top:-10px;left:0px}:host{display:block}";
const HbrSankeyStyle0 = hbrSankeyCss;

const HuiSankey = /*@__PURE__*/ proxyCustomElement(class HuiSankey extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.config = undefined;
        this.width = "100%";
        this.height = "300px";
    }
    componentDidLoad() {
        this.createChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentShouldUpdate() {
        this.createChart();
        return false;
    }
    createChart() {
        const root = this.el.shadowRoot.querySelector("div");
        renderChart({
            el: root,
            config: Object.assign({}, this.config),
        });
    }
    render() {
        return (h(Host, { key: '47fd045d24c664623e6b8bdea5a63d396ff1225a' }, h("div", { key: 'a830b85616c36337a7d081c0e142d04d9c393de7', id: "root", style: { width: this.width, height: this.height } })));
    }
    get el() { return this; }
    static get style() { return HbrSankeyStyle0; }
}, [1, "hbr-sankey", {
        "config": [8],
        "width": [1],
        "height": [1]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-sankey"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-sankey":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HuiSankey);
            }
            break;
    } });
}

const HbrSankey = HuiSankey;
const defineCustomElement = defineCustomElement$1;

export { HbrSankey, defineCustomElement };

