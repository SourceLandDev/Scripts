using LiteLoader.Hook;
using LiteLoader.NET;
using MC;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace Ptrarc;
[PluginMain("Ptrarc")]
public class Ptrarc : IPluginInitializer
{
    public string Introduction => "用于 源域服务器群 的功能插件";
    public Dictionary<string, string> MetaData => new();
    public Version Version => new(1, 0, 0);
    public void OnInitialize()
    {
        Thook.RegisterHook<RandomSeedHook, RandomSeedHookDelegate>();
        Thook.RegisterHook<AutoSupplyItemHook, AutoSupplyItemHookDelegate>();
    }
}

internal delegate void RandomSeedHookDelegate(nint a1, nint a2);
[HookSymbol("?write@StartGamePacket@@UEBAXAEAVBinaryStream@@@Z")]
internal class RandomSeedHook : THookBase<RandomSeedHookDelegate>
{
    public override RandomSeedHookDelegate Hook =>
        (a1, a2) =>
        {
            Marshal.WriteInt64(a1, 48, Random.Shared.NextInt64());
            Original(a1, a2);
        };
}

internal delegate void AutoSupplyItemHookDelegate(nint @this, nint a2, int a3, bool a4);
[HookSymbol("?useItem@Player@@UEAAXAEAVItemStackBase@@W4ItemUseMethod@@_N@Z")]
internal class AutoSupplyItemHook : THookBase<AutoSupplyItemHookDelegate>
{
    public override AutoSupplyItemHookDelegate Hook =>
        (@this, a2, a3, a4) =>
        {
            Original(@this, a2, a3, a4);
            Player player = new(@this);
            ItemStackBase itemStackBase = new(a2);
            if (!itemStackBase.IsNull) return;
            Container inventory = player.Inventory;
            ItemStack handSlot = player.HandSlot;
            int slotIndex = inventory.FindFirstSlotForItem(handSlot);
            for (int i = 0; i <= inventory.Size; i++)
            {
                ItemStack item = inventory.GetSlot(i);
                if (item.IsNull || !itemStackBase.MatchesItem(item))
                {
                    continue;
                }
                inventory.AllSlots[slotIndex] = item.Clone();
                inventory.AllSlots[i] = ItemStack.EMPTY_ITEM;
                player.RefreshInventory();
                break;
            }
        };
}
