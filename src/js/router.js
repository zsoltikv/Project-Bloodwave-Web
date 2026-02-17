class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    
    // Handle initial load
    window.addEventListener('DOMContentLoaded', () => {
      this.handleRoute();
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }
  
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }
  
  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/login');
    
    if (route) {
      this.currentRoute = route;
      const app = document.getElementById('app');
      app.innerHTML = '';
      route.component(app);
    }
  }
}

export default Router;
