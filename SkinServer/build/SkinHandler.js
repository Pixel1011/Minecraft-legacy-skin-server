"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-const */
const node_fs_1 = __importDefault(require("node:fs"));
class SkinHandler {
    constructor() {
        this.cacheLocation = "./cache.json";
        this.mojangUUIDAPI = "https://api.mojang.com/users/profiles/minecraft/";
        this.mojangSkinAPI = "https://sessionserver.mojang.com/session/minecraft/profile/";
        if (!node_fs_1.default.existsSync(this.cacheLocation)) {
            node_fs_1.default.writeFileSync(this.cacheLocation, "{}");
        }
        const cacheStr = node_fs_1.default.readFileSync(this.cacheLocation).toString();
        this.cache = JSON.parse(cacheStr);
    }
    getData(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let uuid = yield this.getUUID(username);
            let res = yield fetch(this.mojangSkinAPI + uuid, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET"
            });
            let json = yield res.json();
            let props = JSON.parse(Buffer.from(json.properties[0].value, "base64").toString());
            let cape, skin, slim = false;
            if (props.textures.SKIN)
                skin = props.textures.SKIN.url;
            if (props.textures.CAPE)
                cape = props.textures.CAPE.url;
            if (props.textures.SKIN.metadata)
                slim = true;
            return new Player(username, skin, cape, slim);
        });
    }
    getFromCache(username) {
        if (this.cache[username]) {
            return this.cache[username];
        }
        else {
            return null;
        }
    }
    updateCache(user, uuid) {
        this.cache[user] = uuid;
        node_fs_1.default.writeFileSync(this.cacheLocation, JSON.stringify(this.cache));
    }
    getUUID(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let uuid = this.getFromCache(username);
            if (uuid != null)
                return this.cache[username];
            let res = yield fetch(this.mojangUUIDAPI + username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let json = yield res.json();
            if (json.errorMessage)
                return "22b714b6ffbb4f369214490bf7e4f446"; // t e t o
            this.updateCache(username, json.id);
            return json.id;
        });
    }
}
exports.default = SkinHandler;
class Player {
    constructor(u, s, c, slim = false) {
        this.username = u;
        this.skin = s;
        this.slim = slim;
        this.cape = c;
    }
}
//# sourceMappingURL=SkinHandler.js.map