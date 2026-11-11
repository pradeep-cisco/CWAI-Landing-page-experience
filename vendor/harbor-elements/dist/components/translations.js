const browserLanguage = () => {
    if (typeof window === "undefined" ||
        typeof window.navigator === "undefined") {
        return undefined;
    }
    let browserLang = window.navigator.languages && window.navigator.languages.length > 0
        ? window.navigator.languages[0]
        : null;
    // @ts-ignore
    browserLang =
        browserLang ||
            window.navigator.language ||
            window.navigator.browserLanguage ||
            window.navigator.userLanguage;
    if (typeof browserLang === "undefined") {
        return undefined;
    }
    if (browserLang.indexOf("-") !== -1) {
        browserLang = browserLang.split("-")[0];
    }
    if (browserLang.indexOf("_") !== -1) {
        browserLang = browserLang.split("_")[0];
    }
    return browserLang;
};

//https://levelup.gitconnected.com/stencil-component-translations-4efc44018b1d
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "ko", "ja", "zh"];
const browserLang = browserLanguage();
const internationalization = (translations, key, customLang) => {
    const lang = customLang || browserLang;
    return translations[lang !== undefined && SUPPORTED_LANGUAGES.includes(lang)
        ? lang
        : DEFAULT_LANGUAGE][key];
};

export { browserLanguage as b, internationalization as i };

