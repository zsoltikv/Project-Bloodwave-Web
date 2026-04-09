// resetpassword page module: renders the view and wires user interactions.
// keeps page state, events and data loading logic in one place.

import "../../styles/pages/ResetPassword.css";
// imports dependencies used by this module
import { API_BASE } from "../services/auth.js";
// imports dependencies used by this module
import { ensureGlobalStarfield } from "../effects/global-starfield.js";
// imports dependencies used by this module
import { attachCapsLockHints } from "../utils/caps-lock.js";

// exports the main function for this module
export default function ResetPassword(container) {
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
            <p class="bw-subtitle">Set&nbsp;&nbsp;New&nbsp;&nbsp;Password</p>
          </div>

          <div class="bw-form" id="rpFormWrap">
            <p class="bw-desc">Choose a new password for your account.</p>

            <form id="rpForm" novalidate>
              <div class="bw-field">
                <label class="bw-label" for="rpPassword">New Password</label>
                <div class="bw-input-wrap">
                  <input
                    type="password"
                    id="rpPassword"
                    class="bw-input"
                    placeholder="............"
                    required
                    autocomplete="new-password"
                    style="padding-right: clamp(40px, 9vw, 52px);"
                  />
                  <button type="button" class="bw-pw-toggle" id="rpPwToggle" aria-label="Toggle new password visibility">
                    <svg id="rpEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-caps-lock-hint" id="rpPasswordCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
                <span class="bw-error" id="rpPasswordError"></span>
              </div>

              <div class="bw-field bw-field--confirm">
                <label class="bw-label" for="rpConfirm">Confirm Password</label>
                <div class="bw-input-wrap">
                  <input
                    type="password"
                    id="rpConfirm"
                    class="bw-input"
                    placeholder="............"
                    required
                    autocomplete="new-password"
                    style="padding-right: clamp(40px, 9vw, 52px);"
                  />
                  <button type="button" class="bw-pw-toggle" id="rpConfirmToggle" aria-label="Toggle confirm password visibility">
                    <svg id="rpConfirmEyeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <div class="bw-input-line"></div>
                </div>
                <span class="bw-caps-lock-hint" id="rpConfirmCapsHint" aria-live="polite" aria-hidden="true">Caps Lock is on</span>
                <span class="bw-error" id="rpConfirmError"></span>
              </div>

              <span class="bw-error bw-error--center" id="rpGeneralError"></span>

              <button type="submit" class="bw-btn" id="rpBtn">
                <div class="bw-btn-shimmer"></div>
                <span class="bw-btn-text">Update Password</span>
              </button>
            </form>

            <div class="bw-success-panel" id="rpSuccess">
              <div class="bw-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.35">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p class="bw-success-title">Password Updated</p>
              <p class="bw-success-text">Your password has been changed successfully.</p>
              <div class="bw-success-sep"></div>
            </div>

            <div class="bw-divider">
              <div class="bw-divider-line"></div>
              <span class="bw-divider-text">or</span>
              <div class="bw-divider-line"></div>
            </div>

            <div class="bw-footer-link">
              <p>Back to <a href="/login" data-link class="bw-forgot">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // executes this operation step as part of the flow
  ensureGlobalStarfield();

  // declares a constant used in this scope
  const form = document.getElementById("rpForm");
  // declares a constant used in this scope
  const btn = document.getElementById("rpBtn");
  // declares a constant used in this scope
  const passwordInput = document.getElementById("rpPassword");
  // declares a constant used in this scope
  const confirmInput = document.getElementById("rpConfirm");
  // declares a constant used in this scope
  const passwordError = document.getElementById("rpPasswordError");
  // declares a constant used in this scope
  const confirmError = document.getElementById("rpConfirmError");
  // declares a constant used in this scope
  const generalError = document.getElementById("rpGeneralError");
  // declares a constant used in this scope
  const successPanel = document.getElementById("rpSuccess");
  // declares a constant used in this scope
  const passwordCapsHint = document.getElementById("rpPasswordCapsHint");
  // declares a constant used in this scope
  const confirmCapsHint = document.getElementById("rpConfirmCapsHint");

  // declares a helper function for a focused task
  function getParamFromUrl(name) {
    // declares a constant used in this scope
    const searchParams = new URLSearchParams(window.location.search);
    // declares a constant used in this scope
    const fromSearch = searchParams.get(name);
    // checks a condition before executing this branch
    if (fromSearch) return fromSearch.trim();

    // Fallback: some links can place query params after #
    const hashQuery = window.location.hash.split("?")[1] || "";
    // declares a constant used in this scope
    const hashParams = new URLSearchParams(hashQuery);
    // declares a constant used in this scope
    const fromHash = hashParams.get(name);
    // returns a value from the current function
    return fromHash ? fromHash.trim() : "";
  }

  // declares a constant used in this scope
  const token = getParamFromUrl("token");
  // declares a constant used in this scope
  const email = getParamFromUrl("email");

  // checks a condition before executing this branch
  if (!token) {
    // executes this operation step as part of the flow
    generalError.textContent = "Missing or invalid reset token.";
    // executes this operation step as part of the flow
    btn.disabled = true;
  }

  // declares a helper function for a focused task
  function clearErrors() {
    // executes this operation step as part of the flow
    passwordError.textContent = "";
    // executes this operation step as part of the flow
    confirmError.textContent = "";
    // executes this operation step as part of the flow
    generalError.textContent = "";
  }

  // declares a helper function for a focused task
  function validate() {
    // declares mutable state used in this scope
    let valid = true;

    // checks a condition before executing this branch
    if (!passwordInput.value) {
      // executes this operation step as part of the flow
      passwordError.textContent = "Password is required";
      // executes this operation step as part of the flow
      valid = false;
    } else if (passwordInput.value.length < 8) {
      // executes this operation step as part of the flow
      passwordError.textContent = "Minimum 8 characters";
      // executes this operation step as part of the flow
      valid = false;
    }

    // checks a condition before executing this branch
    if (!confirmInput.value) {
      // executes this operation step as part of the flow
      confirmError.textContent = "Please confirm your password";
      // executes this operation step as part of the flow
      valid = false;
    // executes this operation step as part of the flow
    } else if (confirmInput.value !== passwordInput.value) {
      // executes this operation step as part of the flow
      confirmError.textContent = "Passwords do not match";
      // executes this operation step as part of the flow
      valid = false;
    }

    // returns a value from the current function
    return valid;
  }

  // attaches a dom event listener for user interaction
  form.addEventListener("submit", async (e) => {
    // executes this operation step as part of the flow
    e.preventDefault();
    // executes this operation step as part of the flow
    clearErrors();

    // checks a condition before executing this branch
    if (!token) {
      // executes this operation step as part of the flow
      generalError.textContent = "Missing or invalid reset token.";
      // returns a value from the current function
      return;
    }

    // checks a condition before executing this branch
    if (!validate()) return;

    // executes this operation step as part of the flow
    btn.disabled = true;
    // executes this operation step as part of the flow
    btn.querySelector(".bw-btn-text").textContent = "Updating...";

    // declares a constant used in this scope
    const payload = {
      token,
      // sets a named field inside an object or configuration block
      email: email || undefined,
      // sets a named field inside an object or configuration block
      password: passwordInput.value,
      // sets a named field inside an object or configuration block
      newPassword: passwordInput.value,
      // sets a named field inside an object or configuration block
      confirmPassword: confirmInput.value,
    };

    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const res = await fetch(`${API_BASE}/api/user/reset-password`, {
        // sets a named field inside an object or configuration block
        method: "POST",
        // sets a named field inside an object or configuration block
        headers: { "Content-Type": "application/json" },
        // sets a named field inside an object or configuration block
        body: JSON.stringify(payload),
      });

      // declares a constant used in this scope
      const data = await res.json().catch(() => ({}));
      // checks a condition before executing this branch
      if (!res.ok || data?.success === false) {
        // throws an error to be handled by calling code
        throw new Error(
          data?.message || "Password reset failed. Please try again.",
        );
      }

      // executes this operation step as part of the flow
      btn.classList.add("success");
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "Updated";

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
      }, 500);
    } catch (err) {
      // executes this operation step as part of the flow
      generalError.textContent =
        // executes this operation step as part of the flow
        err.message || "Password reset failed. Please try again.";
      // executes this operation step as part of the flow
      btn.querySelector(".bw-btn-text").textContent = "Update Password";
      // executes this operation step as part of the flow
      btn.disabled = false;
    }
  });

  // declares a constant used in this scope
  const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
  // declares a constant used in this scope
  const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;

  // attaches a dom event listener for user interaction
  document.getElementById("rpPwToggle").addEventListener("click", () => {
    // declares a constant used in this scope
    const hidden = passwordInput.type === "password";
    // executes this operation step as part of the flow
    passwordInput.type = hidden ? "text" : "password";
    // executes this operation step as part of the flow
    document.getElementById("rpEyeIcon").innerHTML = hidden
      ? eyeClosed
      // executes this operation step as part of the flow
      : eyeOpen;
  });

  // attaches a dom event listener for user interaction
  document.getElementById("rpConfirmToggle").addEventListener("click", () => {
    // declares a constant used in this scope
    const hidden = confirmInput.type === "password";
    // executes this operation step as part of the flow
    confirmInput.type = hidden ? "text" : "password";
    // executes this operation step as part of the flow
    document.getElementById("rpConfirmEyeIcon").innerHTML = hidden
      ? eyeClosed
      // executes this operation step as part of the flow
      : eyeOpen;
  });

  attachCapsLockHints([
    { input: passwordInput, hintEl: passwordCapsHint },
    { input: confirmInput, hintEl: confirmCapsHint },
  ]);
}