import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { a as addConstructedStyle } from './browser.js';
import { d as defineCustomElement$2 } from './resize-observer.js';

const truncateCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{width:100%;display:block;overflow:hidden;height:auto;position:relative}:host slot{display:none}.truncate{position:absolute;white-space:nowrap}.truncate--single{white-space:nowrap;overflow:hidden}.truncate--end{text-overflow:ellipsis}.truncate--multiline{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;line-clamp:var(--line-clamp, 2);-webkit-line-clamp:var(--line-clamp, 2)}.truncate--multiline.truncate--start{line-clamp:inherit;-webkit-line-clamp:inherit}";
const HbrTruncateStyle0 = truncateCss;

const Truncate = /*@__PURE__*/ proxyCustomElement(class Truncate extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrTruncateChange = createEvent(this, "hbr-truncate-change", 7);
        this.sheet = new CSSStyleSheet();
        this.getSlotTextWidth = () => {
            if (!this.slotRef)
                return 0;
            this.slotRef.style.display = "block";
            const node = this.slotRef.assignedNodes()[0];
            if (!node)
                return;
            const range = this.host.ownerDocument.createRange();
            range.selectNodeContents(node);
            const width = range.getBoundingClientRect().width;
            this.slotRef.style.removeProperty("display");
            return width;
        };
        this.getNumOfCharAndCharWidth = (textWidth, hostWidth) => {
            // average width of a character, auto mode
            const charWidth = this.charWidth === "auto"
                ? textWidth / this.host.textContent.length
                : this.charWidth;
            const maxNumOfChar = Math.floor(hostWidth / charWidth) * this.lines;
            return {
                maxNumOfChar,
                charWidth,
            };
        };
        this.handleResize = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const textWidth = this.getSlotTextWidth();
            const characterWidth = this.charWidth === "auto"
                ? textWidth / this.host.textContent.length
                : this.charWidth;
            (_a = this.displayRef) === null || _a === void 0 ? void 0 : _a.style.setProperty("display", "none");
            const hostWidth = this.maxlength
                ? characterWidth * this.maxlength
                : this.host.getBoundingClientRect().width;
            // always set the width of the container to the host width
            // for dragging and resizing
            (_b = this.displayRef) === null || _b === void 0 ? void 0 : _b.style.setProperty("display", "");
            (_c = this.displayRef) === null || _c === void 0 ? void 0 : _c.style.setProperty("width", `${hostWidth}px`);
            // reset class
            if (this.displayRef) {
                this.displayRef.className = "";
            }
            // if host width is greater than the content width, then it is not truncated
            // this gets triggered when class is changed too
            // so a only check when it is not equal
            if (hostWidth > textWidth) {
                this.truncated = false;
                this.truncatedText = this.host.textContent || "";
            }
            else if (hostWidth < textWidth) {
                if (this.lines > 1) {
                    (_d = this.displayRef) === null || _d === void 0 ? void 0 : _d.classList.add("truncate--multiline");
                    (_e = this.displayRef) === null || _e === void 0 ? void 0 : _e.classList.add(`truncate--${this.position}`);
                    (_f = this.displayRef) === null || _f === void 0 ? void 0 : _f.classList.add(`truncate--lines-${this.lines}`);
                    if (this.position === "start") {
                        const cuttingText = this.host.textContent || "";
                        const { maxNumOfChar } = this.getNumOfCharAndCharWidth(textWidth, hostWidth);
                        // 3 is for stimulated ellipsis sizing
                        this.truncatedText = `...${cuttingText.slice(-maxNumOfChar + 3)}`;
                    }
                    else {
                        if (this.position === "middle") {
                            console.warn("Truncate: Middle position is not supported for multiline truncation.");
                        }
                        this.truncatedText = this.host.textContent || "";
                    }
                }
                else {
                    (_g = this.displayRef) === null || _g === void 0 ? void 0 : _g.classList.add("truncate--single");
                    (_h = this.displayRef) === null || _h === void 0 ? void 0 : _h.classList.add(`truncate--${this.position}`);
                    (_j = this.displayRef) === null || _j === void 0 ? void 0 : _j.classList.add(`truncate--lines-${this.lines}`);
                    if (this.position === "start" || this.position === "middle") {
                        let cuttingText = this.host.textContent || "";
                        const { maxNumOfChar } = this.getNumOfCharAndCharWidth(textWidth, hostWidth);
                        if (textWidth > hostWidth) {
                            if (this.position === "start") {
                                // 3 is for stimulated ellipsis sizing
                                cuttingText = `...${cuttingText.slice(-maxNumOfChar + 3)}`;
                            }
                            else if (this.position === "middle") {
                                const half = Math.floor(maxNumOfChar / 2);
                                // -1 and 2 is for stimulated ellipsis sizing
                                cuttingText = `${cuttingText.slice(0, half - 1)}...${cuttingText.slice(-half + 2)}`;
                            }
                        }
                        this.truncatedText = cuttingText;
                    }
                    else {
                        this.truncatedText = this.host.textContent || "";
                    }
                }
            }
            if (textWidth / this.lines > hostWidth) {
                this.truncated = true;
            }
            else {
                this.truncated = false;
            }
        };
        this.position = "end";
        this.lines = 1;
        this.maxlength = undefined;
        this.charWidth = "auto";
        this.truncatedText = undefined;
        this.truncated = false;
    }
    handleTruncatedChange() {
        this.hbrTruncateChange.emit({ truncated: this.truncated });
    }
    render() {
        const { lines, truncatedText } = this;
        if (this.host) {
            this.sheet.replaceSync(`
    		:host {
    		--line-clamp: ${lines};
    		}
    	`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Host, { key: '93394fad9d7cde81f3a55c8489a42064a777dbb1', "data-truncated": this.truncated }, h("div", { key: '050b3ce1f5afd054d8bcc9f457cf30e10b6ac516', ref: (el) => {
                this.container = el;
            }, part: "base", class: {
                truncate: true,
            } }, h("slot", { key: '3eb36159b1cba057bb5f9107de070ad3b0a0721b', ref: (el) => {
                this.slotRef = el;
            } })), h("div", { key: 'e329c21b6bba5cbe5a03c02f4bba1e3c792ff93d', ref: (el) => {
                this.displayRef = el;
            } }, truncatedText || ""), h("hbr-resize-observer", { key: 'eb8b4b0b94f740e752807ae2b3ad2f57b3f9e629', "onHbr-resize": this.handleResize, anchor: this.host.parentElement, subscriber: this.container })));
    }
    get host() { return this; }
    static get watchers() { return {
        "truncated": ["handleTruncatedChange"]
    }; }
    static get style() { return HbrTruncateStyle0; }
}, [1, "hbr-truncate", {
        "position": [513],
        "lines": [1538],
        "maxlength": [514],
        "charWidth": [520, "char-width"],
        "truncatedText": [32],
        "truncated": [32]
    }, undefined, {
        "truncated": ["handleTruncatedChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-truncate", "hbr-resize-observer"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-truncate":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Truncate);
            }
            break;
        case "hbr-resize-observer":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTruncate = Truncate;
const defineCustomElement = defineCustomElement$1;

export { HbrTruncate, defineCustomElement };

