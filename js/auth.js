// Helper to update navbar based on auth status
const updateNavbar = () => {
  const navActions = document.getElementById('nav-actions');
  const user = getUser();
  
  if (!navActions) return;
  
  if (user) {
    navActions.innerHTML = `
      <a href="pages/profile.html" class="btn-outline btn-sm">${user.name}</a>
      <button class="btn-sm" id="navbar-logout-btn" style="color: #ef4444; background: rgba(239,68,68,0.1);">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    `;
    
    const logoutBtn = document.getElementById('navbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        removeToken();
        removeUser();
        window.location.href = 'index.html';
      });
    }
  } else {
    navActions.innerHTML = `
      <button class="btn-outline btn-sm" id="login-btn">Log In</button>
      <button class="btn-primary btn-sm" id="register-btn">Sign Up</button>
    `;
    
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (loginBtn && authModal) {
      loginBtn.addEventListener('click', () => {
        authModal.classList.add('show');
        document.querySelectorAll('.auth-tabs .tab-btn')[0].click();
      });
    }
    
    if (registerBtn && authModal) {
      registerBtn.addEventListener('click', () => {
        authModal.classList.add('show');
        document.querySelectorAll('.auth-tabs .tab-btn')[1].click();
      });
    }
    
    if (closeModalBtn && authModal) {
      closeModalBtn.addEventListener('click', () => {
        authModal.classList.remove('show');
      });
    }
    
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          authModal.classList.remove('show');
        }
      });
    }
  }
};

// Call on page load
document.addEventListener('DOMContentLoaded', updateNavbar);