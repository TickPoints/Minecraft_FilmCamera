import { world as ServerWorld } from "@minecraft/server";
// Error Output Tool Definition
import { printToPlayer } from "../text/print.js";
import { translate } from "../text/local.js";

function printError(target, text, ...withData) {
    printToPlayer(
        target,
        translate(text, ...withData),
        "$filmcamera.scripts.command_system.meta.source_id.main",
        "ERROR",
    );
}

import { type_map } from "./type_map.js";
import { rule } from "./rule.js";

function configureParser(config, parameters, performer) {
    if (config.needPermission === true) {
        if (!performer.hasTag("camera_editor")) {
            printError(performer, "filmcamera.scripts.no_permission");
            return -1;
        }
    }
    // Parameter Restriction Section
    if (config.parameters === undefined) return;
    const configLength = config.parameters.length;
    for (let param_index = 0; param_index < configLength; param_index++) {
        const param = config.parameters[param_index];
        const requirement = param.requirement;
        if (parameters[param_index] === undefined) {
            if (requirement === "select") {
                continue;
            } else {
                printError(
                    performer,
                    "filmcamera.scripts.command_system.error.parameter_missing",
                    param_index + 1,
                );
                return -1;
            }
        }
        if (!type_map[param.type]) {
            console.error("The type specified by the command does not exist.");
            return -1;
        }
        const returnValue = type_map[param.type](
            performer,
            parameters,
            param_index,
            {
                rule,
                config,
            },
        );
        if (returnValue === null) return -1;
        if (param.conversion) parameters[param_index] = returnValue;
    }
}

function run(command, performer = ServerWorld) {
    let entry = rule;
    entry = entry[command[0]];
    const commandLength = command.length;
    for (let i = 0; i < commandLength; i++) {
        if (entry === undefined) {
            printError(
                performer,
                "filmcamera.scripts.command_system.error.command_does_not_exist",
                command[i],
            );
            return;
        }
        switch (entry.type) {
            case "function": {
                const parameters = command.slice(i + 1);
                const fun = entry.run;
                const config = entry.config;
                if (config !== undefined) {
                    if (configureParser(config, parameters, performer) === -1)
                        return;
                }
                const newParameters = [performer, ...parameters];
                try {
                    return fun(...newParameters);
                } catch (e) {
                    printError(
                        performer,
                        "filmcamera.scripts.command_system.error.command_work_error",
                        `${e}${e.stack}`,
                    );
                }
                break;
            }
            case "subcommand": {
                entry = entry.subcommand[command[i + 1]];
                break;
            }
            case "copy": {
                const fromValue = entry.from;
                let copyBit = rule;
                const parts = fromValue.split(".");
                for (let part of parts) {
                    copyBit = copyBit[part];
                }
                if (copyBit === undefined) {
                    console.error("The data to be copied does not exist.");
                    return;
                }
                command.splice(i, 0, command[i]);
                entry = copyBit;
                break;
            }
            default: {
                console.error("The command takes the wrong entry type.");
                return;
            }
        }
    }
}

function parseCommand(performer, com, subcommand = []) {
    let command;

    function substitution(
        originalString,
        replacementString,
        startIndex,
        endIndex,
    ) {
        return `${originalString.substring(0, startIndex)}${replacementString}${originalString.substring(endIndex)}`;
    }
    if (com.includes("(")) {
        let stack = [];
        const length = com.length;
        for (let charValue = 0; charValue < length; charValue++) {
            const char = com[charValue];
            if (char === "(") {
                if (com[charValue + 1] === "&") {
                    stack.push({
                        key: charValue,
                        value: "&",
                        isOuter: stack.every(
                            (item) => item.value !== "&" && !item.isOuter,
                        ),
                    });
                } else {
                    stack.push({
                        key: charValue,
                        value: "(",
                    });
                }
            } else if (char === ")") {
                const pop = stack.pop();
                if (!stack.every((item) => item.value !== "&" && !item.isOuter))
                    continue;
                let newCommand;
                if (pop.value === "&") {
                    newCommand = substitution(
                        com,
                        `command.${subcommand.length}`,
                        pop.key,
                        charValue + 1,
                    );
                    subcommand.push(com.substring(pop.key + 2, charValue));
                    return parseCommand(performer, newCommand, subcommand);
                } else if (pop.value === "(") {
                    newCommand = substitution(
                        com,
                        parseCommand(
                            performer,
                            com.substring(pop.key + 1, charValue),
                            subcommand,
                        ),
                        pop.key,
                        charValue + 1,
                    );
                    return parseCommand(performer, newCommand, subcommand);
                }
            }
        }
    } else {
        command = com.split(" ");
    }
    const commandLength = command.length;
    for (let i = 0; i < commandLength; i++) {
        if (command[i].substring(0, 8) === "command.") {
            command[i] = subcommand[+command[i].substring(8)];
        }
    }
    return run(command, performer);
}

export { parseCommand };
