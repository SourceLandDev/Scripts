"use strict";
File.rename("plugins/Bazaar/data", "plugins/Bazaar/data_backup");
const db = new KVDatabase("plugins/Bazaar/data");
const olddb = new KVDatabase("plugins/Bazaar/data_backup");
const items = olddb.get("items");
const offers = olddb.get("offers");
const sellers = olddb.get("sellers");
olddb.close();
for (const uuid in items)
    try {
        if (!NBT.parseSNBT(items[uuid].snbt)) throw undefined;
        if (items[uuid].count <= 0) throw undefined;
    } catch {
        sellers[items[uuid].seller].items = sellers[
            items[uuid].seller
        ].items.slice(sellers[items[uuid].seller].items.indexOf(uuid), 1);
        delete items[uuid];
    }
for (const uuid in offers)
    try {
        if (offers[uuid].count <= 0) throw undefined;
    } catch {
        sellers[offers[uuid].seller].offers = sellers[
            offers[uuid].seller
        ].offers.slice(sellers[offers[uuid].seller].offers.indexOf(uuid), 1);
        delete offers[uuid];
    }
db.set("items", items);
db.set("offers", offers);
db.set("sellers", sellers);
db.close();
