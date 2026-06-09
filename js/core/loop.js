'use strict';

let rafId    = null;
let lastTime = null;

function startLoop() {
  lastTime = null;
  rafId = requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!gameState.running) return;

  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  update(dt);
  draw(dt);

  rafId = requestAnimationFrame(loop);
}
