mc.listen("onMobDie", (_mob, src, _cause) => {
    if (src && src.type == "minecraft:wither") src.heal(5);
});
