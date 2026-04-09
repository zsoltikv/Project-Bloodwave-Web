// leaderboard page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/Leaderboard.css";
// imports dependencies used by this module
import { API_BASE, getUser, logout, authFetch } from "../services/auth.js";
// imports dependencies used by this module
import { confirmLogout } from "../effects/logout-confirm.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";

// exports the main function for this module
export default function Leaderboard(container) {
  // declares mutable state used in this scope
  let leaderboardRows = [];
  // declares mutable state used in this scope
  let leaderboardSort = "rank";
  // executes this operation step as part of the flow
  container.innerHTML = `
    

    <div class="lb-root">
      <div class="lb-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="lb-nav">
        <div class="lb-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="lb-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="lb-links">
            <a href="/main" data-link class="lb-link"><span>Matches</span></a>
            <a href="/stats" data-link class="lb-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="lb-link active"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="lb-link"><span>Achievements</span></a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="lb-right">

            <!-- Profile Avatar + dropdown (desktop) -->
            <div class="lb-avatar-wrap">
              <button class="lb-avatar" id="lb-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="lb-avatar-dropdown" id="lb-avatar-dropdown" role="menu">
                <div class="lb-dd-header">
                  <div class="lb-dd-username" id="lb-dd-username">—</div>
                  <div class="lb-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <a href="/backend-status" data-link class="lb-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5 8.25 9l3 3 4.5-6 4.5 7.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 19.5h16.5" />
                  </svg>
                  API Status
                </a>
                <div class="lb-dd-divider"></div>
                <button class="lb-dd-item logout" id="lb-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Hamburger (mobile) -->
            <button class="lb-hamburger" id="lb-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
            </button>
          </div>

        </div>

        <!-- Mobile Dropdown -->
        <div class="lb-mobile-menu" id="lb-mobile-menu">
          <div class="lb-mobile-menu-inner">
            <a href="/main" data-link class="lb-mobile-link">Matches</a>
            <a href="/stats" data-link class="lb-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="lb-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="lb-mobile-link">Achievements</a>
            <div class="lb-mobile-divider"></div>
            <div class="lb-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="lb-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="lb-mobile-username">—</span>
            </div>
            <div class="lb-mobile-divider"></div>
            <a href="/user-panel" data-link class="lb-mobile-link">Profile</a>
            <a href="/android-download" data-link class="lb-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="lb-mobile-link">API Status</a>
            <button class="lb-mobile-logout" id="lb-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="lb-content">
        <div class="lb-inner">

          <!-- Header -->
          <div class="lb-header">
            <div class="lb-ornament">
              <div class="lb-ornament-line"></div>
              <div class="lb-ornament-diamond"></div>
              <div class="lb-ornament-line"></div>
            </div>
            <h1 class="lb-title">Global Leaderboard</h1>
            <p class="lb-subtitle">Worldwide&nbsp;&nbsp;rankings</p>
            <div class="lb-toolbar">
              <label class="lb-sort" for="lb-sort-select">
                <span class="lb-sort-label">Order By</span>
                <select class="lb-sort-select" id="lb-sort-select" aria-label="Sort leaderboard">
                  <option value="rank">Rank</option>
                  <option value="level-desc">Highest Level</option>
                  <option value="time-asc">Fastest Time</option>
                  <option value="time-desc">Longest Time</option>
                  <option value="name-asc">Username A-Z</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Leaderboard Grid -->
          <div class="lb-grid" id="lb-grid">
            <div class="lb-loading">Loading leaderboard...</div>
          </div>

        </div>
      </main>
    </div>
  `;

  // ========== CANVAS ANIMATION ==========
  function initLbCanvas() {
    // declares a constant used in this scope
    const canvas = document.getElementById("lb-canvas");
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

  // ========== NAVBAR SETUP ==========
  const user = getUser();
  // declares a constant used in this scope
  const sortSelect = document.getElementById("lb-sort-select");
  // executes this operation step as part of the flow
  document.getElementById("lb-dd-username").textContent = user?.username || "—";
  // executes this operation step as part of the flow
  document.getElementById("lb-mobile-username").textContent =
    // executes this operation step as part of the flow
    user?.username || "—";
  // executes this operation step as part of the flow
  refreshNavbarUsername();

  async function refreshNavbarUsername() {
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
      if (!res.ok) return;

      // declares a constant used in this scope
      const userData = await res.json();
      // declares a constant used in this scope
      const liveDisplayName =
        // executes this operation step as part of the flow
        userData?.username ?? userData?.email ?? user?.username ?? "—";

      // declares a constant used in this scope
      const ddUsernameEl = document.getElementById("lb-dd-username");
      // declares a constant used in this scope
      const mobileUsernameEl = document.getElementById("lb-mobile-username");
      // checks a condition before executing this branch
      if (ddUsernameEl) ddUsernameEl.textContent = liveDisplayName;
      // checks a condition before executing this branch
      if (mobileUsernameEl) mobileUsernameEl.textContent = liveDisplayName;
    } catch {
      // Keep cached display name on fetch failure.
    }
  }

  // declares a constant used in this scope
  const hamburger = document.getElementById("lb-hamburger");
  // declares a constant used in this scope
  const mobileMenu = document.getElementById("lb-mobile-menu");
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
  mobileMenu?.querySelectorAll(".lb-mobile-link").forEach((link) => {
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

  // Avatar dropdown
  const avatarBtn = document.getElementById("lb-avatar-btn");
  // declares a constant used in this scope
  const avatarDropdown = document.getElementById("lb-avatar-dropdown");
  // attaches a dom event listener for user interaction
  avatarBtn?.addEventListener("click", () => {
    // executes this operation step as part of the flow
    avatarDropdown.classList.toggle("open");
    avatarBtn.setAttribute(
      "aria-expanded",
      String(avatarDropdown.classList.contains("open")),
    );
  });

  // attaches a dom event listener for user interaction
  document.addEventListener("click", (e) => {
    // checks a condition before executing this branch
    if (!e.target.closest(".lb-avatar-wrap")) {
      // executes this operation step as part of the flow
      avatarDropdown?.classList.remove("open");
      // executes this operation step as part of the flow
      avatarBtn?.setAttribute("aria-expanded", "false");
    }
  });

  // declares a constant used in this scope
  const doLogout = async () => {
    // declares a constant used in this scope
    const confirmed = await confirmLogout();
    // checks a condition before executing this branch
    if (!confirmed) return;

    // waits for an asynchronous operation to complete
    await logout();
    // checks a condition before executing this branch
    if (window.router?.navigate) {
      // executes this operation step as part of the flow
      window.router.navigate("/login");
      // returns a value from the current function
      return;
    }
    // executes this operation step as part of the flow
    window.location.href = "/login";
  };

  // attaches a dom event listener for user interaction
  document.getElementById("lb-dd-logout")?.addEventListener("click", doLogout);
  document
    .getElementById("lb-mobile-logout")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", doLogout);

  // attaches a dom event listener for user interaction
  sortSelect?.addEventListener("change", (event) => {
    // executes this operation step as part of the flow
    leaderboardSort = event.target.value || "rank";
    // executes this operation step as part of the flow
    renderLeaderboard();
  });

  // ========== FETCH LEADERBOARD DATA ==========
  async function loadLeaderboard() {
    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const currentUserContext = await resolveCurrentUserContext(user);

      // declares a constant used in this scope
      const response = await authFetch(`${API_BASE}/api/Match`, {
        // sets a named field inside an object or configuration block
        method: "GET",
        // sets a named field inside an object or configuration block
        headers: { Accept: "application/json" },
      });
      // checks a condition before executing this branch
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      // declares a constant used in this scope
      const matches = await response.json();
      // declares a constant used in this scope
      const baseRows = buildLeaderboardRows(matches, currentUserContext);
      // waits for an asynchronous operation to complete
      leaderboardRows = await hydrateLeaderboardRows(
        baseRows,
        currentUserContext,
      );
      // executes this operation step as part of the flow
      renderLeaderboard();
    } catch (error) {
      // executes this operation step as part of the flow
      console.error("Leaderboard error:", error);
      // executes this operation step as part of the flow
      document.getElementById("lb-grid").innerHTML =
        // executes this operation step as part of the flow
        '<div class="lb-empty">Failed to load leaderboard</div>';
    }
  }

  // declares a helper function for a focused task
  function renderLeaderboard() {
    // declares a constant used in this scope
    const grid = document.getElementById("lb-grid");
    // checks a condition before executing this branch
    if (!grid) return;

    // executes this operation step as part of the flow
    grid.innerHTML = "";

    // checks a condition before executing this branch
    if (!leaderboardRows.length) {
      // executes this operation step as part of the flow
      grid.innerHTML = '<div class="lb-empty">No players yet</div>';
      // returns a value from the current function
      return;
    }

    // declares a constant used in this scope
    const sortedRows = sortLeaderboardRows(leaderboardRows, leaderboardSort);

    // defines an arrow function used by surrounding logic
    sortedRows.forEach((entry, index) => {
      // declares a constant used in this scope
      const card = document.createElement("div");
      // executes this operation step as part of the flow
      card.className = "lb-card";
      // checks a condition before executing this branch
      if (leaderboardSort === "rank" && index < 3)
        // executes this operation step as part of the flow
        card.classList.add(`lb-rank-${index + 1}`);
      // checks a condition before executing this branch
      if (entry.isCurrentUser) card.classList.add("lb-card-you");

      // declares a constant used in this scope
      const medal =
        // executes this operation step as part of the flow
        leaderboardSort === "rank"
          // executes this operation step as part of the flow
          ? index === 0
            ? "👑"
            // executes this operation step as part of the flow
            : index === 1
              ? "🥈"
              // executes this operation step as part of the flow
              : index === 2
                ? "🥉"
                : `${index + 1}.`
          // executes this operation step as part of the flow
          : `${index + 1}.`;

      // executes this operation step as part of the flow
      card.innerHTML = `
        <div class="lb-card-corner lb-card-corner--tl"></div>
        <div class="lb-card-corner lb-card-corner--tr"></div>
        <div class="lb-card-corner lb-card-corner--bl"></div>
        <div class="lb-card-corner lb-card-corner--br"></div>
        <div class="lb-card-body">
          <div class="lb-card-rank">${medal}</div>
          <div class="lb-card-username-wrap">
            <div class="lb-card-username" data-user-id="${entry.userId}">${escapeHtml(entry.username)}</div>
            <span class="lb-you-badge ${entry.isCurrentUser ? "" : "is-hidden"}">YOU</span>
          </div>
          <div class="lb-card-sep"></div>
          <div class="lb-card-stats">
            <div class="lb-stat">
              <span class="lb-stat-label">Level</span>
              <span class="lb-stat-value js-lb-count" data-type="int" data-target="${entry.level || 0}">${entry.level || 0}</span>
            </div>
            <div class="lb-stat">
              <span class="lb-stat-label">Run Time</span>
              <span class="lb-stat-value js-lb-count" data-type="time-hm" data-target="${Math.max(0, Math.round(entry.runTimeMs || 0))}">${formatTime(entry.runTimeMs || 0)}</span>
            </div>
          </div>
        </div>
      `;

      // checks a condition before executing this branch
      if (!entry.isCurrentUser) {
        // executes this operation step as part of the flow
        card.classList.add("lb-card--clickable");
        // attaches a dom event listener for user interaction
        card.addEventListener("click", () => {
          window.router?.navigate(
            // executes this operation step as part of the flow
            `/main?userId=${encodeURIComponent(entry.userId)}`,
          );
        });
      } else {
        // executes this operation step as part of the flow
        card.setAttribute("aria-disabled", "true");
        // executes this operation step as part of the flow
        card.style.cursor = "default";
      }

      // executes this operation step as part of the flow
      grid.appendChild(card);
    });

    // executes this operation step as part of the flow
    animateLbStats(grid);
  }

  // declares a helper function for a focused task
  function normalizeRunTimeMs(rawTime) {
    // declares a constant used in this scope
    const numeric = Number(rawTime);
    // checks a condition before executing this branch
    if (!Number.isFinite(numeric) || numeric < 0) return 0;

    // Backend currently sends milliseconds. Keep a fallback for second-based values.
    if (numeric < 10000) return numeric * 1000;
    // returns a value from the current function
    return numeric;
  }

  // declares a helper function for a focused task
  function compareByRank(a, b) {
    // checks a condition before executing this branch
    if (b.level !== a.level) return b.level - a.level;
    // checks a condition before executing this branch
    if (a.runTimeMs !== b.runTimeMs) return a.runTimeMs - b.runTimeMs;
    // returns a value from the current function
    return a.username.localeCompare(b.username);
  }

  // declares a helper function for a focused task
  function resolveUsername(matchEntry, currentUser) {
    // checks a condition before executing this branch
    if (matchEntry?.username) return String(matchEntry.username);
    // checks a condition before executing this branch
    if (matchEntry?.user?.username) return String(matchEntry.user.username);

    // declares a constant used in this scope
    const userId = Number(matchEntry?.userId);
    // checks a condition before executing this branch
    if (currentUser?.id === userId && currentUser?.username) {
      // returns a value from the current function
      return currentUser.username;
    }

    // returns a value from the current function
    return `User #${userId || "Unknown"}`;
  }

  // declares a helper function for a focused task
  function resolveCurrentUserId(currentUser) {
    // declares a constant used in this scope
    const candidates = [
      currentUser?.id,
      currentUser?.userId,
      currentUser?.playerId,
      currentUser?.Id,
      currentUser?.UserId,
      currentUser?.PlayerId,
    ];
    // iterates through a sequence of values
    for (const candidate of candidates) {
      // declares a constant used in this scope
      const parsed = Number(candidate);
      // checks a condition before executing this branch
      if (Number.isInteger(parsed) && parsed > 0) {
        // returns a value from the current function
        return parsed;
      }
    }

    // returns a value from the current function
    return null;
  }

  // declares a helper function for a focused task
  function normalizeUsername(value) {
    // checks a condition before executing this branch
    if (!value) return "";
    // returns a value from the current function
    return String(value).trim().toLowerCase();
  }

  // declares a helper function for a focused task
  function isSameUsername(left, right) {
    // declares a constant used in this scope
    const leftNorm = normalizeUsername(left);
    // declares a constant used in this scope
    const rightNorm = normalizeUsername(right);
    // returns a value from the current function
    return Boolean(leftNorm) && Boolean(rightNorm) && leftNorm === rightNorm;
  }

  async function resolveCurrentUserContext(cachedUser) {
    // declares a constant used in this scope
    const fallback = {
      // sets a named field inside an object or configuration block
      id: resolveCurrentUserId(cachedUser),
      // sets a named field inside an object or configuration block
      username: cachedUser?.username || cachedUser?.email || null,
    };

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
      if (!res.ok) return fallback;

      // declares a constant used in this scope
      const me = await res.json();
      // declares a constant used in this scope
      const meContext = {
        // sets a named field inside an object or configuration block
        id: resolveCurrentUserId(me),
        // sets a named field inside an object or configuration block
        username: me?.username || me?.email || fallback.username,
      };

      // returns a value from the current function
      return {
        // sets a named field inside an object or configuration block
        id: meContext.id ?? fallback.id,
        // sets a named field inside an object or configuration block
        username: meContext.username,
      };
    } catch {
      // returns a value from the current function
      return fallback;
    }
  }

  // declares a helper function for a focused task
  function buildLeaderboardRows(matches, currentUser) {
    // checks a condition before executing this branch
    if (!Array.isArray(matches)) return [];

    // declares a constant used in this scope
    const currentUserId = resolveCurrentUserId(currentUser);
    // declares a constant used in this scope
    const bestByUserId = new Map();

    // defines an arrow function used by surrounding logic
    matches.forEach((matchEntry) => {
      // declares a constant used in this scope
      const userId = Number(matchEntry?.userId);
      // checks a condition before executing this branch
      if (!Number.isFinite(userId)) return;

      // declares a constant used in this scope
      const candidate = {
        userId,
        // sets a named field inside an object or configuration block
        username: resolveUsername(matchEntry, currentUser),
        // sets a named field inside an object or configuration block
        level: Number(matchEntry?.level) || 0,
        // sets a named field inside an object or configuration block
        runTimeMs: normalizeRunTimeMs(matchEntry?.time),
        // sets a named field inside an object or configuration block
        isCurrentUser: currentUserId !== null && userId === currentUserId,
      };

      // declares a constant used in this scope
      const existing = bestByUserId.get(userId);
      // checks a condition before executing this branch
      if (!existing || compareByRank(candidate, existing) < 0) {
        // executes this operation step as part of the flow
        bestByUserId.set(userId, candidate);
      }
    });

    // returns a value from the current function
    return Array.from(bestByUserId.values()).sort(compareByRank);
  }

  async function hydrateLeaderboardRows(rows, currentUserContext) {
    // checks a condition before executing this branch
    if (!Array.isArray(rows) || !rows.length) return [];

    // returns a value from the current function
    return Promise.all(
      // defines an arrow function used by surrounding logic
      rows.map(async (row) => {
        // starts guarded logic to catch runtime errors
        try {
          // declares a constant used in this scope
          const res = await authFetch(
            // executes this operation step as part of the flow
            `${API_BASE}/api/User/name?id=${encodeURIComponent(row.userId)}`,
            {
              // sets a named field inside an object or configuration block
              method: "GET",
              // sets a named field inside an object or configuration block
              headers: { Accept: "application/json" },
            },
          );
          // checks a condition before executing this branch
          if (!res.ok) throw new Error("User not found");

          // declares a constant used in this scope
          const data = await res.json();
          // declares a constant used in this scope
          const username =
            // executes this operation step as part of the flow
            data?.username || row.username || `User #${row.userId}`;
          // returns a value from the current function
          return {
            ...row,
            username,
            // sets a named field inside an object or configuration block
            isCurrentUser:
              row.isCurrentUser ||
              isSameUsername(username, currentUserContext?.username),
          };
        } catch {
          // returns a value from the current function
          return {
            ...row,
            // sets a named field inside an object or configuration block
            username: row.username || `User #${row.userId}`,
          };
        }
      }),
    );
  }

  // declares a helper function for a focused task
  function sortLeaderboardRows(rows, sortKey) {
    // declares a constant used in this scope
    const normalizedRows = Array.isArray(rows) ? [...rows] : [];

    // switches behavior based on the current value
    switch (sortKey) {
      // handles one specific switch case
      case "level-desc":
        // returns a value from the current function
        return normalizedRows.sort((a, b) => {
          // checks a condition before executing this branch
          if (b.level !== a.level) return b.level - a.level;
          // checks a condition before executing this branch
          if (b.runTimeMs !== a.runTimeMs) return b.runTimeMs - a.runTimeMs;
          // returns a value from the current function
          return a.username.localeCompare(b.username);
        });
      // handles one specific switch case
      case "time-asc":
        // returns a value from the current function
        return normalizedRows.sort((a, b) => {
          // checks a condition before executing this branch
          if (a.runTimeMs !== b.runTimeMs) return a.runTimeMs - b.runTimeMs;
          // checks a condition before executing this branch
          if (b.level !== a.level) return b.level - a.level;
          // returns a value from the current function
          return a.username.localeCompare(b.username);
        });
      // handles one specific switch case
      case "time-desc":
        // returns a value from the current function
        return normalizedRows.sort((a, b) => {
          // checks a condition before executing this branch
          if (b.runTimeMs !== a.runTimeMs) return b.runTimeMs - a.runTimeMs;
          // checks a condition before executing this branch
          if (b.level !== a.level) return b.level - a.level;
          // returns a value from the current function
          return a.username.localeCompare(b.username);
        });
      // handles one specific switch case
      case "name-asc":
        // returns a value from the current function
        return normalizedRows.sort((a, b) => {
          // declares a constant used in this scope
          const byName = a.username.localeCompare(b.username);
          // checks a condition before executing this branch
          if (byName !== 0) return byName;
          // returns a value from the current function
          return compareByRank(a, b);
        });
      // handles one specific switch case
      case "rank":
      // handles the default switch case
      default:
        // returns a value from the current function
        return normalizedRows.sort(compareByRank);
    }
  }

  // declares a helper function for a focused task
  function formatTime(timeMs) {
    // declares a constant used in this scope
    const totalSeconds = Math.max(0, Math.round(Number(timeMs || 0) / 1000));
    // declares a constant used in this scope
    const hours = Math.floor(totalSeconds / 3600);
    // declares a constant used in this scope
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // declares a constant used in this scope
    const seconds = totalSeconds % 60;

    // checks a condition before executing this branch
    if (hours > 0) return `${hours}h ${minutes}m`;
    // checks a condition before executing this branch
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    // returns a value from the current function
    return `${seconds}s`;
  }

  // declares a helper function for a focused task
  function escapeHtml(value) {
    // returns a value from the current function
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      // executes this operation step as part of the flow
      .replace(/'/g, "&#39;");
  }

  // declares a helper function for a focused task
  function animateLbStats(container) {
    // declares a constant used in this scope
    const valueEls = container.querySelectorAll(".js-lb-count");
    // checks a condition before executing this branch
    if (!valueEls.length) return;

    // declares a constant used in this scope
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // declares a constant used in this scope
    const formatInt = (value) => Math.round(value).toLocaleString("en-US");

    // defines an arrow function used by surrounding logic
    valueEls.forEach((el, index) => {
      // declares a constant used in this scope
      const type = el.dataset.type || "int";
      // declares a constant used in this scope
      const targetValue = Number(el.dataset.target);
      // checks a condition before executing this branch
      if (!Number.isFinite(targetValue)) return;

      // declares a constant used in this scope
      const startDelay = 140 + index * 48;
      // declares a constant used in this scope
      const duration = type === "time-hm" ? 980 : 860;
      // declares a constant used in this scope
      const startValue = 0;

      // declares a constant used in this scope
      const render = (value) => {
        // checks a condition before executing this branch
        if (type === "time-hm") {
          // executes this operation step as part of the flow
          el.textContent = formatTime(value);
          // returns a value from the current function
          return;
        }
        // executes this operation step as part of the flow
        el.textContent = formatInt(value);
      };

      // executes this operation step as part of the flow
      el.classList.add("is-counting");
      // executes this operation step as part of the flow
      render(startValue);

      // declares a constant used in this scope
      const run = () => {
        // declares a constant used in this scope
        const startTs = performance.now();

        // declares a constant used in this scope
        const step = (now) => {
          // declares a constant used in this scope
          const progress = Math.min(1, (now - startTs) / duration);
          // declares a constant used in this scope
          const eased = easeOutCubic(progress);
          // declares a constant used in this scope
          const current = startValue + (targetValue - startValue) * eased;
          // executes this operation step as part of the flow
          render(current);

          // checks a condition before executing this branch
          if (progress < 1) {
            // executes this operation step as part of the flow
            requestAnimationFrame(step);
            // returns a value from the current function
            return;
          }

          // executes this operation step as part of the flow
          render(targetValue);
          // executes this operation step as part of the flow
          el.classList.remove("is-counting");
        };

        // executes this operation step as part of the flow
        requestAnimationFrame(step);
      };

      // executes this operation step as part of the flow
      window.setTimeout(run, startDelay);
    });
  }

  // ========== INIT ==========
  ensureGlobalStarfield();
  // executes this operation step as part of the flow
  loadLeaderboard();
}