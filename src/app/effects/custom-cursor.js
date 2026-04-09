// custom-cursor effect module: applies reusable dom effects and ui behaviors.
// keeps visual interaction logic isolated from page rendering code.

// selector used to detect interactive elements that should trigger the active cursor state
const INTERACTIVE_SELECTOR =
  // executes this operation step as part of the flow
  'a, button, [role="button"], input, textarea, select, summary, label, [data-link]';

// how many dots are rendered in the trailing cursor effect
const TRAIL_LENGTH = 6;

// regexp used as part of a heuristic to detect mobile user agents
const MOBILE_UA_REGEX =
  // executes this operation step as part of the flow
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

// lerp configuration for cursor movement; values tuned for snappy but smooth motion
const CURSOR_LERP_MIN = 1;
// declares a constant used in this scope
const CURSOR_LERP_MAX = 1;
// declares a constant used in this scope
const CURSOR_DISTANCE_FOR_MAX_SPEED = 1;
// declares a constant used in this scope
const CURSOR_CATCHUP_DISTANCE = 0.1;

// baseline frame duration in ms (approx. 60fps → 16.67ms)
const FRAME_MS_BASELINE = 16.67;

// mutable runtime state for cursor and trail rendering
let cursorRoot = null;
// declares mutable state used in this scope
let trailLayerEl = null;
// declares mutable state used in this scope
let trailDots = [];
// declares mutable state used in this scope
let trailPoints = [];
// declares mutable state used in this scope
let frameId = 0;
// declares mutable state used in this scope
let currentX = 0;
// declares mutable state used in this scope
let currentY = 0;
// declares mutable state used in this scope
let targetX = 0;
// declares mutable state used in this scope
let targetY = 0;
// declares mutable state used in this scope
let pointerActive = false;
// declares mutable state used in this scope
let listenersController = null;
// declares mutable state used in this scope
let lastFrameTime = 0;

// declares a helper function for a focused task
function supportsFancyCursor() {
  // quickly exclude obvious phone devices
  if (isPhoneDevice()) return false;

  // require a fine pointer and hover capability, and avoid small viewports
  // this prevents the fancy cursor from activating on touch or compact layouts
  return (
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(max-width: 900px)").matches
  );
}

// declares a helper function for a focused task
function isPhoneDevice() {
  // detect mobile via user agent hints when available, or a regex fallback
  const uaDataMobile = navigator.userAgentData?.mobile === true;
  // declares a constant used in this scope
  const userAgent = navigator.userAgent || "";
  // checks a condition before executing this branch
  if (uaDataMobile || MOBILE_UA_REGEX.test(userAgent)) return true;

  // further heuristics using media queries and touch capability
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  // declares a constant used in this scope
  const anyCoarsePointer = window.matchMedia("(any-pointer: coarse)").matches;
  // declares a constant used in this scope
  const noHover = window.matchMedia("(hover: none)").matches;
  // declares a constant used in this scope
  const anyNoHover = window.matchMedia("(any-hover: none)").matches;
  // declares a constant used in this scope
  const smallViewport = window.matchMedia("(max-width: 1024px)").matches;
  // declares a constant used in this scope
  const hasTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;

  // require touch plus coarse/no-hover signals and a smaller viewport to classify as phone
  return (
    hasTouch &&
    (coarsePointer || anyCoarsePointer || noHover || anyNoHover) &&
    smallViewport
  );
}

// declares a helper function for a focused task
function teardownCustomCursor() {
  // checks a condition before executing this branch
  if (listenersController) {
    // executes this operation step as part of the flow
    listenersController.abort();
    // executes this operation step as part of the flow
    listenersController = null;
  }
  // remove runtime listeners and dom nodes created for the cursor
  document.documentElement.classList.remove("bw-cursor-enabled");

  // checks a condition before executing this branch
  if (frameId) {
    // executes this operation step as part of the flow
    cancelAnimationFrame(frameId);
    // executes this operation step as part of the flow
    frameId = 0;
  }

  // checks a condition before executing this branch
  if (cursorRoot) {
    // executes this operation step as part of the flow
    cursorRoot.remove();
    // executes this operation step as part of the flow
    cursorRoot = null;
  }

  // checks a condition before executing this branch
  if (trailLayerEl) {
    // executes this operation step as part of the flow
    trailLayerEl.remove();
    // executes this operation step as part of the flow
    trailLayerEl = null;
  }

  // reset internal arrays and flags
  trailDots = [];
  // executes this operation step as part of the flow
  trailPoints = [];
  // executes this operation step as part of the flow
  pointerActive = false;
  // executes this operation step as part of the flow
  lastFrameTime = 0;
}

// declares a helper function for a focused task
function prefersReducedMotion() {
  // respect the user's reduced motion preference so the trail can be disabled
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// declares a helper function for a focused task
function createCursorElements() {
  // create the main cursor dom structure and an optional trail layer
  const root = document.createElement("div");
  // executes this operation step as part of the flow
  root.className = "bw-cursor";
  // executes this operation step as part of the flow
  root.setAttribute("aria-hidden", "true");
  // executes this operation step as part of the flow
  root.innerHTML = `
    <span class="bw-cursor__aura"></span>
    <span class="bw-cursor__ring"></span>
    <span class="bw-cursor__diamond"></span>
    <span class="bw-cursor__core"></span>
    <span class="bw-cursor__ray bw-cursor__ray--n"></span>
    <span class="bw-cursor__ray bw-cursor__ray--e"></span>
    <span class="bw-cursor__ray bw-cursor__ray--s"></span>
    <span class="bw-cursor__ray bw-cursor__ray--w"></span>
  `;

  // declares a constant used in this scope
  const trailLayer = document.createElement("div");
  // executes this operation step as part of the flow
  trailLayer.className = "bw-cursor-trail";
  // executes this operation step as part of the flow
  trailLayer.setAttribute("aria-hidden", "true");

  // create trail dot elements and initialize their point data
  for (let i = 0; i < TRAIL_LENGTH; i += 1) {
    // declares a constant used in this scope
    const dot = document.createElement("span");
    // executes this operation step as part of the flow
    dot.className = "bw-cursor-trail-dot";
    // executes this operation step as part of the flow
    trailLayer.appendChild(dot);
    // executes this operation step as part of the flow
    trailDots.push(dot);
    // executes this operation step as part of the flow
    trailPoints.push({ x: 0, y: 0 });
  }

  // executes this operation step as part of the flow
  document.body.append(root, trailLayer);
  // returns a value from the current function
  return { root, trailLayer };
}

// declares a helper function for a focused task
function updateTrail() {
  // skip when trail is disabled or not initialized
  if (!trailDots.length) return;

  // head of the trail follows the cursor position directly
  trailPoints[0].x = currentX;
  // executes this operation step as part of the flow
  trailPoints[0].y = currentY;

  // smooth the following points by interpolating towards the previous point
  for (let i = 1; i < TRAIL_LENGTH; i += 1) {
    // executes this operation step as part of the flow
    trailPoints[i].x += (trailPoints[i - 1].x - trailPoints[i].x) * 0.56;
    // executes this operation step as part of the flow
    trailPoints[i].y += (trailPoints[i - 1].y - trailPoints[i].y) * 0.56;
  }

  // update each dot's transform and opacity based on its index in the trail
  for (let i = 0; i < TRAIL_LENGTH; i += 1) {
    // declares a constant used in this scope
    const dot = trailDots[i];
    // declares a constant used in this scope
    const point = trailPoints[i];
    // declares a constant used in this scope
    const ratio = 1 - i / TRAIL_LENGTH;
    // declares a constant used in this scope
    const scale = 0.24 + ratio * 0.86;
    // declares a constant used in this scope
    const opacity = pointerActive ? ratio * 0.36 : 0;

    // executes this operation step as part of the flow
    dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    // executes this operation step as part of the flow
    dot.style.opacity = opacity.toFixed(3);
  }
}

// declares a helper function for a focused task
function animate(time) {
  // core animation loop handling cursor smoothing and per-frame timing
  const now = Number.isFinite(time) ? time : performance.now();
  // declares a constant used in this scope
  const frameMs = lastFrameTime
    ? Math.min(34, Math.max(8, now - lastFrameTime))
    // executes this operation step as part of the flow
    : FRAME_MS_BASELINE;
  // declares a constant used in this scope
  const frameRatio = frameMs / FRAME_MS_BASELINE;
  // executes this operation step as part of the flow
  lastFrameTime = now;

  // compute vector from current to target and the distance
  const dx = targetX - currentX;
  // declares a constant used in this scope
  const dy = targetY - currentY;
  // declares a constant used in this scope
  const distance = Math.hypot(dx, dy);

  // adjust lerp based on distance so the cursor speeds up for larger moves
  const speedFactor = Math.min(distance / CURSOR_DISTANCE_FOR_MAX_SPEED, 1);
  // declares a constant used in this scope
  const catchupBoost = distance > CURSOR_CATCHUP_DISTANCE ? 0.22 : 0;
  // declares a constant used in this scope
  const lerpBase = Math.min(
    CURSOR_LERP_MAX,
    CURSOR_LERP_MIN +
      (CURSOR_LERP_MAX - CURSOR_LERP_MIN) * speedFactor +
      catchupBoost,
  );
  // declares a constant used in this scope
  const lerp = 1 - (1 - lerpBase) ** frameRatio;

  // move current position toward target using the computed lerp
  currentX += dx * lerp;
  // executes this operation step as part of the flow
  currentY += dy * lerp;

  // apply transform to the root cursor element
  if (cursorRoot) {
    // executes this operation step as part of the flow
    cursorRoot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  // update the trailing dots positions
  updateTrail();

  // request next frame
  frameId = requestAnimationFrame(animate);
}

// declares a helper function for a focused task
function setInteractiveState(target) {
  // toggle the active styling when the pointer is over an interactive element
  if (!cursorRoot) return;
  // declares a constant used in this scope
  const interactive = target?.closest?.(INTERACTIVE_SELECTOR);
  // executes this operation step as part of the flow
  cursorRoot.classList.toggle("bw-cursor--active", Boolean(interactive));
}

// exports the main function for this module
export default function ensureCustomCursor() {
  // ensure the fancy cursor is supported in the current environment
  if (!supportsFancyCursor()) {
    // executes this operation step as part of the flow
    teardownCustomCursor();
    // returns a value from the current function
    return;
  }

  // avoid re-initializing when already active
  if (cursorRoot) return;

  // create dom elements and attach them to the document
  const { root, trailLayer } = createCursorElements();
  // executes this operation step as part of the flow
  cursorRoot = root;
  // executes this operation step as part of the flow
  trailLayerEl = trailLayer;
  // executes this operation step as part of the flow
  listenersController = new AbortController();
  // executes this operation step as part of the flow
  document.documentElement.classList.add("bw-cursor-enabled");

  // respect reduced motion preference: disable trail when requested
  const useTrail = !prefersReducedMotion();
  // checks a condition before executing this branch
  if (!useTrail) {
    // executes this operation step as part of the flow
    trailDots = [];
    // executes this operation step as part of the flow
    trailPoints = [];
  }

  // pointer move handler: update target position and ensure cursor becomes visible
  const handlePointerMove = (event) => {
    // checks a condition before executing this branch
    if (!cursorRoot) return;

    // executes this operation step as part of the flow
    pointerActive = true;
    // executes this operation step as part of the flow
    targetX = event.clientX;
    // executes this operation step as part of the flow
    targetY = event.clientY;

    // on initial visibility, jump the current position to the target to avoid a laggy spawn
    if (!cursorRoot.classList.contains("bw-cursor--visible")) {
      // executes this operation step as part of the flow
      currentX = targetX;
      // executes this operation step as part of the flow
      currentY = targetY;
      // iterates through a sequence of values
      for (let i = 0; i < trailPoints.length; i += 1) {
        // executes this operation step as part of the flow
        trailPoints[i].x = targetX;
        // executes this operation step as part of the flow
        trailPoints[i].y = targetY;
      }
      // executes this operation step as part of the flow
      cursorRoot.classList.add("bw-cursor--visible");
    }

    // executes this operation step as part of the flow
    setInteractiveState(event.target);
  };

  // pointer down: apply pressed styling when the pointer is active
  const handlePointerDown = (event) => {
    // checks a condition before executing this branch
    if (!cursorRoot || !pointerActive) return;
    // executes this operation step as part of the flow
    setInteractiveState(event.target);
    // executes this operation step as part of the flow
    cursorRoot.classList.add("bw-cursor--pressed");
  };

  // remove pressed styling
  const clearPressed = () => {
    // checks a condition before executing this branch
    if (!cursorRoot) return;
    // executes this operation step as part of the flow
    cursorRoot.classList.remove("bw-cursor--pressed");
  };

  // when pointer leaves the window entirely, hide the custom cursor state
  const handlePointerLeaveWindow = (event) => {
    // checks a condition before executing this branch
    if (!cursorRoot) return;
    // checks a condition before executing this branch
    if (event.relatedTarget !== null) return;
    // executes this operation step as part of the flow
    pointerActive = false;
    cursorRoot.classList.remove(
      "bw-cursor--visible",
      "bw-cursor--active",
      "bw-cursor--pressed",
    );
  };

  // when the document becomes hidden, reset pointer state to avoid stuck visuals
  const handleVisibility = () => {
    // checks a condition before executing this branch
    if (!cursorRoot) return;
    // checks a condition before executing this branch
    if (!document.hidden) return;
    // executes this operation step as part of the flow
    pointerActive = false;
    cursorRoot.classList.remove(
      "bw-cursor--visible",
      "bw-cursor--active",
      "bw-cursor--pressed",
    );
  };

  // attach pointer and visibility event listeners, using an abort controller for easy teardown
  document.addEventListener("pointermove", handlePointerMove, {
    // sets a named field inside an object or configuration block
    passive: true,
    // sets a named field inside an object or configuration block
    signal: listenersController.signal,
  });
  // attaches a dom event listener for user interaction
  document.addEventListener(
    "mouseover",
    // executes this operation step as part of the flow
    (event) => setInteractiveState(event.target),
    { passive: true, signal: listenersController.signal },
  );
  // attaches a dom event listener for user interaction
  document.addEventListener("pointerdown", handlePointerDown, {
    // sets a named field inside an object or configuration block
    passive: true,
    // sets a named field inside an object or configuration block
    signal: listenersController.signal,
  });
  // attaches a dom event listener for user interaction
  document.addEventListener("pointerup", clearPressed, {
    // sets a named field inside an object or configuration block
    passive: true,
    // sets a named field inside an object or configuration block
    signal: listenersController.signal,
  });
  // attaches a dom event listener for user interaction
  window.addEventListener("mouseout", handlePointerLeaveWindow, {
    // sets a named field inside an object or configuration block
    signal: listenersController.signal,
  });
  // attaches a dom event listener for user interaction
  document.addEventListener("visibilitychange", handleVisibility, {
    // sets a named field inside an object or configuration block
    signal: listenersController.signal,
  });

  // start the animation loop
  animate();

  // ensure animation frame is cancelled on unload
  window.addEventListener(
    "beforeunload",
    // defines an arrow function used by surrounding logic
    () => {
      // checks a condition before executing this branch
      if (frameId) cancelAnimationFrame(frameId);
    },
    { signal: listenersController.signal },
  );

  // teardown the custom cursor when the environment no longer supports it (e.g., resize)
  window.addEventListener(
    "resize",
    // defines an arrow function used by surrounding logic
    () => {
      // checks a condition before executing this branch
      if (!supportsFancyCursor()) {
        // executes this operation step as part of the flow
        teardownCustomCursor();
      }
    },
    { passive: true, signal: listenersController.signal },
  );
}