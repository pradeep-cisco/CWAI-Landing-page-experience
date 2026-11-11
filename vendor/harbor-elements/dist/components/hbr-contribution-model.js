import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const hbrContributionModelCss = ":host{display:block}";
const HbrContributionModelStyle0 = hbrContributionModelCss;

const HbrContributionModel$1 = /*@__PURE__*/ proxyCustomElement(class HbrContributionModel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    componentDidLoad() {
        void this.buildIndex();
    }
    async buildIndex() {
        const [{ buildContributionIndex }, { config }] = await Promise.all([
            import('./buildContributionIndex.js'),
            import('./data2.js'),
        ]);
        buildContributionIndex(config);
    }
    render() {
        console.error("hbr-workflow-step is deprecated in January 2025");
        return (h(Host, { key: '52e2e8646fbb8c1210db2425120946ed2ff81910' }, h("slot", { key: '4e1e6524cd8a2ab4de901e7e030dec8508b4d41a' })));
    }
    static get style() { return HbrContributionModelStyle0; }
}, [1, "hbr-contribution-model"]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-contribution-model"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-contribution-model":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrContributionModel$1);
            }
            break;
    } });
}

const HbrContributionModel = HbrContributionModel$1;
const defineCustomElement = defineCustomElement$1;

export { HbrContributionModel, defineCustomElement };

