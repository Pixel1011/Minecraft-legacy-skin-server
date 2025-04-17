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
const express_1 = __importDefault(require("express"));
const SkinHandler_1 = __importDefault(require("./SkinHandler"));
const SkinEditor_1 = __importDefault(require("./SkinEditor"));
const SkinConverter_1 = __importDefault(require("./SkinConverter"));
const app = (0, express_1.default)();
const port = 3000;
const skins = new SkinHandler_1.default();
let editor = new SkinEditor_1.default();
let Converter = new SkinConverter_1.default();
function getItem(type, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.query.username;
        console.log(`Fetching data for ${username}`);
        if (!username) {
            res.status(400).send();
            return null;
        }
        let player = yield skins.getData(username);
        if (type == 0) {
            console.log(`Retrieved skin data for ${username}`);
            return [player.skin, player.slim];
        }
        else if (type == 1) {
            console.log(`Retrieved cape data for ${username}`);
            return [player.cape];
        }
        // will never be reached but typescript likes complaining
        return [player.skin, player.slim];
    });
}
function deSlim(image) {
    return __awaiter(this, void 0, void 0, function* () {
        editor = new SkinEditor_1.default();
        yield editor.loadImg(image);
        editor.a2sS();
        return yield editor.getImg();
    });
}
app.get('/MinecraftSkins', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let skin = yield getItem(0, req, res);
    if (!skin || !skin[0]) {
        res.status(400).send();
        return;
    }
    const response = yield fetch(skin[0]);
    if (response.status != 200) {
        res.status(404).send();
        return;
    }
    res.set("Content-Type", "image/png");
    let img = Buffer.from(yield response.arrayBuffer());
    // unslim if slim, (stretch) thank you 811Alex https://github.com/811Alex/MCSkinConverter :D
    if (skin[1]) {
        img = Buffer.from(yield deSlim(img));
    }
    // convert to 64x32 while keeping details thank you godly https://github.com/godly/minetest-skin-converter :D
    Converter = new SkinConverter_1.default();
    img = Buffer.from(yield Converter.loadImage(img));
    res.status(200).send(img);
}));
app.get('/MinecraftCloaks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cape = yield getItem(1, req, res);
    if (!cape || !cape[0]) {
        res.status(404).send();
        return;
    }
    const response = yield fetch(cape[0]);
    if (response.status != 200) {
        res.status(404).send();
        return;
    }
    res.set("Content-Type", "image/png");
    let img = Buffer.from(yield response.arrayBuffer());
    res.status(200).send(img);
}));
app.get('/', (req, res) => {
    res.redirect("https://cdn.discordapp.com/emojis/1240010178875883600.webp?size=4096&animated=true");
});
app.listen(port, () => {
    console.log(`Skin Server running on port: ${port}`);
});
//# sourceMappingURL=index.js.map