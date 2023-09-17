/*
English:
    UserName
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
    用户名
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
ll.registerPlugin("UserName", "用户名", [1, 0, 0]);

const config = new JsonConfigFile("plugins/UserName/config.json");
const command = config.init("command", "rename");
const serviceCharge = config.init("serviceCharge", { min: 0, max: 3 });
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
        case "xplevel":
            return {
                add: (pl, money) => pl.addLevel(money),
                reduce: (pl, money) => pl.reduceLevel(money),
                get: (pl) => pl.getLevel(),
                name: "级经验",
            };
    }
})();
const regex = config.init("regex", []);
config.close();
const db = new KVDatabase("plugins/UserName/data");
const cmd = mc.newCommand(command, "打开重命名。", PermType.Any);
cmd.overload();
cmd.setCallback((_cmd, ori, out, _res) => {
    if (!ori.player) return out.error("commands.generic.noTargetMatch");
    main(ori.player);
});
cmd.setup();
mc.listen("onPreJoin", (pl) => {
    const nameData = db.get(pl.xuid);
    if (!nameData) return;
    setName(pl, nameData.name);
});
function main(pl, def) {
    const nameData = db.get(pl.xuid);
    pl.sendForm(
        mc
            .newCustomForm()
            .setTitle("重命名")
            .addInput(
                "名称",
                "字符串",
                def ?? (nameData ? nameData.name : pl.realName)
            ),
        (pl, args) => {
            if (!args) return;
            let total = 0;
            for (const pl of mc.getOnlinePlayers()) total += eco.get(pl);
            const condition =
                serviceCharge.max *
                (1 +
                    (nameData ? nameData.times : 0) *
                        (total / 10 ** (Math.floor(Math.log10(total)) + 2)));
            if (eco.get(pl) < condition) {
                pl.sendToast(
                    "重命名",
                    `§c修改失败：余额不足（需要${Math.round(condition)}${
                        eco.name
                    }）`
                );
                return main(pl, args[0]);
            }
            for (const reg of regex)
                if (new RegExp(reg.pattern).test(args[0])) {
                    pl.sendToast("重命名", `§c修改失败：${reg.message}`);
                    return main(pl, args[0]);
                }
            const reduce = Math.round(
                Math.random() * (serviceCharge.min - condition) + condition
            );
            eco.reduce(pl, reduce);
            db.set(pl.xuid, {
                name: args[0],
                times: (nameData ? nameData.times : 0) + 1,
            });
            setName(pl, args[0]);
            pl.sendToast(
                "重命名",
                `修改成功${reduce > 0 ? `（花费${reduce}${eco.name}）` : ""}`
            );
            for (const player of mc.getOnlinePlayers()) {
                if (player.xuid == pl.xuid) continue;
                player.tell(`§e${pl.realName}重命名为${args[0]}`);
            }
            if (ll.hasExported("MessageSync", "SendMessageAsync"))
                ll.imports("MessageSync", "SendMessageAsync")(
                    `*${pl.realName}*重命名为*${args[0]}*`,
                    -2
                );
        }
    );
}
function setName(pl, name) {
    NativeFunction.fromSymbol(
        "?setName@Player@@UEAAXAEBV?$basic_string@DU?$char_traits@D@std@@V?$allocator@D@2@@std@@@Z"
    ).call(pl.asPointer(), name);
}
ll.exports(
    (pl) => {
        const nameData = db.get(pl.xuid);
        return nameData ? nameData.name : pl.realName;
    },
    "UserName",
    "Get"
);
ll.exports(
    (xuid) => {
        const nameData = db.get(xuid);
        return nameData ? nameData.name : data.xuid2name(xuid);
    },
    "UserName",
    "GetFromXuid"
);
ll.exports(
    (pl, name) => {
        db.set(pl.xuid, name);
        setName(pl, nameData.name);
    },
    "UserName",
    "Set"
);
