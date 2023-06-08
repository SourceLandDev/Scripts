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

const conf = new JsonConfigFile("plugins/ChainGather/config.json");
const defaultState = conf.init("defaultState", false);
const maxChain = conf.init("maxChain", 64);
const blockList = conf.init("blockList", {
    "minecraft:wooden_pickaxe": [
        "minecraft:coal_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:deepslate_coal_ore",
    ],
    "minecraft:stone_pickaxe": [
        "minecraft:iron_ore",
        "minecraft:lapis_ore",
        "minecraft:coal_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:deepslate_iron_ore",
        "minecraft:deepslate_lapis_ore",
        "minecraft:deepslate_coal_ore",
    ],
    "minecraft:iron_pickaxe": [
        "minecraft:iron_ore",
        "minecraft:gold_ore",
        "minecraft:diamond_ore",
        "minecraft:lapis_ore",
        "minecraft:redstone_ore",
        "minecraft:lit_redstone_ore",
        "minecraft:coal_ore",
        "minecraft:copper_ore",
        "minecraft:emerald_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:deepslate_iron_ore",
        "minecraft:deepslate_gold_ore",
        "minecraft:deepslate_diamond_ore",
        "minecraft:deepslate_lapis_ore",
        "minecraft:deepslate_redstone_ore",
        "minecraft:lit_deepslate_redstone_ore",
        "minecraft:deepslate_emerald_ore",
        "minecraft:deepslate_coal_ore",
        "minecraft:deepslate_copper_ore",
    ],
    "minecraft:diamond_pickaxe": [
        "minecraft:iron_ore",
        "minecraft:gold_ore",
        "minecraft:diamond_ore",
        "minecraft:lapis_ore",
        "minecraft:redstone_ore",
        "minecraft:lit_redstone_ore",
        "minecraft:coal_ore",
        "minecraft:copper_ore",
        "minecraft:emerald_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:ancient_debris",
        "minecraft:deepslate_iron_ore",
        "minecraft:deepslate_gold_ore",
        "minecraft:deepslate_diamond_ore",
        "minecraft:deepslate_lapis_ore",
        "minecraft:deepslate_redstone_ore",
        "minecraft:lit_deepslate_redstone_ore",
        "minecraft:deepslate_emerald_ore",
        "minecraft:deepslate_coal_ore",
        "minecraft:deepslate_copper_ore",
    ],
    "minecraft:netherite_pickaxe": [
        "minecraft:iron_ore",
        "minecraft:gold_ore",
        "minecraft:diamond_ore",
        "minecraft:lapis_ore",
        "minecraft:redstone_ore",
        "minecraft:lit_redstone_ore",
        "minecraft:coal_ore",
        "minecraft:copper_ore",
        "minecraft:emerald_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:ancient_debris",
        "minecraft:deepslate_iron_ore",
        "minecraft:deepslate_gold_ore",
        "minecraft:deepslate_diamond_ore",
        "minecraft:deepslate_lapis_ore",
        "minecraft:deepslate_redstone_ore",
        "minecraft:lit_deepslate_redstone_ore",
        "minecraft:deepslate_emerald_ore",
        "minecraft:deepslate_coal_ore",
        "minecraft:deepslate_copper_ore",
    ],
    "minecraft:golden_pickaxe": [
        "minecraft:coal_ore",
        "minecraft:quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:deepslate_coal_ore",
    ],
    "minecraft:wooden_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
    "minecraft:stone_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
    "minecraft:iron_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
    "minecraft:diamond_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
    "minecraft:netherite_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
    "minecraft:golden_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:brown_mushroom_block",
        "minecraft:red_mushroom_block",
    ],
});
conf.close();
const states = {};
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
        : !blockList[it.type]
        ? blockList.undefined
        : blockList[it.type];
    if (!states[pl.xuid] || !effectBlocks || effectBlocks.indexOf(bl.type) < 0)
        return;
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
            destroyingBlocks.indexOf(`${x} ${y} ${z} ${bl.pos.dimid}`) >= 0 ||
            !pl.canDestroy(bl) ||
            nextBlock.type != bl.type
        )
            continue;
        pl.destroyBlock(nextBlock);
    }
    destroyingBlocks.splice(
        destroyingBlocks.indexOf(
            `${bl.pos.x} ${bl.pos.y} ${bl.pos.z} ${bl.pos.dimid}`
        ),
        1
    );
});
