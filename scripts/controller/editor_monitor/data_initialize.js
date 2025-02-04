import {
    world as ServerWorld
}
from "@minecraft/server";

ServerWorld.afterEvents.playerSpawn.subscribe(eventData => {
    if (!eventData.initialSpawn) return;
    const player = eventData.player;
    //
});