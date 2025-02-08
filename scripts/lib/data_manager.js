import {
    world as ServerWorld,
    system as ServerSystem
}
from "@minecraft/server";
import {
    LZString
}
from "./lz-string.js"

const BLOCK_LENGTH = 1000;
const SAVE_INTERVAL = 2 * 60 * 20;

var DataObject = {
    "World": {},
    "Player": {}
};

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

var player_data_preprocessor = [];
var world_data_preprocessor = [];

function addDataPreprocessor(func, type) {
    switch (type) {
        case "player":
            player_data_preprocessor.push(func);
            break;
        case "world":
            world_data_preprocessor(func);
            break;
        default:
            return;
    }
}

// Monitor
ServerWorld.afterEvents.playerSpawn.subscribe(eventData => {
    if (!eventData.initialSpawn) return;
    const player = eventData.player;
    DataObject.Player[player.name] = readDataOnDynamicProperty(player);
    if (JSON.stringify(DataObject.Player[player.name]) == "{}") DataObject.Player[player.name] = playerDataInit();
    pretreatmentPlayerData(player.name);
});

function WorldLoad() {
    DataObject.World = readDataOnDynamicProperty(ServerWorld);
    if (JSON.stringify(DataObject.World) == "{}") DataObject.World = worldDataInit();
    // Debug:
    DataObject.World = worldDataInit();
    for (const player of ServerWorld.getAllPlayers()) {
        DataObject.Player[player.name] = playerDataInit();
    }
    
    pretreatmentWorldData();
    ServerSystem.runInterval(saveData, SAVE_INTERVAL);
}

var worldDataInit = function() {
    return {};
};
var playerDataInit = function() {
    return {};
};

try {
    ServerWorld.afterEvents.worldInitialize.subscribe(WorldLoad); // remove at @minecraft/server 2.0.0
} catch {
    ServerWorld.afterEvents.worldLoad.subscribe(WorldLoad);
}

function pretreatmentWorldData() {
    for (const i of world_data_preprocessor) DataObject.World = i(DataObject.World);
}

function pretreatmentPlayerData(name) {
    for (const i of player_data_preprocessor) DataObject.Player[name] = i(DataObject.Player[name]);
}

export {
    getDataManager,
    saveData,
    writeWorldDataInit,
    writePlayerDataInit,
    addDataPreprocessor
};