let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let stars = [];
let started = false;
let enabled = true;

function measureCanvas() {
  if (!canvas) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 85; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    });
  }
}

function draw() {
  if (!ctx || !canvas) return;

  stars.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;
  });

  if (enabled) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(8,6,6)';
    ctx.fillRect(0, 0, width, height);

    stars.forEach((s) => {
      const glowRadius = s.r * 6;
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      glow.addColorStop(0, `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`);
      glow.addColorStop(0.35, `rgba(212,175,55,${s.opacity * 0.35})`);
      glow.addColorStop(1, 'rgba(212,175,55,0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,230,150,${Math.min(1, s.opacity + 0.2)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  requestAnimationFrame(draw);
}

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.id = 'bw-global-starfield';
  canvas.className = 'bw-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  ctx = canvas.getContext('2d');
  measureCanvas();
  initStars();

  window.addEventListener('resize', () => {
    measureCanvas();
  });
}

export function ensureGlobalStarfield() {
  if (!canvas || !canvas.isConnected) {
    createCanvas();
  }

  if (!started) {
    started = true;
    requestAnimationFrame(draw);
  }
}

export function setGlobalStarfieldEnabled(nextEnabled) {
  enabled = Boolean(nextEnabled);
  if (canvas) {
    canvas.style.opacity = enabled ? '1' : '0';
  }
}
