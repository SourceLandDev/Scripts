/*
English:
    BlockIslandAllocation
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
    岛屿分配系统
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
ll.registerPlugin("BlockIslandAllocation", "岛屿分配系统", [1, 0, 0]);

const db = new KVDatabase("plugins/BlockIslandAllocation/data");
if (!db.get("spawn"))
    db.set("spawn", { version: "spawn", pos: { x: 0, y: -(2 ** 6), z: 0 } });
mc.listen("onPlaceBlock", (pl, bl) => {
    if (
        (bl.pos.x < 2 ** 9 - 1 && bl.pos.x > -(2 ** 9)) ||
        (bl.pos.z < 2 ** 9 - 1 && bl.pos.z > -(2 ** 9))
    ) {
        pl.tell("你不能操作这片区域");
        return false;
    }
});
mc.listen("onDestroyBlock", (pl, bl) => {
    let re = true;
    for (const key of db.listKey()) {
        const island = db.get(key);
        if (
            island.pos.x != bl.pos.x ||
            island.pos.y != bl.pos.y ||
            island.pos.z != bl.pos.z
        )
            continue;
        re = false;
        let name = data.xuid2name(key);
        if (ll.hasExported("UserName", "GetFromXuid"))
            name = ll.imports("UserName", "GetFromXuid")(key);
        pl.tell(`§c你不能破坏${pl.xuid == key ? "你自己" : name}的核心方块`, 4);
        break;
    }
    return re;
});
function sendInit(pl) {
    if (db.get(pl.xuid)) return;
    pl.sendForm(
        mc
            .newSimpleForm()
            .setTitle("开始菜单")
            .setContent("欢迎来到方屿！")
            .addButton("经典单方块", "textures/ui/sword")
            .addButton("经典空岛", "textures/ui/sword")
            .addButton("与在线用户组队", "textures/ui/FriendsIcon"),
        (pl, arg) => {
            if (arg == null) return sendInit(pl);
            switch (arg) {
                case 0: {
                    pl.tell("您选择了「经典单方块」\n正在为您分配，请稍候……");
                    const x = returnPos(true);
                    const y = randomInt(2 ** 6 + 2 ** 5, 2 ** 8 + 2 ** 5);
                    const z = returnPos(false);
                    pl.setRespawnPosition(x, y + 1, z, 0);
                    const timerid = setInterval(() => {
                        if (
                            mc.setBlock(x, y, z, 0, "minecraft:grass", 0) &&
                            mc.setBlock(x, y + 1, z, 0, "minecraft:sapling", 0)
                        )
                            clearInterval(timerid);
                        else pl.teleport(x, y + 1, z, 0);
                    }, 50);
                    db.set(pl.xuid, {
                        version: "classic",
                        pos: { x: x, y: y, z: z },
                    });
                    return pl.tell("分配完毕");
                }
                case 1: {
                    const x = returnPos(true);
                    const y = randomInt(96, 288);
                    const z = returnPos(false);
                    pl.setRespawnPosition(x, y, z, 0);
                    mc.runcmdEx(
                        `structure load common_island_${0} ${x - 4} ${y - 5} ${
                            z - 4
                        }`
                    );
                    pl.teleport(x, y, z, 0);
                    db.set(pl.xuid, {
                        version: "common_island",
                        pos: { x: x, y: y, z: z },
                    });
                    return pl.tell("分配完毕");
                }
                case 2:
                    const options = [];
                    const xuids = [];
                    for (const key of db.listKey()) {
                        const dt = db.get(key);
                        if (
                            dt.version == "team" ||
                            dt.version == "spawn" ||
                            !mc.getPlayer(key)
                        )
                            continue;
                        let name = data.xuid2name(key);
                        if (ll.hasExported("UserName", "GetFromXuid"))
                            name = ll.imports("UserName", "GetFromXuid")(key);
                        options.push(`${name}（${dt.version}）`);
                        xuids.push(key);
                    }
                    if (xuids.length <= 0) {
                        pl.tell("§c暂无可组队用户");
                        return sendInit(pl);
                    }
                    const fm = mc.newCustomForm();
                    fm.setTitle("与在线用户组队");
                    fm.addDropdown("用户", options);
                    pl.sendForm(fm, (pl, args) => {
                        if (!args) return sendInit(pl);
                        const pl1 = mc.getPlayer(xuids[args[0]]);
                        if (!pl1) {
                            let name = data.xuid2name(xuids[args[0]]);
                            if (ll.hasExported("UserName", "GetFromXuid"))
                                name = ll.imports(
                                    "UserName",
                                    "GetFromXuid"
                                )(xuids[args[0]]);
                            pl.tell(`§c${name}已离线`);
                            return sendInit(pl);
                        }
                        let name = pl.realName;
                        if (ll.hasExported("UserName", "Get"))
                            name = ll.imports("UserName", "Get")(pl);
                        pl1.sendModalForm(
                            "组队请求",
                            `${name}请求与您组队`,
                            "同意",
                            "拒绝",
                            (pl1, arg) => {
                                if (!mc.getPlayer(pl.xuid)) return;
                                if (!arg) {
                                    pl.tell(
                                        `§c与${pl1.realName}的组队请求被拒绝`
                                    );
                                    return sendInit(pl);
                                }
                                const d2 = db.get(pl1.xuid);
                                pl.setRespawnPosition(
                                    d2.pos.x,
                                    d2.pos.y + 1,
                                    d2.pos.z,
                                    0
                                );
                                pl.teleport(
                                    d2.pos.x,
                                    d2.pos.y + 1,
                                    d2.pos.z,
                                    0
                                );
                                db.set(pl.xuid, {
                                    version: "team",
                                    pos: d2.pos,
                                });
                                pl.tell(`与${pl1.realName}组队成功`);
                            }
                        );
                    });
            }
        }
    );
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function returnPos(isX) {
    let pos = randomInt(-(2 ** 16), 2 ** 16);
    for (const key of db.listKey()) {
        const dt = db.get(key);
        if (
            dt.version == "team" ||
            Math.abs((isX ? dt.pos.x : dt.pos.z) - pos) > 2 ** 9
        )
            continue;
        pos = returnPos(isX);
    }
    return pos;
}
ll.exports(sendInit, "BlockIsland", "sendInit");
function removeData(pl) {
    db.delete(pl.xuid);
    pl.getInventory().removeAllItems();
    sendInit(pl.xuid);
}
