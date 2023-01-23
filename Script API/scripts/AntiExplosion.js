"use strict";
import * as mc from "@minecraft/server";

mc.world.events.beforeExplosion.subscribe((arg) => {
    if (
        arg.source.typeId == "minecraft:creeper" ||
        arg.source.typeId == "minecraft:fireball"
    )
        arg.impactedBlocks = [];
});
