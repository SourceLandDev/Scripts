/*
English:
    Express
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
    物流
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

const config = new JsonConfigFile("plugins/Express/config.json");
const command = config.init("command", "express");
const serviceCharge = config.init("serviceCharge", 1 / 9);
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
        case "xplevel":
            return {
                add: (pl, money) => pl.addLevel(money),
                reduce: (pl, money) => pl.reduceLevel(money),
                get: pl => pl.getLevel(),
                name: "级经验"
            };
    }
})();
config.close();
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand(command, "打开物流菜单。", PermType.Any);
    cmd.overload();
    cmd.setCallback((_cmd, ori, out, _res) => {
        if (!ori.player) return out.error("commands.generic.noTargetMatch");
        main(ori.player);
    });
    cmd.setup();
});
function main(pl) {
    const plnms = [];
    const plsxuid = [];
    for (const player of mc.getOnlinePlayers())
        if (player.xuid != pl.xuid) {
            plsxuid.push(player.xuid);
            plnms.push(
                ll.hasExported("UserName", "Get")
                    ? ll.imports("UserName", "Get")(player)
                    : player.realName
            );
        }
    if (plnms.length <= 0)
        return pl.sendToast("物流", "§c送达失败：暂无可送达用户");
    const fm = mc
        .newCustomForm()
        .setTitle("物流菜单")
        .addDropdown("目标", plnms);
    const items = [];
    const inventoryItems = pl.getInventory().getAllItems();
    for (const item of inventoryItems) {
        if (item.isNull()) continue;
        fm.addSlider(
            `[${inventoryItems.indexOf(item)}] ${item.name}§r（${item.type}:${
                item.aux == 0 ? "" : item.aux
            }）`,
            0,
            item.count
        );
        items.push(item);
    }
    if (items.length <= 0) return pl.sendToast("物流", "§c送达失败：背包为空");
    pl.sendForm(fm, (pl, args) => {
        if (!args) return;
        let totalNum = 0;
        for (const num of args) totalNum += num;
        const money = eco.get(pl);
        let condition = 0;
        for (let i = 1; i < totalNum; ++i)
            condition += (money * serviceCharge) / i;
        if (eco.get(pl) < ++condition) {
            pl.sendToast(
                "物流",
                `§c送达失败：余额不足（需要${Math.round(condition)}${
                    eco.name
                }）`
            );
            return main(pl);
        }
        const pl1 = mc.getPlayer(plsxuid[args[0]]);
        if (!pl1)
            return pl.sendToast("物流", `§c送达失败：${plnms[args[0]]}已离线`);
        args.shift();
        const reduce = Math.round(condition - Math.random() * condition);
        const sendItems = [];
        for (const index in args) {
            const num = Math.round(args[index]);
            if (num <= 0) continue;
            const item = items[index];
            if (item.count < num) {
                pl.sendToast(
                    "物流",
                    `§c${item.name}§r×${num}送达失败：数量不足`
                );
                continue;
            }
            const itemNbt = item.getNbt();
            const newitem = mc.newItem(itemNbt.setByte("Count", num));
            if (item.count == num) item.setNull();
            else item.setNbt(itemNbt.setByte("Count", item.count - num));
            pl.refreshItems();
            pl1.giveItem(newitem, num);
            sendItems.push({ name: item.name, count: num });
        }
        if (sendItems.length <= 0) return;
        eco.reduce(pl, reduce);
        pl.tell(
            `向${
                ll.hasExported("UserName", "Get")
                    ? ll.imports("UserName", "Get")(pl1)
                    : pl1.realName
            }发送了以下物品${
                reduce > 0 ? `（花费${reduce}${eco.name}）` : ""
            }：`
        );
        pl1.tell(`您收到了以下物品：`);
        for (const item of sendItems) {
            pl.tell(`${item.name}§r×${item.count}`);
            pl1.tell(`${item.name}§r×${item.count}`);
        }
    });
}
