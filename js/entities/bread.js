'use strict';

class Bread {
  constructor(speed) {
    this.x        = BREAD_SPRITE_W / 2 + Math.random() * (W - BREAD_SPRITE_W);
    this.y        = -BREAD_SPRITE_H / 2;
    this.rotation = 0;
    this.speed    = speed;
  }

  tick(dt) {
    this.y        += this.speed * dt;
    this.rotation += BREAD_ROT_SPEED;
  }

  isCaught(duck) {
    const duckLeft    = duck.x - DUCK_W / 2;
    const duckRight   = duck.x + DUCK_W / 2;
    const duckTop     = duck.y - DUCK_H;
    const breadBottom = this.y + BREAD_H / 2;
    const breadLeft   = this.x - BREAD_W / 2;
    const breadRight  = this.x + BREAD_W / 2;
    return breadRight > duckLeft  && breadLeft < duckRight &&
           breadBottom >= duckTop && breadBottom <= duck.y + 4;
  }

  isOffScreen() {
    return this.y - BREAD_H / 2 > H;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    drawImg(images.breadIcon, -BREAD_SPRITE_W / 2, -BREAD_SPRITE_H / 2, BREAD_SPRITE_W, BREAD_SPRITE_H, '#c8860a');
    ctx.restore();
  }
}
