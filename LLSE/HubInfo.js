/*
English:
    HubInfo
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
    信息栏
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
ll.registerPlugin("HubInfo", "信息栏", [1, 0, 0]);

const config = new JsonConfigFile("plugins/HubInfo/config.json");
const command = config.init("command", "hubinfo");
const serverName = config.init("serverName", "");
config.close();
const db = new KVDatabase("plugins/HubInfo/data");
const cmd = mc.newCommand(command, "修改信息栏状态。", PermType.Any);
cmd.overload();
cmd.setCallback((_cmd, ori, out, _res) => {
    if (!ori.player) return out.error("commands.generic.noTargetMatch");
    db.set(ori.player.xuid, !db.get(ori.player.xuid));
    out.success(`信息栏${db.get(ori.player.xuid) ? "已启用" : "已禁用"}`);
});
cmd.setup();
setInterval(() => {
    const tps = ll.hasExported("TPSAPI", "GetRealTPS")
        ? ll.imports("TPSAPI", "GetRealTPS")()
        : 20;
    const workingSet = ll.hasExported("InfoAPI", "GetWorkingSet")
        ? ll.imports("InfoAPI", "GetWorkingSet")()
        : 0;
    for (const player of mc.getOnlinePlayers()) {
        player.removeSidebar();
        if (!db.get(player.xuid)) continue;
        const dv = player.getDevice();
        const list = {};
        if (dv.lastPacketLoss > 0)
            list[`§${dv.lastPacketLoss > 0 ? "c" : "a"}丢包`] = Math.round(
                dv.lastPacketLoss * 100
            );
        if (dv.lastPing > 0)
            list[
                `§${
                    dv.lastPing < 30
                        ? "a"
                        : dv.lastPing < 50
                        ? "e"
                        : dv.lastPing < 100
                        ? "c"
                        : dv.lastPing < 200
                        ? "4"
                        : dv.lastPing < 500
                        ? 0
                        : "b"
                }时延`
            ] = dv.lastPing;
        if (tps < 20)
            list[
                `§${
                    tps > 6 * 3
                        ? "a"
                        : tps > 7 * 2
                        ? "e"
                        : tps > 3 * 3
                        ? "c"
                        : tps > 5
                        ? "4"
                        : 0
                }负载`
            ] = 100 - tps * 5;
        if (workingSet > 0) list["内存"] = workingSet / 2 ** 20;
        player.setSidebar(" ", list);
    }
}, 1000);
