import {
    scripts_list
}
from "./camera_scripts/index.js";
import {
    play_scene
}
from "./player.js";

async function play_script(script_name, players) {
    if (!scripts_list[script_name]) {
        console.error("The camera script you want to play is not in the index.");
        return;
    }
    try {
        let {
            entry
        } = await import(`./camera_scripts/${scripts_list[script_name]}`);
        if (!entry) {
            console.error("The entry for the camera script you want to play is wrong.");
            return;
        }
        play_scene(entry.scenes[0], players);
    } catch(e) {
        console.error(`Some errors were encountered while the camera script was running: \n${e}${e.stack}`);
    }
}

export {
    play_script
}