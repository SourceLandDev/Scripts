/*
English:
    ChainGather
    Copyright (C) 2022  StarsDream00 starsdream00@icloud.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

中文：
    连锁采集
    版权所有 © 2022  星梦喵吖 starsdream00@icloud.com
    本程序是自由软件：你可以根据自由软件基金会发布的GNU Affero通用公共许可证的条款，即许可证的第3版，
    或（您选择的）任何后来的版本重新发布和/或修改它。

    本程序的分发是希望它能发挥价值，但没有做任何保证；甚至没有隐含的适销对路或适合某一特定目的的保证。
    更多细节请参见GNU Affero通用公共许可证。

    您应该已经收到了一份GNU Affero通用公共许可证的副本。如果没有，
    请参阅<https://www.gnu.org/licenses/>（<https://www.gnu.org/licenses/agpl-3.0.html>）
    及其非官方中文翻译<https://www.chinasona.org/gnu/agpl-3.0-cn.html>。
*/

"use strict";
ll.registerPlugin("ChainGather", "连锁采集", [1, 0, 0]);

const conf = new JsonConfigFile("plugins/ChainGather/config.json");
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
const array = [];
mc.listen("onJoin", (pl) => (db[pl.xuid] = defaultState));
mc.listen("onUseItem", (pl, it) => {
    if (!(it.type in blockList)) return;
    array.push(pl.xuid);
    setTimeout(() => {
        const index = array.indexOf(pl.xuid);
        if (index < 0) return;
        array.splice(index, 1);
        pl.tell(
            `连锁采集已${
                (db[pl.xuid] = db[pl.xuid] ? false : true) ? "启用" : "禁用"
            }`,
            5
        );
    }, 100);
    return false;
});
mc.listen("onStartDestroyBlock", (pl) => {
    const index = array.indexOf(pl.xuid);
    if (index < 0) return;
    array.splice(index, 1);
});
mc.listen("onDestroyBlock", (pl, bl) => {
    const it = pl.getHand();
    const isNull = it.isNull();
    const maxChain = (
        isNull
            ? blockList.empty
            : !blockList[it.type]
            ? blockList.undefined
            : blockList[it.type]
    )[bl.type];
    if (!db[pl.xuid] || pl.gameMode == 1 || !maxChain || maxChain < 1) return;
    const tag = it.getNbt().getTag("tag");
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
        if (!new RegExp(k).test(it.type)) continue;
        lessDurability = durability[k];
    }
    destroy(pl, bl, isNull, it, unbreaking, lessDurability, maxChain);
});
function destroy(pl, bl, isNull, it, unbreaking, lessDurability, maxChain) {
    if (!bl) return;
    let chainCount = 0;
    for (
        let i = 0, j = 1;
        i < 3;
        i = j == -1 ? i + 1 : i, j = j == 1 ? -1 : 1
    ) {
        const x = i == 0 ? bl.pos.x + j : bl.pos.x;
        const y = i == 1 ? bl.pos.y + j : bl.pos.y;
        const z = i == 2 ? bl.pos.z + j : bl.pos.z;
        if (chainCount >= maxChain || (!isNull && it.isNull())) continue;
        const nextBlock = mc.getBlock(x, y, z, bl.pos.dimid);
        if (
            (!ll.hasExported("landEX_GetHasPLandPermbyPos") ||
                (ll.hasExported("landEX_GetHasPLandPermbyPos") &&
                    !ll.imports("landEX_GetHasPLandPermbyPos")(
                        x,
                        y,
                        z,
                        bl.pos.dimid
                    ))) &&
            (!ll.hasExported("ILAPI_PosGetLand") ||
                (ll.hasExported("ILAPI_PosGetLand") &&
                    ll.imports("ILAPI_PosGetLand")({
                        x: x,
                        y: y,
                        z: z,
                        dimid: bl.pos.dimid,
                    }) == "-1")) &&
            nextBlock.type == bl.type &&
            nextBlock.destroy(true)
        ) {
            chainCount++;
            if (Math.floor(Math.random() * 99) < unbreaking && !isNull) {
                const nbt = it.getNbt();
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
                    it.setNbt(nbt);
                } else it.setNull();
                pl.refreshItems();
            }
            chainCount += destroy(
                pl,
                nextBlock,
                isNull,
                it,
                unbreaking,
                lessDurability,
                maxChain
            );
        }
    }
    return chainCount;
}
