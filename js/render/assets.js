'use strict';

const ASSETS = {
  background: 'assets/background.png',
  duckIdle:   'assets/duck/duck_looking_up.png',
  duckEat:    'assets/duck/duck_opening_mouth.png',
  duckWalk0:  'assets/duck/duck_running_right/frame_000.png',
  duckWalk1:  'assets/duck/duck_running_right/frame_001.png',
  duckWalk2:  'assets/duck/duck_running_right/frame_002.png',
  duckWalk3:  'assets/duck/duck_running_right/frame_003.png',
  breadFall:  'assets/bread_fall.png',
  breadIcon:  'assets/icons/bread_14x14.png',
  timerIcon:  'assets/icons/clock-icon.png',
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
