const getMagneticSentiment = (sentiment) => {
    switch (sentiment) {
        case "success":
            return "positive";
        case "danger":
            return "negative";
    }
    return sentiment;
};
const getCssRulesForSentiment = ({ sentiment, type, }) => {
    if (type === "icon") {
        const isNeutral = sentiment === "neutral";
        let mSentiment = getMagneticSentiment(sentiment);
        if (isNeutral) {
            mSentiment = "interact";
        }
        if (sentiment === "inactive" || sentiment === "disabled") {
            mSentiment = "dormant";
        }
        const prominence = ["warning", "severe-warning"].includes(mSentiment)
            ? "-strong"
            : "";
        const color = isNeutral
            ? "var(--interact-icon-weak-default)"
            : `var(--${mSentiment}-icon${prominence}-default)`;
        return `
			color: ${color};
			--path-color-default: ${color};
			--path-color-strong:  ${color};
			--path-color-medium: var(--${mSentiment}-icon-medium-default);
			--path-color-weak: var(--${mSentiment}-icon-weak-default);
			--path-color-light: var(--${mSentiment}-bg-medium-default);
			--path-color-contrast: var(--${mSentiment}-icon-in-default);
		`;
    }
};
const backgroundSentiment = (sentiment, prominence, action) => {
    if (["inactive", "disabled"].includes(sentiment)) {
        return "--bg-color: var(--control-bg-medium-disabled);";
    }
    const _prominence = prominence ? `-${prominence}` : "";
    const _action = action && action !== "default" && action !== "disabled" ? `-${action}` : "";
    const __action = action
        ? action === "press"
            ? "active"
            : action
        : "default";
    return `
		--bg-color${_action}: var(--${sentiment}-bg${_prominence}-${__action});
	`;
};
/** Text / label color */
const textDefaultSentiment = () => {
    return "--text-color: var(--base-text-default);";
};
const textSentiment = (sentiment, label = "text", action, surface, prominence) => {
    const _prominence = prominence ? `-${prominence}` : "";
    const _surface = surface ? "-in" : "";
    const _action = action && action !== "default" && action !== "disabled" ? `-${action}` : "";
    const __action = action
        ? action === "press"
            ? "active"
            : action
        : "default";
    return `--${label}-color${_action}: var(--${sentiment}-text${_surface}${_prominence}-${__action});`;
};
/** border color */
const borderSentiment = (sentiment, prominence, action) => {
    const _prominence = prominence ? `-${prominence}` : "";
    const _action = action && action !== "default" && action !== "disabled" ? `-${action}` : "";
    const __action = action ? action : "default";
    return `
		--border-color${_action}: var(--${sentiment}-border${_prominence}-${__action});
	`;
};
const getCssRulesForSentimentTag = ({ sentiment, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    return backgroundSentiment(mSentiment, "medium") + textDefaultSentiment();
};
const getCssRulesForSentimentBanner = ({ sentiment, variant, type, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    if (type === "background") {
        if (variant === "fill") {
            if (sentiment === "interact") {
                return "--control-bg-medium-active";
            }
            return backgroundSentiment(mSentiment, "strong");
        }
        return backgroundSentiment(mSentiment, "weak");
    }
    if (type === "border") {
        return borderSentiment(mSentiment);
    }
};
const getCssRulesForSentimentBadge = ({ sentiment, pulse, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    const pulseBg = pulse ? `--pulse-color: var(--${sentiment}-bg-default);` : "";
    if (sentiment === "neutral") {
        return `${backgroundSentiment("base", "strong")}--text-color: var(--base-text-in-default);${pulseBg}`;
    }
    //no Magnetic text colors for neutral and info --SENTIMENT-text-in-default
    return (backgroundSentiment(mSentiment, "") +
        textSentiment(sentiment === "info" ? "base" : mSentiment, "text", "", true) +
        pulseBg);
};
const getCssRulesForSentimentCard = ({ sentiment, disabled, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    const accentDisabledColor = `--accent-disabled-opacity-color: var(--${mSentiment}-bg-active);`;
    let borderColor;
    if (disabled) {
        borderColor = `--sentiment-color: var(--${mSentiment}-border-active);`;
    }
    else {
        borderColor = `--sentiment-color: var(--${mSentiment}-border-default);`;
    }
    return `${borderColor}\n${accentDisabledColor}`;
};
const getCssRulesForSentimentIconButton = ({ sentiment, disabled, type, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    const color = `--color: var(--${mSentiment}-icon-weak-${disabled ? "disabled" : "default"});`;
    if (type === "hover") {
        const colorHover = `--color-hover: var(--${mSentiment}-icon-weak-hover);`;
        return `${color} \n ${colorHover}`;
    }
    return `${color}`;
};
const getCssRulesForSentimentLink = ({ sentiment, disabled, variant, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    const actions = ["default", "hover", "press"];
    if (disabled) {
        if (variant === "fill") {
            return `${backgroundSentiment(mSentiment, "", "disabled")}--label-color: var(--${mSentiment}-text-in-disabled);`;
        }
        // Using icon since text color is not available in Magnetic
        // this should be deprecated leaving due to the backward compatibility for now
        return `
			--bg-color: transparent;
			--border: var(--border-width) solid  var(--${mSentiment}-border-disabled);
			--label-color: var(--${mSentiment}-icon-disabled);
		`;
    }
    return actions
        .map((action) => {
        if (action !== "default") {
            if (variant === "fill") {
                return `${backgroundSentiment(mSentiment, "", action)}\n--label-color-${action}: var(--${mSentiment}-text-in-${action === "press" ? "active" : action});`;
            }
            return (`--bg-color-${action}: var(--${mSentiment}-bg-medium-${action === "press" ? "active" : action});` +
                `--label-color-${action}: var(--${mSentiment}-icon-${action === "press" ? "active" : action});` +
                ` --border-${action}: var(--hbr-border-width) solid var(--${mSentiment}-border-${action === "press" ? "active" : action});`);
        }
        if (variant === "fill") {
            return `${backgroundSentiment(mSentiment, "", action)}\n --label-color: var(--${mSentiment}-text-in-default);`;
        }
        return `--bg-color: transparent;\n --label-color: var(--${mSentiment}-icon-default); \n --border: var(--hbr-border-width) solid var(--${mSentiment}-border-default);`;
    })
        .join("\n");
};
const getCssRulesForSentimentButton = ({ sentiment, variant, disabled, type, }) => {
    const mSentiment = getMagneticSentiment(sentiment);
    if (type === "icon") {
        let mSentiment = getMagneticSentiment(sentiment);
        if (sentiment === "neutral") {
            mSentiment = "brand-accent";
        }
        if (sentiment === "inactive" || sentiment === "disabled") {
            mSentiment = "dormant";
        }
        const color = `var(--${mSentiment}-icon${variant === "fill" ? "-in" : ""}-${disabled ? "disabled" : "default"})`;
        return `
			color: ${color};
			--path-color-default: ${color};
			--path-color-strong:  ${color};
			--path-color-medium: var(--${mSentiment}-icon-medium-default);
			--path-color-weak: var(--${mSentiment}-icon-weak-default);
			--path-color-light: var(--${mSentiment}-bg-medium-default);
			--path-color-contrast: var(--${mSentiment}-icon-in-default);
		`;
    }
    const actions = ["default", "hover", "active"];
    if (disabled) {
        let bgColor = "";
        if (variant === "text") {
            bgColor = "--bg-color: transparent;";
        }
        else {
            bgColor = backgroundSentiment(mSentiment, variant === "fill" ? "" : "weak", "disabled");
        }
        const borderColor = borderSentiment(mSentiment, "", "disabled");
        const labelColor = textSentiment(mSentiment, "label", "disabled", variant === "fill" ? true : false, "");
        return `${bgColor}\n${borderColor}\n${labelColor}`;
    }
    return actions
        .map((action) => {
        let bgColor;
        let borderColor;
        if (variant === "text" && action === "default") {
            bgColor = "--bg-color: transparent;";
            borderColor = "--border-color: transparent;";
        }
        else {
            bgColor = backgroundSentiment(mSentiment, variant === "fill"
                ? ""
                : ["positive", "warning", "info"].includes(mSentiment) &&
                    ["hover", "active"].includes(action)
                    ? "medium"
                    : "weak", action);
            borderColor = borderSentiment(mSentiment, "", action);
        }
        const labelColor = textSentiment(mSentiment, "label", action, variant === "fill" ? true : false, "");
        return `${bgColor}\n${borderColor}\n${labelColor}`;
    })
        .join("\n");
};

export { getCssRulesForSentimentBanner as a, getCssRulesForSentiment as b, getCssRulesForSentimentButton as c, getCssRulesForSentimentCard as d, getCssRulesForSentimentIconButton as e, getCssRulesForSentimentLink as f, getCssRulesForSentimentBadge as g, getCssRulesForSentimentTag as h };

