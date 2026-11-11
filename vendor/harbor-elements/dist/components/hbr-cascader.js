import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { h as hasSlot } from './slot.js';

const cascaderCss = ":host{position:relative;display:flex}:host{display:flex;--border-radius:6px;--inner-border:1px solid var(--base-border-default);max-width:var(--max-width);border-radius:var(--border-radius)}.cascader{--border:2px solid var(--control-border-default);border-radius:var(--border-radius)}.cascader-footer{border-top:var(--inner-border)}.cascader{position:relative;box-sizing:border-box;width:inherit;max-width:inherit;display:flex;flex-direction:column}.cascading-has-menu{border:var(--border)}.cascader-body{max-width:calc(var(--body-max-width) + 4px);display:flex;flex-direction:row;overflow:auto}.cascader-header,.cascader-footer{display:none}.cascader-header.cascader-has-header,.cascader-header.cascader-has-footer,.cascader-footer.cascader-has-header,.cascader-footer.cascader-has-footer{display:flex}.cascader-footer{position:sticky;bottom:0px;left:0px}:host-context([data-theme=onecd]) .cascader{--border:var(--onecd-border-width-default, 2px) solid var(--control-border-default)}";
const HbrCascaderStyle0 = cascaderCss;

function getIsAllChecked(data, selection) {
    if (!data)
        return false;
    return data.every((s) => {
        if (!Array.isArray(s.children) ||
            (Array.isArray(s.children) && s.children.length === 0)) {
            return selection.includes(s.id);
        }
        if (Array.isArray(s.children) && s.children.length)
            // preserve this for further use, return selection.includes(s.id) && getIsAllChecked(s.children, selection);
            return getIsAllChecked(s.children, selection);
    });
}
/**
 * get tags
 */
function handleTags(data, tags, selection, shouldRemove) {
    if (Array.isArray(data) && data.length) {
        data.forEach((d) => {
            const isDirectChildrenChecked = Array.isArray(d.children) &&
                d.children.every((c) => selection.includes(c.id));
            if ((isDirectChildrenChecked || selection.includes(d.id)) &&
                !shouldRemove) {
                const tag = Object.assign({}, d);
                tag.handleTagRemove = handleTagRemove;
                tags.add(tag);
            }
            handleTags(d.children, tags, selection, isDirectChildrenChecked);
        });
    }
}
function getTags({ data, selection }) {
    const tags = new Set([]);
    handleTags(data, tags, selection, false);
    return Array.from(tags);
}
/**
 * handle remove tags
 */
function handleSelectionByTag({ id, data, selectionSet, selection, shouldRemove, }) {
    if (Array.isArray(data) && data.length) {
        data.forEach((d) => {
            if (shouldRemove || d.id === id) {
                selectionSet.delete(d.id);
            }
            if (d.children && d.id === id) {
                shouldRemove = true;
            }
            handleSelectionByTag({
                id,
                data: d.children,
                selectionSet,
                selection,
                shouldRemove,
            });
            if (d.id === id) {
                shouldRemove = false;
            }
        });
    }
}
function handleTagRemove({ id, data, selection }) {
    const selectionSet = new Set(selection);
    handleSelectionByTag({
        id,
        data,
        selectionSet,
        selection,
        shouldRemove: false,
    });
    return Array.from(selectionSet);
}
/**
 * flat search
 */
function flattenTreeWithParents(tree, condition = (node) => !node.children) {
    const result = [];
    function traverse(node, parent) {
        if (!node)
            return;
        const _node = Object.assign(Object.assign({}, node), { parents: [] });
        if (typeof parent === "object") {
            // @ts-ignore
            _node.parents = [...parent.parents, parent];
        }
        condition(_node) && result.push(_node);
        if (Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach((child) => traverse(child, _node));
        }
    }
    tree.forEach((node) => traverse(node, undefined));
    return result;
}
const Cascader = /*@__PURE__*/ proxyCustomElement(class Cascader extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrSelection = createEvent(this, "hbr-selection", 7);
        this.hbrOpen = createEvent(this, "hbr-open", 7);
        this.hbrTags = createEvent(this, "hbr-tags", 7);
        this.hbrDataChange = createEvent(this, "hbr-data-change", 7);
        this.hbrMenu = createEvent(this, "hbr-menu", 7);
        this.initialized = false;
        this.waitForHydrated = (element) => {
            return new Promise((resolve) => {
                if (element.classList.contains("hydrated")) {
                    resolve(true);
                }
                else {
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === "attributes" &&
                                mutation.attributeName === "class" &&
                                element.classList.contains("hydrated")) {
                                observer.disconnect();
                                resolve(true);
                            }
                        });
                    });
                    observer.observe(element, { attributes: true });
                }
            });
        };
        this.defaultSlot = false;
        this.headerSlot = false;
        this.footerSlot = false;
        this.data = [];
        this.selection = [];
        this.open = [];
        this.multiple = false;
    }
    connectedCallback() {
        this.handleSlotChange = this.handleSlotChange.bind(this);
        this.handleA11yKB = this.handleA11yKB.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
        this.handleTree = this.handleTree.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSelectChildren = this.handleSelectChildren.bind(this);
        this.loopChildren = this.loopChildren.bind(this);
        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleFlatData = this.handleFlatData.bind(this);
        this.handleResponsive = this.handleResponsive.bind(this);
    }
    disconnectedCallback() {
        window.removeEventListener("resize", this.handleResponsive);
    }
    handleSlotChange() {
        this.headerSlot = hasSlot(this.host, "header");
        this.footerSlot = hasSlot(this.host, "footer");
        this.defaultSlot = hasSlot(this.host);
    }
    componentWillLoad() {
        this.handleSlotChange();
        this.handleDataChange(this.data);
    }
    componentDidLoad() {
        const tags = getTags({ data: this.data, selection: this.selection });
        this.hbrTags.emit({ tags });
        window.addEventListener("resize", this.handleResponsive);
    }
    async handleResponsive() {
        var _a;
        const menus = Array.from((_a = this.host) === null || _a === void 0 ? void 0 : _a.querySelectorAll("hbr-menu"));
        const totalWidth = await menus.reduce(async (accPromise, menu) => {
            if (!menu.classList.contains("hydrated")) {
                await this.waitForHydrated(menu);
            }
            const acc = await accPromise;
            const rect = menu === null || menu === void 0 ? void 0 : menu.getBoundingClientRect();
            if (rect) {
                return acc + rect.width;
            }
            return acc;
        }, Promise.resolve(0));
        const isBiggerThanWindow = totalWidth + 24 > window.innerWidth;
        if (isBiggerThanWindow) {
            this.host.classList.add("hbr-css__cascader-responsive");
        }
        else {
            this.host.classList.remove("hbr-css__cascader-responsive");
        }
    }
    handleDataChange(value) {
        const data = this.handleFlatData(value);
        const openMenus = [];
        this.handleTree({
            data: this.data,
            value: this.open[this.open.length - 1],
            openMenus,
            parent: this.data,
            open: [],
            close: false,
        });
        if (openMenus.length === 0)
            openMenus.push(this.data);
        this.hbrDataChange.emit(Object.assign(Object.assign({}, data), { menu: openMenus }));
    }
    handleTags() {
        const tags = getTags({ data: this.data, selection: this.selection });
        this.hbrTags.emit({ tags });
    }
    openMenu(id) {
        return this.handleOpenMenu({ id });
    }
    handleFlatData(data) {
        const flat = flattenTreeWithParents(data);
        const format = flat.map((item) => {
            const prefix = item.parents.reduce((pre, cur) => {
                return pre ? `${pre} / ${cur.name}` : cur.name;
            }, "");
            const label = prefix ? `${prefix} / ${item.name}` : item.name;
            item.label = label;
            item.parents = undefined;
            return item;
        });
        return {
            flat,
            format,
        };
    }
    handleOpenMenu({ id, close = false }) {
        const openMenus = [];
        const open = [];
        this.handleTree({
            data: this.data,
            value: id,
            openMenus,
            parent: this.data,
            open,
            close,
        });
        open.unshift("");
        this.hbrOpen.emit({ open });
        this.hbrMenu.emit({ data: openMenus });
        return new Promise(() => true);
    }
    closeMenu(id) {
        return this.handleOpenMenu({ id, close: true });
    }
    handleTree({ data, value, openMenus, parent, open, close = false }) {
        var _a;
        for (const d of data) {
            if (d.id === value) {
                if ((_a = d.children) === null || _a === void 0 ? void 0 : _a.length) {
                    if (!close) {
                        open.unshift(d.id);
                        openMenus.push(d.children);
                    }
                    d.children.forEach((c) => {
                        c.parentid = d.id;
                    });
                }
                parent && openMenus.unshift(parent);
                return openMenus;
            }
            if (d.children) {
                const selected = this.handleTree({
                    data: d.children,
                    value,
                    openMenus,
                    parent: d.children,
                    open,
                    close,
                });
                if (selected) {
                    if (!selected.includes(parent)) {
                        open.unshift(d.id);
                        selected.unshift(parent);
                    }
                    return selected;
                }
            }
        }
    }
    handleOpenChange(e) {
        if (e.detail.event.srcElement.tagName === "HBR-CHECKBOX") {
            return;
        }
        const openMenus = [];
        const open = [];
        this.handleTree({
            data: this.data,
            value: e.detail.item.value,
            openMenus,
            parent: this.data,
            open,
        });
        open.unshift("");
        this.hbrOpen.emit({ open, item: e.detail.item });
        this.hbrMenu.emit({ data: openMenus });
        if (!this.multiple && e.detail.item.leaf) {
            this.hbrSelection.emit({ item: e.detail.item });
        }
    }
    getItemById(data, id) {
        for (const d of data) {
            if (d.id === id)
                return d;
            if (d.children) {
                const item = this.getItemById(d.children, id);
                if (item)
                    return item;
            }
        }
    }
    handleSelectChildren(data, selection, selected) {
        if (Array.isArray(data) && data.length) {
            data.forEach((d) => {
                if (selected) {
                    selection.add(d.id);
                }
                else {
                    selection.delete(d.id);
                }
                this.handleSelectChildren(d.children, selection, selected);
            });
        }
    }
    loopChildren(children, fn) {
        for (const c of children) {
            if (fn(c))
                break;
            if (Array.isArray(c.children))
                this.loopChildren(c.children, fn);
        }
    }
    handleSelectParent(data, selection) {
        if (data && Array.isArray(data) && data.length) {
            return data.every((node) => {
                const isAllCheck = this.handleSelectParent(node.children, selection);
                if (isAllCheck) {
                    selection.add(node.id);
                }
                return selection.has(node.id);
            });
        }
    }
    handleUnselectParent(data, selection) {
        data.forEach((node) => {
            if (node && Array.isArray(node.children) && node.children.length) {
                const isAllChecked = getIsAllChecked(node.children, Array.from(selection));
                if (isAllChecked) {
                    selection.add(node.id);
                }
                else {
                    selection.delete(node.id);
                }
                this.handleUnselectParent(node.children, selection);
            }
        });
    }
    handleSelection(e) {
        const id = e.target.closest("hbr-menu-item").dataset.id;
        const selection = new Set(this.selection);
        const item = this.getItemById(this.data, id);
        if (e.target.checked) {
            selection.add(id);
        }
        else {
            selection.delete(id);
        }
        this.handleSelectChildren(item.children, selection, e.target.checked);
        this.handleSelectParent(this.data, selection);
        this.handleUnselectParent(this.data, selection);
        this.hbrSelection.emit({ selection: Array.from(selection) });
    }
    handleA11yKB(e) {
        const item = e.target.closest("hbr-menu-item");
        if (!item)
            return;
        if (e.key === "ArrowRight") {
            const id = item.dataset.id;
            this.openMenu(id);
            setTimeout(() => {
                const menus = Array.from(this.host.querySelectorAll("hbr-menu"));
                const idx = menus.findIndex((menu) => menu.contains(item));
                const index = idx + 1;
                if (index >= menus.length)
                    return;
                const next = menus[index];
                next === null || next === void 0 ? void 0 : next.getMenuItems().then((items) => {
                    var _a;
                    if (items.length) {
                        (_a = items[0]) === null || _a === void 0 ? void 0 : _a.setFocus();
                    }
                });
            });
        }
        else if (e.key === "ArrowLeft") {
            setTimeout(() => {
                const parentid = item.dataset.parentid;
                if (parentid) {
                    this.closeMenu(parentid);
                    const parentItem = this.host.querySelector(`hbr-menu-item[data-id="${parentid}"]`);
                    if (parentItem) {
                        parentItem.setFocus();
                    }
                }
            });
        }
        else if ([" ", "Enter"].includes(e.key)) {
            const checkbox = item.querySelector("hbr-checkbox");
            item.checked = !item.checked;
            checkbox === null || checkbox === void 0 ? void 0 : checkbox.setCheck();
        }
    }
    render() {
        return (h(Host, { key: '4a5311b88bd3dee044a0102032aaa4f43dce0513', "data-header": this.headerSlot, "data-footer": this.footerSlot }, h("div", { key: '18628ea035a730a0314a98d309093a3a81179011', part: "base", class: {
                cascader: true,
                "cascading-has-menu": this.defaultSlot || this.headerSlot || this.footerSlot,
            }, "onhbr-select": this.handleOpenChange, "onhbr-click": this.handleSelection, onKeyDown: this.handleA11yKB }, h("span", { key: 'e8303d03cc9784a02bbd4c6ec2f319ba3d46b4da', part: "header", class: {
                "cascader-header": true,
                "cascader-has-header": this.headerSlot,
            } }, h("slot", { key: 'c6f33ecebb89620c7de1ef670297a4e3befdaa96', onSlotchange: this.handleSlotChange, name: "header" })), h("span", { key: '99ee7ca901883dbc738070c453d84565902d2058', class: "cascader-body", part: "body" }, h("slot", { key: '36f46a1a90b02f6848cdabac7b44f82ea2b17456', onSlotchange: this.handleSlotChange })), h("span", { key: '76e0772095175f4d680a27f47edd23e6e17ca293', part: "footer", class: {
                "cascader-footer": true,
                "cascader-has-footer": this.footerSlot,
            } }, h("slot", { key: '1b50d3cb4b3bcd571b7f0d6ae2ab4adb8ac651c6', onSlotchange: this.handleSlotChange, name: "footer" })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleResponsive"],
        "data": ["handleDataChange"],
        "selection": ["handleTags"]
    }; }
    static get style() { return HbrCascaderStyle0; }
}, [1, "hbr-cascader", {
        "data": [16],
        "selection": [16],
        "open": [16],
        "multiple": [516],
        "defaultSlot": [32],
        "headerSlot": [32],
        "footerSlot": [32],
        "openMenu": [64],
        "closeMenu": [64]
    }, undefined, {
        "open": ["handleResponsive"],
        "data": ["handleDataChange"],
        "selection": ["handleTags"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-cascader"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-cascader":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Cascader);
            }
            break;
    } });
}

const HbrCascader = Cascader;
const defineCustomElement = defineCustomElement$1;

export { HbrCascader, defineCustomElement };

