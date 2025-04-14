/* eslint-disable prefer-const */
import { Canvas, loadImage, CanvasRenderingContext2D } from "canvas";

type Rect = [number, number, number, number];

class SkinEditor {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private static readonly CI: Rect[] = [
    [55, 16, 1, 32], // right arm, last column, back
    [51, 16, 1, 4],  // right arm, last column, bottom, main layer
    [51, 32, 1, 4],  // right arm, last column, bottom, second layer
    [47, 16, 8, 32], // right arm, big middle region
    [63, 48, 1, 16], // left arm, last column, back, second layer
    [59, 48, 1, 4],  // left arm, last column, bottom, second layer
    [55, 48, 8, 16], // left arm, big middle region, second layer
    [47, 48, 1, 16], // left arm, last column, back, main layer
    [43, 48, 1, 4],  // left arm, last column, bottom, main layer
    [39, 48, 8, 16]  // left arm, big middle region, main layer
  ];

  constructor() {
    this.canvas = new Canvas(64, 64, "image");
    this.ctx = this.canvas.getContext("2d")!;
  }
  async loadImg(img : Buffer) {
    let image = await loadImage(img);
    this.ctx.drawImage(image, 0,0);
  }
  async getImg() {
    return Buffer.from(this.canvas.toDataURL("image/png").split(",")[1], "base64");
  }

  private clearRect(x: number, y: number, w: number, h: number): void {
    this.ctx.clearRect(x, y, w, h);
  }

  private getRatioToBase(): number {
    return 1;
  }

  private ratioAdjust(
    arr: Rect[],
    ratio: number = -1
  ): Rect[] {
    if (ratio < 0) ratio = this.getRatioToBase();
    return arr.map(r => r.map(e => e * ratio) as Rect);
  }

  private moveRect(
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    x: number,
    y: number,
    w: number = -1,
    h: number = -1,
    copyMode: boolean = false
  ): void {
    const oldCanvas = this.canvasCopy();
    if (!copyMode) this.clearRect(sx, sy, sw, sh);
    w = w < 0 ? sw : w;
    h = h < 0 ? sh : h;
    this.clearRect(x, y, w, h);
    this.ctx.drawImage(oldCanvas, sx, sy, sw, sh, x, y, w, h);
  }

  canvasCopy() {
    let ncan = new Canvas(this.canvas.width, this.canvas.height, this.canvas.type);
    ncan.getContext("2d").drawImage(this.canvas, 0,0);
    return ncan;
  }

  private shiftRect(
    x: number,
    y: number,
    w: number,
    h: number,
    pixelsToMove: number,
    copyMode: boolean = false
  ): void {
    this.moveRect(x, y, w, h, x + pixelsToMove, y, -1, -1, copyMode);
  }

  private processImg(
    func: (ratio: number, adjustedCI: Rect[]) => void,
    ci: Rect[] = []
  ): void {
    const ratio = this.getRatioToBase();
    func(ratio, this.ratioAdjust(ci, ratio));
  }

  private commonShift(
    ins: Rect[],
    dx: number,
    dw: number,
    pixelsToMove: number,
    copyMode: boolean = false,
    reverseOrder: boolean = false
  ): void {
    if (reverseOrder) ins = ins.slice().reverse();
    ins.forEach((v) =>
      this.shiftRect(v[0] + dx, v[1], v[2] + dw, v[3], pixelsToMove, copyMode)
    );
  }

  public a2sS(): void {
    this.processImg(
      (ratio, aCI) => this.commonShift(aCI, -2 * ratio, ratio, ratio, true, true),
      SkinEditor.CI
    );
  }
}

export default SkinEditor;