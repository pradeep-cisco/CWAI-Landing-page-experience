let floatingUiPromise;
const loadFloatingUi = () => {
    if (!floatingUiPromise) {
        floatingUiPromise = import('./floating-ui.dom.esm.js');
    }
    return floatingUiPromise;
};

export { loadFloatingUi as l };

