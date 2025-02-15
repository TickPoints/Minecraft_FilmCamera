function parseRGB(text) {
    let rgb = [];
    if (text[0] === "#") {
        const parts = text.substring(1).match(/.{1,2}/g);
        for (const prat of parts) rgb.push(parseInt(prat, 16));
    } else {
        const parts = text.split(/,\s?/);
        for (const prat of parts) rgb.push(parseInt(prat));
    }
    return {
        red: rgb[0],
        green: rgb[1],
        blue: rgb[2]
    };
}

export const operator_meta_map = {
    "camera-clear": {
        ui: [
            [
                "textField",
                "This is an operator with no parameters and no content.",
                "Null"
            ]
        ],
        func: function () {}
    },
    "camera-fade": {
        ui: [
            [
                "toggle",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.use_color_toggle.name",
                false
            ],
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.color_input.name",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.color_input.placeholder"
            ]
        ],
        func: function (player, result, frame) {
            const fadeCameraOptions = {};
            if (result[0]) {
                fadeCameraOptions.fadeColor = parseRGB(result[1]);
            }
            frame.args[0] = fadeCameraOptions;
        }
    },
    "inputpermission-movement": {
        ui: [
            [
                "textField",
                "This is an operator with no parameters and no content.",
                "Null"
            ]
        ],
        func: function (player, result) {}
    },
    "inputpermission-camera": {
        ui: [
            [
                "textField",
                "This is an operator with no parameters and no content.",
                "Null"
            ]
        ],
        func: function (player, result) {}
    },
    "player-runMinecraftCommand": {
        ui: [
            [
                "textField",
                "This is an operator with no parameters and no content.",
                "Null"
            ]
        ],
        func: function (player, result) {}
    },
    "time-waitTicks": {
        ui: [
            [
                "textField",
                "This is an operator with no parameters and no content.",
                "Null"
            ]
        ],
        func: function (player, result) {}
    }
};
