'use strict';

let gameState = {};

function buildState() {
  return {
    running:    false,
    timeLeft:   GAME_DURATION,
    score:      0,
    catches:    0,

    duck: {
      x:          W / 2,
      y:          DUCK_Y,
      frame:      0,
      frameTimer: 0,
      state:      'idle',
      facingLeft: false,
    },

    breads:     [],
    spawnTimer: 0,

    keys: {
      left:  false,
      right: false,
    },
  };
}

function difficulty(catches) {
  return {
    duckSpeed:  DUCK_SPEED + catches * DUCK_SPEED_INC,
    breadSpeed: Math.min(BREAD_BASE_SPEED + catches * BREAD_SPEED_INC, BREAD_SPEED_CAP),
    spawnDelay: Math.max(0.5, 1.5 - catches * 0.1),
    maxBreads:  1 + Math.floor(catches / 4),
  };
}
