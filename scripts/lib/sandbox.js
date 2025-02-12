const AsyncFunction = async function () {}.constructor;

function sandbox(code, localScope) {
  localScope.sandboxResult = null;
  try {
    const func = new AsyncFunction(
      "with(this) {" + code + "\nreturn sandboxResult; }",
    );
    const result = func.call(localScope);
    return result;
  } catch (e) {
    console.error("An error occurred during sandbox execution:", e, e.stack);
    return e;
  }
}

export { sandbox };
