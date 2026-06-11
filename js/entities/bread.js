'use strict';

function spawnBread(speed) {
  gameState.breads.push({
    x:        BreadConfig.SPRITE_W / 2 + Math.random() * (CanvasConfig.W - BreadConfig.SPRITE_W),
    y:        -BreadConfig.SPRITE_H / 2,
    rotation: 0,
    speed,
    type: Math.random() < 0.1 ? BreadConfig.BREAD_ROTTEN_TYPE : BreadConfig.BREAD_NORMAL_TYPE
  });
}

function trySpawnBread(dt, diff) {
  gameState.spawnTimer -= dt;
  if (gameState.spawnTimer <= 0 && gameState.breads.length < diff.maxBreads) {
    spawnBread(diff.breadSpeed);
    gameState.spawnTimer = diff.spawnDelay;
  }
}
function tickBreads(dt) {
    for (const b of gameState.breads) {
      b.y        += b.speed * dt;
      b.rotation += BreadConfig.ROT_SPEED;
    }
}

function CheckBreadCollisions(dt) {
  const duckLeft  = gameState.duck.x - DuckConfig.W / 2;
  const duckRight = gameState.duck.x + DuckConfig.W / 2;
  const duckTop   = gameState.duck.y - DuckConfig.H;

  const surviving = [];
  for (const b of gameState.breads) {

    const breadBottom = b.y + BreadConfig.H / 2;
    const breadLeft   = b.x - BreadConfig.W / 2;
    const breadRight  = b.x + BreadConfig.W / 2;

    const breadTop   = b.y - BreadConfig.H / 2;
    const duckBottom = gameState.duck.y;

    const caughtTop  = breadRight > duckLeft && breadLeft < duckRight &&
                       breadBottom >= duckTop && breadBottom <= duckBottom + 4;
    const caughtSide = breadBottom > duckTop && breadTop < duckBottom &&
                       ((breadRight >= duckLeft && breadRight <= duckLeft + 4) ||
                        (breadLeft  <= duckRight && breadLeft >= duckRight - 4));
    const caught = caughtTop || caughtSide;

    if (caught) {
      gameState.particles.push(...spawnParticlesBurst(b.x, b.y, b.type));

      if (b.type === BreadConfig.BREAD_NORMAL_TYPE) {
        HandleBreadCollided();
      } else {
        HandleRottenBreadCollided();
      }
      if (gameState.catches >= GameConfig.WIN_CATCHES) { 
        endGame('win'); return; 
      }
    } 
    
    else if (b.y - BreadConfig.H / 2 > CanvasConfig.H) {
      HandleBreadMissed(b.type);
      }
    else {
      surviving.push(b);
    }
  }
  gameState.breads = surviving;
}

function HandleBreadCollided() {
      gameState.score++;
      gameState.catches++;
      gameState.combo++;
      gameState.combo_changed = true;
}

function HandleRottenBreadCollided() {
      gameState.score--;
      gameState.catches--;
      gameState.combo = 0;
      gameState.combo_changed = true;
}

function HandleBreadMissed(breadType) {
      if (breadType === BreadConfig.BREAD_ROTTEN_TYPE) return;
      gameState.score--;
      if (gameState.combo > 0) {
        gameState.combo_changed = true;
        gameState.combo = 0;
      }
}
