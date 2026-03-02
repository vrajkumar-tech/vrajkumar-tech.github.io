// ============================================================
// Portfolio — Rajkumar Venkataraman
// Director of Product Engineering | rkoots.github.io
// ============================================================

'use strict';

// ── DOM References ───────────────────────────────────────────
const navbar       = document.getElementById('navbar');
const navToggle    = document.getElementById('nav-toggle');
const navMenu      = document.getElementById('nav-menu');
const themeToggle  = document.getElementById('theme-toggle');
const scrollTopBtn = document.getElementById('scroll-top');
const progressFill = document.getElementById('progress-fill');
const navLinks     = document.querySelectorAll('.nav__link');
const contactForm  = document.getElementById('contact-form');

// ── Utilities ────────────────────────────────────────────────
function debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function throttle(fn, limit) {
    let active = false;
    return (...args) => {
        if (!active) {
            fn(...args);
            active = true;
            setTimeout(() => { active = false; }, limit);
        }
    };
}

// Easing function for counter animation
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ── Theme ────────────────────────────────────────────────────
function initTheme() {
    const saved   = localStorage.getItem('theme');
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

// ── Reading Progress Bar ─────────────────────────────────────
function updateProgressBar() {
    if (!progressFill) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? scrollTop / docHeight : 0;
    progressFill.style.transform = `scaleX(${Math.min(progress, 1)})`;
}

// ── Navigation ───────────────────────────────────────────────
function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
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
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--h-nav'), 10) || 68;
    const offset = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

function onNavLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    smoothScrollTo(href);
    closeMobileMenu();
}

// ── Active Section Tracking ──────────────────────────────────
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.pageYOffset;

    sections.forEach(section => {
        const top    = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        const link   = document.querySelector(`.nav__link[href="#${section.id}"]`);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
}

// ── Scroll to Top ────────────────────────────────────────────
function toggleScrollTopBtn() {
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

// ── Counter Animation ────────────────────────────────────────
function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1200;
    const start    = performance.now();

    function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutExpo(progress);
        const current  = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(el => io.observe(el));
}

// ── Scroll Reveal (IntersectionObserver) ─────────────────────
function initReveal() {
    const targets = document.querySelectorAll([
        '.stat-card',
        '.highlight-card',
        '.timeline__item',
        '.timeline__company-logo',
        '.capability-card',
        '.cert-card',
        '.blog-card',
        '.section__header',
        '.about__narrative',
        '.education'
    ].join(', '));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    targets.forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        io.observe(el);
    });
}

// ── Stagger Reveal for Grid Containers ───────────────────────
function initStaggeredReveal() {
    const grids = document.querySelectorAll([
        '.hero__stats',
        '.capability-grid',
        '.cert-grid',
        '.blog-grid',
        '.about__highlights'
    ].join(', '));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Array.from(entry.target.children).forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('reveal', 'visible');
                    }, i * 90);
                });
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    grids.forEach(grid => {
        Array.from(grid.children).forEach(child => {
            if (!child.classList.contains('reveal')) child.classList.add('reveal');
        });
        io.observe(grid);
    });
}

// ── Contact Form ─────────────────────────────────────────────
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = contactForm.elements['name'].value.trim();
        const email   = contactForm.elements['email'].value.trim();
        const subject = contactForm.elements['subject'].value;
        const message = contactForm.elements['message'].value.trim();

        if (!name || !email || !message) {
            showFormFeedback('Please fill in all required fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormFeedback('Please enter a valid email address.', 'error');
            return;
        }

        const subjectLine = subject
            ? `${subject} — ${name}`
            : `Portfolio Inquiry — ${name}`;

        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:rajkumarv88@outlook.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

        showFormFeedback('Opening your email client…', 'success');
        contactForm.reset();
    });
}

function showFormFeedback(message, type) {
    const existing = contactForm.querySelector('.form-feedback');
    if (existing) existing.remove();

    const el       = document.createElement('p');
    el.className   = 'form-feedback';
    el.textContent = message;
    el.style.cssText = [
        'margin-top:0.75rem',
        'font-size:0.875rem',
        'font-weight:500',
        `color:${type === 'success' ? 'var(--clr-emerald)' : '#EF4444'}`
    ].join(';');

    contactForm.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}

// ── Footer Year ──────────────────────────────────────────────
function setFooterYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
}

// ── Hero Entrance Sequence ───────────────────────────────────
function initHeroEntrance() {
    const targets = [
        '.hero__eyebrow',
        '.hero__title',
        '.hero__summary',
        '.hero__actions',
        '.hero__socials',
        '.hero__visual'
    ];

    targets.forEach((selector, i) => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.style.opacity  = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms,
                                transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`;

        requestAnimationFrame(() => {
            setTimeout(() => {
                el.style.opacity   = '1';
                el.style.transform = 'translateY(0)';
            }, 120 + i * 90);
        });
    });
}

// ── Event Listeners ──────────────────────────────────────────
function initEvents() {
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (navToggle)   navToggle.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => link.addEventListener('click', onNavLinkClick));

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }

    const onScroll = throttle(() => {
        handleNavbarScroll();
        toggleScrollTopBtn();
        updateActiveLink();
        updateProgressBar();
    }, 16);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', debounce(closeMobileMenu, 250));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', e => {
        if (navMenu?.classList.contains('active') && !navbar.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// ── Init ─────────────────────────────────────────────────────
function init() {
    initTheme();
    initEvents();
    initHeroEntrance();
    initReveal();
    initStaggeredReveal();
    initCounters();
    initContactForm();
    setFooterYear();
    updateProgressBar();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ── Public API ───────────────────────────────────────────────
window.Portfolio = { toggleTheme, toggleMobileMenu, smoothScrollTo };
