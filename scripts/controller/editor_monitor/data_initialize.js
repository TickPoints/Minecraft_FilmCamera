import {
    writeWorldDataInit,
    writePlayerDataInit,
    addDataPreprocessor
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
        "editing_status": false
    }
}

writeWorldDataInit(() => {
    return InitMap.World;
});

writePlayerDataInit(() => {
    return InitMap.Player;
});