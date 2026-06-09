'use strict';

const canvas       = document.getElementById('gameCanvas');
const ctx          = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const startScreen    = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn       = document.getElementById('start-btn');
const restartBtn     = document.getElementById('restart-btn');
const endMessageEl   = document.getElementById('end-message');
const finalScoreEl   = document.getElementById('final-score');
const gameWrapper    = document.getElementById('game-wrapper');
