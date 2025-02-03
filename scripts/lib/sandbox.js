const AsyncFunction = async function () {}.constructor;

async function sandbox(code, localScope) {
    localScope.sandboxResult = null;
    // Debug:
    // console.warn("with(this) {" + code + "\nreturn sandboxResult; }");
    try {
        const func = new AsyncFunction("with(this) {" + code + "\nreturn sandboxResult; }");
        localScope.sandboxResult = func.call(localScope);
        return localScope.sandboxResult;
    } catch (e) {
        console.error("An error occurred during sandbox execution:", e, e.stack);
        return e;
    }
}

export {
    sandbox
};