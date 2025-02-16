export const operator_map = {
    "camera-clear": function (type) {
        return {
            script: "PlayerCamera.clear();",
            command: "/camera [player] clear"
        }[type];
    },
    "camera-fade": function (type, fadeCameraOptions) {
        return {
            script: `PlayerCamera.fade(${JSON.stringify(fadeCameraOptions)});`,
            command: `/camera [player] fade ${fadeCameraOptions.fadeColor ? `color ${fadeCameraOptions.fadeColor.red * 255} ${fadeCameraOptions.fadeColor.green * 255} ${fadeCameraOptions.fadeColor.blue * 255} ` : ""}${fadeCameraOptions.fadeTime ? `time ${fadeCameraOptions.fadeTime.fadeInTime * 255} ${fadeCameraOptions.fadeTime.fadeInTime.holdTime * 255} ${fadeCameraOptions.fadeTime.fadeOutTime * 255}` : ""}`
        }[type];
    },
    "camera-set_person": function (type, status, easeType = {}) {
        const statusMap = ["minecraft:first_person", "minecraft:third_person", "minecraft:third_person_front"];
        return {
            script: `PlayerCamera.setCamera("${statusMap[status]}", ${JSON.stringify(easeOptions)});`,
            command: `/camera [player] set ${statusMap[status]} ease ${easeOptions.easeTime} ${easeOptions.easeType}`
        }[type];
    },
    "inputpermission-movement": function (type, status) {
        return {
            script: `Player.inputPermissions.setPermissionCategory(2, ${status});`,
            command: `/inputpermission set [player] movement ${status ? "enabled" : "disabled"}`
        }[type];
    },
    "inputpermission-camera": function (type, status) {
        return {
            script: `Player.inputPermissions.setPermissionCategory(1, ${status});`,
            command: `/inputpermission set [player] camera ${status ? "enabled" : "disabled"}`
        }[type];
    },
    "player-runMinecraftCommand": function (type, command) {
        return {
            script: `Player.runCommand("${command}");`,
            command: `/execute as [player] at @s run ${command}`
        }[type];
    },
    "time-waitTicks": function (type, ticks) {
        return {
            script: `await ServerSystem.waitTicks(${ticks});`,
            command: `!!!waitTicks ${ticks}`
        }[type];
    },
    "debug-throwError": function (type, errorMessage) {
        return {
            script: `throw new Error("${errorMessage}");`,
            command: "!!!throwError"
        }[type];
    },
};
