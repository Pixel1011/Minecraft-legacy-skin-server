
// Conversion intructions (x, y, w, h)
const CI = [
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

var ctx = canvas.getContext("2d");
var imgElem = document.createElement("img");
var skinViewer2D = document.getElementById("skin-viewer-2d");
var canvas = document.createElement("canvas");

function shiftRect(x, y, w, h, pixelsToMove, copyMode=false){ // shift rectangle of pixels on the x axis (use negative pixelsToMove to shift left)
  moveRect(x, y, w, h, x+pixelsToMove, y, -1, -1, copyMode);
}

function clearRect(x, y, w, h){
  ctx.clearRect(x, y, w, h);
}

function canvasCopy(c){
  let n = document.createElement("canvas");
  n.width = c.width;
  n.height = c.height;
  n.getContext("2d").drawImage(c, 0, 0);
  return n;
}

function getRatioToBase(){  // get loaded image width to normal skin width (64) ratio
  return imgElem.width / 64;
}

function loadCanvas2Img(){
  skinViewer2D.src = imgElem.src = canvas.toDataURL("image/jpg", 0);
}

function ratioAdjust(arr, ratio=-1){  // pixel region array, adjusted for skin ratio
  if(ratio < 0) ratio = getRatioToBase();
  return arr.map(r => r.map(e => e*ratio));
}

function moveRect(sx, sy, sw, sh, x, y, w=-1, h=-1, copyMode=false){ // move/stretch image region
  let oldCanvas = canvasCopy(canvas);
  if(!copyMode) clearRect(sx, sy, sw, sh);
  w = w<0 ? sw : w;
  h = h<0 ? sh : h;
  clearRect(x, y, w, h);
  ctx.drawImage(oldCanvas, sx, sy, sw, sh, x, y, w, h); // draw from original
}

function processImg(func, ci=[]){  // execute necessary code before & after the specified image processing function (the function will recieve the skin ratio and ratio adjusted ci)
  let ratio = getRatioToBase();
  func(ratio, ratioAdjust(ci, ratio));
  loadCanvas2Img();
}

function commonShift(ins, dx, dw, pixelsToMove, copyMode=false, reverseOrder=false){
  if(reverseOrder) ins = ins.slice().reverse(); // using slice to work on a copy
  ins.forEach((v) => shiftRect(v[0]+dx, v[1], v[2]+dw, v[3], pixelsToMove, copyMode));
}

function a2sS(){ // convert Alex to Steve (stretch)
  processImg((ratio, aCI) => commonShift(aCI, -2*ratio, ratio, ratio, true, true), CI); // Shift pixels, starting from left to right
}

export {a2sS};
