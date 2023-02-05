"use strict";
File.rename("plugins/Bazaar/data", "plugins/Bazaar/data_backup");
const db = new KVDatabase("plugins/Bazaar/data");
const olddb = new KVDatabase("plugins/Bazaar/data_backup");
db.set("offers", olddb.get("offers"));
const items = olddb.get("items");
const sellers = olddb.get("sellers");
olddb.close();
for (const uuid of Object.keys(items)) {
    try {
        if (!NBT.parseSNBT(items[uuid].snbt)) throw undefined;
    } catch {
        sellers[items[uuid].seller] = sellers[items[uuid].seller].items.slice(
            sellers[items[uuid].seller].items.indexOf(uuid),
            1
        );
        delete items[uuid];
    }
}
db.set("items", items);
db.set("sellers", sellers);
db.close();
