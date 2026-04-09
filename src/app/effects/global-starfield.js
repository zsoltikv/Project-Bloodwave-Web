// global-starfield effect module: applies reusable dom effects and ui behaviors.
// keeps visual interaction logic isolated from page rendering code.

// canvas and 2d context used to render the global starfield background
let canvas = null;
// declares mutable state used in this scope
let ctx = null;

// current layout size in css pixels
let width = 0;
// declares mutable state used in this scope
let height = 0;

// array of star objects maintained by the animation loop
let stars = [];

// whether the animation loop has been started
let started = false;

// whether the starfield is visible / should be drawn
let enabled = true;

// id for a pending resize animation frame, used to debounce resize handling
let resizeFrameId = 0;

// measure the available viewport and resize the canvas accordingly
// preserves existing star positions by scaling them when the canvas size changes
function measureCanvas() {
  // checks a condition before executing this branch
  if (!canvas || !ctx) return;

  // declares a constant used in this scope
  const nextWidth = Math.max(1, window.innerWidth);
  // declares a constant used in this scope
  const nextHeight = Math.max(1, window.innerHeight);
  // declares a constant used in this scope
  const prevWidth = width;
  // declares a constant used in this scope
  const prevHeight = height;
  // declares a constant used in this scope
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

  // executes this operation step as part of the flow
  width = nextWidth;
  // executes this operation step as part of the flow
  height = nextHeight;

  // set backing buffer size using device pixel ratio for sharp rendering
  canvas.width = Math.round(nextWidth * devicePixelRatio);
  // executes this operation step as part of the flow
  canvas.height = Math.round(nextHeight * devicePixelRatio);
  // executes this operation step as part of the flow
  canvas.style.width = `${nextWidth}px`;
  // executes this operation step as part of the flow
  canvas.style.height = `${nextHeight}px`;
  // executes this operation step as part of the flow
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  // if we had a previous render, scale existing star coordinates to the new size
  if (!stars.length || prevWidth <= 0 || prevHeight <= 0) return;

  // declares a constant used in this scope
  const scaleX = nextWidth / prevWidth;
  // declares a constant used in this scope
  const scaleY = nextHeight / prevHeight;

  // defines an arrow function used by surrounding logic
  stars.forEach((star) => {
    // executes this operation step as part of the flow
    star.x *= scaleX;
    // executes this operation step as part of the flow
    star.y *= scaleY;
  });
}

// initialize a set of star objects with random positions, sizes and velocities
function initStars() {
  // executes this operation step as part of the flow
  stars = [];
  // iterates through a sequence of values
  for (let i = 0; i < 85; i++) {
    stars.push({
      // sets a named field inside an object or configuration block
      x: Math.random() * width,
      // sets a named field inside an object or configuration block
      y: Math.random() * height,
      // sets a named field inside an object or configuration block
      r: Math.random() * 1.3 + 0.3,
      // sets a named field inside an object or configuration block
      opacity: Math.random() * 0.6 + 0.2,
      // sets a named field inside an object or configuration block
      vx: (Math.random() - 0.5) * 0.15,
      // sets a named field inside an object or configuration block
      vy: (Math.random() - 0.5) * 0.15,
    });
  }
}

// main drawing loop: update star positions, render background and star glows
function draw() {
  // checks a condition before executing this branch
  if (!ctx || !canvas) return;

  // advance star positions and wrap them when they move outside the viewport
  stars.forEach((s) => {
    // executes this operation step as part of the flow
    s.x += s.vx;
    // executes this operation step as part of the flow
    s.y += s.vy;
    // checks a condition before executing this branch
    if (s.x < 0) s.x = width;
    // checks a condition before executing this branch
    if (s.x > width) s.x = 0;
    // checks a condition before executing this branch
    if (s.y < 0) s.y = height;
    // checks a condition before executing this branch
    if (s.y > height) s.y = 0;
  });

  // checks a condition before executing this branch
  if (enabled) {
    // clear and paint the dark background
    ctx.clearRect(0, 0, width, height);
    // executes this operation step as part of the flow
    ctx.fillStyle = "rgb(8,6,6)";
    // executes this operation step as part of the flow
    ctx.fillRect(0, 0, width, height);

    // for each star draw a soft radial glow and then a bright core circle
    stars.forEach((s) => {
      // declares a constant used in this scope
      const glowRadius = s.r * 6;
      // declares a constant used in this scope
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      // executes this operation step as part of the flow
      glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
      // executes this operation step as part of the flow
      glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
      // executes this operation step as part of the flow
      glow.addColorStop(1, "rgba(212,175,55,0)");

      // executes this operation step as part of the flow
      ctx.fillStyle = glow;
      // executes this operation step as part of the flow
      ctx.beginPath();
      // executes this operation step as part of the flow
      ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
      // executes this operation step as part of the flow
      ctx.fill();

      // executes this operation step as part of the flow
      ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
      // executes this operation step as part of the flow
      ctx.beginPath();
      // executes this operation step as part of the flow
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      // executes this operation step as part of the flow
      ctx.fill();
    });
  }

  // schedule next frame regardless of enabled state to keep positions updated
  requestAnimationFrame(draw);
}

// create and insert the canvas element used for the starfield
// the canvas is positioned fixed behind the app and does not capture pointer events
function createCanvas() {
  // executes this operation step as part of the flow
  canvas = document.createElement("canvas");
  // executes this operation step as part of the flow
  canvas.id = "bw-global-starfield";
  // executes this operation step as part of the flow
  canvas.className = "bw-canvas";
  // executes this operation step as part of the flow
  canvas.setAttribute("aria-hidden", "true");
  // executes this operation step as part of the flow
  canvas.style.position = "fixed";
  // executes this operation step as part of the flow
  canvas.style.inset = "0";
  // executes this operation step as part of the flow
  canvas.style.zIndex = "0";
  // executes this operation step as part of the flow
  canvas.style.pointerEvents = "none";
  // executes this operation step as part of the flow
  document.body.appendChild(canvas);

  // executes this operation step as part of the flow
  ctx = canvas.getContext("2d");
  // executes this operation step as part of the flow
  measureCanvas();
  // executes this operation step as part of the flow
  initStars();

  // debounce resize events by scheduling a single rAF to measure and scale the canvas
  window.addEventListener("resize", () => {
    // checks a condition before executing this branch
    if (resizeFrameId) {
      // executes this operation step as part of the flow
      cancelAnimationFrame(resizeFrameId);
    }
    // defines an arrow function used by surrounding logic
    resizeFrameId = requestAnimationFrame(() => {
      // executes this operation step as part of the flow
      resizeFrameId = 0;
      // executes this operation step as part of the flow
      measureCanvas();
    });
  });
}

// ensure the canvas is present and the animation loop is running
export function ensureGlobalStarfield() {
  // checks a condition before executing this branch
  if (!canvas || !canvas.isConnected) {
    // executes this operation step as part of the flow
    createCanvas();
  }

  // checks a condition before executing this branch
  if (!started) {
    // executes this operation step as part of the flow
    started = true;
    // executes this operation step as part of the flow
    requestAnimationFrame(draw);
  }
}

// toggle starfield visibility; when disabled the canvas is kept but faded out
export function setGlobalStarfieldEnabled(nextEnabled) {
  // executes this operation step as part of the flow
  enabled = Boolean(nextEnabled);
  // checks a condition before executing this branch
  if (canvas) {
    // executes this operation step as part of the flow
    canvas.style.opacity = enabled ? "1" : "0";
  }
}