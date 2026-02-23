export default function Login(container) {
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

      .lx-root {
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
      #lx-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
      }

      /* === GLOW behind card === */
      .lx-glow-center {
        position: absolute;
        width: min(700px, 140vw);
        height: min(700px, 140vw);
        background: radial-gradient(circle, rgba(139,0,0,0.18) 0%, rgba(80,0,0,0.07) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        animation: lx-breathe 5s ease-in-out infinite;
        pointer-events: none;
        border-radius: 50%;
      }

      @keyframes lx-breathe {
        0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
        50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
      }

      /* === CARD === */
      .lx-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 480px;
        animation: lx-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes lx-rise {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }

      .lx-card-inner {
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

      /* Inner glow pulse */
      .lx-card-inner::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.08) 0%, transparent 60%);
        pointer-events: none;
        animation: lx-inner-glow 4s ease-in-out infinite;
      }
      @keyframes lx-inner-glow {
        0%,100% { opacity: 0.5; }
        50%      { opacity: 1; }
      }

      /* Gold corner ornaments */
      .lx-corner {
        position: absolute;
        width: 24px;
        height: 24px;
        z-index: 5;
        animation: lx-corner-pulse 4s ease-in-out infinite;
        pointer-events: none;
      }
      .lx-corner--tl { top: -1px;  left: -1px;  border-top: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .lx-corner--tr { top: -1px;  right: -1px; border-top: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      .lx-corner--bl { bottom: -1px; left: -1px;  border-bottom: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .lx-corner--br { bottom: -1px; right: -1px; border-bottom: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      @keyframes lx-corner-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.9} }

      /* === HEADER === */
      .lx-header {
        padding: clamp(36px, 6vw, 56px) clamp(24px, 8vw, 52px) clamp(28px, 5vw, 44px);
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(139,0,0,0.18);
        overflow: hidden;
      }

      .lx-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 55%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent);
      }

      .lx-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: clamp(14px, 3vw, 22px);
        animation: lx-fade-in 1s ease both 0.3s;
      }

      .lx-ornament-line {
        height: 1px;
        width: clamp(30px, 8vw, 52px);
        background: linear-gradient(90deg, transparent, var(--gold));
        animation: lx-expand 1s ease both 0.5s;
      }
      .lx-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      @keyframes lx-expand { from{width:0;opacity:0} to{opacity:1} }

      .lx-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.5);
        animation: lx-fade-in 1s ease both 0.6s;
        flex-shrink: 0;
      }

      @keyframes lx-fade-in { from{opacity:0} to{opacity:1} }

      .lx-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(32px, 7vw, 48px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 10px;
        animation: lx-title-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.15s;
        text-shadow:
          0 0 30px rgba(180,0,0,0.6),
          0 0 70px rgba(139,0,0,0.25),
          0 2px 4px rgba(0,0,0,0.6);
      }

      @keyframes lx-title-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .lx-subtitle {
        font-size: clamp(8px, 1.8vw, 10px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.55);
        text-transform: uppercase;
        margin-top: clamp(8px, 2vw, 14px);
        animation: lx-fade-in 1s ease both 0.75s;
      }

      /* === FORM === */
      .lx-form {
        padding: clamp(28px, 6vw, 48px) clamp(20px, 8vw, 52px) clamp(32px, 6vw, 52px);
      }

      .lx-field {
        margin-bottom: clamp(20px, 4vw, 30px);
        animation: lx-field-in 0.8s cubic-bezier(0.22,1,0.36,1) both;
      }
      .lx-field:nth-child(1) { animation-delay: 0.5s; }
      .lx-field:nth-child(2) { animation-delay: 0.65s; }
      .lx-field:nth-child(3) { animation-delay: 0.80s; }

      @keyframes lx-field-in {
        from { opacity: 0; transform: translateX(-18px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .lx-label {
        display: block;
        font-size: clamp(8px, 2vw, 9.5px);
        font-weight: 500;
        letter-spacing: clamp(2px, 1vw, 4px);
        color: rgba(212,175,55,0.7);
        text-transform: uppercase;
        margin-bottom: clamp(8px, 2vw, 13px);
      }

      .lx-input-wrap { position: relative; }

      .lx-input {
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

      .lx-input::placeholder {
        color: rgba(255,255,255,0.15);
        letter-spacing: 2px;
        font-size: clamp(10px, 2.5vw, 12px);
      }

      .lx-input:focus {
        border-color: rgba(192,57,43,0.55);
        box-shadow:
          0 0 0 1px rgba(139,0,0,0.12),
          0 4px 28px rgba(139,0,0,0.12),
          inset 0 1px 0 rgba(255,255,255,0.02);
        background: rgba(12,2,2,0.75);
      }

      .lx-input-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 1.5px;
        width: 0;
        background: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
        pointer-events: none;
      }
      .lx-input:focus ~ .lx-input-line { width: 100%; }

      .lx-pw-toggle {
        position: absolute;
        right: clamp(10px, 3vw, 16px);
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.25);
        transition: color 0.3s;
        outline: none;
        z-index: 2;
      }
      .lx-pw-toggle:hover { color: rgba(192,57,43,0.8); }
      .lx-pw-toggle svg { width: 18px; height: 18px; display: block; }

      /* === EXTRAS ROW === */
      .lx-extras {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: clamp(24px, 5vw, 38px);
        flex-wrap: wrap;
        gap: 10px;
        animation: lx-fade-in 0.8s ease both 0.8s;
      }

      .lx-remember {
        display: flex;
        align-items: center;
        gap: 9px;
        cursor: pointer;
      }

      .lx-checkbox {
        width: 15px;
        height: 15px;
        border: 1px solid rgba(139,0,0,0.45);
        background: transparent;
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        position: relative;
        transition: border-color 0.3s, background 0.3s;
        flex-shrink: 0;
      }
      .lx-checkbox:checked {
        background: rgba(139,0,0,0.25);
        border-color: var(--crimson-bright);
      }
      .lx-checkbox:checked::after {
        content: '';
        position: absolute;
        inset: 3px;
        background: var(--gold-light);
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      }

      .lx-remember-label {
        font-size: clamp(8px, 2vw, 10px);
        letter-spacing: 2.5px;
        color: rgba(255,255,255,0.3);
        text-transform: uppercase;
        font-weight: 300;
        user-select: none;
      }

      .lx-forgot {
        font-size: clamp(8px, 2vw, 10px);
        letter-spacing: 2.5px;
        color: rgba(212,175,55,0.5);
        text-transform: uppercase;
        text-decoration: none;
        font-weight: 300;
        transition: color 0.3s, letter-spacing 0.3s;
        white-space: nowrap;
      }
      .lx-forgot:hover { color: rgba(212,175,55,0.85); letter-spacing: 3px; }

      /* === BUTTON === */
      .lx-btn {
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
        animation: lx-fade-in 0.8s ease both 0.95s;
        -webkit-tap-highlight-color: transparent;
      }

      .lx-btn::before {
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
      .lx-btn:hover::before { transform: translateX(110%) skewX(-12deg); }

      .lx-btn:hover {
        border-color: rgba(192,57,43,0.85);
        color: #fff;
        box-shadow:
          0 0 24px rgba(139,0,0,0.22),
          0 0 60px rgba(139,0,0,0.08),
          inset 0 0 20px rgba(139,0,0,0.05);
      }
      .lx-btn:active { transform: scale(0.99); }

      .lx-btn-text { position: relative; z-index: 2; }

      .lx-btn-shimmer {
        position: absolute;
        top: 0; left: -80%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
        animation: lx-shimmer 5s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }
      @keyframes lx-shimmer { 0%,35%{left:-80%} 55%,100%{left:170%} }

      /* === DIVIDER === */
      .lx-divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: clamp(20px, 4vw, 30px) 0;
        animation: lx-fade-in 0.8s ease both 1.05s;
      }
      .lx-divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,0,0,0.22));
      }
      .lx-divider-line:last-child { background: linear-gradient(90deg, rgba(139,0,0,0.22), transparent); }
      .lx-divider-text {
        font-size: 8px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.12);
        text-transform: uppercase;
      }

      /* === REGISTER === */
      .lx-register {
        text-align: center;
        animation: lx-fade-in 0.8s ease both 1.15s;
      }
      .lx-register p {
        font-size: clamp(8px, 2vw, 10px);
        letter-spacing: 2.5px;
        color: rgba(255,255,255,0.22);
        text-transform: uppercase;
        font-weight: 300;
      }
      .lx-register a {
        color: rgba(212,175,55,0.6);
        text-decoration: none;
        font-weight: 400;
        margin-left: 6px;
        transition: color 0.3s;
        display: inline-block;
      }
      .lx-register a:hover { color: rgba(212,175,55,0.95); }

      /* === SUCCESS === */
      .lx-btn.success {
        border-color: rgba(212,175,55,0.65);
        color: var(--gold-light);
        box-shadow: 0 0 30px rgba(212,175,55,0.12);
      }

      /* === PARTICLES === */
      .lx-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        animation: lx-float linear infinite;
        z-index: 2;
        will-change: transform, opacity;
      }
      @keyframes lx-float {
        0%   { transform: translateY(105vh) translateX(0px); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.6; }
        100% { transform: translateY(-10vh) translateX(var(--drift)); opacity: 0; }
      }

      @media (max-width: 400px) {
        .lx-root { padding: 14px 10px; }
        .lx-extras { flex-direction: column; align-items: flex-start; }
      }
    </style>

    <div class="lx-root">
      <canvas id="lx-canvas"></canvas>
      <div class="lx-glow-center"></div>

      <div class="lx-card">
        <div class="lx-card-inner">
          <div class="lx-corner lx-corner--tl"></div>
          <div class="lx-corner lx-corner--tr"></div>
          <div class="lx-corner lx-corner--bl"></div>
          <div class="lx-corner lx-corner--br"></div>

          <div class="lx-header">
            <div class="lx-ornament">
              <div class="lx-ornament-line"></div>
              <div class="lx-ornament-diamond"></div>
              <div class="lx-ornament-line"></div>
            </div>
            <h1 class="lx-title">Bloodwave</h1>
            <p class="lx-subtitle">Members&nbsp;&nbsp;Only&nbsp;&nbsp;Access</p>
          </div>

          <form class="lx-form" id="lxForm">

            <div class="lx-field">
              <label class="lx-label">Username</label>
              <div class="lx-input-wrap">
                <input type="text" id="lxUsername" class="lx-input" placeholder="your_username" required autocomplete="username" />
                <div class="lx-input-line"></div>
              </div>
            </div>

            <div class="lx-field">
              <label class="lx-label">Password</label>
              <div class="lx-input-wrap">
                <input type="password" id="lxPassword" class="lx-input" placeholder="············" required autocomplete="current-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="lx-pw-toggle" id="lxPwToggle" aria-label="Toggle password visibility">
                  <svg id="lxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="lx-input-line"></div>
              </div>
            </div>

            <div class="lx-extras">
              <label class="lx-remember">
                <input type="checkbox" class="lx-checkbox" />
                <span class="lx-remember-label">Remember Me</span>
              </label>
              <a href="/forgot-password" data-link class="lx-forgot">Forgot Password</a>
            </div>

            <button type="submit" class="lx-btn" id="lxBtn">
              <div class="lx-btn-shimmer"></div>
              <span class="lx-btn-text">Enter</span>
            </button>

            <div class="lx-divider">
              <div class="lx-divider-line"></div>
              <span class="lx-divider-text">or</span>
              <div class="lx-divider-line"></div>
            </div>

            <div class="lx-register">
              <p>New member? <a href="/register" data-link>Join Now</a></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  initCanvas();
  spawnParticles();

  const form = document.getElementById('lxForm');
  const btn  = document.getElementById('lxBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username  = document.getElementById('lxUsername').value;
    const email    = document.getElementById('lxEmail').value;
    const password = document.getElementById('lxPassword').value;

    btn.classList.add('success');
    btn.querySelector('.lx-btn-text').textContent = '✦  Welcome Back  ✦';

    setTimeout(() => {
      console.log('Login:', { username, email, password });
      alert('Login successful!');
    }, 700);
  });

  // Password visibility toggle
  const pwToggle  = document.getElementById('lxPwToggle');
  const pwInput   = document.getElementById('lxPassword');
  const eyeIcon   = document.getElementById('lxEyeIcon');
  const eyeOpen   = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;
  pwToggle.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';
    eyeIcon.innerHTML = isHidden ? eyeClosed : eyeOpen;
  });
}

/* ============================================================
   CANVAS – star field that CONCENTRATES around the card
   ============================================================ */
function initCanvas() {
  const canvas = document.getElementById('lx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cardCX, cardCY, cardW, cardH;
  let stars = [];
  let animId;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const card = document.querySelector('.lx-card-inner');
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
      cardH  = 560;
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(i < STAR_COUNT * 0.45, true));
    }
  }

  const STAR_COUNT = 220;

  // Defer so the card has finished layout before we measure
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
      if (!document.getElementById('lx-canvas')) { cancelAnimationFrame(animId); return; }
      ctx.clearRect(0, 0, W, H);

      streakTimer++;
      if (streakTimer > 180 + Math.random() * 180) {
        drawStreak(ctx, cardCX, cardCY, cardW, cardH, W, H);
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

function drawStreak(ctx, cx, cy, cw, ch, W, H) {
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

function spawnParticles() {
  const root = document.querySelector('.lx-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'lx-particle';
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