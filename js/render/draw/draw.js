'use strict';

function draw(dt) {
  drawImg(images.background, 0, 0, CanvasConfig.W, CanvasConfig.H, '#87ceeb');
  drawBreads();
  drawDuck();
  canvas2d.fillStyle = 'rgba(0,0,0,0.45)';
  canvas2d.fillRect(0, 0, CanvasConfig.W, 20);
  drawHUD();
  drawCombo(dt);
}

function drawImg(img, dx, dy, dw, dh, fallbackColor) {
  if (img.complete && img.naturalWidth) {
    canvas2d.drawImage(img, dx, dy, dw, dh);
  } else {
    canvas2d.fillStyle = fallbackColor;
    canvas2d.fillRect(dx, dy, dw, dh);
  }
}
