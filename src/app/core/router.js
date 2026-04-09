// router core module: coordinates app startup and route-level behavior.
// keeps shared app flow logic centralized for the frontend runtime.

// import authentication check and visual effect helpers used by the router
import { isLoggedIn } from "../services/auth.js";
// imports dependencies used by this module
import {
  ensureGlobalStarfield,
  setGlobalStarfieldEnabled,
// executes this operation step as part of the flow
} from "../effects/global-starfield.js";

// paths that require an authenticated session; unauthenticated users are redirected to login
const PROTECTED_PATHS = [
  "/main",
  "/stats",
  "/leaderboard",
  "/achievements",
  "/user-panel",
  "/backend-status",
];
// paths that should only be visible to guests (not authenticated users)
// when a logged-in user attempts to access these, they are redirected to the main dashboard
const GUEST_ONLY_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/",
];
// paths where the global footer should be rendered inside the app container
// footer is omitted on auth screens and other compact pages
const FOOTER_VISIBLE_PATHS = [
  "/main",
  "/stats",
  "/leaderboard",
  "/achievements",
  "/user-panel",
];
// paths where the background starfield visual effect should be enabled
// this list controls the global starfield toggle for each route
const STARFIELD_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/tos",
  "/android-download",
  "/backend-status",
  "/main",
  "/stats",
  "/leaderboard",
  "/achievements",
  "/user-panel",
];

// declares a constant used in this scope
const GITHUB_PROJECT_URL = "https://github.com/zsoltikv/Project-Bloodwave-Web";

// helper that forces the document to be scrolled to the top-left corner
// used after route changes to ensure the new view is visible from the top
function forceScrollTop() {
  // executes this operation step as part of the flow
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  // executes this operation step as part of the flow
  document.documentElement.scrollTop = 0;
  // executes this operation step as part of the flow
  document.body.scrollTop = 0;
}

// creates and returns a document footer element for the app
// `loggedIn` controls whether the footer shows a dashboard or login primary action
function createGlobalFooter(loggedIn) {
  // declares a constant used in this scope
  const footer = document.createElement("footer");
  // executes this operation step as part of the flow
  footer.className = "bw-site-footer";

  // declares a constant used in this scope
  const currentYear = new Date().getFullYear();
  // declares a constant used in this scope
  const primaryAction = loggedIn
    // executes this operation step as part of the flow
    ? '<a href="/main" data-link class="bw-footer-link">Dashboard</a>'
    // executes this operation step as part of the flow
    : '<a href="/login" data-link class="bw-footer-link">Login</a>';

  // executes this operation step as part of the flow
  footer.innerHTML = `
    <div class="bw-footer-crest" aria-hidden="true">
      <span class="bw-footer-crest-line"></span>
      <span class="bw-footer-crest-mark">✦</span>
      <span class="bw-footer-crest-line"></span>
    </div>

    <div class="bw-footer-inner">
      <section class="bw-footer-brand" aria-label="Brand">
        <span class="bw-footer-title">Project Bloodwave</span>
        <p class="bw-footer-copy">Forged for players who track every run.</p>
      </section>

      <nav class="bw-footer-nav" aria-label="Footer links">
        <a href="${GITHUB_PROJECT_URL}" target="_blank" rel="noopener noreferrer" class="bw-footer-link">GitHub Project</a>
        <a href="/tos" data-link class="bw-footer-link">ToS & Cookie Policy</a>
        ${primaryAction}
      </nav>
    </div>

    <div class="bw-footer-bottom">
      <div class="bw-footer-meta">© ${currentYear} Bloodwave. All rights reserved.</div>
    </div>
  `;

  // returns a value from the current function
  return footer;
}

// declares a class that groups related behavior
class Router {
  constructor(routes) {
    // executes this operation step as part of the flow
    this.routes = routes;
    // executes this operation step as part of the flow
    this.currentRoute = null;
    // executes this operation step as part of the flow
    ensureGlobalStarfield();

    // checks a condition before executing this branch
    if ("scrollRestoration" in window.history) {
      // disable automatic scroll restoration so the router controls scroll behavior
      window.history.scrollRestoration = "manual";
    }

    // handle initial page load: normalize route rendering once DOM is ready
    window.addEventListener("DOMContentLoaded", (e) => {
      // executes this operation step as part of the flow
      e.preventDefault();
      // executes this operation step as part of the flow
      this.handleRoute();
    });

    // handle browser history navigation (back/forward) by re-rendering the current route
    window.addEventListener("popstate", (e) => {
      // executes this operation step as part of the flow
      this.handleRoute();
    });

    // intercept clicks on links marked with `data-link` to perform client-side navigation
    // this prevents full page reloads and lets the router manage history and view updates
    document.addEventListener("click", (e) => {
      // declares a constant used in this scope
      const link = e.target.closest("[data-link]");
      // checks a condition before executing this branch
      if (!link) return;

      // executes this operation step as part of the flow
      e.preventDefault();
      // declares a constant used in this scope
      const href = link.getAttribute("href");
      // checks a condition before executing this branch
      if (!href) return;

      // executes this operation step as part of the flow
      this.navigate(href);
    });
  }

  navigate(path) {
    // push a new history entry and render the corresponding route
    window.history.pushState(null, null, path);
    // executes this operation step as part of the flow
    this.handleRoute();
  }

  handleRoute() {
    // declares a constant used in this scope
    const path = window.location.pathname;
    // declares a constant used in this scope
    const loggedIn = isLoggedIn();

    // route guards:
    // - if a protected path is requested without an authenticated session, redirect to login
    if (PROTECTED_PATHS.includes(path) && !loggedIn) {
      // executes this operation step as part of the flow
      window.history.replaceState(null, null, "/login");
      // returns a value from the current function
      return this.handleRoute();
    }

    // - if a guest-only page is requested by an authenticated user, redirect to main dashboard
    if (GUEST_ONLY_PATHS.includes(path) && loggedIn) {
      // executes this operation step as part of the flow
      window.history.replaceState(null, null, "/main");
      // returns a value from the current function
      return this.handleRoute();
    }

    // find the matching route object for the current path; fall back to login if unknown
    const route =
      // executes this operation step as part of the flow
      this.routes.find((r) => r.path === path) ||
      // executes this operation step as part of the flow
      this.routes.find((r) => r.path === "/login");

    // enable or disable the global starfield effect based on the configured list
    setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(path));

    // checks a condition before executing this branch
    if (route) {
      // update internal state and reflect the active route on the app container
      this.currentRoute = route;
      // declares a constant used in this scope
      const app = document.getElementById("app");
      // executes this operation step as part of the flow
      app.setAttribute("data-route", route.path);

      // decide whether the global footer should be displayed for this route
      const showFooter = FOOTER_VISIBLE_PATHS.includes(route.path);
      // executes this operation step as part of the flow
      app.setAttribute("data-has-footer", String(showFooter));

      // clear previous view content and mount a fresh route view element
      app.innerHTML = "";
      // declares a constant used in this scope
      const routeView = document.createElement("div");
      // executes this operation step as part of the flow
      routeView.className = "bw-route-view";
      // executes this operation step as part of the flow
      app.appendChild(routeView);

      // invoke the route's component factory to render into the route view
      route.component(routeView);

      // append the global footer when appropriate
      if (showFooter) {
        // executes this operation step as part of the flow
        app.appendChild(createGlobalFooter(loggedIn));
      }

      // ensure the viewport is scrolled to top after rendering the new route
      forceScrollTop();
      // executes this operation step as part of the flow
      requestAnimationFrame(() => forceScrollTop());
    }
  }
}

// executes this operation step as part of the flow
export default Router;