import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const RelativeTime = /*@__PURE__*/ proxyCustomElement(class RelativeTime extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.isoTime = "";
        this.relativeTime = "";
        this.titleTime = "";
        this.date = undefined;
        this.locale = undefined;
        this.format = "long";
        this.numeric = "auto";
        this.sync = false;
    }
    connectedCallback() {
        this.updateTime();
    }
    disconnectedCallback() {
        clearTimeout(this.updateTimeout);
    }
    updateTime() {
        const now = new Date();
        const date = new Date(this.date);
        // Check for an invalid date
        if (Number.isNaN(date.getMilliseconds())) {
            this.relativeTime = "";
            this.isoTime = "";
            return;
        }
        const diff = +date - +now;
        const availableUnits = [
            { max: 2760000, value: 60000, unit: "minute" }, // max 46 minutes
            { max: 72000000, value: 3600000, unit: "hour" }, // max 20 hours
            { max: 518400000, value: 86400000, unit: "day" }, // max 6 days
            { max: 2419200000, value: 604800000, unit: "week" }, // max 28 days
            { max: 28512000000, value: 2592000000, unit: "month" }, // max 11 months
            { max: Infinity, value: 31536000000, unit: "year" },
        ];
        const { unit, value } = availableUnits.find((unit) => Math.abs(diff) < unit.max);
        this.isoTime = date.toISOString();
        this.titleTime = new Intl.DateTimeFormat(this.locale, {
            month: "long",
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "short",
        }).format(date);
        // @ts-ignore - https://github.com/microsoft/TypeScript/issues/29129
        this.relativeTime = new Intl.RelativeTimeFormat(this.locale, {
            numeric: this.numeric,
            style: this.format,
            // @ts-ignore
        }).format(Math.round(diff / value), unit);
        // If sync is enabled, update as time passes
        clearTimeout(this.updateTimeout);
        if (this.sync) {
            // Calculates the number of milliseconds until the next respective unit changes. This ensures that all components
            // update at the same time which is less distracting than updating independently.
            const getTimeUntilNextUnit = (unit) => {
                const units = {
                    second: 1000,
                    minute: 60000,
                    hour: 3600000,
                    day: 86400000,
                };
                const value = units[unit];
                return value - (now.getTime() % value);
            };
            let nextInterval;
            // NOTE: this could be optimized to determine when the next update should actually occur, but the size and cost of
            // that logic probably isn't worth the performance benefit
            if (unit === "minute") {
                nextInterval = getTimeUntilNextUnit("second");
            }
            else if (unit === "hour") {
                nextInterval = getTimeUntilNextUnit("minute");
            }
            else if (unit === "day") {
                nextInterval = getTimeUntilNextUnit("hour");
            }
            else {
                // Cap updates at once per day. It's unlikely a user will reach this value, plus setTimeout has a limit on the
                // value it can accept. https://stackoverflow.com/a/3468650/567486
                nextInterval = getTimeUntilNextUnit("day"); // next day
            }
            this.updateTimeout = setTimeout(() => this.updateTime(), nextInterval);
        }
    }
    render() {
        return (h("time", { key: 'ce9f6b24981dd9501071770a6543093a9fcfb23b', dateTime: this.isoTime, title: this.titleTime }, this.relativeTime));
    }
    static get watchers() { return {
        "date": ["updateTime"],
        "locale": ["updateTime"],
        "format": ["updateTime"],
        "numeric": ["updateTime"],
        "sync": ["updateTime"]
    }; }
}, [1, "hbr-relative-time", {
        "date": [1],
        "locale": [1],
        "format": [1],
        "numeric": [1],
        "sync": [4],
        "isoTime": [32],
        "relativeTime": [32],
        "titleTime": [32]
    }, undefined, {
        "date": ["updateTime"],
        "locale": ["updateTime"],
        "format": ["updateTime"],
        "numeric": ["updateTime"],
        "sync": ["updateTime"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-relative-time"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-relative-time":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, RelativeTime);
            }
            break;
    } });
}

const HbrRelativeTime = RelativeTime;
const defineCustomElement = defineCustomElement$1;

export { HbrRelativeTime, defineCustomElement };

