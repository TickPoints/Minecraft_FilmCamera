import {
    writeWorldDataInit,
    writePlayerDataInit,
    getDataManager
}
from "../../lib/data_manager.js";

const InitMap = {
    "World": {
        "last_version": [1, 0, 0]
    },
    "Player": {
        //
    }
}

writeWorldDataInit(() => {
    return InitMap.World;
});

writePlayerDataInit(() => {
    return InitMap.Player;
});