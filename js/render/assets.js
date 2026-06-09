'use strict';

const ASSETS = {
  background: 'assets/background.png',
  duckIdle:   'assets/duck/idle.png',
  duckEat:    'assets/duck/eat.png',
  duckWalk0:  'assets/duck/walk/frame_000.png',
  duckWalk1:  'assets/duck/walk/frame_001.png',
  duckWalk2:  'assets/duck/walk/frame_002.png',
  duckWalk3:  'assets/duck/walk/frame_003.png',
  breadIcon:  'assets/icons/bread.png',
  timerIcon:  'assets/icons/clock.png',
};

const images = {};

function loadAssets(assetMap) {
  const entries = Object.entries(assetMap);
  let loaded = 0;
  return new Promise((resolve) => {
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.onload  = () => { loaded++; if (loaded === entries.length) resolve(); };
      img.onerror = () => { loaded++; if (loaded === entries.length) resolve(); };
      img.src = src;
      images[key] = img;
    });
  });
}
