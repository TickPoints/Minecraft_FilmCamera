import {
    writeWorldDataInit,
    writePlayerDataInit,
    addDataPreprocessor,
    getDataManager
}
from "../../lib/data_manager.js";

const SYSTEM_VERSION = [1, 0, 0];

const InitMap = {
    "World": {
        "last_version": SYSTEM_VERSION,
        "projects": {}
    },
    "Player": {
        "projects": {},
        "current_project": null
    }
}

writeWorldDataInit(() => {
    return InitMap.World;
});

writePlayerDataInit(() => {
    return InitMap.Player;
});