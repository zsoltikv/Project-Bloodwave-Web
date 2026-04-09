// auth service module: handles backend communication and auth-related helpers.
// keeps request, token and session logic reusable across pages.

export const API_BASE = "https://api.bloodwave.site";

// How many seconds before expiry we proactively refresh (60 s buffer)
const REFRESH_BUFFER_SEC = 60;

// Refresh token cookie lifetime in days
const REFRESH_COOKIE_DAYS = 30;

// ─── Cookie helpers ────────────────────────────────────────────────────────────

function setCookie(name, value, expiresISO, days) {
  // declares mutable state used in this scope
  let expires = "";
  // checks a condition before executing this branch
  if (expiresISO) {
    // executes this operation step as part of the flow
    expires = `; expires=${new Date(expiresISO).toUTCString()}`;
  } else if (days) {
    // declares a constant used in this scope
    const d = new Date();
    // executes this operation step as part of the flow
    d.setDate(d.getDate() + days);
    // executes this operation step as part of the flow
    expires = `; expires=${d.toUTCString()}`;
  }
  // executes this operation step as part of the flow
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict`;
}

// declares a helper function for a focused task
function getCookie(name) {
  // declares a constant used in this scope
  const match = document.cookie.match(
    new RegExp(
      // executes this operation step as part of the flow
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  // returns a value from the current function
  return match ? decodeURIComponent(match[1]) : null;
}

// declares a helper function for a focused task
function deleteCookie(name) {
  // executes this operation step as part of the flow
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
}

// ─── Session helpers ───────────────────────────────────────────────────────────
// rememberMe = true  → persistent cookies (survive browser restart)
// rememberMe = false → sessionStorage (guaranteed cleared on browser close,
//                      unlike session cookies which Chrome often restores)

const SESSION_KEYS = ["bw_token", "bw_refreshToken", "bw_expiresAt", "bw_user"];

// declares a helper function for a focused task
function saveSession(data, rememberMe = true) {
  // Always clear the other storage first to avoid stale data
  if (rememberMe) {
    // executes this operation step as part of the flow
    SESSION_KEYS.forEach((k) => sessionStorage.removeItem(k));
    // executes this operation step as part of the flow
    setCookie("bw_token", data.token, data.expiresAt);
    // executes this operation step as part of the flow
    setCookie("bw_refreshToken", data.refreshToken, null, REFRESH_COOKIE_DAYS);
    // executes this operation step as part of the flow
    setCookie("bw_expiresAt", data.expiresAt, null, REFRESH_COOKIE_DAYS);
    // executes this operation step as part of the flow
    setCookie("bw_user", JSON.stringify(data.user), null, REFRESH_COOKIE_DAYS);
    // executes this operation step as part of the flow
    setCookie("bw_remember", "1", null, REFRESH_COOKIE_DAYS);
  } else {
    // executes this operation step as part of the flow
    SESSION_KEYS.forEach(deleteCookie);
    // executes this operation step as part of the flow
    deleteCookie("bw_remember");
    // executes this operation step as part of the flow
    sessionStorage.setItem("bw_token", data.token);
    // executes this operation step as part of the flow
    sessionStorage.setItem("bw_refreshToken", data.refreshToken);
    // executes this operation step as part of the flow
    sessionStorage.setItem("bw_expiresAt", data.expiresAt);
    // executes this operation step as part of the flow
    sessionStorage.setItem("bw_user", JSON.stringify(data.user));
  }
}

// declares a helper function for a focused task
function clearSession() {
  // executes this operation step as part of the flow
  SESSION_KEYS.forEach((k) => sessionStorage.removeItem(k));
  // executes this operation step as part of the flow
  SESSION_KEYS.forEach(deleteCookie);
  // executes this operation step as part of the flow
  deleteCookie("bw_remember");
}

// Getters: sessionStorage takes precedence (set when rememberMe=false);
// fall back to cookie (set when rememberMe=true).
function _get(key) {
  // returns a value from the current function
  return sessionStorage.getItem(key) ?? getCookie(key);
}

// exports a reusable helper function
export function getToken() {
  // returns a value from the current function
  return _get("bw_token");
}
// exports a reusable helper function
export function getRefreshToken() {
  // returns a value from the current function
  return _get("bw_refreshToken");
}
// exports a reusable helper function
export function getExpiresAt() {
  // returns a value from the current function
  return _get("bw_expiresAt");
}
// exports a reusable helper function
export function getUser() {
  // declares a constant used in this scope
  const raw = _get("bw_user");
  // starts guarded logic to catch runtime errors
  try {
    // returns a value from the current function
    return raw ? JSON.parse(raw) : null;
  } catch {
    // returns a value from the current function
    return null;
  }
}

/** True when a valid session exists in either storage */
export function isLoggedIn() {
  // returns a value from the current function
  return !!getToken() || !!getRefreshToken();
}

/** True when the access token is expired or will expire within REFRESH_BUFFER_SEC */
function isTokenExpired() {
  // declares a constant used in this scope
  const expiresAt = getExpiresAt();
  // checks a condition before executing this branch
  if (!expiresAt) return true;
  // returns a value from the current function
  return (
    // executes this operation step as part of the flow
    Date.now() >= new Date(expiresAt).getTime() - REFRESH_BUFFER_SEC * 1000
  );
}

// ─── Token refresh ─────────────────────────────────────────────────────────────

export async function refreshSession() {
  // declares a constant used in this scope
  const refreshToken = getRefreshToken();
  // declares a constant used in this scope
  const expiresAt = getExpiresAt();
  // checks a condition before executing this branch
  if (!refreshToken) throw new Error("No refresh token");

  // declares a constant used in this scope
  const res = await fetch(`${API_BASE}/api/Auth/refresh`, {
    // sets a named field inside an object or configuration block
    method: "POST",
    // sets a named field inside an object or configuration block
    headers: { "Content-Type": "application/json" },
    // sets a named field inside an object or configuration block
    body: JSON.stringify({ refreshToken, expiresAt }),
  });

  // If the refresh endpoint is missing (404) or otherwise returns a client error,
  // clear local session to avoid repeated automatic refresh attempts that spam the console.
  if (res.status === 404) {
    // executes this operation step as part of the flow
    clearSession();
    // executes this operation step as part of the flow
    window.router?.navigate("/login");
    // throws an error to be handled by calling code
    throw new Error("Token refresh endpoint not found (404)");
  }

  // declares a constant used in this scope
  const data = await res.json();
  // checks a condition before executing this branch
  if (!res.ok || !data.success) {
    // For other failures, clear session and surface a readable error.
    clearSession();
    // throws an error to be handled by calling code
    throw new Error(data.message || "Token refresh failed");
  }

  // Preserve the original remember-me choice:
  // bw_remember cookie is only set when rememberMe=true
  const rememberMe = !!getCookie("bw_remember");
  // executes this operation step as part of the flow
  saveSession(data, rememberMe);
  // returns a value from the current function
  return data;
}

/**
 * Ensures a valid, non-expired access token is available.
 * If the token is expired (or about to expire) and a refresh token exists,
 * attempts a silent refresh. Redirects to /login if refresh fails.
 */
export async function ensureValidToken() {
  // checks a condition before executing this branch
  if (!isTokenExpired()) return; // token is fine

  // checks a condition before executing this branch
  if (!getRefreshToken()) {
    // executes this operation step as part of the flow
    clearSession();
    // executes this operation step as part of the flow
    window.router?.navigate("/login");
    // throws an error to be handled by calling code
    throw new Error("Not authenticated");
  }

  // starts guarded logic to catch runtime errors
  try {
    // waits for an asynchronous operation to complete
    await refreshSession();
  } catch {
    // executes this operation step as part of the flow
    clearSession();
    // executes this operation step as part of the flow
    window.router?.navigate("/login");
    // throws an error to be handled by calling code
    throw new Error("Session expired. Please log in again.");
  }
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────

export async function register(username, email, password) {
  // declares a constant used in this scope
  const res = await fetch(`${API_BASE}/api/user`, {
    // sets a named field inside an object or configuration block
    method: "POST",
    // sets a named field inside an object or configuration block
    headers: { "Content-Type": "application/json" },
    // sets a named field inside an object or configuration block
    body: JSON.stringify({ username, email, password }),
  });

  // declares a constant used in this scope
  const data = await res.json();
  // checks a condition before executing this branch
  if (!res.ok || !data.success)
    // throws an error to be handled by calling code
    throw new Error(data.message || "Registration failed");

  // returns a value from the current function
  return data;
}

// executes this operation step as part of the flow
export async function login(username, password, rememberMe = false) {
  // declares a constant used in this scope
  const res = await fetch(`${API_BASE}/api/user/login`, {
    // sets a named field inside an object or configuration block
    method: "POST",
    // sets a named field inside an object or configuration block
    headers: { "Content-Type": "application/json" },
    // sets a named field inside an object or configuration block
    body: JSON.stringify({ username, password }),
  });

  // declares a constant used in this scope
  const data = await res.json();
  // checks a condition before executing this branch
  if (!res.ok || !data.success) throw new Error(data.message || "Login failed");

  // executes this operation step as part of the flow
  saveSession(data, rememberMe);
  // returns a value from the current function
  return data;
}

export async function logout() {
  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const token = getToken();
    // waits for an asynchronous operation to complete
    await fetch(`${API_BASE}/api/user/logout`, {
      // sets a named field inside an object or configuration block
      method: "POST",
      // sets a named field inside an object or configuration block
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } finally {
    // executes this operation step as part of the flow
    clearSession();
    // executes this operation step as part of the flow
    window.router?.navigate("/login");
  }
}

// ─── Authenticated fetch wrapper ───────────────────────────────────────────────
// Proactively refreshes the token if it is about to expire, then attaches it.
// Falls back to a single retry on an unexpected 401.

export async function authFetch(url, options = {}) {
  // declares a constant used in this scope
  const skipAutoLogout = options.skipAutoLogout;

  // Proactive refresh before the request
  try {
    // waits for an asynchronous operation to complete
    await ensureValidToken();
  } catch (err) {
    // checks a condition before executing this branch
    if (skipAutoLogout) {
      // Don't auto-logout for certain critical requests like account deletion
      // Re-throw the error so the caller can handle it
      throw err;
    }
    // throws an error to be handled by calling code
    throw err;
  }

  // declares a constant used in this scope
  const makeHeaders = () => ({
    "Content-Type": "application/json",
    ...options.headers,
    // sets a named field inside an object or configuration block
    Authorization: `Bearer ${getToken()}`,
  });

  // declares mutable state used in this scope
  let res = await fetch(url, { ...options, headers: makeHeaders() });

  // checks a condition before executing this branch
  if (res.status === 401) {
    // Server still rejected — try one more refresh then retry
    try {
      // waits for an asynchronous operation to complete
      await refreshSession();
      // waits for an asynchronous operation to complete
      res = await fetch(url, { ...options, headers: makeHeaders() });
    } catch {
      // checks a condition before executing this branch
      if (!skipAutoLogout) {
        // executes this operation step as part of the flow
        clearSession();
        // executes this operation step as part of the flow
        window.router?.navigate("/login");
      }
      // throws an error to be handled by calling code
      throw new Error("Session expired. Please log in again.");
    }
  }

  // returns a value from the current function
  return res;
}