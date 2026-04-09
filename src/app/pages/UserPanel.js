// userpanel page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/UserPanel.css";
// imports dependencies used by this module
import { API_BASE, getUser, logout, authFetch } from "../services/auth.js";
// imports dependencies used by this module
import {
  confirmLogout,
  confirmDeleteAccount,
  showDeleteAccountError,
// executes this operation step as part of the flow
} from "../effects/logout-confirm.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { usernameIsProfane } from "../utils/profanity.js";
// imports dependencies used by this module
import { attachCapsLockHints } from "../utils/caps-lock.js";

// exports the main function for this module
export default function UserPanel(container) {
  // declares a constant used in this scope
  const cachedUser = getUser();
  // declares a constant used in this scope
  const profileState = {
    // sets a named field inside an object or configuration block
    username: cachedUser?.username || "",
    // sets a named field inside an object or configuration block
    email: cachedUser?.email || "",
    // sets a named field inside an object or configuration block
    createdAt: cachedUser?.createdAt || "",
  };

  // executes this operation step as part of the flow
  container.innerHTML = `
    

    <div class="up-root">
      <div class="up-glow"></div>

      <!-- === NAVBAR === -->
      <nav class="up-nav">
        <div class="up-nav-inner">
          <a href="/" data-link class="up-logo">Bloodwave</a>
          <div class="up-right">
            <a href="/main" data-link class="up-nav-link" id="upBackToDashboard">Back to Dashboard</a>
            <button class="up-hamburger" id="up-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="up-bar"></span>
              <span class="up-bar"></span>
              <span class="up-bar"></span>
            </button>
          </div>
        </div>

        <div class="up-mobile-menu" id="up-mobile-menu">
          <div class="up-mobile-menu-inner">
            <a href="/main" data-link class="up-mobile-link">Matches</a>
            <a href="/stats" data-link class="up-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="up-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="up-mobile-link">Achievements</a>
            <div class="up-mobile-divider"></div>
            <div class="up-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="up-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="up-mobile-username">—</span>
            </div>
            <div class="up-mobile-divider"></div>
            <a href="/user-panel" data-link class="up-mobile-link">Profile</a>
            <a href="/android-download" data-link class="up-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="up-mobile-link">API Status</a>
            <button class="up-mobile-logout" id="up-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- === MAIN CONTENT === -->
      <main class="up-content">
        <div class="up-container">

          <!-- HEADER -->
          <div class="up-header">
            <div class="up-ornament">
              <div class="up-ornament-line"></div>
              <div class="up-ornament-diamond"></div>
              <div class="up-ornament-line"></div>
            </div>
            <h1 class="up-title">Your Profile</h1>
            <p class="up-subtitle">Account&nbsp;&nbsp;Management</p>
          </div>

          <!-- INFO GRID -->
          <div class="up-info-grid">
            <div class="up-info-card">
              <span class="up-info-label">👤 Username</span>
              <span class="up-info-value" id="up-username-value">${escapeHtml(cachedUser?.username || "N/A")}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">✉ Email</span>
              <span class="up-info-value" id="up-email-value">${escapeHtml(cachedUser?.email || "N/A")}</span>
            </div>

            <div class="up-info-card">
              <span class="up-info-label">📅 Member Since</span>
              <span class="up-info-value" id="up-created-at-value">${formatDate(cachedUser?.createdAt || "N/A")}</span>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="up-divider">
            <div class="up-divider-line"></div>
            <span class="up-divider-text">Settings</span>
            <div class="up-divider-line"></div>
          </div>

          <!-- SETTINGS PANEL -->
          <div class="up-settings-panel">
            <div class="up-settings-title">Account Settings</div>
            <div class="up-settings-buttons">
              <button class="up-settings-btn up-settings-action" id="upEditUsername">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <circle cx="12" cy="8" r="3.5"></circle>
                    <path d="M5 19c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Edit Username</span>
                  <span class="up-btn-sub">Update display name</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditEmail">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="3.5" y="6.5" width="17" height="11" rx="2"></rect>
                    <path d="M4.5 8l7.5 5.5L19.5 8"></path>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Email</span>
                  <span class="up-btn-sub">Set a new email address</span>
                </span>
              </button>
              <button class="up-settings-btn up-settings-action" id="upEditPassword">
                <span class="up-btn-icon" aria-hidden="true">
                  <svg class="up-icon-lock" viewBox="0 0 24 24" role="presentation" focusable="false">
                    <rect x="6" y="11" width="12" height="9" rx="2"></rect>
                    <path d="M8 11V9a4 4 0 0 1 8 0v2"></path>
                    <circle cx="12" cy="15.5" r="1"></circle>
                  </svg>
                </span>
                <span class="up-btn-copy">
                  <span class="up-btn-main">Change Password</span>
                  <span class="up-btn-sub">Secure your account</span>
                </span>
              </button>
            </div>
          </div>

          <!-- LOGOUT SECTION -->
          <div class="up-logout-section">
            <button class="up-logout-btn up-delete-btn" id="upDeleteAccount">✦ Delete Account ✦</button>
            <button class="up-logout-btn up-delete-btn" id="upLogout">✦ Sign Out Now ✦</button>
          </div>

        </div>
      </main>
    </div>

    <!-- === MODALS === -->

    <!-- EDIT USERNAME MODAL -->
    <div class="up-modal-overlay" id="upUsernameModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Edit Username</div>
          <div class="up-modal-subtitle">Choose your new display name</div>
        </div>
        <form class="up-form" id="upUsernameForm">
          <span class="up-form-error" id="upUsernameError" role="alert" aria-live="polite"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Username</label>
            <input type="text" id="upUsernameInput" class="up-form-input" placeholder="your_username" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upUsernameCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT EMAIL MODAL -->
    <div class="up-modal-overlay" id="upEmailModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Email</div>
          <div class="up-modal-subtitle">Update your email address</div>
        </div>
        <form class="up-form" id="upEmailForm">
          <span class="up-form-error" id="upEmailError" role="alert" aria-live="polite"></span>
          <div class="up-form-field">
            <label class="up-form-label">New Email</label>
            <input type="email" id="upEmailInput" class="up-form-input" placeholder="your@email.com" autocomplete="off" />
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Update</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upEmailCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CHANGE PASSWORD MODAL -->
    <div class="up-modal-overlay" id="upPasswordModal" style="display:none;">
      <div class="up-modal-card">
        <div class="up-modal-header">
          <div class="up-modal-title">Change Password</div>
          <div class="up-modal-subtitle">Secure your account</div>
        </div>
        <form class="up-form" id="upPasswordForm">
          <span class="up-form-error" id="upPasswordError" role="alert" aria-live="polite"></span>
          <div class="up-form-field">
            <label class="up-form-label">Current Password</label>
            <input type="password" id="upPasswordCurrent" class="up-form-input" placeholder="············" autocomplete="off" />
            <span class="up-caps-lock-hint" id="upPasswordCurrentCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
          </div>
          <div class="up-form-field">
            <label class="up-form-label">New Password</label>
            <input type="password" id="upPasswordNew" class="up-form-input" placeholder="············" autocomplete="off" />
            <span class="up-caps-lock-hint" id="upPasswordNewCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
          </div>
          <div class="up-form-field">
            <label class="up-form-label">Confirm Password</label>
            <input type="password" id="upPasswordConfirm" class="up-form-input" placeholder="············" autocomplete="off" />
            <span class="up-caps-lock-hint" id="upPasswordConfirmCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
          </div>
          <div class="up-form-actions">
            <button type="submit" class="up-settings-btn">Change</button>
            <button type="button" class="up-settings-btn up-btn-cancel" id="upPasswordCancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // ========== HELPERS ==========
  function escapeHtml(text) {
    // declares a constant used in this scope
    const span = document.createElement("span");
    // executes this operation step as part of the flow
    span.textContent = text;
    // returns a value from the current function
    return span.innerHTML;
  }

  // declares a helper function for a focused task
  function formatDate(dateStr) {
    // checks a condition before executing this branch
    if (!dateStr) return "N/A";
    // declares a constant used in this scope
    const date = new Date(dateStr);
    // declares a constant used in this scope
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // declares a constant used in this scope
    const day = date.getDate();
    // declares a constant used in this scope
    const month = months[date.getMonth()];
    // declares a constant used in this scope
    const year = date.getFullYear();
    // returns a value from the current function
    return `${month} ${day}, ${year}`;
  }

  // declares a helper function for a focused task
  function clearFormError(errorEl) {
    // checks a condition before executing this branch
    if (!errorEl) return;
    // executes this operation step as part of the flow
    errorEl.classList.remove("show");
    // executes this operation step as part of the flow
    errorEl.textContent = "";
  }

  // declares a helper function for a focused task
  function showFormError(errorEl, message) {
    // checks a condition before executing this branch
    if (!errorEl) return;
    // executes this operation step as part of the flow
    errorEl.textContent = message || "Something went wrong. Please try again.";
    // executes this operation step as part of the flow
    errorEl.classList.add("show");
  }

  // declares a constant used in this scope
  const mobileUsername = document.getElementById("up-mobile-username");
  // checks a condition before executing this branch
  if (mobileUsername) {
    // executes this operation step as part of the flow
    mobileUsername.textContent =
      // executes this operation step as part of the flow
      cachedUser?.username || cachedUser?.email || "Member";
  }

  // declares a helper function for a focused task
  function applyUserToUi(userData) {
    // checks a condition before executing this branch
    if (!userData) return;

    // executes this operation step as part of the flow
    profileState.username = userData.username || profileState.username;
    // executes this operation step as part of the flow
    profileState.email = userData.email || profileState.email;
    // executes this operation step as part of the flow
    profileState.createdAt = userData.createdAt || profileState.createdAt;

    // declares a constant used in this scope
    const usernameEl = document.getElementById("up-username-value");
    // declares a constant used in this scope
    const emailEl = document.getElementById("up-email-value");
    // declares a constant used in this scope
    const createdAtEl = document.getElementById("up-created-at-value");

    // checks a condition before executing this branch
    if (usernameEl) usernameEl.textContent = profileState.username || "N/A";
    // checks a condition before executing this branch
    if (emailEl) emailEl.textContent = profileState.email || "N/A";
    // checks a condition before executing this branch
    if (createdAtEl)
      // executes this operation step as part of the flow
      createdAtEl.textContent = formatDate(profileState.createdAt || "");
    // checks a condition before executing this branch
    if (mobileUsername) {
      // executes this operation step as part of the flow
      mobileUsername.textContent =
        // executes this operation step as part of the flow
        profileState.username || profileState.email || "Member";
    }
  }

  async function updateCurrentUser(payload) {
    // declares a constant used in this scope
    const res = await authFetch(`${API_BASE}/api/User/me`, {
      // sets a named field inside an object or configuration block
      method: "PUT",
      // sets a named field inside an object or configuration block
      headers: {
        "Content-Type": "application/json",
        // sets a named field inside an object or configuration block
        Accept: "application/json",
      },
      // sets a named field inside an object or configuration block
      body: JSON.stringify(payload),
    });

    // checks a condition before executing this branch
    if (!res.ok) {
      // declares a constant used in this scope
      const errData = await res.json().catch(() => ({}));
      // throws an error to be handled by calling code
      throw new Error(errData.message || "Failed to update profile");
    }

    // declares a constant used in this scope
    const updatedUser = await res.json();
    // executes this operation step as part of the flow
    applyUserToUi(updatedUser);
    // returns a value from the current function
    return updatedUser;
  }

  async function fetchCurrentUser() {
    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const res = await authFetch(`${API_BASE}/api/User/me`, {
        // sets a named field inside an object or configuration block
        method: "GET",
        // sets a named field inside an object or configuration block
        headers: { Accept: "application/json" },
      });

      // checks a condition before executing this branch
      if (!res.ok) {
        // throws an error to be handled by calling code
        throw new Error(`Failed to load profile (${res.status})`);
      }

      // declares a constant used in this scope
      const userData = await res.json();
      // executes this operation step as part of the flow
      applyUserToUi(userData);
    } catch (err) {
      // executes this operation step as part of the flow
      console.error("Failed to fetch current user profile:", err);
    }
  }

  // declares a constant used in this scope
  const hamburger = document.getElementById("up-hamburger");
  // declares a constant used in this scope
  const mobileMenu = document.getElementById("up-mobile-menu");
  // declares mutable state used in this scope
  let mobileMenuOpen = false;

  // attaches a dom event listener for user interaction
  hamburger?.addEventListener("click", () => {
    // executes this operation step as part of the flow
    mobileMenuOpen = !mobileMenuOpen;
    // executes this operation step as part of the flow
    hamburger.classList.toggle("open", mobileMenuOpen);
    // executes this operation step as part of the flow
    hamburger.setAttribute("aria-expanded", String(mobileMenuOpen));
    // executes this operation step as part of the flow
    mobileMenu.style.maxHeight = mobileMenuOpen
      ? mobileMenu.scrollHeight + "px"
      // executes this operation step as part of the flow
      : "0";
  });

  // defines an arrow function used by surrounding logic
  mobileMenu?.querySelectorAll(".up-mobile-link").forEach((link) => {
    // attaches a dom event listener for user interaction
    link.addEventListener("click", () => {
      // executes this operation step as part of the flow
      mobileMenuOpen = false;
      // executes this operation step as part of the flow
      hamburger?.classList.remove("open");
      // executes this operation step as part of the flow
      hamburger?.setAttribute("aria-expanded", "false");
      // executes this operation step as part of the flow
      mobileMenu.style.maxHeight = "0";
    });
  });

  // ========== CANVAS ANIMATION ==========
  function initUpCanvas() {
    // declares a constant used in this scope
    const canvas = document.getElementById("up-canvas");
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
      // Full clear each frame so stars remain points without motion trails.
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
        const glow = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          glowRadius,
        );
        glow.addColorStop(
          0,
          `rgba(212,175,55,${Math.min(1, s.opacity * 0.75)})`,
        );
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

  // ========== MODAL SETUP ==========
  function setupModal(modalId, triggerBtnId, cancelBtnId, formId, onSubmit) {
    // declares a constant used in this scope
    const modal = document.getElementById(modalId);
    // declares a constant used in this scope
    const btn = document.getElementById(triggerBtnId);
    // declares a constant used in this scope
    const cancelBtn = document.getElementById(cancelBtnId);
    // declares a constant used in this scope
    const form = document.getElementById(formId);
    // declares a constant used in this scope
    const errorEl = form?.querySelector(".up-form-error");

    // attaches a dom event listener for user interaction
    btn?.addEventListener("click", () => {
      // executes this operation step as part of the flow
      modal.style.display = "flex";
      // executes this operation step as part of the flow
      clearFormError(errorEl);
      // declares a constant used in this scope
      const firstInput = form?.querySelector("input");
      // executes this operation step as part of the flow
      firstInput?.focus();
    });

    // attaches a dom event listener for user interaction
    cancelBtn?.addEventListener("click", () => {
      // executes this operation step as part of the flow
      modal.style.display = "none";
      // executes this operation step as part of the flow
      clearFormError(errorEl);
      // executes this operation step as part of the flow
      form?.reset();
    });

    // attaches a dom event listener for user interaction
    modal?.addEventListener("click", (e) => {
      // checks a condition before executing this branch
      if (e.target === modal) {
        // executes this operation step as part of the flow
        modal.style.display = "none";
        // executes this operation step as part of the flow
        clearFormError(errorEl);
        // executes this operation step as part of the flow
        form?.reset();
      }
    });

    // attaches a dom event listener for user interaction
    form?.addEventListener("submit", onSubmit);
  }

  // === USERNAME MODAL ===
  setupModal(
    "upUsernameModal",
    "upEditUsername",
    "upUsernameCancel",
    "upUsernameForm",
    // defines an arrow function used by surrounding logic
    async (e) => {
      // executes this operation step as part of the flow
      e.preventDefault();
      // declares a constant used in this scope
      const input = document.getElementById("upUsernameInput");
      // declares a constant used in this scope
      const errorEl = document.getElementById("upUsernameError");
      // declares a constant used in this scope
      const submitBtn = document.querySelector(
        // executes this operation step as part of the flow
        '#upUsernameForm button[type="submit"]',
      );

      // executes this operation step as part of the flow
      clearFormError(errorEl);

      // declares a constant used in this scope
      const username = input.value.trim();
      // checks a condition before executing this branch
      if (username.length < 3) {
        // executes this operation step as part of the flow
        showFormError(errorEl, "Username must be at least 3 characters");
        // returns a value from the current function
        return;
      }

      // checks a condition before executing this branch
      if (await usernameIsProfane(username)) {
        // executes this operation step as part of the flow
        showFormError(errorEl, "This username is not allowed");
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      submitBtn.disabled = true;
      // declares a constant used in this scope
      const originalText = submitBtn.textContent;
      // executes this operation step as part of the flow
      submitBtn.textContent = "✦ Updating… ✦";

      // starts guarded logic to catch runtime errors
      try {
        // waits for an asynchronous operation to complete
        await updateCurrentUser({
          username,
          // sets a named field inside an object or configuration block
          email: profileState.email,
        });

        // executes this operation step as part of the flow
        submitBtn.textContent = "✦ Updated ✦";
        // executes this operation step as part of the flow
        submitBtn.classList.add("success");
        // defines an arrow function used by surrounding logic
        setTimeout(() => {
          // executes this operation step as part of the flow
          document.getElementById("upUsernameModal").style.display = "none";
          // executes this operation step as part of the flow
          document.getElementById("upUsernameForm")?.reset();
          // executes this operation step as part of the flow
          submitBtn.textContent = originalText;
          // executes this operation step as part of the flow
          submitBtn.classList.remove("success");
          // executes this operation step as part of the flow
          submitBtn.disabled = false;
        // executes this operation step as part of the flow
        }, 700);
      } catch (err) {
        // executes this operation step as part of the flow
        showFormError(errorEl, err.message);
        // executes this operation step as part of the flow
        submitBtn.textContent = originalText;
        // executes this operation step as part of the flow
        submitBtn.disabled = false;
      }
    },
  );

  // === EMAIL MODAL ===
  setupModal(
    "upEmailModal",
    "upEditEmail",
    "upEmailCancel",
    "upEmailForm",
    // defines an arrow function used by surrounding logic
    async (e) => {
      // executes this operation step as part of the flow
      e.preventDefault();
      // declares a constant used in this scope
      const input = document.getElementById("upEmailInput");
      // declares a constant used in this scope
      const errorEl = document.getElementById("upEmailError");
      // declares a constant used in this scope
      const submitBtn = document.querySelector(
        // executes this operation step as part of the flow
        '#upEmailForm button[type="submit"]',
      );

      // executes this operation step as part of the flow
      clearFormError(errorEl);

      // declares a constant used in this scope
      const email = input.value.trim();
      // declares a constant used in this scope
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // checks a condition before executing this branch
      if (!emailRe.test(email)) {
        // executes this operation step as part of the flow
        showFormError(errorEl, "Invalid email address");
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      submitBtn.disabled = true;
      // declares a constant used in this scope
      const originalText = submitBtn.textContent;
      // executes this operation step as part of the flow
      submitBtn.textContent = "✦ Updating… ✦";

      // starts guarded logic to catch runtime errors
      try {
        // waits for an asynchronous operation to complete
        await updateCurrentUser({
          // sets a named field inside an object or configuration block
          username: profileState.username,
          email,
        });

        // executes this operation step as part of the flow
        submitBtn.textContent = "✦ Updated ✦";
        // executes this operation step as part of the flow
        submitBtn.classList.add("success");
        // defines an arrow function used by surrounding logic
        setTimeout(() => {
          // executes this operation step as part of the flow
          document.getElementById("upEmailModal").style.display = "none";
          // executes this operation step as part of the flow
          document.getElementById("upEmailForm")?.reset();
          // executes this operation step as part of the flow
          submitBtn.textContent = originalText;
          // executes this operation step as part of the flow
          submitBtn.classList.remove("success");
          // executes this operation step as part of the flow
          submitBtn.disabled = false;
        // executes this operation step as part of the flow
        }, 700);
      } catch (err) {
        // executes this operation step as part of the flow
        showFormError(errorEl, err.message);
        // executes this operation step as part of the flow
        submitBtn.textContent = originalText;
        // executes this operation step as part of the flow
        submitBtn.disabled = false;
      }
    },
  );

  // === PASSWORD MODAL ===
  setupModal(
    "upPasswordModal",
    "upEditPassword",
    "upPasswordCancel",
    "upPasswordForm",
    // defines an arrow function used by surrounding logic
    async (e) => {
      // executes this operation step as part of the flow
      e.preventDefault();
      // declares a constant used in this scope
      const newPass = document.getElementById("upPasswordNew");
      // declares a constant used in this scope
      const confirm = document.getElementById("upPasswordConfirm");
      // declares a constant used in this scope
      const errorEl = document.getElementById("upPasswordError");
      // declares a constant used in this scope
      const submitBtn = document.querySelector(
        // executes this operation step as part of the flow
        '#upPasswordForm button[type="submit"]',
      );

      // executes this operation step as part of the flow
      clearFormError(errorEl);

      // declares mutable state used in this scope
      let valid = true;
      // checks a condition before executing this branch
      if (newPass.value.length < 6) {
        // executes this operation step as part of the flow
        showFormError(errorEl, "New password must be at least 6 characters");
        // executes this operation step as part of the flow
        valid = false;
      // executes this operation step as part of the flow
      } else if (newPass.value !== confirm.value) {
        // executes this operation step as part of the flow
        showFormError(errorEl, "Passwords do not match");
        // executes this operation step as part of the flow
        valid = false;
      }

      // checks a condition before executing this branch
      if (!valid) {
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      submitBtn.disabled = true;
      // declares a constant used in this scope
      const originalText = submitBtn.textContent;
      // executes this operation step as part of the flow
      submitBtn.textContent = "✦ Changing… ✦";

      // starts guarded logic to catch runtime errors
      try {
        // waits for an asynchronous operation to complete
        await updateCurrentUser({
          // sets a named field inside an object or configuration block
          username: profileState.username,
          // sets a named field inside an object or configuration block
          email: profileState.email,
          // sets a named field inside an object or configuration block
          password: newPass.value,
        });

        // executes this operation step as part of the flow
        submitBtn.textContent = "✦ Changed ✦";
        // executes this operation step as part of the flow
        submitBtn.classList.add("success");
        // defines an arrow function used by surrounding logic
        setTimeout(() => {
          // executes this operation step as part of the flow
          document.getElementById("upPasswordModal").style.display = "none";
          // executes this operation step as part of the flow
          document.getElementById("upPasswordForm")?.reset();
          // executes this operation step as part of the flow
          submitBtn.textContent = originalText;
          // executes this operation step as part of the flow
          submitBtn.classList.remove("success");
          // executes this operation step as part of the flow
          submitBtn.disabled = false;
        // executes this operation step as part of the flow
        }, 700);
      } catch (err) {
        // executes this operation step as part of the flow
        showFormError(errorEl, err.message);
        // executes this operation step as part of the flow
        submitBtn.textContent = originalText;
        // executes this operation step as part of the flow
        submitBtn.disabled = false;
      }
    },
  );

  // ========== LOGOUT ==========
  const doLogout = async (button) => {
    // declares a constant used in this scope
    const confirmed = await confirmLogout();
    // checks a condition before executing this branch
    if (!confirmed) return;

    // checks a condition before executing this branch
    if (button) {
      // executes this operation step as part of the flow
      button.disabled = true;
      // checks a condition before executing this branch
      if (button.id === "upLogout") {
        // executes this operation step as part of the flow
        button.textContent = "✦ Goodbye… ✦";
      } else {
        // executes this operation step as part of the flow
        button.innerHTML = "✦ Logging out… ✦";
      }
    }

    // starts guarded logic to catch runtime errors
    try {
      // waits for an asynchronous operation to complete
      await logout();
    } catch (err) {
      // executes this operation step as part of the flow
      console.error("Logout error:", err);
    }
  };

  // attaches a dom event listener for user interaction
  document.getElementById("upLogout")?.addEventListener("click", async () => {
    // waits for an asynchronous operation to complete
    await doLogout(document.getElementById("upLogout"));
  });

  document
    .getElementById("up-mobile-logout")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", async () => {
      // waits for an asynchronous operation to complete
      await doLogout(document.getElementById("up-mobile-logout"));
    });

  // declares a constant used in this scope
  const doDeleteAccount = async (button) => {
    // declares a constant used in this scope
    const expectedUsername = (
      profileState.username ||
      cachedUser?.username ||
      ""
    // executes this operation step as part of the flow
    ).trim();
    // declares a constant used in this scope
    const confirmation = await confirmDeleteAccount(expectedUsername);
    // checks a condition before executing this branch
    if (!confirmation || confirmation.confirmed !== true) return;

    // declares a constant used in this scope
    const originalText = button?.textContent || "";
    // checks a condition before executing this branch
    if (button) {
      // executes this operation step as part of the flow
      button.disabled = true;
      // executes this operation step as part of the flow
      button.textContent = "✦ Deleting… ✦";
    }

    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const response = await authFetch(`${API_BASE}/api/User/me`, {
        // sets a named field inside an object or configuration block
        method: "DELETE",
        // sets a named field inside an object or configuration block
        headers: {
          // sets a named field inside an object or configuration block
          Accept: "application/json",
        },
        // sets a named field inside an object or configuration block
        body: JSON.stringify({
          // sets a named field inside an object or configuration block
          password: confirmation.password,
        }),
        // sets a named field inside an object or configuration block
        skipAutoLogout: true,
      });

      // checks a condition before executing this branch
      if (!response.ok) {
        // declares a constant used in this scope
        const errorPayload = await response.json().catch(() => ({}));
        // throws an error to be handled by calling code
        throw new Error(errorPayload?.message || "Failed to delete account.");
      }

      // Sikeres törlés - kijelentkeztetés
      await logout();
      // returns a value from the current function
      return;
    } catch (err) {
      // HIBA - NEM logout, marad az oldalon
      console.error("Delete account error:", err);
      // waits for an asynchronous operation to complete
      await showDeleteAccountError(
        err?.message || "Could not delete account. Please try again.",
        "Please verify your username and password are correct.",
      );
      // checks a condition before executing this branch
      if (button) {
        // executes this operation step as part of the flow
        button.disabled = false;
        // executes this operation step as part of the flow
        button.textContent = originalText;
      }
    }
  };

  document
    .getElementById("upDeleteAccount")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", async () => {
      // waits for an asynchronous operation to complete
      await doDeleteAccount(document.getElementById("upDeleteAccount"));
    });

  attachCapsLockHints([
    {
      // sets a named field inside an object or configuration block
      input: document.getElementById("upPasswordCurrent"),
      // sets a named field inside an object or configuration block
      hintEl: document.getElementById("upPasswordCurrentCapsHint"),
    },
    {
      // sets a named field inside an object or configuration block
      input: document.getElementById("upPasswordNew"),
      // sets a named field inside an object or configuration block
      hintEl: document.getElementById("upPasswordNewCapsHint"),
    },
    {
      // sets a named field inside an object or configuration block
      input: document.getElementById("upPasswordConfirm"),
      // sets a named field inside an object or configuration block
      hintEl: document.getElementById("upPasswordConfirmCapsHint"),
    },
  ]);

  document
    .getElementById("upBackToDashboard")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", (e) => {
      // executes this operation step as part of the flow
      e.preventDefault();
      // checks a condition before executing this branch
      if (window.router?.navigate) {
        // executes this operation step as part of the flow
        window.router.navigate("/main");
        // returns a value from the current function
        return;
      }
      // executes this operation step as part of the flow
      window.location.href = "/main";
    });

  // ========== INIT ==========
  ensureGlobalStarfield();
  // executes this operation step as part of the flow
  fetchCurrentUser();
}