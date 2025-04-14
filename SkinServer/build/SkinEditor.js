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
/* eslint-disable prefer-const */
const canvas_1 = require("canvas");
class SkinEditor {
    constructor() {
        this.canvas = new canvas_1.Canvas(64, 64, "image");
        this.ctx = this.canvas.getContext("2d");
    }
    loadImg(img) {
        return __awaiter(this, void 0, void 0, function* () {
            let image = yield (0, canvas_1.loadImage)(img);
            this.ctx.drawImage(image, 0, 0);
        });
    }
    getImg() {
        return __awaiter(this, void 0, void 0, function* () {
            return Buffer.from(this.canvas.toDataURL("image/png").split(",")[1], "base64");
        });
    }
    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    }
    getRatioToBase() {
        return 1;
    }
    ratioAdjust(arr, ratio = -1) {
        if (ratio < 0)
            ratio = this.getRatioToBase();
        return arr.map(r => r.map(e => e * ratio));
    }
    moveRect(sx, sy, sw, sh, x, y, w = -1, h = -1, copyMode = false) {
        const oldCanvas = this.canvasCopy();
        if (!copyMode)
            this.clearRect(sx, sy, sw, sh);
        w = w < 0 ? sw : w;
        h = h < 0 ? sh : h;
        this.clearRect(x, y, w, h);
        this.ctx.drawImage(oldCanvas, sx, sy, sw, sh, x, y, w, h);
    }
    canvasCopy() {
        let ncan = new canvas_1.Canvas(this.canvas.width, this.canvas.height, this.canvas.type);
        ncan.getContext("2d").drawImage(this.canvas, 0, 0);
        return ncan;
    }
    shiftRect(x, y, w, h, pixelsToMove, copyMode = false) {
        this.moveRect(x, y, w, h, x + pixelsToMove, y, -1, -1, copyMode);
    }
    processImg(func, ci = []) {
        const ratio = this.getRatioToBase();
        func(ratio, this.ratioAdjust(ci, ratio));
    }
    commonShift(ins, dx, dw, pixelsToMove, copyMode = false, reverseOrder = false) {
        if (reverseOrder)
            ins = ins.slice().reverse();
        ins.forEach((v) => this.shiftRect(v[0] + dx, v[1], v[2] + dw, v[3], pixelsToMove, copyMode));
    }
    a2sS() {
        this.processImg((ratio, aCI) => this.commonShift(aCI, -2 * ratio, ratio, ratio, true, true), SkinEditor.CI);
    }
}
SkinEditor.CI = [
    [55, 16, 1, 32], // right arm, last column, back
    [51, 16, 1, 4], // right arm, last column, bottom, main layer
    [51, 32, 1, 4], // right arm, last column, bottom, second layer
    [47, 16, 8, 32], // right arm, big middle region
    [63, 48, 1, 16], // left arm, last column, back, second layer
    [59, 48, 1, 4], // left arm, last column, bottom, second layer
    [55, 48, 8, 16], // left arm, big middle region, second layer
    [47, 48, 1, 16], // left arm, last column, back, main layer
    [43, 48, 1, 4], // left arm, last column, bottom, main layer
    [39, 48, 8, 16] // left arm, big middle region, main layer
];
exports.default = SkinEditor;
//# sourceMappingURL=SkinEditor.js.map