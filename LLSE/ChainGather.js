"use strict";
ll.registerPlugin("ChainGather", "连锁采集", [1, 0, 0]);

const conf = new JsonConfigFile("plugins\\ChainGather\\config.json");
const defaultState = conf.init("defaultState", false);
const blockList = conf.init("blockList", {
    undefined: {},
    empty: {},
    "minecraft:wooden_pickaxe": {
        "minecraft:coal_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
    },
    "minecraft:stone_pickaxe": {
        "minecraft:iron_ore": 32,
        "minecraft:lapis_ore": 32,
        "minecraft:coal_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:deepslate_iron_ore": 32,
        "minecraft:deepslate_lapis_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
    },
    "minecraft:iron_pickaxe": {
        "minecraft:iron_ore": 32,
        "minecraft:gold_ore": 32,
        "minecraft:diamond_ore": 32,
        "minecraft:lapis_ore": 32,
        "minecraft:redstone_ore": 32,
        "minecraft:lit_redstone_ore": 32,
        "minecraft:coal_ore": 32,
        "minecraft:copper_ore": 32,
        "minecraft:emerald_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:deepslate_iron_ore": 32,
        "minecraft:deepslate_gold_ore": 32,
        "minecraft:deepslate_diamond_ore": 32,
        "minecraft:deepslate_lapis_ore": 32,
        "minecraft:deepslate_redstone_ore": 32,
        "minecraft:lit_deepslate_redstone_ore": 32,
        "minecraft:deepslate_emerald_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
        "minecraft:deepslate_copper_ore": 32,
    },
    "minecraft:diamond_pickaxe": {
        "minecraft:iron_ore": 32,
        "minecraft:gold_ore": 32,
        "minecraft:diamond_ore": 32,
        "minecraft:lapis_ore": 32,
        "minecraft:redstone_ore": 32,
        "minecraft:lit_redstone_ore": 32,
        "minecraft:coal_ore": 32,
        "minecraft:copper_ore": 32,
        "minecraft:emerald_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:ancient_debris": 32,
        "minecraft:deepslate_iron_ore": 32,
        "minecraft:deepslate_gold_ore": 32,
        "minecraft:deepslate_diamond_ore": 32,
        "minecraft:deepslate_lapis_ore": 32,
        "minecraft:deepslate_redstone_ore": 32,
        "minecraft:lit_deepslate_redstone_ore": 32,
        "minecraft:deepslate_emerald_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
        "minecraft:deepslate_copper_ore": 32,
    },
    "minecraft:netherite_pickaxe": {
        "minecraft:iron_ore": 32,
        "minecraft:gold_ore": 32,
        "minecraft:diamond_ore": 32,
        "minecraft:lapis_ore": 32,
        "minecraft:redstone_ore": 32,
        "minecraft:lit_redstone_ore": 32,
        "minecraft:coal_ore": 32,
        "minecraft:copper_ore": 32,
        "minecraft:emerald_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:ancient_debris": 32,
        "minecraft:deepslate_iron_ore": 32,
        "minecraft:deepslate_gold_ore": 32,
        "minecraft:deepslate_diamond_ore": 32,
        "minecraft:deepslate_lapis_ore": 32,
        "minecraft:deepslate_redstone_ore": 32,
        "minecraft:lit_deepslate_redstone_ore": 32,
        "minecraft:deepslate_emerald_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
        "minecraft:deepslate_copper_ore": 32,
    },
    "minecraft:golden_pickaxe": {
        "minecraft:coal_ore": 32,
        "minecraft:quartz_ore": 32,
        "minecraft:nether_gold_ore": 32,
        "minecraft:deepslate_coal_ore": 32,
    },
    "minecraft:wooden_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
    "minecraft:stone_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
    "minecraft:iron_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
    "minecraft:diamond_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
    "minecraft:netherite_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
    "minecraft:golden_axe": {
        "minecraft:log": 32,
        "minecraft:log2": 32,
        "minecraft:crimson_stem": 32,
        "minecraft:warped_stem": 32,
        "minecraft:brown_mushroom_block": 32,
        "minecraft:red_mushroom_block": 32,
    },
});
conf.close();
const durability = {
    wooden: 59,
    stone: 131,
    iron: 250,
    diamond: 1561,
    netherite: 2031,
};
const db = {};
mc.listen("onJoin", (pl) => (db[pl.xuid] = defaultState));
mc.listen("onUseItemOn", (pl, it, _bl, _side, _pos) => {
    if (!(it.type in blockList)) return;
    pl.tell(
        `连锁采集已${
            (db[ori.player.xuid] = db[ori.player.xuid] ? false : true)
                ? "启用"
                : "禁用"
        }`,
        5
    );
});
mc.listen("onDestroyBlock", (player, block) => {
    const item = player.getHand();
    const isNull = item.isNull();
    const maxChain = (
        isNull
            ? blockList.empty
            : !blockList[item.type]
            ? blockList.undefined
            : blockList[item.type]
    )[block.type];
    if (!db[player.xuid] || player.gameMode == 1 || !maxChain || maxChain < 1)
        return;
    const tag = item.getNbt().getTag("tag");
    const ench = tag ? tag.getData("ench") : undefined;
    let haveSilk = 0;
    let unbreaking = 100;
    if (ench)
        for (const e of ench.toArray()) {
            haveSilk = e.id == 16 ? e.id : haveSilk;
            unbreaking = e.id == 17 ? 100 / (e.lvl + 1) : unbreaking;
        }
    if (haveSilk) return;
    let lessDurability = 2031;
    for (const k in durability) {
        if (!new RegExp(k).test(item.type)) continue;
        lessDurability = durability[k];
    }
    destroy(player, block, isNull, item, unbreaking, lessDurability, maxChain);
});
function destroy(
    player,
    block,
    isNull,
    item,
    unbreaking,
    lessDurability,
    maxChain
) {
    let chainCount = 0;
    for (
        let i = 0, j = 1;
        i < 3;
        i = j == -1 ? i + 1 : i, j = j == 1 ? -1 : 1
    ) {
        const x = i == 0 ? block.pos.x + j : block.pos.x;
        const y = i == 1 ? block.pos.y + j : block.pos.y;
        const z = i == 2 ? block.pos.z + j : block.pos.z;
        if (chainCount >= maxChain || (!isNull && item.isNull())) continue;
        const nextBlock = mc.getBlock(x, y, z, block.pos.dimid);
        if (
            !ll.hasExported("ILAPI_PosGetLand") ||
            (ll.hasExported("ILAPI_PosGetLand") &&
                ll.import("ILAPI_PosGetLand")({
                    x: x,
                    y: y,
                    z: z,
                    dimid: block.pos.dimid,
                }) == "-1" &&
                nextBlock.type == block.type &&
                nextBlock.destroy(true))
        ) {
            chainCount++;
            if (Math.floor(Math.random() * 99) < unbreaking && !isNull) {
                const nbt = item.getNbt();
                let tag = nbt.getTag("tag");
                if (!tag) {
                    nbt.setTag(
                        "tag",
                        new NbtCompound({
                            Damage: new NbtInt(0),
                        })
                    );
                    tag = nbt.getTag("tag");
                }
                let data = tag.getData("Damage") ?? 0;
                if (++data < lessDurability) {
                    tag.setInt("Damage", data);
                    item.setNbt(nbt);
                } else item.setNull();
                player.refreshItems();
            }
            chainCount += destroy(
                player,
                nextBlock,
                isNull,
                item,
                unbreaking,
                lessDurability,
                maxChain
            );
        }
    }
    return chainCount;
}
