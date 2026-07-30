/* ============ ICONS (inline, no external icon fonts) ============ */
const ICONS = {
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 5.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 19.4l8.8-8.9c1.9-1.9 1.9-5 0-6.9z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.2 11.2a2 2 0 002 1.8h7.7a2 2 0 002-1.6L21 8H6"/></svg>`,
  compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v18M16 3v18M4 8h8M12 16h8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.94L2 22l5.32-1.39a9.9 9.9 0 004.72 1.2h.01c5.46 0 9.9-4.44 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.96 1.38-.5.08-1.14.11-1.83-.11a16.7 16.7 0 01-1.6-.6c-2.83-1.22-4.67-4.07-4.81-4.25-.14-.19-1.15-1.53-1.15-2.92s.72-2.07.98-2.35c.25-.28.55-.35.74-.35h.53c.17 0 .4-.03.62.48.24.55.8 1.94.87 2.08.07.14.11.31.02.5-.08.19-.13.3-.26.46-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.15.28.68 1.13 1.47 1.84 1.02.9 1.87 1.19 2.15 1.32.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.66-.17 1.34z"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M5 7l-3 8a4 4 0 008 0l-3-8M19 7l-3 8a4 4 0 008 0l-3-8M5 7h14"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h13v10H1zM14 10h4l4 4v3h-8z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>`,
};

/* ============ LOADER ============ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader && loader.classList.add('hide'), 700);
});

/* ============ NAV SCROLL ============ */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============ MOBILE MENU ============ */
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
burger?.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileMenuClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => revealObserver.observe(el));

/* ============ ANIMATED COUNTERS ============ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString() + suffix; return; }
      el.textContent = cur.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ============ STATE: CART / WISHLIST / COMPARE ============ */
const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};
let cart = Store.get('novara_cart');
let wishlist = Store.get('novara_wishlist');
let compareList = Store.get('novara_compare');

function saveState() {
  Store.set('novara_cart', cart);
  Store.set('novara_wishlist', wishlist);
  Store.set('novara_compare', compareList);
  updateBadges();
}
function updateBadges() {
  document.querySelectorAll('.js-cart-count').forEach(el => el.textContent = cart.reduce((a, c) => a + c.qty, 0));
  document.querySelectorAll('.js-wishlist-count').forEach(el => el.textContent = wishlist.length);
  document.querySelectorAll('.js-compare-count').forEach(el => el.textContent = compareList.length);
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${ICONS.check}<span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++; else cart.push({ id, qty: 1 });
  saveState(); renderCart();
  showToast(`${p.name} added to cart`);
}
function toggleWishlist(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const idx = wishlist.indexOf(id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast(`Removed from wishlist`); }
  else { wishlist.push(id); showToast(`${p.name} added to wishlist`); }
  saveState(); renderProducts(); renderWishlist();
}
function toggleCompare(id) {
  const idx = compareList.indexOf(id);
  if (idx > -1) { compareList.splice(idx, 1); }
  else {
    if (compareList.length >= 3) { showToast('Compare up to 3 devices at once'); return; }
    compareList.push(id);
  }
  saveState(); renderProducts(); renderCompare();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveState(); renderCart();
}
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveState(); renderCart();
}

/* ============ RENDER: PRODUCT CARD ============ */
function statusTag(status) {
  const map = {
    best: '🔥 Best Seller', new: '🆕 New Arrival', limited: '⚡ Limited Stock',
    popular: '⭐ Most Popular', deal: '🎁 Special Offer'
  };
  return status.map(s => `<span class="tag ${s}">${map[s]}</span>`).join('');
}

function productCard(p) {
  const disc = discountPct(p.price, p.oldPrice);
  const isWish = wishlist.includes(p.id);
  const isCompare = compareList.includes(p.id);
  return `
  <article class="product-card" data-reveal>
    <div class="badges">${statusTag(p.status)}</div>
    <button class="fav-btn ${isWish ? 'active' : ''}" onclick="toggleWishlist('${p.id}')" aria-label="Add to wishlist">${ICONS.heart}</button>
    <div class="card-media">
      ${phoneSVG(p.brandKey, p.colors[0])}
      <button class="qv-btn" onclick="openQuickView('${p.id}')">Quick View</button>
    </div>
    <span class="card-brand">${p.brand}</span>
    <h3 class="card-title">${p.name}</h3>
    <div class="card-specs">
      <span>${p.storage}</span><span>${p.ram} RAM</span><span>${p.camera.split(' ')[0]} Cam</span>
    </div>
    <div class="card-rating"><span class="stars">★★★★★</span> ${p.rating} <span style="color:var(--sage-dim)">(${p.reviews})</span></div>
    <div class="card-price-row">
      <div><span class="price-now">${formatTZS(p.price)}</span>${p.oldPrice ? `<span class="price-old">${formatTZS(p.oldPrice)}</span>` : ''}</div>
      ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
    </div>
    <div class="stock-line"><span>${p.stockLeft} left in stock</span><span>${p.stockPercent}%</span></div>
    <div class="stock-bar"><i style="width:${p.stockPercent}%"></i></div>
    <div class="card-actions">
      <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
      <button class="icon-square ${isCompare ? 'active' : ''}" onclick="toggleCompare('${p.id}')" title="Compare">${ICONS.compare}</button>
    </div>
  </article>`;
}

/* ============ FILTER / SORT / SEARCH ============ */
const grid = document.getElementById('productGrid');
let activeFilter = 'all';
let searchTerm = '';
let sortMode = 'featured';

function renderProducts() {
  if (!grid) return;
  let list = [...PRODUCTS];
  if (activeFilter !== 'all') {
    if (activeFilter === '5g') list = list.filter(p => p.fiveG);
    else if (activeFilter === 'dualsim') list = list.filter(p => p.dualSim);
    else list = list.filter(p => p.category === activeFilter || p.status.includes(activeFilter));
  }
  if (searchTerm) {
    const t = searchTerm.toLowerCase();
    list = list.filter(p => (p.brand + ' ' + p.name).toLowerCase().includes(t));
  }
  if (sortMode === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (sortMode === 'price-high') list.sort((a, b) => b.price - a.price);
  else if (sortMode === 'rating') list.sort((a, b) => b.rating - a.rating);

  grid.innerHTML = list.length ? list.map(productCard).join('') : `<div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--sage)">No devices match your filters. Try clearing search.</div>`;
  // Cards are injected after the page's IntersectionObserver has already run its initial pass,
  // so reveal them directly rather than leaving them permanently invisible.
  grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in-view'));
}

document.querySelectorAll('.pill[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});
document.querySelectorAll('.chk input').forEach(chk => {
  chk.addEventListener('change', () => {
    activeFilter = chk.checked ? chk.value : 'all';
    document.querySelectorAll('.chk input').forEach(c => { if (c !== chk) c.checked = false; });
    document.querySelectorAll('.pill[data-filter]').forEach(b => b.classList.remove('active'));
    renderProducts();
  });
});
document.getElementById('productSearch')?.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProducts();
});
document.getElementById('sortSelect')?.addEventListener('change', (e) => {
  sortMode = e.target.value;
  renderProducts();
});

/* ============ QUICK VIEW MODAL ============ */
const qvOverlay = document.getElementById('quickViewModal');
function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || !qvOverlay) return;
  const disc = discountPct(p.price, p.oldPrice);
  qvOverlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="closeQuickView()">✕</button>
      <div class="modal-media">${phoneSVG(p.brandKey, p.colors[0])}</div>
      <div class="modal-info">
        <span class="card-brand">${p.brand}</span>
        <h3 style="font-size:26px;margin-top:6px;">${p.name}</h3>
        <p style="color:var(--sage);margin-top:8px;">${p.tagline}</p>
        <div class="card-price-row" style="border:none;padding-top:20px;">
          <div><span class="price-now" style="font-size:24px;">${formatTZS(p.price)}</span>${p.oldPrice ? `<span class="price-old">${formatTZS(p.oldPrice)}</span>` : ''}</div>
          ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
        </div>
        <div class="color-row">${p.colors.map((c, i) => `<span class="color-dot ${i === 0 ? 'active' : ''}" style="background:${c}" onclick="this.parentElement.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));this.classList.add('active')"></span>`).join('')}</div>
        <div class="spec-list">
          <div>Display <b>${p.display.split(' ')[0]}</b></div>
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
function closeQuickView() { qvOverlay?.classList.remove('open'); }
qvOverlay?.addEventListener('click', (e) => { if (e.target === qvOverlay) closeQuickView(); });

/* ============ WHATSAPP ORDER LINK ============ */
const WA_NUMBER = '255700000000';
function waLink(p) {
  const msg = `Hello NOVARA! I'd like to order the *${p.brand} ${p.name}* (${p.storage}, ${p.ram} RAM) listed at ${formatTZS(p.price)}. Is it available?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* ============ DRAWERS: CART / WISHLIST / COMPARE ============ */
function openDrawer(id) { document.getElementById(id)?.classList.add('open'); document.getElementById('drawerOverlay')?.classList.add('open'); }
function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
  document.getElementById('drawerOverlay')?.classList.remove('open');
}
document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawers);
document.querySelectorAll('[data-open-drawer]').forEach(btn => btn.addEventListener('click', () => openDrawer(btn.dataset.openDrawer)));
document.querySelectorAll('.drawer-close').forEach(btn => btn.addEventListener('click', closeDrawers));

function renderCart() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;
  if (!cart.length) {
    body.innerHTML = `<div class="drawer-empty">Your cart is empty.<br>Browse the catalog to add a device.</div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  let total = 0;
  body.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    total += p.price * item.qty;
    return `
    <div class="cart-item">
      <img src="data:image/svg+xml;utf8,${encodeURIComponent(phoneSVG(p.brandKey, p.colors[0]))}" alt="${p.name}">
      <div class="ci-info">
        <h5>${p.name}</h5>
        <span>${formatTZS(p.price)}</span>
        <div class="qty-row">
          <button onclick="changeQty('${p.id}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${p.id}',1)">+</button>
          <span class="remove-x" onclick="removeFromCart('${p.id}')" style="cursor:pointer">Remove</span>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatTZS(total);
}

function renderWishlist() {
  const body = document.getElementById('wishlistBody');
  if (!body) return;
  if (!wishlist.length) { body.innerHTML = `<div class="drawer-empty">No saved devices yet.<br>Tap the heart icon on any product.</div>`; return; }
  body.innerHTML = wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
    <div class="cart-item">
      <img src="data:image/svg+xml;utf8,${encodeURIComponent(phoneSVG(p.brandKey, p.colors[0]))}" alt="${p.name}">
      <div class="ci-info">
        <h5>${p.name}</h5><span>${formatTZS(p.price)}</span>
        <div class="qty-row">
          <button class="btn btn-sm btn-ghost" onclick="addToCart('${p.id}')">Add to Cart</button>
          <span class="remove-x" onclick="toggleWishlist('${p.id}')" style="cursor:pointer">Remove</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCompare() {
  const body = document.getElementById('compareBody');
  if (!body) return;
  if (!compareList.length) { body.innerHTML = `<div class="drawer-empty">Select up to 3 devices to compare specs side-by-side.</div>`; return; }
  const items = compareList.map(id => PRODUCTS.find(x => x.id === id));
  const rows = ['display', 'ram', 'storage', 'battery', 'camera', 'processor'];
  const labels = { display: 'Display', ram: 'RAM', storage: 'Storage', battery: 'Battery', camera: 'Camera', processor: 'Chipset' };
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:12px;margin-bottom:20px;">
      ${items.map(p => `<div style="text-align:center;"><div style="background:var(--obsidian-3);border-radius:12px;padding:10px;">${phoneSVG(p.brandKey, p.colors[0])}</div><b style="font-size:12.5px;display:block;margin-top:8px;">${p.name}</b><span class="remove-x" style="cursor:pointer" onclick="toggleCompare('${p.id}')">Remove</span></div>`).join('')}
    </div>
    ${rows.map(r => `
      <div style="margin-bottom:12px;">
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--sage-dim);text-transform:uppercase;">${labels[r]}</span>
        <div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:12px;margin-top:4px;">
          ${items.map(p => `<div style="font-size:13px;color:var(--ivory);">${p[r]}</div>`).join('')}
        </div>
      </div>`).join('')}
  `;
}

/* ============ FAQ ACCORDION ============ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
    if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

/* ============ COUNTDOWN TIMER ============ */
function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let target = localStorage.getItem('novara_deal_end');
  if (!target || parseInt(target) < Date.now()) {
    target = Date.now() + 1000 * 60 * 60 * 30; // 30 hours from first visit
    localStorage.setItem('novara_deal_end', target);
  }
  target = parseInt(target);
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.querySelector('.h').textContent = String(h).padStart(2, '0');
    el.querySelector('.m').textContent = String(m).padStart(2, '0');
    el.querySelector('.s').textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}
startCountdown();

/* ============ NEWSLETTER ============ */
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('You are subscribed! Watch your inbox for exclusive drops.');
  e.target.reset();
});

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ============ INIT ============ */
renderProducts();
renderCart();
renderWishlist();
renderCompare();
updateBadges();
