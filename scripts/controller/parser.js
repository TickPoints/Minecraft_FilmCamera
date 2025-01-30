const operator_map = {
    "camera-clear": function(type) {
        return {
            "script": "PlayerCamera.clear();",
            "command": "/camera [player] clear"
        } [type];
    },
    "player-runMinecraftCommand": function(type, command) {
        return {
            "script": `Player.runCommand("${command}");`,
            "command": `/execute as [player] at @s run ${command}`
        } [type];
    }
}

function parse_scene(scene, type = "script") {
    let results = [];
    for (const frame of scene.frames) {
        var result = operator_map[frame.operator](type, ...frame.args);
        results.push(result);
    }
    return results;
}

/*
function parse_scene_composer(scene_composer) {
    scene_composer.order
}
*/


export {
    parse_scene
};