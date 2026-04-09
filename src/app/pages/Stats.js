// stats page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/Stats.css";
// imports dependencies used by this module
import { API_BASE, getUser, logout, authFetch } from "../services/auth.js";
// imports dependencies used by this module
import { confirmLogout } from "../effects/logout-confirm.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";

// exports the main function for this module
export default function Stats(container) {
  // executes this operation step as part of the flow
  container.innerHTML = `
    

    <div class="st-root">
      <div class="st-glow"></div>

      <!-- ===== NAVBAR ===== -->
      <nav class="st-nav">
        <div class="st-nav-inner">

          <a href="/main" data-link class="st-logo">Bloodwave</a>

          <div class="st-links">
            <a href="/main" data-link class="st-link"><span>Matches</span></a>
            <a href="/stats" data-link class="st-link active"><span>Stats</span></a>
            <a href="/leaderboard" data-link class="st-link"><span>Leaderboard</span></a>
            <a href="/achievements" data-link class="st-link"><span>Achievements</span></a>
          </div>

          <div class="st-right">
            <a href="/main" data-link class="st-nav-link" id="stBackToDashboard" style="display:none;">Back to Dashboard</a>
            <div class="st-avatar-wrap">
              <button class="st-avatar" id="st-avatar-btn" aria-label="Profile menu" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>
              <div class="st-avatar-dropdown" id="st-avatar-dropdown" role="menu">
                <div class="st-dd-header">
                  <div class="st-dd-username" id="st-dd-username">-</div>
                  <div class="st-dd-role">Member</div>
                </div>
                <a href="/user-panel" data-link class="st-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15a7.488 7.488 0 0 0-5.982 3.725m11.964 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275m11.963 0A24.973 24.973 0 0 1 12 16.5a24.973 24.973 0 0 1-5.982 2.275" />
                  </svg>
                  Profile
                </a>
                <a href="/android-download" data-link class="st-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
                  </svg>
                  Installation
                </a>
                <a href="/backend-status" data-link class="st-dd-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5 8.25 9l3 3 4.5-6 4.5 7.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 19.5h16.5" />
                  </svg>
                  API Status
                </a>
                <div class="st-dd-divider"></div>
                <button class="st-dd-item logout" id="st-dd-logout" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <button class="st-hamburger" id="st-hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span class="st-bar"></span>
              <span class="st-bar"></span>
              <span class="st-bar"></span>
            </button>
          </div>

        </div>

        <div class="st-mobile-menu" id="st-mobile-menu">
          <div class="st-mobile-menu-inner">
            <a href="/main" data-link class="st-mobile-link">Matches</a>
            <a href="/stats" data-link class="st-mobile-link">Stats</a>
            <a href="/leaderboard" data-link class="st-mobile-link">Leaderboard</a>
            <a href="/achievements" data-link class="st-mobile-link">Achievements</a>
            <div class="st-mobile-divider"></div>
            <div class="st-mobile-profile" style="pointer-events:none; cursor:default;">
              <span class="st-mobile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <span id="st-mobile-username">—</span>
            </div>
            <div class="st-mobile-divider"></div>
            <a href="/user-panel" data-link class="st-mobile-link">Profile</a>
            <a href="/android-download" data-link class="st-mobile-link">Installation</a>
            <a href="/backend-status" data-link class="st-mobile-link">API Status</a>
            <button class="st-mobile-logout" id="st-mobile-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- ===== CONTENT ===== -->
      <main class="st-content">
        <div class="st-inner">

          <!-- Header -->
          <div class="st-header">
            <div class="st-ornament">
              <div class="st-ornament-line"></div>
              <div class="st-ornament-diamond"></div>
              <div class="st-ornament-line"></div>
            </div>
            <h1 class="st-title">All&#8209;Time Stats</h1>
            <p class="st-subtitle">Lifetime&nbsp;&nbsp;performance&nbsp;&nbsp;overview</p>
            <p class="st-viewing-user" id="st-viewing-user" style="display:none;">
              <span class="st-viewing-kicker">Viewing</span>
              <span class="st-viewing-name" id="st-viewing-name">-</span>
            </p>
          </div>

          <!-- Stat cards -->
          <div class="st-sections">
            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Core Totals</h2>
                <p class="st-section-subtitle">Overall lifetime volume</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Damage Dealt -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Dealt</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="damage" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total damage</div>
              </div>
            </div>

            <!-- Damage Taken -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v6c0 5.25-3.438 8.813-7 10-3.563-1.188-7-4.75-7-10V6l7-3Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 10.5" />
                  </svg>
                </div>
                <div class="st-card-name">Damage Taken</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="damage-taken" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total damage received</div>
              </div>
            </div>

            <!-- Enemies Killed -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
                <div class="st-card-name">Enemies Killed</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="kills" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">eliminations</div>
              </div>
            </div>

            <!-- Time Lived -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Time Lived</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="time-lived" data-type="time-hm" data-target="0">0h 0m</div>
                <div class="st-card-unit">total survival time</div>
              </div>
            </div>

            <!-- Matches Played -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <div class="st-card-name">Matches Played</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="matches" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total games</div>
              </div>
            </div>

            <!-- Coins Collected -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div class="st-card-name">Coins Collected</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="coins" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">total coins</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Per Match Efficiency</h2>
                <p class="st-section-subtitle">Average output and pace</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Avg Damage / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Damage / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-damage-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">damage per game</div>
              </div>
            </div>

            <!-- Avg Kills / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5v14" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Kills / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-kills-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">kills per game</div>
              </div>
            </div>

            <!-- Avg Coins / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Coins / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-coins-match" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">coins per game</div>
              </div>
            </div>

            <!-- Avg Kills / Minute -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Kills / Minute</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-kills-minute" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">kills per minute</div>
              </div>
            </div>

            <!-- Avg Damage / Minute -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 16h10" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Damage / Minute</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-damage-minute" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">damage per minute</div>
              </div>
            </div>

            <!-- Avg Survival / Match -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Avg Survival / Match</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="avg-survival-match" data-type="time-hms" data-target="0">0h 0m 0s</div>
                <div class="st-card-unit">time per game</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Peak Records</h2>
                <p class="st-section-subtitle">Best single-run highlights</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Best Match Damage -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.2-4.8-2.5-4.8 2.5.9-5.2L4.3 8.6l5.3-.8L12 3z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Damage</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-damage" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match damage</div>
              </div>
            </div>

            <!-- Best Match Kills -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2 6h6l-5 3.5L17 19l-5-4-5 4 2-6.5L4 9h6l2-6z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Kills</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-kills" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match kills</div>
              </div>
            </div>

            <!-- Best Match Survival -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3.5 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Survival</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-survival" data-type="time-hms" data-target="0">0h 0m 0s</div>
                <div class="st-card-unit">longest single match</div>
              </div>
            </div>

            <!-- Highest Level Reached -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16M7 17V9m5 8V5m5 12v-6" />
                  </svg>
                </div>
                <div class="st-card-name">Highest Level Reached</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="highest-level" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">all-time best level</div>
              </div>
            </div>

            <!-- Best Match Coins -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.2 4.6 5 .7-3.6 3.4.9 4.9L12 14.3l-4.5 2.3.9-4.9-3.6-3.4 5-.7L12 3z" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Coins</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-coins" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top single-match coins</div>
              </div>
            </div>

            <!-- Best Match Score -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16M7 17V9m5 8V5m5 12v-6" />
                  </svg>
                </div>
                <div class="st-card-name">Best Match Score</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="best-score" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">top weighted run score</div>
              </div>
            </div>

              </div>
            </section>

            <section class="st-stat-section">
              <div class="st-section-head">
                <h2 class="st-section-title">Run Shape And Stability</h2>
                <p class="st-section-subtitle">Session length distribution and consistency</p>
              </div>
              <div class="st-grid st-grid--section">

            <!-- Short Match Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v4" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12l2 1" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Short Match Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="short-match-ratio" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">under 2 min (%)</div>
              </div>
            </div>

            <!-- Long Match Ratio -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 13l3 2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div class="st-card-name">Long Match Ratio</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="long-match-ratio" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">over 10 min (%)</div>
              </div>
            </div>

            <!-- Performance Volatility -->
            <div class="st-card">
              <div class="st-card-corner st-card-corner--tl"></div>
              <div class="st-card-corner st-card-corner--tr"></div>
              <div class="st-card-corner st-card-corner--bl"></div>
              <div class="st-card-corner st-card-corner--br"></div>
              <div class="st-card-body">
                <div class="st-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="rgba(192,57,43,0.8)" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 17l6-6 4 4 8-8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18" />
                  </svg>
                </div>
                <div class="st-card-name">Performance Volatility</div>
                <div class="st-card-sep"></div>
                <div class="st-card-value js-st-count" data-stat="performance-volatility" data-type="int" data-target="0">0</div>
                <div class="st-card-unit">lower = more stable (%)</div>
              </div>
            </div>

              </div>
            </section>
          </div>

          <section class="st-viz" aria-label="Visual analytics">
            <div class="st-viz-head">
              <div class="st-viz-line"></div>
              <h2 class="st-viz-title">Visual Analytics</h2>
              <div class="st-viz-line"></div>
            </div>

            <div class="st-viz-grid">
              <article class="st-viz-card st-viz-card--ratio">
                <h3 class="st-viz-card-title">Match Duration Split</h3>
                <div class="st-ratio-track" id="st-ratio-track" role="img" aria-label="Short, normal and long match ratio">
                  <span class="st-ratio-segment short" id="st-ratio-short"></span>
                  <span class="st-ratio-segment normal" id="st-ratio-normal"></span>
                  <span class="st-ratio-segment long" id="st-ratio-long"></span>
                </div>
                <div class="st-ratio-legend">
                  <div class="st-ratio-item"><span class="dot short"></span><span>Short (&lt;2m)</span><strong id="st-ratio-short-label">0%</strong></div>
                  <div class="st-ratio-item"><span class="dot normal"></span><span>Normal</span><strong id="st-ratio-normal-label">0%</strong></div>
                  <div class="st-ratio-item"><span class="dot long"></span><span>Long (&gt;10m)</span><strong id="st-ratio-long-label">0%</strong></div>
                </div>
              </article>

              <article class="st-viz-card st-viz-card--bars">
                <h3 class="st-viz-card-title">Per Match Performance</h3>
                <div class="st-bars" id="st-bars">
                  <div class="st-bar-row">
                    <span class="st-bar-label">Damage</span>
                    <div class="st-bar-track"><span class="st-bar-fill damage" id="st-bar-damage"></span></div>
                    <span class="st-bar-value" id="st-bar-damage-value">0</span>
                  </div>
                  <div class="st-bar-row">
                    <span class="st-bar-label">Kills</span>
                    <div class="st-bar-track"><span class="st-bar-fill kills" id="st-bar-kills"></span></div>
                    <span class="st-bar-value" id="st-bar-kills-value">0</span>
                  </div>
                  <div class="st-bar-row">
                    <span class="st-bar-label">Coins</span>
                    <div class="st-bar-track"><span class="st-bar-fill coins" id="st-bar-coins"></span></div>
                    <span class="st-bar-value" id="st-bar-coins-value">0</span>
                  </div>
                </div>
              </article>

              <article class="st-viz-card st-viz-card--gauge">
                <h3 class="st-viz-card-title">Stability Gauge</h3>
                <div class="st-gauge" id="st-gauge" role="img" aria-label="Performance stability gauge">
                  <div class="st-gauge-inner">
                    <div class="st-gauge-value" id="st-gauge-value">0</div>
                    <div class="st-gauge-unit">volatility %</div>
                  </div>
                </div>
                <p class="st-gauge-note" id="st-gauge-note">Very stable</p>
              </article>

              <article class="st-viz-card st-viz-card--timeline">
                <h3 class="st-viz-card-title">Last 10 Matches Timeline</h3>
                <div class="st-timeline-wrap">
                  <div class="st-timeline-gridlines"></div>
                  <div class="st-timeline-line" id="st-timeline-line"></div>
                  <div class="st-timeline-points" id="st-timeline-points" role="img" aria-label="Last ten matches timeline with hover details"></div>
                </div>
                <div class="st-timeline-foot">
                  <span>older</span>
                  <strong>match flow</strong>
                  <span>newer</span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

    </div>
  `;

  // ── Canvas starfield ──────────────────────────────────────────────────────
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const user = getUser();
  // declares a constant used in this scope
  const displayName = user?.username ?? user?.email ?? "Member";
  // declares a constant used in this scope
  const ddUsername = container.querySelector("#st-dd-username");
  // declares a constant used in this scope
  const mobileUsername = container.querySelector("#st-mobile-username");
  // checks a condition before executing this branch
  if (ddUsername) ddUsername.textContent = displayName;
  // checks a condition before executing this branch
  if (mobileUsername) mobileUsername.textContent = displayName;
  // executes this operation step as part of the flow
  refreshNavbarUsername();
  // executes this operation step as part of the flow
  reorderStatCards(container);
  // executes this operation step as part of the flow
  updateNavbarLinksForPlayer(container);

  // executes this operation step as part of the flow
  loadAllTimeStats(container, user);

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

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger = container.querySelector("#st-hamburger");
  // declares a constant used in this scope
  const mobileMenu = container.querySelector("#st-mobile-menu");
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

  // defines an arrow function used by surrounding logic
  mobileMenu?.querySelectorAll(".st-mobile-link").forEach((link) => {
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
  const avatarBtn = container.querySelector("#st-avatar-btn");
  // declares a constant used in this scope
  const avatarDrop = container.querySelector("#st-avatar-dropdown");
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

  // attaches a dom event listener for user interaction
  document.addEventListener("click", (e) => {
    // checks a condition before executing this branch
    if (dropOpen && !avatarDrop.contains(e.target) && e.target !== avatarBtn) {
      // executes this operation step as part of the flow
      closeDrop();
    }
  });

  // attaches a dom event listener for user interaction
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
  };

  // attaches a dom event listener for user interaction
  container.querySelector("#st-dd-logout")?.addEventListener("click", doLogout);
  container
    .querySelector("#st-mobile-logout")
    // attaches a dom event listener for user interaction
    ?.addEventListener("click", doLogout);
}

// declares a helper function for a focused task
function reorderStatCards(container) {
  // declares a constant used in this scope
  const sectionOrders = {
    "Core Totals": [
      "matches",
      "time-lived",
      "damage",
      "damage-taken",
      "kills",
      "coins",
    ],
    "Per Match Efficiency": [
      "avg-survival-match",
      "avg-damage-match",
      "avg-damage-minute",
      "avg-kills-match",
      "avg-kills-minute",
      "avg-coins-match",
    ],
    "Peak Records": [
      "best-score",
      "highest-level",
      "best-survival",
      "best-damage",
      "best-kills",
      "best-coins",
    ],
    "Run Shape And Stability": [
      "short-match-ratio",
      "long-match-ratio",
      "performance-volatility",
    ],
  };

  // declares a constant used in this scope
  const sections = container.querySelectorAll(".st-stat-section");
  // defines an arrow function used by surrounding logic
  sections.forEach((sectionEl) => {
    // declares a constant used in this scope
    const titleEl = sectionEl.querySelector(".st-section-title");
    // declares a constant used in this scope
    const gridEl = sectionEl.querySelector(".st-grid--section");
    // checks a condition before executing this branch
    if (!titleEl || !gridEl) return;

    // declares a constant used in this scope
    const desiredOrder = sectionOrders[titleEl.textContent?.trim()];
    // checks a condition before executing this branch
    if (!Array.isArray(desiredOrder) || !desiredOrder.length) return;

    // declares a constant used in this scope
    const cards = Array.from(gridEl.querySelectorAll(".st-card"));
    // declares a constant used in this scope
    const cardsByStat = new Map();

    // defines an arrow function used by surrounding logic
    cards.forEach((cardEl) => {
      // declares a constant used in this scope
      const valueEl = cardEl.querySelector(".js-st-count[data-stat]");
      // declares a constant used in this scope
      const statKey = valueEl?.dataset?.stat;
      // checks a condition before executing this branch
      if (statKey) {
        // executes this operation step as part of the flow
        cardsByStat.set(statKey, cardEl);
      }
    });

    // defines an arrow function used by surrounding logic
    desiredOrder.forEach((statKey) => {
      // declares a constant used in this scope
      const cardEl = cardsByStat.get(statKey);
      // checks a condition before executing this branch
      if (cardEl) {
        // executes this operation step as part of the flow
        gridEl.appendChild(cardEl);
      }
    });
  });
}

async function loadAllTimeStats(container, user) {
  // declares a constant used in this scope
  const playerId = resolvePlayerId(user);
  // declares a constant used in this scope
  const fallbackStats = {
    // sets a named field inside an object or configuration block
    damageDealt: 0,
    // sets a named field inside an object or configuration block
    damageTaken: 0,
    // sets a named field inside an object or configuration block
    enemiesKilled: 0,
    // sets a named field inside an object or configuration block
    totalMinutesLived: 0,
    // sets a named field inside an object or configuration block
    matchesPlayed: 0,
    // sets a named field inside an object or configuration block
    coinsCollected: 0,
    // sets a named field inside an object or configuration block
    totalLevelsReached: 0,
    // sets a named field inside an object or configuration block
    averageDamagePerMatch: 0,
    // sets a named field inside an object or configuration block
    averageKillsPerMatch: 0,
    // sets a named field inside an object or configuration block
    averageCoinsPerMatch: 0,
    // sets a named field inside an object or configuration block
    averageKillsPerMinute: 0,
    // sets a named field inside an object or configuration block
    averageDamagePerMinute: 0,
    // sets a named field inside an object or configuration block
    averageSurvivalSecondsPerMatch: 0,
    // sets a named field inside an object or configuration block
    bestMatchDamage: 0,
    // sets a named field inside an object or configuration block
    bestMatchKills: 0,
    // sets a named field inside an object or configuration block
    bestMatchSurvivalSeconds: 0,
    // sets a named field inside an object or configuration block
    highestLevelReached: 0,
    // sets a named field inside an object or configuration block
    bestMatchCoins: 0,
    // sets a named field inside an object or configuration block
    bestMatchScore: 0,
    // sets a named field inside an object or configuration block
    shortMatchRatioPercent: 0,
    // sets a named field inside an object or configuration block
    longMatchRatioPercent: 0,
    // sets a named field inside an object or configuration block
    performanceVolatilityPercent: 0,
    // sets a named field inside an object or configuration block
    recentTimelineMatches: [],
  };

  // checks a condition before executing this branch
  if (!playerId) {
    // executes this operation step as part of the flow
    applyStatsToCards(container, fallbackStats);
    // executes this operation step as part of the flow
    renderStatsVisuals(container, fallbackStats);
    // executes this operation step as part of the flow
    animateStStats(container);
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
      throw new Error("Failed to fetch player matches");
    }

    // declares a constant used in this scope
    const apiMatches = await parseResponsePayload(response);
    // declares a constant used in this scope
    const stats = aggregateMatchStats(apiMatches);
    // executes this operation step as part of the flow
    applyStatsToCards(container, stats);
    // executes this operation step as part of the flow
    renderStatsVisuals(container, stats);
  } catch {
    // executes this operation step as part of the flow
    applyStatsToCards(container, fallbackStats);
    // executes this operation step as part of the flow
    renderStatsVisuals(container, fallbackStats);
  }

  // executes this operation step as part of the flow
  animateStStats(container);
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
function aggregateMatchStats(apiMatches) {
  // checks a condition before executing this branch
  if (!Array.isArray(apiMatches)) {
    // returns a value from the current function
    return {
      // sets a named field inside an object or configuration block
      damageDealt: 0,
      // sets a named field inside an object or configuration block
      damageTaken: 0,
      // sets a named field inside an object or configuration block
      enemiesKilled: 0,
      // sets a named field inside an object or configuration block
      totalMinutesLived: 0,
      // sets a named field inside an object or configuration block
      matchesPlayed: 0,
      // sets a named field inside an object or configuration block
      coinsCollected: 0,
      // sets a named field inside an object or configuration block
      totalLevelsReached: 0,
      // sets a named field inside an object or configuration block
      averageDamagePerMatch: 0,
      // sets a named field inside an object or configuration block
      averageKillsPerMatch: 0,
      // sets a named field inside an object or configuration block
      averageCoinsPerMatch: 0,
      // sets a named field inside an object or configuration block
      averageKillsPerMinute: 0,
      // sets a named field inside an object or configuration block
      averageDamagePerMinute: 0,
      // sets a named field inside an object or configuration block
      averageSurvivalSecondsPerMatch: 0,
      // sets a named field inside an object or configuration block
      bestMatchDamage: 0,
      // sets a named field inside an object or configuration block
      bestMatchKills: 0,
      // sets a named field inside an object or configuration block
      bestMatchSurvivalSeconds: 0,
      // sets a named field inside an object or configuration block
      highestLevelReached: 0,
      // sets a named field inside an object or configuration block
      bestMatchCoins: 0,
      // sets a named field inside an object or configuration block
      bestMatchScore: 0,
      // sets a named field inside an object or configuration block
      shortMatchRatioPercent: 0,
      // sets a named field inside an object or configuration block
      longMatchRatioPercent: 0,
      // sets a named field inside an object or configuration block
      performanceVolatilityPercent: 0,
      // sets a named field inside an object or configuration block
      recentTimelineMatches: [],
    };
  }

  // declares a constant used in this scope
  const SHORT_MATCH_THRESHOLD_SECONDS = 2 * 60;
  // declares a constant used in this scope
  const LONG_MATCH_THRESHOLD_SECONDS = 10 * 60;

  // declares mutable state used in this scope
  let totalDamageDealt = 0;
  // declares mutable state used in this scope
  let totalDamageTaken = 0;
  // declares mutable state used in this scope
  let totalEnemiesKilled = 0;
  // declares mutable state used in this scope
  let totalDurationSeconds = 0;
  // declares mutable state used in this scope
  let totalCoinsCollected = 0;
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

  // defines an arrow function used by surrounding logic
  apiMatches.forEach((match) => {
    // declares a constant used in this scope
    const damageDealt = toNonNegativeInt(match?.damageDealt);
    // declares a constant used in this scope
    const damageTaken = toNonNegativeInt(match?.damageTaken);
    // declares a constant used in this scope
    const enemiesKilled = toNonNegativeInt(match?.enemiesKilled);
    // declares a constant used in this scope
    const durationSeconds = normalizeDurationSeconds(match?.time);
    // declares a constant used in this scope
    const coinsCollected = toNonNegativeInt(match?.coinsCollected);
    // declares a constant used in this scope
    const levelReached = toNonNegativeInt(match?.level);

    // executes this operation step as part of the flow
    totalDamageDealt += damageDealt;
    // executes this operation step as part of the flow
    totalDamageTaken += damageTaken;
    // executes this operation step as part of the flow
    totalEnemiesKilled += enemiesKilled;
    // executes this operation step as part of the flow
    totalDurationSeconds += durationSeconds;
    // executes this operation step as part of the flow
    totalCoinsCollected += coinsCollected;
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
  const matchesPlayed = apiMatches.length;
  // declares a constant used in this scope
  const totalDurationMinutes = totalDurationSeconds / 60;
  // declares a constant used in this scope
  const recentTimelineMatches = buildRecentTimelineMatches(apiMatches);

  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    damageDealt: totalDamageDealt,
    // sets a named field inside an object or configuration block
    damageTaken: totalDamageTaken,
    // sets a named field inside an object or configuration block
    enemiesKilled: totalEnemiesKilled,
    // sets a named field inside an object or configuration block
    totalMinutesLived: Math.round(totalDurationSeconds / 60),
    matchesPlayed,
    // sets a named field inside an object or configuration block
    coinsCollected: totalCoinsCollected,
    totalLevelsReached,
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
    averageKillsPerMinute: toNonNegativeInt(
      safeDivide(totalEnemiesKilled, totalDurationMinutes),
    ),
    // sets a named field inside an object or configuration block
    averageDamagePerMinute: toNonNegativeInt(
      safeDivide(totalDamageDealt, totalDurationMinutes),
    ),
    // sets a named field inside an object or configuration block
    averageSurvivalSecondsPerMatch: toNonNegativeInt(
      safeDivide(totalDurationSeconds, matchesPlayed),
    ),
    bestMatchDamage,
    bestMatchKills,
    bestMatchSurvivalSeconds,
    highestLevelReached,
    bestMatchCoins,
    bestMatchScore,
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
    recentTimelineMatches,
  };
}

// declares a helper function for a focused task
function buildRecentTimelineMatches(apiMatches) {
  // checks a condition before executing this branch
  if (!Array.isArray(apiMatches) || !apiMatches.length) return [];

  // declares a constant used in this scope
  const withDate = apiMatches.map((match, index) => {
    // declares a constant used in this scope
    const createdAtRaw =
      // executes this operation step as part of the flow
      typeof match?.createdAt === "string" ? match.createdAt.trim() : "";
    // declares a constant used in this scope
    const createdAt = createdAtRaw
      ? new Date(
          /(?:Z|[+\-]\d{2}:\d{2})$/i.test(createdAtRaw)
            ? createdAtRaw
            : `${createdAtRaw}Z`,
        )
      // executes this operation step as part of the flow
      : null;
    // declares a constant used in this scope
    const createdAtTime =
      createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.getTime()
        // executes this operation step as part of the flow
        : index;

    // declares a constant used in this scope
    const damage = toNonNegativeInt(match?.damageDealt);
    // declares a constant used in this scope
    const kills = toNonNegativeInt(match?.enemiesKilled);
    // declares a constant used in this scope
    const coins = toNonNegativeInt(match?.coinsCollected);
    // declares a constant used in this scope
    const level = toNonNegativeInt(match?.level);
    // declares a constant used in this scope
    const durationSeconds = normalizeDurationSeconds(match?.time);
    // declares a constant used in this scope
    const performanceScore = damage + kills * 120 + coins * 4 + level * 250;

    // returns a value from the current function
    return {
      damage,
      kills,
      coins,
      level,
      durationSeconds,
      performanceScore,
      createdAtTime,
    };
  });

  // returns a value from the current function
  return withDate
    // executes this operation step as part of the flow
    .sort((left, right) => left.createdAtTime - right.createdAtTime)
    .slice(-10)
    // executes this operation step as part of the flow
    .map((entry, index) => ({
      ...entry,
      // sets a named field inside an object or configuration block
      matchNumber: index + 1,
    }));
}

// declares a helper function for a focused task
function formatDurationLabel(totalSeconds) {
  // declares a constant used in this scope
  const seconds = toNonNegativeInt(totalSeconds);
  // declares a constant used in this scope
  const mins = Math.floor(seconds / 60);
  // declares a constant used in this scope
  const secs = seconds % 60;
  // returns a value from the current function
  return `${mins}m ${secs}s`;
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
function updateNavbarLinksForPlayer(container) {
  // declares a constant used in this scope
  const queryParams = new URLSearchParams(window.location.search);
  // declares a constant used in this scope
  const userIdParam = queryParams.get("userId");

  // checks a condition before executing this branch
  if (!userIdParam) return;

  // Back-only navbar in viewed-player mode.
  const navLinks = container.querySelector(".st-links");
  // declares a constant used in this scope
  const backLink = container.querySelector("#stBackToDashboard");
  // declares a constant used in this scope
  const avatarWrap = container.querySelector(".st-avatar-wrap");
  // declares a constant used in this scope
  const hamburger = container.querySelector("#st-hamburger");
  // declares a constant used in this scope
  const mobileMenu = container.querySelector("#st-mobile-menu");
  // declares a constant used in this scope
  const root = container.querySelector(".st-root");

  // checks a condition before executing this branch
  if (root) root.classList.add("st-view-mode");
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
    const viewingEl = container.querySelector("#st-viewing-user");
    // declares a constant used in this scope
    const viewingNameEl = container.querySelector("#st-viewing-name");
    // checks a condition before executing this branch
    if (viewingEl && viewingNameEl) {
      // executes this operation step as part of the flow
      viewingNameEl.textContent = username;
      // executes this operation step as part of the flow
      viewingEl.style.display = "inline-flex";
    }
  } catch {
    // declares a constant used in this scope
    const viewingEl = container.querySelector("#st-viewing-user");
    // declares a constant used in this scope
    const viewingNameEl = container.querySelector("#st-viewing-name");
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
function clamp(value, min, max) {
  // returns a value from the current function
  return Math.max(min, Math.min(max, value));
}

// declares a helper function for a focused task
function renderStatsVisuals(container, stats) {
  // declares a constant used in this scope
  const matchesPlayed = toNonNegativeInt(stats.matchesPlayed);
  // declares a constant used in this scope
  const shortRatio =
    matchesPlayed > 0
      ? clamp(toNonNegativeInt(stats.shortMatchRatioPercent), 0, 100)
      // executes this operation step as part of the flow
      : 0;
  // declares a constant used in this scope
  const longRatio =
    matchesPlayed > 0
      ? clamp(toNonNegativeInt(stats.longMatchRatioPercent), 0, 100)
      // executes this operation step as part of the flow
      : 0;
  // declares a constant used in this scope
  const normalRatio =
    // executes this operation step as part of the flow
    matchesPlayed > 0 ? clamp(100 - shortRatio - longRatio, 0, 100) : 0;

  // declares a constant used in this scope
  const shortEl = container.querySelector("#st-ratio-short");
  // declares a constant used in this scope
  const normalEl = container.querySelector("#st-ratio-normal");
  // declares a constant used in this scope
  const longEl = container.querySelector("#st-ratio-long");
  // checks a condition before executing this branch
  if (shortEl) shortEl.style.width = `${shortRatio}%`;
  // checks a condition before executing this branch
  if (normalEl) normalEl.style.width = `${normalRatio}%`;
  // checks a condition before executing this branch
  if (longEl) longEl.style.width = `${longRatio}%`;

  // declares a constant used in this scope
  const shortLabel = container.querySelector("#st-ratio-short-label");
  // declares a constant used in this scope
  const normalLabel = container.querySelector("#st-ratio-normal-label");
  // declares a constant used in this scope
  const longLabel = container.querySelector("#st-ratio-long-label");
  // checks a condition before executing this branch
  if (shortLabel) shortLabel.textContent = `${shortRatio}%`;
  // checks a condition before executing this branch
  if (normalLabel) normalLabel.textContent = `${normalRatio}%`;
  // checks a condition before executing this branch
  if (longLabel) longLabel.textContent = `${longRatio}%`;

  // declares a constant used in this scope
  const avgDamage = toNonNegativeInt(stats.averageDamagePerMatch);
  // declares a constant used in this scope
  const avgKills = toNonNegativeInt(stats.averageKillsPerMatch);
  // declares a constant used in this scope
  const avgCoins = toNonNegativeInt(stats.averageCoinsPerMatch);

  // Weight values to put different units onto one comparable visual scale.
  const damageWeighted = avgDamage;
  // declares a constant used in this scope
  const killsWeighted = avgKills * 120;
  // declares a constant used in this scope
  const coinsWeighted = avgCoins * 4;
  // declares a constant used in this scope
  const weightedBase = Math.max(
    damageWeighted,
    killsWeighted,
    coinsWeighted,
    1,
  );

  // declares a constant used in this scope
  const damageWidth = clamp(
    Math.round((damageWeighted / weightedBase) * 100),
    0,
    100,
  );
  // declares a constant used in this scope
  const killsWidth = clamp(
    Math.round((killsWeighted / weightedBase) * 100),
    0,
    100,
  );
  // declares a constant used in this scope
  const coinsWidth = clamp(
    Math.round((coinsWeighted / weightedBase) * 100),
    0,
    100,
  );

  // declares a constant used in this scope
  const damageBar = container.querySelector("#st-bar-damage");
  // declares a constant used in this scope
  const killsBar = container.querySelector("#st-bar-kills");
  // declares a constant used in this scope
  const coinsBar = container.querySelector("#st-bar-coins");
  // checks a condition before executing this branch
  if (damageBar) damageBar.style.width = `${damageWidth}%`;
  // checks a condition before executing this branch
  if (killsBar) killsBar.style.width = `${killsWidth}%`;
  // checks a condition before executing this branch
  if (coinsBar) coinsBar.style.width = `${coinsWidth}%`;

  // declares a constant used in this scope
  const damageValue = container.querySelector("#st-bar-damage-value");
  // declares a constant used in this scope
  const killsValue = container.querySelector("#st-bar-kills-value");
  // declares a constant used in this scope
  const coinsValue = container.querySelector("#st-bar-coins-value");
  // checks a condition before executing this branch
  if (damageValue) damageValue.textContent = avgDamage.toLocaleString("en-US");
  // checks a condition before executing this branch
  if (killsValue) killsValue.textContent = avgKills.toLocaleString("en-US");
  // checks a condition before executing this branch
  if (coinsValue) coinsValue.textContent = avgCoins.toLocaleString("en-US");

  // declares a constant used in this scope
  const volatility = clamp(
    toNonNegativeInt(stats.performanceVolatilityPercent),
    0,
    100,
  );
  // declares a constant used in this scope
  const gauge = container.querySelector("#st-gauge");
  // checks a condition before executing this branch
  if (gauge) {
    // executes this operation step as part of the flow
    gauge.style.setProperty("--volatility", String(volatility));
  }

  // declares a constant used in this scope
  const gaugeValue = container.querySelector("#st-gauge-value");
  // checks a condition before executing this branch
  if (gaugeValue) gaugeValue.textContent = String(volatility);

  // declares a constant used in this scope
  const gaugeNote = container.querySelector("#st-gauge-note");
  // checks a condition before executing this branch
  if (gaugeNote) {
    // checks a condition before executing this branch
    if (volatility <= 15) {
      // executes this operation step as part of the flow
      gaugeNote.textContent = "Very stable";
    // executes this operation step as part of the flow
    } else if (volatility <= 35) {
      // executes this operation step as part of the flow
      gaugeNote.textContent = "Stable";
    // executes this operation step as part of the flow
    } else if (volatility <= 60) {
      // executes this operation step as part of the flow
      gaugeNote.textContent = "Swingy";
    } else {
      // executes this operation step as part of the flow
      gaugeNote.textContent = "High variance";
    }
  }

  // declares a constant used in this scope
  const timelineLine = container.querySelector("#st-timeline-line");
  // declares a constant used in this scope
  const timelinePoints = container.querySelector("#st-timeline-points");
  // checks a condition before executing this branch
  if (!timelineLine || !timelinePoints) return;

  // declares a constant used in this scope
  const timelineMatches = Array.isArray(stats.recentTimelineMatches)
    ? stats.recentTimelineMatches
    // executes this operation step as part of the flow
    : [];
  // executes this operation step as part of the flow
  timelinePoints.innerHTML = "";

  // checks a condition before executing this branch
  if (timelineMatches.length < 2) {
    // executes this operation step as part of the flow
    timelineLine.style.clipPath = "polygon(0% 65%, 100% 65%, 100% 69%, 0% 69%)";
    // returns a value from the current function
    return;
  }

  // declares a constant used in this scope
  const scores = timelineMatches.map((entry) =>
    toNonNegativeInt(entry.performanceScore),
  );
  // declares a constant used in this scope
  const maxScore = Math.max(...scores, 1);
  // declares a constant used in this scope
  const minScore = Math.min(...scores, 0);
  // declares a constant used in this scope
  const range = Math.max(1, maxScore - minScore);

  // declares a constant used in this scope
  const points = timelineMatches.map((entry, index) => {
    // declares a constant used in this scope
    const x = (index / (timelineMatches.length - 1)) * 100;
    // declares a constant used in this scope
    const y =
      // executes this operation step as part of the flow
      86 - ((toNonNegativeInt(entry.performanceScore) - minScore) / range) * 72;
    // returns a value from the current function
    return { x, y, entry };
  });

  // declares a constant used in this scope
  const polygonTop = points
    // executes this operation step as part of the flow
    .map((point) => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`)
    // executes this operation step as part of the flow
    .join(", ");
  // executes this operation step as part of the flow
  timelineLine.style.clipPath = `polygon(${polygonTop}, 100% 100%, 0% 100%)`;

  // defines an arrow function used by surrounding logic
  points.forEach((point) => {
    // declares a constant used in this scope
    const dot = document.createElement("span");
    // executes this operation step as part of the flow
    dot.className = "st-timeline-point";
    // executes this operation step as part of the flow
    dot.style.left = `${point.x}%`;
    // executes this operation step as part of the flow
    dot.style.top = `${point.y}%`;

    // declares a constant used in this scope
    const tooltip =
      `M${point.entry.matchNumber} | Score ${toNonNegativeInt(point.entry.performanceScore).toLocaleString("en-US")} | ` +
      `Dmg ${toNonNegativeInt(point.entry.damage)} | K ${toNonNegativeInt(point.entry.kills)} | ` +
      `C ${toNonNegativeInt(point.entry.coins)} | Lv ${toNonNegativeInt(point.entry.level)} | ` +
      // executes this operation step as part of the flow
      `${formatDurationLabel(point.entry.durationSeconds)}`;

    // executes this operation step as part of the flow
    dot.setAttribute("data-tip", tooltip);
    // executes this operation step as part of the flow
    dot.setAttribute("aria-label", tooltip);
    // executes this operation step as part of the flow
    timelinePoints.appendChild(dot);
  });
}

/* ======================================================================
   CANVAS — Starry background from Profile
   // executes this operation step as part of the flow
   ====================================================================== */
// declares a helper function for a focused task
function initStCanvas() {
  // declares a constant used in this scope
  const canvas = document.getElementById("st-canvas");
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
function spawnStParticles() {
  // declares a constant used in this scope
  const root = document.querySelector(".st-root");
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
      animation-duration:${18 + Math.random() * 22}s;
      animation-delay:${Math.random() * 20}s;
      --drift:${(Math.random() - 0.5) * 90}px;
    `;
    // executes this operation step as part of the flow
    root.appendChild(p);
  }
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
  function formatDecimal(value) {
    // returns a value from the current function
    return value.toFixed(2);
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
    const startDelay = 140 + index * 80;
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
      // checks a condition before executing this branch
      if (type === "decimal") {
        // executes this operation step as part of the flow
        el.textContent = formatDecimal(value);
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