import {
    world as ServerWorld
} from "@minecraft/server";
// Error Output Tool Definition
import {
    printToPlayer
} from "../text/print.js";
import {
    translate
} from "../text/local.js";

function printError(target, text, ...withData) {
    printToPlayer(target, translate(text, ...withData), "$filmcamera.scripts.command_system.meta.source_id.configureParser", "ERROR");
    return null;
}

export const type_map = {
    "string": function(_performer, parameters, i) {
        return parameters[i];
    },
    "number": function(performer, parameters, i) {
        const num = Number(parameters[i]);
        if (isNaN(num)) {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Number");
        }
        return num;
    },
    "int": function(performer, parameters, i) {
        const intValue = parseInt(parameters[i]);
        if (intValue !== Number(parameters[i])) {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Int");
        }
        return Number(parameters[i]);
    },
    "enumeration": function(performer, parameters, i, other) {
        const enumeration = other.config.parameters[i].enumeration;
        if (!enumeration.includes(parameters[i])) {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error_with_enumeration", parameters[i], parameters[i - 1], parameters[i + 1], enumeration.toString());
        }
    },
    "entity": function(performer, parameters, i) {
        try {
            return ServerWorld.getEntity(parameters[i]);
        } catch {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Entity");
        }
    },
    "entities": function(performer, parameters, i) {
        try {
            var entities = [];
            for (const entity of JSON.parse(parameters[i])) {
                entities.push(ServerWorld.getEntity(entity));
            }
            return entities;
        } catch {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Entities");
        }
    },
    "player": function(performer, parameters, i) {
        try {
            const entity = ServerWorld.getEntity(parameters[i]);
            if (entity.typeId !== "minecraft:player") {
                return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Player");
            }
            return entity;
        } catch {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Player");
        }
    },
    "players": function(performer, parameters, i) {
        try {
            var players = [];
            for (const entity of JSON.parse(parameters[i])) {
                const player = ServerWorld.getEntity(entity);
                if (player.typeId === "minecraft:player") players.push(player);
            }
            return players;
        } catch {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Players");
        }
    },
    "json": function(performer, parameters, i) {
        const input = parameters[i];
        if (/^(\{.*\}|\[.*\])$/.test(input) === false) {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Json");
        }
        try {
            const jsonObj = JSON.parse(input);
            return jsonObj;
        } catch {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Json");
        }
    },
    "bool": function(performer, parameters, i) {
        const value = parameters[i];
        if (value !== "true" && value !== "false") {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "Bool");
        }
        return value === "true";
    },
    "adaptation": function(performer, parameters, i) {
        const value = parameters[i];
        if (value === "true" || value === "false") {
            return value === "true";
        }
        const num = Number(value);
        if (!isNaN(num)) {
            return num;
        }
        const entity = ServerWorld.getEntity(value);
        if (entity !== undefined) {
            return entity;
        }
        try {
            return JSON.parse(value);
        } catch {
            // empty
        }
        return undefined;
    },
    "command_name": function(performer, parameters, i, other) {
        const commandNames = Object.keys(other.rule);
        if (!commandNames.includes(parameters[i])) {
            return printError(performer, "filmcamera.scripts.command_system.error.input_type_error", parameters[i], parameters[i - 1], parameters[i + 1], "CommandName");
        }
    }
};