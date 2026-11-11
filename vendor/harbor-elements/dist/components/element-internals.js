/**
 * Attaches form internals when the host is in a supported custom-element
 * context. Some third-party containers temporarily construct elements outside
 * their registered custom-element context, which Chrome rejects with a
 * NotSupportedError.
 */
function attachElementInternals(host) {
    if (typeof host.attachInternals !== "function") {
        return undefined;
    }
    try {
        return host.attachInternals();
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            error.name === "NotSupportedError") {
            return undefined;
        }
        throw error;
    }
}

export { attachElementInternals as a };

