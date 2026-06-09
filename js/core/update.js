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

function trySpawnBread(gs, dt, diff) {
  gs.spawnTimer -= dt;
  if (gs.spawnTimer <= 0 && gs.breads.length < diff.maxBreads) {
    gs.breads.push(new Bread(diff.breadSpeed));
    gs.spawnTimer = diff.spawnDelay;
  }
}

function tickBreads(gs, dt) {
  const surviving = [];
  for (const b of gs.breads) {
    b.tick(dt);
    if (b.isCaught(gs.duck)) {
      gs.score++;
      gs.catches++;
      if (gs.catches >= WIN_CATCHES) { endGame('win'); return; }
    } else if (b.isOffScreen()) {
      gs.score--;
    } else {
      surviving.push(b);
    }
  }
  gs.breads = surviving;
}

// ─── Main update (called every frame) ────────────────────────────────────────
function update(dt) {
  const gs   = gameState;
  const diff = difficulty(gs.catches);

  if (tickTimer(gs, dt))                     return;
  gs.duck.move(gs.keys, dt, diff);
  gs.duck.animate(gs.keys, gs.breads, dt);
  trySpawnBread(gs, dt, diff);
  tickBreads(gs, dt);
}
