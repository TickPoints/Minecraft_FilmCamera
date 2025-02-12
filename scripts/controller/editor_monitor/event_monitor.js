import {
    world as ServerWorld,
    system as ServerSystem
} from "@minecraft/server";
import { printToPlayer } from "../../text/print.js";
import { translate } from "../../text/local.js";
import { getDataManager } from "../../lib/data_manager.js";

ServerWorld.beforeEvents.playerBreakBlock.subscribe(eventData => {
    if (typeof eventData.itemStack === "undefined") return;
    const itemType = eventData.itemStack.typeId;
    const player = eventData.player;
    const playerData = getDataManager(player);
    const blockLocation = eventData.block.location;
    switch (itemType) {
        case "filmcamera:selection_bar1": {
            eventData.cancel = true;
            playerData.selection[0] = {
                ...blockLocation,
                dimension: eventData.dimension.id
            };
            ServerSystem.run(() =>
                printToPlayer(
                    player,
                    translate(
                        "filmcamera.scripts.editor.events.selected_location1",
                        blockLocation.x.toString(),
                        blockLocation.y.toString(),
                        blockLocation.z.toString()
                    )
                )
            );
            return;
        }
        case "filmcamera:selection_bar2": {
            eventData.cancel = true;
            playerData.selection[1] = {
                ...blockLocation,
                dimension: eventData.dimension.id
            };
            ServerSystem.run(() =>
                printToPlayer(
                    player,
                    translate(
                        "filmcamera.scripts.editor.events.selected_location2",
                        blockLocation.x.toString(),
                        blockLocation.y.toString(),
                        blockLocation.z.toString()
                    )
                )
            );
            return;
        }
        default:
            return;
    }
});

try {
    ServerWorld.afterEvents.worldLoad(WorldLoad);
} catch {
    ServerWorld.afterEvents.worldInitiation(WorldLoad);
}

function worldLoad() {
    for (const i of Object.keys(RealTimeLoader)) ServerSystem.runInterval(i);
}

const RealTimeLoader = {
    HighlightBlock: function () {
        let blocks = [];
        for (const player of ServerWorld.getAllPlayers()) {
            const playerData = getDataManager(player);
            if (playerData.selection[0] !== {})
                block.push(playerData.selection[0]);
            if (playerData.selection[1] !== {})
                block.push(playerData.selection[1]);
        }
        for (const block of blocks) {
            ServerWorld.getDimension(block.dimension).spawnParticle(
                "filmcamera:highlight",
                {
                    x: block.x,
                    y: block.y,
                    z: block.z
                }
            );
        }
    }
};
