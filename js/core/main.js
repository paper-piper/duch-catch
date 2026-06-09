'use strict';

// ─── Game lifecycle ───────────────────────────────────────────────────────────
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

  endMessageEl.textContent = reason === 'win'
    ? "The duck is stuffed! What a feast!"
    : "Time's up! The duck is still hungry...";
  finalScoreEl.textContent = 'Score: ' + gameState.score + '  |  Caught: ' + gameState.catches;

  gameOverScreen.classList.remove('hidden');
}

function resizeGame() {
  const scale = Math.min(window.innerWidth / CanvasConfig.W, window.innerHeight / CanvasConfig.H);
  gameWrapper.style.transform = `scale(${scale})`;
}

// ─── Entry point ─────────────────────────────────────────────────────────────
// This is the single place that controls startup order.
// Every other file only defines functions/classes — nothing runs until here.
function main() {
  setupDOM();                                      // 1. grab all DOM references
  setupInput();                                    // 2. keyboard listeners
  window.addEventListener('resize', resizeGame);   // 3. responsive scaling
  resizeGame();
  loadAssets(ASSETS);                              // 4. kick off image loading
  startBtn.addEventListener('click', startGame);   // 5. wire up UI buttons
  restartBtn.addEventListener('click', startGame);
}

main();
