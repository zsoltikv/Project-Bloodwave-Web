// caps-lock utility module: provides shared helper functions for validation and ui checks.
// keeps small reusable logic out of page-level modules.

let trackingEnabled = false;
// declares mutable state used in this scope
let hasTrackedCapsLockState = false;
// declares mutable state used in this scope
let lastCapsLockState = false;

// declares a helper function for a focused task
function updateTrackedCapsLockState(event) {
  // checks a condition before executing this branch
  if (typeof event?.getModifierState !== "function") return;

  // executes this operation step as part of the flow
  hasTrackedCapsLockState = true;
  // executes this operation step as part of the flow
  lastCapsLockState = event.getModifierState("CapsLock");
}

// declares a helper function for a focused task
function ensureCapsLockTracking() {
  // checks a condition before executing this branch
  if (trackingEnabled) return;

  // executes this operation step as part of the flow
  trackingEnabled = true;
  // attaches a dom event listener for user interaction
  document.addEventListener("keydown", updateTrackedCapsLockState, true);
  // attaches a dom event listener for user interaction
  document.addEventListener("keyup", updateTrackedCapsLockState, true);
}

// declares a helper function for a focused task
function setHintVisibility(hintEl, visible) {
  // checks a condition before executing this branch
  if (!hintEl) return;

  // executes this operation step as part of the flow
  hintEl.classList.toggle("is-visible", visible);
  // executes this operation step as part of the flow
  hintEl.setAttribute("aria-hidden", String(!visible));
}

// exports a reusable helper function
export function attachCapsLockHint(input, hintEl) {
  // checks a condition before executing this branch
  if (!input || !hintEl) {
    // returns a value from the current function
    return () => {};
  }

  // executes this operation step as part of the flow
  ensureCapsLockTracking();
  // executes this operation step as part of the flow
  setHintVisibility(hintEl, false);

  // declares a constant used in this scope
  const syncFromTrackedState = () => {
    // declares a constant used in this scope
    const isFocused = document.activeElement === input;
    setHintVisibility(
      hintEl,
      isFocused && hasTrackedCapsLockState && lastCapsLockState,
    );
  };

  // declares a constant used in this scope
  const syncFromKeyboardEvent = (event) => {
    // executes this operation step as part of the flow
    updateTrackedCapsLockState(event);
    // executes this operation step as part of the flow
    syncFromTrackedState();
  };

  // declares a constant used in this scope
  const hideHint = () => {
    // executes this operation step as part of the flow
    setHintVisibility(hintEl, false);
  };

  // attaches a dom event listener for user interaction
  input.addEventListener("focus", syncFromTrackedState);
  // attaches a dom event listener for user interaction
  input.addEventListener("blur", hideHint);
  // attaches a dom event listener for user interaction
  input.addEventListener("keydown", syncFromKeyboardEvent);
  // attaches a dom event listener for user interaction
  input.addEventListener("keyup", syncFromKeyboardEvent);

  // returns a value from the current function
  return () => {
    // executes this operation step as part of the flow
    input.removeEventListener("focus", syncFromTrackedState);
    // executes this operation step as part of the flow
    input.removeEventListener("blur", hideHint);
    // executes this operation step as part of the flow
    input.removeEventListener("keydown", syncFromKeyboardEvent);
    // executes this operation step as part of the flow
    input.removeEventListener("keyup", syncFromKeyboardEvent);
  };
}

// exports a reusable helper function
export function attachCapsLockHints(bindings) {
  // checks a condition before executing this branch
  if (!Array.isArray(bindings)) {
    // returns a value from the current function
    return [];
  }

  // returns a value from the current function
  return bindings.map(({ input, hintEl }) => attachCapsLockHint(input, hintEl));
}