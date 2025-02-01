function sandbox(code, localScope) {
    localScope.sandboxResult = null;
    try {
        const func = new Function("with(this) {" + code + "\nreturn sandboxResult; }");
        localScope.sandboxResult = func.call(localScope);
        return localScope.sandboxResult;
    } catch (e) {
        return e;
    }
}

export {
    sandbox
};