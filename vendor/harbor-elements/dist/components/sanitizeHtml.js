let sanitizeFn;
let sanitizePromise;
const getSanitize = async () => {
    if (!sanitizePromise) {
        sanitizePromise = import('./purify.js').then(function (n) { return n.p; }).then(({ default: DOMPurify }) => {
            sanitizeFn = DOMPurify.sanitize;
            return DOMPurify.sanitize;
        });
    }
    return sanitizePromise;
};
const sanitizeMarkup = (sanitize, markup) => sanitize(String(markup !== null && markup !== void 0 ? markup : ""), { USE_PROFILES: { html: true, svg: true } });
const preloadSanitizeHtml = async () => {
    await getSanitize();
};
const sanitizeHtml = async (markup) => sanitizeMarkup(await getSanitize(), markup);
const sanitizeHtmlSync = (markup) => {
    if (!sanitizeFn) {
        throw new Error("sanitizeHtmlSync called before preloadSanitizeHtml");
    }
    return sanitizeMarkup(sanitizeFn, markup);
};

export { sanitizeHtmlSync as a, preloadSanitizeHtml as p, sanitizeHtml as s };

