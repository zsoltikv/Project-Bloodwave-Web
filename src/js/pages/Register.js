export default function Register(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      <!-- Animated Starfield Background -->
      <div id="starfield" class="absolute inset-0"></div>
      
      <!-- Ambient Light Effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/3 w-96 h-96 bg-red-700/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-1/4 right-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
      </div>
      
      <!-- Register card -->
      <div class="relative z-10 w-full max-w-md animate-fade-in-up">
        <div class="bg-zinc-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden hover:border-red-500/40 transition-all duration-500 hover:shadow-red-500/20 hover:shadow-2xl">
          
          <!-- Header -->
          <div class="bg-gradient-to-br from-black via-red-950/80 to-black p-10 text-center border-b border-red-500/30 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-shimmer"></div>
            <div class="relative">
              <h1 class="text-5xl font-bold text-white tracking-wider mb-3 animate-glow">
                JOIN US
              </h1>
              <div class="h-0.5 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-3 animate-pulse"></div>
              <p class="text-red-200/70 text-sm tracking-wide uppercase">Create Your Bloodwave Account</p>
            </div>
          </div>
          
          <!-- Form -->
          <form id="registerForm" class="p-10 space-y-6">
            
            <!-- Username field -->
            <div class="group">
              <label class="block text-red-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                Username
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  id="username"
                  required
                  minlength="3"
                  class="w-full px-5 py-4 bg-black/70 border border-red-900/40 rounded-xl text-white placeholder-gray-600 
                         focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                         transition-all duration-300 hover:border-red-800/60"
                  placeholder="VampireHunter"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none animate-input-glow"></div>
              </div>
            </div>
            
            <!-- Email field -->
            <div class="group">
              <label class="block text-red-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <div class="relative">
                <input 
                  type="email" 
                  id="email"
                  required
                  class="w-full px-5 py-4 bg-black/70 border border-red-900/40 rounded-xl text-white placeholder-gray-600 
                         focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                         transition-all duration-300 hover:border-red-800/60"
                  placeholder="your@email.com"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none animate-input-glow"></div>
              </div>
            </div>
            
            <!-- Password field -->
            <div class="group">
              <label class="block text-red-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                Password
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  id="password"
                  required
                  minlength="8"
                  class="w-full px-5 py-4 bg-black/70 border border-red-900/40 rounded-xl text-white placeholder-gray-600 
                         focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                         transition-all duration-300 hover:border-red-800/60"
                  placeholder="Min. 8 characters"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none animate-input-glow"></div>
              </div>
            </div>
            
            <!-- Confirm Password field -->
            <div class="group">
              <label class="block text-red-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                Confirm Password
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  id="confirmPassword"
                  required
                  minlength="8"
                  class="w-full px-5 py-4 bg-black/70 border border-red-900/40 rounded-xl text-white placeholder-gray-600 
                         focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                         transition-all duration-300 hover:border-red-800/60"
                  placeholder="Confirm password"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none animate-input-glow"></div>
              </div>
            </div>
            
            <!-- Terms checkbox -->
            <div class="flex items-start pt-2">
              <label class="flex items-start text-gray-500 cursor-pointer hover:text-gray-300 transition-colors text-xs">
                <input type="checkbox" required class="w-4 h-4 mt-1 rounded border-red-900/50 bg-black/70 text-red-600 focus:ring-red-600/40 transition-all">
                <span class="ml-2 tracking-wide">
                  I accept the <span class="text-red-400 hover:text-red-300 uppercase">Terms of Service</span> and <span class="text-red-400 hover:text-red-300 uppercase">Privacy Policy</span>
                </span>
              </label>
            </div>
            
            <!-- Submit button -->
            <button 
              type="submit"
              class="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white font-bold py-4 px-6 rounded-xl 
                     transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-700/50 
                     active:scale-95 relative overflow-hidden group uppercase tracking-widest text-sm mt-8"
            >
              <span class="relative z-10">Create Account</span>
              <div class="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <!-- Login link -->
            <div class="text-center pt-4">
              <p class="text-gray-500 text-xs tracking-wide">
                Already have an account? 
                <a href="/login" data-link class="text-red-400 hover:text-red-300 font-semibold transition-all ml-1 uppercase hover:tracking-wider">
                  Sign In
                </a>
              </p>
            </div>
            
          </form>
        </div>
        
        <!-- Decorative Corner Elements -->
        <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-red-500/40 animate-pulse"></div>
        <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-red-500/40 animate-pulse" style="animation-delay: 0.5s;"></div>
        <div class="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-red-500/40 animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-red-500/40 animate-pulse" style="animation-delay: 1.5s;"></div>
      </div>
    </div>
  `;
  
  // Create animated starfield after DOM is ready
  setTimeout(() => createStarfield(), 0);
  
  // Handle form submission
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Add success animation
    const button = form.querySelector('button[type="submit"]');
    button.innerHTML = '<span class="relative z-10">✓ Registration Successful!</span>';
    button.classList.add('animate-pulse');
    
    setTimeout(() => {
      console.log('Register:', { username, email, password });
      alert('Registration successful! Redirecting to login...');
      
      // Navigate to login
      setTimeout(() => {
        window.dispatchEvent(new Event('popstate'));
        window.history.pushState(null, null, '/login');
        window.dispatchEvent(new Event('popstate'));
      }, 1000);
    }, 500);
  });
}

function createStarfield() {
  const starfield = document.getElementById('starfield');
  if (!starfield) {
    console.warn('Starfield element not found');
    return;
  }
  
  const starCount = 200;
  
  // Create regular twinkling stars
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    
    // Random star sizes and opacity
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = Math.random() * 0.7 + 0.3;
    
    starfield.appendChild(star);
  }
  
  // Create shooting stars periodically
  const shootingInterval = setInterval(() => {
    if (!document.getElementById('starfield')) {
      clearInterval(shootingInterval);
      return;
    }
    createShootingStar();
  }, 3000);
}

function createShootingStar() {
  const starfield = document.getElementById('starfield');
  if (!starfield) return;
  
  const shootingStar = document.createElement('div');
  shootingStar.style.position = 'absolute';
  shootingStar.style.top = `${Math.random() * 50}%`;
  shootingStar.style.left = `${50 + Math.random() * 50}%`;
  shootingStar.style.width = '2px';
  shootingStar.style.height = '2px';
  shootingStar.style.background = 'linear-gradient(45deg, transparent, #ffffff, #ff0000)';
  shootingStar.style.borderRadius = '50%';
  shootingStar.style.boxShadow = '0 0 10px 2px rgba(255, 255, 255, 0.5)';
  shootingStar.style.animation = 'shoot 1.5s linear forwards';
  shootingStar.style.pointerEvents = 'none';
  
  starfield.appendChild(shootingStar);
  
  setTimeout(() => {
    shootingStar.remove();
  }, 1500);
}


