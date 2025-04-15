/* eslint-disable prefer-const */
import express from "express";
import SkinHandler from "./SkinHandler";
import SkinEditor from "./SkinEditor";
import SkinConverter from "./SkinConverter";
const app = express();

const port = 3000;
const skins = new SkinHandler();
const editor = new SkinEditor();
const Converter = new SkinConverter();


async function getItem(type: number, req: express.Request, res: express.Response) {
  const username = req.query.username as string;
  console.log(`Fetching data for ${username}`);
  if (!username) {
    res.status(400).send();
    return null;
  }
  let player = await skins.getData(username);

  if (type == 0) {
    console.log(`Retrieved skin data for ${username}`);
    return [player.skin, player.slim];
  } else if (type == 1) {
    console.log(`Retrieved cape data for ${username}`);
    return [player.cape];
  }
  // will never be reached but typescript likes complaining
  return [player.skin, player.slim];
}

async function deSlim(image : Buffer) {
  await editor.loadImg(image);
  editor.a2sS();
  return await editor.getImg();
}

app.get('/MinecraftSkins', async (req, res) => {
  let skin = await getItem(0, req, res);
  if (!skin || !skin[0]) {
    res.status(400).send();
    return;
  }
  
  const response = await fetch(skin[0] as string);
  if (response.status != 200) {
    res.status(404).send();
    return; 
  }
  res.set("Content-Type", "image/png");
  let img = Buffer.from(await response.arrayBuffer());
  // unslim if slim (stretch) thank you 811Alex https://github.com/811Alex/MCSkinConverter :D
  if (skin[1]) {
    img = Buffer.from(await deSlim(img));
  }
  // convert to 64x32 while keeping details thank you godly https://github.com/godly/minetest-skin-converter :D
  img = Buffer.from(await Converter.loadImage(img));
  res.status(200).send(img);

});

app.get('/MinecraftCloaks', async (req, res) => {
  let cape = await getItem(1, req, res);
  if (!cape || !cape[0]) {
    res.status(404).send();
    return;
  }
  const response = await fetch(cape[0] as string);
  if (response.status != 200) {
    res.status(404).send();
    return;
  }
  res.set("Content-Type", "image/png");
  let img = Buffer.from(await response.arrayBuffer());
  res.status(200).send(img);

});

app.get('/', (req, res) => {
  res.redirect("https://cdn.discordapp.com/emojis/1240010178875883600.webp?size=4096&animated=true");
});


app.listen(port, () => {
  console.log(`Skin Server running on port: ${port}`);
});