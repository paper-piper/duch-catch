function drawDuck() {
  const duck = gameState.duck;
  canvas2d.save();
  canvas2d.translate(duck.x, duck.y - DuckConfig.SPRITE_H / 2);
  if (duck.facingLeft) canvas2d.scale(-1, 1);

  if (duck.state === 'eat') {
    drawImg(images.duckEat, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#e8a020');
  } else if (duck.state === 'walk') {
    const frameImg = [images.duckWalk0, images.duckWalk1, images.duckWalk2, images.duckWalk3][duck.frame % AnimationConfig.WALK_FRAMES];
    drawImg(frameImg, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#f5c518');
  } else {
    drawImg(images.duckIdle, -DuckConfig.SPRITE_W / 2, 0, DuckConfig.SPRITE_W, DuckConfig.SPRITE_H, '#f5c518');
  }

  canvas2d.restore();
}

function drawBreads() {
  for (const b of gameState.breads) {
    canvas2d.save();
    canvas2d.translate(b.x, b.y);
    canvas2d.rotate(b.rotation * Math.PI / 180);
    drawImg(images.breadIcon, -BreadConfig.SPRITE_W / 2, -BreadConfig.SPRITE_H / 2, BreadConfig.SPRITE_W, BreadConfig.SPRITE_H, '#c8860a');
    canvas2d.restore();
  }
}