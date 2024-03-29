/*
English:
    Transfer
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
    转账
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

const config = new JsonConfigFile("plugins/Transfer/config.json");
const command = config.init("command", "transfor");
const currencyType = config.init("currencyType", "llmoney");
const currencyName = config.init("currencyName", "元");
const eco = (() => {
    switch (currencyType) {
        case "llmoney":
            return {
                add: (pl, money) => pl.addMoney(money),
                reduce: (pl, money) => pl.reduceMoney(money),
                get: pl => pl.getMoney(),
                name: currencyName
            };
        case "scoreboard":
            const scoreboard = config.init("scoreboard", "money");
            return {
                add: (pl, money) => pl.addScore(scoreboard, money),
                reduce: (pl, money) => pl.reduceScore(scoreboard, money),
                get: pl => pl.getScore(scoreboard),
                name: currencyName
            };
        case "currexp":
            return {
                add: (pl, money) => pl.addExperience(money),
                reduce: (pl, money) => pl.reduceExperience(money),
                get: pl => pl.getCurrentExperience(),
                name: "经验值"
            };
    }
})();
config.close();
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand(command, "打开转账菜单。", PermType.Any);
    cmd.overload();
    cmd.setCallback((_cmd, ori, out, _res) => {
        if (!ori.player) return out.error("commands.generic.noTargetMatch");
        main(ori.player);
    });
    cmd.setup();
});
function main(pl) {
    const money = eco.get(pl);
    if (money <= 0) return pl.sendToast("经济", "§c转账失败：余额不足");
    const plnms = [];
    const plxuid = [];
    for (const player of mc.getOnlinePlayers())
        if (player.xuid != pl.xuid) {
            plxuid.push(player.xuid);
            plnms.push(
                ll.hasExported("UserName", "Get")
                    ? ll.imports("UserName", "Get")(player)
                    : player.realName
            );
        }
    if (plnms.length <= 0)
        return pl.sendToast("经济", "§c转账失败：暂无可转账用户");
    let total = 0;
    for (const pl of mc.getOnlinePlayers()) total += eco.get(pl);
    pl.sendForm(
        mc
            .newCustomForm()
            .setTitle("转账菜单")
            .addDropdown("目标", plnms)
            .addSlider("数额", 1, money)
            .addLabel(
                `当前汇率：${
                    100 - total / 10 ** Math.floor(Math.log10(total))
                }％`
            ),
        (pl, args) => {
            if (!args) return;
            const plto = mc.getPlayer(plxuid[args[0]]);
            if (!plto)
                return pl.sendToast(
                    "经济",
                    `§c转账失败：${plnms[args[0]]}已离线`
                );
            if (args[1] > eco.get(pl))
                return pl.sendToast("经济", "§c转账失败：余额不足");
            let total = 0;
            for (const pl of mc.getOnlinePlayers()) total += eco.get(pl);
            const rlv = Math.round(
                args[1] *
                    (1 - total / 10 ** (Math.floor(Math.log10(total)) + 2))
            );
            if (rlv <= 0) return pl.sendToast("经济", "§c转账失败：数额过小");
            eco.reduce(pl, args[1]);
            eco.add(plto, rlv);
            pl.sendToast(
                "经济",
                `转账成功：向${
                    ll.hasExported("UserName", "Get")
                        ? ll.imports("UserName", "Get")(plto)
                        : plto.realName
                }转账${args[1]}${eco.name}`
            );
            plto.sendToast("经济", `您收到了${rlv}${eco.name}`);
        }
    );
}
