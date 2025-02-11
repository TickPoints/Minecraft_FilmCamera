import {
    world as ServerWorld
}
from "@minecraft/server";
import {
    printToPlayer
}
from "../../text/print.js";
import {
    translate
}
from "../../text/local.js";
import {
    getDataManager
}
from "../../lib/data_manager.js";

ServerWorld.afterEvents.itemUseOn.subscribe(eventData => {
    const itemType = eventData.itemStack.typeId;
    const playerData = getDataManager(eventData.player);
    const blockLocation = eventData.block.location;
    switch (itemType) {
        case "filmcamera:selection_bar1": {
            playerData.selection[0] = blockLocation;
            printToPlayer(translate("filmcamera.scripts.editor.events.selected_location1",
                JSON.stringify(blockLocation)));
            return;
        };
        case "filmcamera:selection_bar2": {
            playerData.selection[1] = blockLocation;
            printToPlayer(translate("filmcamera.scripts.editor.events.selected_location2",
                JSON.stringify(blockLocation)));
            return;
        };
        default:
            return;
    }
});