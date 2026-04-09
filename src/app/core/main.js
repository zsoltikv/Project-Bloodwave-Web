// main core module: coordinates app startup and route-level behavior.
// keeps shared app flow logic centralized for the frontend runtime.

// import ui components and small utilities used to bootstrap the app
// keep imports grouped by purpose: router, page components, visual effects
import Router from "./router.js";
// imports dependencies used by this module
import Login from "../pages/Login.js";
// imports dependencies used by this module
import Register from "../pages/Register.js";
// imports dependencies used by this module
import ForgotPassword from "../pages/ForgotPassword.js";
// imports dependencies used by this module
import ResetPassword from "../pages/ResetPassword.js";
// imports dependencies used by this module
import Main from "../pages/Main.js";
// imports dependencies used by this module
import Stats from "../pages/Stats.js";
// imports dependencies used by this module
import Leaderboard from "../pages/Leaderboard.js";
// imports dependencies used by this module
import Achievements from "../pages/Achievements.js";
// imports dependencies used by this module
import ToS from "../pages/ToS.js";
// imports dependencies used by this module
import UserPanel from "../pages/UserPanel.js";
// imports dependencies used by this module
import AndroidDownload from "../pages/AndroidDownload.js";
// imports dependencies used by this module
import BackendStatus from "../pages/BackendStatus.js";
// imports dependencies used by this module
import ensureCustomCursor from "../effects/custom-cursor.js";

// disable various touch zoom interactions on mobile devices
// this helps keep the app layout stable when users perform pinch or double-tap gestures
function disableZoomOnMobile() {
  // helper that calls preventDefault on the received event
  const preventDefault = (event) => {
    // executes this operation step as part of the flow
    event.preventDefault();
  };

  // listen for gesture events (primarily used by mobile safari) and cancel them
  // use { passive: false } so calling preventDefault() has effect
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    // attaches a dom event listener for user interaction
    document.addEventListener(eventName, preventDefault, { passive: false });
  });

  // fallback for ios safari where pinch can be reported via touchmove.scale
  // if a scale value is present and differs from 1, block the default zoom behaviour
  document.addEventListener(
    "touchmove",
    // defines an arrow function used by surrounding logic
    (event) => {
      // checks a condition before executing this branch
      if (event.scale && event.scale !== 1) {
        // executes this operation step as part of the flow
        event.preventDefault();
      }
    },
    { passive: false },
  );

  // prevent double-tap to zoom by rejecting a touchend that quickly follows the previous one
  // this uses a small threshold (300ms) which is commonly used to detect double taps
  let lastTouchEnd = 0;
  // attaches a dom event listener for user interaction
  document.addEventListener(
    "touchend",
    // defines an arrow function used by surrounding logic
    (event) => {
      // declares a constant used in this scope
      const now = Date.now();
      // checks a condition before executing this branch
      if (now - lastTouchEnd <= 300) {
        // executes this operation step as part of the flow
        event.preventDefault();
      }
      // executes this operation step as part of the flow
      lastTouchEnd = now;
    },
    { passive: false },
  );
}

// route definitions
// maps url paths to page components used by the client-side router
const routes = [
  {
    // sets a named field inside an object or configuration block
    path: "/",
    // sets a named field inside an object or configuration block
    component: Login, // default route: render the login page
  },
  {
    // sets a named field inside an object or configuration block
    path: "/login",
    // sets a named field inside an object or configuration block
    component: Login,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/register",
    // sets a named field inside an object or configuration block
    component: Register,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/forgot-password",
    // sets a named field inside an object or configuration block
    component: ForgotPassword,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/reset-password",
    // sets a named field inside an object or configuration block
    component: ResetPassword,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/tos",
    // sets a named field inside an object or configuration block
    component: ToS,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/android-download",
    // sets a named field inside an object or configuration block
    component: AndroidDownload,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/backend-status",
    // sets a named field inside an object or configuration block
    component: BackendStatus,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/main",
    // sets a named field inside an object or configuration block
    component: Main,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/stats",
    // sets a named field inside an object or configuration block
    component: Stats,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/leaderboard",
    // sets a named field inside an object or configuration block
    component: Leaderboard,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/achievements",
    // sets a named field inside an object or configuration block
    component: Achievements,
  },
  {
    // sets a named field inside an object or configuration block
    path: "/user-panel",
    // sets a named field inside an object or configuration block
    component: UserPanel,
  },
];

// initialize the router instance with the above route map
// the router is responsible for switching views based on the browser path
const router = new Router(routes);

// if the environment supports touch, disable pinch and double-tap zooming
// doing this only for touch-capable devices avoids interfering on desktop
if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
  // executes this operation step as part of the flow
  disableZoomOnMobile();
}

// enable custom cursor effects if the optional module provides them
ensureCustomCursor();

// expose the router on window for quick access from the console or other modules
window.router = router;