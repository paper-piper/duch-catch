'use strict';

let gameState = {};

function buildState() {
  return {
    running:    false,
    timeLeft:   GameConfig.DURATION,
    score:      0,
    catches:    0,

    duck: {
      x:          CanvasConfig.W / 2,
      y:          DuckConfig.Y,
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
    duckSpeed:  DuckConfig.SPEED + catches * DuckConfig.SPEED_INC,
    breadSpeed: Math.min(BreadConfig.BASE_SPEED + catches * BreadConfig.SPEED_INC, BreadConfig.SPEED_CAP),
    spawnDelay: Math.max(0.5, 1.5 - catches * 0.1),
    maxBreads:  1 + Math.floor(catches / 4),
  };
}
