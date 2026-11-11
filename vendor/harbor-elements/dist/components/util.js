const regex24 = /^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]?|([0-5][0-9]))$/;
const regex12 = /^((0?[0-9]|1[0-2]):(0?[0-9]?|([0-5][0-9])))$/;
const regex12Zero = /^(?!0{1,2}:)\d{1,2}:/;
const regex24Second = /^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]?|([0-5][0-9])):(0?[0-9]?|([0-5][0-9]))$/;
const regex12Second = /^((0?[0-9]|1[0-2]):(0?[0-9]?|([0-5][0-9])):(0?[0-9]?|([0-5][0-9])))$/;
const regexNumber = /^[0-9]*$/;
const INVALID_DATE = "Invalid Date";
const getRegex12 = (sec, str) => sec ? regex12Second.test(str) : regex12.test(str);
const getRegex24 = (sec, str) => sec ? regex24Second.test(str) : regex24.test(str);
function isValidInput(str, format, second) {
    return format === "12"
        ? getRegex12(second, str) && regex12Zero.test(str)
        : getRegex24(second, str);
}
const isTimeInRange = (hour, min, format = "12") => {
    return isValidHour(hour, format) && isValidMinOrSec(min);
};
const isNumber = (value) => regexNumber.test(value);
const isValidHour = (hour, format = "12") => format === "12" ? hour >= 1 && hour <= 12 : hour >= 0 && hour <= 23;
const isValidMinOrSec = (min) => min >= 0 && min <= 59;
const isPM = (hour) => hour >= 12;
const isEmpty = (value) => value === null ||
    value === "null" ||
    value === undefined ||
    value === "undefined" ||
    value === "";
const hasColon = (value, second) => second
    ? value && typeof value === "string" && value.includes(":")
    : value &&
        typeof value === "string" &&
        value.includes(":") &&
        value.indexOf(":") === value.lastIndexOf(":");
const isInput = (value) => (value === null || value === void 0 ? void 0 : value.tagName) === "HBR-INPUT";
const isValidDate = (value) => value && new Date(value).toString() !== INVALID_DATE;
const formatInput = (self) => {
    return formatInputPopover(self).value;
};
const getHourMinSecFromInput = (value, format, second) => {
    // TODO: rename this fuc
    let returnValue = {};
    if (hasColon(value, second)) {
        const [hourStr, minStr, secStr] = value.split(":");
        if (!hourStr || !minStr || !isNumber(hourStr) || !isNumber(minStr))
            return returnValue;
        const hour = parseInt(hourStr, 10);
        const min = parseInt(minStr, 10);
        const sec = second && secStr ? parseInt(secStr, 10) : undefined;
        returnValue = isTimeInRange(hour, min, format)
            ? { hour, min, sec }
            : returnValue;
    }
    return returnValue;
};
const autoFillInputValue = (_value, format, second) => {
    let value = _value;
    if (value && !hasColon(value, second) && isValidHour(value, format)) {
        if (second)
            value += ":00:00";
        else
            value += ":00";
    }
    if (hasColon(value, second)) {
        let [hour, min, sec] = value.split(":");
        if (hour && hour.length === 1 && isValidHour(hour, format))
            hour = `0${hour}`;
        if (!min)
            min = "00";
        if (min && min.length === 1 && isValidMinOrSec(min))
            min = min.replace(`${min}`, `0${min}`);
        if (second && !sec)
            sec = "00";
        if (second && sec && sec.length === 1 && isValidMinOrSec(sec))
            sec = `0${sec}`;
        value = second ? [hour, min, sec].join(":") : [hour, min].join(":");
    }
    return value;
};
const getDate = (value, date) => {
    if (isValidDate(value)) {
        const now = new Date(value);
        if (date) {
            const _date = new Date(date);
            _date.setHours(now.getHours(), now.getMinutes());
            return _date;
        }
        return now;
    }
    const now = new Date();
    if (date) {
        const _date = new Date(date);
        _date.setHours(now.getHours());
        _date.setMinutes(now.getMinutes());
        _date.setSeconds(now.getSeconds());
        return _date;
    }
    return now;
};
const getDefaultTime = (i) => (i < 10 ? `0${i}` : `${i}`);
const formatToInputValue = (value, sec, format) => {
    const hour12 = format === "12";
    const second = sec ? { second: "2-digit" } : {};
    const formatted = new Intl.DateTimeFormat("default", Object.assign({ hour12, hour: "2-digit", minute: "2-digit" }, second)).format(value);
    const parts = formatted.split(":");
    if (!hour12 && parts[0] === "24")
        parts[0] = "00";
    if (hour12)
        return parts.join(":").slice(0, -3);
    return parts.join(":");
};
const formatInputPopover = (self, isNow) => {
    const date = getDate(isNow ? false : self.value, self.date);
    if (!isNow) {
        self.hour && date.setHours(Number(self.hour));
        self.min && date.setMinutes(Number(self.min));
        self.second && self.sec && date.setSeconds(Number(self.sec));
    }
    return { date, value: formatToInputValue(date, self.second, self.format) };
};
const getHourMinSec = (value) => {
    if (value === null || value === void 0 ? void 0 : value.includes(":")) {
        const [hour, min, sec] = value.split(":");
        return { hour, min, sec };
    }
};

export { getHourMinSecFromInput as a, getDate as b, isValidDate as c, autoFillInputValue as d, isValidInput as e, formatInputPopover as f, getDefaultTime as g, getHourMinSec as h, isPM as i, isEmpty as j, formatInput as k, formatToInputValue as l, isInput as m };

