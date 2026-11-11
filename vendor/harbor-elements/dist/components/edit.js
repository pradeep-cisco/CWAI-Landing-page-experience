import { h, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { E as EDIT_INPUT_WR } from './consts.js';
import { t as timeout } from './utils.js';

var codes;
(function (codes) {
    codes[codes["MOUSE_LEFT"] = 1] = "MOUSE_LEFT";
    codes[codes["MOUSE_RIGHT"] = 3] = "MOUSE_RIGHT";
    codes[codes["MOUSE_MIDDLE"] = 2] = "MOUSE_MIDDLE";
    codes[codes["BACKSPACE"] = 8] = "BACKSPACE";
    codes[codes["COMMA"] = 188] = "COMMA";
    codes[codes["INSERT"] = 45] = "INSERT";
    codes[codes["DELETE"] = 46] = "DELETE";
    codes[codes["END"] = 35] = "END";
    codes[codes["ENTER"] = 13] = "ENTER";
    codes[codes["ESCAPE"] = 27] = "ESCAPE";
    codes[codes["CONTROL"] = 17] = "CONTROL";
    codes[codes["COMMAND_LEFT"] = 91] = "COMMAND_LEFT";
    codes[codes["COMMAND_RIGHT"] = 93] = "COMMAND_RIGHT";
    codes[codes["COMMAND_FIREFOX"] = 224] = "COMMAND_FIREFOX";
    codes[codes["ALT"] = 18] = "ALT";
    codes[codes["HOME"] = 36] = "HOME";
    codes[codes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    codes[codes["PAGE_UP"] = 33] = "PAGE_UP";
    codes[codes["PERIOD"] = 190] = "PERIOD";
    codes[codes["SPACE"] = 32] = "SPACE";
    codes[codes["SHIFT"] = 16] = "SHIFT";
    codes[codes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    codes[codes["TAB"] = 9] = "TAB";
    codes[codes["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
    codes[codes["ARROW_LEFT"] = 37] = "ARROW_LEFT";
    codes[codes["ARROW_UP"] = 38] = "ARROW_UP";
    codes[codes["ARROW_DOWN"] = 40] = "ARROW_DOWN";
    codes[codes["F1"] = 112] = "F1";
    codes[codes["F2"] = 113] = "F2";
    codes[codes["F3"] = 114] = "F3";
    codes[codes["F4"] = 115] = "F4";
    codes[codes["F5"] = 116] = "F5";
    codes[codes["F6"] = 117] = "F6";
    codes[codes["F7"] = 118] = "F7";
    codes[codes["F8"] = 119] = "F8";
    codes[codes["F9"] = 120] = "F9";
    codes[codes["F10"] = 121] = "F10";
    codes[codes["F11"] = 122] = "F11";
    codes[codes["F12"] = 123] = "F12";
    codes[codes["A"] = 65] = "A";
    codes[codes["C"] = 67] = "C";
    codes[codes["D"] = 68] = "D";
    codes[codes["F"] = 70] = "F";
    codes[codes["L"] = 76] = "L";
    codes[codes["O"] = 79] = "O";
    codes[codes["P"] = 80] = "P";
    codes[codes["S"] = 83] = "S";
    codes[codes["V"] = 86] = "V";
    codes[codes["X"] = 88] = "X";
})(codes || (codes = {}));
var codesLetter;
(function (codesLetter) {
    codesLetter["ENTER"] = "Enter";
    codesLetter["ENTER_NUM"] = "NumpadEnter";
    codesLetter["V"] = "KeyV";
    codesLetter["C"] = "KeyC";
    codesLetter["ESCAPE"] = "Escape";
    codesLetter["TAB"] = "Tab";
    codesLetter["BACKSPACE"] = "Backspace";
    codesLetter["DELETE"] = "Delete";
    codesLetter["ARROW_RIGHT"] = "ArrowRight";
    codesLetter["ARROW_LEFT"] = "ArrowLeft";
    codesLetter["ARROW_UP"] = "ArrowUp";
    codesLetter["ARROW_DOWN"] = "ArrowDown";
    codesLetter["SHIFT"] = "Shift";
})(codesLetter || (codesLetter = {}));
const KeyCodesEnum = codes;

var osPlatform;
(function (osPlatform) {
    osPlatform["mac"] = "Mac";
})(osPlatform || (osPlatform = {}));
const OsPlatform = osPlatform;

function isLetterKey(code) {
    return (code === 32 || // space
        (code >= 48 && code <= 57) ||
        (code >= 96 && code <= 111) ||
        (code >= 186 && code <= 192) ||
        (code >= 219 && code <= 222) ||
        code >= 226 ||
        (code >= 65 && code <= 90)); // a-z
}
// navigator.platform
function isCtrlKey(code, platform) {
    if (platform.includes(OsPlatform.mac)) {
        return [
            KeyCodesEnum.COMMAND_LEFT,
            KeyCodesEnum.COMMAND_RIGHT,
            KeyCodesEnum.COMMAND_FIREFOX,
        ].includes(code);
    }
    return KeyCodesEnum.CONTROL === code;
}
function isClear(code) {
    return codesLetter.BACKSPACE === code || codesLetter.DELETE === code;
}
function isTab(code) {
    return codesLetter.TAB === code;
}
function isEnterKey(code) {
    return code === codesLetter.ENTER || code === codesLetter.ENTER_NUM;
}

class TextEditor {
    constructor(column, saveCallback) {
        this.column = column;
        this.saveCallback = saveCallback;
        this.element = null;
        this.editCell = null;
    }
    async componentDidRender() {
        var _a;
        if (this.editInput) {
            await timeout();
            (_a = this.editInput) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }
    onKeyDown(e) {
        const isEnter = isEnterKey(e.code);
        const isKeyTab = isTab(e.code);
        if ((isKeyTab || isEnter) && e.target && this.saveCallback) {
            // blur is needed to avoid autoscroll
            this.editInput.blur();
            // request callback which will close cell after all
            this.saveCallback(e.target.value, isKeyTab);
        }
    }
    // required
    render() {
        var _a;
        return (h("input", { type: "text", value: ((_a = this.editCell) === null || _a === void 0 ? void 0 : _a.val) || "", ref: (el) => {
                this.editInput = el;
            }, onKeyDown: (e) => this.onKeyDown(e) }));
    }
}

const editCss = "hbr-table-edit{display:block;position:absolute;background-color:#fff}hbr-table-edit input{height:100%;width:100%;box-sizing:border-box}hbr-table-edit hbr-dropdown{height:100%}hbr-table-edit hbr-dropdown.shrink fieldset legend>span{display:none}";
const HbrTableEditStyle0 = editCss;

const Edit = /*@__PURE__*/ proxyCustomElement(class Edit extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.cellEdit = createEvent(this, "cellEdit", 3);
        this.closeEdit = createEvent(this, "closeEdit", 3);
        this.currentEditor = null;
        this.editCell = undefined;
        this.column = undefined;
        this.editor = undefined;
    }
    /** Callback triggered on cell editor save */
    onSave(val, preventFocus) {
        if (this.editCell) {
            this.cellEdit.emit({
                rgCol: this.editCell.x,
                rgRow: this.editCell.y,
                val,
                preventFocus,
            });
        }
    }
    componentWillRender() {
        if (!this.currentEditor) {
            if (this.editor) {
                this.currentEditor = new this.editor(this.column, (e, preventFocus) => this.onSave(e, preventFocus), (focusNext) => this.closeEdit.emit(focusNext));
            }
            else {
                this.currentEditor = new TextEditor(this.column, (e, preventFocus) => this.onSave(e, preventFocus));
            }
        }
    }
    componentDidRender() {
        var _a, _b;
        if (!this.currentEditor) {
            return;
        }
        this.currentEditor.element = this.element.firstElementChild;
        (_b = (_a = this.currentEditor).componentDidRender) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    disconnectedCallback() {
        var _a, _b;
        if (!this.currentEditor) {
            return;
        }
        (_b = (_a = this.currentEditor).disconnectedCallback) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (this.currentEditor.element) {
            this.currentEditor.element = null;
        }
        this.currentEditor = null;
    }
    render() {
        if (this.currentEditor) {
            this.currentEditor.editCell = this.editCell;
            return h(Host, { class: EDIT_INPUT_WR }, this.currentEditor.render(h));
        }
        return "";
    }
    get element() { return this; }
    static get style() { return HbrTableEditStyle0; }
}, [0, "hbr-table-edit", {
        "editCell": [16],
        "column": [16],
        "editor": [16]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-table-edit"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-table-edit":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Edit);
            }
            break;
    } });
}

export { Edit as E, isClear as a, isEnterKey as b, codesLetter as c, defineCustomElement as d, isLetterKey as e, isCtrlKey as i };

