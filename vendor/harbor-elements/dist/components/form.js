/*
 * Predefined common validity states.
 * All of them are read-only.
 */
// A validity state object that represents `valid`
const validValidityState = Object.freeze({
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
});
// A validity state object that represents `value missing`
const valueMissingValidityState = Object.freeze(Object.assign(Object.assign({}, validValidityState), { valid: false, valueMissing: true }));
// A validity state object that represents a custom error
const customErrorValidityState = Object.freeze(Object.assign(Object.assign({}, validValidityState), { valid: false, customError: true }));
/**
 * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
 * the host element immediately, i.e. before Lit updates the component in the next update.
 */
function setValidity(isValid, host, userInteractedControls) {
    const hasInteracted = Boolean(userInteractedControls === null || userInteractedControls === void 0 ? void 0 : userInteractedControls.has(host));
    const required = Boolean(host.required);
    //
    // We're mapping the following "states" to data attributes. In the future, we can use ElementInternals.states to
    // create a similar mapping, but instead of [data-invalid] it will look like :--invalid.
    //
    // See this RFC for more details: https://github.com/shoelace-style/shoelace/issues/1011
    //
    host.toggleAttribute("data-required", required);
    host.toggleAttribute("data-optional", !required);
    host.toggleAttribute("data-invalid", !isValid);
    host.toggleAttribute("data-valid", isValid);
    host.toggleAttribute("data-user-invalid", !isValid && hasInteracted);
    host.toggleAttribute("data-user-valid", isValid && hasInteracted);
}
/**
 * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
 * that affects constraint validation changes so the component receives the correct validity states.
 */
function updateValidity(host) {
    host.validity && setValidity(host.validity.valid, host);
}
/**
 * Dispatches a non-bubbling, cancelable custom event of type `sl-invalid`.
 * If the `sl-invalid` event will be cancelled then the original `invalid`
 * event (which may have been passed as argument) will also be cancelled.
 * If no original `invalid` event has been passed then the `sl-invalid`
 * event will be cancelled before being dispatched.
 */
function emitInvalidEvent(originalInvalidEvent) {
    const hbrInvalidEvent = new CustomEvent("hbr-invalid", {
        bubbles: false,
        composed: false,
        cancelable: true,
        detail: {},
    });
    if (!originalInvalidEvent) {
        hbrInvalidEvent.preventDefault();
    }
    if (!this.host.dispatchEvent(hbrInvalidEvent)) {
        originalInvalidEvent === null || originalInvalidEvent === void 0 ? void 0 : originalInvalidEvent.preventDefault();
    }
}

export { validValidityState as a, customErrorValidityState as c, emitInvalidEvent as e, setValidity as s, updateValidity as u, valueMissingValidityState as v };

