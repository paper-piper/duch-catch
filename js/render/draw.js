'use strict';

function drawImg(img, dx, dy, dw, dh, fallbackColor) {
  if (img.complete && img.naturalWidth) {
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(dx, dy, dw, dh);
  }
}

function drawDuck() {
  const duck = gameState.duck;
  ctx.save();
  ctx.translate(duck.x, duck.y - DuckConfig.SPRITE_H / 2);
  if (duck.facingLeft) ctx.scale(-1, 1);

  if (duck.state === 'eat') {
    drawImg(images.duckEat, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#e8a020');
  } else if (duck.state === 'walk') {
    const frameImg = [images.duckWalk0, images.duckWalk1, images.duckWalk2, images.duckWalk3][duck.frame % AnimationConfig.WALK_FRAMES];
    drawImg(frameImg, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#f5c518');
  } else {
    drawImg(images.duckIdle, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#f5c518');
  }

  ctx.restore();
}

function drawBreads() {
  for (const b of gameState.breads) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotation * Math.PI / 180);
    drawImg(images.breadIcon, -BreadConfig.SPRITE_W / 2, -BreadConfig.SPRITE_H / 2, BreadConfig.SPRITE_W, BreadConfig.SPRITE_H, '#c8860a');
    ctx.restore();
  }
}

function drawHUD() {
  const BREAD_ICON_W = 14, BREAD_ICON_H = 14;
  let xCursor = 6;
  drawImg(images.breadIcon, xCursor, (20 - BREAD_ICON_H) / 2, BREAD_ICON_W, BREAD_ICON_H, '#c8860a');
  xCursor += BREAD_ICON_W + 3;
  ctx.font         = '15px PixelFont, monospace';
  ctx.textBaseline = 'middle';

  const sx = Math.round(xCursor);
  ctx.fillStyle = '#000';
  ctx.fillText('x ' + gameState.score, sx + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText('x ' + gameState.score, sx,     10);

  const secs    = Math.ceil(gameState.timeLeft);
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  const textWidth = ctx.measureText(timeStr).width;
  let xRight = Math.round(CanvasConfig.W - 6 - textWidth);

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
  drawImg(images.background, 0, 0, CanvasConfig.W, CanvasConfig.H, '#87ceeb');
  drawBreads();
  drawDuck();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, CanvasConfig.W, 20);
  drawHUD();
}
