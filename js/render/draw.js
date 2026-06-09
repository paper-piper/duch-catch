'use strict';

function drawImg(img, dx, dy, dw, dh, fallbackColor) {
  if (img.complete && img.naturalWidth) {
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(dx, dy, dw, dh);
  }
}


function drawHUD(gs) {
  const BREAD_ICON_W = 14, BREAD_ICON_H = 14;
  let xCursor = 6;
  drawImg(images.breadIcon, xCursor, (20 - BREAD_ICON_H) / 2, BREAD_ICON_W, BREAD_ICON_H, '#c8860a');
  xCursor += BREAD_ICON_W + 3;
  ctx.font         = '15px PixelFont, monospace';
  ctx.textBaseline = 'middle';

  const sx = Math.round(xCursor);
  ctx.fillStyle = '#000';
  ctx.fillText('x ' + gs.score, sx + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText('x ' + gs.score, sx,     10);

  const secs    = Math.ceil(gs.timeLeft);
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  const textWidth = ctx.measureText(timeStr).width;
  let xRight = Math.round(W - 6 - textWidth);

  const CLOCK_ICON_W = 11, CLOCK_ICON_H = 14;
  xRight -= CLOCK_ICON_W + 3;
  drawImg(images.timerIcon, xRight, (20 - CLOCK_ICON_H) / 2, CLOCK_ICON_W, CLOCK_ICON_H, '#aaaaaa');
  xRight += CLOCK_ICON_W + 3;

  ctx.fillStyle = '#000';
  ctx.fillText(timeStr, xRight + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText(timeStr, xRight,     10);
}

function draw() {
  const gs = gameState;

  drawImg(images.background, 0, 0, W, H, '#87ceeb');

  for (const b of gs.breads) b.draw();

  gs.duck.draw();

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, 20);
  drawHUD(gs);
}
