import * as mc from "mojang-minecraft";

mc.world.events.beforeExplosion.subscribe((e) => {
    if (e.source.id == "minecraft:creeper") e.impactedBlocks = [];
});
