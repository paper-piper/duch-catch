'use strict';

function moveDuck(dt, diff) {
  if (gameState.keys.left) {
    gameState.duck.x -= diff.duckSpeed * dt;
    gameState.duck.facingLeft = true;
  }
  if (gameState.keys.right) {
    gameState.duck.x += diff.duckSpeed * dt;
    gameState.duck.facingLeft = false;
  }
  gameState.duck.x = Math.max(DuckConfig.SPRITE_W / 2, Math.min(CanvasConfig.W - DuckConfig.SPRITE_W / 2, gameState.duck.x));
}

function animateDuck(dt) {
  const moving = gameState.keys.left || gameState.keys.right;
  const nearby = gameState.breads.some(b => {
    const dx = b.x - gameState.duck.x, dy = b.y - gameState.duck.y;
    return Math.sqrt(dx * dx + dy * dy) < DuckConfig.EAT_PROXIMITY;
  });

  if (nearby)      gameState.duck.state = 'eat';
  else if (moving) gameState.duck.state = 'walk';
  else             gameState.duck.state = 'idle';

  if (moving) {
    gameState.duck.frameTimer += dt;
    if (gameState.duck.frameTimer >= 1 / AnimationConfig.WALK_FPS) {
      gameState.duck.frameTimer -= 1 / AnimationConfig.WALK_FPS;
      gameState.duck.frame = (gameState.duck.frame + 1) % AnimationConfig.WALK_FRAMES;
    }
  }
}
