using LLNET.Core;
using LLNET.Event;
using LLNET.Hook;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

[PluginMain("Ptrarc")]
public class Ptrarc : IPluginInitializer {
    public string Introduction => "用于 源域服务器群 的功能插件";
    public Dictionary<string, string> MetaData => new();
    public Version Version => new(1, 0, 0);
    public void OnInitialize() {
        _ = EntityExplodeEvent.Subscribe_Ref((ev) => {
            if (ev.Actor.TypeName == "minecraft:creeper") {
                ev.Breaking = false;
            }
            return true;
        });
        Thook.RegisterHook<Hide_Seed_Hook, Hide_Seed_HookDelegate>();
    }
}

internal delegate void Hide_Seed_HookDelegate(IntPtr a1, IntPtr a2);
[HookSymbol("?write@StartGamePacket@@UEBAXAEAVBinaryStream@@@Z")]
internal class Hide_Seed_Hook : THookBase<Hide_Seed_HookDelegate> {
    public override Hide_Seed_HookDelegate Hook =>
        (IntPtr a1, IntPtr a2) => {
            Marshal.WriteInt64(a1, 48, 0);
            Original(a1, a2);
        };
}