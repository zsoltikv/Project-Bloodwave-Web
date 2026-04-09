// logout-confirm effect module: applies reusable dom effects and ui behaviors.
// keeps visual interaction logic isolated from page rendering code.

import { attachCapsLockHint } from "../utils/caps-lock.js";

// confirmLogout: show a simple confirmation dialog asking the user to confirm logout
// returns a promise that resolves to `true` when confirmed or `false` when cancelled
export function confirmLogout() {
  // returns a value from the current function
  return new Promise((resolve) => {
    // build an overlay with an accessible dialog structure
    const overlay = document.createElement("div");
    // executes this operation step as part of the flow
    overlay.className = "bw-confirm-overlay";
    // executes this operation step as part of the flow
    overlay.innerHTML = `
      <div class="bw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="bw-confirm-title" aria-describedby="bw-confirm-copy">
        <div class="bw-confirm-corner bw-confirm-corner--tl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--tr"></div>
        <div class="bw-confirm-corner bw-confirm-corner--bl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--br"></div>

        <div class="bw-confirm-ornament" aria-hidden="true">
          <span class="bw-confirm-ornament-line"></span>
          <span class="bw-confirm-ornament-diamond"></span>
          <span class="bw-confirm-ornament-line"></span>
        </div>

        <h2 class="bw-confirm-title" id="bw-confirm-title">Confirm Logout</h2>
        <p class="bw-confirm-kicker">Session Action</p>
        <p class="bw-confirm-copy" id="bw-confirm-copy">Are you sure you want to log out from your account?</p>
        <div class="bw-confirm-actions">
          <button type="button" class="bw-confirm-btn bw-confirm-btn-cancel" data-action="cancel">Cancel</button>
          <button type="button" class="bw-confirm-btn bw-confirm-btn-danger" data-action="confirm">Log Out</button>
        </div>
      </div>
    `;

    // declares a constant used in this scope
    const cancelBtn = overlay.querySelector('[data-action="cancel"]');
    // declares a constant used in this scope
    const confirmBtn = overlay.querySelector('[data-action="confirm"]');
    // declares a constant used in this scope
    const card = overlay.querySelector(".bw-confirm-card");
    // declares mutable state used in this scope
    let isClosing = false;

    // remove event listeners and dom nodes created for the dialog
    const cleanup = () => {
      // executes this operation step as part of the flow
      document.removeEventListener("keydown", onKeyDown);
      // executes this operation step as part of the flow
      overlay.remove();
    };

    // finish the dialog and resolve the promise
    // when animated is true, play the closing animation before resolving
    const finish = (result, animated = false) => {
      // checks a condition before executing this branch
      if (isClosing) return;

      // checks a condition before executing this branch
      if (!animated) {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(result);
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      isClosing = true;
      // executes this operation step as part of the flow
      overlay.classList.add("bw-confirm-overlay--closing");

      // declares a constant used in this scope
      const done = () => {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(result);
      };

      // attaches a dom event listener for user interaction
      card?.addEventListener("animationend", done, { once: true });
      // executes this operation step as part of the flow
      window.setTimeout(done, 260);
    };

    // keyboard handler: escape closes the dialog
    const onKeyDown = (event) => {
      // checks a condition before executing this branch
      if (event.key === "Escape") {
        // executes this operation step as part of the flow
        event.preventDefault();
        // executes this operation step as part of the flow
        finish(false, true);
      }
    };

    // attaches a dom event listener for user interaction
    cancelBtn?.addEventListener("click", () => finish(false, true));
    // attaches a dom event listener for user interaction
    confirmBtn?.addEventListener("click", () => finish(true));

    // click on the overlay backdrop dismisses the dialog
    overlay.addEventListener("click", (event) => {
      // checks a condition before executing this branch
      if (event.target === overlay) {
        // executes this operation step as part of the flow
        finish(false, true);
      }
    });

    // attaches a dom event listener for user interaction
    document.addEventListener("keydown", onKeyDown);
    // executes this operation step as part of the flow
    document.body.appendChild(overlay);
    // executes this operation step as part of the flow
    cancelBtn?.focus();
  });
}

// confirmDeleteAccount: show a more involved confirmation requiring username and password
// returns a promise that resolves to an object with `confirmed` and `password` when deleted,
// or `false` when cancelled
export function confirmDeleteAccount(expectedUsername) {
  // returns a value from the current function
  return new Promise((resolve) => {
    // declares a constant used in this scope
    const safeUsername = String(expectedUsername ?? "").trim();

    // build the dialog markup including inputs for username and password
    const overlay = document.createElement("div");
    // executes this operation step as part of the flow
    overlay.className = "bw-confirm-overlay";
    // executes this operation step as part of the flow
    overlay.innerHTML = `
      <div class="bw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="bw-confirm-delete-title" aria-describedby="bw-confirm-delete-copy">
        <div class="bw-confirm-corner bw-confirm-corner--tl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--tr"></div>
        <div class="bw-confirm-corner bw-confirm-corner--bl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--br"></div>

        <div class="bw-confirm-ornament" aria-hidden="true">
          <span class="bw-confirm-ornament-line"></span>
          <span class="bw-confirm-ornament-diamond"></span>
          <span class="bw-confirm-ornament-line"></span>
        </div>

        <h2 class="bw-confirm-title" id="bw-confirm-delete-title">Delete Account</h2>
        <p class="bw-confirm-kicker">Permanent Action</p>
        <p class="bw-confirm-copy" id="bw-confirm-delete-copy">
          Type your username <strong>${escapeHtml(safeUsername || "unknown")}</strong> and your password to permanently delete your profile.
        </p>

        <label class="bw-confirm-field" for="bw-confirm-delete-username">Username confirmation</label>
        <input
          id="bw-confirm-delete-username"
          class="bw-confirm-input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Enter username"
        />
        <label class="bw-confirm-field" for="bw-confirm-delete-password">Password confirmation</label>
        <input
          id="bw-confirm-delete-password"
          class="bw-confirm-input"
          type="password"
          autocomplete="current-password"
          placeholder="Enter password"
        />
        <p class="bw-confirm-caps-lock-hint" id="bw-confirm-delete-caps-lock" aria-live="polite" aria-hidden="true">Caps Lock is on</p>
        <p class="bw-confirm-error" id="bw-confirm-delete-error" aria-live="polite"></p>

        <div class="bw-confirm-actions">
          <button type="button" class="bw-confirm-btn bw-confirm-btn-cancel" data-action="cancel">Cancel</button>
          <button type="button" class="bw-confirm-btn bw-confirm-btn-danger" data-action="confirm" disabled>Delete</button>
        </div>
      </div>
    `;

    // declares a constant used in this scope
    const cancelBtn = overlay.querySelector('[data-action="cancel"]');
    // declares a constant used in this scope
    const confirmBtn = overlay.querySelector('[data-action="confirm"]');
    // declares a constant used in this scope
    const card = overlay.querySelector(".bw-confirm-card");
    // declares a constant used in this scope
    const usernameInput = overlay.querySelector("#bw-confirm-delete-username");
    // declares a constant used in this scope
    const passwordInput = overlay.querySelector("#bw-confirm-delete-password");
    // declares a constant used in this scope
    const capsLockHint = overlay.querySelector("#bw-confirm-delete-caps-lock");
    // declares a constant used in this scope
    const errorEl = overlay.querySelector("#bw-confirm-delete-error");
    // declares mutable state used in this scope
    let isClosing = false;

    // validation helpers for the two input fields
    const isMatch = () => usernameInput?.value.trim() === safeUsername;
    // declares a constant used in this scope
    const hasPassword = () => (passwordInput?.value || "").trim().length > 0;

    // enable the confirm button only when username matches and password is present
    const updateConfirmState = () => {
      // checks a condition before executing this branch
      if (!confirmBtn) return;
      // executes this operation step as part of the flow
      confirmBtn.disabled = !safeUsername || !isMatch() || !hasPassword();
      // checks a condition before executing this branch
      if (errorEl && isMatch() && hasPassword()) {
        // executes this operation step as part of the flow
        errorEl.textContent = "";
      }
    };

    // declares a constant used in this scope
    const cleanup = () => {
      // executes this operation step as part of the flow
      document.removeEventListener("keydown", onKeyDown);
      // executes this operation step as part of the flow
      overlay.remove();
    };

    // finish the dialog; when `result` is an object it indicates confirmation with data
    const finish = (result, animated = false) => {
      // checks a condition before executing this branch
      if (isClosing) return;

      // checks a condition before executing this branch
      if (!animated) {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(result);
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      isClosing = true;
      // executes this operation step as part of the flow
      overlay.classList.add("bw-confirm-overlay--closing");

      // declares a constant used in this scope
      const done = () => {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(result);
      };

      // attaches a dom event listener for user interaction
      card?.addEventListener("animationend", done, { once: true });
      // executes this operation step as part of the flow
      window.setTimeout(done, 260);
    };

    // keyboard handler: escape closes the dialog
    const onKeyDown = (event) => {
      // checks a condition before executing this branch
      if (event.key === "Escape") {
        // executes this operation step as part of the flow
        event.preventDefault();
        // executes this operation step as part of the flow
        finish(false, true);
      }
    };

    // attaches a dom event listener for user interaction
    cancelBtn?.addEventListener("click", () => finish(false, true));
    // attaches a dom event listener for user interaction
    confirmBtn?.addEventListener("click", () => {
      // checks a condition before executing this branch
      if (!isMatch()) {
        // checks a condition before executing this branch
        if (errorEl) {
          // executes this operation step as part of the flow
          errorEl.textContent = "Username does not match.";
        }
        // returns a value from the current function
        return;
      }
      // checks a condition before executing this branch
      if (!hasPassword()) {
        // checks a condition before executing this branch
        if (errorEl) {
          // executes this operation step as part of the flow
          errorEl.textContent = "Password is required.";
        }
        // returns a value from the current function
        return;
      }
      finish({
        // sets a named field inside an object or configuration block
        confirmed: true,
        // sets a named field inside an object or configuration block
        password: passwordInput?.value || "",
      });
    });

    // attaches a dom event listener for user interaction
    usernameInput?.addEventListener("input", updateConfirmState);
    // attaches a dom event listener for user interaction
    passwordInput?.addEventListener("input", updateConfirmState);

    // clicking the backdrop cancels the dialog
    overlay.addEventListener("click", (event) => {
      // checks a condition before executing this branch
      if (event.target === overlay) {
        // executes this operation step as part of the flow
        finish(false, true);
      }
    });

    // attaches a dom event listener for user interaction
    document.addEventListener("keydown", onKeyDown);
    // executes this operation step as part of the flow
    document.body.appendChild(overlay);
    // executes this operation step as part of the flow
    attachCapsLockHint(passwordInput, capsLockHint);
    // executes this operation step as part of the flow
    updateConfirmState();
    // executes this operation step as part of the flow
    usernameInput?.focus();
  });
}

// small helper to escape user-provided text before inserting into markup
function escapeHtml(text) {
  // returns a value from the current function
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    // executes this operation step as part of the flow
    .replaceAll("'", "&#39;");
}

// showDeleteAccountError: display a simple error dialog after a failed deletion attempt
// resolves when the user dismisses the dialog
export function showDeleteAccountError(errorMessage, description) {
  // returns a value from the current function
  return new Promise((resolve) => {
    // declares a constant used in this scope
    const overlay = document.createElement("div");
    // executes this operation step as part of the flow
    overlay.className = "bw-confirm-overlay";
    // executes this operation step as part of the flow
    overlay.innerHTML = `
      <div class="bw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="bw-error-title" aria-describedby="bw-error-copy">
        <div class="bw-confirm-corner bw-confirm-corner--tl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--tr"></div>
        <div class="bw-confirm-corner bw-confirm-corner--bl"></div>
        <div class="bw-confirm-corner bw-confirm-corner--br"></div>

        <div class="bw-confirm-ornament" aria-hidden="true">
          <span class="bw-confirm-ornament-line"></span>
          <span class="bw-confirm-ornament-diamond"></span>
          <span class="bw-confirm-ornament-line"></span>
        </div>

        <h2 class="bw-confirm-title bw-error-title" id="bw-error-title">Deletion Failed</h2>
        <p class="bw-confirm-kicker">Error</p>
        <p class="bw-confirm-copy" id="bw-error-copy">${escapeHtml(errorMessage || "Could not delete account. Please try again.")}</p>
        ${description ? `<p class="bw-confirm-copy bw-error-hint">${escapeHtml(description)}</p>` : ""}

        <div class="bw-confirm-actions">
          <button type="button" class="bw-confirm-btn bw-confirm-btn-cancel" data-action="ok">OK</button>
        </div>
      </div>
    `;

    // declares a constant used in this scope
    const okBtn = overlay.querySelector('[data-action="ok"]');
    // declares a constant used in this scope
    const card = overlay.querySelector(".bw-confirm-card");
    // declares mutable state used in this scope
    let isClosing = false;

    // declares a constant used in this scope
    const cleanup = () => {
      // executes this operation step as part of the flow
      document.removeEventListener("keydown", onKeyDown);
      // executes this operation step as part of the flow
      overlay.remove();
    };

    // declares a constant used in this scope
    const finish = (animated = false) => {
      // checks a condition before executing this branch
      if (isClosing) return;

      // checks a condition before executing this branch
      if (!animated) {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(undefined);
        // returns a value from the current function
        return;
      }

      // executes this operation step as part of the flow
      isClosing = true;
      // executes this operation step as part of the flow
      overlay.classList.add("bw-confirm-overlay--closing");

      // declares a constant used in this scope
      const done = () => {
        // executes this operation step as part of the flow
        cleanup();
        // executes this operation step as part of the flow
        resolve(undefined);
      };

      // attaches a dom event listener for user interaction
      card?.addEventListener("animationend", done, { once: true });
      // executes this operation step as part of the flow
      window.setTimeout(done, 260);
    };

    // allow dismiss with escape or enter keys
    const onKeyDown = (event) => {
      // checks a condition before executing this branch
      if (event.key === "Escape" || event.key === "Enter") {
        // executes this operation step as part of the flow
        event.preventDefault();
        // executes this operation step as part of the flow
        finish(true);
      }
    };

    // attaches a dom event listener for user interaction
    okBtn?.addEventListener("click", () => finish(true));

    // attaches a dom event listener for user interaction
    overlay.addEventListener("click", (event) => {
      // checks a condition before executing this branch
      if (event.target === overlay) {
        // executes this operation step as part of the flow
        finish(true);
      }
    });

    // attaches a dom event listener for user interaction
    document.addEventListener("keydown", onKeyDown);
    // executes this operation step as part of the flow
    document.body.appendChild(overlay);
    // executes this operation step as part of the flow
    okBtn?.focus();
  });
}