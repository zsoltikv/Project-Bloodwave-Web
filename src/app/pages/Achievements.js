// imports dependencies used by this module
import "../../styles/pages/Leaderboard.css";
// imports dependencies used by this module
import "../../styles/pages/Achievements.css";
// imports dependencies used by this module
import { API_BASE, getUser, logout, authFetch } from "../services/auth.js";
// imports dependencies used by this module
import { confirmLogout } from "../effects/logout-confirm.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";

// achievements page: loads and renders game achievements
// includes helper functions for image lookup, formatting and ui rendering


const ACHIEVEMENT_IMAGE_MODULES = import.meta.glob(
  "../../assets/achievements/*",
  {
    // sets a named field inside an object or configuration block
    eager: true,
    // sets a named field inside an object or configuration block
    import: "default",
  },
);

// declares a constant used in this scope
const ACHIEVEMENT_IMAGE_BY_KEY = Object.entries(
  ACHIEVEMENT_IMAGE_MODULES,
// defines an arrow function used by surrounding logic
).reduce((acc, [path, url]) => {
  // declares a constant used in this scope
  const fileName = path.split("/").pop() || "";
  // declares a constant used in this scope
  const key = fileName.replace(/\.[^.]+$/, "").toLowerCase();
  // executes this operation step as part of the flow
  acc.set(key, url);
  // returns a value from the current function
  return acc;
// executes this operation step as part of the flow
}, new Map());

// declares a constant used in this scope
const ACHIEVEMENT_IMAGE_KEY_BY_ID = {
  // sets a named field inside an object or configuration block
  1: "first_time_player",
  // sets a named field inside an object or configuration block
  2: "movie_buff",
  // sets a named field inside an object or configuration block
  3: "first_pause",
  // sets a named field inside an object or configuration block
  4: "first_restart",
  // sets a named field inside an object or configuration block
  5: "first_save",
  // sets a named field inside an object or configuration block
  6: "first_steps",
  // sets a named field inside an object or configuration block
  7: "first_blood",
  // sets a named field inside an object or configuration block
  8: "slayer_10",
  // sets a named field inside an object or configuration block
  9: "slayer_50",
  // sets a named field inside an object or configuration block
  10: "mass_murderer",
  // sets a named field inside an object or configuration block
  11: "multi_kill_10",
  // sets a named field inside an object or configuration block
  12: "multi_kill_20",
  // sets a named field inside an object or configuration block
  13: "no_hit_2min",
  // sets a named field inside an object or configuration block
  14: "tank_500",
  // sets a named field inside an object or configuration block
  15: "die_fast_15s",
  // sets a named field inside an object or configuration block
  16: "no_pause_run",
  // sets a named field inside an object or configuration block
  17: "afk_30s",
  // sets a named field inside an object or configuration block
  18: "survivor_5min",
  // sets a named field inside an object or configuration block
  19: "survivor_10min",
  // sets a named field inside an object or configuration block
  20: "survivor_15min",
  // sets a named field inside an object or configuration block
  21: "survivor_30min",
  // sets a named field inside an object or configuration block
  22: "level_5",
  // sets a named field inside an object or configuration block
  23: "level_10",
  // sets a named field inside an object or configuration block
  24: "level_15",
  // sets a named field inside an object or configuration block
  25: "level_20",
  // sets a named field inside an object or configuration block
  26: "level_25",
  // sets a named field inside an object or configuration block
  27: "level_50",
  // sets a named field inside an object or configuration block
  28: "first_weapon_upgrade",
  // sets a named field inside an object or configuration block
  29: "upgrade_damage_once",
  // sets a named field inside an object or configuration block
  30: "upgrade_projectiles_once",
  // sets a named field inside an object or configuration block
  31: "upgrade_cooldown_once",
  // sets a named field inside an object or configuration block
  32: "upgrade_range_once",
  // sets a named field inside an object or configuration block
  33: "upgrade_orbitalspeed_once",
  // sets a named field inside an object or configuration block
  34: "weapon_level_5",
  // sets a named field inside an object or configuration block
  35: "weapon_level_10",
  // sets a named field inside an object or configuration block
  36: "projectiles_bonus_3",
  // sets a named field inside an object or configuration block
  37: "cooldown_50",
  // sets a named field inside an object or configuration block
  38: "range_150",
  // sets a named field inside an object or configuration block
  39: "orbitalspeed_200",
  // sets a named field inside an object or configuration block
  40: "rich",
  // sets a named field inside an object or configuration block
  41: "shopaholic",
  // sets a named field inside an object or configuration block
  42: "shop_clear_10",
  // sets a named field inside an object or configuration block
  43: "collector",
  // sets a named field inside an object or configuration block
  44: "big_spender",
  // sets a named field inside an object or configuration block
  45: "arsenal",
  // sets a named field inside an object or configuration block
  46: "orbit_master",
  // sets a named field inside an object or configuration block
  47: "music_lover",
  // sets a named field inside an object or configuration block
  48: "unlock_10_achievements",
  // sets a named field inside an object or configuration block
  49: "unlock_25_achievements",
  // sets a named field inside an object or configuration block
  50: "completionist",
};

// exports the main function for this module
export default function Achievements(container) {
  // render the achievements ui into the provided container
  // set up interactions, fetch data and manage view state
  let achievementView = "unlocked-first";
  // declares mutable state used in this scope
  let cachedAchievements = [];
  // declares mutable state used in this scope
  let cachedUnlockedMap = new Map();
  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="lb-root">
      <div class="lb-glow"></div>

      <nav class="lb-nav">
        <div class="lb-nav-inner">
          <a href="/" data-link class="lb-logo">Bloodwave</a>

          <div class="lb-links">
            <a href="/main" data-link class="lb-link"><span>Matches</span></a>
            <a href="/stats" data-link class="lb-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="lb-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="lb-link active"><span>Achievements</span></a>
          </div>

          <div class="lb-right">
            <div class="lb-avatar-wrap">
              <button class="lb-avatar" id="ac-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="lb-avatar-dropdown" id="ac-avatar-dropdown" role="menu">
                <div class="lb-dd-header">
                  <div class="lb-dd-username" id="ac-dd-username">-</div>
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
                <button class="lb-dd-item logout" id="ac-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <button class="lb-hamburger" id="ac-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
              <span class="lb-bar"></span>
            </button>
          </div>
        </div>

        <div class="lb-mobile-menu" id="ac-mobile-menu">
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
              <span id="ac-mobile-username">-</span>
            </div>
            <div class="lb-mobile-divider"></div>
            <a href="/user-panel" data-link class="lb-mobile-link">Profile</a>
            <a href="/android-download" data-link class="lb-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="lb-mobile-link">API Status</a>
            <button class="lb-mobile-logout" id="ac-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main class="lb-content">
        <div class="ach-inner">
          <div class="lb-header">
            <div class="lb-ornament">
              <div class="lb-ornament-line"></div>
              <div class="lb-ornament-diamond"></div>
              <div class="lb-ornament-line"></div>
            </div>
            <h1 class="lb-title">Achievements</h1>
            <p class="lb-subtitle">Track your unlocked milestones</p>
            <div class="ach-toolbar">
              <label class="ach-control ach-sort" for="ac-view-select">
                <span class="ach-control-label">Browse By</span>
                <select class="ach-control-select ach-sort-select" id="ac-view-select" aria-label="Browse achievements">
                  <option value="all">All Achievements</option>
                  <option value="unlocked-only">Unlocked Only</option>
                  <option value="locked-only">Locked Only</option>
                  <option value="unlocked-first">Unlocked First</option>
                  <option value="recent-unlocked">Recently Unlocked</option>
                </select>
              </label>
            </div>
          </div>

          <section class="ach-summary" id="ac-summary"></section>
          <section class="ach-grid" id="ac-grid" aria-live="polite"></section>
        </div>
      </main>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const user = getUser();
  // declares a constant used in this scope
  const fallbackDisplayName = user?.username ?? user?.email ?? "Member";
  // declares a constant used in this scope
  const viewSelect = container.querySelector("#ac-view-select");

  // declares a constant used in this scope
  const ddUsernameEl = container.querySelector("#ac-dd-username");
  // declares a constant used in this scope
  const mobileUsernameEl = container.querySelector("#ac-mobile-username");
  // checks a condition before executing this branch
  if (ddUsernameEl) ddUsernameEl.textContent = fallbackDisplayName;
  // checks a condition before executing this branch
  if (mobileUsernameEl) mobileUsernameEl.textContent = fallbackDisplayName;

  // declares a constant used in this scope
  const hamburger = container.querySelector("#ac-hamburger");
  // declares a constant used in this scope
  const mobileMenu = container.querySelector("#ac-mobile-menu");
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
    // checks a condition before executing this branch
    if (mobileMenu) {
      // executes this operation step as part of the flow
      mobileMenu.style.maxHeight = mobileMenuOpen
        ? `${mobileMenu.scrollHeight}px`
        // executes this operation step as part of the flow
        : "0";
    }
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
      // checks a condition before executing this branch
      if (mobileMenu) mobileMenu.style.maxHeight = "0";
    });
  });

  // declares a constant used in this scope
  const avatarBtn = container.querySelector("#ac-avatar-btn");
  // declares a constant used in this scope
  const avatarDropdown = container.querySelector("#ac-avatar-dropdown");

  // attaches a dom event listener for user interaction
  avatarBtn?.addEventListener("click", () => {
    // executes this operation step as part of the flow
    avatarDropdown?.classList.toggle("open");
    avatarBtn.setAttribute(
      "aria-expanded",
      String(avatarDropdown?.classList.contains("open")),
    );
  });

  // attaches a dom event listener for user interaction
  document.addEventListener("click", (event) => {
    // checks a condition before executing this branch
    if (!event.target.closest(".lb-avatar-wrap")) {
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
  container.querySelector("#ac-dd-logout")?.addEventListener("click", doLogout);
  container
    .querySelector("#ac-mobile-logout")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", doLogout);

  // attaches a dom event listener for user interaction
  viewSelect?.addEventListener("change", (event) => {
    // executes this operation step as part of the flow
    achievementView = event.target.value || "unlocked-first";
    // executes this operation step as part of the flow
    renderAchievements(cachedAchievements, cachedUnlockedMap);
  });

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
        userData?.username ?? userData?.email ?? fallbackDisplayName;

      // checks a condition before executing this branch
      if (ddUsernameEl) ddUsernameEl.textContent = liveDisplayName;
      // checks a condition before executing this branch
      if (mobileUsernameEl) mobileUsernameEl.textContent = liveDisplayName;
    } catch {
      // Keep cached name if the request fails.
    }
  }

  // declares a helper function for a focused task
  function escapeHtml(value) {
    // declares a constant used in this scope
    const span = document.createElement("span");
    // executes this operation step as part of the flow
    span.textContent = String(value ?? "");
    // returns a value from the current function
    return span.innerHTML;
  }

  // normalize raw achievement text coming from the api
  // removes surrounding quotes and unescapes quoted characters
  function normalizeAchievementText(value) {
    // checks a condition before executing this branch
    if (typeof value !== "string") return "";

    // declares mutable state used in this scope
    let text = value.trim();
    // checks a condition before executing this branch
    if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
      // executes this operation step as part of the flow
      text = text.slice(1, -1);
    }

    // returns a value from the current function
    return text.replace(/\\"/g, '"').trim();
  }

  
  // convert a title string into a filesystem-like key used for image lookup
  // lowercases, replaces non-alphanumerics with underscores and trims extra underscores
  function makeTitleImageKey(value) {
    // returns a value from the current function
    return normalizeAchievementText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      // executes this operation step as part of the flow
      .replace(/^_+|_+$/g, "");
  }

  
  // resolve an appropriate image url for an achievement
  // first try a hardcoded id→key map, then fall back to a title-derived key
  function getAchievementImageUrl(achievement) {
    // declares a constant used in this scope
    const achievementId = Number(achievement?.id);
    // declares a constant used in this scope
    const idKey = ACHIEVEMENT_IMAGE_KEY_BY_ID[achievementId];
    // checks a condition before executing this branch
    if (idKey && ACHIEVEMENT_IMAGE_BY_KEY.has(idKey)) {
      // returns a value from the current function
      return ACHIEVEMENT_IMAGE_BY_KEY.get(idKey);
    }

    // declares a constant used in this scope
    const titleKey = makeTitleImageKey(achievement?.title);
    // checks a condition before executing this branch
    if (titleKey && ACHIEVEMENT_IMAGE_BY_KEY.has(titleKey)) {
      // returns a value from the current function
      return ACHIEVEMENT_IMAGE_BY_KEY.get(titleKey);
    }

    // returns a value from the current function
    return "";
  }

  // parse and format an iso timestamp into a localized human readable string
  // returns empty string for invalid or missing values
  function formatUnlockedAt(isoDate) {
    // declares a constant used in this scope
    const raw = typeof isoDate === "string" ? isoDate.trim() : "";
    // checks a condition before executing this branch
    if (!raw) return "";

    // declares a constant used in this scope
    const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
    // declares a constant used in this scope
    const normalized = hasTimezone ? raw : `${raw}Z`;
    // declares a constant used in this scope
    const parsedDate = new Date(normalized);

    // checks a condition before executing this branch
    if (Number.isNaN(parsedDate.getTime())) return "";

    // returns a value from the current function
    return new Intl.DateTimeFormat("hu-HU", {
      // sets a named field inside an object or configuration block
      year: "numeric",
      // sets a named field inside an object or configuration block
      month: "2-digit",
      // sets a named field inside an object or configuration block
      day: "2-digit",
      // sets a named field inside an object or configuration block
      hour: "2-digit",
      // sets a named field inside an object or configuration block
      minute: "2-digit",
      // sets a named field inside an object or configuration block
      timeZone: "Europe/Budapest",
    // executes this operation step as part of the flow
    }).format(parsedDate);
  }

  // render the small summary cards (total, unlocked, locked, progress)
  function renderSummary(total, unlocked) {
    // declares a constant used in this scope
    const summaryEl = container.querySelector("#ac-summary");
    // checks a condition before executing this branch
    if (!summaryEl) return;

    // declares a constant used in this scope
    const locked = Math.max(0, total - unlocked);
    // declares a constant used in this scope
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    // executes this operation step as part of the flow
    summaryEl.innerHTML = `
      <article class="ach-summary-card">
        <span class="ach-summary-label">Total</span>
        <span class="ach-summary-value">${total}</span>
      </article>
      <article class="ach-summary-card is-unlocked">
        <span class="ach-summary-label">Unlocked</span>
        <span class="ach-summary-value">${unlocked}</span>
      </article>
      <article class="ach-summary-card is-locked">
        <span class="ach-summary-label">Locked</span>
        <span class="ach-summary-value">${locked}</span>
      </article>
      <article class="ach-summary-card is-progress">
        <span class="ach-summary-label">Progress</span>
        <span class="ach-summary-value">${percentage}%</span>
      </article>
    `;
  }

  // render a loading placeholder into the achievements grid
  function renderLoading() {
    // declares a constant used in this scope
    const gridEl = container.querySelector("#ac-grid");
    // checks a condition before executing this branch
    if (!gridEl) return;
    // executes this operation step as part of the flow
    gridEl.innerHTML = '<div class="ach-loading">Loading achievements...</div>';
  }

  // render an error message with a retry button into the grid area
  function renderError(message) {
    // declares a constant used in this scope
    const gridEl = container.querySelector("#ac-grid");
    // checks a condition before executing this branch
    if (!gridEl) return;
    // executes this operation step as part of the flow
    gridEl.innerHTML = `
      <div class="ach-error">
        <p>${escapeHtml(message)}</p>
        <button type="button" class="ach-retry" id="ac-retry">Retry</button>
      </div>
    `;

    // declares a constant used in this scope
    const retryBtn = gridEl.querySelector("#ac-retry");
    // attaches a dom event listener for user interaction
    retryBtn?.addEventListener("click", loadAchievements);
  }

  // declares a helper function for a focused task
  function renderAchievements(achievements, unlockedMap) {
    // declares a constant used in this scope
    const gridEl = container.querySelector("#ac-grid");
    // checks a condition before executing this branch
    if (!gridEl) return;

    // checks a condition before executing this branch
    if (!Array.isArray(achievements) || achievements.length === 0) {
      // executes this operation step as part of the flow
      gridEl.innerHTML =
        // executes this operation step as part of the flow
        '<div class="ach-loading">No achievements available.</div>';
      // executes this operation step as part of the flow
      renderSummary(0, 0);
      // returns a value from the current function
      return;
    }

    // declares a constant used in this scope
    const unlockedCount = achievements.reduce((count, achievement) => {
      // returns a value from the current function
      return count + (unlockedMap.has(Number(achievement.id)) ? 1 : 0);
    // executes this operation step as part of the flow
    }, 0);
    // declares a constant used in this scope
    const sorted = applyAchievementView(
      achievements,
      unlockedMap,
      achievementView,
    );

    // executes this operation step as part of the flow
    renderSummary(achievements.length, unlockedCount);

    // checks a condition before executing this branch
    if (!sorted.length) {
      // declares a constant used in this scope
      const emptyMessage =
        // executes this operation step as part of the flow
        achievementView === "unlocked-only"
          ? "No unlocked achievements yet."
          // executes this operation step as part of the flow
          : achievementView === "locked-only"
            ? "No locked achievements remaining."
            // executes this operation step as part of the flow
            : "No achievements available.";
      // executes this operation step as part of the flow
      gridEl.innerHTML = `<div class="ach-loading">${escapeHtml(emptyMessage)}</div>`;
      // returns a value from the current function
      return;
    }

    // executes this operation step as part of the flow
    gridEl.innerHTML = sorted
      // defines an arrow function used by surrounding logic
      .map((achievement) => {
        // declares a constant used in this scope
        const achievementId = Number(achievement.id);
        // declares a constant used in this scope
        const unlockedAt = unlockedMap.get(achievementId);
        // declares a constant used in this scope
        const isUnlocked = Boolean(unlockedAt);
        // declares a constant used in this scope
        const title = escapeHtml(normalizeAchievementText(achievement.title));
        // declares a constant used in this scope
        const description = escapeHtml(
          normalizeAchievementText(achievement.description),
        );
        // declares a constant used in this scope
        const unlockedText = isUnlocked ? formatUnlockedAt(unlockedAt) : "";
        // declares a constant used in this scope
        const imageUrl = getAchievementImageUrl(achievement);
        // declares a constant used in this scope
        const lockOverlay = isUnlocked
          ? ""
          // executes this operation step as part of the flow
          : '<span class="ach-art-lock" aria-label="Locked" title="Locked"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg></span>';
        // declares a constant used in this scope
        const imageMarkup = imageUrl
          // executes this operation step as part of the flow
          ? `<div class="ach-art"><img src="${escapeHtml(imageUrl)}" alt="${title}" loading="lazy" decoding="async">${lockOverlay}</div>`
          // executes this operation step as part of the flow
          : "";

        // returns a value from the current function
        return `
        <article class="ach-card ${isUnlocked ? "is-unlocked" : "is-locked"}" aria-label="Achievement ${achievementId}">
          <span class="ach-id">#${achievementId}</span>
          ${imageMarkup}
          <h3 class="ach-title">${title}</h3>
          <p class="ach-description">${description}</p>
          <div class="ach-footer">${isUnlocked ? `Unlocked: ${escapeHtml(unlockedText)}` : "Locked"}</div>
        </article>
      `;
      })
      // executes this operation step as part of the flow
      .join("");
  }

  async function loadAchievements() {
    // executes this operation step as part of the flow
    renderLoading();

    // starts guarded logic to catch runtime errors
    try {
      // waits for an asynchronous operation to complete
      const [allRes, mineRes] = await Promise.all([
        authFetch(`${API_BASE}/api/Achievment`, {
          // sets a named field inside an object or configuration block
          method: "GET",
          // sets a named field inside an object or configuration block
          headers: { Accept: "application/json" },
        }),
        authFetch(`${API_BASE}/api/Achievment/me`, {
          // sets a named field inside an object or configuration block
          method: "GET",
          // sets a named field inside an object or configuration block
          headers: { Accept: "application/json" },
        }),
      ]);

      // checks a condition before executing this branch
      if (!allRes.ok) {
        // throws an error to be handled by calling code
        throw new Error("Failed to load achievements list.");
      }

      // declares a constant used in this scope
      const allAchievements = await allRes.json();
      // declares a constant used in this scope
      const unlockedRows = mineRes.ok ? await mineRes.json() : [];
      // declares a constant used in this scope
      const unlockedMap = new Map();

      // checks a condition before executing this branch
      if (Array.isArray(unlockedRows)) {
        // defines an arrow function used by surrounding logic
        unlockedRows.forEach((row) => {
          // declares a constant used in this scope
          const achievementId = Number(row?.achievmentId);
          // declares a constant used in this scope
          const unlockedAt = row?.unlockedAt;
          // checks a condition before executing this branch
          if (Number.isFinite(achievementId)) {
            // executes this operation step as part of the flow
            unlockedMap.set(achievementId, unlockedAt || "");
          }
        });
      }

      // executes this operation step as part of the flow
      cachedAchievements = Array.isArray(allAchievements)
        ? allAchievements
        // executes this operation step as part of the flow
        : [];
      // executes this operation step as part of the flow
      cachedUnlockedMap = unlockedMap;
      // executes this operation step as part of the flow
      renderAchievements(cachedAchievements, cachedUnlockedMap);
    } catch (error) {
      // executes this operation step as part of the flow
      renderError(error?.message || "Failed to load achievements.");
    }
  }

  // declares a helper function for a focused task
  function sortAchievements(achievements, unlockedMap, sortKey) {
    // declares a constant used in this scope
    const normalized = Array.isArray(achievements) ? [...achievements] : [];

    // declares a constant used in this scope
    const getUnlockedTime = (achievement) => {
      // declares a constant used in this scope
      const raw = unlockedMap.get(Number(achievement?.id));
      // checks a condition before executing this branch
      if (!raw) return 0;
      // declares a constant used in this scope
      const parsed = new Date(
        /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw) ? raw : `${raw}Z`,
      );
      // returns a value from the current function
      return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
    };

    // switches behavior based on the current value
    switch (sortKey) {
      // handles one specific switch case
      case "unlocked-first":
        // returns a value from the current function
        return normalized.sort((a, b) => {
          // declares a constant used in this scope
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          // declares a constant used in this scope
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          // checks a condition before executing this branch
          if (rightUnlocked !== leftUnlocked)
            // returns a value from the current function
            return rightUnlocked - leftUnlocked;
          // returns a value from the current function
          return Number(a.id) - Number(b.id);
        });
      // handles one specific switch case
      case "recent-unlocked":
        // returns a value from the current function
        return normalized.sort((a, b) => {
          // declares a constant used in this scope
          const leftUnlockedTime = getUnlockedTime(a);
          // declares a constant used in this scope
          const rightUnlockedTime = getUnlockedTime(b);
          // checks a condition before executing this branch
          if (rightUnlockedTime !== leftUnlockedTime)
            // returns a value from the current function
            return rightUnlockedTime - leftUnlockedTime;
          // declares a constant used in this scope
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          // declares a constant used in this scope
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          // checks a condition before executing this branch
          if (rightUnlocked !== leftUnlocked)
            // returns a value from the current function
            return rightUnlocked - leftUnlocked;
          // returns a value from the current function
          return Number(a.id) - Number(b.id);
        });
      // handles the default switch case
      default:
        // returns a value from the current function
        return normalized.sort((a, b) => {
          // declares a constant used in this scope
          const leftUnlocked = unlockedMap.has(Number(a.id)) ? 1 : 0;
          // declares a constant used in this scope
          const rightUnlocked = unlockedMap.has(Number(b.id)) ? 1 : 0;
          // checks a condition before executing this branch
          if (rightUnlocked !== leftUnlocked)
            // returns a value from the current function
            return rightUnlocked - leftUnlocked;
          // returns a value from the current function
          return Number(a.id) - Number(b.id);
        });
    }
  }

  // declares a helper function for a focused task
  function applyAchievementView(achievements, unlockedMap, viewKey) {
    // declares a constant used in this scope
    const normalized = Array.isArray(achievements) ? [...achievements] : [];

    // switches behavior based on the current value
    switch (viewKey) {
      // handles one specific switch case
      case "unlocked-only":
        // returns a value from the current function
        return sortAchievements(
          // defines an arrow function used by surrounding logic
          normalized.filter((achievement) =>
            unlockedMap.has(Number(achievement?.id)),
          ),
          unlockedMap,
          "unlocked-first",
        );
      // handles one specific switch case
      case "locked-only":
        // returns a value from the current function
        return sortAchievements(
          normalized.filter(
            // executes this operation step as part of the flow
            (achievement) => !unlockedMap.has(Number(achievement?.id)),
          ),
          unlockedMap,
          "unlocked-first",
        );
      // handles one specific switch case
      case "recent-unlocked":
        // returns a value from the current function
        return sortAchievements(normalized, unlockedMap, "recent-unlocked");
      // handles one specific switch case
      case "all":
      // handles one specific switch case
      case "unlocked-first":
      // handles the default switch case
      default:
        // returns a value from the current function
        return sortAchievements(normalized, unlockedMap, "unlocked-first");
    }
  }

  // executes this operation step as part of the flow
  refreshNavbarUsername();
  // executes this operation step as part of the flow
  loadAchievements();
}