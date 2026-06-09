
function drawHUD() {
  drawScoreCounter();
  drawTimeCounter();
}

function drawTimeCounter() {
  const secs    = Math.ceil(gameState.timeLeft);
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  const textWidth = canvas2d.measureText(timeStr).width;
  let xRight = Math.round(CanvasConfig.W - 6 - textWidth);

  const CLOCK_ICON_W = 11, CLOCK_ICON_H = 14;
  xRight -= CLOCK_ICON_W + 3;
  drawImg(images.timerIcon, xRight, (20 - CLOCK_ICON_H) / 2, CLOCK_ICON_W, CLOCK_ICON_H, '#aaaaaa');
  xRight += CLOCK_ICON_W + 3;

  canvas2d.fillStyle = '#000';
  canvas2d.fillText(timeStr, xRight + 1, 11);
  canvas2d.fillStyle = '#fff';
  canvas2d.fillText(timeStr, xRight, 10);
}

function drawScoreCounter() {
  const BREAD_ICON_W = 14, BREAD_ICON_H = 14;
  let xCursor = 6;
  drawImg(images.breadIcon, xCursor, (20 - BREAD_ICON_H) / 2, BREAD_ICON_W, BREAD_ICON_H, '#c8860a');
  xCursor += BREAD_ICON_W + 3;
  canvas2d.font         = '15px PixelFont, monospace';
  canvas2d.textBaseline = 'middle';

  const snapped_x_pos = Math.round(xCursor);
  canvas2d.fillStyle = '#000';
  canvas2d.fillText('x ' + gameState.score, snapped_x_pos + 1, 11);
  canvas2d.fillStyle = '#fff';
  canvas2d.fillText('x ' + gameState.score, snapped_x_pos, 10);
}