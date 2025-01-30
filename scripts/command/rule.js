import {
    world as ServerWorld
}
from "@minecraft/server";
import {
    raw
}
from "../text/local.js";

export const rule = {
    "console": {
        "type": "function",
        "run": function(performer, type, mes) {
            console[type](mes);
            return mes;
        },
        "config": {
            "parameters": [{
                "type": "enumeration",
                "enumeration": ["info", "warn", "error"]
            }, {
                "type": "string"
            }],
            "needPermission": true
        }
    },
    "getEntity": {
        "type": "function",
        "run": function(performer, type, options = {}, dimension = null) {
            let returnValue;
            if (dimension === null) dimension = performer.dimension.id;
            switch (type) {
                case "self":
                    returnValue = performer;
                    break;
                case "target":
                    returnValue = ServerWorld.getDimension(dimension)
                        .getEntities(options)[0];
                    break;
                case "player":
                    options = {
                        "type": "minecraft:player"
                    };
                    returnValue = ServerWorld.getDimension(dimension)
                        .getEntities(options);
                    let location = performer.location;
                    let players = [];
                    for (let i of returnValue) {
                        let sum = 0;
                        sum += Math.abs(i.location.x - location.x);
                        sum += Math.abs(i.location.y - location.y);
                        sum += Math.abs(i.location.z - location.z);
                        players.push(sum);
                    };
                    const minIndex = players.indexOf(Math.min(...players));
                    returnValue = returnValue[minIndex];
                    break;
                default:
                    return null;
            };
            return returnValue.id;
        },
        "config": {
            "parameters": [{
                "type": "enumeration",
                "enumeration": ["self", "target", "player"]
            }, {
                "type": "enumeration",
                "enumeration": ["overworld", "nether", "the_end"],
                "requirement": "select"
            }, {
                "type": "json",
                "conversion": true,
                "requirement": "select"
            }],
            "needPermission": true
        }
    },
    "help": {
        "type": "function",
        "run": function(performer) {
            let message = "\n";

            function rankJSON(jsonObj) {
                const sortedMap = new Map(Object.entries(jsonObj).sort(([key1], [key2]) => key1.localeCompare(key2)));
                return Object.fromEntries(sortedMap);
            }

            for (let i of Object.keys(rankJSON(rule))) {
                let config = rule[i].config;
                if (config === undefined) {
                    message += `${i} - [0]\n`;
                } else {
                    message += `${i} - [${config.needPermission ? "op" : "common"}]${config.description ? raw(config.description) : ""}\n`
                }
            }

        },
        "config": {
            "needPermission": true
        }
    },
    "getEntities": {
        "type": "function",
        "run": function(performer, options, dimension = null) {
            let returnValue;
            if (dimension === null) dimension = performer.dimension.id;
            var entities = [];
            for (const i of ServerWorld.getDimension(dimension).getEntities(options)) entities.push(i.id);
            return JSON.stringify(entities);
        },
        "config": {
            "parameters": [{
                "type": "json",
                "conversion": true
            }, {
                "type": "enumeration",
                "enumeration": ["overworld", "nether", "the_end"],
                "requirement": "select"
            }],
            "needPermission": true
        }
    },
    "playCameraScript": {
        "type": "function",
        "run": function(_performer, script_name, players = ServerWorld.getAllPlayers()) {
            import("../controller/script_player.js").then(({ play_script }) => {
                play_script(script_name, players);
            }).catch(e => {
                console.error(`The playCamera Script command encountered some errors during execution: \n${e}`);
            });
        },
        "config": {
            "parameters": [{
                "type": "string"
            }, {
                "type": "players",
                "conversion": true,
                "requirement": "select"
            }],
            "needPermission": true
        }
    }
};