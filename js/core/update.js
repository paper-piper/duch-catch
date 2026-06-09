'use strict';

// ─── Timer ────────────────────────────────────────────────────────────────────
function tickTimer(gs, dt) {
  gs.timeLeft -= dt;
  if (gs.timeLeft <= 0) {
    gs.timeLeft = 0;
    endGame('time');
    return true;   // signal: game ended, stop this frame
  }
  return false;
}

// ─── Main update (called every frame) ────────────────────────────────────────
function update(dt) {
  const gs   = gameState;
  const diff = difficulty(gs.catches);

  if (tickTimer(gs, dt))           return;
  moveDuck(gs, dt, diff);
  animateDuck(gs, dt);
  trySpawnBread(gs, dt, diff);
  tickBreads(gs, dt);
}
