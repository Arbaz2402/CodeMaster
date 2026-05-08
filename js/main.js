/* Global JS & Shared Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Shared Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                // Only remove scrolled if it's not a page that requires it (like course detail)
                if (!navbar.classList.contains('force-scrolled')) {
                    navbar.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial check
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
});
