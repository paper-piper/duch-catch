'use strict';

function startGame() {
  gameState = buildState();
  gameState.running = true;
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  startLoop();
}

function endGame(reason) {
  gameState.running = false;
  if (rafId) cancelAnimationFrame(rafId);

  draw();

  if (reason === 'win') {
    endMessageEl.textContent = "The duck is stuffed! What a feast!";
  } else {
    endMessageEl.textContent = "Time's up! The duck is still hungry...";
  }
  finalScoreEl.textContent = 'Score: ' + gameState.score + '  |  Caught: ' + gameState.catches;

  gameOverScreen.classList.remove('hidden');
}

function resizeGame() {
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  gameWrapper.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', resizeGame);
resizeGame();

loadAssets(ASSETS);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
