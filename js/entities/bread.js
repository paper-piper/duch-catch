'use strict';

// ─── Spawn ────────────────────────────────────────────────────────────────────
function spawnBread(speed) {
  gameState.breads.push({
    x:        BREAD_SPRITE_W / 2 + Math.random() * (W - BREAD_SPRITE_W),
    y:        -BREAD_SPRITE_H / 2,
    rotation: 0,
    speed,
  });
}

function trySpawnBread(gs, dt, diff) {
  gs.spawnTimer -= dt;
  if (gs.spawnTimer <= 0 && gs.breads.length < diff.maxBreads) {
    spawnBread(diff.breadSpeed);
    gs.spawnTimer = diff.spawnDelay;
  }
}

// ─── Physics & collision ──────────────────────────────────────────────────────
function tickBreads(gs, dt) {
  const duck      = gs.duck;
  const duckLeft  = duck.x - DUCK_W / 2;
  const duckRight = duck.x + DUCK_W / 2;
  const duckTop   = duck.y - DUCK_H;

  const surviving = [];
  for (const b of gs.breads) {
    b.y        += b.speed * dt;
    b.rotation += BREAD_ROT_SPEED;

    const breadBottom = b.y + BREAD_H / 2;
    const breadLeft   = b.x - BREAD_W / 2;
    const breadRight  = b.x + BREAD_W / 2;

    const caught = breadRight > duckLeft  && breadLeft < duckRight &&
                   breadBottom >= duckTop && breadBottom <= duck.y + 4;

    if (caught) {
      gs.score++;
      gs.catches++;
      if (gs.catches >= WIN_CATCHES) { endGame('win'); return; }
    } else if (b.y - BREAD_H / 2 > H) {
      gs.score--;                 // missed — fell off screen
    } else {
      surviving.push(b);          // still in play
    }
  }
  gs.breads = surviving;
}
