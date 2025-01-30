import {
    world as ServerWorld
}
from "@minecraft/server";
import {
    raw
}
from "./local.js";

function print(text, source = "FilmCamera", type = "INFO") {
    ServerWorld.sendMessage({
        "rawtext": [{
            "text": "["
        },
        raw(source),
        {
            "text": "]"
        },
        {
            "text": "["
        },
        raw(type),
        {
            "text": "] "
        },
        text]
    });
}

function print_to_player(player, text, source = "FilmCamera", type = "INFO") {
    player.sendMessage({
        "rawtext": [{
            "text": "["
        },
        raw(source),
        {
            "text": "]"
        },
        {
            "text": "["
        },
        raw(type),
        {
            "text": "] "
        },
        text]
    });
}

export {
    print,
    print_to_player
};