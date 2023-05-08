"use strict";
File.rename("plugins/Bazaar/data", "plugins/Bazaar/data_backup_1_0");
const db = new KVDatabase("plugins/Bazaar/data");
const olddb = new KVDatabase("plugins/Bazaar/data_backup_1_0");
const keys = olddb.listKey();
const items = {};
const sellers = {};
for (const key of keys) {
    const shop = olddb.get(key);
    const newShop = {
        items: [],
        offers: [],
        unprocessedTransactions: [],
    };
    for (const item of Object.values(shop.items)) {
        items[item.guid] = {
            snbt: item.snbt,
            count: Number(NBT.parseSNBT(item.snbt).getData("Count")),
            price: Number(item.price),
            seller: key,
        };
        newShop.items.push(item.guid);
    }
    for (const ut of shop.pending) {
        newShop.unprocessedTransactions.push({
            price: Number(ut.item.price),
            count: Number(ut.count),
            serviceCharge: Number(ut.serviceCharge),
        });
    }
    if (
        newShop.items.length <= 0 &&
        newShop.offers.length <= 0 &&
        newShop.unprocessedTransactions.length <= 0
    )
        continue;
    sellers[key] = newShop;
}
olddb.close();
db.set("items", items);
db.set("offers", {});
db.set("sellers", sellers);
db.close();
