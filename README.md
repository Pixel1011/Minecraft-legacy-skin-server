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
## Running the server

1. Have nodejs and pnpm installed.
2. Clone the repo ``git clone https://github.com/Pixel1011/Minecraft-legacy-skin-server.git``
3. ``cd SkinServer``
4. Install dependencies: ``pnpm i``
5. Run via: ``node ./build/index.js``

If you wish to change the port, you may need to edit index.js (or index.ts and then ``tsc``)

## Client usage
This is more of the tricky part.

I personally made this while playing on a server with friends as i noticed the betamc proxy was a little buggy and occasionally didnt display other people's skins, or your own, or a combination of both. 
So i just used [RetroMCP](https://github.com/MCPHackers/RetroMCP-Java) to create a jarmod to change the skin/cape URLs directly.

If you really want you could convert this into a proxy server and ill be happy to accept pull requests

:3
