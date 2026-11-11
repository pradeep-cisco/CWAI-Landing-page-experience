import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$c } from './checkbox.js';
import { d as defineCustomElement$b } from './dropdown.js';
import { d as defineCustomElement$a } from './icon.js';
import { d as defineCustomElement$9 } from './icon-button.js';
import { d as defineCustomElement$8 } from './menu.js';
import { d as defineCustomElement$7 } from './menu-item.js';
import { d as defineCustomElement$6 } from './popup.js';
import { d as defineCustomElement$5 } from './resize-observer.js';
import { d as defineCustomElement$4 } from './tag.js';
import { d as defineCustomElement$3 } from './tooltip.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const tagGroupCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:block;--max-height:none}.tag-group{display:block}.tag-group__container{display:block}.tag-group__tags{display:flex;flex-wrap:wrap;gap:var(--hbr-spacing-xs);align-content:flex-start;max-height:var(--max-height);overflow:hidden}";
const HbrTagGroupStyle0 = tagGroupCss;

const TagGroup = /*@__PURE__*/ proxyCustomElement(class TagGroup extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrClick = createEvent(this, "hbr-click", 7);
        this.overflowWrapper = null;
        this.overflowTag = null;
        this.overflowTrigger = null;
        this.overflowMenu = null;
        this.overflowTooltipContent = null;
        this.overflowVariant = null;
        this.resizeFrame = 0;
        this.settleTimeout = 0;
        this.handleOverflowDropdownPlacementChange = (event) => {
            var _a, _b;
            const dropdown = (_a = this.overflowWrapper) === null || _a === void 0 ? void 0 : _a.querySelector("hbr-dropdown");
            const currentPlacement = (_b = event.detail) === null || _b === void 0 ? void 0 : _b.currentPlacement;
            if (dropdown && currentPlacement) {
                dropdown.skidding = this.getOverflowDropdownSkidding(dropdown.skidding, currentPlacement);
                void dropdown.reposition();
            }
        };
        this.handleResize = () => {
            this.scheduleOverflowUpdate();
        };
        this.scheduleOverflowUpdate = () => {
            // Idempotent single-rAF: coalesces multiple resize events in the same
            // frame into one measurement+layout pass. Reschedule-and-cancel would
            // keep deferring during continuous resize and cause visible lag.
            if (this.resizeFrame)
                return;
            this.resizeFrame = requestAnimationFrame(() => {
                this.resizeFrame = 0;
                this.updateOverflow();
            });
        };
        // Used after slot/variant changes to wait for child component upgrades
        // before measuring; resize-driven updates use scheduleOverflowUpdate directly.
        this.schedulePostReadyOverflowUpdate = async () => {
            const tags = this.getAllTags();
            await Promise.all(tags.map((tag) => typeof tag.componentOnReady === "function"
                ? tag.componentOnReady()
                : Promise.resolve()));
            this.scheduleOverflowUpdate();
            clearTimeout(this.settleTimeout);
            this.settleTimeout = window.setTimeout(() => {
                this.scheduleOverflowUpdate();
            }, 50);
        };
        this.handleOverflowSelect = (event) => {
            var _a;
            const item = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.item;
            if (!item) {
                return;
            }
            const tag = this.getTagByLabel(item.value);
            if (!tag) {
                return;
            }
            this.setTagSelected(tag, item.checked);
        };
        this.handleOverflowClick = (event) => {
            var _a, _b, _c;
            const label = (_c = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("hbr-tag")) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim();
            if (!label) {
                return;
            }
            this.hbrClick.emit({ event, item: { label } });
        };
        this.uncontrolled = false;
        this.variant = "label";
        this.size = "medium";
        this.placement = "bottom-start";
        this.arialabelledby = undefined;
        this.hiddenLabels = [];
        this.selectedLabels = [];
    }
    componentDidLoad() {
        this.scheduleOverflowUpdate();
        this.schedulePostReadyOverflowUpdate();
    }
    handleVariantChange() {
        // Variant determines the wrapper shape (dropdown vs tooltip); rebuild.
        this.disposeOverflow();
        this.schedulePostReadyOverflowUpdate();
    }
    handleSizeChange() {
        var _a;
        if (this.overflowTag) {
            if (this.size && this.size !== "medium") {
                this.overflowTag.setAttribute("size", this.size);
            }
            else {
                this.overflowTag.removeAttribute("size");
            }
        }
        const dropdown = (_a = this.overflowWrapper) === null || _a === void 0 ? void 0 : _a.querySelector("hbr-dropdown");
        if (dropdown) {
            this.syncOverflowDropdownSize(dropdown);
            void dropdown.reposition();
        }
        this.schedulePostReadyOverflowUpdate();
    }
    handlePlacementChange() {
        if (this.overflowWrapper) {
            const dropdown = this.overflowWrapper.querySelector("hbr-dropdown");
            const tooltip = this.overflowWrapper.querySelector("hbr-tooltip");
            const popup = dropdown || tooltip;
            if (popup) {
                popup.setAttribute("placement", this.placement || "bottom-start");
            }
            if (dropdown) {
                this.syncOverflowDropdownSize(dropdown);
                void dropdown.reposition();
            }
        }
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    disconnectedCallback() {
        cancelAnimationFrame(this.resizeFrame);
        clearTimeout(this.settleTimeout);
        this.disposeOverflow();
    }
    getAllTags() {
        var _a;
        const slot = (_a = this.tags) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!slot) {
            return [];
        }
        return slot
            .assignedElements({ flatten: true })
            .filter((el) => el.tagName.toLowerCase() === "hbr-tag" &&
            !el.overflow);
    }
    getTagLabel(tag) {
        var _a;
        return ((_a = tag.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    }
    getSelectedLabels() {
        return this.getAllTags()
            .filter((tag) => tag.selected)
            .map((tag) => this.getTagLabel(tag))
            .filter(Boolean);
    }
    syncSelectedLabels() {
        const selectedLabels = this.getSelectedLabels();
        if (selectedLabels.length !== this.selectedLabels.length ||
            selectedLabels.some((label, index) => label !== this.selectedLabels[index])) {
            this.selectedLabels = selectedLabels;
        }
    }
    setTagSelected(tag, selected) {
        tag.selected = selected;
        tag.setAttribute("aria-checked", selected ? "true" : "false");
        this.syncSelectedLabels();
        this.syncOverflowSelectionState();
    }
    getTagByLabel(label) {
        return this.getAllTags().find((tag) => this.getTagLabel(tag) === label);
    }
    isTagSelected(label) {
        return this.selectedLabels.includes(label);
    }
    hasSelectedHiddenTags() {
        return this.hiddenLabels.some((label) => this.isTagSelected(label));
    }
    getFiniteCssLength(value) {
        const parsedValue = Number.parseFloat(value);
        return Number.isFinite(parsedValue) ? parsedValue : Infinity;
    }
    getMaxHeight() {
        const maxHeight = getComputedStyle(this.host)
            .getPropertyValue("--max-height")
            .trim();
        if (maxHeight) {
            const parsedHeight = this.getFiniteCssLength(maxHeight);
            if (Number.isFinite(parsedHeight)) {
                return parsedHeight;
            }
        }
        const parent = this.host.parentElement;
        if (!parent) {
            return Infinity;
        }
        const parentStyles = getComputedStyle(parent);
        const parentHeightStyle = parent.style.height.trim();
        const parentMaxHeightStyle = parent.style.maxHeight.trim();
        const parentHeight = parentMaxHeightStyle
            ? this.getFiniteCssLength(parentStyles.maxHeight)
            : parentHeightStyle
                ? this.getFiniteCssLength(parentStyles.height)
                : Infinity;
        if (!Number.isFinite(parentHeight)) {
            return Infinity;
        }
        const paddingTop = this.getFiniteCssLength(parentStyles.paddingTop);
        const paddingBottom = this.getFiniteCssLength(parentStyles.paddingBottom);
        const availableHeight = parentHeight - paddingTop - paddingBottom;
        return availableHeight > 0 ? availableHeight : Infinity;
    }
    setOverflowCount(count) {
        const label = `+${count}`;
        if (this.overflowTrigger) {
            this.overflowTrigger.textContent = label;
        }
    }
    fitsWithinMaxHeight(maxHeight) {
        if (!this.tags || !this.overflowWrapper) {
            return true;
        }
        const overflowBottom = this.overflowWrapper.offsetTop + this.overflowWrapper.offsetHeight;
        return this.tags.scrollHeight <= maxHeight && overflowBottom <= maxHeight;
    }
    getOverflowDropdownOffset() {
        if (this.size === "small") {
            return { distance: 5, skidding: -9 };
        }
        if (this.size === "large") {
            return { distance: 8, skidding: -17 };
        }
        return { distance: 8, skidding: -7 };
    }
    getOverflowDropdownSkidding(skidding, placement) {
        if (placement.endsWith("-end")) {
            return Math.abs(skidding);
        }
        if (placement.endsWith("-start")) {
            return -Math.abs(skidding);
        }
        return 0;
    }
    syncOverflowDropdownSize(dropdown) {
        const dropdownSize = this.size === "small" ? "small" : "medium";
        const { distance, skidding } = this.getOverflowDropdownOffset();
        dropdown.size = dropdownSize;
        dropdown.distance = distance;
        dropdown.skidding = this.getOverflowDropdownSkidding(skidding, this.placement || "bottom-start");
        dropdown.querySelectorAll("hbr-menu-item").forEach((item) => {
            item.size = dropdownSize;
            item.querySelectorAll("hbr-checkbox").forEach((checkbox) => {
                checkbox.size = dropdownSize;
            });
        });
    }
    /**
     * Build (and cache) the overflow wrapper in light DOM. The structure mirrors
     * what was previously rendered inside this component's shadow root, but as a
     * real light-DOM subtree so nested menus/tooltips inherit consumer styles.
     */
    getOverflowWrapper() {
        if (this.overflowWrapper && this.overflowVariant === this.variant) {
            return this.overflowWrapper;
        }
        this.disposeOverflow();
        const tag = document.createElement("hbr-tag");
        tag.setAttribute("overflow", "true");
        if (this.variant === "selectable") {
            tag.setAttribute("variant", "selectable");
        }
        if (this.size && this.size !== "medium") {
            tag.setAttribute("size", this.size);
        }
        this.overflowTag = tag;
        const wrapper = tag;
        wrapper.className = "tag-group__overflow";
        // Wrapper lives in light DOM, so these layout rules (previously in
        // tag-group.scss) are applied inline rather than via the shadow stylesheet.
        wrapper.style.display = "inline-flex";
        wrapper.style.flex = "0 0 auto";
        if (this.variant === "selectable") {
            const dropdown = document.createElement("hbr-dropdown");
            // Use property assignment for boolean props; Stencil's HTML attribute
            // coercion treats any present attribute as `true`, so `close-on-select="false"`
            // would actually leave it true (and the dropdown would close after each pick).
            dropdown.menu = true;
            dropdown.multiple = true;
            dropdown.hoist = true;
            dropdown.closeOnSelect = false;
            dropdown.setAttribute("placement", this.placement || "bottom-start");
            this.syncOverflowDropdownSize(dropdown);
            const triggerSpan = document.createElement("span");
            triggerSpan.setAttribute("slot", "trigger");
            triggerSpan.textContent = "+0";
            this.overflowTrigger = triggerSpan;
            dropdown.appendChild(triggerSpan);
            const menu = document.createElement("hbr-menu");
            dropdown.appendChild(menu);
            this.overflowMenu = menu;
            dropdown.addEventListener("hbr-select", this.handleOverflowSelect);
            dropdown.addEventListener("hbr-placement-change", this.handleOverflowDropdownPlacementChange);
            tag.appendChild(dropdown);
        }
        else {
            const tooltip = document.createElement("hbr-tooltip");
            tooltip.setAttribute("placement", "bottom-start");
            tooltip.hoist = true;
            // These were previously set via shadow CSS targeting the wrapper; the
            // tooltip now lives in light DOM, so apply them inline.
            tooltip.style.setProperty("--bg-color", "var(--control-bg-weak-default)");
            tooltip.style.setProperty("--arrow-color", "var(--control-bg-weak-default)");
            tooltip.style.setProperty("--text-color", "var(--base-text-medium-default)");
            const tooltipTrigger = document.createTextNode("+0");
            this.overflowTrigger = tooltipTrigger;
            tooltip.appendChild(tooltipTrigger);
            const content = document.createElement("div");
            content.setAttribute("slot", "content");
            content.className = "tag-group__overflow-content";
            content.style.display = "flex";
            content.style.flexWrap = "wrap";
            content.style.gap = "var(--hbr-spacing-xs)";
            content.style.alignContent = "flex-start";
            content.addEventListener("click", this.handleOverflowClick);
            tooltip.appendChild(content);
            this.overflowTooltipContent = content;
            tag.appendChild(tooltip);
        }
        this.overflowWrapper = wrapper;
        this.overflowVariant = this.variant;
        return wrapper;
    }
    disposeOverflow() {
        if (this.overflowWrapper) {
            this.overflowWrapper.remove();
        }
        this.overflowWrapper = null;
        this.overflowTag = null;
        this.overflowTrigger = null;
        this.overflowMenu = null;
        this.overflowTooltipContent = null;
        this.overflowVariant = null;
    }
    renderOverflowContents() {
        if (this.overflowVariant === "selectable" && this.overflowMenu) {
            this.overflowMenu.innerHTML = "";
            this.hiddenLabels.forEach((label) => {
                var _a;
                const item = document.createElement("hbr-menu-item");
                item.size = this.size === "small" ? "small" : "medium";
                item.setAttribute("checkbox", "");
                item.setAttribute("value", label);
                const checked = this.isTagSelected(label);
                if (checked) {
                    item.setAttribute("checked", "");
                }
                const checkbox = document.createElement("hbr-checkbox");
                checkbox.size = this.size === "small" ? "small" : "medium";
                if (checked) {
                    checkbox.setAttribute("checked", "");
                }
                checkbox.textContent = label;
                item.appendChild(checkbox);
                (_a = this.overflowMenu) === null || _a === void 0 ? void 0 : _a.appendChild(item);
            });
            this.syncOverflowSelectionState();
        }
        else if (this.overflowTooltipContent) {
            this.overflowTooltipContent.textContent = this.hiddenLabels.join(",\n");
        }
    }
    syncOverflowSelectionState() {
        if (this.overflowTag) {
            this.overflowTag.selected = this.hasSelectedHiddenTags();
        }
        if (this.overflowVariant === "selectable" &&
            this.overflowWrapper &&
            this.overflowMenu) {
            const dropdown = this.overflowWrapper.querySelector("hbr-dropdown");
            if (dropdown) {
                dropdown.value = this.hiddenLabels.filter((label) => this.isTagSelected(label));
            }
            Array.from(this.overflowMenu.children).forEach((item) => {
                const menuItem = item;
                const checked = this.isTagSelected(menuItem.value);
                menuItem.checked = checked;
                const checkbox = menuItem.querySelector("hbr-checkbox");
                if (checkbox) {
                    checkbox.checked = checked;
                }
            });
        }
    }
    updateOverflow() {
        const allTags = this.getAllTags();
        const maxHeight = this.getMaxHeight();
        if (!this.tags) {
            return;
        }
        // Build once and append once. Mutating the host's light-DOM children
        // (add/remove) re-triggers the tag-group slot's `slotchange`, which would
        // re-enter updateOverflow and loop forever. Visibility is toggled via
        // `display` instead, which does not fire slotchange.
        const wrapper = this.getOverflowWrapper();
        if (!wrapper.isConnected) {
            this.host.appendChild(wrapper);
        }
        allTags.forEach((tag) => {
            tag.style.removeProperty("display");
        });
        // Make the wrapper measurable before deciding whether overflow is needed.
        wrapper.style.display = "inline-flex";
        if (!allTags.length || this.tags.scrollHeight <= maxHeight) {
            wrapper.style.display = "none";
            if (this.hiddenLabels.length) {
                this.hiddenLabels = [];
            }
            this.syncSelectedLabels();
            return;
        }
        let hiddenStartIndex = allTags.length;
        let didHideAnyTag = false;
        for (let i = allTags.length - 1; i >= 0; i -= 1) {
            allTags[i].style.display = "none";
            didHideAnyTag = true;
            this.setOverflowCount(allTags.length - i);
            if (this.fitsWithinMaxHeight(maxHeight)) {
                hiddenStartIndex = i;
                break;
            }
        }
        if (didHideAnyTag && hiddenStartIndex === allTags.length) {
            hiddenStartIndex = 0;
        }
        const hiddenLabels = allTags
            .slice(hiddenStartIndex)
            .map((tag) => this.getTagLabel(tag))
            .filter(Boolean);
        if (hiddenLabels.length !== this.hiddenLabels.length ||
            hiddenLabels.some((label, index) => label !== this.hiddenLabels[index])) {
            this.hiddenLabels = hiddenLabels;
        }
        this.syncSelectedLabels();
        this.setOverflowCount(hiddenLabels.length);
        this.renderOverflowContents();
    }
    handleClick(event) {
        if (this.uncontrolled || this.variant !== "selectable") {
            return;
        }
        const target = event.target;
        const tag = target.closest("hbr-tag");
        const tagGroup = tag === null || tag === void 0 ? void 0 : tag.closest("hbr-tag-group");
        if (tagGroup !== this.host || !tag || tag.nested || tag.overflow) {
            return;
        }
        this.setTagSelected(tag, !tag.selected);
    }
    handleKeyDown(event) {
        const target = event.target;
        const tag = target.closest("hbr-tag");
        const tagGroup = tag === null || tag === void 0 ? void 0 : tag.closest("hbr-tag-group");
        if (tagGroup !== this.host) {
            return;
        }
        if (event.key === " ") {
            event.preventDefault();
        }
    }
    handleKeyUp(event) {
        if (this.uncontrolled || this.variant !== "selectable") {
            return;
        }
        const target = event.target;
        const tag = target.closest("hbr-tag");
        const tagGroup = tag === null || tag === void 0 ? void 0 : tag.closest("hbr-tag-group");
        if (tagGroup !== this.host || !tag || tag.nested || tag.overflow) {
            return;
        }
        if (event.key === " ") {
            this.setTagSelected(tag, !tag.selected);
            event.stopPropagation();
        }
    }
    handleSlotChange() {
        var _a;
        if (this.variant !== "selectable" && !this.size)
            return;
        const slot = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (!(slot instanceof HTMLSlotElement)) {
            return [];
        }
        const slottedElements = slot
            .assignedElements({ flatten: true })
            .filter((el) => el.tagName.toLowerCase() === "hbr-tag" &&
            !el.overflow);
        slottedElements.forEach((tag) => {
            if (this.variant === "selectable") {
                tag.variant = "selectable";
            }
            if (this.size && this.size !== "medium") {
                tag.size = this.size;
            }
        });
    }
    render() {
        return (h(Host, { key: '979917b919cc4eee1cdd98e75183e0b1b157a484' }, h("hbr-resize-observer", { key: 'fec222c9cf6f4faf3885b0ecf7d14736096cda71', "onHbr-resize": this.handleResize }, h("div", { key: '5a7c79d37740f44c5e2b8bec9c51365bb9cc360f', part: "base", class: {
                "tag-group": true,
                "tag-group--selectable": this.variant === "selectable",
            }, onClick: this.handleClick.bind(this), onKeyDown: this.handleKeyDown.bind(this), onKeyUp: this.handleKeyUp.bind(this) }, h("div", { key: '249521b75d698c276acd7764f37bb4fc8e74a245', role: "group", "aria-labelledby": this.arialabelledby, part: "tags-container", class: "tag-group__container" }, h("div", { key: 'ce56b0dcf3b393de33b83334ef7783c003631c12', ref: (el) => {
                this.tags = el;
            }, part: "tags", class: "tag-group__tags" }, h("slot", { key: '2ac774154cc6dea0d2734f308cb82505921bee63', onSlotchange: () => {
                this.handleSlotChange();
                this.scheduleOverflowUpdate();
                this.schedulePostReadyOverflowUpdate();
            } })))))));
    }
    get host() { return this; }
    static get watchers() { return {
        "variant": ["handleVariantChange"],
        "size": ["handleSizeChange"],
        "placement": ["handlePlacementChange"]
    }; }
    static get style() { return HbrTagGroupStyle0; }
}, [1, "hbr-tag-group", {
        "uncontrolled": [4],
        "variant": [513],
        "size": [513],
        "placement": [513],
        "arialabelledby": [1],
        "hiddenLabels": [32],
        "selectedLabels": [32]
    }, undefined, {
        "variant": ["handleVariantChange"],
        "size": ["handleSizeChange"],
        "placement": ["handlePlacementChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tag-group", "hbr-checkbox", "hbr-dropdown", "hbr-icon", "hbr-icon-button", "hbr-menu", "hbr-menu-item", "hbr-popup", "hbr-resize-observer", "hbr-tag", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tag-group":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, TagGroup);
            }
            break;
        case "hbr-checkbox":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-menu":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-menu-item":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-resize-observer":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-tag":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-tooltip":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTagGroup = TagGroup;
const defineCustomElement = defineCustomElement$1;

export { HbrTagGroup, defineCustomElement };

