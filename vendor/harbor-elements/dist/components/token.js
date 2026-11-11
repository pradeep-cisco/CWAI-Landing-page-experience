const interactionMap = {
    "": "",
    hover: "-hover",
    active: "-active",
    press: "-press",
    focus: "-focus",
    disabled: "-disabled",
    highlight: "-highlight",
};
const usageMap = {
    "": "",
    background: "-bg",
    bg: "-bg",
    text: "-text",
    border: "-border",
    "contrast-text": "-contrast-text",
    "vivid-text": "-vivid-text",
    "vivid-bg": "-vivid-bg",
};
const color = (sentiment, usage, prominence, interaction) => {
    var _a, _b, _c, _d;
    const interactionKey = typeof interaction === "string" ? interaction : "";
    const usageKey = typeof usage === "string" ? usage : "";
    let _interaction = (_a = interactionMap[interactionKey]) !== null && _a !== void 0 ? _a : "";
    let _usage = (_b = usageMap[usageKey]) !== null && _b !== void 0 ? _b : "";
    if (typeof interaction === "object") {
        for (const [key, value] of Object.entries(interaction)) {
            _interaction = (_c = interactionMap[(value ? key : "")]) !== null && _c !== void 0 ? _c : "";
        }
    }
    if (typeof usage === "object") {
        for (const [key, value] of Object.entries(usage)) {
            _usage = (_d = usageMap[(value ? key : "")]) !== null && _d !== void 0 ? _d : "";
        }
    }
    const _prominence = prominence ? `-${prominence}` : "";
    if (_prominence === "dark") {
        return `var(--hbr-color-${sentiment}${_prominence})`;
    }
    return `var(--hbr-color-${sentiment}${_usage}${_prominence}${_interaction})`;
};

export { color as c };

