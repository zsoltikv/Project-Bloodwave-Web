import Router from './router.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

// Define routes
const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/',
    component: Login // Default to login
  }
];

// Initialize router
const router = new Router(routes);

// Make router globally accessible
window.router = router;
