// androiddownload page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/AndroidDownload.css";
// imports dependencies used by this module
import { isLoggedIn } from "../services/auth.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";

// declares a constant used in this scope
const APK_FILE_NAME = "Project-Bloodwave-Android.apk";
// declares a constant used in this scope
const APK_PUBLIC_PATH = `https://github.com/zsoltikv/Project-Bloodwave/releases/download/APK/Project-Bloodwave.apk`;
// declares a constant used in this scope
const PORTAL_APK_FILE_NAME = "bloodwave-portal.apk";
// declares a constant used in this scope
const PORTAL_APK_PUBLIC_PATH =
  // executes this operation step as part of the flow
  "https://github.com/zsoltikv/Project-Bloodwave-Web/releases/download/APK/bloodwave-portal.apk";

// exports the main function for this module
export default function AndroidDownload(container) {
  // declares a constant used in this scope
  const loggedIn = isLoggedIn();
  // declares a constant used in this scope
  const backHref = loggedIn ? "/main" : "/login";
  // declares a constant used in this scope
  const backLabel = loggedIn ? "Back to Dashboard" : "Back to Login";

  // executes this operation step as part of the flow
  container.innerHTML = `
    <div class="bw-root bw-apk-root">
      <div class="bw-glow-center"></div>

      <div class="bw-card bw-apk-card">
        <div class="bw-card-inner bw-apk-card-inner">
          <div class="bw-corner bw-corner--tl"></div>
          <div class="bw-corner bw-corner--tr"></div>
          <div class="bw-corner bw-corner--bl"></div>
          <div class="bw-corner bw-corner--br"></div>

          <div class="bw-header bw-apk-header">
            <div class="bw-ornament">
              <div class="bw-ornament-line"></div>
              <div class="bw-ornament-diamond"></div>
              <div class="bw-ornament-line"></div>
            </div>
            <h1 class="bw-title">Android Download</h1>
            <p class="bw-subtitle">Project Bloodwave Mobile Installer</p>
          </div>

          <div class="bw-apk-content">
            <div class="bw-apk-top-grid">
              <section class="bw-apk-hero">
                <h2 class="bw-apk-heading">Before You Install</h2>
                <p class="bw-apk-text">
                  Check these quick requirements before installing to avoid common setup errors on Android devices.
                </p>
                <div class="bw-apk-badges" aria-label="Package details">
                  <span class="bw-apk-badge">Android 6.0+</span>
                  <span class="bw-apk-badge">Stable Wi-Fi or Mobile Data</span>
                  <span class="bw-apk-badge">Unknown Apps Enabled</span>
                  <span class="bw-apk-badge">Free Storage Available</span>
                </div>

                <div class="bw-apk-preflight">
                  <h3 class="bw-apk-subheading">Pre-Install Checklist</h3>
                  <ul class="bw-apk-checklist">
                    <li>Use the official download cards on this page only.</li>
                    <li>Keep at least 500 MB free storage for download and extraction.</li>
                    <li>Disable battery saver during installation to prevent interruption.</li>
                    <li>Close heavy background apps before opening the installer.</li>
                    <li>If you update from an older build, sync your account first.</li>
                  </ul>
                </div>
              </section>

              <div class="bw-apk-download-stack" aria-label="Download panel">
                <aside class="bw-apk-download-card">
                  <p class="bw-apk-kicker">Latest Build</p>
                  <p class="bw-apk-file">${APK_FILE_NAME}</p>

                  <a class="bw-btn bw-apk-btn" href="${APK_PUBLIC_PATH}" download="${APK_FILE_NAME}" data-apk-check-url="https://api.github.com/repos/zsoltikv/Project-Bloodwave/releases/latest" data-apk-status-id="bw-apk-status-main">
                    <div class="bw-btn-shimmer"></div>
                    <span class="bw-btn-text">Download APK</span>
                  </a>

                  <p class="bw-apk-note" id="bw-apk-status-main">Checking APK availability...</p>
                </aside>

                <aside class="bw-apk-download-card">
                  <p class="bw-apk-kicker">Portal Build</p>
                  <p class="bw-apk-file">${PORTAL_APK_FILE_NAME}</p>

                  <a class="bw-btn bw-apk-btn" href="${PORTAL_APK_PUBLIC_PATH}" download="${PORTAL_APK_FILE_NAME}" data-apk-check-url="https://api.github.com/repos/zsoltikv/Project-Bloodwave-Web/releases/latest" data-apk-status-id="bw-apk-status-portal">
                    <div class="bw-btn-shimmer"></div>
                    <span class="bw-btn-text">Download Portal APK</span>
                  </a>

                  <p class="bw-apk-note" id="bw-apk-status-portal">Checking APK availability...</p>
                </aside>
              </div>
            </div>

            <div class="bw-apk-grid">
              <section class="bw-apk-panel">
                <h2 class="bw-apk-heading">Installation Steps</h2>
                <ol class="bw-apk-step-list">
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">1</span>
                    <p>Open the downloaded file in the Android Downloads app or notification panel.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">2</span>
                    <p>When prompted, allow installation from unknown sources for your browser or file manager.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">3</span>
                    <p>Tap Install and wait until setup is complete.</p>
                  </li>
                  <li class="bw-apk-step-item">
                    <span class="bw-apk-step-index">4</span>
                    <p>Launch Project: Bloodwave and sign in with your existing account.</p>
                  </li>
                </ol>
              </section>

              <section class="bw-apk-panel bw-apk-panel-warn">
                <h2 class="bw-apk-heading">Troubleshooting</h2>
                <ul class="bw-apk-list">
                  <li>If you get "App not installed", remove the previous build and install again.</li>
                  <li>If install is blocked, check permission for unknown apps in Android security settings.</li>
                  <li>Make sure you have enough free storage before downloading and installing.</li>
                  <li>If download is interrupted, delete the partial file and download again.</li>
                  <li>If your phone flags the app as unsafe, continue only if the APK came from this official page.</li>
                  <li>If it crashes, reinstall after a reboot.</li>
                </ul>
              </section>
            </div>

            <div class="bw-apk-footer-link">
              <a href="${backHref}" data-link class="bw-btn bw-apk-back-btn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">${backLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();
  // executes this operation step as part of the flow
  updateApkAvailability(container);
}

async function updateApkAvailability(container) {
  // declares a constant used in this scope
  const downloadButtons = container.querySelectorAll(
    ".bw-apk-btn[data-apk-check-url]",
  );
  // checks a condition before executing this branch
  if (!downloadButtons.length) return;

  // waits for an asynchronous operation to complete
  await Promise.all(
    // defines an arrow function used by surrounding logic
    Array.from(downloadButtons).map((downloadBtn) => {
      // declares a constant used in this scope
      const checkUrl = downloadBtn.dataset.apkCheckUrl;
      // declares a constant used in this scope
      const statusId = downloadBtn.dataset.apkStatusId;
      // declares a constant used in this scope
      const statusEl = statusId
        ? container.querySelector(`#${statusId}`)
        // executes this operation step as part of the flow
        : null;
      // returns a value from the current function
      return checkReleaseAvailability(downloadBtn, statusEl, checkUrl);
    }),
  );
}

async function checkReleaseAvailability(downloadBtn, statusEl, checkUrl) {
  // checks a condition before executing this branch
  if (!downloadBtn || !statusEl || !checkUrl) return;

  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const response = await fetch(checkUrl, {
      // sets a named field inside an object or configuration block
      method: "GET",
      // sets a named field inside an object or configuration block
      cache: "no-store",
      // sets a named field inside an object or configuration block
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    // checks a condition before executing this branch
    if (response.ok) {
      // executes this operation step as part of the flow
      statusEl.textContent =
        // executes this operation step as part of the flow
        "APK is available on GitHub releases and ready to download.";
      // executes this operation step as part of the flow
      statusEl.classList.add("ok");
      // executes this operation step as part of the flow
      downloadBtn.classList.remove("bw-apk-disabled");
      // returns a value from the current function
      return;
    }

    // executes this operation step as part of the flow
    markApkUnavailable(downloadBtn, statusEl);
  } catch {
    // executes this operation step as part of the flow
    markApkUnavailable(downloadBtn, statusEl);
  }
}

// declares a helper function for a focused task
function markApkUnavailable(downloadBtn, statusEl) {
  // executes this operation step as part of the flow
  statusEl.textContent =
    // executes this operation step as part of the flow
    "APK is currently unavailable. Please try again later.";
  // executes this operation step as part of the flow
  statusEl.classList.add("warn");
  // executes this operation step as part of the flow
  downloadBtn.classList.add("bw-apk-disabled");
  // attaches a dom event listener for user interaction
  downloadBtn.addEventListener("click", (e) => e.preventDefault(), {
    // sets a named field inside an object or configuration block
    once: false,
  });
}