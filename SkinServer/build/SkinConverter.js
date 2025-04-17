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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
// Strings used in HTML as IDs and in code
// Use these vars while coding to avoid typos.
const canvas_1 = require("canvas");
const constImgLoader = "imgLoader";
const constSkinMinecraft = "minecraft";
const constSkinMinetest = "minetest";
const constIdSrcImage = "srcImg";
const constIdDstImage = "dstImg";
const constLoader = "loader";
const constImageTools = "imgTools";
const constImageControls = "imgControl";
const idImages = "images";
const strTransparency = "transparency";
// uvFaceWidth: Block size in pixels, 1/16 of the image width. 4px for standard skins with 64px width.
let uvFaceWidth = 4;
// Global string constants to avoid quoted strings in the code
// Body Parts
const constHead = "Head";
const constHat = "Hat";
const constBody = "Body";
const constJacket = "Jacket";
const constArmLeft = "ArmLeft";
const constLegLeft = "LegLeft";
const constSleeveLeft = "SleeveLeft";
const constTrouserLeft = "TrouserLeft";
const constArmRight = "ArmRight";
const constLegRight = "LegRight";
const constSleeveRight = "SleeveRight";
const constTrouserRight = "TrouserRight";
const constBodyParts = {
    1: constHead, 2: constHat, 3: constBody, 4: constJacket,
    5: constArmLeft, 6: constLegLeft, 7: constSleeveLeft, 8: constTrouserLeft,
    9: constArmRight, 10: constLegRight, 11: constSleeveRight, 12: constTrouserRight
};
// Faces
const constFaceTop = "top";
const constFaceBottom = "bottom";
const constFaceLeft = "left";
const constFaceFront = "front";
const constFaceRight = "right";
const constFaceBack = "back";
const constFacesAll = "all";
const constFacesLeftFrontRight = "lfr";
const constFaceUnusedL = "unusedL";
const constFaceUnusedR = "unusedR";
const constBoxFaces = { 1: constFaceRight, 2: constFaceLeft, 3: constFaceTop, 4: constFaceBottom, 5: constFaceFront, 6: constFaceBack };
const constUvWidth = 16;
class faceArea {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class UvArea {
    // supported types:
    constructor(type) {
        this.type = type;
        if ((this.type == constHead) || (this.type == constHat)) {
            // assume constHead
            this.px = 0;
            this.py = 0;
            this.width = 2;
            this.height = 2;
            this.depth = 2;
            if (this.type == constHat) {
                this.px = 8;
                this.py = 0;
            }
        }
        else if ((this.type == constBody) || (this.type == constJacket)) {
            // assume constBody
            this.px = 4;
            this.py = 4;
            this.width = 2;
            this.height = 3;
            this.depth = 1;
            if (this.type == constJacket) {
                this.px = 4;
                this.py = 8;
            }
        }
        else {
            // assume constLegRight
            this.px = 0;
            this.py = 4;
            this.width = 1;
            this.height = 3;
            this.depth = 1;
            if (this.type == constArmRight) {
                this.px = 10;
                this.py = 4;
            }
            else if (this.type == constTrouserRight) {
                this.px = 0;
                this.py = 8;
            }
            else if (this.type == constSleeveRight) {
                this.px = 10;
                this.py = 8;
            }
            else if (this.type == constTrouserLeft) {
                this.px = 0;
                this.py = 12;
            }
            else if (this.type == constLegLeft) {
                this.px = 4;
                this.py = 12;
            }
            else if (this.type == constArmLeft) {
                this.px = 8;
                this.py = 12;
            }
            else if (this.type == constSleeveLeft) {
                this.px = 12;
                this.py = 12;
            }
        }
    }
    get top() {
        return new faceArea(this.px + this.depth, this.py, this.width, this.depth);
    }
    get bottom() {
        return new faceArea(this.px + this.depth + this.width, this.py, this.width, this.depth);
    }
    get left() {
        return new faceArea(this.px, this.py + this.depth, this.depth, this.height);
    }
    get front() {
        return new faceArea(this.px + this.depth, this.py + this.depth, this.width, this.height);
    }
    get right() {
        return new faceArea(this.px + this.depth + this.width, this.py + this.depth, this.depth, this.height);
    }
    get back() {
        return new faceArea(this.px + 2 * this.depth + this.width, this.py + this.depth, this.width, this.height);
    }
    get all() {
        return new faceArea(this.px, this.py, 2 * (this.depth + this.width), this.depth + this.height);
    }
    get lfr() {
        // Left Front Right
        return new faceArea(this.px, this.py + this.depth, 2 * this.depth + this.width, this.height);
    }
    get unusedL() {
        return new faceArea(this.px, this.py, this.depth, this.depth);
    }
    get unusedR() {
        return new faceArea(this.px + this.depth + 2 * this.width, this.py, this.depth, this.depth);
    }
}
class SkinConverter {
    constructor() {
        // Global definition of the rectangular or square skin areas
        // Lines 1-4
        this.areaNull = new faceArea(0, 0, 0, 0); // special, nothing
        this.areaMinetest = new faceArea(0, 0, 16, 8); // special, the whole Mintest skin / the upper half of the Minecraft skin
        this.areaMinecraft = new faceArea(0, 0, 16, 16); // special, the whole Minecraft skin
        this.areaHead = new UvArea(constHead);
        this.areaHat = new UvArea(constHat);
        // Lines 5-8
        this.areaLegRight = new UvArea(constLegRight);
        this.areaBody = new UvArea(constBody);
        this.areaArmRight = new UvArea(constArmRight);
        this.areaUnusedMinecraft = new faceArea(14, 4, 2, 8); // special unusedL
        this.areaUnusedMinetest = new faceArea(14, 4, 2, 1); // special unusedR
        this.areaCapeMinetest = new faceArea(14, 5, 2, 3); // special, other location than Minecraft:areaJacket.back
        // Lines 9-12
        this.areaTrouserRight = new UvArea(constTrouserRight);
        this.areaJacket = new UvArea(constJacket);
        this.areaSleeveRight = new UvArea(constSleeveRight);
        // Lines 13-16
        this.areaTrouserLeft = new UvArea(constTrouserLeft);
        this.areaLegLeft = new UvArea(constLegLeft); // areaLeftLeg
        this.areaArmLeft = new UvArea(constArmLeft);
        this.areaSleeveLeft = new UvArea(constSleeveLeft);
    }
    // Main function to load the image after the user selected it
    loadImage(img) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dstCanvas = undefined;
            this.dstImg = undefined;
            let srcImg = yield (0, canvas_1.loadImage)(img);
            if (srcImg.height == 32)
                return img;
            // function continues in imageLoaded() as soon as the image is loaded
            return yield this.imageLoaded(srcImg);
        });
    }
    imageLoaded(srcImg) {
        return __awaiter(this, void 0, void 0, function* () {
            // calculate width and height of target image
            let srcWidth = srcImg.width;
            let srcHeight = srcImg.height; // Skins must be square or ½ square box. Otherwise skin conversion fails
            let dstWidth = srcWidth;
            let dstHeight = srcWidth / 2; // srcWidth/2 to get ½ square. We don't rely on srcHeight
            uvFaceWidth = srcWidth / 16;
            uvFaceWidth = srcWidth / constUvWidth;
            // assume Minecraft skin
            let srcSkinType = constSkinMinecraft;
            if (srcWidth == srcHeight * 2) {
                // setting skin source to Minetest and the image format to square (widht=height).
                srcSkinType = constSkinMinetest;
                dstHeight = srcWidth;
            }
            this.dstCanvas = new canvas_1.Canvas(dstWidth, dstHeight, "image");
            // Copy upper part of skin (1:1)
            this.dstCanvas.width = dstWidth;
            this.dstCanvas.height = dstHeight;
            let context = this.dstCanvas.getContext('2d');
            this.draw(srcImg, this.areaMinetest, context, this.areaMinetest, uvFaceWidth, 0);
            this.draw(srcImg, this.areaHead.unusedL, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaHead.unusedR, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaHat.unusedL, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaHat.unusedR, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaLegRight.unusedL, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaLegRight.unusedR, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaBody.unusedL, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaBody.unusedR, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaArmRight.unusedL, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaArmRight.unusedR, context, this.areaNull, uvFaceWidth, 0);
            this.draw(srcImg, this.areaUnusedMinetest, context, this.areaNull, uvFaceWidth, 0);
            // copy Jacket.back(Cape) to areaCapeMinetest
            this.draw(srcImg, this.areaJacket.back, context, this.areaCapeMinetest, uvFaceWidth, 0);
            // copy data from the internal dstCanvas to the public dstImg
            this.dstImg = yield (0, canvas_1.loadImage)(Buffer.from(this.dstCanvas.toDataURL("image/png").split(",")[1], "base64"));
            // sleeves
            this.copy('areaSleeveLeft.all', 'areaArmRight.all', 1, srcImg);
            // trousers
            this.copy('areaTrouserLeft.all', 'areaLegRight.all', 1, srcImg);
            // jacket
            this.copy('areaJacket.all', 'areaBody.all', 0, srcImg);
            // cape // i believe this is already done but just to guarantee
            this.copy('areaJacket.back', 'areaCapeMinetest', 0, srcImg);
            return Buffer.from(this.dstCanvas.toDataURL("image/png").split(",")[1], "base64");
        });
    }
    /*
  copy(from, to, flip, alphaId)
  from: srcArea
  to: dstArea. Set to 'areaNull' to clean the region defined in srcArea
  flip values: 0 = normal copy, 1 = flip area
  alphaId: element which stores the desired alpha value
  */
    copy(from, to, flip, srcImg) {
        return __awaiter(this, void 0, void 0, function* () {
            let flipValue = 0;
            if (flip != null) {
                flipValue = flip;
            }
            let alpha = 1;
            let context = this.dstCanvas.getContext('2d');
            let areaFrom = eval("this." + from);
            let areaTo = eval("this." + to);
            if (areaTo == this.areaNull) {
                this.draw(srcImg, areaFrom, context, this.areaNull, uvFaceWidth, flipValue);
            }
            else if (flip == 1) {
                let fromArray = from.split(".");
                let toArray = to.split(".");
                if ((fromArray[1] == "all") && (toArray[1] == "all")) {
                    // copy and mirror arm: top; bottom; right, front, left; back
                    context.globalAlpha = alpha;
                    this.draw(srcImg, eval("this." + fromArray[0] + ".top"), context, eval("this." + toArray[0] + ".top"), uvFaceWidth, flipValue);
                    this.draw(srcImg, eval("this." + fromArray[0] + ".bottom"), context, eval("this." + toArray[0] + ".bottom"), uvFaceWidth, flipValue);
                    this.draw(srcImg, eval("this." + fromArray[0] + ".lfr"), context, eval("this." + toArray[0] + ".lfr"), uvFaceWidth, flipValue);
                    this.draw(srcImg, eval("this." + fromArray[0] + ".back"), context, eval("this." + toArray[0] + ".back"), uvFaceWidth, flipValue);
                }
                else {
                    console.error("ERROR\tcopy 'from' and 'to' must end with '.all'");
                }
            }
            else {
                context.globalAlpha = alpha;
                this.draw(srcImg, areaFrom, context, areaTo, uvFaceWidth, flipValue);
            }
            this.dstImg = yield (0, canvas_1.loadImage)(Buffer.from(this.dstCanvas.toDataURL("image/png").split(",")[1], "base64"));
        });
    }
    /*
  draw(srcImg, srcArea, dstContext, dstArea, uvFaceWidth, flip)
  srcImg: the source image to read the skin from
  srcArea: the area to read
  dstContext: the context to write the skin to
  dstArea: dstArea. Set to 'areaNull' to clean the region defined in srcArea
  uvFaceWidth: uvFaceWidth
  flip: 0 = normal copy, 1 = flip area horizontally
  */
    draw(srcImg, srcArea, dstContext, dstArea, uvFaceWidth, flip) {
        let bsClipX = srcArea.x * uvFaceWidth;
        let bsClipY = srcArea.y * uvFaceWidth;
        let bsWidth = srcArea.w * uvFaceWidth;
        let bsHeight = srcArea.h * uvFaceWidth;
        let bsDstX = dstArea.x * uvFaceWidth;
        let bsDstY = dstArea.y * uvFaceWidth;
        if ((dstArea.w == 0) || (dstArea.h == 0)) {
            dstContext.clearRect(bsClipX, bsClipY, bsWidth, bsHeight);
        }
        else if (flip == 0) {
            dstContext.drawImage(srcImg, bsClipX, bsClipY, bsWidth, bsHeight, bsDstX, bsDstY, bsWidth, bsHeight);
        }
        else {
            // use a temporary canvas to flip the element
            let canvas = new canvas_1.Canvas(bsWidth, bsHeight, "image");
            let context = canvas.getContext('2d');
            context.save();
            if (flip == 1) {
                context.translate(bsWidth, 0);
                context.scale(-1, 1);
            }
            context.drawImage(srcImg, bsClipX, bsClipY, bsWidth, bsHeight, 0, 0, bsWidth, bsHeight);
            context.restore();
            dstContext.drawImage(canvas, bsDstX, bsDstY, bsWidth, bsHeight);
        }
    }
}
exports.default = SkinConverter;
//# sourceMappingURL=SkinConverter.js.map