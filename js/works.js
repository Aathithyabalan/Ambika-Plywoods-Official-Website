/**
 * Ambika Playwoods — Works Page
 * Reads from localStorage (seeded from data/works.json on first load).
 * Builds the filter bar and work cards dynamically.
 */
(function () {
  'use strict';

  const STORAGE_KEY   = 'ambika-works-data';
  const JSON_PATH     = 'data/works.json';
  const SETTINGS_KEY  = 'ambika-settings';
  const SETTINGS_PATH = 'data/settings.json';

  const CAT_ORDER  = ['shower','partition','door','decorative','railing','kitchen','hardware','furniture','upvc'];
  const CAT_LABELS = {
    shower:     'Shower & Enclosures',
    partition:  'Glass Partitions',
    door:       'Doors & Entrances',
    decorative: 'Decorative Glass',
    railing:    'Balcony & Railings',
    kitchen:    'Modular Kitchen',
    hardware:   'Hardware & Displays',
    furniture:  'Furniture & Interiors',
    upvc:       'Windows & UPVC'
  };

  let allData      = { works: [] };
  let activeFilter = 'all';
  let waNumber     = '';

  var WA_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  /* ── Data ───────────────────────────────────────────────────────── */
  async function loadData() {
    try {
      const res   = await fetch(JSON_PATH);
      if (!res.ok) throw new Error('fetch failed');
      const fresh  = await res.json();
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const cached = JSON.parse(stored);
          if ((cached.version || 0) >= (fresh.version || 0)) {
            allData = cached;
            return;
          }
        } catch (_) {}
      }
      allData = fresh;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (_) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { try { allData = JSON.parse(stored); } catch (_) {} }
    }
  }

  /* ── Settings (WhatsApp number) ────────────────────────────────── */
  async function loadSettings() {
    try {
      var res   = await fetch(SETTINGS_PATH);
      if (!res.ok) throw new Error();
      var fresh  = await res.json();
      var stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          var cached = JSON.parse(stored);
          if ((cached.version || 0) >= (fresh.version || 0)) { waNumber = cached.whatsapp || ''; return; }
        } catch (_) {}
      }
      waNumber = fresh.whatsapp || '';
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(fresh));
    } catch (_) {
      var stored2 = localStorage.getItem(SETTINGS_KEY);
      if (stored2) { try { waNumber = JSON.parse(stored2).whatsapp || ''; } catch (_) {} }
    }
  }

  /* ── WhatsApp link ─────────────────────────────────────────────── */
  function waLink(w, catLabel) {
    var msg = 'Hi! I saw your work portfolio at Ambika Playwoods and I\'m interested:\n\n*Project:* ' + w.title + '\n*Category:* ' + catLabel + '\n\n' + (w.project || '') + '\n\nWould love to discuss something similar.';
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function getCounts() {
    const counts = { all: 0 };
    (allData.works || []).forEach(function (w) {
      counts.all++;
      counts[w.category] = (counts[w.category] || 0) + 1;
    });
    return counts;
  }

  /* ── Filter bar ─────────────────────────────────────────────────── */
  function buildFilterBar() {
    const counts  = getCounts();
    const ddList  = document.getElementById('wfDdList');
    const pillBar = document.getElementById('works-filter-pills');
    if (!ddList || !pillBar) return;

    const usedCats = CAT_ORDER.filter(function (c) { return counts[c]; });

    ddList.innerHTML =
      '<li class="wf-dd-opt' + (activeFilter === 'all' ? ' active' : '') + '" data-val="all" data-label="All" role="option" aria-selected="' + (activeFilter === 'all') + '">' +
        'All <span class="wf-dd-opt-count">' + counts.all + '</span>' +
      '</li>' +
      '<div class="wf-dd-divider"></div>' +
      usedCats.map(function (cat) {
        var label = CAT_LABELS[cat] || cat;
        var active = activeFilter === cat;
        return '<li class="wf-dd-opt' + (active ? ' active' : '') + '" data-val="' + esc(cat) + '" data-label="' + esc(label) + '" role="option" aria-selected="' + active + '">' +
          esc(label) + ' <span class="wf-dd-opt-count">' + (counts[cat] || 0) + '</span>' +
        '</li>';
      }).join('');

    pillBar.innerHTML =
      '<button class="wf-btn' + (activeFilter === 'all' ? ' active' : '') + '" data-filter="all">All <span class="wf-count">' + counts.all + '</span></button>' +
      usedCats.map(function (cat) {
        var label = CAT_LABELS[cat] || cat;
        return '<button class="wf-btn' + (activeFilter === cat ? ' active' : '') + '" data-filter="' + esc(cat) + '">' + esc(label) + ' <span class="wf-count">' + (counts[cat] || 0) + '</span></button>';
      }).join('');

    pillBar.querySelectorAll('.wf-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilter(btn.dataset.filter); });
    });

    ddList.querySelectorAll('.wf-dd-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        applyFilter(opt.dataset.val);
        closeDropdown();
      });
    });
  }

  /* ── Apply filter ───────────────────────────────────────────────── */
  function applyFilter(f) {
    activeFilter = f;

    document.querySelectorAll('.wf-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === f);
    });

    document.querySelectorAll('.wf-dd-opt').forEach(function (o) {
      var match = o.dataset.val === f;
      o.classList.toggle('active', match);
      o.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    var chosen    = document.querySelector('.wf-dd-opt[data-val="' + f + '"]');
    var wfDdLabel = document.getElementById('wfDdLabel');
    if (chosen && wfDdLabel) wfDdLabel.textContent = chosen.dataset.label || f;

    document.querySelectorAll('.work-card').forEach(function (c) {
      c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f);
    });
  }

  /* ── Render grid ────────────────────────────────────────────────── */
  function renderGrid() {
    const grid = document.getElementById('worksGrid');
    if (!grid) return;
    const works = allData.works || [];

    var heroCountEl = document.getElementById('works-hero-count');
    if (heroCountEl) heroCountEl.textContent = works.length;

    grid.innerHTML = works.map(function (w, idx) {
      var num      = w.num || String(idx + 1).padStart(2, '0');
      var catLabel = w.categoryLabel || CAT_LABELS[w.category] || w.category;

      return (
        '<article class="work-card" data-cat="' + esc(w.category) + '">' +
          '<div class="work-img-wrap">' +
            (w.image
              ? '<img src="' + esc(w.image) + '" alt="' + esc(w.imageAlt || w.title) + '" loading="lazy" decoding="async" />'
              : '<div class="img-ph" role="img" aria-label="' + esc(w.title) + '"><i class="ri-image-2-line"></i></div>') +
            '<span class="work-num" aria-hidden="true">' + esc(num) + '</span>' +
            '<span class="work-cat" aria-hidden="true">' + esc(catLabel) + '</span>' +
            (w.overlayText
              ? '<div class="work-overlay" aria-hidden="true"><div class="work-ovr-body"><div class="work-ovr-lbl">What We Did</div><p class="work-ovr-txt">' + esc(w.overlayText) + '</p></div></div>'
              : '') +
          '</div>' +
          '<div class="work-body">' +
            '<h2 class="work-title">' + esc(w.title) + '</h2>' +
            '<div>' +
              '<div class="work-micro-lbl work-micro-lbl--muted">The Project</div>' +
              '<p class="work-brief">' + esc(w.project) + '</p>' +
            '</div>' +
            '<div class="work-hr"></div>' +
            '<div>' +
              '<div class="work-micro-lbl work-micro-lbl--acc">What We Did</div>' +
              '<p class="work-did">' + esc(w.did) + '</p>' +
            '</div>' +
            '<div class="work-foot">' +
              '<button class="work-lb-btn" data-lb="' + esc(w.image || '') + '" aria-label="View full image for ' + esc(w.title) + '">' +
                '<i class="ri-zoom-in-line" aria-hidden="true"></i>View Full Image' +
              '</button>' +
              (waNumber
                ? '<a href="' + waLink(w, catLabel) + '" target="_blank" rel="noopener noreferrer"' +
                     ' class="btn btn-wa btn-sm" aria-label="Enquire about ' + esc(w.title) + ' on WhatsApp">' +
                    WA_ICON + 'Enquiry on WhatsApp' +
                  '</a>'
                : '') +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    bindLightbox();
    applyFilter(activeFilter);
  }

  /* ── Lightbox ───────────────────────────────────────────────────── */
  function bindLightbox() {
    var lb      = document.getElementById('photoLb');
    var lbInner = document.getElementById('photoLbInner');
    if (!lb || !lbInner) return;

    document.querySelectorAll('.work-lb-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.dataset.lb;
        if (!src) return;
        lbInner.innerHTML = '<img src="' + src + '" alt="Project image enlarged" style="max-width:100%;max-height:88vh;border-radius:var(--r);display:block;">';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* ── Dropdown toggle ────────────────────────────────────────────── */
  function closeDropdown() {
    var el  = document.getElementById('wfDropdown');
    var btn = document.getElementById('wfDdTrigger');
    if (el)  el.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function initDropdown() {
    var dropdown = document.getElementById('wfDropdown');
    var trigger  = document.getElementById('wfDdTrigger');
    if (!dropdown || !trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', closeDropdown);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  async function init() {
    await Promise.all([loadData(), loadSettings()]);
    buildFilterBar();
    renderGrid();
    initDropdown();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
