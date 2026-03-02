// ============================================================
// Portfolio – Rajkumar Venkataraman
// ============================================================

// ── DOM references ──────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const navToggle   = document.getElementById('nav-toggle');
const navMenu     = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const scrollTopBtn = document.getElementById('scroll-top');
const navLinks    = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');

// ── Utilities ────────────────────────────────────────────────
function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

function throttle(fn, limit) {
    let active = false;
    return function (...args) {
        if (!active) {
            fn.apply(this, args);
            active = true;
            setTimeout(() => { active = false; }, limit);
        }
    };
}

// ── Theme ────────────────────────────────────────────────────
function initTheme() {
    const saved  = localStorage.getItem('theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || prefers);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── Navigation ───────────────────────────────────────────────
function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}

function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const offset = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) - 8;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

function onNavLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    smoothScrollTo(href);
    closeMobileMenu();
}

// ── Active nav link ──────────────────────────────────────────
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.pageYOffset;

    sections.forEach(section => {
        const top    = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const link   = document.querySelector(`.nav__link[href="#${section.id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        }
    });
}

// ── Scroll to top ────────────────────────────────────────────
function toggleScrollTopBtn() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

// ── Scroll-reveal (IntersectionObserver) ─────────────────────
function initReveal() {
    const targets = document.querySelectorAll(
        '.stat-card, .highlight-card, .timeline__item, .capability-card, .cert-card, .blog-card, .section__header, .about__narrative, .education'
    );

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
        io.observe(el);
    });
}

// ── Staggered reveal for grids ───────────────────────────────
function initStaggeredReveal() {
    const grids = document.querySelectorAll('.hero__stats, .capability-grid, .cert-grid, .blog-grid, .about__highlights');

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('reveal', 'visible');
                    }, i * 80);
                });
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    grids.forEach(grid => {
        Array.from(grid.children).forEach(child => child.classList.add('reveal'));
        io.observe(grid);
    });
}

// ── Contact Form ─────────────────────────────────────────────
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            name:    contactForm.elements['name'].value.trim(),
            email:   contactForm.elements['email'].value.trim(),
            subject: contactForm.elements['subject'].value,
            message: contactForm.elements['message'].value.trim()
        };

        if (!data.name || !data.email || !data.message) {
            showFormFeedback('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showFormFeedback('Please enter a valid email address.', 'error');
            return;
        }

        const mailto = `mailto:rajkumarv88@outlook.com?subject=${encodeURIComponent(data.subject || 'Portfolio Inquiry')} — ${encodeURIComponent(data.name)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;
        window.location.href = mailto;

        showFormFeedback('Opening your email client…', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(message, type) {
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const el = document.createElement('p');
    el.className = 'form-feedback';
    el.textContent = message;
    el.style.cssText = `
        margin-top: 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: ${type === 'success' ? 'var(--color-emerald)' : '#EF4444'};
    `;
    contactForm.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}

// ── Footer year ──────────────────────────────────────────────
function setFooterYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
}

// ── Event listeners ──────────────────────────────────────────
function initEvents() {
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (navToggle)   navToggle.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => link.addEventListener('click', onNavLinkClick));

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const onScroll = throttle(() => {
        handleNavbarScroll();
        toggleScrollTopBtn();
        updateActiveLink();
    }, 16);
    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', debounce(closeMobileMenu, 250));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', e => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navbar.contains(e.target)) closeMobileMenu();
        }
    });
}

// ── Init ─────────────────────────────────────────────────────
function init() {
    initTheme();
    initEvents();
    initReveal();
    initStaggeredReveal();
    initContactForm();
    setFooterYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ── Public API ───────────────────────────────────────────────
window.Portfolio = { toggleTheme, toggleMobileMenu };
