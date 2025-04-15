# Minecraft Skin Server for pre 1.8 skins

Will serve 64x32 minecraft skins and capes via these endpoints:
```
/MinecraftSkins?username=your-username
/MinecraftCloaks?username=your-username
```

# Features
- Requests skins/capes from the Mojang API
- Converts the skin to the classic player model.
- Converts the skin to a 64x32 format while retaining as much detail as possible so it looks how it would in newer versions of Minecraft.

# Usage
This is more of the tricky part.

I personally made this while playing on a server with friends as i noticed the betamc proxy was a little buggy and occasionally didnt display other people's skins, or your own, or a combination of both. 
So i just used [RetroMCP](https://github.com/MCPHackers/RetroMCP-Java) to change the skin URLs directly via a jar mod.

If you really want you could convert this into a proxy server and ill be happy to accept pull requests

:3