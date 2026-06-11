'use strict';

function tickTimer(dt) {
  gameState.timeLeft -= dt;
  if (gameState.timeLeft <= 0) {
    gameState.timeLeft = 0;
    endGame('time');
    return true;
  }
  return false;
}

function update(dt) {
  const diff = difficulty(gameState.catches);

  if (tickTimer(dt))       return;
  moveDuck(dt, diff);
  animateDuck(dt);
  trySpawnBread(dt, diff);
  tickBreads(dt);
  CheckBreadCollisions(dt);
  ticks_all_particles(dt);
  updateCombo(dt);
}
