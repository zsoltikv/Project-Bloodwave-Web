export default function Main(container) {
  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');

      :root {
        --crimson:        #8B0000;
        --crimson-bright: #C0392B;
        --gold:           #B8960C;
        --gold-light:     #D4AF37;
        --obsidian:       #080606;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; }

      .mn-root {
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--obsidian);
        font-family: 'Montserrat', sans-serif;
        position: relative;
        overflow-x: hidden;
      }

      /* === CANVAS === */
      #mn-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      /* === PARTICLES === */
      .mn-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        animation: mn-float linear infinite;
        z-index: 2;
        will-change: transform, opacity;
      }
      @keyframes mn-float {
        0%   { transform: translateY(105vh) translateX(0px); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.6; }
        100% { transform: translateY(-10vh) translateX(var(--drift)); opacity: 0; }
      }

      /* =====================================================
         NAVBAR
         ===================================================== */
      .mn-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: linear-gradient(180deg,
          rgba(8,4,4,0.97) 0%,
          rgba(10,3,3,0.92) 100%);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        border-bottom: 1px solid rgba(139,0,0,0.2);
        animation: mn-nav-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
      }

      /* Gold line below border */
      .mn-nav::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent);
        pointer-events: none;
      }

      @keyframes mn-nav-in {
        from { opacity: 0; transform: translateY(-16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .mn-nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 clamp(16px, 4vw, 48px);
        height: clamp(56px, 7vh, 68px);
        display: flex;
        align-items: center;
        position: relative;
      }

      /* --- Logo --- */
      .mn-logo {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 400;
        font-size: clamp(18px, 3.5vw, 24px);
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        text-decoration: none;
        text-shadow:
          0 0 20px rgba(180,0,0,0.5),
          0 0 50px rgba(139,0,0,0.2);
        flex-shrink: 0;
        user-select: none;
        transition: text-shadow 0.4s;
      }
      .mn-logo:hover {
        text-shadow:
          0 0 28px rgba(192,57,43,0.75),
          0 0 70px rgba(139,0,0,0.35);
      }

      /* --- Center Links (desktop) --- */
      .mn-links {
        display: flex;
        align-items: center;
        gap: clamp(28px, 5vw, 56px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .mn-link {
        font-size: clamp(8px, 1.5vw, 10px);
        font-weight: 400;
        letter-spacing: clamp(3px, 1vw, 5px);
        color: rgba(255,255,255,0.38);
        text-transform: uppercase;
        text-decoration: none;
        position: relative;
        padding-bottom: 3px;
        transition: color 0.35s;
        white-space: nowrap;
      }

      .mn-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 1px;
        background: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
      }

      .mn-link:hover {
        color: rgba(255,255,255,0.92);
      }
      .mn-link:hover::after { width: 100%; }

      .mn-link.active {
        color: rgba(212,175,55,0.75);
      }
      .mn-link.active::after { width: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold)); }

      /* --- Right side --- */
      .mn-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      /* Profile avatar button */
      .mn-avatar {
        width: clamp(34px, 4.5vw, 40px);
        height: clamp(34px, 4.5vw, 40px);
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(139,0,0,0.6) 0%, rgba(40,5,5,0.9) 100%);
        border: 1px solid rgba(139,0,0,0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.35s, box-shadow 0.35s, transform 0.25s;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      .mn-avatar::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(212,175,55,0.08), transparent 65%);
        pointer-events: none;
      }

      .mn-avatar:hover {
        border-color: rgba(212,175,55,0.45);
        box-shadow:
          0 0 16px rgba(139,0,0,0.35),
          0 0 36px rgba(139,0,0,0.12);
        transform: scale(1.07);
      }

      .mn-avatar svg {
        width: 18px;
        height: 18px;
        color: rgba(212,175,55,0.65);
        transition: color 0.3s;
        position: relative;
        z-index: 1;
      }
      .mn-avatar:hover svg { color: rgba(212,175,55,0.95); }

      /* Hamburger button (mobile only) */
      .mn-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        gap: 5px;
        background: none;
        border: 1px solid rgba(139,0,0,0.25);
        cursor: pointer;
        padding: 0;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        transition: border-color 0.3s;
      }
      .mn-hamburger:hover { border-color: rgba(192,57,43,0.5); }

      .mn-bar {
        display: block;
        width: 18px;
        height: 1px;
        background: rgba(212,175,55,0.6);
        transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s;
        transform-origin: center;
      }

      /* Mobile dropdown */
      .mn-mobile-menu {
        display: none;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1);
        background: linear-gradient(180deg, rgba(10,3,3,0.98) 0%, rgba(8,2,2,0.99) 100%);
        border-top: 1px solid rgba(139,0,0,0.12);
      }

      .mn-mobile-menu-inner {
        padding: 10px clamp(16px, 4vw, 48px) 16px;
      }

      .mn-mobile-link {
        display: flex;
        align-items: center;
        padding: 14px 8px;
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 4px;
        color: rgba(255,255,255,0.35);
        text-transform: uppercase;
        text-decoration: none;
        border-bottom: 1px solid rgba(139,0,0,0.1);
        transition: color 0.3s, padding-left 0.3s;
      }
      .mn-mobile-link:last-of-type { border-bottom: none; }
      .mn-mobile-link:hover { color: rgba(255,255,255,0.8); padding-left: 14px; }

      .mn-mobile-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent);
        margin: 6px 0;
      }

      .mn-mobile-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 8px;
        font-size: 9px;
        font-weight: 400;
        letter-spacing: 4px;
        color: rgba(212,175,55,0.5);
        text-transform: uppercase;
        background: none;
        border: none;
        width: 100%;
        cursor: pointer;
        transition: color 0.3s, padding-left 0.3s;
        -webkit-tap-highlight-color: transparent;
        outline: none;
      }
      .mn-mobile-profile:hover { color: rgba(212,175,55,0.9); padding-left: 14px; }

      .mn-mobile-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(139,0,0,0.6), rgba(40,5,5,0.9));
        border: 1px solid rgba(139,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .mn-mobile-avatar svg { width: 14px; height: 14px; color: rgba(212,175,55,0.6); }

      /* === RESPONSIVE BREAKPOINTS === */
      @media (max-width: 768px) {
        .mn-links    { display: none; }
        .mn-hamburger { display: flex; }
        .mn-mobile-menu { display: block; }
        .mn-avatar   { display: none; }
      }

      /* Hamburger → X state */
      .mn-hamburger.open .mn-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .mn-hamburger.open .mn-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .mn-hamburger.open .mn-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

      /* =====================================================
         MAIN CONTENT AREA
         ===================================================== */
      .mn-content {
        position: relative;
        z-index: 10;
        padding-top: clamp(56px, 7vh, 68px); /* offset for fixed navbar */
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mn-placeholder {
        text-align: center;
        padding: clamp(40px, 8vh, 80px) clamp(16px, 4vw, 32px);
        animation: mn-rise 1.1s cubic-bezier(0.22,1,0.36,1) both 0.3s;
      }

      @keyframes mn-rise {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .mn-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: 28px;
      }
      .mn-ornament-line {
        height: 1px;
        width: clamp(28px, 6vw, 48px);
        background: linear-gradient(90deg, transparent, var(--gold));
      }
      .mn-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      .mn-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.45);
        flex-shrink: 0;
        animation: mn-diamond-pulse 3s ease-in-out infinite;
      }
      @keyframes mn-diamond-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

      .mn-placeholder-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(28px, 6vw, 44px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.5vw, 10px);
        color: rgba(255,255,255,0.82);
        text-transform: uppercase;
        margin-bottom: 16px;
        text-shadow: 0 0 40px rgba(139,0,0,0.35);
      }

      .mn-placeholder-sub {
        font-size: clamp(7px, 1.8vw, 9.5px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.4);
        text-transform: uppercase;
      }

      /* Ambient radial glow */
      .mn-glow {
        position: fixed;
        width: min(600px, 120vw);
        height: min(600px, 120vw);
        background: radial-gradient(circle, rgba(139,0,0,0.12) 0%, rgba(80,0,0,0.05) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        animation: mn-breathe 6s ease-in-out infinite;
      }
      @keyframes mn-breathe {
        0%,100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.12); }
      }
    </style>

    <div class="mn-root">
      <canvas id="mn-canvas"></canvas>
      <div class="mn-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="mn-nav">
        <div class="mn-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="mn-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="mn-links">
            <a href="#" class="mn-link active">Feed</a>
            <a href="#" class="mn-link">Discover</a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="mn-right">

            <!-- Profile Avatar (desktop) -->
            <button class="mn-avatar" id="mn-profile-btn" aria-label="Profile & Settings">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>

            <!-- Hamburger (mobile) -->
            <button class="mn-hamburger" id="mn-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
              <span class="mn-bar"></span>
            </button>
          </div>

        </div>

        <!-- Mobile Dropdown -->
        <div class="mn-mobile-menu" id="mn-mobile-menu">
          <div class="mn-mobile-menu-inner">
            <a href="#" class="mn-mobile-link">Feed</a>
            <a href="#" class="mn-mobile-link">Discover</a>
            <div class="mn-mobile-divider"></div>
            <button class="mn-mobile-profile" id="mn-profile-btn-mobile">
              <span class="mn-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              Profile &amp; Settings
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="mn-content">
        <div class="mn-placeholder">
          <div class="mn-ornament">
            <div class="mn-ornament-line"></div>
            <div class="mn-ornament-diamond"></div>
            <div class="mn-ornament-line"></div>
          </div>
          <h1 class="mn-placeholder-title">Welcome Back</h1>
          <p class="mn-placeholder-sub">Your&nbsp;&nbsp;feed&nbsp;&nbsp;is&nbsp;&nbsp;loading</p>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  initMnCanvas();
  spawnMnParticles();

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger   = container.querySelector('#mn-hamburger');
  const mobileMenu  = container.querySelector('#mn-mobile-menu');
  let menuOpen = false;

  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0';
  });

  // Close on mobile link click
  mobileMenu?.querySelectorAll('.mn-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0';
    });
  });

  // ── Profile navigation (placeholder) ────────────────────────────────────
  const goToProfile = () => {
    // TODO: window.router.navigate('/profile') when route exists
    console.log('Navigate to profile/settings');
  };

  container.querySelector('#mn-profile-btn')?.addEventListener('click', goToProfile);
  container.querySelector('#mn-profile-btn-mobile')?.addEventListener('click', goToProfile);
}

/* ======================================================================
   CANVAS — same drifting star system as Login, no card bias
   ====================================================================== */
function initMnCanvas() {
  const canvas = document.getElementById('mn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  measure();
  window.addEventListener('resize', measure);

  const STAR_COUNT = 200;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar(true));

  function makeStar(firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.3;
    return {
      x: Math.random() * (W || window.innerWidth),
      y: firstTime ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 5,
      r,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.18 + 0.04),
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.004,
      isRed, isGold,
      life: 0,
      maxLife: 500 + Math.random() * 700,
    };
  }

  let streakTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    streakTimer++;
    if (streakTimer > 200 + Math.random() * 200) {
      drawMnStreak(ctx, W, H);
      streakTimer = 0;
    }

    stars.forEach((s, i) => {
      s.flicker += s.flickerSpeed;
      s.life++;
      const fade  = Math.min(s.life / 40, 1) * Math.max(1 - (s.life - s.maxLife * 0.8) / (s.maxLife * 0.2), 0);
      const alpha = s.opacity * (0.65 + 0.35 * Math.sin(s.flicker)) * Math.max(fade, 0.01);

      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
      ctx.fill();
      ctx.globalAlpha = 1;

      s.x += s.vx;
      s.y += s.vy;

      if (s.life > s.maxLife || s.y < -20 || s.x < -20 || s.x > W + 20) {
        stars[i] = makeStar(false);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function drawMnStreak(ctx, W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H * 0.7;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  const len   = 80 + Math.random() * 160;

  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.45, 'rgba(220,60,40,0.45)');
  grd.addColorStop(0.55, 'rgba(255,200,180,0.6)');
  grd.addColorStop(1, 'transparent');

  ctx.save();
  ctx.lineWidth = Math.random() * 1.0 + 0.3;
  ctx.strokeStyle = grd;
  ctx.shadowColor = 'rgba(200,50,30,0.3)';
  ctx.shadowBlur  = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.restore();
}

function spawnMnParticles() {
  const root = document.querySelector('.mn-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'mn-particle';
    const size     = Math.random() * 2.2 + 0.4;
    const delay    = Math.random() * 20;
    const duration = 18 + Math.random() * 22;
    const drift    = (Math.random() - 0.5) * 90;
    const isRed    = Math.random() < 0.28;
    const isGold   = !isRed && Math.random() < 0.15;
    const col      = isRed  ? 'rgba(192,57,43,0.55)'
                   : isGold ? 'rgba(212,175,55,0.4)'
                   :          'rgba(255,230,210,0.28)';

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    root.appendChild(p);
  }
}
