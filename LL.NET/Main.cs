using LiteLoader.Hook;
using LiteLoader.NET;
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
