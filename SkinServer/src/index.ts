/* eslint-disable prefer-const */
import express from "express";
import SkinHandler from "./SkinHandler";
import SkinEditor from "./SkinEditor";
const app = express();

//app.use(express.raw({type:"text/plain"}));
const port = 3000;
const skins = new SkinHandler();
const editor = new SkinEditor();


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


  //return modImg;

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
  if (skin[1]) {
    img = Buffer.from(await deSlim(img));
  }
  res.status(200).send(img);

});

app.get('/MinecraftCloaks', async (req, res) => {
  let cape = await getItem(1, req, res);
  if (cape == null) return;
  const response = await fetch(cape[0] as string);
  if (response.status != 200) {
    res.status(404).send();
    return;
  }
  res.set("Content-Type", "image/png");
  let img = Buffer.from(await response.arrayBuffer());
  res.status(200).send(img);

});


app.listen(port, () => {
  console.log(`Skin Server running on port: ${port}`);
});