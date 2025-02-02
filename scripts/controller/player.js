import {
    world as ServerWorld,
    system as ServerSystem
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
    return sandbox(scene, {
        PlayerCamera: player.camera,
        Player: player,
        ServerWorld,
        ServerSystem
    });
}

function play_frames(frames, player) {
    var data = "";
    for (const i of frames) data += (i + "\n");
    return run_in_sandbox(player, data);
}

function play_scene(scene, players) {
    const frames = parse_scene(scene);
    var wait_frames = [];
    for (const player of players) {
        wait_frames.push(play_frames(frames, player));
    }
    return Promise.all(wait_frames);
}

async function play_scenes(scenes, scenes_composer, players) {
    var scenes_status = [];
    for (let i = 0; i < scenes.length; i ++) {
        const scene = scenes[i];
        const composer = scenes_composer[i];
        switch (composer.type) {
            case "top":
                scenes_status[i] = play_scene(scene, players);
                break;
            case "follow":
                await scenes_status[i - 1];
                scenes_status[i] = play_scene(scene, players);
                break;
            default:
                scenes_status[i] = play_scene(scene, players);
                break;
        }
    }
}

export {
    play_scene,
    play_scenes
};