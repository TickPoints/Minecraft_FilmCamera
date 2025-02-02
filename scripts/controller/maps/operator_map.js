export const operator_map = {
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
    },
    "time-waitTicks": function(type, ticks) {
        return {
            "script": `await ServerSystem.waitTicks(${ticks});`,
            "command": `!!!waitTicks ${ticks}`
        } [type];
    },
}