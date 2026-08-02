/* =========================================================
   NOVARA — ui.js
   Shared chrome: icons, toast, drawers, quick view modal.
   Used identically on every page.
   ========================================================= */

const ICONS = {
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 5.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 19.4l8.8-8.9c1.9-1.9 1.9-5 0-6.9z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.2 11.2a2 2 0 002 1.8h7.7a2 2 0 002-1.6L21 8H6"/></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v18M16 3v18M4 8h8M12 16h8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.94L2 22l5.32-1.39a9.9 9.9 0 004.72 1.2h.01c5.46 0 9.9-4.44 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.96 1.38-.5.08-1.14.11-1.83-.11a16.7 16.7 0 01-1.6-.6c-2.83-1.22-4.67-4.07-4.81-4.25-.14-.19-1.15-1.53-1.15-2.92s.72-2.07.98-2.35c.25-.28.55-.35.74-.35h.53c.17 0 .4-.03.62.48.24.55.8 1.94.87 2.08.07.14.11.31.02.5-.08.19-.13.3-.26.46-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.15.28.68 1.13 1.47 1.84 1.02.9 1.87 1.19 2.15 1.32.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.66-.17 1.34z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h13v10H1zM14 10h4l4 4v3h-8z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
};

const WA_NUMBER = '255700000000';
function waLink(p) {
  const msg = `Hello NOVARA! I'd like to order the *${p.brand} ${p.name}* (${p.storage}, ${p.ram} RAM) listed at ${formatTZS(p.price)}. Is it available?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function updateBadges() {
  document.querySelectorAll('.js-cart-count').forEach(el => el.textContent = Store.cartCount());
  document.querySelectorAll('.js-wishlist-count').forEach(el => el.textContent = Store.wishlist.length);
  document.querySelectorAll('.js-compare-count').forEach(el => el.textContent = Store.compareList.length);
}
Store.onChange(updateBadges);

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `${ICONS.check}<span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

function addToCart(id) {
  const p = findPhone(id);
  Store.addToCart(id);
  renderCart();
  showToast(`${p.name} added to cart`);
}
function toggleWishlist(id) {
  const p = findPhone(id);
  const added = Store.toggleWishlist(id);
  showToast(added ? `${p.name} added to wishlist` : 'Removed from wishlist');
  if (typeof renderProducts === 'function') renderProducts();
  renderWishlist();
}
function toggleCompare(id) {
  const result = Store.toggleCompare(id);
  if (result === 'full') { showToast('Compare up to 3 devices at once'); return; }
  if (typeof renderProducts === 'function') renderProducts();
  renderCompareDrawer();
}
function removeFromCart(id) { Store.removeFromCart(id); renderCart(); }
function changeQty(id, delta) { Store.changeQty(id, delta); renderCart(); }

/* ============ QUICK VIEW MODAL ============ */
function openQuickView(id) {
  const p = findPhone(id);
  const qvOverlay = document.getElementById('quickViewModal');
  if (!p || !qvOverlay) return;
  const disc = discountPct(p.price, p.oldPrice);
  qvOverlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-label="${p.name} quick view">
      <button class="modal-close" onclick="closeQuickView()" aria-label="Close quick view">${ICONS.close}</button>
      <div class="modal-media"><img src="${p.images[0]}" alt="${p.brand} ${p.name}" width="220" height="440"></div>
      <div class="modal-info">
        <span class="card-brand">${p.brand}</span>
        <h3 style="font-size:26px;margin-top:6px;">${p.name}</h3>
        <p style="color:var(--sage);margin-top:8px;">${p.tagline}</p>
        <div class="card-price-row" style="border:none;padding-top:20px;">
          <div><span class="price-now" style="font-size:24px;">${formatTZS(p.price)}</span>${p.oldPrice ? `<span class="price-old">${formatTZS(p.oldPrice)}</span>` : ''}</div>
          ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
        </div>
        <div class="color-row">${p.colors.map((c, i) => `<span class="color-dot ${i === 0 ? 'active' : ''}" style="background:${c}" onclick="this.parentElement.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));this.classList.add('active');this.closest('.modal-box').querySelector('.modal-media img').src='${p.images[i]}'" role="button" aria-label="Select color"></span>`).join('')}</div>
        <div class="spec-list">
          <div>Display <b>${p.display.split(',')[0]}</b></div>
          <div>RAM <b>${p.ram}</b></div>
          <div>Storage <b>${p.storage}</b></div>
          <div>Battery <b>${p.battery}</b></div>
          <div>Camera <b>${p.camera}</b></div>
          <div>Chipset <b>${p.processor}</b></div>
        </div>
        <div class="card-actions" style="margin-top:24px;">
          <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
          <a class="btn btn-wa" href="${waLink(p)}" target="_blank" rel="noopener">${ICONS.wa} Order via WhatsApp</a>
        </div>
        <a href="product.html?id=${p.id}" style="display:block;margin-top:16px;color:var(--emerald-300);font-size:13.5px;">View full specifications →</a>
      </div>
    </div>`;
  qvOverlay.classList.add('open');
}
function closeQuickView() { document.getElementById('quickViewModal')?.classList.remove('open'); }
document.addEventListener('click', (e) => {
  const qv = document.getElementById('quickViewModal');
  if (qv && e.target === qv) closeQuickView();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuickView(); });

/* ============ DRAWERS ============ */
function openDrawer(id) { document.getElementById(id)?.classList.add('open'); document.getElementById('drawerOverlay')?.classList.add('open'); }
function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
  document.getElementById('drawerOverlay')?.classList.remove('open');
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;
  if (!Store.cart.length) {
    body.innerHTML = `<div class="drawer-empty">Your cart is empty.<br>Browse the catalog to add a device.</div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  let total = 0;
  body.innerHTML = Store.cart.map(item => {
    const p = findPhone(item.id);
    if (!p) return '';
    total += p.price * item.qty;
    return `
    <div class="cart-item">
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <div class="ci-info">
        <h5>${p.name}</h5>
        <span>${formatTZS(p.price)}</span>
        <div class="qty-row">
          <button onclick="changeQty('${p.id}',-1)" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${p.id}',1)" aria-label="Increase quantity">+</button>
          <span class="remove-x" onclick="removeFromCart('${p.id}')" style="cursor:pointer" role="button">Remove</span>
        </div>
      </div>
    </div>`;
  }).join('');
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = formatTZS(total);
}

function renderWishlist() {
  const body = document.getElementById('wishlistBody');
  if (!body) return;
  if (!Store.wishlist.length) { body.innerHTML = `<div class="drawer-empty">No saved devices yet.<br>Tap the heart icon on any product.</div>`; return; }
  body.innerHTML = Store.wishlist.map(id => {
    const p = findPhone(id);
    if (!p) return '';
    return `
    <div class="cart-item">
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <div class="ci-info">
        <h5>${p.name}</h5><span>${formatTZS(p.price)}</span>
        <div class="qty-row">
          <button class="btn btn-sm btn-ghost" onclick="addToCart('${p.id}')">Add to Cart</button>
          <span class="remove-x" onclick="toggleWishlist('${p.id}')" style="cursor:pointer" role="button">Remove</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCompareDrawer() {
  const body = document.getElementById('compareBody');
  if (!body) return;
  if (!Store.compareList.length) { body.innerHTML = `<div class="drawer-empty">Select up to 3 devices to compare specs side-by-side.</div>`; return; }
  const items = Store.compareList.map(id => findPhone(id)).filter(Boolean);
  const rows = ['display', 'ram', 'storage', 'battery', 'camera', 'processor'];
  const labels = { display: 'Display', ram: 'RAM', storage: 'Storage', battery: 'Battery', camera: 'Camera', processor: 'Chipset' };
  const compareHref = 'compare.html?ids=' + Store.compareList.join(',');
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:12px;margin-bottom:20px;">
      ${items.map(p => `<div style="text-align:center;"><div style="background:var(--obsidian-3);border-radius:12px;padding:10px;"><img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:auto;"></div><b style="font-size:12.5px;display:block;margin-top:8px;">${p.name}</b><span class="remove-x" style="cursor:pointer" onclick="toggleCompare('${p.id}')" role="button">Remove</span></div>`).join('')}
    </div>
    ${rows.map(r => `
      <div style="margin-bottom:12px;">
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--sage-dim);text-transform:uppercase;">${labels[r]}</span>
        <div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:12px;margin-top:4px;">
          ${items.map(p => `<div style="font-size:13px;color:var(--ivory);">${p[r]}</div>`).join('')}
        </div>
      </div>`).join('')}
    ${items.length >= 2 ? `<a href="${compareHref}" class="btn btn-primary btn-block" style="margin-top:12px;">Open Full Comparison Studio</a>` : `<p style="font-size:12.5px;color:var(--sage-dim);margin-top:12px;">Add one more device to unlock the full Comparison Studio.</p>`}
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawers);
  document.querySelectorAll('[data-open-drawer]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openDrawer(btn.dataset.openDrawer); }));
  document.querySelectorAll('.drawer-close').forEach(btn => btn.addEventListener('click', closeDrawers));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawers(); });
});

/* Shared FAQ accordion binder (used by index.html + product.html) */
function bindFaqAccordion(root = document) {
  root.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || q._bound) return;
    q._bound = true;
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
  });
}
