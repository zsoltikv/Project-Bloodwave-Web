import { isLoggedIn } from './auth.js';
import {
  Box,
  createDomNode,
  createRouter,
  Footer,
  Link,
  Nav,
  Paragraph,
  Section,
  Span,
} from './feather/index.js';
import { ensureGlobalStarfield, setGlobalStarfieldEnabled } from './global-starfield.js';

const PROTECTED_PATHS = ['/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const GUEST_ONLY_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
const FOOTER_VISIBLE_PATHS = ['/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const STARFIELD_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/tos', '/android-download', '/main', '/stats', '/leaderboard', '/achievements', '/user-panel'];
const GITHUB_PROJECT_URL = 'https://github.com/zsoltikv/Project-Bloodwave-Web';

function createGlobalFooter(loggedIn) {
  const currentYear = new Date().getFullYear();
  const primaryAction = loggedIn
    ? Link('Dashboard').to('/main')
    : Link('Login').to('/login');

  return createDomNode(
    Footer(
      Box(
        Span().className('bw-footer-crest-line'),
        Span('\u2726').className('bw-footer-crest-mark'),
        Span().className('bw-footer-crest-line'),
      )
        .className('bw-footer-crest')
        .ariaHidden(),
      Box(
        Section(
          Span('Project Bloodwave').className('bw-footer-title'),
          Paragraph('Forged for players who track every run.').className('bw-footer-copy'),
        )
          .className('bw-footer-brand')
          .ariaLabel('Brand'),
        Nav(
          Link('GitHub Project')
            .href(GITHUB_PROJECT_URL)
            .attr('target', '_blank')
            .attr('rel', 'noopener noreferrer')
            .className('bw-footer-link'),
          Link('ToS & Cookie Policy')
            .to('/tos')
            .className('bw-footer-link'),
          primaryAction.className('bw-footer-link'),
        )
          .className('bw-footer-nav')
          .ariaLabel('Footer links'),
      ).className('bw-footer-inner'),
      Box(
        Box(`\u00A9 ${currentYear} Bloodwave. All rights reserved.`)
          .className('bw-footer-meta'),
      ).className('bw-footer-bottom'),
    ).className('bw-site-footer'),
    null,
  );
}

function resolveAppRoute(path) {
  const loggedIn = isLoggedIn();

  if (PROTECTED_PATHS.includes(path) && !loggedIn) {
    return '/login';
  }

  if (GUEST_ONLY_PATHS.includes(path) && loggedIn) {
    return '/main';
  }

  return path;
}

export default function createAppRouter(routes) {
  ensureGlobalStarfield();

  return createRouter({
    root: '#app',
    routes,
    notFoundPath: '/login',
    beforeResolve({ path }) {
      const resolvedPath = resolveAppRoute(path);
      setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(resolvedPath));
      return resolvedPath;
    },
    afterRender({ path, route, root: appRoot }) {
      const loggedIn = isLoggedIn();
      const showFooter = FOOTER_VISIBLE_PATHS.includes(route.path);

      appRoot.setAttribute('data-route', route.path);
      appRoot.setAttribute('data-has-footer', String(showFooter));

      const routeView = appRoot.querySelector('.feather-route-view');
      if (routeView) {
        routeView.className = 'bw-route-view';
      }

      const existingFooter = appRoot.querySelector('.bw-site-footer');
      if (existingFooter) {
        existingFooter.remove();
      }

      if (showFooter) {
        appRoot.appendChild(createGlobalFooter(loggedIn));
      }

      setGlobalStarfieldEnabled(STARFIELD_PATHS.includes(path));
    },
  });
}
