/*
English:
    ChainGather
    Copyright (C) 2023  StarsDream00 starsdream00@icloud.com

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
    版权所有 © 2023  星梦喵吖 starsdream00@icloud.com
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

const config = new JsonConfigFile("plugins/ChainGather/config.json");
const defaultState = config.init("defaultState", false);
const maxChain = config.init("maxChain", 64);
const blockList = config.init("blockList", {
    "minecraft:wooden_pickaxe": {
        undefined: {
            "minecraft:coal_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:stone_pickaxe": {
        undefined: {
            "minecraft:iron_ore": undefined,
            "minecraft:lapis_ore": undefined,
            "minecraft:coal_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:deepslate_iron_ore": undefined,
            "minecraft:deepslate_lapis_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:iron_pickaxe": {
        undefined: {
            "minecraft:iron_ore": undefined,
            "minecraft:gold_ore": undefined,
            "minecraft:diamond_ore": undefined,
            "minecraft:lapis_ore": undefined,
            "minecraft:redstone_ore": undefined,
            "minecraft:lit_redstone_ore": undefined,
            "minecraft:coal_ore": undefined,
            "minecraft:copper_ore": undefined,
            "minecraft:emerald_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:deepslate_iron_ore": undefined,
            "minecraft:deepslate_gold_ore": undefined,
            "minecraft:deepslate_diamond_ore": undefined,
            "minecraft:deepslate_lapis_ore": undefined,
            "minecraft:deepslate_redstone_ore": undefined,
            "minecraft:lit_deepslate_redstone_ore": undefined,
            "minecraft:deepslate_emerald_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
            "minecraft:deepslate_copper_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:diamond_pickaxe": {
        undefined: {
            "minecraft:iron_ore": undefined,
            "minecraft:gold_ore": undefined,
            "minecraft:diamond_ore": undefined,
            "minecraft:lapis_ore": undefined,
            "minecraft:redstone_ore": undefined,
            "minecraft:lit_redstone_ore": undefined,
            "minecraft:coal_ore": undefined,
            "minecraft:copper_ore": undefined,
            "minecraft:emerald_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:ancient_debris": undefined,
            "minecraft:deepslate_iron_ore": undefined,
            "minecraft:deepslate_gold_ore": undefined,
            "minecraft:deepslate_diamond_ore": undefined,
            "minecraft:deepslate_lapis_ore": undefined,
            "minecraft:deepslate_redstone_ore": undefined,
            "minecraft:lit_deepslate_redstone_ore": undefined,
            "minecraft:deepslate_emerald_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
            "minecraft:deepslate_copper_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:netherite_pickaxe": {
        undefined: {
            "minecraft:iron_ore": undefined,
            "minecraft:gold_ore": undefined,
            "minecraft:diamond_ore": undefined,
            "minecraft:lapis_ore": undefined,
            "minecraft:redstone_ore": undefined,
            "minecraft:lit_redstone_ore": undefined,
            "minecraft:coal_ore": undefined,
            "minecraft:copper_ore": undefined,
            "minecraft:emerald_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:ancient_debris": undefined,
            "minecraft:deepslate_iron_ore": undefined,
            "minecraft:deepslate_gold_ore": undefined,
            "minecraft:deepslate_diamond_ore": undefined,
            "minecraft:deepslate_lapis_ore": undefined,
            "minecraft:deepslate_redstone_ore": undefined,
            "minecraft:lit_deepslate_redstone_ore": undefined,
            "minecraft:deepslate_emerald_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
            "minecraft:deepslate_copper_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:golden_pickaxe": {
        undefined: {
            "minecraft:coal_ore": undefined,
            "minecraft:quartz_ore": undefined,
            "minecraft:nether_gold_ore": undefined,
            "minecraft:deepslate_coal_ore": undefined,
        },
        16: {
            price: 1,
            "minecraft:ice": undefined,
            "minecraft:blue_ice": undefined,
            "minecraft:packed_ice": undefined,
        },
    },
    "minecraft:wooden_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:stone_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:iron_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:diamond_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:netherite_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:golden_axe": {
        undefined: {
            "minecraft:oak_log": 0,
            "minecraft:spruce_log": 0,
            "minecraft:birch_log": 0,
            "minecraft:jungle_log": 0,
            "minecraft:acacia_log": 0,
            "minecraft:dark_oak_log": 0,
            "minecraft:mangrove_log": 0,
            "minecraft:cherry_log": 0,
            "minecraft:crimson_stem": 0,
            "minecraft:warped_stem": 0,
            "minecraft:pumpkin": undefined,
            "minecraft:melon_block": undefined,
            "minecraft:brown_mushroom_block": undefined,
            "minecraft:red_mushroom_block": undefined,
            "minecraft:cocoa": undefined,
        },
    },
    "minecraft:wooden_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
    "minecraft:stone_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
    "minecraft:iron_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
    "minecraft:diamond_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
    "minecraft:golden_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
    "minecraft:netherite_hoe": {
        undefined: {
            "minecraft:sculk": undefined,
            "minecraft:sponge": undefined,
            "minecraft:wheat": 7,
            "minecraft:potatoes": 7,
            "minecraft:carrot": 7,
            "minecraft:beetroot": 7,
            "minecraft:brown_mushroom": undefined,
            "minecraft:red_mushroom": undefined,
            "minecraft:nether_wart": 3,
        },
    },
});
const currencyType = config.init("currencyType", "llmoney");
const currencyName = config.init("currencyName", "元");
const eco = (() => {
    switch (currencyType) {
        case "llmoney":
            return {
                add: (pl, money) => pl.addMoney(money),
                reduce: (pl, money) => pl.reduceMoney(money),
                get: (pl) => pl.getMoney(),
                name: currencyName,
            };
        case "scoreboard":
            const scoreboard = config.init("scoreboard", "money");
            return {
                add: (pl, money) => pl.addScore(scoreboard, money),
                reduce: (pl, money) => pl.reduceScore(scoreboard, money),
                get: (pl) => pl.getScore(scoreboard),
                name: currencyName,
            };
        case "exp":
            return {
                add: (pl, money) => pl.addExperience(money),
                reduce: (pl, money) => pl.reduceExperience(money),
                get: (pl) => pl.getTotalExperience(),
                name: "经验值",
            };
        default:
            throw "配置项异常！";
    }
})();
const command = config.init("command", "paidchaingather");
config.close();
const states = {};
const paidStates = {};
const destroyingBlocks = [];
mc.listen("onUseItemOn", (pl, it, _bl, _side, _pos) => {
    if (!(it.type in blockList)) return;
    pl.tell(
        `连锁采集已${
            (states[pl.xuid] = states[pl.xuid] ?? defaultState ? false : true)
                ? "启用"
                : "禁用"
        }`,
        5
    );
    return false;
});
mc.listen("onDestroyBlock", (pl, bl) => {
    const it = pl.getHand();
    const effectBlocks = it.isNull()
        ? blockList.empty
        : it.type in blockList
        ? blockList[it.type]
        : blockList.undefined;
    if (!states[pl.xuid] || !effectBlocks) return;
    let available =
        "undefined" in effectBlocks
            ? bl.type in effectBlocks.undefined &&
              bl.aux == effectBlocks.undefined[bl.type]
            : false;
    let price =
        "undefined" in effectBlocks ? effectBlocks.undefined.price ?? 0 : 0;
    const tag = it.getNbt().getTag("tag");
    const ench = tag ? tag.getData("ench") : undefined;
    if (!available && ench)
        for (const e of ench.toArray()) {
            if (
                !(e in effectBlocks) ||
                !(bl.type in effectBlocks[e]) ||
                bl.aux != effectBlocks[e][bl.type]
            )
                continue;
            available = true;
            price = effectBlocks[e].price ?? 0;
        }
    if (!available || (price > 0 && !paidStates[pl.xuid])) return;
    destroyingBlocks.push(
        `${bl.pos.x} ${bl.pos.y} ${bl.pos.z} ${bl.pos.dimid}`
    );
    for (
        let i = 0, j = 1;
        i < 3;
        i = j == -1 ? i + 1 : i, j = j == 1 ? -1 : 1
    ) {
        const x = i == 0 ? bl.pos.x + j : bl.pos.x;
        const y = i == 1 ? bl.pos.y + j : bl.pos.y;
        const z = i == 2 ? bl.pos.z + j : bl.pos.z;
        const nextBlock = mc.getBlock(x, y, z, bl.pos.dimid);
        if (destroyingBlocks.length > maxChain) break;
        if (
            (ll.hasExported("landEX_GetHasPLandPermbyPos") &&
                ll.imports("landEX_GetHasPLandPermbyPos")(
                    x,
                    y,
                    z,
                    bl.pos.dimid
                )) ||
            (ll.hasExported("ILAPI_PosGetLand") &&
                ll.imports("ILAPI_PosGetLand")({
                    x: x,
                    y: y,
                    z: z,
                    dimid: bl.pos.dimid,
                }) != -1) ||
            (ll.hasExported("Territory", "HasPermission") &&
                !ll.imports("Territory", "HasPermission")(
                    pl.xuid,
                    x,
                    y,
                    z,
                    bl.pos.dimid,
                    "DestroyBlock"
                )) ||
            destroyingBlocks.indexOf(`${x} ${y} ${z} ${bl.pos.dimid}`) >= 0 ||
            !pl.canDestroy(bl) ||
            nextBlock.type != bl.type
        )
            continue;
        pl.destroyBlock(nextBlock);
        if (price <= 0) continue;
        eco.reduce(pl, price);
    }
    destroyingBlocks.splice(
        destroyingBlocks.indexOf(
            `${bl.pos.x} ${bl.pos.y} ${bl.pos.z} ${bl.pos.dimid}`
        ),
        1
    );
});
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand(command, "修改付费连锁采集状态。", PermType.Any);
    cmd.overload();
    cmd.setCallback((_cmd, ori, out, _res) => {
        if (!ori.player) return out.error("commands.generic.noTargetMatch");
        pl.tell(
            `付费连锁采集已${
                (paidStates[pl.xuid] = paidStates[pl.xuid] ? false : true)
                    ? "启用"
                    : "禁用"
            }`,
            5
        );
    });
    cmd.setup();
});
