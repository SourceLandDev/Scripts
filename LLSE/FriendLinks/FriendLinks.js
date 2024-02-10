/*
English:
    FriendLinks
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
    友情链接
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

const config = new JsonConfigFile("plugins/FriendLinks/config.json");
const command = config.init("command", "friendlinks");
config.close();
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand(command, "打开友链列表", PermType.Any);
    cmd.overload();
    cmd.setCallback((_cmd, ori, out, _res) => {
        if (!ori.player) return out.error("commands.generic.noTargetMatch");
        main(ori.player);
    });
});
cmd.setup();
const data = {};
const taskCache = {};
function main(pl) {
    const linksFile = File.readFrom("plugins/FriendLinks/links.json") ?? "[]";
    if (linksFile == null) {
        File.writeTo("plugins/FriendLinks/links.json", "[]");
        linksFile = "[]";
    }
    const links = JSON.parse(linksFile);
    data[pl.xuid] = { links: [], actions: [] };
    for (const link of links) {
        if (!ll.hasExported("MOTDAPI", "GetFromBEAsync")) {
            data[pl.xuid].links.push(link);
            continue;
        }
        const taskId = ll.imports("MOTDAPI", "GetFromBEAsync")(
            link.ip,
            link.port,
            "FriendLinks",
            "Callback",
            1000
        );
        data[pl.xuid].actions.push(taskId);
        taskCache[taskId] = { xuid: pl.xuid, link: link };
    }
    if (!ll.hasExported("MOTDAPI", "GetFromBEAsync")) sendForm(pl);
}
function sendForm(pl) {
    const fm = mc.newSimpleForm().setTitle("友链列表");
    for (const link of data[pl.xuid].links) {
        fm.addButton(
            `${link.name} - ${link.type}\n${
                "count" in link && link.count > 0 ? `${link.count}人在线` : ""
            } ${
                "motd" in link
                    ? link.motd
                    : "introduction" in link
                    ? link.introduction
                    : ""
            }`
        );
    }
    pl.sendForm(
        fm.setContent(
            `当前有${
                data[pl.xuid].links.length
            }个服务器在线\n点击按钮即可进入对应服务器`
        ),
        (pl, arg) => {
            if (arg == null) {
                delete data[pl.xuid];
                return;
            }
            pl.transServer(
                data[pl.xuid].links[arg].ip,
                data[pl.xuid].links[arg].port
            );
            if (ll.hasExported("MessageSync", "SendMessageAsync"))
                ll.imports("MessageSync", "SendMessageAsync")(
                    `*${
                        ll.hasExported("UserName", "Get")
                            ? ll.imports("UserName", "Get")(pl)
                            : pl.realName
                    }*已去往${data[pl.xuid].links[arg].name}`,
                    -2
                );
            delete data[pl.xuid];
        }
    );
}
ll.exports(
    (id, motdStr) => {
        const motdArray = motdStr.split(";");
        if (motdArray[2] == mc.getServerProtocolVersion()) {
            taskCache[id].link.count = motdArray[4];
            taskCache[id].link.motd = motdArray[1];
            data[taskCache[id].xuid].links.push(taskCache[id].link);
        }
        data[taskCache[id].xuid].actions.splice(
            data[taskCache[id].xuid].actions.indexOf(id),
            1
        );
        if (data[taskCache[id].xuid].actions.length <= 0) {
            const pl = mc.getPlayer(taskCache[id].xuid);
            if (pl) sendForm(pl);
            else delete data[pl.xuid];
        }
        delete taskCache[id];
    },
    "FriendLinks",
    "Callback"
);
