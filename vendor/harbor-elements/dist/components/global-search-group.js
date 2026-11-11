import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { i as internationalization } from './translations.js';
import { d as defineCustomElement$4 } from './badge.js';
import { d as defineCustomElement$3 } from './highlight.js';
import { d as defineCustomElement$2 } from './popup.js';
import { d as defineCustomElement$1 } from './tooltip.js';

const translations = {
    en: {
        moreResults: "More results...",
        allCategories: "All Categories",
    },
    ko: {
        moreResults: "더 많은 결과",
        allCategories: "모든 카테고리",
    },
    ja: {
        moreResults: "より多くの結果",
        allCategories: "すべてのカテゴリ",
    },
    zh: {
        moreResults: "更多结果",
        allCategories: "所有类别",
    },
};

const globalSearchGroupCss = ".search-group{margin-bottom:8px;width:100%;height:auto;display:flex;flex-direction:column;align-items:flex-start;gap:var(--hbr-spacing-sm);flex:1 0 0}.search-group-no-padding{height:auto;padding-top:0px;display:flex;flex-direction:column;align-items:flex-start;gap:var(--hbr-spacing-sm);flex:1 0 0}.search-group__top-area{display:flex;justify-content:space-between;line-height:20px}.search-group__title{color:var(--base-text-medium-default);font-size:var(--hbr-font-size-md);font-style:normal;font-weight:700;line-height:20px;}.search-group__show-more{font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-sm);font-style:normal;font-weight:var(--hbr-font-weight-semibold, 600);cursor:pointer;color:var(--interact-text-default)}.search-group__show-more:hover{color:var(--interact-text-hover)}.search-group__show-more:active{color:var(--interact-text-active)}.search-group__show-more-focused{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--hbr-border-radius-md)}.search-group__item{cursor:pointer;color:var(--interact-icon-weak-active)}.search-group__item-selected{background-color:var(--hbr-color-interact-highlight, rgba(62, 132, 229, 0.3019607843));border-radius:var(--hbr-border-radius-sm);padding:0px 1px}.search-group__items{display:flex;flex-direction:column;align-items:flex-start;gap:var(--hbr-spacing-xs);align-self:stretch}.search-group__item-title{font-weight:var(--hbr-font-weight-normal);font-size:var(--hbr-font-size-sm);font-style:normal;line-height:20px;}.search-group__item-title>div{display:inline}.search-group__item-title>div>div{display:inline}.search-group__item-selected{width:100%}.search-group__item-title_highlighted{font-size:14px;font-style:normal;font-weight:700;line-height:20px}.search-group__item-icon{display:none;margin-top:var(--hbr-spacing-3xs)}.search-group__item-icon>hbr-icon{display:flex;align-items:center}.search-group__divider{border:none;border-bottom:1px solid var(--control-border-default);padding-top:10px;margin:0 20px}";
const HbrGlobalSearchGroupStyle0 = globalSearchGroupCss;

const HbrGlobalSearchGroup = /*@__PURE__*/ proxyCustomElement(class HbrGlobalSearchGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.onSearchItemClick = (item) => {
            this.selectResultHandler(item);
        };
        this.onShowMoreClick = () => {
            this.showAllClickHandler(this.groupConfig.id);
        };
        this.handleSearchKeyDown = (event) => {
            if (event.key === "Enter" && this.selectedItem === "show_all") {
                this.onShowMoreClick();
            }
        };
        this.groupConfig = undefined;
        this.showMore = false;
        this.noPadding = false;
        this.showCount = false;
        this.queryText = "";
        this.limit = 5;
        this.selectedItem = "";
        this.selectResultHandler = undefined;
        this.showAllClickHandler = undefined;
    }
    componentWillLoad() {
        window.addEventListener("keydown", this.handleSearchKeyDown, true);
    }
    render() {
        const numOfResults = this.groupConfig.resultItems.length;
        const resultItems = numOfResults > this.limit && !this.showMore
            ? this.groupConfig.resultItems.slice(0, this.limit)
            : this.groupConfig.resultItems;
        const BadgeStyle = {
            "--text-color": "var(--base-text-default)",
            "margin-left": "12px",
        };
        return (h(Host, { key: '87215a9d436c218f381eb09cdaf02bbd4e0e87ca' }, h("slot", { key: '42146064ace30eebacd5efd6ded2819842bf953a' }), h("div", { key: '84b7593feb4c1b902e96bc2f61da124f4604eb9f', part: "group", class: `
            search-group
            ${this.noPadding ? "search-group-no-padding" : ""}
          ` }, h("div", { key: 'b2674ac48009bd3fc1e9444bfb8510d83e7ab4d4', part: "groupTopArea", class: "search-group__top-area" }, h("div", { key: '34cc8b3f53bca3f23ea2c8257aa96e4411101e4b', part: "groupTitle", class: "search-group__title" }, this.groupConfig.title), this.showCount &&
            (numOfResults > 99 ? (h("hbr-tooltip", { "data-testid": "global-search__result-badge-tooltip", content: "There more than 100 results, please be more specific for searching.", placement: "right" }, h("hbr-badge", { size: "small", pill: true, style: BadgeStyle, "data-testid": "global-search__result-badge" }, "99+"))) : (h("hbr-badge", { size: "small", pill: true, style: BadgeStyle, "data-testid": "global-search__result-badge" }, numOfResults)))), h("div", { key: '80bae2cdd5cbebefc2c1dc6c55772a04453c9d06', part: "groupItems", class: "search-group__items" }, resultItems.map((item) => {
            return (h("div", { part: "item", class: `search-group__item
                    ${item.id === this.selectedItem
                    ? "search-group__item-selected"
                    : ""}`, onClick: () => {
                    this.selectedItem !== item.id &&
                        this.onSearchItemClick(item);
                }, "data-testid": item.testId
                    ? item.testId
                    : item.id
                        ? `global-search--result-item-${item.id}`
                        : `global-search--result-item-${item.title
                            .toLowerCase()
                            .split(" ")
                            .join("-")}` }, h("div", { part: "itemTitle", class: "search-group__item-title" }, h("hbr-highlight", { text: item.title, queryText: this.queryText, caseSensitive: false }))));
        })), numOfResults > this.limit && !this.showMore && (h("div", { part: "showmore", class: `search-group__show-more hbr-type-link
                    ${this.selectedItem === "show_all"
                ? "search-group__show-more-focused"
                : ""}`, onClick: this.onShowMoreClick, "data-testid": this.groupConfig.id &&
                `global-search-group--show-more--${this.groupConfig.id}` }, internationalization(translations, "moreResults"))))));
    }
    get host() { return this; }
    static get style() { return HbrGlobalSearchGroupStyle0; }
}, [1, "hbr-global-search-group", {
        "groupConfig": [16],
        "showMore": [4, "show-more"],
        "noPadding": [4, "no-padding"],
        "showCount": [4, "show-count"],
        "queryText": [1, "query-text"],
        "limit": [2],
        "selectedItem": [1, "selected-item"],
        "selectResultHandler": [16],
        "showAllClickHandler": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-global-search-group", "hbr-badge", "hbr-highlight", "hbr-popup", "hbr-tooltip"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-global-search-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrGlobalSearchGroup);
            }
            break;
        case "hbr-badge":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-highlight":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { HbrGlobalSearchGroup as H, defineCustomElement as d };

