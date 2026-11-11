import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { b as getCssRulesForSentiment } from './sentiments.js';
import { a as addConstructedStyle } from './browser.js';
import { a as unwatchIcon, w as watchIcon, g as getLibrary } from './icon-library-registry.js';

function getBootstrapConfig() {
    const metaEl = document.getElementById("hbr-internal__meta");
    if (metaEl) {
        return metaEl["__internal-config"] || {};
    }
    return {};
}

const magneticMeta = [
	"accessibility",
	"admin-color",
	"admin",
	"alerts-info-large-border",
	"alerts-info-large",
	"alerts-info-small-border",
	"alerts-info-small",
	"alerts-negative-circle-small",
	"alerts-negative-large-border",
	"alerts-negative-large",
	"alerts-negative-small-border",
	"alerts-negative-small",
	"alerts-positive-large-border",
	"alerts-positive-large",
	"alerts-positive-small-border",
	"alerts-positive-small",
	"alerts-warning-circle-filled",
	"alerts-warning-circle-small",
	"alerts-warning-large-border",
	"alerts-warning-large",
	"alerts-warning-small-border",
	"alerts-warning-small",
	"arrow-clockwise",
	"arrow-down",
	"arrow-left",
	"arrow-right",
	"arrow-square-out",
	"arrow-u-up-left",
	"arrow-u-up-right",
	"arrow-up",
	"arrows-clockwise",
	"arrows-down-up",
	"arrows-out-simple",
	"avatar-frame",
	"bell-filled",
	"bell",
	"building",
	"buildings",
	"calendar-blank",
	"cameras-color",
	"cameras",
	"caret-double-left",
	"caret-double-right",
	"caret-down",
	"caret-left",
	"caret-line-left",
	"caret-line-right",
	"caret-right",
	"caret-up",
	"caret",
	"cellular-gateway-color",
	"cellular-gateway",
	"check-circle",
	"check-square",
	"check",
	"checkbox-indeterminate-disabled",
	"checkbox-indeterminate",
	"checkbox-selected-disabled",
	"checkbox-selected",
	"checkbox-unselected-disabled",
	"checkbox-unselected",
	"circle-half",
	"cisco",
	"city",
	"clock",
	"cloud",
	"copy",
	"crosshair",
	"custom-icon",
	"device-camera",
	"device-generic-client",
	"device-generic-device",
	"device-generic",
	"device-mr",
	"device-ms",
	"device-mx",
	"device-question",
	"device-uplink",
	"device-web-apps",
	"device-wlc",
	"disabled-circle-small",
	"dormant-circle-small",
	"dots-nine",
	"dots-six",
	"dots-three-vertical",
	"dots-three",
	"download-simple",
	"dropdown-caret-down",
	"dropdown-caret-right",
	"dropdown-caret-up",
	"empty-state",
	"energy-management",
	"envelope-simple",
	"environmental-color",
	"environmental",
	"eye-slash",
	"eye",
	"file-csv",
	"file-dotted",
	"file",
	"firmware-color",
	"firmware",
	"floppy-disk",
	"folder-open",
	"folder",
	"funnel-simple",
	"gear-six-filled",
	"gear-six-outlined",
	"gear-six",
	"gear",
	"globe",
	"idle",
	"illustration-info",
	"illustration-negative",
	"illustration-positive",
	"indicator-complete",
	"indicator-default",
	"indicator-error",
	"indicator-inactive",
	"indicator-progress",
	"info",
	"inherited-settings-broken",
	"inherited-settings",
	"inline-copy",
	"insight-color",
	"insight",
	"inventory-color",
	"inventory",
	"leaf",
	"lens-logo",
	"license-advantage",
	"license-essentials",
	"licensing-color",
	"licensing",
	"lightning-arrow-up",
	"lightning",
	"list-bullets",
	"list",
	"loader-gradient",
	"loader",
	"lock-simple",
	"lock",
	"magic-wand",
	"magnet",
	"magnifying-glass",
	"map-trifold",
	"minus",
	"more-horizontal",
	"nav-2fa",
	"nav-access-management",
	"nav-activities",
	"nav-admin-color",
	"nav-admin",
	"nav-agents",
	"nav-alerts",
	"nav-analytics",
	"nav-applications",
	"nav-assurance",
	"nav-bookmarks",
	"nav-cameras-color",
	"nav-cameras",
	"nav-cellular-gateway-color",
	"nav-cellular-gateway",
	"nav-change-log",
	"nav-change-window-notifications",
	"nav-configuration",
	"nav-connect",
	"nav-context-visibility",
	"nav-create-fabric",
	"nav-cross-org-color",
	"nav-cross-org",
	"nav-design",
	"nav-destinations",
	"nav-documentation",
	"nav-domains",
	"nav-endpoints",
	"nav-enterprise-name",
	"nav-environmental-color",
	"nav-environmental",
	"nav-explore",
	"nav-fabrics",
	"nav-feedback",
	"nav-filters",
	"nav-firewall",
	"nav-firmware-color",
	"nav-firmware",
	"nav-generate-token",
	"nav-global-overview",
	"nav-groups",
	"nav-help",
	"nav-home",
	"nav-identity",
	"nav-indicator",
	"nav-insight-color",
	"nav-insight",
	"nav-integration",
	"nav-intelligence",
	"nav-inventory-color",
	"nav-inventory",
	"nav-investigate",
	"nav-iot",
	"nav-jobs",
	"nav-licensing-color",
	"nav-licensing",
	"nav-list",
	"nav-magnet",
	"nav-maintenance",
	"nav-meraki-insight",
	"nav-mobile-device-security",
	"nav-monitor",
	"nav-multicloud",
	"nav-network-color",
	"nav-network-devices",
	"nav-network-switcher",
	"nav-network-wide-color",
	"nav-network-wide",
	"nav-network",
	"nav-non-cisco-hosted-fabrics",
	"nav-objects",
	"nav-operations",
	"nav-organization-color",
	"nav-organization-section-color",
	"nav-organization-section",
	"nav-organization-switcher",
	"nav-organization",
	"nav-outbreak-control",
	"nav-overview-color",
	"nav-overview",
	"nav-placeholder",
	"nav-policies",
	"nav-predictive-networks",
	"nav-provisioning",
	"nav-remote-sessions",
	"nav-reports",
	"nav-resources",
	"nav-roles-and-permissions",
	"nav-samples",
	"nav-secure-connect-color",
	"nav-secure-connect",
	"nav-security-color",
	"nav-security",
	"nav-sensors",
	"nav-servers",
	"nav-service-switcher",
	"nav-settings",
	"nav-sites",
	"nav-software",
	"nav-sso",
	"nav-submit",
	"nav-subscriptions",
	"nav-suite",
	"nav-switching-color",
	"nav-switching",
	"nav-systems-manager-color",
	"nav-systems-manager",
	"nav-tags",
	"nav-teleworker-gateway-color",
	"nav-teleworker-gateway",
	"nav-threats",
	"nav-tools",
	"nav-topology",
	"nav-uplink-color",
	"nav-uplink",
	"nav-users",
	"nav-views",
	"nav-vpn",
	"nav-wireless-color",
	"nav-wireless",
	"nav-workflows",
	"nav",
	"navigation-color",
	"navigation",
	"network-color",
	"network",
	"networkwide-color",
	"networkwide",
	"new-chat-gradient",
	"new-chat",
	"organization-color",
	"organization",
	"outdoor",
	"overview-color",
	"overview",
	"paint-brush-household",
	"paper-plane-right",
	"paperclip",
	"passthrough",
	"pencil-simple",
	"phosphor-checkbox-checked",
	"phosphor-checkbox-square",
	"phosphor-circle",
	"phosphor-lock-simple",
	"phosphor-radio-button-duotone",
	"placeholder",
	"plug-small",
	"plus",
	"port-eth-bg",
	"port-eth",
	"port-power",
	"port-sfp-bg",
	"port-sfp",
	"port-stack-bg",
	"port-stack",
	"printer",
	"processing",
	"prohibit-inset",
	"prohibit",
	"push-pin-simple-fill",
	"push-pin-simple",
	"question-filled",
	"question",
	"radio-button-default",
	"radio-button-indeterminate",
	"radio-button-selected",
	"refresh",
	"remove",
	"rocket",
	"security-color",
	"security",
	"share",
	"sign-out",
	"sort-down",
	"sort-up",
	"sort",
	"squares-four",
	"stack-port",
	"stack-simple",
	"stack",
	"star-fill",
	"star-filled",
	"star",
	"status-critical-bg",
	"status-critical",
	"status-deny-false",
	"status-deny",
	"status-disabled-bg",
	"status-disabled",
	"status-dormant-bg",
	"status-dormant",
	"status-excellent-bg",
	"status-excellent-fg",
	"status-excellent",
	"status-general-disabled",
	"status-general-dormant-bg",
	"status-general-dormant",
	"status-general-info-bg",
	"status-general-info",
	"status-general-needs-attention-bg",
	"status-general-needs-attention",
	"status-in-progress-bg",
	"status-in-progress-fg",
	"status-in-progress",
	"status-info-bg",
	"status-info-square-bg",
	"status-info-square-fg",
	"status-info-square",
	"status-info",
	"status-low-warning-bg",
	"status-low-warning-fg",
	"status-low-warning",
	"status-needs-attention-bg",
	"status-needs-attention-fg",
	"status-needs-attention",
	"status-negative-bg",
	"status-negative-fg",
	"status-negative",
	"status-ok-bg",
	"status-ok-fg",
	"status-ok",
	"status-policy-accept",
	"status-policy-deny",
	"status-positive-bg",
	"status-positive-fg",
	"status-positive",
	"status-severe-warning-bg",
	"status-severe-warning-fg",
	"status-severe-warning",
	"status-warning-bg",
	"status-warning-fg",
	"status-warning",
	"switch-color",
	"switch",
	"systemsmanager-color",
	"systemsmanager",
	"tag",
	"terminal-window",
	"thread",
	"thumbs-down",
	"thumbs-up",
	"toggle-checkmark",
	"trash-simple",
	"trash",
	"tree-view",
	"trend-down",
	"trend-up",
	"upload-simple",
	"user-filled",
	"user",
	"users",
	"variable-view",
	"view-card-view",
	"view-docked",
	"view-floating",
	"view-full",
	"view-new-tab",
	"view-split-view",
	"warning-octagon-bold",
	"warning-octagon-fill",
	"wifi-high",
	"wifi-lightning",
	"wifi-low",
	"wifi-medium",
	"wifi-none",
	"wifi-slash",
	"wifi-x",
	"wireless-color",
	"wireless",
	"x-circle",
	"x",
	"xcircle"
];

/* Make sure iconsMap key never matches any magnetic/cohesion value */
const iconsMap = {
    "hbr-delete-content": {
        "hbr-theme-cohesion": "remove-circle",
        "hbr-theme-magnetic": "x-circle",
        "hbr-theme-cohesion-v1": "backspace",
    },
    "hbr-password-hide": {
        "hbr-theme-cohesion": "hide",
        "hbr-theme-magnetic": "eye-slash",
        "hbr-theme-cohesion-v1": "hide",
    },
    "hbr-password-show": {
        "hbr-theme-cohesion": "view",
        "hbr-theme-magnetic": "eye",
        "hbr-theme-cohesion-v1": "view",
    },
    "hbr-radio-button-default": {
        "hbr-theme-cohesion": "radio-button-default",
        "hbr-theme-cohesion-v1": "radio-button-default",
        "hbr-theme-magnetic": "radio-button-default",
    },
    "hbr-radio-button-selected": {
        "hbr-theme-cohesion": "radio-button-selected",
        "hbr-theme-cohesion-v1": "radio-button-selected",
        "hbr-theme-magnetic": "radio-button-selected",
    },
    "hbr-radio-button-indeterminate": {
        "hbr-theme-cohesion": "radio-button-indeterminate",
        "hbr-theme-cohesion-v1": "radio-button-indeterminate",
        "hbr-theme-magnetic": "radio-button-indeterminate",
    },
    "hbr-select-arrow-down": {
        "hbr-theme-cohesion": "arrow-down",
        "hbr-theme-cohesion-v1": "arrow-down",
        "hbr-theme-magnetic": "caret-down",
    },
    "hbr-checkbox-checked": {
        "hbr-theme-magnetic": "checkbox-selected",
        "hbr-theme-cohesion": "checkbox-selected",
        "hbr-theme-cohesion-v1": "checkbox-selected",
    },
    "hbr-checkbox-default": {
        "hbr-theme-magnetic": "checkbox-unselected",
        "hbr-theme-cohesion": "checkbox-default",
        "hbr-theme-cohesion-v1": "checkbox-default",
    },
    "hbr-checkbox-indeterminate": {
        "hbr-theme-magnetic": "checkbox-indeterminate",
        "hbr-theme-cohesion": "checkbox-indeterminate",
        "hbr-theme-cohesion-v1": "checkbox-indeterminate",
    },
    "hbr-arrow-right": {
        "hbr-theme-magnetic": "caret-right",
        "hbr-theme-cohesion": "arrow-right",
        "hbr-theme-cohesion-v1": "arrow-right",
    },
    "hbr-arrow-left": {
        "hbr-theme-magnetic": "caret-left",
        "hbr-theme-cohesion": "arrow-left",
        "hbr-theme-cohesion-v1": "arrow-left",
    },
    "hbr-accordion-trigger": {
        "hbr-theme-magnetic": "caret-down",
        "hbr-theme-cohesion": "arrow-left",
        "hbr-theme-cohesion-v1": "arrow-left",
    },
    "hbr-date-prev-month": {
        "hbr-theme-magnetic": "caret-left",
        "hbr-theme-cohesion": "arrow-left",
        "hbr-theme-cohesion-v1": "arrow-left",
    },
    "hbr-date-next-month": {
        "hbr-theme-magnetic": "caret-right",
        "hbr-theme-cohesion": "arrow-right",
        "hbr-theme-cohesion-v1": "arrow-right",
    },
    "hbr-date-prev-year": {
        "hbr-theme-magnetic": "caret-double-left",
        "hbr-theme-cohesion": "arrow-left",
        "hbr-theme-cohesion-v1": "arrow-left",
    },
    "hbr-date-next-year": {
        "hbr-theme-magnetic": "caret-double-right",
        "hbr-theme-cohesion": "arrow-right",
        "hbr-theme-cohesion-v1": "arrow-right",
    },
    "hbr-date-month-arrow": {
        "hbr-theme-magnetic": "caret-left",
        "hbr-theme-cohesion": "arrow-down",
        "hbr-theme-cohesion-v1": "arrow-down",
    },
    "hbr-date-year-arrow": {
        "hbr-theme-magnetic": "caret-right",
        "hbr-theme-cohesion": "arrow-down",
        "hbr-theme-cohesion-v1": "arrow-down",
    },
    "hbr-calendar": {
        "hbr-theme-magnetic": "calendar-blank",
        "hbr-theme-cohesion": "calendar",
        "hbr-theme-cohesion-v1": "calendar",
    },
    "hbr-breadcrumb-separator": {
        "hbr-theme-magnetic": "caret-right",
        "hbr-theme-cohesion": "slash",
        "hbr-theme-cohesion-v1": "slash",
    },
    "hbr-warning-filled": {
        "hbr-theme-magnetic": "alerts-warning-large",
        "hbr-theme-cohesion": "warning-filled",
        "hbr-theme-cohesion-v1": "warning-filled",
    },
    "hbr-info-filled": {
        "hbr-theme-magnetic": "alerts-info-large",
        "hbr-theme-cohesion": "info-filled",
        "hbr-theme-cohesion-v1": "info-filled",
    },
    "hbr-success-filled": {
        "hbr-theme-magnetic": "alerts-positive-large",
        "hbr-theme-cohesion": "success-filled",
        "hbr-theme-cohesion-v1": "success-filled",
    },
    "hbr-error-filled": {
        "hbr-theme-magnetic": "alerts-negative-large",
        "hbr-theme-cohesion": "error-filled",
        "hbr-theme-cohesion-v1": "error-filled",
    },
    "hbr-warning-circle-filled": {
        "hbr-theme-magnetic": "alerts-warning-circle-filled",
        "hbr-theme-cohesion": "warning-filled",
        "hbr-theme-cohesion-v1": "warning-illustration",
    },
    "hbr-warning-toast": {
        "hbr-theme-magnetic": "alerts-warning-large",
        "hbr-theme-cohesion": "warning-filled",
        "hbr-theme-cohesion-v1": "warning-illustration",
    },
    "hbr-info-toast": {
        "hbr-theme-magnetic": "alerts-info-large",
        "hbr-theme-cohesion": "info-filled",
        "hbr-theme-cohesion-v1": "info-illustration",
    },
    "hbr-success-toast": {
        "hbr-theme-magnetic": "alerts-positive-large",
        "hbr-theme-cohesion": "success-filled",
        "hbr-theme-cohesion-v1": "success-illustration",
    },
    "hbr-danger-toast": {
        "hbr-theme-magnetic": "alerts-negative-large",
        "hbr-theme-cohesion": "error-filled",
        "hbr-theme-cohesion-v1": "error-filled",
    },
    "hbr-settings": {
        "hbr-theme-magnetic": "gear-six-outlined",
        "hbr-theme-cohesion": "settings_18",
    },
    "hbr-empty-state": {
        "hbr-theme-magnetic": "empty-state",
        "hbr-theme-cohesion": "empty-state",
        "hbr-theme-cohesion-v1": "empty-state",
    },
};

const iconFiles = new Map();
const requestIcon = (url, options) => {
    if (iconFiles.has(url)) {
        return iconFiles.get(url);
    }
    const request = fetch(url, options).then(async (response) => {
        if (response.ok) {
            const div = document.createElement("div");
            div.innerHTML = await response.text();
            const svg = div.firstElementChild;
            return {
                ok: response.ok,
                status: response.status,
                svg: svg && svg.tagName.toLowerCase() === "svg" ? svg.outerHTML : "",
            };
        }
        return {
            ok: response.ok,
            status: response.status,
            svg: null,
        };
    });
    iconFiles.set(url, request);
    return request;
};

const iconCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{display:inline-block;width:1em;height:1em;contain:strict;box-sizing:content-box !important;--focus-border-radius:var(--hbr-border-radius-circle);--path-color-contrast:var(--base-icon-in-default)}:host(:focus){outline:none}:host(:focus-visible){outline:var(--hbr-focus-outline);box-shadow:var(--hbr-focus-ring);outline-offset:var(--hbr-focus-ring-width);border-radius:var(--focus-border-radius)}.hbr_css--icon,svg{display:block;height:100%;width:100%}";
const HbrIconStyle0 = iconCss;

const parser = new DOMParser();
const Icon = /*@__PURE__*/ proxyCustomElement(class Icon extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrLoad = createEvent(this, "hbr-load", 7);
        this.hbrError = createEvent(this, "hbr-error", 7);
        this.sheet = new CSSStyleSheet();
        this.defaultColors = [];
        this.defaultSecondaryColor = "";
        this.getPathSecondaryColor = (holder) => {
            if (this.defaultSecondaryColor) {
                const cascadingSecColorProperty = getComputedStyle(holder).getPropertyValue("--path-secondary-color");
                const secondaryColor = !cascadingSecColorProperty && this.defaultSecondaryColor
                    ? this.defaultSecondaryColor
                    : null;
                if (secondaryColor) {
                    holder.style.setProperty("--path-secondary-color", secondaryColor);
                }
            }
        };
        this.svg = undefined;
        this.asset = undefined;
        this.src = undefined;
        this.fetchOptions = {};
        this.name = undefined;
        this.size = undefined;
        this.width = undefined;
        this.height = undefined;
        this.label = undefined;
        this.colors = undefined;
        this.sentiment = undefined;
        this.library = "hbr-theme-magnetic";
        this.staticColors = false;
    }
    handleChange() {
        this.setIcon();
    }
    handleLabelChange() {
        this.setA11y();
    }
    connectedCallback() {
        watchIcon(this.host);
        this.setIcon();
        this.setA11y();
    }
    componentDidLoad() {
        this.setIcon();
    }
    componentDidRender() {
        this.setCssProperties();
    }
    disconnectedCallback() {
        unwatchIcon(this.host);
    }
    /** @internal Fetches the icon and redraws it. Used to handle library registrations. */
    async redraw() {
        this.setIcon();
    }
    setA11y() {
        const hasLabel = typeof this.label === "string" && this.label.length > 0;
        if (hasLabel) {
            this.host.setAttribute("role", "img");
            this.host.setAttribute("aria-label", this.label);
            this.host.removeAttribute("aria-hidden");
        }
        else {
            this.host.removeAttribute("role");
            this.host.removeAttribute("aria-label");
            this.host.setAttribute("aria-hidden", "true");
        }
    }
    verifyMap() {
        let name = "";
        if (iconsMap[this.name] && iconsMap[this.name][this.library]) {
            name = iconsMap[this.name][this.library];
        }
        else if (iconsMap[this.name] && !iconsMap[this.name][this.library]) {
            name = null;
        }
        else {
            name = this.name;
        }
        return name;
    }
    resolveIcon(registry, name) {
        return registry.resolver(name);
    }
    async setIcon() {
        var _a;
        const library = getLibrary(this.library);
        if (this.asset) {
            this.getFile(library, {
                ok: true,
                svg: typeof this.asset === "function" ? this.asset() : this.asset,
            });
            return;
        }
        let url = this.src;
        if (this.name && library) {
            //Check icon map.
            const _name = this.verifyMap();
            // resolve svg URL only when a src is not available
            if (_name && typeof url !== "string") {
                const iconAssetPath = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.iconAssetPath;
                if (iconAssetPath) {
                    url = iconAssetPath + `${this.name}.svg`;
                }
                else {
                    url = this.resolveIcon(library, _name);
                }
            }
            //Check JSON mapping to verify icon name is present
            //Before hitting the network.
            if (this.library === "hbr-theme-magnetic") {
                if (!magneticMeta.includes(_name)) {
                    console.warn(`${_name} not found in current library ${this.library}`);
                    return;
                }
            }
        }
        if (url) {
            try {
                const options = this.fetchOptions;
                const file = await requestIcon(url, options);
                if (file.ok && file.svg) {
                    this.getFile(library, file);
                }
                else {
                    if (this.name) {
                        console.warn(`${this.name} not found in current library ${this.library}`);
                    }
                    else if (this.src) {
                        console.warn("fail to find the external URL of an SVG file ");
                    }
                }
            }
            catch (_b) {
                console.warn(`Error rendering icon file for ${this.name}`);
            }
        }
        else if (this.svg) {
            // If we can't resolve a URL and an icon was previously set, remove it
            this.svg = null;
        }
        else {
            if (this.name) {
                console.warn(`${this.name} not found in current library ${this.library}`);
            }
        }
    }
    getFile(library, file) {
        const doc = parser.parseFromString(file.svg, "text/html");
        const svg = doc.body.querySelector("svg");
        if (svg) {
            if (library === null || library === void 0 ? void 0 : library.mutator) {
                const payload = library.mutator(svg, this.staticColors);
                if (payload) {
                    this.defaultColors = payload.colors;
                    this.defaultSecondaryColor = payload.secondaryColor;
                }
            }
            this.svg = svg.outerHTML;
            this.hbrLoad.emit();
        }
        else {
            this.svg = "";
            this.hbrError.emit({ status: file.status });
        }
    }
    setCssProperties() {
        const holder = this.host.shadowRoot.querySelector(".hbr_css--icon");
        this.getPathSecondaryColor(holder);
        const colors = this.colors ? this.colors : [];
        if (colors === null || colors === void 0 ? void 0 : colors.length) {
            colors.forEach((color, id) => {
                holder.style.setProperty(`--path-color-${id}`, color);
            });
        }
    }
    render() {
        /**
         * Ways of setting size in order of priority
         *  - @prop width: to set a width separate from height
         *  - @prop height: to set a height separate from width
         *  - @prop size: to set symmetrical width and height
         *  - @css font-size: current font-size, inherited from parent
         *  - @css width: to set a width separate from height
         *  - @css height: to set a height separate from height
         *  Logic: the svg file has a 100% width and height and fills its parent
         *  When width, height or size props are set, width and height of the host
         *  are derived from these props and set as inline style, without these
         *  props, width and height of the host is 1em.
         */
        const width = this.width || this.size || null;
        const height = this.height || this.size || null;
        const hostProps = Object.assign({}, (width || height
            ? {
                style: Object.assign(Object.assign({}, (width ? { width } : null)), (height ? { height } : null)),
            }
            : null));
        if (this.sentiment && this.host) {
            this.sheet.replaceSync(`
				:host {
					${getCssRulesForSentiment({
                sentiment: this.sentiment,
                type: "icon",
            })}
				}
			`);
            addConstructedStyle(this.host.shadowRoot, this.sheet);
        }
        return (h(Host, Object.assign({ key: '6ad831d7f3154d888289cc7dc6f9108e343ab28b' }, hostProps), h("div", { key: '32d9cc4f32cd537ef6dd7328a123054fceb9fa6c', part: "base", class: "hbr_css--icon", innerHTML: this.svg })));
    }
    get host() { return this; }
    static get watchers() { return {
        "name": ["handleChange"],
        "src": ["handleChange"],
        "library": ["handleChange"],
        "asset": ["handleChange"],
        "label": ["handleLabelChange"]
    }; }
    static get style() { return HbrIconStyle0; }
}, [1, "hbr-icon", {
        "asset": [1],
        "src": [1],
        "fetchOptions": [16],
        "name": [513],
        "size": [1],
        "width": [1],
        "height": [1],
        "label": [1],
        "colors": [16],
        "sentiment": [513],
        "library": [1025],
        "staticColors": [516, "static-colors"],
        "svg": [32],
        "redraw": [64]
    }, undefined, {
        "name": ["handleChange"],
        "src": ["handleChange"],
        "library": ["handleChange"],
        "asset": ["handleChange"],
        "label": ["handleLabelChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-icon"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, Icon);
            }
            break;
    } });
}

export { Icon as I, defineCustomElement as d, getBootstrapConfig as g };

