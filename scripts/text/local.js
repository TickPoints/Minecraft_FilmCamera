function translate(text, ...withData) {
    if (withData) {
        for (var i = 0; i < withData.length; i++) {
            if (typeof withData[i] === "string") continue;
            if (withData[i] === undefined) {
                withData[i] = "";
                continue;
            }
            withData[i] = withData[i].valueof ? withData[i].valueof() : withData.toString();
        }
    }
    return {
        "translate": text,
        "with": withData
    }
}

function raw(text) {
    if (typeof text !== "string") return text;
    if (text[0] === "$") return translate(text.substring(1));
    else return {
        "text": text
    };
}

export {
    translate,
    raw
};