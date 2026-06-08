'use strict';

// ─── DOM refs ────────────────────────────────────────────────────────────────
const canvas       = document.getElementById('gameCanvas');
const ctx          = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const startScreen  = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn     = document.getElementById('start-btn');
const restartBtn   = document.getElementById('restart-btn');
const endMessageEl = document.getElementById('end-message');
const finalScoreEl = document.getElementById('final-score');

// ─── Asset loading ───────────────────────────────────────────────────────────
const ASSETS = {
  background:  'assets/background.png',
  duckIdle:    'assets/duck/duck_looking_up.png',
  duckEat:     'assets/duck/duck_opening_mouth.png',
  duckWalk0:   'assets/duck/duck_running_right/frame_000.png',
  duckWalk1:   'assets/duck/duck_running_right/frame_001.png',
  duckWalk2:   'assets/duck/duck_running_right/frame_002.png',
  duckWalk3:   'assets/duck/duck_running_right/frame_003.png',
  breadFall:   'assets/bread_fall.png',       // no sprite provided — uses rect fallback
  breadIcon:   'assets/icons/bread_14x14.png',
  timerIcon:   'assets/icons/clock-icon.png',
};

const images = {};

function loadAssets(assetMap) {
  const entries = Object.entries(assetMap);
  let loaded = 0;
  return new Promise((resolve) => {
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.onload  = () => { loaded++; if (loaded === entries.length) resolve(); };
      img.onerror = () => { loaded++; if (loaded === entries.length) resolve(); }; // graceful missing asset
      img.src = src;
      images[key] = img;
    });
  });
}

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 480;
const H = 270;

const DUCK_SPEED      = 120;     // px/s base
const DUCK_SPEED_INC  = 6;       // px/s added per catch
const DUCK_Y          = 240;     // baseline y (feet)
const DUCK_SPRITE_W   = 60;
const DUCK_SPRITE_H   = 60;
const DUCK_W          = 52;      // collision rect width  (~87% of sprite)
const DUCK_H          = 18;      // collision rect height (feet strip)
const DUCK_EAT_PROXIMITY = 50;   // px distance where mouth opens

const BREAD_BASE_SPEED  = 60;    // px/s at catch 0
const BREAD_SPEED_INC   = 8;     // px/s added per catch
const BREAD_SPEED_CAP   = 200;   // px/s ceiling
const BREAD_W           = 22;    // collision box
const BREAD_H           = 22;
const BREAD_SPRITE_W    = 28;    // breadIcon (14×14) drawn at 2×
const BREAD_SPRITE_H    = 28;
const BREAD_ROT_SPEED   = 1.5;   // degrees/frame at 60fps target

// Difficulty ramp — computed from gs.catches each frame
function difficulty(catches) {
  return {
    duckSpeed:  DUCK_SPEED + catches * DUCK_SPEED_INC,                      // 120 → 160
    breadSpeed: Math.min(BREAD_BASE_SPEED + catches * BREAD_SPEED_INC, BREAD_SPEED_CAP), // 60 → 200
    spawnDelay: Math.max(0.5, 1.5 - catches * 0.1),                         // 1.5 s → 0.5 s
    maxBreads:  1 + Math.floor(catches / 4),                                 // 1 → 2 → 3
  };
}

const GAME_DURATION   = 60;      // seconds
const WIN_CATCHES     = 10;

const WALK_FRAMES     = 4;       // sprite sheet columns for duck_walk
const WALK_FPS        = 8;       // animation fps

// ─── Game state ──────────────────────────────────────────────────────────────
let gameState = {};

function buildState() {
  return {
    running:    false,
    timeLeft:   GAME_DURATION,
    score:      0,         // net score (catches - misses)
    catches:    0,         // total successful catches

    duck: {
      x:          W / 2,
      y:          DUCK_Y,
      frame:      0,         // walk frame index
      frameTimer: 0,         // accumulator for walk animation
      state:      'idle',    // 'idle' | 'walk' | 'eat'
      facingLeft: false,     // flip sprite when moving left
    },

    breads:     [],        // array of active bread objects { x, y, rotation, speed }
    spawnTimer: 0,         // countdown to next spawn attempt

    keys: {
      left:  false,
      right: false,
    },
  };
}

// ─── Input ───────────────────────────────────────────────────────────────────
function onKeyDown(e) {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); gameState.keys.left  = true; }
  if (e.key === 'ArrowRight') { e.preventDefault(); gameState.keys.right = true; }
}
function onKeyUp(e) {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); gameState.keys.left  = false; }
  if (e.key === 'ArrowRight') { e.preventDefault(); gameState.keys.right = false; }
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup',   onKeyUp);

// ─── Game loop ────────────────────────────────────────────────────────────────
let rafId      = null;
let lastTime   = null;

function startLoop() {
  lastTime = null;
  rafId = requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!gameState.running) return;

  if (lastTime === null) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // seconds, capped at 50ms
  lastTime = timestamp;

  update(dt);
  draw();

  rafId = requestAnimationFrame(loop);
}

// ─── Update ───────────────────────────────────────────────────────────────────
function update(dt) {
  const gs = gameState;

  // Timer
  gs.timeLeft -= dt;
  if (gs.timeLeft <= 0) {
    gs.timeLeft = 0;
    endGame('time');
    return;
  }

  const diff = difficulty(gs.catches);

  // Duck movement — speed scales with difficulty
  const duck = gs.duck;
  let moving = false;
  if (gs.keys.left) {
    duck.x -= diff.duckSpeed * dt;
    duck.facingLeft = true;
    moving = true;
  }
  if (gs.keys.right) {
    duck.x += diff.duckSpeed * dt;
    duck.facingLeft = false;
    moving = true;
  }
  duck.x = Math.max(DUCK_SPRITE_W / 2, Math.min(W - DUCK_SPRITE_W / 2, duck.x));

  // Duck animation — eat if any bread is within proximity
  const anyNearby = gs.breads.some(b => {
    const dx = b.x - duck.x, dy = b.y - duck.y;
    return Math.sqrt(dx * dx + dy * dy) < DUCK_EAT_PROXIMITY;
  });
  if (anyNearby) {
    duck.state = 'eat';
  } else if (moving) {
    duck.state = 'walk';
  } else {
    duck.state = 'idle';
  }
  if (moving) {
    duck.frameTimer += dt;
    if (duck.frameTimer >= 1 / WALK_FPS) {
      duck.frameTimer -= 1 / WALK_FPS;
      duck.frame = (duck.frame + 1) % WALK_FRAMES;
    }
  }

  // Spawn new bread when under the active cap and timer has elapsed
  gs.spawnTimer -= dt;
  if (gs.spawnTimer <= 0 && gs.breads.length < diff.maxBreads) {
    spawnBread(diff.breadSpeed);
    gs.spawnTimer = diff.spawnDelay;
  }

  // Update each bread; collect ones that survive this frame
  const duckLeft  = duck.x - DUCK_W / 2;
  const duckRight = duck.x + DUCK_W / 2;
  const duckTop   = duck.y - DUCK_H;

  const surviving = [];
  for (const b of gs.breads) {
    b.y += b.speed * dt;
    b.rotation += BREAD_ROT_SPEED;

    const breadBottom = b.y + BREAD_H / 2;
    const breadLeft   = b.x - BREAD_W / 2;
    const breadRight  = b.x + BREAD_W / 2;

    const hit = breadRight > duckLeft && breadLeft < duckRight &&
                breadBottom >= duckTop && breadBottom <= duck.y + 4;

    if (hit) {
      gs.score++;
      gs.catches++;
      if (gs.catches >= WIN_CATCHES) { endGame('win'); return; }
    } else if (b.y - BREAD_H / 2 > H) {
      gs.score--;            // missed — drop off screen
    } else {
      surviving.push(b);     // still in play
    }
  }
  gs.breads = surviving;
}

function spawnBread(speed) {
  gameState.breads.push({
    x:        BREAD_SPRITE_W / 2 + Math.random() * (W - BREAD_SPRITE_W),
    y:        -BREAD_SPRITE_H / 2,
    rotation: 0,
    speed,
  });
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function drawImg(img, dx, dy, dw, dh, fallbackColor) {
  if (img.complete && img.naturalWidth) {
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(dx, dy, dw, dh);
  }
}

// ─── Draw ─────────────────────────────────────────────────────────────────────
function draw() {
  const gs = gameState;

  // Background
  drawImg(images.background, 0, 0, W, H, '#87ceeb');

  // Breads
  for (const b of gs.breads) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotation * Math.PI / 180);
    drawImg(images.breadIcon, -BREAD_SPRITE_W / 2, -BREAD_SPRITE_H / 2, BREAD_SPRITE_W, BREAD_SPRITE_H, '#c8860a');
    ctx.restore();
  }

  // Duck
  drawDuck(gs.duck);

  // HUD bar
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, 20);
  drawHUD(gs);
}

function drawDuck(duck) {
  ctx.save();
  ctx.translate(duck.x, duck.y - DUCK_SPRITE_H / 2);
  if (duck.facingLeft) ctx.scale(-1, 1);   // flip horizontally when moving left

  if (duck.state === 'eat') {
    drawImg(images.duckEat, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#e8a020');
  } else if (duck.state === 'walk') {
    const frameImg = [images.duckWalk0, images.duckWalk1, images.duckWalk2, images.duckWalk3][duck.frame % WALK_FRAMES];
    drawImg(frameImg, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
  } else {
    drawImg(images.duckIdle, -DUCK_SPRITE_W / 2, 0, DUCK_SPRITE_W, DUCK_SPRITE_H, '#f5c518');
  }

  ctx.restore();
}

function drawHUD(gs) {
  // Score (left) — bread_14x14.png is 14×14
  const BREAD_ICON_W = 14, BREAD_ICON_H = 14;
  let xCursor = 6;
  drawImg(images.breadIcon, xCursor, (20 - BREAD_ICON_H) / 2, BREAD_ICON_W, BREAD_ICON_H, '#c8860a');
  xCursor += BREAD_ICON_W + 3;
  ctx.font      = '15px PixelFont, monospace';
  ctx.textBaseline = 'middle';

  // shadow
  ctx.fillStyle = '#000';
  ctx.fillText('x ' + gs.score, xCursor + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText('x ' + gs.score, xCursor, 10);

  // Timer (right)
  const secs    = Math.ceil(gs.timeLeft);
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  const textWidth = ctx.measureText(timeStr).width;
  let xRight = W - 6 - textWidth;

  // clock-icon.png is 11×14
  const CLOCK_ICON_W = 11, CLOCK_ICON_H = 14;
  xRight -= CLOCK_ICON_W + 3;
  drawImg(images.timerIcon, xRight, (20 - CLOCK_ICON_H) / 2, CLOCK_ICON_W, CLOCK_ICON_H, '#aaaaaa');
  xRight += CLOCK_ICON_W + 3;

  ctx.fillStyle = '#000';
  ctx.fillText(timeStr, xRight + 1, 11);
  ctx.fillStyle = '#fff';
  ctx.fillText(timeStr, xRight, 10);
}

// ─── Game flow ────────────────────────────────────────────────────────────────
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

  // Draw final frame
  draw();

  if (reason === 'win') {
    endMessageEl.textContent = "The duck is stuffed! What a feast!";
  } else {
    endMessageEl.textContent = "Time's up! The duck is still hungry...";
  }
  finalScoreEl.textContent = 'Score: ' + gameState.score + '  |  Caught: ' + gameState.catches;

  gameOverScreen.classList.remove('hidden');
}

// ─── Responsive scaling ───────────────────────────────────────────────────────
const gameWrapper = document.getElementById('game-wrapper');

function resizeGame() {
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  gameWrapper.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', resizeGame);
resizeGame();

loadAssets(ASSETS);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
