const defaultAnimationRegistry = new Map();
function ensureAnimation(animation) {
    return animation !== null && animation !== void 0 ? animation : { keyframes: [], options: { duration: 0 } };
}
/**
 * Sets a default animation. Components should use the `name.animation` for primary animations and `name.part.animation`
 * for secondary animations, e.g. `dialog.show` and `dialog.overlay.show`. For modifiers, use `drawer.showTop`.
 */
function setDefaultAnimation(animationName, animation) {
    defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}
/** Parses a CSS duration and returns the number of milliseconds. */
function parseDuration(delay) {
    delay = delay.toString().toLowerCase();
    if (delay.indexOf("ms") > -1) {
        return parseFloat(delay);
    }
    if (delay.indexOf("s") > -1) {
        return parseFloat(delay) * 1000;
    }
    return parseFloat(delay);
}
/**
 * Stops all active animations on the target element. Returns a promise that resolves after all animations are canceled.
 */
function stopAnimations(el) {
    return Promise.all(el.getAnimations().map((animation) => {
        return new Promise((resolve) => {
            const handleAnimationEvent = requestAnimationFrame(resolve);
            animation.addEventListener("cancel", () => handleAnimationEvent, {
                once: true,
            });
            animation.addEventListener("finish", () => handleAnimationEvent, {
                once: true,
            });
            animation.cancel();
        });
    }));
}

export { stopAnimations as a, parseDuration as p, setDefaultAnimation as s };

