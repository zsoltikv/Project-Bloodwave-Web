let trackingEnabled = false;
let hasTrackedCapsLockState = false;
let lastCapsLockState = false;

function updateTrackedCapsLockState(event) {
  if (typeof event?.getModifierState !== "function") return;

  hasTrackedCapsLockState = true;
  lastCapsLockState = event.getModifierState("CapsLock");
}

function ensureCapsLockTracking() {
  if (trackingEnabled) return;

  trackingEnabled = true;
  document.addEventListener("keydown", updateTrackedCapsLockState, true);
  document.addEventListener("keyup", updateTrackedCapsLockState, true);
}

function setHintVisibility(hintEl, visible) {
  if (!hintEl) return;

  hintEl.classList.toggle("is-visible", visible);
  hintEl.setAttribute("aria-hidden", String(!visible));
}

export function attachCapsLockHint(input, hintEl) {
  if (!input || !hintEl) {
    return () => {};
  }

  ensureCapsLockTracking();
  setHintVisibility(hintEl, false);

  const syncFromTrackedState = () => {
    const isFocused = document.activeElement === input;
    setHintVisibility(
      hintEl,
      isFocused && hasTrackedCapsLockState && lastCapsLockState,
    );
  };

  const syncFromKeyboardEvent = (event) => {
    updateTrackedCapsLockState(event);
    syncFromTrackedState();
  };

  const hideHint = () => {
    setHintVisibility(hintEl, false);
  };

  input.addEventListener("focus", syncFromTrackedState);
  input.addEventListener("blur", hideHint);
  input.addEventListener("keydown", syncFromKeyboardEvent);
  input.addEventListener("keyup", syncFromKeyboardEvent);

  return () => {
    input.removeEventListener("focus", syncFromTrackedState);
    input.removeEventListener("blur", hideHint);
    input.removeEventListener("keydown", syncFromKeyboardEvent);
    input.removeEventListener("keyup", syncFromKeyboardEvent);
  };
}

export function attachCapsLockHints(bindings) {
  if (!Array.isArray(bindings)) {
    return [];
  }

  return bindings.map(({ input, hintEl }) => attachCapsLockHint(input, hintEl));
}