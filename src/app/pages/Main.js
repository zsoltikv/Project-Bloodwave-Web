// main page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/Main.css";
// imports dependencies used by this module
import "../../styles/pages/Stats.css";
// imports dependencies used by this module
import { API_BASE, getUser, logout, authFetch } from "../services/auth.js";
// imports dependencies used by this module
import { confirmLogout } from "../effects/logout-confirm.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import swordImg from "../../assets/weapons/sword.png";
// imports dependencies used by this module
import pistolImg from "../../assets/weapons/pistol.png";
// imports dependencies used by this module
import shotgunImg from "../../assets/weapons/shotgun.png";
// imports dependencies used by this module
import orbitingSwordImg from "../../assets/weapons/orbiting_sword.png";
// imports dependencies used by this module
import orbitingIceCrystalImg from "../../assets/weapons/orbiting_ice_crystal.png";
// imports dependencies used by this module
import bloodScytheImg from "../../assets/weapons/blood_scythe.png";
// imports dependencies used by this module
import bloodforgedSigilImg from "../../assets/items/bloodforged_sigil.png";
// imports dependencies used by this module
import cascadeOrbImg from "../../assets/items/cascade_orb.png";
// imports dependencies used by this module
import glassEdgeImg from "../../assets/items/glass_edge.png";
// imports dependencies used by this module
import hasteRuneImg from "../../assets/items/haste_rune.png";
// imports dependencies used by this module
import heartOfAscendanceImg from "../../assets/items/heart_of_ascendance.png";
// imports dependencies used by this module
import hourglassPendantImg from "../../assets/items/hourglass_pendant.png";
// imports dependencies used by this module
import longreachEmblemImg from "../../assets/items/longreach_emblem.png";
// imports dependencies used by this module
import marksmanCoreImg from "../../assets/items/marksman_core.png";
// imports dependencies used by this module
import oathbladeImg from "../../assets/items/oathblade.png";
// imports dependencies used by this module
import orbOfHealthImg from "../../assets/items/orb_of_health.png";
// imports dependencies used by this module
import swiftshotCharmImg from "../../assets/items/swiftshot_charm.png";
// imports dependencies used by this module
import volleyStoneImg from "../../assets/items/volley_stone.png";

// declares a constant used in this scope
const WEAPON_IMAGE_BY_ID = {
  // sets a named field inside an object or configuration block
  1: swordImg,
  // sets a named field inside an object or configuration block
  2: pistolImg,
  // sets a named field inside an object or configuration block
  3: shotgunImg,
  // sets a named field inside an object or configuration block
  4: orbitingSwordImg,
  // sets a named field inside an object or configuration block
  5: orbitingIceCrystalImg,
  // sets a named field inside an object or configuration block
  6: bloodScytheImg,
};
// declares a constant used in this scope
const ITEM_IMAGE_BY_ID = {
  // sets a named field inside an object or configuration block
  1: bloodforgedSigilImg,
  // sets a named field inside an object or configuration block
  2: cascadeOrbImg,
  // sets a named field inside an object or configuration block
  3: glassEdgeImg,
  // sets a named field inside an object or configuration block
  4: hasteRuneImg,
  // sets a named field inside an object or configuration block
  5: heartOfAscendanceImg,
  // sets a named field inside an object or configuration block
  6: hourglassPendantImg,
  // sets a named field inside an object or configuration block
  7: longreachEmblemImg,
  // sets a named field inside an object or configuration block
  8: marksmanCoreImg,
  // sets a named field inside an object or configuration block
  9: oathbladeImg,
  // sets a named field inside an object or configuration block
  10: orbOfHealthImg,
  // sets a named field inside an object or configuration block
  11: swiftshotCharmImg,
  // sets a named field inside an object or configuration block
  12: volleyStoneImg,
};

// exports the main function for this module
export default function Main(container) {
  // declares mutable state used in this scope
  let matches = [];
  // declares mutable state used in this scope
  let matchesSort = "playedAt-desc";
  // executes this operation step as part of the flow
  container.innerHTML = `
    

    <div class="mn-root">
      <div class="mn-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="mn-nav">
        <div class="mn-nav-inner">

          <!-- Logo -->
          <a href="/" data-link class="mn-logo">Bloodwave</a>

          <!-- Desktop Center Links -->
          <div class="mn-links">
            <a href="/main" data-link class="mn-link active"><span>Matches</span></a>
            <a href="/stats" data-link class="mn-link"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="mn-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="mn-link"><span>Achievements</span></a>
          </div>

          <!-- Right: avatar + hamburger -->
          <div class="mn-right">
            <a href="/main" data-link class="mn-nav-link" id="mnBackToDashboard" style="display:none;">Back to Dashboard</a>

            <!-- Profile Avatar + dropdown (desktop) -->
            <div class="mn-avatar-wrap">
              <button class="mn-avatar" id="mn-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="mn-avatar-dropdown" id="mn-avatar-dropdown" role="menu">
                <div class="mn-dd-header">
                  <div class="mn-dd-username" id="mn-dd-username">—</div>
                  <div class="mn-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <a href="/backend-status" data-link class="mn-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5 8.25 9l3 3 4.5-6 4.5 7.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 19.5h16.5" />
                  </svg>
                  API Status
                </a>
                <div class="mn-dd-divider"></div>
                <button class="mn-dd-item logout" id="mn-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

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
            <a href="/main" data-link class="mn-mobile-link">Matches</a>
            <a href="/stats" data-link class="mn-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="mn-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="mn-mobile-link">Achievements</a>
            <div class="mn-mobile-divider"></div>
            <div class="mn-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="mn-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="mn-mobile-username">—</span>
            </div>
            <div class="mn-mobile-divider"></div>
            <a href="/user-panel" data-link class="mn-mobile-link">Profile</a>
            <a href="/android-download" data-link class="mn-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="mn-mobile-link">API Status</a>
            <button class="mn-mobile-logout" id="mn-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="mn-content">
        <div class="mn-matches-shell">
          <div class="mn-matches-head">
            <div class="mn-ornament">
              <div class="mn-ornament-line"></div>
              <div class="mn-ornament-diamond"></div>
              <div class="mn-ornament-line"></div>
            </div>
            <h1 class="mn-placeholder-title">Played Matches</h1>
            <p class="mn-placeholder-sub">Select a run to view details</p>
            <p class="mn-viewing-user" id="mn-viewing-user" style="display:none;">
              <span class="mn-viewing-kicker">Viewing</span>
              <span class="mn-viewing-name" id="mn-viewing-name">-</span>
            </p>
            <div class="mn-toolbar">
              <label class="mn-sort" for="mn-sort-select">
                <span class="mn-sort-label">Order By</span>
                <select class="mn-sort-select" id="mn-sort-select" aria-label="Sort matches">
                  <option value="playedAt-desc">Newest First</option>
                  <option value="playedAt-asc">Oldest First</option>
                  <option value="duration-desc">Longest Run</option>
                  <option value="duration-asc">Shortest Run</option>
                  <option value="level-desc">Highest Level</option>
                  <option value="kills-desc">Most Kills</option>
                </select>
              </label>
            </div>
          </div>

          <div class="mn-matches-layout">
            <div class="mn-matches-list" id="mn-matches-list" role="listbox" aria-label="Played matches"></div>
            <section class="mn-match-panel" id="mn-match-panel" aria-live="polite"></section>
          </div>

          <section class="mn-player-stats" id="mn-player-stats" hidden></section>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  ensureGlobalStarfield();

  // ── Populate username ────────────────────────────────────────────────────
  const user = getUser();
  // declares a constant used in this scope
  const displayName = user?.username ?? user?.email ?? "Member";

  // declares a constant used in this scope
  const ddUsername = container.querySelector("#mn-dd-username");
  // declares a constant used in this scope
  const mobileUsername = container.querySelector("#mn-mobile-username");
  // checks a condition before executing this branch
  if (ddUsername) ddUsername.textContent = displayName;
  // checks a condition before executing this branch
  if (mobileUsername) mobileUsername.textContent = displayName;
  // executes this operation step as part of the flow
  refreshNavbarUsername();
  // executes this operation step as part of the flow
  updateNavbarLinksForPlayer(container);

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
        userData?.username ?? userData?.email ?? displayName;

      // checks a condition before executing this branch
      if (ddUsername) ddUsername.textContent = liveDisplayName;
      // checks a condition before executing this branch
      if (mobileUsername) mobileUsername.textContent = liveDisplayName;
    } catch {
      // Keep cached display name on fetch failure.
    }
  }

  // ── Matches list + details ───────────────────────────────────────────────
  const matchesList = container.querySelector("#mn-matches-list");
  // declares a constant used in this scope
  const matchPanel = container.querySelector("#mn-match-panel");
  // declares a constant used in this scope
  const playerStatsSection = container.querySelector("#mn-player-stats");
  // declares a constant used in this scope
  const sortSelect = container.querySelector("#mn-sort-select");
  // declares a constant used in this scope
  const viewedPlayerId = getViewedPlayerIdFromQuery();
  // declares mutable state used in this scope
  let selectedMatchId = null;

  // checks a condition before executing this branch
  if (playerStatsSection && viewedPlayerId) {
    // executes this operation step as part of the flow
    playerStatsSection.hidden = false;
    // executes this operation step as part of the flow
    renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
  }

  // declares a helper function for a focused task
  function renderMatchPanel(match) {
    // checks a condition before executing this branch
    if (!matchPanel) return;

    // checks a condition before executing this branch
    if (!match) {
      // executes this operation step as part of the flow
      matchPanel.innerHTML = `
        <div class="mn-match-empty">No played matches yet.</div>
      `;
      // returns a value from the current function
      return;
    }

    // declares a constant used in this scope
    const stats = [
      { label: "Duration", value: formatDuration(match.durationSeconds) },
      { label: "Level Reached", value: formatCount(match.levelReached) },
      { label: "Max Health", value: formatCount(match.maxHealth) },
      { label: "Damage Dealt", value: formatCount(match.damageDealt) },
      { label: "Damage Taken", value: formatCount(match.damageTaken) },
      { label: "Enemies Killed", value: formatCount(match.enemiesKilled) },
      { label: "Coins Collected", value: formatCount(match.coinsCollected) },
      { label: "Finished At", value: formatPlayedAt(match.playedAt) },
    ];

    // executes this operation step as part of the flow
    matchPanel.innerHTML = `
      <h2 class="mn-panel-title">Run Summary</h2>
      <div class="mn-panel-grid">
        ${stats
          .map(
            (stat) => `
          // executes this operation step as part of the flow
          <div class="mn-panel-stat">
            // executes this operation step as part of the flow
            <div class="mn-panel-label">${stat.label}</div>
            // executes this operation step as part of the flow
            <div class="mn-panel-value">${stat.value}</div>
          </div>
        `,
          )
          .join("")}
      </div>
      ${renderEntityTable("Weapons", match.weapons, "weapon")}
      ${renderEntityTable("Items", match.items, "item")}
    `;
  }

  // declares a helper function for a focused task
  function renderMatches() {
    // checks a condition before executing this branch
    if (!matchesList) return;

    // declares a constant used in this scope
    const sortedMatches = sortMatches(matches, matchesSort);

    // checks a condition before executing this branch
    if (!sortedMatches.length) {
      // executes this operation step as part of the flow
      matchesList.innerHTML =
        // executes this operation step as part of the flow
        '<div class="mn-match-empty">No played matches yet.</div>';
      // executes this operation step as part of the flow
      renderMatchPanel(null);
      // returns a value from the current function
      return;
    }

    // checks a condition before executing this branch
    if (!sortedMatches.some((match) => match.id === selectedMatchId)) {
      // executes this operation step as part of the flow
      selectedMatchId = sortedMatches[0]?.id ?? null;
    }

    // executes this operation step as part of the flow
    matchesList.innerHTML = sortedMatches
      // defines an arrow function used by surrounding logic
      .map((match, index) => {
        // declares a constant used in this scope
        const isActive = match.id === selectedMatchId;
        // declares a constant used in this scope
        const swipeDelayMs = Math.min(index * 55, 440);
        // declares a constant used in this scope
        const swipeShiftPx = Math.min(20 + index * 3, 42);
        // returns a value from the current function
        return `
        <button
          type="button"
          class="mn-match-item"
          data-match-id="${match.id}"
          role="option"
          aria-selected="${String(isActive)}"
          style="--mn-row-delay:${swipeDelayMs}ms; --mn-row-shift:${swipeShiftPx}px;"
        >
          <div class="mn-match-meta">
            <span class="mn-match-chip">${formatDuration(match.durationSeconds)}</span>
            <span class="mn-match-chip">Lv ${match.levelReached}</span>
          </div>
          <div class="mn-match-time">${formatPlayedAt(match.playedAt)}</div>
        </button>
      `;
      })
      // executes this operation step as part of the flow
      .join("");

    // executes this operation step as part of the flow
    renderMatchPanel(sortedMatches.find((m) => m.id === selectedMatchId));
  }

  // declares a helper function for a focused task
  function syncActiveMatchItem() {
    // checks a condition before executing this branch
    if (!matchesList) return;

    // declares a constant used in this scope
    const items = matchesList.querySelectorAll(".mn-match-item");
    // defines an arrow function used by surrounding logic
    items.forEach((item) => {
      // declares a constant used in this scope
      const isActive = item.dataset.matchId === selectedMatchId;
      // executes this operation step as part of the flow
      item.setAttribute("aria-selected", String(isActive));
    });
  }

  // attaches a dom event listener for user interaction
  matchesList?.addEventListener("click", (e) => {
    // declares a constant used in this scope
    const target = e.target.closest(".mn-match-item");
    // checks a condition before executing this branch
    if (!target) return;

    // executes this operation step as part of the flow
    selectedMatchId = target.dataset.matchId;
    // executes this operation step as part of the flow
    syncActiveMatchItem();
    renderMatchPanel(
      // executes this operation step as part of the flow
      sortMatches(matches, matchesSort).find((m) => m.id === selectedMatchId),
    );
  });

  // attaches a dom event listener for user interaction
  sortSelect?.addEventListener("change", (event) => {
    // executes this operation step as part of the flow
    matchesSort = event.target.value || "playedAt-desc";
    // executes this operation step as part of the flow
    renderMatches();
  });

  // checks a condition before executing this branch
  if (matchesList) {
    // executes this operation step as part of the flow
    matchesList.innerHTML =
      // executes this operation step as part of the flow
      '<div class="mn-match-empty">Loading played matches...</div>';
  }
  // executes this operation step as part of the flow
  renderMatchPanel(null);
  // executes this operation step as part of the flow
  loadMatches();

  async function loadMatches() {
    // declares a constant used in this scope
    const playerId = resolvePlayerId(user);

    // checks a condition before executing this branch
    if (!playerId) {
      // executes this operation step as part of the flow
      matches = [];
      // executes this operation step as part of the flow
      selectedMatchId = null;
      // executes this operation step as part of the flow
      renderMatches();
      // returns a value from the current function
      return;
    }

    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const response = await authFetch(
        // executes this operation step as part of the flow
        `${API_BASE}/api/Match/player?playerId=${encodeURIComponent(playerId)}`,
        {
          // sets a named field inside an object or configuration block
          method: "GET",
          // sets a named field inside an object or configuration block
          headers: {
            // sets a named field inside an object or configuration block
            Accept: "application/json",
          },
        },
      );

      // checks a condition before executing this branch
      if (!response.ok) {
        // throws an error to be handled by calling code
        throw new Error("Failed to fetch matches");
      }

      // declares a constant used in this scope
      const apiMatches = await parseResponsePayload(response);
      // executes this operation step as part of the flow
      matches = mapApiMatches(apiMatches);
      // executes this operation step as part of the flow
      selectedMatchId = matches[0]?.id ?? null;
      // checks a condition before executing this branch
      if (playerStatsSection && viewedPlayerId) {
        // executes this operation step as part of the flow
        renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
      }
      // executes this operation step as part of the flow
      renderMatches();
    } catch {
      // executes this operation step as part of the flow
      matches = [];
      // executes this operation step as part of the flow
      selectedMatchId = null;
      // checks a condition before executing this branch
      if (playerStatsSection && viewedPlayerId) {
        // executes this operation step as part of the flow
        renderPlayerStats(playerStatsSection, buildPlayerStats(matches));
      }
      // executes this operation step as part of the flow
      renderMatches();
    }
  }

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger = container.querySelector("#mn-hamburger");
  // declares a constant used in this scope
  const mobileMenu = container.querySelector("#mn-mobile-menu");
  // declares mutable state used in this scope
  let menuOpen = false;

  // attaches a dom event listener for user interaction
  hamburger?.addEventListener("click", () => {
    // executes this operation step as part of the flow
    menuOpen = !menuOpen;
    // executes this operation step as part of the flow
    hamburger.classList.toggle("open", menuOpen);
    // executes this operation step as part of the flow
    hamburger.setAttribute("aria-expanded", String(menuOpen));
    // executes this operation step as part of the flow
    mobileMenu.style.maxHeight = menuOpen
      ? mobileMenu.scrollHeight + "px"
      // executes this operation step as part of the flow
      : "0";
  });

  // Close on mobile link click
  mobileMenu?.querySelectorAll(".mn-mobile-link").forEach((link) => {
    // attaches a dom event listener for user interaction
    link.addEventListener("click", () => {
      // executes this operation step as part of the flow
      menuOpen = false;
      // executes this operation step as part of the flow
      hamburger.classList.remove("open");
      // executes this operation step as part of the flow
      hamburger.setAttribute("aria-expanded", "false");
      // executes this operation step as part of the flow
      mobileMenu.style.maxHeight = "0";
    });
  });

  // ── Desktop avatar dropdown ───────────────────────────────────────────────
  const avatarBtn = container.querySelector("#mn-avatar-btn");
  // declares a constant used in this scope
  const avatarDrop = container.querySelector("#mn-avatar-dropdown");
  // declares mutable state used in this scope
  let dropOpen = false;

  // declares a helper function for a focused task
  function openDrop() {
    // executes this operation step as part of the flow
    dropOpen = true;
    // executes this operation step as part of the flow
    avatarDrop.classList.add("open");
    // executes this operation step as part of the flow
    avatarBtn.setAttribute("aria-expanded", "true");
  }
  // declares a helper function for a focused task
  function closeDrop() {
    // executes this operation step as part of the flow
    dropOpen = false;
    // executes this operation step as part of the flow
    avatarDrop.classList.remove("open");
    // executes this operation step as part of the flow
    avatarBtn.setAttribute("aria-expanded", "false");
  }

  // attaches a dom event listener for user interaction
  avatarBtn?.addEventListener("click", (e) => {
    // executes this operation step as part of the flow
    e.stopPropagation();
    // executes this operation step as part of the flow
    dropOpen ? closeDrop() : openDrop();
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    // checks a condition before executing this branch
    if (dropOpen && !avatarDrop.contains(e.target) && e.target !== avatarBtn) {
      // executes this operation step as part of the flow
      closeDrop();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    // checks a condition before executing this branch
    if (e.key === "Escape" && dropOpen) closeDrop();
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const doLogout = async () => {
    // declares a constant used in this scope
    const confirmed = await confirmLogout();
    // checks a condition before executing this branch
    if (!confirmed) return;

    // waits for an asynchronous operation to complete
    await logout();
    // logout() already navigates to /login
  };

  // attaches a dom event listener for user interaction
  container.querySelector("#mn-dd-logout")?.addEventListener("click", doLogout);
  container
    .querySelector("#mn-mobile-logout")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", doLogout);
}

/* ======================================================================
   CANVAS — Starry background from Profile
   // executes this operation step as part of the flow
   ====================================================================== */
// declares a helper function for a focused task
function initMnCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("mn-canvas");
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
function spawnMnParticles() {
  // declares a constant used in this scope
  const root = document.querySelector(".mn-root");
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

// declares a helper function for a focused task
function formatDuration(totalSeconds) {
  // declares a constant used in this scope
  const hours = Math.floor(totalSeconds / 3600);
  // declares a constant used in this scope
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  // declares a constant used in this scope
  const seconds = totalSeconds % 60;

  // checks a condition before executing this branch
  if (hours > 0) {
    // returns a value from the current function
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // returns a value from the current function
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// declares a helper function for a focused task
function formatPlayedAt(isoDateString) {
  // declares a constant used in this scope
  const raw = typeof isoDateString === "string" ? isoDateString.trim() : "";
  // declares a constant used in this scope
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  // declares a constant used in this scope
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  // declares a constant used in this scope
  const parsedDate = new Date(normalized);

  // checks a condition before executing this branch
  if (Number.isNaN(parsedDate.getTime())) {
    // returns a value from the current function
    return "-";
  }

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

async function parseResponsePayload(response) {
  // declares a constant used in this scope
  const raw = await response.text();
  // checks a condition before executing this branch
  if (!raw) return [];

  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const parsed = JSON.parse(raw);
    // returns a value from the current function
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // returns a value from the current function
    return [];
  }
}

// declares a helper function for a focused task
function resolvePlayerId(user) {
  // Check if a userId query parameter is provided
  const queryParams = new URLSearchParams(window.location.search);
  // declares a constant used in this scope
  const userIdParam = queryParams.get("userId");
  // checks a condition before executing this branch
  if (userIdParam) {
    // declares a constant used in this scope
    const value = Number(userIdParam);
    // checks a condition before executing this branch
    if (Number.isInteger(value) && value > 0) {
      // returns a value from the current function
      return value;
    }
  }

  // Fall back to current user's ID
  const candidates = [user?.id, user?.userId, user?.playerId];
  // iterates through a sequence of values
  for (const candidate of candidates) {
    // declares a constant used in this scope
    const value = Number(candidate);
    // checks a condition before executing this branch
    if (Number.isInteger(value) && value > 0) {
      // returns a value from the current function
      return value;
    }
  }

  // returns a value from the current function
  return null;
}

// declares a helper function for a focused task
function getViewedPlayerIdFromQuery() {
  // declares a constant used in this scope
  const queryParams = new URLSearchParams(window.location.search);
  // declares a constant used in this scope
  const userIdParam = queryParams.get("userId");
  // checks a condition before executing this branch
  if (!userIdParam) return null;

  // declares a constant used in this scope
  const value = Number(userIdParam);
  // checks a condition before executing this branch
  if (!Number.isInteger(value) || value <= 0) return null;
  // returns a value from the current function
  return value;
}

// declares a helper function for a focused task
function updateNavbarLinksForPlayer(container) {
  // declares a constant used in this scope
  const queryParams = new URLSearchParams(window.location.search);
  // declares a constant used in this scope
  const userIdParam = queryParams.get("userId");

  // checks a condition before executing this branch
  if (!userIdParam) return;

  // Back-only navbar in viewed-player mode.
  const navLinks = container.querySelector(".mn-links");
  // declares a constant used in this scope
  const backLink = container.querySelector("#mnBackToDashboard");
  // declares a constant used in this scope
  const avatarWrap = container.querySelector(".mn-avatar-wrap");
  // declares a constant used in this scope
  const hamburger = container.querySelector("#mn-hamburger");
  // declares a constant used in this scope
  const mobileMenu = container.querySelector("#mn-mobile-menu");
  // declares a constant used in this scope
  const root = container.querySelector(".mn-root");

  // checks a condition before executing this branch
  if (root) root.classList.add("mn-view-mode");
  // checks a condition before executing this branch
  if (navLinks) navLinks.style.display = "none";
  // checks a condition before executing this branch
  if (avatarWrap) avatarWrap.style.display = "none";
  // checks a condition before executing this branch
  if (hamburger) hamburger.style.display = "none";
  // checks a condition before executing this branch
  if (mobileMenu) mobileMenu.style.display = "none";
  // checks a condition before executing this branch
  if (backLink) {
    // executes this operation step as part of the flow
    backLink.style.display = "inline-block";
    // executes this operation step as part of the flow
    backLink.setAttribute("href", "/main");
  }

  // Fetch and display viewed player's username
  loadViewedPlayerUsername(userIdParam, container);
}

async function loadViewedPlayerUsername(userId, container) {
  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const res = await authFetch(
      // executes this operation step as part of the flow
      `${API_BASE}/api/User/name?id=${encodeURIComponent(userId)}`,
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
    const username = data?.username || `User #${userId}`;

    // declares a constant used in this scope
    const viewingEl = container.querySelector("#mn-viewing-user");
    // declares a constant used in this scope
    const viewingNameEl = container.querySelector("#mn-viewing-name");
    // checks a condition before executing this branch
    if (viewingEl && viewingNameEl) {
      // executes this operation step as part of the flow
      viewingNameEl.textContent = username;
      // executes this operation step as part of the flow
      viewingEl.style.display = "inline-flex";
    }
  } catch {
    // declares a constant used in this scope
    const viewingEl = container.querySelector("#mn-viewing-user");
    // declares a constant used in this scope
    const viewingNameEl = container.querySelector("#mn-viewing-name");
    // checks a condition before executing this branch
    if (viewingEl && viewingNameEl) {
      // executes this operation step as part of the flow
      viewingNameEl.textContent = `User #${userId}`;
      // executes this operation step as part of the flow
      viewingEl.style.display = "inline-flex";
    }
  }
}

// declares a helper function for a focused task
function mapApiMatches(apiMatches) {
  // checks a condition before executing this branch
  if (!Array.isArray(apiMatches)) return [];

  // returns a value from the current function
  return apiMatches
    // defines an arrow function used by surrounding logic
    .map((match, index) => {
      // declares a constant used in this scope
      const playedAt = normalizePlayedAt(match?.createdAt);
      // returns a value from the current function
      return {
        // sets a named field inside an object or configuration block
        id: String(match?.id ?? `run-${index + 1}`),
        // sets a named field inside an object or configuration block
        durationSeconds: normalizeDurationSeconds(match?.time),
        // sets a named field inside an object or configuration block
        levelReached: toNonNegativeInt(match?.level),
        // sets a named field inside an object or configuration block
        maxHealth: toNonNegativeInt(match?.maxHealth),
        // sets a named field inside an object or configuration block
        damageDealt: toNonNegativeInt(match?.damageDealt),
        // sets a named field inside an object or configuration block
        damageTaken: toNonNegativeInt(match?.damageTaken),
        // sets a named field inside an object or configuration block
        enemiesKilled: toNonNegativeInt(match?.enemiesKilled),
        // sets a named field inside an object or configuration block
        coinsCollected: toNonNegativeInt(match?.coinsCollected),
        playedAt,
        // sets a named field inside an object or configuration block
        weapons: mapMatchEntities(match?.matchWeapons, "weapon"),
        // sets a named field inside an object or configuration block
        items: mapMatchEntities(match?.matchItems, "item"),
      };
    })
    .sort(
      // defines an arrow function used by surrounding logic
      (left, right) =>
        parseBackendDate(right.playedAt).getTime() -
        parseBackendDate(left.playedAt).getTime(),
    );
}

// declares a helper function for a focused task
function sortMatches(matches, sortKey) {
  // declares a constant used in this scope
  const rows = Array.isArray(matches) ? [...matches] : [];

  // switches behavior based on the current value
  switch (sortKey) {
    // handles one specific switch case
    case "playedAt-asc":
      // returns a value from the current function
      return rows.sort(
        // defines an arrow function used by surrounding logic
        (a, b) =>
          parseBackendDate(a.playedAt).getTime() -
          parseBackendDate(b.playedAt).getTime(),
      );
    // handles one specific switch case
    case "duration-desc":
      // returns a value from the current function
      return rows.sort((a, b) => {
        // checks a condition before executing this branch
        if (b.durationSeconds !== a.durationSeconds)
          // returns a value from the current function
          return b.durationSeconds - a.durationSeconds;
        // returns a value from the current function
        return (
          parseBackendDate(b.playedAt).getTime() -
          parseBackendDate(a.playedAt).getTime()
        );
      });
    // handles one specific switch case
    case "duration-asc":
      // returns a value from the current function
      return rows.sort((a, b) => {
        // checks a condition before executing this branch
        if (a.durationSeconds !== b.durationSeconds)
          // returns a value from the current function
          return a.durationSeconds - b.durationSeconds;
        // returns a value from the current function
        return (
          parseBackendDate(b.playedAt).getTime() -
          parseBackendDate(a.playedAt).getTime()
        );
      });
    // handles one specific switch case
    case "level-desc":
      // returns a value from the current function
      return rows.sort((a, b) => {
        // checks a condition before executing this branch
        if (b.levelReached !== a.levelReached)
          // returns a value from the current function
          return b.levelReached - a.levelReached;
        // returns a value from the current function
        return (
          parseBackendDate(b.playedAt).getTime() -
          parseBackendDate(a.playedAt).getTime()
        );
      });
    // handles one specific switch case
    case "kills-desc":
      // returns a value from the current function
      return rows.sort((a, b) => {
        // checks a condition before executing this branch
        if (b.enemiesKilled !== a.enemiesKilled)
          // returns a value from the current function
          return b.enemiesKilled - a.enemiesKilled;
        // returns a value from the current function
        return (
          parseBackendDate(b.playedAt).getTime() -
          parseBackendDate(a.playedAt).getTime()
        );
      });
    // handles one specific switch case
    case "playedAt-desc":
    // handles the default switch case
    default:
      // returns a value from the current function
      return rows.sort(
        // defines an arrow function used by surrounding logic
        (a, b) =>
          parseBackendDate(b.playedAt).getTime() -
          parseBackendDate(a.playedAt).getTime(),
      );
  }
}

// declares a helper function for a focused task
function mapMatchEntities(entities, type) {
  // checks a condition before executing this branch
  if (!Array.isArray(entities)) return [];

  // returns a value from the current function
  return entities.map((entry, index) => {
    // declares a constant used in this scope
    const entityId = toNonNegativeInt(
      // executes this operation step as part of the flow
      type === "weapon" ? entry?.weaponId : entry?.itemId,
    );
    // declares a constant used in this scope
    const fallbackName =
      // executes this operation step as part of the flow
      type === "weapon"
        ? `Weapon #${entityId || index + 1}`
        // executes this operation step as part of the flow
        : `Item #${entityId || index + 1}`;

    // returns a value from the current function
    return {
      // sets a named field inside an object or configuration block
      id: toNonNegativeInt(entry?.id),
      entityId,
      // sets a named field inside an object or configuration block
      name: normalizeEntityName(
        // executes this operation step as part of the flow
        type === "weapon" ? entry?.weaponName : entry?.itemName,
        fallbackName,
      ),
      // sets a named field inside an object or configuration block
      image:
        // executes this operation step as part of the flow
        type === "weapon"
          ? WEAPON_IMAGE_BY_ID[entityId]
          : ITEM_IMAGE_BY_ID[entityId],
    };
  });
}

// declares a helper function for a focused task
function normalizeEntityName(value, fallback) {
  // declares a constant used in this scope
  const raw = typeof value === "string" ? value.trim() : "";
  // returns a value from the current function
  return raw || fallback;
}

// declares a helper function for a focused task
function renderEntityTable(title, entities, type) {
  // declares a constant used in this scope
  const rows = Array.isArray(entities) ? entities : [];

  // returns a value from the current function
  return `
    <section class="mn-summary-section">
      <div class="mn-summary-section-head">
        <h3 class="mn-summary-section-title">${title}</h3>
        <span class="mn-summary-section-count">${formatCount(rows.length)}</span>
      </div>
      ${
        rows.length
          ? `
            // executes this operation step as part of the flow
            <div class="mn-summary-table-wrap">
              // executes this operation step as part of the flow
              <table class="mn-summary-table" aria-label="${title}">
                <thead>
                  <tr>
                    // executes this operation step as part of the flow
                    <th scope="col">Image</th>
                    // executes this operation step as part of the flow
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map(
                      // executes this operation step as part of the flow
                      (entry) => `
                    <tr>
                      <td>
                        <div class="mn-summary-entity">
                          ${entry.image ? `<img class="mn-summary-entity-image" src="${entry.image}" alt="${escapeHtml(entry.name)}">` : '<div class="mn-summary-entity-fallback">-</div>'}
                        </div>
                      </td>
                      <td>${escapeHtml(entry.name)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
          : `<div class="mn-summary-empty">No ${type === "weapon" ? "weapons" : "items"} recorded for this run.</div>`
      }
    </section>
  `;
}

// declares a helper function for a focused task
function renderPlayerStats(container, stats) {
  // checks a condition before executing this branch
  if (!container) return;

  // declares a constant used in this scope
  const sections = [
    {
      // sets a named field inside an object or configuration block
      title: "Core Totals",
      // sets a named field inside an object or configuration block
      subtitle: "Overall lifetime volume",
      // sets a named field inside an object or configuration block
      cards: [
        {
          // sets a named field inside an object or configuration block
          stat: "matches",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Matches Played",
          // sets a named field inside an object or configuration block
          unit: "total games",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "time-lived",
          // sets a named field inside an object or configuration block
          type: "time-hm",
          // sets a named field inside an object or configuration block
          name: "Time Lived",
          // sets a named field inside an object or configuration block
          unit: "total survival time",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "damage",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Damage Dealt",
          // sets a named field inside an object or configuration block
          unit: "total damage",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "damage-taken",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Damage Taken",
          // sets a named field inside an object or configuration block
          unit: "total damage received",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "kills",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Enemies Killed",
          // sets a named field inside an object or configuration block
          unit: "eliminations",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "coins",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Coins Collected",
          // sets a named field inside an object or configuration block
          unit: "total coins",
        },
      ],
    },
    {
      // sets a named field inside an object or configuration block
      title: "Per Match Efficiency",
      // sets a named field inside an object or configuration block
      subtitle: "Average output and pace",
      // sets a named field inside an object or configuration block
      cards: [
        {
          // sets a named field inside an object or configuration block
          stat: "avg-survival-match",
          // sets a named field inside an object or configuration block
          type: "time-hms",
          // sets a named field inside an object or configuration block
          name: "Avg Survival / Match",
          // sets a named field inside an object or configuration block
          unit: "time per game",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "avg-damage-match",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Avg Damage / Match",
          // sets a named field inside an object or configuration block
          unit: "damage per game",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "avg-damage-minute",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Avg Damage / Minute",
          // sets a named field inside an object or configuration block
          unit: "damage per minute",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "avg-kills-match",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Avg Kills / Match",
          // sets a named field inside an object or configuration block
          unit: "kills per game",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "avg-kills-minute",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Avg Kills / Minute",
          // sets a named field inside an object or configuration block
          unit: "kills per minute",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "avg-coins-match",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Avg Coins / Match",
          // sets a named field inside an object or configuration block
          unit: "coins per game",
        },
      ],
    },
    {
      // sets a named field inside an object or configuration block
      title: "Peak Records",
      // sets a named field inside an object or configuration block
      subtitle: "Best single-run highlights",
      // sets a named field inside an object or configuration block
      cards: [
        {
          // sets a named field inside an object or configuration block
          stat: "best-score",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Best Match Score",
          // sets a named field inside an object or configuration block
          unit: "top weighted run score",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "highest-level",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Highest Level Reached",
          // sets a named field inside an object or configuration block
          unit: "all-time best level",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "best-survival",
          // sets a named field inside an object or configuration block
          type: "time-hms",
          // sets a named field inside an object or configuration block
          name: "Best Match Survival",
          // sets a named field inside an object or configuration block
          unit: "longest single match",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "best-damage",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Best Match Damage",
          // sets a named field inside an object or configuration block
          unit: "top single-match damage",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "best-kills",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Best Match Kills",
          // sets a named field inside an object or configuration block
          unit: "top single-match kills",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "best-coins",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Best Match Coins",
          // sets a named field inside an object or configuration block
          unit: "top single-match coins",
        },
      ],
    },
    {
      // sets a named field inside an object or configuration block
      title: "Run Shape And Stability",
      // sets a named field inside an object or configuration block
      subtitle: "Session length distribution and consistency",
      // sets a named field inside an object or configuration block
      cards: [
        {
          // sets a named field inside an object or configuration block
          stat: "short-match-ratio",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Short Match Ratio",
          // sets a named field inside an object or configuration block
          unit: "under 2 min (%)",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "long-match-ratio",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Long Match Ratio",
          // sets a named field inside an object or configuration block
          unit: "over 10 min (%)",
        },
        {
          // sets a named field inside an object or configuration block
          stat: "performance-volatility",
          // sets a named field inside an object or configuration block
          type: "int",
          // sets a named field inside an object or configuration block
          name: "Performance Volatility",
          // sets a named field inside an object or configuration block
          unit: "lower = more stable (%)",
        },
      ],
    },
  ];

  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="st-sections">
      ${sections
        .map(
          (section) => `
        // executes this operation step as part of the flow
        <section class="st-stat-section">
          // executes this operation step as part of the flow
          <div class="st-section-head">
            // executes this operation step as part of the flow
            <h2 class="st-section-title">${section.title}</h2>
            // executes this operation step as part of the flow
            <p class="st-section-subtitle">${section.subtitle}</p>
          </div>
          // executes this operation step as part of the flow
          <div class="st-grid st-grid--section">
            ${section.cards
              .map(
                // executes this operation step as part of the flow
                (card) => `
              <div class="st-card">
                <div class="st-card-corner st-card-corner--tl"></div>
                <div class="st-card-corner st-card-corner--tr"></div>
                <div class="st-card-corner st-card-corner--bl"></div>
                <div class="st-card-corner st-card-corner--br"></div>
                <div class="st-card-body">
                  <div class="st-card-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
                    </svg>
                  </div>
                  <div class="st-card-name">${card.name}</div>
                  <div class="st-card-sep"></div>
                  <div class="st-card-value js-st-count" data-stat="${card.stat}" data-type="${card.type}" data-target="0">0</div>
                  <div class="st-card-unit">${card.unit}</div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </section>
      `,
        )
        .join("")}
    </div>
  `;

  // executes this operation step as part of the flow
  applyStatsToCards(container, stats);
  // executes this operation step as part of the flow
  animateStStats(container);
}

// declares a helper function for a focused task
function buildPlayerStats(matches) {
  // declares a constant used in this scope
  const rows = Array.isArray(matches) ? matches : [];

  // declares mutable state used in this scope
  let totalDamageDealt = 0;
  // declares mutable state used in this scope
  let totalDamageTaken = 0;
  // declares mutable state used in this scope
  let totalEnemiesKilled = 0;
  // declares mutable state used in this scope
  let totalCoinsCollected = 0;
  // declares mutable state used in this scope
  let totalDurationSeconds = 0;
  // declares mutable state used in this scope
  let totalLevelsReached = 0;
  // declares mutable state used in this scope
  let bestMatchDamage = 0;
  // declares mutable state used in this scope
  let bestMatchKills = 0;
  // declares mutable state used in this scope
  let bestMatchSurvivalSeconds = 0;
  // declares mutable state used in this scope
  let highestLevelReached = 0;
  // declares mutable state used in this scope
  let bestMatchCoins = 0;
  // declares mutable state used in this scope
  let bestMatchScore = 0;
  // declares mutable state used in this scope
  let shortMatchesCount = 0;
  // declares mutable state used in this scope
  let longMatchesCount = 0;
  // declares a constant used in this scope
  const performanceScores = [];

  // declares a constant used in this scope
  const SHORT_MATCH_THRESHOLD_SECONDS = 2 * 60;
  // declares a constant used in this scope
  const LONG_MATCH_THRESHOLD_SECONDS = 10 * 60;

  // defines an arrow function used by surrounding logic
  rows.forEach((match) => {
    // declares a constant used in this scope
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    // declares a constant used in this scope
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    // declares a constant used in this scope
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    // declares a constant used in this scope
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    // declares a constant used in this scope
    const durationSeconds = toNonNegativeInt(match?.durationSeconds);
    // declares a constant used in this scope
    const levelReached = toNonNegativeInt(match?.levelReached);

    // executes this operation step as part of the flow
    totalDamageDealt += damageDealt;
    // executes this operation step as part of the flow
    totalDamageTaken += damageTaken;
    // executes this operation step as part of the flow
    totalEnemiesKilled += enemiesKilled;
    // executes this operation step as part of the flow
    totalCoinsCollected += coinsCollected;
    // executes this operation step as part of the flow
    totalDurationSeconds += durationSeconds;
    // executes this operation step as part of the flow
    totalLevelsReached += levelReached;

    // executes this operation step as part of the flow
    bestMatchDamage = Math.max(bestMatchDamage, damageDealt);
    // executes this operation step as part of the flow
    bestMatchKills = Math.max(bestMatchKills, enemiesKilled);
    // executes this operation step as part of the flow
    bestMatchSurvivalSeconds = Math.max(
      bestMatchSurvivalSeconds,
      durationSeconds,
    );
    // executes this operation step as part of the flow
    highestLevelReached = Math.max(highestLevelReached, levelReached);
    // executes this operation step as part of the flow
    bestMatchCoins = Math.max(bestMatchCoins, coinsCollected);

    // checks a condition before executing this branch
    if (durationSeconds < SHORT_MATCH_THRESHOLD_SECONDS) {
      // executes this operation step as part of the flow
      shortMatchesCount += 1;
    }
    // checks a condition before executing this branch
    if (durationSeconds > LONG_MATCH_THRESHOLD_SECONDS) {
      // executes this operation step as part of the flow
      longMatchesCount += 1;
    }

    // declares a constant used in this scope
    const performanceScore =
      damageDealt +
      enemiesKilled * 120 +
      coinsCollected * 4 +
      // executes this operation step as part of the flow
      levelReached * 250;
    // executes this operation step as part of the flow
    bestMatchScore = Math.max(bestMatchScore, performanceScore);
    // executes this operation step as part of the flow
    performanceScores.push(performanceScore);
  });

  // declares a constant used in this scope
  const matchesPlayed = rows.length;
  // declares a constant used in this scope
  const totalDurationMinutes = totalDurationSeconds / 60;

  // returns a value from the current function
  return {
    matchesPlayed,
    // sets a named field inside an object or configuration block
    damageDealt: totalDamageDealt,
    // sets a named field inside an object or configuration block
    damageTaken: totalDamageTaken,
    // sets a named field inside an object or configuration block
    enemiesKilled: totalEnemiesKilled,
    // sets a named field inside an object or configuration block
    coinsCollected: totalCoinsCollected,
    // sets a named field inside an object or configuration block
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    totalLevelsReached,
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
    // sets a named field inside an object or configuration block
    averageDamagePerMatch: toNonNegativeInt(
      safeDivide(totalDamageDealt, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    averageKillsPerMatch: toNonNegativeInt(
      safeDivide(totalEnemiesKilled, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    averageCoinsPerMatch: toNonNegativeInt(
      safeDivide(totalCoinsCollected, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    averageDamagePerMinute: toNonNegativeInt(
      safeDivide(totalDamageDealt, totalDurationMinutes),
    ),
    // sets a named field inside an object or configuration block
    averageKillsPerMinute: toNonNegativeInt(
      safeDivide(totalEnemiesKilled, totalDurationMinutes),
    ),
    // sets a named field inside an object or configuration block
    averageSurvivalSecondsPerMatch: toNonNegativeInt(
      safeDivide(totalDurationSeconds, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    shortMatchRatioPercent: toNonNegativeInt(
      safeDivide(shortMatchesCount * 100, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    longMatchRatioPercent: toNonNegativeInt(
      safeDivide(longMatchesCount * 100, matchesPlayed),
    ),
    // sets a named field inside an object or configuration block
    performanceVolatilityPercent: toNonNegativeInt(
      calculateCoefficientOfVariationPercent(performanceScores),
    ),
  };
}

// declares a helper function for a focused task
function applyStatsToCards(container, stats) {
  // declares a constant used in this scope
  const setStatTarget = (statKey, value) => {
    // declares a constant used in this scope
    const valueEl = container.querySelector(
      // executes this operation step as part of the flow
      `.js-st-count[data-stat="${statKey}"]`,
    );
    // checks a condition before executing this branch
    if (!valueEl) return;
    // executes this operation step as part of the flow
    valueEl.dataset.target = String(value);
  };

  // executes this operation step as part of the flow
  setStatTarget("damage", toNonNegativeInt(stats.damageDealt));
  // executes this operation step as part of the flow
  setStatTarget("damage-taken", toNonNegativeInt(stats.damageTaken));
  // executes this operation step as part of the flow
  setStatTarget("kills", toNonNegativeInt(stats.enemiesKilled));
  // executes this operation step as part of the flow
  setStatTarget("time-lived", toNonNegativeInt(stats.totalMinutesLived));
  // executes this operation step as part of the flow
  setStatTarget("matches", toNonNegativeInt(stats.matchesPlayed));
  // executes this operation step as part of the flow
  setStatTarget("coins", toNonNegativeInt(stats.coinsCollected));
  setStatTarget(
    "avg-damage-match",
    toNonNegativeInt(stats.averageDamagePerMatch),
  );
  setStatTarget(
    "avg-kills-match",
    toNonNegativeInt(stats.averageKillsPerMatch),
  );
  setStatTarget(
    "avg-coins-match",
    toNonNegativeInt(stats.averageCoinsPerMatch),
  );
  setStatTarget(
    "avg-kills-minute",
    toNonNegativeInt(stats.averageKillsPerMinute),
  );
  setStatTarget(
    "avg-damage-minute",
    toNonNegativeInt(stats.averageDamagePerMinute),
  );
  setStatTarget(
    "avg-survival-match",
    toNonNegativeInt(stats.averageSurvivalSecondsPerMatch),
  );
  // executes this operation step as part of the flow
  setStatTarget("best-damage", toNonNegativeInt(stats.bestMatchDamage));
  // executes this operation step as part of the flow
  setStatTarget("best-kills", toNonNegativeInt(stats.bestMatchKills));
  setStatTarget(
    "best-survival",
    toNonNegativeInt(stats.bestMatchSurvivalSeconds),
  );
  // executes this operation step as part of the flow
  setStatTarget("highest-level", toNonNegativeInt(stats.highestLevelReached));
  // executes this operation step as part of the flow
  setStatTarget("best-coins", toNonNegativeInt(stats.bestMatchCoins));
  // executes this operation step as part of the flow
  setStatTarget("best-score", toNonNegativeInt(stats.bestMatchScore));
  setStatTarget(
    "short-match-ratio",
    toNonNegativeInt(stats.shortMatchRatioPercent),
  );
  setStatTarget(
    "long-match-ratio",
    toNonNegativeInt(stats.longMatchRatioPercent),
  );
  setStatTarget(
    "performance-volatility",
    toNonNegativeInt(stats.performanceVolatilityPercent),
  );
}

// declares a helper function for a focused task
function formatCount(value) {
  // returns a value from the current function
  return toNonNegativeInt(value).toLocaleString("en-US");
}

// declares a helper function for a focused task
function calculateCoefficientOfVariationPercent(values) {
  // checks a condition before executing this branch
  if (!Array.isArray(values) || values.length < 2) return 0;

  // declares a constant used in this scope
  const normalized = values
    // executes this operation step as part of the flow
    .map((value) => Number(value))
    // executes this operation step as part of the flow
    .filter((value) => Number.isFinite(value) && value >= 0);

  // checks a condition before executing this branch
  if (normalized.length < 2) return 0;

  // declares a constant used in this scope
  const mean =
    // executes this operation step as part of the flow
    normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  // checks a condition before executing this branch
  if (mean <= 0) return 0;

  // declares a constant used in this scope
  const variance =
    normalized
      // executes this operation step as part of the flow
      .map((value) => Math.pow(value - mean, 2))
      // executes this operation step as part of the flow
      .reduce((sum, value) => sum + value, 0) / normalized.length;

  // declares a constant used in this scope
  const standardDeviation = Math.sqrt(variance);
  // returns a value from the current function
  return safeDivide(standardDeviation * 100, mean);
}

// declares a helper function for a focused task
function animateStStats(container) {
  // declares a constant used in this scope
  const valueEls = container.querySelectorAll(".js-st-count");
  // checks a condition before executing this branch
  if (!valueEls.length) return;

  // declares a constant used in this scope
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // declares a helper function for a focused task
  function formatInt(value) {
    // returns a value from the current function
    return Math.round(value).toLocaleString("en-US");
  }

  // declares a helper function for a focused task
  function formatHoursMinutes(totalMinutesFloat) {
    // declares a constant used in this scope
    const totalMinutes = Math.max(0, Math.round(totalMinutesFloat));
    // declares a constant used in this scope
    const hours = Math.floor(totalMinutes / 60);
    // declares a constant used in this scope
    const minutes = totalMinutes % 60;
    // returns a value from the current function
    return `${hours}h ${minutes}m`;
  }

  // declares a helper function for a focused task
  function formatHoursMinutesSeconds(totalSecondsFloat) {
    // declares a constant used in this scope
    const totalSeconds = Math.max(0, Math.round(totalSecondsFloat));
    // declares a constant used in this scope
    const hours = Math.floor(totalSeconds / 3600);
    // declares a constant used in this scope
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // declares a constant used in this scope
    const seconds = totalSeconds % 60;
    // returns a value from the current function
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // defines an arrow function used by surrounding logic
  valueEls.forEach((el, index) => {
    // declares a constant used in this scope
    const type = el.dataset.type || "int";
    // declares a constant used in this scope
    const targetValue = Number(el.dataset.target);
    // checks a condition before executing this branch
    if (!Number.isFinite(targetValue)) return;

    // declares a constant used in this scope
    const startDelay = 120 + index * 55;
    // declares a constant used in this scope
    const duration = type === "int" ? 900 : 780;
    // declares a constant used in this scope
    const startValue = 0;

    // executes this operation step as part of the flow
    el.classList.add("is-counting");

    // declares a constant used in this scope
    const render = (value) => {
      // checks a condition before executing this branch
      if (type === "time-hm") {
        // executes this operation step as part of the flow
        el.textContent = formatHoursMinutes(value);
        // returns a value from the current function
        return;
      }
      // checks a condition before executing this branch
      if (type === "time-hms") {
        // executes this operation step as part of the flow
        el.textContent = formatHoursMinutesSeconds(value);
        // returns a value from the current function
        return;
      }
      // executes this operation step as part of the flow
      el.textContent = formatInt(value);
    };

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

// declares a helper function for a focused task
function safeDivide(numerator, denominator) {
  // declares a constant used in this scope
  const left = Number(numerator);
  // declares a constant used in this scope
  const right = Number(denominator);
  // checks a condition before executing this branch
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= 0) {
    // returns a value from the current function
    return 0;
  }

  // returns a value from the current function
  return left / right;
}

// declares a helper function for a focused task
function escapeHtml(value) {
  // returns a value from the current function
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // executes this operation step as part of the flow
    .replace(/'/g, "&#39;");
}

// declares a helper function for a focused task
function normalizeDurationSeconds(value) {
  // declares a constant used in this scope
  const parsed = Number(value);
  // checks a condition before executing this branch
  if (!Number.isFinite(parsed)) return 0;

  // declares a constant used in this scope
  const nonNegative = Math.max(0, parsed);

  // Backend match time is stored in ms in current API responses.
  // For compatibility with potential legacy second-based values,
  // only convert to seconds when the number is clearly ms-sized.
  if (nonNegative >= 10_000) {
    // returns a value from the current function
    return Math.round(nonNegative / 1000);
  }

  // returns a value from the current function
  return Math.round(nonNegative);
}

// declares a helper function for a focused task
function toNonNegativeInt(value) {
  // declares a constant used in this scope
  const parsed = Number(value);
  // checks a condition before executing this branch
  if (!Number.isFinite(parsed)) return 0;
  // returns a value from the current function
  return Math.max(0, Math.round(parsed));
}

// declares a helper function for a focused task
function normalizePlayedAt(value) {
  // declares a constant used in this scope
  const raw = typeof value === "string" ? value.trim() : "";
  // declares a constant used in this scope
  const parsed = raw ? parseBackendDate(raw) : null;

  // checks a condition before executing this branch
  if (parsed && !Number.isNaN(parsed.getTime())) {
    // returns a value from the current function
    return raw;
  }

  // returns a value from the current function
  return new Date(0).toISOString();
}

// declares a helper function for a focused task
function parseBackendDate(value) {
  // declares a constant used in this scope
  const raw = typeof value === "string" ? value.trim() : "";
  // declares a constant used in this scope
  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(raw);
  // declares a constant used in this scope
  const normalized = raw && !hasTimezone ? `${raw}Z` : raw;
  // returns a value from the current function
  return new Date(normalized);
}