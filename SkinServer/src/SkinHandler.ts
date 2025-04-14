/* eslint-disable prefer-const */
import fs from "node:fs";

export default class SkinHandler {
  
  cacheLocation: string;
  mojangUUIDAPI: string;
  mojangSkinAPI: string;
  cache: Cache;

  constructor() {
    this.cacheLocation = "./cache.json";
    this.mojangUUIDAPI = "https://api.mojang.com/users/profiles/minecraft/";
    this.mojangSkinAPI = "https://sessionserver.mojang.com/session/minecraft/profile/";

    if (!fs.existsSync(this.cacheLocation)) {
      fs.writeFileSync(this.cacheLocation, "{}");
    }
    const cacheStr = fs.readFileSync(this.cacheLocation).toString();
    this.cache = JSON.parse(cacheStr);
  }

  async getData(username : string): Promise<Player> {
    let uuid = await this.getUUID(username);

    let res = await fetch(this.mojangSkinAPI + uuid, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET"
    });
    let json = await res.json();
    let props = JSON.parse(Buffer.from(json.properties[0].value, "base64").toString());
    let cape, skin, slim = false;
    if (props.textures.SKIN) skin = props.textures.SKIN.url;
    if (props.textures.CAPE) cape = props.textures.CAPE.url;
    if (props.textures.SKIN.metadata) slim = true;


    return new Player(username, skin, cape, slim);
  }

  getFromCache(username : string): string | null {
    if (this.cache[username]) {
      return this.cache[username];
    } else {
      return null;
    }
  }

  updateCache(user : string, uuid: string): void {
    this.cache[user] = uuid; 
    fs.writeFileSync(this.cacheLocation, JSON.stringify(this.cache));
  }

  async getUUID(username : string) : Promise<string> {
    let uuid = this.getFromCache(username);
    if (uuid != null) return this.cache[username];

    let res = await fetch(this.mojangUUIDAPI + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    let json = await res.json();
    if (json.errorMessage) return "22b714b6ffbb4f369214490bf7e4f446"; // t e t o
    this.updateCache(username, json.id);
    return json.id;


  }
}

class Player {
  constructor(u: string, s: string, c: string, slim: boolean = false) {
    this.username = u;
    this.skin = s;
    this.slim = slim;
    this.cape = c;
  }
  username: string;
  skin: string;
  slim: boolean;
  cape: string;
}

// arguably should use a dictionary but ehhh this works
interface Cache {
  [username: string]: string
}