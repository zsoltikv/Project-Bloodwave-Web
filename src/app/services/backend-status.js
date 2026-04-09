// backend-status service module: handles backend communication and auth-related helpers.
// keeps request, token and session logic reusable across pages.

import { API_BASE, getToken } from "./auth.js";

// declares a constant used in this scope
const PING_CHECK_URL = `${API_BASE}/api/Test/ping`;
// declares a constant used in this scope
const SESSION_CHECK_URL = `${API_BASE}/api/User/me`;
// declares a constant used in this scope
const REQUEST_TIMEOUT_MS = 8000;

export async function fetchBackendStatus() {
  // waits for an asynchronous operation to complete
  const [pingCheck, sessionCheck] = await Promise.all([
    probeEndpoint(PING_CHECK_URL, {
      // sets a named field inside an object or configuration block
      headers: {
        // sets a named field inside an object or configuration block
        Accept: "application/json",
      },
    }),
    probeEndpoint(SESSION_CHECK_URL, {
      // sets a named field inside an object or configuration block
      headers: buildSessionHeaders(),
    }),
  ]);

  // declares a constant used in this scope
  const publicHealthy = isPingEndpointHealthy(pingCheck);
  // declares a constant used in this scope
  const sessionHealthy = isSessionEndpointHealthy(sessionCheck);
  // declares a constant used in this scope
  const anyReachable =
    // executes this operation step as part of the flow
    didEndpointRespond(pingCheck) || didEndpointRespond(sessionCheck);

  // declares mutable state used in this scope
  let tone = "warn";
  // declares mutable state used in this scope
  let label = "Degraded";
  // declares mutable state used in this scope
  let summary =
    // executes this operation step as part of the flow
    "Some backend checks responded, but the server is not fully healthy.";

  // checks a condition before executing this branch
  if (!anyReachable) {
    // executes this operation step as part of the flow
    tone = "down";
    // executes this operation step as part of the flow
    label = "Down";
    // executes this operation step as part of the flow
    summary =
      // executes this operation step as part of the flow
      "The dashboard could not reach the backend server. It may be offline or blocked by the network.";
  } else if (publicHealthy && sessionHealthy) {
    // executes this operation step as part of the flow
    tone = "ok";
    // executes this operation step as part of the flow
    label = "Operational";
    // executes this operation step as part of the flow
    summary =
      // executes this operation step as part of the flow
      "The API and authenticated session endpoint are responding normally.";
  } else if (publicHealthy) {
    // executes this operation step as part of the flow
    summary =
      // executes this operation step as part of the flow
      "The API is reachable, but the authenticated session check is failing.";
  } else if (sessionHealthy) {
    // executes this operation step as part of the flow
    summary =
      // executes this operation step as part of the flow
      "Authentication is responding, but the general API probe reported an issue.";
  }

  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    apiBase: API_BASE,
    // sets a named field inside an object or configuration block
    apiHost: safeGetHost(API_BASE),
    tone,
    label,
    summary,
    // sets a named field inside an object or configuration block
    lastCheckedAt: new Date().toISOString(),
    // sets a named field inside an object or configuration block
    responseTimeMs: getFastestReachableResponseTime(pingCheck, sessionCheck),
    // sets a named field inside an object or configuration block
    httpSummary: buildHttpSummary(pingCheck, sessionCheck),
    // sets a named field inside an object or configuration block
    pingCheck: formatPingCheck(pingCheck),
    // sets a named field inside an object or configuration block
    sessionCheck: formatSessionCheck(sessionCheck),
    // sets a named field inside an object or configuration block
    serverName: normalizeServerName(pingCheck.payload),
    // sets a named field inside an object or configuration block
    serverUtc: normalizeServerUtc(pingCheck.payload),
  };
}

// declares a helper function for a focused task
function buildSessionHeaders() {
  // declares a constant used in this scope
  const token = getToken();

  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// executes this operation step as part of the flow
async function probeEndpoint(url, options = {}) {
  // declares a constant used in this scope
  const controller = new AbortController();
  // declares a constant used in this scope
  const startedAt = Date.now();
  // declares a constant used in this scope
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const response = await fetch(url, {
      // sets a named field inside an object or configuration block
      method: "GET",
      // sets a named field inside an object or configuration block
      cache: "no-store",
      ...options,
      // sets a named field inside an object or configuration block
      signal: controller.signal,
    });

    // returns a value from the current function
    return {
      url,
      // sets a named field inside an object or configuration block
      reachable: true,
      // sets a named field inside an object or configuration block
      ok: response.ok,
      // sets a named field inside an object or configuration block
      statusCode: response.status,
      // sets a named field inside an object or configuration block
      statusText: response.statusText || "",
      // sets a named field inside an object or configuration block
      responseTimeMs: Math.max(1, Date.now() - startedAt),
      // waits for an asynchronous operation to complete
      ...(await readResponsePayload(response)),
    };
  } catch (error) {
    // returns a value from the current function
    return {
      url,
      // sets a named field inside an object or configuration block
      reachable: false,
      // sets a named field inside an object or configuration block
      ok: false,
      // sets a named field inside an object or configuration block
      statusCode: null,
      // sets a named field inside an object or configuration block
      statusText: "",
      // sets a named field inside an object or configuration block
      responseTimeMs: null,
      // sets a named field inside an object or configuration block
      detail: "",
      // sets a named field inside an object or configuration block
      errorCode: normalizeNetworkError(error),
    };
  } finally {
    // executes this operation step as part of the flow
    clearTimeout(timeoutId);
  }
}

async function readResponsePayload(response) {
  // declares a constant used in this scope
  const contentType = (
    response.headers.get("content-type") || ""
  // executes this operation step as part of the flow
  ).toLowerCase();
  // declares a constant used in this scope
  const raw = (await response.text()).trim();
  // checks a condition before executing this branch
  if (!raw) {
    // returns a value from the current function
    return {
      // sets a named field inside an object or configuration block
      payload: null,
      // sets a named field inside an object or configuration block
      detail: "",
    };
  }

  // checks a condition before executing this branch
  if (contentType.includes("application/json")) {
    // starts guarded logic to catch runtime errors
    try {
      // declares a constant used in this scope
      const parsed = JSON.parse(raw);
      // returns a value from the current function
      return {
        // sets a named field inside an object or configuration block
        payload: parsed,
        // sets a named field inside an object or configuration block
        detail: normalizePayloadDetail(parsed),
      };
    } catch {
      // Fall back to plain text normalization below.
    }
  }

  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    payload: raw,
    // sets a named field inside an object or configuration block
    detail: normalizeTextDetail(raw),
  };
}

// declares a helper function for a focused task
function normalizePayloadDetail(payload) {
  // checks a condition before executing this branch
  if (typeof payload === "string") {
    // returns a value from the current function
    return normalizeTextDetail(payload);
  }

  // checks a condition before executing this branch
  if (!payload || typeof payload !== "object") {
    // returns a value from the current function
    return "";
  }

  // declares a constant used in this scope
  const candidates = [
    payload.status,
    payload.message,
    payload.title,
    payload.detail,
    payload.error,
  ];

  // iterates through a sequence of values
  for (const candidate of candidates) {
    // checks a condition before executing this branch
    if (typeof candidate === "string" && candidate.trim()) {
      // returns a value from the current function
      return normalizeTextDetail(candidate);
    }
  }

  // returns a value from the current function
  return "";
}

// declares a helper function for a focused task
function normalizeTextDetail(value) {
  // returns a value from the current function
  return String(value).replace(/\s+/g, " ").trim().slice(0, 140);
}

// declares a helper function for a focused task
function normalizeNetworkError(error) {
  // checks a condition before executing this branch
  if (error?.name === "AbortError") {
    // returns a value from the current function
    return "timeout";
  }

  // returns a value from the current function
  return "network";
}

// declares a helper function for a focused task
function didEndpointRespond(check) {
  // returns a value from the current function
  return !!check?.reachable && Number.isInteger(check?.statusCode);
}

// declares a helper function for a focused task
function isPingEndpointHealthy(check) {
  // returns a value from the current function
  return (
    didEndpointRespond(check) &&
    check.ok &&
    // executes this operation step as part of the flow
    readPayloadOk(check.payload) !== false
  );
}

// declares a helper function for a focused task
function isSessionEndpointHealthy(check) {
  // returns a value from the current function
  return !!check?.ok;
}

// declares a helper function for a focused task
function formatPingCheck(check) {
  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    statusLabel: buildPingStatusLabel(check),
    // sets a named field inside an object or configuration block
    detail: buildPingDetail(check),
  };
}

// declares a helper function for a focused task
function formatSessionCheck(check) {
  // returns a value from the current function
  return {
    // sets a named field inside an object or configuration block
    statusLabel: buildSessionStatusLabel(check),
    // sets a named field inside an object or configuration block
    detail: buildSessionDetail(check),
  };
}

// declares a helper function for a focused task
function buildPingStatusLabel(check) {
  // checks a condition before executing this branch
  if (!didEndpointRespond(check)) {
    // returns a value from the current function
    return "Unreachable";
  }

  // checks a condition before executing this branch
  if (check.statusCode >= 500) {
    // returns a value from the current function
    return `Server Error (${check.statusCode})`;
  }

  // checks a condition before executing this branch
  if (check.ok && readPayloadOk(check.payload) !== false) {
    // returns a value from the current function
    return `Healthy (${check.statusCode})`;
  }

  // checks a condition before executing this branch
  if (check.ok) {
    // returns a value from the current function
    return `Unexpected Payload (${check.statusCode})`;
  }

  // returns a value from the current function
  return `Reachable (${check.statusCode})`;
}

// declares a helper function for a focused task
function buildSessionStatusLabel(check) {
  // checks a condition before executing this branch
  if (!didEndpointRespond(check)) {
    // returns a value from the current function
    return "Unreachable";
  }

  // checks a condition before executing this branch
  if (check.ok) {
    // returns a value from the current function
    return `Healthy (${check.statusCode})`;
  }

  // checks a condition before executing this branch
  if (check.statusCode === 401 || check.statusCode === 403) {
    // returns a value from the current function
    return `Auth Issue (${check.statusCode})`;
  }

  // checks a condition before executing this branch
  if (check.statusCode >= 500) {
    // returns a value from the current function
    return `Server Error (${check.statusCode})`;
  }

  // returns a value from the current function
  return `Unexpected (${check.statusCode})`;
}

// declares a helper function for a focused task
function buildPingDetail(check) {
  // checks a condition before executing this branch
  if (!didEndpointRespond(check)) {
    // returns a value from the current function
    return check?.errorCode === "timeout"
      ? "The API did not answer before the timeout window."
      // executes this operation step as part of the flow
      : "The browser could not reach this backend route.";
  }

  // checks a condition before executing this branch
  if (check.statusCode >= 500) {
    // returns a value from the current function
    return appendDetail(
      `The server returned HTTP ${check.statusCode}.`,
      check.detail,
    );
  }

  // checks a condition before executing this branch
  if (check.ok && readPayloadOk(check.payload) !== false) {
    // returns a value from the current function
    return appendDetail("The ping route responded normally.", check.detail);
  }

  // checks a condition before executing this branch
  if (check.ok) {
    // returns a value from the current function
    return appendDetail(
      "The ping route responded, but the payload did not confirm an OK state.",
      check.detail,
    );
  }

  // returns a value from the current function
  return appendDetail(
    `The route responded with HTTP ${check.statusCode}.`,
    check.detail,
  );
}

// declares a helper function for a focused task
function buildSessionDetail(check) {
  // checks a condition before executing this branch
  if (!didEndpointRespond(check)) {
    // returns a value from the current function
    return check?.errorCode === "timeout"
      ? "The authenticated route timed out before it could respond."
      // executes this operation step as part of the flow
      : "The browser could not reach the authenticated session route.";
  }

  // checks a condition before executing this branch
  if (check.ok) {
    // returns a value from the current function
    return "The authenticated session probe responded normally.";
  }

  // checks a condition before executing this branch
  if (check.statusCode === 401 || check.statusCode === 403) {
    // returns a value from the current function
    return "The backend is online, but the current login session was rejected.";
  }

  // checks a condition before executing this branch
  if (check.statusCode >= 500) {
    // returns a value from the current function
    return appendDetail(
      `The authenticated route returned HTTP ${check.statusCode}.`,
      check.detail,
    );
  }

  // returns a value from the current function
  return appendDetail(
    `The authenticated route responded with HTTP ${check.statusCode}.`,
    check.detail,
  );
}

// declares a helper function for a focused task
function appendDetail(prefix, detail) {
  // checks a condition before executing this branch
  if (!detail) return prefix;
  // returns a value from the current function
  return `${prefix} ${detail}`;
}

// declares a helper function for a focused task
function getFastestReachableResponseTime(...checks) {
  // declares a constant used in this scope
  const latencies = checks
    .filter(didEndpointRespond)
    // executes this operation step as part of the flow
    .map((check) => Number(check.responseTimeMs))
    // executes this operation step as part of the flow
    .filter((value) => Number.isFinite(value) && value > 0);

  // checks a condition before executing this branch
  if (!latencies.length) return null;
  // returns a value from the current function
  return Math.min(...latencies);
}

// declares a helper function for a focused task
function buildHttpSummary(pingCheck, sessionCheck) {
  // returns a value from the current function
  return `Ping ${formatHttpStatus(pingCheck)} | Session ${formatHttpStatus(sessionCheck)}`;
}

// declares a helper function for a focused task
function formatHttpStatus(check) {
  // checks a condition before executing this branch
  if (didEndpointRespond(check)) {
    // returns a value from the current function
    return String(check.statusCode);
  }

  // checks a condition before executing this branch
  if (check?.errorCode === "timeout") {
    // returns a value from the current function
    return "timeout";
  }

  // returns a value from the current function
  return "unreachable";
}

// declares a helper function for a focused task
function safeGetHost(url) {
  // starts guarded logic to catch runtime errors
  try {
    // returns a value from the current function
    return new URL(url).host;
  } catch {
    // returns a value from the current function
    return url;
  }
}

// declares a helper function for a focused task
function readPayloadOk(payload) {
  // checks a condition before executing this branch
  if (!payload || typeof payload !== "object") {
    // returns a value from the current function
    return null;
  }

  // returns a value from the current function
  return typeof payload.ok === "boolean" ? payload.ok : null;
}

// declares a helper function for a focused task
function normalizeServerName(payload) {
  // checks a condition before executing this branch
  if (!payload || typeof payload !== "object") {
    // returns a value from the current function
    return "";
  }

  // returns a value from the current function
  return typeof payload.server === "string" ? payload.server.trim() : "";
}

// declares a helper function for a focused task
function normalizeServerUtc(payload) {
  // checks a condition before executing this branch
  if (!payload || typeof payload !== "object") {
    // returns a value from the current function
    return "";
  }

  // returns a value from the current function
  return typeof payload.utc === "string" ? payload.utc.trim() : "";
}