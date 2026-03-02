// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const scrollTop = document.getElementById('scroll-top');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===== Navigation =====
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

function handleNavScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        closeMobileMenu();
    }
}

// ===== Scroll to Top =====
function handleScrollTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleScrollTopButton() {
    if (window.scrollY > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
}

// ===== Intersection Observer for Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.section-header, .glass-card, .timeline-item, .project-card, .skills-category'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// ===== Parallax Effect for Hero Section =====
function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    
    if (hero && heroTitle) {
        const speed = 0.5;
        heroTitle.style.transform = `translateY(${scrolled * speed}px)`;
    }
}

// ===== Mouse Movement Effect =====
function handleMouseMove(e) {
    const glassCards = document.querySelectorAll('.glass-card');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    glassCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const angleX = (mouseY - cardY) / 30;
        const angleY = (cardX - mouseX) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
}

function resetCardTransform() {
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

// ===== Performance Optimization =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== Initialize Event Listeners =====
function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile navigation
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // Scroll to top
    if (scrollTop) {
        scrollTop.addEventListener('click', handleScrollTop);
    }

    // Scroll events
    const debouncedScroll = debounce(() => {
        handleNavScroll();
        toggleScrollTopButton();
        updateActiveNavLink();
        handleParallax();
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Mouse movement for 3D effect (only on desktop)
    if (window.innerWidth > 768) {
        const throttledMouseMove = throttle(handleMouseMove, 16);
        document.addEventListener('mousemove', throttledMouseMove);
        document.addEventListener('mouseleave', resetCardTransform);
    }

    // Resize events
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
    }, 250));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// ===== Loading Optimization =====
function optimizeLoading() {
    // Add loading class to body
    document.body.classList.add('loading');

    // Remove loading class after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 100);
    });

    // Preload critical images
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        const img = new Image();
        img.onload = () => {
            profileImg.classList.add('loaded');
        };
        img.src = profileImg.src;
    }
}

// ===== Error Handling =====
function handleError() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// ===== Analytics and Performance Monitoring =====
function trackPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Track user interactions (for analytics)
    const trackInteraction = (element, action) => {
        console.log(`User interaction: ${action} on ${element.tagName}.${element.className}`);
    };

    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .nav-link, .social-link, .project-link')) {
            trackInteraction(e.target, 'click');
        }
    });
}

// ===== Service Worker Registration (for PWA) =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
}

// ===== Initialize Everything =====
function init() {
    try {
        initTheme();
        initEventListeners();
        setupScrollAnimations();
        optimizeLoading();
        handleError();
        trackPerformance();
        
        // Optional: Register service worker for PWA
        // registerServiceWorker();
        
        console.log('Portfolio website initialized successfully');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// ===== DOM Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Export for external use =====
window.Portfolio = {
    toggleTheme,
    toggleMobileMenu,
    handleScrollTop
};