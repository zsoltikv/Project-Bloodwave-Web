export default function Register(container) {
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

      .rx-root {
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
      #rx-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
      }

      /* === GLOW behind card === */
      .rx-glow-center {
        position: absolute;
        width: min(700px, 140vw);
        height: min(700px, 140vw);
        background: radial-gradient(circle, rgba(139,0,0,0.18) 0%, rgba(80,0,0,0.07) 40%, transparent 70%);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        animation: rx-breathe 5s ease-in-out infinite;
        pointer-events: none;
        border-radius: 50%;
      }

      @keyframes rx-breathe {
        0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
        50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
      }

      /* === CARD === */
      .rx-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 480px;
        animation: rx-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes rx-rise {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }

      .rx-card-inner {
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
      .rx-card-inner::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.08) 0%, transparent 60%);
        pointer-events: none;
        animation: rx-inner-glow 4s ease-in-out infinite;
      }
      @keyframes rx-inner-glow {
        0%,100% { opacity: 0.5; }
        50%      { opacity: 1; }
      }

      /* Gold corner ornaments */
      .rx-corner {
        position: absolute;
        width: 24px;
        height: 24px;
        z-index: 5;
        animation: rx-corner-pulse 4s ease-in-out infinite;
        pointer-events: none;
      }
      .rx-corner--tl { top: -1px;  left: -1px;  border-top: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .rx-corner--tr { top: -1px;  right: -1px; border-top: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      .rx-corner--bl { bottom: -1px; left: -1px;  border-bottom: 1.5px solid var(--gold-light); border-left: 1.5px solid var(--gold-light); }
      .rx-corner--br { bottom: -1px; right: -1px; border-bottom: 1.5px solid var(--gold-light); border-right: 1.5px solid var(--gold-light); }
      @keyframes rx-corner-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.9} }

      /* === HEADER === */
      .rx-header {
        padding: clamp(36px, 6vw, 56px) clamp(24px, 8vw, 52px) clamp(28px, 5vw, 44px);
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(139,0,0,0.18);
        overflow: hidden;
      }

      .rx-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 55%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent);
      }

      .rx-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: clamp(14px, 3vw, 22px);
        animation: rx-fade-in 1s ease both 0.3s;
      }

      .rx-ornament-line {
        height: 1px;
        width: clamp(30px, 8vw, 52px);
        background: linear-gradient(90deg, transparent, var(--gold));
        animation: rx-expand 1s ease both 0.5s;
      }
      .rx-ornament-line:last-child { background: linear-gradient(90deg, var(--gold), transparent); }
      @keyframes rx-expand { from{width:0;opacity:0} to{opacity:1} }

      .rx-ornament-diamond {
        width: 7px;
        height: 7px;
        background: var(--gold-light);
        transform: rotate(45deg);
        box-shadow: 0 0 8px rgba(212,175,55,0.5);
        animation: rx-fade-in 1s ease both 0.6s;
        flex-shrink: 0;
      }

      @keyframes rx-fade-in { from{opacity:0} to{opacity:1} }

      .rx-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(32px, 7vw, 48px);
        font-weight: 300;
        letter-spacing: clamp(4px, 1.2vw, 8px);
        color: #fff;
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 10px;
        animation: rx-title-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.15s;
        text-shadow:
          0 0 30px rgba(180,0,0,0.6),
          0 0 70px rgba(139,0,0,0.25),
          0 2px 4px rgba(0,0,0,0.6);
      }

      @keyframes rx-title-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .rx-subtitle {
        font-size: clamp(8px, 1.8vw, 10px);
        font-weight: 300;
        letter-spacing: clamp(3px, 1.2vw, 6px);
        color: rgba(212,175,55,0.55);
        text-transform: uppercase;
        margin-top: clamp(8px, 2vw, 14px);
        animation: rx-fade-in 1s ease both 0.75s;
      }

      /* === FORM === */
      .rx-form {
        padding: clamp(28px, 6vw, 48px) clamp(20px, 8vw, 52px) clamp(32px, 6vw, 52px);
      }

      .rx-field {
        margin-bottom: clamp(18px, 3.5vw, 26px);
        animation: rx-field-in 0.8s cubic-bezier(0.22,1,0.36,1) both;
      }
      .rx-field:nth-child(1) { animation-delay: 0.50s; }
      .rx-field:nth-child(2) { animation-delay: 0.62s; }
      .rx-field:nth-child(3) { animation-delay: 0.74s; }
      .rx-field:nth-child(4) { animation-delay: 0.86s; }

      @keyframes rx-field-in {
        from { opacity: 0; transform: translateX(-18px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .rx-label {
        display: block;
        font-size: clamp(8px, 2vw, 9.5px);
        font-weight: 500;
        letter-spacing: clamp(2px, 1vw, 4px);
        color: rgba(212,175,55,0.7);
        text-transform: uppercase;
        margin-bottom: clamp(8px, 2vw, 13px);
      }

      .rx-input-wrap { position: relative; }

      .rx-input {
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

      .rx-input::placeholder {
        color: rgba(255,255,255,0.15);
        letter-spacing: 2px;
        font-size: clamp(10px, 2.5vw, 12px);
      }

      .rx-input:focus {
        border-color: rgba(192,57,43,0.55);
        box-shadow:
          0 0 0 1px rgba(139,0,0,0.12),
          0 4px 28px rgba(139,0,0,0.12),
          inset 0 1px 0 rgba(255,255,255,0.02);
        background: rgba(12,2,2,0.75);
      }

      .rx-input-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: auto;
        transform: scaleX(0);
        transform-origin: center;
        height: 1.5px;
        background-image: linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson));
        background-size: 200% 100%;
        transition: transform 0.5s cubic-bezier(0.22,1,0.36,1),
                    box-shadow 0.55s ease;
        pointer-events: none;
      }
      .rx-input:focus ~ .rx-input-line { transform: scaleX(1); }

      /* password strength shimmer */
      #rxPwLine {
        height: 2px;
        background-image: var(--pw-gradient,
          linear-gradient(90deg, var(--crimson), var(--gold-light), var(--crimson)));
        animation: rx-pw-shimmer 2.2s linear infinite paused;
      }
      #rxPwLine.rx-pw-active {
        animation-play-state: running;
      }
      @keyframes rx-pw-shimmer {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }
      #rxPwLine.rx-pw-pulse {
        transform: scaleX(1) scaleY(2.5);
      }

      .rx-pw-toggle {
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
      .rx-pw-toggle:hover { color: rgba(192,57,43,0.8); }
      .rx-pw-toggle svg { width: 18px; height: 18px; display: block; }

      /* === ERROR === */
      .rx-error {
        font-size: clamp(8px, 2vw, 9.5px);
        letter-spacing: 1.5px;
        color: rgba(192,57,43,0.75);
        text-transform: uppercase;
        margin-top: 8px;
        min-height: 14px;
        font-weight: 300;
        display: block;
        padding-left: 2px;
        transition: opacity 0.3s;
      }

      /* === BUTTON === */
      .rx-btn {
        width: 100%;
        margin-top: clamp(6px, 2vw, 12px);
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
        animation: rx-fade-in 0.8s ease both 1.0s;
        -webkit-tap-highlight-color: transparent;
      }

      .rx-btn::before {
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
      .rx-btn:hover::before { transform: translateX(110%) skewX(-12deg); }

      .rx-btn:hover {
        border-color: rgba(192,57,43,0.85);
        color: #fff;
        box-shadow:
          0 0 24px rgba(139,0,0,0.22),
          0 0 60px rgba(139,0,0,0.08),
          inset 0 0 20px rgba(139,0,0,0.05);
      }
      .rx-btn:active { transform: scale(0.99); }

      .rx-btn-text { position: relative; z-index: 2; }

      .rx-btn-shimmer {
        position: absolute;
        top: 0; left: -80%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
        animation: rx-shimmer 5s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }
      @keyframes rx-shimmer { 0%,35%{left:-80%} 55%,100%{left:170%} }

      /* === SUCCESS === */
      .rx-btn.success {
        border-color: rgba(212,175,55,0.65);
        color: var(--gold-light);
        box-shadow: 0 0 30px rgba(212,175,55,0.12);
      }

      /* === DIVIDER === */
      .rx-divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: clamp(20px, 4vw, 30px) 0;
        animation: rx-fade-in 0.8s ease both 1.1s;
      }
      .rx-divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,0,0,0.22));
      }
      .rx-divider-line:last-child { background: linear-gradient(90deg, rgba(139,0,0,0.22), transparent); }
      .rx-divider-text {
        font-size: 8px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.12);
        text-transform: uppercase;
      }

      /* === LOGIN LINK === */
      .rx-login {
        text-align: center;
        animation: rx-fade-in 0.8s ease both 1.2s;
      }
      .rx-login p {
        font-size: clamp(8px, 2vw, 10px);
        letter-spacing: 2.5px;
        color: rgba(255,255,255,0.22);
        text-transform: uppercase;
        font-weight: 300;
      }
      .rx-login a {
        color: rgba(212,175,55,0.6);
        text-decoration: none;
        font-weight: 400;
        margin-left: 6px;
        transition: color 0.3s;
        display: inline-block;
      }
      .rx-login a:hover { color: rgba(212,175,55,0.95); }

      /* === PARTICLES === */
      .rx-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        animation: rx-float linear infinite;
        z-index: 2;
        will-change: transform, opacity;
      }
      @keyframes rx-float {
        0%   { transform: translateY(105vh) translateX(0px); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.6; }
        100% { transform: translateY(-10vh) translateX(var(--drift)); opacity: 0; }
      }

      @media (max-width: 400px) {
        .rx-root { padding: 14px 10px; }
      }
    </style>

    <div class="rx-root">
      <canvas id="rx-canvas"></canvas>
      <div class="rx-glow-center"></div>

      <div class="rx-card">
        <div class="rx-card-inner">
          <div class="rx-corner rx-corner--tl"></div>
          <div class="rx-corner rx-corner--tr"></div>
          <div class="rx-corner rx-corner--bl"></div>
          <div class="rx-corner rx-corner--br"></div>

          <div class="rx-header">
            <div class="rx-ornament">
              <div class="rx-ornament-line"></div>
              <div class="rx-ornament-diamond"></div>
              <div class="rx-ornament-line"></div>
            </div>
            <h1 class="rx-title">Bloodwave</h1>
            <p class="rx-subtitle">Join&nbsp;&nbsp;The&nbsp;&nbsp;Covenant</p>
          </div>

          <form class="rx-form" id="rxForm" novalidate>

            <div class="rx-field">
              <label class="rx-label" for="rxName">Username</label>
              <div class="rx-input-wrap">
                <input type="text" id="rxName" class="rx-input" placeholder="your_username" required autocomplete="username" />
                <div class="rx-input-line"></div>
              </div>
              <span class="rx-error" id="rxNameError"></span>
            </div>

            <div class="rx-field">
              <label class="rx-label" for="rxEmail">Email Address</label>
              <div class="rx-input-wrap">
                <input type="email" id="rxEmail" class="rx-input" placeholder="your@email.com" required autocomplete="email" />
                <div class="rx-input-line"></div>
              </div>
              <span class="rx-error" id="rxEmailError"></span>
            </div>

            <div class="rx-field">
              <label class="rx-label" for="rxPassword">Password</label>
              <div class="rx-input-wrap">
                <input type="password" id="rxPassword" class="rx-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="rx-pw-toggle" id="rxPwToggle" aria-label="Toggle password visibility">
                  <svg id="rxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="rx-input-line" id="rxPwLine"></div>
              </div>
              <span class="rx-error" id="rxPasswordError"></span>
            </div>

            <div class="rx-field">
              <label class="rx-label" for="rxConfirm">Confirm Password</label>
              <div class="rx-input-wrap">
                <input type="password" id="rxConfirm" class="rx-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="rx-pw-toggle" id="rxConfirmToggle" aria-label="Toggle confirm password visibility">
                  <svg id="rxConfirmEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="rx-input-line"></div>
              </div>
              <span class="rx-error" id="rxConfirmError"></span>
            </div>

            <button type="submit" class="rx-btn" id="rxBtn">
              <div class="rx-btn-shimmer"></div>
              <span class="rx-btn-text">Create Account</span>
            </button>

            <div class="rx-divider">
              <div class="rx-divider-line"></div>
              <span class="rx-divider-text">or</span>
              <div class="rx-divider-line"></div>
            </div>

            <div class="rx-login">
              <p>Already a member? <a href="/login" data-link>Sign In</a></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  initRegisterCanvas();
  spawnRegisterParticles();

  const form          = document.getElementById('rxForm');
  const btn           = document.getElementById('rxBtn');
  const nameInput     = document.getElementById('rxName');
  const emailInput    = document.getElementById('rxEmail');
  const pwInput       = document.getElementById('rxPassword');
  const confirmInput  = document.getElementById('rxConfirm');

  const nameError    = document.getElementById('rxNameError');
  const emailError   = document.getElementById('rxEmailError');
  const pwError      = document.getElementById('rxPasswordError');
  const confirmError = document.getElementById('rxConfirmError');

  // --- Validation helpers ---
  function clearErrors() {
    [nameError, emailError, pwError, confirmError].forEach(el => el.textContent = '');
  }

  function validate() {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Username is required';
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required';
      valid = false;
    } else if (!emailRe.test(emailInput.value.trim())) {
      emailError.textContent = 'Invalid email address';
      valid = false;
    }

    if (!pwInput.value) {
      pwError.textContent = 'Password is required';
      valid = false;
    } else if (pwInput.value.length < 8) {
      pwError.textContent = 'Minimum 8 characters';
      valid = false;
    }

    if (!confirmInput.value) {
      confirmError.textContent = 'Please confirm your password';
      valid = false;
    } else if (confirmInput.value !== pwInput.value) {
      confirmError.textContent = 'Passwords do not match';
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) return;

    btn.disabled = true;
    btn.classList.add('success');
    btn.querySelector('.rx-btn-text').textContent = '✦  Welcome  ✦';

    setTimeout(() => {
      console.log('Register:', {
        name:  nameInput.value.trim(),
        email: emailInput.value.trim(),
      });
      alert('Registration successful!');
      btn.disabled = false;
    }, 700);
  });

  // --- Password visibility toggles ---
  const eyeOpen   = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;

  // --- Password strength ---
  const pwLine = document.getElementById('rxPwLine');

  const strengthGradients = [
    // 0 – empty: back to default crimson-gold
    `linear-gradient(90deg,
      #2a0000 0%, #8B0000 25%, #C0392B 50%, #8B0000 75%, #2a0000 100%)`,
    // 1 – very weak: deep reds
    `linear-gradient(90deg,
      #1a0000 0%, #6B0000 20%, #C0392B 45%, #920000 70%, #1a0000 100%)`,
    // 2 – weak: red → orange
    `linear-gradient(90deg,
      #3d0000 0%, #C0392B 25%, #E67E22 50%, #C0392B 75%, #3d0000 100%)`,
    // 3 – fair: orange → amber
    `linear-gradient(90deg,
      #4a2000 0%, #E67E22 25%, #D4AC0D 50%, #E67E22 75%, #4a2000 100%)`,
    // 4 – strong: amber → lime
    `linear-gradient(90deg,
      #1a3a10 0%, #52BE80 25%, #D4AC0D 50%, #52BE80 75%, #1a3a10 100%)`,
    // 5 – very strong: vivid green
    `linear-gradient(90deg,
      #021a08 0%, #1E8449 20%, #52BE80 45%, #27AE60 70%, #021a08 100%)`,
  ];

  const strengthGlows = [
    'none',
    '0 0 6px rgba(139,0,0,0.5),  0 0 16px rgba(139,0,0,0.2)',
    '0 0 8px rgba(192,57,43,0.65), 0 0 20px rgba(230,126,34,0.2)',
    '0 0 8px rgba(212,172,13,0.7), 0 0 20px rgba(212,172,13,0.25)',
    '0 0 10px rgba(82,190,128,0.7), 0 0 24px rgba(82,190,128,0.3)',
    '0 0 12px rgba(39,174,96,0.85), 0 0 30px rgba(39,174,96,0.45)',
  ];

  function getStrength(pw) {
    let score = 0;
    if (pw.length >= 6)           score++;
    if (pw.length >= 10)          score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  let lastScore = -1;
  pwInput.addEventListener('input', () => {
    const score = pwInput.value.length ? getStrength(pwInput.value) : 0;

    pwLine.style.setProperty('--pw-gradient', strengthGradients[score]);
    pwLine.style.boxShadow = strengthGlows[score];

    if (score > 0) {
      pwLine.classList.add('rx-pw-active');
    } else {
      pwLine.classList.remove('rx-pw-active');
    }

    // pulse flash on score change
    if (score !== lastScore) {
      lastScore = score;
      pwLine.classList.add('rx-pw-pulse');
      setTimeout(() => pwLine.classList.remove('rx-pw-pulse'), 260);
    }
  });

  document.getElementById('rxPwToggle').addEventListener('click', () => {
    const hidden = pwInput.type === 'password';
    pwInput.type = hidden ? 'text' : 'password';
    document.getElementById('rxEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });

  document.getElementById('rxConfirmToggle').addEventListener('click', () => {
    const hidden = confirmInput.type === 'password';
    confirmInput.type = hidden ? 'text' : 'password';
    document.getElementById('rxConfirmEyeIcon').innerHTML = hidden ? eyeClosed : eyeOpen;
  });
}

/* ============================================================
   CANVAS – star field concentrated around the card
   ============================================================ */
function initRegisterCanvas() {
  const canvas = document.getElementById('rx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cardCX, cardCY, cardW, cardH;
  let stars = [];
  let animId;

  function measure() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const card = document.querySelector('.rx-card-inner');
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
      cardH  = 620;
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(i < STAR_COUNT * 0.45, true));
    }
  }

  const STAR_COUNT = 220;

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
      if (!document.getElementById('rx-canvas')) { cancelAnimationFrame(animId); return; }
      ctx.clearRect(0, 0, W, H);

      streakTimer++;
      if (streakTimer > 180 + Math.random() * 180) {
        drawRegisterStreak(ctx, cardCX, cardCY, cardW, cardH, W, H);
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

function drawRegisterStreak(ctx, cx, cy, cw, ch, W, H) {
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

function spawnRegisterParticles() {
  const root = document.querySelector('.rx-root');
  if (!root) return;

  for (let i = 0; i < 18; i++) {
    const p        = document.createElement('div');
    p.className    = 'rx-particle';
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


