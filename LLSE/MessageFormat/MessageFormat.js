/*
English:
    MessageFormat
    Copyright (C) 2023  Hosiyume starsdream00@icloud.com

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
    消息格式化
    版权所有 © 2023  予纾 starsdream00@icloud.com
    本程序是自由软件：你可以根据自由软件基金会发布的GNU Affero通用公共许可证的条款，即许可证的第3版，
    或（您选择的）任何后来的版本重新发布和/或修改它。

    本程序的分发是希望它能发挥价值，但没有做任何保证；甚至没有隐含的适销对路或适合某一特定目的的保证。
    更多细节请参见GNU Affero通用公共许可证。

    您应该已经收到了一份GNU Affero通用公共许可证的副本。如果没有，
    请参阅<https://www.gnu.org/licenses/>（<https://www.gnu.org/licenses/agpl-3.0.html>）
    及其非官方中文翻译<https://www.chinasona.org/gnu/agpl-3.0-cn.html>。
*/

"use strict";

const db = new KVDatabase("plugins/MessageFormat/data");
mc.listen("onServerStarted", () => {
    const muteCommand = mc.newCommand("mute", "禁言。", PermType.GameMasters);
    muteCommand.mandatory("player", ParamType.Player);
    muteCommand.optional("min", ParamType.Int);
    muteCommand.overload(["player", "min"]);
    muteCommand.setCallback((_cmd, _ori, out, res) => {
        if (!res.player || res.player.length <= 0)
            return out.error("commands.generic.noTargetMatch");
        const names = [];
        for (const pl of res.player) {
            db.set(pl.xuid, ("min" in res) ? (res.min * 60 * 20) : false);
            names.push(pl.realName);
        }
        out.success(`${names.join("、")}已被禁言${parseTime(res.tick)}`);
    });
    muteCommand.setup();
    const unmuteCommand = mc.newCommand(
        "unmute",
        "解除禁言。",
        PermType.GameMasters
    );
    unmuteCommand.mandatory("player", ParamType.Player);
    unmuteCommand.overload(["player"]);
    unmuteCommand.setCallback((_cmd, _ori, out, res) => {
        if (!res.player || res.player.length <= 0)
            return out.error("commands.generic.noTargetMatch");
        const names = [];
        for (const pl of res.player) {
            if (db.get(pl.xuid) === undefined) return;
            db.delete(pl.xuid);
            names.push(pl.realName);
        }
        out.success(`已解除${names.join("、")}的禁言`);
    });
    unmuteCommand.setup();
});
const msgs = {};
mc.listen("onChat", (pl, msg) => {
    const time = system.getTimeObj();
    const msgHead = `${
        ll.hasExported("UserName", "Get")
            ? ll.imports("UserName", "Get")(pl)
            : pl.realName
    }§r ${time.h < 10 ? 0 : ""}${time.h}:${time.m < 10 ? 0 : ""}${time.m}\n`;
    if (db.get(pl.xuid) !== undefined)
        for (const player of mc.getOnlinePlayers())
            player.tell(
                `${msgHead}${player.xuid == pl.xuid ? msg : "§o已被屏蔽"}`
            );
    else mc.broadcast(`${msgHead}${msg}`);
    const xuid = pl.xuid;
    if (!msgs[xuid]) msgs[xuid] = [];
    msgs[xuid].push([time, msg]);
    rename(pl, true);
    setTimeout(() => {
        msgs[xuid].shift();
        rename(xuid);
    }, 10000);
    return false;
});
mc.listen("onTick", () => {
    for (const pl of mc.getOnlinePlayers()) {
        const tick = db.get(pl.xuid);
        if (typeof tick !== "number") continue;
        if (tick > 0) {
            db.set(pl.xuid, tick - 1);
            continue;
        }
        db.delete(pl.xuid);
    }
});

function rename(pl, isObj) {
    if (!isObj) {
        pl = mc.getPlayer(pl);
        if (!pl) return;
    }
    let strOfMsgs = "";
    for (const msg of msgs[pl.xuid] ?? [])
        strOfMsgs += `${msg[0].h}:${msg[0].m < 10 ? 0 : ""}${msg[0].m} ${
            msg[1]
        }§r\n`;
    pl.rename(
        `${strOfMsgs}${
            ll.hasExported("UserName", "Get")
                ? ll.imports("UserName", "Get")(pl)
                : pl.realName
        }`
    );
}
function parseTime(tick) {
    let result = "";
    let link = {
        base: 20,
        name: "秒",
        next: {
            base: 60,
            name: "分",
            next: {
                base: 60,
                name: "小时",
                next: {
                    base: 24,
                    name: "天",
                    next: {
                        base: 30,
                        name: "月",
                        next: { base: 4, name: "年" }
                    }
                }
            }
        }
    };
    while (link.next) {
        tick = tick / link.base;
        if (tick < 1) break;
        let time = Math.round(tick) % link.next.base;
        if (time > 0) result = `${time}${link.name}${result}`;
        link = link.next;
    }
    return result;
}
