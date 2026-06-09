'use strict';

// Declared globally so all scripts can reference them.
// Assigned in setupDOM() — do not use before main() runs.
let canvas, canvas2d;
let startScreen, gameOverScreen;
let startBtn, restartBtn;
let endMessageEl, finalScoreEl;
let gameWrapper;

// called explicitly from main.js — do not auto-invoke
function setupDOM() {
  canvas = document.getElementById('gameCanvas');
  canvas2d    = canvas.getContext('2d');
  canvas2d.imageSmoothingEnabled = false;

  startScreen    = document.getElementById('start-screen');
  gameOverScreen = document.getElementById('game-over-screen');
  startBtn       = document.getElementById('start-btn');
  restartBtn     = document.getElementById('restart-btn');
  endMessageEl   = document.getElementById('end-message');
  finalScoreEl   = document.getElementById('final-score');
  gameWrapper    = document.getElementById('game-wrapper');
}
