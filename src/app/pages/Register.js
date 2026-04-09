// register page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/Register.css";
// imports dependencies used by this module
import { register } from "../services/auth.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { usernameIsProfane } from "../utils/profanity.js";
// imports dependencies used by this module
import { attachCapsLockHints } from "../utils/caps-lock.js";

// exports the main function for this module
export default function Register(container) {
  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="bw-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card">
        <div class="bw-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Bloodwave</h1>
            <p class="bw-subtitle">Join&nbsp;&nbsp;The&nbsp;&nbsp;Covenant</p>
          </div>

          <form class="bw-form" id="rxForm" novalidate>

            <div class="bw-field">
              <label class="bw-label" for="rxName">Username</label>
              <div class="bw-input-wrap">
                <input type="text" id="rxName" class="bw-input" placeholder="your_username" required autocomplete="username" />
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-error" id="rxNameError"></span>
            </div>

            <div class="bw-field">
              <label class="bw-label" for="rxEmail">Email Address</label>
              <div class="bw-input-wrap">
                <input type="email" id="rxEmail" class="bw-input" placeholder="your@email.com" required autocomplete="email" />
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-error" id="rxEmailError"></span>
            </div>

            <div class="bw-field">
              <label class="bw-label" for="rxPassword">Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="rxPassword" class="bw-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="rxPwToggle" aria-label="Toggle password visibility">
                  <svg id="rxEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line" id="pwStrengthLine"></div>
              </div>
              <span class="bw-caps-lock-hint" id="rxPasswordCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
              <span class="bw-error" id="rxPasswordError"></span>
            </div>

            <div class="bw-field bw-field--confirm">
              <label class="bw-label" for="rxConfirm">Confirm Password</label>
              <div class="bw-input-wrap">
                <input type="password" id="rxConfirm" class="bw-input" placeholder="············" required autocomplete="new-password" style="padding-right: clamp(40px, 9vw, 52px);" />
                <button type="button" class="bw-pw-toggle" id="rxConfirmToggle" aria-label="Toggle confirm password visibility">
                  <svg id="rxConfirmEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div class="bw-input-line"></div>
              </div>
              <span class="bw-caps-lock-hint" id="rxConfirmCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
              <span class="bw-error" id="rxConfirmError"></span>
            </div>

            <div class="bw-field bw-field--tos">
              <label class="bw-checkbox-wrapper">
                <input type="checkbox" id="rxTosAccept" class="bw-checkbox" required />
                <span class="bw-checkbox-label">
                  I accept the <a href="/tos" data-link class="bw-forgot">Terms of Service &amp; Cookie Policy</a>
                </span>
              </label>
              <span class="bw-error" id="rxTosError"></span>
            </div>

            <button type="submit" class="bw-btn" id="rxBtn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Create Account</span>
            </button>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Already a member? <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const form = document.getElementById("rxForm");
  // declares a constant used in this scope
  const btn = document.getElementById("rxBtn");
  // declares a constant used in this scope
  const nameInput = document.getElementById("rxName");
  // declares a constant used in this scope
  const emailInput = document.getElementById("rxEmail");
  // declares a constant used in this scope
  const pwInput = document.getElementById("rxPassword");
  // declares a constant used in this scope
  const confirmInput = document.getElementById("rxConfirm");
  // declares a constant used in this scope
  const tosCheckbox = document.getElementById("rxTosAccept");

  // declares a constant used in this scope
  const nameError = document.getElementById("rxNameError");
  // declares a constant used in this scope
  const emailError = document.getElementById("rxEmailError");
  // declares a constant used in this scope
  const pwError = document.getElementById("rxPasswordError");
  // declares a constant used in this scope
  const confirmError = document.getElementById("rxConfirmError");
  // declares a constant used in this scope
  const tosError = document.getElementById("rxTosError");
  // declares a constant used in this scope
  const pwCapsHint = document.getElementById("rxPasswordCapsHint");
  // declares a constant used in this scope
  const confirmCapsHint = document.getElementById("rxConfirmCapsHint");

  // --- Validation helpers ---
  function clearErrors() {
    [nameError, emailError, pwError, confirmError, tosError].forEach(
      // executes this operation step as part of the flow
      (el) => (el.textContent = ""),
    );
  }

  // declares a helper function for a focused task
  function validate() {
    // declares mutable state used in this scope
    let valid = true;

    // checks a condition before executing this branch
    if (!nameInput.value.trim()) {
      // executes this operation step as part of the flow
      nameError.textContent = "Username is required";
      // executes this operation step as part of the flow
      valid = false;
    }

    // declares a constant used in this scope
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // checks a condition before executing this branch
    if (!emailInput.value.trim()) {
      // executes this operation step as part of the flow
      emailError.textContent = "Email is required";
      // executes this operation step as part of the flow
      valid = false;
    } else if (!emailRe.test(emailInput.value.trim())) {
      // executes this operation step as part of the flow
      emailError.textContent = "Invalid email address";
      // executes this operation step as part of the flow
      valid = false;
    }

    // checks a condition before executing this branch
    if (!pwInput.value) {
      // executes this operation step as part of the flow
      pwError.textContent = "Password is required";
      // executes this operation step as part of the flow
      valid = false;
    } else if (pwInput.value.length < 8) {
      // executes this operation step as part of the flow
      pwError.textContent = "Minimum 8 characters";
      // executes this operation step as part of the flow
      valid = false;
    }

    // checks a condition before executing this branch
    if (!confirmInput.value) {
      // executes this operation step as part of the flow
      confirmError.textContent = "Please confirm your password";
      // executes this operation step as part of the flow
      valid = false;
    // executes this operation step as part of the flow
    } else if (confirmInput.value !== pwInput.value) {
      // executes this operation step as part of the flow
      confirmError.textContent = "Passwords do not match";
      // executes this operation step as part of the flow
      valid = false;
    }

    // checks a condition before executing this branch
    if (!tosCheckbox.checked) {
      // executes this operation step as part of the flow
      tosError.textContent =
        // executes this operation step as part of the flow
        "You must accept the Terms of Service & Cookie Policy";
      // executes this operation step as part of the flow
      valid = false;
    }

    // returns a value from the current function
    return valid;
  }

  // attaches a dom event listener for user interaction
  form.addEventListener("submit", async (e) => {
    // executes this operation step as part of the flow
    e.preventDefault();
    // executes this operation step as part of the flow
    clearErrors();

    // checks a condition before executing this branch
    if (!validate()) return;

    // checks a condition before executing this branch
    if (await usernameIsProfane(nameInput.value.trim())) {
      // executes this operation step as part of the flow
      nameError.textContent = "This username is not allowed";
      // returns a value from the current function
      return;
    }

    // executes this operation step as part of the flow
    btn.disabled = true;
    // executes this operation step as part of the flow
    btn.querySelector(".bw-btn-text").textContent = "✦  Creating…  ✦";

    // starts guarded logic to catch runtime errors
    try {
      // waits for an asynchronous operation to complete
      await register(
        nameInput.value.trim(),
        emailInput.value.trim(),
        pwInput.value,
      );
      // executes this operation step as part of the flow
      btn.classList.add("success");
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "✦  Account Created  ✦";
      // executes this operation step as part of the flow
      setTimeout(() => window.router.navigate("/login"), 900);
    } catch (err) {
      // Show server error under the name field (general form error)
      nameError.textContent =
        // executes this operation step as part of the flow
        err.message || "Registration failed. Please try again.";
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "Create Account";
      // executes this operation step as part of the flow
      btn.disabled = false;
    }
  });

  // --- Password visibility toggles ---
  const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  // declares a constant used in this scope
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;

  // --- Password strength ---
  const pwLine = document.getElementById("pwStrengthLine");

  // declares a constant used in this scope
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

  // declares a constant used in this scope
  const strengthGlows = [
    "none",
    "0 0 6px rgba(139,0,0,0.5),  0 0 16px rgba(139,0,0,0.2)",
    "0 0 8px rgba(192,57,43,0.65), 0 0 20px rgba(230,126,34,0.2)",
    "0 0 8px rgba(212,172,13,0.7), 0 0 20px rgba(212,172,13,0.25)",
    "0 0 10px rgba(82,190,128,0.7), 0 0 24px rgba(82,190,128,0.3)",
    "0 0 12px rgba(39,174,96,0.85), 0 0 30px rgba(39,174,96,0.45)",
  ];

  // declares a helper function for a focused task
  function getStrength(pw) {
    // declares mutable state used in this scope
    let score = 0;
    // checks a condition before executing this branch
    if (pw.length >= 6) score++;
    // checks a condition before executing this branch
    if (pw.length >= 10) score++;
    // checks a condition before executing this branch
    if (/[A-Z]/.test(pw)) score++;
    // checks a condition before executing this branch
    if (/[0-9]/.test(pw)) score++;
    // checks a condition before executing this branch
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    // returns a value from the current function
    return score;
  }

  // declares mutable state used in this scope
  let lastScore = -1;
  // attaches a dom event listener for user interaction
  pwInput.addEventListener("input", () => {
    // declares a constant used in this scope
    const score = pwInput.value.length ? getStrength(pwInput.value) : 0;

    // executes this operation step as part of the flow
    pwLine.style.setProperty("--pw-gradient", strengthGradients[score]);
    // executes this operation step as part of the flow
    pwLine.style.boxShadow = strengthGlows[score];

    // checks a condition before executing this branch
    if (score > 0) {
      // executes this operation step as part of the flow
      pwLine.classList.add("bw-pw-active");
    } else {
      // executes this operation step as part of the flow
      pwLine.classList.remove("bw-pw-active");
    }

    // pulse flash on score change
    if (score !== lastScore) {
      // executes this operation step as part of the flow
      lastScore = score;
      // executes this operation step as part of the flow
      pwLine.classList.add("bw-pw-pulse");
      // executes this operation step as part of the flow
      setTimeout(() => pwLine.classList.remove("bw-pw-pulse"), 260);
    }
  });

  // attaches a dom event listener for user interaction
  document.getElementById("rxPwToggle").addEventListener("click", () => {
    // declares a constant used in this scope
    const hidden = pwInput.type === "password";
    // executes this operation step as part of the flow
    pwInput.type = hidden ? "text" : "password";
    // executes this operation step as part of the flow
    document.getElementById("rxEyeIcon").innerHTML = hidden
      ? eyeClosed
      // executes this operation step as part of the flow
      : eyeOpen;
  });

  // attaches a dom event listener for user interaction
  document.getElementById("rxConfirmToggle").addEventListener("click", () => {
    // declares a constant used in this scope
    const hidden = confirmInput.type === "password";
    // executes this operation step as part of the flow
    confirmInput.type = hidden ? "text" : "password";
    // executes this operation step as part of the flow
    document.getElementById("rxConfirmEyeIcon").innerHTML = hidden
      ? eyeClosed
      // executes this operation step as part of the flow
      : eyeOpen;
  });

  attachCapsLockHints([
    { input: pwInput, hintEl: pwCapsHint },
    { input: confirmInput, hintEl: confirmCapsHint },
  ]);
}

/* ============================================================
   CANVAS – same starry background as Main page
   // executes this operation step as part of the flow
   ============================================================ */
// declares a helper function for a focused task
function initRegisterCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("rx-canvas");
  // checks a condition before executing this branch
  if (!canvas) return;
  // declares a constant used in this scope
  const ctx = canvas.getContext("2d");

  // executes this operation step as part of the flow
  let W, H;
  // declares mutable state used in this scope
  let stars = [];

  // declares a helper function for a focused task
  function measure() {
    // executes this operation step as part of the flow
    W = canvas.width = window.innerWidth;
    // executes this operation step as part of the flow
    H = canvas.height = window.innerHeight;
  }

  // declares a helper function for a focused task
  function initStars() {
    // executes this operation step as part of the flow
    stars = [];
    // iterates through a sequence of values
    for (let i = 0; i < 85; i++) {
      stars.push({
        // sets a named field inside an object or configuration block
        x: Math.random() * W,
        // sets a named field inside an object or configuration block
        y: Math.random() * H,
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

  // declares a helper function for a focused task
  function anim() {
    // executes this operation step as part of the flow
    ctx.clearRect(0, 0, W, H);
    // executes this operation step as part of the flow
    ctx.fillStyle = "rgb(8,6,6)";
    // executes this operation step as part of the flow
    ctx.fillRect(0, 0, W, H);

    // defines an arrow function used by surrounding logic
    stars.forEach((s) => {
      // executes this operation step as part of the flow
      s.x += s.vx;
      // executes this operation step as part of the flow
      s.y += s.vy;
      // checks a condition before executing this branch
      if (s.x < 0) s.x = W;
      // checks a condition before executing this branch
      if (s.x > W) s.x = 0;
      // checks a condition before executing this branch
      if (s.y < 0) s.y = H;
      // checks a condition before executing this branch
      if (s.y > H) s.y = 0;

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

    // executes this operation step as part of the flow
    requestAnimationFrame(anim);
  }

  // executes this operation step as part of the flow
  measure();
  // executes this operation step as part of the flow
  initStars();
  // executes this operation step as part of the flow
  anim();

  // attaches a dom event listener for user interaction
  window.addEventListener("resize", () => {
    // executes this operation step as part of the flow
    measure();
    // executes this operation step as part of the flow
    initStars();
  });
}

// declares a helper function for a focused task
function spawnRegisterParticles() {
  // declares a constant used in this scope
  const root = document.querySelector(".bw-root");
  // checks a condition before executing this branch
  if (!root) return;

  // iterates through a sequence of values
  for (let i = 0; i < 18; i++) {
    // declares a constant used in this scope
    const p = document.createElement("div");
    // executes this operation step as part of the flow
    p.className = "bw-particle";
    // declares a constant used in this scope
    const size = Math.random() * 2.2 + 0.4;
    // declares a constant used in this scope
    const delay = Math.random() * 20;
    // declares a constant used in this scope
    const duration = 18 + Math.random() * 22;
    // declares a constant used in this scope
    const drift = (Math.random() - 0.5) * 90;
    // declares a constant used in this scope
    const isRed = Math.random() < 0.28;
    // declares a constant used in this scope
    const isGold = !isRed && Math.random() < 0.15;
    // declares a constant used in this scope
    const col = isRed
      ? "rgba(192,57,43,0.55)"
      : isGold
        ? "rgba(212,175,55,0.4)"
        // executes this operation step as part of the flow
        : "rgba(255,230,210,0.28)";

    // executes this operation step as part of the flow
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-12px;
      background:${col};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    // executes this operation step as part of the flow
    root.appendChild(p);
  }
}