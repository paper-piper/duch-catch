'use strict';

// ─── Duck movement ────────────────────────────────────────────────────────────
function moveDuck(gs, dt, diff) {
  const duck = gs.duck;
  if (gs.keys.left) {
    duck.x -= diff.duckSpeed * dt;
    duck.facingLeft = true;
  }
  if (gs.keys.right) {
    duck.x += diff.duckSpeed * dt;
    duck.facingLeft = false;
  }
  duck.x = Math.max(DUCK_SPRITE_W / 2, Math.min(W - DUCK_SPRITE_W / 2, duck.x));
}

// ─── Duck animation state ─────────────────────────────────────────────────────
function animateDuck(gs, dt) {
  const duck    = gs.duck;
  const moving  = gs.keys.left || gs.keys.right;
  const nearby  = gs.breads.some(b => {
    const dx = b.x - duck.x, dy = b.y - duck.y;
    return Math.sqrt(dx * dx + dy * dy) < DUCK_EAT_PROXIMITY;
  });

  if (nearby)       duck.state = 'eat';
  else if (moving)  duck.state = 'walk';
  else              duck.state = 'idle';

  // Advance walk-cycle frame only while moving
  if (moving) {
    duck.frameTimer += dt;
    if (duck.frameTimer >= 1 / WALK_FPS) {
      duck.frameTimer -= 1 / WALK_FPS;
      duck.frame = (duck.frame + 1) % WALK_FRAMES;
    }
  }
}
