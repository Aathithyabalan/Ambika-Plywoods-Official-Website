/**
 * Ambika Playwoods — Products Page
 * Reads from localStorage (seeded from data/products.json on first load).
 */
(function () {
  'use strict';

  const STORAGE_KEY    = 'ambika-products-data';
  const JSON_PATH      = 'data/products.json';
  const SETTINGS_KEY   = 'ambika-settings';
  const SETTINGS_PATH  = 'data/settings.json';
  const CATEGORIES  = ['All', 'Glass', 'Plywoods', 'Laminates & Mica', 'Doors', 'Hardware & Fittings', 'MDF & Boards', 'Wall Panels', 'UPVC', 'Specialty Products'];

  let allData  = { products: [], deal: { enabled: false } };
  let filters  = { category: 'All', status: 'all', sort: 'default', search: '' };
  let waNumber = '';

  const WA_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

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
      const res   = await fetch(SETTINGS_PATH);
      if (!res.ok) throw new Error();
      const fresh  = await res.json();
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          const cached = JSON.parse(stored);
          if ((cached.version || 0) >= (fresh.version || 0)) {
            waNumber = cached.whatsapp || '';
            return;
          }
        } catch (_) {}
      }
      waNumber = fresh.whatsapp || '';
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(fresh));
    } catch (_) {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) { try { waNumber = JSON.parse(stored).whatsapp || ''; } catch (_) {} }
    }
  }

  /* ── Filter + Sort ──────────────────────────────────────────────── */
  function getFiltered() {
    let list = [...(allData.products || [])];
    if (filters.category !== 'All') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.status !== 'all') {
      list = list.filter(p => p.status === filters.status);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (filters.sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (filters.sort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === 'discount')   list.sort((a, b) => b.discount - a.discount);
    return list;
  }

  /* ── Deal Banner ────────────────────────────────────────────────── */
  function renderDealBanner() {
    const el = document.getElementById('products-deal-banner');
    if (!el) return;
    const deal = allData.deal || {};
    if (!deal.enabled) { el.style.display = 'none'; return; }
    const expires = deal.expiresAt ? new Date(deal.expiresAt) : null;
    if (expires && new Date() > expires) { el.style.display = 'none'; return; }

    const product  = (allData.products || []).find(p => p.id === deal.productId);
    const label    = deal.type === 'month' ? 'Deal of the Month' : 'Deal of the Week';
    const expiryTxt = expires
      ? 'Expires ' + expires.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
      : '';

    let imgPanel = '', pricePanel = '';
    if (product) {
      imgPanel = `<div class="hpdeal-img-panel">${
        product.image
          ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`
          : '<i class="ri-image-line" aria-hidden="true"></i>'
      }</div>`;
      const discHtml = product.discount > 0
        ? `<span class="hpdeal-disc-num">${product.discount}%</span>
           <span class="hpdeal-disc-off">OFF</span>
           <span class="hpdeal-sep"></span>`
        : '';
      const origHtml = (product.originalPrice && product.originalPrice > product.price)
        ? `<span class="hpdeal-orig-price">₹${Number(product.originalPrice).toLocaleString('en-IN')}</span>`
        : '';
      pricePanel = `<div class="hpdeal-price-panel">
        ${discHtml}${origHtml}
        <span class="hpdeal-new-price">₹${Number(product.price).toLocaleString('en-IN')}</span>
        <span class="hpdeal-unit-tag">/ ${esc(product.unit)}</span>
      </div>`;
    }

    el.style.display = '';
    el.innerHTML = `
      <div class="container">
        <div class="hpdeal-toprow">
          <span class="hpdeal-badge"><i class="ri-flashlight-line" aria-hidden="true"></i>${label}</span>
          ${expiryTxt ? `<p class="hpdeal-expires"><i class="ri-time-line" aria-hidden="true"></i>${expiryTxt}</p>` : ''}
        </div>
        <div class="hpdeal-card">
          <div class="hpdeal-left">
            <h2 id="hpdeal-title">${esc(deal.headline)}</h2>
            <p class="hpdeal-sub">${esc(deal.subheadline)}</p>
            <div class="hpdeal-actions">
              <a href="contact.html" class="hpdeal-btn-primary"><i class="ri-message-2-line" aria-hidden="true"></i>Get a Quote</a>
              <a href="contact.html" class="hpdeal-btn-outline"><i class="ri-phone-line" aria-hidden="true"></i>Call Us</a>
            </div>
          </div>
          ${imgPanel}
          ${pricePanel}
        </div>
      </div>`;
  }

  /* ── Category Pill Filters ──────────────────────────────────────── */
  function renderCatPills() {
    const wrap = document.getElementById('filter-cats');
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(cat => `
      <button class="cat-pill${cat === filters.category ? ' active' : ''}"
              data-cat="${escAttr(cat)}" aria-pressed="${cat === filters.category}">
        ${esc(cat)}
      </button>`).join('');

    wrap.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.category = btn.dataset.cat;
        wrap.querySelectorAll('.cat-pill').forEach(b => {
          b.classList.toggle('active', b.dataset.cat === filters.category);
          b.setAttribute('aria-pressed', b.dataset.cat === filters.category);
        });
        renderGrid();
      });
    });
  }

  /* ── Products Grid ──────────────────────────────────────────────── */
  function renderGrid() {
    const grid  = document.getElementById('products-grid');
    const count = document.getElementById('products-count');
    if (!grid) return;
    const list = getFiltered();
    if (count) count.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="products-empty">
          <i class="ri-inbox-2-line" aria-hidden="true"></i>
          <p>No products match your filters.</p>
          <button class="btn btn-outline" id="clear-filters-btn">Clear Filters</button>
        </div>`;
      document.getElementById('clear-filters-btn')
        ?.addEventListener('click', clearFilters);
      return;
    }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  /* ── Card HTML ──────────────────────────────────────────────────── */
  const STATUS_CLASS = { available:'st-available', almost_sold_out:'st-almost', sold_out:'st-sold' };
  const STATUS_LABEL = { available:'Available', almost_sold_out:'Almost Sold Out', sold_out:'Sold Out' };

  function cardHTML(p) {
    const savings = p.originalPrice > p.price ? p.originalPrice - p.price : 0;
    const isSoldOut = p.status === 'sold_out';
    return `
      <article class="prod-card${isSoldOut ? ' prod-card--oos' : ''}" role="listitem">
        <div class="prod-img">
          ${p.image
            ? `<img src="${escAttr(p.image)}" alt="${escAttr(p.name)}" loading="lazy" decoding="async">`
            : `<div class="img-ph" role="img" aria-label="${escAttr(p.category)} product placeholder">
                 <i class="ri-image-2-line"></i><span>${esc(p.category)}</span>
               </div>`}
          <div class="prod-badges">
            ${p.discount > 0 ? `<span class="prod-badge prod-badge--disc">${p.discount}% OFF</span>` : ''}
            <span class="prod-badge ${STATUS_CLASS[p.status] || 'st-available'}">${STATUS_LABEL[p.status] || 'Available'}</span>
          </div>
        </div>
        <div class="prod-body">
          <span class="prod-cat">${esc(p.category)}</span>
          <h3 class="prod-name">${esc(p.name)}</h3>
          <p class="prod-desc">${esc(p.description)}</p>
          <div class="prod-pricing">
            ${p.originalPrice > p.price
              ? `<span class="prod-orig">₹${p.originalPrice.toLocaleString('en-IN')} / ${esc(p.unit)}</span>`
              : ''}
            <div class="prod-price-row">
              <span class="prod-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="prod-unit">/ ${esc(p.unit)}</span>
              ${p.discount > 0 ? `<span class="prod-disc-inline">${p.discount}% OFF</span>` : ''}
            </div>
          </div>
          ${savings > 0 ? `<p class="prod-savings"><i class="ri-arrow-down-line"></i>You save ₹${savings.toLocaleString('en-IN')}</p>` : ''}
          <div class="prod-actions">
            ${isSoldOut
              ? `<span class="btn btn-primary prod-btn disabled" aria-disabled="true" tabindex="-1">
                   <i class="ri-close-circle-line" aria-hidden="true"></i>Out of Stock
                 </span>`
              : waNumber
                ? `<a href="${waLink(p)}"
                     target="_blank" rel="noopener noreferrer"
                     class="btn btn-wa"
                     aria-label="Enquire about ${esc(p.name)} on WhatsApp">
                     ${WA_ICON}Enquiry on WhatsApp
                   </a>`
                : ''}
          </div>
        </div>
      </article>`;
  }

  /* ── WhatsApp link ─────────────────────────────────────────────── */
  function waLink(p) {
    const msg = `Hi! I'm interested in the following product from Ambika Playwoods:\n\n*Product:* ${p.name}\n*Category:* ${p.category}\n*Price:* ₹${p.price.toLocaleString('en-IN')} / ${p.unit}\n\n${p.description}\n\nPlease share more details.`;
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function escAttr(s) { return esc(s); }

  function clearFilters() {
    filters = { category:'All', status:'all', sort:'default', search:'' };
    const sf = document.getElementById('status-filter');
    const ss = document.getElementById('sort-select');
    const si = document.getElementById('search-input');
    if (sf) sf.value = 'all';
    if (ss) ss.value = 'default';
    if (si) si.value = '';
    renderCatPills();
    renderGrid();
  }

  /* ── Bind Events ────────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('status-filter')?.addEventListener('change', e => {
      filters.status = e.target.value; renderGrid();
    });
    document.getElementById('sort-select')?.addEventListener('change', e => {
      filters.sort = e.target.value; renderGrid();
    });
    let t;
    document.getElementById('search-input')?.addEventListener('input', e => {
      clearTimeout(t);
      t = setTimeout(() => { filters.search = e.target.value; renderGrid(); }, 250);
    });
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  async function init() {
    await Promise.all([loadData(), loadSettings()]);
    renderDealBanner();
    renderCatPills();
    renderGrid();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
