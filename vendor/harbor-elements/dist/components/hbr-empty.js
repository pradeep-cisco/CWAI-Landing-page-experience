import { proxyCustomElement, HTMLElement, h, Host, Fragment } from '@stencil/core/internal/client';

const nodataSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjM4NCIgdmlld0JveD0iMCAwIDUxMiAzODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iMzg0IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzg0IDI4OFYyMzIiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzg0IDE2MEwyNTYgMTI4TDI1NiAxOTJMMzg0IDE2MFoiIGZpbGw9IiNEQUUxRTciLz4KPHBhdGggZD0iTTI1NiAzMjBWMTkyTTI1NiAzMjBMMTI4IDI4OEwxMjggMjMyTTI1NiAzMjBMMzg0IDI4OE0yNTYgMTkyTDEyOCAxNjBNMjU2IDE5MkwyMjQgMjU2QzE3My45MTUgMjQzLjQ5MSAxNDYuMDg1IDIzNi41MDkgOTYgMjI0TDEyOCAxNjBNMjU2IDE5MkwyODggMjU2TDQxNiAyMjRMMzg0IDE2ME0yNTYgMTkyTDM4NCAxNjBNMjU2IDE5MkwyNTYgMTI4TTEyOCAxNjBMMjU2IDEyOE0yNTYgMTI4TDM4NCAxNjAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzA4LjcyIDg1LjU4MDlDMzA4LjM0MiA4Ni42MSAzMDcuMDk4IDg3LjQ3MTIgMzA0LjkwNiA4Ny43NTU1QzMwMi43NjggODguMDMyNyAzMDAuMDAxIDg3LjcwNTggMjk3LjE0IDg2LjY1NTFDMjk0LjI3OSA4NS42MDQ1IDI5MS45NTggODQuMDYzMyAyOTAuNTA3IDgyLjQ2ODRDMjg5LjAyIDgwLjgzMzEgMjg4LjYyOSA3OS4zNzEzIDI4OS4wMDcgNzguMzQyMkMyODkuMzg1IDc3LjMxMzEgMjkwLjYyOSA3Ni40NTE5IDI5Mi44MjEgNzYuMTY3NkMyOTQuOTU5IDc1Ljg5MDQgMjk3LjcyNiA3Ni4yMTczIDMwMC41ODcgNzcuMjY4QzMwMy40NDggNzguMzE4NiAzMDUuNzY5IDc5Ljg1OTggMzA3LjIxOSA4MS40NTQ3QzMwOC43MDYgODMuMDkgMzA5LjA5OCA4NC41NTE4IDMwOC43MiA4NS41ODA5WiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0zMDIuMDI0IDcxLjMxMDdDMzAyLjA1MyA3Mi43OTc0IDMwMS42NzQgNzQuMTA1OCAzMDEuMDkxIDc1LjAxNzFDMzAwLjUwNCA3NS45MzU1IDI5OS43ODYgNzYuMzU0MyAyOTkuMTIgNzYuMzY3QzI5OC40NTQgNzYuMzc5NyAyOTcuNzIxIDc1Ljk4ODYgMjk3LjA5OSA3NS4wOTMzQzI5Ni40ODIgNzQuMjA0OSAyOTYuMDU0IDcyLjkxMTggMjk2LjAyNSA3MS40MjUyQzI5NS45OTcgNjkuOTM4NSAyOTYuMzc2IDY4LjYzIDI5Ni45NTkgNjcuNzE4N0MyOTcuNTQ2IDY2LjgwMDQgMjk4LjI2MyA2Ni4zODE2IDI5OC45MyA2Ni4zNjg5QzI5OS41OTYgNjYuMzU2MSAzMDAuMzI5IDY2Ljc0NzMgMzAwLjk1MSA2Ny42NDI2QzMwMS41NjggNjguNTMxIDMwMS45OTYgNjkuODI0IDMwMi4wMjQgNzEuMzEwN1oiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzA4LjMzMyA3NC45ODEzQzMwNy41NzIgNzYuMjU5MyAzMDYuNTYgNzcuMTcxMSAzMDUuNTg1IDc3LjYzNzlDMzA0LjYwMSA3OC4xMDgzIDMwMy43NzEgNzguMDg1NSAzMDMuMTk4IDc3Ljc0NDlDMzAyLjYyNiA3Ny40MDQ0IDMwMi4yMDkgNzYuNjg1NCAzMDIuMTUzIDc1LjU5NjdDMzAyLjA5OCA3NC41MTY1IDMwMi40MTYgNzMuMTkyIDMwMy4xNzYgNzEuOTE0QzMwMy45MzYgNzAuNjM2MSAzMDQuOTQ4IDY5LjcyNDMgMzA1LjkyNCA2OS4yNTc1QzMwNi45MDcgNjguNzg3MSAzMDcuNzM4IDY4LjgwOTggMzA4LjMxIDY5LjE1MDRDMzA4Ljg4MyA2OS40OTA5IDMwOS4yOTkgNzAuMjEgMzA5LjM1NSA3MS4yOTg2QzMwOS40MTEgNzIuMzc4OSAzMDkuMDkzIDczLjcwMzMgMzA4LjMzMyA3NC45ODEzWiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNDYuMjQ3IDE4NkMyMjQgMTQ4LjUgMjc2LjU0MiAxMjcuNjAxIDMwMyAxMjNDMzMxLjQ4MSAxMTcuNzYgMzQ0IDkxLjUgMzExLjUgODUuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI4IDgiLz4KPC9zdmc+Cg==';

const emptyCss = ":host{display:flex;flex-direction:column;align-items:center}:host img{max-width:20rem;max-height:20rem;pointer-events:none;user-select:none}:host #hbr-empty-description{max-width:20rem;overflow-wrap:break-word;color:var(--base-text-medium-default)}";
const HbrEmptyStyle0 = emptyCss;

const HbrEmpty$1 = /*@__PURE__*/ proxyCustomElement(class HbrEmpty extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.handleSlotChange = () => {
            this.showSlot = true;
        };
        this.description = "No data available...";
        this.imgSrc = nodataSvg;
        this.showSlot = false;
    }
    render() {
        return (h(Host, { key: '5fc87b805c2022f64eadefb400998a816596fc1a' }, !this.showSlot ? (h(Fragment, null, h("img", { src: this.imgSrc, alt: "" }), h("div", { id: "hbr-empty-description" }, h("h2", null, this.description)))) : null, h("slot", { key: '092a397bda2e783ee7dec5d4ac7a00db8824d6fc', onSlotchange: this.handleSlotChange })));
    }
    get host() { return this; }
    static get style() { return HbrEmptyStyle0; }
}, [1, "hbr-empty", {
        "description": [1],
        "imgSrc": [1, "img-src"],
        "showSlot": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-empty"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-empty":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrEmpty$1);
            }
            break;
    } });
}

const HbrEmpty = HbrEmpty$1;
const defineCustomElement = defineCustomElement$1;

export { HbrEmpty, defineCustomElement };

