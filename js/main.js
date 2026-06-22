/* Global JS & Shared Logic */

// Helper to fetch latest user data from backend
const fetchAndUpdateUser = async () => {
  const token = getToken();
  if (!token) {
    removeUser();
    return null;
  }
  
  try {
    const user = await authApi.getMe();
    setUser(user);
    return user;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return getUser(); // Fallback to localStorage
  }
};

// Helper to update navbar based on auth status
const updateNavbar = async () => {
  const navActions = document.getElementById('nav-actions');
  
  const user = await fetchAndUpdateUser();

  if (navActions) {
    if (user) {
      navActions.innerHTML = `
        <a href="${window.location.pathname.includes('/pages/') ? 'profile.html' : 'pages/profile.html'}" class="btn-outline btn-sm">${user.name}</a>
        <button class="btn-sm" id="navbar-logout-btn" style="color: #ef4444; background: rgba(239,68,68,0.1);">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      `;

      const logoutBtn = document.getElementById('navbar-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          removeToken();
          removeUser();
          window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
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
  }

  // Also update all user avatar images on the page
  const avatarImgs = document.querySelectorAll('#user-avatar-img, .user-avatar img');
  if (avatarImgs.length > 0 && user && user.name) {
    const formattedName = user.name.trim().replace(/\s+/g, '+');
    const avatarUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
    avatarImgs.forEach(img => {
      img.src = avatarUrl;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
    // Shared Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbarScroll = () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                // Only remove scrolled if it's not a page that requires it (like course detail)
                if (!navbar.classList.contains('force-scrolled')) {
                    navbar.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', updateNavbarScroll);
        updateNavbarScroll(); // Initial check
    }

    // GSAP Global Animations
    if (typeof gsap !== 'undefined') {
        // Fade in elements with .gsap-fade class
        gsap.from('.gsap-fade', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });

        // Hover animation for buttons
        const btns = document.querySelectorAll('.btn-primary');
        btns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.05, duration: 0.3 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, duration: 0.3 });
            });
        });
    }

    // Global Mobile Menu Toggle
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const lessonSidebar = document.querySelector('.lesson-sidebar');

    mobileMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (navLinks) navLinks.classList.toggle('active');
            if (dashboardSidebar) dashboardSidebar.classList.toggle('active');
            if (lessonSidebar) lessonSidebar.classList.toggle('active');

            const icon = btn.querySelector('i');
            const isActive = (navLinks?.classList.contains('active')) || 
                           (dashboardSidebar?.classList.contains('active')) || 
                           (lessonSidebar?.classList.contains('active'));

            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (form.classList.contains('newsletter-form')) {
                e.preventDefault();
                const input = form.querySelector('input');
                if (input.value) {
                    alert('Thank you for subscribing!');
                    input.value = '';
                }
            }
        });
    });

    // Update navbar on load
    updateNavbar();
});
