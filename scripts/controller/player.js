import {
    world as ServerWorld
}
from "@minecraft/server";
import {
    sandbox
}
from "../lib/sandbox.js";
import {
    parse_scene
}
from "./parser.js";

function run_in_sandbox(player, scene) {
    sandbox(scene, {
        PlayerCamera: player.camera,
        Player: player,
        ServerWorld
    });
}

function play_frames(frames, player) {
    var data = "";
    for (const i of frames) data += (i + "\n");
    run_in_sandbox(player, data);
}

function play_scene(scene, players) {
    const frames = parse_scene(scene);
    for (const player of players) {
        play_frames(frames, player);
    }
}
/*
function play_scenes(scenes, scenes_composer) {
    for (const composer of scenes_composer) {
        composer
    }
}*/

export {
    play_scene
};