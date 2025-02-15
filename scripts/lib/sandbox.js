const AsyncFunction = async function () {}.constructor;

function sandbox(code, localScope) {
    localScope.sandboxResult = null;
    // DEBUG:
    // console.warn(`with(this) {try {${code}} catch(e) {console.error("An error occurred during definition:", e, e.stack);}\nreturn sandboxResult;}`);
    try {
        const func = new AsyncFunction(
            `with(this) {try {${code}} catch(e) {console.error("An error occurred during definition:", e, e.stack);}\nreturn sandboxResult;}`
        );
        const result = func.call(localScope);
        return result;
    } catch (e) {
        console.error(
            "An error occurred during sandbox execution:",
            e,
            e.stack
        );
        return e;
    }
}

export { sandbox };
