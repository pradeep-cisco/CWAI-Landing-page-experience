import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a as caretRight, c as caretDown } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$7 } from './checkbox.js';
import { d as defineCustomElement$5 } from './icon-button.js';
import { d as defineCustomElement$4 } from './spinner.js';
import { d as defineCustomElement$3 } from './truncation.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const treeItemCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}[hidden]{display:none !important}:host{display:block;outline:0;z-index:0;--multi-selected-background:var(--interact-bg-weak-default);--tree-item-padding:6px var(--hbr-spacing-2xs);--tree-item-padding-sm:var(--hbr-spacing-3xs) var(--hbr-spacing-2xs);--font-size-md:var(--hbr-font-size-sm);--font-size-sm:var(--hbr-font-size-xs);--check-box-padding-left:var(--hbr-spacing-2xs);--icon-size:var(--hbr-font-size-md);--item-height-sm:28px;--item-height-md:36px;--tree-item-border-radius:2px;--color-bg-selected-unselectable:var(--base-bg-medium-disabled)}:host([unselectable]) .tree-item__label{color:var(--base-text-medium-default);cursor:not-allowed}:host([unselectable]) .tree-item{--tab-border-width:0px}:host(:not([unselectable]):not([disabled]):hover) .tree-item__checkbox::part(default-icon){--path-color-0:var(--control-border-hover)}:host(:focus-visible) .tree-item__item--focus{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--tree-item-border-radius);z-index:2}:host(:focus-visible) .tree-item__item--interactive-focus{outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-top-right-radius:0px;border-bottom-right-radius:0px;border-bottom-left-radius:var(--tree-item-border-radius);border-top-left-radius:var(--tree-item-border-radius);z-index:2}slot:not([name])::slotted(hbr-icon-button){margin-inline-end:var(--hbr-spacing-xs)}.tree-item{position:relative}.tree-item__item-wrapper{display:flex;flex-direction:row;align-items:center;width:100%;box-sizing:border-box}.tree-item__item-wrapper:hover{background-color:var(--color-bg-hover);cursor:pointer;border-radius:var(--tree-item-border-radius)}.tree-item__item-wrapper-interactive{display:flex;flex-direction:row;align-items:center}.tree-item__item-wrapper-interactive:hover{background-color:var(--color-bg-hover);cursor:pointer;border-radius:0px var(--tree-item-border-radius)}.tree-item__label{font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-denser);letter-spacing:var(--hbr-font-letter-spacing-normal);display:flex;align-items:center;gap:var(--hbr-spacing-2xs);transition:var(--hbr-transition-fast) color;color:var(--base-text-default);min-width:0}.tree-item__label hbr-truncation{display:block;flex:1 1 auto;min-width:0;width:100%}.tree-item__label.tree-item__label-sm{font-size:var(--font-size-sm)}.tree-item__label.tree-item__label-md{font-size:var(--font-size-md)}.tree-item__label:has(>hbr-truncation){flex:1 1 0%}.tree-item__label--with-truncation{display:block}.tree-item__checkbox::part(base){display:flex;align-items:var(--tree-item-checkbox-align, center)}.tree-item__checkbox{--label-margin:0}.tree-item__checkbox::part(control){margin-inline-end:var(--hbr-spacing-2xs)}.tree-item__checkbox::part(content){display:flex;align-items:center;min-width:0}.tree-item__checkbox .tree-item__label{margin-inline-start:var(--hbr-spacing-2xs)}.tree-item__checkbox[size=medium]::part(control){font-size:20px}.tree-item__checkbox[size=small]::part(control){font-size:16px}.tree-item__checkbox::part(element){padding-left:var(--check-box-margin-left, var(--check-box-padding-left))}.tree-item__prefix{display:inline-flex;align-items:center;flex-shrink:0}slot[name=prefix]::slotted(hbr-icon){margin-inline:var(--hbr-spacing-3xs)}.tree-item__checkbox--selected--unselectable::part(input){background:var(--control-bg-weak-disabled, #F7F7F7)}.tree-item__indentation{display:block;width:1em;flex-shrink:0}.tree-item__icon-button{font-size:var(--icon-size)}.tree-item__icon-button::part(base){--padding:var(--hbr-spacing-2xs);--color:var(--interact-icon-weak-default);--color-hover:var(--interact-icon-weak-hover);--bg-hover:var(--interact-bg-weak-hover)}.tree-item__item{display:flex;align-items:center;align-self:stretch;flex-direction:row;gap:var(--hbr-spacing-2xs);flex:1 1 auto;min-width:0}.tree-item__item.tree-item__item--sm{padding:var(--tree-item-padding-sm);height:var(--tree-item-height-sm, var(--item-height-sm));min-height:var(--item-height-sm)}.tree-item__item.tree-item__item--md{padding:var(--tree-item-padding);height:var(--tree-item-height-md, var(--item-height-md));min-height:var(--item-height-md)}.tree-item__item.tree-item__item--interactive{padding-right:0}.tree-item__item.tree-item__item--tabs{position:relative}.tree-item__item.tree-item__item--tabs:hover::before{content:\"\";position:absolute;top:0px;left:0;display:flex;align-items:center;align-self:stretch;width:var(--tab-border-width);height:100%;background-color:var(--tab-border-color-hover);border-radius:var(--tab-border-radius)}.tree-item__item--unselectable:hover{background-color:transparent;cursor:not-allowed}.tree-item__item--selected--unselectable--single:hover{cursor:not-allowed;background:var(--color-bg-selected-unselectable);border-radius:var(--tree-item-border-radius)}.tree-item__expand-button{display:flex;align-items:center;justify-content:center;box-sizing:content-box;width:var(--hbr-spacing-md);flex-shrink:0;position:relative;font-size:var(--hbr-font-size-sm);font-weight:var(--hbr-font-weight-normal);line-height:var(--hbr-font-line-height-denser);letter-spacing:var(--hbr-font-letter-spacing-normal)}.tree-item__expand-icon-slot{position:absolute}.tree-item__suffix{margin-left:auto;gap:var(--hbr-spacing-2xs);width:auto;min-width:0;flex-shrink:0}.tree-item__suffix.tree-item__suffix-sm{font-size:var(--font-size-sm)}.tree-item__suffix.tree-item__suffix-md{font-size:var(--font-size-md)}.tree-item__interactive{margin-left:auto;gap:var(--hbr-spacing-2xs);width:auto;min-width:0;align-items:center;justify-content:center;flex-shrink:0;padding-right:4px}.tree-item__interactive.tree-item__interactive-sm{font-size:var(--font-size-sm)}.tree-item__interactive.tree-item__interactive-md{font-size:var(--font-size-md)}.tree-item__expand-button--start{margin-left:0}.tree-item__expand-button--end{margin-left:auto}.tree-item--expanded slot[name=expand-icon],.tree-item:not(.tree-item--expanded) slot[name=collapse-icon]{display:none}.tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot{display:none}.tree-item__expand-button--visible{cursor:pointer}.tree-item--disabled .tree-item__item{opacity:0.5;outline:none;cursor:not-allowed}:host(:not([aria-disabled=true])) .tree-item__expand-button{color:var(--interact-icon-medium-default)}.tree-item__children-md{display:block;font-size:calc(1em + var(--indent-size, var(--hbr-spacing-md)))}.tree-item__children-sm{display:block;font-size:calc(1em + var(--indent-size-sm, var(--hbr-spacing-md)))}.tree-item__children-md{position:relative}.tree-item__children-sm{position:relative}.tree-item__children-md::before{content:\"\";position:absolute;top:var(--indent-guide-offset);bottom:var(--indent-guide-offset);left:calc(1em - var(--indent-guide-width) / 2 - 8px);border-inline-end:var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);z-index:1}.tree-item__children-sm::before{content:\"\";position:absolute;top:var(--indent-guide-offset);bottom:var(--indent-guide-offset);left:calc(1em - var(--indent-guide-width) / 2 - 8px);border-inline-end:var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);z-index:1}.tree-item--rtl .tree-item__children::before{left:auto;right:1em}.tree-item__item--selected--single{background:var(--color-bg-selected);border-radius:var(--tree-item-border-radius)}.tree-item__item--selected--single:hover{background:var(--color-bg-hover);border-radius:var(--tree-item-border-radius)}.tree-item__item--selected--single.tree-item__item--tabs{position:relative}.tree-item__item--selected--single.tree-item__item--tabs:hover{background:var(--color-bg-hover);border-radius:var(--tree-item-border-radius)}.tree-item__item--selected--single.tree-item__item--tabs::before{content:\"\";position:absolute;top:0px;left:0;display:flex;align-items:center;align-self:stretch;width:var(--tab-border-width);height:100%;background-color:var(--tab-border-color-selected);border-radius:var(--tab-border-width);}.tree-item__item--selected--single.tree-item__item--tabs:hover::before{content:\"\";position:absolute;top:0px;left:0;display:flex;align-items:center;align-self:stretch;width:var(--tab-border-width);height:100%;background-color:var(--tab-border-color-selected);border-radius:var(--tab-border-radius)}@media (forced-colors: active){:host(:not([aria-disabled=true])) .tree-item--selected .tree-item__item{outline:dashed 1px SelectedItem}}";
const HbrTreeItemStyle0 = treeItemCss;

function isTreeItem(node) {
    return node instanceof HTMLElement && node.tagName === "HBR-TREE-ITEM";
}
const HbrTreeItem$1 = /*@__PURE__*/ proxyCustomElement(class HbrTreeItem extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrCollapse = createEvent(this, "hbr-collapse", 7);
        this.hbrAfterCollapse = createEvent(this, "hbr-after-collapse", 7);
        this.hbrExpand = createEvent(this, "hbr-expand", 7);
        this.hbrAfterExpand = createEvent(this, "hbr-after-expand", 7);
        this.hbrLazyLoad = createEvent(this, "hbr-lazy-load", 7);
        this.hbrLazyChange = createEvent(this, "hbr-lazy-change", 7);
        this.setSelectionMode = () => {
            const hbrTree = this.host.closest("hbr-tree");
            if (hbrTree) {
                this.selectionMode = hbrTree.selection;
            }
        };
        this.setSize = () => {
            const hbrTree = this.host.closest("hbr-tree");
            if (hbrTree) {
                this.size = hbrTree.size;
            }
        };
        this.setVariant = () => {
            const hbrTree = this.host.closest("hbr-tree");
            if (hbrTree) {
                this.variant = hbrTree.variant;
            }
        };
        this.indeterminate = false;
        this.leaf = false;
        this.loading = false;
        this.selectable = false;
        this.expanded = false;
        this.selected = false;
        this.unselectable = false;
        this.disabled = false;
        this.lazy = false;
        this.filtered = false;
        this.dataId = "";
        this.aria = {
            expandButtonLabel: "Expand tree item",
            collapseButtonLabel: "Collapse tree item",
        };
        this.triggerPosition = "start";
        this.selectionMode = "single";
        this.size = "medium";
        this.interactiveSlotContent = false;
        this.variant = undefined;
    }
    // itemElement: HTMLDivElement;
    // childrenContainer: HTMLDivElement;
    connectedCallback() {
        this.handleChildrenSlotChange = this.handleChildrenSlotChange.bind(this);
        this.handleInteractiveSlotChange =
            this.handleInteractiveSlotChange.bind(this);
        if (this.isNestedItem()) {
            this.host.slot = "children";
        }
    }
    componentDidLoad() {
        // this.childrenContainer = this.host.shadowRoot.querySelector(
        // 	".tree-item__children",
        // );
        this.childrenSlot = this.host.shadowRoot.querySelector("slot[name=children]");
        // this.childrenContainer.hidden = !this.expanded;
        // this.childrenContainer.style.height = this.expanded ? "auto" : "0";
        this.leaf = !this.lazy && this.getChildrenItems().length === 0;
        this.handleExpandedChange();
        this.setSelectionMode();
        this.setSize();
        this.setVariant();
        // Initialize interactive slot presence once component has mounted
        this.handleInteractiveSlotChange();
    }
    componentDidUpdate() {
        this.setSelectionMode();
        this.setSize();
        this.setVariant();
    }
    async animateCollapse() {
        this.hbrCollapse.emit();
        // await stopAnimations(this.childrenContainer);
        // const { keyframes, options } = getAnimation(this, 'tree-item.collapse', {
        //     // dir: this.localize.dir()
        //     dir: "ltr"
        // });
        // await animateTo(
        //     this.childrenContainer,
        //     shimKeyframesHeightAuto(keyframes, this.childrenContainer.scrollHeight),
        //     options
        // );
        // this.childrenContainer.hidden = true;
        // this.childrenContainer.style.height = "0";
        this.hbrAfterCollapse.emit();
    }
    // Checks whether the item is nested into an item
    isNestedItem() {
        const parent = this.host.parentElement;
        return !!parent && isTreeItem(parent);
    }
    handleChildrenSlotChange() {
        this.loading = false;
        this.leaf = !this.lazy && this.getChildrenItems().length === 0;
    }
    handleInteractiveSlotChange() {
        const slot = this.host.shadowRoot.querySelector('slot[name="interactive"]');
        let assigned = [];
        if (slot) {
            assigned = slot.assignedElements({ flatten: true }).filter((el) => {
                // If a nested slot is present, consider it only if it has assigned elements itself
                if (el.tagName === "SLOT") {
                    const nested = el.assignedElements({
                        flatten: true,
                    });
                    return nested.length > 0;
                }
                return true;
            });
        }
        this.interactiveSlotContent = assigned.length > 0;
        // Setting the height of slotted action dropdown (applies to nested hbr-button)
        assigned.forEach((el) => {
            const nested = el.querySelector("hbr-button");
            if (nested) {
                nested.style.setProperty("--hbr-control-height-xs", "24px");
            }
        });
    }
    async animateExpand() {
        this.hbrExpand.emit();
        // await stopAnimations(this.childrenContainer);
        // this.childrenContainer.hidden = false;
        // const { keyframes, options } = getAnimation(this, 'tree-item.expand', {
        //     // dir: this.localize.dir()
        //     dir: "ltr"
        // });
        // await animateTo(
        //     this.childrenContainer,
        //     shimKeyframesHeightAuto(keyframes, this.childrenContainer.scrollHeight),
        //     options
        // );
        // this.childrenContainer.style.height = "auto";
        this.hbrAfterExpand.emit();
    }
    handleLoadingChange() {
        this.host.setAttribute("aria-busy", this.loading ? "true" : "false");
        if (!this.loading) {
            this.animateExpand();
        }
    }
    handleDisabledChange() {
        this.host.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    handleSelectedChange() {
        this.host.setAttribute("aria-selected", this.selected ? "true" : "false");
        this.indeterminate = false;
    }
    handleExpandedChange() {
        if (!this.leaf) {
            this.host.setAttribute("aria-expanded", this.expanded ? "true" : "false");
        }
        else {
            this.host.removeAttribute("aria-expanded");
        }
    }
    handleExpandAnimation() {
        if (this.expanded) {
            if (this.lazy) {
                this.loading = true;
                this.hbrLazyLoad.emit();
            }
            else {
                this.animateExpand();
            }
        }
        else {
            this.animateCollapse();
        }
    }
    handleLazyChange() {
        this.hbrLazyChange.emit();
    }
    /** Gets all the nested tree items in this node. */
    getChildrenItems({ includeDisabled = true, } = {}) {
        return this.childrenSlot
            ? // @ts-ignore
                [...this.childrenSlot.assignedElements({ flatten: true })].filter(
                // @ts-ignore
                (item) => isTreeItem(item) && (includeDisabled || !item.disabled))
            : [];
    }
    render() {
        var _a;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const tree = this.host.closest("hbr-tree");
        const transfer = this.host.closest("hbr-transfer");
        const labelTooltipTarget = (tree === null || tree === void 0 ? void 0 : tree.labelTooltipTarget) ||
            (tree === null || tree === void 0 ? void 0 : tree.getAttribute("label-tooltip-target")) ||
            undefined;
        const labelTruncationEnabled = !!labelTooltipTarget;
        const labelTruncationLines = transfer ? 4 : 1;
        const showExpandButton = !this.loading && (!this.leaf || this.lazy);
        const labelClass = {
            "tree-item__label": true,
            "tree-item__label--with-truncation": labelTruncationEnabled,
        };
        const prefix = (h("span", { key: 'adf2f25f2133acdc7de71c9afe99185ecfcaf57d', class: "tree-item__prefix" }, h("slot", { key: '6fee706ee8188db2a10b84f7187c18e4ca8f4dd9', name: "prefix" })));
        const aria = {
            "aria-busy": this.loading ? "true" : "false",
            "aria-disabled": this.disabled ? "true" : "false",
            "aria-selected": this.selected ? "true" : "false",
            "aria-expanded": this.expanded ? "true" : "false",
            "aria-label": this.dataId,
        };
        const checkboxAttributes = {};
        if (this.selected)
            checkboxAttributes.checked = true;
        if (this.indeterminate)
            checkboxAttributes.indeterminate = true;
        if (this.unselectable || this.disabled)
            checkboxAttributes.disabled = true;
        if (this.size)
            checkboxAttributes.size = this.size;
        const expandButton = (h("div", { key: '9ca860657997eb21555d9e59ddc2c3bd67514773', part: "expand-button", class: {
                "tree-item__expand-button": true,
                "tree-item__expand-button--visible": showExpandButton,
                "tree-item__expand-button--start": this.triggerPosition === "start",
                "tree-item__expand-button--end": this.triggerPosition === "end",
            } }, this.loading ? (h("slot", { name: "loading" }, h("hbr-spinner", { part: "spinner", exportparts: "base:spinner__base" }))) : null, h("span", { key: '972fa6e7dc33c09ca3e2d30d1fc21e95d4ed1113', class: "tree-item__expand-icon-slot" }, h("slot", { key: '4ac9a376c4da23e6d826592aaef57d756b545609', name: "expand-icon" }, h("hbr-icon-button", { key: '2ac91dc4f2d6584a97157062d12149f0c5c84154', class: "tree-item__icon-button", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight, "aria-label": this.aria.expandButtonLabel, exportparts: "base:icon-button-base", tabIndex: -1, "data-testid": "default-expand-button" }))), h("span", { key: '5f695801e70535a1176c44cf770df6d203f1a518', class: "tree-item__expand-icon-slot" }, h("slot", { key: 'a0b550492f4062c3407eae5677e880e5d1b0de16', name: "collapse-icon" }, h("hbr-icon-button", { key: '680683a39cfdfd82a77b6e1128526f1413ed1a7f', class: "tree-item__icon-button", asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-down"]) || caretDown, "aria-label": this.aria.collapseButtonLabel, exportparts: "base:icon-button-base", tabIndex: -1, "data-testid": "default-collapse-button" })))));
        return (h(Host, Object.assign({ key: '6d27fbb01bd28b4cc503f3a4a68c590c3263bf87', role: "treeitem", tabindex: "-1" }, aria), h("div", { key: '97d7ec5d8edfc725325882ff439f57375d52ae2d', part: "base", class: {
                "tree-item": true,
                "tree-item--expanded": this.expanded,
                "tree-item--selected": this.selected,
                "tree-item--disabled": this.disabled,
                "tree-item--leaf": this.leaf,
                "tree-item--has-expand-button": showExpandButton,
                // 'tree-item--rtl': this.localize.dir() === 'rtl'
                "tree-item--rtl": false,
            } }, h("span", { key: '53001e0174d5f53cfc320b3d0916ac98ceb6a79b', class: {
                "tree-item__item-wrapper": true,
                "tree-item__item--unselectable": this.unselectable,
            } }, h("div", { key: 'a7d606d6a2611628bad41a8fbd5625013a890251', part: "item", class: {
                "tree-item__item": true,
                "tree-item__item--selected--single": this.selected &&
                    (this.selectionMode === "single" ||
                        this.selectionMode === "leaf"),
                "tree-item__item--selected--multiple": this.selected && this.selectionMode === "multiple",
                "tree-item__item--sm": this.size === "small",
                "tree-item__item--md": this.size === "medium",
                "tree-item__item--interactive": this.interactiveSlotContent,
                "tree-item__item--tabs": this.variant === "tab",
                "tree-item__item--interactive-focus": this.interactiveSlotContent,
                "tree-item__item--focus": !this.interactiveSlotContent,
            } }, h("div", { key: 'a8b57836a3eec59d7c7638dad9d60fd042dcedbc', class: "tree-item__indentation", part: "indentation" }), this.triggerPosition === "start" ? expandButton : null, this.selectable ? (h("hbr-checkbox", Object.assign({ part: "checkbox", exportparts: "\n\t\t\t\t\t\t\t\telement,\n\t\t\t\t\t\t\t\tinput,\n\t\t\t\t\t\t\t\tlabel,\n\t\t\t\t\t\t\t\terror-icon-wrapper,\n\t\t\t\t\t\t\t\terror-icon,\n\t\t\t\t\t\t\t\tdefault-icon-wrapper,\n\t\t\t\t\t\t\t\tdefault-icon,\n\t\t\t\t\t\t\t\tchecked-icon-wrapper,\n\t\t\t\t\t\t\t\tchecked-icon,\n\t\t\t\t\t\t\t\tindeterminate-icon-wrapper,\n\t\t\t\t\t\t\t\tindeterminate-icon,\n\t\t\t\t\t\t\t\tbase:checkbox-base,\n\t\t\t\t\t\t\t\tcontent:checkbox-content,\n\t\t\t\t\t\t\t\tcontent-checked:checkbox-content-checked,\n\t\t\t\t\t\t\t\tcontrol:checkbox-control,\n\t\t\t\t\t\t\t\tcontrol-focus:checkbox-control-focus,\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t", class: {
                "tree-item__checkbox": true,
                "tree-item__checkbox--unselectable": this.unselectable,
                "tree-item__checkbox--selected--unselectable": this.selected && this.unselectable,
                "tree-item__checkbox--indeterminate--unselectable": this.indeterminate,
            } }, checkboxAttributes, { tabindex: "-1" }), prefix, h("span", { class: labelClass, part: "label" }, labelTruncationEnabled ? (h("hbr-truncation", { lines: labelTruncationLines, tooltipTarget: labelTooltipTarget, style: {
                "--word-break": "normal",
                overflowWrap: "anywhere",
            } }, h("slot", null))) : (h("slot", null))))) : ([
            prefix,
            h("span", { class: Object.assign(Object.assign({}, labelClass), { "tree-item__label-sm": this.size === "small", "tree-item__label-md": this.size === "medium", "tree-item__label--unselectable": this.unselectable }), part: "label" }, labelTruncationEnabled ? (h("hbr-truncation", { lines: labelTruncationLines, tooltipTarget: labelTooltipTarget, style: {
                    "--word-break": "normal",
                    overflowWrap: "anywhere",
                } }, h("slot", null))) : (h("slot", null))),
        ]), h("span", { key: '3891ace5cdd41bc93cc22febf0ad32f36a09b01f', class: {
                "tree-item__suffix": true,
                "tree-item__suffix-sm": this.size === "small",
                "tree-item__suffix-md": this.size === "medium",
            } }, h("slot", { key: '89bf14d8db43606462921fe2f61d7a2576b55fc4', name: "suffix" })), this.triggerPosition === "end" ? expandButton : null), h("div", { key: '682173b693ba75978d0c64479a1185c5cf0abb9e', class: {
                "tree-item__interactive": true,
                "tree-item__interactive-sm": this.size === "small",
                "tree-item__interactive-md": this.size === "medium",
            }, part: "interactive", hidden: !this.interactiveSlotContent, "aria-hidden": this.interactiveSlotContent ? "false" : "true" }, h("slot", { key: '308db73e84c9bbf1d32c7c4560218ea5d764d9e7', name: "interactive", onSlotchange: this.handleInteractiveSlotChange }))), h("div", { key: 'bb856fda341de285bbeb63a6b9adc52cd8d6fbf2', class: {
                "tree-item__children": true,
                "tree-item__children-sm": this.size === "small",
                "tree-item__children-md": this.size === "medium",
            }, hidden: !this.expanded, style: {
                height: this.expanded ? "auto" : "0",
            }, part: "children", role: "group" }, h("slot", { key: '4dcbf468a4e448803225822f3e50906abfefe5ac', name: "children", onSlotchange: this.handleChildrenSlotChange })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "loading": ["handleLoadingChange"],
        "disabled": ["handleDisabledChange"],
        "selected": ["handleSelectedChange"],
        "expanded": ["handleExpandedChange", "handleExpandAnimation"],
        "lazy": ["handleLazyChange"]
    }; }
    static get style() { return HbrTreeItemStyle0; }
}, [1, "hbr-tree-item", {
        "indeterminate": [1028],
        "leaf": [1028],
        "loading": [1028],
        "selectable": [1028],
        "expanded": [516],
        "selected": [516],
        "unselectable": [516],
        "disabled": [516],
        "lazy": [516],
        "filtered": [516],
        "dataId": [1, "data-id"],
        "aria": [16],
        "triggerPosition": [1, "trigger-position"],
        "selectionMode": [32],
        "size": [32],
        "interactiveSlotContent": [32],
        "variant": [32]
    }, undefined, {
        "loading": ["handleLoadingChange"],
        "disabled": ["handleDisabledChange"],
        "selected": ["handleSelectedChange"],
        "expanded": ["handleExpandedChange", "handleExpandAnimation"],
        "lazy": ["handleLazyChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tree-item", "hbr-checkbox", "hbr-icon", "hbr-icon-button", "hbr-spinner", "hbr-truncation", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tree-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrTreeItem$1);
            }
            break;
        case "hbr-checkbox":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-truncation":
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

const HbrTreeItem = HbrTreeItem$1;
const defineCustomElement = defineCustomElement$1;

export { HbrTreeItem, defineCustomElement };

