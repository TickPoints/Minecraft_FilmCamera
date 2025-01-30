function deepCopy(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key]);
        }
    }
    return newObj;
}

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
}