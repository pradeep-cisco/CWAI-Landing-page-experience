import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { c as clamp } from './function-helper.js';

const treeCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--indent-guide-color:var(--base-border-default);--indent-guide-offset:0;--indent-guide-style:solid;--indent-guide-width:2px;--indent-size:var(--hbr-spacing-lg);--indent-size-sm:var(--hbr-spacing-lg);--background:var(--control-bg-weak-default);--color-bg-hover:var(--control-bg-hover);--color-bg-selected:var(--control-bg-active);--tab-border-color-selected:var(--interact-border-medium-active);--tab-border-color-hover:var(--interact-border-medium-hover);--tab-border-width:var(--hbr-spacing-2xs);--tab-border-radius:2px;--tree-tabs-min-width:0px;--tree-tabs-default-width:0px;--tree-tabs-max-width:0px;font-size:0}.tree{background:var(--background)}";
const HbrTreeStyle0 = treeCss;

function getChildrenItems({ treeItem, includeDisabled = true, includeUnselectable = true, } = {}) {
    var _a;
    const childrenSlot = (_a = treeItem.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=children]");
    return childrenSlot
        ? // @ts-ignore
            [...childrenSlot.assignedElements({ flatten: true })].filter(
            // @ts-ignore
            (item) => isTreeItem(item) &&
                (includeDisabled || !item.disabled) &&
                (includeUnselectable || !item.unselectable))
        : [];
}
function isTreeItem(node) {
    return (node instanceof HTMLElement && node.getAttribute("role") === "treeitem");
}
function syncCheckboxes(changedTreeItem, initialSync = false) {
    function syncParentItem(treeItem) {
        // When a parent has children hidden by an active filter, its selected/
        // indeterminate state cannot be derived from its visible children alone.
        // Defer to the consumer-controlled state (computed from the full data set)
        // so a category is never shown as fully selected while hidden children
        // remain unselected.
        if (treeItem.filtered) {
            return;
        }
        const children = getChildrenItems({
            treeItem,
            includeDisabled: false,
            includeUnselectable: true,
        });
        if (children.length) {
            const allChecked = children.every((item) => item.selected);
            const allUnchecked = children.every((item) => !item.selected && !item.indeterminate);
            treeItem.selected = allChecked;
            treeItem.indeterminate = !allChecked && !allUnchecked;
        }
    }
    function syncAncestors(treeItem) {
        const parentItem = treeItem.parentElement;
        if (isTreeItem(parentItem)) {
            syncParentItem(parentItem);
            syncAncestors(parentItem);
        }
    }
    function syncDescendants(treeItem) {
        const children = getChildrenItems({ treeItem });
        for (const childItem of children) {
            childItem.selected = initialSync
                ? treeItem.selected || childItem.selected
                : !childItem.disabled && treeItem.selected;
            syncDescendants(childItem);
        }
        if (initialSync) {
            syncParentItem(treeItem);
        }
    }
    syncDescendants(changedTreeItem);
    syncAncestors(changedTreeItem);
}
const HbrTree$1 = /*@__PURE__*/ proxyCustomElement(class HbrTree extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrSelectionChange = createEvent(this, "hbr-selection-change", 7);
        this.firstFocusableItem = null;
        // Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
        this.initTreeItem = (item) => {
            item.selectable = this.selection === "multiple";
            ["expand", "collapse"]
                .filter((status) => !!this.host.querySelector(`[slot="${status}-icon"]`))
                .forEach((status) => {
                const existingIcon = item.querySelector(`[slot="${status}-icon"]`);
                const expandButtonIcon = this.getExpandButtonIcon(status);
                if (!expandButtonIcon)
                    return;
                if (existingIcon === null) {
                    // No separator exists, add one
                    item.append(expandButtonIcon);
                }
                else if (existingIcon.hasAttribute("data-default")) {
                    // A default separator exists, replace it
                    existingIcon.replaceWith(expandButtonIcon);
                }
                else ;
            });
        };
        this.handleTreeChanged = (mutations) => {
            for (const mutation of mutations) {
                const addedNodes = [
                    ...mutation.addedNodes,
                ].filter(isTreeItem);
                const removedNodes = [...mutation.removedNodes].filter(isTreeItem);
                addedNodes.forEach(this.initTreeItem);
                if (this.lastFocusedItem && removedNodes.includes(this.lastFocusedItem)) {
                    this.lastFocusedItem = null;
                }
            }
        };
        this.handleFocusOut = (event) => {
            const relatedTarget = event.relatedTarget;
            // If the element that got the focus is not in the tree
            if (!relatedTarget || !this.host.contains(relatedTarget)) {
                this.host.tabIndex = 0;
            }
        };
        this.handleFocusIn = (event) => {
            const target = event.target;
            // If the tree has been focused, move the focus to the first focused item
            if (event.target === this.host) {
                if (!this.firstFocusableItem) {
                    this.firstFocusableItem =
                        this.getAllTreeItems().find((item) => item.selected) ||
                            this.getAllTreeItems()[0];
                }
                if (this.firstFocusableItem) {
                    this.focusItem(this.firstFocusableItem);
                }
            }
            // If the target is a tree item, update the tabindex
            if (isTreeItem(target) && !target.disabled) {
                if (this.lastFocusedItem) {
                    this.lastFocusedItem.tabIndex = -1;
                }
                // this.firstFocusableItem = this.getFirstFocusableItem();
                this.lastFocusedItem = target;
                this.host.tabIndex = -1;
                target.tabIndex = 0;
            }
        };
        this.handleLazyChange = (event) => {
            this.handleSlotChange();
            const treeItem = event.target;
            if (this.selection !== "multiple" ||
                !isTreeItem(treeItem) ||
                treeItem.lazy) {
                return;
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (this.host.isConnected) {
                        for (const childItem of treeItem.querySelectorAll("hbr-tree-item")) {
                            childItem.selected = treeItem.selected || childItem.selected;
                        }
                        syncCheckboxes(treeItem, true);
                    }
                });
            });
        };
        this.selection = "single";
        this.size = "medium";
        this.variant = undefined;
        this.labelTooltipTarget = undefined;
    }
    connectedCallback() {
        this.host.addEventListener("focusin", this.handleFocusIn);
        this.host.addEventListener("focusout", this.handleFocusOut);
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.host.addEventListener("hbr-lazy-change", this.handleLazyChange);
        this.host.setAttribute("role", "tree");
        this.host.setAttribute("tabindex", "0");
        // await this.updateComplete;
        this.mutationObserver = new MutationObserver(this.handleTreeChanged);
        this.mutationObserver.observe(this.host, {
            childList: true,
            subtree: true,
        });
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    disconnectedCallback() {
        this.mutationObserver.disconnect();
    }
    // Generates a clone of the expand icon element to use for each tree item
    getExpandButtonIcon(status) {
        const slot = (status === "expand" ? this.expandedIconSlot : this.collapsedIconSlot);
        const icon = slot.assignedElements({ flatten: true })[0];
        // Clone it, remove ids, and slot it
        if (icon) {
            const clone = icon.cloneNode(true);
            [clone, ...clone.querySelectorAll("[id]")].forEach((el) => el.removeAttribute("id"));
            clone.setAttribute("data-default", "");
            clone.slot = `${status}-icon`;
            return clone;
        }
        return null;
    }
    selectItem(selectedItem) {
        const previousSelection = [...this.selectedItems];
        if (this.selection === "multiple") {
            selectedItem.selected = !selectedItem.selected;
            if (selectedItem.lazy) {
                selectedItem.expanded = true;
            }
            syncCheckboxes(selectedItem);
        }
        else if (this.selection === "single") {
            const items = this.getAllTreeItems();
            for (const item of items) {
                item.selected = item === selectedItem;
            }
        }
        else if (this.selection === "leaf") {
            const items = this.getAllTreeItems();
            for (const item of items) {
                item.selected = item === selectedItem;
            }
        }
        const nextSelection = this.selectedItems;
        if (previousSelection.length !== nextSelection.length ||
            nextSelection.some((item) => !previousSelection.includes(item))) {
            // // Wait for the tree items' DOM to update before emitting
            // Promise.all(nextSelection.map(el => el.updateComplete)).then(() => {
            //     this.emit('hbr-selection-change', { detail: { selection: nextSelection } });
            // });
            this.hbrSelectionChange.emit({ selection: nextSelection });
        }
    }
    getAllTreeItems() {
        return [
            ...this.host.querySelectorAll("hbr-tree-item"),
        ];
    }
    focusItem(item) {
        item === null || item === void 0 ? void 0 : item.focus();
    }
    findNextTreeItem(currentEl) {
        if (!currentEl)
            return null;
        // Make sure we are starting from a tree item, not from an interactive child
        const treeItem = currentEl.closest("hbr-tree-item");
        if (!treeItem)
            return null;
        // Step 1: If the tree item is expanded and has child tree-items, go to first child
        const isCollapsed = treeItem.expanded === false;
        if (!isCollapsed) {
            const childTreeItem = treeItem.querySelector(":scope > hbr-tree-item");
            if (childTreeItem) {
                return childTreeItem;
            }
        }
        // Step 2: If no child or collapsed, check next sibling
        let nextSibling = treeItem.nextElementSibling;
        while (nextSibling) {
            if (nextSibling.tagName === "HBR-TREE-ITEM") {
                return nextSibling;
            }
            nextSibling = nextSibling.nextElementSibling;
        }
        // Step 3: If no next sibling, climb up to parent tree-items and look for their next siblings
        let parent = treeItem.parentElement;
        while (parent) {
            const parentTreeItem = parent.closest("hbr-tree-item");
            if (parentTreeItem) {
                let parentNextSibling = parentTreeItem.nextElementSibling;
                while (parentNextSibling) {
                    if (parentNextSibling.tagName === "HBR-TREE-ITEM") {
                        return parentNextSibling;
                    }
                    parentNextSibling = parentNextSibling.nextElementSibling;
                }
            }
            parent = parent.parentElement;
        }
        // No next tree item found
        return null;
    }
    findPreviousTreeItem(currentEl) {
        var _a;
        if (!currentEl)
            return null;
        // Start from closest hbr-tree-item
        const treeItem = currentEl.closest("hbr-tree-item");
        if (!treeItem)
            return null;
        // Step 1: Check previous siblings
        let prevSibling = treeItem.previousElementSibling;
        while (prevSibling) {
            if (prevSibling.tagName === "HBR-TREE-ITEM") {
                let candidate = prevSibling;
                // Dive into the last expanded child
                while (true) {
                    // Check if the candidate is expanded
                    const isCollapsed = !candidate.expanded;
                    const children = isCollapsed
                        ? []
                        : Array.from(candidate.querySelectorAll(":scope > hbr-tree-item"));
                    if (children.length > 0) {
                        candidate = children[children.length - 1];
                    }
                    else {
                        break;
                    }
                }
                return candidate;
            }
            prevSibling = prevSibling.previousElementSibling;
        }
        // Step 2: No previous sibling — climb up to parent
        const parentTreeItem = (_a = treeItem.parentElement) === null || _a === void 0 ? void 0 : _a.closest("hbr-tree-item");
        return parentTreeItem || null;
    }
    handleArrowUpNavigation(event, activeItemIndex, items) {
        var _a;
        const focusItemAt = (index) => {
            const item = items[clamp(index, 0, items.length - 1)];
            this.focusItem(item);
        };
        const focusedElement = event.target;
        const currentTreeItem = focusedElement.closest("hbr-tree-item");
        if (!currentTreeItem)
            return;
        // Case 1: Focus is inside dropdown (NOT on tree item itself)
        if (focusedElement !== currentTreeItem) {
            currentTreeItem.focus(); // Move focus back to parent tree item
            return;
        }
        // Case 2: Focus is already on tree item itself
        const prevTreeItem = this.findPreviousTreeItem(currentTreeItem);
        if (prevTreeItem) {
            // Now prevTreeItem is the right one to focus
            // Look for first focusable interactive element inside its suffix
            const suffixSlot = (_a = prevTreeItem.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('slot[name="interactive"]');
            let focusables = [];
            if (suffixSlot) {
                const assignedElements = suffixSlot.assignedElements({ flatten: true });
                assignedElements.forEach((el) => {
                    focusables = focusables.concat(this.getInteractiveElements(el));
                });
            }
            const firstFocusable = focusables[0];
            if (firstFocusable) {
                firstFocusable.setFocus();
            }
            else {
                prevTreeItem.focus();
            }
        }
        else {
            // No previous tree item, just focus normally upwards
            focusItemAt(activeItemIndex - 1);
        }
    }
    handleArrowDownNavigation(event, activeItem, activeItemIndex, items) {
        var _a;
        const focusItemAt = (index) => {
            const item = items[clamp(index, 0, items.length - 1)];
            this.focusItem(item);
        };
        let focusables = [];
        if (activeItem) {
            const suffixSlot = (_a = activeItem.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('slot[name="interactive"]');
            if (suffixSlot) {
                const assignedElements = suffixSlot.assignedElements({ flatten: true });
                assignedElements.forEach((el) => {
                    const elements = this.getInteractiveElements(el);
                    focusables = focusables.concat(elements);
                });
            }
        }
        const firstFocusable = focusables[0];
        // const isArrowDown = direction === "down";
        // const isArrowUp = direction === "up";
        const targetIndex = focusables.findIndex((el) => el === event.target || el.contains(event.target));
        const isLastFocusable = targetIndex !== -1 && targetIndex === focusables.length - 1;
        if (activeItem && event.target === activeItem) {
            if (firstFocusable) {
                firstFocusable.setFocus();
            }
            else {
                focusItemAt(activeItemIndex + 1);
            }
        }
        else if (focusables.includes(event.target) ||
            targetIndex !== -1) {
            if (isLastFocusable) {
                event.preventDefault();
                return;
            }
        }
        else {
            const nextTreeItem = this.findNextTreeItem(event.target);
            if (nextTreeItem) {
                nextTreeItem.focus();
            }
            else {
                return;
            }
        }
    }
    handleKeyDown(event) {
        var _a, _b;
        // Ignore key presses we aren't interested in
        if (![
            "ArrowDown",
            "ArrowUp",
            "ArrowRight",
            "ArrowLeft",
            "Home",
            "End",
            "Enter",
            " ",
        ].includes(event.key)) {
            return;
        }
        // Ignore key presses when focus is inside a text field. This prevents the component from hijacking nested form
        // controls that exist inside tree items.
        if (event
            .composedPath()
            .some((el) => { var _a; return ["input", "textarea"].includes((_a = el === null || el === void 0 ? void 0 : el.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()); })) {
            return;
        }
        const items = this.getFocusableItems();
        const isRtl = false;
        if (items.length > 0) {
            event.preventDefault();
            const activeItemIndex = items.findIndex((item) => item.matches(":focus"));
            const activeItem = items[activeItemIndex];
            const focusItemAt = (index) => {
                const item = items[clamp(index, 0, items.length - 1)];
                this.focusItem(item);
            };
            const toggleExpand = (expanded) => {
                activeItem.expanded = expanded;
            };
            if (event.key === "ArrowDown") {
                this.handleArrowDownNavigation(event, activeItem, activeItemIndex, items);
            }
            else if (event.key === "ArrowUp") {
                // Moves focus to the next node that is focusable without opening or closing a node.
                this.handleArrowUpNavigation(event, activeItemIndex, items);
                // “Right” in LTR (ArrowRight) or “Left” in RTL (ArrowLeft):
                //  • Collapsed + non‐leaf → expand
                //  • Expanded       → focus first child
                //  • Leaf           → do nothing
            }
            else if ((event.key === "ArrowRight") ||
                (isRtl )) {
                event.preventDefault();
                if (!activeItem || activeItem.disabled)
                    return;
                // leaf nodes do nothing
                if (activeItem.leaf && !activeItem.lazy)
                    return;
                if (!activeItem.expanded) {
                    // collapsed node → expand
                    toggleExpand(true);
                }
                else {
                    // expanded node → move focus to its first child
                    focusItemAt(activeItemIndex + 1);
                }
                // “Left” in LTR (ArrowLeft) or “Right” in RTL (ArrowRight):
                //  • Expanded       → collapse
                //  • Collapsed/leaf → move focus to parent (unless root)
                //  • Root           → do nothing
            }
            else if ((event.key === "ArrowLeft") ||
                (isRtl )) {
                event.preventDefault();
                if (!activeItem || activeItem.disabled)
                    return;
                if (activeItem.expanded) {
                    // expanded node → collapse
                    toggleExpand(false);
                    return;
                }
                // Find parent tree‐item (if any)
                const parent = (_b = (_a = activeItem
                    .closest("hbr-tree-item")) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.closest("hbr-tree-item");
                if (!parent) {
                    // no parent (i.e. at root) → do nothing
                    return;
                }
                // move focus to parent’s index in the flat items array
                const parentIndex = items.findIndex((item) => item === parent);
                if (parentIndex >= 0) {
                    focusItemAt(parentIndex);
                }
            }
            else if (event.key === "Home") {
                // Moves focus to the first node in the tree without opening or closing a node.
                focusItemAt(0);
            }
            else if (event.key === "End") {
                // Moves focus to the last node in the tree that is focusable without opening the node.
                focusItemAt(items.length - 1);
            }
            else if (event.key === "Enter" || event.key === " ") {
                if (!activeItem)
                    return;
                // Selects the focused node.
                if (!activeItem.disabled) {
                    this.selectItem(activeItem);
                }
            }
        }
    }
    handleClick(event) {
        const target = event.target;
        const treeItem = target.closest("hbr-tree-item");
        const isExpandButton = event
            .composedPath()
            .some((el) => {
            var _a, _b, _c;
            return ((_a = el === null || el === void 0 ? void 0 : el.classList) === null || _a === void 0 ? void 0 : _a.contains("tree-item__expand-button")) ||
                ((_b = el === null || el === void 0 ? void 0 : el.getAttribute) === null || _b === void 0 ? void 0 : _b.call(el, "slot")) === "expand-icon" ||
                ((_c = el === null || el === void 0 ? void 0 : el.getAttribute) === null || _c === void 0 ? void 0 : _c.call(el, "slot")) === "collapse-icon";
        });
        //
        // Don't Do anything if there's no tree item, if it's disabled, or if the click doesn't match the initial target
        // from mousedown. The latter case prevents the user from starting a click on one item and ending it on another,
        // causing the parent node to collapse.
        //
        // See https://github.com/shoelace-style/shoelace/issues/1082
        //
        // if (!treeItem || treeItem.disabled || target !== this.clickTarget) {
        // 	return;
        // }
        if (!treeItem || treeItem.disabled) {
            return;
        }
        if (isExpandButton) {
            treeItem.expanded = !treeItem.expanded;
        }
        else if (treeItem.unselectable) {
            return;
        }
        else {
            // In leaf mode, ignore clicks on parent (non-leaf) or lazy nodes; only allow selecting true leaves
            if (this.selection === "leaf" && (!treeItem.leaf || treeItem.lazy)) {
                return;
            }
            this.selectItem(treeItem);
        }
    }
    handleSlotChange() {
        const items = this.getAllTreeItems();
        items.forEach(this.initTreeItem);
    }
    async handleSelectionChange() {
        const isSelectionMultiple = this.selection === "multiple";
        const items = this.getAllTreeItems();
        this.host.setAttribute("aria-multiselectable", isSelectionMultiple ? "true" : "false");
        for (const item of items) {
            item.selectable = isSelectionMultiple;
        }
        if (isSelectionMultiple) {
            // await this.updateComplete;
            [...this.host.querySelectorAll(":scope > hbr-tree-item")].forEach((treeItem) => syncCheckboxes(treeItem, true));
        }
    }
    /** @internal Returns the list of tree items that are selected in the tree. */
    get selectedItems() {
        const items = this.getAllTreeItems();
        const isSelected = (item) => item.selected;
        return items.filter(isSelected);
    }
    getInteractiveElements(root) {
        const focusable = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode(node) {
                const el = node;
                return typeof el.setFocus === "function"
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        });
        let currentNode = walker.nextNode();
        while (currentNode) {
            focusable.push(currentNode);
            currentNode = walker.nextNode();
        }
        return focusable;
    }
    /** @internal Gets focusable tree items in the tree. */
    getFocusableItems() {
        const items = this.getAllTreeItems();
        const collapsedItems = new Set();
        return items.filter((item) => {
            var _a;
            // Exclude disabled elements
            if (item.disabled)
                return false;
            // Exclude those whose parent is collapsed or loading
            const parent = (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.closest("[role=treeitem]");
            if (parent &&
                (!parent.expanded || parent.loading || collapsedItems.has(parent))) {
                collapsedItems.add(item);
            }
            return !collapsedItems.has(item);
        });
    }
    render() {
        return (h(Host, { key: '7312e6b360f70af5f7773ccf494ef732b34e2092', role: "tree" }, h("div", { key: 'fc5bff43d1494a71e1228c96157f6b8eb7bf59c0', part: "base", class: {
                tree: true,
                "tree-tabs": this.variant === "tab",
            }, onClick: this.handleClick, onKeyDown: this.handleKeyDown }, h("slot", { key: 'e6b17a8d95709089b2205013a73737afd297979a', onSlotchange: this.handleSlotChange }), h("span", { key: 'e920a898e3904f4de8ee8119ab06ff39f676b785', hidden: true, "aria-hidden": "true" }, h("slot", { key: 'af5ed30fa4177a59f1c8a879e0e635bf5acfcb4f', name: "expand-icon", ref: (el) => {
                this.expandedIconSlot = el;
            } })), h("span", { key: 'db4fed1e3dcf548cd0c1ced73fa920b7cd4f2a7a', hidden: true, "aria-hidden": "true" }, h("slot", { key: '568b50adc1a44c84543216a4554f40010cee71de', name: "collapse-icon", ref: (el) => {
                this.collapsedIconSlot = el;
            } })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "selection": ["handleSelectionChange"]
    }; }
    static get style() { return HbrTreeStyle0; }
}, [1, "hbr-tree", {
        "selection": [513],
        "size": [513],
        "variant": [513],
        "labelTooltipTarget": [8, "label-tooltip-target"]
    }, undefined, {
        "selection": ["handleSelectionChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-tree"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-tree":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrTree$1);
            }
            break;
    } });
}

const HbrTree = HbrTree$1;
const defineCustomElement = defineCustomElement$1;

export { HbrTree, defineCustomElement };

