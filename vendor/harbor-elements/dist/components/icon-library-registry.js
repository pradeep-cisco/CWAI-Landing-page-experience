import { getAssetPath } from '@stencil/core/internal/client';

let registry = [
    {
        name: "hbr-theme-magnetic",
        resolver: (name) => getAssetPath(`./icons/magnetic/svg/${name}.svg`),
        mutator: (svg, staticColors) => {
            /**
             * SVG icons in magnetic folder come with paths that have their own fill and stroke colors
             * But static-colors will not adapt to the theme and mode changes
             * We replace static colors with CSS variables so the colors can be set dynamically
             * two types of props, one with labels and another with numbers
             */
            const payload = { colors: [], secondaryColor: null };
            if (staticColors)
                return payload;
            const elementsWithFillOrStroke = svg.querySelectorAll("[fill], [stroke]");
            let tick = 0;
            let fillTick = 0;
            const labels = {
                "#f0f1f2": "light",
                "#e1e4e8": "weak",
                "#d0d4d9": "weak",
                "#c1c6cc": "weak",
                "#a7adb5": "medium",
                "#8f8f8f": "default",
                "#889099": "default",
                "#7e868f": "default",
                "#6f7680": "strong",
                "#656c75": "strong",
                "#545454": "strong",
                "#000000": "strong",
                "#000": "strong",
                "#1d69cc": "strong",
                // success
                "#d9f4ff": "light",
                "#139beb": "default",
                "#0d8bd4": "default",
                "#9adffc": "weak",
                // success
                "#6dc242": "medium",
                "#53a828": "default",
                "#45991f": "strong",
                // info
                "#e0ccff": "weak",
                "#f3ebff": "light",
                "#d9e7ff": "light",
                "#e3eeff": "light",
                "#a6c4f5": "weak",
                "#5b92f0": "medium",
                "#7565db": "default",
                "#864ae0": "default",
                "#4b24b5": "strong",
                // danger
                "#ffc7c9": "weak",
                "#ffe8e9": "light",
                "#e05843": "default",
                "#cc2d37": "default",
                "#c24632": "strong",
                // warning
                "#faefb9": "light",
                "#fcf5d4": "light",
                "#d5f5f5": "light",
                "#ffeadb": "light",
                "#d9b216": "default",
                "#cc8604": "default",
                "#028e99": "default",
                "#f26722": "default",
                "#bd7202": "strong",
                "#d95a1a": "strong",
                // AI
                "#63fff7": "light",
                "#00bceb": "default",
                "#3b76ea": "strong",
            };
            const foregrounds = ["white", "#464C54", "#F7F7F7"];
            const contrastCssProp = "var(--path-color-contrast, var(--base-icon-in-default, #FFFFFF))";
            Array.from(elementsWithFillOrStroke).forEach((it) => {
                if ((it === null || it === void 0 ? void 0 : it.hasAttribute) &&
                    (it.hasAttribute("fill") || it.hasAttribute("stroke"))) {
                    const fill = it.getAttribute("fill");
                    const stroke = it.getAttribute("stroke");
                    const hasStroke = stroke && stroke !== "none";
                    const hasFill = fill && fill !== "none";
                    // handle stroke
                    if (hasStroke) {
                        const label = labels[stroke.toLowerCase()];
                        if (foregrounds.includes(stroke)) {
                            it.setAttribute("stroke", contrastCssProp);
                        }
                        else if (label) {
                            it.setAttribute("stroke", `var(--path-color-${label}, var(--path-color-${tick}, currentColor))`);
                        }
                        else {
                            it.setAttribute("stroke", `var(--path-color-${tick}, currentColor)`);
                        }
                        payload.colors.push(stroke);
                        tick++;
                        // handle fill when stroke is absent
                    }
                    else if (hasFill) {
                        const label = labels[fill.toLowerCase()];
                        if (foregrounds.includes(fill)) {
                            it.setAttribute("fill", contrastCssProp);
                        }
                        else if (label) {
                            it.setAttribute("fill", `var(--path-color-${label}, var(--path-color-${tick}, currentColor))`);
                        }
                        else {
                            it.setAttribute("fill", `var(--path-color-${tick}, currentColor)`);
                        }
                        payload.colors.push(fill);
                        tick++;
                    }
                    // handle fill when stroke is present
                    if (hasStroke && hasFill) {
                        const label = labels[fill.toLowerCase()];
                        if (foregrounds.includes(fill)) {
                            it.setAttribute("fill", contrastCssProp);
                        }
                        else if (label) {
                            it.setAttribute("fill", `var(--path-color-${label}, var(--path-fill-color-${fillTick}, currentColor))`);
                        }
                        else {
                            it.setAttribute("fill", `var(--path-fill-color-${fillTick}, currentColor)`);
                            fillTick++;
                        }
                        payload.colors.push(fill);
                        tick++;
                    }
                }
            });
            return payload;
        },
    },
    {
        name: "phosphor",
        mutator: (svg, staticColors) => {
            // phosphor svgs seem to have a fill at the svg element
            // and only one path element
            // set fill of svg to none and set the path color to be --path-color-{tick}
            const paths = svg.querySelectorAll("path");
            const payload = { colors: [], secondaryColor: null };
            if (staticColors)
                return payload;
            svg.setAttribute("fill", "none");
            let tick = 0;
            Array.from(paths).forEach((it) => {
                it.setAttribute("fill", `var(--path-color-${tick}, currentColor)`);
                tick++;
            });
            return payload;
        },
    },
    {
        name: "base",
        mutator: (svg, staticColors) => {
            const paths = svg.querySelectorAll("path");
            const payload = { colors: [], secondaryColor: null };
            if (staticColors)
                return payload;
            svg.setAttribute("fill", "none");
            let tick = 0;
            Array.from(paths).forEach((it) => {
                it.setAttribute("fill", `var(--path-color-${tick}, currentColor)`);
                tick++;
            });
            return payload;
        },
    },
    /** Adding this back
     * Even though we do not support cohesion icon by default,
     * we do support cohesion via prop. library = "hbr-theme-cohesion"
     */
    {
        name: "hbr-theme-cohesion",
        resolver: (name) => getAssetPath(`./icons/cohesion/svg/${name}.svg`),
        mutator: (svg) => {
            svg.setAttribute("fill", "currentColor");
            const title = svg.querySelector("title");
            const desc = svg.querySelector("desc");
            title && svg.removeChild(svg.querySelector("title"));
            desc && svg.removeChild(desc);
            const elementsWithFill = svg.querySelectorAll("[fill]");
            const payload = { colors: [], secondaryColor: null };
            let tick = 0;
            Array.from(elementsWithFill).forEach((it) => {
                var _a;
                if ((_a = it === null || it === void 0 ? void 0 : it.hasAttribute) === null || _a === void 0 ? void 0 : _a.call(it, "fill")) {
                    const fill = it.getAttribute("fill");
                    if (it.getAttribute("id") === "secondary-color") {
                        it.setAttribute("fill", "var(--path-secondary-color, currentColor)");
                        payload.secondaryColor = fill;
                    }
                    else {
                        it.setAttribute("fill", `var(--path-color-${tick}, currentColor)`);
                        tick++;
                        payload.colors.push(fill);
                    }
                }
            });
            return payload;
        },
    },
];
let watchedIcons = [];
function watchIcon(icon) {
    watchedIcons.push(icon);
}
function unwatchIcon(icon) {
    watchedIcons = watchedIcons.filter((el) => el !== icon);
}
function getLibrary(name) {
    return registry.filter((lib) => lib.name === name)[0];
}
function registerLibrary(name, resolver, mutator) {
    unregisterLibrary(name);
    registry.push({ name, resolver, mutator });
    // Redraw watched icons
    watchedIcons.map((icon) => {
        if (icon.library === name) {
            icon.redraw();
        }
    });
}
function unregisterLibrary(name) {
    registry = registry.filter((lib) => lib.name !== name);
}

export { unwatchIcon as a, getLibrary as g, registerLibrary as r, unregisterLibrary as u, watchIcon as w };

