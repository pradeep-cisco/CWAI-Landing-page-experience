import { proxyCustomElement, HTMLElement, createEvent, h, Fragment, Host } from '@stencil/core/internal/client';
import { c as caretDown, L as indicatorDefault, M as indicatorProgress, N as indicatorComplete, O as indicatorError, P as indicatorInactive } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$2 } from './icon.js';

const activityTimelinePanelCss = ":host{cursor:inherit !important;--icon-size:19px;--icon-color:var(--control-icon-weak-default);--progress-meter-bg-color:#DEDEDE;--progress-meter-span-bg-color:#949494;--progress-meter-circle-bg-color:#DEDEDE;--progress-meter-circle-border-color:#949494;--panel-item-negative-border:#DEDEDE;--panel-item-title-color:var(--base-text-strong-default);--panel-item-title-open-color:var(--base-text-strong-default);--panel-item-subtitle-color:var(--base-text-medium-default);--panel-item-border-color:var(--control-border-weak-default);--panel-item-inner-color:var(--base-text-medium-default);--indicator-path:2px solid var(--control-border-weak-default);--panel-item-max-height:100rem}:host([variant=complete]){--indicator-path:2px solid var(--control-border-active)}:host([last]) .hbr-activity-timeline-main-header-collapsible{margin-left:24px;width:100%;border-bottom:none;display:flex;margin-bottom:12px}:host([last]) .hbr-activity-timeline-main-header-collapsible-open{margin-left:24px;width:100%;border-bottom:none;display:flex}:host([last]) .hbr-activity-timeline-panel-item--open .hbr-activity-timeline-panel-item__inner.collapsible{border-bottom:2px solid transparent}:host([last]) .hbr-activity-timeline-panel-item{--indicator-path:none;margin-left:10px}:host([last]) .hbr-activity-timeline-panel-item.hbr-activity-timeline-panel-item--open{margin-left:8px}:host([last]) .hbr-activity-timeline-panel-item--open{border-left:2px solid transparent}.hbr-activity-timeline-panel-list__item{display:flex;flex-direction:row}.hbr-activity-timeline-panel-list__item .hbr-activity-timeline-panel-item__icon_container{padding-right:15px}.hbr-activity-timeline-panel-list__item .hbr-activity-timeline-panel-item__icon{appearance:none;background:transparent;border:0;color:inherit;font:inherit;padding:0;width:16px;height:16px;margin-right:16px;font-size:16px;color:var(--icon-color)}.hbr-activity-timeline-panel-list__item .hbr-activity-timeline-panel-item__icon:hover{cursor:pointer}.hbr-activity-timeline-panel-list__item .hbr-activity-timeline-panel-item__icon:focus-visible{outline:none;box-shadow:none}.hbr-activity-timeline-panel-list__item .hbr-activity-timeline-panel-item__icon:focus-visible hbr-icon{border-radius:var(--hbr-border-radius-circle);outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width)}.hbr-activity-timeline-panel-list__item--open .hbr-activity-timeline-panel-item__icon{transform:rotate(180deg);transform-origin:center}.hbr-activity-timeline-panel-item{border-left:var(--indicator-path);margin-left:8px;width:100%;padding-bottom:12px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line{padding:0px 0px;display:flex;justify-content:flex-start;background-color:transparent;z-index:2;position:relative}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-progress-container{display:flex;flex-direction:row;padding-top:12px;align-items:center}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-progress-container .hbr-progress-meter{flex:1;height:2px;position:relative;background:var(--progress-meter-bg-color);display:flex}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-progress-container .hbr-progress-meter span{display:block;height:100%;position:relative;overflow:hidden;background-color:var(--progress-meter-span-bg-color);background-size:50px 50px;transition:width 0.3s ease-out}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-progress-container .hbr-progress-meter .circle{-moz-border-radius:6px/2px;-webkit-border-radius:6px 6px;border-radius:6px/6px;border:solid 2px var(--progress-meter-circle-border-color);height:2px;width:2px;position:relative;display:block;bottom:2px;background-color:var(--progress-meter-circle-bg-color)}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-activity-timeline-panel-item__icon2{position:absolute;left:-10px;width:var(--icon-size);height:var(--icon-size);font-size:var(--icon-size)}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-activity-timeline-panel-item__icon2.negative{width:14px;height:14px;background:var(--body-background, white);border:2px solid var(--panel-item-negative-border);left:-10px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__line .hbr-activity-timeline-panel-item__icon2.positive{width:14px;height:14px;background:var(--magnetic-positive-background-color);border:2px solid var(--magnetic-positive-border-color)}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container{display:flex;flex-direction:column;margin-bottom:12px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container.open{display:flex;flex-direction:column}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container.noncollapsible{margin-left:21px;margin-bottom:12px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container.hbr-activity-progress{left:-60px;position:relative}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container .hbr-activity-timeline-panel-item__title,.hbr-activity-timeline-panel-item ::slotted([slot=header]){font-size:14px;color:var(--panel-item-title-color);letter-spacing:0.5px;font-weight:var(--hbr-font-weight-semibold, 600);line-height:20px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container .hbr-activity-timeline-panel-item__title{margin:0;padding-left:0px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container .hbr-activity-timeline-panel-item__title.open{color:var(--panel-item-title-open-color)}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container .hbr-activity-timeline-panel-item__title.progress:hover{color:var(--interact-text-weak-default);cursor:initial}.hbr-activity-timeline-panel-item .hbr-activity-timeline-title_container .hbr-activity-timeline-panel-item__subtitle{color:var(--panel-item-subtitle-color);padding-left:0px;padding-top:4px;font-size:14px;font-style:normal;font-weight:var(--hbr-font-weight-normal, 400);line-height:20px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__inner{max-height:0;overflow:hidden;visibility:hidden;z-index:1;position:relative;opacity:0;transform:translateY(-1rem)}.hbr-activity-timeline-panel-item ::slotted(.hbr-activity-timeline-panel-item__inner){max-height:0;overflow:hidden;visibility:hidden;z-index:1;position:relative;padding-left:24px;opacity:0;transform:translateY(-1rem);border:1px solid rgb(223, 223, 223);border-radius:2px}.hbr-activity-timeline-panel-item .hbr-activity-timeline-panel-item__paragraph{margin:0;font-size:1rem;font-weight:var(--hbr-font-weight-light, 300);line-height:1.3}.hbr-activity-timeline-panel-item--open{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open.complete{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open.error{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open.progress{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open.inactive{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open.default{border-left:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open .hbr-activity-timeline-panel-item__inner{max-height:var(--panel-item-max-height);margin-left:21px;margin-bottom:12px;margin-top:4px;opacity:1;transform:translateY(0);font-size:14px;font-style:normal;font-weight:var(--hbr-font-weight-normal, 400);line-height:20px;color:var(--panel-item-inner-color)}.hbr-activity-timeline-panel-item--open .hbr-activity-timeline-panel-item__inner.collapsible{border-bottom:2px solid var(--panel-item-border-color)}.hbr-activity-timeline-panel-item--open .hbr-activity-timeline-panel-item__inner.collapsible ::slotted(*){margin-left:35px}.hbr-activity-timeline-panel-item--open .hbr-activity-timeline-panel-item__inner.no-collapsible{margin-bottom:12px}.hbr-activity-timeline-panel-item--open ::slotted(.hbr-activity-timeline-panel-item__inner){max-height:100rem;padding:16px;padding-bottom:18px;margin-left:21px;margin-bottom:12px;opacity:1;transform:translateY(0)}.hbr-activity-timeline-main-header-collapsible{margin-left:24px;width:100%;border-bottom:2px solid var(--panel-item-border-color);display:flex;margin-bottom:12px}.hbr-activity-timeline-main-header-collapsible-open{margin-left:24px;width:100%;border-bottom:none;display:flex}::slotted([slot=header]){margin-left:21px;padding-bottom:12px}.hbr-activity-timeline-main-header-collapsible ::slotted([slot=header]),.hbr-activity-timeline-main-header-collapsible-open ::slotted([slot=header]){margin-left:0px;padding-bottom:12px}.hbr-activity-timeline-panel-item-indicator-icon.default{--path-fill-color-0:var(--interact-text-default);--path-color-1:var(--control-border-weak-default)}.hbr-activity-timeline-panel-item-indicator-icon.inactive{--path-fill-color-0:var(--base-bg-default);--path-color-1:var(--control-border-default)}.hbr-activity-timeline-panel-item-indicator-icon.progress{--path-fill-color-0:var(--base-bg-default);--path-color-1:var(--control-border-weak-default);--path-color-3:var(--interact-text-default)}.hbr-activity-timeline-panel-item-indicator-icon.complete{--path-color-1:var(--interact-text-default);--path-fill-color-0:var(--base-bg-default);--path-color-3:var(--interact-text-default)}.hbr-activity-timeline-panel-item-indicator-icon.error{--path-fill-color-0:var(--base-bg-default);--path-color-1:var(--control-border-weak-default);--path-color-3:var(--negative-icon-default);--path-color-4:var(--negative-icon-default)}";
const HbrTimelinePanelStyle0 = activityTimelinePanelCss;

const TimelinePanel = /*@__PURE__*/ proxyCustomElement(class TimelinePanel extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.isVisible = false;
        this.instanceId = `hbr-timeline-panel-${++TimelinePanel.nextInstanceId}`;
        this.handleClick = () => {
            this.open = !this.open;
        };
        this.label = undefined;
        this.subtext = "";
        this.open = false;
        this.variant = "default";
        this.progress = null;
        this.collapsible = false;
        this.aria = undefined;
    }
    get contentId() {
        return `${this.instanceId}-content`;
    }
    get headerId() {
        return `${this.instanceId}-header`;
    }
    async show() {
        // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
        if (this.isVisible) {
            return;
        }
        const hbrShow = this.hbrShow.emit();
        if (hbrShow.defaultPrevented) {
            return;
        }
        this.isVisible = true;
        this.open = !this.open;
    }
    render() {
        var _a, _b, _c, _d;
        let content = null;
        let rightarrow;
        let slotcontent;
        let iconContent;
        let progress;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const iconsForVariant = {
            default: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["indicator-default"]) || indicatorDefault,
            progress: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["indicator-progress"]) || indicatorProgress,
            complete: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["indicator-complete"]) || indicatorComplete,
            error: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["indicator-error"]) || indicatorError,
            inactive: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["indicator-inactive"]) || indicatorInactive,
        };
        const finalValue = this.progress && this.progress >= 100
            ? 100
            : this.progress && this.progress < 0
                ? 0
                : this.progress;
        const circle = this.progress && this.progress > 0 && this.progress !== 100 ? (h("span", { class: "circle" })) : (h("div", null));
        if (this.progress !== null && !Number.isNaN(this.progress)) {
            progress = (h("div", { key: '53b4aff01a9c7b477e4b2f66b56b5e441a6673a7', style: {
                    width: "56px",
                    position: "relative",
                    marginTop: "39px",
                    left: "-23px",
                } }, h("div", { key: 'ada043caa98304d16ee1b7ad0e70bd687376f1a6', class: "hbr-progress-container", style: { "-webkit-transform": "rotate(90deg)" } }, h("div", { key: 'c2664d203166fc8a91df7e80dde1fe37b18a041d', class: "hbr-progress-meter" }, h("span", { key: 'c6eb10d538c213e3a1ae577d9001142b26f08f84', style: { width: `${finalValue}%` } }), circle))));
        }
        if (!this.collapsible) {
            rightarrow = h("span", { key: '7ef4fe741a490673941a94fee67a4d537ce289ef' });
            slotcontent = (h("div", { key: '51573a1579e36d3e1f855bb266d6e812ae86e871', class: {
                    "hbr-activity-timeline-panel-item__inner": true,
                    collapsible: this.collapsible,
                    "no-collapsible": !this.collapsible,
                }, part: "content", style: { visibility: this.open ? "visible" : "hidden" }, id: this.contentId }, h("slot", { key: 'ca959ae3e00b7f9011a41aa44922496f318678ff' })));
        }
        else {
            rightarrow = (h("button", { key: '4e47568b2b10dfb99e765722db509617697adbfd', type: "button", class: "hbr-activity-timeline-panel-item__icon", onClick: this.handleClick, "aria-expanded": `${this.open}`, "aria-controls": this.contentId, "aria-label": ((_b = this.aria) === null || _b === void 0 ? void 0 : _b.label) || null, "aria-labelledby": ((_c = this.aria) === null || _c === void 0 ? void 0 : _c.label) ? null : this.headerId, "data-testid": "activityTimeline-rightarrow", part: "trigger" }, h("slot", { key: '8befc6f51a3bdc9f0a0ba6344d7b480ab71d2303', name: "trigger" }, h("hbr-icon", { key: '74fce884307f64e5d8fce43bb0909fa464459c1c', asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown }))));
            slotcontent = (h("div", { key: '3342785503faad69e1b65f95c53be8e61213c03c', part: "content", class: {
                    "hbr-activity-timeline-panel-item__inner": true,
                    collapsible: this.collapsible,
                    "no-collapsible": !this.collapsible,
                }, style: { visibility: this.open ? "visible" : "hidden" }, id: this.contentId, "aria-hidden": `${!this.open}` }, h("slot", { key: 'b657daab330630e14ef4b4bb5af48abbb1f69369' })));
        }
        const titleStyle = this.open
            ? "hbr-activity-timeline-panel-item__title open"
            : "hbr-activity-timeline-panel-item__title";
        //const iconStyle = this.variant ? `hbr-activity-timeline_icon_container ${this.variant}` : "hbr-activity-timeline_icon_container"
        const iconBackground = this.progress === null
            ? "hbr-activity-timeline-panel-item__icon2"
            : this.progress < 0
                ? "hbr-activity-timeline-panel-item__icon2 negative"
                : this.progress >= 0
                    ? "hbr-activity-timeline-panel-item__icon2 positive"
                    : "hbr-activity-timeline-panel-item__icon2";
        if (this.progress === null) {
            iconContent = (h("slot", { key: 'cd18a13e82270e4e86e6b5b05530dea2116ffa0d', name: "icon" }, this.variant && iconsForVariant[this.variant] ? (h("hbr-icon", { asset: iconsForVariant[this.variant], class: {
                    "hbr-activity-timeline-panel-item-indicator-icon": true,
                    [this.variant]: true,
                } })) : null));
        }
        else {
            iconContent = h("div", { key: 'd991083940594bf8914819259adad68822ad8208' });
        }
        content = (h(Fragment, { key: 'fde6355eb1fffe3d9921a03eeaea201cf1071207' }, h("div", { key: 'dd0ea808f1401b0b4a3ccb07de42ecfc69b5f068', class: "hbr-activity-timeline-panel-item__line" }, h("div", { key: 'b709dd96e2be9acd8c1fb552749014246aa276fd', class: iconBackground }, iconContent), progress, h("div", { key: 'a6cddc8810cda42afa30fedee65a85729dfd8fa6', class: {
                "hbr-activity-timeline-main-header-collapsible": this.collapsible && !this.open,
                "hbr-activity-timeline-main-header-collapsible-open": this.collapsible && this.open,
            } }, rightarrow, h("span", { key: '8d857a276bfdcf01f85ddda7a572c1032e753d97', id: this.headerId, style: { display: "contents" } }, h("slot", { key: 'ac51790b224df96e381413051571d120809a4a44', name: "header" }, h("div", { key: '418255c0c831c952ca8efbd657f5ce5968bab588', part: "header", class: this.progress !== null && !Number.isNaN(this.progress)
                ? `hbr-activity-timeline-title_container ${this.open ? "open" : ""} ${this.collapsible ? "" : "noncollapsible"} hbr-activity-progress`
                : `hbr-activity-timeline-title_container ${this.open ? "open" : ""} ${this.collapsible ? "" : "noncollapsible"}` }, h("div", Object.assign({ key: 'af402767058af83a2cf3f758dbd3b8be55a9b849', class: titleStyle, "aria-label": this.label ? null : "Activity", "data-testid": "activityTimeline-label", part: "label" }, (((_d = this.aria) === null || _d === void 0 ? void 0 : _d.level)
            ? { role: "heading", "aria-level": this.aria.level }
            : {})), this.label || String.fromCharCode(65279)), h("div", { key: 'd3c6c6f5a7134202346914eea7001643828199ad', class: "hbr-activity-timeline-panel-item__subtitle", part: "subtext" }, this.subtext)))))), slotcontent));
        return (h(Host, { key: 'a3ea36d8f42b96c2a58029a6f23df5e7d83de6a5', role: "listitem" }, h("li", { key: 'dbdc190e06105f514ee48c1e201f1c7c38ad6445', part: "base", class: `hbr-activity-timeline-panel-list__item ${this.open ? "hbr-activity-timeline-panel-list__item--open" : ""}`, role: "presentation" }, h("div", { key: '7ce1cf11c00cfb7f85c6bd2e39f54cecd29faa6f', class: `hbr-activity-timeline-panel-item ${this.open
                ? `hbr-activity-timeline-panel-item--open ${this.variant}`
                : ""}` }, content))));
    }
    static get style() { return HbrTimelinePanelStyle0; }
}, [1, "hbr-timeline-panel", {
        "label": [1],
        "subtext": [1],
        "open": [1540],
        "variant": [513],
        "progress": [2],
        "collapsible": [4],
        "aria": [16],
        "show": [64]
    }]);
TimelinePanel.nextInstanceId = 0;
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-timeline-panel", "hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-timeline-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TimelinePanel);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTimelinePanel = TimelinePanel;
const defineCustomElement = defineCustomElement$1;

export { HbrTimelinePanel, defineCustomElement };

