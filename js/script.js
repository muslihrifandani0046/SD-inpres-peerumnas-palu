/* ==================================================
   SMA NUSANTARA - JAVASCRIPT (VANILLA)
   Hanya 4 fungsi:
   1. Hamburger menu mobile
   2. Navbar berubah saat scroll
   3. Smooth scrolling
   4. Animasi muncul ketika section terlihat
================================================== */

(function () {
    'use strict';

    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    var DESKTOP_BREAKPOINT = 992;
    var SCROLL_THRESHOLD = 40;
    var NAV_OFFSET = 12;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================
       1. HAMBURGER MENU MOBILE
    ========================================== */
    function initNav() {
        if (!nav || !navToggle) {
            return;
        }

        function closeMenu() {
            nav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Buka menu navigasi');
        }

        navToggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        });

        /* tutup menu setelah link di dalam menu diklik */
        if (navMenu) {
            navMenu.addEventListener('click', function (event) {
                if (event.target.closest('.nav__link, .nav__cta')) {
                    closeMenu();
                }
            });
        }

        /* tutup menu dengan tombol Escape */
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' || event.key === 'Esc') {
                closeMenu();
            }
        });

        /* tutup menu saat kembali ke tampilan desktop */
        window.addEventListener('resize', function () {
            if (window.innerWidth > DESKTOP_BREAKPOINT) {
                closeMenu();
            }
        });
    }

    /* ==========================================
       2. NAVBAR BERUBAH KETIKA SCROLL
    ========================================== */
    function initScrollNav() {
        if (!nav) {
            return;
        }

        var isWaiting = false;

        function updateNav() {
            nav.classList.toggle('is-scrolled', window.pageYOffset > SCROLL_THRESHOLD);
            isWaiting = false;
        }

        window.addEventListener('scroll', function () {
            if (!isWaiting) {
                window.requestAnimationFrame(updateNav);
                isWaiting = true;
            }
        }, { passive: true });

        updateNav();
    }

    /* ==========================================
       3. SMOOTH SCROLLING
    ========================================== */
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function (event) {
                var hash = link.getAttribute('href');

                if (!hash || hash === '#') {
                    return;
                }

                var target = document.querySelector(hash);

                if (!target) {
                    return;
                }

                event.preventDefault();

                var navHeight = nav ? nav.offsetHeight : 0;
                var targetTop = target.getBoundingClientRect().top
                                + window.pageYOffset
                                - navHeight
                                - NAV_OFFSET;

                window.scrollTo({
                    top: targetTop,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });

                /* tutup menu mobile dan kembalikan fokus ke tombol */
                if (nav) {
                    nav.classList.remove('is-open');
                }

                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.setAttribute('aria-label', 'Buka menu navigasi');
                }

                if (navMenu) {
                    navMenu.setAttribute('aria-hidden', 'false');
                }
            });
        });
    }

    /* ==========================================
       4. ANIMASI MUNCUL SAAT SECTION TERLIHAT
    ========================================== */
    function initReveal() {
        var items = document.querySelectorAll('.reveal');

        if (items.length === 0) {
            return;
        }

        var i;

        /* tanpa dukungan IntersectionObserver: tampilkan langsung */
        if (reduceMotion || !('IntersectionObserver' in window)) {
            for (i = 0; i < items.length; i++) {
                items[i].classList.add('is-visible');
            }
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        for (i = 0; i < items.length; i++) {
            observer.observe(items[i]);
        }
    }

    /* ==========================================
       START
    ========================================== */
    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initScrollNav();
        initSmoothScroll();
        initReveal();
    });
}());
