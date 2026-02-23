export default function ForgotPassword(container) {
  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');

      :root {
        --crimson: #8B0000;
        --crimson-bright: #C0392B;
        --gold: #B8960C;
        --gold-light: #D4AF37;
        --obsidian: #080606;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html, body { height: 100%; }

      .fp-root {
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--obsidian);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Montserrat', sans-serif;
        position: relative;
        overflow: hidden;
        padding: 20px 16px;
      }

      /* === CANVAS === */
      #fp-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
      }

      /* === GLOW === */
      .fp-glow-center {
        position: absolute;
        width: min(700px, 140vw);
        height: min(700px, 140vw);
        background: radial-gradient(circle, rgba(139,0,0,0.18) 0%, rgba(80,0,0,0.07) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        animation: fp-breathe 5s ease-in-out infinite;
        pointer-events: none;
        border-radius: 50%;
      }

      @keyframes fp-breathe {
        0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
        50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
      }

      /* === CARD === */
      .fp-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 480px;
        animation: fp-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes fp-rise {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }

      .fp-card-inner {
        background: linear-gradient(160deg,
          rgba(22,8,8,0.98) 0%,
          rgba(12,4,4,1)    50%,
          rgba(22,6,6,0.98) 100%);
        border: 1px solid rgba(139,0,0,0.3);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        position: relative;
        overflow: hidden;
        box-shadow:
          0 0 0 1px rgba(212,175,55,0.04),
          0 8px 40px rgba(0,0,0,0.8),
          0 0 80px rgba(139,0,0,0.08),
          inset 0 1px 0 rgba(255,255,255,0.03);
      }

      .fp-card-inner::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.08) 0%, transparent 60%);
        pointer-events: none;
        animation: fp-inner-glow 4s ease-in-out infinite;
      }
      @keyframes fp-inner-glow {
        0%,100% { opacity: 0.5; }
        50%      { opacity: 1; }
      }

      /* Gold corner ornaments */
      .fp-corner {
        position: absolute;
        width: 24px;
        height: 24px;
        z-index: 5;
        animation: fp-corner-pulse 4s ease-in-out infinite;
        pointer-events: none;
      }
      .fp-corner--tl { top: -1px;    left: -1px;  border-top: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .fp-corner--tr { top: -1px;    right: -1px; border-top: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      .fp-corner--bl { bottom: -1px; left: -1px;  border-bottom: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .fp-corner--br { bottom: -1px; right: -1px; border-bottom: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      @keyframes fp-corner-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.9} }

      /* === HEADER === */
      .fp-header {
        padding: clamp(36px, 6vw, 56px) clamp(24px, 8vw, 52px) clamp(28px, 5vw, 44px);
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(139,0,0,0.18);
        overflow: hidden;
      }

      .fp-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 55%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent);
      }

      .fp-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: clamp(14px, 3vw, 22px);
        animation: fp-fade-in 1s ease both 0.3s;
      }

      .fp-ornament-line {
        height: 1px;
        width: clamp(30px, 8vw, 52px);
        background: linear-gradient(90deg, transparent, var(--gold));
        animation: fp-expand 1s ease both 0.5s;
      }
      .fp-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      @keyframes fp-expand { from{width:0;opacity:0} to{opacity:1} }

      .fp-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.5);
        animation: fp-fade-in 1s ease both 0.6s;
        flex-shrink: 0;
      }

      @keyframes fp-fade-in { from{opacity:0} to{opacity:1} }

      .fp-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(32px, 7vw, 48px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 10px;
        animation: fp-fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.15s;
        text-shadow:
          0 0 30px rgba(180,0,0,0.6),
          0 0 70px rgba(139,0,0,0.25),
          0 2px 4px rgba(0,0,0,0.6);
      }

      .fp-subtitle {
        font-size: clamp(8px, 1.8vw, 10px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.55);
        text-transform: uppercase;
        margin-top: clamp(8px, 2vw, 14px);
        animation: fp-fade-in 1s ease both 0.75s;
      }

      /* === FORM === */
      .fp-form {
        padding: clamp(28px, 6vw, 48px) clamp(20px, 8vw, 52px) clamp(32px, 6vw, 52px);
      }

      /* Description text */
      .fp-desc {
        font-size: clamp(9px, 2.2vw, 11px);
        font-weight: 300;
        letter-spacing: 1.5px;
        color: rgba(255,255,255,0.3);
        line-height: 1.8;
        text-align: center;
        margin-bottom: clamp(24px, 5vw, 36px);
        animation: fp-fade-in 0.8s ease both 0.5s;
      }

      .fp-field {
        margin-bottom: clamp(20px, 4vw, 30px);
        animation: fp-field-in 0.8s cubic-bezier(0.22,1,0.36,1) both 0.55s;
      }

      @keyframes fp-field-in {
        from { opacity: 0; transform: translateX(-18px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .fp-label {
        display: block;
        font-size: clamp(8px, 2vw, 9.5px);
        font-weight: 500;
        letter-spacing: clamp(2px, 1vw, 4px);
        color: rgba(212,175,55,0.7);
        text-transform: uppercase;
        margin-bottom: clamp(8px, 2vw, 13px);
      }

      .fp-input-wrap { position: relative; }

      .fp-input {
        width: 100%;
        padding: clamp(13px, 3vw, 18px) clamp(14px, 4vw, 22px);
        background: rgba(0,0,0,0.55);
        border: 1px solid rgba(139,0,0,0.25);
        color: #F2EAEA;
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(12px, 3.2vw, 14px);
        font-weight: 300;
        letter-spacing: 0.5px;
        outline: none;
        transition: border-color 0.4s, box-shadow 0.4s, background 0.4s;
        border-radius: 0;
        -webkit-appearance: none;
        appearance: none;
      }

      .fp-input::placeholder {
        color: rgba(255,255,255,0.15);
        letter-spacing: 2px;
        font-size: clamp(10px, 2.5vw, 12px);
      }

      .fp-input:focus {
        border-color: rgba(192,57,43,0.55);
        box-shadow:
          0 0 0 1px rgba(139,0,0,0.12),
          0 4px 28px rgba(139,0,0,0.12),
          inset 0 1px 0 rgba(255,255,255,0.02);
        background: rgba(12,2,2,0.75);
      }

      .fp-input-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: auto;
        transform: scaleX(0);
        transform-origin: center;
        height: 1.5px;
        background: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        pointer-events: none;
      }
      .fp-input:focus ~ .fp-input-line { transform: scaleX(1); }

      /* === ERROR === */
      .fp-error {
        font-size: clamp(8px, 2vw, 9.5px);
        letter-spacing: 1.5px;
        color: rgba(192,57,43,0.75);
        text-transform: uppercase;
        margin-top: 8px;
        min-height: 14px;
        font-weight: 300;
        display: block;
        padding-left: 2px;
      }

      /* === BUTTON === */
      .fp-btn {
        width: 100%;
        padding: clamp(15px, 4vw, 20px);
        background: transparent;
        border: 1px solid rgba(139,0,0,0.55);
        color: rgba(255,255,255,0.85);
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(9px, 2.5vw, 11px);
        font-weight: 400;
        letter-spacing: clamp(4px, 1.5vw, 7px);
        text-transform: uppercase;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.4s, color 0.4s, box-shadow 0.4s;
        animation: fp-fade-in 0.8s ease both 0.7s;
        -webkit-tap-highlight-color: transparent;
      }

      .fp-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg,
          rgba(139,0,0,0) 0%,
          rgba(160,0,0,0.85) 50%,
          rgba(139,0,0,0) 100%);
        transform: translateX(-110%) skewX(-12deg);
        transition: transform 0.75s cubic-bezier(0.22,1,0.36,1);
      }
      .fp-btn:hover::before { transform: translateX(110%) skewX(-12deg); }

      .fp-btn:hover {
        border-color: rgba(192,57,43,0.85);
        color: #fff;
        box-shadow:
          0 0 24px rgba(139,0,0,0.22),
          0 0 60px rgba(139,0,0,0.08),
          inset 0 0 20px rgba(139,0,0,0.05);
      }
      .fp-btn:active { transform: scale(0.99); }
      .fp-btn-text { position: relative; z-index: 2; }

      .fp-btn-shimmer {
        position: absolute;
        top: 0; left: -80%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
        animation: fp-shimmer 5s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }
      @keyframes fp-shimmer { 0%,35%{left:-80%} 55%,100%{left:170%} }

      .fp-btn.success {
        border-color: rgba(212,175,55,0.65);
        color: var(--gold-light);
        box-shadow: 0 0 30px rgba(212,175,55,0.12);
        pointer-events: none;
      }

      /* === SUCCESS STATE === */
      .fp-success-panel {
        display: none;
        text-align: center;
        animation: fp-fade-in 0.7s ease both;
        padding: clamp(10px, 3vw, 20px) 0 clamp(6px, 2vw, 12px);
      }
      .fp-success-panel.visible { display: block; }

      .fp-success-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto clamp(14px, 3vw, 22px);
        position: relative;
      }
      .fp-success-icon svg {
        width: 100%;
        height: 100%;
        color: var(--gold-light);
        filter: drop-shadow(0 0 10px rgba(212,175,55,0.45));
        animation: fp-icon-in 0.7s cubic-bezier(0.22,1,0.36,1) both 0.1s;
      }
      @keyframes fp-icon-in {
        from { opacity: 0; transform: scale(0.6); }
        to   { opacity: 1; transform: scale(1); }
      }

      .fp-success-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(18px, 4.5vw, 26px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1vw, 6px);
        color: #fff;
        text-transform: uppercase;
        margin-bottom: clamp(10px, 2.5vw, 16px);
        text-shadow: 0 0 20px rgba(180,0,0,0.4);
        animation: fp-fade-in 0.8s ease both 0.25s;
      }

      .fp-success-text {
        font-size: clamp(9px, 2.2vw, 11px);
        font-weight: 300;
        letter-spacing: 1.5px;
        color: rgba(255,255,255,0.28);
        line-height: 1.9;
        animation: fp-fade-in 0.8s ease both 0.4s;
      }

      .fp-success-sep {
        width: 40px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent);
        margin: clamp(18px, 4vw, 26px) auto;
        animation: fp-fade-in 0.8s ease both 0.5s;
      }

      /* === DIVIDER === */
      .fp-divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: clamp(20px, 4vw, 30px) 0;
        animation: fp-fade-in 0.8s ease both 0.8s;
      }
      .fp-divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,0,0,0.22));
      }
      .fp-divider-line:last-child { background: linear-gradient(90deg, rgba(139,0,0,0.22), transparent); }
      .fp-divider-text {
        font-size: 8px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.12);
        text-transform: uppercase;
      }

      /* === BACK LINK === */
      .fp-back {
        text-align: center;
        animation: fp-fade-in 0.8s ease both 0.9s;
      }
      .fp-back p {
        font-size: clamp(8px, 2vw, 10px);
        letter-spacing: 2.5px;
        color: rgba(255,255,255,0.22);
        text-transform: uppercase;
        font-weight: 300;
      }
      .fp-back a {
        color: rgba(212,175,55,0.6);
        text-decoration: none;
        font-weight: 400;
        margin-left: 6px;
        transition: color 0.3s;
        display: inline-block;
      }
      .fp-back a:hover { color: rgba(212,175,55,0.95); }

      /* === PARTICLES === */
      .fp-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        animation: fp-float linear infinite;
        z-index: 2;
        will-change: transform, opacity;
      }
      @keyframes fp-float {
        0%   { transform: translateY(105vh) translateX(0px); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.6; }
        100% { transform: translateY(-10vh) translateX(var(--drift)); opacity: 0; }
      }

      @media (max-width: 400px) {
        .fp-root { padding: 14px 10px; }
      }
    </style>

    <div class="fp-root">
      <canvas id="fp-canvas"></canvas>
      <div class="fp-glow-center"></div>

      <div class="fp-card">
        <div class="fp-card-inner">
          <div class="fp-corner fp-corner--tl"></div>
          <div class="fp-corner fp-corner--tr"></div>
          <div class="fp-corner fp-corner--bl"></div>
          <div class="fp-corner fp-corner--br"></div>

          <div class="fp-header">
            <div class="fp-ornament">
              <div class="fp-ornament-line"></div>
              <div class="fp-ornament-diamond"></div>
              <div class="fp-ornament-line"></div>
            </div>
            <h1 class="fp-title">Bloodwave</h1>
            <p class="fp-subtitle">Restore&nbsp;&nbsp;Your&nbsp;&nbsp;Access</p>
          </div>

          <div class="fp-form" id="fpFormWrap">

            <p class="fp-desc">
              Enter your email address and we will send<br>
              you a link to reset your password.
            </p>

            <form id="fpForm" novalidate>
              <div class="fp-field">
                <label class="fp-label" for="fpEmail">Email Address</label>
                <div class="fp-input-wrap">
                  <input type="email" id="fpEmail" class="fp-input" placeholder="your@email.com" required autocomplete="email" />
                  <div class="fp-input-line"></div>
                </div>
                <span class="fp-error" id="fpEmailError"></span>
              </div>

              <button type="submit" class="fp-btn" id="fpBtn">
                <div class="fp-btn-shimmer"></div>
                <span class="fp-btn-text">Send Reset Link</span>
              </button>
            </form>

            <!-- Success state (hidden until submit) -->
            <div class="fp-success-panel" id="fpSuccess">
              <div class="fp-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <p class="fp-success-title">Check Your Inbox</p>
              <p class="fp-success-text">
                If an account exists for that address,<br>
                a reset link is on its way.
              </p>
              <div class="fp-success-sep"></div>
            </div>

            <div class="fp-divider">
              <div class="fp-divider-line"></div>
              <span class="fp-divider-text">or</span>
              <div class="fp-divider-line"></div>
            </div>

            <div class="fp-back">
              <p>Remembered it? <a href="/login" data-link>Sign In</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  initFpCanvas();
  spawnFpParticles();

  const form       = document.getElementById('fpForm');
  const btn        = document.getElementById('fpBtn');
  const emailInput = document.getElementById('fpEmail');
  const emailError = document.getElementById('fpEmailError');
  const successPanel = document.getElementById('fpSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    emailError.textContent = '';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required';
      return;
    }
    if (!emailRe.test(emailInput.value.trim())) {
      emailError.textContent = 'Invalid email address';
      return;
    }

    btn.classList.add('success');
    btn.querySelector('.fp-btn-text').textContent = '✦  Sent  ✦';

    setTimeout(() => {
      console.log('Password reset requested for:', emailInput.value.trim());
      form.style.cssText = 'opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity 0.35s ease, transform 0.35s ease;';
      setTimeout(() => {
        form.style.display = 'none';
        successPanel.classList.add('visible');
      }, 370);
    }, 650);
  });
}

/* ============================================================
   CANVAS – star field concentrated around the card
   ============================================================ */
function initFpCanvas() {
  const canvas = document.getElementById('fp-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cardCX, cardCY, cardW, cardH;
  let stars = [];
  let animId;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const card = document.querySelector('.fp-card-inner');
    if (card) {
      const r = card.getBoundingClientRect();
      cardCX = r.left + r.width  / 2;
      cardCY = r.top  + r.height / 2;
      cardW  = r.width;
      cardH  = r.height;
    } else {
      cardCX = W / 2;
      cardCY = H / 2;
      cardW  = 420;
      cardH  = 480;
    }
  }

  const STAR_COUNT = 220;

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(i < STAR_COUNT * 0.45, true));
    }
  }

  requestAnimationFrame(() => {
    measure();
    initStars();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        measure();
        initStars();
      }, 150);
    });

    let streakTimer = 0;

    function draw() {
      if (!document.getElementById('fp-canvas')) { cancelAnimationFrame(animId); return; }
      ctx.clearRect(0, 0, W, H);

      streakTimer++;
      if (streakTimer > 180 + Math.random() * 180) {
        drawFpStreak(ctx, cardCX, cardCY, cardW, cardH, W, H);
        streakTimer = 0;
      }

      stars.forEach((s, i) => {
        s.flicker += s.flickerSpeed;
        s.life++;

        const fade  = Math.min(s.life / 40, 1) * Math.max(1 - (s.life - s.maxLife * 0.8) / (s.maxLife * 0.2), 0);
        const alpha = s.opacity * (0.65 + 0.35 * Math.sin(s.flicker)) * Math.max(fade, 0.01);
        const extra = s.nearCard ? 1.25 : 1;

        ctx.globalAlpha = Math.min(alpha * extra, 1);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.isRed ? '#CC1A1A' : s.isGold ? '#D4AF37' : '#FFE8D8';
        ctx.fill();
        ctx.globalAlpha = 1;

        s.x += s.vx;
        s.y += s.vy;

        if (s.life > s.maxLife || s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
          stars[i] = makeStar(Math.random() < 0.45, false);
        }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
  });

  function makeStar(nearCard, firstTime) {
    const isRed  = Math.random() < 0.07;
    const isGold = !isRed && Math.random() < 0.04;
    const r      = Math.random() * 1.4 + 0.2;

    let x, y;
    if (nearCard) {
      const haloR = (Math.max(cardW, cardH) * 0.5) + Math.random() * Math.min(W, H) * 0.35;
      const angle = Math.random() * Math.PI * 2;
      x = cardCX + Math.cos(angle) * haloR;
      y = cardCY + Math.sin(angle) * haloR;
    } else {
      x = Math.random() * W;
      y = firstTime ? Math.random() * H : H + 5;
    }

    const baseAngle = Math.atan2(cardCY - y, cardCX - x);
    const scatter   = (Math.random() - 0.5) * 0.9;
    const speed     = Math.random() * 0.22 + 0.05;

    return {
      x, y, r,
      vx: Math.cos(baseAngle + scatter) * speed * 0.4,
      vy: Math.sin(baseAngle + scatter) * speed * (Math.random() < 0.6 ? 0.5 : -0.2),
      opacity: Math.random() * 0.65 + 0.18,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.025 + 0.004,
      isRed, isGold, nearCard,
      life: 0,
      maxLife: 400 + Math.random() * 600,
    };
  }
}

function drawFpStreak(ctx, cx, cy, cw, ch, W, H) {
  let x, y;
  if (Math.random() < 0.5) {
    x = Math.random() * W;
    y = Math.random() * cy * 0.6;
  } else {
    x = Math.random() > 0.5 ? -10 : W + 10;
    y = Math.random() * H;
  }

  const targetX = cx + (Math.random() - 0.5) * cw * 1.5;
  const targetY = cy + (Math.random() - 0.5) * ch * 1.5;
  const len     = Math.hypot(targetX - x, targetY - y) * (0.4 + Math.random() * 0.4);
  const angle   = Math.atan2(targetY - y, targetX - x);

  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.45, 'rgba(220,60,40,0.55)');
  grd.addColorStop(0.55, 'rgba(255,200,180,0.7)');
  grd.addColorStop(1, 'transparent');

  ctx.save();
  ctx.lineWidth = Math.random() * 1.2 + 0.4;
  ctx.strokeStyle = grd;
  ctx.shadowColor = 'rgba(200,50,30,0.4)';
  ctx.shadowBlur  = 6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.restore();
}

function spawnFpParticles() {
  const root = document.querySelector('.fp-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'fp-particle';
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
