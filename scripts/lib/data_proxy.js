function getData(target) {
    let data = target.getDynamicProperty("filmcamera_data");
    if (data == "") data = {};
    else data = JSON.parse(data);
    return new Proxy(data, {
        set: function(source, prop, value) {
            source = getData(target);
            source[prop] = value;
            target.setDynamicProperty("filmcamera_data", JSON.stringify(source));
        }
    });
}