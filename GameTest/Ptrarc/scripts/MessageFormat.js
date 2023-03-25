"use strict";
import * as mc from "@minecraft/server";

mc.world.events.beforeChat.subscribe((arg) => {
    arg.cancel = true;
    const time = new Date();
    let hours = time.getHours();
    hours = hours + 8 > 24 ? hours - 16 : hours + 8;
    const minutes = time.getMinutes();
    const timeStr = `${hours}:${minutes < 10 ? 0 : ""}${minutes}`;
    mc.world.sendMessage(`${timeStr} ${arg.sender.name}：${arg.message}`);
    arg.sender.nameTag = `${timeStr} ${arg.message.replace("\n", " ")}\n${
        arg.sender.nameTag
    }`;
    const name = arg.sender.name;
    mc.system.runTimeout(() => {
        const pls = mc.world.getPlayers({ name: name });
        for (const pl of pls) {
            pl.nameTag =
                pl.nameTag.match("\n").length > 0
                    ? pl.nameTag.substring(pl.nameTag.indexOf("\n") + 1)
                    : pl.name;
        }
    }, 200);
});
