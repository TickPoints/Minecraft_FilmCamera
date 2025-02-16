import {
    world as ServerWorld,
    system as ServerSystem
} from "@minecraft/server";
import { parse_scene } from "./parser.js";

function play_frames(frames, player) {
    const data = frames.join("\n");
    const AsyncFunction = async function () {}.constructor;
    let func;
    func = new AsyncFunction(`with(this) {${data}}`);
    function parseError(error) {
        let match = error.stack.split("\n")[0].match(/\((.*?):(\d+)\)/);
        if (match && match.length === 3) {
            match = match[2] - 2;
        }
        console.error(
            `There were some errors in the frames execution: ${error.message}${match ? `      at frame[${match}]` : ""}`
        );
    }
    return new Promise(resolve => {
        const context = {
            PlayerCamera: player.camera,
            Player: player,
            ServerWorld,
            ServerSystem
        };
        try {
            const result = func.call(context);
            if (result instanceof Promise) {
                result.then(resolve).catch(error => {
                    parseError(error);
                    resolve();
                });
            } else {
                resolve(result);
            }
        } catch (error) {
            parseError(error);
            resolve();
        }
    });
}

function play_scene(scene, players) {
    const frames = parse_scene(scene);
    const wait_frames = players.map(player => play_frames(frames, player));
    if (wait_frames.length > 0) {
        return Promise.all(wait_frames);
    } else {
        return Promise.resolve(0);
    }
}

async function play_scenes(scenes, scenes_composer, players) {
    const scenes_status = new Array(scenes.length).fill(null);
    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const composer = scenes_composer[i];
        switch (composer.order) {
            case "top":
                scenes_status[i] = play_scene(scene, players);
                break;
            case "follow":
                if (i > 0) {
                    await scenes_status[i - 1];
                } else {
                    console.warn(
                        "'follow' order not applicable for the first scene"
                    );
                }
                scenes_status[i] = play_scene(scene, players);
                break;
            default:
                console.warn("The scene used a nonexistent order");
                scenes_status[i] = play_scene(scene, players);
                break;
        }
    }
    return 0;
}

export { play_scene, play_scenes };
