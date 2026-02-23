export default function ForgotPassword(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      <!-- Animated Starfield Background -->
      <div id="starfield" class="absolute inset-0"></div>
      
      <!-- Ambient Light Effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-1/4 w-96 h-96 bg-red-700/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <!-- Card -->
      <div class="relative z-10 w-full max-w-md animate-fade-in-up">
        <div class="bg-zinc-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden hover:border-red-500/40 transition-all duration-500 hover:shadow-red-500/20 hover:shadow-2xl">
          
          <!-- Header -->
          <div class="bg-gradient-to-br from-red-950/80 via-black to-red-950/80 p-10 text-center border-b border-red-500/30 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-shimmer"></div>
            <div class="relative">
              <h1 class="text-5xl font-bold text-white tracking-wider mb-3 animate-glow">
                BLOODWAVE
              </h1>
              <div class="h-0.5 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-3 animate-pulse"></div>
              <p class="text-red-200/70 text-sm tracking-wide uppercase">Password Recovery</p>
            </div>
          </div>
          
          <!-- Form -->
          <div class="p-10">

            <!-- Success state (hidden by default) -->
            <div id="successState" class="hidden text-center space-y-6">
              <div class="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-3xl">
                ✉️
              </div>
              <div>
                <h2 class="text-white font-bold text-lg tracking-wide uppercase mb-2">Check Your Inbox</h2>
                <p class="text-gray-500 text-sm leading-relaxed">
                  If an account exists for <span id="sentEmail" class="text-red-400 font-semibold"></span>, 
                  you will receive a password reset link shortly.
                </p>
              </div>
              <a href="/login" data-link
                class="block w-full text-center bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl 
                       transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/50 
                       active:scale-95 uppercase tracking-widest text-sm">
                Back to Sign In
              </a>
            </div>

            <!-- Form state -->
            <form id="forgotForm" class="space-y-7">
              
              <p class="text-gray-500 text-sm tracking-wide leading-relaxed text-center">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>

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

              <!-- Error message -->
              <div id="errorMsg" class="hidden text-red-400 text-xs text-center tracking-wide uppercase animate-pulse"></div>

              <!-- Submit button -->
              <button 
                type="submit"
                id="submitBtn"
                class="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl 
                       transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/50 
                       active:scale-95 relative overflow-hidden group uppercase tracking-widest text-sm mt-2"
              >
                <span class="relative z-10">Send Reset Link</span>
                <div class="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <!-- Back to login -->
              <div class="text-center pt-2">
                <p class="text-gray-500 text-xs tracking-wide">
                  Remembered your password?
                  <a href="/login" data-link class="text-red-400 hover:text-red-300 font-semibold transition-all ml-1 uppercase hover:tracking-wider">
                    Sign In
                  </a>
                </p>
              </div>

            </form>
          </div>
        </div>

        <!-- Decorative Corner Elements -->
        <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-red-500/40 animate-pulse"></div>
        <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-red-500/40 animate-pulse" style="animation-delay: 0.5s;"></div>
        <div class="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-red-500/40 animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-red-500/40 animate-pulse" style="animation-delay: 1.5s;"></div>
      </div>
    </div>
  `;

  // Starfield
  setTimeout(() => createStarfield(), 0);

  // Form logic
  const form = document.getElementById('forgotForm');
  const submitBtn = document.getElementById('submitBtn');
  const errorMsg = document.getElementById('errorMsg');
  const successState = document.getElementById('successState');
  const sentEmail = document.getElementById('sentEmail');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="relative z-10 flex items-center justify-center gap-2">
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Sending...
      </span>`;

    try {
      // TODO: replace with actual API call
      // await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      await new Promise(resolve => setTimeout(resolve, 1200)); // simulate network

      // Show success state
      sentEmail.textContent = email;
      form.classList.add('hidden');
      successState.classList.remove('hidden');
    } catch (err) {
      errorMsg.textContent = 'Something went wrong. Please try again.';
      errorMsg.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="relative z-10">Send Reset Link</span>
        <div class="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>`;
    }
  });
}

function createStarfield() {
  const starfield = document.getElementById('starfield');
  if (!starfield) return;

  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = Math.random() * 0.7 + 0.3;
    starfield.appendChild(star);
  }

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
