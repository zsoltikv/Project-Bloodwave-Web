// forgotpassword page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/ForgotPassword.css";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { API_BASE } from "../services/auth.js";
// exports the main function for this module
export default function ForgotPassword(container) {
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
            <p class="bw-subtitle">Restore&nbsp;&nbsp;Your&nbsp;&nbsp;Access</p>
          </div>

          <div class="bw-form" id="fpFormWrap">

            <p class="bw-desc">
              Enter your email address and we will send<br>
              you a link to reset your password.
            </p>

            <form id="fpForm" novalidate>
              <div class="bw-field">
                <label class="bw-label" for="fpEmail">Email Address</label>
                <div class="bw-input-wrap">
                  <input type="email" id="fpEmail" class="bw-input" placeholder="your@email.com" required autocomplete="email" />
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-error" id="fpEmailError"></span>
              </div>

              <button type="submit" class="bw-btn" id="fpBtn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">Send Reset Link</span>
              </button>
            </form>

            <!-- Success state (hidden until submit) -->
            <div class="bw-success-panel" id="fpSuccess">
              <div class="bw-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <p class="bw-success-title">Check Your Inbox</p>
              <p class="bw-success-text">
                If an account exists for that address,<br>
                a reset link is on its way.
              </p>
              <div class="bw-success-sep"></div>
            </div>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Remembered it? <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const form = document.getElementById("fpForm");
  // declares a constant used in this scope
  const btn = document.getElementById("fpBtn");
  // declares a constant used in this scope
  const emailInput = document.getElementById("fpEmail");
  // declares a constant used in this scope
  const emailError = document.getElementById("fpEmailError");
  // declares a constant used in this scope
  const successPanel = document.getElementById("fpSuccess");

  // attaches a dom event listener for user interaction
  form.addEventListener("submit", async (e) => {
    // executes this operation step as part of the flow
    e.preventDefault();
    // executes this operation step as part of the flow
    emailError.textContent = "";

    // declares a constant used in this scope
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // checks a condition before executing this branch
    if (!emailInput.value.trim()) {
      // executes this operation step as part of the flow
      emailError.textContent = "Email is required";
      // returns a value from the current function
      return;
    }
    // checks a condition before executing this branch
    if (!emailRe.test(emailInput.value.trim())) {
      // executes this operation step as part of the flow
      emailError.textContent = "Invalid email address";
      // returns a value from the current function
      return;
    }

    // executes this operation step as part of the flow
    btn.classList.add("success");
    // executes this operation step as part of the flow
    btn.querySelector(".bw-btn-text").textContent = "✦  Sent  ✦";

    // Example API call using API_BASE
    try {
      // waits for an asynchronous operation to complete
      await fetch(`${API_BASE}/api/user/forgot-password`, {
        // sets a named field inside an object or configuration block
        method: "POST",
        // sets a named field inside an object or configuration block
        headers: { "Content-Type": "application/json" },
        // sets a named field inside an object or configuration block
        body: JSON.stringify({ email: emailInput.value.trim() }),
      });
    } catch (err) {
      // Optionally handle error
      console.error("API error:", err);
    }

    // defines an arrow function used by surrounding logic
    setTimeout(() => {
      // executes this operation step as part of the flow
      form.style.cssText =
        // executes this operation step as part of the flow
        "opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity 0.35s ease, transform 0.35s ease;";
      // defines an arrow function used by surrounding logic
      setTimeout(() => {
        // executes this operation step as part of the flow
        form.style.display = "none";
        // executes this operation step as part of the flow
        successPanel.classList.add("visible");
      // executes this operation step as part of the flow
      }, 370);
    // executes this operation step as part of the flow
    }, 650);
  });
}

/* ============================================================
   CANVAS – same starry background as Main page
   // executes this operation step as part of the flow
   ============================================================ */
// declares a helper function for a focused task
function initFpCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("fp-canvas");
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
function spawnFpParticles() {
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