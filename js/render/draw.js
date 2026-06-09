'use strict';

function drawImg(img, dx, dy, dw, dh, fallbackColor) {
  if (img.complete && img.naturalWidth) {
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(dx, dy, dw, dh);
  }
}

function drawDuck(duck) {
  ctx.save();
  ctx.translate(duck.x, duck.y - DUCK_SPRITE_H / 2);
  if (duck.facingLeft) ctx.scale(-1, 1);

  if (duck.state === 'eat') {
    drawImg(images.duckEat, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#e8a020');
  } else if (duck.state === 'walk') {
    const frameImg = [images.duckWalk0, images.duckWalk1, images.duckWalk2, images.duckWalk3][duck.frame % WALK_FRAMES];
    drawImg(frameImg, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
  } else {
    drawImg(images.duckIdle, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
  }

  ctx.restore();
}

function drawHUD(gs) {
  const BREAD_ICON_W = 14, BREAD_ICON_H = 14;
  let xCursor = 6;
  drawImg(images.breadIcon, xCursor, (20 - BREAD_ICON_H) / 2, BREAD_ICON_W, BREAD_ICON_H, '#c8860a');
  xCursor += BREAD_ICON_W + 3;
  ctx.font         = '15px PixelFont, monospace';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#000';
  ctx.fillText('x ' + gs.score, xCursor + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText('x ' + gs.score, xCursor, 10);

  const secs    = Math.ceil(gs.timeLeft);
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  const textWidth = ctx.measureText(timeStr).width;
  let xRight = W - 6 - textWidth;

  const CLOCK_ICON_W = 11, CLOCK_ICON_H = 14;
  xRight -= CLOCK_ICON_W + 3;
  drawImg(images.timerIcon, xRight, (20 - CLOCK_ICON_H) / 2, CLOCK_ICON_W, CLOCK_ICON_H, '#aaaaaa');
  xRight += CLOCK_ICON_W + 3;

  ctx.fillStyle = '#000';
  ctx.fillText(timeStr, xRight + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText(timeStr, xRight, 10);
}

function draw() {
  const gs = gameState;

  drawImg(images.background, 0, 0, W, H, '#87ceeb');

  for (const b of gs.breads) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotation * Math.PI / 180);
    drawImg(images.breadIcon, -BREAD_SPRITE_W / 2, -BREAD_SPRITE_H / 2, BREAD_SPRITE_W, BREAD_SPRITE_H, '#c8860a');
    ctx.restore();
  }

  drawDuck(gs.duck);

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, 20);
  drawHUD(gs);
}
