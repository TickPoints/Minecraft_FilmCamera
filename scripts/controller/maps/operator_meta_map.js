function parseRGB(text) {
    let rgb = [];
    try {
        if (text[0] === "#") {
            const parts = text.substring(1).match(/.{1,2}/g);
            for (const part of parts) {
                rgb.push(parseInt(part, 16) / 255);
            }
        } else if (text.substring(0, 3) === "P3 ") {
            // P3 colors are supported.
            const parts = text.substring(3).split(/,\s?/);
            for (const part of parts) {
                rgb.push(Number(part));
            }
        } else {
            const parts = text.split(/,\s?/);
            for (const part of parts) {
                rgb.push(parseInt(part) / 255);
            }
        }
    } catch {
        rgb = [1, 1, 1];
    }
    for (const i of rgb) {
        if (isNaN(i) || i === Infinity || i === -Infinity) {
            rgb = [1, 1, 1];
            break;
        }
        if (i < 0 || i > 1) {
            rgb = [1, 1, 1];
            break;
        }
    }
    return {
        red: rgb[0],
        green: rgb[1],
        blue: rgb[2]
    };
}

function parseTime(text) {
    let time = Number(text);
    if (isNaN(time) || time === Infinity || time === -Infinity || time < 0) {
        time = 1;
    }
    return time;
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
            ],
            ["#divider"],
            [
                "toggle",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.use_time_toggle.name",
                false
            ],
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.fadeInTime",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.placeholder"
            ],
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.fadeOutTime",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.placeholder"
            ],
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.holdTime",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.camera-fade.time_input.placeholder"
            ]
        ],
        func: function (player, result, frame) {
            const fadeCameraOptions = {};
            if (result[0]) {
                fadeCameraOptions.fadeColor = parseRGB(result[1]);
            }
            if (result[2]) {
                fadeCameraOptions.fadeTime = {
                    fadeInTime: parseTime(result[3]),
                    fadeOutTime: parseTime(result[4]),
                    holdTime: parseTime(result[5])
                };
            }
            frame.args[0] = fadeCameraOptions;
        }
    },
    "inputpermission-movement": {
        ui: [
            [
                "toggle",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.inputpermission-movement.toggle.name"
            ]
        ],
        func: function (player, result, frame) {
            frame.args[0] = result[0];
        }
    },
    "inputpermission-camera": {
        ui: [
            [
                "toggle",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.inputpermission-camera.toggle.name"
            ]
        ],
        func: function (player, result, frame) {
            frame.args[0] = result[0];
        }
    },
    "player-runMinecraftCommand": {
        ui: [
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.player-runMinecraftCommand.input.name",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.player-runMinecraftCommand.input.placeholder"
            ]
        ],
        func: function (player, result, frame) {
            frame.args[0] = result[0];
        }
    },
    "time-waitTicks": {
        ui: [
            [
                "textField",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.time-waitTicks.input.name",
                "$filmcamera.scripts.ui.new.editor_working_edit_args.meta.time-waitTicks.input.placeholder"
            ]
        ],
        func: function (player, result, frame) {
            frame.args[0] = parseTime(result[0]);
        }
    },
    "debug-throwError": {
        ui: [["textField", "ErrorName", "Enter Error"]],
        func: function (player, result, frame) {
            frame.args[0] = result[0];
        }
    }
};
