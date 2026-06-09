'use strict';

function spawnBread(speed) {
  gameState.breads.push({
    x:        BreadConfig.SPRITE_W / 2 + Math.random() * (CanvasConfig.W - BreadConfig.SPRITE_W),
    y:        -BreadConfig.SPRITE_H / 2,
    rotation: 0,
    speed,
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

function HandleBreadsCollisions(dt) {
  const duckLeft  = gameState.duck.x - DuckConfig.W / 2;
  const duckRight = gameState.duck.x + DuckConfig.W / 2;
  const duckTop   = gameState.duck.y - DuckConfig.H;

  const surviving = [];
  for (const b of gameState.breads) {

    const breadBottom = b.y + BreadConfig.H / 2;
    const breadLeft   = b.x - BreadConfig.W / 2;
    const breadRight  = b.x + BreadConfig.W / 2;

    const caught = breadRight > duckLeft  && breadLeft < duckRight &&
                   breadBottom >= duckTop && breadBottom <= gameState.duck.y + 4;

    if (caught) {
      gameState.score++;
      gameState.catches++;
      gameState.combo++;
      gameState.combo_changed = true;
      if (gameState.catches >= GameConfig.WIN_CATCHES) { 
        endGame('win'); return; 
      }
    } 
    
    else if (b.y - BreadConfig.H / 2 > CanvasConfig.H) {
      gameState.score--;
      if (gameState.combo > 0) {
        gameState.combo_changed = true;
        gameState.combo = 0;
      }
    } else {
      surviving.push(b);
    }
  }
  gameState.breads = surviving;
}