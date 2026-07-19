/**
 * Ambika Playwoods — Services Page
 * Reads from localStorage (seeded from data/services.json on first load).
 */
(function () {
  'use strict';

  const STORAGE_KEY   = 'ambika-services-data';
  const JSON_PATH     = 'data/services.json';
  const SETTINGS_KEY  = 'ambika-settings';
  const SETTINGS_PATH = 'data/settings.json';

  let allData  = { services: [] };
  let waNumber = '';

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
  function waLink(s) {
    var msg = 'Hi! I\'d like to enquire about this service from Ambika Playwoods:\n\n*Service:* ' + s.title + '\n' + (s.description || '') + '\n\nPlease get in touch.';
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    const services = allData.services || [];
    if (!services.length) { grid.innerHTML = ''; return; }

    grid.innerHTML = services.map(function (s, i) {
      var idSlug = s.id || ('svc-' + (i + 1));
      var iconClass = esc(s.icon || 'ri-service-line');
      return (
        '<article class="sfc" role="listitem" aria-labelledby="' + esc(idSlug) + '">' +
          '<div class="sfc-img">' +
            (s.image
              ? '<img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt || s.title) + '" loading="lazy" decoding="async" />'
              : '<div class="img-ph" role="img" aria-label="' + esc(s.title) + '"><i class="' + iconClass + '"></i></div>') +
          '</div>' +
          '<div class="sfc-body">' +
            '<div class="sfc-icon" aria-hidden="true"><i class="' + iconClass + '"></i></div>' +
            '<h3 id="' + esc(idSlug) + '" class="sfc-title">' + esc(s.title) + '</h3>' +
            '<p class="sfc-desc">' + esc(s.description) + '</p>' +
          '</div>' +
          (waNumber
            ? '<div class="sfc-foot">' +
                '<a href="' + waLink(s) + '" target="_blank" rel="noopener noreferrer"' +
                   ' class="btn btn-wa" style="width:100%;justify-content:center;"' +
                   ' aria-label="Enquire about ' + esc(s.title) + ' on WhatsApp">' +
                  WA_ICON + 'Enquiry on WhatsApp' +
                '</a>' +
              '</div>'
            : '') +
        '</article>'
      );
    }).join('');
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  async function init() {
    await Promise.all([loadData(), loadSettings()]);
    renderServices();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
