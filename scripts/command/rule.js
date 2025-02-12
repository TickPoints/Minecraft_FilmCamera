import { world as ServerWorld } from "@minecraft/server";
import { raw } from "../text/local.js";

export const rule = {
    console: {
        type: "function",
        run: function (performer, type, mes) {
            console[type](mes);
            return mes;
        },
        config: {
            parameters: [
                {
                    type: "enumeration",
                    enumeration: ["info", "warn", "error"]
                },
                {
                    type: "string"
                }
            ],
            needPermission: true,
            description:
                "$filmcamera.scripts.command_system.help.commands.console"
        }
    },
    getEntity: {
        type: "function",
        run: function (performer, type, options = {}, dimension = null) {
            let returnValue;
            if (dimension === null) dimension = performer.dimension.id;
            switch (type) {
                case "self": {
                    returnValue = performer;
                    break;
                }
                case "target": {
                    returnValue =
                        ServerWorld.getDimension(dimension).getEntities(
                            options
                        )[0];
                    break;
                }
                case "player": {
                    options = {
                        type: "minecraft:player"
                    };
                    returnValue =
                        ServerWorld.getDimension(dimension).getEntities(
                            options
                        );
                    let location = performer.location;
                    let players = [];
                    for (let i of returnValue) {
                        let sum = 0;
                        sum += Math.abs(i.location.x - location.x);
                        sum += Math.abs(i.location.y - location.y);
                        sum += Math.abs(i.location.z - location.z);
                        players.push(sum);
                    }
                    const minIndex = players.indexOf(Math.min(...players));
                    returnValue = returnValue[minIndex];
                    break;
                }
                default: {
                    return null;
                }
            }
            return returnValue.id;
        },
        config: {
            parameters: [
                {
                    type: "enumeration",
                    enumeration: ["self", "target", "player"]
                },
                {
                    type: "enumeration",
                    enumeration: ["overworld", "nether", "the_end"],
                    requirement: "select"
                },
                {
                    type: "json",
                    conversion: true,
                    requirement: "select"
                }
            ],
            description:
                "$filmcamera.scripts.command_system.help.commands.getEntity"
        }
    },
    help: {
        type: "function",
        run: function (performer) {
            let message = {
                rawtext: []
            };

            function rankJSON(jsonObj) {
                const sortedMap = new Map(
                    Object.entries(jsonObj).sort(([key1], [key2]) =>
                        key1.localeCompare(key2)
                    )
                );
                return Object.fromEntries(sortedMap);
            }

            for (let i of Object.keys(rankJSON(rule))) {
                let config = rule[i].config;
                if (config === undefined) {
                    message.rawtext.push({
                        text: `${i} - [0]\n`
                    });
                } else {
                    message.rawtext.push({
                        text: `${i} - [${config.needPermission ? "editor" : "common"}]`
                    });
                    message.rawtext.push(raw(config.description));
                    message.rawtext.push({
                        text: "\n"
                    });
                }
            }
            performer.sendMessage(message);
        },
        config: {
            description: "$filmcamera.scripts.command_system.help.commands.help"
        }
    },
    getEntities: {
        type: "function",
        run: function (performer, options, dimension = null) {
            if (dimension === null) dimension = performer.dimension.id;
            var entities = [];
            for (const i of ServerWorld.getDimension(dimension).getEntities(
                options
            ))
                entities.push(i.id);
            return JSON.stringify(entities);
        },
        config: {
            parameters: [
                {
                    type: "json",
                    conversion: true
                },
                {
                    type: "enumeration",
                    enumeration: ["overworld", "nether", "the_end"],
                    requirement: "select"
                }
            ],
            description:
                "$filmcamera.scripts.command_system.help.commands.getEntities"
        }
    },
    runMinecraftCommand: {
        type: "function",
        run: function (performer, MinecraftCommand) {
            return JSON.stringify(performer.runCommand(MinecraftCommand));
        },
        config: {
            parameters: [
                {
                    type: "string"
                }
            ],
            needPermission: true,
            description:
                "$filmcamera.scripts.command_system.help.commands.runMinecraftCommand"
        }
    },
    playCameraScript: {
        type: "function",
        run: function (
            _performer,
            script_name,
            players = ServerWorld.getAllPlayers()
        ) {
            import("../controller/script_player.js")
                .then(({ play_script }) => {
                    play_script(script_name, players);
                })
                .catch(e => {
                    console.error(
                        `The playCamera Script command encountered some errors during execution: \n${e}`
                    );
                });
        },
        config: {
            parameters: [
                {
                    type: "string"
                },
                {
                    type: "players",
                    conversion: true,
                    requirement: "select"
                }
            ],
            needPermission: true,
            description:
                "$filmcamera.scripts.command_system.help.commands.playCameraScript"
        }
    },
    menu: {
        type: "function",
        run: function (performer) {
            import("../ui/ui_list.js").then(({ ui_list }) => {
                ui_list.menu(performer);
            });
        },
        config: {
            description: "$filmcamera.scripts.command_system.help.commands.menu"
        }
    },
    saveData: {
        type: "function",
        run: function () {
            import("../lib/data_manager.js").then(({ saveData }) => {
                saveData();
            });
        },
        config: {
            needPermission: true,
            description:
                "$filmcamera.scripts.command_system.help.commands.saveData"
        }
    },
    edit: {
        type: "function",
        run: function (performer) {
            import("../ui/ui_list.js").then(({ ui_list }) => {
                ui_list.editor_working(performer);
            });
        },
        config: {
            needPermission: true,
            description: "$filmcamera.scripts.command_system.help.commands.edit"
        }
    },
    openProject: {
        type: "function",
        run: function (performer, ProjectName, ProjectType = "public") {
            import("../controller/editor_monitor/docking_tool.js").then(
                ({ openProject }) => {
                    openProject(performer, {
                        name: ProjectName,
                        type: ProjectType
                    });
                }
            );
        },
        config: {
            parameters: [
                {
                    type: "string"
                },
                {
                    type: "enumeration",
                    enumeration: ["public", "private"],
                    requirement: "select"
                }
            ],
            needPermission: true,
            description:
                "$filmcamera.scripts.command_system.help.commands.openProject"
        }
    }
};
