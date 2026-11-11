import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { E as caretLineLeft, F as caretLineRight, a as caretRight, b as caretLeft } from './index2.js';
import { g as getBootstrapConfig, d as defineCustomElement$c } from './icon.js';
import { d as defineCustomElement$b } from './icon-button.js';
import { d as defineCustomElement$a } from './input.js';
import { d as defineCustomElement$9 } from './link.js';
import { d as defineCustomElement$8 } from './option.js';
import { d as defineCustomElement$7 } from './popup.js';
import { d as defineCustomElement$6 } from './select.js';
import { d as defineCustomElement$5 } from './select-anchor.js';
import { d as defineCustomElement$4 } from './tag.js';
import { d as defineCustomElement$3 } from './tooltip.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

const paginationCss = ":host{--page-color:var(--base-text-default);--page-color-hover:var(--interact-text-hover);--page-bg-hover:var(--control-bg-weak-hover);--page-color-active-border:var(--control-border-medium-default);--page-border-width:var(--hbr-border-width);--page-bg-hover-active:var(--control-bg-weak-hover);--page-color-hover-active-border:var(--control-border-medium-default);--page-color-hover-active:var(--interact-text-hover);--page-color-control:var(--interact-icon-weak-default);--page-color-control-disabled:var(--interact-icon-weak-disabled);--page-color-control-hover:var(--interact-icon-weak-default);--page-bg-control-disabled:var(--control-bg-disabled);--ellipsis-color:var(--base-text-default);--select-trigger-color:var(--control-icon-weak-default);--page-control-size:20px;--count-font-color:var(--base-text-medium-default);--size-changer-padding-right:0;--go-to-text-color:var(--base-text-default);--page-bg-active:initial;--page-color-active:var(--base-text-default);--padding:0;--page-number-width:28px;--page-number-height:28px;--size-changer-margin-left:0;--size-changer-margin-right:0;--size-changer-width:68px;--jumper-margin-right:10px;--jumper-margin-left:0;--demographics-gap:16px;--page-font-size:var(--hbr-font-size-sm, 14px);--page-info-font-size:14px;--page-font-weight:var(--hbr-font-weight-normal, 400);--page-border-radius:var(--hbr-border-radius-md);--justify-content:end;--select-padding:var(--hbr-control-spacing-sm);display:block;padding:var(--padding)}:host .paginator{display:flex;align-items:center;height:fit-content;overflow:visible;justify-content:var(--justify-content);gap:var(--demographics-gap)}:host .pages{margin-right:auto;flex-wrap:wrap}:host .pages hbr-link{border-radius:var(--page-border-radius);display:flex}:host .pages hbr-link::part(label){font-size:var(--page-font-size);color:var(--page-color)}:host .pages hbr-link::part(base){width:auto;min-width:var(--page-number-width)}:host .pages hbr-link:not([disabled]):hover::part(base){min-width:var(--page-number-width);height:var(--page-number-height);background:var(--page-bg-hover);border:none}:host .pages hbr-link:not([disabled]):hover::part(label){color:var(--page-color-hover);text-align:center;font-size:var(--page-font-size);font-style:normal;font-weight:var(--page-font-weight);line-height:20px}:host .pages hbr-link.active::part(base){border:var(--page-border-width) solid var(--page-color-active-border);border-radius:var(--page-border-radius);background:var(--page-bg-active)}:host .pages hbr-link:not([disabled]).active::part(label){color:var(--page-color-active)}:host .pages hbr-link:not([disabled]):hover.active::part(base){background:var(--page-bg-hover-active)}:host .pages hbr-link:not([disabled]):hover.active::part(label){color:var(--page-color-hover-active)}:host .pages hbr-link:not([disabled]):hover.active::part(base){border:var(--page-border-width) solid var(--page-color-hover-active-border)}:host .pages hbr-link::part(base):focus-visible{padding:0 6px}:host .pages hbr-link.previous-page-icon::part(base):focus-visible,:host .pages hbr-link.next-page-icon::part(base):focus-visible hbr-link.first-page-icon::part(base):focus-visible hbr-link.last-page-icon::part(base):focus-visible{padding:0}@media screen and (max-width: 600px){:host .paginator{flex-direction:column}:host .demographics{flex-direction:column;align-self:flex-start;gap:var(--demographics-gap)}:host .counts{align-self:flex-start;margin:10px 4px 0px 20px;font-size:smaller}:host .size{align-self:flex-start;margin:10px 4px 0px 20px;font-size:smaller}:host .jumpTo{align-self:flex-start;margin:4px 4px 0px 10px}:host .pages{margin-top:10px}}:host .generalFlex{display:flex;justify-content:center;align-items:center}:host .demographics{display:flex;justify-content:center;align-items:center;gap:var(--demographics-gap)}:host .counts{font-size:var(--page-info-font-size);color:var(--count-font-color)}:host .main_indices{display:flex;align-items:center;height:var(--hbr-spacing-lg)}:host .toggle_visibility{display:none}:host .just_float{float:left}:host .size{margin-right:var(--size-changer-margin-right);margin-left:var(--size-changer-margin-left);display:flex;align-items:center;justify-content:center}:host .size .size-changer{min-width:64px;padding-right:var(--size-changer-padding-right)}:host .size hbr-select::part(combobox){padding-inline:var(--select-padding)}:host .jumpTo{display:flex;width:fit-content;align-items:center;justify-content:center;margin-right:10px}:host .jumpTo p{margin:0px;font-size:var(--page-font-size);color:var(--go-to-text-color)}:host .main_indices_basic{display:flex;align-items:center}:host .ellipsis{display:flex;align-items:center;justify-content:center;box-sizing:border-box;height:28px;width:28px;margin-right:var(--hbr-spacing-2xs);transition:all 0.1s linear;user-select:none;font-weight:var(--page-font-weight);color:var(--ellipsis-color)}:host hbr-select::part(expand-icon){color:var(--select-trigger-color);font-size:16px}:host #first_arrow,:host #last_arrow,:host #previous_arrow,:host #next_arrow{font-size:var(--page-control-size)}:host hbr-link{--font-weight:var(--page-font-weight);--label-icon-vertical-align:initial;--transition:none;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;box-sizing:border-box;margin-right:var(--hbr-spacing-2xs);transition:all 0.1s linear;border-radius:var(--page-border-radius);font-weight:var(--page-font-weight);color:var(--page-color-control);font-size:var(--page-control-size)}:host hbr-link.previous-page-icon::part(label),:host hbr-link.next-page-icon::part(label),:host hbr-link.first-page-icon::part(label),:host hbr-link.last-page-icon::part(label){color:var(--page-color-control)}:host hbr-link::part(base){height:var(--page-number-height);width:var(--page-number-width);display:flex;align-items:center;justify-content:center}:host hbr-link.previous-page-icon,:host hbr-link.next-page-icon,:host hbr-link.first-page-icon,:host hbr-link.last-page-icon{border:none;border-width:0px;margin-right:var(--hbr-spacing-2xs)}:host hbr-link.previous-page-icon:not([disabled]):hover::part(label),:host hbr-link.next-page-icon:not([disabled]):hover::part(label),:host hbr-link.first-page-icon:not([disabled]):hover::part(label),:host hbr-link.last-page-icon:not([disabled]):hover::part(label){color:var(--page-color-control)}:host hbr-link[disabled].active::part(base){border:var(--hbr-border-width, 2px) solid var(--page-color-control-disabled);background:var(--page-bg-control-disabled)}:host hbr-link[disabled]{cursor:not-allowed}:host hbr-link[disabled]::part(label){color:var(--page-color-control-disabled)}:host hbr-link>.centered{display:flex;justify-content:center;align-items:center}:host(.active) .paginator{border-radius:var(--hbr-border-radius-md, 6px);border:var(--hbr-control-border-width) solid var(--interact-border-active)}hbr-link.previous-page-icon,hbr-link.next-page-icon,hbr-link.first-page-icon,hbr-link.last-page-icon{color:var(--base-text-weak-default);font-size:20px}hbr-link.previous-disabled,hbr-link.next-disabled,hbr-link.first-disabled,hbr-link.last-disabled{color:var(--base-text-weak-default)}hbr-select{--popup-border:2px solid var(--control-border-default);--popup-box-shadow:var(--hbr-shadow-xs);--popup-border-radius:6px;--popup-padding:var(--hbr-spacing-2xs)}.size-description{font-weight:var(--page-font-weight);font-size:var(--hbr-font-size-sm, 14px);line-height:20px;display:flex;align-items:center;text-align:center;color:var(--base-text-default);margin-right:var(--hbr-spacing-xs, 8px)}";
const HbrPaginationStyle0 = paginationCss;

const HbrPagination$1 = /*@__PURE__*/ proxyCustomElement(class HbrPagination extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.pageChanged = createEvent(this, "hbr-page-changed", 7);
        this.sizeChanged = createEvent(this, "hbr-size-changed", 7);
        //default page count
        this.pageCount = 0;
        this.limit = 5;
        this.index_start = 0;
        this.index_end = this.limit;
        this.last = 0;
        this.ogAdv = false;
        this.jumperSize = 1;
        this.page = 0;
        this.pageSize = 30;
        this.itemCount = 100;
        this.pageOptions = [30, 50, 100];
        this.i18n = {
            perPage: "Rows per page",
            goTo: "Go to",
        };
        this.basic = true;
        this.hoist = false;
        this.size = "medium";
        this.advanced = false;
        this.sizeChanger = false;
        this.pageInfo = false;
        this.showJumper = false;
        this.disabled = false;
        this.placement = "top";
        this.showAll = false;
        this.orderArray = [2, 1, 0];
        this.nonnumerical = false;
        this.aria = {
            label: {
                pagination: "Pagination",
                firstPage: "First page",
                lastPage: "Last page",
                nextPage: "Next page",
                previousPage: "Previous page",
                pageNumber: "Page",
                goTo: "Go to page",
            },
            role: "navigation",
        };
    }
    handleSelected(event) {
        this.page = event.detail;
        //this.fetch()
    }
    handleSizeChanged(event) {
        //this.page=0
        if (this.page === 0) {
            this.page = 0;
            this.pageSize = event.detail.pageSize;
            this.last = Math.ceil(this.itemCount / this.pageSize);
            this.index_start = 0;
            this.index_end = Math.min(this.last, this.index_start + this.limit);
        }
        else {
            const oldPage = this.page + 1;
            const oldSize = this.pageSize;
            const oldTotal = oldPage * oldSize;
            const firstPage = oldTotal - oldSize + 1;
            this.pageSize = event.detail.pageSize;
            const newSize = this.pageSize;
            const newPage = Math.floor(firstPage / newSize) + 1;
            this.page = newPage - 1;
            this.last = Math.ceil(this.itemCount / this.pageSize);
            let potential_start = 0;
            let potential_end = this.limit;
            if (this.last < this.limit) {
                this.index_start = 0;
                this.index_end = Math.min(this.last, this.index_start + this.limit);
            }
            else if (newPage > this.last - 4) {
                this.index_start = Math.max(0, this.last - this.limit);
                this.index_end = this.last;
            }
            else {
                potential_start = Math.max(0, newPage - 2);
                potential_end = Math.min(this.last, potential_start + this.limit);
                this.index_start = potential_start;
                this.index_end = potential_end;
            }
        }
        //this.page=index-1;
    }
    handleFirst(event) {
        if (this.page !== 0) {
            this.handleSelect(event, 0);
            if (this.advanced && this.page + 1 === this.index_start) {
                this.index_start = this.index_start - 1;
                this.index_end = this.index_end - 1;
            }
        }
    }
    handleLast(event) {
        if (this.page !== this.pageCount - 1) {
            this.handleSelect(event, this.pageCount - 1);
            if (this.advanced && this.page === this.index_end) {
                this.index_start = this.index_start + 1;
                this.index_end = this.index_end + 1;
            }
        }
    }
    //go to the previous page after clicking previous
    handlePrevious(event) {
        if (this.page !== 0) {
            this.handleSelect(event, this.page - 1);
            if (this.page + 1 === this.index_start) {
                this.index_start = this.index_start - 1;
                this.index_end = this.index_end - 1;
            }
        }
    }
    //go to the next page after clicking 'next'
    handleNext(event) {
        if (this.page !== this.pageCount - 1) {
            this.handleSelect(event, this.page + 1);
            if (this.page === this.index_end) {
                this.index_start = this.index_start + 1;
                this.index_end = this.index_end + 1;
            }
        }
    }
    //function to handle click event to be triggered after clicking 'next' in the compact mode
    handleNextCompact(event) {
        if (this.page !== this.pageCount - 1) {
            this.handleSelectCompact(event, this.page + 1);
        }
    }
    //function to handle click event to be triggered after clicking 'previous' in the compact mode
    handlePreviousCompact(event) {
        if (this.page !== 0) {
            this.handleSelectCompact(event, this.page - 1);
        }
    }
    //event to be thrown when an index number is selected in the basic mode
    handleSelect(event, index) {
        let newIndex = index;
        event.preventDefault();
        if (newIndex >= this.last) {
            newIndex = this.last - 1;
        }
        if (newIndex < 0) {
            newIndex = 0;
        }
        this.pageChanged.emit(newIndex);
        this.updatePageWindow(newIndex);
    }
    updatePageWindow(index) {
        if (index + 1 === this.last) {
            this.index_start = Math.max(0, this.last - this.limit);
            this.index_end = this.last;
        }
        else if (index + 1 === 1) {
            this.index_start = 0;
            this.index_end = this.limit;
        }
        if (index + 1 >= this.index_end && index + 1 !== this.last) {
            this.index_start = this.last - this.limit;
            this.index_end = this.index_start + this.limit;
        }
        if (index <= this.index_start && index !== 0) {
            this.index_start = index - 1;
            this.index_end = this.index_start + this.limit;
        }
    }
    handleJump(event) {
        event.preventDefault();
        let index = Number(event.target.value) - 1;
        if (index >= this.last) {
            index = this.last - 1;
        }
        if (index < 0) {
            index = 0;
        }
        this.pageChanged.emit(index);
        this.updatePageWindow(index);
    }
    //event to be thrown when an index number is selected in the compact mode
    handleSelectCompact(event, index) {
        event.preventDefault();
        this.pageChanged.emit(index);
        if (index + 1 === this.index_end && index + 1 !== this.last) {
            this.index_start = this.index_start + 1;
            this.index_end = this.index_end + 1;
        }
        if (index === this.index_start && index !== 0) {
            this.index_start = this.index_start - 1;
            this.index_end = this.index_end - 1;
        }
    }
    handleSelectAdvanced(event, index) {
        event.preventDefault();
        this.pageChanged.emit(index);
    }
    getNewPage(event) {
        const oldPage = this.page + 1;
        const oldSize = this.pageSize;
        const oldTotal = oldPage * oldSize;
        const firstPage = oldTotal - oldSize + 1;
        const newSize = event.currentTarget.value;
        const newPage = Math.floor(firstPage / newSize);
        return newPage;
    }
    //event to be thrown when page size is changed by the user
    handlePageSizeChange(event) {
        const page = this.getNewPage(event);
        this.sizeChanged.emit({
            pageSize: Number(event.currentTarget.value),
            page,
        });
    }
    renderPageLink(index, onClick) {
        return (h("hbr-link", { part: this.page === index ? "page-number-active" : "pages-number", "data-page": index + 1, class: this.page === index ? "active" : "", "aria-current": this.page === index ? "true" : "", aria: { label: `${this.aria.label.pageNumber} ${index + 1}` }, href: "#", role: "link", disabled: this.disabled, "data-testid": `HbrPagination-page-${index + 1}`, onClick: (event) => {
                event.preventDefault();
                onClick(event, index);
                return;
            } }, index + 1));
    }
    renderPageLinks(pages, mode) {
        return pages.map((index) => this.renderPageLink(index, (event, pageIndex) => {
            if (mode === "compact") {
                this.handleSelectCompact(event, pageIndex);
            }
            else {
                this.handleSelectAdvanced(event, pageIndex);
            }
        }));
    }
    render() {
        var _a, _b, _c;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        if (this.basic) {
            this.local_basic = true;
        }
        if (this.advanced) {
            this.local_advanced = true;
        }
        if (this.itemCount > 0) {
            //let pages = [];
            const start = this.page * this.pageSize + 1; //starts at 1
            //end = 4;
            const pages = [];
            const end = Math.min(this.itemCount, this.page * this.pageSize + this.pageSize); //ends at pageSize (total number of pages)
            this.last = Math.ceil(this.itemCount / this.pageSize);
            //for the total number of pages required
            for (let i = 0; i < this.last; i++) {
                pages.push(i);
            }
            //pageCount will become equal to the new length of pages array
            this.pageCount = pages.length;
            if (this.pageCount <= this.limit) {
                // triggering basic mode when the page count is less or equal to 3
                this.local_advanced = false;
                //this.ogAdv=true;
                this.local_basic = true;
            }
            if (this.pageCount > this.limit) {
                // triggering advanced mode when the page count is greater than 3
                this.local_advanced = true;
                this.local_basic = false;
            }
            if (this.showAll) {
                this.showJumper = true;
                this.pageInfo = true;
                this.sizeChanger = true;
            }
            let indices;
            // biome-ignore lint/style/useConst: <explanation>
            let next;
            // biome-ignore lint/style/useConst: <explanation>
            let previous;
            let ellipses_start = h("span", null);
            let ellipses_end = h("span", null);
            let first_link = h("span", null);
            let last_link;
            const nextDisabled = this.page === pages.length - 1;
            const previousDisabled = this.page === 0;
            const getFirstPageArrow = () => (h("hbr-link", { part: `first ${previousDisabled ? "first-disabled" : ""}`, class: {
                    "first-page-icon": true,
                    "first-disabled": previousDisabled,
                }, disabled: this.disabled || previousDisabled, href: "#", role: "link", aria: { label: this.aria.label.firstPage }, "aria-disabled": this.disabled || previousDisabled ? "true" : "false", "data-testid": "HbrPagination-firstPage", onClick: (event) => {
                    event.preventDefault();
                    this.handleFirst(event);
                } }, h("hbr-visually-hidden", null, "First Page"), h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-line-left"]) || caretLineLeft,
                // asset={arrowLeft}
                // asset={checkSquare}
                class: "centered", id: "first_arrow" })));
            const firstPageArrow = this.nonnumerical ? getFirstPageArrow() : null;
            const getLastPageArrow = () => (h("hbr-link", { part: `last ${nextDisabled ? "last-disabled" : ""}`, class: {
                    "last-page-icon": true,
                    "last-disabled": nextDisabled,
                }, disabled: this.disabled || nextDisabled, href: "#", role: "link", aria: { label: this.aria.label.lastPage }, "aria-disabled": this.disabled || nextDisabled ? "true" : "false", "data-testid": "HbrPagination-lastPage", onClick: (event) => {
                    event.preventDefault();
                    this.handleLast(event);
                } }, h("hbr-visually-hidden", null, "Last Page"), h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-line-right"]) || caretLineRight,
                // asset={arrowRight}
                // asset={checkCircle}
                class: "centered", id: "last_arrow" })));
            const lastPageArrow = this.nonnumerical ? getLastPageArrow() : null;
            next = (h("hbr-link", { part: `next ${nextDisabled ? "next-disabled" : ""}`, class: {
                    "next-page-icon": true,
                    "next-disabled": nextDisabled,
                }, disabled: this.disabled || nextDisabled, href: "#", role: "link", aria: { label: this.aria.label.nextPage }, "aria-disabled": this.disabled || nextDisabled ? "true" : "false", "data-testid": "HbrPagination-nextLink", onClick: (event) => {
                    event.preventDefault();
                    if (this.local_basic)
                        this.handleNextCompact(event);
                    else if (this.local_advanced)
                        this.handleNext(event);
                    return;
                } }, h("hbr-visually-hidden", null, "Next Page"), h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-right"]) || caretRight, class: "centered", id: "next_arrow" })));
            previous = (h("hbr-link", { part: `previous ${previousDisabled ? "previous-disabled" : ""}`, class: {
                    "previous-page-icon": true,
                    "previous-disabled": previousDisabled,
                }, disabled: this.disabled || previousDisabled, href: "#", role: "link", aria: { label: this.aria.label.previousPage }, "aria-disabled": this.disabled || previousDisabled ? "true" : "false", "data-testid": "HbrPagination-previousLink", onClick: (event) => {
                    event.preventDefault();
                    if (this.local_basic)
                        this.handlePreviousCompact(event);
                    else if (this.local_advanced)
                        this.handlePrevious(event);
                    return;
                } }, h("hbr-visually-hidden", null, "Previous Page"), h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons["caret-left"]) || caretLeft, class: "centered", id: "previous_arrow" })));
            //conditions and HTML elements for compact mode
            if (this.local_basic) {
                indices = this.renderPageLinks(pages.slice(this.index_start, this.index_end), "compact");
            }
            //conditions and HTML elements for advanced mode
            if (this.local_advanced) {
                if (this.page === 0 && this.pageCount > 4) {
                    indices = this.renderPageLinks(pages.slice(0, 2), "advanced");
                    ellipses_end = h("span", { class: "ellipsis" }, "...");
                    last_link = this.renderPageLinks(pages.slice(this.last - 1, this.last), "advanced");
                }
                else if (this.page === 1 && this.pageCount > 4) {
                    first_link = this.renderPageLinks(pages.slice(0, 3), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    last_link = this.renderPageLinks(pages.slice(this.last - 1, this.last), "advanced");
                }
                else if (this.page === 2 && this.pageCount > 4) {
                    first_link = this.renderPageLinks(pages.slice(0, 4), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    last_link = this.renderPageLinks(pages.slice(this.last - 1, this.last), "advanced");
                }
                else if (this.page >= 3 && this.page <= this.last - 4) {
                    first_link = this.renderPageLinks(pages.slice(0, 1), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    indices = this.renderPageLinks(pages.slice(this.page - 1, this.page + 2), "advanced");
                    ellipses_end = h("span", { class: "ellipsis" }, "...");
                    last_link = this.renderPageLinks(pages.slice(this.last - 1, this.last), "advanced");
                }
                else if (this.page === this.last - 3 && this.pageCount > 4) {
                    first_link = this.renderPageLinks(pages.slice(0, 1), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    indices = h("span", null);
                    ellipses_end = h("span", null);
                    last_link = this.renderPageLinks(pages.slice(this.last - 4, this.last), "advanced");
                }
                else if (this.page === this.last - 2 && this.pageCount > 4) {
                    first_link = this.renderPageLinks(pages.slice(0, 1), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    indices = h("span", null);
                    ellipses_end = h("span", null);
                    last_link = this.renderPageLinks(pages.slice(this.last - 3, this.last), "advanced");
                }
                else if (this.page >= this.last - 2 && this.page < this.last) {
                    first_link = this.renderPageLinks(pages.slice(0, 1), "advanced");
                    ellipses_start = h("span", { class: "ellipsis" }, "...");
                    indices = this.renderPageLinks(pages.slice(this.last - 2, this.last), "advanced");
                    ellipses_end = h("span", null);
                    last_link = h("span", null);
                }
            }
            //custom hbr select element
            const triggerWidth = ((_c = (_b = this.pageSize) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.length) > 2 ? 74 : 66;
            const popupMinWidth = 122;
            const skidding = this.placement === "top-end" || this.placement === "bottom-end"
                ? triggerWidth - popupMinWidth
                : 0;
            const hbr_select = (h("hbr-select", { disabled: this.disabled, part: "select", hoist: this.hoist, exportparts: "base:select, content:select-content, expand-icon:select-expand-icon", class: "size-changer", size: this.size, value: this.pageSize.toString(), "onHbr-change": (event) => this.handlePageSizeChange(event), "data-testid": "HbrPagination-select", placement: this.placement, arialabel: this.i18n.perPage || "Rows per page", style: {
                    width: `${triggerWidth}px`,
                    "--popup-min-width": `${popupMinWidth}px`,
                }, skidding: skidding }, this.pageOptions.map((rows) => (h("hbr-option", { part: "menu-item", value: rows.toString(), "data-page": rows.toString(), "data-testid": `HbrPagination-pageOption-${rows.toString()}` }, rows)))));
            const input_min = 1;
            const advancedPageElements = !this.nonnumerical
                ? [first_link, ellipses_start, indices, ellipses_end, last_link]
                : [];
            const basicPageElements = !this.nonnumerical ? [indices] : [];
            const basic_page_indicators = (h("div", { class: "generalFlex" }, [
                firstPageArrow,
                previous,
                ...basicPageElements,
                next,
                lastPageArrow,
            ]));
            const advanced_page_indicators = (h("div", { class: "generalFlex" }, [
                firstPageArrow,
                previous,
                ...advancedPageElements,
                next,
                lastPageArrow,
            ]));
            const jumper = (h("span", { class: "jumpTo" }, h("p", null, this.i18n.goTo, ":\u00A0"), h("hbr-input", { part: "jumper", disabled: this.disabled, size: this.size, type: "number", min: input_min, max: this.last, style: { width: "70px" }, value: (this.page + 1).toString(), "on-hbr-change": (event) => this.handleJump(event), "data-testId": "HbrPagination-pageNumberInput", aria: { label: `${this.aria.label.goTo} ${this.page + 1}` } }), "\u00A0", h("p", null, "/"), "\u00A0", h("p", null, this.last)));
            let counts = null;
            let pageNumberOptions = null;
            if (this.pageInfo) {
                counts = (h("span", { class: "counts", "data-testId": "HbrPagination-pageNumberInfo" }, start, " -", " ", this.page === pages[pages.length - 1] ? this.itemCount : end, " of", " ", this.itemCount));
            }
            if (this.sizeChanger) {
                pageNumberOptions = (h("span", { class: "size", part: "size" }, h("span", { class: "size-description", part: "size-description" }, this.i18n.perPage || "Rows per page"), hbr_select));
            }
            const main_paginator = (h("span", { class: "pages" }, h("span", { class: this.local_basic ? "main_indices_basic" : "" }, !this.local_advanced && basic_page_indicators, !this.local_advanced && this.showJumper && jumper), h("span", { class: this.local_advanced ? "main_indices" : "" }, this.local_advanced && advanced_page_indicators, this.local_advanced && this.showJumper && jumper)));
            const indexDictionary = {
                "0": main_paginator,
                "1": counts,
                "2": pageNumberOptions,
            };
            const elements = [];
            if (this.orderArray.toString() !== "[0, 1, 2]") {
                for (let i = 0; i < 3; i++) {
                    elements[i] = indexDictionary[this.orderArray[i].toString()];
                }
            }
            else {
                elements[0] = !this.nonnumerical ? main_paginator : null;
                elements[1] = counts;
                elements[2] = pageNumberOptions;
            }
            return (h("div", { class: "paginator", part: "base", role: this.aria.role, "aria-label": this.aria.label.pagination }, elements[0], h("span", { class: "demographics" }, elements[1], elements[2])));
        }
    }
    static get style() { return HbrPaginationStyle0; }
}, [1, "hbr-pagination", {
        "page": [1026],
        "pageSize": [1026, "page-size"],
        "itemCount": [1026, "item-count"],
        "pageOptions": [1040],
        "i18n": [16],
        "basic": [1028],
        "hoist": [1028],
        "size": [1025],
        "advanced": [1028],
        "sizeChanger": [1028, "size-changer"],
        "pageInfo": [1028, "page-info"],
        "showJumper": [1028, "show-jumper"],
        "disabled": [516],
        "placement": [513],
        "showAll": [1028, "show-all"],
        "orderArray": [1040],
        "nonnumerical": [1028],
        "aria": [16]
    }, [[0, "hbr-page-changed", "handleSelected"], [0, "hbr-size-changed", "handleSizeChanged"]]]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-pagination", "hbr-icon", "hbr-icon-button", "hbr-input", "hbr-link", "hbr-option", "hbr-popup", "hbr-select", "hbr-select-anchor", "hbr-tag", "hbr-tooltip", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-pagination":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrPagination$1);
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$c();
            }
            break;
        case "hbr-icon-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$b();
            }
            break;
        case "hbr-input":
            if (!customElements.get(tagName)) {
                defineCustomElement$a();
            }
            break;
        case "hbr-link":
            if (!customElements.get(tagName)) {
                defineCustomElement$9();
            }
            break;
        case "hbr-option":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-select":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-select-anchor":
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

const HbrPagination = HbrPagination$1;
const defineCustomElement = defineCustomElement$1;

export { HbrPagination, defineCustomElement };

