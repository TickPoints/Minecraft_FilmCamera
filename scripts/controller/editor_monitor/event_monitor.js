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
    ServerWorld.afterEvents.worldInitialize.subscribe(WorldLoad);
} catch {
    ServerWorld.afterEvents.worldLoad.subscribe(WorldLoad);
}

function WorldLoad() {
    for (const i of Object.keys(RealTimeLoader))
        ServerSystem.runInterval(RealTimeLoader[i], 1);
}

const RealTimeLoader = {
    HighlightBlock: function () {
        let blocks = [];
        for (const player of ServerWorld.getAllPlayers()) {
            try {
                const playerData = getDataManager(player);
                if (playerData.selection[0] !== {})
                    blocks.push(playerData.selection[0]);
                if (playerData.selection[1] !== {})
                    blocks.push(playerData.selection[1]);
            } catch {
                // empty
            }
        }
        for (const block of blocks) {
            try {
                function spawnParticle(deviationX, deviationY, deviationZ) {
                    ServerWorld.getDimension(block.dimension).spawnParticle(
                        "filmcamera:highlight",
                        {
                            x: block.x + deviationX,
                            y: block.y + deviationY,
                            z: block.z + deviationZ
                        }
                    );
                }
                spawnParticle(0, 0, 0);
                spawnParticle(1, 0, 0);
                spawnParticle(1, 1, 0);
                spawnParticle(1, 1, 1);
                spawnParticle(1, 0, 1);
                spawnParticle(0, 1, 0);
                spawnParticle(0, 1, 1);
                spawnParticle(0, 0, 1);
            } catch {
                // empty
            }
        }
    },
    HighlightLocation: function () {
        let blocks = [];
        for (const player of ServerWorld.getAllPlayers()) {
            try {
                const playerData = getDataManager(player);
                if (playerData.selection[0] !== {})
                    blocks.push(playerData.selection[0]);
                if (playerData.selection[1] !== {})
                    blocks.push(playerData.selection[1]);
            } catch {
                // empty
            }
        }
        for (const block of blocks) {
            try {
                function spawnParticle(deviationX, deviationY, deviationZ) {
                    ServerWorld.getDimension(block.dimension).spawnParticle(
                        "filmcamera:highlight",
                        {
                            x: block.x + deviationX,
                            y: block.y + deviationY,
                            z: block.z + deviationZ
                        }
                    );
                }
                spawnParticle(0.5, 0.5, 0.5);
            } catch {
                // empty
            }
        }
    }
};
