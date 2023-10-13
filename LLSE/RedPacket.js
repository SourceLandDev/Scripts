/*
English:
    RedPacket
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
    红包
    版权所有 © 2023  星梦 starsdream00@icloud.com
    本程序是自由软件：你可以根据自由软件基金会发布的GNU Affero通用公共许可证的条款，即许可证的第3版，
    或（您选择的）任何后来的版本重新发布和/或修改它。

    本程序的分发是希望它能发挥价值，但没有做任何保证；甚至没有隐含的适销对路或适合某一特定目的的保证。
    更多细节请参见GNU Affero通用公共许可证。

    您应该已经收到了一份GNU Affero通用公共许可证的副本。如果没有，
    请参阅<https://www.gnu.org/licenses/>（<https://www.gnu.org/licenses/agpl-3.0.html>）
    及其非官方中文翻译<https://www.chinasona.org/gnu/agpl-3.0-cn.html>。
*/

"use strict";
ll.registerPlugin("RedPacket", "红包", [1, 0, 1]);

const config = new JsonConfigFile("plugins/RedPacket/config.json");
const command = config.init("command", "redpacket");
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
        case "currexp":
            return {
                add: (pl, money) => pl.addExperience(money),
                reduce: (pl, money) => pl.reduceExperience(money),
                get: (pl) => pl.getCurrentExperience(),
                name: "经验值",
            };
    }
})();
config.close();
const db = new KVDatabase("plugins/RedPacket/data");
const cmd = mc.newCommand(command, "打开红包列表。", PermType.Any);
cmd.overload();
cmd.setCallback((_cmd, ori, out, _res) => {
    if (!ori.player) return out.error("commands.generic.noTargetMatch");
    main(ori.player);
});
cmd.setup();
function main(pl) {
    const fm = mc.newSimpleForm().setTitle("红包列表").addButton("发送红包");
    const keys = db.listKey();
    for (const key of keys) {
        const rpdata = db.get(key);
        fm.addButton(
            `${pl.xuid in rpdata.recipient ? "§e（已领过）" : "§a"}${
                rpdata.msg ?? ""
            }\n${rpdata.level}${eco.name}/个 共${rpdata.count}个`
        );
    }
    pl.sendForm(fm, (pl, arg) => {
        if (arg == null) return;
        if (arg <= 0) {
            if (pl.getLevel() <= 0)
                return pl.sendToast("经济", "§c红包发送失败：余额不足");
            return send(pl);
        }
        redpacket(pl, keys[arg - 1]);
    });
}
function redpacket(pl, key) {
    const rpdata = db.get(key);
    if (
        pl.xuid != rpdata.sender &&
        !(pl.xuid in rpdata.recipient) &&
        rpdata.count > Object.keys(rpdata.recipient).length
    ) {
        rpdata.recipient[pl.xuid] = { time: system.getTimeStr() };
        db.set(key, rpdata);
        eco.add(pl, rpdata.level);
        pl.sendToast(
            "经济",
            `领取红包${rpdata.msg}成功（获得${rpdata.level}${eco.name}）`
        );
    }
    if (Object.keys(rpdata.recipient).length >= rpdata.count) {
        for (const player of mc.getOnlinePlayers()) {
            if (player.xuid == pl.xuid) continue;
            player.tell(
                `§e红包${rpdata.msg ? `《${rpdata.msg}》` : ""}已被领完`
            );
        }
        db.delete(key);
    }
    main(pl);
}
function send(pl) {
    const money = eco.get(pl);
    pl.sendForm(
        mc
            .newCustomForm()
            .setTitle("发送红包")
            .addInput("信息", "字符串")
            .addSlider("发送数量", 1, money)
            .addSlider("单个数额", 1, money),
        (pl, args) => {
            if (!args) return main(pl);
            const count = args[1] * args[2];
            if (count > eco.get(pl))
                return pl.sendToast("经济", "§c红包发送失败：余额不足");
            eco.reduce(pl, count);
            const guid = system.randomGuid();
            db.set(guid, {
                sender: pl.xuid,
                msg: args[0],
                count: args[1],
                level: args[2],
                recipient: {},
            });
            for (const player of mc.getOnlinePlayers()) {
                if (player.xuid == pl.xuid) continue;
                player.tell(
                    `§e红包${args[0] ? `《${args[0]}》` : ""} ${args[2]}${
                        eco.name
                    }/个 共${args[1]}个`
                );
            }
            pl.sendToast("经济", `红包${args[0]}发送成功`);
        }
    );
}
