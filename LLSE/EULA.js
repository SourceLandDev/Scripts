/*
English:
    EULA
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
    用户协议
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
ll.registerPlugin("EULA", "用户协议", [1, 0, 0]);

const config = new JsonConfigFile("plugins/EULA/config.json");
const serverName = config.init("serverName", "");
config.close();
const db = new KVDatabase("plugins/EULA/data");
mc.listen("onJoin", (pl) => {
    if (db.get(pl.xuid)) {
        if (ll.hasExported("BlockIsland", "sendInit"))
            ll.imports("BlockIsland", "sendInit")(pl);
        return;
    }
    pl.sendModalForm(
        "您是否同意以下协议",
        File.readFrom("plugins/EULA/LICENSE"),
        "拒绝",
        "接受",
        (pl, arg) => {
            if (arg)
                return pl.kick(
                    "§l§4未同意用户协议，请勿使用本服提供的任何服务！"
                );
            db.set(pl.xuid, true);
            pl.sendModalForm(
                "广播",
                "是否向其他人广播你的加入",
                "否",
                "是",
                (pl, arg) => {
                    if (ll.hasExported("BlockIsland", "sendInit"))
                        ll.imports("BlockIsland", "sendInit")(pl);
                    if (arg) return;
                    for (const player of mc.getOnlinePlayers()) {
                        if (player.xuid == pl.xuid) continue;
                        player.sendToast(
                            serverName,
                            `欢迎${pl.realName}加入了我们！`
                        );
                    }
                    if (ll.hasExported("MessageSync", "SendMessageAsync"))
                        ll.imports("MessageSync", "SendMessageAsync")(
                            `欢迎*${pl.realName}*加入了我们！`,
                            -2
                        );
                }
            );
        }
    );
});
