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
        Thook.RegisterHook<HideSeedHook, HideSeedHookDelegate>();
    }
}

internal delegate void HideSeedHookDelegate(IntPtr a1, IntPtr a2);
[HookSymbol("?write@StartGamePacket@@UEBAXAEAVBinaryStream@@@Z")]
internal class HideSeedHook : THookBase<HideSeedHookDelegate>
{
    public override HideSeedHookDelegate Hook =>
        (a1, a2) =>
        {
            Marshal.WriteInt64(a1, 48, 0);
            Original(a1, a2);
        };
}