'use strict';

function onKeyDown(e) {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); gameState.keys.left  = true; }
  if (e.key === 'ArrowRight') { e.preventDefault(); gameState.keys.right = true; }
}

function onKeyUp(e) {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); gameState.keys.left  = false; }
  if (e.key === 'ArrowRight') { e.preventDefault(); gameState.keys.right = false; }
}

function init() {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);
}

init();
