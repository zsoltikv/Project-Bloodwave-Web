// backendstatus page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/BackendStatus.css";
// imports dependencies used by this module
import "../../styles/pages/Main.css";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { fetchBackendStatus } from "../services/backend-status.js";

// declares a constant used in this scope
const AUTO_REFRESH_MS = 60_000;

// exports the main function for this module
export default function BackendStatus(container) {
  // declares mutable state used in this scope
  let backendStatusSnapshot = null;
  // declares mutable state used in this scope
  let backendStatusLoading = false;
  // declares mutable state used in this scope
  let backendStatusError = "";
  // declares mutable state used in this scope
  let backendStatusRequestId = 0;
  // declares mutable state used in this scope
  let backendStatusTimerId = 0;
  // declares mutable state used in this scope
  let backendStatusCountdownId = 0;
  // declares mutable state used in this scope
  let backendStatusNextRefreshAt = 0;

  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="bw-root bw-bs-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card bw-bs-card">
        <div class="bw-card-inner bw-bs-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header bw-bs-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Backend Status</h1>
            <p class="bw-subtitle">Live API Monitor</p>
          </div>

          <section class="mn-server-status bw-bs-monitor" id="bw-bs-monitor" aria-live="polite"></section>

          <div class="bw-bs-footer-link">
            <a href="/main" data-link class="bw-btn bw-bs-back-btn">
              <div class="bw-btn-shimmer"></div>
              <span class="bw-btn-text">Back to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const monitorSection = container.querySelector("#bw-bs-monitor");
  // executes this operation step as part of the flow
  renderBackendStatusPanel();

  // attaches a dom event listener for user interaction
  monitorSection?.addEventListener("click", (event) => {
    // checks a condition before executing this branch
    if (!(event.target instanceof Element)) return;

    // declares a constant used in this scope
    const refreshButton = event.target.closest("#mn-server-refresh");
    // checks a condition before executing this branch
    if (!refreshButton || backendStatusLoading) return;

    // executes this operation step as part of the flow
    void loadBackendStatus();
  });

  // executes this operation step as part of the flow
  void loadBackendStatus();

  // declares a helper function for a focused task
  function isActive() {
    // returns a value from the current function
    return document.body.contains(container);
  }

  // declares a helper function for a focused task
  function renderBackendStatusPanel() {
    // checks a condition before executing this branch
    if (!monitorSection) return;

    // checks a condition before executing this branch
    if (!backendStatusSnapshot) {
      // executes this operation step as part of the flow
      monitorSection.innerHTML = `
        <section class="mn-server-card mn-server-card--loading" aria-busy="true">
          <div class="mn-server-head">
            <div class="mn-server-copy-block">
              <p class="mn-server-kicker">Backend Server</p>
              <h2 class="mn-server-title">Live API Monitor</h2>
            </div>
            <button type="button" class="mn-server-refresh" id="mn-server-refresh" disabled>Checking...</button>
          </div>

          <div class="mn-server-visuals">
            <div class="mn-server-gauge-shell">
              ${renderServerGauge("Checking", 24, "loading")}
            </div>
            <div class="mn-server-bars">
              ${renderServerBar("Ping", "--", 22, "loading")}
              ${renderServerBar("Session", "--", 18, "loading")}
              ${renderServerBar("Latency", "--", 14, "loading")}
            </div>
          </div>

          <div class="mn-server-chip-row">
            ${renderServerChip("Server", "--")}
            ${renderServerChip("UTC", "--")}
            ${renderServerChip("Base", "api.bloodwave.site")}
            ${renderServerChip("Checked", "--")}
          </div>
        </section>
      `;
      // returns a value from the current function
      return;
    }

    // declares a constant used in this scope
    const overallMeter = getOverallHealthMeter(backendStatusSnapshot);
    // declares a constant used in this scope
    const pingMeter = getStatusMeter(
      backendStatusSnapshot.pingCheck?.statusLabel,
    );
    // declares a constant used in this scope
    const sessionMeter = getStatusMeter(
      backendStatusSnapshot.sessionCheck?.statusLabel,
    );
    // declares a constant used in this scope
    const latencyMeter = getLatencyMeter(backendStatusSnapshot.responseTimeMs);
    // declares a constant used in this scope
    const toneClass = `mn-server-card--${backendStatusSnapshot.tone || "warn"}`;
    // declares a constant used in this scope
    const refreshLabel = backendStatusLoading ? "Checking..." : "Refresh";

    // executes this operation step as part of the flow
    monitorSection.innerHTML = `
      <section class="mn-server-card ${toneClass}" aria-busy="${String(backendStatusLoading)}">
        <div class="mn-server-head">
          <div class="mn-server-copy-block">
            <p class="mn-server-kicker">Backend Server</p>
            <div class="mn-server-title-row">
              <h2 class="mn-server-title">Live API Monitor</h2>
            </div>
            <div class="bw-bs-status-actions">
              <span class="mn-server-badge mn-server-badge--${backendStatusSnapshot.tone || "warn"}">
                <span class="mn-server-badge-dot" aria-hidden="true"></span>
                ${escapeHtml(backendStatusSnapshot.label || "Unknown")}
              </span>
              <button type="button" class="mn-server-refresh" id="mn-server-refresh" ${backendStatusLoading ? "disabled" : ""}>${refreshLabel}</button>
            </div>
          </div>
        </div>

        <div class="mn-server-visuals">
          <div class="mn-server-gauge-shell">
            ${renderServerGauge(backendStatusSnapshot.label || "Unknown", overallMeter.score, overallMeter.tone)}
          </div>
          <div class="mn-server-bars">
            ${renderServerBar("Ping", backendStatusSnapshot.pingCheck?.statusLabel || "Unknown", pingMeter.score, pingMeter.tone)}
            ${renderServerBar("Session", backendStatusSnapshot.sessionCheck?.statusLabel || "Unknown", sessionMeter.score, sessionMeter.tone)}
            ${renderServerBar("Latency", formatResponseTime(backendStatusSnapshot.responseTimeMs), latencyMeter.score, latencyMeter.tone)}
          </div>
        </div>

        <div class="mn-server-chip-row">
          ${renderServerChip("Server", backendStatusSnapshot.serverName || "Unavailable")}
          ${renderServerChip("UTC", formatBackendUtcClock(backendStatusSnapshot.serverUtc))}
          ${renderServerChip("Base", backendStatusSnapshot.apiHost || "Unavailable")}
          ${renderServerChip("Checked", formatBackendLocalClock(backendStatusSnapshot.lastCheckedAt))}
        </div>

        <div class="mn-server-legend">
          <span class="mn-server-legend-item">${escapeHtml(backendStatusSnapshot.httpSummary || "No HTTP details available.")}</span>
          <span class="mn-server-legend-item mn-server-legend-item--countdown" id="mn-server-countdown">${escapeHtml(formatRefreshCountdown(backendStatusNextRefreshAt))}</span>
        </div>
      </section>
    `;
  }

  // declares a helper function for a focused task
  function scheduleBackendStatusRefresh() {
    // executes this operation step as part of the flow
    window.clearTimeout(backendStatusTimerId);
    // executes this operation step as part of the flow
    stopBackendStatusCountdown();
    // checks a condition before executing this branch
    if (!isActive()) return;

    // executes this operation step as part of the flow
    backendStatusNextRefreshAt = Date.now() + AUTO_REFRESH_MS;
    // executes this operation step as part of the flow
    startBackendStatusCountdown();
    // defines an arrow function used by surrounding logic
    backendStatusTimerId = window.setTimeout(() => {
      // executes this operation step as part of the flow
      void loadBackendStatus();
    // executes this operation step as part of the flow
    }, AUTO_REFRESH_MS);
  }

  async function loadBackendStatus() {
    // checks a condition before executing this branch
    if (!monitorSection || !isActive()) return;

    // executes this operation step as part of the flow
    window.clearTimeout(backendStatusTimerId);
    // executes this operation step as part of the flow
    stopBackendStatusCountdown();
    // executes this operation step as part of the flow
    backendStatusLoading = true;
    // executes this operation step as part of the flow
    backendStatusError = "";
    // executes this operation step as part of the flow
    renderBackendStatusPanel();

    // declares a constant used in this scope
    const requestId = ++backendStatusRequestId;

    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const snapshot = await fetchBackendStatus();
      // checks a condition before executing this branch
      if (requestId !== backendStatusRequestId || !isActive()) return;

      // executes this operation step as part of the flow
      backendStatusSnapshot = snapshot;
    } catch {
      // checks a condition before executing this branch
      if (requestId !== backendStatusRequestId || !isActive()) return;

      // executes this operation step as part of the flow
      backendStatusError = "Refresh failed";
    } finally {
      // checks a condition before executing this branch
      if (requestId !== backendStatusRequestId || !isActive()) return;

      // executes this operation step as part of the flow
      backendStatusLoading = false;
      // executes this operation step as part of the flow
      renderBackendStatusPanel();
      // executes this operation step as part of the flow
      scheduleBackendStatusRefresh();
    }
  }

  // declares a helper function for a focused task
  function startBackendStatusCountdown() {
    // executes this operation step as part of the flow
    syncBackendStatusCountdown();
    // defines an arrow function used by surrounding logic
    backendStatusCountdownId = window.setInterval(() => {
      // executes this operation step as part of the flow
      syncBackendStatusCountdown();
    // executes this operation step as part of the flow
    }, 1000);
  }

  // declares a helper function for a focused task
  function stopBackendStatusCountdown() {
    // executes this operation step as part of the flow
    backendStatusNextRefreshAt = 0;
    // executes this operation step as part of the flow
    window.clearInterval(backendStatusCountdownId);
    // executes this operation step as part of the flow
    backendStatusCountdownId = 0;
    // executes this operation step as part of the flow
    syncBackendStatusCountdown();
  }

  // declares a helper function for a focused task
  function syncBackendStatusCountdown() {
    // declares a constant used in this scope
    const countdownEl = container.querySelector("#mn-server-countdown");
    // checks a condition before executing this branch
    if (!countdownEl) return;

    // executes this operation step as part of the flow
    countdownEl.textContent = formatRefreshCountdown(
      backendStatusNextRefreshAt,
    );
  }
}

// declares a helper function for a focused task
function renderServerGauge(label, score, tone) {
  // declares a constant used in this scope
  const normalizedScore = clampMeter(score);

  // returns a value from the current function
  return `
    <div class="mn-server-gauge mn-server-gauge--${escapeHtml(tone)}" style="--mn-server-progress:${normalizedScore};">
      <div class="mn-server-gauge-core">
        <span class="mn-server-gauge-value">${normalizedScore}%</span>
        <span class="mn-server-gauge-label">${escapeHtml(label)}</span>
      </div>
    </div>
  `;
}

// declares a helper function for a focused task
function renderServerBar(label, value, score, tone) {
  // declares a constant used in this scope
  const normalizedScore = clampMeter(score);

  // returns a value from the current function
  return `
    <article class="mn-server-bar mn-server-bar--${escapeHtml(tone)}">
      <div class="mn-server-bar-head">
        <span class="mn-server-bar-label">${escapeHtml(label)}</span>
        <span class="mn-server-bar-value">${escapeHtml(value)}</span>
      </div>
      <div class="mn-server-bar-track">
        <span class="mn-server-bar-fill" style="width:${normalizedScore}%"></span>
      </div>
    </article>
  `;
}

// declares a helper function for a focused task
function renderServerChip(label, value) {
  // returns a value from the current function
  return `
    <div class="mn-server-chip">
      <span class="mn-server-chip-label">${escapeHtml(label)}</span>
      <strong class="mn-server-chip-value">${escapeHtml(value)}</strong>
    </div>
  `;
}

// declares a helper function for a focused task
function formatResponseTime(value) {
  // declares a constant used in this scope
  const latency = Number(value);
  // checks a condition before executing this branch
  if (!Number.isFinite(latency) || latency <= 0) return "--";
  // returns a value from the current function
  return `${Math.round(latency)} ms`;
}

// declares a helper function for a focused task
function formatBackendLocalClock(isoDateString) {
  // declares a constant used in this scope
  const parsedDate = parseBackendDate(isoDateString);
  // checks a condition before executing this branch
  if (Number.isNaN(parsedDate.getTime())) return "-";

  // returns a value from the current function
  return new Intl.DateTimeFormat("hu-HU", {
    // sets a named field inside an object or configuration block
    hour: "2-digit",
    // sets a named field inside an object or configuration block
    minute: "2-digit",
    // sets a named field inside an object or configuration block
    second: "2-digit",
    // sets a named field inside an object or configuration block
    timeZone: "Europe/Budapest",
  // executes this operation step as part of the flow
  }).format(parsedDate);
}

// declares a helper function for a focused task
function formatBackendUtcClock(isoDateString) {
  // declares a constant used in this scope
  const parsedDate = parseBackendDate(isoDateString);
  // checks a condition before executing this branch
  if (Number.isNaN(parsedDate.getTime())) return "--";

  // returns a value from the current function
  return `${new Intl.DateTimeFormat("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(parsedDate)} UTC`;
}

// declares a helper function for a focused task
function formatRefreshCountdown(nextRefreshAt) {
  // declares a constant used in this scope
  const targetTime = Number(nextRefreshAt);
  // checks a condition before executing this branch
  if (!Number.isFinite(targetTime) || targetTime <= 0) return "Refresh --s";
  // declares a constant used in this scope
  const secondsRemaining = Math.max(
    0,
    Math.ceil((targetTime - Date.now()) / 1000),
  );
  // returns a value from the current function
  return `Refresh ${secondsRemaining}s`;
}

// declares a helper function for a focused task
function getOverallHealthMeter(snapshot) {
  // declares a constant used in this scope
  const tone = snapshot?.tone || "warn";
  // checks a condition before executing this branch
  if (tone === "ok") return { score: 100, tone: "ok" };
  // checks a condition before executing this branch
  if (tone === "down") return { score: 18, tone: "down" };
  // returns a value from the current function
  return { score: 62, tone: "warn" };
}

// declares a helper function for a focused task
function getStatusMeter(statusLabel) {
  // declares a constant used in this scope
  const label = String(statusLabel || "").toLowerCase();
  // checks a condition before executing this branch
  if (!label) return { score: 12, tone: "loading" };
  // checks a condition before executing this branch
  if (label.includes("healthy")) return { score: 100, tone: "ok" };
  // checks a condition before executing this branch
  if (label.includes("auth issue") || label.includes("reachable"))
    // returns a value from the current function
    return { score: 64, tone: "warn" };
  // checks a condition before executing this branch
  if (label.includes("unexpected payload") || label.includes("unexpected"))
    // returns a value from the current function
    return { score: 48, tone: "warn" };
  // checks a condition before executing this branch
  if (label.includes("server error")) return { score: 24, tone: "down" };
  // checks a condition before executing this branch
  if (label.includes("unreachable")) return { score: 10, tone: "down" };
  // returns a value from the current function
  return { score: 40, tone: "warn" };
}

// declares a helper function for a focused task
function getLatencyMeter(value) {
  // declares a constant used in this scope
  const latency = Number(value);
  // checks a condition before executing this branch
  if (!Number.isFinite(latency) || latency <= 0)
    // returns a value from the current function
    return { score: 10, tone: "down" };
  // checks a condition before executing this branch
  if (latency <= 80) return { score: 100, tone: "ok" };
  // checks a condition before executing this branch
  if (latency <= 160) return { score: 82, tone: "ok" };
  // checks a condition before executing this branch
  if (latency <= 280) return { score: 62, tone: "warn" };
  // checks a condition before executing this branch
  if (latency <= 500) return { score: 42, tone: "warn" };
  // returns a value from the current function
  return { score: 22, tone: "down" };
}

// declares a helper function for a focused task
function clampMeter(value) {
  // declares a constant used in this scope
  const numericValue = Number(value);
  // checks a condition before executing this branch
  if (!Number.isFinite(numericValue)) return 0;
  // returns a value from the current function
  return Math.max(0, Math.min(100, Math.round(numericValue)));
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