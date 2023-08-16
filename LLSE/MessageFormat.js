/*
English:
    MessageFormat
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
    消息格式化
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
ll.registerPlugin("MessageFormat", "消息格式化", [1, 0, 0]);

const msgs = {};
mc.listen("onChat", (pl, msg) => {
    const time = system.getTimeObj();
    mc.broadcast(
        `${time.h < 10 ? 0 : ""}${time.h}:${time.m < 10 ? 0 : ""}${time.m} ${
            ll.hasExported("UserName", "Get")
                ? ll.imports("UserName", "Get")(pl)
                : pl.realName
        }§r：${msg}`
    );
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
