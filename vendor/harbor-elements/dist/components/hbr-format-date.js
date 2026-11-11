import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const importTimeZones = () => import('./timeZones.js');
function createTimeZonesLoader(importer = importTimeZones) {
    let timeZonesPromise;
    return async () => {
        if (!timeZonesPromise) {
            timeZonesPromise = importer().then(({ default: timeZones }) => timeZones);
        }
        try {
            return await timeZonesPromise;
        }
        catch (error) {
            timeZonesPromise = undefined;
            throw error;
        }
    };
}
const loadTimeZones = createTimeZonesLoader();

const FormatDate = /*@__PURE__*/ proxyCustomElement(class FormatDate extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.date = new Date();
        this.locale = undefined;
        this.weekday = undefined;
        this.era = undefined;
        this.year = undefined;
        this.month = undefined;
        this.day = undefined;
        this.hour = undefined;
        this.minute = undefined;
        this.second = undefined;
        this.timeZoneName = undefined;
        this.timeZone = undefined;
        this.hourFormat = "auto";
    }
    /** Deprecated, import timezones directly from utils */
    async getTimeZones() {
        return loadTimeZones();
    }
    render() {
        const date = new Date(this.date);
        let hour12 = {};
        if (this.hourFormat !== "auto") {
            hour12 = {
                hour12: this.hourFormat === "12" ? true : false,
            };
        }
        // Check for an invalid date
        if (Number.isNaN(date.getMilliseconds())) {
            return;
        }
        return new Intl.DateTimeFormat(this.locale, Object.assign({ weekday: this.weekday, era: this.era, year: this.year, month: this.month, day: this.day, hour: this.hour, minute: this.minute, second: this.second, timeZoneName: this.timeZoneName, timeZone: this.timeZone }, hour12)).format(date);
    }
}, [1, "hbr-format-date", {
        "date": [1],
        "locale": [1],
        "weekday": [1],
        "era": [1],
        "year": [1],
        "month": [1],
        "day": [1],
        "hour": [1],
        "minute": [1],
        "second": [1],
        "timeZoneName": [1, "time-zone-name"],
        "timeZone": [1, "time-zone"],
        "hourFormat": [1, "hour-format"],
        "getTimeZones": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-format-date"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-format-date":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, FormatDate);
            }
            break;
    } });
}

const HbrFormatDate = FormatDate;
const defineCustomElement = defineCustomElement$1;

export { HbrFormatDate, defineCustomElement };

