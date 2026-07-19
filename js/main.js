/**
 * Ambika Playwoods — Main JavaScript
 * Handles: theme toggle, navbar scroll, mobile menu,
 *          scroll reveal, counter animation, bar charts,
 *          testimonial carousel, smooth scroll.
 */

(function () {
  'use strict';

  /* ================================================================
     1. THEME MANAGER
     ================================================================ */
  const Theme = {
    KEY: 'ambika-theme',

    init() {
      const saved   = localStorage.getItem(this.KEY);
      const osDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(saved || (osDark ? 'dark' : 'light'));

      // Sync if OS preference changes and user hasn't set a preference
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.KEY)) this.apply(e.matches ? 'dark' : 'light');
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-btn').forEach((btn) => {
        const icon = btn.querySelector('i');
        if (icon) icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      });
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(this.KEY, next);
      this.apply(next);
    },
  };

  /* ================================================================
     2. NAVBAR — scroll effect
     ================================================================ */
  const Navbar = {
    init() {
      const nav = document.querySelector('.navbar');
      if (!nav) return;

      const tick = () => nav.classList.toggle('scrolled', window.scrollY > 24);
      window.addEventListener('scroll', tick, { passive: true });
      tick();

      // Highlight active page link
      const page = window.location.pathname.split('/').pop() || 'index.html';
      nav.querySelectorAll('.nav-links a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === page);
      });
    },
  };

  /* ================================================================
     3. MOBILE MENU
     ================================================================ */
  const MobileMenu = {
    open: false,

    init() {
      const btn     = document.querySelector('.menu-btn');
      const overlay = document.querySelector('.mob-nav');
      if (!btn || !overlay) return;

      // Hamburger opens the menu
      btn.addEventListener('click', () => this._open(btn, overlay));

      // Close button inside the overlay
      const closeBtn = overlay.querySelector('.mob-nav-close');
      if (closeBtn) closeBtn.addEventListener('click', () => this._close(btn, overlay));

      // Nav links inside overlay body close the menu
      overlay.querySelectorAll('.mob-nav-body a').forEach((a) =>
        a.addEventListener('click', () => this._close(btn, overlay))
      );

      // Escape key closes the menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.open) this._close(btn, overlay);
      });
    },

    _open(btn, overlay) {
      this.open = true;
      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('open'));
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    },

    _close(btn, overlay) {
      this.open = false;
      overlay.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(() => { overlay.style.display = 'none'; }, 400);
    },
  };

  /* ================================================================
     4. SCROLL REVEAL (IntersectionObserver)
     ================================================================ */
  const Reveal = {
    init() {
      const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-sc,.stg');
      if (!els.length) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('vis');
              obs.unobserve(en.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
      );

      els.forEach((el) => obs.observe(el));
    },
  };

  /* ================================================================
     5. COUNTER ANIMATION
     ================================================================ */
  const Counter = {
    init() {
      const els = document.querySelectorAll('[data-count]');
      if (!els.length) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              this._run(en.target);
              obs.unobserve(en.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      els.forEach((el) => obs.observe(el));
    },

    _run(el) {
      const target   = parseInt(el.getAttribute('data-count'), 10);
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start    = performance.now();

      const step = (now) => {
        const p       = Math.min((now - start) / duration, 1);
        const eased   = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    },
  };

  /* ================================================================
     6. BAR CHART FILL ANIMATION
     ================================================================ */
  const BarCharts = {
    init() {
      const bars = document.querySelectorAll('.bar-fill');
      if (!bars.length) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.style.width = en.target.getAttribute('data-width') + '%';
              obs.unobserve(en.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      bars.forEach((b) => obs.observe(b));
    },
  };

  /* ================================================================
     7. TESTIMONIALS CAROUSEL
     ================================================================ */
  const Carousel = {
    idx: 0,
    timer: null,

    init() {
      const track   = document.querySelector('.testi-track');
      const dots    = document.querySelectorAll('.dot');
      const prevBtn = document.querySelector('.testi-btn.prev');
      const nextBtn = document.querySelector('.testi-btn.next');
      if (!track) return;

      const cards = track.querySelectorAll('.testi-card');
      const perView = () => (window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3);

      const goTo = (i) => {
        const pv    = perView();
        const max   = Math.max(0, Math.ceil(cards.length / pv) - 1);
        this.idx    = Math.max(0, Math.min(i, max));
        const w     = cards[0].getBoundingClientRect().width + 24; // gap
        track.style.transform = `translateX(-${this.idx * pv * w}px)`;
        dots.forEach((d, j) => d.classList.toggle('active', j === this.idx));
      };

      if (prevBtn) prevBtn.addEventListener('click', () => { this._reset(); goTo(this.idx - 1); });
      if (nextBtn) nextBtn.addEventListener('click', () => { this._reset(); goTo(this.idx + 1); });
      dots.forEach((d, j) => d.addEventListener('click', () => { this._reset(); goTo(j); }));

      // Auto-play
      this.timer = setInterval(() => {
        const pv  = perView();
        const max = Math.max(0, Math.ceil(cards.length / pv) - 1);
        goTo(this.idx >= max ? 0 : this.idx + 1);
      }, 4500);

      // Touch swipe
      let tx = 0;
      track.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', (e) => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { this._reset(); goTo(this.idx + (diff > 0 ? 1 : -1)); }
      });

      window.addEventListener('resize', () => goTo(0));
      goTo(0);
    },

    _reset() {
      clearInterval(this.timer);
    },
  };

  /* ================================================================
     8. TV PANEL — featured review
     ================================================================ */
  const TVPanel = {
    _idx: 0,
    _timer: null,

    init() {
      const cards = document.querySelectorAll('.tv-strip .rcard');
      if (!cards.length) return;

      // Load first card on init
      this._activate(cards, 0);

      // Click handler per card
      cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.rp')) return;
          this._activate(cards, i);
        });
      });

      // Arrow buttons
      document.getElementById('tvStripPrev')?.addEventListener('click', () => {
        this._activate(cards, (this._idx - 1 + cards.length) % cards.length);
      });
      document.getElementById('tvStripNext')?.addEventListener('click', () => {
        this._activate(cards, (this._idx + 1) % cards.length);
      });

      // Auto-advance: 20s on mobile, 60s on desktop
      const advanceMs = window.matchMedia('(max-width: 600px)').matches ? 20000 : 60000;
      this._timer = setInterval(() => {
        this._activate(cards, (this._idx + 1) % cards.length);
      }, advanceMs);
    },

    _activate(cards, idx) {
      this._idx = idx;
      cards.forEach((c) => c.classList.remove('tv-active'));
      const card = cards[idx];
      card.classList.add('tv-active');

      const wrap = card.closest('.tv-strip-wrap');
      if (wrap) {
        const scrollTarget = card.offsetLeft - (wrap.offsetWidth - card.offsetWidth) / 2;
        wrap.scrollTo({ left: scrollTarget, behavior: 'smooth' });
      }

      this._load(card);
    },

    _load(card) {
      const panel = document.getElementById('tvPanel');
      if (!panel) return;

      panel.style.opacity = '0';
      setTimeout(() => {
        // Stars
        const starsEl = card.querySelector('.rcard-stars');
        document.getElementById('tvStars').innerHTML = starsEl ? starsEl.innerHTML : '';

        // Service badge
        const svcEl = card.querySelector('.rcard-svc');
        document.getElementById('tvSvc').innerHTML = svcEl ? svcEl.innerHTML : '';

        // Full text (textContent bypasses CSS line-clamp)
        const txtEl = card.querySelector('.rcard-txt');
        document.getElementById('tvTxt').textContent = txtEl ? txtEl.textContent : '';

        // Avatar, name, date
        document.getElementById('tvAv').textContent  = card.querySelector('.rcard-av')?.textContent  || '';
        document.getElementById('tvNm').textContent  = card.querySelector('.rcard-nm')?.textContent  || '';
        document.getElementById('tvDt').textContent  = card.querySelector('.rcard-dt')?.textContent  || '';

        // Photos — build TV-sized copies
        const photosEl = document.getElementById('tvPhotos');
        photosEl.innerHTML = '';
        const rps = card.querySelectorAll('.rp:not(.rp-more)');
        const count = rps.length;
        const isMulti = count > 1;
        rps.forEach((rp) => {
          const colorClass = Array.from(rp.classList).find(c => c.startsWith('rp-') && c !== 'rp-more') || '';
          const div = document.createElement('div');
          div.className = 'tv-ph ' + colorClass;
          div.innerHTML = rp.innerHTML;
          const img = div.querySelector('img');
          if (img) {
            img.style.objectFit = isMulti ? 'cover' : 'contain';
            img.style.height = '100%';
            img.style.width = '100%';
          }
          div.addEventListener('click', () => PhotoLightbox.open(rp.className, rp.innerHTML));
          photosEl.appendChild(div);
        });
        photosEl.classList.toggle('tv-photos--multi', isMulti);
        if (isMulti) {
          const cols = Math.ceil(Math.sqrt(count));
          const rows = Math.ceil(count / cols);
          const gap = count > 16 ? 2 : 4;
          photosEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
          photosEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
          photosEl.style.gap = `${gap}px`;
        } else {
          photosEl.style.gridTemplateColumns = '';
          photosEl.style.gridTemplateRows = '';
          photosEl.style.gap = '';
        }

        panel.style.opacity = '1';
      }, 160);
    },
  };

  /* ================================================================
     8b. PHOTO LIGHTBOX
     ================================================================ */
  const PhotoLightbox = {
    init() {
      const lb       = document.getElementById('photoLb');
      const closeBtn = document.getElementById('photoLbClose');
      if (!lb) return;

      // Open on .rp click in review cards
      document.addEventListener('click', (e) => {
        const rp = e.target.closest('.rp:not(.rp-more)');
        if (!rp) return;
        e.stopPropagation();
        this.open(rp.className, rp.innerHTML);
      });

      closeBtn.addEventListener('click', () => this._close());
      lb.addEventListener('click', (e) => { if (e.target === lb) this._close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._close(); });
    },

    open(className, innerHTML) {
      const lb    = document.getElementById('photoLb');
      const inner = document.getElementById('photoLbInner');
      const colorClass = className.split(' ').find(c => c.startsWith('rp-') && c !== 'rp-more') || '';
      inner.className  = 'photo-lb-inner ' + colorClass;
      inner.innerHTML  = innerHTML;
      const icon = inner.querySelector('i');
      if (icon) icon.style.fontSize = '5rem';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    _close() {
      document.getElementById('photoLb').classList.remove('open');
      document.body.style.overflow = '';
    },
  };

  /* ================================================================
     10. PAGE LOADER
     ================================================================ */
  const PageLoader = {
    el: null,

    init() {
      this.el = document.getElementById('page-loader');
      if (!this.el) return;

      if (document.readyState === 'complete') {
        this._hide();
      } else {
        window.addEventListener('load', () => this._hide());
      }
      setTimeout(() => this._hide(), 3500);

      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href]');
        if (!a || a.target === '_blank') return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/.test(href)) return;
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) return;
          if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        } catch (_) { return; }
        e.preventDefault();
        this._show(() => { window.location.href = a.href; });
      });

      window.addEventListener('pageshow', (e) => {
        if (e.persisted) this._hide();
      });
    },

    _show(cb) {
      if (!this.el) { if (cb) cb(); return; }
      this.el.classList.remove('loader-hidden');
      if (cb) setTimeout(cb, 500);
    },

    _hide() {
      if (!this.el) return;
      this.el.classList.add('loader-hidden');
    },
  };

  /* ================================================================
     9. SMOOTH SCROLL FOR HASH LINKS
     ================================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* ================================================================
     9. INIT
     ================================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    PageLoader.init();
    Navbar.init();
    MobileMenu.init();
    Reveal.init();
    Counter.init();
    BarCharts.init();
    Carousel.init();
    TVPanel.init();
    PhotoLightbox.init();
    initSmoothScroll();

    document.querySelectorAll('.theme-btn').forEach((b) =>
      b.addEventListener('click', () => Theme.toggle())
    );
  });
})();
