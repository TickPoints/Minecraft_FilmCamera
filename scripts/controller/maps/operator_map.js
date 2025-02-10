const operator_map = {
    "camera-clear": function(type) {
        return {
            "script": "PlayerCamera.clear();",
            "command": "/camera [player] clear"
        } [type];
    },
    "camera-fade": function(type, fadeCameraOptions) {
        return {
            "script": `PlayerCamera.fade(${JSON.stringify(fadeCameraOptions)});`,
            "command": "/camera [player] clear"
        } [type];
    },
    "inputpermission-movement": function(type, status) {
        return {
            "script": `player.inputPermissions.setPermissionCategory(2, ${status});`,
            "command": `/inputpermission set [player] movement ${status}`
        } [type];
    },
    "inputpermission-camera": function(type, status) {
        return {
            "script": `player.inputPermissions.setPermissionCategory(1, ${status});`,
            "command": `/inputpermission set [player] camera ${status}`
        } [type];
    },
    "player-runMinecraftCommand": function(type, command) {
        return {
            "script": `Player.runCommand("${command}");`,
            "command": `/execute as [player] at @s run ${command}`
        } [type];
    },
    "time-waitTicks": function(type, ticks) {
        return {
            "script": `await ServerSystem.waitTicks(${ticks});`,
            "command": `!!!waitTicks ${ticks}`
        } [type];
    },
}

const operator_meta_map = {
    "translate": [
        "filmcamera.scripts.editor.operator_meta_map.translate.camera-clear",
        "filmcamera.scripts.editor.operator_meta_map.translate.camera-fade",
        "filmcamera.scripts.editor.operator_meta_map.translate.inputpermission-movement",
        "filmcamera.scripts.editor.operator_meta_map.translate.inputpermission-carmera",
        "filmcamera.scripts.editor.operator_meta_map.translate.player-runMinecraftCommand",
        "filmcamera.scripts.editor.operator_meta_map.translate.time-waitTicks"
    ],
    "root": [{
        "id": "camera-clear",
        "ui": [
            ["textField", "This is an operator with no parameters and no content.", "Null"]
        ],
        "func": [
        
        ]
    }]
};

export {
    operator_map,
    operator_meta_map
};