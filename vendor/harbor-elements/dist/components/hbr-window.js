import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';

// Utilities and static constants
const viewPortMarginX = 24;
const viewPortMarginY = 36;
const initialWidth = (size) => {
	if (!(["sm", "lg", "full"].includes(size))) {
		size = "sm";
	}
	return ({
		sm: 480,
		lg: 1196,
		full: document.documentElement.clientWidth
	})[size]
};

const initialHeight = (size) => {
	if (!(["sm", "lg", "full"].includes(size))) {
		size = "sm";
	}
	return ({
		sm: 800,
		lg: 800,
		full: document.documentElement.clientHeight - 56
	})[size]
};

const initialMinWidth = (size) => {
	if (!(["sm", "lg", "full"].includes(size))) {
		size = "sm";
	}
	return ({
		sm: 380,
		lg: 480,
		full: document.documentElement.clientWidth
	})[size]
};

const initialMinHeight = (size) => {
	if (!(["sm", "lg", "full"].includes(size))) {
		size = "sm";
	}
	return ({
		sm: 400, // 800 is magnetic's min, but that breaks UI in many cases
		lg: 400, // "
		full: document.documentElement.clientHeight - 56
	})[size]
};
class DialogBox {
	constructor({
		windowRef,
		rootRef,
		headerRef,
		contentRef,
		size = "sm",
		placement = "center",
	}) {
		this.windowRef = windowRef;
		this.rootRef = rootRef;
		this.headerRef = headerRef;
		this.contentRef = contentRef;
		this.minWidth = 380;
		this.minHeight = 480;
		this.resizePixel = 5;
		this.hasEventListeners = !!window.addEventListener;
		this.isDrag = false;
		this.isResize = false;
		this.resizeMode = "";
		this.zIndexFlag = false;
		this.size = size; // sm, lg, full
		this.placement = placement; // "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" = "center";

		this.setCursor = this.setCursor.bind(this);
		this.setDialogContent = this.setDialogContent.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.returnEvent = this.returnEvent.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.getOffset = this.getOffset.bind(this);

		this.init();
	}

	init() {
		// Initialize the dialog box
		this.rootRef.style.visibility = "hidden";
		this.rootRef.style.display = "block";
		this.setDimensions();
		this.setPosition();
		this.setDialogContent();
		this.rootRef.style.display = "none";
		this.rootRef.style.visibility = "visible";

		this.addEvent(this.rootRef, "mousedown", this.onMouseDown);
		this.addEvent(document, "mousemove", this.onMouseMove);
		this.addEvent(document, "mouseup", this.onMouseUp);
		this.zIndex = this.rootRef.style.zIndex;

		// Add event listener for window resize
		window.addEventListener("resize", this.handleWindowResize);
	}

	handleWindowResize = () => {
		this.resetSizes(true);
	};

	resetSizes = (maintainDimensions) => {
		this.setDimensions(maintainDimensions);
		this.setPosition();
		this.setDialogContent();
	};

	// Sets dimensions of the root on init, resetSize and window resize
	// manual resizes are handled by onMouseMove
	setDimensions(maintainDimensions = false) {

		const windowInnerWidth =
			this.size === "full"
				? document.documentElement.clientWidth
				: document.documentElement.clientWidth - viewPortMarginX;
		const windowInnerHeight =
			this.size === "full"
				? document.documentElement.clientHeight
				: document.documentElement.clientHeight - viewPortMarginY;
		const dialogStyle = getComputedStyle(this.rootRef);
		const dialogContentStyle = getComputedStyle(this.contentRef);
		const calculatedWidth = maintainDimensions
			? this.rootRef.clientWidth
			: initialWidth(this.size);
		const calculatedHeight = maintainDimensions
			? Math.max(
				this.rootRef.clientHeight,
				this.minHeight,
				+parseInt(dialogContentStyle.top) +
				2 * parseInt(dialogStyle.border) +
				16 +
				12 +
				12 +
				12,
			)
			: initialHeight(this.size);
		const width = Math.min(calculatedWidth, windowInnerWidth);
		const height = Math.min(calculatedHeight, windowInnerHeight);

		this.minWidth = initialMinWidth(this.size);
		this.minHeight = initialMinHeight(this.size);

		this.rootRef.style.width = `${width}px`;
		this.rootRef.style.height = `${height}px`;
	}

	setPosition() {
		if (this.size === "full") {
			this.rootRef.style.left = "0px";
			this.rootRef.style.top = "var(--hbr-app-shift-top, 56px)";
			return;
		}
		const { placement } = this;
		const margin = 16;
		const leftForCenter = `${(window.innerWidth - this.rootRef.clientWidth) / 2
			}px`;
		const topForCenter = `${(window.innerHeight - this.rootRef.clientHeight) / 2
			}px`;
		switch (placement) {
			case "top-left":
				this.rootRef.style.left = `${margin}px`;
				this.rootRef.style.top = `calc(${margin}px + var(--hbr-app-shift-top, 56px))`;
				break;
			case "top-right":
				this.rootRef.style.left = `${window.innerWidth - this.rootRef.clientWidth - margin
					}px`;
				this.rootRef.style.top = `calc(${margin}px + var(--hbr-app-shift-top, 56px))`;
				break;
			case "bottom-left":
				this.rootRef.style.left = `${margin}px`;
				this.rootRef.style.top = `${window.innerHeight - this.rootRef.clientHeight - margin
					}px`;
				break;
			case "bottom-right":
				this.rootRef.style.left = `${window.innerWidth - this.rootRef.clientWidth - margin
					}px`;
				this.rootRef.style.top = `${window.innerHeight - this.rootRef.clientHeight - margin
					}px`;
				break;
			default:
				this.rootRef.style.left = leftForCenter;
				this.rootRef.style.top = topForCenter;
				break;
		}
	}

	setCursor(cur) {
		this.rootRef.style.cursor = cur;
		this.headerRef.style.cursor = cur;
	}

	setDialogContent() {
		const dialogContentStyle = getComputedStyle(this.contentRef);
		const w = this.rootRef.clientWidth;
		const h = this.rootRef.clientHeight - parseInt(dialogContentStyle.top);
		this.contentRef.style.width = `${w}px`;
		this.contentRef.style.height = `${h}px`;
		this.headerRef.style.width = `${w}px`;
	}

	addEvent(elm, evt, callback) {
		if (elm == null || typeof elm === "undefined") return;
		if (this.hasEventListeners) elm.addEventListener(evt, callback, false);
		else if (elm.attachEvent) elm.attachEvent(`on${evt}`, callback);
		else elm[`on${evt}`] = callback;
	}

	returnEvent(evt) {
		if (evt.stopPropagation) evt.stopPropagation();
		if (evt.preventDefault) evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	}

	onMouseDown(event) {
		const evt = event || window.event;
		this.zIndexFlag = true;
		if (
			evt.target !== this.rootRef &&
			evt.target !== this.headerRef &&
			evt.target !== this.contentRef
		) {
			return;
		}
		const rect = this.getOffset(this.rootRef);
		this.maxX = Math.max(
			document.documentElement.clientWidth,
			document.body.scrollWidth,
			document.documentElement.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.offsetWidth,
		);
		this.maxY = Math.max(
			document.documentElement.clientHeight,
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.offsetHeight,
		);
		if (rect.right > this.maxX) this.maxX = rect.right;
		if (rect.bottom > this.maxY) this.maxY = rect.bottom;
		this.startX = evt.pageX;
		this.startY = evt.pageY;
		this.startW = this.rootRef.clientWidth;
		this.startH = this.rootRef.clientHeight;
		this.leftPos = rect.left;
		this.topPos = rect.top;
		if (evt.target === this.headerRef && this.resizeMode === "") {
			this.setCursor("grabbing");
			this.isDrag = true;
		} else if (this.resizeMode !== "") {
			this.isResize = true;
		}
		this.rootRef.getBoundingClientRect();
		return this.returnEvent(evt);
	}

	onMouseMove(event) {
		const evt = event || window.event;
		if (
			!(
				evt.target === this.windowRef ||
				evt.target === this.rootRef ||
				evt.target === this.headerRef
			) &&
			!this.isDrag &&
			this.resizeMode === ""
		) {
			return;
		}
		if (this.isDrag) {
			let scrollL = Math.max(
				document.body.scrollLeft,
				document.documentElement.scrollLeft,
			);
			let scrollT = Math.max(
				document.body.scrollTop,
				document.documentElement.scrollTop,
			);
			const dx = this.startX + scrollL - evt.pageX;
			const dy = this.startY + scrollT - evt.pageY;
			let left = this.leftPos - dx;
			let top = this.topPos - dy;
			if (dx < 0) {
				if (left + this.startW > this.maxX) left = this.maxX - this.startW;
			}
			if (dx > 0) {
				if (left < 0) left = 0;
			}
			if (dy < 0) {
				if (top + this.startH > this.maxY) top = this.maxY - this.startH;
			}
			if (dy > 0) {
				if (top < 0) top = 0;
			}
			this.rootRef.style.left = `${left}px`;
			this.rootRef.style.top = `${top}px`;
			if (evt.clientY > window.innerHeight - 32) scrollT += 32;
			else if (evt.clientY < 32) scrollT -= 32;
			if (evt.clientX > window.innerWidth - 32) scrollL += 32;
			else if (evt.clientX < 32) scrollL -= 32;
			if (top + this.startH === this.maxY)
				scrollT = this.maxY - window.innerHeight + 20;
			else if (top === 0) scrollT = 0;
			if (left + this.startW === this.maxX)
				scrollL = this.maxX - window.innerWidth + 20;
			else if (left === 0) scrollL = 0;
			if (this.startH > window.innerHeight) {
				if (evt.clientY < window.innerHeight / 2) scrollT = 0;
				else scrollT = this.maxY - window.innerHeight + 20;
			}
			if (this.startW > window.innerWidth) {
				if (evt.clientX < window.innerWidth / 2) scrollL = 0;
				else scrollL = this.maxX - window.innerWidth + 20;
			}
			window.scrollTo(scrollL, scrollT);
		} else if (this.isResize) {
			let dw;
			let dh;
			let w;
			let h;
			if (this.resizeMode === "w") {
				dw = this.startX - evt.pageX;
				if (this.leftPos - dw < 0) dw = this.leftPos;
				w = this.startW + dw;
				if (w < this.minWidth) {
					w = this.minWidth;
					dw = w - this.startW;
				}
				this.rootRef.style.width = `${w}px`;
				this.rootRef.style.left = `${this.leftPos - dw}px`;
			} else if (this.resizeMode === "e") {
				dw = evt.pageX - this.startX;
				if (this.leftPos + this.startW + dw > this.maxX)
					dw = this.maxX - this.leftPos - this.startW;
				w = this.startW + dw;
				if (w < this.minWidth) w = this.minWidth;
				this.rootRef.style.width = `${w}px`;
			} else if (this.resizeMode === "n") {
				dh = this.startY - evt.pageY;
				if (this.topPos - dh < 0) dh = this.topPos;
				h = this.startH + dh;
				if (h < this.minHeight) {
					h = this.minHeight;
					dh = h - this.startH;
				}
				this.rootRef.style.height = `${h}px`;
				this.rootRef.style.top = `${this.topPos - dh}px`;
			} else if (this.resizeMode === "s") {
				dh = evt.pageY - this.startY;
				if (this.topPos + this.startH + dh > this.maxY)
					dh = this.maxY - this.topPos - this.startH;
				h = this.startH + dh;
				if (h < this.minHeight) h = this.minHeight;
				this.rootRef.style.height = `${h}px`;
			} else if (this.resizeMode === "nw") {
				dw = this.startX - evt.pageX;
				dh = this.startY - evt.pageY;
				if (this.leftPos - dw < 0) dw = this.leftPos;
				if (this.topPos - dh < 0) dh = this.topPos;
				w = this.startW + dw;
				h = this.startH + dh;
				if (w < this.minWidth) {
					w = this.minWidth;
					dw = w - this.startW;
				}
				if (h < this.minHeight) {
					h = this.minHeight;
					dh = h - this.startH;
				}
				this.rootRef.style.width = `${w}px`;
				this.rootRef.style.height = `${h}px`;
				this.rootRef.style.left = `${this.leftPos - dw}px`;
				this.rootRef.style.top = `${this.topPos - dh}px`;
			} else if (this.resizeMode === "sw") {
				dw = this.startX - evt.pageX;
				dh = evt.pageY - this.startY;
				if (this.leftPos - dw < 0) dw = this.leftPos;
				if (this.topPos + this.startH + dh > this.maxY)
					dh = this.maxY - this.topPos - this.startH;
				w = this.startW + dw;
				h = this.startH + dh;
				if (w < this.minWidth) {
					w = this.minWidth;
					dw = w - this.startW;
				}
				if (h < this.minHeight) h = this.minHeight;
				this.rootRef.style.width = `${w}px`;
				this.rootRef.style.height = `${h}px`;
				this.rootRef.style.left = `${this.leftPos - dw}px`;
			} else if (this.resizeMode === "ne") {
				dw = evt.pageX - this.startX;
				dh = this.startY - evt.pageY;
				if (this.leftPos + this.startW + dw > this.maxX)
					dw = this.maxX - this.leftPos - this.startW;
				if (this.topPos - dh < 0) dh = this.topPos;
				w = this.startW + dw;
				h = this.startH + dh;
				if (w < this.minWidth) w = this.minWidth;
				if (h < this.minHeight) {
					h = this.minHeight;
					dh = h - this.startH;
				}
				this.rootRef.style.width = `${w}px`;
				this.rootRef.style.height = `${h}px`;
				this.rootRef.style.top = `${this.topPos - dh}px`;
			} else if (this.resizeMode === "se") {
				dw = evt.pageX - this.startX;
				dh = evt.pageY - this.startY;
				if (this.leftPos + this.startW + dw > this.maxX)
					dw = this.maxX - this.leftPos - this.startW;
				if (this.topPos + this.startH + dh > this.maxY)
					dh = this.maxY - this.topPos - this.startH;
				w = this.startW + dw;
				h = this.startH + dh;
				if (w < this.minWidth) w = this.minWidth;
				if (h < this.minHeight) h = this.minHeight;
				this.rootRef.style.width = `${w}px`;
				this.rootRef.style.height = `${h}px`;
			}
			this.setDialogContent();
		} else {
			let cs;
			let rm = "";
			if (
				evt.target === this.windowRef ||
				evt.target === this.rootRef ||
				evt.target === this.headerRef
			) {
				const rect = this.getOffset(this.rootRef);
				if (evt.pageY < rect.top + this.resizePixel) rm = "n";
				else if (evt.pageY > rect.bottom - this.resizePixel) rm = "s";
				if (evt.pageX < rect.left + this.resizePixel) rm += "w";
				else if (evt.pageX > rect.right - this.resizePixel) rm += "e";
			}
			if (rm !== "" && this.resizeMode !== rm) {
				if (rm === "n" || rm === "s") cs = "ns-resize";
				else if (rm === "e" || rm === "w") cs = "ew-resize";
				else if (rm === "ne" || rm === "sw") cs = "nesw-resize";
				else if (rm === "nw" || rm === "se") cs = "nwse-resize";
				this.setCursor(cs);
				this.resizeMode = rm;
			} else if (rm === "" && this.resizeMode !== "") {
				this.setCursor("");
				this.resizeMode = "";
			}
		}
		return this.returnEvent(evt);
	}

	onMouseUp(evt) {
		const event = evt || window.event;
		if (this.zIndexFlag) {
			this.rootRef.style.zIndex = this.zIndex + 1;
			this.zIndexFlag = false;
		} else {
			this.rootRef.style.zIndex = this.zIndex;
		}
		if (
			!(event.target === this.rootRef || event.target === this.headerRef) &&
			!this.isDrag &&
			this.resizeMode === ""
		) {
			return;
		}
		if (this.isDrag) {
			this.setCursor("");
			this.isDrag = false;
		} else if (this.isResize) {
			this.setCursor("");
			this.isResize = false;
			this.resizeMode = "";
		}
		return this.returnEvent(event);
	}

	getOffset(elm) {
		const rect = elm.getBoundingClientRect();
		const offsetX = window.scrollX || document.documentElement.scrollLeft;
		const offsetY = window.scrollY || document.documentElement.scrollTop;
		return {
			left: rect.left + offsetX,
			top: rect.top + offsetY,
			right: rect.right + offsetX,
			bottom: rect.bottom + offsetY,
		};
	}
}

const windowCss = ":host{display:block;position:fixed;z-index:var(--hbr-z-index-modal, 700);--min-width:380px;--min-height:400px;--width:1024px;--height:min(80vh, 800px);--border-radius:var(--hbr-border-radius-xl)}.titlebar-wrapper{pointer-events:none;display:flex;align-items:center;width:100%}.dialog{margin:0;position:fixed;min-width:var(--min-width);min-height:var(--min-height);width:var(--width);height:var(--height);border-radius:var(--border-radius);overflow:hidden;box-shadow:0px 4px 40px 0px rgba(0, 0, 0, 0.25), 0px 2px 10px 0px rgba(0, 0, 0, 0.6)}.dialog .titlebar{cursor:grab;box-sizing:border-box}.dialog .content{position:absolute;overflow:hidden;font-size:1em}";
const HbrWindowStyle0 = windowCss;

const HbrWindow$1 = /*@__PURE__*/ proxyCustomElement(class HbrWindow extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.hbrInitialFocus = createEvent(this, "hbr-initial-focus", 7);
        this.open = false;
        this.size = "lg";
        this.placement = "center";
    }
    /** show the window */
    async show() {
        if (!this.rootRef)
            return;
        const hbrShow = this.hbrShow.emit();
        if (hbrShow.defaultPrevented) {
            this.open = false;
            return;
        }
        this.open = true;
        this.rootRef.style.display = "block";
        requestAnimationFrame(() => {
            const hbrInitialFocus = this.hbrInitialFocus.emit();
            if (!hbrInitialFocus.defaultPrevented) {
                this.rootRef.focus({ preventScroll: true });
            }
        });
        this.hbrAfterShow.emit();
    }
    /** Hides the modal */
    async hide() {
        if (!this.rootRef)
            return;
        const hbrHide = this.hbrHide.emit();
        if (hbrHide.defaultPrevented) {
            this.open = true;
            return;
        }
        this.open = false;
        this.rootRef.style.display = "none";
        this.hbrAfterHide.emit();
    }
    handleOpenChange() {
        this.open ? this.show() : this.hide();
    }
    handleSizeChange() {
        if (this.dialogBox) {
            this.dialogBox.size = this.size;
            this.dialogBox.resetSizes();
        }
    }
    handlePlacementChange() {
        if (this.dialogBox) {
            this.dialogBox.placement = this.placement;
            this.dialogBox.resetSizes();
        }
    }
    componentDidLoad() {
        this.dialogBox = new DialogBox({
            windowRef: this.host,
            rootRef: this.rootRef,
            headerRef: this.headerRef,
            contentRef: this.contentRef,
            size: this.size,
            placement: this.placement,
        });
        // Show on init if open
        if (this.open) {
            this.show();
        }
    }
    render() {
        return (h(Host, { key: '08f1a825fbf6172cbb5083d89b0995dbb82416f8', class: {
                "hbr-css__window--sm": this.size === "sm",
                "hbr-css__window--lg": this.size === "lg",
                "hbr-css__window--full": this.size === "full",
            } }, h("div", { key: 'd2930cfce4ccd5915e07386039fb1bb7957b3b3f', id: "dialog", class: "dialog", ref: (el) => {
                this.rootRef = el;
            } }, h("div", { key: '8e65b46aab4825093df83fb9c332ad77708cdda2', class: "titlebar", ref: (el) => {
                this.headerRef = el;
            } }, h("span", { key: '438e6145765e76b14e64a0627f3f187bc95171d9', class: "titlebar-wrapper", style: { pointerEvents: "none" } }, h("slot", { key: '3f9e622ae63b5be646ad9e3bfb327f1d4b2f51a4', name: "header" }))), h("div", { key: 'a722189927da4324eb103dbd39fe1cdcc961fe5b', class: "content", ref: (el) => {
                this.contentRef = el;
            } }, h("slot", { key: 'f6680815617d04ccc4482380505070f1e0ef36fe' })))));
    }
    get host() { return this; }
    static get watchers() { return {
        "open": ["handleOpenChange"],
        "size": ["handleSizeChange"],
        "placement": ["handlePlacementChange"]
    }; }
    static get style() { return HbrWindowStyle0; }
}, [1, "hbr-window", {
        "open": [1540],
        "size": [513],
        "placement": [513],
        "show": [64],
        "hide": [64]
    }, undefined, {
        "open": ["handleOpenChange"],
        "size": ["handleSizeChange"],
        "placement": ["handlePlacementChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-window"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-window":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrWindow$1);
            }
            break;
    } });
}

const HbrWindow = HbrWindow$1;
const defineCustomElement = defineCustomElement$1;

export { HbrWindow, defineCustomElement };

