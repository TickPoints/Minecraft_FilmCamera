import {
    world as ServerWorld,
    system as ServerSystem
}
from "@minecraft/server";
import {
    LZString
}
from "./lz-string.js";

"use strict";

const BLOCK_LENGTH = 1000;
const SAVE_INTERVAL = 2 * 60 * 20;

function mergeData(oldObj, newObj) {
    for (const i of Object.keys(newObj)) {
        Object.defineProperty(oldObj, i, {
            value: newObj[i],
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
}

const DataObject = {
    World: {},
    Player: {}
}

function getDataManager(target = ServerWorld) {
    if (target === ServerWorld) {
        return DataObject.World;
    } else {
        return DataObject.Player[target.name];
    }
}

function readDataOnDynamicProperty(target) {
    const quantity = target.getDynamicProperty("data_space_quantity");
    if (typeof quantity !== "number") return {};
    if (quantity === 0) return {};
    let value = "";
    for (let i = 1; i <= quantity; i++) {
        const currentValue = target.getDynamicProperty(`data_space_${i}`);
        if (typeof currentValue !== "string" || currentValue === "") return {};
        value += currentValue;
    }
    try {
        return JSON.parse(LZString.decompress(value));
    } catch {
        return {};
    }
}

function writeDataOnDynamicProperty(target, source_data) {
    const data = LZString.compress(JSON.stringify(source_data));
    let dataBlocks = [];
    for (let i = 0; i < data.length; i += BLOCK_LENGTH) {
        dataBlocks.push(data.slice(i, i + BLOCK_LENGTH));
    }
    const quantity = dataBlocks.length;
    target.setDynamicProperty("data_space_quantity", quantity);
    for (let i = 1; i <= quantity; i++) {
        target.setDynamicProperty(`data_space_${i}`, dataBlocks[i - 1]);
    }
}

function saveData() {
    writeDataOnDynamicProperty(ServerWorld, DataObject.World);
    for (const player of ServerWorld.getAllPlayers()) {
        writeDataOnDynamicProperty(player, DataObject.Player[player.name]);
    }
    console.warn("Data has been saved!");
}

function writeWorldDataInit(func) {
    worldDataInit = func;
}

function writePlayerDataInit(func) {
    playerDataInit = func;
}

// Monitor
ServerWorld.afterEvents.playerSpawn.subscribe(eventData => {
    if (!eventData.initialSpawn) return;
    const player = eventData.player;
    DataObject.Player[player.name] = readDataOnDynamicProperty(player);
    if (JSON.stringify(DataObject.Player[player.name]) == "{}") mergeData(DataObject.Player[player.name], playerDataInit());
});

ServerSystem.beforeEvents.shutdown.subscribe(() => {
    saveData();
});

function WorldLoad() {
    mergeData(DataObject.World, readDataOnDynamicProperty(ServerWorld));
    if (JSON.stringify(DataObject.World) == "{}") mergeData(DataObject.World, worldDataInit());
    for (const player of ServerWorld.getAllPlayers()) {
        DataObject.Player[player.name] = readDataOnDynamicProperty(player);
        if (JSON.stringify(DataObject.Player[player.name]) == "{}") mergeData(DataObject.Player[player.name], playerDataInit());
    }
    ServerSystem.runInterval(saveData, SAVE_INTERVAL);
}

let worldDataInit = function() {
    return {};
};
let playerDataInit = function() {
    return {};
};

try {
    ServerWorld.afterEvents.worldInitialize.subscribe(WorldLoad); // remove at @minecraft/server 2.0.0
} catch {
    ServerWorld.afterEvents.worldLoad.subscribe(WorldLoad);
}

export {
    getDataManager,
    saveData,
    writeWorldDataInit,
    writePlayerDataInit
};