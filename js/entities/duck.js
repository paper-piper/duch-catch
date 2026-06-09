'use strict';

class Duck {
  constructor() {
    this.x          = W / 2;
    this.y          = DUCK_Y;
    this.frame      = 0;
    this.frameTimer = 0;
    this.state      = 'idle';
    this.facingLeft = false;
  }

  move(keys, dt, diff) {
    if (keys.left) {
      this.x -= diff.duckSpeed * dt;
      this.facingLeft = true;
    }
    if (keys.right) {
      this.x += diff.duckSpeed * dt;
      this.facingLeft = false;
    }
    this.x = Math.max(DUCK_SPRITE_W / 2, Math.min(W - DUCK_SPRITE_W / 2, this.x));
  }

  animate(keys, breads, dt) {
    const moving = keys.left || keys.right;
    const nearby = breads.some(b => {
      const dx = b.x - this.x, dy = b.y - this.y;
      return Math.sqrt(dx * dx + dy * dy) < DUCK_EAT_PROXIMITY;
    });

    if (nearby)      this.state = 'eat';
    else if (moving) this.state = 'walk';
    else             this.state = 'idle';

    if (moving) {
      this.frameTimer += dt;
      if (this.frameTimer >= 1 / WALK_FPS) {
        this.frameTimer -= 1 / WALK_FPS;
        this.frame = (this.frame + 1) % WALK_FRAMES;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y - DUCK_SPRITE_H / 2);
    if (this.facingLeft) ctx.scale(-1, 1);

    if (this.state === 'eat') {
      drawImg(images.duckEat, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#e8a020');
    } else if (this.state === 'walk') {
      const frameImg = [images.duckWalk0, images.duckWalk1, images.duckWalk2, images.duckWalk3][this.frame % WALK_FRAMES];
      drawImg(frameImg, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
    } else {
      drawImg(images.duckIdle, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
    }

    ctx.restore();
  }
}
