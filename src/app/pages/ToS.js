// tos page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/ToS.css";
// imports dependencies used by this module
import { isLoggedIn } from "../services/auth.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// exports the main function for this module
export default function ToS(container) {
  // declares a constant used in this scope
  const loggedIn = isLoggedIn();
  // declares a constant used in this scope
  const ctaHref = loggedIn ? "/main" : "/register";
  // declares a constant used in this scope
  const ctaLabel = loggedIn ? "Back to Dashboard" : "Back to Registration";

  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="bw-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card" style="max-width: 800px; width: 90%;">
        <div class="bw-card-inner" style="padding: clamp(24px, 5vw, 48px);">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header" style="margin-bottom: 2rem;">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">ToS &amp; Cookie Policy</h1>
          </div>

          <div class="bw-tos-content">
            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">1. Terms of Service</h2>
              
              <h3 class="bw-tos-subheading">1.1 Acceptance of Terms</h3>
              <p class="bw-tos-text">
                By accessing and using Bloodwave, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>

              <h3 class="bw-tos-subheading">1.2 Use of Service</h3>
              <p class="bw-tos-text">
                You agree to use Bloodwave only for lawful purposes and in a way that does not infringe the rights of, restrict, 
                or inhibit anyone else's use and enjoyment of the service. Prohibited behavior includes harassing or causing 
                distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal 
                flow of dialogue within our service.
              </p>

              <h3 class="bw-tos-subheading">1.3 User Account</h3>
              <p class="bw-tos-text">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                responsibility for all activities that occur under your account. We reserve the right to refuse service, 
                terminate accounts, or remove or edit content at our sole discretion.
              </p>

              <h3 class="bw-tos-subheading">1.4 Intellectual Property</h3>
              <p class="bw-tos-text">
                The service and its original content, features, and functionality are and will remain the exclusive property 
                of Bloodwave and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>

              <h3 class="bw-tos-subheading">1.5 Termination</h3>
              <p class="bw-tos-text">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">2. Cookie Policy</h2>
              
              <h3 class="bw-tos-subheading">2.1 What Are Cookies</h3>
              <p class="bw-tos-text">
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored 
                in your web browser and allows the service or a third-party to recognize you and make your next visit easier 
                and the service more useful to you.
              </p>

              <h3 class="bw-tos-subheading">2.2 How We Use Cookies</h3>
              <p class="bw-tos-text">
                When you use and access Bloodwave, we may place cookie files in your web browser. We use cookies for the 
                following purposes:
              </p>
              <ul class="bw-tos-list">
                <li>To enable certain functions of the service</li>
                <li>To provide analytics and track usage patterns</li>
                <li>To store your preferences and settings</li>
                <li>To enable authentication and maintain your session</li>
              </ul>

              <h3 class="bw-tos-subheading">2.3 Types of Cookies We Use</h3>
              <p class="bw-tos-text">
                <strong>Essential Cookies:</strong> These cookies are necessary for the service to function and cannot be 
                switched off in our systems. They are usually only set in response to actions made by you which amount to 
                a request for services, such as setting your privacy preferences, logging in, or filling in forms.
              </p>
              <p class="bw-tos-text">
                <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can 
                measure and improve the performance of our site. They help us to know which pages are the most and least 
                popular and see how visitors move around the site.
              </p>

              <h3 class="bw-tos-subheading">2.4 Your Choices Regarding Cookies</h3>
              <p class="bw-tos-text">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the 
                help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, 
                you might not be able to use all of the features we offer.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">3. Changes to This Agreement</h2>
              <p class="bw-tos-text">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide 
                notice of any changes by posting the new Terms on this page. Your continued use of the service after any 
                such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section class="bw-tos-section">
              <h2 class="bw-tos-heading">4. Contact Us</h2>
              <p class="bw-tos-text">
                If you have any questions about these Terms or our Cookie Policy, please contact us through our support channels.
              </p>
            </section>

            <div class="bw-footer-link" style="margin-top: 2rem; text-align: center;">
              <a href="${ctaHref}" data-link class="bw-btn" style="display: inline-block; margin-top: 1rem;">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">${ctaLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();
}

/* ============================================================
   CANVAS – minimal star field for ToS page
   // executes this operation step as part of the flow
   ============================================================ */
// declares a helper function for a focused task
function initToSCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("tos-canvas");
  // checks a condition before executing this branch
  if (!canvas) return;
  // declares a constant used in this scope
  const ctx = canvas.getContext("2d");

  // executes this operation step as part of the flow
  let W, H;
  // declares mutable state used in this scope
  let stars = [];
  // executes this operation step as part of the flow
  let animId;

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
    for (let i = 0; i < 100; i++) {
      stars.push({
        // sets a named field inside an object or configuration block
        x: Math.random() * W,
        // sets a named field inside an object or configuration block
        y: Math.random() * H,
        // sets a named field inside an object or configuration block
        r: Math.random() * 1.2 + 0.2,
        // sets a named field inside an object or configuration block
        opacity: Math.random() * 0.5 + 0.2,
        // sets a named field inside an object or configuration block
        flicker: Math.random() * Math.PI * 2,
        // sets a named field inside an object or configuration block
        flickerSpeed: Math.random() * 0.02 + 0.003,
        // sets a named field inside an object or configuration block
        vx: (Math.random() - 0.5) * 0.15,
        // sets a named field inside an object or configuration block
        vy: (Math.random() - 0.5) * 0.15,
        // sets a named field inside an object or configuration block
        isRed: Math.random() < 0.08,
        // sets a named field inside an object or configuration block
        isGold: Math.random() < 0.05,
      });
    }
  }

  // defines an arrow function used by surrounding logic
  requestAnimationFrame(() => {
    // executes this operation step as part of the flow
    measure();
    // executes this operation step as part of the flow
    initStars();

    // attaches a dom event listener for user interaction
    window.addEventListener("resize", () => {
      // executes this operation step as part of the flow
      measure();
      // executes this operation step as part of the flow
      initStars();
    });

    // declares a helper function for a focused task
    function draw() {
      // checks a condition before executing this branch
      if (!document.getElementById("tos-canvas")) {
        // executes this operation step as part of the flow
        cancelAnimationFrame(animId);
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      ctx.clearRect(0, 0, W, H);

      // defines an arrow function used by surrounding logic
      stars.forEach((s) => {
        // executes this operation step as part of the flow
        s.flicker += s.flickerSpeed;
        // declares a constant used in this scope
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.flicker));

        // executes this operation step as part of the flow
        ctx.globalAlpha = alpha;
        // executes this operation step as part of the flow
        ctx.beginPath();
        // executes this operation step as part of the flow
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // executes this operation step as part of the flow
        ctx.fillStyle = s.isRed ? "#CC1A1A" : s.isGold ? "#D4AF37" : "#FFE8D8";
        // executes this operation step as part of the flow
        ctx.fill();
        // executes this operation step as part of the flow
        ctx.globalAlpha = 1;

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
      });

      // executes this operation step as part of the flow
      animId = requestAnimationFrame(draw);
    }

    // executes this operation step as part of the flow
    draw();
  });
}

// declares a helper function for a focused task
function spawnToSParticles() {
  // declares a constant used in this scope
  const root = document.querySelector(".bw-root");
  // checks a condition before executing this branch
  if (!root) return;

  // iterates through a sequence of values
  for (let i = 0; i < 12; i++) {
    // declares a constant used in this scope
    const p = document.createElement("div");
    // executes this operation step as part of the flow
    p.className = "bw-particle";
    // declares a constant used in this scope
    const size = Math.random() * 2 + 0.4;
    // declares a constant used in this scope
    const delay = Math.random() * 15;
    // declares a constant used in this scope
    const duration = 15 + Math.random() * 20;
    // declares a constant used in this scope
    const drift = (Math.random() - 0.5) * 80;
    // declares a constant used in this scope
    const isRed = Math.random() < 0.25;
    // declares a constant used in this scope
    const isGold = !isRed && Math.random() < 0.12;
    // declares a constant used in this scope
    const col = isRed
      ? "rgba(192,57,43,0.5)"
      : isGold
        ? "rgba(212,175,55,0.35)"
        // executes this operation step as part of the flow
        : "rgba(255,230,210,0.25)";

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