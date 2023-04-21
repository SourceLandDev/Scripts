/*
English:
    Menu
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
    菜单
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
ll.registerPlugin("Menu", "菜单", [1, 0, 2]);

const config = new JsonConfigFile("plugins/Menu/config.json");
const menuItem = config.init("menuItem", {});
const commands = config.init("commands", {});
config.close();
mc.listen("onUseItem", (pl, it) => {
    if (it.type in menuItem) menu(pl, menuItem[it.type]);
});
mc.listen("onServerStarted", () => {
    for (const command in commands) {
        const menus = new JsonConfigFile(
            `plugins/Menu/menus/${commands[command]}.json`,
            data.toJson({}, 4)
        );
        const title = menus.get("title", "菜单。");
        menus.close();
        const cmd = mc.newCommand(command, title, PermType.Any);
        cmd.overload();
        cmd.setCallback((_cmd, ori, out, _res) => {
            if (!ori.player) return out.error("commands.generic.noTargetMatch");
            menu(ori.player, commands[command]);
        });
        cmd.setup();
    }
});
function menu(pl, mu, link) {
    const menus = new JsonConfigFile(
        `plugins/Menu/menus/${mu}.json`,
        data.toJson({}, 4)
    );
    const title = menus.get("title", "");
    const contents = menus.get("contents", []);
    const buttons = menus.get("buttons", []);
    menus.close();
    const fm = mc.newSimpleForm().setTitle(title);
    if (contents.length > 0)
        fm.setContent(contents[Math.floor(Math.random() * contents.length)]);
    for (const bt of buttons) fm.addButton(bt.text, bt.image ? bt.image : "");
    pl.sendForm(fm, (pl, arg) => {
        if (arg == null) {
            if (!link || link.length < 1) return;
            const pre = link.pop();
            return menu(pl, pre, link);
        }
        if (buttons[arg].run)
            for (const cmd of buttons[arg].run)
                mc.runcmdEx(cmd.replace(/@s/, `"${pl.realName}"`));
        if (buttons[arg].runas)
            for (const cmd of buttons[arg].runas) pl.runcmd(cmd);
        if (!buttons[arg].menu) return;
        if (!link) link = [];
        menu(pl, buttons[arg].menu, link.push(mu));
    });
}
